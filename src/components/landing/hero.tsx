"use client";

import {
  motion,
  useScroll,
  useTransform,
  AnimatePresence,
} from "framer-motion";
import { cn } from "@/lib/utils";
import Link from "next/link";
import {
  ArrowRight,
  Play,
  Zap,
  Shield,
  TrendingUp,
  Lock,
  ChevronDown,
  Check,
  Terminal,
  LayoutTemplate,
  Sparkles,
} from "lucide-react";
import React, { useState } from "react";
import { AuthModal } from "@/components/auth/auth-modal";
import {
  DotBackground,
  GridBackground,
} from "@/components/aceternity/backgrounds";
import { Spotlight } from "@/components/aceternity/spotlight";

export function Hero() {
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 500], [0, 0]);
  const rotateX = useTransform(scrollY, [0, 500], [0, 0]);
  const [authOpen, setAuthOpen] = useState(false);
  const [activePreview, setActivePreview] = useState<
    "minimal" | "terminal" | "luminal"
  >("minimal");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isPreviewDropdownOpen, setIsPreviewDropdownOpen] = useState(false);

  return (
    <>
      <section id="home" className="relative min-h-screen w-full bg-[#050505]">
        <GridBackground className="min-h-screen py-20 md:py-28 lg:py-32 flex flex-col items-center">
          {/* Central Gradient Orb */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#d4a373]/20 blur-[120px] rounded-full pointer-events-none z-0" />

          {/* Floating UI Chips - Button Types Components - Hidden on Mobile */}
          <div className="hidden md:block absolute inset-x-0 top-32 h-[400px] pointer-events-none max-w-7xl mx-auto overflow-visible z-10">
            {/* Chip 1: Fast */}
            <motion.div
              initial={{ opacity: 0, x: -50, rotate: -5 }}
              animate={{ opacity: 1, x: 0, rotate: -5, y: [0, -15, 0] }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="absolute top-10 left-[5%] md:left-[10%]"
            >
              <button className="flex items-center gap-3 px-5 py-2.5 bg-[#1a1a1a]/80 border border-white/10 rounded-xl shadow-xl backdrop-blur-md transition-transform hover:scale-105 pointer-events-auto">
                <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-amber-500/20 to-amber-600/20 flex items-center justify-center border border-amber-500/30">
                  <Zap className="h-4 w-4 text-amber-500" />
                </div>
                <div className="flex flex-col items-start gap-0.5">
                  <span className="font-mono text-[10px] text-neutral-500 uppercase tracking-wider">
                    Performance
                  </span>
                  <span className="font-medium text-sm text-neutral-200">
                    Lightning Fast
                  </span>
                </div>
              </button>
            </motion.div>

            {/* Chip 2: Analytics */}
            <motion.div
              initial={{ opacity: 0, x: 50, rotate: 5 }}
              animate={{ opacity: 1, x: 0, rotate: 5, y: [0, 15, 0] }}
              transition={{
                duration: 5,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 1,
              }}
              className="absolute top-24 right-[5%] md:right-[10%]"
            >
              <button className="flex items-center gap-3 px-5 py-2.5 bg-[#1a1a1a]/80 border border-white/10 rounded-xl shadow-xl backdrop-blur-md transition-transform hover:scale-105 pointer-events-auto">
                <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-green-500/20 to-green-600/20 flex items-center justify-center border border-green-500/30">
                  <TrendingUp className="h-4 w-4 text-green-500" />
                </div>
                <div className="flex flex-col items-start gap-0.5">
                  <span className="font-mono text-[10px] text-neutral-500 uppercase tracking-wider">
                    Growth
                  </span>
                  <span className="font-medium text-sm text-neutral-200">
                    SEO Optimized
                  </span>
                </div>
              </button>
            </motion.div>
          </div>

          <div className="relative z-20 w-full max-w-7xl mx-auto px-6 md:px-12 lg:px-20 flex flex-col items-center text-center mt-20 md:mt-0">
            {/* ... Content remains similar but wrapped correctly ... */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 mb-8 backdrop-blur-md shadow-lg shadow-black/20"
            >
              <span className="flex h-2 w-2 rounded-full bg-[#27c93f] animate-pulse"></span>
              <span className="font-mono text-[10px] uppercase tracking-widest text-neutral-300">
                v1.1.0 is Live {"->"}
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="font-instrument text-4xl md:text-6xl lg:text-7xl xl:text-8xl leading-[1.1] md:leading-[1.1] text-[#e5e5e5] tracking-tight mb-6 md:mb-8 max-w-5xl relative drop-shadow-2xl"
            >
              Expert <span className="italic text-[#d4a373]">Portfolios</span>
              <br />
              for Modern Creatives.
            </motion.h1>

            {/* ... remaining text and buttons ... */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="font-instrument text-base md:text-lg text-neutral-400 max-w-3xl leading-relaxed mb-8 md:mb-10 backdrop-blur-sm"
            >
              We help you design and build portfolios that drive results and
              help your career grow. No styling headaches. Just results.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="relative z-50 flex flex-col md:flex-row items-center gap-6"
            >
              <button
                onClick={() => setAuthOpen(true)}
                className="group relative flex items-center justify-center gap-3 rounded-full bg-[#e5e5e5] px-8 py-4 transition-all hover:scale-105 shadow-[0_0_20px_rgba(255,255,255,0.1)] overflow-hidden"
              >
                <Spotlight
                  className="-top-20 left-0"
                  fill="rgba(255, 255, 255, 0.5)"
                />
                <span className="relative z-10 font-mono text-sm font-bold text-black uppercase tracking-wider">
                  Start Building
                </span>
                <ArrowRight className="relative z-10 h-4 w-4 text-black transition-transform group-hover:translate-x-1" />
              </button>
              <div className="relative h-14">
                <button
                  onClick={() =>
                    setIsPreviewDropdownOpen(!isPreviewDropdownOpen)
                  }
                  className="group flex h-full items-center justify-center gap-3 rounded-full border border-white/10 bg-white/5 px-8 transition-all hover:bg-white/10 hover:border-white/20 backdrop-blur-sm"
                >
                  <Play className="h-3 w-3 fill-current text-white" />
                  <span className="font-mono text-sm font-bold text-white uppercase tracking-wider">
                    Templates
                  </span>
                  <ChevronDown
                    className={cn(
                      "w-4 h-4 text-white/50 transition-transform duration-200",
                      isPreviewDropdownOpen && "rotate-180",
                    )}
                  />
                </button>

                <AnimatePresence>
                  {isPreviewDropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      className="absolute top-full left-0 right-0 mt-2 rounded-xl border border-white/10 bg-[#1a1a1a] shadow-xl overflow-hidden p-1 flex flex-col gap-1 z-50 min-w-[200px]"
                    >
                      <button
                        onClick={() => {
                          setActivePreview("minimal");
                          setIsPreviewDropdownOpen(false);
                          window.open("/preview/minimal", "_blank");
                        }}
                        className={cn(
                          "flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium transition-colors w-full text-left font-mono group",
                          "text-neutral-400 hover:bg-white/5 hover:text-white",
                        )}
                      >
                        <LayoutTemplate className="w-3.5 h-3.5 group-hover:text-[#d4a373] transition-colors" />
                        <span>Minimal</span>
                        <ArrowRight className="w-3 h-3 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
                      </button>
                      <button
                        onClick={() => {
                          setActivePreview("terminal");
                          setIsPreviewDropdownOpen(false);
                          window.open("/preview/terminal", "_blank");
                        }}
                        className={cn(
                          "flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium transition-colors w-full text-left font-mono group",
                          "text-neutral-400 hover:bg-white/5 hover:text-white",
                        )}
                      >
                        <Terminal className="w-3.5 h-3.5 group-hover:text-[#4ade80] transition-colors" />
                        <span>Terminal</span>
                        <ArrowRight className="w-3 h-3 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
                      </button>
                      <button
                        onClick={() => {
                          setActivePreview("luminal");
                          setIsPreviewDropdownOpen(false);
                          window.open("/preview/luminal", "_blank");
                        }}
                        className={cn(
                          "flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium transition-colors w-full text-left font-mono group",
                          "text-neutral-400 hover:bg-white/5 hover:text-white",
                        )}
                      >
                        <Sparkles className="w-3.5 h-3.5 group-hover:text-[#a855f7] transition-colors" />
                        <span>Luminal</span>
                        <ArrowRight className="w-3 h-3 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <div className="flex items-center gap-4">
                <div className="flex -space-x-3">
                  {[1, 2, 3, 4].map((i) => (
                    <img
                      key={i}
                      src={`https://i.pravatar.cc/100?img=${i + 20}`}
                      alt={`User ${i}`}
                      className="h-8 w-8 rounded-full border border-[#050505] ring-2 ring-[#050505] object-cover bg-neutral-800"
                    />
                  ))}
                </div>
                <div className="flex flex-col items-start bg-black/20 backdrop-blur-sm px-2 py-1 rounded-md border border-white/5">
                  <div className="flex text-[#d4a373]">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <div key={i} className="text-[10px]">
                        ★
                      </div>
                    ))}
                  </div>
                  <span className="font-mono text-[10px] text-neutral-500 uppercase tracking-wide">
                    Trusted by 1000+
                  </span>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Hero Image (Desktop Component) */}
          <motion.div
            style={{ y, rotateX }}
            className="relative w-full max-w-7xl mx-auto px-6 md:px-12 lg:px-20 mt-8 perspective-1000 z-0"
          >
            <motion.div
              id="browser-preview"
              initial={{ opacity: 0, y: 100, rotateX: 20 }}
              animate={{ opacity: 1, y: 0, rotateX: 0 }}
              whileHover={{ y: -10, rotateX: 2 }}
              transition={{
                duration: 1.2,
                delay: 0.4,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="relative aspect-16/10 w-full overflow-hidden rounded-xl border border-white/10 bg-[#111] shadow-2xl shadow-[#d4a373]/20"
            >
              {/* Browser Toolbar */}
              <div className="absolute top-0 left-0 right-0 z-50 flex h-10 items-center gap-2 border-b border-white/5 bg-[#1a1a1a] px-4 pointer-events-auto">
                <div className="flex gap-1.5">
                  <div className="h-3 w-3 rounded-full bg-[#ff5f56]/80" />
                  <div className="h-3 w-3 rounded-full bg-[#ffbd2e]/80" />
                  <div className="h-3 w-3 rounded-full bg-[#27c93f]/80" />
                </div>

                {/* Dynamic Address Bar / Dropdown */}
                <div className="relative mx-auto z-50">
                  <button
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="flex h-6 w-auto min-w-[200px] items-center justify-center gap-2 rounded bg-black/40 px-3 text-[10px] text-neutral-400 font-mono hover:bg-black/60 hover:text-white transition-all border border-white/5"
                  >
                    <Lock className="w-2.5 h-2.5 opacity-50" />
                    <span>profiled.site/{activePreview}</span>
                    <ChevronDown
                      className={cn(
                        "w-3 h-3 transition-transform opacity-50",
                        isDropdownOpen && "rotate-180",
                      )}
                    />
                  </button>

                  <AnimatePresence>
                    {isDropdownOpen && (
                      <motion.div
                        key="dropdown"
                        initial={{ opacity: 0, y: -10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.95 }}
                        className="absolute top-full left-0 right-0 mt-2 rounded-xl border border-white/10 bg-[#1a1a1a] shadow-xl overflow-hidden p-1 flex flex-col gap-1 z-[100]"
                      >
                        <button
                          onClick={() => {
                            setActivePreview("minimal");
                            setIsDropdownOpen(false);
                          }}
                          className={cn(
                            "flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium transition-colors w-full text-left font-mono",
                            activePreview === "minimal"
                              ? "bg-white/10 text-white"
                              : "text-neutral-400 hover:bg-white/5 hover:text-white",
                          )}
                        >
                          <LayoutTemplate className="w-3.5 h-3.5" />
                          <span>minimal</span>
                          {activePreview === "minimal" && (
                            <Check className="w-3 h-3 ml-auto text-[#d4a373]" />
                          )}
                        </button>
                        <button
                          onClick={() => {
                            setActivePreview("terminal");
                            setIsDropdownOpen(false);
                          }}
                          className={cn(
                            "flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium transition-colors w-full text-left font-mono",
                            activePreview === "terminal"
                              ? "bg-white/10 text-white"
                              : "text-neutral-400 hover:bg-white/5 hover:text-white",
                          )}
                        >
                          <Terminal className="w-3.5 h-3.5" />
                          <span>terminal</span>
                          {activePreview === "terminal" && (
                            <Check className="w-3 h-3 ml-auto text-[#d4a373]" />
                          )}
                        </button>
                        <button
                          onClick={() => {
                            setActivePreview("luminal");
                            setIsDropdownOpen(false);
                          }}
                          className={cn(
                            "flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium transition-colors w-full text-left font-mono",
                            activePreview === "luminal"
                              ? "bg-white/10 text-white"
                              : "text-neutral-400 hover:bg-white/5 hover:text-white",
                          )}
                        >
                          <Sparkles className="w-3.5 h-3.5" />
                          <span>luminal</span>
                          {activePreview === "luminal" && (
                            <Check className="w-3 h-3 ml-auto text-[#d4a373]" />
                          )}
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              {/* Preview Page Iframes (Stacked) */}
              <div className="relative h-full w-full bg-[#050505] pt-10">
                {/* Minimal Template */}
                <motion.div
                  animate={{
                    opacity: activePreview === "minimal" ? 1 : 0,
                    zIndex: activePreview === "minimal" ? 10 : 0,
                    scale: activePreview === "minimal" ? 1 : 0.98,
                  }}
                  transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                  className="absolute inset-x-0 bottom-0 top-10 bg-[#050505]"
                >
                  <iframe
                    src="/preview/minimal"
                    className="w-full h-full border-none"
                    title="Minimal Portfolio"
                  />
                </motion.div>

                {/* Terminal Template */}
                <motion.div
                  animate={{
                    opacity: activePreview === "terminal" ? 1 : 0,
                    zIndex: activePreview === "terminal" ? 10 : 0,
                    scale: activePreview === "terminal" ? 1 : 0.98,
                  }}
                  transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                  className="absolute inset-x-0 bottom-0 top-10 bg-[#050505]"
                >
                  <iframe
                    src="/preview/terminal"
                    className="w-full h-full border-none"
                    title="Terminal Portfolio"
                  />
                </motion.div>

                {/* Luminal Template */}
                <motion.div
                  animate={{
                    opacity: activePreview === "luminal" ? 1 : 0,
                    zIndex: activePreview === "luminal" ? 10 : 0,
                    scale: activePreview === "luminal" ? 1 : 0.98,
                  }}
                  transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                  className="absolute inset-x-0 bottom-0 top-10 bg-[#050505]"
                >
                  <iframe
                    src="/preview/luminal"
                    className="w-full h-full border-none"
                    title="Luminal Portfolio"
                  />
                </motion.div>
              </div>

              {/* Shiny Reflection */}
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-white/5 via-transparent to-transparent opacity-50" />
            </motion.div>
          </motion.div>

          <AuthModal
            open={authOpen}
            onOpenChange={setAuthOpen}
            defaultTab="signup"
          />
        </GridBackground>
      </section>
    </>
  );
}
