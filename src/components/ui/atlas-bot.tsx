"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Compass, X, ChevronLeft, Send, MessageCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { usePathname } from "next/navigation";

// --- Types ---
type DeviceType = "mobile" | "desktop";

interface HelpNode {
  id: string;
  label: string;
  children?: HelpNode[];
  answer?: (device: DeviceType) => React.ReactNode;
}

// --- Data ---
const HELP_DATA: HelpNode[] = [
  {
    id: "site_management",
    label: "Publishing & Domain",
    children: [
      {
        id: "publish_toggle",
        label: "How do I publish or unpublish?",
        answer: (device) => (
          <span>
            You can toggle your site's status using the button in the{" "}
            <strong>top right corner</strong> of your dashboard.
            <br />
            <br />
            If it's offline, click the gold <strong>Publish</strong> button. If
            it's live, you can click the red <strong>Unpublish</strong> button
            to take it down instantly.
          </span>
        ),
      },
      {
        id: "change_subdomain",
        label: "How to change my subdomain?",
        answer: (device) => (
          <span>
            Go to the <strong>Basic Info</strong> tab{" "}
            {device === "mobile" ? "(in the menu)" : "(top of the sidebar)"}.
            <br />
            Edit the <strong>Username</strong> field to change your subdomain
            (e.g., <em>yourname.profiled.site</em>).
          </span>
        ),
      },
      {
        id: "visit_site",
        label: "Where is my live site?",
        answer: () => (
          <span>
            Once published, a <strong>Visit Site</strong> button appears next to
            the Publish button in the top header. You can also type your custom
            URL directly into your browser.
          </span>
        ),
      },
      {
        id: "publish_limit",
        label: "How many times can I publish?",
        answer: () => (
          <span>
            There is <strong>no limit</strong>! You can publish, unpublish,
            change templates, and republish as often as you like.
          </span>
        ),
      },
      {
        id: "template_publish",
        label: "I changed template, how to publish?",
        answer: () => (
          <span>
            If your site is <strong>already live</strong>, template changes are
            applied <strong>instantly</strong>. If it's offline, just click{" "}
            <strong>Publish</strong> again.
          </span>
        ),
      },
    ],
  },
  {
    id: "templates_themes",
    label: "Templates & Themes",
    children: [
      {
        id: "view_templates",
        label: "How do I see templates?",
        answer: (device) => (
          <span>
            Navigate to the <strong>Templates</strong> tab in the sidebar
            (Settings icon).
            <br />
            You can click the <strong>Template</strong> button on any template
            card to see a demo of what it looks like.
          </span>
        ),
      },
      {
        id: "available_templates",
        label: "What templates are available?",
        answer: () => (
          <span>
            We currently offer:
            <ul className="list-disc pl-4 mt-2 mb-2 space-y-1 text-neutral-300">
              <li>
                <strong>Minimal:</strong> A clean, modern aesthetic for
                designers and creatives.
              </li>
              <li>
                <strong>Terminal:</strong> A hacker-style, mono-spaced theme for
                developers.
              </li>
              <li>
                <strong>Luminal:</strong> A sleek, responsive dual-mode
                template.
              </li>
            </ul>
            More templates are coming very soon!
          </span>
        ),
      },
      {
        id: "change_template",
        label: "How do I change my template?",
        answer: () => (
          <span>
            In the <strong>Templates</strong> tab, simply click on the template
            card you want. It will highlight in gold to show it's active. The
            change is instant on your live site.
          </span>
        ),
      },
    ],
  },
  {
    id: "preview_content",
    label: "Preview & Editing",
    children: [
      {
        id: "how_to_preview",
        label: "How do I preview my site?",
        answer: (device) => (
          <span>
            Click the <strong>Preview</strong> button (Globe icon) located at
            the bottom of the sidebar.
            <br />
            This opens your portfolio in a new tab so you can see exactly what
            your visitors will see.
          </span>
        ),
      },
      {
        id: "edit_content",
        label: "How do I edit my details?",
        answer: (device) => (
          <span>
            Use the sidebar sections (Projects, Experience, Skills, etc.) to
            manage your data.
            <br />
            Every change is auto-saved. You can keep the Preview tab open and
            refresh it to see changes immediately.
          </span>
        ),
      },
      {
        id: "resume_import",
        label: "Can I import from my Resume?",
        answer: () => (
          <span>
            Yes! In the <strong>Basic Info</strong> tab, look for the "Fill with
            Resume" button. Upload your PDF, and AI will auto-fill your details.
          </span>
        ),
      },
      {
        id: "mobile_edit",
        label: "Can I edit on mobile?",
        answer: () => (
          <span>
            Yes! The dashboard is fully responsive. You can add projects, update
            your bio, and switch templates directly from your phone.
          </span>
        ),
      },
    ],
  },
  {
    id: "account",
    label: "Account & Support",
    children: [
      {
        id: "delete_portfolio",
        label: "How do I delete my portfolio?",
        answer: () => (
          <span>
            Go to the <strong>Templates</strong> tab in the sidebar and scroll
            down to the "Danger Zone".
            <br />
            Click <strong>Delete Portfolio</strong> to permanently remove your
            site and data.
          </span>
        ),
      },
      {
        id: "pricing",
        label: "Is this service free?",
        answer: () => (
          <span>
            Currently, Profiled is in beta and totally free to use! We may
            feature premium themes later, but basic features will remain free.
          </span>
        ),
      },
      {
        id: "contact_support",
        label: "I found a bug, what do I do?",
        answer: () => (
          <span>
            We are currently in beta. If you find any issues, please reach out
            via Twitter/X @aayuk_5183.
          </span>
        ),
      },
    ],
  },
];

export function AtlasBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [history, setHistory] = useState<
    { type: "bot" | "user"; content: React.ReactNode }[]
  >([]);
  const [currentMenu, setCurrentMenu] = useState<HelpNode[]>(HELP_DATA);
  const [breadcrumbs, setBreadcrumbs] = useState<HelpNode[][]>([]);
  const [deviceType, setDeviceType] = useState<DeviceType>("desktop");
  const scrollRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  // Detect Device
  useEffect(() => {
    const handleResize = () => {
      setDeviceType(window.innerWidth < 768 ? "mobile" : "desktop");
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Initialize Chat
  useEffect(() => {
    if (history.length === 0) {
      setHistory([
        {
          type: "bot",
          content: (
            <>
              Hi, I'm <strong>Atlas</strong>.
              <br />I can help you build and manage your portfolio. What do you
              need help with?
            </>
          ),
        },
      ]);
    }
  }, [history.length]);

  // Auto-scroll
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [history, currentMenu]); // Scroll on history update or menu change

  const handleOptionClick = (node: HelpNode) => {
    // Add user selection to history immediately
    setHistory((prev) => [...prev, { type: "user", content: node.label }]);

    // Small delay for natural feel
    setTimeout(() => {
      if (node.children) {
        setBreadcrumbs((prev) => [...prev, currentMenu]);
        setCurrentMenu(node.children);
        setHistory((prev) => [
          ...prev,
          {
            type: "bot",
            content: `Here are some topics related to ${node.label}:`,
          },
        ]);
      } else if (node.answer) {
        const answerContent = node.answer(deviceType);
        setHistory((prev) => [
          ...prev,
          { type: "bot", content: answerContent },
        ]);
      }
    }, 400);
  };

  const handleBack = () => {
    if (breadcrumbs.length > 0) {
      const prevMenu = breadcrumbs[breadcrumbs.length - 1];
      setCurrentMenu(prevMenu);
      setBreadcrumbs((prev) => prev.slice(0, -1));
    }
  };

  const resetChat = () => {
    setHistory([
      {
        type: "bot",
        content: (
          <>
            Hi, I'm <strong>Atlas</strong>.
            <br />I can help you build and manage your portfolio. What do you
            need help with?
          </>
        ),
      },
    ]);
    setCurrentMenu(HELP_DATA);
    setBreadcrumbs([]);
  };

  if (pathname !== "/dashboard") return null;

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            className="fixed bottom-24 right-4 z-50 flex h-[500px] max-h-[70vh] w-[90vw] flex-col overflow-hidden rounded-2xl border border-white/10 bg-[#0a0a0a] shadow-2xl md:bottom-28 md:right-8 md:w-[360px]"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-white/5 bg-[#111]/50 px-5 py-4 backdrop-blur-md">
              <div className="flex items-center gap-3">
                <div className="relative flex h-8 w-8 items-center justify-center rounded-full border border-white/10 bg-gradient-to-tr from-[#1a1a1a] to-[#0a0a0a]">
                  <Compass className="h-4 w-4 text-[#d4a373]" />
                </div>
                <div>
                  <h3 className="font-instrument text-lg font-medium text-white">
                    Atlas
                  </h3>
                  <span className="flex items-center gap-1.5 text-[10px] text-neutral-500">
                    <span className="block h-1.5 w-1.5 rounded-full bg-green-500" />
                    Online
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-neutral-400 hover:text-white"
                  onClick={resetChat}
                  title="Reset Chat"
                >
                  <MessageCircle className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-neutral-400 hover:text-white"
                  onClick={() => setIsOpen(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Chat Body */}
            <div
              ref={scrollRef}
              className="flex-1 space-y-4 overflow-y-auto p-5 scroll-smooth"
            >
              {history.map((msg, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={cn(
                    "flex max-w-[90%]",
                    msg.type === "user" ? "ml-auto justify-end" : "mr-auto",
                  )}
                >
                  <div
                    className={cn(
                      "rounded-2xl px-4 py-3 text-sm leading-relaxed",
                      msg.type === "user"
                        ? "bg-[#d4a373] text-black rounded-tr-sm font-medium"
                        : "bg-[#161616] border border-white/5 text-neutral-300 rounded-tl-sm shadow-sm",
                    )}
                  >
                    {msg.content}
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Prompt Area */}
            <div className="border-t border-white/5 bg-[#111]/30 p-4 backdrop-blur-sm">
              <div className="flex flex-col gap-2">
                {breadcrumbs.length > 0 && (
                  <button
                    onClick={handleBack}
                    className="mb-1 flex w-fit items-center gap-1 text-xs text-[#d4a373] hover:underline transition-colors"
                  >
                    <ChevronLeft className="h-3 w-3" /> Back
                  </button>
                )}

                <div className="flex flex-wrap gap-2">
                  {currentMenu.map((node) => (
                    <button
                      key={node.id}
                      onClick={() => handleOptionClick(node)}
                      className="rounded-lg border border-white/5 bg-[#1a1a1a] px-3 py-2 text-xs text-neutral-300 transition-all hover:bg-[#252525] hover:border-white/10 hover:text-white active:scale-95 text-left"
                    >
                      {node.label}
                    </button>
                  ))}

                  {breadcrumbs.length > 0 && currentMenu !== HELP_DATA && (
                    <button
                      onClick={resetChat}
                      className="text-xs text-left px-3 py-2 rounded-lg border border-white/5 bg-[#1a1a1a] text-amber-500/80 hover:bg-[#252525] hover:text-amber-500 transition-all"
                    >
                      Start Over
                    </button>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Action Button */}
      <motion.button
        animate={
          isOpen
            ? undefined
            : {
                y: [0, -5, 0],
                boxShadow: [
                  "0 8px 32px rgba(0,0,0,0.4), 0 0 0 1px rgba(255,255,255,0.05)",
                  "0 12px 36px rgba(212,163,115,0.1), 0 0 0 1px rgba(255,255,255,0.1)",
                  "0 8px 32px rgba(0,0,0,0.4), 0 0 0 1px rgba(255,255,255,0.05)",
                ],
              }
        }
        transition={{
          y: { duration: 4, repeat: Infinity, ease: "easeInOut" },
          boxShadow: { duration: 4, repeat: Infinity, ease: "easeInOut" },
        }}
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "fixed bottom-6 right-6 z-50 flex h-16 items-center justify-center rounded-full",
          // Premium Glassy Look
          "bg-[#0a0a0a]/60 backdrop-blur-lg",
          "border border-white/10",
          // Base styles
          "hover:scale-105 active:scale-95",
          "transition-transform duration-300",
          "group md:bottom-8 md:right-8 overflow-hidden",
          isOpen ? "w-16" : "w-16 md:w-auto md:px-5",
        )}
      >
        {/* Automated Shimmer Effect */}
        <motion.div
          animate={{ x: ["-100%", "200%"] }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute inset-0 w-full h-full bg-linear-to-r from-transparent via-white/10 to-transparent skew-x-12"
        />

        {/* Subtle glow behind */}
        <div className="absolute inset-0 rounded-full bg-white/5 blur-md group-hover:bg-white/10 transition-all" />

        {isOpen ? (
          <motion.div
            key="close"
            initial={{ opacity: 0, scale: 0.5, rotate: -90 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ duration: 0.1 }}
            className="relative z-10"
          >
            <X className="h-6 w-6 text-white" />
          </motion.div>
        ) : (
          <motion.div
            key="open"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.1 }}
            className="relative z-10 flex items-center gap-3"
          >
            {/* Custom Compass Look */}
            <div className="relative flex items-center justify-center">
              {/* Outer Ring */}
              <div className="absolute inset-0 rounded-full border border-[#d4a373]/30" />
              <Compass
                className="h-6 w-6 text-[#d4a373] transition-transform duration-700 group-hover:rotate-180"
                strokeWidth={1.5}
              />
            </div>
            <span className="hidden md:block font-instrument font-medium text-white text-base whitespace-nowrap overflow-hidden">
              Ask Atlas
            </span>
          </motion.div>
        )}
      </motion.button>
    </>
  );
}
