import Link from 'next/link';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Menu, Shield } from 'lucide-react';
import { APP_NAME, NAV_LINKS } from '@/lib/constants';
import { UserNav } from './user-nav';
import { cn } from '@/lib/utils';

interface HeaderProps {
  isDashboard?: boolean;
}

export function Header({ isDashboard = false }: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 max-w-screen-2xl items-center">
        <Link href="/" className="mr-6 flex items-center space-x-2">
          <Shield className="h-6 w-6 text-primary" />
          <span className="font-bold sm:inline-block">{APP_NAME}</span>
        </Link>
        
        {!isDashboard && (
          <nav className="hidden md:flex gap-6 text-sm font-medium items-center flex-1">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-foreground/60 transition-colors hover:text-foreground/80"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        )}

        <div className={cn("flex flex-1 items-center justify-end space-x-4", isDashboard ? "justify-between" : "justify-end")}>
          {isDashboard && <div />} {/* Placeholder for dashboard specific actions if any, or to balance UserNav to the right */}
          <UserNav />
        </div>

        {!isDashboard && (
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="md:hidden ml-4">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[300px] sm:w-[400px]">
              <nav className="flex flex-col gap-4 mt-8">
                {NAV_LINKS.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="block px-2 py-1 text-lg hover:bg-accent hover:text-accent-foreground rounded-md"
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>
            </SheetContent>
          </Sheet>
        )}
      </div>
    </header>
  );
}
