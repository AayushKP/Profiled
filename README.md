# Profiled - Build Your Portfolio in Minutes

A complete Portfolio Builder SaaS application with custom subdomains, multiple portfolio templates, AI-assisted resume import, and Cloudinary-based image uploads. Built with Next.js 16, Better Auth, PostgreSQL (Supabase), and Drizzle ORM.

## Features

- **Multiple Portfolio Templates** - Choose from Minimal, Terminal, and Luminal themes
- **Custom Subdomain** - Get yourname.profiled.site instantly
- **Easy Editing** - Update your portfolio anytime from your dashboard
- **Mobile Responsive** - Perfect on all devices
- **Google OAuth** - Quick and secure authentication
- **Auto-Save** - Your changes are saved automatically
- **Real-time Username Validation** - Check username availability instantly
- **Cloudinary Image Uploads** - Upload and update profile images directly from dashboard
- **Location Support** - Add your city/state/country in profile details
- **GitHub Activity Heatmap** - Showcase your contributions
- **Blog Section** - Share your thoughts and articles
- **Experience Timeline** - Display your work history beautifully

## Tech Stack

- **Framework**: Next.js 16 (App Router with TypeScript, React 19)
- **Database**: PostgreSQL via Supabase
- **ORM**: Drizzle ORM
- **Auth**: Better Auth v1 with Google OAuth
- **Media Storage**: Cloudinary (unsigned upload preset)
- **Styling**: Tailwind CSS v4 + Framer Motion
- **Fonts**: Playfair Display, Cormorant Garamond, Inter, Geist, Instrument Serif
- **Components**: Custom shadcn/ui-style components

## Getting Started

### Prerequisites

- Node.js 18+
- pnpm (recommended) or npm
- Supabase PostgreSQL database
- Google OAuth credentials
- Gemini API Key (for AI features)
- Cloudinary account (for profile image upload)

### Environment Variables

Create a `.env.local` file in the root directory with:

```bash
# Database (Supabase)
# Get from: Supabase Dashboard > Project Settings > Database > Connection String (URI)
# Use the transaction pooler (port 6543) for better performance in serverless environments
DATABASE_URL=postgresql://postgres.[PROJECT-REF]:[YOUR-PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres

# Better Auth
BETTER_AUTH_SECRET=your-random-32-character-secret
BETTER_AUTH_URL=http://localhost:3000

# GEMINI (for AI features)
GEMINI_API_KEY=your_gemini_api_key

# Google OAuth
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# App URLs
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_DOMAIN=localhost:3000

# Cloudinary (Profile Image Upload)
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your-cloud-name
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=your-unsigned-upload-preset
```

> You can also copy from [env.example](env.example) and fill in your values.

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/AayushKP/profiled.git
   cd profiled
   ```

2. **Install dependencies**

   ```bash
   pnpm install
   ```

3. **Set up the database**

   ```bash
   pnpm db:push
   ```

4. **Run the development server**

   ```bash
   pnpm dev
   ```

5. Open [http://localhost:3000](http://localhost:3000)

### Database Commands

| Command            | Description             |
| ------------------ | ----------------------- |
| `pnpm db:generate` | Generate migrations     |
| `pnpm db:migrate`  | Run migrations          |
| `pnpm db:push`     | Push schema to database |
| `pnpm db:studio`   | Open Drizzle Studio     |

## Contributing

We welcome contributions from the community! Here's how you can help:

### Prerequisites for Contributors

1. Fork the repository
2. Clone your fork locally
3. Set up the development environment (see [Getting Started](#getting-started))

### Development Workflow

1. **Create a new branch**

   ```bash
   git checkout -b feature/your-feature-name
   # or
   git checkout -b fix/your-bug-fix
   ```

2. **Make your changes**
   - Follow the existing code style and conventions
   - Write meaningful commit messages
   - Test your changes locally

3. **Test your changes**

   ```bash
   pnpm dev
   ```

4. **Commit your changes**

   ```bash
   git add .
   git commit -m "feat: add your feature description"
   # or
   git commit -m "fix: describe the bug fix"
   ```

5. **Push to your fork**

   ```bash
   git push origin feature/your-feature-name
   ```

6. **Create a Pull Request**
   - Go to the original repository
   - Click "New Pull Request"
   - Select your branch and describe your changes

### Commit Message Convention

We follow [Conventional Commits](https://www.conventionalcommits.org/):

- `feat:` - New feature
- `fix:` - Bug fix
- `docs:` - Documentation changes
- `style:` - Code style changes (formatting, etc.)
- `refactor:` - Code refactoring
- `test:` - Adding or updating tests
- `chore:` - Maintenance tasks

### Code Style Guidelines

- Use TypeScript for all new code
- Follow the existing component patterns
- Use Tailwind CSS for styling
- Keep components small and focused
- Add proper TypeScript types

### Areas for Contribution

- New portfolio templates
- UI/UX improvements
- Bug fixes
- Documentation improvements
- Performance optimizations
- Accessibility improvements
- New features (please open an issue first to discuss)

### Current Built-in Templates

- **Minimal** — Clean, typography-focused style
- **Terminal** — Command-line inspired developer aesthetic
- **Luminal** — Sleek modern dual-mode style

Template preview routes:

- `/preview/minimal`
- `/preview/terminal`
- `/preview/luminal`

### Contributing a New Template

Want to create a new portfolio template? Follow these steps:

#### 1. Create Your Template File

Create a new file in `src/components/portfolio/templates/`:

```bash
src/components/portfolio/templates/your-template-name.tsx
```

#### 2. Template Structure

Your template should follow this structure:

```tsx
"use client";

import React from "react";
import type { Portfolio } from "@/db/schema";

interface PortfolioTemplateProps {
  portfolio: Partial<Portfolio>;
  isPreview?: boolean;
  isLoggedIn?: boolean;
}

export function YourTemplateName({
  portfolio,
  isPreview = false,
  isLoggedIn = false,
}: PortfolioTemplateProps) {
  // Destructure portfolio data with defaults
  const {
    fullName = "Your Name",
    title = "Your Title",
    location,
    bio,
    tagline,
    skills,
    projects,
    experience,
    education,
    socialLinks,
    profileImage,
    blogs,
    showGithubHeatmap,
  } = portfolio;

  return (
    <div className="min-h-screen">
      {/* Your template design here */}

      {/* Preview/Edit button for preview mode */}
      {isPreview && (
        <div className="fixed bottom-6 right-6 z-50">
          <Link href={isLoggedIn ? "/dashboard" : "/"}>
            <button className="...">
              {isLoggedIn ? "Edit Portfolio" : "Create Your Own"}
            </button>
          </Link>
        </div>
      )}
    </div>
  );
}
```

#### 3. Register Your Template

Add your template to `src/components/portfolio/templates/index.ts`:

```tsx
import { YourTemplateName } from "./your-template-name";

export const PORTFOLIO_TEMPLATES: TemplateConfig[] = [
  // ... existing templates
  {
    id: "your-template-id",
    name: "Your Template Name",
    description: "A brief description of your template style.",
    component: YourTemplateName,
    thumbnailColor: "#YOUR_COLOR", // Background color for thumbnail
  },
];
```

#### 4. Template Guidelines

Your template should include:

- [ ] **Core Sections** - Hero, Skills, Projects, Experience, Contact (minimum)
- [ ] **Responsive Design** - Works on mobile, tablet, and desktop
- [ ] **Preview Mode** - Shows "Edit Portfolio" or "Create Your Own" button when `isPreview` is true
- [ ] **TypeScript** - Properly typed components

**Optional but recommended:**

- Animations using Framer Motion
- Accessibility improvements (semantic HTML, ARIA labels)
- Additional sections like Education, Blogs, About

> **Note:** Templates can be any style - light mode, dark mode, colorful, minimal, etc. Be creative!

#### 5. Available Portfolio Data

Your template receives this data from the `portfolio` prop:

| Field               | Type           | Description                      |
| ------------------- | -------------- | -------------------------------- |
| `fullName`          | `string`       | User's full name                 |
| `title`             | `string`       | Professional title               |
| `location`          | `string`       | City/State/Country               |
| `tagline`           | `string`       | Short tagline                    |
| `bio`               | `string`       | About section text               |
| `profileImage`      | `string`       | Profile image URL                |
| `skills`            | `string[]`     | List of skills                   |
| `projects`          | `Project[]`    | Array of projects                |
| `experience`        | `Experience[]` | Work experience                  |
| `education`         | `Education[]`  | Education history                |
| `blogs`             | `Blog[]`       | Blog posts                       |
| `socialLinks`       | `object`       | Social media links               |
| `showGithubHeatmap` | `boolean`      | Toggle GitHub contribution graph |

#### 6. Testing Your Template

1. Run the dev server: `pnpm dev`
2. Create a test portfolio in the dashboard
3. Test all sections with real data
4. Test on different screen sizes
5. Verify all animations work smoothly

### Viewing Published Portfolios Locally

Since browsers don't resolve wildcard subdomains for `localhost`, you can view portfolios locally using the direct path:

```
http://localhost:3000/portfolio/your-username
```

#### 7. Submit Your Template

1. Create a branch: `git checkout -b template/your-template-name`
2. Add screenshots to your PR description
3. Describe the design inspiration and target audience

## Project Structure

```
src/
├── app/
│   ├── api/
│   │   ├── auth/[...all]/        # Better Auth routes
│   │   ├── check-username/       # Username availability check
│   │   ├── fetch-metadata/       # Extract OG metadata from links
│   │   ├── portfolio/            # Portfolio CRUD operations
│   │   ├── portfolio/publish/    # Publish/unpublish portfolio
│   │   └── resume/analyze/       # AI resume parser (PDF -> portfolio JSON)
│   ├── dashboard/                # Portfolio editor dashboard
│   │   └── preview/              # Dashboard preview
│   ├── portfolio/[username]/     # Public portfolio pages
│   └── preview/                  # Landing page portfolio preview
├── components/
│   ├── aceternity/               # Animated UI components
│   ├── auth/                     # Authentication components
│   ├── dashboard/                # Dashboard components
│   │   └── forms/                # Dashboard form components
│   ├── landing/                  # Landing page sections
│   ├── portfolio/                # Portfolio components
│   │   └── templates/            # Portfolio templates
│   └── ui/                       # Base UI components (shadcn-style)
├── db/
│   ├── index.ts                  # Database connection
│   └── schema.ts                 # Drizzle schema definitions
├── hooks/                        # Custom React hooks
└── lib/
    ├── auth.ts                   # Better Auth configuration
    ├── auth-client.ts            # Auth client utilities
    ├── utils.ts                  # Utility functions
    └── validations.ts            # Zod validation schemas
```

## Support

If you encounter any issues or have questions:

1. Check the [existing issues](https://github.com/AayushKP/profiled/issues)
2. Open a new issue with a clear description
3. Include steps to reproduce (for bugs)

Built with love by [Aayush](https://github.com/AayushKP)
