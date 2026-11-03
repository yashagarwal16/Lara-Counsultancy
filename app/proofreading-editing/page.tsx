import { MahServicePage } from "../../components/mah-public";
import { servicePages } from "../../lib/mah-content";
import type { Metadata } from "next";
export const metadata: Metadata = { title: "Proofreading & Editing Support", description: servicePages["proofreading-editing"].intro };
export default function ProofreadingEditingPage() { return <MahServicePage config={servicePages["proofreading-editing"]} />; }