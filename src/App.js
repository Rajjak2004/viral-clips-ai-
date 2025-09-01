import React, { useState, useRef, useEffect } from 'react';
import {
  Upload, Video, Scissors, Download, Play, Settings,
  Zap, FileVideo, Camera, Share2, Star, Clock, AlertCircle, 
  CheckCircle, X, Menu, Sun, Moon, User, Cloud, Loader
} from 'lucide-react';
import realApiService from './services/realApiService';

function App() {
  // State management
  const [darkMode, setDarkMode] = useState(true);
  const [clips, setClips] = useState([]);
  const [videoUrl, setVideoUrl] = useState("");
  const [transcript, setTranscript] = useState("");
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [apiKey, setApiKey] = useState(localStorage.getItem("openai_api_key") || "");
  const [currentVideo, setCurrentVideo] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStep, setProcessingStep] = useState('');
  const [processingProgress, setProcessingProgress] = useState(0);
  const [selectedPreset, setSelectedPreset] = useState('tiktok');
  const [viralAnalysis, setViralAnalysis] = useState(null);

  const fileInputRef = useRef(null);

  // Video presets
  const presets = {
    tiktok: {
      name: '🎵 TikTok Viral',
      duration: 30,
      aspectRatio: '9:16',
      style: 'energetic',
      features: ['Auto-captions', 'Trending hooks', 'Quick cuts']
    },
    youtube: {
      name: '📺 YouTube Shorts',
      duration: 60,
      aspectRatio: '9:16',
      style: 'educational',
      features: ['Clear audio', 'Smooth transitions', 'Call-to-action']
    },
    instagram: {
      name: '📸 Instagram Reels',
      duration: 30,
      aspectRatio: '9:16',
      style: 'aesthetic',
      features: ['Color grading', 'Trendy effects', 'Music sync']
    }
  };

  // Initialize API service
  useEffect(() => {
    if (apiKey) {
      realApiService.setApiKey(apiKey);
    }
  }, [apiKey]);

  // Handle file upload
  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setCurrentVideo(file);
    setIsProcessing(true);
    setProcessingStep('Uploading video...');
    setProcessingProgress(10);

    try {
      // Get video metadata
      const metadata = await getVideoMetadata(file);
      
      setProcessingStep('Generating transcript...');
      setProcessingProgress(30);
      
      // Generate real transcript
      const transcriptData = await realApiService.generateTranscript(file);
      setTranscript(transcriptData.text);
      
      setProcessingStep('Analyzing viral potential...');
      setProcessingProgress(60);
      
      // Analyze viral potential
      const analysis = await realApiService.analyzeViralPotential(
        transcriptData.text, 
        metadata, 
        selectedPreset
      );
      setViralAnalysis(analysis);
      
      setProcessingStep('Generating clips...');
      setProcessingProgress(80);
      
      // Generate actual clips
      const result = await realApiService.generateViralClips(file, {
        metadata,
        platform: selectedPreset,
        preset: presets[selectedPreset]
      });
      
      setClips(result.clips);
      setProcessingProgress(100);
      setProcessingStep('Complete!');
      
      setTimeout(() => {
        setIsProcessing(false);
        setProcessingStep('');
        setProcessingProgress(0);
      }, 1000);

    } catch (error) {
      console.error('❌ Processing error:', error);
      setIsProcessing(false);
      alert(`Error: ${error.message}`);
    }
  };

  // Handle URL processing
  const processUrl = async () => {
    if (!videoUrl) return;
    
    setIsProcessing(true);
    setProcessingStep('Downloading video...');
    setProcessingProgress(20);

    try {
      // Download video from URL
      const downloadResult = await realApiService.downloadFromUrl(videoUrl);
      
      setProcessingStep('Processing downloaded video...');
      setProcessingProgress(50);
      
      // Continue with normal processing flow
      // ... (similar to file upload)
      
    } catch (error) {
      console.error('❌ URL processing error:', error);
      setIsProcessing(false);
      alert(`Error: ${error.message}`);
    }
  };

  // Download clip
  const downloadClip = async (clip) => {
    try {
      const response = await fetch(clip.url);
      const blob = await response.blob();
      
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${clip.title.replace(/[^a-zA-Z0-9]/g, '_')}.mp4`;
      link.click();
      
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('❌ Download error:', error);
      alert('Download failed');
    }
  };

  // Export to cloud
  const exportToCloud = async (clip, service) => {
    try {
      const response = await fetch(clip.url);
      const blob = await response.blob();
      
      if (service === 'drive') {
        await realApiService.exportToGoogleDrive(blob, `${clip.title}.mp4`);
      } else if (service === 'dropbox') {
        await realApiService.exportToDropbox(blob, `${clip.title}.mp4`);
      }
      
      alert(`Exported to ${service} successfully!`);
    } catch (error) {
      console.error('❌ Export error:', error);
      alert(`Export to ${service} failed`);
    }
  };

  // Save API key
  const saveApiKey = () => {
    realApiService.setApiKey(apiKey);
    alert("OpenAI API Key saved successfully!");
    setSettingsOpen(false);
  };

  // Get video metadata
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
          name: file.name
        });
        URL.revokeObjectURL(video.src);
      };
      video.src = URL.createObjectURL(file);
    });
  };

  return (
    <div className={`min-h-screen transition-all duration-300 ${
      darkMode 
        ? 'bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900' 
        : 'bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50'
    }`}>
      
      {/* Header */}
      <header className="p-6 flex justify-between items-center backdrop-blur-lg bg-white/10 border-b border-white/20">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
            🎬
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">ViralClips AI</h1>
            <p className="text-purple-200 text-sm">Real AI-Powered Video Editor</p>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setDarkMode(!darkMode)}
            className="p-2 rounded-lg bg-white/10 text-white hover:bg-white/20 transition-all"
          >
            {darkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>
          <button 
            onClick={() => setSettingsOpen(!settingsOpen)}
            className="p-2 rounded-lg bg-white/10 text-white hover:bg-white/20 transition-all"
          >
            <Settings size={20} />
          </button>
        </div>
      </header>

      {/* Processing Overlay */}
      {isProcessing && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 max-w-md w-full mx-4 border border-white/20">
            <div className="text-center">
              <Loader className="w-12 h-12 mx-auto mb-4 animate-spin text-purple-400" />
              <h3 className="text-xl font-bold text-white mb-2">Processing Video</h3>
              <p className="text-purple-200 mb-4">{processingStep}</p>
              
              <div className="w-full bg-white/20 rounded-full h-3 mb-2">
                <div 
                  className="bg-gradient-to-r from-purple-500 to-pink-500 h-3 rounded-full transition-all duration-300"
                  style={{ width: `${processingProgress}%` }}
                />
              </div>
              <p className="text-sm text-purple-300">{processingProgress}% Complete</p>
            </div>
          </div>
        </div>
      )}

      {/* Settings Panel */}
      {settingsOpen && (
        <div className="p-6 bg-white/10 backdrop-blur-lg border-b border-white/20">
          <h2 className="text-xl font-bold text-white mb-4">⚙️ Settings</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-purple-200 mb-2">OpenAI API Key</label>
              <input 
                type="password"
                className="w-full px-4 py-3 bg-black/30 border border-white/20 rounded-lg text-white placeholder-purple-300 focus:border-purple-400 focus:outline-none"
                placeholder="sk-proj-..."
                value={apiKey} 
                onChange={(e) => setApiKey(e.target.value)} 
              />
              <p className="text-xs text-purple-300 mt-1">Required for AI transcript & analysis</p>
            </div>
            
            <div>
              <label className="block text-purple-200 mb-2">Processing Preset</label>
              <select 
                value={selectedPreset}
                onChange={(e) => setSelectedPreset(e.target.value)}
                className="w-full px-4 py-3 bg-black/30 border border-white/20 rounded-lg text-white focus:border-purple-400 focus:outline-none"
              >
                {Object.entries(presets).map(([key, preset]) => (
                  <option key={key} value={key} className="bg-gray-800">
                    {preset.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
          
          <button 
            onClick={saveApiKey}
            className="mt-4 px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg font-semibold hover:from-purple-600 hover:to-pink-600 transition-all"
          >
            💾 Save Settings
          </button>
        </div>
      )}

      {/* Main Content */}
      <main className="p-6 space-y-8">
        
        {/* Upload Section */}
        <div className="card p-8">
          <h2 className="text-2xl font-bold text-white mb-6">📤 Upload Your Video</h2>
          
          {/* Preset Selection */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            {Object.entries(presets).map(([key, preset]) => (
              <button
                key={key}
                onClick={() => setSelectedPreset(key)}
                className={`p-4 rounded-xl border-2 transition-all ${
                  selectedPreset === key 
                    ? 'border-purple-400 bg-purple-500/20' 
                    : 'border-white/20 hover:border-purple-400/50'
                }`}
              >
                <h3 className="font-bold text-white">{preset.name}</h3>
                <p className="text-purple-200 text-sm">{preset.style}</p>
                <div className="mt-2 flex flex-wrap gap-1">
                  {preset.features.map(feature => (
                    <span key={feature} className="px-2 py-1 bg-purple-400/30 text-purple-200 rounded text-xs">
                      {feature}
                    </span>
                  ))}
                </div>
              </button>
            ))}
          </div>

          {/* File Upload */}
          <input 
            type="file" 
            accept="video/*" 
            ref={fileInputRef} 
            onChange={handleFileUpload} 
            className="hidden" 
          />
          
          <div className="space-y-4">
            <button 
              onClick={() => fileInputRef.current?.click()}
              disabled={isProcessing}
              className="w-full p-6 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-semibold hover:from-purple-600 hover:to-pink-600 transition-all disabled:opacity-50 flex items-center justify-center gap-3"
            >
              <Upload size={24} />
              {isProcessing ? 'Processing...' : 'Upload Video File'}
            </button>

            {/* Drag & Drop Zone */}
            <div 
              className="border-2 border-dashed border-white/30 rounded-xl p-8 text-center hover:border-purple-400 transition-all"
              onDrop={(e) => {
                e.preventDefault();
                const file = e.dataTransfer.files[0];
                if (file) {
                  setCurrentVideo(file);
                  handleFileUpload({ target: { files: [file] } });
                }
              }}
              onDragOver={(e) => e.preventDefault()}
            >
              <FileVideo className="w-16 h-16 mx-auto mb-4 text-purple-300" />
              <h3 className="text-xl font-semibold text-white mb-2">Drop Video Here</h3>
              <p className="text-purple-200">Supports MP4, MOV, AVI, MKV up to 2GB</p>
            </div>

            {/* URL Input */}
            <div className="flex gap-3">
              <input 
                type="text"
                className="flex-1 px-4 py-3 bg-black/30 border border-white/20 rounded-lg text-white placeholder-purple-300 focus:border-purple-400 focus:outline-none"
                placeholder="Paste YouTube/TikTok/Instagram URL"
                value={videoUrl}
                onChange={(e) => setVideoUrl(e.target.value)}
                disabled={isProcessing}
              />
              <button 
                onClick={processUrl}
                disabled={isProcessing || !videoUrl}
                className="px-6 py-3 bg-blue-500 text-white rounded-lg font-semibold hover:bg-blue-600 transition-all disabled:opacity-50"
              >
                <Download size={20} />
              </button>
            </div>
          </div>
        </div>

        {/* Viral Analysis Display */}
        {viralAnalysis && (
          <div className="card p-6">
            <h2 className="text-xl font-bold text-white mb-4">📊 Viral Analysis</h2>
            
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-400">{viralAnalysis.overallScore}</div>
                <div className="text-purple-200 text-sm">Overall Score</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-pink-400">{viralAnalysis.hookScore}</div>
                <div className="text-purple-200 text-sm">Hook Strength</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-400">{viralAnalysis.engagementScore}</div>
                <div className="text-purple-200 text-sm">Engagement</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-400">{viralAnalysis.shareabilityScore}</div>
                <div className="text-purple-200 text-sm">Shareability</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-400">{viralAnalysis.trendingScore}</div>
                <div className="text-purple-200 text-sm">Trending</div>
              </div>
            </div>

            {/* Viral Factors */}
            <div className="mb-4">
              <h3 className="text-white font-semibold mb-2">🔥 Viral Factors:</h3>
              <div className="flex flex-wrap gap-2">
                {viralAnalysis.viralFactors?.map((factor, index) => (
                  <span key={index} className="px-3 py-1 bg-green-500/20 text-green-300 rounded-full text-sm">
                    ✅ {factor}
                  </span>
                ))}
              </div>
            </div>

            {/* Improvements */}
            <div>
              <h3 className="text-white font-semibold mb-2">💡 Suggested Improvements:</h3>
              <div className="flex flex-wrap gap-2">
                {viralAnalysis.improvements?.map((improvement, index) => (
                  <span key={index} className="px-3 py-1 bg-yellow-500/20 text-yellow-300 rounded-full text-sm">
                    💡 {improvement}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Generated Clips */}
        <div className="card p-6">
          <h2 className="text-xl font-bold text-white mb-6">🎬 Generated Viral Clips</h2>
          
          {clips.length === 0 ? (
            <div className="text-center py-12">
              <Video className="w-16 h-16 mx-auto mb-4 text-purple-300" />
              <p className="text-purple-200">No clips generated yet. Upload a video to get started!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {clips.map((clip) => (
                <div key={clip.id} className="bg-white/5 rounded-xl border border-white/20 overflow-hidden hover:border-purple-400 transition-all group">
                  
                  {/* Video Preview */}
                  <div className="aspect-[9/16] bg-black/30 relative">
                    <video 
                      src={clip.url}
                      className="w-full h-full object-cover"
                      poster={`https://via.placeholder.com/400x600/8b5cf6/ffffff?text=🎬+Loading`}
                      controls
                    />
                    
                    {/* Viral Score Badge */}
                    <div className="absolute top-3 right-3 px-3 py-1 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full">
                      <span className="text-white font-bold text-sm">{clip.score}% 🔥</span>
                    </div>
                  </div>

                  {/* Clip Info */}
                  <div className="p-4">
                    <h3 className="font-bold text-white mb-2">{clip.title}</h3>
                    <p className="text-purple-200 text-sm mb-3 line-clamp-2">{clip.reason}</p>
                    
                    {/* Duration & Time */}
                    <div className="flex justify-between text-xs text-purple-300 mb-4">
                      <span>⏱️ {clip.duration}s</span>
                      <span>🕐 {Math.floor(clip.startTime/60)}:{(clip.startTime%60).toString().padStart(2,'0')} - {Math.floor(clip.endTime/60)}:{(clip.endTime%60).toString().padStart(2,'0')}</span>
                    </div>

                    {/* Viral Factors */}
                    <div className="mb-4">
                      <div className="flex flex-wrap gap-1">
                        {clip.viralFactors?.slice(0, 2).map((factor, index) => (
                          <span key={index} className="px-2 py-1 bg-purple-500/20 text-purple-300 rounded text-xs">
                            {factor}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="space-y-2">
                      <div className="flex gap-2">
                        <button 
                          onClick={() => downloadClip(clip)}
                          className="flex-1 px-3 py-2 bg-green-500 text-white rounded-lg font-medium hover:bg-green-600 transition-all flex items-center justify-center gap-2"
                        >
                          <Download size={16} />
                          Download
                        </button>
                        <button 
                          onClick={() => shareClip(clip)}
                          className="flex-1 px-3 py-2 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 transition-all flex items-center justify-center gap-2"
                        >
                          <Share2 size={16} />
                          Share
                        </button>
                      </div>
                      
                      <div className="flex gap-2">
                        <button 
                          onClick={() => exportToCloud(clip, 'drive')}
                          className="flex-1 px-3 py-2 bg-red-500 text-white rounded-lg font-medium hover:bg-red-600 transition-all text-sm"
                        >
                          📗 Drive
                        </button>
                        <button 
                          onClick={() => exportToCloud(clip, 'dropbox')}
                          className="flex-1 px-3 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-all text-sm"
                        >
                          📘 Dropbox
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Transcript Display */}
        {transcript && (
          <div className="card p-6">
            <h2 className="text-xl font-bold text-white mb-4">📝 Generated Transcript</h2>
            <div className="bg-black/20 rounded-lg p-4 max-h-60 overflow-y-auto">
              <p className="text-purple-100 leading-relaxed">{transcript}</p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

// Share clip function
const shareClip = async (clip) => {
  const shareData = {
    title: `🔥 Viral Clip: ${clip.title}`,
    text: `Check out this ${clip.score}% viral potential clip generated with ViralClips AI!`,
    url: window.location.href
  };

  if (navigator.share && navigator.canShare(shareData)) {
    try {
      await navigator.share(shareData);
    } catch (error) {
      // Fallback to clipboard
      navigator.clipboard.writeText(`${shareData.title}\n${shareData.text}\n${shareData.url}`);
      alert('📋 Link copied to clipboard!');
    }
  } else {
    navigator.clipboard.writeText(`${shareData.title}\n${shareData.text}\n${shareData.url}`);
    alert('📋 Link copied to clipboard!');
  }
};

export default App;
