
import { useScroll, useTransform } from "framer-motion";
import { useEffect, useRef } from "react";
import { useHotkeys } from "react-hotkeys-hook";
import { useToast } from "@/hooks/use-toast";
import { useTranslation } from 'react-i18next';
import { Tutorial } from "@/components/Tutorial";
import { MainHeader } from "@/components/layout/MainHeader";
import { MainLayout } from "@/components/layout/MainLayout";
import { ContentTabs } from "@/components/tabs/ContentTabs";
import '../i18n/config';

const Index = () => {
  const { toast } = useToast();
  const { t } = useTranslation();
  const { scrollY } = useScroll();
  const headerOpacity = useTransform(scrollY, [0, 100], [1, 0]);
  const headerTranslateY = useTransform(scrollY, [0, 100], [0, -100]);

  useEffect(() => {
    document.documentElement.classList.add("dark");
  }, []);

  useHotkeys("?", () => {
    toast({
      title: t("availableShortcuts", "Available keyboard shortcuts"),
      description: "Ctrl+K: Search\nCtrl+/: Help\nCtrl+B: Side menu",
    });
  });

  useHotkeys("ctrl+k", (e) => {
    e.preventDefault();
    toast({
      title: t("search", "Search"),
      description: t("searchComingSoon", "Search functionality coming soon"),
    });
  });

  return (
    <div className="min-h-screen bg-background">
      <Tutorial />
      <MainHeader 
        headerOpacity={headerOpacity} 
        headerTranslateY={headerTranslateY} 
      />
      
      <MainLayout>
        <ContentTabs />
      </MainLayout>
    </div>
  );
};

export default Index;
