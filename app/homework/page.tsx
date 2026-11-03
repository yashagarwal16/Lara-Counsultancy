import { MahServicePage } from "../../components/mah-public";
import { servicePages } from "../../lib/mah-content";
import type { Metadata } from "next";
export const metadata: Metadata = { title: "Homework Help | Expert Academic Writers Online", description: servicePages.homework.intro };
export default function HomeworkPage() { return <MahServicePage config={servicePages.homework} />; }
