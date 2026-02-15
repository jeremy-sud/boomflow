import NextAuth from "next-auth";
import GitHub from "next-auth/providers/github";

export const { handlers, signIn, signOut, auth } = NextAuth({
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
    }),
  ],
  callbacks: {
    async jwt({ token, account, profile }) {
      // Guardar el username de GitHub en el token
      if (account && profile) {
        token.username = (profile as { login?: string }).login;
        token.id = profile.id as string;
      }
      return token;
    },
    async session({ session, token }) {
      // Exponer el username en la sesión
      if (session.user) {
        session.user.username = token.username as string;
        session.user.id = token.id as string;
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
    };
  }
}
