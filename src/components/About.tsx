import React, { useEffect, useRef, useState } from 'react';
import { ABOUT_PARAGRAPH } from '../data';
import { ArrowRight } from 'lucide-react';
import aboutImage from '../assets/about.jpeg';


interface AboutProps {
  onMoreAboutClick: () => void;
}

export const About: React.FC<AboutProps> = ({ onMoreAboutClick }) => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  // Scroll-reveal: animate in once the card enters the viewport
  useEffect(() => {
    const node = sectionRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <section id="about" className="py-20 md:py-24 border-t border-slate-200/60 max-w-6xl mx-auto px-6 sm:px-8">
      <div
        ref={sectionRef}
        className={`group relative overflow-hidden rounded-3xl shadow-xl min-h-[360px] md:min-h-[380px] lg:min-h-[400px] transition-all duration-700 ease-out ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}
      >
        {/* Background image */}
        <img
          src={aboutImage}
          alt="Bayezid working on marketing measurement dashboards"
          className="absolute inset-0 w-full h-full object-cover object-right transition-transform duration-[1200ms] ease-out group-hover:scale-105"
        />

        {/* Dark teal gradient overlay for text legibility */}
        <div className="absolute inset-0 bg-gradient-to-r from-teal-950 via-teal-950/85 to-teal-950/10 transition-opacity duration-700 group-hover:from-teal-950/95" />

        {/* Content */}
        <div className="relative z-10 flex flex-col justify-center h-full px-8 py-10 md:px-14 md:py-12 max-w-xl">
          {/* Eyebrow */}
          <div
            className={`inline-flex items-center gap-2 mb-4 transition-all duration-700 delay-100 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
          >
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <p className="font-mono text-xs font-semibold tracking-wider uppercase text-emerald-200/90">
              About Me
            </p>
          </div>

          {/* Heading */}
          <h2
            className={`text-3xl sm:text-4xl font-bold text-white tracking-tight mb-5 transition-all duration-700 delay-150 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
          >
            About Bayezid
          </h2>

          {/* Description */}
          <p
            className={`text-base sm:text-lg text-teal-50/90 leading-relaxed mb-8 font-normal transition-all duration-700 delay-200 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
          >
            {ABOUT_PARAGRAPH}
          </p>

          {/* CTA */}
          <div
            className={`transition-all duration-700 delay-300 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
          >
            <button
              type="button"
              id="about-more-link"
              onClick={onMoreAboutClick}
              className="group/btn relative inline-flex items-center gap-3 pl-6 pr-2 py-2 rounded-full bg-white text-teal-900 font-medium text-sm overflow-hidden isolate shadow-[0_4px_20px_-4px_rgba(255,255,255,0.4)] hover:shadow-[0_8px_28px_-4px_rgba(255,255,255,0.6)] transition-all duration-500 ease-out hover:-translate-y-0.5 active:translate-y-0 active:scale-95"
            >
              {/* Shine sweep */}
              <span className="pointer-events-none absolute inset-0 -translate-x-full group-hover/btn:translate-x-full transition-transform duration-[900ms] ease-out bg-gradient-to-r from-transparent via-teal-100/70 to-transparent skew-x-12" />

              <span className="relative z-10">More About Me</span>

              {/* Icon capsule */}
              <span className="relative z-10 flex items-center justify-center w-8 h-8 rounded-full bg-teal-900 text-white transition-all duration-500 ease-out group-hover/btn:bg-emerald-500 group-hover/btn:rotate-45">
                <ArrowRight className="w-4 h-4 transition-transform duration-500 group-hover/btn:-rotate-45" />
              </span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};