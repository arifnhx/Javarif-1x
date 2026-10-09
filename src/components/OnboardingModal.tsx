import React, { useState, useEffect } from 'react';
import {
  X,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  Zap,
  GitFork,
  Layers,
  Calendar,
  Activity,
  Cpu,
  CheckCircle2,
  HelpCircle,
  Play,
  RotateCcw,
} from 'lucide-react';
import { AVAILABLE_MODELS } from '../types';

interface OnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLaunchStudioWithTopic?: (topic: string, modelId: string) => void;
  selectedModelId: string;
  onSelectModel: (modelId: string) => void;
}

export const OnboardingModal: React.FC<OnboardingModalProps> = ({
  isOpen,
  onClose,
  onLaunchStudioWithTopic,
  selectedModelId,
  onSelectModel,
}) => {
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [dontShowAgain, setDontShowAgain] = useState<boolean>(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight' && currentStep < 3) setCurrentStep((prev) => prev + 1);
      if (e.key === 'ArrowLeft' && currentStep > 0) setCurrentStep((prev) => prev - 1);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, currentStep, onClose]);

  // Lock background and page scrolling when onboarding popup shows
  useEffect(() => {
    if (!isOpen) return;
    const originalOverflow = document.body.style.overflow;
    
    // Disable background scroll completely
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleFinish = () => {
    if (dontShowAgain) {
      try {
        localStorage.setItem('javarif_onboarding_dismissed', 'true');
      } catch (e) {
        console.warn('Could not save onboarding state:', e);
      }
    }
    onClose();
  };

  const sampleQuickstarts = [
    {
      title: 'AI Digital Coworkers',
      topic:
        'Autonomous AI agents are transforming SaaS from tools you operate into digital coworkers that execute end-to-end workflows.',
      recommendedModel: 'claude-3-7-sonnet',
    },
    {
      title: 'Usage-Based vs Outcome Pricing',
      topic:
        'Usage-based pricing is dead; outcome-based pricing is the future. Charging for seats punishes customers when software makes them faster.',
      recommendedModel: 'gpt-4o',
    },
    {
      title: 'Async High-Velocity Teams',
      topic:
        'Status syncs are a symptom of broken documentation. High-output distributed teams use deterministic pipelines instead of 30-minute meetings.',
      recommendedModel: 'claude-3-5-haiku',
    },
  ];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-[#0d0e10]/75 backdrop-blur-md animate-fade-in pointer-events-auto"
      onClick={(e) => {
        // Intercept click on backdrop so background/page elements behind cannot be clicked
        e.stopPropagation();
      }}
    >
      <div
        className="relative w-full max-w-2xl bg-white border border-[#dcdcd3] rounded-3xl sm:rounded-4xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh] pointer-events-auto select-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header Bar */}
        <div className="px-5 sm:px-8 py-4 sm:py-5 border-b border-[#eeeee8] flex items-center justify-between bg-[#eeeee8]/50">
          <div className="flex items-center gap-2.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#d4ff3a] animate-pulse" />
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#0d0e10]">
              JAVARIF ONBOARDING · STEP [0{currentStep + 1} / 04]
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleFinish}
              className="p-1.5 sm:p-2 rounded-full text-[#75766f] hover:text-[#0d0e10] hover:bg-black/5 transition-colors cursor-pointer"
              title="Close tour"
            >
              <X className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Slide Content Area */}
        <div className="p-5 sm:p-8 overflow-y-auto flex-1 space-y-6">
          {/* SLIDE 0: Welcome & The Autonomous Engine */}
          {currentStep === 0 && (
            <div className="space-y-5 animate-fade-in">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#eeeee8] text-xs font-mono font-bold text-[#0d0e10]">
                <Sparkles className="w-3.5 h-3.5 text-[#0d0e10]" />
                <span>MEET THE AUTONOMOUS CONTENT ENGINE</span>
              </div>

              <div className="space-y-2">
                <h3 className="text-2xl sm:text-3xl font-extrabold text-[#0d0e10] font-heading tracking-tight">
                  One seed insight in. Six synchronized campaigns out.
                </h3>
                <p className="text-xs sm:text-sm text-[#75766f] font-sans leading-relaxed">
                  Javarif eliminates manual copywriting friction. Instead of opening 6 tabs and copy-pasting tweets, you drop in a single founder memo or podcast excerpt, and our pipeline synthesizes platform-native outputs in seconds.
                </p>
              </div>

              {/* 6 Channels Matrix Visual */}
              <div className="p-4 sm:p-5 rounded-2xl bg-[#eeeee8] border border-[#dcdcd3] space-y-3">
                <span className="text-xs font-mono uppercase font-bold text-[#0d0e10] block">
                  Synchronized Platform Outputs:
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-2.5 text-xs font-mono">
                  <div className="p-2.5 rounded-xl bg-white border border-[#dcdcd3] flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#0d0e10]" />
                    <span className="font-semibold text-[#0d0e10]">LinkedIn Post</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-white border border-[#dcdcd3] flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#0d0e10]" />
                    <span className="font-semibold text-[#0d0e10]">X / Twitter Thread</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-white border border-[#dcdcd3] flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#0d0e10]" />
                    <span className="font-semibold text-[#0d0e10]">SEO Pillar Essay</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-white border border-[#dcdcd3] flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#0d0e10]" />
                    <span className="font-semibold text-[#0d0e10]">YouTube Script</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-white border border-[#dcdcd3] flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#0d0e10]" />
                    <span className="font-semibold text-[#0d0e10]">Email Newsletter</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-white border border-[#dcdcd3] flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#d4ff3a] border border-[#0d0e10]" />
                    <span className="font-semibold text-[#0d0e10]">Carousel Deck</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 text-xs font-mono text-[#75766f]">
                <span className="text-[#0d0e10] font-bold">⚡ Average execution:</span>
                <span>1.4 seconds across multi-channel routing</span>
              </div>
            </div>
          )}

          {/* SLIDE 1: Multi-Model Intelligence (No Lock-In) */}
          {currentStep === 1 && (
            <div className="space-y-5 animate-fade-in">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#eeeee8] text-xs font-mono font-bold text-[#0d0e10]">
                <Cpu className="w-3.5 h-3.5 text-[#0d0e10]" />
                <span>FRONTIER MODEL AGNOSTIC</span>
              </div>

              <div className="space-y-2">
                <h3 className="text-2xl sm:text-3xl font-extrabold text-[#0d0e10] font-heading tracking-tight">
                  Choose your frontier intelligence engine.
                </h3>
                <p className="text-xs sm:text-sm text-[#75766f] font-sans leading-relaxed">
                  We don't lock you into a single proprietary model. Switch freely between Anthropic, OpenAI, DeepSeek, Google, or our automated Multi-Model Ensemble.
                </p>
              </div>

              {/* Interactive Model Switcher in Tour */}
              <div className="space-y-2">
                <span className="text-xs font-mono uppercase text-[#0d0e10] font-bold block">
                  Select your default model for this session:
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-56 overflow-y-auto pr-1">
                  {AVAILABLE_MODELS.slice(0, 6).map((m) => {
                    const isSelected = m.id === selectedModelId;
                    return (
                      <button
                        key={m.id}
                        type="button"
                        onClick={() => onSelectModel(m.id)}
                        className={`p-3 rounded-2xl border text-left transition-all cursor-pointer flex items-center justify-between ${
                          isSelected
                            ? 'bg-[#0d0e10] text-white border-[#0d0e10] shadow-sm'
                            : 'bg-white hover:bg-[#fafaf7] text-[#0d0e10] border-[#dcdcd3]'
                        }`}
                      >
                        <div className="space-y-0.5 min-w-0 pr-2">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span
                              className={`text-[9px] font-mono px-1.5 py-0.5 rounded font-bold ${
                                isSelected ? 'bg-white/20 text-[#d4ff3a]' : 'bg-[#eeeee8] text-[#0d0e10]'
                              }`}
                            >
                              {m.provider}
                            </span>
                            <span className="text-xs font-bold font-heading truncate">
                              {m.name}
                            </span>
                          </div>
                          <p
                            className={`text-[11px] truncate ${
                              isSelected ? 'text-zinc-300' : 'text-[#75766f]'
                            }`}
                          >
                            {m.tagline}
                          </p>
                        </div>

                        {isSelected && (
                          <div className="w-5 h-5 rounded-full bg-[#d4ff3a] flex items-center justify-center shrink-0">
                            <CheckCircle2 className="w-3.5 h-3.5 text-[#0d0e10]" />
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* SLIDE 2: The Studio 5 Modules Tour */}
          {currentStep === 2 && (
            <div className="space-y-5 animate-fade-in">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#eeeee8] text-xs font-mono font-bold text-[#0d0e10]">
                <GitFork className="w-3.5 h-3.5 text-[#0d0e10]" />
                <span>INTERACTIVE STUDIO WORKFLOW</span>
              </div>

              <div className="space-y-2">
                <h3 className="text-2xl sm:text-3xl font-extrabold text-[#0d0e10] font-heading tracking-tight">
                  Five synchronized modules in your workspace.
                </h3>
                <p className="text-xs sm:text-sm text-[#75766f] font-sans leading-relaxed">
                  Navigate seamlessly between manual prompt executions, visual node graph pipelines, omnichannel asset inspection, publishing calendars, and automated webhooks.
                </p>
              </div>

              <div className="space-y-2 font-mono text-xs">
                <div className="p-3 rounded-2xl bg-white border border-[#dcdcd3] flex items-start gap-3">
                  <div className="p-2 rounded-xl bg-[#0d0e10] text-[#d4ff3a] shrink-0">
                    <Zap className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-bold text-[#0d0e10]">[01] RUNNER</h4>
                    <p className="text-[11px] text-[#75766f] font-sans mt-0.5">
                      Input your thesis, customize brand voice persona, and trigger instant generation with telemetry.
                    </p>
                  </div>
                </div>

                <div className="p-3 rounded-2xl bg-white border border-[#dcdcd3] flex items-start gap-3">
                  <div className="p-2 rounded-xl bg-[#eeeee8] text-[#0d0e10] shrink-0">
                    <GitFork className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-bold text-[#0d0e10]">[02] GRAPH</h4>
                    <p className="text-[11px] text-[#75766f] font-sans mt-0.5">
                      Inspect the 5 semantic transformation nodes: Ingestion, Deconstruction, Synthesizer, Scoring, Packaging.
                    </p>
                  </div>
                </div>

                <div className="p-3 rounded-2xl bg-white border border-[#dcdcd3] flex items-start gap-3">
                  <div className="p-2 rounded-xl bg-[#eeeee8] text-[#0d0e10] shrink-0">
                    <Layers className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-bold text-[#0d0e10]">[03] OMNICHANNEL HUB</h4>
                    <p className="text-[11px] text-[#75766f] font-sans mt-0.5">
                      Interactive mockups for LinkedIn, X threads, blog posts, YouTube screenplays, and 1-click Markdown export.
                    </p>
                  </div>
                </div>

                <div className="p-3 rounded-2xl bg-white border border-[#dcdcd3] flex items-start gap-3">
                  <div className="p-2 rounded-xl bg-[#eeeee8] text-[#0d0e10] shrink-0">
                    <Calendar className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-bold text-[#0d0e10]">[04] CADENCE & [05] WEBHOOKS</h4>
                    <p className="text-[11px] text-[#75766f] font-sans mt-0.5">
                      Queue publication slots and listen 24/7 for inbound CMS or RSS trigger events.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* SLIDE 3: Quickstart Launcher */}
          {currentStep === 3 && (
            <div className="space-y-5 animate-fade-in">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#d4ff3a] text-xs font-mono font-bold text-[#0d0e10]">
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>READY TO LAUNCH</span>
              </div>

              <div className="space-y-2">
                <h3 className="text-2xl sm:text-3xl font-extrabold text-[#0d0e10] font-heading tracking-tight">
                  Choose a high-signal topic to run right now.
                </h3>
                <p className="text-xs sm:text-sm text-[#75766f] font-sans leading-relaxed">
                  Select one of our pre-tested seed ideas below to jump straight into Studio and see the pipeline execute live.
                </p>
              </div>

              <div className="space-y-2.5">
                {sampleQuickstarts.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-2xl bg-white border border-[#dcdcd3] hover:border-[#0d0e10] transition-all space-y-2 flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between text-xs font-mono">
                        <span className="font-bold text-[#0d0e10] uppercase">
                          SEED {idx + 1}: {item.title}
                        </span>
                        <span className="text-[10px] bg-[#eeeee8] px-2 py-0.5 rounded text-[#75766f]">
                          Optimized for {item.recommendedModel}
                        </span>
                      </div>
                      <p className="text-xs text-[#75766f] font-sans mt-1 line-clamp-2 leading-relaxed">
                        "{item.topic}"
                      </p>
                    </div>

                    <div className="pt-2 flex justify-end">
                      <button
                        onClick={() => {
                          if (onLaunchStudioWithTopic) {
                            onLaunchStudioWithTopic(item.topic, item.recommendedModel);
                          }
                          handleFinish();
                        }}
                        className="px-4 py-1.5 rounded-full bg-[#d4ff3a] hover:bg-[#c6f02e] text-[#0d0e10] text-xs font-mono font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs active:scale-95 btn-spring"
                      >
                        <span>LAUNCH THIS SEED</span>
                        <ArrowRight className="w-3 h-3 stroke-[3]" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Bottom Control Bar */}
        <div className="px-5 sm:px-8 py-4 border-t border-[#eeeee8] bg-white flex flex-col sm:flex-row items-center justify-between gap-3">
          {/* Progress Indicators & Checkbox */}
          <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-start">
            {/* Step Dots */}
            <div className="flex items-center gap-1.5">
              {[0, 1, 2, 3].map((stepIndex) => (
                <button
                  key={stepIndex}
                  onClick={() => setCurrentStep(stepIndex)}
                  className={`h-2 rounded-full transition-all cursor-pointer ${
                    currentStep === stepIndex
                      ? 'w-6 bg-[#0d0e10]'
                      : 'w-2 bg-[#dcdcd3] hover:bg-[#75766f]'
                  }`}
                  title={`Go to step ${stepIndex + 1}`}
                />
              ))}
            </div>

            <label className="flex items-center gap-1.5 text-[11px] font-mono text-[#75766f] cursor-pointer select-none">
              <input
                type="checkbox"
                checked={dontShowAgain}
                onChange={(e) => setDontShowAgain(e.target.checked)}
                className="rounded border-[#dcdcd3] text-[#0d0e10] focus:ring-0"
              />
              <span>Don't show again</span>
            </label>
          </div>

          {/* Action Navigation Buttons */}
          <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end">
            {currentStep > 0 && (
              <button
                type="button"
                onClick={() => setCurrentStep((prev) => prev - 1)}
                className="px-4 py-2 rounded-full border border-[#dcdcd3] text-[#0d0e10] hover:bg-[#eeeee8] text-xs font-mono font-medium transition-all cursor-pointer flex items-center gap-1.5"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>BACK</span>
              </button>
            )}

            {currentStep < 3 ? (
              <button
                type="button"
                onClick={() => setCurrentStep((prev) => prev + 1)}
                className="px-5 py-2.5 rounded-full bg-[#0d0e10] hover:bg-black text-[#d4ff3a] text-xs font-mono font-bold transition-all cursor-pointer flex items-center gap-1.5 shadow-sm active:scale-95"
              >
                <span>NEXT STEP</span>
                <ArrowRight className="w-3.5 h-3.5 stroke-[2.5]" />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleFinish}
                className="px-6 py-2.5 rounded-full bg-[#d4ff3a] hover:bg-[#c6f02e] text-[#0d0e10] text-xs font-mono font-bold transition-all cursor-pointer flex items-center gap-1.5 shadow-sm active:scale-95 btn-spring"
              >
                <span>GET STARTED</span>
                <ArrowRight className="w-3.5 h-3.5 stroke-[3]" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
