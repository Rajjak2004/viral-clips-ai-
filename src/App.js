{/* ⏰ Timestamp */}
                          <div className="flex items-center space-x-2">
                            <Clock className={`w-4 h-4 ${darkMode ? 'text-purple-300' : 'text-purple-500'}`} />
                            <span className={`text-sm ${darkMode ? 'text-purple-200' : 'text-purple-600'}`}>
                              {clip.timestamp}
                            </span>
                          </div>

                          {/* 🏷️ Viral Factors */}
                          <div className="flex flex-wrap gap-1">
                            {clip.viralFactors.slice(0, 2).map((factor, index) => (
                              <span 
                                key={index}
                                className={`text-xs px-2 py-1 rounded-full ${
                                  darkMode ? 'bg-purple-500/20 text-purple-200' : 'bg-purple-100 text-purple-700'
                                }`}
                              >
                                {factor}
                              </span>
                            ))}
                            {clip.viralFactors.length > 2 && (
                              <span className={`text-xs px-2 py-1 rounded-full ${
                                darkMode ? 'bg-gray-500/20 text-gray-300' : 'bg-gray-100 text-gray-600'
                              }`}>
                                +{clip.viralFactors.length - 2}
                              </span>
                            )}
                          </div>

                          {/* 🎬 Action Buttons */}
                          <div className="flex space-x-2 pt-2">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                downloadClip(clip);
                              }}
                              className="flex-1 bg-gradient-to-r from-green-500 to-emerald-500 text-white py-2 px-3 rounded-lg hover:from-green-600 hover:to-emerald-600 transition-all duration-300 text-sm font-medium flex items-center justify-center space-x-1"
                              title="Download clip"
                            >
                              <Download className="w-4 h-4" />
                              <span>Download</span>
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                shareClip(clip);
                              }}
                              className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all duration-300 flex items-center justify-center space-x-1 ${
                                darkMode ? 'bg-white/10 hover:bg-white/20 text-white' : 'bg-gray-200 hover:bg-gray-300 text-gray-800'
                              }`}
                              title="Share clip"
                            >
                              <Share2 className="w-4 h-4" />
                              <span>Share</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* 🔄 Action Buttons */}
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <button
                      onClick={() => setCurrentTab('upload')}
                      className={`px-6 py-3 rounded-lg font-medium transition-all duration-300 ${
                        darkMode ? 'bg-white/10 hover:bg-white/20 text-white' : 'bg-white/50 hover:bg-white/70 text-gray-800'
                      } hover:transform hover:-translate-y-0.5`}
                    >
                      <Upload className="w-5 h-5 inline mr-2" />
                      Generate More Clips
                    </button>
                    
                    <button
                      onClick={resetApp}
                      className={`px-6 py-3 rounded-lg font-medium transition-all duration-300 ${
                        darkMode ? 'bg-red-500/20 hover:bg-red-500/30 text-red-200' : 'bg-red-100 hover:bg-red-200 text-red-700'
                      } hover:transform hover:-translate-y-0.5`}
                    >
                      🔄 Reset App
                    </button>
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </main>

      {/* ⚙️ Settings Modal */}
      {showSettings && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className={`w-full max-w-4xl my-8 rounded-2xl ${
            darkMode ? 'bg-gray-800' : 'bg-white'
          } shadow-2xl max-h-[90vh] overflow-y-auto`}>
            
            {/* 📋 Modal Header */}
            <div className={`sticky top-0 flex items-center justify-between p-6 border-b ${
              darkMode ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-white'
            } rounded-t-2xl`}>
              <h3 className={`text-xl lg:text-2xl font-bold flex items-center ${
                darkMode ? 'text-white' : 'text-gray-800'
              }`}>
                <Settings className="w-6 h-6 mr-2 text-purple-500" />
                Settings
              </h3>
              <button
                onClick={() => setShowSettings(false)}
                className={`p-2 rounded-lg transition-colors ${
                  darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
                }`}
              >
                <X size={20} />
              </button>
            </div>

            {/* 📝 Modal Content */}
            <div className="p-6 space-y-8">
              
              {/* 🔑 API Key Section */}
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                    🔑
                  </div>
                  <h4 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                    API Configuration
                  </h4>
                </div>
                
                <div className="space-y-3">
                  <label className={`block text-sm font-medium ${
                    darkMode ? 'text-gray-300' : 'text-gray-600'
                  }`}>
                    Klap API Key
                  </label>
                  <div className="relative">
                    <input
                      type="password"
                      value={apiKey}
                      onChange={(e) => setApiKey(e.target.value)}
                      placeholder="Enter your Klap API key..."
                      className={`w-full px-4 py-3 rounded-lg border transition-all duration-300 ${
                        darkMode 
                          ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-purple-400' 
                          : 'bg-gray-50 border-gray-300 text-gray-800 placeholder-gray-500 focus:border-purple-400'
                      } focus:outline-none focus:ring-2 focus:ring-purple-400/20`}
                    />
                  </div>
                  
                  <div className="flex flex-col sm:flex-row gap-3">
                    <button
                      onClick={() => validateApiKey()}
                      disabled={processing}
                      className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-medium py-2 px-4 rounded-lg hover:from-purple-600 hover:to-pink-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
                    >
                      {processing ? (
                        <div className="flex items-center justify-center space-x-2">
                          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                          <span>Validating...</span>
                        </div>
                      ) : (
                        'Validate Key'
                      )}
                    </button>
                    
                    <a
                      href="https://klap.app"
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`px-4 py-2 rounded-lg font-medium transition-colors text-center ${
                        darkMode ? 'bg-gray-700 hover:bg-gray-600 text-white' : 'bg-gray-200 hover:bg-gray-300 text-gray-800'
                      }`}
                    >
                      <ExternalLink className="w-4 h-4 inline mr-1" />
                      Get API Key
                    </a>
                  </div>
                </div>

                {/* 📊 API Status */}
                {apiKeyValid && accountInfo && (
                  <div className={`p-4 rounded-lg ${
                    darkMode ? 'bg-green-500/20 border border-green-500/30' : 'bg-green-50 border border-green-200'
                  }`}>
                    <div className="flex items-start space-x-3">
                      <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0 mt-0.5" />
                      <div className="flex-1">
                        <div className={`font-medium mb-2 ${
                          darkMode ? 'text-green-200' : 'text-green-700'
                        }`}>
                          ✅ API Connected Successfully!
                        </div>
                        <div className={`text-sm space-y-1 ${
                          darkMode ? 'text-green-300' : 'text-green-600'
                        }`}>
                          <div className="flex items-center space-x-4">
                            <span>👤 User: {accountInfo.user?.email}</span>
                            <span>💳 Credits: {accountInfo.credits}</span>
                          </div>
                          <div className="flex items-center space-x-4">
                            <span>📦 Plan: {accountInfo.user?.plan}</span>
                            <span>📊 Usage: {accountInfo.usage?.videosProcessed || 0} videos</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* ❌ API Error */}
                {apiKey && !apiKeyValid && !processing && (
                  <div className={`p-4 rounded-lg ${
                    darkMode ? 'bg-red-500/20 border border-red-500/30' : 'bg-red-50 border border-red-200'
                  }`}>
                    <div className="flex items-start space-x-3">
                      <AlertCircle className="w-6 h-6 text-red-500 flex-shrink-0 mt-0.5" />
                      <div>
                        <div className={`font-medium mb-1 ${
                          darkMode ? 'text-red-200' : 'text-red-700'
                        }`}>
                          ❌ API Key Invalid
                        </div>
                        <div className={`text-sm ${
                          darkMode ? 'text-red-300' : 'text-red-600'
                        }`}>
                          Please check your API key and try again.
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* 🎛️ Processing Options */}
              <div className="space-y-6">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
                    🎛️
                  </div>
                  <h4 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                    Processing Options
                  </h4>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  
                  {/* 📱 Platform */}
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${
                      darkMode ? 'text-gray-300' : 'text-gray-600'
                    }`}>
                      Target Platform
                    </label>
                    <select
                      value={processingOptions.platform}
                      onChange={(e) => setProcessingOptions(prev => ({ ...prev, platform: e.target.value }))}
                      className={`w-full px-3 py-2 rounded-lg border ${
                        darkMode 
                          ? 'bg-gray-700 border-gray-600 text-white' 
                          : 'bg-white border-gray-300 text-gray-800'
                      } focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20`}
                    >
                      <option value="TikTok">🎵 TikTok</option>
                      <option value="YouTube">🎬 YouTube Shorts</option>
                      <option value="Instagram">📸 Instagram Reels</option>
                      <option value="Twitter">🐦 Twitter Videos</option>
                    </select>
                  </div>

                  {/* 📊 Clip Count */}
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${
                      darkMode ? 'text-gray-300' : 'text-gray-600'
                    }`}>
                      Number of Clips
                    </label>
                    <select
                      value={processingOptions.clipCount}
                      onChange={(e) => setProcessingOptions(prev => ({ ...prev, clipCount: parseInt(e.target.value) }))}
                      className={`w-full px-3 py-2 rounded-lg border ${
                        darkMode 
                          ? 'bg-gray-700 border-gray-600 text-white' 
                          : 'bg-white border-gray-300 text-gray-800'
                      } focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20`}
                    >
                      <option value={1}>1 Clip</option>
                      <option value={3}>3 Clips (Recommended)</option>
                      <option value={5}>5 Clips</option>
                      <option value={10}>10 Clips</option>
                    </select>
                  </div>

                  {/* ⏱️ Max Duration */}
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${
                      darkMode ? 'text-gray-300' : 'text-gray-600'
                    }`}>
                      Max Duration per Clip
                    </label>
                    <select
                      value={processingOptions.maxDuration}
                      onChange={(e) => setProcessingOptions(prev => ({ ...prev, maxDuration: parseInt(e.target.value) }))}
                      className={`w-full px-3 py-2 rounded-lg border ${
                        darkMode 
                          ? 'bg-gray-700 border-gray-600 text-white' 
                          : 'bg-white border-gray-300 text-gray-800'
                      } focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20`}
                    >
                      <option value={15}>15 seconds</option>
                      <option value={30}>30 seconds (Recommended)</option>
                      <option value={60}>60 seconds</option>
                      <option value={90}>90 seconds</option>
                      <option value={180}>3 minutes</option>
                    </select>
                  </div>

                  {/* 📐 Aspect Ratio */}
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${
                      darkMode ? 'text-gray-300' : 'text-gray-600'
                    }`}>
                      Aspect Ratio
                    </label>
                    <select
                      value={processingOptions.aspectRatio}
                      onChange={(e) => setProcessingOptions(prev => ({ ...prev, aspectRatio: e.target.value }))}
                      className={`w-full px-3 py-2 rounded-lg border ${
                        darkMode 
                          ? 'bg-gray-700 border-gray-600 text-white' 
                          : 'bg-white border-gray-300 text-gray-800'
                      } focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20`}
                    >
                      <option value="9:16">📱 9:16 (Vertical)</option>
                      <option value="16:9">🖥️ 16:9 (Horizontal)</option>
                      <option value="1:1">⬜ 1:1 (Square)</option>
                    </select>
                  </div>
                </div>

                {/* 🔧 Advanced Options */}
                <div className="space-y-4">
                  <h5 className={`font-medium ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                    Advanced Options
                  </h5>
                  
                  {[
                    { 
                      key: 'addCaptions', 
                      label: 'Auto Captions', 
                      desc: 'Automatically add subtitles to clips',
                      icon: '📝'
                    },
                    { 
                      key: 'autoReframe', 
                      label: 'Smart Reframing', 
                      desc: 'Intelligent cropping for mobile screens',
                      icon: '📱'
                    }
                  ].map((option) => (
                    <div key={option.key} className={`flex items-center justify-between p-4 rounded-lg ${
                      darkMode ? 'bg-white/5 border border-white/10' : 'bg-gray-50 border border-gray-200'
                    }`}>
                      <div className="flex items-center space-x-3">
                        <span className="text-2xl">{option.icon}</span>
                        <div>
                          <div className={`font-medium ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                            {option.label}
                          </div>
                          <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                            {option.desc}
                          </div>
                        </div>
                      </div>
                      
                      <button
                        onClick={() => setProcessingOptions(prev => ({ 
                          ...prev, 
                          [option.key]: !prev[option.key] 
                        }))}
                        className={`relative w-12 h-6 rounded-full transition-colors duration-300 ${
                          processingOptions[option.key] 
                            ? 'bg-purple-500' 
                            : darkMode ? 'bg-gray-600' : 'bg-gray-300'
                        }`}
                      >
                        <div className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow-md transform transition-transform duration-300 ${
                          processingOptions[option.key] ? 'translate-x-6' : 'translate-x-0.5'
                        }`}></div>
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* 🎨 App Preferences */}
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-gradient-to-r from-pink-500 to-purple-500 rounded-lg flex items-center justify-center">
                    🎨
                  </div>
                  <h4 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                    App Preferences
                  </h4>
                </div>

                <div className={`p-4 rounded-lg ${
                  darkMode ? 'bg-white/5 border border-white/10' : 'bg-gray-50 border border-gray-200'
                }`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl">{darkMode ? '🌙' : '☀️'}</span>
                      <div>
                        <div className={`font-medium ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                          {darkMode ? 'Dark Mode' : 'Light Mode'}
                        </div>
                        <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                          Choose your preferred theme
                        </div>
                      </div>
                    </div>
                    
                    <button
                      onClick={toggleTheme}
                      className={`relative w-12 h-6 rounded-full transition-colors duration-300 ${
                        darkMode ? 'bg-purple-500' : 'bg-gray-300'
                      }`}
                    >
                      <div className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow-md transform transition-transform duration-300 ${
                        darkMode ? 'translate-x-6' : 'translate-x-0.5'
                      }`}></div>
                    </button>
                  </div>
                </div>
              </div>

              {/* ℹ️ App Info */}
              <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                <div className="flex items-center space-x-2 mb-3">
                  <div className="w-6 h-6 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center text-sm">
                    ℹ️
                  </div>
                  <h4 className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                    About ViralClips AI
                  </h4>
                </div>
                <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'} mb-3`}>
                  Version 1.0.0 - Open source AI video editor for creating viral social media clips
                </p>
                <div className="flex flex-wrap gap-4">
                  <a href="https://github.com/rajjak2004/viral-clips-ai" target="_blank" rel="noopener noreferrer" className="flex items-center space-x-1 text-purple-500 hover:text-purple-400 text-sm transition-colors">
                    <Github size={16} />
                    <span>Source Code</span>
                  </a>
                  <a href="https://twitter.com/rajjak2004" target="_blank" rel="noopener noreferrer" className="flex items-center space-x-1 text-purple-500 hover:text-purple-400 text-sm transition-colors">
                    <Twitter size={16} />
                    <span>Follow Updates</span>
                  </a>
                  <a href="https://github.com/rajjak2004/viral-clips-ai/issues" target="_blank" rel="noopener noreferrer" className="flex items-center space-x-1 text-purple-500 hover:text-purple-400 text-sm transition-colors">
                    <MessageCircle size={16} />
                    <span>Report Issue</span>
                  </a>
                </div>
              </div>
            </div>

            {/* 💾 Modal Footer */}
            <div className={`sticky bottom-0 p-6 border-t ${
              darkMode ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-white'
            } rounded-b-2xl`}>
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() => setShowSettings(false)}
                  className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold py-3 px-6 rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all duration-300"
                >
                  Save & Close
                </button>
                <button
                  onClick={resetApp}
                  className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                    darkMode ? 'bg-red-500/20 text-red-300 hover:bg-red-500/30' : 'bg-red-100 text-red-600 hover:bg-red-200'
                  }`}
                >
                  Reset All Settings
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 🎬 Clip Preview Modal */}
      {selectedClip && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className={`w-full max-w-6xl my-8 rounded-2xl ${
            darkMode ? 'bg-gray-800' : 'bg-white'
          } shadow-2xl max-h-[95vh] overflow-y-auto`}>
            
            {/* 📋 Modal Header */}
            <div className={`sticky top-0 flex items-center justify-between p-6 border-b ${
              darkMode ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-white'
            } rounded-t-2xl`}>
              <div>
                <h3 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'} flex items-center`}>
                  <Play className="w-6 h-6 mr-2 text-purple-500" />
                  {selectedClip.title}
                </h3>
                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'} mt-1`}>
                  {selectedClip.timestamp} • {formatDuration(selectedClip.duration)} • {selectedClip.platform}
                </p>
              </div>
              <button
                onClick={() => setSelectedClip(null)}
                className={`p-2 rounded-lg transition-colors ${
                  darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
                }`}
              >
                <X size={20} />
              </button>
            </div>

            {/* 🎥 Video Player & Details */}
            <div className="p-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                
                {/* 📹 Video Player */}
                <div className="space-y-4">
                  <div className="relative">
                    <video
                      src={selectedClip.url}
                      controls
                      autoPlay
                      loop
                      className="w-full rounded-lg shadow-lg"
                      style={{ aspectRatio: selectedClip.platform === 'TikTok' ? '9/16' : '16/9', maxHeight: '600px' }}
                    />
                    <div className="absolute top-3 left-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-sm px-3 py-1 rounded-full font-medium">
                      {selectedClip.platform}
                    </div>
                  </div>
                  
                  {/* 🎬 Action Buttons */}
                  <div className="flex space-x-3">
                    <button
                      onClick={() => downloadClip(selectedClip)}
                      className="flex-1 bg-gradient-to-r from-green-500 to-emerald-500 text-white py-3 px-4 rounded-lg hover:from-green-600 hover:to-emerald-600 transition-all duration-300 font-medium flex items-center justify-center space-x-2"
                    >
                      <Download className="w-5 h-5" />
                      <span>Download Clip</span>
                    </button>
                    <button
                      onClick={() => shareClip(selectedClip)}
                      className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all duration-300 flex items-center justify-center space-x-2 ${
                        darkMode ? 'bg-gray-700 hover:bg-gray-600 text-white' : 'bg-gray-200 hover:bg-gray-300 text-gray-800'
                      }`}
                    >
                      <Share2 className="w-5 h-5" />
                      <span>Share Clip</span>
                    </button>
                  </div>
                </div>

                {/* 📊 Clip Analytics & Details */}
                <div className="space-y-6">
                  
                  {/* 📈 Viral Score */}
                  <div>
                    <h4 className={`font-semibold mb-3 flex items-center ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                      <TrendingUp className="w-5 h-5 mr-2 text-green-400" />
                      Viral Potential Analysis
                    </h4>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className={`${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Overall Score</span>
                        <span className={`text-2xl font-bold ${
                          selectedClip.score >= 90 ? 'text-green-400' :
                          selectedClip.score >= 80 ? 'text-yellow-400' : 'text-orange-400'
                        }`}>
                          {selectedClip.score}%
                        </span>
                      </div>
                      <div className={`w-full h-4 rounded-full overflow-hidden ${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`}>
                        <div 
                          className={`h-full transition-all duration-1000 ${
                            selectedClip.score >= 90 ? 'bg-gradient-to-r from-green-400 to-emerald-500' :
                            selectedClip.score >= 80 ? 'bg-gradient-to-r from-yellow-400 to-orange-500' :
                            'bg-gradient-to-r from-orange-400 to-red-500'
                          }`}
                          style={{ width: `${selectedClip.score}%` }}
                        ></div>
                      </div>
                      
                      {/* Individual Scores */}
                      {selectedClip.metadata && (
                        <div className="grid grid-cols-2 gap-3 mt-4">
                          <div className={`p-3 rounded-lg ${darkMode ? 'bg-blue-500/10' : 'bg-blue-50'}`}>
                            <div className={`text-sm ${darkMode ? 'text-blue-300' : 'text-blue-600'}`}>Audio Score</div>
                            <div className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                              {selectedClip.metadata.audioScore}%
                            </div>
                          </div>
                          <div className={`p-3 rounded-lg ${darkMode ? 'bg-purple-500/10' : 'bg-purple-50'}`}>
                            <div className={`text-sm ${darkMode ? 'text-purple-300' : 'text-purple-600'}`}>Visual Score</div>
                            <div className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                              {selectedClip.metadata.visualScore}%
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* ⚡ Viral Factors */}
                  <div>
                    <h4 className={`font-semibold mb-3 flex items-center ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                      <Sparkles className="w-5 h-5 mr-2 text-purple-400" />
                      Viral Factors
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedClip.viralFactors.map((factor, index) => (
                        <span 
                          key={index}
                          className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-sm rounded-full font-medium"
                        >
                          {factor}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* 📝 Transcript */}
                  <div>
                    <h4 className={`font-semibold mb-3 flex items-center ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                      <FileVideo className="w-5 h-5 mr-2 text-blue-400" />
                      Content Transcript
                    </h4>
                    <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'} max-h-32 overflow-y-auto`}>
                      <p className={`text-sm leading-relaxed ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                        {selectedClip.transcript}
                      </p>
                    </div>
                  </div>

                  {/* 🎯 Platform Optimization */}
                  <div>
                    <h4 className={`font-semibold mb-3 flex items-center ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                      <Smartphone className="w-5 h-5 mr-2 text-green-400" />
                      Platform Optimization
                    </h4>
                    <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                      <div className="flex items-center space-x-3 mb-3">
                        <span className="text-2xl">
                          {selectedClip.platform === 'TikTok' ? '🎵' : 
                           selectedClip.platform === 'YouTube' ? '🎬' : 
                           selectedClip.platform === 'Instagram' ? '📸' : '🐦'}
                        </span>
                        <div>
                          <div className={`font-medium ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                            Optimized for {selectedClip.platform}
                          </div>
                          <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                            Perfect aspect ratio, timing, and engagement patterns
                          </div>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-3 text-sm">
                        <div>
                          <span className={`block ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Duration:</span>
                          <span className={`font-medium ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                            {formatDuration(selectedClip.duration)}
                          </span>
                        </div>
                        <div>
                          <span className={`block ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Format:</span>
                          <span className={`font-medium ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                            Vertical (9:16)
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* 📈 Performance Prediction */}
                  <div>
                    <h4 className={`font-semibold mb-3 flex items-center ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                      <BarChart3 className="w-5 h-5 mr-2 text-yellow-400" />
                      Performance Prediction
                    </h4>
                    <div className="space-y-3">
                      {[
                        { metric: 'Engagement Rate', value: `${Math.floor(selectedClip.score * 0.8)}%`, color: 'text-blue-400' },
                        { metric: 'Share Potential', value: `${Math.floor(selectedClip.score * 0.6)}%`, color: 'text-green-400' },
                        { metric: 'Retention Rate', value: `${Math.floor(selectedClip.score * 0.9)}%`, color: 'text-purple-400' }
                      ].map((metric, index) => (
                        <div key={index} className="flex items-center justify-between">
                          <span className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                            {metric.metric}:
                          </span>
                          <span className={`font-bold ${metric.color}`}>
                            {metric.value}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 📱 Responsive Design Indicators */}
      <div className="hidden lg:block fixed bottom-4 right-4 z-40">
        <div className={`flex space-x-2 p-3 rounded-full ${
          darkMode ? 'bg-white/10' : 'bg-white/50'
        } backdrop-blur-lg border border-white/20`}>
          <Monitor className={`w-5 h-5 ${darkMode ? 'text-green-400' : 'text-green-500'}`} title="Desktop optimized" />
          <Tablet className={`w-5 h-5 ${darkMode ? 'text-blue-400' : 'text-blue-500'}`} title="Tablet friendly" />
          <Smartphone className={`w-5 h-5 ${darkMode ? 'text-purple-400' : 'text-purple-500'}`} title="Mobile ready" />
        </div>
      </div>

      {/* 🌟 Background Decorative Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl animate-pulse-slow"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-pink-500/10 rounded-full blur-3xl animate-pulse-slow"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl animate-spin-slow"></div>
        
        {/* Floating Elements */}
        <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-purple-400/30 rounded-full animate-float"></div>
        <div className="absolute top-3/4 right-1/4 w-3 h-3 bg-pink-400/30 rounded-full animate-float" style={{ animationDelay: '1s' }}></div>
        <div className="absolute bottom-1/3 left-1/3 w-1.5 h-1.5 bg-blue-400/30 rounded-full animate-float" style={{ animationDelay: '2s' }}></div>
      </div>
    </div>
  );
};

export default ViralClipsAI;import React, { useState, useRef, useEffect } from 'react';
import { 
  Upload, Video, Scissors, Play, Settings, 
  Zap, FileVideo, Camera, Star,
  Clock, AlertCircle, CheckCircle, X, Menu, Sun, Moon, User, Download,
  ExternalLink, Github, Twitter, MessageCircle, Heart, Share2,
  BarChart3, TrendingUp, Eye, Sparkles, Filter, Edit3, Link,
  CloudUpload, Globe, Smartphone, Monitor, Tablet
} from 'lucide-react';

// Import API service
import klapApiService from './services/klapApi';

// Utility functions
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
  const maxSize = 2 * 1024 * 1024 * 1024; // 2GB
  
  if (!validTypes.includes(file.type)) {
    return { valid: false, error: 'Invalid file type. Use MP4, MOV, AVI, MKV, or WebM.' };
  }
  
  if (file.size > maxSize) {
    return { valid: false, error: 'File size too large. Maximum 2GB allowed.' };
  }
  
  return { valid: true };
};

const validateVideoUrl = (url) => {
  if (!url) return { valid: false, error: 'Please enter a URL' };
  
  const youtubeRegex = /(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/;
  const vimeoRegex = /vimeo\.com\/(\d+)/;
  const directVideoRegex = /\.(mp4|mov|avi|mkv|webm)(\?|$)/i;
  
  if (youtubeRegex.test(url) || vimeoRegex.test(url) || directVideoRegex.test(url) || url.startsWith('http')) {
    return { valid: true };
  }
  
  return { valid: false, error: 'Please enter a valid video URL (YouTube, Vimeo, or direct video link)' };
};

const ViralClipsAI = () => {
  // Core state management
  const [currentTab, setCurrentTab] = useState('upload');
  const [uploadedVideo, setUploadedVideo] = useState(null);
  const [videoUrl, setVideoUrl] = useState('');
  const [processing, setProcessing] = useState(false);
  const [processingProgress, setProcessingProgress] = useState(0);
  const [processingStage, setProcessingStage] = useState('');
  const [generatedClips, setGeneratedClips] = useState([]);
  const [selectedClip, setSelectedClip] = useState(null);
  
  // Settings and configuration
  const [apiKey, setApiKey] = useState('');
  const [apiKeyValid, setApiKeyValid] = useState(false);
  const [accountInfo, setAccountInfo] = useState(null);
  const [showSettings, setShowSettings] = useState(false);
  const [darkMode, setDarkMode] = useState(true);
  
  // UI state
  const [notification, setNotification] = useState(null);
  const [videoMetadata, setVideoMetadata] = useState(null);
  const [dragOver, setDragOver] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  // Processing options
  const [processingOptions, setProcessingOptions] = useState({
    clipCount: 3,
    maxDuration: 30,
    aspectRatio: '9:16',
    addCaptions: true,
    autoReframe: true,
    platform: 'TikTok',
    language: 'en'
  });

  const fileInputRef = useRef(null);

  // 🔄 Load saved settings on component mount
  useEffect(() => {
    const savedApiKey = klapApiService.getApiKey();
    const savedDarkMode = localStorage.getItem('dark_mode') !== 'false';
    const savedOptions = localStorage.getItem('processing_options');
    
    setApiKey(savedApiKey);
    setDarkMode(savedDarkMode);
    
    if (savedOptions) {
      try {
        setProcessingOptions(JSON.parse(savedOptions));
      } catch (error) {
        console.log('Failed to load processing options:', error);
      }
    }
    
    if (savedApiKey) {
      validateApiKey(savedApiKey);
    }
  }, []);

  // 💾 Save processing options when they change
  useEffect(() => {
    localStorage.setItem('processing_options', JSON.stringify(processingOptions));
  }, [processingOptions]);

  // 🔔 Notification system
  const showNotification = (message, type = 'info', duration = 5000) => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), duration);
  };

  // 🔑 API key validation
  const validateApiKey = async (key = apiKey) => {
    if (!key.trim()) {
      setApiKeyValid(false);
      setAccountInfo(null);
      return;
    }

    try {
      setProcessing(true);
      klapApiService.setApiKey(key);
      const validation = await klapApiService.validateApiKey();
      
      if (validation.valid) {
        setApiKeyValid(true);
        setAccountInfo(validation);
        showNotification('✅ API key validated successfully!', 'success');
      } else {
        setApiKeyValid(false);
        setAccountInfo(null);
        showNotification(`❌ ${validation.error}`, 'error');
      }
    } catch (error) {
      setApiKeyValid(false);
      setAccountInfo(null);
      showNotification('❌ Validation failed. Please try again.', 'error');
    } finally {
      setProcessing(false);
    }
  };

  // 🎬 Video processing with progress tracking
  const processVideo = async (videoSource) => {
    if (!apiKeyValid) {
      showNotification('⚠️ Please enter a valid API key in settings first', 'error');
      setShowSettings(true);
      return;
    }

    setProcessing(true);
    setProcessingProgress(0);
    setCurrentTab('processing');

    try {
      // Progress simulation with realistic stages
      const stages = [
        { progress: 15, message: 'Uploading video...' },
        { progress: 30, message: 'Analyzing content...' },
        { progress: 50, message: 'Detecting viral moments...' },
        { progress: 70, message: 'Creating optimized clips...' },
        { progress: 85, message: 'Adding final touches...' },
        { progress: 95, message: 'Preparing downloads...' }
      ];

      // Simulate realistic progress updates
      let currentStage = 0;
      const progressInterval = setInterval(() => {
        if (currentStage < stages.length) {
          setProcessingProgress(stages[currentStage].progress);
          setProcessingStage(stages[currentStage].message);
          currentStage++;
        }
      }, 600);

      const result = await klapApiService.generateShorts(videoSource, processingOptions);

      clearInterval(progressInterval);
      setProcessingProgress(100);
      setProcessingStage('Complete!');

      setTimeout(() => {
        setGeneratedClips(result.clips || []);
        setCurrentTab('results');
        showNotification(`🎉 Generated ${result.clips?.length || 0} viral clips!`, 'success');
        setProcessingStage('');
      }, 800);

    } catch (error) {
      showNotification(`❌ Processing failed: ${error.message}`, 'error');
      setCurrentTab('upload');
      console.error('Processing error:', error);
    } finally {
      setProcessing(false);
      setProcessingProgress(0);
    }
  };

  // 📁 File upload handling with metadata extraction
  const handleFileUpload = async (file) => {
    const validation = validateVideoFile(file);
    if (!validation.valid) {
      showNotification(`❌ ${validation.error}`, 'error');
      return;
    }

    setUploadedVideo(file);
    const url = URL.createObjectURL(file);
    setVideoUrl(url);
    
    // Extract video metadata
    const video = document.createElement('video');
    video.preload = 'metadata';
    
    video.onloadedmetadata = () => {
      setVideoMetadata({
        name: file.name,
        size: formatFileSize(file.size),
        duration: formatDuration(video.duration),
        resolution: `${video.videoWidth}x${video.videoHeight}`,
        type: file.type,
        aspectRatio: video.videoWidth / video.videoHeight,
        isVertical: video.videoHeight > video.videoWidth,
        rawDuration: video.duration,
        rawSize: file.size
      });
      URL.revokeObjectURL(video.src);
    };
    
    video.onerror = () => {
      showNotification('❌ Failed to read video metadata', 'error');
    };
    
    video.src = url;
    showNotification('✅ Video uploaded successfully!', 'success');
  };

  // 🔗 URL processing
  const handleUrlSubmit = () => {
    const validation = validateVideoUrl(videoUrl);
    if (!validation.valid) {
      showNotification(`❌ ${validation.error}`, 'error');
      return;
    }
    
    setUploadedVideo(null);
    setVideoMetadata({
      name: 'Video from URL',
      url: videoUrl,
      type: 'URL',
      isUrl: true
    });
    
    showNotification('✅ URL ready for processing!', 'success');
  };

  // 🖱️ Drag & drop handling
  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    const videoFile = files.find(file => file.type.startsWith('video/'));
    
    if (videoFile) {
      handleFileUpload(videoFile);
    } else {
      showNotification('❌ Please drop a video file', 'error');
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setDragOver(false);
  };

  // 📥 Download clip functionality
  const downloadClip = async (clip) => {
    try {
      showNotification('📥 Starting download...', 'info');
      await klapApiService.downloadClip(clip);
      showNotification('✅ Download completed!', 'success');
    } catch (error) {
      showNotification('❌ Download failed. Please try again.', 'error');
    }
  };

  // 🔗 Share clip functionality
  const shareClip = async (clip) => {
    try {
      const result = await klapApiService.shareClip(clip);
      
      if (result.success) {
        if (result.method === 'native') {
          showNotification('✅ Shared successfully!', 'success');
        } else {
          showNotification('🔗 Link copied to clipboard!', 'success');
        }
      } else {
        showNotification('❌ Share failed', 'error');
      }
    } catch (error) {
      showNotification('❌ Share failed', 'error');
    }
  };

  // 🌙 Theme toggle
  const toggleTheme = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    localStorage.setItem('dark_mode', newDarkMode.toString());
    showNotification(`🎨 Switched to ${newDarkMode ? 'Dark' : 'Light'} theme`, 'info', 2000);
  };

  // 🔄 Reset app state
  const resetApp = () => {
    setUploadedVideo(null);
    setVideoUrl('');
    setVideoMetadata(null);
    setGeneratedClips([]);
    setSelectedClip(null);
    setProcessing(false);
    setProcessingProgress(0);
    setCurrentTab('upload');
    showNotification('🔄 App reset successfully', 'info', 2000);
  };

  return (
    <div className={`min-h-screen transition-all duration-500 ${
      darkMode 
        ? 'bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900' 
        : 'bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50'
    }`}>
      
      {/* 🔔 Notification System */}
      {notification && (
        <div className={`fixed top-4 right-4 p-4 rounded-xl shadow-2xl text-white z-50 max-w-md transform transition-all duration-300 ${
          notification.type === 'success' ? 'bg-gradient-to-r from-green-500 to-emerald-500' : 
          notification.type === 'error' ? 'bg-gradient-to-r from-red-500 to-pink-500' : 
          'bg-gradient-to-r from-blue-500 to-cyan-500'
        }`}>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <p className="font-medium">{notification.message}</p>
            </div>
            <button 
              onClick={() => setNotification(null)}
              className="ml-3 hover:bg-white/20 rounded-lg p-1 transition-colors"
            >
              <X size={16} />
            </button>
          </div>
        </div>
      )}

      {/* 📱 Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden" onClick={() => setMobileMenuOpen(false)}>
          <div className={`absolute top-0 right-0 h-full w-64 ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-xl transform transition-transform duration-300`}>
            <div className="p-4 space-y-4">
              <button
                onClick={() => setShowSettings(true)}
                className={`w-full text-left p-3 rounded-lg transition-colors ${
                  darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
                }`}
              >
                <Settings className="w-5 h-5 inline mr-2" />
                Settings
              </button>
              <button
                onClick={toggleTheme}
                className={`w-full text-left p-3 rounded-lg transition-colors ${
                  darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
                }`}
              >
                {darkMode ? <Sun className="w-5 h-5 inline mr-2" /> : <Moon className="w-5 h-5 inline mr-2" />}
                {darkMode ? 'Light Mode' : 'Dark Mode'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 🎯 Header */}
      <header className="relative z-10 p-4 lg:p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between">
            
            {/* 🏷️ Logo & Brand */}
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 lg:w-12 lg:h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center text-xl lg:text-2xl animate-pulse-slow">
                🎬
              </div>
              <div>
                <h1 className={`text-xl lg:text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                  ViralClips AI
                </h1>
                <p className={`text-xs lg:text-sm ${darkMode ? 'text-purple-200' : 'text-purple-600'}`}>
                  Turn videos into viral shorts
                </p>
              </div>
            </div>

            {/* 🎛️ Header Actions */}
            <div className="flex items-center space-x-2 lg:space-x-4">
              
              {/* 📊 API Status Indicator */}
              {apiKeyValid && accountInfo && (
                <div className="hidden lg:flex items-center space-x-2 px-3 py-2 bg-green-500/20 rounded-full backdrop-blur-sm">
                  <CheckCircle size={16} className="text-green-400" />
                  <span className={`text-sm ${darkMode ? 'text-green-200' : 'text-green-700'}`}>
                    {accountInfo.credits} credits
                  </span>
                </div>
              )}

              {/* 🌙 Theme Toggle */}
              <button
                onClick={toggleTheme}
                className={`p-2 lg:p-3 rounded-lg transition-all duration-300 ${
                  darkMode ? 'bg-white/10 hover:bg-white/20' : 'bg-gray-200 hover:bg-gray-300'
                } hover:scale-105`}
                title={`Switch to ${darkMode ? 'Light' : 'Dark'} mode`}
              >
                {darkMode ? <Sun size={18} /> : <Moon size={18} />}
              </button>

              {/* ⚙️ Settings Button */}
              <button
                onClick={() => setShowSettings(true)}
                className={`p-2 lg:p-3 rounded-lg transition-all duration-300 ${
                  darkMode ? 'bg-white/10 hover:bg-white/20' : 'bg-gray-200 hover:bg-gray-300'
                } hover:scale-105`}
                title="Open Settings"
              >
                <Settings size={18} />
              </button>

              {/* 📱 Mobile Menu Button */}
              <button
                onClick={() => setMobileMenuOpen(true)}
                className={`p-2 rounded-lg transition-colors lg:hidden ${
                  darkMode ? 'bg-white/10 hover:bg-white/20' : 'bg-gray-200 hover:bg-gray-300'
                }`}
              >
                <Menu size={18} />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* 🗂️ Main Content */}
      <main className="relative z-10 px-4 lg:px-6 pb-6">
        <div className="max-w-7xl mx-auto">
          
          {/* 📑 Navigation Tabs */}
          <div className="flex flex-wrap gap-2 mb-6 lg:mb-8 overflow-x-auto">
            {[
              { id: 'upload', label: 'Upload Video', icon: Upload, color: 'from-purple-500 to-pink-500' },
              { id: 'processing', label: 'Processing', icon: Zap, color: 'from-yellow-500 to-orange-500' },
              { id: 'results', label: 'Results', icon: Video, color: 'from-green-500 to-blue-500' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setCurrentTab(tab.id)}
                disabled={tab.id === 'processing' && !processing}
                className={`flex items-center space-x-2 px-4 lg:px-6 py-2 lg:py-3 rounded-lg font-medium transition-all duration-300 flex-shrink-0 ${
                  currentTab === tab.id
                    ? `bg-gradient-to-r ${tab.color} text-white shadow-lg transform scale-105`
                    : darkMode
                    ? 'bg-white/10 text-purple-200 hover:bg-white/20 hover:scale-105'
                    : 'bg-white/50 text-purple-600 hover:bg-white/70 hover:scale-105'
                } ${tab.id === 'processing' && !processing ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <tab.icon size={16} />
                <span className="text-sm lg:text-base">{tab.label}</span>
              </button>
            ))}
          </div>

          {/* 📤 Upload Tab */}
          {currentTab === 'upload' && (
            <div className="space-y-6 lg:space-y-8">
              
              {/* 🦸 Hero Section */}
              <div className="text-center py-8 lg:py-12">
                <div className="w-16 h-16 lg:w-20 lg:h-20 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center text-3xl lg:text-4xl mx-auto mb-6 animate-bounce-slow">
                  🚀
                </div>
                <h2 className={`text-3xl lg:text-5xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                  Create Viral Clips with AI
                </h2>
                <p className={`text-lg lg:text-xl mb-8 ${darkMode ? 'text-purple-200' : 'text-purple-600'} max-w-3xl mx-auto leading-relaxed`}>
                  Upload your long-form video and let our AI extract the most engaging moments 
                  that are guaranteed to go viral on TikTok, YouTube Shorts, and Instagram Reels.
                </p>
                
                {/* 📈 Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6 max-w-3xl mx-auto mb-8 lg:mb-12">
                  {[
                    { icon: Video, label: 'Videos Processed', value: '10K+', color: 'text-blue-400' },
                    { icon: Sparkles, label: 'Clips Generated', value: '50K+', color: 'text-purple-400' },
                    { icon: TrendingUp, label: 'Success Rate', value: '95%', color: 'text-green-400' }
                  ].map((stat, index) => (
                    <div key={index} className={`p-4 lg:p-6 rounded-xl ${
                      darkMode ? 'bg-white/10 hover:bg-white/15' : 'bg-white/50 hover:bg-white/70'
                    } backdrop-blur-lg transition-all duration-300 hover:transform hover:-translate-y-1`}>
                      <stat.icon className={`w-6 h-6 lg:w-8 lg:h-8 ${stat.color} mx-auto mb-2`} />
                      <div className={`text-xl lg:text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                        {stat.value}
                      </div>
                      <div className={`text-xs lg:text-sm ${darkMode ? 'text-purple-200' : 'text-purple-600'}`}>
                        {stat.label}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 📤 Upload Methods */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
                
                {/* 📁 File Upload Zone */}
                <div 
                  className={`p-6 lg:p-8 rounded-2xl border-2 border-dashed transition-all duration-300 cursor-pointer group ${
                    dragOver 
                      ? 'border-purple-400 bg-purple-500/10 scale-105' 
                      : darkMode 
                      ? 'border-white/30 bg-white/5 hover:bg-white/10 hover:border-purple-400' 
                      : 'border-gray-300 bg-white/30 hover:bg-white/50 hover:border-purple-400'
                  } hover:scale-102`}
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onClick={() => fileInputRef.current?.click()}
                >
                  <div className="text-center">
                    <div className={`w-16 h-16 lg:w-20 lg:h-20 mx-auto mb-4 rounded-full ${
                      dragOver ? 'bg-purple-500/20' : darkMode ? 'bg-white/10' : 'bg-purple-100'
                    } flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                      <Upload className={`w-8 h-8 lg:w-10 lg:h-10 ${
                        dragOver ? 'text-purple-400' : darkMode ? 'text-purple-300' : 'text-purple-500'
                      }`} />
                    </div>
                    <h3 className={`text-xl lg:text-2xl font-semibold mb-2 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                      {dragOver ? 'Drop Video Here!' : 'Upload Video File'}
                    </h3>
                    <p className={`mb-4 ${darkMode ? 'text-purple-200' : 'text-purple-600'}`}>
                      Drag & drop or click to browse
                    </p>
                    <div className={`text-sm space-y-1 ${darkMode ? 'text-purple-300' : 'text-purple-500'}`}>
                      <p>📁 Supports: MP4, MOV, AVI, MKV, WebM</p>
                      <p>📏 Max size: 2GB</p>
                      <p>⏱️ Max duration: 1 hour</p>
                    </div>
                  </div>
                  
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="video/*"
                    onChange={(e) => e.target.files[0] && handleFileUpload(e.target.files[0])}
                    className="hidden"
                  />
                </div>

                {/* 🔗 URL Input Zone */}
                <div className={`p-6 lg:p-8 rounded-2xl ${
                  darkMode ? 'bg-white/10 hover:bg-white/15' : 'bg-white/50 hover:bg-white/70'
                } backdrop-blur-lg transition-all duration-300 hover:scale-102`}>
                  <div className="text-center mb-6">
                    <div className={`w-16 h-16 lg:w-20 lg:h-20 mx-auto mb-4 rounded-full ${
                      darkMode ? 'bg-white/10' : 'bg-blue-100'
                    } flex items-center justify-center hover:scale-110 transition-transform duration-300`}>
                      <Globe className={`w-8 h-8 lg:w-10 lg:h-10 ${darkMode ? 'text-blue-300' : 'text-blue-500'}`} />
                    </div>
                    <h3 className={`text-xl lg:text-2xl font-semibold mb-2 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                      Process from URL
                    </h3>
                    <p className={`${darkMode ? 'text-purple-200' : 'text-purple-600'}`}>
                      YouTube, Vimeo, or direct video links
                    </p>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="relative">
                      <Link className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 ${
                        darkMode ? 'text-purple-300' : 'text-purple-500'
                      }`} />
                      <input
                        type="url"
                        value={videoUrl}
                        onChange={(e) => setVideoUrl(e.target.value)}
                        placeholder="https://youtube.com/watch?v=..."
                        className={`w-full pl-12 pr-4 py-3 lg:py-4 rounded-lg border transition-all duration-300 ${
                          darkMode 
                            ? 'bg-black/30 border-white/20 text-white placeholder-purple-200 focus:border-purple-400 focus:bg-black/50' 
                            : 'bg-white border-gray-300 text-gray-800 placeholder-gray-500 focus:border-purple-400 focus:bg-white'
                        } focus:outline-none focus:ring-2 focus:ring-purple-400/20`}
                      />
                    </div>
                    
                    {/* 🌐 Platform Icons */}
                    <div className="flex justify-center space-x-4 mb-4">
                      {[
                        { name: 'YouTube', emoji: '🎬', color: 'text-red-500' },
                        { name: 'Vimeo', emoji: '📹', color: 'text-blue-500' },
                        { name: 'Direct', emoji: '🔗', color: 'text-green-500' }
                      ].map((platform) => (
                        <div key={platform.name} className="text-center">
                          <div className={`text-2xl mb-1 ${platform.color}`}>
                            {platform.emoji}
                          </div>
                          <div className={`text-xs ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                            {platform.name}
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    <button
                      onClick={handleUrlSubmit}
                      disabled={!videoUrl.trim()}
                      className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-semibold py-3 lg:py-4 px-6 rounded-lg hover:from-blue-600 hover:to-cyan-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:-translate-y-0.5 hover:shadow-lg"
                    >
                      <ExternalLink className="w-5 h-5 inline mr-2" />
                      Process URL
                    </button>
                  </div>
                </div>
              </div>

              {/* 🎬 Video Preview Section */}
              {(uploadedVideo || (videoMetadata && videoMetadata.isUrl)) && (
                <div className={`p-6 rounded-2xl ${
                  darkMode ? 'bg-white/10' : 'bg-white/50'
                } backdrop-blur-lg border border-white/20`}>
                  <h3 className={`text-lg lg:text-xl font-semibold mb-6 flex items-center ${
                    darkMode ? 'text-white' : 'text-gray-800'
                  }`}>
                    <FileVideo className="w-6 h-6 mr-2 text-purple-500" />
                    Video Ready for Processing
                  </h3>
                  
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* 🎥 Video Preview */}
                    <div className="space-y-4">
                      {uploadedVideo && (
                        <video
                          src={videoUrl}
                          controls
                          className="w-full rounded-lg shadow-lg"
                          style={{ maxHeight: '300px' }}
                        />
                      )}
                      
                      {videoMetadata && videoMetadata.isUrl && (
                        <div className={`p-6 rounded-lg border-2 border-dashed ${
                          darkMode ? 'border-purple-400 bg-purple-500/10' : 'border-purple-300 bg-purple-50'
                        }`}>
                          <Globe className="w-12 h-12 text-purple-500 mx-auto mb-3" />
                          <p className={`text-center ${darkMode ? 'text-purple-200' : 'text-purple-700'}`}>
                            Ready to process video from URL
                          </p>
                          <p className={`text-center text-sm mt-2 ${darkMode ? 'text-gray-300' : 'text-gray-600'} break-all`}>
                            {videoUrl}
                          </p>
                        </div>
                      )}
                      
                      {/* 🚀 Process Button */}
                      <button
                        onClick={() => processVideo(uploadedVideo ? { file: uploadedVideo } : { url: videoUrl })}
                        disabled={processing}
                        className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold py-4 px-6 rounded-lg hover:from-purple-600 hover:to-pink-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:-translate-y-0.5 hover:shadow-xl text-lg"
                      >
                        {processing ? (
                          <div className="flex items-center justify-center space-x-2">
                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                            <span>Processing...</span>
                          </div>
                        ) : (
                          <div className="flex items-center justify-center space-x-2">
                            <Sparkles size={20} />
                            <span>Generate Viral Clips</span>
                          </div>
                        )}
                      </button>
                    </div>

                    {/* 📊 Video Info */}
                    {videoMetadata && (
                      <div className="space-y-4">
                        <h4 className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                          📋 Video Information
                        </h4>
                        <div className="space-y-3">
                          {[
                            { label: 'File Name', value: videoMetadata.name, icon: '📄' },
                            { label: 'File Size', value: videoMetadata.size, icon: '📏' },
                            { label: 'Duration', value: videoMetadata.duration, icon: '⏱️' },
                            { label: 'Resolution', value: videoMetadata.resolution, icon: '🖥️' },
                            { label: 'Format', value: videoMetadata.type, icon: '🎞️' }
                          ].filter(item => item.value && !videoMetadata.isUrl).map((item, index) => (
                            <div key={index} className="flex justify-between items-center">
                              <span className={`flex items-center ${darkMode ? 'text-purple-200' : 'text-purple-600'}`}>
                                <span className="mr-2">{item.icon}</span>
                                {item.label}:
                              </span>
                              <span className={`font-medium text-right max-w-xs truncate ${
                                darkMode ? 'text-white' : 'text-gray-800'
                              }`} title={item.value}>
                                {item.value}
                              </span>
                            </div>
                          ))}
                          
                          {/* 📱 Optimization Recommendations */}
                          {videoMetadata && !videoMetadata.isUrl && (
                            <div className={`mt-4 p-4 rounded-lg ${
                              darkMode ? 'bg-blue-500/10 border border-blue-500/30' : 'bg-blue-50 border border-blue-200'
                            }`}>
                              <h5 className={`font-medium mb-2 flex items-center ${
                                darkMode ? 'text-blue-200' : 'text-blue-700'
                              }`}>
                                <Sparkles className="w-4 h-4 mr-1" />
                                AI Recommendations
                              </h5>
                              <div className="space-y-1 text-sm">
                                {videoMetadata.isVertical ? (
                                  <p className={`${darkMode ? 'text-green-300' : 'text-green-600'}`}>
                                    ✅ Perfect for mobile platforms
                                  </p>
                                ) : (
                                  <p className={`${darkMode ? 'text-yellow-300' : 'text-yellow-600'}`}>
                                    📱 Will auto-reframe for vertical format
                                  </p>
                                )}
                                {videoMetadata.rawDuration > 300 && (
                                  <p className={`${darkMode ? 'text-blue-300' : 'text-blue-600'}`}>
                                    ✂️ Great length for multiple clips
                                  </p>
                                )}
                                {videoMetadata.rawSize > 100 * 1024 * 1024 && (
                                  <p className={`${darkMode ? 'text-purple-300' : 'text-purple-600'}`}>
                                    🗜️ Will optimize file size
                                  </p>
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* ✨ Features Showcase */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
                {[
                  { icon: Sparkles, title: 'AI Detection', desc: 'Finds viral moments automatically', color: 'text-purple-400' },
                  { icon: BarChart3, title: 'Viral Score', desc: 'Rates each clip\'s potential', color: 'text-green-400' },
                  { icon: Edit3, title: 'Auto Editing', desc: 'Perfect cuts and transitions', color: 'text-blue-400' },
                  { icon: Share2, title: 'Multi-Platform', desc: 'Optimized for all socials', color: 'text-pink-400' }
                ].map((feature, index) => (
                  <div key={index} className={`p-4 lg:p-6 rounded-xl ${
                    darkMode ? 'bg-white/5 hover:bg-white/10' : 'bg-white/30 hover:bg-white/50'
                  } backdrop-blur-lg transition-all duration-300 hover:transform hover:-translate-y-2 group`}>
                    <feature.icon className={`w-6 h-6 lg:w-8 lg:h-8 mb-3 ${feature.color} group-hover:scale-110 transition-transform duration-300`} />
                    <h4 className={`font-semibold mb-2 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                      {feature.title}
                    </h4>
                    <p className={`text-sm ${darkMode ? 'text-purple-200' : 'text-purple-600'}`}>
                      {feature.desc}
                    </p>
                  </div>
                ))}
              </div>

              {/* 📋 Processing Options Preview */}
              {(uploadedVideo || videoUrl) && (
                <div className={`p-6 rounded-xl ${
                  darkMode ? 'bg-white/5 border border-white/10' : 'bg-white/40 border border-gray-200'
                } backdrop-blur-lg`}>
                  <h4 className={`font-semibold mb-4 flex items-center ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                    <Filter className="w-5 h-5 mr-2 text-purple-500" />
                    Current Processing Settings
                  </h4>
                  
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                    <div>
                      <span className={`block ${darkMode ? 'text-purple-200' : 'text-purple-600'}`}>Platform:</span>
                      <span className={`font-medium ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                        {processingOptions.platform}
                      </span>
                    </div>
                    <div>
                      <span className={`block ${darkMode ? 'text-purple-200' : 'text-purple-600'}`}>Clips:</span>
                      <span className={`font-medium ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                        {processingOptions.clipCount}
                      </span>
                    </div>
                    <div>
                      <span className={`block ${darkMode ? 'text-purple-200' : 'text-purple-600'}`}>Max Duration:</span>
                      <span className={`font-medium ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                        {processingOptions.maxDuration}s
                      </span>
                    </div>
                    <div>
                      <span className={`block ${darkMode ? 'text-purple-200' : 'text-purple-600'}`}>Aspect Ratio:</span>
                      <span className={`font-medium ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                        {processingOptions.aspectRatio}
                      </span>
                    </div>
                  </div>
                  
                  <button
                    onClick={() => setShowSettings(true)}
                    className={`mt-4 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      darkMode ? 'bg-white/10 hover:bg-white/20 text-purple-200' : 'bg-purple-100 hover:bg-purple-200 text-purple-700'
                    }`}
                  >
                    Customize Settings
                  </button>
                </div>
              )}
            </div>
          )}

          {/* ⚡ Processing Tab */}
          {currentTab === 'processing' && (
            <div className="max-w-4xl mx-auto text-center">
              <div className={`p-8 lg:p-12 rounded-2xl ${
                darkMode ? 'bg-white/10' : 'bg-white/50'
              } backdrop-blur-lg border border-white/20`}>
                
                {/* 🔄 Processing Animation */}
                <div className="w-24 h-24 lg:w-32 lg:h-32 mx-auto mb-8 relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-500 via-pink-500 to-yellow-500 rounded-full animate-spin">
                    <div className={`absolute inset-2 ${
                      darkMode ? 'bg-gradient-to-br from-purple-900 to-blue-900' : 'bg-gradient-to-br from-blue-50 to-purple-50'
                    } rounded-full flex items-center justify-center`}>
                      <Scissors className="w-8 h-8 lg:w-12 lg:h-12 text-white animate-pulse" />
                    </div>
                  </div>
                </div>

                {/* 📊 Processing Status */}
                <h3 className={`text-2xl lg:text-3xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                  🎬 Creating Your Viral Clips
                </h3>
                
                <p className={`text-lg mb-6 ${darkMode ? 'text-purple-200' : 'text-purple-600'}`}>
                  Our AI is analyzing your video to find the most engaging moments...
                </p>

                {/* 📈 Progress Bar */}
                <div className="w-full max-w-md mx-auto mb-6">
                  <div className="flex justify-between items-center mb-2">
                    <span className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                      Progress
                    </span>
                    <span className={`text-sm font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                      {Math.round(processingProgress)}%
                    </span>
                  </div>
                  <div className={`w-full h-4 rounded-full overflow-hidden ${
                    darkMode ? 'bg-white/20' : 'bg-gray-200'
                  }`}>
                    <div 
                      className="h-full bg-gradient-to-r from-purple-500 via-pink-500 to-yellow-500 transition-all duration-500 ease-out relative overflow-hidden"
                      style={{ width: `${processingProgress}%` }}
                    >
                      <div className="absolute inset-0 bg-white/30 animate-pulse"></div>
                    </div>
                  </div>
                  {processingStage && (
                    <div className={`text-center mt-3 font-medium ${darkMode ? 'text-purple-200' : 'text-purple-600'}`}>
                      {processingStage}
                    </div>
                  )}
                </div>

                {/* 📋 Processing Steps */}
                <div className="space-y-3 max-w-md mx-auto">
                  {[
                    { step: 'Analyzing video content...', progress: 15, icon: '🔍' },
                    { step: 'Detecting viral moments...', progress: 30, icon: '⚡' },
                    { step: 'Creating optimized clips...', progress: 50, icon: '✂️' },
                    { step: 'Adding final touches...', progress: 85, icon: '✨' }
                  ].map((item, index) => (
                    <div key={index} className={`flex items-center justify-start space-x-3 p-3 rounded-lg transition-all duration-500 ${
                      processingProgress >= item.progress 
                        ? darkMode ? 'bg-green-500/20 text-green-200' : 'bg-green-100 text-green-700'
                        : processingProgress >= item.progress - 10
                        ? darkMode ? 'bg-yellow-500/20 text-yellow-200' : 'bg-yellow-100 text-yellow-700'
                        : darkMode ? 'bg-white/5 text-gray-400' : 'bg-gray-50 text-gray-500'
                    }`}>
                      <div className="flex-shrink-0">
                        {processingProgress >= item.progress ? (
                          <CheckCircle className="w-5 h-5 text-green-400" />
                        ) : processingProgress >= item.progress - 10 ? (
                          <div className="w-5 h-5 border-2 border-yellow-400 border-t-transparent rounded-full animate-spin"></div>
                        ) : (
                          <div className={`w-5 h-5 rounded-full ${darkMode ? 'bg-gray-600' : 'bg-gray-300'}`}></div>
                        )}
                      </div>
                      <div className="flex items-center space-x-2 flex-1 text-left">
                        <span className="text-lg">{item.icon}</span>
                        <span className="text-sm font-medium">{item.step}</span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* ⏱️ Time Estimate */}
                <div className={`mt-8 p-4 rounded-lg ${
                  darkMode ? 'bg-blue-500/10 border border-blue-500/30' : 'bg-blue-50 border border-blue-200'
                }`}>
                  <Clock className={`w-5 h-5 inline mr-2 ${darkMode ? 'text-blue-300' : 'text-blue-600'}`} />
                  <span className={`text-sm ${darkMode ? 'text-blue-200' : 'text-blue-700'}`}>
                    Estimated time remaining: {Math.max(0, Math.ceil((100 - processingProgress) / 10))} minutes
                  </span>
                </div>

                {/* 🔄 Cancel Button */}
                <button
                  onClick={() => {
                    setProcessing(false);
                    setProcessingProgress(0);
                    setProcessingStage('');
                    setCurrentTab('upload');
                    showNotification('Processing cancelled', 'info');
                  }}
                  className={`mt-6 px-6 py-2 rounded-lg font-medium transition-colors ${
                    darkMode ? 'bg-red-500/20 text-red-300 hover:bg-red-500/30' : 'bg-red-100 text-red-600 hover:bg-red-200'
                  }`}
                >
                  Cancel Processing
                </button>
              </div>
            </div>
          )}

          {/* 🎯 Results Tab */}
          {currentTab === 'results' && (
            <div className="space-y-6 lg:space-y-8">
              
              {generatedClips.length === 0 ? (
                <div className="text-center py-12 lg:py-16">
                  <div className={`w-20 h-20 lg:w-24 lg:h-24 mx-auto mb-6 rounded-full ${
                    darkMode ? 'bg-white/10' : 'bg-gray-100'
                  } flex items-center justify-center`}>
                    <Video className={`w-10 h-10 lg:w-12 lg:h-12 ${
                      darkMode ? 'text-purple-300' : 'text-purple-500'
                    } opacity-50`} />
                  </div>
                  <h3 className={`text-xl lg:text-2xl font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                    No clips generated yet
                  </h3>
                  <p className={`${darkMode ? 'text-purple-200' : 'text-purple-600'} mb-8 max-w-md mx-auto`}>
                    Upload a video to get started with AI-powered clip generation
                  </p>
                  <button
                    onClick={() => setCurrentTab('upload')}
                    className="bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold py-3 px-8 rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all duration-300 transform hover:-translate-y-0.5 hover:shadow-lg"
                  >
                    <Upload className="w-5 h-5 inline mr-2" />
                    Upload Video
                  </button>
                </div>
              ) : (
                <>
                  {/* 🎉 Results Header */}
                  <div className="text-center">
                    <div className="w-16 h-16 lg:w-20 lg:h-20 bg-gradient-to-r from-green-500 to-blue-500 rounded-2xl flex items-center justify-center text-3xl lg:text-4xl mx-auto mb-6 animate-bounce-slow">
                      🎉
                    </div>
                    <h2 className={`text-2xl lg:text-3xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                      Your Viral Clips Are Ready!
                    </h2>
                    <p className={`text-lg ${darkMode ? 'text-purple-200' : 'text-purple-600'} max-w-2xl mx-auto`}>
                      AI generated {generatedClips.length} high-potential viral clips optimized for 
                      {generatedClips.length > 0 ? ` ${generatedClips[0].platform}` : ' social media'}
                    </p>
                  </div>

                  {/* 📊 Results Summary */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6">
                    {[
                      { 
                        label: 'Total Clips', 
                        value: generatedClips.length, 
                        icon: Video, 
                        color: 'text-blue-400',
                        bgColor: darkMode ? 'bg-blue-500/10' : 'bg-blue-50'
                      },
                      { 
                        label: 'Avg. Viral Score', 
                        value: Math.round(generatedClips.reduce((acc, clip) => acc + clip.score, 0) / generatedClips.length) + '%', 
                        icon: TrendingUp, 
                        color: 'text-green-400',
                        bgColor: darkMode ? 'bg-green-500/10' : 'bg-green-50'
                      },
                      { 
                        label: 'Total Duration', 
                        value: formatDuration(generatedClips.reduce((acc, clip) => acc + clip.duration, 0)), 
                        icon: Clock, 
                        color: 'text-purple-400',
                        bgColor: darkMode ? 'bg-purple-500/10' : 'bg-purple-50'
                      }
                    ].map((stat, index) => (
                      <div key={index} className={`p-4 lg:p-6 rounded-xl ${stat.bgColor} backdrop-blur-lg transition-all duration-300 hover:transform hover:-translate-y-1`}>
                        <div className="flex items-center justify-between">
                          <div>
                            <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                              {stat.label}
                            </p>
                            <p className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                              {stat.value}
                            </p>
                          </div>
                          <stat.icon className={`w-8 h-8 ${stat.color}`} />
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* 🎬 Clips Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {generatedClips.map((clip) => (
                      <div 
                        key={clip.id} 
                        className={`group p-6 rounded-2xl ${
                          darkMode ? 'bg-white/10 hover:bg-white/15' : 'bg-white/50 hover:bg-white/70'
                        } backdrop-blur-lg transition-all duration-300 hover:transform hover:-translate-y-2 hover:shadow-2xl cursor-pointer border border-white/20`}
                        onClick={() => setSelectedClip(clip)}
                      >
                        {/* 🖼️ Thumbnail */}
                        <div className="relative mb-4 rounded-lg overflow-hidden">
                          <img 
                            src={clip.thumbnail} 
                            alt={clip.title}
                            className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
                          />
                          
                          {/* ▶️ Play Button Overlay */}
                          <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            <div className="w-16 h-16 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center">
                              <Play className="w-8 h-8 text-gray-800 ml-1" />
                            </div>
                          </div>
                          
                          {/* ⏱️ Duration Badge */}
                          <div className="absolute bottom-3 right-3 bg-black/80 text-white text-xs px-2 py-1 rounded-full backdrop-blur-sm">
                            {formatDuration(clip.duration)}
                          </div>
                          
                          {/* 🏷️ Platform Badge */}
                          <div className="absolute top-3 left-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs px-3 py-1 rounded-full font-medium">
                            {clip.platform}
                          </div>
                        </div>

                        {/* 📝 Clip Info */}
                        <div className="space-y-4">
                          <h4 className={`font-semibold text-lg ${darkMode ? 'text-white' : 'text-gray-800'} line-clamp-2`}>
                            {clip.title}
                          </h4>
                          
                          {/* 📊 Viral Score */}
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <span className={`text-sm font-medium ${darkMode ? 'text-purple-200' : 'text-purple-600'}`}>
                                Viral Potential
                              </span>
                              <span className={`text-sm font-bold ${
                                clip.score >= 90 ? 'text-green-400' :
                                clip.score >= 80 ? 'text-yellow-400' : 'text-orange-400'
                              }`}>
                                {clip.score}%
                              </span>
                            </div>
                            <div className={`w-full h-2 rounded-full ${darkMode ? 'bg-white/20' : 'bg-gray-200'} overflow-hidden`}>
                              <div 
                                className={`h-full rounded-full transition-all duration-700 ${
                                  clip.score >= 90 ? 'bg-gradient-to-r from-green-400 to-emerald-500' :
                                  clip.score >= 80 ? 'bg-gradient-to-r from-yellow-400 to-orange-500' :
                                  'bg-gradient-to-r from-orange-400 to-red-500'
                                }`}
                                style={{ width: `${clip.score}%` }}
                              ></div>
                            </div>
                          </div>

                          {/* ⏰ Timestamp */}
                          <div className="flex items-center space-x-2">
                            <Clock className={`w-4 h-4 ${darkMode ? 'text-purple-300' : 'text-purple-500'}`} />
                            <span className={`text-sm ${darkMode ? 'text-purple-200' : 'text-purple-600'}`
