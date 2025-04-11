
import React, { useState } from "react";
import AdminLayout from "@/components/AdminLayout";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Pencil, Trash2, Plus, X } from "lucide-react";
import { Plano } from "@/types/admin";
import { getPlanos, addPlano, updatePlano, deletePlano } from "@/services/adminService";
import { toast } from "sonner";

const PlanosPage: React.FC = () => {
  const [planos, setPlanos] = useState<Plano[]>(getPlanos());
  const [openNewModal, setOpenNewModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [currentPlano, setCurrentPlano] = useState<Plano | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  
  // Form fields
  const [formNome, setFormNome] = useState("");
  const [formDescricao, setFormDescricao] = useState("");
  const [formValorMensal, setFormValorMensal] = useState(0);
  const [formDuracao, setFormDuracao] = useState(12);
  const [formRecursos, setFormRecursos] = useState<string[]>([]);
  const [formAtivo, setFormAtivo] = useState(true);
  const [novoRecurso, setNovoRecurso] = useState("");
  
  const refreshPlanos = () => {
    setPlanos(getPlanos());
  };
  
  const clearForm = () => {
    setFormNome("");
    setFormDescricao("");
    setFormValorMensal(0);
    setFormDuracao(12);
    setFormRecursos([]);
    setFormAtivo(true);
    setNovoRecurso("");
  };
  
  const handleOpenEditModal = (plano: Plano) => {
    setCurrentPlano(plano);
    setFormNome(plano.nome);
    setFormDescricao(plano.descricao);
    setFormValorMensal(plano.valorMensal);
    setFormDuracao(plano.duracao);
    setFormRecursos([...plano.recursos]);
    setFormAtivo(plano.ativo);
    setOpenEditModal(true);
  };
  
  const handleOpenDeleteModal = (plano: Plano) => {
    setCurrentPlano(plano);
    setOpenDeleteModal(true);
  };
  
  const handleAddPlano = () => {
    try {
      addPlano({
        nome: formNome,
        descricao: formDescricao,
        valorMensal: formValorMensal,
        duracao: formDuracao,
        recursos: formRecursos,
        ativo: formAtivo
      });
      refreshPlanos();
      setOpenNewModal(false);
      clearForm();
      toast.success("Plano adicionado com sucesso!");
    } catch (error) {
      toast.error("Erro ao adicionar plano.");
    }
  };
  
  const handleUpdatePlano = () => {
    if (!currentPlano) return;
    
    try {
      updatePlano({
        ...currentPlano,
        nome: formNome,
        descricao: formDescricao,
        valorMensal: formValorMensal,
        duracao: formDuracao,
        recursos: formRecursos,
        ativo: formAtivo
      });
      refreshPlanos();
      setOpenEditModal(false);
      clearForm();
      toast.success("Plano atualizado com sucesso!");
    } catch (error) {
      toast.error("Erro ao atualizar plano.");
    }
  };
  
  const handleDeletePlano = () => {
    if (!currentPlano) return;
    
    try {
      deletePlano(currentPlano.id);
      refreshPlanos();
      setOpenDeleteModal(false);
      toast.success("Plano excluído com sucesso!");
    } catch (error) {
      toast.error("Erro ao excluir plano.");
    }
  };
  
  const handleAddRecurso = () => {
    if (novoRecurso.trim() !== "" && !formRecursos.includes(novoRecurso.trim())) {
      setFormRecursos([...formRecursos, novoRecurso.trim()]);
      setNovoRecurso("");
    }
  };
  
  const handleRemoveRecurso = (index: number) => {
    const newRecursos = [...formRecursos];
    newRecursos.splice(index, 1);
    setFormRecursos(newRecursos);
  };
  
  const filteredPlanos = planos.filter(plano => 
    plano.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    plano.descricao.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <AdminLayout title="Planos">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Gerenciamento de Planos</CardTitle>
              <CardDescription>
                Crie e gerencie os planos oferecidos aos clientes
              </CardDescription>
            </div>
            <Dialog open={openNewModal} onOpenChange={setOpenNewModal}>
              <DialogTrigger asChild>
                <Button className="flex items-center gap-2">
                  <Plus size={16} />
                  Novo Plano
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                  <DialogTitle>Adicionar Novo Plano</DialogTitle>
                  <DialogDescription>
                    Preencha as informações do novo plano comercial.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="nome">Nome do Plano</Label>
                    <Input id="nome" value={formNome} onChange={(e) => setFormNome(e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="descricao">Descrição</Label>
                    <Textarea 
                      id="descricao" 
                      value={formDescricao} 
                      onChange={(e) => setFormDescricao(e.target.value)}
                      rows={3}
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="valorMensal">Valor Mensal (R$)</Label>
                      <Input 
                        id="valorMensal" 
                        type="number" 
                        min={0}
                        step={0.01}
                        value={formValorMensal} 
                        onChange={(e) => setFormValorMensal(Number(e.target.value))} 
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="duracao">Duração (meses)</Label>
                      <Input 
                        id="duracao" 
                        type="number" 
                        min={1}
                        value={formDuracao} 
                        onChange={(e) => setFormDuracao(Number(e.target.value))} 
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Ativo</Label>
                    <div className="flex items-center space-x-2">
                      <input 
                        type="checkbox" 
                        id="ativo"
                        checked={formAtivo} 
                        onChange={(e) => setFormAtivo(e.target.checked)}
                        className="h-4 w-4"
                      />
                      <Label htmlFor="ativo" className="font-normal">Plano disponível para novos contratos</Label>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Recursos Incluídos</Label>
                    <div className="flex gap-2">
                      <Input 
                        placeholder="Adicionar recurso..." 
                        value={novoRecurso} 
                        onChange={(e) => setNovoRecurso(e.target.value)} 
                      />
                      <Button type="button" onClick={handleAddRecurso}>Adicionar</Button>
                    </div>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {formRecursos.map((recurso, index) => (
                        <Badge key={index} className="flex items-center gap-1">
                          {recurso}
                          <button 
                            type="button" 
                            onClick={() => handleRemoveRecurso(index)}
                            className="ml-1 p-1 rounded-full hover:bg-gray-700"
                          >
                            <X size={12} />
                          </button>
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setOpenNewModal(false)}>Cancelar</Button>
                  <Button onClick={handleAddPlano}>Salvar</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
          <div className="pt-4">
            <Input
              placeholder="Buscar plano por nome ou descrição..."
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
                <TableHead>Descrição</TableHead>
                <TableHead>Valor Mensal</TableHead>
                <TableHead>Duração</TableHead>
                <TableHead>Recursos</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPlanos.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-4 text-muted-foreground">
                    Nenhum plano encontrado.
                  </TableCell>
                </TableRow>
              ) : (
                filteredPlanos.map((plano) => (
                  <TableRow key={plano.id}>
                    <TableCell className="font-medium">{plano.nome}</TableCell>
                    <TableCell className="max-w-[200px] truncate">{plano.descricao}</TableCell>
                    <TableCell>
                      {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(plano.valorMensal)}
                    </TableCell>
                    <TableCell>{plano.duracao} meses</TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1 max-w-[200px]">
                        {plano.recursos.map((recurso, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {recurso}
                          </Badge>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={plano.ativo ? "default" : "secondary"}>
                        {plano.ativo ? "Ativo" : "Inativo"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => handleOpenEditModal(plano)}
                        >
                          <Pencil size={16} />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => handleOpenDeleteModal(plano)}
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
            <DialogTitle>Editar Plano</DialogTitle>
            <DialogDescription>
              Atualize as informações do plano comercial.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-nome">Nome do Plano</Label>
              <Input id="edit-nome" value={formNome} onChange={(e) => setFormNome(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-descricao">Descrição</Label>
              <Textarea 
                id="edit-descricao" 
                value={formDescricao} 
                onChange={(e) => setFormDescricao(e.target.value)}
                rows={3}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-valorMensal">Valor Mensal (R$)</Label>
                <Input 
                  id="edit-valorMensal" 
                  type="number" 
                  min={0}
                  step={0.01}
                  value={formValorMensal} 
                  onChange={(e) => setFormValorMensal(Number(e.target.value))} 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-duracao">Duração (meses)</Label>
                <Input 
                  id="edit-duracao" 
                  type="number" 
                  min={1}
                  value={formDuracao} 
                  onChange={(e) => setFormDuracao(Number(e.target.value))} 
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Ativo</Label>
              <div className="flex items-center space-x-2">
                <input 
                  type="checkbox" 
                  id="edit-ativo"
                  checked={formAtivo} 
                  onChange={(e) => setFormAtivo(e.target.checked)}
                  className="h-4 w-4"
                />
                <Label htmlFor="edit-ativo" className="font-normal">Plano disponível para novos contratos</Label>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Recursos Incluídos</Label>
              <div className="flex gap-2">
                <Input 
                  placeholder="Adicionar recurso..." 
                  value={novoRecurso} 
                  onChange={(e) => setNovoRecurso(e.target.value)} 
                />
                <Button type="button" onClick={handleAddRecurso}>Adicionar</Button>
              </div>
              <div className="mt-2 flex flex-wrap gap-2">
                {formRecursos.map((recurso, index) => (
                  <Badge key={index} className="flex items-center gap-1">
                    {recurso}
                    <button 
                      type="button" 
                      onClick={() => handleRemoveRecurso(index)}
                      className="ml-1 p-1 rounded-full hover:bg-gray-700"
                    >
                      <X size={12} />
                    </button>
                  </Badge>
                ))}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpenEditModal(false)}>Cancelar</Button>
            <Button onClick={handleUpdatePlano}>Salvar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Modal de Exclusão */}
      <Dialog open={openDeleteModal} onOpenChange={setOpenDeleteModal}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Confirmar exclusão</DialogTitle>
            <DialogDescription>
              Você está prestes a excluir o plano "{currentPlano?.nome}". Esta ação não pode ser desfeita.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpenDeleteModal(false)}>Cancelar</Button>
            <Button variant="destructive" onClick={handleDeletePlano}>Excluir</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
};

export default PlanosPage;
