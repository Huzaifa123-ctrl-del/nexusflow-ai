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
