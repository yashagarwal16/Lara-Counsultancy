import type { Metadata } from "next";
import { MahReviewsPage } from "../../components/mah-public-pages";

export const metadata: Metadata = {
  title: "Lara Assignment Reviews | Student Feedback",
  description:
    "Explore feedback from students across the UK, Canada, Australia, India, Singapore, Germany, and beyond.",
};

export default function ReviewsPage() {
  return <MahReviewsPage />;
}
