import Link from 'next/link';
import { getAllTags, getBlogPosts } from '@/lib/blogs';
import { Badge } from '@/components/ui/badge';
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function TagsPage() {
    const tags = getAllTags();
    const posts = getBlogPosts();

    return (
        <main className="min-h-screen px-6 py-12 md:py-24">
            <div className="max-w-3xl mx-auto space-y-12">
                <div>
                    <h1 className="text-4xl font-bold tracking-tight mb-4">Tags</h1>
                    <p className="text-xl text-muted-foreground">Browse posts by topic.</p>
                </div>

                <div className="flex flex-wrap gap-3">
                    {tags.map(({ tag, count }) => (
                        <Link key={tag} href={`/tags/${encodeURIComponent(tag)}`}>
                            <Badge variant="secondary" className="text-sm px-3 py-1.5 cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors">
                                {tag} ({count})
                            </Badge>
                        </Link>
                    ))}
                    {tags.length === 0 && (
                        <p className="text-muted-foreground">No tags found.</p>
                    )}
                </div>

                <div className="space-y-6">
                    <h2 className="text-2xl font-bold tracking-tight">All Posts</h2>
                    {posts.map((blog) => (
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
                                <div className="flex flex-wrap gap-2 pt-1">
                                    {blog.tags.map((tag) => (
                                        <Link key={tag} href={`/tags/${encodeURIComponent(tag)}`}>
                                            <Badge variant="outline" className="text-xs cursor-pointer hover:bg-secondary">
                                                {tag}
                                            </Badge>
                                        </Link>
                                    ))}
                                </div>
                            </CardHeader>
                        </Card>
                    ))}
                </div>
            </div>
        </main>
    );
}
