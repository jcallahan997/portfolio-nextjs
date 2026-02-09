"use client";

import { GlassCard } from "@/components/glass/GlassCard";
import { motion } from "framer-motion";
import { TrendingUp, Github } from "lucide-react";
import { useEffect, useRef, useState } from "react";

export default function CarPricesPage() {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [iframeHeight, setIframeHeight] = useState(4000);

  useEffect(() => {
    const handleMessage = (e: MessageEvent) => {
      if (e.data?.type === "shiny-height" && typeof e.data.height === "number") {
        setIframeHeight(e.data.height);
      }
    };
    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, []);

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center gap-3 mb-2">
          <TrendingUp className="w-6 h-6 text-burgundy" />
          <h1 className="text-3xl font-bold text-foreground">
            U.S. Vehicle Sales Trends
          </h1>
        </div>
        <p className="text-foreground-muted">
          Interactive dashboard analyzing 35 years of U.S. vehicle sales data
          from the Bureau of Transportation Statistics. Explore the dramatic
          shift from passenger cars to trucks/SUVs, the rise of leasing, and
          the affordability crisis. Built with R Shiny and hosted on
          Shinyapps.io.
        </p>
        <a
          href="https://github.com/jcallahan997/vehicle-sales-shiny"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 mt-3 text-sm text-cerulean hover:text-cerulean-light transition-colors"
        >
          <Github className="w-4 h-4" />
          View source on GitHub
        </a>
      </motion.div>

      <GlassCard className="p-2">
        <div className="rounded-xl overflow-hidden border border-white/[0.06]">
          <iframe
            ref={iframeRef}
            src="https://fxyqh7-james-callahan.shinyapps.io/vehicle-sales-shiny/"
            className="w-full bg-bg-card"
            style={{ height: `${iframeHeight}px`, overflow: "hidden" }}
            scrolling="no"
            title="U.S. Vehicle Sales Trends - R Shiny Dashboard"
          />
        </div>
      </GlassCard>
    </div>
  );
}
