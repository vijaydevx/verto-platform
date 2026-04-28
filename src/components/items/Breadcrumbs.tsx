import { ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";

interface BreadcrumbsProps {
  items: Array<{ label: string; to?: string }>;
}

export function Breadcrumbs({ items }: BreadcrumbsProps) {
  return (
    <nav aria-label="Breadcrumb">
      <ol className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
        {items.map((item, index) => (
          <li key={`${item.label}-${index}`} className="inline-flex items-center gap-2">
            {item.to ? (
              <Link to={item.to} className="transition hover:text-foreground">
                {item.label}
              </Link>
            ) : (
              <span className="font-semibold text-foreground">{item.label}</span>
            )}
            {index < items.length - 1 ? <ChevronRight className="h-4 w-4" aria-hidden="true" /> : null}
          </li>
        ))}
      </ol>
    </nav>
  );
}
