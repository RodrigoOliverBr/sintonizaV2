
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { PlusCircle, Copy, Pencil, Trash, ListChecks, Check, Plus, Save, ArrowUp, ArrowDown, X, Folder } from "lucide-react";
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
  duplicateFormTemplate,
  addSectionToTemplate,
  updateSection,
  deleteSection,
  addQuestionToSection,
  updateQuestion,
  deleteQuestion,
  reorderSections,
  reorderQuestions
} from "@/services/formTemplateService";
import { FormTemplate } from "@/types/admin";
import { formData } from "@/data/formData";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger, SheetFooter } from "@/components/ui/sheet";
import { FormSection, Question, SeverityLevel } from "@/types/form";

const FormulariosPage = () => {
  const [templates, setTemplates] = useState<FormTemplate[]>([]);
  const [currentTemplate, setCurrentTemplate] = useState<FormTemplate | null>(null);
  const [isGeneralDialogOpen, setIsGeneralDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  // Tab de informações gerais
  const [formName, setFormName] = useState("");
  const [formDesc, setFormDesc] = useState("");
  const [formActive, setFormActive] = useState(true);
  const [formDefault, setFormDefault] = useState(false);
  
  // Tab de seções e perguntas
  const [currentSection, setCurrentSection] = useState<{index: number, data: FormSection} | null>(null);
  const [isQuestionSheetOpen, setIsQuestionSheetOpen] = useState(false);
  const [isSectionDialogOpen, setIsSectionDialogOpen] = useState(false);
  const [newSectionTitle, setNewSectionTitle] = useState("");
  const [newSectionDesc, setNewSectionDesc] = useState("");
  
  // Estado da pergunta em edição
  const [currentQuestion, setCurrentQuestion] = useState<{sectionIndex: number, data: Question} | null>(null);
  const [questionText, setQuestionText] = useState("");
  const [questionRisk, setQuestionRisk] = useState("");
  const [questionSeverity, setQuestionSeverity] = useState<SeverityLevel>("LEVEMENTE PREJUDICIAL");
  const [questionMitigation, setQuestionMitigation] = useState("");
  const [questionShowObservation, setQuestionShowObservation] = useState(false);
  
  useEffect(() => {
    loadTemplates();
  }, []);
  
  const loadTemplates = () => {
    const loadedTemplates = getFormTemplates();
    setTemplates(loadedTemplates);
  };
  
  // Funções para gerenciamento de templates
  
  const openNewTemplateDialog = () => {
    setCurrentTemplate(null);
    setFormName("");
    setFormDesc("");
    setFormActive(true);
    setFormDefault(false);
    setIsGeneralDialogOpen(true);
  };
  
  const openEditTemplateDialog = (id: string) => {
    const template = getFormTemplateById(id);
    if (template) {
      setCurrentTemplate(template);
      setFormName(template.nome);
      setFormDesc(template.descricao);
      setFormActive(template.ativo);
      setFormDefault(template.padrao);
      setIsGeneralDialogOpen(true);
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
      
      setIsGeneralDialogOpen(false);
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
  
  // Funções para gerenciamento de seções
  
  const openAddSectionDialog = () => {
    if (!currentTemplate) {
      toast.error("Selecione um formulário primeiro");
      return;
    }
    
    setNewSectionTitle("");
    setNewSectionDesc("");
    setCurrentSection(null);
    setIsSectionDialogOpen(true);
  };
  
  const openEditSectionDialog = (sectionIndex: number) => {
    if (!currentTemplate) {
      toast.error("Selecione um formulário primeiro");
      return;
    }
    
    const section = currentTemplate.secoes[sectionIndex];
    setCurrentSection({index: sectionIndex, data: section});
    setNewSectionTitle(section.title);
    setNewSectionDesc(section.description || "");
    setIsSectionDialogOpen(true);
  };
  
  const handleSaveSection = () => {
    try {
      if (!currentTemplate) {
        toast.error("Formulário não selecionado");
        return;
      }
      
      if (!newSectionTitle.trim()) {
        toast.error("O título da seção é obrigatório");
        return;
      }
      
      if (currentSection !== null) {
        // Atualização de seção existente
        updateSection(
          currentTemplate.id, 
          currentSection.index, 
          {
            title: newSectionTitle,
            description: newSectionDesc || undefined
          }
        );
        toast.success("Seção atualizada com sucesso");
      } else {
        // Nova seção
        addSectionToTemplate(
          currentTemplate.id, 
          {
            title: newSectionTitle,
            description: newSectionDesc || undefined
          }
        );
        toast.success("Seção adicionada com sucesso");
      }
      
      setIsSectionDialogOpen(false);
      // Recarregar o template atual
      if (currentTemplate) {
        const updatedTemplate = getFormTemplateById(currentTemplate.id);
        if (updatedTemplate) {
          setCurrentTemplate(updatedTemplate);
        }
      }
      loadTemplates();
    } catch (error) {
      toast.error(`Erro ao salvar seção: ${(error as Error).message}`);
    }
  };
  
  const handleDeleteSection = (sectionIndex: number) => {
    try {
      if (!currentTemplate) {
        toast.error("Formulário não selecionado");
        return;
      }
      
      deleteSection(currentTemplate.id, sectionIndex);
      toast.success("Seção excluída com sucesso");
      
      // Recarregar o template atual
      const updatedTemplate = getFormTemplateById(currentTemplate.id);
      if (updatedTemplate) {
        setCurrentTemplate(updatedTemplate);
      }
      loadTemplates();
    } catch (error) {
      toast.error(`Erro ao excluir seção: ${(error as Error).message}`);
    }
  };
  
  // Funções para gerenciamento de perguntas
  
  const openAddQuestionSheet = (sectionIndex: number) => {
    if (!currentTemplate) {
      toast.error("Selecione um formulário primeiro");
      return;
    }
    
    // Resetar o formulário de pergunta
    setCurrentQuestion(null);
    setQuestionText("");
    setQuestionRisk("");
    setQuestionSeverity("LEVEMENTE PREJUDICIAL");
    setQuestionMitigation("");
    setQuestionShowObservation(false);
    
    // Armazenar o índice da seção para adicionar a nova pergunta
    setCurrentQuestion({
      sectionIndex,
      data: {
        id: 0, // Será gerado pelo serviço
        text: "",
        risk: "",
        severity: "LEVEMENTE PREJUDICIAL",
        mitigationActions: [],
        showObservation: false
      }
    });
    
    setIsQuestionSheetOpen(true);
  };
  
  const openEditQuestionSheet = (sectionIndex: number, question: Question) => {
    if (!currentTemplate) {
      toast.error("Selecione um formulário primeiro");
      return;
    }
    
    setCurrentQuestion({
      sectionIndex,
      data: question
    });
    
    setQuestionText(question.text);
    setQuestionRisk(question.risk);
    setQuestionSeverity(question.severity);
    setQuestionMitigation(question.mitigationActions.join("\n"));
    setQuestionShowObservation(question.showObservation || false);
    
    setIsQuestionSheetOpen(true);
  };
  
  const handleSaveQuestion = () => {
    try {
      if (!currentTemplate || !currentQuestion) {
        toast.error("Formulário ou seção não selecionados");
        return;
      }
      
      if (!questionText.trim()) {
        toast.error("O texto da pergunta é obrigatório");
        return;
      }
      
      if (!questionRisk.trim()) {
        toast.error("O risco é obrigatório");
        return;
      }
      
      // Separar as ações de mitigação por quebras de linha
      const mitigationActions = questionMitigation
        .split("\n")
        .map(line => line.trim())
        .filter(line => line.length > 0);
      
      const questionData = {
        text: questionText,
        risk: questionRisk,
        severity: questionSeverity,
        mitigationActions: mitigationActions,
        showObservation: questionShowObservation
      };
      
      if (currentQuestion.data.id === 0) {
        // Nova pergunta
        addQuestionToSection(
          currentTemplate.id,
          currentQuestion.sectionIndex,
          questionData
        );
        toast.success("Pergunta adicionada com sucesso");
      } else {
        // Atualização de pergunta existente
        updateQuestion(
          currentTemplate.id,
          currentQuestion.sectionIndex,
          currentQuestion.data.id,
          questionData
        );
        toast.success("Pergunta atualizada com sucesso");
      }
      
      setIsQuestionSheetOpen(false);
      // Recarregar o template atual
      const updatedTemplate = getFormTemplateById(currentTemplate.id);
      if (updatedTemplate) {
        setCurrentTemplate(updatedTemplate);
      }
      loadTemplates();
    } catch (error) {
      toast.error(`Erro ao salvar pergunta: ${(error as Error).message}`);
    }
  };
  
  const handleDeleteQuestion = (sectionIndex: number, questionId: number) => {
    try {
      if (!currentTemplate) {
        toast.error("Formulário não selecionado");
        return;
      }
      
      deleteQuestion(currentTemplate.id, sectionIndex, questionId);
      toast.success("Pergunta excluída com sucesso");
      
      // Recarregar o template atual
      const updatedTemplate = getFormTemplateById(currentTemplate.id);
      if (updatedTemplate) {
        setCurrentTemplate(updatedTemplate);
      }
      loadTemplates();
    } catch (error) {
      toast.error(`Erro ao excluir pergunta: ${(error as Error).message}`);
    }
  };
  
  const handleMoveQuestion = (direction: 'up' | 'down', sectionIndex: number, questionIndex: number) => {
    try {
      if (!currentTemplate) {
        toast.error("Formulário não selecionado");
        return;
      }
      
      const section = currentTemplate.secoes[sectionIndex];
      const questions = [...section.questions];
      
      if (direction === 'up' && questionIndex > 0) {
        // Trocar com a pergunta anterior
        [questions[questionIndex], questions[questionIndex - 1]] = [questions[questionIndex - 1], questions[questionIndex]];
      } else if (direction === 'down' && questionIndex < questions.length - 1) {
        // Trocar com a próxima pergunta
        [questions[questionIndex], questions[questionIndex + 1]] = [questions[questionIndex + 1], questions[questionIndex]];
      } else {
        return; // Não é possível mover
      }
      
      // Criar nova ordem baseada nos índices
      const newOrder = questions.map((_, i) => {
        if (i === questionIndex - 1 && direction === 'up') return questionIndex;
        if (i === questionIndex && direction === 'up') return questionIndex - 1;
        if (i === questionIndex + 1 && direction === 'down') return questionIndex;
        if (i === questionIndex && direction === 'down') return questionIndex + 1;
        return i;
      });
      
      reorderQuestions(currentTemplate.id, sectionIndex, newOrder);
      
      // Recarregar o template atual
      const updatedTemplate = getFormTemplateById(currentTemplate.id);
      if (updatedTemplate) {
        setCurrentTemplate(updatedTemplate);
      }
      loadTemplates();
    } catch (error) {
      toast.error(`Erro ao mover pergunta: ${(error as Error).message}`);
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
                        onClick={() => {
                          setCurrentTemplate(template);
                        }}
                        title="Gerenciar perguntas"
                      >
                        <ListChecks className="h-4 w-4" />
                      </Button>
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
      
      {/* Detalhes do formulário selecionado */}
      {currentTemplate && (
        <Card className="mt-6">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Gerenciar Formulário: {currentTemplate.nome}</CardTitle>
            <Button 
              variant="outline" 
              onClick={() => setCurrentTemplate(null)}
            >
              <X className="mr-2 h-4 w-4" />
              Fechar
            </Button>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="sections">
              <TabsList className="mb-4">
                <TabsTrigger value="general">Informações Gerais</TabsTrigger>
                <TabsTrigger value="sections">Seções e Perguntas</TabsTrigger>
              </TabsList>
              
              {/* Aba de informações gerais */}
              <TabsContent value="general">
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name">Nome do Formulário</Label>
                      <Input
                        id="name"
                        value={currentTemplate.nome}
                        readOnly
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="status">Status</Label>
                      <div className="mt-2">
                        <Badge variant={currentTemplate.ativo ? "success" : "destructive"}>
                          {currentTemplate.ativo ? "Ativo" : "Inativo"}
                        </Badge>
                      </div>
                    </div>
                    <div className="md:col-span-2">
                      <Label htmlFor="description">Descrição</Label>
                      <Textarea
                        id="description"
                        value={currentTemplate.descricao}
                        readOnly
                        className="mt-1"
                        rows={3}
                      />
                    </div>
                  </div>
                  
                  <Button onClick={() => openEditTemplateDialog(currentTemplate.id)}>
                    <Pencil className="mr-2 h-4 w-4" />
                    Editar Informações
                  </Button>
                </div>
              </TabsContent>
              
              {/* Aba de seções e perguntas */}
              <TabsContent value="sections">
                <div className="space-y-4">
                  <div className="flex justify-end">
                    <Button onClick={openAddSectionDialog}>
                      <Folder className="mr-2 h-4 w-4" />
                      Nova Seção
                    </Button>
                  </div>
                  
                  {currentTemplate.secoes.length === 0 ? (
                    <div className="bg-muted p-8 text-center text-muted-foreground">
                      <p>Este formulário não possui seções.</p>
                      <p>Clique em "Nova Seção" para adicionar.</p>
                    </div>
                  ) : (
                    <Accordion type="multiple" className="w-full">
                      {currentTemplate.secoes.map((section, sectionIndex) => (
                        <AccordionItem 
                          key={`section-${sectionIndex}`} 
                          value={`section-${sectionIndex}`}
                          className="border rounded-md mb-4 border-muted"
                        >
                          <AccordionTrigger className="px-4 py-2 hover:no-underline">
                            <div className="flex flex-1 items-center justify-between">
                              <span className="font-medium">{section.title}</span>
                              <div className="flex items-center space-x-2 mr-6">
                                <Badge variant="outline">{section.questions.length} perguntas</Badge>
                              </div>
                            </div>
                          </AccordionTrigger>
                          <AccordionContent className="px-4 pt-2 pb-4">
                            <div className="mb-4 flex justify-between items-center">
                              <div>
                                {section.description && (
                                  <p className="text-sm text-muted-foreground">{section.description}</p>
                                )}
                              </div>
                              <div className="flex space-x-2">
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  onClick={() => openEditSectionDialog(sectionIndex)}
                                >
                                  <Pencil className="h-4 w-4 mr-1" />
                                  Editar Seção
                                </Button>
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  onClick={() => openAddQuestionSheet(sectionIndex)}
                                >
                                  <Plus className="h-4 w-4 mr-1" />
                                  Nova Pergunta
                                </Button>
                                <AlertDialog>
                                  <AlertDialogTrigger asChild>
                                    <Button 
                                      variant="outline" 
                                      size="sm"
                                      className="text-red-500 border-red-200 hover:bg-red-50"
                                    >
                                      <Trash className="h-4 w-4 mr-1" />
                                      Excluir Seção
                                    </Button>
                                  </AlertDialogTrigger>
                                  <AlertDialogContent>
                                    <AlertDialogHeader>
                                      <AlertDialogTitle>
                                        Confirmar exclusão de seção
                                      </AlertDialogTitle>
                                      <AlertDialogDescription>
                                        Tem certeza que deseja excluir a seção "{section.title}" e todas as suas perguntas? Esta ação não pode ser desfeita.
                                      </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                      <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                      <AlertDialogAction
                                        onClick={() => handleDeleteSection(sectionIndex)}
                                        className="bg-red-500 hover:bg-red-600"
                                      >
                                        Excluir
                                      </AlertDialogAction>
                                    </AlertDialogFooter>
                                  </AlertDialogContent>
                                </AlertDialog>
                              </div>
                            </div>
                            
                            {/* Lista de perguntas */}
                            {section.questions.length > 0 ? (
                              <div className="space-y-4 mt-4">
                                {section.questions.map((question, questionIndex) => (
                                  <Card key={`question-${question.id}`} className="border-l-4" style={{
                                    borderLeftColor: question.severity === "LEVEMENTE PREJUDICIAL" ? "#FFD700" : 
                                      question.severity === "PREJUDICIAL" ? "#FF8C00" : "#FF4500"
                                  }}>
                                    <CardContent className="p-4">
                                      <div className="flex justify-between items-start">
                                        <div className="flex-1 mr-4">
                                          <div className="text-sm font-medium text-esocial-blue mb-1">
                                            Risco: {question.risk}
                                          </div>
                                          <p className="font-medium">{question.text}</p>
                                          <div className="mt-2 flex items-center space-x-2">
                                            <Badge className={
                                              question.severity === "LEVEMENTE PREJUDICIAL" ? "bg-yellow-400 text-yellow-900" : 
                                              question.severity === "PREJUDICIAL" ? "bg-orange-400 text-orange-900" : 
                                              "bg-red-500 text-white"
                                            }>
                                              {question.severity}
                                            </Badge>
                                            {question.showObservation && (
                                              <Badge variant="outline">Com observações</Badge>
                                            )}
                                          </div>
                                        </div>
                                        <div className="flex space-x-1">
                                          <Button 
                                            variant="ghost" 
                                            size="icon"
                                            onClick={() => handleMoveQuestion('up', sectionIndex, questionIndex)} 
                                            disabled={questionIndex === 0}
                                            title="Mover para cima"
                                          >
                                            <ArrowUp className="h-4 w-4" />
                                          </Button>
                                          <Button 
                                            variant="ghost" 
                                            size="icon"
                                            onClick={() => handleMoveQuestion('down', sectionIndex, questionIndex)} 
                                            disabled={questionIndex === section.questions.length - 1}
                                            title="Mover para baixo"
                                          >
                                            <ArrowDown className="h-4 w-4" />
                                          </Button>
                                          <Button 
                                            variant="ghost" 
                                            size="icon"
                                            onClick={() => openEditQuestionSheet(sectionIndex, question)}
                                            title="Editar pergunta"
                                          >
                                            <Pencil className="h-4 w-4" />
                                          </Button>
                                          <AlertDialog>
                                            <AlertDialogTrigger asChild>
                                              <Button 
                                                variant="ghost" 
                                                size="icon"
                                                className="text-red-500"
                                                title="Excluir pergunta"
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
                                                  Tem certeza que deseja excluir esta pergunta? Esta ação não pode ser desfeita.
                                                </AlertDialogDescription>
                                              </AlertDialogHeader>
                                              <AlertDialogFooter>
                                                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                                <AlertDialogAction
                                                  onClick={() => handleDeleteQuestion(sectionIndex, question.id)}
                                                  className="bg-red-500 hover:bg-red-600"
                                                >
                                                  Excluir
                                                </AlertDialogAction>
                                              </AlertDialogFooter>
                                            </AlertDialogContent>
                                          </AlertDialog>
                                        </div>
                                      </div>
                                      
                                      {/* Exibir ações de mitigação */}
                                      {question.mitigationActions.length > 0 && (
                                        <div className="mt-4 pt-4 border-t">
                                          <p className="text-sm font-medium mb-2">Ações de mitigação:</p>
                                          <ul className="list-disc pl-5 space-y-1 text-sm text-muted-foreground">
                                            {question.mitigationActions.map((action, i) => (
                                              <li key={i}>{action}</li>
                                            ))}
                                          </ul>
                                        </div>
                                      )}
                                    </CardContent>
                                  </Card>
                                ))}
                              </div>
                            ) : (
                              <div className="bg-muted p-4 rounded-md text-center text-muted-foreground">
                                <p>Nenhuma pergunta cadastrada nesta seção.</p>
                              </div>
                            )}
                          </AccordionContent>
                        </AccordionItem>
                      ))}
                    </Accordion>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      )}
      
      {/* Modal para criar/editar formulário */}
      <Dialog open={isGeneralDialogOpen} onOpenChange={setIsGeneralDialogOpen}>
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
            <Button variant="outline" onClick={() => setIsGeneralDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSaveTemplate}>Salvar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Modal para criar/editar seção */}
      <Dialog open={isSectionDialogOpen} onOpenChange={setIsSectionDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {currentSection ? "Editar Seção" : "Nova Seção"}
            </DialogTitle>
            <DialogDescription>
              {currentSection
                ? "Atualize as informações da seção"
                : "Preencha as informações para criar uma nova seção"}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="section-title">Título da Seção</Label>
              <Input
                id="section-title"
                value={newSectionTitle}
                onChange={(e) => setNewSectionTitle(e.target.value)}
                placeholder="Ex: Organização e Gestão do Trabalho"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="section-desc">Descrição (opcional)</Label>
              <Textarea
                id="section-desc"
                value={newSectionDesc}
                onChange={(e) => setNewSectionDesc(e.target.value)}
                placeholder="Descrição detalhada da seção"
                rows={2}
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsSectionDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSaveSection}>Salvar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Sheet para criar/editar pergunta */}
      <Sheet open={isQuestionSheetOpen} onOpenChange={setIsQuestionSheetOpen}>
        <SheetContent className="w-full md:max-w-md overflow-y-auto">
          <SheetHeader>
            <SheetTitle>
              {currentQuestion?.data.id === 0 ? "Nova Pergunta" : "Editar Pergunta"}
            </SheetTitle>
            <SheetDescription>
              {currentQuestion?.data.id === 0
                ? "Preencha os detalhes para adicionar uma nova pergunta"
                : "Atualize os detalhes da pergunta"}
            </SheetDescription>
          </SheetHeader>
          
          <div className="space-y-4 py-8">
            <div className="space-y-2">
              <Label htmlFor="question-text">Pergunta</Label>
              <Textarea
                id="question-text"
                value={questionText}
                onChange={(e) => setQuestionText(e.target.value)}
                placeholder="Digite a pergunta aqui..."
                rows={3}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="question-risk">Risco</Label>
              <Input
                id="question-risk"
                value={questionRisk}
                onChange={(e) => setQuestionRisk(e.target.value)}
                placeholder="Ex: Sobrecarga de Trabalho sem Aviso Prévio"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="question-severity">Gravidade</Label>
              <Select 
                value={questionSeverity} 
                onValueChange={(value: SeverityLevel) => setQuestionSeverity(value)}
              >
                <SelectTrigger id="question-severity" className="w-full">
                  <SelectValue placeholder="Selecione a gravidade" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="LEVEMENTE PREJUDICIAL">LEVEMENTE PREJUDICIAL</SelectItem>
                  <SelectItem value="PREJUDICIAL">PREJUDICIAL</SelectItem>
                  <SelectItem value="EXTREMAMENTE PREJUDICIAL">EXTREMAMENTE PREJUDICIAL</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="question-mitigation">
                Ações de Mitigação
                <span className="text-xs text-muted-foreground block mt-1">
                  Digite uma ação por linha
                </span>
              </Label>
              <Textarea
                id="question-mitigation"
                value={questionMitigation}
                onChange={(e) => setQuestionMitigation(e.target.value)}
                placeholder="Ex: Estabelecer políticas claras sobre realização e comunicação antecipada de horas extras."
                rows={5}
                className="font-mono text-sm"
              />
            </div>
            
            <div className="flex items-center justify-between space-x-2">
              <Label htmlFor="question-observation">
                Permitir observações
                <p className="text-xs text-muted-foreground">
                  Habilita campo de observações quando a resposta for "Sim"
                </p>
              </Label>
              <Switch
                id="question-observation"
                checked={questionShowObservation}
                onCheckedChange={setQuestionShowObservation}
              />
            </div>
          </div>
          
          <SheetFooter>
            <Button variant="outline" onClick={() => setIsQuestionSheetOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSaveQuestion}>Salvar</Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </AdminLayout>
  );
};

export default FormulariosPage;
