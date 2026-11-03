import type { Metadata } from "next";
import { LegalPage } from "../../components/mah-content-pages";

export const metadata: Metadata = { title: "Terms of Use | Lara Assignment" };
export default function Page() { return <LegalPage kind="terms-of-use" />; }
