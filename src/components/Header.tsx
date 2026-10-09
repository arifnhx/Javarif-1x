import React, { useState } from 'react';
import { Menu, X, Sparkles, HelpCircle, ArrowRight, User, LogOut, Crown, ShieldAlert } from 'lucide-react';
import { UserProfile } from '../types';

interface HeaderProps {
  currentView: 'home' | 'studio';
  setCurrentView: (view: 'home' | 'studio') => void;
  onOpenConsultation: () => void;
  onOpenOnboarding?: () => void;
  currentUser: UserProfile | null;
  onOpenLogin: () => void;
  onLogout: () => void;
  onOpenUpgrade: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentView,
  setCurrentView,
  onOpenConsultation,
  onOpenOnboarding,
  currentUser,
  onOpenLogin,
  onLogout,
  onOpenUpgrade,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const handleNavClick = (sectionId?: string) => {
    setMobileMenuOpen(false);
    setUserDropdownOpen(false);
    if (sectionId) {
      setCurrentView('home');
      setTimeout(() => {
        const el = document.getElementById(sectionId);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 50);
    }
  };

  const handleStudioClick = () => {
    setMobileMenuOpen(false);
    setUserDropdownOpen(false);
    if (!currentUser) {
      onOpenLogin();
      return;
    }
    setCurrentView('studio');
  };

  return (
    <header className="sticky top-0 z-40 border-b border-[#dcdcd3] bg-[#eeeee8]/90 backdrop-blur-md transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-18 flex items-center justify-between">
        {/* Zone 1: Wordmark & Live Ping */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              setCurrentView('home');
              setMobileMenuOpen(false);
            }}
            className="text-xl font-extrabold tracking-tight text-[#0d0e10] font-heading hover:opacity-80 transition-opacity cursor-pointer flex items-center gap-2 group"
          >
            <span className="font-display tracking-tight">JAVARIF</span>
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#d4ff3a] opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#d4ff3a]" />
            </span>
          </button>
        </div>

        {/* Zone 2: Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-6 lg:gap-7 text-xs font-mono tracking-wider text-[#75766f]">
          <button
            onClick={() => handleNavClick('capabilities')}
            className="hover:text-[#0d0e10] transition-colors cursor-pointer py-1 relative hover:after:w-full after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[2px] after:bg-[#d4ff3a] after:transition-all"
          >
            [01] ENGINE
          </button>
          <button
            onClick={() => handleNavClick('mechanism')}
            className="hover:text-[#0d0e10] transition-colors cursor-pointer py-1 relative hover:after:w-full after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[2px] after:bg-[#d4ff3a] after:transition-all"
          >
            [02] CHANNELS
          </button>
          <button
            onClick={() => handleNavClick('calculator')}
            className="hover:text-[#0d0e10] transition-colors cursor-pointer py-1 relative hover:after:w-full after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[2px] after:bg-[#d4ff3a] after:transition-all"
          >
            [03] VELOCITY
          </button>
          <button
            onClick={() => handleNavClick('pricing')}
            className="hover:text-[#0d0e10] transition-colors cursor-pointer py-1 relative hover:after:w-full after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[2px] after:bg-[#d4ff3a] after:transition-all"
          >
            [04] PLANS
          </button>
          <button
            onClick={() => handleNavClick('faq')}
            className="hover:text-[#0d0e10] transition-colors cursor-pointer py-1 relative hover:after:w-full after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[2px] after:bg-[#d4ff3a] after:transition-all"
          >
            [05] FAQ
          </button>

          <button
            onClick={handleStudioClick}
            className={`transition-all cursor-pointer font-bold px-3 py-1 rounded-full flex items-center gap-1.5 ${
              currentView === 'studio'
                ? 'bg-[#0d0e10] text-[#d4ff3a]'
                : 'text-[#0d0e10] hover:bg-black/5'
            }`}
          >
            <span>[STUDIO]</span>
            {!currentUser && (
              <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-black/10 text-[#75766f]">
                LOCK
              </span>
            )}
          </button>

          {onOpenOnboarding && (
            <button
              onClick={onOpenOnboarding}
              className="text-[#75766f] hover:text-[#0d0e10] transition-colors cursor-pointer flex items-center gap-1 hover:bg-black/5 px-2 py-1 rounded-full"
              title="Open Guided Tour"
            >
              <HelpCircle className="w-3.5 h-3.5" />
              <span>TOUR</span>
            </button>
          )}
        </nav>

        {/* Zone 3: Primary Actions (Desktop & Tablet) */}
        <div className="flex items-center gap-2 sm:gap-3">
          {onOpenOnboarding && (
            <button
              onClick={onOpenOnboarding}
              className="md:hidden p-2 rounded-full text-[#0d0e10] hover:bg-black/5 border border-[#dcdcd3] bg-white transition-colors cursor-pointer"
              title="Interactive Tour"
            >
              <HelpCircle className="w-4 h-4" />
            </button>
          )}

          {/* User Auth or Profile Section */}
          {currentUser ? (
            <div className="relative">
              <button
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-[#dcdcd3] bg-white hover:border-[#0d0e10] transition-colors cursor-pointer shadow-2xs font-mono text-xs"
              >
                <span className="w-2 h-2 rounded-full bg-[#d4ff3a]" />
                <span className="font-bold text-[#0d0e10] max-w-[100px] truncate">
                  {currentUser.name}
                </span>
                <span
                  className={`text-[9px] px-2 py-0.5 rounded-full font-bold uppercase ${
                    currentUser.isSubscribed
                      ? 'bg-[#0d0e10] text-[#d4ff3a]'
                      : 'bg-[#eeeee8] text-[#75766f]'
                  }`}
                >
                  {currentUser.tier}
                </span>
              </button>

              {userDropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-white border border-[#dcdcd3] shadow-2xl p-2 z-50 animate-fade-in font-mono text-xs space-y-1">
                  <div className="p-2 border-b border-[#eeeee8]">
                    <div className="font-bold text-[#0d0e10] truncate">{currentUser.email}</div>
                    <div className="text-[11px] text-[#75766f] mt-0.5 flex items-center justify-between">
                      <span>Status:</span>
                      <span className="font-bold text-[#0d0e10] uppercase">
                        {currentUser.isSubscribed ? `${currentUser.tier} Member` : 'Free Explorer'}
                      </span>
                    </div>
                  </div>

                  {!currentUser.isSubscribed ? (
                    <button
                      onClick={() => {
                        setUserDropdownOpen(false);
                        onOpenUpgrade();
                      }}
                      className="w-full text-left px-3 py-2 rounded-xl bg-[#d4ff3a] hover:bg-[#c6f02e] text-[#0d0e10] font-bold flex items-center justify-between cursor-pointer"
                    >
                      <span>UPGRADE TO PRO</span>
                      <Crown className="w-3.5 h-3.5" />
                    </button>
                  ) : (
                    <button
                      onClick={() => {
                        setUserDropdownOpen(false);
                        onOpenUpgrade();
                      }}
                      className="w-full text-left px-3 py-2 rounded-xl hover:bg-[#eeeee8] text-[#0d0e10] font-semibold flex items-center justify-between cursor-pointer"
                    >
                      <span>MANAGE PLAN</span>
                      <Crown className="w-3.5 h-3.5 text-[#0d0e10]" />
                    </button>
                  )}

                  <button
                    onClick={() => {
                      setUserDropdownOpen(false);
                      onLogout();
                    }}
                    className="w-full text-left px-3 py-2 rounded-xl text-red-600 hover:bg-red-50 font-semibold flex items-center justify-between cursor-pointer"
                  >
                    <span>SIGN OUT</span>
                    <LogOut className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={onOpenLogin}
              className="px-3.5 sm:px-4 py-2 text-xs font-mono font-semibold text-[#0d0e10] bg-white hover:bg-white/90 border border-[#dcdcd3] hover:border-[#0d0e10] transition-all rounded-full cursor-pointer shadow-2xs flex items-center gap-1.5"
            >
              <User className="w-3.5 h-3.5 text-[#0d0e10]" />
              <span>LOG IN</span>
            </button>
          )}

          <button
            onClick={handleStudioClick}
            className="px-4 sm:px-5 py-2 sm:py-2.5 text-xs font-mono font-bold text-[#0d0e10] bg-[#d4ff3a] hover:bg-[#c6f02e] transition-all rounded-full whitespace-nowrap cursor-pointer shadow-sm hover:shadow-md active:scale-95 duration-150 btn-spring flex items-center gap-1.5"
          >
            <span className="hidden xs:inline">
              {currentUser ? 'OPEN STUDIO' : 'SIGN IN & LAUNCH'}
            </span>
            <span className="xs:hidden">STUDIO</span>
            <span>→</span>
          </button>

          {/* Mobile Menu Hamburger Toggle */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-full border border-[#dcdcd3] bg-white text-[#0d0e10] hover:bg-[#eeeee8] transition-colors cursor-pointer ml-1"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Navigation Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-[#dcdcd3] bg-white/95 backdrop-blur-xl px-5 py-6 space-y-4 shadow-xl animate-fade-in">
          {currentUser && (
            <div className="p-3 rounded-2xl bg-[#eeeee8] border border-[#dcdcd3] flex items-center justify-between font-mono text-xs">
              <div>
                <span className="font-bold text-[#0d0e10] block">{currentUser.name}</span>
                <span className="text-[10px] text-[#75766f]">{currentUser.email}</span>
              </div>
              <span
                className={`text-[9px] px-2 py-0.5 rounded-full font-bold uppercase ${
                  currentUser.isSubscribed
                    ? 'bg-[#0d0e10] text-[#d4ff3a]'
                    : 'bg-white text-[#75766f] border border-[#dcdcd3]'
                }`}
              >
                {currentUser.tier}
              </span>
            </div>
          )}

          <div className="flex flex-col space-y-1 font-mono text-xs">
            <button
              onClick={() => handleNavClick('capabilities')}
              className="text-left px-3 py-2.5 rounded-xl text-[#0d0e10] hover:bg-[#eeeee8] transition-colors font-semibold flex items-center justify-between"
            >
              <span>[01] ENGINE CAPABILITIES</span>
              <span className="text-[#75766f]">→</span>
            </button>
            <button
              onClick={() => handleNavClick('mechanism')}
              className="text-left px-3 py-2.5 rounded-xl text-[#0d0e10] hover:bg-[#eeeee8] transition-colors font-semibold flex items-center justify-between"
            >
              <span>[02] CHANNELS & PIPELINE</span>
              <span className="text-[#75766f]">→</span>
            </button>
            <button
              onClick={() => handleNavClick('calculator')}
              className="text-left px-3 py-2.5 rounded-xl text-[#0d0e10] hover:bg-[#eeeee8] transition-colors font-semibold flex items-center justify-between"
            >
              <span>[03] VELOCITY CALCULATOR</span>
              <span className="text-[#75766f]">→</span>
            </button>
            <button
              onClick={() => handleNavClick('pricing')}
              className="text-left px-3 py-2.5 rounded-xl text-[#0d0e10] hover:bg-[#eeeee8] transition-colors font-semibold flex items-center justify-between"
            >
              <span>[04] PLANS & RETAINERS</span>
              <span className="text-[#75766f]">→</span>
            </button>
            <button
              onClick={() => handleNavClick('faq')}
              className="text-left px-3 py-2.5 rounded-xl text-[#0d0e10] hover:bg-[#eeeee8] transition-colors font-semibold flex items-center justify-between"
            >
              <span>[05] FREQUENTLY ASKED QUESTIONS</span>
              <span className="text-[#75766f]">→</span>
            </button>
            <button
              onClick={handleStudioClick}
              className="text-left px-3 py-2.5 rounded-xl bg-[#0d0e10] text-[#d4ff3a] font-bold flex items-center justify-between shadow-xs"
            >
              <span>{currentUser ? '[STUDIO] OPEN WORKSPACE' : '[STUDIO] LOGIN TO ACCESS'}</span>
              <span>→</span>
            </button>
          </div>

          <div className="pt-3 border-t border-[#eeeee8] flex flex-col gap-2.5 font-mono text-xs">
            {!currentUser ? (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenLogin();
                }}
                className="w-full py-3 rounded-full bg-[#0d0e10] text-white hover:bg-black font-bold flex items-center justify-center gap-2 cursor-pointer"
              >
                <User className="w-4 h-4 text-[#d4ff3a]" />
                <span>SIGN IN / OPERATOR LOGIN</span>
              </button>
            ) : !currentUser.isSubscribed ? (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenUpgrade();
                }}
                className="w-full py-3 rounded-full bg-[#d4ff3a] text-[#0d0e10] hover:bg-[#c6f02e] font-bold flex items-center justify-center gap-2 cursor-pointer shadow-xs"
              >
                <Crown className="w-4 h-4" />
                <span>UPGRADE TO UNLOCK ALL FEATURES</span>
              </button>
            ) : (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onLogout();
                }}
                className="w-full py-3 rounded-full border border-red-200 bg-red-50 text-red-700 font-bold flex items-center justify-center gap-2 cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
                <span>LOG OUT</span>
              </button>
            )}

            {onOpenOnboarding && (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenOnboarding();
                }}
                className="w-full py-3 rounded-full border border-[#dcdcd3] text-[#0d0e10] hover:bg-[#eeeee8] font-bold flex items-center justify-center gap-2 cursor-pointer"
              >
                <HelpCircle className="w-4 h-4 text-[#0d0e10]" />
                <span>START GUIDED TOUR</span>
              </button>
            )}

            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenConsultation();
              }}
              className="w-full py-3 rounded-full bg-white border border-[#0d0e10] text-[#0d0e10] hover:bg-black/5 font-bold flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>BOOK ARCHITECTURAL AUDIT</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
