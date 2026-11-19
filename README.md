# Hloni — Personal Portfolio & Admin Dashboard

A minimalist, high-performance portfolio website built with **Next.js**, **React**, and **Tailwind CSS**, designed for zero-cost deployment on **Vercel** and **GitHub**.

---

## 🚀 Features

1. **Top Section Header**: Placed naturally at the top so it scrolls away cleanly as the user moves down the page.
2. **Hero Section**:
   - Status tag: `Welcome to my personal Portfolio` with active status indicator.
   - Dynamic real-time ticking date and clock.
   - Large display typography: `Comming to Know Me.`
   - Profile avatar next to the bio text above the `Explore selected work` button.
3. **01 / PORTFOLIO (Selected work)**:
   - Header subtitle: `View my workd and projects`.
   - Interactive project cards: clicking any card or its arrow button opens a modal displaying the picture, full description, date, category tag, and external link.
4. **02 / BACKGROUND (Built through experience)**:
   - Item 01: `Lumotech`, `Shaddower, Maintanance Department Assistance`, `2026 — June`.
   - Experience Details Modal: button after the date pops up a modal with full description, image, date, and position.
   - Includes Robo Rumble (Soweto), W3node Hackathon (Cape Town), and professional timeline.
   - `View full resume ↗` button with PDF download/view.
5. **03 / ABOUT**:
   - Headline: `A Robotist man, A productive mind, An explorer`.
   - 3 customizable story paragraphs detailing programming, robotics competitions, and builder mindset.
   - Core robotics capabilities and skills badges.
6. **05 / CONTACT ME**:
   - Headline: `Let's buildsomething.`
   - Subtitle: `get in touch to build and find out more with me`.
   - `Get in touch` button triggers modal with GitHub, LinkedIn, WhatsApp (`whats.me`), and Email with copy-to-clipboard and direct visit actions.
7. **`/admin` Dashboard**:
   - **About & Bio**: Edit the 3 headline lines, 3 story paragraphs, and hero bio.
   - **Projects / Work**: Add new projects with title, category, tags, date, image URL, link, and full description.
   - **Experience**: Add new experience with typing inputs for `Name`, `Position`, `Date`, `Image`, and `Description`.
   - **Skills**: Add or remove robotics, engineering, and software skills.
   - **Contact Links**: Add or edit contact links with custom icon URLs from websites like Simple Icons or SVGs.
   - **Resume PDF Manager**: Upload a new PDF file or paste an external link, plus preview/download the current resume.
   - **Export & Backup**: One-click JSON export (`portfolio-data.json`) to keep your data synced with Git, plus reset to defaults.

---

## 🛠️ Local Development

```bash
# Install dependencies
npm install

# Start local development server
npm run dev
```

Visit:
- **Live Portfolio**: [http://localhost:3000](http://localhost:3000)
- **Admin Dashboard**: [http://localhost:3000/admin](http://localhost:3000/admin)

---

## 🌐 How to Host on Vercel for Free ($0)

1. **Initialize Git & Push to GitHub**:
   ```bash
   git init
   git add .
   git commit -m "Initial portfolio commit"
   git branch -M main
   git remote add origin https://github.com/<your-username>/<your-repo-name>.git
   git push -u origin main
   ```

2. **Deploy to Vercel**:
   - Go to [vercel.com](https://vercel.com) and sign in with GitHub.
   - Click **"Add New..."** > **"Project"**.
   - Select your repository and click **Deploy**.
   - Your site will be live on `https://your-portfolio.vercel.app` in under 60 seconds with SSL and global CDN for free!
