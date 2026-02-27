
import React, { useRef, useEffect, useState } from 'react';
import { PlayIcon, PauseIcon, VolumeIcon, SettingsIcon } from './Icons';
import { adEngine } from '../services/adEngine';
import { Ad, AdType, Media } from '../types';

interface VideoPlayerProps {
  media: Media;
  onClose: () => void;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ media, onClose }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [showControls, setShowControls] = useState(true);
  const [currentAd, setCurrentAd] = useState<Ad | null>(null);
  const [adTimeLeft, setAdTimeLeft] = useState(0);
  const [hasPlayedPreRoll, setHasPlayedPreRoll] = useState(false);

  // Initialize HLS.js
  useEffect(() => {
    if (videoRef.current && !currentAd) {
      const video = videoRef.current;
      // @ts-ignore
      if (Hls.isSupported()) {
        // @ts-ignore
        const hls = new Hls();
        hls.loadSource(media.hlsUrl);
        hls.attachMedia(video);
      } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = media.hlsUrl;
      }
    }
  }, [media.hlsUrl, currentAd]);

  // Ad Check Logic
  useEffect(() => {
    if (!hasPlayedPreRoll) {
      const preRoll = adEngine.getAdForPlacement(AdType.PRE_ROLL, media);
      if (preRoll) {
        setCurrentAd(preRoll);
        setAdTimeLeft(preRoll.duration);
      }
      setHasPlayedPreRoll(true);
    }
  }, [hasPlayedPreRoll, media]);

  // Mid-roll logic
  useEffect(() => {
    const handleTimeUpdate = () => {
      if (videoRef.current && !currentAd) {
        const currentTime = videoRef.current.currentTime;
        setProgress((currentTime / videoRef.current.duration) * 100);
        
        // Trigger mid-roll at 25% (example logic)
        if (Math.floor(currentTime) === Math.floor(videoRef.current.duration * 0.25)) {
          const midRoll = adEngine.getAdForPlacement(AdType.MID_ROLL, media);
          if (midRoll) {
            videoRef.current.pause();
            setCurrentAd(midRoll);
            setAdTimeLeft(midRoll.duration);
          }
        }
      }
    };

    const video = videoRef.current;
    video?.addEventListener('timeupdate', handleTimeUpdate);
    video?.addEventListener('loadedmetadata', () => setDuration(video.duration));
    
    return () => {
      video?.removeEventListener('timeupdate', handleTimeUpdate);
    };
  }, [currentAd, media]);

  // Ad countdown
  useEffect(() => {
    let interval: any;
    if (currentAd) {
      interval = setInterval(() => {
        setAdTimeLeft(prev => {
          if (prev <= 1) {
            adEngine.recordImpression(currentAd.id, true);
            setCurrentAd(null);
            if (videoRef.current) videoRef.current.play();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [currentAd]);

  const togglePlay = () => {
    if (currentAd) return;
    if (videoRef.current?.paused) {
      videoRef.current.play();
      setIsPlaying(true);
    } else {
      videoRef.current?.pause();
      setIsPlaying(false);
    }
  };

  const skipAd = () => {
    if (currentAd?.skippable) {
      adEngine.recordImpression(currentAd.id, false);
      setCurrentAd(null);
      if (videoRef.current) videoRef.current.play();
    }
  };

  return (
    <div 
      ref={containerRef}
      className="fixed inset-0 bg-black z-50 flex flex-col items-center justify-center cursor-default group"
      onMouseMove={() => setShowControls(true)}
      onMouseLeave={() => setShowControls(false)}
    >
      <button 
        onClick={onClose}
        className="absolute top-6 left-6 text-white/70 hover:text-white transition-colors z-50 p-2"
      >
        <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7"/></svg>
      </button>

      {/* Main Video Element */}
      {!currentAd ? (
        <video 
          ref={videoRef}
          className="w-full h-full object-contain"
          onClick={togglePlay}
          autoPlay
        />
      ) : (
        <div className="w-full h-full flex flex-col items-center justify-center relative bg-zinc-900">
           {currentAd.videoUrl ? (
             <video 
              src={currentAd.videoUrl} 
              autoPlay 
              className="w-full h-full object-cover opacity-80"
             />
           ) : (
             <div className="text-zinc-500 text-xl font-display uppercase tracking-widest">Sponsored Content</div>
           )}
           <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex flex-col items-center justify-center p-8 text-center">
              <div className="mb-4 px-4 py-2 bg-indigo-600/20 text-indigo-400 rounded-full text-sm font-bold border border-indigo-500/30">
                ADVERTISEMENT
              </div>
              <h2 className="text-3xl font-display font-bold text-white mb-2">{currentAd.name}</h2>
              <p className="text-white/60 mb-6 max-w-md">Our sponsors keep classic TV free for everyone. Rewind will return in {adTimeLeft}s.</p>
              
              <div className="flex items-center gap-4">
                <a href={currentAd.linkUrl} target="_blank" rel="noreferrer" className="px-6 py-3 bg-white text-black font-bold rounded-lg hover:bg-zinc-200 transition-colors">Learn More</a>
                {currentAd.skippable && adTimeLeft <= 10 && (
                  <button onClick={skipAd} className="px-6 py-3 bg-zinc-800/80 text-white font-bold rounded-lg border border-zinc-700 hover:bg-zinc-700 transition-colors">Skip Ad</button>
                )}
              </div>
           </div>
           <div className="absolute bottom-12 right-12 bg-black/60 px-4 py-2 rounded-lg text-white font-mono text-sm border border-white/20">
             Ad ends in {adTimeLeft}s
           </div>
        </div>
      )}

      {/* Custom Controls Overlay */}
      {!currentAd && showControls && (
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent px-8 py-10 transition-opacity">
          {/* Progress Bar */}
          <div className="w-full h-1 bg-zinc-800 rounded-full mb-6 cursor-pointer relative overflow-hidden group/bar">
            <div className="absolute left-0 top-0 bottom-0 bg-indigo-500" style={{ width: `${progress}%` }} />
            <div className="absolute left-0 top-0 bottom-0 w-full h-full hover:bg-white/10 transition-colors" />
          </div>

          <div className="flex items-center justify-between text-white">
            <div className="flex items-center gap-6">
              <button onClick={togglePlay} className="hover:text-indigo-400 transition-colors">
                {isPlaying ? <PauseIcon className="w-8 h-8" /> : <PlayIcon className="w-8 h-8" />}
              </button>
              <button className="hover:text-indigo-400 transition-colors">
                <VolumeIcon />
              </button>
              <div className="text-sm font-medium text-zinc-400">
                {Math.floor(videoRef.current?.currentTime || 0)}s / {Math.floor(duration)}s
              </div>
            </div>

            <div className="flex flex-col items-center">
              <span className="text-sm font-display font-bold uppercase tracking-widest text-white/50">{media.title}</span>
            </div>

            <div className="flex items-center gap-6">
              <button className="hover:text-indigo-400 transition-colors">
                <SettingsIcon />
              </button>
              <button className="px-4 py-1.5 border border-white/20 rounded text-xs font-bold hover:bg-white/10 transition-colors">
                1080p HD
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VideoPlayer;
