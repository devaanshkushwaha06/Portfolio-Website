const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const nodemailer = require('nodemailer');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Security middleware
app.use(helmet({
    contentSecurityPolicy: false // Disable CSP for now to allow inline styles
}));

// Rate limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    message: 'Too many requests from this IP, please try again later.'
});
app.use(limiter);

// Contact form rate limiting (more restrictive)
const contactLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // limit each IP to 5 contact form submissions per 15 minutes
    message: 'Too many contact form submissions, please try again later.'
});

// Middleware
app.use(cors({
    origin: ['http://localhost:3000', 'http://127.0.0.1:3000', 'file://'],
    credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Add request logging
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
    next();
});

// Serve static files from frontend directory
const staticPath = path.join(__dirname, '../frontend');
console.log('Serving static files from:', staticPath);
app.use(express.static(staticPath));

// Configure nodemailer
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER || 'devaanshkushwaha06@gmail.com',
        pass: process.env.EMAIL_PASS || 'your-app-password-here' // Use app password for Gmail
    }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
    console.log('🔍 Health check requested');
    res.json({ 
        success: true, 
        message: 'Server is running',
        timestamp: new Date().toISOString()
    });
});

// Contact form submission
app.post('/api/contact', contactLimiter, async (req, res) => {
    try {
        const { name, email, subject, message } = req.body;
        
        // Validation
        if (!name || !email || !subject || !message) {
            return res.status(400).json({ 
                success: false, 
                message: 'All fields are required' 
            });
        }
        
        // Email validation regex
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ 
                success: false, 
                message: 'Please provide a valid email address' 
            });
        }
        
        // Prepare email content
        const mailOptions = {
            from: process.env.EMAIL_USER || 'devaanshkushwaha06@gmail.com',
            to: ['devaanshkushwaha06@gmail.com', 'Devkush2006@outlook.com'],
            subject: `Portfolio Contact: ${subject}`,
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h2 style="color: #6c5ce7; border-bottom: 2px solid #6c5ce7; padding-bottom: 10px;">
                        New Contact Form Submission
                    </h2>
                    
                    <div style="background-color: #f8f9fa; padding: 20px; border-radius: 10px; margin: 20px 0;">
                        <h3 style="color: #2d3436; margin-bottom: 15px;">Contact Details:</h3>
                        <p><strong>Name:</strong> ${name}</p>
                        <p><strong>Email:</strong> ${email}</p>
                        <p><strong>Subject:</strong> ${subject}</p>
                    </div>
                    
                    <div style="background-color: #fff; padding: 20px; border-left: 4px solid #6c5ce7; margin: 20px 0;">
                        <h3 style="color: #2d3436; margin-bottom: 15px;">Message:</h3>
                        <p style="line-height: 1.6; color: #636e72;">${message.replace(/\n/g, '<br>')}</p>
                    </div>
                    
                    <div style="text-align: center; margin-top: 30px; padding: 20px; background-color: #f1f3f4; border-radius: 10px;">
                        <p style="color: #636e72; margin: 0;">
                            This message was sent from your portfolio website contact form.
                        </p>
                        <p style="color: #636e72; margin: 5px 0 0 0; font-size: 0.9em;">
                            Timestamp: ${new Date().toLocaleString()}
                        </p>
                    </div>
                </div>
            `,
            replyTo: email
        };
        
        // Send email
        await transporter.sendMail(mailOptions);
        
        res.json({ 
            success: true, 
            message: 'Message sent successfully! I will get back to you soon.' 
        });
        
    } catch (error) {
        console.error('Error sending email:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Failed to send message. Please try again later.' 
        });
    }
});

// Review submission endpoint
app.post('/api/reviews', contactLimiter, async (req, res) => {
    console.log('📝 Review submission received:', {
        timestamp: new Date().toISOString(),
        body: req.body,
        ip: req.ip
    });
    
    try {
        const { reviewerName, reviewerPosition, reviewRating, reviewText, reviewerEmail } = req.body;
        
        // Validation
        if (!reviewerName || !reviewRating || !reviewText) {
            return res.status(400).json({ 
                success: false, 
                message: 'Name, rating, and review text are required' 
            });
        }
        
        // Validate rating
        const rating = parseInt(reviewRating);
        if (rating < 1 || rating > 5) {
            return res.status(400).json({ 
                success: false, 
                message: 'Rating must be between 1 and 5 stars' 
            });
        }
        
        // Email validation if provided
        if (reviewerEmail) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(reviewerEmail)) {
                return res.status(400).json({ 
                    success: false, 
                    message: 'Please provide a valid email address' 
                });
            }
        }
        
        // Create star display
        const stars = '★'.repeat(rating) + '☆'.repeat(5 - rating);
        
        // Prepare email content for notification
        const mailOptions = {
            from: process.env.EMAIL_USER || 'devaanshkushwaha06@gmail.com',
            to: 'devkush2006@outlook.com',
            subject: `New Review Submitted - ${rating} Stars`,
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h2 style="color: #ffd700; border-bottom: 2px solid #ffd700; padding-bottom: 10px;">
                        🌟 New Review Received!
                    </h2>
                    
                    <div style="background-color: #f8f9fa; padding: 20px; border-radius: 10px; margin: 20px 0;">
                        <h3 style="color: #2d3436; margin-bottom: 15px;">Reviewer Details:</h3>
                        <p><strong>Name:</strong> ${reviewerName}</p>
                        <p><strong>Position:</strong> ${reviewerPosition || 'Not specified'}</p>
                        <p><strong>Email:</strong> ${reviewerEmail || 'Not provided'}</p>
                        <p><strong>Rating:</strong> <span style="color: #ffd700; font-size: 1.2em;">${stars}</span> (${rating}/5)</p>
                    </div>
                    
                    <div style="background-color: #fff; padding: 20px; border-left: 4px solid #ffd700; margin: 20px 0;">
                        <h3 style="color: #2d3436; margin-bottom: 15px;">Review:</h3>
                        <p style="line-height: 1.6; color: #636e72; font-style: italic;">"${reviewText}"</p>
                    </div>
                    
                    <div style="text-align: center; margin-top: 30px; padding: 20px; background-color: #f1f3f4; border-radius: 10px;">
                        <p style="color: #636e72; margin: 0;">
                            This review was submitted through your portfolio website.
                        </p>
                        <p style="color: #636e72; margin: 5px 0 0 0; font-size: 0.9em;">
                            Timestamp: ${new Date().toLocaleString()}
                        </p>
                        <p style="color: #28a745; margin: 10px 0 0 0; font-weight: bold;">
                            Review will appear on your website after approval.
                        </p>
                    </div>
                </div>
            `,
            replyTo: reviewerEmail || process.env.EMAIL_USER
        };
        
        // Send notification email
        await transporter.sendMail(mailOptions);
        
        // Store review data (in a real app, you'd save to database)
        const reviewData = {
            id: Date.now(),
            name: reviewerName,
            position: reviewerPosition || '',
            rating: rating,
            text: reviewText,
            email: reviewerEmail || '',
            timestamp: new Date().toISOString(),
            approved: false // Reviews need approval before appearing
        };
        
        console.log('New review submitted:', reviewData);
        
        res.json({ 
            success: true, 
            message: 'Thank you for your review! It will appear on the website after approval.',
            review: {
                name: reviewerName,
                position: reviewerPosition || '',
                rating: rating,
                text: reviewText
            }
        });
        
    } catch (error) {
        console.error('Error processing review:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Failed to submit review. Please try again later.' 
        });
    }
});

// Serve the main HTML file for all non-API routes
app.get('*', (req, res) => {
    // Don't serve index.html for API routes or static files
    if (req.path.startsWith('/api/') || req.path.includes('.')) {
        return res.status(404).json({ error: 'Not found' });
    }
    res.sendFile(path.join(staticPath, 'index.html'));
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ 
        success: false, 
        message: 'Something went wrong!' 
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`🚀 Server is running on port ${PORT}`);
    console.log(`📱 Frontend: http://localhost:${PORT}`);
    console.log(`🔧 API Health: http://localhost:${PORT}/api/health`);
    console.log(`📧 Contact endpoint: http://localhost:${PORT}/api/contact`);
    console.log(`⭐ Reviews endpoint: http://localhost:${PORT}/api/reviews`);
    console.log(`📁 Static files: ${staticPath}`);
});

module.exports = app;