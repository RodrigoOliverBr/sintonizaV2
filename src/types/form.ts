
export type SeverityLevel = 'LEVEMENTE PREJUDICIAL' | 'PREJUDICIAL' | 'EXTREMAMENTE PREJUDICIAL';

export type FormSection = {
  title: string;
  description?: string;
  questions: Question[];
};

export type Question = {
  id: number;
  text: string;
  risk: string; // Added risk field
  severity: SeverityLevel;
  mitigationActions: string[];
  options?: { label: string; value: string }[];
  showObservation?: boolean;
};

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
