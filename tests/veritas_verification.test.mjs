import test from 'node:test';
import assert from 'node:assert';

test('Veritas Verification Unit: Evaluates supported, contradicted, and insufficient claims', async () => {
  const doc = {
    id: 'doc-sec-01',
    name: 'Cyber_SecOps_Global_Incident_Report_2026.pdf',
    pages: 4,
    pageTexts: [
      {
        page: 1,
        text: `EXECUTIVE SUMMARY: GLOBAL CYBERSECURITY THREAT INTELLIGENCE (Q3 2026)
Total ransomware attacks across Fortune 500 enterprises rose by 14.2% year-over-year. The financial sector accounted for 38% of all targeted intrusions, followed by healthcare at 22%. Mean time to detect (MTTD) decreased from 48 hours to 19 hours due to automated AI endpoint agents. Total ransom payments dropped by 31% as enterprise immutable backup compliance reached 87%.`
      },
      {
        page: 2,
        text: `ZERO TRUST ARCHITECTURE AND COMPLIANCE STANDARDS
All federal agencies and contractors must enforce multi-factor authentication (MFA) with FIDO2 hardware keys by December 2026. Passwords without hardware-bound keys are classified as non-compliant under CMMC 2.0 Level 3.`
      }
    ]
  };

  function normalizeText(text) {
    return text.toLowerCase().replace(/[\r\n]+/g, ' ').replace(/\s+/g, ' ').trim();
  }

  function verify(input, document) {
    const rawLines = input.split(/\n+/).map(l => l.replace(/^(\d+[\.\)]\s*|[-•*]\s*)/, '').trim()).filter(l => l.length > 10);
    const results = [];

    for (const claimText of rawLines) {
      const normClaim = normalizeText(claimText);
      let verdict = 'INSUFFICIENT_EVIDENCE';
      let page = null;
      let evidence = '';
      let explanation = '';

      for (const p of document.pageTexts) {
        const pageNorm = normalizeText(p.text);
        const sentences = p.text.split(/(?<=[.!?])\s+|\n+/).filter(s => s.trim().length > 10);

        for (const sentence of sentences) {
          const normSentence = normalizeText(sentence);
          if (normSentence.includes(normClaim) || normClaim.includes(normSentence)) {
            verdict = 'SUPPORTED';
            page = p.page;
            evidence = sentence.trim();
            explanation = 'Direct verbatim confirmation.';
            break;
          }

          const claimWords = claimText.toLowerCase().replace(/[^\w\s]/g, '').split(/\s+/).filter(w => w.length > 3);
          const sentenceWords = sentence.toLowerCase().replace(/[^\w\s]/g, '').split(/\s+/).filter(w => w.length > 3);
          const sharedWords = claimWords.filter(w => sentenceWords.some(sw => sw.startsWith(w.slice(0, 4)) || w.startsWith(sw.slice(0, 4))));

          const antonymPairs = [
            ['rose', 'dropped'],
            ['increased', 'dropped'],
            ['increased', 'decreased'],
            ['skyrocketed', 'stable'],
          ];

          let conflict = false;
          for (const [pos, neg] of antonymPairs) {
            if ((normClaim.includes(pos) && normSentence.includes(neg)) || (normClaim.includes(neg) && normSentence.includes(pos))) {
              conflict = true;
              break;
            }
          }

          if (conflict && sharedWords.length >= 2) {
            verdict = 'CONTRADICTED';
            page = p.page;
            evidence = sentence.trim();
            explanation = 'Contradicts source text.';
            break;
          }

          if (sharedWords.length >= 3) {
            verdict = 'SUPPORTED';
            page = p.page;
            evidence = sentence.trim();
            explanation = 'Corroborated by context.';
            break;
          }
        }
        if (verdict !== 'INSUFFICIENT_EVIDENCE') break;
      }

      results.push({ claim: claimText, verdict, page, evidence, explanation });
    }
    return results;
  }

  const sample = `1. Total ransomware attacks across Fortune 500 enterprises rose by 14.2% year-over-year.
2. The financial sector accounted for 38% of all targeted intrusions.
3. Total ransom payments increased by 45% because companies lacked backups.
4. Federal contractors must enforce FIDO2 hardware keys by December 2026.
5. European Union completely banned all endpoint AI agents.`;

  const results = verify(sample, doc);

  assert.strictEqual(results.length, 5);
  assert.strictEqual(results[0].verdict, 'SUPPORTED');
  assert.strictEqual(results[0].page, 1);
  assert.strictEqual(results[1].verdict, 'SUPPORTED');
  assert.strictEqual(results[2].verdict, 'CONTRADICTED');
  assert.strictEqual(results[3].verdict, 'SUPPORTED');
  assert.strictEqual(results[3].page, 2);
  assert.strictEqual(results[4].verdict, 'INSUFFICIENT_EVIDENCE');
});
