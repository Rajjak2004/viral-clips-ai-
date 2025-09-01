import axios from 'axios';

const API_BASE = process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000';

class VideoProcessingService {
  // Process video with backend
  async processVideo(videoFile, options) {
    try {
      const formData = new FormData();
      formData.append('video', videoFile);
      formData.append('startTime', options.startTime || 0);
      formData.append('endTime', options.endTime || 30);
      formData.append('addSubtitles', options.addSubtitles || false);
      formData.append('subtitleText', options.subtitleText || '');
      formData.append('preset', options.preset || 'tiktok');

      const response = await axios.post(`${API_BASE}/api/process-video`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress: (progressEvent) => {
          const progress = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          if (options.onProgress) {
            options.onProgress(progress, 'Uploading...');
          }
        }
      });

      return response.data;
    } catch (error) {
      console.error('Video processing failed:', error);
      throw new Error(`Processing failed: ${error.message}`);
    }
  }

  // Trim video to specific duration
  async trimVideo(videoFile, startTime, endTime, onProgress) {
    return this.processVideo(videoFile, {
      startTime,
      endTime,
      addSubtitles: false,
      onProgress
    });
  }

  // Add subtitles to video
  async addSubtitles(videoFile, subtitleText, onProgress) {
    return this.processVideo(videoFile, {
      startTime: 0,
      endTime: null,
      addSubtitles: true,
      subtitleText,
      onProgress
    });
  }

  // Convert to different presets
  async applyPreset(videoFile, preset, onProgress) {
    const presetConfigs = {
      tiktok: {
        aspectRatio: '9:16',
        maxDuration: 30,
        addCaptions: true,
        effects: ['auto-enhance', 'mobile-optimize']
      },
      youtube: {
        aspectRatio: '9:16',
        maxDuration: 60,
        addCaptions: true,
        effects: ['clear-audio', 'smooth-transitions']
      },
      instagram: {
        aspectRatio: '9:16',
        maxDuration: 30,
        addCaptions: true,
        effects: ['color-grade', 'trendy-effects']
      }
    };

    return this.processVideo(videoFile, {
      ...presetConfigs[preset],
      preset,
      onProgress
    });
  }
}

export default new VideoProcessingService();
