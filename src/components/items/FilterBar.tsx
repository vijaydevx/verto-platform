import { Search } from "lucide-react";
import { Input } from "@/components/ui/Input";
import { SegmentedControl } from "@/components/ui/SegmentedControl";
import { Card } from "@/components/ui/Card";

interface FilterBarProps {
  location: string;
  type: "all" | "lost" | "found";
  onLocationChange: (value: string) => void;
  onTypeChange: (value: "all" | "lost" | "found") => void;
}

export function FilterBar({ location, type, onLocationChange, onTypeChange }: FilterBarProps) {
  return (
    <Card className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between p-6 rounded-[32px] bg-white/40 backdrop-blur-md border border-black/5 shadow-premium">
      <div className="flex-1 space-y-2">
        <label htmlFor="location-search" className="text-xs font-black uppercase tracking-widest text-[#1A1D1B]/50 ml-1">
          Find by location
        </label>
        <div className="relative group">
          <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors" />
          <Input
            id="location-search"
            value={location}
            onChange={(event) => onLocationChange(event.target.value)}
            className="pl-12 h-14 bg-white/50 border-black/5 rounded-2xl font-bold placeholder:text-slate-300 focus:ring-primary/20"
            placeholder="Library, Engineering Block, Main Gate..."
            aria-label="Search items by location"
          />
        </div>
      </div>
      <div className="space-y-2">
        <label className="text-xs font-black uppercase tracking-widest text-[#1A1D1B]/50 ml-1">
          Filter Type
        </label>
        <SegmentedControl
          value={type}
          onChange={onTypeChange}
          className="h-14 bg-white/50 p-1.5 rounded-2xl border-black/5"
          options={[
            { label: "ALL", value: "all" as const },
            { label: "LOST", value: "lost" as const },
            { label: "FOUND", value: "found" as const },
          ]}
        />
      </div>
    </Card>
  );
}
