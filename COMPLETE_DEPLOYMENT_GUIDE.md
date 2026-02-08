# 🚀 Complete Deployment Guide (From Scratch)

Everything you need to deploy VeriCheck Pro, even if you've never deployed before.

## 📋 What You Need

- [ ] Windows computer (you have this ✅)
- [ ] Internet connection
- [ ] 30 minutes of time
- [ ] Gemini API key (we'll get this)

---

## Part 1: Install Required Tools (10 minutes)

### Step 1: Install Git

1. **Download Git**
   - Go to: https://git-scm.com/download/win
   - Click "Click here to download" (64-bit version)
   - Wait for download to complete

2. **Install Git**
   - Run the downloaded installer
   - Click "Next" through all options (defaults are fine)
   - Click "Install"
   - Click "Finish"

3. **Verify Installation**
   - Open a NEW PowerShell window
   - Type: `git --version`
   - You should see: `git version 2.x.x`

### Step 2: Get Gemini API Key

1. **Go to Google AI Studio**
   - Visit: https://aistudio.google.com/app/apikey
   - Sign in with your Google account

2. **Create API Key**
   - Click "Create API Key"
   - Copy the key (starts with `AIza...`)
   - Save it somewhere safe (you'll need it later)

---

## Part 2: Push to GitHub (10 minutes)

### Step 1: Create GitHub Account (if you don't have one)

1. Go to: https://github.com/signup
2. Enter your email
3. Create a password
4. Choose a username
5. Verify your account

### Step 2: Create New Repository

1. **Go to GitHub**
   - Visit: https://github.com/new
   - Or click the "+" icon → "New repository"

2. **Fill in Details**
   - Repository name: `vericheck-pro`
   - Description: `Academic Integrity Suite - Plagiarism Detection`
   - Choose: ● Public (or Private if you prefer)
   - **IMPORTANT**: Do NOT check "Initialize with README"
   - Click "Create repository"

3. **Copy the Commands**
   - You'll see a page with commands
   - Keep this page open!

### Step 3: Push Your Code

1. **Open PowerShell in Your Project Folder**
   - Navigate to your project folder
   - Or right-click in the folder → "Open in Terminal"

2. **Run These Commands** (one at a time):

   ```powershell
   # Initialize Git
   git init
   
   # Add all files
   git add .
   
   # Create first commit
   git commit -m "Initial commit - VeriCheck Pro ready for deployment"
   
   # Add GitHub as remote (REPLACE with YOUR username!)
   git remote add origin https://github.com/YOUR_USERNAME/vericheck-pro.git
   
   # Push to GitHub
   git branch -M main
   git push -u origin main
   ```

3. **Enter GitHub Credentials**
   - Username: Your GitHub username
   - Password: Use a Personal Access Token (not your password!)
   
   **To create a token:**
   - Go to: https://github.com/settings/tokens
   - Click "Generate new token (classic)"
   - Give it a name: "Vercel Deployment"
   - Check: `repo` (all repo permissions)
   - Click "Generate token"
   - Copy the token (starts with `ghp_...`)
   - Use this as your password

4. **Verify Upload**
   - Go to: `https://github.com/YOUR_USERNAME/vericheck-pro`
   - You should see all your files!

---

## Part 3: Deploy to Vercel (10 minutes)

### Step 1: Create Vercel Account

1. **Go to Vercel**
   - Visit: https://vercel.com/signup
   - Click "Continue with GitHub"
   - Authorize Vercel to access your GitHub

2. **Complete Setup**
   - Choose a team name (or skip)
   - You're now in the Vercel dashboard!

### Step 2: Import Your Project

1. **Click "Add New..."**
   - In the top right corner
   - Select "Project"

2. **Find Your Repository**
   - You'll see a list of your GitHub repos
   - Find `vericheck-pro`
   - Click "Import"

### Step 3: Configure Project

1. **Project Settings**
   - Project Name: `vericheck-pro` (or change it)
   - Framework Preset: Should auto-detect "Vite"
   - Root Directory: `./` (leave as is)
   - Build Command: `npm run build` (auto-filled)
   - Output Directory: `dist` (auto-filled)

2. **Add Environment Variable** ⚠️ CRITICAL!
   - Click "Environment Variables" section
   - Name: `GEMINI_API_KEY`
   - Value: Paste your Gemini API key (from Part 1, Step 2)
   - Click "Add"
   - Make sure all three checkboxes are checked:
     - ☑ Production
     - ☑ Preview
     - ☑ Development

3. **Deploy!**
   - Click the big "Deploy" button
   - Wait 2-3 minutes
   - Watch the build logs (optional but cool!)

### Step 4: Celebrate! 🎉

When you see:
```
🎉 Congratulations!
Your project has been deployed!
```

Click "Visit" to see your live site!

---

## Part 4: Test Your Deployment (5 minutes)

### Test Checklist:

1. **Homepage**
   - [ ] Site loads at the Vercel URL
   - [ ] No errors in browser console (F12 → Console tab)
   - [ ] "VeriCheck" logo visible
   - [ ] Sidebar shows correctly

2. **Upload Feature**
   - [ ] Click "Begin New Audit"
   - [ ] Paste some text (any text, 100+ words)
   - [ ] Click "Run Integrity Check"
   - [ ] Progress bar appears
   - [ ] Analysis completes (15-30 seconds)
   - [ ] Report displays

3. **Mobile Test** (optional)
   - [ ] Open site on your phone
   - [ ] Layout looks good
   - [ ] Can upload and analyze

---

## 🎯 Your Deployment URLs

After deployment, you'll have:

```
Production URL:
https://vericheck-pro.vercel.app
(or your custom name)

Vercel Dashboard:
https://vercel.com/dashboard

GitHub Repository:
https://github.com/YOUR_USERNAME/vericheck-pro
```

---

## 🔄 How to Update Your Site

When you want to make changes:

1. **Edit your code locally**
   - Make your changes
   - Save files

2. **Push to GitHub**
   ```powershell
   git add .
   git commit -m "Description of changes"
   git push
   ```

3. **Automatic Deployment**
   - Vercel detects the push
   - Builds automatically
   - Deploys in 2-3 minutes
   - Your site is updated!

---

## 🆘 Troubleshooting

### "Git is not recognized"

**Solution**: 
- Close PowerShell
- Open a NEW PowerShell window
- Git needs a restart to work

### "Permission denied (publickey)"

**Solution**:
- Use HTTPS instead of SSH
- Use Personal Access Token as password
- Get token from: https://github.com/settings/tokens

### "Build failed" in Vercel

**Solution**:
1. Check build logs in Vercel
2. Look for the error message
3. Common fixes:
   - Missing `GEMINI_API_KEY` → Add in Vercel settings
   - TypeScript errors → Run `npm run build` locally first
   - Missing files → Make sure all files are pushed to GitHub

### "Cloud API connection failed"

**Solution**:
1. Go to Vercel dashboard
2. Your project → Settings → Environment Variables
3. Verify `GEMINI_API_KEY` is there
4. If not, add it
5. Go to Deployments tab
6. Click "..." on latest → "Redeploy"

### "Analysis fails" or "Rate limit exceeded"

**Solution**:
- Wait 1 hour (rate limit resets)
- Or use different network
- Check Gemini API quota: https://aistudio.google.com

---

## 📊 What Happens Behind the Scenes

```
Your Computer
    ↓ (git push)
GitHub Repository
    ↓ (webhook)
Vercel
    ↓ (builds)
Live Website
    ↓ (users visit)
Your Site is Live! 🎉
```

---

## 🎨 Customize Your Deployment

### Add Custom Domain

1. Buy a domain (e.g., from Namecheap, GoDaddy)
2. In Vercel: Settings → Domains
3. Add your domain
4. Follow DNS instructions
5. Wait 5-30 minutes for DNS propagation

### Enable Analytics

1. In Vercel: Analytics tab
2. Click "Enable"
3. See visitor stats, page views, etc.

---

## 💰 Cost Information

### Free Tier Includes:
- ✅ Unlimited deployments
- ✅ Automatic HTTPS
- ✅ 100GB bandwidth/month
- ✅ Serverless functions
- ✅ Preview deployments

### Gemini API:
- Free tier: 15 requests/minute
- Check pricing: https://ai.google.dev/pricing

---

## ✅ Success Checklist

You're successful when:

- [ ] Code is on GitHub
- [ ] Site is deployed on Vercel
- [ ] Site loads without errors
- [ ] Analysis feature works
- [ ] Report displays correctly
- [ ] Mobile view works
- [ ] No API key visible in browser

---

## 🎉 Congratulations!

You've successfully deployed VeriCheck Pro!

**What you accomplished:**
- ✅ Installed Git
- ✅ Created GitHub repository
- ✅ Pushed code to GitHub
- ✅ Deployed to Vercel
- ✅ Configured environment variables
- ✅ Tested the deployment

**Your site is now:**
- 🌍 Accessible worldwide
- 🔒 Secure (API key protected)
- 📱 Mobile responsive
- ⚡ Fast (CDN-powered)
- 🔄 Auto-updating (on git push)

---

## 📞 Need More Help?

- **Visual Guide**: See [DEPLOY_VISUAL_GUIDE.md](DEPLOY_VISUAL_GUIDE.md)
- **Detailed Steps**: See [DEPLOY_NOW.md](DEPLOY_NOW.md)
- **Troubleshooting**: See [TROUBLESHOOTING.md](TROUBLESHOOTING.md)
- **Vercel Docs**: https://vercel.com/docs
- **GitHub Docs**: https://docs.github.com

---

**You did it!** 🚀🎊

Share your site with the world:
`https://vericheck-pro.vercel.app`
