import { Schema, model, models, type Model, type Types } from "mongoose";

export interface IOrganization {
  name: string;
  slug: string;
  owner: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const organizationSchema = new Schema<IOrganization>(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true },
    owner: { type: Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

export const Organization =
  (models.Organization as Model<IOrganization>) || model<IOrganization>("Organization", organizationSchema);
