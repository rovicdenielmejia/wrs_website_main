# Deployment Summary
## Workforce Recruitment Solutions – Information & hiring site

**Status:** Ready for deployment as a static site  
**Note:** No database, no admin or user logins. Contact via Book a consultation and Jobs.

## File structure (main items)

```
.
├── home.html, why-us.html, pricing.html, about.html, jobs.html
├── faq.html, blogs.html, book-consultation.html, thank-you.html
├── solutions/, services/, platform/, legal/
├── css/ (styles.css, styles-portal.css, styles-hr.css)
├── js/ (script.js)
├── Assets/, docs/
├── vercel.json, package.json, README.md
└── robots.txt, sitemap.xml (if present)
```

## Deploy

- **Vercel:** `npm run dev` locally; deploy via Vercel CLI or connect Git repo.
- **Netlify:** Drag & drop or connect Git; static site, no build required.

## Forms (optional)

If you use contact/consultation forms, configure form handling in your host (e.g. Netlify Forms) and any email notifications in the host dashboard.

---

**© 2026 Workforce Recruitment Solutions. All Rights Reserved.**
