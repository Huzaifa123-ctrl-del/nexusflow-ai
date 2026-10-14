"use server";

import bcrypt from "bcryptjs";
import { AuthError } from "next-auth";
import { signIn, signOut } from "@/auth";
import { connectDB } from "@/lib/db";
import { createUserWithOrg } from "@/lib/users";
import { loginSchema, registerSchema, type LoginInput, type RegisterInput } from "@/lib/validations";
import { User } from "@/models/User";

export type ActionResult = { error: string } | undefined;

export async function loginAction(input: LoginInput): Promise<ActionResult> {
  const parsed = loginSchema.safeParse(input);
  if (!parsed.success) return { error: "Enter a valid email and password." };

  try {
    await signIn("credentials", { ...parsed.data, redirectTo: "/dashboard" });
  } catch (error) {
    if (error instanceof AuthError) return { error: "Email or password is incorrect." };
    throw error; // lets Next.js handle the redirect
  }
}

export async function registerAction(input: RegisterInput): Promise<ActionResult> {
  const parsed = registerSchema.safeParse(input);
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Check the form and try again." };

  const { name, email, password } = parsed.data;
  await connectDB();

  if (await User.exists({ email })) {
    return { error: "An account with this email already exists. Sign in instead." };
  }

  const passwordHash = await bcrypt.hash(password, 12);
  await createUserWithOrg({ name, email, passwordHash });

  try {
    await signIn("credentials", { email, password, redirectTo: "/dashboard" });
  } catch (error) {
    if (error instanceof AuthError) return { error: "Account created. Sign in to continue." };
    throw error;
  }
}

export async function googleSignInAction() {
  await signIn("google", { redirectTo: "/dashboard" });
}

export async function signOutAction() {
  await signOut({ redirectTo: "/login" });
}
