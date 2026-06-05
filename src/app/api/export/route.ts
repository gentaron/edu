import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { ALL_ENTRIES } from "@/domains/wiki/wiki.data";
import type { Category } from "@/types";

const ExportQuerySchema = z.object({
  format: z.enum(["pdf", "html", "markdown"]),
  category: z
    .enum(["characters", "orgs", "geography", "tech", "terms", "history", "all"])
    .default("all"),
});

const CATEGORY_MAP: Record<string, Category> = {
  characters: "キャラクター",
  orgs: "組織",
  geography: "地理",
  tech: "技術",
  terms: "用語",
  history: "歴史",
};

const CATEGORY_LABEL_EN: Record<Category, string> = {
  キャラクター: "Characters",
  組織: "Organizations",
  地理: "Geography",
  技術: "Technology",
  用語: "Terms",
  歴史: "History",
};

/** GET /api/export?format=html&category=characters */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const parsed = ExportQuerySchema.safeParse(
    Object.fromEntries(searchParams)
  );

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid query parameters", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const { format, category } = parsed.data;

  let entries = [...ALL_ENTRIES];
  if (category !== "all") {
    const mapped = CATEGORY_MAP[category];
    if (mapped) {
      entries = entries.filter((entry) => entry.category === mapped);
    }
  }

  // Generate markdown content
  const title =
    category === "all"
      ? "E16百科事典 完全版"
      : `E16百科事典 — ${CATEGORY_MAP[category] ?? category}`;
  const markdown = generateWikiMarkdown(title, entries);

  if (format === "markdown") {
    return new NextResponse(markdown, {
      headers: {
        "Content-Type": "text/markdown; charset=utf-8",
        "Content-Disposition": `attachment; filename="edu-wiki-${category}.md"`,
      },
    });
  }

  // Convert markdown to HTML using our simple converter
  const htmlBody = simpleMarkdownToHtml(markdown);
  const fullHtml = wrapInHtmlTemplate(title, htmlBody);

  if (format === "html") {
    return new NextResponse(fullHtml, {
      headers: {
        "Content-Type": "text/html; charset=utf-8",
        "Content-Disposition": `attachment; filename="edu-wiki-${category}.html"`,
      },
    });
  }

  // PDF: Return HTML with print-friendly CSS (client-side window.print() for actual PDF)
  const printHtml = wrapInPrintTemplate(title, htmlBody);
  return new NextResponse(printHtml, {
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "Content-Disposition": `attachment; filename="edu-wiki-${category}.pdf.html"`,
    },
  });
}

function generateWikiMarkdown(
  title: string,
  entries: ReadonlyArray<{
    id: string;
    name: string;
    nameEn?: string;
    description: string;
    descriptionEn?: string;
    category: Category;
  }>
): string {
  const lines: string[] = [
    `# ${title}`,
    "",
    `生成日時: ${new Date().toISOString().split("T")[0]}`,
    `項目数: ${entries.length}`,
    "",
  ];

  let currentCategory = "";
  for (const entry of entries) {
    if (entry.category !== currentCategory) {
      currentCategory = entry.category;
      lines.push(
        `## ${currentCategory}`,
        ""
      );
    }
    const displayName = entry.nameEn
      ? `${entry.name} (${entry.nameEn})`
      : entry.name;
    const displayDesc = entry.descriptionEn
      ? `${entry.description}\n\n${entry.descriptionEn}`
      : entry.description;
    lines.push(`### ${displayName}`, "", displayDesc || "（説明なし）", "");
  }

  return lines.join("\n");
}

/** Simple markdown to HTML converter for the subset of markdown we generate */
function simpleMarkdownToHtml(markdown: string): string {
  const lines = markdown.split("\n");
  const result: string[] = [];

  for (const line of lines) {
    if (line.startsWith("### ")) {
      result.push(`<h3>${escapeHtml(line.slice(4))}</h3>`);
    } else if (line.startsWith("## ")) {
      result.push(`<h2>${escapeHtml(line.slice(3))}</h2>`);
    } else if (line.startsWith("# ")) {
      result.push(`<h1>${escapeHtml(line.slice(2))}</h1>`);
    } else if (line.trim() === "") {
      // Skip empty lines (HTML handles whitespace)
    } else {
      result.push(`<p>${escapeHtml(line)}</p>`);
    }
  }

  return result.join("\n");
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function wrapInHtmlTemplate(title: string, body: string): string {
  return `<!DOCTYPE html>
<html lang="ja">
<head>
<meta charset="utf-8">
<title>${escapeHtml(title)}</title>
<style>
  body { font-family: "Noto Sans JP", sans-serif; max-width: 800px; margin: 0 auto; padding: 2rem; color: #e2e8f0; background: #06080f; }
  h1 { color: #c8a44e; border-bottom: 2px solid #1e2a52; padding-bottom: 0.5rem; }
  h2 { color: #818cf8; margin-top: 2rem; }
  h3 { color: #22d3ee; }
  a { color: #c8a44e; }
</style>
</head>
<body>${body}</body>
</html>`;
}

function wrapInPrintTemplate(title: string, body: string): string {
  return `<!DOCTYPE html>
<html lang="ja">
<head>
<meta charset="utf-8">
<title>${escapeHtml(title)}</title>
<style>
  body { font-family: "Noto Sans JP", sans-serif; max-width: 800px; margin: 0 auto; padding: 2rem; color: #e2e8f0; background: #06080f; }
  h1 { color: #c8a44e; border-bottom: 2px solid #1e2a52; padding-bottom: 0.5rem; }
  h2 { color: #818cf8; margin-top: 2rem; }
  h3 { color: #22d3ee; }
  a { color: #c8a44e; }
  @media print {
    body { background: white; color: #1a1a2e; }
    h1 { color: #1a1a2e; border-color: #ddd; }
    h2 { color: #333; }
    h3 { color: #555; }
    @page { margin: 2cm; }
  }
</style>
</head>
<body>${body}</body>
</html>`;
}
