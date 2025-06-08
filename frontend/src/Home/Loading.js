import React, { useRef, useEffect } from 'react';

const Loading = () => {
  const videoRef = useRef(null); // Create a ref for the video element

  useEffect(() => {
    // Set the playback speed when the component mounts
    if (videoRef.current) {
      videoRef.current.playbackRate = 2.0; // Set desired playback speed (2.0 for 2x speed)
    }
  }, []);

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black z-50">
      <video
        ref={videoRef}
        autoPlay
        loop
        muted
        className="w-1/2 h-auto max-h-1/2 object-cover"
      >
        <source src="logo.mp4" type="video/mp4" />
        <p>Your browser does not support HTML5 video.</p>
      </video>
    </div>
  );
};

export default Loading;
