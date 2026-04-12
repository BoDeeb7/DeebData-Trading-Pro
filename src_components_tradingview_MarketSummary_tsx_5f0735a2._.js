(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/src/components/tradingview/MarketSummary.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "MarketSummary",
    ()=>MarketSummary
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
const MarketSummary = ()=>{
    _s();
    const containerRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "MarketSummary.useEffect": ()=>{
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
                            {
                                "name": "FOREXCOM:SPX500",
                                "displayName": "S&P 500"
                            },
                            {
                                "name": "FOREXCOM:NSXUSD",
                                "displayName": "US 100"
                            },
                            {
                                "name": "FOREXCOM:DJI",
                                "displayName": "Dow 30"
                            },
                            {
                                "name": "INDEX:NKY",
                                "displayName": "Nikkei 225"
                            },
                            {
                                "name": "INDEX:DEU40",
                                "displayName": "DAX Index"
                            }
                        ]
                    },
                    {
                        "name": "Futures",
                        "originalName": "Futures",
                        "symbols": [
                            {
                                "name": "CME_MINI:ES1!",
                                "displayName": "S&P 500"
                            },
                            {
                                "name": "CME:6E1!",
                                "displayName": "Euro"
                            },
                            {
                                "name": "COMEX:GC1!",
                                "displayName": "Gold"
                            },
                            {
                                "name": "NYMEX:CL1!",
                                "displayName": "Crude Oil"
                            }
                        ]
                    },
                    {
                        "name": "Crypto",
                        "originalName": "Forex",
                        "symbols": [
                            {
                                "name": "BINANCE:BTCUSDT",
                                "displayName": "BTC/USDT"
                            },
                            {
                                "name": "BINANCE:ETHUSDT",
                                "displayName": "ETH/USDT"
                            },
                            {
                                "name": "BINANCE:SOLUSDT",
                                "displayName": "SOL/USDT"
                            }
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
        }
    }["MarketSummary.useEffect"], []);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "tradingview-widget-container rounded-lg overflow-hidden border border-border",
        ref: containerRef,
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "tradingview-widget-container__widget"
        }, void 0, false, {
            fileName: "[project]/src/components/tradingview/MarketSummary.tsx",
            lineNumber: 62,
            columnNumber: 7
        }, ("TURBOPACK compile-time value", void 0))
    }, void 0, false, {
        fileName: "[project]/src/components/tradingview/MarketSummary.tsx",
        lineNumber: 61,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
};
_s(MarketSummary, "8puyVO4ts1RhCfXUmci3vLI3Njw=");
_c = MarketSummary;
var _c;
__turbopack_context__.k.register(_c, "MarketSummary");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/tradingview/MarketSummary.tsx [app-client] (ecmascript, next/dynamic entry)", ((__turbopack_context__) => {

__turbopack_context__.n(__turbopack_context__.i("[project]/src/components/tradingview/MarketSummary.tsx [app-client] (ecmascript)"));
}),
]);

//# sourceMappingURL=src_components_tradingview_MarketSummary_tsx_5f0735a2._.js.map