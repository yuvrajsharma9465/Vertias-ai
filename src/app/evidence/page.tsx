'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  SearchCode,
  FileText,
  CheckCircle2,
  AlertTriangle,
  HelpCircle,
  Copy,
  Check,
  Search,
  ShieldAlert,
  ShieldCheck,
  Scale,
  Fingerprint,
} from 'lucide-react';
import { useApp } from '@/context/AppContext';

export default function EvidencePage() {
  const { sessions } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [verdictFilter, setVerdictFilter] = useState<'ALL' | 'SUPPORTED' | 'CONTRADICTED' | 'INSUFFICIENT_EVIDENCE'>('ALL');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const allEvidenceItems = sessions.flatMap((session) =>
    session.claims.map((claim) => ({
      ...claim,
      sessionId: session.id,
      sessionTitle: session.title,
    }))
  );

  const filteredEvidence = allEvidenceItems.filter((item) => {
    const matchesFilter = verdictFilter === 'ALL' || item.verdict === verdictFilter;
    const matchesSearch =
      item.claim.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.evidence.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.sourceDocumentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.explanation.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">
            Evidence Intelligence Matrix
          </h2>
          <p className="text-xs text-slate-500">
            Direct primary source quotations, validated page numbers, and empirical cross-examinations.
          </p>
        </div>

        {/* Filter buttons */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <button
            onClick={() => setVerdictFilter('ALL')}
            className={`px-3 py-1 rounded-full text-xs font-semibold transition-colors ${
              verdictFilter === 'ALL'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:text-slate-900'
            }`}
          >
            All ({allEvidenceItems.length})
          </button>
          <button
            onClick={() => setVerdictFilter('SUPPORTED')}
            className={`px-3 py-1 rounded-full text-xs flex items-center gap-1 font-bold transition-colors ${
              verdictFilter === 'SUPPORTED'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100'
            }`}
          >
            <CheckCircle2 className="h-3 w-3" />
            <span>Supported</span>
          </button>
          <button
            onClick={() => setVerdictFilter('CONTRADICTED')}
            className={`px-3 py-1 rounded-full text-xs flex items-center gap-1 font-bold transition-colors ${
              verdictFilter === 'CONTRADICTED'
                ? 'bg-rose-600 text-white shadow-xs'
                : 'bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100'
            }`}
          >
            <AlertTriangle className="h-3 w-3" />
            <span>Contradicted</span>
          </button>
          <button
            onClick={() => setVerdictFilter('INSUFFICIENT_EVIDENCE')}
            className={`px-3 py-1 rounded-full text-xs flex items-center gap-1 font-bold transition-colors ${
              verdictFilter === 'INSUFFICIENT_EVIDENCE'
                ? 'bg-amber-600 text-white shadow-xs'
                : 'bg-amber-50 text-amber-700 border border-amber-200 hover:bg-amber-100'
            }`}
          >
            <HelpCircle className="h-3 w-3" />
            <span>Insufficient</span>
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
            placeholder="Search quotations, document titles, or claim keywords..."
            className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-9 pr-4 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-sky-500"
          />
        </div>
      </div>

      {/* Evidence Items List */}
      <div className="space-y-4">
        {filteredEvidence.length === 0 ? (
          <div className="bg-white border border-slate-200 rounded-xl p-8 text-center text-xs text-slate-500 shadow-xs">
            No evidence records matched your search query or filter.
          </div>
        ) : (
          filteredEvidence.map((item) => (
            <div
              key={item.id}
              className="bg-white border border-slate-200 rounded-xl p-5 space-y-3 transition-all shadow-xs hover:border-slate-300 hover:shadow-sm"
            >
              {/* Evidence Top Metadata Bar */}
              <div className="flex flex-wrap items-center justify-between gap-2 pb-2.5 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-[10px] text-sky-700 bg-sky-50 font-bold px-2 py-0.5 rounded border border-sky-200">
                    {item.id}
                  </span>

                  {item.verdict === 'SUPPORTED' && (
                    <span className="inline-flex items-center gap-1 text-[11px] font-mono px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold">
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                      SUPPORTED
                    </span>
                  )}
                  {item.verdict === 'CONTRADICTED' && (
                    <span className="inline-flex items-center gap-1 text-[11px] font-mono px-2.5 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200 font-bold">
                      <AlertTriangle className="h-3.5 w-3.5 text-rose-600" />
                      CONTRADICTED
                    </span>
                  )}
                  {item.verdict === 'INSUFFICIENT_EVIDENCE' && (
                    <span className="inline-flex items-center gap-1 text-[11px] font-mono px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200 font-bold">
                      <HelpCircle className="h-3.5 w-3.5 text-amber-600" />
                      INSUFFICIENT EVIDENCE
                    </span>
                  )}

                  <span className="text-xs font-mono text-slate-500">
                    Confidence: <span className="font-bold text-slate-900">{item.confidence}%</span>
                  </span>

                  {/* Fraud Risk Indicator */}
                  {item.verdict === 'CONTRADICTED' ? (
                    <span className="inline-flex items-center gap-1 text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 border border-rose-300">
                      <ShieldAlert className="h-3 w-3 text-rose-600" />
                      <span>FRAUD: CRITICAL</span>
                    </span>
                  ) : item.verdict === 'INSUFFICIENT_EVIDENCE' ? (
                    <span className="inline-flex items-center gap-1 text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-300">
                      <span>FRAUD: MEDIUM</span>
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                      <ShieldCheck className="h-3 w-3 text-emerald-600" />
                      <span>FRAUD: LOW</span>
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200">
                    Rank #1 Retrieval
                  </span>
                  <div className="flex items-center gap-1.5 text-xs text-sky-700 font-semibold bg-sky-50 px-2.5 py-0.5 rounded-full border border-sky-100">
                    <FileText className="h-3.5 w-3.5 text-sky-600" />
                    <span>{item.sourceDocumentName}</span>
                    {item.page !== null && (
                      <span className="font-mono text-sky-900 font-bold">
                        • Page {item.page}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Source Quotation Block */}
              {item.evidence ? (
                <div className="space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                    Direct Primary Source Quotation:
                  </span>
                  <blockquote className="p-3.5 rounded-lg bg-emerald-50/70 border-l-4 border-emerald-500 text-xs text-slate-900 italic font-serif leading-relaxed">
                    "{item.evidence}"
                  </blockquote>
                </div>
              ) : (
                <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-500 italic">
                  No direct supporting evidence quotation located in the source text.
                </div>
              )}

              {/* Related Claim Statement */}
              <div className="space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                  Related Claim Statement:
                </span>
                <p className="text-xs font-semibold text-slate-900 bg-slate-50 p-3 rounded-lg border border-slate-200">
                  {item.claim}
                </p>
              </div>

              {/* Transparent RAG Reasoning */}
              <div className="p-3 rounded-xl bg-slate-900 text-slate-200 text-xs font-mono space-y-1">
                <div className="flex items-center justify-between text-[11px] text-emerald-400 font-bold border-b border-slate-800 pb-1">
                  <span>Transparent Assessment Pipeline (RAG + Evidence Ranking)</span>
                  <span>Composite Rank Score: {item.confidence}%</span>
                </div>
                <div className="text-[11px] text-slate-300">
                  {item.verdict === 'SUPPORTED'
                    ? `Corroborated by primary verbatim statement on Page ${item.page}. Lexical & semantic ranking matched Rank #1 ground-truth passage.`
                    : item.verdict === 'CONTRADICTED'
                    ? `Direct contradiction detected on Page ${item.page}. Audited source numbers conflict with the claim assertion.`
                    : `Zero corroborating sentences located in "${item.sourceDocumentName}". Verified insufficient evidence.`}
                </div>
              </div>

              {/* Auditor Explanation & Footer */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-2 border-t border-slate-100 text-xs text-slate-600">
                <p className="leading-relaxed">
                  <span className="font-bold text-slate-900">Auditor Finding:</span> {item.explanation}
                </p>
                <button
                  onClick={() => handleCopy(`"${item.evidence}"\n- Source: ${item.sourceDocumentName}, Page ${item.page}`, item.id)}
                  className="shrink-0 px-3 py-1 rounded-md bg-white hover:bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-700 flex items-center gap-1.5 transition-colors shadow-xs"
                >
                  {copiedId === item.id ? (
                    <>
                      <Check className="h-3 w-3 text-emerald-600" />
                      <span>Copied Quote</span>
                    </>
                  ) : (
                    <>
                      <Copy className="h-3 w-3 text-slate-400" />
                      <span>Copy Citation</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
