# VFX Videos Directory

This directory should contain your VFX video files. The website is currently configured to look for the following videos:

## Expected Video Files:

1. **demo-reel.mp4** - Your main VFX demo reel
2. **acm-intro.mp4** - UPES ACM introduction video
3. **compositing-work.mp4** - Compositing showcase
4. **3d-character.mp4** - 3D character animation work

## Supported Formats:
- MP4 (recommended)
- WebM
- MOV

## Recommendations:
- Keep file sizes under 50MB for web optimization
- Use H.264 codec for MP4 files
- Resolution: 1920x1080 or lower for web
- Consider creating thumbnail images (JPG format) in the images folder

## Adding New Videos:
1. Place your video files in this directory
2. Update the portfolio data in `backend/server.js`
3. Add corresponding thumbnail images in `frontend/assets/images/`

## Note:
The website will automatically display placeholder content if video files are not found. Add your actual VFX work to showcase your portfolio properly.