import React, { useState } from 'react';
import {
  Radio,
  Rss,
  Clock,
  Send,
  CheckCircle2,
  AlertTriangle,
  Play,
  Copy,
  Check,
  Terminal,
  Zap,
} from 'lucide-react';
import { TriggerConfig } from '../types';

interface AutomationTriggersProps {
  onSimulateWebhook: (payload: any) => Promise<void>;
  isSimulating: boolean;
}

export const AutomationTriggers: React.FC<AutomationTriggersProps> = ({
  onSimulateWebhook,
  isSimulating,
}) => {
  const [copiedUrl, setCopiedUrl] = useState(false);
  const [selectedSource, setSelectedSource] = useState('Ghost CMS / Substack RSS');
  const [sampleEventTopic, setSampleEventTopic] = useState(
    'Decentralized Intelligence: How Autonomous Workflows Beat Monolithic AI in Production'
  );

  const triggers: TriggerConfig[] = [
    {
      id: 'trig_wh_1',
      name: 'Inbound Ingestion Webhook',
      type: 'webhook',
      status: 'active',
      lastRun: '12 mins ago',
      totalExecutions: 342,
    },
    {
      id: 'trig_rss_1',
      name: 'Substack / Ghost RSS Feed Watcher',
      type: 'rss',
      status: 'active',
      lastRun: '1 hour ago',
      totalExecutions: 89,
    },
    {
      id: 'trig_sch_1',
      name: 'Monday Morning Omnichannel Blitz',
      type: 'schedule',
      status: 'active',
      lastRun: 'Yesterday',
      totalExecutions: 24,
    },
    {
      id: 'trig_notion_1',
      name: 'Notion Database "Ready for Publish"',
      type: 'notion',
      status: 'paused',
      lastRun: '3 days ago',
      totalExecutions: 65,
    },
  ];

  const handleSimulate = async () => {
    await onSimulateWebhook({
      sourceName: selectedSource,
      topic: sampleEventTopic,
    });
  };

  const webhookEndpoint = `${window.location.origin}/api/triggers/simulate`;

  const handleCopyWebhookUrl = () => {
    navigator.clipboard.writeText(webhookEndpoint);
    setCopiedUrl(true);
    setTimeout(() => setCopiedUrl(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white border border-[#dcdcd3] rounded-3xl p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="inline-flex items-center space-x-2 text-xs text-[#0d0e10] font-mono font-bold tracking-wider px-3 py-1 rounded-full bg-[#eeeee8]">
              <Radio className="w-3.5 h-3.5 text-[#0d0e10]" />
              <span>EVENT-DRIVEN CONTENT INGESTION</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0d0e10] font-heading tracking-tight">
              Automation Triggers & Webhooks
            </h2>
            <p className="text-xs sm:text-sm text-[#75766f] max-w-2xl font-sans leading-relaxed">
              Connect external CMS publications, GitHub releases, podcasts, or Notion updates to kick off Javarif autonomous workflows automatically.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Trigger Simulator & Inbound Endpoint (2 cols) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Inbound Webhook Box */}
          <div className="bg-white border border-[#dcdcd3] rounded-3xl p-6 sm:p-7 space-y-4 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono uppercase text-[#0d0e10] font-bold flex items-center space-x-2">
                <Terminal className="w-3.5 h-3.5 text-[#0d0e10]" />
                <span>Your Live Webhook Ingestion URL</span>
              </span>
              <span className="px-3 py-1 rounded-full text-[10px] font-mono bg-[#eeeee8] text-[#0d0e10] border border-[#dcdcd3] font-bold flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#d4ff3a]" />
                Listening 24/7
              </span>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
              <input
                type="text"
                readOnly
                value={webhookEndpoint}
                className="w-full bg-[#eeeee8] border border-[#dcdcd3] rounded-full px-4 py-2.5 text-xs font-mono text-[#0d0e10] focus:outline-none focus:bg-white truncate"
              />
              <button
                onClick={handleCopyWebhookUrl}
                className="px-5 py-2.5 rounded-full bg-[#0d0e10] hover:bg-black text-[#d4ff3a] text-xs font-mono font-bold flex items-center justify-center space-x-1.5 transition-all cursor-pointer whitespace-nowrap active:scale-95 shadow-xs shrink-0"
              >
                {copiedUrl ? <Check className="w-4 h-4 text-[#d4ff3a]" /> : <Copy className="w-4 h-4" />}
                <span>{copiedUrl ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
            <p className="text-xs text-[#75766f] font-mono">
              POST JSON with <code className="bg-[#eeeee8] px-2 py-0.5 rounded border border-[#dcdcd3] font-bold text-[#0d0e10]">{`{ "topic": "..." }`}</code> to trigger the full 6-channel omnichannel synthesizer.
            </p>
          </div>

          {/* Trigger Event Simulator */}
          <div className="bg-white border border-[#dcdcd3] rounded-3xl p-6 sm:p-7 space-y-5 shadow-xs">
            <div>
              <span className="text-xs font-mono uppercase text-[#0d0e10] font-bold flex items-center space-x-2 mb-1">
                <Zap className="w-3.5 h-3.5 text-[#0d0e10]" />
                <span>Simulate Inbound Event (Live Test)</span>
              </span>
              <p className="text-xs text-[#75766f] font-sans">
                Fire a simulated external trigger to test how Javarif receives the event and initiates pipeline execution.
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-xs font-mono uppercase text-[#0d0e10] font-bold block mb-1.5">
                  Trigger Source Event
                </label>
                <select
                  value={selectedSource}
                  onChange={(e) => setSelectedSource(e.target.value)}
                  className="w-full bg-[#eeeee8] border border-[#dcdcd3] rounded-full px-4 py-2.5 text-xs text-[#0d0e10] focus:outline-none focus:border-[#0d0e10] focus:bg-white font-mono cursor-pointer"
                >
                  <option value="Ghost CMS / Substack RSS">Ghost CMS / Substack (New Article Published)</option>
                  <option value="YouTube RSS Feed">YouTube RSS (New Long-Form Video Uploaded)</option>
                  <option value="GitHub Releases Webhook">GitHub Webhook (New Product Release Tag)</option>
                  <option value="Notion Webhook">Notion Database (Page Marked 'Approved')</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-mono uppercase text-[#0d0e10] font-bold block mb-1.5">
                  Simulated Inbound Payload Content
                </label>
                <textarea
                  value={sampleEventTopic}
                  onChange={(e) => setSampleEventTopic(e.target.value)}
                  rows={3}
                  className="w-full bg-[#eeeee8] border border-[#dcdcd3] rounded-2xl p-4 text-xs text-[#0d0e10] focus:outline-none focus:border-[#0d0e10] focus:bg-white font-sans transition-colors resize-none"
                />
              </div>

              <button
                type="button"
                onClick={handleSimulate}
                disabled={isSimulating}
                className="w-full py-3.5 rounded-full bg-[#d4ff3a] hover:bg-[#c6f02e] text-[#0d0e10] font-mono font-bold text-xs shadow-sm transition-all flex items-center justify-center space-x-2 cursor-pointer active:scale-95 duration-150 btn-spring"
              >
                {isSimulating ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-[#0d0e10] border-t-transparent rounded-full animate-spin" />
                    <span>Transmitting Event to Pipeline...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-3.5 h-3.5 fill-current" />
                    <span>FIRE INBOUND EVENT & EXECUTE PIPELINE →</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Active Triggers Registry (1 col) */}
        <div className="space-y-4">
          <div className="bg-white border border-[#dcdcd3] rounded-3xl p-6 space-y-4 shadow-xs">
            <span className="text-xs font-mono uppercase text-[#0d0e10] font-bold block">
              Registered Connectors ({triggers.length})
            </span>

            <div className="space-y-3">
              {triggers.map((trig) => (
                <div
                  key={trig.id}
                  className="p-4 rounded-2xl bg-[#eeeee8] border border-[#dcdcd3] space-y-2 hover:border-[#0d0e10] transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#0d0e10] line-clamp-1 font-sans">
                      {trig.name}
                    </span>
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono border font-bold ${
                        trig.status === 'active'
                          ? 'bg-[#0d0e10] text-[#d4ff3a] border-[#0d0e10]'
                          : 'bg-white text-[#75766f] border-[#dcdcd3]'
                      }`}
                    >
                      {trig.status}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-[#75766f] font-mono">
                    <span>Last run: {trig.lastRun}</span>
                    <span>{trig.totalExecutions} total runs</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
