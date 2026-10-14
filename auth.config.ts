import type { NextAuthConfig } from "next-auth";

export const authConfig = {
  secret: process.env.NEXTAUTH_SECRET,
  trustHost: true,
  session: { strategy: "jwt" },
  pages: { signIn: "/login" },
  providers: [],
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const user = auth?.user;
      const path = nextUrl.pathname;

      if (path.startsWith("/admin")) {
        if (!user) return false;
        if (user.role === "OWNER" || user.role === "ADMIN") return true;
        return Response.redirect(new URL("/dashboard", nextUrl));
      }
      if (path.startsWith("/dashboard")) return !!user;
      if ((path === "/login" || path === "/register") && user) {
        return Response.redirect(new URL("/dashboard", nextUrl));
      }
      return true;
    },
    session({ session, token }) {
      if (token.id) {
        session.user.id = token.id;
        session.user.role = token.role ?? "MEMBER";
        session.user.orgId = token.orgId ?? "";
        session.user.plan = token.plan ?? "free";
      }
      return session;
    },
  },
} satisfies NextAuthConfig;
