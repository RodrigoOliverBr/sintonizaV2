
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { checkCredentials } from "@/services/adminService";
import { toast } from "sonner";

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  
  // Verificar se já está autenticado ao carregar
  useEffect(() => {
    const userType = localStorage.getItem("sintonia:userType");
    if (userType) {
      if (userType === 'admin') {
        navigate("/admin/dashboard");
      } else {
        navigate("/");
      }
    }
  }, [navigate]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Log para debug
    console.log("Tentando login com:", email, password);
    
    const result = checkCredentials(email, password);
    console.log("Resultado da autenticação:", result);
    
    if (result.isValid) {
      localStorage.setItem("sintonia:userType", result.userType as string);
      
      if (result.userType === 'cliente' && result.userData) {
        localStorage.setItem("sintonia:currentCliente", JSON.stringify(result.userData));
      }
      
      setTimeout(() => {
        if (result.userType === 'admin') {
          navigate("/admin/dashboard");
        } else {
          navigate("/");
        }
        setIsLoading(false);
      }, 1000);
      
      toast.success(`Login realizado com sucesso como ${result.userType === 'admin' ? 'Administrador' : 'Cliente'}`);
    } else {
      toast.error("Credenciais inválidas. Verifique seu e-mail e senha.");
      setIsLoading(false);
    }
  };

  // Função auxiliar para preencher credenciais de teste
  const preencherCredenciais = (tipo: 'admin' | 'cliente') => {
    if (tipo === 'admin') {
      setEmail("admin@prolife.com");
      setPassword("admin123");
    } else {
      setEmail("client@empresa.com");
      setPassword("client123");
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
          <form onSubmit={handleLogin}>
            <CardHeader>
              <CardTitle>Login</CardTitle>
              <CardDescription>
                Acesse o sistema com suas credenciais
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">E-mail</Label>
                <Input 
                  id="email" 
                  type="email"
                  placeholder="Digite seu e-mail" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Senha</Label>
                <Input 
                  id="password" 
                  type="password" 
                  placeholder="Digite sua senha" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <div className="text-sm text-muted-foreground pt-2">
                <p className="font-semibold mb-1">Credenciais para teste:</p>
                <div className="grid grid-cols-2 gap-2">
                  <Button 
                    type="button" 
                    variant="outline" 
                    size="sm" 
                    className="text-xs justify-start"
                    onClick={() => preencherCredenciais('admin')}
                  >
                    Admin: admin@prolife.com
                  </Button>
                  <Button 
                    type="button" 
                    variant="outline" 
                    size="sm" 
                    className="text-xs justify-start"
                    onClick={() => preencherCredenciais('cliente')}
                  >
                    Cliente: client@empresa.com
                  </Button>
                </div>
                <p className="text-xs mt-1 text-center">(Clique nas opções acima para preencher os campos)</p>
              </div>
            </CardContent>
            <CardFooter>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Carregando..." : "Entrar"}
              </Button>
            </CardFooter>
          </form>
        </Card>
        
        <div className="text-center">
          <p className="text-sm text-gray-500">© 2025 eSocial Brasil. Todos os direitos reservados.</p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
