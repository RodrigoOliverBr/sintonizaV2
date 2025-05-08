
import { FormTemplate } from '@/types/admin';
import { FormData, FormSection, Question, SeverityLevel } from '@/types/form';
import { formData } from '@/data/formData';

// Key de localStorage
const FORM_TEMPLATES_KEY = "sintonia:formTemplates";

// Formulário padrão (ISTAS21-BR)
const formulariosIniciais: FormTemplate[] = [
  {
    id: "istas21-br",
    nome: "ISTAS21-BR",
    descricao: "Formulário padrão ISTAS21-BR para avaliação de riscos psicossociais no ambiente de trabalho.",
    dataCriacao: Date.now(),
    ultimaAtualizacao: Date.now(),
    ativo: true,
    padrao: true,
    secoes: formData.sections
  }
];

// Inicialização dos dados
const inicializarFormularios = () => {
  if (!localStorage.getItem(FORM_TEMPLATES_KEY)) {
    localStorage.setItem(FORM_TEMPLATES_KEY, JSON.stringify(formulariosIniciais));
    console.log("Formulários inicializados");
  }
};

// Inicializar dados ao carregar o serviço
inicializarFormularios();

// Obter todos os modelos de formulário
export const getFormTemplates = (): FormTemplate[] => {
  const templates = localStorage.getItem(FORM_TEMPLATES_KEY);
  if (!templates) {
    return formulariosIniciais;
  }
  return JSON.parse(templates);
};

// Obter modelo de formulário por ID
export const getFormTemplateById = (id: string): FormTemplate | undefined => {
  return getFormTemplates().find(t => t.id === id);
};

// Obter modelo de formulário padrão
export const getDefaultFormTemplate = (): FormTemplate => {
  const templates = getFormTemplates();
  const defaultTemplate = templates.find(t => t.padrao);
  if (defaultTemplate) {
    return defaultTemplate;
  }
  return formulariosIniciais[0];
};

// Adicionar novo modelo de formulário
export const addFormTemplate = (template: Omit<FormTemplate, "id" | "dataCriacao" | "ultimaAtualizacao">): FormTemplate => {
  const templates = getFormTemplates();
  
  // Se o novo modelo for definido como padrão, remover a flag de padrão dos outros
  if (template.padrao) {
    const updatedTemplates = templates.map(t => ({
      ...t,
      padrao: false
    }));
    localStorage.setItem(FORM_TEMPLATES_KEY, JSON.stringify(updatedTemplates));
  }
  
  const newTemplate: FormTemplate = {
    ...template,
    id: Date.now().toString(),
    dataCriacao: Date.now(),
    ultimaAtualizacao: Date.now()
  };
  
  localStorage.setItem(FORM_TEMPLATES_KEY, JSON.stringify([...templates, newTemplate]));
  return newTemplate;
};

// Atualizar modelo de formulário existente
export const updateFormTemplate = (template: FormTemplate): void => {
  const templates = getFormTemplates();
  
  // Se este modelo for definido como padrão, remover a flag de padrão dos outros
  if (template.padrao) {
    templates.forEach(t => {
      if (t.id !== template.id) {
        t.padrao = false;
      }
    });
  }
  
  const updatedTemplate = {
    ...template,
    ultimaAtualizacao: Date.now()
  };
  
  const updatedTemplates = templates.map(t => t.id === template.id ? updatedTemplate : t);
  localStorage.setItem(FORM_TEMPLATES_KEY, JSON.stringify(updatedTemplates));
};

// Excluir modelo de formulário
export const deleteFormTemplate = (id: string): void => {
  const templates = getFormTemplates();
  
  // Não permitir exclusão do formulário padrão
  const templateToDelete = templates.find(t => t.id === id);
  if (templateToDelete?.padrao) {
    throw new Error("Não é possível excluir o formulário padrão");
  }
  
  const filteredTemplates = templates.filter(t => t.id !== id);
  localStorage.setItem(FORM_TEMPLATES_KEY, JSON.stringify(filteredTemplates));
};

// Duplicar modelo de formulário existente
export const duplicateFormTemplate = (id: string): FormTemplate => {
  const templates = getFormTemplates();
  const templateToDuplicate = templates.find(t => t.id === id);
  
  if (!templateToDuplicate) {
    throw new Error("Formulário não encontrado");
  }
  
  const newTemplate: FormTemplate = {
    ...templateToDuplicate,
    id: Date.now().toString(),
    nome: `${templateToDuplicate.nome} (Cópia)`,
    dataCriacao: Date.now(),
    ultimaAtualizacao: Date.now(),
    padrao: false
  };
  
  localStorage.setItem(FORM_TEMPLATES_KEY, JSON.stringify([...templates, newTemplate]));
  return newTemplate;
};

// Atribuir formulários a um cliente
export const assignFormTemplatesToClient = (clienteId: string, templateIds: string[]): void => {
  // Esta função será implementada no adminService.ts para modificar o objeto Cliente
};

// Funcoes para gerenciamento de secoes e perguntas

// Adicionar seção a um template
export const addSectionToTemplate = (templateId: string, section: Omit<FormSection, 'questions'>): FormTemplate | undefined => {
  const template = getFormTemplateById(templateId);
  
  if (!template) {
    throw new Error("Formulário não encontrado");
  }
  
  const newSection: FormSection = {
    ...section,
    questions: []
  };
  
  const updatedTemplate: FormTemplate = {
    ...template,
    secoes: [...template.secoes, newSection],
    ultimaAtualizacao: Date.now()
  };
  
  updateFormTemplate(updatedTemplate);
  return updatedTemplate;
};

// Atualizar seção
export const updateSection = (templateId: string, sectionIndex: number, section: Omit<FormSection, 'questions'>): FormTemplate | undefined => {
  const template = getFormTemplateById(templateId);
  
  if (!template) {
    throw new Error("Formulário não encontrado");
  }
  
  if (sectionIndex < 0 || sectionIndex >= template.secoes.length) {
    throw new Error("Seção não encontrada");
  }
  
  const updatedSections = [...template.secoes];
  updatedSections[sectionIndex] = {
    ...updatedSections[sectionIndex],
    ...section
  };
  
  const updatedTemplate: FormTemplate = {
    ...template,
    secoes: updatedSections,
    ultimaAtualizacao: Date.now()
  };
  
  updateFormTemplate(updatedTemplate);
  return updatedTemplate;
};

// Excluir seção
export const deleteSection = (templateId: string, sectionIndex: number): FormTemplate | undefined => {
  const template = getFormTemplateById(templateId);
  
  if (!template) {
    throw new Error("Formulário não encontrado");
  }
  
  if (sectionIndex < 0 || sectionIndex >= template.secoes.length) {
    throw new Error("Seção não encontrada");
  }
  
  const updatedSections = template.secoes.filter((_, index) => index !== sectionIndex);
  
  const updatedTemplate: FormTemplate = {
    ...template,
    secoes: updatedSections,
    ultimaAtualizacao: Date.now()
  };
  
  updateFormTemplate(updatedTemplate);
  return updatedTemplate;
};

// Adicionar pergunta a uma seção
export const addQuestionToSection = (
  templateId: string, 
  sectionIndex: number, 
  question: Omit<Question, 'id'>
): FormTemplate | undefined => {
  const template = getFormTemplateById(templateId);
  
  if (!template) {
    throw new Error("Formulário não encontrado");
  }
  
  if (sectionIndex < 0 || sectionIndex >= template.secoes.length) {
    throw new Error("Seção não encontrada");
  }
  
  // Gerar um novo ID para a pergunta
  const allQuestions = template.secoes.flatMap(s => s.questions);
  const maxId = allQuestions.reduce((max, q) => Math.max(max, q.id), 0);
  const newId = maxId + 1;
  
  const newQuestion: Question = {
    ...question,
    id: newId
  };
  
  const updatedSections = [...template.secoes];
  updatedSections[sectionIndex] = {
    ...updatedSections[sectionIndex],
    questions: [...updatedSections[sectionIndex].questions, newQuestion]
  };
  
  const updatedTemplate: FormTemplate = {
    ...template,
    secoes: updatedSections,
    ultimaAtualizacao: Date.now()
  };
  
  updateFormTemplate(updatedTemplate);
  return updatedTemplate;
};

// Atualizar pergunta
export const updateQuestion = (
  templateId: string, 
  sectionIndex: number,
  questionId: number,
  questionData: Partial<Omit<Question, 'id'>>
): FormTemplate | undefined => {
  const template = getFormTemplateById(templateId);
  
  if (!template) {
    throw new Error("Formulário não encontrado");
  }
  
  if (sectionIndex < 0 || sectionIndex >= template.secoes.length) {
    throw new Error("Seção não encontrada");
  }
  
  const questionIndex = template.secoes[sectionIndex].questions.findIndex(q => q.id === questionId);
  if (questionIndex === -1) {
    throw new Error("Pergunta não encontrada");
  }
  
  const updatedSections = [...template.secoes];
  updatedSections[sectionIndex] = {
    ...updatedSections[sectionIndex],
    questions: [
      ...updatedSections[sectionIndex].questions.slice(0, questionIndex),
      {
        ...updatedSections[sectionIndex].questions[questionIndex],
        ...questionData
      },
      ...updatedSections[sectionIndex].questions.slice(questionIndex + 1)
    ]
  };
  
  const updatedTemplate: FormTemplate = {
    ...template,
    secoes: updatedSections,
    ultimaAtualizacao: Date.now()
  };
  
  updateFormTemplate(updatedTemplate);
  return updatedTemplate;
};

// Excluir pergunta
export const deleteQuestion = (
  templateId: string, 
  sectionIndex: number,
  questionId: number
): FormTemplate | undefined => {
  const template = getFormTemplateById(templateId);
  
  if (!template) {
    throw new Error("Formulário não encontrado");
  }
  
  if (sectionIndex < 0 || sectionIndex >= template.secoes.length) {
    throw new Error("Seção não encontrada");
  }
  
  const updatedSections = [...template.secoes];
  updatedSections[sectionIndex] = {
    ...updatedSections[sectionIndex],
    questions: updatedSections[sectionIndex].questions.filter(q => q.id !== questionId)
  };
  
  const updatedTemplate: FormTemplate = {
    ...template,
    secoes: updatedSections,
    ultimaAtualizacao: Date.now()
  };
  
  updateFormTemplate(updatedTemplate);
  return updatedTemplate;
};

// Mover pergunta para outra seção
export const moveQuestion = (
  templateId: string,
  sourceSectionIndex: number,
  targetSectionIndex: number,
  questionId: number
): FormTemplate | undefined => {
  const template = getFormTemplateById(templateId);
  
  if (!template) {
    throw new Error("Formulário não encontrado");
  }
  
  if (
    sourceSectionIndex < 0 || 
    sourceSectionIndex >= template.secoes.length ||
    targetSectionIndex < 0 || 
    targetSectionIndex >= template.secoes.length
  ) {
    throw new Error("Seção não encontrada");
  }
  
  // Encontrar a pergunta na seção de origem
  const question = template.secoes[sourceSectionIndex].questions.find(q => q.id === questionId);
  if (!question) {
    throw new Error("Pergunta não encontrada");
  }
  
  // Remover a pergunta da seção de origem
  const updatedSections = [...template.secoes];
  updatedSections[sourceSectionIndex] = {
    ...updatedSections[sourceSectionIndex],
    questions: updatedSections[sourceSectionIndex].questions.filter(q => q.id !== questionId)
  };
  
  // Adicionar a pergunta à seção de destino
  updatedSections[targetSectionIndex] = {
    ...updatedSections[targetSectionIndex],
    questions: [...updatedSections[targetSectionIndex].questions, question]
  };
  
  const updatedTemplate: FormTemplate = {
    ...template,
    secoes: updatedSections,
    ultimaAtualizacao: Date.now()
  };
  
  updateFormTemplate(updatedTemplate);
  return updatedTemplate;
};

// Reordenar seções
export const reorderSections = (
  templateId: string,
  newOrder: number[]
): FormTemplate | undefined => {
  const template = getFormTemplateById(templateId);
  
  if (!template) {
    throw new Error("Formulário não encontrado");
  }
  
  if (newOrder.length !== template.secoes.length) {
    throw new Error("A nova ordem deve conter o mesmo número de seções");
  }
  
  const reorderedSections = newOrder.map(index => {
    if (index < 0 || index >= template.secoes.length) {
      throw new Error(`Índice de seção inválido: ${index}`);
    }
    return template.secoes[index];
  });
  
  const updatedTemplate: FormTemplate = {
    ...template,
    secoes: reorderedSections,
    ultimaAtualizacao: Date.now()
  };
  
  updateFormTemplate(updatedTemplate);
  return updatedTemplate;
};

// Reordenar perguntas dentro de uma seção
export const reorderQuestions = (
  templateId: string,
  sectionIndex: number,
  newOrder: number[]
): FormTemplate | undefined => {
  const template = getFormTemplateById(templateId);
  
  if (!template) {
    throw new Error("Formulário não encontrado");
  }
  
  if (sectionIndex < 0 || sectionIndex >= template.secoes.length) {
    throw new Error("Seção não encontrada");
  }
  
  const section = template.secoes[sectionIndex];
  
  if (newOrder.length !== section.questions.length) {
    throw new Error("A nova ordem deve conter o mesmo número de perguntas");
  }
  
  const reorderedQuestions = newOrder.map(index => {
    if (index < 0 || index >= section.questions.length) {
      throw new Error(`Índice de pergunta inválido: ${index}`);
    }
    return section.questions[index];
  });
  
  const updatedSections = [...template.secoes];
  updatedSections[sectionIndex] = {
    ...section,
    questions: reorderedQuestions
  };
  
  const updatedTemplate: FormTemplate = {
    ...template,
    secoes: updatedSections,
    ultimaAtualizacao: Date.now()
  };
  
  updateFormTemplate(updatedTemplate);
  return updatedTemplate;
};
