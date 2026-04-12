"use client"

import React, { useEffect, useRef } from 'react';

export const MarketSummary = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    
    const script = document.createElement("script");
    script.src = "https://s3.tradingview.com/external-embedding/embed-widget-market-quotes.js";
    script.type = "text/javascript";
    script.async = true;
    script.innerHTML = JSON.stringify({
      "width": "100%",
      "height": "600",
      "symbolsGroups": [
        {
          "name": "Indices",
          "originalName": "Indices",
          "symbols": [
            { "name": "FOREXCOM:SPX500", "displayName": "S&P 500" },
            { "name": "FOREXCOM:NSXUSD", "displayName": "US 100" },
            { "name": "FOREXCOM:DJI", "displayName": "Dow 30" },
            { "name": "INDEX:NKY", "displayName": "Nikkei 225" },
            { "name": "INDEX:DEU40", "displayName": "DAX Index" }
          ]
        },
        {
          "name": "Futures",
          "originalName": "Futures",
          "symbols": [
            { "name": "CME_MINI:ES1!", "displayName": "S&P 500" },
            { "name": "CME:6E1!", "displayName": "Euro" },
            { "name": "COMEX:GC1!", "displayName": "Gold" },
            { "name": "NYMEX:CL1!", "displayName": "Crude Oil" }
          ]
        },
        {
          "name": "Crypto",
          "originalName": "Forex",
          "symbols": [
            { "name": "BINANCE:BTCUSDT", "displayName": "BTC/USDT" },
            { "name": "BINANCE:ETHUSDT", "displayName": "ETH/USDT" },
            { "name": "BINANCE:SOLUSDT", "displayName": "SOL/USDT" }
          ]
        }
      ],
      "showSymbolLogo": true,
      "colorTheme": "dark",
      "isTransparent": true,
      "locale": "en"
    });
    
    containerRef.current.innerHTML = "";
    containerRef.current.appendChild(script);
  }, []);

  return (
    <div className="tradingview-widget-container rounded-lg overflow-hidden border border-border" ref={containerRef}>
      <div className="tradingview-widget-container__widget"></div>
    </div>
  );
};