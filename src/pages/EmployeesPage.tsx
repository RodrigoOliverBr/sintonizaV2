
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Trash } from "lucide-react";
import { Company, Employee } from "@/types/cadastro";
import { 
  deleteEmployee, 
  getCompanies, 
  getDepartmentById, 
  getEmployees 
} from "@/services/storageService";
import NewEmployeeModal from "@/components/modals/NewEmployeeModal";
import { useToast } from "@/hooks/use-toast";

const EmployeesPage: React.FC = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [selectedCompanyId, setSelectedCompanyId] = useState<string>("");
  const [isNewEmployeeModalOpen, setIsNewEmployeeModalOpen] = useState(false);
  const { toast } = useToast();

  const loadData = () => {
    setCompanies(getCompanies());
    
    const allEmployees = getEmployees();
    if (selectedCompanyId) {
      setEmployees(allEmployees.filter(e => e.companyId === selectedCompanyId));
    } else {
      setEmployees(allEmployees);
    }
  };

  useEffect(() => {
    loadData();
  }, [selectedCompanyId]);

  const handleDelete = (id: string) => {
    if (window.confirm("Tem certeza que deseja excluir esse funcionário?")) {
      deleteEmployee(id);
      loadData();
      toast({
        title: "Sucesso",
        description: "Funcionário excluído com sucesso!",
      });
    }
  };

  const getDepartmentName = (departmentId: string) => {
    const department = getDepartmentById(departmentId);
    return department ? department.name : "Não encontrado";
  };

  return (
    <Layout title="Funcionários">
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">Funcionários Cadastrados</h2>
          <Button onClick={() => setIsNewEmployeeModalOpen(true)}>
            <Plus className="mr-2 h-4 w-4" /> Novo Funcionário
          </Button>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="w-72">
            <Select value={selectedCompanyId} onValueChange={setSelectedCompanyId}>
              <SelectTrigger>
                <SelectValue placeholder="Filtrar por empresa" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Todas as empresas</SelectItem>
                {companies.map((company) => (
                  <SelectItem key={company.id} value={company.id}>
                    {company.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <div className="rounded-md border">
          <Table>
            <TableCaption>Lista de funcionários cadastrados</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>CPF</TableHead>
                <TableHead>Função</TableHead>
                <TableHead>Setor</TableHead>
                <TableHead className="w-[100px]">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {employees.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center">
                    Nenhum funcionário cadastrado
                  </TableCell>
                </TableRow>
              ) : (
                employees.map((employee) => (
                  <TableRow key={employee.id}>
                    <TableCell>{employee.name}</TableCell>
                    <TableCell>{employee.cpf}</TableCell>
                    <TableCell>{employee.role}</TableCell>
                    <TableCell>{getDepartmentName(employee.departmentId)}</TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(employee.id)}
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

      <NewEmployeeModal
        open={isNewEmployeeModalOpen}
        onOpenChange={setIsNewEmployeeModalOpen}
        onEmployeeAdded={loadData}
        preselectedCompanyId={selectedCompanyId}
      />
    </Layout>
  );
};

export default EmployeesPage;
