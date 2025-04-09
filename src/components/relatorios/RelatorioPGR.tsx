
import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { AlertCircle, Clock, FileDown } from "lucide-react";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue, 
} from "@/components/ui/select";
import { getCompanyById, getJobRolesByCompany } from "@/services/storageService";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { SeverityLevel } from "@/types/form";

interface RelatorioPGRProps {
  companyId: string;
  departmentId: string;
  dateRange: { from?: Date; to?: Date };
}

// Status possíveis para as ações
type ActionStatus = 'pending' | 'monitoring' | 'implementing' | 'resolved';

// Interface para representar um risco no PGR
interface RiscoItem {
  id: string;
  risco: string;
  descricao: string;
  nivelRisco: number;
  status: ActionStatus;
  probabilidade: 'baixa' | 'média' | 'alta';
  severidade: SeverityLevel;
  funcoes: string[];
  medidasControle: string[];
  prazo: string;
  responsaveis: string;
  dimensao: string;
}

export default function RelatorioPGR({
  companyId,
  departmentId,
  dateRange
}: RelatorioPGRProps) {
  const company = getCompanyById(companyId);
  const dataEmissao = new Date();
  const jobRoles = getJobRolesByCompany ? getJobRolesByCompany(companyId) : [];
  
  // Estado para armazenar o responsável editável
  const [responsaveis, setResponsaveis] = useState<Record<string, string>>({});
  
  // Estado para armazenar o prazo selecionado para cada risco
  const [prazos, setPrazos] = useState<Record<string, string>>({});
  
  // Estado para armazenar as medidas de controle editáveis
  const [medidasControle, setMedidasControle] = useState<Record<string, string[]>>({});
  
  // Função para atualizar o responsável de um risco específico
  const handleResponsavelChange = (riscoId: string, value: string) => {
    setResponsaveis(prev => ({
      ...prev,
      [riscoId]: value
    }));
  };
  
  // Função para atualizar o prazo de um risco específico
  const handlePrazoChange = (riscoId: string, value: string) => {
    setPrazos(prev => ({
      ...prev,
      [riscoId]: value
    }));
  };
  
  // Função para atualizar as medidas de controle
  const handleMedidasControleChange = (riscoId: string, value: string) => {
    const medidas = value.split('\n').filter(item => item.trim() !== '');
    setMedidasControle(prev => ({
      ...prev,
      [riscoId]: medidas
    }));
  };
  
  // Opções de prazo
  const prazoOptions = [
    { value: "30 dias", label: "30 dias" },
    { value: "60 dias", label: "60 dias" },
    { value: "90 dias", label: "90 dias" },
    { value: "6 meses", label: "6 meses" },
    { value: "9 meses", label: "9 meses" },
    { value: "12 meses", label: "12 meses" },
  ];
  
  // Dados simulados de riscos psicossociais para o PGR
  const riscos: RiscoItem[] = [
    {
      id: "1",
      risco: "Sobrecarga de trabalho",
      descricao: "Excesso de demandas, prazos exíguos e pressão por resultados",
      nivelRisco: 75,
      status: 'implementing',
      probabilidade: 'alta',
      severidade: 'PREJUDICIAL',
      funcoes: ['Desenvolvedores', 'Analistas', 'Gerentes de Projetos'],
      medidasControle: [
        "Revisão de prazos e metas",
        "Distribuição equilibrada de tarefas",
        "Contratação de pessoal adicional",
        "Treinamento em gestão do tempo"
      ],
      prazo: "30 dias",
      responsaveis: "RH, Gerência",
      dimensao: "Exigências Quantitativas"
    },
    {
      id: "2",
      risco: "Falta de Clareza nas Atribuições",
      descricao: "Empregados sem orientações claras sobre suas responsabilidades e atribuições",
      nivelRisco: 68,
      status: 'monitoring',
      probabilidade: 'média',
      severidade: 'LEVEMENTE PREJUDICIAL',
      funcoes: ['Administrativo', 'Suporte', 'Novos Funcionários'],
      medidasControle: [
        "Definir claramente as responsabilidades e atribuições através de documentação",
        "Oferecer treinamento regular sobre funções e expectativas relacionadas a cada cargo",
        "Criar canais diretos para esclarecer dúvidas ou solicitar orientações adicionais"
      ],
      prazo: "45 dias",
      responsaveis: "Gerência de RH, Departamento Jurídico",
      dimensao: "Influência no Trabalho"
    },
    {
      id: "3",
      risco: "Desrespeito e Desvalorização Profissional",
      descricao: "Expressões ou atitudes que fazem os empregados se sentirem desrespeitados ou desvalorizados",
      nivelRisco: 55,
      status: 'pending',
      probabilidade: 'média',
      severidade: 'PREJUDICIAL',
      funcoes: ['Atendimento', 'Operacional', 'Suporte'],
      medidasControle: [
        "Realizar treinamento regular para líderes sobre comunicação não violenta",
        "Criar um canal confidencial para relatos e denúncias de desrespeito",
        "Implementar reuniões periódicas para acompanhamento e feedback construtivo"
      ],
      prazo: "60 dias",
      responsaveis: "Gerência de RH, Diretoria",
      dimensao: "Justiça e Respeito"
    },
    {
      id: "4",
      risco: "Assédio Moral e Sexual",
      descricao: "Situações de assédio moral ou sexual dentro da empresa",
      nivelRisco: 40,
      status: 'resolved',
      probabilidade: 'baixa',
      severidade: 'EXTREMAMENTE PREJUDICIAL',
      funcoes: ['Todos os Funcionários'],
      medidasControle: [
        "Implementação de política rigorosa de combate ao assédio sexual e moral",
        "Treinamentos obrigatórios sobre prevenção de assédio para todos os níveis hierárquicos",
        "Canal confidencial para denúncias com garantia de proteção a denunciantes"
      ],
      prazo: "Contínuo",
      responsaveis: "Comitê de Ética, Gerência de RH, Departamento Jurídico",
      dimensao: "Justiça e Respeito"
    }
  ];
  
  // Ordenar riscos por nível (do mais grave ao menos grave)
  const riscosSorted = [...riscos].sort((a, b) => b.nivelRisco - a.nivelRisco);
  
  // Função para obter a cor de fundo com base na probabilidade
  const getProbabilidadeBadgeClass = (prob: string) => {
    switch (prob.toLowerCase()) {
      case 'alta': return "bg-red-100 text-red-800 border-red-200";
      case 'média': return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case 'baixa': return "bg-green-100 text-green-800 border-green-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };
  
  // Função para obter a cor de fundo com base na severidade
  const getSeveridadeBadgeClass = (sev: SeverityLevel) => {
    switch (sev) {
      case 'EXTREMAMENTE PREJUDICIAL': return "bg-red-100 text-red-800 border-red-200";
      case 'PREJUDICIAL': return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case 'LEVEMENTE PREJUDICIAL': return "bg-green-100 text-green-800 border-green-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };
  
  // Função para obter a cor e ícone do status
  const getStatusBadgeClass = (status: ActionStatus) => {
    switch (status) {
      case 'implementing': return {
        class: "bg-yellow-100 text-yellow-800 border-yellow-200",
        label: "Implementando"
      };
      case 'monitoring': return {
        class: "bg-blue-100 text-blue-800 border-blue-200",
        label: "Monitorando"
      };
      case 'pending': return {
        class: "bg-gray-100 text-gray-800 border-gray-200",
        label: "Pendente"
      };
      case 'resolved': return {
        class: "bg-green-100 text-green-800 border-green-200",
        label: "Resolvido"
      };
    }
  };
  
  // Função para obter a classe de cor com base no nível de risco
  const getRiskBadgeClass = (level: number) => {
    if (level >= 70) return "bg-red-100 text-red-700 border-red-200";
    if (level >= 50) return "bg-yellow-100 text-yellow-700 border-yellow-200";
    return "bg-green-100 text-green-700 border-green-200";
  };
  
  // Função para criar o texto das medidas de controle para exibir no textarea
  const getMedidasControleText = (riscoId: string, medidasOriginais: string[]) => {
    // Se já houver medidas editadas pelo usuário, retorna as editadas
    if (medidasControle[riscoId]) {
      return medidasControle[riscoId].join('\n');
    }
    // Senão, retorna as medidas originais
    return medidasOriginais.join('\n');
  };
  
  const exportPGR = () => {
    console.log("Exportando relatório PGR para PDF");
    // Implementação da exportação para PDF
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold">Programa de Gerenciamento de Riscos Psicossociais</h2>
          <p className="text-gray-500">ISTAS21-BR - Avaliação de Riscos Psicossociais (NR-01)</p>
        </div>
        <Button onClick={exportPGR}>
          <FileDown className="mr-2 h-4 w-4" />
          Exportar PDF
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6 bg-gray-50 p-4 rounded-lg">
        <div>
          <h3 className="text-sm font-medium text-gray-500">Empresa</h3>
          <p className="text-lg font-semibold">{company?.name || "Empresa não selecionada"}</p>
        </div>
        
        <div>
          <h3 className="text-sm font-medium text-gray-500">Período de Avaliação</h3>
          <p className="text-lg font-semibold">
            {dateRange.from && dateRange.to 
              ? `${format(dateRange.from, "dd/MM/yyyy", { locale: ptBR })} a ${format(dateRange.to, "dd/MM/yyyy", { locale: ptBR })}`
              : "Período completo"}
          </p>
        </div>
        
        <div>
          <h3 className="text-sm font-medium text-gray-500">Data de Emissão</h3>
          <p className="text-lg font-semibold">{format(dataEmissao, "dd/MM/yyyy", { locale: ptBR })}</p>
        </div>
        
        <div>
          <h3 className="text-sm font-medium text-gray-500">Metodologia</h3>
          <p className="text-lg font-semibold">ISTAS21-BR (NR-01)</p>
        </div>
      </div>

      {riscosSorted.map((risco) => (
        <Card key={risco.id} className="mb-6 overflow-hidden border-l-4" style={{ borderLeftColor: risco.nivelRisco >= 70 ? '#f87171' : risco.nivelRisco >= 50 ? '#facc15' : '#4ade80' }}>
          <CardContent className="p-0">
            <div className="p-6">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="text-xl font-bold">{risco.risco}</h3>
                  <p className="text-gray-600">{risco.descricao}</p>
                </div>
                <div className={`px-3 py-1 rounded-full text-sm font-medium flex items-center ${getRiskBadgeClass(risco.nivelRisco)}`}>
                  <AlertCircle className="h-4 w-4 mr-1" />
                  {risco.nivelRisco >= 70 ? "Alto" : risco.nivelRisco >= 50 ? "Médio" : "Baixo"}
                </div>
              </div>
              
              <div className="mt-4">
                <h4 className="text-sm font-semibold mb-2">Funções Expostas:</h4>
                <div className="flex flex-wrap gap-2">
                  {risco.funcoes.map((funcao, idx) => (
                    <span 
                      key={idx} 
                      className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 border border-blue-200"
                    >
                      {funcao}
                    </span>
                  ))}
                </div>
              </div>
              
              <div className="mt-6">
                <h4 className="text-sm font-semibold mb-3">Análise de Risco:</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="border rounded-lg p-4 flex flex-col items-center justify-center">
                    <p className="text-gray-500 mb-2">Probabilidade</p>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getProbabilidadeBadgeClass(risco.probabilidade)}`}>
                      {risco.probabilidade.charAt(0).toUpperCase() + risco.probabilidade.slice(1)}
                    </span>
                  </div>
                  
                  <div className="border rounded-lg p-4 flex flex-col items-center justify-center">
                    <p className="text-gray-500 mb-2">Severidade</p>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getSeveridadeBadgeClass(risco.severidade)}`}>
                      {risco.severidade === 'EXTREMAMENTE PREJUDICIAL' ? 'Alta' : 
                       risco.severidade === 'PREJUDICIAL' ? 'Média' : 'Baixa'}
                    </span>
                  </div>
                  
                  <div className="border rounded-lg p-4 flex flex-col items-center justify-center">
                    <p className="text-gray-500 mb-2">Status Atual</p>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusBadgeClass(risco.status).class}`}>
                      {getStatusBadgeClass(risco.status).label}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="mt-6">
                <h4 className="text-sm font-semibold mb-2">Medidas de Controle:</h4>
                <Textarea 
                  value={getMedidasControleText(risco.id, risco.medidasControle)}
                  onChange={(e) => handleMedidasControleChange(risco.id, e.target.value)}
                  className="min-h-[120px] w-full mt-2"
                  placeholder="Adicione medidas de controle separadas por linha"
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                <div>
                  <h4 className="text-sm font-semibold mb-2 flex items-center">
                    <Clock className="h-4 w-4 mr-1 text-gray-500" />
                    Prazo para Implementação:
                  </h4>
                  <Select 
                    value={prazos[risco.id] || risco.prazo}
                    onValueChange={(value) => handlePrazoChange(risco.id, value)}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Selecione um prazo" />
                    </SelectTrigger>
                    <SelectContent>
                      {prazoOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <h4 className="text-sm font-semibold mb-2">Responsáveis:</h4>
                  <Input 
                    value={responsaveis[risco.id] || risco.responsaveis} 
                    onChange={(e) => handleResponsavelChange(risco.id, e.target.value)}
                    placeholder="Adicionar responsáveis"
                    className="w-full"
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
      
      <div className="text-right text-sm text-gray-500 mt-4">
        <p><span className="font-medium">Responsável Técnico:</span> Coordenador de Segurança e Saúde Ocupacional</p>
      </div>
    </div>
  );
}
