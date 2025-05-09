
// Implementação de serviços administrativos para autenticação e gerenciamento de clientes
import { v4 as uuidv4 } from 'uuid';
import { Cliente, Plano, Contrato, Fatura, StatusFatura, CicloFaturamento, ClienteStatus, StatusContrato, FormTemplate } from '@/types/admin';
import { getFormTemplates } from '@/services/formTemplateService';

// Mock data storage
const FORM_TEMPLATES_STORAGE = new Map<string, string[]>();

// Dados de autenticação mockados para demonstração
const MOCK_USERS = [
  {
    email: "admin@esocial.com.br",
    password: "admin123",
    userType: "admin",
    name: "Administrador"
  },
  {
    email: "cliente@empresa.com.br",
    password: "cliente123",
    userType: "cliente",
    name: "Cliente Teste",
    id: "client-001",
    plano: "Premium",
    situacao: "liberado"
  }
];

// Clientes mockados para demonstração
const MOCK_CLIENTES: Cliente[] = [
  {
    id: "client-001",
    nome: "Empresa Teste Ltda.",
    email: "cliente@empresa.com.br",
    tipo: "juridica",
    numeroEmpregados: 50,
    dataInclusao: Date.now() - 30 * 24 * 60 * 60 * 1000, // 30 dias atrás
    situacao: "liberado", // liberado, pendente, bloqueado
    cpfCnpj: "12.345.678/0001-90",
    telefone: "(11) 98765-4321",
    endereco: "Rua Exemplo, 123",
    cidade: "São Paulo",
    estado: "SP",
    cep: "01234-567",
    contato: "João Silva",
    formulariosIds: ["form-001", "form-002"]
  },
  {
    id: "client-002",
    nome: "Indústria ABC S/A",
    email: "contato@abc.com.br",
    tipo: "juridica",
    numeroEmpregados: 120,
    dataInclusao: Date.now() - 45 * 24 * 60 * 60 * 1000, // 45 dias atrás
    situacao: "pendente",
    cpfCnpj: "45.678.901/0001-23",
    telefone: "(11) 91234-5678",
    endereco: "Av. Industrial, 500",
    cidade: "Guarulhos",
    estado: "SP",
    cep: "07890-123",
    contato: "Maria Oliveira",
    formulariosIds: ["form-001"]
  },
  {
    id: "client-003",
    nome: "Comércio XYZ Ltda.",
    email: "financeiro@xyz.com.br",
    tipo: "juridica",
    numeroEmpregados: 30,
    dataInclusao: Date.now() - 15 * 24 * 60 * 60 * 1000, // 15 dias atrás
    situacao: "liberado",
    cpfCnpj: "78.901.234/0001-56",
    telefone: "(11) 95555-4444",
    endereco: "Rua Comercial, 789",
    cidade: "Campinas",
    estado: "SP",
    cep: "13012-345",
    contato: "Carlos Santos",
    formulariosIds: ["form-001", "form-003"]
  },
  {
    id: "client-004",
    nome: "Consultoria Omega",
    email: "atendimento@omega.com.br",
    tipo: "juridica",
    numeroEmpregados: 15,
    dataInclusao: Date.now() - 90 * 24 * 60 * 60 * 1000, // 90 dias atrás
    situacao: "bloqueado",
    cpfCnpj: "89.012.345/0001-78",
    telefone: "(11) 97777-8888",
    endereco: "Av. Consultores, 100",
    cidade: "São Paulo",
    estado: "SP",
    cep: "04567-890",
    contato: "Ana Pereira",
    formulariosIds: []
  }
];

// Dados de planos mockados
const MOCK_PLANOS: Plano[] = [
  {
    id: "plano-001",
    nome: "eSocial Brasil (Corporativo)",
    descricao: "Plano exclusivo para clientes ativos da plataforma eSocial Brasil. Todos os recursos liberados por um valor simbólico.",
    valorMensal: 99.90,
    valorImplantacao: 599.00,
    limiteEmpresas: 1,
    empresasIlimitadas: true,
    limiteEmpregados: 1,
    empregadosIlimitados: true,
    dataValidade: null,
    semVencimento: true,
    ativo: true
  },
  {
    id: "plano-002",
    nome: "Profissional (Clientes Externos)",
    descricao: "Plano completo com diagnóstico psicossocial e relatórios de conformidade para pequenas e médias empresas.",
    valorMensal: 199.90,
    valorImplantacao: 1599.00,
    limiteEmpresas: 1,
    empresasIlimitadas: false,
    limiteEmpregados: 100,
    empregadosIlimitados: false,
    dataValidade: Date.now() + 365 * 24 * 60 * 60 * 1000, // 1 ano a partir de agora
    semVencimento: false,
    ativo: true
  },
  {
    id: "plano-003",
    nome: "Plano Gratuito",
    descricao: "Versão limitada para testes e experimentações.",
    valorMensal: 0,
    valorImplantacao: 0,
    limiteEmpresas: 1,
    empresasIlimitadas: false,
    limiteEmpregados: 10,
    empregadosIlimitados: false,
    dataValidade: Date.now() + 30 * 24 * 60 * 60 * 1000, // 30 dias a partir de agora
    semVencimento: false,
    ativo: true
  }
];

// Dados de contratos mockados
const MOCK_CONTRATOS: Contrato[] = [
  {
    id: "contrato-001",
    numero: "CT-2023-001",
    clienteId: "client-001",
    planoId: "plano-001",
    dataInicio: Date.now() - 60 * 24 * 60 * 60 * 1000, // 60 dias atrás
    dataFim: Date.now() + 305 * 24 * 60 * 60 * 1000, // 305 dias a partir de agora
    dataPrimeiroVencimento: Date.now() - 30 * 24 * 60 * 60 * 1000, // 30 dias atrás
    valorMensal: 99.90,
    status: "ativo",
    taxaImplantacao: 599.00,
    observacoes: "Cliente corporativo com acesso total à plataforma.",
    cicloFaturamento: "mensal",
    proximaRenovacao: Date.now() + 305 * 24 * 60 * 60 * 1000, // 305 dias a partir de agora
    ciclosGerados: 2
  },
  {
    id: "contrato-002",
    numero: "CT-2023-002",
    clienteId: "client-002",
    planoId: "plano-002",
    dataInicio: Date.now() - 45 * 24 * 60 * 60 * 1000, // 45 dias atrás
    dataFim: Date.now() + 320 * 24 * 60 * 60 * 1000, // 320 dias a partir de agora
    dataPrimeiroVencimento: Date.now() - 15 * 24 * 60 * 60 * 1000, // 15 dias atrás
    valorMensal: 199.90,
    status: "em-analise",
    taxaImplantacao: 1599.00,
    observacoes: "Aguardando aprovação final do departamento financeiro.",
    cicloFaturamento: "mensal",
    ciclosGerados: 1
  },
  {
    id: "contrato-003",
    numero: "CT-2023-003",
    clienteId: "client-003",
    planoId: "plano-001",
    dataInicio: Date.now() - 30 * 24 * 60 * 60 * 1000, // 30 dias atrás
    dataFim: Date.now() + 335 * 24 * 60 * 60 * 1000, // 335 dias a partir de agora
    dataPrimeiroVencimento: Date.now(), // hoje
    valorMensal: 99.90,
    status: "ativo",
    taxaImplantacao: 599.00,
    observacoes: "Cliente com desconto especial na implantação.",
    cicloFaturamento: "mensal",
    proximaRenovacao: Date.now() + 335 * 24 * 60 * 60 * 1000, // 335 dias a partir de agora
    ciclosGerados: 1
  },
  {
    id: "contrato-004",
    numero: "CT-2023-004",
    clienteId: "client-004",
    planoId: "plano-003",
    dataInicio: Date.now() - 90 * 24 * 60 * 60 * 1000, // 90 dias atrás
    dataFim: Date.now() - 60 * 24 * 60 * 60 * 1000, // 60 dias atrás (expirado)
    dataPrimeiroVencimento: Date.now() - 90 * 24 * 60 * 60 * 1000, // 90 dias atrás
    valorMensal: 0,
    status: "cancelado",
    taxaImplantacao: 0,
    observacoes: "Contrato expirado e não renovado.",
    cicloFaturamento: "mensal",
    ciclosGerados: 1
  }
];

// Dados de faturas mockados
const MOCK_FATURAS: Fatura[] = [
  {
    id: "fatura-001",
    numero: "FAT-2023-001",
    clienteId: "client-001",
    contratoId: "contrato-001",
    dataEmissao: Date.now() - 35 * 24 * 60 * 60 * 1000, // 35 dias atrás
    dataVencimento: Date.now() - 30 * 24 * 60 * 60 * 1000, // 30 dias atrás
    valor: 699.90, // valor mensal + implantação
    status: "pago",
    referencia: "04/2023"
  },
  {
    id: "fatura-002",
    numero: "FAT-2023-002",
    clienteId: "client-001",
    contratoId: "contrato-001",
    dataEmissao: Date.now() - 5 * 24 * 60 * 60 * 1000, // 5 dias atrás
    dataVencimento: Date.now() + 5 * 24 * 60 * 60 * 1000, // 5 dias a partir de agora
    valor: 99.90, // apenas valor mensal
    status: "pendente",
    referencia: "05/2023"
  },
  {
    id: "fatura-003",
    numero: "FAT-2023-003",
    clienteId: "client-002",
    contratoId: "contrato-002",
    dataEmissao: Date.now() - 20 * 24 * 60 * 60 * 1000, // 20 dias atrás
    dataVencimento: Date.now() - 15 * 24 * 60 * 60 * 1000, // 15 dias atrás
    valor: 1799.80, // valor mensal + implantação
    status: "pago",
    referencia: "04/2023"
  },
  {
    id: "fatura-004",
    numero: "FAT-2023-004",
    clienteId: "client-003",
    contratoId: "contrato-003",
    dataEmissao: Date.now() - 5 * 24 * 60 * 60 * 1000, // 5 dias atrás
    dataVencimento: Date.now(), // hoje
    valor: 699.90, // valor mensal + implantação
    status: "pendente",
    referencia: "05/2023"
  },
  {
    id: "fatura-005",
    numero: "FAT-2023-005",
    clienteId: "client-004",
    contratoId: "contrato-004",
    dataEmissao: Date.now() - 95 * 24 * 60 * 60 * 1000, // 95 dias atrás
    dataVencimento: Date.now() - 90 * 24 * 60 * 60 * 1000, // 90 dias atrás
    valor: 0, // plano gratuito
    status: "pago",
    referencia: "02/2023"
  }
];

// Função para verificar credenciais de login
export const checkCredentials = (email: string, password: string) => {
  console.log("Verificando credenciais para:", email);
  
  const user = MOCK_USERS.find(
    (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
  );

  if (user) {
    return {
      isValid: true,
      userType: user.userType,
      userData: user.userType === 'cliente' ? {
        id: user.id,
        name: user.name,
        email: user.email,
        plano: user.plano
      } : null
    };
  }

  return { isValid: false };
};

// Cliente Functions
export const getClientes = (): Cliente[] => {
  return MOCK_CLIENTES;
};

export const getClienteById = (clienteId: string): Cliente | undefined => {
  return MOCK_CLIENTES.find(cliente => cliente.id === clienteId);
};

export const addCliente = (cliente: Omit<Cliente, 'id'>): Cliente => {
  const newCliente: Cliente = {
    ...cliente,
    id: `client-${uuidv4().slice(0, 8)}`
  };
  MOCK_CLIENTES.push(newCliente);
  return newCliente;
};

export const updateCliente = (cliente: Cliente): Cliente => {
  const index = MOCK_CLIENTES.findIndex(c => c.id === cliente.id);
  if (index !== -1) {
    MOCK_CLIENTES[index] = cliente;
    return cliente;
  }
  throw new Error(`Cliente com ID ${cliente.id} não encontrado`);
};

export const deleteCliente = (clienteId: string): void => {
  const index = MOCK_CLIENTES.findIndex(c => c.id === clienteId);
  if (index !== -1) {
    MOCK_CLIENTES.splice(index, 1);
  } else {
    throw new Error(`Cliente com ID ${clienteId} não encontrado`);
  }
};

// Plano Functions
export const getPlanos = (): Plano[] => {
  return MOCK_PLANOS;
};

export const getPlanoById = (planoId: string): Plano | undefined => {
  return MOCK_PLANOS.find(plano => plano.id === planoId);
};

export const addPlano = (plano: Omit<Plano, 'id'>): Plano => {
  const newPlano: Plano = {
    ...plano,
    id: `plano-${uuidv4().slice(0, 8)}`
  };
  MOCK_PLANOS.push(newPlano);
  return newPlano;
};

export const updatePlano = (plano: Plano): Plano => {
  const index = MOCK_PLANOS.findIndex(p => p.id === plano.id);
  if (index !== -1) {
    MOCK_PLANOS[index] = plano;
    return plano;
  }
  throw new Error(`Plano com ID ${plano.id} não encontrado`);
};

export const deletePlano = (planoId: string): void => {
  const index = MOCK_PLANOS.findIndex(p => p.id === planoId);
  if (index !== -1) {
    MOCK_PLANOS.splice(index, 1);
  } else {
    throw new Error(`Plano com ID ${planoId} não encontrado`);
  }
};

// Contrato Functions
export const getContratos = (): Contrato[] => {
  return MOCK_CONTRATOS;
};

export const getContratoById = (contratoId: string): Contrato | undefined => {
  return MOCK_CONTRATOS.find(contrato => contrato.id === contratoId);
};

export const addContrato = (contrato: Omit<Contrato, 'id' | 'numero' | 'ciclosGerados'>): Contrato => {
  const contratoCount = MOCK_CONTRATOS.length + 1;
  const currentYear = new Date().getFullYear();
  
  const newContrato: Contrato = {
    ...contrato,
    id: `contrato-${uuidv4().slice(0, 8)}`,
    numero: `CT-${currentYear}-${String(contratoCount).padStart(3, '0')}`,
    ciclosGerados: 0
  };
  
  MOCK_CONTRATOS.push(newContrato);
  gerarFaturas(newContrato);
  return newContrato;
};

export const updateContrato = (contrato: Contrato): Contrato => {
  const index = MOCK_CONTRATOS.findIndex(c => c.id === contrato.id);
  if (index !== -1) {
    MOCK_CONTRATOS[index] = contrato;
    return contrato;
  }
  throw new Error(`Contrato com ID ${contrato.id} não encontrado`);
};

export const deleteContrato = (contratoId: string): void => {
  const index = MOCK_CONTRATOS.findIndex(c => c.id === contratoId);
  if (index !== -1) {
    MOCK_CONTRATOS.splice(index, 1);
    // Remover faturas relacionadas
    const faturasDoContrato = MOCK_FATURAS.filter(f => f.contratoId === contratoId);
    faturasDoContrato.forEach(fatura => {
      deleteFatura(fatura.id);
    });
  } else {
    throw new Error(`Contrato com ID ${contratoId} não encontrado`);
  }
};

export const renovarContrato = (contratoId: string): Contrato => {
  const contrato = getContratoById(contratoId);
  if (!contrato) {
    throw new Error(`Contrato com ID ${contratoId} não encontrado`);
  }
  
  // Calcular nova data de fim baseada em mais 12 ciclos
  const novaDataFim = calcularDataProximaRenovacao(
    new Date(contrato.dataFim),
    contrato.cicloFaturamento,
    12
  );
  
  const contratoAtualizado: Contrato = {
    ...contrato,
    dataFim: novaDataFim,
    proximaRenovacao: novaDataFim
  };
  
  updateContrato(contratoAtualizado);
  return contratoAtualizado;
};

export const calcularDataProximaRenovacao = (
  dataBase: Date,
  cicloFaturamento: CicloFaturamento,
  numeroCiclos: number
): number => {
  let dataFinal = new Date(dataBase);
  
  switch (cicloFaturamento) {
    case "mensal":
      dataFinal.setMonth(dataFinal.getMonth() + numeroCiclos);
      break;
    case "trimestral":
      dataFinal.setMonth(dataFinal.getMonth() + (numeroCiclos * 3));
      break;
    case "anual":
      dataFinal.setFullYear(dataFinal.getFullYear() + numeroCiclos);
      break;
  }
  
  return dataFinal.getTime();
};

// Fatura Functions
export const getFaturas = (): Fatura[] => {
  return MOCK_FATURAS;
};

export const getFaturaById = (faturaId: string): Fatura | undefined => {
  return MOCK_FATURAS.find(fatura => fatura.id === faturaId);
};

export const addFatura = (fatura: Omit<Fatura, 'id' | 'numero'>): Fatura => {
  const faturaCount = MOCK_FATURAS.length + 1;
  const currentYear = new Date().getFullYear();
  
  const newFatura: Fatura = {
    ...fatura,
    id: `fatura-${uuidv4().slice(0, 8)}`,
    numero: `FAT-${currentYear}-${String(faturaCount).padStart(3, '0')}`
  };
  
  MOCK_FATURAS.push(newFatura);
  return newFatura;
};

export const updateFatura = (fatura: Fatura): Fatura => {
  const index = MOCK_FATURAS.findIndex(f => f.id === fatura.id);
  if (index !== -1) {
    MOCK_FATURAS[index] = fatura;
    return fatura;
  }
  throw new Error(`Fatura com ID ${fatura.id} não encontrada`);
};

export const deleteFatura = (faturaId: string): void => {
  const index = MOCK_FATURAS.findIndex(f => f.id === faturaId);
  if (index !== -1) {
    MOCK_FATURAS.splice(index, 1);
  } else {
    throw new Error(`Fatura com ID ${faturaId} não encontrada`);
  }
};

const gerarFaturas = (contrato: Contrato): void => {
  // Adicionar a fatura inicial com valor de implantação + mensalidade
  const valorPrimeiraFatura = contrato.valorMensal + contrato.taxaImplantacao;
  const dataPrimeiroVencimento = new Date(contrato.dataPrimeiroVencimento);
  const dataEmissaoPrimeira = new Date(dataPrimeiroVencimento);
  dataEmissaoPrimeira.setDate(dataEmissaoPrimeira.getDate() - 5);
  
  const primeirafatura = addFatura({
    clienteId: contrato.clienteId,
    contratoId: contrato.id,
    dataEmissao: dataEmissaoPrimeira.getTime(),
    dataVencimento: contrato.dataPrimeiroVencimento,
    valor: valorPrimeiraFatura,
    status: "pendente",
    referencia: `${String(dataPrimeiroVencimento.getMonth() + 1).padStart(2, '0')}/${dataPrimeiroVencimento.getFullYear()}`
  });
};

// Formulários functions
export const getClientFormTemplates = (clienteId: string): string[] => {
  return FORM_TEMPLATES_STORAGE.get(clienteId) || [];
};

export const assignFormTemplatesToClient = (clienteId: string, formTemplateIds: string[]): void => {
  FORM_TEMPLATES_STORAGE.set(clienteId, formTemplateIds);
  
  // Atualizar o cliente também
  const cliente = getClienteById(clienteId);
  if (cliente) {
    cliente.formulariosIds = formTemplateIds;
    updateCliente(cliente);
  }
};

// Dashboard stats
export const getDashboardStats = () => {
  const clientesAtivos = MOCK_CLIENTES.filter(c => c.situacao === 'liberado').length;
  const contratosAtivos = MOCK_CONTRATOS.filter(c => c.status === 'ativo').length;
  const contratosEmAnalise = MOCK_CONTRATOS.filter(c => c.status === 'em-analise').length;
  const contratosCancelados = MOCK_CONTRATOS.filter(c => c.status === 'cancelado').length;
  
  const faturasPagas = MOCK_FATURAS.filter(f => f.status === 'pago').length;
  const faturasPendentes = MOCK_FATURAS.filter(f => f.status === 'pendente').length;
  const faturasAtrasadas = MOCK_FATURAS.filter(f => f.status === 'atrasado').length;
  
  const valorTotalPago = MOCK_FATURAS
    .filter(f => f.status === 'pago')
    .reduce((total, fatura) => total + fatura.valor, 0);
    
  const valorTotalPendente = MOCK_FATURAS
    .filter(f => f.status === 'pendente')
    .reduce((total, fatura) => total + fatura.valor, 0);
    
  const valorTotalAtrasado = MOCK_FATURAS
    .filter(f => f.status === 'atrasado')
    .reduce((total, fatura) => total + fatura.valor, 0);
    
  const valorTotal = valorTotalPago + valorTotalPendente + valorTotalAtrasado;
  
  // Contratos próximos de expirar (que precisam ser renovados)
  const hoje = Date.now();
  const trintaDiasEmMs = 30 * 24 * 60 * 60 * 1000;
  
  const contratosParaRenovar = MOCK_CONTRATOS
    .filter(c => 
      c.status === 'ativo' && 
      c.proximaRenovacao && 
      c.proximaRenovacao - hoje < trintaDiasEmMs
    ).length;
    
  const listaContratosParaRenovar = MOCK_CONTRATOS
    .filter(c => 
      c.status === 'ativo' && 
      c.proximaRenovacao && 
      c.proximaRenovacao - hoje < trintaDiasEmMs
    )
    .map(c => {
      const cliente = getClienteById(c.clienteId);
      return {
        id: c.id,
        numero: c.numero,
        clienteId: c.clienteId,
        clienteNome: cliente ? cliente.nome : 'Cliente não encontrado',
        dataRenovacao: c.proximaRenovacao || 0
      };
    });
  
  return {
    clientesAtivos,
    totalClientes: MOCK_CLIENTES.length,
    contratosAtivos,
    contratosEmAnalise,
    contratosCancelados,
    faturasPagas,
    faturasPendentes,
    faturasAtrasadas,
    valorTotalPago,
    valorTotalPendente,
    valorTotalAtrasado,
    valorTotal,
    contratosParaRenovar,
    listaContratosParaRenovar
  };
};
