
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { AlertTriangle, CheckCircle, CircleDashed, Eye, FileDown } from "lucide-react";
import { getEmployeesByCompany, getFormResultByEmployeeId, getFormStatusByEmployeeId, getJobRoleById } from "@/services/storageService";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { FormStatus } from "@/types/form";
import { useNavigate } from "react-router-dom";

interface DiagnosticoIndividualProps {
  companyId: string;
  departmentId: string;
  dateRange: { from?: Date; to?: Date };
}

export default function DiagnosticoIndividual({
  companyId,
  departmentId,
  dateRange
}: DiagnosticoIndividualProps) {
  const navigate = useNavigate();
  
  // Filtrar empregados pela empresa e departamento, se aplicável
  let employees = getEmployeesByCompany(companyId);
  if (departmentId) {
    employees = employees.filter(emp => emp.departmentId === departmentId);
  }
  
  // Adicionar dados de avaliação para cada empregado
  const employeesWithStatus = employees.map(emp => {
    const formResult = getFormResultByEmployeeId(emp.id);
    const status = getFormStatusByEmployeeId(emp.id);
    
    // Calcular score baseado no resultado do formulário ou gerar aleatório para simulação
    let score = 0;
    let riskLevel: 'high' | 'medium' | 'low' = 'low';
    
    if (formResult) {
      score = Math.round((formResult.totalYes / (formResult.totalYes + formResult.totalNo)) * 100);
      
      if (score >= 70) {
        riskLevel = 'high';
      } else if (score >= 50) {
        riskLevel = 'medium';
      } else {
        riskLevel = 'low';
      }
    } else {
      // Dados simulados para demonstração
      score = Math.floor(Math.random() * 100);
      
      if (score >= 70) {
        riskLevel = 'high';
      } else if (score >= 50) {
        riskLevel = 'medium';
      } else {
        riskLevel = 'low';
      }
    }
    
    const jobRole = getJobRoleById(emp.jobRoleId);
    
    return {
      ...emp,
      jobRoleName: jobRole?.name || "Não definido",
      status,
      score,
      riskLevel,
      lastUpdated: formResult?.lastUpdated || null
    };
  });
  
  // Ordenar por nível de risco (mais crítico primeiro)
  const sortedEmployees = [...employeesWithStatus].sort((a, b) => {
    // Prioridade para empregados com avaliação completa
    if (a.status === 'completed' && b.status !== 'completed') return -1;
    if (a.status !== 'completed' && b.status === 'completed') return 1;
    
    // Quando ambos completos, ordenar por score
    if (a.status === 'completed' && b.status === 'completed') {
      return b.score - a.score;
    }
    
    // Outros casos, manter ordem original
    return 0;
  });
  
  // Contagem por nível de risco (apenas para empregados com avaliação completa)
  const completedEmployees = sortedEmployees.filter(emp => emp.status === 'completed');
  const highRiskCount = completedEmployees.filter(emp => emp.riskLevel === 'high').length;
  const mediumRiskCount = completedEmployees.filter(emp => emp.riskLevel === 'medium').length;
  const lowRiskCount = completedEmployees.filter(emp => emp.riskLevel === 'low').length;
  
  const openForm = (employeeId: string) => {
    // Navegação para o formulário do empregado selecionado
    navigate(`/?emp=${employeeId}`);
  };
  
  const exportDiagnostic = (employeeId: string) => {
    console.log(`Exportando diagnóstico para o empregado ${employeeId}`);
    // Aqui implementaria a exportação para PDF
  };
  
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-red-50 border-red-200">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-red-800">Empregados Críticos</p>
                <h3 className="text-2xl font-bold text-red-900">{highRiskCount}</h3>
              </div>
              <div className="h-12 w-12 bg-red-100 rounded-full flex items-center justify-center">
                <AlertTriangle className="h-6 w-6 text-red-500" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-yellow-50 border-yellow-200">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-yellow-800">Empregados em Atenção</p>
                <h3 className="text-2xl font-bold text-yellow-900">{mediumRiskCount}</h3>
              </div>
              <div className="h-12 w-12 bg-yellow-100 rounded-full flex items-center justify-center">
                <CircleDashed className="h-6 w-6 text-yellow-500" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-green-50 border-green-200">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-800">Empregados em Baixo Risco</p>
                <h3 className="text-2xl font-bold text-green-900">{lowRiskCount}</h3>
              </div>
              <div className="h-12 w-12 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle className="h-6 w-6 text-green-500" />
              </div>
            </div>
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
              {sortedEmployees.map(emp => (
                <TableRow key={emp.id}>
                  <TableCell className="font-medium">{emp.name}</TableCell>
                  <TableCell>{emp.departmentId}</TableCell>
                  <TableCell>{emp.jobRoleName}</TableCell>
                  <TableCell>
                    {emp.status === 'completed' ? `${emp.score}%` : '-'}
                  </TableCell>
                  <TableCell>
                    {emp.status === 'not-started' && (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                        Não iniciado
                      </span>
                    )}
                    {emp.status === 'in-progress' && (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        Em progresso
                      </span>
                    )}
                    {emp.status === 'completed' && emp.riskLevel === 'high' && (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                        <AlertTriangle className="h-3 w-3 mr-1" /> Crítico
                      </span>
                    )}
                    {emp.status === 'completed' && emp.riskLevel === 'medium' && (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                        <CircleDashed className="h-3 w-3 mr-1" /> Atenção
                      </span>
                    )}
                    {emp.status === 'completed' && emp.riskLevel === 'low' && (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        <CheckCircle className="h-3 w-3 mr-1" /> Baixo Risco
                      </span>
                    )}
                  </TableCell>
                  <TableCell>
                    {emp.lastUpdated 
                      ? format(new Date(emp.lastUpdated), "dd/MM/yyyy", { locale: ptBR })
                      : '-'}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button 
                        size="sm" 
                        variant="outline" 
                        onClick={() => openForm(emp.id)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      {emp.status === 'completed' && (
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => exportDiagnostic(emp.id)}
                        >
                          <FileDown className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
