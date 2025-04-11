
import React, { useState } from "react";
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

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    const result = checkCredentials(email, password);
    
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
                <p className="text-xs text-muted-foreground text-right">
                  Para testes: <br />
                  Admin: admin@prolife.com / admin123<br />
                  Cliente: client@empresa.com / client123
                </p>
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
