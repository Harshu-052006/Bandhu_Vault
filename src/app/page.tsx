import Link from "next/link";
import { ArrowRight, Layers, Shield, Zap, HardDrive } from "lucide-react";
import { AnimatedGrid } from "@/components/ui/animated-grid";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-transparent text-foreground selection:bg-primary/10 font-sans flex flex-col relative" suppressHydrationWarning>
      <AnimatedGrid />
      {/* Navbar */}
      <header className="sticky top-0 z-50 w-full border-b border-border bg-background/80 backdrop-blur-xl" suppressHydrationWarning>
        <div className="container mx-auto flex h-16 items-center justify-between px-6" suppressHydrationWarning>
          <div className="flex items-center gap-2" suppressHydrationWarning>
            <div className="flex h-10 w-10 items-center justify-center" suppressHydrationWarning>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/logo.png" alt="Bandhu Vault Logo" className="h-full w-full object-contain drop-shadow-sm" />
            </div>
            <span className="text-xl font-bold tracking-tight text-foreground">
              Bandhu Vault
            </span>
          </div>
          <div className="flex items-center gap-4" suppressHydrationWarning>
            <Link
              href="/sign-in"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Sign In
            </Link>
            <Link
              href="/sign-up"
              className="inline-flex h-9 items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-sm transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
            >
              Get Started
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 flex flex-col" suppressHydrationWarning>
        <section className="flex-1 flex flex-col items-center justify-center text-center px-4 py-20 lg:py-32 relative overflow-hidden">
          {/* Background Glow */}
          {/* Replaced by AnimatedGrid */}
          
          <div className="relative z-10 max-w-3xl mx-auto space-y-8" suppressHydrationWarning>
            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight">
              Your Team&apos;s Secure <br />
              <span className="text-foreground">
                Media & Updates Vault
              </span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              An installable, blazingly fast platform for your team to share project updates, stream videos, and manage files securely with generous free storage limits.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4" suppressHydrationWarning>
              <Link
                href="/sign-up"
                className="inline-flex h-12 items-center justify-center rounded-lg bg-primary px-8 text-base font-medium text-primary-foreground shadow-md transition-all hover:bg-primary/90 hover:-translate-y-[1px] active:scale-95"
              >
                Create your Vault
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 bg-muted/30 border-t border-border">
          <div className="container mx-auto px-6" suppressHydrationWarning>
            <div className="grid md:grid-cols-3 gap-8" suppressHydrationWarning>
              <div className="p-6 rounded-2xl bg-surface border border-border flex flex-col gap-4 shadow-sm" suppressHydrationWarning>
                <div className="h-12 w-12 rounded-lg bg-muted flex items-center justify-center text-foreground" suppressHydrationWarning>
                  <Zap className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold">Direct Cloud Uploads</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Bypass server limits. Upload massive media files directly from your device to our global storage network using presigned URLs.
                </p>
              </div>
              <div className="p-6 rounded-2xl bg-surface border border-border flex flex-col gap-4 shadow-sm" suppressHydrationWarning>
                <div className="h-12 w-12 rounded-lg bg-muted flex items-center justify-center text-foreground" suppressHydrationWarning>
                  <HardDrive className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold">10GB Generous Storage</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Store up to 10GB of project assets entirely free, with unlimited bandwidth and no egress fees for viewing and streaming.
                </p>
              </div>
              <div className="p-6 rounded-2xl bg-surface border border-border flex flex-col gap-4 shadow-sm" suppressHydrationWarning>
                <div className="h-12 w-12 rounded-lg bg-muted flex items-center justify-center text-foreground" suppressHydrationWarning>
                  <Shield className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold">Progressive Web App</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Install Bandhu Vault on your Desktop or Mobile device for a native, app-like experience with offline caching capabilities.
                </p>
              </div>
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
