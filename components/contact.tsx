"use client";

import type React from "react";

import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Mail, Phone, MapPin, Send } from "lucide-react";
import Image from "next/image";
import { useToast } from "@/hooks/use-toast";

export function Contact() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    project: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to send message");
      }

      toast({
        title: "Success!",
        description: "Thank you! Your message has been sent successfully.",
      });
      setFormData({
        name: "",
        email: "",
        phone: "",
        project: "",
        message: "",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send message. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <section id="contact" ref={ref} className="py-16 relative overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 w-full h-full z-0">
        <Image
          src="/images/contact-background-wood.jpg"
          alt="Luxury Modern Interior with Wood Paneling"
          fill
          className="object-cover"
          priority
        />
        {/* Very light overlay to ensure text readability while keeping rich wood background highly visible */}
        <div className="absolute inset-0 bg-white/10" />
        <div className="absolute inset-0 bg-gradient-to-r from-white/15 via-white/10 to-white/5" />
      </div>

      <div className="container mx-auto px-6 relative z-20">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1 }}
            className="text-center mb-20 px-4"
          >
            {/* Heading */}
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 1, delay: 0.2 }}
              className="font-['Cormorant_Garamond'] text-5xl md:text-6xl font-normal text-[#FFD700] mb-5 tracking-wide"
              style={{
                textShadow:
                  "0 2px 10px rgba(0, 0, 0, 0.9), 0 0 20px rgba(0, 0, 0, 0.6)",
              }}
            >
              Let&apos;s Create Together
            </motion.h2>

            {/* Gold Accent Line */}
            <motion.div
              initial={{ width: 0 }}
              animate={isInView ? { width: "5rem" } : {}}
              transition={{ duration: 1, delay: 0.4 }}
              className="h-1 bg-gradient-to-r from-[#FFD700] to-[#b8860b] mx-auto rounded-full mb-6 shadow-md"
            />

            {/* Paragraph */}
            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 1, delay: 0.6 }}
              className="font-['Playfair_Display'] text-lg md:text-xl text-gray-100 leading-relaxed max-w-2xl mx-auto"
              style={{
                color: "rgba(255, 255, 255, 0.85)", // ✅ Soft white for better contrast
                textShadow: "0 1px 3px rgba(0, 0, 0, 0.6)", // ✅ Slight shadow for readability
              }}
            >
              Ready to transform your space? We&apos;d love to hear about your
              vision and discuss how we can bring your dream project to life.
              Get in touch with us today.
            </motion.p>
          </motion.div>

          {/* Main Content */}
          <div className="grid lg:grid-cols-2 gap-12 items-start">
            {/* Contact Info */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 1, delay: 0.8 }}
              className="space-y-8"
            >
              <div className="flex items-center space-x-4 bg-white/50 backdrop-blur-sm rounded-lg p-4 shadow-lg border border-white/30">
                <div className="w-12 h-12 rounded-full bg-[#365545] flex items-center justify-center">
                  <Mail className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h4 className="font-['Cinzel'] text-[#365545] font-semibold">
                    Email
                  </h4>
                  <p className="font-['Playfair_Display'] text-gray-700">
                    virali.vdesign@gmail.com
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-4 bg-white/50 backdrop-blur-sm rounded-lg p-4 shadow-lg border border-white/30">
                <div className="w-12 h-12 rounded-full bg-[#365545] flex items-center justify-center">
                  <Phone className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h4 className="font-['Cinzel'] text-[#365545] font-semibold">
                    Phone
                  </h4>
                  <p className="font-['Playfair_Display'] text-gray-700">
                    +91 97644 47006
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-4 bg-white/50 backdrop-blur-sm rounded-lg p-4 shadow-lg border border-white/30">
                <div className="w-12 h-12 rounded-full bg-[#365545] flex items-center justify-center">
                  <MapPin className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h4 className="font-['Cinzel'] text-[#365545] font-semibold">
                    Location
                  </h4>
                  <p className="font-['Playfair_Display'] text-gray-700">
                    101, Sugra Terrace Apartments, Lane Number 6, Kalyani Nagar,
                    Pune, Maharashtra 411006
                  </p>
                </div>
              </div>

              <div className="bg-white/50 backdrop-blur-sm rounded-lg p-6 shadow-lg border border-white/30">
                <h4 className="font-['Cinzel'] text-[#365545] font-semibold mb-4">
                  Office Hours
                </h4>
                <div className="space-y-2 font-['Playfair_Display'] text-gray-700">
                  <p>Monday - Friday: 9:00 AM - 6:00 PM</p>
                  <p>Saturday: 10:00 AM - 4:00 PM</p>
                  <p>Sunday: By Appointment</p>
                </div>
              </div>
            </motion.div>

            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 1, delay: 1 }}
              className="bg-white/60 backdrop-blur-md p-8 rounded-lg shadow-2xl border border-white/40"
            >
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="font-['Cinzel'] text-[#365545] font-semibold block mb-2">
                      Full Name *
                    </label>
                    <Input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full border-gray-300 focus:border-[#365545] focus:ring-[#365545] bg-white/90"
                    />
                  </div>
                  <div>
                    <label className="font-['Cinzel'] text-[#365545] font-semibold block mb-2">
                      Email Address *
                    </label>
                    <Input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full border-gray-300 focus:border-[#365545] focus:ring-[#365545] bg-white/90"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="font-['Cinzel'] text-[#365545] font-semibold block mb-2">
                      Phone Number
                    </label>
                    <Input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full border-gray-300 focus:border-[#365545] focus:ring-[#365545] bg-white/90"
                    />
                  </div>
                  <div>
                    <label className="font-['Cinzel'] text-[#365545] font-semibold block mb-2">
                      Project Type
                    </label>
                    <select
                      name="project"
                      value={formData.project}
                      onChange={handleChange}
                      className="w-full px-3 pr-8 py-2 border border-gray-300 rounded-md focus:border-[#365545] focus:ring-[#365545] focus:outline-none bg-white/90 appearance-none"
                    >
                      <option value="">Select Project Type</option>
                      <option value="residential">Residential Interior</option>
                      <option value="commercial">Commercial Space</option>
                      <option value="architecture">Architecture Design</option>
                      <option value="consultation">Design Consultation</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="font-['Cinzel'] text-[#365545] font-semibold block mb-2">
                    Project Details *
                  </label>
                  <Textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={6}
                    placeholder="Tell us about your project, timeline, budget, and any specific requirements..."
                    className="w-full border-gray-300 focus:border-[#365545] focus:ring-[#365545] bg-white/90"
                  />
                </div>

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-[#365545] hover:bg-[#2a4136] text-white font-['Cinzel'] py-3 px-8 rounded-md transition-colors duration-300 flex items-center justify-center space-x-2 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <div className="flex items-center space-x-2">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      <span>Sending...</span>
                    </div>
                  ) : (
                    <>
                      <Send className="w-5 h-5" />
                      <span>Send Inquiry</span>
                    </>
                  )}
                </Button>
              </form>
            </motion.div>
          </div>
        </div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1, delay: 1.2 }}
          className="mt-24 pt-8 border-t border-white/30 bg-white/40 backdrop-blur-sm rounded-lg p-6 shadow-lg"
        >
          <div className="flex flex-col md:flex-row justify-between items-center space-y-2 md:space-y-0">
            <p className="font-['Playfair_Display'] text-gray-700 text-center">
              Copyright © {new Date().getFullYear()} V.Design. All rights
              reserved.
            </p>
            <p className="font-['Playfair_Display'] text-gray-700 text-center">
              Developed by{" "}
              <a
                href="https://savannah-labs.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="font-['Cinzel'] text-[#365545] text-sm tracking-wide relative group transition-all duration-300 hover:text-[#2a4136] font-bold"
              >
                Savannah Labs
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#365545] transition-all duration-300 group-hover:w-full"></span>
              </a>
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
