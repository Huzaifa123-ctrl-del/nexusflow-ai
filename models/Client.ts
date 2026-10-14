import { Schema, model, models, type Model, type Types } from "mongoose";

export interface IClient {
  organization: Types.ObjectId;
  name: string;
  email?: string;
  company?: string;
  status: "ACTIVE" | "INACTIVE";
  /** Recurring monthly revenue from this client in USD. Drives MRR. */
  monthlyRevenue: number;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const clientSchema = new Schema<IClient>(
  {
    organization: { type: Schema.Types.ObjectId, ref: "Organization", required: true, index: true },
    name: { type: String, required: true, trim: true },
    email: { type: String, trim: true, lowercase: true },
    company: { type: String, trim: true },
    status: { type: String, enum: ["ACTIVE", "INACTIVE"], default: "ACTIVE" },
    monthlyRevenue: { type: Number, default: 0, min: 0 },
    notes: String,
  },
  { timestamps: true }
);

export const Client = (models.Client as Model<IClient>) || model<IClient>("Client", clientSchema);
