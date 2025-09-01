// Video utility functions for ViralClips AI

export const formatDuration = (seconds) => {
  if (!seconds || isNaN(seconds)) return '0:00';
  
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);
  
  if (hrs > 0) {
    return `${hrs}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

export const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  if (!bytes || isNaN(bytes)) return 'Unknown size';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

export const validateVideoFile = (file) => {
  const validTypes = [
    'video/mp4', 'video/avi', 'video/mov', 'video/mkv', 
    'video/webm', 'video/wmv', 'video/flv', 'video/m4v'
  ];
  const maxSize = 2 * 1024 * 1024 * 1024; // 2GB
  const minSize = 1024; // 1KB minimum

  // Check if file exists
  if (!file) {
    return {
      valid: false,
      error: 'No file provided'
    };
  }

  // Check file type
  if (!validTypes.includes(file.type.toLowerCase())) {
    return {
      valid: false,
      error: `Invalid file type: ${file.type}. Please upload MP4, MOV, AVI, MKV, WebM, WMV, FLV, or M4V files.`
    };
  }

  // Check file size
  if (file.size < minSize) {
    return {
      valid: false,
      error: 'File is too small. Please upload a valid video file.'
    };
  }

  if (file.size > maxSize) {
    return {
      valid: false,
      error: `File size (${formatFileSize(file.size)}) exceeds the maximum limit of 2GB.`
    };
  }

  return { valid: true };
};

export const extractVideoUrl = (url) => {
  if (!url || typeof url !== 'string') return null;
  
  url = url.trim();
  
  // YouTube URL patterns
  const youtubeRegex = /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
  const youtubeMatch = url.match(youtubeRegex);
  
  if (youtubeMatch) {
    return {
      platform: 'youtube',
      id: youtubeMatch[1],
      url: `https://www.youtube.com/watch?v=${youtubeMatch[1]}`,
      embedUrl: `https://www.youtube.com/embed/${youtubeMatch[1]}`
    };
  }

  // Vimeo URL patterns
  const vimeoRegex = /(?:https?:\/\/)?(?:www\.)?vimeo\.com\/(?:channels\/(?:\w+\/)?|groups\/([^\/]*)\/videos\/|album\/(\d+)\/video\/|video\/|)(\d+)(?:$|\/|\?)/;
  const vimeoMatch = url.match(vimeoRegex);
  
  if (vimeoMatch) {
    return {
      platform: 'vimeo',
      id: vimeoMatch[3],
      url: `https://vimeo.com/${vimeoMatch[3]}`,
      embedUrl: `https://player.vimeo.com/video/${vimeoMatch[3]}`
    };
  }

  // TikTok URL patterns
  const tiktokRegex = /(?:https?:\/\/)?(?:www\.)?tiktok\.com\/@([^\/]+)\/video\/(\d+)/;
  const tiktokMatch = url.match(tiktokRegex);
  
  if (tiktokMatch) {
    return {
      platform: 'tiktok',
      username: tiktokMatch[1],
      id: tiktokMatch[2],
      url: url
    };
  }

  // Instagram URL patterns
  const instagramRegex = /(?:https?:\/\/)?(?:www\.)?instagram\.com\/(?:p|reel)\/([a-zA-Z0-9_-]+)/;
  const instagramMatch = url.match(instagramRegex);
  
  if (instagramMatch) {
    return {
      platform: 'instagram',
      id: instagramMatch[1],
      url: url
    };
  }

  // Direct video URL patterns
  const videoUrlRegex = /^https?:\/\/.*\.(mp4|avi|mov|mkv|webm|wmv|flv|m4v)(\?.*)?$/i;
  if (videoUrlRegex.test(url)) {
    return {
      platform: 'direct',
      url: url,
      type: 'direct'
    };
  }

  // Generic URL
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return {
      platform: 'unknown',
      url: url,
      type: 'generic'
    };
  }

  return null;
};

export const validateVideoUrl = (url) => {
  if (!url || typeof url !== 'string') {
    return {
      valid: false,
      error: 'Please enter a valid URL'
    };
  }

  const extracted = extractVideoUrl(url);
  
  if (!extracted) {
    return {
      valid: false,
      error: 'Invalid video URL. Please enter a YouTube, Vimeo, TikTok, Instagram, or direct video URL.'
    };
  }

  const supportedPlatforms = ['youtube', 'vimeo', 'direct'];
  if (!supportedPlatforms.includes(extracted.platform)) {
    return {
      valid: false,
      error: `${extracted.platform} URLs are not yet supported. Please use YouTube, Vimeo, or direct video URLs.`
    };
  }

  return { 
    valid: true, 
    platform: extracted.platform,
    extractedData: extracted
  };
};

export const getVideoMetadata = async (file) => {
  return new Promise((resolve, reject) => {
    const video = document.createElement('video');
    
    video.onloadedmetadata = () => {
      try {
        const metadata = {
          duration: video.duration,
          width: video.videoWidth,
          height: video.videoHeight,
          aspectRatio: video.videoWidth / video.videoHeight,
          size: file.size,
          type: file.type,
          name: file.name,
          lastModified: new Date(file.lastModified),
          // Additional calculations
          formattedDuration: formatDuration(video.duration),
          formattedSize: formatFileSize(file.size),
          resolution: `${video.videoWidth}x${video.videoHeight}`,
          isVertical: video.videoHeight > video.videoWidth,
          isHorizontal: video.videoWidth > video.videoHeight,
          isSquare: Math.abs(video.videoWidth - video.videoHeight) < 10
        };
        
        // Clean up
        URL.revokeObjectURL(video.src);
        resolve(metadata);
      } catch (error) {
        reject(error);
      }
    };

    video.onerror = () => {
      reject(new Error('Failed to load video metadata'));
    };

    // Set video source
    if (file instanceof File) {
      video.src = URL.createObjectURL(file);
    } else if (typeof file === 'string') {
      video.src = file;
    } else {
      reject(new Error('Invalid video source'));
    }
  });
};

export const generateVideoThumbnail = (videoFile, timeInSeconds = 1) => {
  return new Promise((resolve, reject) => {
    const video = document.createElement('video');
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    video.onloadedmetadata = () => {
      // Set canvas dimensions
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      // Seek to specific time
      video.currentTime = Math.min(timeInSeconds, video.duration * 0.1);
    };

    video.onseeked = () => {
      try {
        // Draw video frame to canvas
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        
        // Convert to blob
        canvas.toBlob((blob) => {
          if (blob) {
            resolve(URL.createObjectURL(blob));
          } else {
            reject(new Error('Failed to generate thumbnail'));
          }
        }, 'image/jpeg', 0.8);
        
        // Clean up
        URL.revokeObjectURL(video.src);
      } catch (error) {
        reject(error);
      }
    };

    video.onerror = () => {
      reject(new Error('Failed to load video for thumbnail'));
    };

    // Set video source
    video.src = URL.createObjectURL(videoFile);
  });
};

export const compressVideo = async (file, quality = 0.8) => {
  // Note: This is a simplified version. Real compression would require ffmpeg.js or similar
  return new Promise((resolve, reject) => {
    const video = document.createElement('video');
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    video.onloadedmetadata = () => {
      // Set canvas dimensions (reduce for compression)
      const scale = Math.sqrt(quality);
      canvas.width = video.videoWidth * scale;
      canvas.height = video.videoHeight * scale;
      
      video.currentTime = 0;
    };

    video.onseeked = () => {
      try {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        
        canvas.toBlob((blob) => {
          if (blob) {
            // Create a new file with compressed data
            const compressedFile = new File([blob], file.name, {
              type: 'video/mp4',
              lastModified: Date.now()
            });
            resolve(compressedFile);
          } else {
            reject(new Error('Compression failed'));
          }
        }, 'video/mp4', quality);
        
        URL.revokeObjectURL(video.src);
      } catch (error) {
        reject(error);
      }
    };

    video.onerror = () => {
      reject(new Error('Failed to load video for compression'));
    };

    video.src = URL.createObjectURL(file);
  });
};

export const detectVideoQuality = (width, height) => {
  const totalPixels = width * height;
  
  if (totalPixels >= 3840 * 2160) return '4K';
  if (totalPixels >= 1920 * 1080) return '1080p';
  if (totalPixels >= 1280 * 720) return '720p';
  if (totalPixels >= 854 * 480) return '480p';
  if (totalPixels >= 640 * 360) return '360p';
  return 'Low Quality';
};

export const calculateOptimalClipDuration = (totalDuration, platform = 'tiktok') => {
  const platformLimits = {
    'tiktok': { min: 15, max: 180, optimal: 30 },
    'youtube': { min: 15, max: 60, optimal: 45 },
    'instagram': { min: 15, max: 90, optimal: 30 },
    'twitter': { min: 6, max: 140, optimal: 30 }
  };
  
  const limits = platformLimits[platform.toLowerCase()] || platformLimits['tiktok'];
  
  // If total video is shorter than optimal, use 80% of total
  if (totalDuration < limits.optimal) {
    return Math.max(limits.min, Math.floor(totalDuration * 0.8));
  }
  
  return limits.optimal;
};

export const analyzeVideoContent = async (videoFile) => {
  try {
    const metadata = await getVideoMetadata(videoFile);
    const thumbnail = await generateVideoThumbnail(videoFile);
    
    return {
      ...metadata,
      thumbnail,
      quality: detectVideoQuality(metadata.width, metadata.height),
      isOptimalForMobile: metadata.isVertical || metadata.isSquare,
      suggestedClipDuration: calculateOptimalClipDuration(metadata.duration),
      processingRecommendations: {
        needsReframing: metadata.isHorizontal,
        needsCompression: metadata.size > 500 * 1024 * 1024, // 500MB
        needsCaptions: metadata.duration > 30,
        optimalPlatforms: metadata.isVertical ? ['tiktok', 'instagram', 'youtube'] : ['youtube']
      }
    };
  } catch (error) {
    console.error('Error analyzing video:', error);
    throw error;
  }
};

export const createVideoPreview = (file, container) => {
  const video = document.createElement('video');
  video.controls = true;
  video.style.width = '100%';
  video.style.maxHeight = '300px';
  video.style.borderRadius = '8px';
  
  video.src = URL.createObjectURL(file);
  
  if (container) {
    container.appendChild(video);
  }
  
  return video;
};

export const extractVideoFrames = async (videoFile, count = 5) => {
  return new Promise((resolve, reject) => {
    const video = document.createElement('video');
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const frames = [];

    video.onloadedmetadata = () => {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      const interval = video.duration / count;
      let currentFrame = 0;
      
      const captureFrame = () => {
        if (currentFrame >= count) {
          resolve(frames);
          URL.revokeObjectURL(video.src);
          return;
        }
        
        video.currentTime = currentFrame * interval;
      };
      
      video.onseeked = () => {
        try {
          ctx.drawImage(video, 0, 0);
          
          canvas.toBlob((blob) => {
            if (blob) {
              frames.push({
                time: currentFrame * interval,
                url: URL.createObjectURL(blob),
                index: currentFrame
              });
            }
            
            currentFrame++;
            captureFrame();
          }, 'image/jpeg', 0.8);
        } catch (error) {
          reject(error);
        }
      };
      
      captureFrame();
    };

    video.onerror = () => {
      reject(new Error('Failed to load video for frame extraction'));
    };

    video.src = URL.createObjectURL(videoFile);
  });
};

export const downloadBlob = (blob, filename) => {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.style.display = 'none';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  // Clean up
  setTimeout(() => URL.revokeObjectURL(url), 100);
};

export const downloadVideoFromUrl = async (videoUrl, filename = 'video.mp4') => {
  try {
    const response = await fetch(videoUrl, {
      mode: 'cors'
    });
    
    if (!response.ok) {
      throw new Error(`Download failed: ${response.status} ${response.statusText}`);
    }
    
    const blob = await response.blob();
    downloadBlob(blob, filename);
    
    return true;
  } catch (error) {
    console.error('Download error:', error);
    
    // Fallback: open in new tab
    const link = document.createElement('a');
    link.href = videoUrl;
    link.target = '_blank';
    link.download = filename;
    link.click();
    
    throw error;
  }
};

export const shareVideo = async (videoData, title = 'Check out this viral clip!') => {
  const shareData = {
    title: title,
    text: `Generated with ViralClips AI: ${videoData.title || 'Amazing viral clip'}`,
    url: videoData.url || window.location.href
  };
  
  // Check if Web Share API is supported
  if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
    try {
      await navigator.share(shareData);
      return { success: true, method: 'native' };
    } catch (error) {
      if (error.name !== 'AbortError') {
        console.error('Share error:', error);
      }
      // Fall through to clipboard method
    }
  }
  
  // Fallback: Copy to clipboard
  try {
    const shareText = `${shareData.title}\n\n${shareData.text}\n\n${shareData.url}`;
    await navigator.clipboard.writeText(shareText);
    return { success: true, method: 'clipboard' };
  } catch (error) {
    console.error('Clipboard error:', error);
    return { success: false, error: 'Share failed' };
  }
};

export const getVideoFileInfo = (file) => {
  return {
    name: file.name,
    size: file.size,
    type: file.type,
    lastModified: new Date(file.lastModified),
    formattedSize: formatFileSize(file.size),
    extension: file.name.split('.').pop()?.toLowerCase() || '',
    isVideo: file.type.startsWith('video/'),
    sizeCategory: file.size > 1024 * 1024 * 1024 ? 'large' : 
                  file.size > 100 * 1024 * 1024 ? 'medium' : 'small'
  };
};

export const estimateProcessingTime = (videoFile) => {
  const fileSizeGB = videoFile.size / (1024 * 1024 * 1024);
  
  // Rough estimation based on file size
  // These are approximate values for demonstration
  const baseTime = 30; // 30 seconds base
  const timePerGB = 60; // 1 minute per GB
  
  const estimatedSeconds = baseTime + (fileSizeGB * timePerGB);
  
  return {
    seconds: Math.round(estimatedSeconds),
    formatted: formatDuration(estimatedSeconds),
    category: estimatedSeconds < 60 ? 'fast' : 
              estimatedSeconds < 300 ? 'medium' : 'slow'
  };
};

export const createVideoElement = (src, options = {}) => {
  const video = document.createElement('video');
  
  // Default options
  const defaultOptions = {
    controls: true,
    muted: true,
    playsInline: true,
    preload: 'metadata'
  };
  
  const finalOptions = { ...defaultOptions, ...options };
  
  // Apply options
  Object.keys(finalOptions).forEach(key => {
    if (typeof finalOptions[key] === 'boolean') {
      if (finalOptions[key]) {
        video.setAttribute(key, '');
      }
    } else {
      video.setAttribute(key, finalOptions[key]);
    }
  });
  
  // Set source
  if (src instanceof File) {
    video.src = URL.createObjectURL(src);
  } else if (typeof src === 'string') {
    video.src = src;
  }
  
  return video;
};

export const supportedVideoFormats = {
  input: [
    { ext: 'mp4', mime: 'video/mp4', description: 'MP4 Video' },
    { ext: 'avi', mime: 'video/avi', description: 'AVI Video' },
    { ext: 'mov', mime: 'video/mov', description: 'QuickTime Video' },
    { ext: 'mkv', mime: 'video/mkv', description: 'Matroska Video' },
    { ext: 'webm', mime: 'video/webm', description: 'WebM Video' },
    { ext: 'wmv', mime: 'video/wmv', description: 'Windows Media Video' },
    { ext: 'flv', mime: 'video/flv', description: 'Flash Video' },
    { ext: 'm4v', mime: 'video/m4v', description: 'iTunes Video' }
  ],
  output: [
    { ext: 'mp4', mime: 'video/mp4', description: 'MP4 Video (Recommended)' }
  ]
};

export const videoQualityPresets = {
  '4k': { width: 3840, height: 2160, bitrate: '20M' },
  '1080p': { width: 1920, height: 1080, bitrate: '8M' },
  '720p': { width: 1280, height: 720, bitrate: '5M' },
  '480p': { width: 854, height: 480, bitrate: '2.5M' },
  '360p': { width: 640, height: 360, bitrate: '1M' }
};

export const socialMediaSpecs = {
  tiktok: {
    aspectRatio: '9:16',
    maxDuration: 180,
    optimalDuration: 30,
    maxFileSize: 287 * 1024 * 1024, // 287MB
    resolution: '1080x1920',
    formats: ['mp4', 'mov']
  },
  youtube: {
    aspectRatio: '9:16',
    maxDuration: 60,
    optimalDuration: 45,
    maxFileSize: 15 * 1024 * 1024 * 1024, // 15GB
    resolution: '1080x1920',
    formats: ['mp4', 'mov', 'avi', 'wmv', 'flv', 'webm']
  },
  instagram: {
    aspectRatio: '9:16',
    maxDuration: 90,
    optimalDuration: 30,
    maxFileSize: 4 * 1024 * 1024 * 1024, // 4GB
    resolution: '1080x1920',
    formats: ['mp4', 'mov']
  },
  twitter: {
    aspectRatio: '16:9',
    maxDuration: 140,
    optimalDuration: 30,
    maxFileSize: 512 * 1024 * 1024, // 512MB
    resolution: '1280x720',
    formats: ['mp4', 'mov']
  }
};

export const getOptimalSettings = (videoMetadata, targetPlatform = 'tiktok') => {
  const specs = socialMediaSpecs[targetPlatform.toLowerCase()] || socialMediaSpecs.tiktok;
  
  return {
    platform: targetPlatform,
    targetAspectRatio: specs.aspectRatio,
    maxDuration: specs.maxDuration,
    optimalDuration: specs.optimalDuration,
    targetResolution: specs.resolution,
    needsReframing: videoMetadata.aspectRatio !== parseFloat(specs.aspectRatio.replace(':', '/')),
    needsCompression: videoMetadata.size > specs.maxFileSize,
    formatCompatible: specs.formats.includes(videoMetadata.extension),
    recommendations: {
      cropToVertical: videoMetadata.isHorizontal && specs.aspectRatio === '9:16',
      addCaptions: videoMetadata.duration > 15,
      optimizeForMobile: true,
      enhanceAudio: videoMetadata.duration > 30
    }
  };
};

// Error handling utilities
export const handleVideoError = (error, context = 'video processing') => {
  console.error(`${context} error:`, error);
  
  const errorMessages = {
    'NotSupportedError': 'Video format not supported by your browser',
    'NotAllowedError': 'Video access not allowed',
    'NotFoundError': 'Video file not found',
    'NetworkError': 'Network error while loading video',
    'DecodingError': 'Video file is corrupted or invalid'
  };
  
  const userMessage = errorMessages[error.name] || error.message || 'An unknown error occurred';
  
  return {
    type: 'error',
    title: 'Video Error',
    message: userMessage,
    technical: error.message,
    suggestions: [
      'Try a different video file',
      'Check your internet connection',
      'Ensure the video file is not corrupted',
      'Use a supported video format (MP4, MOV, AVI, etc.)'
    ]
  };
};

// Progress tracking utilities
export class ProcessingTracker {
  constructor() {
    this.startTime = null;
    this.progress = 0;
    this.status = 'idle';
    this.callbacks = [];
  }
  
  start() {
    this.startTime = Date.now();
    this.progress = 0;
    this.status = 'processing';
    this.notify();
  }
  
  updateProgress(progress, message = '') {
    this.progress = Math.min(100, Math.max(0, progress));
    this.status = message || 'processing';
    this.notify();
  }
  
  complete() {
    this.progress = 100;
    this.status = 'completed';
    this.notify();
  }
  
  error(message) {
    this.status = `error: ${message}`;
    this.notify();
  }
  
  getElapsedTime() {
    if (!this.startTime) return 0;
    return (Date.now() - this.startTime) / 1000;
  }
  
  getEstimatedTimeRemaining() {
    if (this.progress === 0) return null;
    
    const elapsed = this.getElapsedTime();
    const estimated = (elapsed / this.progress) * (100 - this.progress);
    
    return Math.round(estimated);
  }
  
  onUpdate(callback) {
    this.callbacks.push(callback);
  }
  
  notify() {
    this.callbacks.forEach(callback => {
      try {
        callback({
          progress: this.progress,
          status: this.status,
          elapsedTime: this.getElapsedTime(),
          estimatedTimeRemaining: this.getEstimatedTimeRemaining()
        });
      } catch (error) {
        console.error('Progress callback error:', error);
      }
    });
  }
}

// Video format conversion utilities
export const convertToOptimalFormat = async (videoFile, targetPlatform = 'tiktok') => {
  // Note: This is a placeholder for format conversion
  // In a real implementation, you would use ffmpeg.js or a server-side solution
  
  const optimal = getOptimalSettings(await getVideoMetadata(videoFile), targetPlatform);
  
  return {
    needsConversion: !optimal.formatCompatible || optimal.needsReframing || optimal.needsCompression,
    targetFormat: 'mp4',
    targetResolution: optimal.targetResolution,
    targetAspectRatio: optimal.targetAspectRatio,
    estimatedOutputSize: videoFile.size * 0.7, // Rough estimate
    conversionSteps: [
      optimal.needsReframing && 'Reframe to vertical',
      optimal.needsCompression && 'Compress video',
      !optimal.formatCompatible && 'Convert to MP4',
      optimal.recommendations.addCaptions && 'Add captions',
      'Optimize for mobile'
    ].filter(Boolean)
  };
};

// Batch processing utilities
export const processBatchVideos = async (files, options = {}) => {
  const results = [];
  const errors = [];
  
  for (let i = 0; i < files.length; i++) {
    try {
      const file = files[i];
      const validation = validateVideoFile(file);
      
      if (!validation.valid) {
        errors.push({ file: file.name, error: validation.error });
        continue;
      }
      
      const metadata = await getVideoMetadata(file);
      results.push({
        file: file.name,
        metadata,
        status: 'ready'
      });
      
      // Update progress if callback provided
      if (options.onProgress) {
        options.onProgress((i + 1) / files.length * 100, `Processed ${file.name}`);
      }
      
    } catch (error) {
      errors.push({ file: files[i].name, error: error.message });
    }
  }
  
  return { results, errors };
};

// Local storage utilities for video processing
export const saveVideoToCache = (videoData, cacheKey) => {
  try {
    const data = {
      ...videoData,
      timestamp: Date.now(),
      version: '1.0'
    };
    
    localStorage.setItem(`video_cache_${cacheKey}`, JSON.stringify(data));
    return true;
  } catch (error) {
    console.error('Cache save error:', error);
    return false;
  }
};

export const loadVideoFromCache = (cacheKey) => {
  try {
    const data = localStorage.getItem(`video_cache_${cacheKey}`);
    if (!data) return null;
    
    const parsed = JSON.parse(data);
    
    // Check if cache is still valid (24 hours)
    const maxAge = 24 * 60 * 60 * 1000; // 24 hours
    if (Date.now() - parsed.timestamp > maxAge) {
      localStorage.removeItem(`video_cache_${cacheKey}`);
      return null;
    }
    
    return parsed;
  } catch (error) {
    console.error('Cache load error:', error);
    return null;
  }
};

export const clearVideoCache = () => {
  try {
    const keys = Object.keys(localStorage);
    keys.forEach(key => {
      if (key.startsWith('video_cache_')) {
        localStorage.removeItem(key);
      }
    });
    return true;
  } catch (error) {
    console.error('Cache clear error:', error);
    return false;
  }
};

// Performance monitoring
export const VideoPerformanceMonitor = {
  trackUpload: (startTime, fileSize) => {
    const duration = Date.now() - startTime;
    const speed = fileSize / duration * 1000; // bytes per second
    
    return {
      uploadTime: duration,
      uploadSpeed: speed,
      formattedSpeed: formatFileSize(speed) + '/s'
    };
  },
  
  trackProcessing: (startTime, videoData) => {
    const duration = Date.now() - startTime;
    
    return {
      processingTime: duration,
      efficiency: videoData.duration / (duration / 1000), // video seconds per processing second
      performance: duration < 30000 ? 'excellent' : 
                  duration < 60000 ? 'good' : 
                  duration < 120000 ? 'fair' : 'slow'
    };
  }
};

export default {
  formatDuration,
  formatFileSize,
  validateVideoFile,
  extractVideoUrl,
  validateVideoUrl,
  getVideoMetadata,
  generateVideoThumbnail,
  compressVideo,
  detectVideoQuality,
  calculateOptimalClipDuration,
  analyzeVideoContent,
  createVideoPreview,
  extractVideoFrames,
  downloadBlob,
  downloadVideoFromUrl,
  shareVideo,
  getVideoFileInfo,
  estimateProcessingTime,
  createVideoElement,
  supportedVideoFormats,
  videoQualityPresets,
  socialMediaSpecs,
  getOptimalSettings,
  handleVideoError,
  ProcessingTracker,
  processBatchVideos,
  saveVideoToCache,
  loadVideoFromCache,
  clearVideoCache,
  VideoPerformanceMonitor
};
