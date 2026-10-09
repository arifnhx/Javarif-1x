import React, { useState } from 'react';
import {
  Linkedin,
  Twitter,
  FileText,
  Video,
  Mail,
  Sliders,
  Copy,
  Check,
  Download,
  Share2,
  Sparkles,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  Flame,
  Target,
  BarChart2,
  RefreshCw,
  Code2,
} from 'lucide-react';
import { WorkflowExecutionResult } from '../types';
import { Lock, Crown } from 'lucide-react';

interface OmnichannelHubProps {
  result: WorkflowExecutionResult | null;
  onRegenerateChannel?: (channel: string, promptModifier?: string) => void;
  isRegenerating?: boolean;
  isSubscribed?: boolean;
  onOpenUpgrade?: () => void;
}

export const OmnichannelHub: React.FC<OmnichannelHubProps> = ({
  result,
  onRegenerateChannel,
  isRegenerating = false,
  isSubscribed = false,
  onOpenUpgrade,
}) => {
  const [activePlatform, setActivePlatform] = useState<
    'linkedin' | 'twitter' | 'blog' | 'youtube' | 'newsletter' | 'carousel' | 'export'
  >('linkedin');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [currentSlideIndex, setCurrentSlideIndex] = useState<number>(0);

  if (!result) {
    return (
      <div className="bg-white border border-[#dcdcd3] rounded-3xl p-12 text-center max-w-2xl mx-auto my-8 shadow-xs">
        <div className="w-16 h-16 rounded-full bg-[#eeeee8] border border-[#dcdcd3] flex items-center justify-center mx-auto text-[#0d0e10] mb-4 shadow-2xs">
          <Sparkles className="w-8 h-8 animate-pulse text-[#0d0e10]" />
        </div>
        <h3 className="text-xl font-bold text-[#0d0e10] font-heading">No Active Content Pipeline Yet</h3>
        <p className="text-xs sm:text-sm text-[#75766f] mt-2 font-sans max-w-md mx-auto">
          Run your first automated content workflow to generate synchronized posts for LinkedIn, Twitter, SEO Blog, YouTube, Newsletter, and Carousel.
        </p>
      </div>
    );
  }

  const { channels, scoring, angles, meta } = result;

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleDownloadMarkdown = () => {
    const fullMarkdown = `# Javarif Content Automation Package
**Topic:** ${meta.topic}
**Brand Tone:** ${meta.brandVoice}
**Generated:** ${meta.generatedAt}
**Virality Score:** ${scoring.viralityScore}/100

---

## 1. LinkedIn Post
${channels.linkedin.headline}

${channels.linkedin.body}

${channels.linkedin.callToAction}

${channels.linkedin.hashtags.join(' ')}

---

## 2. Twitter / X Thread
${channels.twitter.threads.join('\n\n')}

---

## 3. SEO Long-Form Article
# ${channels.blog.title}
*Meta Description: ${channels.blog.metaDescription}*

${channels.blog.markdown}

---

## 4. YouTube / TikTok Shorts Script
**Title:** ${channels.youtubeScript.title}
**Pacing:** ${channels.youtubeScript.pacing}

${channels.youtubeScript.beats.map((b) => `[${b.timestamp}]\nVisual: ${b.visual}\nAudio: ${b.spokenAudio}`).join('\n\n')}

---

## 5. Subscriber Newsletter
**Subject Lines:**
${channels.newsletter.subjectLines.map((s, i) => `${i + 1}. ${s}`).join('\n')}

**Preview:** ${channels.newsletter.previewSnippet}

${channels.newsletter.body}

---

## 6. Carousel Deck
${channels.carouselSlides.map((s) => `Slide ${s.slideNumber}: ${s.title}\n${s.subtitle}`).join('\n\n')}
`;

    const blob = new Blob([fullMarkdown], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `javarif-content-${meta.workflowId}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Performance & Virality Intelligence Header Bar */}
      <div className="bg-white border border-[#dcdcd3] rounded-3xl p-6 sm:p-7 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-[#eeeee8]">
          <div>
            <div className="flex items-center space-x-2 text-xs font-mono text-[#0d0e10] font-bold flex-wrap">
              <span className="w-2 h-2 rounded-full bg-[#d4ff3a]" />
              <span>[EXECUTION ID: {meta.workflowId}]</span>
              <span className="text-[#dcdcd3]">·</span>
              <span className="px-2 py-0.5 rounded-full bg-[#0d0e10] text-[#d4ff3a] text-[10px]">
                {meta.modelName || 'Anthropic / Multi-Model Engine'}
              </span>
              <span className="text-[#dcdcd3]">·</span>
              <span className="text-[#75766f]">{new Date(meta.generatedAt).toLocaleTimeString()}</span>
            </div>
            <h2 className="text-lg font-bold text-[#0d0e10] font-heading mt-1 line-clamp-1">
              {meta.topic}
            </h2>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={handleDownloadMarkdown}
              className="flex items-center space-x-1.5 px-4 py-2 rounded-full bg-[#eeeee8] hover:bg-white text-[#0d0e10] text-xs font-mono font-medium border border-[#dcdcd3] hover:border-[#0d0e10] transition-all cursor-pointer active:scale-95 shadow-2xs"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export Markdown</span>
            </button>
            <button
              onClick={() => handleCopy(JSON.stringify(result, null, 2), 'full-json')}
              className="flex items-center space-x-1.5 px-4 py-2 rounded-full bg-[#d4ff3a] hover:bg-[#c6f02e] text-[#0d0e10] text-xs font-mono font-bold transition-all cursor-pointer active:scale-95 shadow-2xs btn-spring"
            >
              {copiedKey === 'full-json' ? <Check className="w-3.5 h-3.5 text-[#0d0e10]" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedKey === 'full-json' ? 'Copied JSON!' : 'Copy JSON'}</span>
            </button>
          </div>
        </div>

        {/* Scoring Badges */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mt-4">
          <div className="p-3.5 rounded-2xl bg-[#0d0e10] text-white border border-black flex items-center space-x-3">
            <div className="p-2 rounded-xl bg-white/10 text-[#d4ff3a]">
              <Flame className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] text-zinc-400 font-mono block">Virality Score</span>
              <span className="text-sm font-black text-[#d4ff3a] font-mono">{scoring.viralityScore}%</span>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-[#eeeee8] border border-[#dcdcd3] flex items-center space-x-3">
            <div className="p-2 rounded-xl bg-white text-[#0d0e10] border border-[#dcdcd3]">
              <Target className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] text-[#75766f] font-mono block">Hook Power</span>
              <span className="text-sm font-bold text-[#0d0e10] font-mono">{scoring.hookPowerScore}%</span>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-[#eeeee8] border border-[#dcdcd3] flex items-center space-x-3">
            <div className="p-2 rounded-xl bg-white text-[#0d0e10] border border-[#dcdcd3]">
              <BarChart2 className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] text-[#75766f] font-mono block">SEO Score</span>
              <span className="text-sm font-bold text-[#0d0e10] font-mono">{scoring.seoScore}%</span>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-[#eeeee8] border border-[#dcdcd3] flex items-center space-x-3">
            <div className="p-2 rounded-xl bg-white text-[#0d0e10] border border-[#dcdcd3]">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] text-[#75766f] font-mono block">Clarity Index</span>
              <span className="text-sm font-bold text-[#0d0e10] font-mono">{scoring.clarityScore}%</span>
            </div>
          </div>

          <div className="col-span-2 sm:col-span-2 lg:col-span-2 p-3.5 rounded-2xl bg-[#eeeee8] border border-[#dcdcd3] flex items-center justify-between">
            <div>
              <span className="text-[10px] text-[#75766f] font-mono block">Target Audience Persona</span>
              <span className="text-xs font-semibold text-[#0d0e10] line-clamp-1">{scoring.targetPersona}</span>
            </div>
            <span className="text-[10px] font-mono px-3 py-1 rounded-full bg-white border border-[#dcdcd3] text-[#0d0e10] font-semibold">
              {scoring.estimatedReadTime}
            </span>
          </div>
        </div>
      </div>

      {/* Main Omnichannel Deck */}
      <div className="bg-white border border-[#dcdcd3] rounded-3xl overflow-hidden shadow-xs">
        {/* Platform Selector Navigation Bar */}
        <div className="flex items-center overflow-x-auto no-scrollbar border-b border-[#eeeee8] bg-[#eeeee8]/60 px-4 py-2 gap-2">
          {[
            { id: 'linkedin', label: 'LinkedIn Post', icon: Linkedin, isPro: false },
            { id: 'twitter', label: 'X / Twitter Thread', icon: Twitter, isPro: false },
            { id: 'blog', label: 'SEO Long-Form Blog', icon: FileText, isPro: true },
            { id: 'youtube', label: 'YouTube / Reels Script', icon: Video, isPro: true },
            { id: 'newsletter', label: 'Email Newsletter', icon: Mail, isPro: true },
            { id: 'carousel', label: 'Visual Carousel Deck', icon: Sliders, isPro: true },
            { id: 'export', label: 'API & Webhooks', icon: Code2, isPro: true },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activePlatform === tab.id;
            const isLocked = tab.isPro && !isSubscribed;

            return (
              <button
                key={tab.id}
                onClick={() => setActivePlatform(tab.id as any)}
                className={`flex items-center space-x-2 px-3.5 sm:px-4 py-2 rounded-full text-xs font-mono font-medium whitespace-nowrap transition-all cursor-pointer ${
                  isActive
                    ? 'bg-[#0d0e10] text-[#d4ff3a] font-bold shadow-xs'
                    : 'text-[#75766f] hover:text-[#0d0e10] hover:bg-white'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
                {isLocked && (
                  <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-amber-100 text-amber-800 font-bold flex items-center gap-0.5">
                    <Lock className="w-2.5 h-2.5" />
                    <span>PRO</span>
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Channel Preview Content Area */}
        <div className="p-6 sm:p-8 relative">
          {/* Unsubscribed lock barrier for Pro channels */}
          {!isSubscribed && ['blog', 'youtube', 'newsletter', 'carousel', 'export'].includes(activePlatform) && (
            <div className="p-8 sm:p-12 text-center max-w-xl mx-auto space-y-5 bg-[#eeeee8]/50 border border-[#dcdcd3] rounded-3xl animate-fade-in">
              <div className="w-14 h-14 rounded-full bg-[#0d0e10] text-[#d4ff3a] flex items-center justify-center mx-auto shadow-md">
                <Crown className="w-7 h-7" />
              </div>
              <div className="space-y-2">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-[#dcdcd3] text-xs font-mono font-bold text-[#0d0e10]">
                  <Lock className="w-3 h-3 text-amber-600" />
                  <span>PREMIUM DISTRIBUTION CHANNEL LOCKED</span>
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-[#0d0e10] font-heading">
                  Available for Subscribed Operators
                </h3>
                <p className="text-xs text-[#75766f] font-sans leading-relaxed">
                  Your Free Explorer plan includes full access to LinkedIn and X/Twitter outputs. Subscribing to Starter or Growth unlocks the full 6-channel omnichannel matrix, carousel slides, and direct webhook integrations.
                </p>
              </div>

              <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
                <button
                  onClick={onOpenUpgrade}
                  className="w-full sm:w-auto px-6 py-3 rounded-full bg-[#d4ff3a] hover:bg-[#c6f02e] text-[#0d0e10] font-mono text-xs font-bold transition-all cursor-pointer shadow-md flex items-center justify-center gap-2"
                >
                  <Crown className="w-3.5 h-3.5" />
                  <span>UPGRADE TO UNLOCK ALL CHANNELS</span>
                </button>
                <button
                  onClick={() => setActivePlatform('linkedin')}
                  className="w-full sm:w-auto px-5 py-3 rounded-full bg-white hover:bg-[#eeeee8] border border-[#dcdcd3] text-[#0d0e10] font-mono text-xs font-semibold transition-colors cursor-pointer"
                >
                  Return to LinkedIn
                </button>
              </div>
            </div>
          )}

          {/* LINKEDIN TAB */}
          {activePlatform === 'linkedin' && (
            <div className="max-w-2xl mx-auto space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono uppercase text-[#75766f] font-bold">
                  [NATIVE LINKEDIN MOCKUP]
                </span>
                <button
                  onClick={() =>
                    handleCopy(
                      `${channels.linkedin.headline}\n\n${channels.linkedin.body}\n\n${channels.linkedin.callToAction}\n\n${channels.linkedin.hashtags.join(' ')}`,
                      'linkedin'
                    )
                  }
                  className="flex items-center space-x-1.5 px-4 py-2 rounded-full bg-[#eeeee8] border border-[#dcdcd3] text-[#0d0e10] text-xs font-mono font-semibold hover:border-[#0d0e10] transition-colors cursor-pointer"
                >
                  {copiedKey === 'linkedin' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedKey === 'linkedin' ? 'Copied Post!' : 'Copy LinkedIn Post'}</span>
                </button>
              </div>

              {/* Realistic LinkedIn Card */}
              <div className="bg-white border border-[#dcdcd3] rounded-3xl p-6 shadow-sm space-y-4">
                {/* Author Header */}
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 rounded-full bg-[#0d0e10] flex items-center justify-center text-[#d4ff3a] font-black text-sm shadow-xs">
                    JR
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-[#0d0e10] flex items-center">
                      Arif · Javarif.com
                      <span className="ml-2 text-[10px] px-2 py-0.2 rounded-full bg-[#eeeee8] text-[#0d0e10] font-semibold">
                        1st
                      </span>
                    </h4>
                    <p className="text-xs text-[#75766f]">Founder & AI Automation Architect @ Javarif</p>
                    <span className="text-[10px] text-[#75766f]">Just now · 🌐</span>
                  </div>
                </div>

                {/* Post Content */}
                <div className="text-sm text-[#0d0e10] leading-relaxed space-y-3 font-normal whitespace-pre-line font-sans">
                  <p className="font-bold text-[#0d0e10] text-base">{channels.linkedin.headline}</p>
                  <p>{channels.linkedin.body}</p>
                  <p className="font-semibold text-[#0d0e10]">{channels.linkedin.callToAction}</p>
                </div>

                {/* Hashtags */}
                <div className="flex flex-wrap gap-1.5 pt-2">
                  {channels.linkedin.hashtags.map((tag, i) => (
                    <span key={i} className="text-xs text-[#0d0e10] hover:underline cursor-pointer font-medium">
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Social Proof Mock Bar */}
                <div className="pt-4 border-t border-[#eeeee8] flex items-center justify-between text-xs text-[#75766f]">
                  <div className="flex items-center space-x-1">
                    <span className="w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center text-[10px]">👍</span>
                    <span className="w-5 h-5 rounded-full bg-amber-100 flex items-center justify-center text-[10px]">💡</span>
                    <span className="w-5 h-5 rounded-full bg-red-100 flex items-center justify-center text-[10px]">❤️</span>
                    <span className="ml-1 text-[11px] font-mono">842 reactions</span>
                  </div>
                  <span className="font-mono text-[11px]">148 comments · 73 reposts</span>
                </div>
              </div>
            </div>
          )}

          {/* TWITTER TAB */}
          {activePlatform === 'twitter' && (
            <div className="max-w-2xl mx-auto space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono uppercase text-[#75766f] font-bold">
                  [X / TWITTER THREAD · {channels.twitter.threads.length} TWEETS]
                </span>
                <button
                  onClick={() =>
                    handleCopy(channels.twitter.threads.join('\n\n---\n\n'), 'twitter-all')
                  }
                  className="flex items-center space-x-1.5 px-4 py-2 rounded-full bg-[#eeeee8] border border-[#dcdcd3] text-[#0d0e10] text-xs font-mono font-semibold hover:border-[#0d0e10] transition-colors cursor-pointer"
                >
                  {copiedKey === 'twitter-all' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedKey === 'twitter-all' ? 'Copied Entire Thread!' : 'Copy Full Thread'}</span>
                </button>
              </div>

              {/* Thread UI */}
              <div className="space-y-3">
                {channels.twitter.threads.map((tweet, idx) => (
                  <div
                    key={idx}
                    className="relative bg-white border border-[#dcdcd3] rounded-2xl p-5 shadow-2xs space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <div className="w-7 h-7 rounded-full bg-[#0d0e10] flex items-center justify-center text-xs font-bold text-white">
                          𝕏
                        </div>
                        <span className="text-xs font-bold text-[#0d0e10]">@arif_gobrand</span>
                        <span className="text-xs text-[#75766f]">· {idx + 1}/{channels.twitter.threads.length}</span>
                      </div>
                      <button
                        onClick={() => handleCopy(tweet, `tweet-${idx}`)}
                        className="text-xs text-[#75766f] hover:text-[#0d0e10] p-1.5 rounded-full hover:bg-[#eeeee8] cursor-pointer"
                        title="Copy single tweet"
                      >
                        {copiedKey === `tweet-${idx}` ? (
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>

                    <p className="text-sm text-[#0d0e10] whitespace-pre-line leading-relaxed font-sans">
                      {tweet}
                    </p>

                    <div className="flex items-center justify-between pt-2 border-t border-[#eeeee8] text-[11px] text-[#75766f] font-mono">
                      <span>{tweet.length} / 280 chars</span>
                      <span className="text-[#0d0e10] font-semibold flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#d4ff3a]" />
                        Ready to publish
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* BLOG TAB */}
          {activePlatform === 'blog' && (
            <div className="max-w-3xl mx-auto space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold text-[#0d0e10] font-heading">{channels.blog.title}</h3>
                  <p className="text-xs text-[#75766f] mt-1 font-sans">
                    Meta Description: {channels.blog.metaDescription}
                  </p>
                </div>
                <button
                  onClick={() =>
                    handleCopy(
                      `# ${channels.blog.title}\n\n*${channels.blog.metaDescription}*\n\n${channels.blog.markdown}`,
                      'blog'
                    )
                  }
                  className="flex items-center space-x-1.5 px-4 py-2 rounded-full bg-[#eeeee8] border border-[#dcdcd3] text-[#0d0e10] text-xs font-mono font-semibold hover:border-[#0d0e10] transition-colors cursor-pointer"
                >
                  {copiedKey === 'blog' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedKey === 'blog' ? 'Copied Markdown!' : 'Copy Article'}</span>
                </button>
              </div>

              {/* Table of Contents / Outline */}
              <div className="p-4 rounded-2xl bg-[#eeeee8] border border-[#dcdcd3]">
                <span className="text-xs font-mono uppercase text-[#75766f] font-bold block mb-2">
                  [STRUCTURED ARTICLE OUTLINE]:
                </span>
                <div className="flex flex-wrap gap-2">
                  {channels.blog.outline.map((item, i) => (
                    <span
                      key={i}
                      className="px-3 py-1 rounded-full bg-white border border-[#dcdcd3] text-xs text-[#0d0e10] font-mono"
                    >
                      {i + 1}. {item}
                    </span>
                  ))}
                </div>
              </div>

              {/* Article Content */}
              <div className="bg-white border border-[#dcdcd3] rounded-3xl p-6 text-sm text-[#0d0e10] leading-relaxed whitespace-pre-line font-sans space-y-4 shadow-2xs">
                {channels.blog.markdown}
              </div>
            </div>
          )}

          {/* YOUTUBE SCRIPT TAB */}
          {activePlatform === 'youtube' && (
            <div className="max-w-3xl mx-auto space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold text-[#0d0e10] font-heading">{channels.youtubeScript.title}</h3>
                  <span className="text-xs font-mono text-[#0d0e10] font-semibold bg-[#d4ff3a] px-2.5 py-0.5 rounded-full">
                    Pacing: {channels.youtubeScript.pacing}
                  </span>
                </div>
                <button
                  onClick={() =>
                    handleCopy(
                      channels.youtubeScript.beats
                        .map((b) => `[${b.timestamp}]\nVisual: ${b.visual}\nSpoken: ${b.spokenAudio}`)
                        .join('\n\n'),
                      'youtube'
                    )
                  }
                  className="flex items-center space-x-1.5 px-4 py-2 rounded-full bg-[#eeeee8] border border-[#dcdcd3] text-[#0d0e10] text-xs font-mono font-semibold hover:border-[#0d0e10] transition-colors cursor-pointer"
                >
                  {copiedKey === 'youtube' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedKey === 'youtube' ? 'Copied Script!' : 'Copy Screenplay'}</span>
                </button>
              </div>

              {/* Production Beats Table */}
              <div className="bg-white border border-[#dcdcd3] rounded-3xl overflow-hidden shadow-2xs">
                <div className="grid grid-cols-12 bg-[#eeeee8] px-4 py-3 text-xs font-mono text-[#0d0e10] font-bold border-b border-[#dcdcd3]">
                  <div className="col-span-2">Timestamp</div>
                  <div className="col-span-4">Visual & B-Roll Direction</div>
                  <div className="col-span-6">Voiceover Audio Script</div>
                </div>

                <div className="divide-y divide-[#eeeee8]">
                  {channels.youtubeScript.beats.map((beat, i) => (
                    <div key={i} className="grid grid-cols-12 px-4 py-3.5 text-xs gap-3 items-start">
                      <div className="col-span-2 font-mono text-[#0d0e10] font-bold">
                        {beat.timestamp}
                      </div>
                      <div className="col-span-4 text-[#75766f] font-mono text-[11px] bg-[#eeeee8] p-2 rounded-xl border border-[#dcdcd3]">
                        {beat.visual}
                      </div>
                      <div className="col-span-6 text-[#0d0e10] font-medium leading-relaxed font-sans">
                        "{beat.spokenAudio}"
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* NEWSLETTER TAB */}
          {activePlatform === 'newsletter' && (
            <div className="max-w-2xl mx-auto space-y-6">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono uppercase text-[#75766f] font-bold">
                  [SUBSCRIBER EMAIL DISPATCH]
                </span>
                <button
                  onClick={() =>
                    handleCopy(
                      `Subject: ${channels.newsletter.subjectLines[0]}\nPreview: ${channels.newsletter.previewSnippet}\n\n${channels.newsletter.body}`,
                      'newsletter'
                    )
                  }
                  className="flex items-center space-x-1.5 px-4 py-2 rounded-full bg-[#eeeee8] border border-[#dcdcd3] text-[#0d0e10] text-xs font-mono font-semibold hover:border-[#0d0e10] transition-colors cursor-pointer"
                >
                  {copiedKey === 'newsletter' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedKey === 'newsletter' ? 'Copied Email!' : 'Copy Newsletter'}</span>
                </button>
              </div>

              {/* Subject Lines A/B Test Options */}
              <div className="p-4 rounded-2xl bg-[#eeeee8] border border-[#dcdcd3] space-y-2">
                <span className="text-xs font-mono uppercase text-[#0d0e10] font-bold block">
                  A/B Tested Subject Lines:
                </span>
                {channels.newsletter.subjectLines.map((subj, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between p-3 rounded-xl bg-white border border-[#dcdcd3] text-xs"
                  >
                    <span className="text-[#0d0e10] font-sans">
                      <strong className="text-[#0d0e10] font-mono mr-2">Option {i + 1}:</strong> {subj}
                    </span>
                    <button
                      onClick={() => handleCopy(subj, `subj-${i}`)}
                      className="text-[#75766f] hover:text-[#0d0e10] cursor-pointer"
                    >
                      {copiedKey === `subj-${i}` ? (
                        <Check className="w-3 h-3 text-emerald-600" />
                      ) : (
                        <Copy className="w-3 h-3" />
                      )}
                    </button>
                  </div>
                ))}
              </div>

              {/* Email Client Mockup */}
              <div className="bg-white border border-[#dcdcd3] rounded-3xl p-6 space-y-4 shadow-2xs">
                <div className="pb-3 border-b border-[#eeeee8] text-xs space-y-1">
                  <div>
                    <span className="text-[#75766f]">From: </span>
                    <span className="text-[#0d0e10] font-medium">Javarif Dispatch &lt;hello@javarif.com&gt;</span>
                  </div>
                  <div>
                    <span className="text-[#75766f]">Preview: </span>
                    <span className="text-[#75766f] italic">{channels.newsletter.previewSnippet}</span>
                  </div>
                </div>

                <div className="text-sm text-[#0d0e10] leading-relaxed whitespace-pre-line font-sans">
                  {channels.newsletter.body}
                </div>
              </div>
            </div>
          )}

          {/* CAROUSEL DECK TAB */}
          {activePlatform === 'carousel' && (
            <div className="max-w-2xl mx-auto space-y-6">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono uppercase text-[#75766f] font-bold">
                  [CAROUSEL SLIDE DECK · {channels.carouselSlides.length} SLIDES]
                </span>
                <button
                  onClick={() =>
                    handleCopy(
                      channels.carouselSlides
                        .map((s) => `Slide ${s.slideNumber}: ${s.title}\n${s.subtitle}`)
                        .join('\n\n'),
                      'carousel'
                    )
                  }
                  className="flex items-center space-x-1.5 px-4 py-2 rounded-full bg-[#eeeee8] border border-[#dcdcd3] text-[#0d0e10] text-xs font-mono font-semibold hover:border-[#0d0e10] transition-colors cursor-pointer"
                >
                  {copiedKey === 'carousel' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedKey === 'carousel' ? 'Copied Deck!' : 'Copy Slide Deck'}</span>
                </button>
              </div>

              {/* Interactive Slide Viewer */}
              {channels.carouselSlides && channels.carouselSlides.length > 0 && (
                <div className="space-y-4">
                  <div className="aspect-[4/3] max-w-md mx-auto bg-[#0d0e10] text-white border border-black rounded-3xl p-8 flex flex-col justify-between shadow-xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-60 h-60 bg-[#d4ff3a]/15 rounded-full blur-3xl pointer-events-none" />

                    <div className="flex items-center justify-between text-xs text-zinc-400 font-mono relative z-10">
                      <span className="font-bold text-white font-heading">JAVARIF.COM</span>
                      <span className="px-3 py-1 rounded-full bg-[#d4ff3a] text-[#0d0e10] font-bold">
                        {currentSlideIndex + 1} / {channels.carouselSlides.length}
                      </span>
                    </div>

                    <div className="my-auto space-y-3 relative z-10">
                      <h2 className="text-2xl font-black text-white font-heading leading-tight uppercase">
                        {channels.carouselSlides[currentSlideIndex]?.title}
                      </h2>
                      <p className="text-sm text-zinc-300 leading-relaxed font-sans">
                        {channels.carouselSlides[currentSlideIndex]?.subtitle}
                      </p>
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-zinc-400 font-mono pt-4 border-t border-white/10 relative z-10">
                      <span>Swipe ➡️</span>
                      <span>@javarif_com</span>
                    </div>
                  </div>

                  {/* Stepper Controls */}
                  <div className="flex items-center justify-center space-x-4">
                    <button
                      onClick={() =>
                        setCurrentSlideIndex((prev) => Math.max(0, prev - 1))
                      }
                      disabled={currentSlideIndex === 0}
                      className="p-2.5 rounded-full bg-white border border-[#dcdcd3] text-[#0d0e10] disabled:opacity-30 hover:border-[#0d0e10] transition-all cursor-pointer shadow-xs active:scale-95"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <span className="text-xs font-mono text-[#75766f] font-semibold">
                      Slide {currentSlideIndex + 1} of {channels.carouselSlides.length}
                    </span>
                    <button
                      onClick={() =>
                        setCurrentSlideIndex((prev) =>
                          Math.min(channels.carouselSlides.length - 1, prev + 1)
                        )
                      }
                      disabled={currentSlideIndex === channels.carouselSlides.length - 1}
                      className="p-2.5 rounded-full bg-white border border-[#dcdcd3] text-[#0d0e10] disabled:opacity-30 hover:border-[#0d0e10] transition-all cursor-pointer shadow-xs active:scale-95"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* EXPORT & WEBHOOK API TAB */}
          {activePlatform === 'export' && (
            <div className="max-w-2xl mx-auto space-y-5">
              <div>
                <h3 className="text-base font-bold text-[#0d0e10] font-heading">Webhook & Zapier Integration Payload</h3>
                <p className="text-xs text-[#75766f] mt-1 font-sans">
                  Connect your automated pipeline output to Zapier, Make.com, Buffer, or n8n to publish automatically.
                </p>
              </div>

              <div className="relative bg-[#eeeee8] border border-[#dcdcd3] rounded-2xl p-4 font-mono text-xs text-[#0d0e10] overflow-x-auto max-h-96 shadow-2xs">
                <button
                  onClick={() => handleCopy(JSON.stringify(result, null, 2), 'raw-json')}
                  className="absolute top-3 right-3 px-3 py-1 rounded-full bg-white border border-[#dcdcd3] text-[#0d0e10] text-[11px] hover:border-[#0d0e10] font-mono cursor-pointer shadow-2xs"
                >
                  {copiedKey === 'raw-json' ? 'Copied!' : 'Copy Payload'}
                </button>
                <pre>{JSON.stringify(result, null, 2)}</pre>
              </div>

              <div className="p-4 rounded-2xl bg-[#eeeee8] border border-[#dcdcd3] text-xs text-[#0d0e10] space-y-2 font-mono">
                <span className="font-bold text-[#0d0e10] block">[NEXT STEPS FOR FULL AUTONOMOUS DEPLOYMENT]:</span>
                <p>1. Target Endpoint: POST your webhook to <code className="bg-white px-2 py-0.5 rounded border border-[#dcdcd3] font-bold">/api/triggers/simulate</code></p>
                <p>2. Pass <code className="bg-white px-2 py-0.5 rounded border border-[#dcdcd3] font-bold">{`{ "topic": "Your text", "brandVoice": "Contrarian" }`}</code></p>
                <p>3. Hook response straight into Buffer or Hootsuite for automated multi-channel dispatch.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
