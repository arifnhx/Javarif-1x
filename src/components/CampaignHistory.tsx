import React from 'react';
import { Archive, ArrowRight, Trash2, Clock, Flame, Sparkles } from 'lucide-react';
import { WorkflowExecutionResult } from '../types';

interface CampaignHistoryProps {
  history: WorkflowExecutionResult[];
  onSelectCampaign: (campaign: WorkflowExecutionResult) => void;
  onClearHistory: () => void;
  currentWorkflowId?: string;
}

export const CampaignHistory: React.FC<CampaignHistoryProps> = ({
  history,
  onSelectCampaign,
  onClearHistory,
  currentWorkflowId,
}) => {
  if (history.length === 0) return null;

  return (
    <div className="bg-white border border-[#dcdcd3] rounded-3xl p-6 sm:p-7 space-y-4 shadow-xs">
      <div className="flex items-center justify-between pb-3 border-b border-[#eeeee8]">
        <div className="flex items-center space-x-2">
          <Archive className="w-4 h-4 text-[#0d0e10]" />
          <h3 className="text-xs font-bold text-[#0d0e10] uppercase tracking-wider font-mono">
            [PIPELINE RUN ARCHIVE · {history.length} CAMPAIGNS]
          </h3>
        </div>
        <button
          onClick={onClearHistory}
          className="text-xs text-[#75766f] hover:text-red-600 flex items-center space-x-1 font-mono transition-colors cursor-pointer px-2.5 py-1 rounded-full hover:bg-[#eeeee8]"
        >
          <Trash2 className="w-3 h-3" />
          <span>Clear Archive</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {history.map((item) => {
          const isSelected = item.meta.workflowId === currentWorkflowId;

          return (
            <div
              key={item.meta.workflowId}
              onClick={() => onSelectCampaign(item)}
              className={`p-4.5 rounded-2xl border cursor-pointer transition-all duration-200 ${
                isSelected
                  ? 'bg-[#0d0e10] text-white border-black shadow-md ring-2 ring-[#d4ff3a]'
                  : 'bg-[#eeeee8] border-[#dcdcd3] hover:border-[#0d0e10] hover:bg-white shadow-2xs'
              }`}
            >
              <div className="flex items-center justify-between text-xs font-mono mb-1">
                <div className="flex items-center gap-1.5">
                  <span className={isSelected ? 'text-zinc-400' : 'text-[#75766f]'}>{item.meta.workflowId}</span>
                  {item.meta.modelName && (
                    <span className={`text-[9px] px-1.5 py-0.2 rounded font-mono ${isSelected ? 'bg-white/10 text-[#d4ff3a]' : 'bg-white text-[#0d0e10]'}`}>
                      {item.meta.modelName.split(' ')[0]}
                    </span>
                  )}
                </div>
                <span className={`flex items-center font-bold ${isSelected ? 'text-[#d4ff3a]' : 'text-[#0d0e10]'}`}>
                  <Flame className="w-3 h-3 mr-0.5 fill-current" />
                  {item.scoring.viralityScore}%
                </span>
              </div>

              <h4 className={`text-xs font-semibold line-clamp-2 mt-1 font-sans ${isSelected ? 'text-white' : 'text-[#0d0e10]'}`}>
                {item.meta.topic}
              </h4>

              <div className={`flex items-center justify-between text-[11px] mt-3 pt-2 border-t font-mono ${
                isSelected ? 'border-white/10 text-zinc-400' : 'border-[#dcdcd3] text-[#75766f]'
              }`}>
                <span className="truncate max-w-[120px]">{item.meta.brandVoice}</span>
                <span className={`font-semibold flex items-center ${isSelected ? 'text-[#d4ff3a]' : 'text-[#0d0e10]'}`}>
                  Open <ArrowRight className="w-3 h-3 ml-0.5" />
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
