import { FloatingChatbot } from "../FloatingChatbot";
import { Card } from "@/components/ui/card";
import { useCompanyStore } from "@/components/CompanySidebar";
import { companies } from "@/data/companies";

export function CompanyAnalysis() {
  const { selectedCompanyId } = useCompanyStore();
  const selectedCompany = companies.find(
    (company) => company.id === selectedCompanyId
  );

  if (!selectedCompany) {
    return (
      <Card>
        <h2>Wybierz firmę</h2>
        <p>Wybierz firmę, aby wyświetlić analizę.</p>
      </Card>
    );
  }

  return (
    <Card>
      <h2>Analiza {selectedCompany.name}</h2>
      <p>
        To jest analiza dla firmy: {selectedCompany.name} o id:{" "}
        {selectedCompany.id}
      </p>
      <FloatingChatbot />
    </Card>
  );
}
