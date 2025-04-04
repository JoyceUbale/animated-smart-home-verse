
import React from 'react';
import Sidebar from './Sidebar';
import { useTheme } from '@/contexts/ThemeContext';
import { cn } from '@/lib/utils';
import { BaseComponent, BaseComponentProps } from '@/catalyst/core/BaseComponent';

interface MainLayoutProps extends BaseComponentProps {
  children: React.ReactNode;
  title?: string;
}

const MainLayout = ({ children, title, className, testId }: MainLayoutProps) => {
  const { theme } = useTheme();
  
  return (
    <BaseComponent 
      className={cn("flex min-h-screen", theme, className)} 
      testId={testId || "main-layout"}
    >
      <Sidebar />
      <main className="flex-1 overflow-auto">
        <div className="container mx-auto py-8 px-4">
          {title && (
            <h1 className="text-3xl font-bold mb-8" data-testid="page-title">{title}</h1>
          )}
          {children}
        </div>
      </main>
    </BaseComponent>
  );
};

export default MainLayout;
