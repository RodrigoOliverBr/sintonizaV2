
import React, { useState, useEffect } from "react";
import { Check, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { FormTemplate } from "@/types/admin";
import { getFormTemplates } from "@/services/formTemplateService";
import { assignFormTemplatesToClient, getClienteById, getClientFormTemplates } from "@/services/adminService";

interface ClienteFormulariosProps {
  clienteId: string;
}

const ClienteFormularios: React.FC<ClienteFormulariosProps> = ({ clienteId }) => {
  const [templates, setTemplates] = useState<FormTemplate[]>([]);
  const [selectedTemplates, setSelectedTemplates] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  
  useEffect(() => {
    loadData();
  }, [clienteId]);
  
  const loadData = () => {
    setIsLoading(true);
    
    try {
      // Carregar todos os formulários
      const allTemplates = getFormTemplates();
      setTemplates(allTemplates);
      
      // Carregar formulários associados ao cliente
      const clientFormIds = getClientFormTemplates(clienteId);
      setSelectedTemplates(clientFormIds);
    } catch (error) {
      toast.error("Erro ao carregar dados dos formulários");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleToggleTemplate = (templateId: string) => {
    setSelectedTemplates(prev => {
      if (prev.includes(templateId)) {
        // Se já existe, remover da seleção
        return prev.filter(id => id !== templateId);
      } else {
        // Se não existe, adicionar à seleção
        return [...prev, templateId];
      }
    });
  };
  
  const handleSave = () => {
    try {
      // Garantir que pelo menos um formulário esteja selecionado
      if (selectedTemplates.length === 0) {
        toast.error("O cliente deve ter pelo menos um formulário associado");
        return;
      }
      
      assignFormTemplatesToClient(clienteId, selectedTemplates);
      toast.success("Formulários atualizados com sucesso");
    } catch (error) {
      toast.error(`Erro ao salvar: ${(error as Error).message}`);
    }
  };
  
  const cliente = getClienteById(clienteId);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Formulários Disponíveis</CardTitle>
        <CardDescription>
          Selecione quais formulários estarão disponíveis para {cliente?.nome}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : (
          <>
            <div className="space-y-4">
              {templates.map((template) => (
                <div
                  key={template.id}
                  className="flex items-center space-x-2 p-2 rounded-md hover:bg-muted/50"
                >
                  <Checkbox
                    id={`template-${template.id}`}
                    checked={selectedTemplates.includes(template.id)}
                    onCheckedChange={() => handleToggleTemplate(template.id)}
                  />
                  <div className="grid gap-1.5">
                    <label
                      htmlFor={`template-${template.id}`}
                      className="font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex items-center"
                    >
                      {template.nome}
                      {template.padrao && (
                        <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                          <Check className="h-3 w-3 mr-1" />
                          Padrão
                        </span>
                      )}
                    </label>
                    <p className="text-sm text-muted-foreground">
                      {template.descricao}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-6 flex justify-end">
              <Button onClick={handleSave}>
                <Save className="mr-2 h-4 w-4" />
                Salvar
              </Button>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default ClienteFormularios;
