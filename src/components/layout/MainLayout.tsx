
import { CompanySidebar } from "@/components/CompanySidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { FloatingChatbot } from "@/components/FloatingChatbot";
import { ReactNode } from "react";
import { motion } from "framer-motion";

interface MainLayoutProps {
  children: ReactNode;
}

export const MainLayout = ({ children }: MainLayoutProps) => {
  return (
    <div className="pt-28">
      <SidebarProvider>
        <div className="min-h-screen flex w-full flex-col lg:flex-row">
          <CompanySidebar />
          <main className="flex-1 p-4 lg:pl-[320px] transition-all duration-300">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="flex flex-col gap-6"
            >
              {children}
            </motion.div>
          </main>
        </div>
      </SidebarProvider>
      <FloatingChatbot />
    </div>
  );
};
