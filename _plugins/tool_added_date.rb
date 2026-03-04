# Adds added_date to each tool from the source file's mtime (YYYY-MM-DD).
# Used by the "Latest" sort to show most recently added/updated tools first.
Jekyll::Hooks.register(:site, :post_read) do |site|
  collection = site.collections["tools"]
  next unless collection

  collection.docs.each do |doc|
    path = doc.respond_to?(:path) && doc.path ? doc.path : File.join(site.source, doc.relative_path)
    next unless File.exist?(path)

    doc.data["added_date"] = File.mtime(path).strftime("%Y-%m-%d")
  end
end
