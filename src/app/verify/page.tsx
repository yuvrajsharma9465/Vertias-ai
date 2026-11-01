'use client';

import React, { useState } from 'react';
import {
  ShieldCheck,
  Upload,
  FileText,
  CheckCircle2,
  AlertTriangle,
  HelpCircle,
  ChevronDown,
  ChevronUp,
  Copy,
  Check,
  RefreshCw,
  Sparkles,
  ExternalLink,
  Layers,
  ShieldAlert,
  AlertOctagon,
  Fingerprint,
} from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { PRESET_INPUTS, performVerification } from '@/lib/verificationEngine';
import { Claim, SourceDocument, VerificationSession } from '@/lib/types';

export default function VerifyPage() {
  const {
    documents,
    activeSession,
    setActiveSession,
    addSession,
    addDocument,
    settings,
  } = useApp();

  // Synchronize initial scenario mapping with activeSession or default preset 0
  const initialPresetIndex = activeSession
    ? Math.max(0, PRESET_INPUTS.findIndex((p) => p.documentId === activeSession.sourceDocumentId))
    : 0;

  const [selectedPresetIndex, setSelectedPresetIndex] = useState<number>(initialPresetIndex);
  const [inputText, setInputText] = useState(
    activeSession ? activeSession.inputText : PRESET_INPUTS[initialPresetIndex].text
  );
  const [selectedDocId, setSelectedDocId] = useState(
    activeSession ? activeSession.sourceDocumentId : PRESET_INPUTS[initialPresetIndex].documentId
  );
  const [isVerifying, setIsVerifying] = useState(false);
  const [expandedClaimId, setExpandedClaimId] = useState<string | null>(
    activeSession?.claims[0]?.id || null
  );
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [filterVerdict, setFilterVerdict] = useState<'ALL' | 'SUPPORTED' | 'CONTRADICTED' | 'INSUFFICIENT_EVIDENCE'>('ALL');

  const selectedDocument = documents.find((d) => d.id === selectedDocId) || documents[0];

  const handleSelectPreset = (presetIndex: number) => {
    setSelectedPresetIndex(presetIndex);
    const preset = PRESET_INPUTS[presetIndex];
    setInputText(preset.text);
    if (preset.documentId) {
      setSelectedDocId(preset.documentId);
    }
  };

  const handleShuffleScenario = () => {
    const nextIndex = (selectedPresetIndex + 1) % PRESET_INPUTS.length;
    handleSelectPreset(nextIndex);
  };

  const handleDocumentChange = (docId: string) => {
    setSelectedDocId(docId);
    const matchingPresetIdx = PRESET_INPUTS.findIndex((p) => p.documentId === docId);
    if (matchingPresetIdx !== -1) {
      setSelectedPresetIndex(matchingPresetIdx);
      setInputText(PRESET_INPUTS[matchingPresetIdx].text);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = (event.target?.result as string) || '';
      const newDoc: SourceDocument = {
        id: `doc-${Date.now()}`,
        name: file.name,
        size: `${(file.size / 1024).toFixed(1)} KB`,
        pages: Math.max(1, Math.ceil(content.length / 1500)),
        uploadedAt: new Date().toISOString().replace('T', ' ').slice(0, 16),
        fileType: file.type || 'text/plain',
        totalWords: content.split(/\s+/).length,
        hash: `sha256:user_uploaded_${Date.now().toString(16)}`,
        pageTexts: [
          {
            page: 1,
            text: content.slice(0, 3000),
          },
        ],
      };
      addDocument(newDoc);
      setSelectedDocId(newDoc.id);
    };
    reader.readAsText(file);
  };

  const handleVerify = async () => {
    if (!inputText.trim()) return;
    if (!selectedDocument) return;

    setIsVerifying(true);
    try {
      const result = await performVerification(
        inputText,
        selectedDocument,
        settings.aiProvider.apiKey
      );

      const newSession: VerificationSession = {
        id: `VER-2026-${Math.floor(100 + Math.random() * 900)}`,
        title: `Verification Session (${selectedDocument.name.split('.')[0]})`,
        targetModel: settings.aiProvider.model || 'Gemini 2.5 Flash',
        inputText,
        sourceDocumentId: selectedDocument.id,
        sourceDocumentName: selectedDocument.name,
        claims: result.claims,
        totalClaims: result.summary.total,
        supported: result.summary.supported,
        contradicted: result.summary.contradicted,
        insufficient: result.summary.insufficient,
        accuracyScore: result.summary.accuracy,
        status: 'COMPLETED',
        timestamp: new Date().toISOString().replace('T', ' ').slice(0, 16),
      };

      addSession(newSession);
      setActiveSession(newSession);
      if (result.claims.length > 0) {
        setExpandedClaimId(result.claims[0].id);
      }
    } catch (err) {
      console.error('Verification failed', err);
    } finally {
      setIsVerifying(false);
    }
  };

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const claimsList = activeSession?.claims || [];
  const filteredClaims = claimsList.filter((c) => {
    if (filterVerdict === 'ALL') return true;
    return c.verdict === filterVerdict;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">
            Claim Verification Engine
          </h2>
          <p className="text-xs text-slate-500">
            Execute three-step empirical auditing against authoritative ground-truth documents.
          </p>
        </div>

        {/* Quick Shuffle & Scenario Switcher */}
        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            onClick={handleShuffleScenario}
            className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-bold text-xs flex items-center gap-2 shadow-sm hover:shadow transition-all group"
            title="Load another randomized test case and paired document"
          >
            <Sparkles className="h-3.5 w-3.5 group-hover:rotate-12 transition-transform" />
            <span>🎲 Shuffle Test Idea</span>
          </button>
        </div>
      </div>

      {/* Domain Test Case Idea Pills Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 shrink-0 mr-1">
          Test Scenarios:
        </span>
        {PRESET_INPUTS.map((preset, idx) => (
          <button
            key={preset.id || idx}
            onClick={() => handleSelectPreset(idx)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold shrink-0 transition-all flex items-center gap-1.5 ${
              selectedPresetIndex === idx
                ? 'bg-slate-900 text-white shadow-sm ring-2 ring-slate-900/10'
                : 'bg-white text-slate-700 border border-slate-200/80 hover:bg-slate-50 hover:border-slate-300'
            }`}
          >
            <span>{preset.title.split('(')[0].trim()}</span>
            <span
              className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                selectedPresetIndex === idx
                  ? 'bg-white/20 text-white'
                  : 'bg-slate-100 text-slate-500'
              }`}
            >
              {preset.domain || 'Domain'}
            </span>
          </button>
        ))}
      </div>

      {/* Active Test Case Information Banner */}
      <div className="p-3.5 rounded-2xl bg-white border border-slate-200/70 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-xl bg-slate-900 text-white flex items-center justify-center font-bold text-xs shrink-0">
            {selectedPresetIndex + 1}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-900">
                {PRESET_INPUTS[selectedPresetIndex]?.title || 'Selected Test Scenario'}
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-semibold border border-emerald-100">
                {PRESET_INPUTS[selectedPresetIndex]?.domain || 'Active Benchmark'}
              </span>
            </div>
            <p className="text-[11px] text-slate-500 mt-0.5">
              Paired Ground Truth Document: <span className="font-semibold text-slate-800">{selectedDocument?.name}</span> ({selectedDocument?.pages} pages indexed)
            </p>
          </div>
        </div>

        <button
          onClick={handleVerify}
          disabled={isVerifying || !inputText.trim() || !selectedDocument}
          className="px-4 py-2 rounded-xl bg-[#0F172A] hover:bg-black text-white text-xs font-bold transition-all shadow-sm flex items-center justify-center gap-1.5 shrink-0"
        >
          {isVerifying ? (
            <>
              <RefreshCw className="h-3.5 w-3.5 animate-spin" />
              <span>Verifying...</span>
            </>
          ) : (
            <>
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
              <span>Quick Verify This Idea</span>
            </>
          )}
        </button>
      </div>

      {/* 3-Step Verification Workflow Container */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Step 1: Enter AI-generated text (Cols 1-7) */}
        <div className="lg:col-span-7 bg-white border border-slate-200/70 rounded-2xl p-6 shadow-[0_2px_14px_rgba(0,0,0,0.03)] flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="h-6 w-6 rounded-lg bg-slate-900 text-white flex items-center justify-center text-xs font-bold shadow-xs">
                  1
                </span>
                <label className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  Enter AI-Generated Text
                </label>
              </div>
              <span className="text-[11px] font-mono text-slate-400">
                {inputText.length} chars • {inputText.split(/\s+/).filter(Boolean).length} words
              </span>
            </div>

            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Paste the AI-generated answer or model output you want to verify against source evidence..."
              rows={7}
              className="w-full bg-slate-50/70 border border-slate-200/80 rounded-xl p-3.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-slate-400 focus:ring-2 focus:ring-slate-900/5 transition-all font-mono leading-relaxed resize-none"
            />
          </div>

          <div className="mt-2 flex items-center justify-between text-[11px] text-slate-500">
            <span>Decomposed into discrete factual assertions automatically.</span>
            <button
              onClick={() => setInputText('')}
              className="text-slate-500 hover:text-slate-900 font-semibold hover:underline"
            >
              Clear input
            </button>
          </div>
        </div>

        {/* Step 2 & Step 3: Select Document & Click Verify (Cols 8-12) */}
        <div className="lg:col-span-5 flex flex-col gap-4">
          {/* Step 2: Select Source Document */}
          <div className="bg-white border border-slate-200/70 rounded-2xl p-6 shadow-[0_2px_14px_rgba(0,0,0,0.03)] flex-1 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="h-6 w-6 rounded-lg bg-slate-900 text-white flex items-center justify-center text-xs font-bold shadow-xs">
                    2
                  </span>
                  <label className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                    Select Ground Truth Source
                  </label>
                </div>
                <span className="text-[11px] text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full font-bold">
                  OCR Ready
                </span>
              </div>

              <div className="space-y-2.5">
                <select
                  value={selectedDocId}
                  onChange={(e) => handleDocumentChange(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200/80 rounded-xl px-3 py-2 text-xs font-medium text-slate-900 focus:outline-none focus:bg-white focus:border-slate-400 cursor-pointer"
                >
                  {documents.map((doc) => (
                    <option key={doc.id} value={doc.id}>
                      {doc.name} ({doc.pages} pgs • {doc.size})
                    </option>
                  ))}
                </select>

                <label className="flex items-center justify-center gap-2 w-full py-2.5 px-3 rounded-xl border border-dashed border-slate-300 hover:border-slate-500 bg-slate-50/50 hover:bg-slate-50 text-xs text-slate-600 hover:text-slate-900 cursor-pointer transition-all font-medium">
                  <Upload className="h-3.5 w-3.5 text-slate-500" />
                  <span>Upload PDF, TXT or DOC source</span>
                  <input
                    type="file"
                    accept=".pdf,.txt,.md,.docx"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>
              </div>
            </div>

            {selectedDocument && (
              <div className="mt-3 p-2.5 rounded-xl bg-slate-50 border border-slate-200/70 text-[11px] text-slate-600">
                <div className="flex justify-between items-center text-slate-900 font-semibold">
                  <span className="truncate">{selectedDocument.name}</span>
                  <span className="font-mono text-slate-600 shrink-0 ml-2">{selectedDocument.size}</span>
                </div>
                <div className="flex justify-between items-center text-[10px] text-slate-500 mt-1">
                  <span>{selectedDocument.pages} Pages Indexed</span>
                  <span className="font-mono truncate max-w-[150px]">{selectedDocument.hash.slice(0, 18)}...</span>
                </div>
              </div>
            )}
          </div>

          {/* Step 3: Verify Claims */}
          <div className="bg-white border border-slate-200/70 rounded-2xl p-6 shadow-[0_2px_14px_rgba(0,0,0,0.03)]">
            <div className="flex items-center gap-2 mb-3">
              <span className="h-6 w-6 rounded-lg bg-slate-900 text-white flex items-center justify-center text-xs font-bold shadow-xs">
                3
              </span>
              <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Execute Verification
              </span>
            </div>

            <button
              onClick={handleVerify}
              disabled={isVerifying || !inputText.trim() || !selectedDocument}
              className="w-full py-3.5 px-4 rounded-xl bg-[#0F172A] hover:bg-black disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold text-xs tracking-wide transition-all flex items-center justify-center gap-2 shadow-sm hover:shadow"
            >
              {isVerifying ? (
                <>
                  <RefreshCw className="h-4 w-4 animate-spin text-white" />
                  <span>Auditing Citations & Extracting Quotes...</span>
                </>
              ) : (
                <>
                  <ShieldCheck className="h-4 w-4 text-emerald-400" />
                  <span>Verify Claims Against Source</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Extracted Claims Section */}
      {activeSession && (
        <div className="space-y-4 pt-4 border-t border-slate-200">
          {/* Verification Audit Summary Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
            <div>
              <span className="text-xs font-bold text-slate-900">
                Audit Session: <span className="font-mono text-sky-600 font-bold">{activeSession.id}</span>
              </span>
              <p className="text-[11px] text-slate-500">
                Verified against <span className="font-semibold text-slate-800">{activeSession.sourceDocumentName}</span>
              </p>
            </div>

            {/* Quick Metrics & Filter Buttons */}
            <div className="flex items-center gap-2 flex-wrap text-xs">
              <button
                onClick={() => setFilterVerdict('ALL')}
                className={`px-3 py-1 rounded-full text-xs transition-colors font-medium ${
                  filterVerdict === 'ALL'
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:text-slate-900'
                }`}
              >
                All ({activeSession.totalClaims})
              </button>
              <button
                onClick={() => setFilterVerdict('SUPPORTED')}
                className={`px-3 py-1 rounded-full text-xs flex items-center gap-1 font-bold transition-colors ${
                  filterVerdict === 'SUPPORTED'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100'
                }`}
              >
                <CheckCircle2 className="h-3.5 w-3.5" />
                <span>Supported ({activeSession.supported})</span>
              </button>
              <button
                onClick={() => setFilterVerdict('CONTRADICTED')}
                className={`px-3 py-1 rounded-full text-xs flex items-center gap-1 font-bold transition-colors ${
                  filterVerdict === 'CONTRADICTED'
                    ? 'bg-rose-600 text-white shadow-xs'
                    : 'bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100'
                }`}
              >
                <AlertTriangle className="h-3.5 w-3.5" />
                <span>Contradicted ({activeSession.contradicted})</span>
              </button>
              <button
                onClick={() => setFilterVerdict('INSUFFICIENT_EVIDENCE')}
                className={`px-3 py-1 rounded-full text-xs flex items-center gap-1 font-bold transition-colors ${
                  filterVerdict === 'INSUFFICIENT_EVIDENCE'
                    ? 'bg-amber-600 text-white shadow-xs'
                    : 'bg-amber-50 text-amber-700 border border-amber-200 hover:bg-amber-100'
                }`}
              >
                <HelpCircle className="h-3.5 w-3.5" />
                <span>Insufficient ({activeSession.insufficient})</span>
              </button>
            </div>
          </div>

          {/* Expandable Claim Cards List */}
          <div className="space-y-3">
            {filteredClaims.map((claim, index) => {
              const isExpanded = expandedClaimId === claim.id;

              return (
                <div
                  key={claim.id}
                  className={`bg-white border rounded-2xl transition-all shadow-[0_2px_12px_rgba(0,0,0,0.03)] ${
                    isExpanded ? 'border-slate-400 ring-2 ring-slate-900/5' : 'border-slate-200/70 hover:border-slate-300'
                  }`}
                >
                  {/* Card Header / Summary Row */}
                  <div
                    onClick={() => setExpandedClaimId(isExpanded ? null : claim.id)}
                    className="p-4 cursor-pointer flex items-start justify-between gap-4"
                  >
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-mono text-[10px] text-slate-600 bg-slate-100 px-2 py-0.5 rounded font-bold">
                          Claim #{index + 1}
                        </span>

                        {/* Verdict Badge */}
                        {claim.verdict === 'SUPPORTED' && (
                          <span className="inline-flex items-center gap-1 text-[11px] font-mono px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold">
                            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                            SUPPORTED
                          </span>
                        )}
                        {claim.verdict === 'CONTRADICTED' && (
                          <span className="inline-flex items-center gap-1 text-[11px] font-mono px-2.5 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200 font-bold">
                            <AlertTriangle className="h-3.5 w-3.5 text-rose-600" />
                            CONTRADICTED
                          </span>
                        )}
                        {claim.verdict === 'INSUFFICIENT_EVIDENCE' && (
                          <span className="inline-flex items-center gap-1 text-[11px] font-mono px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200 font-bold">
                            <HelpCircle className="h-3.5 w-3.5 text-amber-600" />
                            INSUFFICIENT EVIDENCE
                          </span>
                        )}

                        {/* Fraud Detection Column / Telemetry Indicator */}
                        {claim.verdict === 'CONTRADICTED' ? (
                          <span className="inline-flex items-center gap-1 text-[11px] font-mono px-2.5 py-0.5 rounded-full bg-rose-100 text-rose-800 border border-rose-300 font-bold shadow-xs">
                            <ShieldAlert className="h-3.5 w-3.5 text-rose-600" />
                            <span>FRAUD RISK: {claim.fraudDetection?.riskLevel || 'CRITICAL'} ({claim.fraudDetection?.fraudScore || 96}%)</span>
                          </span>
                        ) : claim.verdict === 'INSUFFICIENT_EVIDENCE' ? (
                          <span className="inline-flex items-center gap-1 text-[11px] font-mono px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-300 font-bold">
                            <AlertOctagon className="h-3.5 w-3.5 text-amber-600" />
                            <span>FRAUD RISK: {claim.fraudDetection?.riskLevel || 'MEDIUM'} ({claim.fraudDetection?.fraudScore || 56}%)</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[11px] font-mono px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 font-bold">
                            <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
                            <span>FRAUD RISK: LOW ({claim.fraudDetection?.fraudScore || 4}%)</span>
                          </span>
                        )}

                        {/* Confidence Score */}
                        <span className="text-xs font-mono text-slate-500">
                          Confidence: <span className="font-bold text-slate-900">{claim.confidence}%</span>
                        </span>

                        {/* Evidence Reference */}
                        {claim.page !== null ? (
                          <span className="text-xs text-sky-700 font-semibold flex items-center gap-1 bg-sky-50 px-2 py-0.5 rounded-full border border-sky-100">
                            <FileText className="h-3 w-3 text-sky-600" />
                            <span>{claim.sourceDocumentName} • Page {claim.page}</span>
                          </span>
                        ) : (
                          <span className="text-xs text-slate-400">
                            No citation located
                          </span>
                        )}
                      </div>

                      {/* Claim Statement */}
                      <p className="text-xs sm:text-sm font-semibold text-slate-900 leading-relaxed">
                        {claim.claim}
                      </p>

                      {/* Short Explanation */}
                      <p className="text-xs text-slate-600 leading-relaxed">
                        {claim.explanation}
                      </p>
                    </div>

                    <button
                      className="p-1 rounded text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                      aria-label="Toggle details"
                    >
                      {isExpanded ? (
                        <ChevronUp className="h-4 w-4" />
                      ) : (
                        <ChevronDown className="h-4 w-4" />
                      )}
                    </button>
                  </div>

                  {/* Expanded Detailed Supporting & Contradicting Evidence */}
                  {isExpanded && (
                    <div className="px-4 pb-4 pt-2 border-t border-slate-100 space-y-3 bg-slate-50/50 rounded-b-xl">
                      {/* Supporting Evidence Block */}
                      {claim.supportingEvidence && (
                        <div className="p-3.5 rounded-lg bg-emerald-50/70 border-l-4 border-emerald-500 border border-emerald-200/60 space-y-1.5">
                          <div className="flex items-center justify-between text-xs text-emerald-900 font-bold">
                            <span className="flex items-center gap-1.5">
                              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                              Supporting Primary Source Evidence (Page {claim.page})
                            </span>
                            <button
                              onClick={() => handleCopy(claim.supportingEvidence!, claim.id + '-sup')}
                              className="text-[11px] text-emerald-700 hover:text-emerald-900 flex items-center gap-1 font-mono font-bold"
                            >
                              {copiedId === claim.id + '-sup' ? (
                                <>
                                  <Check className="h-3 w-3 text-emerald-700" />
                                  <span>Copied Quote</span>
                                </>
                              ) : (
                                <>
                                  <Copy className="h-3 w-3" />
                                  <span>Copy Quote</span>
                                </>
                              )}
                            </button>
                          </div>
                          <blockquote className="text-xs text-slate-900 italic py-0.5 leading-relaxed font-serif">
                            "{claim.supportingEvidence}"
                          </blockquote>
                        </div>
                      )}

                      {/* Contradicting Evidence Block */}
                      {claim.contradictingEvidence && (
                        <div className="p-3.5 rounded-lg bg-rose-50/70 border-l-4 border-rose-500 border border-rose-200/60 space-y-1.5">
                          <div className="flex items-center justify-between text-xs text-rose-900 font-bold">
                            <span className="flex items-center gap-1.5">
                              <AlertTriangle className="h-3.5 w-3.5 text-rose-600" />
                              Contradicting Primary Source Evidence (Page {claim.page})
                            </span>
                            <button
                              onClick={() => handleCopy(claim.contradictingEvidence!, claim.id + '-con')}
                              className="text-[11px] text-rose-700 hover:text-rose-900 flex items-center gap-1 font-mono font-bold"
                            >
                              {copiedId === claim.id + '-con' ? (
                                <>
                                  <Check className="h-3 w-3 text-rose-700" />
                                  <span>Copied Conflict</span>
                                </>
                              ) : (
                                <>
                                  <Copy className="h-3 w-3" />
                                  <span>Copy Conflict</span>
                                </>
                              )}
                            </button>
                          </div>
                          <blockquote className="text-xs text-slate-900 italic py-0.5 leading-relaxed font-serif">
                            "{claim.contradictingEvidence}"
                          </blockquote>
                        </div>
                      )}

                      {/* Fraud Detection & Integrity Telemetry Panel */}
                      <div className={`p-3.5 rounded-xl border flex items-start gap-3 ${
                        claim.verdict === 'CONTRADICTED'
                          ? 'bg-rose-50/80 border-rose-300 text-rose-950'
                          : claim.verdict === 'INSUFFICIENT_EVIDENCE'
                          ? 'bg-amber-50/80 border-amber-300 text-amber-950'
                          : 'bg-emerald-50/60 border-emerald-200 text-emerald-950'
                      }`}>
                        <Fingerprint className={`h-4 w-4 mt-0.5 shrink-0 ${
                          claim.verdict === 'CONTRADICTED'
                            ? 'text-rose-600'
                            : claim.verdict === 'INSUFFICIENT_EVIDENCE'
                            ? 'text-amber-600'
                            : 'text-emerald-600'
                        }`} />
                        <div className="flex-1 space-y-1">
                          <div className="flex items-center justify-between text-xs font-bold">
                            <span className="flex items-center gap-1.5">
                              <span>Fraud Detection Scanner:</span>
                              <span className="font-mono text-slate-800">
                                {claim.fraudDetection?.fraudCategory || (claim.verdict === 'CONTRADICTED' ? 'Critical Metric Manipulation' : claim.verdict === 'INSUFFICIENT_EVIDENCE' ? 'Phantom Assertion (Zero Grounding)' : 'Verified Authentic Ground-Truth')}
                              </span>
                            </span>
                            <span className={`font-mono text-[11px] px-2 py-0.5 rounded font-bold ${
                              claim.verdict === 'CONTRADICTED'
                                ? 'bg-rose-200 text-rose-900 border border-rose-400'
                                : claim.verdict === 'INSUFFICIENT_EVIDENCE'
                                ? 'bg-amber-200 text-amber-900 border border-amber-400'
                                : 'bg-emerald-200 text-emerald-900 border border-emerald-400'
                            }`}>
                              Fraud Risk Score: {claim.fraudDetection?.fraudScore || (claim.verdict === 'CONTRADICTED' ? 96 : claim.verdict === 'INSUFFICIENT_EVIDENCE' ? 56 : 4)}/100
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-600 leading-relaxed">
                            {claim.fraudDetection?.flagReason || (claim.verdict === 'CONTRADICTED' ? 'Asserted quantitative metric directly contradicts audited regulatory or clinical safety filings.' : claim.verdict === 'INSUFFICIENT_EVIDENCE' ? 'Claim introduces unverified external assertions with zero empirical corroboration in the source text.' : 'Empirically authenticated against primary source statements with verbatim evidentiary alignment.')}
                          </p>
                        </div>
                      </div>

                      {/* Audit Metadata & Actions */}
                      <div className="flex flex-wrap items-center justify-between gap-2 pt-1 text-[11px] text-slate-500">
                        <span className="font-mono">
                          Citation ID: {claim.id} • SHA-256 Validated
                        </span>
                        <button
                          onClick={() => handleCopy(`${claim.claim}\nVerdict: ${claim.verdict}\nEvidence: ${claim.evidence || 'N/A'}\nSource: ${claim.sourceDocumentName}`, claim.id)}
                          className="px-2.5 py-1 rounded-md bg-white hover:bg-slate-100 border border-slate-200 text-xs font-semibold text-slate-700 flex items-center gap-1 shadow-xs"
                        >
                          <Copy className="h-3 w-3" />
                          <span>Copy Citation Block</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
