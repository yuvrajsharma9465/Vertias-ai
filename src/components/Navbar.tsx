'use client';

import React, { useState } from 'react';
import { usePathname } from 'next/navigation';
import {
  Search,
  Bell,
  X,
  CheckCircle,
  ExternalLink,
  Shield,
  FileCheck,
  ChevronDown,
} from 'lucide-react';
import { useApp } from '@/context/AppContext';

export const Navbar: React.FC = () => {
  const pathname = usePathname();
  const { searchQuery, setSearchQuery, notifications, markNotificationRead, settings } = useApp();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  // Derive human-readable page title to match image ("AI Analysis Overview")
  const getPageTitle = () => {
    switch (pathname) {
      case '/':
        return 'AI Analysis Overview';
      case '/verify':
        return 'VerifyAI: Misinformation & Claim Verification';
      case '/documents':
        return 'Documents & Evidence Library';
      case '/evidence':
        return 'Evidence Matrix & Quotes';
      case '/reports':
        return 'Compliance & Audit Reports';
      case '/history':
        return 'Audit Session History';
      case '/settings':
        return 'Auditor & Model Settings';
      default:
        return 'AI Analysis Overview';
    }
  };

  const pageTitle = getPageTitle();
  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <header className="h-20 w-full px-6 sm:px-8 flex items-center justify-between select-none">
      {/* Page Title (Large, bold, prominent like reference image) */}
      <div className="flex items-center gap-3">
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
          {pageTitle}
        </h1>
      </div>

      {/* Right: Search, Notifications, Profile */}
      <div className="flex items-center gap-3 sm:gap-4">
        {/* Rounded Search Bar (matches reference) */}
        <div className="relative w-48 sm:w-64 lg:w-80">
          <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search..."
            className="w-full bg-white border border-slate-200/80 rounded-2xl pl-10 pr-4 py-2 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-900/5 transition-all shadow-[0_1px_3px_rgba(0,0,0,0.03)]"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-3 text-slate-400 hover:text-slate-700"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Notifications Dropdown */}
        <div className="relative">
          <button
            onClick={() => {
              setShowNotifications(!showNotifications);
              setShowProfileMenu(false);
            }}
            className="relative p-2.5 rounded-2xl bg-white border border-slate-200/80 text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-colors shadow-xs"
            title="Notifications"
            aria-label="View notifications"
          >
            <Bell className="h-4 w-4" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-rose-500 text-[10px] font-bold text-white flex items-center justify-center shadow-xs">
                {unreadCount}
              </span>
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl border border-slate-200/90 shadow-dropdown p-4 z-50 animate-in fade-in zoom-in-95">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <span className="font-semibold text-xs text-slate-900">Audit Alerts</span>
                <span className="text-[11px] text-emerald-600 font-medium">Real-Time Feed</span>
              </div>
              <div className="divide-y divide-slate-100 max-h-72 overflow-y-auto mt-2">
                {notifications.length === 0 ? (
                  <p className="text-xs text-slate-400 py-4 text-center">No unread notifications</p>
                ) : (
                  notifications.map((n) => (
                    <div
                      key={n.id}
                      onClick={() => markNotificationRead(n.id)}
                      className={`py-2.5 px-2 hover:bg-slate-50 rounded-xl cursor-pointer transition-colors ${
                        !n.read ? 'bg-sky-50/50' : ''
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <span className="text-xs font-semibold text-slate-800">{n.title}</span>
                        <span className="text-[10px] text-slate-400 shrink-0 font-mono">
                          {n.time}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-0.5">{n.message}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* User Profile Pill */}
        <div className="relative">
          <button
            onClick={() => {
              setShowProfileMenu(!showProfileMenu);
              setShowNotifications(false);
            }}
            className="flex items-center gap-2.5 p-1.5 sm:px-3 sm:py-1.5 rounded-2xl bg-white border border-slate-200/80 hover:bg-slate-50 transition-colors shadow-xs"
          >
            <div className="h-7 w-7 rounded-xl bg-gradient-to-tr from-slate-900 to-slate-700 text-white font-bold text-xs flex items-center justify-center">
              {settings.profile?.name ? settings.profile.name.charAt(0) : 'A'}
            </div>
            <div className="hidden md:flex flex-col text-left">
              <span className="text-xs font-semibold text-slate-900 leading-tight">
                {settings.profile?.name || 'Dr. Aris Vance'}
              </span>
              <span className="text-[10px] text-slate-500 font-medium leading-tight">
                {settings.profile?.role || 'Chief Auditor'}
              </span>
            </div>
            <ChevronDown className="h-3.5 w-3.5 text-slate-400 hidden sm:block" />
          </button>

          {showProfileMenu && (
            <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl border border-slate-200/90 shadow-dropdown p-2 z-50 animate-in fade-in zoom-in-95">
              <div className="px-3 py-2 border-b border-slate-100">
                <p className="text-xs font-bold text-slate-900">{settings.profile?.name || 'Dr. Aris Vance'}</p>
                <p className="text-[11px] text-slate-500 truncate">{settings.profile?.email || 'aris@veritas.ai'}</p>
              </div>
              <div className="py-1">
                <a
                  href="/settings"
                  className="flex items-center gap-2 px-3 py-2 text-xs text-slate-700 hover:bg-slate-50 rounded-xl"
                >
                  <Shield className="h-3.5 w-3.5 text-slate-500" />
                  Auditor Security
                </a>
                <a
                  href="/reports"
                  className="flex items-center gap-2 px-3 py-2 text-xs text-slate-700 hover:bg-slate-50 rounded-xl"
                >
                  <FileCheck className="h-3.5 w-3.5 text-slate-500" />
                  My Exported Dossiers
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
