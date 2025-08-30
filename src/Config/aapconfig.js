// App Configuration - Customize your app easily
export const APP_CONFIG = {
  // App Information
  appName: 'ViralClips AI',
  tagline: 'Turn long videos into viral shorts',
  description: 'AI-powered video editor that automatically extracts the most engaging moments from your videos',
  
  // Branding
  brandColors: {
    primary: {
      from: '#8b5cf6', // purple-500
      to: '#ec4899',   // pink-500
    },
    secondary: {
      from: '#3b82f6', // blue-500  
      to: '#06b6d4',   // cyan-500
    }
  },
  
  // API Configuration
  api: {
    provider: 'klap', // 'klap', 'sendshort', 'shotstack'
    baseUrl: 'https://api.klap.app/v2',
    timeout: 30000, // 30 seconds
  },
  
  // Processing Options
  defaultOptions: {
    clipCount: 3,
    maxDuration: 30,
    aspectRatio: '9:16', // '9:16', '16:9', '1:1'
    addCaptions: true,
    autoReframe: true,
  },
  
  // File Upload Limits
  upload: {
    maxFileSize: 2 * 1024 * 1024 * 1024, // 2GB
    acceptedFormats: ['video/mp4', 'video/mov', 'video/avi', 'video/mkv', 'video/webm'],
    maxDuration: 3600, // 1 hour
  },
  
  // UI Settings
  ui: {
    defaultTheme: 'dark', // 'dark' or 'light'
    enableAnimations: true,
    showProgressBar: true,
    enableNotifications: true,
  },
  
  // Features
  features: {
    urlProcessing: true,
    fileUpload: true,
    batchProcessing: false,
    socialSharing: true,
    downloadClips: true,
    processingHistory: true,
  },
  
  // Social Links
  social: {
    github: 'https://github.com/yourusername/viral-clips-ai',
    twitter: 'https://twitter.com/yourusername',
    discord: 'https://discord.gg/viral-clips-ai',
    website: 'https://yourwebsite.com',
  },
  
  // Analytics (Optional)
  analytics: {
    googleAnalytics: '', // GA tracking ID
    mixpanel: '',        // Mixpanel token
    enabled: false,
  },
  
  // SEO
  seo: {
    title: 'ViralClips AI - Turn Videos into Viral Shorts',
    description: 'AI-powered video editor that automatically extracts the most engaging moments from your videos and turns them into viral shorts for TikTok, YouTube Shorts, and Instagram Reels.',
    keywords: 'ai video editor, viral clips, tiktok videos, youtube shorts, instagram reels',
    ogImage: 'https://yourdomain.com/og-image.jpg',
  },
  
  // API Providers Configuration
  apiProviders: {
    klap: {
      name: 'Klap',
      baseUrl: 'https://api.klap.app/v2',
      signupUrl: 'https://klap.app',
      pricingUrl: 'https://klap.app/pricing',
      features: ['AI Clips', 'Auto Captions', 'Viral Scoring', 'Multi-platform'],
    },
    sendshort: {
      name: 'SendShort',
      baseUrl: 'https://api.sendshort.ai/v1',
      signupUrl: 'https://sendshort.ai',
      pricingUrl: 'https://sendshort.ai/pricing',
      features: ['AI Clips', 'Social Media Ready', 'Fast Processing'],
    },
    shotstack: {
      name: 'Shotstack',
      baseUrl: 'https://api.shotstack.io/v1',
      signupUrl: 'https://shotstack.io',
      pricingUrl: 'https://shotstack.io/pricing',
      features: ['Video API', 'Templates', 'High Quality', 'Developer Friendly'],
    },
  },
  
  // Error Messages
  errors: {
    apiKeyInvalid: 'Invalid API key. Please check your credentials.',
    insufficientCredits: 'Insufficient credits. Please upgrade your plan.',
    fileTooBig: 'File size exceeds the maximum limit of 2GB.',
    unsupportedFormat: 'Unsupported file format. Please use MP4, MOV, AVI, MKV, or WebM.',
    networkError: 'Network error. Please check your connection and try again.',
    processingFailed: 'Video processing failed. Please try again.',
    downloadFailed: 'Download failed. Please try again.',
  },
  
  // Success Messages
  success: {
    videoUploaded: 'Video uploaded successfully!',
    apiKeyValid: 'API key validated successfully!',
    clipsGenerated: 'Viral clips generated successfully!',
    downloadComplete: 'Download completed!',
  },
  
  // Premium Features (for future use)
  premium: {
    enabled: false,
    features: [
      'Unlimited processing',
      'Priority support', 
      'Custom branding',
      'Batch processing',
      'Advanced analytics',
    ],
  },
};

// Theme Configuration
export const THEME_CONFIG = {
  dark: {
    primary: 'from-purple-900 via-blue-900 to-indigo-900',
    secondary: 'bg-white/10',
    text: 'text-white',
    textSecondary: 'text-purple-200',
    border: 'border-white/20',
    hover: 'hover:bg-white/10',
  },
  light: {
    primary: 'from-blue-50 via-indigo-50 to-purple-50',
    secondary: 'bg-white/50',
    text: 'text-gray-800',
    textSecondary: 'text-purple-600',
    border: 'border-gray-200',
    hover: 'hover:bg-gray-100',
  },
};

// Processing Presets
export const PROCESSING_PRESETS = {
  tiktok: {
    name: 'TikTok Optimized',
    clipCount: 3,
    maxDuration: 15,
    aspectRatio: '9:16',
    addCaptions: true,
    style: 'energetic',
  },
  youtube: {
    name: 'YouTube Shorts',
    clipCount: 5,
    maxDuration: 60,
    aspectRatio: '9:16',
    addCaptions: true,
    style: 'informative',
  },
  instagram: {
    name: 'Instagram Reels',
    clipCount: 3,
    maxDuration: 30,
    aspectRatio: '9:16',
    addCaptions: true,
    style: 'trendy',
  },
  custom: {
    name: 'Custom Settings',
    clipCount: 3,
    maxDuration: 30,
    aspectRatio: '9:16',
    addCaptions: true,
    style: 'balanced',
  },
};
