"use client";

import { useEffect, useState } from "react";
import { X, Share2, Download, ArrowDown } from "lucide-react";

export default function InstallPrompt() {
  const [isVisible, setIsVisible] = useState(false);
  const [platform, setPlatform] = useState<"ios" | "android" | "desktop" | null>(null);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

  useEffect(() => {
    // Check if app is already installed (standalone mode)
    const isStandalone = window.matchMedia("(display-mode: standalone)").matches ||
      (window.navigator as any).standalone === true ||
      document.referrer.includes("android-app://");

    if (isStandalone) {
      return; // Already installed, don't show
    }

    // Check if user has dismissed the prompt before
    const hasDismissed = sessionStorage.getItem("installPromptDismissed") === "true";
    if (hasDismissed) {
      return;
    }

    // Detect platform
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isIOS = /iphone|ipad|ipod/.test(userAgent);
    const isAndroid = /android/.test(userAgent);

    if (isIOS) {
      setPlatform("ios");
      setIsVisible(true);
    } else if (isAndroid) {
      setPlatform("android");
      setIsVisible(true);
      
      // Listen for beforeinstallprompt event (Android/Desktop)
      const handleBeforeInstallPrompt = (e: Event) => {
        e.preventDefault();
        setDeferredPrompt(e);
      };

      window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

      return () => {
        window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
      };
    } else {
      // Desktop (Chrome, Edge, etc.)
      setPlatform("desktop");
      setIsVisible(true);

      // Listen for beforeinstallprompt event (Desktop)
      const handleBeforeInstallPrompt = (e: Event) => {
        e.preventDefault();
        setDeferredPrompt(e);
      };

      window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

      return () => {
        window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
      };
    }
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) {
      return;
    }

    // Show the install prompt
    deferredPrompt.prompt();

    // Wait for the user to respond
    const { outcome } = await deferredPrompt.userChoice;

    if (outcome === "accepted") {
      setDeferredPrompt(null);
      setIsVisible(false);
    }
  };

  const handleDismiss = () => {
    setIsVisible(false);
    sessionStorage.setItem("installPromptDismissed", "true");
  };

  if (!isVisible || !platform) {
    return null;
  }

  // iOS Version
  if (platform === "ios") {
    return (
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-gradient-to-t from-black via-zinc-900 to-transparent border-t border-zinc-800 p-4">
        <div className="max-w-md mx-auto relative">
          <button
            onClick={handleDismiss}
            className="absolute top-0 right-0 text-zinc-400 hover:text-zinc-200 transition-colors"
            aria-label="Dismiss"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="text-center mb-3">
            <p className="text-white font-semibold mb-2">
              Install Flux AI for the best experience
            </p>
            <div className="flex flex-col items-center gap-2">
              <ArrowDown className="w-6 h-6 text-cyan-400 animate-bounce" />
              <div className="text-sm text-zinc-300 flex items-center gap-2">
                <span>Tap the</span>
                <Share2 className="w-4 h-4 inline" />
                <span>Share button, then scroll down and tap</span>
              </div>
              <p className="text-sm text-cyan-400 font-medium">
                "Add to Home Screen"
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Android/Desktop Version
  return (
    <div className="fixed bottom-4 right-4 z-50">
      <div className="bg-gradient-to-br from-zinc-900 to-zinc-800 border border-zinc-700 rounded-lg shadow-lg p-4 max-w-sm relative">
        <button
          onClick={handleDismiss}
          className="absolute top-2 right-2 text-zinc-400 hover:text-zinc-200 transition-colors"
          aria-label="Dismiss"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="pr-6">
          <p className="text-white font-semibold mb-3">
            Install Flux AI for the best experience
          </p>
          <button
            onClick={handleInstall}
            disabled={!deferredPrompt}
            className="w-full px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-semibold rounded-lg hover:from-cyan-400 hover:to-blue-400 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center gap-2"
          >
            <Download className="w-4 h-4" />
            Install App
          </button>
        </div>
      </div>
    </div>
  );
}
