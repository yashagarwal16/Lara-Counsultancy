"use client";

import { useEffect, useState } from "react";
import { defaultSiteSettings, type EditableSiteSettings } from "../lib/site-settings-shared";

export function useSiteSettings() {
  const [settings, setSettings] = useState<EditableSiteSettings>(defaultSiteSettings);
  useEffect(() => {
    fetch("/api/site-settings", { cache: "no-store" })
      .then(async (response) => {
        if (!response.ok) throw new Error(`Settings request failed with status ${response.status}.`);
        return response.json();
      })
      .then((value) => { setSettings(value as EditableSiteSettings); })
      .catch((error) => console.error("Site settings could not be loaded:", error));
  }, []);
  return settings;
}
