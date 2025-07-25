"use client";

import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import Image from "next/image";
import { Calendar, User, ArrowRight, Clock } from "lucide-react";

const blogPosts = [
  {
    id: 1,
    title: `10 Interior Design Trends Dominating ${new Date().getFullYear()}`,
    excerpt:
      "Discover the latest interior design trends that are shaping modern homes this year, from sustainable materials to bold color palettes.",
    image:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/WhatsApp%20Image%202025-06-30%20at%204.17.45%20PM-SjK5owJhhzFf5WmS4pQS1WgsKdeMX8.jpeg",
    author: "Ar. Virali Dias",
    date: "December 15, 2024",
    readTime: "5 min read",
    category: "Trends",
    slug: "interior-design-trends-2024",
  },
  {
    id: 2,
    title: "Maximizing Small Spaces: Design Tips for Compact Homes",
    excerpt:
      "Learn how to make the most of limited space with clever design solutions, smart storage, and multi-functional furniture.",
    image:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/WhatsApp%20Image%202025-06-30%20at%204.17.44%20PM-PXd8NFSXOIipdG7EoUGiIzn4wlmHTI.jpeg",
    author: "Ar. Virali Dias",
    date: "December 10, 2024",
    readTime: "7 min read",
    category: "Tips",
    slug: "maximizing-small-spaces",
  },
  {
    id: 3,
    title: "The Psychology of Color in Interior Design",
    excerpt:
      "Understand how different colors affect mood and behavior, and learn to choose the perfect palette for each room in your home.",
    image:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/WhatsApp%20Image%202025-06-30%20at%204.17.43%20PM-HYtkudo69u134IJD0TjN6VHlsiKzDi.jpeg",
    author: "Ar. Virali Dias",
    date: "December 5, 2024",
    readTime: "6 min read",
    category: "Psychology",
    slug: "psychology-of-color",
  },
  {
    id: 4,
    title: "Sustainable Architecture: Building for the Future",
    excerpt:
      "Explore eco-friendly building practices and sustainable materials that are revolutionizing modern architecture.",
    image:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/WhatsApp%20Image%202025-06-30%20at%204.17.37%20PM-nQJt4fbARSeI8cDwAiRqOID2niurmd.jpeg",
    author: "Ar. Virali Dias",
    date: "November 28, 2024",
    readTime: "8 min read",
    category: "Sustainability",
    slug: "sustainable-architecture",
  },
];

export function Blog() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section
      id="blog"
      ref={ref}
      className="py-32 bg-white relative overflow-hidden"
    >
      {/* Background Elements */}
      {/* <div className="absolute top-0 left-0 w-1/3 h-full bg-gradient-to-r from-[#365545]/5 to-transparent" /> */}

      <div className="container mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1 }}
          className="text-center mb-16"
        >
          <h2 className="font-['Cormorant_Garamond'] text-5xl md:text-6xl font-light text-[#365545] mb-6">
            Design Insights
          </h2>
          <div className="w-16 h-0.5 bg-[#FFD700] mx-auto mb-8" />
          <p className="font-['Playfair_Display'] text-xl text-gray-700 max-w-2xl mx-auto">
            Explore our latest thoughts on design trends, tips, and
            architectural innovations
          </p>
        </motion.div>

        {/* Featured Post */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1, delay: 0.2 }}
          className="mb-16"
        >
          <div className="grid lg:grid-cols-2 gap-12 items-center bg-gray-50 rounded-2xl overflow-hidden shadow-xl">
            <div className="relative aspect-[4/3] lg:aspect-auto lg:h-full">
              <Image
                src={blogPosts[0].image || "/placeholder.svg"}
                alt={blogPosts[0].title}
                fill
                className="object-cover"
              />
              <div className="absolute top-4 left-4">
                <span className="bg-[#FFD700] text-[#365545] px-3 py-1 rounded-full text-sm font-['Cinzel'] font-semibold uppercase tracking-wide">
                  Featured
                </span>
              </div>
            </div>
            <div className="p-8 lg:p-12">
              <div className="flex items-center space-x-4 mb-4">
                <span className="bg-[#365545] text-white px-3 py-1 rounded-full text-sm font-['Cinzel'] uppercase tracking-wide">
                  {blogPosts[0].category}
                </span>
                <div className="flex items-center text-gray-500 text-sm">
                  <Clock className="w-4 h-4 mr-1" />
                  {blogPosts[0].readTime}
                </div>
              </div>
              <h3 className="font-['Cormorant_Garamond'] text-3xl md:text-4xl font-light text-[#365545] mb-4">
                {blogPosts[0].title}
              </h3>
              <p className="font-['Playfair_Display'] text-gray-700 text-lg leading-relaxed mb-6">
                {blogPosts[0].excerpt}
              </p>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <User className="w-5 h-5 text-gray-400" />
                  <span className="font-['Cinzel'] text-gray-600">
                    {blogPosts[0].author}
                  </span>
                  <Calendar className="w-5 h-5 text-gray-400 ml-4" />
                  <span className="font-['Playfair_Display'] text-gray-600">
                    {blogPosts[0].date}
                  </span>
                </div>
                {/* <button className="flex items-center space-x-2 text-[#365545] hover:text-[#FFD700] transition-colors duration-300">
                  <span className="font-['Cinzel'] font-semibold">
                    Read More
                  </span>
                  <ArrowRight className="w-5 h-5" />
                </button> */}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Blog Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 1, delay: 0.4 }}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {blogPosts.slice(1).map((post, index) => (
            <motion.article
              key={post.id}
              initial={{ opacity: 0, y: 50 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.1 * index }}
              className="bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-300 group"
            >
              <div className="relative aspect-[4/3] overflow-hidden">
                <Image
                  src={post.image || "/placeholder.svg"}
                  alt={post.title}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute top-4 left-4">
                  <span className="bg-[#365545] text-white px-3 py-1 rounded-full text-sm font-['Cinzel'] uppercase tracking-wide">
                    {post.category}
                  </span>
                </div>
              </div>
              <div className="p-6">
                <div className="flex items-center text-gray-500 text-sm mb-3">
                  <Clock className="w-4 h-4 mr-1" />
                  {post.readTime}
                </div>
                <h3 className="font-['Cormorant_Garamond'] text-xl font-semibold text-[#365545] mb-3 group-hover:text-[#FFD700] transition-colors duration-300">
                  {post.title}
                </h3>
                <p className="font-['Playfair_Display'] text-gray-600 leading-relaxed mb-4">
                  {post.excerpt}
                </p>
                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <div className="flex items-center space-x-2 text-sm text-gray-500">
                    <Calendar className="w-4 h-4" />
                    <span className="font-['Playfair_Display']">
                      {post.date}
                    </span>
                  </div>
                  {/* <button className="flex items-center space-x-1 text-[#365545] hover:text-[#FFD700] transition-colors duration-300">
                    <span className="font-['Cinzel'] font-semibold text-sm">
                      Read
                    </span>
                    <ArrowRight className="w-4 h-4" />
                  </button> */}
                </div>
              </div>
            </motion.article>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
