import React, { useState } from 'react';
import {
  Calendar as CalendarIcon,
  Clock,
  CheckCircle2,
  AlertCircle,
  Plus,
  Linkedin,
  Twitter,
  FileText,
  Video,
  Mail,
  Zap,
} from 'lucide-react';
import { ScheduledContentItem } from '../types';

interface ContentCalendarProps {
  onScheduleCurrentCampaign?: () => void;
  hasActiveCampaign: boolean;
}

export const ContentCalendar: React.FC<ContentCalendarProps> = ({
  onScheduleCurrentCampaign,
  hasActiveCampaign,
}) => {
  const [items, setItems] = useState<ScheduledContentItem[]>([
    {
      id: 'sch_1',
      title: 'Autonomous AI Workflows vs Micro-Management',
      platform: 'linkedin',
      scheduledTime: 'Tomorrow at 09:15 AM EST',
      status: 'scheduled',
      author: 'Arif (Javarif Engine)',
    },
    {
      id: 'sch_2',
      title: '1/5 The 45-Second Content Flywheel Thread',
      platform: 'twitter',
      scheduledTime: 'Tomorrow at 11:30 AM EST',
      status: 'scheduled',
      author: 'Arif (Javarif Engine)',
    },
    {
      id: 'sch_3',
      title: 'The Modern Content Scaling Dilemma',
      platform: 'blog',
      scheduledTime: 'Thursday at 02:00 PM EST',
      status: 'ready',
      author: 'Javarif Editorial',
    },
    {
      id: 'sch_4',
      title: 'Shorts: Stop writing social posts one by one',
      platform: 'youtube',
      scheduledTime: 'Friday at 12:00 PM EST',
      status: 'generating',
      author: 'Javarif Video Lab',
    },
    {
      id: 'sch_5',
      title: 'Weekly Dispatch: How We Killed Manual Repurposing',
      platform: 'newsletter',
      scheduledTime: 'Sunday at 08:00 AM EST',
      status: 'scheduled',
      author: 'Arif',
    },
  ]);

  const platformIcons = {
    linkedin: { icon: Linkedin, color: 'text-blue-600', bg: 'bg-[#eeeee8] border-[#dcdcd3]' },
    twitter: { icon: Twitter, color: 'text-[#0d0e10]', bg: 'bg-[#eeeee8] border-[#dcdcd3]' },
    blog: { icon: FileText, color: 'text-emerald-600', bg: 'bg-[#eeeee8] border-[#dcdcd3]' },
    youtube: { icon: Video, color: 'text-red-600', bg: 'bg-[#eeeee8] border-[#dcdcd3]' },
    newsletter: { icon: Mail, color: 'text-amber-600', bg: 'bg-[#eeeee8] border-[#dcdcd3]' },
  };

  const statusBadges = {
    scheduled: { label: 'Scheduled', badge: 'bg-[#eeeee8] text-[#0d0e10] border-[#dcdcd3]' },
    generating: { label: 'AI Synthesis', badge: 'bg-[#d4ff3a] text-[#0d0e10] border-[#d4ff3a] font-bold' },
    ready: { label: 'Approved', badge: 'bg-emerald-50 text-emerald-800 border-emerald-200' },
    published: { label: 'Published', badge: 'bg-zinc-100 text-zinc-600 border-zinc-200' },
  };

  const handleAddSlot = () => {
    const newItem: ScheduledContentItem = {
      id: 'sch_' + Date.now(),
      title: 'Autonomous Cadence Slot: Growth & Tech Thesis',
      platform: 'linkedin',
      scheduledTime: 'Next Monday at 10:00 AM EST',
      status: 'scheduled',
      author: 'Arif (Javarif Auto-Queue)',
    };
    setItems([newItem, ...items]);
  };

  return (
    <div className="space-y-6">
      {/* Calendar Header */}
      <div className="bg-white border border-[#dcdcd3] rounded-3xl p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="inline-flex items-center space-x-2 text-xs text-[#0d0e10] font-mono font-bold tracking-wider px-3 py-1 rounded-full bg-[#eeeee8]">
              <CalendarIcon className="w-3.5 h-3.5 text-[#0d0e10]" />
              <span>DISTRIBUTION QUEUE & AUTOMATED DISPATCH</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0d0e10] font-heading tracking-tight">
              Publishing Schedule & Buffer
            </h2>
            <p className="text-xs sm:text-sm text-[#75766f] max-w-2xl font-sans leading-relaxed">
              Automatic slot allocation for multi-channel assets. Once your workflow finishes, posts line up in your smart scheduling cadence.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={handleAddSlot}
              className="flex items-center space-x-1.5 px-4 py-2.5 rounded-full bg-[#eeeee8] hover:bg-white text-[#0d0e10] text-xs font-mono font-bold border border-[#dcdcd3] hover:border-[#0d0e10] transition-all cursor-pointer shadow-xs active:scale-95"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Queue Slot</span>
            </button>

            {hasActiveCampaign && onScheduleCurrentCampaign && (
              <button
                onClick={onScheduleCurrentCampaign}
                className="flex items-center space-x-1.5 px-5 py-2.5 rounded-full bg-[#d4ff3a] hover:bg-[#c6f02e] text-[#0d0e10] text-xs font-mono font-bold shadow-sm transition-all cursor-pointer active:scale-95 btn-spring"
              >
                <Zap className="w-3.5 h-3.5 fill-current" />
                <span>Queue Current Campaign</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Cadence Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white border border-[#dcdcd3] rounded-3xl p-6 shadow-xs">
          <span className="text-xs text-[#75766f] font-mono block uppercase">[PUBLISHING VELOCITY]</span>
          <span className="text-2xl font-black text-[#0d0e10] font-mono mt-1 block">18 Posts</span>
          <span className="text-[11px] text-[#0d0e10] font-semibold mt-1 block flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-[#d4ff3a]" />
            ↑ 3.8x higher than manual cadence
          </span>
        </div>
        <div className="bg-[#0d0e10] text-white border border-black rounded-3xl p-6 shadow-xs">
          <span className="text-xs text-zinc-400 font-mono block uppercase">[QUEUE BUFFER]</span>
          <span className="text-2xl font-black text-[#d4ff3a] font-mono mt-1 block">5 Days Ahead</span>
          <span className="text-[11px] text-zinc-400 mt-1 block font-mono">Next run in 4 hours 18 mins</span>
        </div>
        <div className="bg-white border border-[#dcdcd3] rounded-3xl p-6 shadow-xs">
          <span className="text-xs text-[#75766f] font-mono block uppercase">[DISPATCH HEALTH]</span>
          <span className="text-2xl font-black text-[#0d0e10] font-mono mt-1 block">99.4%</span>
          <span className="text-[11px] text-[#75766f] mt-1 block">Webhook & API connectors healthy</span>
        </div>
      </div>

      {/* Queue List */}
      <div className="bg-white border border-[#dcdcd3] rounded-3xl overflow-hidden shadow-xs">
        <div className="p-5 border-b border-[#eeeee8] flex items-center justify-between bg-[#eeeee8]/60">
          <span className="text-xs font-mono uppercase text-[#0d0e10] font-bold">
            Upcoming Distribution Slots ({items.length})
          </span>
          <span className="text-xs text-[#75766f] font-mono">Timezone: UTC-5 (EST)</span>
        </div>

        <div className="divide-y divide-[#eeeee8]">
          {items.map((item) => {
            const config = platformIcons[item.platform];
            const Icon = config.icon;
            const statusConfig = statusBadges[item.status];

            return (
              <div
                key={item.id}
                className="p-5 hover:bg-[#eeeee8]/40 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div className="flex items-center space-x-3.5">
                  <div className={`w-10 h-10 rounded-2xl flex items-center justify-center border ${config.bg} shadow-2xs`}>
                    <Icon className={`w-5 h-5 ${config.color}`} />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-[#0d0e10] font-sans">{item.title}</h4>
                    <div className="flex items-center space-x-2 text-xs text-[#75766f] mt-0.5 font-mono">
                      <Clock className="w-3 h-3 text-[#0d0e10]" />
                      <span>{item.scheduledTime}</span>
                      <span>·</span>
                      <span className="text-[#0d0e10] font-medium">{item.author}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-3 self-end sm:self-auto">
                  <span
                    className={`px-3 py-1 rounded-full text-[11px] font-mono border font-medium ${statusConfig.badge}`}
                  >
                    {statusConfig.label}
                  </span>
                  <button
                    onClick={() => setItems(items.filter((i) => i.id !== item.id))}
                    className="text-xs text-[#75766f] hover:text-red-600 px-2.5 py-1 rounded-full hover:bg-[#eeeee8] transition-colors cursor-pointer"
                  >
                    Remove
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
