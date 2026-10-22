import React, { useState } from 'react';
import {
  Cpu,
  Award,
  Layers,
  Activity,
  CheckCircle2,
  Clock,
  Sparkles,
  BarChart,
  GitCommit,
} from 'lucide-react';
import {
  MODEL_BENCHMARKS,
  CALIBRATION_DATA,
  ModelBenchmark,
} from '../data/modelBenchmarks';

export const ModelBenchmarkTab: React.FC = () => {
  const [selectedModelId, setSelectedModelId] = useState<string>('xgboost_tuned');
  const [activeCurve, setActiveCurve] = useState<'roc' | 'pr' | 'calibration'>('roc');

  const selectedModel =
    MODEL_BENCHMARKS.find((m) => m.id === selectedModelId) || MODEL_BENCHMARKS[0];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="border border-slate-800 bg-slate-900/40 rounded-xl p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 mb-1">
              <span>Stage 03</span>
              <span aria-hidden="true">·</span>
              <span>Model Tournament & Validation</span>
            </div>
            <h2 className="text-xl font-bold text-white">
              Multi-Model Tournament & Calibration Arena
            </h2>
            <p className="text-xs text-slate-400 mt-1 max-w-2xl">
              Benchmarking 5 candidate architectures across 5-fold stratified cross-validation.
              Optimized for Precision-Recall Area Under the Curve (PR-AUC) to address class imbalance.
            </p>
          </div>

          <div className="flex items-center gap-2 self-start md:self-auto">
            <span className="px-3 py-1.5 text-xs font-mono rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1.5">
              <Award className="w-4 h-4" />
              Champion: XGBoost (0.884 ROC-AUC)
            </span>
          </div>
        </div>

        {/* Model Selection Cards */}
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {MODEL_BENCHMARKS.map((model) => {
            const isSelected = model.id === selectedModelId;
            const isChampion = model.id === 'xgboost_tuned';

            return (
              <button
                key={model.id}
                onClick={() => setSelectedModelId(model.id)}
                className={`text-left p-3.5 rounded-xl border transition-all cursor-pointer ${
                  isSelected
                    ? 'border-cyan-500/60 bg-slate-900 shadow-md ring-1 ring-cyan-500/30'
                    : 'border-slate-800 bg-slate-950 hover:bg-slate-900/60'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono text-slate-500 uppercase">{model.family}</span>
                  {isChampion && (
                    <span className="text-[10px] font-mono text-cyan-400 font-semibold">Champion</span>
                  )}
                </div>

                <div className="text-xs font-semibold text-white mt-1 truncate">{model.name}</div>

                <div className="mt-3 flex items-baseline justify-between">
                  <span className="text-[11px] text-slate-400">ROC-AUC:</span>
                  <span className="text-sm font-mono font-bold text-cyan-400 tabular-nums">
                    {model.rocAuc.toFixed(3)}
                  </span>
                </div>

                <div className="mt-1 flex items-baseline justify-between text-[11px]">
                  <span className="text-slate-500">PR-AUC:</span>
                  <span className="font-mono text-amber-400 tabular-nums">{model.prAuc.toFixed(3)}</span>
                </div>

                <div className="mt-1 flex items-baseline justify-between text-[11px]">
                  <span className="text-slate-500">Latency:</span>
                  <span className="font-mono text-slate-400 tabular-nums">{model.latencyMs} ms</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Interactive Charts & Deep Dive */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Interactive Visual Curve (ROC / PR / Calibration) */}
        <div className="lg:col-span-2 border border-slate-800 bg-slate-900/40 rounded-xl p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
            <div>
              <h3 className="text-base font-semibold text-white">Validation Curves</h3>
              <p className="text-xs text-slate-400">Inspecting curve dynamics on hold-out evaluation folds</p>
            </div>

            <div className="flex items-center gap-1 p-1 bg-slate-950 border border-slate-800 rounded-lg text-xs">
              <button
                onClick={() => setActiveCurve('roc')}
                className={`px-3 py-1.5 rounded-md font-medium transition-colors ${
                  activeCurve === 'roc' ? 'bg-slate-800 text-cyan-400' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                ROC-AUC Curve
              </button>
              <button
                onClick={() => setActiveCurve('pr')}
                className={`px-3 py-1.5 rounded-md font-medium transition-colors ${
                  activeCurve === 'pr' ? 'bg-slate-800 text-cyan-400' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                PR Curve (Precision-Recall)
              </button>
              <button
                onClick={() => setActiveCurve('calibration')}
                className={`px-3 py-1.5 rounded-md font-medium transition-colors ${
                  activeCurve === 'calibration'
                    ? 'bg-slate-800 text-cyan-400'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Calibration (Reliability)
              </button>
            </div>
          </div>

          {/* SVG Chart Rendering */}
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 relative">
            {activeCurve === 'roc' && (
              <div>
                <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                  <span>ROC Curve: False Positive Rate vs True Positive Rate</span>
                  <span className="font-mono text-cyan-400 font-semibold">
                    AUC = {selectedModel.rocAuc.toFixed(3)}
                  </span>
                </div>

                <svg viewBox="0 0 500 320" className="w-full h-64 sm:h-72">
                  {/* Grid Lines */}
                  {[0, 0.25, 0.5, 0.75, 1].map((val) => {
                    const y = 280 - val * 240;
                    const x = 50 + val * 400;
                    return (
                      <g key={val}>
                        <line x1="50" y1={y} x2="450" y2={y} stroke="#1e293b" strokeDasharray="3 3" />
                        <line x1={x} y1="40" x2={x} y2="280" stroke="#1e293b" strokeDasharray="3 3" />
                        <text x="40" y={y + 4} fill="#64748b" fontSize="10" textAnchor="end" fontFamily="monospace">
                          {val.toFixed(2)}
                        </text>
                        <text x={x} y="298" fill="#64748b" fontSize="10" textAnchor="middle" fontFamily="monospace">
                          {val.toFixed(2)}
                        </text>
                      </g>
                    );
                  })}

                  {/* Axis labels */}
                  <text x="250" y="315" fill="#94a3b8" fontSize="11" textAnchor="middle">
                    False Positive Rate (1 - Specificity)
                  </text>
                  <text
                    x="-160"
                    y="18"
                    fill="#94a3b8"
                    fontSize="11"
                    textAnchor="middle"
                    transform="rotate(-90)"
                  >
                    True Positive Rate (Recall / Sensitivity)
                  </text>

                  {/* Diagonal Chance Line */}
                  <line x1="50" y1="280" x2="450" y2="40" stroke="#475569" strokeDasharray="4 4" strokeWidth="1.5" />

                  {/* ROC Curves for other models in faint gray */}
                  {MODEL_BENCHMARKS.filter((m) => m.id !== selectedModel.id && m.id !== 'dummy_baseline').map((m) => {
                    const pathData = m.rocPoints
                      .map((pt, i) => {
                        const px = 50 + pt.fpr * 400;
                        const py = 280 - pt.tpr * 240;
                        return `${i === 0 ? 'M' : 'L'} ${px} ${py}`;
                      })
                      .join(' ');
                    return <path key={m.id} d={pathData} fill="none" stroke="#334155" strokeWidth="1.2" />;
                  })}

                  {/* Active Selected Model ROC Curve */}
                  {(() => {
                    const pathData = selectedModel.rocPoints
                      .map((pt, i) => {
                        const px = 50 + pt.fpr * 400;
                        const py = 280 - pt.tpr * 240;
                        return `${i === 0 ? 'M' : 'L'} ${px} ${py}`;
                      })
                      .join(' ');

                    const areaData = `${pathData} L 450 280 L 50 280 Z`;

                    return (
                      <g>
                        <path d={areaData} fill="url(#cyanGlow)" opacity="0.15" />
                        <path d={pathData} fill="none" stroke="#22d3ee" strokeWidth="2.5" />
                        {selectedModel.rocPoints.map((pt, idx) => (
                          <circle
                            key={idx}
                            cx={50 + pt.fpr * 400}
                            cy={280 - pt.tpr * 240}
                            r="3.5"
                            fill="#0b0f19"
                            stroke="#22d3ee"
                            strokeWidth="1.5"
                          />
                        ))}
                      </g>
                    );
                  })()}

                  <defs>
                    <linearGradient id="cyanGlow" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#22d3ee" stopOpacity="0.8" />
                      <stop offset="100%" stopColor="#22d3ee" stopOpacity="0.0" />
                    </linearGradient>
                  </defs>
                </svg>

                <div className="mt-2 text-[11px] text-slate-400 flex items-center justify-between">
                  <span>Selected Model: <strong className="text-white">{selectedModel.name}</strong></span>
                  <span className="text-slate-500">Dotted line indicates random guess classifier (AUC = 0.50)</span>
                </div>
              </div>
            )}

            {activeCurve === 'pr' && (
              <div>
                <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                  <span>Precision-Recall Curve (Crucial for 26.5% Imbalanced Churn)</span>
                  <span className="font-mono text-amber-400 font-semibold">
                    PR-AUC = {selectedModel.prAuc.toFixed(3)}
                  </span>
                </div>

                <svg viewBox="0 0 500 320" className="w-full h-64 sm:h-72">
                  {[0, 0.25, 0.5, 0.75, 1].map((val) => {
                    const y = 280 - val * 240;
                    const x = 50 + val * 400;
                    return (
                      <g key={val}>
                        <line x1="50" y1={y} x2="450" y2={y} stroke="#1e293b" strokeDasharray="3 3" />
                        <line x1={x} y1="40" x2={x} y2="280" stroke="#1e293b" strokeDasharray="3 3" />
                        <text x="40" y={y + 4} fill="#64748b" fontSize="10" textAnchor="end" fontFamily="monospace">
                          {val.toFixed(2)}
                        </text>
                        <text x={x} y="298" fill="#64748b" fontSize="10" textAnchor="middle" fontFamily="monospace">
                          {val.toFixed(2)}
                        </text>
                      </g>
                    );
                  })}

                  <text x="250" y="315" fill="#94a3b8" fontSize="11" textAnchor="middle">
                    Recall
                  </text>
                  <text
                    x="-160"
                    y="18"
                    fill="#94a3b8"
                    fontSize="11"
                    textAnchor="middle"
                    transform="rotate(-90)"
                  >
                    Precision
                  </text>

                  {/* Horizontal baseline at prevalence 0.265 */}
                  <line
                    x1="50"
                    y1={280 - 0.265 * 240}
                    x2="450"
                    y2={280 - 0.265 * 240}
                    stroke="#dc2626"
                    strokeDasharray="4 4"
                    strokeWidth="1.5"
                  />
                  <text x="445" y={280 - 0.265 * 240 - 5} fill="#f87171" fontSize="9" textAnchor="end" fontFamily="monospace">
                    Prevalence Baseline (0.265)
                  </text>

                  {/* PR curve path */}
                  {(() => {
                    const pathData = selectedModel.prPoints
                      .map((pt, i) => {
                        const px = 50 + pt.recall * 400;
                        const py = 280 - pt.precision * 240;
                        return `${i === 0 ? 'M' : 'L'} ${px} ${py}`;
                      })
                      .join(' ');

                    return (
                      <g>
                        <path d={pathData} fill="none" stroke="#fbbf24" strokeWidth="2.5" />
                        {selectedModel.prPoints.map((pt, idx) => (
                          <circle
                            key={idx}
                            cx={50 + pt.recall * 400}
                            cy={280 - pt.precision * 240}
                            r="3.5"
                            fill="#0b0f19"
                            stroke="#fbbf24"
                            strokeWidth="1.5"
                          />
                        ))}
                      </g>
                    );
                  })()}
                </svg>

                <div className="mt-2 text-[11px] text-slate-400">
                  <span className="text-amber-400 font-semibold">High Retention Value:</span> At 68% Recall, the model maintains a high 71.2% Precision, preventing massive waste in customer retention promotions.
                </div>
              </div>
            )}

            {activeCurve === 'calibration' && (
              <div>
                <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                  <span>Reliability Diagram (Predicted Prob vs Actual Fraction)</span>
                  <span className="font-mono text-emerald-400 font-semibold">
                    Brier Score: {selectedModel.brierScore.toFixed(3)}
                  </span>
                </div>

                <div className="space-y-2 pt-2">
                  {CALIBRATION_DATA.map((bin) => (
                    <div key={bin.binRange} className="flex items-center gap-3 text-xs font-mono">
                      <span className="w-24 text-slate-400">{bin.binRange}</span>
                      <div className="flex-1 h-3 bg-slate-900 rounded overflow-hidden relative">
                        <div
                          style={{ width: `${bin.meanPredictedProb * 100}%` }}
                          className="h-full bg-cyan-500/70 absolute top-0 left-0"
                        />
                        <div
                          style={{ width: '2px', left: `${bin.observedPositiveFraction * 100}%` }}
                          className="h-full bg-emerald-400 absolute top-0 z-10"
                        />
                      </div>
                      <span className="w-16 text-right text-emerald-400 font-semibold">
                        {(bin.observedPositiveFraction * 100).toFixed(1)}%
                      </span>
                    </div>
                  ))}
                </div>

                <div className="mt-4 text-[11px] text-slate-400 border-t border-slate-800 pt-2 flex items-center justify-between">
                  <span>Cyan Bar: Mean Predicted Prob</span>
                  <span>Green Marker: Observed Empirical Churn Rate</span>
                  <span className="text-emerald-400">Excellent Calibration</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right: Model Architecture & Optuna Hyperparameters Deep Dive */}
        <div className="border border-slate-800 bg-slate-900/40 rounded-xl p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Cpu className="w-5 h-5 text-cyan-400" />
              <h3 className="text-base font-semibold text-white">{selectedModel.name}</h3>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">{selectedModel.description}</p>

            {/* Performance Metric Scorecard */}
            <div className="mt-5 space-y-2.5">
              <div className="flex items-center justify-between text-xs py-1.5 border-b border-slate-800/80">
                <span className="text-slate-400">F1-Score</span>
                <span className="font-mono text-white font-semibold">{selectedModel.f1Score.toFixed(3)}</span>
              </div>
              <div className="flex items-center justify-between text-xs py-1.5 border-b border-slate-800/80">
                <span className="text-slate-400">Precision</span>
                <span className="font-mono text-white font-semibold">{(selectedModel.precision * 100).toFixed(1)}%</span>
              </div>
              <div className="flex items-center justify-between text-xs py-1.5 border-b border-slate-800/80">
                <span className="text-slate-400">Recall / Sensitivity</span>
                <span className="font-mono text-white font-semibold">{(selectedModel.recall * 100).toFixed(1)}%</span>
              </div>
              <div className="flex items-center justify-between text-xs py-1.5 border-b border-slate-800/80">
                <span className="text-slate-400">Accuracy</span>
                <span className="font-mono text-white font-semibold">{(selectedModel.accuracy * 100).toFixed(1)}%</span>
              </div>
              <div className="flex items-center justify-between text-xs py-1.5 border-b border-slate-800/80">
                <span className="text-slate-400">Brier Calibration Score</span>
                <span className="font-mono text-white font-semibold">{selectedModel.brierScore.toFixed(3)}</span>
              </div>
              <div className="flex items-center justify-between text-xs py-1.5">
                <span className="text-slate-400">Inference Latency</span>
                <span className="font-mono text-purple-400 font-semibold">{selectedModel.latencyMs} ms</span>
              </div>
            </div>

            {/* Hyperparameters Config Block */}
            <div className="mt-5">
              <div className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                Hyperparameter Specs
              </div>
              <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 font-mono text-xs space-y-1">
                {Object.entries(selectedModel.hyperparameters).map(([key, value]) => (
                  <div key={key} className="flex justify-between text-slate-400">
                    <span className="text-slate-500">{key}:</span>
                    <span className="text-cyan-300 font-medium">{String(value)}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-5 p-3 rounded-lg bg-cyan-950/20 border border-cyan-500/20 text-xs text-cyan-200">
            <strong>CV Protocol:</strong> 5-fold Stratified K-Fold with no data leakage between preprocessing and validation splits.
          </div>
        </div>
      </div>
    </div>
  );
};
