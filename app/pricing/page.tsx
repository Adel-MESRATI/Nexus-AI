"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Check, Sparkles } from "lucide-react";
import Link from "next/link";

export default function PricingPage() {
  const handleJoinWaitlist = () => {
    alert("Success! You have been added to the Nexus AI Pro waitlist. We will notify you soon.");
  };

  const plans = [
    {
      name: "Free",
      price: "$0",
      period: "forever",
      description: "Perfect for getting started",
      features: [
        "10 images per month",
        "Standard resolution",
        "Basic styles",
        "Community support",
      ],
      buttonText: "Get Started",
      buttonLink: "/sign-in",
      popular: false,
      isWaitlist: false,
    },
    {
      name: "Pro",
      price: "$29",
      period: "per month",
      description: "For professional creators",
      features: [
        "Unlimited images",
        "HD & 4K resolution",
        "Magic Wand (AI Prompt Enhancer)",
        "Cinematic Mode & all premium styles",
        "Priority support",
        "Commercial license",
        "API access",
      ],
      buttonText: "Join Pro Waitlist",
      buttonLink: "#",
      popular: true,
      isWaitlist: true,
      onClick: handleJoinWaitlist,
    },
  ];

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-zinc-100">
      {/* Navbar */}
      <nav className="border-b border-zinc-800 bg-zinc-900/50 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-2"
          >
            <Sparkles className="w-6 h-6 text-cyan-400" />
            <span className="text-xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
              Nexus AI
            </span>
          </Link>
          <Link
            href="/sign-in"
            className="px-4 py-2 rounded-lg bg-zinc-800/50 hover:bg-zinc-800/70 border border-white/10 text-zinc-200 font-medium transition-all duration-200"
          >
            Sign In
          </Link>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h1 className="text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 bg-clip-text text-transparent">
            Simple, Transparent Pricing
          </h1>
          <p className="text-xl text-zinc-400 max-w-2xl mx-auto">
            Choose the perfect plan for your creative needs
          </p>
        </motion.div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className={`relative rounded-2xl border-2 p-8 ${
                plan.popular
                  ? "border-yellow-500/60 bg-gradient-to-br from-zinc-900/50 to-zinc-900/30 shadow-lg shadow-yellow-500/20"
                  : "border-zinc-800 bg-zinc-900/30"
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-full text-xs font-semibold text-black shadow-lg shadow-yellow-500/30">
                  Most Popular
                </div>
              )}

              <div className="mb-6">
                <h3 className="text-2xl font-bold text-zinc-100 mb-2">
                  {plan.name}
                </h3>
                <div className="flex items-baseline gap-2 mb-2">
                  <span className="text-4xl font-bold text-zinc-100">
                    {plan.price}
                  </span>
                  {plan.period !== "forever" && (
                    <span className="text-zinc-400">/{plan.period}</span>
                  )}
                </div>
                <p className="text-zinc-400 text-sm">{plan.description}</p>
              </div>

              <ul className="space-y-3 mb-8">
                {plan.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-cyan-400 flex-shrink-0 mt-0.5" />
                    <span className="text-zinc-300">{feature}</span>
                  </li>
                ))}
              </ul>

              {plan.isWaitlist ? (
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    plan.onClick?.();
                  }}
                  className="w-full px-6 py-3 bg-gradient-to-r from-yellow-500 to-yellow-600 text-black font-semibold rounded-lg hover:from-yellow-400 hover:to-yellow-500 transition-all duration-200 shadow-lg shadow-yellow-500/20 hover:shadow-yellow-500/40"
                >
                  {plan.buttonText}
                </button>
              ) : (
                <Link
                  href={plan.buttonLink || "/sign-in"}
                  className="block w-full px-6 py-3 bg-zinc-800 hover:bg-zinc-700 text-zinc-100 font-semibold rounded-lg transition-all duration-200 text-center border border-zinc-700"
                >
                  {plan.buttonText}
                </Link>
              )}
            </motion.div>
          ))}
        </div>
      </main>
    </div>
  );
}
