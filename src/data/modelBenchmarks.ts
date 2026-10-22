export interface ModelBenchmark {
  id: string;
  name: string;
  family: 'Tree Ensemble' | 'Gradient Boosted' | 'Linear/Regularized' | 'Baseline';
  rocAuc: number;
  prAuc: number;
  accuracy: number;
  precision: number;
  recall: number;
  f1Score: number;
  brierScore: number;
  latencyMs: number;
  description: string;
  hyperparameters: Record<string, string | number>;
  rocPoints: { fpr: number; tpr: number }[];
  prPoints: { recall: number; precision: number }[];
}

export const MODEL_BENCHMARKS: ModelBenchmark[] = [
  {
    id: "xgboost_tuned",
    name: "XGBoost (Optuna Tuned)",
    family: "Gradient Boosted",
    rocAuc: 0.884,
    prAuc: 0.742,
    accuracy: 0.828,
    precision: 0.712,
    recall: 0.678,
    f1Score: 0.694,
    brierScore: 0.124,
    latencyMs: 14.2,
    description: "Production champion model. 5-fold cross-validated Bayesian optimization over 100 trials targeting PR-AUC.",
    hyperparameters: {
      "n_estimators": 280,
      "max_depth": 5,
      "learning_rate": 0.038,
      "subsample": 0.82,
      "colsample_bytree": 0.78,
      "scale_pos_weight": 2.15,
      "reg_alpha": 0.45,
      "reg_lambda": 1.20,
    },
    rocPoints: [
      { fpr: 0.00, tpr: 0.00 },
      { fpr: 0.02, tpr: 0.22 },
      { fpr: 0.05, tpr: 0.44 },
      { fpr: 0.10, tpr: 0.64 },
      { fpr: 0.15, tpr: 0.76 },
      { fpr: 0.20, tpr: 0.83 },
      { fpr: 0.30, tpr: 0.89 },
      { fpr: 0.40, tpr: 0.93 },
      { fpr: 0.60, tpr: 0.97 },
      { fpr: 0.80, tpr: 0.99 },
      { fpr: 1.00, tpr: 1.00 },
    ],
    prPoints: [
      { recall: 0.00, precision: 1.00 },
      { recall: 0.20, precision: 0.88 },
      { recall: 0.40, precision: 0.81 },
      { recall: 0.60, precision: 0.75 },
      { recall: 0.68, precision: 0.71 },
      { recall: 0.80, precision: 0.58 },
      { recall: 0.90, precision: 0.46 },
      { recall: 1.00, precision: 0.26 },
    ],
  },
  {
    id: "lightgbm_classifier",
    name: "LightGBM Classifier",
    family: "Gradient Boosted",
    rocAuc: 0.879,
    prAuc: 0.735,
    accuracy: 0.821,
    precision: 0.704,
    recall: 0.669,
    f1Score: 0.686,
    brierScore: 0.129,
    latencyMs: 11.8,
    description: "Fast leaf-wise histogram-based boosting with built-in categorical feature handling.",
    hyperparameters: {
      "num_leaves": 31,
      "max_depth": -1,
      "learning_rate": 0.045,
      "min_child_samples": 25,
      "colsample_bytree": 0.80,
    },
    rocPoints: [
      { fpr: 0.00, tpr: 0.00 },
      { fpr: 0.03, tpr: 0.20 },
      { fpr: 0.06, tpr: 0.42 },
      { fpr: 0.12, tpr: 0.62 },
      { fpr: 0.18, tpr: 0.74 },
      { fpr: 0.24, tpr: 0.81 },
      { fpr: 0.32, tpr: 0.87 },
      { fpr: 0.45, tpr: 0.92 },
      { fpr: 0.65, tpr: 0.96 },
      { fpr: 1.00, tpr: 1.00 },
    ],
    prPoints: [
      { recall: 0.00, precision: 0.98 },
      { recall: 0.20, precision: 0.86 },
      { recall: 0.40, precision: 0.79 },
      { recall: 0.60, precision: 0.73 },
      { recall: 0.67, precision: 0.70 },
      { recall: 0.80, precision: 0.55 },
      { recall: 1.00, precision: 0.26 },
    ],
  },
  {
    id: "random_forest",
    name: "Random Forest (150 Trees)",
    family: "Tree Ensemble",
    rocAuc: 0.862,
    prAuc: 0.710,
    accuracy: 0.806,
    precision: 0.678,
    recall: 0.639,
    f1Score: 0.658,
    brierScore: 0.138,
    latencyMs: 28.4,
    description: "Bagged decision trees with bootstrap sampling and balanced class weight penalty.",
    hyperparameters: {
      "n_estimators": 150,
      "max_depth": 12,
      "min_samples_split": 8,
      "min_samples_leaf": 4,
      "class_weight": "balanced_subsample",
    },
    rocPoints: [
      { fpr: 0.00, tpr: 0.00 },
      { fpr: 0.04, tpr: 0.18 },
      { fpr: 0.08, tpr: 0.38 },
      { fpr: 0.15, tpr: 0.58 },
      { fpr: 0.22, tpr: 0.71 },
      { fpr: 0.30, tpr: 0.79 },
      { fpr: 0.42, tpr: 0.86 },
      { fpr: 0.60, tpr: 0.93 },
      { fpr: 1.00, tpr: 1.00 },
    ],
    prPoints: [
      { recall: 0.00, precision: 0.95 },
      { recall: 0.20, precision: 0.82 },
      { recall: 0.40, precision: 0.74 },
      { recall: 0.60, precision: 0.68 },
      { recall: 0.64, precision: 0.68 },
      { recall: 0.80, precision: 0.50 },
      { recall: 1.00, precision: 0.26 },
    ],
  },
  {
    id: "logistic_regression",
    name: "Logistic Regression (ElasticNet)",
    family: "Linear/Regularized",
    rocAuc: 0.835,
    prAuc: 0.665,
    accuracy: 0.792,
    precision: 0.645,
    recall: 0.601,
    f1Score: 0.622,
    brierScore: 0.151,
    latencyMs: 4.1,
    description: "Linear baseline with StandardScaler preprocessing, one-hot encoding, and L1/L2 penalty mix.",
    hyperparameters: {
      "penalty": "elasticnet",
      "l1_ratio": 0.35,
      "C": 0.85,
      "solver": "saga",
      "max_iter": 1000,
    },
    rocPoints: [
      { fpr: 0.00, tpr: 0.00 },
      { fpr: 0.05, tpr: 0.15 },
      { fpr: 0.12, tpr: 0.35 },
      { fpr: 0.20, tpr: 0.52 },
      { fpr: 0.30, tpr: 0.68 },
      { fpr: 0.42, tpr: 0.78 },
      { fpr: 0.60, tpr: 0.88 },
      { fpr: 1.00, tpr: 1.00 },
    ],
    prPoints: [
      { recall: 0.00, precision: 0.90 },
      { recall: 0.20, precision: 0.77 },
      { recall: 0.40, precision: 0.69 },
      { recall: 0.60, precision: 0.62 },
      { recall: 0.80, precision: 0.44 },
      { recall: 1.00, precision: 0.26 },
    ],
  },
  {
    id: "dummy_baseline",
    name: "Dummy Stratified Baseline",
    family: "Baseline",
    rocAuc: 0.500,
    prAuc: 0.265,
    accuracy: 0.734,
    precision: 0.000,
    recall: 0.000,
    f1Score: 0.000,
    brierScore: 0.195,
    latencyMs: 1.0,
    description: "No-information prior class distribution baseline.",
    hyperparameters: {
      "strategy": "most_frequent",
    },
    rocPoints: [
      { fpr: 0.00, tpr: 0.00 },
      { fpr: 0.50, tpr: 0.50 },
      { fpr: 1.00, tpr: 1.00 },
    ],
    prPoints: [
      { recall: 0.00, precision: 0.265 },
      { recall: 0.50, precision: 0.265 },
      { recall: 1.00, precision: 0.265 },
    ],
  }
];

export interface GlobalShapFeature {
  feature: string;
  meanAbsShap: number;
  category: 'Contractual' | 'Financial' | 'Customer Care' | 'Services' | 'Demographic';
  direction: 'Increases risk' | 'Decreases risk' | 'Mixed non-linear';
  gainScore: number;
}

export const GLOBAL_SHAP_IMPORTANCE: GlobalShapFeature[] = [
  { feature: "Contract (Month-to-Month)", meanAbsShap: 0.78, category: "Contractual", direction: "Increases risk", gainScore: 342.1 },
  { feature: "Tenure (Months)", meanAbsShap: 0.65, category: "Contractual", direction: "Decreases risk", gainScore: 289.4 },
  { feature: "Support Tickets Count (90d)", meanAbsShap: 0.54, category: "Customer Care", direction: "Increases risk", gainScore: 215.8 },
  { feature: "Monthly Charges ($)", meanAbsShap: 0.42, category: "Financial", direction: "Increases risk", gainScore: 167.3 },
  { feature: "Tech Support Active", meanAbsShap: 0.38, category: "Services", direction: "Decreases risk", gainScore: 142.0 },
  { feature: "Online Security Active", meanAbsShap: 0.31, category: "Services", direction: "Decreases risk", gainScore: 118.5 },
  { feature: "Fiber Optic High-Speed", meanAbsShap: 0.29, category: "Services", direction: "Increases risk", gainScore: 104.2 },
  { feature: "Payment Method (Electronic Check)", meanAbsShap: 0.24, category: "Financial", direction: "Increases risk", gainScore: 89.1 },
  { feature: "Total Charges / Tenure Ratio", meanAbsShap: 0.19, category: "Financial", direction: "Mixed non-linear", gainScore: 72.4 },
  { feature: "Paperless Billing Active", meanAbsShap: 0.14, category: "Financial", direction: "Increases risk", gainScore: 51.6 },
  { feature: "Senior Citizen Flag", meanAbsShap: 0.09, category: "Demographic", direction: "Increases risk", gainScore: 33.2 },
  { feature: "Partner & Dependents", meanAbsShap: 0.07, category: "Demographic", direction: "Decreases risk", gainScore: 24.8 },
];

export interface CalibrationBin {
  binRange: string;
  meanPredictedProb: number;
  observedPositiveFraction: number;
  count: number;
}

export const CALIBRATION_DATA: CalibrationBin[] = [
  { binRange: "0.00 - 0.10", meanPredictedProb: 0.048, observedPositiveFraction: 0.051, count: 480 },
  { binRange: "0.10 - 0.20", meanPredictedProb: 0.152, observedPositiveFraction: 0.148, count: 260 },
  { binRange: "0.20 - 0.30", meanPredictedProb: 0.247, observedPositiveFraction: 0.261, count: 185 },
  { binRange: "0.30 - 0.40", meanPredictedProb: 0.351, observedPositiveFraction: 0.344, count: 140 },
  { binRange: "0.40 - 0.50", meanPredictedProb: 0.449, observedPositiveFraction: 0.460, count: 110 },
  { binRange: "0.50 - 0.60", meanPredictedProb: 0.552, observedPositiveFraction: 0.538, count: 88 },
  { binRange: "0.60 - 0.70", meanPredictedProb: 0.648, observedPositiveFraction: 0.655, count: 64 },
  { binRange: "0.70 - 0.80", meanPredictedProb: 0.749, observedPositiveFraction: 0.762, count: 48 },
  { binRange: "0.80 - 0.90", meanPredictedProb: 0.846, observedPositiveFraction: 0.833, count: 42 },
  { binRange: "0.90 - 1.00", meanPredictedProb: 0.941, observedPositiveFraction: 0.938, count: 32 },
];
