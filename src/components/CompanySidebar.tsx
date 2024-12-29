import { useState } from "react";
import { Separator } from "@/components/ui/separator";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import { companiesData } from "@/data/companies";
import { create } from "zustand";
import { Button } from "@/components/ui/button";
import { CompanyStoreState } from "@/types/company";
import { useToast } from "@/components/ui/use-toast";
import { useLocation } from "react-router-dom";
import { SidebarHeader } from "./sidebar/SidebarHeader";
import { SidebarSearch } from "./sidebar/SidebarSearch";
import { SidebarCompanyList } from "./sidebar/SidebarCompanyList";

export const useCompanyStore = create<CompanyStoreState>((set) => ({
  selectedCompanyId: "1",
  setSelectedCompanyId: (id: string) => set({ selectedCompanyId: id }),
}));

export function CompanySidebar() {
  const [open, setOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const { toast } = useToast();
  const location = useLocation();

  const currentHash = location.hash.slice(1);
  const isAIAssistantVisible = ['insights', 'status', 'sensors'].includes(currentHash);

  const toggleCollapse = () => {
    setCollapsed(!collapsed);
  };

  const handleAddCompany = () => {
    toast({
      title: "Funkcja w przygotowaniu",
      description: "Możliwość dodawania nowych firm będzie dostępna wkrótce.",
    });
  };

  const filteredCompanies = companiesData.filter(company => 
    company.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const SidebarContent = () => (
    <div className="flex h-full flex-col gap-4">
      {!collapsed && (
        <div className="p-6">
          <h2 className="text-lg font-semibold">Firmy</h2>
          <p className="text-sm text-muted-foreground">
            Wybierz firmę do monitorowania
          </p>
          <SidebarSearch searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
        </div>
      )}
      <SidebarCompanyList
        collapsed={collapsed}
        handleAddCompany={handleAddCompany}
        filteredCompanies={filteredCompanies}
      />
      {!collapsed && (
        <>
          <Separator />
          <div className="p-4">
            <p className="text-xs text-muted-foreground">
              Ostatnia aktualizacja: {new Date().toLocaleString()}
            </p>
          </div>
        </>
      )}
    </div>
  );

  return (
    <>
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="fixed top-4 left-4 z-50 lg:hidden"
          >
            <Menu className="h-6 w-6" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-[300px] p-0">
          <SidebarContent />
        </SheetContent>
      </Sheet>
      <aside 
        className={`fixed left-0 top-0 z-30 h-screen transition-all duration-300 bg-background border-r 
          ${collapsed ? "w-[60px]" : "w-[300px]"} hidden lg:block`}
      >
        <SidebarHeader collapsed={collapsed} toggleCollapse={toggleCollapse} />
        <SidebarContent />
      </aside>
    </>
  );
}