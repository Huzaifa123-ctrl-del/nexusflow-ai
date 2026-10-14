import { Schema, model, models, type Model, type Types } from "mongoose";

export const TASK_STATUSES = ["TODO", "DOING", "DONE"] as const;
export type TaskStatus = (typeof TASK_STATUSES)[number];

export interface ITask {
  organization: Types.ObjectId;
  project: Types.ObjectId;
  title: string;
  status: TaskStatus;
  /** Position inside its Kanban column. */
  order: number;
  assignee?: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const taskSchema = new Schema<ITask>(
  {
    organization: { type: Schema.Types.ObjectId, ref: "Organization", required: true, index: true },
    project: { type: Schema.Types.ObjectId, ref: "Project", required: true, index: true },
    title: { type: String, required: true, trim: true },
    status: { type: String, enum: TASK_STATUSES, default: "TODO" },
    order: { type: Number, default: 0 },
    assignee: { type: Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

export const Task = (models.Task as Model<ITask>) || model<ITask>("Task", taskSchema);
