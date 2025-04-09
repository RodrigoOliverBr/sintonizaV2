
import React, { useState, useEffect } from "react";
import { getJobRoles } from "@/services/storageService";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { FormSection as FormSectionType, FormAnswer, FormResult } from "@/types/form";
import { formData } from "@/data/formData";
import FormSection from "@/components/FormSection";
import FormResults from "@/components/FormResults";
import { Card } from "@/components/ui/card";
import { JobRole } from "@/types/cadastro";

const FormularioPage: React.FC = () => {
  const [jobRoles, setJobRoles] = useState<JobRole[]>([]);
  const [currentStep, setCurrentStep] = useState(1);
  const [formAnswers, setFormAnswers] = useState<Record<number, FormAnswer>>({});
  const [showResults, setShowResults] = useState(false);
  const [formResult, setFormResult] = useState<FormResult>({
    answers: {},
    totalYes: 0,
    totalNo: 0,
    severityCounts: {
      "LEVEMENTE PREJUDICIAL": 0,
      "PREJUDICIAL": 0,
      "EXTREMAMENTE PREJUDICIAL": 0,
    },
    yesPerSeverity: {
      "LEVEMENTE PREJUDICIAL": 0,
      "PREJUDICIAL": 0,
      "EXTREMAMENTE PREJUDICIAL": 0,
    },
    analyistNotes: ""
  });

  // Load job roles on component mount
  useEffect(() => {
    setJobRoles(getJobRoles());
  }, []);

  // Calculate results whenever answers change
  useEffect(() => {
    calculateResults();
  }, [formAnswers]);

  const handleAnswerChange = (questionId: number, answer: boolean | null) => {
    setFormAnswers(prev => ({
      ...prev,
      [questionId]: {
        ...prev[questionId],
        questionId,
        answer,
        observation: prev[questionId]?.observation || "",
        selectedOptions: prev[questionId]?.selectedOptions || []
      }
    }));
  };

  const handleObservationChange = (questionId: number, observation: string) => {
    setFormAnswers(prev => ({
      ...prev,
      [questionId]: {
        ...prev[questionId],
        observation
      }
    }));
  };

  const handleOptionsChange = (questionId: number, selectedOptions: string[]) => {
    setFormAnswers(prev => ({
      ...prev,
      [questionId]: {
        ...prev[questionId],
        selectedOptions
      }
    }));
  };

  const handleAnalystNotesChange = (notes: string) => {
    setFormResult(prev => ({
      ...prev,
      analyistNotes: notes
    }));
  };

  const calculateResults = () => {
    // Count yes/no answers
    let totalYes = 0;
    let totalNo = 0;
    const severityCounts = {
      "LEVEMENTE PREJUDICIAL": 0,
      "PREJUDICIAL": 0,
      "EXTREMAMENTE PREJUDICIAL": 0,
    };
    const yesPerSeverity = {
      "LEVEMENTE PREJUDICIAL": 0,
      "PREJUDICIAL": 0,
      "EXTREMAMENTE PREJUDICIAL": 0,
    };

    // Get all questions from all sections
    const allQuestions = formData.sections.flatMap(section => section.questions);
    
    // Calculate statistics
    Object.values(formAnswers).forEach(answer => {
      const question = allQuestions.find(q => q.id === answer.questionId);
      
      if (answer.answer === true) {
        totalYes++;
        if (question) {
          yesPerSeverity[question.severity]++;
        }
      } else if (answer.answer === false) {
        totalNo++;
      }
      
      if (question) {
        severityCounts[question.severity]++;
      }
    });

    setFormResult(prev => ({
      ...prev,
      answers: formAnswers,
      totalYes,
      totalNo,
      severityCounts,
      yesPerSeverity,
    }));
  };

  const handleNextStep = () => {
    const nextStep = currentStep + 1;
    if (nextStep <= formData.sections.length) {
      setCurrentStep(nextStep);
      window.scrollTo(0, 0);
    } else {
      setShowResults(true);
      window.scrollTo(0, 0);
    }
  };

  const handlePrevStep = () => {
    const prevStep = currentStep - 1;
    if (prevStep > 0) {
      setCurrentStep(prevStep);
      window.scrollTo(0, 0);
    }
  };

  const handleRestart = () => {
    setFormAnswers({});
    setCurrentStep(1);
    setShowResults(false);
    window.scrollTo(0, 0);
  };

  // Utility function to get job role by id
  const getJobRoleById = (roleId: string) => {
    return jobRoles.find(role => role.id === roleId);
  };

  // Check if current section has all required fields filled
  const isSectionComplete = () => {
    const currentSection = formData.sections[currentStep - 1];
    if (!currentSection) return true;
    
    const sectionQuestionIds = currentSection.questions.map(q => q.id);
    return sectionQuestionIds.every(id => 
      formAnswers[id] && formAnswers[id].answer !== null
    );
  };

  // Progress indicator
  const progress = Math.round((currentStep / formData.sections.length) * 100);

  return (
    <Layout>
      <div className="container mx-auto p-4 pb-16">
        {!showResults ? (
          <>
            <div className="mb-6">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-muted-foreground">
                  Seção {currentStep} de {formData.sections.length}
                </span>
                <span className="text-sm text-muted-foreground">
                  {progress}% completo
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div
                  className="bg-esocial-blue h-2.5 rounded-full"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
            </div>

            <h1 className="text-3xl font-bold mb-6">Formulário de Avaliação</h1>
            <p className="text-lg mb-8">
              Utilize este formulário para realizar a avaliação de riscos ocupacionais.
            </p>

            {formData.sections[currentStep - 1] && (
              <FormSection
                section={formData.sections[currentStep - 1]}
                answers={formAnswers}
                onAnswerChange={handleAnswerChange}
                onObservationChange={handleObservationChange}
                onOptionsChange={handleOptionsChange}
              />
            )}

            <div className="flex justify-between mt-8">
              <Button
                variant="outline"
                onClick={handlePrevStep}
                disabled={currentStep === 1}
              >
                Anterior
              </Button>
              <Button
                onClick={handleNextStep}
                disabled={!isSectionComplete()}
              >
                {currentStep < formData.sections.length ? "Próximo" : "Ver Resultados"}
              </Button>
            </div>
          </>
        ) : (
          <>
            <FormResults 
              result={formResult} 
              onNotesChange={handleAnalystNotesChange} 
            />
            
            <div className="flex justify-center mt-8">
              <Button 
                variant="outline" 
                onClick={handleRestart}
                className="w-full md:w-auto"
              >
                Iniciar Nova Avaliação
              </Button>
            </div>
          </>
        )}
      </div>
    </Layout>
  );
};

export default FormularioPage;
