import SiteSettings from "../models/SiteSettings";
import { defaultSiteSettings, type EditableSiteSettings } from "./site-settings-shared";
export { defaultSiteSettings, type EditableSiteSettings } from "./site-settings-shared";

export async function getSiteSettings(): Promise<EditableSiteSettings> {
  const saved = await SiteSettings.findOne({ key: "primary" }).lean();
  if (!saved) return defaultSiteSettings;
  return {
    theme: { ...defaultSiteSettings.theme, ...(saved.theme || {}) },
    logoImage: saved.logoImage || "",
    brandName: saved.brandName || defaultSiteSettings.brandName,
    brandTagline: saved.brandTagline || defaultSiteSettings.brandTagline,
    legalName: saved.legalName,
    phone: saved.phone || "",
    email: saved.email || "",
    whatsapp: saved.whatsapp || "",
    hours: saved.hours || "",
    socials: { ...defaultSiteSettings.socials, ...(saved.socials || {}) },
    offer: { ...defaultSiteSettings.offer, ...(saved.offer || {}) },
    chatbot: { ...defaultSiteSettings.chatbot, ...(saved.chatbot || {}) },
  };
}

export function sanitizeSiteSettings(input: unknown): EditableSiteSettings {
  const value = input && typeof input === "object" ? input as Record<string, unknown> : {};
  const socials = value.socials && typeof value.socials === "object" ? value.socials as Record<string, unknown> : {};
  const offer = value.offer && typeof value.offer === "object" ? value.offer as Record<string, unknown> : {};
  const theme = value.theme && typeof value.theme === "object" ? value.theme as Record<string, unknown> : {};
  const text = (source: Record<string, unknown>, key: string, fallback: string, max: number) => {
    const candidate = source[key];
    return typeof candidate === "string" ? candidate.trim().slice(0, max) : fallback;
  };
  const color = (key: string, fallback: string) => {
    const candidate = theme[key];
    return typeof candidate === "string" && /^#[0-9a-f]{6}$/i.test(candidate) ? candidate : fallback;
  };
  const logoImage = typeof value.logoImage === "string" && /^data:image\/(?:png|jpeg|webp);base64,[a-z0-9+/=\r\n]+$/i.test(value.logoImage) && value.logoImage.length <= 1400000 && validImageSignature(value.logoImage)
    ? value.logoImage
    : "";
  return {
    theme: {
      primary: color("primary", defaultSiteSettings.theme.primary),
      primaryDark: color("primaryDark", defaultSiteSettings.theme.primaryDark),
      accent: color("accent", defaultSiteSettings.theme.accent),
      ink: color("ink", defaultSiteSettings.theme.ink),
    },
    logoImage,
    brandName: text(value, "brandName", defaultSiteSettings.brandName, 120),
    brandTagline: text(value, "brandTagline", defaultSiteSettings.brandTagline, 160),
    legalName: text(value, "legalName", defaultSiteSettings.legalName, 120),
    phone: text(value, "phone", defaultSiteSettings.phone, 40),
    email: text(value, "email", defaultSiteSettings.email, 254),
    whatsapp: text(value, "whatsapp", defaultSiteSettings.whatsapp, 40),
    hours: text(value, "hours", defaultSiteSettings.hours, 120),
    socials: {
      facebook: text(socials, "facebook", "", 300),
      twitter: text(socials, "twitter", "", 300),
      youtube: text(socials, "youtube", "", 300),
      instagram: text(socials, "instagram", "", 300),
      linkedin: text(socials, "linkedin", "", 300),
    },
    offer: {
      enabled: offer.enabled === undefined ? defaultSiteSettings.offer.enabled : offer.enabled === true,
      kicker: text(offer, "kicker", defaultSiteSettings.offer.kicker, 80),
      title: text(offer, "title", defaultSiteSettings.offer.title, 160),
      description: text(offer, "description", defaultSiteSettings.offer.description, 500),
      code: text(offer, "code", defaultSiteSettings.offer.code, 40),
      ctaLabel: text(offer, "ctaLabel", defaultSiteSettings.offer.ctaLabel, 80),
      ctaHref: text(offer, "ctaHref", defaultSiteSettings.offer.ctaHref, 300),
      endsOn: text(offer, "endsOn", defaultSiteSettings.offer.endsOn, 20),
      terms: text(offer, "terms", defaultSiteSettings.offer.terms, 300),
    },
    chatbot: {
      enabled: typeof value.chatbot === "object" && value.chatbot !== null && (value.chatbot as Record<string, unknown>).enabled !== undefined
        ? (value.chatbot as Record<string, unknown>).enabled === true
        : defaultSiteSettings.chatbot.enabled,
      title: text(value.chatbot && typeof value.chatbot === "object" ? value.chatbot as Record<string, unknown> : {}, "title", defaultSiteSettings.chatbot.title, 80),
      intro: text(value.chatbot && typeof value.chatbot === "object" ? value.chatbot as Record<string, unknown> : {}, "intro", defaultSiteSettings.chatbot.intro, 300),
      buttonLabel: text(value.chatbot && typeof value.chatbot === "object" ? value.chatbot as Record<string, unknown> : {}, "buttonLabel", defaultSiteSettings.chatbot.buttonLabel, 40),
    },
  };
}

function validImageSignature(dataUrl: string) {
  const [, encoded] = dataUrl.split(",", 2);
  if (!encoded) return false;
  const bytes = Buffer.from(encoded, "base64");
  if (bytes.length < 12) return false;
  const png = bytes.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]));
  const jpeg = bytes[0] === 255 && bytes[1] === 216 && bytes[2] === 255;
  const webp = bytes.subarray(0, 4).toString("ascii") === "RIFF" && bytes.subarray(8, 12).toString("ascii") === "WEBP";
  return png || jpeg || webp;
}
