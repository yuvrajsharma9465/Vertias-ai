'use client';

import React, { useState } from 'react';
import {
  User,
  Cpu,
  Lock,
  Palette,
  Check,
  Eye,
  EyeOff,
  Save,
} from 'lucide-react';
import { useApp } from '@/context/AppContext';

export default function SettingsPage() {
  const { settings, updateSettings } = useApp();
  const [activeTab, setActiveTab] = useState<'profile' | 'aiProvider' | 'privacy' | 'appearance'>('profile');
  const [showApiKey, setShowApiKey] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const [formData, setFormData] = useState(settings);

  const handleSave = () => {
    updateSettings(formData);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">
            Platform Settings & Configuration
          </h2>
          <p className="text-xs text-slate-500">
            Configure auditor credentials, AI verification models, security privacy controls, and UI density.
          </p>
        </div>

        <button
          onClick={handleSave}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition-colors shadow-sm"
        >
          {savedSuccess ? (
            <>
              <Check className="h-4 w-4" />
              <span>Settings Saved</span>
            </>
          ) : (
            <>
              <Save className="h-4 w-4" />
              <span>Save Changes</span>
            </>
          )}
        </button>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 text-xs">
        <button
          onClick={() => setActiveTab('profile')}
          className={`pb-3 px-3.5 font-bold transition-colors border-b-2 flex items-center gap-2 ${
            activeTab === 'profile'
              ? 'border-emerald-600 text-emerald-700'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <User className="h-4 w-4" />
          <span>Profile & Identity</span>
        </button>
        <button
          onClick={() => setActiveTab('aiProvider')}
          className={`pb-3 px-3.5 font-bold transition-colors border-b-2 flex items-center gap-2 ${
            activeTab === 'aiProvider'
              ? 'border-sky-600 text-sky-700'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <Cpu className="h-4 w-4" />
          <span>AI Provider & Models</span>
        </button>
        <button
          onClick={() => setActiveTab('privacy')}
          className={`pb-3 px-3.5 font-bold transition-colors border-b-2 flex items-center gap-2 ${
            activeTab === 'privacy'
              ? 'border-purple-600 text-purple-700'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <Lock className="h-4 w-4" />
          <span>Privacy & Compliance</span>
        </button>
        <button
          onClick={() => setActiveTab('appearance')}
          className={`pb-3 px-3.5 font-bold transition-colors border-b-2 flex items-center gap-2 ${
            activeTab === 'appearance'
              ? 'border-amber-600 text-amber-700'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <Palette className="h-4 w-4" />
          <span>Appearance</span>
        </button>
      </div>

      {/* Tab 1: Profile */}
      {activeTab === 'profile' && (
        <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-5 shadow-xs">
          <div className="border-b border-slate-100 pb-3">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Auditor Credentials & Certification
            </h3>
            <p className="text-[11px] text-slate-500">
              Information embedded on official verification dossiers and exported audit reports.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="space-y-1">
              <label className="text-slate-700 font-semibold">Auditor Full Name & Title</label>
              <input
                type="text"
                value={formData.profile.name}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    profile: { ...formData.profile, name: e.target.value },
                  })
                }
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:bg-white focus:border-emerald-500"
              />
            </div>

            <div className="space-y-1">
              <label className="text-slate-700 font-semibold">Official Email Address</label>
              <input
                type="email"
                value={formData.profile.email}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    profile: { ...formData.profile, email: e.target.value },
                  })
                }
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:bg-white focus:border-emerald-500"
              />
            </div>

            <div className="space-y-1">
              <label className="text-slate-700 font-semibold">Enterprise Organization</label>
              <input
                type="text"
                value={formData.profile.organization}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    profile: { ...formData.profile, organization: e.target.value },
                  })
                }
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:bg-white focus:border-emerald-500"
              />
            </div>

            <div className="space-y-1">
              <label className="text-slate-700 font-semibold">Role Specification</label>
              <input
                type="text"
                value={formData.profile.role}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    profile: { ...formData.profile, role: e.target.value },
                  })
                }
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:bg-white focus:border-emerald-500"
              />
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: AI Provider & Models */}
      {activeTab === 'aiProvider' && (
        <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-5 shadow-xs">
          <div className="border-b border-slate-100 pb-3">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Verification Engine & Model Integrations
            </h3>
            <p className="text-[11px] text-slate-500">
              Configure Gemini or local model endpoints used for claim extraction and evidentiary matching.
            </p>
          </div>

          <div className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-slate-700 font-semibold">AI Verification Engine</label>
                <select
                  value={formData.aiProvider.provider}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      aiProvider: {
                        ...formData.aiProvider,
                        provider: e.target.value as any,
                      },
                    })
                  }
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:bg-white focus:border-sky-500"
                >
                  <option value="gemini">Google Gemini (Recommended)</option>
                  <option value="anthropic">Anthropic Claude</option>
                  <option value="openai">OpenAI GPT-4o</option>
                  <option value="custom">Local Enterprise Inference / Ollama</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-slate-700 font-semibold">Model ID</label>
                <input
                  type="text"
                  value={formData.aiProvider.model}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      aiProvider: { ...formData.aiProvider, model: e.target.value },
                    })
                  }
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 font-mono text-[11px] focus:outline-none focus:bg-white focus:border-sky-500"
                />
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <label className="text-slate-700 font-semibold">API Key (Gemini or Provider Secret)</label>
                <span className="text-[11px] text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">Encrypted in browser storage</span>
              </div>
              <div className="relative">
                <input
                  type={showApiKey ? 'text' : 'password'}
                  value={formData.aiProvider.apiKey}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      aiProvider: { ...formData.aiProvider, apiKey: e.target.value },
                    })
                  }
                  placeholder="Paste your Gemini or Provider API Key here..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 pr-10 text-slate-900 font-mono text-[11px] focus:outline-none focus:bg-white focus:border-sky-500"
                />
                <button
                  type="button"
                  onClick={() => setShowApiKey(!showApiKey)}
                  className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-700"
                >
                  {showApiKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3 border-t border-slate-100">
              <div className="space-y-1.5">
                <div className="flex justify-between text-slate-700 font-medium">
                  <span>Temperature (Strict Factual):</span>
                  <span className="font-mono font-bold text-slate-900">{formData.aiProvider.temperature}</span>
                </div>
                <input
                  type="range"
                  min="0.0"
                  max="0.7"
                  step="0.05"
                  value={formData.aiProvider.temperature}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      aiProvider: {
                        ...formData.aiProvider,
                        temperature: parseFloat(e.target.value),
                      },
                    })
                  }
                  className="w-full accent-emerald-600"
                />
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between text-slate-700 font-medium">
                  <span>Minimum Confidence Threshold:</span>
                  <span className="font-mono font-bold text-slate-900">{formData.aiProvider.confidenceThreshold}%</span>
                </div>
                <input
                  type="range"
                  min="60"
                  max="99"
                  step="1"
                  value={formData.aiProvider.confidenceThreshold}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      aiProvider: {
                        ...formData.aiProvider,
                        confidenceThreshold: parseInt(e.target.value),
                      },
                    })
                  }
                  className="w-full accent-sky-600"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Privacy & Compliance */}
      {activeTab === 'privacy' && (
        <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-4 shadow-xs text-xs">
          <div className="border-b border-slate-100 pb-3">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Privacy, Data Retention & Audit Integrity
            </h3>
            <p className="text-[11px] text-slate-500">
              Compliance guardrails aligned with NIST SP 800-171, SOC2, and EU AI Act.
            </p>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between p-3.5 rounded-lg bg-slate-50 border border-slate-200">
              <div>
                <p className="font-bold text-slate-900">Zero-Data Retention Mode</p>
                <p className="text-[11px] text-slate-500">
                  Do not store input texts or extracted claims in persistent cache after verification completes.
                </p>
              </div>
              <input
                type="checkbox"
                checked={formData.privacy.zeroRetention}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    privacy: { ...formData.privacy, zeroRetention: e.target.checked },
                  })
                }
                className="h-4 w-4 accent-emerald-600 rounded cursor-pointer"
              />
            </div>

            <div className="flex items-center justify-between p-3.5 rounded-lg bg-slate-50 border border-slate-200">
              <div>
                <p className="font-bold text-slate-900">Cryptographic Audit Trail Logging</p>
                <p className="text-[11px] text-slate-500">
                  Compute SHA-256 hashes of every source document page and evidence citation.
                </p>
              </div>
              <input
                type="checkbox"
                checked={formData.privacy.auditTrail}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    privacy: { ...formData.privacy, auditTrail: e.target.checked },
                  })
                }
                className="h-4 w-4 accent-emerald-600 rounded cursor-pointer"
              />
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: Appearance */}
      {activeTab === 'appearance' && (
        <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-4 shadow-xs text-xs">
          <div className="border-b border-slate-100 pb-3">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Interface & Typography Display
            </h3>
            <p className="text-[11px] text-slate-500">
              Customizations for clean modern enterprise operational environments.
            </p>
          </div>

          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-slate-700 font-semibold">Layout Density</label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() =>
                    setFormData({
                      ...formData,
                      appearance: { ...formData.appearance, density: 'comfortable' },
                    })
                  }
                  className={`p-3.5 rounded-xl border text-left transition-all ${
                    formData.appearance.density === 'comfortable'
                      ? 'border-emerald-600 bg-emerald-50/50 text-slate-900 font-bold shadow-xs'
                      : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <p className="font-bold">Comfortable (Clean Modern)</p>
                  <p className="text-[11px] text-slate-500 mt-0.5">Standard enterprise padding and readability</p>
                </button>
                <button
                  type="button"
                  onClick={() =>
                    setFormData({
                      ...formData,
                      appearance: { ...formData.appearance, density: 'compact' },
                    })
                  }
                  className={`p-3.5 rounded-xl border text-left transition-all ${
                    formData.appearance.density === 'compact'
                      ? 'border-emerald-600 bg-emerald-50/50 text-slate-900 font-bold shadow-xs'
                      : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <p className="font-bold">Compact (SecOps)</p>
                  <p className="text-[11px] text-slate-500 mt-0.5">High data density for continuous monitoring</p>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
