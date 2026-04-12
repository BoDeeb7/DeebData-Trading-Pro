
"use client"

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@/firebase';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Newspaper, Activity, RefreshCw } from 'lucide-react';
import Link from 'next/link';

export default function NewsPage() {
  const router = useRouter();
  const { user, isUserLoading } = useUser();
  const containerRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    setMounted(true);
    if (!isUserLoading && !user) {
      router.push('/login');
    }
  }, [user, isUserLoading, router]);

  const loadWidget = useCallback(() => {
    if (!mounted || !containerRef.current) return;
    
    const script = document.createElement("script");
    script.src = "https://s3.tradingview.com/external-embedding/embed-widget-timeline.js";
    script.type = "text/javascript";
    script.async = true;
    script.innerHTML = JSON.stringify({
      "feedMode": "all_symbols",
      "colorTheme": "dark",
      "isTransparent": true,
      "displayMode": "regular",
      "width": "100%",
      "height": "100%",
      "locale": "en"
    });
    
    containerRef.current.innerHTML = "";
    containerRef.current.appendChild(script);
  }, [mounted]);

  useEffect(() => {
    loadWidget();
  }, [loadWidget, refreshKey]);

  const handleRefresh = () => {
    setRefreshKey(prev => prev + 1);
  };

  if (!mounted || isUserLoading || !user) return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <Activity className="h-8 w-8 text-primary animate-spin" />
    </div>
  );

  return (
    <div className="min-h-screen bg-black text-foreground flex flex-col overflow-hidden">
      <header className="h-16 border-b border-white/5 flex items-center justify-between px-8 bg-black/40 backdrop-blur-md sticky top-0 z-40">
        <div className="flex items-center gap-4">
          <Link href="/dashboard">
            <Button variant="ghost" size="sm" className="flex items-center gap-2 hover:bg-white/5">
              <ArrowLeft className="h-4 w-4" /> Terminal
            </Button>
          </Link>
          <h1 className="text-xl font-bold font-headline flex items-center gap-2 uppercase tracking-tighter">
            <Newspaper className="h-5 w-5 text-primary" /> Global Intelligence Feed
          </h1>
        </div>
        
        <div className="flex items-center gap-4">
          <Button 
            onClick={handleRefresh} 
            variant="outline" 
            size="sm" 
            className="h-10 border-white/10 bg-white/5 font-black uppercase text-[10px] tracking-widest hover:bg-white/10"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${refreshKey > 0 ? 'animate-spin' : ''}`} /> Refresh Live News
          </Button>
          <div className="text-[10px] text-muted-foreground/40 italic hidden sm:block uppercase tracking-widest font-black">
            Powered by Hassan Deeb
          </div>
        </div>
      </header>

      <main className="flex-1 p-0 bg-black">
        <div className="w-full h-[calc(100vh-64px-32px)] overflow-hidden" ref={containerRef}>
          <div className="tradingview-widget-container h-full">
            <div className="tradingview-widget-container__widget"></div>
          </div>
        </div>
      </main>
      
      <footer className="h-8 bg-primary/10 border-t border-white/5 flex items-center px-8 justify-between">
         <p className="text-[8px] font-black uppercase tracking-[0.3em] text-muted-foreground">Institutional Global News Network</p>
         <p className="text-[8px] font-black uppercase tracking-[0.3em] text-primary">Live Connection Established</p>
      </footer>
    </div>
  );
}
