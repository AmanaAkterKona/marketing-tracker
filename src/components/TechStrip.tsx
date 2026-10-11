import React from 'react';
import { motion } from 'motion/react';
import {
  BarChart3,
  Code2,
  Database,
  Globe2,
  Layers3,
  Link2,
  Megaphone,
  Server,
  ShoppingBag,
  SlidersHorizontal,
  Users,
} from 'lucide-react';

import { TECH_STRIP_ITEMS } from '../data';

const techIcons = [
  BarChart3,
  Code2,
  Globe2,
  BarChart3,
  Link2,
  Server,
  Megaphone,
  ShoppingBag,
  Users,
  SlidersHorizontal,
  Database,
  Layers3,
];

export const TechStrip: React.FC = () => {
  // Duplicated once so the track can loop seamlessly at -50%
  const loopItems = [...TECH_STRIP_ITEMS, ...TECH_STRIP_ITEMS];

  return (
    <div
      id="technology-strip"
      className="max-w-6xl mx-auto px-6 sm:px-8 pb-16 md:pb-20"
    >
      {/* Marquee keyframes */}
      <style>{`
        @keyframes tech-marquee {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
        .tech-marquee-track {
          animation: tech-marquee 28s linear infinite;
        }
        .tech-marquee-wrap:hover .tech-marquee-track {
          animation-play-state: paused;
        }
      `}</style>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.25 }}
        transition={{
          duration: 0.6,
          ease: 'easeOut',
        }}
        className="
          tech-marquee-wrap
          relative
          py-5
          rounded-xl
          border
          border-[#BFDCDD]
          bg-gradient-to-r
          from-white
          via-[#F7FCFC]
          to-[#F0FAFA]
          overflow-hidden
        "
      >
        {/* Soft Background Glow */}
        <div
          className="
            pointer-events-none
            absolute
            -top-12
            right-10
            w-32
            h-32
            rounded-full
            bg-[#BDE7E5]/30
            blur-3xl
          "
        />

        {/* Edge fade masks — premium marquee finish */}
        <div
          className="
            pointer-events-none
            absolute
            inset-y-0
            left-0
            w-14
            sm:w-24
            z-10
            bg-gradient-to-r
            from-[#F7FCFC]
            to-transparent
          "
        />
        <div
          className="
            pointer-events-none
            absolute
            inset-y-0
            right-0
            w-14
            sm:w-24
            z-10
            bg-gradient-to-l
            from-[#F0FAFA]
            to-transparent
          "
        />

        {/* Marquee track */}
        <div className="tech-marquee-track relative flex w-max items-center gap-x-8">
          {loopItems.map((tech, idx) => {
            const Icon = techIcons[idx % techIcons.length];

            return (
              <div
                key={`${tech}-${idx}`}
                className="flex items-center gap-x-8 shrink-0"
              >
                <div className="group flex items-center gap-2 cursor-default shrink-0">
                  {/* Icon */}
                  <motion.span
                    whileHover={{
                      scale: 1.1,
                      rotate: -4,
                    }}
                    transition={{
                      type: 'spring',
                      stiffness: 300,
                      damping: 15,
                    }}
                    className="
                      flex
                      items-center
                      justify-center
                      w-7
                      h-7
                      rounded-lg
                      bg-[#E3F3F3]
                      border
                      border-[#D1EAEA]
                      text-[#177D81]
                      shrink-0
                      transition-all
                      duration-300
                      group-hover:bg-[#177D81]
                      group-hover:text-white
                      group-hover:border-[#177D81]
                      group-hover:shadow-[0_6px_16px_-6px_rgba(23,125,129,0.6)]
                    "
                  >
                    <Icon
                      className="w-3.5 h-3.5"
                      strokeWidth={2}
                    />
                  </motion.span>

                  {/* Technology Name */}
                  <span
                    className="
                      text-xs
                      sm:text-[13px]
                      font-medium
                      text-[#45696B]
                      whitespace-nowrap
                      transition-colors
                      duration-300
                      group-hover:text-[#177D81]
                    "
                  >
                    {tech}
                  </span>
                </div>

                {/* Separator */}
                <span
                  className="
                    w-1
                    h-1
                    rounded-full
                    bg-[#B8D8D9]
                    shrink-0
                  "
                />
              </div>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
};