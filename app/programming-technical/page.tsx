import { MahServicePage } from "../../components/mah-public";
import { servicePages } from "../../lib/mah-content";
import type { Metadata } from "next";
export const metadata: Metadata = { title: "Programming & Technical Guidance", description: servicePages["programming-technical"].intro };
export default function ProgrammingTechnicalPage() { return <MahServicePage config={servicePages["programming-technical"]} />; }