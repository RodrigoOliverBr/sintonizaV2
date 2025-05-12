export type SeverityLevel = 'LEVEMENTE PREJUDICIAL' | 'PREJUDICIAL' | 'EXTREMAMENTE PREJUDICIAL';

export interface FormSection {
  id: string; // Adding id to FormSection
  title: string;
  description?: string;
  questions: Question[];
}

export type Question = {
  id: number;
  text: string;
  type: string; // Adding type field to Question
  risk: string;
  severity: SeverityLevel;
  mitigationActions: string[];
  options?: { label: string; value: string }[];
  showObservation?: boolean;
};

// Re-export FormTemplate from admin.ts to fix circular dependency
export type FormTemplate = import('@/types/admin').FormTemplate;

export type FormAnswer = {
  questionId: number;
  answer: boolean | null;
  observation?: string;
  selectedOptions?: string[];
};

export type FormData = {
  sections: FormSection[];
};

export type FormResult = {
  answers: Record<number, FormAnswer>;
  totalYes: number;
  totalNo: number;
  severityCounts: Record<SeverityLevel, number>;
  yesPerSeverity: Record<SeverityLevel, number>;
  analyistNotes: string;
};

export type StoredFormResult = FormResult & {
  employeeId: string;
  lastUpdated: number; // timestamp
  isComplete: boolean;
  formTemplateId: string; // Add formTemplateId to associate with specific template
};

export type FormStatus = 'not-started' | 'in-progress' | 'completed';
