import NextAuth from "next-auth"
import { authConfig } from "./auth.config"
const { auth } = NextAuth(authConfig)

export default auth((req) => {
  const isLoggedIn =!!req.auth
  const isAuthPage = req.nextUrl.pathname.startsWith("/login")
  if (isAuthPage && isLoggedIn) {
    return Response.redirect(new URL("/dashboard", req.nextUrl))
  }
})

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
}