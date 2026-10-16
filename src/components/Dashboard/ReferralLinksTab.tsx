import React, { useState } from 'react';
import { Program, ReferralLink, JourneyEvent } from '../../types';
import { SelectDropdown } from '../ui/SelectDropdown';
import {
  Plus,
  Search,
  Copy,
  Check,
  ExternalLink,
  History,
  MoreVertical,
  X,
  Link2,
  CheckCircle2,
  ArrowRight,
  ShieldCheck
} from 'lucide-react';

interface ReferralLinksTabProps {
  programs: Program[];
  links: ReferralLink[];
  onAddLink: (link: ReferralLink) => void;
  onToggleLinkStatus: (id: string) => void;
  activeJourneyLink: ReferralLink | null;
  onSelectJourneyLink: (link: ReferralLink | null) => void;
}

export const ReferralLinksTab: React.FC<ReferralLinksTabProps> = ({
  programs,
  links,
  onAddLink,
  onToggleLinkStatus,
  activeJourneyLink,
  onSelectJourneyLink
}) => {
  const [selectedProgramId, setSelectedProgramId] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Generate Link Dialog state
  const [showGenModal, setShowGenModal] = useState(false);
  const [genProgramId, setGenProgramId] = useState(programs[0]?.id || 'prog-1');
  const [genUser, setGenUser] = useState('');
  const [genCampaign, setGenCampaign] = useState('');
  const [generatedResult, setGeneratedResult] = useState<ReferralLink | null>(null);

  const filteredLinks = links.filter((link) => {
    const matchesProgram = selectedProgramId === 'all' || link.programId === selectedProgramId;
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      !q ||
      link.code.toLowerCase().includes(q) ||
      link.userId.toLowerCase().includes(q) ||
      link.email.toLowerCase().includes(q) ||
      (link.campaign && link.campaign.toLowerCase().includes(q));
    return matchesProgram && matchesSearch;
  });

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleGenerate = (e: React.FormEvent) => {
    e.preventDefault();
    const code = `RF-${Math.random().toString(36).substring(2, 6).toUpperCase()}${Math.floor(10 + Math.random() * 89)}`;
    const prog = programs.find((p) => p.id === genProgramId);
    const baseUrl = prog?.redirectUrl || 'https://tinyanalytics.io';

    const newLink: ReferralLink = {
      id: `link-${Date.now()}`,
      code,
      url: `${baseUrl}?ref=${code}${genCampaign ? `&campaign=${genCampaign}` : ''}`,
      userId: genUser.includes('@') ? `user_${Math.floor(1000 + Math.random() * 9000)}` : genUser,
      email: genUser.includes('@') ? genUser : `${genUser}@customer.io`,
      programId: genProgramId,
      clicks: 0,
      signups: 0,
      paid: 0,
      createdAt: new Date().toISOString().split('T')[0],
      status: 'Active',
      campaign: genCampaign || undefined,
      journey: [
        {
          id: `j-${Date.now()}`,
          type: 'click',
          timestamp: 'Just now',
          label: 'Link created and ready for distribution'
        }
      ]
    };

    onAddLink(newLink);
    setGeneratedResult(newLink);
  };

  if (links.length === 0) {
    return (
      <div className="bg-white rounded-[18px] p-12 text-center border border-[#bebecc]/40 max-w-xl mx-auto my-12">
        <div className="w-12 h-12 rounded-full bg-[#d7e6f5]/40 text-[#2597d0] flex items-center justify-center mx-auto mb-4">
          <Link2 className="w-6 h-6" />
        </div>
        <h3 className="text-[20px] font-bold text-[#070709] mb-1">No links yet.</h3>
        <p className="text-[14px] text-[#60606c] mb-6">
          Generate a link for any user to start tracking.
        </p>
        <button
          onClick={() => {
            setGeneratedResult(null);
            setShowGenModal(true);
          }}
          className="px-6 py-2.5 text-[14px] font-medium text-white bg-[#070709] rounded-full shadow-pill hover:bg-[#151515]"
        >
          Generate link
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Top Header & Search / Filters */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-[24px] font-bold text-[#070709] tracking-tight">
            Referral Links
          </h2>
          <p className="text-[13px] text-[#60606c]">
            Track unique customer links, campaign tags, and full click-to-paid journeys.
          </p>
        </div>

        <button
          onClick={() => {
            setGeneratedResult(null);
            setShowGenModal(true);
          }}
          className="px-5 py-2.5 text-[13px] font-medium text-white bg-[#070709] rounded-full shadow-pill hover:bg-[#151515] flex items-center gap-1.5 transition-all self-start sm:self-auto shrink-0"
        >
          <Plus className="w-4 h-4" /> Generate link
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Search by user ID, email, or code..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-full border border-[#bebecc] text-[13px] text-[#070709] bg-white focus:outline-none focus:border-[#070709]"
          />
        </div>

        <div className="shrink-0">
          <SelectDropdown
            value={selectedProgramId}
            onChange={setSelectedProgramId}
            options={[
              { value: 'all', label: `All programs (${links.length} links)` },
              ...programs.map((p) => ({
                value: p.id,
                label: p.name
              }))
            ]}
          />
        </div>
      </div>

      {/* Links Table */}
      <div className="bg-white rounded-[18px] border border-[#bebecc]/40 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-[13px]">
            <thead>
              <tr className="border-b border-slate-100 text-[#8b8b8b] font-medium text-[11px] uppercase tracking-wider bg-[#f5f5f5]/50 whitespace-nowrap">
                <th className="py-3.5 px-4 whitespace-nowrap min-w-[170px]">Code</th>
                <th className="py-3.5 px-4 whitespace-nowrap min-w-[200px]">User</th>
                <th className="py-3.5 px-4 whitespace-nowrap min-w-[150px]">Program</th>
                <th className="py-3.5 px-4 text-right whitespace-nowrap">Clicks</th>
                <th className="py-3.5 px-4 text-right whitespace-nowrap">Signups</th>
                <th className="py-3.5 px-4 text-right whitespace-nowrap">Paid</th>
                <th className="py-3.5 px-4 whitespace-nowrap">Created</th>
                <th className="py-3.5 px-4 text-right whitespace-nowrap min-w-[190px]">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredLinks.map((link) => {
                const prog = programs.find((p) => p.id === link.programId);
                const isCopied = copiedId === link.id;

                return (
                  <tr key={link.id} className="hover:bg-[#f5f5f5]/60 transition-colors">
                    <td className="py-3 px-4 whitespace-nowrap">
                      <div className="inline-flex items-center gap-2 whitespace-nowrap">
                        <span className="font-mono font-bold text-[#070709] tracking-tight text-[13px]">
                          {link.code}
                        </span>
                        {link.campaign && (
                          <span className="text-[10px] font-sans font-medium px-2 py-0.5 rounded-full bg-[#f5f5f5] text-[#60606c] border border-black/[0.04] whitespace-nowrap shrink-0">
                            {link.campaign}
                          </span>
                        )}
                      </div>
                    </td>

                    <td className="py-3 px-4 whitespace-nowrap">
                      <div className="font-medium text-[#070709] leading-tight">{link.email}</div>
                      <div className="text-[11px] text-[#8b8b8b] font-mono mt-0.5">{link.userId}</div>
                    </td>

                    <td className="py-3 px-4 text-[#60606c] text-xs whitespace-nowrap">
                      {prog?.name || 'Standard'}
                    </td>

                    <td className="py-3 px-4 text-right tabular-nums text-[#60606c] whitespace-nowrap">{link.clicks}</td>
                    <td className="py-3 px-4 text-right tabular-nums text-[#60606c] whitespace-nowrap">{link.signups}</td>
                    <td className="py-3 px-4 text-right tabular-nums font-semibold text-[#070709] whitespace-nowrap">{link.paid}</td>

                    <td className="py-3 px-4 text-xs text-[#8b8b8b] whitespace-nowrap">{link.createdAt}</td>

                    <td className="py-3 px-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-2 whitespace-nowrap">
                        <button
                          onClick={() => handleCopy(link.url, link.id)}
                          className="px-2.5 py-1 rounded-full border border-[#bebecc] text-xs font-medium text-[#070709] hover:border-[#070709] flex items-center gap-1 transition-all whitespace-nowrap"
                        >
                          {isCopied ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3 text-[#2597d0]" />}
                          {isCopied ? 'Copied' : 'Copy'}
                        </button>

                        <button
                          onClick={() => onSelectJourneyLink(link)}
                          className="px-2.5 py-1 rounded-full bg-[#f5f5f5] text-xs font-medium text-[#60606c] hover:text-[#070709] flex items-center gap-1 transition-all whitespace-nowrap"
                        >
                          <History className="w-3 h-3 text-[#2597d0]" /> View journey
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Generate Link Dialog */}
      {showGenModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-[20px] max-w-md w-full p-6 shadow-2xl border border-slate-100">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-[18px] font-bold text-[#070709]">
                {generatedResult ? 'Referral link ready' : 'Generate referral link'}
              </h3>
              <button
                onClick={() => {
                  setShowGenModal(false);
                  setGeneratedResult(null);
                }}
                className="text-slate-400 hover:text-slate-700"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {generatedResult ? (
              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-900">
                  Unique trackable referral link generated successfully!
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#070709] mb-1">Full URL</label>
                  <div className="p-3 rounded-lg bg-[#f5f5f5] font-mono text-xs text-[#070709] break-all border border-slate-200">
                    {generatedResult.url}
                  </div>
                </div>

                <div className="flex items-center justify-end gap-2 pt-2">
                  <button
                    onClick={() => handleCopy(generatedResult.url, 'gen-modal')}
                    className="px-4 py-2 text-xs font-medium border border-[#bebecc] rounded-full hover:border-[#070709] flex items-center gap-1"
                  >
                    {copiedId === 'gen-modal' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    {copiedId === 'gen-modal' ? 'Copied' : 'Copy URL'}
                  </button>
                  <button
                    onClick={() => {
                      setShowGenModal(false);
                      setGeneratedResult(null);
                    }}
                    className="px-5 py-2 text-xs font-medium text-white bg-[#070709] rounded-full"
                  >
                    Done
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleGenerate} className="space-y-4 text-xs">
                <div>
                  <label className="block font-semibold text-[#070709] mb-1">Program</label>
                  <SelectDropdown
                    value={genProgramId}
                    onChange={setGenProgramId}
                    options={programs.map((p) => ({ value: p.id, label: p.name }))}
                    className="w-full"
                    buttonClassName="w-full justify-between rounded-lg py-2.5 px-3 text-xs"
                    menuClassName="w-full"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-[#070709] mb-1">User ID or email</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. user_9942 or founder@acme.dev"
                    value={genUser}
                    onChange={(e) => setGenUser(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-lg border border-[#bebecc] text-sm"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-[#070709] mb-1">Campaign label (optional)</label>
                  <input
                    type="text"
                    placeholder="e.g. launch-week or twitter-bio"
                    value={genCampaign}
                    onChange={(e) => setGenCampaign(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-lg border border-[#bebecc] text-sm"
                  />
                </div>

                <div className="pt-2 flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowGenModal(false)}
                    className="px-4 py-2 text-xs font-medium text-[#60606c]"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 text-xs font-medium text-white bg-[#070709] rounded-full shadow-pill"
                  >
                    Generate
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* "View Journey" Drawer / Modal */}
      {activeJourneyLink && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-[24px] max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-black/[0.04] space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <span className="text-xs font-mono text-[#2597d0] font-bold">
                  JOURNEY TIMELINE
                </span>
                <h3 className="text-[18px] font-bold text-[#070709]">
                  {activeJourneyLink.code}
                </h3>
              </div>
              <button
                onClick={() => onSelectJourneyLink(null)}
                className="text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#8b8b8b] uppercase tracking-wider mb-1">
                Full URL
              </label>
              <div className="flex items-center justify-between gap-2 p-3 rounded-xl bg-[#f5f5f5] text-xs font-mono">
                <span className="truncate">{activeJourneyLink.url}</span>
                <button
                  onClick={() => handleCopy(activeJourneyLink.url, 'journey-url')}
                  className="p-1 rounded text-[#2597d0] hover:bg-white"
                >
                  {copiedId === 'journey-url' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>

            {/* Event timeline */}
            <div>
              <label className="block text-xs font-semibold text-[#8b8b8b] uppercase tracking-wider mb-3">
                Attribution Events
              </label>
              <div className="space-y-4 border-l-2 border-[#d7e6f5] pl-4 ml-2">
                {activeJourneyLink.journey.map((event, idx) => (
                  <div key={idx} className="relative">
                    <div className="absolute -left-[23px] top-1 w-3 h-3 rounded-full bg-[#2597d0] border-2 border-white" />
                    <div className="text-[11px] text-[#8b8b8b] font-mono">{event.timestamp}</div>
                    <div className="text-xs font-medium text-[#070709]">{event.label}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
              <span className="text-xs text-[#60606c]">
                Status:{' '}
                <strong className={activeJourneyLink.status === 'Active' ? 'text-emerald-700' : 'text-slate-500'}>
                  {activeJourneyLink.status}
                </strong>
              </span>

              <button
                onClick={() => {
                  onToggleLinkStatus(activeJourneyLink.id);
                  onSelectJourneyLink(null);
                }}
                className="px-4 py-1.5 text-xs font-medium border border-red-200 text-red-600 rounded-full hover:bg-red-50 transition-colors"
              >
                {activeJourneyLink.status === 'Active' ? 'Deactivate link' : 'Reactivate link'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
