"use client";
import { Navigation } from "@/components/navigation";
import { Hero } from "@/components/hero";
import { About } from "@/components/about";
import { Services } from "@/components/services";
import { Portfolio } from "@/components/portfolio";
import { InstagramReels } from "@/components/instagram-reels";
import { Testimonials } from "@/components/testimonials";
import { Blog } from "@/components/blog";
import { Contact } from "@/components/contact";
import { WhatsAppButton } from "@/components/ui/whatsapp-button";

export default function Home() {
  return (
    <main className="bg-[#365545] min-h-screen">
      <Navigation />
      <Hero />
      <About />
      <Services />
      <Portfolio />
      <InstagramReels />
      <Testimonials />
      {/* <Blog /> */}
      <Contact />
      <WhatsAppButton />
    </main>
  );
}
