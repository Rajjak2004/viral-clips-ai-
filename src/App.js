import React, { useState, useRef, useCallback, useEffect } from 'react';
import { 
  Upload, Video, Scissors, Download, Play, Pause, Settings, 
  Zap, FileVideo, Camera, Edit3, Share2, Crown, Star,
  Clock, TrendingUp, AlertCircle, CheckCircle, X,
  Menu, Sun, Moon, Github, Twitter, Instagram, User, CreditCard
} from 'lucide-react';
import realKlapApi from './services/realKlapApi';
import { 
  formatDuration, 
  formatFileSize, 
  validateVideoFile, 
  extractVideoUrl,
  getVideoDuration,
  generateVideoThumbnail 
} from './utils/videoUtils';

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
  const processingIntervalRef = useRef(null);
  const currentJobId = useRef(null);

  // Initialize on component mount
  useEffect(() => {
    const savedApiKey = localStorage.getItem('klap_api_key') || '';
    const savedDarkMode = localStorage.getItem('dark_mode') !== 'false';
    
    setApiKey(savedApiKey);
    setDarkMode(savedDarkMode);
    realKlapApi.setApiKey(savedApiKey);
    
    if (savedApiKey) {
      validateApiKey(savedApiKey);
    }
  }, []);

  // Show notification
  const showNotification = (message, type = 'info') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 5000);
  };

  // Validate API key with Klap
  const validateApiKey = async (key = apiKey) => {
    if (!key) {
      setApiKeyValid(false);
      setAccountInfo(null);
      return;
    }

    try {
      const validation = await realKlapApi.validateApiKey();
      
      if (validation.valid) {
        setApiKeyValid(true);
        setAccountInfo(validation);
        showNotification('API key validated successfully!', 'success');
        
        // Load job history
        loadJobHistory();
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

  // Load job history
  const loadJobHistory = async () => {
    try {
      const history = await realKlapApi.getJobHistory(10, 0);
      setJobHistory(history.jobs || []);
    } catch (error) {
      console.error('Failed to load job history:', error);
    }
  };

  // Process video with real Klap API
  const processVideo = async (videoFile, options = {}) => {
    if (!apiKeyValid) {
      showNotification('Please enter a valid Klap API key in settings', 'error');
      setCurrentTab('settings');
      return;
    }

    setProcessing(true);
    setProcessingProgress(0);
    setProcessingStatus('Uploading video...');
    currentJobId.current = null;

    try {
      let result;
      
      // Prepare video data
      const videoData = videoFile ? { file: videoFile } : { url: videoUrl };
      
      // Processing options
      const processingOptions = {
        clipCount: options.clipCount || 3,
        duration: options.duration || 30,
        aspectRatio: options.aspectRatio || '9:16',
        captions: options.captions !== false,
        reframe: options.reframe !== false
      };

      setProcessingStatus('Sending to Klap AI...');
      setProcessingProgress(10);

      // Call real Klap API
      result = await realKlapApi.generateShorts(videoData, processingOptions);
      
      setProcessingProgress(30);
      setProcessingStatus('AI is analyzing your video...');

      // Handle different response types
      if (result.job_id) {
        currentJobId.current = result.job_id;
        
        if (result.status === 'processing') {
          // Wait for job completion
          setProcessingStatus('Processing video... This may take a few minutes');
          result = await realKlapApi.waitForJobCompletion(result.job_id);
        }
      }

      setProcessingProgress(90);
      setProcessingStatus('Finalizing clips...');

      // Process the results
      if (result.clips && result.clips.length > 0) {
        // Transform API response to our format
        const transformedClips = result.clips.map((clip, index) => ({
          id: clip.id || index + 1,
          title: clip.title || `Viral Moment ${index + 1}`,
          duration: clip.duration || 30,
          score: clip.score || Math.floor(Math.random() * 20) + 80, // Fallback score
          url: clip.url,
          thumbnail: clip.thumbnail || clip.preview_url,
          start_time: clip.start_time,
          end_time: clip.end_time,
          transcript: clip.transcript || clip.text,
          tags: clip.tags || []
        }));

        setGeneratedClips(transformedClips);
        setCurrentTab('results');
        setProcessingProgress(100);
        setProcessingStatus('Complete!');
        
        showNotification(
          `Successfully generated ${transformedClips.length} viral clips!`, 
          'success'
        );

        // Refresh account info to show updated credits
        if (apiKeyValid) {
          validateApiKey();
        }
      } else {
        throw new Error('No clips were generated from your video');
      }

    } catch (error) {
      console.error('Processing failed:', error);
      
      let errorMessage = 'Video processing failed. ';
      
      if (error.message.includes('API key')) {
        errorMessage += 'Please check your API key.';
        setCurrentTab('settings');
      } else if (error.message.includes('credits')) {
        errorMessage += 'You need more credits to process videos.';
      } else if (error.message.includes('timeout')) {
        errorMessage += 'Video processing took too long. Try with a shorter video.';
      } else {
        errorMessage += error.message || 'Please try again.';
      }
      
      showNotification(errorMessage, 'error');
      
    } finally {
      setProcessing(false);
      setProcessingProgress(0);
      setProcessingStatus('');
      currentJobId.current = null;
    }
  };

  // Cancel processing
  const cancelProcessing = async () => {
    if (currentJobId.current) {
      try {
        await realKlapApi.deleteJob(currentJobId.current);
        showNotification('Processing cancelled', 'info');
      } catch (error) {
        console.error('Failed to cancel job:', error);
      }
    }
    
    setProcessing(false);
    setProcessingProgress(0);
    setProcessingStatus('');
    currentJobId.current = null;
  };

  // Handle file upload with validation
  const handleFileUpload = async (file) => {
    const validation = validateVideoFile(file);
    if (!validation.valid) {
      showNotification(validation.error, 'error');
      return;
    }

    setUploadedVideo(file);
    const url = URL.createObjectURL(file);
    setVideoUrl(url);

    try {
      const duration = await getVideoDuration(file);
      const thumbnail = await generateVideoThumbnail(file);
      
      setVideoMetadata({
        name: file.name,
        size: formatFileSize(file.size),
        duration: formatDuration(duration),
        thumbnail,
        durationSeconds: duration
      });
      
      showNotification(`Video uploaded: ${file.name}`, 'success');
    } catch (error) {
      console.error('Error extracting video metadata:', error);
      setVideoMetadata({
        name: file.name,
        size: formatFileSize(file.size),
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

    const validation = extractVideoUrl(videoUrl);
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

    realKlapApi.setApiKey(apiKey);
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
      await realKlapApi.downloadVideo(clip.url, `${clip.title.replace(/[^a-z0-9]/gi, '_')}.mp4`);
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
                  Powered by Klap API
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
                    {accountInfo.credits ? `${accountInfo.credits} credits` : 'Klap Pro'}
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
            { id: 'settings', label: 'API Settings', icon: Settings },
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
            {!apiKeyValid && (
              <div className={`p-4 rounded-lg border ${
                darkMode 
                  ? 'bg-red-500/20 border-red-500/30 text-red-300' 
                  : 'bg-red-100 border-red-300 text-red-700'
              }`}>
                <div className="flex items-center space-x-2">
                  <AlertCircle className="w-5 h-5" />
                  <span>Please configure your Klap API key in settings to start processing videos.</span>
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
                Upload long videos and get viral shorts automatically with Klap AI
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {/* File Upload */}
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
                  className={`border-2 border-dashed rounded-xl p-12 text-center transition-all upload-zone ${
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
                    Supports MP4, MOV, AVI, WebM (max 2GB)
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
                  <div className={`mt-6 p-4 rounded-lg ${
                    darkMode ? 'bg-green-500/20 text-green-300' : 'bg-green-100 text-green-700'
                  }`}>
                    <div className="flex items-center space-x-3">
                      {videoMetadata.thumbnail ? (
                        <img 
                          src={videoMetadata.thumbnail} 
                          alt="Video thumbnail"
                          className="w-16 h-16 object-cover rounded-lg"
                        />
                      ) : (
                        <div className="w-16 h-16 bg-purple-500 rounded-lg flex items-center justify-center">
                          <Video className="w-8 h-8 text-white" />
                        </div>
                      )}
                      <div>
                        <p className="font-medium">{videoMetadata.name}</p>
                        <p className="text-sm opacity-75">
                          {videoMetadata.duration} • {videoMetadata.size}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {uploadedVideo && !processing && (
                  <button
                    onClick={() => processVideo(uploadedVideo)}
                    className="w-full mt-6 bg-gradient-to-r from-purple-600 to-pink-600 text-white py-4 rounded-xl font-semibold text-lg hover:from-purple-700 hover:to-pink-700 transition-all flex items-center justify-center space-x-2"
                    disabled={!apiKeyValid}
                  >
                    <Zap className="w-5 h-5" />
                    <span>Generate Viral Clips</span>
                  </button>
                )}
              </div>

              {/* URL Input */}
              <div className={`backdrop-blur-lg rounded-2xl p-8 border transition-all ${
                darkMode 
                  ? 'bg-white/10 border-white/20' 
                  : 'bg-white/50 border-gray-200'
              }`}>
                <h3 className={`text-2xl font-semibold mb-6 flex items-center ${
                  darkMode ? 'text-white' : 'text-gray-800'
                }`}>
                  <Camera className="mr-3" />
                  From URL
                </h3>
                
                <div className="space-y-4">
                  <input
                    type="url"
                    placeholder="Paste YouTube, TikTok, or video URL..."
                    value={videoUrl}
                    onChange={(e) => setVideoUrl(e.target.value)}
                    className={`w-full p-4 rounded-xl border transition-all ${
                      darkMode 
                        ? 'bg-white/10 border-white/20 text-white placeholder-purple-200' 
                        : 'bg-white border-gray-300 text-gray-800 placeholder-gray-500'
                    } focus:border-purple-500 focus:outline-none`}
                    disabled={processing}
                  />
                  
                  <button
                    onClick={handleUrlSubmit}
                    disabled={!videoUrl || processing || !apiKeyValid}
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 rounded-xl font-semibold text-lg hover:from-blue-700 hover:to-purple-700 transition-all flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Download className="w-5 h-5" />
                    <span>Process from URL</span>
                  </button>
                </div>

                <div className={`mt-6 text-sm ${darkMode ? 'text-purple-200' : 'text-purple-600'}`}>
                  <p className="font-medium mb-2">Supported platforms:</p>
                  <ul className="space-y-1 text-sm opacity-75">
                    <li>• YouTube (videos, shorts, live streams)</li>
                    <li>• TikTok (public videos)</li>
                    <li>• Instagram (reels, IGTV)</li>
                    <li>• Direct video URLs (.mp4, .mov, etc.)</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Processing Status */}
            {processing && (
              <div className={`backdrop-blur-lg rounded-2xl p-8 border ${
                darkMode ? 'bg-white/10 border-white/20' : 'bg-white/50 border-gray-200'
              }`}>
                <div className="text-center space-y-6">
                  <div className="relative">
                    <div className="w-24 h-24 mx-auto mb-6">
                      <div className="relative w-24 h-24">
                        <svg className="w-24 h-24 transform -rotate-90" viewBox="0 0 100 100">
                          <circle
                            cx="50" cy="50" r="40"
                            stroke={darkMode ? "#ffffff20" : "#e5e7eb"}
                            strokeWidth="8" fill="none"
                          />
                          <circle
                            cx="50" cy="50" r="40"
                            stroke="#8b5cf6"
                            strokeWidth="8" fill="none"
                            strokeLinecap="round"
                            strokeDasharray={`${2 * Math.PI * 40}`}
                            strokeDashoffset={`${2 * Math.PI * 40 * (1 - processingProgress / 100)}`}
                            className="transition-all duration-500"
                          />
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                            {processingProgress}%
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className={`text-2xl font-semibold mb-2 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                      Processing Your Video
                    </h3>
                    <p className={`text-lg ${darkMode ? 'text-purple-200' : 'text-purple-600'}`}>
                      {processingStatus}
                    </p>
                  </div>

                  <div className="flex items-center justify-center space-x-4">
                    <div className="flex space-x-1">
                      {[0, 1, 2].map((i) => (
                        <div
                          key={i}
                          className={`w-2 h-2 rounded-full bg-purple-500 animate-pulse`}
                          style={{ animationDelay: `${i * 0.2}s` }}
                        />
                      ))}
                    </div>
                  </div>

                  <button
                    onClick={cancelProcessing}
                    className={`px-6 py-3 rounded-lg border transition-all ${
                      darkMode 
                        ? 'border-red-500/30 text-red-400 hover:bg-red-500/20' 
                        : 'border-red-300 text-red-600 hover:bg-red-50'
                    }`}
                  >
                    Cancel Processing
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Settings Tab */}
        {currentTab === 'settings' && (
          <div className="space-y-8">
            <div className="text-center">
              <h2 className={`text-4xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                API Configuration
              </h2>
              <p className={`text-xl mb-8 ${darkMode ? 'text-purple-200' : 'text-purple-600'}`}>
                Connect your Klap API to start generating viral clips
              </p>
            </div>

            <div className={`max-w-2xl mx-auto backdrop-blur-lg rounded-2xl p-8 border ${
              darkMode ? 'bg-white/10 border-white/20' : 'bg-white/50 border-gray-200'
            }`}>
              <div className="space-y-6">
                <div>
                  <label className={`block text-sm font-medium mb-2 ${
                    darkMode ? 'text-white' : 'text-gray-700'
                  }`}>
                    Klap API Key
                  </label>
                  <div className="relative">
                    <input
                      type="password"
                      placeholder="Enter your Klap API key..."
                      value={apiKey}
                      onChange={(e) => setApiKey(e.target.value)}
                      className={`w-full p-4 pr-12 rounded-xl border transition-all ${
                        darkMode 
                          ? 'bg-white/10 border-white/20 text-white placeholder-purple-200' 
                          : 'bg-white border-gray-300 text-gray-800 placeholder-gray-500'
                      } focus:border-purple-500 focus:outline-none`}
                    />
                    {apiKeyValid && (
                      <CheckCircle className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-green-400" />
                    )}
                  </div>
                  <p className={`text-sm mt-2 ${darkMode ? 'text-purple-200' : 'text-purple-600'}`}>
                    Get your API key from{' '}
                    <a 
                      href="https://klap.app/api" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="underline hover:text-purple-400"
                    >
                      klap.app/api
                    </a>
                  </p>
                </div>

                <button
                  onClick={saveApiKey}
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-4 rounded-xl font-semibold text-lg hover:from-purple-700 hover:to-pink-700 transition-all"
                >
                  Save API Key
                </button>

                {/* Account Status */}
                {apiKeyValid && accountInfo && (
                  <div className={`p-6 rounded-xl border ${
                    darkMode 
                      ? 'bg-green-500/20 border-green-500/30' 
                      : 'bg-green-100 border-green-300'
                  }`}>
                    <div className="flex items-center space-x-3 mb-4">
                      <CheckCircle className="w-6 h-6 text-green-400" />
                      <h3 className={`text-lg font-semibold ${
                        darkMode ? 'text-green-300' : 'text-green-700'
                      }`}>
                        API Connected Successfully
                      </h3>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className={`${darkMode ? 'text-green-200' : 'text-green-600'} opacity-75`}>
                          Account Type
                        </p>
                        <p className={`font-medium ${darkMode ? 'text-green-300' : 'text-green-700'}`}>
                          {accountInfo.subscription || 'Free'}
                        </p>
                      </div>
                      <div>
                        <p className={`${darkMode ? 'text-green-200' : 'text-green-600'} opacity-75`}>
                          Credits Remaining
                        </p>
                        <p className={`font-medium ${darkMode ? 'text-green-300' : 'text-green-700'}`}>
                          {accountInfo.credits || 'Unlimited'}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* API Info */}
                <div className={`p-6 rounded-xl border ${
                  darkMode 
                    ? 'bg-blue-500/20 border-blue-500/30' 
                    : 'bg-blue-100 border-blue-300'
                }`}>
                  <h3 className={`text-lg font-semibold mb-3 ${
                    darkMode ? 'text-blue-300' : 'text-blue-700'
                  }`}>
                    About Klap API
                  </h3>
                  <ul className={`space-y-2 text-sm ${
                    darkMode ? 'text-blue-200' : 'text-blue-600'
                  }`}>
                    <li>• Generate viral short clips from long videos</li>
                    <li>• AI-powered content analysis and editing</li>
                    <li>• Automatic captions and reframing</li>
                    <li>• Support for multiple platforms (YouTube, TikTok, Instagram)</li>
                    <li>• Professional quality output</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Results Tab */}
        {currentTab === 'results' && (
          <div className="space-y-8">
            <div className="text-center">
              <h2 className={`text-4xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                Generated Viral Clips
              </h2>
              <p className={`text-xl mb-8 ${darkMode ? 'text-purple-200' : 'text-purple-600'}`}>
                {generatedClips.length > 0 
                  ? `${generatedClips.length} clips ready to go viral!`
                  : 'No clips generated yet. Upload a video to get started.'
                }
              </p>
            </div>

            {generatedClips.length > 0 ? (
              <div className="grid lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {generatedClips.map((clip) => (
                  <div
                    key={clip.id}
                    className={`backdrop-blur-lg rounded-2xl p-6 border transition-all hover:scale-105 ${
                      darkMode 
                        ? 'bg-white/10 border-white/20 hover:bg-white/15' 
                        : 'bg-white/50 border-gray-200 hover:bg-white/70'
                    }`}
                  >
                    {/* Thumbnail */}
                    <div className="relative mb-4 rounded-xl overflow-hidden bg-gray-900">
                      {clip.thumbnail ? (
                        <img 
                          src={clip.thumbnail} 
                          alt={clip.title}
                          className="w-full h-48 object-cover"
                        />
                      ) : (
                        <div className="w-full h-48 bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center">
                          <Video className="w-12 h-12 text-white" />
                        </div>
                      )}
                      
                      {/* Play button overlay */}
                      <div className="absolute inset-0 flex items-center justify-center">
                        <button
                          onClick={() => setSelectedClip(clip)}
                          className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/30 transition-all"
                        >
                          <Play className="w-8 h-8 text-white ml-1" />
                        </button>
                      </div>

                      {/* Viral Score Badge */}
                      <div className="absolute top-3 right-3">
                        <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-black px-3 py-1 rounded-full flex items-center space-x-1">
                          <Star className="w-4 h-4" />
                          <span className="font-bold text-sm">{clip.score}</span>
                        </div>
                      </div>

                      {/* Duration */}
                      <div className="absolute bottom-3 left-3">
                        <div className="bg-black/50 backdrop-blur-sm text-white px-2 py-1 rounded text-sm">
                          {formatDuration(clip.duration)}
                        </div>
                      </div>
                    </div>

                    {/* Clip Info */}
                    <div className="space-y-3">
                      <h3 className={`font-semibold text-lg ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                        {clip.title}
                      </h3>
                      
                      {clip.transcript && (
                        <p className={`text-sm line-clamp-3 ${
                          darkMode ? 'text-purple-200' : 'text-purple-600'
                        }`}>
                          {clip.transcript.substring(0, 120)}...
                        </p>
                      )}

                      {/* Tags */}
                      {clip.tags && clip.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {clip.tags.slice(0, 3).map((tag, index) => (
                            <span
                              key={index}
                              className={`px-2 py-1 rounded-full text-xs ${
                                darkMode 
                                  ? 'bg-purple-500/20 text-purple-300' 
                                  : 'bg-purple-100 text-purple-600'
                              }`}
                            >
                              #{tag}
                            </span>
                          ))}
                        </div>
                      )}

                      {/* Action buttons */}
                      <div className="flex space-x-2">
                        <button
                          onClick={() => setSelectedClip(clip)}
                          className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 text-white py-2 px-4 rounded-lg font-medium hover:from-purple-700 hover:to-pink-700 transition-all flex items-center justify-center space-x-2"
                        >
                          <Play className="w-4 h-4" />
                          <span>Preview</span>
                        </button>
                        
                        <button
                          onClick={() => downloadClip(clip)}
                          className={`p-2 rounded-lg border transition-all ${
                            darkMode 
                              ? 'border-white/20 text-white hover:bg-white/10' 
                              : 'border-gray-300 text-gray-600 hover:bg-gray-50'
                          }`}
                        >
                          <Download className="w-5 h-5" />
                        </button>
                        
                        <button
                          className={`p-2 rounded-lg border transition-all ${
                            darkMode 
                              ? 'border-white/20 text-white hover:bg-white/10' 
                              : 'border-gray-300 text-gray-600 hover:bg-gray-50'
                          }`}
                        >
                          <Share2 className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <Scissors className={`w-24 h-24 mx-auto mb-6 ${
                  darkMode ? 'text-purple-400' : 'text-purple-500'
                } opacity-50`} />
                <h3 className={`text-2xl font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                  No Clips Generated Yet
                </h3>
                <p className={`text-lg mb-8 ${darkMode ? 'text-purple-200' : 'text-purple-600'}`}>
                  Upload a video to start generating viral clips with AI
                </p>
                <button
                  onClick={() => setCurrentTab('upload')}
                  className="bg-gradient-to-r from-purple-600 to-pink-600 text-white py-4 px-8 rounded-xl font-semibold text-lg hover:from-purple-700 hover:to-pink-700 transition-all"
                >
                  Upload Video
                </button>
              </div>
            )}
          </div>
        )}

        {/* History Tab */}
        {currentTab === 'history' && (
          <div className="space-y-8">
            <div className="text-center">
              <h2 className={`text-4xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                Processing History
              </h2>
              <p className={`text-xl mb-8 ${darkMode ? 'text-purple-200' : 'text-purple-600'}`}>
                View your previously processed videos and clips
              </p>
            </div>

            {jobHistory.length > 0 ? (
              <div className="space-y-4">
                {jobHistory.map((job, index) => (
                  <div
                    key={job.id || index}
                    className={`backdrop-blur-lg rounded-xl p-6 border ${
                      darkMode ? 'bg-white/10 border-white/20' : 'bg-white/50 border-gray-200'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                          <Video className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h3 className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                            {job.title || `Job ${job.id}`}
                          </h3>
                          <p className={`text-sm ${darkMode ? 'text-purple-200' : 'text-purple-600'}`}>
                            {new Date(job.created_at).toLocaleDateString()} • 
                            {job.clips_count || 0} clips generated
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <div className={`px-3 py-1 rounded-full text-sm ${
                          job.status === 'completed' 
                            ? 'bg-green-500/20 text-green-400'
                            : job.status === 'processing'
                            ? 'bg-yellow-500/20 text-yellow-400'
                            : 'bg-red-500/20 text-red-400'
                        }`}>
                          {job.status}
                        </div>
                        
                        <button className={`p-2 rounded-lg border transition-all ${
                          darkMode 
                            ? 'border-white/20 text-white hover:bg-white/10' 
                            : 'border-gray-300 text-gray-600 hover:bg-gray-50'
                        }`}>
                          <TrendingUp className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <Clock className={`w-24 h-24 mx-auto mb-6 ${
                  darkMode ? 'text-purple-400' : 'text-purple-500'
                } opacity-50`} />
                <h3 className={`text-2xl font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                  No Processing History
                </h3>
                <p className={`text-lg ${darkMode ? 'text-purple-200' : 'text-purple-600'}`}>
                  Your video processing history will appear here
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Video Preview Modal */}
      {selectedClip && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className={`max-w-2xl w-full backdrop-blur-lg rounded-2xl p-6 ${
            darkMode ? 'bg-white/10' : 'bg-white/90'
          }`}>
            <div className="flex items-center justify-between mb-4">
              <h3 className={`text-xl font-semibold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                {selectedClip.title}
              </h3>
              <button
                onClick={() => setSelectedClip(null)}
                className={`p-2 rounded-lg transition-all ${
                  darkMode ? 'hover:bg-white/10 text-white' : 'hover:bg-gray-100 text-gray-600'
                }`}
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="rounded-xl overflow-hidden bg-black">
              {selectedClip.url ? (
                <video
                  src={selectedClip.url}
                  controls
                  className="w-full h-auto max-h-96"
                  autoPlay
                >
                  Your browser does not support video playback.
                </video>
              ) : (
                <div className="w-full h-96 flex items-center justify-center">
                  <div className="text-center">
                    <Video className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-400">Video preview not available</p>
                  </div>
                </div>
              )}
            </div>

            <div className="mt-4 flex space-x-3">
              <button
                onClick={() => downloadClip(selectedClip)}
                className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 px-6 rounded-xl font-medium hover:from-purple-700 hover:to-pink-700 transition-all flex items-center justify-center space-x-2"
              >
                <Download className="w-5 h-5" />
                <span>Download</span>
              </button>
              
              <button
                className={`px-6 py-3 rounded-xl border transition-all ${
                  darkMode 
                    ? 'border-white/20 text-white hover:bg-white/10' 
                    : 'border-gray-300 text-gray-600 hover:bg-gray-50'
                }`}
              >
                <Share2 className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ViralClipsAI;
