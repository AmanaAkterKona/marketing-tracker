import React from 'react';
import { motion } from 'framer-motion';
import { useRouter } from '../context/RouterContext';

// Logo Image Import
import logo from '../assets/logo (2).png';

export const Footer: React.FC = () => {
  const { navigate } = useRouter();
  const currentYear = new Date().getFullYear();

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  };

  return (
    <footer
      id="main-footer"
      className="relative overflow-hidden bg-[#00222b] text-slate-300 py-12 border-t border-teal-900/40"
    >
      {/* Background Subtle Glow Effect */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-teal-500/5 rounded-full blur-3xl pointer-events-none" />

      <motion.div
        className="max-w-7xl mx-auto px-6 sm:px-8 relative z-10 flex flex-col md:flex-row items-center justify-between gap-8"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-50px" }}
        variants={containerVariants}
      >
        {/* Left Identity & Branding */}
        <motion.div variants={itemVariants} className="flex flex-col items-center md:items-start text-center md:text-left">
          <div
            onClick={() => navigate('/')}
            className="group cursor-pointer flex items-center gap-1.5 text-xl font-bold tracking-tight text-white transition-transform duration-300 active:scale-95"
          >
            {/* Custom Clear & Sharp Animated Logo Image */}
            <motion.div
              whileHover={{ scale: 1.08 }}
              transition={{ type: "spring", stiffness: 300, damping: 15 }}
              className="w-9 h-9 flex items-center justify-center shrink-0"
            >
              <img
                src={logo}
                alt="BayezidMir Logo"
                className="w-full h-full object-contain brightness-110 contrast-105 filter drop-shadow-[0_2px_10px_rgba(38,199,196,0.25)]"
              />
            </motion.div>
            
            <span className="group-hover:text-teal-400 transition-colors duration-300 ml-0.5">
              Bayezid<span className="text-teal-400">Mir</span>
            </span>
          </div>

          <p className="text-xs text-teal-200/70 mt-2 font-mono tracking-wide flex items-center gap-1.5">
            <span>Tracking</span>
            <span className="text-teal-500/50">•</span>
            <span>Attribution</span>
            <span className="text-teal-500/50">•</span>
            <span>Analytics</span>
          </p>
        </motion.div>

        {/* Navigation Links */}
        <motion.nav
          variants={itemVariants}
          aria-label="Footer Links"
          className="flex flex-wrap justify-center items-center gap-x-6 gap-y-3 text-sm font-medium text-slate-300"
        >
          <motion.a
            whileHover={{ y: -2, color: "#38bdf8" }}
            href="#expertise"
            className="transition-colors duration-200"
          >
            Expertise
          </motion.a>

          <motion.button
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/insights')}
            className="text-teal-400 font-semibold hover:text-teal-300 transition-colors bg-teal-500/10 px-3 py-1 rounded-full border border-teal-500/20 shadow-sm"
          >
            Insights
          </motion.button>

          <motion.a
            whileHover={{ y: -2, color: "#38bdf8" }}
            href="#work"
            className="transition-colors duration-200"
          >
            Work
          </motion.a>

          <motion.a
            whileHover={{ y: -2, color: "#38bdf8" }}
            href="#about"
            className="transition-colors duration-200"
          >
            About
          </motion.a>

          <motion.a
            whileHover={{ y: -2, color: "#38bdf8" }}
            href="#contact"
            className="transition-colors duration-200"
          >
            Contact
          </motion.a>

          <motion.a
            whileHover={{ y: -2, color: "#ffffff" }}
            href="https://www.linkedin.com/in/bayezid-mir-54197224b/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-slate-400 hover:text-white transition-colors duration-200"
          >
            LinkedIn
          </motion.a>

          <motion.a
            whileHover={{ y: -2, color: "#ffffff" }}
            href="https://www.upwork.com/freelancers/bayezidmir"
            target="_blank"
            rel="noopener noreferrer"
            className="text-slate-400 hover:text-white transition-colors duration-200"
          >
            Upwork
          </motion.a>
        </motion.nav>

        {/* Copyright */}
        <motion.div
          variants={itemVariants}
          className="text-xs text-slate-400 font-mono text-center md:text-right"
        >
          &copy; {currentYear} Bayezid Mir. All rights reserved.
        </motion.div>
      </motion.div>
    </footer>
  );
};