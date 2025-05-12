
import React, { useState, useEffect } from "react";
import AdminLayout from "@/components/AdminLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Trash2, GripVertical, Copy, ChevronsUpDown } from "lucide-react";
import {
  getFormTemplates,
  updateFormTemplate,
  deleteFormTemplate,
  addFormTemplate,
  addSection,
  updateSection,
  deleteSection,
  addQuestion
} from "@/services/formTemplateService";
import { FormSection, Question } from "@/types/form";
import { FormTemplate } from "@/types/admin";
import { toast } from "sonner";
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";

const FormulariosPage = () => {
  const [formTemplates, setFormTemplates] = useState<FormTemplate[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<FormTemplate | null>(null);
  const [isEditingTemplate, setIsEditingTemplate] = useState(false);
  const [formName, setFormName] = useState("");
  const [formDescription, setFormDescription] = useState("");
  const [isAddingSection, setIsAddingSection] = useState(false);
  const [newSectionTitle, setNewSectionTitle] = useState("");
  const [newSectionDescription, setNewSectionDescription] = useState("");
  const [isAddingQuestion, setIsAddingQuestion] = useState(false);
  const [newQuestionText, setNewQuestionText] = useState("");
  const [newQuestionType, setNewQuestionType] = useState("text");
  const [editingSectionId, setEditingSectionId] = useState<string | null>(null);
  const [editingQuestionId, setEditingQuestionId] = useState<string | null>(null);

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
    setIsEditingTemplate(true);
  };

  const handleAddFormTemplate = () => {
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
    setFormName("");
    setFormDescription("");
    toast.success("Formulário criado com sucesso!");
  };

  const handleUpdateFormTemplate = () => {
    if (!selectedTemplate) return;

    const updatedTemplate = {
      ...selectedTemplate,
      nome: formName,
      descricao: formDescription,
      ultimaAtualizacao: Date.now(),
    };

    updateFormTemplate(updatedTemplate);
    loadFormTemplates();
    setSelectedTemplate(updatedTemplate);
    toast.success("Formulário atualizado com sucesso!");
  };

  const handleDeleteFormTemplate = () => {
    if (!selectedTemplate) return;

    deleteFormTemplate(selectedTemplate.id);
    loadFormTemplates();
    setSelectedTemplate(null);
    setIsEditingTemplate(false);
    toast.success("Formulário excluído com sucesso!");
  };

  const handleAddSectionToTemplate = () => {
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
    setNewSectionTitle("");
    setNewSectionDescription("");
    setIsAddingSection(false);
    toast.success("Seção adicionada com sucesso!");
  };

  const handleUpdateSection = (sectionId: string, updatedSection: Partial<FormSection>) => {
    if (!selectedTemplate) return;

    const sectionToUpdate = selectedTemplate.secoes.find(section => section.id === sectionId);
    if (!sectionToUpdate) return;

    const updatedSectionData = { ...sectionToUpdate, ...updatedSection };
    updateSection(selectedTemplate.id, updatedSectionData);
    loadFormTemplates();
    toast.success("Seção atualizada com sucesso!");
  };

  const handleDeleteSection = (sectionId: string) => {
    if (!selectedTemplate) return;

    deleteSection(selectedTemplate.id, sectionId);
    loadFormTemplates();
    toast.success("Seção excluída com sucesso!");
  };

  const handleAddQuestionToSection = (sectionId: string) => {
    if (!selectedTemplate) return;
    if (!newQuestionText || !newQuestionType) {
      toast.error("Texto e tipo da pergunta são obrigatórios.");
      return;
    }

    // First create the question
    const newQuestion = addQuestion(sectionId, { 
      text: newQuestionText, 
      type: newQuestionType 
    });
    
    // Then add it to the section
    const section = selectedTemplate.secoes.find(sec => sec.id === sectionId);
    if (section) {
      // Create a safe copy of questions with proper type
      const updatedQuestions: Question[] = [...section.questions, newQuestion];
      
      // Update the section with the new question
      handleUpdateSection(sectionId, { questions: updatedQuestions });
    }
    
    setNewQuestionText("");
    setNewQuestionType("text");
    setIsAddingQuestion(false);
    toast.success("Pergunta adicionada com sucesso!");
  };

  const handleUpdateQuestion = (sectionId: string, questionId: number, updatedQuestion: Partial<Question>) => {
    if (!selectedTemplate) return;

    const section = selectedTemplate.secoes.find(sec => sec.id === sectionId);
    if (!section) return;

    const questionToUpdate = section.questions.find(q => q.id === questionId);
    if (!questionToUpdate) return;

    // Create a proper updated question object
    const updatedQuestionData: Question = { 
      ...questionToUpdate, 
      ...updatedQuestion 
    };
    
    // Create a new questions array for the section
    const updatedQuestions = section.questions.map(q => 
      q.id === questionId ? updatedQuestionData : q
    );
    
    // Update the section with the new questions array
    handleUpdateSection(sectionId, { questions: updatedQuestions });
    toast.success("Pergunta atualizada com sucesso!");
  };

  const handleDeleteQuestion = (sectionId: string, questionId: number) => {
    if (!selectedTemplate) return;

    const section = selectedTemplate.secoes.find(sec => sec.id === sectionId);
    if (!section) return;

    // Filter out the question to be deleted
    const updatedQuestions = section.questions.filter(q => q.id !== questionId);
    
    // Update the section with the new questions
    handleUpdateSection(sectionId, { questions: updatedQuestions });
    toast.success("Pergunta excluída com sucesso!");
  };

  const handleOnDragEnd = (result: any) => {
    if (!selectedTemplate) return;
    if (!result.destination) return;

    const { source, destination } = result;

    if (source.droppableId !== destination.droppableId) {
      // Reorder questions within different sections
      const sourceSection = selectedTemplate.secoes.find(sec => sec.id === source.droppableId);
      const destSection = selectedTemplate.secoes.find(sec => sec.id === destination.droppableId);

      if (!sourceSection || !destSection) return;

      const sourceQuestions: Question[] = Array.from(sourceSection.questions);
      const destQuestions: Question[] = Array.from(destSection.questions);
      const [removed] = sourceQuestions.splice(source.index, 1);

      destQuestions.splice(destination.index, 0, removed);

      handleUpdateSection(source.droppableId, { questions: sourceQuestions });
      handleUpdateSection(destination.droppableId, { questions: destQuestions });
    } else {
      // Reorder questions within same section
      const section = selectedTemplate.secoes.find(sec => sec.id === source.droppableId);
      if (!section) return;
      
      const questions: Question[] = Array.from(section.questions);
      const [removed] = questions.splice(source.index, 1);
      questions.splice(destination.index, 0, removed);

      handleUpdateSection(source.droppableId, { questions });
    }
  };

  return (
    <AdminLayout title="Gerenciar Modelos de Formulário">
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="text-xl font-bold">Modelos de Formulário</CardTitle>
          <CardDescription>
            Visualize e gerencie os modelos de formulário disponíveis no sistema
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Lista de Formulários */}
            <div className="md:col-span-1">
              <h3 className="text-lg font-semibold mb-2">Lista de Formulários</h3>
              <ul>
                {formTemplates.map((template) => (
                  <li key={template.id} className="py-2 border-b last:border-none">
                    <button
                      className="w-full text-left hover:bg-gray-100 py-2 px-4 rounded"
                      onClick={() => handleTemplateSelect(template)}
                    >
                      {template.nome}
                    </button>
                  </li>
                ))}
              </ul>
              <Button onClick={() => setIsEditingTemplate(true)}>Adicionar Formulário</Button>
            </div>

            {/* Detalhes do Formulário e Seções */}
            <div className="md:col-span-2">
              {selectedTemplate ? (
                <>
                  <h3 className="text-lg font-semibold mb-2">Detalhes do Formulário</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Nome do Formulário</label>
                      <Input
                        type="text"
                        value={formName}
                        onChange={(e) => setFormName(e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Descrição do Formulário</label>
                      <Textarea
                        value={formDescription}
                        onChange={(e) => setFormDescription(e.target.value)}
                      />
                    </div>
                    <div className="flex gap-2">
                      <Button onClick={handleUpdateFormTemplate} disabled={!isEditingTemplate}>
                        Atualizar Formulário
                      </Button>
                      <Button
                        variant="destructive"
                        onClick={handleDeleteFormTemplate}
                        disabled={!isEditingTemplate}
                      >
                        Excluir Formulário
                      </Button>
                    </div>

                    {/* Seções do Formulário */}
                    <h4 className="text-md font-semibold mt-4">Seções do Formulário</h4>
                    <DragDropContext onDragEnd={handleOnDragEnd}>
                      <Accordion type="multiple">
                        {selectedTemplate.secoes.map((section, index) => (
                          <AccordionItem value={section.id} key={section.id}>
                            <AccordionTrigger>
                              <div className="flex items-center justify-between w-full">
                                <div className="flex items-center">
                                  <GripVertical className="mr-2 h-4 w-4 cursor-grab" />
                                  {section.title}
                                </div>
                                <ChevronsUpDown className="h-4 w-4" />
                              </div>
                            </AccordionTrigger>
                            <AccordionContent>
                              <div className="space-y-2">
                                <p className="text-sm text-gray-500">{section.description}</p>
                                <div className="flex gap-2">
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => {
                                      setEditingSectionId(section.id);
                                      setNewSectionTitle(section.title);
                                      setNewSectionDescription(section.description || "");
                                    }}
                                  >
                                    Editar Seção
                                  </Button>
                                  <Button
                                    variant="destructive"
                                    size="sm"
                                    onClick={() => handleDeleteSection(section.id)}
                                  >
                                    Excluir Seção
                                  </Button>
                                </div>

                                {/* Perguntas da Seção */}
                                <h5 className="text-sm font-semibold mt-2">Perguntas da Seção</h5>
                                <Droppable droppableId={section.id} type="QUESTION">
                                  {(provided) => (
                                    <ul
                                      {...provided.droppableProps}
                                      ref={provided.innerRef}
                                      className="space-y-2"
                                    >
                                      {section.questions.map((question, questionIndex) => (
                                        <Draggable
                                          key={question.id}
                                          draggableId={String(question.id)}
                                          index={questionIndex}
                                        >
                                          {(provided) => (
                                            <li
                                              ref={provided.innerRef}
                                              {...provided.draggableProps}
                                              {...provided.dragHandleProps}
                                              className="bg-gray-50 p-2 rounded flex items-center justify-between"
                                            >
                                              <div className="flex items-center">
                                                <GripVertical className="mr-2 h-4 w-4 cursor-grab" />
                                                {question.text} ({question.type})
                                              </div>
                                              <div>
                                                <Button
                                                  variant="outline"
                                                  size="icon"
                                                  onClick={() => {
                                                    setEditingQuestionId(String(question.id));
                                                    setNewQuestionText(question.text);
                                                    setNewQuestionType(question.type);
                                                  }}
                                                >
                                                  <Copy className="h-4 w-4" />
                                                </Button>
                                                <Button
                                                  variant="destructive"
                                                  size="icon"
                                                  onClick={() => handleDeleteQuestion(section.id, question.id)}
                                                >
                                                  <Trash2 className="h-4 w-4" />
                                                </Button>
                                              </div>
                                            </li>
                                          )}
                                        </Draggable>
                                      ))}
                                      {provided.placeholder}
                                    </ul>
                                  )}
                                </Droppable>
                                <Button
                                  variant="secondary"
                                  size="sm"
                                  onClick={() => setIsAddingQuestion(true)}
                                >
                                  Adicionar Pergunta
                                </Button>
                              </div>
                            </AccordionContent>
                          </AccordionItem>
                        ))}
                      </Accordion>
                    </DragDropContext>
                    <Button onClick={() => setIsAddingSection(true)}>Adicionar Seção</Button>
                  </div>
                </>
              ) : (
                <p>Selecione um formulário para visualizar os detalhes.</p>
              )}
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <p className="text-sm text-gray-500">Total de formulários: {formTemplates.length}</p>
        </CardFooter>
      </Card>

      {/* Modal para Adicionar Seção */}
      {isAddingSection && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-md">
            <h4 className="text-lg font-semibold mb-4">Adicionar Nova Seção</h4>
            <div>
              <label className="block text-sm font-medium text-gray-700">Título da Seção</label>
              <Input
                type="text"
                value={newSectionTitle}
                onChange={(e) => setNewSectionTitle(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Descrição da Seção</label>
              <Textarea
                value={newSectionDescription}
                onChange={(e) => setNewSectionDescription(e.target.value)}
              />
            </div>
            <div className="flex justify-end gap-2 mt-4">
              <Button variant="ghost" onClick={() => setIsAddingSection(false)}>
                Cancelar
              </Button>
              <Button onClick={handleAddSectionToTemplate}>Adicionar Seção</Button>
            </div>
          </div>
        </div>
      )}

      {/* Modal para Adicionar Pergunta */}
      {isAddingQuestion && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-md">
            <h4 className="text-lg font-semibold mb-4">Adicionar Nova Pergunta</h4>
            <div>
              <label className="block text-sm font-medium text-gray-700">Texto da Pergunta</label>
              <Input
                type="text"
                value={newQuestionText}
                onChange={(e) => setNewQuestionText(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Tipo da Pergunta</label>
              <Select value={newQuestionType} onValueChange={(value) => setNewQuestionType(value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="text">Texto</SelectItem>
                  <SelectItem value="number">Número</SelectItem>
                  <SelectItem value="date">Data</SelectItem>
                  <SelectItem value="select">Seleção</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex justify-end gap-2 mt-4">
              <Button variant="ghost" onClick={() => setIsAddingQuestion(false)}>
                Cancelar
              </Button>
              <Button onClick={() => {
                if (selectedTemplate && selectedTemplate.secoes.length > 0) {
                  handleAddQuestionToSection(selectedTemplate.secoes[0].id);
                } else {
                  toast.error("Adicione uma seção antes de adicionar uma pergunta.");
                }
              }}>Adicionar Pergunta</Button>
            </div>
          </div>
        </div>
      )}

      {/* Modal para Editar Seção */}
      {editingSectionId && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-md">
            <h4 className="text-lg font-semibold mb-4">Editar Seção</h4>
            <div>
              <label className="block text-sm font-medium text-gray-700">Título da Seção</label>
              <Input
                type="text"
                value={newSectionTitle}
                onChange={(e) => setNewSectionTitle(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Descrição da Seção</label>
              <Textarea
                value={newSectionDescription}
                onChange={(e) => setNewSectionDescription(e.target.value)}
              />
            </div>
            <div className="flex justify-end gap-2 mt-4">
              <Button variant="ghost" onClick={() => setEditingSectionId(null)}>
                Cancelar
              </Button>
              <Button onClick={() => {
                handleUpdateSection(editingSectionId, { title: newSectionTitle, description: newSectionDescription });
                setEditingSectionId(null);
              }}>Atualizar Seção</Button>
            </div>
          </div>
        </div>
      )}

      {/* Modal para Editar Pergunta */}
      {editingQuestionId && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-md">
            <h4 className="text-lg font-semibold mb-4">Editar Pergunta</h4>
            <div>
              <label className="block text-sm font-medium text-gray-700">Texto da Pergunta</label>
              <Input
                type="text"
                value={newQuestionText}
                onChange={(e) => setNewQuestionText(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Tipo da Pergunta</label>
              <Select value={newQuestionType} onValueChange={(value) => setNewQuestionType(value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="text">Texto</SelectItem>
                  <SelectItem value="number">Número</SelectItem>
                  <SelectItem value="date">Data</SelectItem>
                  <SelectItem value="select">Seleção</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex justify-end gap-2 mt-4">
              <Button variant="ghost" onClick={() => setEditingQuestionId(null)}>
                Cancelar
              </Button>
              <Button onClick={() => {
                if (selectedTemplate) {
                  const section = selectedTemplate.secoes.find(sec => 
                    sec.questions.find(q => String(q.id) === editingQuestionId)
                  );
                  if (section) {
                    handleUpdateQuestion(
                      section.id, 
                      parseInt(editingQuestionId), 
                      { text: newQuestionText, type: newQuestionType }
                    );
                  }
                }
                setEditingQuestionId(null);
              }}>Atualizar Pergunta</Button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default FormulariosPage;
