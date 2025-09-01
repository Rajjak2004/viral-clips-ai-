import React, { useState, useRef, useEffect } from 'react';
import {
  Upload, Video, Scissors, Download, Play, Settings,
  Zap, FileVideo, Camera, Share2, Star,
  Clock, AlertCircle, CheckCircle, X, Menu, Sun, Moon, User
} from 'lucide-react';

function App() {
  const [darkMode, setDarkMode] = useState(false);

  return (
    <> {/* ✅ Wrapper fragment দিয়ে সব JSX element ঘেরা হলো */}
      <div className={`min-h-screen ${darkMode ? 'bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900' : 'bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50'}`}>
        <header className="p-4 flex justify-between items-center">
          <h1 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
            Viral Clips AI
          </h1>
          <button onClick={() => setDarkMode(!darkMode)}>
            {darkMode ? <Sun /> : <Moon />}
          </button>
        </header>

        <main className="p-4">
          <h2 className={`text-xl mb-4 ${darkMode ? 'text-purple-200' : 'text-gray-700'}`}>
            Upload & Edit Your Clips
          </h2>

          <div className="flex gap-4">
            <button className="p-2 bg-purple-500 text-white rounded-xl flex items-center gap-2">
              <Upload size={20} /> Upload
            </button>
            <button className="p-2 bg-blue-500 text-white rounded-xl flex items-center gap-2">
              <Scissors size={20} /> Edit
            </button>
            <button className="p-2 bg-green-500 text-white rounded-xl flex items-center gap-2">
              <Download size={20} /> Download
            </button>
          </div>
        </main>
      </div>
    </>
  );
}

export default App;
