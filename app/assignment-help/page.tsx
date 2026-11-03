import { MahServicePage } from "../../components/mah-public";
import { servicePages } from "../../lib/mah-content";
import type { Metadata } from "next";
export const metadata: Metadata = { title: "Assignment Help: Academic Guidance and Support", description: servicePages["assignment"].intro };
export default function AssignmentHelpPage() { return <MahServicePage config={servicePages["assignment"]} />; }