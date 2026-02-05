"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { GlassCard } from "@/components/glass/GlassCard";
import { RouletteWheel } from "@/components/toastmasters/RouletteWheel";
import { streamChat } from "@/lib/api";
import { motion, AnimatePresence } from "framer-motion";
import { MessageSquare, Send, Loader2, Dices } from "lucide-react";
import type { ChatMessage } from "@/types/chat";

export default function ToastmastersPage() {
  const [theme, setTheme] = useState("");
  const [numTopics, setNumTopics] = useState(10);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isStreaming, setIsStreaming] = useState(false);
  const [showWheel, setShowWheel] = useState(false);
  const [latestTopics, setLatestTopics] = useState<string[]>([]);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Parse numbered topics from assistant response
  const parseTopics = (text: string): string[] => {
    const lines = text.split("\n").filter((line) => line.trim());
    return lines
      .map((line) => line.replace(/^\d+[\.\)]\s*/, "").trim())
      .filter((line) => line.length > 0 && line.length < 200);
  };

  const handleGenerate = useCallback(async () => {
    if (!theme.trim() || isStreaming) return;

    const userMessage: ChatMessage = {
      role: "user",
      content: `Generate ${numTopics} Table Topics about: ${theme}`,
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsStreaming(true);
    setShowWheel(false);

    // Add placeholder assistant message
    const assistantMessage: ChatMessage = { role: "assistant", content: "" };
    setMessages((prev) => [...prev, assistantMessage]);

    let fullResponse = "";

    try {
      await streamChat(
        {
          theme: theme.trim(),
          num_topics: numTopics,
          history: messages.map((m) => ({ role: m.role, content: m.content })),
        },
        (token) => {
          fullResponse += token;
          setMessages((prev) => {
            const updated = [...prev];
            updated[updated.length - 1] = {
              role: "assistant",
              content: fullResponse,
            };
            return updated;
          });
        },
        () => {
          setIsStreaming(false);
          const parsed = parseTopics(fullResponse);
          if (parsed.length > 0) {
            setLatestTopics(parsed);
          }
        }
      );
    } catch {
      setMessages((prev) => {
        const updated = [...prev];
        updated[updated.length - 1] = {
          role: "assistant",
          content: "An error occurred. Please try again.",
        };
        return updated;
      });
      setIsStreaming(false);
    }

    setTheme("");
  }, [theme, numTopics, isStreaming, messages]);

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center gap-3 mb-2">
          <MessageSquare className="w-6 h-6 text-burgundy" />
          <h1 className="text-3xl font-bold text-foreground">
            Table Topics Generator
          </h1>
        </div>
        <p className="text-foreground-muted">
          Generate creative Toastmasters Table Topics questions using Claude AI.
          Table Topics is an impromptu speaking exercise where members respond to
          a question for 1-2 minutes without preparation.
        </p>
      </motion.div>

      {/* Controls */}
      <GlassCard className="flex flex-wrap gap-4 items-end">
        {/* Theme input */}
        <div className="flex flex-col gap-1.5 flex-1 min-w-[200px]">
          <label className="text-xs font-medium text-foreground-muted uppercase tracking-wider">
            Theme
          </label>
          <input
            type="text"
            value={theme}
            onChange={(e) => setTheme(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleGenerate()}
            placeholder="e.g. space exploration, childhood memories..."
            className="bg-white/[0.05] border border-white/[0.1] rounded-xl px-4 py-2.5 text-sm text-foreground placeholder:text-foreground-muted/50 focus:outline-none focus:border-cerulean/50 transition-colors"
          />
        </div>

        {/* Topic count */}
        <div className="flex flex-col gap-1.5 w-[120px]">
          <label className="text-xs font-medium text-foreground-muted uppercase tracking-wider">
            # Topics
          </label>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setNumTopics(Math.max(1, numTopics - 1))}
              className="w-9 h-10 flex items-center justify-center bg-white/[0.05] border border-white/[0.1] rounded-l-xl text-foreground hover:bg-white/[0.08] transition-colors"
            >
              -
            </button>
            <input
              type="number"
              value={numTopics}
              onChange={(e) =>
                setNumTopics(
                  Math.max(1, Math.min(20, Number(e.target.value) || 1))
                )
              }
              min={1}
              max={20}
              className="w-12 h-10 text-center bg-white/[0.05] border-y border-white/[0.1] text-sm text-foreground focus:outline-none"
            />
            <button
              onClick={() => setNumTopics(Math.min(20, numTopics + 1))}
              className="w-9 h-10 flex items-center justify-center bg-white/[0.05] border border-white/[0.1] rounded-r-xl text-foreground hover:bg-white/[0.08] transition-colors"
            >
              +
            </button>
          </div>
        </div>

        {/* Generate button */}
        <button
          onClick={handleGenerate}
          disabled={!theme.trim() || isStreaming}
          className="btn-burgundy flex items-center gap-2 whitespace-nowrap disabled:opacity-40"
        >
          {isStreaming ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Send className="w-4 h-4" />
          )}
          Generate
        </button>
      </GlassCard>

      {/* Chat messages */}
      {messages.length > 0 && (
        <GlassCard className="max-h-[500px] overflow-y-auto space-y-4">
          {messages.map((msg, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className={`rounded-xl p-4 text-sm whitespace-pre-wrap ${
                msg.role === "user"
                  ? "glass-subtle border-l-2 border-cerulean/40 ml-8"
                  : "glass-burgundy border-l-2 border-burgundy/40 mr-8"
              }`}
            >
              <p className="text-xs text-foreground-muted mb-1.5 uppercase tracking-wider">
                {msg.role === "user" ? "You" : "Claude"}
              </p>
              <p className="text-foreground leading-relaxed">
                {msg.content}
                {isStreaming && i === messages.length - 1 && msg.role === "assistant" && (
                  <span className="inline-block w-1.5 h-4 bg-cerulean-light ml-0.5 animate-pulse" />
                )}
              </p>
            </motion.div>
          ))}
          <div ref={chatEndRef} />
        </GlassCard>
      )}

      {/* Roulette wheel toggle */}
      {latestTopics.length > 0 && !isStreaming && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex justify-center"
        >
          <button
            onClick={() => setShowWheel(!showWheel)}
            className="btn-primary flex items-center gap-2"
          >
            <Dices className="w-4 h-4" />
            {showWheel ? "Hide Wheel" : "Pick Random Topic"}
          </button>
        </motion.div>
      )}

      {/* Roulette wheel */}
      <AnimatePresence>
        {showWheel && latestTopics.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <GlassCard className="flex flex-col items-center">
              <h2 className="text-lg font-semibold text-foreground mb-6">
                Spin for a Random Topic
              </h2>
              <RouletteWheel topics={latestTopics} />
            </GlassCard>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
