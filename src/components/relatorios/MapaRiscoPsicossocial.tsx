
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
  Legend
} from "recharts";
import { BarChart } from "@/components/ui/BarChart";
import { getFormResults, getEmployeesByCompany, getDepartmentsByCompany } from "@/services/storageService";
import { formData } from "@/data/formData";

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
            <BarChart
              data={barData}
              index="dimensao"
              categories={["percentual"]}
              colors={barColors}
              valueFormatter={(value) => `${value}%`}
              className="h-full"
            />
          </div>
        </CardContent>
      </Card>

      <Card className="lg:col-span-2">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Análise por Dimensão e Setor (Mapa de Calor)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Dimensão / Setor
                  </th>
                  {getDepartmentsByCompany(companyId).map(dept => (
                    <th key={dept.id} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {dept.name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {dimensoes.map((dimensao, idx) => (
                  <tr key={dimensao}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {dimensao}
                    </td>
                    {getDepartmentsByCompany(companyId).map(dept => {
                      const randomValue = Math.floor(Math.random() * 100);
                      return (
                        <td key={dept.id} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <div className="flex items-center">
                            <div className="w-8 h-8 rounded-full mr-2" style={{ backgroundColor: getRiskColor(randomValue) }}></div>
                            <span>{randomValue}%</span>
                          </div>
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
