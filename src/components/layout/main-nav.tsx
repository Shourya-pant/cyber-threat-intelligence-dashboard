"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import * as LucideIcons from "lucide-react";
import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";

// Add type safety for icon names
type IconName = keyof typeof LucideIcons;

interface NavLink {
  href: string;
  label: string;
  iconName?: IconName; // Make iconName optional
  subItems?: NavLink[]; // For nested navigation
}

interface MainNavProps {
  links: NavLink[];
}

export function MainNav({ links }: MainNavProps) {
  const pathname = usePathname();

  const renderLink = (link: NavLink, isSubItem: boolean = false) => {
    const IconComponent = link.iconName ? LucideIcons[link.iconName] as LucideIcons.LucideIcon : LucideIcons.ChevronRight;
    const isActive = pathname === link.href || (link.href !== "/" && pathname.startsWith(link.href));

    if (isSubItem) {
      return (
        <SidebarMenuSubItem key={link.href}>
          <Link href={link.href} legacyBehavior passHref>
            <SidebarMenuSubButton isActive={isActive} aria-label={link.label}>
              {link.iconName && <IconComponent />} 
              <span>{link.label}</span>
            </SidebarMenuSubButton>
          </Link>
        </SidebarMenuSubItem>
      );
    }

    return (
      <SidebarMenuItem key={link.href}>
        <Link href={link.href} legacyBehavior passHref>
          <SidebarMenuButton isActive={isActive} tooltip={link.label}>
            <IconComponent />
            <span>{link.label}</span>
          </SidebarMenuButton>
        </Link>
        {link.subItems && link.subItems.length > 0 && isActive && (
           <SidebarMenuSub>
            {link.subItems.map(subLink => renderLink(subLink, true))}
          </SidebarMenuSub>
        )}
      </SidebarMenuItem>
    );
  };
  
  // Example of grouping, can be customized further
  const mainLinks = links.filter(link => !link.href.includes('settings'));
  const settingsLinks = links.filter(link => link.href.includes('settings'));


  return (
    <SidebarMenu>
      {/* <SidebarGroup>
        <SidebarGroupLabel>Main Menu</SidebarGroupLabel> */}
        {mainLinks.map(link => renderLink(link))}
      {/* </SidebarGroup> */}
      
      {settingsLinks.length > 0 && (
        <SidebarGroup className="mt-auto pt-4 border-t border-sidebar-border">
          {/* <SidebarGroupLabel>Configuration</SidebarGroupLabel> */}
          {settingsLinks.map(link => renderLink(link))}
        </SidebarGroup>
      )}
    </SidebarMenu>
  );
}
