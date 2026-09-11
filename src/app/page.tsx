"use client";

import Link from "next/link";
import { ArrowRight, Layers, Shield, Zap, HardDrive, Play, FileText, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";
export default function LandingPage() {
  return (
    <div className="min-h-screen bg-transparent text-foreground selection:bg-primary/10 font-sans flex flex-col relative" suppressHydrationWarning>
      {/* Navbar */}
      <header className="sticky top-0 z-50 w-full border-b border-border bg-background/80 backdrop-blur-xl" suppressHydrationWarning>
        <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6" suppressHydrationWarning>
          <div className="flex items-center gap-2" suppressHydrationWarning>
            <div className="flex h-8 w-8 sm:h-10 sm:w-10 shrink-0 items-center justify-center" suppressHydrationWarning>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/logo.png" alt="Bandhu Vault Logo" className="h-full w-full object-contain drop-shadow-sm" />
            </div>
            <span className="text-lg sm:text-xl font-bold tracking-tight text-foreground whitespace-nowrap hidden min-[380px]:inline-block">
              Bandhu Vault
            </span>
          </div>
          <div className="flex items-center shrink-0" suppressHydrationWarning>
            <Link
              href="/sign-in"
              className="group relative flex items-center gap-3 overflow-hidden rounded-full bg-background/30 px-2 py-2 pr-4 border border-white/5 shadow-sm backdrop-blur-xl transition-all hover:bg-white/5 hover:border-white/20"
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 shadow-[0_0_15px_rgba(255,255,255,0.1)] transition-all group-hover:bg-primary/20 group-hover:shadow-[0_0_20px_rgba(var(--primary),0.3)]">
                <Shield className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors duration-300" />
              </div>
              <span className="text-sm font-semibold tracking-wide text-muted-foreground transition-colors group-hover:text-foreground">
                Access
              </span>
              <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-background/80 to-transparent pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity"></div>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 flex flex-col" suppressHydrationWarning>
        <section className="flex-1 flex flex-col items-center justify-center text-center px-4 py-20 lg:py-32 relative overflow-hidden">
          {/* Background Glow */}
          {/* Replaced by AnimatedGrid */}
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, staggerChildren: 0.1 }}
            className="relative z-10 max-w-4xl mx-auto space-y-10" 
            suppressHydrationWarning
          >
            <motion.h1 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, ease: "easeOut" }}
              className="text-6xl md:text-8xl font-black tracking-tighter leading-[1.1]"
            >
              The Unbreakable <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-br from-cyan-400 via-indigo-500 to-purple-600 drop-shadow-[0_0_30px_rgba(99,102,241,0.2)]">
                Digital Vault.
              </span>
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-lg md:text-2xl text-muted-foreground max-w-2xl mx-auto font-light leading-relaxed"
            >
              Beyond just storage. A blazingly fast, installable fortress for your team's media, updates, and most critical assets. 
            </motion.p>
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-8" 
              suppressHydrationWarning
            >
              <div className="relative group">
                {/* Glowing aura effect */}
                <div className="absolute -inset-2 bg-gradient-to-r from-cyan-500 via-indigo-500 to-purple-600 rounded-full blur-xl opacity-20 group-hover:opacity-60 transition-opacity duration-700 animate-pulse"></div>
                
                <Link
                  href="/sign-up"
                  className="relative flex items-center gap-6 rounded-full bg-background/80 border border-white/10 p-2 pr-8 backdrop-blur-2xl shadow-2xl transition-all duration-300 hover:scale-[1.02] hover:bg-white/5"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 shadow-[0_0_20px_rgba(99,102,241,0.4)] group-hover:rotate-180 transition-transform duration-700">
                    <Zap className="h-5 w-5 text-white fill-white/20" />
                  </div>
                  <div className="flex flex-col items-start">
                    <span className="text-xs font-mono text-indigo-400 uppercase tracking-widest font-semibold">
                      System Ready
                    </span>
                    <span className="text-base font-bold text-foreground">
                      Initialize Workspace
                    </span>
                  </div>
                  <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-white group-hover:translate-x-2 transition-all duration-300 ml-4" />
                </Link>
              </div>
            </motion.div>
          </motion.div>

          {/* Visual Proof / UI Mockup */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.4 }}
            className="relative z-10 mt-20 max-w-5xl mx-auto w-full px-4"
          >
            <div className="rounded-xl border border-border/50 bg-background/50 backdrop-blur-md shadow-2xl overflow-hidden ring-1 ring-white/10">
              {/* Browser Header */}
              <div className="h-12 border-b border-border/50 bg-muted/20 flex items-center px-4 gap-2">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
                </div>
                <div className="ml-4 flex-1 flex justify-center">
                  <div className="h-6 w-48 md:w-64 bg-muted/30 rounded-md flex items-center justify-center">
                    <span className="text-[10px] text-muted-foreground">vault.bandhu.org</span>
                  </div>
                </div>
              </div>
              {/* Browser Body Mockup */}
              <div className="p-4 md:p-8 flex flex-col md:flex-row gap-6 text-left">
                {/* Sidebar */}
                <div className="hidden md:flex w-48 flex-col gap-4">
                  <div className="h-8 bg-muted/40 rounded-md w-full flex items-center px-3 gap-2">
                    <Layers className="h-4 w-4 text-primary" />
                    <div className="h-2 w-16 bg-foreground/20 rounded-full"></div>
                  </div>
                  <div className="h-8 bg-muted/20 rounded-md w-5/6 flex items-center px-3 gap-2">
                    <Play className="h-4 w-4 text-muted-foreground" />
                    <div className="h-2 w-12 bg-muted-foreground/30 rounded-full"></div>
                  </div>
                  <div className="h-8 bg-muted/20 rounded-md w-4/6 flex items-center px-3 gap-2">
                    <FileText className="h-4 w-4 text-muted-foreground" />
                    <div className="h-2 w-10 bg-muted-foreground/30 rounded-full"></div>
                  </div>
                </div>
                {/* Main Content */}
                <div className="flex-1 flex flex-col gap-6">
                  <div className="flex items-center justify-between border-b border-border/50 pb-4">
                    <div className="h-6 bg-foreground/90 rounded-md w-1/3"></div>
                    <div className="h-8 w-24 bg-primary/20 rounded-md border border-primary/30 flex items-center justify-center">
                      <span className="text-xs text-primary font-medium">Upload</span>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="aspect-video bg-muted/30 rounded-lg border border-border/50 flex items-center justify-center relative overflow-hidden group">
                        <div className="absolute inset-0 bg-gradient-to-tr from-cyan-500/10 to-indigo-500/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        <Play className="h-8 w-8 text-muted-foreground/50 group-hover:text-primary transition-colors" />
                      </div>
                    ))}
                  </div>
                  <div className="h-32 bg-muted/20 rounded-lg border border-border/50 mt-2 flex items-center px-6 gap-4">
                     <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                       <CheckCircle2 className="h-6 w-6 text-primary" />
                     </div>
                     <div className="flex flex-col gap-2 w-full">
                       <div className="h-4 bg-foreground/80 rounded-full w-1/4"></div>
                       <div className="h-3 bg-muted-foreground/40 rounded-full w-3/4"></div>
                       <div className="h-3 bg-muted-foreground/40 rounded-full w-1/2"></div>
                     </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </section>

        {/* Features Section */}
        <section className="py-20 bg-muted/30 border-t border-border">
          <div className="container mx-auto px-6" suppressHydrationWarning>
            <div className="grid md:grid-cols-3 gap-8" suppressHydrationWarning>
              <motion.div 
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="p-6 rounded-2xl bg-surface border border-border flex flex-col gap-4 shadow-sm relative group overflow-hidden" 
                suppressHydrationWarning
              >
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="h-12 w-12 rounded-lg bg-muted flex items-center justify-center text-foreground group-hover:scale-110 group-hover:text-cyan-500 transition-all duration-300" suppressHydrationWarning>
                  <Zap className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold relative z-10">Direct Cloud Uploads</h3>
                <p className="text-muted-foreground leading-relaxed relative z-10">
                  Bypass server limits. Upload massive media files directly from your device to our global storage network using presigned URLs.
                </p>
              </motion.div>
              <motion.div 
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="p-6 rounded-2xl bg-surface border border-border flex flex-col gap-4 shadow-sm relative group overflow-hidden" 
                suppressHydrationWarning
              >
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="h-12 w-12 rounded-lg bg-muted flex items-center justify-center text-foreground group-hover:scale-110 group-hover:text-indigo-500 transition-all duration-300" suppressHydrationWarning>
                  <HardDrive className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold relative z-10">10GB Generous Storage</h3>
                <p className="text-muted-foreground leading-relaxed relative z-10">
                  Store up to 10GB of project assets entirely free, with unlimited bandwidth and no egress fees for viewing and streaming.
                </p>
              </motion.div>
              <motion.div 
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.6, delay: 0.5 }}
                className="p-6 rounded-2xl bg-surface border border-border flex flex-col gap-4 shadow-sm relative group overflow-hidden" 
                suppressHydrationWarning
              >
                <div className="absolute inset-0 bg-gradient-to-br from-violet-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="h-12 w-12 rounded-lg bg-muted flex items-center justify-center text-foreground group-hover:scale-110 group-hover:text-violet-500 transition-all duration-300" suppressHydrationWarning>
                  <Shield className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold relative z-10">Progressive Web App</h3>
                <p className="text-muted-foreground leading-relaxed relative z-10">
                  Install Bandhu Vault on your Desktop or Mobile device for a native, app-like experience with offline caching capabilities.
                </p>
              </motion.div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="py-8 border-t border-border text-center text-muted-foreground text-sm">
        <p>&copy; {new Date().getFullYear()} Bandhu Organization. All rights reserved.</p>
      </footer>
    </div>
  );
}
