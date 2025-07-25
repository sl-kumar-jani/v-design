const puppeteer = require("puppeteer");
const fs = require("fs");
const path = require("path");

async function generateSocialPreview() {
  console.log("🚀 Starting social preview generation...");

  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  // Set viewport to social media preview dimensions
  await page.setViewport({ width: 1200, height: 630 });

  // Navigate to the social preview generator
  const htmlPath = path.join(
    __dirname,
    "../public/social-preview-generator.html"
  );
  await page.goto(`file://${htmlPath}`);

  // Wait for the page to load
  await page.waitForTimeout(2000);

  // Take a screenshot
  const screenshotPath = path.join(
    __dirname,
    "../public/images/social-preview.jpg"
  );
  await page.screenshot({
    path: screenshotPath,
    type: "jpeg",
    quality: 90,
  });

  console.log("✅ Social preview image generated successfully!");
  console.log(`📁 Saved to: ${screenshotPath}`);

  await browser.close();
}

// Test social media preview URLs
async function testSocialPreview() {
  console.log("🔍 Testing social media preview...");

  const testUrls = [
    "https://www.vdesignbyvirali.in",
    "https://developers.facebook.com/tools/debug/",
    "https://cards-dev.twitter.com/validator",
    "https://www.linkedin.com/post-inspector/",
  ];

  console.log("\n📋 Test your social media preview at these URLs:");
  testUrls.forEach((url, index) => {
    console.log(`${index + 1}. ${url}`);
  });

  console.log("\n💡 Instructions:");
  console.log("1. Copy your website URL");
  console.log(
    "2. Paste it into the Facebook Debugger to test Facebook/WhatsApp sharing"
  );
  console.log("3. Use Twitter Card Validator to test Twitter sharing");
  console.log("4. Use LinkedIn Post Inspector to test LinkedIn sharing");
}

// Check if puppeteer is available
async function checkDependencies() {
  try {
    require("puppeteer");
    return true;
  } catch (error) {
    console.log(
      "⚠️  Puppeteer not found. Install it with: npm install puppeteer"
    );
    return false;
  }
}

async function main() {
  const hasPuppeteer = await checkDependencies();

  if (hasPuppeteer) {
    await generateSocialPreview();
  }

  await testSocialPreview();
}

if (require.main === module) {
  main().catch(console.error);
}

module.exports = { generateSocialPreview, testSocialPreview };
