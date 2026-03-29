import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { db, portfolio } from "@/db";
import { eq } from "drizzle-orm";

export async function GET() {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const portfolioData = await db
      .select()
      .from(portfolio)
      .where(eq(portfolio.userId, session.user.id))
      .limit(1);

    if (portfolioData.length === 0) {
      return NextResponse.json({ portfolio: null }, { status: 200 });
    }

    return NextResponse.json({ portfolio: portfolioData[0] }, { status: 200 });
  } catch (error) {
    console.error("Error fetching portfolio:", error);
    return NextResponse.json(
      { error: "Failed to fetch portfolio" },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if portfolio already exists
    const existing = await db
      .select({ id: portfolio.id })
      .from(portfolio)
      .where(eq(portfolio.userId, session.user.id))
      .limit(1);

    if (existing.length > 0) {
      return NextResponse.json(
        { error: "Portfolio already exists" },
        { status: 400 },
      );
    }

    // Generate a unique username from email
    const baseUsername = session.user.email
      .split("@")[0]
      .toLowerCase()
      .replace(/[^a-z0-9]/g, "")
      .slice(0, 15);

    let username = baseUsername;
    let counter = 1;

    // Reserved usernames list
    const reservedUsernames = [
      "admin",
      "api",
      "www",
      "app",
      "dashboard",
      "login",
      "signup",
      "auth",
      "preview",
      "settings",
      "support",
      "help",
      "blog",
      "about",
      "contact",
      "terms",
      "privacy",
      "portfolio",
      "user",
      "users",
      "profile",
      "profiles",
      "account",
      "accounts",
    ];

    // Check for uniqueness and append number if needed
    while (true) {
      if (reservedUsernames.includes(username)) {
        username = `${baseUsername}${counter}`;
        counter++;
        continue;
      }

      const existingUsername = await db
        .select({ id: portfolio.id })
        .from(portfolio)
        .where(eq(portfolio.username, username))
        .limit(1);

      if (existingUsername.length === 0) break;
      username = `${baseUsername}${counter}`;
      counter++;
    }

    // Create new portfolio
    const newPortfolio = await db
      .insert(portfolio)
      .values({
        userId: session.user.id,
        username,
        fullName: session.user.name || "",
        email: session.user.email,
        profileImage: undefined,
        skills: [],
        projects: [],
        experience: [],
        education: [],
        socialLinks: {},
        isPublished: false,
      })
      .returning();

    return NextResponse.json({ portfolio: newPortfolio[0] }, { status: 201 });
  } catch (error) {
    console.error("Error creating portfolio:", error);
    return NextResponse.json(
      { error: "Failed to create portfolio" },
      { status: 500 },
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const rawData = await request.json();

    // Remove fields that shouldn't be updated directly
    delete rawData.id;
    delete rawData.userId;
    delete rawData.createdAt;
    delete rawData.email; // Email should not be changed

    // Validate and sanitize input
    const { validatePortfolioUpdate } = await import("@/lib/validations");
    const validation = validatePortfolioUpdate(rawData);

    if (!validation.success) {
      return NextResponse.json(
        { error: "Validation failed", errors: validation.errors },
        { status: 400 },
      );
    }

    // Server-side uniqueness check if username is being changed
    if (validation.data.username) {
      const normalizedUsername = validation.data.username.toLowerCase().trim();

      const { and, eq, ne } = await import("drizzle-orm");
      const existing = await db
        .select({ id: portfolio.id })
        .from(portfolio)
        .where(
          and(
            eq(portfolio.username, normalizedUsername),
            ne(portfolio.userId, session.user.id),
          ),
        )
        .limit(1);

      if (existing.length > 0) {
        return NextResponse.json(
          { error: "Username is already taken" },
          { status: 400 },
        );
      }

      // Update the data with normalized username
      validation.data.username = normalizedUsername;
    }

    // Update the portfolio with validated data
    const updatedPortfolio = await db
      .update(portfolio)
      .set({
        ...validation.data,
        updatedAt: new Date(),
      })
      .where(eq(portfolio.userId, session.user.id))
      .returning();

    if (updatedPortfolio.length === 0) {
      return NextResponse.json(
        { error: "Portfolio not found" },
        { status: 404 },
      );
    }

    return NextResponse.json(
      { portfolio: updatedPortfolio[0] },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error updating portfolio:", error);
    return NextResponse.json(
      { error: "Failed to update portfolio" },
      { status: 500 },
    );
  }
}

export async function DELETE() {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await db.delete(portfolio).where(eq(portfolio.userId, session.user.id));

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("Error deleting portfolio:", error);
    return NextResponse.json(
      { error: "Failed to delete portfolio" },
      { status: 500 },
    );
  }
}
