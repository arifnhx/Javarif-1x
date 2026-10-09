import React, { useState } from 'react';
import { X, CheckCircle2, ArrowRight } from 'lucide-react';

interface DiscoveryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DiscoveryModal: React.FC<DiscoveryModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [company, setCompany] = useState('');
  const [monthlyVolume, setMonthlyVolume] = useState('20 - 50 pieces/month');
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      setError('Please provide a valid work email.');
      return;
    }
    setError('');
    setSubmitted(true);
  };

  const handleResetAndClose = () => {
    setSubmitted(false);
    setName('');
    setEmail('');
    setCompany('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-[#0d0e10]/60 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-lg p-6 sm:p-10 rounded-3xl sm:rounded-4xl bg-white border border-[#dcdcd3] shadow-2xl space-y-6 max-h-[92vh] overflow-y-auto">
        <button
          onClick={handleResetAndClose}
          className="absolute top-4 right-4 sm:top-5 sm:right-5 p-2 rounded-full text-[#75766f] hover:text-[#0d0e10] hover:bg-[#eeeee8] transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {submitted ? (
          <div className="text-center py-8 space-y-4">
            <div className="w-14 h-14 rounded-full bg-[#d4ff3a] text-[#0d0e10] flex items-center justify-center mx-auto shadow-md">
              <CheckCircle2 className="w-7 h-7" />
            </div>
            <h3 className="text-2xl font-black text-[#0d0e10] font-heading uppercase">
              AUDIT SCHEDULED
            </h3>
            <p className="text-xs text-[#75766f] leading-relaxed max-w-sm mx-auto font-sans">
              Thank you, {name || 'Operator'}. Our workflow architecture team has received your request and will transmit an asynchronous pipeline proposal to <strong className="text-[#0d0e10] font-mono">{email}</strong> within 4 business hours.
            </p>
            <button
              onClick={handleResetAndClose}
              className="mt-4 px-7 py-3 rounded-full bg-[#0d0e10] text-[#d4ff3a] font-mono font-bold text-xs hover:bg-black transition-all cursor-pointer shadow-md active:scale-95"
            >
              CLOSE WINDOW
            </button>
          </div>
        ) : (
          <>
            <div className="space-y-2">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#eeeee8] text-xs font-mono font-bold text-[#0d0e10]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#0d0e10]" />
                <span>ARCHITECTURE AUDIT</span>
              </div>
              <h3 className="text-2xl font-extrabold text-[#0d0e10] font-heading tracking-tight">
                Automate your content engine.
              </h3>
              <p className="text-xs text-[#75766f] leading-relaxed font-sans">
                Schedule a 20-minute workflow review with Javarif engineers to design custom webhook triggers, brand voice filters, and multi-channel pipelines.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 pt-2">
              {error && (
                <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-600 font-mono">
                  {error}
                </div>
              )}

              <div>
                <label className="text-xs text-[#0d0e10] block mb-1.5 font-mono uppercase font-bold">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Arif Rahman"
                  className="w-full px-4 py-2.5 rounded-full bg-[#eeeee8] border border-[#dcdcd3] text-sm text-[#0d0e10] placeholder-[#75766f] focus:outline-none focus:border-[#0d0e10] focus:bg-white transition-all font-mono"
                />
              </div>

              <div>
                <label className="text-xs text-[#0d0e10] block mb-1.5 font-mono uppercase font-bold">
                  Work Email
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="arif@company.com"
                  className="w-full px-4 py-2.5 rounded-full bg-[#eeeee8] border border-[#dcdcd3] text-sm text-[#0d0e10] placeholder-[#75766f] focus:outline-none focus:border-[#0d0e10] focus:bg-white transition-all font-mono"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-[#0d0e10] block mb-1.5 font-mono uppercase font-bold">
                    Brand / Company
                  </label>
                  <input
                    type="text"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    placeholder="GoBrand Inc."
                    className="w-full px-4 py-2.5 rounded-full bg-[#eeeee8] border border-[#dcdcd3] text-sm text-[#0d0e10] placeholder-[#75766f] focus:outline-none focus:border-[#0d0e10] focus:bg-white transition-all font-mono"
                  />
                </div>

                <div>
                  <label className="text-xs text-[#0d0e10] block mb-1.5 font-mono uppercase font-bold">
                    Monthly Output
                  </label>
                  <select
                    value={monthlyVolume}
                    onChange={(e) => setMonthlyVolume(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-full bg-[#eeeee8] border border-[#dcdcd3] text-xs text-[#0d0e10] focus:outline-none focus:border-[#0d0e10] focus:bg-white transition-all font-mono"
                  >
                    <option value="10 - 20 pieces/month">10 - 20 pieces/mo</option>
                    <option value="20 - 50 pieces/month">20 - 50 pieces/mo</option>
                    <option value="50+ pieces/month">50+ pieces/mo (Agency)</option>
                  </select>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 rounded-full bg-[#d4ff3a] hover:bg-[#c6f02e] text-[#0d0e10] font-mono font-bold text-xs transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md active:scale-95 mt-4 uppercase btn-spring"
              >
                <span>REQUEST ARCHITECTURE AUDIT →</span>
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
};
