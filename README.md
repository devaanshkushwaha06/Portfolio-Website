# Devaansh Kushwaha - VFX Portfolio Website

A modern, responsive portfolio website showcasing VFX work, skills, and achievements. Built with HTML5, CSS3, JavaScript, and Node.js.

## 🎨 Features

- **Responsive Design** - Works perfectly on desktop, tablet, and mobile
- **Modern UI/UX** - Clean, professional design with smooth animations
- **VFX Portfolio Showcase** - Dedicated sections for different types of VFX work
- **Contact Form** - Working contact form with email integration
- **Skills Visualization** - Animated skill bars and progress indicators
- **Fast & Secure** - Optimized performance with security best practices

## 🚀 Tech Stack

### Frontend
- HTML5, CSS3, JavaScript (ES6+)
- Font Awesome Icons
- Google Fonts (Poppins)
- CSS Grid & Flexbox
- Responsive Design

### Backend
- Node.js with Express.js
- Nodemailer for email functionality
- Helmet for security
- Rate limiting
- CORS enabled

## 📁 Project Structure

```
website/
├── frontend/                 # Client-side files
│   ├── css/
│   │   └── style.css        # Main stylesheet
│   ├── js/
│   │   └── script.js        # JavaScript functionality
│   ├── assets/
│   │   ├── images/          # Image assets
│   │   └── videos/          # VFX video files
│   └── index.html           # Main HTML file
├── backend/
│   └── server.js            # Express server
├── package.json             # Dependencies and scripts
├── .env.example             # Environment variables template
├── .gitignore              # Git ignore file
└── README.md               # This file
```

## 🛠️ Setup Instructions

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- Git

### Installation

1. **Clone or download the project**
   ```bash
   cd "d:\Devaansh Kushwaha\website"
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` file and add your email credentials:
   ```env
   EMAIL_USER=devaanshkushwaha06@gmail.com
   EMAIL_PASS=your-gmail-app-password-here
   ```

4. **Add your VFX content**
   - Place your VFX videos in `frontend/assets/videos/`
   - Add thumbnail images in `frontend/assets/images/`
   - Update portfolio data in `backend/server.js` if needed

5. **Start the development server**
   ```bash
   npm run dev
   ```
   
   Or for production:
   ```bash
   npm start
   ```

6. **Open your browser**
   Visit `http://localhost:3000`

## 📧 Email Setup (Gmail)

To enable the contact form email functionality:

1. **Enable 2-Factor Authentication** on your Google account
2. **Generate an App Password**:
   - Go to Google Account Settings
   - Security → 2-Step Verification → App passwords
   - Generate a password for "Mail"
3. **Update .env file** with the app password

## 🎬 Adding Your VFX Content

### Videos
1. Place your VFX videos in `frontend/assets/videos/`
2. Recommended filenames:
   - `demo-reel.mp4` - Your main demo reel
   - `acm-intro.mp4` - UPES ACM intro video
   - `compositing-work.mp4` - Compositing showcase
   - `3d-character.mp4` - 3D animation work

### Images
1. Add thumbnails in `frontend/assets/images/`
2. Recommended files:
   - `demo-reel-thumb.jpg`
   - `acm-intro-thumb.jpg` 
   - `compositing-thumb.jpg`
   - `3d-animation-thumb.jpg`
   - `profile.jpg` - Your profile photo

### Update Portfolio Data
Edit `backend/server.js` to update:
- Project descriptions
- Technology lists
- Skills and percentages
- Personal information

## 🌐 Deployment

### Deploy to Heroku
1. Install Heroku CLI
2. Create a Heroku app:
   ```bash
   heroku create devaansh-portfolio
   ```
3. Set environment variables:
   ```bash
   heroku config:set EMAIL_USER=devaanshkushwaha06@gmail.com
   heroku config:set EMAIL_PASS=your-app-password
   ```
4. Deploy:
   ```bash
   git push heroku main
   ```

### Deploy to Netlify (Frontend only)
1. Build the frontend:
   ```bash
   npm run build
   ```
2. Deploy the `frontend` folder to Netlify
3. For contact form, use Netlify Forms or integrate with a service like Formspree

### Deploy to Vercel
1. Install Vercel CLI:
   ```bash
   npm i -g vercel
   ```
2. Deploy:
   ```bash
   vercel
   ```

## 📱 Available Scripts

- `npm start` - Start production server
- `npm run dev` - Start development server with nodemon
- `npm run install-backend` - Install backend dependencies only

## 🎨 Customization

### Colors
Update CSS custom properties in `frontend/css/style.css`:
```css
:root {
  --primary-color: #6c5ce7;
  --secondary-color: #a29bfe;
  --accent-color: #ffeaa7;
}
```

### Content
- Update personal information in HTML
- Modify skills and experience in backend data
- Add/remove portfolio categories
- Customize contact information

## 🔧 API Endpoints

- `GET /api/health` - Server health check
- `GET /api/portfolio` - Get portfolio projects
- `GET /api/portfolio/:id` - Get specific project
- `GET /api/skills` - Get skills data
- `GET /api/about` - Get about information
- `POST /api/contact` - Submit contact form

## 📋 To-Do List

- [ ] Add your actual VFX videos
- [ ] Update portfolio project descriptions
- [ ] Add your profile photo
- [ ] Configure email settings
- [ ] Test contact form
- [ ] Add social media links
- [ ] Optimize images for web
- [ ] Set up analytics (Google Analytics)

## 🤝 Contact Information

- **Email**: devaanshkushwaha06@gmail.com
- **Backup Email**: Devkush2006@outlook.com
- **Phone**: +91 6265954576
- **Institution**: UPES Dehradun
- **Position**: VFX Head at UPES ACM
- **LinkedIn**: https://www.linkedin.com/in/devaansh-kushwaha-316340338
- **GitHub**: https://github.com/devaanshkushwaha06
- **Instagram**: https://www.instagram.com/devaanshkushwaha06/

## 📄 License

This project is created for Devaansh Kushwaha's personal portfolio. Feel free to use it as inspiration for your own portfolio.

## 🐛 Troubleshooting

### Common Issues:

1. **Port already in use**
   ```bash
   PORT=3001 npm start
   ```

2. **Email not sending**
   - Check Gmail app password
   - Verify .env file configuration
   - Check spam folder

3. **Videos not loading**
   - Ensure video files are in correct directory
   - Check file names match exactly
   - Verify video format is supported

4. **CSS not loading**
   - Clear browser cache
   - Check file paths
   - Verify server is serving static files

For additional help, check the browser console for error messages.

---

**Built with ❤️ for showcasing amazing VFX work!**