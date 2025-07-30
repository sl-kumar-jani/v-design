"use client";

import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import Image from "next/image";
import { Play, X, ChevronLeft, ChevronRight } from "lucide-react";
import { IPortfolio } from "@/lib/models/portfolio";
import { ICategory } from "@/lib/models/category";
import { IVideo } from "@/lib/models/video";

export function Portfolio() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [portfolioItems, setPortfolioItems] = useState<IPortfolio[]>([]);
  const [categories, setCategories] = useState<string[]>(["All"]);
  const [selectedItem, setSelectedItem] = useState<IPortfolio | null>(null);
  const [filter, setFilter] = useState("All");
  const [videos, setVideos] = useState<IVideo[]>([]);
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);

  const handleVideoPlay = () => {
    setIsVideoPlaying(true);
  };

  const nextVideo = () => {
    setCurrentVideoIndex((prev) => (prev + 1) % videos.length);
    setIsVideoPlaying(false);
  };

  const prevVideo = () => {
    setCurrentVideoIndex((prev) => (prev - 1 + videos.length) % videos.length);
    setIsVideoPlaying(false);
  };

  // Fetch portfolio items, categories, and videos from database
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch portfolio items
        const portfolioResponse = await fetch("/api/portfolio");
        if (portfolioResponse.ok) {
          const portfolioData = await portfolioResponse.json();
          setPortfolioItems(portfolioData);
        }

        // Fetch categories
        const categoriesResponse = await fetch("/api/categories");
        if (categoriesResponse.ok) {
          const categoriesData: ICategory[] = await categoriesResponse.json();
          const categoryNames = categoriesData.map((cat) => cat.name);
          setCategories(["All", ...categoryNames]);
        }

        // Fetch videos
        const videosResponse = await fetch("/api/videos");
        if (videosResponse.ok) {
          const videosData = await videosResponse.json();
          setVideos(videosData);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const filteredItems =
    filter === "All"
      ? portfolioItems
      : portfolioItems.filter((item) => item.category === filter);

  return (
    <section
      id="gallery"
      ref={ref}
      className="py-16 bg-[#365545] relative overflow-hidden"
    >
      <div className="container mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1 }}
          className="text-center mb-16"
        >
          <h2 className="font-['Cormorant_Garamond'] text-5xl md:text-6xl font-light text-white mb-6">
            Our Portfolio
          </h2>
          <div className="w-16 h-0.5 bg-[#FFD700] mx-auto mb-8" />
          <p className="font-['Playfair_Display'] text-xl text-white/80 max-w-2xl mx-auto">
            Discover our collection of thoughtfully designed spaces that blend
            luxury with functionality
          </p>
        </motion.div>

        {/* Filter Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1, delay: 0.2 }}
          className="flex flex-wrap justify-center gap-4 mb-16"
        >
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setFilter(category)}
              className={`font-['Cinzel'] px-6 py-3 rounded-full border transition-all duration-300 ${
                filter === category
                  ? "bg-[#FFD700] text-[#365545] border-[#FFD700]"
                  : "text-white border-white/30 hover:border-[#FFD700] hover:text-[#FFD700]"
              }`}
            >
              {category}
            </button>
          ))}
        </motion.div>

        {/* Portfolio Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 1, delay: 0.4 }}
          className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
        >
          {filteredItems.map((item, index) => (
            <motion.div
              key={item._id}
              initial={{ opacity: 0, y: 50 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.1 * index }}
              className="group cursor-pointer"
              onClick={() => setSelectedItem(item)}
            >
              <div className="relative aspect-[4/5] rounded-lg overflow-hidden shadow-xl">
                <Image
                  src={item.image || "/placeholder.svg"}
                  alt={item.title}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="absolute bottom-0 left-0 right-0 p-6 text-white transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                  <h3 className="font-['Playfair_Display'] text-lg font-semibold mb-2">
                    {item.title}
                  </h3>
                  <p className="font-['Cinzel'] text-sm text-[#FFD700] uppercase tracking-wide">
                    {item.category}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
          {filteredItems.length === 0 && (
            <div className="col-span-full text-center text-white">
              No items found
            </div>
          )}
        </motion.div>

        {/* Video Section */}
        {videos.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1, delay: 0.6 }}
            className="mt-16 text-center"
          >
            <div className="relative">
              <div className="relative aspect-video max-w-4xl mx-auto rounded-lg overflow-hidden shadow-2xl">
                {!isVideoPlaying ? (
                  <>
                    <Image
                      src={
                        videos[currentVideoIndex]?.thumbnailUrl ||
                        "/placeholder.svg"
                      }
                      alt={
                        videos[currentVideoIndex]?.title || "Video Thumbnail"
                      }
                      fill
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                      <button
                        onClick={handleVideoPlay}
                        className="w-20 h-20 rounded-full bg-[#FFD700] flex items-center justify-center cursor-pointer hover:scale-110 transition-transform duration-300 shadow-2xl"
                      >
                        <Play className="w-8 h-8 text-[#365545] ml-1" />
                      </button>
                    </div>
                  </>
                ) : (
                  <video
                    src={videos[currentVideoIndex]?.videoUrl}
                    controls
                    autoPlay
                    className="w-full h-full object-cover"
                    // onLoadStart={() => console.log("Video loading started")}
                    onError={(e) => console.error("Video error:", e)}
                    onEnded={() => setIsVideoPlaying(false)}
                  >
                    <source
                      src={videos[currentVideoIndex]?.videoUrl}
                      type="video/mp4"
                    />
                    Your browser does not support the video tag.
                  </video>
                )}
              </div>

              {/* Navigation Controls */}
              {videos.length > 1 && (
                <>
                  <button
                    onClick={prevVideo}
                    className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-black/70 transition-colors md:w-16 md:h-16"
                  >
                    <ChevronLeft className="w-6 h-6 md:w-8 md:h-8" />
                  </button>
                  <button
                    onClick={nextVideo}
                    className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-black/70 transition-colors md:w-16 md:h-16"
                  >
                    <ChevronRight className="w-6 h-6 md:w-8 md:h-8" />
                  </button>
                </>
              )}
            </div>

            {/* Video Info */}
            <div className="mt-6">
              <h3 className="font-['Playfair_Display'] text-white text-xl font-semibold mb-2">
                {videos[currentVideoIndex]?.title}
              </h3>
              <p className="font-['Playfair_Display'] text-white/80 text-lg mb-4">
                {videos[currentVideoIndex]?.description}
              </p>

              {/* Video Navigation Indicators */}
              {videos.length > 1 && (
                <div className="flex items-center justify-center gap-4">
                  <span className="text-white/60 text-sm">
                    {currentVideoIndex + 1} of {videos.length}
                  </span>
                  <div className="flex gap-2">
                    {videos.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => {
                          setCurrentVideoIndex(index);
                          setIsVideoPlaying(false);
                        }}
                        className={`w-3 h-3 rounded-full transition-all duration-300 ${
                          index === currentVideoIndex
                            ? "bg-[#FFD700] scale-125"
                            : "bg-white/30 hover:bg-white/50"
                        }`}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </div>

      {/* Modal */}
      {selectedItem && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-6"
          onClick={() => setSelectedItem(null)}
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            className="relative max-w-4xl w-full bg-white rounded-lg max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedItem(null)}
              className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-black/70 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            {/* <div className="aspect-video relative">
              <Image
                src={selectedItem.image || "/placeholder.svg"}
                alt={selectedItem.title}
                fill
                className="object-cover"
              />
            </div> */}
            <div className="p-8">
              <h3 className="font-['Cormorant_Garamond'] text-3xl font-light text-[#365545] mb-2">
                {selectedItem.title}
              </h3>
              <p className="font-['Cinzel'] text-[#FFD700] uppercase tracking-wide text-sm mb-4">
                {selectedItem.category}
              </p>
              <p className="font-['Playfair_Display'] text-gray-700 text-lg leading-relaxed">
                {selectedItem.description}
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </section>
  );
}
