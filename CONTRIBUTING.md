# Contributing to 8ai.ac

Thanks for wanting to add to the AI tools directory! This project is community-driven — anyone can submit a tool by opening a pull request.

## Scope

Every tool should **help you do something useful**. We list AI tools that are built for AI and enable a productive outcome—writing, creating, coding, designing, researching, automating, and so on. We exclude tools that are primarily passive services (e.g. entertainment chat, character roleplay with no productive use case). When in doubt, ask: does this tool help someone accomplish a task?

## Adding a New Tool

### 1. Copy the template

Copy `_tools/_template.md` and rename it to match your tool's slug (e.g., `_tools/your-tool-name.md`). The slug must be lowercase with hyphens only.

### 2. Fill in the front matter

Every field marked **REQUIRED** must be filled in. Here's a quick reference:

| Field | Required | Type | Description |
|-------|----------|------|-------------|
| `name` | Yes | string | Official tool name |
| `slug` | Yes | string | URL-safe identifier (must match filename) |
| `website` | Yes | string | Official website URL |
| `description` | Yes | string | One sentence, under 160 characters |
| `categories` | Yes | list | 1–3 from the category list below |
| `use_cases` | Yes | list | 1–3 from the use case list below |
| `modalities` | Yes | list | From: text, image, video, audio, code |
| `pricing` | Yes | string | One of: free, freemium, paid, open-source |
| `api` | Yes | boolean | Does it have a public API? |
| `self_hosted` | Yes | boolean | Can it be self-hosted? |
| `features` | No | list | Key feature highlights |
| `launch_date` | No | string | YYYY-MM format |
| `verified` | No | boolean | Leave as false (maintainers set this) |

### 3. Write a description

Below the front matter, write an optional Markdown description. This appears on the tool's detail page and helps with search engine visibility. Tips:

- Write naturally and include relevant search terms (e.g., "AI writing assistant", "code completion tool")
- Avoid keyword stuffing — focus on being helpful and accurate
- 2–4 sentences is ideal

### 4. Submit a pull request

- Your PR should add **one file** to the `_tools/` directory
- Use the PR template checklist to verify everything is correct
- A GitHub Action will automatically validate your front matter

## Contributing with AI

You can use ChatGPT, Claude, Cursor, or any AI assistant to draft your tool listing. Give it the right context and it can produce a valid listing in one go.

**What to provide:**
- The contents of `_tools/_template.md` (so it knows the structure)
- The Categories, Use Cases, and Modalities tables/lists from this CONTRIBUTING.md (so it picks valid slugs)
- The tool’s name and website (and any other info you have)

**Ready-made prompt** — copy, fill in the bracketed parts, and paste:

```
I'm contributing an AI tool to the 8ai.ac directory (https://github.com/vocino/8ai.ac). 
Create a complete tool listing file for me.

CONTEXT — Use this template structure and taxonomy:

[Paste the full contents of _tools/_template.md here]

VALID VALUES (from CONTRIBUTING.md):
- Categories: chat, image-generation, image-editing, video-generation, video-editing, audio-generation, audio-editing, speech, coding, writing, productivity, research, search, customer-service, design, marketing, education, data-analysis, 3d, agents, api-platform, prompt-tools
- Use cases: content-creation, development, design, research, automation, support, sales, marketing, education, personal, data-analysis, video-production, audio-production, legal, healthcare, finance, enterprise
- Modalities: text, image, video, audio, code
- Pricing: free, freemium, paid, open-source

TOOL TO ADD:
- Name: [Tool name]
- Website: [URL]
- [Any other details: what it does, pricing model, has API, etc.]

Output a complete .md file with valid YAML front matter and a 2–4 sentence Markdown description below. 
The slug must be lowercase with hyphens only and match the filename (e.g. my-tool-name.md).
```

After you get the output, save it as `_tools/[slug].md`, run `node validate.js` to confirm it passes, and open a pull request.

## Categories

Pick 1–3 that describe what the tool **does**:

| Slug | Label |
|------|-------|
| `chat` | Chat & Conversational |
| `image-generation` | Image Generation |
| `image-editing` | Image Editing |
| `video-generation` | Video Generation |
| `video-editing` | Video Editing |
| `audio-generation` | Audio & Music Generation |
| `audio-editing` | Audio Editing |
| `speech` | Speech & Voice |
| `coding` | Coding & Development |
| `writing` | Writing |
| `productivity` | Productivity |
| `research` | Research & Analysis |
| `search` | Search & Discovery |
| `customer-service` | Customer Service |
| `design` | Design |
| `marketing` | Marketing & Sales |
| `education` | Education |
| `data-analysis` | Data & Analytics |
| `3d` | 3D & Spatial |
| `agents` | Agents & Automation |
| `api-platform` | APIs & Platforms |
| `prompt-tools` | Prompt Engineering |

**Note:** Use `*-generation` for tools that create from scratch and `*-editing` for tools that modify existing content.

## Use Cases

Pick 1–3 that describe **what you use it for**:

`content-creation`, `development`, `design`, `research`, `automation`, `support`, `sales`, `marketing`, `education`, `personal`, `data-analysis`, `video-production`, `audio-production`, `legal`, `healthcare`, `finance`, `enterprise`

## Modalities

Pick all that apply for what the tool **accepts or produces**:

`text`, `image`, `video`, `audio`, `code`

## Adding a New Category or Use Case

If the existing taxonomies don't cover a tool, open an issue or include changes to `_data/categories.yml`, `_data/use_cases.yml`, or `_data/modalities.yml` in your PR. New taxonomy values need maintainer approval.

## Code of Conduct

Be respectful. Don't submit spam, fake tools, or affiliate-heavy descriptions. Listings should be factual and helpful.
