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
          // Permisos para leer perfil y repos públicos
          scope: "read:user user:email",
        },
      },
      // Mapear datos de GitHub al modelo de User
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
    async session({ session, user }) {
      // Cargar datos completos del usuario desde Prisma
      if (user) {
        const dbUser = await prisma.user.findUnique({
          where: { id: user.id },
          include: {
            badges: { include: { badge: true } },
            organization: true,
            team: true,
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
      return session;
    },
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
  // Para desarrollo, permitir HTTP
  trustHost: true,
});

// Extender tipos de NextAuth
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
  }
}
