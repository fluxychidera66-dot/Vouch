import React, { useState } from 'react';
import {
  ScreenMode,
  DashboardTab,
  WorkspaceState,
  Program,
  RewardRule,
  ReferralLink,
  RewardItem,
  ApiKeyItem,
  WebhookEventItem,
  TeamMember,
  NotificationItem
} from './types';
import {
  initialWorkspace,
  initialPrograms,
  initialRules,
  initialLinks,
  initialRewards,
  initialApiKeys,
  initialWebhookEvents,
  initialTeamMembers,
  initialNotifications,
  recentActivity as initialActivity,
  topReferrers
} from './data/mockData';
import { Navbar } from './components/Navbar';
import { LandingHero } from './components/LandingHero';
import { HowItWorks } from './components/HowItWorks';
import { FeaturesGrid } from './components/FeaturesGrid';
import { Pricing } from './components/Pricing';
import { FAQ } from './components/FAQ';
import { FinalCTA } from './components/FinalCTA';
import { Footer } from './components/Footer';
import { DocsModal } from './components/DocsModal';
import { PrivacyPolicy } from './components/PrivacyPolicy';
import { TermsOfService } from './components/TermsOfService';
import { AuthScreens } from './components/Auth/AuthScreens';
import { OnboardingWizard } from './components/Onboarding/OnboardingWizard';
import { DashboardShell } from './components/Dashboard/DashboardShell';

export default function App() {
  const [screen, setScreen] = useState<ScreenMode>('landing');
  const [dashboardTab, setDashboardTab] = useState<DashboardTab>('overview');
  const [docsOpen, setDocsOpen] = useState(false);

  // App-wide persistent state
  const [workspace, setWorkspace] = useState<WorkspaceState>(initialWorkspace);
  const [programs, setPrograms] = useState<Program[]>(initialPrograms);
  const [rules, setRules] = useState<RewardRule[]>(initialRules);
  const [links, setLinks] = useState<ReferralLink[]>(initialLinks);
  const [rewards, setRewards] = useState<RewardItem[]>(initialRewards);
  const [apiKeys, setApiKeys] = useState<ApiKeyItem[]>(initialApiKeys);
  const [webhookEvents, setWebhookEvents] = useState<WebhookEventItem[]>(initialWebhookEvents);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>(initialTeamMembers);
  const [notifications, setNotifications] = useState<NotificationItem[]>(initialNotifications);
  const [recentActivity, setRecentActivity] = useState(initialActivity);

  const updateWorkspace = (updates: Partial<WorkspaceState>) => {
    setWorkspace((prev) => ({ ...prev, ...updates }));
  };

  const handleNavigate = (newScreen: ScreenMode) => {
    setScreen(newScreen);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-white text-[#070709] font-sans selection:bg-[#d7e6f5]">
      {/* 1. MARKETING LANDING PAGE */}
      {screen === 'landing' && (
        <div className="flex flex-col min-h-screen">
          <Navbar
            currentScreen={screen}
            onNavigate={handleNavigate}
            onOpenDocs={() => setDocsOpen(true)}
          />

          <main className="flex-1">
            <LandingHero onNavigate={handleNavigate} />
            <HowItWorks onOpenDocs={() => setDocsOpen(true)} />
            <FeaturesGrid />
            <Pricing onNavigate={handleNavigate} />
            <FAQ />
            <FinalCTA onNavigate={handleNavigate} />
          </main>

          <Footer
            onNavigate={handleNavigate}
            onOpenDocs={() => setDocsOpen(true)}
          />
        </div>
      )}

      {/* 2. STANDALONE PRIVACY POLICY */}
      {screen === 'privacy' && (
        <PrivacyPolicy onNavigate={handleNavigate} />
      )}

      {/* 3. STANDALONE TERMS OF SERVICE */}
      {screen === 'terms' && (
        <TermsOfService onNavigate={handleNavigate} />
      )}

      {/* 4. AUTHENTICATION SCREENS (Sign up, Sign in, Reset password, Verify email) */}
      {(screen === 'signup' || screen === 'signin' || screen === 'reset' || screen === 'verify') && (
        <AuthScreens
          currentScreen={screen}
          onNavigate={handleNavigate}
          workspace={workspace}
          onUpdateWorkspace={updateWorkspace}
        />
      )}

      {/* 5. ONBOARDING 5-STEP WIZARD */}
      {screen === 'onboarding' && (
        <OnboardingWizard
          workspace={workspace}
          onUpdateWorkspace={updateWorkspace}
          onComplete={(targetTab) => {
            if (targetTab) setDashboardTab(targetTab);
            setScreen('dashboard');
          }}
          onNavigate={handleNavigate}
        />
      )}

      {/* 6. FOUNDER DASHBOARD (7 TABS) */}
      {screen === 'dashboard' && (
        <DashboardShell
          currentTab={dashboardTab}
          onSelectTab={setDashboardTab}
          onNavigate={handleNavigate}
          workspace={workspace}
          onUpdateWorkspace={updateWorkspace}
          programs={programs}
          setPrograms={setPrograms}
          rules={rules}
          setRules={setRules}
          links={links}
          setLinks={setLinks}
          rewards={rewards}
          setRewards={setRewards}
          apiKeys={apiKeys}
          setApiKeys={setApiKeys}
          webhookEvents={webhookEvents}
          setWebhookEvents={setWebhookEvents}
          teamMembers={teamMembers}
          setTeamMembers={setTeamMembers}
          notifications={notifications}
          setNotifications={setNotifications}
          recentActivity={recentActivity}
          setRecentActivity={setRecentActivity}
          topReferrers={topReferrers}
          onOpenDocs={() => setDocsOpen(true)}
        />
      )}

      {/* Interactive Docs Dialog */}
      <DocsModal isOpen={docsOpen} onClose={() => setDocsOpen(false)} />
    </div>
  );
}
