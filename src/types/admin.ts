
export type ClienteStatus = 'liberado' | 'bloqueado' | 'pendente';
export type TipoPessoa = 'fisica' | 'juridica';
export type StatusContrato = 'ativo' | 'em-analise' | 'cancelado';
export type CicloFaturamento = 'mensal' | 'trimestral' | 'anual';
export type StatusFatura = 'pendente' | 'pago' | 'atrasado' | 'programada';

export interface Cliente {
  id: string;
  nome: string;
  tipo: TipoPessoa;
  numeroEmpregados: number;
  dataInclusao: number; // timestamp
  situacao: ClienteStatus;
  cpfCnpj: string;
  email: string;
  telefone: string;
  endereco: string;
  cidade: string;
  estado: string;
  cep: string;
  contato: string;
  plano?: string; // Added plano property
  formulariosIds?: string[]; // IDs dos formulários disponíveis para este cliente
}

export interface Plano {
  id: string;
  nome: string;
  descricao: string;
  valorMensal: number;
  valorImplantacao: number;
  limiteEmpresas: number;
  empresasIlimitadas: boolean;
  limiteEmpregados: number;
  empregadosIlimitados: boolean;
  dataValidade: number | null; // timestamp ou null para sem vencimento
  semVencimento: boolean;
  ativo: boolean;
}

export interface Contrato {
  id: string;
  numero: string;
  clienteId: string;
  planoId: string;
  dataInicio: number; // timestamp
  dataFim: number; // timestamp
  dataPrimeiroVencimento: number; // timestamp para o primeiro vencimento
  valorMensal: number;
  status: StatusContrato;
  taxaImplantacao: number;
  observacoes: string;
  cicloFaturamento: CicloFaturamento;
  proximaRenovacao?: number; // timestamp para próxima renovação automática
  ciclosGerados: number; // número de ciclos de faturamento já gerados
}

export interface Fatura {
  id: string;
  numero: string;
  clienteId: string;
  contratoId: string;
  dataEmissao: number; // timestamp
  dataVencimento: number; // timestamp
  valor: number;
  status: StatusFatura;
  referencia: string; // ex: "05/2025"
}

// Interface para estado de seleção em lote
export interface BatchSelection {
  [key: string]: boolean;
}

// Interface para modelos de formulário
export interface FormTemplate {
  id: string;
  nome: string;
  descricao: string;
  dataCriacao: number; // timestamp
  ultimaAtualizacao: number; // timestamp
  ativo: boolean;
  padrao: boolean; // se é o formulário padrão
  secoes: import('@/types/form').FormSection[];
}
