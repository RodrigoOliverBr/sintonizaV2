
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "@/components/ui/command";
import { Check, ChevronsUpDown, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { 
  addEmployee, 
  getCompanies, 
  getDepartmentsByCompany,
  getJobRoles
} from "@/services/storageService";
import { Company, Department, JobRole } from "@/types/cadastro";
import { useToast } from "@/hooks/use-toast";
import JobRolesModal from "./JobRolesModal";

interface NewEmployeeModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onEmployeeAdded?: () => void;
  preselectedCompanyId?: string;
}

const NewEmployeeModal: React.FC<NewEmployeeModalProps> = ({
  open,
  onOpenChange,
  onEmployeeAdded,
  preselectedCompanyId
}) => {
  const [name, setName] = useState("");
  const [cpf, setCpf] = useState("");
  const [roleId, setRoleId] = useState("");
  const [companyId, setCompanyId] = useState(preselectedCompanyId || "");
  const [departmentId, setDepartmentId] = useState("");
  
  const [companies, setCompanies] = useState<Company[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [jobRoles, setJobRoles] = useState<JobRole[]>([]);
  const [openRoleCombobox, setOpenRoleCombobox] = useState(false);
  const [isJobRolesModalOpen, setIsJobRolesModalOpen] = useState(false);
  
  const { toast } = useToast();

  useEffect(() => {
    // Ensure we're getting valid arrays or defaulting to empty arrays
    const loadedCompanies = getCompanies() || [];
    setCompanies(loadedCompanies);
    
    loadJobRoles();
    
    if (preselectedCompanyId) {
      setCompanyId(preselectedCompanyId);
      loadDepartments(preselectedCompanyId);
    }
  }, [preselectedCompanyId]);

  const loadJobRoles = () => {
    const loadedJobRoles = getJobRoles() || [];
    setJobRoles(loadedJobRoles);
  };

  const loadDepartments = (companyId: string) => {
    if (!companyId) {
      setDepartments([]);
      return;
    }
    
    const company = companies.find(c => c.id === companyId);
    if (company && company.departments) {
      setDepartments(company.departments);
    } else {
      setDepartments([]);
    }
    setDepartmentId("");
  };

  const handleCompanyChange = (value: string) => {
    setCompanyId(value);
    loadDepartments(value);
  };

  const formatCPF = (value: string) => {
    // Remove non-digits
    const digits = value.replace(/\D/g, "");
    
    // Apply CPF mask (XXX.XXX.XXX-XX)
    if (digits.length <= 3) {
      return digits;
    } else if (digits.length <= 6) {
      return `${digits.slice(0, 3)}.${digits.slice(3)}`;
    } else if (digits.length <= 9) {
      return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6)}`;
    } else {
      return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6, 9)}-${digits.slice(9, 11)}`;
    }
  };

  const handleCPFChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCPF(e.target.value);
    setCpf(formatted);
  };

  const resetForm = () => {
    setName("");
    setCpf("");
    setRoleId("");
    if (!preselectedCompanyId) {
      setCompanyId("");
    }
    setDepartmentId("");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim() || !cpf.trim() || !roleId || !companyId || !departmentId) {
      toast({
        title: "Erro",
        description: "Todos os campos são obrigatórios",
        variant: "destructive",
      });
      return;
    }

    addEmployee({
      name,
      cpf,
      roleId,
      companyId,
      departmentId
    });
    
    toast({
      title: "Sucesso",
      description: "Funcionário cadastrado com sucesso!",
    });
    
    resetForm();
    onOpenChange(false);
    if (onEmployeeAdded) onEmployeeAdded();
  };

  // Only render dialog content when dialog is open to avoid command component issues
  if (!open) {
    return null;
  }

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[500px]">
          <form onSubmit={handleSubmit}>
            <DialogHeader>
              <DialogTitle>Novo Funcionário</DialogTitle>
              <DialogDescription>
                Preencha os dados do funcionário para cadastrá-lo
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Nome Completo
                </Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="col-span-3"
                  autoFocus
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="cpf" className="text-right">
                  CPF
                </Label>
                <Input
                  id="cpf"
                  value={cpf}
                  onChange={handleCPFChange}
                  maxLength={14}
                  className="col-span-3"
                  placeholder="000.000.000-00"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="company" className="text-right">
                  Empresa
                </Label>
                <div className="col-span-3">
                  <Select value={companyId} onValueChange={handleCompanyChange} disabled={!!preselectedCompanyId}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione uma empresa" />
                    </SelectTrigger>
                    <SelectContent>
                      {companies.map((company) => (
                        <SelectItem key={company.id} value={company.id}>
                          {company.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="department" className="text-right">
                  Setor
                </Label>
                <div className="col-span-3">
                  <Select 
                    value={departmentId} 
                    onValueChange={setDepartmentId}
                    disabled={!companyId || departments.length === 0}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={
                        !companyId 
                          ? "Selecione uma empresa primeiro" 
                          : departments.length === 0
                          ? "Nenhum setor disponível"
                          : "Selecione um setor"
                      } />
                    </SelectTrigger>
                    <SelectContent>
                      {departments.map((department) => (
                        <SelectItem key={department.id} value={department.id}>
                          {department.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="role" className="text-right">
                  Função
                </Label>
                <div className="col-span-3 flex gap-2">
                  <div className="flex-1">
                    <Popover open={openRoleCombobox} onOpenChange={setOpenRoleCombobox}>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          role="combobox"
                          aria-expanded={openRoleCombobox}
                          className="w-full justify-between"
                        >
                          {roleId
                            ? jobRoles.find((role) => role.id === roleId)?.name
                            : "Selecione uma função..."}
                          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-[400px] p-0">
                        <Command>
                          <CommandInput placeholder="Buscar função..." />
                          <CommandEmpty>Nenhuma função encontrada.</CommandEmpty>
                          <CommandGroup className="max-h-60 overflow-y-auto">
                            {jobRoles.map((role) => (
                              <CommandItem
                                key={role.id}
                                value={role.name}
                                onSelect={() => {
                                  setRoleId(role.id === roleId ? "" : role.id);
                                  setOpenRoleCombobox(false);
                                }}
                              >
                                <Check
                                  className={cn(
                                    "mr-2 h-4 w-4",
                                    roleId === role.id ? "opacity-100" : "opacity-0"
                                  )}
                                />
                                {role.name}
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </Command>
                      </PopoverContent>
                    </Popover>
                  </div>
                  <Button 
                    type="button" 
                    variant="outline" 
                    size="icon"
                    onClick={() => setIsJobRolesModalOpen(true)}
                    title="Gerenciar funções"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button type="submit">Cadastrar</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {isJobRolesModalOpen && (
        <JobRolesModal 
          open={isJobRolesModalOpen} 
          onOpenChange={setIsJobRolesModalOpen}
          onRolesUpdated={loadJobRoles}
        />
      )}
    </>
  );
};

export default NewEmployeeModal;
