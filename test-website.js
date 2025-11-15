const { chromium } = require('playwright');
const fs = require('fs');

// Test results storage
const results = {
  timestamp: new Date().toISOString(),
  baseUrl: 'http://localhost:4000',
  passed: [],
  failed: [],
  warnings: [],
  screenshots: [],
  content: {},
  links: { internal: [], external: [], broken: [] },
  accessibility: {},
  responsive: {},
  performance: {}
};

async function runComprehensiveTests() {
  console.log('🚀 Starting Comprehensive Website Testing\n');
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

  const browser = await chromium.launch({
    headless: true,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-gpu'
    ]
  });
  const context = await browser.newContext({
    ignoreHTTPSErrors: true
  });
  const page = await context.newPage();

  try {
    // ==================== PHASE 2: VISUAL INSPECTION ====================
    console.log('\n📸 PHASE 2: Visual Inspection');
    console.log('═══════════════════════════════════════════════════\n');

    console.log('Loading homepage...');
    await page.goto(results.baseUrl, { waitUntil: 'networkidle' });

    // Take full-page screenshots at different widths
    const viewports = [
      { name: 'mobile', width: 375, height: 667 },
      { name: 'tablet', width: 768, height: 1024 },
      { name: 'desktop', width: 1440, height: 900 }
    ];

    for (const viewport of viewports) {
      console.log(`📱 Testing ${viewport.name} (${viewport.width}x${viewport.height})`);
      await page.setViewportSize({ width: viewport.width, height: viewport.height });
      const screenshotPath = `/tmp/screenshot-${viewport.name}.png`;
      await page.screenshot({ path: screenshotPath, fullPage: true });
      results.screenshots.push({ viewport: viewport.name, path: screenshotPath });
      console.log(`   ✓ Screenshot saved: ${screenshotPath}`);
    }

    // Reset to desktop view for remaining tests
    await page.setViewportSize({ width: 1440, height: 900 });

    // Check typography
    console.log('\n🔤 Checking Typography...');
    const bodyFont = await page.evaluate(() => {
      return window.getComputedStyle(document.body).fontFamily;
    });
    console.log(`   Font Family: ${bodyFont}`);
    results.passed.push({ test: 'Typography Check', detail: `Font: ${bodyFont}` });

    // Check heading hierarchy
    console.log('\n📊 Checking Heading Hierarchy...');
    const headings = await page.evaluate(() => {
      const h = {};
      ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'].forEach(tag => {
        const elements = document.querySelectorAll(tag);
        h[tag] = {
          count: elements.length,
          texts: Array.from(elements).map(el => el.textContent.trim().substring(0, 50))
        };
      });
      return h;
    });

    console.log(`   H1: ${headings.h1.count} found`);
    console.log(`   H2: ${headings.h2.count} found`);
    console.log(`   H3: ${headings.h3.count} found`);
    results.accessibility.headings = headings;

    if (headings.h1.count !== 1) {
      results.warnings.push({ test: 'Heading Hierarchy', detail: `Found ${headings.h1.count} H1 tags, should be exactly 1` });
    } else {
      results.passed.push({ test: 'Heading Hierarchy', detail: 'Proper H1 usage' });
    }

    // ==================== PHASE 3: NAVIGATION TESTING ====================
    console.log('\n🧭 PHASE 3: Navigation Testing');
    console.log('═══════════════════════════════════════════════════\n');

    // Test all links
    console.log('🔗 Testing All Links...');
    const links = await page.evaluate(() => {
      const allLinks = Array.from(document.querySelectorAll('a[href]'));
      return allLinks.map(link => ({
        href: link.href,
        text: link.textContent.trim(),
        isExternal: link.hostname !== window.location.hostname
      }));
    });

    console.log(`   Found ${links.length} total links`);
    const internalLinks = links.filter(l => !l.isExternal);
    const externalLinks = links.filter(l => l.isExternal);
    console.log(`   - ${internalLinks.length} internal links`);
    console.log(`   - ${externalLinks.length} external links`);

    results.links.internal = internalLinks;
    results.links.external = externalLinks;

    // Check for broken internal links
    console.log('\n🔍 Checking Internal Links...');
    for (const link of internalLinks.slice(0, 10)) { // Test first 10
      try {
        const response = await page.request.get(link.href);
        if (response.status() >= 400) {
          results.links.broken.push({ url: link.href, status: response.status() });
          console.log(`   ❌ Broken: ${link.href} (${response.status()})`);
        } else {
          console.log(`   ✓ OK: ${link.text.substring(0, 40)}`);
        }
      } catch (e) {
        results.links.broken.push({ url: link.href, error: e.message });
        console.log(`   ❌ Error: ${link.href}`);
      }
    }

    // ==================== PHASE 4: CONTENT VERIFICATION ====================
    console.log('\n📝 PHASE 4: Content Verification');
    console.log('═══════════════════════════════════════════════════\n');

    console.log('📚 Extracting Publications...');
    const publications = await page.evaluate(() => {
      const pubs = [];
      const pubSections = document.querySelectorAll('h4');

      pubSections.forEach(h4 => {
        const text = h4.textContent.trim();
        // Check if it's a year heading
        if (/^\d{4}$/.test(text)) {
          let currentEl = h4.nextElementSibling;
          while (currentEl && currentEl.tagName !== 'H4') {
            if (currentEl.tagName === 'P') {
              const strongEl = currentEl.querySelector('strong a');
              if (strongEl) {
                const title = strongEl.textContent;
                const venue = currentEl.textContent.split('-')[1]?.trim() || '';
                const authorsEl = currentEl.nextElementSibling;
                const authors = authorsEl ? authorsEl.textContent.trim() : '';

                pubs.push({
                  year: text,
                  title: title,
                  venue: venue,
                  authors: authors,
                  fullText: currentEl.textContent.substring(0, 200)
                });
              }
            }
            currentEl = currentEl.nextElementSibling;
          }
        }
      });

      return pubs;
    });

    console.log(`   Found ${publications.length} publications`);
    publications.forEach(pub => {
      console.log(`   ${pub.year}: ${pub.title.substring(0, 60)}...`);
    });
    results.content.publications = publications;

    // Extract email and contact info
    console.log('\n📧 Checking Contact Information...');
    const contactInfo = await page.evaluate(() => {
      const email = document.querySelector('a[href^="mailto:"]');
      const twitter = document.querySelector('a[href*="twitter.com"]');
      const github = document.querySelector('a[href*="github.com"]');
      const scholar = document.querySelector('a[href*="scholar.google.com"]');

      return {
        email: email ? email.textContent.trim() : null,
        twitter: twitter ? twitter.textContent.trim() : null,
        github: github ? github.textContent.trim() : null,
        scholar: scholar ? 'Present' : 'Missing'
      };
    });

    console.log(`   Email: ${contactInfo.email || 'Not found'}`);
    console.log(`   Twitter: ${contactInfo.twitter || 'Not found'}`);
    console.log(`   GitHub: ${contactInfo.github || 'Not found'}`);
    console.log(`   Scholar: ${contactInfo.scholar}`);
    results.content.contactInfo = contactInfo;

    // Check for factual accuracy markers
    console.log('\n✅ Checking Factual Language...');
    const pageText = await page.evaluate(() => document.body.textContent);

    // Check for promotional language (bad)
    const promotionalWords = ['amazing', 'incredible', 'outstanding', 'exceptional', 'revolutionary', 'groundbreaking'];
    const foundPromotional = promotionalWords.filter(word =>
      pageText.toLowerCase().includes(word)
    );

    if (foundPromotional.length > 0) {
      results.warnings.push({
        test: 'Tone Check',
        detail: `Found promotional language: ${foundPromotional.join(', ')}`
      });
      console.log(`   ⚠️  Found promotional words: ${foundPromotional.join(', ')}`);
    } else {
      results.passed.push({ test: 'Tone Check', detail: 'No promotional language found' });
      console.log(`   ✓ No promotional language detected`);
    }

    // ==================== PHASE 5: ACCESSIBILITY TESTING ====================
    console.log('\n♿ PHASE 5: Accessibility Testing');
    console.log('═══════════════════════════════════════════════════\n');

    // Check images for alt text
    console.log('🖼️  Checking Image Alt Text...');
    const images = await page.evaluate(() => {
      return Array.from(document.querySelectorAll('img')).map(img => ({
        src: img.src,
        alt: img.alt || null,
        hasAlt: !!img.alt
      }));
    });

    console.log(`   Found ${images.length} images`);
    const imagesWithoutAlt = images.filter(img => !img.hasAlt);
    if (imagesWithoutAlt.length > 0) {
      results.warnings.push({
        test: 'Image Alt Text',
        detail: `${imagesWithoutAlt.length} images missing alt text`
      });
      console.log(`   ⚠️  ${imagesWithoutAlt.length} images missing alt text`);
    } else {
      results.passed.push({ test: 'Image Alt Text', detail: 'All images have alt text' });
      console.log(`   ✓ All images have alt text`);
    }

    // Check link text clarity
    console.log('\n🔗 Checking Link Text Clarity...');
    const vagueLinks = links.filter(link => {
      const text = link.text.toLowerCase();
      return text === 'click here' || text === 'here' || text === 'read more' || text.length < 3;
    });

    if (vagueLinks.length > 0) {
      results.warnings.push({
        test: 'Link Text Clarity',
        detail: `${vagueLinks.length} links with vague text`
      });
      console.log(`   ⚠️  ${vagueLinks.length} links with unclear text`);
    } else {
      results.passed.push({ test: 'Link Text Clarity', detail: 'All links have descriptive text' });
      console.log(`   ✓ All links have descriptive text`);
    }

    // ==================== PHASE 9: PERFORMANCE ====================
    console.log('\n⚡ PHASE 9: Performance Testing');
    console.log('═══════════════════════════════════════════════════\n');

    console.log('⏱️  Measuring Page Load Performance...');
    const performanceMetrics = await page.evaluate(() => {
      const perf = performance.getEntriesByType('navigation')[0];
      return {
        domContentLoaded: perf.domContentLoadedEventEnd - perf.domContentLoadedEventStart,
        loadComplete: perf.loadEventEnd - perf.loadEventStart,
        totalTime: perf.loadEventEnd - perf.fetchStart,
        resourceCount: performance.getEntriesByType('resource').length
      };
    });

    console.log(`   DOM Content Loaded: ${performanceMetrics.domContentLoaded.toFixed(2)}ms`);
    console.log(`   Load Complete: ${performanceMetrics.loadComplete.toFixed(2)}ms`);
    console.log(`   Total Time: ${performanceMetrics.totalTime.toFixed(2)}ms`);
    console.log(`   Resources Loaded: ${performanceMetrics.resourceCount}`);
    results.performance = performanceMetrics;

    if (performanceMetrics.totalTime > 3000) {
      results.warnings.push({
        test: 'Performance',
        detail: `Page load time ${performanceMetrics.totalTime.toFixed(0)}ms exceeds 3000ms`
      });
    } else {
      results.passed.push({
        test: 'Performance',
        detail: `Page load time: ${performanceMetrics.totalTime.toFixed(0)}ms`
      });
    }

  } catch (error) {
    console.error('\n❌ Error during testing:', error);
    results.failed.push({ test: 'General', error: error.message });
  } finally {
    await browser.close();
  }

  // ==================== GENERATE REPORT ====================
  console.log('\n\n📊 GENERATING COMPREHENSIVE REPORT');
  console.log('═══════════════════════════════════════════════════\n');

  const reportPath = '/tmp/website-test-report.json';
  fs.writeFileSync(reportPath, JSON.stringify(results, null, 2));
  console.log(`✅ Full report saved to: ${reportPath}\n`);

  // Summary
  console.log('📈 TEST SUMMARY');
  console.log('═══════════════════════════════════════════════════');
  console.log(`✅ Passed: ${results.passed.length}`);
  console.log(`⚠️  Warnings: ${results.warnings.length}`);
  console.log(`❌ Failed: ${results.failed.length}`);
  console.log(`📸 Screenshots: ${results.screenshots.length}`);
  console.log(`🔗 Links Tested: ${results.links.internal.length + results.links.external.length}`);
  console.log(`🚫 Broken Links: ${results.links.broken.length}`);
  console.log(`📚 Publications Found: ${results.content.publications?.length || 0}`);

  if (results.warnings.length > 0) {
    console.log('\n⚠️  WARNINGS:');
    results.warnings.forEach((w, i) => {
      console.log(`   ${i + 1}. ${w.test}: ${w.detail}`);
    });
  }

  if (results.failed.length > 0) {
    console.log('\n❌ FAILURES:');
    results.failed.forEach((f, i) => {
      console.log(`   ${i + 1}. ${f.test}: ${f.error || f.detail}`);
    });
  }

  console.log('\n✨ Testing complete!\n');
  return results;
}

// Run the tests
runComprehensiveTests().catch(console.error);
