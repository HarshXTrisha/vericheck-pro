# Pre-Deployment Checklist

Use this checklist before deploying VeriCheck Pro to production.

## 🔐 Security

- [ ] API key is stored in `.env.local` (not committed to Git)
- [ ] `.env.local` is in `.gitignore`
- [ ] No API keys or secrets in client-side code
- [ ] Environment variables will be set in deployment platform
- [ ] Rate limiting is enabled
- [ ] CORS is properly configured

## 🧪 Local Testing

- [ ] Run `npm install` successfully
- [ ] Run `npm run dev` without errors
- [ ] Application loads at `http://localhost:3000`
- [ ] Can upload PDF file
- [ ] Can upload DOCX file
- [ ] Can upload TXT file
- [ ] Can paste text directly
- [ ] Analysis completes successfully
- [ ] Report displays with highlights
- [ ] Can click on source matches
- [ ] Can view source details
- [ ] Can navigate between views (Dashboard, Upload, History)
- [ ] Error messages display correctly
- [ ] Loading states work properly

## 📱 Mobile Testing

- [ ] Test on mobile browser (Chrome/Safari)
- [ ] Sidebar is responsive
- [ ] Upload interface works on mobile
- [ ] Report view is readable on mobile
- [ ] All buttons are tappable
- [ ] Text is readable without zooming
- [ ] No horizontal scrolling

## 🏗️ Build Testing

- [ ] Run `npm run build` successfully
- [ ] No TypeScript errors
- [ ] No build warnings (or acceptable warnings documented)
- [ ] Run `npm run preview` to test production build
- [ ] Production build works correctly

## 📄 Documentation

- [ ] README.md is up to date
- [ ] DEPLOYMENT_GUIDE.md is complete
- [ ] QUICKSTART.md is accurate
- [ ] `.env.example` exists
- [ ] All links in documentation work

## 🚀 Deployment Platform Setup

### Vercel (Recommended)

- [ ] Vercel account created
- [ ] Project connected to Git repository
- [ ] Build command set: `npm run build`
- [ ] Output directory set: `dist`
- [ ] Environment variable `GEMINI_API_KEY` added
- [ ] Environment variable applied to Production
- [ ] Test deployment successful

### Other Platforms

- [ ] Platform-specific configuration complete
- [ ] API routes configured correctly
- [ ] Environment variables set
- [ ] Build settings configured

## 🔍 Post-Deployment Verification

- [ ] Production URL is accessible
- [ ] Homepage loads correctly
- [ ] No console errors in browser DevTools
- [ ] Can upload and analyze a document
- [ ] Analysis completes successfully
- [ ] Report displays correctly
- [ ] Mobile view works
- [ ] API endpoint responds correctly
- [ ] Rate limiting works (test with multiple requests)
- [ ] Error handling works (test with invalid input)

## 📊 Monitoring Setup (Optional but Recommended)

- [ ] Error tracking configured (e.g., Sentry)
- [ ] Analytics configured (e.g., Google Analytics, Vercel Analytics)
- [ ] API usage monitoring set up
- [ ] Billing alerts configured in Google AI Studio

## 🔒 Security Verification

- [ ] API key NOT visible in browser DevTools
- [ ] API key NOT in client-side bundle
- [ ] API key NOT in Git history
- [ ] HTTPS is enforced
- [ ] CORS headers are correct
- [ ] Rate limiting is working

## 💰 Cost Management

- [ ] Understand Gemini API pricing
- [ ] Set up billing alerts in Google Cloud
- [ ] Monitor API usage regularly
- [ ] Consider implementing usage limits per user
- [ ] Have a plan for scaling costs

## 📝 Legal & Compliance

- [ ] Terms of Service prepared (if needed)
- [ ] Privacy Policy prepared (if needed)
- [ ] Data handling complies with regulations
- [ ] User consent mechanisms in place (if collecting data)
- [ ] Academic integrity policies considered

## 🎯 Performance

- [ ] Page load time is acceptable (< 3 seconds)
- [ ] Analysis completes in reasonable time (15-30 seconds)
- [ ] No memory leaks in browser
- [ ] Images and assets are optimized
- [ ] CDN is configured (if applicable)

## 🐛 Known Issues

Document any known issues or limitations:

- [ ] Maximum text length: 50,000 characters
- [ ] Analysis time: 15-30 seconds
- [ ] Rate limit: 10 requests per hour per IP
- [ ] Gemini API availability may vary
- [ ] Search grounding results may vary

## 📞 Support Plan

- [ ] Support email/contact method set up
- [ ] Issue tracking system ready (GitHub Issues, etc.)
- [ ] Documentation for common issues prepared
- [ ] Escalation process defined

## 🔄 Rollback Plan

- [ ] Previous version tagged in Git
- [ ] Rollback procedure documented
- [ ] Database backup (if applicable)
- [ ] Can quickly revert deployment if needed

## ✅ Final Checks

- [ ] All team members have reviewed
- [ ] Stakeholders have approved
- [ ] Backup plan is in place
- [ ] Monitoring is active
- [ ] Support channels are ready

---

## 🚀 Ready to Deploy?

If all items are checked, you're ready to deploy!

### Deployment Command (Vercel)

```bash
vercel --prod
```

### Post-Deployment

1. Test the production URL immediately
2. Monitor for errors in the first hour
3. Check API usage in Google AI Studio
4. Verify analytics are tracking
5. Share with initial users for feedback

---

## 📞 Emergency Contacts

- **Vercel Support**: https://vercel.com/support
- **Google AI Studio**: https://aistudio.google.com
- **GitHub Issues**: [Your repo URL]/issues

---

**Last Updated**: [Current Date]
**Reviewed By**: [Your Name]
**Status**: [ ] Ready / [ ] Not Ready
