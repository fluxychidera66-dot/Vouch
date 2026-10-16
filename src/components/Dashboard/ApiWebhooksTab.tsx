import React, { useState } from 'react';
import { ApiKeyItem, WebhookEventItem, WorkspaceState } from '../../types';
import {
  Key,
  Webhook,
  Copy,
  Check,
  Plus,
  RefreshCw,
  AlertTriangle,
  Play,
  CheckCircle2,
  X,
  ExternalLink
} from 'lucide-react';

interface ApiWebhooksTabProps {
  workspace: WorkspaceState;
  apiKeys: ApiKeyItem[];
  webhookEvents: WebhookEventItem[];
  onAddApiKey: (key: ApiKeyItem) => void;
  onRevokeApiKey: (id: string) => void;
  onSendTestEvent: () => void;
  onRetryWebhook: (id: string) => void;
  onOpenDocs: () => void;
}

export const ApiWebhooksTab: React.FC<ApiWebhooksTabProps> = ({
  workspace,
  apiKeys,
  webhookEvents,
  onAddApiKey,
  onRevokeApiKey,
  onSendTestEvent,
  onRetryWebhook,
  onOpenDocs
}) => {
  const [copiedKeyId, setCopiedKeyId] = useState<string | null>(null);
  const [copiedWebhookUrl, setCopiedWebhookUrl] = useState(false);
  const [showGenKeyModal, setShowGenKeyModal] = useState(false);
  const [newKeyName, setNewKeyName] = useState('');
  const [generatedFullKey, setGeneratedFullKey] = useState<string | null>(null);
  const [testEventNotification, setTestEventNotification] = useState<string | null>(null);

  const webhookEndpoint = `https://api.vouch.link/v1/webhooks/stripe?ws=${workspace.name.toLowerCase().replace(/\s+/g, '-')}&env=${
    workspace.isTestMode ? 'test' : 'live'
  }`;

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKeyId(id);
    setTimeout(() => setCopiedKeyId(null), 2000);
  };

  const handleGenerateKey = (e: React.FormEvent) => {
    e.preventDefault();
    const hex = Math.random().toString(36).substring(2, 10);
    const full = `vk_${workspace.isTestMode ? 'test' : 'live'}_${hex}${Date.now().toString().slice(-6)}`;
    const prefix = `${full.slice(0, 10)}…${full.slice(-4)}`;

    const newItem: ApiKeyItem = {
      id: `key-${Date.now()}`,
      name: newKeyName || 'Backend Service Key',
      prefix,
      fullKey: full,
      createdAt: new Date().toISOString().split('T')[0],
      lastUsed: 'Never'
    };

    onAddApiKey(newItem);
    setGeneratedFullKey(full);
  };

  const handleTriggerTestEvent = () => {
    onSendTestEvent();
    setTestEventNotification('Test event processed. Check Overview for the test conversion.');
    setTimeout(() => setTestEventNotification(null), 5000);
  };

  return (
    <div className="space-y-10">
      {/* SECTION 1: API KEYS */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-[22px] font-bold text-[#070709] tracking-tight">
              API Keys
            </h2>
            <p className="text-[13px] text-[#60606c]">
              Authenticate server requests for creating links, recording signups, and query stats.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onOpenDocs}
              className="text-xs font-medium text-[#2597d0] hover:underline"
            >
              Read the API reference
            </button>
            <button
              onClick={() => {
                setGeneratedFullKey(null);
                setNewKeyName('');
                setShowGenKeyModal(true);
              }}
              className="px-4 py-2 text-xs font-medium text-white bg-[#070709] rounded-full shadow-pill hover:bg-[#151515] flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" /> Generate new key
            </button>
          </div>
        </div>

        {/* Keys Table */}
        <div className="bg-white rounded-[18px] border border-[#bebecc]/40 shadow-sm overflow-hidden">
          <table className="w-full text-left text-[13px]">
            <thead>
              <tr className="border-b border-slate-100 text-[#8b8b8b] font-medium text-[11px] uppercase tracking-wider bg-[#f5f5f5]/50">
                <th className="py-3 px-4">Name</th>
                <th className="py-3 px-4">Token Prefix</th>
                <th className="py-3 px-4">Created</th>
                <th className="py-3 px-4">Last Used</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {apiKeys.map((k) => (
                <tr key={k.id} className="hover:bg-[#f5f5f5]/60 transition-colors">
                  <td className="py-3 px-4 font-semibold text-[#070709]">{k.name}</td>
                  <td className="py-3 px-4 font-mono text-xs text-[#2597d0]">{k.prefix}</td>
                  <td className="py-3 px-4 text-xs text-[#8b8b8b]">{k.createdAt}</td>
                  <td className="py-3 px-4 text-xs text-[#60606c]">{k.lastUsed}</td>
                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={() => onRevokeApiKey(k.id)}
                      className="text-xs font-medium text-red-600 hover:text-red-700 hover:underline"
                    >
                      Revoke
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* SECTION 2: STRIPE WEBHOOKS */}
      <div className="space-y-5 pt-4 border-t border-slate-200">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-[22px] font-bold text-[#070709] tracking-tight">
              Stripe Webhooks
            </h2>
            <p className="text-[13px] text-[#60606c]">
              We listen for customer payments and refunds to automate rewards and clawbacks.
            </p>
          </div>

          <button
            onClick={handleTriggerTestEvent}
            className="px-4 py-2 text-xs font-medium text-[#070709] bg-white border border-[#bebecc] rounded-full hover:border-[#070709] flex items-center gap-1.5 transition-all self-start sm:self-auto"
          >
            <Play className="w-3.5 h-3.5 text-[#2597d0]" /> Send test event
          </button>
        </div>

        {testEventNotification && (
          <div className="p-3.5 rounded-[12px] bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{testEventNotification}</span>
          </div>
        )}

        {/* Status Card & Webhook URL */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-[16px] p-5 border border-[#bebecc]/40 shadow-sm">
            <div className="text-xs font-medium text-[#8b8b8b] uppercase tracking-wider mb-1">
              Connection Status
            </div>
            <div className="flex items-center gap-2 text-[16px] font-bold text-[#070709]">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              Connected
            </div>
            <p className="text-[11px] text-[#8b8b8b] mt-2">
              Last event received 14 minutes ago
            </p>
          </div>

          <div className="md:col-span-2 bg-white rounded-[16px] p-5 border border-[#bebecc]/40 shadow-sm flex flex-col justify-between">
            <div>
              <div className="text-xs font-medium text-[#8b8b8b] uppercase tracking-wider mb-1">
                Your Webhook Endpoint URL
              </div>
              <div className="p-2.5 rounded-lg bg-[#f5f5f5] font-mono text-xs text-[#070709] break-all border border-slate-200 flex items-center justify-between gap-2">
                <span className="truncate">{webhookEndpoint}</span>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(webhookEndpoint);
                    setCopiedWebhookUrl(true);
                    setTimeout(() => setCopiedWebhookUrl(false), 2000);
                  }}
                  className="px-2.5 py-1 text-xs font-medium bg-white rounded-md border border-slate-200 hover:border-slate-400 shrink-0 flex items-center gap-1"
                >
                  {copiedWebhookUrl ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3 text-[#2597d0]" />}
                  {copiedWebhookUrl ? 'Copied' : 'Copy'}
                </button>
              </div>
            </div>
            <div className="text-[11px] text-[#60606c] mt-2">
              Configured for Stripe API versions 2023-10-16 and later.
            </div>
          </div>
        </div>

        {/* Event Log Table */}
        <div className="bg-white rounded-[18px] border border-[#bebecc]/40 shadow-sm overflow-hidden">
          <div className="px-5 py-3 border-b border-slate-100 flex items-center justify-between bg-[#f5f5f5]/40 text-xs font-semibold text-[#070709]">
            <span>Recent Webhook Event Log</span>
            <span className="text-[#8b8b8b] font-normal">Auto-refreshed</span>
          </div>
          <table className="w-full text-left text-[13px]">
            <thead>
              <tr className="border-b border-slate-100 text-[#8b8b8b] font-medium text-[11px] uppercase tracking-wider">
                <th className="py-2.5 px-4">Event Type</th>
                <th className="py-2.5 px-4">Summary</th>
                <th className="py-2.5 px-4">Received</th>
                <th className="py-2.5 px-4">Status</th>
                <th className="py-2.5 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {webhookEvents.map((ev) => (
                <tr key={ev.id} className="hover:bg-[#f5f5f5]/50">
                  <td className="py-2.5 px-4 font-mono font-medium text-xs text-[#070709]">{ev.eventType}</td>
                  <td className="py-2.5 px-4 text-xs text-[#60606c] max-w-[240px] truncate">{ev.payloadSummary}</td>
                  <td className="py-2.5 px-4 text-xs text-[#8b8b8b]">{ev.receivedAt}</td>
                  <td className="py-2.5 px-4">
                    <span
                      className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${
                        ev.status === 'Processed'
                          ? 'bg-emerald-50 text-emerald-700'
                          : 'bg-red-50 text-red-700'
                      }`}
                    >
                      {ev.status}
                    </span>
                  </td>
                  <td className="py-2.5 px-4 text-right">
                    {ev.status === 'Failed' && (
                      <button
                        onClick={() => onRetryWebhook(ev.id)}
                        className="text-xs text-[#2597d0] hover:underline flex items-center gap-1 ml-auto"
                      >
                        <RefreshCw className="w-3 h-3" /> Retry
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Setup instructions block */}
        <div className="bg-[#f5f5f5] rounded-[18px] p-6 border border-black/[0.04] space-y-3">
          <h4 className="text-[14px] font-bold text-[#070709]">
            Three steps to connect your Stripe dashboard
          </h4>
          <ol className="list-decimal list-inside space-y-2 text-xs text-[#60606c] leading-relaxed">
            <li>Open the Stripe Dashboard → Developers → Webhooks → Add an endpoint.</li>
            <li>Paste your Vouch endpoint URL shown above and select the events: <code className="bg-white px-1.5 py-0.5 rounded font-mono text-[#070709]">invoice.paid</code>, <code className="bg-white px-1.5 py-0.5 rounded font-mono text-[#070709]">customer.subscription.created</code>, and <code className="bg-white px-1.5 py-0.5 rounded font-mono text-[#070709]">charge.refunded</code>.</li>
            <li>Copy the signing secret from Stripe into your workspace environment or save it here.</li>
          </ol>
        </div>
      </div>

      {/* Generate API Key Modal */}
      {showGenKeyModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-[20px] max-w-md w-full p-6 shadow-2xl border border-slate-100">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-[18px] font-bold text-[#070709]">
                {generatedFullKey ? 'API Key Generated' : 'Create New API Key'}
              </h3>
              <button onClick={() => setShowGenKeyModal(false)} className="text-slate-400 hover:text-slate-700">
                <X className="w-4 h-4" />
              </button>
            </div>

            {generatedFullKey ? (
              <div className="space-y-4">
                <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <strong>You won't see this key again.</strong> Copy it now and store it in an environment variable.
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-[#070709] text-white font-mono text-xs break-all flex items-center justify-between gap-2">
                  <span>{generatedFullKey}</span>
                  <button
                    onClick={() => handleCopy(generatedFullKey, 'full-key')}
                    className="p-1 rounded bg-white/20 hover:bg-white/30 text-white shrink-0"
                  >
                    {copiedKeyId === 'full-key' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>

                <button
                  onClick={() => setShowGenKeyModal(false)}
                  className="w-full py-2.5 text-xs font-medium text-white bg-[#070709] rounded-full"
                >
                  I've copied my key
                </button>
              </div>
            ) : (
              <form onSubmit={handleGenerateKey} className="space-y-4 text-xs">
                <div>
                  <label className="block font-semibold text-[#070709] mb-1">Key name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Production Webhook Server"
                    value={newKeyName}
                    onChange={(e) => setNewKeyName(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-lg border border-[#bebecc] text-sm"
                  />
                </div>

                <div className="pt-2 flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowGenKeyModal(false)}
                    className="px-4 py-2 text-xs font-medium text-[#60606c]"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 text-xs font-medium text-white bg-[#070709] rounded-full shadow-pill"
                  >
                    Generate key
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
