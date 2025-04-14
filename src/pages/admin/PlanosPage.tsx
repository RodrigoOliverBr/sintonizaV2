
import React, { useState, useEffect } from "react";
import AdminLayout from "@/components/AdminLayout";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Pencil, Trash2, Plus, X, Check, CalendarIcon } from "lucide-react";
import { Plano } from "@/types/admin";
import { getPlanos, addPlano, updatePlano, deletePlano } from "@/services/adminService";
import { toast } from "sonner";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";

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
  const [formValorImplantacao, setFormValorImplantacao] = useState(0);
  const [formLimiteEmpresas, setFormLimiteEmpresas] = useState(1);
  const [formEmpresasIlimitadas, setFormEmpresasIlimitadas] = useState(false);
  const [formLimiteEmpregados, setFormLimiteEmpregados] = useState(10);
  const [formEmpregadosIlimitados, setFormEmpregadosIlimitados] = useState(false);
  const [formDataValidade, setFormDataValidade] = useState<Date | null>(null);
  const [formSemVencimento, setFormSemVencimento] = useState(false);
  const [formRelatoriosAvancados, setFormRelatoriosAvancados] = useState(false);
  const [formSuportePrioritario, setFormSuportePrioritario] = useState(false);
  const [formIntegracaoPersonalizada, setFormIntegracaoPersonalizada] = useState(false);
  const [formTreinamentoIncluido, setFormTreinamentoIncluido] = useState(false);
  const [formAtivo, setFormAtivo] = useState(true);
  
  useEffect(() => {
    // Inicializar planos padrão se não existirem
    const planosExistentes = getPlanos();
    if (planosExistentes.length === 0) {
      // Adicionar planos iniciais
      criarPlanosIniciais();
    }
    refreshPlanos();
  }, []);
  
  const criarPlanosIniciais = () => {
    // Plano eSocial Brasil (Corporativo)
    addPlano({
      nome: "eSocial Brasil (Corporativo)",
      descricao: "Plano exclusivo para clientes ativos da plataforma eSocial Brasil. Todos os recursos liberados por um valor simbólico.",
      valorMensal: 99.90,
      valorImplantacao: 599.00,
      limiteEmpresas: 1,
      empresasIlimitadas: true,
      limiteEmpregados: 1,
      empregadosIlimitados: true,
      dataValidade: null,
      semVencimento: true,
      recursos: {
        relatoriosAvancados: true,
        suportePrioritario: true,
        integracaoPersonalizada: true,
        treinamentoIncluido: true
      },
      ativo: true
    });
    
    // Plano Profissional (Clientes Externos)
    addPlano({
      nome: "Profissional (Clientes Externos)",
      descricao: "Plano completo com diagnóstico psicossocial e relatórios de conformidade para pequenas e médias empresas.",
      valorMensal: 199.90,
      valorImplantacao: 1599.00,
      limiteEmpresas: 1,
      empresasIlimitadas: false,
      limiteEmpregados: 100,
      empregadosIlimitados: false,
      dataValidade: new Date(new Date().setMonth(new Date().getMonth() + 12)).getTime(),
      semVencimento: false,
      recursos: {
        relatoriosAvancados: true,
        suportePrioritario: false,
        integracaoPersonalizada: false,
        treinamentoIncluido: false
      },
      ativo: true
    });
    
    // Plano Gratuito
    addPlano({
      nome: "Plano Gratuito",
      descricao: "Versão limitada para testes e experimentações.",
      valorMensal: 0,
      valorImplantacao: 0,
      limiteEmpresas: 1,
      empresasIlimitadas: false,
      limiteEmpregados: 10,
      empregadosIlimitados: false,
      dataValidade: new Date(new Date().setDate(new Date().getDate() + 30)).getTime(),
      semVencimento: false,
      recursos: {
        relatoriosAvancados: false,
        suportePrioritario: false,
        integracaoPersonalizada: false,
        treinamentoIncluido: false
      },
      ativo: true
    });
    
    toast.success("Planos iniciais criados com sucesso!");
  };
  
  const refreshPlanos = () => {
    setPlanos(getPlanos());
  };
  
  const clearForm = () => {
    setFormNome("");
    setFormDescricao("");
    setFormValorMensal(0);
    setFormValorImplantacao(0);
    setFormLimiteEmpresas(1);
    setFormEmpresasIlimitadas(false);
    setFormLimiteEmpregados(10);
    setFormEmpregadosIlimitados(false);
    setFormDataValidade(null);
    setFormSemVencimento(false);
    setFormRelatoriosAvancados(false);
    setFormSuportePrioritario(false);
    setFormIntegracaoPersonalizada(false);
    setFormTreinamentoIncluido(false);
    setFormAtivo(true);
  };
  
  const handleOpenEditModal = (plano: Plano) => {
    setCurrentPlano(plano);
    setFormNome(plano.nome);
    setFormDescricao(plano.descricao);
    setFormValorMensal(plano.valorMensal);
    setFormValorImplantacao(plano.valorImplantacao);
    setFormLimiteEmpresas(plano.limiteEmpresas);
    setFormEmpresasIlimitadas(plano.empresasIlimitadas);
    setFormLimiteEmpregados(plano.limiteEmpregados);
    setFormEmpregadosIlimitados(plano.empregadosIlimitados);
    setFormDataValidade(plano.dataValidade ? new Date(plano.dataValidade) : null);
    setFormSemVencimento(plano.semVencimento);
    setFormRelatoriosAvancados(plano.recursos.relatoriosAvancados);
    setFormSuportePrioritario(plano.recursos.suportePrioritario);
    setFormIntegracaoPersonalizada(plano.recursos.integracaoPersonalizada);
    setFormTreinamentoIncluido(plano.recursos.treinamentoIncluido);
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
        valorImplantacao: formValorImplantacao,
        limiteEmpresas: formLimiteEmpresas,
        empresasIlimitadas: formEmpresasIlimitadas,
        limiteEmpregados: formLimiteEmpregados,
        empregadosIlimitados: formEmpregadosIlimitados,
        dataValidade: formSemVencimento ? null : (formDataValidade ? formDataValidade.getTime() : null),
        semVencimento: formSemVencimento,
        recursos: {
          relatoriosAvancados: formRelatoriosAvancados,
          suportePrioritario: formSuportePrioritario,
          integracaoPersonalizada: formIntegracaoPersonalizada,
          treinamentoIncluido: formTreinamentoIncluido
        },
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
        valorImplantacao: formValorImplantacao,
        limiteEmpresas: formLimiteEmpresas,
        empresasIlimitadas: formEmpresasIlimitadas,
        limiteEmpregados: formLimiteEmpregados,
        empregadosIlimitados: formEmpregadosIlimitados,
        dataValidade: formSemVencimento ? null : (formDataValidade ? formDataValidade.getTime() : null),
        semVencimento: formSemVencimento,
        recursos: {
          relatoriosAvancados: formRelatoriosAvancados,
          suportePrioritario: formSuportePrioritario,
          integracaoPersonalizada: formIntegracaoPersonalizada,
          treinamentoIncluido: formTreinamentoIncluido
        },
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
  
  const filteredPlanos = planos.filter(plano => 
    plano.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    plano.descricao.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatarLimiteEmpresas = (plano: Plano) => {
    if (plano.empresasIlimitadas) return "Ilimitadas";
    return plano.limiteEmpresas === 1 ? "1 empresa" : `${plano.limiteEmpresas} empresas`;
  };

  const formatarLimiteEmpregados = (plano: Plano) => {
    if (plano.empregadosIlimitados) return "Ilimitados";
    return `Até ${plano.limiteEmpregados}`;
  };

  const formatarDataValidade = (plano: Plano) => {
    if (plano.semVencimento) return "Sem vencimento";
    if (!plano.dataValidade) return "Não definida";
    return format(new Date(plano.dataValidade), "dd/MM/yyyy", { locale: ptBR });
  };

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
              <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
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
                      <Label htmlFor="valorImplantacao">Valor de Implantação (R$)</Label>
                      <Input 
                        id="valorImplantacao" 
                        type="number" 
                        min={0}
                        step={0.01}
                        value={formValorImplantacao} 
                        onChange={(e) => setFormValorImplantacao(Number(e.target.value))} 
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="limiteEmpresas">Limite de Empresas</Label>
                      <div className="flex flex-col space-y-2">
                        <div className="flex items-center space-x-2">
                          <Switch 
                            id="empresasIlimitadas"
                            checked={formEmpresasIlimitadas} 
                            onCheckedChange={setFormEmpresasIlimitadas}
                          />
                          <Label htmlFor="empresasIlimitadas" className="font-normal">Ilimitadas</Label>
                        </div>
                        {!formEmpresasIlimitadas && (
                          <Input 
                            id="limiteEmpresas" 
                            type="number" 
                            min={1}
                            value={formLimiteEmpresas} 
                            onChange={(e) => setFormLimiteEmpresas(Number(e.target.value))} 
                          />
                        )}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="limiteEmpregados">Limite de Empregados</Label>
                      <div className="flex flex-col space-y-2">
                        <div className="flex items-center space-x-2">
                          <Switch 
                            id="empregadosIlimitados"
                            checked={formEmpregadosIlimitados} 
                            onCheckedChange={setFormEmpregadosIlimitados}
                          />
                          <Label htmlFor="empregadosIlimitados" className="font-normal">Ilimitados</Label>
                        </div>
                        {!formEmpregadosIlimitados && (
                          <Input 
                            id="limiteEmpregados" 
                            type="number" 
                            min={1}
                            value={formLimiteEmpregados} 
                            onChange={(e) => setFormLimiteEmpregados(Number(e.target.value))} 
                          />
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Data de Validade</Label>
                    <div className="flex flex-col space-y-2">
                      <div className="flex items-center space-x-2">
                        <Switch 
                          id="semVencimento"
                          checked={formSemVencimento} 
                          onCheckedChange={setFormSemVencimento}
                        />
                        <Label htmlFor="semVencimento" className="font-normal">Sem vencimento</Label>
                      </div>
                      {!formSemVencimento && (
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              className={cn(
                                "w-full justify-start text-left font-normal",
                                !formDataValidade && "text-muted-foreground"
                              )}
                            >
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              {formDataValidade ? format(formDataValidade, "dd/MM/yyyy", { locale: ptBR }) : "Selecione uma data"}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0">
                            <Calendar
                              mode="single"
                              selected={formDataValidade || undefined}
                              onSelect={date => setFormDataValidade(date)}
                              initialFocus
                              locale={ptBR}
                            />
                          </PopoverContent>
                        </Popover>
                      )}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Recursos Incluídos</Label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 pt-2">
                      <div className="flex items-center space-x-2">
                        <Checkbox 
                          id="relatoriosAvancados" 
                          checked={formRelatoriosAvancados}
                          onCheckedChange={(checked) => setFormRelatoriosAvancados(checked === true)}
                        />
                        <Label htmlFor="relatoriosAvancados" className="font-normal">Relatórios avançados</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox 
                          id="suportePrioritario" 
                          checked={formSuportePrioritario}
                          onCheckedChange={(checked) => setFormSuportePrioritario(checked === true)}
                        />
                        <Label htmlFor="suportePrioritario" className="font-normal">Suporte prioritário</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox 
                          id="integracaoPersonalizada" 
                          checked={formIntegracaoPersonalizada}
                          onCheckedChange={(checked) => setFormIntegracaoPersonalizada(checked === true)}
                        />
                        <Label htmlFor="integracaoPersonalizada" className="font-normal">Integração personalizada</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox 
                          id="treinamentoIncluido" 
                          checked={formTreinamentoIncluido}
                          onCheckedChange={(checked) => setFormTreinamentoIncluido(checked === true)}
                        />
                        <Label htmlFor="treinamentoIncluido" className="font-normal">Treinamento incluído</Label>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Status do Plano</Label>
                    <div className="flex items-center space-x-2">
                      <Switch 
                        id="ativo"
                        checked={formAtivo} 
                        onCheckedChange={setFormAtivo}
                      />
                      <Label htmlFor="ativo" className="font-normal">
                        {formAtivo ? "Ativo" : "Inativo"}
                      </Label>
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
                <TableHead>Valores</TableHead>
                <TableHead>Limites</TableHead>
                <TableHead>Validade</TableHead>
                <TableHead>Recursos</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPlanos.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-4 text-muted-foreground">
                    Nenhum plano encontrado.
                  </TableCell>
                </TableRow>
              ) : (
                filteredPlanos.map((plano) => (
                  <TableRow key={plano.id}>
                    <TableCell className="font-medium">{plano.nome}</TableCell>
                    <TableCell className="max-w-[200px] truncate">{plano.descricao}</TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span>Mensal: {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(plano.valorMensal)}</span>
                        <span className="text-xs text-muted-foreground">
                          Impl: {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(plano.valorImplantacao)}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span>{formatarLimiteEmpresas(plano)}</span>
                        <span className="text-xs text-muted-foreground">
                          {formatarLimiteEmpregados(plano)} empregados
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      {formatarDataValidade(plano)}
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1 max-w-[200px]">
                        {plano.recursos.relatoriosAvancados && (
                          <Badge variant="outline" className="text-xs">
                            Relatórios
                          </Badge>
                        )}
                        {plano.recursos.suportePrioritario && (
                          <Badge variant="outline" className="text-xs">
                            Suporte
                          </Badge>
                        )}
                        {plano.recursos.integracaoPersonalizada && (
                          <Badge variant="outline" className="text-xs">
                            Integração
                          </Badge>
                        )}
                        {plano.recursos.treinamentoIncluido && (
                          <Badge variant="outline" className="text-xs">
                            Treinamento
                          </Badge>
                        )}
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
      
      {/* Modal de Edição - Mesmo conteúdo do modal de Adição */}
      <Dialog open={openEditModal} onOpenChange={setOpenEditModal}>
        <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
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
                <Label htmlFor="edit-valorImplantacao">Valor de Implantação (R$)</Label>
                <Input 
                  id="edit-valorImplantacao" 
                  type="number" 
                  min={0}
                  step={0.01}
                  value={formValorImplantacao} 
                  onChange={(e) => setFormValorImplantacao(Number(e.target.value))} 
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-limiteEmpresas">Limite de Empresas</Label>
                <div className="flex flex-col space-y-2">
                  <div className="flex items-center space-x-2">
                    <Switch 
                      id="edit-empresasIlimitadas"
                      checked={formEmpresasIlimitadas} 
                      onCheckedChange={setFormEmpresasIlimitadas}
                    />
                    <Label htmlFor="edit-empresasIlimitadas" className="font-normal">Ilimitadas</Label>
                  </div>
                  {!formEmpresasIlimitadas && (
                    <Input 
                      id="edit-limiteEmpresas" 
                      type="number" 
                      min={1}
                      value={formLimiteEmpresas} 
                      onChange={(e) => setFormLimiteEmpresas(Number(e.target.value))} 
                    />
                  )}
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-limiteEmpregados">Limite de Empregados</Label>
                <div className="flex flex-col space-y-2">
                  <div className="flex items-center space-x-2">
                    <Switch 
                      id="edit-empregadosIlimitados"
                      checked={formEmpregadosIlimitados} 
                      onCheckedChange={setFormEmpregadosIlimitados}
                    />
                    <Label htmlFor="edit-empregadosIlimitados" className="font-normal">Ilimitados</Label>
                  </div>
                  {!formEmpregadosIlimitados && (
                    <Input 
                      id="edit-limiteEmpregados" 
                      type="number" 
                      min={1}
                      value={formLimiteEmpregados} 
                      onChange={(e) => setFormLimiteEmpregados(Number(e.target.value))} 
                    />
                  )}
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Data de Validade</Label>
              <div className="flex flex-col space-y-2">
                <div className="flex items-center space-x-2">
                  <Switch 
                    id="edit-semVencimento"
                    checked={formSemVencimento} 
                    onCheckedChange={setFormSemVencimento}
                  />
                  <Label htmlFor="edit-semVencimento" className="font-normal">Sem vencimento</Label>
                </div>
                {!formSemVencimento && (
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !formDataValidade && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {formDataValidade ? format(formDataValidade, "dd/MM/yyyy", { locale: ptBR }) : "Selecione uma data"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={formDataValidade || undefined}
                        onSelect={date => setFormDataValidade(date)}
                        initialFocus
                        locale={ptBR}
                      />
                    </PopoverContent>
                  </Popover>
                )}
              </div>
            </div>
            <div className="space-y-2">
              <Label>Recursos Incluídos</Label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 pt-2">
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="edit-relatoriosAvancados" 
                    checked={formRelatoriosAvancados}
                    onCheckedChange={(checked) => setFormRelatoriosAvancados(checked === true)}
                  />
                  <Label htmlFor="edit-relatoriosAvancados" className="font-normal">Relatórios avançados</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="edit-suportePrioritario" 
                    checked={formSuportePrioritario}
                    onCheckedChange={(checked) => setFormSuportePrioritario(checked === true)}
                  />
                  <Label htmlFor="edit-suportePrioritario" className="font-normal">Suporte prioritário</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="edit-integracaoPersonalizada" 
                    checked={formIntegracaoPersonalizada}
                    onCheckedChange={(checked) => setFormIntegracaoPersonalizada(checked === true)}
                  />
                  <Label htmlFor="edit-integracaoPersonalizada" className="font-normal">Integração personalizada</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="edit-treinamentoIncluido" 
                    checked={formTreinamentoIncluido}
                    onCheckedChange={(checked) => setFormTreinamentoIncluido(checked === true)}
                  />
                  <Label htmlFor="edit-treinamentoIncluido" className="font-normal">Treinamento incluído</Label>
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Status do Plano</Label>
              <div className="flex items-center space-x-2">
                <Switch 
                  id="edit-ativo"
                  checked={formAtivo} 
                  onCheckedChange={setFormAtivo}
                />
                <Label htmlFor="edit-ativo" className="font-normal">
                  {formAtivo ? "Ativo" : "Inativo"}
                </Label>
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
