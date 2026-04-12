
"use client"

import React, { useEffect, useRef, memo, useState } from 'react';
import { TrendingUp, TrendingDown, Lock, Eye, Activity, Scale, ShieldAlert, AlertTriangle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { AISignalOutput } from '@/ai/flows/ai-signal-generation';
import { cn } from '@/lib/utils';

interface SignalCardProps {
  symbol: string;
  type: 'Forex' | 'Crypto';
  signal: AISignalOutput;
  isLocked?: boolean;
  onUnlock?: () => void;
  onUpgradeClick?: () => void;
}

export const SignalCard = memo(({ symbol, type, signal, isLocked, onUnlock, onUpgradeClick }: SignalCardProps) => {
  const isBuy = signal.direction === 'Buy';
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted || !chartContainerRef.current || isLocked) return;

    const container = chartContainerRef.current;
    container.innerHTML = ""; 

    const widgetDiv = document.createElement("div");
    widgetDiv.className = "tradingview-widget-container__widget";
    widgetDiv.style.height = "100%";
    widgetDiv.style.width = "100%";
    container.appendChild(widgetDiv);

    const script = document.createElement("script");
    script.src = "https://s3.tradingview.com/external-embedding/embed-widget-mini-symbol-overview.js";
    script.type = "text/javascript";
    script.async = true;
    
    const cleanSym = symbol.toUpperCase().replace('/', '').replace('USDT', '').replace('USD', '');
    let tvSymbol = '';
    
    if (cleanSym === 'GOLD' || cleanSym === 'XAU') {
      tvSymbol = 'OANDA:XAUUSD';
    } else if (type === 'Crypto') {
      tvSymbol = `BINANCE:${cleanSym}USDT`;
    } else {
      tvSymbol = `FX:${cleanSym}USD`;
    }

    script.innerHTML = JSON.stringify({
      "symbol": tvSymbol,
      "width": "100%",
      "height": "100%",
      "locale": "en",
      "dateRange": "1D",
      "colorTheme": "dark",
      "trendLineColor": isBuy ? "#10b981" : "#ef4444",
      "underLineColor": isBuy ? "rgba(16, 185, 129, 0.1)" : "rgba(239, 68, 68, 0.1)",
      "isTransparent": true,
      "autosize": true
    });
    
    container.appendChild(script);

    return () => {
      if (container) container.innerHTML = "";
    };
  }, [mounted, symbol, type, isLocked, isBuy]);
  
  return (
    <Card className={cn(
      "relative overflow-hidden border-white/5 bg-card/40 glassmorphism transition-all duration-300 rounded-2xl sm:rounded-3xl gpu-stable",
      "min-h-[460px] sm:min-h-[580px] flex flex-col" 
    )}>
      <div className={cn(
        "absolute top-0 left-0 w-1 sm:w-1.5 h-full z-20",
        isBuy ? 'bg-success shadow-[0_0_15px_rgba(16,185,129,0.5)]' : 'bg-destructive shadow-[0_0_15px_rgba(239,68,68,0.5)]'
      )} />
      
      <CardHeader className="flex flex-row items-center justify-between pb-2 sm:pb-4 p-4 sm:p-6 relative z-10 gap-2">
        <div className="space-y-0.5 sm:space-y-1">
          <CardTitle className="text-lg sm:text-2xl font-black flex items-center gap-1.5 sm:gap-2 tracking-tighter uppercase">
            <span className="truncate max-w-[80px] sm:max-w-none">{symbol}</span>
            <Badge variant="outline" className="text-[7px] sm:text-[8px] uppercase font-black bg-white/5 px-1 py-0 border-white/10 shrink-0">
              {type}
            </Badge>
          </CardTitle>
          <div className="flex items-center gap-1">
             <div className="w-1 h-1 rounded-full bg-success animate-pulse shrink-0" />
             <p className="text-[7px] sm:text-[8px] text-muted-foreground/60 uppercase tracking-widest font-black truncate">Live Data</p>
          </div>
        </div>
        {!isLocked && (
          <div className={cn(
            "flex items-center gap-1 font-black text-xs sm:text-xl tracking-tighter px-2.5 py-1 sm:px-4 sm:py-1.5 rounded-lg sm:rounded-xl bg-white/5 border border-white/5 shrink-0",
            isBuy ? 'text-success' : 'text-destructive'
          )}>
            {isBuy ? <TrendingUp className="h-3.5 w-3.5 sm:h-5 sm:w-5" /> : <TrendingDown className="h-3.5 w-3.5 sm:h-5 sm:w-5" />}
            {signal.direction.toUpperCase()}
          </div>
        )}
      </CardHeader>

      <CardContent className="space-y-3 sm:space-y-5 p-4 sm:p-6 pt-0 relative flex-1 flex flex-col">
        {isLocked ? (
          <div className="absolute inset-0 z-50 flex flex-col items-center justify-center p-6 text-center bg-black/95 backdrop-blur-3xl rounded-2xl sm:rounded-3xl animate-in fade-in">
            <div className="h-14 w-14 sm:h-20 sm:w-20 rounded-xl sm:rounded-[2rem] bg-primary/10 border border-primary/20 flex items-center justify-center mb-4">
              <Lock className="h-6 w-6 sm:h-10 sm:w-10 text-primary" />
            </div>
            <h3 className="text-base sm:text-xl font-black uppercase tracking-tighter text-white mb-1">Locked</h3>
            <p className="text-[8px] sm:text-[9px] text-muted-foreground uppercase font-black tracking-widest mb-6 leading-relaxed">
              Unlock to see Entry, TP/SL<br/>and register performance
            </p>
            <Button onClick={onUnlock} className="h-11 sm:h-14 w-full bg-primary text-black font-black uppercase text-[10px] sm:text-sm tracking-widest rounded-xl">
              <Eye className="h-3.5 w-3.5 sm:h-5 sm:w-5 mr-2" /> Unlock Signal
            </Button>
          </div>
        ) : (
          <div className="animate-in fade-in duration-500 space-y-3 sm:space-y-5 flex-1 flex flex-col">
            <div className="grid grid-cols-3 gap-1.5 sm:gap-3 p-3 sm:p-5 rounded-xl sm:rounded-2xl bg-black/40 border border-white/5">
              <div className="space-y-0.5">
                <p className="text-[7px] sm:text-[8px] text-muted-foreground uppercase font-black tracking-widest">Entry</p>
                <p className="text-[10px] sm:text-sm font-mono font-black text-white truncate">{signal.entryPrice.toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
              </div>
              <div className="border-x border-white/5 px-1.5 sm:px-3 text-center space-y-0.5">
                <p className="text-[7px] sm:text-[8px] text-accent uppercase font-black tracking-widest">TP</p>
                <p className="text-[10px] sm:text-sm font-mono font-black text-accent truncate">{signal.takeProfit.toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
              </div>
              <div className="text-right space-y-0.5">
                <p className="text-[7px] sm:text-[8px] text-destructive uppercase font-black tracking-widest">SL</p>
                <p className="text-[10px] sm:text-sm font-mono font-black text-destructive truncate">{signal.stopLoss.toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-1.5 sm:gap-3">
              <div className="p-2 sm:p-3 rounded-xl bg-white/5 border border-white/5 flex items-center gap-2">
                <Scale className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-primary shrink-0" />
                <div className="min-w-0">
                  <p className="text-[6px] sm:text-[8px] uppercase font-black text-muted-foreground truncate">Lot Size</p>
                  <p className="text-[9px] sm:text-xs font-bold truncate">{signal.lotSize.toFixed(2)}</p>
                </div>
              </div>
              <div className="p-2 sm:p-3 rounded-xl bg-white/5 border border-white/5 flex items-center gap-2">
                <ShieldAlert className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-amber-500 shrink-0" />
                <div className="min-w-0">
                  <p className="text-[6px] sm:text-[8px] uppercase font-black text-muted-foreground truncate">Confid.</p>
                  <p className="text-[9px] sm:text-xs font-bold truncate">{signal.confidenceScore}%</p>
                </div>
              </div>
            </div>

            <div className="h-32 sm:h-48 border border-white/5 rounded-xl sm:rounded-3xl bg-black/40 overflow-hidden relative">
              <div ref={chartContainerRef} className="w-full h-full" />
            </div>

            <div className="p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-white/5 border border-white/10 space-y-2">
              <p className="text-[8px] sm:text-[10px] text-muted-foreground/90 leading-relaxed font-bold italic line-clamp-2">
                &ldquo;{signal.reasoning}&rdquo;
              </p>
              
              <div className="pt-1.5 border-t border-white/5 flex items-start gap-1.5">
                <AlertTriangle className="h-2.5 w-2.5 text-destructive shrink-0 mt-0.5" />
                <p className="text-[7px] sm:text-[9px] text-destructive/90 font-black uppercase leading-tight tracking-tight">
                  تنبيه: صفقات ذكاء اصطناعي غير حتمية وموكدة لأنها بالذكاء الاصطناعي وغير دقيقة.
                </p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
});
SignalCard.displayName = 'SignalCard';
