# GitHub Repository Setup Guide

## Create a New Repository on GitHub

1. **Go to GitHub**
   - Open https://github.com in your browser
   - Sign in to your account

2. **Create New Repository**
   - Click the "+" icon in the top right corner
   - Select "New repository"

3. **Repository Settings**
   - **Repository name**: `flickmax` (or your preferred name)
   - **Description**: "FlickMax - Domain Registration and Web Hosting Platform"
   - **Visibility**: Choose Public or Private
   - **DO NOT** initialize with README, .gitignore, or license (we already have files)

4. **Create Repository**
   - Click "Create repository"

## Push Your Code to GitHub

After creating the repository, GitHub will show you commands. Use these commands in your terminal:

### Option 1: If you see an HTTPS URL (recommended)
```bash
git remote add origin https://github.com/YOUR_USERNAME/flickmax.git
git branch -M main
git push -u origin main
```

### Option 2: If you see an SSH URL
```bash
git remote add origin git@github.com:YOUR_USERNAME/flickmax.git
git branch -M main
git push -u origin main
```

Replace `YOUR_USERNAME` with your actual GitHub username.

## Alternative: Using GitHub Desktop

If you prefer a GUI:
1. Download GitHub Desktop from https://desktop.github.com/
2. Sign in with your GitHub account
3. Click "Add" → "Add Existing Repository"
4. Browse to `/Users/ashokparmar/flickmax`
5. Click "Publish repository"

## After Publishing

1. **Enable GitHub Pages** (optional):
   - Go to Settings → Pages
   - Source: Deploy from a branch
   - Branch: main
   - Folder: / (root)

2. **Connect to Vercel**:
   - Go to https://vercel.com
   - Import the GitHub repository
   - Deploy!

## Troubleshooting

If you get authentication errors:
1. **For HTTPS**: You'll need to create a Personal Access Token
   - Go to GitHub Settings → Developer settings → Personal access tokens
   - Generate new token with 'repo' scope
   - Use this token as your password when prompted

2. **For SSH**: Set up SSH keys
   - Follow guide at: https://docs.github.com/en/authentication/connecting-to-github-with-ssh

## Repository Files Overview

Your repository includes:
- **Next.js 15** application with TypeScript
- **Domain Search**: Real-time domain availability checking
- **Hosting Plans**: Dynamic pricing with country support
- **API Routes**: Proxy for GoDaddy API integration
- **Responsive Design**: Mobile-first approach
- **Production Ready**: Configured for Vercel deployment

## Next Steps

1. Push to GitHub using the commands above
2. Deploy to Vercel
3. Set environment variables in Vercel:
   - `NEXT_PUBLIC_USE_MOCK_API=false` for production

Good luck with your deployment! 🚀