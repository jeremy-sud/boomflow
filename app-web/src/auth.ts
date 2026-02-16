import NextAuth from "next-auth";
import GitHub from "next-auth/providers/github";
import { PrismaAdapter } from "@auth/prisma-adapter";
import prisma from "@/lib/prisma";

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    GitHub({
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
      authorization: {
        params: {
          // Permissions to read profile, repos and activity
          scope: "read:user user:email repo",
        },
      },
      // Map GitHub data to User model
      profile(profile) {
        return {
          id: profile.id.toString(),
          email: profile.email,
          name: profile.name || profile.login,
          username: profile.login,
          image: profile.avatar_url,
          githubId: profile.id.toString(),
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, account }) {
      // Save GitHub access token in JWT
      if (account?.access_token) {
        token.accessToken = account.access_token
      }
      return token
    },
    async session({ session, user, token }) {
      // Load full user data from Prisma (single optimized query)
      if (user) {
        const dbUser = await prisma.user.findUnique({
          where: { id: user.id },
          select: {
            id: true,
            username: true,
            badges: {
              select: {
                badge: {
                  select: { id: true, name: true, slug: true }
                }
              }
            },
            organization: {
              select: { name: true }
            },
            team: {
              select: { name: true }
            },
          },
        });
        
        if (dbUser) {
          session.user.id = dbUser.id;
          session.user.username = dbUser.username;
          session.user.badges = dbUser.badges.map(ub => ({
            id: ub.badge.id,
            name: ub.badge.name,
            slug: ub.badge.slug,
          }));
          session.user.organization = dbUser.organization?.name;
          session.user.team = dbUser.team?.name;
        }
      }
      
      // Add access token to session
      if (token?.accessToken) {
        session.accessToken = token.accessToken as string
      }
      
      return session;
    },
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
  // For development, allow HTTP
  trustHost: true,
});

// Extend NextAuth types
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      username?: string;
      badges?: Array<{ id: string; name: string; slug: string }>;
      organization?: string;
      team?: string;
    };
    accessToken?: string;
  }
}
