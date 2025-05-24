"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { summarizeThreat, type SummarizeThreatOutput } from "@/ai/flows/summarize-threat";
import { useState, useEffect } from "react";
import { Loader2, Wand2, FileText } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

const formSchema = z.object({
  threatDetails: z.string().min(50, {
    message: "Threat details must be at least 50 characters.",
  }).max(5000, { message: "Threat details must not exceed 5000 characters."}),
});

interface AiSummaryFormProps {
  initialThreatDetails?: string;
  threatTitle?: string;
}

export function AiSummaryForm({ initialThreatDetails = "", threatTitle }: AiSummaryFormProps) {
  const { toast } = useToast();
  const [summary, setSummary] = useState<SummarizeThreatOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      threatDetails: initialThreatDetails,
    },
  });
  
  useEffect(() => {
    if (initialThreatDetails) {
      form.setValue("threatDetails", initialThreatDetails);
    }
  }, [initialThreatDetails, form]);


  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setSummary(null);
    try {
      const result = await summarizeThreat({ threatDetails: values.threatDetails });
      setSummary(result);
      toast({
        title: "Summary Generated",
        description: "AI has successfully summarized the threat details.",
      });
    } catch (error) {
      console.error("Error generating summary:", error);
      toast({
        title: "Error Generating Summary",
        description: "An error occurred while aAI was summarizing. Please try again.",
        variant: "destructive",
      });
    }
    setIsLoading(false);
  }

  return (
    <div className="space-y-6">
      {threatTitle && <h2 className="text-2xl font-semibold">AI Summary for: <span className="text-primary">{threatTitle}</span></h2>}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="threatDetails"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-lg">Threat Details</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Paste or describe the full cybersecurity threat details here..."
                    className="min-h-[200px] resize-y text-base"
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  Provide comprehensive details for the AI to generate an accurate summary. (Min 50, Max 5000 characters)
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" disabled={isLoading} size="lg">
            {isLoading ? (
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            ) : (
              <Wand2 className="mr-2 h-5 w-5" />
            )}
            Generate Summary
          </Button>
        </form>
      </Form>

      {summary && (
        <Card className="mt-8 shadow-lg border-primary/30">
          <CardHeader>
            <CardTitle className="flex items-center text-xl text-primary">
              <FileText className="mr-2 h-6 w-6" /> AI Generated Summary
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="whitespace-pre-wrap text-base leading-relaxed">{summary.summary}</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
