
import React from 'react';
import Sidebar from './Sidebar';
import { useTheme } from '@/contexts/ThemeContext';
import { cn } from '@/lib/utils';

interface MainLayoutProps {
  children: React.ReactNode;
  title?: string;
}

const MainLayout = ({ children, title }: MainLayoutProps) => {
  const { theme } = useTheme();
  
  return (
    <div className={cn("flex min-h-screen", theme)}>
      <Sidebar />
      <main className="flex-1 overflow-auto">
        <div className="container mx-auto py-8 px-4">
          {title && (
            <h1 className="text-3xl font-bold mb-8">{title}</h1>
          )}
          {children}
        </div>
      </main>
    </div>
  );
};

export default MainLayout;
