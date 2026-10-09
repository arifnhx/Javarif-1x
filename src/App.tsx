/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { AwwwardsHome } from './components/AwwwardsHome';
import { DiscoveryModal } from './components/DiscoveryModal';
import { OnboardingModal } from './components/OnboardingModal';
import { AuthModal } from './components/AuthModal';
import { WorkflowCanvas } from './components/WorkflowCanvas';
import { ExecutionConsole } from './components/ExecutionConsole';
import { OmnichannelHub } from './components/OmnichannelHub';
import { ContentCalendar } from './components/ContentCalendar';
import { AutomationTriggers } from './components/AutomationTriggers';
import { CampaignHistory } from './components/CampaignHistory';
import {
  WorkflowExecutionResult,
  AVAILABLE_MODELS,
  UserProfile,
  UserSubscriptionTier,
} from './types';
import {
  Sparkles,
  Zap,
  GitFork,
  Layers,
  Calendar,
  Activity,
  ArrowLeft,
  Home,
  HelpCircle,
  Lock,
  Crown,
  UserCheck,
} from 'lucide-react';

export default function App() {
  const [currentView, setCurrentView] = useState<'home' | 'studio'>('home');
  const [activeStudioTab, setActiveStudioTab] = useState<
    'execution' | 'builder' | 'omnichannel' | 'calendar' | 'triggers'
  >('execution');
  const [selectedModelId, setSelectedModelId] = useState<string>('claude-3-7-sonnet');
  const [isConsultationOpen, setIsConsultationOpen] = useState<boolean>(false);
  const [isOnboardingOpen, setIsOnboardingOpen] = useState<boolean>(false);
  const [isAuthOpen, setIsAuthOpen] = useState<boolean>(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'upgrade'>('login');
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [studioInitialTopic, setStudioInitialTopic] = useState<string>('');
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [result, setResult] = useState<WorkflowExecutionResult | null>(null);
  const [history, setHistory] = useState<WorkflowExecutionResult[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<string>('omnichannel-360');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Restore user session from localStorage on mount
  useEffect(() => {
    try {
      const savedUser = localStorage.getItem('javarif_user_session');
      if (savedUser) {
        const parsed = JSON.parse(savedUser);
        if (parsed && parsed.email) {
          setCurrentUser(parsed);
        }
      }
    } catch (e) {
      console.warn('Failed to read user session:', e);
    }
  }, []);

  // Check onboarding on mount
  useEffect(() => {
    try {
      const dismissed = localStorage.getItem('javarif_onboarding_dismissed');
      if (!dismissed) {
        // Smooth entrance delay
        const timer = setTimeout(() => setIsOnboardingOpen(true), 500);
        return () => clearTimeout(timer);
      }
    } catch (e) {
      console.warn('Could not read onboarding state:', e);
    }
  }, []);

  // Load history from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem('javarif_pipeline_history');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setHistory(parsed);
          setResult(parsed[0]);
        }
      }
    } catch (e) {
      console.warn('Failed to load campaign history from localStorage:', e);
    }
  }, []);

  const handleUserLogin = (user: UserProfile) => {
    setCurrentUser(user);
    try {
      localStorage.setItem('javarif_user_session', JSON.stringify(user));
    } catch (e) {
      console.warn('Failed to persist session:', e);
    }
    showToast(`Welcome, ${user.name}! Authenticated as ${user.tier.toUpperCase()} tier.`);
  };

  const handleUserLogout = () => {
    setCurrentUser(null);
    try {
      localStorage.removeItem('javarif_user_session');
    } catch (e) {
      console.warn('Failed to clear session:', e);
    }
    setCurrentView('home');
    showToast('Signed out of operator console.');
  };

  const handleUpgradeTier = (tier: UserSubscriptionTier) => {
    if (!currentUser) {
      setAuthModalMode('login');
      setIsAuthOpen(true);
      return;
    }
    const updated: UserProfile = {
      ...currentUser,
      tier,
      isSubscribed: tier !== 'free',
      monthlyQuota: tier === 'free' ? 3 : tier === 'starter' ? 15 : 9999,
    };
    setCurrentUser(updated);
    try {
      localStorage.setItem('javarif_user_session', JSON.stringify(updated));
    } catch (e) {
      console.warn('Failed to persist upgrade:', e);
    }
    showToast(`Upgraded to ${tier.toUpperCase()} subscription! All modules unlocked.`);
  };

  const openAuthWithMode = (mode: 'login' | 'upgrade') => {
    setAuthModalMode(mode);
    setIsAuthOpen(true);
  };

  const handleLaunchStudioSafe = () => {
    if (!currentUser) {
      openAuthWithMode('login');
      return;
    }
    setCurrentView('studio');
    setActiveStudioTab('execution');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLaunchFromOnboarding = (topic: string, modelId: string) => {
    setSelectedModelId(modelId);
    setStudioInitialTopic(topic);
    setIsOnboardingOpen(false);

    if (!currentUser) {
      showToast('Quickstart saved! Sign in to run pipeline.');
      openAuthWithMode('login');
    } else {
      setCurrentView('studio');
      setActiveStudioTab('execution');
      showToast('Quickstart seed loaded into Studio. Ready to run!');
    }
  };

  // Save history to localStorage
  const saveToHistory = (newResult: WorkflowExecutionResult) => {
    setHistory((prev) => {
      const filtered = prev.filter((item) => item.meta.workflowId !== newResult.meta.workflowId);
      const updated = [newResult, ...filtered].slice(0, 10);
      try {
        localStorage.setItem('javarif_pipeline_history', JSON.stringify(updated));
      } catch (e) {
        console.warn('Failed to persist history:', e);
      }
      return updated;
    });
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Primary Workflow Execution Handler
  const handleExecuteWorkflow = async (params: {
    topic: string;
    brandVoice: string;
    templateId: string;
    customInstructions: string;
  }) => {
    // Check authentication
    if (!currentUser) {
      openAuthWithMode('login');
      return;
    }

    // Check free tier limits
    if (!currentUser.isSubscribed && currentUser.runsUsedThisMonth >= currentUser.monthlyQuota) {
      showToast('Free tier monthly run quota reached (3/3). Please upgrade to continue.');
      openAuthWithMode('upgrade');
      return;
    }

    setIsRunning(true);
    setCurrentStep(1);

    const stepInterval = setInterval(() => {
      setCurrentStep((prev) => {
        if (prev < 4) return prev + 1;
        return prev;
      });
    }, 600);

    try {
      const response = await fetch('/api/workflows/run', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params),
      });

      if (!response.ok) {
        throw new Error(`HTTP error ${response.status}`);
      }

      const resData = await response.json();
      clearInterval(stepInterval);
      setCurrentStep(4);

      if (resData.success && resData.data) {
        setResult(resData.data);
        saveToHistory(resData.data);

        // Increment run count
        if (currentUser) {
          const updatedUser: UserProfile = {
            ...currentUser,
            runsUsedThisMonth: currentUser.runsUsedThisMonth + 1,
          };
          setCurrentUser(updatedUser);
          try {
            localStorage.setItem('javarif_user_session', JSON.stringify(updatedUser));
          } catch (e) {
            console.warn('Failed to save quota:', e);
          }
        }

        showToast('Autonomous pipeline completed! Omnichannel assets ready.');
        setActiveStudioTab('omnichannel');
      } else {
        throw new Error(resData.error || 'Failed to complete workflow');
      }
    } catch (err: any) {
      clearInterval(stepInterval);
      console.error('Execution error:', err);
      showToast('Error during pipeline execution. Check console for details.');
    } finally {
      setIsRunning(false);
    }
  };

  const handleQuickRun = () => {
    handleExecuteWorkflow({
      topic:
        'Autonomous AI agents are transforming SaaS from tools you operate into digital coworkers that execute end-to-end workflows.',
      brandVoice: 'Authoritative & Contrarian',
      templateId: selectedTemplate,
      customInstructions: 'Focus on high signal virality and multi-channel synchronization.',
    });
  };

  const handleSimulateWebhook = async (payload: { sourceName: string; topic: string }) => {
    if (!currentUser) {
      openAuthWithMode('login');
      return;
    }
    if (!currentUser.isSubscribed) {
      showToast('Inbound webhook execution requires an active Starter or Growth subscription.');
      openAuthWithMode('upgrade');
      return;
    }

    setIsRunning(true);
    showToast(`Inbound event received from ${payload.sourceName}! Starting execution...`);

    try {
      await handleExecuteWorkflow({
        topic: payload.topic,
        brandVoice: 'Authoritative & Contrarian',
        templateId: 'omnichannel-360',
        customInstructions: `Triggered via ${payload.sourceName}`,
      });
    } finally {
      setIsRunning(false);
    }
  };

  const handleClearHistory = () => {
    setHistory([]);
    try {
      localStorage.removeItem('javarif_pipeline_history');
    } catch (e) {
      console.warn('Failed to clear storage:', e);
    }
    showToast('Run history cleared');
  };

  const isSubscribedUser = currentUser?.isSubscribed ?? false;

  return (
    <div className="min-h-screen bg-[#eeeee8] text-[#0d0e10] flex flex-col relative selection:bg-[#d4ff3a] selection:text-[#0d0e10] overflow-x-hidden">
      {/* Layer 1: Reachwise Fine Architectural Grid */}
      <div className="fixed inset-0 bg-rw-subgrid pointer-events-none -z-10 opacity-70" />

      {/* Layer 2: Reachwise Ambient Acid-Lime & Bone Glow Mesh */}
      <div className="fixed inset-0 bg-rw-ambient pointer-events-none -z-10" />

      {/* Layer 3: Tactile Paper Grain Texture */}
      <div className="fixed inset-0 noise-overlay-tactile pointer-events-none -z-10 mix-blend-multiply opacity-50" />

      {/* Layer 4: Reachwise Architectural Margin Guides */}
      <div className="fixed inset-y-0 left-4 sm:left-8 w-[1px] bg-black/[0.04] pointer-events-none -z-10 hidden lg:block" />
      <div className="fixed inset-y-0 right-4 sm:right-8 w-[1px] bg-black/[0.04] pointer-events-none -z-10 hidden lg:block" />

      {/* Onboarding Tour Modal - Always top-level with pointer-events-auto */}
      <OnboardingModal
        isOpen={isOnboardingOpen}
        onClose={() => setIsOnboardingOpen(false)}
        onLaunchStudioWithTopic={handleLaunchFromOnboarding}
        selectedModelId={selectedModelId}
        onSelectModel={(id) => {
          setSelectedModelId(id);
          const m = AVAILABLE_MODELS.find((x) => x.id === id);
          if (m) showToast(`Selected ${m.name}`);
        }}
      />

      {/* Operator Authentication & Subscription Modal */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        currentUser={currentUser}
        onLogin={handleUserLogin}
        onUpgradeTier={handleUpgradeTier}
        initialMode={authModalMode}
      />

      {/* Consultation Discovery Modal */}
      <DiscoveryModal
        isOpen={isConsultationOpen}
        onClose={() => setIsConsultationOpen(false)}
      />

      {/* Toast Notification (Reachwise Ink & Acid-Lime Pill) */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#0d0e10] border border-white/15 text-white px-5 py-3 rounded-full shadow-2xl flex items-center space-x-2.5 text-xs font-mono font-bold animate-float-slow pointer-events-auto">
          <span className="w-2 h-2 rounded-full bg-[#d4ff3a] animate-ping" />
          <Sparkles className="w-4 h-4 text-[#d4ff3a]" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Background Page Content Wrapper - clicks and login disabled on background while onboarding is showing */}
      <div
        className={`flex-1 flex flex-col min-h-screen ${
          isOnboardingOpen ? 'pointer-events-none select-none' : ''
        }`}
        aria-hidden={isOnboardingOpen ? 'true' : undefined}
      >
        {/* Strict Top Bar Contract Header */}
        <Header
          currentView={currentView}
          setCurrentView={(view) => {
            if (view === 'studio' && !currentUser) {
              openAuthWithMode('login');
              return;
            }
            setCurrentView(view);
          }}
          onOpenConsultation={() => setIsConsultationOpen(true)}
          onOpenOnboarding={() => setIsOnboardingOpen(true)}
          currentUser={currentUser}
          onOpenLogin={() => openAuthWithMode('login')}
          onLogout={handleUserLogout}
          onOpenUpgrade={() => openAuthWithMode('upgrade')}
        />

      {/* MAIN VIEW SWITCHER */}
      {currentView === 'home' ? (
        <main className="flex-1">
          <AwwwardsHome
            onLaunchStudio={handleLaunchStudioSafe}
            onOpenConsultation={() => setIsConsultationOpen(true)}
            selectedModelId={selectedModelId}
            onSelectModel={(id) => {
              setSelectedModelId(id);
              const m = AVAILABLE_MODELS.find((x) => x.id === id);
              if (m) showToast(`Selected ${m.name}`);
            }}
            onSelectPlan={(planTier) => {
              if (!currentUser) {
                openAuthWithMode('login');
              } else {
                handleUpgradeTier(planTier);
              }
            }}
          />
        </main>
      ) : !currentUser ? (
        /* Studio Protected Gate - Login Required */
        <main className="flex-1 max-w-xl w-full mx-auto px-4 py-20 flex flex-col items-center justify-center text-center space-y-6">
          <div className="w-16 h-16 rounded-full bg-[#0d0e10] text-[#d4ff3a] flex items-center justify-center shadow-lg">
            <Lock className="w-8 h-8" />
          </div>
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-[#dcdcd3] text-xs font-mono font-bold text-[#0d0e10]">
              <Lock className="w-3.5 h-3.5 text-amber-600" />
              <span>AUTHENTICATION REQUIRED</span>
            </div>
            <h2 className="text-3xl font-extrabold text-[#0d0e10] font-heading tracking-tight">
              Studio Access Locked
            </h2>
            <p className="text-xs sm:text-sm text-[#75766f] font-sans leading-relaxed max-w-md mx-auto">
              Please sign in with your operator account to open the interactive pipeline runner, graph canvas, and omnichannel hub.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 w-full justify-center">
            <button
              onClick={() => openAuthWithMode('login')}
              className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-[#0d0e10] hover:bg-black text-[#d4ff3a] font-mono text-xs font-bold transition-all cursor-pointer shadow-md flex items-center justify-center gap-2"
            >
              <span>SIGN IN TO ACCESS STUDIO</span>
              <span>→</span>
            </button>
            <button
              onClick={() => setCurrentView('home')}
              className="w-full sm:w-auto px-6 py-3.5 rounded-full bg-white hover:bg-[#eeeee8] border border-[#dcdcd3] text-[#0d0e10] font-mono text-xs font-semibold transition-colors cursor-pointer"
            >
              Back to Overview
            </button>
          </div>
        </main>
      ) : (
        /* INTERACTIVE STUDIO ENVIRONMENT */
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6 sm:space-y-8">
          {/* Studio Top Control Strip - Fully Responsive Mobile & Tablet */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3.5 pb-6 border-b border-[#dcdcd3]">
            <div className="flex items-center gap-2.5 flex-wrap">
              <button
                onClick={() => setCurrentView('home')}
                className="px-3.5 py-2 rounded-full bg-white border border-[#dcdcd3] text-[#0d0e10] hover:border-[#0d0e10] shadow-xs transition-all cursor-pointer flex items-center gap-2 text-xs font-medium active:scale-95"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Return to Overview</span>
              </button>

              <button
                onClick={() => setIsOnboardingOpen(true)}
                className="px-3 py-2 rounded-full bg-white border border-[#dcdcd3] text-[#75766f] hover:text-[#0d0e10] hover:border-[#0d0e10] shadow-xs transition-all cursor-pointer flex items-center gap-1.5 text-xs font-mono"
                title="Review Guided Tour"
              >
                <HelpCircle className="w-3.5 h-3.5 text-[#0d0e10]" />
                <span className="hidden xs:inline">GUIDED TOUR</span>
              </button>

              {/* Current User Tier Badge & Upgrade CTA in Studio Strip */}
              <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-full border border-[#dcdcd3] text-xs font-mono">
                <span className="w-2 h-2 rounded-full bg-[#d4ff3a]" />
                <span className="text-[#0d0e10] font-bold uppercase">{currentUser.tier}</span>
                <span className="text-[#75766f]">
                  ({currentUser.runsUsedThisMonth}/{currentUser.monthlyQuota >= 9999 ? '∞' : currentUser.monthlyQuota})
                </span>
                {!currentUser.isSubscribed && (
                  <button
                    onClick={() => openAuthWithMode('upgrade')}
                    className="ml-1 text-[10px] px-2 py-0.5 rounded-full bg-[#0d0e10] text-[#d4ff3a] hover:bg-black font-bold flex items-center gap-1 cursor-pointer"
                  >
                    <Crown className="w-2.5 h-2.5" />
                    <span>UPGRADE</span>
                  </button>
                )}
              </div>
            </div>

            {/* Studio Segmented Navigation Tabs - Horizontal Touch Scrollable */}
            <div className="w-full md:w-auto overflow-x-auto no-scrollbar touch-pan-x scroll-smooth p-1 bg-white rounded-full border border-[#dcdcd3] shadow-xs font-mono flex items-center gap-1">
              <button
                onClick={() => setActiveStudioTab('execution')}
                className={`flex items-center gap-1.5 px-3.5 sm:px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer shrink-0 ${
                  activeStudioTab === 'execution'
                    ? 'bg-[#0d0e10] text-[#d4ff3a] shadow-sm'
                    : 'text-[#75766f] hover:text-[#0d0e10] hover:bg-black/5'
                }`}
              >
                <Zap className="w-3.5 h-3.5 text-[#d4ff3a]" />
                <span>[01] RUNNER</span>
              </button>

              <button
                onClick={() => setActiveStudioTab('builder')}
                className={`flex items-center gap-1.5 px-3.5 sm:px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer shrink-0 ${
                  activeStudioTab === 'builder'
                    ? 'bg-[#0d0e10] text-[#d4ff3a] shadow-sm'
                    : 'text-[#75766f] hover:text-[#0d0e10] hover:bg-black/5'
                }`}
              >
                <GitFork className="w-3.5 h-3.5 text-[#d4ff3a]" />
                <span>[02] GRAPH</span>
              </button>

              <button
                onClick={() => setActiveStudioTab('omnichannel')}
                className={`flex items-center gap-1.5 px-3.5 sm:px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer shrink-0 ${
                  activeStudioTab === 'omnichannel'
                    ? 'bg-[#0d0e10] text-[#d4ff3a] shadow-sm'
                    : 'text-[#75766f] hover:text-[#0d0e10] hover:bg-black/5'
                }`}
              >
                <Layers className="w-3.5 h-3.5 text-[#d4ff3a]" />
                <span>[03] OMNICHANNEL {result && '●'}</span>
              </button>

              <button
                onClick={() => setActiveStudioTab('calendar')}
                className={`flex items-center gap-1.5 px-3.5 sm:px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer shrink-0 ${
                  activeStudioTab === 'calendar'
                    ? 'bg-[#0d0e10] text-[#d4ff3a] shadow-sm'
                    : 'text-[#75766f] hover:text-[#0d0e10] hover:bg-black/5'
                }`}
              >
                <Calendar className="w-3.5 h-3.5 text-[#d4ff3a]" />
                <span>[04] CADENCE</span>
                {!isSubscribedUser && (
                  <span className="text-[9px] px-1 py-0.2 rounded-full bg-amber-100 text-amber-800 font-bold">
                    PRO
                  </span>
                )}
              </button>

              <button
                onClick={() => setActiveStudioTab('triggers')}
                className={`flex items-center gap-1.5 px-3.5 sm:px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer shrink-0 ${
                  activeStudioTab === 'triggers'
                    ? 'bg-[#0d0e10] text-[#d4ff3a] shadow-sm'
                    : 'text-[#75766f] hover:text-[#0d0e10] hover:bg-black/5'
                }`}
              >
                <Activity className="w-3.5 h-3.5 text-[#d4ff3a]" />
                <span>[05] WEBHOOKS</span>
                {!isSubscribedUser && (
                  <span className="text-[9px] px-1 py-0.2 rounded-full bg-amber-100 text-amber-800 font-bold">
                    PRO
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* Studio Tab Viewports */}
          {activeStudioTab === 'execution' && (
            <ExecutionConsole
              onExecute={handleExecuteWorkflow}
              isRunning={isRunning}
              currentStep={currentStep}
              result={result}
              onViewResults={() => setActiveStudioTab('omnichannel')}
              selectedModelId={selectedModelId}
              onSelectModel={(id) => {
                setSelectedModelId(id);
                const m = AVAILABLE_MODELS.find((x) => x.id === id);
                if (m) showToast(`Model set to ${m.name}`);
              }}
              initialTopic={studioInitialTopic}
              currentUser={currentUser}
              onOpenUpgrade={() => openAuthWithMode('upgrade')}
            />
          )}

          {activeStudioTab === 'builder' && (
            <WorkflowCanvas
              onExecute={handleQuickRun}
              isRunning={isRunning}
              selectedTemplate={selectedTemplate}
              onSelectTemplate={(t) => {
                setSelectedTemplate(t);
                showToast(`Selected recipe: ${t}`);
              }}
              selectedModelId={selectedModelId}
              onSelectModel={(id) => {
                setSelectedModelId(id);
                const m = AVAILABLE_MODELS.find((x) => x.id === id);
                if (m) showToast(`Model set to ${m.name}`);
              }}
            />
          )}

          {activeStudioTab === 'omnichannel' && (
            <OmnichannelHub
              result={result}
              onRegenerateChannel={(channel) => {
                showToast(`Polishing channel: ${channel}...`);
              }}
              isSubscribed={isSubscribedUser}
              onOpenUpgrade={() => openAuthWithMode('upgrade')}
            />
          )}

          {activeStudioTab === 'calendar' && (
            <div>
              {!isSubscribedUser ? (
                /* Feature gate for non-subscribed users */
                <div className="bg-white border border-[#dcdcd3] rounded-3xl p-10 sm:p-14 text-center max-w-xl mx-auto space-y-5 shadow-xs">
                  <div className="w-14 h-14 rounded-full bg-[#0d0e10] text-[#d4ff3a] flex items-center justify-center mx-auto shadow-md">
                    <Calendar className="w-7 h-7" />
                  </div>
                  <div className="space-y-2">
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#eeeee8] text-xs font-mono font-bold text-[#0d0e10]">
                      <Lock className="w-3.5 h-3.5 text-amber-600" />
                      <span>SUBSCRIBER CADENCE ENGINE</span>
                    </div>
                    <h3 className="text-2xl font-bold text-[#0d0e10] font-heading">
                      Automated Distribution Calendar
                    </h3>
                    <p className="text-xs sm:text-sm text-[#75766f] font-sans leading-relaxed">
                      Queue multi-channel drops across days of the week, synchronize LinkedIn and X release schedules, and auto-dispatch buffer slots. Available with Starter ($2,400/mo) and Growth ($4,800/mo) plans.
                    </p>
                  </div>
                  <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
                    <button
                      onClick={() => openAuthWithMode('upgrade')}
                      className="w-full sm:w-auto px-6 py-3 rounded-full bg-[#d4ff3a] hover:bg-[#c6f02e] text-[#0d0e10] font-mono text-xs font-bold transition-all cursor-pointer shadow-md flex items-center justify-center gap-2"
                    >
                      <Crown className="w-4 h-4" />
                      <span>UPGRADE TO UNLOCK CADENCE</span>
                    </button>
                    <button
                      onClick={() => setActiveStudioTab('execution')}
                      className="w-full sm:w-auto px-5 py-3 rounded-full bg-white hover:bg-[#eeeee8] border border-[#dcdcd3] text-[#0d0e10] font-mono text-xs font-semibold transition-colors cursor-pointer"
                    >
                      Return to Runner
                    </button>
                  </div>
                </div>
              ) : (
                <ContentCalendar
                  hasActiveCampaign={!!result}
                  onScheduleCurrentCampaign={() => {
                    showToast('Campaign successfully appended to distribution cadence!');
                  }}
                />
              )}
            </div>
          )}

          {activeStudioTab === 'triggers' && (
            <div>
              {!isSubscribedUser ? (
                /* Feature gate for non-subscribed users */
                <div className="bg-white border border-[#dcdcd3] rounded-3xl p-10 sm:p-14 text-center max-w-xl mx-auto space-y-5 shadow-xs">
                  <div className="w-14 h-14 rounded-full bg-[#0d0e10] text-[#d4ff3a] flex items-center justify-center mx-auto shadow-md">
                    <Activity className="w-7 h-7" />
                  </div>
                  <div className="space-y-2">
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#eeeee8] text-xs font-mono font-bold text-[#0d0e10]">
                      <Lock className="w-3.5 h-3.5 text-amber-600" />
                      <span>SUBSCRIBER 24/7 WEBHOOK PIPELINE</span>
                    </div>
                    <h3 className="text-2xl font-bold text-[#0d0e10] font-heading">
                      Autonomous Inbound Webhooks
                    </h3>
                    <p className="text-xs sm:text-sm text-[#75766f] font-sans leading-relaxed">
                      Connect your CMS, Substack RSS feeds, Notion databases, or Zapier webhooks to trigger instant omnichannel cascades 24/7 without opening this dashboard.
                    </p>
                  </div>
                  <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
                    <button
                      onClick={() => openAuthWithMode('upgrade')}
                      className="w-full sm:w-auto px-6 py-3 rounded-full bg-[#d4ff3a] hover:bg-[#c6f02e] text-[#0d0e10] font-mono text-xs font-bold transition-all cursor-pointer shadow-md flex items-center justify-center gap-2"
                    >
                      <Crown className="w-4 h-4" />
                      <span>UPGRADE TO UNLOCK WEBHOOKS</span>
                    </button>
                    <button
                      onClick={() => setActiveStudioTab('execution')}
                      className="w-full sm:w-auto px-5 py-3 rounded-full bg-white hover:bg-[#eeeee8] border border-[#dcdcd3] text-[#0d0e10] font-mono text-xs font-semibold transition-colors cursor-pointer"
                    >
                      Return to Runner
                    </button>
                  </div>
                </div>
              ) : (
                <AutomationTriggers
                  onSimulateWebhook={handleSimulateWebhook}
                  isSimulating={isRunning}
                />
              )}
            </div>
          )}

          {/* Campaign Run Archive */}
          <CampaignHistory
            history={history}
            onSelectCampaign={(item) => {
              setResult(item);
              setActiveStudioTab('omnichannel');
              showToast(`Loaded campaign: ${item.meta.workflowId}`);
            }}
            onClearHistory={handleClearHistory}
            currentWorkflowId={result?.meta.workflowId}
          />
        </main>
      )}
      </div>
    </div>
  );
}
