import { Schema, model, models, type Model, type Types } from "mongoose";

export const ROLES = ["OWNER", "ADMIN", "MEMBER"] as const;
export const PLANS = ["free", "pro", "scale"] as const;
export const SUB_STATUSES = ["none", "active", "trialing", "past_due", "canceled", "incomplete"] as const;

export type Role = (typeof ROLES)[number];
export type Plan = (typeof PLANS)[number];

export interface IUser {
  name: string;
  email: string;
  passwordHash?: string;
  image?: string;
  role: Role;
  organization?: Types.ObjectId;
  subscription: {
    plan: Plan;
    status: (typeof SUB_STATUSES)[number];
    stripeCustomerId?: string;
    stripeSubscriptionId?: string;
    currentPeriodEnd?: Date;
  };
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<IUser>(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, select: false },
    image: String,
    role: { type: String, enum: ROLES, default: "MEMBER" },
    organization: { type: Schema.Types.ObjectId, ref: "Organization", index: true },
    subscription: {
      plan: { type: String, enum: PLANS, default: "free" },
      status: { type: String, enum: SUB_STATUSES, default: "none" },
      stripeCustomerId: { type: String, index: true, sparse: true },
      stripeSubscriptionId: { type: String, index: true, sparse: true },
      currentPeriodEnd: Date,
    },
  },
  { timestamps: true }
);

export const User = (models.User as Model<IUser>) || model<IUser>("User", userSchema);
