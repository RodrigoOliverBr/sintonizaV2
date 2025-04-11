
import React from "react";
import AdminLayout from "@/components/AdminLayout";
import { getDashboardStats, getClientes, getContratos, getPlanos } from "@/services/adminService";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, LineChart } from "@/components/ui/chart";
import { Building2, Briefcase, CreditCard, Users, Check, Clock, AlertTriangle } from "lucide-react";

const DashboardPage: React.FC = () => {
  const stats = getDashboardStats();
  const planos = getPlanos();
  const clientes = getClientes();
  const contratos = getContratos();
  
  // Dados para o gráfico de contratos por plano
  const contratosPorPlano = planos.map(plano => {
    const count = contratos.filter(c => c.planoId === plano.id && c.status === 'ativo').length;
    return {
      name: plano.nome,
      value: count
    };
  });
  
  // Dados para o gráfico de faturamento mensal (últimos 6 meses)
  const meses = [];
  const hoje = new Date();
  for (let i = 5; i >= 0; i--) {
    const data = new Date(hoje.getFullYear(), hoje.getMonth() - i, 1);
    const mes = data.toLocaleString('default', { month: 'short' });
    const ano = data.getFullYear();
    meses.push(`${mes}/${ano}`);
  }
  
  const faturamentoMensal = {
    categories: meses,
    series: [
      {
        name: "Receita",
        data: [15000, 18000, 22000, 21000, 24000, 28000],
      }
    ]
  };

  return (
    <AdminLayout title="Dashboard">
      <div className="grid gap-6">
        {/* Cards de estatísticas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Clientes Ativos</CardTitle>
              <Building2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.clientesAtivos}</div>
              <p className="text-xs text-muted-foreground">
                Total de {stats.totalClientes} clientes cadastrados
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Contratos Ativos</CardTitle>
              <Briefcase className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.contratosAtivos}</div>
              <p className="text-xs text-muted-foreground">
                {stats.contratosEmAnalise} em análise, {stats.contratosCancelados} cancelados
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Faturamento</CardTitle>
              <CreditCard className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(stats.valorTotal)}
              </div>
              <p className="text-xs text-muted-foreground">
                {stats.faturasPagas} faturas pagas, {stats.faturasPendentes} pendentes
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Usuários</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalClientes * 5}</div>
              <p className="text-xs text-muted-foreground">
                Estimativa de usuários ativos
              </p>
            </CardContent>
          </Card>
        </div>
        
        {/* Status de faturas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Faturas Pagas</CardTitle>
              <Check className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(stats.valorTotalPago)}
              </div>
              <p className="text-xs text-muted-foreground">
                {stats.faturasPagas} faturas
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Faturas Pendentes</CardTitle>
              <Clock className="h-4 w-4 text-yellow-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(stats.valorTotalPendente)}
              </div>
              <p className="text-xs text-muted-foreground">
                {stats.faturasPendentes} faturas
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Faturas Atrasadas</CardTitle>
              <AlertTriangle className="h-4 w-4 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(stats.valorTotalAtrasado)}
              </div>
              <p className="text-xs text-muted-foreground">
                {stats.faturasAtrasadas} faturas
              </p>
            </CardContent>
          </Card>
        </div>
        
        {/* Gráficos */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Contratos por Plano</CardTitle>
              <CardDescription>
                Distribuição de contratos ativos por plano
              </CardDescription>
            </CardHeader>
            <CardContent>
              <BarChart 
                data={contratosPorPlano}
                index="name"
                categories={["value"]}
                colors={["blue"]}
                yAxisWidth={48}
                height={300}
              />
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Faturamento Mensal</CardTitle>
              <CardDescription>
                Faturamento dos últimos 6 meses
              </CardDescription>
            </CardHeader>
            <CardContent>
              <LineChart 
                data={faturamentoMensal}
                index="categories"
                categories={["Receita"]}
                colors={["green"]}
                yAxisWidth={48}
                height={300}
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
};

export default DashboardPage;
