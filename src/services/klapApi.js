// Klap API Service - Main Entry Point
// This file provides a simplified interface for all API operations

// Mock API for demonstration (replace with real API in production)
const mockApi = {
  apiKey: '',
  
  setApiKey: function(key) {
    this.apiKey = key;
    localStorage.setItem('klap_api_key', key);
  },
  
  getApiKey: function() {
    return localStorage.getItem('klap_api_key') || '';
  },
  
  // Generate viral clips from video
  generateShorts: async function(videoData, options = {}) {
    // Simulate API processing delay
    await new Promise(resolve => setTimeout(resolve, 4000));
    
    const clipCount = options.clipCount || 3;
    const platform = options.platform || 'TikTok';
    const maxDuration = options.maxDuration || 30;
    
    // Generate realistic mock clips
    const mockClips = [];
    
    const clipTemplates = [
      {
        title: "🔥 Most Viral Moment",
        viralFactors: ["High Energy", "Perfect Hook", "Trending Audio"],
        scoreRange: [85, 95]
      },
      {
        title: "⚡ Perfect Hook", 
        viralFactors: ["Strong Opening", "Emotional Impact", "Clear Value"],
        scoreRange: [80, 90]
      },
      {
        title: "💎 Powerful Ending",
        viralFactors: ["Strong CTA", "Memorable Quote", "Share-worthy"],
        scoreRange: [75, 85]
      },
      {
        title: "🎯 Key Insight",
        viralFactors: ["Educational", "Easy to Follow", "Actionable"],
        scoreRange: [78, 88]
      },
      {
        title: "✨ Magic Moment",
        viralFactors: ["Surprising", "Relatable", "Entertaining"],
        scoreRange: [82, 92]
      }
    ];
    
    for (let i = 0; i < clipCount; i++) {
      const template = clipTemplates[i] || clipTemplates[0];
      const score = Math.floor(Math.random() * (template.scoreRange[1] - template.scoreRange[0] + 1)) + template.scoreRange[0];
      const duration = Math.floor(Math.random() * (maxDuration - 10)) + 10;
      const startTime = Math.floor(Math.random() * 300);
      
      mockClips.push({
        id: i + 1,
        title: template.title,
        duration: duration,
        score: score,
        url: `https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4#t=${startTime},${startTime + duration}`,
        thumbnail: `https://via.placeholder.com/400x600/${this.getRandomColor()}/ffffff?text=🎬+Clip+${i + 1}`,
        transcript: this.generateMockTranscript(template.title, duration),
        timestamp: `${this.formatTime(startTime)} - ${this.formatTime(startTime + duration)}`,
        viralFactors: template.viralFactors,
        platform: platform,
        metadata: {
          startTime: startTime,
          endTime: startTime + duration,
          confidence: Math.floor(Math.random() * 20) + 80,
          audioScore: Math.floor(Math.random() * 30) + 70,
          visualScore: Math.floor(Math.random() * 30) + 70
        }
      });
    }
    
    return {
      clips: mockClips,
      jobId: `mock_job_${Date.now()}`,
      status: 'completed',
      message: `Successfully generated ${clipCount} viral clips optimized for ${platform}`,
      processingTime: 4000,
      creditsUsed: clipCount
    };
  },
  
  // Validate API key
  validateApiKey: async function() {
    if (!this.apiKey) {
      return { valid: false, error: 'No API key provided' };
    }
    
    // Simulate validation delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Simple validation logic for demo
    if (this.apiKey.length < 6) {
      return { valid: false, error: 'API key is too short' };
    }
    
    if (this.apiKey === 'invalid') {
      return { valid: false, error: 'Invalid API key format' };
    }
    
    // Return mock account info
    return {
      valid: true,
      user: {
        id: 'demo_user_123',
        email: 'demo@viralclips.ai',
        name: 'Demo User',
        plan: 'Free',
        avatar: 'https://via.placeholder.com/100x100/8b5cf6/ffffff?text=DU'
      },
      credits: 25,
      usage: {
        videosProcessed: 8,
        clipsGenerated: 24,
        monthlyLimit: 50,
        resetDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
      }
    };
  },
  
  // Helper functions
  getRandomColor: function() {
    const colors = ['8b5cf6', 'ec4899', 'f59e0b', '10b981', '3b82f6', 'ef4444'];
    return colors[Math.floor(Math.random() * colors.length)];
  },
  
  generateMockTranscript: function(title, duration) {
    const transcripts = {
      "🔥 Most Viral Moment": "This incredible moment showcases exactly why this content has viral potential. The energy, timing, and delivery create perfect engagement hooks that keep viewers watching.",
      "⚡ Perfect Hook": "What you're seeing here is a masterclass in audience capture. The opening immediately grabs attention with compelling storytelling that makes viewers want to share.",
      "💎 Powerful Ending": "This conclusion delivers on the promise made at the beginning. It's the kind of ending that makes people want to watch again and share with friends.",
      "🎯 Key Insight": "This segment contains the core value that viewers came for. It's educational, actionable, and presented in a way that's easy to understand and remember.",
      "✨ Magic Moment": "The authenticity and genuine reaction here create an emotional connection. This is exactly the type of content that performs well across all platforms."
    };
    
    return transcripts[title] || "This clip contains highly engaging content that's perfect for social media. The timing, energy, and message create the ideal combination for viral potential.";
  },
  
  formatTime: function(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }
};

// Main API service interface
const klapApiService = {
  // API key management
  setApiKey: (apiKey) => {
    mockApi.setApiKey(apiKey);
  },
  
  getApiKey: () => {
    return mockApi.getApiKey();
  },
  
  // Validate API key
  validateApiKey: async () => {
    try {
      const result = await mockApi.validateApiKey();
      return result;
    } catch (error) {
      console.error('API validation error:', error);
      return { valid: false, error: 'Validation failed' };
    }
  },
  
  // Generate viral clips
  generateShorts: async (videoData, options = {}) => {
    try {
      const result = await mockApi.generateShorts(videoData, options);
      return result;
    } catch (error) {
      console.error('Clip generation error:', error);
      throw new Error('Failed to generate clips. Please try again.');
    }
  },
  
  // Download video clip
  downloadClip: async (clip) => {
    try {
      // For demo purposes, open video in new tab
      // In production, this would download the actual file
      const link = document.createElement('a');
      link.href = clip.url;
      link.download = `viral-clip-${clip.id}.mp4`;
      link.target = '_blank';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      return true;
    } catch (error) {
      console.error('Download error:', error);
      throw new Error('Download failed. Please try again.');
    }
  },
  
  // Share clip
  shareClip: async (clip) => {
    const shareData = {
      title: `Check out this viral clip: ${clip.title}`,
      text: `Generated with ViralClips AI - ${clip.transcript.substring(0, 100)}...`,
      url: window.location.href
    };
    
    // Try native sharing first
    if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
      try {
        await navigator.share(shareData);
        return { success: true, method: 'native' };
      } catch (error) {
        if (error.name === 'AbortError') {
          return { success: false, error: 'Share cancelled' };
        }
        // Fall through to clipboard
      }
    }
    
    // Fallback to clipboard
    try {
      const shareText = `${shareData.title}\n\n${shareData.text}\n\n${shareData.url}`;
      await navigator.clipboard.writeText(shareText);
      return { success: true, method: 'clipboard' };
    } catch (error) {
      console.error('Share error:', error);
      return { success: false, error: 'Share failed' };
    }
  },
  
  // Get supported formats
  getSupportedFormats: () => {
    return {
      input: ['mp4', 'mov', 'avi', 'mkv', 'webm', 'm4v', 'wmv'],
      output: ['mp4'],
      maxSize: 2 * 1024 * 1024 * 1024, // 2GB
      maxDuration: 3600, // 1 hour
      supportedPlatforms: ['TikTok', 'YouTube', 'Instagram', 'Twitter']
    };
  },
  
  // Get account information
  getAccountInfo: async () => {
    try {
      const validation = await mockApi.validateApiKey();
      if (validation.valid) {
        return {
          user: validation.user,
          credits: validation.credits,
          usage: validation.usage
        };
      }
      throw new Error('Invalid API key');
    } catch (error) {
      console.error('Account info error:', error);
      throw new Error('Failed to get account information');
    }
  },
  
  // Test API connection
  testConnection: async () => {
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      return {
        connected: true,
        status: 200,
        message: 'API connection successful',
        latency: Math.floor(Math.random() * 100) + 50 + 'ms'
      };
    } catch (error) {
      return {
        connected: false,
        status: 0,
        message: 'Connection failed',
        error: error.message
      };
    }
  }
};

// Export the service
export default klapApiService;
