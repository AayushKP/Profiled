import { Portfolio } from "@/db/schema";

export type SectionCompletion = {
  id: string;
  isComplete: boolean;
};

export const calculatePortfolioCompletion = (
  portfolio: Partial<Portfolio> | null,
) => {
  if (!portfolio) return { score: 0, completedSections: [] };

  const sections = [
    {
      id: "basic",
      weight: 20,
      isComplete: !!(
        portfolio.fullName &&
        portfolio.title &&
        portfolio.username
      ),
    },
    {
      id: "about",
      weight: 15,
      isComplete: !!(portfolio.bio && portfolio.bio.length > 20),
    },
    {
      id: "skills",
      weight: 15,
      isComplete: !!(portfolio.skills && portfolio.skills.length > 0),
    },
    {
      id: "projects",
      weight: 20,
      isComplete: !!(portfolio.projects && portfolio.projects.length > 0),
    },
    {
      id: "experience",
      weight: 10,
      isComplete: !!(portfolio.experience && portfolio.experience.length > 0),
    },
    {
      id: "education",
      weight: 5,
      isComplete: !!(portfolio.education && portfolio.education.length > 0),
    },
    {
      id: "social",
      weight: 15,
      isComplete: !!(
        portfolio.socialLinks &&
        (portfolio.socialLinks.email ||
          portfolio.socialLinks.linkedin ||
          portfolio.socialLinks.github)
      ),
    },
  ];

  const score = sections.reduce(
    (acc, section) => (section.isComplete ? acc + section.weight : acc),
    0,
  );
  const completedSections = sections
    .filter((s) => s.isComplete)
    .map((s) => s.id);

  return { score, completedSections };
};

export const getBuilderRank = (score: number) => {
  if (score < 20) return "Novice";
  if (score < 40) return "Apprentice";
  if (score < 60) return "Builder";
  if (score < 80) return "Pro";
  if (score < 100) return "Master";
  return "Legend";
};
