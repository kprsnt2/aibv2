import Link from 'next/link';
import { getBlogPosts } from '@/lib/blogs';
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function BlogList() {
    const blogs = getBlogPosts();

    return (
        <main className="min-h-screen px-6 py-12 md:py-24">
            <div className="max-w-3xl mx-auto space-y-12">
                <div>
                    <Button asChild variant="ghost" className="mb-8 -ml-4 text-neutral-400 hover:text-white">
                        <Link href="/"><ArrowLeft className="w-4 h-4 mr-2" /> Back home</Link>
                    </Button>
                    <h1 className="text-4xl font-bold tracking-tight mb-4">Blog</h1>
                    <p className="text-xl text-neutral-400">Thoughts, updates, and AI-generated insights.</p>
                </div>

                <div className="space-y-6">
                    {blogs.map((blog) => (
                        <Card key={blog.slug} className="bg-neutral-900 border-neutral-800">
                            <CardHeader>
                                <div className="flex justify-between items-start md:items-center flex-col md:flex-row gap-2 md:gap-0 pb-2">
                                    <CardTitle className="text-2xl">
                                        <Link href={`/blog/${blog.slug}`} className="hover:underline">
                                            {blog.title}
                                        </Link>
                                    </CardTitle>
                                    <time className="text-sm text-neutral-500 whitespace-nowrap">
                                        {new Date(blog.date).toLocaleDateString('en-US', {
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric'
                                        })}
                                    </time>
                                </div>
                                <CardDescription className="text-neutral-400 text-base">
                                    {blog.excerpt}
                                </CardDescription>
                            </CardHeader>
                        </Card>
                    ))}
                    {blogs.length === 0 && (
                        <p className="text-neutral-400">No blog posts found.</p>
                    )}
                </div>
            </div>
        </main>
    );
}
