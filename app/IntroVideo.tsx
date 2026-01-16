"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";

export default function IntroVideo() {
  const [show, setShow] = useState(true);
  const pathname = usePathname();

  useEffect(() => {
    // Only show intro on the home page ("/")
    if (pathname !== "/") {
      setShow(false);
    }
  }, [pathname]);

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-[9999] bg-black flex items-center justify-center">
      <video 
        autoPlay 
        muted 
        playsInline
        className="w-full h-full object-cover"
        onEnded={() => setShow(false)} // Hides automatically when video ends
      >
       <source src="/intro.mp4" type="video/mp4" />
      </video>
      
      {/* Skip Button */}
      <button 
        onClick={() => setShow(false)}
        className="absolute bottom-10 right-10 text-white/50 hover:text-white border border-white/20 px-4 py-2 rounded-full text-xs uppercase tracking-widest transition cursor-pointer z-50"
      >
        Skip Intro
      </button>
    </div>
  );
}