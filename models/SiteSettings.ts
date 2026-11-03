import { model, models, Schema, type InferSchemaType } from "mongoose";

const siteSettingsSchema = new Schema(
  {
    key: { type: String, unique: true, default: "primary" },
    theme: {
      primary: { type: String, maxlength: 7 },
      primaryDark: { type: String, maxlength: 7 },
      accent: { type: String, maxlength: 7 },
      ink: { type: String, maxlength: 7 },
    },
    logoImage: { type: String, maxlength: 1400000 },
    brandName: { type: String, required: true, maxlength: 120 },
    brandTagline: { type: String, maxlength: 160 },
    legalName: { type: String, required: true, maxlength: 120 },
    phone: { type: String, maxlength: 40 },
    email: { type: String, maxlength: 254 },
    whatsapp: { type: String, maxlength: 40 },
    hours: { type: String, maxlength: 120 },
    socials: {
      facebook: { type: String, maxlength: 300 },
      twitter: { type: String, maxlength: 300 },
      youtube: { type: String, maxlength: 300 },
      instagram: { type: String, maxlength: 300 },
      linkedin: { type: String, maxlength: 300 },
    },
    offer: {
      enabled: { type: Boolean, default: true },
      kicker: { type: String, maxlength: 80 },
      title: { type: String, maxlength: 160 },
      description: { type: String, maxlength: 500 },
      code: { type: String, maxlength: 40 },
      ctaLabel: { type: String, maxlength: 80 },
      ctaHref: { type: String, maxlength: 300 },
      endsOn: { type: String, maxlength: 20 },
      terms: { type: String, maxlength: 300 },
    },
    chatbot: {
      enabled: { type: Boolean, default: true },
      title: { type: String, maxlength: 80 },
      intro: { type: String, maxlength: 300 },
      buttonLabel: { type: String, maxlength: 40 },
    },
  },
  { timestamps: true },
);

export type SiteSettings = InferSchemaType<typeof siteSettingsSchema>;
export default models.SiteSettings ?? model("SiteSettings", siteSettingsSchema);
