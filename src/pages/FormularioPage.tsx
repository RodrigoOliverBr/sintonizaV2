
import React, { useState, useEffect } from "react";
import Layout from "@/components/Layout";
import FormSection from "@/components/FormSection";
import FormResults from "@/components/FormResults";
import { formData } from "@/data/formData";
import { FormAnswer, FormResult, SeverityLevel } from "@/types/form";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const FormularioPage: React.FC = () => {
  const [answers, setAnswers] = useState<Record<number, FormAnswer>>({});
  const [progress, setProgress] = useState(0);
  const [tab, setTab] = useState("form");
  const [result, setResult] = useState<FormResult>({
    answers: {},
    totalYes: 0,
    totalNo: 0,
    severityCounts: {
      "LEVEMENTE PREJUDICIAL": 0,
      "PREJUDICIAL": 0,
      "EXTREMAMENTE PREJUDICIAL": 0
    },
    yesPerSeverity: {
      "LEVEMENTE PREJUDICIAL": 0,
      "PREJUDICIAL": 0,
      "EXTREMAMENTE PREJUDICIAL": 0
    },
    analyistNotes: ""
  });

  const totalQuestions = formData.sections.reduce((acc, section) => acc + section.questions.length, 0);

  useEffect(() => {
    // Inicializa as respostas
    const initialAnswers: Record<number, FormAnswer> = {};
    formData.sections.forEach(section => {
      section.questions.forEach(question => {
        initialAnswers[question.id] = {
          questionId: question.id,
          answer: null,
          observation: "",
          selectedOptions: []
        };
      });
    });
    setAnswers(initialAnswers);
  }, []);

  useEffect(() => {
    // Calcula o progresso
    const answeredQuestions = Object.values(answers).filter(a => a.answer !== null).length;
    const progressPercentage = Math.round((answeredQuestions / totalQuestions) * 100);
    setProgress(progressPercentage);

    // Calcula os resultados
    calculateResults();
  }, [answers]);

  const calculateResults = () => {
    const totalYes = Object.values(answers).filter(a => a.answer === true).length;
    const totalNo = Object.values(answers).filter(a => a.answer === false).length;
    const severityCounts: Record<SeverityLevel, number> = {
      "LEVEMENTE PREJUDICIAL": 0,
      "PREJUDICIAL": 0,
      "EXTREMAMENTE PREJUDICIAL": 0
    };
    const yesPerSeverity: Record<SeverityLevel, number> = {
      "LEVEMENTE PREJUDICIAL": 0,
      "PREJUDICIAL": 0,
      "EXTREMAMENTE PREJUDICIAL": 0
    };

    // Conta as severidades
    formData.sections.forEach(section => {
      section.questions.forEach(question => {
        const severity = question.severity as SeverityLevel;
        severityCounts[severity] = (severityCounts[severity] || 0) + 1;
        
        const answer = answers[question.id];
        if (answer && answer.answer === true) {
          yesPerSeverity[severity] = (yesPerSeverity[severity] || 0) + 1;
        }
      });
    });

    setResult({
      answers,
      totalYes,
      totalNo,
      severityCounts,
      yesPerSeverity,
      analyistNotes: result.analyistNotes
    });
  };

  const handleAnswerChange = (questionId: number, answer: boolean | null) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: {
        ...prev[questionId],
        questionId,
        answer
      }
    }));
  };

  const handleObservationChange = (questionId: number, observation: string) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: {
        ...prev[questionId],
        observation
      }
    }));
  };

  const handleOptionsChange = (questionId: number, options: string[]) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: {
        ...prev[questionId],
        selectedOptions: options
      }
    }));
  };

  const handleNotesChange = (notes: string) => {
    setResult(prev => ({
      ...prev,
      analyistNotes: notes
    }));
  };

  return (
    <Layout>
      <Tabs value={tab} onValueChange={setTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger value="form">Formulário</TabsTrigger>
          <TabsTrigger value="results">Resultados</TabsTrigger>
        </TabsList>
        <TabsContent value="form">
          <div className="mb-6">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium">
                Progresso: {progress}% ({Object.values(answers).filter(a => a.answer !== null).length} de {totalQuestions})
              </span>
              <Button 
                variant="default" 
                className="ml-auto"
                onClick={() => setTab("results")}
                disabled={progress === 0}
              >
                Ver Resultados
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
            <Progress value={progress} className="h-2" />
          </div>

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

          <div className="flex justify-end mt-6 print:hidden">
            <Button variant="default" onClick={() => setTab("results")} disabled={progress === 0}>
              Ver Resultados
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </TabsContent>
        <TabsContent value="results">
          <FormResults result={result} onNotesChange={handleNotesChange} />
          <div className="flex justify-start mt-6 print:hidden">
            <Button variant="outline" onClick={() => setTab("form")}>
              Voltar ao Formulário
            </Button>
          </div>
        </TabsContent>
      </Tabs>
    </Layout>
  );
};

export default FormularioPage;
