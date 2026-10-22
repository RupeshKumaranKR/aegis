import test from 'node:test';
import assert from 'node:assert/strict';
import {
  calculateConfusionMatrix,
  calculatePSI,
  calculateBrierScore,
  calculateAUC,
  computeLocalExplainability,
} from './mlCalculations';

test('calculateConfusionMatrix correctly evaluates TP, FP, TN, FN and metrics', () => {
  const probs = [0.9, 0.8, 0.4, 0.1, 0.65];
  const actuals = [1, 1, 0, 0, 0];
  const result = calculateConfusionMatrix(probs, actuals, 0.5);

  assert.equal(result.tp, 2);
  assert.equal(result.fp, 1);
  assert.equal(result.tn, 2);
  assert.equal(result.fn, 0);

  // Precision = 2 / (2 + 1) = 0.666...
  assert.ok(Math.abs(result.precision - 0.6666) < 0.01);
  // Recall = 2 / 2 = 1.0
  assert.equal(result.recall, 1);
  // Accuracy = 4 / 5 = 0.8
  assert.equal(result.accuracy, 0.8);
});

test('calculatePSI detects stable and critical population distribution shifts', () => {
  // Identical distributions -> PSI ~ 0 (stable)
  const expected = [100, 200, 300, 400];
  const actualStable = [102, 198, 295, 405];
  const stableRes = calculatePSI(expected, actualStable);
  assert.equal(stableRes.status, 'stable');
  assert.ok(stableRes.psi < 0.1);

  // Severely shifted distribution -> critical
  const actualShifted = [400, 300, 200, 100];
  const shiftedRes = calculatePSI(expected, actualShifted);
  assert.equal(shiftedRes.status, 'critical');
  assert.ok(shiftedRes.psi >= 0.25);
});

test('calculateBrierScore returns correct MSE', () => {
  const probs = [1.0, 0.0, 0.5];
  const actuals = [1, 0, 1];
  // (0^2 + 0^2 + 0.5^2) / 3 = 0.25 / 3 = 0.0833
  const brier = calculateBrierScore(probs, actuals);
  assert.ok(Math.abs(brier - 0.0833) < 0.001);
});

test('calculateAUC calculates trapezoidal area accurately', () => {
  const points = [
    { fpr: 0, tpr: 0 },
    { fpr: 0.2, tpr: 0.8 },
    { fpr: 1.0, tpr: 1.0 },
  ];
  const auc = calculateAUC(points);
  // Segment 1: width 0.2 * height (0+0.8)/2 = 0.08
  // Segment 2: width 0.8 * height (0.8+1.0)/2 = 0.72
  // Total = 0.80
  assert.equal(auc, 0.8);
});

test('computeLocalExplainability computes additive SHAP contributions', () => {
  const customer = {
    tenureMonths: 2,
    monthlyCharges: 95,
    contract: 'Month-to-month' as const,
    techSupport: false,
    onlineSecurity: false,
    fiberOptic: true,
    paperlessBilling: true,
    paymentMethod: 'Electronic check' as const,
    numSupportTickets: 4,
  };

  const explanation = computeLocalExplainability(customer);

  // Month to month, low tenure, high tickets should result in high churn risk
  assert.ok(explanation.finalProbability > 0.7);
  assert.ok(explanation.contributions.length > 0);
  assert.ok(explanation.contributions[0].contribution !== 0);
});
