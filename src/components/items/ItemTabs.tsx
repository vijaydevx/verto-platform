import { SegmentedControl } from "@/components/ui/SegmentedControl";

interface ItemTabsProps {
  value: "active" | "archived" | "all";
  onChange: (value: "active" | "archived" | "all") => void;
}

export function ItemTabs({ value, onChange }: ItemTabsProps) {
  return (
    <SegmentedControl
      label="View"
      value={value}
      onChange={onChange}
      options={[
        { label: "Active", value: "active" },
        { label: "Archived", value: "archived" },
        { label: "All", value: "all" },
      ]}
    />
  );
}
