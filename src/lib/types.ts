export type Verdict = 'SUPPORTED' | 'CONTRADICTED' | 'INSUFFICIENT_EVIDENCE';

export type FraudRiskLevel = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export interface FraudAnalysis {
  riskLevel: FraudRiskLevel;
  fraudScore: number; // 0 - 100
  fraudCategory: string; // e.g. "Metric Manipulation", "Factual Fabrication", "Phantom Assertion", "Verified Authentic"
  flagReason: string;
}

export interface EvidenceSnippet {
  id: string;
  quote: string;
  documentName: string;
  page: number | null;
  type: 'supporting' | 'contradicting';
  confidence: number;
}

export interface Claim {
  id: string;
  claim: string;
  verdict: Verdict;
  confidence: number; // 0 - 100
  evidence: string; // Exact quote from source
  page: number | null;
  explanation: string;
  supportingEvidence?: string;
  contradictingEvidence?: string;
  sourceDocumentName: string;
  verifiedAt: string;
  fraudDetection?: FraudAnalysis;
}

export interface DocumentPage {
  page: number;
  text: string;
}

export interface SourceDocument {
  id: string;
  name: string;
  size: string;
  pages: number;
  uploadedAt: string;
  fileType: string;
  pageTexts: DocumentPage[];
  totalWords: number;
  hash: string;
}

export interface VerificationSession {
  id: string;
  title: string;
  targetModel: string;
  inputText: string;
  sourceDocumentId: string;
  sourceDocumentName: string;
  claims: Claim[];
  totalClaims: number;
  supported: number;
  contradicted: number;
  insufficient: number;
  accuracyScore: number;
  status: 'COMPLETED' | 'IN_PROGRESS' | 'FAILED';
  timestamp: string;
}

export interface VerificationReport {
  id: string;
  sessionId: string;
  title: string;
  summary: string;
  generatedAt: string;
  auditor: string;
  organization: string;
  totalClaims: number;
  supportedCount: number;
  contradictedCount: number;
  insufficientCount: number;
  accuracyScore: number;
  documentName: string;
  claims: Claim[];
}

export interface UserSettings {
  profile: {
    name: string;
    email: string;
    organization: string;
    role: string;
  };
  aiProvider: {
    provider: 'gemini' | 'openai' | 'anthropic' | 'custom';
    model: string;
    apiKey: string;
    temperature: number;
    confidenceThreshold: number;
  };
  privacy: {
    zeroRetention: boolean;
    auditTrail: boolean;
    anonymizeSources: boolean;
  };
  appearance: {
    density: 'comfortable' | 'compact';
    highContrast: boolean;
    monoFont: boolean;
  };
}
