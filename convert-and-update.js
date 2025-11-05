const fs = require('fs');
const { marked } = require('marked');

console.log('📝 Converting updated index.md to HTML...\n');

// Read our updated markdown
const markdown = fs.readFileSync('index.md', 'utf8');

// Extract frontmatter and content
const parts = markdown.split('---');
const content = parts.length > 2 ? parts.slice(2).join('---') : markdown;

// Convert markdown to HTML
const htmlContent = marked.parse(content);

// Read the current _site/index.html template
const currentHtml = fs.readFileSync('_site/index.html', 'utf8');

// Find the content section and replace it
// The content is in <div class="span12"> after <div class="row-fluid">
const contentStart = currentHtml.indexOf('<div class="row-fluid">');
const contentEnd = currentHtml.indexOf('</div>\n</div>', contentStart) + 6;

if (contentStart === -1 || contentEnd === -1) {
  console.error('❌ Could not find content section in _site/index.html');
  process.exit(1);
}

const before = currentHtml.substring(0, contentStart);
const after = currentHtml.substring(contentEnd);

const newHtml = before +
  '<div class="row-fluid">\n  <div class="span12">\n    ' +
  htmlContent +
  '\n  </div>\n</div>' +
  after;

// Write the updated HTML
fs.writeFileSync('_site/index.html', newHtml);

console.log('✅ Successfully updated _site/index.html with new content!');
console.log('📁 File: _site/index.html');
console.log('\n🌐 The local server is serving the updated content at http://localhost:4000\n');
