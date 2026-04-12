"use client"

import React, { useEffect, useRef } from 'react';

export const NewsTimeline = ({ height = 600 }: { height?: string | number }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    
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
      "height": height,
      "locale": "en"
    });
    
    containerRef.current.innerHTML = "";
    containerRef.current.appendChild(script);
  }, [height]);

  return (
    <div className="tradingview-widget-container rounded-2xl overflow-hidden" ref={containerRef}>
      <div className="tradingview-widget-container__widget"></div>
    </div>
  );
};
