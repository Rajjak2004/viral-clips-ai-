import OpenAI from 'openai';
import axios from 'axios';

// Initialize OpenAI
const openai = new OpenAI({
  apiKey: process.env.REACT_APP_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true
});

// Backend API base URL
const API_BASE = process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000';

class RealApiService {
  constructor() {
    this.apiKey = localStorage.getItem('openai_api_key') || '';
  }

  // Set API key
  setApiKey(key) {
    this.apiKey = key;
    localStorage.setItem('openai_api_key', key);
  }

  // Generate transcript using Whisper
  async generateTranscript(videoFile) {
    try {
      console.log('🎤 Generating transcript with Whisper...');
      
      const response = await openai.audio.transcriptions.create({
        file: videoFile,
        model: "whisper-1",
        language: "en",
        response_format: "verbose_json",
        timestamp_granularities: ["segment"]
      });

      return {
        text: response.text,
        segments: response.segments,
        language: response.language,
        duration: response.duration
      };
    } catch (error) {
      console.error('❌ Transcript error:', error);
      throw new Error('Failed to generate transcript');
    }
  }

  // Analyze viral potential with GPT-4
  async analyzeViralPotential(transcript, videoMetadata, platform = 'tiktok') {
    try {
      console.log('📊 Analyzing viral potential...');
      
      const prompt = `Analyze this video content for viral potential on ${platform}.

TRANSCRIPT: "${transcript}"

VIDEO DETAILS:
- Duration: ${videoMetadata.duration}s
- Platform: ${platform}
- Aspect Ratio: ${videoMetadata.aspectRatio}

Please analyze and return JSON with:
{
  "overallScore": 85,
  "hookScore": 90,
  "engagementScore": 80,
  "shareabilityScore": 85,
  "trendingScore": 75,
  "bestMoments": [
    {
      "startTime": 0,
      "endTime": 30,
      "score": 95,
      "reason": "Perfect hook with trending topic",
      "title": "🔥 Viral Opening"
    }
  ],
  "improvements": ["Add trending music", "Enhance captions"],
  "viralFactors": ["Strong hook", "Educational value", "Share-worthy ending"]
}`;

      const response = await openai.chat.completions.create({
        model: "gpt-4-turbo-preview",
        messages: [{ role: "user", content: prompt }],
        response_format: { type: "json_object" },
        temperature: 0.3
      });

      return JSON.parse(response.choices[0].message.content);
    } catch (error) {
      console.error('❌ Viral analysis error:', error);
      throw new Error('Failed to analyze viral potential');
    }
  }

  // Download video from URL
  async downloadFromUrl(url) {
    try {
      console.log('📥 Downloading from URL:', url);
      
      const response = await axios.post(`${API_BASE}/api/download-video`, { url });
      return response.data;
    } catch (error) {
      console.error('❌ URL download error:', error);
      throw new Error('Failed to download video');
    }
  }

  // Process video (trim + subtitles)
  async processVideo(videoFile, options) {
    try {
      console.log('🎬 Processing video...');
      
      const formData = new FormData();
      formData.append('video', videoFile);
      formData.append('startTime', options.startTime);
      formData.append('endTime', options.endTime);
      formData.append('addSubtitles', options.addSubtitles);
      formData.append('subtitleText', options.subtitleText || '');

      const response = await axios.post(`${API_BASE}/api/process-video`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      return response.data;
    } catch (error) {
      console.error('❌ Video processing error:', error);
      throw new Error('Failed to process video');
    }
  }

  // Export to Google Drive
  async exportToGoogleDrive(videoBlob, filename) {
    try {
      console.log('☁️ Exporting to Google Drive...');
      
      // Google Drive API integration here
      // For now, download locally as fallback
      const url = URL.createObjectURL(videoBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      link.click();
      URL.revokeObjectURL(url);
      
      return { success: true, message: 'Downloaded locally (Google Drive integration needed)' };
    } catch (error) {
      console.error('❌ Google Drive export error:', error);
      throw new Error('Export to Google Drive failed');
    }
  }

  // Export to Dropbox
  async exportToDropbox(videoBlob, filename) {
    try {
      console.log('📦 Exporting to Dropbox...');
      
      // Dropbox API integration here
      // For now, download locally as fallback
      const url = URL.createObjectURL(videoBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      link.click();
      URL.revokeObjectURL(url);
      
      return { success: true, message: 'Downloaded locally (Dropbox integration needed)' };
    } catch (error) {
      console.error('❌ Dropbox export error:', error);
      throw new Error('Export to Dropbox failed');
    }
  }

  // Generate clips with real AI
  async generateViralClips(videoFile, options = {}) {
    try {
      console.log('🤖 Generating viral clips with real AI...');
      
      // Step 1: Generate transcript
      const transcriptData = await this.generateTranscript(videoFile);
      
      // Step 2: Analyze viral potential
      const viralAnalysis = await this.analyzeViralPotential(
        transcriptData.text, 
        options.metadata, 
        options.platform || 'tiktok'
      );

      // Step 3: Create clips based on best moments
      const clips = await Promise.all(
        viralAnalysis.bestMoments.map(async (moment, index) => {
          // Process each clip
          const processedVideo = await this.processVideo(videoFile, {
            startTime: moment.startTime,
            endTime: moment.endTime,
            addSubtitles: true,
            subtitleText: this.generateSRT(transcriptData.segments, moment.startTime, moment.endTime)
          });

          return {
            id: `clip_${Date.now()}_${index}`,
            title: moment.title,
            score: moment.score,
            duration: moment.endTime - moment.startTime,
            startTime: moment.startTime,
            endTime: moment.endTime,
            url: processedVideo.processedVideoPath,
            transcript: transcriptData.text.substring(
              Math.floor(moment.startTime * 10), 
              Math.floor(moment.endTime * 10)
            ),
            viralFactors: viralAnalysis.viralFactors,
            improvements: viralAnalysis.improvements,
            reason: moment.reason
          };
        })
      );

      return {
        clips,
        analysis: viralAnalysis,
        transcript: transcriptData,
        processingTime: Date.now() - this.startTime
      };
      
    } catch (error) {
      console.error('❌ Clip generation error:', error);
      throw error;
    }
  }

  // Generate SRT subtitle format
  generateSRT(segments, startTime = 0, endTime = null) {
    let srtContent = '';
    let index = 1;

    segments.forEach(segment => {
      if (segment.start >= startTime && (!endTime || segment.end <= endTime)) {
        const start = this.formatSRTTime(segment.start - startTime);
        const end = this.formatSRTTime(segment.end - startTime);
        
        srtContent += `${index}\n${start} --> ${end}\n${segment.text}\n\n`;
        index++;
      }
    });

    return srtContent;
  }

  // Format time for SRT
  formatSRTTime(seconds) {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    const ms = Math.floor((seconds % 1) * 1000);
    
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')},${ms.toString().padStart(3, '0')}`;
  }
}

export default new RealApiService();
