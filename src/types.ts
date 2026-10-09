export type UserSubscriptionTier = 'free' | 'starter' | 'growth' | 'scale';

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  tier: UserSubscriptionTier;
  isSubscribed: boolean;
  runsUsedThisMonth: number;
  monthlyQuota: number;
}

export interface WorkflowScoring {
  viralityScore: number;
  seoScore: number;
  clarityScore: number;
  hookPowerScore: number;
  targetPersona: string;
  estimatedReadTime: string;
  toneMatchScore: number;
}

export interface LinkedInPost {
  headline: string;
  body: string;
  callToAction: string;
  hashtags: string[];
}

export interface TwitterThread {
  threads: string[];
}

export interface BlogPost {
  title: string;
  metaDescription: string;
  outline: string[];
  markdown: string;
}

export interface VideoBeat {
  timestamp: string;
  visual: string;
  spokenAudio: string;
}

export interface YouTubeScript {
  title: string;
  pacing: string;
  beats: VideoBeat[];
}

export interface Newsletter {
  subjectLines: string[];
  previewSnippet: string;
  body: string;
}

export interface CarouselSlide {
  slideNumber: number;
  title: string;
  subtitle: string;
}

export interface VisualPrompt {
  dallEPrompt: string;
  aspectRatio: string;
}

export interface WorkflowResultChannels {
  linkedin: LinkedInPost;
  twitter: TwitterThread;
  blog: BlogPost;
  youtubeScript: YouTubeScript;
  newsletter: Newsletter;
  carouselSlides: CarouselSlide[];
  visualPrompt: VisualPrompt;
}

export interface WorkflowExecutionResult {
  meta: {
    topic: string;
    brandVoice: string;
    templateId?: string;
    modelId?: string;
    modelName?: string;
    generatedAt: string;
    workflowId: string;
    executionTimeMs: number;
  };
  angles: string[];
  scoring: WorkflowScoring;
  channels: WorkflowResultChannels;
}

export type AIProvider = 'Anthropic' | 'OpenAI' | 'Google' | 'DeepSeek' | 'Ensemble';

export interface AIModelOption {
  id: string;
  name: string;
  provider: AIProvider;
  badge: string;
  context: string;
  latency: string;
  strength: string;
  tagline: string;
}

export const AVAILABLE_MODELS: AIModelOption[] = [
  {
    id: 'claude-3-7-sonnet',
    name: 'Claude 3.7 Sonnet',
    provider: 'Anthropic',
    badge: 'Flagship Reasoning',
    context: '200K ctx',
    latency: '~1.8s',
    strength: 'Nuanced Long-form & Editorial Voice',
    tagline: 'Best for authoritative newsletters & LinkedIn thought leadership',
  },
  {
    id: 'claude-3-5-haiku',
    name: 'Claude 3.5 Haiku',
    provider: 'Anthropic',
    badge: 'Lightning Speed',
    context: '200K ctx',
    latency: '~0.6s',
    strength: 'Ultra-fast High-Throughput Micro-copy',
    tagline: 'Rapid variant generation & short-form punchiness',
  },
  {
    id: 'gpt-4o',
    name: 'GPT-4o (Omni)',
    provider: 'OpenAI',
    badge: 'Omni Multimodal',
    context: '128K ctx',
    latency: '~1.2s',
    strength: 'High-conversion Hooks & Visual Prompts',
    tagline: 'Precision social hooks & carousel creative direction',
  },
  {
    id: 'gpt-4-5-preview',
    name: 'GPT-4.5 Preview',
    provider: 'OpenAI',
    badge: 'Deep Knowledge',
    context: '128K ctx',
    latency: '~2.2s',
    strength: 'Max Dynamic Range Writing',
    tagline: 'Sophisticated brand storytelling and enterprise voice',
  },
  {
    id: 'o3-mini',
    name: 'o3-mini (Reasoning)',
    provider: 'OpenAI',
    badge: 'Logic & Math',
    context: '200K ctx',
    latency: '~1.4s',
    strength: 'Algorithmic Structuring & Viral Hooks',
    tagline: 'Deep chain-of-thought tension angle decomposition',
  },
  {
    id: 'gemini-2-5-pro',
    name: 'Gemini 2.5 Pro',
    provider: 'Google',
    badge: 'Deep Multimodal',
    context: '2M ctx',
    latency: '~1.9s',
    strength: 'Deep Research Synthesis & Whitepapers',
    tagline: 'Massive context ingest from transcripts and reports',
  },
  {
    id: 'gemini-2-5-flash',
    name: 'Gemini 2.5 Flash',
    provider: 'Google',
    badge: 'High Velocity',
    context: '1M ctx',
    latency: '~0.8s',
    strength: 'Instant Multi-channel Transposition',
    tagline: 'Sub-second omnichannel parallel execution',
  },
  {
    id: 'deepseek-r1',
    name: 'DeepSeek R1',
    provider: 'DeepSeek',
    badge: 'Open Reasoning',
    context: '128K ctx',
    latency: '~2.1s',
    strength: 'Unfiltered Logic & Contrarian Angles',
    tagline: 'Contrarian thesis dissection & tone auditing',
  },
  {
    id: 'multi-model-ensemble',
    name: 'Auto-Routing Ensemble',
    provider: 'Ensemble',
    badge: 'Smart Orchestration',
    context: 'Dynamic',
    latency: '~1.5s',
    strength: 'Best-of-Breed Per Channel Allocation',
    tagline: 'Claude for long-form, GPT-4o for hooks, Gemini for velocity',
  },
];

export interface WorkflowTemplate {
  id: string;
  name: string;
  description: string;
  badge: string;
  nodes: string[];
  channels: string[];
  defaultPrompt: string;
}

export interface ScheduledContentItem {
  id: string;
  title: string;
  platform: 'linkedin' | 'twitter' | 'blog' | 'youtube' | 'newsletter';
  scheduledTime: string;
  status: 'scheduled' | 'generating' | 'ready' | 'published';
  author: string;
}

export interface TriggerConfig {
  id: string;
  name: string;
  type: 'webhook' | 'rss' | 'schedule' | 'notion';
  status: 'active' | 'paused';
  lastRun: string;
  totalExecutions: number;
}
