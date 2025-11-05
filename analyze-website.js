const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');

const results = {
  timestamp: new Date().toISOString(),
  baseUrl: 'http://localhost:4000',
  passed: [],
  failed: [],
  warnings: [],
  content: {},
  links: { internal: [], external: [], broken: [] },
  accessibility: {},
  structure: {},
  style: {}
};

async function analyzeWebsite() {
  console.log('🚀 Starting Comprehensive Website Analysis\n');
  console.log('Following 10 Best Practices:');
  console.log('1. Factual Accuracy Above All');
  console.log('2. Preserve Author Voice and Style');
  console.log('3. Complete Information');
  console.log('4. Visual Hierarchy and Readability');
  console.log('5. Accessibility First');
  console.log('6. Link Integrity');
  console.log('7. Responsive Design');
  console.log('8. Performance and Load Times');
  console.log('9. Professional Presentation');
  console.log('10. Continuous Verification\n');

  try {
    console.log('📡 Fetching homepage...');
    const response = await axios.get(results.baseUrl);
    const html = response.data;
    const $ = cheerio.load(html);

    console.log('✅ Page loaded successfully\n');

    // ==================== PHASE 2: VISUAL/STRUCTURE INSPECTION ====================
    console.log('📊 PHASE 2: Structure and Visual Analysis');
    console.log('═══════════════════════════════════════════════════\n');

    // Check heading hierarchy
    console.log('🔍 Checking Heading Hierarchy...');
    const headings = {};
    ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'].forEach(tag => {
      const elements = $(tag);
      headings[tag] = {
        count: elements.length,
        texts: elements.map((i, el) => $(el).text().trim().substring(0, 60)).get()
      };
      if (elements.length > 0) {
        console.log(`   ${tag.toUpperCase()}: ${elements.length} found`);
        elements.each((i, el) => {
          const text = $(el).text().trim();
          if (text) console.log(`      - "${text.substring(0, 50)}${text.length > 50 ? '...' : ''}"`);
        });
      }
    });

    results.accessibility.headings = headings;

    if (headings.h1.count !== 1) {
      results.warnings.push({
        test: 'Heading Hierarchy',
        detail: `Found ${headings.h1.count} H1 tags, should be exactly 1`,
        severity: 'high'
      });
      console.log(`   ⚠️  WARNING: ${headings.h1.count} H1 tags (should be 1)`);
    } else {
      results.passed.push({ test: 'Heading Hierarchy', detail: 'Proper H1 usage' });
      console.log(`   ✅ Proper H1 usage`);
    }

    // Check title
    console.log('\n📝 Checking Page Title...');
    const title = $('title').text();
    console.log(`   Title: "${title}"`);
    results.content.title = title;

    if (!title || title.length < 10) {
      results.warnings.push({
        test: 'Page Title',
        detail: 'Title is missing or too short',
        severity: 'medium'
      });
    } else {
      results.passed.push({ test: 'Page Title', detail: `"${title}"` });
    }

    // ==================== PHASE 3: NAVIGATION TESTING ====================
    console.log('\n🧭 PHASE 3: Navigation and Link Analysis');
    console.log('═══════════════════════════════════════════════════\n');

    console.log('🔗 Analyzing All Links...');
    const links = [];
    $('a[href]').each((i, el) => {
      const href = $(el).attr('href');
      const text = $(el).text().trim();
      const isExternal = href.startsWith('http') && !href.includes('localhost') && !href.includes('ahundt.github.io');

      links.push({
        href,
        text,
        isExternal,
        isEmpty: !text || text.length === 0
      });
    });

    console.log(`   Found ${links.length} total links`);
    const internalLinks = links.filter(l => !l.isExternal);
    const externalLinks = links.filter(l => l.isExternal);
    console.log(`   - ${internalLinks.length} internal links`);
    console.log(`   - ${externalLinks.length} external links`);

    results.links.internal = internalLinks.slice(0, 20); // Sample for report
    results.links.external = externalLinks;

    // Check for vague link text
    const vagueLinks = links.filter(link => {
      const text = link.text.toLowerCase();
      return text === 'click here' || text === 'here' || text === 'read more' || (text.length > 0 && text.length < 3);
    });

    if (vagueLinks.length > 0) {
      results.warnings.push({
        test: 'Link Text Clarity',
        detail: `${vagueLinks.length} links with unclear text`,
        severity: 'medium'
      });
      console.log(`   ⚠️  ${vagueLinks.length} links with unclear text`);
    } else {
      results.passed.push({ test: 'Link Text Clarity', detail: 'All links have descriptive text' });
      console.log(`   ✅ All links have descriptive text`);
    }

    // Check empty link text
    const emptyLinks = links.filter(l => l.isEmpty);
    if (emptyLinks.length > 0) {
      results.warnings.push({
        test: 'Empty Links',
        detail: `${emptyLinks.length} links with no text`,
        severity: 'high'
      });
      console.log(`   ⚠️  ${emptyLinks.length} links with no text content`);
    }

    // Sample external links
    console.log('\n🌐 Sample External Links:');
    externalLinks.slice(0, 5).forEach(link => {
      console.log(`   - ${link.text.substring(0, 40)}: ${link.href.substring(0, 60)}`);
    });

    // ==================== PHASE 4: CONTENT VERIFICATION ====================
    console.log('\n📚 PHASE 4: Content Verification');
    console.log('═══════════════════════════════════════════════════\n');

    // Extract email and contact info
    console.log('📧 Extracting Contact Information...');
    const contactInfo = {
      email: null,
      twitter: null,
      github: null,
      scholar: null
    };

    $('a[href^="mailto:"]').each((i, el) => {
      contactInfo.email = $(el).text().trim() || $(el).attr('href').replace('mailto:', '');
    });

    $('a[href*="twitter.com"], a[href*="x.com"]').each((i, el) => {
      contactInfo.twitter = $(el).text().trim();
    });

    $('a[href*="github.com"]').each((i, el) => {
      const href = $(el).attr('href');
      if (!href.includes('github.com/jekyll')) { // Skip Jekyll links
        contactInfo.github = $(el).text().trim();
      }
    });

    $('a[href*="scholar.google.com"]').each((i, el) => {
      contactInfo.scholar = 'Present';
    });

    console.log(`   Email: ${contactInfo.email || 'Not found'}`);
    console.log(`   Twitter: ${contactInfo.twitter || 'Not found'}`);
    console.log(`   GitHub: ${contactInfo.github || 'Not found'}`);
    console.log(`   Google Scholar: ${contactInfo.scholar || 'Not found'}`);
    results.content.contactInfo = contactInfo;

    if (!contactInfo.email) {
      results.warnings.push({
        test: 'Contact Information',
        detail: 'Email not found',
        severity: 'medium'
      });
    }

    // Extract publications
    console.log('\n📖 Extracting Publications...');
    const publications = [];

    // Look for publication patterns
    $('h4').each((i, el) => {
      const year = $(el).text().trim();
      if (/^\d{4}$/.test(year)) {
        console.log(`\n   Year: ${year}`);
        let currentEl = $(el).next();
        let pubCount = 0;

        while (currentEl.length && currentEl.prop('tagName') !== 'H4') {
          if (currentEl.prop('tagName') === 'P') {
            const strongLink = currentEl.find('strong a');
            if (strongLink.length) {
              const title = strongLink.text().trim();
              const venue = currentEl.text().split('-')[1]?.trim() || '';
              const nextP = currentEl.next('p');
              const authors = nextP.length ? nextP.text().trim() : '';

              publications.push({
                year,
                title,
                venue,
                authors: authors.substring(0, 150),
                hasLink: true
              });

              pubCount++;
              console.log(`      ${pubCount}. ${title.substring(0, 70)}${title.length > 70 ? '...' : ''}`);
            }
          }
          currentEl = currentEl.next();
        }
      }
    });

    console.log(`\n   Total publications found: ${publications.length}`);
    results.content.publications = publications;

    if (publications.length === 0) {
      results.warnings.push({
        test: 'Publications',
        detail: 'No publications found',
        severity: 'high'
      });
    } else {
      results.passed.push({
        test: 'Publications',
        detail: `${publications.length} publications found`
      });
    }

    // Check for promotional language
    console.log('\n✅ Checking Tone and Style...');
    const bodyText = $('body').text().toLowerCase();
    const promotionalWords = ['amazing', 'incredible', 'outstanding', 'exceptional', 'revolutionary', 'groundbreaking', 'awesome', 'fantastic'];
    const foundPromotional = promotionalWords.filter(word => bodyText.includes(word));

    if (foundPromotional.length > 0) {
      results.warnings.push({
        test: 'Tone Check',
        detail: `Found promotional language: ${foundPromotional.join(', ')}`,
        severity: 'low'
      });
      console.log(`   ⚠️  Promotional words found: ${foundPromotional.join(', ')}`);
    } else {
      results.passed.push({ test: 'Tone Check', detail: 'No promotional language detected' });
      console.log(`   ✅ No promotional language detected - maintains factual tone`);
    }

    // ==================== PHASE 5: ACCESSIBILITY ====================
    console.log('\n♿ PHASE 5: Accessibility Testing');
    console.log('═══════════════════════════════════════════════════\n');

    // Check images
    console.log('🖼️  Checking Images...');
    const images = [];
    $('img').each((i, el) => {
      const src = $(el).attr('src');
      const alt = $(el).attr('alt');
      images.push({
        src,
        alt: alt || null,
        hasAlt: !!alt && alt.length > 0
      });
    });

    console.log(`   Found ${images.length} images`);
    const imagesWithoutAlt = images.filter(img => !img.hasAlt);

    if (imagesWithoutAlt.length > 0) {
      results.warnings.push({
        test: 'Image Alt Text',
        detail: `${imagesWithoutAlt.length} images missing alt text`,
        severity: 'high'
      });
      console.log(`   ⚠️  ${imagesWithoutAlt.length} images missing alt text`);
      imagesWithoutAlt.forEach(img => {
        console.log(`      - ${img.src}`);
      });
    } else if (images.length > 0) {
      results.passed.push({ test: 'Image Alt Text', detail: 'All images have alt text' });
      console.log(`   ✅ All images have alt text`);
    }

    results.accessibility.images = images;

    // Check for semantic HTML
    console.log('\n🏗️  Checking Semantic Structure...');
    const semanticElements = {
      main: $('main').length,
      nav: $('nav').length,
      header: $('header').length,
      footer: $('footer').length,
      article: $('article').length,
      section: $('section').length
    };

    console.log(`   <main>: ${semanticElements.main}`);
    console.log(`   <nav>: ${semanticElements.nav}`);
    console.log(`   <header>: ${semanticElements.header}`);
    console.log(`   <footer>: ${semanticElements.footer}`);

    results.structure.semantic = semanticElements;

    // ==================== CONTENT LENGTH & COMPLETENESS ====================
    console.log('\n📏 Checking Content Completeness...');
    const mainContent = $('body').text().trim();
    const wordCount = mainContent.split(/\s+/).length;
    console.log(`   Word count: ${wordCount}`);
    results.content.wordCount = wordCount;

    if (wordCount < 100) {
      results.warnings.push({
        test: 'Content Length',
        detail: `Only ${wordCount} words found - may be incomplete`,
        severity: 'high'
      });
    } else {
      results.passed.push({
        test: 'Content Length',
        detail: `${wordCount} words`
      });
    }

  } catch (error) {
    console.error('\n❌ Error during analysis:', error.message);
    results.failed.push({ test: 'General', error: error.message });
  }

  // ==================== GENERATE REPORT ====================
  console.log('\n\n📊 GENERATING COMPREHENSIVE REPORT');
  console.log('═══════════════════════════════════════════════════\n');

  const reportPath = '/tmp/website-analysis-report.json';
  fs.writeFileSync(reportPath, JSON.stringify(results, null, 2));
  console.log(`✅ Full report saved to: ${reportPath}\n`);

  // Generate markdown summary
  const mdReport = generateMarkdownReport(results);
  const mdPath = '/tmp/website-analysis-report.md';
  fs.writeFileSync(mdPath, mdReport);
  console.log(`📄 Markdown report saved to: ${mdPath}\n`);

  // Summary
  console.log('📈 ANALYSIS SUMMARY');
  console.log('═══════════════════════════════════════════════════');
  console.log(`✅ Passed: ${results.passed.length}`);
  console.log(`⚠️  Warnings: ${results.warnings.length}`);
  console.log(`❌ Failed: ${results.failed.length}`);
  console.log(`🔗 Links Found: ${results.links.internal.length + results.links.external.length}`);
  console.log(`📚 Publications: ${results.content.publications?.length || 0}`);
  console.log(`📝 Word Count: ${results.content.wordCount || 0}`);

  if (results.warnings.length > 0) {
    console.log('\n⚠️  WARNINGS (by severity):');
    const sortedWarnings = results.warnings.sort((a, b) => {
      const priority = { high: 0, medium: 1, low: 2 };
      return priority[a.severity] - priority[b.severity];
    });
    sortedWarnings.forEach((w, i) => {
      console.log(`   ${i + 1}. [${w.severity.toUpperCase()}] ${w.test}: ${w.detail}`);
    });
  }

  if (results.failed.length > 0) {
    console.log('\n❌ FAILURES:');
    results.failed.forEach((f, i) => {
      console.log(`   ${i + 1}. ${f.test}: ${f.error || f.detail}`);
    });
  }

  console.log('\n✨ Analysis complete!\n');
  return results;
}

function generateMarkdownReport(results) {
  let md = `# Website Analysis Report\n\n`;
  md += `**Generated:** ${results.timestamp}\n\n`;
  md += `**Base URL:** ${results.baseUrl}\n\n`;

  md += `## Summary\n\n`;
  md += `- ✅ Passed: ${results.passed.length}\n`;
  md += `- ⚠️  Warnings: ${results.warnings.length}\n`;
  md += `- ❌ Failed: ${results.failed.length}\n\n`;

  if (results.content.publications && results.content.publications.length > 0) {
    md += `## Publications Found (${results.content.publications.length})\n\n`;
    const pubsByYear = {};
    results.content.publications.forEach(pub => {
      if (!pubsByYear[pub.year]) pubsByYear[pub.year] = [];
      pubsByYear[pub.year].push(pub);
    });
    Object.keys(pubsByYear).sort().reverse().forEach(year => {
      md += `### ${year}\n\n`;
      pubsByYear[year].forEach(pub => {
        md += `- **${pub.title}**\n`;
        if (pub.venue) md += `  - *${pub.venue}*\n`;
        if (pub.authors) md += `  - ${pub.authors}\n`;
        md += `\n`;
      });
    });
  }

  if (results.warnings.length > 0) {
    md += `## Warnings\n\n`;
    results.warnings.forEach(w => {
      md += `- **[${w.severity.toUpperCase()}]** ${w.test}: ${w.detail}\n`;
    });
    md += `\n`;
  }

  return md;
}

// Run the analysis
analyzeWebsite().catch(console.error);
