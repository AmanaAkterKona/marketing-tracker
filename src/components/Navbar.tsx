import React, { useEffect, useState } from "react";
import { ArrowUpRight, Menu, X } from "lucide-react";
import { useRouter } from "../context/RouterContext";

// Logo
import logo from "../assets/logo (2).png";

interface NavbarProps {
  onTalkClick: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onTalkClick }) => {
  const { navigate } = useRouter();

  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Navbar scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const navLinks = [
    {
      label: "Expertise",
      href: "#expertise",
      isRoute: false,
    },
    {
      label: "Insights",
      href: "/insights",
      isRoute: true,
    },
    {
      label: "Work",
      href: "#work",
      isRoute: false,
    },
    {
      label: "About",
      href: "#about",
      isRoute: false,
    },
    {
      label: "Contact",
      href: "#contact",
      isRoute: false,
    },
  ];

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  return (
    <>
      {/* ================= NAVBAR ================= */}
      <header
        id="main-navigation"
        className={`
          fixed top-0 left-0 right-0 z-50
          transition-all duration-500 ease-out
          ${
            scrolled
              ? `
                bg-white/85
                backdrop-blur-xl
                border-b border-[#0F6B70]/10
                shadow-[0_8px_35px_rgba(8,78,82,0.08)]
                py-3
              `
              : "bg-transparent py-5"
          }
        `}
      >
        <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10">
          <div
            className={`
              relative
              flex items-center justify-between
              rounded-[22px]
              px-5 sm:px-6
              transition-all duration-500
              ${
                scrolled
                  ? "bg-white/60"
                  : "bg-white/50 backdrop-blur-md border border-white/70 shadow-[0_10px_40px_rgba(20,100,105,0.06)]"
              }
            `}
          >
            {/* ================= LOGO ================= */}
            <button
              type="button"
              onClick={() => navigate("/")}
              id="brand-logo-link"
              className="
                group
                flex items-center gap-1.5
                cursor-pointer
                py-2.5
                shrink-0
              "
            >
              <div
                className="
                  relative
                  w-9 h-9
                  flex items-center justify-center
                  transition-all duration-300
                  group-hover:scale-105
                "
              >
                <img
                  src={logo}
                  alt="BayezidMir Logo"
                  className="
                    w-full h-full
                    object-contain
                    drop-shadow-[0_3px_8px_rgba(0,175,185,0.25)]
                  "
                />

                {/* Logo glow */}
                <span
                  className="
                    absolute inset-0
                    rounded-full
                    bg-[#18C6C7]/20
                    blur-xl
                    opacity-0
                    group-hover:opacity-100
                    transition-opacity duration-300
                    -z-10
                  "
                />
              </div>

              {/* Same logo text as Footer: Bayezid + teal Mir */}
              <span
                className="
                  ml-0.5
                  text-xl
                  font-bold
                  tracking-tight
                  text-[#092D36]
                  group-hover:text-[#087E82]
                  transition-colors duration-300
                "
              >
                Bayezid<span className="text-teal-500">Mir</span>
              </span>
            </button>

            {/* ================= DESKTOP NAV ================= */}
            <nav
              className="
                hidden md:flex
                items-center
                gap-7 lg:gap-9
                ml-auto
                mr-7
              "
              aria-label="Main Navigation"
            >
              {navLinks.map((link) => {
                if (link.isRoute) {
                  return (
                    <button
                      key={link.label}
                      type="button"
                      onClick={() => navigate(link.href)}
                      id={`nav-link-${link.label.toLowerCase()}`}
                      className="
                        group
                        relative
                        py-5
                        text-[13px]
                        font-semibold
                        text-[#078B90]
                        transition-colors duration-300
                      "
                    >
                      {link.label}

                      {/* Active underline */}
                      <span
                        className="
                          absolute
                          left-0 right-0 bottom-2
                          h-[2px]
                          rounded-full
                          bg-gradient-to-r
                          from-[#078B90]
                          to-[#26C7C4]
                        "
                      />
                    </button>
                  );
                }

                return (
                  <a
                    key={link.label}
                    href={link.href}
                    id={`nav-link-${link.label.toLowerCase()}`}
                    className="
                      group
                      relative
                      py-5
                      text-[13px]
                      font-medium
                      text-[#42636A]
                      hover:text-[#087E82]
                      transition-colors duration-300
                    "
                  >
                    {link.label}

                    <span
                      className="
                        absolute
                        left-0 right-0 bottom-2
                        h-[2px]
                        rounded-full
                        bg-gradient-to-r
                        from-[#078B90]
                        to-[#26C7C4]
                        scale-x-0
                        origin-left
                        group-hover:scale-x-100
                        transition-transform duration-300
                      "
                    />
                  </a>
                );
              })}
            </nav>

            {/* ================= RIGHT SIDE ================= */}
            <div className="hidden md:flex items-center gap-2.5">

              {/* Let's Talk */}
              <button
                id="nav-cta-talk-button"
                type="button"
                onClick={onTalkClick}
                className="
                  group
                  relative
                  inline-flex
                  items-center
                  justify-center
                  gap-2
                  px-5 py-2.5
                  rounded-full
                  overflow-hidden
                  bg-[#087C82]
                  text-white
                  text-[13px]
                  font-semibold
                  shadow-[0_8px_22px_rgba(8,124,130,0.22)]
                  hover:bg-[#076A70]
                  hover:-translate-y-0.5
                  hover:shadow-[0_12px_28px_rgba(8,124,130,0.28)]
                  transition-all duration-300
                "
              >
                {/* shine */}
                <span
                  className="
                    absolute
                    inset-0
                    bg-gradient-to-r
                    from-transparent
                    via-white/15
                    to-transparent
                    -translate-x-full
                    group-hover:translate-x-full
                    transition-transform duration-700
                  "
                />

                <span className="relative">Let's Talk</span>

                <ArrowUpRight
                  className="
                    relative
                    w-4 h-4
                    group-hover:translate-x-0.5
                    group-hover:-translate-y-0.5
                    transition-transform duration-300
                  "
                />
              </button>
            </div>

            {/* ================= MOBILE BUTTON ================= */}
            <div className="flex md:hidden items-center gap-2">
              <button
                id="mobile-menu-toggle"
                type="button"
                aria-label="Toggle navigation menu"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="
                  w-10 h-10
                  rounded-full
                  bg-[#E9FAF9]
                  border border-[#0B8F95]/10
                  text-[#087E82]
                  flex items-center justify-center
                  hover:bg-[#D8F4F2]
                  transition-all duration-300
                "
              >
                {mobileMenuOpen ? (
                  <X className="w-5 h-5" />
                ) : (
                  <Menu className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* ================= MOBILE MENU ================= */}
        <div
          className={`
            md:hidden
            overflow-hidden
            transition-all duration-500 ease-in-out
            ${
              mobileMenuOpen
                ? "max-h-[600px] opacity-100"
                : "max-h-0 opacity-0"
            }
          `}
        >
          <div className="px-5 pt-3">
            <div
              className="
                rounded-[24px]
                bg-white/95
                backdrop-blur-xl
                border border-[#0B8F95]/10
                shadow-[0_20px_50px_rgba(5,83,88,0.12)]
                p-3
              "
            >
              <div className="flex flex-col">
                {navLinks.map((link) => {
                  if (link.isRoute) {
                    return (
                      <button
                        key={link.label}
                        type="button"
                        onClick={() => {
                          closeMobileMenu();
                          navigate(link.href);
                        }}
                        className="
                          group
                          flex items-center justify-between
                          px-4 py-3.5
                          rounded-xl
                          text-left
                          text-[#087E82]
                          font-semibold
                          text-sm
                          hover:bg-[#E9FAF9]
                          transition-all duration-200
                        "
                      >
                        <span>{link.label}</span>

                        <ArrowUpRight
                          className="
                            w-4 h-4
                            group-hover:translate-x-1
                            group-hover:-translate-y-1
                            transition-transform duration-300
                          "
                        />
                      </button>
                    );
                  }

                  return (
                    <a
                      key={link.label}
                      href={link.href}
                      onClick={closeMobileMenu}
                      className="
                        group
                        flex items-center justify-between
                        px-4 py-3.5
                        rounded-xl
                        text-[#365A61]
                        font-medium
                        text-sm
                        hover:bg-[#E9FAF9]
                        hover:text-[#087E82]
                        transition-all duration-200
                      "
                    >
                      <span>{link.label}</span>

                      <ArrowUpRight
                        className="
                          w-4 h-4
                          opacity-0
                          -translate-x-1
                          group-hover:opacity-100
                          group-hover:translate-x-0
                          transition-all duration-300
                        "
                      />
                    </a>
                  );
                })}
              </div>

              {/* Mobile bottom actions */}
              <div
                className="
                  mt-2
                  pt-3
                  border-t border-[#0B8F95]/10
                  flex items-center gap-2
                "
              >

                <button
                  type="button"
                  onClick={() => {
                    closeMobileMenu();
                    onTalkClick();
                  }}
                  className="
                    flex-1
                    flex items-center justify-center gap-2
                    py-3
                    rounded-xl
                    bg-[#087C82]
                    text-white
                    text-sm
                    font-semibold
                    shadow-[0_8px_20px_rgba(8,124,130,0.2)]
                    hover:bg-[#076A70]
                    transition-all duration-300
                  "
                >
                  Let's Talk
                  <ArrowUpRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>
    </>
  );
};