"use client";

import { AppLoader } from "@/components/ui/app-loader";

import React, { useState, useEffect, useMemo, useRef } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import Link from "next/link";
import dynamic from "next/dynamic";
import {
  ArrowUpRight,
  Github,
  Linkedin,
  Twitter,
  Globe,
  Mail,
  Code2,
  Terminal,
  Cpu,
  Database,
  Layout,
  Server,
  Smartphone,
  Cloud,
  Layers,
  Package,
  ExternalLink,
  User,
  FileText,
  Zap,
  Wind,
  Command,
  Hexagon,
  Box,
  FileCode,
  FileJson,
} from "lucide-react";
import type { Portfolio, BlogData } from "@/db/schema";
import { cn } from "@/lib/utils";
import { ActivityCalendar } from "react-activity-calendar";
import { dummyPortfolio } from "@/lib/dummy-data";
import type { PortfolioTemplateProps } from "./index";

const Marquee = dynamic(() => import("react-fast-marquee"), { ssr: false });

const TimelineScrollAnimation = ({
  containerRef,
}: {
  containerRef: React.RefObject<HTMLDivElement | null>;
}) => {
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start center", "end center"],
  });

  const scrollY = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  // Map scroll progress to line height and dot position
  const height = useTransform(scrollY, [0, 1], ["0%", "100%"]);

  return (
    <>
      <motion.div
        style={{ height }}
        className="absolute left-[39px] md:left-[49px] top-0 w-px bg-gradient-to-b from-[#3b82f6] via-[#a855f7] to-[#f97316] z-0 opacity-50"
      />
      <motion.div
        style={{ top: height }}
        className="absolute left-[39px] md:left-[49px] h-2 w-2 rounded-full bg-white shadow-[0_0_10px_white] z-20 -translate-x-1/2 -translate-y-1/2"
      />
    </>
  );
};

// --- Icon & Color Mapping for Skills ---
const TechStackMap: Record<string, { icon: any; color: string }> = {
  react: { icon: Code2, color: "#61DAFB" },
  nextjs: { icon: Zap, color: "#FFFFFF" },
  typescript: { icon: FileCode, color: "#3178C6" },
  javascript: { icon: FileJson, color: "#F7DF1E" },
  node: { icon: Server, color: "#339933" },
  python: { icon: Terminal, color: "#3776AB" },
  tailwind: { icon: Wind, color: "#06B6D4" },
  css: { icon: Layout, color: "#1572B6" },
  html: { icon: Layout, color: "#E34F26" },
  git: { icon: Github, color: "#F05032" },
  docker: { icon: Box, color: "#2496ED" },
  aws: { icon: Cloud, color: "#FF9900" },
  firebase: { icon: Database, color: "#FFCA28" },
  mongodb: { icon: Database, color: "#47A248" },
  postgres: { icon: Database, color: "#4169E1" },
  postgresql: { icon: Database, color: "#4169E1" },
  supabase: { icon: Database, color: "#3ECF8E" },
  graphql: { icon: Hexagon, color: "#E10098" },
  prisma: { icon: Database, color: "#2D3748" },
  flutter: { icon: Smartphone, color: "#02569B" },
  swift: { icon: Smartphone, color: "#F05138" },
  kotlin: { icon: Smartphone, color: "#0095D5" },
  rust: { icon: Command, color: "#DEA584" },
  go: { icon: Terminal, color: "#00ADD8" },
  solid: { icon: Code2, color: "#2C4F7C" },
  vue: { icon: Code2, color: "#4FC08D" },
  angular: { icon: Code2, color: "#DD0031" },
};

// Updated getSkillStyle to use exact match and specific generic icon/color
const getSkillStyle = (skill: string) => {
  const normalizedSkill = skill.toLowerCase().trim();
  return (
    TechStackMap[normalizedSkill] || {
      icon: Code2, // Generic Icon
      color: "#a3a3a3", // Generic Gray
    }
  );
};

const AtomIcon = ({ color }: { color: string }) => {
  return (
    <div className="relative flex h-40 w-40 items-center justify-center perspective-[900px]">
      {/* Nucleus */}
      <div className="relative z-20 flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-[0_0_20px_rgba(255,255,255,0.8)] animate-pulse">
        <div className="h-full w-full rounded-full bg-linear-to-tr from-inherit to-transparent opacity-80" />
      </div>

      {/* Electron 1 (Horizontalish) */}
      <motion.div
        className="absolute inset-0 z-10 border border-white/30 rounded-[50%]"
        style={{ rotateX: 70, rotateY: 10, borderColor: color }}
        animate={{ rotateZ: 360 }}
        transition={{ duration: 3, ease: "linear", repeat: Infinity }}
      >
        <div className="absolute top-0 left-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white shadow-[0_0_10px_white]" />
      </motion.div>

      {/* Electron 2 (Rotated) */}
      <motion.div
        className="absolute inset-0 z-10 border border-white/30 rounded-[50%]"
        style={{ rotateX: 70, rotateY: 70, borderColor: color }}
        animate={{ rotateZ: 360 }}
        transition={{ duration: 4, ease: "linear", repeat: Infinity }}
      >
        <div className="absolute top-0 left-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white shadow-[0_0_10px_white]" />
      </motion.div>

      {/* Electron 3 (Rotated opposite) */}
      <motion.div
        className="absolute inset-0 z-10 border border-white/30 rounded-[50%]"
        style={{ rotateX: 70, rotateY: -50, borderColor: color }}
        animate={{ rotateZ: 360 }} // Reverse rotation
        transition={{ duration: 5, ease: "linear", repeat: Infinity }}
      >
        <div className="absolute top-0 left-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white shadow-[0_0_10px_white]" />
      </motion.div>

      {/* Glow */}
      <div className="absolute inset-0 bg-white/5 blur-3xl rounded-full pointer-events-none" />
    </div>
  );
};

// InteractiveLogo Component
const InteractiveLogo = ({ name }: { name: string }) => {
  const firstName = name.split(" ")[0] || "Portfolio";
  const [colors, setColors] = useState<string[]>(() =>
    new Array(firstName.length).fill("text-white")
  );

  const cycleColor = (index: number) => {
    const palette = [
      "text-blue-500",
      "text-purple-500",
      "text-[#fffdd0]", // Creamish
      "text-[#d4a373]",
      "text-white",
    ];
    setColors((prev) => {
      const newColors = [...prev];
      const currentColor = prev[index];
      const nextIndex = (palette.indexOf(currentColor) + 1) % palette.length;
      newColors[index] = palette[nextIndex === -1 ? 0 : nextIndex];
      return newColors;
    });
  };

  return (
    <div className="flex cursor-pointer select-none">
      <span
        className="text-2xl font-bold tracking-tight md:text-3xl lg:text-4xl italic"
        style={{ fontFamily: "var(--font-instrument)" }}
      >
        {firstName}
      </span>
      <span
        className="text-2xl font-bold text-[#d4a373] md:text-3xl lg:text-4xl"
        style={{ fontFamily: "var(--font-instrument)" }}
      >
        .
      </span>
    </div>
  );
};

// Heatmap Component with Real API
const RealHeatmap = ({ username }: { username?: string }) => {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // Extract pure username from github url if needed
  const cleanUsername = useMemo(() => {
    if (!username) return null;
    if (username.includes("github.com/")) {
      const parts = username.split("github.com/");
      return parts[1].replace(/\/?$/, ""); // remove trailing slash
    }
    return username;
  }, [username]);

  useEffect(() => {
    if (!cleanUsername) return;

    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `https://github-contributions-api.jogruber.de/v4/${cleanUsername}?y=last`,
        );
        const json = await res.json();
        if (json.contributions) {
          // Transform for react-activity-calendar
          // API returns contributions array. react-activity-calendar expects { date, count, level }
          // Actually api returns { date, count, level } already usually or simple structure.
          // The API returns: { total: { ... }, contributions: [ { date: "2023-01-01", count: 0, level: 0 }, ... ] }
          // We need to ensure types match.
          setData(json.contributions);
        }
      } catch (e) {
        console.error("Failed to fetch GitHub data", e);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [cleanUsername]);

  if (!cleanUsername) {
    // Fallback visual if no username
    return (
      <div className="rounded-xl border border-white/5 bg-[#0a0a0a] p-8 text-center text-neutral-500">
        No GitHub username linked.
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="w-full overflow-hidden rounded-xl border border-white/5 bg-[#0a0a0a] p-6 lg:p-8"
    >
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Github className="h-5 w-5 text-white" />
          <h3 className="font-sans text-sm font-medium text-neutral-200">
            @{cleanUsername}
          </h3>
        </div>
        <span className="text-xs text-neutral-500">Last Year Activity</span>
      </div>

      <div className="flex w-full justify-center overflow-x-auto pb-2 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] lg:thin-scrollbar">
        {loading ? (
          <div className="flex h-[108px] w-full items-center justify-center text-sm text-neutral-600 animate-pulse">
            Loading contributions...
          </div>
        ) : data.length > 0 ? (
          <ActivityCalendar
            data={data}
            theme={{
              light: ["#161b22", "#0e4429", "#006d32", "#26a641", "#39d353"],
              dark: ["#161b22", "#0e4429", "#006d32", "#26a641", "#39d353"],
            }}
            blockSize={15}
            blockRadius={3}
            blockMargin={4}
            fontSize={14}
            style={{ color: "#fff" }}
          />
        ) : (
          <div className="text-sm text-neutral-600">
            No public contribution data found.
          </div>
        )}
      </div>
    </motion.div>
  );
};

const defaultSkills = [
  "React",
  "Next.js",
  "TypeScript",
  "JavaScript",
  "Node.js",
  "TailwindCSS",
  "PostgreSQL",
  "Prisma",
  "Figma",
  "Docker",
];

const CoolProjectPlaceholder = () => (
  <div className="relative flex h-full w-full items-center justify-center overflow-hidden bg-[#050505]">
    <div className="absolute inset-0 bg-gradient-to-br from-[#0a0a0a] to-[#111]" />
    {/* 3D Icon Simulation */}
    <div className="relative z-10 transform transition-transform duration-700 group-hover:rotate-6 group-hover:scale-110">
      <div className="relative">
        <div className="absolute inset-0 rounded-full bg-blue-500/10 blur-3xl" />
        <Package
          className="h-24 w-24 text-neutral-800 drop-shadow-[0_10px_20px_rgba(0,0,0,0.8)]"
          strokeWidth={1}
        />
        {/* Highlight */}
        <div className="absolute -right-2 -top-2 h-6 w-6 rounded-full bg-blue-500/20 blur-xl" />
        <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-white/5 to-transparent opacity-20" />
      </div>
    </div>

    <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-black/80 via-transparent to-transparent" />
  </div>
);

const CoolBlogPlaceholder = () => (
  <div className="relative flex h-full w-full items-center justify-center overflow-hidden bg-[#050505]">
    <div className="absolute inset-0 bg-gradient-to-br from-[#0a0a0a] to-[#111]" />
    {/* 3D Icon Simulation */}
    <div className="relative z-10 transform transition-transform duration-700 group-hover:rotate-6 group-hover:scale-110">
      <div className="relative">
        <div className="absolute inset-0 rounded-full bg-blue-500/10 blur-3xl" />
        <FileText
          className="h-20 w-20 text-neutral-800 drop-shadow-[0_10px_20px_rgba(0,0,0,0.8)]"
          strokeWidth={1}
        />
        {/* Highlight */}
        <div className="absolute -right-2 -top-2 h-6 w-6 rounded-full bg-blue-500/20 blur-xl" />
        <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-white/5 to-transparent opacity-20" />
      </div>
    </div>

    <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-black/80 via-transparent to-transparent" />
  </div>
);

const ProjectCard = ({ project, index }: { project: any; index: number }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const isLongDescription =
    project.description && project.description.length > 120;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      viewport={{ once: true }}
      className="group flex flex-col overflow-hidden rounded-2xl border border-white/5 bg-[#0e0e0e] hover:border-white/10"
    >
      {/* Image Area */}
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-[#050505]">
        {project.image ? (
          <img
            src={project.image}
            alt={project.title}
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
        ) : (
          <CoolProjectPlaceholder />
        )}

        {/* Hover Overlay */}
        <div className="absolute inset-0 z-20 hidden md:flex items-center justify-center bg-black/50 opacity-0 backdrop-blur-[2px] transition-opacity duration-300 group-hover:opacity-100">
          <div className="flex gap-4">
            {project.live && (
              <a
                href={project.live}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 rounded-full bg-white px-5 py-2 text-sm font-medium text-black hover:bg-neutral-200"
              >
                Live Demo <ArrowUpRight className="h-4 w-4" />
              </a>
            )}
            {project.github && (
              <a
                href={project.github}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 rounded-full bg-[#111] border border-white/20 px-5 py-2 text-sm font-medium text-white hover:bg-[#222]"
              >
                Code <Github className="h-4 w-4" />
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Info */}
      <div className="flex flex-1 flex-col p-6">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-2xl font-medium text-white">{project.title}</h3>
        </div>
        <div className="mb-6">
          <p
            className={cn(
              "text-sm leading-relaxed text-neutral-400 font-light",
              !isExpanded && "line-clamp-3",
            )}
          >
            {project.description}
          </p>
          {isLongDescription && (
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="mt-2 text-xs text-[#d4a373] hover:underline focus:outline-none"
            >
              {isExpanded ? "Read Less" : "Read More"}
            </button>
          )}
        </div>

        <div className="mt-auto flex flex-wrap gap-2">
          {project.tags.map((tag: string) => (
            <span
              key={tag}
              className="text-[10px] font-mono uppercase tracking-wider text-[#d4a373] bg-[#d4a373]/5 px-2 py-1 rounded"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Mobile Actions */}
        <div className="mt-6 flex gap-3 md:hidden">
          {project.live && (
            <a
              href={project.live}
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-1 items-center justify-center gap-2 rounded-full border border-white/10 bg-white/5 py-2.5 text-xs font-medium text-white backdrop-blur-sm transition-colors hover:bg-white/10"
            >
              Live Demo <ArrowUpRight className="h-3 w-3" />
            </a>
          )}
          {project.github && (
            <a
              href={project.github}
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-1 items-center justify-center gap-2 rounded-full border border-white/10 bg-white/5 py-2.5 text-xs font-medium text-white/70 backdrop-blur-sm transition-colors hover:bg-white/10"
            >
              Code <Github className="h-3 w-3" />
            </a>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export function PortfolioTemplate({
  portfolio,
  isPreview = false,
  isLoggedIn = false,
}: PortfolioTemplateProps) {
  const mergedPortfolio = isPreview
    ? { ...dummyPortfolio, ...portfolio }
    : portfolio;

  const {
    fullName = "Your Name",
    title = "Creative Developer",
    tagline,
    bio,
    profileImage,
    skills: rawSkills,
    projects: rawProjects,
    experience: rawExperience,
    education: rawEducation,
    socialLinks: rawSocialLinks,
    blogs: rawBlogs,
  } = mergedPortfolio;

  // Ensure non-null values for arrays and objects
  const skills = rawSkills ?? [];
  const projects = rawProjects ?? [];
  const experience = rawExperience ?? [];
  const education = rawEducation ?? [];
  const socialLinks = rawSocialLinks ?? {};
  const blogs = rawBlogs ?? [];

  const skillsRow1 = skills.slice(0, Math.ceil(skills.length / 2));
  const skillsRow2 = skills.slice(Math.ceil(skills.length / 2));

  // Hero Icon Color State
  const [heroIconColor, setHeroIconColor] = useState("#d4a373");

  const experienceContainerRef = useRef<HTMLDivElement>(null);

  const [hoveredNav, setHoveredNav] = useState<string | null>(null);
  const [activeNav, setActiveNav] = useState("Home");

  // Contact Form State
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    message: "",
  });

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const { name, phone, email, message } = formData;
    const recipient = socialLinks.email || "hello@example.com";
    const subject = `Message from ${name} via Portfolio`;
    const body = `Name: ${name}\nEmail: ${email}\nPhone: ${phone}\n\nMessage:\n${message}`;

    const mailtoUrl = `mailto:${recipient}?subject=${encodeURIComponent(
      subject,
    )}&body=${encodeURIComponent(body)}`;
    window.location.href = mailtoUrl;
  };

  const navItems = [
    { name: "Home", color: "#3b82f6" },
    { name: "About", color: "#f97316" }, // Orange
    { name: "Contact", color: "#a855f7" }, // Purple
  ];

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return <AppLoader mode="portfolio" name={fullName} />;
  }

  return (
    <div className="min-h-screen w-full bg-[#050505] text-neutral-200 selection:bg-[#d4a37333] selection:text-[#d4a373] font-sans flex flex-col">
      <style
        dangerouslySetInnerHTML={{
          __html: `
        @media (max-width: 1023px) {
          ::-webkit-scrollbar {
            display: none;
          }
          * {
            -ms-overflow-style: none;
            scrollbar-width: none;
          }
        }
      `,
        }}
      />
      {/* Edit Button */}
      {isPreview && (
        <div className="fixed bottom-6 right-6 z-50">
          <Link href={isLoggedIn ? "/dashboard" : "/"}>
            <button className="flex items-center gap-2 rounded-full border border-white/10 bg-[#111] px-6 py-3 text-sm font-medium text-white shadow-xl backdrop-blur-md transition-all hover:bg-white hover:text-black">
              {isLoggedIn ? "Edit Portfolio" : "Create Your Own"}
            </button>
          </Link>
        </div>
      )}

      {/* Navbar - Absolute & Transparent for seamless Hero integration */}
      <nav className="absolute top-0 left-0 right-0 z-50 w-full pt-8 pb-4 bg-transparent">
        <div className="mx-auto flex max-w-[90%] w-full items-center justify-between px-6 md:px-10">
          <div onClick={() => setHeroIconColor("#3b82f6")}>
            {/* Logo: Reduced size, Cursive/Serif Italic, Not Bold */}
            <div className="flex cursor-pointer select-none">
              <span
                className="italic text-xl font-medium tracking-tight md:text-2xl text-white"
                style={{ fontFamily: "var(--font-instrument)" }}
              >
                {fullName?.split(" ")[0]}
              </span>
              <span
                className="text-xl font-medium text-[#3b82f6] md:text-2xl"
                style={{ fontFamily: "var(--font-instrument)" }}
              >
                .
              </span>
            </div>
          </div>
          <div className="flex gap-10">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={`#${item.name.toLowerCase()}`}
                onClick={() => {
                  setActiveNav(item.name);
                }}
                onMouseEnter={() => setHoveredNav(item.name)}
                onMouseLeave={() => setHoveredNav(null)}
                className="hidden text-sm font-light tracking-wide text-neutral-400 transition-all duration-300 hover:text-white md:block relative top-[2px]"
                style={{
                  color:
                    hoveredNav === item.name || activeNav === item.name
                      ? item.color
                      : undefined,
                }}
              >
                {item.name}
                {(hoveredNav === item.name ||
                  (activeNav === item.name && !hoveredNav)) && (
                  <motion.div
                    layoutId="nav-underline"
                    className="absolute -bottom-2 left-0 right-0 h-px"
                    style={{ backgroundColor: item.color }}
                  />
                )}
              </Link>
            ))}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section
        id="home"
        className="relative flex flex-1 flex-col items-center justify-center text-center overflow-hidden min-h-screen pt-20"
      >
        {/* Radial Gradient & Concentric Circles - Increased Visibility & Range */}
        <div className="absolute inset-0 z-0 pointer-events-none">
          {/* Background Gradient */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.06)_0%,rgba(0,0,0,0)_70%)]" />

          {/* Concentric Circles - More visible (opacity increased) */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-[360px] w-[360px] rounded-full border border-white/10 opacity-60" />
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-[540px] w-[540px] rounded-full border border-white/10 opacity-40" />
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-[810px] w-[810px] rounded-full border border-white/10 opacity-30" />
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-[1080px] w-[1080px] rounded-full border border-white/10 opacity-20" />
        </div>

        <div className="relative z-10 flex flex-col items-center max-w-5xl w-full mx-auto px-6 md:px-10 pb-10">
          {/* Centered Atom Icon */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="mb-8"
          >
            <AtomIcon color={heroIconColor} />
          </motion.div>

          {/* Name - Ultra Premium Cormorant Garamond Font, Thin/Light */}
          <motion.h1
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="font-serif text-7xl md:text-9xl font-light tracking-tight text-white mb-4"
            style={{ fontFamily: "var(--font-cormorant)" }}
          >
            {fullName}
          </motion.h1>

          {/* Title - Light, spaced */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="mt-2 flex flex-wrap justify-center gap-3 md:gap-4"
          >
            <span className="font-sans text-xs md:text-sm font-light uppercase tracking-[0.3em] text-neutral-400">
              {title?.toUpperCase()}
            </span>
          </motion.div>

          {/* Bio - Centered & Limited Width */}
          {(bio || tagline) && (
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="mt-8 max-w-2xl mx-auto text-lg md:text-xl leading-relaxed text-neutral-400 font-light text-center"
            >
              <p>
                {(bio || tagline || "")
                  .split(" ")
                  .slice(0, 30) // increased limit slightly to allow for more text if present
                  .map((word, i) => {
                    // Randomly colorize words (approx every 4th word purely for aesthetic randomness)
                    const isColored = i > 0 && i % 4 === 2;
                    return (
                      <span
                        key={i}
                        className={isColored ? "text-[#d4a373]" : ""}
                      >
                        {word}{" "}
                      </span>
                    );
                  })}
                {(bio || tagline || "").split(" ").length > 30 && "..."}
              </p>
            </motion.div>
          )}

          {/* Social Icons Row */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-10 flex items-center justify-center gap-6"
          >
            {Object.entries(socialLinks).map(([key, value]) => {
              if (!value) return null;
              let Icon = Globe;
              if (key.includes("github")) Icon = Github;
              if (key.includes("linkedin")) Icon = Linkedin;
              if (key.includes("twitter")) Icon = Twitter;
              if (key.includes("email")) Icon = Mail;
              if (key.includes("resume")) Icon = FileText;

              return (
                <a
                  key={key}
                  href={key === "email" ? `mailto:${value}` : value}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative flex h-10 w-10 items-center justify-center rounded-full bg-white/5 transition-all hover:bg-white/10 hover:-translate-y-1"
                >
                  <Icon className="h-4 w-4 text-neutral-400 group-hover:text-white" />
                  {/* Tooltip */}
                  <span className="absolute -top-10 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-md border border-white/10 bg-neutral-900 px-2 py-1 text-xs text-white opacity-0 shadow-xl transition-all duration-300 group-hover:opacity-100">
                    {key.charAt(0).toUpperCase() + key.slice(1)}
                  </span>
                </a>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* Tech Stack Marquee - Restored & Styled - Only if skills exist */}
      {skills.length > 0 && (
        <section className="py-20 bg-[#080808]/50 overflow-hidden">
          <div className="mx-auto max-w-6xl w-full px-6 md:px-10 mb-12">
            <h3 className="text-2xl font-sans font-light text-white mb-8 text-center">
              Technologies & Tools
            </h3>
          </div>

          <div className="mx-auto max-w-6xl w-full">
            {/* Row 1 - Left */}
            <div className="mb-8">
              <Marquee
                autoFill
                gradient={true}
                gradientColor="#050505"
                speed={40}
                direction="left"
              >
                {skillsRow1.map((skill, i) => {
                  const { icon: Icon, color } = getSkillStyle(skill);
                  return (
                    <div
                      key={`${skill}-${i}-1`}
                      className="mx-4 flex h-32 w-40 flex-col items-center justify-center gap-3 rounded-2xl border border-white/5 bg-[#0e0e0e]/80 transition-all hover:border-white/10 hover:bg-white/5"
                    >
                      <Icon className="h-8 w-8" style={{ color }} />
                      <span className="text-sm font-light text-neutral-400 capitalize text-center px-2">
                        {skill}
                      </span>
                    </div>
                  );
                })}
              </Marquee>
            </div>

            {/* Row 2 - Right */}
            {skillsRow2.length > 0 && (
              <div>
                <Marquee
                  autoFill
                  gradient={true}
                  gradientColor="#050505"
                  speed={40}
                  direction="right"
                >
                  {skillsRow2.map((skill, i) => {
                    const { icon: Icon, color } = getSkillStyle(skill);
                    return (
                      <div
                        key={`${skill}-${i}-2`}
                        className="mx-4 flex h-32 w-40 flex-col items-center justify-center gap-3 rounded-2xl border border-white/5 bg-[#0e0e0e]/80 transition-all hover:border-white/10 hover:bg-white/5"
                      >
                        <Icon className="h-8 w-8" style={{ color }} />
                        <span className="text-sm font-light text-neutral-400 capitalize text-center px-2">
                          {skill}
                        </span>
                      </div>
                    );
                  })}
                </Marquee>
              </div>
            )}
          </div>
        </section>
      )}

      {/* About Section Removed - Merged into Hero */}

      {/* Heatmap Section */}
      {mergedPortfolio.showGithubHeatmap !== false && (
        <section className="pb-20 pt-10">
          <div className="mx-auto max-w-6xl w-full px-6 md:px-10 overflow-x-auto md:overflow-visible">
            <div className="min-w-[700px] md:min-w-0 origin-left scale-75 md:scale-100 transform transition-transform">
              <RealHeatmap username={socialLinks.github} />
            </div>
          </div>
        </section>
      )}

      {/* Projects Section - Removed Bold */}
      <section id="projects" className="py-24 bg-[#080808]">
        <div className="mx-auto max-w-6xl w-full px-6 md:px-10">
          <div className="mb-16">
            <span className="mb-4 block font-mono text-xs font-medium uppercase tracking-wider text-[#d4a373]">
              Selected Work
            </span>
            <h2 className="font-sans text-4xl font-light text-white md:text-5xl">
              Featured Projects
            </h2>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:gap-12">
            {projects.map((project, index) => (
              <ProjectCard key={project.id} project={project} index={index} />
            ))}
          </div>
        </div>
      </section>

      {/* Experience Section - Single Line & Animated Point */}
      {experience.length > 0 && (
        <section id="experience" className="py-24 relative overflow-hidden">
          <div className="mx-auto max-w-6xl w-full px-6 md:px-10 relative">
            <span className="mb-16 block text-center font-mono text-3xl font-light uppercase tracking-[0.2em] text-white">
              Experience
            </span>

            <div
              className="relative pl-8 md:pl-12"
              ref={experienceContainerRef}
            >
              {/* Continuous Static Line - Hidden on Mobile */}
              <div className="hidden md:block absolute left-[39px] md:left-[49px] top-0 bottom-0 w-px bg-white/10" />

              {/* Animated Scroll Point - Hidden on Mobile */}
              <div className="hidden md:block">
                <TimelineScrollAnimation
                  containerRef={experienceContainerRef}
                />
              </div>

              <div className="space-y-12">
                {experience.map((exp, i) => {
                  const colors = [
                    "border-cyan-400 text-cyan-400",
                    "border-purple-400 text-purple-400",
                    "border-orange-400 text-orange-400",
                    "border-green-400 text-green-400",
                  ];
                  const colorClass = colors[i % colors.length];

                  return (
                    <motion.div
                      key={exp.id}
                      initial={{ opacity: 0, x: 20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.1 }}
                      viewport={{ once: true, margin: "-50px" }}
                      className="relative grid grid-cols-[1fr] md:grid-cols-[200px_1fr] md:gap-x-12 group"
                    >
                      {/* Timeline Dot (Absolute to line) - Hidden on mobile */}
                      <div className="absolute left-[11px] md:left-[5px] -translate-x-1/2 top-1.5 hidden md:flex items-center justify-center">
                        <div
                          className={cn(
                            "h-4 w-4 rounded-full bg-[#050505] border-2 z-10 transition-transform duration-300 group-hover:scale-125",
                            colorClass.split(" ")[0],
                          )}
                        />
                      </div>

                      {/* Meta (Date) - Moves to top on mobile */}
                      <div className="mb-2 md:mb-0 md:text-right">
                        <span
                          className={cn(
                            "font-mono text-sm",
                            colorClass.split(" ")[1],
                          )}
                        >
                          {exp.duration}
                        </span>
                      </div>

                      {/* Content */}
                      <div className="flex flex-col">
                        <h3 className="text-2xl text-white font-medium mb-1">
                          {exp.position}
                        </h3>
                        <h4 className="text-white/60 text-base font-light font-sans tracking-wide mb-4">
                          {exp.company}
                        </h4>
                        <p className="text-neutral-400 text-base leading-relaxed max-w-2xl font-light">
                          {exp.description}
                        </p>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Blogs Section */}
      {blogs && blogs.length > 0 && (
        <section id="blogs" className="py-24 bg-[#0a0a0a]">
          <div className="mx-auto max-w-5xl w-full px-6 md:px-10">
            <span className="mb-16 block text-center font-mono text-3xl font-light uppercase tracking-[0.2em] text-white">
              Writing
            </span>
            <div className="grid gap-12">
              {blogs.map((blog: BlogData) => (
                <a
                  key={blog.id}
                  href={blog.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group grid md:grid-cols-[180px_1fr] gap-6 md:gap-10 items-start p-4 -mx-4 rounded-2xl transition-colors hover:bg-white/5"
                >
                  {/* Blog Image */}
                  <div className="aspect-video w-full md:w-[180px] md:h-[126px] overflow-hidden rounded-xl bg-neutral-900 border border-white/10 relative shrink-0">
                    {blog.image ? (
                      <img
                        src={blog.image}
                        alt={blog.title}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <CoolBlogPlaceholder />
                    )}
                  </div>

                  {/* Blog Content */}
                  <div className="flex flex-col h-full justify-center">
                    <h3 className="text-2xl font-light text-white mb-2 group-hover:text-[#d4a373] transition-colors leading-tight">
                      {blog.title}
                    </h3>
                    <div className="flex items-center gap-3 mb-3 text-sm text-neutral-500 font-mono">
                      {blog.date && (
                        <div className="flex items-center gap-1.5">
                          <span>{blog.date}</span>
                        </div>
                      )}
                    </div>
                    <p className="text-neutral-400 font-light leading-relaxed line-clamp-2">
                      {blog.description}
                    </p>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Contact Section - Redesigned Form, Light */}
      <footer id="contact" className="py-24 bg-[#080808]">
        <div className="mx-auto max-w-6xl w-full px-6 md:px-10">
          <div className="flex flex-wrap items-end justify-between gap-8 mb-16">
            <div>
              <h2 className="font-sans text-4xl font-light text-white md:text-5xl mb-4">
                Get in Touch
              </h2>
              <p className="max-w-md text-neutral-400 font-light">
                Have a project in mind or just want to chat? Feel free to reach
                out directly or book a call.
              </p>
            </div>

            <div className="flex items-center gap-4">
              {socialLinks.twitter && (
                <a
                  href={socialLinks.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center gap-2 rounded-full border border-white/10 bg-[#111] px-6 py-4 text-sm font-medium text-white transition-all hover:bg-neutral-800"
                >
                  <span>Follow me</span>
                  <Twitter className="h-4 w-4" />
                </a>
              )}
              <a
                href={`mailto:${socialLinks.email || "hello@example.com"}`}
                className="group flex items-center gap-3 rounded-full bg-white px-8 py-4 text-sm font-medium text-black transition-all hover:bg-neutral-200"
              >
                <span>Book a call</span>
                <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-1 group-hover:translate-x-1" />
              </a>
            </div>
          </div>

          <div className="grid gap-16 lg:grid-cols-2">
            {/* Left: Info */}
            <div className="flex flex-col justify-between">
              <div className="space-y-8">
                <p className="text-neutral-400 font-light leading-relaxed text-lg pb-8 border-b border-white/5">
                  If you have any inquiries, please feel free to reach out. You
                  can contact me via email at <br />
                  <a
                    href={`mailto:${socialLinks.email}`}
                    className="text-[#d4a373] hover:underline font-medium mt-2 block"
                  >
                    {socialLinks.email || "hello@example.com"}
                  </a>
                </p>

                <div>
                  <span className="block text-white font-medium mb-4">
                    Follow me
                  </span>
                  <div className="flex gap-4">
                    {Object.entries(socialLinks).map(([key, value]) => {
                      if (!value || key === "email") return null;
                      let Icon = Globe;
                      if (key.includes("github")) Icon = Github;
                      if (key.includes("linkedin")) Icon = Linkedin;
                      if (key.includes("twitter")) Icon = Twitter;
                      return (
                        <a
                          key={key}
                          href={value}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex h-10 w-10 items-center justify-center rounded-lg border border-white/10 bg-[#111] text-neutral-400 hover:text-white hover:border-white/20 transition-all"
                        >
                          <Icon className="h-4 w-4" />
                        </a>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <span className="block text-white font-medium mb-4">
                    Let's Connect
                  </span>
                  <a
                    href={`mailto:${socialLinks.email}`}
                    className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-bold text-black hover:bg-neutral-200 transition-colors"
                  >
                    <Mail className="h-4 w-4" /> Book a call
                  </a>
                </div>
              </div>
            </div>

            {/* Right: Form */}
            <form className="space-y-6" onSubmit={handleContactSubmit}>
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-xs font-medium text-neutral-500 uppercase tracking-wider">
                    Full Name
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    placeholder="John Doe"
                    className="w-full rounded-lg border border-white/10 bg-[#111] px-4 py-3 text-white placeholder:text-neutral-600 focus:border-[#d4a373] focus:outline-none focus:ring-1 focus:ring-[#d4a373]"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-medium text-neutral-500 uppercase tracking-wider">
                    Phone No
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                    placeholder="+1 234 567 890"
                    className="w-full rounded-lg border border-white/10 bg-[#111] px-4 py-3 text-white placeholder:text-neutral-600 focus:border-[#d4a373] focus:outline-none focus:ring-1 focus:ring-[#d4a373]"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-medium text-neutral-500 uppercase tracking-wider">
                  Email
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  placeholder="john@example.com"
                  className="w-full rounded-lg border border-white/10 bg-[#111] px-4 py-3 text-white placeholder:text-neutral-600 focus:border-[#d4a373] focus:outline-none focus:ring-1 focus:ring-[#d4a373]"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-medium text-neutral-500 uppercase tracking-wider">
                  Message
                </label>
                <textarea
                  rows={4}
                  required
                  value={formData.message}
                  onChange={(e) =>
                    setFormData({ ...formData, message: e.target.value })
                  }
                  placeholder="Tell me about your project..."
                  className="w-full rounded-lg border border-white/10 bg-[#111] px-4 py-3 text-white placeholder:text-neutral-600 focus:border-[#d4a373] focus:outline-none focus:ring-1 focus:ring-[#d4a373]"
                />
              </div>
              <button
                type="submit"
                className="w-full rounded-lg bg-white py-4 text-sm font-bold text-black transition-transform hover:scale-[1.02] hover:bg-neutral-200"
              >
                Submit
              </button>
            </form>
          </div>

          <div className="mt-20 pt-8 border-t border-white/5 text-center text-xs text-neutral-600">
            © {new Date().getFullYear()} {fullName}. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
