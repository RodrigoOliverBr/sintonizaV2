
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { EyeIcon, RefreshCcw } from "lucide-react";
import { getEmployeesByCompany, getDepartmentById } from "@/services/storageService";
import { Employee } from "@/types/cadastro";

interface DiagnosticoIndividualProps {
  companyId: string;
  departmentId: string;
  dateRange: { from?: Date; to?: Date };
}

interface EmployeeWithRisk extends Employee {
  riskScore: number;
  riskStatus: "Crítico" | "Atenção" | "Baixo Risco";
  lastEvaluation?: string;
}

const DiagnosticoIndividual: React.FC<DiagnosticoIndividualProps> = ({
  companyId,
  departmentId,
  dateRange,
}) => {
  const [employees, setEmployees] = useState<EmployeeWithRisk[]>([]);
  const [counters, setCounters] = useState({
    critical: 0,
    attention: 0,
    lowRisk: 0,
  });

  useEffect(() => {
    if (!companyId) return;

    // Buscar funcionários
    const fetchedEmployees = getEmployeesByCompany(companyId);
    
    // Filtrar por departamento se necessário
    const filteredEmployees = departmentId
      ? fetchedEmployees.filter(emp => emp.departmentId === departmentId)
      : fetchedEmployees;
    
    // Adicionar dados de risco simulados para cada funcionário
    const employeesWithRisk = filteredEmployees.map(emp => {
      // Gerar um score aleatório entre 0 e 100
      const riskScore = Math.floor(Math.random() * 101);
      
      // Determinar o status baseado no score
      let riskStatus: "Crítico" | "Atenção" | "Baixo Risco";
      if (riskScore >= 70) {
        riskStatus = "Crítico";
      } else if (riskScore >= 50) {
        riskStatus = "Atenção";
      } else {
        riskStatus = "Baixo Risco";
      }
      
      // Gerar uma data aleatória para a última avaliação
      const today = new Date();
      const randomDaysAgo = Math.floor(Math.random() * 90) + 1; // 1-90 dias atrás
      const lastEvalDate = new Date(today);
      lastEvalDate.setDate(today.getDate() - randomDaysAgo);
      const lastEvaluation = lastEvalDate.toLocaleDateString('pt-BR');
      
      return {
        ...emp,
        riskScore,
        riskStatus,
        lastEvaluation
      };
    });
    
    setEmployees(employeesWithRisk);
    
    // Calcular contadores
    const critical = employeesWithRisk.filter(emp => emp.riskStatus === "Crítico").length;
    const attention = employeesWithRisk.filter(emp => emp.riskStatus === "Atenção").length;
    const lowRisk = employeesWithRisk.filter(emp => emp.riskStatus === "Baixo Risco").length;
    
    setCounters({
      critical,
      attention,
      lowRisk
    });
  }, [companyId, departmentId]);

  const getBadgeVariant = (status: string) => {
    switch (status) {
      case "Crítico":
        return "destructive";
      case "Atenção":
        return "warning";
      case "Baixo Risco":
        return "success";
      default:
        return "secondary";
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-red-50 border-red-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg text-red-700">Empregados Críticos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-red-700">{counters.critical}</div>
            <p className="text-sm text-red-600">Score ≥ 70%</p>
          </CardContent>
        </Card>
        
        <Card className="bg-yellow-50 border-yellow-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg text-yellow-700">Empregados em Atenção</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-yellow-700">{counters.attention}</div>
            <p className="text-sm text-yellow-600">Score entre 50% e 69%</p>
          </CardContent>
        </Card>
        
        <Card className="bg-green-50 border-green-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg text-green-700">Empregados em Baixo Risco</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-700">{counters.lowRisk}</div>
            <p className="text-sm text-green-600">Score < 50%</p>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Diagnóstico Individual dos Empregados</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Departamento</TableHead>
                <TableHead>Cargo</TableHead>
                <TableHead>Score</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Última Avaliação</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {employees.map((employee) => {
                // Obter o nome do departamento
                const department = getDepartmentById(employee.departmentId);
                
                return (
                  <TableRow key={employee.id}>
                    <TableCell className="font-medium">{employee.name}</TableCell>
                    <TableCell>{department?.name || "Não definido"}</TableCell>
                    <TableCell>{employee.role}</TableCell>
                    <TableCell>{employee.riskScore}%</TableCell>
                    <TableCell>
                      <Badge variant={getBadgeVariant(employee.riskStatus)}>
                        {employee.riskStatus}
                      </Badge>
                    </TableCell>
                    <TableCell>{employee.lastEvaluation}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="outline" size="sm">
                        <EyeIcon className="h-4 w-4 mr-1" />
                        Ver Detalhes
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
              
              {employees.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} className="h-24 text-center">
                    Nenhum empregado encontrado para os filtros selecionados.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default DiagnosticoIndividual;
