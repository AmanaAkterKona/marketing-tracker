import React from 'react';
import { X, ArrowUpRight, CheckCircle2, FileText } from 'lucide-react';
import { CaseStudyItem, ExpertiseItem } from '../types';

interface FuturePreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  caseStudy?: CaseStudyItem | null;
  expertise?: ExpertiseItem | null;
  isAboutMode?: boolean;
  contactHref?: string; // where the contact buttons point (default: #contact on the home page)
}

export const FuturePreviewModal: React.FC<FuturePreviewModalProps> = ({
  isOpen,
  onClose,
  caseStudy,
  expertise,
  isAboutMode,
  contactHref = '#contact',
}) => {
  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#092D36]/40 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-lg rounded-[24px] bg-white/95 backdrop-blur-xl p-6 sm:p-8 border border-[#0B8F95]/10 shadow-[0_20px_55px_rgba(5,83,88,0.14)]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-5 right-5 w-9 h-9 flex items-center justify-center rounded-full text-[#087E82] bg-[#E9FAF9] border border-[#0B8F95]/10 hover:bg-[#D8F4F2] transition-all duration-300"
          aria-label="Close modal"
        >
          <X className="w-4 h-4" />
        </button>

        {caseStudy && (
          <div>
            <div className="flex items-center gap-2 font-mono text-xs text-[#087E82] uppercase tracking-wider mb-2">
              <FileText className="w-3.5 h-3.5" />
              <span>Case Study Specification</span>
            </div>
            <h3 className="text-xl font-bold tracking-[-0.03em] text-[#092D36] mb-3 pr-10">
              {caseStudy.title}
            </h3>
            <p className="text-sm text-[#42636A] leading-relaxed mb-5">
              {caseStudy.description}
            </p>

            <div className="p-4 rounded-2xl bg-[#E9FAF9] border border-[#0B8F95]/10 mb-6">
              <div className="text-xs font-mono text-[#42636A] uppercase mb-2">
                Technical Scope &amp; Architecture
              </div>
              <p className="text-xs text-[#23464D] leading-normal">
                {caseStudy.scope}
              </p>
              <div className="flex flex-wrap gap-1.5 mt-3">
                {caseStudy.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-white border border-[#0B8F95]/15 text-[#087E82]"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            <p className="text-xs text-[#42636A] mb-6">
              Full client metrics and technical implementation writeups are available for technical evaluation during direct consultations.
            </p>

            <div className="flex items-center justify-between gap-3 pt-4 border-t border-[#0B8F95]/10">
              <a
                href={contactHref}
                onClick={onClose}
                className="group inline-flex items-center gap-1.5 text-xs font-semibold px-5 py-2.5 rounded-full bg-[#087C82] hover:bg-[#076A70] text-white shadow-[0_8px_22px_rgba(8,124,130,0.22)] hover:-translate-y-0.5 hover:shadow-[0_12px_28px_rgba(8,124,130,0.28)] transition-all duration-300"
              >
                <span>Discuss this architecture</span>
                <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-300" />
              </a>
              <button
                type="button"
                onClick={onClose}
                className="text-xs font-medium text-[#42636A] hover:text-[#087E82] transition-colors duration-300"
              >
                Close
              </button>
            </div>
          </div>
        )}

        {expertise && (
          <div>
            <div className="text-xs font-mono text-[#087E82] uppercase tracking-wider mb-2">
              Future Architecture Blueprint
            </div>
            <h3 className="text-xl font-bold tracking-[-0.03em] text-[#092D36] mb-3 pr-10">
              {expertise.title}
            </h3>
            <p className="text-sm text-[#42636A] leading-relaxed mb-4">
              {expertise.description}
            </p>
            <div className="p-4 rounded-2xl bg-[#E9FAF9] border border-[#0B8F95]/10 mb-6">
              <div className="text-xs font-mono text-[#42636A] uppercase mb-1">
                Planned Dedicated Page
              </div>
              <div className="font-mono text-xs text-[#087E82] font-medium">
                {expertise.futureSlug}
              </div>
              <p className="text-xs text-[#42636A] mt-2">
                A standalone in-depth guide covering setup protocols, verification scripts, and deduplication best practices is planned for this service.
              </p>
            </div>
            <div className="flex items-center justify-between gap-3 pt-4 border-t border-[#0B8F95]/10">
              <a
                href={contactHref}
                onClick={onClose}
                className="group inline-flex items-center gap-1.5 text-xs font-semibold px-5 py-2.5 rounded-full bg-[#087C82] hover:bg-[#076A70] text-white shadow-[0_8px_22px_rgba(8,124,130,0.22)] hover:-translate-y-0.5 hover:shadow-[0_12px_28px_rgba(8,124,130,0.28)] transition-all duration-300"
              >
                <span>Inquire about {expertise.title}</span>
                <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-300" />
              </a>
              <button
                type="button"
                onClick={onClose}
                className="text-xs font-medium text-[#42636A] hover:text-[#087E82] transition-colors duration-300"
              >
                Close
              </button>
            </div>
          </div>
        )}

        {isAboutMode && (
          <div>
            <div className="text-xs font-mono text-[#0B8F95] uppercase tracking-wider mb-2">
              Background &amp; Philosophy
            </div>
            <h3 className="text-xl font-bold tracking-[-0.03em] text-[#092D36] mb-3 pr-10">
              Engineering Trust in Measurement
            </h3>
            <p className="text-sm text-[#42636A] leading-relaxed mb-4">
              Modern ad networks, browsers, and CRM platforms operate under increasingly restricted privacy environments, third-party cookie phaseouts, and aggressive ad-blockers.
            </p>
            <p className="text-sm text-[#42636A] leading-relaxed mb-6">
              Bayezid's consulting approach centers on first-party data ownership, deterministic server-side event collection, and rigorous cross-platform reconciliation so revenue reports remain mathematically verifiable.
            </p>
            <div className="flex items-center justify-between gap-3 pt-4 border-t border-[#0B8F95]/10">
              <a
                href={contactHref}
                onClick={onClose}
                className="group inline-flex items-center gap-1.5 text-xs font-semibold px-5 py-2.5 rounded-full bg-[#087C82] hover:bg-[#076A70] text-white shadow-[0_8px_22px_rgba(8,124,130,0.22)] hover:-translate-y-0.5 hover:shadow-[0_12px_28px_rgba(8,124,130,0.28)] transition-all duration-300"
              >
                <span>Get in touch</span>
                <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-300" />
              </a>
              <button
                type="button"
                onClick={onClose}
                className="text-xs font-medium text-[#42636A] hover:text-[#087E82] transition-colors duration-300"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};