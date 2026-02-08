# 🚀 Deploy VeriCheck Pro to Vercel (Easy Way)

Since the CLI has issues, let's use the Vercel website - it's actually easier!

## ✅ Prerequisites

Before you start, make sure you have:
- [ ] A GitHub account
- [ ] Your Gemini API key from https://aistudio.google.com/app/apikey
- [ ] This project code

---

## 📋 Step-by-Step Deployment (10 minutes)

### Step 1: Push to GitHub

1. **Create a new repository on GitHub**
   - Go to https://github.com/new
   - Name it: `vericheck-pro`
   - Make it Public or Private (your choice)
   - Don't initialize with README (we already have one)
   - Click "Create repository"

2. **Initialize Git in your project** (if not already done)
   ```bash
   git init
   git add .
   git commit -m "Initial commit - VeriCheck Pro ready for deployment"
   ```

3. **Push to GitHub**
   ```bash
   git remote add origin https://github.com/YOUR_USERNAME/vericheck-pro.git
   git branch -M main
   git push -u origin main
   ```

   Replace `YOUR_USERNAME` with your actual GitHub username.

---

### Step 2: Deploy to Vercel

1. **Go to Vercel**
   - Visit https://vercel.com
   - Click "Sign Up" or "Log In"
   - Choose "Continue with GitHub"

2. **Import Your Project**
   - Click "Add New..." → "Project"
   - You'll see your GitHub repositories
   - Find `vericheck-pro` and click "Import"

3. **Configure Project**
   - **Project Name**: `vericheck-pro` (or whatever you want)
   - **Framework Preset**: Vite (should auto-detect)
   - **Root Directory**: `./` (leave as is)
   - **Build Command**: `npm run build` (should be auto-filled)
   - **Output Directory**: `dist` (should be auto-filled)
   - **Install Command**: `npm install` (should be auto-filled)

4. **Add Environment Variable** ⚠️ IMPORTANT!
   - Click "Environment Variables"
   - Add:
     - **Name**: `GEMINI_API_KEY`
     - **Value**: Your actual Gemini API key (starts with `AIza...`)
   - Click "Add"

5. **Deploy!**
   - Click "Deploy"
   - Wait 2-3 minutes for build to complete
   - You'll see confetti when it's done! 🎉

---

### Step 3: Test Your Deployment

1. **Visit Your Site**
   - Click "Visit" or go to the URL shown (e.g., `vericheck-pro.vercel.app`)

2. **Test the Features**
   - [ ] Homepage loads
   - [ ] Click "Begin New Audit"
   - [ ] Paste some text
   - [ ] Click "Run Integrity Check"
   - [ ] Wait for analysis to complete
   - [ ] Report displays correctly

3. **Check for Errors**
   - Open browser DevTools (F12)
   - Check Console tab for errors
   - If you see errors, check the troubleshooting section below

---

## 🎯 What Happens Next?

### Automatic Deployments
Every time you push to GitHub, Vercel will automatically:
- Build your project
- Run tests (if any)
- Deploy to production
- Give you a preview URL

### Your URLs
- **Production**: `https://vericheck-pro.vercel.app`
- **Custom Domain**: You can add your own domain in Vercel settings

---

## 🔧 Troubleshooting

### "Cloud API connection failed"

**Problem**: Environment variable not set correctly.

**Solution**:
1. Go to Vercel dashboard
2. Select your project
3. Go to Settings → Environment Variables
4. Verify `GEMINI_API_KEY` is there
5. If not, add it
6. Go to Deployments tab
7. Click "..." on latest deployment → "Redeploy"

---

### Build Fails

**Problem**: Build error during deployment.

**Solution**:
1. Check the build logs in Vercel
2. Look for the specific error
3. Common issues:
   - Missing dependencies → Check `package.json`
   - TypeScript errors → Run `npm run build` locally first
   - Node version → Vercel uses Node 18+ by default

---

### 404 on API Routes

**Problem**: `/api/analyze` returns 404.

**Solution**:
1. Verify `api/` folder is in your Git repository
2. Check `vercel.json` is in the root
3. Redeploy the project

---

## 🎨 Customize Your Deployment

### Add Custom Domain

1. Go to Project Settings → Domains
2. Click "Add"
3. Enter your domain (e.g., `vericheck.com`)
4. Follow DNS configuration instructions
5. Wait for DNS propagation (5-30 minutes)

### Environment Variables for Different Environments

You can set different API keys for:
- **Production**: Live site
- **Preview**: Pull request previews
- **Development**: Local development

Just select the appropriate checkboxes when adding the variable.

---

## 📊 Monitor Your Deployment

### Vercel Dashboard

- **Analytics**: See page views and performance
- **Logs**: View function logs and errors
- **Deployments**: See all deployments and their status

### Google AI Studio

- Monitor API usage: https://aistudio.google.com
- Set up billing alerts
- Track quota usage

---

## 🔄 Update Your Deployment

To update your live site:

1. Make changes to your code
2. Commit and push to GitHub:
   ```bash
   git add .
   git commit -m "Update: description of changes"
   git push
   ```
3. Vercel automatically deploys the changes
4. Check the deployment in Vercel dashboard

---

## ✅ Post-Deployment Checklist

After deployment, verify:

- [ ] Site is accessible at Vercel URL
- [ ] Homepage loads without errors
- [ ] File upload works
- [ ] Text analysis works
- [ ] Report displays correctly
- [ ] Mobile view works (test on phone)
- [ ] No console errors in browser
- [ ] API key is NOT visible in browser DevTools
- [ ] Rate limiting works (try 11 requests quickly)

---

## 🎉 Success!

Your VeriCheck Pro is now live! 

**Your URLs:**
- Production: `https://your-project.vercel.app`
- GitHub: `https://github.com/YOUR_USERNAME/vericheck-pro`

**Next Steps:**
1. Share with users
2. Monitor for errors
3. Gather feedback
4. Iterate and improve

---

## 📞 Need Help?

- **Vercel Docs**: https://vercel.com/docs
- **Vercel Support**: https://vercel.com/support
- **GitHub Issues**: Create an issue in your repo
- **Troubleshooting Guide**: See [TROUBLESHOOTING.md](TROUBLESHOOTING.md)

---

## 💡 Pro Tips

1. **Preview Deployments**: Every pull request gets its own preview URL
2. **Rollback**: Can instantly rollback to any previous deployment
3. **Analytics**: Enable Vercel Analytics for free usage stats
4. **Monitoring**: Set up Vercel Monitoring for error tracking
5. **Custom Domain**: Add your own domain for free

---

**Congratulations on your deployment!** 🚀🎉

Your VeriCheck Pro is now serving users worldwide!
