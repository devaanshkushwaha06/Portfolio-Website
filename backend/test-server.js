const express = require('express');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = 3000;

// Basic middleware
app.use(cors());
app.use(express.json());

// Request logging
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
    console.log('Static path:', path.join(__dirname, '../frontend'));
    next();
});

// Serve static files from frontend directory
const staticPath = path.join(__dirname, '../frontend');
console.log('Serving static files from:', staticPath);
app.use(express.static(staticPath));

// Test route
app.get('/test', (req, res) => {
    res.json({ message: 'Server is working!', timestamp: new Date() });
});

// Health check
app.get('/api/health', (req, res) => {
    console.log('🔍 Health check requested');
    res.json({ 
        success: true, 
        message: 'Server is running',
        timestamp: new Date().toISOString(),
        staticPath: staticPath
    });
});

// Catch all route for debugging
app.get('*', (req, res) => {
    console.log('Catch-all route hit for:', req.path);
    console.log('File requested:', path.join(staticPath, req.path));
    res.status(404).json({ 
        error: 'File not found', 
        path: req.path,
        staticPath: staticPath,
        fullPath: path.join(staticPath, req.path)
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`🚀 Test Server running on port ${PORT}`);
    console.log(`📱 Frontend: http://localhost:${PORT}`);
    console.log(`🔧 Test endpoint: http://localhost:${PORT}/test`);
    console.log(`📁 Static path: ${staticPath}`);
});