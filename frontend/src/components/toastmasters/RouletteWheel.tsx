"use client";

import { useRef, useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface RouletteWheelProps {
  topics: string[];
  onResult?: (topic: string) => void;
}

// Alternating teal/burgundy segment colors
const SEGMENT_COLORS = [
  "rgba(0, 128, 128, 0.6)",
  "rgba(114, 47, 55, 0.6)",
  "rgba(0, 128, 128, 0.45)",
  "rgba(114, 47, 55, 0.45)",
  "rgba(0, 128, 128, 0.55)",
  "rgba(114, 47, 55, 0.55)",
];

export function RouletteWheel({ topics, onResult }: RouletteWheelProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);
  const [spinning, setSpinning] = useState(false);
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
  const angleRef = useRef(0);

  const size = 380;
  const center = size / 2;
  const radius = size / 2 - 10;

  const drawWheel = useCallback(
    (angle: number) => {
      const canvas = canvasRef.current;
      if (!canvas || topics.length === 0) return;

      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      ctx.clearRect(0, 0, size, size);

      const segmentAngle = (2 * Math.PI) / topics.length;

      topics.forEach((topic, i) => {
        const startAngle = angle + i * segmentAngle;
        const endAngle = startAngle + segmentAngle;

        // Draw segment
        ctx.beginPath();
        ctx.moveTo(center, center);
        ctx.arc(center, center, radius, startAngle, endAngle);
        ctx.closePath();
        ctx.fillStyle = SEGMENT_COLORS[i % SEGMENT_COLORS.length];
        ctx.fill();
        ctx.strokeStyle = "rgba(255, 255, 255, 0.15)";
        ctx.lineWidth = 1;
        ctx.stroke();

        // Draw text
        ctx.save();
        ctx.translate(center, center);
        ctx.rotate(startAngle + segmentAngle / 2);
        ctx.textAlign = "right";
        ctx.fillStyle = "#e6edf3";
        ctx.font = `${Math.max(10, Math.min(13, 200 / topics.length))}px "EB Garamond", Georgia, serif`;

        // Truncate text to fit
        const maxLen = 28;
        const label =
          topic.length > maxLen ? topic.slice(0, maxLen - 1) + "\u2026" : topic;
        ctx.fillText(label, radius - 14, 4);
        ctx.restore();
      });

      // Center circle
      ctx.beginPath();
      ctx.arc(center, center, 22, 0, 2 * Math.PI);
      ctx.fillStyle = "rgba(8, 12, 16, 0.9)";
      ctx.fill();
      ctx.strokeStyle = "rgba(255, 255, 255, 0.2)";
      ctx.lineWidth = 2;
      ctx.stroke();

      // Pointer (top)
      ctx.beginPath();
      ctx.moveTo(center - 12, 4);
      ctx.lineTo(center + 12, 4);
      ctx.lineTo(center, 28);
      ctx.closePath();
      ctx.fillStyle = "#20B2AA";
      ctx.fill();
    },
    [topics, center, radius, size]
  );

  useEffect(() => {
    drawWheel(angleRef.current);
  }, [drawWheel]);

  const spin = useCallback(() => {
    if (spinning || topics.length === 0) return;

    setSpinning(true);
    setSelectedTopic(null);

    // Random spin: 3-6 full rotations + random offset
    const totalRotation =
      Math.PI * 2 * (3 + Math.random() * 3) + Math.random() * Math.PI * 2;
    const duration = 4000; // 4 seconds
    const startTime = performance.now();
    const startAngle = angleRef.current;

    const animate = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Ease-out cubic deceleration
      const eased = 1 - Math.pow(1 - progress, 3);
      const currentAngle = startAngle + totalRotation * eased;

      angleRef.current = currentAngle;
      drawWheel(currentAngle);

      if (progress < 1) {
        animRef.current = requestAnimationFrame(animate);
      } else {
        // Determine winner: segment at top (pointer at angle 3π/2 from right)
        const segmentAngle = (2 * Math.PI) / topics.length;
        const pointerAngle = (3 * Math.PI) / 2; // top
        const normalizedAngle =
          ((pointerAngle - currentAngle) % (2 * Math.PI) + 2 * Math.PI) %
          (2 * Math.PI);
        const winnerIndex = Math.floor(normalizedAngle / segmentAngle) % topics.length;

        setSelectedTopic(topics[winnerIndex]);
        onResult?.(topics[winnerIndex]);
        setSpinning(false);
      }
    };

    animRef.current = requestAnimationFrame(animate);
  }, [spinning, topics, drawWheel, onResult]);

  useEffect(() => {
    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current);
    };
  }, []);

  return (
    <div className="flex flex-col items-center gap-6">
      <div className="relative">
        <canvas
          ref={canvasRef}
          width={size}
          height={size}
          className="rounded-full"
          style={{ filter: "drop-shadow(0 0 30px rgba(0, 128, 128, 0.15))" }}
        />
      </div>

      <button
        onClick={spin}
        disabled={spinning || topics.length === 0}
        className={`btn-burgundy text-base px-8 py-3 ${
          spinning ? "opacity-50 cursor-not-allowed" : ""
        }`}
      >
        {spinning ? "Spinning..." : "Spin the Wheel!"}
      </button>

      {/* Result modal */}
      <AnimatePresence>
        {selectedTopic && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 10 }}
            className="glass p-6 text-center max-w-md"
          >
            <p className="text-xs text-foreground-muted uppercase tracking-wider mb-2">
              Your Topic
            </p>
            <p className="text-lg font-semibold text-cerulean-light">
              {selectedTopic}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
