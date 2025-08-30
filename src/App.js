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
                  <p className={`${darkMode ? 'text-purple-200' : 'text-gray-800'}`}>
  Supported formats: MP4, MOV, AVI, etc.
</p>
