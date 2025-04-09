
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";
import { Building, Users, ClipboardList, BookOpen, HelpCircle, Info, LifeBuoy } from "lucide-react";

interface NavItem {
  title: string;
  href: string;
  icon: LucideIcon;
  subItems?: NavItem[];
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
        icon: HelpCircle,
      },
      {
        title: "Como Avaliar",
        href: "/como-avaliar",
        icon: BookOpen,
        subItems: [
          {
            title: "Sobre o Formulário",
            href: "/sobre",
            icon: Info,
          }
        ]
      },
      {
        title: "Mitigações",
        href: "/mitigacoes",
        icon: LifeBuoy,
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
    ],
  },
];

export const SidebarLinks: React.FC = () => {
  const location = useLocation();

  const renderNavItems = (items: NavItem[]) => {
    return items.map((item) => {
      const isActive = location.pathname === item.href;
      const hasSubItems = item.subItems && item.subItems.length > 0;
      
      return (
        <div key={item.href}>
          <Link
            to={item.href}
            className={cn(
              "flex items-center rounded-md px-4 py-2 text-sm font-medium transition-colors hover:bg-primary hover:text-primary-foreground",
              isActive
                ? "bg-primary text-primary-foreground"
                : "transparent"
            )}
          >
            <item.icon className="mr-2 h-4 w-4" />
            {item.title}
          </Link>
          
          {hasSubItems && (
            <div className="pl-6 mt-1 space-y-1">
              {item.subItems?.map((subItem) => {
                const isSubActive = location.pathname === subItem.href;
                return (
                  <Link
                    key={subItem.href}
                    to={subItem.href}
                    className={cn(
                      "flex items-center rounded-md px-4 py-2 text-sm font-medium transition-colors hover:bg-primary hover:text-primary-foreground",
                      isSubActive
                        ? "bg-primary text-primary-foreground"
                        : "transparent"
                    )}
                  >
                    <subItem.icon className="mr-2 h-4 w-4" />
                    {subItem.title}
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      );
    });
  };

  return (
    <div className="space-y-4 py-4">
      {navSections.map((section) => (
        <div key={section.title} className="px-3 py-2">
          <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">
            {section.title}
          </h2>
          <div className="space-y-1">
            {renderNavItems(section.items)}
          </div>
        </div>
      ))}
    </div>
  );
};
