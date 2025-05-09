
import { FormTemplate } from '@/types/admin';

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

export const addFormTemplate = (template: Omit<FormTemplate, 'id'>): FormTemplate => {
  const id = `form-${String(MOCK_FORM_TEMPLATES.length + 1).padStart(3, '0')}`;
  const newTemplate: FormTemplate = {
    ...template,
    id
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
