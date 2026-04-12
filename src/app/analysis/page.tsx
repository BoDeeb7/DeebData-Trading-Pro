
"use client"

import React, { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@/firebase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ArrowLeft, LineChart, Activity, Search, Globe, ShieldCheck } from 'lucide-react';
import Link from 'next/link';

export default function AnalysisPage() {
  const router = useRouter();
  const { user, isUserLoading } = useUser();
  const containerRef = useRef<HTMLDivElement>(null);
  const gaugeRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);
  const [activeSymbol, setActiveSymbol] = useState('OANDA:XAUUSD');
  const [searchInput, setSearchInput] = useState('');

  useEffect(() => {
    setMounted(true);
    if (!isUserLoading && !user) {
      router.push('/login');
    }
  }, [user, isUserLoading, router]);

  const updateWidgets = (symbol: string) => {
    if (!mounted || !containerRef.current || !gaugeRef.current) return;
    
    // 1. Advanced Chart Widget
    containerRef.current.innerHTML = `
      <div class="tradingview-widget-container" style="height: 100%; width: 100%;">
        <div class="tradingview-widget-container__widget" style="height: calc(100% - 32px); width: 100%;"></div>
      </div>
    `;
    const scriptChart = document.createElement("script");
    scriptChart.src = "https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js";
    scriptChart.type = "text/javascript";
    scriptChart.async = true;
    scriptChart.innerHTML = JSON.stringify({
      "autosize": true,
      "symbol": symbol,
      "interval": "D",
      "timezone": "Etc/UTC",
      "theme": "dark",
      "style": "1",
      "locale": "en",
      "enable_publishing": false,
      "allow_symbol_change": true,
      "calendar": false,
      "support_host": "https://www.tradingview.com"
    });
    containerRef.current.querySelector('.tradingview-widget-container')?.appendChild(scriptChart);

    // 2. Technical Analysis Gauge Widget
    gaugeRef.current.innerHTML = `
      <div class="tradingview-widget-container" style="height: 100%; width: 100%;">
        <div class="tradingview-widget-container__widget"></div>
      </div>
    `;
    const scriptGauge = document.createElement("script");
    scriptGauge.src = "https://s3.tradingview.com/external-embedding/embed-widget-technical-analysis.js";
    scriptGauge.type = "text/javascript";
    scriptGauge.async = true;
    scriptGauge.innerHTML = JSON.stringify({
      "interval": "1m",
      "width": "100%",
      "isTransparent": true,
      "height": "100%",
      "symbol": symbol,
      "showIntervalTabs": true,
      "displayMode": "single",
      "locale": "en",
      "colorTheme": "dark"
    });
    gaugeRef.current.querySelector('.tradingview-widget-container')?.appendChild(scriptGauge);
  };

  useEffect(() => {
    if (mounted) {
      updateWidgets(activeSymbol);
    }
  }, [mounted, activeSymbol]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchInput) return;
    const formatted = searchInput.includes(':') ? searchInput.toUpperCase() : `OANDA:${searchInput.toUpperCase()}`;
    setActiveSymbol(formatted);
  };

  if (!mounted || isUserLoading || !user) return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <Activity className="h-8 w-8 text-primary animate-spin" />
    </div>
  );

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <header className="h-16 border-b border-border flex items-center justify-between px-8 bg-card/40 backdrop-blur-md sticky top-0 z-40">
        <div className="flex items-center gap-4">
          <Link href="/dashboard">
            <Button variant="ghost" size="sm" className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" /> Terminal
            </Button>
          </Link>
          <h1 className="text-xl font-bold font-headline flex items-center gap-2">
            <LineChart className="h-5 w-5 text-primary" /> Technical Hub
          </h1>
        </div>

        <form onSubmit={handleSearch} className="relative w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search Global Asset (e.g. BTCUSD)" 
            className="h-10 bg-card/5 border-border pl-10 text-[11px] font-black uppercase tracking-widest"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
          />
        </form>

        <div className="text-[10px] text-muted-foreground/40 italic hidden sm:block uppercase font-black">
          Institutional Analysis Engine
        </div>
      </header>

      <main className="flex-1 p-4 grid grid-cols-1 lg:grid-cols-4 gap-4">
        {/* Main Chart Section */}
        <div className="lg:col-span-3 w-full h-full min-h-[500px] rounded-2xl overflow-hidden border border-border glassmorphism" ref={containerRef}>
          <div className="flex items-center justify-center h-full">
            <Activity className="h-8 w-8 text-primary/20 animate-pulse" />
          </div>
        </div>
        
        {/* Sidebar Info Section */}
        <div className="w-full h-full flex flex-col gap-4">
          <div className="flex-1 rounded-2xl border border-border glassmorphism p-4 flex flex-col min-h-[300px]">
            <h3 className="text-xs font-black uppercase tracking-widest text-muted-foreground mb-4">Sentiment: {activeSymbol.split(':').pop()}</h3>
            <div ref={gaugeRef} className="flex-1 overflow-hidden">
               <div className="flex items-center justify-center h-full">
                  <Activity className="h-6 w-6 text-primary/20 animate-pulse" />
               </div>
            </div>
          </div>
          
          <div className="h-fit rounded-2xl border border-border glassmorphism p-6 flex flex-col justify-center space-y-4">
             <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                   <Activity className="h-5 w-5 text-primary" />
                </div>
                <div className="text-right">
                  <p className="text-[10px] font-black text-success uppercase tracking-widest">Live Link: Stable</p>
                  <p className="text-[10px] font-black text-primary uppercase tracking-widest">Precision: 98.4%</p>
                </div>
             </div>
             
             <div className="space-y-2">
               <h4 className="text-xs font-bold uppercase tracking-tighter">Live Analysis Active</h4>
               <p className="text-[10px] text-muted-foreground uppercase tracking-widest leading-relaxed">
                 Institutional scanners are currently focusing on <span className="text-primary font-black">{activeSymbol.split(':').pop()}</span> real-time order blocks and liquidity zones.
               </p>
             </div>

             <div className="pt-2 flex items-center gap-2">
                <div className="h-1.5 w-1.5 rounded-full bg-success animate-pulse" />
                <span className="text-[9px] font-black uppercase text-muted-foreground">Neural Engine Connected</span>
             </div>
          </div>
        </div>
      </main>
    </div>
  );
}
