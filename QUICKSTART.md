# VeriCheck Pro - Quick Start Guide

Get VeriCheck Pro running in 5 minutes!

## Step 1: Get Your API Key

1. Go to [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Click "Create API Key"
3. Copy the key (starts with `AIza...`)

## Step 2: Clone & Install

```bash
# Clone the repository
git clone <your-repo-url>
cd vericheck-pro

# Install dependencies
npm install
```

## Step 3: Configure Environment

Create a `.env.local` file in the root directory:

```env
GEMINI_API_KEY=AIzaSy...your_actual_key_here
```

## Step 4: Run Locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Step 5: Test It Out

1. Click "Begin New Audit"
2. Paste some text or upload a document
3. Click "Run Integrity Check"
4. Wait 15-30 seconds for results

## Deploy to Production

### Vercel (Easiest)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Add your API key in Vercel dashboard:
# Project Settings → Environment Variables
# Add: GEMINI_API_KEY = your_key
```

That's it! Your app is live. 🎉

## Need Help?

- Check [README.md](README.md) for detailed documentation
- See [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md) for deployment options
- Review troubleshooting section in README

## Common Issues

**"Cloud API connection failed"**
- Make sure `.env.local` exists with your API key
- Restart the dev server after adding the key

**"Analysis failed"**
- Check your API key is valid
- Verify you have quota remaining in Google AI Studio
- Try with shorter text (under 10,000 characters)

**Build errors**
- Make sure you're using Node.js 18 or higher
- Delete `node_modules` and run `npm install` again
