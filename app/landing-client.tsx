"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Sparkles, ArrowRight, Image as ImageIcon } from "lucide-react";
import { useEffect, useState } from "react";

export default function LandingPageClient() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Floating animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: "easeOut",
      },
    },
  };

  const floatingVariants = {
    animate: {
      y: [0, -20, 0],
      transition: {
        duration: 6,
        repeat: Infinity,
        ease: "easeInOut",
      },
    },
  };

  // Placeholder images for the ticker (can be replaced with actual generated images)
  const sampleImages = Array.from({ length: 8 }, (_, i) => i);

  return (
    <div className="min-h-screen bg-[#000000] relative overflow-hidden">
      {/* Aurora Gradient Background */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-purple-500/20 rounded-full blur-[120px]"
        />
        <motion.div
          animate={{
            scale: [1, 1.15, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1,
          }}
          className="absolute top-1/3 right-1/4 w-[500px] h-[500px] bg-blue-500/20 rounded-full blur-[100px]"
        />
        <motion.div
          animate={{
            scale: [1, 1.18, 1],
            opacity: [0.25, 0.4, 0.25],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2,
          }}
          className="absolute bottom-1/4 left-1/3 w-[550px] h-[550px] bg-cyan-500/15 rounded-full blur-[110px]"
        />
      </div>

      {/* Floating Grid Background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:60px_60px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)]" />

      {/* Glassmorphism Navbar */}
      <motion.nav
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl bg-zinc-900/20 border-b border-white/10"
      >
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-cyan-400" />
            <span className="text-2xl font-bold bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 bg-clip-text text-transparent">
              Nexus AI
            </span>
          </div>
          <Link
            href="/sign-in"
            className="px-6 py-2.5 rounded-lg bg-zinc-800/50 hover:bg-zinc-800/70 border border-white/10 text-zinc-200 font-medium transition-all duration-200 hover:border-cyan-500/50 hover:text-cyan-400"
          >
            Sign In
          </Link>
        </div>
      </motion.nav>

      {/* Main Content */}
      <main className="relative z-10 pt-32 pb-20 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate={mounted ? "visible" : "hidden"}
            className="text-center space-y-8"
          >
            {/* Hero Headline */}
            <motion.div variants={itemVariants} className="space-y-6">
              <h1 className="text-7xl md:text-8xl lg:text-9xl font-black tracking-tight">
                <span className="block bg-gradient-to-r from-purple-400 via-blue-400 to-cyan-400 bg-clip-text text-transparent animate-gradient">
                  Dream it.
                </span>
                <span className="block bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent animate-gradient-reverse mt-2">
                  Generate it.
                </span>
              </h1>
              
              <motion.p
                variants={itemVariants}
                className="text-xl md:text-2xl text-zinc-400 max-w-3xl mx-auto font-light"
              >
                The most powerful AI Image Generator, designed by{" "}
                <span className="text-cyan-400 font-medium">MTI DEVELOPER</span>.
              </motion.p>
            </motion.div>

            {/* CTA Buttons */}
            <motion.div
              variants={itemVariants}
              className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8"
            >
              <Link
                href="/sign-in"
                className="group relative px-8 py-4 bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 rounded-xl text-white font-semibold text-lg overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-[0_0_40px_rgba(6,182,212,0.5)]"
              >
                <span className="relative z-10 flex items-center gap-2">
                  Start Creating
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 opacity-0 group-hover:opacity-100 transition-opacity blur-xl" />
              </Link>

              <Link
                href="/sign-in"
                className="px-8 py-4 rounded-xl border-2 border-white/20 text-zinc-300 font-semibold text-lg hover:border-cyan-500/50 hover:text-cyan-400 hover:bg-white/5 transition-all duration-300"
              >
                View Gallery
              </Link>
            </motion.div>

            {/* Image Ticker */}
            <motion.div
              variants={itemVariants}
              className="mt-20 relative"
            >
              <div className="overflow-hidden relative h-64">
                <div className="absolute inset-0 bg-gradient-to-r from-black via-transparent to-black z-10 pointer-events-none" />
                <div className="flex gap-4 animate-scroll">
                  {[...sampleImages, ...sampleImages].map((idx, index) => (
                    <motion.div
                      key={`ticker-item-${index}`}
                      variants={floatingVariants}
                      animate="animate"
                      style={{ animationDelay: `${idx * 0.2}s` }}
                      className="flex-shrink-0 w-64 h-64 rounded-2xl bg-gradient-to-br from-purple-500/20 via-blue-500/20 to-cyan-500/20 border border-white/10 backdrop-blur-sm flex items-center justify-center"
                    >
                      <ImageIcon className="w-16 h-16 text-white/20" />
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Feature Cards */}
            <motion.div
              variants={itemVariants}
              className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-32 max-w-5xl mx-auto"
            >
              {[
                {
                  title: "Lightning Fast",
                  description: "Generate high-quality images in seconds",
                  gradient: "from-purple-500/20 to-blue-500/20",
                  border: "border-purple-500/30",
                },
                {
                  title: "Professional Quality",
                  description: "Powered by state-of-the-art AI models",
                  gradient: "from-blue-500/20 to-cyan-500/20",
                  border: "border-blue-500/30",
                },
                {
                  title: "Easy to Use",
                  description: "Intuitive interface for creators of all levels",
                  gradient: "from-cyan-500/20 to-purple-500/20",
                  border: "border-cyan-500/30",
                },
              ].map((feature, idx) => (
                <motion.div
                  key={`feature-${idx}-${feature.title}`}
                  variants={itemVariants}
                  className={`p-6 rounded-2xl bg-gradient-to-br ${feature.gradient} backdrop-blur-xl border ${feature.border} hover:scale-105 transition-transform duration-300`}
                >
                  <h3 className="text-xl font-bold text-white mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-zinc-300 text-sm">{feature.description}</p>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </main>

      {/* Footer */}
      <motion.footer
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 0.6 }}
        className="relative z-10 border-t border-white/10 backdrop-blur-xl bg-zinc-900/20 py-8"
      >
        <div className="max-w-7xl mx-auto px-6 text-center text-zinc-500 text-sm">
          © 2024 Nexus AI. Built by{" "}
          <span className="text-cyan-400">MTI DEVELOPER</span>.
        </div>
      </motion.footer>

    </div>
  );
}
