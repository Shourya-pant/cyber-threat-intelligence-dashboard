"use client";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ShieldCheck, ArrowRight } from "lucide-react";

export function HeroSection() {
  return (
    <section className="w-full py-20 md:py-32 lg:py-40 bg-gradient-to-br from-background to-secondary/20 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        {/* Subtle animated background elements */}
        <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-primary/10 rounded-full animate-pulse delay-500"></div>
        <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-accent/5 rounded-full animate-pulse delay-1000"></div>
        {/* Animated lines - placeholder, requires more complex SVG/JS animation */}
         <svg className="absolute inset-0 w-full h-full opacity-10" 
           style={{
             transform: 'scale(1.5)',
             maskImage: 'radial-gradient(circle at center, white 20%, transparent 70%)'
           }}>
          {[...Array(20)].map((_, i) => (
            <line
              key={i}
              x1={`${Math.random() * 100}%`}
              y1={`${Math.random() * 100}%`}
              x2={`${Math.random() * 100}%`}
              y2={`${Math.random() * 100}%`}
              stroke="hsl(var(--primary) / 0.2)"
              strokeWidth="1"
              className="animate-draw-line"
              style={{ animationDelay: `${i * 0.2}s` }}
            />
          ))}
        </svg>
        <style jsx>{`
          @keyframes draw-line {
            0% { stroke-dasharray: 0, 1000; opacity: 0; }
            50% { stroke-dasharray: 500, 500; opacity: 0.5; }
            100% { stroke-dasharray: 1000, 0; opacity: 0; }
          }
          .animate-draw-line {
            stroke-dasharray: 1000;
            stroke-dashoffset: 1000;
            animation: draw-line 10s linear infinite;
          }
        `}</style>
      </div>
      <div className="container mx-auto px-4 md:px-6 text-center relative z-10">
        <ShieldCheck className="mx-auto h-16 w-16 text-primary mb-6 animate-bounce" />
        <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl text-transparent bg-clip-text bg-gradient-to-r from-primary via-red-400 to-accent cyber-glow">
          CyberWatch
        </h1>
        <p className="mt-6 max-w-xl mx-auto text-lg text-muted-foreground md:text-xl">
          Stay Ahead of Threats. Real-time intelligence, advanced analytics, and AI-powered insights for ultimate cybersecurity.
        </p>
        <div className="mt-10 flex flex-col sm:flex-row justify-center gap-4">
          <Link href="/dashboard">
            <Button size="lg" className="group">
              Get Started <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
          <Link href="/#features">
            <Button size="lg" variant="outline">
              Learn More
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
