import axios from 'axios';

const API_BASE = process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000';

class UrlDownloadService {
  // Download video from URL
  async downloadFromUrl(url, onProgress) {
    try {
      console.log('📥 Starting URL download:', url);
      
      const response = await axios.post(`${API_BASE}/api/download-video`, 
        { url },
        {
          onDownloadProgress: (progressEvent) => {
            if (onProgress && progressEvent.total) {
              const progress = Math.round(
                (progressEvent.loaded * 100) / progressEvent.total
              );
              onProgress(progress, 'Downloading video...');
            }
          }
        }
      );

      return {
        success: true,
        videoPath: response.data.videoPath,
        metadata: response.data.metadata,
        downloadedFile: await this.fetchDownloadedFile(response.data.videoPath)
      };
    } catch (error) {
      console.error('❌ URL download failed:', error);
      throw new Error(`Download failed: ${error.message}`);
    }
  }

  // Fetch downloaded file
  async fetchDownloadedFile(videoPath) {
    try {
      const response = await axios.get(`${API_BASE}${videoPath}`, {
        responseType: 'blob'
      });
      
      return new File([response.data], 'downloaded_video.mp4', {
        type: 'video/mp4'
      });
    } catch (error) {
      console.error('❌ File fetch failed:', error);
      throw new Error('Failed to fetch downloaded file');
    }
  }

  // Get video info without downloading
  async getVideoInfo(url) {
    try {
      const response = await axios.post(`${API_BASE}/api/video-info`, { url });
      return response.data;
    } catch (error) {
      console.error('❌ Video info failed:', error);
      throw new Error('Failed to get video information');
    }
  }

  // Validate URL
  validateUrl(url) {
    const patterns = {
      youtube: /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/,
      tiktok: /tiktok\.com\/@[\w.-]+\/video\/\d+/,
      instagram: /instagram\.com\/(?:p|reel)\/[\w-]+/,
      facebook: /facebook\.com\/.*\/videos\/\d+/,
      twitter: /twitter\.com\/\w+\/status\/\d+/,
      vimeo: /vimeo\.com\/\d+/
    };

    for (const [platform, pattern] of Object.entries(patterns)) {
      if (pattern.test(url)) {
        return { valid: true, platform };
      }
    }

    return { valid: false, error: 'Unsupported URL format' };
  }
}

export default new UrlDownloadService();
