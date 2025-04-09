
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar as CalendarIcon, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Company, Department } from "@/types/cadastro";

interface FilterSectionProps {
  companies: Company[];
  departments: Department[];
  selectedCompanyId: string;
  selectedDepartmentId: string;
  dateRange: {from?: Date; to?: Date};
  onCompanyChange: (companyId: string) => void;
  onDepartmentChange: (departmentId: string) => void;
  onDateRangeChange: (range: {from?: Date; to?: Date}) => void;
  onGenerateReport: () => void;
  isGenerating: boolean;
}

const FilterSection: React.FC<FilterSectionProps> = ({
  companies,
  departments,
  selectedCompanyId,
  selectedDepartmentId,
  dateRange,
  onCompanyChange,
  onDepartmentChange,
  onDateRangeChange,
  onGenerateReport,
  isGenerating,
}) => {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Empresa</label>
            <Select
              value={selectedCompanyId}
              onValueChange={onCompanyChange}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione a empresa" />
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

          <div className="space-y-2">
            <label className="text-sm font-medium">Departamento</label>
            <Select
              value={selectedDepartmentId}
              onValueChange={onDepartmentChange}
              disabled={!selectedCompanyId || departments.length === 0}
            >
              <SelectTrigger>
                <SelectValue placeholder="Todos os departamentos" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os departamentos</SelectItem>
                {departments.map((department) => (
                  <SelectItem key={department.id} value={department.id}>
                    {department.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Período</label>
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
                        {format(dateRange.from, "dd/MM/yyyy", { locale: ptBR })} -{" "}
                        {format(dateRange.to, "dd/MM/yyyy", { locale: ptBR })}
                      </>
                    ) : (
                      format(dateRange.from, "dd/MM/yyyy", { locale: ptBR })
                    )
                  ) : (
                    <span>Selecione o período</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  initialFocus
                  mode="range"
                  defaultMonth={dateRange.from}
                  selected={dateRange as any}
                  onSelect={(range) => onDateRangeChange(range || {})}
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
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Gerando...
                </>
              ) : (
                "Gerar Relatório"
              )}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default FilterSection;
