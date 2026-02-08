"use client";

import { useState } from "react";
import { GlassCard } from "@/components/glass/GlassCard";
import { motion } from "framer-motion";
import { Sparkles, ArrowRight, Cpu, Database, Brain, Image as ImageIcon } from "lucide-react";
import Image from "next/image";

const EPOCHS = ["03", "06", "09", "12", "15", "18"];
const SAMPLES_PER_EPOCH = 3;

const PIPELINE_STEPS = [
  {
    icon: Database,
    title: "Data Collection",
    desc: "87 Mercedes E-Class images from Stanford Cars Dataset",
  },
  {
    icon: Brain,
    title: "Caption Generation",
    desc: "Automated captioning via Qwen2-VL vision model (Ollama)",
  },
  {
    icon: Cpu,
    title: "LoRA Training",
    desc: "Kohya sd-scripts on SDXL, optimized for Apple M4 Max",
  },
  {
    icon: ImageIcon,
    title: "Inference",
    desc: "ComfyUI with SDXL base + refiner pipeline",
  },
];

const TRAINING_CONFIG = [
  { label: "Base Model", value: "SDXL 1.0" },
  { label: "Network", value: "LoRA (dim=32, alpha=16)" },
  { label: "Optimizer", value: "AdamW (weight_decay=0.01)" },
  { label: "Learning Rate", value: "5e-5 (cosine w/ restarts)" },
  { label: "Resolution", value: "1024 x 1024 (bucketing)" },
  { label: "Epochs", value: "18" },
  { label: "Batch Size", value: "2" },
  { label: "Hardware", value: "36GB+ RAM recommended" },
  { label: "Trigger Word", value: "mercedesbenzeclasssedan2012" },
  { label: "Training Images", value: "87" },
];

export default function SdxlLoraPage() {
  const [activeEpoch, setActiveEpoch] = useState("18");

  return (
    <div className="space-y-10">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center gap-3 mb-2">
          <Sparkles className="w-6 h-6 text-burgundy" />
          <h1 className="text-3xl font-bold text-foreground">
            Stable Diffusion LoRA <span className="text-lg opacity-60 font-normal block">Automotive Application</span>
          </h1>
        </div>
        <p className="text-foreground-muted leading-relaxed">
          Fine-tuned a Stable Diffusion XL (SDXL) model using Low-Rank
          Adaptation (LoRA) to generate photorealistic Mercedes-Benz E-Class
          Sedan (2012) images. Trained on 87 images from the Stanford Cars
          Dataset using Kohya sd-scripts, optimized for Apple Silicon.
        </p>
      </motion.div>

      {/* Pipeline Timeline */}
      <GlassCard>
        <h2 className="text-lg font-semibold text-foreground mb-6">
          Training Pipeline
        </h2>
        <div className="flex flex-col md:flex-row items-start md:items-center gap-4 md:gap-2">
          {PIPELINE_STEPS.map((step, i) => (
            <div key={step.title} className="flex items-center gap-2 flex-1">
              <div className="flex flex-col items-center text-center flex-1">
                <div className="w-12 h-12 rounded-2xl glass-subtle flex items-center justify-center mb-3">
                  <step.icon className="w-5 h-5 text-burgundy" />
                </div>
                <p className="text-sm font-medium text-foreground">
                  {step.title}
                </p>
                <p className="text-xs text-foreground-muted mt-1 max-w-[160px]">
                  {step.desc}
                </p>
              </div>
              {i < PIPELINE_STEPS.length - 1 && (
                <ArrowRight className="w-4 h-4 text-foreground-muted shrink-0 hidden md:block" />
              )}
            </div>
          ))}
        </div>
      </GlassCard>

      {/* Training Config */}
      <GlassCard variant="burgundy">
        <h2 className="text-lg font-semibold text-foreground mb-4">
          Training Configuration
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {TRAINING_CONFIG.map((item) => (
            <div key={item.label} className="min-w-0">
              <p className="text-[10px] text-foreground-muted uppercase tracking-wider">
                {item.label}
              </p>
              <p className="text-sm font-medium text-foreground mt-0.5 break-all">
                {item.value}
              </p>
            </div>
          ))}
        </div>
      </GlassCard>

      {/* Epoch Progression Gallery */}
      <GlassCard>
        <h2 className="text-lg font-semibold text-foreground mb-2">
          Training Progression
        </h2>
        <p className="text-sm text-foreground-muted mb-6">
          Sample outputs at each checkpoint epoch, showing progressive
          improvement in generation quality.
        </p>

        {/* Epoch tabs */}
        <div className="flex gap-2 mb-6 flex-wrap">
          {EPOCHS.map((epoch) => (
            <button
              key={epoch}
              onClick={() => setActiveEpoch(epoch)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                activeEpoch === epoch
                  ? "bg-burgundy/30 border border-burgundy/50 text-foreground shadow-glow-burgundy"
                  : "bg-white/[0.04] border border-white/[0.08] text-foreground-muted hover:bg-white/[0.06]"
              }`}
            >
              Epoch {parseInt(epoch)}
            </button>
          ))}
        </div>

        {/* Image grid */}
        <motion.div
          key={activeEpoch}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-4"
        >
          {Array.from({ length: SAMPLES_PER_EPOCH }, (_, i) => (
            <div
              key={i}
              className="rounded-xl overflow-hidden border border-white/[0.08] bg-bg-card aspect-square relative"
            >
              <Image
                src={`/images/sdxl/epoch-${activeEpoch}/sample_${i}.png`}
                alt={`Epoch ${parseInt(activeEpoch)} sample ${i + 1}`}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 33vw"
              />
            </div>
          ))}
        </motion.div>
      </GlassCard>

      {/* Links */}
      <GlassCard className="text-center">
        <p className="text-foreground-muted text-sm">
          <a
            href="https://github.com/jcallahan997/SDXL-LoRa-Creation-from-Stanford-Cars-Dataset"
            target="_blank"
            rel="noopener noreferrer"
            className="text-cerulean-light hover:underline"
          >
            GitHub
          </a>{" "}
          &middot; Training framework:{" "}
          <a
            href="https://github.com/kohya-ss/sd-scripts"
            target="_blank"
            rel="noopener noreferrer"
            className="text-cerulean-light hover:underline"
          >
            Kohya sd-scripts
          </a>{" "}
          &middot; Inference:{" "}
          <a
            href="https://github.com/comfyanonymous/ComfyUI"
            target="_blank"
            rel="noopener noreferrer"
            className="text-cerulean-light hover:underline"
          >
            ComfyUI
          </a>{" "}
          &middot; Dataset:{" "}
          <a
            href="https://ai.stanford.edu/~jkrause/cars/car_dataset.html"
            target="_blank"
            rel="noopener noreferrer"
            className="text-cerulean-light hover:underline"
          >
            Stanford Cars
          </a>
        </p>
      </GlassCard>
    </div>
  );
}
