/**
 * Pure statistical and machine learning evaluation utilities
 * Used for evaluation metrics, ROC-AUC calculation, Population Stability Index (PSI),
 * Business Cost-Benefit analysis, and SHAP additive contributions.
 */

export interface MetricResult {
  tp: number;
  fp: number;
  tn: number;
  fn: number;
  precision: number;
  recall: number;
  f1Score: number;
  accuracy: number;
  specificity: number;
  netBusinessSavings: number;
}

export interface BusinessCostParams {
  avgCustomerLifetimeValue: number; // e.g. $1200
  retentionCampaignCost: number;     // e.g. $120 offer cost
  retentionSuccessRate: number;      // e.g. 0.55 (55% accept offer and stay)
  totalCustomerBase: number;         // e.g. 10000
}

/**
 * Calculates classification confusion matrix and associated business ROI metrics
 */
export function calculateConfusionMatrix(
  probabilities: number[],
  groundTruth: number[],
  threshold: number,
  businessParams: BusinessCostParams = {
    avgCustomerLifetimeValue: 1200,
    retentionCampaignCost: 120,
    retentionSuccessRate: 0.55,
    totalCustomerBase: 10000,
  }
): MetricResult {
  if (probabilities.length === 0 || probabilities.length !== groundTruth.length) {
    return {
      tp: 0,
      fp: 0,
      tn: 0,
      fn: 0,
      precision: 0,
      recall: 0,
      f1Score: 0,
      accuracy: 0,
      specificity: 0,
      netBusinessSavings: 0,
    };
  }

  let tp = 0;
  let fp = 0;
  let tn = 0;
  let fn = 0;

  for (let i = 0; i < probabilities.length; i++) {
    const predictedPositive = probabilities[i] >= threshold;
    const actualPositive = groundTruth[i] === 1;

    if (predictedPositive && actualPositive) tp++;
    else if (predictedPositive && !actualPositive) fp++;
    else if (!predictedPositive && actualPositive) fn++;
    else tn++;
  }

  const precision = tp + fp > 0 ? tp / (tp + fp) : 0;
  const recall = tp + fn > 0 ? tp / (tp + fn) : 0;
  const specificity = tn + fp > 0 ? tn / (tn + fp) : 0;
  const accuracy = (tp + tn) / (tp + fp + tn + fn);
  const f1Score = precision + recall > 0 ? (2 * precision * recall) / (precision + recall) : 0;

  // Scale up to business customer base
  const scale = businessParams.totalCustomerBase / probabilities.length;
  const scaledTp = tp * scale;
  const scaledFp = fp * scale;

  // Revenue saved by targeting true positives: (retained customers * LTV) - (campaign cost * TP)
  const savedRevenue = scaledTp * businessParams.retentionSuccessRate * businessParams.avgCustomerLifetimeValue;
  const totalCampaignCost = (scaledTp + scaledFp) * businessParams.retentionCampaignCost;
  const netBusinessSavings = Math.round(savedRevenue - totalCampaignCost);

  return {
    tp,
    fp,
    tn,
    fn,
    precision,
    recall,
    f1Score,
    accuracy,
    specificity,
    netBusinessSavings,
  };
}

/**
 * Calculates Population Stability Index (PSI) to monitor dataset / feature drift
 * PSI = sum( (Actual% - Expected%) * ln(Actual% / Expected%) )
 * Interpretation:
 * < 0.1: No significant change / stable
 * 0.1 - 0.25: Moderate change / monitor
 * > 0.25: Significant shift / model retraining required
 */
export function calculatePSI(expectedCounts: number[], actualCounts: number[]): { psi: number; status: 'stable' | 'moderate' | 'critical' } {
  const sumExpected = expectedCounts.reduce((acc, c) => acc + c, 0);
  const sumActual = actualCounts.reduce((acc, c) => acc + c, 0);

  if (sumExpected === 0 || sumActual === 0 || expectedCounts.length !== actualCounts.length) {
    return { psi: 0, status: 'stable' };
  }

  let totalPsi = 0;
  const epsilon = 0.0001; // Avoid divide by zero or ln(0)

  for (let i = 0; i < expectedCounts.length; i++) {
    const expPct = Math.max(epsilon, expectedCounts[i] / sumExpected);
    const actPct = Math.max(epsilon, actualCounts[i] / sumActual);

    const binPsi = (actPct - expPct) * Math.log(actPct / expPct);
    totalPsi += binPsi;
  }

  const roundedPsi = Math.round(totalPsi * 1000) / 1000;
  let status: 'stable' | 'moderate' | 'critical' = 'stable';
  if (roundedPsi >= 0.25) {
    status = 'critical';
  } else if (roundedPsi >= 0.1) {
    status = 'moderate';
  }

  return { psi: roundedPsi, status };
}

/**
 * Calculates Brier Score (Mean Squared Error between predicted probability and binary outcome)
 * Ranges from 0 (perfect calibration) to 1.
 */
export function calculateBrierScore(probabilities: number[], groundTruth: number[]): number {
  if (probabilities.length === 0 || probabilities.length !== groundTruth.length) return 0;
  let sumSqErr = 0;
  for (let i = 0; i < probabilities.length; i++) {
    const diff = probabilities[i] - groundTruth[i];
    sumSqErr += diff * diff;
  }
  return Math.round((sumSqErr / probabilities.length) * 10000) / 10000;
}

/**
 * Trapezoidal Area Under Curve (AUC) for ROC
 */
export function calculateAUC(points: { fpr: number; tpr: number }[]): number {
  if (points.length < 2) return 0.5;
  // Sort by FPR ascending
  const sorted = [...points].sort((a, b) => a.fpr - b.fpr);
  let auc = 0;
  for (let i = 1; i < sorted.length; i++) {
    const width = sorted[i].fpr - sorted[i - 1].fpr;
    const avgHeight = (sorted[i].tpr + sorted[i - 1].tpr) / 2;
    auc += width * avgHeight;
  }
  return Math.min(1.0, Math.max(0.0, Math.round(auc * 1000) / 1000));
}

/**
 * Sigmoid activation
 */
export function sigmoid(z: number): number {
  return 1 / (1 + Math.exp(-z));
}

/**
 * Computes individual SHAP-like additive contributions to churn probability.
 * Based on trained logistic/tree weights and reference baseline value.
 */
export interface FeatureContribution {
  featureName: string;
  featureValue: string | number;
  contribution: number; // positive increases churn risk, negative decreases churn risk
  displayValue: string;
}

export function computeLocalExplainability(
  features: {
    tenureMonths: number;
    monthlyCharges: number;
    contract: 'Month-to-month' | 'One year' | 'Two year';
    techSupport: boolean;
    onlineSecurity: boolean;
    fiberOptic: boolean;
    paperlessBilling: boolean;
    paymentMethod: 'Electronic check' | 'Mailed check' | 'Bank transfer' | 'Credit card';
    numSupportTickets: number;
  },
  baseLogOdds = -1.25 // corresponds to ~22.3% base churn rate
): {
  baseProbability: number;
  finalProbability: number;
  finalLogOdds: number;
  contributions: FeatureContribution[];
} {
  const contributions: FeatureContribution[] = [];

  // 1. Contract Type (one of the strongest predictors in churn literature)
  let contractContrib = 0;
  if (features.contract === 'Month-to-month') {
    contractContrib = 0.85;
  } else if (features.contract === 'One year') {
    contractContrib = -0.45;
  } else {
    contractContrib = -0.95;
  }
  contributions.push({
    featureName: 'Contract Type',
    featureValue: features.contract,
    contribution: contractContrib,
    displayValue: features.contract,
  });

  // 2. Tenure Months (longer tenure => lower churn)
  // Baseline mean tenure ~ 32 months
  const tenureDiff = features.tenureMonths - 32;
  const tenureContrib = Math.round(-0.035 * tenureDiff * 100) / 100;
  contributions.push({
    featureName: 'Tenure (Months)',
    featureValue: features.tenureMonths,
    contribution: tenureContrib,
    displayValue: `${features.tenureMonths} mo`,
  });

  // 3. Support Tickets (high tickets => high frustration)
  const ticketContrib = Math.round((features.numSupportTickets - 1) * 0.42 * 100) / 100;
  contributions.push({
    featureName: 'Support Tickets (Last 90d)',
    featureValue: features.numSupportTickets,
    contribution: ticketContrib,
    displayValue: `${features.numSupportTickets} tickets`,
  });

  // 4. Monthly Charges (higher charge with low services => friction)
  const chargeDiff = (features.monthlyCharges - 65) / 30;
  const chargeContrib = Math.round(chargeDiff * 0.28 * 100) / 100;
  contributions.push({
    featureName: 'Monthly Charges',
    featureValue: features.monthlyCharges,
    contribution: chargeContrib,
    displayValue: `$${features.monthlyCharges.toFixed(2)}/mo`,
  });

  // 5. Tech Support & Online Security
  const techContrib = features.techSupport ? -0.38 : 0.22;
  contributions.push({
    featureName: 'Tech Support Service',
    featureValue: features.techSupport ? 'Yes' : 'No',
    contribution: techContrib,
    displayValue: features.techSupport ? 'Active' : 'None',
  });

  const secContrib = features.onlineSecurity ? -0.32 : 0.18;
  contributions.push({
    featureName: 'Online Security Service',
    featureValue: features.onlineSecurity ? 'Yes' : 'No',
    contribution: secContrib,
    displayValue: features.onlineSecurity ? 'Active' : 'None',
  });

  // 6. Internet Fiber Optic (Fiber users experience higher churn if support is poor)
  const fiberContrib = features.fiberOptic ? 0.35 : -0.15;
  contributions.push({
    featureName: 'Fiber Optic High-Speed',
    featureValue: features.fiberOptic ? 'Yes' : 'DSL/None',
    contribution: fiberContrib,
    displayValue: features.fiberOptic ? 'Fiber Optic' : 'DSL/Cable',
  });

  // 7. Payment method
  let payContrib = 0;
  if (features.paymentMethod === 'Electronic check') {
    payContrib = 0.32;
  } else if (features.paymentMethod === 'Credit card') {
    payContrib = -0.18;
  } else {
    payContrib = -0.08;
  }
  contributions.push({
    featureName: 'Payment Method',
    featureValue: features.paymentMethod,
    contribution: payContrib,
    displayValue: features.paymentMethod,
  });

  // 8. Paperless billing
  const billContrib = features.paperlessBilling ? 0.12 : -0.1;
  contributions.push({
    featureName: 'Paperless Billing',
    featureValue: features.paperlessBilling ? 'Yes' : 'No',
    contribution: billContrib,
    displayValue: features.paperlessBilling ? 'Enabled' : 'Disabled',
  });

  // Sort contributions by absolute impact descending
  contributions.sort((a, b) => Math.abs(b.contribution) - Math.abs(a.contribution));

  const totalDelta = contributions.reduce((acc, curr) => acc + curr.contribution, 0);
  const finalLogOdds = baseLogOdds + totalDelta;
  const baseProbability = Math.round(sigmoid(baseLogOdds) * 1000) / 1000;
  const finalProbability = Math.round(sigmoid(finalLogOdds) * 1000) / 1000;

  return {
    baseProbability,
    finalProbability,
    finalLogOdds: Math.round(finalLogOdds * 100) / 100,
    contributions,
  };
}
