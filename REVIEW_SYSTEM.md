# Interactive Review System

## Overview
This system allows clients to submit reviews that will appear on your website with a horizontal scroll feature. You'll receive email notifications for every new review.

## Features

### 🌟 Client Review Submission
- **Star Rating**: Interactive 1-5 star selection
- **Review Form**: Name, position, review text, and optional email
- **Real-time Validation**: Ensures all required fields are filled
- **User Feedback**: Success/error notifications

### 📱 Review Display
- **Horizontal Scroll**: Beautiful scrollable review cards
- **Navigation**: Left/right scroll buttons
- **Responsive Design**: Works on all devices
- **Smooth Animations**: Hover effects and transitions

### 📧 Email Notifications
- **Instant Alerts**: Email sent to `devkush2006@outlook.com` when reviews are submitted
- **Detailed Information**: Includes reviewer details, rating, and full review text
- **Professional Format**: HTML email with styling

## How It Works

### For Clients:
1. Visit the About page
2. Scroll to "What Clients Say" section
3. Click on "Share Your Experience" form
4. Fill out name, position, rating, and review
5. Submit the form
6. Review appears after approval

### For You:
1. Receive instant email notification
2. Review contains all submission details
3. Decide to approve/reject the review
4. Reviews appear on website immediately (can be configured)

## Technical Details

### Frontend (`about.html`)
- Interactive star rating system
- Form validation
- Horizontal scroll functionality
- AJAX form submission

### Backend (`server.js`)
- `/api/reviews` endpoint
- Email notification system
- Input validation and sanitization
- Rate limiting protection

### Styling (`multipage.css`)
- Scrollable review container
- Interactive star rating
- Professional form design
- Responsive layouts

## Configuration

### Email Setup
Make sure your `.env` file contains:
```
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
```

### Rate Limiting
- 5 review submissions per 15 minutes per IP
- Prevents spam and abuse

## API Endpoints

### Submit Review
```
POST /api/reviews
Content-Type: application/json

{
  "reviewerName": "Client Name",
  "reviewerPosition": "Job Title",
  "reviewRating": 5,
  "reviewText": "Great work!",
  "reviewerEmail": "client@email.com"
}
```

### Response
```json
{
  "success": true,
  "message": "Thank you for your review! It will appear on the website after approval."
}
```

## Security Features
- Input validation and sanitization
- Rate limiting
- Email verification
- CORS protection
- Helmet security headers

## Future Enhancements
- Admin panel for review management
- Database storage for reviews
- Auto-moderation system
- Review analytics dashboard
- Social media integration

---

**Need help?** Contact Devaansh at devkush2006@outlook.com