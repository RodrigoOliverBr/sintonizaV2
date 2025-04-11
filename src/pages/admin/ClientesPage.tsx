
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminLayout from "@/components/AdminLayout";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Pencil, Trash2, Plus, ExternalLink } from "lucide-react";
import { Cliente, TipoPessoa, ClienteStatus } from "@/types/admin";
import { getClientes, addCliente, updateCliente, deleteCliente } from "@/services/adminService";
import { toast } from "sonner";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

const ClientesPage: React.FC = () => {
  const [clientes, setClientes] = useState<Cliente[]>(getClientes());
  const [openNewModal, setOpenNewModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [currentCliente, setCurrentCliente] = useState<Cliente | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  
  // Form fields
  const [formNome, setFormNome] = useState("");
  const [formTipo, setFormTipo] = useState<TipoPessoa>("juridica");
  const [formNumeroEmpregados, setFormNumeroEmpregados] = useState(0);
  const [formSituacao, setFormSituacao] = useState<ClienteStatus>("liberado");
  const [formCpfCnpj, setFormCpfCnpj] = useState("");
  const [formEmail, setFormEmail] = useState("");
  const [formTelefone, setFormTelefone] = useState("");
  const [formEndereco, setFormEndereco] = useState("");
  const [formCidade, setFormCidade] = useState("");
  const [formEstado, setFormEstado] = useState("");
  const [formCep, setFormCep] = useState("");
  const [formContato, setFormContato] = useState("");
  
  const navigate = useNavigate();
  
  const refreshClientes = () => {
    setClientes(getClientes());
  };
  
  const clearForm = () => {
    setFormNome("");
    setFormTipo("juridica");
    setFormNumeroEmpregados(0);
    setFormSituacao("liberado");
    setFormCpfCnpj("");
    setFormEmail("");
    setFormTelefone("");
    setFormEndereco("");
    setFormCidade("");
    setFormEstado("");
    setFormCep("");
    setFormContato("");
  };
  
  const handleOpenEditModal = (cliente: Cliente) => {
    setCurrentCliente(cliente);
    setFormNome(cliente.nome);
    setFormTipo(cliente.tipo);
    setFormNumeroEmpregados(cliente.numeroEmpregados);
    setFormSituacao(cliente.situacao);
    setFormCpfCnpj(cliente.cpfCnpj);
    setFormEmail(cliente.email);
    setFormTelefone(cliente.telefone);
    setFormEndereco(cliente.endereco);
    setFormCidade(cliente.cidade);
    setFormEstado(cliente.estado);
    setFormCep(cliente.cep);
    setFormContato(cliente.contato);
    setOpenEditModal(true);
  };
  
  const handleOpenDeleteModal = (cliente: Cliente) => {
    setCurrentCliente(cliente);
    setOpenDeleteModal(true);
  };
  
  const handleAddCliente = () => {
    try {
      addCliente({
        nome: formNome,
        tipo: formTipo,
        numeroEmpregados: formNumeroEmpregados,
        situacao: formSituacao,
        cpfCnpj: formCpfCnpj,
        email: formEmail,
        telefone: formTelefone,
        endereco: formEndereco,
        cidade: formCidade,
        estado: formEstado,
        cep: formCep,
        contato: formContato
      });
      refreshClientes();
      setOpenNewModal(false);
      clearForm();
      toast.success("Cliente adicionado com sucesso!");
    } catch (error) {
      toast.error("Erro ao adicionar cliente.");
    }
  };
  
  const handleUpdateCliente = () => {
    if (!currentCliente) return;
    
    try {
      updateCliente({
        ...currentCliente,
        nome: formNome,
        tipo: formTipo,
        numeroEmpregados: formNumeroEmpregados,
        situacao: formSituacao,
        cpfCnpj: formCpfCnpj,
        email: formEmail,
        telefone: formTelefone,
        endereco: formEndereco,
        cidade: formCidade,
        estado: formEstado,
        cep: formCep,
        contato: formContato
      });
      refreshClientes();
      setOpenEditModal(false);
      clearForm();
      toast.success("Cliente atualizado com sucesso!");
    } catch (error) {
      toast.error("Erro ao atualizar cliente.");
    }
  };
  
  const handleDeleteCliente = () => {
    if (!currentCliente) return;
    
    try {
      deleteCliente(currentCliente.id);
      refreshClientes();
      setOpenDeleteModal(false);
      toast.success("Cliente excluído com sucesso!");
    } catch (error) {
      toast.error("Erro ao excluir cliente.");
    }
  };
  
  const handleAccessClienteArea = (cliente: Cliente) => {
    // Em uma implementação real, isso poderia fazer login como o cliente
    localStorage.setItem("sintonia:userType", "cliente");
    localStorage.setItem("sintonia:currentCliente", JSON.stringify(cliente));
    navigate("/");
  };
  
  const filteredClientes = clientes.filter(cliente => 
    cliente.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cliente.cpfCnpj.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <AdminLayout title="Clientes">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Gerenciamento de Clientes</CardTitle>
              <CardDescription>
                Cadastre e gerencie os clientes que utilizam o sistema
              </CardDescription>
            </div>
            <Dialog open={openNewModal} onOpenChange={setOpenNewModal}>
              <DialogTrigger asChild>
                <Button className="flex items-center gap-2">
                  <Plus size={16} />
                  Novo Cliente
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                  <DialogTitle>Adicionar Novo Cliente</DialogTitle>
                  <DialogDescription>
                    Preencha as informações do novo cliente.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="nome">Nome</Label>
                    <Input id="nome" value={formNome} onChange={(e) => setFormNome(e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="tipo">Tipo</Label>
                    <Select 
                      value={formTipo} 
                      onValueChange={(value: TipoPessoa) => setFormTipo(value)}
                    >
                      <SelectTrigger id="tipo">
                        <SelectValue placeholder="Selecione o tipo" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="fisica">Pessoa Física</SelectItem>
                        <SelectItem value="juridica">Pessoa Jurídica</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cpfCnpj">CPF/CNPJ</Label>
                    <Input id="cpfCnpj" value={formCpfCnpj} onChange={(e) => setFormCpfCnpj(e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="numeroEmpregados">Número de Empregados</Label>
                    <Input 
                      id="numeroEmpregados" 
                      type="number" 
                      min={0}
                      value={formNumeroEmpregados} 
                      onChange={(e) => setFormNumeroEmpregados(Number(e.target.value))} 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" value={formEmail} onChange={(e) => setFormEmail(e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="telefone">Telefone</Label>
                    <Input id="telefone" value={formTelefone} onChange={(e) => setFormTelefone(e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="contato">Nome do Contato</Label>
                    <Input id="contato" value={formContato} onChange={(e) => setFormContato(e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="situacao">Situação</Label>
                    <Select 
                      value={formSituacao} 
                      onValueChange={(value: ClienteStatus) => setFormSituacao(value)}
                    >
                      <SelectTrigger id="situacao">
                        <SelectValue placeholder="Selecione a situação" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="liberado">Liberado</SelectItem>
                        <SelectItem value="bloqueado">Bloqueado</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="endereco">Endereço</Label>
                    <Input id="endereco" value={formEndereco} onChange={(e) => setFormEndereco(e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cidade">Cidade</Label>
                    <Input id="cidade" value={formCidade} onChange={(e) => setFormCidade(e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="estado">Estado</Label>
                    <Input id="estado" value={formEstado} onChange={(e) => setFormEstado(e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cep">CEP</Label>
                    <Input id="cep" value={formCep} onChange={(e) => setFormCep(e.target.value)} />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setOpenNewModal(false)}>Cancelar</Button>
                  <Button onClick={handleAddCliente}>Salvar</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
          <div className="pt-4">
            <Input
              placeholder="Buscar cliente por nome ou CPF/CNPJ..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-xl"
            />
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>CPF/CNPJ</TableHead>
                <TableHead>Funcionários</TableHead>
                <TableHead>Data de Inclusão</TableHead>
                <TableHead>Situação</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredClientes.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-4 text-muted-foreground">
                    Nenhum cliente encontrado.
                  </TableCell>
                </TableRow>
              ) : (
                filteredClientes.map((cliente) => (
                  <TableRow key={cliente.id}>
                    <TableCell className="font-medium">{cliente.nome}</TableCell>
                    <TableCell>{cliente.tipo === "fisica" ? "Pessoa Física" : "Pessoa Jurídica"}</TableCell>
                    <TableCell>{cliente.cpfCnpj}</TableCell>
                    <TableCell>{cliente.numeroEmpregados}</TableCell>
                    <TableCell>
                      {format(new Date(cliente.dataInclusao), "dd/MM/yyyy", {locale: ptBR})}
                    </TableCell>
                    <TableCell>
                      <Badge variant={cliente.situacao === "liberado" ? "default" : "destructive"}>
                        {cliente.situacao === "liberado" ? "Liberado" : "Bloqueado"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => handleAccessClienteArea(cliente)}
                          title="Acessar Área do Cliente"
                        >
                          <ExternalLink size={16} />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => handleOpenEditModal(cliente)}
                        >
                          <Pencil size={16} />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => handleOpenDeleteModal(cliente)}
                        >
                          <Trash2 size={16} />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      
      {/* Modal de Edição */}
      <Dialog open={openEditModal} onOpenChange={setOpenEditModal}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Editar Cliente</DialogTitle>
            <DialogDescription>
              Atualize as informações do cliente.
            </DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-nome">Nome</Label>
              <Input id="edit-nome" value={formNome} onChange={(e) => setFormNome(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-tipo">Tipo</Label>
              <Select 
                value={formTipo} 
                onValueChange={(value: TipoPessoa) => setFormTipo(value)}
              >
                <SelectTrigger id="edit-tipo">
                  <SelectValue placeholder="Selecione o tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="fisica">Pessoa Física</SelectItem>
                  <SelectItem value="juridica">Pessoa Jurídica</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-cpfCnpj">CPF/CNPJ</Label>
              <Input id="edit-cpfCnpj" value={formCpfCnpj} onChange={(e) => setFormCpfCnpj(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-numeroEmpregados">Número de Empregados</Label>
              <Input 
                id="edit-numeroEmpregados" 
                type="number" 
                min={0}
                value={formNumeroEmpregados} 
                onChange={(e) => setFormNumeroEmpregados(Number(e.target.value))} 
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-email">Email</Label>
              <Input id="edit-email" type="email" value={formEmail} onChange={(e) => setFormEmail(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-telefone">Telefone</Label>
              <Input id="edit-telefone" value={formTelefone} onChange={(e) => setFormTelefone(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-contato">Nome do Contato</Label>
              <Input id="edit-contato" value={formContato} onChange={(e) => setFormContato(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-situacao">Situação</Label>
              <Select 
                value={formSituacao} 
                onValueChange={(value: ClienteStatus) => setFormSituacao(value)}
              >
                <SelectTrigger id="edit-situacao">
                  <SelectValue placeholder="Selecione a situação" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="liberado">Liberado</SelectItem>
                  <SelectItem value="bloqueado">Bloqueado</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-endereco">Endereço</Label>
              <Input id="edit-endereco" value={formEndereco} onChange={(e) => setFormEndereco(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-cidade">Cidade</Label>
              <Input id="edit-cidade" value={formCidade} onChange={(e) => setFormCidade(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-estado">Estado</Label>
              <Input id="edit-estado" value={formEstado} onChange={(e) => setFormEstado(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-cep">CEP</Label>
              <Input id="edit-cep" value={formCep} onChange={(e) => setFormCep(e.target.value)} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpenEditModal(false)}>Cancelar</Button>
            <Button onClick={handleUpdateCliente}>Salvar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Modal de Exclusão */}
      <Dialog open={openDeleteModal} onOpenChange={setOpenDeleteModal}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Confirmar exclusão</DialogTitle>
            <DialogDescription>
              Você está prestes a excluir o cliente "{currentCliente?.nome}". Esta ação não pode ser desfeita.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpenDeleteModal(false)}>Cancelar</Button>
            <Button variant="destructive" onClick={handleDeleteCliente}>Excluir</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
};

export default ClientesPage;
