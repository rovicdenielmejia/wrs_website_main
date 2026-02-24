# Deployment Checklist
## Workforce Recruitment Solutions – Static information site

Use this checklist to ensure your website is ready for deployment.

## Pre-Deployment Checklist

### Files & Structure
- [ ] Root HTML present (home.html, why-us.html, pricing.html, about.html, jobs.html, faq.html, blogs.html, book-consultation.html, thank-you.html)
- [ ] Subfolders present (solutions/, services/, platform/, legal/)
- [ ] CSS present (styles.css, styles-portal.css, styles-hr.css)
- [ ] JS present (script.js)
- [ ] Assets/ and docs/ present
- [ ] vercel.json or netlify config as needed
- [ ] robots.txt, sitemap.xml if used

### Content
- [ ] Footer and copyright up to date
- [ ] All links point to existing pages (no employer/candidate login or register)

### Security
- [ ] No sensitive information in code
- [ ] Form spam protection (e.g. honeypot) if using forms

### Testing
- [ ] All pages load correctly
- [ ] Responsive design on mobile/tablet/desktop
- [ ] Book consultation / contact forms work (or are disabled if not in use)
- [ ] Navigation and all links work
- [ ] No console errors

### SEO & Metadata
- [ ] Meta description and titles on key pages
- [ ] Alt text on images
- [ ] robots.txt configured if needed

## Deployment (Vercel / Netlify)

### Option 1: Drag & Drop
1. Zip project (or select folder)
2. Go to Vercel or Netlify
3. Drag and drop folder/zip
4. Test live site and URL

### Option 2: Git
1. Push to GitHub/GitLab/Bitbucket
2. Connect repo to Vercel or Netlify
3. Deploy; verify live site

## Post-Deployment

- [ ] Custom domain (optional)
- [ ] Form notifications (e.g. Netlify Forms) if using forms
- [ ] Monitor uptime and links

---

**Note:** This is an information-only site (no database, no admin or user logins). All contact flows go through Book a consultation and Jobs.
