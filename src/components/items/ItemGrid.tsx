import { ItemCard } from "@/components/items/ItemCard";
import type { ItemWithProfile } from "@/types";

interface ItemGridProps {
  items: ItemWithProfile[];
}

export function ItemGrid({ items }: ItemGridProps) {
  return (
    <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
      {items.map((item) => (
        <ItemCard key={item.id} item={item} />
      ))}
    </div>
  );
}
