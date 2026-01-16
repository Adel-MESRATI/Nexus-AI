"use client";

import { useState } from "react";
import { UserButton } from "@clerk/nextjs";
import { 
  Image as ImageIcon, 
  Download, 
  Loader2, 
  Sparkles,
  LayoutGrid,
  ChevronDown,
  ChevronUp,
  Settings,
  Wand2,
  Menu, // Added for mobile
  X     // Added for mobile
} from "lucide-react";

const ASPECT_RATIOS = [
  { label: "Square (1:1)", value: "1:1" },
  { label: "Portrait (2:3)", value: "2:3" },
  { label: "Landscape (3:2)", value: "3:2" },
  { label: "Wide (16:9)", value: "16:9" },
];

const PRO_STYLES = [
  { 
    label: "None", 
    value: "none",
    keywords: "",
    description: "No style enhancement"
  },
  { 
    label: "Cinematic", 
    value: "cinematic",
    keywords: "cinematic lighting, 8k, hyper-realistic, shot on IMAX, dramatic",
    description: "Hollywood-grade visuals"
  },
  { 
    label: "3D Render", 
    value: "3d",
    keywords: "Unreal Engine 5 render, 3D, octane render, ray tracing",
    description: "Stunning 3D graphics"
  },
  { 
    label: "Anime", 
    value: "anime",
    keywords: "anime style, studio ghibli, vibrant, detailed line art",
    description: "Animated masterpiece"
  },
  { 
    label: "Cyberpunk", 
    value: "cyberpunk",
    keywords: "neon lights, cyberpunk, futuristic, blade runner style",
    description: "Futuristic noir"
  },
  { 
    label: "Retro Game / Pixel Art", 
    value: "pixel",
    keywords: "pixel art, 8-bit, retro game style, low poly, vibrant colors",
    description: "Nostalgic 8-bit vibes"
  },
  { 
    label: "Claymation", 
    value: "claymation",
    keywords: "claymation, stop motion, plasticine, Aardman style",
    description: "Stop-motion charm"
  },
];

interface GeneratedImage {
  id: string;
  image: string;
  prompt: string;
  createdAt: number;
}

export default function Dashboard() {
  const [prompt, setPrompt] = useState("");
  const [aspectRatio, setAspectRatio] = useState("1:1");
  const [selectedStyle, setSelectedStyle] = useState("none");
  const [negativePrompt, setNegativePrompt] = useState("blurry, low quality, watermark, text, signature, ugly, deformed");
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [imageHistory, setImageHistory] = useState<GeneratedImage[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isEnhancing, setIsEnhancing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // NEW: State for Mobile Menu
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      setError("Please enter a prompt");
      return;
    }

    setIsGenerating(true);
    setError(null);
    setGeneratedImage(null);

    // Close mobile menu if open to show result
    setIsMobileMenuOpen(false);

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt, aspectRatio, negativePrompt, style: selectedStyle }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to generate image");
      }

      const data = await response.json();
      const newImage: GeneratedImage = {
        id: Date.now().toString(),
        image: data.image,
        prompt: prompt,
        createdAt: Date.now(),
      };
      setGeneratedImage(data.image);
      setImageHistory(prev => [newImage, ...prev]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownload = (imageBase64: string, filename?: string) => {
    if (!imageBase64) return;

    const link = document.createElement("a");
    link.href = `data:image/png;base64,${imageBase64}`;
    link.download = filename || `nexus-ai-${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const downloadFromHistory = (image: GeneratedImage) => {
    handleDownload(image.image, `nexus-ai-${image.id}.png`);
  };

  const handleEnhancePrompt = async () => {
    if (!prompt.trim()) {
      setError("Please enter a prompt to enhance");
      return;
    }

    setIsEnhancing(true);
    setError(null);

    try {
      const response = await fetch("/api/enhance", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to enhance prompt");
      }

      const data = await response.json();
      
      const enhancedText = data.enhancedPrompt || prompt;
      const originalPrompt = prompt;
      
      if (enhancedText && enhancedText !== originalPrompt) {
        setPrompt("");
        let currentIndex = 0;
        const typingInterval = setInterval(() => {
          if (currentIndex <= enhancedText.length) {
            setPrompt(enhancedText.slice(0, currentIndex));
            currentIndex += 3;
          } else {
            clearInterval(typingInterval);
          }
        }, 20);
        setTimeout(() => clearInterval(typingInterval), 10000);
      } else {
        setPrompt(enhancedText);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsEnhancing(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-zinc-100 flex flex-col md:flex-row h-screen overflow-hidden">
      
      {/* MOBILE HEADER - Visible only on mobile */}
      <div className="md:hidden flex items-center justify-between p-4 bg-zinc-900 border-b border-zinc-800 z-50">
         <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-cyan-400" />
            <span className="font-bold">Nexus AI</span>
         </div>
         <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="p-2 text-zinc-400">
            {isMobileMenuOpen ? <X /> : <Menu />}
         </button>
      </div>

      {/* SIDEBAR - Fixed on mobile (drawer), Relative on desktop */}
      <aside className={`
        fixed inset-0 z-40 bg-zinc-900/95 backdrop-blur-xl border-r border-zinc-800 p-6 flex flex-col transition-transform duration-300
        md:relative md:translate-x-0 md:bg-zinc-900/50 md:w-64 md:flex
        ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"}
      `}>
        {/* Close button for mobile inside drawer */}
        <div className="md:hidden flex justify-end mb-4">
           <button onClick={() => setIsMobileMenuOpen(false)}><X className="text-zinc-400"/></button>
        </div>

        <div className="hidden md:flex items-center gap-2 mb-8">
          <Sparkles className="w-6 h-6 text-cyan-400" />
          <h2 className="text-xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
            Nexus AI
          </h2>
        </div>

        <nav className="flex-1">
          <div className="flex items-center gap-2 p-3 rounded-lg bg-zinc-800/50 text-cyan-400">
            <LayoutGrid className="w-5 h-5" />
            <span className="font-medium">Dashboard</span>
          </div>
        </nav>

        <div className="mt-auto space-y-4">
          <div className="flex items-center gap-3">
             <UserButton appearance={{ elements: { avatarBox: "w-9 h-9" } }} />
             <span className="md:hidden text-sm font-medium">My Account</span>
          </div>
          
          <div className="text-xs text-zinc-500 text-center pt-2 border-t border-zinc-800 space-y-1">
            <div>
              Powered by<br />
              <span className="text-zinc-400">MTI DEVELOPER</span>
            </div>
            <div className="text-zinc-600 mt-2">
              © 2024 Nexus AI. All Rights Reserved.
            </div>
          </div>
        </div>
      </aside>

      {/* MAIN CONTENT - Scrollable */}
      <main className="flex-1 flex flex-col p-4 md:p-8 overflow-y-auto">
        <div className="max-w-4xl mx-auto w-full space-y-8 pb-20">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold mb-2">Image Generation</h1>
            <p className="text-zinc-400 text-sm md:text-base">Create stunning images with AI</p>
          </div>

          {/* Input Section */}
          <div className="space-y-6">
            {/* Magic Style Selector */}
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-3 flex items-center gap-2">
                <Wand2 className="w-4 h-4 text-cyan-400" />
                Magic Style Selector
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                {PRO_STYLES.map((style) => (
                  <button
                    key={style.value}
                    onClick={() => setSelectedStyle(style.value)}
                    className={`relative p-3 md:p-4 rounded-lg border-2 transition-all duration-200 text-left group ${
                      selectedStyle === style.value
                        ? "border-cyan-500 bg-cyan-500/10 shadow-lg shadow-cyan-500/20"
                        : "border-zinc-800 bg-zinc-900/50 hover:border-zinc-700 hover:bg-zinc-900/70"
                    }`}
                  >
                    <div className={`font-semibold mb-1 text-sm md:text-base ${
                      selectedStyle === style.value ? "text-cyan-400" : "text-zinc-300"
                    }`}>
                      {style.label}
                    </div>
                    <div className="text-xs text-zinc-500 line-clamp-1">
                      {style.description}
                    </div>
                    {selectedStyle === style.value && (
                      <div className="absolute top-2 right-2 w-2 h-2 bg-cyan-400 rounded-full animate-pulse" />
                    )}
                  </button>
                ))}
              </div>
              {selectedStyle !== "none" && (
                <p className="mt-2 text-xs text-zinc-500 italic">
                  Style applied: {PRO_STYLES.find(s => s.value === selectedStyle)?.keywords.substring(0, 50)}...
                </p>
              )}
            </div>

            <div className="relative">
              <label className="block text-sm font-medium text-zinc-300 mb-2">
                Prompt
              </label>
              <div className="relative">
                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="Describe the image you want to generate..."
                  className="w-full h-32 px-4 py-3 pr-12 bg-zinc-900/50 border border-zinc-800 rounded-lg text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent resize-none text-base"
                />
                <button
                  onClick={handleEnhancePrompt}
                  disabled={isEnhancing || !prompt.trim()}
                  className="absolute top-3 right-3 p-2 rounded-lg bg-purple-500/10 border border-purple-500/30 text-purple-400 hover:bg-purple-500/20 transition"
                  title="Enhance Prompt"
                >
                  {isEnhancing ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Wand2 className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-2">
                Aspect Ratio
              </label>
              <select
                value={aspectRatio}
                onChange={(e) => setAspectRatio(e.target.value)}
                className="w-full px-4 py-3 bg-zinc-900/50 border border-zinc-800 rounded-lg text-zinc-100 focus:outline-none focus:ring-2 focus:ring-cyan-500"
              >
                {ASPECT_RATIOS.map((ratio) => (
                  <option key={ratio.value} value={ratio.value}>
                    {ratio.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Advanced Settings */}
            <div className="border border-zinc-800 rounded-lg overflow-hidden">
              <button
                onClick={() => setShowAdvanced(!showAdvanced)}
                className="w-full flex items-center justify-between px-4 py-3 bg-zinc-900/30 hover:bg-zinc-900/50 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <Settings className="w-4 h-4 text-cyan-400" />
                  <span className="text-sm font-medium text-zinc-300">Advanced Settings</span>
                </div>
                {showAdvanced ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>
              
              {showAdvanced && (
                <div className="p-4 space-y-4 border-t border-zinc-800">
                  <div>
                    <label className="block text-sm font-medium text-zinc-300 mb-2">
                      Negative Prompt
                    </label>
                    <input
                      type="text"
                      value={negativePrompt}
                      onChange={(e) => setNegativePrompt(e.target.value)}
                      className="w-full px-4 py-3 bg-zinc-900/50 border border-zinc-800 rounded-lg text-zinc-100"
                    />
                  </div>
                </div>
              )}
            </div>

            <button
              onClick={handleGenerate}
              disabled={isGenerating || !prompt.trim()}
              className="w-full px-6 py-4 bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-semibold rounded-lg hover:from-cyan-400 hover:to-blue-400 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/20"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <ImageIcon className="w-5 h-5" />
                  Generate Image
                </>
              )}
            </button>

            {error && (
              <div className="p-4 bg-red-900/20 border border-red-800 rounded-lg text-red-400 text-sm">
                {error}
              </div>
            )}
          </div>

          {/* Generated Image */}
          {generatedImage && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">Generated Image</h2>
                <button
                  onClick={() => handleDownload(generatedImage)}
                  className="flex items-center gap-2 px-4 py-2 bg-zinc-800 hover:bg-zinc-700 rounded-lg text-sm"
                >
                  <Download className="w-4 h-4" />
                  Download
                </button>
              </div>
              <div className="relative rounded-lg overflow-hidden border border-zinc-800 bg-zinc-900/50">
                <img
                  src={`data:image/png;base64,${generatedImage}`}
                  alt="Generated"
                  className="w-full h-auto"
                />
              </div>
            </div>
          )}

          {/* Recent Creations Gallery */}
          {imageHistory.length > 0 && (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">Recent Creations</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {imageHistory.map((image) => (
                  <div
                    key={image.id}
                    className="group relative rounded-lg overflow-hidden border border-zinc-800 bg-zinc-900/50 hover:border-cyan-500/50 transition-all"
                  >
                    <img
                      src={`data:image/png;base64,${image.image}`}
                      alt={image.prompt}
                      className="w-full h-48 object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/0 to-black/0 opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="absolute bottom-0 left-0 right-0 p-4">
                        <button
                          onClick={() => downloadFromHistory(image)}
                          className="flex items-center gap-2 px-3 py-1.5 bg-cyan-500/20 text-cyan-400 rounded-lg text-sm border border-cyan-500/30 w-full justify-center"
                        >
                          <Download className="w-3.5 h-3.5" />
                          Download
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}