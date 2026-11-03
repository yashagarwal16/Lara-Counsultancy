import { MahServicePage } from "../../components/mah-public";
import { servicePages } from "../../lib/mah-content";
import type { Metadata } from "next";
export const metadata: Metadata = { title: "Dissertation Help: Support From Proposal to Final Review", description: servicePages["dissertation"].intro };
export default function DissertationPage() { return <MahServicePage config={servicePages["dissertation"]} />; }