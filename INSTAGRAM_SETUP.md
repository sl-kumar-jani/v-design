# Instagram Integration Setup Guide

This guide will help you connect your real Instagram account to the reels section of your website.

## Prerequisites

1. A Facebook Developer account
2. An Instagram Business or Creator account
3. A Facebook Page connected to your Instagram account

## Step 1: Create a Facebook App

1. Go to [Facebook Developers](https://developers.facebook.com/)
2. Click "Create App"
3. Choose "Consumer" as the app type
4. Fill in your app details:
   - App Name: "V Design Website"
   - Contact Email: Your email
   - Purpose: "Yourself or your own business"

## Step 2: Configure Instagram Basic Display API

1. In your Facebook App dashboard, go to "Add Product"
2. Find "Instagram Basic Display" and click "Set Up"
3. Go to "Instagram Basic Display" > "Basic Display"
4. Click "Create New App"
5. Fill in the required fields:
   - Display Name: "V Design Website"
   - Valid OAuth Redirect URIs: `https://yourdomain.com/auth/callback` (replace with your domain)
   - Deauthorize Callback URL: `https://yourdomain.com/auth/deauthorize`
   - Data Deletion Request URL: `https://yourdomain.com/auth/delete`

## Step 3: Get Your Access Token

### Option A: Using Graph API Explorer (Recommended for testing)

1. Go to [Graph API Explorer](https://developers.facebook.com/tools/explorer/)
2. Select your app from the dropdown
3. Click "Get User Access Token"
4. Select these permissions:
   - `instagram_basic`
   - `pages_show_list`
   - `instagram_graph_user_profile` (for engagement data)
   - `instagram_graph_user_media` (for engagement data)
5. Click "Generate Access Token"
6. Copy the token and test it by making a request to: `https://graph.instagram.com/me/media?fields=id,caption,like_count,comments_count&access_token=YOUR_TOKEN`

### Option B: For Real Engagement Data (Business Account Required)

To get real likes and comments count, you need:

1. **Instagram Business Account** connected to a Facebook Page
2. **Instagram Graph API** access (not Basic Display API)
3. **App Review** for production use

Steps:

1. Convert your Instagram to a Business account
2. Connect it to a Facebook Page
3. In your Facebook App, add "Instagram Graph API" product
4. Request permissions: `instagram_graph_user_profile`, `instagram_graph_user_media`
5. Submit for app review (required for production)

### Option B: Manual Authorization Flow

1. Create an authorization URL:

   ```
   https://api.instagram.com/oauth/authorize
     ?client_id={app-id}
     &redirect_uri={redirect-uri}
     &scope=user_profile,user_media
     &response_type=code
   ```

2. Visit the URL and authorize your app
3. Exchange the code for an access token using your app's backend

## Step 4: Configure Environment Variables

Add the following to your `.env.local` file:

```bash
# Instagram Basic Display API Configuration
INSTAGRAM_ACCESS_TOKEN=your_long_lived_access_token_here
```

## Step 5: Test the Integration

1. Start your development server: `npm run dev`
2. Navigate to your website's reels section
3. You should see a "✨ Live from Instagram" indicator if the integration is working
4. If you see "📱 Demo content (Instagram API not configured)", check your environment variables

## Step 6: Long-lived Access Tokens

Instagram access tokens expire after 1 hour by default. To get a long-lived token (60 days):

1. Use the short-lived token to get a long-lived one:

   ```bash
   curl -i -X GET "https://graph.instagram.com/access_token
     ?grant_type=ig_exchange_token
     &client_secret={app-secret}
     &access_token={short-lived-token}"
   ```

2. The response will contain a long-lived token that lasts 60 days

## Step 7: Token Refresh (Optional)

To automatically refresh tokens before they expire, you can use the refresh endpoint:

```bash
curl -i -X GET "https://graph.instagram.com/refresh_access_token
  ?grant_type=ig_refresh_token
  &access_token={long-lived-token}"
```

## Troubleshooting

### Common Issues

1. **"Instagram access token is not configured"**

   - Check that `INSTAGRAM_ACCESS_TOKEN` is set in your `.env.local` file
   - Restart your development server after adding the token

2. **"Instagram API error: 400"**

   - Your access token may be expired or invalid
   - Generate a new token following Step 3

3. **"No Instagram reels found"**

   - Make sure your Instagram account has video posts (reels)
   - Check that your account is set to Business or Creator

4. **CORS errors**
   - This integration uses server-side API calls, so CORS shouldn't be an issue
   - If you see CORS errors, check your API endpoint configuration

### API Limitations

- Instagram Basic Display API has rate limits (200 requests per hour per user)
- The API only returns your own content, not content from other accounts
- Video URLs from Instagram may have CORS restrictions for direct playback

### Engagement Data Limitations

**❌ What Instagram APIs DON'T Provide:**

- **View counts for reels** (not available in any public API)
- **Story views** (limited access)
- **Reach and impressions** (only via Instagram Insights API for businesses)

**✅ What Instagram APIs CAN Provide:**

- **Like counts** (via Instagram Graph API - requires business account)
- **Comments count** (via Instagram Graph API - requires business account)
- **Basic media data** (via Basic Display API - personal accounts)

**🔄 Current Implementation:**

- Real like counts when using Instagram Graph API with business account
- Generated realistic view counts (Instagram doesn't provide real view counts)
- Fallback to generated numbers when API is unavailable

## Security Notes

- Never commit your access token to version control
- Use environment variables for all sensitive data
- Consider implementing token refresh logic for production
- Monitor your API usage to stay within rate limits

## Production Deployment

When deploying to production:

1. Add your production domain to the Valid OAuth Redirect URIs
2. Set the `INSTAGRAM_ACCESS_TOKEN` environment variable in your hosting platform
3. Consider implementing a token refresh mechanism
4. Monitor API usage and implement caching if needed

For more information, visit the [Instagram Basic Display API Documentation](https://developers.facebook.com/docs/instagram-basic-display-api).
