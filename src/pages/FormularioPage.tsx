
import React, { useState, useEffect } from "react";
import Layout from "@/components/Layout";
import FormSection from "@/components/FormSection";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { FormData, FormResult, FormAnswer } from "@/types/form";
import { formData as defaultFormData } from "@/data/formData";
import { 
  getFormResultByEmployeeId, 
  saveFormResult,
  getEmployees,
  getCompanies,
  getEmployeesByCompany,
  getFormStatusByEmployeeId
} from "@/services/storageService";
import { Employee, Company } from "@/types/cadastro";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { SelectValue, SelectTrigger, SelectItem, SelectContent, Select } from "@/components/ui/select";
import { getFormTemplateById, getFormTemplates, getDefaultFormTemplate } from "@/services/formTemplateService";
import { FormTemplate } from "@/types/admin";
import { X, Check, CheckSquare, FileText, Edit } from "lucide-react";
import FormResultSummary from "@/components/FormResultSummary";

const FormularioPage = () => {
  // Estados para empresa, funcionário e formulário
  const [companies, setCompanies] = useState<Company[]>([]);
  const [selectedCompanyId, setSelectedCompanyId] = useState<string>("");
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<string>("");
  
  // Estados para o formulário
  const [formTemplates, setFormTemplates] = useState<FormTemplate[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<FormTemplate | null>(null);
  const [formData, setFormData] = useState<FormData>(defaultFormData);
  const [answers, setAnswers] = useState<Record<number, FormAnswer>>({});
  const [showForm, setShowForm] = useState<boolean>(false);
  const [showResults, setShowResults] = useState<boolean>(false);
  const [formStatus, setFormStatus] = useState<'not-started' | 'in-progress' | 'completed'>('not-started');
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  
  const { toast } = useToast();
  const navigate = useNavigate();
  
  // Carregar empresas ao iniciar
  useEffect(() => {
    loadCompanies();
    loadFormTemplates();
  }, []);
  
  // Carregar funcionários quando uma empresa for selecionada
  useEffect(() => {
    if (selectedCompanyId) {
      loadEmployees(selectedCompanyId);
    }
  }, [selectedCompanyId]);
  
  // Carregar respostas quando funcionário for selecionado
  useEffect(() => {
    if (selectedEmployeeId && selectedTemplate) {
      loadEmployeeAnswers(selectedEmployeeId, selectedTemplate.id);
      const foundEmployee = employees.find(e => e.id === selectedEmployeeId);
      setSelectedEmployee(foundEmployee || null);
      
      const status = getFormStatusByEmployeeId(selectedEmployeeId, selectedTemplate.id);
      setFormStatus(status);
    }
  }, [selectedEmployeeId, selectedTemplate]);

  const loadCompanies = () => {
    try {
      const loadedCompanies = getCompanies();
      setCompanies(loadedCompanies || []);
    } catch (error) {
      console.error("Erro ao carregar empresas:", error);
      toast({
        title: "Erro ao carregar empresas",
        description: "Não foi possível carregar a lista de empresas.",
        variant: "destructive",
      });
    }
  };

  const loadEmployees = (companyId: string) => {
    try {
      const loadedEmployees = getEmployeesByCompany(companyId);
      setEmployees(loadedEmployees || []);
      setSelectedEmployeeId(""); // Resetar seleção de funcionário ao mudar empresa
    } catch (error) {
      console.error("Erro ao carregar funcionários:", error);
      toast({
        title: "Erro ao carregar funcionários",
        description: "Não foi possível carregar a lista de funcionários.",
        variant: "destructive",
      });
    }
  };

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

  const loadEmployeeAnswers = (employeeId: string, templateId: string) => {
    try {
      const savedResult = getFormResultByEmployeeId(employeeId, templateId);
      if (savedResult) {
        setAnswers(savedResult.answers);
      } else {
        // Se não houver resultados salvos, limpar as respostas
        setAnswers({});
      }
    } catch (error) {
      console.error("Erro ao carregar respostas:", error);
    }
  };
  
  const getClienteData = () => {
    const clienteStr = localStorage.getItem("sintonia:currentCliente");
    return clienteStr ? JSON.parse(clienteStr) : null;
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
      
      // Se já tiver um funcionário selecionado, carregar suas respostas
      if (selectedEmployeeId) {
        loadEmployeeAnswers(selectedEmployeeId, template.id);
        const status = getFormStatusByEmployeeId(selectedEmployeeId, template.id);
        setFormStatus(status);
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

  const handleCompanyChange = (companyId: string) => {
    setSelectedCompanyId(companyId);
  };

  const handleEmployeeChange = (employeeId: string) => {
    setSelectedEmployeeId(employeeId);
    
    // Armazenar o ID do funcionário no localStorage para uso em outras páginas
    localStorage.setItem("currentEmployeeId", employeeId);
    
    // Se já tiver um template selecionado, carregar as respostas do funcionário
    if (selectedTemplate) {
      loadEmployeeAnswers(employeeId, selectedTemplate.id);
      const status = getFormStatusByEmployeeId(employeeId, selectedTemplate.id);
      setFormStatus(status);
    }
    
    // Reset view states
    setShowForm(false);
    setShowResults(false);
  };

  const handleStartForm = () => {
    if (!selectedEmployeeId) {
      toast({
        title: "Selecione um funcionário",
        description: "É necessário selecionar um funcionário antes de iniciar o formulário.",
        variant: "destructive",
      });
      return;
    }
    
    if (!selectedTemplate) {
      toast({
        title: "Formulário não selecionado",
        description: "É necessário selecionar um formulário para continuar.",
        variant: "destructive",
      });
      return;
    }
    
    setShowForm(true);
    setShowResults(false);
  };
  
  const handleViewResults = () => {
    if (!selectedEmployeeId || !selectedTemplate) {
      toast({
        title: "Selecione um funcionário e um formulário",
        description: "É necessário selecionar um funcionário e um formulário para visualizar os resultados.",
        variant: "destructive",
      });
      return;
    }
    
    setShowForm(false);
    setShowResults(true);
  };
  
  const handleNewForm = () => {
    setShowForm(false);
    setShowResults(false);
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

  const handleMarkAllAsNo = () => {
    const allQuestions = formData.sections.flatMap(section => section.questions);
    const newAnswers: Record<number, FormAnswer> = {};
    
    allQuestions.forEach(question => {
      newAnswers[question.id] = {
        questionId: question.id,
        answer: false,
        observation: answers[question.id]?.observation || "",
        selectedOptions: []
      };
    });
    
    setAnswers(newAnswers);
    
    toast({
      title: "Todas as respostas definidas como 'Não'",
      description: "Todas as perguntas foram marcadas com 'Não'.",
    });
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

      // Count answered questions
      const answeredQuestions = Object.values(answers).filter(
        (a) => a.answer === true || a.answer === false
      );

      // Check if there are unanswered questions
      if (answeredQuestions.length < allQuestions.length) {
        toast({
          title: "Formulário incompleto",
          description: `Faltam ${allQuestions.length - answeredQuestions.length} perguntas a serem respondidas.`,
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
      if (selectedEmployeeId && selectedTemplate) {
        saveFormResult(selectedEmployeeId, result, selectedTemplate.id);
        
        toast({
          title: "Formulário enviado com sucesso!",
          description: "Suas respostas foram salvas.",
        });
        
        // Atualizar status do formulário
        setFormStatus('completed');
        
        // Mostrar resultados
        setShowForm(false);
        setShowResults(true);
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
  
  const getStatusComponent = () => {
    switch (formStatus) {
      case 'not-started':
        return <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-gray-100 text-gray-800">Não iniciado</span>;
      case 'in-progress':
        return <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-yellow-100 text-yellow-800">Em progresso</span>;
      case 'completed':
        return <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-green-100 text-green-800">Completo</span>;
      default:
        return null;
    }
  };

  return (
    <Layout>
      <div className="container mx-auto p-4 max-w-4xl">
        <h1 className="text-2xl font-bold mb-6">Formulário de Avaliação de Riscos Psicossociais</h1>
        
        {/* Seleção de empresa e funcionário */}
        {!showForm && !showResults && (
          <Card className="mb-6">
            <CardContent className="pt-6">
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium mb-2">Empresa:</label>
                  <Select
                    value={selectedCompanyId}
                    onValueChange={handleCompanyChange}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Selecione uma empresa" />
                    </SelectTrigger>
                    <SelectContent>
                      {companies.map((company) => (
                        <SelectItem key={company.id} value={company.id}>
                          {company.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                {selectedCompanyId && (
                  <div>
                    <label className="block text-sm font-medium mb-2">Funcionário:</label>
                    <Select
                      value={selectedEmployeeId}
                      onValueChange={handleEmployeeChange}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Selecione um funcionário" />
                      </SelectTrigger>
                      <SelectContent>
                        {employees.map((employee) => (
                          <SelectItem key={employee.id} value={employee.id}>
                            {employee.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}
                
                {/* Seletor de formulário */}
                {formTemplates.length > 1 && (
                  <div>
                    <label className="block text-sm font-medium mb-2">Formulário:</label>
                    <Select
                      value={selectedTemplate?.id}
                      onValueChange={handleSelectTemplate}
                    >
                      <SelectTrigger className="w-full">
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
                  </div>
                )}
                
                {selectedEmployeeId && selectedTemplate && (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-500">Status:</span>
                      {getStatusComponent()}
                    </div>
                    
                    <div className="flex gap-2">
                      {formStatus === 'completed' && (
                        <Button 
                          onClick={handleViewResults} 
                          variant="outline" 
                          className="flex items-center gap-2"
                        >
                          <FileText className="h-4 w-4" />
                          Ver Resultados
                        </Button>
                      )}
                      
                      <Button onClick={handleStartForm}>
                        {formStatus === 'not-started' ? (
                          <>Iniciar Formulário</>
                        ) : formStatus === 'in-progress' ? (
                          <>Continuar Preenchimento</>
                        ) : (
                          <>Preencher Novamente</>
                        )}
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}
        
        {/* Formulário */}
        {showForm && selectedTemplate && (
          <>
            <div className="mb-6 flex justify-between items-center">
              <div>
                <h2 className="text-lg font-medium">
                  Funcionário: {employees.find(e => e.id === selectedEmployeeId)?.name}
                </h2>
                <p className="text-sm text-muted-foreground">
                  Formulário: {selectedTemplate.nome}
                </p>
              </div>
              
              <Button 
                variant="outline" 
                className="flex items-center gap-2" 
                onClick={handleMarkAllAsNo}
              >
                <CheckSquare className="h-4 w-4" />
                Marcar todas como "Não"
              </Button>
            </div>
            
            {/* Exibir todas as seções de uma vez */}
            <div className="space-y-6">
              {formData.sections.map((section, index) => (
                <FormSection
                  key={index}
                  section={section}
                  answers={answers}
                  onAnswerChange={handleAnswerChange}
                  onObservationChange={handleObservationChange}
                  onOptionsChange={handleOptionsChange}
                />
              ))}
            </div>
            
            <div className="mt-8 flex justify-end">
              <Button onClick={handleFinish} className="flex items-center gap-2">
                <Check className="h-4 w-4" />
                Finalizar
              </Button>
            </div>
          </>
        )}
        
        {/* Visualização dos resultados */}
        {showResults && selectedEmployeeId && selectedTemplate && selectedEmployee && (
          <>
            <div className="mb-6 flex justify-between items-center">
              <div>
                <h2 className="text-lg font-medium">
                  Resultados: {selectedEmployee.name}
                </h2>
                <p className="text-sm text-muted-foreground">
                  Formulário: {selectedTemplate.nome}
                </p>
              </div>
              
              <div className="flex gap-2">
                <Button variant="outline" onClick={handleNewForm}>
                  Voltar
                </Button>
                <Button 
                  onClick={handleStartForm} 
                  variant="outline"
                  className="flex items-center gap-2"
                >
                  <Edit className="h-4 w-4" />
                  Editar Respostas
                </Button>
              </div>
            </div>
            
            {/* Componente de resumo dos resultados */}
            {getFormResultByEmployeeId(selectedEmployeeId, selectedTemplate.id) && (
              <FormResultSummary 
                result={getFormResultByEmployeeId(selectedEmployeeId, selectedTemplate.id)!}
                employee={selectedEmployee}
              />
            )}
          </>
        )}
      </div>
    </Layout>
  );
};

export default FormularioPage;
