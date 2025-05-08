
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { PlusCircle, Copy, Pencil, Trash, ListChecks, Check } from "lucide-react";
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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
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
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { 
  getFormTemplates, 
  getFormTemplateById, 
  addFormTemplate, 
  updateFormTemplate, 
  deleteFormTemplate, 
  duplicateFormTemplate 
} from "@/services/formTemplateService";
import { FormTemplate } from "@/types/admin";
import { formData } from "@/data/formData";

const FormulariosPage = () => {
  const [templates, setTemplates] = useState<FormTemplate[]>([]);
  const [currentTemplate, setCurrentTemplate] = useState<FormTemplate | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  // Formulário
  const [formName, setFormName] = useState("");
  const [formDesc, setFormDesc] = useState("");
  const [formActive, setFormActive] = useState(true);
  const [formDefault, setFormDefault] = useState(false);
  
  useEffect(() => {
    loadTemplates();
  }, []);
  
  const loadTemplates = () => {
    const loadedTemplates = getFormTemplates();
    setTemplates(loadedTemplates);
  };
  
  const openNewTemplateDialog = () => {
    setCurrentTemplate(null);
    setFormName("");
    setFormDesc("");
    setFormActive(true);
    setFormDefault(false);
    setIsDialogOpen(true);
  };
  
  const openEditTemplateDialog = (id: string) => {
    const template = getFormTemplateById(id);
    if (template) {
      setCurrentTemplate(template);
      setFormName(template.nome);
      setFormDesc(template.descricao);
      setFormActive(template.ativo);
      setFormDefault(template.padrao);
      setIsDialogOpen(true);
    }
  };
  
  const handleSaveTemplate = () => {
    try {
      if (!formName.trim()) {
        toast.error("O nome do formulário é obrigatório");
        return;
      }
      
      if (currentTemplate) {
        // Atualização
        updateFormTemplate({
          ...currentTemplate,
          nome: formName,
          descricao: formDesc,
          ativo: formActive,
          padrao: formDefault
        });
        toast.success("Formulário atualizado com sucesso");
      } else {
        // Novo formulário
        addFormTemplate({
          nome: formName,
          descricao: formDesc,
          ativo: formActive,
          padrao: formDefault,
          secoes: formData.sections // Usar o formulário padrão como base
        });
        toast.success("Novo formulário criado com sucesso");
      }
      
      setIsDialogOpen(false);
      loadTemplates();
    } catch (error) {
      toast.error(`Erro ao salvar formulário: ${(error as Error).message}`);
    }
  };
  
  const handleDeleteTemplate = (id: string) => {
    try {
      deleteFormTemplate(id);
      toast.success("Formulário excluído com sucesso");
      loadTemplates();
    } catch (error) {
      toast.error(`Erro ao excluir formulário: ${(error as Error).message}`);
    }
  };
  
  const handleDuplicateTemplate = (id: string) => {
    try {
      duplicateFormTemplate(id);
      toast.success("Formulário duplicado com sucesso");
      loadTemplates();
    } catch (error) {
      toast.error(`Erro ao duplicar formulário: ${(error as Error).message}`);
    }
  };
  
  const filteredTemplates = templates.filter(template => 
    template.nome.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <AdminLayout title="Formulários">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Modelos de Formulários</CardTitle>
          <Button onClick={openNewTemplateDialog}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Novo Formulário
          </Button>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <Input
              placeholder="Buscar formulário..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-sm"
            />
          </div>
          
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Descrição</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Padrão</TableHead>
                <TableHead>Última Atualização</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTemplates.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                    Nenhum formulário encontrado
                  </TableCell>
                </TableRow>
              ) : (
                filteredTemplates.map((template) => (
                  <TableRow key={template.id}>
                    <TableCell className="font-medium">{template.nome}</TableCell>
                    <TableCell className="max-w-xs truncate">
                      {template.descricao}
                    </TableCell>
                    <TableCell>
                      <Badge variant={template.ativo ? "success" : "destructive"}>
                        {template.ativo ? "Ativo" : "Inativo"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {template.padrao && (
                        <Badge variant="outline" className="bg-blue-50">
                          <Check className="h-3 w-3 mr-1" />
                          Padrão
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      {new Date(template.ultimaAtualizacao).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-right space-x-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDuplicateTemplate(template.id)}
                        title="Duplicar"
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => openEditTemplateDialog(template.id)}
                        title="Editar"
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      {!template.padrao && (
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="text-red-500 hover:text-red-600"
                              title="Excluir"
                            >
                              <Trash className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>
                                Confirmar exclusão
                              </AlertDialogTitle>
                              <AlertDialogDescription>
                                Tem certeza que deseja excluir este formulário? Esta ação não pode ser desfeita.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancelar</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDeleteTemplate(template.id)}
                                className="bg-red-500 hover:bg-red-600"
                              >
                                Excluir
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      
      {/* Modal para criar/editar formulário */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {currentTemplate ? "Editar Formulário" : "Novo Formulário"}
            </DialogTitle>
            <DialogDescription>
              {currentTemplate
                ? "Atualize as informações do formulário"
                : "Preencha as informações para criar um novo formulário"}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nome do Formulário</Label>
              <Input
                id="name"
                value={formName}
                onChange={(e) => setFormName(e.target.value)}
                placeholder="Ex: ISTAS21-BR Customizado"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">Descrição</Label>
              <Textarea
                id="description"
                value={formDesc}
                onChange={(e) => setFormDesc(e.target.value)}
                placeholder="Descrição detalhada do formulário"
                rows={3}
              />
            </div>
            
            <div className="flex items-center justify-between space-x-2">
              <Label htmlFor="active">Ativo</Label>
              <Switch
                id="active"
                checked={formActive}
                onCheckedChange={setFormActive}
              />
            </div>
            
            <div className="flex items-center justify-between space-x-2">
              <Label htmlFor="default">
                Definir como padrão
                <p className="text-xs text-muted-foreground">
                  O formulário padrão será usado para novos clientes
                </p>
              </Label>
              <Switch
                id="default"
                checked={formDefault}
                onCheckedChange={setFormDefault}
                disabled={currentTemplate?.padrao}
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSaveTemplate}>Salvar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
};

export default FormulariosPage;
