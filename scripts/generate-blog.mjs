import fs from 'fs';
import path from 'path';
import { GoogleGenerativeAI } from '@google/generative-ai';
import Anthropic from '@anthropic-ai/sdk';
import dotenv from 'dotenv';

dotenv.config();

const DRAFTS_DIR = path.join(process.cwd(), 'blog_drafts');
const POSTS_DIR = path.join(process.cwd(), 'content', 'blogs');

if (!fs.existsSync(DRAFTS_DIR)) fs.mkdirSync(DRAFTS_DIR, { recursive: true });
if (!fs.existsSync(POSTS_DIR)) fs.mkdirSync(POSTS_DIR, { recursive: true });

async function generateWithGemini(prompt) {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    const result = await model.generateContent(prompt);
    return { text: result.response.text(), modelName: "Gemini 2.5 Flash" };
}

async function generateWithClaude(prompt) {
    const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
    const msg = await anthropic.messages.create({
        model: "claude-3-5-sonnet-20241022",
        max_tokens: 4000,
        messages: [{ role: "user", content: prompt }]
    });
    return { text: msg.content[0].text, modelName: "Claude 3.5 Sonnet" };
}

function detectLanguage(content) {
    // Check for language hints in the draft frontmatter or content
    const langMatch = content.match(/language:\s*(\w+)/i);
    if (langMatch) return langMatch[1];
    return 'English';
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
        const language = detectLanguage(draftContent);

        const systemPrompt = `You are an expert blogger. Convert the following notes/draft into a comprehensive, well-structured, engaging markdown blog post written in ${language}.

The blog MUST start with a YAML frontmatter block wrapped in --- delimiters. The frontmatter MUST include these fields:
- title: (catchy, professional title in double quotes)
- date: (ISO format like "${new Date().toISOString()}")
- excerpt: (one-liner summary in double quotes)
- tags: (array like ["Tag1", "Tag2"])

IMPORTANT RULES:
1. You MUST wrap ALL string values in YAML (title, excerpt) in double quotes.
2. Do NOT wrap the output in markdown code blocks (no \`\`\`markdown or \`\`\`yaml).
3. Start your response directly with --- on the first line.
4. Expand on the ideas provided with depth and insight.
5. If the draft references images, videos, or data, incorporate them naturally.

Draft:
${draftContent}
`;

        let finalContent = '';
        let modelName = '';

        try {
            if (process.env.GEMINI_API_KEY) {
                console.log('Using Gemini API...');
                const result = await generateWithGemini(systemPrompt);
                finalContent = result.text;
                modelName = result.modelName;
            } else if (process.env.ANTHROPIC_API_KEY) {
                console.log('Using Claude API...');
                const result = await generateWithClaude(systemPrompt);
                finalContent = result.text;
                modelName = result.modelName;
            } else {
                console.error('No AI API key found (GEMINI_API_KEY or ANTHROPIC_API_KEY).');
                process.exit(1);
            }

            // Cleanup: strip everything before the first ---
            const firstDash = finalContent.indexOf('---');
            if (firstDash !== -1) {
                finalContent = finalContent.substring(firstDash);
            }
            // Remove trailing code block markers
            finalContent = finalContent.replace(/\n```\s*$/g, '').trim();

            // Inject AI model attribution into frontmatter
            const secondDash = finalContent.indexOf('---', 3);
            if (secondDash !== -1) {
                finalContent =
                    finalContent.substring(0, secondDash) +
                    `aiModel: "${modelName}"\n` +
                    finalContent.substring(secondDash);
            }

            fs.writeFileSync(postPath, finalContent, 'utf8');
            console.log(`Successfully generated ${postPath} (by ${modelName})`);

        } catch (error) {
            console.error(`Failed to process ${file}:`, error);
        }
    }
}

processDrafts();
