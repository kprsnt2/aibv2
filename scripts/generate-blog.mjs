import fs from 'fs';
import path from 'path';
import { GoogleGenerativeAI } from '@google/generative-ai';
import Anthropic from '@anthropic-ai/sdk';
import dotenv from 'dotenv';
import matter from 'gray-matter';

dotenv.config();

const DRAFTS_DIR = path.join(process.cwd(), 'blog_drafts');
const POSTS_DIR = path.join(process.cwd(), 'content', 'blogs');

if (!fs.existsSync(DRAFTS_DIR)) fs.mkdirSync(DRAFTS_DIR, { recursive: true });
if (!fs.existsSync(POSTS_DIR)) fs.mkdirSync(POSTS_DIR, { recursive: true });

async function generateWithGemini(prompt) {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    const result = await model.generateContent(prompt);
    return result.response.text();
}

async function generateWithClaude(prompt) {
    const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
    const msg = await anthropic.messages.create({
        model: "claude-3-5-sonnet-20241022",
        max_tokens: 4000,
        messages: [{ role: "user", content: prompt }]
    });
    return msg.content[0].text;
}

async function processDrafts() {
    const files = fs.readdirSync(DRAFTS_DIR);

    for (const file of files) {
        if (!file.endsWith('.md') && !file.endsWith('.txt')) continue;

        const baseName = file.replace(/\.(md|txt)$/, '');
        const postPath = path.join(POSTS_DIR, `${baseName}.md`);

        // Skip if already generated
        if (fs.existsSync(postPath)) {
            console.log(`Skipping ${file}: Blog post already exists.`);
            continue;
        }

        console.log(`Processing draft: ${file}`);
        const draftContent = fs.readFileSync(path.join(DRAFTS_DIR, file), 'utf8');

        const systemPrompt = `You are an expert tech blogger. Convert the following notes/draft into a comprehensive, well-structured, engaging markdown blog post. The blog must include a markdown frontmatter with 'title', 'date' (ISO format like ${new Date().toISOString()}), and 'excerpt'. 
IMPORTANT: You MUST wrap all string values in the YAML frontmatter (title, excerpt, etc.) in double quotes to prevent YAML parsing errors with special characters. Make the title catchy but professional. Expand on the ideas provided. If the draft references supporting imagery or data, write seamlessly around it or format it well.

Draft:
${draftContent}

Output exactly the markdown with the frontmatter (no wrapping markdown formatting like \`\`\`markdown, just the raw text).
`;

        let finalContent = '';

        try {
            if (process.env.GEMINI_API_KEY) {
                console.log('Using Gemini API...');
                finalContent = await generateWithGemini(systemPrompt);
            } else if (process.env.ANTHROPIC_API_KEY) {
                console.log('Using Claude API...');
                finalContent = await generateWithClaude(systemPrompt);
            } else {
                console.error('No AI API key found (GEMINI_API_KEY or ANTHROPIC_API_KEY).');
                process.exit(1);
            }

            // Cleanup response formatting in case the model adds backticks
            finalContent = finalContent.replace(/^```markdown\n?/g, '').replace(/\n?```$/g, '').trim();

            fs.writeFileSync(postPath, finalContent, 'utf8');
            console.log(`Successfully generated ${postPath}`);

        } catch (error) {
            console.error(`Failed to process ${file}:`, error);
        }
    }
}

processDrafts();
