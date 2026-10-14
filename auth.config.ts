import type { NextAuthConfig } from "next-auth";

export const authConfig = {
  secret: process.env.NEXTAUTH_SECRET,
  trustHost: true,
  session: { strategy: "jwt" },
  pages: { signIn: "/login" },
  providers: [],
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const path = nextUrl.pathname;

      if (path.startsWith("/dashboard") || path.startsWith("/admin")) {
        return isLoggedIn;
      }
      return true;
    },
    async jwt({ token, user }) {
      if (user) {
        (token as any).id = (user as any).id;
        (token as any).role = (user as any).role;
        (token as any).orgId = (user as any).orgId;
        (token as any).plan = (user as any).plan;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        (session.user as any).id = token.id as string;
        (session.user as any).role = (token as any).role ?? "MEMBER";
        (session.user as any).orgId = (token as any).orgId ?? "";
        (session.user as any).plan = (token as any).plan ?? "free";
      }
      return session;
    },
  },
} satisfies NextAuthConfig;