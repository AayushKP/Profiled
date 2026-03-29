"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  User,
  LayoutTemplate,
  Briefcase,
  GraduationCap,
  Sparkles,
  Settings,
  Globe,
  Share2,
  FileText,
  Menu,
  X,
  ChevronLeft,
  ChevronRight,
  Trophy,
  CircleCheck,
  LogOut,
} from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { Portfolio } from "@/db/schema";
import {
  calculatePortfolioCompletion,
  getBuilderRank,
} from "@/lib/gamification";

interface SidebarProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
  isCollapsed: boolean;
  onCollapseChange: (collapsed: boolean) => void;
  portfolio: Partial<Portfolio> | null;
  isMobileOpen?: boolean;
  onMobileOpenChange?: (open: boolean) => void;
}

const navItems = [
  { id: "basic", name: "Basic Info", href: "/dashboard", icon: User },
  {
    id: "about",
    name: "About",
    href: "/dashboard?section=about",
    icon: FileText,
  },
  {
    id: "skills",
    name: "Skills",
    href: "/dashboard?section=skills",
    icon: Sparkles,
  },
  {
    id: "projects",
    name: "Projects",
    href: "/dashboard?section=projects",
    icon: LayoutTemplate,
  },
  {
    id: "experience",
    name: "Experience",
    href: "/dashboard?section=experience",
    icon: Briefcase,
  },
  {
    id: "education",
    name: "Education",
    href: "/dashboard?section=education",
    icon: GraduationCap,
  },
  {
    id: "blogs",
    name: "Blogs",
    href: "/dashboard?section=blogs",
    icon: Globe,
  },
  {
    id: "social",
    name: "Socials",
    href: "/dashboard?section=social",
    icon: Share2,
  },
  {
    id: "templates",
    name: "Templates",
    href: "/dashboard?section=templates",
    icon: Settings,
  },
];

export function Sidebar({
  activeSection,
  onSectionChange,
  isCollapsed,
  onCollapseChange,
  portfolio,
  isMobileOpen: externalMobileOpen,
  onMobileOpenChange,
}: SidebarProps) {
  const pathname = usePathname();
  // Use external state if provided, otherwise internal state
  const [internalMobileOpen, setInternalMobileOpen] = useState(false);
  const isMobileOpen = externalMobileOpen ?? internalMobileOpen;
  const setIsMobileOpen = onMobileOpenChange ?? setInternalMobileOpen;

  // Gamification Logic
  const { score, completedSections } = calculatePortfolioCompletion(portfolio);
  const rank = getBuilderRank(score);
  const progressColor =
    score < 40 ? "bg-red-500" : score < 70 ? "bg-yellow-500" : "bg-green-500";

  return (
    <>
      {/* Mobile Overlay */}
      <AnimatePresence>
        {isMobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsMobileOpen(false)}
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm md:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar Container */}
      <motion.aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex flex-col border-r border-white/5 bg-[#050505] transition-all duration-300",
          isCollapsed ? "w-20" : "w-64",
          "md:translate-x-0",
          isMobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0",
        )}
      >
        {/* Header - Hidden on Mobile since we have Top Navbar, but visible on Desktop */}
        <div className="hidden md:flex h-20 items-center justify-between px-6">
          {!isCollapsed && (
            <div className="font-instrument text-2xl font-bold text-white hover:opacity-80 transition-opacity">
              Profiled<span className="text-[#d4a373]">.</span>
            </div>
          )}
          {isCollapsed && (
            <span className="w-full text-center font-instrument text-2xl font-bold text-[#d4a373]">
              P.
            </span>
          )}

          <button
            onClick={() => onCollapseChange(!isCollapsed)}
            className="rounded-full p-1 text-neutral-500 hover:bg-white/5 hover:text-white block"
          >
            {isCollapsed ? (
              <ChevronRight className="h-4 w-4" />
            ) : (
              <ChevronLeft className="h-4 w-4" />
            )}
          </button>
        </div>

        {/* Mobile Sidebar Header (Close Button) */}
        <div className="flex h-16 items-center justify-between px-4 md:hidden border-b border-white/5">
          <span className="font-mono text-sm uppercase text-neutral-500">
            Menu
          </span>
          <button
            onClick={() => setIsMobileOpen(false)}
            className="text-white bg-[#111] p-2 rounded-full border border-white/10"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Gamification Widget */}
        {!isCollapsed && (
          <div className="mx-4 mb-2 mt-4 md:mt-0 rounded-xl border border-white/10 bg-[#111] p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Trophy className="h-4 w-4 text-[#d4a373]" />
                <span className="text-sm font-semibold text-white">{rank}</span>
              </div>
              <span className="text-xs text-neutral-400">{score}%</span>
            </div>
            {/* Progress Bar */}
            <div className="h-1.5 w-full rounded-full bg-neutral-800 overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${score}%` }}
                transition={{ duration: 1, ease: "easeOut" }}
                className={cn("h-full rounded-full", progressColor)}
              />
            </div>
            <p className="mt-2 text-[10px] text-neutral-500 text-center">
              Complete sections to level up!
            </p>
          </div>
        )}

        {/* Navigation */}
        <div className="flex-1 overflow-y-auto px-4 py-4 text-sm">
          <nav className="space-y-1">
            {navItems.map((item) => {
              const isCompleted = completedSections.includes(item.id);
              return (
                <button
                  key={item.name}
                  onClick={() => {
                    onSectionChange(item.id);
                    setIsMobileOpen(false);
                  }}
                  className={cn(
                    "group flex w-full items-center gap-3 rounded-lg px-3 py-2.5 transition-colors font-mono tracking-wide text-xs uppercase relative",
                    activeSection === item.id
                      ? "bg-white/10 text-white"
                      : "text-neutral-400 hover:bg-white/5 hover:text-white",
                  )}
                >
                  <item.icon
                    className={cn(
                      "h-4 w-4 min-w-[16px]",
                      isCollapsed ? "mx-auto" : "",
                    )}
                  />
                  {!isCollapsed && (
                    <>
                      <span>{item.name}</span>
                      {isCompleted && item.id !== "templates" && (
                        <CircleCheck className="ml-auto h-3.5 w-3.5 text-green-500/80" />
                      )}
                    </>
                  )}

                  {/* Tooltip for collapsed state */}
                  {isCollapsed && (
                    <div className="absolute left-full ml-4 hidden rounded bg-neutral-800 px-2 py-1 text-xs text-white group-hover:block z-50 whitespace-nowrap">
                      {item.name} {isCompleted && "✅"}
                    </div>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Footer */}
        <div className="border-t border-white/5 p-4 flex flex-col gap-3">
          <Link href="/dashboard/preview" target="_blank">
            <div
              className={cn(
                "flex items-center gap-3 rounded-lg bg-[#111] p-3 text-white transition-colors hover:bg-[#1a1a1a]",
                isCollapsed ? "justify-center" : "",
              )}
            >
              <Globe className="h-4 w-4" />
              {!isCollapsed && (
                <span className="font-mono text-xs uppercase">Preview</span>
              )}
            </div>
          </Link>

          <button
            onClick={async () => {
              await import("@/lib/auth-client").then((mod) =>
                mod.authClient.signOut(),
              );
              window.location.href = "/";
            }}
            className={cn(
              "flex w-full items-center gap-3 rounded-lg bg-red-500/10 p-3 text-red-500 transition-colors hover:bg-red-500/20 lg:hidden",
              isCollapsed ? "justify-center" : "",
            )}
          >
            <LogOut className="h-4 w-4" />
            {!isCollapsed && (
              <span className="font-mono text-xs uppercase">Log out</span>
            )}
          </button>
        </div>
      </motion.aside>
    </>
  );
}
