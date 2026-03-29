import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
// eslint-disable-next-line @typescript-eslint/no-require-imports
const pdfParse = require("pdf-parse");

// Force Node.js runtime
export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    if (file.type !== "application/pdf") {
      return NextResponse.json(
        { error: "Only PDF files are supported" },
        { status: 400 },
      );
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "GEMINI_API_KEY is not configured" },
        { status: 500 },
      );
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    let textContent = "";
    try {
      const data = await pdfParse(buffer);
      textContent = data.text;
    } catch (parseError: any) {
      console.error("PDF Parsing Failed:", parseError);
      return NextResponse.json(
        {
          error: "Failed to read PDF file.",
          details: parseError?.message || String(parseError),
        },
        { status: 500 },
      );
    }

    if (!textContent.trim()) {
      return NextResponse.json(
        { error: "Could not extract text from the provided PDF" },
        { status: 400 },
      );
    }

    // Initialize Gemini (Use Flash for speed)
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
      generationConfig: { responseMimeType: "application/json" },
    });

    // Optimize text: Remove excessive whitespace to reduce token usage & latency
    const cleanText = textContent.replace(/\s+/g, " ").slice(0, 20000); // Limit context window for speed

    const prompt = `
      Extract developer portfolio data from this resume text.
      RESUME: "${cleanText}"
      
      Output JSON matching this schema:
      {
        "fullName": "string",
        "email": "string",
        "location": "string (Extract City/State/Country. Return empty if none)",
        "title": "string",
        "tagline": "string (max 100 chars)",
        "bio": "string (STRICTLY approx 20-25 words)",
        "skills": ["string"],
        "experience": [{ "id": "random_id", "company": "string", "position": "string", "duration": "string", "description": "string" }],
        "education": [{ "id": "random_id", "institution": "string", "degree": "string", "duration": "string", "description": "string" }],
        "projects": [{ "id": "random_id", "title": "string", "description": "string", "tags": ["string"], "featured": false, "live": "url", "github": "url" }],
        "socialLinks": { 
          "github": "url", 
          "linkedin": "url", 
          "twitter": "url", 
          "website": "url", 
          "email": "email" 
        }
      }
      
      Rules:
      1. Flatten 'skills' array.
      2. ***CRITICAL: SOCIAL LINKS DETECTION***
         - Look for **LinkedIn** specifically matching "linkedin.com/in/..." at the top/header.
         - Look for **GitHub** profile (usually "github.com/username") at the top/header. distinguish from project repos.
         - Look for **Portfolio/Website** (often just a domain like "name.com" or "name.vercel.app").
      3. For 'socialLinks', if a URL is found without 'https://', prepend it.
      4. Use empty strings "" for missing fields.
      5. **BIO RULES**: STRICTLY MAX 25 WORDS. Use FIRST PERSON. Extract ONLY facts present in text. DO NOT generate/invent adjectives or fluff.
      6. DESCRIPTION RULES: Use FIRST PERSON. Mirror resume text closely.
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    try {
      const json = JSON.parse(text);
      return NextResponse.json({ data: json });
    } catch (e) {
      console.error("JSON Parse Error:", e);
      return NextResponse.json(
        { error: "Failed to parse AI response" },
        { status: 500 },
      );
    }
  } catch (error) {
    console.error("Resume Analysis Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
