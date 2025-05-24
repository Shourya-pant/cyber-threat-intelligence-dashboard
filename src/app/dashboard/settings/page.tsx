
"use client";

import { useState, useEffect, useRef } from 'react';
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
import type { UserProfile } from '@/types'; 
import { mockUserProfile } from '@/lib/mock-data'; 
import Link from 'next/link';

const profileFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters."),
  email: z.string().email("Invalid email address."),
});

const notificationsFormSchema = z.object({
  emailNotifications: z.boolean().default(true),
  inAppNotifications: z.boolean().default(true),
});

export default function SettingsPage() {
  const { user, loading: authLoading, login: updateUserAuthContext } = useAuth(); 
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (user) {
      // Attempt to load from localStorage first, then fallback to mock/auth user
      const storedProfile = localStorage.getItem(`userProfile_${user.email}`);
      if (storedProfile) {
        setUserProfile(JSON.parse(storedProfile));
      } else {
        setUserProfile({
          ...mockUserProfile, 
          name: user.name,
          email: user.email,
          avatarUrl: user.avatarUrl || mockUserProfile.avatarUrl,
        });
      }
    }
  }, [user]);

  const profileForm = useForm<z.infer<typeof profileFormSchema>>({
    resolver: zodResolver(profileFormSchema),
    values: { 
      name: userProfile?.name || "",
      email: userProfile?.email || "",
    }
  });
  
  useEffect(() => { 
    if (userProfile) {
      profileForm.reset({
        name: userProfile.name,
        email: userProfile.email,
      });
      // Save to localStorage whenever userProfile changes
      if(userProfile.email){
        localStorage.setItem(`userProfile_${userProfile.email}`, JSON.stringify(userProfile));
      }
    }
  }, [userProfile, profileForm]);


  const notificationsForm = useForm<z.infer<typeof notificationsFormSchema>>({
    resolver: zodResolver(notificationsFormSchema),
    values: { // Use values to react to userProfile changes
      emailNotifications: userProfile?.preferences?.notifications?.email ?? true,
      inAppNotifications: userProfile?.preferences?.notifications?.inApp ?? true,
    }
  });

  useEffect(() => {
    if (userProfile) {
        notificationsForm.reset({
            emailNotifications: userProfile?.preferences?.notifications?.email ?? true,
            inAppNotifications: userProfile?.preferences?.notifications?.inApp ?? true,
        });
    }
  }, [userProfile, notificationsForm]);


  async function onProfileSubmit(values: z.infer<typeof profileFormSchema>) {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setUserProfile(prev => {
      if (!prev) return null;
      const updatedProfile = { ...prev, ...values };
      // Also update mock user in AuthContext if email changed to reflect everywhere else
      // Note: this "login" is just to refresh context with potentially new email/name for display
      if (user && (values.email !== user.email || values.name !== user.name)) {
        const authUser = { ...user, name: values.name, email: values.email };
         // Simulate updating the auth context's user (name/email only)
        const storedAuth = localStorage.getItem('cyberwatch_auth');
        if (storedAuth) {
          const authData = JSON.parse(storedAuth);
          authData.user = authUser;
          localStorage.setItem('cyberwatch_auth', JSON.stringify(authData));
        }
        updateUserAuthContext(values.email); // This might re-trigger useEffects, using email as key
      }
      return updatedProfile;
    });
    toast({ title: "Profile Updated", description: "Your profile information has been saved." });
    setIsLoading(false);
  }

  async function onNotificationsSubmit(values: z.infer<typeof notificationsFormSchema>) {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setUserProfile(prev => prev ? {
       ...prev, 
       preferences: { 
         ...(prev.preferences || {}), 
         notifications: {
           email: values.emailNotifications,
           inApp: values.inAppNotifications,
         }
       } 
      } : null);
    toast({ title: "Notification Settings Updated", description: "Your notification preferences have been saved." });
    setIsLoading(false);
  }

  const handleAvatarUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUserProfile(prev => {
          if (!prev) return null;
          const updatedProfile = { ...prev, avatarUrl: reader.result as string };
           if (user && prev.email === user.email) { // Also update avatar in localStorage for the main auth user
            const storedAuth = localStorage.getItem('cyberwatch_auth');
            if (storedAuth) {
                const authData = JSON.parse(storedAuth);
                authData.user.avatarUrl = reader.result as string;
                localStorage.setItem('cyberwatch_auth', JSON.stringify(authData));
            }
          }
          return updatedProfile;
        });
        toast({ title: "Avatar Updated", description: "Your new avatar has been set." });
      };
      reader.readAsDataURL(file);
    }
  };
  
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
            <Input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleFileChange} 
              className="hidden" 
              accept="image/*" 
            />
            <Button variant="outline" size="icon" aria-label="Upload New Avatar" onClick={handleAvatarUploadClick}>
              <UploadCloud className="h-4 w-4" />
            </Button>
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
            <Link href="/dashboard/change-password"> 
                <Button variant="outline">Change Password</Button>
            </Link>
            <Button variant="destructive" disabled>Delete Account (Coming Soon)</Button>
        </CardContent>
      </Card>
    </div>
  );
}
