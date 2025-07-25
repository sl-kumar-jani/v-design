"use client";

import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import { Star, ChevronLeft, ChevronRight, Quote } from "lucide-react";
import Image from "next/image";

// Interface for testimonial data
interface ITestimonial {
  _id?: string;
  name: string;
  location: string;
  project: string;
  rating: number;
  review: string;
  image: string;
  isActive?: boolean;
  order?: number;
}

// Interface for statistics data
interface IStatistics {
  _id?: string;
  happyClients: number;
  averageRating: number;
  satisfaction: number;
  awardsWon: number;
  isActive?: boolean;
  displayOrder?: number;
}

// Static fallback data
const staticTestimonials: ITestimonial[] = [
  {
    name: "Priya Sharma",
    location: "Pune, Maharashtra",
    project: "3BHK Apartment Interior",
    rating: 5,
    review:
      "Ar. Virali Dias transformed our home into a masterpiece. Her attention to detail and understanding of our lifestyle needs was exceptional. The modern design with traditional touches perfectly reflects our personality.",
    image: "/placeholder.svg?height=80&width=80",
  },
  {
    name: "Rajesh Patel",
    location: "Mumbai, Maharashtra",
    project: "Office Space Design",
    rating: 5,
    review:
      "V Design created an inspiring workspace that boosted our team's productivity. The use of natural light and premium materials created an environment that our clients and employees absolutely love.",
    image: "/placeholder.svg?height=80&width=80",
  },
  {
    name: "Anita Desai",
    location: "Pune, Maharashtra",
    project: "Villa Interior Design",
    rating: 5,
    review:
      "Working with V Design was a dream come true. Virali's vision and execution exceeded our expectations. Every corner of our villa now tells a story of elegance and sophistication.",
    image: "/placeholder.svg?height=80&width=80",
  },
  {
    name: "Vikram Singh",
    location: "Nashik, Maharashtra",
    project: "Restaurant Interior",
    rating: 5,
    review:
      "The restaurant design by V Design has become the talk of the town. The ambiance perfectly complements our cuisine, and customer footfall has increased significantly since the renovation.",
    image: "/placeholder.svg?height=80&width=80",
  },
  {
    name: "Meera Joshi",
    location: "Pune, Maharashtra",
    project: "Boutique Store Design",
    rating: 5,
    review:
      "V Design understood our brand vision perfectly. The store layout not only looks stunning but also enhances the shopping experience. Our sales have increased by 40% since the redesign.",
    image: "/placeholder.svg?height=80&width=80",
  },
];

export function Testimonials() {
  const [testimonials, setTestimonials] = useState<ITestimonial[]>([]);
  const [statistics, setStatistics] = useState<IStatistics>({
    happyClients: 50,
    averageRating: 5.0,
    satisfaction: 100,
    awardsWon: 15,
  });
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  // Fetch testimonials and statistics from database

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);

      // Fetch testimonials
      try {
        const testimonialsResponse = await fetch("/api/testimonials");
        if (testimonialsResponse.ok) {
          const testimonialsData = await testimonialsResponse.json();

          if (testimonialsData && testimonialsData.length > 0) {
            setTestimonials(testimonialsData);
          } else {
            // If no data from API, use static fallback
            setTestimonials(staticTestimonials);
          }
        } else {
          console.warn("Failed to fetch testimonials, using static data");
          setTestimonials(staticTestimonials);
        }
      } catch (error) {
        console.error("Error fetching testimonials:", error);
        // If error occurs, use static fallback
        setTestimonials(staticTestimonials);
      }

      // Fetch statistics
      try {
        const statisticsResponse = await fetch("/api/statistics");
        if (statisticsResponse.ok) {
          const statisticsData = await statisticsResponse.json();
          setStatistics(statisticsData);
        } else {
          console.warn("Failed to fetch statistics, using default values");
        }
      } catch (error) {
        console.error("Error fetching statistics:", error);
        // Keep default values if error occurs
      }

      setIsLoading(false);
    };

    fetchData();
  }, []);

  const nextTestimonial = () => {
    setCurrentIndex((prev) => (prev + 1) % (testimonials?.length || 0));
  };

  const prevTestimonial = () => {
    setCurrentIndex(
      (prev) =>
        (prev - 1 + (testimonials?.length || 0)) % (testimonials?.length || 0)
    );
  };

  // Show loading state
  if (isLoading) {
    return (
      <section id="testimonials" className="py-32 relative overflow-hidden">
        <div className="absolute inset-0 w-full h-full z-0">
          <Image
            src="/images/testimonials-background.jpg"
            alt="Industrial Brick Wall with Pendant Lights"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-black/30" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black/40" />
        </div>
        <div className="container mx-auto px-6 relative z-20">
          <div className="text-center">
            <div className="w-8 h-8 border-2 border-[#FFD700] border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="font-['Playfair_Display'] text-white mt-4">
              Loading testimonials...
            </p>
          </div>
        </div>
      </section>
    );
  }

  // If no testimonials available, don't render the section
  // if (!testimonials || testimonials.length === 0) {
  //   return null;
  // }

  const currentTestimonial = testimonials[currentIndex];

  return (
    <section
      id="testimonials"
      ref={ref}
      className="py-16 relative overflow-hidden"
    >
      {/* Background Image */}
      <div className="absolute inset-0 w-full h-full z-0">
        <Image
          src="/images/testimonials-background.jpg"
          alt="Industrial Brick Wall with Pendant Lights"
          fill
          className="object-cover"
          priority
        />
        {/* Light overlay to ensure text readability while keeping background visible */}
        <div className="absolute inset-0 bg-black/30" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black/40" />
      </div>

      <div className="container mx-auto px-6 relative z-20">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1 }}
          className="text-center mb-16"
        >
          <h2
            className="font-['Cormorant_Garamond'] text-5xl md:text-6xl font-light text-white mb-6"
            style={{
              textShadow:
                "0 2px 8px rgba(0, 0, 0, 0.8), 0 0 20px rgba(0, 0, 0, 0.5)",
            }}
          >
            Client Reviews
          </h2>
          <div className="w-16 h-0.5 bg-[#FFD700] mx-auto mb-8" />
          <p
            className="font-['Playfair_Display'] text-xl text-white/90 max-w-2xl mx-auto"
            style={{
              textShadow: "0 1px 4px rgba(0, 0, 0, 0.8)",
            }}
          >
            Discover what our clients say about their experience with V Design
          </p>
        </motion.div>

        {/* Main Testimonial */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1, delay: 0.2 }}
          className="max-w-4xl mx-auto"
        >
          <div className="bg-white/10 backdrop-blur-md rounded-2xl shadow-2xl p-8 md:p-12 relative border border-white/20">
            {/* Quote Icon */}
            <div className="absolute top-6 left-6 text-[#FFD700] opacity-30">
              <Quote className="w-12 h-12" />
            </div>

            <div className="text-center">
              {/* Stars */}
              <div className="flex justify-center mb-6">
                {[...Array(currentTestimonial?.rating)].map((_, i) => (
                  <Star
                    key={i}
                    className="w-6 h-6 text-[#FFD700] fill-current"
                  />
                ))}
              </div>

              {/* Review Text */}
              <blockquote
                className="font-['Playfair_Display'] text-xl md:text-2xl text-white leading-relaxed mb-8 italic"
                style={{
                  textShadow: "0 1px 4px rgba(0, 0, 0, 0.8)",
                }}
              >
                "{currentTestimonial?.review}"
              </blockquote>

              {/* Client Info */}
              <div className="flex items-center justify-center space-x-4">
                <Image
                  src={currentTestimonial?.image || "/placeholder.svg"}
                  alt={currentTestimonial?.name || "Client Image"}
                  width={80}
                  height={80}
                  className="w-16 h-16 rounded-full object-cover border-2 border-[#FFD700]"
                />
                <div className="text-left">
                  <h4
                    className="font-['Cinzel'] text-white font-semibold text-lg"
                    style={{
                      textShadow: "0 1px 3px rgba(0, 0, 0, 0.8)",
                    }}
                  >
                    {currentTestimonial?.name}
                  </h4>
                  <p
                    className="font-['Playfair_Display'] text-white/80"
                    style={{
                      textShadow: "0 1px 3px rgba(0, 0, 0, 0.8)",
                    }}
                  >
                    {currentTestimonial?.location}
                  </p>
                  <p className="font-['Cinzel'] text-[#FFD700] text-sm uppercase tracking-wide">
                    {currentTestimonial?.project}
                  </p>
                </div>
              </div>
            </div>

            {/* Navigation Buttons */}
            <div className="flex justify-between items-center mt-8">
              <button
                onClick={prevTestimonial}
                className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm text-white flex items-center justify-center hover:bg-white/30 transition-colors duration-300 border border-white/30"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>

              {/* Dots Indicator */}
              <div className="flex space-x-2">
                {testimonials?.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentIndex(index)}
                    className={`w-3 h-3 rounded-full transition-colors duration-300 ${
                      index === currentIndex ? "bg-[#FFD700]" : "bg-white/40"
                    }`}
                  />
                ))}
              </div>

              <button
                onClick={nextTestimonial}
                className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm text-white flex items-center justify-center hover:bg-white/30 transition-colors duration-300 border border-white/30"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </div>
          </div>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1, delay: 0.4 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-16 max-w-3xl mx-auto"
        >
          <div className="text-center bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
            <h4
              className="font-['Cinzel'] text-3xl font-semibold text-[#FFD700] mb-2"
              style={{
                textShadow: "0 1px 3px rgba(0, 0, 0, 0.8)",
              }}
            >
              {statistics.happyClients}+
            </h4>
            <p
              className="font-['Playfair_Display'] text-white/80 uppercase tracking-wide text-sm"
              style={{
                textShadow: "0 1px 3px rgba(0, 0, 0, 0.8)",
              }}
            >
              Happy Clients
            </p>
          </div>
          <div className="text-center bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
            <h4
              className="font-['Cinzel'] text-3xl font-semibold text-[#FFD700] mb-2"
              style={{
                textShadow: "0 1px 3px rgba(0, 0, 0, 0.8)",
              }}
            >
              {statistics.averageRating.toFixed(1)}
            </h4>
            <p
              className="font-['Playfair_Display'] text-white/80 uppercase tracking-wide text-sm"
              style={{
                textShadow: "0 1px 3px rgba(0, 0, 0, 0.8)",
              }}
            >
              Average Rating
            </p>
          </div>
          <div className="text-center bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
            <h4
              className="font-['Cinzel'] text-3xl font-semibold text-[#FFD700] mb-2"
              style={{
                textShadow: "0 1px 3px rgba(0, 0, 0, 0.8)",
              }}
            >
              {statistics.satisfaction}%
            </h4>
            <p
              className="font-['Playfair_Display'] text-white/80 uppercase tracking-wide text-sm"
              style={{
                textShadow: "0 1px 3px rgba(0, 0, 0, 0.8)",
              }}
            >
              Satisfaction
            </p>
          </div>
          <div className="text-center bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
            <h4
              className="font-['Cinzel'] text-3xl font-semibold text-[#FFD700] mb-2"
              style={{
                textShadow: "0 1px 3px rgba(0, 0, 0, 0.8)",
              }}
            >
              {statistics.awardsWon}+
            </h4>
            <p
              className="font-['Playfair_Display'] text-white/80 uppercase tracking-wide text-sm"
              style={{
                textShadow: "0 1px 3px rgba(0, 0, 0, 0.8)",
              }}
            >
              Awards Won
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
