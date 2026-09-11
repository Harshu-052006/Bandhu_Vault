// Server Component — no "use client", renders to static HTML immediately
import { Anton } from "next/font/google";
import Link from "next/link";
import { Shield, Zap } from "lucide-react";
import { cn } from "@/lib/utils";
import { CursorGlow } from "./cursor-glow";

const anton = Anton({
  weight: "400",
  subsets: ["latin"],
  display: "swap",
});

export default function CinematicLanding() {
  return (
    <div className="relative min-h-screen w-full bg-[#0f172a] text-slate-50 overflow-hidden font-sans">
      {/* Client-only cursor glow — does not block SSR paint */}
      <CursorGlow />

      {/* Hero Section */}
      <section className="relative z-10 flex min-h-[100dvh] w-full flex-col items-center justify-center px-4">
        {/* Subtle background texture/grid */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))] opacity-30" />

        <div className="container mx-auto flex flex-col items-center text-center">
          <div className="flex flex-col items-center gap-4">

            {/* Badge — static, no animation wrapper */}
            <div className="flex items-center gap-2 rounded-full border border-cyan-500/30 bg-cyan-500/10 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.2em] text-cyan-300 backdrop-blur-md mb-2">
              <Zap className="h-4 w-4" />
              <span>Bandhu Vault Protocol</span>
            </div>

            {/* LCP Element — static h1, ships in SSR HTML */}
            <h1
              className={cn(
                "text-[5rem] sm:text-[7rem] md:text-[9rem] lg:text-[11rem] uppercase tracking-wide text-transparent bg-clip-text bg-gradient-to-b from-slate-50 to-slate-400 drop-shadow-[0_0_40px_rgba(255,255,255,0.1)] leading-[0.85] py-4",
                anton.className
              )}
            >
              SECURE.<br />
              <span className="bg-gradient-to-r from-cyan-400 via-indigo-500 to-violet-500 bg-clip-text text-transparent">
                TOGETHER.
              </span>
            </h1>

            {/* Sub-headline — static, ships in SSR HTML */}
            <p className="mt-6 max-w-2xl text-base md:text-lg font-light text-slate-300 leading-relaxed tracking-wide">
              An installable, blazingly fast platform for your team to share project updates, stream videos, and manage files securely with generous free storage limits.
            </p>

            {/* CTA button */}
            <div className="mt-12">
              <div className="relative group">
                <div className="absolute -inset-1 rounded-sm bg-gradient-to-r from-cyan-500 via-indigo-500 to-violet-500 opacity-60 blur-lg transition duration-500 group-hover:opacity-100 group-hover:blur-xl animate-pulse" />
                <Link
                  href="/sign-up"
                  className={cn(
                    "relative flex items-center justify-center gap-3 bg-slate-950 px-12 py-5 text-2xl tracking-[0.15em] text-white transition-all hover:bg-slate-900 border border-white/20 uppercase",
                    anton.className
                  )}
                  style={{ clipPath: "polygon(15px 0, 100% 0, 100% calc(100% - 15px), calc(100% - 15px) 100%, 0 100%, 0 15px)" }}
                >
                  <Shield className="h-6 w-6 text-cyan-300" />
                  INITIALIZE VAULT
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll indicator — CSS animation only, no JS */}
        <div
          className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4 opacity-0"
          style={{ animation: "fadeIn 1s ease 1.5s forwards" }}
        >
          <span className="text-[10px] uppercase tracking-[0.4em] text-slate-400 font-bold">Scroll to Explore</span>
          <div className="h-16 w-[1px] bg-gradient-to-b from-slate-400 to-transparent" />
        </div>
      </section>

      {/* Placeholder for upcoming GSAP ScrollTrigger sections */}
      <section className="min-h-[100dvh] bg-slate-950 flex flex-col items-center justify-center px-4">
        <h2 className={cn("text-6xl text-slate-800 uppercase text-center", anton.className)}>
          NEXT SECTION <br /> (GSAP SCROLLTRIGGER)
        </h2>
      </section>
    </div>
  );
}
