
import React from "react";
import { FormSection as FormSectionType, FormAnswer } from "@/types/form";
import QuestionComponent from "./QuestionComponent";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

interface FormSectionProps {
  section: FormSectionType;
  answers: Record<number, FormAnswer>;
  onAnswerChange: (questionId: number, answer: boolean | null) => void;
  onObservationChange: (questionId: number, observation: string) => void;
  onOptionsChange: (questionId: number, options: string[]) => void;
}

const FormSection: React.FC<FormSectionProps> = ({
  section,
  answers,
  onAnswerChange,
  onObservationChange,
  onOptionsChange,
}) => {
  // Usar um ID único para o accordion baseado no título da seção
  const sectionId = section.title.toLowerCase().replace(/\s+/g, '-');
  
  return (
    <div className="mb-6">
      <Accordion type="single" collapsible defaultValue={`item-${sectionId}`}>
        <AccordionItem value={`item-${sectionId}`} className="border-none">
          <AccordionTrigger className="py-4 bg-esocial-lightGray hover:bg-esocial-lightGray/80 px-4 rounded-lg text-esocial-darkGray">
            <h2 className="text-lg font-medium">{section.title}</h2>
          </AccordionTrigger>
          <AccordionContent className="pt-4">
            {section.description && (
              <p className="text-sm text-muted-foreground mb-4">{section.description}</p>
            )}
            <div className="space-y-4">
              {section.questions.map((question) => (
                <QuestionComponent
                  key={question.id}
                  question={question}
                  answer={answers[question.id]}
                  onChange={onAnswerChange}
                  onObservationChange={onObservationChange}
                  onOptionsChange={onOptionsChange}
                />
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};

export default FormSection;
