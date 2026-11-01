'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  ShieldCheck,
  FileText,
  SearchCode,
  FileSpreadsheet,
  History,
  Settings,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  Cpu,
  LifeBuoy,
  Layers,
} from 'lucide-react';
import { useApp } from '@/context/AppContext';

interface NavSection {
  title: string;
  items: {
    name: string;
    href: string;
    icon: React.ComponentType<{ className?: string }>;
    badge?: string | null;
    badgeStyle?: string;
  }[];
}

export const Sidebar: React.FC = () => {
  const pathname = usePathname();
  const { sidebarCollapsed, setSidebarCollapsed, stats } = useApp();

  const navSections: NavSection[] = [
    {
      title: 'MAIN',
      items: [
        {
          name: 'Dashboard',
          href: '/',
          icon: LayoutDashboard,
        },
        {
          name: 'Verify Claims',
          href: '/verify',
          icon: ShieldCheck,
          badge: 'Live',
          badgeStyle: 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30',
        },
        {
          name: 'Documents',
          href: '/documents',
          icon: FileText,
        },
        {
          name: 'Evidence',
          href: '/evidence',
          icon: SearchCode,
        },
      ],
    },
    {
      title: 'ANALYTICS',
      items: [
        {
          name: 'Audit Reports',
          href: '/reports',
          icon: FileSpreadsheet,
        },
        {
          name: 'Risk & Trends',
          href: '/#risk-trend',
          icon: TrendingUp,
        },
      ],
    },
    {
      title: 'MANAGEMENT',
      items: [
        {
          name: 'History',
          href: '/history',
          icon: History,
        },
        {
          name: 'Integrations',
          href: '/settings#integrations',
          icon: Cpu,
        },
      ],
    },
    {
      title: 'OTHER',
      items: [
        {
          name: 'Settings',
          href: '/settings',
          icon: Settings,
        },
        {
          name: 'Support Center',
          href: '/settings#support',
          icon: LifeBuoy,
        },
      ],
    },
  ];

  return (
    <aside
      className={`fixed top-0 left-0 z-40 h-screen transition-all duration-200 ease-in-out bg-[#0D1017] border-r border-[#1B202D] flex flex-col justify-between select-none shadow-xl ${
        sidebarCollapsed ? 'w-16' : 'w-64'
      }`}
    >
      {/* Top Header / Brand */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden py-3">
        {/* Brand Header */}
        <div className="h-14 flex items-center justify-between px-4 mb-2">
          {!sidebarCollapsed ? (
            <Link href="/" className="flex items-center gap-2.5">
              <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center text-white shadow-md shadow-emerald-950/40">
                <ShieldCheck className="h-4 w-4" />
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-1.5">
                  <span className="font-bold text-sm tracking-tight text-white">
                    Verify<span className="text-emerald-400">AI</span>
                  </span>
                  <span className="text-[9px] px-1.5 py-0.2 rounded bg-emerald-500/10 text-emerald-400 font-mono font-bold border border-emerald-500/20">
                    RAG
                  </span>
                </div>
                <span className="text-[9px] text-slate-400 tracking-tight">
                  Misinformation & Claim Verifier
                </span>
              </div>
            </Link>
          ) : (
            <Link href="/" className="mx-auto" title="VerifyAI: Misinformation and Claim Verification Assistant">
              <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center text-white">
                <ShieldCheck className="h-4 w-4" />
              </div>
            </Link>
          )}

          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="w-7 h-7 rounded-full border border-slate-700/60 bg-[#161B26] text-slate-400 hover:text-white hover:border-slate-500 flex items-center justify-center transition-colors shadow-xs"
            title={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            aria-label="Toggle sidebar"
          >
            {sidebarCollapsed ? (
              <ChevronRight className="h-3.5 w-3.5" />
            ) : (
              <ChevronLeft className="h-3.5 w-3.5" />
            )}
          </button>
        </div>

        {/* Categorized Nav Sections */}
        <div className="px-3 space-y-4">
          {navSections.map((section) => (
            <div key={section.title} className="space-y-1">
              {!sidebarCollapsed && (
                <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500 px-3 pt-2 pb-1">
                  {section.title}
                </div>
              )}
              {section.items.map((item) => {
                const isActive =
                  item.href === '/'
                    ? pathname === '/'
                    : pathname === item.href || (item.href !== '/#risk-trend' && !item.href.includes('#') && pathname?.startsWith(item.href + '/'));
                const Icon = item.icon;

                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    title={sidebarCollapsed ? item.name : undefined}
                    className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs transition-all duration-150 ${
                      isActive
                        ? 'bg-white text-slate-900 font-semibold shadow-sm'
                        : 'text-slate-400 hover:text-white hover:bg-white/[0.06] font-medium'
                    } ${sidebarCollapsed ? 'justify-center px-0' : ''}`}
                  >
                    <Icon
                      className={`h-4 w-4 shrink-0 transition-colors ${
                        isActive ? 'text-slate-900' : 'text-slate-400 group-hover:text-white'
                      }`}
                    />
                    {!sidebarCollapsed && (
                      <div className="flex-1 flex items-center justify-between">
                        <span className="tracking-tight text-[13px]">{item.name}</span>
                        {item.badge && (
                          <span
                            className={`text-[10px] font-mono px-2 py-0.5 rounded-full ${
                              isActive
                                ? 'bg-emerald-100 text-emerald-800 font-bold'
                                : item.badgeStyle
                            }`}
                          >
                            {item.badge}
                          </span>
                        )}
                      </div>
                    )}
                  </Link>
                );
              })}
            </div>
          ))}
        </div>
      </div>

      {/* Footer Info */}
      <div className="p-3 border-t border-[#1B202D] bg-[#090C12]">
        {!sidebarCollapsed ? (
          <div className="flex items-center justify-between px-2 py-1.5">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-[11px] text-slate-400 font-medium">Veritas v2.6</span>
            </div>
            <span className="text-[10px] font-mono text-slate-500 bg-slate-800/80 px-2 py-0.5 rounded">
              ENTERPRISE
            </span>
          </div>
        ) : (
          <div className="flex justify-center" title="Engine Operational">
            <span className="h-2 w-2 rounded-full bg-emerald-400" />
          </div>
        )}
      </div>
    </aside>
  );
};
