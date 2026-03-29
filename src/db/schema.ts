import {
  pgTable,
  text,
  timestamp,
  boolean,
  json,
  serial,
} from "drizzle-orm/pg-core";

// Better Auth tables
export const user = pgTable("user", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: boolean("email_verified").notNull().default(false),
  image: text("image"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const session = pgTable("session", {
  id: text("id").primaryKey(),
  expiresAt: timestamp("expires_at").notNull(),
  token: text("token").notNull().unique(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
});

export const account = pgTable("account", {
  id: text("id").primaryKey(),
  accountId: text("account_id").notNull(),
  providerId: text("provider_id").notNull(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  accessToken: text("access_token"),
  refreshToken: text("refresh_token"),
  idToken: text("id_token"),
  accessTokenExpiresAt: timestamp("access_token_expires_at"),
  refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
  scope: text("scope"),
  password: text("password"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const verification = pgTable("verification", {
  id: text("id").primaryKey(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Portfolio table
export interface ProjectData {
  id: string;
  title: string;
  description?: string;
  image?: string;
  github?: string;
  live?: string;
  tags: string[];
  featured: boolean;
}

export interface ExperienceData {
  id: string;
  company: string;
  position: string;
  duration: string;
  description?: string;
}

export interface EducationData {
  id: string;
  institution: string;
  degree: string;
  duration: string;
  description?: string;
}

export interface BlogData {
  id: string;
  title: string;
  description: string;
  link: string;
  image?: string;
  date: string;
}

export interface SocialLinksData {
  github?: string;
  linkedin?: string;
  twitter?: string;
  website?: string;
  email?: string;
  resume?: string;
}

export const portfolio = pgTable("portfolio", {
  id: serial("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .unique()
    .references(() => user.id, { onDelete: "cascade" }),
  username: text("username").notNull().unique(),
  fullName: text("full_name").notNull(),
  email: text("email").notNull(),
  profileImage: text("profile_image"),
  title: text("title"),
  tagline: text("tagline"),
  bio: text("bio"),
  skills: json("skills").$type<string[]>().default([]),
  projects: json("projects").$type<ProjectData[]>().default([]),
  experience: json("experience").$type<ExperienceData[]>().default([]),
  education: json("education").$type<EducationData[]>().default([]),
  blogs: json("blogs").$type<BlogData[]>().default([]),
  socialLinks: json("social_links").$type<SocialLinksData>().default({}),
  showGithubHeatmap: boolean("show_github_heatmap").default(true),
  theme: text("theme").default("minimal"),
  isPublished: boolean("is_published").default(false),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export type User = typeof user.$inferSelect;
export type NewUser = typeof user.$inferInsert;
export type Portfolio = typeof portfolio.$inferSelect;
export type NewPortfolio = typeof portfolio.$inferInsert;
