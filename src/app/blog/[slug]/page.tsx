import { getBlogPostBySlug, getBlogPosts } from '@/lib/blogs';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Clock, Bot } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ShareButtons } from '@/components/share-buttons';
import { TableOfContents } from '@/components/table-of-contents';
import { GiscusComments } from '@/components/giscus-comments';
import type { Metadata } from 'next';
import profile from '../../../../content/profile.json';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://aibv2.vercel.app';

export async function generateStaticParams() {
    const posts = getBlogPosts();
    return posts.map((post) => ({
        slug: post.slug,
    }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
    const { slug } = await params;
    const post = await getBlogPostBySlug(slug);
    if (!post) return {};

    return {
        title: `${post.title} | ${profile.name}`,
        description: post.excerpt,
        openGraph: {
            title: post.title,
            description: post.excerpt,
            type: 'article',
            publishedTime: post.date,
            url: `${SITE_URL}/blog/${post.slug}`,
            siteName: `${profile.name}'s Blog`,
            tags: post.tags,
        },
        twitter: {
            card: 'summary_large_image',
            title: post.title,
            description: post.excerpt,
        },
    };
}

export default async function BlogPost({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const post = await getBlogPostBySlug(slug);

    if (!post) {
        notFound();
    }

    // Add IDs to headings for TOC linking
    const htmlWithIds = (post.htmlContent || '').replace(
        /<(h[2-3])>(.*?)<\/h[2-3]>/g,
        (_, tag, text) => {
            const id = text.toLowerCase().replace(/<[^>]*>/g, '').replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
            return `<${tag} id="${id}">${text}</${tag}>`;
        }
    );

    return (
        <main className="min-h-screen px-6 py-12 md:py-24">
            <article className="max-w-3xl mx-auto space-y-8">
                <div>
                    <Button asChild variant="ghost" className="mb-8 -ml-4 text-muted-foreground hover:text-foreground">
                        <Link href="/blog"><ArrowLeft className="w-4 h-4 mr-2" /> Back to blog</Link>
                    </Button>

                    <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">{post.title}</h1>

                    <div className="flex flex-wrap items-center gap-4 text-muted-foreground mb-4">
                        <time>
                            {new Date(post.date).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                            })}
                        </time>
                        <div className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            <span>{post.readingTime} min read</span>
                        </div>
                        {post.aiModel && (
                            <div className="flex items-center gap-1">
                                <Bot className="h-4 w-4" />
                                <span className="text-xs">Written by {post.aiModel}</span>
                            </div>
                        )}
                    </div>

                    <div className="flex flex-wrap gap-2 mb-4">
                        {post.tags.map((tag) => (
                            <Link key={tag} href={`/tags/${encodeURIComponent(tag)}`}>
                                <Badge variant="secondary" className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors">
                                    {tag}
                                </Badge>
                            </Link>
                        ))}
                    </div>

                    <ShareButtons title={post.title} slug={post.slug} />
                </div>

                <div
                    className="prose prose-neutral dark:prose-invert max-w-none 
            prose-headings:font-bold prose-a:text-blue-500 dark:prose-a:text-blue-400
            prose-img:rounded-lg prose-pre:bg-muted prose-pre:border prose-pre:border-border"
                    dangerouslySetInnerHTML={{ __html: htmlWithIds }}
                />

                <div className="pt-8 border-t border-border">
                    <ShareButtons title={post.title} slug={post.slug} />
                </div>

                <GiscusComments
                    repo="your-username/your-repo"
                    repoId=""
                    category="Blog Comments"
                    categoryId=""
                />
            </article>

            <TableOfContents htmlContent={post.htmlContent || ''} />
        </main>
    );
}
