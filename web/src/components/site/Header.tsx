'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ThemeToggle } from '@/components/site/ThemeToggle';
import { MobileNav } from '@/components/site/MobileNav';
import { cn } from '@/lib/cn';

export function Header() {
  const pathname = usePathname();

  const nav = [
    { href: '/', label: 'Home' },
    { href: '/garden', label: 'Garden' },
    { href: '/project', label: 'Projects' },
    { href: '/german', label: 'German' },
    { href: '/wanderlust', label: 'Wanderlust' },
  ];

  return (
    <header className="fixed top-0 left-0 w-full z-50 header-bg">
      <div className="container max-w-7xl flex items-center justify-between h-20">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <img src="/logo.png" alt="Magnus" className="h-8 w-8 object-contain" />
          <span className="text-xl font-heading font-medium tracking-tight text-fg group-hover:opacity-80 transition-opacity">
            Magnus.
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-0">
          {nav.map((item) => {
            const isActive = pathname === item.href || (item.href !== '/' && pathname?.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'relative px-4 py-2 text-sm transition-colors uppercase tracking-wider font-medium',
                  isActive ? 'text-fg' : 'text-fg-muted hover:text-fg'
                )}
              >
                {item.label}
                {isActive && (
                  <span className="absolute -bottom-0.5 left-3 right-3 pointer-events-none">
                    <svg viewBox="0 0 60 7" fill="none" preserveAspectRatio="none" className="w-full h-[7px]">
                      <path d="M1,5.5 C8,1.5 18,0.5 30,3.5 C42,6 52,1.5 59,4" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" className="text-fg/60" />
                    </svg>
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-1">
          <ThemeToggle />
          <MobileNav items={nav} />
        </div>
      </div>
    </header>
  );
}
