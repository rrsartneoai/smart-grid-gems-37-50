import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface SidebarHeaderProps {
  collapsed: boolean;
  toggleCollapse: () => void;
}

export function SidebarHeader({ collapsed, toggleCollapse }: SidebarHeaderProps) {
  return (
    <Button
      variant="ghost"
      onClick={toggleCollapse}
      className="absolute -right-4 top-4 z-50 flex items-center gap-2 lg:block hidden"
    >
      {collapsed ? (
        <>
          <ChevronRight className="h-4 w-4" />
          <span className="text-sm">Rozwiń</span>
        </>
      ) : (
        <>
          <ChevronLeft className="h-4 w-4" />
          <span className="text-sm">Zwiń</span>
        </>
      )}
    </Button>
  );
}