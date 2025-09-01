const express = require('express');
const ytdl = require('youtube-dl-exec');
const multer = require('multer');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const ffmpeg = require('fluent-ffmpeg');
const helmet = require('helmet');
const compression = require('compression');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Enhanced middleware
app.use(helmet());
app.use(compression());
app.use(cors({
  origin: process.env.FRONTEND_URL || ['http://localhost:3000', 'https://rajjak2004.github.io'],
  credentials: true
}));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Serve static files
app.use('/downloads', express.static('downloads'));
app.use('/temp', express.static('temp'));

// Ensure directories exist
const dirs = ['uploads', 'downloads', 'temp', 'processed'];
dirs.forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

// Enhanced file upload configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}-${file.originalname}`;
    cb(null, uniqueName);
  }
});

const upload = multer({
  storage,
  limits: {
    fileSize: 2 * 1024 * 1024 * 1024, // 2GB
    fieldSize: 10 * 1024 * 1024 // 10MB for form fields
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['video/mp4', 'video/avi', 'video/mov', 'video/mkv', 'video/webm'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only video files are allowed.'));
    }
  }
});

// Enhanced error handling middleware
const errorHandler = (error, req, res, next) => {
  console.error('❌ Server Error:', error);
  
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ error: 'File too large. Maximum size is 2GB.' });
    }
  }
  
  res.status(500).json({
    error: 'Internal server error',
    message: error.message,
    timestamp: new Date().toISOString()
  });
};

// Rate limiting (simple implementation)
const rateLimitMap = new Map();

const rateLimit = (req, res, next) => {
  const ip = req.ip || req.connection.remoteAddress;
  const now = Date.now();
  const windowMs = 15 * 60 * 1000; // 15 minutes
  const maxRequests = 10;
  
  if (!rateLimitMap.has(ip)) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + windowMs });
    return next();
  }
  
  const userData = rateLimitMap.get(ip);
  
  if (now > userData.resetTime) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + windowMs });
    return next();
  }
  
  if (userData.count >= maxRequests) {
    return res.status(429).json({
      error: 'Too many requests',
      message: 'Please try again later',
      resetTime: new Date(userData.resetTime).toISOString()
    });
  }
  
  userData.count++;
  next();
};

app.use('/api', rateLimit);

// Health check endpoint
app.get('/api/health', (req, res) => {
  const healthData = {
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    services: {
      ytdl: 'available',
      ffmpeg: 'available',
      storage: checkStorageSpace()
    },
    stats: {
      videosProcessed: getProcessedCount(),
      diskSpace: getDiskSpace()
    }
  };
  
  res.json(healthData);
});

// Get video info without downloading
app.post('/api/video-info', async (req, res) => {
  try {
    const { url } = req.body;
    
    if (!url) {
      return res.status(400).json({ error: 'URL is required' });
    }
    
    console.log('📋 Getting video info for:', url);
    
    const info = await ytdl(url, {
      dumpSingleJson: true,
      noCheckCertificates: true,
      ignoreErrors: true
    });
    
    res.json({
      success: true,
      info: {
        title: info.title,
        duration: info.duration,
        thumbnail: info.thumbnail,
        description: info.description?.substring(0, 500) + '...',
        uploader: info.uploader,
        viewCount: info.view_count,
        uploadDate: info.upload_date,
        formats: info.formats?.length || 0,
        resolution: info.resolution,
        filesize: info.filesize
      }
    });
    
  } catch (error) {
    console.error('❌ Video info error:', error);
    res.status(500).json({
      error: 'Failed to get video information',
      details: error.message
    });
  }
});

// Enhanced video download endpoint
app.post('/api/download-video', async (req, res) => {
  try {
    const { url, quality = 'best[height<=1080]' } = req.body;
    
    if (!url) {
      return res.status(400).json({ error: 'URL is required' });
    }
    
    console.log('📥 Downloading video from:', url);
    
    // Validate URL first
    const urlPattern = /(youtube\.com|youtu\.be|tiktok\.com|instagram\.com|facebook\.com|vimeo\.com)/i;
    if (!urlPattern.test(url)) {
      return res.status(400).json({ error: 'Unsupported URL. Please use YouTube, TikTok, Instagram, Facebook, or Vimeo URLs.' });
    }
    
    // Get video info first
    const info = await ytdl(url, {
      dumpSingleJson: true,
      noCheckCertificates: true,
      extractFlat: false
    });
    
    // Clean filename
    const cleanTitle = info.title
      .replace(/[^a-zA-Z0-9\s-_]/g, '')
      .substring(0, 100)
      .trim();
    
    const outputPath = `downloads/${Date.now()}_${cleanTitle}.mp4`;
    
    // Download video with progress tracking
    console.log('🔄 Starting download...');
    
    const downloadProcess = ytdl(url, {
      output: outputPath,
      format: quality,
      extractAudio: false,
      noCheckCertificates: true,
      retries: 3
    });
    
    // Wait for download to complete
    await downloadProcess;
    
    // Verify file exists and has content
    if (!fs.existsSync(outputPath)) {
      throw new Error('Download failed - file not created');
    }
    
    const stats = fs.statSync(outputPath);
    if (stats.size === 0) {
      fs.unlinkSync(outputPath);
      throw new Error('Download failed - empty file');
    }
    
    console.log('✅ Download complete:', outputPath, `(${formatBytes(stats.size)})`);
    
    res.json({
      success: true,
      videoPath: `/${outputPath}`,
      fileSize: stats.size,
      metadata: {
        title: info.title,
        duration: info.duration,
        thumbnail: info.thumbnail,
        description: info.description?.substring(0, 200),
        uploader: info.uploader,
        viewCount: info.view_count,
        originalUrl: url
      }
    });
    
  } catch (error) {
    console.error('❌ Download error:', error);
    res.status(500).json({
      error: 'Download failed',
      details: error.message,
      suggestions: [
        'Check if the URL is accessible',
        'Try a different video quality',
        'Ensure the video is not private or restricted'
      ]
    });
  }
});

// Enhanced video processing endpoint
app.post('/api/process-video', upload.single('video'), async (req, res) => {
  let inputPath = null;
  let outputPath = null;
  
  try {
    const {
      startTime = 0,
      endTime = 30,
      addSubtitles = false,
      subtitleText = '',
      preset = 'tiktok',
      enhanceAudio = false,
      addEffects = false
    } = req.body;
    
    if (!req.file) {
      return res.status(400).json({ error: 'No video file provided' });
    }
    
    inputPath = req.file.path;
    outputPath = `processed/processed_${Date.now()}_${preset}.mp4`;
    
    console.log('🎬 Processing video:', inputPath);
    console.log('⚙️ Settings:', { startTime, endTime, preset, addSubtitles });
    
    // Validate time range
    if (startTime >= endTime) {
      return res.status(400).json({ error: 'Invalid time range: startTime must be less than endTime' });
    }
    
    if (endTime - startTime > 300) {
      return res.status(400).json({ error: 'Clip duration cannot exceed 5 minutes' });
    }
    
    // Create FFmpeg command
    let command = ffmpeg(inputPath)
      .seekInput(parseFloat(startTime))
      .duration(parseFloat(endTime) - parseFloat(startTime))
      .videoCodec('libx264')
      .audioCodec('aac')
      .format('mp4');
    
    // Apply preset settings
    const presetSettings = getPresetSettings(preset);
    if (presetSettings.videoFilters.length > 0) {
      command = command.videoFilters(presetSettings.videoFilters);
    }
    
    // Add audio enhancements
    if (enhanceAudio) {
      command = command.audioFilters([
        'highpass=f=200',
        'lowpass=f=3000',
        'dynaudnorm'
      ]);
    }
    
    // Add subtitles if requested
    if (addSubtitles && subtitleText) {
      const srtPath = `temp/subtitles_${Date.now()}.srt`;
      fs.writeFileSync(srtPath, subtitleText);
      
      command = command.videoFilters([
        `subtitles=${srtPath}:force_style='FontSize=24,PrimaryColour=&Hffffff,OutlineColour=&H000000,BorderStyle=3,Outline=2,Shadow=1,MarginV=30'`
      ]);
      
      // Clean up subtitle file after processing
      setTimeout(() => {
        if (fs.existsSync(srtPath)) {
          fs.unlinkSync(srtPath);
        }
      }, 60000);
    }
    
    // Execute processing
    command
      .output(outputPath)
      .on('start', (commandLine) => {
        console.log('🚀 FFmpeg started:', commandLine);
      })
      .on('progress', (progress) => {
        console.log(`⏳ Processing: ${progress.percent?.toFixed(1) || 0}%`);
      })
      .on('end', () => {
        console.log('✅ Processing completed:', outputPath);
        
        // Clean up input file
        if (fs.existsSync(inputPath)) {
          fs.unlinkSync(inputPath);
        }
        
        // Get output file stats
        const stats = fs.statSync(outputPath);
        
        res.json({
          success: true,
          processedVideoPath: `/${outputPath}`,
          fileSize: stats.size,
          processingTime: Date.now() - req.startTime,
          settings: {
            startTime: parseFloat(startTime),
            endTime: parseFloat(endTime),
            duration: parseFloat(endTime) - parseFloat(startTime),
            preset,
            addSubtitles,
            enhanceAudio
          }
        });
      })
      .on('error', (err) => {
        console.error('❌ FFmpeg error:', err);
        
        // Clean up files
        if (inputPath && fs.existsSync(inputPath)) {
          fs.unlinkSync(inputPath);
        }
        if (outputPath && fs.existsSync(outputPath)) {
          fs.unlinkSync(outputPath);
        }
        
        res.status(500).json({
          error: 'Video processing failed',
          details: err.message,
          suggestions: [
            'Check if the video file is corrupted',
            'Try different time ranges',
            'Reduce video quality settings'
          ]
        });
      })
      .run();
    
  } catch (error) {
    console.error('❌ Processing setup error:', error);
    
    // Clean up files
    if (inputPath && fs.existsSync(inputPath)) {
      fs.unlinkSync(inputPath);
    }
    
    res.status(500).json({
      error: 'Processing setup failed',
      details: error.message
    });
  }
});

// Batch processing endpoint
app.post('/api/batch-process', upload.array('videos', 10), async (req, res) => {
  try {
    const { clips } = req.body; // Array of clip definitions
    
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: 'No video files provided' });
    }
    
    console.log('🎬 Batch processing', req.files.length, 'videos');
    
    const results = [];
    
    for (let i = 0; i < req.files.length; i++) {
      const file = req.files[i];
      const clipData = JSON.parse(clips[i]);
      
      try {
        // Process each video
        const result = await processVideoFile(file.path, clipData);
        results.push({ success: true, file: file.originalname, ...result });
        
        // Clean up input file
        fs.unlinkSync(file.path);
        
      } catch (error) {
        console.error(`❌ Failed to process ${file.originalname}:`, error);
        results.push({ success: false, file: file.originalname, error: error.message });
        
        // Clean up input file
        if (fs.existsSync(file.path)) {
          fs.unlinkSync(file.path);
        }
      }
    }
    
    res.json({
      success: true,
      processed: results.filter(r => r.success).length,
      failed: results.filter(r => !r.success).length,
      results
    });
    
  } catch (error) {
    console.error('❌ Batch processing error:', error);
    res.status(500).json({ error: 'Batch processing failed', details: error.message });
  }
});

// File cleanup endpoint
app.delete('/api/cleanup', (req, res) => {
  try {
    const directories = ['uploads', 'downloads', 'processed', 'temp'];
    let filesDeleted = 0;
    
    directories.forEach(dir => {
      if (fs.existsSync(dir)) {
        const files = fs.readdirSync(dir);
        const cutoff = Date.now() - (24 * 60 * 60 * 1000); // 24 hours ago
        
        files.forEach(file => {
          const filePath = path.join(dir, file);
          const stats = fs.statSync(filePath);
          
          if (stats.mtime.getTime() < cutoff) {
            fs.unlinkSync(filePath);
            filesDeleted++;
          }
        });
      }
    });
    
    res.json({
      success: true,
      message: `Cleaned up ${filesDeleted} old files`,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('❌ Cleanup error:', error);
    res.status(500).json({ error: 'Cleanup failed', details: error.message });
  }
});

// Utility functions
function getPresetSettings(preset) {
  const presets = {
    tiktok: {
      videoFilters: [
        'scale=1080:1920:force_original_aspect_ratio=increase',
        'crop=1080:1920'
      ],
      audioFilters: ['volume=1.2']
    },
    youtube: {
      videoFilters: [
        'scale=1080:1920:force_original_aspect_ratio=increase',
        'crop=1080:1920'
      ],
      audioFilters: ['volume=1.0']
    },
    instagram: {
      videoFilters: [
        'scale=1080:1920:force_original_aspect_ratio=increase',
        'crop=1080:1920',
        'eq=brightness=0.05:contrast=1.1:saturation=1.2'
      ],
      audioFilters: ['volume=1.1']
    }
  };
  
  return presets[preset] || presets.tiktok;
}

function formatBytes(bytes) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

function checkStorageSpace() {
  try {
    const stats = fs.statSync('.');
    return 'available';
  } catch {
    return 'unavailable';
  }
}

function getProcessedCount() {
  try {
    const files = fs.readdirSync('processed');
    return files.length;
  } catch {
    return 0;
  }
}

function getDiskSpace() {
  try {
    const stats = fs.statSync('.');
    return 'checking...';
  } catch {
    return 'unknown';
  }
}

async function processVideoFile(inputPath, options) {
  return new Promise((resolve, reject) => {
    const outputPath = `processed/batch_${Date.now()}.mp4`;
    
    ffmpeg(inputPath)
      .seekInput(options.startTime || 0)
      .duration(options.duration || 30)
      .videoCodec('libx264')
      .audioCodec('aac')
      .output(outputPath)
      .on('end', () => {
        resolve({ processedVideoPath: `/${outputPath}` });
      })
      .on('error', reject)
      .run();
  });
}

// Global error handler
app.use(errorHandler);

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Endpoint not found',
    message: `Cannot ${req.method} ${req.originalUrl}`,
    availableEndpoints: [
      'GET /api/health',
      'POST /api/video-info',
      'POST /api/download-video',
      'POST /api/process-video',
      'POST /api/batch-process',
      'DELETE /api/cleanup'
    ]
  });
});

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\n🔄 Graceful shutdown initiated...');
  
  // Clean up temporary files
  const tempDirs = ['uploads', 'temp'];
  tempDirs.forEach(dir => {
    if (fs.existsSync(dir)) {
      const files = fs.readdirSync(dir);
      files.forEach(file => {
        fs.unlinkSync(path.join(dir, file));
      });
    }
  });
  
  console.log('✅ Cleanup completed');
  process.exit(0);
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 ViralClips Backend running on port ${PORT}`);
  console.log(`📁 Storage directories created`);
  console.log(`🔧 FFmpeg and yt-dlp ready`);
  console.log(`⚡ Server ready for production!`);
});
