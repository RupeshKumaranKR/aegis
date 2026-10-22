import React, { useState } from 'react';
import {
  Terminal,
  Activity,
  AlertTriangle,
  CheckCircle2,
  Play,
  RotateCcw,
  Zap,
  Server,
  Code,
  ShieldAlert,
} from 'lucide-react';
import { calculatePSI } from '../utils/mlCalculations';

interface DriftFeature {
  name: string;
  expectedDistribution: number[];
  actualDistribution: number[];
  thresholdWarning: number;
  thresholdCritical: number;
}

export const MlOpsMonitoringTab: React.FC = () => {
  const [isDriftInjected, setIsDriftInjected] = useState<boolean>(false);
  const [isSimulatingStream, setIsSimulatingStream] = useState<boolean>(false);
  const [streamCount, setStreamCount] = useState<number>(428);
  const [recentLatency, setRecentLatency] = useState<number>(13.4);

  // Feature distributions: Expected (train) vs Actual (production)
  const features: DriftFeature[] = [
    {
      name: 'Contract Type Distribution',
      expectedDistribution: [3875, 1473, 1695], // M2M, 1yr, 2yr
      actualDistribution: isDriftInjected
        ? [5400, 950, 693] // Shift toward month-to-month in recession
        : [3910, 1450, 1683],
      thresholdWarning: 0.10,
      thresholdCritical: 0.25,
    },
    {
      name: 'Customer Support Tickets (90d)',
      expectedDistribution: [4200, 1650, 720, 340, 133],
      actualDistribution: isDriftInjected
        ? [2100, 1800, 1400, 980, 763] // Massive increase in tickets
        : [4150, 1680, 740, 330, 143],
      thresholdWarning: 0.10,
      thresholdCritical: 0.25,
    },
    {
      name: 'Tenure Cohort Bins',
      expectedDistribution: [1400, 1200, 1500, 1400, 1543],
      actualDistribution: isDriftInjected
        ? [2800, 1600, 1100, 800, 743] // Newer customers dominating
        : [1420, 1190, 1490, 1410, 1533],
      thresholdWarning: 0.10,
      thresholdCritical: 0.25,
    },
    {
      name: 'Monthly Recurring Charges ($)',
      expectedDistribution: [2200, 1800, 2000, 1043],
      actualDistribution: isDriftInjected
        ? [1500, 1400, 2600, 1543]
        : [2210, 1790, 2020, 1023],
      thresholdWarning: 0.10,
      thresholdCritical: 0.25,
    },
  ];

  const handleSimulateBatch = () => {
    setIsSimulatingStream(true);
    let current = 0;
    const interval = setInterval(() => {
      current += 10;
      setStreamCount((prev) => prev + 10);
      setRecentLatency(Math.round((11.5 + Math.random() * 5.2) * 10) / 10);
      if (current >= 50) {
        clearInterval(interval);
        setIsSimulatingStream(false);
      }
    }, 150);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="border border-slate-800 bg-slate-900/40 rounded-xl p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 mb-1">
              <span>Stage 05</span>
              <span aria-hidden="true">·</span>
              <span>Production Health & Drift Monitoring</span>
            </div>
            <h2 className="text-xl font-bold text-white">
              MLOps Pipeline, Covariate Shift & Inference Health
            </h2>
            <p className="text-xs text-slate-400 mt-1 max-w-2xl">
              Real-world data science does not end with training. Models degrade as customer behaviors shift.
              AegisChurn runs continuous Population Stability Index (PSI) drift detection on incoming production payloads.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsDriftInjected(!isDriftInjected)}
              className={`px-3 py-1.5 text-xs font-mono font-medium rounded-lg border transition-colors flex items-center gap-1.5 cursor-pointer ${
                isDriftInjected
                  ? 'bg-red-500/20 text-red-300 border-red-500/40'
                  : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
              }`}
            >
              <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
              {isDriftInjected ? 'Drift Injected (Active)' : 'Simulate Macro Shift / Drift'}
            </button>
          </div>
        </div>

        {/* Live System Metrics Strip */}
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 rounded-lg bg-slate-950 border border-slate-800">
            <div className="text-[11px] text-slate-400 font-medium">Service Status</div>
            <div className="mt-1 text-base font-bold font-mono text-emerald-400 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              HEALTHY / NOMINAL
            </div>
            <div className="text-[10px] text-slate-500 mt-1 font-mono">Uptime: 99.98% (Dockerized)</div>
          </div>

          <div className="p-4 rounded-lg bg-slate-950 border border-slate-800">
            <div className="text-[11px] text-slate-400 font-medium">Live Scoring Throughput</div>
            <div className="mt-1 text-base font-bold font-mono text-white tabular-nums">
              {streamCount.toLocaleString()} requests
            </div>
            <div className="text-[10px] text-slate-500 mt-1 font-mono">Simulated production queue</div>
          </div>

          <div className="p-4 rounded-lg bg-slate-950 border border-slate-800">
            <div className="text-[11px] text-slate-400 font-medium">P95 Inference Latency</div>
            <div className="mt-1 text-base font-bold font-mono text-cyan-400 tabular-nums">
              {recentLatency} ms
            </div>
            <div className="text-[10px] text-slate-500 mt-1 font-mono">FastAPI async worker</div>
          </div>

          <div className="p-4 rounded-lg bg-slate-950 border border-slate-800">
            <div className="text-[11px] text-slate-400 font-medium">Global Drift Status</div>
            <div
              className={`mt-1 text-base font-bold font-mono ${
                isDriftInjected ? 'text-red-400' : 'text-emerald-400'
              }`}
            >
              {isDriftInjected ? 'CRITICAL SHIFT DETECTED' : 'STABLE (PSI < 0.10)'}
            </div>
            <div className="text-[10px] text-slate-500 mt-1 font-mono">
              {isDriftInjected ? 'Automated Retrain Triggered' : 'All 38 features within bounds'}
            </div>
          </div>
        </div>
      </div>

      {/* Population Stability Index (PSI) Covariate Drift Matrix */}
      <div className="border border-slate-800 bg-slate-900/40 rounded-xl p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
          <div>
            <h3 className="text-base font-semibold text-white">Population Stability Index (PSI) Feature Audit</h3>
            <p className="text-xs text-slate-400">
              PSI metric: &lt;0.10 Stable · 0.10–0.25 Warning / Moderate Shift · &ge;0.25 Critical Shift (Retrain Required)
            </p>
          </div>

          <button
            onClick={handleSimulateBatch}
            disabled={isSimulatingStream}
            className="px-3.5 py-1.5 text-xs font-semibold rounded-lg bg-cyan-400 hover:bg-cyan-300 text-slate-950 transition-colors flex items-center gap-1.5 disabled:opacity-60 cursor-pointer self-start sm:self-auto"
          >
            <Play className="w-3.5 h-3.5" />
            {isSimulatingStream ? 'Streaming Inferences...' : 'Simulate 50 Inferences'}
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {features.map((feat) => {
            const { psi, status } = calculatePSI(feat.expectedDistribution, feat.actualDistribution);
            const isCritical = status === 'critical';
            const isWarning = status === 'moderate';

            return (
              <div
                key={feat.name}
                className={`p-4 rounded-xl border transition-all ${
                  isCritical
                    ? 'bg-red-950/20 border-red-500/40 ring-1 ring-red-500/20'
                    : isWarning
                    ? 'bg-amber-950/20 border-amber-500/30'
                    : 'bg-slate-950 border-slate-800'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="text-sm font-semibold text-white">{feat.name}</div>
                    <div className="text-xs text-slate-400 mt-0.5">
                      Baseline Cohort vs Live Inference Payloads
                    </div>
                  </div>

                  <span
                    className={`px-2 py-0.5 text-xs font-mono font-semibold rounded ${
                      isCritical
                        ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                        : isWarning
                        ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                        : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                    }`}
                  >
                    PSI: {psi.toFixed(3)}
                  </span>
                </div>

                {/* Progress bar visualizing PSI relative to 0.30 critical mark */}
                <div className="mt-3">
                  <div className="h-2 w-full bg-slate-900 rounded-full overflow-hidden">
                    <div
                      style={{ width: `${Math.min(100, (psi / 0.30) * 100)}%` }}
                      className={`h-full rounded-full transition-all ${
                        isCritical ? 'bg-red-500' : isWarning ? 'bg-amber-400' : 'bg-emerald-400'
                      }`}
                    />
                  </div>
                </div>

                <div className="mt-3 flex items-center justify-between text-xs text-slate-400">
                  <span>
                    Status:{' '}
                    <strong
                      className={
                        isCritical ? 'text-red-400' : isWarning ? 'text-amber-400' : 'text-emerald-400'
                      }
                    >
                      {isCritical ? 'Action Required: Retrain' : isWarning ? 'Moderate Shift' : 'Stable'}
                    </strong>
                  </span>
                  <span className="font-mono text-[11px] text-slate-500">
                    Threshold: {feat.thresholdWarning} / {feat.thresholdCritical}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Production FastAPI Microservice & OpenAPI Schema */}
      <div className="border border-slate-800 bg-slate-900/40 rounded-xl p-6">
        <div className="flex items-center gap-2 mb-4">
          <Server className="w-5 h-5 text-cyan-400" />
          <h3 className="text-base font-semibold text-white">Production REST API Specification (FastAPI)</h3>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left: Request Payload */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs text-slate-300 font-mono">
              <span className="text-emerald-400 font-semibold">POST /v1/predict</span>
              <span className="text-slate-500">Content-Type: application/json</span>
            </div>

            <pre className="p-4 rounded-lg bg-slate-950 border border-slate-800 text-xs font-mono text-cyan-200 overflow-x-auto leading-relaxed">
{`curl -X POST "http://localhost:8000/v1/predict" \\
  -H "Content-Type: application/json" \\
  -d '{
    "tenure": 3,
    "monthly_charges": 89.50,
    "contract": "Month-to-month",
    "internet_service": "Fiber optic",
    "tech_support": false,
    "online_security": false,
    "support_tickets": 3,
    "payment_method": "Electronic check"
  }'`}
            </pre>
          </div>

          {/* Right: Response Payload */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs text-slate-300 font-mono">
              <span className="text-cyan-400 font-semibold">200 OK Response (JSON)</span>
              <span className="text-slate-500">Latency: 14.2ms</span>
            </div>

            <pre className="p-4 rounded-lg bg-slate-950 border border-slate-800 text-xs font-mono text-emerald-300 overflow-x-auto leading-relaxed">
{`{
  "customer_id": "REQ-7910",
  "churn_probability": 0.814,
  "risk_tier": "High Risk",
  "decision_threshold": 0.38,
  "recommended_intervention": "Offer 1-Year Contract discount (-15%) + free 6mo Tech Support",
  "estimated_saved_value_usd": 1074.00,
  "latency_ms": 14.2
}`}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};
