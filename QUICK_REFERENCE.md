# ⚡ Quick Reference Card

## 🚀 Deploy Commands (Copy & Paste)

### First Time Setup
```powershell
# Close and reopen PowerShell first!
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/YOUR_USERNAME/vericheck-pro.git
git branch -M main
git push -u origin main
```

### Update Existing Deployment
```powershell
git add .
git commit -m "Update: description"
git push
```

---

## 🔗 Important URLs

| What | URL |
|------|-----|
| **Create GitHub Repo** | https://github.com/new |
| **Get API Key** | https://aistudio.google.com/app/apikey |
| **Deploy to Vercel** | https://vercel.com/signup |
| **GitHub Tokens** | https://github.com/settings/tokens |
| **Your Site** | https://vericheck-pro.vercel.app |

---

## 🔑 Environment Variables

Add in Vercel Settings → Environment Variables:

| Name | Value | Where to Get |
|------|-------|--------------|
| `GEMINI_API_KEY` | AIza... | https://aistudio.google.com/app/apikey |

---

## 📝 Deployment Checklist

### Before Deploying
- [ ] Git installed
- [ ] GitHub account created
- [ ] Gemini API key obtained
- [ ] Repository created on GitHub

### During Deployment
- [ ] Code pushed to GitHub
- [ ] Vercel account created
- [ ] Project imported
- [ ] Environment variable added
- [ ] Deployment successful

### After Deployment
- [ ] Site loads
- [ ] No console errors
- [ ] Upload works
- [ ] Analysis works
- [ ] Mobile works

---

## 🆘 Quick Fixes

### Git Not Found
```powershell
# Close PowerShell, open NEW one
git --version
```

### Push Failed
```powershell
# Check remote
git remote -v

# Fix remote
git remote set-url origin https://github.com/YOUR_USERNAME/vericheck-pro.git
```

### Vercel Build Failed
1. Check environment variables
2. Verify `GEMINI_API_KEY` is set
3. Redeploy from Vercel dashboard

---

## 📊 File Structure

```
vericheck-pro/
├── api/analyze.ts          ← Backend API
├── components/             ← React components
├── services/               ← API client
├── .env.local             ← Local API key (DO NOT COMMIT)
├── vercel.json            ← Deployment config
└── package.json           ← Dependencies
```

---

## 🎯 Common Commands

```powershell
# Check Git status
git status

# See commit history
git log --oneline

# Undo last commit (keep changes)
git reset --soft HEAD~1

# See what changed
git diff

# Create new branch
git checkout -b feature-name

# Switch branches
git checkout main
```

---

## 📱 Test URLs

After deployment, test:
- Homepage: `https://your-site.vercel.app`
- API: `https://your-site.vercel.app/api/analyze`

---

## 💡 Pro Tips

1. **Auto-deploy**: Every push to `main` auto-deploys
2. **Preview**: Pull requests get preview URLs
3. **Rollback**: Can rollback to any previous deployment
4. **Logs**: Check Vercel dashboard for function logs
5. **Analytics**: Enable in Vercel for free stats

---

## 🔄 Update Workflow

```
Edit Code → Save → Git Add → Git Commit → Git Push → Auto Deploy
```

---

## 📞 Get Help

| Issue | Solution |
|-------|----------|
| Git issues | [TROUBLESHOOTING.md](TROUBLESHOOTING.md) |
| Deployment | [DEPLOY_NOW.md](DEPLOY_NOW.md) |
| Vercel errors | Check build logs |
| API errors | Verify environment variables |

---

## ✅ Success Indicators

You're successful when:
- ✓ `git status` shows clean
- ✓ GitHub shows your code
- ✓ Vercel shows green checkmark
- ✓ Site loads without errors
- ✓ Analysis completes successfully

---

## 🎉 You're Ready!

**Next Step**: Run `.\deploy-to-github.bat` or see [START_HERE.md](START_HERE.md)

**Your site will be live at**: `https://vericheck-pro.vercel.app`
