
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StoredFormResult } from "@/services/storageService";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Employee } from "@/types/cadastro";
import { SeverityLevel } from "@/types/form";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";
import { saveFormResult } from "@/services/storageService";
import { useToast } from "@/components/ui/use-toast";

interface FormResultSummaryProps {
  result: StoredFormResult;
  employee: Employee;
}

const FormResultSummary: React.FC<FormResultSummaryProps> = ({ result, employee }) => {
  const [analystNotes, setAnalystNotes] = useState(result.analyistNotes || "");
  const { toast } = useToast();

  const handleSaveNotes = () => {
    const updatedResult = {
      ...result,
      analyistNotes: analystNotes
    };
    
    saveFormResult(result.employeeId, updatedResult, result.formTemplateId);
    
    toast({
      title: "Observações salvas",
      description: "As observações do analista foram salvas com sucesso.",
    });
  };

  // Preparar dados para o gráfico de pizza
  const pieData = [
    { name: "Sim", value: result.totalYes, color: "#FF8C00" },
    { name: "Não", value: result.totalNo, color: "#22C55E" }
  ];

  // Preparar dados para a tabela de severidade
  const severityData = Object.keys(result.severityCounts).map((severity) => ({
    severity: severity as SeverityLevel,
    total: result.severityCounts[severity as SeverityLevel],
    yesCount: result.yesPerSeverity[severity as SeverityLevel],
    yesPercentage: result.severityCounts[severity as SeverityLevel] > 0
      ? Math.round((result.yesPerSeverity[severity as SeverityLevel] / result.severityCounts[severity as SeverityLevel]) * 100)
      : 0
  }));
  
  // Função para obter a classe CSS com base na porcentagem
  const getPercentClass = (percentage: number) => {
    if (percentage >= 70) return "bg-red-100 text-red-800";
    if (percentage >= 40) return "bg-yellow-100 text-yellow-800";
    return "bg-green-100 text-green-800";
  };
  
  // Função para obter o nome legível da severidade
  const getSeverityName = (severity: SeverityLevel): string => {
    switch (severity) {
      case "LEVEMENTE PREJUDICIAL":
        return "Leve";
      case "PREJUDICIAL":
        return "Médio";
      case "EXTREMAMENTE PREJUDICIAL":
        return "Grave";
      default:
        return severity;
    }
  };

  return (
    <div className="space-y-6 mt-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Resumo de Respostas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center mb-4">
              <div className="flex justify-center items-center h-[220px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      nameKey="name"
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [`${value} respostas`, ""]} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="grid grid-cols-2 gap-4 mt-4">
                <div className="bg-gray-100 p-4 rounded-lg text-center">
                  <p className="text-sm text-gray-600">Total Sim</p>
                  <p className="text-2xl font-bold">{result.totalYes}</p>
                </div>
                <div className="bg-gray-100 p-4 rounded-lg text-center">
                  <p className="text-sm text-gray-600">Total Não</p>
                  <p className="text-2xl font-bold">{result.totalNo}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Análise por Severidade</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Severidade</TableHead>
                  <TableHead>Sim</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>%</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {severityData.map((item) => (
                  <TableRow key={item.severity}>
                    <TableCell className="font-medium">{getSeverityName(item.severity)}</TableCell>
                    <TableCell>{item.yesCount}</TableCell>
                    <TableCell>{item.total}</TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-xs ${getPercentClass(item.yesPercentage)}`}>
                        {item.yesPercentage}%
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Observações do Analista</CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea
            value={analystNotes}
            onChange={(e) => setAnalystNotes(e.target.value)}
            placeholder="Digite aqui suas observações sobre os resultados deste funcionário..."
            className="min-h-[150px]"
          />
          <div className="flex justify-end mt-4">
            <Button onClick={handleSaveNotes}>
              Salvar Observações
            </Button>
          </div>
        </CardContent>
      </Card>
      
      <div className="bg-blue-50 border border-blue-200 rounded-md p-4 mt-6">
        <h3 className="text-blue-800 font-medium mb-2">Informações do Funcionário</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-500">Nome</p>
            <p className="font-medium">{employee.name}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">E-mail</p>
            <p className="font-medium">{employee.email}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Cargo</p>
            <p className="font-medium">{employee.jobTitle}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Data da Avaliação</p>
            <p className="font-medium">{new Date(result.lastUpdated).toLocaleDateString('pt-BR')}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FormResultSummary;
