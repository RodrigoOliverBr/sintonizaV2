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
import { 
  Command, 
  CommandEmpty, 
  CommandGroup, 
  CommandInput, 
  CommandItem,
  CommandList
} from "@/components/ui/command";
import { Check, ChevronsUpDown, Plus, FolderX } from "lucide-react";
import { cn } from "@/lib/utils";
import { 
  addEmployee, 
  getCompanies, 
  getDepartmentsByCompany,
  getJobRolesByCompany
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
    const loadedCompanies = getCompanies() || [];
    setCompanies(loadedCompanies);
    
    if (preselectedCompanyId) {
      setCompanyId(preselectedCompanyId);
      loadDepartments(preselectedCompanyId);
      loadJobRoles(preselectedCompanyId);
    }
  }, [preselectedCompanyId]);

  const loadJobRoles = (companyId: string) => {
    if (!companyId) {
      setJobRoles([]);
      setRoleId("");
      return;
    }
    const loadedJobRoles = getJobRolesByCompany(companyId) || [];
    setJobRoles(loadedJobRoles);
    setRoleId("");
  };

  const loadDepartments = (companyId: string) => {
    if (!companyId) {
      setDepartments([]);
      setDepartmentId("");
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
    loadJobRoles(value);
  };

  const formatCPF = (value: string) => {
    const digits = value.replace(/\D/g, "");
    
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
      departmentId,
      active: true, // Set default to active
      createdAt: new Date().toISOString(), // Set current timestamp
      updatedAt: new Date().toISOString() // Set current timestamp
    });
    
    toast({
      title: "Sucesso",
      description: "Funcionário cadastrado com sucesso!",
    });
    
    resetForm();
    onOpenChange(false);
    if (onEmployeeAdded) onEmployeeAdded();
  };

  const handleRoleSelect = (value: string) => {
    const role = jobRoles.find(r => r.name.toLowerCase() === value.toLowerCase());
    if (role) {
      setRoleId(role.id);
      setOpenRoleCombobox(false);
    }
  };
  
  const handleJobRolesUpdated = () => {
    if (companyId) {
      loadJobRoles(companyId);
    }
  };

  if (!open) {
    return null;
  }

  const hasDepartments = departments.length > 0;
  const hasRoles = jobRoles.length > 0;

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
                    disabled={!companyId}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={
                        !companyId 
                          ? "Selecione uma empresa primeiro" 
                          : hasDepartments
                            ? "Selecione um setor"
                            : "Nenhum setor cadastrado ainda"
                      } />
                    </SelectTrigger>
                    <SelectContent>
                      {hasDepartments ? (
                        departments.map((department) => (
                          <SelectItem key={department.id} value={department.id}>
                            {department.name}
                          </SelectItem>
                        ))
                      ) : (
                        <div className="flex items-center justify-center py-6 text-sm text-muted-foreground">
                          <FolderX className="mr-2 h-4 w-4" />
                          Nenhum setor cadastrado ainda 😟
                        </div>
                      )}
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
                          type="button" 
                          aria-expanded={openRoleCombobox}
                          className="w-full justify-between"
                          disabled={!companyId}
                        >
                          {roleId && hasRoles
                            ? jobRoles.find((role) => role.id === roleId)?.name
                            : !companyId 
                              ? "Selecione uma empresa primeiro"
                              : "Selecione uma função..."}
                          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-[400px] p-0">
                        {hasRoles ? (
                          <Command>
                            <CommandInput placeholder="Buscar função..." />
                            <CommandList>
                              <CommandEmpty>Nenhuma função encontrada.</CommandEmpty>
                              <CommandGroup className="max-h-60 overflow-y-auto">
                                {jobRoles.map((role) => (
                                  <CommandItem
                                    key={role.id}
                                    value={role.name}
                                    onSelect={handleRoleSelect}
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
                            </CommandList>
                          </Command>
                        ) : (
                          <div className="flex items-center justify-center py-6 text-sm text-muted-foreground">
                            <FolderX className="mr-2 h-4 w-4" />
                            {companyId 
                              ? "Nenhuma função cadastrada ainda para esta empresa 😟" 
                              : "Selecione uma empresa primeiro"}
                          </div>
                        )}
                      </PopoverContent>
                    </Popover>
                  </div>
                  <Button 
                    type="button" 
                    variant="outline" 
                    size="icon"
                    onClick={() => setIsJobRolesModalOpen(true)}
                    title="Gerenciar funções"
                    disabled={!companyId}
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
          onRolesUpdated={handleJobRolesUpdated}
          preselectedCompanyId={companyId}
        />
      )}
    </>
  );
};

export default NewEmployeeModal;
