
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";
import { Building, Users, Briefcase, ClipboardList } from "lucide-react";

interface NavItem {
  title: string;
  href: string;
  icon: LucideIcon;
}

interface NavSection {
  title: string;
  items: NavItem[];
}

const navSections: NavSection[] = [
  {
    title: "Formulário",
    items: [
      {
        title: "Formulário ISTAS-21",
        href: "/",
        icon: ClipboardList,
      },
      {
        title: "Como Preencher",
        href: "/como-preencher",
        icon: ClipboardList,
      },
      {
        title: "Como Avaliar",
        href: "/como-avaliar",
        icon: ClipboardList,
      },
      {
        title: "Mitigações",
        href: "/mitigacoes",
        icon: ClipboardList,
      },
      {
        title: "Sobre",
        href: "/sobre",
        icon: ClipboardList,
      },
    ],
  },
  {
    title: "Cadastros",
    items: [
      {
        title: "Empresas",
        href: "/cadastros/empresas",
        icon: Building,
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
    ],
  },
];

export const SidebarLinks: React.FC = () => {
  const location = useLocation();

  return (
    <div className="space-y-4 py-4">
      {navSections.map((section) => (
        <div key={section.title} className="px-3 py-2">
          <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">
            {section.title}
          </h2>
          <div className="space-y-1">
            {section.items.map((item) => (
              <Link
                key={item.href}
                to={item.href}
                className={cn(
                  "flex items-center rounded-md px-4 py-2 text-sm font-medium transition-colors hover:bg-primary hover:text-primary-foreground",
                  location.pathname === item.href
                    ? "bg-primary text-primary-foreground"
                    : "transparent"
                )}
              >
                <item.icon className="mr-2 h-4 w-4" />
                {item.title}
              </Link>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};
