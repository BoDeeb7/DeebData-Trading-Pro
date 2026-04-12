"use client"

import React, { useEffect, useRef } from 'react';

interface TechnicalAnalysisProps {
  symbol?: string;
  height?: string | number;
}

export const TechnicalAnalysis = ({ symbol = "OANDA:XAUUSD", height = 400 }: TechnicalAnalysisProps) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    
    const script = document.createElement("script");
    script.src = "https://s3.tradingview.com/external-embedding/embed-widget-technical-analysis.js";
    script.type = "text/javascript";
    script.async = true;
    script.innerHTML = JSON.stringify({
      "interval": "1m",
      "width": "100%",
      "isTransparent": true,
      "height": height,
      "symbol": symbol,
      "showIntervalTabs": true,
      "displayMode": "single",
      "locale": "en",
      "colorTheme": "dark"
    });
    
    containerRef.current.innerHTML = "";
    containerRef.current.appendChild(script);
  }, [symbol, height]);

  return (
    <div className="tradingview-widget-container rounded-2xl overflow-hidden" ref={containerRef}>
      <div className="tradingview-widget-container__widget"></div>
    </div>
  );
};
