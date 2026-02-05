"use client";

import { GlassCard } from "@/components/glass/GlassCard";
import { motion } from "framer-motion";
import { Car } from "lucide-react";

export default function CarPricesPage() {
  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center gap-3 mb-2">
          <Car className="w-6 h-6 text-burgundy" />
          <h1 className="text-3xl font-bold text-foreground">
            Car Price Distribution <sub className="text-sm opacity-60 font-normal">R</sub>
          </h1>
        </div>
        <p className="text-foreground-muted">
          Interactive RShiny application exploring the relationship between car
          prices and mileage at time of sale. Built with R and hosted on
          Shinyapps.io.
        </p>
      </motion.div>

      <GlassCard className="p-2">
        <div className="rounded-xl overflow-hidden border border-white/[0.06]">
          <iframe
            src="https://fxyqh7-james-callahan.shinyapps.io/car_shinyapp/"
            className="w-full bg-bg-card"
            style={{ height: "1950px" }}
            title="Car Prices RShiny App"
          />
        </div>
      </GlassCard>
    </div>
  );
}
