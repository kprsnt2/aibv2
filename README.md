# AIBlog — AI-Powered Blog Generator & Portfolio

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fkprsnt2%2Faibv2&project-name=ai-blog&repository-name=ai-blog)

An open-source, AI-powered blog generator and personal portfolio template. Write your notes, push a file — AI generates a polished blog post and auto-deploys to Vercel.

## ✨ Features

### Must-Have
- 🚀 **One-click Deploy** — Deploy to Vercel with a single click
- 🌓 **Dark/Light Theme** — Toggle between themes with next-themes
- 🔍 **Blog Search** — Fuzzy search across titles, tags, and excerpts
- 📄 **SEO** — Auto-generated og:title, og:description, Twitter cards per post
- 📡 **RSS Feed** — Auto-generated at `/feed.xml`
- 🗺️ **Sitemap** — Auto-generated at `/sitemap.xml`
- ⏱️ **Reading Time** — Estimated reading time on every post
- 🏷️ **Tags** — Filter posts by tag with a dedicated `/tags` page

### Nice-to-Have
- 💬 **Comments** — Giscus (GitHub Discussions) integration
- 📧 **Newsletter** — Email subscription component (integrate Buttondown/Resend)
- 📑 **Table of Contents** — Auto-generated sidebar TOC with scroll spy
- 🔗 **Social Share** — Twitter, LinkedIn, and copy-link buttons
- 🤖 **AI Attribution** — Shows which AI model generated each post
- 🌐 **Multi-language** — AI generates blogs in any language (set `language: Spanish` in draft)

## 🚀 Quick Start

### 1. Clone & Deploy
Click the **Deploy with Vercel** button above, or:

```bash
git clone https://github.com/kprsnt2/aibv2.git
cd aibv2
npm install
npm run dev
```

### 2. Configure Your Profile
Edit `content/profile.json` with your info:
```json
{
  "name": "Your Name",
  "profession": "Your Role",
  "about": "A brief about you...",
  "socials": {
    "twitter": "https://twitter.com/you",
    "github": "https://github.com/you",
    "linkedin": "https://linkedin.com/in/you"
  },
  "resume": "https://example.com/resume.pdf",
  "projects": [
    { "title": "Project", "description": "Description", "link": "https://..." }
  ]
}
```

### 3. Write a Blog Draft
Create a `.md` or `.txt` file in `blog_drafts/`:

```markdown
My thoughts on the future of AI...

- Key point 1
- Key point 2
- Supporting data or links
```

Optional frontmatter hints:
```yaml
language: Spanish
```

### 4. Push & Publish
```bash
git add blog_drafts/my-post.md
git commit -m "new draft"
git push
```

GitHub Actions will:
1. Detect the new draft
2. Generate a full blog post using AI (Gemini or Claude)
3. Save it to `content/blogs/`
4. Vercel auto-deploys the updated site

## 🔧 Configuration

### Environment Variables

| Variable | Required | Description |
|---|---|---|
| `GEMINI_API_KEY` | Yes* | Google Gemini API key |
| `ANTHROPIC_API_KEY` | No* | Anthropic Claude API key (fallback) |
| `NEXT_PUBLIC_SITE_URL` | No | Your deployed site URL (for SEO) |

*At least one AI API key is required.

### Giscus Comments (Optional)
1. Enable [Giscus](https://giscus.app) on your repo
2. Update the `GiscusComments` props in `src/app/blog/[slug]/page.tsx`

### Newsletter (Optional)
The newsletter component is a UI placeholder. Integrate with:
- [Buttondown](https://buttondown.email)
- [Resend](https://resend.com)
- [ConvertKit](https://convertkit.com)

## 📁 Project Structure

```
├── blog_drafts/          # Drop your .md/.txt drafts here
├── content/
│   ├── blogs/            # AI-generated blog posts
│   └── profile.json      # Your personal info
├── scripts/
│   └── generate-blog.mjs # AI blog generation script
├── src/
│   ├── app/              # Next.js pages
│   │   ├── blog/         # Blog list + post pages
│   │   ├── tags/         # Tag listing + filter pages
│   │   ├── feed.xml/     # RSS feed
│   │   └── sitemap.ts    # Sitemap
│   ├── components/       # UI components
│   └── lib/              # Data utilities
└── .github/workflows/    # GitHub Actions
```

## 🛡️ Security

- XSS protection via sanitized HTML rendering
- Path traversal prevention on slug parameters
- Security headers (CSP, X-Frame-Options, etc.)
- GitHub Actions pinned to commit SHAs

## 📝 License

MIT — use it, fork it, make it yours!
