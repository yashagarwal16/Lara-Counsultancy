import { MahServicePage } from "../../components/mah-public";
import { servicePages } from "../../lib/mah-content";
import type { Metadata } from "next";
export const metadata: Metadata = { title: "Coursework Help: Structured Academic Support", description: servicePages["coursework"].intro };
export default function CourseworkPage() { return <MahServicePage config={servicePages["coursework"]} />; }