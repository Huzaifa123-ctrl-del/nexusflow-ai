import type { DefaultSession } from "next-auth";
import type { Role, Plan } from "@/models/User";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: Role;
      orgId: string;
      plan: Plan;
    } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
    role?: Role;
    orgId?: string;
    plan?: Plan;
  }
}
