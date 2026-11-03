import { BlogArticlePage } from "../../../components/mah-content-pages";
export function generateStaticParams() { return ["essay-writing-guide", "how-long-is-an-essay", "research-paper-outline", "how-to-write-an-abstract", "demonstration-speech-ideas", "capstone-project-ideas-topics"].map((slug) => ({ slug })); }
export default async function Page({ params }: { params: Promise<{ slug: string }> }) { return <BlogArticlePage slug={(await params).slug} />; }
