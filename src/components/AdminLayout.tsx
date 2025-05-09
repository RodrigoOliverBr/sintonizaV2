
import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu, X, LogOut } from "lucide-react";
import AdminSidebarLinks from "./AdminSidebarLinks";
import { useNavigate } from "react-router-dom";

interface AdminLayoutProps {
  children: React.ReactNode;
  title: string;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children, title }) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const navigate = useNavigate();
  
  const handleLogout = () => {
    localStorage.removeItem("sintoniza:userType");
    localStorage.removeItem("sintoniza:currentCliente");
    navigate("/login");
  };

  return (
    <div className="flex h-full min-h-screen bg-gray-50">
      {/* Sidebar for desktop */}
      <div className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0 bg-white border-r print:hidden">
        <div className="flex-1 flex flex-col min-h-0 border-r border-gray-200">
          <div className="flex items-center h-16 flex-shrink-0 px-4 border-b bg-esocial-blue">
            <div className="flex items-center">
              <img 
                src="/lovable-uploads/467d0f94-3316-431e-9165-a18c71f42a98.png" 
                alt="Sintoniza Logo" 
                className="h-10 mr-2" 
              />
              <span className="text-xl font-semibold text-white">
                Sintoniza Admin
              </span>
            </div>
          </div>
          <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
            <nav className="mt-5 flex-1 px-4 space-y-1">
              <AdminSidebarLinks />
            </nav>
          </div>
          <div className="flex-shrink-0 flex border-t p-4">
            <div className="text-xs text-muted-foreground">© 2025 eSocial Brasil</div>
          </div>
        </div>
      </div>

      {/* Mobile nav */}
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild className="md:hidden fixed top-4 left-4 z-40">
          <Button
            variant="ghost"
            size="icon"
            className="text-esocial-darkGray bg-white shadow rounded-full"
          >
            <Menu size={24} />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="p-0">
          <div className="flex flex-col h-full bg-white">
            <div className="p-4 border-b flex justify-between items-center bg-esocial-blue text-white">
              <div className="flex items-center">
                <img 
                  src="/lovable-uploads/467d0f94-3316-431e-9165-a18c71f42a98.png" 
                  alt="Sintoniza Logo" 
                  className="h-8 mr-2" 
                />
                <span className="font-semibold text-lg">Sintoniza Admin</span>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsOpen(false)}
                className="text-white"
              >
                <X size={18} />
              </Button>
            </div>
            <nav className="flex-1 p-4">
              <AdminSidebarLinks />
            </nav>
          </div>
        </SheetContent>
      </Sheet>

      <div className="flex-1 md:pl-64">
        <header className="bg-white shadow print:hidden">
          <div className="mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex h-16 items-center justify-between">
              <h1 className="text-2xl font-bold text-esocial-darkGray">
                {title}
              </h1>
              <div className="flex items-center gap-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleLogout}
                  className="flex items-center gap-1"
                >
                  <LogOut size={16} />
                  <span className="hidden sm:inline">Sair</span>
                </Button>
                <img 
                  src="/lovable-uploads/55c55435-602d-4685-ade6-6d83d636842d.png" 
                  alt="eSocial Brasil Logo" 
                  className="h-12" 
                />
              </div>
            </div>
          </div>
        </header>
        <main className="py-6 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          {children}
        </main>
      </div>
      <Toaster />
    </div>
  );
};

export default AdminLayout;
