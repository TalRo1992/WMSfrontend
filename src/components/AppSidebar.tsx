import { Link, useLocation } from "react-router-dom";
import {
  BarChart3,
  Boxes,
  ClipboardList,
  LayoutGrid,
  LogOut,
  Settings,
  Truck,
  Users,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
} from "@/components/ui/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/components/AuthProvider";

export function AppSidebar() {
  const { pathname } = useLocation();
  const { user, logout } = useAuth();

  const navItems = [
    { name: "Dashboard", icon: BarChart3, path: "/dashboard" },
    { name: "Inventory", icon: Boxes, path: "/inventory" },
    { name: "Orders", icon: ClipboardList, path: "/orders" },
    { name: "Warehouse", icon: LayoutGrid, path: "/warehouse" },
    { name: "Suppliers", icon: Users, path: "/suppliers" },
  ];

  const handleLogout = () => {
    logout();
  };

  return (
    <Sidebar>
      <SidebarHeader className="flex flex-col items-start py-6 px-5">
        <div className="flex items-center">
          <div className="mr-3 rounded-md bg-white/10 p-1.5">
            <Boxes className="h-6 w-6 text-white" />
          </div>
          <h1 className="text-xl font-bold text-white">Tapuz Wms</h1>
        </div>
        <p className="text-xs text-sidebar-foreground/60 mt-1.5">
          Warehouse Management System
        </p>
      </SidebarHeader>

      <SidebarContent className="px-3">
        <nav className="space-y-1.5">
          {navItems.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              className={`flex items-center gap-3 rounded-md px-3 py-2.5 text-sm transition-colors ${
                pathname === item.path
                  ? "bg-white/10 text-white font-medium"
                  : "text-sidebar-foreground/80 hover:bg-white/5 hover:text-white"
              }`}
            >
              <item.icon className="h-5 w-5" />
              <span>{item.name}</span>
            </Link>
          ))}
        </nav>

        <Separator className="my-4 bg-white/10" />

        <Link
          to="/settings"
          className={`flex items-center gap-3 rounded-md px-3 py-2.5 text-sm transition-colors ${
            pathname === "/settings"
              ? "bg-white/10 text-white font-medium"
              : "text-sidebar-foreground/80 hover:bg-white/5 hover:text-white"
          }`}
        >
          <Settings className="h-5 w-5" />
          <span>Settings</span>
        </Link>
      </SidebarContent>

      <SidebarFooter className="border-t border-white/10 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Avatar>
              <AvatarImage src="https://github.com/shadcn.png" />
              <AvatarFallback>AD</AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm font-medium text-white">
                {user?.name || "Einav Avriel"}
              </p>
              <p className="text-xs text-sidebar-foreground/60">
                {user?.role || "Warehouse Manager"}
              </p>
            </div>
          </div>
          <button
            className="rounded-md p-1.5 hover:bg-white/10 text-white/80 hover:text-white transition-colors"
            onClick={handleLogout}
          >
            <LogOut className="h-5 w-5" />
          </button>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
