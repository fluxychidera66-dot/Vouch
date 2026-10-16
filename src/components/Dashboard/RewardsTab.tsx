import React, { useState } from 'react';
import { RewardItem } from '../../types';
import {
  Gift,
  Search,
  CheckCircle2,
  Clock,
  ShieldAlert,
  ArrowRight,
  Receipt,
  AlertTriangle,
  X
} from 'lucide-react';

interface RewardsTabProps {
  rewards: RewardItem[];
  onIssueNow: (id: string) => void;
  onOpenDocs: () => void;
}

export const RewardsTab: React.FC<RewardsTabProps> = ({
  rewards,
  onIssueNow,
  onOpenDocs
}) => {
  const [statusFilter, setStatusFilter] = useState<'All' | 'Pending' | 'Issued' | 'Clawed back'>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [confirmIssueItem, setConfirmIssueItem] = useState<RewardItem | null>(null);
  const [viewReceiptItem, setViewReceiptItem] = useState<RewardItem | null>(null);

  const filteredRewards = rewards.filter((item) => {
    const matchesStatus = statusFilter === 'All' || item.status === statusFilter;
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      !q ||
      item.rewardCode.toLowerCase().includes(q) ||
      item.referrer.toLowerCase().includes(q) ||
      item.triggerEvent.toLowerCase().includes(q);
    return matchesStatus && matchesSearch;
  });

  const pendingTotal = rewards
    .filter((r) => r.status === 'Pending')
    .reduce((acc, r) => acc + r.amount, 0);

  const issuedTotal = rewards
    .filter((r) => r.status === 'Issued')
    .reduce((acc, r) => acc + r.amount, 0);

  const clawedTotal = rewards
    .filter((r) => r.status === 'Clawed back')
    .reduce((acc, r) => acc + r.amount, 0);

  if (rewards.length === 0) {
    return (
      <div className="bg-white rounded-[18px] p-12 text-center border border-[#bebecc]/40 max-w-xl mx-auto my-12">
        <div className="w-12 h-12 rounded-full bg-[#d7e6f5]/40 text-[#2597d0] flex items-center justify-center mx-auto mb-4">
          <Gift className="w-6 h-6" />
        </div>
        <h3 className="text-[20px] font-bold text-[#070709] mb-1">No rewards yet.</h3>
        <p className="text-[14px] text-[#60606c] mb-6">
          Rewards appear here once referred users convert.
        </p>
        <button
          onClick={onOpenDocs}
          className="px-6 py-2.5 text-[14px] font-medium text-white bg-[#070709] rounded-full shadow-pill hover:bg-[#151515]"
        >
          View docs
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div>
        <h2 className="text-[24px] font-bold text-[#070709] tracking-tight">
          Rewards & Payouts
        </h2>
        <p className="text-[13px] text-[#60606c]">
          Automated customer rewards, pending verification delays, and clawback enforcement.
        </p>
      </div>

      {/* Summary Strip */}
      <div className="bg-[#f5f5f5] rounded-[14px] px-5 py-3 border border-black/[0.04] text-[13px] text-[#070709] font-medium flex flex-wrap items-center gap-4">
        <span>
          Pending: <strong className="text-[#070709] font-bold">${pendingTotal}</strong> across{' '}
          {rewards.filter((r) => r.status === 'Pending').length} rewards
        </span>
        <span className="text-[#bebecc]">·</span>
        <span>
          Issued this month: <strong className="text-[#2597d0] font-bold">${issuedTotal}</strong>
        </span>
        <span className="text-[#bebecc]">·</span>
        <span>
          Clawed back: <strong className="text-amber-700 font-bold">${clawedTotal}</strong>
        </span>
      </div>

      {/* Filter Tabs & Search */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-1 bg-[#f5f5f5] p-1 rounded-full text-xs self-start">
          {(['All', 'Pending', 'Issued', 'Clawed back'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setStatusFilter(tab)}
              className={`px-3.5 py-1.5 rounded-full transition-all ${
                statusFilter === tab
                  ? 'bg-white text-[#070709] font-semibold shadow-sm'
                  : 'text-[#60606c] hover:text-[#070709]'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search rewards..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 rounded-full border border-[#bebecc] text-xs bg-white focus:outline-none focus:border-[#070709]"
          />
        </div>
      </div>

      {/* Rewards Table */}
      <div className="bg-white rounded-[18px] border border-[#bebecc]/40 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-[13px]">
            <thead>
              <tr className="border-b border-slate-100 text-[#8b8b8b] font-medium text-[11px] uppercase tracking-wider bg-[#f5f5f5]/50">
                <th className="py-3 px-4">Reward ID</th>
                <th className="py-3 px-4">Referrer</th>
                <th className="py-3 px-4">Type</th>
                <th className="py-3 px-4 text-right">Amount</th>
                <th className="py-3 px-4">Trigger Event</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Timeline</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredRewards.map((item) => (
                <tr key={item.id} className="hover:bg-[#f5f5f5]/60 transition-colors">
                  <td className="py-3 px-4 font-mono font-bold text-[#070709] text-xs">
                    {item.rewardCode}
                  </td>

                  <td className="py-3 px-4 text-xs font-medium text-[#070709] max-w-[200px] truncate">
                    {item.referrer}
                  </td>

                  <td className="py-3 px-4 text-xs text-[#60606c]">
                    <span className="px-2 py-0.5 rounded-md bg-[#f5f5f5] text-[#070709] font-medium">
                      {item.type}
                    </span>
                  </td>

                  <td className="py-3 px-4 text-right tabular-nums font-bold text-[#070709]">
                    ${item.amount}
                  </td>

                  <td className="py-3 px-4 text-xs text-[#60606c] max-w-[180px] truncate">
                    {item.triggerEvent}
                  </td>

                  <td className="py-3 px-4">
                    <span
                      className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full ${
                        item.status === 'Issued'
                          ? 'bg-emerald-50 text-emerald-700'
                          : item.status === 'Pending'
                          ? 'bg-[#d7e6f5]/60 text-[#2597d0]'
                          : 'bg-amber-50 text-amber-800'
                      }`}
                    >
                      {item.status}
                    </span>
                  </td>

                  <td className="py-3 px-4 text-xs text-[#8b8b8b]">
                    {item.status === 'Clawed back' && item.clawbackReason ? (
                      <span className="text-amber-800 italic" title={item.clawbackReason}>
                        {item.clawbackReason}
                      </span>
                    ) : (
                      item.issueDate
                    )}
                  </td>

                  <td className="py-3 px-4 text-right">
                    {item.status === 'Pending' && (
                      <button
                        onClick={() => setConfirmIssueItem(item)}
                        className="px-3 py-1 rounded-full text-xs font-medium text-white bg-[#070709] hover:bg-[#151515] shadow-sm transition-all"
                      >
                        Issue now
                      </button>
                    )}

                    {item.status === 'Issued' && (
                      <button
                        onClick={() => setViewReceiptItem(item)}
                        className="text-xs font-medium text-[#2597d0] hover:underline flex items-center justify-end gap-1 ml-auto"
                      >
                        <Receipt className="w-3.5 h-3.5" /> Receipt
                      </button>
                    )}

                    {item.status === 'Clawed back' && (
                      <span className="text-xs text-[#8b8b8b]">Protected</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* "Issue Now" Confirm Dialog */}
      {confirmIssueItem && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-[20px] max-w-md w-full p-6 shadow-2xl border border-slate-100">
            <h3 className="text-[18px] font-bold text-[#070709] mb-2">
              Confirm Immediate Payout
            </h3>
            <p className="text-sm text-[#60606c] leading-relaxed mb-6">
              Issue <strong className="text-[#070709]">${confirmIssueItem.amount} credit</strong> to{' '}
              <span className="font-mono text-xs">{confirmIssueItem.referrer.split(' ')[0]}</span> now? This skips the remaining delay window.
            </p>
            <div className="flex items-center justify-end gap-2">
              <button
                onClick={() => setConfirmIssueItem(null)}
                className="px-4 py-2 text-xs font-medium text-[#60606c]"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  onIssueNow(confirmIssueItem.id);
                  setConfirmIssueItem(null);
                }}
                className="px-5 py-2 text-xs font-medium text-white bg-[#070709] rounded-full shadow-pill"
              >
                Confirm and issue
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Receipt Modal */}
      {viewReceiptItem && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-[20px] max-w-sm w-full p-6 shadow-2xl border border-slate-100 space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <div className="font-mono text-xs text-[#2597d0] font-bold">VOUCH RECEIPT</div>
              <button onClick={() => setViewReceiptItem(null)}>
                <X className="w-4 h-4 text-slate-400" />
              </button>
            </div>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-[#8b8b8b]">Reference:</span>
                <span className="font-mono font-bold text-[#070709]">{viewReceiptItem.rewardCode}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#8b8b8b]">Recipient:</span>
                <span className="text-[#070709] font-medium truncate max-w-[160px]">{viewReceiptItem.referrer}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#8b8b8b]">Amount:</span>
                <span className="text-[16px] font-bold text-emerald-600">${viewReceiptItem.amount}.00</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#8b8b8b]">Settlement:</span>
                <span className="text-[#070709]">Stripe Customer Balance</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#8b8b8b]">Date:</span>
                <span className="text-[#070709]">{viewReceiptItem.issueDate}</span>
              </div>
            </div>
            <button
              onClick={() => setViewReceiptItem(null)}
              className="w-full mt-2 py-2 text-xs font-medium text-[#070709] bg-[#f5f5f5] rounded-full hover:bg-slate-200"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
