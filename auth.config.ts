import type { NextAuthConfig } from "next-auth";

export const authConfig = {
  trustHost: true,
  session: { strategy: "jwt" },
  pages: { signIn: "/login" },
  providers: [],
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isDashboard = nextUrl.pathname.startsWith("/dashboard") || nextUrl.pathname.startsWith("/admin");
      if (isDashboard) return!!auth?.user;
      return true;
    },
  },
} satisfies NextAuthConfig;