/**
 * Generates _data/tool_added_dates.yml from _tools/*.md file mtimes (YYYY-MM-DD).
 * Used for the "Latest" sort on the site. Run before `jekyll build` (or in CI).
 * GitHub Pages does not run custom plugins, so this data file is required.
 */
const fs = require("fs");
const path = require("path");
const yaml = require("js-yaml");

const TOOLS_DIR = path.join(__dirname, "..", "_tools");
const DATA_DIR = path.join(__dirname, "..", "_data");
const OUT_FILE = path.join(DATA_DIR, "tool_added_dates.yml");

const files = fs.readdirSync(TOOLS_DIR).filter(function (f) {
  return f.endsWith(".md") && f !== "_template.md";
});

const dates = {};
files.forEach(function (file) {
  const slug = path.basename(file, ".md");
  const filePath = path.join(TOOLS_DIR, file);
  const stat = fs.statSync(filePath);
  dates[slug] = stat.mtime.toISOString().slice(0, 10);
});

const yamlOut = yaml.dump(dates, { lineWidth: -1 });
fs.mkdirSync(DATA_DIR, { recursive: true });
fs.writeFileSync(OUT_FILE, yamlOut, "utf8");
console.log("Wrote " + Object.keys(dates).length + " entries to " + OUT_FILE);
