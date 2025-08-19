'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useTheme } from 'next-themes';
import { 
  Menu, 
  X, 
  Sparkles, 
  History, 
  Heart, 
  Settings, 
  Bell,
  User,
  Sun,
  Moon,
  Home
} from 'lucide-react';
import { useState, useEffect } from 'react';

interface ModernHeaderProps {
  onMenuToggle: () => void;
  isMenuOpen: boolean;
}

export function ModernHeader({ onMenuToggle, isMenuOpen }: ModernHeaderProps) {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [showMobileNav, setShowMobileNav] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setMounted(true);
  }, []);

  const toggleTheme = () => {
    if (theme === 'dark') {
      setTheme('light');
    } else {
      setTheme('dark');
    }
  };

  const isActive = (path: string) => {
    return pathname === path;
  };

  const closeMobileNav = () => {
    setShowMobileNav(false);
  };

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b border-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60">
        <div className="container-fluid px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            {/* Logo et Titre */}
            <div className="flex items-center space-x-3">
              <Button
                variant="ghost"
                size="icon"
                className="lg:hidden"
                onClick={onMenuToggle}
              >
                {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </Button>
              
              <div className="flex items-center space-x-3">
                <div className="relative h-8 w-8">
                  <Link href="/">
                    <Image src="/logo.svg" alt="Sterenova" width={32} height={32} />
                  </Link>
                </div>
                <div className="hidden sm:block">
                  <h1 className="text-xl font-bold text-foreground">Sterenova</h1>
                  <p className="text-xs text-muted-foreground">Générateur de Templates</p>
                </div>
              </div>
            </div>

            {/* Navigation Desktop */}
            <nav className="hidden md:flex items-center space-x-6">
              <div className="flex items-center space-x-4">
                <Link href="/">
                  <Button 
                    variant={isActive('/') ? 'default' : 'ghost'} 
                    size="sm" 
                    className={isActive('/') ? '' : 'text-muted-foreground hover:text-foreground'}
                  >
                    <Home className="h-4 w-4 mr-2" />
                    Accueil
                  </Button>
                </Link>
           
                <Link href="/editor">
                  <Button 
                    variant={isActive('/editor') ? 'default' : 'ghost'} 
                    size="sm" 
                    className={isActive('/editor') ? '' : 'text-muted-foreground hover:text-foreground'}
                  >
                    <Sparkles className="h-4 w-4 mr-2" />
                    Éditeur
                  </Button>
                </Link>
                
                <Link href="/history">
                  <Button 
                    variant={isActive('/history') ? 'default' : 'ghost'} 
                    size="sm" 
                    className={isActive('/history') ? '' : 'text-muted-foreground hover:text-foreground'}
                  >
                    <History className="h-4 w-4 mr-2" />
                    Historique
                  </Button>
                </Link>
                
                <Link href="/favorites">
                  <Button 
                    variant={isActive('/favorites') ? 'default' : 'ghost'} 
                    size="sm" 
                    className={isActive('/favorites') ? '' : 'text-muted-foreground hover:text-foreground'}
                  >
                    <Heart className="h-4 w-4 mr-2" />
                    Favoris
                  </Button>
                </Link>
                
                <Link href="/settings">
                  <Button 
                    variant={isActive('/settings') ? 'default' : 'ghost'} 
                    size="sm" 
                    className={isActive('/settings') ? '' : 'text-muted-foreground hover:text-foreground'}
                  >
                    <Settings className="h-4 w-4 mr-2" />
                    Paramètres
                  </Button>
                </Link>
              </div>
            </nav>

            {/* Actions et User */}
            <div className="flex items-center space-x-3">
              {/* Mobile Navigation Toggle */}
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden"
                onClick={() => setShowMobileNav(!showMobileNav)}
              >
                <Menu className="h-5 w-5" />
              </Button>

              {/* Theme Toggle */}
              {mounted && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={toggleTheme}
                  className="relative"
                  title={`Passer au thème ${theme === 'dark' ? 'clair' : 'sombre'}`}
                >
                  <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                  <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                  <span className="sr-only">Toggle theme</span>
                </Button>
              )}
              
              {/* Notifications */}
              {/* <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-5 w-5" />
                <Badge 
                  variant="destructive" 
                  className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 text-xs flex items-center justify-center"
                >
                  3
                </Badge>
              </Button> */}

              {/* User Menu */}
              {/* <Button variant="ghost" size="icon">
                <User className="h-5 w-5" />
              </Button> */}
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Navigation Overlay */}
      {showMobileNav && (
        <div className="md:hidden fixed inset-0 z-50 bg-black/50">
          <div className="fixed top-16 right-0 h-full w-80 bg-card border-l border-border shadow-xl">
            <div className="flex items-center justify-between p-4 border-b border-border">
              <h2 className="text-lg font-semibold">Navigation</h2>
              <Button
                variant="ghost"
                size="icon"
                onClick={closeMobileNav}
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
            
            <nav className="flex flex-col space-y-1 p-4">
              <Link href="/" onClick={closeMobileNav}>
                <Button 
                  variant={isActive('/') ? 'default' : 'ghost'} 
                  size="sm" 
                  className="w-full justify-start"
                >
                  <Sparkles className="h-4 w-4 mr-2" />
                  Accueil
                </Button>
              </Link>
              
              <Link href="/history" onClick={closeMobileNav}>
                <Button 
                  variant={isActive('/history') ? 'default' : 'ghost'} 
                  size="sm" 
                  className="w-full justify-start"
                >
                  <History className="h-4 w-4 mr-2" />
                  Historique
                </Button>
              </Link>
              
              <Link href="/favorites" onClick={closeMobileNav}>
                <Button 
                  variant={isActive('/favorites') ? 'default' : 'ghost'} 
                  size="sm" 
                  className="w-full justify-start"
                >
                  <Heart className="h-4 w-4 mr-2" />
                  Favoris
                </Button>
              </Link>
              
              <Link href="/settings" onClick={closeMobileNav}>
                <Button 
                  variant={isActive('/settings') ? 'default' : 'ghost'} 
                  size="sm" 
                  className="w-full justify-start"
                >
                  <Settings className="h-4 w-4 mr-2" />
                  Paramètres
                </Button>
              </Link>
              
              <Link href="/editor" onClick={closeMobileNav}>
                <Button 
                  variant={isActive('/editor') ? 'default' : 'ghost'} 
                  size="sm" 
                  className="w-full justify-start"
                >
                  <Sparkles className="h-4 w-4 mr-2" />
                  Éditeur
                </Button>
              </Link>
            </nav>
          </div>
        </div>
      )}
    </>
  );
} 