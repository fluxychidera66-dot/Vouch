import React, { useState } from 'react';
import {
  DashboardTab,
  ScreenMode,
  WorkspaceState,
  Program,
  RewardRule,
  ReferralLink,
  RewardItem,
  ApiKeyItem,
  WebhookEventItem,
  TeamMember,
  NotificationItem
} from '../../types';
import {
  BarChart3,
  Layers,
  Sparkles,
  Link2,
  Gift,
  Key,
  Settings,
  Bell,
  ChevronDown,
  LogOut,
  CreditCard,
  User,
  AlertCircle,
  ArrowLeft,
  Menu,
  X
} from 'lucide-react';
import { OverviewTab } from './OverviewTab';
import { ProgramsTab } from './ProgramsTab';
import { RewardRulesTab } from './RewardRulesTab';
import { ReferralLinksTab } from './ReferralLinksTab';
import { RewardsTab } from './RewardsTab';
import { ApiWebhooksTab } from './ApiWebhooksTab';
import { SettingsTab } from './SettingsTab';

interface DashboardShellProps {
  currentTab: DashboardTab;
  onSelectTab: (tab: DashboardTab) => void;
  onNavigate: (screen: ScreenMode) => void;
  workspace: WorkspaceState;
  onUpdateWorkspace: (updates: Partial<WorkspaceState>) => void;
  programs: Program[];
  setPrograms: React.Dispatch<React.SetStateAction<Program[]>>;
  rules: RewardRule[];
  setRules: React.Dispatch<React.SetStateAction<RewardRule[]>>;
  links: ReferralLink[];
  setLinks: React.Dispatch<React.SetStateAction<ReferralLink[]>>;
  rewards: RewardItem[];
  setRewards: React.Dispatch<React.SetStateAction<RewardItem[]>>;
  apiKeys: ApiKeyItem[];
  setApiKeys: React.Dispatch<React.SetStateAction<ApiKeyItem[]>>;
  webhookEvents: WebhookEventItem[];
  setWebhookEvents: React.Dispatch<React.SetStateAction<WebhookEventItem[]>>;
  teamMembers: TeamMember[];
  setTeamMembers: React.Dispatch<React.SetStateAction<TeamMember[]>>;
  notifications: NotificationItem[];
  setNotifications: React.Dispatch<React.SetStateAction<NotificationItem[]>>;
  recentActivity: Array<{ id: string; text: string; time: string; type: string }>;
  setRecentActivity: React.Dispatch<React.SetStateAction<Array<{ id: string; text: string; time: string; type: string }>>>;
  topReferrers: Array<{ rank: number; user: string; clicks: number; signups: number; paid: number; revenue: string }>;
  onOpenDocs: () => void;
}

export const DashboardShell: React.FC<DashboardShellProps> = ({
  currentTab,
  onSelectTab,
  onNavigate,
  workspace,
  onUpdateWorkspace,
  programs,
  setPrograms,
  rules,
  setRules,
  links,
  setLinks,
  rewards,
  setRewards,
  apiKeys,
  setApiKeys,
  webhookEvents,
  setWebhookEvents,
  teamMembers,
  setTeamMembers,
  notifications,
  setNotifications,
  recentActivity,
  setRecentActivity,
  topReferrers,
  onOpenDocs
}) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [activeJourneyLink, setActiveJourneyLink] = useState<ReferralLink | null>(null);
  const [testConversionCount, setTestConversionCount] = useState(0);

  const sidebarItems: Array<{ id: DashboardTab; label: string; icon: React.FC<{ className?: string }> }> = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'programs', label: 'Programs', icon: Layers },
    { id: 'rules', label: 'Reward Rules', icon: Sparkles },
    { id: 'links', label: 'Referral Links', icon: Link2 },
    { id: 'rewards', label: 'Rewards', icon: Gift },
    { id: 'api', label: 'API & Webhooks', icon: Key },
    { id: 'settings', label: 'Settings', icon: Settings }
  ];

  const handleToggleTestMode = () => {
    onUpdateWorkspace({ isTestMode: !workspace.isTestMode });
  };

  const handleAddProgram = (newProg: Program) => {
    setPrograms([newProg, ...programs]);
  };

  const handleUpdateProgram = (updated: Program) => {
    setPrograms(programs.map((p) => (p.id === updated.id ? updated : p)));
  };

  const handleArchiveProgram = (id: string) => {
    setPrograms(programs.filter((p) => p.id !== id));
  };

  const handleToggleProgramStatus = (id: string) => {
    setPrograms(
      programs.map((p) =>
        p.id === id ? { ...p, status: p.status === 'Active' ? 'Paused' : 'Active' } : p
      )
    );
  };

  const handleAddRule = (rule: RewardRule) => {
    setRules([rule, ...rules]);
  };

  const handleUpdateRule = (updated: RewardRule) => {
    setRules(rules.map((r) => (r.id === updated.id ? updated : r)));
  };

  const handleDeleteRule = (id: string) => {
    setRules(rules.filter((r) => r.id !== id));
  };

  const handleToggleRuleStatus = (id: string) => {
    setRules(
      rules.map((r) =>
        r.id === id ? { ...r, status: r.status === 'active' ? 'inactive' : 'active' } : r
      )
    );
  };

  const handleAddLink = (link: ReferralLink) => {
    setLinks([link, ...links]);
  };

  const handleToggleLinkStatus = (id: string) => {
    setLinks(
      links.map((l) =>
        l.id === id ? { ...l, status: l.status === 'Active' ? 'Deactivated' : 'Active' } : l
      )
    );
  };

  const handleIssueRewardNow = (id: string) => {
    setRewards(
      rewards.map((r) =>
        r.id === id
          ? {
              ...r,
              status: 'Issued',
              issueDate: `Issued just now (${new Date().toLocaleDateString()})`
            }
          : r
      )
    );
    setRecentActivity([
      {
        id: `act-${Date.now()}`,
        text: `Reward issued immediately for ${id}`,
        time: 'Just now',
        type: 'reward'
      },
      ...recentActivity
    ]);
  };

  const handleAddApiKey = (key: ApiKeyItem) => {
    setApiKeys([key, ...apiKeys]);
  };

  const handleRevokeApiKey = (id: string) => {
    setApiKeys(apiKeys.filter((k) => k.id !== id));
  };

  const handleSendTestEvent = () => {
    setTestConversionCount((prev) => prev + 1);
    const testEvent: WebhookEventItem = {
      id: `ev-${Date.now()}`,
      eventType: 'invoice.paid',
      receivedAt: 'Just now',
      status: 'Processed',
      payloadSummary: `Test conversion customer cus_${Math.floor(1000 + Math.random() * 9000)} paid $49.00`
    };
    setWebhookEvents([testEvent, ...webhookEvents]);
    setRecentActivity([
      {
        id: `act-${Date.now()}`,
        text: 'Test conversion processed: $49/mo invoice cleared',
        time: 'Just now',
        type: 'conversion'
      },
      ...recentActivity
    ]);
  };

  const handleRetryWebhook = (id: string) => {
    setWebhookEvents(
      webhookEvents.map((ev) =>
        ev.id === id ? { ...ev, status: 'Processed' } : ev
      )
    );
  };

  const handleAddTeamMember = (member: TeamMember) => {
    setTeamMembers([...teamMembers, member]);
  };

  const handleRemoveTeamMember = (id: string) => {
    setTeamMembers(teamMembers.filter((m) => m.id !== id));
  };

  const handleDeleteWorkspace = () => {
    alert('Workspace deleted. Redirecting to landing page.');
    onNavigate('landing');
  };

  const unreadNotifCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="min-h-screen bg-[#f5f5f5] flex flex-col selection:bg-[#d7e6f5]">
      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar Navigation ($240px-$280px) */}
        <aside className="hidden lg:flex w-64 bg-white border-r border-[#070709]/5 flex-col justify-between p-5 shrink-0">
          <div>
            {/* Top Brand Logo - Just "Vouch" */}
            <div className="flex items-center justify-between pb-6 mb-6 border-b border-slate-100">
              <button
                onClick={() => onNavigate('landing')}
                className="text-[22px] font-bold tracking-tight text-[#070709]"
              >
                Vouch
              </button>
              <button
                onClick={() => onNavigate('landing')}
                className="p-1 rounded-md text-[#8b8b8b] hover:text-[#070709] transition-colors"
                title="View landing page"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
            </div>

            {/* Sidebar Tab Links */}
            <nav className="space-y-1">
              {sidebarItems.map((item) => {
                const Icon = item.icon;
                const isActive = currentTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => onSelectTab(item.id)}
                    className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-[12px] text-[13px] font-medium transition-all ${
                      isActive
                        ? 'bg-[#070709] text-white shadow-sm'
                        : 'text-[#60606c] hover:bg-[#f5f5f5] hover:text-[#070709]'
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${isActive ? 'text-[#2597d0]' : 'text-[#8b8b8b]'}`} />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Sidebar Bottom: Plan Usage Summary */}
          <div className="p-3.5 rounded-[14px] bg-[#f5f5f5] border border-black/[0.02]">
            <div className="text-[11px] font-semibold uppercase tracking-wider text-[#8b8b8b] mb-1">
              {workspace.plan} Plan
            </div>
            <div className="text-xs font-bold text-[#070709]">
              ${workspace.usageRevenue.toLocaleString()} / ${workspace.maxRevenue.toLocaleString()}
            </div>
            <div className="w-full h-1.5 rounded-full bg-slate-200 mt-2 overflow-hidden">
              <div
                style={{ width: `${Math.min((workspace.usageRevenue / workspace.maxRevenue) * 100, 100)}%` }}
                className="h-full bg-[#2597d0] rounded-full"
              />
            </div>
          </div>
        </aside>

        {/* Mobile Navigation Drawer */}
        {mobileSidebarOpen && (
          <div className="fixed inset-0 z-50 bg-black/40 lg:hidden flex">
            <div className="w-64 bg-white p-6 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-4 mb-4 border-b">
                  <span className="text-[20px] font-bold text-[#070709]">Vouch</span>
                  <button onClick={() => setMobileSidebarOpen(false)}>
                    <X className="w-5 h-5 text-slate-500" />
                  </button>
                </div>
                <nav className="space-y-1">
                  {sidebarItems.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => {
                        onSelectTab(item.id);
                        setMobileSidebarOpen(false);
                      }}
                      className={`w-full text-left px-3 py-2 rounded-lg text-sm ${
                        currentTab === item.id ? 'bg-[#070709] text-white' : 'text-slate-600'
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}
                </nav>
              </div>
              <button
                onClick={() => onNavigate('landing')}
                className="text-xs text-slate-500 hover:text-black py-2"
              >
                Back to Landing Page
              </button>
            </div>
            <div className="flex-1" onClick={() => setMobileSidebarOpen(false)} />
          </div>
        )}

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Top Bar */}
          <header className="bg-white border-b border-[#070709]/5 px-6 py-3.5 flex items-center justify-between gap-4 sticky top-0 z-30">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setMobileSidebarOpen(true)}
                className="lg:hidden p-1.5 rounded-lg border border-slate-200 text-slate-700"
              >
                <Menu className="w-4 h-4" />
              </button>
              <div>
                <span className="text-[15px] font-bold text-[#070709]">
                  {workspace.name}
                </span>
                <span className="hidden sm:inline text-xs text-[#8b8b8b] ml-2">
                  / {sidebarItems.find((s) => s.id === currentTab)?.label}
                </span>
              </div>
            </div>

            {/* Right Top Bar Controls */}
            <div className="flex items-center gap-3">
              {/* Notification Bell with Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="w-9 h-9 rounded-full border border-[#bebecc] flex items-center justify-center text-[#60606c] hover:border-[#070709] transition-all relative"
                >
                  <Bell className="w-4 h-4" />
                  {unreadNotifCount > 0 && (
                    <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#2597d0]" />
                  )}
                </button>

                {showNotifications && (
                  <div className="absolute right-0 mt-2 w-80 bg-white rounded-[18px] shadow-2xl border border-slate-200 p-4 z-50 text-xs">
                    <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-100">
                      <span className="font-bold text-[#070709]">Notifications</span>
                      <button
                        onClick={() => {
                          setNotifications(notifications.map((n) => ({ ...n, read: true })));
                        }}
                        className="text-[11px] text-[#2597d0] hover:underline"
                      >
                        Mark all read
                      </button>
                    </div>

                    <div className="space-y-3 max-h-72 overflow-y-auto">
                      {notifications.map((n) => (
                        <div
                          key={n.id}
                          className={`p-2.5 rounded-xl border transition-colors ${
                            n.read ? 'bg-white border-slate-100' : 'bg-[#d7e6f5]/20 border-[#2597d0]/30'
                          }`}
                        >
                          <div className="font-semibold text-[#070709] flex items-center justify-between">
                            <span>{n.title}</span>
                            <span className="text-[10px] text-[#8b8b8b]">{n.time}</span>
                          </div>
                          <p className="text-[11px] text-[#60606c] mt-0.5 leading-tight">
                            {n.description}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* User Avatar Menu */}
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center gap-2 p-1 pl-2 rounded-full border border-[#bebecc] hover:border-[#070709] transition-all"
                >
                  <span className="text-xs font-semibold text-[#070709] max-w-[100px] truncate">
                    {workspace.contactEmail.split('@')[0]}
                  </span>
                  <div className="w-7 h-7 rounded-full bg-[#070709] text-white flex items-center justify-center text-xs font-bold">
                    {workspace.contactEmail.charAt(0).toUpperCase()}
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 text-[#8b8b8b] mr-1" />
                </button>

                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-[16px] shadow-2xl border border-slate-200 py-1.5 z-50 text-xs">
                    <div className="px-3.5 py-2 border-b border-slate-100">
                      <div className="font-bold text-[#070709] truncate">{workspace.name}</div>
                      <div className="text-[11px] text-[#8b8b8b] truncate">{workspace.contactEmail}</div>
                    </div>
                    <button
                      onClick={() => {
                        onSelectTab('settings');
                        setShowUserMenu(false);
                      }}
                      className="w-full text-left px-3.5 py-2 text-slate-700 hover:bg-[#f5f5f5] flex items-center gap-2"
                    >
                      <User className="w-3.5 h-3.5" /> Profile & Team
                    </button>
                    <button
                      onClick={() => {
                        onSelectTab('settings');
                        setShowUserMenu(false);
                      }}
                      className="w-full text-left px-3.5 py-2 text-slate-700 hover:bg-[#f5f5f5] flex items-center gap-2"
                    >
                      <CreditCard className="w-3.5 h-3.5" /> Billing ({workspace.plan})
                    </button>
                    <div className="border-t border-slate-100 my-1" />
                    <button
                      onClick={() => {
                        setShowUserMenu(false);
                        onNavigate('landing');
                      }}
                      className="w-full text-left px-3.5 py-2 text-red-600 hover:bg-red-50 flex items-center gap-2"
                    >
                      <LogOut className="w-3.5 h-3.5" /> Sign out
                    </button>
                  </div>
                )}
              </div>
            </div>
          </header>

          {/* Main Content Body */}
          <main className="flex-1 p-6 lg:p-8 max-w-[1200px] w-full mx-auto overflow-y-auto">
            {currentTab === 'overview' && (
              <OverviewTab
                workspace={workspace}
                onNavigateTab={onSelectTab}
                onViewLinkJourney={(link) => {
                  setActiveJourneyLink(link);
                  onSelectTab('links');
                }}
                recentActivity={recentActivity}
                topReferrers={topReferrers}
                links={links}
                testConversionCount={testConversionCount}
              />
            )}

            {currentTab === 'programs' && (
              <ProgramsTab
                programs={programs}
                rules={rules}
                links={links}
                onAddProgram={handleAddProgram}
                onUpdateProgram={handleUpdateProgram}
                onArchiveProgram={handleArchiveProgram}
                onToggleStatus={handleToggleProgramStatus}
              />
            )}

            {currentTab === 'rules' && (
              <RewardRulesTab
                programs={programs}
                rules={rules}
                onAddRule={handleAddRule}
                onUpdateRule={handleUpdateRule}
                onDeleteRule={handleDeleteRule}
                onToggleRuleStatus={handleToggleRuleStatus}
              />
            )}

            {currentTab === 'links' && (
              <ReferralLinksTab
                programs={programs}
                links={links}
                onAddLink={handleAddLink}
                onToggleLinkStatus={handleToggleLinkStatus}
                activeJourneyLink={activeJourneyLink}
                onSelectJourneyLink={setActiveJourneyLink}
              />
            )}

            {currentTab === 'rewards' && (
              <RewardsTab
                rewards={rewards}
                onIssueNow={handleIssueRewardNow}
                onOpenDocs={onOpenDocs}
              />
            )}

            {currentTab === 'api' && (
              <ApiWebhooksTab
                workspace={workspace}
                apiKeys={apiKeys}
                webhookEvents={webhookEvents}
                onAddApiKey={handleAddApiKey}
                onRevokeApiKey={handleRevokeApiKey}
                onSendTestEvent={handleSendTestEvent}
                onRetryWebhook={handleRetryWebhook}
                onOpenDocs={onOpenDocs}
              />
            )}

            {currentTab === 'settings' && (
              <SettingsTab
                workspace={workspace}
                teamMembers={teamMembers}
                onUpdateWorkspace={onUpdateWorkspace}
                onAddTeamMember={handleAddTeamMember}
                onRemoveTeamMember={handleRemoveTeamMember}
                onDeleteWorkspace={handleDeleteWorkspace}
              />
            )}
          </main>
        </div>
      </div>
    </div>
  );
};
