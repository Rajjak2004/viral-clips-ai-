import React, { useState, useRef, useEffect } from 'react';
import { 
  Upload, Video, Scissors, Play, Settings, 
  Zap, FileVideo, Camera, Star,
  Clock, AlertCircle, CheckCircle, X, Menu, Sun, Moon, User, Download
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
        { id: 1, title: "Most Viral Moment", duration: 15, score: 95, url: "https://samplelib.com/lib/preview/mp4/sample-5s.mp4", thumbnail: "https://via.placeholder.com/400x600/8b5cf6/ffffff?text=Clip+1", transcript: "This is the most engaging part of your video with great content..." },
        { id: 2, title: "Perfect Hook", duration: 12, score: 88, url: "https://samplelib.com/lib/preview/mp4/sample-10s.mp4", thumbnail: "https://via.placeholder.com/400x600/ec4899/ffffff?text=Clip+2", transcript: "An amazing hook that captures attention immediately..." },
        { id: 3, title: "Powerful Ending", duration: 18, score: 82, url: "https://samplelib.com/lib/preview/mp4/sample-15s.mp4", thumbnail: "https://via.placeholder.com/400x600/f59e0b/ffffff?text=Clip+3", transcript: "A compelling conclusion that keeps viewers engaged..." }
      ]
    };
  },
  validateApiKey: async function() {
    if (!this.apiKey) return { valid: false, error: 'No API key provided' };
    await new Promise(resolve => setTimeout(resolve, 1000));
    return { valid: this.apiKey.length > 5, user: { email: 'demo@example.com' }, credits: 10 };
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
  if (!validTypes.includes(file.type)) return { valid: false, error: 'Invalid file type.' };
  if (file.size > maxSize) return { valid: false, error: 'File size too large. Max 2GB.' };
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
  const [videoMetadata, setVideoMetadata] = useState(null);
  const [dragOver, setDragOver] = useState(false);

  const fileInputRef = useRef(null);
  useEffect(() => {
    const savedApiKey = mockApi.getApiKey();
    const savedDarkMode = localStorage.getItem('dark_mode') !== 'false';
    setApiKey(savedApiKey);
    setDarkMode(savedDarkMode);
    if (savedApiKey) validateApiKey(savedApiKey);
  }, []);
  const showNotification = (message, type = 'info') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 4000);
  };

  const validateApiKey = async (key = apiKey) => {
    if (!key) { setApiKeyValid(false); setAccountInfo(null); return; }
    try {
      mockApi.setApiKey(key);
      const validation = await mockApi.validateApiKey();
      if (validation.valid) { setApiKeyValid(true); setAccountInfo(validation); showNotification('API key validated!', 'success'); }
      else { setApiKeyValid(false); setAccountInfo(null); showNotification(validation.error, 'error'); }
    } catch { setApiKeyValid(false); setAccountInfo(null); showNotification('Validation failed', 'error'); }
  }; 
  const processVideo = async (videoFile) => {
    if (!apiKeyValid) { showNotification('Enter valid API key in settings', 'error'); setCurrentTab('settings'); return; }
    setProcessing(true); setProcessingProgress(0);
    try {
      const progressInterval = setInterval(() => {
        setProcessingProgress(prev => (prev >= 90 ? 90 : prev + Math.random() * 10));
      }, 500);
      const result = await mockApi.generateShorts(videoFile ? { file: videoFile } : { url: videoUrl });
      clearInterval(progressInterval); setProcessingProgress(100);
      setGeneratedClips(result.clips || []);
      setCurrentTab('results');
    } catch { showNotification('Processing failed', 'error'); }
    finally { setProcessing(false); setProcessingProgress(0); }
  }; 
  const handleFileUpload = (file) => {
    const validation = validateVideoFile(file);
    if (!validation.valid) { showNotification(validation.error, 'error'); return; }
    setUploadedVideo(file);
    const url = URL.createObjectURL(file);
    setVideoUrl(url);
    setVideoMetadata({ name: file.name, size: formatFileSize(file.size), duration: 'Processing...' });
  }; 
  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900' : 'bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50'}`}>
      {notification && (
        <div className="fixed top-4 right-4 p-3 rounded-lg shadow-lg text-white z-50" style={{ background: notification.type === 'success' ? 'green' : notification.type === 'error' ? 'red' : 'blue' }}>
          <span>{notification.message}</span>
          <button onClick={() => setNotification(null)} className="ml-3">✕</button>
        </div>
      )}
      {/* Tabs, Upload, Settings, Results, Modal code would continue here */}
    </div>
  );
};

export default ViralClipsAI;
