# Social Media Preview Fix Guide

## Problem

When sharing your website link on social media platforms (WhatsApp, Facebook, Twitter, LinkedIn), it shows a generic placeholder image instead of your website's image.

## Solution

### 1. Immediate Fix (Already Applied)

I've updated your `app/layout.tsx` to use your existing `about-background.jpg` image for social media previews. This should work immediately.

### 2. Create a Better Social Media Preview Image

#### Option A: Use the HTML Generator (Recommended)

1. Open `public/social-preview-generator.html` in your browser
2. Take a screenshot of the preview area (1200x630px)
3. Save it as `social-preview.jpg` in the `public/images/` folder
4. Update the layout.tsx to use this new image

#### Option B: Create a Custom Image

Create an image with these specifications:

- **Dimensions**: 1200x630 pixels (16:9 aspect ratio)
- **Format**: JPG or PNG
- **Content**: Your logo, company name, and a tagline
- **Colors**: Use your brand colors (#365545)
- **File name**: `social-preview.jpg`
- **Location**: `public/images/social-preview.jpg`

### 3. Update the Layout File

Once you have the new image, update `app/layout.tsx`:

```typescript
// Replace the OpenGraph images array
images: [
  {
    url: "/images/social-preview.jpg", // Use your new image
    width: 1200,
    height: 630,
    alt: "V Design Studio - Premium Architecture and Interior Design in Pune",
  },
],

// Update Twitter image
twitter: {
  // ... other properties
  images: ["/images/social-preview.jpg"], // Use your new image
},
```

### 4. Test Your Social Media Preview

#### Facebook/WhatsApp Debugger

1. Go to: https://developers.facebook.com/tools/debug/
2. Enter your website URL: `https://www.vdesignbyvirali.in`
3. Click "Debug"
4. If needed, click "Scrape Again" to refresh the cache

#### Twitter Card Validator

1. Go to: https://cards-dev.twitter.com/validator
2. Enter your website URL
3. Click "Preview card"

#### LinkedIn Post Inspector

1. Go to: https://www.linkedin.com/post-inspector/
2. Enter your website URL
3. Click "Inspect"

### 5. Clear Social Media Cache

If the old image still appears:

- **Facebook**: Use the Facebook Debugger and click "Scrape Again"
- **Twitter**: Use the Twitter Card Validator
- **LinkedIn**: Use the LinkedIn Post Inspector
- **WhatsApp**: Clear your WhatsApp cache or try sharing to a different chat

### 6. Automated Testing (Optional)

If you have Node.js installed:

```bash
# Install puppeteer (if not already installed)
npm install puppeteer

# Run the test script
node scripts/test-social-preview.js
```

## Current Status

✅ **Fixed**: Updated layout.tsx to use `about-background.jpg`  
✅ **Added**: Comprehensive social media meta tags  
✅ **Created**: Social preview generator HTML file  
✅ **Created**: Testing script

## Next Steps

1. **Immediate**: Your website should now show the about-background image when shared
2. **Recommended**: Create a custom social preview image using the HTML generator
3. **Test**: Use the debugger tools to verify the preview works correctly

## Troubleshooting

- If images still don't appear, check that your images are publicly accessible
- Ensure your website is accessible (not behind a firewall)
- Some platforms cache previews for 24-48 hours
- Make sure your images are under 5MB in size

## File Locations

- **Layout file**: `app/layout.tsx`
- **Image generator**: `public/social-preview-generator.html`
- **Test script**: `scripts/test-social-preview.js`
- **Images folder**: `public/images/`
