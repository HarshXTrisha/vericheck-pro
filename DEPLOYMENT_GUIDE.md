# VeriCheck Pro - Deployment Guide

This guide will help you deploy VeriCheck Pro to production.

## Pre-Deployment Checklist

- [ ] Get a Google Gemini API key from [Google AI Studio](https://aistudio.google.com/app/apikey)
- [ ] Test the application locally with `npm run dev`
- [ ] Verify all features work correctly
- [ ] Review and update environment variables
- [ ] Check that `.env.local` is in `.gitignore`

## Deployment Options

### Option 1: Vercel (Recommended - Easiest)

Vercel is the recommended platform as it natively supports the serverless function structure.

#### Steps:

1. **Create a Vercel Account**
   - Go to [vercel.com](https://vercel.com)
   - Sign up with GitHub, GitLab, or Bitbucket

2. **Install Vercel CLI** (Optional)
   ```bash
   npm i -g vercel
   ```

3. **Deploy via CLI**
   ```bash
   vercel
   ```
   
   Or **Deploy via GitHub**:
   - Push your code to GitHub
   - Import the repository in Vercel dashboard
   - Vercel will auto-detect the configuration

4. **Set Environment Variables**
   - Go to Project Settings → Environment Variables
   - Add: `GEMINI_API_KEY` = `your_actual_api_key`
   - Apply to: Production, Preview, Development
   - Click "Save"

5. **Redeploy**
   - Trigger a new deployment from the dashboard
   - Or push a new commit to trigger auto-deployment

6. **Verify**
   - Visit your deployment URL
   - Test the analysis feature
   - Check browser console for errors

#### Custom Domain (Optional)
- Go to Project Settings → Domains
- Add your custom domain
- Follow DNS configuration instructions

---

### Option 2: Netlify

Netlify requires adapting the serverless functions.

#### Steps:

1. **Modify API Structure**
   - Move `api/analyze.ts` to `netlify/functions/analyze.ts`
   - Update the function export format for Netlify

2. **Create `netlify.toml`**
   ```toml
   [build]
     command = "npm run build"
     publish = "dist"
     functions = "netlify/functions"

   [[redirects]]
     from = "/api/*"
     to = "/.netlify/functions/:splat"
     status = 200

   [[redirects]]
     from = "/*"
     to = "/index.html"
     status = 200
   ```

3. **Deploy**
   - Connect your GitHub repository
   - Set build command: `npm run build`
   - Set publish directory: `dist`
   - Add environment variable: `GEMINI_API_KEY`

---

### Option 3: Self-Hosted (Advanced)

For full control, deploy on your own server.

#### Requirements:
- Node.js 18+ server
- Nginx or Apache for reverse proxy
- SSL certificate (Let's Encrypt recommended)

#### Steps:

1. **Create Express Backend**
   
   Create `server.js`:
   ```javascript
   import express from 'express';
   import { handler } from './api/analyze.js';
   
   const app = express();
   app.use(express.json());
   app.use(express.static('dist'));
   
   app.post('/api/analyze', async (req, res) => {
     await handler(req, res);
   });
   
   app.get('*', (req, res) => {
     res.sendFile('dist/index.html', { root: '.' });
   });
   
   app.listen(3000, () => {
     console.log('Server running on port 3000');
   });
   ```

2. **Build Frontend**
   ```bash
   npm run build
   ```

3. **Set Environment Variables**
   ```bash
   export GEMINI_API_KEY=your_api_key
   ```

4. **Run with PM2**
   ```bash
   npm install -g pm2
   pm2 start server.js
   pm2 save
   pm2 startup
   ```

5. **Configure Nginx**
   ```nginx
   server {
     listen 80;
     server_name yourdomain.com;
     
     location / {
       proxy_pass http://localhost:3000;
       proxy_http_version 1.1;
       proxy_set_header Upgrade $http_upgrade;
       proxy_set_header Connection 'upgrade';
       proxy_set_header Host $host;
       proxy_cache_bypass $http_upgrade;
     }
   }
   ```

6. **Setup SSL with Certbot**
   ```bash
   sudo certbot --nginx -d yourdomain.com
   ```

---

## Post-Deployment

### Testing Checklist

- [ ] Homepage loads correctly
- [ ] File upload works (PDF, DOCX, TXT)
- [ ] Text paste works
- [ ] Analysis completes successfully
- [ ] Report displays correctly
- [ ] Mobile view works
- [ ] Print functionality works
- [ ] Error handling works (try invalid input)

### Monitoring

1. **Vercel Analytics** (if using Vercel)
   - Enable in Project Settings
   - Monitor page views and performance

2. **Error Tracking** (Optional)
   - Add Sentry for error tracking
   - Install: `npm install @sentry/react`
   - Configure in `index.tsx`

3. **API Usage Monitoring**
   - Monitor Gemini API usage in [Google AI Studio](https://aistudio.google.com)
   - Set up billing alerts
   - Track quota usage

### Performance Optimization

1. **Enable Caching**
   - Configure CDN caching for static assets
   - Set appropriate cache headers

2. **Image Optimization**
   - Use WebP format for images
   - Implement lazy loading

3. **Code Splitting**
   - Already configured in Vite
   - Monitor bundle sizes

### Security Best Practices

1. **API Key Security**
   - Never commit API keys to Git
   - Rotate keys periodically
   - Use environment variables only

2. **Rate Limiting**
   - Implement rate limiting on API routes
   - Use Vercel's built-in rate limiting or add custom middleware

3. **CORS Configuration**
   - Configure allowed origins
   - Restrict to your domain only

4. **Content Security Policy**
   - Add CSP headers in `vercel.json`:
   ```json
   {
     "headers": [
       {
         "source": "/(.*)",
         "headers": [
           {
             "key": "Content-Security-Policy",
             "value": "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://cdn.tailwindcss.com https://esm.sh https://cdnjs.cloudflare.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com;"
           }
         ]
       }
     ]
   }
   ```

### Troubleshooting

#### "API Key not configured"
- Verify environment variable is set in deployment platform
- Check variable name matches exactly: `GEMINI_API_KEY`
- Redeploy after adding variables

#### "CORS Error"
- Check API endpoint configuration
- Verify CORS headers in `api/analyze.ts`
- Ensure frontend is calling correct API URL

#### "Build Failed"
- Check Node.js version (18+ required)
- Verify all dependencies are installed
- Review build logs for specific errors

#### "Analysis Timeout"
- Increase serverless function timeout (Vercel: 60s max on Pro)
- Reduce text length being analyzed
- Check Gemini API status

### Scaling Considerations

1. **High Traffic**
   - Upgrade to Vercel Pro for higher limits
   - Implement request queuing
   - Add Redis for caching results

2. **Cost Management**
   - Monitor Gemini API costs
   - Implement usage limits per user
   - Cache common queries

3. **Database Integration** (Future)
   - Add PostgreSQL for storing reports
   - Implement user authentication
   - Track usage analytics

---

## Support

If you encounter issues:
1. Check the troubleshooting section above
2. Review deployment platform logs
3. Check browser console for errors
4. Verify API key is valid and has quota

## Next Steps

After successful deployment:
- [ ] Set up custom domain
- [ ] Configure analytics
- [ ] Add error tracking
- [ ] Implement rate limiting
- [ ] Set up monitoring alerts
- [ ] Create backup strategy

---

**Congratulations!** Your VeriCheck Pro instance is now live. 🎉
