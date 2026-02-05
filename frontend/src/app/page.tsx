"use client";

import { GlassCard } from "@/components/glass/GlassCard";
import { motion } from "framer-motion";
import { Download, Linkedin, Github } from "lucide-react";
import Image from "next/image";

export default function HomePage() {
  return (
    <div className="space-y-10">
      {/* Hero */}
      <motion.section
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="flex flex-col md:flex-row items-center gap-8"
      >
        {/* Profile photo */}
        <div className="relative shrink-0">
          <div className="w-52 h-52 rounded-full overflow-hidden ring-2 ring-cerulean/40 shadow-glow relative before:absolute before:inset-0 before:rounded-full before:bg-gradient-to-br before:from-cerulean/20 before:to-burgundy/20 before:backdrop-blur-sm before:-z-10">
            <Image
              src="/images/profile.jpeg"
              alt="James Callahan"
              width={208}
              height={208}
              className="object-cover w-full h-full"
              priority
            />
          </div>
        </div>

        {/* Intro text */}
        <div className="text-center md:text-left">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground tracking-tight">
            James Callahan
          </h1>
          <p className="text-lg text-cerulean-light mt-2 font-medium">
            Generative AI Engineer
          </p>
          <p className="text-foreground-muted mt-4 max-w-lg leading-relaxed">
            Building and deploying generative AI agents, RAG systems, and
            data-driven applications. Currently at PwC, previously Deloitte and
            Guidehouse. MS Quantitative Economics, University of Pittsburgh.
            Outside of work, I enjoy working on cars, traveling, and dancing.
          </p>

          {/* Social links */}
          <div className="flex gap-3 mt-6 justify-center md:justify-start">
            <a
              href="https://www.linkedin.com/in/jamesacallahan"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary flex items-center gap-2"
            >
              <Linkedin className="w-4 h-4 text-burgundy" />
              LinkedIn
            </a>
            <a
              href="https://github.com/jcallahan997"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary flex items-center gap-2"
            >
              <Github className="w-4 h-4 text-burgundy" />
              GitHub
            </a>
          </div>
        </div>
      </motion.section>

      {/* Resume */}
      <GlassCard className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-foreground">Resume</h2>
          <a
            href="/resume/James_Callahan_Resume.pdf"
            download
            className="btn-burgundy flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            Download PDF
          </a>
        </div>
        <div className="rounded-xl overflow-hidden border border-white/[0.06] relative" style={{ height: "1100px" }}>
          <object
            data="/resume/James_Callahan_Resume.pdf#toolbar=0&navpanes=0&scrollbar=0&view=FitH"
            type="application/pdf"
            className="w-full h-full"
            style={{ display: "block" }}
          >
            <p className="text-foreground-muted p-4">
              Unable to display PDF.{" "}
              <a href="/resume/James_Callahan_Resume.pdf" className="text-cerulean-light hover:underline">
                Download instead
              </a>
            </p>
          </object>
        </div>
      </GlassCard>
    </div>
  );
}
