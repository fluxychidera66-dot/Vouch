import React, { useState } from 'react';
import { WorkspaceState, ScreenMode, DashboardTab } from '../../types';
import { SelectDropdown } from '../ui/SelectDropdown';
import {
  Check,
  Copy,
  RefreshCw,
  AlertTriangle,
  ArrowRight,
  ArrowLeft,
  Terminal,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';

interface OnboardingWizardProps {
  workspace: WorkspaceState;
  onUpdateWorkspace: (updates: Partial<WorkspaceState>) => void;
  onComplete: (targetTab?: DashboardTab) => void;
  onNavigate: (screen: ScreenMode) => void;
  onOpenInviteModal?: () => void;
}

export const OnboardingWizard: React.FC<OnboardingWizardProps> = ({
  workspace,
  onUpdateWorkspace,
  onComplete,
  onNavigate
}) => {
  const [step, setStep] = useState<number>(1);

  // Step 1 State
  const [productName, setProductName] = useState(workspace.name || 'Tiny Analytics');
  const [productWebsite, setProductWebsite] = useState(workspace.website || 'https://tinyanalytics.io');
  const [signupUrl, setSignupUrl] = useState(workspace.signupUrl || 'https://tinyanalytics.io/signup');

  // Step 2 State
  const [paymentMethod, setPaymentMethod] = useState<'stripe' | 'paddle' | 'mobile' | 'none'>('stripe');
  const [whoRewarded, setWhoRewarded] = useState<'both' | 'referrer'>('both');
  const [rewardType, setRewardType] = useState('Account credit');
  const [referrerAmount, setReferrerAmount] = useState('20');
  const [refereeAmount, setRefereeAmount] = useState('20');
  const [nonCashDesc, setNonCashDesc] = useState('1 month free of Pro');
  const [issuanceTrigger, setIssuanceTrigger] = useState('first_invoice');
  const [daysAfter, setDaysAfter] = useState('14');
  const [clawbackWindow, setClawbackWindow] = useState('14 days');

  // Step 3 State
  const [apiKey, setApiKey] = useState(workspace.apiKey || 'vk_live_9a72b84f3e1d42c984920401b');
  const [keyCopied, setKeyCopied] = useState(false);
  const [savedKeyConfirmed, setSavedKeyConfirmed] = useState(false);

  // Step 4 State
  const [activeCodeTab, setActiveCodeTab] = useState<'node' | 'curl' | 'python'>('node');
  const [codeCopied, setCodeCopied] = useState(false);
  const [testCodeInput, setTestCodeInput] = useState('RF-DEMO-TEST');
  const [isVerifying, setIsVerifying] = useState(false);
  const [trackingVerified, setTrackingVerified] = useState(false);

  // Step 5 State
  const [founderLinkCopied, setFounderLinkCopied] = useState(false);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteSent, setInviteSent] = useState(false);

  // Helpers
  const handleRegenerateKey = () => {
    const randomHex = Math.random().toString(36).substring(2, 12);
    const newKey = `vk_live_${randomHex}${Date.now().toString().slice(-6)}`;
    setApiKey(newKey);
    onUpdateWorkspace({ apiKey: newKey });
    setKeyCopied(false);
  };

  const copyToClipboard = (text: string, setter: (val: boolean) => void) => {
    navigator.clipboard.writeText(text);
    setter(true);
    setTimeout(() => setter(false), 2000);
  };

  const handleVerifyTracking = () => {
    setIsVerifying(true);
    setTimeout(() => {
      setIsVerifying(false);
      setTrackingVerified(true);
    }, 800);
  };

  const handleStep1Submit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateWorkspace({
      name: productName,
      website: productWebsite,
      signupUrl
    });
    setStep(2);
  };

  const founderReferralUrl = `https://${productWebsite.replace(/^https?:\/\//, '')}?ref=founder-${productName.toLowerCase().replace(/\s+/g, '-')}`;

  return (
    <div className="min-h-screen bg-[#f5f5f5] flex flex-col justify-between selection:bg-[#d7e6f5]">
      {/* Top Bar */}
      <header className="bg-white border-b border-[#070709]/5 px-6 py-4 sticky top-0 z-20">
        <div className="max-w-[760px] mx-auto flex items-center justify-between">
          <button
            onClick={() => onNavigate('landing')}
            className="text-[20px] font-bold tracking-tight text-[#070709]"
          >
            Vouch
          </button>
          <div className="flex items-center gap-3">
            <span className="text-[13px] font-medium text-[#60606c]">
              Step {step} of 5
            </span>
            <div className="w-24 h-1.5 rounded-full bg-[#f5f5f5] overflow-hidden">
              <div
                className="h-full bg-[#070709] transition-all duration-300"
                style={{ width: `${(step / 5) * 100}%` }}
              />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Viewport */}
      <main className="flex-1 py-12 px-6">
        <div className="max-w-[720px] mx-auto bg-white rounded-[24px] p-8 md:p-12 shadow-atmospheric border border-black/[0.04]">
          {/* STEP 1: YOUR PRODUCT */}
          {step === 1 && (
            <div>
              <div className="mb-8">
                <span className="text-[12px] font-bold uppercase tracking-wider text-[#2597d0] block mb-2">
                  First Program Setup
                </span>
                <h1 className="text-[32px] font-semibold text-[#070709] tracking-[-0.04em] mb-2">
                  What are we tracking referrals for?
                </h1>
                <p className="text-[15px] text-[#60606c]">
                  This names your first program. You can add more later.
                </p>
              </div>

              <form onSubmit={handleStep1Submit} className="space-y-6">
                <div>
                  <label className="block text-[14px] font-medium text-[#070709] mb-2">
                    Product name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Tiny Analytics"
                    value={productName}
                    onChange={(e) => setProductName(e.target.value)}
                    className="w-full px-4 py-3 rounded-[12px] border border-[#bebecc] focus:border-[#070709] focus:outline-none text-[15px] text-[#070709]"
                  />
                </div>

                <div>
                  <label className="block text-[14px] font-medium text-[#070709] mb-2">
                    Product website <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="url"
                    required
                    placeholder="https://tinyanalytics.io"
                    value={productWebsite}
                    onChange={(e) => setProductWebsite(e.target.value)}
                    className="w-full px-4 py-3 rounded-[12px] border border-[#bebecc] focus:border-[#070709] focus:outline-none text-[15px] text-[#070709]"
                  />
                  <p className="text-[12px] text-[#8b8b8b] mt-1.5">
                    Used as the default redirect target for referral links.
                  </p>
                </div>

                <div>
                  <label className="block text-[14px] font-medium text-[#070709] mb-2">
                    Where do users sign up? <span className="text-[#8b8b8b] font-normal">(optional)</span>
                  </label>
                  <input
                    type="url"
                    placeholder="https://tinyanalytics.io/signup"
                    value={signupUrl}
                    onChange={(e) => setSignupUrl(e.target.value)}
                    className="w-full px-4 py-3 rounded-[12px] border border-[#bebecc] focus:border-[#070709] focus:outline-none text-[15px] text-[#070709]"
                  />
                  <p className="text-[12px] text-[#8b8b8b] mt-1.5">
                    We'll point referral traffic here unless a link overrides it.
                  </p>
                </div>

                <div className="pt-4 flex items-center justify-end">
                  <button
                    type="submit"
                    className="px-8 py-3.5 text-[14px] font-medium text-white bg-[#070709] rounded-full shadow-pill hover:bg-[#151515] transition-all flex items-center gap-2"
                  >
                    Continue <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* STEP 2: REWARD STRUCTURE (Calm, structured, uncrowded) */}
          {step === 2 && (
            <div className="space-y-8">
              <div>
                <span className="text-[12px] font-bold uppercase tracking-wider text-[#2597d0] block mb-2">
                  Incentives & Rules
                </span>
                <h1 className="text-[30px] font-semibold text-[#070709] tracking-[-0.04em] mb-2">
                  How do you want to reward referrals?
                </h1>
                <p className="text-[14px] text-[#60606c] leading-relaxed">
                  Double-sided rewards convert best — both the referrer and the friend get something. Not every product runs on credits, so we'll tailor this to how you actually make money.
                </p>
              </div>

              {/* Q1: Payments */}
              <div className="space-y-3">
                <label className="block text-[14px] font-semibold text-[#070709]">
                  1. How does your product take payments?
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {[
                    { id: 'stripe', label: 'Stripe', sub: 'Subscriptions or one-off payments through Stripe.' },
                    { id: 'paddle', label: 'Paddle / Lemon Squeezy', sub: 'You sell through a merchant of record.' },
                    { id: 'mobile', label: 'App Store / Google Play', sub: 'Mobile app with in-app purchases.' },
                    { id: 'none', label: "We don't take payments in product", sub: 'Free tool, open source, or non-cash.' }
                  ].map((opt) => (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => {
                        setPaymentMethod(opt.id as any);
                        if (opt.id === 'stripe') setRewardType('Account credit');
                        else if (opt.id === 'paddle') setRewardType('Coupon');
                        else if (opt.id === 'mobile') setRewardType('Custom webhook');
                        else setRewardType('Feature unlock');
                      }}
                      className={`text-left p-4 rounded-[14px] border transition-all ${
                        paymentMethod === opt.id
                          ? 'border-[#070709] bg-[#f5f5f5] shadow-sm'
                          : 'border-[#bebecc]/60 hover:border-[#8b8b8b] bg-white'
                      }`}
                    >
                      <div className="text-[14px] font-medium text-[#070709] mb-0.5">
                        {opt.label}
                      </div>
                      <div className="text-[12px] text-[#60606c]">
                        {opt.sub}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Q2: Who gets rewarded */}
              <div className="space-y-3">
                <label className="block text-[14px] font-semibold text-[#070709]">
                  2. Who gets rewarded?
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setWhoRewarded('both')}
                    className={`text-left p-4 rounded-[14px] border transition-all ${
                      whoRewarded === 'both'
                        ? 'border-[#070709] bg-[#f5f5f5] shadow-sm'
                        : 'border-[#bebecc]/60 hover:border-[#8b8b8b] bg-white'
                    }`}
                  >
                    <div className="text-[14px] font-medium text-[#070709] flex items-center justify-between">
                      Both sides <span className="text-[11px] text-[#2597d0] font-normal">(recommended)</span>
                    </div>
                    <div className="text-[12px] text-[#60606c] mt-0.5">
                      The referrer and the new customer each get a reward.
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setWhoRewarded('referrer')}
                    className={`text-left p-4 rounded-[14px] border transition-all ${
                      whoRewarded === 'referrer'
                        ? 'border-[#070709] bg-[#f5f5f5] shadow-sm'
                        : 'border-[#bebecc]/60 hover:border-[#8b8b8b] bg-white'
                    }`}
                  >
                    <div className="text-[14px] font-medium text-[#070709]">
                      Referrer only
                    </div>
                    <div className="text-[12px] text-[#60606c] mt-0.5">
                      Only the person who shared the link gets rewarded.
                    </div>
                  </button>
                </div>
              </div>

              {/* Q3: Reward Type (Adaptive based on Q1) */}
              <div className="space-y-3">
                <label className="block text-[14px] font-semibold text-[#070709]">
                  3. What type of reward?
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {paymentMethod === 'stripe' && (
                    <>
                      {[
                        { title: 'Account credit', desc: 'Applied through Stripe, shows on next invoice' },
                        { title: 'Coupon', desc: 'A Stripe discount code automatically created' },
                        { title: 'Cash payout', desc: 'Wise/PayPal — we track, you approve payout' },
                        { title: 'Custom webhook', desc: 'We ping your URL and you handle fulfillment' }
                      ].map((r, i) => (
                        <button
                          key={i}
                          type="button"
                          onClick={() => setRewardType(r.title)}
                          className={`text-left p-3.5 rounded-[12px] border text-xs transition-all ${
                            rewardType === r.title
                              ? 'border-[#070709] bg-[#f5f5f5] font-medium'
                              : 'border-[#bebecc]/60 hover:border-[#8b8b8b]'
                          }`}
                        >
                          <div className="text-[13px] font-medium text-[#070709]">{r.title}</div>
                          <div className="text-[11px] text-[#60606c] mt-0.5">{r.desc}</div>
                        </button>
                      ))}
                    </>
                  )}

                  {paymentMethod === 'paddle' && (
                    <>
                      {[
                        { title: 'Coupon / discount code', desc: 'Issued in your merchant dashboard' },
                        { title: 'Cash payout', desc: 'Wise/PayPal payout tracking' },
                        { title: 'Custom webhook', desc: 'Notify your server on conversion' },
                        { title: 'Manual fulfillment', desc: 'Track conversion, fulfill manually' }
                      ].map((r, i) => (
                        <button
                          key={i}
                          type="button"
                          onClick={() => setRewardType(r.title)}
                          className={`text-left p-3.5 rounded-[12px] border text-xs transition-all ${
                            rewardType === r.title ? 'border-[#070709] bg-[#f5f5f5]' : 'border-[#bebecc]/60'
                          }`}
                        >
                          <div className="text-[13px] font-medium text-[#070709]">{r.title}</div>
                          <div className="text-[11px] text-[#60606c] mt-0.5">{r.desc}</div>
                        </button>
                      ))}
                    </>
                  )}

                  {paymentMethod === 'mobile' && (
                    <>
                      {[
                        { title: 'Custom webhook', desc: 'Unlock premium, grant consumables' },
                        { title: 'Manual fulfillment', desc: 'Track conversion, you fulfill yourself' }
                      ].map((r, i) => (
                        <button
                          key={i}
                          type="button"
                          onClick={() => setRewardType(r.title)}
                          className={`text-left p-3.5 rounded-[12px] border text-xs transition-all ${
                            rewardType === r.title ? 'border-[#070709] bg-[#f5f5f5]' : 'border-[#bebecc]/60'
                          }`}
                        >
                          <div className="text-[13px] font-medium text-[#070709]">{r.title}</div>
                          <div className="text-[11px] text-[#60606c] mt-0.5">{r.desc}</div>
                        </button>
                      ))}
                    </>
                  )}

                  {paymentMethod === 'none' && (
                    <>
                      {[
                        { title: 'Feature unlock', desc: 'Webhook triggers to unlock feature' },
                        { title: 'Account upgrade', desc: 'Free month of pro, extra seats' },
                        { title: 'Swag / gift card', desc: 'We track it, you ship it' },
                        { title: 'Custom webhook', desc: 'Custom server notification' }
                      ].map((r, i) => (
                        <button
                          key={i}
                          type="button"
                          onClick={() => setRewardType(r.title)}
                          className={`text-left p-3.5 rounded-[12px] border text-xs transition-all ${
                            rewardType === r.title ? 'border-[#070709] bg-[#f5f5f5]' : 'border-[#bebecc]/60'
                          }`}
                        >
                          <div className="text-[13px] font-medium text-[#070709]">{r.title}</div>
                          <div className="text-[11px] text-[#60606c] mt-0.5">{r.desc}</div>
                        </button>
                      ))}
                    </>
                  )}
                </div>
              </div>

              {/* Q4: Reward values */}
              <div className="space-y-3">
                <label className="block text-[14px] font-semibold text-[#070709]">
                  4. Reward amounts or values
                </label>
                {['Account credit', 'Coupon', 'Cash payout', 'Coupon / discount code'].includes(rewardType) ? (
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <span className="text-[12px] text-[#60606c] block mb-1">Referrer gets ($)</span>
                      <input
                        type="number"
                        value={referrerAmount}
                        onChange={(e) => setReferrerAmount(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-[12px] border border-[#bebecc] text-[14px]"
                      />
                    </div>
                    {whoRewarded === 'both' && (
                      <div>
                        <span className="text-[12px] text-[#60606c] block mb-1">Friend gets ($)</span>
                        <input
                          type="number"
                          value={refereeAmount}
                          onChange={(e) => setRefereeAmount(e.target.value)}
                          className="w-full px-4 py-2.5 rounded-[12px] border border-[#bebecc] text-[14px]"
                        />
                      </div>
                    )}
                  </div>
                ) : (
                  <div>
                    <span className="text-[12px] text-[#60606c] block mb-1">Describe the reward</span>
                    <input
                      type="text"
                      value={nonCashDesc}
                      onChange={(e) => setNonCashDesc(e.target.value)}
                      placeholder="e.g. 1 free month of Pro or $25 Amazon gift card"
                      className="w-full px-4 py-2.5 rounded-[12px] border border-[#bebecc] text-[14px]"
                    />
                  </div>
                )}
              </div>

              {/* Q5 & Q6: Issuance Trigger & Clawback Window */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
                <div>
                  <label className="block text-[14px] font-semibold text-[#070709] mb-2">
                    5. When is reward issued?
                  </label>
                  <SelectDropdown
                    value={issuanceTrigger}
                    onChange={setIssuanceTrigger}
                    options={
                      paymentMethod === 'stripe'
                        ? [
                            { value: 'first_invoice', label: 'When first invoice is paid (recommended)' },
                            { value: 'signup', label: 'On signup (higher risk)' }
                          ]
                        : [
                            { value: 'delay_days', label: 'N days after signup (stick around)' },
                            { value: 'api_trigger', label: "When you tell us they're paid (API)" },
                            { value: 'signup', label: 'On signup' }
                          ]
                    }
                    className="w-full"
                    buttonClassName="w-full justify-between rounded-[12px] py-2.5 px-3.5 text-[13px]"
                    menuClassName="w-full"
                  />
                </div>

                <div>
                  <label className="block text-[14px] font-semibold text-[#070709] mb-2">
                    6. Clawback window
                  </label>
                  <SelectDropdown
                    value={clawbackWindow}
                    onChange={setClawbackWindow}
                    options={[
                      { value: '7 days', label: '7 days' },
                      { value: '14 days', label: '14 days (recommended)' },
                      { value: '30 days', label: '30 days' },
                      { value: '60 days', label: '60 days' },
                      { value: 'No clawback', label: 'No clawback' }
                    ]}
                    className="w-full"
                    buttonClassName="w-full justify-between rounded-[12px] py-2.5 px-3.5 text-[13px]"
                    menuClassName="w-full"
                  />
                  <p className="text-[11px] text-[#8b8b8b] mt-1.5">
                    {paymentMethod === 'stripe'
                      ? 'Pending rewards cancelled automatically on refund.'
                      : 'Pending rewards flagged for your manual review.'}
                  </p>
                </div>
              </div>

              {/* Navigation buttons */}
              <div className="pt-6 border-t border-slate-100 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="px-5 py-2.5 text-[14px] text-[#60606c] hover:text-[#070709] flex items-center gap-1.5"
                >
                  <ArrowLeft className="w-4 h-4" /> Back
                </button>
                <div className="flex items-center gap-4">
                  <button
                    type="button"
                    onClick={() => setStep(3)}
                    className="text-[13px] text-[#8b8b8b] hover:text-[#070709] underline"
                  >
                    Skip for now
                  </button>
                  <button
                    type="button"
                    onClick={() => setStep(3)}
                    className="px-7 py-3 text-[14px] font-medium text-white bg-[#070709] rounded-full shadow-pill hover:bg-[#151515] transition-all"
                  >
                    Continue
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: API KEY */}
          {step === 3 && (
            <div className="space-y-6">
              <div>
                <span className="text-[12px] font-bold uppercase tracking-wider text-[#2597d0] block mb-2">
                  Authentication Secret
                </span>
                <h1 className="text-[32px] font-semibold text-[#070709] tracking-[-0.04em] mb-2">
                  Your API key
                </h1>
                <p className="text-[15px] text-[#60606c]">
                  Keep this secret. It goes in your server, never in frontend code.
                </p>
              </div>

              {/* Masked Key Display Box */}
              <div className="p-5 rounded-[16px] bg-[#070709] text-white flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="font-mono text-[14px] tracking-wide break-all">
                  {keyCopied ? apiKey : `${apiKey.slice(0, 10)}••••••••••••••••${apiKey.slice(-4)}`}
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => copyToClipboard(apiKey, setKeyCopied)}
                    className="px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 text-xs font-medium text-white flex items-center gap-1.5 transition-all"
                  >
                    {keyCopied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    {keyCopied ? 'Copied!' : 'Copy'}
                  </button>
                  <button
                    onClick={handleRegenerateKey}
                    title="Regenerate key"
                    className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Warning Box */}
              <div className="p-4 rounded-[14px] bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-start gap-3">
                <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="font-semibold block mb-0.5">Keep it private</strong>
                  Anyone with this key can create programs and issue rewards. Store it in an environment variable on your backend server.
                </div>
              </div>

              {/* Confirmation Checkbox */}
              <label className="flex items-center gap-2.5 cursor-pointer text-[13px] text-[#60606c] select-none pt-2">
                <input
                  type="checkbox"
                  checked={savedKeyConfirmed || keyCopied}
                  onChange={(e) => setSavedKeyConfirmed(e.target.checked)}
                  className="rounded border-[#bebecc] text-[#070709] focus:ring-0"
                />
                <span>I've saved my key somewhere safe</span>
              </label>

              {/* Navigation */}
              <div className="pt-6 border-t border-slate-100 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="px-5 py-2.5 text-[14px] text-[#60606c] hover:text-[#070709] flex items-center gap-1.5"
                >
                  <ArrowLeft className="w-4 h-4" /> Back
                </button>
                <button
                  type="button"
                  disabled={!savedKeyConfirmed && !keyCopied}
                  onClick={() => setStep(4)}
                  className={`px-7 py-3 text-[14px] font-medium rounded-full shadow-pill transition-all ${
                    savedKeyConfirmed || keyCopied
                      ? 'bg-[#070709] text-white hover:bg-[#151515]'
                      : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                  }`}
                >
                  I've saved my key
                </button>
              </div>
            </div>
          )}

          {/* STEP 4: INSTALL THE SNIPPET */}
          {step === 4 && (
            <div className="space-y-6">
              <div>
                <span className="text-[12px] font-bold uppercase tracking-wider text-[#2597d0] block mb-2">
                  Fast Integration
                </span>
                <h1 className="text-[32px] font-semibold text-[#070709] tracking-[-0.04em] mb-2">
                  Four lines to go live
                </h1>
                <p className="text-[15px] text-[#60606c]">
                  Call these two endpoints from your existing backend code.
                </p>
              </div>

              {/* Language Selector */}
              <div className="flex items-center gap-2 border-b border-slate-100 pb-2">
                {(['node', 'curl', 'python'] as const).map((lang) => (
                  <button
                    key={lang}
                    onClick={() => setActiveCodeTab(lang)}
                    className={`px-4 py-1.5 rounded-full text-xs font-semibold capitalize transition-all ${
                      activeCodeTab === lang
                        ? 'bg-[#070709] text-white'
                        : 'text-[#60606c] hover:text-[#070709] hover:bg-[#f5f5f5]'
                    }`}
                  >
                    {lang === 'node' ? 'Node.js' : lang === 'curl' ? 'cURL' : 'Python'}
                  </button>
                ))}
              </div>

              {/* Code display */}
              <div className="relative bg-[#070709] text-slate-100 rounded-[16px] p-5 font-mono text-[12px] overflow-x-auto">
                <button
                  onClick={() => copyToClipboard('vouch-snippet', setCodeCopied)}
                  className="absolute top-3 right-3 p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors"
                >
                  {codeCopied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                </button>

                {activeCodeTab === 'node' && (
                  <pre className="space-y-4">
                    <code>{`// 1. Generate link for user
const link = await vouch.referralLinks.create({
  userId: req.user.id,
  email: req.user.email
});

// 2. Attribute signup
await vouch.attributions.create({
  refereeUserId: newUser.id,
  referralCode: req.cookies.vouch_ref
});`}</code>
                  </pre>
                )}

                {activeCodeTab === 'curl' && (
                  <pre>
                    <code>{`# 1. Generate referral link
curl -X POST https://api.vouch.link/v1/referral-links \\
  -H "Authorization: Bearer ${apiKey.slice(0, 10)}..." \\
  -d '{"userId":"user_123"}'

# 2. Attribute signup
curl -X POST https://api.vouch.link/v1/attributions \\
  -H "Authorization: Bearer ${apiKey.slice(0, 10)}..." \\
  -d '{"refereeUserId":"user_456","referralCode":"RF-8X2K"}'`}</code>
                  </pre>
                )}

                {activeCodeTab === 'python' && (
                  <pre>
                    <code>{`# 1. Generate link
link = vouch.referral_links.create(user_id=user.id, email=user.email)

# 2. Attribute signup
vouch.attributions.create(referee_user_id=new_user.id, referral_code=request.cookies.get("vouch_ref"))`}</code>
                  </pre>
                )}
              </div>

              {/* Live Tracking Verification Box */}
              <div className="p-5 rounded-[16px] bg-[#f5f5f5] border border-black/[0.04]">
                <div className="text-[13px] font-semibold text-[#070709] mb-1">
                  Test it in your terminal
                </div>
                <p className="text-[12px] text-[#60606c] mb-3">
                  Paste your test referral code here to verify tracking works.
                </p>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={testCodeInput}
                    onChange={(e) => setTestCodeInput(e.target.value)}
                    placeholder="e.g. RF-8X2K"
                    className="flex-1 px-4 py-2.5 rounded-[10px] border border-[#bebecc] text-[13px] font-mono uppercase bg-white text-[#070709]"
                  />
                  <button
                    type="button"
                    onClick={handleVerifyTracking}
                    disabled={isVerifying}
                    className="px-5 py-2.5 text-[13px] font-medium text-white bg-[#070709] rounded-[10px] hover:bg-[#151515] transition-all whitespace-nowrap"
                  >
                    {isVerifying ? 'Verifying...' : 'Verify'}
                  </button>
                </div>

                {trackingVerified && (
                  <div className="mt-3 text-xs text-emerald-700 flex items-center gap-1.5 font-medium animate-in fade-in">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    Tracking works. Nice.
                  </div>
                )}
              </div>

              {/* Navigation */}
              <div className="pt-6 border-t border-slate-100 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setStep(3)}
                  className="px-5 py-2.5 text-[14px] text-[#60606c] hover:text-[#070709] flex items-center gap-1.5"
                >
                  <ArrowLeft className="w-4 h-4" /> Back
                </button>
                <div className="flex items-center gap-4">
                  <button
                    type="button"
                    onClick={() => setStep(5)}
                    className="text-[13px] text-[#8b8b8b] hover:text-[#070709] underline"
                  >
                    I'll do this later
                  </button>
                  <button
                    type="button"
                    onClick={() => setStep(5)}
                    className="px-7 py-3 text-[14px] font-medium text-white bg-[#070709] rounded-full shadow-pill hover:bg-[#151515] transition-all"
                  >
                    Continue
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* STEP 5: DONE */}
          {step === 5 && (
            <div className="space-y-6 text-center py-4">
              <div className="w-16 h-16 rounded-full bg-[#d7e6f5]/60 text-[#2597d0] mx-auto flex items-center justify-center">
                <Check className="w-8 h-8 stroke-[2.5]" />
              </div>

              <div>
                <h1 className="text-[34px] font-semibold text-[#070709] tracking-[-0.04em] mb-2">
                  You're live.
                </h1>
                <p className="text-[15px] text-[#60606c] max-w-md mx-auto leading-relaxed">
                  Your program is active. Share your own referral link to see the full loop, or head to the dashboard.
                </p>
              </div>

              {/* Founder's Own Referral Link */}
              <div className="max-w-md mx-auto p-4 rounded-[16px] bg-[#f5f5f5] border border-black/[0.04] text-left">
                <div className="text-[11px] uppercase tracking-wider text-[#8b8b8b] font-medium mb-1">
                  Your Founder Referral Link
                </div>
                <div className="flex items-center justify-between gap-2">
                  <span className="font-mono text-[13px] text-[#070709] truncate">
                    {founderReferralUrl}
                  </span>
                  <button
                    onClick={() => copyToClipboard(founderReferralUrl, setFounderLinkCopied)}
                    className="px-3 py-1.5 text-xs font-medium bg-white border border-[#bebecc] rounded-full hover:border-[#070709] flex items-center gap-1 shrink-0"
                  >
                    {founderLinkCopied ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                    {founderLinkCopied ? 'Copied' : 'Copy'}
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
                <button
                  onClick={() => onComplete('overview')}
                  className="w-full sm:w-auto px-8 py-3.5 text-[14px] font-medium text-white bg-[#070709] rounded-full shadow-pill hover:bg-[#151515] transition-all"
                >
                  Go to dashboard
                </button>
                <button
                  onClick={() => setShowInviteModal(true)}
                  className="w-full sm:w-auto px-7 py-3.5 text-[14px] font-medium text-[#070709] bg-white border border-[#bebecc] rounded-full hover:border-[#070709] transition-all"
                >
                  Invite a teammate
                </button>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Team Invite Modal if clicked in Step 5 */}
      {showInviteModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-[20px] max-w-md w-full p-6 shadow-2xl border border-slate-100">
            <h3 className="text-[18px] font-bold text-[#070709] mb-1">Invite a teammate</h3>
            <p className="text-xs text-[#60606c] mb-4">
              Add co-founders, growth engineers, or marketers to your workspace.
            </p>
            {inviteSent ? (
              <div className="p-4 rounded-xl bg-emerald-50 text-emerald-800 text-xs mb-4">
                Invitation sent to {inviteEmail}!
              </div>
            ) : (
              <div className="space-y-3 mb-5">
                <input
                  type="email"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  placeholder="colleague@yourcompany.com"
                  className="w-full px-3.5 py-2.5 rounded-lg border border-[#bebecc] text-sm"
                />
              </div>
            )}
            <div className="flex items-center justify-end gap-2">
              <button
                onClick={() => {
                  setShowInviteModal(false);
                  setInviteSent(false);
                }}
                className="px-4 py-2 text-xs font-medium text-[#60606c]"
              >
                Done
              </button>
              {!inviteSent && (
                <button
                  onClick={() => setInviteSent(true)}
                  className="px-5 py-2 text-xs font-medium text-white bg-[#070709] rounded-full"
                >
                  Send invite
                </button>
              )}
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
