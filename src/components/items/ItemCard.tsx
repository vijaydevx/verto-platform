import { Link } from "react-router-dom";
import { MapPin, Clock3 } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { formatRelativeDate } from "@/lib/utils";
import type { ItemWithProfile } from "@/types";

interface ItemCardProps {
  item: ItemWithProfile;
}

export function ItemCard({ item }: ItemCardProps) {
  return (
    <Link to={`/item/${item.id}`} aria-label={`View ${item.title}`}>
      <Card className="group overflow-hidden p-0 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl rounded-[32px] border-black/5 bg-white/60 backdrop-blur-sm">
        <div className="relative aspect-[4/3] overflow-hidden bg-slate-100">
          <img
            src={item.image_url}
            alt={item.title}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
          <div className="absolute left-4 top-4">
            <Badge 
              tone={item.type === "found" ? "success" : "warning"}
              className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg"
            >
              {item.type}
            </Badge>
          </div>
        </div>
        <div className="space-y-4 p-6">
          <div className="space-y-1">
            <h3 className="truncate text-xl font-black text-slate-900 tracking-tight">{item.title}</h3>
            <p className="line-clamp-2 text-sm text-slate-500 font-medium leading-relaxed">
              {item.description}
            </p>
          </div>
          <div className="flex flex-col gap-2 pt-2 border-t border-black/5">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-400">
              <MapPin className="h-3.5 w-3.5 text-primary" aria-hidden="true" />
              <span className="truncate uppercase tracking-wider">{item.location}</span>
            </div>
            <div className="flex items-center gap-2 text-xs font-bold text-slate-400">
              <Clock3 className="h-3.5 w-3.5 text-primary" aria-hidden="true" />
              <span className="uppercase tracking-wider">{formatRelativeDate(item.created_at)}</span>
            </div>
          </div>
        </div>
      </Card>
    </Link>
  );
}
