"use client";
import * as React from "react";
import { Header } from "@/components/layout/header";
import { MainNav } from "@/components/layout/main-nav";
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarTrigger,
  SidebarInset,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarGroup,
  SidebarGroupLabel,
} from "@/components/ui/sidebar";
import { DASHBOARD_NAV_LINKS, APP_NAME } from "@/lib/constants";
import { Shield, LogOut, PanelLeft } from "lucide-react";
import { useAuth } from "@/contexts/auth-context";
import { Button } from "@/components/ui/button";
import { usePathname, useRouter } from "next/navigation"; // Corrected import
import Link from "next/link";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { logout, loading, isAuthenticated } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  React.useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/login');
    }
  }, [loading, isAuthenticated, router]);
  
  if (loading) {
     return (
        <div className="flex h-screen items-center justify-center bg-background">
          <div className="h-16 w-16 animate-spin rounded-full border-4 border-solid border-primary border-t-transparent"></div>
        </div>
      );
  }

  if (!isAuthenticated) {
    // This case should ideally be handled by the effect redirecting,
    // but as a fallback or for initial render before effect runs:
    return null; // Or a "redirecting to login" message
  }


  return (
    <SidebarProvider defaultOpen>
      <div className="flex min-h-screen w-full flex-col bg-muted/40">
        <Sidebar collapsible="icon" className="border-r border-sidebar-border">
          <SidebarHeader className="p-4">
            <Link href="/dashboard" className="flex items-center gap-2 font-semibold group-data-[collapsible=icon]:justify-center">
              <Shield className="h-7 w-7 text-primary transition-all group-data-[collapsible=icon]:h-8 group-data-[collapsible=icon]:w-8" />
              <span className="text-xl group-data-[collapsible=icon]:hidden">{APP_NAME}</span>
            </Link>
          </SidebarHeader>
          <SidebarContent className="p-2">
            <MainNav links={DASHBOARD_NAV_LINKS} />
          </SidebarContent>
          <SidebarFooter className="p-2 border-t border-sidebar-border">
             <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton onClick={logout} className="w-full justify-start" tooltip="Logout">
                    <LogOut />
                    <span>Logout</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
          </SidebarFooter>
        </Sidebar>
        <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-[calc(var(--sidebar-width-icon)_+_1rem)] group-data-[state=expanded]:sm:pl-[calc(var(--sidebar-width)_+_1rem)] transition-[padding-left] duration-200">
          <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
            <div className="md:hidden"> {/* Only show on mobile, as desktop sidebar is persistent */}
               <SidebarTrigger asChild>
                <Button size="icon" variant="outline">
                  <PanelLeft className="h-5 w-5" />
                  <span className="sr-only">Toggle Menu</span>
                </Button>
              </SidebarTrigger>
            </div>
            {/* Breadcrumbs or page title can go here */}
            <div className="ml-auto">
              {/* UserNav already included in Header, but can be placed here for dashboard-specific layout */}
            </div>
          </header>
          <main className="flex-1 p-4 sm:px-6 sm:py-0 md:gap-8 bg-background rounded-lg shadow-sm">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
