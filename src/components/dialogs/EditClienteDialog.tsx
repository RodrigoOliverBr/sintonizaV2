
import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Cliente, TipoPessoa } from "@/types/admin";
import { toast } from "sonner";

interface EditClienteDialogProps {
  isOpen: boolean;
  onClose: () => void;
  cliente?: Cliente | null;
  onSave: (cliente: Omit<Cliente, "id">) => void;
}

const EditClienteDialog = ({ isOpen, onClose, cliente, onSave }: EditClienteDialogProps) => {
  const [formData, setFormData] = useState<Omit<Cliente, "id" | "dataInclusao">>({
    nome: "",
    tipo: "juridica",
    numeroEmpregados: 0,
    situacao: "liberado",
    cpfCnpj: "",
    email: "",
    telefone: "",
    endereco: "",
    cidade: "",
    estado: "",
    cep: "",
    contato: "",
  });

  useEffect(() => {
    if (cliente) {
      const { id, dataInclusao, ...clienteData } = cliente;
      setFormData(clienteData);
    } else {
      setFormData({
        nome: "",
        tipo: "juridica",
        numeroEmpregados: 0,
        situacao: "liberado",
        cpfCnpj: "",
        email: "",
        telefone: "",
        endereco: "",
        cidade: "",
        estado: "",
        cep: "",
        contato: "",
      });
    }
  }, [cliente, isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    if (name === "numeroEmpregados") {
      setFormData(prev => ({
        ...prev,
        [name]: parseInt(value) || 0
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      onSave({
        ...formData,
        dataInclusao: cliente?.dataInclusao || Date.now()
      });
      toast.success(`Cliente ${cliente ? "atualizado" : "criado"} com sucesso!`);
      onClose();
    } catch (error) {
      toast.error(`Erro ao ${cliente ? "atualizar" : "criar"} cliente: ${error}`);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[550px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>{cliente ? "Editar Cliente" : "Novo Cliente"}</DialogTitle>
            <DialogDescription>
              {cliente ? "Atualize os dados do cliente" : "Preencha os dados para criar um novo cliente"}
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="nome">Nome/Razão Social</Label>
                <Input
                  id="nome"
                  name="nome"
                  value={formData.nome}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="tipo">Tipo de Pessoa</Label>
                <Select 
                  value={formData.tipo} 
                  onValueChange={(value) => handleSelectChange("tipo", value as TipoPessoa)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="juridica">Jurídica</SelectItem>
                    <SelectItem value="fisica">Física</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="cpfCnpj">CPF/CNPJ</Label>
                <Input
                  id="cpfCnpj"
                  name="cpfCnpj"
                  value={formData.cpfCnpj}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="numeroEmpregados">Número de Empregados</Label>
                <Input
                  id="numeroEmpregados"
                  name="numeroEmpregados"
                  type="number"
                  value={formData.numeroEmpregados}
                  onChange={handleChange}
                  min="0"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="email">E-mail</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="telefone">Telefone</Label>
                <Input
                  id="telefone"
                  name="telefone"
                  value={formData.telefone}
                  onChange={handleChange}
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="endereco">Endereço</Label>
                <Input
                  id="endereco"
                  name="endereco"
                  value={formData.endereco}
                  onChange={handleChange}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="contato">Nome do Contato</Label>
                <Input
                  id="contato"
                  name="contato"
                  value={formData.contato}
                  onChange={handleChange}
                />
              </div>
            </div>
            
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="cidade">Cidade</Label>
                <Input
                  id="cidade"
                  name="cidade"
                  value={formData.cidade}
                  onChange={handleChange}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="estado">Estado</Label>
                <Input
                  id="estado"
                  name="estado"
                  value={formData.estado}
                  onChange={handleChange}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="cep">CEP</Label>
                <Input
                  id="cep"
                  name="cep"
                  value={formData.cep}
                  onChange={handleChange}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="situacao">Situação</Label>
              <Select 
                value={formData.situacao} 
                onValueChange={(value) => handleSelectChange("situacao", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione a situação" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="liberado">Ativo</SelectItem>
                  <SelectItem value="bloqueado">Bloqueado</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit">
              {cliente ? "Salvar Alterações" : "Criar Cliente"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditClienteDialog;
