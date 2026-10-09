import React, { useState } from 'react';
import {
  ArrowRight,
  Sparkles,
  Zap,
  Globe,
  FileText,
  Video,
  Mail,
  Sliders,
  Check,
  Copy,
  Plus,
  Minus,
  Radio,
  Share2,
  Clock,
  Flame,
  Cpu,
  TrendingUp,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';

interface AwwwardsHomeProps {
  onLaunchStudio: () => void;
  onOpenConsultation: () => void;
  selectedModelId?: string;
  onSelectModel?: (modelId: string) => void;
  onSelectPlan?: (planTier: 'starter' | 'growth' | 'scale') => void;
}

export const AwwwardsHome: React.FC<AwwwardsHomeProps> = ({
  onLaunchStudio,
  onOpenConsultation,
  selectedModelId = 'claude-3-7-sonnet',
  onSelectModel,
  onSelectPlan,
}) => {
  // Hero Interactive Overlapping Cards State
  const [activeCardIndex, setActiveCardIndex] = useState<number>(0);
  const [activeTopicPreset, setActiveTopicPreset] = useState<number>(0);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Product Line Toggle State
  const [productMode, setProductMode] = useState<'studio' | 'webhooks'>('studio');

  // ROI Slider State
  const [monthlyVolume, setMonthlyVolume] = useState<number>(24);

  // FAQ Accordion State
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const topicPresets = [
    {
      label: 'AI Agent Teams',
      thesis: 'Autonomous AI agents are transforming software from tools you operate into digital coworkers that execute end-to-end workflows.',
      cards: [
        {
          channel: 'LINKEDIN',
          title: 'The Death of the SaaS Feature',
          content: `Most content teams burn 30+ hours a week manually reformatting the same idea across 5 open tabs.\n\nHere is how autonomous content workflows solve this:\n\n1. Ingest one high-signal founder insight or recording.\n2. Deconstruct the thesis into 3 distinct tension angles.\n3. Synthesize native channel syntax with Anthropic Claude, OpenAI, and Gemini multi-model routing.\n\nResult: 6 platform assets live in under 45 seconds. Automate the plumbing so you can focus on original thought.`,
          meta: '842 reactions · 148 comments',
          rotation: '-rotate-1',
          badge: 'THOUGHT LEADERSHIP',
        },
        {
          channel: 'TWITTER / X',
          title: '6-Tweet Velocity Thread',
          content: `1/ Most creators spend 80% of their time on formatting and 20% on ideas.\n\nFlip the ratio. Autonomous content workflows transform single insights into omnichannel distribution flywheels 🧵👇\n\n2/ Don't copy-paste: reframe the tension natively per channel.\n\n3/ Step 1: Extract the contrarian thesis.\n4/ Step 2: Native platform pacing.\n5/ Step 3: Algorithmic virality scoring.\n\n6/ Built with Javarif. Zero fluff.`,
          meta: '2.4k impressions · 92 retweets',
          rotation: 'rotate-1',
          badge: 'VIRAL THREAD',
        },
        {
          channel: 'YOUTUBE SHORTS',
          title: '45-Second Production Script',
          content: `[0:00 - 0:03] Quick cut on creator overwhelmed by 10 open browser tabs.\n"If you still write social posts one by one... you are wasting 20 hours every single week."\n\n[0:03 - 0:15] UI screen showing Javarif workflow graph firing.\n"Watch this: Drop in one thesis statement. The autonomous pipeline kicks off."\n\n[0:15 - 0:35] Split screen of LinkedIn, X, and Newsletter drafts.\n"Stop being a manual copywriter."`,
          meta: '45s pacing · Vertical 9:16',
          rotation: '-rotate-1',
          badge: 'VIDEO BEATS',
        },
        {
          channel: 'NEWSLETTER',
          title: 'Executive Dispatch Issue #42',
          content: `Hey Founder,\n\nLast week we audited 40 high-growth engineering teams. The average team spent 24.5 hours every week taking one idea and manually re-writing it for LinkedIn, X, Substack, and YouTube.\n\nThat is more than half an engineer's full work week.\n\nHere is how autonomous pipelines replace the plumbing with deterministic accuracy...`,
          meta: '58.4% open rate · 3 A/B subjects',
          rotation: 'rotate-1',
          badge: 'EMAIL ISSUE',
        },
      ],
    },
    {
      label: 'Outcome Pricing',
      thesis: 'Usage-based pricing is dead; outcome-based pricing is the future. Charging for seats punishes customers when software makes them more efficient.',
      cards: [
        {
          channel: 'LINKEDIN',
          title: 'Why SaaS Seats Are Broken',
          content: `Seat-based SaaS pricing is mathematically broken.\n\nWhen AI software makes your team 10x faster, seat counts drop. Traditional SaaS vendors get penalized for making their product more effective.\n\nOutcome-based pipelines align incentives: pay for the verified output, not the chair.`,
          meta: '1.2k reactions · 312 comments',
          rotation: '-rotate-1',
          badge: 'CONTRARIAN',
        },
        {
          channel: 'TWITTER / X',
          title: 'The Death of the Seat License',
          content: `1/ Why seat-based SaaS pricing is dying in 2026 🧵\n\nCharging for seats made sense when software was a typewriter.\nWhen software does the actual work, seat-based pricing is self-defeating.\n\n2/ The shift to outcome-verified work is already here.\n\n3/ Customers will only pay for completed jobs.`,
          meta: '4.8k impressions · 184 retweets',
          rotation: 'rotate-1',
          badge: 'DATA PLAYBOOK',
        },
        {
          channel: 'YOUTUBE SHORTS',
          title: 'Software Pricing Shockwave',
          content: `[0:00 - 0:04] Chart showing seat licenses dropping while AI compute explodes.\n"Here is why your favorite software tool is about to completely change how they charge you..."\n\n[0:04 - 0:25] Visual breakdown of seat vs outcome pricing.\n"Would you rather pay $50/user or $5 per completed task?"`,
          meta: '40s pacing · 9:16 format',
          rotation: '-rotate-1',
          badge: 'REELS/TIKTOK',
        },
        {
          channel: 'NEWSLETTER',
          title: 'SaaS Economics Breakdown',
          content: `Founder Dispatch,\n\nSoftware that automates end-to-end workflows cannot survive on a per-user pricing model. In this essay, we break down the unit economics of outcome-based distribution and why modern teams are leading the charge.`,
          meta: '62.1% open rate · 12 min read',
          rotation: 'rotate-1',
          badge: 'LONG ESSAY',
        },
      ],
    },
    {
      label: 'Async Culture',
      thesis: 'Status meetings are a symptom of broken documentation. High-output distributed teams use deterministic pipelines instead of 30-minute syncs.',
      cards: [
        {
          channel: 'LINKEDIN',
          title: 'Meetings Are Organizational Scar Tissue',
          content: `Your calendar is not full because you have too much work.\nYour calendar is full because your team lacks asynchronous documentation pipelines.\n\nReplace daily standups with automated execution logs. Give engineers uninterrupted deep focus.`,
          meta: '950 reactions · 204 comments',
          rotation: '-rotate-1',
          badge: 'CULTURE ESSAY',
        },
        {
          channel: 'TWITTER / X',
          title: 'The Async Engineering Memo',
          content: `1/ Status meetings are organizational scar tissue 🧵\n\nIf an update can be captured in a structured pipeline, it should never be a 30-minute meeting.\n\n2/ Here is our 3-step async cadence for distributed teams.\n\n3/ Rule 1: No verbal status updates.\n4/ Rule 2: Structured memos only.`,
          meta: '3.1k impressions · 112 retweets',
          rotation: 'rotate-1',
          badge: 'TACTICAL',
        },
        {
          channel: 'YOUTUBE SHORTS',
          title: 'Kill the 30-Minute Status Call',
          content: `[0:00 - 0:03] Split screen: 10 people on a silent Zoom call vs a clean automated briefing.\n"Stop scheduling 30-minute meetings for 2-minute updates. Here is the async system."\n\n[0:03 - 0:20] Fast walkthrough of the async workflow.\n"Ship updates asynchronously."`,
          meta: '35s pacing · 9:16 format',
          rotation: '-rotate-1',
          badge: 'QUICK TIP',
        },
        {
          channel: 'NEWSLETTER',
          title: 'Deep Work Operating System',
          content: `Team Leaders,\n\nHow high-output distributed engineering organizations eliminate 80% of synchronous status meetings using automated workflow graphs and structured memos. Read the full system breakdown below.`,
          meta: '64.5% open rate · 8 min read',
          rotation: 'rotate-1',
          badge: 'MANAGEMENT MEMO',
        },
      ],
    },
  ];

  const currentTopic = topicPresets[activeTopicPreset];

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  // ROI Math
  const hoursSaved = Math.round(monthlyVolume * 4.2);
  const costSavings = Math.round(hoursSaved * 65 * 12);
  const reachMult = (3.5 + monthlyVolume / 25).toFixed(1);

  const faqs = [
    {
      num: '01',
      q: 'How does Javarif prevent generic AI clichés and fluff?',
      category: 'Pipeline Architecture',
      a: 'Standard AI models output corporate jargon because they are prompted generically. Javarif utilizes a multi-stage deterministic graph: Stage 1 isolates the controversial thesis, Stage 2 enforces platform-native psychological pacing (whitespace on LinkedIn, rapid punchlines on X, screenplay cues for video), and Stage 3 executes an automated anti-slop audit that strips filler words before publishing.',
    },
    {
      num: '02',
      q: 'Which distribution channels are synchronized in one run?',
      category: 'Omnichannel Outputs',
      a: 'Every single workflow execution simultaneously outputs 6 tailored formats: LinkedIn Thought Leadership, Twitter/X Multi-Tweet Threads, SEO Long-Form Pillar Essays (Markdown + Meta), YouTube Shorts / TikTok Screenplay beats, Subscriber Email Newsletters (with 3 A/B subject lines), and 5-Slide Carousel Decks.',
    },
    {
      num: '03',
      q: 'Can we connect this to our existing CMS or Notion?',
      category: 'Integrations & Webhooks',
      a: 'Yes. Javarif provides a live inbound webhook endpoint (/api/triggers/simulate) that listens 24/7. You can connect Ghost CMS, Substack RSS, GitHub Releases, Notion databases, or Zapier/Make webhooks to initiate full-pipeline generation hands-free.',
    },
    {
      num: '04',
      q: 'Which AI models power the engine?',
      category: 'Multi-Model Architecture',
      a: 'Javarif is model-agnostic. You can execute workflows via Anthropic Claude 3.7 Sonnet & 3.5 Haiku, OpenAI GPT-4o & GPT-4.5, DeepSeek R1, or Google Gemini — or enable our Auto-Routing Ensemble that allocates the optimal model for each channel (Claude for authoritative long-form, GPT-4o for viral hooks & visual prompts, Gemini for sub-second velocity).',
    },
    {
      num: '05',
      q: 'How does brand voice calibration work?',
      category: 'Brand Governance',
      a: 'You can choose from pre-calibrated editorial personas (Authoritative & Contrarian, Tactical Playbook, Warm Educational, Punchy Minimalist, Visionary Tech Executive) or provide custom directives such as specific vocabulary constraints, sentence length targets, and tone guidelines.',
    },
    {
      num: '06',
      q: 'How does reporting and virality scoring work?',
      category: 'Analytics',
      a: 'Every generated campaign is graded with an algorithmic virality index (0-100), tension score, reading grade level, and estimated audience reach before export.',
    },
  ];

  return (
    <div className="space-y-32 py-8 overflow-hidden">
      {/* 1. HERO SECTION (REACHWISE BONE CANVAS + ACID LIME ACCENTS) */}
      <section className="relative max-w-7xl mx-auto px-6">
        {/* Subtle Ambient Reachwise Glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[850px] h-[400px] bg-gradient-to-tr from-[#d4ff3a]/18 via-[#dcdcd3]/30 to-white/40 rounded-full blur-[130px] pointer-events-none -z-10 animate-pulse-glow" />

        <div className="max-w-5xl mx-auto text-center space-y-7">
          {/* Reachwise Live Kicker Badge */}
          <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-white border border-[#dcdcd3] shadow-xs text-xs font-mono tracking-wider text-[#0d0e10] animate-float-slow">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#d4ff3a] opacity-80" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#d4ff3a]" />
            </span>
            <span className="font-bold text-[#0d0e10]">NOW LIVE</span>
            <span className="text-[#dcdcd3]">·</span>
            <span className="text-[#75766f]">Autonomous Content Engine v2.4</span>
          </div>

          {/* Confident Editorial Headline */}
          <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-[84px] font-extrabold tracking-tight text-[#0d0e10] font-heading leading-[0.98]">
            Get seen by{' '}
            <span className="relative inline-block text-[#0d0e10]">
              <span className="relative z-10 underline decoration-[#d4ff3a] decoration-4 underline-offset-8">
                the right crowd.
              </span>
            </span>
          </h1>

          {/* Sub-proposition in Reachwise stone gray */}
          <p className="text-base sm:text-lg text-[#75766f] max-w-2xl mx-auto font-sans leading-relaxed">
            Turn one high-signal insight, voice memo, or keynote into six synchronized omnichannel campaigns. Built for founders, operators, and high-velocity content teams.
          </p>

          {/* Reachwise Dual Pill Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 pt-2">
            <button
              onClick={onLaunchStudio}
              className="w-full sm:w-auto px-8 py-4 text-xs font-mono font-bold uppercase tracking-wider text-[#0d0e10] bg-[#d4ff3a] hover:bg-[#c6f02e] transition-all rounded-full shadow-sm hover:shadow-md flex items-center justify-center gap-2 cursor-pointer active:scale-95 duration-150 btn-spring"
            >
              <span>LAUNCH PIPELINE STUDIO</span>
              <ArrowRight className="w-4 h-4 stroke-[2.5]" />
            </button>
            <button
              onClick={onOpenConsultation}
              className="w-full sm:w-auto px-8 py-4 text-xs font-mono font-semibold text-[#0d0e10] bg-white hover:bg-white/90 border border-[#dcdcd3] hover:border-[#0d0e10] rounded-full transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer active:scale-95"
            >
              <span>BOOK A STRATEGY CALL</span>
            </button>
          </div>

          {/* Reachwise Tabular Stats Strip */}
          <div className="pt-6 flex flex-wrap items-center justify-center gap-8 text-xs font-mono text-[#75766f]">
            <div className="flex items-center gap-2">
              <span className="text-[#0d0e10] font-extrabold text-sm">140+</span>
              <span>BRANDS ON RADAR</span>
            </div>
            <span className="text-[#dcdcd3]">/</span>
            <div className="flex items-center gap-2">
              <span className="text-[#0d0e10] font-extrabold text-sm">4.2M</span>
              <span>PEOPLE REACHED</span>
            </div>
            <span className="text-[#dcdcd3]">/</span>
            <div className="flex items-center gap-2">
              <span className="text-[#0d0e10] font-extrabold text-sm">78%</span>
              <span>HOURS SAVED</span>
            </div>
            <span className="text-[#dcdcd3]">/</span>
            <div className="flex items-center gap-2">
              <span className="text-[#0d0e10] font-extrabold text-sm">1.4s</span>
              <span>SYNTHESIS SPEED</span>
            </div>
          </div>
        </div>

        {/* 2. OVERLAPPING CONTENT CARDS DECK (PORCELAIN WHITE + ACID LIME BADGES) */}
        <div className="mt-14 max-w-6xl mx-auto space-y-6">
          {/* Preset Selector with Pill Tabs */}
          <div className="flex items-center justify-center gap-2 flex-wrap">
            <span className="text-xs font-mono text-[#75766f] mr-2">[SAMPLE SEEDS]:</span>
            {topicPresets.map((pr, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setActiveTopicPreset(idx);
                  setActiveCardIndex(0);
                }}
                className={`px-4 py-2 rounded-full text-xs font-mono transition-all cursor-pointer ${
                  activeTopicPreset === idx
                    ? 'bg-[#0d0e10] text-[#d4ff3a] font-bold shadow-sm'
                    : 'bg-white text-[#75766f] hover:text-[#0d0e10] border border-[#dcdcd3]'
                }`}
              >
                {pr.label}
              </button>
            ))}
          </div>

          {/* Reachwise Porcelain Cards Deck */}
          <div className="relative pt-4 pb-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {currentTopic.cards.map((card, idx) => {
                const isActive = activeCardIndex === idx;

                return (
                  <div
                    key={idx}
                    onClick={() => setActiveCardIndex(idx)}
                    className={`relative p-5 sm:p-6 rounded-3xl border transition-all duration-300 cursor-pointer flex flex-col justify-between sm:${
                      card.rotation
                    } rotate-0 ${
                      isActive
                        ? 'bg-white border-[#0d0e10] ring-2 ring-[#d4ff3a] shadow-xl -translate-y-1 sm:-translate-y-2 z-20 scale-[1.01] sm:scale-[1.02]'
                        : 'bg-white border-[#dcdcd3] hover:border-[#0d0e10] z-10 shadow-sm hover:shadow-md hover:-translate-y-1'
                    }`}
                  >
                    <div className="space-y-4">
                      {/* Top Header */}
                      <div className="flex items-center justify-between pb-3 border-b border-[#eeeee8]">
                        <span className="text-[11px] font-mono font-bold text-[#0d0e10] tracking-wider">
                          [{card.channel}]
                        </span>
                        <span className={`text-[10px] font-mono px-2.5 py-0.5 rounded-full font-bold ${
                          isActive
                            ? 'bg-[#d4ff3a] text-[#0d0e10]'
                            : 'bg-[#eeeee8] text-[#75766f]'
                        }`}>
                          {card.badge}
                        </span>
                      </div>

                      <h3 className="text-base font-bold text-[#0d0e10] font-heading leading-tight">
                        {card.title}
                      </h3>

                      <p className="text-xs text-[#75766f] leading-relaxed font-sans line-clamp-6 whitespace-pre-line">
                        {card.content}
                      </p>
                    </div>

                    <div className="pt-4 border-t border-[#eeeee8] flex items-center justify-between mt-4">
                      <span className="text-[10px] font-mono text-[#75766f] truncate max-w-[140px]">
                        {card.meta}
                      </span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleCopy(card.content, `card-${idx}`);
                        }}
                        className="text-[#75766f] hover:text-[#0d0e10] p-1.5 rounded-full hover:bg-[#eeeee8] transition-colors"
                        title="Copy content"
                      >
                        {copiedKey === `card-${idx}` ? (
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Quick Trigger CTA under the deck */}
            <div className="mt-8 text-center">
              <button
                onClick={onLaunchStudio}
                className="inline-flex items-center gap-2 text-xs font-mono font-bold text-[#0d0e10] hover:text-[#75766f] transition-colors cursor-pointer group bg-white border border-[#dcdcd3] px-5 py-2.5 rounded-full shadow-2xs"
              >
                <span>OPEN THIS CAMPAIGN IN FULL STUDIO RUNNER</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 2. REACHWISE DARK TICKER WITH LIME BULLETS */}
      <div className="w-full bg-[#0d0e10] text-white font-mono font-medium text-xs uppercase tracking-widest py-3.5 overflow-hidden select-none whitespace-nowrap shadow-md">
        <div className="animate-marquee-slow flex items-center gap-8">
          <span className="text-[#d4ff3a] font-bold">AUTONOMOUS CONTENT PIPELINES</span>
          <span className="text-[#d4ff3a]">●</span>
          <span>MULTI-MODEL ENGINE // ANTHROPIC CLAUDE • OPENAI • DEEPSEEK • GEMINI</span>
          <span className="text-[#d4ff3a]">●</span>
          <span>SIX CHANNELS SYNCHRONIZED</span>
          <span className="text-[#d4ff3a]">●</span>
          <span>ZERO CORPORATE FLUFF</span>
          <span className="text-[#d4ff3a]">●</span>
          <span>LINKEDIN · X · YOUTUBE · NEWSLETTER · BLOG</span>
          <span className="text-[#d4ff3a]">●</span>
          <span>DETERMINISTIC BRAND FIDELITY</span>
          <span className="text-[#d4ff3a]">●</span>
          <span>SUB-2S LATENCY</span>
          <span className="text-[#d4ff3a]">●</span>
          <span className="text-[#d4ff3a] font-bold">AUTONOMOUS CONTENT PIPELINES</span>
          <span className="text-[#d4ff3a]">●</span>
          <span>MULTI-MODEL ENGINE // ANTHROPIC CLAUDE • OPENAI • DEEPSEEK • GEMINI</span>
        </div>
      </div>

      {/* 3. PLATFORM CAPABILITIES ("Six channels. One growth plan.") */}
      <section id="capabilities" className="max-w-7xl mx-auto px-6 space-y-12">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 border-b border-[#dcdcd3] pb-8">
          <div className="space-y-3">
            <span className="text-xs font-mono text-[#0d0e10] tracking-widest font-bold">
              [02 // PLATFORM CAPABILITIES]
            </span>
            <h2 className="text-3xl sm:text-5xl font-black text-[#0d0e10] font-heading tracking-tight">
              Six channels. One growth plan.
            </h2>
          </div>

          {/* Segmented Switcher */}
          <div className="flex items-center gap-1 p-1 bg-white border border-[#dcdcd3] rounded-full shadow-2xs">
            <button
              onClick={() => setProductMode('studio')}
              className={`px-4 py-2 text-xs font-mono font-bold uppercase transition-all rounded-full cursor-pointer ${
                productMode === 'studio'
                  ? 'bg-[#0d0e10] text-[#d4ff3a] shadow-sm'
                  : 'text-[#75766f] hover:text-[#0d0e10]'
              }`}
            >
              [01] THE STUDIO (ON-DEMAND)
            </button>
            <button
              onClick={() => setProductMode('webhooks')}
              className={`px-4 py-2 text-xs font-mono font-bold uppercase transition-all rounded-full cursor-pointer ${
                productMode === 'webhooks'
                  ? 'bg-[#0d0e10] text-[#d4ff3a] shadow-sm'
                  : 'text-[#75766f] hover:text-[#0d0e10]'
              }`}
            >
              [02] ENTERPRISE WEBHOOKS
            </button>
          </div>
        </div>

        {productMode === 'studio' ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="p-8 rounded-3xl bg-white border border-[#dcdcd3] space-y-6 flex flex-col justify-between rw-card">
              <div className="space-y-4">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#eeeee8] text-xs font-mono font-bold text-[#0d0e10]">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#0d0e10]" />
                  <span>ON-DEMAND SEED</span>
                </div>
                <h3 className="text-2xl font-bold text-[#0d0e10] font-heading">
                  Paste One Thesis. Get Six Formats.
                </h3>
                <p className="text-xs text-[#75766f] leading-relaxed font-sans">
                  Drop in a raw voice note transcription, executive thesis, or product release note. The studio decomposes the argument and writes tailored copy for every channel simultaneously.
                </p>
              </div>
              <div className="p-4 rounded-2xl bg-[#eeeee8] border border-[#dcdcd3] font-mono text-xs text-[#0d0e10] space-y-2">
                <div className="font-bold text-[#0d0e10]">Supported Formats:</div>
                <div className="flex items-center gap-2 text-[#0d0e10]">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#d4ff3a]" />
                  <span>LinkedIn Thought Leadership</span>
                </div>
                <div className="flex items-center gap-2 text-[#75766f]">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#75766f]" />
                  <span>Twitter/X Velocity Thread</span>
                </div>
                <div className="flex items-center gap-2 text-[#75766f]">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#75766f]" />
                  <span>Long-Form SEO Article</span>
                </div>
                <div className="flex items-center gap-2 text-[#75766f]">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#75766f]" />
                  <span>YouTube Shorts Screenplay Beats</span>
                </div>
              </div>
            </div>

            {/* Reachwise High-Contrast Dark Bento Card */}
            <div className="lg:col-span-2 p-8 sm:p-10 rounded-3xl bg-[#0d0e10] text-white border border-white/10 space-y-6 flex flex-col justify-between shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-80 h-80 bg-[#d4ff3a]/10 rounded-full blur-3xl pointer-events-none" />

              <div className="space-y-4 relative z-10">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-xs font-mono font-bold text-[#d4ff3a]">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#d4ff3a] animate-ping" />
                  <span>PARALLEL SYNTHESIZER ENGINE</span>
                </div>
                <h3 className="text-2xl sm:text-3xl font-extrabold font-heading text-white">
                  Multi-Model Autonomous Orchestrator
                </h3>
                <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed font-sans max-w-xl">
                  Executes with sub-2 second latency using our full-stack model routing architecture. No prompt engineering required: inputs are structured into atomic claim-data-impact triads with algorithmic virality audits across frontier models.
                </p>
              </div>

              <div className="grid grid-cols-3 gap-2 sm:gap-4 pt-6 border-t border-white/10 relative z-10">
                <div className="p-3 sm:p-4 rounded-2xl bg-white/5 border border-white/10">
                  <span className="text-xl sm:text-3xl font-black text-white font-mono block">1.4s</span>
                  <span className="text-[10px] sm:text-[11px] font-mono text-zinc-400">Average Runtime</span>
                </div>
                <div className="p-3 sm:p-4 rounded-2xl bg-[#d4ff3a]/15 border border-[#d4ff3a]/30">
                  <span className="text-xl sm:text-3xl font-black text-[#d4ff3a] font-mono block">94%</span>
                  <span className="text-[10px] sm:text-[11px] font-mono text-[#d4ff3a]">Virality Index</span>
                </div>
                <div className="p-3 sm:p-4 rounded-2xl bg-white/5 border border-white/10">
                  <span className="text-xl sm:text-3xl font-black text-white font-mono block">6</span>
                  <span className="text-[10px] sm:text-[11px] font-mono text-zinc-400">Channels Live</span>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 p-8 rounded-3xl bg-white border border-[#dcdcd3] space-y-6 flex flex-col justify-between rw-card">
              <div className="space-y-4">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#eeeee8] text-xs font-mono font-bold text-[#0d0e10]">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#0d0e10]" />
                  <span>EVENT-DRIVEN DISPATCH</span>
                </div>
                <h3 className="text-2xl font-bold text-[#0d0e10] font-heading">
                  Continuous Publishing From Your Existing Stack
                </h3>
                <p className="text-xs text-[#75766f] leading-relaxed font-sans max-w-xl">
                  Configure real-time listeners for Substack RSS feeds, Ghost CMS publications, GitHub product releases, or Notion databases. When you hit publish in your primary tool, Javarif triggers the entire distribution graph hands-free.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-[#0d0e10] text-[#d4ff3a] border border-black font-mono text-xs">
                <span className="text-white font-bold">POST</span> /api/triggers/simulate <br />
                <span className="text-zinc-400">Payload: {`{ "source": "Ghost CMS", "event": "article_published" }`}</span>
              </div>
            </div>

            <div className="p-8 rounded-3xl bg-white border border-[#dcdcd3] space-y-6 flex flex-col justify-between rw-card">
              <div className="space-y-4">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#eeeee8] text-xs font-mono font-bold text-[#0d0e10]">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#0d0e10]" />
                  <span>WEBHOOK CADENCE</span>
                </div>
                <h3 className="text-2xl font-bold text-[#0d0e10] font-heading">
                  Webhook Connectors
                </h3>
                <p className="text-xs text-[#75766f] leading-relaxed font-sans">
                  Ready to link directly into Buffer, Hootsuite, Make.com, Zapier, or custom Discord and Slack notification channels.
                </p>
              </div>

              <button
                onClick={onLaunchStudio}
                className="w-full py-3.5 rounded-full bg-[#d4ff3a] hover:bg-[#c6f02e] text-[#0d0e10] font-mono text-xs font-bold transition-all cursor-pointer shadow-sm active:scale-95 duration-150 uppercase"
              >
                TEST WEBHOOK SIMULATOR →
              </button>
            </div>
          </div>
        )}
      </section>

      {/* 4. THE 4-STAGE MECHANISM ("From attention to clients.") */}
      <section id="mechanism" className="max-w-7xl mx-auto px-6 space-y-12">
        <div className="space-y-3 max-w-2xl">
          <span className="text-xs font-mono text-[#0d0e10] tracking-widest font-bold">
            [03 // HOW IT WORKS]
          </span>
          <h2 className="text-3xl sm:text-5xl font-black text-[#0d0e10] font-heading tracking-tight">
            From raw idea to clients.
          </h2>
          <p className="text-xs text-[#75766f] leading-relaxed font-sans">
            How Javarif routes raw thinking through discrete semantic nodes to guarantee voice fidelity and high engagement.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              num: '01',
              title: 'AUDIT & INGEST',
              tag: 'Week 1 / Instant',
              subtitle: 'Thesis & Tension Extraction',
              desc: 'Takes raw transcripts or memos, removes filler words, and isolates the single most memorable thesis statement with 3 tension angles.',
            },
            {
              num: '02',
              title: 'SYNTHESIZE',
              tag: 'Week 2–3 / Automated',
              subtitle: 'Native Channel Formatting',
              desc: 'Multi-model synthesis generates platform-native syntax tailored to each channel with zero corporate fluff and precise voice alignment.',
            },
            {
              num: '03',
              title: 'OPTIMISE',
              tag: 'Month 2 / Algorithmic',
              subtitle: 'Anti-Slop Quality Gate',
              desc: 'Checks readability grade, virality scoring index, and enforces chosen brand tone (Contrarian, Tactical, Minimalist).',
            },
            {
              num: '04',
              title: 'SCALE',
              tag: 'Month 3+ / Hands-free',
              subtitle: 'Cadence & Webhook Output',
              desc: 'Packages ready-to-publish assets with 1-click clipboard, markdown download, and direct automated queue scheduling.',
            },
          ].map((step, i) => (
            <div
              key={i}
              className="p-8 rounded-3xl bg-white border border-[#dcdcd3] space-y-6 flex flex-col justify-between rw-card hover:border-[#0d0e10] transition-all"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-black font-mono text-[#0d0e10]">
                    [{step.num}]
                  </span>
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-[#eeeee8] text-[#0d0e10]">
                    {step.tag}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-[#0d0e10] font-heading uppercase">
                  {step.title}
                </h3>
                <span className="text-xs font-mono text-[#75766f] block font-semibold">
                  {step.subtitle}
                </span>
                <p className="text-xs text-[#75766f] leading-relaxed font-sans pt-1">
                  {step.desc}
                </p>
              </div>

              <div className="pt-4 border-t border-[#eeeee8] flex items-center justify-between text-[11px] font-mono text-[#75766f]">
                <span>STAGE {step.num} OF 04</span>
                <span className="text-[#0d0e10] font-bold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#d4ff3a]" />
                  VERIFIED
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 5. INTERACTIVE VELOCITY & ROI CALCULATOR ("Results you can count.") */}
      <section id="calculator" className="max-w-7xl mx-auto px-6">
        <div className="p-8 sm:p-14 rounded-3xl bg-white border border-[#dcdcd3] shadow-sm grid grid-cols-1 lg:grid-cols-12 gap-10 items-center relative overflow-hidden">
          <div className="lg:col-span-6 space-y-6">
            <span className="text-xs font-mono text-[#0d0e10] tracking-widest font-bold">
              [04 // VELOCITY CALCULATOR]
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0d0e10] font-heading tracking-tight">
              Results you can count.
            </h2>
            <p className="text-xs sm:text-sm text-[#75766f] leading-relaxed font-sans">
              Replacing manual copywriting cycles with an autonomous content graph reclaims founder and engineering hours while multiplying touchpoints across 6 platforms.
            </p>

            {/* Slider */}
            <div className="space-y-3 pt-3">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-[#75766f]">MONTHLY CONTENT VOLUME:</span>
                <span className="text-[#0d0e10] font-bold text-sm bg-[#d4ff3a] px-3 py-1 rounded-full">
                  {monthlyVolume} PIECES / MO
                </span>
              </div>
              <input
                type="range"
                min="6"
                max="80"
                value={monthlyVolume}
                onChange={(e) => setMonthlyVolume(parseInt(e.target.value, 10))}
                className="w-full accent-[#0d0e10] h-2 bg-[#eeeee8] rounded-full cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-[#75766f] font-mono">
                <span>6 (SOLO FOUNDER)</span>
                <span>35 (GROWTH TEAM)</span>
                <span>80 (CONTENT ENGINE)</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-6 rounded-2xl bg-[#eeeee8] border border-[#dcdcd3] space-y-2">
              <span className="text-[11px] font-mono text-[#75766f] block">HOURS SAVED</span>
              <span className="text-3xl font-black text-[#0d0e10] font-mono block tabular-nums">
                {hoursSaved}h
              </span>
              <span className="text-[11px] text-[#75766f] block">Every month</span>
            </div>

            <div className="p-6 rounded-2xl bg-[#0d0e10] text-white border border-black space-y-2">
              <span className="text-[11px] font-mono text-[#d4ff3a] block font-bold">ANNUAL SAVINGS</span>
              <span className="text-3xl font-black text-[#d4ff3a] font-mono block tabular-nums">
                ${(costSavings / 1000).toFixed(0)}k
              </span>
              <span className="text-[11px] text-zinc-400 block">Editorial payroll</span>
            </div>

            <div className="p-6 rounded-2xl bg-[#eeeee8] border border-[#dcdcd3] space-y-2">
              <span className="text-[11px] font-mono text-[#75766f] block">REACH MULTIPLIER</span>
              <span className="text-3xl font-black text-[#0d0e10] font-mono block tabular-nums">
                {reachMult}x
              </span>
              <span className="text-[11px] text-[#75766f] block">Omnichannel reach</span>
            </div>
          </div>
        </div>
      </section>

      {/* 6. REACHWISE PRICING RETAINERS ("Simple monthly retainers.") */}
      <section id="pricing" className="max-w-7xl mx-auto px-6 space-y-12">
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <span className="text-xs font-mono text-[#0d0e10] tracking-widest font-bold">
            [05 // INVESTMENT]
          </span>
          <h2 className="text-3xl sm:text-5xl font-black text-[#0d0e10] font-heading tracking-tight">
            Simple monthly retainers.
          </h2>
          <p className="text-xs sm:text-sm text-[#75766f] leading-relaxed font-sans">
            Transparent pricing designed for compounding omnichannel reach. No hidden setup fees or rigid contracts.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Starter Plan */}
          <div className="p-8 rounded-3xl bg-white border border-[#dcdcd3] space-y-6 flex flex-col justify-between rw-card">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-[#75766f] uppercase">STARTER</span>
                <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-[#eeeee8] text-[#0d0e10] font-bold">
                  FOUNDERS
                </span>
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-extrabold text-[#0d0e10] font-mono">$2,400</span>
                <span className="text-xs font-mono text-[#75766f]">/ month</span>
              </div>
              <p className="text-xs text-[#75766f] leading-relaxed">
                For solo founders and boutique operators looking to maintain high-signal authority on 4 core channels.
              </p>
              <ul className="space-y-2.5 pt-2 text-xs font-mono text-[#0d0e10]">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#0d0e10]" />
                  <span>15 synchronized campaign drops</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#0d0e10]" />
                  <span>LinkedIn, X, Newsletter, SEO</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#0d0e10]" />
                  <span>Multi-model frontier runner pipeline</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#0d0e10]" />
                  <span>Anti-slop quality audit gate</span>
                </li>
              </ul>
            </div>

            <button
              onClick={() => (onSelectPlan ? onSelectPlan('starter') : onLaunchStudio())}
              className="w-full py-3.5 rounded-full bg-white hover:bg-[#eeeee8] text-[#0d0e10] border border-[#dcdcd3] font-mono text-xs font-bold transition-all cursor-pointer shadow-2xs"
            >
              CHOOSE STARTER
            </button>
          </div>

          {/* Growth Plan (Featured Reachwise Dark Card!) */}
          <div className="p-8 sm:p-10 rounded-3xl bg-[#0d0e10] text-white border border-white/10 space-y-6 flex flex-col justify-between shadow-2xl relative overflow-hidden scale-[1.02]">
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#d4ff3a]/15 rounded-full blur-3xl pointer-events-none" />

            <div className="space-y-4 relative z-10">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-[#d4ff3a] uppercase">GROWTH</span>
                <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-[#d4ff3a] text-[#0d0e10] font-bold">
                  MOST POPULAR
                </span>
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-extrabold text-white font-mono">$4,800</span>
                <span className="text-xs font-mono text-zinc-400">/ month</span>
              </div>
              <p className="text-xs text-zinc-300 leading-relaxed">
                For growth-stage venture teams and media brands dominating 6 synchronized distribution channels.
              </p>
              <ul className="space-y-2.5 pt-2 text-xs font-mono text-zinc-200">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#d4ff3a]" />
                  <span>Unlimited monthly campaigns</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#d4ff3a]" />
                  <span>All 6 channels + Carousel decks</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#d4ff3a]" />
                  <span>Real-time inbound webhooks</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#d4ff3a]" />
                  <span>Automated distribution cadence</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#d4ff3a]" />
                  <span>Sub-2 second execution latency</span>
                </li>
              </ul>
            </div>

            <button
              onClick={() => (onSelectPlan ? onSelectPlan('growth') : onLaunchStudio())}
              className="w-full py-3.5 rounded-full bg-[#d4ff3a] hover:bg-[#c6f02e] text-[#0d0e10] font-mono text-xs font-bold transition-all cursor-pointer shadow-md btn-spring relative z-10"
            >
              LAUNCH WITH GROWTH →
            </button>
          </div>

          {/* Scale Plan */}
          <div className="p-8 rounded-3xl bg-white border border-[#dcdcd3] space-y-6 flex flex-col justify-between rw-card">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-[#75766f] uppercase">SCALE</span>
                <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-[#eeeee8] text-[#0d0e10] font-bold">
                  ENTERPRISE
                </span>
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-extrabold text-[#0d0e10] font-mono">$8,500</span>
                <span className="text-xs font-mono text-[#75766f]">/ month</span>
              </div>
              <p className="text-xs text-[#75766f] leading-relaxed">
                For multi-product portfolios, media houses, and executive suites requiring custom agent calibration.
              </p>
              <ul className="space-y-2.5 pt-2 text-xs font-mono text-[#0d0e10]">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#0d0e10]" />
                  <span>Multi-brand brand voice profiles</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#0d0e10]" />
                  <span>Dedicated custom webhooks</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#0d0e10]" />
                  <span>Ghost & Substack automated sync</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#0d0e10]" />
                  <span>Dedicated prompt engineering partner</span>
                </li>
              </ul>
            </div>

            <button
              onClick={onOpenConsultation}
              className="w-full py-3.5 rounded-full bg-white hover:bg-[#eeeee8] text-[#0d0e10] border border-[#dcdcd3] font-mono text-xs font-bold transition-all cursor-pointer shadow-2xs"
            >
              TALK TO AN ARCHITECT
            </button>
          </div>
        </div>
      </section>

      {/* 7. QUESTIONS, ANSWERED (REACHWISE FAQ ACCORDION) */}
      <section id="faq" className="max-w-4xl mx-auto px-6 space-y-8">
        <div className="text-center space-y-2">
          <span className="text-xs font-mono text-[#0d0e10] tracking-widest font-bold">
            [06 // INQUIRIES]
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0d0e10] font-heading tracking-tight">
            Questions, answered.
          </h2>
        </div>

        <div className="space-y-3 pt-4">
          {faqs.map((faq, i) => {
            const isOpen = openFaqIndex === i;

            return (
              <div
                key={i}
                className="rounded-3xl bg-white border border-[#dcdcd3] shadow-xs overflow-hidden transition-all duration-200"
              >
                <button
                  onClick={() => setOpenFaqIndex(isOpen ? null : i)}
                  className="w-full p-6 text-left flex items-center justify-between gap-4 cursor-pointer hover:bg-[#eeeee8]/50 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <span className="text-xs font-mono font-bold text-[#75766f]">
                      {faq.num}
                    </span>
                    <span className="text-sm font-bold text-[#0d0e10] font-sans">
                      {faq.q}
                    </span>
                  </div>
                  <div
                    className={`w-8 h-8 rounded-full border flex items-center justify-center transition-all ${
                      isOpen
                        ? 'bg-[#0d0e10] text-[#d4ff3a] border-[#0d0e10] rotate-180'
                        : 'bg-[#eeeee8] border-[#dcdcd3] text-[#0d0e10]'
                    }`}
                  >
                    {isOpen ? <Minus className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                  </div>
                </button>

                {isOpen && (
                  <div className="px-6 pb-6 pt-1 text-xs text-[#75766f] leading-relaxed font-sans border-t border-[#eeeee8]">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* 8. REACHWISE CALL TO ACTION ("Ready to be seen?") */}
      <section className="max-w-5xl mx-auto px-6">
        <div className="p-10 sm:p-16 rounded-[2.5rem] bg-[#0d0e10] text-white border border-white/10 shadow-2xl text-center space-y-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#d4ff3a]/15 rounded-full blur-3xl pointer-events-none" />
          <div className="max-w-2xl mx-auto space-y-4 relative z-10">
            <span className="text-xs font-mono text-[#d4ff3a] tracking-widest font-bold">
              [GET STARTED NOW]
            </span>
            <h2 className="text-3xl sm:text-5xl font-extrabold text-white font-heading tracking-tight leading-tight">
              Ready to be seen?
            </h2>
            <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed font-sans max-w-xl mx-auto">
              Transform single insights into 6 native, synchronized distribution channels. Experience autonomous content workflows in the live studio.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4 relative z-10">
            <button
              onClick={onLaunchStudio}
              className="w-full sm:w-auto px-8 py-4 text-xs font-mono font-bold uppercase tracking-wider text-[#0d0e10] bg-[#d4ff3a] hover:bg-[#c6f02e] transition-all rounded-full shadow-lg flex items-center justify-center gap-2 cursor-pointer active:scale-95 duration-150 btn-spring"
            >
              <span>LAUNCH PIPELINE STUDIO</span>
              <ArrowRight className="w-4 h-4 stroke-[2.5]" />
            </button>
            <button
              onClick={onOpenConsultation}
              className="w-full sm:w-auto px-8 py-4 text-xs font-mono tracking-wider text-white hover:text-white bg-white/10 hover:bg-white/20 border border-white/20 rounded-full transition-all flex items-center justify-center cursor-pointer active:scale-95"
            >
              <span>BOOK A STRATEGY CALL</span>
            </button>
          </div>
        </div>
      </section>

      {/* 9. REACHWISE EDITORIAL FOOTER */}
      <footer className="border-t border-[#dcdcd3] pt-16 pb-12 text-xs text-[#75766f] bg-[#eeeee8] relative overflow-hidden">
        <div className="relative max-w-7xl mx-auto px-6 space-y-12">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
            <div className="col-span-2 space-y-4">
              <span className="text-2xl font-black text-[#0d0e10] font-heading tracking-tight block">
                JAVARIF
              </span>
              <p className="text-xs text-[#75766f] max-w-sm leading-relaxed font-sans">
                Autonomous AI content workflows and omnichannel distribution pipelines for modern growth teams and technical founders.
              </p>
              <div className="text-[11px] text-[#75766f] font-mono">
                SAN FRANCISCO · LONDON · SINGAPORE · [SYS.3.8]
              </div>
            </div>

            <div className="space-y-3 font-mono">
              <span className="text-xs font-bold text-[#0d0e10] block">[ENGINE]</span>
              <ul className="space-y-2">
                <li><button onClick={onLaunchStudio} className="hover:text-[#0d0e10] transition-colors cursor-pointer">PIPELINE STUDIO</button></li>
                <li><a href="#mechanism" className="hover:text-[#0d0e10] transition-colors">WORKFLOW GRAPH</a></li>
                <li><a href="#calculator" className="hover:text-[#0d0e10] transition-colors">VELOCITY CALCULATOR</a></li>
                <li><button onClick={onLaunchStudio} className="hover:text-[#0d0e10] transition-colors cursor-pointer">OMNICHANNEL HUB</button></li>
              </ul>
            </div>

            <div className="space-y-3 font-mono">
              <span className="text-xs font-bold text-[#0d0e10] block">[INTEGRATIONS]</span>
              <ul className="space-y-2">
                <li><button onClick={onLaunchStudio} className="hover:text-[#0d0e10] transition-colors cursor-pointer">INBOUND WEBHOOKS</button></li>
                <li><button onClick={onLaunchStudio} className="hover:text-[#0d0e10] transition-colors cursor-pointer">SUBSTACK & GHOST RSS</button></li>
                <li><button onClick={onLaunchStudio} className="hover:text-[#0d0e10] transition-colors cursor-pointer">ZAPIER & MAKE</button></li>
                <li><button onClick={onLaunchStudio} className="hover:text-[#0d0e10] transition-colors cursor-pointer">NOTION DATABASE</button></li>
              </ul>
            </div>

            <div className="space-y-3 font-mono">
              <span className="text-xs font-bold text-[#0d0e10] block">[COMPANY]</span>
              <ul className="space-y-2">
                <li><a href="#pricing" className="hover:text-[#0d0e10] transition-colors">PRICING</a></li>
                <li><a href="#faq" className="hover:text-[#0d0e10] transition-colors">FAQ</a></li>
                <li><button onClick={onOpenConsultation} className="hover:text-[#0d0e10] transition-colors cursor-pointer">BOOK AUDIT</button></li>
                <li><span className="text-[#75766f] font-mono">STATUS // 99.9%</span></li>
              </ul>
            </div>
          </div>

          {/* Typography Display Watermark */}
          <div className="border-t border-[#dcdcd3] pt-10 overflow-hidden select-none">
            <h1 className="text-6xl sm:text-8xl md:text-9xl lg:text-[170px] font-black text-[#dcdcd3]/60 hover:text-[#0d0e10] transition-colors duration-500 font-heading text-center tracking-tighter leading-none cursor-pointer">
              JAVARIF
            </h1>
          </div>

          <div className="pt-6 border-t border-[#dcdcd3] flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] font-mono text-[#75766f]">
            <span>© {new Date().getFullYear()} JAVARIF TECHNOLOGIES INC. ALL RIGHTS RESERVED.</span>
            <span className="text-[#0d0e10] font-bold flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#d4ff3a]" />
              <span>ALL SYSTEMS OPERATIONAL // MULTI-MODEL ROUTER ACTIVE</span>
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
};
