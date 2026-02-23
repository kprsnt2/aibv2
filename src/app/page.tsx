import Link from "next/link";
import profile from "../../content/profile.json";
import { getBlogPosts } from "@/lib/blogs";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Github, Linkedin, Twitter, FileText, ArrowRight, Clock, Rss } from "lucide-react";
import { Newsletter } from "@/components/newsletter";

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
            Hi, I&apos;m {profile.name.split(" ")[0]}.
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl">
            {profile.profession}
          </p>
          <p className="text-muted-foreground max-w-2xl leading-relaxed">
            {profile.about}
          </p>

          <div className="flex flex-wrap gap-4 pt-4">
            {profile.socials.github && (
              <Button asChild variant="outline" size="sm">
                <Link href={profile.socials.github} target="_blank" rel="noopener noreferrer">
                  <Github className="w-4 h-4 mr-2" /> GitHub
                </Link>
              </Button>
            )}
            {profile.socials.twitter && (
              <Button asChild variant="outline" size="sm">
                <Link href={profile.socials.twitter} target="_blank" rel="noopener noreferrer">
                  <Twitter className="w-4 h-4 mr-2" /> Twitter
                </Link>
              </Button>
            )}
            {profile.socials.linkedin && (
              <Button asChild variant="outline" size="sm">
                <Link href={profile.socials.linkedin} target="_blank" rel="noopener noreferrer">
                  <Linkedin className="w-4 h-4 mr-2" /> LinkedIn
                </Link>
              </Button>
            )}
            {profile.resume && (
              <Button asChild size="sm">
                <Link href={profile.resume} target="_blank" rel="noopener noreferrer">
                  <FileText className="w-4 h-4 mr-2" /> Resume
                </Link>
              </Button>
            )}
            <Button asChild variant="outline" size="sm">
              <Link href="/feed.xml" target="_blank" rel="noopener noreferrer">
                <Rss className="w-4 h-4 mr-2" /> RSS
              </Link>
            </Button>
          </div>
        </section>

        {/* Projects Section */}
        <section className="space-y-8">
          <h2 className="text-3xl font-bold tracking-tight">Featured Projects</h2>
          <div className="grid gap-6 md:grid-cols-2">
            {profile.projects.map((project, i) => (
              <Card key={i} className="bg-card">
                <CardHeader>
                  <CardTitle>{project.title}</CardTitle>
                  <CardDescription className="text-muted-foreground">
                    {project.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button asChild variant="link" className="px-0">
                    <Link href={project.link} target="_blank" rel="noopener noreferrer">
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
              <Card key={blog.slug} className="bg-card">
                <CardHeader>
                  <div className="flex justify-between items-start md:items-center flex-col md:flex-row gap-2 md:gap-0 pb-2">
                    <CardTitle className="text-xl">
                      <Link href={`/blog/${blog.slug}`} className="hover:underline">
                        {blog.title}
                      </Link>
                    </CardTitle>
                    <div className="flex items-center gap-3 text-sm text-muted-foreground whitespace-nowrap">
                      <div className="flex items-center gap-1">
                        <Clock className="h-3.5 w-3.5" />
                        <span>{blog.readingTime} min</span>
                      </div>
                      <time>
                        {new Date(blog.date).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </time>
                    </div>
                  </div>
                  <CardDescription className="text-muted-foreground text-base">
                    {blog.excerpt}
                  </CardDescription>
                  <div className="flex flex-wrap gap-2 pt-2">
                    {blog.tags.slice(0, 3).map((tag) => (
                      <Badge key={tag} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </CardHeader>
              </Card>
            ))}
            {recentBlogs.length === 0 && (
              <p className="text-muted-foreground">No blog posts found. Add some in the content folder!</p>
            )}
          </div>
        </section>

        {/* Newsletter Section */}
        <Newsletter />
      </div>
    </main>
  );
}
