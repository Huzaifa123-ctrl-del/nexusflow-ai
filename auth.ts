import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { authConfig } from "@/auth.config";
import { env } from "@/lib/env";
import { connectDB } from "@/lib/db";
import { loginSchema } from "@/lib/validations";
import { createUserWithOrg } from "@/lib/users";
import { User } from "@/models/User";


export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    Google({ clientId: env.GOOGLE_CLIENT_ID, clientSecret: env.GOOGLE_CLIENT_SECRET }),
    Credentials({
      credentials: { email: {}, password: {} },
      async authorize(raw) {
        const parsed = loginSchema.safeParse(raw);
        if (!parsed.success) return null;

        await connectDB();
        const user = await User.findOne({ email: parsed.data.email }).select("+passwordHash");
        if (!user?.passwordHash) return null; // Google-only account

        const valid = await bcrypt.compare(parsed.data.password, user.passwordHash);
        if (!valid) return null;

        return { id: user.id, name: user.name, email: user.email, image: user.image };
      },
    }),
  ],
  callbacks: {
    ...authConfig.callbacks,
    async signIn({ user, account }) {
      if (account?.provider !== "google") return true;
      if (!user.email) return false;

      await connectDB();
      const existing = await User.findOne({ email: user.email.toLowerCase() });
      if (!existing) {
        await createUserWithOrg({
          name: user.name ?? user.email.split("@")[0],
          email: user.email,
          image: user.image ?? undefined,
        });
      }
      return true;
    },
    async jwt({ token, trigger }) {
      // Refresh role/org/plan from the database on sign-in, on update(), or if missing.
      if (trigger === "signIn" || trigger === "update" || !token.id) {
        if (token.email) {
          await connectDB();
          const dbUser = await User.findOne({ email: token.email.toLowerCase() });
          if (dbUser) {
            token.id = dbUser.id;
            token.role = dbUser.role;
            token.orgId = dbUser.organization?.toString();
            token.plan = dbUser.subscription.plan;
          }
        }
      }
      return token;
    },
  },
});
