import { useState, useEffect } from 'react';
import './Loading.css';

export default function Loading({ onLoadingComplete }) {
  const [progress, setProgress] = useState(0);
  const [loadingText, setLoadingText] = useState('Initializing...');

  const loadingStages = [
    'Initializing...',
    'Loading Assets...',
    'Connecting to HackStad...',
    'Preparing Your Experience...',
    'Almost Ready...'
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        const newProgress = prev + Math.random() * 15 + 5;
        const stageIndex = Math.floor((newProgress / 100) * loadingStages.length);
        setLoadingText(loadingStages[Math.min(stageIndex, loadingStages.length - 1)]);
        
        if (newProgress >= 100) {
          clearInterval(interval);
          setTimeout(() => onLoadingComplete && onLoadingComplete(), 500);
          return 100;
        }
        return newProgress;
      });
    }, 200);

    return () => clearInterval(interval);
  }, [onLoadingComplete]);

  return (
    <div className="loading-container">
      <div className="loading-background">
        <div className="gradient-orb orb-1"></div>
        <div className="gradient-orb orb-2"></div>
        <div className="gradient-orb orb-3"></div>
      </div>
      
      <div className="loading-content">
        <div className="logo-container">
          <div className="logo-3d">
            <span className="logo-letter">H</span>
            <span className="logo-letter">a</span>
            <span className="logo-letter">c</span>
            <span className="logo-letter">k</span>
            <span className="logo-letter logo-highlight">S</span>
            <span className="logo-letter">t</span>
            <span className="logo-letter">a</span>
            <span className="logo-letter">d</span>
          </div>
          <div className="logo-reflection">
            <span className="logo-letter-reflect">H</span>
            <span className="logo-letter-reflect">a</span>
            <span className="logo-letter-reflect">c</span>
            <span className="logo-letter-reflect">k</span>
            <span className="logo-letter-reflect logo-highlight-reflect">S</span>
            <span className="logo-letter-reflect">t</span>
            <span className="logo-letter-reflect">a</span>
            <span className="logo-letter-reflect">d</span>
          </div>
        </div>
        
        <div className="loading-ring">
          <div className="ring-segment"></div>
          <div className="ring-segment"></div>
          <div className="ring-segment"></div>
          <div className="ring-segment"></div>
        </div>
        
        <div className="progress-container">
          <div className="progress-bar">
            <div 
              className="progress-fill" 
              style={{ width: `${progress}%` }}
            ></div>
            <div className="progress-glow"></div>
          </div>
          <div className="progress-text">{Math.round(progress)}%</div>
        </div>
        
        <div className="loading-text">{loadingText}</div>
        
        <div className="particle-container">
          {[...Array(20)].map((_, i) => (
            <div key={i} className={`particle particle-${i}`}></div>
          ))}
        </div>
      </div>
    </div>
  );
}
