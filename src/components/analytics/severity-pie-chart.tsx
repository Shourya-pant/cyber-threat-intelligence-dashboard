"use client"

import * as React from "react"
import { Pie, PieChart, ResponsiveContainer, Cell, Tooltip, Legend } from "recharts"
import { ChartConfig, ChartContainer, ChartLegendContent, ChartTooltipContent } from "@/components/ui/chart"
import type { ChartData } from "@/types";
import { SEVERITY_LEVELS } from "@/lib/constants";

const severityColors: Record<typeof SEVERITY_LEVELS[number], string> = {
  Low: "hsl(var(--chart-2))", // Greenish
  Medium: "hsl(var(--chart-4))", // Yellowish
  High: "hsl(var(--chart-5))", // Orangish/Purple
  Critical: "hsl(var(--chart-1))", // Red
};

interface SeverityPieChartProps {
  data: ChartData[];
}

export function SeverityPieChart({ data }: SeverityPieChartProps) {
   if (!data || data.length === 0) {
    return <p className="text-muted-foreground text-center py-8">No data available for severity distribution.</p>;
  }

  const chartConfig = Object.fromEntries(
    data.map(item => [item.name.toLowerCase(), { label: item.name, color: severityColors[item.name as typeof SEVERITY_LEVELS[number]] }])
  ) satisfies ChartConfig;
  
  return (
    <ChartContainer
      config={chartConfig}
      className="mx-auto aspect-square min-h-[300px] max-h-[400px]"
    >
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Tooltip
            cursor={false}
            content={<ChartTooltipContent hideLabel />}
          />
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            innerRadius="40%"
            strokeWidth={3}
            labelLine={false}
            label={({ percent, name }) => `${name}: ${(percent * 100).toFixed(0)}%`}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={severityColors[entry.name as typeof SEVERITY_LEVELS[number]]} />
            ))}
          </Pie>
           <ChartLegendContent nameKey="name" className="text-xs" />
        </PieChart>
      </ResponsiveContainer>
    </ChartContainer>
  )
}
