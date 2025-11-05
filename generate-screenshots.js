const { firefox } = require('playwright');
const fs = require('fs');

async function generateScreenshots() {
  console.log('📸 GENERATING VISUAL SCREENSHOTS\n');
  console.log('═══════════════════════════════════════════════════\n');

  const browser = await firefox.launch({
    headless: true,
    args: ['--no-sandbox']
  });

  const context = await browser.newContext({
    ignoreHTTPSErrors: true
  });

  const page = await context.newPage();

  const viewports = [
    { name: 'mobile-portrait', width: 375, height: 667, desc: 'Mobile Portrait (iPhone SE)' },
    { name: 'mobile-landscape', width: 667, height: 375, desc: 'Mobile Landscape' },
    { name: 'tablet', width: 768, height: 1024, desc: 'Tablet (iPad)' },
    { name: 'laptop', width: 1366, height: 768, desc: 'Laptop' },
    { name: 'desktop', width: 1920, height: 1080, desc: 'Desktop HD' }
  ];

  const screenshots = [];

  try {
    console.log('🌐 Loading website at http://localhost:4000\n');
    await page.goto('http://localhost:4000', {
      waitUntil: 'networkidle',
      timeout: 30000
    });

    console.log('✅ Page loaded successfully\n');

    for (const viewport of viewports) {
      console.log(`📱 Capturing ${viewport.desc} (${viewport.width}x${viewport.height})`);

      await page.setViewportSize({
        width: viewport.width,
        height: viewport.height
      });

      // Wait a moment for any responsive changes to apply
      await page.waitForTimeout(500);

      // Full page screenshot
      const fullPath = `/tmp/screenshot-${viewport.name}-full.png`;
      await page.screenshot({
        path: fullPath,
        fullPage: true
      });
      console.log(`   ✓ Full page: ${fullPath}`);

      // Above-the-fold screenshot
      const foldPath = `/tmp/screenshot-${viewport.name}-fold.png`;
      await page.screenshot({
        path: foldPath,
        fullPage: false
      });
      console.log(`   ✓ Above fold: ${foldPath}`);

      screenshots.push({
        viewport: viewport.name,
        description: viewport.desc,
        dimensions: `${viewport.width}x${viewport.height}`,
        fullPage: fullPath,
        aboveFold: foldPath
      });

      console.log();
    }

    console.log('✨ Screenshot generation complete!\n');
    console.log('📊 SUMMARY:');
    console.log(`   Total viewports tested: ${viewports.length}`);
    console.log(`   Total screenshots: ${screenshots.length * 2}`);
    console.log(`   Location: /tmp/screenshot-*.png\n`);

    // Save manifest
    const manifest = {
      timestamp: new Date().toISOString(),
      url: 'http://localhost:4000',
      screenshots: screenshots
    };

    fs.writeFileSync('/tmp/screenshot-manifest.json', JSON.stringify(manifest, null, 2));
    console.log('   📄 Manifest saved: /tmp/screenshot-manifest.json\n');

    // List all files
    console.log('📁 Generated Files:');
    screenshots.forEach(s => {
      console.log(`   ${s.viewport}:`);
      console.log(`      Full: ${s.fullPage}`);
      console.log(`      Fold: ${s.aboveFold}`);
    });

  } catch (error) {
    console.error('\n❌ Error generating screenshots:', error.message);
    throw error;
  } finally {
    await browser.close();
  }
}

generateScreenshots().catch(console.error);
