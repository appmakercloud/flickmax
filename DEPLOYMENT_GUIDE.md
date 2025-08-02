# FlickMax Deployment Guide to Vercel

## Prerequisites
- A Vercel account (free tier is sufficient)
- Git repository (GitHub, GitLab, or Bitbucket)
- Node.js 18+ installed locally

## Step 1: Prepare Your Project

1. **Commit all changes**
   ```bash
   git add .
   git commit -m "Prepare for Vercel deployment"
   git push origin main
   ```

2. **Verify build locally**
   ```bash
   npm run build
   ```
   Fix any build errors before proceeding.

## Step 2: Deploy to Vercel

### Option A: Using Vercel CLI (Recommended)

1. **Install Vercel CLI**
   ```bash
   npm i -g vercel
   ```

2. **Deploy**
   ```bash
   vercel
   ```
   
   Follow the prompts:
   - Set up and deploy: Y
   - Which scope: Select your account
   - Link to existing project?: N
   - Project name: flickmax (or your preferred name)
   - In which directory is your code located?: ./
   - Want to override settings?: N

3. **Set Environment Variables**
   ```bash
   vercel env add NEXT_PUBLIC_USE_MOCK_API
   ```
   Enter `false` when prompted (to use real API in production)

### Option B: Using Vercel Dashboard

1. **Go to [vercel.com](https://vercel.com)**
2. **Click "New Project"**
3. **Import your Git repository**
4. **Configure project:**
   - Framework Preset: Next.js (auto-detected)
   - Root Directory: ./
   - Build Command: `npm run build` (default)
   - Output Directory: `.next` (default)

5. **Add Environment Variables:**
   - Click "Environment Variables"
   - Add: `NEXT_PUBLIC_USE_MOCK_API` = `false`

6. **Click "Deploy"**

## Step 3: Test Domain Search in Production

1. **Access your deployment**
   - Vercel provides a URL like: `https://flickmax-[random].vercel.app`

2. **Test domain searches:**
   - Try searching: `flickmax.com`
   - Try searching: `flickmax.co.in`
   - Try searching: `example.ai`
   - Try searching: `testdomain.org`

3. **Monitor API behavior:**
   - Open browser DevTools > Network tab
   - Check if API calls return 200 status codes
   - Verify real pricing data is displayed

## Step 4: Configure Custom Domain (Optional)

1. **In Vercel Dashboard:**
   - Go to your project
   - Settings → Domains
   - Add your custom domain

2. **Update DNS records** as instructed by Vercel

## Environment Variables Reference

| Variable | Development | Production | Description |
|----------|------------|------------|-------------|
| `NEXT_PUBLIC_USE_MOCK_API` | `true` | `false` | Use mock data (dev) or real API (prod) |
| `NEXT_PUBLIC_DOMAIN_API_TIMEOUT` | `10000` | `10000` | API timeout in milliseconds |
| `NEXT_PUBLIC_DOMAIN_API_RETRY_COUNT` | `3` | `3` | Number of retry attempts |

## Troubleshooting

### If domain search still shows errors in production:

1. **Check Vercel Functions logs:**
   - Dashboard → Functions → View logs
   - Look for any 500 errors or API issues

2. **Verify environment variables:**
   - Dashboard → Settings → Environment Variables
   - Ensure `NEXT_PUBLIC_USE_MOCK_API` is set to `false`

3. **Check API response:**
   - Use browser DevTools
   - Look at Network tab for `/api/domain/search` calls
   - Check response headers and body

### If you need to switch back to mock data:

1. **Update environment variable:**
   - Set `NEXT_PUBLIC_USE_MOCK_API` to `true`
   - Redeploy

## Production Monitoring

1. **Set up Vercel Analytics** (free tier available)
2. **Monitor Function execution:**
   - Dashboard → Functions
   - Check execution time and error rate

3. **Set up alerts:**
   - Vercel → Settings → Notifications
   - Configure alerts for function errors

## Expected Behavior in Production

✅ **Should work:**
- API calls to GoDaddy from Vercel's servers
- Real-time domain availability checking
- Accurate pricing for all extensions
- No CORS errors
- No 500 errors from blocking

❌ **Known limitations:**
- Rate limits may apply (monitor usage)
- Some regions may have slower response times
- API may occasionally return errors for certain TLDs

## Next Steps After Deployment

1. **Monitor for 24-48 hours** to ensure stability
2. **Document any new issues** that only appear in production
3. **Consider implementing:**
   - Response caching (1-5 minutes)
   - Error logging service (Sentry, LogRocket)
   - Performance monitoring
   - API request batching for multiple searches

## Rollback Strategy

If issues occur in production:

1. **Quick fix:** Set `NEXT_PUBLIC_USE_MOCK_API` to `true` and redeploy
2. **Full rollback:** Use Vercel's instant rollback feature in dashboard

Remember: Production environment has different characteristics than development. The GoDaddy API should work properly from Vercel's servers since they have stable IPs and proper domain configuration.