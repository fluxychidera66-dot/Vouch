import {
  Program,
  RewardRule,
  ReferralLink,
  RewardItem,
  ApiKeyItem,
  WebhookEventItem,
  TeamMember,
  NotificationItem,
  WorkspaceState
} from '../types';

export const initialWorkspace: WorkspaceState = {
  name: 'Tiny Analytics',
  website: 'https://tinyanalytics.io',
  signupUrl: 'https://tinyanalytics.io/signup',
  contactEmail: 'alex@tinyanalytics.io',
  isTestMode: false,
  plan: 'Growth',
  usageRevenue: 8200,
  maxRevenue: 15000,
  apiKey: 'vk_live_9a72b84f3e1d42c984920401b'
};

export const initialPrograms: Program[] = [
  {
    id: 'prog-1',
    name: 'Standard Customer Referrals',
    slug: 'standard-referrals',
    description: 'Double-sided credit awarded when referred friend pays their first subscription invoice.',
    redirectUrl: 'https://tinyanalytics.io/pricing',
    status: 'Active',
    linksCount: 1420,
    clicksCount: 9840,
    signupsCount: 2450,
    paidCount: 320,
    revenueAttributed: 64000,
    createdAt: '2026-08-12',
    clawbackDays: 14,
    defaultReward: '$20 credit for both'
  },
  {
    id: 'prog-2',
    name: 'Affiliate & Creator Tier',
    slug: 'creator-partners',
    description: 'High-payout tier for newsletters, indie hacker podcasts, and YouTube reviewers.',
    redirectUrl: 'https://tinyanalytics.io/launch',
    status: 'Active',
    linksCount: 68,
    clicksCount: 2560,
    signupsCount: 730,
    paidCount: 92,
    revenueAttributed: 22000,
    createdAt: '2026-09-01',
    clawbackDays: 30,
    defaultReward: '20% recurring cash payout'
  }
];

export const initialRules: RewardRule[] = [
  {
    id: 'rule-1',
    programId: 'prog-1',
    name: 'Double-sided credit on first payment',
    trigger: 'payment',
    whoGetsRewarded: 'both',
    rewardType: 'Account credit',
    referrerAmount: '$20',
    refereeAmount: '$20',
    delayDays: 14,
    clawbackDays: 14,
    conditions: ['Minimum invoice amount $19', 'Active subscription for 14+ days'],
    status: 'active'
  },
  {
    id: 'rule-2',
    programId: 'prog-1',
    name: 'Signup booster bonus',
    trigger: 'signup',
    whoGetsRewarded: 'referrer',
    rewardType: 'Coupon',
    referrerAmount: '$5',
    refereeAmount: '$0',
    delayDays: 0,
    clawbackDays: 7,
    conditions: ['Work email verified'],
    status: 'inactive'
  },
  {
    id: 'rule-3',
    programId: 'prog-2',
    name: 'Creator cash payout on invoice clearance',
    trigger: 'payment',
    whoGetsRewarded: 'referrer',
    rewardType: 'Cash payout',
    referrerAmount: '$50',
    refereeAmount: '$25 credit',
    delayDays: 30,
    clawbackDays: 30,
    conditions: ['Applies only to Annual plans ($190+)'],
    status: 'active'
  }
];

export const initialLinks: ReferralLink[] = [
  {
    id: 'link-1',
    code: 'RF-8X2K',
    url: 'https://tinyanalytics.io?ref=RF-8X2K',
    userId: 'user_4821',
    email: 'sarah.founder@saasbox.dev',
    programId: 'prog-1',
    clicks: 482,
    signups: 114,
    paid: 28,
    createdAt: '2026-09-14',
    status: 'Active',
    campaign: 'twitter-bio',
    journey: [
      { id: 'j-1', type: 'click', timestamp: '2026-10-14 14:22', label: 'Referral link clicked from twitter.com/sarah_builds' },
      { id: 'j-2', type: 'signup', timestamp: '2026-10-14 14:29', label: 'Referred user created workspace (user_9120)' },
      { id: 'j-3', type: 'payment', timestamp: '2026-10-14 15:40', label: 'First payment cleared: $49/mo Growth plan' },
      { id: 'j-4', type: 'reward_issued', timestamp: '2026-10-14 15:41', label: 'Reward issued: $20 account credit via Stripe' }
    ]
  },
  {
    id: 'link-2',
    code: 'RF-9M4L',
    url: 'https://tinyanalytics.io?ref=RF-9M4L',
    userId: 'user_7731',
    email: 'marcus@cloudmetrics.co',
    programId: 'prog-1',
    clicks: 312,
    signups: 82,
    paid: 19,
    createdAt: '2026-09-18',
    status: 'Active',
    campaign: 'launch-week',
    journey: [
      { id: 'j-5', type: 'click', timestamp: '2026-10-13 09:12', label: 'Link clicked via Product Hunt comment' },
      { id: 'j-6', type: 'signup', timestamp: '2026-10-13 09:18', label: 'Signup attributed to user_6621' },
      { id: 'j-7', type: 'payment', timestamp: '2026-10-13 10:02', label: 'First payment cleared: $19/mo Launch plan' }
    ]
  },
  {
    id: 'link-3',
    code: 'RF-1K9P',
    url: 'https://tinyanalytics.io?ref=RF-1K9P',
    userId: 'user_2209',
    email: 'elena@indiebytes.org',
    programId: 'prog-2',
    clicks: 640,
    signups: 165,
    paid: 34,
    createdAt: '2026-09-22',
    status: 'Active',
    campaign: 'newsletter-sponsor',
    journey: [
      { id: 'j-8', type: 'click', timestamp: '2026-10-11 11:00', label: 'Newsletter click batch: 140 visits' },
      { id: 'j-9', type: 'signup', timestamp: '2026-10-11 11:30', label: 'Batch signups recorded: 38 users' },
      { id: 'j-10', type: 'payment', timestamp: '2026-10-12 18:20', label: '3 annual subscriptions upgraded' }
    ]
  },
  {
    id: 'link-4',
    code: 'RF-3Z7V',
    url: 'https://tinyanalytics.io?ref=RF-3Z7V',
    userId: 'user_9910',
    email: 'dave@churnrisk.io',
    programId: 'prog-1',
    clicks: 89,
    signups: 12,
    paid: 1,
    createdAt: '2026-10-01',
    status: 'Active',
    journey: [
      { id: 'j-11', type: 'click', timestamp: '2026-10-02 16:10', label: 'Direct link visit' },
      { id: 'j-12', type: 'signup', timestamp: '2026-10-02 16:15', label: 'User signed up (user_3389)' },
      { id: 'j-13', type: 'payment', timestamp: '2026-10-03 12:00', label: 'Payment: $19 Launch' },
      { id: 'j-14', type: 'clawback', timestamp: '2026-10-09 08:30', label: 'Clawback triggered: customer requested charge refund within 7 days' }
    ]
  },
  {
    id: 'link-5',
    code: 'RF-6T1Q',
    url: 'https://tinyanalytics.io?ref=RF-6T1Q',
    userId: 'user_1044',
    email: 'priya@devtooling.app',
    programId: 'prog-1',
    clicks: 194,
    signups: 46,
    paid: 8,
    createdAt: '2026-10-04',
    status: 'Active',
    journey: [
      { id: 'j-15', type: 'click', timestamp: '2026-10-12 21:04', label: 'Referral link clicked from GitHub Readme' },
      { id: 'j-16', type: 'signup', timestamp: '2026-10-12 21:09', label: 'User workspace established' }
    ]
  }
];

export const initialRewards: RewardItem[] = [
  {
    id: 'rew-101',
    rewardCode: 'RW-4821-A',
    referrer: 'user_4821 (sarah.founder@saasbox.dev)',
    type: 'Credit',
    amount: 20,
    triggerEvent: 'First invoice payment ($49)',
    status: 'Issued',
    issueDate: 'Oct 14, 2026'
  },
  {
    id: 'rew-102',
    rewardCode: 'RW-7731-B',
    referrer: 'user_7731 (marcus@cloudmetrics.co)',
    type: 'Credit',
    amount: 20,
    triggerEvent: 'First invoice payment ($19)',
    status: 'Pending',
    issueDate: 'Issues on Oct 27, 2026 (13 days left)'
  },
  {
    id: 'rew-103',
    rewardCode: 'RW-2209-C',
    referrer: 'user_2209 (elena@indiebytes.org)',
    type: 'Cash',
    amount: 50,
    triggerEvent: 'Annual plan conversion ($190)',
    status: 'Pending',
    issueDate: 'Issues on Nov 11, 2026 (28 days left)'
  },
  {
    id: 'rew-104',
    rewardCode: 'RW-9910-D',
    referrer: 'user_9910 (dave@churnrisk.io)',
    type: 'Credit',
    amount: 20,
    triggerEvent: 'Payment cancelled within 7 days',
    status: 'Clawed back',
    issueDate: 'Cancelled Oct 09, 2026',
    clawbackReason: 'Customer churned within 14-day clawback window'
  },
  {
    id: 'rew-105',
    rewardCode: 'RW-1044-E',
    referrer: 'user_1044 (priya@devtooling.app)',
    type: 'Credit',
    amount: 20,
    triggerEvent: 'First invoice payment ($19)',
    status: 'Issued',
    issueDate: 'Oct 15, 2026'
  },
  {
    id: 'rew-106',
    rewardCode: 'RW-5512-F',
    referrer: 'user_5512 (tom@buildship.run)',
    type: 'Coupon',
    amount: 15,
    triggerEvent: 'Referred 3 team members',
    status: 'Issued',
    issueDate: 'Oct 10, 2026'
  }
];

export const initialApiKeys: ApiKeyItem[] = [
  {
    id: 'key-1',
    name: 'Production Server Secret',
    prefix: 'vk_live_…9a72',
    createdAt: '2026-08-12',
    lastUsed: '2 minutes ago'
  },
  {
    id: 'key-2',
    name: 'Staging / CI Test Key',
    prefix: 'vk_test_…4f2a',
    createdAt: '2026-09-02',
    lastUsed: 'Yesterday'
  }
];

export const initialWebhookEvents: WebhookEventItem[] = [
  {
    id: 'ev-1',
    eventType: 'invoice.paid',
    receivedAt: '2026-10-15 19:42:10',
    status: 'Processed',
    payloadSummary: 'Customer cus_98x1 paid $49.00 — reward RW-4821 issued'
  },
  {
    id: 'ev-2',
    eventType: 'customer.subscription.created',
    receivedAt: '2026-10-15 18:20:04',
    status: 'Processed',
    payloadSummary: 'Referral cookie attr_8829 attached to sub_19x2'
  },
  {
    id: 'ev-3',
    eventType: 'charge.refunded',
    receivedAt: '2026-10-14 11:15:33',
    status: 'Processed',
    payloadSummary: 'Invoice refund detected — clawback initiated for pending credit'
  },
  {
    id: 'ev-4',
    eventType: 'invoice.payment_failed',
    receivedAt: '2026-10-13 04:12:00',
    status: 'Failed',
    payloadSummary: 'Webhook signature timeout on retry endpoint'
  }
];

export const initialTeamMembers: TeamMember[] = [
  { id: 'tm-1', email: 'alex@tinyanalytics.io', role: 'Owner', joinedAt: 'Aug 2026' },
  { id: 'tm-2', email: 'chideraezeudu2@gmail.com', role: 'Admin', joinedAt: 'Oct 2026' },
  { id: 'tm-3', email: 'sam@growthconsult.co', role: 'Viewer', joinedAt: 'Sep 2026' }
];

export const initialNotifications: NotificationItem[] = [
  {
    id: 'notif-1',
    title: 'Reward issued: $20',
    description: 'Stripe account credit issued to user_4821 for RF-8X2K conversion.',
    time: '22m ago',
    read: false,
    type: 'reward'
  },
  {
    id: 'notif-2',
    title: 'Clawback triggered',
    description: '$20 pending reward cancelled for user_9910 because referred customer churned.',
    time: '2h ago',
    read: false,
    type: 'clawback'
  },
  {
    id: 'notif-3',
    title: 'Plan revenue limit warning',
    description: 'You have reached 54% of your $15,000 Growth tier referral-revenue threshold.',
    time: '1d ago',
    read: true,
    type: 'limit'
  }
];

export const topReferrers = [
  { rank: 1, user: 'user_4821 (sarah.founder@saasbox.dev)', clicks: 482, signups: 114, paid: 28, revenue: '$5,480' },
  { rank: 2, user: 'user_2209 (elena@indiebytes.org)', clicks: 640, signups: 165, paid: 34, revenue: '$4,920' },
  { rank: 3, user: 'user_7731 (marcus@cloudmetrics.co)', clicks: 312, signups: 82, paid: 19, revenue: '$2,850' },
  { rank: 4, user: 'user_1044 (priya@devtooling.app)', clicks: 194, signups: 46, paid: 8, revenue: '$1,520' },
  { rank: 5, user: 'user_5512 (tom@buildship.run)', clicks: 148, signups: 32, paid: 6, revenue: '$1,140' }
];

export const recentActivity = [
  { id: 'act-1', text: 'Reward of $20 issued to user_4821', time: '14 minutes ago', type: 'reward' },
  { id: 'act-2', text: 'New paid conversion from link RF-8X2K ($49/mo)', time: '42 minutes ago', type: 'conversion' },
  { id: 'act-3', text: 'Clawback: $20 cancelled for user_9910 (churned)', time: '3 hours ago', type: 'clawback' },
  { id: 'act-4', text: 'New referral signup from link RF-9M4L', time: '5 hours ago', type: 'signup' },
  { id: 'act-5', text: 'New referral link generated for user_1044', time: '1 day ago', type: 'link' }
];
