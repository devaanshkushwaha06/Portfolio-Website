const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const nodemailer = require('nodemailer');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 4000;

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
    origin: [
        'http://localhost:3000', 
        'http://localhost:4000',
        'http://127.0.0.1:3000',
        'http://127.0.0.1:4000',
        'file://',
        'https://devaansh-kushwaha-portfolio-website.vercel.app',
        'https://*.vercel.app'
    ],
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
app.use(express.static(path.join(__dirname, '../frontend')));

// Configure nodemailer
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER || 'devaanshkushwaha06@gmail.com',
        pass: process.env.EMAIL_PASS || 'your-app-password-here' // Use app password for Gmail
    }
});

// Portfolio data
const portfolioData = {
    projects: [
        {
            id: 'acm-intro',
            title: 'UPES ACM Intro',
            category: 'motion-graphics',
            description: 'Dynamic motion graphics intro for UPES ACM showcasing modern design principles and smooth animations.',
            thumbnail: '/assets/images/acm-intro-thumb.jpg',
            videoUrl: '/assets/videos/acm-intro.mp4',
            technologies: ['After Effects', 'Illustrator'],
            year: 2024
        },
        {
            id: 'compositing',
            title: 'Digital Compositing Showcase',
            category: 'compositing',
            description: 'Advanced compositing techniques blending live-action footage with digital elements seamlessly.',
            thumbnail: '/assets/images/compositing-thumb.jpg',
            videoUrl: '/assets/videos/compositing-work.mp4',
            technologies: ['Nuke', 'After Effects', 'Photoshop'],
            year: 2023
        },
        {
            id: 'adventure-quest',
            title: '3D Adventure Quest',
            category: '3d-animation',
            description: 'An immersive 3D animated adventure showcasing character animation, environmental design, and storytelling through visual effects.',
            thumbnail: '/assets/images/adventure-quest-thumb.jpg',
            videoUrl: '/assets/videos/adventure-quest.mp4',
            technologies: ['Blender', 'After Effects', 'Substance Painter'],
            year: 2024
        }
    ],
    skills: {
        vfx: [
            { name: 'After Effects', level: 90 },
            { name: 'Premiere Pro', level: 85 },
            { name: 'Blender', level: 80 },
            { name: 'DaVinci Resolve', level: 75 }
        ],
        programming: [
            { name: 'Python', level: 85 },
            { name: 'JavaScript', level: 80 },
            { name: 'HTML/CSS', level: 90 },
            { name: 'Node.js', level: 75 }
        ],
        design: [
            { name: 'Motion Graphics', level: 95 },
            { name: 'Adobe Photoshop', level: 90 },
            { name: 'Adobe Illustrator', level: 80 },
            { name: 'Color Grading', level: 85 }
        ]
    }
};

// In-memory storage for reviews (in production, use a database)
let reviewsStorage = [];

// Simple admin authentication (in production, use proper auth)
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123';

// API Routes

// Get portfolio projects
app.get('/api/portfolio', (req, res) => {
    const { category } = req.query;
    let projects = portfolioData.projects;
    
    if (category && category !== 'all') {
        projects = projects.filter(project => project.category === category);
    }
    
    res.json({ success: true, projects });
});

// Get specific project
app.get('/api/portfolio/:id', (req, res) => {
    const { id } = req.params;
    const project = portfolioData.projects.find(p => p.id === id);
    
    if (!project) {
        return res.status(404).json({ success: false, message: 'Project not found' });
    }
    
    res.json({ success: true, project });
});

// Get skills data
app.get('/api/skills', (req, res) => {
    res.json({ success: true, skills: portfolioData.skills });
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
        
        // Send email (but don't fail if email fails)
        try {
            await transporter.sendMail(mailOptions);
            console.log('Contact email sent successfully');
        } catch (emailError) {
            console.error('Email sending failed (continuing anyway):', emailError.message);
            // Don't fail the entire request if email fails
        }
        
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
        
        // Send notification email (but don't fail if email fails)
        try {
            await transporter.sendMail(mailOptions);
            console.log('Email notification sent successfully');
        } catch (emailError) {
            console.error('Email sending failed (continuing anyway):', emailError.message);
            // Don't fail the entire request if email fails
        }
        
        // Store review data in memory
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
        
        // Add to storage
        reviewsStorage.push(reviewData);
        
        console.log('New review submitted:', reviewData);
        console.log('Total reviews in storage:', reviewsStorage.length);
        
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

// Health check endpoint
app.get('/api/health', (req, res) => {
    console.log('🔍 Health check requested');
    res.json({ 
        success: true, 
        message: 'Server is running',
        timestamp: new Date().toISOString()
    });
});

// About endpoint
app.get('/api/about', (req, res) => {
    const aboutData = {
        name: 'Devaansh Kushwaha',
        title: 'VFX Artist & Creative Developer',
        education: {
            degree: 'Bachelor of Technology (B.Tech)',
            university: 'University of Petroleum and Energy Studies (UPES)',
            location: 'Dehradun, Uttarakhand, India',
            status: 'Current Student'
        },
        position: {
            title: 'VFX Head',
            organization: 'UPES ACM (Association for Computing Machinery)',
            description: 'Leading VFX projects and mentoring fellow students in visual effects and creative technologies.'
        },
        contact: {
            email: ['devaanshkushwaha06@gmail.com', 'Devkush2006@outlook.com'],
            phone: '+91 6265954576',
            location: 'UPES Dehradun, Uttarakhand, India'
        },
        social: {
            linkedin: 'https://www.linkedin.com/in/devaansh-kushwaha-316340338',
            github: 'https://github.com/devaanshkushwaha06',
            instagram: 'https://www.instagram.com/devaanshkushwaha06/'
        },
        stats: {
            projects: '50+',
            experience: '3+',
            clients: '100+'
        },
        bio: [
            "I'm Devaansh Kushwaha, currently pursuing my B.Tech degree at UPES Dehradun. As the VFX Head at UPES ACM, I lead creative projects and push the boundaries of visual storytelling through cutting-edge technology.",
            "My passion lies in creating immersive visual experiences that captivate audiences and bring ideas to life. I combine technical expertise with artistic vision to deliver exceptional VFX work."
        ]
    };
    
    res.json({ success: true, about: aboutData });
});

// Admin Authentication Middleware
function authenticateAdmin(req, res, next) {
    const { password } = req.body;
    if (password !== ADMIN_PASSWORD) {
        return res.status(401).json({ 
            success: false, 
            message: 'Invalid admin password' 
        });
    }
    next();
}

// Admin Routes

// Get all reviews (admin only)
app.post('/api/admin/reviews', authenticateAdmin, (req, res) => {
    console.log('🔐 Admin accessing reviews');
    res.json({ 
        success: true, 
        reviews: reviewsStorage.map(review => ({
            ...review,
            // Don't expose email in list view for privacy
            email: review.email ? '***@***.***' : ''
        }))
    });
});

// Get single review with full details (admin only)
app.post('/api/admin/reviews/:id', authenticateAdmin, (req, res) => {
    const { id } = req.params;
    const review = reviewsStorage.find(r => r.id === parseInt(id));
    
    if (!review) {
        return res.status(404).json({ 
            success: false, 
            message: 'Review not found' 
        });
    }
    
    console.log('🔐 Admin viewing review:', id);
    res.json({ success: true, review });
});

// Delete review (admin only)
app.delete('/api/admin/reviews/:id', (req, res) => {
    const { password } = req.body;
    if (password !== ADMIN_PASSWORD) {
        return res.status(401).json({ 
            success: false, 
            message: 'Invalid admin password' 
        });
    }
    
    const { id } = req.params;
    const reviewIndex = reviewsStorage.findIndex(r => r.id === parseInt(id));
    
    if (reviewIndex === -1) {
        return res.status(404).json({ 
            success: false, 
            message: 'Review not found' 
        });
    }
    
    const deletedReview = reviewsStorage.splice(reviewIndex, 1)[0];
    console.log('🗑️ Admin deleted review:', deletedReview.id, 'by', deletedReview.name);
    
    res.json({ 
        success: true, 
        message: 'Review deleted successfully',
        deletedReview: {
            id: deletedReview.id,
            name: deletedReview.name,
            timestamp: deletedReview.timestamp
        }
    });
});

// Approve/Unapprove review (admin only)
app.put('/api/admin/reviews/:id/approve', (req, res) => {
    const { password, approved } = req.body;
    if (password !== ADMIN_PASSWORD) {
        return res.status(401).json({ 
            success: false, 
            message: 'Invalid admin password' 
        });
    }
    
    const { id } = req.params;
    const review = reviewsStorage.find(r => r.id === parseInt(id));
    
    if (!review) {
        return res.status(404).json({ 
            success: false, 
            message: 'Review not found' 
        });
    }
    
    review.approved = approved === true || approved === 'true';
    console.log('✅ Admin', review.approved ? 'approved' : 'unapproved', 'review:', review.id);
    
    res.json({ 
        success: true, 
        message: `Review ${review.approved ? 'approved' : 'unapproved'} successfully`,
        review: {
            id: review.id,
            name: review.name,
            approved: review.approved
        }
    });
});

// Get approved reviews for public display
app.get('/api/reviews/approved', (req, res) => {
    const approvedReviews = reviewsStorage.filter(review => review.approved);
    res.json({ 
        success: true, 
        reviews: approvedReviews.map(review => ({
            id: review.id,
            name: review.name,
            position: review.position,
            rating: review.rating,
            text: review.text,
            timestamp: review.timestamp
            // Email is not included in public display
        }))
    });
});

// Serve the admin page
app.get('/admin', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/admin.html'));
});

// Serve the main HTML file for all non-API routes
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/index.html'));
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
});

module.exports = app;