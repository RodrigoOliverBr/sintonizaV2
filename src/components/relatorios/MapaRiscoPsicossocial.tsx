
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  RadarChart, 
  PolarGrid, 
  PolarAngleAxis, 
  PolarRadiusAxis, 
  Radar, 
  ResponsiveContainer,
  Tooltip,
  Legend,
  BarChart as RechartBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Cell,
  ReferenceLine
} from "recharts";
import { BarChart } from "@/components/ui/BarChart";
import { getFormResults, getEmployeesByCompany, getDepartmentsByCompany } from "@/services/storageService";
import { formData } from "@/data/formData";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";

// Dados simulados para os gráficos
const dimensoes = [
  "Demandas Psicológicas", 
  "Organização e Gestão do Trabalho", 
  "Trabalho Ativo e Competências", 
  "Apoio Social e Liderança", 
  "Compensação e Reconhecimento", 
  "Dupla Presença", 
  "Assédio Moral e Sexual"
];

// Dados simulados de perguntas para cada dimensão
const perguntasPorDimensao = {
  "Demandas Psicológicas": [
    "Há sobrecarga de trabalho?",
    "O ritmo de trabalho é adequado?",
    "As metas são atingíveis?"
  ],
  "Organização e Gestão do Trabalho": [
    "Os processos são claros?",
    "As decisões são comunicadas adequadamente?",
    "Há participação nas decisões?"
  ],
  "Trabalho Ativo e Competências": [
    "Há autonomia no trabalho?",
    "As habilidades são bem aproveitadas?",
    "Há oportunidades de desenvolvimento?"
  ],
  "Apoio Social e Liderança": [
    "Recebe apoio dos colegas?",
    "A liderança é acessível?",
    "Há feedback construtivo?"
  ],
  "Compensação e Reconhecimento": [
    "A remuneração é adequada?",
    "Há reconhecimento pelo trabalho?",
    "Existem benefícios satisfatórios?"
  ],
  "Dupla Presença": [
    "Consegue conciliar trabalho e vida pessoal?",
    "Há flexibilidade para questões familiares?",
    "O trabalho interfere na vida pessoal?"
  ],
  "Assédio Moral e Sexual": [
    "Há respeito entre colegas?",
    "Existem políticas contra assédio?",
    "Sente-se seguro no ambiente de trabalho?"
  ]
};

const simulatedData = [
  { dimensao: "Demandas Psicológicas", percentual: 72 },
  { dimensao: "Organização e Gestão do Trabalho", percentual: 64 },
  { dimensao: "Trabalho Ativo e Competências", percentual: 45 },
  { dimensao: "Apoio Social e Liderança", percentual: 58 },
  { dimensao: "Compensação e Reconhecimento", percentual: 39 },
  { dimensao: "Dupla Presença", percentual: 51 },
  { dimensao: "Assédio Moral e Sexual", percentual: 22 }
];

const radarData = simulatedData.map(item => ({
  subject: item.dimensao.split(' ')[0], // Usa apenas a primeira palavra para o radar
  A: item.percentual,
  fullMark: 100
}));

const getRiskColor = (value: number) => {
  if (value <= 20) return "#4ade80"; // Verde para valores até 20%
  if (value <= 29) return "#facc15"; // Amarelo para valores entre 21% e 29%
  return "#f87171"; // Vermelho para valores acima de 30%
};

interface MapaRiscoPsicossocialProps {
  companyId: string;
  departmentId: string;
  dateRange: { from?: Date; to?: Date };
}

export default function MapaRiscoPsicossocial({ 
  companyId, 
  departmentId, 
  dateRange 
}: MapaRiscoPsicossocialProps) {
  // Em uma implementação real, você usaria esses parâmetros para filtrar os dados
  
  // Dados por dimensão para o gráfico de barras
  const barData = simulatedData.map(item => ({
    dimensao: item.dimensao,
    percentual: item.percentual
  }));

  // Cores para o gráfico de barras baseado no nível de risco
  const barColors = simulatedData.map(item => getRiskColor(item.percentual));

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Mapa de Risco Psicossocial</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                <PolarGrid />
                <PolarAngleAxis dataKey="subject" />
                <PolarRadiusAxis angle={30} domain={[0, 100]} />
                <Radar
                  name="Nível de Risco"
                  dataKey="A"
                  stroke="#8884d8"
                  fill="#8884d8"
                  fillOpacity={0.6}
                />
                <Tooltip formatter={(value) => [`${value}%`, "Nível de Risco"]} />
                <Legend />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Percentual de Respostas Positivas por Dimensão</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <RechartBarChart
                data={barData}
                layout="vertical"
                margin={{ top: 20, right: 30, left: 150, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
                <XAxis 
                  type="number" 
                  domain={[0, 100]} 
                  ticks={[0, 20, 30, 50, 70, 90, 100]} 
                />
                <YAxis 
                  dataKey="dimensao" 
                  type="category" 
                  width={140}
                  tick={{ fontSize: 12 }}
                />
                <Tooltip formatter={(value) => [`${value}%`, "Respostas Positivas"]} />
                <ReferenceLine x={20} stroke="#4ade80" strokeWidth={2} strokeDasharray="3 3" label={{ value: "20%", position: "top" }} />
                <ReferenceLine x={30} stroke="#f87171" strokeWidth={2} strokeDasharray="3 3" label={{ value: "30%", position: "top" }} />
                <Bar dataKey="percentual" radius={[0, 4, 4, 0]}>
                  {barData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={getRiskColor(entry.percentual)} />
                  ))}
                </Bar>
              </RechartBarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card className="lg:col-span-2">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Análise por Dimensão e Setor (Mapa de Calor)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table className="w-full">
              <TableHeader>
                <TableRow>
                  <TableHead className="min-w-[250px]">Dimensão / Pergunta</TableHead>
                  {getDepartmentsByCompany(companyId).map(dept => (
                    <TableHead key={dept.id} className="text-center">
                      {dept.name}
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {dimensoes.map((dimensao, dimIdx) => {
                  const perguntas = perguntasPorDimensao[dimensao as keyof typeof perguntasPorDimensao] || [];
                  return (
                    <React.Fragment key={dimensao}>
                      <TableRow className="bg-muted/30 font-medium">
                        <TableCell colSpan={getDepartmentsByCompany(companyId).length + 1}>
                          {dimensao}
                        </TableCell>
                      </TableRow>
                      {perguntas.map((pergunta, qIdx) => (
                        <TableRow key={`${dimensao}-${qIdx}`}>
                          <TableCell className="pl-8 text-sm">
                            {pergunta}
                          </TableCell>
                          {getDepartmentsByCompany(companyId).map(dept => {
                            const randomValue = Math.floor(Math.random() * 100);
                            return (
                              <TableCell key={dept.id} className="text-center">
                                <div className="flex items-center justify-center">
                                  <div 
                                    className="w-8 h-8 rounded-full mr-2" 
                                    style={{ backgroundColor: getRiskColor(randomValue) }}
                                  />
                                  <span>{randomValue}%</span>
                                </div>
                              </TableCell>
                            );
                          })}
                        </TableRow>
                      ))}
                    </React.Fragment>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
