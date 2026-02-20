import Link from "next/link";
import profile from "../../content/profile.json";
import { getBlogPosts } from "@/lib/blogs";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Github, Linkedin, Twitter, FileText, ArrowRight } from "lucide-react";

export default function Home() {
  const recentBlogs = getBlogPosts().slice(0, 3);

  return (
    <main className="min-h-screen px-6 py-12 md:py-24">
      <div className="max-w-4xl mx-auto space-y-24">

        {/* Hero Section */}
        <section className="space-y-6">
          <Badge variant="secondary" className="mb-4">
            Available for new opportunities
          </Badge>
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight">
            Hi, I'm {profile.name.split(" ")[0]}.
          </h1>
          <p className="text-xl md:text-2xl text-neutral-400 max-w-2xl">
            {profile.profession}
          </p>
          <p className="text-neutral-400 max-w-2xl leading-relaxed">
            {profile.about}
          </p>

          <div className="flex flex-wrap gap-4 pt-4">
            {profile.socials.github && (
              <Button asChild variant="outline" size="sm">
                <Link href={profile.socials.github} target="_blank">
                  <Github className="w-4 h-4 mr-2" /> GitHub
                </Link>
              </Button>
            )}
            {profile.socials.twitter && (
              <Button asChild variant="outline" size="sm">
                <Link href={profile.socials.twitter} target="_blank">
                  <Twitter className="w-4 h-4 mr-2" /> Twitter
                </Link>
              </Button>
            )}
            {profile.socials.linkedin && (
              <Button asChild variant="outline" size="sm">
                <Link href={profile.socials.linkedin} target="_blank">
                  <Linkedin className="w-4 h-4 mr-2" /> LinkedIn
                </Link>
              </Button>
            )}
            {profile.resume && (
              <Button asChild size="sm">
                <Link href={profile.resume} target="_blank">
                  <FileText className="w-4 h-4 mr-2" /> Resume
                </Link>
              </Button>
            )}
          </div>
        </section>

        {/* Projects Section */}
        <section className="space-y-8">
          <h2 className="text-3xl font-bold tracking-tight">Featured Projects</h2>
          <div className="grid gap-6 md:grid-cols-2">
            {profile.projects.map((project, i) => (
              <Card key={i} className="bg-neutral-900 border-neutral-800">
                <CardHeader>
                  <CardTitle>{project.title}</CardTitle>
                  <CardDescription className="text-neutral-400">
                    {project.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button asChild variant="link" className="px-0 text-white">
                    <Link href={project.link} target="_blank">
                      View Project <ArrowRight className="w-4 h-4 ml-1" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Recent Blogs Section */}
        <section className="space-y-8">
          <div className="flex justify-between items-end mb-8">
            <h2 className="text-3xl font-bold tracking-tight">Recent Writing</h2>
            <Button asChild variant="ghost">
              <Link href="/blog">View all <ArrowRight className="w-4 h-4 ml-2" /></Link>
            </Button>
          </div>
          <div className="space-y-6">
            {recentBlogs.map((blog) => (
              <Card key={blog.slug} className="bg-neutral-900 border-neutral-800">
                <CardHeader>
                  <div className="flex justify-between items-start md:items-center flex-col md:flex-row gap-2 md:gap-0 pb-2">
                    <CardTitle className="text-xl">
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
            {recentBlogs.length === 0 && (
              <p className="text-neutral-400">No blog posts found. Add some in the content folder!</p>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}
