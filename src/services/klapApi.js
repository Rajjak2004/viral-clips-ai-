// Klap API Service
const KLAP_API_BASE_URL = 'https://api.klap.app/v2';

class KlapApiService {
  constructor() {
    this.apiKey = this.getApiKey();
  }

  getApiKey() {
    return localStorage.getItem('klap_api_key') || '';
  }

  setApiKey(apiKey) {
    localStorage.setItem('klap_api_key', apiKey);
    this.apiKey = apiKey;
  }

  // Headers for API requests
  getHeaders() {
    return {
      'Authorization': `Bearer ${this.apiKey}`,
      'Content-Type': 'application/json',
    };
  }

  // Generate shorts from video
  async generateShorts(videoData, options = {}) {
    try {
      const formData = new FormData();
      
      // Add video file or URL
      if (videoData.file) {
        formData.append('video', videoData.file);
      } else if (videoData.url) {
        formData.append('url', videoData.url);
      }

      // Add options
      if (options.clipCount) {
        formData.append('clip_count', options.clipCount);
      }
      if (options.duration) {
        formData.append('max_duration', options.duration);
      }
      if (options.aspectRatio) {
        formData.append('aspect_ratio', options.aspectRatio);
      }
      if (options.captions) {
        formData.append('add_captions', 'true');
      }

      const response = await fetch(`${KLAP_API_BASE_URL}/generate-shorts`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`API Error: ${response.status} ${response.statusText}`);
      }

      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Error generating shorts:', error);
      throw error;
    }
  }

  // Add captions and reframe video
  async captionReframe(videoData, options = {}) {
    try {
      const formData = new FormData();
      
      if (videoData.file) {
        formData.append('video', videoData.file);
      } else if (videoData.url) {
        formData.append('url', videoData.url);
      }

      if (options.addCaptions) {
        formData.append('add_captions', 'true');
      }
      if (options.reframe) {
        formData.append('reframe', 'true');
      }
      if (options.aspectRatio) {
        formData.append('aspect_ratio', options.aspectRatio);
      }

      const response = await fetch(`${KLAP_API_BASE_URL}/caption-reframe`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`API Error: ${response.status} ${response.statusText}`);
      }

      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Error processing video:', error);
      throw error;
    }
  }

  // Get job status
  async getJobStatus(jobId) {
    try {
      const response = await fetch(`${KLAP_API_BASE_URL}/jobs/${jobId}`, {
        method: 'GET',
        headers: this.getHeaders(),
      });

      if (!response.ok) {
        throw new Error(`API Error: ${response.status} ${response.statusText}`);
      }

      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Error getting job status:', error);
      throw error;
    }
  }

  // Download processed video
  async downloadVideo(videoUrl, filename) {
    try {
      const response = await fetch(videoUrl);
      const blob = await response.blob();
      
      // Create download link
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = filename || 'viral-clip.mp4';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(downloadUrl);
      
      return true;
    } catch (error) {
      console.error('Error downloading video:', error);
      throw error;
    }
  }

  // Mock function for development/testing
  async mockGenerateShorts(videoData, options = {}) {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 5000));

    // Return mock data
    return {
      job_id: 'mock_job_' + Math.random().toString(36).substr(2, 9),
      status: 'completed',
      clips: [
        {
          id: 1,
          title: "Most Viral Moment",
          duration: 15,
          score: 95,
          url: "https://example.com/clip1.mp4",
          thumbnail: "https://via.placeholder.com/400x600/6366f1/ffffff?text=Clip+1",
          start_time: 45,
          end_time: 60,
          transcript: "This is the most engaging part of your video...",
          tags: ["funny", "engaging", "viral"]
        },
        {
          id: 2,
          title: "Trending Hook",
          duration: 12,
          score: 88,
          url: "https://example.com/clip2.mp4", 
          thumbnail: "https://via.placeholder.com/400x600/8b5cf6/ffffff?text=Clip+2",
          start_time: 120,
          end_time: 132,
          transcript: "Another highly engaging segment...",
          tags: ["hook", "attention", "trending"]
        },
        {
          id: 3,
          title: "Perfect Ending",
          duration: 18,
          score: 82,
          url: "https://example.com/clip3.mp4",
          thumbnail: "https://via.placeholder.com/400x600/a855f7/ffffff?text=Clip+3", 
          start_time: 200,
          end_time: 218,
          transcript: "A compelling conclusion that keeps viewers engaged...",
          tags: ["ending", "conclusion", "memorable"]
        }
      ],
      processing_time: "4.2s",
      original_duration: 300,
      clips_found: 3
    };
  }

  // Validate API key
  async validateApiKey() {
    try {
      const response = await fetch(`${KLAP_API_BASE_URL}/validate`, {
        method: 'GET',
        headers: this.getHeaders(),
      });

      return response.ok;
    } catch (error) {
      console.error('Error validating API key:', error);
      return false;
    }
  }

  // Get account usage/limits
  async getUsage() {
    try {
      const response = await fetch(`${KLAP_API_BASE_URL}/usage`, {
        method: 'GET',
        headers: this.getHeaders(),
      });

      if (!response.ok) {
        throw new Error(`API Error: ${response.status} ${response.statusText}`);
      }

      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Error getting usage:', error);
      throw error;
    }
  }
}

// Export singleton instance
const klapApi = new KlapApiService();
export default klapApi;
