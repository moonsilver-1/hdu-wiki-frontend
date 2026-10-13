import {
  BookOpenText,
  Building2,
  CodeXml,
  UsersRound,
  type LucideIcon,
} from "lucide-react";

const categoryIcons: Record<string, LucideIcon> = {
  courses: BookOpenText,
  campus: Building2,
  tech: CodeXml,
  community: UsersRound,
};

export default function CategoryIcon({
  category,
  size = 22,
}: {
  category: string;
  size?: number;
}) {
  const Icon = categoryIcons[category] ?? BookOpenText;
  return <Icon aria-hidden="true" size={size} strokeWidth={1.8} />;
}
