'use client';

import React from 'react';
import { AppProvider, useApp } from '@/context/AppContext';
import { Navbar } from './Navbar';
import { Sidebar } from './Sidebar';

const AppContent: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { sidebarCollapsed } = useApp();

  return (
    <div className="min-h-screen bg-[#EFF2F6] text-[#0F172A] flex flex-col font-sans">
      <Sidebar />
      <div
        className={`flex-1 flex flex-col transition-all duration-200 ease-in-out ${
          sidebarCollapsed ? 'ml-16' : 'ml-64'
        }`}
      >
        <Navbar />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-[1600px] w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
};

export const AppShell: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <AppProvider>
      <AppContent>{children}</AppContent>
    </AppProvider>
  );
};
