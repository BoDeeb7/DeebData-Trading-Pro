
"use client"

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Award, PieChart, History, User } from 'lucide-react';
import { cn } from '@/lib/utils';

const NAV_ITEMS = [
  { href: '/dashboard', icon: LayoutDashboard, label: 'AI Pulse' },
  { href: '/manual-analysis', icon: Award, label: 'Hassan Pro' },
  { href: '/analysis', icon: PieChart, label: 'Tech Hub' },
  { href: '/history', icon: History, label: 'Log' },
  { href: '/profile', icon: User, label: 'Profile' },
];

export const MobileNav = () => {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 z-[100] bg-background/95 backdrop-blur-xl border-t border-border flex items-center justify-around h-16 px-2 pb-safe shadow-[0_-4px_10px_rgba(0,0,0,0.3)]">
      {NAV_ITEMS.map((item) => {
        const Icon = item.icon;
        const isActive = pathname === item.href;
        
        return (
          <Link 
            key={item.href} 
            href={item.href}
            className={cn(
              "flex flex-col items-center justify-center flex-1 h-full gap-1 transition-all",
              isActive ? "text-primary" : "text-muted-foreground"
            )}
          >
            <div className={cn(
              "p-1.5 rounded-lg transition-all",
              isActive && "bg-primary/10"
            )}>
              <Icon className={cn("h-5 w-5", isActive && "fill-primary/20")} />
            </div>
            <span className="text-[8px] font-black uppercase tracking-widest">{item.label}</span>
          </Link>
        );
      })}
    </div>
  );
};
