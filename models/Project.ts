import { Schema, model, models, type Model, type Types } from "mongoose";

export interface IProject {
  organization: Types.ObjectId;
  client?: Types.ObjectId;
  name: string;
  brief?: string;
  status: "ACTIVE" | "PAUSED" | "COMPLETED";
  dueDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const projectSchema = new Schema<IProject>(
  {
    organization: { type: Schema.Types.ObjectId, ref: "Organization", required: true, index: true },
    client: { type: Schema.Types.ObjectId, ref: "Client" },
    name: { type: String, required: true, trim: true },
    brief: String,
    status: { type: String, enum: ["ACTIVE", "PAUSED", "COMPLETED"], default: "ACTIVE" },
    dueDate: Date,
  },
  { timestamps: true }
);

export const Project = (models.Project as Model<IProject>) || model<IProject>("Project", projectSchema);
