import { getBlogPosts } from '@/lib/blogs';
import { BlogSearch } from '@/components/blog-search';
import { Newsletter } from '@/components/newsletter';

export default function BlogList() {
    const blogs = getBlogPosts();

    return (
        <main className="min-h-screen px-6 py-12 md:py-24">
            <div className="max-w-3xl mx-auto space-y-12">
                <div>
                    <h1 className="text-4xl font-bold tracking-tight mb-4">Blog</h1>
                    <p className="text-xl text-muted-foreground">Thoughts, updates, and AI-generated insights.</p>
                </div>

                <BlogSearch posts={blogs} />

                <Newsletter />
            </div>
        </main>
    );
}
