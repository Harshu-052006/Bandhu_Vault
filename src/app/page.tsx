import Link from "next/link";
import { ArrowRight, Layers, Shield, Zap, HardDrive } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-50 selection:bg-indigo-500/30 font-sans flex flex-col">
      {/* Navbar */}
      <header className="sticky top-0 z-50 w-full border-b border-neutral-800 bg-neutral-950/80 backdrop-blur-xl">
        <div className="container mx-auto flex h-16 items-center justify-between px-6">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-500 shadow-lg shadow-indigo-500/20">
              <Layers className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold tracking-tight bg-gradient-to-br from-white to-neutral-400 bg-clip-text text-transparent">
              Bandhu Vault
            </span>
          </div>
          <div className="flex items-center gap-4">
            <Link
              href="/sign-in"
              className="text-sm font-medium text-neutral-300 hover:text-white transition-colors"
            >
              Sign In
            </Link>
            <Link
              href="/sign-up"
              className="inline-flex h-9 items-center justify-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-indigo-700 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-indigo-500 disabled:pointer-events-none disabled:opacity-50"
            >
              Get Started
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 flex flex-col">
        <section className="flex-1 flex flex-col items-center justify-center text-center px-4 py-20 lg:py-32 relative overflow-hidden">
          {/* Background Glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] bg-indigo-500/10 blur-[120px] rounded-full pointer-events-none" />
          
          <div className="relative z-10 max-w-3xl mx-auto space-y-8">
            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight">
              Your Team's Secure <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">
                Media & Updates Vault
              </span>
            </h1>
            <p className="text-lg md:text-xl text-neutral-400 max-w-2xl mx-auto leading-relaxed">
              An installable, blazingly fast platform for your team to share project updates, stream videos, and manage files securely with generous free storage limits.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <Link
                href="/sign-up"
                className="inline-flex h-12 items-center justify-center rounded-lg bg-indigo-600 px-8 text-base font-medium text-white shadow-lg shadow-indigo-600/20 transition-all hover:bg-indigo-700 hover:scale-105 active:scale-95"
              >
                Create your Vault
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 bg-neutral-900/50 border-t border-neutral-800">
          <div className="container mx-auto px-6">
            <div className="grid md:grid-cols-3 gap-8">
              <div className="p-6 rounded-2xl bg-neutral-900 border border-neutral-800 flex flex-col gap-4">
                <div className="h-12 w-12 rounded-lg bg-indigo-500/10 flex items-center justify-center text-indigo-400">
                  <Zap className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold">Direct Cloud Uploads</h3>
                <p className="text-neutral-400 leading-relaxed">
                  Bypass server limits. Upload massive media files directly from your device to our global storage network using presigned URLs.
                </p>
              </div>
              <div className="p-6 rounded-2xl bg-neutral-900 border border-neutral-800 flex flex-col gap-4">
                <div className="h-12 w-12 rounded-lg bg-cyan-500/10 flex items-center justify-center text-cyan-400">
                  <HardDrive className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold">10GB Generous Storage</h3>
                <p className="text-neutral-400 leading-relaxed">
                  Store up to 10GB of project assets entirely free, with unlimited bandwidth and no egress fees for viewing and streaming.
                </p>
              </div>
              <div className="p-6 rounded-2xl bg-neutral-900 border border-neutral-800 flex flex-col gap-4">
                <div className="h-12 w-12 rounded-lg bg-violet-500/10 flex items-center justify-center text-violet-400">
                  <Shield className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold">Progressive Web App</h3>
                <p className="text-neutral-400 leading-relaxed">
                  Install Bandhu Vault on your Desktop or Mobile device for a native, app-like experience with offline caching capabilities.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="py-8 border-t border-neutral-800 text-center text-neutral-500 text-sm">
        <p>&copy; {new Date().getFullYear()} Bandhu Organization. All rights reserved.</p>
      </footer>
    </div>
  );
}
