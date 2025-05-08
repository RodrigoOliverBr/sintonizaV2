
import React, { useState, useEffect } from "react";
import Layout from "@/components/Layout";
import FormSection from "@/components/FormSection";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { FormData, FormResult, FormAnswer } from "@/types/form";
import { formData as defaultFormData } from "@/data/formData";
import { getFormResultByEmployeeId, saveFormResult } from "@/services/storageService";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { SelectValue, SelectTrigger, SelectItem, SelectContent, Select } from "@/components/ui/select";
import { getFormTemplateById, getFormTemplates, getDefaultFormTemplate } from "@/services/formTemplateService";
import { FormTemplate } from "@/types/admin";

const getClienteData = () => {
  const clienteStr = localStorage.getItem("sintonia:currentCliente");
  return clienteStr ? JSON.parse(clienteStr) : null;
};

const FormularioPage = () => {
  const [currentSection, setCurrentSection] = useState(0);
  const [answers, setAnswers] = useState<Record<number, FormAnswer>>({});
  const [formTemplates, setFormTemplates] = useState<FormTemplate[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<FormTemplate | null>(null);
  const [formData, setFormData] = useState<FormData>(defaultFormData);
  const { toast } = useToast();
  const navigate = useNavigate();
  
  // Carregar formulários e resultados salvos
  useEffect(() => {
    loadFormTemplates();
  }, []);
  
  const loadFormTemplates = () => {
    try {
      const clienteData = getClienteData();
      let availableTemplates: FormTemplate[] = [];
      
      if (clienteData && clienteData.formulariosIds && clienteData.formulariosIds.length > 0) {
        // Carregar formulários disponíveis para o cliente
        availableTemplates = getFormTemplates().filter(
          template => clienteData.formulariosIds.includes(template.id) && template.ativo
        );
      } else {
        // Se não tiver formulários associados, usar apenas o padrão
        const defaultTemplate = getDefaultFormTemplate();
        availableTemplates = [defaultTemplate];
      }
      
      setFormTemplates(availableTemplates);
      
      if (availableTemplates.length > 0) {
        // Por padrão, selecionar o primeiro formulário disponível
        handleSelectTemplate(availableTemplates[0].id);
      }
    } catch (error) {
      console.error("Erro ao carregar formulários:", error);
      toast({
        title: "Erro ao carregar formulários",
        description: "Não foi possível carregar os formulários disponíveis.",
        variant: "destructive",
      });
    }
  };
  
  const handleSelectTemplate = (templateId: string) => {
    try {
      const template = getFormTemplateById(templateId);
      if (!template) {
        toast({
          title: "Formulário não encontrado",
          description: "O formulário selecionado não está disponível.",
          variant: "destructive",
        });
        return;
      }
      
      setSelectedTemplate(template);
      
      // Atualizar dados do formulário
      setFormData({
        sections: template.secoes
      });
      
      // Resetar navegação para a primeira seção
      setCurrentSection(0);
      
      // Carregar respostas salvas para este formulário, se houver
      const employeeId = localStorage.getItem("currentEmployeeId");
      if (employeeId) {
        const savedResult = getFormResultByEmployeeId(employeeId, template.id);
        if (savedResult) {
          setAnswers(savedResult.answers);
        } else {
          // Se não houver resultados salvos para este formulário, limpar as respostas
          setAnswers({});
        }
      }
    } catch (error) {
      console.error("Erro ao selecionar formulário:", error);
      toast({
        title: "Erro ao carregar formulário",
        description: "Não foi possível carregar o formulário selecionado.",
        variant: "destructive",
      });
    }
  };

  const handleAnswerChange = (questionId: number, value: boolean | null) => {
    setAnswers({
      ...answers,
      [questionId]: { 
        questionId,
        answer: value, 
        observation: answers[questionId]?.observation || "",
        selectedOptions: answers[questionId]?.selectedOptions || []
      },
    });
  };

  const handleObservationChange = (questionId: number, observation: string) => {
    setAnswers({
      ...answers,
      [questionId]: { 
        ...answers[questionId],
        questionId,
        observation 
      },
    });
  };

  const handleOptionsChange = (questionId: number, options: string[]) => {
    setAnswers({
      ...answers,
      [questionId]: { 
        ...answers[questionId],
        questionId,
        selectedOptions: options 
      },
    });
  };

  const handleNext = () => {
    if (currentSection < formData.sections.length - 1) {
      setCurrentSection(currentSection + 1);
    } else {
      handleFinish();
    }
  };

  const handleBack = () => {
    if (currentSection > 0) {
      setCurrentSection(currentSection - 1);
    }
  };

  const handleFinish = () => {
    try {
      if (!selectedTemplate) {
        toast({
          title: "Formulário não selecionado",
          description: "Selecione um formulário para continuar.",
          variant: "destructive",
        });
        return;
      }

      const allQuestions = formData.sections.flatMap((section) => section.questions);

      // Verificar se todas as perguntas foram respondidas
      const unansweredQuestions = allQuestions.filter(
        (q) => answers[q.id]?.answer === null || answers[q.id]?.answer === undefined
      );

      if (unansweredQuestions.length > 0) {
        toast({
          title: "Formulário incompleto",
          description: `Faltam ${unansweredQuestions.length} perguntas a serem respondidas.`,
          variant: "destructive",
        });
        return;
      }

      const totalYes = Object.values(answers).filter((a) => a.answer === true).length;
      const totalNo = Object.values(answers).filter((a) => a.answer === false).length;

      // Contagem por severidade
      const severityCounts: Record<string, number> = {};
      const yesPerSeverity: Record<string, number> = {};

      // Inicializar contagens
      allQuestions.forEach((q) => {
        if (!severityCounts[q.severity]) {
          severityCounts[q.severity] = 0;
          yesPerSeverity[q.severity] = 0;
        }
      });

      // Contar respostas "sim" para cada nível de severidade
      allQuestions.forEach((q) => {
        severityCounts[q.severity]++;
        if (answers[q.id]?.answer === true) {
          yesPerSeverity[q.severity]++;
        }
      });

      // Criar resultado para salvar
      const result: FormResult = {
        answers,
        totalYes,
        totalNo,
        severityCounts,
        yesPerSeverity,
        analyistNotes: "",
      };

      // Salvar o resultado no localStorage
      const employeeId = localStorage.getItem("currentEmployeeId");
      if (employeeId) {
        saveFormResult(employeeId, result, selectedTemplate.id);
        
        toast({
          title: "Formulário enviado com sucesso!",
          description: "Suas respostas foram salvas.",
        });
        
        navigate("/relatorios");
      } else {
        toast({
          title: "Erro ao salvar respostas",
          description: "Selecione um funcionário antes de continuar.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Erro ao finalizar formulário:", error);
      toast({
        title: "Erro ao finalizar formulário",
        description: "Não foi possível processar suas respostas.",
        variant: "destructive",
      });
    }
  };

  const currentSectionData = formData.sections[currentSection];
  const progress = ((currentSection + 1) / formData.sections.length) * 100;

  return (
    <Layout>
      <div className="container mx-auto p-4 max-w-4xl">
        <h1 className="text-2xl font-bold mb-6">Formulário de Avaliação de Riscos Psicossociais</h1>
        
        {/* Seletor de formulário */}
        {formTemplates.length > 1 && (
          <Card className="p-4 mb-6">
            <label className="block text-sm font-medium mb-2">Selecione o formulário:</label>
            <Select
              value={selectedTemplate?.id}
              onValueChange={handleSelectTemplate}
            >
              <SelectTrigger className="w-full md:w-1/2">
                <SelectValue placeholder="Selecione um formulário" />
              </SelectTrigger>
              <SelectContent>
                {formTemplates.map((template) => (
                  <SelectItem key={template.id} value={template.id}>
                    {template.nome}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {selectedTemplate && (
              <p className="mt-2 text-sm text-muted-foreground">{selectedTemplate.descricao}</p>
            )}
          </Card>
        )}
        
        {selectedTemplate && (
          <>
            <div className="bg-muted h-2 w-full rounded-full mb-6">
              <div
                className="bg-primary h-2 rounded-full transition-all"
                style={{ width: `${progress}%` }}
              ></div>
              <div className="text-xs text-center mt-1">
                Seção {currentSection + 1} de {formData.sections.length}
              </div>
            </div>

            <FormSection
              section={currentSectionData}
              answers={answers}
              onAnswerChange={handleAnswerChange}
              onObservationChange={handleObservationChange}
              onOptionsChange={handleOptionsChange}
            />

            <div className="mt-8 flex justify-between">
              <Button
                variant="outline"
                onClick={handleBack}
                disabled={currentSection === 0}
              >
                Voltar
              </Button>
              <Button onClick={handleNext}>
                {currentSection < formData.sections.length - 1 ? "Próximo" : "Finalizar"}
              </Button>
            </div>
          </>
        )}
      </div>
    </Layout>
  );
};

export default FormularioPage;
