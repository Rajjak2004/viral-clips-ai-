import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.REACT_APP_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true
});

export const generateTranscript = async (videoFile, options = {}) => {
  try {
    // Convert video to audio if needed
    const audioFile = await extractAudioFromVideo(videoFile);
    
    const response = await openai.audio.transcriptions.create({
      file: audioFile,
      model: "whisper-1",
      language: options.language || "en",
      response_format: "verbose_json",
      timestamp_granularities: ["segment"],
      temperature: 0.2
    });

    return {
      text: response.text,
      segments: response.segments || [],
      language: response.language,
      duration: response.duration,
      confidence: calculateConfidence(response.segments)
    };
  } catch (error) {
    console.error('Transcript generation failed:', error);
    throw new Error(`Transcript failed: ${error.message}`);
  }
};

const extractAudioFromVideo = async (videoFile) => {
  // For browser compatibility, we'll send the video file directly
  // The Whisper API can handle video files
  return videoFile;
};

const calculateConfidence = (segments) => {
  if (!segments || segments.length === 0) return 0;
  
  const avgConfidence = segments.reduce((sum, segment) => {
    return sum + (segment.confidence || 0.8);
  }, 0) / segments.length;
  
  return Math.round(avgConfidence * 100);
};

export default { generateTranscript };
