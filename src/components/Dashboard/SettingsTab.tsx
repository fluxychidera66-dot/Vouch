import React, { useState } from 'react';
import { WorkspaceState, TeamMember } from '../../types';
import { SelectDropdown } from '../ui/SelectDropdown';
import {
  ShieldAlert,
  UserPlus,
  Trash2,
  Download,
  Check,
  AlertTriangle,
  X,
  CreditCard
} from 'lucide-react';

interface SettingsTabProps {
  workspace: WorkspaceState;
  teamMembers: TeamMember[];
  onUpdateWorkspace: (updates: Partial<WorkspaceState>) => void;
  onAddTeamMember: (member: TeamMember) => void;
  onRemoveTeamMember: (id: string) => void;
  onDeleteWorkspace: () => void;
}

export const SettingsTab: React.FC<SettingsTabProps> = ({
  workspace,
  teamMembers,
  onUpdateWorkspace,
  onAddTeamMember,
  onRemoveTeamMember,
  onDeleteWorkspace
}) => {
  // Workspace Form
  const [name, setName] = useState(workspace.name);
  const [email, setEmail] = useState(workspace.contactEmail);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Upgrade Modal
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [showInvoicesModal, setShowInvoicesModal] = useState(false);

  // Team Invite Dialog
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState<'Admin' | 'Viewer'>('Admin');

  // Notifications state
  const [notifReward, setNotifReward] = useState(true);
  const [notifClawback, setNotifClawback] = useState(true);
  const [notifDigest, setNotifDigest] = useState(true);
  const [notifLimit, setNotifLimit] = useState(true);

  // Danger zone state
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteConfirmationInput, setDeleteConfirmationInput] = useState('');

  const handleSaveWorkspace = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateWorkspace({ name, contactEmail: email });
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2500);
  };

  const handleInviteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inviteEmail) {
      onAddTeamMember({
        id: `tm-${Date.now()}`,
        email: inviteEmail,
        role: inviteRole,
        joinedAt: 'Just now'
      });
      setInviteEmail('');
      setShowInviteModal(false);
    }
  };

  const usagePercent = Math.min(Math.round((workspace.usageRevenue / workspace.maxRevenue) * 100), 100);

  return (
    <div className="space-y-10 max-w-4xl">
      <div>
        <h2 className="text-[24px] font-bold text-[#070709] tracking-tight">
          Settings
        </h2>
        <p className="text-[13px] text-[#60606c]">
          Manage your workspace preferences, team access, billing plan, and notifications.
        </p>
      </div>

      {/* 1. WORKSPACE SETTINGS */}
      <section className="bg-white rounded-[18px] p-6 border border-[#bebecc]/40 shadow-sm space-y-4">
        <h3 className="text-[16px] font-bold text-[#070709] tracking-tight">
          Workspace
        </h3>

        <form onSubmit={handleSaveWorkspace} className="space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-[#070709] mb-1">Workspace name</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-lg border border-[#bebecc] text-sm"
              />
            </div>

            <div>
              <label className="block font-semibold text-[#070709] mb-1">Contact email</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-lg border border-[#bebecc] text-sm"
              />
            </div>
          </div>

          <div className="flex items-center gap-3 pt-2">
            <button
              type="submit"
              className="px-6 py-2 text-xs font-medium text-white bg-[#070709] rounded-full shadow-pill hover:bg-[#151515]"
            >
              Save workspace
            </button>
            {saveSuccess && (
              <span className="text-xs text-emerald-700 font-medium flex items-center gap-1">
                <Check className="w-3.5 h-3.5" /> Saved successfully.
              </span>
            )}
          </div>
        </form>
      </section>

      {/* 2. PLAN & BILLING */}
      <section className="bg-white rounded-[18px] p-6 border border-[#bebecc]/40 shadow-sm space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-[16px] font-bold text-[#070709] tracking-tight">
              Plan & Billing
            </h3>
            <p className="text-xs text-[#60606c]">
              Billed monthly based on referral-attributed revenue.
            </p>
          </div>

          <span className="px-3.5 py-1 rounded-full bg-[#070709] text-white text-xs font-semibold self-start sm:self-auto">
            {workspace.plan} — $59/mo
          </span>
        </div>

        {/* Usage Bar */}
        <div>
          <div className="flex items-center justify-between text-xs mb-1.5 font-medium">
            <span className="text-[#070709]">
              ${workspace.usageRevenue.toLocaleString()} of ${workspace.maxRevenue.toLocaleString()} referral revenue
            </span>
            <span className="text-[#60606c] tabular-nums">{usagePercent}% used</span>
          </div>
          <div className="w-full h-2 rounded-full bg-[#f5f5f5] overflow-hidden">
            <div
              style={{ width: `${usagePercent}%` }}
              className="h-full bg-[#2597d0] rounded-full transition-all"
            />
          </div>
          <p className="text-[11px] text-[#8b8b8b] mt-1.5">
            If you exceed $15,000/mo, you will be seamlessly moved to Pro at your next billing cycle with zero disruption.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="pt-2 flex flex-wrap items-center gap-3">
          <button
            onClick={() => setShowUpgradeModal(true)}
            className="px-5 py-2 text-xs font-medium text-white bg-[#070709] rounded-full shadow-pill hover:bg-[#151515]"
          >
            Upgrade plan
          </button>
          <button
            onClick={() => setShowInvoicesModal(true)}
            className="px-4 py-2 text-xs font-medium text-[#070709] bg-white border border-[#bebecc] rounded-full hover:border-[#070709]"
          >
            View invoices
          </button>
          <button
            onClick={() => alert('To cancel your plan, contact support@vouch.link. You will retain access until the end of your billing cycle.')}
            className="px-4 py-2 text-xs font-medium text-red-600 hover:text-red-700"
          >
            Cancel plan
          </button>
        </div>
      </section>

      {/* 3. TEAM */}
      <section className="bg-white rounded-[18px] p-6 border border-[#bebecc]/40 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-[16px] font-bold text-[#070709] tracking-tight">
              Team Members
            </h3>
            <p className="text-xs text-[#60606c]">
              Teammates with access to your Vouch workspace.
            </p>
          </div>

          <button
            onClick={() => setShowInviteModal(true)}
            className="px-4 py-2 text-xs font-medium text-[#070709] bg-white border border-[#bebecc] rounded-full hover:border-[#070709] flex items-center gap-1.5"
          >
            <UserPlus className="w-3.5 h-3.5" /> Invite teammate
          </button>
        </div>

        <div className="divide-y divide-slate-100 border border-slate-100 rounded-xl overflow-hidden text-xs">
          {teamMembers.map((member) => (
            <div key={member.id} className="p-3.5 flex items-center justify-between bg-white hover:bg-[#f5f5f5]/40 transition-colors">
              <div>
                <span className="font-semibold text-[#070709] text-[13px]">{member.email}</span>
                <span className="text-[#8b8b8b] ml-2 font-mono text-[11px]">Joined {member.joinedAt}</span>
              </div>
              <div className="flex items-center gap-4">
                <span className="px-2.5 py-0.5 rounded-full bg-[#f5f5f5] text-[#070709] font-medium">
                  {member.role}
                </span>
                {member.role !== 'Owner' && (
                  <button
                    onClick={() => onRemoveTeamMember(member.id)}
                    className="text-red-600 hover:text-red-800"
                    title="Remove member"
                  >
                    Remove
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. NOTIFICATIONS */}
      <section className="bg-white rounded-[18px] p-6 border border-[#bebecc]/40 shadow-sm space-y-4">
        <h3 className="text-[16px] font-bold text-[#070709] tracking-tight">
          Notifications
        </h3>

        <div className="space-y-3 text-xs text-[#60606c]">
          <label className="flex items-center gap-2.5 cursor-pointer">
            <input
              type="checkbox"
              checked={notifReward}
              onChange={(e) => setNotifReward(e.target.checked)}
              className="rounded border-[#bebecc] text-[#070709] focus:ring-0"
            />
            <span className="text-[#070709]">Email me when a reward is issued</span>
          </label>

          <label className="flex items-center gap-2.5 cursor-pointer">
            <input
              type="checkbox"
              checked={notifClawback}
              onChange={(e) => setNotifClawback(e.target.checked)}
              className="rounded border-[#bebecc] text-[#070709] focus:ring-0"
            />
            <span className="text-[#070709]">Email me on clawbacks</span>
          </label>

          <label className="flex items-center gap-2.5 cursor-pointer">
            <input
              type="checkbox"
              checked={notifDigest}
              onChange={(e) => setNotifDigest(e.target.checked)}
              className="rounded border-[#bebecc] text-[#070709] focus:ring-0"
            />
            <span className="text-[#070709]">Weekly referral digest</span>
          </label>

          <label className="flex items-center gap-2.5 cursor-pointer">
            <input
              type="checkbox"
              checked={notifLimit}
              onChange={(e) => setNotifLimit(e.target.checked)}
              className="rounded border-[#bebecc] text-[#070709] focus:ring-0"
            />
            <span className="text-[#070709]">Plan limit warnings</span>
          </label>
        </div>
      </section>

      {/* 5. DANGER ZONE */}
      <section className="bg-white rounded-[18px] p-6 border border-red-200 shadow-sm space-y-4">
        <div className="flex items-center gap-2 text-red-600">
          <AlertTriangle className="w-5 h-5" />
          <h3 className="text-[16px] font-bold tracking-tight">
            Danger zone
          </h3>
        </div>

        <p className="text-xs text-[#60606c] leading-relaxed">
          This permanently deletes all programs, links, and history. Rewards already issued through Stripe are unaffected.
        </p>

        <div>
          <button
            onClick={() => {
              setDeleteConfirmationInput('');
              setShowDeleteModal(true);
            }}
            className="px-5 py-2 text-xs font-semibold text-white bg-red-600 rounded-full hover:bg-red-700 transition-colors"
          >
            Delete workspace
          </button>
        </div>
      </section>

      {/* Invite Teammate Modal */}
      {showInviteModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-[20px] max-w-md w-full p-6 shadow-2xl border border-slate-100">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-[18px] font-bold text-[#070709]">Invite teammate</h3>
              <button onClick={() => setShowInviteModal(false)}>
                <X className="w-4 h-4 text-slate-400" />
              </button>
            </div>

            <form onSubmit={handleInviteSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-[#070709] mb-1">Email address</label>
                <input
                  type="email"
                  required
                  placeholder="name@company.com"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-lg border border-[#bebecc] text-sm"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#070709] mb-1">Role</label>
                <SelectDropdown
                  value={inviteRole}
                  onChange={(val) => setInviteRole(val as any)}
                  options={[
                    { value: 'Admin', label: 'Admin (Can manage programs, keys, rules)' },
                    { value: 'Viewer', label: 'Viewer (Read-only analytics)' }
                  ]}
                  className="w-full"
                  buttonClassName="w-full justify-between rounded-lg py-2.5 px-3 text-xs"
                  menuClassName="w-full"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowInviteModal(false)}
                  className="px-4 py-2 text-xs text-[#60606c]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-medium text-white bg-[#070709] rounded-full shadow-pill"
                >
                  Send invitation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View Invoices Modal */}
      {showInvoicesModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-[20px] max-w-md w-full p-6 shadow-2xl border border-slate-100 space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="text-[18px] font-bold text-[#070709]">Billing Invoices</h3>
              <button onClick={() => setShowInvoicesModal(false)}>
                <X className="w-4 h-4 text-slate-400" />
              </button>
            </div>

            <div className="divide-y divide-slate-100 text-xs">
              {[
                { id: 'INV-2026-10', date: 'Oct 01, 2026', amount: '$59.00', status: 'Paid' },
                { id: 'INV-2026-09', date: 'Sep 01, 2026', amount: '$59.00', status: 'Paid' },
                { id: 'INV-2026-08', date: 'Aug 12, 2026', amount: '$19.00', status: 'Paid' }
              ].map((inv) => (
                <div key={inv.id} className="py-2.5 flex items-center justify-between">
                  <div>
                    <span className="font-mono font-bold text-[#070709]">{inv.id}</span>
                    <span className="text-[#8b8b8b] ml-2">{inv.date}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-semibold text-[#070709]">{inv.amount}</span>
                    <button
                      onClick={() => alert(`Downloading PDF for invoice ${inv.id}`)}
                      className="text-[#2597d0] hover:underline flex items-center gap-1"
                    >
                      <Download className="w-3 h-3" /> PDF
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={() => setShowInvoicesModal(false)}
              className="w-full py-2 text-xs font-medium text-[#070709] bg-[#f5f5f5] rounded-full hover:bg-slate-200"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Upgrade Plan Modal */}
      {showUpgradeModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-[20px] max-w-md w-full p-6 shadow-2xl border border-slate-100 space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="text-[18px] font-bold text-[#070709]">Upgrade Plan</h3>
              <button onClick={() => setShowUpgradeModal(false)}>
                <X className="w-4 h-4 text-slate-400" />
              </button>
            </div>
            <p className="text-xs text-[#60606c]">
              Select the tier that matches your current monthly referral revenue.
            </p>
            <div className="space-y-2 text-xs">
              <div className="p-3 rounded-xl border-2 border-[#070709] bg-[#f5f5f5] flex items-center justify-between">
                <div>
                  <div className="font-bold text-[#070709]">Pro — $149/mo</div>
                  <div className="text-[#60606c]">Up to $50,000/mo referral revenue · Dedicated Slack</div>
                </div>
                <button
                  onClick={() => {
                    onUpdateWorkspace({ plan: 'Pro', maxRevenue: 50000 });
                    setShowUpgradeModal(false);
                  }}
                  className="px-3.5 py-1.5 rounded-full bg-[#070709] text-white font-medium"
                >
                  Upgrade
                </button>
              </div>
            </div>
            <button
              onClick={() => setShowUpgradeModal(false)}
              className="w-full py-2 text-xs font-medium text-[#60606c]"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-[20px] max-w-md w-full p-6 shadow-2xl border border-red-200 space-y-4">
            <h3 className="text-[18px] font-bold text-red-600">Delete Workspace Permanently</h3>
            <p className="text-xs text-[#60606c] leading-relaxed">
              This action cannot be undone. To confirm deletion, type the exact workspace name{' '}
              <strong className="text-[#070709] font-mono">{workspace.name}</strong> below:
            </p>

            <input
              type="text"
              value={deleteConfirmationInput}
              onChange={(e) => setDeleteConfirmationInput(e.target.value)}
              placeholder={workspace.name}
              className="w-full px-3.5 py-2.5 rounded-lg border border-red-300 text-sm font-mono"
            />

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 text-xs font-medium text-[#60606c]"
              >
                Cancel
              </button>
              <button
                disabled={deleteConfirmationInput !== workspace.name}
                onClick={() => {
                  setShowDeleteModal(false);
                  onDeleteWorkspace();
                }}
                className={`px-5 py-2 text-xs font-semibold rounded-full text-white transition-all ${
                  deleteConfirmationInput === workspace.name
                    ? 'bg-red-600 hover:bg-red-700'
                    : 'bg-red-300 cursor-not-allowed'
                }`}
              >
                I understand, delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
