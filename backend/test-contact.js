// Test file for contact form functionality
// Run this with: node backend/test-contact.js

const nodemailer = require('nodemailer');
require('dotenv').config();

async function testEmailSetup() {
    console.log('🧪 Testing email configuration...\n');
    
    // Test email configuration
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER || 'devaanshkushwaha06@gmail.com',
            pass: process.env.EMAIL_PASS || 'your-app-password-here'
        }
    });
    
    try {
        // Verify connection
        await transporter.verify();
        console.log('✅ Email transporter configuration is valid');
        
        // Test email
        const testMailOptions = {
            from: process.env.EMAIL_USER || 'devaanshkushwaha06@gmail.com',
            to: 'devaanshkushwaha06@gmail.com',
            subject: 'Portfolio Website - Email Test',
            html: `
                <h2>Email Test Successful!</h2>
                <p>Your portfolio website email functionality is working correctly.</p>
                <p><strong>Test performed at:</strong> ${new Date().toLocaleString()}</p>
                <p>You can now receive contact form submissions.</p>
            `
        };
        
        console.log('📧 Sending test email...');
        await transporter.sendMail(testMailOptions);
        console.log('✅ Test email sent successfully!');
        console.log('📬 Check your inbox for the test email.');
        
    } catch (error) {
        console.error('❌ Email test failed:');
        console.error('Error:', error.message);
        console.log('\n🔧 Troubleshooting steps:');
        console.log('1. Make sure you have created an App Password in your Google account');
        console.log('2. Update the EMAIL_PASS in your .env file');
        console.log('3. Ensure 2-factor authentication is enabled on your Gmail account');
        console.log('4. Check that the EMAIL_USER is correct in your .env file');
    }
}

// Run the test
testEmailSetup();