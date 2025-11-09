import React from 'react';
import { Settings, Database, TestTube } from 'lucide-react';
import { config, isDemoMode } from '../config';

const ModeToggle = () => {
  const handleModeChange = () => {
    alert(
      `To switch modes:\n\n` +
      `1. Open src/config.js\n` +
      `2. Change mode to '${isDemoMode() ? 'production' : 'demo'}'\n` +
      `3. Restart the dev server\n\n` +
      `Current mode: ${config.mode.toUpperCase()}`
    );
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <button
        onClick={handleModeChange}
        className={`flex items-center space-x-2 px-4 py-2 rounded-lg shadow-lg font-medium transition-all hover:scale-105 ${
          isDemoMode()
            ? 'bg-gradient-to-r from-yellow-400 to-orange-400 text-gray-900'
            : 'bg-gradient-to-r from-green-500 to-blue-500 text-white'
        }`}
        title="Click for instructions to switch modes"
      >
        {isDemoMode() ? (
          <>
            <TestTube className="h-5 w-5" />
            <span>Demo Mode</span>
          </>
        ) : (
          <>
            <Database className="h-5 w-5" />
            <span>Production Mode</span>
          </>
        )}
        <Settings className="h-4 w-4 opacity-70" />
      </button>
    </div>
  );
};

export default ModeToggle;
