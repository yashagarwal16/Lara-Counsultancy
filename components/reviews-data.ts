/**
 * THE ONLY FILE THE CLIENT NEEDS TO EDIT FOR REVIEWS.
 *
 * For each student, fill in:  name, text, rating, verified (and optionally date).
 * Until `text` is filled in, the card shows a neutral "feedback will be added" line.
 *
 * Only publish feedback and photos that the student has agreed to share.
 */

export type Review = {
  id: string;
  name: string;        // student's name (or first name + initial), as they agreed
  country: string;
  service: string;     // e.g. "Dissertation Support"
  photo: string;       // file inside /public/reviews/
  text?: string;       // the student's genuine feedback
  rating?: 1 | 2 | 3 | 4 | 5;
  verified?: boolean;  // set true once permission/verification is confirmed
  date?: string;       // ISO: YYYY-MM-DD (optional)
};

// Route of the contact page (used by the "Share your feedback" card)
export const CONTACT_HREF = "/contact_us.html";

// true  = show cards that have no feedback yet (design preview)
// false = hide every card that has no feedback text (use this at launch)
export const SHOW_PLACEHOLDER_CARDS = true;

export const COUNTRIES = ["United Kingdom", "Canada", "Australia", "India", "Singapore", "Germany"];

export const reviews: Review[] = [
  { id: "s1", name: "Sample Student A", country: "United Kingdom", service: "Dissertation Support",   photo: "/reviews/student-1.jpg", text: "Sample feedback: the guidance helped me organise my research plan more clearly.", rating: 5 },
  { id: "s2", name: "Sample Student B", country: "Canada",         service: "Assignment Assistance",  photo: "/reviews/student-2.jpg", text: "Sample feedback: the support made the assignment requirements easier to understand.", rating: 5 },
  { id: "s3", name: "Sample Student C", country: "Australia",      service: "Research Guidance",      photo: "/reviews/student-3.jpg", text: "Sample feedback: I received practical suggestions for improving my research structure.", rating: 5 },
  { id: "s4", name: "Sample Student D", country: "Singapore",      service: "Coursework Guidance",    photo: "/reviews/student-4.jpg", text: "Sample feedback: the explanations were clear and helped me plan the next steps.", rating: 5 },
  { id: "s5", name: "Sample Student E", country: "India",          service: "Proofreading & Editing", photo: "/reviews/student-5.jpg", text: "Sample feedback: the editing guidance helped me review my writing more carefully.", rating: 5 },
];

/* Example of a completed entry (copy this shape):

  {
    id: "s1",
    name: "Jane D.",
    country: "United Kingdom",
    service: "Dissertation Support",
    photo: "/reviews/student-1.jpg",
    text: "Their feedback on my research plan made the structure much clearer.",
    rating: 5,
    verified: true,
    date: "2026-10-12",
  },
*/
