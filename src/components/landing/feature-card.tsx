import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import type { LucideIcon } from 'lucide-react';
import { ArrowRight } from 'lucide-react';

interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  linkHref: string;
  linkLabel: string;
  dataAiHint?: string;
  imageUrl?: string;
}

export function FeatureCard({ icon: Icon, title, description, linkHref, linkLabel, dataAiHint, imageUrl }: FeatureCardProps) {
  return (
    <Card className="flex flex-col overflow-hidden h-full hover:shadow-xl hover:border-primary/50 transition-all duration-300 transform hover:-translate-y-1">
      {imageUrl && (
        <div className="aspect-video overflow-hidden">
           <img 
            src={imageUrl} 
            alt={title} 
            data-ai-hint={dataAiHint} 
            className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105" 
          />
        </div>
      )}
      <CardHeader className="pb-4">
        <div className="flex items-center gap-3 mb-2">
          <Icon className="w-8 h-8 text-primary" />
          <CardTitle className="text-2xl">{title}</CardTitle>
        </div>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow flex flex-col justify-end">
        <Link href={linkHref} className="mt-auto">
          <Button variant="outline" className="w-full group">
            {linkLabel} <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
}
