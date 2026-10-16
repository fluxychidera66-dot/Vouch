import React, { useState } from 'react';
import {
  ReferralLink,
  DashboardTab,
  WorkspaceState
} from '../../types';
import {
  TrendingUp,
  Users,
  DollarSign,
  Gift,
  MousePointerClick,
  CheckCircle2,
  X,
  ArrowRight,
  ShieldAlert,
  Sparkles
} from 'lucide-react';

interface OverviewTabProps {
  workspace: WorkspaceState;
  onNavigateTab: (tab: DashboardTab) => void;
  onViewLinkJourney: (link: ReferralLink) => void;
  recentActivity: Array<{ id: string; text: string; time: string; type: string }>;
  topReferrers: Array<{ rank: number; user: string; clicks: number; signups: number; paid: number; revenue: string }>;
  links: ReferralLink[];
  testConversionCount: number;
}

export const OverviewTab: React.FC<OverviewTabProps> = ({
  workspace,
  onNavigateTab,
  onViewLinkJourney,
  recentActivity,
  topReferrers,
  links,
  testConversionCount
}) => {
  const [chartRange, setChartRange] = useState<'7d' | '30d' | '90d'>('30d');
  const [selectedSeries, setSelectedSeries] = useState<'all' | 'clicks' | 'signups' | 'paid'>('all');
  const [checklistDismissed, setChecklistDismissed] = useState(false);

  // Dynamic calculated figures based on test conversions
  const baseClicks = 12400 + testConversionCount * 3;
  const baseSignups = 3180 + testConversionCount;
  const basePaid = 412 + testConversionCount;
  const baseRewards = 1240 + testConversionCount * 20;
  const baseRevenue = 86400 + testConversionCount * 49;

  // Sparkline generator helper
  const renderSparkline = (points: number[], color: string) => {
    const min = Math.min(...points);
    const max = Math.max(...points);
    const range = max - min || 1;
    const width = 80;
    const height = 24;
    const path = points
      .map((val, idx) => {
        const x = (idx / (points.length - 1)) * width;
        const y = height - ((val - min) / range) * (height - 4) - 2;
        return `${idx === 0 ? 'M' : 'L'} ${x} ${y}`;
      })
      .join(' ');

    return (
      <svg width={width} height={height} className="overflow-visible">
        <path d={path} fill="none" stroke={color} strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  };

  // Chart data points according to selected range
  const chartPoints = chartRange === '7d'
    ? [
        { label: 'Mon', clicks: 380, signups: 92, paid: 14 },
        { label: 'Tue', clicks: 420, signups: 104, paid: 18 },
        { label: 'Wed', clicks: 510, signups: 122, paid: 21 },
        { label: 'Thu', clicks: 470, signups: 110, paid: 16 },
        { label: 'Fri', clicks: 590, signups: 145, paid: 25 },
        { label: 'Sat', clicks: 340, signups: 80, paid: 11 },
        { label: 'Sun', clicks: 390, signups: 95, paid: 15 }
      ]
    : chartRange === '30d'
    ? [
        { label: 'Week 1', clicks: 2800, signups: 720, paid: 94 },
        { label: 'Week 2', clicks: 3100, signups: 780, paid: 102 },
        { label: 'Week 3', clicks: 3450, signups: 890, paid: 118 },
        { label: 'Week 4', clicks: 3050 + testConversionCount * 10, signups: 790 + testConversionCount, paid: 98 + testConversionCount }
      ]
    : [
        { label: 'Aug', clicks: 9200, signups: 2100, paid: 280 },
        { label: 'Sep', clicks: 11400, signups: 2850, paid: 360 },
        { label: 'Oct', clicks: 12400 + testConversionCount * 20, signups: 3180 + testConversionCount, paid: 412 + testConversionCount }
      ];

  const maxVal = Math.max(...chartPoints.map((p) => p.clicks));

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* 1. GETTING STARTED CHECKLIST (Dismissible) */}
      {!checklistDismissed && (
        <div className="bg-[#f5f5f5] rounded-[18px] p-6 border border-black/[0.04] relative">
          <button
            onClick={() => setChecklistDismissed(true)}
            className="absolute top-4 right-4 text-[#8b8b8b] hover:text-[#070709] transition-colors p-1"
            title="Dismiss checklist"
          >
            <X className="w-4 h-4" />
          </button>
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="w-4 h-4 text-[#2597d0]" />
            <h3 className="text-[15px] font-bold text-[#070709] tracking-tight">
              Getting-started checklist
            </h3>
          </div>
          <p className="text-[13px] text-[#60606c] mb-4">
            Complete these four quick steps to maximize conversion across your user base.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {[
              { label: 'Create a program', done: true, tab: 'programs' as DashboardTab },
              { label: 'Add a reward rule', done: true, tab: 'rules' as DashboardTab },
              { label: 'Generate your first link', done: true, tab: 'links' as DashboardTab },
              { label: 'Record a test click', done: testConversionCount > 0, tab: 'api' as DashboardTab }
            ].map((item, idx) => (
              <button
                key={idx}
                onClick={() => onNavigateTab(item.tab)}
                className="flex items-center justify-between p-3 rounded-[12px] bg-white border border-[#bebecc]/40 hover:border-[#070709] text-left transition-all"
              >
                <div className="flex items-center gap-2 text-[13px] font-medium text-[#070709]">
                  <CheckCircle2
                    className={`w-4 h-4 ${item.done ? 'text-[#2597d0]' : 'text-slate-300'}`}
                  />
                  <span>{item.label}</span>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-[#8b8b8b]" />
              </button>
            ))}
          </div>
        </div>
      )}

      {/* 2. KPI CARDS ROW (5 Cards) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Card 1: Total Clicks */}
        <div className="bg-white rounded-[18px] p-5 border border-[#bebecc]/40 shadow-sm flex flex-col justify-between">
          <div>
            <div className="text-[12px] text-[#60606c] font-medium mb-1">Total clicks</div>
            <div className="text-[26px] font-bold text-[#070709] tracking-tight tabular-nums">
              {baseClicks.toLocaleString()}
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
            <span className="text-[11px] text-emerald-600 font-medium">+12% vs last month</span>
            {renderSparkline([10, 14, 12, 18, 16, 22, 25], '#2597d0')}
          </div>
        </div>

        {/* Card 2: Referred Signups */}
        <div className="bg-white rounded-[18px] p-5 border border-[#bebecc]/40 shadow-sm flex flex-col justify-between">
          <div>
            <div className="text-[12px] text-[#60606c] font-medium mb-1">Referred signups</div>
            <div className="text-[26px] font-bold text-[#070709] tracking-tight tabular-nums">
              {baseSignups.toLocaleString()}
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
            <span className="text-[11px] text-emerald-600 font-medium">+18% vs last month</span>
            {renderSparkline([8, 11, 14, 13, 19, 21, 24], '#2597d0')}
          </div>
        </div>

        {/* Card 3: Paid Conversions */}
        <div className="bg-white rounded-[18px] p-5 border border-[#bebecc]/40 shadow-sm flex flex-col justify-between">
          <div>
            <div className="text-[12px] text-[#60606c] font-medium mb-1">Paid conversions</div>
            <div className="text-[26px] font-bold text-[#070709] tracking-tight tabular-nums">
              {basePaid.toLocaleString()}
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
            <span className="text-[11px] text-emerald-600 font-medium">+9% vs last month</span>
            {renderSparkline([12, 10, 15, 14, 18, 17, 21], '#2597d0')}
          </div>
        </div>

        {/* Card 4: Rewards Issued */}
        <div className="bg-white rounded-[18px] p-5 border border-[#bebecc]/40 shadow-sm flex flex-col justify-between">
          <div>
            <div className="text-[12px] text-[#60606c] font-medium mb-1">Rewards issued</div>
            <div className="text-[26px] font-bold text-[#070709] tracking-tight tabular-nums">
              ${baseRewards.toLocaleString()}
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
            <span className="text-[11px] text-[#60606c] font-medium">Auto-Stripe</span>
            {renderSparkline([6, 9, 11, 15, 14, 18, 20], '#2597d0')}
          </div>
        </div>

        {/* Card 5: Attributed Revenue */}
        <div className="bg-white rounded-[18px] p-5 border border-[#bebecc]/40 shadow-sm flex flex-col justify-between">
          <div>
            <div className="text-[12px] text-[#60606c] font-medium mb-1">Attributed revenue</div>
            <div className="text-[26px] font-bold text-[#070709] tracking-tight tabular-nums">
              ${baseRevenue.toLocaleString()}
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
            <span className="text-[11px] text-emerald-600 font-medium">+24% vs last month</span>
            {renderSparkline([15, 18, 22, 24, 28, 32, 38], '#2597d0')}
          </div>
        </div>
      </div>

      {/* 3. CHART: REFERRALS OVER TIME */}
      <div className="bg-white rounded-[18px] p-6 border border-[#bebecc]/40 shadow-sm">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <div>
            <h3 className="text-[16px] font-bold text-[#070709] tracking-tight">
              Referrals over time
            </h3>
            <p className="text-[12px] text-[#60606c]">
              Interactive breakdown of clicks, signups, and paid customer attributions
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* Series Toggle */}
            <div className="flex items-center gap-1 bg-[#f5f5f5] p-1 rounded-full text-xs">
              {(['all', 'clicks', 'signups', 'paid'] as const).map((s) => (
                <button
                  key={s}
                  onClick={() => setSelectedSeries(s)}
                  className={`px-3 py-1 rounded-full capitalize transition-all ${
                    selectedSeries === s
                      ? 'bg-white text-[#070709] font-semibold shadow-sm'
                      : 'text-[#60606c] hover:text-[#070709]'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>

            {/* Date Range Picker */}
            <div className="flex items-center gap-1 bg-[#f5f5f5] p-1 rounded-full text-xs">
              {(['7d', '30d', '90d'] as const).map((r) => (
                <button
                  key={r}
                  onClick={() => setChartRange(r)}
                  className={`px-2.5 py-1 rounded-full transition-all ${
                    chartRange === r
                      ? 'bg-[#070709] text-white font-medium'
                      : 'text-[#60606c] hover:text-[#070709]'
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Visual Bar / Line Visualization */}
        <div className="h-48 flex items-end gap-3 sm:gap-6 pt-4 border-b border-slate-100">
          {chartPoints.map((p, idx) => {
            const clickH = (p.clicks / maxVal) * 100;
            const signupH = ((p.signups * 3.5) / maxVal) * 100;
            const paidH = ((p.paid * 20) / maxVal) * 100;

            return (
              <div key={idx} className="flex-1 flex flex-col items-center gap-2 group relative">
                {/* Tooltip on hover */}
                <div className="opacity-0 group-hover:opacity-100 transition-opacity absolute bottom-full mb-2 bg-[#070709] text-white text-[11px] rounded-lg py-1 px-2 pointer-events-none whitespace-nowrap z-10 font-mono">
                  Clicks: {p.clicks} · Signups: {p.signups} · Paid: {p.paid}
                </div>

                <div className="w-full flex items-end justify-center gap-1 h-36">
                  {(selectedSeries === 'all' || selectedSeries === 'clicks') && (
                    <div
                      style={{ height: `${Math.max(clickH, 6)}%` }}
                      className="w-3 sm:w-4 rounded-t-sm bg-[#d7e6f5] group-hover:bg-[#9abfda] transition-all"
                    />
                  )}
                  {(selectedSeries === 'all' || selectedSeries === 'signups') && (
                    <div
                      style={{ height: `${Math.max(signupH, 8)}%` }}
                      className="w-3 sm:w-4 rounded-t-sm bg-[#779bc1] group-hover:bg-[#5f87b0] transition-all"
                    />
                  )}
                  {(selectedSeries === 'all' || selectedSeries === 'paid') && (
                    <div
                      style={{ height: `${Math.max(paidH, 10)}%` }}
                      className="w-3 sm:w-4 rounded-t-sm bg-[#2597d0] group-hover:bg-[#1d7fad] transition-all"
                    />
                  )}
                </div>

                <span className="text-[11px] text-[#8b8b8b] font-medium">
                  {p.label}
                </span>
              </div>
            );
          })}
        </div>

        {/* Legend */}
        <div className="flex items-center justify-end gap-5 mt-4 text-xs text-[#60606c]">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-sm bg-[#d7e6f5]" />
            <span>Clicks</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-sm bg-[#779bc1]" />
            <span>Signups</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-sm bg-[#2597d0]" />
            <span>Paid conversions</span>
          </div>
        </div>
      </div>

      {/* 4. TWO-COLUMN SPLIT: TOP REFERRERS & RECENT ACTIVITY */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Top Referrers Table */}
        <div className="lg:col-span-7 bg-white rounded-[18px] p-6 border border-[#bebecc]/40 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-[16px] font-bold text-[#070709] tracking-tight">
                Top referrers
              </h3>
              <button
                onClick={() => onNavigateTab('links')}
                className="text-xs font-medium text-[#2597d0] hover:underline"
              >
                View all
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-[13px]">
                <thead>
                  <tr className="border-b border-slate-100 text-[#8b8b8b] font-medium text-[11px] uppercase tracking-wider">
                    <th className="pb-2.5">Rank</th>
                    <th className="pb-2.5">Referrer</th>
                    <th className="pb-2.5 text-right">Clicks</th>
                    <th className="pb-2.5 text-right">Signups</th>
                    <th className="pb-2.5 text-right">Paid</th>
                    <th className="pb-2.5 text-right">Revenue</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {topReferrers.map((row) => (
                    <tr key={row.rank} className="hover:bg-[#f5f5f5]/60 transition-colors">
                      <td className="py-3 font-mono text-[#8b8b8b]">#{row.rank}</td>
                      <td className="py-3 font-medium text-[#070709] max-w-[180px] truncate">
                        {row.user}
                      </td>
                      <td className="py-3 text-right tabular-nums text-[#60606c]">{row.clicks}</td>
                      <td className="py-3 text-right tabular-nums text-[#60606c]">{row.signups}</td>
                      <td className="py-3 text-right tabular-nums font-semibold text-[#070709]">{row.paid}</td>
                      <td className="py-3 text-right tabular-nums font-semibold text-[#2597d0]">{row.revenue}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Recent Activity Feed */}
        <div className="lg:col-span-5 bg-white rounded-[18px] p-6 border border-[#bebecc]/40 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-[16px] font-bold text-[#070709] tracking-tight">
              Recent activity
            </h3>
            <span className="text-[11px] text-[#8b8b8b] font-medium">Live feed</span>
          </div>

          <div className="space-y-4">
            {recentActivity.map((item) => (
              <div key={item.id} className="flex items-start gap-3 text-[13px]">
                <div
                  className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${
                    item.type === 'reward'
                      ? 'bg-[#2597d0]'
                      : item.type === 'clawback'
                      ? 'bg-amber-500'
                      : 'bg-[#070709]'
                  }`}
                />
                <div className="flex-1">
                  <p className="text-[#070709] font-medium leading-snug">
                    {item.text}
                  </p>
                  <span className="text-[11px] text-[#8b8b8b] mt-0.5 block">
                    {item.time}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
