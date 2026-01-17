"use client";

import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function IntroSplash() {
  const [isVisible, setIsVisible] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    // Check sessionStorage to see if user has already seen the intro
    const hasSeenIntro = sessionStorage.getItem("hasSeenIntro");
    
    if (hasSeenIntro === "true") {
      return; // Don't show intro if already seen
    }

    // Show the intro
    setIsVisible(true);
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    // Mark as seen in sessionStorage
    sessionStorage.setItem("hasSeenIntro", "true");
  };

  const handleVideoEnd = () => {
    handleClose();
  };

  const handleSkip = () => {
    if (videoRef.current) {
      videoRef.current.pause();
    }
    handleClose();
  };

  // Don't render if already seen or not visible
  if (!isVisible) {
    return null;
  }

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1 }}
          className="fixed inset-0 z-[100] bg-black"
        >
          {/* Video */}
          <video
            ref={videoRef}
            autoPlay
            muted
            playsInline
            onEnded={handleVideoEnd}
            className="w-full h-full object-cover"
          >
            <source src="/intro.mp4.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>

          {/* Skip Button */}
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 0.5 }}
            onClick={handleSkip}
            className="absolute bottom-6 right-6 px-4 py-2 bg-black/40 hover:bg-black/60 backdrop-blur-sm border border-white/20 text-white text-sm font-medium rounded-lg transition-all duration-200 hover:border-white/40"
          >
            Skip
          </motion.button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
