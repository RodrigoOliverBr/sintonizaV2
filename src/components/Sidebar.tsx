
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  ClipboardList,
  HelpCircle,
  LifeBuoy,
  BookOpen,
  Menu,
  X,
  Building2,
  Users,
  BarChart2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import SidebarLinks from "./SidebarLinks";

interface SidebarProps {
  className?: string;
}

const Sidebar: React.FC<SidebarProps> = ({ className }) => {
  const location = useLocation();
  const [isOpen, setIsOpen] = React.useState(false);

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
            <div className="flex items-center">
              <img 
                src="/lovable-uploads/55c55435-602d-4685-ade6-6d83d636842d.png" 
                alt="eSocial Brasil Logo" 
                className="h-8 mr-2" 
              />
              <div className="font-semibold text-lg text-esocial-blue">Sintonia</div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen(false)}
            >
              <X size={18} />
            </Button>
          </div>
          <nav className="flex-1 p-4">
            <SidebarLinks />
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
              <img 
                src="/lovable-uploads/55c55435-602d-4685-ade6-6d83d636842d.png" 
                alt="eSocial Brasil Logo" 
                className="h-8 mr-2" 
              />
              <span className="ml-2 text-xl font-semibold text-esocial-blue">
                Sintonia
              </span>
            </div>
          </div>
          <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
            <nav className="mt-5 flex-1 px-4 space-y-1">
              <SidebarLinks />
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
