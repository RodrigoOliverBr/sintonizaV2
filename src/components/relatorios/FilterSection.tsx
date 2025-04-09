
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Company, Department } from "@/types/cadastro";
import { Calendar as CalendarIcon, FileBarChart } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { ptBR } from "date-fns/locale";

interface FilterSectionProps {
  companies: Company[];
  departments: Department[];
  selectedCompanyId: string;
  selectedDepartmentId: string;
  dateRange: { from?: Date; to?: Date };
  onCompanyChange: (companyId: string) => void;
  onDepartmentChange: (departmentId: string) => void;
  onDateRangeChange: (range: { from?: Date; to?: Date }) => void;
  onGenerateReport: () => void;
  isGenerating: boolean;
}

export default function FilterSection({
  companies,
  departments,
  selectedCompanyId,
  selectedDepartmentId,
  dateRange,
  onCompanyChange,
  onDepartmentChange,
  onDateRangeChange,
  onGenerateReport,
  isGenerating
}: FilterSectionProps) {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div>
            <Label htmlFor="company" className="mb-2 block">
              Empresa <span className="text-red-500">*</span>
            </Label>
            <Select 
              value={selectedCompanyId} 
              onValueChange={onCompanyChange}
            >
              <SelectTrigger id="company">
                <SelectValue placeholder="Selecione uma empresa" />
              </SelectTrigger>
              <SelectContent>
                {companies.map(company => (
                  <SelectItem key={company.id} value={company.id}>
                    {company.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label htmlFor="department" className="mb-2 block">
              Setor/Departamento (opcional)
            </Label>
            <Select 
              value={selectedDepartmentId} 
              onValueChange={onDepartmentChange}
              disabled={!selectedCompanyId || departments.length === 0}
            >
              <SelectTrigger id="department">
                <SelectValue placeholder={departments.length === 0 ? "Nenhum setor disponível" : "Todos os setores"} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Todos os setores</SelectItem>
                {departments.map(department => (
                  <SelectItem key={department.id} value={department.id}>
                    {department.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label className="mb-2 block">
              Período (opcional)
            </Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !dateRange.from && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {dateRange.from ? (
                    dateRange.to ? (
                      <>
                        {format(dateRange.from, "dd/MM/yy")} - {format(dateRange.to, "dd/MM/yy")}
                      </>
                    ) : (
                      format(dateRange.from, "dd/MM/yy")
                    )
                  ) : (
                    "Selecione um período"
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  initialFocus
                  mode="range"
                  defaultMonth={dateRange.from}
                  selected={dateRange}
                  onSelect={onDateRangeChange}
                  numberOfMonths={2}
                  locale={ptBR}
                />
              </PopoverContent>
            </Popover>
          </div>
          
          <div className="flex items-end">
            <Button 
              className="w-full"
              onClick={onGenerateReport}
              disabled={isGenerating || !selectedCompanyId}
            >
              {isGenerating ? (
                <>
                  <span className="loader mr-2"></span>
                  Gerando...
                </>
              ) : (
                <>
                  <FileBarChart className="mr-2 h-4 w-4" />
                  Gerar Relatório
                </>
              )}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
