# Deployment Guide for AgriLink Ledger

## Netlify Deployment

### Configuration Files Created:
1. `public/_redirects` - Handles SPA routing
2. `netlify.toml` - Netlify build configuration

### Deployment Steps:

#### Option 1: Deploy via Netlify UI
1. Go to [Netlify](https://app.netlify.com/)
2. Click "Add new site" → "Import an existing project"
3. Connect your Git repository
4. Configure build settings:
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`
5. Click "Deploy site"

#### Option 2: Deploy via Netlify CLI
```bash
# Install Netlify CLI globally
npm install -g netlify-cli

# Login to Netlify
netlify login

# Deploy from the Agritech directory
cd Agritech
netlify deploy --prod
```

### Build Settings in Netlify:
- **Base directory**: `Agritech` (if deploying from root)
- **Build command**: `npm run build`
- **Publish directory**: `dist`
- **Node version**: 18 or higher (set in Netlify environment variables if needed)

### Environment Variables:
No environment variables are required for this project as it uses mock data.

### Troubleshooting:

#### White Page Issue:
- ✅ Fixed with `_redirects` file and `netlify.toml`
- Ensures all routes redirect to `index.html` for client-side routing

#### 404 on Refresh:
- ✅ Fixed with the redirect rules
- All paths now properly handled by React Router

#### Build Fails:
- Check Node.js version (should be 18+)
- Clear cache and retry: `netlify build --clear-cache`
- Verify all dependencies are in `package.json`

### Post-Deployment:
1. Visit your deployed URL
2. You should see the login page
3. Test with credentials:
   - Farmer: `farmer@test.com` / any password
   - Warehouse: `warehouse@test.com` / any password
   - Buyer: `buyer@test.com` / any password
   - Admin: `admin@test.com` / any password

### Custom Domain (Optional):
1. Go to Site settings → Domain management
2. Add your custom domain
3. Configure DNS records as instructed by Netlify
