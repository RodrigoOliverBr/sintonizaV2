
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
import { Department } from "@/types/cadastro";
import { deleteDepartment, getDepartments } from "@/services/storageService";
import NewDepartmentModal from "@/components/modals/NewDepartmentModal";
import { useToast } from "@/hooks/use-toast";

const DepartmentsPage: React.FC = () => {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [isNewDepartmentModalOpen, setIsNewDepartmentModalOpen] = useState(false);
  const { toast } = useToast();

  const loadDepartments = () => {
    setDepartments(getDepartments());
  };

  useEffect(() => {
    loadDepartments();
  }, []);

  const handleDelete = (id: string) => {
    if (window.confirm("Tem certeza que deseja excluir esse setor?")) {
      deleteDepartment(id);
      loadDepartments();
      toast({
        title: "Sucesso",
        description: "Setor excluído com sucesso!",
      });
    }
  };

  return (
    <Layout title="Setores">
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">Setores Cadastrados</h2>
          <Button onClick={() => setIsNewDepartmentModalOpen(true)}>
            <Plus className="mr-2 h-4 w-4" /> Novo Setor
          </Button>
        </div>
        
        <div className="rounded-md border">
          <Table>
            <TableCaption>Lista de setores cadastrados</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead className="w-[100px]">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {departments.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={2} className="text-center">
                    Nenhum setor cadastrado
                  </TableCell>
                </TableRow>
              ) : (
                departments.map((department) => (
                  <TableRow key={department.id}>
                    <TableCell>{department.name}</TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(department.id)}
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

      <NewDepartmentModal
        open={isNewDepartmentModalOpen}
        onOpenChange={setIsNewDepartmentModalOpen}
        onDepartmentAdded={loadDepartments}
      />
    </Layout>
  );
};

export default DepartmentsPage;
