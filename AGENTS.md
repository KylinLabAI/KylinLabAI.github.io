# AGENTS.md — KylinLab Website

Instructions for AI coding agents working in this repository.

> Behavioral guidelines adapted from [Karpathy's CLAUDE.md template](https://github.com/multica-ai/andrej-karpathy-skills/blob/main/CLAUDE.md).

## Purpose

This repository is the Jekyll-based static website for KylinLab — a personal technology consulting and knowledge-sharing site. The agent's role is to maintain and extend site content (pages, articles, demos), layouts, styles, and deployment configuration while preserving the bilingual (en/zh) structure and Jekyll conventions.

## Behavioral Guidelines

### 1. Think Before Coding
*Don't assume. Don't hide confusion. Surface tradeoffs.*

- State your assumptions explicitly. If uncertain, ask.
- If multiple interpretations exist, present them — don't pick silently.
- If a simpler approach exists, say so. Push back when warranted.

### 2. Surgical Changes
*Touch only what you must. Clean up only your own mess.*

- Don't "improve" adjacent content, formatting, or unrelated pages.
- Match existing Jekyll conventions (Front Matter, Liquid templates, includes).
- If you notice unrelated issues, mention them — don't fix them silently.
- Every changed line should trace directly to the user's request.

### 3. Content Integrity
*Respect the author's voice and bilingual structure.*

- When editing content, preserve the original language style and tone.
- Ensure changes to English content have corresponding Chinese updates in `zh/` when applicable.
- Do not alter published article content without explicit instruction.

## Repository Layout

| Directory | Role | Edit Policy |
|-----------|------|-------------|
| `_layouts/` | Page layout templates (Liquid) | Edit with care; affects all pages |
| `_includes/` | Reusable HTML components | Edit with care; used across multiple pages |
| `_sass/` | SCSS stylesheets | Freely editable; compiles to CSS |
| `_data/` | Site data files (YAML/JSON) | Edit with care; used by Liquid templates |
| `_knowledge/` | Knowledge articles (Markdown, Jekyll collection) | Freely editable; follow existing Front Matter |
| `_demos/` | Demo/prototype articles (Jekyll collection) | Freely editable; follow existing Front Matter |
| `_posts/` | Blog posts | Freely editable; follow existing Front Matter |
| `_drafts/` | Draft articles (not published) | Freely editable |
| `assets/` | Static assets (CSS, images, i18n files) | Edit with care; CSS is compiled output |
| `zh/` | Chinese translated pages | Edit with care; keep in sync with English pages |
| `deploy/` | Deployment scripts (shell) | Edit with care; affects production deployments |
| `scripts/` | Utility scripts (Python) | Edit with care |
| `docs/` | Internal documentation | Edit freely |
| `.workflow/` | CI/CD pipeline (Gitee Go) | Edit with care; affects automated builds |
| `_config.yml` | Jekyll configuration | Edit with care; affects entire site build |
| `Dockerfile` | Docker image definition | Edit with care; affects ECS deployment |
| `nginx.conf` | Nginx web server config | Edit with care; affects production serving |
| `_site/` | Generated static site output | **Do not edit** — gitignored, rebuilt by Jekyll |
| `.jekyll-cache/` | Jekyll build cache | **Do not edit** — gitignored |

## Editing Rules

- Always run `bundle exec jekyll build` after changes to verify the site builds cleanly.
- CSS changes go in `_sass/` — do not directly edit `assets/css/` compiled output.
- When adding a new page, create both the English version (root) and Chinese version (`zh/`) if applicable.
- Follow existing Front Matter conventions for collections (`_knowledge/`, `_demos/`).
- Do not commit `_site/` or `.jekyll-cache/` — they are gitignored.
- Deployment scripts use environment variables from `.kylin_config/.env` — never hardcode credentials or server IPs.

## Quality Bar

- Site builds without errors: `bundle exec jekyll build`
- Static site validation passes: `python scripts/check_static_site.py`
- Links are relative (not hardcoded to localhost or specific domains)
- Both English and Chinese pages render correctly

## Common Commands

| Task | Command |
|------|---------|
| Install dependencies | `bundle install` |
| Dev server | `bundle exec jekyll serve` |
| Build (production) | `bundle exec jekyll build` |
| Validate build | `python scripts/check_static_site.py` |
| Deploy to ECS | `./deploy/deploy_to_ecs_direct.sh` |
| Deploy to GitHub Pages | `./deploy/deploy_to_github.sh <path-to-pages-repo>` |
| Docker local test | `docker-compose up -d` |

## Site Configuration

- Jekyll config: `_config.yml` (primary) and `_config_github.yml` (GitHub Pages override)
- Markdown engine: kramdown with rouge syntax highlighting
- Jekyll collections: `knowledge` (output at `/knowledge/:name.html`), `demos` (output at `/demos/:name.html`)
- Languages: `en` (default), `zh`
- Internationalization data: `assets/resources/` (JSON i18n files)
