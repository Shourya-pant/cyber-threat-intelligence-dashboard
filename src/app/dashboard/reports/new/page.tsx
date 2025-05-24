
"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { FileText, Construction } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function NewReportPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-10rem)] py-8">
      <Card className="w-full max-w-lg text-center shadow-xl">
        <CardHeader>
          <Construction className="mx-auto h-16 w-16 text-primary mb-4" />
          <CardTitle className="text-3xl font-bold">Report Generation</CardTitle>
          <CardDescription className="text-lg text-muted-foreground">
            This feature is currently under development.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <p>
            We're working hard to bring you comprehensive report generation capabilities. 
            Soon you'll be able to create detailed reports based on threat data and analytics.
          </p>
          <Image 
            src="https://placehold.co/400x250.png" 
            alt="Under construction" 
            width={400} 
            height={250} 
            className="rounded-md object-cover mx-auto my-4"
            data-ai-hint="construction blueprint"
          />
          <Link href="/dashboard/analytics">
            <Button variant="outline">Back to Analytics</Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
