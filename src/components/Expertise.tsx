import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import {
  Activity,
  Users,
  Mail,
  Server,
  BarChart3,
  Database,
  ArrowUpRight,
} from 'lucide-react';

import { EXPERTISE_ITEMS } from '../data';
import { ExpertiseItem } from '../types';
import { api } from '../lib/api';
import { resolveIcon } from '../lib/icons';

interface ExpertiseProps {
  onSelectExpertise: (item: ExpertiseItem) => void;
}

const expertiseIcons = [
  Activity,
  Users,
  Mail,
  Server,
  BarChart3,
  Database,
];

export const Expertise: React.FC<ExpertiseProps> = ({
  onSelectExpertise,
}) => {
  // Starts with the default list, then shows whatever the admin saved
  const [items, setItems] = useState<ExpertiseItem[]>(EXPERTISE_ITEMS);

  useEffect(() => {
    let mounted = true;
    api.getExpertise().then((list) => {
      if (mounted) setItems(list);
    });
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <section
      id="expertise"
      className="py-20 md:py-28 max-w-6xl mx-auto px-6 sm:px-8"
    >
      {/* Section Header */}
      <motion.div
        className="mb-10 md:mb-12"
        initial={{ opacity: 0, y: 18 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
      >
        {/* Small Label */}
        <div className="flex items-center gap-2 mb-2">
          <span className="w-1.5 h-1.5 rounded-full bg-[#177D81] shadow-[0_0_10px_rgba(23,125,129,0.45)]" />

          <span className="text-[10px] sm:text-[11px] font-semibold tracking-[0.16em] uppercase text-[#177D81]">
            My Expertise
          </span>
        </div>

        {/* Heading */}
        <h2 className="text-2xl sm:text-3xl md:text-[32px] font-bold tracking-tight text-[#0B282A]">
          What I{' '}
          <span className="text-[#177D81]">
            specialize in
          </span>
        </h2>

        {/* Small supporting line */}
        <div className="mt-3 max-w-xl">
          <p className="text-sm text-[#557274] leading-relaxed">
            I help businesses track what matters, turn data into insights,
            and build systems that scale.
          </p>
        </div>
      </motion.div>

      {/* 6 Expertise Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 lg:gap-x-8 gap-y-6 lg:gap-y-8">
        {items.map((item, index) => {
          const Icon = resolveIcon(item.icon, index, expertiseIcons);

          return (
            <motion.div
              key={item.id}
              id={`expertise-card-${item.id}`}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.15 }}
              transition={{
                duration: 0.5,
                delay: index * 0.07,
                ease: 'easeOut',
              }}
              whileHover={{
                y: -5,
                transition: {
                  duration: 0.25,
                  ease: 'easeOut',
                },
              }}
              onClick={() => onSelectExpertise(item)}
              className="
                group
                relative
                flex
                flex-col
                justify-between
                min-h-[190px]
                rounded-xl
                border
                border-[#BFDCDD]
                bg-gradient-to-br
                from-white
                via-[#FBFEFE]
                to-[#F1FAFA]
                p-5
                cursor-pointer
                overflow-hidden
                transition-all
                duration-300
                hover:border-[#7EC5C7]
                hover:shadow-[0_14px_35px_-18px_rgba(23,125,129,0.35)]
              "
            >
              {/* Subtle background glow */}
              <div
                className="
                  pointer-events-none
                  absolute
                  -right-10
                  -top-10
                  w-28
                  h-28
                  rounded-full
                  bg-[#BDE7E5]/30
                  blur-2xl
                  opacity-0
                  group-hover:opacity-100
                  transition-opacity
                  duration-500
                "
              />

              {/* Top Row */}
              <div className="relative flex items-start justify-between">
                {/* Icon */}
                <motion.div
                  whileHover={{
                    scale: 1.08,
                    rotate: -3,
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
                    w-10
                    h-10
                    rounded-full
                    bg-[#DDEFEF]
                    border
                    border-[#C7E5E5]
                    text-[#177D81]
                    shadow-[0_4px_12px_-6px_rgba(23,125,129,0.35)]
                    transition-all
                    duration-300
                    group-hover:bg-[#177D81]
                    group-hover:text-white
                    group-hover:border-[#177D81]
                  "
                >
                  <Icon className="w-[18px] h-[18px]" strokeWidth={2} />
                </motion.div>

                {/* Arrow */}
                <motion.div
                  whileHover={{
                    scale: 1.08,
                    rotate: 8,
                  }}
                  className="
                    flex
                    items-center
                    justify-center
                    w-7
                    h-7
                    rounded-full
                    border
                    border-[#D3E7E8]
                    bg-white/80
                    text-[#177D81]
                    transition-all
                    duration-300
                    group-hover:bg-[#177D81]
                    group-hover:text-white
                    group-hover:border-[#177D81]
                  "
                >
                  <ArrowUpRight
                    className="w-3.5 h-3.5"
                    strokeWidth={2}
                  />
                </motion.div>
              </div>

              {/* Content */}
              <div className="relative mt-4">
                {/* Small Number */}
                <div className="mb-1.5">
                  <span className="text-[9px] font-mono font-medium tracking-wider text-[#8AA5A6]">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                </div>

                {/* Title */}
                <h3
                  className="
                    text-[16px]
                    sm:text-[17px]
                    font-semibold
                    tracking-tight
                    text-[#0B282A]
                    transition-colors
                    duration-300
                    group-hover:text-[#177D81]
                  "
                >
                  {item.title}
                </h3>

                {/* Description */}
                <p
                  className="
                    mt-2
                    text-[12px]
                    sm:text-[13px]
                    text-[#607C7E]
                    leading-[1.65]
                    max-w-[95%]
                  "
                >
                  {item.description}
                </p>
              </div>

              {/* Bottom Hover Line */}
              <motion.div
                className="
                  absolute
                  bottom-0
                  left-0
                  h-[2px]
                  bg-gradient-to-r
                  from-[#177D81]
                  via-[#2B9295]
                  to-transparent
                "
                initial={{ width: 0 }}
                whileHover={{ width: '65%' }}
                transition={{ duration: 0.35 }}
              />
            </motion.div>
          );
        })}
      </div>
    </section>
  );
};