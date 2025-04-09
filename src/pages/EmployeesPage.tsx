
import React, { useState, useEffect } from "react";
import Layout from "@/components/Layout";
import { Company, Employee, JobRole } from "@/types/cadastro";
import { getCompanies, getEmployees, getJobRoleById, getDepartmentById, getCompanyById } from "@/services/storageService";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Plus, Search } from "lucide-react";
import NewEmployeeModal from "@/components/modals/NewEmployeeModal";

const EmployeesPage: React.FC = () => {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [selectedCompanyId, setSelectedCompanyId] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [isNewEmployeeModalOpen, setIsNewEmployeeModalOpen] = useState(false);

  useEffect(() => {
    loadData();
  }, [selectedCompanyId]);

  const loadData = () => {
    setCompanies(getCompanies());
    
    const allEmployees = getEmployees();
    if (selectedCompanyId && selectedCompanyId !== "all") {
      setEmployees(allEmployees.filter(e => e.companyId === selectedCompanyId));
    } else {
      setEmployees(allEmployees);
    }
  };

  const handleCompanyChange = (value: string) => {
    setSelectedCompanyId(value);
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const filteredEmployees = employees.filter(
    (employee) =>
      employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.cpf.includes(searchTerm)
  );

  const handleEmployeeAdded = () => {
    loadData();
  };

  const getDepartmentName = (employee: Employee) => {
    if (!employee || !employee.companyId) return "N/A";
    
    const company = companies.find(c => c.id === employee.companyId);
    if (!company || !company.departments) return "N/A";
    
    const department = company.departments.find(d => d.id === employee.departmentId);
    return department ? department.name : "N/A";
  };

  const getJobRoleName = (roleId: string) => {
    const role = getJobRoleById(roleId);
    return role ? role.name : "N/A";
  };

  return (
    <Layout>
      <div className="container mx-auto py-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Funcionários</h1>
          <Button onClick={() => setIsNewEmployeeModalOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Novo Funcionário
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <Select 
              value={selectedCompanyId} 
              onValueChange={handleCompanyChange}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione uma empresa" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas as empresas</SelectItem>
                {companies.map((company) => (
                  <SelectItem key={company.id} value={company.id}>
                    {company.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar funcionário"
              className="pl-8"
              value={searchTerm}
              onChange={handleSearch}
            />
          </div>
        </div>

        <div className="bg-white shadow-md rounded-md">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>CPF</TableHead>
                <TableHead>Função</TableHead>
                <TableHead>Empresa</TableHead>
                <TableHead>Setor</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredEmployees.length > 0 ? (
                filteredEmployees.map((employee) => {
                  const company = companies.find(c => c.id === employee.companyId);
                  return (
                    <TableRow key={employee.id}>
                      <TableCell>{employee.name}</TableCell>
                      <TableCell>{employee.cpf}</TableCell>
                      <TableCell>{getJobRoleName(employee.roleId)}</TableCell>
                      <TableCell>{company ? company.name : "N/A"}</TableCell>
                      <TableCell>{getDepartmentName(employee)}</TableCell>
                    </TableRow>
                  );
                })
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-4">
                    Nenhum funcionário encontrado
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      <NewEmployeeModal
        open={isNewEmployeeModalOpen}
        onOpenChange={setIsNewEmployeeModalOpen}
        onEmployeeAdded={handleEmployeeAdded}
        preselectedCompanyId={selectedCompanyId !== "all" ? selectedCompanyId : undefined}
      />
    </Layout>
  );
};

export default EmployeesPage;
