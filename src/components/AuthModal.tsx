import React, { useState, useEffect } from 'react';
import {
  X,
  Mail,
  Lock,
  ArrowRight,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  Zap,
  Crown,
  Key,
} from 'lucide-react';
import { UserProfile, UserSubscriptionTier } from '../types';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserProfile | null;
  onLogin: (user: UserProfile) => void;
  onUpgradeTier?: (tier: UserSubscriptionTier) => void;
  initialMode?: 'login' | 'upgrade';
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onLogin,
  onUpgradeTier,
  initialMode = 'login',
}) => {
  const [mode, setMode] = useState<'login' | 'signup' | 'upgrade'>(initialMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [selectedTier, setSelectedTier] = useState<UserSubscriptionTier>('free');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      if (initialMode === 'upgrade' || (currentUser && !currentUser.isSubscribed)) {
        setMode('upgrade');
      } else {
        setMode(initialMode || 'login');
      }
      setError(null);
    }
  }, [isOpen, initialMode, currentUser]);

  // Lock background scroll when open
  useEffect(() => {
    if (isOpen) {
      const originalStyle = window.getComputedStyle(document.body).overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = originalStyle;
      };
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleAuthSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email || !email.includes('@')) {
      setError('Please provide a valid work or corporate email address.');
      return;
    }

    if (mode !== 'upgrade' && (!password || password.length < 4)) {
      setError('Password must be at least 4 characters.');
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      const userName = name || email.split('@')[0].replace(/[^a-zA-Z0-9]/g, ' ');
      const formattedName =
        userName.charAt(0).toUpperCase() + userName.slice(1);

      const user: UserProfile = {
        id: `usr_${Date.now()}`,
        email,
        name: formattedName,
        tier: selectedTier,
        isSubscribed: selectedTier !== 'free',
        runsUsedThisMonth: 0,
        monthlyQuota: selectedTier === 'free' ? 3 : selectedTier === 'starter' ? 15 : 9999,
      };

      onLogin(user);
      setIsSubmitting(false);
      onClose();
    }, 400);
  };

  const handleSelectUpgrade = (tier: UserSubscriptionTier) => {
    if (onUpgradeTier) {
      onUpgradeTier(tier);
      onClose();
    }
  };

  const handleQuickDemoLogin = (tier: UserSubscriptionTier) => {
    setIsSubmitting(true);
    setTimeout(() => {
      const demoUser: UserProfile = {
        id: `usr_demo_${Date.now()}`,
        email: tier === 'free' ? 'visitor@example.com' : 'founder@javarif.ai',
        name: tier === 'free' ? 'Free Explorer' : tier === 'starter' ? 'Solo Founder' : 'Growth Operator',
        tier: tier,
        isSubscribed: tier !== 'free',
        runsUsedThisMonth: 0,
        monthlyQuota: tier === 'free' ? 3 : tier === 'starter' ? 15 : 9999,
      };
      onLogin(demoUser);
      setIsSubmitting(false);
      onClose();
    }, 300);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-[#0d0e10]/75 backdrop-blur-md animate-fade-in"
      onClick={(e) => {
        // Prevent background clicks from doing anything outside the modal dialog
        e.stopPropagation();
      }}
    >
      <div
        className="relative w-full max-w-lg bg-white border border-[#dcdcd3] rounded-3xl sm:rounded-4xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Ribbon */}
        <div className="px-6 py-4.5 border-b border-[#eeeee8] flex items-center justify-between bg-[#eeeee8]/50">
          <div className="flex items-center gap-2.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#d4ff3a] animate-pulse" />
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#0d0e10]">
              {mode === 'upgrade'
                ? 'SUBSCRIPTION TIER & LIMITS'
                : mode === 'signup'
                ? 'CREATE OPERATOR ACCOUNT'
                : 'OPERATOR AUTHENTICATION'}
            </span>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-[#75766f] hover:text-[#0d0e10] hover:bg-black/5 transition-colors cursor-pointer"
            title="Close dialog"
          >
            <X className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </div>

        {/* Modal Scroll Content */}
        <div className="p-6 sm:p-8 overflow-y-auto space-y-6">
          {mode === 'upgrade' ? (
            /* Upgrade / Subscription Plan View */
            <div className="space-y-6">
              <div className="space-y-2">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#0d0e10] text-[#d4ff3a] text-xs font-mono font-bold">
                  <Crown className="w-3.5 h-3.5" />
                  <span>UPGRADE TO UNLOCK ALL STUDIO MODULES</span>
                </div>
                <h3 className="text-2xl font-extrabold text-[#0d0e10] font-heading tracking-tight">
                  Free tier vs. Subscribed Operators
                </h3>
                <p className="text-xs sm:text-sm text-[#75766f] font-sans leading-relaxed">
                  Unsubscribed accounts can test up to 3 pipeline runs with preview channel outputs. Subscribed operators unlock the full 6-channel omnichannel matrix, continuous webhooks, and calendar cadence.
                </p>
              </div>

              {/* Tiers Comparison Cards */}
              <div className="space-y-3">
                {/* Free Tier Card */}
                <div
                  onClick={() => setSelectedTier('free')}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                    selectedTier === 'free'
                      ? 'border-[#0d0e10] bg-[#eeeee8]/60 shadow-xs'
                      : 'border-[#dcdcd3] bg-white hover:border-[#0d0e10]/40'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-bold uppercase text-[#75766f]">
                        FREE EXPLORER
                      </span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#eeeee8] text-[#0d0e10]">
                        Limited
                      </span>
                    </div>
                    <span className="text-sm font-bold font-mono text-[#0d0e10]">$0 / mo</span>
                  </div>
                  <p className="text-xs text-[#75766f] mt-1.5">
                    3 runs/month · LinkedIn & X preview · Frontier models included · Webhooks locked
                  </p>
                </div>

                {/* Starter Tier Card */}
                <div
                  onClick={() => setSelectedTier('starter')}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                    selectedTier === 'starter'
                      ? 'border-[#0d0e10] bg-[#eeeee8]/60 shadow-xs'
                      : 'border-[#dcdcd3] bg-white hover:border-[#0d0e10]/40'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-bold uppercase text-[#0d0e10]">
                        STARTER SUBSCRIBER
                      </span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#d4ff3a] text-[#0d0e10] font-bold">
                        Popular for Founders
                      </span>
                    </div>
                    <span className="text-sm font-bold font-mono text-[#0d0e10]">$2,400 / mo</span>
                  </div>
                  <p className="text-xs text-[#75766f] mt-1.5">
                    15 runs/month · Full 6-channel omnichannel matrix · Automated Cadence · Markdown & JSON export
                  </p>
                </div>

                {/* Growth Tier Card */}
                <div
                  onClick={() => setSelectedTier('growth')}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                    selectedTier === 'growth'
                      ? 'border-[#0d0e10] bg-[#0d0e10] text-white shadow-md'
                      : 'border-[#dcdcd3] bg-white hover:border-[#0d0e10]/40'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-xs font-mono font-bold uppercase ${
                          selectedTier === 'growth' ? 'text-[#d4ff3a]' : 'text-[#0d0e10]'
                        }`}
                      >
                        GROWTH UNLIMITED
                      </span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#d4ff3a] text-[#0d0e10] font-bold">
                        Uncapped
                      </span>
                    </div>
                    <span
                      className={`text-sm font-bold font-mono ${
                        selectedTier === 'growth' ? 'text-white' : 'text-[#0d0e10]'
                      }`}
                    >
                      $4,800 / mo
                    </span>
                  </div>
                  <p
                    className={`text-xs mt-1.5 ${
                      selectedTier === 'growth' ? 'text-zinc-300' : 'text-[#75766f]'
                    }`}
                  >
                    Unlimited runs · Full Webhooks 24/7 endpoint · All models + Ensemble auto-routing · Priority SLA
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    if (currentUser) {
                      handleSelectUpgrade(selectedTier);
                    } else {
                      setMode('signup');
                    }
                  }}
                  className="w-full py-3.5 rounded-full bg-[#d4ff3a] hover:bg-[#c6f02e] text-[#0d0e10] font-mono text-xs font-bold transition-all cursor-pointer shadow-md flex items-center justify-center gap-2"
                >
                  <span>
                    {currentUser
                      ? `CONFIRM ${selectedTier.toUpperCase()} SUBSCRIPTION`
                      : `CONTINUE WITH ${selectedTier.toUpperCase()}`}
                  </span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                {!currentUser && (
                  <button
                    type="button"
                    onClick={() => handleQuickDemoLogin(selectedTier)}
                    className="w-full py-3 rounded-full bg-white hover:bg-[#eeeee8] text-[#0d0e10] border border-[#dcdcd3] font-mono text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-2"
                  >
                    <Zap className="w-3.5 h-3.5" />
                    <span>ONE-CLICK DEMO LOGIN AS {selectedTier.toUpperCase()}</span>
                  </button>
                )}
              </div>
            </div>
          ) : (
            /* Login & Sign Up Form */
            <form onSubmit={handleAuthSubmit} className="space-y-4">
              <div className="space-y-1">
                <h3 className="text-2xl font-extrabold text-[#0d0e10] font-heading tracking-tight">
                  {mode === 'login' ? 'Welcome back, Operator' : 'Initialize Studio Credentials'}
                </h3>
                <p className="text-xs text-[#75766f] font-sans">
                  {mode === 'login'
                    ? 'Authenticate to access your private studio workspace and campaigns.'
                    : 'Create your operator account to begin generating synchronized omnichannel assets.'}
                </p>
              </div>

              {error && (
                <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-mono">
                  {error}
                </div>
              )}

              {mode === 'signup' && (
                <div className="space-y-1.5">
                  <label className="text-[11px] font-mono uppercase tracking-wider text-[#75766f] font-semibold">
                    Full Name / Call-Sign
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Alex Vance"
                    className="w-full px-4 py-2.5 rounded-xl border border-[#dcdcd3] bg-[#eeeee8] focus:bg-white focus:outline-none focus:border-[#0d0e10] text-xs font-mono text-[#0d0e10]"
                  />
                </div>
              )}

              <div className="space-y-1.5">
                <label className="text-[11px] font-mono uppercase tracking-wider text-[#75766f] font-semibold flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-[#0d0e10]" />
                  <span>Work Email Address</span>
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="operator@company.com"
                  className="w-full px-4 py-2.5 rounded-xl border border-[#dcdcd3] bg-[#eeeee8] focus:bg-white focus:outline-none focus:border-[#0d0e10] text-xs font-mono text-[#0d0e10]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-mono uppercase tracking-wider text-[#75766f] font-semibold flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-[#0d0e10]" />
                  <span>Password</span>
                </label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full px-4 py-2.5 rounded-xl border border-[#dcdcd3] bg-[#eeeee8] focus:bg-white focus:outline-none focus:border-[#0d0e10] text-xs font-mono text-[#0d0e10]"
                />
              </div>

              {mode === 'signup' && (
                <div className="p-3 rounded-2xl bg-[#eeeee8] border border-[#dcdcd3] space-y-1.5">
                  <span className="text-[11px] font-mono text-[#0d0e10] font-bold block">
                    Starting Plan:
                  </span>
                  <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                    <button
                      type="button"
                      onClick={() => setSelectedTier('free')}
                      className={`p-2 rounded-xl border text-center transition-all ${
                        selectedTier === 'free'
                          ? 'border-[#0d0e10] bg-white font-bold shadow-xs'
                          : 'border-transparent text-[#75766f]'
                      }`}
                    >
                      Free (3 runs)
                    </button>
                    <button
                      type="button"
                      onClick={() => setSelectedTier('growth')}
                      className={`p-2 rounded-xl border text-center transition-all ${
                        selectedTier === 'growth'
                          ? 'border-[#0d0e10] bg-[#0d0e10] text-[#d4ff3a] font-bold shadow-xs'
                          : 'border-transparent text-[#75766f]'
                      }`}
                    >
                      Growth (All features)
                    </button>
                  </div>
                </div>
              )}

              <div className="pt-2 space-y-2.5">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3.5 rounded-full bg-[#0d0e10] hover:bg-black text-[#d4ff3a] font-mono text-xs font-bold transition-all cursor-pointer shadow-md flex items-center justify-center gap-2"
                >
                  <Key className="w-4 h-4" />
                  <span>
                    {isSubmitting
                      ? 'AUTHENTICATING...'
                      : mode === 'login'
                      ? 'SIGN IN TO STUDIO'
                      : 'CREATE ACCOUNT & ENTER STUDIO'}
                  </span>
                </button>

                {/* Instant 1-click test logins */}
                <div className="pt-2 border-t border-[#eeeee8] space-y-2">
                  <span className="text-[10px] font-mono text-[#75766f] uppercase block text-center">
                    Fast evaluation access (Instant Demo)
                  </span>
                  <div className="grid grid-cols-2 gap-2 font-mono text-[11px]">
                    <button
                      type="button"
                      onClick={() => handleQuickDemoLogin('free')}
                      className="p-2.5 rounded-xl border border-[#dcdcd3] bg-white hover:bg-[#eeeee8] text-[#0d0e10] text-center font-bold transition-colors cursor-pointer"
                    >
                      Demo Free User
                    </button>
                    <button
                      type="button"
                      onClick={() => handleQuickDemoLogin('growth')}
                      className="p-2.5 rounded-xl border border-[#0d0e10] bg-[#d4ff3a] hover:bg-[#c6f02e] text-[#0d0e10] text-center font-bold transition-colors cursor-pointer"
                    >
                      Demo Pro Subscriber ★
                    </button>
                  </div>
                </div>
              </div>

              {/* Toggle Login / Signup */}
              <div className="pt-2 text-center text-xs font-mono text-[#75766f]">
                {mode === 'login' ? (
                  <p>
                    Don't have an operator account?{' '}
                    <button
                      type="button"
                      onClick={() => {
                        setMode('signup');
                        setError(null);
                      }}
                      className="text-[#0d0e10] underline font-bold hover:text-black cursor-pointer"
                    >
                      Register here
                    </button>
                  </p>
                ) : (
                  <p>
                    Already have credentials?{' '}
                    <button
                      type="button"
                      onClick={() => {
                        setMode('login');
                        setError(null);
                      }}
                      className="text-[#0d0e10] underline font-bold hover:text-black cursor-pointer"
                    >
                      Sign In
                    </button>
                  </p>
                )}
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
