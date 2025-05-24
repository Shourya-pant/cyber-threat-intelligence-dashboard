
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
  useSidebar, // Import useSidebar
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";
import { DASHBOARD_NAV_LINKS, APP_NAME } from "@/lib/constants";
import { Shield, LogOut, PanelLeft } from "lucide-react";
import { useAuth } from "@/contexts/auth-context";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation"; 
import Link from "next/link";
import { cn } from "@/lib/utils";

// Inner component to access SidebarContext
function DashboardPageLayoutContent({ children, handleLogout }: { children: React.ReactNode; handleLogout: () => void; }) {
  const { open, collapsible, width, iconWidth } = useSidebar();

  return (
    // The root div for the flex layout, its data-state will be controlled by SidebarProvider
    <div className="flex min-h-screen w-full flex-col bg-muted/40">
      <Sidebar collapsible="icon" className="border-r border-sidebar-border">
        <SidebarHeader className="p-4">
          <Link href="/dashboard" className="flex items-center gap-2 font-semibold">
            <Shield className={cn(
              "h-7 w-7 text-primary transition-all",
              collapsible === 'icon' && !open && "h-8 w-8"
            )} />
            {(open || collapsible !== 'icon') && <span className="text-xl whitespace-nowrap">{APP_NAME}</span>}
            {collapsible === 'icon' && !open && <span className="sr-only">{APP_NAME}</span>}
          </Link>
        </SidebarHeader>
        <SidebarContent className="p-2">
          <MainNav links={DASHBOARD_NAV_LINKS} />
        </SidebarContent>
        <SidebarFooter className="p-2 border-t border-sidebar-border">
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton onClick={handleLogout} className="w-full justify-start" tooltip="Logout">
                <LogOut />
                <span className="group-data-[icon-collapsed=true]:hidden whitespace-nowrap">Logout</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
      </Sidebar>

      <div className={cn(
        "flex flex-col sm:gap-4 sm:py-4 transition-[padding-left] duration-200",
        // Apply padding based on 'open' state and 'collapsible' type
        (open && collapsible === 'icon') || collapsible !== 'icon' ? `sm:pl-[calc(${width}_+_1rem)]` : `sm:pl-[calc(${iconWidth}_+_1rem)]`
      )}>
        <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
          {/* SidebarTrigger is now always potentially visible, controlled by its internal logic or specific screen needs */}
          <div> {/* Removed md:hidden */}
            <SidebarTrigger asChild>
              <Button size="icon" variant="outline">
                <PanelLeft className="h-5 w-5" />
                <span className="sr-only">Toggle Menu</span>
              </Button>
            </SidebarTrigger>
          </div>
          <div className="ml-auto">
            {/* UserNav is in Header, but this is fine */}
          </div>
        </header>
        <main className="flex-1 p-4 sm:px-6 sm:py-0 md:gap-8 bg-background rounded-lg shadow-sm">
          {children}
        </main>
      </div>
    </div>
  );
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { logout, loading, isAuthenticated } = useAuth();
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
    return null;
  }

  return (
    <SidebarProvider defaultOpen={true} collapsible="icon">
      <DashboardPageLayoutContent handleLogout={logout}>
        {children}
      </DashboardPageLayoutContent>
    </SidebarProvider>
  );
}
