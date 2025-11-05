const { webkit } = require('playwright');

async function takeScreenshots() {
  console.log('📸 Taking screenshots with WebKit...\n');

  const browser = await webkit.launch({
    headless: true
  });

  const page = await browser.newPage();

  try {
    console.log('🌐 Loading http://localhost:4000...');
    await page.goto('http://localhost:4000', {
      waitUntil: 'networkidle',
      timeout: 30000
    });

    console.log('✅ Page loaded\n');

    const viewports = [
      { name: 'mobile', width: 375, height: 667, desc: 'Mobile (iPhone SE)' },
      { name: 'tablet', width: 768, height: 1024, desc: 'Tablet (iPad)' },
      { name: 'desktop', width: 1440, height: 900, desc: 'Desktop' }
    ];

    for (const viewport of viewports) {
      console.log(`📱 ${viewport.desc} (${viewport.width}x${viewport.height})`);

      await page.setViewportSize({
        width: viewport.width,
        height: viewport.height
      });

      await page.waitForTimeout(500);

      // Full page screenshot
      const fullPath = `/tmp/screenshot-${viewport.name}-full.png`;
      await page.screenshot({
        path: fullPath,
        fullPage: true
      });
      console.log(`   ✓ Full: ${fullPath}`);

      // Above the fold
      const foldPath = `/tmp/screenshot-${viewport.name}-fold.png`;
      await page.screenshot({
        path: foldPath,
        fullPage: false
      });
      console.log(`   ✓ Fold: ${foldPath}\n`);
    }

    console.log('✨ Screenshots complete!\n');
    console.log('📁 Files saved to:');
    console.log('   /tmp/screenshot-mobile-*.png');
    console.log('   /tmp/screenshot-tablet-*.png');
    console.log('   /tmp/screenshot-desktop-*.png\n');

  } catch (error) {
    console.error('❌ Error:', error.message);
    throw error;
  } finally {
    await browser.close();
  }
}

takeScreenshots().catch(console.error);
