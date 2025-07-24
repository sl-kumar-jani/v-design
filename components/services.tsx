"use client";

import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import {
  Home,
  Building2,
  Palette,
  Lightbulb,
  Sofa,
  TreePine,
  ArrowRight,
  CheckCircle,
} from "lucide-react";

const services = [
  {
    id: 1,
    icon: Home,
    title: "Residential Interior Design",
    description:
      "Transform your home into a personalized sanctuary with our comprehensive interior design services.",
    features: [
      "Space Planning & Layout",
      "Color Scheme & Material Selection",
      "Custom Furniture Design",
      "Lighting Design",
      "Project Management",
    ],
    price: "Starting from ₹2,50,000",
  },
  {
    id: 2,
    icon: Building2,
    title: "Architectural Design",
    description:
      "Complete architectural solutions from concept to construction for residential and commercial projects.",
    features: [
      "Architectural Planning",
      "3D Visualization",
      "Structural Design",
      "Building Permits",
      "Construction Supervision",
    ],
    price: "Starting from ₹5,00,000",
  },
  {
    id: 3,
    icon: Palette,
    title: "Commercial Interior Design",
    description:
      "Create inspiring workspaces that enhance productivity and reflect your brand identity.",
    features: [
      "Space Planning",
      "Brand Integration",
      "Ergonomic Design",
      "Acoustic Solutions",
      "Sustainable Materials",
    ],
    price: "Starting from ₹3,50,000",
  },
  {
    id: 4,
    icon: Lightbulb,
    title: "Lighting Design",
    description:
      "Illuminate your spaces with expertly designed lighting solutions that enhance ambiance and functionality.",
    features: [
      "Natural Light Optimization",
      "LED Integration",
      "Smart Lighting Systems",
      "Decorative Lighting",
      "Energy Efficiency",
    ],
    price: "Starting from ₹1,50,000",
  },
  {
    id: 5,
    icon: Sofa,
    title: "Furniture Design",
    description:
      "Custom furniture pieces designed to perfectly fit your space and lifestyle requirements.",
    features: [
      "Custom Furniture Design",
      "Space-Specific Solutions",
      "Premium Materials",
      "Handcrafted Quality",
      "Installation Service",
    ],
    price: "Starting from ₹75,000",
  },
];

export function Services() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section
      id="service"
      ref={ref}
      className="py-16 bg-white relative overflow-hidden"
    >
      {/* Background Elements */}
      {/* <div className="absolute top-0 left-0 w-1/3 h-full bg-gradient-to-r from-[#365545]/5 to-transparent" />
      <div className="absolute bottom-0 right-0 w-1/3 h-full bg-gradient-to-l from-[#365545]/5 to-transparent" /> */}

      <div className="container mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1 }}
          className="text-center mb-16"
        >
          <h2 className="font-['Cormorant_Garamond'] text-5xl md:text-6xl font-light text-[#365545] mb-6">
            Our Services
          </h2>
          <div className="w-16 h-0.5 bg-[#FFD700] mx-auto mb-8" />
          <p className="font-['Playfair_Display'] text-xl text-gray-700 max-w-2xl mx-auto">
            Comprehensive design solutions tailored to transform your vision
            into reality
          </p>
        </motion.div>

        {/* Services Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 1, delay: 0.2 }}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {services.map((service, index) => (
            <motion.div
              key={service.id}
              initial={{ opacity: 0, y: 50 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              // transition={{ duration: 0.8, delay: 0.1 * index }}
              className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100 hover:border-[#FFD700]/30"
            >
              <div className="p-8">
                {/* Icon */}
                <div className="w-16 h-16 rounded-full bg-[#365545] flex items-center justify-center mb-6 hover:bg-[#FFD700] transition-colors duration-300">
                  <service.icon className="w-8 h-8 text-white hover:text-[#365545]" />
                </div>

                {/* Title */}
                <h3 className="font-['Cormorant_Garamond'] text-2xl font-semibold text-[#365545] mb-4 hover:text-[#FFD700] transition-colors duration-300">
                  {service.title}
                </h3>

                {/* Description */}
                <p className="font-['Playfair_Display'] text-gray-600 leading-relaxed mb-6">
                  {service.description}
                </p>

                {/* Features */}
                <ul className="space-y-2 mb-6">
                  {service.features.map((feature, idx) => (
                    <li
                      key={idx}
                      className="flex items-center text-sm text-gray-600"
                    >
                      <CheckCircle className="w-4 h-4 text-[#FFD700] mr-2 flex-shrink-0" />
                      <span className="font-['Playfair_Display']">
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>

                {/* Price */}
                {/* <div className="border-t border-gray-100 pt-6">
                  <p className="font-['Cinzel'] text-[#365545] font-semibold mb-4">{service.price}</p>
                  <button className="w-full bg-[#365545] hover:bg-[#FFD700] text-white hover:text-[#365545] font-['Cinzel'] py-3 px-6 rounded-lg transition-all duration-300 flex items-center justify-center space-x-2 group">
                    <span>Learn More</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                  </button>
                </div> */}
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1, delay: 0.6 }}
          className="text-center mt-16 bg-[#365545] rounded-2xl p-12"
        >
          <h3
            className="font-['Cormorant_Garamond'] text-3xl md:text-4xl font-light text-white mb-4"
            onClick={() => {
              window.location.href = "#contact";
            }}
          >
            Ready to Transform Your Space?
          </h3>
          <p className="font-['Playfair_Display'] text-white/80 text-lg mb-8 max-w-2xl mx-auto">
            Let's discuss your project and create something extraordinary
            together. Contact us for a free consultation.
          </p>
          <button
            className="bg-[#FFD700] hover:bg-white text-[#365545] font-['Cinzel'] font-semibold px-8 py-4 rounded-lg transition-colors duration-300 inline-flex items-center space-x-2"
            onClick={() => {
              window.location.href = "#contact";
            }}
          >
            <span>Get Free Consultation</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </motion.div>
      </div>
    </section>
  );
}
