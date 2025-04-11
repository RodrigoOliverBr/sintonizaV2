
export type ClienteStatus = 'liberado' | 'bloqueado';
export type TipoPessoa = 'fisica' | 'juridica';
export type StatusContrato = 'ativo' | 'em-analise' | 'cancelado';
export type CicloFaturamento = 'mensal' | 'trimestral' | 'anual';
export type StatusFatura = 'pendente' | 'pago' | 'atrasado';

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
}

export interface Plano {
  id: string;
  nome: string;
  descricao: string;
  valorMensal: number;
  duracao: number; // em meses
  recursos: string[]; // lista de recursos incluídos
  ativo: boolean;
}

export interface Contrato {
  id: string;
  numero: string;
  clienteId: string;
  planoId: string;
  dataInicio: number; // timestamp
  dataFim: number; // timestamp
  valorMensal: number;
  status: StatusContrato;
  taxaImplantacao: number;
  observacoes: string;
  cicloFaturamento: CicloFaturamento;
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
