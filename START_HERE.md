# 🚀 START HERE - Deploy in 3 Steps

## Before You Start

You need:
1. ✅ Git installed (you have this!)
2. ⬜ GitHub account (create at https://github.com/signup if needed)
3. ⬜ Gemini API key (get from https://aistudio.google.com/app/apikey)

---

## Step 1: Push to GitHub (5 minutes)

### Option A: Use the Automated Script (Easiest)

1. **Close this PowerShell window**
2. **Open a NEW PowerShell or Command Prompt**
   - Right-click in your project folder
   - Choose "Open in Terminal" or "Open PowerShell here"
3. **Run the script**:
   ```
   .\deploy-to-github.bat
   ```
4. **Follow the prompts**:
   - Enter your GitHub username
   - Create repository on GitHub if needed
   - Use Personal Access Token as password

### Option B: Manual Commands

If the script doesn't work, open a NEW PowerShell and run:

```powershell
git init
git add .
git commit -m "Initial commit - VeriCheck Pro"
git remote add origin https://github.com/YOUR_USERNAME/vericheck-pro.git
git branch -M main
git push -u origin main
```

**Important**: Replace `YOUR_USERNAME` with your actual GitHub username!

---

## Step 2: Deploy to Vercel (5 minutes)

1. **Go to Vercel**
   - Visit: https://vercel.com/signup
   - Click "Continue with GitHub"

2. **Import Project**
   - Click "Add New..." → "Project"
   - Find `vericheck-pro`
   - Click "Import"

3. **Add Environment Variable** ⚠️ CRITICAL!
   - Name: `GEMINI_API_KEY`
   - Value: Your Gemini API key
   - Click "Add"

4. **Deploy**
   - Click "Deploy"
   - Wait 2-3 minutes
   - Done! 🎉

---

## Step 3: Test Your Site (2 minutes)

1. Click "Visit" to see your live site
2. Click "Begin New Audit"
3. Paste some text
4. Click "Run Integrity Check"
5. Verify it works!

---

## 🆘 Troubleshooting

### "Git is not recognized"
- Close PowerShell
- Open a NEW PowerShell window
- Git needs a restart after installation

### "Repository doesn't exist"
1. Go to: https://github.com/new
2. Name: `vericheck-pro`
3. Do NOT check "Initialize with README"
4. Click "Create repository"
5. Run the script again

### "Permission denied"
- Use Personal Access Token, not password
- Get token: https://github.com/settings/tokens
- Check "repo" permissions
- Copy and use as password

### "Build failed in Vercel"
- Make sure you added `GEMINI_API_KEY` in Vercel
- Check build logs for specific error
- See TROUBLESHOOTING.md for more help

---

## 📚 More Help

- **Visual Guide**: [DEPLOY_VISUAL_GUIDE.md](DEPLOY_VISUAL_GUIDE.md)
- **Complete Guide**: [COMPLETE_DEPLOYMENT_GUIDE.md](COMPLETE_DEPLOYMENT_GUIDE.md)
- **Troubleshooting**: [TROUBLESHOOTING.md](TROUBLESHOOTING.md)

---

## ✅ Success Checklist

- [ ] Code pushed to GitHub
- [ ] Repository visible at github.com/YOU/vericheck-pro
- [ ] Vercel account created
- [ ] Project imported to Vercel
- [ ] GEMINI_API_KEY added
- [ ] Site deployed successfully
- [ ] Site loads and works

---

## 🎉 You're Almost There!

Just run the script or commands above, and you'll be live in 10 minutes!

**Questions?** Check the troubleshooting section above or see the detailed guides.
