"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";

export function Hero() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [videoError, setVideoError] = useState(false);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (videoRef.current && isClient) {
      const video = videoRef.current;

      // Set video properties
      video.playbackRate = 0.7;
      video.muted = true;
      video.loop = true;
      video.playsInline = true;

      // Force load the video
      video.load();

      // Try to play the video
      const playVideo = async () => {
        try {
          await video.play();
          // console.log("Video started playing successfully");
        } catch (error) {
          console.error("Video play failed:", error);
          setVideoError(true);
        }
      };

      // Add event listeners
      const handleCanPlay = () => {
        console.log("Video can play");
        setVideoLoaded(true);
        setVideoError(false);
        playVideo();
      };

      const handleLoadedData = () => {
        // console.log("Video data loaded");
        setVideoLoaded(true);
        setVideoError(false);
      };

      const handleError = (e: any) => {
        console.error("Video error:", e);
        console.error("Video source:", video.src);
        setVideoError(true);
        setVideoLoaded(false);
      };

      const handleLoadStart = () => {
        // console.log("Video loading started");
      };

      video.addEventListener("canplay", handleCanPlay);
      video.addEventListener("loadeddata", handleLoadedData);
      video.addEventListener("error", handleError);
      video.addEventListener("loadstart", handleLoadStart);

      return () => {
        video.removeEventListener("canplay", handleCanPlay);
        video.removeEventListener("loadeddata", handleLoadedData);
        video.removeEventListener("error", handleError);
        video.removeEventListener("loadstart", handleLoadStart);
      };
    }
  }, [isClient]);

  return (
    <section
      id="home"
      className="min-h-screen flex items-center justify-center relative overflow-hidden bg-[#365545]"
    >
      {/* Background Video Only */}
      <div className="absolute inset-0 w-full h-full">
        {isClient && !videoError && (
          <video
            ref={videoRef}
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            className={`w-full h-full object-cover transition-opacity duration-1000 ${
              videoLoaded ? "opacity-100" : "opacity-0"
            }`}
            style={{ backgroundColor: "#365545" }}
          >
            <source
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/vecteezy_ai-generative-a-living-room-with-lots-of-plants-and-a-couch_32426024%20%281%29%20%281%29%20%281%29%20%281%29%20%281%29%20%281%29%20%281%29-XgsOnjW0oQhKOzSnoAWIgwlbmwvGbx.mp4"
              // src="/hero_section_video.mp4"
              type="video/mp4"
            />
            Your browser does not support the video tag.
          </video>
        )}

        {/* Solid Color Fallback - No Image */}
        {(videoError || !videoLoaded) && (
          <div className="absolute inset-0 w-full h-full bg-gradient-to-br from-[#365545] via-[#2a4136] to-[#1e2f22]" />
        )}

        {/* Light overlay to ensure text readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#365545]/30 via-[#365545]/10 to-[#365545]/30" />
        <div className="absolute inset-0 bg-black/5" />
      </div>

      {/* Subtle Cinematic Lighting Effects */}
      <div className="absolute inset-0 z-10">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-white/1 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-white/1 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-radial from-white/1 to-transparent rounded-full blur-2xl" />
      </div>

      <div className="container mx-auto px-6 text-center relative z-20 pt-20">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="space-y-6"
        >
          {/* Logo/Brand */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1.2, delay: 0.2 }}
            className="mb-12"
          >
            <div className="flex flex-col items-center">
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 1.5, delay: 0.3 }}
                className="mb-8"
              >
                <div className="relative">
                  <Image
                    src="/images/v-design-logo.png"
                    alt="V Design Logo"
                    width={100}
                    height={100}
                    className="w-32 h-32 md:w-40 md:h-40 lg:w-48 lg:h-48 object-contain drop-shadow-2xl relative z-10"
                  />
                  {/* Logo Glow Effect */}
                  <div className="absolute inset-0 w-32 h-32 md:w-40 md:h-40 lg:w-48 lg:h-48 bg-white/10 rounded-full blur-xl animate-pulse" />
                </div>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.8 }}
                className="font-['Cormorant_Garamond'] text-4xl md:text-5xl lg:text-6xl font-light text-center blink-text-main pulse-blink tracking-[0.3em] leading-tight"
                style={{
                  textShadow:
                    "0 0 20px rgba(255, 255, 255, 0.9), 0 0 40px rgba(255, 255, 255, 0.6), 0 2px 8px rgba(0, 0, 0, 0.8)",
                }}
              >
                ARCHITECTURE & INTERIOR DESIGN
              </motion.h1>
            </div>
          </motion.div>

          {/* Tagline */}
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.6 }}
            className="font-['Playfair_Display'] text-xl md:text-2xl max-w-2xl mx-auto leading-relaxed blink-text-subtitle"
            style={{
              textShadow:
                "0 0 15px rgba(255, 255, 255, 0.8), 0 2px 6px rgba(0, 0, 0, 0.8)",
            }}
          >
            Crafting Timeless Spaces Through Architectural Excellence & Interior
            Innovation
          </motion.p>

          {/* Location */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.8 }}
            className="font-['Cinzel'] text-lg tracking-widest blink-text-accent"
          >
            PUNE, INDIA
          </motion.p>
        </motion.div>
      </div>

      {/* Subtle Vignette Effect */}
      <div className="absolute inset-0 bg-gradient-radial from-transparent via-transparent to-black/10 pointer-events-none z-10" />
    </section>
  );
}
