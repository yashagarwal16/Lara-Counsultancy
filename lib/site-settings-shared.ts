type SocialLinks = {
  facebook: string;
  twitter: string;
  youtube: string;
  instagram: string;
  linkedin: string;
};

type OfferSettings = {
  enabled: boolean;
  kicker: string;
  title: string;
  description: string;
  code: string;
  ctaLabel: string;
  ctaHref: string;
  endsOn: string;
  terms: string;
};

export type EditableSiteSettings = {
  theme: {
    primary: string;
    primaryDark: string;
    accent: string;
    ink: string;
  };
  logoImage: string;
  brandName: string;
  brandTagline: string;
  legalName: string;
  phone: string;
  email: string;
  whatsapp: string;
  hours: string;
  socials: SocialLinks;
  offer: OfferSettings;
  chatbot: {
    enabled: boolean;
    title: string;
    intro: string;
    buttonLabel: string;
  };
};

export const defaultSiteSettings: EditableSiteSettings = {
  theme: {
    primary: "#f56f18",
    primaryDark: "#df5e0e",
    accent: "#235bd7",
    ink: "#2c2c2c",
  },
  logoImage: "",
  brandName: "Lara Consultancy",
  brandTagline: "Academic support for students",
  legalName: "Lara Consultancy",
  phone: "+1-205-350-5700",
  email: "",
  whatsapp: "14246771220",
  hours: "Support available 24x7",
  socials: {
    facebook: "",
    twitter: "",
    youtube: "",
    instagram: "",
    linkedin: "",
  },
  offer: {
    enabled: true,
    kicker: "Limited-time offer",
    title: "10% off your first order",
    description: "Share your requirements and mention the code below when you place your first order.",
    code: "WELCOME10",
    ctaLabel: "Claim this offer",
    ctaHref: "/order",
    endsOn: "2026-12-31",
    terms: "Terms apply. See our Revision & Refund policy for details.",
  },
  chatbot: {
    enabled: true,
    title: "Chat with Lara",
    intro: "Ask about services, ordering, deadlines, or policies.",
    buttonLabel: "Chat with Lara",
  },
};
