"use client";

import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Instagram,
  RefreshCw,
  X,
  Share2,
  Heart,
  MessageCircle,
} from "lucide-react";
import { InstagramReel } from "@/lib/instagram";
import { Dialog, DialogContent } from "@/components/ui/dialog";

interface ApiResponse {
  success: boolean;
  data: InstagramReel[];
  source: "instagram" | "fallback";
  message: string;
  error?: string;
}

export function InstagramReels() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [playingVideo, setPlayingVideo] = useState<string | null>(null);
  const [mutedVideos, setMutedVideos] = useState<Set<string>>(new Set());
  const [reelsData, setReelsData] = useState<InstagramReel[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dataSource, setDataSource] = useState<"instagram" | "fallback">(
    "fallback"
  );
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [selectedReel, setSelectedReel] = useState<InstagramReel | null>(null);

  const fetchReels = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch("/api/instagram/reels?limit=5");
      const data: ApiResponse = await response.json();

      if (data.success) {
        setReelsData(data.data);
        setDataSource(data.source);
      } else {
        setError(data.message || "Failed to fetch reels");
      }
    } catch (err) {
      setError("Failed to fetch Instagram reels");
      console.error("Error fetching reels:", err);
    } finally {
      setLoading(false);
    }
  };

  const refreshReels = async () => {
    setIsRefreshing(true);
    await fetchReels();
    setIsRefreshing(false);
  };

  useEffect(() => {
    fetchReels();
  }, []);

  const handlePlayPause = (videoId: string, videoElement: HTMLVideoElement) => {
    if (playingVideo === videoId) {
      videoElement.pause();
      setPlayingVideo(null);
    } else {
      // Pause all other videos first
      const allVideos = document.querySelectorAll("video");
      allVideos.forEach((video) => {
        if (video !== videoElement) {
          video.pause();
        }
      });

      // Play the selected video
      const playPromise = videoElement.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            setPlayingVideo(videoId);
          })
          .catch((error) => {
            console.error("Video play failed:", error);
          });
      }
    }
  };

  const handleMuteToggle = (
    videoId: string,
    videoElement: HTMLVideoElement
  ) => {
    const newMutedVideos = new Set(mutedVideos);
    if (mutedVideos.has(videoId)) {
      newMutedVideos.delete(videoId);
      videoElement.muted = false;
    } else {
      newMutedVideos.add(videoId);
      videoElement.muted = true;
    }
    setMutedVideos(newMutedVideos);
  };

  const handleReelClick = (reel: InstagramReel) => {
    setSelectedReel(reel);
  };
  return (
    <>
      <section
        id="reels"
        ref={ref}
        className="py-16 bg-gradient-to-br from-[#365545] to-[#2a4136] relative overflow-hidden"
      >
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent" />
        </div>

        <div className="container mx-auto px-6">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1 }}
            className={`text-center mb-16 ${
              reelsData.length > 0 ? "block" : "hidden"
            }`}
          >
            <div className="flex items-center justify-center mb-6">
              <Instagram className="w-8 h-8 text-[#FFD700] mr-3" />
              <h2 className="font-['Cormorant_Garamond'] text-5xl md:text-6xl font-light text-white">
                Design Reels
              </h2>
            </div>
            <div className="w-16 h-0.5 bg-[#FFD700] mx-auto mb-8" />
            <p className="font-['Playfair_Display'] text-xl text-white/80 max-w-2xl mx-auto">
              Get inspired by our quick design tips and behind-the-scenes
              content
            </p>

            <p className="font-['Cinzel'] text-sm text-[#FFD700] mt-2">
              ✨ Live from Instagram
            </p>
          </motion.div>

          {/* Reels Grid */}
          {loading ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : {}}
              transition={{ duration: 1, delay: 0.2 }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 max-w-7xl mx-auto"
            >
              {Array.from({ length: 5 }).map((_, index) => (
                <div
                  key={index}
                  className="relative aspect-[9/16] rounded-2xl overflow-hidden bg-white/10 animate-pulse"
                >
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-16 h-16 rounded-full bg-white/20 animate-pulse" />
                    </div>
                  </div>
                </div>
              ))}
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : {}}
              transition={{ duration: 1, delay: 0.2 }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 max-w-7xl mx-auto"
            >
              {reelsData.map((reel, index) => (
                <motion.div
                  key={reel.id}
                  initial={{ opacity: 0, y: 50 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.8, delay: 0.1 * index }}
                  className="group cursor-pointer"
                  onClick={() => handleReelClick(reel)}
                >
                  <div className="relative aspect-[9/16] rounded-2xl overflow-hidden shadow-2xl bg-black">
                    <video
                      ref={(el) => {
                        if (el) {
                          el.muted = mutedVideos.has(reel.id);
                          el.load();
                        }
                      }}
                      className="w-full h-full object-cover"
                      loop
                      playsInline
                      muted={mutedVideos.has(reel.id)}
                      preload="metadata"
                      // onLoadStart={() =>
                      //   console.log(`Video ${reel.id} loading started`)
                      // }
                      // onCanPlay={() => console.log(`Video ${reel.id} can play`)}
                      onError={(e) => {
                        console.error(`Video ${reel.id} error:`, e);
                        console.error("Video source:", reel.videoUrl);
                      }}
                      onEnded={() => setPlayingVideo(null)}
                    >
                      <source src={reel.videoUrl} type="video/mp4" />
                      Your browser does not support the video tag.
                    </video>

                    {/* Overlay Controls */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20">
                      {/* Play/Pause Button */}
                      <div className="absolute inset-0 flex items-center justify-center">
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            const videoContainer =
                              e.currentTarget.closest(".group");
                            const video = videoContainer?.querySelector(
                              "video"
                            ) as HTMLVideoElement;
                            if (video) {
                              handlePlayPause(reel.id, video);
                            }
                          }}
                          className={`w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center transition-all duration-300 ${
                            playingVideo === reel.id
                              ? "opacity-0 group-hover:opacity-100"
                              : "opacity-100"
                          }`}
                        >
                          {playingVideo === reel.id ? (
                            <Pause className="w-8 h-8 text-white" />
                          ) : (
                            <Play className="w-8 h-8 text-white ml-1" />
                          )}
                        </button>
                      </div>

                      {/* Top Controls */}
                      <div className="absolute top-4 right-4">
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            const videoContainer =
                              e.currentTarget.closest(".group");
                            const video = videoContainer?.querySelector(
                              "video"
                            ) as HTMLVideoElement;
                            if (video) {
                              handleMuteToggle(reel.id, video);
                            }
                          }}
                          className="w-10 h-10 rounded-full bg-black/30 backdrop-blur-sm flex items-center justify-center text-white hover:bg-black/50 transition-colors"
                        >
                          {mutedVideos.has(reel.id) ? (
                            <VolumeX className="w-5 h-5" />
                          ) : (
                            <Volume2 className="w-5 h-5" />
                          )}
                        </button>
                      </div>

                      {/* Bottom Info */}
                      <div className="absolute bottom-0 left-0 right-0 p-4">
                        {/* <h3 className="font-['Playfair_Display'] text-white font-semibold text-sm mb-1 line-clamp-2">
                        {reel.title}
                      </h3> */}
                        <p className="font-['Cinzel'] text-white/80 text-xs mb-2 line-clamp-2">
                          {reel.description}
                        </p>
                        <div className="flex items-center justify-between text-white/70 text-xs">
                          {reel.comments && reel.comments !== "0" ? (
                            <span className="font-['Cinzel']">
                              {reel.comments} comment
                            </span>
                          ) : (
                            <span className="font-['Cinzel']">No comments</span>
                          )}
                          <span className="font-['Cinzel']">
                            ❤️ {reel.likes}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Instagram-style border */}
                    <div className="absolute inset-0 rounded-2xl border-2 border-transparent bg-gradient-to-r from-[#FFD700]/20 to-[#FFD700]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1, delay: 0.6 }}
          className="text-center mt-16"
        >
          <p className="font-['Playfair_Display'] text-white/80 mb-6 text-lg">
            Follow us on Instagram for daily design inspiration
          </p>
          <button
            onClick={() => {
              window.open(
                "https://www.instagram.com/vdesignbyvirali?igsh=MTRwMGl5YmQ5Z25mbQ==",
                "_blank"
              );
            }}
            className="bg-gradient-to-r from-[#FFD700] to-[#FFA500] hover:from-[#FFA500] hover:to-[#FFD700] text-[#365545] font-['Cinzel'] font-semibold px-8 py-4 rounded-full transition-all duration-300 flex items-center space-x-2 mx-auto shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            <Instagram className="w-5 h-5" />
            <span>@vdesignbyvirali</span>
          </button>
        </motion.div>

        {/* Reel Popup Dialog */}
        <Dialog
          open={!!selectedReel}
          onOpenChange={() => setSelectedReel(null)}
        >
          <DialogContent className="max-w-4xl w-full bg-[#1a1a1a] border-[#365545] p-0 overflow-hidden">
            <div className="flex h-[80vh]">
              {/* Video Section */}
              <div className="flex-1 relative bg-black">
                {selectedReel && (
                  <video
                    className="w-full h-full object-contain"
                    controls
                    autoPlay
                    loop
                    playsInline
                  >
                    <source src={selectedReel.videoUrl} type="video/mp4" />
                  </video>
                )}
              </div>

              {/* Details Section */}
              <div className="w-96 bg-[#1a1a1a] border-l border-[#365545] p-6 flex flex-col">
                {selectedReel && (
                  <>
                    {/* Header */}
                    <div className="flex items-center space-x-4 mb-6">
                      <div className="w-12 h-12 rounded-full bg-[#365545] flex items-center justify-center">
                        <Instagram className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="font-['Playfair_Display'] text-white font-semibold">
                          V Design Studio
                        </h3>
                        <p className="font-['Cinzel'] text-sm text-white/60">
                          Interior Designer
                        </p>
                      </div>
                    </div>

                    {/* Description */}
                    <div className="flex-1">
                      {/* <h3 className="font-['Playfair_Display'] text-white font-semibold mb-2">
                      {selectedReel.title}
                    </h3> */}
                      <p className="font-['Playfair_Display'] text-white/90 text-lg leading-relaxed">
                        {selectedReel.description}
                      </p>
                    </div>

                    {/* Engagement Stats */}
                    <div className="border-t border-[#365545] pt-4 mt-4">
                      <div className="flex items-center justify-between text-white/80">
                        <div className="flex items-center space-x-6">
                          <div className="flex items-center space-x-2">
                            <Heart className="w-6 h-6" />
                            <span className="font-['Cinzel'] text-sm">
                              {selectedReel.likes || "0"}
                            </span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <MessageCircle className="w-6 h-6" />
                            <span className="font-['Cinzel'] text-sm">
                              {selectedReel.comments || "0"}
                            </span>
                          </div>
                        </div>
                        {/* <button className="hover:text-white transition-colors">
                        <Share2 className="w-6 h-6" />
                      </button> */}
                      </div>
                    </div>

                    {/* Posted Time */}
                    <div className="mt-4">
                      <p className="font-['Cinzel'] text-sm text-white/40">
                        Posted{" "}
                        {selectedReel.timestamp
                          ? new Date(
                              selectedReel.timestamp
                            ).toLocaleDateString()
                          : "2 days ago"}
                      </p>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Close Button */}
            <button
              onClick={() => setSelectedReel(null)}
              className="absolute top-4 right-4 w-10 h-10 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-black/70 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </DialogContent>
        </Dialog>
      </section>
    </>
  );
}
