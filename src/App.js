import React, { useState, useRef, useEffect } from 'react';
import { 
  Upload, Video, Scissors, Download, Play, Settings, 
  Zap, FileVideo, Camera, Share2, Star,
  Clock, AlertCircle, CheckCircle, X, Menu, Sun, Moon, User
} from 'lucide-react';

const mockApi = {
  apiKey: '',
  setApiKey: function(key) {
    this.apiKey = key;
    localStorage.setItem('klap_api_key', key);
  },
  getApiKey: function() {
    return localStorage.getItem('klap_api_key') || '';
  },
  generateShorts: async function(videoData, options = {}) {
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    return {
      clips: [
        {
          id: 1,
          title: "Most Viral Moment",
          duration: 15,
          score: 95,
          url: "https://example.com/clip1.mp4",
          thumbnail: "https://via.placeholder.com/400x600/8b5cf6/ffffff?text=Clip+1",
          transcript: "This is the most engaging part of your video with great content...",
          tags: ["viral", "trending", "engaging"]
        },
        {
          id: 2,
          title: "Perfect Hook", 
          duration: 12,
          score: 88,
          url: "https://example.com/clip2.mp4",
          thumbnail: "https://via.placeholder.com/400x600/ec4899/ffffff?text=Clip+2",
          transcript: "An amazing hook that captures attention immediately...",
          tags: ["hook", "attention", "trending"]
        },
        {
          id: 3,
          title: "Powerful Ending",
          duration: 18,
          score: 82,
          url: "https://example.com/clip3.mp4", 
          thumbnail: "https://via.placeholder.com/400x600/f59e0b/ffffff?text=Clip+3",
          transcript: "A compelling conclusion that keeps viewers engaged...",
          tags: ["ending", "memorable", "powerful"]
        }
      ]
    };
  },
  validateApiKey: async function() {
    if (!this.apiKey) return { valid: false, error: 'No API key provided' };
    
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    return {
      valid: this.apiKey.length > 5,
      user: { email: 'demo@example.com' },
      credits: 10
    };
  }
};

const formatDuration = (seconds) => {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return mins + ':' + secs.toString().padStart(2, '0');
};

const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

const validateVideoFile = (file) => {
  const validTypes = ['video/mp4', 'video/mov', 'video/avi', 'video/mkv', 'video/webm'];
  const maxSize = 2 * 1024 * 1024 * 1024;

  if (!validTypes.includes(file.type)) {
    return {
      valid: false,
      error: 'Invalid file type. Please upload MP4, MOV, AVI, MKV, or WebM files.'
    };
  }

  if (file.size > maxSize) {
    return {
      valid: false,
      error: 'File size too large. Maximum size is 2GB.'
    };
  }

  return { valid: true };
};

const ViralClipsAI = () => {
  const [currentTab, setCurrentTab] = useState('upload');
  const [uploadedVideo, setUploadedVideo] = useState(null);
  const [videoUrl, setVideoUrl] = useState('');
  const [processing, setProcessing] = useState(false);
  const [processingProgress, setProcessingProgress] = useState(0);
  const [generatedClips, setGeneratedClips] = useState([]);
  const [selectedClip, setSelectedClip] = useState(null);
  const [apiKey, setApiKey] = useState('');
  const [apiKeyValid, setApiKeyValid] = useState(false);
  const [accountInfo, setAccountInfo] = useState(null);
  const [notification, setNotification] = useState(null);
  const [darkMode, setDarkMode] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [videoMetadata, setVideoMetadata] = useState(null);
  const [dragOver, setDragOver] = useState(false);
  
  const fileInputRef = useRef(null);

  useEffect(() => {
    const savedApiKey = mockApi.getApiKey();
    const savedDarkMode = localStorage.getItem('dark_mode') !== 'false';
    
    setApiKey(savedApiKey);
    setDarkMode(savedDarkMode);
    
    if (savedApiKey) {
      validateApiKey(savedApiKey);
    }
  }, []);

  const showNotification = (message, type = 'info') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 5000);
  };

  const validateApiKey = async (key = apiKey) => {
    if (!key) {
      setApiKeyValid(false);
      setAccountInfo(null);
      return;
    }

    try {
      mockApi.setApiKey(key);
      const validation = await mockApi.validateApiKey();
      
      if (validation.valid) {
        setApiKeyValid(true);
        setAccountInfo(validation);
        showNotification('API key validated successfully!', 'success');
      } else {
        setApiKeyValid(false);
        setAccountInfo(null);
        showNotification(validation.error || 'Invalid API key', 'error');
      }
    } catch (error) {
      setApiKeyValid(false);
      setAccountInfo(null);
      showNotification('Unable to validate API key', 'error');
    }
  };

  const processVideo = async (videoFile, options = {}) => {
    if (!apiKeyValid) {
      showNotification('Please enter a valid API key in settings', 'error');
      setCurrentTab('settings');
      return;
    }

    setProcessing(true);
    setProcessingProgress(0);

    try {
      const progressInterval = setInterval(() => {
        setProcessingProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + Math.random() * 15;
        });
      }, 500);

      const result = await mockApi.generateShorts(
        videoFile ? { file: videoFile } : { url: videoUrl },
        options
      );

      clearInterval(progressInterval);
      setProcessingProgress(100);

      if (result.clips && result.clips.length > 0) {
        setGeneratedClips(result.clips);
        setCurrentTab('results');
        showNotification('Successfully generated ' + result.clips.length + ' viral clips!', 'success');
      } else {
        throw new Error('No clips were generated from your video');
      }

    } catch (error) {
      console.error('Processing failed:', error);
      showNotification('Video processing failed. Please try again.', 'error');
    } finally {
      setProcessing(false);
      setProcessingProgress(0);
    }
  };

  const handleFileUpload = async (file) => {
    const validation = validateVideoFile(file);
    if (!validation.valid) {
      showNotification(validation.error, 'error');
      return;
    }

    setUploadedVideo(file);
    const url = URL.createObjectURL(file);
    setVideoUrl(url);

    setVideoMetadata({
      name: file.name,
      size: formatFileSize(file.size),
      duration: 'Processing...',
      thumbnail: null
    });
    
    showNotification('Video uploaded: ' + file.name, 'success');
  };

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

  const handleUrlSubmit = () => {
    if (!videoUrl) {
      showNotification('Please enter a video URL', 'error');
      return;
    }

    showNotification('Processing video URL...', 'info');
    processVideo(null, { url: videoUrl });
  };

  const saveApiKey = () => {
    if (!apiKey.trim()) {
      showNotification('Please enter a valid API key', 'error');
      return;
    }

    validateApiKey(apiKey);
  };

  const downloadClip = (clip) => {
    showNotification('Downloading ' + clip.title + '...', 'info');
    setTimeout(() => {
      showNotification('Download completed!', 'success');
    }, 1000);
  };

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
      <style>{`
        .btn-primary {
          background: linear-gradient(to right, #9333ea, #ec4899);
          color: white;
          padding: 0.75rem 1.5rem;
          border-radius: 0.5rem;
          font-weight: 600;
          transition: all 0.2s;
          display: flex;
          align-items: center;
          justify-content: center;
          border: none;
          cursor: pointer;
        }
        .btn-primary:hover {
          background: linear-gradient(to right, #7c3aed, #db2777);
        }
        .btn-primary:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
      `}</style>

      {notification && (
        <div className="fixed top-4 right-4 z-50">
          <div className={`p-4 rounded-lg shadow-lg flex items-center space-x-2 ${
            notification.type === 'success' ? 'bg-green-500' :
            notification.type === 'error' ? 'bg-red-500' : 'bg-blue-500'
          } text-white`}>
            {notification.type === 'success' && <CheckCircle className="w-5 h-5" />}
            {notification.type === 'error' && <AlertCircle className="w-5 h-5" />}
            <span>{notification.message}</span>
            <button onClick={() => setNotification(null)}>
              <X className="w-4 h-4 hover:text-gray-300" />
            </button>
          </div>
        </div>
      )}

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
                  Turn long videos into viral shorts
                </p>
              </div>
            </div>
            
            <div className="hidden md:flex items-center space-x-4">
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

              {accountInfo && (
                <div className={`text-right ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                  <div className="font-semibold text-sm">
                    {accountInfo.credits ? accountInfo.credits + ' credits' : 'Pro'}
                  </div>
                  <div className="text-xs text-green-400 flex items-center">
                    <User className="w-3 h-3 mr-1" />
                    Connected
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

            <button
              className="md:hidden p-2 rounded-lg"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <Menu className={`w-6 h-6 ${darkMode ? 'text-white' : 'text-gray-800'}`} />
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className={`flex space-x-1 p-1 rounded-xl mb-8 backdrop-blur-lg ${
          darkMode ? 'bg-black/20' : 'bg-white/20'
        }`}>
          {[
            { id: 'upload', label: 'Upload Video', icon: Upload },
            { id: 'settings', label: 'API Settings', icon: Settings },
            { id: 'results', label: 'Generated Clips', icon: Scissors }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setCurrentTab(tab.id)}
              className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-medium transition-all ${
                currentTab === tab.id
                  ? darkMode 
                    ? 'bg-white text-purple-900 shadow-lg'
                    : 'bg-purple-600 text-white shadow-lg'
                  : darkMode
                    ? 'text-white hover:bg-white/10'
                    : 'text-gray-600 hover:bg-white/10'
              }`}
            >
              <tab.icon className="w-5 h-5" />
              <span className="hidden sm:inline">{tab.label}</span>
            </button>
          ))}
        </div>

        {currentTab === 'upload' && (
          <div className="space-y-8">
            {!apiKeyValid && (
              <div className={`p-4 rounded-lg border ${
                darkMode 
                  ? 'bg-red-500/20 border-red-500/30 text-red-300' 
                  : 'bg-red-100 border-red-300 text-red-700'
              }`}>
                <div className="flex items-center space-x-2">
                  <AlertCircle className="w-5 h-5" />
                  <span>Please configure your API key in settings to start processing videos.</span>
                  <button
                    onClick={() => setCurrentTab('settings')}
                    className="ml-2 text-red-400 hover:text-red-300 underline"
                  >
                    Go to Settings
                  </button>
                </div>
              </div>
            )}

            <div className="text-center">
              <h2 className={`text-4xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                Transform Your Videos with AI
              </h2>
              <p className={`text-xl mb-8 ${darkMode ? 'text-purple-200' : 'text-purple-600'}`}>
                Upload long videos and get viral shorts automatically
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <div className={`backdrop-blur-lg rounded-2xl p-8 border transition-all ${
                darkMode 
                  ? 'bg-white/10 border-white/20' 
                  : 'bg-white/50 border-gray-200'
              }`}>
                <h3 className={`text-2xl font-semibold mb-6 flex items-center ${
                  darkMode ? 'text-white' : 'text-gray-800'
                }`}>
                  <FileVideo className="mr-3" />
                  Upload Video File
                </h3>
                
                <div
                  onClick={() => !processing && fileInputRef.current?.click()}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  className={`border-2 border-dashed rounded-xl p-12 text-center transition-all ${
                    processing 
                      ? 'opacity-50 cursor-not-allowed'
                      : 'cursor-pointer'
                  } ${
                    dragOver 
                      ? 'border-purple-400 bg-purple-400/10'
                      : darkMode
                        ? 'border-purple-400 hover:border-purple-300 hover:bg-white/5'
                        : 'border-purple-500 hover:border-purple-400 hover:bg-purple-50'
                  }`}
                >
                  <Upload className={`w-12 h-12 mx-auto mb-4 ${
                    darkMode ? 'text-purple-400' : 'text-purple-500'
                  }`} />
                  <p className={`text-lg mb-2 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                    {dragOver ? 'Drop your video here' : 'Click to upload or drag and drop'}
                  </p>
                  <p className={`${darkMode ? 'text-purple-200' : 'text-purple-600'}`}>
                    MP4, MOV, AVI, MKV up to 2GB
                  </p>
                </div>
                
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="video/*"
                  onChange={(e) => e.target.files[0] && handleFileUpload(e.target.files[0])}
                  className="hidden"
                  disabled={processing}
                />

                {videoMetadata && (
                  <div className={`mt-6 p-4 rounded-lg border ${
                    darkMode 
                      ? 'bg-green-500/20 border-green-500/30' 
                      : 'bg-green-100 border-green-300'
                  }`}>
                    <p className={`font-medium ${
                      darkMode ? 'text-green-400' : 'text-green-700'
                    }`}>
                      ✓ {videoMetadata.name}
                    </p>
                    <p className={`text-sm ${
                      darkMode ? 'text-green-300' : 'text-green-600'
                    }`}>
                      Size: {videoMetadata.size} • Duration: {videoMetadata.duration}
                    </p>
                  </div>
                )}
              </div>

              <div className={`backdrop-blur-lg rounded-2xl p-8 border transition-all ${
                darkMode 
                  ? 'bg-white/10 border-white/20' 
                  : 'bg-white/50 border-gray-200'
              }`}>
                <h3 className={`text-2xl font-semibold mb-6 flex items-center ${
                  darkMode ? 'text-white' : 'text-gray-800'
                }`}>
                  <Camera className="mr-3" />
                  Video URL
                </h3>
                
                <div className="space-y-4">
                  <div>
                    <input
                      type="url"
                      value={videoUrl}
                      onChange={(e) => setVideoUrl(e.target.value)}
                      placeholder="https://youtube.com/watch?v=..."
                      disabled={processing}
                      className={`w-full px-4 py-3 rounded-lg transition-all ${
                        darkMode 
                          ? 'bg-black/30 border border-white/20 text-white placeholder-purple-200' 
                          : 'bg-white/50 border border-gray-300 text-gray-800 placeholder-gray-500'
                      } focus:border-purple-400 focus:outline-none ${processing ? 'opacity-50' : ''}`}
                    />
                  </div>
                  
                  <button
                    onClick={handleUrlSubmit}
                    disabled={!videoUrl || processing || !apiKeyValid}
                    className="btn-primary w-full disabled:opacity-50"
                  >
                    {processing ? 'Processing...' : 'Process Video'}
                  </button>
                </div>
              </div>
            </div>

            {uploadedVideo && (
              <div className="text-center">
                <button
                  onClick={() => processVideo(uploadedVideo)}
                  disabled={processing || !apiKeyValid}
                  className="btn-primary px-12 py-4 text-lg disabled:opacity-50"
                >
                  {processing ? (
                    <div className="flex items-center space-x-2">
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      <span>Processing Video... {Math.round(processingProgress)}%</span>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-2">
                      <Zap className="w-6 h-6" />
                      <span>Generate Viral Clips</span>
                    </div>
                  )}
                </button>
                
                {processing && (
                  <div className="mt-4">
                    <div className={`w-full rounded-full h-2 ${
                      darkMode ? 'bg-gray-700' : 'bg-gray-200'
                    }`}>
                      <div 
                        className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all duration-500"
                        style={{ width: processingProgress + '%' }}
                      ></div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {currentTab === 'settings' && (
          <div className="max-w-2xl mx-auto">
            <div className={`backdrop-blur-lg rounded-2xl p-8 border ${
              darkMode 
                ? 'bg-white/10 border-white/20' 
                : 'bg-white/50 border-gray-200'
            }`}>
              <h3 className={`text-2xl font-semibold mb-6 ${
                darkMode ? 'text-white' : 'text-gray-800'
              }`}>
                API Configuration
              </h3>
              
              <div className="space-y-6">
                <div>
                  <label className={`block font-medium mb-2 ${
                    darkMode ? 'text-white' : 'text-gray-800'
                  }`}>
                    API Key {apiKeyValid && <span className="text-green-500">✓</span>}
                  </label>
                  <input
                    type="password"
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    placeholder="Enter your API key"
                    className={`w-full px-4 py-3 rounded-lg transition-all ${
                      darkMode 
                        ? 'bg-black/30 border border-white/20 text-white placeholder-purple-200' 
                        : 'bg-white/50 border border-gray-300 text-gray-800 placeholder-gray-500'
                    } focus:border-purple-400 focus:outline-none`}
                  />
                  <p className={`text-sm mt-2 ${
                    darkMode ? 'text-purple-200' : 'text-purple-600'
                  }`}>
                    Enter any text to demo the app functionality
                  </p>
                </div>
                
                <button
                  onClick={saveApiKey}
                  disabled={!apiKey.trim()}
                  className="btn-primary disabled:opacity-50"
                >
                  Save & Validate API Key
                </button>

                {accountInfo && (
                  <div className={`p-4 rounded-lg border ${
                    darkMode 
                      ? 'bg-green-500/20 border-green-500/30' 
                      : 'bg-green-100 border-green-300'
                  }`}>
                    <h4 className={`font-semibold mb-2 ${
                      darkMode ? 'text-green-300' : 'text-green-800'
                    }`}>
                      Account Information
                    </h4>
                    <div className={`text-sm space-y-1 ${
                      darkMode ? 'text-green-200' : 'text-green-700'
                    }`}>
                      {accountInfo.user?.email && (
                        <p>Email: {accountInfo.user.email}</p>
                      )}
                      {accountInfo.credits && (
                        <p>Credits: {accountInfo.credits}</p>
                      )}
                      <p>Status: Connected ✓</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {currentTab === 'results' && (
          <div>
            <div className="text-center mb-8">
              <h2 className={`text-3xl font-bold mb-4 ${
                darkMode ? 'text-white' : 'text-gray-800'
              }`}>
                Generated Viral Clips
              </h2>
              <p className={`${darkMode ? 'text-purple-200' : 'text-purple-600'}`}>
                AI has found the most engaging moments from your video
              </p>
            </div>

            {generatedClips.length > 0 ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {generatedClips.map((clip) => (
                  <div 
                    key={clip.id} 
                    className={`backdrop-blur-lg rounded-xl overflow-hidden border transition-all hover:scale-105 ${
                      darkMode 
                        ? 'bg-white/10 border-white/20 hover:border-purple-400' 
                        : 'bg-white/50 border-gray-200 hover:border-purple-500'
                    }`}
                  >
                    <div className="aspect-[9/16] bg-gray-800 relative">
                      <img
                        src={clip.thumbnail}
                        alt={clip.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <button 
                          className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/30 transition-all"
                          onClick={() => setSelectedClip(clip)}
                        <div className="aspect-[9/16] bg-gray-800 relative">
  <img
    src={clip.thumbnail}
    alt={clip.title}
    className="w-full h-full object-cover"
  />

  {/* Play Button */}
  <div className="absolute inset-0 flex items-center justify-center">
    <button
      className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/30 transition-all"
      onClick={() => setSelectedClip(clip)}
    >
      <Play className="w-8 h-8 text-white ml-1" />
    </button>
  </div>

  {/* Score Badge */}
  <div className="absolute top-4 right-4 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-semibold flex items-center">
    <Star className="w-4 h-4 mr-1" />
    {clip.score}%
  </div>

  {/* Duration */}
  <div className="absolute bottom-4 left-4 bg-black/50 text-white px-2 py-1 rounded text-sm">
    <Clock className="w-3 h-3 inline mr-1" />
    {formatDuration(clip.duration)}
  </div>
</div>   {/* ✅ উপরের div ক্লোজ করা হলো */}

<div className="p-4">
  <h3
    className={`font-semibold mb-2 ${
      darkMode ? "text-white" : "text-gray-800"
    }`}
  >
    {clip.title}
  </h3>

  {clip.transcript && (
    <p
      className={`text-sm mb-3 ${
        darkMode ? "text-purple-200" : "text-gray-600"
      }`}
    >
      {clip.transcript.substring(0, 100)}...
    </p>
  )}
</div>
