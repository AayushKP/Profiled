import { z } from "zod";

// Sanitize string to prevent XSS - removes script tags and dangerous patterns
const sanitizeString = (str: string) => {
  return str
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
    .replace(/javascript:/gi, "")
    .replace(/on\w+\s*=/gi, "");
};

// Sanitized string transformer
const sanitizedString = z.string().transform(sanitizeString);

export const usernameSchema = z
  .string()
  .min(3, "Username must be at least 3 characters")
  .max(20, "Username must be at most 20 characters")
  .regex(
    /^[a-z0-9-]+$/,
    "Username can only contain lowercase letters, numbers, and hyphens",
  )
  .refine(
    (val) => !val.startsWith("-") && !val.endsWith("-"),
    "Username cannot start or end with a hyphen",
  );

export const projectSchema = z.object({
  id: z.string(),
  title: sanitizedString.pipe(z.string().min(1, "Title is required")),
  description: sanitizedString.optional(),
  image: z.string().url().optional().or(z.literal("")),
  github: z.string().url().optional().or(z.literal("")),
  live: z.string().url().optional().or(z.literal("")),
  tags: z.array(sanitizedString),
  featured: z.boolean().default(false),
});

export const blogSchema = z.object({
  id: z.string(),
  title: sanitizedString.pipe(z.string().min(1, "Title is required")),
  description: sanitizedString,
  link: z.string().url("Invalid URL"),
  image: z.string().url().optional().or(z.literal("")),
  date: z.string(),
});

export const experienceSchema = z.object({
  id: z.string(),
  company: sanitizedString.pipe(z.string().min(1, "Company name is required")),
  position: sanitizedString.pipe(z.string().min(1, "Position is required")),
  duration: sanitizedString.pipe(z.string().min(1, "Duration is required")),
  description: sanitizedString.optional(),
});

export const educationSchema = z.object({
  id: z.string(),
  institution: sanitizedString.pipe(
    z.string().min(1, "Institution name is required"),
  ),
  degree: sanitizedString.pipe(z.string().min(1, "Degree is required")),
  duration: sanitizedString.pipe(z.string().min(1, "Duration is required")),
  description: sanitizedString.optional(),
});

export const socialLinksSchema = z.object({
  github: z.string().url().optional().or(z.literal("")),
  linkedin: z.string().url().optional().or(z.literal("")),
  twitter: z.string().url().optional().or(z.literal("")),
  website: z.string().url().optional().or(z.literal("")),
  email: z.string().email().optional().or(z.literal("")),
  resume: z.string().url().optional().or(z.literal("")),
});

export const portfolioSchema = z.object({
  username: usernameSchema,
  fullName: sanitizedString.pipe(z.string().min(1, "Full name is required")),
  email: z.string().email("Invalid email address"),
  profileImage: z.string().url().optional().or(z.literal("")),
  title: sanitizedString.optional(),
  tagline: sanitizedString
    .pipe(z.string().max(200, "Tagline must be less than 200 characters"))
    .optional(),
  bio: sanitizedString
    .pipe(z.string().max(2000, "Bio must be less than 2000 characters"))
    .optional(),
  skills: z.array(sanitizedString),
  projects: z.array(projectSchema),
  experience: z.array(experienceSchema),
  education: z.array(educationSchema),
  blogs: z.array(blogSchema).optional(),
  socialLinks: socialLinksSchema,
  showGithubHeatmap: z.boolean().default(true),
  theme: z.string().default("minimal"),
  isPublished: z.boolean().default(false),
});

// Partial schema for PATCH updates - all fields optional
export const portfolioUpdateSchema = portfolioSchema
  .omit({
    theme: true,
    isPublished: true,
    showGithubHeatmap: true,
  })
  .partial()
  .extend({
    theme: z.string().optional(),
    isPublished: z.boolean().optional(),
    showGithubHeatmap: z.boolean().optional(),
    // Allow partial nested updates
    socialLinks: socialLinksSchema.partial().optional(),
  });

export type Project = z.infer<typeof projectSchema>;
export type Blog = z.infer<typeof blogSchema>;
export type Experience = z.infer<typeof experienceSchema>;
export type Education = z.infer<typeof educationSchema>;
export type SocialLinks = z.infer<typeof socialLinksSchema>;
export type Portfolio = z.infer<typeof portfolioSchema>;
export type PortfolioUpdate = z.infer<typeof portfolioUpdateSchema>;

/**
 * Validate and sanitize portfolio update data
 * Returns { success: true, data } or { success: false, errors }
 */
export function validatePortfolioUpdate(data: unknown) {
  const result = portfolioUpdateSchema.safeParse(data);
  if (!result.success) {
    return {
      success: false as const,
      errors: result.error.issues.map((issue) => ({
        field: issue.path.join("."),
        message: issue.message,
      })),
    };
  }
  return { success: true as const, data: result.data };
}
