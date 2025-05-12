
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Layout from "@/components/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import FormSection from "@/components/FormSection";
import { getFormTemplateById } from "@/services/formTemplateService";
import { FormSection as FormSectionType, FormAnswer, FormResult, StoredFormResult } from "@/types/form";
import { FormTemplate } from "@/types/admin";
import { toast } from "sonner";

const FormularioPage = () => {
  const { id } = useParams<{ id: string }>();
  const [form, setForm] = useState<FormTemplate | null>(null);
  const [answers, setAnswers] = useState<Record<number, FormAnswer>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [analyistNotes, setAnalyistNotes] = useState("");

  useEffect(() => {
    if (id) {
      loadForm(id);
    } else {
      loadDefaultForm();
    }
  }, [id]);

  const loadForm = (formId: string) => {
    try {
      setIsLoading(true);
      const formTemplate = getFormTemplateById(formId);
      
      if (formTemplate) {
        setForm(formTemplate);
        // Initialize answers
        const initialAnswers: Record<number, FormAnswer> = {};
        formTemplate.secoes.forEach((section) => {
          section.questions.forEach((question) => {
            initialAnswers[question.id] = {
              questionId: question.id,
              answer: null,
              observation: "",
              selectedOptions: []
            };
          });
        });
        setAnswers(initialAnswers);
      } else {
        toast.error("Formulário não encontrado!");
      }
    } catch (error) {
      console.error("Erro ao carregar formulário:", error);
      toast.error("Erro ao carregar formulário");
    } finally {
      setIsLoading(false);
    }
  };

  const loadDefaultForm = () => {
    try {
      setIsLoading(true);
      const formTemplate = getFormTemplateById("form-004"); // ID for "Avaliação de Riscos Psicossociais - Formulário Único"

      if (formTemplate) {
        setForm(formTemplate);
        // Initialize answers
        const initialAnswers: Record<number, FormAnswer> = {};
        formTemplate.secoes.forEach((section) => {
          section.questions.forEach((question) => {
            initialAnswers[question.id] = {
              questionId: question.id,
              answer: null,
              observation: "",
              selectedOptions: []
            };
          });
        });
        setAnswers(initialAnswers);
      } else {
        toast.error("Formulário padrão não encontrado!");
      }
    } catch (error) {
      console.error("Erro ao carregar formulário padrão:", error);
      toast.error("Erro ao carregar formulário padrão");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAnswerChange = (questionId: number, value: boolean | null) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: {
        ...prev[questionId],
        answer: value
      }
    }));
  };

  const handleObservationChange = (questionId: number, observation: string) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: {
        ...prev[questionId],
        observation
      }
    }));
  };

  const handleOptionsChange = (questionId: number, selectedOptions: string[]) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: {
        ...prev[questionId],
        selectedOptions
      }
    }));
  };

  const calculateResults = (): FormResult => {
    let totalYes = 0;
    let totalNo = 0;
    const severityCounts = {
      "LEVEMENTE PREJUDICIAL": 0,
      "PREJUDICIAL": 0,
      "EXTREMAMENTE PREJUDICIAL": 0
    };
    const yesPerSeverity = {
      "LEVEMENTE PREJUDICIAL": 0,
      "PREJUDICIAL": 0,
      "EXTREMAMENTE PREJUDICIAL": 0
    };

    // Calculate statistics
    Object.values(answers).forEach((answer) => {
      if (answer.answer === true) {
        totalYes++;

        // Find this question in the form to get its severity
        form?.secoes.forEach((section) => {
          const question = section.questions.find(q => q.id === answer.questionId);
          if (question) {
            yesPerSeverity[question.severity]++;
          }
        });
      } else if (answer.answer === false) {
        totalNo++;
      }
    });

    // Count questions by severity
    form?.secoes.forEach((section) => {
      section.questions.forEach((question) => {
        severityCounts[question.severity]++;
      });
    });

    return {
      answers,
      totalYes,
      totalNo,
      severityCounts,
      yesPerSeverity,
      analyistNotes
    };
  };

  const handleSubmit = () => {
    // Check if all questions have been answered
    const unansweredQuestions = Object.values(answers).filter(answer => answer.answer === null);
    
    if (unansweredQuestions.length > 0) {
      toast.warning(`Existem ${unansweredQuestions.length} perguntas sem resposta. Deseja realmente salvar?`, {
        action: {
          label: "Salvar mesmo assim",
          onClick: () => saveForm()
        }
      });
    } else {
      saveForm();
    }
  };

  const saveForm = () => {
    const results = calculateResults();
    
    const storedResult: StoredFormResult = {
      ...results,
      employeeId: "current-user", // In a real app, this would be the current user's ID
      lastUpdated: Date.now(),
      isComplete: Object.values(answers).every(answer => answer.answer !== null),
      formTemplateId: form?.id || ""
    };
    
    // In a real app, you would save this to your database
    console.log("Formulário salvo:", storedResult);
    
    toast.success("Formulário salvo com sucesso!");
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="container mx-auto py-8">
          <p>Carregando formulário...</p>
        </div>
      </Layout>
    );
  }

  if (!form) {
    return (
      <Layout>
        <div className="container mx-auto py-8">
          <p>Formulário não encontrado. Por favor, verifique o ID do formulário.</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto py-8">
        <Card className="w-full">
          <CardHeader>
            <CardTitle>{form.nome}</CardTitle>
            <CardDescription>{form.descricao}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="bg-blue-50 p-4 mb-6 rounded-md border border-blue-200">
              <p className="text-blue-800">
                Bem-vindo(a) ao formulário de Avaliação de Riscos Psicossociais. Leia cada questão atentamente, responda Sim ou Não, e confira as orientações de mitigação sugeridas quando necessário. Ao final, salve ou envie o formulário para que possamos avaliar seu caso.
              </p>
            </div>
            
            {form.secoes.map((section) => (
              <FormSection
                key={section.id}
                section={section}
                answers={answers}
                onAnswerChange={handleAnswerChange}
                onObservationChange={handleObservationChange}
                onOptionsChange={handleOptionsChange}
              />
            ))}
            
            <div className="mt-8">
              <Button onClick={handleSubmit} size="lg">
                Salvar Formulário
              </Button>
            </div>
          </CardContent>
          <CardFooter>
            <p className="text-sm text-gray-500">
              Formulário de avaliação de riscos psicossociais | Data de atualização: {new Date(form.ultimaAtualizacao).toLocaleDateString()}
            </p>
          </CardFooter>
        </Card>
      </div>
    </Layout>
  );
};

export default FormularioPage;
