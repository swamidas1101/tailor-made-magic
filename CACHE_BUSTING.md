# Cache Busting Configuration

## For Loveable Deployment

When deploying to Loveable (or any hosting platform), you need to ensure proper cache headers are set:

### 1. Update version.json Before Each Deployment

**IMPORTANT**: Update the version in `public/version.json` before each deployment:

```json
{
  "version": "1.0.1",  // Increment this with each deploy
  "timestamp": "2026-02-13T12:45:00+05:30"
}
```

### 2. Deployment Platform Configuration

If Loveable provides a configuration file (like `vercel.json`, `netlify.toml`, etc.), add these cache headers:

```json
{
  "headers": [
    {
      "source": "/index.html",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "no-cache, no-store, must-revalidate"
        }
      ]
    },
    {
      "source": "/version.json",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "no-cache, no-store, must-revalidate"
        }
      ]
    },
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=31536000, immutable"
        }
      ]
    }
  ]
}
```

### 3. How It Works

1. **Meta Tags**: Added to `index.html` to discourage browser caching
2. **Version Check Hook**: Runs every 5 minutes to check for new deployments
3. **Auto-Refresh Prompt**: When a new version is detected, users are prompted to refresh
4. **Cache Clearing**: If user confirms, all service worker caches are cleared before reload

### 4. Testing

To test locally:
1. Change the version in `public/version.json`
2. Wait up to 5 minutes or reload the page
3. You should see a prompt about a new version being available

### 5. Alternative: Service Worker

For more advanced cache control, consider implementing a full service worker with Workbox.
