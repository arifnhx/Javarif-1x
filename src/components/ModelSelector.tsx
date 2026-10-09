import React, { useState, useRef, useEffect } from 'react';
import {
  ChevronDown,
  Check,
  Cpu,
  Sparkles,
  Zap,
  Layers,
  ArrowRight,
} from 'lucide-react';
import { AVAILABLE_MODELS, AIModelOption, AIProvider } from '../types';

interface ModelSelectorProps {
  selectedModelId: string;
  onSelectModel: (modelId: string) => void;
  variant?: 'pill-dropdown' | 'full-cards' | 'segmented';
}

export const ModelSelector: React.FC<ModelSelectorProps> = ({
  selectedModelId,
  onSelectModel,
  variant = 'pill-dropdown',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedProviderFilter, setSelectedProviderFilter] = useState<string>('All');
  const dropdownRef = useRef<HTMLDivElement>(null);

  const activeModel =
    AVAILABLE_MODELS.find((m) => m.id === selectedModelId) || AVAILABLE_MODELS[0];

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getProviderColor = (provider: AIProvider) => {
    switch (provider) {
      case 'Anthropic':
        return {
          bg: 'bg-[#d97706]/10',
          text: 'text-[#d97706]',
          border: 'border-[#d97706]/30',
          pill: 'bg-[#b45309] text-white',
        };
      case 'OpenAI':
        return {
          bg: 'bg-[#10a37f]/10',
          text: 'text-[#10a37f]',
          border: 'border-[#10a37f]/30',
          pill: 'bg-[#10a37f] text-white',
        };
      case 'Google':
        return {
          bg: 'bg-[#2563eb]/10',
          text: 'text-[#2563eb]',
          border: 'border-[#2563eb]/30',
          pill: 'bg-[#2563eb] text-white',
        };
      case 'DeepSeek':
        return {
          bg: 'bg-[#4f46e5]/10',
          text: 'text-[#4f46e5]',
          border: 'border-[#4f46e5]/30',
          pill: 'bg-[#4f46e5] text-white',
        };
      case 'Ensemble':
      default:
        return {
          bg: 'bg-[#d4ff3a]/30',
          text: 'text-[#0d0e10]',
          border: 'border-[#0d0e10]/20',
          pill: 'bg-[#d4ff3a] text-[#0d0e10]',
        };
    }
  };

  const providers = ['All', 'Anthropic', 'OpenAI', 'Google', 'DeepSeek', 'Ensemble'];

  const filteredModels =
    selectedProviderFilter === 'All'
      ? AVAILABLE_MODELS
      : AVAILABLE_MODELS.filter((m) => m.provider === selectedProviderFilter);

  // Pill Dropdown Variant (Used in Header & compact locations)
  if (variant === 'pill-dropdown') {
    const colors = getProviderColor(activeModel.provider);
    return (
      <div className="relative inline-block text-left" ref={dropdownRef}>
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="group flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white hover:bg-[#fafaf7] border border-[#dcdcd3] hover:border-[#0d0e10] text-xs font-mono transition-all shadow-2xs cursor-pointer active:scale-95"
          title="Switch AI intelligence engine"
        >
          <span className="w-2 h-2 rounded-full bg-[#d4ff3a] animate-pulse" />
          <span className="text-[#75766f] font-normal">Model:</span>
          <span className="font-bold text-[#0d0e10] flex items-center gap-1.5">
            <span
              className={`text-[10px] px-1.5 py-0.2 rounded font-mono font-semibold ${colors.bg} ${colors.text}`}
            >
              {activeModel.provider}
            </span>
            <span className="max-w-[130px] sm:max-w-none truncate">{activeModel.name}</span>
          </span>
          <ChevronDown
            className={`w-3.5 h-3.5 text-[#75766f] transition-transform duration-200 ${
              isOpen ? 'rotate-180 text-[#0d0e10]' : ''
            }`}
          />
        </button>

        {isOpen && (
          <div className="absolute right-0 sm:left-0 mt-2 w-80 sm:w-96 rounded-2xl bg-white border border-[#dcdcd3] shadow-xl p-3 z-50 animate-in fade-in zoom-in-95 duration-150">
            {/* Header */}
            <div className="flex items-center justify-between pb-2 mb-2 border-b border-[#eeeee8] px-1">
              <div>
                <p className="text-xs font-bold font-heading text-[#0d0e10]">Select AI Model</p>
                <p className="text-[11px] text-[#75766f]">
                  Switch between Anthropic, OpenAI, Google, DeepSeek & Ensembles
                </p>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#eeeee8] text-[#0d0e10] font-semibold">
                {AVAILABLE_MODELS.length} Models
              </span>
            </div>

            {/* Provider Filter Tabs */}
            <div className="flex items-center gap-1 mb-2 overflow-x-auto no-scrollbar pb-1">
              {providers.map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setSelectedProviderFilter(p)}
                  className={`text-[11px] font-mono px-2.5 py-1 rounded-full whitespace-nowrap transition-all cursor-pointer ${
                    selectedProviderFilter === p
                      ? 'bg-[#0d0e10] text-[#d4ff3a] font-bold shadow-xs'
                      : 'bg-[#eeeee8] text-[#75766f] hover:text-[#0d0e10]'
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>

            {/* Model List */}
            <div className="space-y-1.5 max-h-72 overflow-y-auto pr-1">
              {filteredModels.map((m) => {
                const isSelected = m.id === selectedModelId;
                const mColors = getProviderColor(m.provider);
                return (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => {
                      onSelectModel(m.id);
                      setIsOpen(false);
                    }}
                    className={`w-full text-left p-2.5 rounded-xl border transition-all flex items-start justify-between gap-2 cursor-pointer ${
                      isSelected
                        ? 'bg-[#fafaf7] border-[#0d0e10] shadow-xs'
                        : 'bg-white hover:bg-[#eeeee8]/50 border-transparent hover:border-[#dcdcd3]'
                    }`}
                  >
                    <div className="space-y-0.5 flex-1 min-w-0">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span
                          className={`text-[10px] font-mono font-bold px-1.5 py-0.2 rounded ${mColors.bg} ${mColors.text}`}
                        >
                          {m.provider}
                        </span>
                        <span className="text-xs font-bold text-[#0d0e10] font-heading truncate">
                          {m.name}
                        </span>
                        <span className="text-[10px] text-[#75766f] font-mono">
                          {m.context}
                        </span>
                      </div>
                      <p className="text-[11px] text-[#75766f] truncate">{m.tagline}</p>
                    </div>

                    <div className="flex items-center gap-1 shrink-0 mt-0.5">
                      <span className="text-[10px] font-mono text-[#75766f] px-1.5 py-0.5 rounded bg-[#eeeee8]">
                        {m.latency}
                      </span>
                      {isSelected ? (
                        <div className="w-5 h-5 rounded-full bg-[#d4ff3a] flex items-center justify-center">
                          <Check className="w-3 h-3 text-[#0d0e10] stroke-[3]" />
                        </div>
                      ) : null}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Bottom info */}
            <div className="mt-2 pt-2 border-t border-[#eeeee8] px-1 flex items-center justify-between text-[10px] font-mono text-[#75766f]">
              <span>Model agnostic synthesis</span>
              <span className="text-[#0d0e10] font-semibold">Active: {activeModel.name}</span>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Full Cards Grid Variant (Used in Studio & Execution Console)
  return (
    <div className="space-y-4">
      {/* Provider Filter Tabs */}
      <div className="flex items-center justify-between gap-2 flex-wrap">
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
          {providers.map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => setSelectedProviderFilter(p)}
              className={`text-xs font-mono px-3 py-1.5 rounded-full transition-all cursor-pointer ${
                selectedProviderFilter === p
                  ? 'bg-[#0d0e10] text-[#d4ff3a] font-bold shadow-xs'
                  : 'bg-white hover:bg-[#eeeee8] text-[#75766f] hover:text-[#0d0e10] border border-[#dcdcd3]'
              }`}
            >
              {p}
            </button>
          ))}
        </div>

        <div className="text-xs font-mono text-[#75766f] flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#d4ff3a]" />
          <span>Active: <strong className="text-[#0d0e10]">{activeModel.name}</strong></span>
        </div>
      </div>

      {/* Grid of models */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {filteredModels.map((m) => {
          const isSelected = m.id === selectedModelId;
          const colors = getProviderColor(m.provider);

          return (
            <button
              key={m.id}
              type="button"
              onClick={() => onSelectModel(m.id)}
              className={`p-4 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between relative group ${
                isSelected
                  ? 'bg-white border-[#0d0e10] shadow-md ring-2 ring-[#0d0e10]/10'
                  : 'bg-white hover:bg-[#fafaf7] border-[#dcdcd3] hover:border-[#0d0e10]/50 shadow-xs'
              }`}
            >
              {isSelected && (
                <div className="absolute top-3 right-3 w-5 h-5 rounded-full bg-[#d4ff3a] flex items-center justify-center shadow-xs">
                  <Check className="w-3 h-3 text-[#0d0e10] stroke-[3]" />
                </div>
              )}

              <div className="space-y-2 mb-3">
                <div className="flex items-center gap-2 flex-wrap">
                  <span
                    className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full ${colors.bg} ${colors.text}`}
                  >
                    {m.provider}
                  </span>
                  <span className="text-[10px] font-mono text-[#75766f] bg-[#eeeee8] px-2 py-0.5 rounded-full">
                    {m.badge}
                  </span>
                </div>

                <div>
                  <h4 className="text-sm font-bold text-[#0d0e10] font-heading group-hover:text-[#0d0e10]">
                    {m.name}
                  </h4>
                  <p className="text-xs text-[#75766f] line-clamp-2 mt-1 leading-relaxed">
                    {m.tagline}
                  </p>
                </div>
              </div>

              <div className="pt-2 border-t border-[#eeeee8] flex items-center justify-between text-[11px] font-mono text-[#75766f]">
                <span>{m.context}</span>
                <span className="font-semibold text-[#0d0e10]">{m.latency}</span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
