
import React, { useEffect, useState } from "react";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Plus, Trash } from "lucide-react";
import { Company } from "@/types/cadastro";
import { deleteCompany, getCompanies } from "@/services/storageService";
import NewCompanyModal from "@/components/modals/NewCompanyModal";
import { useToast } from "@/hooks/use-toast";

const CompaniesPage: React.FC = () => {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [isNewCompanyModalOpen, setIsNewCompanyModalOpen] = useState(false);
  const { toast } = useToast();

  const loadCompanies = () => {
    setCompanies(getCompanies());
  };

  useEffect(() => {
    loadCompanies();
  }, []);

  const handleDelete = (id: string) => {
    if (window.confirm("Tem certeza que deseja excluir essa empresa?")) {
      deleteCompany(id);
      loadCompanies();
      toast({
        title: "Sucesso",
        description: "Empresa excluída com sucesso!",
      });
    }
  };

  return (
    <Layout title="Empresas">
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">Empresas Cadastradas</h2>
          <Button onClick={() => setIsNewCompanyModalOpen(true)}>
            <Plus className="mr-2 h-4 w-4" /> Nova Empresa
          </Button>
        </div>
        
        <div className="rounded-md border">
          <Table>
            <TableCaption>Lista de empresas cadastradas</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead className="w-[100px]">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {companies.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={2} className="text-center">
                    Nenhuma empresa cadastrada
                  </TableCell>
                </TableRow>
              ) : (
                companies.map((company) => (
                  <TableRow key={company.id}>
                    <TableCell>{company.name}</TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(company.id)}
                      >
                        <Trash className="h-4 w-4 text-destructive" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      <NewCompanyModal
        open={isNewCompanyModalOpen}
        onOpenChange={setIsNewCompanyModalOpen}
        onCompanyAdded={loadCompanies}
      />
    </Layout>
  );
};

export default CompaniesPage;
