import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { authConfig } from "./auth.config";
import { connectDB } from "@/lib/db";
import { loginSchema } from "@/lib/validations";
import { createUserWithOrg } from "@/lib/users";
import { User } from "@/models/User";

export const { handlers, auth, signIn, signOut } = NextAuth({
 ...authConfig,
  secret: process.env.NEXTAUTH_SECRET,
  trustHost: true,
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    Credentials({
      credentials: { email: {}, password: {} },
      async authorize(raw) {
        const parsed = loginSchema.safeParse(raw);
        if (!parsed.success) return null;
        await connectDB();
        const user = await User.findOne({ email: parsed.data.email }).select("+passwordHash");
        if (!user?.passwordHash) return null;
        const valid = await bcrypt.compare(parsed.data.password, user.passwordHash);
        if (!valid) return null;
        return {
          id: user.id,
          name: user.name,
          email: user.email,
          image: user.image,
          role: user.role,
          orgId: user.organization?.toString(),
          plan: user.subscription.plan
        } as any;
      },
    }),
  ],
  callbacks: {
   ...authConfig.callbacks,
    async signIn({ user, account }) {
      if (account?.provider!== "google") return true;
      if (!user.email) return false;
      try {
        await connectDB();
        const existing = await User.findOne({ email: user.email.toLowerCase() });
        if (!existing) {
          await createUserWithOrg({
            name: user.name?? user.email.split("@")[0],
            email: user.email,
            image: user.image?? undefined,
          });
        }
      } catch (e) {
        console.error("signIn callback error", e);
      }
      return true;
    },
    async session({ session, token }) {
      if (token) {
        (session.user as any).id = token.id as string;
        (session.user as any).role = (token as any).role;
        (session.user as any).orgId = (token as any).orgId;
      }
      return session;
    },
  },
});