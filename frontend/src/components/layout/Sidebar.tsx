"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  Home,
  BarChart3,
  MessageSquare,
  Car,
  Sparkles,
  Gamepad2,
  Menu,
  X,
  Linkedin,
  Github,
} from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const navItems = [
  { href: "/", label: "Home", sub: null, icon: Home },
  { href: "/clustering", label: "Clustering", sub: null, icon: BarChart3 },
  { href: "/toastmasters", label: "Table Topics", sub: null, icon: MessageSquare },
  { href: "/sdxl-lora", label: "Stable Diffusion LoRA", sub: "Automotive Application", icon: Sparkles },
  { href: "/car-prices", label: "Car Price Distribution", sub: "R-Language Throwback", icon: Car },
  { href: "/pacman", label: "Pac-Man", sub: null, icon: Gamepad2 },
];

export function Sidebar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      {/* Mobile hamburger */}
      <button
        onClick={() => setMobileOpen(true)}
        className="fixed top-4 left-4 z-50 p-2 rounded-xl glass md:hidden"
        aria-label="Open navigation"
      >
        <Menu className="w-5 h-5 text-foreground" />
      </button>

      {/* Mobile overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-black/60 md:hidden"
            onClick={() => setMobileOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed top-0 left-0 h-screen w-[260px] z-50 glass-sidebar flex flex-col py-8 px-4 transition-transform duration-300",
          "md:translate-x-0",
          mobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        )}
      >
        {/* Mobile close */}
        <button
          onClick={() => setMobileOpen(false)}
          className="absolute top-4 right-4 p-1.5 rounded-lg hover:bg-white/5 md:hidden"
          aria-label="Close navigation"
        >
          <X className="w-4 h-4 text-foreground-muted" />
        </button>

        {/* Logo / Name */}
        <div className="px-3 mb-10">
          <h1 className="text-lg font-bold text-foreground tracking-tight">
            James Callahan
          </h1>
          <p className="text-xs text-foreground-muted mt-0.5">
            Generative AI Engineer
          </p>
        </div>

        {/* Nav links */}
        <nav className="flex-1 flex flex-col gap-1">
          {navItems.map(({ href, label, sub, icon: Icon }) => {
            const isActive =
              href === "/" ? pathname === "/" : pathname.startsWith(href);

            return (
              <Link
                key={href}
                href={href}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200",
                  isActive
                    ? "text-foreground bg-white/[0.06] border-l-2 border-burgundy shadow-glow-burgundy/20"
                    : "text-foreground-muted hover:text-foreground hover:bg-white/[0.03]"
                )}
              >
                <Icon className={cn("w-4 h-4 text-burgundy shrink-0")} />
                <span className="flex flex-col">
                  <span>{label}</span>
                  {sub && <span className="text-[9px] opacity-50 -mt-0.5">{sub}</span>}
                </span>
              </Link>
            );
          })}
        </nav>

        {/* Footer links */}
        <div className="px-3 pt-4 border-t border-white/[0.06] flex gap-4">
          <a
            href="https://www.linkedin.com/in/jamesacallahan"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-xs text-foreground-muted hover:text-cerulean transition-colors"
          >
            <Linkedin className="w-4 h-4 text-burgundy" />
            LinkedIn
          </a>
          <a
            href="https://github.com/jcallahan997"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-xs text-foreground-muted hover:text-cerulean transition-colors"
          >
            <Github className="w-4 h-4 text-burgundy" />
            GitHub
          </a>
        </div>
      </aside>
    </>
  );
}
