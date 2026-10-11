import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  Mail,
  MessageSquare,
  Linkedin,
  ArrowUpRight,
  Copy,
  Check,
  Send,
  BriefcaseBusiness,
  Crown,
} from 'lucide-react';

import { CONTACT_METHODS } from '../data';
import bayezidPhoto from '../assets/bayezid.jpeg';
import arrowDoodle from '../assets/arrow.png';

export const Contact: React.FC = () => {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [inquiryText, setInquiryText] = useState('');
  const [visitorEmail, setVisitorEmail] = useState('');
  const [honeypot, setHoneypot] = useState('');
  const [sendStatus, setSendStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');
  const [sendMessage, setSendMessage] = useState('');

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);

    setTimeout(() => {
      setCopiedId(null);
    }, 2000);
  };

  const getIcon = (id: string) => {
    switch (id) {
      case 'whatsapp':
        return <MessageSquare className="w-4 h-4" />;

      case 'email':
        return <Mail className="w-4 h-4" />;

      case 'upwork':
        return (
          <span className="font-mono text-[10px] font-bold">
            UP
          </span>
        );

      case 'linkedin':
        return <Linkedin className="w-4 h-4" />;

      default:
        return <Mail className="w-4 h-4" />;
    }
  };

  // Fallback used only when the server has no email settings yet
  const openMailApp = () => {
    const subject = encodeURIComponent('Tracking System Inquiry – Bayezid Mir');
    const body = encodeURIComponent(
      `Hi Bayezid,\n\nI have a tracking project / issue:\n\n${inquiryText.trim()}\n\nLooking forward to discussing.`
    );
    window.location.href = `mailto:warner.roman@gmail.com?subject=${subject}&body=${body}`;
  };

  // Sends the message to the server, which emails it to the inbox set in .env
  const handleSend = async () => {
    if (sendStatus === 'sending') return;

    if (inquiryText.trim().length < 5) {
      setSendStatus('error');
      setSendMessage('Please write a short message first.');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(visitorEmail.trim())) {
      setSendStatus('error');
      setSendMessage('Please enter a valid email so I can reply to you.');
      return;
    }

    setSendStatus('sending');
    setSendMessage('');

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: inquiryText.trim(),
          email: visitorEmail.trim(),
          hp_company: honeypot,
        }),
      });

      if (res.ok) {
        setSendStatus('sent');
        setSendMessage("Message sent! I'll get back to you soon.");
        setInquiryText('');
        setVisitorEmail('');
        return;
      }

      // Email service not set up on the server: open the visitor's mail app instead
      if (res.status === 503) {
        setSendStatus('idle');
        setSendMessage('');
        openMailApp();
        return;
      }

      const data = await res.json().catch(() => ({}));
      setSendStatus('error');
      setSendMessage(data.error || 'Could not send your message. Please try again.');
    } catch {
      setSendStatus('error');
      setSendMessage('Network error. Please check your connection and try again.');
    }
  };

  return (
    <section
      id="contact"
      className="
        relative
        py-20
        md:py-28
        border-t
        border-[#D8E9E8]
        max-w-6xl
        mx-auto
        px-6
        sm:px-8
        overflow-hidden
      "
    >
      {/* Soft Background Glow */}
      <div
        className="
          pointer-events-none
          absolute
          top-16
          right-0
          w-56
          h-56
          rounded-full
          bg-[#CDEDEC]/25
          blur-3xl
        "
      />

      {/* =====================================================
          TOP: LEFT HEADER  +  RIGHT PROFILE / CHECKLIST
      ===================================================== */}

      <div
        className="
          relative
          grid
          grid-cols-1
          lg:grid-cols-2
          gap-12
          lg:gap-10
          items-stretch
          mb-14
        "
      >
        {/* -------------------- LEFT: HEADER -------------------- */}
        <motion.div
          initial={{
            opacity: 0,
            y: 18,
          }}
          whileInView={{
            opacity: 1,
            y: 0,
          }}
          viewport={{
            once: true,
            amount: 0.25,
          }}
          transition={{
            duration: 0.6,
            ease: 'easeOut',
          }}
          className="relative max-w-xl h-full flex flex-col justify-between items-start"
        >
          <div className="w-full">
            {/* Eyebrow */}
            <div className="flex items-center gap-2 mb-3">
              <span
                className="
                  flex
                  items-center
                  justify-center
                  w-6
                  h-6
                  rounded-md
                  bg-[#E1F3F2]
                  border
                  border-[#CBE7E6]
                  text-[#177D81]
                "
              >
                <Crown className="w-3.5 h-3.5" />
              </span>

              <span
                className="
                  text-[10px]
                  sm:text-[11px]
                  font-semibold
                  tracking-[0.16em]
                  uppercase
                  text-[#177D81]
                "
              >
                Let's Work Together
              </span>
            </div>

            {/* Heading */}
            <h2
              className="
                text-2xl
                sm:text-3xl
                md:text-[32px]
                font-bold
                tracking-tight
                text-[#0B282A]
                leading-tight
                mb-4
              "
            >
              Have a tracking problem?{' '}
              <span className="text-[#177D81]">
                Let's talk.
              </span>
            </h2>

            {/* Description */}
            <p
              className="
                text-base
                sm:text-lg
                text-[#607C7E]
                leading-relaxed
                mb-8
              "
            >
              Tell me what you are trying to measure, where the data
              is breaking, or what you want to connect.
            </p>
          </div>

          {/* Bottom block: CTA + trust row */}
          <div className="w-full flex flex-col gap-7">
            {/* Get in touch CTA */}
            <motion.a
              href="#contact-option-email"
              whileHover={{ y: -3, scale: 1.03 }}
              whileTap={{ scale: 0.96 }}
              animate={{
                boxShadow: [
                  '0 8px 20px -12px rgba(23,125,129,0.6)',
                  '0 10px 28px -10px rgba(23,125,129,0.85)',
                  '0 8px 20px -12px rgba(23,125,129,0.6)',
                ],
              }}
              transition={{
                boxShadow: {
                  duration: 2.4,
                  repeat: Infinity,
                  ease: 'easeInOut',
                },
              }}
              className="
                relative
                inline-flex
                w-fit
                items-center
                gap-2
                px-5
                py-3
                rounded-lg
                bg-[#177D81]
                hover:bg-[#126B6E]
                text-white
                text-sm
                font-medium
                overflow-hidden
                transition-colors
                duration-300
              "
            >
              {/* Shimmer sweep */}
              <motion.span
                aria-hidden="true"
                initial={{ x: '-120%' }}
                animate={{ x: '220%' }}
                transition={{
                  duration: 2.2,
                  repeat: Infinity,
                  repeatDelay: 1.4,
                  ease: 'easeInOut',
                }}
                className="
                  pointer-events-none
                  absolute
                  inset-y-0
                  left-0
                  w-1/3
                  bg-gradient-to-r
                  from-transparent
                  via-white/30
                  to-transparent
                  skew-x-[-20deg]
                "
              />

              <span className="relative z-10">Get in touch</span>
              <motion.span
                className="relative z-10 flex"
                animate={{ x: [0, 4, 0] }}
                transition={{
                  duration: 1.4,
                  repeat: Infinity,
                  repeatDelay: 0.6,
                  ease: 'easeInOut',
                }}
              >
                <ArrowUpRight className="w-4 h-4" />
              </motion.span>
            </motion.a>
          </div>
        </motion.div>

        {/* -------------------- RIGHT: PROFILE + CHECKLIST -------------------- */}
        <motion.div
          initial={{
            opacity: 0,
            y: 18,
          }}
          whileInView={{
            opacity: 1,
            y: 0,
          }}
          viewport={{
            once: true,
            amount: 0.25,
          }}
          transition={{
            duration: 0.6,
            delay: 0.1,
            ease: 'easeOut',
          }}
          className="relative w-full max-w-sm lg:ml-auto h-full flex flex-col justify-between"
        >
          {/* Profile avatar + chat bubble */}
          <div className="flex items-start gap-3 mb-5">
            {/* Profile photo */}
            <div
              className="
                flex
                items-center
                justify-center
                w-11
                h-11
                rounded-full
                bg-[#DFF1F0]
                border
                border-[#C9E7E6]
                shrink-0
                overflow-hidden
              "
            >
              <img
                src={bayezidPhoto}
                alt="Bayezid"
                className="w-full h-full object-cover"
              />
            </div>

            {/* Chat bubble */}
            <div
              className="
                relative
                px-4
                py-2.5
                rounded-xl
                rounded-tl-sm
                bg-white
                border
                border-[#CFE4E4]
                shadow-[0_10px_25px_-18px_rgba(23,125,129,0.5)]
              "
            >
              <p className="text-xs font-semibold text-[#0B282A]">
                Got a tracking issue?
              </p>
              <p className="text-[11px] text-[#71898B]">
                I'm here to help
              </p>
            </div>
          </div>

          {/* Handwritten doodle accent — arrow pointing from bubble to cards */}
          <img
            src={arrowDoodle}
            alt=""
            aria-hidden="true"
            className="
              pointer-events-none
              select-none
              absolute
              -right-8
              -top-10
              w-60
              opacity-90
              hidden
              lg:block
            "
          />

          {/* Individual contact cards — each method is its own separate card */}
          <div className="flex flex-col gap-2.5">
            {CONTACT_METHODS.map((method, index) => {
              const isCopied = copiedId === method.id;
              const isDirectValue =
                method.id === 'whatsapp' ||
                method.id === 'email';

              return (
                <motion.div
                  key={method.id}
                  id={`contact-option-${method.id}`}
                  initial={{
                    opacity: 0,
                    x: 14,
                  }}
                  whileInView={{
                    opacity: 1,
                    x: 0,
                  }}
                  viewport={{
                    once: true,
                    amount: 0.4,
                  }}
                  transition={{
                    duration: 0.4,
                    delay: index * 0.06,
                    ease: 'easeOut',
                  }}
                  whileHover={{ x: 3, y: -2 }}
                  className="
                    group
                    relative
                    flex
                    items-center
                    justify-between
                    gap-3
                    px-3.5
                    py-3
                    rounded-xl
                    border
                    border-[#C7E2E2]
                    bg-gradient-to-br
                    from-white
                    via-[#FBFEFE]
                    to-[#F1FAFA]
                    shadow-[0_8px_20px_-16px_rgba(23,125,129,0.35)]
                    hover:border-[#9FD3D2]
                    hover:shadow-[0_12px_24px_-14px_rgba(23,125,129,0.45)]
                    transition-all
                    duration-300
                  "
                >
                  {/* Icon + label/value */}
                  <a
                    href={method.href}
                    target={
                      method.isExternal
                        ? '_blank'
                        : undefined
                    }
                    rel={
                      method.isExternal
                        ? 'noopener noreferrer'
                        : undefined
                    }
                    className="flex items-center gap-3 min-w-0 flex-1"
                  >
                    <span
                      className="
                        flex
                        items-center
                        justify-center
                        w-8
                        h-8
                        rounded-full
                        bg-[#DFF1F0]
                        border
                        border-[#C9E7E6]
                        text-[#177D81]
                        shrink-0
                        transition-all
                        duration-300
                        group-hover:bg-[#177D81]
                        group-hover:text-white
                        group-hover:border-[#177D81]
                      "
                    >
                      {getIcon(method.id)}
                    </span>

                    <span className="min-w-0">
                      <span
                        className="
                          block
                          text-[9px]
                          font-mono
                          uppercase
                          tracking-[0.14em]
                          text-[#789496]
                        "
                      >
                        {method.label}
                      </span>
                      <span
                        className="
                          block
                          text-xs
                          font-semibold
                          text-[#0B282A]
                          truncate
                        "
                      >
                        {method.value}
                      </span>
                    </span>
                  </a>

                  {/* Copy / check indicator */}
                  {isDirectValue ? (
                    <motion.button
                      type="button"
                      whileHover={{ scale: 1.08 }}
                      whileTap={{ scale: 0.94 }}
                      onClick={() =>
                        handleCopy(
                          method.id,
                          method.value
                        )
                      }
                      className="
                        flex
                        items-center
                        justify-center
                        w-6
                        h-6
                        rounded-md
                        text-[#8AA5A6]
                        transition-all
                        duration-300
                        hover:text-[#177D81]
                        shrink-0
                      "
                      title={`Copy ${method.label}`}
                      aria-label={`Copy ${method.value}`}
                    >
                      {isCopied ? (
                        <Check className="w-4 h-4 text-[#177D81]" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </motion.button>
                  ) : (
                    <Check className="w-4 h-4 text-[#177D81] shrink-0" />
                  )}
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </div>

      {/* =====================================================
          DIRECT PROJECT BRIEF
      ===================================================== */}

      <motion.div
        initial={{
          opacity: 0,
          y: 20,
        }}
        whileInView={{
          opacity: 1,
          y: 0,
        }}
        viewport={{
          once: true,
          amount: 0.2,
        }}
        transition={{
          duration: 0.6,
          delay: 0.15,
        }}
        className="
          relative
          p-5
          sm:p-6
          rounded-2xl
          border
          border-[#C7E2E2]
          bg-gradient-to-br
          from-white
          via-[#FBFEFE]
          to-[#F0FAFA]
          overflow-hidden
        "
      >
        {/* Background Decoration */}
        <div
          className="
            pointer-events-none
            absolute
            -right-12
            -bottom-12
            w-40
            h-40
            rounded-full
            bg-[#CDEDEC]/30
            blur-3xl
          "
        />

        <div className="relative">
          {/* Brief Header */}
          <div className="flex items-start gap-3 mb-2">
            <div
              className="
                flex
                items-center
                justify-center
                w-9
                h-9
                rounded-lg
                bg-[#E0F2F1]
                border
                border-[#C9E7E6]
                text-[#177D81]
                shrink-0
              "
            >
              <BriefcaseBusiness className="w-4 h-4" />
            </div>

            <div>
              <h3 className="text-sm font-semibold text-[#0B282A]">
                Direct Project Brief
                <span className="text-[#177D81]">
                  {' '}
                  · Fast Track
                </span>
              </h3>

              <p className="mt-1 text-xs text-[#71898B] leading-relaxed max-w-xl">
                Summarize what platforms you are running
                (e.g. Meta CAPI, Google Ads, GA4, Shopify,
                CRM) and the specific tracking issue you need
                addressed.
              </p>
            </div>
          </div>

          {/* Input + Button */}
          <div className="flex flex-col gap-3 mt-5">
            <input
              id="quick-inquiry-input"
              type="text"
              value={inquiryText}
              onChange={(e) => {
                setInquiryText(e.target.value);
                if (sendStatus !== 'sending') setSendStatus('idle');
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleSend();
                }
              }}
              maxLength={3000}
              placeholder="e.g., Setting up Meta CAPI deduplication with Shopify and HubSpot offline sync..."
              className="
                w-full
                px-4
                py-3
                rounded-lg
                border
                border-[#CFE4E4]
                bg-white/80
                text-sm
                text-[#183335]
                placeholder:text-[#9AAEAF]
                outline-none
                transition-all
                duration-300
                focus:border-[#63B7B8]
                focus:ring-2
                focus:ring-[#BFE4E3]/50
                focus:bg-white
              "
            />

            {/* Hidden spam trap: real visitors never see or fill this */}
            <input
              type="text"
              name="hp_company"
              tabIndex={-1}
              autoComplete="off"
              aria-hidden="true"
              value={honeypot}
              onChange={(e) => setHoneypot(e.target.value)}
              className="absolute -left-[9999px] w-px h-px opacity-0"
            />

            <div className="flex flex-col sm:flex-row gap-3">
              <input
                id="quick-inquiry-email"
                type="email"
                value={visitorEmail}
                onChange={(e) => {
                  setVisitorEmail(e.target.value);
                  if (sendStatus !== 'sending') setSendStatus('idle');
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleSend();
                  }
                }}
                maxLength={200}
                placeholder="Your email (so I can reply)"
                className="
                  flex-1
                  w-full
                  px-4
                  py-3
                  rounded-lg
                  border
                  border-[#CFE4E4]
                  bg-white/80
                  text-sm
                  text-[#183335]
                  placeholder:text-[#9AAEAF]
                  outline-none
                  transition-all
                  duration-300
                  focus:border-[#63B7B8]
                  focus:ring-2
                  focus:ring-[#BFE4E3]/50
                  focus:bg-white
                "
              />

              <motion.button
                type="button"
                id="quick-send-email-btn"
                onClick={handleSend}
                disabled={sendStatus === 'sending'}
                whileHover={{
                  y: -2,
                }}
                whileTap={{
                  scale: 0.97,
                }}
                className="
                  inline-flex
                  items-center
                  justify-center
                  gap-2
                  px-5
                  py-3
                  rounded-lg
                  bg-[#177D81]
                  hover:bg-[#126B6E]
                  disabled:opacity-70
                  disabled:cursor-not-allowed
                  text-white
                  text-sm
                  font-medium
                  transition-all
                  duration-300
                  shadow-[0_8px_20px_-12px_rgba(23,125,129,0.6)]
                  shrink-0
                "
              >
                <span>{sendStatus === 'sending' ? 'Sending...' : 'Email Bayezid'}</span>

                <motion.span
                  animate={{
                    x: [0, 2, 0],
                  }}
                  transition={{
                    duration: 1.8,
                    repeat: Infinity,
                    repeatDelay: 2,
                  }}
                >
                  <Send className="w-3.5 h-3.5 text-[#DDF5F4]" />
                </motion.span>
              </motion.button>
            </div>

            {/* Result message */}
            {sendMessage && (
              <p
                role="status"
                className={`flex items-center gap-1.5 text-xs font-medium ${
                  sendStatus === 'sent' ? 'text-[#177D81]' : 'text-rose-600'
                }`}
              >
                {sendStatus === 'sent' && <Check className="w-3.5 h-3.5" />}
                <span>{sendMessage}</span>
              </p>
            )}
          </div>
        </div>
      </motion.div>
    </section>
  );
};