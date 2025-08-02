# Vercel Deployment Documentation

## Production Deployment Details

**Live URL**: https://flickmax-nto9z8m32-ashoks-projects-7231f66c.vercel.app

**Deployment Date**: August 2, 2025

**Deployment Method**: Vercel CLI

**Project Dashboard**: https://vercel.com/ashoks-projects-7231f66c/flickmax

## Environment Configuration

### Production Environment Variables

No environment variables are required. The application exclusively uses the real GoDaddy API.

### Build Configuration

```json
{
  "framework": "nextjs",
  "buildCommand": "npm run build",
  "outputDirectory": ".next",
  "functions": {
    "app/api/domain/search/route.ts": {
      "maxDuration": 30
    },
    "app/api/domain/direct/route.ts": {
      "maxDuration": 30
    }
  }
}
```

## Deployment Commands

### Initial Deployment
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy to production
vercel --prod
```

### Environment Variables Setup
No environment variables are needed anymore. The application uses only the real API.

### Redeployment
```bash
# Deploy latest changes
vercel --prod

# Deploy to preview
vercel
```

## Custom Domain Setup

### Set a Vercel Subdomain
```bash
vercel alias set flickmax-nto9z8m32-ashoks-projects-7231f66c.vercel.app flickmax.vercel.app
```

### Add Custom Domain
1. Go to: https://vercel.com/ashoks-projects-7231f66c/flickmax/settings/domains
2. Add your domain (e.g., `flickmax.com`)
3. Update DNS records as instructed

## API Endpoints

All API routes are serverless functions with 30-second timeout:

- `/api/domain/search` - Main domain search proxy
- `/api/domain/search/exact` - Exact domain search
- `/api/domain/search/crosssell` - Cross-sell domain suggestions
- `/api/domain/direct` - Direct domain API (mock fallback)
- `/api/test-domain` - Test endpoint for debugging

## Performance Metrics

### Build Output
- First Load JS: ~99.6 kB (shared)
- Homepage: 171 kB
- API Routes: ~99.7 kB each
- Build Time: ~1 minute

### Optimizations
- Static pages pre-rendered at build time
- API routes deployed as serverless functions
- Automatic CDN distribution
- Image optimization enabled

## Monitoring & Logs

### View Logs
```bash
# View production logs
vercel logs flickmax --prod

# View function logs
vercel logs flickmax --prod --filter=api/domain/search
```

### Analytics Dashboard
- Visit: https://vercel.com/ashoks-projects-7231f66c/flickmax/analytics
- Monitor: Page views, API usage, Performance metrics

## Troubleshooting

### Domain Search Issues

1. **500 Errors in Production**
   - Check function logs: `vercel logs --prod`
   - Verify environment variable: `vercel env ls`
   - Test with curl: `curl https://your-domain.vercel.app/api/domain/search?q=example.com`

2. **CORS Errors**
   - Headers are set in API routes
   - Check browser console for specific errors

3. **Slow Response Times**
   - Monitor function duration in dashboard
   - Consider implementing caching
   - Check GoDaddy API status

### Build Failures

1. **TypeScript Errors**
   ```bash
   # Run locally first
   npm run build
   ```

2. **Missing Dependencies**
   ```bash
   # Clear cache and reinstall
   rm -rf node_modules package-lock.json
   npm install
   ```

## Development Workflow

### Local Development
```bash
# Start dev server
npm run dev

# Note: Local development may experience API issues due to GoDaddy's security measures
```

### Preview Deployments
```bash
# Create preview deployment
vercel

# Each push to GitHub creates automatic preview
```

### Production Deployment
```bash
# Manual production deployment
vercel --prod

# Or merge to main branch for auto-deploy (if GitHub connected)
```

## CI/CD Integration

### Connect GitHub Repository

1. Visit: https://vercel.com/ashoks-projects-7231f66c/flickmax/settings/git
2. Connect repository: `flickmaxapp/flickmax`
3. Configure:
   - Production Branch: `main`
   - Auto-deploy: Enabled
   - Preview deployments: All branches

### GitHub Actions (Optional)

Create `.github/workflows/preview.yml`:
```yaml
name: Vercel Preview Deployment
on:
  pull_request:
    types: [opened, synchronize]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
```

## Security Considerations

### API Keys
- Never commit API keys to repository
- Use environment variables for sensitive data
- Rotate keys regularly

### Headers
- CORS headers configured in API routes
- Security headers added by Vercel automatically

### Rate Limiting
- Implement rate limiting for API routes
- Monitor usage in Vercel dashboard

## Cost Optimization

### Free Tier Limits
- 100 GB bandwidth
- 100 GB-hours for Serverless Functions
- Unlimited deployments

### Optimization Tips
1. Enable caching for API responses
2. Optimize images with `next/image`
3. Use ISR for semi-static content
4. Monitor function execution time

## Future Enhancements

1. **Performance**
   - Implement Redis caching
   - Add CDN for API responses
   - Optimize bundle size

2. **Monitoring**
   - Add Sentry error tracking
   - Implement custom analytics
   - Set up uptime monitoring

3. **Features**
   - Add staging environment
   - Implement A/B testing
   - Add feature flags

## Support & Resources

- **Vercel Docs**: https://vercel.com/docs
- **Next.js Docs**: https://nextjs.org/docs
- **Support**: https://vercel.com/support
- **Status**: https://www.vercel-status.com/

## Deployment Checklist

- [ ] Environment variables configured
- [ ] Build passes locally
- [ ] API endpoints tested
- [ ] Custom domain configured (optional)
- [ ] Monitoring enabled
- [ ] Team members added (if needed)
- [ ] Backup strategy in place

---

Last Updated: August 2, 2025