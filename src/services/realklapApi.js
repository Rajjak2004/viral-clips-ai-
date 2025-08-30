// Real Klap API Service - Production Ready
const KLAP_API_BASE_URL = 'https://api.klap.app/v2';

class RealKlapApiService {
  constructor() {
    this.apiKey = this.getApiKey();
    this.baseURL = KLAP_API_BASE_URL;
  }

  getApiKey() {
    return localStorage.getItem('klap_api_key') || '';
  }

  setApiKey(apiKey) {
    localStorage.setItem('klap_api_key', apiKey);
    this.apiKey = apiKey;
  }

  // Standard headers for all requests
  getHeaders(contentType = 'application/json') {
    const headers = {
      'Authorization': `Bearer ${this.apiKey}`,
    };
    
    if (contentType) {
      headers['Content-Type'] = contentType;
    }
    
    return headers;
  }

  // Generate viral clips from video
  async generateShorts(videoData, options = {}) {
    try {
      const formData = new FormData();
      
      // Add video source (file or URL)
      if (videoData.file) {
        formData.append('video', videoData.file);
      } else if (videoData.url) {
        formData.append('video_url', videoData.url);
      } else {
        throw new Error('No video file or URL provided');
      }

      // Add processing options
      if (options.clipCount) {
        formData.append('num_clips', options.clipCount.toString());
      }
      if (options.duration) {
        formData.append('max_clip_duration', options.duration.toString());
      }
      if (options.aspectRatio) {
        formData.append('aspect_ratio', options.aspectRatio);
      }
      if (options.captions !== false) {
        formData.append('add_captions', 'true');
      }
      if (options.reframe !== false) {
        formData.append('auto_reframe', 'true');
      }

      console.log('Sending request to Klap API...');
      
      const response = await fetch(`${this.baseURL}/generate-clips`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          // Don't set Content-Type for FormData, browser will set it automatically
        },
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.text();
        console.error('Klap API Error:', response.status, errorData);
        
        if (response.status === 401) {
          throw new Error('Invalid API key. Please check your Klap API key.');
        } else if (response.status === 429) {
          throw new Error('Rate limit exceeded. Please try again later.');
        } else if (response.status === 402) {
          throw new Error('Insufficient credits. Please upgrade your Klap plan.');
        } else {
          throw new Error(`API Error: ${response.status} - ${errorData}`);
        }
      }

      const result = await response.json();
      console.log('Klap API Response:', result);
      
      return result;
    } catch (error) {
      console.error('Error generating shorts:', error);
      throw error;
    }
  }

  // Add captions to existing video
  async addCaptions(videoData, options = {}) {
    try {
      const formData = new FormData();
      
      if (videoData.file) {
        formData.append('video', videoData.file);
      } else if (videoData.url) {
        formData.append('video_url', videoData.url);
      }

      // Caption options
      if (options.language) {
        formData.append('language', options.language);
      }
      if (options.style) {
        formData.append('caption_style', options.style);
      }

      const response = await fetch(`${this.baseURL}/add-captions`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`API Error: ${response.status} ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error adding captions:', error);
      throw error;
    }
  }

  // Get job status for async processing
  async getJobStatus(jobId) {
    try {
      const response = await fetch(`${this.baseURL}/jobs/${jobId}`, {
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

  // Poll job status until completion
  async waitForJobCompletion(jobId, maxWaitTime = 300000) { // 5 minutes max
    const startTime = Date.now();
    const pollInterval = 3000; // Check every 3 seconds

    return new Promise((resolve, reject) => {
      const poll = async () => {
        try {
          if (Date.now() - startTime > maxWaitTime) {
            reject(new Error('Job timeout - processing took too long'));
            return;
          }

          const status = await this.getJobStatus(jobId);
          
          if (status.status === 'completed') {
            resolve(status);
          } else if (status.status === 'failed') {
            reject(new Error(status.error || 'Job failed'));
          } else if (status.status === 'processing') {
            // Continue polling
            setTimeout(poll, pollInterval);
          } else {
            // Unknown status, continue polling
            setTimeout(poll, pollInterval);
          }
        } catch (error) {
          reject(error);
        }
      };

      poll();
    });
  }

  // Download video from URL
  async downloadVideo(videoUrl, filename) {
    try {
      const response = await fetch(videoUrl, {
        headers: this.getHeaders(),
      });

      if (!response.ok) {
        throw new Error(`Download failed: ${response.status} ${response.statusText}`);
      }

      const blob = await response.blob();
      
      // Create download link
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = filename || 'viral-clip.mp4';
      link.style.display = 'none';
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

  // Validate API key
  async validateApiKey() {
    try {
      const response = await fetch(`${this.baseURL}/user/profile`, {
        method: 'GET',
        headers: this.getHeaders(),
      });

      if (response.status === 401) {
        return { valid: false, error: 'Invalid API key' };
      } else if (response.ok) {
        const data = await response.json();
        return { 
          valid: true, 
          user: data.user,
          credits: data.credits_remaining 
        };
      } else {
        return { valid: false, error: 'Unable to validate API key' };
      }
    } catch (error) {
      console.error('Error validating API key:', error);
      return { valid: false, error: 'Network error' };
    }
  }

  // Get account usage and limits
  async getAccountInfo() {
    try {
      const response = await fetch(`${this.baseURL}/user/usage`, {
        method: 'GET',
        headers: this.getHeaders(),
      });

      if (!response.ok) {
        throw new Error(`API Error: ${response.status} ${response.statusText}`);
      }

      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Error getting account info:', error);
      throw error;
    }
  }

  // List all user's jobs/videos
  async getJobHistory(limit = 10, offset = 0) {
    try {
      const response = await fetch(`${this.baseURL}/jobs?limit=${limit}&offset=${offset}`, {
        method: 'GET',
        headers: this.getHeaders(),
      });

      if (!response.ok) {
        throw new Error(`API Error: ${response.status} ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error getting job history:', error);
      throw error;
    }
  }

  // Delete a job/video
  async deleteJob(jobId) {
    try {
      const response = await fetch(`${this.baseURL}/jobs/${jobId}`, {
        method: 'DELETE',
        headers: this.getHeaders(),
      });

      if (!response.ok) {
        throw new Error(`API Error: ${response.status} ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error deleting job:', error);
      throw error;
    }
  }

  // Get supported video formats
  getSupportedFormats() {
    return {
      input: ['mp4', 'mov', 'avi', 'mkv', 'webm', 'm4v'],
      maxSize: 2 * 1024 * 1024 * 1024, // 2GB
      maxDuration: 3600, // 1 hour
      output: ['mp4']
    };
  }

  // Helper method for error handling
  handleApiError(error, operation) {
    const errorMessages = {
      401: 'Invalid API key. Please check your credentials.',
      402: 'Insufficient credits. Please upgrade your plan.',
      403: 'Access denied. Check your API permissions.',
      429: 'Rate limit exceeded. Please try again later.',
      500: 'Server error. Please try again later.',
      503: 'Service temporarily unavailable.'
    };

    if (error.response?.status) {
      const message = errorMessages[error.response.status] || 'Unknown API error';
      throw new Error(`${operation}: ${message}`);
    } else {
      throw new Error(`${operation}: ${error.message}`);
    }
  }

  // Test connection to API
  async testConnection() {
    try {
      const response = await fetch(`${this.baseURL}/health`, {
        method: 'GET',
        headers: this.getHeaders(),
      });

      return {
        connected: response.ok,
        status: response.status,
        message: response.ok ? 'Connected successfully' : 'Connection failed'
      };
    } catch (error) {
      return {
        connected: false,
        status: 0,
        message: 'Network error - unable to reach API'
      };
    }
  }
}

// Export singleton instance
const realKlapApi = new RealKlapApiService();
export default realKlapApi;
