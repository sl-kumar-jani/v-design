"use client";

import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import Image from "next/image";
import { IFounder } from "@/lib/models/founder";

// CountUp component for animated numbers
type CountUpProps = {
  end: number;
  duration?: number;
  isActive: boolean;
  suffix?: string;
  prefix?: string;
};

function CountUp({
  end,
  duration = 1.5,
  isActive,
  suffix = "",
  prefix = "",
}: CountUpProps) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!isActive) return;
    let start = 0;
    const increment = end / (duration * 120); // 60fps
    let frame: number;
    function animate() {
      start += increment;
      if (start < end) {
        setCount(Math.floor(start));
        frame = requestAnimationFrame(animate);
      } else {
        setCount(end);
      }
    }
    animate();
    return () => cancelAnimationFrame(frame);
  }, [end, duration, isActive]);
  return (
    <span>
      {prefix}
      {count}
      {suffix}
    </span>
  );
}

export function About() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [founderData, setFounderData] = useState<IFounder | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchFounderData = async () => {
      try {
        const response = await fetch("/api/founder");
        if (response.ok) {
          const data = await response.json();
          setFounderData(data);
        }
      } catch (error) {
        console.error("Error fetching founder data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFounderData();
  }, []);

  // Fallback data if database is empty
  const defaultData = {
    founderName: "Ar. Virali Dias",
    founderDescription:
      "With a passion for creating spaces that seamlessly blend functionality with aesthetic excellence, Ar. Virali Dias brings a unique vision to every project. Her approach combines contemporary design principles with timeless elegance, resulting in spaces that are both sophisticated and livable.",
    founderPhotoUrl: "/placeholder.svg?height=600&width=480",
    projectsCompleted: 15,
    yearsOfExperience: 8,
    clientSatisfaction: 100,
    founderTitle: "PLAN BUILD STYLE",
  };

  const displayData = founderData || defaultData;

  return (
    <section
      id="about"
      ref={ref}
      className="py-20 relative overflow-hidden bg-[#f8f8f8]"
    >
      {/* Background Image */}
      <div className="absolute inset-0 w-full h-full z-0">
        <Image
          src="/images/about-background.jpg"
          alt="Modern Interior with Black Brick Wall"
          fill
          className="object-cover"
          priority
        />
        {/* <div className="absolute inset-0 bg-white/10" />
        <div className="absolute inset-0 bg-gradient-to-r from-white/25 via-white/15 to-white/10" /> */}
        <div className="absolute inset-0 bg-white/10" />
        <div className="absolute inset-0 bg-gradient-to-r from-white/40 via-white/20 to-white/40" />
      </div>

      {/* Background Gradient Elements */}
      <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-[#365545]/10 to-transparent z-10" />

      <div className="container mx-auto px-6 relative z-20">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left Text Section */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 1, ease: "easeOut" }}
            className="space-y-8"
          >
            {/* Heading */}
            <div>
              <motion.h2
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 1, delay: 0.2 }}
                className="font-['Cormorant_Garamond'] text-5xl md:text-6xl font-semibold  text-[#365545] mb-4"
                style={{
                  textShadow:
                    "0 2px 8px rgba(255, 255, 255, 0.9), 0 0 20px rgba(255, 255, 255, 0.6)",
                }}
              >
                About the Founder
              </motion.h2>
              <motion.div
                initial={{ width: 0 }}
                animate={isInView ? { width: "5rem" } : {}}
                transition={{ duration: 1, delay: 0.4 }}
                className="h-1 bg-[#FFD700] rounded"
              />
            </div>

            {/* Founder Name */}
            <motion.h3
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 1, delay: 0.6 }}
              className="font-['Playfair_Display'] text-3xl md:text-4xl text-[#365545] font-medium"
              style={{
                textShadow:
                  "0 2px 6px rgba(255, 255, 255, 0.9), 0 0 15px rgba(255, 255, 255, 0.6)",
              }}
            >
              {displayData.founderName}
            </motion.h3>

            {/* Logo + Tagline */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 1, delay: 1.2 }}
              className="flex items-center space-x-4 mt-6"
            >
              <Image
                src="/images/v-design-logo.png"
                alt="V Design Logo"
                width={50}
                height={50}
                className="w-12 h-12 object-contain opacity-90 drop-shadow-md"
              />
              <span
                className="font-['Cinzel'] text-[#FFD700] text-lg md:text-xl tracking-[0.2em] uppercase font-extrabold drop-shadow-md"
                style={{
                  textShadow:
                    "0 2px 8px rgba(0, 0, 0, 0.6), 0 0 12px rgba(255, 215, 0, 0.7)",
                }}
              >
                {displayData.founderTitle || "PLAN BUILD STYLE"}
              </span>
            </motion.div>

            {/* Description */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 1, delay: 0.8 }}
              className="space-y-6"
            >
              {/* First Card */}
              <div className="bg-white/50 backdrop-blur-sm rounded-lg p-8 shadow-lg border border-white/30">
                <p className="font-['Playfair_Display'] text-lg leading-relaxed text-[#365545] drop-shadow-md">
                  {displayData.founderDescription}
                </p>
              </div>

              {/* Second Card */}
              <div className="bg-white/50 backdrop-blur-sm rounded-lg p-8 shadow-lg border border-white/30">
                <p className="font-['Playfair_Display'] text-lg leading-relaxed text-[#365545] drop-shadow-md">
                  From concept to completion, V Design ensures that every
                  element contributes to a cohesive and harmonious living
                  experience,
                  <span className="font-semibold text-[#365545]">
                    {" "}
                    where luxury meets comfort and style meets substance.
                  </span>
                </p>
              </div>
            </motion.div>

            {/* Stats Cards */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 1, delay: 1 }}
              className="pt-6"
            >
              <div className="grid grid-cols-3 gap-6 text-center">
                {[
                  {
                    value: displayData.projectsCompleted,
                    suffix: "+",
                    label: "Projects Completed",
                  },
                  {
                    value: displayData.yearsOfExperience,
                    suffix: "+",
                    label: "Years Experience",
                  },
                  {
                    value: displayData.clientSatisfaction,
                    suffix: "%",
                    label: "Client Satisfaction",
                  },
                ].map((item, i) => (
                  <div
                    key={i}
                    className="bg-white/80 backdrop-blur-md rounded-lg p-4 shadow-xl border border-white/40"
                  >
                    <h4
                      className="font-['Cinzel'] text-2xl font-semibold text-[#FFD700] mb-1"
                      style={{
                        textShadow:
                          "0 1px 3px rgba(255, 255, 255, 0.8), 0 0 10px rgba(255,215,0,0.4)",
                      }}
                    >
                      <CountUp
                        end={item.value}
                        isActive={isInView}
                        suffix={item.suffix}
                      />
                    </h4>
                    <p className="font-['Playfair_Display'] text-sm text-gray-700 uppercase tracking-wide font-medium">
                      {item.label}
                    </p>
                  </div>
                ))}
              </div>
            </motion.div>
          </motion.div>

          {/* Right Founder Image */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 1, delay: 0.4 }}
            className="relative"
          >
            <div className="relative aspect-[4/5] rounded-2xl overflow-hidden shadow-2xl bg-white/40 backdrop-blur-sm border border-white/60">
              <Image
                src={displayData.founderPhotoUrl}
                alt={displayData.founderName}
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#365545]/20 to-transparent" />
            </div>

            {/* Decorative Rings */}
            <div className="absolute -top-6 -right-6 w-24 h-24 border-2 border-[#FFD700] rounded-full opacity-60 shadow-lg" />
            <div className="absolute -bottom-6 -left-6 w-16 h-16 bg-[#FFD700] rounded-full opacity-50 shadow-lg" />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
