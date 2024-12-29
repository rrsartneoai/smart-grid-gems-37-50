import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MessageSquare, Plus } from "lucide-react";
import { companiesData } from "@/data/companies";
import { useNavigate } from "react-router-dom";
import { useCompanyStore } from "../CompanySidebar";

interface SidebarCompanyListProps {
  collapsed: boolean;
  handleAddCompany: () => void;
  filteredCompanies: typeof companiesData;
}

export function SidebarCompanyList({ 
  collapsed, 
  handleAddCompany, 
  filteredCompanies 
}: SidebarCompanyListProps) {
  const navigate = useNavigate();
  const { setSelectedCompanyId } = useCompanyStore();

  return (
    <ScrollArea className="flex-1">
      <div className="space-y-4 p-4">
        {filteredCompanies.map((company) => (
          <div key={company.id} className="space-y-4">
            <Button
              variant="outline"
              className="w-full flex items-center justify-between"
              onClick={() => setSelectedCompanyId(company.id)}
            >
              <span className="truncate">{company.name}</span>
            </Button>
          </div>
        ))}
        <Button
          variant="outline"
          className={`${collapsed ? "w-10 p-2" : "w-full"} mt-2`}
          onClick={handleAddCompany}
        >
          <Plus className="h-4 w-4" />
          {!collapsed && <span className="ml-2">Dodaj firmę</span>}
        </Button>
        <Button
          variant="outline"
          className={`${collapsed ? "w-10 p-2" : "w-full"} mt-2`}
          onClick={() => navigate('/assistant')}
        >
          <MessageSquare className="w-4 h-4" />
          {!collapsed && <span className="ml-2">Asystent</span>}
        </Button>
      </div>
    </ScrollArea>
  );
}