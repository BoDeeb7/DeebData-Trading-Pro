"use client"

import React, { useEffect, useRef } from 'react';

export const EconomicCalendar = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    
    const script = document.createElement("script");
    script.src = "https://s3.tradingview.com/external-embedding/embed-widget-events.js";
    script.type = "text/javascript";
    script.async = true;
    script.innerHTML = JSON.stringify({
      "colorTheme": "dark",
      "isTransparent": true,
      "width": "100%",
      "height": "600",
      "locale": "en",
      "importanceFilter": "-1,0,1",
      "currencyFilter": "USD,EUR,JPY,GBP,AUD,CAD,CHF"
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