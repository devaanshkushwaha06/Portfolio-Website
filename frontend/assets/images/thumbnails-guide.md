# Thumbnail Images Guide

## Current Status:
The video modal now supports thumbnail images that appear before the video plays.

## Required Thumbnail Files:

1. **adventure-quest-thumb.jpg** - Thumbnail for your 3D Adventure Quest video
2. **acm-intro-thumb.jpg** - Thumbnail for UPES ACM intro
3. **compositing-thumb.jpg** - Thumbnail for compositing work

## How to Create Thumbnails:

### Option 1: Extract from Video
1. Open your video in any video player (VLC, Windows Media Player)
2. Pause at a good frame (around 2-3 seconds in)
3. Take a screenshot or use "Take Snapshot" feature
4. Resize to 400x250 pixels
5. Save as JPG

### Option 2: Create Custom Thumbnail
1. Use any image editor (Photoshop, GIMP, Canva)
2. Create 400x250px image
3. Add video title text overlay
4. Use colors matching your website theme
5. Save as JPG

## File Naming:
- Use exact names: `adventure-quest-thumb.jpg`
- Place in: `frontend/assets/images/`
- Format: JPG (recommended for photos)

## Current Fallback:
If thumbnail files don't exist, the video will show a black screen until played.

## To Add Your Thumbnails:
1. Create/extract thumbnail images
2. Save them in the images folder with correct names
3. Refresh your website
4. Thumbnails will automatically appear in video modals