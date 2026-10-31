import { orchestrateThreatAnalysis } from '../src/lib/agents/orchestrator.ts';
import { GRAVITON_DEMO_SCENARIOS } from '../src/lib/demoScenarios.ts';

console.log('--- SURAKSHA AI Multi-Agent Test Suite ---');

for (const scenario of GRAVITON_DEMO_SCENARIOS) {
  console.log(`\nTesting: [${scenario.id}] ${scenario.title}`);
  const result = orchestrateThreatAnalysis(
    scenario.rawInput,
    scenario.category,
    scenario.upiDetails
  );

  console.log(`- Threat Level: ${result.threatLevel}`);
  console.log(`- Composite Score: ${result.compositeRiskScore}/100`);
  console.log(`- Category: ${result.threatCategory}`);
  console.log(`- Active Agents: ${result.agents.length}`);
  console.log(`- Evidences Verified: ${result.evidenceList.length}`);
  if (result.upiRiskAssessment?.demandsPinToReceive) {
    console.log(`- [FLAG] Demands PIN to receive money: TRUE`);
  }
}

console.log('\nAll Multi-Agent tests completed successfully.');
