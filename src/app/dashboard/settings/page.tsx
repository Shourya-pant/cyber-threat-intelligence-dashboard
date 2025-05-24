"use client";

import { useState, useEffect } from 'react';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from '@/contexts/auth-context';
import { Loader2, Save, UploadCloud } from 'lucide-react';
import type { UserProfile } from '@/types'; // Assuming UserProfile is defined
import { mockUserProfile } from '@/lib/mock-data'; // Using mock data

const profileFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters."),
  email: z.string().email("Invalid email address."),
  // avatarUrl: z.string().url("Invalid URL for avatar.").optional(), // For file upload, this is different
});

const notificationsFormSchema = z.object({
  emailNotifications: z.boolean().default(true),
  inAppNotifications: z.boolean().default(true),
});

export default function SettingsPage() {
  const { user, loading: authLoading, login: updateUserAuthContext } = useAuth(); // Assuming login can also update user
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);

  useEffect(() => {
    if (user) {
      setUserProfile({
        ...mockUserProfile, // Start with mock, then overlay auth user info
        name: user.name,
        email: user.email,
        avatarUrl: user.avatarUrl || mockUserProfile.avatarUrl,
      });
    }
  }, [user]);

  const profileForm = useForm<z.infer<typeof profileFormSchema>>({
    resolver: zodResolver(profileFormSchema),
    values: { // Use values instead of defaultValues to update when userProfile changes
      name: userProfile?.name || "",
      email: userProfile?.email || "",
    }
  });
  
  useEffect(() => { // Keep form in sync with userProfile state
    if (userProfile) {
      profileForm.reset({
        name: userProfile.name,
        email: userProfile.email,
      });
    }
  }, [userProfile, profileForm]);


  const notificationsForm = useForm<z.infer<typeof notificationsFormSchema>>({
    resolver: zodResolver(notificationsFormSchema),
    defaultValues: {
      emailNotifications: userProfile?.preferences?.notifications?.email ?? true,
      inAppNotifications: userProfile?.preferences?.notifications?.inApp ?? true,
    }
  });

  async function onProfileSubmit(values: z.infer<typeof profileFormSchema>) {
    setIsLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setUserProfile(prev => prev ? { ...prev, ...values } : null);
    // If your auth context's login also updates user details:
    if(user && values.email !== user.email) { // Check if email is changed to avoid unnecessary re-login
        updateUserAuthContext(values.email); // This might re-trigger useEffects
    } else if(user && values.name !== user.name) {
        // Mock updating username in local storage if it's part of auth context logic
        const storedAuth = localStorage.getItem('cyberwatch_auth');
        if(storedAuth) {
            const authData = JSON.parse(storedAuth);
            authData.user.name = values.name;
            localStorage.setItem('cyberwatch_auth', JSON.stringify(authData));
             // Manually trigger a state update if useAuth doesn't re-render on localStorage change
            updateUserAuthContext(user.email); // Re-call to refresh context if needed
        }
    }
    toast({ title: "Profile Updated", description: "Your profile information has been saved." });
    setIsLoading(false);
  }

  async function onNotificationsSubmit(values: z.infer<typeof notificationsFormSchema>) {
    setIsLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setUserProfile(prev => prev ? {
       ...prev, 
       preferences: { 
         ...prev.preferences, 
         notifications: {
           email: values.emailNotifications,
           inApp: values.inAppNotifications,
         }
       } 
      } : null);
    toast({ title: "Notification Settings Updated", description: "Your notification preferences have been saved." });
    setIsLoading(false);
  }
  
  if (authLoading || !userProfile) {
    return (
      <div className="flex h-[calc(100vh-10rem)] items-center justify-center">
        <Loader2 className="h-16 w-16 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-8 py-8">
      <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
      
      <Card>
        <CardHeader>
          <CardTitle>Profile Information</CardTitle>
          <CardDescription>Manage your personal details and avatar.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center space-x-4">
            <Avatar className="h-20 w-20">
              <AvatarImage src={userProfile.avatarUrl || `https://avatar.vercel.sh/${userProfile.email}.png`} alt={userProfile.name} />
              <AvatarFallback>{userProfile.name.charAt(0).toUpperCase()}</AvatarFallback>
            </Avatar>
            <Button variant="outline" size="sm" className="relative">
              <UploadCloud className="mr-2 h-4 w-4" /> Change Avatar
              <Input type="file" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" disabled/>
            </Button>
             <p className="text-xs text-muted-foreground">File upload is disabled in this demo.</p>
          </div>
          <Form {...profileForm}>
            <form onSubmit={profileForm.handleSubmit(onProfileSubmit)} className="space-y-4">
              <FormField
                control={profileForm.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl><Input placeholder="Your Name" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={profileForm.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email Address</FormLabel>
                    <FormControl><Input type="email" placeholder="your@email.com" {...field} /></FormControl>
                     <FormDescription>Changing email will require re-verification (mock).</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={isLoading}>
                {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                Save Profile
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Notification Settings</CardTitle>
          <CardDescription>Choose how you receive alerts and updates.</CardDescription>
        </CardHeader>
        <CardContent>
           <Form {...notificationsForm}>
            <form onSubmit={notificationsForm.handleSubmit(onNotificationsSubmit)} className="space-y-4">
               <FormField
                control={notificationsForm.control}
                name="emailNotifications"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                    <div className="space-y-0.5">
                      <FormLabel>Email Notifications</FormLabel>
                      <FormDescription>Receive important alerts via email.</FormDescription>
                    </div>
                    <FormControl><Switch checked={field.value} onCheckedChange={field.onChange} /></FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={notificationsForm.control}
                name="inAppNotifications"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                    <div className="space-y-0.5">
                      <FormLabel>In-App Notifications</FormLabel>
                      <FormDescription>Show notifications directly within CyberWatch.</FormDescription>
                    </div>
                    <FormControl><Switch checked={field.value} onCheckedChange={field.onChange} /></FormControl>
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={isLoading}>
                 {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                Save Notifications
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Account Actions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
            <Link href="/dashboard/change-password"> {/* Placeholder page */}
                <Button variant="outline">Change Password</Button>
            </Link>
            <Button variant="destructive" disabled>Delete Account (Coming Soon)</Button>
        </CardContent>
      </Card>
    </div>
  );
}
