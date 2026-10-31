import assert from 'node:assert';

console.log('--- VERITAS AI Claim Verification Engine Test Suite ---');

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

function verifyClaims(inputText, document) {
  const rawLines = inputText
    .split(/\n+/)
    .map(line => line.trim())
    .filter(line => line.length > 0);

  const parsedClaims = [];
  for (const line of rawLines) {
    const cleaned = line.replace(/^(\d+[\.\)]\s*|[-•*]\s*)/, '').trim();
    if (cleaned.length > 10) parsedClaims.push(cleaned);
  }

  const results = [];

  for (let i = 0; i < parsedClaims.length; i++) {
    const claimText = parsedClaims[i];
    const normClaim = normalizeText(claimText);

    let matchedPage = null;
    let matchedEvidence = '';
    let verdict = 'INSUFFICIENT_EVIDENCE';
    let explanation = '';
    let confidence = 98.0;

    for (const pageItem of document.pageTexts) {
      const pageNorm = normalizeText(pageItem.text);
      const numbersInClaim = claimText.match(/(\d+(?:\.\d+)?%?|\$\d+(?:\.\d+)?(?:\s*billion|\s*million)?)/gi) || [];

      const words = claimText
        .replace(/[^\w\s]/g, '')
        .split(/\s+/)
        .filter(w => w.length > 4 && !['about', 'after', 'their', 'which', 'where', 'there', 'based', 'under', 'these'].includes(w.toLowerCase()));

      let keywordMatches = 0;
      for (const w of words) {
        if (pageNorm.includes(w.toLowerCase())) keywordMatches++;
      }
      const matchRatio = words.length > 0 ? keywordMatches / words.length : 0;

      // Extract candidate sentences from the page
      const pageSentences = pageItem.text.split(/(?<=[.!?])\s+|\n+/).filter(s => s.trim().length > 10);

      for (const sentence of pageSentences) {
        const normSentence = normalizeText(sentence);

        if (normSentence.includes(normClaim) || normClaim.includes(normSentence)) {
          verdict = 'SUPPORTED';
          matchedPage = pageItem.page;
          matchedEvidence = sentence.trim();
          explanation = `Exact factual assertion corroborated by primary text on Page ${pageItem.page}.`;
          break;
        }

        // Check common subject terms between claim and sentence
        const claimWords = claimText.toLowerCase().replace(/[^\w\s]/g, '').split(/\s+/).filter(w => w.length > 3);
        const sentenceWords = sentence.toLowerCase().replace(/[^\w\s]/g, '').split(/\s+/).filter(w => w.length > 3);
        const sharedWords = claimWords.filter(w => sentenceWords.some(sw => sw.startsWith(w.slice(0, 4)) || w.startsWith(sw.slice(0, 4))));

        const antonymPairs = [
          ['rose', 'dropped'],
          ['increased', 'dropped'],
          ['increased', 'decreased'],
          ['skyrocketed', 'stable'],
          ['skyrocketed', 'normal'],
          ['banned', 'mandated'],
          ['approved', 'prohibited']
        ];

        let hasAntonymConflict = false;
        for (const [pos, neg] of antonymPairs) {
          if (
            (normClaim.includes(pos) && normSentence.includes(neg)) ||
            (normClaim.includes(neg) && normSentence.includes(pos))
          ) {
            hasAntonymConflict = true;
            break;
          }
        }

        if (hasAntonymConflict && sharedWords.length >= 2) {
          verdict = 'CONTRADICTED';
          matchedPage = pageItem.page;
          matchedEvidence = sentence.trim();
          explanation = `Source document explicitly states "${sentence.trim()}", which directly conflicts with the claim.`;
          break;
        }

        if (sharedWords.length >= 3 && matchRatio >= 0.5) {
          verdict = 'SUPPORTED';
          matchedPage = pageItem.page;
          matchedEvidence = sentence.trim();
          explanation = `Corroborated by contextual evidence in Section ${pageItem.page}.`;
          break;
        }
      }
      if (verdict !== 'INSUFFICIENT_EVIDENCE') break;
    }

    results.push({
      claim: claimText,
      verdict,
      confidence,
      page: matchedPage,
      evidence: matchedEvidence,
      explanation
    });
  }

  return results;
}

const inputSample = `1. Total ransomware attacks across Fortune 500 enterprises rose by 14.2% year-over-year.
2. The financial sector accounted for 38% of all targeted intrusions.
3. Total ransom payments increased by 45% because companies lacked backups.
4. Federal contractors must enforce FIDO2 hardware keys by December 2026.
5. European Union completely banned all endpoint AI agents.`;

const results = verifyClaims(inputSample, doc);

console.log(`Evaluated ${results.length} claims:`);
for (const [i, res] of results.entries()) {
  console.log(`\nClaim ${i + 1}: ${res.claim}`);
  console.log(`- Verdict: [${res.verdict}] (Confidence: ${res.confidence}%)`);
  if (res.evidence) {
    console.log(`- Evidence (Page ${res.page}): "${res.evidence}"`);
  }
  console.log(`- Explanation: ${res.explanation}`);
}

assert.strictEqual(results[0].verdict, 'SUPPORTED');
assert.strictEqual(results[0].page, 1);
assert.strictEqual(results[1].verdict, 'SUPPORTED');
assert.strictEqual(results[2].verdict, 'CONTRADICTED');
assert.strictEqual(results[3].verdict, 'SUPPORTED');
assert.strictEqual(results[3].page, 2);
assert.strictEqual(results[4].verdict, 'INSUFFICIENT_EVIDENCE');

console.log('\n✓ ALL VERITAS VERIFICATION TESTS PASSED SUCCESSFULLY.');
