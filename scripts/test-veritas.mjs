import assert from 'node:assert';
import {
  extractAtomicClaims,
  verifyClaimAgainstDocument,
  analyzeFraudRisk,
  INITIAL_DOCUMENTS,
  PRESET_INPUTS
} from '../src/lib/verificationEngine.ts';

console.log('--- VERITAS AI Claim Verification & Fraud Detection Test Suite ---');

const doc = INITIAL_DOCUMENTS.find(d => d.id === 'doc-sec-01');

const paragraphSample = `Total ransomware attacks across Fortune 500 enterprises rose by 14.2% year-over-year. The financial sector accounted for 38% of all targeted intrusions. Total ransom payments skyrocketed by 45% because companies lacked backups. Federal contractors must enforce FIDO2 hardware keys by December 2026. European Union completely banned all endpoint AI agents.`;

console.log('\n[TEST 1] Splitting Multi-Claim Paragraph into Atomic Assertions...');
const claims = extractAtomicClaims(paragraphSample);
console.log(`Extracted ${claims.length} atomic claims from paragraph.`);
assert.strictEqual(claims.length, 5);

console.log('\n[TEST 2] Verifying Each Claim Independently with Fraud Risk Detection...');
for (const [i, claimText] of claims.entries()) {
  const result = verifyClaimAgainstDocument(claimText, doc);
  const fraud = analyzeFraudRisk(claimText, result.verdict, result.evidence);

  console.log(`\nClaim #${i + 1}: "${claimText}"`);
  console.log(`  - Verdict: [${result.verdict}] (Confidence: ${result.confidence}%)`);
  console.log(`  - Citation: ${result.page ? `Page ${result.page}` : 'None'}`);
  if (result.evidence) console.log(`  - Verbatim Evidence: "${result.evidence}"`);
  console.log(`  - Fraud Detection: Risk [${fraud.riskLevel}] • Score ${fraud.fraudScore}/100 • ${fraud.fraudCategory}`);
  console.log(`  - Reason: ${fraud.flagReason}`);

  if (i === 0) {
    assert.strictEqual(result.verdict, 'SUPPORTED');
    assert.strictEqual(result.page, 1);
    assert.strictEqual(fraud.riskLevel, 'LOW');
  } else if (i === 1) {
    assert.strictEqual(result.verdict, 'SUPPORTED');
    assert.strictEqual(result.page, 1);
  } else if (i === 2) {
    assert.strictEqual(result.verdict, 'CONTRADICTED');
    assert.strictEqual(result.page, 1);
    assert.ok(fraud.fraudScore >= 85);
  } else if (i === 3) {
    assert.strictEqual(result.verdict, 'SUPPORTED');
    assert.strictEqual(result.page, 2);
  } else if (i === 4) {
    assert.strictEqual(result.verdict, 'INSUFFICIENT_EVIDENCE');
    assert.strictEqual(result.page, null);
    assert.strictEqual(result.evidence, '');
    assert.strictEqual(fraud.riskLevel, 'MEDIUM');
  }
}

console.log('\n[TEST 3] Testing Compound Sentence Splitting...');
const compound = `Consolidated net revenues reached $18.4 billion, but non-performing loan ratios deteriorated to 18.2%.`;
const finDoc = INITIAL_DOCUMENTS.find(d => d.id === 'doc-fin-03');
const compoundClaims = extractAtomicClaims(compound);
assert.strictEqual(compoundClaims.length, 2);
const c1 = verifyClaimAgainstDocument(compoundClaims[0], finDoc);
const c2 = verifyClaimAgainstDocument(compoundClaims[1], finDoc);
assert.strictEqual(c1.verdict, 'SUPPORTED');
assert.strictEqual(c2.verdict, 'CONTRADICTED');

console.log('\n✓ ALL TESTS PASSED: Atomic claim extraction, independent verification, and fraud detection working perfectly.');
