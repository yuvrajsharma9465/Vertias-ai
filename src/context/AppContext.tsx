'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
  Claim,
  SourceDocument,
  VerificationSession,
  VerificationReport,
  UserSettings,
  Verdict
} from '@/lib/types';
import {
  INITIAL_DOCUMENTS,
  INITIAL_SESSIONS,
  INITIAL_REPORTS
} from '@/lib/verificationEngine';

interface AppContextType {
  // Navigation & UI state
  sidebarCollapsed: boolean;
  setSidebarCollapsed: React.Dispatch<React.SetStateAction<boolean>>;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  notifications: Array<{ id: string; title: string; message: string; time: string; read: boolean }>;
  markNotificationRead: (id: string) => void;

  // Documents
  documents: SourceDocument[];
  addDocument: (doc: SourceDocument) => void;
  removeDocument: (id: string) => void;
  selectedPreviewDoc: SourceDocument | null;
  setSelectedPreviewDoc: (doc: SourceDocument | null) => void;

  // Verification & Sessions
  sessions: VerificationSession[];
  activeSession: VerificationSession | null;
  setActiveSession: (session: VerificationSession | null) => void;
  addSession: (session: VerificationSession) => void;
  deleteSession: (id: string) => void;

  // Reports
  reports: VerificationReport[];
  addReport: (report: VerificationReport) => void;
  selectedReport: VerificationReport | null;
  setSelectedReport: (report: VerificationReport | null) => void;

  // Global Statistics
  stats: {
    totalClaims: number;
    supported: number;
    contradicted: number;
    insufficient: number;
  };

  // Settings
  settings: UserSettings;
  updateSettings: (newSettings: Partial<UserSettings>) => void;
}

const DEFAULT_SETTINGS: UserSettings = {
  profile: {
    name: 'Dr. Sarah Chen, CISSP',
    email: 'sarah.chen@veritas.cybersec.internal',
    organization: 'Veritas SecOps & Compliance Directorate',
    role: 'Principal Verification Auditor',
  },
  aiProvider: {
    provider: 'gemini',
    model: 'gemini-2.5-flash',
    apiKey: '',
    temperature: 0.1,
    confidenceThreshold: 85,
  },
  privacy: {
    zeroRetention: false,
    auditTrail: true,
    anonymizeSources: false,
  },
  appearance: {
    density: 'comfortable',
    highContrast: false,
    monoFont: false,
  },
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [documents, setDocuments] = useState<SourceDocument[]>(INITIAL_DOCUMENTS);
  const [sessions, setSessions] = useState<VerificationSession[]>(INITIAL_SESSIONS);
  const [activeSession, setActiveSession] = useState<VerificationSession | null>(INITIAL_SESSIONS[0]);
  const [reports, setReports] = useState<VerificationReport[]>(INITIAL_REPORTS);
  const [selectedPreviewDoc, setSelectedPreviewDoc] = useState<SourceDocument | null>(null);
  const [selectedReport, setSelectedReport] = useState<VerificationReport | null>(null);
  const [settings, setSettings] = useState<UserSettings>(DEFAULT_SETTINGS);

  const [notifications, setNotifications] = useState([
    {
      id: 'n1',
      title: 'Audit Complete',
      message: 'Cyber Threat Intelligence Report verification completed with 4 supported claims.',
      time: '12m ago',
      read: false,
    },
    {
      id: 'n2',
      title: 'Contradiction Detected',
      message: 'Flagged 1 critical numerical contradiction in financial filings dataset.',
      time: '1h ago',
      read: false,
    },
    {
      id: 'n3',
      title: 'Document Ingested',
      message: 'BioPharma_Phase3_Cardiovascular_Trial.pdf indexed (3 pages).',
      time: '3h ago',
      read: true,
    },
  ]);

  // Load persisted state from localStorage on client-side mount
  useEffect(() => {
    try {
      const storedDocs = localStorage.getItem('veritas_documents');
      if (storedDocs) setDocuments(JSON.parse(storedDocs));

      const storedSessions = localStorage.getItem('veritas_sessions');
      if (storedSessions) {
        const parsed = JSON.parse(storedSessions);
        setSessions(parsed);
        if (parsed.length > 0) setActiveSession(parsed[0]);
      }

      const storedReports = localStorage.getItem('veritas_reports');
      if (storedReports) setReports(JSON.parse(storedReports));

      const storedSettings = localStorage.getItem('veritas_settings');
      if (storedSettings) setSettings(JSON.parse(storedSettings));
    } catch (e) {
      console.warn('LocalStorage not available in this environment');
    }
  }, []);

  const addDocument = (doc: SourceDocument) => {
    setDocuments((prev) => {
      const updated = [doc, ...prev];
      try {
        localStorage.setItem('veritas_documents', JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });
  };

  const removeDocument = (id: string) => {
    setDocuments((prev) => {
      const updated = prev.filter((d) => d.id !== id);
      try {
        localStorage.setItem('veritas_documents', JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });
  };

  const addSession = (session: VerificationSession) => {
    setSessions((prev) => {
      const updated = [session, ...prev];
      try {
        localStorage.setItem('veritas_sessions', JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });
    setActiveSession(session);
  };

  const deleteSession = (id: string) => {
    setSessions((prev) => {
      const updated = prev.filter((s) => s.id !== id);
      try {
        localStorage.setItem('veritas_sessions', JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });
    if (activeSession?.id === id) {
      setActiveSession(null);
    }
  };

  const addReport = (report: VerificationReport) => {
    setReports((prev) => {
      const updated = [report, ...prev];
      try {
        localStorage.setItem('veritas_reports', JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });
  };

  const updateSettings = (newSettings: Partial<UserSettings>) => {
    setSettings((prev) => {
      const updated = { ...prev, ...newSettings };
      try {
        localStorage.setItem('veritas_settings', JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });
  };

  const markNotificationRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  // Compute aggregated live statistics across all verification sessions
  const stats = React.useMemo(() => {
    let totalClaims = 0;
    let supported = 0;
    let contradicted = 0;
    let insufficient = 0;

    for (const session of sessions) {
      totalClaims += session.totalClaims;
      supported += session.supported;
      contradicted += session.contradicted;
      insufficient += session.insufficient;
    }

    return { totalClaims, supported, contradicted, insufficient };
  }, [sessions]);

  return (
    <AppContext.Provider
      value={{
        sidebarCollapsed,
        setSidebarCollapsed,
        searchQuery,
        setSearchQuery,
        notifications,
        markNotificationRead,
        documents,
        addDocument,
        removeDocument,
        selectedPreviewDoc,
        setSelectedPreviewDoc,
        sessions,
        activeSession,
        setActiveSession,
        addSession,
        deleteSession,
        reports,
        addReport,
        selectedReport,
        setSelectedReport,
        stats,
        settings,
        updateSettings,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
