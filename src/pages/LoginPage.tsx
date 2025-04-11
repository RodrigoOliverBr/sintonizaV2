
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { checkAdminCredentials, checkClienteCredentials } from "@/services/adminService";
import { toast } from "sonner";

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const [adminUsername, setAdminUsername] = useState("");
  const [adminPassword, setAdminPassword] = useState("");
  const [clienteCpfCnpj, setClienteCpfCnpj] = useState("");
  const [clientePassword, setClientePassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    if (checkAdminCredentials(adminUsername, adminPassword)) {
      localStorage.setItem("sintonia:userType", "admin");
      setTimeout(() => {
        navigate("/admin/dashboard");
        setIsLoading(false);
      }, 1000);
    } else {
      toast.error("Credenciais inválidas para Administrador");
      setIsLoading(false);
    }
  };

  const handleClienteLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    const cliente = checkClienteCredentials(clienteCpfCnpj, clientePassword);
    if (cliente) {
      localStorage.setItem("sintonia:userType", "cliente");
      localStorage.setItem("sintonia:currentCliente", JSON.stringify(cliente));
      setTimeout(() => {
        navigate("/");
        setIsLoading(false);
      }, 1000);
    } else {
      toast.error("Credenciais inválidas ou cliente bloqueado");
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <img 
              src="/lovable-uploads/5fbfce9a-dae3-444b-99c8-9b92040ef7e2.png" 
              alt="Sintonia Logo" 
              className="h-16" 
            />
          </div>
          <h1 className="text-3xl font-bold text-esocial-darkGray">Sintonia</h1>
          <p className="text-gray-500 mt-2">Faça login para acessar o sistema</p>
        </div>

        <Card>
          <Tabs defaultValue="cliente">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="cliente">Cliente</TabsTrigger>
              <TabsTrigger value="admin">Administrador</TabsTrigger>
            </TabsList>
            
            <TabsContent value="cliente">
              <form onSubmit={handleClienteLogin}>
                <CardHeader>
                  <CardTitle>Login de Cliente</CardTitle>
                  <CardDescription>
                    Acesse seu sistema com suas credenciais
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="cpfCnpj">CPF/CNPJ</Label>
                    <Input 
                      id="cpfCnpj" 
                      placeholder="Digite seu CPF ou CNPJ" 
                      value={clienteCpfCnpj}
                      onChange={(e) => setClienteCpfCnpj(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="clientePassword">Senha</Label>
                    <Input 
                      id="clientePassword" 
                      type="password" 
                      placeholder="Digite sua senha" 
                      value={clientePassword}
                      onChange={(e) => setClientePassword(e.target.value)}
                      required
                    />
                    <p className="text-xs text-muted-foreground text-right">
                      Para testes: use o CPF/CNPJ invertido como senha
                    </p>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? "Carregando..." : "Entrar"}
                  </Button>
                </CardFooter>
              </form>
            </TabsContent>
            
            <TabsContent value="admin">
              <form onSubmit={handleAdminLogin}>
                <CardHeader>
                  <CardTitle>Login de Administrador</CardTitle>
                  <CardDescription>
                    Acesse o painel administrativo do sistema
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="username">Usuário</Label>
                    <Input 
                      id="username" 
                      placeholder="Digite seu usuário" 
                      value={adminUsername}
                      onChange={(e) => setAdminUsername(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="adminPassword">Senha</Label>
                    <Input 
                      id="adminPassword" 
                      type="password" 
                      placeholder="Digite sua senha" 
                      value={adminPassword}
                      onChange={(e) => setAdminPassword(e.target.value)}
                      required
                    />
                    <p className="text-xs text-muted-foreground text-right">
                      Para testes: usuário = admin, senha = admin123
                    </p>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? "Carregando..." : "Entrar"}
                  </Button>
                </CardFooter>
              </form>
            </TabsContent>
          </Tabs>
        </Card>
        
        <div className="text-center">
          <p className="text-sm text-gray-500">© 2025 eSocial Brasil. Todos os direitos reservados.</p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
