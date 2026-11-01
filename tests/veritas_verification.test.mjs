import test from 'node:test';
import assert from 'node:assert';
import {
  extractAtomicClaims,
  verifyClaimAgainstDocument,
  analyzeFraudRisk,
  buildTransparentAssessment,
  INITIAL_DOCUMENTS,
  PRESET_INPUTS
} from '../src/lib/verificationEngine.ts';

const cyberDoc = INITIAL_DOCUMENTS.find(d => d.id === 'doc-sec-01');
const finDoc = INITIAL_DOCUMENTS.find(d => d.id === 'doc-fin-03');
const pharmaDoc = INITIAL_DOCUMENTS.find(d => d.id === 'doc-pharma-02');
const ndaDoc = INITIAL_DOCUMENTS.find(d => d.id === 'doc-nda-01');
const patentDoc = INITIAL_DOCUMENTS.find(d => d.id === 'doc-patent-04');
const esgDoc = INITIAL_DOCUMENTS.find(d => d.id === 'doc-esg-05');

test('1. Multi-Claim Paragraph Splitting: Splits paragraph into discrete atomic factual statements', () => {
  const paragraph = `Total ransomware attacks across Fortune 500 enterprises rose by 14.2% year-over-year. The financial sector accounted for 38% of all targeted intrusions. Total ransom payments skyrocketed by 45% because companies lacked backups. European Union completely banned all endpoint AI agents.`;

  const claims = extractAtomicClaims(paragraph);
  assert.strictEqual(claims.length, 4, 'Must extract exactly 4 atomic claims from paragraph');
  assert.ok(claims[0].includes('rose by 14.2%'));
  assert.ok(claims[1].includes('accounted for 38%'));
  assert.ok(claims[2].includes('skyrocketed by 45%'));
  assert.ok(claims[3].includes('European Union'));
});

test('2. Partially Supported Paragraph: Never marks whole paragraph Supported when only one sentence matches', () => {
  const partiallySupportedParagraph = `Total ransomware attacks across Fortune 500 enterprises rose by 14.2% year-over-year. Total ransom payments skyrocketed by 45% because companies lacked backups. European Union completely banned all endpoint AI agents.`;

  const claims = extractAtomicClaims(partiallySupportedParagraph);
  assert.strictEqual(claims.length, 3);

  const res1 = verifyClaimAgainstDocument(claims[0], cyberDoc);
  const res2 = verifyClaimAgainstDocument(claims[1], cyberDoc);
  const res3 = verifyClaimAgainstDocument(claims[2], cyberDoc);

  assert.strictEqual(res1.verdict, 'SUPPORTED', 'First sentence should be supported');
  assert.strictEqual(res1.page, 1);
  assert.ok(res1.evidence.includes('14.2%'));

  assert.strictEqual(res2.verdict, 'CONTRADICTED', 'Second sentence must be contradicted (ransom payments dropped by 31%)');
  assert.strictEqual(res2.page, 1);
  assert.ok(res2.evidence.includes('dropped by 31%'));

  assert.strictEqual(res3.verdict, 'INSUFFICIENT_EVIDENCE', 'Third sentence must be insufficient evidence');
  assert.strictEqual(res3.page, null, 'Insufficient evidence must have null page');
  assert.strictEqual(res3.evidence, '', 'Insufficient evidence must have empty evidence string');
});

test('3. Compound Statement Splitting: Handles contrastive conjunctions and clauses', () => {
  const compoundInput = `Consolidated net revenues reached $18.4 billion, but non-performing loan ratios deteriorated to 18.2%.`;

  const claims = extractAtomicClaims(compoundInput);
  assert.strictEqual(claims.length, 2, 'Compound sentence with contrastive conjunction must split into 2 claims');

  const res1 = verifyClaimAgainstDocument(claims[0], finDoc);
  const res2 = verifyClaimAgainstDocument(claims[1], finDoc);

  assert.strictEqual(res1.verdict, 'SUPPORTED');
  assert.strictEqual(res1.page, 1);
  assert.ok(res1.evidence.includes('$18.4 billion'));

  assert.strictEqual(res2.verdict, 'CONTRADICTED');
  assert.strictEqual(res2.page, 2);
  assert.ok(res2.evidence.includes('0.72%'));
});

test('4. Exact Quotations and Zero Fabrication: Real page citations only', () => {
  const claim = `A double-blind, randomized, placebo-controlled trial enrolled 4,520 patients across 48 global sites.`;
  const result = verifyClaimAgainstDocument(claim, pharmaDoc);

  assert.strictEqual(result.verdict, 'SUPPORTED');
  assert.strictEqual(result.page, 1);
  assert.ok(result.evidence.length > 0);
  assert.ok(pharmaDoc.pageTexts[0].text.includes(result.evidence), 'Evidence must be verbatim excerpt from page 1');
  assert.ok(result.confidence >= 95.0 && result.confidence <= 100.0, 'Confidence must be deterministic bounded percentage');
});

test('5. Unsupported Claims: Insufficient evidence without fabricated citations', () => {
  const phantomClaim = `The enterprise completed an acquisition of a quantum cryptography provider for $4.2 billion.`;
  const result = verifyClaimAgainstDocument(phantomClaim, finDoc);

  assert.strictEqual(result.verdict, 'INSUFFICIENT_EVIDENCE');
  assert.strictEqual(result.page, null, 'Must not fabricate a page number');
  assert.strictEqual(result.evidence, '', 'Must not fabricate quotation');
  assert.ok(result.explanation.includes('No relevant statements'));
});

test('6. Fraud Detection Telemetry: Classifies risk level, category, and score', () => {
  // Contradiction involving manipulated financial metric
  const fraudFin = analyzeFraudRisk(
    'Non-performing loan ratios deteriorated to 18.2% across consumer divisions.',
    'CONTRADICTED',
    'Non-performing loans (NPL) ratio remained stable at 0.72% of total credit assets.'
  );
  assert.strictEqual(fraudFin.riskLevel, 'CRITICAL');
  assert.ok(fraudFin.fraudScore >= 90);
  assert.strictEqual(fraudFin.fraudCategory, 'Critical Metric Manipulation');

  // Contradiction involving legal exclusivity
  const fraudLegal = analyzeFraudRisk(
    'The licensee retains an exclusive worldwide license to commercialize host telemetry derivatives.',
    'CONTRADICTED',
    'Nothing in this Agreement grants any license, and exclusive monetization rights are null and void.'
  );
  assert.strictEqual(fraudLegal.riskLevel, 'HIGH');
  assert.ok(fraudLegal.fraudScore >= 85);

  // Insufficient evidence
  const fraudPhantom = analyzeFraudRisk(
    'The European Union completely banned all endpoint AI agents.',
    'INSUFFICIENT_EVIDENCE',
    ''
  );
  assert.strictEqual(fraudPhantom.riskLevel, 'MEDIUM');
  assert.strictEqual(fraudPhantom.fraudCategory, 'Phantom Assertion (Zero Grounding)');

  // Supported
  const fraudSupported = analyzeFraudRisk(
    'Total ransomware attacks across Fortune 500 enterprises rose by 14.2% year-over-year.',
    'SUPPORTED',
    'Total ransomware attacks across Fortune 500 enterprises rose by 14.2% year-over-year.'
  );
  assert.strictEqual(fraudSupported.riskLevel, 'LOW');
  assert.ok(fraudSupported.fraudScore < 10);
});

test('7. Benchmark Scenario Alignment: All 6 benchmark scenarios match their ground-truth documents', () => {
  for (const preset of PRESET_INPUTS) {
    const doc = INITIAL_DOCUMENTS.find(d => d.id === preset.documentId);
    assert.ok(doc, `Ground truth document ${preset.documentId} must exist for preset ${preset.title}`);
    assert.strictEqual(doc.name, preset.documentName, `Document name must match preset documentName`);

    const claims = extractAtomicClaims(preset.text);
    assert.ok(claims.length >= 3, `Preset ${preset.title} must parse into at least 3 atomic claims`);

    for (const c of claims) {
      const res = verifyClaimAgainstDocument(c, doc);
      assert.ok(['SUPPORTED', 'CONTRADICTED', 'INSUFFICIENT_EVIDENCE'].includes(res.verdict));
      if (res.verdict === 'INSUFFICIENT_EVIDENCE') {
        assert.strictEqual(res.page, null);
        assert.strictEqual(res.evidence, '');
      } else {
        assert.ok(typeof res.page === 'number');
        assert.ok(res.evidence.length > 5);
      }
    }
  }
});

test('8. Transparent Assessment Engine: Validates non-blackbox RAG reasoning pipeline and credibility tiers', () => {
  const claim = 'Consolidated net revenues reached $18.4 billion, representing a 7.2% growth.';
  const res = verifyClaimAgainstDocument(claim, finDoc);
  const assessment = buildTransparentAssessment(claim, res.verdict, res, finDoc);

  assert.strictEqual(assessment.semanticSearchRank, 1);
  assert.ok(assessment.sourceCredibility.includes('SEC'));
  assert.strictEqual(assessment.credibilityScore, 99);
  assert.ok(assessment.evidenceRankingScore >= 90);
  assert.strictEqual(assessment.reasoningPipeline.length, 4);
  assert.ok(assessment.reasoningPipeline[0].includes('NLP Extraction'));
  assert.ok(assessment.reasoningPipeline[1].includes('Semantic Search'));
  assert.ok(assessment.reasoningPipeline[2].includes('Evidence Ranking'));
  assert.ok(assessment.reasoningPipeline[3].includes('Transparent Assessment'));
});
