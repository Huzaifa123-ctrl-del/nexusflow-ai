import type { NextAuthConfig } from "next-auth";
export const authConfig = {
  secret: process.env.NEXTAUTH_SECRET,
  trustHost: true,
  session: { strategy: "jwt" },
  pages: { signIn: "/login" },
  providers: [],
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      return nextUrl.pathname.startsWith("/dashboard") || nextUrl.pathname.startsWith("/admin") ? !!auth?.user : true;
    },
    async jwt({ token, user }) {
      if (user) { (token as any).id = (user as any).id; (token as any).role = (user as any).role; }
      return token;
    },
    async session({ session, token }) {
      if (token) { (session.user as any).id = token.id as string; }
      return session;
    },
  },
} satisfies NextAuthConfig;