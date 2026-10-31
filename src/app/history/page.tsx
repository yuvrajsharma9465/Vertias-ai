'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  History,
  Search,
  ArrowUpRight,
  Trash2,
  X,
} from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { VerificationSession, VerificationReport } from '@/lib/types';

export default function HistoryPage() {
  const { sessions, deleteSession, setActiveSession, setSelectedReport, addReport } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'HIGH_ACCURACY' | 'CONTRADICTIONS'>('ALL');
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const filteredSessions = sessions.filter((s) => {
    const matchesSearch =
      s.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.targetModel.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.sourceDocumentName.toLowerCase().includes(searchTerm.toLowerCase());

    if (!matchesSearch) return false;

    if (statusFilter === 'HIGH_ACCURACY') return s.accuracyScore >= 75;
    if (statusFilter === 'CONTRADICTIONS') return s.contradicted > 0;
    return true;
  });

  const handleInspect = (session: VerificationSession) => {
    setActiveSession(session);
  };

  const handleGenerateReport = (session: VerificationSession) => {
    const newReport: VerificationReport = {
      id: `REP-2026-${Math.floor(300 + Math.random() * 700)}`,
      sessionId: session.id,
      title: `Verification Dossier: ${session.title}`,
      summary: `Automated evidentiary audit of ${session.totalClaims} factual claims against ${session.sourceDocumentName}. Accuracy score achieved: ${session.accuracyScore}%.`,
      generatedAt: new Date().toISOString().replace('T', ' ').slice(0, 16),
      auditor: 'Dr. Sarah Chen, CISSP',
      organization: 'Veritas SecOps & Compliance Directorate',
      totalClaims: session.totalClaims,
      supportedCount: session.supported,
      contradictedCount: session.contradicted,
      insufficientCount: session.insufficient,
      accuracyScore: session.accuracyScore,
      documentName: session.sourceDocumentName,
      claims: session.claims,
    };
    addReport(newReport);
    setSelectedReport(newReport);
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">
            Verification Session History
          </h2>
          <p className="text-xs text-slate-500">
            Searchable audit trail of past verification sessions, model outputs, and evidence checks.
          </p>
        </div>

        {/* Filter buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setStatusFilter('ALL')}
            className={`px-3 py-1 rounded-full text-xs font-semibold transition-colors ${
              statusFilter === 'ALL'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:text-slate-900'
            }`}
          >
            All Sessions ({sessions.length})
          </button>
          <button
            onClick={() => setStatusFilter('HIGH_ACCURACY')}
            className={`px-3 py-1 rounded-full text-xs font-bold transition-colors ${
              statusFilter === 'HIGH_ACCURACY'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100'
            }`}
          >
            ≥75% Corroborated
          </button>
          <button
            onClick={() => setStatusFilter('CONTRADICTIONS')}
            className={`px-3 py-1 rounded-full text-xs font-bold transition-colors ${
              statusFilter === 'CONTRADICTIONS'
                ? 'bg-rose-600 text-white shadow-xs'
                : 'bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100'
            }`}
          >
            With Contradictions
          </button>
        </div>
      </div>

      {/* Search Input Bar */}
      <div className="bg-white border border-slate-200 rounded-xl p-3 shadow-xs">
        <div className="relative">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search sessions by Session ID, title, AI target, or document..."
            className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-9 pr-4 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-sky-500"
          />
        </div>
      </div>

      {/* History Table */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">
            Audited Sessions ({filteredSessions.length})
          </span>
          <span className="text-[11px] font-mono font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
            Immutable Audit Trail
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="text-slate-500 border-b border-slate-100 bg-slate-50/80">
                <th className="py-2.5 px-4 font-semibold">Session ID</th>
                <th className="py-2.5 px-3 font-semibold">Target Context</th>
                <th className="py-2.5 px-3 font-semibold">AI Model</th>
                <th className="py-2.5 px-3 font-semibold">Source Document</th>
                <th className="py-2.5 px-3 font-semibold text-center">Claims (S/C/I)</th>
                <th className="py-2.5 px-3 font-semibold text-center">Verified Rate</th>
                <th className="py-2.5 px-3 font-semibold">Date & Time</th>
                <th className="py-2.5 px-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredSessions.map((session) => (
                <tr
                  key={session.id}
                  className="hover:bg-slate-50/70 transition-colors"
                >
                  <td className="py-3 px-4 font-mono text-sky-600 font-bold">
                    {session.id}
                  </td>
                  <td className="py-3 px-3 font-semibold text-slate-900">
                    <div className="truncate max-w-[180px]" title={session.title}>
                      {session.title}
                    </div>
                  </td>
                  <td className="py-3 px-3 font-mono text-slate-500">
                    {session.targetModel}
                  </td>
                  <td className="py-3 px-3 text-slate-600 text-xs">
                    <div className="truncate max-w-[170px]" title={session.sourceDocumentName}>
                      {session.sourceDocumentName}
                    </div>
                  </td>
                  <td className="py-3 px-3 text-center font-mono font-bold text-xs">
                    <span className="text-emerald-600">{session.supported}</span>
                    <span className="text-slate-300"> / </span>
                    <span className="text-rose-600">{session.contradicted}</span>
                    <span className="text-slate-300"> / </span>
                    <span className="text-amber-600">{session.insufficient}</span>
                  </td>
                  <td className="py-3 px-3 text-center">
                    <span
                      className={`font-mono font-bold text-[11px] px-2.5 py-0.5 rounded-full border ${
                        session.accuracyScore >= 75
                          ? 'border-emerald-200 text-emerald-700 bg-emerald-50'
                          : session.accuracyScore >= 50
                          ? 'border-amber-200 text-amber-700 bg-amber-50'
                          : 'border-rose-200 text-rose-700 bg-rose-50'
                      }`}
                    >
                      {session.accuracyScore}%
                    </span>
                  </td>
                  <td className="py-3 px-3 text-slate-500 text-xs font-mono">
                    {session.timestamp}
                  </td>
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href="/verify"
                        onClick={() => handleInspect(session)}
                        className="px-2.5 py-1 rounded-md bg-sky-50 hover:bg-sky-100 border border-sky-200 text-sky-700 text-xs font-bold flex items-center gap-1 transition-colors"
                      >
                        <span>Inspect</span>
                        <ArrowUpRight className="h-3 w-3" />
                      </Link>

                      <Link
                        href="/reports"
                        onClick={() => handleGenerateReport(session)}
                        className="px-2.5 py-1 rounded-md bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-700 text-xs font-bold transition-colors"
                      >
                        Report
                      </Link>

                      {deleteConfirmId === session.id ? (
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => {
                              deleteSession(session.id);
                              setDeleteConfirmId(null);
                            }}
                            className="px-2 py-1 rounded bg-rose-600 text-white text-[10px] font-bold"
                          >
                            Confirm
                          </button>
                          <button
                            onClick={() => setDeleteConfirmId(null)}
                            className="p-1 text-slate-400 hover:text-slate-700"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => setDeleteConfirmId(session.id)}
                          className="p-1 rounded-md bg-slate-50 hover:bg-rose-50 border border-slate-200 text-slate-400 hover:text-rose-600 transition-colors"
                          title="Delete Session"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
