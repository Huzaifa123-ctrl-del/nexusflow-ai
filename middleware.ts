import { auth } from "@/auth"
export default auth((req) => {})
export const config = {
  matcher: ["/dashboard/:path*", "/admin/:path*"],
}