import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { remark } from 'remark';
import html from 'remark-html';

const blogsDirectory = path.join(process.cwd(), 'content', 'blogs');

export interface BlogPost {
  slug: string;
  title: string;
  date: string;
  excerpt: string;
  content: string;
  htmlContent?: string;
}

/**
 * Sanitize a slug to prevent path traversal attacks.
 * Only allows alphanumeric characters, hyphens, and underscores.
 */
function sanitizeSlug(slug: string): string {
  return slug.replace(/[^a-zA-Z0-9_-]/g, '');
}

export function getBlogPosts(): BlogPost[] {
  if (!fs.existsSync(blogsDirectory)) {
    return [];
  }
  const fileNames = fs.readdirSync(blogsDirectory);
  const allPostsData = fileNames
    .filter((fileName) => fileName.endsWith('.md'))
    .map((fileName) => {
      const slug = fileName.replace(/\.md$/, '');
      const fullPath = path.join(blogsDirectory, fileName);
      const fileContents = fs.readFileSync(fullPath, 'utf8');
      const matterResult = matter(fileContents);

      return {
        slug,
        title: matterResult.data.title || 'Untitled',
        date: matterResult.data.date || new Date().toISOString(),
        excerpt: matterResult.data.excerpt || '',
        content: matterResult.content,
      };
    });

  return allPostsData.sort((a, b) => {
    if (new Date(a.date) < new Date(b.date)) {
      return 1;
    } else {
      return -1;
    }
  });
}

export async function getBlogPostBySlug(slug: string): Promise<BlogPost | null> {
  // Sanitize slug to prevent path traversal (e.g. ../../etc/passwd)
  const safeSlug = sanitizeSlug(slug);
  if (!safeSlug || safeSlug !== slug) return null;

  const fullPath = path.join(blogsDirectory, `${safeSlug}.md`);

  // Double-check the resolved path is still within the blogs directory
  const resolvedPath = path.resolve(fullPath);
  if (!resolvedPath.startsWith(path.resolve(blogsDirectory))) return null;

  if (!fs.existsSync(fullPath)) return null;

  const fileContents = fs.readFileSync(fullPath, 'utf8');
  const matterResult = matter(fileContents);

  // sanitize: true prevents XSS from AI-generated or user-supplied markdown
  const processedContent = await remark()
    .use(html, { sanitize: true })
    .process(matterResult.content);
  const htmlContent = processedContent.toString();

  return {
    slug: safeSlug,
    title: matterResult.data.title || 'Untitled',
    date: matterResult.data.date || new Date().toISOString(),
    excerpt: matterResult.data.excerpt || '',
    content: matterResult.content,
    htmlContent,
  };
}

