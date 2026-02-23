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
  tags: string[];
  readingTime: number;
  aiModel?: string;
}

function sanitizeSlug(slug: string): string {
  return slug.replace(/[^a-zA-Z0-9_-]/g, '');
}

function calculateReadingTime(text: string): number {
  const wordsPerMinute = 200;
  const words = text.trim().split(/\s+/).length;
  return Math.max(1, Math.ceil(words / wordsPerMinute));
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

      const tags: string[] = Array.isArray(matterResult.data.tags)
        ? matterResult.data.tags
        : typeof matterResult.data.tags === 'string'
          ? matterResult.data.tags.split(',').map((t: string) => t.trim())
          : [];

      return {
        slug,
        title: matterResult.data.title || 'Untitled',
        date: matterResult.data.date || new Date().toISOString(),
        excerpt: matterResult.data.excerpt || '',
        content: matterResult.content,
        tags,
        readingTime: calculateReadingTime(matterResult.content),
        aiModel: matterResult.data.aiModel || undefined,
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

export function getAllTags(): { tag: string; count: number }[] {
  const posts = getBlogPosts();
  const tagMap: Record<string, number> = {};
  posts.forEach((post) => {
    post.tags.forEach((tag) => {
      tagMap[tag] = (tagMap[tag] || 0) + 1;
    });
  });
  return Object.entries(tagMap)
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => b.count - a.count);
}

export async function getBlogPostBySlug(slug: string): Promise<BlogPost | null> {
  const safeSlug = sanitizeSlug(slug);
  if (!safeSlug || safeSlug !== slug) return null;

  const fullPath = path.join(blogsDirectory, `${safeSlug}.md`);
  const resolvedPath = path.resolve(fullPath);
  if (!resolvedPath.startsWith(path.resolve(blogsDirectory))) return null;
  if (!fs.existsSync(fullPath)) return null;

  const fileContents = fs.readFileSync(fullPath, 'utf8');
  const matterResult = matter(fileContents);

  const processedContent = await remark()
    .use(html, { sanitize: true })
    .process(matterResult.content);
  const htmlContent = processedContent.toString();

  const tags: string[] = Array.isArray(matterResult.data.tags)
    ? matterResult.data.tags
    : typeof matterResult.data.tags === 'string'
      ? matterResult.data.tags.split(',').map((t: string) => t.trim())
      : [];

  return {
    slug: safeSlug,
    title: matterResult.data.title || 'Untitled',
    date: matterResult.data.date || new Date().toISOString(),
    excerpt: matterResult.data.excerpt || '',
    content: matterResult.content,
    htmlContent,
    tags,
    readingTime: calculateReadingTime(matterResult.content),
    aiModel: matterResult.data.aiModel || undefined,
  };
}
