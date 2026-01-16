"use client";

import { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { Download, Layout, Sparkles, Wand2, History, Settings, Zap } from "lucide-react";

export default function Dashboard() {
  const { user } = useUser();
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState<string | null>(null);
  const [history, setHistory] = useState<string[]>([]);
  const [style, setStyle] = useState("None");
  const [negativePrompt, setNegativePrompt] = useState("blurry, low quality, watermark, text, signature, ugly, deformed");
  const [showSettings, setShowSettings] = useState(false);

  // Pro feature lock
  const handleWandClick = () => {
    alert("You've been added to the Nexus AI Pro waitlist! We will notify you when this feature launches.");
  };

  const generateImage = async () => {
    if (!prompt) return;
    setLoading(true);
    
    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          prompt: `${prompt} ${style === "None" ? "" : style}`,
          negative_prompt: negativePrompt
        }),
      });

      if (!response.ok) throw new Error("Generation failed");

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      setImage(url);
      setHistory([url, ...history]); // Add to history
    } catch (error) {
      console.error(error);
      alert("Failed to generate image. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-gray-100 flex flex-col md:flex-row">
      
      {/* SIDEBAR - Hidden on Mobile, Visible on Desktop */}
      <aside className="w-full md:w-64 bg-gray-900 border-b md:border-r border-gray-800 p-6 flex flex-col gap-6">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center">
            <Zap className="w-5 h-5 text-white" />
          </div>
          <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
            Nexus AI
          </h1>
        </div>

        <div className="space-y-2">
          <button className="w-full flex items-center gap-3 px-4 py-3 bg-gray-800 text-white rounded-xl border border-gray-700 hover:bg-gray-700 transition">
            <Layout size={18} />
            <span>Generator</span>
          </button>
          <button onClick={handleWandClick} className="w-full flex items-center gap-3 px-4 py-3 text-gray-400 hover:bg-gray-800/50 rounded-xl transition">
            <History size={18} />
            <span>History</span>
          </button>
          <button onClick={handleWandClick} className="w-full flex items-center gap-3 px-4 py-3 text-gray-400 hover:bg-gray-800/50 rounded-xl transition">
            <Settings size={18} />
            <span>Settings</span>
          </button>
        </div>

        <div className="mt-auto pt-6 border-t border-gray-800">
          <div className="flex items-center gap-3">
            <img src={user?.imageUrl} alt="User" className="w-8 h-8 rounded-full" />
            <div className="text-sm">
              <p className="font-medium text-white">{user?.fullName}</p>
              <p className="text-xs text-gray-500">Free Plan</p>
            </div>
          </div>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 p-4 md:p-8 overflow-y-auto">
        <div className="max-w-4xl mx-auto space-y-8">
          
          {/* Header */}
          <div className="flex flex-col gap-2">
            <h2 className="text-3xl font-bold text-white">Create Magic</h2>
            <p className="text-gray-400">Turn your imagination into reality with Flux AI.</p>
          </div>

          {/* INPUT AREA */}
          <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-4 md:p-6 space-y-4">
            <div className="relative">
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Describe your image... (e.g. A cyberpunk cat in Tokyo)"
                className="w-full h-32 bg-black/50 border border-gray-700 rounded-xl p-4 text-white placeholder-gray-500 focus:ring-2 focus:ring-purple-500 focus:outline-none resize-none"
              />
              <button 
                onClick={handleWandClick}
                className="absolute bottom-4 right-4 p-2 bg-purple-500/20 hover:bg-purple-500/40 text-purple-400 rounded-lg transition"
                title="Enhance Prompt (Pro)"
              >
                <Wand2 size={18} />
              </button>
            </div>

            {/* CONTROLS - Stack on Mobile, Row on Desktop */}
            <div className="flex flex-col md:flex-row gap-4">
              <select 
                value={style}
                onChange={(e) => setStyle(e.target.value)}
                className="bg-gray-800 border border-gray-700 text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="None">No Style</option>
                <option value=", cinematic lighting, 8k, hyper-realistic, dramatic">Cinematic</option>
                <option value=", anime style, studio ghibli, vibrant">Anime</option>
                <option value=", 3D render, unreal engine 5, octane render">3D Model</option>
                <option value=", pixel art, 8-bit, retro game style">Pixel Art</option>
              </select>

              <button
                onClick={() => setShowSettings(!showSettings)}
                className="flex items-center justify-center gap-2 px-4 py-3 bg-gray-800 border border-gray-700 text-gray-300 rounded-lg hover:bg-gray-700 transition"
              >
                <Settings size={18} />
                <span className="md:hidden">Advanced</span>
              </button>

              <button
                onClick={generateImage}
                disabled={loading || !prompt}
                className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold py-3 px-6 rounded-lg hover:opacity-90 transition disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Sparkles className="animate-spin" /> Generating...
                  </>
                ) : (
                  <>
                    <Sparkles /> Generate Image
                  </>
                )}
              </button>
            </div>

            {/* Advanced Settings */}
            {showSettings && (
              <div className="pt-4 border-t border-gray-800 animate-in fade-in slide-in-from-top-2">
                <label className="text-xs uppercase text-gray-500 font-bold tracking-wider mb-2 block">Negative Prompt</label>
                <input 
                  type="text" 
                  value={negativePrompt}
                  onChange={(e) => setNegativePrompt(e.target.value)}
                  className="w-full bg-black/30 border border-gray-700 rounded-lg px-4 py-2 text-sm text-gray-300"
                />
              </div>
            )}
          </div>

          {/* RESULT AREA */}
          {image && (
            <div className="bg-gray-900 rounded-2xl p-2 border border-gray-800 shadow-2xl shadow-purple-900/20">
              <img src={image} alt="Generated" className="w-full rounded-xl" />
              <div className="flex justify-between items-center p-4">
                <p className="text-sm text-gray-400">Generated with Nexus AI</p>
                <a href={image} download="nexus-ai-generated.png" className="flex items-center gap-2 bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition">
                  <Download size={16} /> Download
                </a>
              </div>
            </div>
          )}

          {/* HISTORY - Grid Fix for Mobile */}
          {history.length > 0 && (
            <div className="pt-8 border-t border-gray-800">
              <h3 className="text-xl font-bold text-white mb-4">Recent Creations</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {history.map((img, i) => (
                  <div key={i} className="group relative aspect-square rounded-xl overflow-hidden border border-gray-800 cursor-pointer">
                    <img src={img} alt="History" className="w-full h-full object-cover group-hover:scale-105 transition duration-300" />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
                      <a href={img} download className="text-white bg-black/50 p-2 rounded-full backdrop-blur-sm">
                        <Download size={20} />
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* FOOTER */}
          <footer className="text-center text-gray-600 text-sm py-8">
            <p>Designed & Built by Adel Mesrati</p>
            <p className="text-xs mt-1">© 2024 Nexus AI. All Rights Reserved.</p>
          </footer>

        </div>
      </main>
    </div>
  );
}