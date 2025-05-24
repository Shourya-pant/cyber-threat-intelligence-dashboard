import { Header } from '@/components/layout/header';
import { HeroSection } from '@/components/landing/hero-section';
import { FeatureCard } from '@/components/landing/feature-card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ShieldAlert, BarChartBig, BrainCircuit, BellRing, Search, Users } from 'lucide-react';
import { APP_NAME } from '@/lib/constants';

export default function LandingPage() {
  const features = [
    {
      icon: ShieldAlert,
      title: "Real-time Threat Feed",
      description: "Access up-to-the-minute cybersecurity threat updates. Stay informed about the latest vulnerabilities, malware, and attack vectors.",
      linkHref: "/dashboard/threat-feed",
      linkLabel: "Explore Threat Feed",
      imageUrl: "https://placehold.co/600x400.png",
      dataAiHint: "cybersecurity feed"
    },
    {
      icon: BarChartBig,
      title: "Advanced Analytics",
      description: "Visualize threat landscapes with interactive charts. Understand common threats, severity distributions, and evolving trends.",
      linkHref: "/dashboard/analytics",
      linkLabel: "View Analytics Dashboard",
      imageUrl: "https://placehold.co/600x400.png",
      dataAiHint: "data analytics"
    },
    {
      icon: BrainCircuit,
      title: "AI Threat Summary",
      description: "Leverage AI to get concise summaries of complex security vulnerabilities. Understand threats at a glance and act faster.",
      linkHref: "/dashboard/ai-summary",
      linkLabel: "Use AI Summary Tool",
      imageUrl: "https://placehold.co/600x400.png",
      dataAiHint: "artificial intelligence"
    },
    {
      icon: BellRing,
      title: "Custom Alerts",
      description: "Set up personalized alerts for specific risk levels, threat categories, or keywords. Get notified about what matters most to you.",
      linkHref: "/dashboard/alerts",
      linkLabel: "Configure Alerts",
      imageUrl: "https://placehold.co/600x400.png",
      dataAiHint: "notification bell"
    },
    {
      icon: Search,
      title: "Powerful Search & Filter",
      description: "Easily find relevant threats using keyword search and category filters. Pinpoint specific information quickly and efficiently.",
      linkHref: "/dashboard/threat-feed", // Search is part of threat feed
      linkLabel: "Try Search & Filter",
      imageUrl: "https://placehold.co/600x400.png",
      dataAiHint: "search interface"
    },
    {
      icon: Users,
      title: "User Personalization",
      description: "Customize your CyberWatch experience. Manage your profile, settings, and preferences for a tailored view of cyber intelligence.",
      linkHref: "/dashboard/settings",
      linkLabel: "Personalize Settings",
      imageUrl: "https://placehold.co/600x400.png",
      dataAiHint: "user settings"
    }
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1">
        <HeroSection />

        <section id="features" className="py-16 md:py-24 bg-background">
          <div className="container mx-auto px-4 md:px-6">
            <h2 className="text-3xl font-bold tracking-tight text-center sm:text-4xl md:text-5xl mb-4">
              Core Features of <span className="text-primary">{APP_NAME}</span>
            </h2>
            <p className="text-center text-muted-foreground max-w-2xl mx-auto mb-12 md:text-lg">
              Empowering you with comprehensive tools to navigate the complex world of cybersecurity.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {features.map((feature) => (
                <FeatureCard key={feature.title} {...feature} />
              ))}
            </div>
          </div>
        </section>

        <section className="py-16 md:py-24 bg-secondary/20">
          <div className="container mx-auto px-4 md:px-6 text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl mb-6">
              Ready to Secure Your Digital World?
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto mb-8 md:text-lg">
              Join {APP_NAME} today and gain the upper hand against cyber threats.
            </p>
            <Link href="/signup">
              <Button size="lg" className="bg-gradient-to-r from-primary to-red-500 hover:from-primary/90 hover:to-red-500/90 text-primary-foreground shadow-lg transform hover:scale-105 transition-all duration-300">
                Sign Up Now
              </Button>
            </Link>
          </div>
        </section>
      </main>
      <footer className="py-8 border-t border-border/40">
        <div className="container mx-auto px-4 md:px-6 text-center text-muted-foreground text-sm">
          © {new Date().getFullYear()} {APP_NAME}. All rights reserved. Secure your future.
        </div>
      </footer>
    </div>
  );
}
