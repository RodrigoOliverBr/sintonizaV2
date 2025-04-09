
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { getDepartmentsByCompany } from "@/services/storageService";
import { AlertTriangle, CheckCircle, CircleDashed } from "lucide-react";

interface RankingAreasCriticasProps {
  companyId: string;
  departmentId: string;
  dateRange: { from?: Date; to?: Date };
}

export default function RankingAreasCriticas({
  companyId,
  departmentId,
  dateRange
}: RankingAreasCriticasProps) {
  // Simular dados de ranking de setores
  const departments = getDepartmentsByCompany(companyId);
  
  const departmentRisks = departments.map(dept => {
    const riskPercentage = Math.floor(Math.random() * 100);
    let riskLevel: 'high' | 'medium' | 'low';
    
    if (riskPercentage >= 70) {
      riskLevel = 'high';
    } else if (riskPercentage >= 50) {
      riskLevel = 'medium';
    } else {
      riskLevel = 'low';
    }
    
    return {
      id: dept.id,
      name: dept.name,
      employeeCount: Math.floor(Math.random() * 20) + 5, // 5-25 empregados
      riskPercentage,
      riskLevel
    };
  });
  
  // Ordenar do mais crítico ao menos crítico
  const sortedDepartments = [...departmentRisks].sort((a, b) => 
    b.riskPercentage - a.riskPercentage
  );
  
  // Contagem por nível de risco
  const highRiskCount = sortedDepartments.filter(d => d.riskLevel === 'high').length;
  const mediumRiskCount = sortedDepartments.filter(d => d.riskLevel === 'medium').length;
  const lowRiskCount = sortedDepartments.filter(d => d.riskLevel === 'low').length;
  
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-red-50 border-red-200">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-red-800">Áreas em Alto Risco</p>
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
                <p className="text-sm font-medium text-yellow-800">Áreas em Atenção</p>
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
                <p className="text-sm font-medium text-green-800">Áreas em Baixo Risco</p>
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
          <CardTitle>Ranking de Áreas por Nível de Risco</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Posição</TableHead>
                <TableHead>Setor</TableHead>
                <TableHead>Empregados Avaliados</TableHead>
                <TableHead>Nível de Risco</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedDepartments.map((dept, index) => (
                <TableRow key={dept.id}>
                  <TableCell className="font-medium">{index + 1}</TableCell>
                  <TableCell>{dept.name}</TableCell>
                  <TableCell>{dept.employeeCount}</TableCell>
                  <TableCell>{dept.riskPercentage}%</TableCell>
                  <TableCell>
                    {dept.riskLevel === 'high' && (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                        <AlertTriangle className="h-3 w-3 mr-1" /> Alto Risco
                      </span>
                    )}
                    {dept.riskLevel === 'medium' && (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                        <CircleDashed className="h-3 w-3 mr-1" /> Atenção
                      </span>
                    )}
                    {dept.riskLevel === 'low' && (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        <CheckCircle className="h-3 w-3 mr-1" /> Baixo Risco
                      </span>
                    )}
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
