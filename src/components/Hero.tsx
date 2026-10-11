import React from "react";
import { motion } from "motion/react";
import {
  ArrowRight,
  ArrowUpRight,
} from "lucide-react";
import { MeasurementVisual } from "./MeasurementVisual";

interface HeroProps {
  onTalkClick: () => void;
}

export const Hero: React.FC<HeroProps> = ({
  onTalkClick,
}) => {
  return (
    <section
      id="hero-section"
      className="
        pt-32
        pb-16
        md:pt-40
        md:pb-24
        max-w-6xl
        mx-auto
        px-6
        sm:px-8
        border-b
        border-[#0B7F84]/10
        relative
        overflow-hidden
      "
    >
      {/* =========================================
          BACKGROUND DECORATION
      ========================================== */}

      <div
        className="
          pointer-events-none
          absolute
          top-10
          right-[-120px]
          w-[380px]
          h-[380px]
          rounded-full
          bg-[#16BFC0]/8
          blur-3xl
        "
      />

      <div
        className="
          pointer-events-none
          absolute
          bottom-0
          left-[-160px]
          w-[350px]
          h-[350px]
          rounded-full
          bg-[#087E82]/5
          blur-3xl
        "
      />

      <div
        className="
          relative
          z-10
          grid
          grid-cols-1
          lg:grid-cols-12
          gap-12
          lg:gap-8
          items-center
        "
      >

        {/* =========================================
            LEFT COLUMN
        ========================================== */}

        <motion.div
          className="
            lg:col-span-7
            flex
            flex-col
            items-start
          "
          initial={{
            opacity: 0,
            x: -35,
          }}
          animate={{
            opacity: 1,
            x: 0,
          }}
          transition={{
            duration: 0.8,
            ease: "easeOut",
          }}
        >

          {/* =====================================
              EYEBROW
          ====================================== */}

          <motion.div
            initial={{
              opacity: 0,
              y: 12,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              delay: 0.15,
              duration: 0.5,
            }}
            className="
              inline-flex
              items-center
              gap-2
              mb-4
              px-3
              py-1.5
              rounded-full
              bg-[#E7F8F7]
              border
              border-[#0B9FA3]/10
            "
          >
            <span
              className="
                h-1.5
                w-1.5
                rounded-full
                bg-[#0B9FA3]
                shadow-[0_0_0_4px_rgba(11,159,163,0.10)]
              "
            />

            <p
              className="
                text-[10px]
                sm:text-[11px]
                font-semibold
                tracking-[0.14em]
                uppercase
                text-[#087E82]
              "
            >
              Marketing Measurement & Conversion Tracking
            </p>
          </motion.div>


          {/* =====================================
              MAIN HEADLINE
          ====================================== */}

          <motion.h1
            initial={{
              opacity: 0,
              y: 25,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              delay: 0.25,
              duration: 0.7,
              ease: "easeOut",
            }}
            className="
              text-3xl
              sm:text-4xl
              md:text-5xl
              font-bold
              tracking-[-0.045em]
              text-[#102F38]
              leading-[1.08]
              mb-6
              max-w-[680px]
            "
          >
            I build tracking systems{" "}
            <span
              className="
                text-[#087E82]
              "
            >
              you can trust.
            </span>
          </motion.h1>


          {/* =====================================
              SUPPORTING TEXT
          ====================================== */}

          <motion.p
            initial={{
              opacity: 0,
              y: 20,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              delay: 0.38,
              duration: 0.6,
            }}
            className="
              text-base
              sm:text-lg
              text-[#49656B]
              leading-relaxed
              max-w-xl
              mb-8
            "
          >
            Conversion tracking, attribution,
            analytics, and server-side measurement
            across your website, advertising
            platforms, and CRM.
          </motion.p>


          {/* =====================================
              CTAs
          ====================================== */}

          <motion.div
            initial={{
              opacity: 0,
              y: 18,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              delay: 0.5,
              duration: 0.6,
            }}
            className="
              flex
              flex-wrap
              items-center
              gap-4
              sm:gap-6
            "
          >

            {/* Primary */}

            <button
              id="hero-primary-cta"
              onClick={onTalkClick}
              className="
                group
                relative
                inline-flex
                items-center
                justify-center
                gap-2
                px-6
                py-3
                rounded-full
                overflow-hidden
                bg-[#087E82]
                hover:bg-[#076E73]
                text-white
                font-semibold
                text-sm
                transition-all
                duration-300
                shadow-[0_8px_22px_rgba(8,126,130,0.18)]
                hover:-translate-y-0.5
                hover:shadow-[0_12px_28px_rgba(8,126,130,0.25)]
              "
            >

              {/* Shine */}

              <span
                className="
                  absolute
                  top-0
                  left-[-100%]
                  w-[70%]
                  h-full
                  bg-gradient-to-r
                  from-transparent
                  via-white/20
                  to-transparent
                  skew-x-[-20deg]
                  group-hover:left-[140%]
                  transition-all
                  duration-700
                "
              />

              <span className="relative z-10">
                Let's Talk
              </span>

              <ArrowUpRight
                className="
                  relative
                  z-10
                  w-4
                  h-4
                  text-[#DDF9F7]
                  group-hover:translate-x-0.5
                  group-hover:-translate-y-0.5
                  transition-transform
                  duration-300
                "
              />
            </button>


            {/* Secondary */}

            <a
              id="hero-secondary-cta"
              href="#expertise"
              className="
                group
                inline-flex
                items-center
                gap-2
                text-sm
                font-semibold
                text-[#315B61]
                hover:text-[#087E82]
                transition-colors
                py-2
              "
            >
              <span>
                Explore My Expertise
              </span>

              <span
                className="
                  flex
                  items-center
                  justify-center
                  w-7
                  h-7
                  rounded-full
                  border
                  border-[#0B9FA3]/20
                  bg-white
                  group-hover:bg-[#E8F8F7]
                  group-hover:border-[#0B9FA3]/35
                  transition-all
                  duration-300
                "
              >
                <ArrowRight
                  className="
                    w-3.5
                    h-3.5
                    text-[#087E82]
                    group-hover:translate-x-0.5
                    transition-transform
                    duration-300
                  "
                />
              </span>
            </a>
          </motion.div>
        </motion.div>


        {/* =========================================
            RIGHT COLUMN
        ========================================== */}

        <motion.div
          className="
            lg:col-span-5
            flex
            justify-center
            lg:justify-end
          "
          initial={{
            opacity: 0,
            x: 35,
          }}
          animate={{
            opacity: 1,
            x: 0,
          }}
          transition={{
            delay: 0.25,
            duration: 0.8,
            ease: "easeOut",
          }}
        >
          <MeasurementVisual />
        </motion.div>
      </div>
    </section>
  );
};