# VeriCheck Pro - Troubleshooting Guide

Common issues and their solutions.

## 🔴 Critical Issues

### "Cloud API connection failed: Missing authentication key"

**Cause**: Gemini API key is not configured.

**Solution**:
1. Create `.env.local` file in project root
2. Add: `GEMINI_API_KEY=your_actual_key_here`
3. Get key from: https://aistudio.google.com/app/apikey
4. Restart dev server: `npm run dev`

**For Production**:
- Add environment variable in Vercel dashboard
- Project Settings → Environment Variables
- Add `GEMINI_API_KEY` with your key
- Redeploy the application

---

### "Unable to connect to analysis server"

**Cause**: Backend API is not running or unreachable.

**Solution (Local Development)**:
```bash
# Check if dev server is running
npm run dev

# Should see: "Local: http://localhost:3000"
```

**Solution (Production)**:
- Check Vercel deployment status
- Verify API route is deployed
- Check browser console for CORS errors
- Verify environment variables are set

---

### "Rate limit exceeded"

**Cause**: Too many requests from same IP (10/hour limit).

**Solution**:
- Wait 1 hour for rate limit to reset
- Or use different network/IP address
- For development: Temporarily increase limit in `api/analyze.ts`

---

## ⚠️ Common Issues

### Build Fails with TypeScript Errors

**Error**: `Cannot find module '@google/genai'`

**Solution**:
```bash
# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install

# Verify @google/genai is installed
npm list @google/genai
```

---

### PDF Upload Fails

**Error**: "Failed to parse PDF. The file might be encrypted or corrupted."

**Causes**:
1. PDF is password-protected
2. PDF is corrupted
3. PDF.js library failed to load

**Solutions**:
1. Remove password protection from PDF
2. Try a different PDF file
3. Check browser console for CDN errors
4. Try converting PDF to TXT format

---

### DOCX Upload Fails

**Error**: "Failed to parse DOCX. Please try a different file."

**Causes**:
1. DOCX is corrupted
2. DOCX has complex formatting
3. Mammoth.js library failed to load

**Solutions**:
1. Try a different DOCX file
2. Save as newer DOCX format (not .doc)
3. Try converting to TXT format
4. Check browser console for errors

---

### Analysis Takes Too Long

**Symptom**: Analysis stuck at 96% or times out.

**Causes**:
1. Text is too long (>15,000 characters)
2. Gemini API is slow/overloaded
3. Network connection issues

**Solutions**:
1. Reduce text length (under 10,000 characters)
2. Try again in a few minutes
3. Check internet connection
4. Check Gemini API status

---

### No Plagiarism Matches Found

**Symptom**: Analysis completes but shows 0% similarity.

**Causes**:
1. Text is original
2. Search grounding didn't find matches
3. Text is too short
4. Gemini API search feature unavailable

**Solutions**:
1. This is normal for original content
2. Try with known copied text to test
3. Use longer text samples (500+ words)
4. Check Gemini API documentation for search availability

---

### Mobile View Broken

**Symptom**: Layout looks wrong on mobile.

**Solutions**:
1. Clear browser cache
2. Hard refresh (Ctrl+Shift+R or Cmd+Shift+R)
3. Try different mobile browser
4. Check if JavaScript is enabled
5. Update to latest browser version

---

## 🔧 Development Issues

### Hot Reload Not Working

**Solution**:
```bash
# Stop dev server (Ctrl+C)
# Clear Vite cache
rm -rf node_modules/.vite

# Restart
npm run dev
```

---

### Environment Variables Not Loading

**Symptom**: Changes to `.env.local` not reflected.

**Solution**:
1. Restart dev server (Ctrl+C, then `npm run dev`)
2. Verify file is named exactly `.env.local`
3. Verify file is in project root
4. Check for typos in variable names
5. Don't use quotes around values

---

### Port 3000 Already in Use

**Error**: `Port 3000 is already in use`

**Solution**:
```bash
# Option 1: Kill process on port 3000
# Windows:
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Mac/Linux:
lsof -ti:3000 | xargs kill -9

# Option 2: Use different port
# Edit vite.config.ts, change port to 3001
```

---

## 🚀 Deployment Issues

### Vercel Build Fails

**Error**: Build fails during deployment.

**Solutions**:
1. Check build logs in Vercel dashboard
2. Verify Node.js version (18+ required)
3. Test build locally: `npm run build`
4. Check for TypeScript errors
5. Verify all dependencies are in `package.json`

---

### Environment Variables Not Working in Production

**Symptom**: API key error in production but works locally.

**Solutions**:
1. Verify variable is added in Vercel dashboard
2. Check variable name is exactly `GEMINI_API_KEY`
3. Verify variable is applied to "Production"
4. Redeploy after adding variables
5. Check deployment logs for errors

---

### API Routes Return 404

**Symptom**: `/api/analyze` returns 404 in production.

**Solutions**:
1. Verify `vercel.json` is in project root
2. Check `api/` folder is committed to Git
3. Verify Vercel detected the API routes
4. Check deployment logs
5. Try redeploying

---

### CORS Errors in Production

**Error**: "CORS policy: No 'Access-Control-Allow-Origin' header"

**Solutions**:
1. Check CORS headers in `api/analyze.ts`
2. Verify API endpoint URL is correct
3. Check if using correct domain
4. Clear browser cache
5. Check Vercel logs for errors

---

## 🐛 Runtime Errors

### "Cannot read property of undefined"

**Cause**: Data structure mismatch or missing data.

**Solutions**:
1. Check browser console for full error
2. Verify API response structure
3. Check if Gemini API changed response format
4. Add null checks in code
5. Report issue with error details

---

### Memory Leak / Browser Slows Down

**Symptom**: Browser becomes slow after multiple analyses.

**Solutions**:
1. Refresh the page
2. Clear browser cache
3. Close other tabs
4. Check for console errors
5. Report issue if persistent

---

### Print Doesn't Work

**Symptom**: Print button doesn't work or prints incorrectly.

**Solutions**:
1. Try different browser
2. Check print preview first
3. Adjust print settings (margins, scale)
4. Try "Save as PDF" instead
5. Check browser console for errors

---

## 📊 Performance Issues

### Slow Page Load

**Solutions**:
1. Check internet connection
2. Clear browser cache
3. Disable browser extensions
4. Check CDN availability (Tailwind, fonts)
5. Try different browser

---

### High API Costs

**Symptom**: Gemini API costs are high.

**Solutions**:
1. Monitor usage in Google AI Studio
2. Implement stricter rate limiting
3. Add usage caps per user
4. Cache common queries
5. Reduce text length limits

---

## 🔍 Debugging Tips

### Enable Verbose Logging

Add to browser console:
```javascript
localStorage.setItem('debug', 'true');
```

### Check API Response

In browser DevTools:
1. Open Network tab
2. Submit analysis
3. Find `/api/analyze` request
4. Check Response tab
5. Look for errors

### Check Environment Variables

In browser console (should be undefined):
```javascript
console.log(process.env.GEMINI_API_KEY); // Should be undefined!
```

If you see the API key, **CRITICAL SECURITY ISSUE** - API key is exposed!

---

## 📞 Getting Help

### Before Asking for Help

1. Check this troubleshooting guide
2. Check browser console for errors
3. Check Vercel deployment logs
4. Try in incognito/private mode
5. Try different browser

### When Reporting Issues

Include:
- Error message (exact text)
- Browser and version
- Steps to reproduce
- Screenshots if applicable
- Console errors
- Network tab errors

### Support Channels

- **GitHub Issues**: [Your repo URL]/issues
- **Vercel Support**: https://vercel.com/support
- **Google AI Studio**: https://aistudio.google.com
- **Documentation**: Check README.md and guides

---

## 🔄 Quick Fixes

### Nuclear Option (Reset Everything)

```bash
# Stop all processes
# Delete everything except source files
rm -rf node_modules
rm -rf .vercel
rm -rf dist
rm package-lock.json

# Reinstall
npm install

# Test locally
npm run dev

# If works, redeploy
vercel --prod
```

---

## ✅ Verification Checklist

After fixing an issue:

- [ ] Issue is resolved
- [ ] No new errors in console
- [ ] Feature works as expected
- [ ] Works on mobile
- [ ] Works in production
- [ ] No performance degradation
- [ ] Documentation updated if needed

---

**Still having issues?** Open an issue on GitHub with:
1. Detailed description
2. Steps to reproduce
3. Error messages
4. Screenshots
5. Environment details (browser, OS, etc.)
