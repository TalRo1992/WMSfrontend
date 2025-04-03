
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import Dashboard from "./Dashboard";
import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ThemeToggle } from "@/components/ThemeToggle";
import { BackgroundScene } from "@/components/BackgroundScene";
import { motion } from "framer-motion";
import { useAuth } from "@/components/AuthProvider";
import { Suspense } from "react";
import { useNavigate } from "react-router-dom";
import { Outlet } from "react-router-dom";

const Index = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  return (
    <SidebarProvider>
      <Suspense fallback={<div className="min-h-screen bg-background"></div>}>
        <BackgroundScene />
      </Suspense>
      <div className="flex min-h-screen w-full backdrop-blur-sm">
        <AppSidebar />
        <div className="flex-1 overflow-x-hidden">
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background/80 backdrop-blur-md px-6"
          >
            <SidebarTrigger />
            <div className="w-full flex justify-between items-center">
              <motion.span 
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.5 }}
                className="text-lg font-bold text-primary cursor-pointer"
                onClick={() => navigate('/dashboard')}
              >
                Tapuz Wms
              </motion.span>
              <div className="flex items-center gap-4">
                <ThemeToggle />
                <Button variant="ghost" size="icon" className="rounded-full hover:bg-primary/10 transition-colors">
                  <Bell className="h-5 w-5" />
                </Button>
                <motion.div 
                  initial={{ x: 20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="flex items-center gap-2"
                >
                  <Avatar>
                    <AvatarImage src="https://github.com/shadcn.png" alt={user?.name || "User"} />
                    <AvatarFallback>{user?.name?.substring(0, 2) || "U"}</AvatarFallback>
                  </Avatar>
                  <span className="text-sm text-muted-foreground hidden md:inline-block">{user?.role || "User"}</span>
                </motion.div>
              </div>
            </div>
          </motion.div>
          <Outlet />
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Index;
