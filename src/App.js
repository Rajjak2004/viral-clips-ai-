import React, { useState, useRef, useEffect } from 'react';
import { 
  Upload, Video, Scissors, Download, Play, Pause, Settings, 
  Zap, FileVideo, Camera, Edit3, Share2, Crown, Star,
  Clock, TrendingUp, AlertCircle, CheckCircle, X,
  Menu, Sun, Moon, User
} from 'lucide-react';

// Mock API service (replace with real implementation)
const mockKlapApi = {
  setApiKey: (key) => {
    // Store API key
    console.log('API Key set:', key);
  },
  
  validateApiKey: async () => {
    // Simulate API validation
    await new Promise(resolve => setTimeout(resolve, 1000));
    return {
      valid: true,
      credits: 100,
      user: { email: 'user@example.com' },
      subscription: 'Pro'
    };
  },
  
  generateShorts: async (videoData, options) => {
    // Simulate video processing
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Mock response
    return {
      job_id: 'mock_job_' + Date.now(),
      status: 'completed',
      clips: [
        {
          id: 1,
          title: 'Viral Moment #1',
          duration: 30,
          score: 85,
          url: 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4',
          thumbnail: 'https://via.placeholder.com/480x270/6366f1/white?text=Clip+1',
          start_time: 10,
          end_time: 40,
          transcript: 'This is a sample transcript of the viral moment...',
          tags: ['trending', 'viral', 'popular']
        },
        {
          id: 2,
          title: 'Viral Moment #2',
          duration: 25,
          score: 92,
          url: 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4',
          thumbnail: 'https://via.placeholder.com/480x270/ec4899/white?text=Clip+2',
          start_time: 45,
          end_time: 70,
          transcript: 'Another exciting moment that will go viral...',
          tags: ['amazing', 'wow', 'share']
        },
        {
          id: 3,
          title: 'Viral Moment #3',
          duration: 35,
          score: 78,
          url: 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4',
          thumbnail: 'https://via.placeholder.com/480x270/f59e0b/white?text=Clip+3',
          start_time: 120,
          end_time: 155,
          transcript: 'The most engaging part of your video content...',
          tags: ['engaging', 'content', 'social']
        }
      ]
    };
  },
  
  getJobHistory: async (limit, offset) => {
    return {
      jobs: [
        {
          id: 'job_1',
          title: 'My Video Project',
          status: 'completed',
          created_at: new Date().toISOString(),
          clips_count: 3
        }
      ]
    };
  },
  
  downloadVideo: async (url, filename) => {
    // Simulate download
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
};

// Utility functions
const utils = {
  formatDuration: (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  },
  
  formatFileSize: (bytes) => {
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    if (bytes === 0) return '0 Bytes';
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
  },
  
  validateVideoFile: (file) => {
    const maxSize = 2 * 1024 * 1024 * 1024; // 2GB
    const allowedTypes = ['video/mp4', 'video/mov', 'video/avi', 'video/webm'];
    
    if (!allowedTypes.includes(file.type)) {
      return { valid: false, error: 'Unsupported file type. Please upload MP4, MOV, AVI, or WebM.' };
    }
    
    if (file.size > maxSize) {
      return { valid: false, error: 'File too large. Maximum size is 2GB.' };
    }
    
    return { valid: true };
  },
  
  extractVideoUrl: (url) => {
    if (!url) return { valid: false, error: 'Please enter a URL' };
    
    // Basic URL validation
    try {
      new URL(url);
      return { valid: true, platform: 'Video' };
    } catch {
      return { valid: false, error: 'Please enter a valid URL' };
    }
  },
  
  getVideoDuration: async (file) => {
    return new Promise((resolve) => {
      const video = document.createElement('video');
      video.onloadedmetadata = () => {
        resolve(Math.floor(video.duration));
      };
      video.src = URL.createObjectURL(file);
    });
  },
  
  generateVideoThumbnail: async (file) => {
    return new Promise((resolve) => {
      const video = document.createElement('video');
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');
      
      video.onloadedmetadata = () => {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        video.currentTime = 1; // Seek to 1 second
      };
      
      video.onseeked = () => {
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL());
      };
      
      video.src = URL.createObjectURL(file);
    });
  }
};

const ViralClipsAI = () => {
  // State management
  const [currentTab, setCurrentTab] = useState('upload');
  const [uploadedVideo, setUploadedVideo] = useState(null);
  const [videoUrl, setVideoUrl] = useState('');
  const [processing, setProcessing] = useState(false);
  const [processingProgress, setProcessingProgress] = useState(0);
  const [processingStatus, setProcessingStatus] = useState('');
  const [generatedClips, setGeneratedClips] = useState([]);
  const [selectedClip, setSelectedClip] = useState(null);
  const [apiKey, setApiKey] = useState('');
  const [accountInfo, setAccountInfo] = useState(null);
  const [apiKeyValid, setApiKeyValid] = useState(false);
  const [notification, setNotification] = useState(null);
  const [darkMode, setDarkMode] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [videoMetadata, setVideoMetadata] = useState(null);
  const [dragOver, setDragOver] = useState(false);
  const [jobHistory, setJobHistory] = useState([]);
  
  const fileInputRef = useRef(null);

  // Initialize on component mount
  useEffect(() => {
    const savedApiKey = localStorage.getItem('klap_api_key') || '';
    const savedDarkMode = localStorage.getItem('dark_mode') !== 'false';
    
    setApiKey(savedApiKey);
    setDarkMode(savedDarkMode);
    
    if (savedApiKey) {
      validateApiKey(savedApiKey);
    }
  }, []);

  // Show notification
  const showNotification = (message, type = 'info') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 5000);
  };

  // Validate API key
  const validateApiKey = async (key = apiKey) => {
    if (!key) {
      setApiKeyValid(false);
      setAccountInfo(null);
      return;
    }

    try {
      const validation = await mockKlapApi.validateApiKey();
      
      if (validation.valid) {
        setApiKeyValid(true);
        setAccountInfo(validation);
        showNotification('API key validated successfully!', 'success');
        loadJobHistory();
      } else {
        setApiKeyValid(false);
        setAccountInfo(null);
        showNotification('Invalid API key', 'error');
      }
    } catch (error) {
      setApiKeyValid(false);
      setAccountInfo(null);
      showNotification('Unable to validate API key', 'error');
    }
  };

  // Load job history
  const loadJobHistory = async () => {
    try {
      const history = await mockKlapApi.getJobHistory(10, 0);
      setJobHistory(history.jobs || []);
    } catch (error) {
      console.error('Failed to load job history:', error);
    }
  };

  // Process video
  const processVideo = async (videoFile, options = {}) => {
    if (!apiKeyValid) {
      showNotification('Please enter a valid API key in settings', 'error');
      setCurrentTab('settings');
      return;
    }

    setProcessing(true);
    setProcessingProgress(0);
    setProcessingStatus('Uploading video...');

    try {
      const videoData = videoFile ? { file: videoFile } : { url: videoUrl };
      const processingOptions = {
        clipCount: options.clipCount || 3,
        duration: options.duration || 30,
        aspectRatio: options.aspectRatio || '9:16',
        captions: options.captions !== false,
        reframe: options.reframe !== false
      };

      // Simulate processing progress
      const progressSteps = [
        { progress: 20, status: 'Analyzing video content...' },
        { progress: 40, status: 'Identifying viral moments...' },
        { progress: 60, status: 'Generating clips...' },
        { progress: 80, status: 'Adding captions and effects...' },
        { progress: 95, status: 'Finalizing clips...' }
      ];

      for (const step of progressSteps) {
        await new Promise(resolve => setTimeout(resolve, 800));
        setProcessingProgress(step.progress);
        setProcessingStatus(step.status);
      }

      const result = await mockKlapApi.generateShorts(videoData, processingOptions);

      if (result.clips && result.clips.length > 0) {
        setGeneratedClips(result.clips);
        setCurrentTab('results');
        setProcessingProgress(100);
        setProcessingStatus('Complete!');
        
        showNotification(
          `Successfully generated ${result.clips.length} viral clips!`, 
          'success'
        );

        if (apiKeyValid) {
          validateApiKey();
        }
      } else {
        throw new Error('No clips were generated from your video');
      }

    } catch (error) {
      console.error('Processing failed:', error);
      showNotification('Video processing failed. Please try again.', 'error');
    } finally {
      setProcessing(false);
      setProcessingProgress(0);
      setProcessingStatus('');
    }
  };

  // Handle file upload
  const handleFileUpload = async (file) => {
    const validation = utils.validateVideoFile(file);
    if (!validation.valid) {
      showNotification(validation.error, 'error');
      return;
    }

    setUploadedVideo(file);
    const url = URL.createObjectURL(file);
    setVideoUrl(url);

    try {
      const duration = await utils.getVideoDuration(file);
      const thumbnail = await utils.generateVideoThumbnail(file);
      
      setVideoMetadata({
        name: file.name,
        size: utils.formatFileSize(file.size),
        duration: utils.formatDuration(duration),
        thumbnail,
        durationSeconds: duration
      });
      
      showNotification(`Video uploaded: ${file.name}`, 'success');
    } catch (error) {
      console.error('Error extracting video metadata:', error);
      setVideoMetadata({
        name: file.name,
        size: utils.formatFileSize(file.size),
        duration: 'Unknown',
        thumbnail: null
      });
    }
  };

  // Handle drag and drop
  const handleDragOver = (e) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    
    const files = e.dataTransfer.files;
    if (files.length > 0 && files[0].type.startsWith('video/')) {
      handleFileUpload(files[0]);
    }
  };

  // Handle URL submission
  const handleUrlSubmit = () => {
    if (!videoUrl) {
      showNotification('Please enter a video URL', 'error');
      return;
    }

    const validation = utils.extractVideoUrl(videoUrl);
    if (!validation.valid) {
      showNotification(validation.error, 'error');
      return;
    }

    showNotification(`Processing ${validation.platform} video...`, 'info');
    processVideo(null, { url: videoUrl });
  };

  // Save API key
  const saveApiKey = () => {
    if (!apiKey.trim()) {
      showNotification('Please enter a valid API key', 'error');
      return;
    }

    mockKlapApi.setApiKey(apiKey);
    localStorage.setItem('klap_api_key', apiKey);
    validateApiKey(apiKey);
  };

  // Download clip
  const downloadClip = async (clip) => {
    if (!clip.url) {
      showNotification('Download URL not available', 'error');
      return;
    }

    try {
      showNotification(`Downloading ${clip.title}...`, 'info');
      await mockKlapApi.downloadVideo(clip.url, `${clip.title.replace(/[^a-z0-9]/gi, '_')}.mp4`);
      showNotification('Download completed!', 'success');
    } catch (error) {
      console.error('Download failed:', error);
      showNotification('Download failed. Please try again.', 'error');
    }
  };

  // Toggle dark mode
  const toggleDarkMode = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    localStorage.setItem('dark_mode', newDarkMode.toString());
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      darkMode 
        ? 'bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900' 
        : 'bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50'
    }`}>
      {/* Notification */}
      {notification && (
        <div className="fixed top-4 right-4 z-50 animate-pulse-slow">
          <div className={`p-4 rounded-lg shadow-lg flex items-center space-x-2 max-w-md ${
            notification.type === 'success' ? 'bg-green-500' :
            notification.type === 'error' ? 'bg-red-500' : 'bg-blue-500'
          } text-white`}>
            {notification.type === 'success' && <CheckCircle className="w-5 h-5 flex-shrink-0" />}
            {notification.type === 'error' && <AlertCircle className="w-5 h-5 flex-shrink-0" />}
            <span className="text-sm">{notification.message}</span>
            <button onClick={() => setNotification(null)}>
              <X className="w-4 h-4 hover:text-gray-300" />
            </button>
          </div>
        </div>
      )}

      {/* Header */}
      <header className={`backdrop-blur-lg border-b transition-colors ${
        darkMode ? 'bg-black/20 border-white/10' : 'bg-white/20 border-gray-200/50'
      }`}>
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                <Video className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                  ViralClips AI
                </h1>
                <p className={`text-sm ${darkMode ? 'text-purple-200' : 'text-purple-600'}`}>
                  AI-Powered Video Editing
                </p>
              </div>
            </div>
            
            <div className="hidden md:flex items-center space-x-4">
              {/* API Status Indicator */}
              <div className={`flex items-center space-x-2 px-3 py-1 rounded-lg ${
                apiKeyValid 
                  ? 'bg-green-500/20 text-green-400' 
                  : 'bg-red-500/20 text-red-400'
              }`}>
                <div className={`w-2 h-2 rounded-full ${
                  apiKeyValid ? 'bg-green-400' : 'bg-red-400'
                }`}></div>
                <span className="text-xs font-medium">
                  {apiKeyValid ? 'Connected' : 'Not Connected'}
                </span>
              </div>

              {/* Account Info */}
              {accountInfo && (
                <div className={`text-right ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                  <div className="font-semibold text-sm">
                    {accountInfo.credits ? `${accountInfo.credits} credits` : 'Pro'}
                  </div>
                  <div className="text-xs text-green-400 flex items-center">
                    <User className="w-3 h-3 mr-1" />
                    {accountInfo.user?.email || 'Connected'}
                  </div>
                </div>
              )}
              
              <button
                onClick={toggleDarkMode}
                className={`p-2 rounded-lg transition-all ${
                  darkMode ? 'bg-white/10 text-white hover:bg-white/20' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>
            </div>

            {/* Mobile menu button */}
            <button
              className="md:hidden p-2 rounded-lg"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <Menu className={`w-6 h-6 ${darkMode ? 'text-white' : 'text-gray-800'}`} />
            </button>
          </div>

          {/* Mobile menu */}
          {mobileMenuOpen && (
            <div className="md:hidden mt-4 pb-4 border-t border-white/10">
              <div className="flex items-center justify-between mt-4">
                <div className={`flex items-center space-x-2 px-3 py-1 rounded-lg ${
                  apiKeyValid 
                    ? 'bg-green-500/20 text-green-400' 
                    : 'bg-red-500/20 text-red-400'
                }`}>
                  <div className={`w-2 h-2 rounded-full ${
                    apiKeyValid ? 'bg-green-400' : 'bg-red-400'
                  }`}></div>
                  <span className="text-xs font-medium">
                    {apiKeyValid ? 'API Connected' : 'API Not Connected'}
                  </span>
                </div>
                
                <button
                  onClick={toggleDarkMode}
                  className={`p-2 rounded-lg transition-all ${
                    darkMode ? 'bg-white/10 text-white' : 'bg-gray-100 text-gray-600'
                  }`}
                >
                  {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                </button>
              </div>
            </div>
          )}
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Navigation Tabs */}
        <div className={`flex space-x-1 p-1 rounded-xl mb-8 backdrop-blur-lg ${
          darkMode ? 'bg-black/20' : 'bg-white/20'
        }`}>
          {[
            { id: 'upload', label: 'Upload Video', icon: Upload },
            { id: 'settings', label: 'Settings', icon: Settings },
            { id: 'results', label: 'Generated Clips', icon: Scissors },
            { id: 'history', label: 'History', icon: Clock }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setCurrentTab(tab.id)}
              className={`flex items-center space-x-2 px-4 py-3 rounded-lg font-medium transition-all ${
                currentTab === tab.id
                  ? darkMode 
                    ? 'bg-white text-purple-900 shadow-lg'
                    : 'bg-purple-600 text-white shadow-lg'
                  : darkMode
                    ? 'text-white hover:bg-white/10'
                    : 'text-gray-600 hover:bg-white/10'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              <span className="hidden sm:inline text-sm">{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Upload Tab */}
        {currentTab === 'upload' && (
          <div className="space-y-8">
            <div className="text-center">
              <h2 className={`text-4xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                Transform Your Videos with AI
              </h2>
              <p className={`text-xl mb-8 ${darkMode ? 'text-purple-200' : 'text-purple-600'}`}>
                Upload long videos and get viral shorts automatically
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {/* File Upload */}
              <div className={`backdrop-blur-lg rounded-2xl p-8 border transition-all ${
                darkMode 
          
