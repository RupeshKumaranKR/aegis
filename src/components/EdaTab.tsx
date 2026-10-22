import React, { useState } from 'react';
import {
  BarChart3,
  Search,
  Filter,
  CheckCircle,
  AlertTriangle,
  HelpCircle,
  ArrowUpDown,
  BookOpen,
} from 'lucide-react';
import {
  SAMPLE_CUSTOMERS,
  CORRELATION_MATRIX,
  STATISTICAL_TESTS,
  DATASET_OVERVIEW,
  CustomerRecord,
} from '../data/telecomData';

export const EdaTab: React.FC = () => {
  const [selectedFeature, setSelectedFeature] = useState<'tenure' | 'monthlyCharges' | 'supportTickets' | 'contract'>('tenure');
  const [searchQuery, setSearchQuery] = useState('');
  const [churnFilter, setChurnFilter] = useState<'all' | 'churn' | 'retained'>('all');
  const [sortField, setSortField] = useState<keyof CustomerRecord>('churnRiskScore');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  // Filter and sort customer samples
  const filteredCustomers = SAMPLE_CUSTOMERS.filter((c) => {
    const matchesSearch =
      c.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.contract.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.internetService.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesChurn =
      churnFilter === 'all' ? true : churnFilter === 'churn' ? c.churn === 1 : c.churn === 0;
    return matchesSearch && matchesChurn;
  }).sort((a, b) => {
    const valA = a[sortField];
    const valB = b[sortField];
    if (typeof valA === 'number' && typeof valB === 'number') {
      return sortOrder === 'asc' ? valA - valB : valB - valA;
    }
    return sortOrder === 'asc'
      ? String(valA).localeCompare(String(valB))
      : String(valB).localeCompare(String(valA));
  });

  const handleSort = (field: keyof CustomerRecord) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('desc');
    }
  };

  return (
    <div className="space-y-8">
      {/* Header and Dataset Overview */}
      <div className="border border-slate-800 bg-slate-900/40 rounded-xl p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 mb-1">
              <span>Stage 01</span>
              <span aria-hidden="true">·</span>
              <span>Data Profiling & Statistical Significance</span>
            </div>
            <h2 className="text-xl font-bold text-white">
              Exploratory Data Analysis & Hypothesis Testing
            </h2>
            <p className="text-xs text-slate-400 mt-1 max-w-2xl">
              Rigorous data exploration conducted on 7,043 customer accounts. Prior to model training,
              features were evaluated for non-linear correlation, multicollinearity, and distributional divergence.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-xs">
              <span className="text-slate-400">Total Records:</span>{' '}
              <strong className="text-white font-mono">{DATASET_OVERVIEW.totalRows.toLocaleString()}</strong>
            </div>
            <div className="px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-xs">
              <span className="text-slate-400">Baseline Churn:</span>{' '}
              <strong className="text-cyan-400 font-mono">{(DATASET_OVERVIEW.baselineChurnRate * 100).toFixed(1)}%</strong>
            </div>
          </div>
        </div>

        {/* Statistical Test Matrix */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          {STATISTICAL_TESTS.map((test, idx) => (
            <div key={idx} className="p-4 rounded-lg bg-slate-950/80 border border-slate-800">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <span className="text-xs font-mono text-cyan-400">{test.testName}</span>
                  <div className="text-sm font-semibold text-white mt-0.5">{test.variable}</div>
                </div>
                <span className="px-2 py-0.5 text-[10px] font-mono rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  {test.pValue}
                </span>
              </div>

              <div className="mt-2 text-xs text-slate-300">
                <span className="text-slate-500 font-mono">Stat:</span> {test.testStatistic}
              </div>

              <p className="mt-2 text-xs text-slate-400 leading-relaxed border-t border-slate-900 pt-2">
                {test.interpretation}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Feature Distribution Profiler */}
      <div className="border border-slate-800 bg-slate-900/40 rounded-xl p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
          <div>
            <h3 className="text-base font-semibold text-white">Feature Distribution by Churn Status</h3>
            <p className="text-xs text-slate-400">Comparing non-churners (blue) vs churners (crimson)</p>
          </div>

          <div className="flex items-center gap-1 p-1 bg-slate-950 border border-slate-800 rounded-lg">
            {(
              [
                ['tenure', 'Tenure (Months)'],
                ['monthlyCharges', 'Monthly Charges'],
                ['supportTickets', 'Support Tickets'],
                ['contract', 'Contract Type'],
              ] as const
            ).map(([key, label]) => (
              <button
                key={key}
                onClick={() => setSelectedFeature(key)}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                  selectedFeature === key
                    ? 'bg-slate-800 text-cyan-400 font-semibold shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Distribution Graphs & Statistical Insights */}
        {selectedFeature === 'tenure' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 p-4 rounded-lg bg-slate-950 border border-slate-800">
              <div className="text-xs text-slate-400 mb-3 flex items-center justify-between">
                <span>Tenure Duration Bins (Months 1 to 72)</span>
                <span className="font-mono text-emerald-400">Churners vs Retained</span>
              </div>

              <div className="space-y-3 pt-2">
                {[
                  { range: '0 - 6 mo (Early Attrition Peak)', churnPct: 52, retainPct: 14 },
                  { range: '7 - 18 mo', churnPct: 24, retainPct: 18 },
                  { range: '19 - 36 mo', churnPct: 14, retainPct: 22 },
                  { range: '37 - 54 mo', churnPct: 7, retainPct: 20 },
                  { range: '55 - 72 mo (High Loyalty)', churnPct: 3, retainPct: 26 },
                ].map((bin) => (
                  <div key={bin.range} className="space-y-1">
                    <div className="flex justify-between text-xs font-mono">
                      <span className="text-slate-300">{bin.range}</span>
                      <span className="text-slate-400">
                        <span className="text-red-400 font-semibold">{bin.churnPct}% Churn</span> vs{' '}
                        <span className="text-cyan-400">{bin.retainPct}% Retained</span>
                      </span>
                    </div>
                    <div className="h-3 w-full bg-slate-900 rounded-full overflow-hidden flex">
                      <div style={{ width: `${bin.churnPct}%` }} className="bg-red-500/80" />
                      <div style={{ width: `${bin.retainPct}%` }} className="bg-cyan-500/80" />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-4 rounded-lg bg-slate-950 border border-slate-800 space-y-3">
              <div className="text-xs font-semibold text-white uppercase tracking-wider">
                Tenure Hazard Function Findings
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Empirical survival analysis revealed a sharp <strong>hazard rate peak during months 1–4</strong>.
                Over 52% of all churn events take place within the initial half-year of customer onboarding.
              </p>
              <div className="p-3 rounded bg-cyan-950/20 border border-cyan-500/20 text-xs text-cyan-200">
                <strong>Engineered Feature:</strong> Added <code className="font-mono bg-cyan-950/60 px-1 py-0.5 rounded">is_early_stage_cohort = tenure &lt; 6</code> to capture early drop-off risk.
              </div>
            </div>
          </div>
        )}

        {selectedFeature === 'monthlyCharges' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 p-4 rounded-lg bg-slate-950 border border-slate-800">
              <div className="text-xs text-slate-400 mb-3 flex items-center justify-between">
                <span>Monthly Recurring Charges ($20 to $120)</span>
                <span className="font-mono text-emerald-400">Density Curve</span>
              </div>

              <div className="space-y-3 pt-2">
                {[
                  { range: '$20 - $35/mo (Basic DSL/Phone)', churnPct: 9, retainPct: 32 },
                  { range: '$36 - $65/mo', churnPct: 18, retainPct: 24 },
                  { range: '$66 - $85/mo', churnPct: 34, retainPct: 21 },
                  { range: '$86 - $105/mo (Fiber without discount)', churnPct: 32, retainPct: 16 },
                  { range: '$106 - $120/mo', churnPct: 7, retainPct: 7 },
                ].map((bin) => (
                  <div key={bin.range} className="space-y-1">
                    <div className="flex justify-between text-xs font-mono">
                      <span className="text-slate-300">{bin.range}</span>
                      <span className="text-slate-400">
                        <span className="text-red-400 font-semibold">{bin.churnPct}% Churn</span> vs{' '}
                        <span className="text-cyan-400">{bin.retainPct}% Retained</span>
                      </span>
                    </div>
                    <div className="h-3 w-full bg-slate-900 rounded-full overflow-hidden flex">
                      <div style={{ width: `${bin.churnPct}%` }} className="bg-red-500/80" />
                      <div style={{ width: `${bin.retainPct}%` }} className="bg-cyan-500/80" />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-4 rounded-lg bg-slate-950 border border-slate-800 space-y-3">
              <div className="text-xs font-semibold text-white uppercase tracking-wider">
                Price Sensitivity Analysis
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Churners concentrate heavily in the <strong>$70–$95 monthly tier</strong>. These users typically
                opt for Fiber Optic internet but decline add-on security/support services, experiencing high friction
                upon any technical disruption.
              </p>
              <div className="p-3 rounded bg-amber-950/20 border border-amber-500/20 text-xs text-amber-200">
                <strong>Price Elasticity:</strong> Mann-Whitney U test confirms mean difference ($74.44 vs $61.26, p &lt; 1e-12).
              </div>
            </div>
          </div>
        )}

        {selectedFeature === 'supportTickets' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 p-4 rounded-lg bg-slate-950 border border-slate-800">
              <div className="text-xs text-slate-400 mb-3 flex items-center justify-between">
                <span>Customer Care Tickets Opened (Last 90 Days)</span>
                <span className="font-mono text-emerald-400">Ticket Escalation Impact</span>
              </div>

              <div className="space-y-3 pt-2">
                {[
                  { tickets: '0 Tickets (Nominal)', churnRate: 6.4, count: 4200 },
                  { tickets: '1 Ticket (Minor Inquiry)', churnRate: 14.8, count: 1650 },
                  { tickets: '2 Tickets (Moderate Friction)', churnRate: 38.2, count: 720 },
                  { tickets: '3 Tickets (Critical Frustration)', churnRate: 72.5, count: 340 },
                  { tickets: '4+ Tickets (Imminent Churn)', churnRate: 91.0, count: 133 },
                ].map((row) => (
                  <div key={row.tickets} className="space-y-1">
                    <div className="flex justify-between text-xs font-mono">
                      <span className="text-slate-300">{row.tickets}</span>
                      <span className="text-red-400 font-semibold">{row.churnRate}% Churn Rate</span>
                    </div>
                    <div className="h-3 w-full bg-slate-900 rounded-full overflow-hidden">
                      <div style={{ width: `${row.churnRate}%` }} className="bg-red-500 h-full" />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-4 rounded-lg bg-slate-950 border border-slate-800 space-y-3">
              <div className="text-xs font-semibold text-white uppercase tracking-wider">
                Non-Linear Escalation
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Notice the exponential jump: going from 1 to 3 support tickets increases churn probability
                from 14.8% to 72.5% — a <strong>5x surge</strong> in attrition risk.
              </p>
              <div className="p-3 rounded bg-red-950/20 border border-red-500/20 text-xs text-red-200">
                <strong>Operational Action:</strong> Any customer with 3+ tickets automatically enters high-priority retention triage.
              </div>
            </div>
          </div>
        )}

        {selectedFeature === 'contract' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 p-4 rounded-lg bg-slate-950 border border-slate-800">
              <div className="text-xs text-slate-400 mb-3 flex items-center justify-between">
                <span>Contract Term Distribution</span>
                <span className="font-mono text-emerald-400">Churn Percentage</span>
              </div>

              <div className="space-y-4 pt-2">
                {[
                  { contract: 'Month-to-month (55% of cohort)', churnRate: 42.7, retainedRate: 57.3 },
                  { contract: 'One year (21% of cohort)', churnRate: 11.2, retainedRate: 88.8 },
                  { contract: 'Two year (24% of cohort)', churnRate: 2.8, retainedRate: 97.2 },
                ].map((row) => (
                  <div key={row.contract} className="space-y-1">
                    <div className="flex justify-between text-xs font-mono">
                      <span className="text-slate-300">{row.contract}</span>
                      <span className="text-slate-400">
                        <span className="text-red-400 font-semibold">{row.churnRate}% Churn</span> /{' '}
                        <span className="text-cyan-400">{row.retainedRate}% Retained</span>
                      </span>
                    </div>
                    <div className="h-4 w-full bg-slate-900 rounded-full overflow-hidden flex">
                      <div style={{ width: `${row.churnRate}%` }} className="bg-red-500" />
                      <div style={{ width: `${row.retainedRate}%` }} className="bg-cyan-500" />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-4 rounded-lg bg-slate-950 border border-slate-800 space-y-3">
              <div className="text-xs font-semibold text-white uppercase tracking-wider">
                Contract Lock-in Dynamics
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Two-year contract holders have a near-zero churn rate (2.8%). This validates contract duration
                as the single strongest global predictor in tree models.
              </p>
              <div className="p-3 rounded bg-emerald-950/20 border border-emerald-500/20 text-xs text-emerald-200">
                <strong>Targeted Offer:</strong> Upgrading month-to-month subscribers to an annual plan reduces churn risk by 74%.
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Correlation Matrix Heatmap */}
      <div className="border border-slate-800 bg-slate-900/40 rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base font-semibold text-white">Feature Correlation Matrix (Pearson & Spearman)</h3>
            <p className="text-xs text-slate-400">
              Ranked linear and monotonic association with the target churn outcome and collinearity screening.
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 font-mono">
                <th className="py-2.5 px-3">Feature A</th>
                <th className="py-2.5 px-3">Feature B</th>
                <th className="py-2.5 px-3 text-right">Pearson (r)</th>
                <th className="py-2.5 px-3 text-right">Spearman (ρ)</th>
                <th className="py-2.5 px-3 text-center">Significance</th>
                <th className="py-2.5 px-3">Relationship Type</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono">
              {CORRELATION_MATRIX.map((corr, idx) => {
                const isPositive = corr.pearson > 0;
                const isStrong = Math.abs(corr.pearson) > 0.35;
                return (
                  <tr key={idx} className="hover:bg-slate-800/30 transition-colors">
                    <td className="py-2.5 px-3 text-slate-200 font-sans font-medium">{corr.featureA}</td>
                    <td className="py-2.5 px-3 text-slate-400">{corr.featureB}</td>
                    <td
                      className={`py-2.5 px-3 text-right tabular-nums font-semibold ${
                        isPositive ? 'text-red-400' : 'text-cyan-400'
                      }`}
                    >
                      {corr.pearson > 0 ? `+${corr.pearson.toFixed(3)}` : corr.pearson.toFixed(3)}
                    </td>
                    <td className="py-2.5 px-3 text-right tabular-nums text-slate-300">
                      {corr.spearman > 0 ? `+${corr.spearman.toFixed(3)}` : corr.spearman.toFixed(3)}
                    </td>
                    <td className="py-2.5 px-3 text-center text-emerald-400">{corr.significance}</td>
                    <td className="py-2.5 px-3 font-sans text-slate-400">
                      {isStrong ? (
                        <span className="text-white font-medium">Strong predictor</span>
                      ) : (
                        <span>Moderate covariate</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Interactive Sample Customer Explorer */}
      <div className="border border-slate-800 bg-slate-900/40 rounded-xl p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
          <div>
            <h3 className="text-base font-semibold text-white">Benchmark Sample Explorer</h3>
            <p className="text-xs text-slate-400">
              Interactive inspection of customer feature vectors and predicted churn propensities
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-2.5" />
              <input
                type="text"
                placeholder="Search ID, contract, internet..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8 pr-3 py-1.5 text-xs bg-slate-950 border border-slate-800 rounded-lg text-slate-200 focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div className="flex items-center gap-1 p-1 bg-slate-950 border border-slate-800 rounded-lg text-xs">
              <button
                onClick={() => setChurnFilter('all')}
                className={`px-2.5 py-1 rounded ${
                  churnFilter === 'all' ? 'bg-slate-800 text-white font-medium' : 'text-slate-400'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setChurnFilter('churn')}
                className={`px-2.5 py-1 rounded ${
                  churnFilter === 'churn' ? 'bg-red-500/20 text-red-300 font-medium' : 'text-slate-400'
                }`}
              >
                Churners
              </button>
              <button
                onClick={() => setChurnFilter('retained')}
                className={`px-2.5 py-1 rounded ${
                  churnFilter === 'retained' ? 'bg-cyan-500/20 text-cyan-300 font-medium' : 'text-slate-400'
                }`}
              >
                Retained
              </button>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 font-mono">
                <th className="py-2 px-3 cursor-pointer" onClick={() => handleSort('id')}>Customer ID</th>
                <th className="py-2 px-3 cursor-pointer" onClick={() => handleSort('tenure')}>Tenure</th>
                <th className="py-2 px-3">Contract</th>
                <th className="py-2 px-3">Internet</th>
                <th className="py-2 px-3">Tech Support</th>
                <th className="py-2 px-3 cursor-pointer text-right" onClick={() => handleSort('monthlyCharges')}>Monthly</th>
                <th className="py-2 px-3 text-center cursor-pointer" onClick={() => handleSort('supportTickets')}>Tickets</th>
                <th className="py-2 px-3 text-right cursor-pointer" onClick={() => handleSort('churnRiskScore')}>Model Churn Risk</th>
                <th className="py-2 px-3 text-center">Outcome</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono">
              {filteredCustomers.map((c) => (
                <tr key={c.id} className="hover:bg-slate-800/30 transition-colors">
                  <td className="py-2.5 px-3 font-semibold text-white">{c.id}</td>
                  <td className="py-2.5 px-3 tabular-nums">{c.tenure} mo</td>
                  <td className="py-2.5 px-3 font-sans text-slate-300">{c.contract}</td>
                  <td className="py-2.5 px-3 font-sans text-slate-300">{c.internetService}</td>
                  <td className="py-2.5 px-3 font-sans text-slate-300">
                    {c.techSupport === 'Yes' ? (
                      <span className="text-emerald-400">Yes</span>
                    ) : (
                      <span className="text-slate-500">No</span>
                    )}
                  </td>
                  <td className="py-2.5 px-3 text-right tabular-nums">${c.monthlyCharges.toFixed(2)}</td>
                  <td className="py-2.5 px-3 text-center tabular-nums">
                    {c.supportTickets >= 3 ? (
                      <span className="text-red-400 font-semibold">{c.supportTickets}</span>
                    ) : (
                      <span className="text-slate-300">{c.supportTickets}</span>
                    )}
                  </td>
                  <td className="py-2.5 px-3 text-right tabular-nums">
                    <span
                      className={`font-semibold ${
                        c.churnRiskScore >= 0.65
                          ? 'text-red-400'
                          : c.churnRiskScore >= 0.38
                          ? 'text-amber-400'
                          : 'text-emerald-400'
                      }`}
                    >
                      {(c.churnRiskScore * 100).toFixed(0)}%
                    </span>
                  </td>
                  <td className="py-2.5 px-3 text-center font-sans">
                    {c.churn === 1 ? (
                      <span className="text-red-400 font-medium">Churned</span>
                    ) : (
                      <span className="text-cyan-400 font-medium">Retained</span>
                    )}
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
