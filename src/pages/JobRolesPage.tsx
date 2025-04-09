
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
import { JobRole } from "@/types/cadastro";
import { deleteJobRole, getJobRoles, addJobRole } from "@/services/storageService";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";

const JobRolesPage: React.FC = () => {
  const [jobRoles, setJobRoles] = useState<JobRole[]>([]);
  const [isNewRoleModalOpen, setIsNewRoleModalOpen] = useState(false);
  const [newRoleName, setNewRoleName] = useState("");
  const [filterTerm, setFilterTerm] = useState("");
  const { toast } = useToast();

  const loadJobRoles = () => {
    setJobRoles(getJobRoles());
  };

  useEffect(() => {
    loadJobRoles();
  }, []);

  const handleDelete = (id: string) => {
    if (window.confirm("Tem certeza que deseja excluir esta função?")) {
      deleteJobRole(id);
      loadJobRoles();
      toast({
        title: "Sucesso",
        description: "Função excluída com sucesso!",
      });
    }
  };

  const handleAddRole = () => {
    if (!newRoleName.trim()) {
      toast({
        title: "Erro",
        description: "O nome da função é obrigatório",
        variant: "destructive",
      });
      return;
    }

    try {
      addJobRole(newRoleName);
      loadJobRoles();
      setNewRoleName("");
      setIsNewRoleModalOpen(false);
      toast({
        title: "Sucesso",
        description: "Função adicionada com sucesso!",
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: error instanceof Error ? error.message : "Erro ao adicionar função",
        variant: "destructive",
      });
    }
  };

  const filteredJobRoles = jobRoles.filter(role => 
    role.name.toLowerCase().includes(filterTerm.toLowerCase())
  );

  return (
    <Layout title="Funções">
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">Funções Cadastradas</h2>
          <Button onClick={() => setIsNewRoleModalOpen(true)}>
            <Plus className="mr-2 h-4 w-4" /> Nova Função
          </Button>
        </div>

        <div className="flex mb-4">
          <Input
            placeholder="Filtrar funções..."
            value={filterTerm}
            onChange={(e) => setFilterTerm(e.target.value)}
            className="max-w-sm"
          />
        </div>
        
        <div className="rounded-md border">
          <Table>
            <TableCaption>Lista de funções cadastradas</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>Nome da Função</TableHead>
                <TableHead className="w-[100px]">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredJobRoles.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={2} className="text-center">
                    Nenhuma função encontrada
                  </TableCell>
                </TableRow>
              ) : (
                filteredJobRoles.map((role) => (
                  <TableRow key={role.id}>
                    <TableCell>{role.name}</TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(role.id)}
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

      <Dialog open={isNewRoleModalOpen} onOpenChange={setIsNewRoleModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Nova Função</DialogTitle>
            <DialogDescription>
              Digite o nome da função para cadastrá-la
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="name" className="text-right">
                Nome
              </label>
              <Input
                id="name"
                value={newRoleName}
                onChange={(e) => setNewRoleName(e.target.value)}
                className="col-span-3"
                autoFocus
              />
            </div>
          </div>
          <DialogFooter>
            <Button onClick={handleAddRole}>Cadastrar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Layout>
  );
};

export default JobRolesPage;
