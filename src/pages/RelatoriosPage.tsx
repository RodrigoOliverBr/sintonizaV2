
import React, { useState } from "react";
import Layout from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import FilterSection from "@/components/relatorios/FilterSection";
import MapaRiscoPsicossocial from "@/components/relatorios/MapaRiscoPsicossocial";
import RelatorioPGR from "@/components/relatorios/RelatorioPGR";
import { getCompanies } from "@/services/storageService";
import { Download, FileText, RefreshCcw } from "lucide-react";

export default function RelatoriosPage() {
  const [selectedCompanyId, setSelectedCompanyId] = useState<string>("");
  const [isGeneratingReport, setIsGeneratingReport] = useState(false);
  const [reportGenerated, setReportGenerated] = useState(false);

  const companies = getCompanies();
  
  const handleCompanyChange = (companyId: string) => {
    setSelectedCompanyId(companyId);
    setReportGenerated(false);
  };

  const generateReport = () => {
    if (!selectedCompanyId) return;
    
    setIsGeneratingReport(true);
    
    // Simular um delay para mostrar o loading
    setTimeout(() => {
      setIsGeneratingReport(false);
      setReportGenerated(true);
    }, 1000);
  };

  const handleExportPDF = () => {
    // Lógica para exportar para PDF seria implementada aqui
    console.log("Exportando relatório para PDF");
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">Relatórios Psicossociais</h1>
        
        <FilterSection 
          companies={companies}
          selectedCompanyId={selectedCompanyId}
          onCompanyChange={handleCompanyChange}
          onGenerateReport={generateReport}
          isGenerating={isGeneratingReport}
        />
        
        {reportGenerated && (
          <div className="mt-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Resultados da Análise</h2>
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setReportGenerated(false)}>
                  <RefreshCcw className="mr-2 h-4 w-4" />
                  Redefinir
                </Button>
                <Button onClick={handleExportPDF}>
                  <Download className="mr-2 h-4 w-4" />
                  Exportar PDF
                </Button>
              </div>
            </div>

            <Tabs defaultValue="mapa-risco" className="w-full">
              <TabsList className="grid grid-cols-2 mb-6">
                <TabsTrigger value="mapa-risco">Mapa de Risco</TabsTrigger>
                <TabsTrigger value="pgr">Relatório PGR</TabsTrigger>
              </TabsList>
              
              <TabsContent value="mapa-risco">
                <MapaRiscoPsicossocial 
                  companyId={selectedCompanyId}
                  departmentId=""
                  dateRange={{}}
                />
              </TabsContent>
              
              <TabsContent value="pgr">
                <RelatorioPGR
                  companyId={selectedCompanyId}
                  departmentId=""
                  dateRange={{}}
                />
              </TabsContent>
            </Tabs>
          </div>
        )}
        
        {!reportGenerated && selectedCompanyId && (
          <div className="mt-10 text-center py-16 border-2 border-dashed border-gray-200 rounded-lg">
            <FileText className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-600 mb-2">Nenhum relatório gerado</h3>
            <p className="text-gray-500 mb-4">Configure a empresa acima e clique em "Gerar Relatório"</p>
            <Button 
              onClick={generateReport} 
              disabled={isGeneratingReport || !selectedCompanyId}
            >
              Gerar Relatório
            </Button>
          </div>
        )}
      </div>
    </Layout>
  );
}
