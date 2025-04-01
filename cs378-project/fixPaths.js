const fs = require("fs");
const path = require("path");

function processFile(filePath) {
  let content = fs.readFileSync(filePath, "utf8");

  // Replace asset paths that start with a slash but are not absolute URLs.
  // For example: href="/_next/..." becomes href="./_next/..."
  content = content.replace(/(href|src)="\/(?!\/)([^"]+)"/g, '$1="./$2"');

  fs.writeFileSync(filePath, content, "utf8");
  console.log(`Processed ${filePath}`);
}

function walk(dir) {
  fs.readdirSync(dir).forEach((file) => {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      walk(fullPath);
    } else if (file.endsWith(".html")) {
      processFile(fullPath);
    }
  });
}

const outDir = path.join(__dirname, "out");
if (fs.existsSync(outDir)) {
  walk(outDir);
} else {
  console.error(`Output directory "${outDir}" does not exist.`);
}
