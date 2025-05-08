
import React, { useState, useEffect } from "react";
import { PlusCircle, Search, Edit, Trash } from "lucide-react";
import AdminLayout from "@/components/AdminLayout";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { 
  getClientes, 
  addCliente, 
  updateCliente, 
  deleteCliente 
} from "@/services/adminService";
import { Cliente, TipoPessoa, ClienteStatus } from "@/types/admin";

const ClientesPage = () => {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isFormDialogOpen, setIsFormDialogOpen] = useState(false);
  const [clienteToDelete, setClienteToDelete] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<"todos" | ClienteStatus>("todos");
  const [currentCliente, setCurrentCliente] = useState<Cliente | null>(null);
  
  // Form states
  const [nome, setNome] = useState("");
  const [tipo, setTipo] = useState<TipoPessoa>("juridica");
  const [numeroEmpregados, setNumeroEmpregados] = useState("0");
  const [situacao, setSituacao] = useState<ClienteStatus>("liberado");
  const [cpfCnpj, setCpfCnpj] = useState("");
  const [email, setEmail] = useState("");
  const [telefone, setTelefone] = useState("");
  const [endereco, setEndereco] = useState("");
  const [cidade, setCidade] = useState("");
  const [estado, setEstado] = useState("");
  const [cep, setCep] = useState("");
  const [contato, setContato] = useState("");

  useEffect(() => {
    loadClientes();
  }, []);

  const loadClientes = () => {
    const clientesData = getClientes();
    setClientes(clientesData);
  };

  const handleAddCliente = () => {
    setCurrentCliente(null);
    resetForm();
    setIsFormDialogOpen(true);
  };

  const handleEditCliente = (cliente: Cliente) => {
    setCurrentCliente(cliente);
    fillForm(cliente);
    setIsFormDialogOpen(true);
  };

  const handleSaveCliente = () => {
    try {
      // Validações básicas
      if (!nome.trim() || !email.trim() || !cpfCnpj.trim()) {
        toast.error("Preencha os campos obrigatórios");
        return;
      }

      const clienteData = {
        nome,
        tipo,
        numeroEmpregados: parseInt(numeroEmpregados),
        situacao,
        cpfCnpj,
        email,
        telefone,
        endereco,
        cidade,
        estado,
        cep,
        contato,
      };

      if (currentCliente) {
        // Atualização
        updateCliente({
          ...currentCliente,
          ...clienteData,
        });
        toast.success("Cliente atualizado com sucesso");
      } else {
        // Novo cliente
        addCliente(clienteData);
        toast.success("Cliente adicionado com sucesso");
      }

      setIsFormDialogOpen(false);
      loadClientes();
    } catch (error) {
      toast.error(`Erro ao salvar cliente: ${(error as Error).message}`);
    }
  };

  const handleDeleteCliente = () => {
    if (clienteToDelete) {
      try {
        deleteCliente(clienteToDelete);
        toast.success("Cliente excluído com sucesso");
        setIsDeleteDialogOpen(false);
        loadClientes();
      } catch (error) {
        toast.error(`Erro ao excluir cliente: ${(error as Error).message}`);
      }
    }
  };

  const confirmDelete = (id: string) => {
    setClienteToDelete(id);
    setIsDeleteDialogOpen(true);
  };

  const fillForm = (cliente: Cliente) => {
    setNome(cliente.nome);
    setTipo(cliente.tipo);
    setNumeroEmpregados(cliente.numeroEmpregados.toString());
    setSituacao(cliente.situacao);
    setCpfCnpj(cliente.cpfCnpj);
    setEmail(cliente.email);
    setTelefone(cliente.telefone);
    setEndereco(cliente.endereco);
    setCidade(cliente.cidade);
    setEstado(cliente.estado);
    setCep(cliente.cep);
    setContato(cliente.contato);
  };

  const resetForm = () => {
    setNome("");
    setTipo("juridica");
    setNumeroEmpregados("0");
    setSituacao("liberado");
    setCpfCnpj("");
    setEmail("");
    setTelefone("");
    setEndereco("");
    setCidade("");
    setEstado("");
    setCep("");
    setContato("");
  };

  const filteredClientes = clientes
    .filter((cliente) =>
      cliente.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cliente.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cliente.cpfCnpj.includes(searchTerm)
    )
    .filter((cliente) =>
      statusFilter === "todos" ? true : cliente.situacao === statusFilter
    );

  return (
    <AdminLayout title="Clientes">
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row items-center gap-4 justify-between">
          <div className="w-full sm:w-auto flex-1">
            <Input
              placeholder="Buscar cliente..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full"
              icon={<Search className="h-4 w-4 text-muted-foreground" />}
            />
          </div>
          <div className="w-full sm:w-auto flex-1">
            <Select
              value={statusFilter}
              onValueChange={(value: any) => setStatusFilter(value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Filtrar por status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos os status</SelectItem>
                <SelectItem value="liberado">Liberados</SelectItem>
                <SelectItem value="bloqueado">Bloqueados</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button onClick={handleAddCliente}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Novo Cliente
          </Button>
        </div>

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Email</TableHead>
                <TableHead className="hidden md:table-cell">CPF/CNPJ</TableHead>
                <TableHead className="hidden md:table-cell">Status</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredClientes.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="h-24 text-center">
                    Nenhum cliente encontrado.
                  </TableCell>
                </TableRow>
              ) : (
                filteredClientes.map((cliente) => (
                  <TableRow key={cliente.id}>
                    <TableCell className="font-medium">{cliente.nome}</TableCell>
                    <TableCell>{cliente.email}</TableCell>
                    <TableCell className="hidden md:table-cell">{cliente.cpfCnpj}</TableCell>
                    <TableCell className="hidden md:table-cell">
                      <Badge
                        variant={cliente.situacao === "liberado" ? "outline" : "destructive"}
                      >
                        {cliente.situacao === "liberado" ? "Liberado" : "Bloqueado"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEditCliente(cliente)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => confirmDelete(cliente.id)}
                        >
                          <Trash className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Modal para criar/editar cliente */}
      <Dialog open={isFormDialogOpen} onOpenChange={setIsFormDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>
              {currentCliente ? "Editar Cliente" : "Novo Cliente"}
            </DialogTitle>
            <DialogDescription>
              {currentCliente
                ? "Atualize as informações do cliente"
                : "Preencha os dados para adicionar um novo cliente"}
            </DialogDescription>
          </DialogHeader>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="nome">Nome</Label>
              <Input
                id="nome"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                placeholder="Nome do cliente"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="tipo">Tipo de Pessoa</Label>
              <Select value={tipo} onValueChange={(value: TipoPessoa) => setTipo(value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="juridica">Pessoa Jurídica</SelectItem>
                  <SelectItem value="fisica">Pessoa Física</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="email@exemplo.com"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="cpfCnpj">CPF/CNPJ</Label>
              <Input
                id="cpfCnpj"
                value={cpfCnpj}
                onChange={(e) => setCpfCnpj(e.target.value)}
                placeholder="000.000.000-00"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="telefone">Telefone</Label>
              <Input
                id="telefone"
                value={telefone}
                onChange={(e) => setTelefone(e.target.value)}
                placeholder="(00) 0000-0000"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="contato">Nome do Contato</Label>
              <Input
                id="contato"
                value={contato}
                onChange={(e) => setContato(e.target.value)}
                placeholder="Nome do contato"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="endereco">Endereço</Label>
              <Input
                id="endereco"
                value={endereco}
                onChange={(e) => setEndereco(e.target.value)}
                placeholder="Endereço completo"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="cidade">Cidade</Label>
              <Input
                id="cidade"
                value={cidade}
                onChange={(e) => setCidade(e.target.value)}
                placeholder="Cidade"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="estado">Estado</Label>
              <Input
                id="estado"
                value={estado}
                onChange={(e) => setEstado(e.target.value)}
                placeholder="UF"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="cep">CEP</Label>
              <Input
                id="cep"
                value={cep}
                onChange={(e) => setCep(e.target.value)}
                placeholder="00000-000"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="numeroEmpregados">Número de Empregados</Label>
              <Input
                id="numeroEmpregados"
                type="number"
                min="0"
                value={numeroEmpregados}
                onChange={(e) => setNumeroEmpregados(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="situacao">Situação</Label>
              <Select value={situacao} onValueChange={(value: ClienteStatus) => setSituacao(value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione a situação" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="liberado">Liberado</SelectItem>
                  <SelectItem value="bloqueado">Bloqueado</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsFormDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSaveCliente}>Salvar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Diálogo de confirmação de exclusão */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir este cliente? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteCliente}
              className="bg-red-500 hover:bg-red-600"
            >
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AdminLayout>
  );
};

export default ClientesPage;
