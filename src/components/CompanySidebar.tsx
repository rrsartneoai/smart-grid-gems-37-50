import { useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, ChevronLeft, ChevronRight, Plus, Bot, Search } from "lucide-react";
import { companiesData } from "@/data/companies";
import { create } from "zustand";
import { Button } from "@/components/ui/button";
import { CompanyStoreState } from "@/types/company";
import { useToast } from "@/components/ui/use-toast";
import { Input } from "@/components/ui/input";

export const useCompanyStore = create<CompanyStoreState>((set) => ({
  selectedCompanyId: "1",
  setSelectedCompanyId: (id: string) => set({ selectedCompanyId: id }),
}));

export function CompanySidebar() {
  const [open, setOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const { selectedCompanyId, setSelectedCompanyId } = useCompanyStore();
  const { toast } = useToast();

  const toggleCollapse = () => {
    setCollapsed(!collapsed);
  };

  const handleAddCompany = () => {
    toast({
      title: "Funkcja w przygotowaniu",
      description: "Możliwość dodawania nowych firm będzie dostępna wkrótce.",
    });
  };

  const handleOpenAssistant = () => {
    // This will trigger the FloatingChatbot to open
    const event = new CustomEvent('openAssistant');
    window.dispatchEvent(event);
  };

  const filteredCompanies = companiesData.filter(company => 
    company.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="lg:hidden"
        >
          <Menu className="h-6 w-6" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-[300px] p-0">
        <SidebarContent 
          handleAddCompany={handleAddCompany} 
          handleOpenAssistant={handleOpenAssistant}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          filteredCompanies={filteredCompanies}
        />
      </SheetContent>
      <aside className={`fixed left-0 top-0 z-30 h-screen transition-all duration-300 bg-background border-r ${collapsed ? "w-[60px]" : "w-[300px]"} hidden lg:block`}>
        <Button
          variant="ghost"
          onClick={toggleCollapse}
          className="absolute -right-4 top-4 z-50 flex items-center gap-2"
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
        <SidebarContent 
          collapsed={collapsed} 
          handleAddCompany={handleAddCompany} 
          handleOpenAssistant={handleOpenAssistant}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          filteredCompanies={filteredCompanies}
        />
      </aside>
    </Sheet>
  );
}

interface SidebarContentProps {
  collapsed?: boolean;
  handleAddCompany: () => void;
  handleOpenAssistant: () => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  filteredCompanies: typeof companiesData;
}

function SidebarContent({ 
  collapsed = false, 
  handleAddCompany,
  handleOpenAssistant,
  searchQuery,
  setSearchQuery,
  filteredCompanies
}: SidebarContentProps) {
  const { selectedCompanyId, setSelectedCompanyId } = useCompanyStore();

  return (
    <div className="flex h-full flex-col gap-4">
      {!collapsed && (
        <div className="p-6">
          <h2 className="text-lg font-semibold">Firmy</h2>
          <p className="text-sm text-muted-foreground">
            Wybierz firmę do monitorowania
          </p>
          <div className="mt-4 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Szukaj firm..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
        </div>
      )}
      <ScrollArea className="flex-1">
        <div className="space-y-4 p-4">
          {filteredCompanies.map((company) => (
            <div key={company.id} className="space-y-4">
              <Button
                variant={selectedCompanyId === company.id ? "secondary" : "ghost"}
                className={`w-full justify-start ${collapsed ? "px-2" : ""} transition-colors hover:bg-secondary`}
                onClick={() => setSelectedCompanyId(company.id)}
                title={collapsed ? company.name : undefined}
              >
                <div className="flex items-center">
                  {collapsed ? (
                    <span>{company.name.charAt(0)}</span>
                  ) : (
                    <span className="ml-2">{company.name}</span>
                  )}
                </div>
              </Button>
            </div>
          ))}
          <Button
            variant="outline"
            className={`w-full justify-start ${collapsed ? "px-2" : ""}`}
            onClick={handleAddCompany}
          >
            <Plus className="h-4 w-4 mr-2" />
            {!collapsed && <span>Dodaj firmę</span>}
          </Button>
          <Button
            variant="outline"
            className={`w-full justify-start ${collapsed ? "px-2" : ""}`}
            onClick={handleOpenAssistant}
          >
            <Bot className="h-4 w-4 mr-2" />
            {!collapsed && <span>Asystent AI</span>}
          </Button>
        </div>
      </ScrollArea>
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
}
