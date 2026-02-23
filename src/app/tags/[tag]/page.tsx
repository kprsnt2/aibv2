import Link from 'next/link';
import { getBlogPosts, getAllTags } from '@/lib/blogs';
import { Badge } from '@/components/ui/badge';
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

export async function generateStaticParams() {
    const tags = getAllTags();
    return tags.map(({ tag }) => ({
        tag: encodeURIComponent(tag),
    }));
}

export default async function TagPage({ params }: { params: Promise<{ tag: string }> }) {
    const { tag: rawTag } = await params;
    const tag = decodeURIComponent(rawTag);
    const allPosts = getBlogPosts();
    const filteredPosts = allPosts.filter((post) =>
        post.tags.some((t) => t.toLowerCase() === tag.toLowerCase())
    );

    return (
        <main className="min-h-screen px-6 py-12 md:py-24">
            <div className="max-w-3xl mx-auto space-y-12">
                <div>
                    <Button asChild variant="ghost" className="mb-8 -ml-4 text-muted-foreground hover:text-foreground">
                        <Link href="/tags"><ArrowLeft className="w-4 h-4 mr-2" /> All tags</Link>
                    </Button>
                    <h1 className="text-4xl font-bold tracking-tight mb-4">
                        Posts tagged <Badge variant="secondary" className="text-2xl px-3 py-1 ml-2">{tag}</Badge>
                    </h1>
                    <p className="text-muted-foreground">{filteredPosts.length} post{filteredPosts.length !== 1 ? 's' : ''} found.</p>
                </div>

                <div className="space-y-6">
                    {filteredPosts.map((blog) => (
                        <Card key={blog.slug} className="bg-card">
                            <CardHeader>
                                <div className="flex justify-between items-start md:items-center flex-col md:flex-row gap-2 md:gap-0 pb-2">
                                    <CardTitle className="text-xl">
                                        <Link href={`/blog/${blog.slug}`} className="hover:underline">
                                            {blog.title}
                                        </Link>
                                    </CardTitle>
                                    <div className="flex items-center gap-3 text-sm text-muted-foreground whitespace-nowrap">
                                        <span>{blog.readingTime} min read</span>
                                        <time>
                                            {new Date(blog.date).toLocaleDateString('en-US', {
                                                year: 'numeric', month: 'short', day: 'numeric'
                                            })}
                                        </time>
                                    </div>
                                </div>
                                <CardDescription className="text-muted-foreground text-base">
                                    {blog.excerpt}
                                </CardDescription>
                            </CardHeader>
                        </Card>
                    ))}
                </div>
            </div>
        </main>
    );
}
