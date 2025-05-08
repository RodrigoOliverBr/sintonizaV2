
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import SidebarLinks from "./SidebarLinks";
import { cn } from "@/lib/utils";

const Sidebar = () => {
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem("sintoniza:userType");
    localStorage.removeItem("sintoniza:currentCliente");
    window.location.href = "/login";
  };

  return (
    <aside className="fixed inset-y-0 left-0 z-50 hidden w-64 flex-col border-r bg-white md:flex">
      <div className="flex h-16 items-center justify-center border-b px-6">
        <img
          src="/lovable-uploads/d550586d-cad5-4f72-9a59-4bdd27224f50.png"
          alt="Sintoniza Logo"
          className="h-10"
        />
      </div>
      <nav className="flex-1 overflow-y-auto py-2">
        <SidebarLinks />
      </nav>
      <div className="border-t p-4">
        <Button
          variant="outline"
          className="w-full justify-start"
          onClick={handleLogout}
        >
          <LogOut className="mr-2 h-4 w-4" />
          Sair
        </Button>
      </div>
    </aside>
  );
};

export default Sidebar;
