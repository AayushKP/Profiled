"use client";

import React, { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import dynamic from "next/dynamic";
import {
  MapPin,
  Clock,
  Twitter,
  Github,
  Mail,
  Download,
  ArrowUpRight,
  Package,
  Briefcase,
  Linkedin,
  Globe,
} from "lucide-react";
import { ActivityCalendar } from "react-activity-calendar";
import { useSession } from "@/lib/auth-client";
import { dummyPortfolio } from "@/lib/dummy-data";
import type { PortfolioTemplateProps } from "./index";

const Marquee = dynamic(() => import("react-fast-marquee"), { ssr: false });

import {
  SiHtml5,
  SiCss,
  SiJavascript,
  SiTypescript,
  SiReact,
  SiNodedotjs,
  SiExpress,
  SiNotion,
  SiGit,
  SiGithub,
  SiPostman,
  SiSwagger,
  SiSpringboot,
  SiPython,
  SiDocker,
  SiMysql,
  SiMongodb,
  SiPostgresql,
  SiNextdotjs,
  SiTailwindcss,
} from "react-icons/si";

const skillIcons: Record<string, React.ElementType> = {
  javascript: SiJavascript,
  "react.js": SiReact,
  react: SiReact,
  "next.js": SiNextdotjs,
  nextjs: SiNextdotjs,
  typescript: SiTypescript,
  "node.js": SiNodedotjs,
  node: SiNodedotjs,
  "express.js": SiExpress,
  express: SiExpress,
  python: SiPython,
  postgres: SiPostgresql,
  postgresql: SiPostgresql,
  tailwindcss: SiTailwindcss,
  tailwind: SiTailwindcss,
  mongodb: SiMongodb,
  docker: SiDocker,
  git: SiGit,
  github: SiGithub,
  html: SiHtml5,
  css: SiCss,
  notion: SiNotion,
  postman: SiPostman,
  swagger: SiSwagger,
  "spring boot": SiSpringboot,
  mysql: SiMysql,
};

const skillColors: Record<string, string> = {
  javascript: "#f7df1e",
  react: "#61dafb",
  "react.js": "#61dafb",
  nextjs: "#ffffff",
  "next.js": "#ffffff",
  typescript: "#3178c6",
  node: "#339933",
  "node.js": "#339933",
  express: "#ffffff",
  "express.js": "#ffffff",
  python: "#3776ab",
  postgres: "#336791",
  postgresql: "#336791",
  tailwindcss: "#06b6d4",
  tailwind: "#06b6d4",
  mongodb: "#47a248",
  docker: "#2496ed",
  git: "#f05032",
  github: "#ffffff",
  html: "#e34f26",
  css: "#1572b6",
  notion: "#ffffff",
  postman: "#ff6c37",
  swagger: "#85ea2d",
  "spring boot": "#6db33f",
  mysql: "#4479a1",
};

function getSkillIcon(skill: string) {
  const norm = skill.toLowerCase().trim();
  return skillIcons[norm] || null;
}

function getSkillColor(skill: string) {
  const norm = skill.toLowerCase().trim();
  return skillColors[norm] || undefined;
}

// --- Corner Bracket Titles (Highlighted) ---
const SectionTitle = ({ children }: { children: React.ReactNode }) => (
  <div className="relative inline-flex items-center justify-center px-4 py-2 w-max md:mx-0 bg-neutral-100 dark:bg-[#151515]">
    <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-neutral-400 dark:border-neutral-500"></div>
    <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-neutral-400 dark:border-neutral-500"></div>
    <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-neutral-400 dark:border-neutral-500"></div>
    <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-neutral-400 dark:border-neutral-500"></div>
    <span className="text-xl md:text-xl font-bold tracking-tight text-neutral-900 dark:text-white">
      {children}
    </span>
  </div>
);

// --- Click Burst ---
const ClickBurst = () => {
  const [particles, setParticles] = useState<
    { id: number; x: number; y: number }[]
  >([]);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const id = Date.now() + Math.random();
      setParticles((prev) => [...prev, { id, x: e.clientX, y: e.clientY }]);
      setTimeout(() => {
        setParticles((prev) => prev.filter((p) => p.id !== id));
      }, 700);
    };
    window.addEventListener("click", handleClick);
    return () => window.removeEventListener("click", handleClick);
  }, []);

  return (
    <div className="pointer-events-none fixed inset-0 z-[9999] overflow-hidden">
      {particles.map((p) => (
        <div
          key={p.id}
          className="absolute"
          style={{ left: p.x, top: p.y, transform: "translate(-50%, -50%)" }}
        >
          {Array.from({ length: 12 }).map((_, i) => (
            <motion.div
              key={i}
              initial={{ scale: 1, x: 0, y: 0, opacity: 1 }}
              animate={{
                x: Math.cos((i * 30 * Math.PI) / 180) * 40,
                y: Math.sin((i * 30 * Math.PI) / 180) * 40,
                opacity: 0,
                scale: 0,
              }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="absolute h-1.5 w-1.5 rounded-none bg-neutral-400 dark:bg-white"
            />
          ))}
        </div>
      ))}
    </div>
  );
};

// --- Heatmap ---
const RealHeatmap = ({ username }: { username?: string }) => {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const cleanUsername = useMemo(() => {
    if (!username) return null;
    if (username.includes("github.com/")) {
      const parts = username.split("github.com/");
      return parts[1].replace(/\/?$/, "");
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
        if (json.contributions) setData(json.contributions);
      } catch (e) {
        console.error("Failed to fetch Github data", e);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [cleanUsername]);

  if (!cleanUsername || (!loading && data.length === 0)) {
    return null;
  }

  return (
    <div className="w-full flex p-3 lg:p-4 border-2 border-dashed border-neutral-300 dark:border-neutral-800 hover:border-neutral-500 dark:hover:border-neutral-600 transition-colors overflow-x-auto thin-scrollbar rounded-none">
      {loading ? (
        <div className="h-24 w-full flex items-center justify-center text-xs text-neutral-500 animate-pulse">
          Loading contributions...
        </div>
      ) : (
        <div className="min-w-max mx-auto">
          <ActivityCalendar
            data={data}
            theme={{
              light: ["#ebedf0", "#9be9a8", "#40c463", "#30a14e", "#216e39"],
              dark: ["#161b22", "#0e4429", "#006d32", "#26a641", "#39d353"],
            }}
            blockSize={11}
            blockRadius={0}
            blockMargin={3}
            fontSize={11}
          />
        </div>
      )}
    </div>
  );
};

// --- Project Placeholder ---
const PREMIUM_ACCENTS = [
  {
    bg: "bg-blue-500/10",
    border: "border-blue-500/20",
    glow: "from-blue-500/20",
    text: "text-blue-200",
  },
  {
    bg: "bg-purple-500/10",
    border: "border-purple-500/20",
    glow: "from-purple-500/20",
    text: "text-purple-200",
  },
  {
    bg: "bg-emerald-500/10",
    border: "border-emerald-500/20",
    glow: "from-emerald-500/20",
    text: "text-emerald-200",
  },
  {
    bg: "bg-rose-500/10",
    border: "border-rose-500/20",
    glow: "from-rose-500/20",
    text: "text-rose-200",
  },
  {
    bg: "bg-amber-500/10",
    border: "border-amber-500/20",
    glow: "from-amber-500/20",
    text: "text-amber-200",
  },
  {
    bg: "bg-cyan-500/10",
    border: "border-cyan-500/20",
    glow: "from-cyan-500/20",
    text: "text-cyan-200",
  },
];

const CyberAvatarPlaceholder = () => (
  <div className="absolute inset-0 w-full h-full bg-[#0c0c0c] z-0 flex items-center justify-center overflow-hidden">
    {/* Premium technical diagonal stripes */}
    <div
      className="absolute inset-0 opacity-[0.4]"
      style={{
        background:
          "repeating-linear-gradient(-45deg, #1a1a1a, #1a1a1a 1px, transparent 1px, transparent 6px)",
      }}
    />

    {/* Soft central glow */}
    <div className="absolute inset-0 bg-linear-to-br from-neutral-500/10 to-transparent opacity-40 z-0" />
    <div className="absolute inset-0 shadow-[inset_0_0_40px_rgba(0,0,0,0.9)] z-0" />

    {/* Abstract Premium Human Silhouette */}
    <div className="relative z-10 w-12 h-12 md:w-16 md:h-16 opacity-70 group-hover:opacity-100 transition-opacity duration-500">
      <svg
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full text-neutral-300 drop-shadow-[0_0_12px_rgba(255,255,255,0.4)]"
      >
        <path
          d="M12 11C14.2091 11 16 9.20914 16 7C16 4.79086 14.2091 3 12 3C9.79086 3 8 4.79086 8 7C8 9.20914 9.79086 11 12 11Z"
          stroke="currentColor"
          strokeWidth="1"
          strokeLinecap="square"
        />
        <path
          d="M20.59 22C20.59 18.13 16.74 15 12 15C7.26 15 3.41 18.13 3.41 22"
          stroke="currentColor"
          strokeWidth="1"
          strokeLinecap="square"
          strokeDasharray="2 2"
        />
      </svg>
      {/* Glitch/Scan overlays */}
      <div className="absolute inset-0 bg-white/5 animate-pulse mix-blend-overlay" />
    </div>

    {/* Technical Crosshairs framing the head */}
    <div className="absolute top-[20%] left-[20%] w-2 h-2 border-t border-l border-neutral-500/50" />
    <div className="absolute top-[20%] right-[20%] w-2 h-2 border-t border-r border-neutral-500/50" />
    <div className="absolute bottom-[20%] left-[20%] w-2 h-2 border-b border-l border-neutral-500/50" />
    <div className="absolute bottom-[20%] right-[20%] w-2 h-2 border-b border-r border-neutral-500/50" />

    {/* User Tag */}
    <div className="absolute bottom-2 left-1/2 -translate-x-1/2 font-mono text-[7px] md:text-[8px] tracking-[0.2em] text-neutral-500">
      USR.ID.01
    </div>
  </div>
);

const CoolProjectPlaceholder = ({
  title,
  index = 0,
}: {
  title: string;
  index?: number;
}) => {
  const accent = PREMIUM_ACCENTS[index % PREMIUM_ACCENTS.length];

  return (
    <div
      className={`relative flex h-full w-full items-center justify-center overflow-hidden bg-[#0c0c0c] z-0 group`}
    >
      {/* Premium technical diagonal stripes */}
      <div
        className="absolute inset-0 opacity-[0.5]"
        style={{
          background:
            "repeating-linear-gradient(-45deg, #1a1a1a, #1a1a1a 1px, transparent 1px, transparent 6px)",
        }}
      />

      {/* Soft central glow based on accent */}
      <div
        className={`absolute inset-0 bg-linear-to-br ${accent.glow} to-transparent opacity-40 z-0`}
      />

      {/* Soft central vignette */}
      <div className="absolute inset-0 shadow-[inset_0_0_80px_rgba(0,0,0,0.9)] z-0" />

      {/* Data marker */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 font-mono text-[9px] font-bold tracking-[0.3em] text-neutral-600 z-10 transition-colors group-hover:text-neutral-400">
        SYS.PRJ.{String(index + 1).padStart(2, "0")}
      </div>

      {/* Center Block */}
      <div className="relative z-10 transform transition-all duration-700 group-hover:scale-105 w-[80%] max-w-[280px]">
        {/* Center Target Reticles framing the box */}
        <div
          className={`absolute -top-3 -left-3 w-4 h-4 border-t-2 border-l-2 ${accent.border} z-20 transition-transform duration-500 group-hover:-translate-x-1 group-hover:-translate-y-1`}
        />
        <div
          className={`absolute -top-3 -right-3 w-4 h-4 border-t-2 border-r-2 ${accent.border} z-20 transition-transform duration-500 group-hover:translate-x-1 group-hover:-translate-y-1`}
        />
        <div
          className={`absolute -bottom-3 -left-3 w-4 h-4 border-b-2 border-l-2 ${accent.border} z-20 transition-transform duration-500 group-hover:-translate-x-1 group-hover:translate-y-1`}
        />
        <div
          className={`absolute -bottom-3 -right-3 w-4 h-4 border-b-2 border-r-2 ${accent.border} z-20 transition-transform duration-500 group-hover:translate-x-1 group-hover:translate-y-1`}
        />

        <div
          className={`h-14 w-full md:h-16 bg-[#0a0a0a]/90 backdrop-blur-xl border border-neutral-800 shadow-2xl flex items-center justify-center relative overflow-hidden`}
        >
          {/* Subtle light sweep on hover */}
          <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/5 to-transparent transition-transform duration-1000 group-hover:translate-x-full" />

          <span
            className={`text-lg md:text-xl font-bold ${accent.text} opacity-80 tracking-[0.4em] ml-[0.4em] font-mono relative z-10 transition-colors group-hover:opacity-100`}
          >
            PROJECT
          </span>
        </div>
      </div>
    </div>
  );
};

// --- Clock Widget ---
const ClockWidget = () => {
  const [currentTime, setCurrentTime] = useState("");
  useEffect(() => {
    const updateTime = () => setCurrentTime(new Date().toLocaleTimeString());
    updateTime();
    const intv = setInterval(updateTime, 1000);
    return () => clearInterval(intv);
  }, []);
  return <span>{currentTime || "12:00:00 AM"}</span>;
};

// === Main Template ===
export function LuminalTemplate({
  portfolio,
  isPreview = false,
  isLoggedIn = false,
}: PortfolioTemplateProps) {
  const { data: session } = useSession();
  const mergedPortfolio = isPreview
    ? { ...dummyPortfolio, ...portfolio }
    : portfolio;

  const {
    username,
    fullName = "Your Name",
    title = "Creative Developer",
    bio,
    profileImage,
    skills = [],
    projects = [],
    experience = [],
    socialLinks = {},
  } = mergedPortfolio as any;

  const avatarImage = profileImage || session?.user?.image;

  // Make 2 rows of skills
  const halfSkills = Math.ceil(skills.length / 2);
  const skillsRow1 = skills.slice(0, halfSkills);
  const skillsRow2 = skills.slice(halfSkills);

  return (
    <>
      <style
        dangerouslySetInnerHTML={{
          __html: `
        @import url('https://fonts.googleapis.com/css2?family=Figtree:wght@400;500;600;700;800&display=swap');
        .font-figtree { font-family: 'Figtree', sans-serif; }
      `,
        }}
      />
      <div className="min-h-screen w-full bg-white dark:bg-[#0a0a0a] text-neutral-900 dark:text-neutral-100 font-figtree transition-colors duration-300 selection:bg-neutral-200 dark:selection:bg-neutral-800 relative">
        <ClickBurst />

        {/* Content container - reduced padding, gaps */}
        <div className="mx-auto w-[92%] md:w-full max-w-[800px] py-10 md:py-14 flex flex-col gap-9">
          {/* Profile Header */}
          <section className="flex flex-col md:flex-row gap-6 items-start">
            <div className="relative group w-28 h-28 md:w-36 md:h-36 shrink-0 border-2 border-dashed border-neutral-300 dark:border-neutral-700 hover:border-neutral-400 dark:hover:border-neutral-500 transition-colors rounded-none overflow-hidden shadow-sm bg-white dark:bg-[#111]">
              <CyberAvatarPlaceholder />
              {avatarImage && (
                <img
                  src={avatarImage}
                  alt={fullName}
                  className="relative z-10 w-full h-full object-cover transition-opacity duration-300 group-hover:opacity-0"
                />
              )}
            </div>

            <div className="flex flex-col gap-1.5 pt-1">
              <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
                {fullName} <span className="text-red-500">🚀</span>
              </h1>
              {username && (
                <p className="text-sm font-medium text-neutral-500 dark:text-neutral-400">
                  @{username}
                </p>
              )}
              <div className="flex items-center gap-2 text-sm md:text-base font-medium mt-1">
                <span className="underline underline-offset-4 decoration-neutral-300 dark:decoration-neutral-700">
                  {title}
                </span>
              </div>
              <div className="flex items-center gap-3 text-xs text-neutral-500 dark:text-neutral-400 mt-2 font-mono">
                {(mergedPortfolio.location || "India") && (
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-4 h-4" />{" "}
                    {mergedPortfolio.location || "India"}
                  </div>
                )}
                <span>·</span>
                <div className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4" /> <ClockWidget />
                </div>
              </div>
            </div>
          </section>

          {/* Bio */}
          {bio && (
            <section className="text-[16px] md:text-[17px] leading-relaxed text-neutral-600 dark:text-neutral-300 font-medium">
              <p>{bio}</p>
            </section>
          )}

          {/* Action Buttons */}
          <section className="flex flex-wrap items-center gap-3">
            {socialLinks?.twitter && (
              <a
                href={socialLinks.twitter}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1.5 px-4 py-2 border-2 border-dashed border-neutral-300 dark:border-neutral-800 hover:border-neutral-400 dark:hover:border-neutral-600 transition-colors rounded-none text-sm font-bold bg-white dark:bg-[#111]"
              >
                <Twitter className="w-4 h-4" /> Twitter / X
              </a>
            )}

            {socialLinks?.linkedin && (
              <a
                href={socialLinks.linkedin}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1.5 px-4 py-2 border-2 border-dashed border-neutral-300 dark:border-neutral-800 hover:border-neutral-400 dark:hover:border-neutral-600 transition-colors rounded-none text-sm font-bold bg-white dark:bg-[#111]"
              >
                <Linkedin className="w-3.5 h-3.5" /> LinkedIn
              </a>
            )}

            {socialLinks?.email && (
              <>
                {(socialLinks?.twitter || socialLinks?.linkedin) && (
                  <span className="text-[11px] font-mono text-neutral-400 uppercase font-bold">
                    OR
                  </span>
                )}
                <a
                  href={"mailto:" + socialLinks.email}
                  className="flex items-center gap-1.5 px-4 py-2 border-2 border-dashed border-neutral-300 dark:border-neutral-800 hover:border-neutral-400 dark:hover:border-neutral-600 transition-colors rounded-none text-sm font-bold bg-white dark:bg-[#111]"
                >
                  <Mail className="w-4 h-4" /> Email Me
                </a>
              </>
            )}

            <div className="w-px h-6 bg-neutral-200 dark:bg-neutral-800 hidden md:block mx-1" />

            {socialLinks?.github && (
              <a
                href={socialLinks.github}
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-center p-2 border-2 border-dashed border-neutral-300 dark:border-neutral-800 hover:border-neutral-400 dark:hover:border-neutral-600 transition-colors rounded-none bg-white dark:bg-[#111]"
                title="GitHub"
              >
                <Github className="w-4 h-4" />
              </a>
            )}
            {socialLinks?.website && (
              <a
                href={socialLinks.website}
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-center p-2 border-2 border-dashed border-neutral-300 dark:border-neutral-800 hover:border-neutral-400 dark:hover:border-neutral-600 transition-colors rounded-none bg-white dark:bg-[#111]"
                title="Personal Website"
              >
                <Globe className="w-4 h-4" />
              </a>
            )}
            {socialLinks?.resume && (
              <a
                href={socialLinks.resume}
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-center p-2 border-2 border-dashed border-neutral-300 dark:border-neutral-800 hover:border-neutral-400 dark:hover:border-neutral-600 transition-colors rounded-none bg-white dark:bg-[#111]"
                title="Download Resume"
              >
                <Download className="w-4 h-4" />
              </a>
            )}
          </section>

          {/* Skills - Marquee */}
          {skills?.length > 0 && (
            <section className="flex flex-col gap-5">
              <SectionTitle>My Skills</SectionTitle>

              <div className="flex flex-col gap-3">
                <Marquee
                  autoFill
                  speed={35}
                  direction="left"
                  className="overflow-hidden"
                >
                  {skillsRow1.map((skill: string) => {
                    const Icon = getSkillIcon(skill);
                    const color = getSkillColor(skill);
                    return (
                      <div
                        key={skill}
                        className="flex items-center gap-2 text-[15px] md:text-base font-bold mx-4"
                      >
                        {Icon && (
                          <Icon
                            style={{ color }}
                            className="w-5 h-5 shrink-0"
                          />
                        )}
                        {skill}
                      </div>
                    );
                  })}
                </Marquee>

                {skillsRow2.length > 0 && (
                  <Marquee
                    autoFill
                    speed={35}
                    direction="right"
                    className="overflow-hidden"
                  >
                    {skillsRow2.map((skill: string) => {
                      const Icon = getSkillIcon(skill);
                      const color = getSkillColor(skill);
                      return (
                        <div
                          key={skill}
                          className="flex items-center gap-2 text-[15px] md:text-base font-bold mx-4"
                        >
                          {Icon && (
                            <Icon
                              style={{ color }}
                              className="w-5 h-5 shrink-0"
                            />
                          )}
                          {skill}
                        </div>
                      );
                    })}
                  </Marquee>
                )}
              </div>
            </section>
          )}

          {/* Work Experience */}
          {experience?.length > 0 && (
            <section className="flex flex-col gap-5">
              <SectionTitle>Work Experience</SectionTitle>

              <div className="flex flex-col gap-4">
                {experience.map((exp: any) => (
                  <div
                    key={exp.id}
                    className="p-4 md:p-5 border-2 border-dashed border-neutral-300 dark:border-neutral-800 hover:border-neutral-400 dark:hover:border-neutral-600 transition-colors rounded-none flex flex-col md:flex-row justify-between gap-4"
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 bg-white dark:bg-[#111] rounded-none flex items-center justify-center shrink-0 border-2 border-dashed border-neutral-300 dark:border-neutral-800">
                        <Briefcase className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2.5">
                          <h4 className="text-lg md:text-xl font-bold tracking-tight">
                            {exp.company}
                          </h4>
                          <span className="text-[10px] font-bold uppercase tracking-wider bg-green-500/10 text-green-600 dark:text-green-400 px-2 py-0.5 rounded-none flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-none bg-green-500 animate-pulse"></span>
                            Completed
                          </span>
                        </div>
                        <p className="text-sm md:text-base font-bold text-neutral-500 dark:text-neutral-400 mt-1">
                          {exp.position}
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-col md:items-end text-sm font-bold text-neutral-500">
                      <span>{exp.duration}</span>
                      <span>Remote</span>
                    </div>
                  </div>
                ))}
              </div>

              {socialLinks?.github &&
                mergedPortfolio.showGithubHeatmap !== false && (
                  <RealHeatmap username={socialLinks.github} />
                )}
            </section>
          )}

          {/* Projects */}
          {projects?.length > 0 && (
            <section className="flex flex-col gap-5">
              <SectionTitle>My Projects</SectionTitle>

              <div className="flex flex-col gap-5">
                {projects.map((proj: any, index: number) => {
                  const accent =
                    PREMIUM_ACCENTS[index % PREMIUM_ACCENTS.length];
                  return (
                    <div
                      key={proj.id}
                      className={`group p-4 md:p-5 border-2 border-dashed border-neutral-300 dark:border-neutral-800 hover:border-neutral-400 dark:hover:border-neutral-600 transition-colors rounded-none flex flex-col md:flex-row gap-5 md:gap-7 bg-white dark:bg-[#0c0c0c] relative overflow-hidden`}
                    >
                      {/* Premium card glow accent */}
                      <div
                        className={`absolute -right-20 -top-20 w-40 h-40 ${accent.bg} blur-[100px] pointer-events-none opacity-50`}
                      />

                      {/* Image / Cover */}
                      <div className="w-full md:w-[42%] lg:w-[38%] aspect-video md:aspect-16/10 bg-neutral-100 dark:bg-[#0c0c0c] rounded-none overflow-hidden shrink-0 border-2 border-neutral-200 dark:border-neutral-800 relative">
                        <CoolProjectPlaceholder
                          index={index}
                          title={proj.title}
                        />
                      </div>

                      {/* Info */}
                      <div className="w-full flex flex-col">
                        <div className="flex items-center justify-between gap-3 flex-wrap mb-2">
                          <h4 className="text-xl md:text-2xl font-bold tracking-tight">
                            {proj.title}
                          </h4>
                          <div className="flex items-center gap-2">
                            {proj.live && (
                              <a
                                href={proj.live}
                                target="_blank"
                                rel="noreferrer"
                                className="flex items-center gap-1.5 px-3 py-1 border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-[#111] hover:bg-neutral-50 dark:hover:bg-[#1a1a1a] text-[13px] font-bold transition-colors rounded-none shadow-sm"
                              >
                                <ArrowUpRight className="w-3.5 h-3.5" /> Live
                              </a>
                            )}
                            {proj.github && (
                              <a
                                href={proj.github}
                                target="_blank"
                                rel="noreferrer"
                                className="flex items-center gap-1.5 px-3 py-1 border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-[#111] hover:bg-neutral-50 dark:hover:bg-[#1a1a1a] text-[13px] font-bold transition-colors rounded-none shadow-sm"
                              >
                                <Github className="w-3.5 h-3.5" /> GitHub
                              </a>
                            )}
                          </div>
                        </div>

                        <p className="text-[15px] font-medium text-neutral-600 dark:text-neutral-400 mb-4 leading-relaxed">
                          {proj.description}
                        </p>

                        <div className="mt-auto pt-3 border-t-2 border-dashed border-neutral-300 dark:border-neutral-800">
                          <p className="text-[14px] font-bold mb-2 tracking-wide text-neutral-800 dark:text-neutral-200">
                            Technologies Used:
                          </p>
                          <div className="flex flex-wrap gap-2.5">
                            {proj.tags?.map((tag: string) => (
                              <span
                                key={tag}
                                className="px-2 py-1 bg-neutral-100 dark:bg-[#111] shadow-[inset_0_2px_4px_rgba(255,255,255,0.3)] border border-neutral-200 dark:border-neutral-800 rounded-sm text-[12px] font-bold text-neutral-800 dark:text-neutral-200"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          )}

          {/* Let's Connect / Footer */}
          <section className="flex flex-col gap-6 mt-2">
            <div className="py-12 md:py-16 border-2 border-dashed border-neutral-300 dark:border-neutral-800 hover:border-neutral-400 dark:hover:border-neutral-600 transition-colors rounded-none flex flex-col items-center gap-6 px-4">
              <div className="text-center">
                <h2 className="text-2xl md:text-3xl font-bold mb-2">
                  Let&apos;s Connect
                </h2>
                <p className="text-base text-neutral-500 font-medium tracking-tight">
                  Feel free to reach out through any of these platforms
                </p>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-3">
                {socialLinks?.email && (
                  <a
                    href={"mailto:" + socialLinks.email}
                    className="flex items-center gap-2 px-4 py-2 bg-neutral-100 dark:bg-[#111] border border-neutral-200 dark:border-neutral-800 rounded-none text-sm md:text-[15px] font-bold hover:-translate-y-1 transition-transform shadow-sm"
                  >
                    <Mail className="w-4 h-4" /> Email
                  </a>
                )}
                {socialLinks?.twitter && (
                  <a
                    href={socialLinks.twitter}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-2 px-4 py-2 bg-neutral-100 dark:bg-[#111] border border-neutral-200 dark:border-neutral-800 rounded-none text-sm md:text-[15px] font-bold hover:-translate-y-1 transition-transform shadow-sm"
                  >
                    <Twitter className="w-4 h-4" /> Twitter
                  </a>
                )}
                {socialLinks?.github && (
                  <a
                    href={socialLinks.github}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-2 px-4 py-2 bg-neutral-100 dark:bg-[#111] border border-neutral-200 dark:border-neutral-800 rounded-none text-sm md:text-[15px] font-bold hover:-translate-y-1 transition-transform shadow-sm"
                  >
                    <Github className="w-4 h-4" /> GitHub
                  </a>
                )}
                {socialLinks?.resume && (
                  <a
                    href={socialLinks.resume}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-2 px-4 py-2 bg-neutral-100 dark:bg-[#111] border border-neutral-200 dark:border-neutral-800 rounded-none text-sm md:text-[15px] font-bold hover:-translate-y-1 transition-transform shadow-sm"
                  >
                    <Download className="w-4 h-4" /> Resume
                  </a>
                )}
                {socialLinks?.linkedin && (
                  <a
                    href={socialLinks.linkedin}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-2 px-4 py-2 bg-neutral-100 dark:bg-[#111] border border-neutral-200 dark:border-neutral-800 rounded-none text-sm md:text-[15px] font-bold hover:-translate-y-1 transition-transform shadow-sm"
                  >
                    <span className="font-bold text-base">in</span> LinkedIn
                  </a>
                )}
              </div>
            </div>

            <footer className="flex flex-col items-center justify-center gap-3 text-sm text-neutral-500 font-mono">
              <p className="italic tracking-tight">
                &quot;Nothing Is Perfect — But You Can Make It Better.&quot;
              </p>
            </footer>
          </section>
        </div>
      </div>
    </>
  );
}
