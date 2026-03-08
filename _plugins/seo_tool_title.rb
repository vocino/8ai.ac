# frozen_string_literal: true
# Sets page.title from page.name for tools collection so jekyll-seo-tag
# outputs unique, query-aligned meta titles (e.g. "LlamaIndex — AI Tool | 8ai.ac").
Jekyll::Hooks.register :site, :post_read do |site|
  tools = site.collections["tools"]
  next unless tools

  tools.docs.each do |doc|
    next unless doc.data["name"]

    # Overwrite default title (e.g. from slug) so jekyll-seo-tag outputs unique meta titles
    doc.data["title"] = "#{doc.data['name']} — AI Tool"
  end
end
