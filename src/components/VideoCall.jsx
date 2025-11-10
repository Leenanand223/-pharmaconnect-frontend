import React, { useState, useEffect } from 'react';
import AgoraRTC from 'agora-rtc-sdk-ng';
import { 
  Video, 
  VideoOff, 
  Mic, 
  MicOff, 
  PhoneOff, 
  Monitor,
  User,
  Settings,
  Maximize2
} from 'lucide-react';

// Agora App ID - You'll need to get this from Agora.io
const APP_ID = import.meta.env.VITE_AGORA_APP_ID || 'demo';

const VideoCall = ({ appointmentId, userName, onEndCall }) => {
  const [client] = useState(() => AgoraRTC.createClient({ mode: 'rtc', codec: 'vp8' }));
  const [localVideoTrack, setLocalVideoTrack] = useState(null);
  const [localAudioTrack, setLocalAudioTrack] = useState(null);
  const [remoteUsers, setRemoteUsers] = useState([]);
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [isJoined, setIsJoined] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState(null);
  const [callDuration, setCallDuration] = useState(0);

  // Generate channel name from appointment ID
  const channelName = `pharma-${appointmentId}`;
  
  // For demo purposes - in production, generate this from your backend
  const token = null; // Use null for testing, get real token from backend in production

  // Timer for call duration
  useEffect(() => {
    if (isJoined) {
      const timer = setInterval(() => {
        setCallDuration(prev => prev + 1);
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [isJoined]);

  // Format call duration
  const formatDuration = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Join video call
  const joinCall = async () => {
    if (!APP_ID || APP_ID === 'demo') {
      setError('Please configure Agora App ID in environment variables');
      return;
    }

    setIsConnecting(true);
    setError(null);

    try {
      // Join the channel
      const uid = await client.join(APP_ID, channelName, token, null);
      console.log('Joined channel successfully with UID:', uid);

      // Create and publish local tracks
      const [audioTrack, videoTrack] = await AgoraRTC.createMicrophoneAndCameraTracks();
      
      setLocalAudioTrack(audioTrack);
      setLocalVideoTrack(videoTrack);

      // Play local video
      videoTrack.play('local-video');

      // Publish tracks
      await client.publish([audioTrack, videoTrack]);
      
      setIsJoined(true);
      setIsConnecting(false);
    } catch (err) {
      console.error('Failed to join call:', err);
      setError(`Failed to join call: ${err.message}`);
      setIsConnecting(false);
    }
  };

  // Leave video call
  const leaveCall = async () => {
    try {
      // Stop and close local tracks
      if (localAudioTrack) {
        localAudioTrack.stop();
        localAudioTrack.close();
      }
      if (localVideoTrack) {
        localVideoTrack.stop();
        localVideoTrack.close();
      }

      // Leave the channel
      await client.leave();
      
      setIsJoined(false);
      setLocalAudioTrack(null);
      setLocalVideoTrack(null);
      setRemoteUsers([]);
      
      if (onEndCall) {
        onEndCall();
      }
    } catch (err) {
      console.error('Failed to leave call:', err);
    }
  };

  // Toggle video
  const toggleVideo = async () => {
    if (localVideoTrack) {
      await localVideoTrack.setEnabled(!isVideoEnabled);
      setIsVideoEnabled(!isVideoEnabled);
    }
  };

  // Toggle audio
  const toggleAudio = async () => {
    if (localAudioTrack) {
      await localAudioTrack.setEnabled(!isAudioEnabled);
      setIsAudioEnabled(!isAudioEnabled);
    }
  };

  // Handle remote users
  useEffect(() => {
    if (!client) return;

    const handleUserPublished = async (user, mediaType) => {
      await client.subscribe(user, mediaType);
      
      if (mediaType === 'video') {
        setRemoteUsers(prev => {
          const exists = prev.find(u => u.uid === user.uid);
          if (exists) {
            return prev.map(u => u.uid === user.uid ? user : u);
          }
          return [...prev, user];
        });
        
        // Play remote video
        setTimeout(() => {
          user.videoTrack?.play(`remote-video-${user.uid}`);
        }, 100);
      }
      
      if (mediaType === 'audio') {
        user.audioTrack?.play();
      }
    };

    const handleUserUnpublished = (user, mediaType) => {
      if (mediaType === 'video') {
        setRemoteUsers(prev => prev.filter(u => u.uid !== user.uid));
      }
    };

    const handleUserLeft = (user) => {
      setRemoteUsers(prev => prev.filter(u => u.uid !== user.uid));
    };

    client.on('user-published', handleUserPublished);
    client.on('user-unpublished', handleUserUnpublished);
    client.on('user-left', handleUserLeft);

    return () => {
      client.off('user-published', handleUserPublished);
      client.off('user-unpublished', handleUserUnpublished);
      client.off('user-left', handleUserLeft);
    };
  }, [client]);

  // Auto-join on mount
  useEffect(() => {
    joinCall();
    
    return () => {
      leaveCall();
    };
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col">
      {/* Header */}
      <div className="bg-gray-800 border-b border-gray-700 px-6 py-4">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-xl font-semibold text-white">Video Consultation</h1>
            <p className="text-sm text-gray-400">
              {isJoined ? `Connected • ${formatDuration(callDuration)}` : 'Connecting...'}
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-sm text-gray-400">
              Room: {channelName}
            </div>
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-500 text-white px-6 py-3 text-center">
          <p className="font-medium">{error}</p>
          {error.includes('App ID') && (
            <p className="text-sm mt-1">
              Get your free App ID from <a href="https://console.agora.io" target="_blank" rel="noopener noreferrer" className="underline">console.agora.io</a>
            </p>
          )}
        </div>
      )}

      {/* Video Grid */}
      <div className="flex-1 p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Remote Video (Pharmacist/Patient) */}
        {remoteUsers.length > 0 ? (
          remoteUsers.map(user => (
            <div key={user.uid} className="relative bg-gray-800 rounded-lg overflow-hidden aspect-video">
              <div id={`remote-video-${user.uid}`} className="w-full h-full"></div>
              <div className="absolute bottom-4 left-4 bg-black bg-opacity-50 px-3 py-1 rounded-full">
                <p className="text-white text-sm font-medium">
                  {user.uid === 'pharmacist' ? 'Dr. Priya Sharma' : 'Remote User'}
                </p>
              </div>
            </div>
          ))
        ) : (
          <div className="relative bg-gray-800 rounded-lg overflow-hidden aspect-video flex items-center justify-center">
            <div className="text-center">
              <div className="w-20 h-20 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                <User className="w-10 h-10 text-gray-400" />
              </div>
              <p className="text-gray-400 text-lg font-medium">Waiting for other participant...</p>
              <p className="text-gray-500 text-sm mt-2">They will appear here when they join</p>
            </div>
          </div>
        )}

        {/* Local Video (You) */}
        <div className="relative bg-gray-800 rounded-lg overflow-hidden aspect-video">
          {isConnecting ? (
            <div className="w-full h-full flex items-center justify-center">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
                <p className="text-white">Connecting to camera...</p>
              </div>
            </div>
          ) : (
            <>
              <div id="local-video" className="w-full h-full"></div>
              {!isVideoEnabled && (
                <div className="absolute inset-0 bg-gray-900 flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-20 h-20 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                      <User className="w-10 h-10 text-gray-400" />
                    </div>
                    <p className="text-gray-400">Camera Off</p>
                  </div>
                </div>
              )}
              <div className="absolute bottom-4 left-4 bg-black bg-opacity-50 px-3 py-1 rounded-full">
                <p className="text-white text-sm font-medium">You ({userName})</p>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Controls */}
      <div className="bg-gray-800 border-t border-gray-700 px-6 py-6">
        <div className="flex justify-center items-center space-x-4">
          {/* Toggle Audio */}
          <button
            onClick={toggleAudio}
            disabled={!isJoined}
            className={`p-4 rounded-full transition-all ${
              isAudioEnabled
                ? 'bg-gray-700 hover:bg-gray-600 text-white'
                : 'bg-red-500 hover:bg-red-600 text-white'
            } disabled:opacity-50 disabled:cursor-not-allowed`}
            title={isAudioEnabled ? 'Mute' : 'Unmute'}
          >
            {isAudioEnabled ? <Mic className="w-6 h-6" /> : <MicOff className="w-6 h-6" />}
          </button>

          {/* Toggle Video */}
          <button
            onClick={toggleVideo}
            disabled={!isJoined}
            className={`p-4 rounded-full transition-all ${
              isVideoEnabled
                ? 'bg-gray-700 hover:bg-gray-600 text-white'
                : 'bg-red-500 hover:bg-red-600 text-white'
            } disabled:opacity-50 disabled:cursor-not-allowed`}
            title={isVideoEnabled ? 'Turn off camera' : 'Turn on camera'}
          >
            {isVideoEnabled ? <Video className="w-6 h-6" /> : <VideoOff className="w-6 h-6" />}
          </button>

          {/* End Call */}
          <button
            onClick={leaveCall}
            className="p-4 rounded-full bg-red-500 hover:bg-red-600 text-white transition-all"
            title="End call"
          >
            <PhoneOff className="w-6 h-6" />
          </button>

          {/* Screen Share (Coming Soon) */}
          <button
            disabled
            className="p-4 rounded-full bg-gray-700 text-gray-500 cursor-not-allowed"
            title="Screen share (coming soon)"
          >
            <Monitor className="w-6 h-6" />
          </button>
        </div>

        <div className="text-center mt-4">
          <p className="text-gray-400 text-sm">
            {isJoined ? '✓ Connected' : isConnecting ? 'Connecting...' : 'Not connected'}
          </p>
        </div>
      </div>
    </div>
  );
};

export default VideoCall;
