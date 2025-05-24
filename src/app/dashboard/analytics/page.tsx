"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CommonThreatsChart } from '@/components/analytics/common-threats-chart';
import { SeverityPieChart } from '@/components/analytics/severity-pie-chart';
import { TrendsLineChart } from '@/components/analytics/trends-line-chart';
import { mockThreats, commonThreatsData, severityDistributionData, threatTrendsData } from '@/lib/mock-data';
import type { ChartData, TimeSeriesData, Threat } from '@/types';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { THREAT_CATEGORIES, SEVERITY_LEVELS } from '@/lib/constants';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function AnalyticsPage() {
  const [isLoading, setIsLoading] = useState(true);
  // These states could be used to fetch/filter data dynamically if connected to a backend
  // For now, using mock data directly.
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [selectedSeverity, setSelectedSeverity] = useState<string>("All");

  useEffect(() => {
    // Simulate data loading
    setTimeout(() => setIsLoading(false), 500);
  }, []);
  
  // Placeholder for filtering logic if needed in future
  // const filteredCommonThreatsData = commonThreatsData; 
  // const filteredSeverityDistributionData = severityDistributionData;
  // const filteredThreatTrendsData = threatTrendsData;

  if (isLoading) {
    return (
      <div className="flex h-[calc(100vh-10rem)] items-center justify-center">
        <Loader2 className="h-16 w-16 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-8 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Threat Analytics</h1>
          <p className="text-muted-foreground">Visualize cybersecurity trends and insights.</p>
        </div>
        <div className="flex gap-2">
          {/* Filters can be added here if needed */}
          {/* <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All Categories</SelectItem>
              {THREAT_CATEGORIES.map(cat => <SelectItem key={cat} value={cat}>{cat}</SelectItem>)}
            </SelectContent>
          </Select>
          <Select value={selectedSeverity} onValueChange={setSelectedSeverity}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="All Severities" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All Severities</SelectItem>
              {SEVERITY_LEVELS.map(sev => <SelectItem key={sev} value={sev}>{sev}</SelectItem>)}
            </SelectContent>
          </Select> */}
           <Link href="/dashboard/reports/new"> {/* Placeholder for reporting functionality */}
            <Button variant="outline">Generate Report</Button>
          </Link>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2">
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Common Threat Types</CardTitle>
            <CardDescription>Distribution of frequently observed threat categories.</CardDescription>
          </CardHeader>
          <CardContent>
            <CommonThreatsChart data={commonThreatsData} />
          </CardContent>
        </Card>
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Threat Severity Distribution</CardTitle>
            <CardDescription>Breakdown of threats by their severity levels.</CardDescription>
          </CardHeader>
          <CardContent>
            <SeverityPieChart data={severityDistributionData} />
          </CardContent>
        </Card>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Threat Trends Over Time</CardTitle>
          <CardDescription>Monthly evolution of reported threats over the past year.</CardDescription>
        </CardHeader>
        <CardContent>
          <TrendsLineChart data={threatTrendsData} />
        </CardContent>
      </Card>
    </div>
  );
}
