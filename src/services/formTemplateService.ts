
import { FormTemplate } from '@/types/admin';
import { FormData, FormSection } from '@/types/form';
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
