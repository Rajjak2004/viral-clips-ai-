import React, { useState, useRef, useEffect } from 'react';
import {
  Upload, Video, Scissors, Download, Play, Settings,
  Zap, FileVideo, Camera, Share2, Star, Clock, AlertCircle, 
  CheckCircle, X, Menu, Sun, Moon, User, Cloud, Loader,
  Eye, TrendingUp, Heart, MessageCircle, Send, Globe,
  Smartphone, Youtube, Instagram, Twitter, ChevronRight,
  Sparkles, Award, Trophy, Target, BarChart3, Flame
} from 'lucide-react';

function App() {
  // Enhanced State Management
  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('theme') === 'dark' || 
             (!localStorage.getItem('theme') && window.matchMedia('(prefers-color-scheme: dark)').matches);
    }
    return true;
  });
  
  const [clips, setClips] = useState([]);
  const [videoUrl, setVideoUrl] = useState("");
  const [transcript, setTranscript] = useState("");
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [apiKey, setApiKey] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem("viral_api_key") || "";
    }
    return "";
  });
  
  const [currentVideo, setCurrentVideo] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStep, setProcessingStep] = useState('');
  const [processingProgress, setProcessingProgress] = useState(0);
  const [selectedPreset, setSelectedPreset] = useState('tiktok');
  const [viralAnalysis, setViralAnalysis] = useState(null);
  const [notification, setNotification] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const [videoPreview, setVideoPreview] = useState(null);
  const [showWelcome, setShowWelcome] = useState(true);

  const fileInputRef = useRef(null);

  // Professional Video Presets
  const presets = {
    tiktok: {
      name: '🎵 TikTok Viral',
      duration: 30,
      aspectRatio: '9:16',
      style: 'energetic',
      features: ['Auto-captions', 'Trending hooks', 'Quick cuts', 'Viral music'],
      description: 'Optimized for TikTok\'s algorithm',
      specs: '1080x1920, 30s max, vertical',
      color: 'from-pink-500 to-rose-500',
      icon: '🎵'
    },
    youtube: {
      name: '📺 YouTube Shorts',
      duration: 60,
      aspectRatio: '9:16',
      style: 'educational',
      features: ['Clear audio', 'Smooth transitions', 'Call-to-action', 'SEO optimized'],
      description: 'Perfect for YouTube Shorts',
      specs: '1080x1920, 60s max, vertical',
      color: 'from-red-500 to-orange-500',
      icon: '📺'
    },
    instagram: {
      name: '📸 Instagram Reels',
      duration: 30,
      aspectRatio: '9:16',
      style: 'aesthetic',
      features: ['Color grading', 'Trendy effects', 'Music sync', 'Story-ready'],
      description: 'Instagram-ready content',
      specs: '1080x1920, 30s max, trendy',
      color: 'from-purple-500 to-pink-500',
      icon: '📸'
    },
    twitter: {
      name: '🐦 Twitter/X Video',
      duration: 140,
      aspectRatio: '16:9',
      style: 'news-worthy',
      features: ['Breaking news style', 'Text overlays', 'Quick impact', 'Share-focused'],
      description: 'Twitter/X optimized',
      specs: '1280x720, 140s max, landscape',
      color: 'from-blue-500 to-cyan-500',
      icon: '🐦'
    }
  };

  // Enhanced Theme Management
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('theme', darkMode ? 'dark' : 'light');
      document.documentElement.classList.toggle('dark', darkMode);
    }
  }, [darkMode]);

  // Professional Notification System
  const showNotification = (message, type = 'success', duration = 4000) => {
    const id = Date.now();
    setNotification({ id, message, type });
    setTimeout(() => setNotification(null), duration);
  };

  // Advanced Mock API Service
  const mockApiService = {
    async generateTranscript(videoFile) {
      await this.simulateProcessing(2000, 'Analyzing audio...');
      
      const mockTranscripts = [
        {
          text: "Welcome to this incredible journey where we'll discover the most powerful viral content strategies that dominate social media in 2024. These aren't just theories - they're proven methods used by top creators.",
          confidence: 94,
          language: "en"
        },
        {
          text: "In today's video, I'm revealing the secret psychology behind viral content. After analyzing over 10,000 viral videos, I've uncovered the exact patterns that make content explode across platforms.",
          confidence: 96,
          language: "en"
        },
        {
          text: "What's up creators! Today we're diving deep into the science of engagement. These strategies have helped my students gain millions of followers and generate massive revenue through social media.",
          confidence: 92,
          language: "en"
        }
      ];
      
      const selected = mockTranscripts[Math.floor(Math.random() * mockTranscripts.length)];
      
      return {
        ...selected,
        segments: this.generateSegments(selected.text),
        duration: 45 + Math.floor(Math.random() * 30),
        processingTime: Date.now()
      };
    },

    generateSegments(text) {
      const words = text.split(' ');
      const segments = [];
      let currentTime = 0;
      
      for (let i = 0; i < words.length; i += 8) {
        const segmentWords = words.slice(i, i + 8);
        const segmentText = segmentWords.join(' ');
        const duration = segmentWords.length * 0.6;
        
        segments.push({
          start: currentTime,
          end: currentTime + duration,
          text: segmentText
        });
        
        currentTime += duration + 0.2;
      }
      
      return segments;
    },

    async analyzeViralPotential(transcript, metadata, platform) {
      await this.simulateProcessing(1500, 'Running AI analysis...');
      
      const baseScore = 75 + Math.floor(Math.random() * 20);
      const platformBonus = this.getPlatformBonus(platform);
      
      return {
        overallScore: Math.min(99, baseScore + platformBonus),
        hookScore: baseScore + Math.floor(Math.random() * 15) - 5,
        engagementScore: baseScore + Math.floor(Math.random() * 12) - 3,
        shareabilityScore: baseScore + Math.floor(Math.random() * 18) - 7,
        trendingScore: baseScore + Math.floor(Math.random() * 22) - 10,
        contentQuality: baseScore + Math.floor(Math.random() * 10) - 2,
        bestMoments: this.generateBestMoments(transcript),
        improvements: this.generateImprovements(platform),
        viralFactors: this.generateViralFactors(),
        competitorAnalysis: this.generateCompetitorData(),
        predictedReach: this.generateReachPrediction(baseScore),
        platformOptimization: this.generatePlatformOptimization(platform, baseScore)
      };
    },

    getPlatformBonus(platform) {
      const bonuses = { tiktok: 8, youtube: 6, instagram: 7, twitter: 5 };
      return bonuses[platform] || 5;
    },

    generateBestMoments(transcript) {
      const moments = [
        {
          startTime: 0,
          endTime: 15,
          score: 95,
          reason: "Perfect hook that grabs attention with trending topic and emotional trigger",
          title: "🔥 Viral Opening Hook",
          tags: ["attention-grabbing", "trending", "emotional"],
          predictedViews: "2.1M"
        },
        {
          startTime: 15,
          endTime: 40,
          score: 88,
          reason: "High-value educational content with clear explanation and visual appeal",
          title: "💡 Educational Gold Mine",
          tags: ["educational", "valuable", "clear"],
          predictedViews: "1.8M"
        },
        {
          startTime: 40,
          endTime: 60,
          score: 92,
          reason: "Strong call-to-action with cliffhanger that drives engagement",
          title: "✨ Engagement Driver",
          tags: ["call-to-action", "cliffhanger", "engaging"],
          predictedViews: "2.3M"
        }
      ];

      return moments.slice(0, 2 + Math.floor(Math.random() * 2));
    },

    generateImprovements(platform) {
      const improvements = {
        tiktok: ["Add trending hashtags", "Use popular sounds", "Include text overlays", "Optimize for vertical viewing"],
        youtube: ["Add engaging thumbnail", "Include clear CTA", "Optimize title for SEO", "Add end screens"],
        instagram: ["Use trending audio", "Add story stickers", "Include location tags", "Optimize for Reels"],
        twitter: ["Add compelling thread", "Use trending hashtags", "Include poll/question", "Optimize timing"]
      };

      return improvements[platform] || improvements.tiktok;
    },

    generateViralFactors() {
      const factors = [
        "Strong opening hook",
        "Educational value",
        "Entertainment factor", 
        "Emotional connection",
        "Share-worthy moments",
        "Trending topic relevance",
        "Clear storytelling",
        "Visual appeal",
        "Audio quality",
        "Perfect timing"
      ];

      return factors.slice(0, 4 + Math.floor(Math.random() * 3));
    },

    generateCompetitorData() {
      return {
        similarContent: Math.floor(Math.random() * 500) + 100,
        avgViews: `${(Math.random() * 2 + 0.5).toFixed(1)}M`,
        topPerformer: `${(Math.random() * 5 + 2).toFixed(1)}M views`,
        competitionLevel: ["Low", "Medium", "High"][Math.floor(Math.random() * 3)]
      };
    },

    generateReachPrediction(baseScore) {
      const multiplier = baseScore / 100;
      return {
        organic: `${(Math.random() * 1000 * multiplier + 500).toFixed(0)}K`,
        withAds: `${(Math.random() * 5000 * multiplier + 2000).toFixed(0)}K`,
        totalEngagement: `${(Math.random() * 100 * multiplier + 50).toFixed(0)}K`,
        shares: `${(Math.random() * 50 * multiplier + 20).toFixed(0)}K`
      };
    },

    generatePlatformOptimization(platform, baseScore) {
      return {
        [platform]: {
          score: Math.min(99, baseScore + 5),
          suggestions: [
            `Perfect for ${platform} algorithm`,
            `Matches ${platform} best practices`,
            `Optimized posting time detected`,
            `Trending format identified`
          ]
        }
      };
    },

    async generateViralClips(videoFile, options) {
      await this.simulateProcessing(3000, 'Creating viral clips...');
      
      const videoUrl = URL.createObjectURL(videoFile);
      const clipCount = 2 + Math.floor(Math.random() * 2);
      const clips = [];

      for (let i = 0; i < clipCount; i++) {
        clips.push({
          id: `clip_${Date.now()}_${i}`,
          title: this.generateClipTitle(i),
          score: 85 + Math.floor(Math.random() * 14),
          duration: 15 + Math.floor(Math.random() * 30),
          startTime: i * 25,
          endTime: (i * 25) + 30,
          url: videoUrl,
          thumbnail: this.generateThumbnail(i),
          transcript: this.generateClipTranscript(i),
          viralFactors: this.generateViralFactors().slice(0, 3),
          improvements: this.generateImprovements(options.platform).slice(0, 2),
          reason: this.generateClipReason(i),
          engagement: this.generateEngagementStats(),
          platform: options.platform || 'tiktok',
          tags: this.generateTags(i),
          mood: this.generateMood(i),
          difficulty: this.generateDifficulty()
        });
      }

      return { 
        clips, 
        processingTime: 3000,
        totalScore: Math.round(clips.reduce((sum, clip) => sum + clip.score, 0) / clips.length),
        recommendations: this.generateRecommendations(clips)
      };
    },

    generateClipTitle(index) {
      const titles = [
        "🔥 Perfect Viral Hook",
        "💡 Mind-Blowing Insight", 
        "✨ Engagement Explosion",
        "🎯 Conversion Masterpiece",
        "⚡ Lightning Fast Impact",
        "🌟 Trending Gold Mine"
      ];
      return titles[index] || titles[Math.floor(Math.random() * titles.length)];
    },

    generateThumbnail(index) {
      const colors = ['8b5cf6', 'ef4444', '10b981', 'f59e0b', '6366f1', 'ec4899'];
      const color = colors[index] || colors[Math.floor(Math.random() * colors.length)];
      return `https://via.placeholder.com/400x600/${color}/ffffff?text=🎬+Clip+${index + 1}`;
    },

    generateClipTranscript(index) {
      const transcripts = [
        "This is the moment that changes everything. Watch what happens next...",
        "The secret technique that top creators don't want you to know about...",
        "Here's the exact strategy that generated over 10 million views...",
        "The one mistake that's killing your content performance..."
      ];
      return transcripts[index] || transcripts[Math.floor(Math.random() * transcripts.length)];
    },

    generateClipReason(index) {
      const reasons = [
        "Perfect hook that stops the scroll and demands attention",
        "High-value content that viewers want to save and share",
        "Emotional trigger that creates strong viewer connection",
        "Educational moment that provides real actionable value"
      ];
      return reasons[index] || reasons[Math.floor(Math.random() * reasons.length)];
    },

    generateEngagementStats() {
      return {
        views: `${(Math.random() * 3 + 0.5).toFixed(1)}M`,
        likes: `${(Math.random() * 200 + 50).toFixed(0)}K`,
        shares: `${(Math.random() * 50 + 10).toFixed(0)}K`,
        comments: `${(Math.random() * 30 + 5).toFixed(0)}K`,
        saves: `${(Math.random() * 100 + 20).toFixed(0)}K`
      };
    },

    generateTags(index) {
      const allTags = ["viral", "trending", "educational", "entertaining", "motivational", "funny", "inspiring", "tips", "tricks", "secrets"];
      return allTags.sort(() => 0.5 - Math.random()).slice(0, 3 + Math.floor(Math.random() * 2));
    },

    generateMood(index) {
      const moods = ["energetic", "calm", "exciting", "professional", "fun", "serious"];
      return moods[Math.floor(Math.random() * moods.length)];
    },

    generateDifficulty() {
      return ["Easy", "Medium", "Advanced"][Math.floor(Math.random() * 3)];
    },

    generateRecommendations(clips) {
      return [
        "Post during peak hours (7-9 PM EST)",
        "Use trending hashtags for maximum reach",
        "Engage with comments in first 30 minutes",
        "Cross-post to all platforms for maximum impact",
        "Create series from best performing clips"
      ];
    },

    async simulateProcessing(duration, message) {
      return new Promise(resolve => {
        if (message) {
          console.log(`🔄 ${message}`);
        }
        setTimeout(resolve, duration);
      });
    }
  };

  // Enhanced File Processing
  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(e.type === "dragenter" || e.type === "dragover");
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    const files = Array.from(e.dataTransfer.files);
    const videoFile = files.find(file => file.type.startsWith('video/'));
    
    if (videoFile) {
      processVideoFile(videoFile);
    } else {
      showNotification('Please drop a video file', 'error');
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      processVideoFile(file);
    }
  };

  const processVideoFile = async (file) => {
    // Validation
    const maxSize = 2 * 1024 * 1024 * 1024; // 2GB
    if (file.size > maxSize) {
      showNotification('File too large. Maximum 2GB allowed.', 'error');
      return;
    }

    if (!file.type.startsWith('video/')) {
      showNotification('Please upload a video file', 'error');
      return;
    }

    setCurrentVideo(file);
    setVideoPreview(URL.createObjectURL(file));
    setIsProcessing(true);
    setShowWelcome(false);

    try {
      // Multi-step processing with progress updates
      const steps = [
        { progress: 10, step: 'Analyzing video structure...' },
        { progress: 25, step: 'Extracting audio features...' },
        { progress: 40, step: 'Generating AI transcript...' },
        { progress: 60, step: 'Analyzing viral potential...' },
        { progress: 80, step: 'Creating optimized clips...' },
        { progress: 95, step: 'Finalizing results...' }
      ];

      for (const { progress, step } of steps) {
        setProcessingProgress(progress);
        setProcessingStep(step);
        await new Promise(resolve => setTimeout(resolve, 800));
      }

      // Get video metadata
      const metadata = await getVideoMetadata(file);
      
      // Generate transcript
      const transcriptData = await mockApiService.generateTranscript(file);
      setTranscript(transcriptData.text);
      
      // Analyze viral potential
      const analysis = await mockApiService.analyzeViralPotential(
        transcriptData.text, 
        metadata, 
        selectedPreset
      );
      setViralAnalysis(analysis);
      
      // Generate clips
      const result = await mockApiService.generateViralClips(file, {
        metadata,
        platform: selectedPreset,
        preset: presets[selectedPreset]
      });
      
      setClips(result.clips);
      setProcessingProgress(100);
      setProcessingStep('Complete! 🎉');
      
      setTimeout(() => {
        setIsProcessing(false);
        setProcessingStep('');
        setProcessingProgress(0);
        showNotification(`✨ Generated ${result.clips.length} viral clips with ${result.totalScore}% average score!`, 'success', 6000);
      }, 1000);

    } catch (error) {
      console.error('Processing error:', error);
      setIsProcessing(false);
      setProcessingStep('');
      setProcessingProgress(0);
      showNotification(`Error: ${error.message}`, 'error');
    }
  };

  // Enhanced video metadata extraction
  const getVideoMetadata = (file) => {
    return new Promise((resolve) => {
      const video = document.createElement('video');
      video.onloadedmetadata = () => {
        resolve({
          duration: video.duration,
          width: video.videoWidth,
          height: video.videoHeight,
          aspectRatio: video.videoWidth / video.videoHeight,
          size: file.size,
          name: file.name,
          type: file.type,
          isVertical: video.videoHeight > video.videoWidth,
          isHorizontal: video.videoWidth > video.videoHeight,
          quality: video.videoWidth >= 1920 ? '4K/HD' : video.videoWidth >= 1280 ? 'HD' : 'SD'
        });
        URL.revokeObjectURL(video.src);
      };
      video.src = URL.createObjectURL(file);
    });
  };

  // URL Processing
  const processUrl = async () => {
    if (!videoUrl.trim()) {
      showNotification('Please enter a valid URL', 'error');
      return;
    }
    
    setIsProcessing(true);
    setProcessingStep('Downloading from URL...');
    setProcessingProgress(20);

    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      showNotification('🚧 URL processing coming soon! Currently in development.', 'info', 5000);
    } catch (error) {
      showNotification(`Error: ${error.message}`, 'error');
    } finally {
      setIsProcessing(false);
      setProcessingStep('');
      setProcessingProgress(0);
    }
  };

  // Enhanced download functionality
  const downloadClip = async (clip) => {
    try {
      showNotification(`📥 Downloading ${clip.title}...`, 'info', 2000);
      
      const response = await fetch(clip.url);
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = `${clip.title.replace(/[^a-zA-Z0-9]/g, '_')}_${clip.platform}.mp4`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      showNotification(`✅ ${clip.title} downloaded successfully!`, 'success');
    } catch (error) {
      showNotification('Download failed. Please try again.', 'error');
    }
  };

  // Advanced sharing functionality
  const shareClip = async (clip) => {
    const shareData = {
      title: `🔥 Viral Clip: ${clip.title}`,
      text: `Check out this ${clip.score}% viral potential clip! Generated with ViralClips AI 🎬\n\n#ViralContent #AI #ContentCreation`,
      url: window.location.href
    };

    if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
      try {
        await navigator.share(shareData);
        showNotification('📱 Shared successfully!', 'success');
      } catch (error) {
        if (error.name !== 'AbortError') {
          fallbackShare(shareData);
        }
      }
    } else {
      fallbackShare(shareData);
    }
  };

  const fallbackShare = (shareData) => {
    const shareText = `${shareData.title}\n\n${shareData.text}\n\n🔗 ${shareData.url}`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(shareText);
      showNotification('📋 Share link copied to clipboard!', 'success');
    } else {
      showNotification('📱 Share manually: Copy current URL', 'info');
    }
  };

  // API key management
  const saveApiKey = () => {
    if (apiKey.trim()) {
      if (typeof window !== 'undefined') {
        localStorage.setItem("viral_api_key", apiKey);
      }
      showNotification("🔑 API Key saved successfully!", 'success');
      setSettingsOpen(false);
    } else {
      showNotification("Please enter a valid API key", 'error');
    }
  };

  // Batch operations
  const downloadAllClips = async () => {
    if (clips.length === 0) return;
    
    showNotification(`📦 Starting batch download of ${clips.length} clips...`, 'info');
    
    for (let i = 0; i < clips.length; i++) {
      await downloadClip(clips[i]);
      await new Promise(resolve => setTimeout(resolve, 1000)); // Prevent overwhelming
    }
    
    showNotification('🎉 All clips downloaded successfully!', 'success');
  };

  const exportAllClips = (platform) => {
    showNotification(`🚀 Export to ${platform} coming soon!`, 'info');
  };

  return (
    <div className={`min-h-screen transition-all duration-500 ${
      darkMode 
        ? 'bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900' 
        : 'bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50'
    }`}>
      
      {/* Enhanced Notification System */}
      {notification && (
        <div className={`fixed top-6 right-6 z-50 p-4 rounded-xl shadow-2xl backdrop-blur-xl border transition-all duration-500 transform ${
          notification.type === 'success' 
            ? 'bg-emerald-500/20 border-emerald-400 text-emerald-100' :
          notification.type === 'error' 
            ? 'bg-red-500/20 border-red-400 text-red-100' :
          notification.type === 'info'
            ? 'bg-blue-500/20 border-blue-400 text-blue-100' :
            'bg-purple-500/20 border-purple-400 text-purple-100'
        } animate-in slide-in-from-right`}>
          <div className="flex items-center gap-3">
            {notification.type === 'success' && <CheckCircle size={24} className="animate-pulse" />}
            {notification.type === 'error' && <AlertCircle size={24} className="animate-pulse" />}
            {notification.type === 'info' && <AlertCircle size={24} className="animate-pulse" />}
            <span className="font-medium">{notification.message}</span>
            <button onClick={() => setNotification(null)} className="ml-2 hover:scale-110 transition-transform">
              <X size={18} />
            </button>
          </div>
        </div>
      )}

      {/* Professional Header */}
      <header className={`p-6 backdrop-blur-xl border-b sticky top-0 z-40 ${
        darkMode ? 'bg-black/20 border-white/10' : 'bg-white/20 border-gray-200/50'
      }`}>
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="w-14 h-14 bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 rounded-2xl flex items-center justify-center text-3xl shadow-lg">
                🎬
              </div>
              <div className="absolute -top-1 -right-1 w-5 h-5 bg-green-400 rounded-full animate-pulse"></div>
            </div>
            <div>
              <h1 className={`text-3xl font-black ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                ViralClips AI
              </h1>
              <p className={`text-sm font-medium ${darkMode ? 'text-purple-200' : 'text-purple-600'}`}>
                Professional AI Video Editor • v2.0
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="hidden md:flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-green-500/20 to-emerald-500/20">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className={`text-sm font-medium ${darkMode ? 'text-green-300' : 'text-green-600'}`}>
                AI Ready
              </span>
            </div>
            
            <button 
              onClick={() => setDarkMode(!darkMode)}
              className={`p-3 rounded-xl transition-all hover:scale-105 ${
                darkMode 
                  ? 'bg-white/10 text-white hover:bg-white/20' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {darkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            
            <button 
              onClick={() => setSettingsOpen(!settingsOpen)}
              className={`p-3 rounded-xl transition-all hover:scale-105 ${
                darkMode 
                  ? 'bg-white/10 text-white hover:bg-white/20' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <Settings size={20} className={settingsOpen ? 'animate-spin' : ''} />
            </button>
          </div>
        </div>
      </header>

      {/* Welcome Message */}
      {showWelcome && clips.length === 0 && (
        <div className={`mx-6 mt-6 p-6 rounded-2xl backdrop-blur-xl border ${
          darkMode 
            ? 'bg-gradient-to-r from-purple-500/10 to-pink-500/10 border-purple-400/30' 
            : 'bg-gradient-to-r from-blue-500/10 to-purple-500/10 border-blue-400/30'
        }`}>
          <div className="max-w-4xl mx-auto text-center">
            <div className="text-6xl mb-4">✨</div>
            <h2 className={`text-2xl font-bold mb-3 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
              Welcome to ViralClips AI
            </h2>
            <p className={`text-lg mb-6 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              Transform your long videos into viral shorts with the power of AI. 
              Upload any video and watch the magic happen! 🚀
            </p>
            <div className="flex flex-wrap justify-center gap-4 text-sm">
              <div className="flex items-center gap-2">
                <Zap className="text-yellow-400" size={16} />
                <span>AI-Powered Analysis</span>
              </div>
              <div className="flex items-center gap-2">
                <Target className="text-green-400" size={16} />
                <span>Platform Optimization</span>
              </div>
              <div className="flex items-center gap-2">
                <Sparkles className="text-purple-400" size={16} />
                <span>Viral Prediction</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Enhanced Processing Overlay */}
      {isProcessing && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-lg z-50 flex items-center justify-center">
          <div className={`${
            darkMode ? 'bg-gray-800/95' : 'bg-white/95'
          } backdrop-blur-xl rounded-3xl p-8 max-w-md w-full mx-4 border ${
            darkMode ? 'border-white/20' : 'border-gray-200'
          } shadow-2xl`}>
            <div className="text-center">
              <div className="relative w-20 h-20 mx-auto mb-6">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full animate-pulse"></div>
                <div className="absolute inset-2 bg-white dark:bg-gray-800 rounded-full flex items-center justify-center">
                  <Loader className="w-8 h-8 text-purple-500 animate-spin" />
                </div>
              </div>
              
              <h3 className={`text-2xl font-bold mb-3 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                🤖 AI Processing Video
              </h3>
              <p className={`mb-6 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                {processingStep}
              </p>
              
              {/* Enhanced Progress Bar */}
              <div className={`w-full ${darkMode ? 'bg-gray-700' : 'bg-gray-200'} rounded-full h-4 mb-3 overflow-hidden`}>
                <div 
                  className="bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 h-4 rounded-full transition-all duration-500 relative"
                  style={{ width: `${processingProgress}%` }}
                >
                  <div className="absolute inset-0 bg-white/20 animate-pulse rounded-full"></div>
                </div>
              </div>
              
              <div className="flex justify-between items-center">
                <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  {processingProgress}% Complete
                </span>
                <span className={`text-sm font-medium ${darkMode ? 'text-purple-300' : 'text-purple-600'}`}>
                  ETA: {Math.max(1, Math.ceil((100 - processingProgress) / 10))}s
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Settings Panel */}
      {settingsOpen && (
        <div className={`mx-6 mt-6 p-6 backdrop-blur-xl border rounded-2xl ${
          darkMode 
            ? 'bg-white/5 border-white/20' 
            : 'bg-white/50 border-gray-200'
        }`}>
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center gap-3 mb-6">
              <Settings className="text-purple-400" size={24} />
              <h2 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                ⚙️ Advanced Settings
              </h2>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* API Configuration */}
              <div className="space-y-4">
                <div>
                  <label className={`block mb-3 font-medium ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                    🔑 API Key (Optional)
                  </label>
                  <input 
                    type="password"
                    className={`w-full px-4 py-3 border rounded-xl transition-all focus:outline-none focus:ring-2 focus:ring-purple-400 ${
                      darkMode 
                        ? 'bg-gray-800/50 border-gray-600 text-white placeholder-gray-400' 
                        : 'bg-white/80 border-gray-300 text-gray-800 placeholder-gray-500'
                    }`}
                    placeholder="Enter your API key for enhanced features"
                    value={apiKey} 
                    onChange={(e) => setApiKey(e.target.value)} 
                  />
                  <p className={`text-xs mt-2 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    💡 Demo mode works without API key. Add key for premium features.
                  </p>
                </div>
                
                <button 
                  onClick={saveApiKey}
                  className="w-full px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-semibold hover:from-purple-600 hover:to-pink-600 transition-all transform hover:scale-105"
                >
                  💾 Save Configuration
                </button>
              </div>
              
              {/* Platform Presets */}
              <div className="space-y-4">
                <label className={`block mb-3 font-medium ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                  🎯 Default Platform
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {Object.entries(presets).map(([key, preset]) => (
                    <button
                      key={key}
                      onClick={() => setSelectedPreset(key)}
                      className={`p-4 rounded-xl border-2 transition-all text-left hover:scale-105 ${
                        selectedPreset === key 
                          ? `border-purple-400 bg-gradient-to-r ${preset.color}/20` 
                          : darkMode
                            ? 'border-white/20 hover:border-purple-400/50 bg-white/5'
                            : 'border-gray-200 hover:border-purple-300 bg-white/50'
                      }`}
                    >
                      <div className="text-2xl mb-1">{preset.icon}</div>
                      <h3 className={`font-bold text-sm ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                        {preset.name.replace(/[🎵📺📸🐦] /, '')}
                      </h3>
                      <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        {preset.duration}s • {preset.aspectRatio}
                      </p>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="p-6 space-y-8 max-w-7xl mx-auto">
        
        {/* Enhanced Upload Section */}
        <div className={`${
          darkMode ? 'bg-white/5 border-white/20' : 'bg-white/50 border-gray-200'
        } backdrop-blur-xl rounded-2xl border p-8 shadow-lg`}>
          <div className="flex items-center gap-3 mb-6">
            <Upload className="text-purple-400" size={28} />
            <h2 className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
              📤 Upload Your Video
            </h2>
          </div>
          
          {/* Platform Selection */}
          <div className="mb-8">
            <h3 className={`text-lg font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
              🎯 Choose Your Platform
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {Object.entries(presets).map(([key, preset]) => (
                <button
                  key={key}
                  onClick={() => setSelectedPreset(key)}
                  className={`group p-6 rounded-2xl border-2 transition-all duration-300 text-left hover:scale-105 hover:shadow-xl ${
                    selectedPreset === key 
                      ? `border-purple-400 bg-gradient-to-br ${preset.color}/20 shadow-lg` 
                      : darkMode
                        ? 'border-white/20 hover:border-purple-400/50 bg-white/5'
                        : 'border-gray-200 hover:border-purple-300 bg-white/50'
                  }`}
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className={`text-3xl group-hover:scale-110 transition-transform`}>
                      {preset.icon}
                    </div>
                    <div>
                      <h3 className={`font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                        {preset.name}
                      </h3>
                      <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        {preset.specs}
                      </p>
                    </div>
                  </div>
                  
                  <p className={`text-sm mb-3 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    {preset.description}
                  </p>
                  
                  <div className="flex flex-wrap gap-2">
                    {preset.features.slice(0, 2).map(feature => (
                      <span key={feature} className={`px-3 py-1 rounded-full text-xs font-medium ${
                        selectedPreset === key
                          ? 'bg-purple-400/30 text-purple-200' 
                          : darkMode 
                            ? 'bg-gray-700 text-gray-300' 
                            : 'bg-gray-200 text-gray-600'
                      }`}>
                        {feature}
                      </span>
                    ))}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* File Upload Area */}
          <input 
            type="file" 
            accept="video/*" 
            ref={fileInputRef} 
            onChange={handleFileUpload} 
            className="hidden" 
          />
          
          <div className="space-y-6">
            {/* Main Upload Button */}
            <button 
              onClick={() => fileInputRef.current?.click()}
              disabled={isProcessing}
              className="w-full p-8 bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 text-white rounded-2xl font-bold text-lg hover:from-purple-600 hover:via-pink-600 hover:to-red-600 transition-all disabled:opacity-50 flex items-center justify-center gap-4 shadow-xl hover:scale-105 hover:shadow-2xl"
            >
              <Upload size={32} />
              <div>
                <div>{isProcessing ? 'Processing...' : '🚀 Upload Video File'}</div>
                <div className="text-sm opacity-90 font-normal">
                  Drag & drop or click to browse
                </div>
              </div>
            </button>

            {/* Drag & Drop Zone */}
            <div 
              className={`border-2 border-dashed rounded-2xl p-12 text-center transition-all duration-300 ${
                dragActive
                  ? darkMode
                    ? 'border-purple-400 bg-purple-500/20 scale-105'
                    : 'border-purple-500 bg-purple-50 scale-105'
                  : darkMode
                    ? 'border-white/30 hover:border-purple-400 hover:bg-white/5'
                    : 'border-gray-300 hover:border-purple-400 hover:bg-purple-50'
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <FileVideo className={`w-20 h-20 mx-auto mb-6 ${
                dragActive 
                  ? 'text-purple-400 animate-bounce' 
                  : darkMode ? 'text-purple-300' : 'text-purple-500'
              }`} />
              <h3 className={`text-2xl font-bold mb-3 ${
                darkMode ? 'text-white' : 'text-gray-800'
              }`}>
                {dragActive ? '📁 Drop Your Video Here!' : '🎬 Drag & Drop Zone'}
              </h3>
              <p className={`text-lg mb-4 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                Supports all major formats • Max 2GB
              </p>
              <div className="flex flex-wrap justify-center gap-4 text-sm">
                {['MP4', 'MOV', 'AVI', 'MKV', 'WebM'].map(format => (
                  <span key={format} className={`px-3 py-1 rounded-full ${
                    darkMode 
                      ? 'bg-gray-700 text-gray-300' 
                      : 'bg-gray-200 text-gray-600'
                  }`}>
                    {format}
                  </span>
                ))}
              </div>
            </div>

            {/* URL Input */}
            <div className="flex gap-4">
              <input 
                type="text"
                className={`flex-1 px-6 py-4 border rounded-2xl transition-all focus:outline-none focus:ring-2 focus:ring-purple-400 text-lg ${
                  darkMode 
                    ? 'bg-gray-800/50 border-gray-600 text-white placeholder-gray-400' 
                    : 'bg-white/80 border-gray-300 text-gray-800 placeholder-gray-500'
                }`}
                placeholder="🔗 Paste YouTube, TikTok, Instagram URL (Coming Soon)"
                value={videoUrl}
                onChange={(e) => setVideoUrl(e.target.value)}
                disabled={isProcessing}
              />
              <button 
                onClick={processUrl}
                disabled={isProcessing || !videoUrl.trim()}
                className="px-8 py-4 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-2xl font-semibold hover:from-blue-600 hover:to-cyan-600 transition-all disabled:opacity-50 hover:scale-105"
              >
                <Download size={24} />
              </button>
            </div>
          </div>
        </div>

        {/* Video Preview */}
        {videoPreview && (
          <div className={`${
            darkMode ? 'bg-white/5 border-white/20' : 'bg-white/50 border-gray-200'
          } backdrop-blur-xl rounded-2xl border p-6 shadow-lg`}>
            <div className="flex items-center gap-3 mb-6">
              <Play className="text-blue-400" size={24} />
              <h2 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                📹 Video Preview
              </h2>
            </div>
            <div className="aspect-video bg-black rounded-2xl overflow-hidden shadow-xl">
              <video 
                src={videoPreview}
                controls
                className="w-full h-full object-contain"
                poster="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 300'%3E%3Crect width='400' height='300' fill='%23000'/%3E%3Ctext x='50%25' y='50%25' text-anchor='middle' dy='.3em' fill='%23fff' font-family='Arial, sans-serif' font-size='20'%3E🎬 Loading Video...%3C/text%3E%3C/svg%3E"
              />
            </div>
          </div>
        )}

        {/* Viral Analysis Dashboard */}
        {viralAnalysis && (
          <div className={`${
            darkMode ? 'bg-white/5 border-white/20' : 'bg-white/50 border-gray-200'
          } backdrop-blur-xl rounded-2xl border p-8 shadow-lg`}>
            <div className="flex items-center gap-3 mb-6">
              <BarChart3 className="text-green-400" size={28} />
              <h2 className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                📊 AI Viral Analysis Dashboard
              </h2>
            </div>
            
            {/* Score Overview */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 mb-8">
              <div className="text-center p-6 rounded-2xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-400/30">
                <div className="text-4xl font-black text-purple-400 mb-2">
                  {viralAnalysis.overallScore}%
                </div>
                <div className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  Overall Score
                </div>
              </div>
              
              <div className="text-center p-6 rounded-2xl bg-gradient-to-br from-pink-500/20 to-rose-500/20 border border-pink-400/30">
                <div className="text-3xl font-bold text-pink-400 mb-2">
                  {viralAnalysis.hookScore}%
                </div>
                <div className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  Hook Power
                </div>
              </div>
              
              <div className="text-center p-6 rounded-2xl bg-gradient-to-br from-blue-500/20 to-cyan-500/20 border border-blue-400/30">
                <div className="text-3xl font-bold text-blue-400 mb-2">
                  {viralAnalysis.engagementScore}%
                </div>
                <div className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  Engagement
                </div>
              </div>
              
              <div className="text-center p-6 rounded-2xl bg-gradient-to-br from-green-500/20 to-emerald-500/20 border border-green-400/30">
                <div className="text-3xl font-bold text-green-400 mb-2">
                  {viralAnalysis.shareabilityScore}%
                </div>
                <div className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  Shareability
                </div>
              </div>
              
              <div className="text-center p-6 rounded-2xl bg-gradient-to-br from-yellow-500/20 to-orange-500/20 border border-yellow-400/30">
                <div className="text-3xl font-bold text-yellow-400 mb-2">
                  {viralAnalysis.trendingScore}%
                </div>
                <div className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  Trending
                </div>
              </div>
              
              <div className="text-center p-6 rounded-2xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 border border-indigo-400/30
