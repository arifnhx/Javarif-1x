import React, { useState } from 'react';
import {
  GitFork,
  Radio,
  Cpu,
  Sparkles,
  Share2,
  CheckCircle2,
  Settings2,
  Play,
  ArrowRight,
  ShieldCheck,
  Zap,
  Globe,
  FileText,
  Video,
  Mail,
  Sliders,
} from 'lucide-react';

interface WorkflowCanvasProps {
  onExecute: () => void;
  isRunning: boolean;
  selectedTemplate: string;
  onSelectTemplate: (templateId: string) => void;
  selectedModelId?: string;
  onSelectModel?: (modelId: string) => void;
}

interface NodeDetails {
  id: string;
  title: string;
  type: string;
  description: string;
  icon: any;
  model: string;
  config: Record<string, string>;
  status: 'ready' | 'running' | 'completed';
}

export const WorkflowCanvas: React.FC<WorkflowCanvasProps> = ({
  onExecute,
  isRunning,
  selectedTemplate,
  onSelectTemplate,
  selectedModelId = 'claude-3-7-sonnet',
  onSelectModel,
}) => {
  const [selectedNodeId, setSelectedNodeId] = useState<string>('node-synthesizer');

  const nodes: NodeDetails[] = [
    {
      id: 'node-trigger',
      title: 'Trigger & Ingestion Hub',
      type: 'Ingestion Trigger',
      description: 'Collects raw inputs from webhooks, scheduled cron jobs, Notion databases, or manual seed ideas.',
      icon: Radio,
      model: 'Event Router v2',
      config: {
        'Trigger Mode': 'Multi-modal (Webhook / Cron / Manual)',
        'Polling Interval': 'Real-time event stream',
        'Payload Validation': 'Strict Schema Validation',
      },
      status: isRunning ? 'completed' : 'ready',
    },
    {
      id: 'node-deconstruct',
      title: 'Thesis & Hook Extractor',
      type: 'Semantic Deconstruction',
      description: 'Breaks long-form arguments or raw topics into atomic thesis statements, contrarian angles, and psychological hooks.',
      icon: Cpu,
      model: 'Anthropic Claude 3.7 Sonnet (Reasoning)',
      config: {
        'Engine Provider': 'Anthropic Claude 3.7 / 200K ctx',
        'Angle Count': '3 tension angles',
        'Hook Psychology': 'Curiosity Gap + Contrarian Framing',
        'Noise Filtering': 'Aggressive fluff removal',
      },
      status: isRunning ? 'running' : 'ready',
    },
    {
      id: 'node-synthesizer',
      title: 'Omnichannel Synthesizer',
      type: 'Parallel Multi-Format Generation',
      description: 'Simultaneously generates native syntax for 6 different digital distribution platforms via multi-model routing (Claude, GPT-4o & Gemini).',
      icon: Sparkles,
      model: 'Auto Multi-Model Ensemble',
      config: {
        'Target Channels': 'LinkedIn, X, Blog, Video Script, Newsletter, Carousel',
        'Model Routing': 'Claude 3.7 (Long-form) • GPT-4o (Hooks & Prompts) • Gemini (Speed)',
        'Formatting': 'Platform Native (Whitespace, Threading, Beats)',
        'Latency Target': '< 1500ms',
      },
      status: isRunning ? 'running' : 'ready',
    },
    {
      id: 'node-filter',
      title: 'Virality & Brand Voice Guard',
      type: 'Quality & Algorithmic Scoring',
      description: 'Audits readability, calculates predicted virality scores, and verifies voice adherence against brand tone parameters.',
      icon: ShieldCheck,
      model: 'DeepSeek R1 / Reasoning Critic',
      config: {
        'Critic Engine': 'DeepSeek R1 (128K ctx)',
        'Min Virality Score': '85 / 100 threshold',
        'Clarity Index': 'Flesch-Kincaid Grade 7-9',
        'Fact & Consistency': 'Deterministic cross-check',
      },
      status: isRunning ? 'running' : 'ready',
    },
    {
      id: 'node-distribution',
      title: 'Omnichannel Distribution Hub',
      type: 'Output & Webhook Dispatch',
      description: 'Packages ready-to-publish assets with 1-click clipboard, markdown download, and Zapier/Make webhooks.',
      icon: Share2,
      model: 'Dispatcher API',
      config: {
        'Export Formats': 'Markdown, JSON, HTML, Carousel Cards',
        'Webhook Sync': 'Ready for Zapier / Buffer / n8n',
        'Schedule Queue': 'Automated slot allocation',
      },
      status: isRunning ? 'running' : 'ready',
    },
  ];

  const selectedNode = nodes.find((n) => n.id === selectedNodeId) || nodes[2];

  return (
    <div className="space-y-6">
      {/* Top Banner (Reachwise Editorial Style) */}
      <div className="bg-white border border-[#dcdcd3] rounded-3xl p-6 sm:p-8 relative overflow-hidden shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="inline-flex items-center space-x-2 text-xs text-[#0d0e10] font-mono font-bold tracking-wider px-3 py-1 rounded-full bg-[#eeeee8]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#d4ff3a]" />
              <span>VISUAL CONTENT WORKFLOW GRAPH</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0d0e10] font-heading tracking-tight">
              Autonomous Pipeline Architecture
            </h2>
            <p className="text-xs sm:text-sm text-[#75766f] max-w-2xl font-sans leading-relaxed">
              Inspect how Javarif routes raw input signals through multi-model intelligence (Anthropic Claude, OpenAI, DeepSeek, and Gemini) to continuously produce synchronized, multi-format content.
            </p>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={onExecute}
              disabled={isRunning}
              className={`flex items-center space-x-2 px-6 py-3 rounded-full font-mono font-bold text-xs uppercase tracking-wider shadow-sm transition-all cursor-pointer ${
                isRunning
                  ? 'bg-[#dcdcd3] text-[#75766f] cursor-not-allowed'
                  : 'bg-[#d4ff3a] hover:bg-[#c6f02e] text-[#0d0e10] shadow-sm active:scale-95 duration-150 btn-spring'
              }`}
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>{isRunning ? 'PIPELINE RUNNING...' : 'EXECUTE WORKFLOW GRAPH'}</span>
            </button>
          </div>
        </div>

        {/* Templates Bar */}
        <div className="mt-6 pt-5 border-t border-[#eeeee8] flex flex-wrap items-center gap-2">
          <span className="text-xs font-mono text-[#75766f] font-bold mr-2">[RECIPES]:</span>
          {[
            { id: 'omnichannel-360', label: 'Omnichannel Repurposer 360', tag: 'Standard' },
            { id: 'viral-thought-leadership', label: 'Viral Thought Leadership', tag: 'High Velocity' },
            { id: 'product-launch-cascade', label: 'Product Launch & Changelog', tag: 'GTM' },
            { id: 'video-audio-repurpose', label: 'Podcast & Keynote Repurpose', tag: 'Media' },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => onSelectTemplate(item.id)}
              className={`px-4 py-1.5 rounded-full text-xs font-mono transition-all flex items-center space-x-2 cursor-pointer ${
                selectedTemplate === item.id
                  ? 'bg-[#0d0e10] text-[#d4ff3a] font-bold shadow-xs'
                  : 'bg-[#eeeee8] text-[#75766f] hover:text-[#0d0e10] hover:bg-white border border-[#dcdcd3]'
              }`}
            >
              <span>{item.label}</span>
              <span
                className={`text-[10px] px-2 py-0.2 rounded-full font-mono font-bold ${
                  selectedTemplate === item.id
                    ? 'bg-white/20 text-white'
                    : 'bg-white text-[#75766f]'
                }`}
              >
                {item.tag}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Visual Pipeline Canvas */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Node Graph Left/Center Area (2 cols) */}
        <div className="lg:col-span-2 bg-white border border-[#dcdcd3] rounded-3xl p-6 sm:p-8 relative overflow-hidden bg-rw-subgrid shadow-xs">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#0d0e10]" />
              <span className="text-xs font-mono uppercase text-[#0d0e10] font-bold">
                Live Graph View · 5 Transformation Nodes
              </span>
            </div>
            <span className="text-xs text-[#75766f] font-mono">[Click node to inspect]</span>
          </div>

          {/* Node Flow Horizontal/Vertical Sequence */}
          <div className="space-y-4 relative">
            {nodes.map((node, index) => {
              const Icon = node.icon;
              const isSelected = selectedNodeId === node.id;

              return (
                <div key={node.id} className="relative">
                  {/* Connector Line to next node */}
                  {index < nodes.length - 1 && (
                    <div className="absolute left-8 top-16 w-0.5 h-8 bg-gradient-to-b from-[#0d0e10] to-[#dcdcd3] z-0" />
                  )}

                  <div
                    onClick={() => setSelectedNodeId(node.id)}
                    className={`relative z-10 cursor-pointer p-5 rounded-2xl border transition-all flex items-center justify-between ${
                      isSelected
                        ? 'bg-white border-[#0d0e10] ring-2 ring-[#d4ff3a] shadow-md'
                        : 'bg-[#eeeee8] border-[#dcdcd3] hover:bg-white hover:border-[#0d0e10] shadow-2xs'
                    }`}
                  >
                    <div className="flex items-center space-x-4">
                      {/* Node Icon Box */}
                      <div
                        className={`w-12 h-12 rounded-2xl flex items-center justify-center border transition-all ${
                          isSelected
                            ? 'bg-[#0d0e10] text-[#d4ff3a] border-[#0d0e10] shadow-sm'
                            : 'bg-white text-[#0d0e10] border-[#dcdcd3]'
                        }`}
                      >
                        <Icon className="w-6 h-6" />
                      </div>

                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="text-xs font-mono text-[#0d0e10] font-bold uppercase tracking-wider">
                            Step 0{index + 1} · {node.type}
                          </span>
                          {isRunning && index === 2 && (
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] bg-[#d4ff3a] text-[#0d0e10] font-mono font-bold animate-pulse">
                              Processing
                            </span>
                          )}
                        </div>
                        <h3 className="text-base font-bold text-[#0d0e10] font-heading mt-0.5">{node.title}</h3>
                        <p className="text-xs text-[#75766f] mt-0.5 line-clamp-1 font-sans">{node.description}</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3 text-right">
                      <div className="hidden sm:block">
                        <span className="text-[11px] font-mono text-[#75766f] block">{node.model}</span>
                        <span className="text-[10px] text-[#0d0e10] font-bold font-mono">● Active</span>
                      </div>
                      <ArrowRight
                        className={`w-4 h-4 transition-transform ${
                          isSelected ? 'text-[#0d0e10] translate-x-1' : 'text-[#75766f]'
                        }`}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Parallel Output Badges */}
          <div className="mt-8 pt-6 border-t border-[#eeeee8]">
            <span className="text-xs font-mono uppercase text-[#75766f] font-bold block mb-3">
              [PARALLEL OUTPUT MATRIX · SIMULTANEOUS GENERATION]
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2">
              {[
                { name: 'LinkedIn', icon: Globe },
                { name: 'X / Twitter', icon: Zap },
                { name: 'SEO Blog', icon: FileText },
                { name: 'YouTube Script', icon: Video },
                { name: 'Newsletter', icon: Mail },
                { name: 'Carousel Deck', icon: Sliders },
              ].map((channel, i) => {
                const ChIcon = channel.icon;
                return (
                  <div
                    key={i}
                    className="p-3 rounded-2xl bg-[#eeeee8] border border-[#dcdcd3] flex flex-col items-center justify-center text-center text-xs hover:border-[#0d0e10] hover:bg-white transition-colors"
                  >
                    <ChIcon className="w-4 h-4 mb-1 text-[#0d0e10]" />
                    <span className="text-[#0d0e10] font-bold text-[11px] font-sans">{channel.name}</span>
                    <span className="text-[9px] text-[#75766f] font-mono font-semibold mt-0.5">Automated</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Node Inspector Sidebar (1 col) */}
        <div className="bg-white border border-[#dcdcd3] rounded-3xl p-6 sm:p-7 flex flex-col justify-between shadow-xs">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-[#eeeee8]">
              <div className="flex items-center space-x-2">
                <Settings2 className="w-4 h-4 text-[#0d0e10]" />
                <span className="text-xs font-mono uppercase text-[#0d0e10] font-bold">
                  Node Inspector
                </span>
              </div>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono bg-[#eeeee8] text-[#0d0e10] font-bold">
                {selectedNode.type}
              </span>
            </div>

            <div className="mt-5 space-y-1.5">
              <h3 className="text-lg font-bold text-[#0d0e10] font-heading">{selectedNode.title}</h3>
              <p className="text-xs text-[#75766f] leading-relaxed font-sans">
                {selectedNode.description}
              </p>
            </div>

            <div className="mt-6 space-y-4">
              <div className="p-4 rounded-2xl bg-[#eeeee8] border border-[#dcdcd3]">
                <span className="text-[10px] uppercase font-mono text-[#75766f] font-bold block">
                  Processing Engine
                </span>
                <span className="text-xs font-bold text-[#0d0e10] font-mono mt-0.5 block">
                  {selectedNode.model}
                </span>
              </div>

              <div className="space-y-2">
                <span className="text-xs font-mono uppercase text-[#75766f] font-bold block">
                  Configured Parameters
                </span>
                {Object.entries(selectedNode.config).map(([key, val]) => (
                  <div
                    key={key}
                    className="p-3 rounded-2xl bg-[#eeeee8] border border-[#dcdcd3] flex items-center justify-between text-xs"
                  >
                    <span className="text-[#75766f] font-sans">{key}</span>
                    <span className="text-[#0d0e10] font-semibold font-mono text-[11px] text-right">
                      {val}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-8 pt-5 border-t border-[#eeeee8] space-y-3">
            <div className="flex items-center justify-between text-xs text-[#75766f] font-mono">
              <span>Status</span>
              <span className="text-[#0d0e10] font-bold flex items-center">
                <CheckCircle2 className="w-3.5 h-3.5 mr-1 text-[#0d0e10]" />
                Operational
              </span>
            </div>
            <button
              onClick={onExecute}
              disabled={isRunning}
              className="w-full py-3 rounded-full bg-[#0d0e10] hover:bg-black text-[#d4ff3a] font-mono font-bold text-xs transition-all flex items-center justify-center space-x-2 cursor-pointer shadow-xs active:scale-95"
            >
              <Zap className="w-3.5 h-3.5 fill-current" />
              <span>TEST THIS STEP IN RUNNER</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
