"use client"

import React, { useEffect, useRef } from 'react';

export const SentimentBar = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    
    const script = document.createElement("script");
    script.src = "https://s3.tradingview.com/external-embedding/embed-widget-ticker-tape.js";
    script.type = "text/javascript";
    script.async = true;
    script.innerHTML = JSON.stringify({
      "symbols": [
        { "proName": "FX_IDC:XAUUSD", "title": "GOLD SENTIMENT" },
        { "proName": "BITSTAMP:BTCUSD", "title": "BTC SENTIMENT" },
        { "proName": "BITSTAMP:ETHUSD", "title": "ETH SENTIMENT" },
        { "proName": "FX_IDC:EURUSD", "title": "EUR/USD SENTIMENT" },
        { "proName": "OANDA:NAS100USD", "title": "NASDAQ SENTIMENT" }
      ],
      "showSymbolLogo": false,
      "colorTheme": "dark",
      "isTransparent": true,
      "displayMode": "adaptive",
      "locale": "en"
    });
    
    containerRef.current.innerHTML = "";
    containerRef.current.appendChild(script);

    return () => {
      if (containerRef.current) {
        containerRef.current.innerHTML = "";
      }
    };
  }, []);

  return (
    <div className="tradingview-widget-container w-full bg-primary/10 backdrop-blur-xl border-t border-white/5" ref={containerRef}>
      <div className="tradingview-widget-container__widget"></div>
    </div>
  );
};
