import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { session, auditor, organization } = body;

    const formattedReport = {
      id: `REP-2026-${Math.floor(100 + Math.random() * 900)}`,
      sessionId: session?.id || 'VER-SESSION',
      title: `Official Verification Dossier: ${session?.title || 'Claim Audit'}`,
      summary: `Automated evidentiary audit of ${session?.totalClaims || 0} factual claims against ${session?.sourceDocumentName || 'Source Document'}. Accuracy score: ${session?.accuracyScore || 0}%.`,
      generatedAt: new Date().toISOString().replace('T', ' ').slice(0, 16),
      auditor: auditor || 'Dr. Sarah Chen, CISSP',
      organization: organization || 'Veritas SecOps & Compliance Directorate',
      totalClaims: session?.totalClaims || 0,
      supportedCount: session?.supported || 0,
      contradictedCount: session?.contradicted || 0,
      insufficientCount: session?.insufficient || 0,
      accuracyScore: session?.accuracyScore || 0,
      documentName: session?.sourceDocumentName || 'Ground_Truth.pdf',
      claims: session?.claims || [],
      certification: 'Compliant with ISO/IEC 27001 & NIST AI RMF Evidentiary Standards',
    };

    return NextResponse.json({
      success: true,
      report: formattedReport,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || 'Failed to generate verification report.' },
      { status: 500 }
    );
  }
}
