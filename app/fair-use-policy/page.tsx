import type { Metadata } from "next";
import { LegalPage } from "../../components/mah-content-pages";

export const metadata: Metadata = { title: "Fair Use Policy | Lara Assignment" };
export default function Page() { return <LegalPage kind="fair-use-policy" />; }
