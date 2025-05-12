import React, { useState, useEffect } from "react";
import AdminLayout from "@/components/AdminLayout";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { addFatura, getClientes, getContratos, getFaturas, updateFatura, deleteFatura } from "@/services/adminService";
import { Cliente, Contrato, Fatura, StatusFatura } from "@/types/admin";
import { toast } from "sonner";

const FaturamentoPage = () => {
  const [faturas, setFaturas] = useState<Fatura[]>([]);
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [contratos, setContratos] = useState<Contrato[]>([]);
  const [selectedCliente, setSelectedCliente] = useState<Cliente | null>(null);
  const [selectedContrato, setSelectedContrato] = useState<Contrato | null>(null);
  const [dataEmissao, setDataEmissao] = useState<Date | undefined>(undefined);
  const [dataVencimento, setDataVencimento] = useState<Date | undefined>(undefined);
  const [valor, setValor] = useState("");
  const [status, setStatus] = useState<StatusFatura>("pendente");
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedFatura, setSelectedFatura] = useState<Fatura | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const faturasList = getFaturas();
    const clientesList = getClientes();
    const contratosList = getContratos();
    
    setFaturas(faturasList);
    setClientes(clientesList);
    setContratos(contratosList);
  };

  const filteredFaturas = faturas.filter(fatura => {
    const cliente = clientes.find(c => c.id === fatura.clienteId);
    const contrato = contratos.find(ct => ct.id === fatura.contratoId);
    
    const clienteNome = cliente ? cliente.nome : '';
    const contratoNumero = contrato ? contrato.numero : '';
    
    return (
      clienteNome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contratoNumero.toLowerCase().includes(searchTerm.toLowerCase()) ||
      fatura.numero.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  const handleClienteChange = (clienteId: string) => {
    const cliente = clientes.find(c => c.id === clienteId);
    setSelectedCliente(cliente);

    // Reset contrato selection when cliente changes
    setSelectedContrato(null);
  };

  const handleContratoChange = (contratoId: string) => {
    const contrato = contratos.find(c => c.id === contratoId);
    setSelectedContrato(contrato);
  };

  const handleEditFatura = (fatura: Fatura) => {
    setIsEditMode(true);
    setSelectedFatura(fatura);
    
    const cliente = clientes.find(c => c.id === fatura.clienteId);
    const contrato = contratos.find(c => c.id === fatura.contratoId);
    
    setSelectedCliente(cliente || null);
    setSelectedContrato(contrato || null);
    setDataEmissao(new Date(fatura.dataEmissao));
    setDataVencimento(new Date(fatura.dataVencimento));
    setValor(fatura.valor.toString());
    setStatus(fatura.status);
  };

  const handleDeleteFatura = (faturaId: string) => {
    try {
      deleteFatura(faturaId);
      toast.success("Fatura excluída com sucesso!");
      loadData();
    } catch (error) {
      toast.error(`Erro ao excluir fatura: ${error}`);
    }
  };

  const handleUpdateFatura = () => {
    if (!selectedFatura) return;

    try {
      const updatedFatura = {
        ...selectedFatura,
        clienteId: selectedCliente?.id || "",
        contratoId: selectedContrato?.id || "",
        dataEmissao: dataEmissao?.getTime() || Date.now(),
        dataVencimento: dataVencimento?.getTime() || Date.now(),
        valor: parseFloat(valor),
        status: status as StatusFatura
      };
      
      updateFatura(updatedFatura);
      toast.success("Fatura atualizada com sucesso!");
      loadData();
      handleClearForm();
    } catch (error) {
      toast.error(`Erro ao atualizar fatura: ${error}`);
    }
  };

  const handleAddFatura = () => {
    if (!selectedCliente || !selectedContrato || !dataEmissao || !dataVencimento) {
      toast.error("Preencha todos os campos!");
      return;
    }

    try {
      const novaFatura = addFatura({
        clienteId: selectedCliente.id,
        contratoId: selectedContrato.id,
        dataEmissao: dataEmissao.getTime(),
        dataVencimento: dataVencimento.getTime(),
        valor: parseFloat(valor),
        status: status as StatusFatura,
        referencia: `${String(dataVencimento.getMonth() + 1).padStart(2, '0')}/${dataVencimento.getFullYear()}`
      });
      
      toast.success("Fatura adicionada com sucesso!");
      loadData();
      handleClearForm();
    } catch (error) {
      toast.error(`Erro ao adicionar fatura: ${error}`);
    }
  };

  const handleClearForm = () => {
    setIsEditMode(false);
    setSelectedFatura(null);
    setSelectedCliente(null);
    setSelectedContrato(null);
    setDataEmissao(undefined);
    setDataVencimento(undefined);
    setValor("");
    setStatus("pendente");
  };

  return (
    <AdminLayout title="Gerenciar Faturamento">
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="text-xl font-bold">Lista de Faturas</CardTitle>
          <CardDescription>
            Visualize e gerencie as faturas do sistema
          </CardDescription>
          
          <div className="flex items-center gap-2 mt-4">
            <div className="relative flex-1">
              <Input
                placeholder="Buscar fatura..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </CardHeader>
        
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <Label htmlFor="cliente">Cliente</Label>
              <Select onValueChange={handleClienteChange} value={selectedCliente?.id || ""}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o cliente" />
                </SelectTrigger>
                <SelectContent>
                  {clientes.map(cliente => (
                    <SelectItem key={cliente.id} value={cliente.id}>{cliente.nome}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="contrato">Contrato</Label>
              <Select 
                onValueChange={handleContratoChange} 
                value={selectedContrato?.id || ""}
                disabled={!selectedCliente}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o contrato" />
                </SelectTrigger>
                <SelectContent>
                  {contratos
                    .filter(contrato => contrato.clienteId === selectedCliente?.id)
                    .map(contrato => (
                      <SelectItem key={contrato.id} value={contrato.id}>{contrato.numero}</SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="dataEmissao">Data de Emissão</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !dataEmissao && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {dataEmissao ? format(dataEmissao, "PPP") : <span>Selecione a data</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={dataEmissao}
                    onSelect={setDataEmissao}
                    disabled={false}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
            
            <div>
              <Label htmlFor="dataVencimento">Data de Vencimento</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !dataVencimento && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {dataVencimento ? format(dataVencimento, "PPP") : <span>Selecione a data</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={dataVencimento}
                    onSelect={setDataVencimento}
                    disabled={false}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
            
            <div>
              <Label htmlFor="valor">Valor</Label>
              <Input
                type="number"
                id="valor"
                value={valor}
                onChange={(e) => setValor(e.target.value)}
              />
            </div>
            
            <div>
              <Label htmlFor="status">Status</Label>
              <Select onValueChange={(value) => setStatus(value as StatusFatura)} value={status}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pendente">Pendente</SelectItem>
                  <SelectItem value="pago">Pago</SelectItem>
                  <SelectItem value="atrasado">Atrasado</SelectItem>
                  <SelectItem value="programada">Programada</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="flex justify-end gap-2">
            {isEditMode && (
              <Button variant="secondary" onClick={handleClearForm}>
                Cancelar
              </Button>
            )}
            
            <Button onClick={isEditMode ? handleUpdateFatura : handleAddFatura}>
              {isEditMode ? "Atualizar Fatura" : "Adicionar Fatura"}
            </Button>
          </div>
        </CardContent>
        
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Cliente</TableHead>
                <TableHead>Contrato</TableHead>
                <TableHead>Data de Emissão</TableHead>
                <TableHead>Data de Vencimento</TableHead>
                <TableHead>Valor</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredFaturas.length > 0 ? (
                filteredFaturas.map(fatura => {
                  const cliente = clientes.find(c => c.id === fatura.clienteId);
                  const contrato = contratos.find(c => c.id === fatura.contratoId);
                  
                  return (
                    <TableRow key={fatura.id}>
                      <TableCell>{cliente?.nome}</TableCell>
                      <TableCell>{contrato?.numero}</TableCell>
                      <TableCell>{format(new Date(fatura.dataEmissao), "dd/MM/yyyy")}</TableCell>
                      <TableCell>{format(new Date(fatura.dataVencimento), "dd/MM/yyyy")}</TableCell>
                      <TableCell>{fatura.valor}</TableCell>
                      <TableCell>{fatura.status}</TableCell>
                      <TableCell className="text-right space-x-2">
                        <Button variant="outline" size="icon" onClick={() => handleEditFatura(fatura)}>
                          Editar
                        </Button>
                        <Button variant="outline" size="icon" className="text-destructive" onClick={() => handleDeleteFatura(fatura.id)}>
                          Excluir
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-10">
                    Nenhuma fatura encontrada.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
        
        <CardFooter className="flex justify-between border-t pt-4">
          <div>
            Total de faturas: {faturas.length}
          </div>
        </CardFooter>
      </Card>
    </AdminLayout>
  );
};

export default FaturamentoPage;
