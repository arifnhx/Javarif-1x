import React, { useState } from 'react';
import {
  Zap,
  Play,
  RotateCcw,
  Sparkles,
  Sliders,
  CheckCircle2,
  FileText,
  Clock,
  Flame,
  ArrowRight,
  TrendingUp,
  Cpu,
} from 'lucide-react';
import { WorkflowExecutionResult, AVAILABLE_MODELS, UserProfile } from '../types';
import { ModelSelector } from './ModelSelector';
import { Crown, Lock } from 'lucide-react';

interface ExecutionConsoleProps {
  onExecute: (params: {
    topic: string;
    brandVoice: string;
    templateId: string;
    customInstructions: string;
    model: string;
  }) => Promise<void>;
  isRunning: boolean;
  currentStep: number;
  result: WorkflowExecutionResult | null;
  onViewResults: () => void;
  selectedModelId: string;
  onSelectModel: (modelId: string) => void;
  initialTopic?: string;
  currentUser?: UserProfile | null;
  onOpenUpgrade?: () => void;
}

export const ExecutionConsole: React.FC<ExecutionConsoleProps> = ({
  onExecute,
  isRunning,
  currentStep,
  result,
  onViewResults,
  selectedModelId,
  onSelectModel,
  initialTopic,
  currentUser,
  onOpenUpgrade,
}) => {
  const [topic, setTopic] = useState<string>(
    initialTopic ||
      'Autonomous AI agents are transforming SaaS from tools you operate into digital coworkers that execute end-to-end workflows.'
  );

  React.useEffect(() => {
    if (initialTopic) {
      setTopic(initialTopic);
    }
  }, [initialTopic]);

  const [brandVoice, setBrandVoice] = useState<string>('Authoritative & Contrarian');
  const [templateId, setTemplateId] = useState<string>('omnichannel-360');
  const [customInstructions, setCustomInstructions] = useState<string>(
    'Focus on tangible metrics, strong contrast hooks, and zero fluff.'
  );

  const activeModelObj =
    AVAILABLE_MODELS.find((m) => m.id === selectedModelId) || AVAILABLE_MODELS[0];

  const presets = [
    {
      label: 'AI Agents & Automation',
      text: 'Autonomous AI agents are transforming SaaS from tools you operate into digital coworkers that execute end-to-end workflows without human micro-management.',
      voice: 'Authoritative & Contrarian',
    },
    {
      label: 'SaaS Growth & Pricing',
      text: 'Usage-based pricing is dead; outcome-based pricing is the future. Charging for seats punishes customers when software makes them more efficient.',
      voice: 'Tactical & Playbook-Driven',
    },
    {
      label: 'Asynchronous Work Culture',
      text: 'Status meetings are a symptom of broken documentation. High-output distributed teams use deterministic pipelines and async memos instead of 30-minute syncs.',
      voice: 'Punchy & Minimalist',
    },
    {
      label: 'Building in Public',
      text: 'Transparency is the highest leverage distribution strategy. Sharing your real churn, failed experiments, and code architecture builds an unshakeable moat.',
      voice: 'Warm & Educational',
    },
  ];

  const handleRun = () => {
    if (!topic.trim()) return;
    onExecute({
      topic,
      brandVoice,
      templateId,
      customInstructions,
      model: selectedModelId,
    });
  };

  const steps = [
    { label: 'Semantic Ingestion', desc: 'Decomposing core thesis and tension angles' },
    {
      label: `${activeModelObj.name} Synthesis`,
      desc: `Parallel multi-channel generation powered by ${activeModelObj.provider} (${activeModelObj.badge})`,
    },
    { label: 'Virality & Tone Scoring', desc: 'Auditing hook potency, readability, and brand voice' },
    { label: 'Payload Packaging', desc: 'Ready for preview, clipboard, and webhook triggers' },
  ];

  return (
    <div className="space-y-6">
      {/* Top Banner (Reachwise Editorial Card) */}
      <div className="bg-white border border-[#dcdcd3] rounded-3xl p-6 sm:p-8 relative overflow-hidden shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="inline-flex items-center space-x-2 text-xs text-[#0d0e10] font-mono font-bold tracking-wider px-3 py-1 rounded-full bg-[#eeeee8]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#d4ff3a]" />
              <span>MULTI-MODEL AUTONOMOUS CONTENT PIPELINE</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0d0e10] font-heading tracking-tight">
              Execute Content Workflow
            </h2>
            <p className="text-xs sm:text-sm text-[#75766f] max-w-2xl font-sans leading-relaxed">
              Route your core thesis through <strong className="text-[#0d0e10]">Anthropic Claude</strong>, <strong className="text-[#0d0e10]">OpenAI GPT</strong>, <strong className="text-[#0d0e10]">DeepSeek</strong>, or Google models to autonomously synthesize a 6-channel omnichannel campaign.
            </p>
          </div>

          {result && !isRunning && (
            <button
              onClick={onViewResults}
              className="flex items-center space-x-2 px-6 py-3 rounded-full bg-[#d4ff3a] hover:bg-[#c6f02e] text-[#0d0e10] font-mono font-bold text-xs shadow-sm transition-all self-start md:self-auto cursor-pointer active:scale-95 duration-150 btn-spring"
            >
              <span>VIEW GENERATED CAMPAIGN</span>
              <ArrowRight className="w-4 h-4 stroke-[2.5]" />
            </button>
          )}
        </div>
      </div>

      {/* Model Selection Panel */}
      <div className="bg-white border border-[#dcdcd3] rounded-3xl p-6 sm:p-8 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-[#eeeee8] flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <Cpu className="w-4 h-4 text-[#0d0e10]" />
            <h3 className="text-sm font-bold font-heading text-[#0d0e10] uppercase tracking-wider">
              1. Choose AI Model & Engine
            </h3>
          </div>
          <span className="text-xs font-mono text-[#75766f]">
            Switch providers freely (Anthropic, OpenAI, Google, DeepSeek)
          </span>
        </div>

        <ModelSelector
          selectedModelId={selectedModelId}
          onSelectModel={onSelectModel}
          variant="full-cards"
        />
      </div>

      {/* Main Execution Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Input and Configuration */}
        <div className="lg:col-span-8 space-y-6">
          <div className="bg-white border border-[#dcdcd3] rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-[#eeeee8]">
              <h3 className="text-sm font-bold font-heading text-[#0d0e10] uppercase tracking-wider">
                2. Input Core Idea & Thesis
              </h3>
              <span className="text-xs font-mono text-[#75766f]">Raw Seed Content</span>
            </div>

            {/* Presets Bar */}
            <div className="space-y-2">
              <span className="text-xs font-mono uppercase text-[#75766f] block">
                Quick Idea Seeds:
              </span>
              <div className="flex flex-wrap gap-2">
                {presets.map((preset) => (
                  <button
                    key={preset.label}
                    type="button"
                    onClick={() => {
                      setTopic(preset.text);
                      setBrandVoice(preset.voice);
                    }}
                    className={`text-xs px-3.5 py-1.5 rounded-full border transition-all cursor-pointer font-sans ${
                      topic === preset.text
                        ? 'bg-[#0d0e10] text-[#d4ff3a] border-[#0d0e10] font-semibold shadow-xs'
                        : 'bg-[#eeeee8] hover:bg-[#dcdcd3] text-[#0d0e10] border-transparent'
                    }`}
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Topic Textarea */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-mono uppercase text-[#0d0e10] font-bold">
                  Core Insight, Draft or Announcement
                </label>
                <span className="text-xs font-mono text-[#75766f]">
                  {topic.length} characters
                </span>
              </div>
              <textarea
                rows={4}
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="Paste an executive memo, a founder hot take, a podcast transcript snippet, or a product changelog..."
                className="w-full bg-[#fafaf7] border border-[#dcdcd3] rounded-2xl p-4 text-sm text-[#0d0e10] placeholder-[#75766f] focus:outline-none focus:border-[#0d0e10] focus:bg-white font-sans transition-colors resize-none leading-relaxed"
              />
            </div>

            {/* Settings Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-[#eeeee8]">
              {/* Brand Tone Selector */}
              <div>
                <label className="text-xs font-mono uppercase text-[#0d0e10] font-bold block mb-2">
                  Brand Voice & Persona
                </label>
                <select
                  value={brandVoice}
                  onChange={(e) => setBrandVoice(e.target.value)}
                  className="w-full bg-[#eeeee8] border border-[#dcdcd3] rounded-full px-4 py-2.5 text-xs text-[#0d0e10] focus:outline-none focus:border-[#0d0e10] focus:bg-white font-mono cursor-pointer transition-colors"
                >
                  <option value="Authoritative & Contrarian">Authoritative & Contrarian (Bold & High Status)</option>
                  <option value="Tactical & Playbook-Driven">Tactical & Playbook-Driven (Frameworks & Metrics)</option>
                  <option value="Warm & Educational">Warm & Educational (Approachable & Clear)</option>
                  <option value="Punchy & Minimalist">Punchy & Minimalist (Short sentences, High Contrast)</option>
                  <option value="Visionary Tech Executive">Visionary Tech Executive (Strategic & Forward-looking)</option>
                </select>
              </div>

              {/* Workflow Template */}
              <div>
                <label className="text-xs font-mono uppercase text-[#0d0e10] font-bold block mb-2">
                  Pipeline Recipe
                </label>
                <select
                  value={templateId}
                  onChange={(e) => setTemplateId(e.target.value)}
                  className="w-full bg-[#eeeee8] border border-[#dcdcd3] rounded-full px-4 py-2.5 text-xs text-[#0d0e10] focus:outline-none focus:border-[#0d0e10] focus:bg-white font-mono cursor-pointer transition-colors"
                >
                  <option value="omnichannel-360">Omnichannel 360 (All 6 Formats)</option>
                  <option value="viral-thought-leadership">Viral Thought Leadership (LinkedIn + X)</option>
                  <option value="product-launch-cascade">Product Launch & Changelog (SaaS GTM)</option>
                  <option value="video-audio-repurpose">Podcast & Video Script Factory</option>
                </select>
              </div>
            </div>

            {/* Custom Directives */}
            <div>
              <label className="text-xs font-mono uppercase text-[#0d0e10] font-bold block mb-2">
                Custom Directives (Optional)
              </label>
              <input
                type="text"
                value={customInstructions}
                onChange={(e) => setCustomInstructions(e.target.value)}
                placeholder="e.g. Include 1 surprising metric, keep sentences under 15 words"
                className="w-full bg-[#eeeee8] border border-[#dcdcd3] rounded-full px-4 py-2.5 text-xs text-[#0d0e10] placeholder-[#75766f] focus:outline-none focus:border-[#0d0e10] focus:bg-white font-sans transition-colors"
              />
            </div>

            {/* Execution Trigger Button & Quota Info */}
            <div className="pt-2 space-y-3">
              {currentUser && (
                <div className="p-3.5 rounded-2xl bg-[#eeeee8] border border-[#dcdcd3] flex items-center justify-between text-xs font-mono">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#d4ff3a]" />
                    <span className="text-[#0d0e10] font-semibold">
                      Account Tier: <span className="uppercase font-bold">{currentUser.tier}</span>
                    </span>
                    <span className="text-[#75766f]">
                      ({currentUser.runsUsedThisMonth} / {currentUser.monthlyQuota >= 9999 ? '∞' : currentUser.monthlyQuota} runs used)
                    </span>
                  </div>

                  {!currentUser.isSubscribed && onOpenUpgrade && (
                    <button
                      type="button"
                      onClick={onOpenUpgrade}
                      className="px-2.5 py-1 rounded-full bg-[#0d0e10] text-[#d4ff3a] hover:bg-black font-bold text-[10px] flex items-center gap-1 cursor-pointer"
                    >
                      <Crown className="w-3 h-3" />
                      <span>UNLOCK UNLIMITED</span>
                    </button>
                  )}
                </div>
              )}

              <button
                type="button"
                onClick={handleRun}
                disabled={
                  Boolean(
                    isRunning ||
                    !topic.trim() ||
                    (currentUser && !currentUser.isSubscribed && currentUser.runsUsedThisMonth >= currentUser.monthlyQuota)
                  )
                }
                className={`w-full py-4 rounded-full font-bold font-mono text-xs uppercase tracking-wider transition-all flex items-center justify-center space-x-2 shadow-sm cursor-pointer ${
                  isRunning
                    ? 'bg-[#dcdcd3] text-[#75766f] cursor-not-allowed shadow-none'
                    : currentUser && !currentUser.isSubscribed && currentUser.runsUsedThisMonth >= currentUser.monthlyQuota
                    ? 'bg-amber-100 text-amber-900 border border-amber-300'
                    : 'bg-[#d4ff3a] hover:bg-[#c6f02e] text-[#0d0e10] shadow-sm active:scale-[0.98] duration-150 btn-spring'
                }`}
              >
                {isRunning ? (
                  <>
                    <div className="w-4 h-4 border-2 border-[#0d0e10] border-t-transparent rounded-full animate-spin" />
                    <span>SYNTHESIZING WITH {activeModelObj.name.toUpperCase()}...</span>
                  </>
                ) : currentUser && !currentUser.isSubscribed && currentUser.runsUsedThisMonth >= currentUser.monthlyQuota ? (
                  <>
                    <Lock className="w-4 h-4" />
                    <span>FREE QUOTA REACHED (3/3 RUNS) · UPGRADE TO CONTINUE</span>
                  </>
                ) : (
                  <>
                    <Zap className="w-4 h-4 fill-current" />
                    <span>EXECUTE WORKFLOW VIA {activeModelObj.name.toUpperCase()} →</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Execution Telemetry & Steps */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white border border-[#dcdcd3] rounded-3xl p-6 shadow-xs space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-[#eeeee8]">
              <span className="text-xs font-mono uppercase text-[#0d0e10] font-bold">
                Pipeline Stages
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#eeeee8] text-[#0d0e10]">
                {activeModelObj.provider} Engine
              </span>
            </div>

            {/* Active Model Indicator Card */}
            <div className="p-3.5 rounded-2xl bg-[#eeeee8] border border-[#dcdcd3] space-y-1">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-[#75766f]">Target Model:</span>
                <span className="font-bold text-[#0d0e10]">{activeModelObj.name}</span>
              </div>
              <div className="flex items-center justify-between text-[11px] font-mono text-[#75766f]">
                <span>Speed: {activeModelObj.latency}</span>
                <span>Context: {activeModelObj.context}</span>
              </div>
            </div>

            {/* Step list */}
            <div className="space-y-2.5">
              {steps.map((st, i) => {
                const isStepActive = isRunning && currentStep === i + 1;
                const isStepCompleted = currentStep > i + 1 || (result && !isRunning);

                return (
                  <div
                    key={st.label}
                    className={`p-3.5 rounded-2xl border transition-all ${
                      isStepActive
                        ? 'bg-[#0d0e10] text-white border-[#0d0e10] shadow-xs'
                        : isStepCompleted
                        ? 'bg-[#eeeee8] border-[#dcdcd3]'
                        : 'bg-white border-[#dcdcd3] opacity-60'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2.5">
                        {isStepCompleted ? (
                          <CheckCircle2 className="w-4 h-4 text-[#0d0e10]" />
                        ) : isStepActive ? (
                          <div className="w-4 h-4 border-2 border-[#d4ff3a] border-t-transparent rounded-full animate-spin" />
                        ) : (
                          <div className="w-4 h-4 rounded-full border border-[#dcdcd3] flex items-center justify-center text-[9px] text-[#75766f] font-mono">
                            {i + 1}
                          </div>
                        )}
                        <span
                          className={`text-xs font-bold ${
                            isStepActive ? 'text-[#d4ff3a]' : isStepCompleted ? 'text-[#0d0e10]' : 'text-[#75766f]'
                          }`}
                        >
                          {st.label}
                        </span>
                      </div>
                      <span className={`text-[10px] font-mono ${isStepActive ? 'text-zinc-300' : 'text-[#75766f]'}`}>
                        {isStepCompleted ? 'Done' : isStepActive ? 'Running' : 'Queued'}
                      </span>
                    </div>
                    <p className={`text-[11px] mt-1 pl-6.5 font-sans ${isStepActive ? 'text-zinc-300' : 'text-[#75766f]'}`}>
                      {st.desc}
                    </p>
                  </div>
                );
              })}
            </div>

            {/* Quick Metrics of Latest Result if exists */}
            {result && (
              <div className="pt-4 border-t border-[#eeeee8] space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono uppercase text-[#0d0e10] font-bold">
                    Latest Run Metrics
                  </span>
                  <span className="text-[10px] font-mono text-[#75766f]">
                    {result.meta.modelName || activeModelObj.name}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="p-3 rounded-2xl bg-[#0d0e10] text-white border border-black">
                    <span className="text-zinc-400 block text-[10px] font-mono font-medium">Virality Score</span>
                    <span className="text-[#d4ff3a] font-black font-mono text-lg">
                      {result.scoring.viralityScore}/100
                    </span>
                  </div>
                  <div className="p-3 rounded-2xl bg-[#eeeee8] border border-[#dcdcd3]">
                    <span className="text-[#75766f] block text-[10px] font-mono font-medium">Hook Power</span>
                    <span className="text-[#0d0e10] font-black font-mono text-lg">
                      {result.scoring.hookPowerScore}/100
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={onViewResults}
                  className="w-full py-3 rounded-full bg-[#0d0e10] hover:bg-black text-[#d4ff3a] font-mono font-bold text-xs flex items-center justify-center space-x-1.5 transition-all cursor-pointer shadow-xs active:scale-95"
                >
                  <span>OPEN OMNICHANNEL HUB</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
