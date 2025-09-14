# Quick Start Guide 🚀

Welcome to your new VFX portfolio website! Follow these simple steps to get it running.

## 📦 Step 1: Install Dependencies

Open terminal in your project folder and run:
```bash
npm install
```

## 🔧 Step 2: Configure Email (Optional)

1. Copy the environment template:
   ```bash
   cp .env.example .env
   ```

2. Edit `.env` file with your Gmail app password:
   ```env
   EMAIL_USER=devaanshkushwaha06@gmail.com
   EMAIL_PASS=your-gmail-app-password-here
   ```

   **To get Gmail App Password:**
   - Enable 2-factor authentication on your Google account
   - Go to Google Account Settings → Security → App passwords
   - Generate a password for "Mail"

## 🎬 Step 3: Add Your VFX Content

1. **Videos**: Place your VFX videos in `frontend/assets/videos/`
   - `demo-reel.mp4`
   - `acm-intro.mp4`
   - `compositing-work.mp4`
   - `3d-character.mp4`

2. **Images**: Add thumbnails in `frontend/assets/images/`
   - `demo-reel-thumb.jpg`
   - `acm-intro-thumb.jpg`
   - `compositing-thumb.jpg`
   - `3d-animation-thumb.jpg`
   - `profile.jpg`

## 🚀 Step 4: Start the Website

For development:
```bash
npm run dev
```

For production:
```bash
npm start
```

## 🌐 Step 5: View Your Website

Open your browser and go to:
```
http://localhost:3000
```

## ✅ Test Email (Optional)

Test if your contact form works:
```bash
npm run test-email
```

## 🎨 Customize Your Content

Edit these files to personalize your portfolio:
- `frontend/index.html` - Update personal information
- `backend/server.js` - Update portfolio data and skills
- `frontend/css/style.css` - Customize colors and styling

## 🌍 Deploy Your Website

### Quick Deploy to Vercel:
```bash
npm run deploy:vercel
```

### Deploy to Heroku:
```bash
npm run deploy:heroku
```

## 📱 What's Included

✅ **Responsive Design** - Works on all devices  
✅ **VFX Portfolio** - Showcase your best work  
✅ **Contact Form** - Receive messages from visitors  
✅ **Skills Section** - Display your expertise  
✅ **Modern UI** - Professional and clean design  
✅ **Fast & Secure** - Optimized for performance  

## 🆘 Need Help?

Check the main `README.md` for detailed documentation, or look at these common solutions:

**Videos not showing?**
- Make sure video files are in `frontend/assets/videos/`
- Check that filenames match exactly

**Contact form not working?**
- Run `npm run test-email` to test email setup
- Check your Gmail app password in `.env`

**Website not loading?**
- Make sure you ran `npm install`
- Try a different port: `PORT=3001 npm start`

---

**🎉 Congratulations! Your VFX portfolio is ready to showcase your amazing work!**

Remember to add your actual VFX videos and images to make it truly yours.