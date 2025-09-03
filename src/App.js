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

  // Mock API Service for demo purposes
  const mockApiService = {
    async generateViralClips(videoFile, options) {
      // Simulate processing time
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      const videoUrl = URL.createObjectURL(videoFile);
      const clipCount = 2 + Math.floor(Math.random() * 2);
      const clips = [];

      for (let i = 0; i < clipCount; i++) {
        clips.push({
          id: `clip_${Date.now()}_${i}`,
          title: `🔥 Viral Clip ${i + 1}`,
          score: 85 + Math.floor(Math.random() * 14),
          duration: 15 + Math.floor(Math.random() * 30),
          startTime: i * 25,
          endTime: (i * 25) + 30,
          url: videoUrl,
          thumbnail: `https://via.placeholder.com/400x600/8b5cf6/ffffff?text=🎬+Clip+${i + 1}`,
          transcript: `This is an amazing viral moment from your video...`,
          platform: options.platform || 'tiktok',
        });
      }

      return { 
        clips, 
        processingTime: 3000,
        totalScore: Math.round(clips.reduce((sum, clip) => sum + clip.score, 0) / clips.length)
      };
    }
  };

  // File Processing
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

      // Generate clips
      const result = await mockApiService.generateViralClips(file, {
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
        showNotification(`✨ Generated ${result.clips.length} viral clips!`, 'success', 6000);
      }, 1000);

    } catch (error) {
      console.error('Processing error:', error);
      setIsProcessing(false);
      setProcessingStep('');
      setProcessingProgress(0);
      showNotification(`Error: ${error.message}`, 'error');
    }
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

  // Download functionality
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

  // Share functionality
  const shareClip = async (clip) => {
    const shareData = {
      title: `🔥 Viral Clip: ${clip.title}`,
      text: `Check out this ${clip.score}% viral potential clip!`,
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

      {/* Processing Overlay */}
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
              
              <div className={`w-full ${darkMode ? 'bg-gray-700' : 'bg-gray-200'} rounded-full h-4 mb-3 overflow-hidden`}>
                <div 
                  className="bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 h-4 rounded-full transition-all duration-500"
                  style={{ width: `${processingProgress}%` }}
                ></div>
              </div>
              
              <div className="flex justify-between items-center">
                <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  {processingProgress}% Complete
                </span>
              </div>
            </div>
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

      {/* Settings Panel */}
      {settingsOpen && (
        <div className={`mx-6 mt-6 p-6 backdrop-blur-xl border rounded-2xl ${
          darkMode 
            ? 'bg-white/5 border-white/20' 
            : 'bg-white/50 border-gray-200'
        }`}>
          <div className="max-w-4xl mx-auto">
            <h2 className={`text-2xl font-bold mb-6 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
              Settings
            </h2>
            
            <div className="space-y-4">
              <div>
                <label className={`block mb-3 font-medium ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                  API Key (Optional)
                </label>
                <input 
                  type="password"
                  className={`w-full px-4 py-3 border rounded-xl transition-all focus:outline-none focus:ring-2 focus:ring-purple-400 ${
                    darkMode 
                      ? 'bg-gray-800/50 border-gray-600 text-white placeholder-gray-400' 
                      : 'bg-white/80 border-gray-300 text-gray-800 placeholder-gray-500'
                  }`}
                  placeholder="Enter your API key"
                  value={apiKey} 
                  onChange={(e) => setApiKey(e.target.value)} 
                />
              </div>
              
              <button 
                onClick={saveApiKey}
                className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-semibold hover:from-purple-600 hover:to-pink-600 transition-all"
              >
                Save Configuration
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="p-6 space-y-8 max-w-7xl mx-auto">
        
        {/* Upload Section */}
        <div className={`${
          darkMode ? 'bg-white/5 border-white/20' : 'bg-white/50 border-gray-200'
        } backdrop-blur-xl rounded-2xl border p-8 shadow-lg`}>
          <div className="flex items-center gap-3 mb-6">
            <Upload className="text-purple-400" size={28} />
            <h2 className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
              Upload Your Video
            </h2>
          </div>
          
          {/* Platform Selection */}
          <div className="mb-8">
            <h3 className={`text-lg font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
              Choose Your Platform
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
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
                  <div className="text-2xl mb-2">{preset.icon}</div>
                  <h3 className={`font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                    {preset.name}
                  </h3>
                  <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    {preset.specs}
                  </p>
                </button>
              ))}
            </div>
          </div>

          <input 
            type="file" 
            accept="video/*" 
            ref={fileInputRef} 
            onChange={handleFileUpload} 
            className="hidden" 
          />
          
          <div className="space-y-6">
            {/* Upload Button */}
            <button 
              onClick={() => fileInputRef.current?.click()}
              disabled={isProcessing}
              className="w-full p-8 bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 text-white rounded-2xl font-bold text-lg hover:from-purple-600 hover:via-pink-600 hover:to-red-600 transition-all disabled:opacity-50 flex items-center justify-center gap-4"
            >
              <Upload size={32} />
              <div>
                <div>{isProcessing ? 'Processing...' : 'Upload Video File'}</div>
                <div className="text-sm opacity-90 font-normal">
                  Drag & drop or click to browse
                </div>
              </div>
            </button>

            {/* Drag & Drop Zone */}
            <div 
              className={`border-2 border-dashed rounded-2xl p-12 text-center transition-all ${
                dragActive
                  ? darkMode
                    ? 'border-purple-400 bg-purple-500/20'
                    : 'border-purple-500 bg-purple-50'
                  : darkMode
                    ? 'border-white/30 hover:border-purple-400'
                    : 'border-gray-300 hover:border-purple-400'
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
                {dragActive ? 'Drop Your Video Here!' : 'Drag & Drop Zone'}
              </h3>
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
                placeholder="Paste YouTube, TikTok, Instagram URL"
                value={videoUrl}
                onChange={(e) => setVideoUrl(e.target.value)}
                disabled={isProcessing}
              />
              <button 
                onClick={processUrl}
                disabled={isProcessing || !videoUrl.trim()}
                className="px-8 py-4 bg-gradient-to-r from-blue-500 to-cyan-500
