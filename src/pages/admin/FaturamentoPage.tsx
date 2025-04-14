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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Pencil, Trash2, Plus, Calendar, FileText } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Fatura, StatusFatura, Cliente, Contrato, BatchSelection } from "@/types/admin";
import { getFaturas, addFatura, updateFatura, deleteFatura, getClientes, getContratos, getClienteById, getContratoById } from "@/services/adminService";
import { toast } from "sonner";
import { format, addMonths } from "date-fns";
import { ptBR } from "date-fns/locale";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import InvoicePreview from "@/components/admin/InvoicePreview";

const FaturamentoPage: React.FC = () => {
  const [faturas, setFaturas] = useState<Fatura[]>(getFaturas());
  const [clientes, setClientes] = useState<Cliente[]>(getClientes());
  const [contratos, setContratos] = useState<Contrato[]>(getContratos());
  const [openNewModal, setOpenNewModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [openBatchDeleteModal, setOpenBatchDeleteModal] = useState(false);
  const [openBatchStatusModal, setOpenBatchStatusModal] = useState(false);
  const [currentFatura, setCurrentFatura] = useState<Fatura | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<StatusFatura | "todos">("todos");
  const [anoFiltro, setAnoFiltro] = useState<string>(new Date().getFullYear().toString());
  
  const [formClienteId, setFormClienteId] = useState("");
  const [formContratoId, setFormContratoId] = useState("");
  const [formDataEmissao, setFormDataEmissao] = useState("");
  const [formDataVencimento, setFormDataVencimento] = useState("");
  const [formValor, setFormValor] = useState(0);
  const [formStatus, setFormStatus] = useState<StatusFatura>("pendente");
  const [formReferencia, setFormReferencia] = useState("");
  
  const [contratosCliente, setContratosCliente] = useState<Contrato[]>([]);
  
  const [mesFiltro, setMesFiltro] = useState<string>("todos");
  
  const [selectedFaturas, setSelectedFaturas] = useState<BatchSelection>({});
  const [selectAll, setSelectAll] = useState(false);
  
  const [previewFatura, setPreviewFatura] = useState<Fatura | null>(null);
  
  useEffect(() => {
    if (formClienteId) {
      const contratosFiltrados = contratos.filter(c => c.clienteId === formClienteId && c.status === 'ativo');
      setContratosCliente(contratosFiltrados);
      
      if (contratosFiltrados.length > 0) {
        setFormContratoId(contratosFiltrados[0].id);
      } else {
        setFormContratoId("");
      }
    } else {
      setContratosCliente([]);
      setFormContratoId("");
    }
  }, [formClienteId, contratos]);
  
  useEffect(() => {
    if (formContratoId) {
      const contrato = getContratoById(formContratoId);
      if (contrato) {
        setFormValor(contrato.valorMensal);
        
        const hoje = new Date();
        const mes = (hoje.getMonth() + 1).toString().padStart(2, '0');
        const ano = hoje.getFullYear();
        setFormReferencia(`${mes}/${ano}`);
        
        const dataEmissao = new Date();
        setFormDataEmissao(format(dataEmissao, "yyyy-MM-dd"));
        
        const dataVencimento = addMonths(dataEmissao, 1);
        dataVencimento.setDate(10);
        setFormDataVencimento(format(dataVencimento, "yyyy-MM-dd"));
      }
    }
  }, [formContratoId]);
  
  useEffect(() => {
    if (selectAll) {
      const newSelected: BatchSelection = {};
      filteredFaturas.forEach(fatura => {
        newSelected[fatura.id] = true;
      });
      setSelectedFaturas(newSelected);
    } else {
    }
  }, [selectAll]);
  
  const refreshFaturas = () => {
    setFaturas(getFaturas());
  };
  
  const clearForm = () => {
    setFormClienteId("");
    setFormContratoId("");
    setFormDataEmissao("");
    setFormDataVencimento("");
    setFormValor(0);
    setFormStatus("pendente");
    setFormReferencia("");
  };
  
  const formatToDateInput = (timestamp: number): string => {
    const date = new Date(timestamp);
    return format(date, "yyyy-MM-dd");
  };
  
  const handleOpenEditModal = (fatura: Fatura) => {
    setCurrentFatura(fatura);
    setFormClienteId(fatura.clienteId);
    setFormContratoId(fatura.contratoId);
    setFormDataEmissao(formatToDateInput(fatura.dataEmissao));
    setFormDataVencimento(formatToDateInput(fatura.dataVencimento));
    setFormValor(fatura.valor);
    setFormStatus(fatura.status);
    setFormReferencia(fatura.referencia);
    setOpenEditModal(true);
  };
  
  const handleOpenDeleteModal = (fatura: Fatura) => {
    setCurrentFatura(fatura);
    setOpenDeleteModal(true);
  };
  
  const handleOpenPreview = (fatura: Fatura) => {
    setPreviewFatura(fatura);
  };
  
  const handleAddFatura = () => {
    try {
      const dataEmissao = new Date(formDataEmissao).getTime();
      const dataVencimento = new Date(formDataVencimento).getTime();
      
      const existingFatura = faturas.find(f => 
        f.contratoId === formContratoId && 
        f.referencia === formReferencia
      );
      
      if (existingFatura) {
        toast.error("Já existe uma fatura para este contrato e período de referência.");
        return;
      }
      
      const novaFatura = addFatura({
        clienteId: formClienteId,
        contratoId: formContratoId,
        dataEmissao,
        dataVencimento,
        valor: formValor,
        status: formStatus
      });
      
      refreshFaturas();
      setOpenNewModal(false);
      clearForm();
      toast.success("Fatura adicionada com sucesso!");
    } catch (error) {
      toast.error("Erro ao adicionar fatura.");
    }
  };
  
  const handleUpdateFatura = () => {
    if (!currentFatura) return;
    
    try {
      const dataEmissao = new Date(formDataEmissao).getTime();
      const dataVencimento = new Date(formDataVencimento).getTime();
      
      if (formReferencia !== currentFatura.referencia) {
        const existingFatura = faturas.find(f => 
          f.id !== currentFatura.id &&
          f.contratoId === formContratoId && 
          f.referencia === formReferencia
        );
        
        if (existingFatura) {
          toast.error("Já existe uma fatura para este contrato e período de referência.");
          return;
        }
      }
      
      updateFatura({
        ...currentFatura,
        clienteId: formClienteId,
        contratoId: formContratoId,
        dataEmissao,
        dataVencimento,
        valor: formValor,
        status: formStatus,
        referencia: formReferencia
      });
      refreshFaturas();
      setOpenEditModal(false);
      clearForm();
      toast.success("Fatura atualizada com sucesso!");
    } catch (error) {
      toast.error("Erro ao atualizar fatura.");
    }
  };
  
  const handleDeleteFatura = () => {
    if (!currentFatura) return;
    
    try {
      deleteFatura(currentFatura.id);
      refreshFaturas();
      setOpenDeleteModal(false);
      toast.success("Fatura excluída com sucesso!");
    } catch (error) {
      toast.error("Erro ao excluir fatura.");
    }
  };
  
  const handleBatchDelete = () => {
    try {
      let count = 0;
      Object.keys(selectedFaturas).forEach(id => {
        if (selectedFaturas[id]) {
          deleteFatura(id);
          count++;
        }
      });
      
      refreshFaturas();
      setSelectedFaturas({});
      setSelectAll(false);
      setOpenBatchDeleteModal(false);
      
      if (count > 0) {
        toast.success(`${count} ${count === 1 ? 'fatura excluída' : 'faturas excluídas'} com sucesso!`);
      }
    } catch (error) {
      toast.error("Erro ao excluir faturas.");
    }
  };
  
  const handleBatchStatusUpdate = async (newStatus: StatusFatura) => {
    try {
      let count = 0;
      Object.keys(selectedFaturas).forEach(id => {
        if (selectedFaturas[id]) {
          const fatura = faturas.find(f => f.id === id);
          if (fatura) {
            updateFatura({
              ...fatura,
              status: newStatus
            });
            count++;
          }
        }
      });
      
      refreshFaturas();
      setSelectedFaturas({});
      setSelectAll(false);
      setOpenBatchStatusModal(false);
      
      if (count > 0) {
        toast.success(`Status de ${count} ${count === 1 ? 'fatura atualizado' : 'faturas atualizados'} com sucesso!`);
      }
    } catch (error) {
      toast.error("Erro ao atualizar status das faturas.");
    }
  };
  
  const handleStatusChange = async (fatura: Fatura, newStatus: StatusFatura) => {
    try {
      updateFatura({
        ...fatura,
        status: newStatus
      });
      refreshFaturas();
      toast.success("Status da fatura atualizado com sucesso!");
    } catch (error) {
      toast.error("Erro ao atualizar status da fatura.");
    }
  };
  
  const handleSelectFatura = (id: string, checked: boolean) => {
    setSelectedFaturas(prev => ({
      ...prev,
      [id]: checked
    }));
    
    const allSelected = filteredFaturas.every(
      fatura => fatura.id === id ? checked : (selectedFaturas[fatura.id] || false)
    );
    
    setSelectAll(allSelected);
  };
  
  const handleSelectAll = (checked: boolean) => {
    setSelectAll(checked);
    
    if (!checked) {
      setSelectedFaturas({});
    }
  };
  
  const getSelectedCount = () => {
    return Object.values(selectedFaturas).filter(Boolean).length;
  };
  
  const clienteNome = (id: string): string => {
    const cliente = getClienteById(id);
    return cliente ? cliente.nome : "Cliente não encontrado";
  };
  
  const contratoNumero = (id: string): string => {
    const contrato = getContratoById(id);
    return contrato ? contrato.numero : "Contrato não encontrado";
  };
  
  const handleFiltrarFaturas = () => {
    refreshFaturas();
  };
  
  const filteredFaturas = faturas.filter(fatura => {
    const cliente = getClienteById(fatura.clienteId);
    const clienteNome = cliente ? cliente.nome.toLowerCase() : "";
    const faturaNumero = fatura.numero.toLowerCase();
    const contratoNumeroStr = contratoNumero(fatura.contratoId).toLowerCase();
    
    const filtroBusca = 
      clienteNome.includes(searchTerm.toLowerCase()) ||
      faturaNumero.includes(searchTerm.toLowerCase()) ||
      contratoNumeroStr.includes(searchTerm.toLowerCase());
    
    const filtroStatus = filterStatus === "todos" || fatura.status === filterStatus;
    
    const filtroAno = anoFiltro === "todos" || fatura.referencia.endsWith(anoFiltro);
    
    const filtroMes = mesFiltro === "todos" || fatura.referencia.startsWith(mesFiltro);
    
    return filtroBusca && filtroStatus && filtroAno && filtroMes;
  });
  
  const totalPendente = filteredFaturas.filter(f => f.status === 'pendente').reduce((acc, f) => acc + f.valor, 0);
  const totalPago = filteredFaturas.filter(f => f.status === 'pago').reduce((acc, f) => acc + f.valor, 0);
  const totalAtrasado = filteredFaturas.filter(f => f.status === 'atrasado').reduce((acc, f) => acc + f.valor, 0);
  const totalGeral = totalPendente + totalPago + totalAtrasado;
  
  const faturasAgrupadasPorMes = () => {
    const meses: {[key: string]: {recebido: number, pendente: number, atrasado: number}} = {};
    
    filteredFaturas.forEach(fatura => {
      const referencia = fatura.referencia;
      if (!meses[referencia]) {
        meses[referencia] = {recebido: 0, pendente: 0, atrasado: 0};
      }
      
      if (fatura.status === 'pago') {
        meses[referencia].recebido += fatura.valor;
      } else if (fatura.status === 'pendente') {
        meses[referencia].pendente += fatura.valor;
      } else {
        meses[referencia].atrasado += fatura.valor;
      }
    });
    
    return Object.entries(meses).sort((a, b) => {
      const [mesA, anoA] = a[0].split('/');
      const [mesB, anoB] = b[0].split('/');
      if (anoA !== anoB) return parseInt(anoA) - parseInt(anoB);
      return parseInt(mesA) - parseInt(mesB);
    });
  };

  return (
    <AdminLayout title="Faturamento">
      <Tabs defaultValue="faturas">
        <TabsList className="mb-4">
          <TabsTrigger value="faturas">Faturas</TabsTrigger>
          <TabsTrigger value="visao-mensal">Visão Mensal</TabsTrigger>
        </TabsList>
        
        <TabsContent value="faturas">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Gerenciamento de Faturas</CardTitle>
                  <CardDescription>
                    Cadastre e gerencie as faturas dos clientes
                  </CardDescription>
                </div>
                <div className="flex gap-2">
                  {getSelectedCount() > 0 && (
                    <Button 
                      variant="destructive" 
                      className="flex items-center gap-2"
                      onClick={() => setOpenBatchDeleteModal(true)}
                    >
                      <Trash2 size={16} />
                      Excluir Selecionadas ({getSelectedCount()})
                    </Button>
                  )}
                  <Dialog open={openNewModal} onOpenChange={setOpenNewModal}>
                    <DialogTrigger asChild>
                      <Button className="flex items-center gap-2">
                        <Plus size={16} />
                        Nova Fatura
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[600px]">
                      <DialogHeader>
                        <DialogTitle>Adicionar Nova Fatura</DialogTitle>
                        <DialogDescription>
                          Preencha as informações da nova fatura.
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
                              {clientes.filter(c => c.situacao === 'liberado').map(cliente => (
                                <SelectItem key={cliente.id} value={cliente.id}>
                                  {cliente.nome}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="contratoId">Contrato</Label>
                          <Select 
                            value={formContratoId} 
                            onValueChange={setFormContratoId}
                            disabled={contratosCliente.length === 0}
                          >
                            <SelectTrigger id="contratoId">
                              <SelectValue placeholder={
                                contratosCliente.length === 0 
                                  ? "Selecione um cliente primeiro" 
                                  : "Selecione o contrato"
                              } />
                            </SelectTrigger>
                            <SelectContent>
                              {contratosCliente.map(contrato => (
                                <SelectItem key={contrato.id} value={contrato.id}>
                                  {contrato.numero} - {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(contrato.valorMensal)}/mês
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="dataEmissao">Data de Emissão</Label>
                            <div className="flex items-center">
                              <Calendar className="mr-2 h-4 w-4 opacity-50" />
                              <Input 
                                id="dataEmissao" 
                                type="date"
                                value={formDataEmissao} 
                                onChange={(e) => setFormDataEmissao(e.target.value)} 
                              />
                            </div>
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="dataVencimento">Data de Vencimento</Label>
                            <div className="flex items-center">
                              <Calendar className="mr-2 h-4 w-4 opacity-50" />
                              <Input 
                                id="dataVencimento" 
                                type="date"
                                value={formDataVencimento} 
                                onChange={(e) => setFormDataVencimento(e.target.value)} 
                              />
                            </div>
                          </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="valor">Valor (R$)</Label>
                            <Input 
                              id="valor" 
                              type="number" 
                              min={0}
                              step={0.01}
                              value={formValor} 
                              onChange={(e) => setFormValor(Number(e.target.value))} 
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="status">Status</Label>
                            <Select 
                              value={formStatus} 
                              onValueChange={(value: StatusFatura) => setFormStatus(value)}
                            >
                              <SelectTrigger id="status">
                                <SelectValue placeholder="Selecione o status" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="pendente">Pendente</SelectItem>
                                <SelectItem value="pago">Pago</SelectItem>
                                <SelectItem value="atrasado">Atrasado</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="referencia">Referência</Label>
                          <Input 
                            id="referencia" 
                            value={formReferencia} 
                            onChange={(e) => setFormReferencia(e.target.value)}
                            placeholder="Ex: 05/2025" 
                          />
                        </div>
                      </div>
                      <DialogFooter>
                        <Button variant="outline" onClick={() => setOpenNewModal(false)}>Cancelar</Button>
                        <Button onClick={handleAddFatura}>Salvar</Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
              <div className="pt-4 space-y-4">
                <div className="flex flex-col sm:flex-row gap-4">
                  <Input
                    placeholder="Buscar fatura por cliente ou número..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="max-w-xl"
                  />
                  <div className="flex flex-wrap gap-2">
                    <Select 
                      value={mesFiltro} 
                      onValueChange={(value: string) => setMesFiltro(value)}
                    >
                      <SelectTrigger className="w-[150px]">
                        <SelectValue placeholder="Filtrar por mês" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="todos">Todos os meses</SelectItem>
                        <SelectItem value="01">Janeiro</SelectItem>
                        <SelectItem value="02">Fevereiro</SelectItem>
                        <SelectItem value="03">Março</SelectItem>
                        <SelectItem value="04">Abril</SelectItem>
                        <SelectItem value="05">Maio</SelectItem>
                        <SelectItem value="06">Junho</SelectItem>
                        <SelectItem value="07">Julho</SelectItem>
                        <SelectItem value="08">Agosto</SelectItem>
                        <SelectItem value="09">Setembro</SelectItem>
                        <SelectItem value="10">Outubro</SelectItem>
                        <SelectItem value="11">Novembro</SelectItem>
                        <SelectItem value="12">Dezembro</SelectItem>
                      </SelectContent>
                    </Select>
                    
                    <Select 
                      value={filterStatus} 
                      onValueChange={(value: StatusFatura | "todos") => setFilterStatus(value)}
                    >
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Filtrar por status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="todos">Todos os status</SelectItem>
                        <SelectItem value="pendente">Pendente</SelectItem>
                        <SelectItem value="pago">Pago</SelectItem>
                        <SelectItem value="atrasado">Atrasado</SelectItem>
                      </SelectContent>
                    </Select>
                    
                    <Select 
                      value={anoFiltro} 
                      onValueChange={setAnoFiltro}
                    >
                      <SelectTrigger className="w-[150px]">
                        <SelectValue placeholder="Filtrar por ano" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="todos">Todos os anos</SelectItem>
                        <SelectItem value="2023">2023</SelectItem>
                        <SelectItem value="2024">2024</SelectItem>
                        <SelectItem value="2025">2025</SelectItem>
                      </SelectContent>
                    </Select>
                    
                    <Button onClick={handleFiltrarFaturas}>Filtrar</Button>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <Card>
                    <CardHeader className="py-2">
                      <CardTitle className="text-sm font-medium">Total de Faturas</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">
                        {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(totalGeral)}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {filteredFaturas.length} faturas no total
                      </p>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="py-2">
                      <CardTitle className="text-sm font-medium">Recebido</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-green-600">
                        {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(totalPago)}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {filteredFaturas.filter(f => f.status === 'pago').length} faturas pagas
                      </p>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="py-2">
                      <CardTitle className="text-sm font-medium">Pendente</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-yellow-600">
                        {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(totalPendente)}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {filteredFaturas.filter(f => f.status === 'pendente').length} faturas pendentes
                      </p>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="py-2">
                      <CardTitle className="text-sm font-medium">Atrasado</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-red-600">
                        {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(totalAtrasado)}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {filteredFaturas.filter(f => f.status === 'atrasado').length} faturas atrasadas
                      </p>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[50px]">
                      <Checkbox 
                        checked={selectAll} 
                        onCheckedChange={(checked) => {
                          if (typeof checked === 'boolean') {
                            handleSelectAll(checked);
                          }
                        }}
                        aria-label="Selecionar todas as faturas"
                      />
                    </TableHead>
                    <TableHead>Número</TableHead>
                    <TableHead>Cliente</TableHead>
                    <TableHead>Contrato</TableHead>
                    <TableHead>Referência</TableHead>
                    <TableHead>Emissão</TableHead>
                    <TableHead>Vencimento</TableHead>
                    <TableHead>Valor</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredFaturas.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={10} className="text-center py-4 text-muted-foreground">
                        Nenhuma fatura encontrada.
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredFaturas.map((fatura) => (
                      <TableRow key={fatura.id}>
                        <TableCell>
                          <Checkbox 
                            checked={!!selectedFaturas[fatura.id]} 
                            onCheckedChange={(checked) => {
                              if (typeof checked === 'boolean') {
                                handleSelectFatura(fatura.id, checked);
                              }
                            }}
                            aria-label={`Selecionar fatura ${fatura.numero}`}
                          />
                        </TableCell>
                        <TableCell className="font-medium">{fatura.numero}</TableCell>
                        <TableCell>{clienteNome(fatura.clienteId)}</TableCell>
                        <TableCell>{contratoNumero(fatura.contratoId)}</TableCell>
                        <TableCell>{fatura.referencia}</TableCell>
                        <TableCell>
                          {format(new Date(fatura.dataEmissao), "dd/MM/yyyy", {locale: ptBR})}
                        </TableCell>
                        <TableCell>
                          {format(new Date(fatura.dataVencimento), "dd/MM/yyyy", {locale: ptBR})}
                        </TableCell>
                        <TableCell>
                          {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(fatura.valor)}
                        </TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-8 w-full justify-start p-2">
                                <Badge 
                                  variant={
                                    fatura.status === "pago" ? "default" : 
                                    fatura.status === "pendente" ? "outline" : "destructive"
                                  }
                                >
                                  {fatura.status === "pago" ? "Pago" : 
                                   fatura.status === "pendente" ? "Pendente" : "Atrasado"}
                                </Badge>
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem 
                                onClick={() => handleStatusChange(fatura, "pendente")}
                                disabled={fatura.status === "pendente"}
                              >
                                Pendente
                              </DropdownMenuItem>
                              <DropdownMenuItem 
                                onClick={() => handleStatusChange(fatura, "pago")}
                                disabled={fatura.status === "pago"}
                              >
                                Pago
                              </DropdownMenuItem>
                              <DropdownMenuItem 
                                onClick={() => handleStatusChange(fatura, "atrasado")}
                                disabled={fatura.status === "atrasado"}
                              >
                                Atrasado
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button 
                              variant="ghost" 
                              size="icon"
                              onClick={() => handleOpenEditModal(fatura)}
                              title="Editar"
                            >
                              <Pencil size={16} />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="icon"
                              onClick={() => handleOpenDeleteModal(fatura)}
                              title="Excluir"
                            >
                              <Trash2 size={16} />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="icon"
                              onClick={() => handleOpenPreview(fatura)}
                              title="Visualizar Fatura"
                            >
                              <FileText size={16} />
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
        </TabsContent>
        
        <TabsContent value="visao-mensal">
          <Card>
            <CardHeader>
              <CardTitle>Visão Mensal de Faturamento</CardTitle>
              <CardDescription>
                Acompanhamento financeiro mensal
              </CardDescription>
              <div className="flex gap-2 mt-4">
                <Select 
                  value={mesFiltro} 
                  onValueChange={(value: string) => setMesFiltro(value)}
                >
                  <SelectTrigger className="w-[150px]">
                    <SelectValue placeholder="Filtrar por mês" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todos">Todos os meses</SelectItem>
                    <SelectItem value="01">Janeiro</SelectItem>
                    <SelectItem value="02">Fevereiro</SelectItem>
                    <SelectItem value="03">Março</SelectItem>
                    <SelectItem value="04">Abril</SelectItem>
                    <SelectItem value="05">Maio</SelectItem>
                    <SelectItem value="06">Junho</SelectItem>
                    <SelectItem value="07">Julho</SelectItem>
                    <SelectItem value="08">Agosto</SelectItem>
                    <SelectItem value="09">Setembro</SelectItem>
                    <SelectItem value="10">Outubro</SelectItem>
                    <SelectItem value="11">Novembro</SelectItem>
                    <SelectItem value="12">Dezembro</SelectItem>
                  </SelectContent>
                </Select>
                
                <Select 
                  value={anoFiltro} 
                  onValueChange={setAnoFiltro}
                >
                  <SelectTrigger className="w-[150px]">
                    <SelectValue placeholder="Filtrar por ano" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todos">Todos os anos</SelectItem>
                    <SelectItem value="2023">2023</SelectItem>
                    <SelectItem value="2024">2024</SelectItem>
                    <SelectItem value="2025">2025</SelectItem>
                  </SelectContent>
                </Select>
                <Button onClick={handleFiltrarFaturas}>Filtrar</Button>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Mês/Ano</TableHead>
                    <TableHead>Faturas Pagas</TableHead>
                    <TableHead>Faturas Pendentes</TableHead>
                    <TableHead>Faturas Atrasadas</TableHead>
                    <TableHead>Total do Mês</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {faturasAgrupadasPorMes().length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-4 text-muted-foreground">
                        Nenhum dado disponível para o período selecionado.
                      </TableCell>
                    </TableRow>
                  ) : (
                    faturasAgrupadasPorMes().map(([referencia, valores]) => (
                      <TableRow key={referencia}>
                        <TableCell className="font-medium">{referencia}</TableCell>
                        <TableCell className="text-green-600">
                          {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(valores.recebido)}
                        </TableCell>
                        <TableCell className="text-yellow-600">
                          {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(valores.pendente)}
                        </TableCell>
                        <TableCell className="text-red-600">
                          {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(valores.atrasado)}
                        </TableCell>
                        <TableCell className="font-bold">
                          {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(
                            valores.recebido + valores.pendente + valores.atrasado
                          )}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                  {faturasAgrupadasPorMes().length > 0 && (
                    <TableRow>
                      <TableCell className="font-bold">Total Geral</TableCell>
                      <TableCell className="font-bold text-green-600">
                        {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(totalPago)}
                      </TableCell>
                      <TableCell className="font-bold text-yellow-600">
                        {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(totalPendente)}
                      </TableCell>
                      <TableCell className="font-bold text-red-600">
                        {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(totalAtrasado)}
                      </TableCell>
                      <TableCell className="font-bold">
                        {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(totalGeral)}
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      <Dialog open={openEditModal} onOpenChange={setOpenEditModal}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Editar Fatura</DialogTitle>
            <DialogDescription>
              Atualize as informações da fatura.
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
                  {clientes.filter(c => c.situacao === 'liberado').map(cliente => (
                    <SelectItem key={cliente.id} value={cliente.id}>
                      {cliente.nome}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-contratoId">Contrato</Label>
              <Select 
                value={formContratoId} 
                onValueChange={setFormContratoId}
                disabled={contratosCliente.length === 0}
              >
                <SelectTrigger id="edit-contratoId">
                  <SelectValue placeholder={
                    contratosCliente.length === 0 
                      ? "Selecione um cliente primeiro" 
                      : "Selecione o contrato"
                  } />
                </SelectTrigger>
                <SelectContent>
                  {contratosCliente.map(contrato => (
                    <SelectItem key={contrato.id} value={contrato.id}>
                      {contrato.numero} - {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(contrato.valorMensal)}/mês
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-dataEmissao">Data de Emissão</Label>
                <div className="flex items-center">
                  <Calendar className="mr-2 h-4 w-4 opacity-50" />
                  <Input 
                    id="edit-dataEmissao" 
                    type="date"
                    value={formDataEmissao}
                    onChange={(e) => setFormDataEmissao(e.target.value)} 
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-dataVencimento">Data de Vencimento</Label>
                <div className="flex items-center">
                  <Calendar className="mr-2 h-4 w-4 opacity-50" />
                  <Input 
                    id="edit-dataVencimento" 
                    type="date"
                    value={formDataVencimento}
                    onChange={(e) => setFormDataVencimento(e.target.value)} 
                  />
                </div>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-valor">Valor (R$)</Label>
                <Input 
                  id="edit-valor" 
                  type="number" 
                  min={0}
                  step={0.01}
                  value={formValor}
                  onChange={(e) => setFormValor(Number(e.target.value))} 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-status">Status</Label>
                <Select 
                  value={formStatus} 
                  onValueChange={(value: StatusFatura) => setFormStatus(value)}
                >
                  <SelectTrigger id="edit-status">
                    <SelectValue placeholder="Selecione o status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pendente">Pendente</SelectItem>
                    <SelectItem value="pago">Pago</SelectItem>
                    <SelectItem value="atrasado">Atrasado</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-referencia">Referência</Label>
              <Input 
                id="edit-referencia" 
                value={formReferencia}
                onChange={(e) => setFormReferencia(e.target.value)}
                placeholder="Ex: 05/2025" 
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpenEditModal(false)}>Cancelar</Button>
            <Button onClick={handleUpdateFatura}>Salvar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      <Dialog open={openDeleteModal} onOpenChange={setOpenDeleteModal}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>Excluir Fatura</DialogTitle>
            <DialogDescription>
              Esta ação não pode ser desfeita. Deseja realmente excluir esta fatura?
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            {currentFatura && (
              <div className="space-y-2">
                <p><strong>Número:</strong> {currentFatura.numero}</p>
                <p><strong>Cliente:</strong> {clienteNome(currentFatura.clienteId)}</p>
                <p><strong>Valor:</strong> {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(currentFatura.valor)}</p>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpenDeleteModal(false)}>Cancelar</Button>
            <Button variant="destructive" onClick={handleDeleteFatura}>Excluir</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      <Dialog open={openBatchDeleteModal} onOpenChange={setOpenBatchDeleteModal}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>Excluir Faturas Selecionadas</DialogTitle>
            <DialogDescription>
              Esta ação não pode ser desfeita. Deseja realmente excluir {getSelectedCount()} {getSelectedCount() === 1 ? 'fatura selecionada' : 'faturas selecionadas'}?
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <p className="text-red-500 font-medium">Atenção: Esta ação excluirá permanentemente as faturas selecionadas.</p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpenBatchDeleteModal(false)}>Cancelar</Button>
            <Button variant="destructive" onClick={handleBatchDelete}>Excluir {getSelectedCount()} {getSelectedCount() === 1 ? 'Fatura' : 'Faturas'}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      <Dialog open={openBatchStatusModal} onOpenChange={setOpenBatchStatusModal}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>Atualizar Status das Faturas</DialogTitle>
            <DialogDescription>
              Selecione o novo status para {getSelectedCount()} {getSelectedCount() === 1 ? 'fatura selecionada' : 'faturas selecionadas'}.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4 space-y-4">
            <div className="space-y-2">
              <Label>Novo Status</Label>
              <Select onValueChange={(value: StatusFatura) => handleBatchStatusUpdate(value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o novo status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pendente">Pendente</SelectItem>
                  <SelectItem value="pago">Pago</SelectItem>
                  <SelectItem value="atrasado">Atrasado</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </DialogContent>
      </Dialog>
      
      {getSelectedCount() > 0 && (
        <div className="fixed bottom-4 right-4 flex gap-2 bg-background p-4 shadow-lg rounded-lg border">
          <Button 
            variant="outline" 
            className="flex items-center gap-2"
            onClick={() => setOpenBatchStatusModal(true)}
          >
            Alterar Status ({getSelectedCount()})
          </Button>
          <Button 
            variant="destructive" 
            className="flex items-center gap-2"
            onClick={() => setOpenBatchDeleteModal(true)}
          >
            <Trash2 size={16} />
            Excluir Selecionadas ({getSelectedCount()})
          </Button>
        </div>
      )}
      
      {previewFatura && (
        <InvoicePreview
          fatura={previewFatura}
          cliente={getClienteById(previewFatura.clienteId)!}
          contrato={getContratoById(previewFatura.contratoId)!}
          open={!!previewFatura}
          onOpenChange={(open) => {
            if (!open) setPreviewFatura(null);
          }}
        />
      )}
    </AdminLayout>
  );
};

export default FaturamentoPage;
