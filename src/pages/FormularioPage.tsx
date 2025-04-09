
import React, { useState, useEffect } from "react";
import Layout from "@/components/Layout";
import FormSection from "@/components/FormSection";
import FormResults from "@/components/FormResults";
import { formData } from "@/data/formData";
import { FormAnswer, FormResult, SeverityLevel } from "@/types/form";
import { Button } from "@/components/ui/button";
import { ArrowRight, FileDown, Printer, Plus, Search } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Company, Employee } from "@/types/cadastro";
import { 
  getCompanies, 
  getCompanyById, 
  getDepartmentById, 
  getEmployees, 
  getEmployeesByCompany 
} from "@/services/storageService";
import NewCompanyModal from "@/components/modals/NewCompanyModal";
import NewEmployeeModal from "@/components/modals/NewEmployeeModal";
import { useToast } from "@/hooks/use-toast";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

const FormularioPage: React.FC = () => {
  const [answers, setAnswers] = useState<Record<number, FormAnswer>>({});
  const [progress, setProgress] = useState(0);
  const [tab, setTab] = useState("form");
  const [result, setResult] = useState<FormResult>({
    answers: {},
    totalYes: 0,
    totalNo: 0,
    severityCounts: {
      "LEVEMENTE PREJUDICIAL": 0,
      "PREJUDICIAL": 0,
      "EXTREMAMENTE PREJUDICIAL": 0
    },
    yesPerSeverity: {
      "LEVEMENTE PREJUDICIAL": 0,
      "PREJUDICIAL": 0,
      "EXTREMAMENTE PREJUDICIAL": 0
    },
    analyistNotes: ""
  });

  // Company and employee selection
  const [companies, setCompanies] = useState<Company[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [filteredEmployees, setFilteredEmployees] = useState<Employee[]>([]);
  const [selectedCompanyId, setSelectedCompanyId] = useState<string>("");
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<string>("");
  const [employeeSearch, setEmployeeSearch] = useState("");
  const [isNewCompanyModalOpen, setIsNewCompanyModalOpen] = useState(false);
  const [isNewEmployeeModalOpen, setIsNewEmployeeModalOpen] = useState(false);
  const [formVisible, setFormVisible] = useState(false);

  const { toast } = useToast();

  const totalQuestions = formData.sections.reduce((acc, section) => acc + section.questions.length, 0);

  useEffect(() => {
    // Initialize answers
    const initialAnswers: Record<number, FormAnswer> = {};
    formData.sections.forEach(section => {
      section.questions.forEach(question => {
        initialAnswers[question.id] = {
          questionId: question.id,
          answer: null,
          observation: "",
          selectedOptions: []
        };
      });
    });
    setAnswers(initialAnswers);

    // Load companies and employees
    loadCompaniesAndEmployees();
  }, []);

  const loadCompaniesAndEmployees = () => {
    const loadedCompanies = getCompanies();
    setCompanies(loadedCompanies);
    
    const loadedEmployees = getEmployees();
    setEmployees(loadedEmployees);
    setFilteredEmployees(loadedEmployees);
  };

  useEffect(() => {
    // Filter employees by company
    if (selectedCompanyId) {
      const employeesForCompany = getEmployeesByCompany(selectedCompanyId);
      setFilteredEmployees(employeesForCompany);
    } else {
      setFilteredEmployees(employees);
    }
  }, [selectedCompanyId, employees]);

  useEffect(() => {
    // Filter employees by search term
    if (employeeSearch) {
      const searchLower = employeeSearch.toLowerCase();
      const filtered = selectedCompanyId 
        ? getEmployeesByCompany(selectedCompanyId).filter(e => 
            e.name.toLowerCase().includes(searchLower) || 
            e.cpf.toLowerCase().includes(searchLower))
        : employees.filter(e => 
            e.name.toLowerCase().includes(searchLower) || 
            e.cpf.toLowerCase().includes(searchLower));
      
      setFilteredEmployees(filtered);
    } else if (selectedCompanyId) {
      setFilteredEmployees(getEmployeesByCompany(selectedCompanyId));
    } else {
      setFilteredEmployees(employees);
    }
  }, [employeeSearch, selectedCompanyId, employees]);

  useEffect(() => {
    // Calculate progress
    const answeredQuestions = Object.values(answers).filter(a => a.answer !== null).length;
    const progressPercentage = Math.round((answeredQuestions / totalQuestions) * 100);
    setProgress(progressPercentage);

    // Calculate results
    calculateResults();
  }, [answers]);

  const calculateResults = () => {
    const totalYes = Object.values(answers).filter(a => a.answer === true).length;
    const totalNo = Object.values(answers).filter(a => a.answer === false).length;
    const severityCounts: Record<SeverityLevel, number> = {
      "LEVEMENTE PREJUDICIAL": 0,
      "PREJUDICIAL": 0,
      "EXTREMAMENTE PREJUDICIAL": 0
    };
    const yesPerSeverity: Record<SeverityLevel, number> = {
      "LEVEMENTE PREJUDICIAL": 0,
      "PREJUDICIAL": 0,
      "EXTREMAMENTE PREJUDICIAL": 0
    };

    // Count severities
    formData.sections.forEach(section => {
      section.questions.forEach(question => {
        const severity = question.severity as SeverityLevel;
        severityCounts[severity] = (severityCounts[severity] || 0) + 1;
        
        const answer = answers[question.id];
        if (answer && answer.answer === true) {
          yesPerSeverity[severity] = (yesPerSeverity[severity] || 0) + 1;
        }
      });
    });

    setResult({
      answers,
      totalYes,
      totalNo,
      severityCounts,
      yesPerSeverity,
      analyistNotes: result.analyistNotes
    });
  };

  const handleAnswerChange = (questionId: number, answer: boolean | null) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: {
        ...prev[questionId],
        questionId,
        answer
      }
    }));
  };

  const handleObservationChange = (questionId: number, observation: string) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: {
        ...prev[questionId],
        observation
      }
    }));
  };

  const handleOptionsChange = (questionId: number, options: string[]) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: {
        ...prev[questionId],
        selectedOptions: options
      }
    }));
  };

  const handleNotesChange = (notes: string) => {
    setResult(prev => ({
      ...prev,
      analyistNotes: notes
    }));
  };

  const handleCompanyChange = (companyId: string) => {
    setSelectedCompanyId(companyId);
    setSelectedEmployeeId(""); // Reset employee when company changes
  };

  const handleEmployeeChange = (employeeId: string) => {
    setSelectedEmployeeId(employeeId);
    if (employeeId) {
      const employee = employees.find(e => e.id === employeeId);
      if (employee) {
        setSelectedCompanyId(employee.companyId);
        setFormVisible(true);
      }
    } else {
      setFormVisible(false);
    }
  };

  const handleCompanyAdded = () => {
    loadCompaniesAndEmployees();
  };

  const handleEmployeeAdded = () => {
    loadCompaniesAndEmployees();
  };

  const getSelectedEmployeeInfo = () => {
    if (!selectedEmployeeId) return null;
    
    const employee = employees.find(e => e.id === selectedEmployeeId);
    if (!employee) return null;
    
    const company = getCompanyById(employee.companyId);
    const department = getDepartmentById(employee.departmentId);
    
    return {
      name: employee.name,
      cpf: employee.cpf,
      role: employee.role,
      department: department?.name || "Não encontrado",
      company: company?.name || "Não encontrada"
    };
  };

  const exportToPDF = () => {
    const element = document.getElementById('form-to-print');
    if (!element) {
      toast({
        title: "Erro",
        description: "Não foi possível gerar o PDF",
        variant: "destructive",
      });
      return;
    }

    html2canvas(element).then(canvas => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgWidth = 210; // A4 width in mm
      const imgHeight = canvas.height * imgWidth / canvas.width;
      
      let position = 0;
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      
      const employeeInfo = getSelectedEmployeeInfo();
      const filename = employeeInfo 
        ? `ISTAS21-BR_${employeeInfo.name.replace(/\s+/g, '_')}.pdf` 
        : 'ISTAS21-BR.pdf';
        
      pdf.save(filename);
      
      toast({
        title: "Sucesso",
        description: "PDF gerado com sucesso!",
      });
    });
  };

  const printForm = () => {
    window.print();
  };

  const employeeInfo = getSelectedEmployeeInfo();

  return (
    <Layout>
      <div className="mb-6 print:hidden">
        <h2 className="text-xl font-semibold mb-4">Selecione Empresa e Funcionário</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <div className="flex gap-2">
              <div className="flex-1">
                <Select value={selectedCompanyId} onValueChange={handleCompanyChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione uma empresa" />
                  </SelectTrigger>
                  <SelectContent>
                    {companies.map((company) => (
                      <SelectItem key={company.id} value={company.id}>
                        {company.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Button onClick={() => setIsNewCompanyModalOpen(true)}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          <div>
            <div className="flex gap-2 mb-2">
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar funcionário"
                  className="pl-8"
                  value={employeeSearch}
                  onChange={(e) => setEmployeeSearch(e.target.value)}
                />
              </div>
              <Button onClick={() => setIsNewEmployeeModalOpen(true)}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            
            <Select value={selectedEmployeeId} onValueChange={handleEmployeeChange}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione um funcionário" />
              </SelectTrigger>
              <SelectContent>
                {filteredEmployees.map((employee) => (
                  <SelectItem key={employee.id} value={employee.id}>
                    {employee.name} - {employee.cpf}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {employeeInfo && (
        <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
          <h3 className="text-lg font-medium mb-2">Informações do Funcionário</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p><span className="font-medium">Nome:</span> {employeeInfo.name}</p>
              <p><span className="font-medium">CPF:</span> {employeeInfo.cpf}</p>
            </div>
            <div>
              <p><span className="font-medium">Função:</span> {employeeInfo.role}</p>
              <p><span className="font-medium">Setor:</span> {employeeInfo.department}</p>
              <p><span className="font-medium">Empresa:</span> {employeeInfo.company}</p>
            </div>
          </div>
        </div>
      )}

      {(formVisible || selectedEmployeeId) && (
        <div id="form-to-print">
          <Tabs value={tab} onValueChange={setTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6 print:hidden">
              <TabsTrigger value="form">Formulário</TabsTrigger>
              <TabsTrigger value="results">Resultados</TabsTrigger>
            </TabsList>
            <TabsContent value="form">
              <div className="mb-6 print:hidden">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium">
                    Progresso: {progress}% ({Object.values(answers).filter(a => a.answer !== null).length} de {totalQuestions})
                  </span>
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      onClick={printForm}
                    >
                      <Printer className="mr-2 h-4 w-4" />
                      Imprimir
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={exportToPDF}
                    >
                      <FileDown className="mr-2 h-4 w-4" />
                      PDF
                    </Button>
                    <Button 
                      variant="default" 
                      onClick={() => setTab("results")}
                      disabled={progress === 0}
                    >
                      Ver Resultados
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <Progress value={progress} className="h-2" />
              </div>

              {formData.sections.map((section, index) => (
                <FormSection
                  key={index}
                  section={section}
                  answers={answers}
                  onAnswerChange={handleAnswerChange}
                  onObservationChange={handleObservationChange}
                  onOptionsChange={handleOptionsChange}
                />
              ))}

              <div className="flex justify-end mt-6 print:hidden">
                <Button variant="default" onClick={() => setTab("results")} disabled={progress === 0}>
                  Ver Resultados
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </TabsContent>
            <TabsContent value="results">
              <FormResults result={result} onNotesChange={handleNotesChange} />
              <div className="flex justify-between mt-6 print:hidden">
                <Button variant="outline" onClick={() => setTab("form")}>
                  Voltar ao Formulário
                </Button>
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    onClick={printForm}
                  >
                    <Printer className="mr-2 h-4 w-4" />
                    Imprimir
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={exportToPDF}
                  >
                    <FileDown className="mr-2 h-4 w-4" />
                    PDF
                  </Button>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      )}

      {!formVisible && !selectedEmployeeId && (
        <div className="text-center py-12 bg-gray-50 rounded-lg border border-gray-200">
          <h3 className="text-lg font-medium mb-2">Selecione uma empresa e um funcionário para preencher o formulário</h3>
          <p className="text-muted-foreground">Ou cadastre um novo funcionário clicando no botão "+" acima</p>
        </div>
      )}

      <NewCompanyModal
        open={isNewCompanyModalOpen}
        onOpenChange={setIsNewCompanyModalOpen}
        onCompanyAdded={handleCompanyAdded}
      />
      
      <NewEmployeeModal
        open={isNewEmployeeModalOpen}
        onOpenChange={setIsNewEmployeeModalOpen}
        onEmployeeAdded={handleEmployeeAdded}
        preselectedCompanyId={selectedCompanyId}
      />
    </Layout>
  );
};

export default FormularioPage;
