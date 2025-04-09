import React from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  ClipboardList,
  HelpCircle,
  Info,
  LifeBuoy,
  BookOpen,
  Menu,
  X,
  Building2,
  Users,
  Briefcase,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

interface SidebarProps {
  className?: string;
}

const Sidebar: React.FC<SidebarProps> = ({ className }) => {
  const location = useLocation();
  const [isOpen, setIsOpen] = React.useState(false);

  const routes = [
    {
      title: "Formulário",
      href: "/",
      icon: ClipboardList,
    },
    {
      title: "Como Preencher",
      href: "/como-preencher",
      icon: HelpCircle,
    },
    {
      title: "Como Avaliar",
      href: "/como-avaliar",
      icon: BookOpen,
    },
    {
      title: "Sobre o Formulário",
      href: "/sobre",
      icon: Info,
    },
    {
      title: "Guia de Mitigações",
      href: "/mitigacoes",
      icon: LifeBuoy,
    },
  ];

  const cadastrosRoutes = [
    {
      title: "Empresas",
      href: "/cadastros/empresas",
      icon: Building2,
    },
    {
      title: "Funcionários",
      href: "/cadastros/funcionarios",
      icon: Users,
    },
    {
      title: "Funções",
      href: "/cadastros/funcoes",
      icon: Briefcase,
    },
  ];

  const MobileNav = () => (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild className="md:hidden">
        <Button
          variant="ghost"
          size="icon"
          className="text-esocial-darkGray"
        >
          <Menu size={24} />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="p-0">
        <div className="flex flex-col h-full bg-white">
          <div className="p-4 border-b flex justify-between items-center">
            <div className="font-semibold text-lg text-esocial-blue">ISTAS21-BR</div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen(false)}
            >
              <X size={18} />
            </Button>
          </div>
          <nav className="flex-1 p-4">
            <ul className="space-y-2">
              {routes.map((route) => {
                const isActive = location.pathname === route.href;
                return (
                  <li key={route.href}>
                    <Link
                      to={route.href}
                      className={cn(
                        "flex items-center space-x-3 rounded-lg px-3 py-2",
                        isActive
                          ? "bg-esocial-blue text-white"
                          : "hover:bg-esocial-lightGray"
                      )}
                      onClick={() => setIsOpen(false)}
                    >
                      <route.icon size={18} />
                      <span>{route.title}</span>
                    </Link>
                  </li>
                );
              })}

              <li className="pt-4">
                <div className="px-3 py-2 text-sm font-medium text-muted-foreground">
                  Cadastros
                </div>
                <ul className="mt-1 space-y-1">
                  {cadastrosRoutes.map((route) => {
                    const isActive = location.pathname === route.href;
                    return (
                      <li key={route.href}>
                        <Link
                          to={route.href}
                          className={cn(
                            "flex items-center space-x-3 rounded-lg px-3 py-2",
                            isActive
                              ? "bg-esocial-blue text-white"
                              : "hover:bg-esocial-lightGray"
                          )}
                          onClick={() => setIsOpen(false)}
                        >
                          <route.icon size={18} />
                          <span>{route.title}</span>
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </li>
            </ul>
          </nav>
        </div>
      </SheetContent>
    </Sheet>
  );

  return (
    <>
      <MobileNav />
      <div
        className={cn(
          "hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0 bg-white border-r print:hidden",
          className
        )}
      >
        <div className="flex-1 flex flex-col min-h-0 border-r border-gray-200">
          <div className="flex items-center h-16 flex-shrink-0 px-4 border-b">
            <div className="flex items-center">
              <ClipboardList className="h-8 w-8 text-esocial-blue" />
              <span className="ml-2 text-xl font-semibold text-esocial-blue">
                ISTAS21-BR
              </span>
            </div>
          </div>
          <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
            <nav className="mt-5 flex-1 px-4 space-y-1">
              {routes.map((route) => {
                const isActive = location.pathname === route.href;
                return (
                  <Link
                    key={route.href}
                    to={route.href}
                    className={cn(
                      "group flex items-center px-4 py-3 text-sm font-medium rounded-md",
                      isActive
                        ? "bg-esocial-blue text-white"
                        : "text-esocial-darkGray hover:bg-esocial-lightGray"
                    )}
                  >
                    <route.icon
                      className={cn(
                        "mr-3 flex-shrink-0 h-5 w-5",
                        isActive ? "text-white" : "text-esocial-darkGray"
                      )}
                    />
                    {route.title}
                  </Link>
                );
              })}

              <div className="pt-6">
                <div className="px-4 mb-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Cadastros
                </div>
                {cadastrosRoutes.map((route) => {
                  const isActive = location.pathname === route.href;
                  return (
                    <Link
                      key={route.href}
                      to={route.href}
                      className={cn(
                        "group flex items-center px-4 py-3 text-sm font-medium rounded-md",
                        isActive
                          ? "bg-esocial-blue text-white"
                          : "text-esocial-darkGray hover:bg-esocial-lightGray"
                      )}
                    >
                      <route.icon
                        className={cn(
                          "mr-3 flex-shrink-0 h-5 w-5",
                          isActive ? "text-white" : "text-esocial-darkGray"
                        )}
                      />
                      {route.title}
                    </Link>
                  );
                })}
              </div>
            </nav>
          </div>
          <div className="flex-shrink-0 flex border-t p-4">
            <div className="text-xs text-muted-foreground">© 2025 eSocial Brasil</div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
