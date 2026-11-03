import { BookOpen, ClipboardCheck, Search } from "lucide-react";
import { categorySlug, type Category } from "./blog-data";

const ICONS = {
  "Essay help": BookOpen,
  "Assignment help": ClipboardCheck,
  "Research Topics": Search,
} as const;

export function CategoryArt({ category, large = false }: { category: Category; large?: boolean }) {
  const Icon = ICONS[category];
  return (
    <div className={`mah-art mah-art-${categorySlug(category)}${large ? " mah-art-large" : ""}`} aria-hidden="true">
      <Icon size={large ? 56 : 38} strokeWidth={1.6} />
      <span>{category}</span>
    </div>
  );
}