"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Search } from "lucide-react";

interface Post {
    slug: string;
    title: string;
    date: string;
    excerpt: string;
    readingTime: number;
    tags: string[];
}

export function BlogSearch({ posts }: { posts: Post[] }) {
    const [query, setQuery] = useState("");

    const filtered = useMemo(() => {
        if (!query.trim()) return posts;
        const q = query.toLowerCase();
        return posts.filter(
            (p) =>
                p.title.toLowerCase().includes(q) ||
                p.excerpt.toLowerCase().includes(q) ||
                p.tags.some((t) => t.toLowerCase().includes(q))
        );
    }, [query, posts]);

    return (
        <div className="space-y-6">
            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                    type="text"
                    placeholder="Search posts by title, content, or tag..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    className="pl-10"
                />
            </div>

            <div className="space-y-4">
                {filtered.map((blog) => (
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
                                        {new Date(blog.date).toLocaleDateString("en-US", {
                                            year: "numeric",
                                            month: "short",
                                            day: "numeric",
                                        })}
                                    </time>
                                </div>
                            </div>
                            <CardDescription className="text-muted-foreground text-base">
                                {blog.excerpt}
                            </CardDescription>
                            <div className="flex flex-wrap gap-2 pt-2">
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
                {filtered.length === 0 && (
                    <p className="text-muted-foreground text-center py-8">
                        No posts found matching &ldquo;{query}&rdquo;
                    </p>
                )}
            </div>
        </div>
    );
}
