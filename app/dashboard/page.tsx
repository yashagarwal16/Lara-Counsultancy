import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { isValidSession } from "../../lib/auth";
import Enquiry from "../../models/Enquiry";
import { connectDatabase } from "../../lib/db";
import DashboardClient from "./DashboardClient";
import { getSiteSettings } from "../../lib/site-settings";

export const dynamic = "force-dynamic";

export default async function DashboardPage({ searchParams }: { searchParams: Promise<{ page?: string }> }) {
  if (!isValidSession((await cookies()).get("lara_admin_session")?.value)) redirect("/dashboard/login");
  const requestedPage = Number((await searchParams).page);
  const page = Number.isInteger(requestedPage) && requestedPage > 0 ? requestedPage : 1;
  const pageSize = 50;
  await connectDatabase();
  const enquiries = await Enquiry.find().sort({ createdAt: -1 }).skip((page - 1) * pageSize).limit(pageSize + 1).lean();
  const settings = await getSiteSettings();
  const hasNextPage = enquiries.length > pageSize;
  return <DashboardClient enquiries={JSON.parse(JSON.stringify(enquiries.slice(0, pageSize)))} settings={settings} page={page} hasNextPage={hasNextPage} />;
}
