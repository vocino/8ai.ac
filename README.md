# 8ai.ac — AI Tools Directory

[![Contributors][contributors-shield]][contributors-url]
[![Forks][forks-shield]][forks-url]
[![Stargazers][stars-shield]][stars-url]
[![Issues][issues-shield]][issues-url]
[![MIT License][license-shield]](LICENSE)

The open-source directory of AI tools, services, and platforms. Free and paid. Community-driven.

**[Browse the directory →](https://8ai.ac)**

## About

8ai.ac is a community-maintained, open-source directory of AI tools. Every listing is a single Markdown file with structured front matter. The site is built with Jekyll and hosted on GitHub Pages — no database, no backend, just static files.

## Add a Tool

1. Copy `_tools/_template.md`
2. Rename it to `your-tool-slug.md`
3. Fill in the front matter fields
4. Submit a pull request

See [CONTRIBUTING.md](CONTRIBUTING.md) for full instructions and the taxonomy reference.

## How It Works

- **One file per tool** — Each tool is a Markdown file in `_tools/` with YAML front matter
- **Controlled taxonomy** — Categories, use cases, and modalities are defined in `_data/` and validated in CI
- **Static site** — Jekyll builds the site; GitHub Pages serves it
- **Client-side filtering** — JavaScript powers the e-commerce-style filter sidebar (no server needed)
- **SEO-first** — Each tool and category has its own page with structured data, meta tags, and clean URLs

## Local Development

```bash
gem install bundler
bundle install
bundle exec jekyll serve
```

Then open [http://localhost:4000](http://localhost:4000).

## Project Structure

```
_tools/          → Tool listings (one .md per tool)
_data/           → Taxonomy files (categories, use cases, modalities)
_layouts/        → Page layouts (default, tool, category)
_includes/       → Reusable components (nav, sidebar, cards)
assets/          → CSS and JavaScript
category/        → Category landing pages
tools.json       → Generated API endpoint
validate.js      → Front matter validation script
```

## Contributors

<!-- readme: contributors -start -->
<!-- readme: contributors -end -->

## Acknowledgements

- [Catppuccin](https://github.com/catppuccin/catppuccin) — Color palette and theme inspiration

## License

MIT License. See [LICENSE](LICENSE) for details. Listings are contributed by the community.

[contributors-shield]: https://img.shields.io/github/contributors/vocino/8ai.ac?style=flat-square&color=89b4fa&labelColor=45475a
[contributors-url]: https://github.com/vocino/8ai.ac/graphs/contributors
[forks-shield]: https://img.shields.io/github/forks/vocino/8ai.ac?style=flat-square&color=89b4fa&labelColor=45475a
[forks-url]: https://github.com/vocino/8ai.ac/network/members
[stars-shield]: https://img.shields.io/github/stars/vocino/8ai.ac?style=flat-square&color=89b4fa&labelColor=45475a
[stars-url]: https://github.com/vocino/8ai.ac/stargazers
[issues-shield]: https://img.shields.io/github/issues/vocino/8ai.ac?style=flat-square&color=89b4fa&labelColor=45475a
[issues-url]: https://github.com/vocino/8ai.ac/issues
[license-shield]: https://img.shields.io/github/license/vocino/8ai.ac?style=flat-square&color=89b4fa&labelColor=45475a
