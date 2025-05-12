
import { FormTemplate } from '@/types/admin';
import { FormSection, FormQuestion } from '@/types/form';
import { v4 as uuidv4 } from 'uuid';

// Mock form templates
const MOCK_FORM_TEMPLATES: FormTemplate[] = [
  {
    id: "form-001",
    nome: "ISTAS21-BR Padrão",
    descricao: "Questionário padrão para avaliação de riscos psicossociais no trabalho",
    dataCriacao: Date.now() - 90 * 24 * 60 * 60 * 1000,
    ultimaAtualizacao: Date.now() - 30 * 24 * 60 * 60 * 1000,
    ativo: true,
    padrao: true,
    secoes: []
  },
  {
    id: "form-002",
    nome: "ISTAS21-BR Simplificado",
    descricao: "Versão simplificada do questionário para empresas de pequeno porte",
    dataCriacao: Date.now() - 60 * 24 * 60 * 60 * 1000,
    ultimaAtualizacao: Date.now() - 15 * 24 * 60 * 60 * 1000,
    ativo: true,
    padrao: false,
    secoes: []
  },
  {
    id: "form-003",
    nome: "ISTAS21-BR Completo",
    descricao: "Versão completa com seções adicionais para empresas de grande porte",
    dataCriacao: Date.now() - 30 * 24 * 60 * 60 * 1000,
    ultimaAtualizacao: Date.now() - 5 * 24 * 60 * 60 * 1000,
    ativo: true,
    padrao: false,
    secoes: []
  }
];

// Form template functions
export const getFormTemplates = (): FormTemplate[] => {
  return MOCK_FORM_TEMPLATES;
};

export const getFormTemplateById = (id: string): FormTemplate | undefined => {
  return MOCK_FORM_TEMPLATES.find(template => template.id === id);
};

export const getDefaultFormTemplate = (): FormTemplate => {
  const defaultTemplate = MOCK_FORM_TEMPLATES.find(template => template.padrao);
  if (!defaultTemplate) {
    throw new Error("No default template found");
  }
  return defaultTemplate;
};

export const addFormTemplate = (template: Omit<FormTemplate, 'id'>): FormTemplate => {
  const id = `form-${String(MOCK_FORM_TEMPLATES.length + 1).padStart(3, '0')}`;
  
  // Make sure we have dataCriacao and ultimaAtualizacao
  const now = Date.now();
  const newTemplate: FormTemplate = {
    ...template,
    id,
    dataCriacao: template.dataCriacao || now,
    ultimaAtualizacao: template.ultimaAtualizacao || now
  };
  
  MOCK_FORM_TEMPLATES.push(newTemplate);
  return newTemplate;
};

export const updateFormTemplate = (template: FormTemplate): FormTemplate => {
  const index = MOCK_FORM_TEMPLATES.findIndex(t => t.id === template.id);
  if (index !== -1) {
    template.ultimaAtualizacao = Date.now();
    MOCK_FORM_TEMPLATES[index] = template;
    return template;
  }
  throw new Error(`Template com ID ${template.id} não encontrado`);
};

export const deleteFormTemplate = (id: string): void => {
  const index = MOCK_FORM_TEMPLATES.findIndex(t => t.id === id);
  if (index !== -1) {
    MOCK_FORM_TEMPLATES.splice(index, 1);
  } else {
    throw new Error(`Template com ID ${id} não encontrado`);
  }
};

export const duplicateFormTemplate = (id: string): FormTemplate => {
  const original = getFormTemplateById(id);
  if (!original) {
    throw new Error(`Template com ID ${id} não encontrado`);
  }

  const duplicate: Omit<FormTemplate, 'id'> = {
    nome: `${original.nome} (cópia)`,
    descricao: original.descricao,
    ativo: original.ativo,
    padrao: false, // A cópia nunca é o template padrão
    dataCriacao: Date.now(),
    ultimaAtualizacao: Date.now(),
    secoes: JSON.parse(JSON.stringify(original.secoes)) // Deep copy das seções
  };

  return addFormTemplate(duplicate);
};

// Funções para gerenciamento de seções
export const addSectionToTemplate = (templateId: string, section: Omit<FormSection, 'id'>): FormTemplate => {
  const template = getFormTemplateById(templateId);
  if (!template) {
    throw new Error(`Template com ID ${templateId} não encontrado`);
  }

  const newSection: FormSection = {
    ...section,
    id: uuidv4(),
    questions: section.questions || []
  };

  template.secoes.push(newSection);
  template.ultimaAtualizacao = Date.now();
  
  return template;
};

export const updateSection = (templateId: string, section: FormSection): FormTemplate => {
  const template = getFormTemplateById(templateId);
  if (!template) {
    throw new Error(`Template com ID ${templateId} não encontrado`);
  }

  const sectionIndex = template.secoes.findIndex(s => s.id === section.id);
  if (sectionIndex === -1) {
    throw new Error(`Seção com ID ${section.id} não encontrada no template ${templateId}`);
  }

  template.secoes[sectionIndex] = section;
  template.ultimaAtualizacao = Date.now();
  
  return template;
};

export const deleteSection = (templateId: string, sectionId: string): FormTemplate => {
  const template = getFormTemplateById(templateId);
  if (!template) {
    throw new Error(`Template com ID ${templateId} não encontrado`);
  }

  const sectionIndex = template.secoes.findIndex(s => s.id === sectionId);
  if (sectionIndex === -1) {
    throw new Error(`Seção com ID ${sectionId} não encontrada no template ${templateId}`);
  }

  template.secoes.splice(sectionIndex, 1);
  template.ultimaAtualizacao = Date.now();
  
  return template;
};

// Funções para gerenciamento de perguntas
export const addQuestionToSection = (
  templateId: string, 
  sectionId: string, 
  question: Omit<FormQuestion, 'id'>
): FormTemplate => {
  const template = getFormTemplateById(templateId);
  if (!template) {
    throw new Error(`Template com ID ${templateId} não encontrado`);
  }

  const section = template.secoes.find(s => s.id === sectionId);
  if (!section) {
    throw new Error(`Seção com ID ${sectionId} não encontrada no template ${templateId}`);
  }

  const newQuestion: FormQuestion = {
    ...question,
    id: parseInt(uuidv4().substring(0, 8), 16) // Generate a numeric ID from UUID
  };

  section.questions = section.questions || [];
  section.questions.push(newQuestion);
  template.ultimaAtualizacao = Date.now();
  
  return template;
};

export const updateQuestion = (
  templateId: string, 
  sectionId: string, 
  question: FormQuestion
): FormTemplate => {
  const template = getFormTemplateById(templateId);
  if (!template) {
    throw new Error(`Template com ID ${templateId} não encontrado`);
  }

  const section = template.secoes.find(s => s.id === sectionId);
  if (!section) {
    throw new Error(`Seção com ID ${sectionId} não encontrada no template ${templateId}`);
  }

  const questionIndex = section.questions.findIndex(q => q.id === question.id);
  if (questionIndex === -1) {
    throw new Error(`Pergunta com ID ${question.id} não encontrada na seção ${sectionId}`);
  }

  section.questions[questionIndex] = question;
  template.ultimaAtualizacao = Date.now();
  
  return template;
};

export const deleteQuestion = (
  templateId: string, 
  sectionId: string, 
  questionId: number
): FormTemplate => {
  const template = getFormTemplateById(templateId);
  if (!template) {
    throw new Error(`Template com ID ${templateId} não encontrado`);
  }

  const section = template.secoes.find(s => s.id === sectionId);
  if (!section) {
    throw new Error(`Seção com ID ${sectionId} não encontrada no template ${templateId}`);
  }

  const questionIndex = section.questions.findIndex(q => q.id === questionId);
  if (questionIndex === -1) {
    throw new Error(`Pergunta com ID ${questionId} não encontrada na seção ${sectionId}`);
  }

  section.questions.splice(questionIndex, 1);
  template.ultimaAtualizacao = Date.now();
  
  return template;
};

// Funções de reordenação
export const reorderSections = (templateId: string, orderedSectionIds: string[]): FormTemplate => {
  const template = getFormTemplateById(templateId);
  if (!template) {
    throw new Error(`Template com ID ${templateId} não encontrado`);
  }

  // Verificar se todos os IDs de seção estão presentes
  if (orderedSectionIds.length !== template.secoes.length) {
    throw new Error("A quantidade de seções na reordenação não corresponde ao template");
  }

  // Criar um mapa das seções existentes
  const sectionsMap = template.secoes.reduce((acc, section) => {
    acc[section.id] = section;
    return acc;
  }, {} as Record<string, FormSection>);

  // Reordenar as seções conforme a ordem fornecida
  template.secoes = orderedSectionIds.map(id => {
    if (!sectionsMap[id]) {
      throw new Error(`Seção com ID ${id} não encontrada no template`);
    }
    return sectionsMap[id];
  });

  template.ultimaAtualizacao = Date.now();
  return template;
};

export const reorderQuestions = (
  templateId: string, 
  sectionId: string, 
  orderedQuestionIds: number[]
): FormTemplate => {
  const template = getFormTemplateById(templateId);
  if (!template) {
    throw new Error(`Template com ID ${templateId} não encontrado`);
  }

  const section = template.secoes.find(s => s.id === sectionId);
  if (!section) {
    throw new Error(`Seção com ID ${sectionId} não encontrada no template ${templateId}`);
  }

  // Verificar se todos os IDs de perguntas estão presentes
  if (orderedQuestionIds.length !== section.questions.length) {
    throw new Error("A quantidade de perguntas na reordenação não corresponde à seção");
  }

  // Criar um mapa das perguntas existentes
  const questionsMap = section.questions.reduce((acc, question) => {
    acc[question.id] = question;
    return acc;
  }, {} as Record<number, FormQuestion>);

  // Reordenar as perguntas conforme a ordem fornecida
  section.questions = orderedQuestionIds.map(id => {
    if (!questionsMap[id]) {
      throw new Error(`Pergunta com ID ${id} não encontrada na seção`);
    }
    return questionsMap[id];
  });

  template.ultimaAtualizacao = Date.now();
  return template;
};
