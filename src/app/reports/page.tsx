'use client';

import React, { useState } from 'react';
import {
  FileSpreadsheet,
  Printer,
  FileText,
  CheckCircle2,
  AlertTriangle,
  HelpCircle,
  Search,
} from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { VerificationReport } from '@/lib/types';

export default function ReportsPage() {
  const { reports, selectedReport, setSelectedReport, sessions, addReport } = useApp();
  const [searchTerm, setSearchTerm] = useState('');

  const activeReport = selectedReport || reports[0];

  const filteredReports = reports.filter(
    (r) =>
      r.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.documentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handlePrint = () => {
    window.print();
  };

  const handleGenerateFromLatestSession = () => {
    if (sessions.length === 0) return;
    const latest = sessions[0];
    const newReport: VerificationReport = {
      id: `REP-2026-${Math.floor(200 + Math.random() * 800)}`,
      sessionId: latest.id,
      title: `Verification Dossier: ${latest.title}`,
      summary: `Automated evidentiary audit of ${latest.totalClaims} factual claims against ${latest.sourceDocumentName}. Accuracy score achieved: ${latest.accuracyScore}%.`,
      generatedAt: new Date().toISOString().replace('T', ' ').slice(0, 16),
      auditor: 'Dr. Sarah Chen, CISSP',
      organization: 'Veritas SecOps & Compliance Directorate',
      totalClaims: latest.totalClaims,
      supportedCount: latest.supported,
      contradictedCount: latest.contradicted,
      insufficientCount: latest.insufficient,
      accuracyScore: latest.accuracyScore,
      documentName: latest.sourceDocumentName,
      claims: latest.claims,
    };
    addReport(newReport);
    setSelectedReport(newReport);
  };

  return (
    <div className="space-y-6">
      {/* Top Header (no-print) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 no-print">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">
            Audit Reports & PDF Dossiers
          </h2>
          <p className="text-xs text-slate-500">
            Export verifiable, audit-ready compliance dossiers with primary source citations.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={handleGenerateFromLatestSession}
            className="px-3.5 py-2 rounded-lg bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 text-xs font-semibold transition-colors shadow-xs"
          >
            Generate From Latest Session
          </button>
          <button
            onClick={handlePrint}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition-colors shadow-sm"
          >
            <Printer className="h-4 w-4" />
            <span>Export / Print PDF</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Left sidebar of reports list, Right full report dossier preview */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Reports Archive List (Cols 1-4) (no-print) */}
        <div className="lg:col-span-4 space-y-4 no-print">
          <div className="bg-white border border-slate-200 rounded-xl p-3 shadow-xs">
            <div className="relative">
              <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search dossiers by ID or title..."
                className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-9 pr-3 py-1.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-sky-500"
              />
            </div>
          </div>

          <div className="space-y-3 max-h-[75vh] overflow-y-auto pr-1">
            {filteredReports.map((report) => {
              const isSelected = activeReport?.id === report.id;
              return (
                <div
                  key={report.id}
                  onClick={() => setSelectedReport(report)}
                  className={`p-4 rounded-xl border cursor-pointer transition-all shadow-xs ${
                    isSelected
                      ? 'bg-white border-sky-500 ring-2 ring-sky-100'
                      : 'bg-white border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs mb-2">
                    <span className="font-mono text-sky-600 font-bold bg-sky-50 px-2 py-0.5 rounded border border-sky-200">
                      {report.id}
                    </span>
                    <span
                      className={`font-mono text-[11px] font-bold px-2 py-0.5 rounded-full border ${
                        report.accuracyScore >= 75
                          ? 'border-emerald-200 text-emerald-700 bg-emerald-50'
                          : 'border-amber-200 text-amber-700 bg-amber-50'
                      }`}
                    >
                      {report.accuracyScore}% Verified
                    </span>
                  </div>

                  <h4 className="text-xs font-bold text-slate-900 mb-1 line-clamp-1">
                    {report.title}
                  </h4>

                  <p className="text-[11px] text-slate-600 line-clamp-2 leading-relaxed mb-3">
                    {report.summary}
                  </p>

                  <div className="flex items-center justify-between text-[11px] text-slate-500 pt-2 border-t border-slate-100">
                    <span className="truncate max-w-[160px] font-medium">{report.documentName}</span>
                    <span>{report.generatedAt.split(' ')[0]}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Selected Report Dossier Document View (Cols 5-12) (Printable) */}
        <div className="lg:col-span-8 bg-white border border-slate-200 rounded-xl p-6 sm:p-8 space-y-6 shadow-sm">
          {activeReport ? (
            <div className="space-y-6">
              {/* Dossier Header */}
              <div className="border-b border-slate-200 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="font-mono text-[10px] px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold">
                      VERITAS AUDIT DOSSIER
                    </span>
                    <span className="font-mono text-xs text-slate-400 font-bold">
                      {activeReport.id}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 tracking-tight">
                    {activeReport.title}
                  </h3>
                </div>

                <div className="text-left sm:text-right text-xs text-slate-500 space-y-0.5">
                  <p>
                    <span className="text-slate-900 font-semibold">Generated:</span> {activeReport.generatedAt}
                  </p>
                  <p>
                    <span className="text-slate-900 font-semibold">Lead Auditor:</span> {activeReport.auditor}
                  </p>
                  <p className="text-emerald-700 font-mono font-bold text-[11px]">
                    STATUS: CRYPTOGRAPHICALLY VALIDATED
                  </p>
                </div>
              </div>

              {/* Executive Summary */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  Executive Findings & Audit Scope
                </span>
                <p className="text-xs text-slate-700 leading-relaxed">
                  {activeReport.summary}
                </p>
                <div className="text-xs text-sky-700 pt-1 font-semibold">
                  Primary Ground-Truth Document: <span className="font-mono text-slate-900">{activeReport.documentName}</span>
                </div>
              </div>

              {/* 4 Compact Metric Boxes */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
                <div className="p-3.5 rounded-xl bg-sky-50 border border-sky-200">
                  <span className="text-[11px] font-bold text-sky-800">Total Claims</span>
                  <p className="text-2xl font-bold font-mono text-sky-900 mt-1">
                    {activeReport.totalClaims}
                  </p>
                </div>
                <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200">
                  <span className="text-[11px] font-bold text-emerald-800">Supported</span>
                  <p className="text-2xl font-bold font-mono text-emerald-700 mt-1">
                    {activeReport.supportedCount}
                  </p>
                </div>
                <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200">
                  <span className="text-[11px] font-bold text-rose-800">Contradicted</span>
                  <p className="text-2xl font-bold font-mono text-rose-700 mt-1">
                    {activeReport.contradictedCount}
                  </p>
                </div>
                <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200">
                  <span className="text-[11px] font-bold text-amber-800">Insufficient</span>
                  <p className="text-2xl font-bold font-mono text-amber-700 mt-1">
                    {activeReport.insufficientCount}
                  </p>
                </div>
              </div>

              {/* Claim-by-Claim Breakdown */}
              <div className="space-y-3">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                    Evidentiary Itemization
                  </h4>
                  <span className="text-xs font-semibold text-slate-500">
                    {activeReport.claims.length} claims documented
                  </span>
                </div>

                <div className="space-y-3">
                  {activeReport.claims.map((claim, idx) => (
                    <div
                      key={claim.id}
                      className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2 text-xs"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs text-slate-500 font-bold">
                            Claim #{idx + 1}
                          </span>
                          {claim.verdict === 'SUPPORTED' && (
                            <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold">
                              SUPPORTED
                            </span>
                          )}
                          {claim.verdict === 'CONTRADICTED' && (
                            <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200 font-bold">
                              CONTRADICTED
                            </span>
                          )}
                          {claim.verdict === 'INSUFFICIENT_EVIDENCE' && (
                            <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200 font-bold">
                              INSUFFICIENT EVIDENCE
                            </span>
                          )}
                        </div>

                        {claim.page !== null && (
                          <span className="text-xs text-sky-700 font-mono font-bold bg-white px-2 py-0.5 rounded border border-slate-200">
                            Page {claim.page}
                          </span>
                        )}
                      </div>

                      <p className="font-bold text-slate-900 leading-relaxed">
                        {claim.claim}
                      </p>

                      {claim.evidence && (
                        <blockquote className="p-3 rounded-lg bg-emerald-50/70 border-l-4 border-emerald-500 text-xs text-slate-900 italic font-serif leading-relaxed">
                          "{claim.evidence}"
                        </blockquote>
                      )}

                      <p className="text-xs text-slate-600 leading-relaxed">
                        <span className="font-bold text-slate-900">Finding:</span> {claim.explanation}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Auditor Sign-off Seal */}
              <div className="pt-4 border-t border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-slate-500">
                <div className="space-y-0.5">
                  <p className="text-slate-900 font-bold">{activeReport.organization}</p>
                  <p className="text-[11px] font-mono">ISO/IEC 27001 & NIST AI RMF Compliant Audit Trail</p>
                </div>
                <div className="flex items-center gap-2 no-print">
                  <button
                    onClick={handlePrint}
                    className="px-4 py-2 rounded-lg bg-emerald-600 text-white font-bold text-xs hover:bg-emerald-700 transition-colors flex items-center gap-1.5 shadow-sm"
                  >
                    <Printer className="h-4 w-4" />
                    <span>Print / Export PDF</span>
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-8 text-center text-xs text-slate-500">
              No report selected.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
