import React, { useState, useEffect } from "react";
import AdminLayout from "@/components/AdminLayout";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Pencil, Trash2, Plus, Calendar, RefreshCw } from "lucide-react";
import { Contrato, StatusContrato, CicloFaturamento, Cliente, Plano } from "@/types/admin";
import { 
  getContratos, addContrato, updateContrato, deleteContrato, 
  getClientes, getPlanos, getClienteById, getPlanoById,
  renovarContrato, calcularDataProximaRenovacao
} from "@/services/adminService";
import { toast } from "sonner";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useSearchParams } from "react-router-dom";

const ContratosPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const editId = searchParams.get("edit");
  
  const [contratos, setContratos] = useState<Contrato[]>(getContratos());
  const [clientes, setClientes] = useState<Cliente[]>(getClientes());
  const [planos, setPlanos] = useState<Plano[]>(getPlanos());
  const [openNewModal, setOpenNewModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [currentContrato, setCurrentContrato] = useState<Contrato | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  
  const [formClienteId, setFormClienteId] = useState("");
  const [formPlanoId, setFormPlanoId] = useState("");
  const [formDataInicio, setFormDataInicio] = useState("");
  const [formDataFim, setFormDataFim] = useState("");
  const [formValorMensal, setFormValorMensal] = useState(0);
  const [formStatus, setFormStatus] = useState<StatusContrato>("ativo");
  const [formTaxaImplantacao, setFormTaxaImplantacao] = useState(0);
  const [formObservacoes, setFormObservacoes] = useState("");
  const [formCicloFaturamento, setFormCicloFaturamento] = useState<CicloFaturamento>("mensal");
  
  useEffect(() => {
    if (editId) {
      const contrato = contratos.find(c => c.id === editId);
      if (contrato) {
        handleOpenEditModal(contrato);
      }
    }
  }, [editId]);
  
  useEffect(() => {
    if (formPlanoId) {
      const plano = getPlanoById(formPlanoId);
      if (plano) {
        setFormValorMensal(plano.valorMensal);
        setFormTaxaImplantacao(plano.valorImplantacao);
        
        const hoje = new Date();
        setFormDataInicio(formatToDateInput(hoje.getTime()));
        
        if (plano.semVencimento) {
          setFormDataFim("");
        } else if (plano.dataValidade) {
          const dataFim = new Date(hoje.getTime() + (plano.dataValidade - Date.now()));
          setFormDataFim(formatToDateInput(dataFim.getTime()));
        }
      }
    }
  }, [formPlanoId]);
  
  const refreshContratos = () => {
    setContratos(getContratos());
  };
  
  const clearForm = () => {
    setFormClienteId("");
    setFormPlanoId("");
    setFormDataInicio("");
    setFormDataFim("");
    setFormValorMensal(0);
    setFormStatus("ativo");
    setFormTaxaImplantacao(0);
    setFormObservacoes("");
    setFormCicloFaturamento("mensal");
  };
  
  const formatToDateInput = (timestamp: number): string => {
    const date = new Date(timestamp);
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
  };
  
  const handleOpenEditModal = (contrato: Contrato) => {
    setCurrentContrato(contrato);
    setFormClienteId(contrato.clienteId);
    setFormPlanoId(contrato.planoId);
    setFormDataInicio(formatToDateInput(contrato.dataInicio));
    setFormDataFim(formatToDateInput(contrato.dataFim));
    setFormValorMensal(contrato.valorMensal);
    setFormStatus(contrato.status);
    setFormTaxaImplantacao(contrato.taxaImplantacao);
    setFormObservacoes(contrato.observacoes);
    setFormCicloFaturamento(contrato.cicloFaturamento);
    setOpenEditModal(true);
  };
  
  const handleOpenDeleteModal = (contrato: Contrato) => {
    setCurrentContrato(contrato);
    setOpenDeleteModal(true);
  };
  
  const handleRenovarContrato = (contrato: Contrato) => {
    try {
      const contratoRenovado = renovarContrato(contrato.id);
      if (contratoRenovado) {
        refreshContratos();
        toast.success("Contrato renovado com sucesso por mais 12 meses!");
      }
    } catch (error) {
      toast.error("Erro ao renovar contrato.");
    }
  };
  
  const handleAddContrato = () => {
    try {
      const dataInicio = new Date(formDataInicio).getTime();
      
      const planoSelecionado = getPlanoById(formPlanoId);
      let dataFim: number;
      
      if (planoSelecionado?.semVencimento) {
        dataFim = calcularDataProximaRenovacao(
          new Date(dataInicio),
          formCicloFaturamento,
          12
        );
      } else {
        dataFim = new Date(formDataFim).getTime();
      }
      
      const novoContrato = addContrato({
        clienteId: formClienteId,
        planoId: formPlanoId,
        dataInicio,
        dataFim,
        valorMensal: formValorMensal,
        status: formStatus,
        taxaImplantacao: formTaxaImplantacao,
        observacoes: formObservacoes,
        cicloFaturamento: formCicloFaturamento
      });
      
      refreshContratos();
      setOpenNewModal(false);
      clearForm();
      toast.success("Contrato adicionado com sucesso! Faturas programadas foram geradas automaticamente.");
    } catch (error) {
      toast.error("Erro ao adicionar contrato.");
    }
  };
  
  const handleUpdateContrato = () => {
    if (!currentContrato) return;
    
    try {
      const dataInicio = new Date(formDataInicio).getTime();
      
      const planoSelecionado = getPlanoById(formPlanoId);
      let dataFim: number;
      
      if (planoSelecionado?.semVencimento) {
        dataFim = calcularDataProximaRenovacao(
          new Date(dataInicio),
          formCicloFaturamento,
          12
        );
      } else {
        dataFim = new Date(formDataFim).getTime();
      }
      
      const contratoAtualizado: Contrato = {
        ...currentContrato,
        clienteId: formClienteId,
        planoId: formPlanoId,
        dataInicio,
        dataFim,
        valorMensal: formValorMensal,
        status: formStatus,
        taxaImplantacao: formTaxaImplantacao,
        observacoes: formObservacoes,
        cicloFaturamento: formCicloFaturamento
      };
      
      if (planoSelecionado?.semVencimento) {
        contratoAtualizado.proximaRenovacao = dataFim;
      } else {
        delete contratoAtualizado.proximaRenovacao;
      }
      
      updateContrato(contratoAtualizado);
      refreshContratos();
      setOpenEditModal(false);
      clearForm();
      toast.success("Contrato atualizado com sucesso!");
    } catch (error) {
      toast.error("Erro ao atualizar contrato.");
    }
  };
  
  const handleDeleteContrato = () => {
    if (!currentContrato) return;
    
    try {
      deleteContrato(currentContrato.id);
      refreshContratos();
      setOpenDeleteModal(false);
      toast.success("Contrato excluído com sucesso!");
    } catch (error) {
      toast.error("Erro ao excluir contrato.");
    }
  };
  
  const clienteNome = (id: string): string => {
    const cliente = getClienteById(id);
    return cliente ? cliente.nome : "Cliente não encontrado";
  };
  
  const planoNome = (id: string): string => {
    const plano = getPlanoById(id);
    return plano ? plano.nome : "Plano não encontrado";
  };
  
  const filteredContratos = contratos.filter(contrato => {
    const cliente = getClienteById(contrato.clienteId);
    const plano = getPlanoById(contrato.planoId);
    const clienteNome = cliente ? cliente.nome.toLowerCase() : "";
    const planoNome = plano ? plano.nome.toLowerCase() : "";
    const contratoNumero = contrato.numero.toLowerCase();
    
    return clienteNome.includes(searchTerm.toLowerCase()) ||
           planoNome.includes(searchTerm.toLowerCase()) ||
           contratoNumero.includes(searchTerm.toLowerCase());
  });

  return (
    <AdminLayout title="Contratos">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Gerenciamento de Contratos</CardTitle>
              <CardDescription>
                Cadastre e gerencie os contratos dos clientes
              </CardDescription>
            </div>
            <Dialog open={openNewModal} onOpenChange={setOpenNewModal}>
              <DialogTrigger asChild>
                <Button className="flex items-center gap-2">
                  <Plus size={16} />
                  Novo Contrato
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                  <DialogTitle>Adicionar Novo Contrato</DialogTitle>
                  <DialogDescription>
                    Preencha as informações do novo contrato.
                    {formPlanoId && getPlanoById(formPlanoId)?.semVencimento && (
                      <div className="mt-2 p-2 bg-yellow-50 border border-yellow-200 rounded-md text-sm">
                        <strong>Nota:</strong> Este contrato não possui data de término definida. 
                        O sistema irá gerar faturas para 12 ciclos de cobrança, conforme o plano selecionado.
                        Após esse período, será necessária uma renovação.
                      </div>
                    )}
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="clienteId">Cliente</Label>
                    <Select 
                      value={formClienteId} 
                      onValueChange={setFormClienteId}
                    >
                      <SelectTrigger id="clienteId">
                        <SelectValue placeholder="Selecione o cliente" />
                      </SelectTrigger>
                      <SelectContent>
                        {clientes.map(cliente => (
                          <SelectItem key={cliente.id} value={cliente.id}>
                            {cliente.nome}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="planoId">Plano</Label>
                    <Select 
                      value={formPlanoId} 
                      onValueChange={setFormPlanoId}
                    >
                      <SelectTrigger id="planoId">
                        <SelectValue placeholder="Selecione o plano" />
                      </SelectTrigger>
                      <SelectContent>
                        {planos.filter(p => p.ativo).map(plano => (
                          <SelectItem key={plano.id} value={plano.id}>
                            {plano.nome} - {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(plano.valorMensal)}/mês
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="dataInicio">Data de Início</Label>
                      <div className="flex items-center">
                        <Calendar className="mr-2 h-4 w-4 opacity-50" />
                        <Input 
                          id="dataInicio" 
                          type="date"
                          value={formDataInicio} 
                          onChange={(e) => setFormDataInicio(e.target.value)} 
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="dataFim">Data de Término</Label>
                      <div className="flex items-center">
                        <Calendar className="mr-2 h-4 w-4 opacity-50" />
                        <Input 
                          id="dataFim" 
                          type="date"
                          value={formDataFim} 
                          onChange={(e) => setFormDataFim(e.target.value)}
                          disabled={formPlanoId && getPlanoById(formPlanoId)?.semVencimento}
                        />
                      </div>
                    </div>
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
                      <Label htmlFor="taxaImplantacao">Taxa de Implantação (R$)</Label>
                      <Input 
                        id="taxaImplantacao" 
                        type="number" 
                        min={0}
                        step={0.01}
                        value={formTaxaImplantacao} 
                        onChange={(e) => setFormTaxaImplantacao(Number(e.target.value))} 
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="status">Status</Label>
                      <Select 
                        value={formStatus} 
                        onValueChange={(value: StatusContrato) => setFormStatus(value)}
                      >
                        <SelectTrigger id="status">
                          <SelectValue placeholder="Selecione o status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="ativo">Ativo</SelectItem>
                          <SelectItem value="em-analise">Em Análise</SelectItem>
                          <SelectItem value="cancelado">Cancelado</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="cicloFaturamento">Ciclo de Faturamento</Label>
                      <Select 
                        value={formCicloFaturamento} 
                        onValueChange={(value: CicloFaturamento) => setFormCicloFaturamento(value)}
                      >
                        <SelectTrigger id="cicloFaturamento">
                          <SelectValue placeholder="Selecione o ciclo" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="mensal">Mensal</SelectItem>
                          <SelectItem value="trimestral">Trimestral</SelectItem>
                          <SelectItem value="anual">Anual</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="observacoes">Observações</Label>
                    <Textarea 
                      id="observacoes" 
                      value={formObservacoes} 
                      onChange={(e) => setFormObservacoes(e.target.value)}
                      rows={3}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setOpenNewModal(false)}>Cancelar</Button>
                  <Button onClick={handleAddContrato}>Salvar</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
          <div className="pt-4">
            <Input
              placeholder="Buscar contrato por cliente ou plano..."
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
                <TableHead>Número</TableHead>
                <TableHead>Cliente</TableHead>
                <TableHead>Plano</TableHead>
                <TableHead>Período</TableHead>
                <TableHead>Valor Mensal</TableHead>
                <TableHead>Ciclo</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredContratos.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-4 text-muted-foreground">
                    Nenhum contrato encontrado.
                  </TableCell>
                </TableRow>
              ) : (
                filteredContratos.map((contrato) => {
                  const plano = getPlanoById(contrato.planoId);
                  const isRenovavel = plano?.semVencimento && contrato.status === "ativo";
                  const isProximoRenovacao = contrato.proximaRenovacao && 
                    (contrato.proximaRenovacao - Date.now()) < 30 * 24 * 60 * 60 * 1000; // 30 dias
                  
                  return (
                    <TableRow key={contrato.id} className={isProximoRenovacao ? "bg-yellow-50" : ""}>
                      <TableCell className="font-medium">{contrato.numero}</TableCell>
                      <TableCell>{clienteNome(contrato.clienteId)}</TableCell>
                      <TableCell>{planoNome(contrato.planoId)}</TableCell>
                      <TableCell>
                        {format(new Date(contrato.dataInicio), "dd/MM/yyyy", {locale: ptBR})} a{' '}
                        {plano?.semVencimento 
                          ? <span className="text-amber-600 font-medium">
                              {contrato.proximaRenovacao 
                                ? format(new Date(contrato.proximaRenovacao), "dd/MM/yyyy", {locale: ptBR}) + " *" 
                                : "Sem término"}
                            </span>
                          : format(new Date(contrato.dataFim), "dd/MM/yyyy", {locale: ptBR})
                        }
                      </TableCell>
                      <TableCell>
                        {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(contrato.valorMensal)}
                      </TableCell>
                      <TableCell>
                        {contrato.cicloFaturamento === "mensal" ? "Mensal" : 
                        contrato.cicloFaturamento === "trimestral" ? "Trimestral" : "Anual"}
                      </TableCell>
                      <TableCell>
                        <Badge 
                          variant={
                            contrato.status === "ativo" ? "default" : 
                            contrato.status === "em-analise" ? "outline" : "secondary"
                          }
                        >
                          {contrato.status === "ativo" ? "Ativo" : 
                          contrato.status === "em-analise" ? "Em Análise" : "Cancelado"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          {isRenovavel && (
                            <Button 
                              variant="outline" 
                              size="icon"
                              title="Renovar contrato por mais 12 meses"
                              onClick={() => handleRenovarContrato(contrato)}
                              className={isProximoRenovacao ? "border-amber-500 text-amber-600 hover:text-amber-700" : ""}
                            >
                              <RefreshCw size={16} />
                            </Button>
                          )}
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={() => handleOpenEditModal(contrato)}
                          >
                            <Pencil size={16} />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={() => handleOpenDeleteModal(contrato)}
                          >
                            <Trash2 size={16} />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
          
          {filteredContratos.some(c => getPlanoById(c.planoId)?.semVencimento) && (
            <div className="mt-4 text-sm text-muted-foreground">
              * Contratos sem data de término definida têm um ciclo de faturamento de 12 meses, após o qual precisam ser renovados.
            </div>
          )}
        </CardContent>
      </Card>
      
      <Dialog open={openEditModal} onOpenChange={setOpenEditModal}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Editar Contrato</DialogTitle>
            <DialogDescription>
              Atualize as informações do contrato.
              {formPlanoId && getPlanoById(formPlanoId)?.semVencimento && (
                <div className="mt-2 p-2 bg-yellow-50 border border-yellow-200 rounded-md text-sm">
                  <strong>Nota:</strong> Este contrato não possui data de término definida. 
                  O sistema irá gerar faturas para 12 ciclos de cobrança, conforme o plano selecionado.
                  Após esse período, será necessária uma renovação.
                </div>
              )}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-clienteId">Cliente</Label>
              <Select 
                value={formClienteId} 
                onValueChange={setFormClienteId}
              >
                <SelectTrigger id="edit-clienteId">
                  <SelectValue placeholder="Selecione o cliente" />
                </SelectTrigger>
                <SelectContent>
                  {clientes.map(cliente => (
                    <SelectItem key={cliente.id} value={cliente.id}>
                      {cliente.nome}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-planoId">Plano</Label>
              <Select 
                value={formPlanoId} 
                onValueChange={setFormPlanoId}
              >
                <SelectTrigger id="edit-planoId">
                  <SelectValue placeholder="Selecione o plano" />
                </SelectTrigger>
                <SelectContent>
                  {planos.map(plano => (
                    <SelectItem key={plano.id} value={plano.id}>
                      {plano.nome} - {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(plano.valorMensal)}/mês
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-dataInicio">Data de Início</Label>
                <div className="flex items-center">
                  <Calendar className="mr-2 h-4 w-4 opacity-50" />
                  <Input 
                    id="edit-dataInicio" 
                    type="date"
                    value={formDataInicio} 
                    onChange={(e) => setFormDataInicio(e.target.value)} 
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-dataFim">Data de Término</Label>
                <div className="flex items-center">
                  <Calendar className="mr-2 h-4 w-4 opacity-50" />
                  <Input 
                    id="edit-dataFim" 
                    type="date"
                    value={formDataFim} 
                    onChange={(e) => setFormDataFim(e.target.value)}
                    disabled={formPlanoId && getPlanoById(formPlanoId)?.semVencimento}
                  />
                </div>
              </div>
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
                <Label htmlFor="edit-taxaImplantacao">Taxa de Implantação (R$)</Label>
                <Input 
                  id="edit-taxaImplantacao" 
                  type="number" 
                  min={0}
                  step={0.01}
                  value={formTaxaImplantacao} 
                  onChange={(e) => setFormTaxaImplantacao(Number(e.target.value))} 
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-status">Status</Label>
                <Select 
                  value={formStatus} 
                  onValueChange={(value: StatusContrato) => setFormStatus(value)}
                >
                  <SelectTrigger id="edit-status">
                    <SelectValue placeholder="Selecione o status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ativo">Ativo</SelectItem>
                    <SelectItem value="em-analise">Em Análise</SelectItem>
                    <SelectItem value="cancelado">Cancelado</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-cicloFaturamento">Ciclo de Faturamento</Label>
                <Select 
                  value={formCicloFaturamento} 
                  onValueChange={(value: CicloFaturamento) => setFormCicloFaturamento(value)}
                >
                  <SelectTrigger id="edit-cicloFaturamento">
                    <SelectValue placeholder="Selecione o ciclo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="mensal">Mensal</SelectItem>
                    <SelectItem value="trimestral">Trimestral</SelectItem>
                    <SelectItem value="anual">Anual</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-observacoes">Observações</Label>
              <Textarea 
                id="edit-observacoes" 
                value={formObservacoes} 
                onChange={(e) => setFormObservacoes(e.target.value)}
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpenEditModal(false)}>Cancelar</Button>
            <Button onClick={handleUpdateContrato}>Salvar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      <Dialog open={openDeleteModal} onOpenChange={setOpenDeleteModal}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Confirmar exclusão</DialogTitle>
            <DialogDescription>
              Você está prestes a excluir o contrato "{currentContrato?.numero}". Esta ação não pode ser desfeita.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpenDeleteModal(false)}>Cancelar</Button>
            <Button variant="destructive" onClick={handleDeleteContrato}>Excluir</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
};

export default ContratosPage;
