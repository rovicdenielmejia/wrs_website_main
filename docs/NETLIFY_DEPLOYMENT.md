# Netlify Deployment Guide
## Workforce Recruitment Solutions

This guide will help you deploy the Workforce Recruitment Solutions website to Netlify.

## 🚀 Quick Deployment

### Method 1: Drag & Drop (Easiest)

1. **Prepare Files**
   - Ensure all files are in the project folder (e.g. home.html, book-consultation.html, thank-you.html, solutions/, services/, platform/, legal/, css/, js/, Assets/)

2. **Deploy**
   - Go to [https://app.netlify.com/](https://app.netlify.com/)
   - Sign up or log in
   - Drag and drop your project folder onto the Netlify dashboard
   - Your site will be live instantly!

3. **Get Your URL**
   - Netlify will provide a random URL like `random-name-123456.netlify.app`
   - You can customize it in Site settings → Domain management

### Method 2: Git Integration (Recommended for Updates)

1. **Push to GitHub/GitLab/Bitbucket**
   ```bash
   git init
   git add .
   git commit -m "Initial commit - Workforce Recruitment Solutions"
   git remote add origin YOUR_REPOSITORY_URL
   git push -u origin main
   ```

2. **Connect to Netlify**
   - Go to Netlify Dashboard
   - Click "Add new site" → "Import an existing project"
   - Choose your Git provider (GitHub/GitLab/Bitbucket)
   - Select your repository
   - Netlify will auto-detect settings from `netlify.toml`

3. **Build Settings** (Auto-detected from netlify.toml)
   - Build command: (none needed for static site)
   - Publish directory: `.` (root)
   - Deploy!

## ⚙️ Configuration

The `netlify.toml` file includes:
- ✅ Security headers
- ✅ Cache control for optimal performance
- ✅ Redirect rules
- ✅ Form handling configuration

## 🌐 Custom Domain Setup

1. **Add Domain**
   - Go to Site settings → Domain management
   - Click "Add custom domain"
   - Enter your domain name

2. **Configure DNS**
   - Netlify will provide DNS records
   - Add them to your domain registrar
   - Wait for DNS propagation (usually 24-48 hours)

3. **Enable HTTPS**
   - Netlify automatically provisions SSL certificates
   - HTTPS is enabled by default (Let's Encrypt)

## 📧 Environment Variables (Optional)

If you configure EmailJS or other services, add environment variables:

1. Go to Site settings → Environment variables
2. Add variables like:
   - `EMAILJS_SERVICE_ID`
   - `EMAILJS_TEMPLATE_ID`
   - `EMAILJS_PUBLIC_KEY`

Update `script.js` to use: `process.env.EMAILJS_SERVICE_ID`

## 📊 Form Handling

Netlify Forms are automatically detected. To enable:

1. Add `netlify` attribute to your form:
   ```html
   <form id="application-form" netlify>
   ```

2. Or use Netlify Forms API (configured in netlify.toml)

## 🔄 Continuous Deployment

Once connected to Git:
- Every push to `main` branch = automatic deployment
- Preview deployments for pull requests
- Deploy history and rollback options

## 📈 Performance Optimization

Netlify automatically:
- ✅ CDN distribution (global edge network)
- ✅ Automatic image optimization (enable in settings)
- ✅ Asset minification and compression
- ✅ HTTP/2 support
- ✅ Gzip/Brotli compression

## 🛠️ Build Plugins (Optional)

Add Netlify plugins in `netlify.toml`:

```toml
[[plugins]]
  package = "@netlify/plugin-sitemap"
```

## 📝 Site Information

- **Copyright:** © 2026 Workforce Recruitment Solutions. All Rights Reserved.
- **Established:** 2023
- **License:** Proprietary - All Rights Reserved

## ✅ Pre-Deployment Checklist

- [ ] All files are in the project folder
- [ ] Test all forms locally (e.g. book consultation)
- [ ] Verify all images load correctly
- [ ] Test responsive design on mobile/tablet/desktop
- [ ] Check browser console for errors
- [ ] Update any hardcoded URLs to use relative paths
- [ ] Review `netlify.toml` configuration if present

## 🐛 Troubleshooting

### Forms Not Working
- Ensure `netlify` attribute is on form tag
- Check Netlify Forms settings in dashboard
- Verify form action is correct

### Assets Not Loading
- Check file paths (use relative paths, not absolute)
- Ensure file names match exactly (case-sensitive)
- Verify files are in correct directory

### SSL Certificate Issues
- Wait 24-48 hours after domain setup
- Check DNS records are correct
- Contact Netlify support if issues persist

## 📞 Support

- **Netlify Docs:** [https://docs.netlify.com/](https://docs.netlify.com/)
- **Netlify Support:** [https://www.netlify.com/support/](https://www.netlify.com/support/)
- **Community:** [https://answers.netlify.com/](https://answers.netlify.com/)

## 🎉 After Deployment

1. Test all functionality on live site
2. Share the URL with stakeholders
3. Set up custom domain (if applicable)
4. Configure form/email notifications if using forms
5. Monitor site analytics in Netlify dashboard

---

**Ready to deploy!** Follow Method 1 for fastest deployment or Method 2 for continuous integration.
