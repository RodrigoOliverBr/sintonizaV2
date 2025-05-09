
// Implementação de serviços administrativos para autenticação e gerenciamento de clientes

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
const MOCK_CLIENTES = [
  {
    id: "client-001",
    nome: "Empresa Teste Ltda.",
    email: "cliente@empresa.com.br",
    plano: "Premium",
    situacao: "liberado", // liberado, pendente, bloqueado
    dataContrato: "2023-01-15",
    contato: "João Silva",
    telefone: "(11) 98765-4321"
  },
  {
    id: "client-002",
    nome: "Indústria ABC S/A",
    email: "contato@abc.com.br",
    plano: "Básico",
    situacao: "pendente",
    dataContrato: "2023-02-20",
    contato: "Maria Oliveira",
    telefone: "(11) 91234-5678"
  },
  {
    id: "client-003",
    nome: "Comércio XYZ Ltda.",
    email: "financeiro@xyz.com.br",
    plano: "Enterprise",
    situacao: "liberado",
    dataContrato: "2023-03-10",
    contato: "Carlos Santos",
    telefone: "(11) 95555-4444"
  },
  {
    id: "client-004",
    nome: "Consultoria Omega",
    email: "atendimento@omega.com.br",
    plano: "Premium",
    situacao: "bloqueado",
    dataContrato: "2022-11-05",
    contato: "Ana Pereira",
    telefone: "(11) 97777-8888"
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

// Função para obter lista de clientes
export const getClientes = () => {
  return MOCK_CLIENTES;
};

// Função para obter cliente por ID
export const getClienteById = (clienteId: string) => {
  return MOCK_CLIENTES.find(cliente => cliente.id === clienteId);
};

// Outras funções de gerenciamento de clientes podem ser adicionadas conforme necessário
