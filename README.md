# DK_SECURE_PORTFOLIO — Devaansh Kushwaha

A cyberpunk-themed personal portfolio website for Devaansh Kushwaha — B.Tech CSE (Cybersecurity) student at UPES Dehradun, VFX Head at UPES ACM, game developer, and cybersecurity researcher.

## 🌐 Live Site

Deployed on **Vercel** — [devaansh-portfolio.vercel.app](https://devaansh-portfolio.vercel.app)

---

## 📄 Pages

| Page | File | Description |
|------|------|-------------|
| Home | `frontend/index.html` | Landing page with hero, skills, and quick stats |
| About Me | `frontend/about.html` | Full bio, experience timeline, skills, contact section |
| Projects Log | `frontend/technical.html` | Technical projects — cybersecurity, VFX, game dev, Web3 |
| Credential Vault | `frontend/certifications.html` | Certifications, academic credentials, and roles |

---

## 🚀 Tech Stack

### Frontend
- HTML5, Tailwind CSS (CDN), Vanilla JavaScript
- Google Material Symbols (icons)
- Google Fonts — Space Grotesk, JetBrains Mono
- Responsive — mobile, tablet, desktop

### Backend
- Node.js + Express.js
- Nodemailer (contact form email)
- Helmet (security headers)
- Rate limiting + CORS

---

## 📁 Project Structure

```
website-clean/
├── frontend/
│   ├── index.html              # Home / landing page
│   ├── about.html              # About Me page
│   ├── technical.html          # Projects Log page
│   ├── certifications.html     # Credential Vault page
│   └── assets/
│       ├── images/             # Profile photo, thumbnails
│       ├── videos/             # VFX showcase videos
│       └── Devaansh_Kushwaha_CV.pdf  # Downloadable resume
├── backend/
│   ├── server.js               # Main Express server
│   ├── server-new.js           # Updated server variant
│   ├── test-contact.js         # Email test script
│   └── test-server.js          # Server test script
├── package.json
├── vercel.json                 # Vercel deployment config
├── Procfile                    # Heroku config
└── README.md
```

---

## 🛠️ Local Setup

### Prerequisites
- Node.js v14+
- npm

### Install & Run

```bash
# Install dependencies
npm install

# Start development server (with nodemon)
npm run dev

# Start production server
npm start
```

Visit `http://localhost:3000`

### Environment Variables

Create a `.env` file in the root:

```env
EMAIL_USER=devaanshkushwaha@gmail.com
EMAIL_PASS=your-gmail-app-password
PORT=3000
```

---

## 🌍 Deployment

### Vercel (Primary)
```bash
vercel --prod
```

The `vercel.json` is already configured — frontend served as static, backend `/api/*` routes handled by Node.

### Heroku (Alternative)
```bash
git push heroku main
heroku config:set EMAIL_USER=devaanshkushwaha@gmail.com
heroku config:set EMAIL_PASS=your-app-password
```

---

## 📦 Available Scripts

| Command | Description |
|---------|-------------|
| `npm start` | Start production server |
| `npm run dev` | Start dev server with nodemon |
| `npm run test-email` | Test email/contact form |
| `npm run deploy:vercel` | Deploy to Vercel (prod) |

---

## 🔧 API Endpoints

- `GET /api/health` — Server health check
- `POST /api/contact` — Submit contact form (sends email)

---

## 📬 Contact

| Platform | Details |
|----------|---------|
| Email (Gmail) | devaanshkushwaha@gmail.com |
| Email (Outlook) | devkush2006@outlook.com |
| Phone / WhatsApp | +91 6265954576 |
| GitHub | [devaanshkushwaha06](https://github.com/devaanshkushwaha06) |
| LinkedIn | [devaansh-kushwaha](https://www.linkedin.com/in/devaansh-kushwaha-316340338) |
| Institution | UPES Dehradun — B.Tech CSE (Cybersecurity), Batch 2024–2028 |

---

**Built by Devaansh Kushwaha**
