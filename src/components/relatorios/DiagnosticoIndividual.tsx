
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getEmployeesByCompany, getJobRoles } from "@/services/storageService";
import { Employee } from "@/types/cadastro";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { FileText } from "lucide-react";

interface DiagnosticoIndividualProps {
  companyId: string;
  departmentId: string;
  dateRange: {from?: Date; to?: Date};
}

const DiagnosticoIndividual: React.FC<DiagnosticoIndividualProps> = ({ 
  companyId, 
  departmentId,
  dateRange 
}) => {
  const [employees, setEmployees] = useState<Employee[]>([]);

  React.useEffect(() => {
    if (companyId) {
      const employeesList = getEmployeesByCompany(companyId);
      
      // Filtrar por departamento se especificado
      const filteredEmployees = departmentId 
        ? employeesList.filter(emp => emp.departmentId === departmentId)
        : employeesList;
      
      setEmployees(filteredEmployees);
    }
  }, [companyId, departmentId]);

  const getRiskStatusColor = (riskScore: number) => {
    if (riskScore >= 70) return "bg-red-500";
    if (riskScore >= 50) return "bg-amber-500";
    return "bg-green-500";
  };

  const getRiskStatusText = (riskScore: number) => {
    if (riskScore >= 70) return "Crítico";
    if (riskScore >= 50) return "Atenção";
    return "Baixo Risco";
  };

  // Estatísticas resumidas
  const criticoCount = employees.filter(e => calculateRiskScore(e) >= 70).length;
  const atencaoCount = employees.filter(e => calculateRiskScore(e) >= 50 && calculateRiskScore(e) < 70).length;
  const baixoRiscoCount = employees.filter(e => calculateRiskScore(e) < 50).length;

  // Simular um cálculo de pontuação de risco com base no ID (apenas para demonstração)
  const calculateRiskScore = (employee: Employee): number => {
    // Esta é uma lógica simulada. Na implementação real, isso viria das respostas do formulário
    return Math.floor((parseInt(employee.id.substring(0, 2), 16) % 100));
  };

  const formatDate = (date: Date | string): string => {
    if (!date) return "Não avaliado";
    
    const d = typeof date === 'string' ? new Date(date) : date;
    return d.toLocaleDateString('pt-BR');
  };

  const getJobRoleName = (roleId: string): string => {
    const roles = getJobRoles();
    const role = roles.find(r => r.id === roleId);
    return role ? role.name : "Cargo não especificado";
  };

  return (
    <div className="space-y-6">
      {/* Cards de resumo */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-red-50 border-red-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-red-700 text-lg flex items-center">
              <div className="w-3 h-3 rounded-full bg-red-500 mr-2"></div>
              Empregados Críticos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-red-700">{criticoCount}</p>
            <p className="text-sm text-red-600">Necessitam atenção imediata</p>
          </CardContent>
        </Card>

        <Card className="bg-amber-50 border-amber-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-amber-700 text-lg flex items-center">
              <div className="w-3 h-3 rounded-full bg-amber-500 mr-2"></div>
              Empregados em Atenção
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-amber-700">{atencaoCount}</p>
            <p className="text-sm text-amber-600">Monitoramento recomendado</p>
          </CardContent>
        </Card>

        <Card className="bg-green-50 border-green-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-green-700 text-lg flex items-center">
              <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
              Empregados em Baixo Risco
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-green-700">{baixoRiscoCount}</p>
            <p className="text-sm text-green-600">Situação adequada</p>
          </CardContent>
        </Card>
      </div>

      {/* Tabela de empregados */}
      <Card>
        <CardHeader>
          <CardTitle>Diagnóstico Individual</CardTitle>
        </CardHeader>
        <CardContent>
          {employees.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Empregado</TableHead>
                  <TableHead>Departamento/Cargo</TableHead>
                  <TableHead>Score</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Última Avaliação</TableHead>
                  <TableHead>Ação</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {employees.map((employee) => {
                  const riskScore = calculateRiskScore(employee);
                  
                  return (
                    <TableRow key={employee.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="h-8 w-8">
                            <AvatarFallback>{employee.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                          </Avatar>
                          <div className="font-medium">{employee.name}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm text-gray-500">
                          <div>{employee.departmentName}</div>
                          <div>{getJobRoleName(employee.roleId)}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="font-medium">{riskScore}%</span>
                      </TableCell>
                      <TableCell>
                        <Badge 
                          className={`${getRiskStatusColor(riskScore)} text-white`}
                        >
                          {getRiskStatusText(riskScore)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm">{formatDate(employee.lastEvaluation || new Date())}</span>
                      </TableCell>
                      <TableCell>
                        <Button variant="outline" size="sm">
                          <FileText className="mr-2 h-4 w-4" />
                          Ver Detalhes
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-10 text-gray-500">
              <FileText className="mx-auto h-10 w-10 text-gray-400 mb-2" />
              <p>Nenhum empregado encontrado com os filtros selecionados</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default DiagnosticoIndividual;
