import { getBlogPostBySlug, getBlogPosts } from '@/lib/blogs';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

export async function generateStaticParams() {
    const posts = getBlogPosts();
    return posts.map((post) => ({
        slug: post.slug,
    }));
}

export default async function BlogPost({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const post = await getBlogPostBySlug(slug);

    if (!post) {
        notFound();
    }

    return (
        <main className="min-h-screen px-6 py-12 md:py-24">
            <article className="max-w-3xl mx-auto space-y-8">
                <div>
                    <Button asChild variant="ghost" className="mb-8 -ml-4 text-neutral-400 hover:text-white">
                        <Link href="/blog"><ArrowLeft className="w-4 h-4 mr-2" /> Back to blog</Link>
                    </Button>

                    <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">{post.title}</h1>
                    <time className="text-neutral-500">
                        {new Date(post.date).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                        })}
                    </time>
                </div>

                <div
                    className="prose prose-invert prose-neutral max-w-none 
            prose-headings:font-bold prose-a:text-blue-400 hover:prose-a:text-blue-300
            prose-img:rounded-lg prose-pre:bg-neutral-900 prose-pre:border prose-pre:border-neutral-800"
                    dangerouslySetInnerHTML={{ __html: post.htmlContent || '' }}
                />
            </article>
        </main>
    );
}
