import { model, models, Schema, type InferSchemaType } from "mongoose";

const enquirySchema = new Schema(
  {
    type: { type: String, enum: ["contact", "order", "chat"], required: true },
    name: { type: String, trim: true, maxlength: 120 },
    email: { type: String, trim: true, lowercase: true, maxlength: 254 },
    phone: { type: String, trim: true, maxlength: 40 },
    service: { type: String, trim: true, maxlength: 120 },
    subject: { type: String, trim: true, maxlength: 200 },
    deadline: { type: String, trim: true, maxlength: 40 },
    pages: { type: Number, min: 1, max: 10000 },
    description: { type: String, trim: true, maxlength: 10000 },
    assistantResponse: { type: String, trim: true, maxlength: 10000 },
    source: { type: String, trim: true, maxlength: 80 },
    idempotencyKey: { type: String, trim: true, maxlength: 120, index: true, sparse: true, unique: true },
    status: { type: String, enum: ["new", "in_progress", "resolved"], default: "new" },
    notification: {
      email: { type: String, enum: ["pending", "sent", "failed", "skipped"], default: "pending" },
      whatsapp: { type: String, enum: ["pending", "sent", "failed", "skipped"], default: "pending" },
    },
  },
  { timestamps: true },
);

export type Enquiry = InferSchemaType<typeof enquirySchema>;
export default models.Enquiry ?? model("Enquiry", enquirySchema);
