import React, { useState, useMemo } from 'react';
import {
  ShieldCheck,
  Sparkles,
  Sliders,
  User,
  ArrowRight,
  RefreshCw,
  Zap,
  HelpCircle,
  TrendingDown,
  TrendingUp,
} from 'lucide-react';
import { GLOBAL_SHAP_IMPORTANCE } from '../data/modelBenchmarks';
import { computeLocalExplainability } from '../utils/mlCalculations';

interface CustomerState {
  tenureMonths: number;
  monthlyCharges: number;
  contract: 'Month-to-month' | 'One year' | 'Two year';
  techSupport: boolean;
  onlineSecurity: boolean;
  fiberOptic: boolean;
  paperlessBilling: boolean;
  paymentMethod: 'Electronic check' | 'Mailed check' | 'Bank transfer' | 'Credit card';
  numSupportTickets: number;
}

const PRESET_ARCHETYPES: Record<string, { label: string; description: string; data: CustomerState }> = {
  high_risk: {
    label: 'High-Risk Attrition Candidate',
    description: 'New fiber subscriber experiencing technical friction with month-to-month contract.',
    data: {
      tenureMonths: 2,
      monthlyCharges: 92.5,
      contract: 'Month-to-month',
      techSupport: false,
      onlineSecurity: false,
      fiberOptic: true,
      paperlessBilling: true,
      paymentMethod: 'Electronic check',
      numSupportTickets: 4,
    },
  },
  vulnerable_streamer: {
    label: 'Vulnerable High-Spend Streamer',
    description: 'Moderate tenure user with high bill and recent billing/connection inquiries.',
    data: {
      tenureMonths: 14,
      monthlyCharges: 88.0,
      contract: 'Month-to-month',
      techSupport: false,
      onlineSecurity: true,
      fiberOptic: true,
      paperlessBilling: true,
      paymentMethod: 'Bank transfer',
      numSupportTickets: 2,
    },
  },
  loyal_enterprise: {
    label: 'Loyal Long-Tenure Enterprise',
    description: 'Established account with multi-year contract and active support add-ons.',
    data: {
      tenureMonths: 64,
      monthlyCharges: 62.0,
      contract: 'Two year',
      techSupport: true,
      onlineSecurity: true,
      fiberOptic: false,
      paperlessBilling: false,
      paymentMethod: 'Credit card',
      numSupportTickets: 0,
    },
  },
};

export const ExplainableAiTab: React.FC = () => {
  const [selectedPreset, setSelectedPreset] = useState<string>('high_risk');
  const [customer, setCustomer] = useState<CustomerState>(PRESET_ARCHETYPES.high_risk.data);

  const handleSelectPreset = (key: string) => {
    setSelectedPreset(key);
    setCustomer({ ...PRESET_ARCHETYPES[key].data });
  };

  const explanation = useMemo(() => {
    return computeLocalExplainability(customer);
  }, [customer]);

  // Counterfactual baseline comparison:
  // If we applied optimal retention actions (1-year contract + tech support + tickets resolved)
  const counterfactualIntervention = useMemo(() => {
    const optimized = {
      ...customer,
      contract: customer.contract === 'Month-to-month' ? ('One year' as const) : customer.contract,
      techSupport: true,
      numSupportTickets: Math.min(customer.numSupportTickets, 1),
    };
    return computeLocalExplainability(optimized);
  }, [customer]);

  const riskReduction = Math.max(
    0,
    Math.round((explanation.finalProbability - counterfactualIntervention.finalProbability) * 100)
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="border border-slate-800 bg-slate-900/40 rounded-xl p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 mb-1">
              <span>Stage 04</span>
              <span aria-hidden="true">·</span>
              <span>Explainable AI & Counterfactual Reasoning</span>
            </div>
            <h2 className="text-xl font-bold text-white">
              SHAP Interpretability & Counterfactual "What-If" Simulator
            </h2>
            <p className="text-xs text-slate-400 mt-1 max-w-2xl">
              Black-box ML models are rejected by stakeholders. Using TreeExplainer SHAP (SHapley Additive
              exPlanations), we deconstruct every individual prediction into additive feature pushes and simulate
              counterfactual interventions to reverse churn risk.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-3 py-1.5 text-xs font-mono rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              TreeExplainer Calibrated
            </span>
          </div>
        </div>

        {/* Archetype Quick Selectors */}
        <div className="mt-6">
          <div className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
            Select Customer Archetype or Customize Features
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {Object.entries(PRESET_ARCHETYPES).map(([key, item]) => {
              const isSelected = selectedPreset === key;
              return (
                <button
                  key={key}
                  onClick={() => handleSelectPreset(key)}
                  className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                    isSelected
                      ? 'border-cyan-500/60 bg-slate-900 shadow-sm ring-1 ring-cyan-500/30'
                      : 'border-slate-800 bg-slate-950 hover:bg-slate-900/60'
                  }`}
                >
                  <div className="text-xs font-semibold text-white">{item.label}</div>
                  <p className="text-[11px] text-slate-400 mt-1 leading-normal">{item.description}</p>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Grid: Interactive Sliders (Left) vs Live SHAP Waterfall (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Interactive Feature Sliders */}
        <div className="lg:col-span-5 border border-slate-800 bg-slate-900/40 rounded-xl p-6 space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <Sliders className="w-4 h-4 text-cyan-400" />
              <h3 className="text-sm font-semibold text-white">Adjust Customer Parameters</h3>
            </div>
            <button
              onClick={() => handleSelectPreset('high_risk')}
              className="text-xs font-mono text-slate-400 hover:text-white flex items-center gap-1"
            >
              <RefreshCw className="w-3 h-3" /> Reset
            </button>
          </div>

          {/* Tenure Slider */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs">
              <span className="text-slate-300">Tenure (Months)</span>
              <span className="font-mono text-cyan-400 font-semibold">{customer.tenureMonths} mo</span>
            </div>
            <input
              type="range"
              min="1"
              max="72"
              value={customer.tenureMonths}
              onChange={(e) => {
                setSelectedPreset('custom');
                setCustomer({ ...customer, tenureMonths: parseInt(e.target.value) });
              }}
              className="w-full accent-cyan-400 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-500 font-mono">
              <span>1 mo (High risk)</span>
              <span>72 mo (High loyalty)</span>
            </div>
          </div>

          {/* Monthly Charges Slider */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs">
              <span className="text-slate-300">Monthly Recurring Charges ($)</span>
              <span className="font-mono text-cyan-400 font-semibold">${customer.monthlyCharges.toFixed(2)}</span>
            </div>
            <input
              type="range"
              min="20"
              max="120"
              step="1"
              value={customer.monthlyCharges}
              onChange={(e) => {
                setSelectedPreset('custom');
                setCustomer({ ...customer, monthlyCharges: parseFloat(e.target.value) });
              }}
              className="w-full accent-cyan-400 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-500 font-mono">
              <span>$20</span>
              <span>$120</span>
            </div>
          </div>

          {/* Support Tickets Slider */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs">
              <span className="text-slate-300">Support Tickets (Last 90d)</span>
              <span
                className={`font-mono font-semibold ${
                  customer.numSupportTickets >= 3 ? 'text-red-400' : 'text-slate-200'
                }`}
              >
                {customer.numSupportTickets} tickets
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="6"
              value={customer.numSupportTickets}
              onChange={(e) => {
                setSelectedPreset('custom');
                setCustomer({ ...customer, numSupportTickets: parseInt(e.target.value) });
              }}
              className="w-full accent-red-400 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-500 font-mono">
              <span>0 (Nominal)</span>
              <span className="text-red-400">3+ (Hazard zone)</span>
              <span>6</span>
            </div>
          </div>

          {/* Contract Term Selector */}
          <div className="space-y-1.5">
            <div className="text-xs text-slate-300">Contract Term</div>
            <div className="grid grid-cols-3 gap-1.5">
              {(['Month-to-month', 'One year', 'Two year'] as const).map((term) => (
                <button
                  key={term}
                  onClick={() => {
                    setSelectedPreset('custom');
                    setCustomer({ ...customer, contract: term });
                  }}
                  className={`py-1.5 text-xs rounded-md font-medium transition-colors ${
                    customer.contract === term
                      ? 'bg-slate-800 text-cyan-400 border border-cyan-500/30'
                      : 'bg-slate-950 text-slate-400 border border-slate-800 hover:bg-slate-900'
                  }`}
                >
                  {term}
                </button>
              ))}
            </div>
          </div>

          {/* Add-on Services Toggles */}
          <div className="grid grid-cols-2 gap-3 pt-2">
            <label className="flex items-center gap-2 p-2.5 rounded-lg bg-slate-950 border border-slate-800 cursor-pointer hover:bg-slate-900/60 transition-colors">
              <input
                type="checkbox"
                checked={customer.techSupport}
                onChange={(e) => {
                  setSelectedPreset('custom');
                  setCustomer({ ...customer, techSupport: e.target.checked });
                }}
                className="rounded accent-cyan-400 cursor-pointer"
              />
              <span className="text-xs text-slate-300">Tech Support</span>
            </label>

            <label className="flex items-center gap-2 p-2.5 rounded-lg bg-slate-950 border border-slate-800 cursor-pointer hover:bg-slate-900/60 transition-colors">
              <input
                type="checkbox"
                checked={customer.onlineSecurity}
                onChange={(e) => {
                  setSelectedPreset('custom');
                  setCustomer({ ...customer, onlineSecurity: e.target.checked });
                }}
                className="rounded accent-cyan-400 cursor-pointer"
              />
              <span className="text-xs text-slate-300">Online Security</span>
            </label>
          </div>

          {/* Fiber Optic Toggle */}
          <label className="flex items-center justify-between p-2.5 rounded-lg bg-slate-950 border border-slate-800 cursor-pointer hover:bg-slate-900/60 transition-colors">
            <span className="text-xs text-slate-300">Fiber Optic High-Speed Connection</span>
            <input
              type="checkbox"
              checked={customer.fiberOptic}
              onChange={(e) => {
                setSelectedPreset('custom');
                setCustomer({ ...customer, fiberOptic: e.target.checked });
              }}
              className="rounded accent-cyan-400 cursor-pointer"
            />
          </label>
        </div>

        {/* Right Column: Live SHAP Waterfall Decomposition & Counterfactual Impact */}
        <div className="lg:col-span-7 space-y-6">
          {/* Risk Prediction Banner */}
          <div className="border border-slate-800 bg-slate-900/40 rounded-xl p-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
              <div>
                <span className="text-xs font-mono text-slate-400 uppercase">Live Model Prediction</span>
                <div className="text-xl font-bold text-white mt-1 flex items-baseline gap-3">
                  <span>Predicted Churn Propensity:</span>
                  <span
                    className={`text-3xl font-mono tabular-nums ${
                      explanation.finalProbability >= 0.65
                        ? 'text-red-400'
                        : explanation.finalProbability >= 0.38
                        ? 'text-amber-400'
                        : 'text-emerald-400'
                    }`}
                  >
                    {(explanation.finalProbability * 100).toFixed(1)}%
                  </span>
                </div>
              </div>

              <div className="text-right">
                <span
                  className={`inline-block px-3 py-1 text-xs font-mono font-semibold rounded-md ${
                    explanation.finalProbability >= 0.65
                      ? 'bg-red-500/20 text-red-300 border border-red-500/30'
                      : explanation.finalProbability >= 0.38
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                      : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                  }`}
                >
                  {explanation.finalProbability >= 0.65
                    ? 'HIGH ATTRITION RISK'
                    : explanation.finalProbability >= 0.38
                    ? 'ELEVATED RISK'
                    : 'LOW RISK / RETENTION SAFE'}
                </span>
                <div className="text-[11px] text-slate-500 font-mono mt-1">
                  Population Baseline: {(explanation.baseProbability * 100).toFixed(1)}%
                </div>
              </div>
            </div>

            {/* Local SHAP Waterfall Plot */}
            <div className="mt-5">
              <div className="flex items-center justify-between text-xs text-slate-300 mb-3">
                <span className="font-semibold uppercase tracking-wider">
                  SHAP Additive Factor Attribution
                </span>
                <span className="text-[11px] text-slate-400 font-mono">
                  <span className="text-red-400 font-semibold">+ Increases Risk</span> |{' '}
                  <span className="text-emerald-400 font-semibold">- Decreases Risk</span>
                </span>
              </div>

              <div className="space-y-2.5">
                {explanation.contributions.map((item, idx) => {
                  const isRisk = item.contribution > 0;
                  const absVal = Math.abs(item.contribution);
                  const barWidthPercent = Math.min(100, Math.round((absVal / 1.0) * 100));

                  return (
                    <div key={idx} className="space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-slate-300 font-medium">
                          {item.featureName}{' '}
                          <span className="text-slate-500 font-mono">({item.displayValue})</span>
                        </span>
                        <span
                          className={`font-mono tabular-nums font-semibold ${
                            isRisk ? 'text-red-400' : 'text-emerald-400'
                          }`}
                        >
                          {item.contribution > 0
                            ? `+${item.contribution.toFixed(2)}`
                            : item.contribution.toFixed(2)}
                        </span>
                      </div>

                      {/* Waterfall Bar */}
                      <div className="h-2 w-full bg-slate-950 rounded-full overflow-hidden flex items-center">
                        <div
                          style={{ width: `${barWidthPercent}%` }}
                          className={`h-full rounded-full ${
                            isRisk ? 'bg-red-500' : 'bg-emerald-400'
                          }`}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Prescriptive Counterfactual "What-If" Analysis Card */}
          <div className="border border-emerald-500/30 bg-emerald-950/20 rounded-xl p-5">
            <div className="flex items-start gap-3">
              <Zap className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-sm font-semibold text-emerald-300">
                  Prescriptive Counterfactual Retention Strategy
                </h4>
                <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                  If this subscriber is transitioned from Month-to-month to a <strong>1-Year Contract</strong> with
                  free <strong>Tech Support</strong> and resolved ticket issues, predicted churn drops by{' '}
                  <strong className="text-emerald-400 font-mono">-{riskReduction}%</strong> (down to{' '}
                  <span className="font-mono font-bold text-white">
                    {(counterfactualIntervention.finalProbability * 100).toFixed(1)}%
                  </span>
                  ).
                </p>

                <div className="mt-3 flex items-center gap-2">
                  <button
                    onClick={() => {
                      setCustomer({
                        ...customer,
                        contract: 'One year',
                        techSupport: true,
                        numSupportTickets: 0,
                      });
                    }}
                    className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30 border border-emerald-500/40 transition-colors flex items-center gap-1.5 cursor-pointer"
                  >
                    Apply Counterfactual Interventions
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Global SHAP Beeswarm & Feature Gain Ranking */}
      <div className="border border-slate-800 bg-slate-900/40 rounded-xl p-6">
        <div className="mb-4">
          <h3 className="text-base font-semibold text-white">Global Feature Importance (XGBoost SHAP vs Tree Gain)</h3>
          <p className="text-xs text-slate-400">
            Average absolute SHAP impact |E[|f(x) - E[f(x)]|]| computed across all 7,043 customer accounts.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 font-mono">
                <th className="py-2.5 px-3">Feature Name</th>
                <th className="py-2.5 px-3">Category</th>
                <th className="py-2.5 px-3 text-right">Mean |SHAP| Value</th>
                <th className="py-2.5 px-3 text-right">Split Gain Score</th>
                <th className="py-2.5 px-3">Primary Risk Vector</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono">
              {GLOBAL_SHAP_IMPORTANCE.map((row, idx) => (
                <tr key={idx} className="hover:bg-slate-800/30 transition-colors">
                  <td className="py-2.5 px-3 font-sans font-medium text-slate-200">{row.feature}</td>
                  <td className="py-2.5 px-3">
                    <span className="text-[11px] text-slate-400 font-sans">{row.category}</span>
                  </td>
                  <td className="py-2.5 px-3 text-right tabular-nums font-semibold text-cyan-400">
                    {row.meanAbsShap.toFixed(2)}
                  </td>
                  <td className="py-2.5 px-3 text-right tabular-nums text-slate-300">
                    {row.gainScore.toFixed(1)}
                  </td>
                  <td className="py-2.5 px-3 font-sans">
                    <span
                      className={`text-[11px] font-medium ${
                        row.direction === 'Increases risk'
                          ? 'text-red-400'
                          : row.direction === 'Decreases risk'
                          ? 'text-emerald-400'
                          : 'text-amber-400'
                      }`}
                    >
                      {row.direction}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
