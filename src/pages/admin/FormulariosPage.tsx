
import React, { useState, useEffect } from "react";
import AdminLayout from "@/components/AdminLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Edit, Trash2, AlertCircle, Info, Copy } from "lucide-react";
import {
  getFormTemplates,
  updateFormTemplate,
  deleteFormTemplate,
  addFormTemplate,
  addSection,
  updateSection,
  deleteSection,
  addQuestion,
  duplicateFormTemplate
} from "@/services/formTemplateService";
import { FormSection, Question, SeverityLevel } from "@/types/form";
import { FormTemplate } from "@/types/admin";
import { toast } from "sonner";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { formData } from "@/data/formData";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

const FormulariosPage = () => {
  const [formTemplates, setFormTemplates] = useState<FormTemplate[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<FormTemplate | null>(null);
  const [activeTab, setActiveTab] = useState("formularios");
  const [formName, setFormName] = useState("");
  const [formDescription, setFormDescription] = useState("");
  const [showAddFormDialog, setShowAddFormDialog] = useState(false);
  const [showEditFormDialog, setShowEditFormDialog] = useState(false);
  
  // Seções
  const [selectedSectionId, setSelectedSectionId] = useState<string>("");
  const [newSectionTitle, setNewSectionTitle] = useState("");
  const [newSectionDescription, setNewSectionDescription] = useState("");
  const [showAddSectionDialog, setShowAddSectionDialog] = useState(false);
  const [showEditSectionDialog, setShowEditSectionDialog] = useState(false);
  
  // Perguntas
  const [newQuestionText, setNewQuestionText] = useState("");
  const [newQuestionType, setNewQuestionType] = useState("boolean");
  const [newQuestionRisk, setNewQuestionRisk] = useState("");
  const [newQuestionSeverity, setNewQuestionSeverity] = useState<SeverityLevel>("LEVEMENTE PREJUDICIAL");
  const [newQuestionMitigation, setNewQuestionMitigation] = useState("");
  const [newQuestionMitigationList, setNewQuestionMitigationList] = useState<string[]>([]);
  const [showAddQuestionDialog, setShowAddQuestionDialog] = useState(false);
  const [showEditQuestionDialog, setShowEditQuestionDialog] = useState(false);
  const [editingQuestionId, setEditingQuestionId] = useState<number | null>(null);
  
  useEffect(() => {
    loadFormTemplates();
  }, []);

  const loadFormTemplates = () => {
    const templates = getFormTemplates();
    setFormTemplates(templates);
  };

  const handleTemplateSelect = (template: FormTemplate) => {
    setSelectedTemplate(template);
    setFormName(template.nome);
    setFormDescription(template.descricao);
    setActiveTab("secoes");
  };

  const handleAddFormSubmit = () => {
    if (!formName || !formDescription) {
      toast.error("Nome e descrição do formulário são obrigatórios.");
      return;
    }

    const newFormTemplate = addFormTemplate({
      nome: formName,
      descricao: formDescription,
      ativo: true,
      padrao: false,
      secoes: [],
      dataCriacao: Date.now(),
      ultimaAtualizacao: Date.now()
    });

    setFormTemplates([...formTemplates, newFormTemplate]);
    setSelectedTemplate(newFormTemplate);
    setShowAddFormDialog(false);
    setActiveTab("secoes");
    toast.success("Formulário criado com sucesso!");
  };

  const handleUpdateFormSubmit = () => {
    if (!selectedTemplate || !formName || !formDescription) {
      toast.error("Selecione um formulário e preencha todos os campos.");
      return;
    }

    const updatedTemplate = {
      ...selectedTemplate,
      nome: formName,
      descricao: formDescription,
      ultimaAtualizacao: Date.now(),
    };

    updateFormTemplate(updatedTemplate);
    loadFormTemplates();
    setSelectedTemplate(updatedTemplate);
    setShowEditFormDialog(false);
    toast.success("Formulário atualizado com sucesso!");
  };

  const handleDeleteForm = () => {
    if (!selectedTemplate) return;

    deleteFormTemplate(selectedTemplate.id);
    loadFormTemplates();
    setSelectedTemplate(null);
    setActiveTab("formularios");
    toast.success("Formulário excluído com sucesso!");
  };

  const handleDuplicateForm = (templateId: string) => {
    try {
      const duplicatedTemplate = duplicateFormTemplate(templateId);
      loadFormTemplates();
      toast.success("Formulário duplicado com sucesso!");
    } catch (error) {
      toast.error("Erro ao duplicar formulário");
    }
  };

  const handleAddSectionSubmit = () => {
    if (!selectedTemplate) return;
    if (!newSectionTitle || !newSectionDescription) {
      toast.error("Título e descrição da seção são obrigatórios.");
      return;
    }

    // Create empty questions array with the correct type
    const emptyQuestions: Question[] = [];
    
    addSection(selectedTemplate.id, { 
      title: newSectionTitle, 
      description: newSectionDescription, 
      questions: emptyQuestions 
    });
    
    loadFormTemplates();
    
    // Re-select the template to update the UI
    const updatedTemplate = formTemplates.find(t => t.id === selectedTemplate.id);
    if (updatedTemplate) {
      setSelectedTemplate(updatedTemplate);
    }
    
    setNewSectionTitle("");
    setNewSectionDescription("");
    setShowAddSectionDialog(false);
    toast.success("Seção adicionada com sucesso!");
  };

  const handleUpdateSection = () => {
    if (!selectedTemplate || !selectedSectionId) return;

    const sectionToUpdate = selectedTemplate.secoes.find(section => section.id === selectedSectionId);
    if (!sectionToUpdate) return;

    const updatedSection = { 
      ...sectionToUpdate, 
      title: newSectionTitle, 
      description: newSectionDescription
    };
    
    updateSection(selectedTemplate.id, updatedSection);
    loadFormTemplates();
    
    // Re-select the template to update the UI
    const updatedTemplate = formTemplates.find(t => t.id === selectedTemplate.id);
    if (updatedTemplate) {
      setSelectedTemplate(updatedTemplate);
    }
    
    setShowEditSectionDialog(false);
    toast.success("Seção atualizada com sucesso!");
  };

  const handleDeleteSection = (sectionId: string) => {
    if (!selectedTemplate) return;

    deleteSection(selectedTemplate.id, sectionId);
    loadFormTemplates();
    
    // Re-select the template to update the UI
    const updatedTemplate = formTemplates.find(t => t.id === selectedTemplate.id);
    if (updatedTemplate) {
      setSelectedTemplate(updatedTemplate);
    }
    
    toast.success("Seção excluída com sucesso!");
  };

  const handleAddMitigation = () => {
    if (!newQuestionMitigation) return;
    
    setNewQuestionMitigationList([...newQuestionMitigationList, newQuestionMitigation]);
    setNewQuestionMitigation("");
  };

  const handleRemoveMitigation = (index: number) => {
    const updatedList = [...newQuestionMitigationList];
    updatedList.splice(index, 1);
    setNewQuestionMitigationList(updatedList);
  };

  const handleAddQuestionSubmit = () => {
    if (!selectedTemplate || !selectedSectionId) {
      toast.error("Selecione uma seção primeiro.");
      return;
    }
    
    if (!newQuestionText || !newQuestionRisk) {
      toast.error("Texto da pergunta e nome do risco são obrigatórios.");
      return;
    }

    // Create the new question
    const newQuestion: Partial<Question> = {
      text: newQuestionText, 
      type: newQuestionType,
      risk: newQuestionRisk,
      severity: newQuestionSeverity,
      mitigationActions: newQuestionMitigationList,
      showObservation: true
    };
    
    // Add the question to the section
    const section = selectedTemplate.secoes.find(sec => sec.id === selectedSectionId);
    if (section) {
      const addedQuestion = addQuestion(selectedTemplate.id, selectedSectionId, newQuestion);
      
      // Update the section with the new question
      const updatedQuestions = [...section.questions, addedQuestion];
      const updatedSection = { ...section, questions: updatedQuestions };
      updateSection(selectedTemplate.id, updatedSection);
      
      loadFormTemplates();
      
      // Re-select the template to update the UI
      const updatedTemplate = formTemplates.find(t => t.id === selectedTemplate.id);
      if (updatedTemplate) {
        setSelectedTemplate(updatedTemplate);
      }
    }
    
    // Reset form
    setNewQuestionText("");
    setNewQuestionType("boolean");
    setNewQuestionRisk("");
    setNewQuestionSeverity("LEVEMENTE PREJUDICIAL");
    setNewQuestionMitigation("");
    setNewQuestionMitigationList([]);
    setShowAddQuestionDialog(false);
    
    toast.success("Pergunta adicionada com sucesso!");
  };

  const handleDeleteQuestion = (sectionId: string, questionId: number) => {
    if (!selectedTemplate) return;

    const section = selectedTemplate.secoes.find(sec => sec.id === sectionId);
    if (!section) return;

    // Filter out the question to be deleted
    const updatedQuestions = section.questions.filter(q => q.id !== questionId);
    const updatedSection = { ...section, questions: updatedQuestions };
    
    // Update the section with the new questions
    updateSection(selectedTemplate.id, updatedSection);
    
    loadFormTemplates();
    
    // Re-select the template to update the UI
    const updatedTemplate = formTemplates.find(t => t.id === selectedTemplate.id);
    if (updatedTemplate) {
      setSelectedTemplate(updatedTemplate);
    }
    
    toast.success("Pergunta excluída com sucesso!");
  };

  const handleEditQuestion = (sectionId: string, questionId: number) => {
    if (!selectedTemplate) return;
    
    const section = selectedTemplate.secoes.find(sec => sec.id === sectionId);
    if (!section) return;
    
    const question = section.questions.find(q => q.id === questionId);
    if (!question) return;
    
    setSelectedSectionId(sectionId);
    setEditingQuestionId(questionId);
    setNewQuestionText(question.text);
    setNewQuestionType(question.type);
    setNewQuestionRisk(question.risk);
    setNewQuestionSeverity(question.severity);
    setNewQuestionMitigationList([...question.mitigationActions]);
    
    setShowEditQuestionDialog(true);
  };

  const handleUpdateQuestion = () => {
    if (!selectedTemplate || !selectedSectionId || !editingQuestionId) return;
    
    const section = selectedTemplate.secoes.find(sec => sec.id === selectedSectionId);
    if (!section) return;
    
    const questionIndex = section.questions.findIndex(q => q.id === editingQuestionId);
    if (questionIndex === -1) return;
    
    // Create a copy of the questions array
    const updatedQuestions = [...section.questions];
    
    // Update the specific question
    updatedQuestions[questionIndex] = {
      ...updatedQuestions[questionIndex],
      text: newQuestionText,
      type: newQuestionType,
      risk: newQuestionRisk,
      severity: newQuestionSeverity,
      mitigationActions: newQuestionMitigationList
    };
    
    // Update the section with the modified questions array
    const updatedSection = { ...section, questions: updatedQuestions };
    updateSection(selectedTemplate.id, updatedSection);
    
    loadFormTemplates();
    
    // Re-select the template to update the UI
    const updatedTemplate = formTemplates.find(t => t.id === selectedTemplate.id);
    if (updatedTemplate) {
      setSelectedTemplate(updatedTemplate);
    }
    
    // Reset form
    setEditingQuestionId(null);
    setNewQuestionText("");
    setNewQuestionType("boolean");
    setNewQuestionRisk("");
    setNewQuestionSeverity("LEVEMENTE PREJUDICIAL");
    setNewQuestionMitigation("");
    setNewQuestionMitigationList([]);
    setShowEditQuestionDialog(false);
    
    toast.success("Pergunta atualizada com sucesso!");
  };

  const handleCreatePsychoSocialForm = () => {
    // Find the form template
    const template = formTemplates.find(t => t.nome === "Avaliação de Riscos Psicossociais - Formulário Único");
    
    if (!template) {
      toast.error("Formulário não encontrado!");
      return;
    }

    // Add all sections from formData to the template
    formData.sections.forEach(section => {
      const newSection = addSection(template.id, {
        title: section.title,
        description: section.description,
        questions: [] as Question[]
      });

      // Get the added section
      const addedSection = newSection.secoes.find(s => s.title === section.title);
      
      if (addedSection) {
        // Add all questions to the section
        const updatedQuestions = [...addedSection.questions];
        
        section.questions.forEach(question => {
          updatedQuestions.push({
            id: question.id,
            text: question.text,
            type: question.type,
            risk: question.risk,
            severity: question.severity,
            mitigationActions: question.mitigationActions,
            options: question.options,
            showObservation: question.showObservation
          });
        });
        
        // Update the section with the questions
        updateSection(template.id, {
          ...addedSection,
          questions: updatedQuestions
        });
      }
    });
    
    // Reload form templates
    loadFormTemplates();
    toast.success("Formulário de riscos psicossociais criado com sucesso!");
  };

  const renderFormulariosTab = () => {
    return (
      <>
        <div className="mb-6">
          <Alert variant="info" className="bg-blue-50 text-blue-800 border-blue-200">
            <Info className="h-4 w-4" />
            <AlertTitle>Informação</AlertTitle>
            <AlertDescription>
              Os formulários padrão do sistema não podem ser alterados em sua estrutura principal.
              Para realizar modificações, crie uma cópia do formulário desejado.
            </AlertDescription>
          </Alert>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <Card 
            className="flex flex-col items-center justify-center cursor-pointer hover:shadow-md border-dashed border-2 text-center h-[200px]"
            onClick={() => {
              setFormName("");
              setFormDescription("");
              setShowAddFormDialog(true);
            }}
          >
            <CardContent className="p-6 flex flex-col items-center justify-center h-full">
              <div className="rounded-full bg-primary/10 p-3 mb-3">
                <Plus className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-lg font-medium">Adicionar Novo Formulário</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Crie um novo modelo de formulário personalizado
              </p>
            </CardContent>
          </Card>

          {formTemplates.map((template) => (
            <Card 
              key={template.id} 
              className={`relative hover:shadow-md transition-all h-[200px] ${template.padrao ? 'border-blue-200' : ''}`}
            >
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">{template.nome}</CardTitle>
                <CardDescription className="line-clamp-2">
                  {template.descricao}
                </CardDescription>
              </CardHeader>
              <CardContent className="pb-0">
                <div className="flex items-center text-sm text-muted-foreground gap-4">
                  <div>
                    <span className="font-medium">Seções:</span> {template.secoes.length}
                  </div>
                  <div>
                    <span className="font-medium">Atualizado:</span> {new Date(template.ultimaAtualizacao).toLocaleDateString()}
                  </div>
                </div>
                {template.padrao && (
                  <div className="mt-2">
                    <span className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">
                      Formulário Padrão
                    </span>
                  </div>
                )}
              </CardContent>
              <CardFooter className="flex justify-end pt-4">
                <div className="absolute bottom-3 right-3 flex gap-2">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDuplicateForm(template.id);
                    }}
                    title="Duplicar formulário"
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedTemplate(template);
                      setFormName(template.nome);
                      setFormDescription(template.descricao);
                      setShowEditFormDialog(true);
                    }}
                    title="Editar formulário"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={handleTemplateSelect.bind(null, template)}
                    title="Visualizar seções e perguntas"
                  >
                    <Info className="h-4 w-4" />
                  </Button>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>

        <div className="mt-6">
          <Button 
            variant="outline" 
            onClick={handleCreatePsychoSocialForm}
            title="Cria o formulário completo de riscos psicossociais a partir do modelo pré-definido"
          >
            Criar Formulário de Riscos Psicossociais
          </Button>
        </div>
      </>
    );
  };

  const renderSecoesTab = () => {
    if (!selectedTemplate) {
      return (
        <Alert variant="warning" className="bg-yellow-50 text-yellow-800 border-yellow-200">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Nenhum formulário selecionado</AlertTitle>
          <AlertDescription>
            Por favor, selecione um formulário na aba Formulários para gerenciar suas seções.
          </AlertDescription>
        </Alert>
      );
    }

    return (
      <>
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold">{selectedTemplate.nome}</h2>
            <p className="text-sm text-muted-foreground">{selectedTemplate.descricao}</p>
          </div>
          <Button onClick={() => setShowAddSectionDialog(true)}>
            <Plus className="mr-2 h-4 w-4" /> Adicionar Seção
          </Button>
        </div>

        {selectedTemplate.secoes.length === 0 ? (
          <div className="p-8 text-center border rounded-lg">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-muted">
              <AlertCircle className="h-6 w-6 text-muted-foreground" />
            </div>
            <h3 className="mb-1 text-lg font-medium">Nenhuma seção encontrada</h3>
            <p className="mb-4 text-sm text-muted-foreground">
              Este formulário ainda não possui seções. Adicione uma nova seção para começar.
            </p>
            <Button onClick={() => setShowAddSectionDialog(true)}>
              <Plus className="mr-2 h-4 w-4" /> Adicionar Seção
            </Button>
          </div>
        ) : (
          <div className="border rounded-md">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[300px]">Título</TableHead>
                  <TableHead className="hidden md:table-cell">Descrição</TableHead>
                  <TableHead className="w-[100px] text-center">Perguntas</TableHead>
                  <TableHead className="w-[120px] text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {selectedTemplate.secoes.map((section) => (
                  <TableRow key={section.id}>
                    <TableCell className="font-medium">{section.title}</TableCell>
                    <TableCell className="hidden md:table-cell max-w-[300px] truncate">
                      {section.description || "-"}
                    </TableCell>
                    <TableCell className="text-center">{section.questions.length}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            setSelectedSectionId(section.id);
                            setNewSectionTitle(section.title);
                            setNewSectionDescription(section.description || "");
                            setShowEditSectionDialog(true);
                          }}
                          title="Editar seção"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDeleteSection(section.id)}
                          title="Excluir seção"
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </>
    );
  };

  const renderPerguntasTab = () => {
    if (!selectedTemplate) {
      return (
        <Alert variant="warning" className="bg-yellow-50 text-yellow-800 border-yellow-200">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Nenhum formulário selecionado</AlertTitle>
          <AlertDescription>
            Por favor, selecione um formulário na aba Formulários para gerenciar suas perguntas.
          </AlertDescription>
        </Alert>
      );
    }

    if (selectedTemplate.secoes.length === 0) {
      return (
        <Alert variant="warning" className="bg-yellow-50 text-yellow-800 border-yellow-200">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Nenhuma seção encontrada</AlertTitle>
          <AlertDescription>
            Este formulário não possui seções. Adicione uma seção na aba Seções para poder adicionar perguntas.
          </AlertDescription>
        </Alert>
      );
    }

    return (
      <>
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold">{selectedTemplate.nome}</h2>
            <p className="text-sm text-muted-foreground">{selectedTemplate.descricao}</p>
          </div>
          <div className="flex items-center gap-2">
            <Select value={selectedSectionId} onValueChange={setSelectedSectionId}>
              <SelectTrigger className="w-[250px]">
                <SelectValue placeholder="Selecione uma seção para adicionar perguntas" />
              </SelectTrigger>
              <SelectContent>
                {selectedTemplate.secoes.map((section) => (
                  <SelectItem key={section.id} value={section.id}>
                    {section.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button 
              onClick={() => setShowAddQuestionDialog(true)}
              disabled={!selectedSectionId}
            >
              <Plus className="mr-2 h-4 w-4" /> Adicionar Pergunta
            </Button>
          </div>
        </div>

        <Accordion type="multiple" className="w-full">
          {selectedTemplate.secoes.map((section) => (
            <AccordionItem value={section.id} key={section.id}>
              <AccordionTrigger className="px-4">
                <div className="flex items-center gap-2">
                  <span className="font-medium">{section.title}</span>
                  <span className="bg-slate-100 text-slate-700 text-xs rounded-full px-2 py-0.5">
                    {section.questions.length} perguntas
                  </span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-4 pb-4">
                {section.questions.length === 0 ? (
                  <div className="p-4 text-center border rounded-lg">
                    <p className="text-sm text-muted-foreground">
                      Esta seção não possui perguntas. Selecione esta seção e adicione perguntas.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {section.questions.map((question) => (
                      <Card key={question.id} className="overflow-hidden">
                        <CardContent className="p-0">
                          <div className="border-l-4 p-4" style={{ 
                            borderLeftColor: getSeverityColor(question.severity),
                          }}>
                            <div className="flex justify-between items-start">
                              <div>
                                <div className="text-sm text-blue-600 font-medium mb-1">
                                  Risco: {question.risk}
                                </div>
                                <h4 className="font-medium">{question.text}</h4>
                                <div className="flex flex-wrap gap-2 mt-2">
                                  <span className="bg-slate-100 text-slate-700 text-xs rounded-full px-2 py-0.5">
                                    {question.severity}
                                  </span>
                                  <span className="bg-slate-100 text-slate-700 text-xs rounded-full px-2 py-0.5">
                                    Tipo: {question.type}
                                  </span>
                                </div>
                                
                                {question.mitigationActions && question.mitigationActions.length > 0 && (
                                  <div className="mt-3">
                                    <h5 className="text-sm font-medium mb-1">Ações de mitigação:</h5>
                                    <ul className="list-disc pl-5 space-y-1 text-sm">
                                      {question.mitigationActions.map((action, idx) => (
                                        <li key={idx}>{action}</li>
                                      ))}
                                    </ul>
                                  </div>
                                )}
                              </div>
                              <div className="flex gap-2">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => handleEditQuestion(section.id, question.id)}
                                  title="Editar pergunta"
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => handleDeleteQuestion(section.id, question.id)}
                                  title="Excluir pergunta"
                                >
                                  <Trash2 className="h-4 w-4 text-destructive" />
                                </Button>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </>
    );
  };

  return (
    <AdminLayout title="Gerenciar Modelos de Formulário">
      <div className="container mx-auto space-y-6">
        <Tabs 
          value={activeTab} 
          onValueChange={setActiveTab}
          className="w-full"
        >
          <TabsList className="grid grid-cols-3 w-[400px]">
            <TabsTrigger value="formularios">Formulários</TabsTrigger>
            <TabsTrigger value="secoes">Seções</TabsTrigger>
            <TabsTrigger value="perguntas">Perguntas</TabsTrigger>
          </TabsList>
          
          <TabsContent value="formularios" className="pt-4">
            {renderFormulariosTab()}
          </TabsContent>
          
          <TabsContent value="secoes" className="pt-4">
            {renderSecoesTab()}
          </TabsContent>
          
          <TabsContent value="perguntas" className="pt-4">
            {renderPerguntasTab()}
          </TabsContent>
        </Tabs>
      </div>

      {/* Modal para Adicionar Formulário */}
      <Dialog open={showAddFormDialog} onOpenChange={setShowAddFormDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Adicionar Novo Formulário</DialogTitle>
            <DialogDescription>
              Preencha os dados do novo modelo de formulário.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="formName">Nome do Formulário</Label>
              <Input
                id="formName"
                placeholder="Digite o nome do formulário"
                value={formName}
                onChange={(e) => setFormName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="formDescription">Descrição</Label>
              <Textarea
                id="formDescription"
                placeholder="Digite a descrição do formulário"
                value={formDescription}
                onChange={(e) => setFormDescription(e.target.value)}
                rows={4}
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddFormDialog(false)}>
              Cancelar
            </Button>
            <Button onClick={handleAddFormSubmit}>
              Salvar Formulário
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal para Editar Formulário */}
      <Dialog open={showEditFormDialog} onOpenChange={setShowEditFormDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Editar Formulário</DialogTitle>
            <DialogDescription>
              Altere os dados do formulário selecionado.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="editFormName">Nome do Formulário</Label>
              <Input
                id="editFormName"
                placeholder="Digite o nome do formulário"
                value={formName}
                onChange={(e) => setFormName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="editFormDescription">Descrição</Label>
              <Textarea
                id="editFormDescription"
                placeholder="Digite a descrição do formulário"
                value={formDescription}
                onChange={(e) => setFormDescription(e.target.value)}
                rows={4}
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEditFormDialog(false)}>
              Cancelar
            </Button>
            <Button onClick={handleUpdateFormSubmit}>
              Atualizar Formulário
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal para Adicionar Seção */}
      <Dialog open={showAddSectionDialog} onOpenChange={setShowAddSectionDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Adicionar Nova Seção</DialogTitle>
            <DialogDescription>
              Adicione uma nova seção ao formulário.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="sectionTitle">Título da Seção</Label>
              <Input
                id="sectionTitle"
                placeholder="Digite o título da seção"
                value={newSectionTitle}
                onChange={(e) => setNewSectionTitle(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="sectionDescription">Descrição</Label>
              <Textarea
                id="sectionDescription"
                placeholder="Digite a descrição da seção"
                value={newSectionDescription}
                onChange={(e) => setNewSectionDescription(e.target.value)}
                rows={4}
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddSectionDialog(false)}>
              Cancelar
            </Button>
            <Button onClick={handleAddSectionSubmit}>
              Adicionar Seção
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal para Editar Seção */}
      <Dialog open={showEditSectionDialog} onOpenChange={setShowEditSectionDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Editar Seção</DialogTitle>
            <DialogDescription>
              Altere os dados da seção selecionada.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="editSectionTitle">Título da Seção</Label>
              <Input
                id="editSectionTitle"
                placeholder="Digite o título da seção"
                value={newSectionTitle}
                onChange={(e) => setNewSectionTitle(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="editSectionDescription">Descrição</Label>
              <Textarea
                id="editSectionDescription"
                placeholder="Digite a descrição da seção"
                value={newSectionDescription}
                onChange={(e) => setNewSectionDescription(e.target.value)}
                rows={4}
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEditSectionDialog(false)}>
              Cancelar
            </Button>
            <Button onClick={handleUpdateSection}>
              Atualizar Seção
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal para Adicionar Pergunta */}
      <Dialog open={showAddQuestionDialog} onOpenChange={setShowAddQuestionDialog}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Adicionar Nova Pergunta</DialogTitle>
            <DialogDescription>
              Adicione uma nova pergunta à seção selecionada.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="questionRisk">Nome do Risco</Label>
              <Input
                id="questionRisk"
                placeholder="Ex: Pressão por Metas e Produtividade"
                value={newQuestionRisk}
                onChange={(e) => setNewQuestionRisk(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="questionText">Texto da Pergunta</Label>
              <Textarea
                id="questionText"
                placeholder="Ex: Você se sentiu frequentemente pressionado para cumprir prazos ou metas que considera difíceis ou impossíveis?"
                value={newQuestionText}
                onChange={(e) => setNewQuestionText(e.target.value)}
                rows={3}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="questionType">Tipo da Pergunta</Label>
                <Select value={newQuestionType} onValueChange={setNewQuestionType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="boolean">Sim/Não</SelectItem>
                    <SelectItem value="text">Texto</SelectItem>
                    <SelectItem value="number">Número</SelectItem>
                    <SelectItem value="select">Seleção</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="questionSeverity">Gravidade</Label>
                <Select value={newQuestionSeverity} onValueChange={(value: SeverityLevel) => setNewQuestionSeverity(value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione a gravidade" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="LEVEMENTE PREJUDICIAL">LEVEMENTE PREJUDICIAL</SelectItem>
                    <SelectItem value="PREJUDICIAL">PREJUDICIAL</SelectItem>
                    <SelectItem value="EXTREMAMENTE PREJUDICIAL">EXTREMAMENTE PREJUDICIAL</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="border rounded-md p-4 space-y-4">
              <Label>Ações de Mitigação</Label>
              <div className="flex gap-2">
                <Input
                  placeholder="Digite uma ação de mitigação"
                  value={newQuestionMitigation}
                  onChange={(e) => setNewQuestionMitigation(e.target.value)}
                />
                <Button type="button" onClick={handleAddMitigation} disabled={!newQuestionMitigation}>
                  Adicionar
                </Button>
              </div>
              {newQuestionMitigationList.length > 0 && (
                <div>
                  <p className="text-sm font-medium mb-2">Ações adicionadas:</p>
                  <ul className="space-y-2">
                    {newQuestionMitigationList.map((action, index) => (
                      <li 
                        key={index} 
                        className="flex justify-between items-center p-2 rounded bg-slate-50"
                      >
                        <span className="text-sm">{action}</span>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => handleRemoveMitigation(index)}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddQuestionDialog(false)}>
              Cancelar
            </Button>
            <Button onClick={handleAddQuestionSubmit}>
              Adicionar Pergunta
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal para Editar Pergunta */}
      <Dialog open={showEditQuestionDialog} onOpenChange={setShowEditQuestionDialog}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Editar Pergunta</DialogTitle>
            <DialogDescription>
              Altere os dados da pergunta selecionada.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="editQuestionRisk">Nome do Risco</Label>
              <Input
                id="editQuestionRisk"
                placeholder="Ex: Pressão por Metas e Produtividade"
                value={newQuestionRisk}
                onChange={(e) => setNewQuestionRisk(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="editQuestionText">Texto da Pergunta</Label>
              <Textarea
                id="editQuestionText"
                placeholder="Ex: Você se sentiu frequentemente pressionado para cumprir prazos ou metas que considera difíceis ou impossíveis?"
                value={newQuestionText}
                onChange={(e) => setNewQuestionText(e.target.value)}
                rows={3}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="editQuestionType">Tipo da Pergunta</Label>
                <Select value={newQuestionType} onValueChange={setNewQuestionType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="boolean">Sim/Não</SelectItem>
                    <SelectItem value="text">Texto</SelectItem>
                    <SelectItem value="number">Número</SelectItem>
                    <SelectItem value="select">Seleção</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="editQuestionSeverity">Gravidade</Label>
                <Select value={newQuestionSeverity} onValueChange={(value: SeverityLevel) => setNewQuestionSeverity(value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione a gravidade" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="LEVEMENTE PREJUDICIAL">LEVEMENTE PREJUDICIAL</SelectItem>
                    <SelectItem value="PREJUDICIAL">PREJUDICIAL</SelectItem>
                    <SelectItem value="EXTREMAMENTE PREJUDICIAL">EXTREMAMENTE PREJUDICIAL</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="border rounded-md p-4 space-y-4">
              <Label>Ações de Mitigação</Label>
              <div className="flex gap-2">
                <Input
                  placeholder="Digite uma ação de mitigação"
                  value={newQuestionMitigation}
                  onChange={(e) => setNewQuestionMitigation(e.target.value)}
                />
                <Button type="button" onClick={handleAddMitigation} disabled={!newQuestionMitigation}>
                  Adicionar
                </Button>
              </div>
              {newQuestionMitigationList.length > 0 && (
                <div>
                  <p className="text-sm font-medium mb-2">Ações adicionadas:</p>
                  <ul className="space-y-2">
                    {newQuestionMitigationList.map((action, index) => (
                      <li 
                        key={index} 
                        className="flex justify-between items-center p-2 rounded bg-slate-50"
                      >
                        <span className="text-sm">{action}</span>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => handleRemoveMitigation(index)}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEditQuestionDialog(false)}>
              Cancelar
            </Button>
            <Button onClick={handleUpdateQuestion}>
              Atualizar Pergunta
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
};

// Helper function to get severity color
function getSeverityColor(severity: string): string {
  switch (severity) {
    case "LEVEMENTE PREJUDICIAL":
      return "#FFD700"; // amarelo
    case "PREJUDICIAL":
      return "#FF8C00"; // laranja
    case "EXTREMAMENTE PREJUDICIAL":
      return "#FF4500"; // vermelho
    default:
      return "#CCCCCC";
  }
}

export default FormulariosPage;
