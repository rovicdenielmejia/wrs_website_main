# WRS Repository Folder Structure

This site is an **HR & Recruitment Solutions information and hiring site** (no database, no portals, no logins).

## Current Structure

```
wiring-website-WRS/
├── home.html
├── why-us.html
├── pricing.html
├── about.html
├── jobs.html
├── faq.html
├── blogs.html
├── book-consultation.html
├── contact.html
├── thank-you.html
├── WorkforceRecruitmentSolution-hr.html
│
├── solutions/
│   ├── solutions.html
│   ├── employers.html       (dedicated employers page)
│   ├── job-seekers.html     (dedicated job seekers / talent page)
│   ├── employer-solutions.html
│   └── enterprise-global.html
│
├── services/
│   ├── services.html
│   ├── hr-services.html
│   └── recruitment-process.html
│
├── platform/
│   ├── platform.html
│   ├── automation.html
│   └── ai-platform.html
│
├── legal/
│   ├── privacy.html
│   └── terms.html
│
├── css/
│   ├── styles.css
│   ├── styles-portal.css
│   └── styles-hr.css
│
├── js/
│   └── script.js
│
├── docs/
├── Assets/
├── README.md
├── vercel.json, robots.txt, sitemap.xml, …
```

## Navigation → File Mapping

| Nav Item   | Location      |
|-----------|---------------|
| Solutions | `solutions/`  |
| Services  | `services/`   |
| Platform  | `platform/`   |
| Legal     | `legal/`      |
| Main      | Home, Why Us, Pricing, About, Jobs, FAQ, Blogs, Contact, Book consultation | Root |

## Notes

- Root HTML uses `css/`, `js/`; subfolder pages use `../css/`, `../js/`, `../Assets/`.
- All hiring and contact flows go through **Book a consultation** and **Jobs** (information and contact only).
