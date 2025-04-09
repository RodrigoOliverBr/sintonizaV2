
import React from "react";
import Layout from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Info, 
  FileText, 
  Shield, 
  TrendingUp, 
  FileLineChart,
  Scale,
  CheckCircle2
} from "lucide-react";

const Sobre: React.FC = () => {
  return (
    <Layout>
      <div className="max-w-3xl mx-auto">
        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-center gap-2 text-esocial-blue">
              <Info className="h-5 w-5" />
              <CardTitle>Sobre o Formulário ISTAS21-BR</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h3 className="text-lg font-medium mb-2 flex items-center gap-2">
                <FileText className="h-5 w-5 text-esocial-blue" />
                Origem e Desenvolvimento
              </h3>
              <p className="text-muted-foreground mb-3">
                O ISTAS21-BR é uma adaptação brasileira do questionário Copenhagen Psychosocial 
                Questionnaire (COPSOQ), originalmente desenvolvido na Dinamarca e posteriormente 
                adaptado pelo Instituto Sindical de Trabajo, Ambiente y Salud (ISTAS) da Espanha.
              </p>
              <p className="text-muted-foreground">
                A versão brasileira foi adaptada considerando as particularidades do contexto 
                laboral do Brasil e está alinhada às exigências da Norma Regulamentadora nº 01 (NR-01), 
                que estabelece disposições gerais e gerenciamento de riscos ocupacionais.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-medium mb-2 flex items-center gap-2">
                <Shield className="h-5 w-5 text-esocial-blue" />
                Base Legal e Normativa
              </h3>
              <p className="text-muted-foreground mb-3">
                A aplicação do ISTAS21-BR está fundamentada na NR-01, que incluiu os riscos 
                psicossociais entre os fatores de risco ocupacional a serem gerenciados pelas 
                organizações. Esta norma estabelece a obrigatoriedade de identificação, avaliação 
                e controle dos riscos psicossociais, assim como os demais riscos ocupacionais.
              </p>
              <p className="text-muted-foreground">
                A inclusão dos riscos psicossociais na NR-01 representa um avanço significativo 
                na legislação trabalhista brasileira, reconhecendo a importância da saúde mental 
                dos trabalhadores no ambiente laboral.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-medium mb-2 flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-esocial-blue" />
                Objetivo e Finalidade
              </h3>
              <p className="text-muted-foreground mb-3">
                O principal objetivo do formulário ISTAS21-BR é identificar, avaliar e monitorar 
                os fatores de risco psicossocial presentes no ambiente de trabalho que podem 
                afetar a saúde mental e o bem-estar dos trabalhadores.
              </p>
              <p className="text-muted-foreground">
                O instrumento permite:
              </p>
              <ul className="list-disc pl-5 space-y-2 mt-2">
                <li>
                  Mapear os principais riscos psicossociais presentes na organização
                </li>
                <li>
                  Avaliar a severidade e o impacto potencial desses riscos
                </li>
                <li>
                  Identificar áreas que necessitam de intervenção prioritária
                </li>
                <li>
                  Estabelecer uma base para o desenvolvimento de programas de prevenção
                </li>
                <li>
                  Monitorar a evolução dos riscos psicossociais ao longo do tempo
                </li>
                <li>
                  Atender às exigências legais relacionadas à gestão de riscos ocupacionais
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-medium mb-2 flex items-center gap-2">
                <FileLineChart className="h-5 w-5 text-esocial-blue" />
                Estrutura e Dimensões Avaliadas
              </h3>
              <p className="text-muted-foreground mb-3">
                O formulário ISTAS21-BR está estruturado em diferentes seções, cada uma avaliando 
                dimensões específicas dos riscos psicossociais:
              </p>
              <div className="space-y-3">
                <div>
                  <p className="font-medium">Demandas Psicológicas</p>
                  <p className="text-sm text-muted-foreground">
                    Avalia exigências cognitivas e emocionais no trabalho, pressão por resultados 
                    e prazos, necessidade de esconder emoções.
                  </p>
                </div>
                <div>
                  <p className="font-medium">Organização e Gestão do Trabalho</p>
                  <p className="text-sm text-muted-foreground">
                    Analisa aspectos como horários, turnos, clareza sobre funções e responsabilidades, 
                    previsibilidade nas tarefas.
                  </p>
                </div>
                <div>
                  <p className="font-medium">Trabalho Ativo e Desenvolvimento de Competências</p>
                  <p className="text-sm text-muted-foreground">
                    Avalia autonomia na execução do trabalho, oportunidades de desenvolvimento 
                    profissional, utilização de habilidades e conhecimentos.
                  </p>
                </div>
                <div>
                  <p className="font-medium">Apoio Social e Qualidade da Liderança</p>
                  <p className="text-sm text-muted-foreground">
                    Examina relações interpessoais, apoio de superiores e colegas, qualidade da 
                    gestão e comunicação.
                  </p>
                </div>
                <div>
                  <p className="font-medium">Compensação e Reconhecimento</p>
                  <p className="text-sm text-muted-foreground">
                    Analisa a percepção sobre recompensas, reconhecimento, estabilidade no emprego 
                    e perspectivas de carreira.
                  </p>
                </div>
                <div>
                  <p className="font-medium">Dupla Presença: Conflito Trabalho-Casa</p>
                  <p className="text-sm text-muted-foreground">
                    Avalia o equilíbrio entre vida profissional e pessoal, conflitos de tempo e 
                    energia entre as duas esferas.
                  </p>
                </div>
                <div>
                  <p className="font-medium">Assédio Moral e Sexual</p>
                  <p className="text-sm text-muted-foreground">
                    Identifica situações de violência psicológica e sexual no ambiente de trabalho.
                  </p>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-medium mb-2 flex items-center gap-2">
                <Scale className="h-5 w-5 text-esocial-blue" />
                Classificação de Severidade
              </h3>
              <p className="text-muted-foreground mb-3">
                As questões do formulário são classificadas em três níveis de severidade:
              </p>
              <div className="space-y-3">
                <div>
                  <p className="font-medium">Levemente Prejudicial</p>
                  <p className="text-sm text-muted-foreground">
                    Situações que representam um risco de menor impacto, mas que ainda devem ser 
                    monitoradas e tratadas preventivamente.
                  </p>
                </div>
                <div>
                  <p className="font-medium">Prejudicial</p>
                  <p className="text-sm text-muted-foreground">
                    Condições com potencial significativo para afetar a saúde mental e o bem-estar 
                    dos trabalhadores, exigindo ações corretivas.
                  </p>
                </div>
                <div>
                  <p className="font-medium">Extremamente Prejudicial</p>
                  <p className="text-sm text-muted-foreground">
                    Situações críticas que podem causar danos graves à saúde mental, demandando 
                    intervenção imediata, como casos de assédio moral ou sexual.
                  </p>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-medium mb-2 flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-esocial-blue" />
                Uso Prático nas Empresas
              </h3>
              <p className="text-muted-foreground mb-3">
                O ISTAS21-BR pode ser utilizado pelas empresas como:
              </p>
              <ul className="list-disc pl-5 space-y-2">
                <li>
                  <span className="font-medium">Ferramenta diagnóstica:</span> Para identificar os principais 
                  riscos psicossociais presentes no ambiente de trabalho.
                </li>
                <li>
                  <span className="font-medium">Instrumento de compliance:</span> Para atender às exigências da 
                  NR-01 relacionadas à gestão de riscos psicossociais.
                </li>
                <li>
                  <span className="font-medium">Base para programas preventivos:</span> Orientando o desenvolvimento 
                  de ações de promoção da saúde mental no trabalho.
                </li>
                <li>
                  <span className="font-medium">Indicador de saúde organizacional:</span> Permitindo o monitoramento 
                  contínuo da qualidade do ambiente psicossocial.
                </li>
                <li>
                  <span className="font-medium">Evidência para defesa legal:</span> Documentando as ações da empresa 
                  para gerenciar riscos psicossociais em caso de reclamações trabalhistas.
                </li>
              </ul>
              <p className="text-muted-foreground mt-3">
                A aplicação regular do formulário permite às organizações acompanhar a evolução dos 
                riscos psicossociais ao longo do tempo e avaliar a efetividade das medidas de 
                controle implementadas.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default Sobre;
