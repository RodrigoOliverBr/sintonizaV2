
import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { CheckCircle, Circle, Download, FileDown, FileText } from "lucide-react";
import { getCompanyById } from "@/services/storageService";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

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
  severidade: 'LEVEMENTE PREJUDICIAL' | 'PREJUDICIAL' | 'EXTREMAMENTE PREJUDICIAL';
  setores: string[];
  medidasControle: string[];
  prazo: string;
  responsaveis: string[];
}

export default function RelatorioPGR({
  companyId,
  departmentId,
  dateRange
}: RelatorioPGRProps) {
  const company = getCompanyById(companyId);
  const dataEmissao = new Date();
  
  // Dados simulados de riscos psicossociais para o PGR
  const riscos: RiscoItem[] = [
    {
      id: "1",
      risco: "Pressão por Metas e Produtividade",
      descricao: "Excesso de pressão para cumprimento de metas consideradas difíceis ou impossíveis.",
      nivelRisco: 75,
      status: 'implementing',
      probabilidade: 'alta',
      severidade: 'PREJUDICIAL',
      setores: ['Comercial', 'Atendimento', 'Vendas'],
      medidasControle: [
        "Reavaliar as metas e prazos definidos, ajustando-os para níveis alcançáveis.",
        "Oferecer suporte direto por meio de reuniões periódicas para acompanhamento.",
        "Disponibilizar recursos adicionais ou treinamento específico."
      ],
      prazo: "30/07/2025",
      responsaveis: ["Gerência de RH", "Coordenadores de Equipe"]
    },
    {
      id: "2",
      risco: "Falta de Clareza nas Atribuições",
      descricao: "Empregados sem orientações claras sobre suas responsabilidades e atribuições.",
      nivelRisco: 68,
      status: 'monitoring',
      probabilidade: 'média',
      severidade: 'LEVEMENTE PREJUDICIAL',
      setores: ['Administrativo', 'Operacional'],
      medidasControle: [
        "Definir claramente as responsabilidades e atribuições através de documentação.",
        "Oferecer treinamento regular sobre funções e expectativas relacionadas a cada cargo.",
        "Criar canais diretos para esclarecer dúvidas ou solicitar orientações adicionais."
      ],
      prazo: "15/06/2025",
      responsaveis: ["Gerência de RH", "Departamento Jurídico"]
    },
    {
      id: "3",
      risco: "Desrespeito e Desvalorização Profissional",
      descricao: "Expressões ou atitudes que fazem os empregados se sentirem desrespeitados ou desvalorizados.",
      nivelRisco: 55,
      status: 'pending',
      probabilidade: 'média',
      severidade: 'PREJUDICIAL',
      setores: ['Geral'],
      medidasControle: [
        "Realizar treinamento regular para líderes sobre comunicação não violenta.",
        "Criar um canal confidencial para relatos e denúncias de desrespeito.",
        "Implementar reuniões periódicas para acompanhamento e feedback construtivo."
      ],
      prazo: "30/08/2025",
      responsaveis: ["Gerência de RH", "Diretoria"]
    },
    {
      id: "4",
      risco: "Assédio Moral e Sexual",
      descricao: "Situações de assédio moral ou sexual dentro da empresa.",
      nivelRisco: 40,
      status: 'resolved',
      probabilidade: 'baixa',
      severidade: 'EXTREMAMENTE PREJUDICIAL',
      setores: ['Geral'],
      medidasControle: [
        "Implementação de política rigorosa de combate ao assédio sexual e moral.",
        "Treinamentos obrigatórios sobre prevenção de assédio para todos os níveis hierárquicos.",
        "Canal confidencial para denúncias com garantia de proteção a denunciantes."
      ],
      prazo: "Contínuo",
      responsaveis: ["Comitê de Ética", "Gerência de RH", "Departamento Jurídico"]
    }
  ];
  
  // Ordenar riscos por nível (do mais grave ao menos grave)
  const riscosSorted = [...riscos].sort((a, b) => b.nivelRisco - a.nivelRisco);
  
  // Função para obter a classe de cor com base no nível de risco
  const getRiskColorClass = (level: number) => {
    if (level >= 70) return "text-red-600";
    if (level >= 50) return "text-yellow-600";
    return "text-green-600";
  };
  
  // Função para obter o texto do status da ação
  const getStatusText = (status: ActionStatus) => {
    switch (status) {
      case 'pending': return "Pendente";
      case 'monitoring': return "Monitorando";
      case 'implementing': return "Implementando";
      case 'resolved': return "Resolvido";
    }
  };
  
  // Função para obter a cor do status
  const getStatusColor = (status: ActionStatus) => {
    switch (status) {
      case 'pending': return "bg-gray-100 text-gray-800";
      case 'monitoring': return "bg-blue-100 text-blue-800";
      case 'implementing': return "bg-yellow-100 text-yellow-800";
      case 'resolved': return "bg-green-100 text-green-800";
    }
  };
  
  const exportPGR = () => {
    console.log("Exportando relatório PGR para PDF");
    // Implementação da exportação para PDF
  };
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="pb-2">
          <div className="flex justify-between items-start">
            <div>
              <CardTitle>Programa de Gerenciamento de Riscos Psicossociais</CardTitle>
              <CardDescription>ISTAS21-BR - Avaliação de Riscos Psicossociais (NR-01)</CardDescription>
            </div>
            <Button onClick={exportPGR}>
              <FileDown className="mr-2 h-4 w-4" />
              Exportar PDF
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
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
          
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Perigo Psicossocial</TableHead>
                <TableHead>Nível de Risco</TableHead>
                <TableHead>Status da Ação</TableHead>
                <TableHead className="text-right">Detalhes</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {riscosSorted.map((risco) => (
                <TableRow key={risco.id}>
                  <TableCell>
                    <div>
                      <p className="font-medium">{risco.risco}</p>
                      <p className="text-sm text-gray-500">{risco.descricao}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className={`font-medium ${getRiskColorClass(risco.nivelRisco)}`}>
                      {risco.nivelRisco}%
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(risco.status)}`}>
                      {risco.status === 'resolved' && <CheckCircle className="h-3 w-3 mr-1" />}
                      {risco.status === 'implementing' && <Circle className="h-3 w-3 mr-1" />}
                      {getStatusText(risco.status)}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button size="sm" variant="ghost" className="text-gray-500 hover:text-gray-700" asChild>
                      <Accordion type="single" collapsible className="w-full">
                        <AccordionItem value={`item-${risco.id}`} className="border-0">
                          <AccordionTrigger className="py-0">Ver detalhes</AccordionTrigger>
                          <AccordionContent>
                            <div className="bg-gray-50 p-4 rounded-md mt-2 text-left">
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                <div>
                                  <h4 className="text-sm font-medium text-gray-500">Setores e Funções Expostos</h4>
                                  <div className="mt-1">
                                    {risco.setores.map((setor, idx) => (
                                      <span 
                                        key={idx} 
                                        className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full mr-1 mb-1"
                                      >
                                        {setor}
                                      </span>
                                    ))}
                                  </div>
                                </div>
                                
                                <div>
                                  <h4 className="text-sm font-medium text-gray-500">Análise de Risco</h4>
                                  <p className="text-sm mt-1">
                                    <span className="font-medium">Probabilidade:</span> {risco.probabilidade}
                                  </p>
                                  <p className="text-sm">
                                    <span className="font-medium">Severidade:</span> {risco.severidade}
                                  </p>
                                </div>
                              </div>
                              
                              <div className="mb-4">
                                <h4 className="text-sm font-medium text-gray-500">Medidas de Controle</h4>
                                <ul className="list-disc pl-5 mt-1">
                                  {risco.medidasControle.map((medida, idx) => (
                                    <li key={idx} className="text-sm">{medida}</li>
                                  ))}
                                </ul>
                              </div>
                              
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                  <h4 className="text-sm font-medium text-gray-500">Prazo para Implementação</h4>
                                  <p className="text-sm font-medium">{risco.prazo}</p>
                                </div>
                                
                                <div>
                                  <h4 className="text-sm font-medium text-gray-500">Responsáveis</h4>
                                  <p className="text-sm">{risco.responsaveis.join(", ")}</p>
                                </div>
                              </div>
                            </div>
                          </AccordionContent>
                        </AccordionItem>
                      </Accordion>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
        <CardFooter className="border-t pt-4">
          <p className="text-sm text-gray-500">
            <span className="font-medium">Responsável Técnico:</span> Coordenador de Segurança e Saúde Ocupacional
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
