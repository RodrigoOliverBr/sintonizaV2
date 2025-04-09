
import React from "react";
import Layout from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, AlertTriangle, Activity, Lightbulb, Target } from "lucide-react";

const ComoAvaliar: React.FC = () => {
  return (
    <Layout>
      <div className="max-w-3xl mx-auto">
        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-center gap-2 text-esocial-blue">
              <BookOpen className="h-5 w-5" />
              <CardTitle>Como Avaliar os Resultados</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h3 className="text-lg font-medium mb-2">Interpretação dos Resultados</h3>
              <p className="text-muted-foreground">
                Os resultados do formulário ISTAS21-BR devem ser analisados considerando tanto as 
                respostas positivas (Sim) quanto a severidade dos riscos psicossociais identificados. 
                A interpretação adequada permitirá estabelecer prioridades e implementar ações 
                efetivas de mitigação.
              </p>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-medium">Análise por Severidade</h3>
              
              <div className="p-4 border rounded-lg bg-severity-light/10 border-severity-light/30">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="h-5 w-5 text-severity-light mt-1" />
                  <div>
                    <h4 className="font-medium mb-1">Levemente Prejudicial</h4>
                    <p className="text-sm text-muted-foreground">
                      <strong>Interpretação:</strong> Representa um risco psicossocial de menor impacto, 
                      mas que ainda requer atenção.
                    </p>
                    <p className="text-sm text-muted-foreground mt-2">
                      <strong>Ações recomendadas:</strong> Monitoramento contínuo, ações preventivas e 
                      verificação periódica para evitar agravamento.
                    </p>
                    <p className="text-sm text-muted-foreground mt-2">
                      <strong>Prazo sugerido:</strong> Implementar melhorias dentro de 90 dias.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="p-4 border rounded-lg bg-severity-medium/10 border-severity-medium/30">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="h-5 w-5 text-severity-medium mt-1" />
                  <div>
                    <h4 className="font-medium mb-1">Prejudicial</h4>
                    <p className="text-sm text-muted-foreground">
                      <strong>Interpretação:</strong> Indica um risco significativo que afeta 
                      diretamente o bem-estar psicológico dos trabalhadores.
                    </p>
                    <p className="text-sm text-muted-foreground mt-2">
                      <strong>Ações recomendadas:</strong> Intervenção planejada, revisão de políticas 
                      e processos, implementação de medidas corretivas específicas.
                    </p>
                    <p className="text-sm text-muted-foreground mt-2">
                      <strong>Prazo sugerido:</strong> Implementar melhorias dentro de 60 dias.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="p-4 border rounded-lg bg-severity-high/10 border-severity-high/30">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="h-5 w-5 text-severity-high mt-1" />
                  <div>
                    <h4 className="font-medium mb-1">Extremamente Prejudicial</h4>
                    <p className="text-sm text-muted-foreground">
                      <strong>Interpretação:</strong> Representa uma situação crítica com potencial 
                      para causar danos graves à saúde mental dos trabalhadores.
                    </p>
                    <p className="text-sm text-muted-foreground mt-2">
                      <strong>Ações recomendadas:</strong> Intervenção imediata, investigação 
                      aprofundada, ações corretivas urgentes, possível afastamento dos envolvidos 
                      e suporte psicológico às vítimas.
                    </p>
                    <p className="text-sm text-muted-foreground mt-2">
                      <strong>Prazo sugerido:</strong> Implementar melhorias imediatas, dentro de 30 dias.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-medium mb-2 flex items-center gap-2">
                <Activity className="h-5 w-5 text-esocial-blue" />
                Avaliação dos Níveis de Risco
              </h3>
              <div className="space-y-3">
                <div>
                  <p className="font-medium">Baixo (0-20%)</p>
                  <p className="text-sm text-muted-foreground">
                    Ambiente de trabalho saudável com riscos psicossociais bem controlados. Manter 
                    monitoramento e práticas preventivas.
                  </p>
                </div>
                <div>
                  <p className="font-medium">Moderado (21-40%)</p>
                  <p className="text-sm text-muted-foreground">
                    Existem alguns fatores de risco que precisam ser abordados. Implementar melhorias 
                    nos pontos identificados e monitorar a evolução.
                  </p>
                </div>
                <div>
                  <p className="font-medium">Considerável (41-60%)</p>
                  <p className="text-sm text-muted-foreground">
                    Presença significativa de riscos psicossociais que afetam o bem-estar dos 
                    trabalhadores. Necessário plano de ação estruturado com prazos definidos.
                  </p>
                </div>
                <div>
                  <p className="font-medium">Alto (61-80%)</p>
                  <p className="text-sm text-muted-foreground">
                    Ambiente de trabalho com múltiplos fatores de risco que exigem intervenção 
                    prioritária. Requer ações imediatas e monitoramento constante.
                  </p>
                </div>
                <div>
                  <p className="font-medium">Extremo (81-100%)</p>
                  <p className="text-sm text-muted-foreground">
                    Situação crítica com alto potencial de dano à saúde mental dos trabalhadores. 
                    Intervenção urgente, possível necessidade de mudanças estruturais na organização.
                  </p>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-medium mb-2 flex items-center gap-2">
                <Lightbulb className="h-5 w-5 text-esocial-blue" />
                Estratégia de Análise
              </h3>
              <ol className="list-decimal pl-5 space-y-2">
                <li>
                  <span className="font-medium">Visão geral do resultado:</span>{" "}
                  <p className="text-muted-foreground mt-1">
                    Avalie a proporção de respostas "Sim" em relação ao total de perguntas, 
                    entendendo o panorama geral dos riscos.
                  </p>
                </li>
                <li>
                  <span className="font-medium">Análise por severidade:</span>{" "}
                  <p className="text-muted-foreground mt-1">
                    Identifique quais categorias de severidade concentram mais respostas positivas, 
                    priorizando aquelas classificadas como extremamente prejudiciais.
                  </p>
                </li>
                <li>
                  <span className="font-medium">Análise por seção:</span>{" "}
                  <p className="text-muted-foreground mt-1">
                    Verifique quais áreas (Demandas Psicológicas, Organização do Trabalho, etc.) 
                    apresentam mais problemas, direcionando a intervenção de forma específica.
                  </p>
                </li>
                <li>
                  <span className="font-medium">Identificação de padrões:</span>{" "}
                  <p className="text-muted-foreground mt-1">
                    Busque padrões nas respostas que possam indicar problemas sistêmicos ou 
                    relacionados a departamentos ou lideranças específicas.
                  </p>
                </li>
              </ol>
            </div>

            <div>
              <h3 className="text-lg font-medium mb-2 flex items-center gap-2">
                <Target className="h-5 w-5 text-esocial-blue" />
                Direcionando Ações
              </h3>
              <div className="space-y-3">
                <p className="text-muted-foreground">
                  Com base na análise dos resultados, as ações devem ser direcionadas considerando:
                </p>
                <ul className="list-disc pl-5 space-y-2">
                  <li>
                    <span className="font-medium">Priorização por severidade:</span> Abordar primeiro as questões 
                    extremamente prejudiciais, seguidas pelas prejudiciais.
                  </li>
                  <li>
                    <span className="font-medium">Ações de curto prazo:</span> Implementar medidas imediatas para 
                    estabilizar situações críticas (ex: afastamento em casos de assédio).
                  </li>
                  <li>
                    <span className="font-medium">Ações de médio prazo:</span> Desenvolver programas e políticas 
                    para resolver as causas raiz dos problemas identificados.
                  </li>
                  <li>
                    <span className="font-medium">Ações de longo prazo:</span> Estabelecer mudanças na cultura 
                    organizacional e capacitar lideranças para prevenir recorrências.
                  </li>
                  <li>
                    <span className="font-medium">Monitoramento contínuo:</span> Estabelecer indicadores e 
                    acompanhar a evolução dos riscos psicossociais ao longo do tempo.
                  </li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default ComoAvaliar;
