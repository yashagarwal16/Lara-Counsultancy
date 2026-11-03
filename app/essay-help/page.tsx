import { MahServicePage } from "../../components/mah-public";
import { servicePages } from "../../lib/mah-content";
import type { Metadata } from "next";
export const metadata: Metadata = { title: "Essay Writing Help: Ultimate Guide to Academic Support", description: servicePages["essay"].intro };
export default function EssayHelpPage() { return <MahServicePage config={servicePages["essay"]} />; }