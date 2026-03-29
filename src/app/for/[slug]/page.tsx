import { Metadata } from "next";
import { notFound } from "next/navigation";
import { Navbar } from "@/components/landing/navbar";
import { Footer } from "@/components/landing/footer";
import { CTA } from "@/components/landing/cta";
import { Features } from "@/components/landing/features";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, CircleCheck } from "lucide-react";

// PSEO Data: Roles to target
const ROLES = {
  "software-engineers": {
    title: "The Best Portfolio Builder for Software Engineers",
    description:
      "Showcase your GitHub projects, technical stack, and coding experience with a clean, dark-mode portfolio designed for developers.",
    keywords: [
      "Software Engineer Portfolio",
      "Developer Portfolio",
      "Coding Projects",
      "GitHub Portfolio",
    ],
    features: [
      "GitHub Integration",
      "Code Snippet Highlighting",
      "Tech Stack Icons",
    ],
  },
  "product-managers": {
    title: "Build a PM Portfolio That Gets You Hired",
    description:
      "Highlight your case studies, product roadmaps, and strategic thinking. A minimalist portfolio that puts your product work front and center.",
    keywords: [
      "Product Manager Portfolio",
      "PM Case Studies",
      "Product Portfolio Builder",
    ],
    features: ["Case Study Layouts", "Timeline View", "SaaS Metrics Display"],
  },
  designers: {
    title: "Minimalist Portfolio for UX/UI Designers",
    description:
      "Let your work speak for itself. A distraction-free, retina-ready portfolio builder that emphasizes your visuals and design process.",
    keywords: ["UX Portfolio", "Design Portfolio", "UI Case Studies"],
    features: ["High-Res Image Support", "Grid Layouts", "Figma Embeds"],
  },
  students: {
    title: "Stand Out with a Student Portfolio",
    description:
      "Land your first internship or job. Build a professional portfolio in minutes, even with no prior experience. Better than a PDF resume.",
    keywords: ["Student Portfolio", "Internship Resume", "Grad Portfolio"],
    features: ["Resume Import", "Education Timeline", "Project Showcase"],
  },
  "content-creators": {
    title: "A Home for Your Content",
    description:
      "Aggregate your videos, blogs, and social links in one premium space. Replace your Linktree with a professional portfolio site.",
    keywords: ["Creator Portfolio", "Content Aggregator", "Social Media Kit"],
    features: ["Video Embeds", "Newsletter Integration", "Social Feed"],
  },
};

type RoleSlug = keyof typeof ROLES;

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const role = ROLES[slug as RoleSlug];

  if (!role) {
    return {
      title: "Portfolio Builder for Professionals",
      description: "Build a stunning portfolio for your career.",
    };
  }

  return {
    title: `${role.title} | Profiled`,
    description: role.description,
    keywords: [...role.keywords, "Portfolio Builder", "Profiled"],
    openGraph: {
      title: role.title,
      description: role.description,
      type: "website",
      url: `https://profiled.site/for/${slug}`,
    },
  };
}

export async function generateStaticParams() {
  return Object.keys(ROLES).map((slug) => ({
    slug,
  }));
}

export default async function RolePage({ params }: Props) {
  const { slug } = await params;
  const role = ROLES[slug as RoleSlug];

  if (!role) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-[#050505] w-full relative flex flex-col overflow-x-hidden text-neutral-200">
      <Navbar />

      {/* Hero Section specific to role */}
      <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:50px_50px]" />
        <div className="absolute h-full w-full bg-[#050505] [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]" />

        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight bg-gradient-to-b from-white via-white/90 to-white/70 bg-clip-text text-transparent mb-6">
            {role.title}
          </h1>
          <p className="text-lg md:text-xl text-neutral-400 mb-10 max-w-2xl mx-auto leading-relaxed">
            {role.description}
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/dashboard">
              <Button
                size="lg"
                className="h-12 px-8 rounded-full bg-white text-black hover:bg-neutral-200 font-medium text-base transition-all hover:scale-105 active:scale-95"
              >
                Build Your Portfolio
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Role specific benefits */}
      <section className="py-24 bg-neutral-900/30 border-y border-white/5">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-white mb-4">
              Why Profiled for{" "}
              {slug.replace("-", " ").replace(/\b\w/g, (l) => l.toUpperCase())}?
            </h2>
            <p className="text-neutral-400">
              Tailored features to help you stand out.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {role.features.map((feature, i) => (
              <div
                key={i}
                className="p-8 rounded-2xl bg-[#0A0A0A] border border-white/10 hover:border-white/20 transition-colors"
              >
                <div className="h-12 w-12 rounded-full bg-white/5 flex items-center justify-center mb-6">
                  <CircleCheck className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">
                  {feature}
                </h3>
                <p className="text-neutral-400">
                  Optimized specifically for your needs as a{" "}
                  {slug.replace("-", " ")}.
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Reuse generic features */}
      <Features />

      <CTA />
      <Footer />
    </main>
  );
}
