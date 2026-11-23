module.exports = [
"[project]/src/components/shared/decor.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Constellation",
    ()=>Constellation,
    "CrossMark",
    ()=>CrossMark,
    "DashedRing",
    ()=>DashedRing,
    "DiamondMark",
    ()=>DiamondMark,
    "GlowOrb",
    ()=>Glow,
    "Marquee",
    ()=>Marquee,
    "PageContainer",
    ()=>PageContainer,
    "PageDecor",
    ()=>PageDecor,
    "QuarterArc",
    ()=>QuarterArc,
    "Sparkle",
    ()=>Sparkle,
    "StarBurst",
    ()=>StarBurst,
    "TechLabel",
    ()=>TechLabel,
    "ZigzagField",
    ()=>ZigzagField
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/framer-motion/dist/es/render/components/motion/proxy.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/utils.ts [app-ssr] (ecmascript)");
'use client';
;
;
;
;
function Glow({ className, color }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])('pointer-events-none absolute rounded-full blur-[130px]', className),
        style: {
            background: color
        },
        "aria-hidden": "true"
    }, void 0, false, {
        fileName: "[project]/src/components/shared/decor.tsx",
        lineNumber: 32,
        columnNumber: 5
    }, this);
}
/* Одна крошечная звезда-точка (KIUTA-style speck). */ function Speck({ className, twinkle = false, delay = 0, red = false }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
        "aria-hidden": "true",
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])('pointer-events-none absolute h-[3px] w-[3px] rounded-full', red ? 'bg-[#a855f7] shadow-[0_0_8px_rgba(168,85,247,0.9)]' : 'bg-white/60', twinkle && 'animate-twinkle', className),
        style: twinkle ? {
            animationDelay: `${delay}s`
        } : undefined
    }, void 0, false, {
        fileName: "[project]/src/components/shared/decor.tsx",
        lineNumber: 53,
        columnNumber: 5
    }, this);
}
function Sparkle({ className, style }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
        viewBox: "0 0 24 24",
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])('h-4 w-4', className),
        style: style,
        "aria-hidden": "true",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
            d: "M12 0.6c0.9 6.6 4.8 10.5 11.4 11.4-6.6 0.9-10.5 4.8-11.4 11.4C11.1 16.8 7.2 12.9 0.6 12 7.2 11.1 11.1 7.2 12 0.6Z",
            fill: "currentColor"
        }, void 0, false, {
            fileName: "[project]/src/components/shared/decor.tsx",
            lineNumber: 78,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/src/components/shared/decor.tsx",
        lineNumber: 77,
        columnNumber: 5
    }, this);
}
function StarBurst({ className, style }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
        viewBox: "0 0 48 48",
        fill: "none",
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])('h-12 w-12', className),
        style: style,
        "aria-hidden": "true",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                d: "M24 1v46M1 24h46M8.4 8.4l31.2 31.2M39.6 8.4L8.4 39.6",
                stroke: "currentColor",
                strokeWidth: "1"
            }, void 0, false, {
                fileName: "[project]/src/components/shared/decor.tsx",
                lineNumber: 101,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                cx: "24",
                cy: "24",
                r: "7.5",
                stroke: "currentColor",
                strokeWidth: "1"
            }, void 0, false, {
                fileName: "[project]/src/components/shared/decor.tsx",
                lineNumber: 102,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                cx: "24",
                cy: "24",
                r: "15",
                stroke: "currentColor",
                strokeWidth: "1",
                strokeDasharray: "2 4"
            }, void 0, false, {
                fileName: "[project]/src/components/shared/decor.tsx",
                lineNumber: 103,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/shared/decor.tsx",
        lineNumber: 94,
        columnNumber: 5
    }, this);
}
function CrossMark({ className, style }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
        viewBox: "0 0 16 16",
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])('h-3.5 w-3.5', className),
        style: style,
        "aria-hidden": "true",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
            d: "M8 3v10M3 8h10",
            stroke: "currentColor",
            strokeWidth: "1.2",
            strokeLinecap: "round"
        }, void 0, false, {
            fileName: "[project]/src/components/shared/decor.tsx",
            lineNumber: 117,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/src/components/shared/decor.tsx",
        lineNumber: 116,
        columnNumber: 5
    }, this);
}
function DiamondMark({ className, style }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
        viewBox: "0 0 20 20",
        fill: "none",
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])('h-3 w-3', className),
        style: style,
        "aria-hidden": "true",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("rect", {
            x: "5.8",
            y: "5.8",
            width: "8.4",
            height: "8.4",
            transform: "rotate(45 10 10)",
            stroke: "currentColor",
            strokeWidth: "1.3"
        }, void 0, false, {
            fileName: "[project]/src/components/shared/decor.tsx",
            lineNumber: 131,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/src/components/shared/decor.tsx",
        lineNumber: 130,
        columnNumber: 5
    }, this);
}
function Constellation({ className }) {
    const P = [
        [
            14,
            118
        ],
        [
            52,
            44
        ],
        [
            96,
            86
        ],
        [
            138,
            18
        ],
        [
            176,
            96
        ],
        [
            120,
            140
        ],
        [
            36,
            150
        ]
    ];
    const L = [
        [
            0,
            1
        ],
        [
            1,
            2
        ],
        [
            2,
            3
        ],
        [
            2,
            5
        ],
        [
            3,
            4
        ],
        [
            5,
            6
        ],
        [
            0,
            6
        ]
    ];
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
        viewBox: "0 0 190 165",
        fill: "none",
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])('h-40 w-48', className),
        "aria-hidden": "true",
        children: [
            L.map(([a, b], i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("line", {
                    x1: P[a][0],
                    y1: P[a][1],
                    x2: P[b][0],
                    y2: P[b][1],
                    stroke: "rgba(255,255,255,0.20)",
                    strokeWidth: "1",
                    strokeDasharray: i % 2 ? '2 5' : undefined
                }, i, false, {
                    fileName: "[project]/src/components/shared/decor.tsx",
                    lineNumber: 158,
                    columnNumber: 9
                }, this)),
            P.map(([x, y], i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                    cx: x,
                    cy: y,
                    r: i === 3 ? 3 : 2,
                    fill: i === 3 ? 'rgba(168,85,247,0.9)' : 'rgba(255,255,255,0.55)'
                }, i, false, {
                    fileName: "[project]/src/components/shared/decor.tsx",
                    lineNumber: 170,
                    columnNumber: 9
                }, this)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                cx: P[3][0],
                cy: P[3][1],
                r: "8",
                stroke: "rgba(168,85,247,0.5)",
                strokeWidth: "1"
            }, void 0, false, {
                fileName: "[project]/src/components/shared/decor.tsx",
                lineNumber: 178,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/shared/decor.tsx",
        lineNumber: 156,
        columnNumber: 5
    }, this);
}
function ZigzagField({ className }) {
    const id = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useId"])();
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
        viewBox: "0 0 120 60",
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])('h-24 w-48', className),
        "aria-hidden": "true",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("defs", {
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("pattern", {
                    id: id,
                    width: "16",
                    height: "12",
                    patternUnits: "userSpaceOnUse",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                        d: "M0 10 L4 4 L8 10 L12 4",
                        fill: "none",
                        stroke: "rgba(255,255,255,0.18)",
                        strokeWidth: "1"
                    }, void 0, false, {
                        fileName: "[project]/src/components/shared/decor.tsx",
                        lineNumber: 189,
                        columnNumber: 11
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/src/components/shared/decor.tsx",
                    lineNumber: 188,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/components/shared/decor.tsx",
                lineNumber: 187,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("rect", {
                width: "120",
                height: "60",
                fill: `url(#${id})`
            }, void 0, false, {
                fileName: "[project]/src/components/shared/decor.tsx",
                lineNumber: 192,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/shared/decor.tsx",
        lineNumber: 186,
        columnNumber: 5
    }, this);
}
function QuarterArc({ className }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
        viewBox: "0 0 100 100",
        fill: "none",
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])('h-24 w-24', className),
        "aria-hidden": "true",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                d: "M2 98 A96 96 0 0 1 98 2",
                stroke: "currentColor",
                strokeWidth: "1"
            }, void 0, false, {
                fileName: "[project]/src/components/shared/decor.tsx",
                lineNumber: 200,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                d: "M18 98 A80 80 0 0 1 98 18",
                stroke: "currentColor",
                strokeWidth: "1",
                strokeDasharray: "3 6"
            }, void 0, false, {
                fileName: "[project]/src/components/shared/decor.tsx",
                lineNumber: 201,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                d: "M34 98 A64 64 0 0 1 98 34",
                stroke: "rgba(168,85,247,0.55)",
                strokeWidth: "1"
            }, void 0, false, {
                fileName: "[project]/src/components/shared/decor.tsx",
                lineNumber: 202,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/shared/decor.tsx",
        lineNumber: 199,
        columnNumber: 5
    }, this);
}
function TechLabel({ children, className }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])('tech-label pointer-events-none select-none', className),
        "aria-hidden": "true",
        children: [
            "[",
            children,
            "]"
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/shared/decor.tsx",
        lineNumber: 209,
        columnNumber: 5
    }, this);
}
function DashedRing({ className, reverse = false }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
        "aria-hidden": "true",
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])('pointer-events-none block', reverse ? 'animate-spin-reverse' : 'animate-spin-slower', className),
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
            viewBox: "0 0 100 100",
            fill: "none",
            className: "h-full w-full overflow-visible",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                    cx: "50",
                    cy: "50",
                    r: "49.4",
                    stroke: "currentColor",
                    strokeWidth: "0.55",
                    strokeDasharray: "1.2 3.4"
                }, void 0, false, {
                    fileName: "[project]/src/components/shared/decor.tsx",
                    lineNumber: 232,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                    cx: "50",
                    cy: "50",
                    r: "49.4",
                    stroke: "rgba(168,85,247,0.55)",
                    strokeWidth: "1.1",
                    strokeDasharray: "0.4 25.26"
                }, void 0, false, {
                    fileName: "[project]/src/components/shared/decor.tsx",
                    lineNumber: 233,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/src/components/shared/decor.tsx",
            lineNumber: 231,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/src/components/shared/decor.tsx",
        lineNumber: 223,
        columnNumber: 5
    }, this);
}
function PageDecor({ variant = 'mesh', className }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])('pointer-events-none absolute inset-0 -z-10 overflow-hidden', className),
        "aria-hidden": "true",
        children: [
            variant === 'landing' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(Glow, {
                        className: "right-[-12%] top-[-14%] h-[560px] w-[560px]",
                        color: "rgba(255,255,255,0.07)"
                    }, void 0, false, {
                        fileName: "[project]/src/components/shared/decor.tsx",
                        lineNumber: 255,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(Glow, {
                        className: "bottom-[-18%] left-[-10%] h-[460px] w-[460px]",
                        color: "rgba(168,85,247,0.05)"
                    }, void 0, false, {
                        fileName: "[project]/src/components/shared/decor.tsx",
                        lineNumber: 257,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "absolute inset-x-0 top-0 h-[420px] dot-grid opacity-[0.32] [mask-image:radial-gradient(ellipse_65%_75%_at_50%_0%,black,transparent_82%)]"
                    }, void 0, false, {
                        fileName: "[project]/src/components/shared/decor.tsx",
                        lineNumber: 259,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(Speck, {
                        className: "left-[8%] top-[18%]",
                        twinkle: true,
                        delay: 0.4
                    }, void 0, false, {
                        fileName: "[project]/src/components/shared/decor.tsx",
                        lineNumber: 261,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(Speck, {
                        className: "left-[31%] top-[9%] !h-[2px] !w-[2px]"
                    }, void 0, false, {
                        fileName: "[project]/src/components/shared/decor.tsx",
                        lineNumber: 262,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(Speck, {
                        className: "right-[28%] top-[24%]",
                        twinkle: true,
                        delay: 1.6
                    }, void 0, false, {
                        fileName: "[project]/src/components/shared/decor.tsx",
                        lineNumber: 263,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(Speck, {
                        className: "right-[6%] top-[46%] !h-[2px] !w-[2px]"
                    }, void 0, false, {
                        fileName: "[project]/src/components/shared/decor.tsx",
                        lineNumber: 264,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(Speck, {
                        className: "left-[16%] top-[58%] !h-[2px] !w-[2px]"
                    }, void 0, false, {
                        fileName: "[project]/src/components/shared/decor.tsx",
                        lineNumber: 265,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(Speck, {
                        className: "right-[14%] top-[72%]",
                        twinkle: true,
                        delay: 2.8
                    }, void 0, false, {
                        fileName: "[project]/src/components/shared/decor.tsx",
                        lineNumber: 266,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(Speck, {
                        className: "left-[44%] top-[84%] !h-[2px] !w-[2px]"
                    }, void 0, false, {
                        fileName: "[project]/src/components/shared/decor.tsx",
                        lineNumber: 267,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(Speck, {
                        className: "left-[6%] top-[38%]",
                        red: true
                    }, void 0, false, {
                        fileName: "[project]/src/components/shared/decor.tsx",
                        lineNumber: 268,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/shared/decor.tsx",
                lineNumber: 253,
                columnNumber: 9
            }, this),
            variant === 'mesh' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(Glow, {
                        className: "-top-40 -right-32 h-[480px] w-[480px]",
                        color: "rgba(255,255,255,0.06)"
                    }, void 0, false, {
                        fileName: "[project]/src/components/shared/decor.tsx",
                        lineNumber: 274,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "absolute inset-x-0 top-0 h-[380px] dot-grid opacity-30 [mask-image:radial-gradient(ellipse_70%_60%_at_50%_0%,black,transparent)]"
                    }, void 0, false, {
                        fileName: "[project]/src/components/shared/decor.tsx",
                        lineNumber: 275,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(Speck, {
                        className: "right-[14%] top-[22%]",
                        twinkle: true,
                        delay: 0.8
                    }, void 0, false, {
                        fileName: "[project]/src/components/shared/decor.tsx",
                        lineNumber: 276,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(Speck, {
                        className: "left-[10%] top-[48%] !h-[2px] !w-[2px]"
                    }, void 0, false, {
                        fileName: "[project]/src/components/shared/decor.tsx",
                        lineNumber: 277,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(Speck, {
                        className: "right-[8%] bottom-[18%]"
                    }, void 0, false, {
                        fileName: "[project]/src/components/shared/decor.tsx",
                        lineNumber: 278,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/shared/decor.tsx",
                lineNumber: 273,
                columnNumber: 9
            }, this),
            variant === 'grid' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "absolute inset-0 line-grid opacity-60"
                    }, void 0, false, {
                        fileName: "[project]/src/components/shared/decor.tsx",
                        lineNumber: 284,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(Glow, {
                        className: "-top-32 right-[12%] h-[380px] w-[380px]",
                        color: "rgba(255,255,255,0.05)"
                    }, void 0, false, {
                        fileName: "[project]/src/components/shared/decor.tsx",
                        lineNumber: 285,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(Speck, {
                        className: "right-[24%] top-[30%]",
                        twinkle: true,
                        delay: 1.1
                    }, void 0, false, {
                        fileName: "[project]/src/components/shared/decor.tsx",
                        lineNumber: 286,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/shared/decor.tsx",
                lineNumber: 283,
                columnNumber: 9
            }, this),
            variant === 'dots' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "absolute inset-0 dot-grid opacity-40 [mask-image:radial-gradient(ellipse_80%_80%_at_50%_20%,black,transparent_85%)]"
                    }, void 0, false, {
                        fileName: "[project]/src/components/shared/decor.tsx",
                        lineNumber: 292,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(Glow, {
                        className: "top-[-160px] left-1/2 h-[420px] w-[560px] -translate-x-1/2",
                        color: "rgba(255,255,255,0.05)"
                    }, void 0, false, {
                        fileName: "[project]/src/components/shared/decor.tsx",
                        lineNumber: 293,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(Speck, {
                        className: "left-[20%] top-[34%]",
                        twinkle: true,
                        delay: 0.5
                    }, void 0, false, {
                        fileName: "[project]/src/components/shared/decor.tsx",
                        lineNumber: 294,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/shared/decor.tsx",
                lineNumber: 291,
                columnNumber: 9
            }, this),
            variant === 'aurora' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["motion"].div, {
                        className: "absolute -top-44 left-[12%] h-[440px] w-[440px] rounded-full blur-[130px]",
                        style: {
                            background: 'rgba(255,255,255,0.055)'
                        },
                        animate: {
                            x: [
                                0,
                                70,
                                0
                            ],
                            y: [
                                0,
                                26,
                                0
                            ]
                        },
                        transition: {
                            duration: 20,
                            repeat: Infinity,
                            ease: 'easeInOut'
                        }
                    }, void 0, false, {
                        fileName: "[project]/src/components/shared/decor.tsx",
                        lineNumber: 300,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["motion"].div, {
                        className: "absolute top-1/3 right-[8%] h-[400px] w-[400px] rounded-full blur-[130px]",
                        style: {
                            background: 'rgba(168,85,247,0.045)'
                        },
                        animate: {
                            x: [
                                0,
                                -60,
                                0
                            ],
                            y: [
                                0,
                                34,
                                0
                            ]
                        },
                        transition: {
                            duration: 24,
                            repeat: Infinity,
                            ease: 'easeInOut',
                            delay: 2
                        }
                    }, void 0, false, {
                        fileName: "[project]/src/components/shared/decor.tsx",
                        lineNumber: 306,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(Speck, {
                        className: "left-[30%] top-[26%]",
                        twinkle: true,
                        delay: 0.9
                    }, void 0, false, {
                        fileName: "[project]/src/components/shared/decor.tsx",
                        lineNumber: 312,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(Speck, {
                        className: "right-[18%] top-[62%] !h-[2px] !w-[2px]"
                    }, void 0, false, {
                        fileName: "[project]/src/components/shared/decor.tsx",
                        lineNumber: 313,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/shared/decor.tsx",
                lineNumber: 299,
                columnNumber: 9
            }, this),
            variant === 'spotlight' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(Glow, {
                        className: "top-[-200px] left-1/2 h-[520px] w-[720px] -translate-x-1/2",
                        color: "rgba(255,255,255,0.07)"
                    }, void 0, false, {
                        fileName: "[project]/src/components/shared/decor.tsx",
                        lineNumber: 319,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "absolute inset-0 dot-grid opacity-25"
                    }, void 0, false, {
                        fileName: "[project]/src/components/shared/decor.tsx",
                        lineNumber: 320,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/shared/decor.tsx",
                lineNumber: 318,
                columnNumber: 9
            }, this),
            variant === 'side' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(Glow, {
                        className: "top-[10%] -left-44 h-[440px] w-[440px]",
                        color: "rgba(255,255,255,0.05)"
                    }, void 0, false, {
                        fileName: "[project]/src/components/shared/decor.tsx",
                        lineNumber: 326,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(Glow, {
                        className: "bottom-[4%] -right-44 h-[440px] w-[440px]",
                        color: "rgba(255,255,255,0.04)"
                    }, void 0, false, {
                        fileName: "[project]/src/components/shared/decor.tsx",
                        lineNumber: 327,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "absolute inset-0 line-grid opacity-40"
                    }, void 0, false, {
                        fileName: "[project]/src/components/shared/decor.tsx",
                        lineNumber: 328,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/shared/decor.tsx",
                lineNumber: 325,
                columnNumber: 9
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "noise-overlay"
            }, void 0, false, {
                fileName: "[project]/src/components/shared/decor.tsx",
                lineNumber: 332,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/shared/decor.tsx",
        lineNumber: 251,
        columnNumber: 5
    }, this);
}
;
function Marquee({ children, className, speed = 36 }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])('marquee-hover relative overflow-hidden', className),
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "animate-marquee flex w-max gap-10 whitespace-nowrap",
            style: {
                animationDuration: `${speed}s`
            },
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex items-center gap-10",
                    children: children
                }, void 0, false, {
                    fileName: "[project]/src/components/shared/decor.tsx",
                    lineNumber: 355,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex items-center gap-10",
                    "aria-hidden": "true",
                    children: children
                }, void 0, false, {
                    fileName: "[project]/src/components/shared/decor.tsx",
                    lineNumber: 356,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/src/components/shared/decor.tsx",
            lineNumber: 354,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/src/components/shared/decor.tsx",
        lineNumber: 353,
        columnNumber: 5
    }, this);
}
function PageContainer({ children, className }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])('relative mx-auto w-full max-w-6xl px-4 sm:px-6', className),
        children: children
    }, void 0, false, {
        fileName: "[project]/src/components/shared/decor.tsx",
        lineNumber: 373,
        columnNumber: 5
    }, this);
}
}),
"[project]/src/components/shared/dot-sphere.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>DotSphere
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/utils.ts [app-ssr] (ecmascript)");
'use client';
;
;
;
const NODE_COUNT = 440;
const VIOLET_RGB = '168, 85, 247';
const BASE_VEL = 0.16; // рад/с — базовая скорость вращения
const TILT_BASE = -0.32; // постоянный наклон оси (радианы)
/* Красивая последовательность Фибоначчи — равномерное покрытие сферы. */ function buildNodes(count) {
    const nodes = [];
    const golden = Math.PI * (3 - Math.sqrt(5));
    for(let i = 0; i < count; i++){
        const y = 1 - i / (count - 1) * 2; // от +1 до -1
        const radiusAtY = Math.sqrt(Math.max(0, 1 - y * y));
        const theta = golden * i;
        nodes.push({
            x: Math.cos(theta) * radiusAtY,
            y,
            z: Math.sin(theta) * radiusAtY,
            violet: Math.random() < 0.12
        });
    }
    return nodes;
}
function DotSphere({ className }) {
    const hostRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    const [failed, setFailed] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        const host = hostRef.current;
        if (!host) return;
        let disposed = false;
        let cleanup = ()=>{};
        try {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            if (!ctx) throw new Error('no 2d context');
            canvas.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;display:block;';
            host.appendChild(canvas);
            const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
            const nodes = buildNodes(NODE_COUNT);
            const pulses = [];
            /* Состояние сцены -------------------------------------------------- */ let w = host.clientWidth || 480;
            let h = host.clientHeight || 480;
            let dpr = Math.min(window.devicePixelRatio || 1, 1.5);
            let radius = Math.min(w, h) * 0.3;
            let angle = -0.6; // текущий угол вращения вокруг оси Y
            let angularVel = BASE_VEL; // текущая угловая скорость (рад/с)
            let tiltOffset = 0; // наклон от вертикального драга (возвращается к 0)
            let parX = 0;
            let parY = 0; // параллакс от курсора (сглаженный)
            let parTX = 0;
            let parTY = 0; // цели параллакса
            let boost = 0; // импульс яркости/скорости по клику
            /* Drag-состояние ---------------------------------------------------- */ let dragging = false;
            let dragMoved = 0;
            let lastX = 0;
            let lastY = 0;
            const resize = ()=>{
                w = host.clientWidth || 1;
                h = host.clientHeight || 1;
                dpr = Math.min(window.devicePixelRatio || 1, 1.5);
                canvas.width = Math.round(w * dpr);
                canvas.height = Math.round(h * dpr);
                ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
                radius = Math.min(w, h) * 0.3;
                if (reducedMotion) drawFrame(0);
            };
            /* Отрисовка одного кадра ------------------------------------------- */ const drawFrame = (dt)=>{
                ctx.clearRect(0, 0, w, h);
                const cx = w / 2;
                const cy = h / 2;
                /* Мягкое фиолетовое свечение ядра под точками. */ const core = ctx.createRadialGradient(cx, cy, 0, cx, cy, radius * 1.05);
                core.addColorStop(0, `rgba(${VIOLET_RGB}, ${0.1 + boost * 0.08})`);
                core.addColorStop(0.55, `rgba(${VIOLET_RGB}, 0.035)`);
                core.addColorStop(1, 'rgba(0,0,0,0)');
                ctx.fillStyle = core;
                ctx.beginPath();
                ctx.arc(cx, cy, radius * 1.05, 0, Math.PI * 2);
                ctx.fill();
                const tilt = TILT_BASE + tiltOffset + parY * 0.22;
                const spin = angle + parX * 0.18;
                const cosT = Math.cos(tilt);
                const sinT = Math.sin(tilt);
                const cosA = Math.cos(spin);
                const sinA = Math.sin(spin);
                const persp = 3.4;
                const bright = 1 + boost * 0.55;
                /* Точки: сортировка не нужна — alpha по глубине. */ for(let i = 0; i < nodes.length; i++){
                    const n = nodes[i];
                    /* Наклон оси вокруг X. */ const y1 = n.y * cosT - n.z * sinT;
                    const z1 = n.y * sinT + n.z * cosT;
                    /* Вращение вокруг Y. */ const x2 = n.x * cosA + z1 * sinA;
                    const z2 = -n.x * sinA + z1 * cosA;
                    const s = persp / (persp - z2);
                    const px = cx + x2 * radius * s;
                    const py = cy + y1 * radius * s;
                    /* Глубина: z2 от -1 (дальняя) до +1 (ближняя). */ const depth = (z2 + 1) / 2;
                    const alpha = (0.16 + depth * 0.78) * bright;
                    const size = (n.violet ? 1.5 : 1.1) * s * (0.75 + depth * 0.5);
                    if (n.violet) {
                        /* Фиолетовая «LED» с мягким ореолом. */ ctx.beginPath();
                        ctx.arc(px, py, size * 3.2, 0, Math.PI * 2);
                        ctx.fillStyle = `rgba(${VIOLET_RGB}, ${Math.min(0.28, alpha * 0.3)})`;
                        ctx.fill();
                        ctx.beginPath();
                        ctx.arc(px, py, size, 0, Math.PI * 2);
                        ctx.fillStyle = `rgba(${VIOLET_RGB}, ${Math.min(1, alpha)})`;
                        ctx.fill();
                    } else {
                        ctx.beginPath();
                        ctx.arc(px, py, size, 0, Math.PI * 2);
                        ctx.fillStyle = `rgba(255,255,255,${Math.min(1, alpha)})`;
                        ctx.fill();
                    }
                }
                /* Расходящиеся кольца по клику. */ for(let i = pulses.length - 1; i >= 0; i--){
                    const p = pulses[i];
                    p.t += dt;
                    const progress = p.t / 1.1;
                    if (progress >= 1) {
                        pulses.splice(i, 1);
                        continue;
                    }
                    ctx.beginPath();
                    ctx.arc(cx, cy, radius * (0.35 + progress * 1.55), 0, Math.PI * 2);
                    ctx.strokeStyle = `rgba(${VIOLET_RGB}, ${(1 - progress) * 0.45})`;
                    ctx.lineWidth = 1.2;
                    ctx.stroke();
                }
            };
            /* Основной цикл ------------------------------------------------------ */ let raf = 0;
            let last = performance.now();
            let visible = true;
            const tick = (now)=>{
                const dt = Math.min((now - last) / 1000, 0.05);
                last = now;
                /* Сглаженный параллакс курсора. */ parX += (parTX - parX) * 0.05;
                parY += (parTY - parY) * 0.05;
                boost = Math.max(0, boost - dt * 1.5);
                if (!dragging) {
                    /* Инерция раскрутки + плавный возврат наклона. */ angularVel += (BASE_VEL - angularVel) * Math.min(1, dt * 1.6);
                    tiltOffset += (0 - tiltOffset) * Math.min(1, dt * 2.2);
                }
                angle += angularVel * (1 + boost * 1.6) * dt;
                drawFrame(dt);
                raf = requestAnimationFrame(tick);
            };
            const updateLoop = ()=>{
                const should = visible && !document.hidden && !reducedMotion;
                if (should && !raf) {
                    last = performance.now();
                    raf = requestAnimationFrame(tick);
                } else if (!should && raf) {
                    cancelAnimationFrame(raf);
                    raf = 0;
                }
            };
            /* Взаимодействие ----------------------------------------------------- */ const onPointerMove = (e)=>{
                if (dragging) {
                    const dx = e.clientX - lastX;
                    const dy = e.clientY - lastY;
                    lastX = e.clientX;
                    lastY = e.clientY;
                    dragMoved += Math.abs(dx) + Math.abs(dy);
                    angle += dx * 0.006;
                    tiltOffset = Math.max(-0.55, Math.min(0.55, tiltOffset + dy * 0.004));
                    angularVel = Math.max(-2.4, Math.min(2.4, dx * 0.006 * 60));
                    return;
                }
                const r = host.getBoundingClientRect();
                parTX = ((e.clientX - r.left) / Math.max(1, r.width) - 0.5) * 2;
                parTY = ((e.clientY - r.top) / Math.max(1, r.height) - 0.5) * 2;
            };
            const onPointerDown = (e)=>{
                dragging = true;
                dragMoved = 0;
                lastX = e.clientX;
                lastY = e.clientY;
                host.style.cursor = 'grabbing';
            };
            const onPointerUp = ()=>{
                if (dragging && dragMoved < 8) {
                    /* Это был клик, а не драг — импульс. */ if (pulses.length < 2) pulses.push({
                        t: 0
                    });
                    boost = 1;
                }
                dragging = false;
                host.style.cursor = 'grab';
            };
            const onLeave = ()=>{
                parTX = 0;
                parTY = 0;
            };
            if (!reducedMotion) {
                window.addEventListener('pointermove', onPointerMove, {
                    passive: true
                });
                window.addEventListener('pointerup', onPointerUp, {
                    passive: true
                });
                host.addEventListener('pointerdown', onPointerDown);
                host.addEventListener('pointerleave', onLeave);
                host.style.cursor = 'grab';
            }
            const io = new IntersectionObserver((entries)=>{
                visible = entries[0]?.isIntersecting ?? true;
                updateLoop();
            }, {
                threshold: 0.05
            });
            io.observe(host);
            const onVis = ()=>updateLoop();
            document.addEventListener('visibilitychange', onVis);
            const ro = new ResizeObserver(resize);
            ro.observe(host);
            resize();
            cleanup = ()=>{
                if (raf) cancelAnimationFrame(raf);
                io.disconnect();
                ro.disconnect();
                if (!reducedMotion) {
                    window.removeEventListener('pointermove', onPointerMove);
                    window.removeEventListener('pointerup', onPointerUp);
                    host.removeEventListener('pointerdown', onPointerDown);
                    host.removeEventListener('pointerleave', onLeave);
                }
                document.removeEventListener('visibilitychange', onVis);
                canvas.remove();
            };
        } catch  {
            if (!disposed) setFailed(true);
        }
        return ()=>{
            disposed = true;
            cleanup();
        };
    }, []);
    if (failed) return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(DotSphereFallback, {
        className: className
    }, void 0, false, {
        fileName: "[project]/src/components/shared/dot-sphere.tsx",
        lineNumber: 311,
        columnNumber: 22
    }, this);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        ref: hostRef,
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])('relative', className),
        "aria-hidden": "true",
        role: "presentation"
    }, void 0, false, {
        fileName: "[project]/src/components/shared/dot-sphere.tsx",
        lineNumber: 314,
        columnNumber: 5
    }, this);
}
/* Базовые константы сцены объявлены рядом с NODE_COUNT. */ /* CSS-фолбэк, если canvas недоступен — статичная dot-матрица. */ function DotSphereFallback({ className }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])('relative flex items-center justify-center', className),
        "aria-hidden": "true",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "animate-pulse-glow absolute h-56 w-56 rounded-full bg-[#a855f7]/10 blur-2xl"
            }, void 0, false, {
                fileName: "[project]/src/components/shared/dot-sphere.tsx",
                lineNumber: 329,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "dot-grid-violet h-44 w-44 rounded-full opacity-70",
                style: {
                    maskImage: 'radial-gradient(circle, black 30%, transparent 72%)'
                }
            }, void 0, false, {
                fileName: "[project]/src/components/shared/dot-sphere.tsx",
                lineNumber: 330,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/shared/dot-sphere.tsx",
        lineNumber: 328,
        columnNumber: 5
    }, this);
}
}),
"[project]/src/components/shared/interactive.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "CountUp",
    ()=>CountUp,
    "CursorHalo",
    ()=>CursorHalo,
    "InteractiveCard",
    ()=>InteractiveCard,
    "Magnetic",
    ()=>Magnetic
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/framer-motion/dist/es/render/components/motion/proxy.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$utils$2f$use$2d$in$2d$view$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/framer-motion/dist/es/utils/use-in-view.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$value$2f$use$2d$motion$2d$value$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/framer-motion/dist/es/value/use-motion-value.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$value$2f$use$2d$spring$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/framer-motion/dist/es/value/use-spring.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$value$2f$use$2d$transform$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/framer-motion/dist/es/value/use-transform.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/utils.ts [app-ssr] (ecmascript)");
'use client';
;
;
;
;
function CursorHalo({ className }) {
    const x = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$value$2f$use$2d$motion$2d$value$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMotionValue"])(-600);
    const y = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$value$2f$use$2d$motion$2d$value$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMotionValue"])(-600);
    const sx = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$value$2f$use$2d$spring$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useSpring"])(x, {
        stiffness: 70,
        damping: 20,
        mass: 0.6
    });
    const sy = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$value$2f$use$2d$spring$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useSpring"])(y, {
        stiffness: 70,
        damping: 20,
        mass: 0.6
    });
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if ("TURBOPACK compile-time truthy", 1) return;
        //TURBOPACK unreachable
        ;
        const move = undefined;
    }, [
        x,
        y
    ]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["motion"].div, {
        "aria-hidden": "true",
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])('pointer-events-none fixed left-0 top-0 z-[35] hidden md:block', className),
        style: {
            x: sx,
            y: sy
        },
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "h-[440px] w-[440px] -translate-x-1/2 -translate-y-1/2 rounded-full",
            style: {
                background: 'radial-gradient(circle, rgba(255,255,255,0.085) 0%, rgba(255,255,255,0.03) 38%, transparent 62%)'
            }
        }, void 0, false, {
            fileName: "[project]/src/components/shared/interactive.tsx",
            lineNumber: 35,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/src/components/shared/interactive.tsx",
        lineNumber: 30,
        columnNumber: 5
    }, this);
}
function Magnetic({ children, className, strength = 0.26 }) {
    const ref = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    const x = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$value$2f$use$2d$motion$2d$value$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMotionValue"])(0);
    const y = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$value$2f$use$2d$motion$2d$value$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMotionValue"])(0);
    const sx = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$value$2f$use$2d$spring$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useSpring"])(x, {
        stiffness: 210,
        damping: 15,
        mass: 0.4
    });
    const sy = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$value$2f$use$2d$spring$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useSpring"])(y, {
        stiffness: 210,
        damping: 15,
        mass: 0.4
    });
    const onMove = (e)=>{
        const el = ref.current;
        if (!el) return;
        const r = el.getBoundingClientRect();
        x.set((e.clientX - (r.left + r.width / 2)) * strength);
        y.set((e.clientY - (r.top + r.height / 2)) * strength);
    };
    const reset = ()=>{
        x.set(0);
        y.set(0);
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["motion"].span, {
        ref: ref,
        onMouseMove: onMove,
        onMouseLeave: reset,
        style: {
            x: sx,
            y: sy
        },
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])('inline-block will-change-transform', className),
        children: children
    }, void 0, false, {
        fileName: "[project]/src/components/shared/interactive.tsx",
        lineNumber: 77,
        columnNumber: 5
    }, this);
}
function InteractiveCard({ children, className, max = 7 }) {
    const ref = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    const mx = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$value$2f$use$2d$motion$2d$value$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMotionValue"])(0.5);
    const my = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$value$2f$use$2d$motion$2d$value$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMotionValue"])(0.5);
    const rx = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$value$2f$use$2d$spring$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useSpring"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$value$2f$use$2d$transform$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useTransform"])(my, [
        0,
        1
    ], [
        max,
        -max
    ]), {
        stiffness: 190,
        damping: 18
    });
    const ry = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$value$2f$use$2d$spring$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useSpring"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$value$2f$use$2d$transform$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useTransform"])(mx, [
        0,
        1
    ], [
        -max,
        max
    ]), {
        stiffness: 190,
        damping: 18
    });
    const onMove = (e)=>{
        const el = ref.current;
        if (!el) return;
        const r = el.getBoundingClientRect();
        mx.set((e.clientX - r.left) / Math.max(1, r.width));
        my.set((e.clientY - r.top) / Math.max(1, r.height));
        el.style.setProperty('--sx', `${e.clientX - r.left}px`);
        el.style.setProperty('--sy', `${e.clientY - r.top}px`);
    };
    const reset = ()=>{
        mx.set(0.5);
        my.set(0.5);
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        ref: ref,
        onPointerMove: onMove,
        onPointerLeave: reset,
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])('spot-card relative [perspective:900px]', className),
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["motion"].div, {
            style: {
                rotateX: rx,
                rotateY: ry,
                transformStyle: 'preserve-3d'
            },
            className: "h-full w-full will-change-transform",
            children: children
        }, void 0, false, {
            fileName: "[project]/src/components/shared/interactive.tsx",
            lineNumber: 129,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/src/components/shared/interactive.tsx",
        lineNumber: 123,
        columnNumber: 5
    }, this);
}
function CountUp({ to, pad = 2, duration = 1.4, className }) {
    const ref = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    const inView = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$utils$2f$use$2d$in$2d$view$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useInView"])(ref, {
        once: true,
        margin: '-10% 0px'
    });
    const [val, setVal] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(0);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if (!inView) return;
        let raf = 0;
        const t0 = performance.now();
        const step = (t)=>{
            const p = Math.min(1, (t - t0) / (duration * 1000));
            const eased = 1 - Math.pow(1 - p, 3);
            setVal(Math.round(to * eased));
            if (p < 1) raf = requestAnimationFrame(step);
        };
        raf = requestAnimationFrame(step);
        return ()=>cancelAnimationFrame(raf);
    }, [
        inView,
        to,
        duration
    ]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
        ref: ref,
        className: className,
        children: String(val).padStart(pad, '0')
    }, void 0, false, {
        fileName: "[project]/src/components/shared/interactive.tsx",
        lineNumber: 172,
        columnNumber: 5
    }, this);
}
}),
"[project]/src/components/shared/smooth-scroll.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "SmoothScroll",
    ()=>SmoothScroll
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lenis$2f$dist$2f$lenis$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/lenis/dist/lenis.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
'use client';
;
;
function SmoothScroll() {
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        const lenis = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lenis$2f$dist$2f$lenis$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"]({
            lerp: 0.12,
            smoothWheel: true
        });
        let frame = 0;
        const loop = (time)=>{
            lenis.raf(time);
            frame = requestAnimationFrame(loop);
        };
        frame = requestAnimationFrame(loop);
        return ()=>{
            cancelAnimationFrame(frame);
            lenis.destroy();
        };
    }, []);
    return null;
}
}),
"[project]/src/components/shared/ui-kit.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Avatar",
    ()=>Avatar,
    "Coin",
    ()=>Coin,
    "CoinAmount",
    ()=>CoinAmount,
    "EmptyState",
    ()=>EmptyState,
    "LoadingBlock",
    ()=>LoadingBlock,
    "PageHeader",
    ()=>PageHeader,
    "SectionTitle",
    ()=>SectionTitle,
    "StatCard",
    ()=>StatCard,
    "StatusBadge",
    ()=>StatusBadge
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/framer-motion/dist/es/render/components/motion/proxy.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$arrow$2d$left$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__ArrowLeft$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/arrow-left.js [app-ssr] (ecmascript) <export default as ArrowLeft>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$inbox$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Inbox$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/inbox.js [app-ssr] (ecmascript) <export default as Inbox>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$router$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/router.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$format$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/format.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/utils.ts [app-ssr] (ecmascript)");
'use client';
;
;
;
;
;
;
function Coin({ className }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
        viewBox: "0 0 24 24",
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])('h-4 w-4 shrink-0', className),
        "aria-hidden": "true",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("defs", {
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("linearGradient", {
                    id: "dotify-coin-gradient",
                    x1: "5",
                    y1: "4",
                    x2: "19",
                    y2: "20",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("stop", {
                            offset: "0%",
                            stopColor: "#fcd34d"
                        }, void 0, false, {
                            fileName: "[project]/src/components/shared/ui-kit.tsx",
                            lineNumber: 19,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("stop", {
                            offset: "55%",
                            stopColor: "#f5b52e"
                        }, void 0, false, {
                            fileName: "[project]/src/components/shared/ui-kit.tsx",
                            lineNumber: 20,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("stop", {
                            offset: "100%",
                            stopColor: "#d97706"
                        }, void 0, false, {
                            fileName: "[project]/src/components/shared/ui-kit.tsx",
                            lineNumber: 21,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/shared/ui-kit.tsx",
                    lineNumber: 18,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/components/shared/ui-kit.tsx",
                lineNumber: 17,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                cx: "12",
                cy: "12",
                r: "10",
                fill: "url(#dotify-coin-gradient)"
            }, void 0, false, {
                fileName: "[project]/src/components/shared/ui-kit.tsx",
                lineNumber: 24,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                cx: "12",
                cy: "12",
                r: "7.4",
                fill: "none",
                stroke: "rgba(120,53,15,0.4)",
                strokeWidth: "1.4",
                strokeDasharray: "2.4 2.4"
            }, void 0, false, {
                fileName: "[project]/src/components/shared/ui-kit.tsx",
                lineNumber: 25,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                d: "M12 6.6l1.5 3.4 3.7.45-2.75 2.4.85 3.65L12 14.55 8.7 16.5l.85-3.65L6.8 10.45l3.7-.45z",
                fill: "rgba(120,53,15,0.55)"
            }, void 0, false, {
                fileName: "[project]/src/components/shared/ui-kit.tsx",
                lineNumber: 26,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/shared/ui-kit.tsx",
        lineNumber: 16,
        columnNumber: 5
    }, this);
}
function CoinAmount({ value, className, iconClassName }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])('inline-flex items-center gap-1.5 font-medium', className),
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(Coin, {
                className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])('h-4 w-4', iconClassName)
            }, void 0, false, {
                fileName: "[project]/src/components/shared/ui-kit.tsx",
                lineNumber: 45,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                className: "tabular-nums-tight",
                children: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$format$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatCoins"])(value)
            }, void 0, false, {
                fileName: "[project]/src/components/shared/ui-kit.tsx",
                lineNumber: 46,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/shared/ui-kit.tsx",
        lineNumber: 44,
        columnNumber: 5
    }, this);
}
/* ------------------------------------------------------------------ */ /* Avatar (initials fallback with deterministic accent gradient)       */ /* ------------------------------------------------------------------ */ const AVATAR_PALETTES = [
    'from-zinc-400 to-zinc-600',
    'from-zinc-500 to-zinc-700',
    'from-zinc-600 to-zinc-800',
    'from-zinc-700 to-zinc-900',
    'from-neutral-500 to-neutral-700',
    'from-neutral-600 to-neutral-800'
];
function Avatar({ user, size = 40, className }) {
    const hasImage = Boolean(user.avatarUrl);
    const palette = AVATAR_PALETTES[Math.abs(user.id ?? 0) % AVATAR_PALETTES.length];
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])('relative inline-flex shrink-0 select-none items-center justify-center overflow-hidden rounded-full', !hasImage && `bg-gradient-to-br ${palette}`, className),
        style: {
            width: size,
            height: size
        },
        "aria-hidden": "true",
        children: hasImage ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
            src: user.avatarUrl,
            alt: `${user.firstName} ${user.lastName}`,
            className: "h-full w-full object-cover"
        }, void 0, false, {
            fileName: "[project]/src/components/shared/ui-kit.tsx",
            lineNumber: 86,
            columnNumber: 9
        }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
            className: "font-display font-semibold text-white/90",
            style: {
                fontSize: Math.max(11, size * 0.36)
            },
            children: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$format$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["initials"])(user.firstName, user.lastName)
        }, void 0, false, {
            fileName: "[project]/src/components/shared/ui-kit.tsx",
            lineNumber: 88,
            columnNumber: 9
        }, this)
    }, void 0, false, {
        fileName: "[project]/src/components/shared/ui-kit.tsx",
        lineNumber: 76,
        columnNumber: 5
    }, this);
}
function PageHeader({ title, description, backHref, actions, accent }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["motion"].div, {
        initial: {
            opacity: 0,
            y: 14
        },
        animate: {
            opacity: 1,
            y: 0
        },
        transition: {
            duration: 0.45,
            ease: [
                0.2,
                0.8,
                0.2,
                1
            ]
        },
        className: "mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                children: [
                    backHref && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$router$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Link"], {
                        href: backHref,
                        className: "mb-3 inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$arrow$2d$left$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__ArrowLeft$3e$__["ArrowLeft"], {
                                className: "h-4 w-4"
                            }, void 0, false, {
                                fileName: "[project]/src/components/shared/ui-kit.tsx",
                                lineNumber: 129,
                                columnNumber: 13
                            }, this),
                            "Назад"
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/shared/ui-kit.tsx",
                        lineNumber: 125,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])('font-display text-2xl font-bold leading-tight sm:text-4xl', accent),
                        children: title
                    }, void 0, false, {
                        fileName: "[project]/src/components/shared/ui-kit.tsx",
                        lineNumber: 133,
                        columnNumber: 9
                    }, this),
                    description && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "mt-2 max-w-2xl text-sm text-muted-foreground sm:text-base",
                        children: description
                    }, void 0, false, {
                        fileName: "[project]/src/components/shared/ui-kit.tsx",
                        lineNumber: 136,
                        columnNumber: 25
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/shared/ui-kit.tsx",
                lineNumber: 123,
                columnNumber: 7
            }, this),
            actions && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex flex-wrap items-center gap-2",
                children: actions
            }, void 0, false, {
                fileName: "[project]/src/components/shared/ui-kit.tsx",
                lineNumber: 138,
                columnNumber: 19
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/shared/ui-kit.tsx",
        lineNumber: 117,
        columnNumber: 5
    }, this);
}
function SectionTitle({ children, className }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])('font-display text-lg font-semibold tracking-tight sm:text-xl', className),
        children: children
    }, void 0, false, {
        fileName: "[project]/src/components/shared/ui-kit.tsx",
        lineNumber: 145,
        columnNumber: 5
    }, this);
}
function EmptyState({ icon, title, description, action }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "panel flex flex-col items-center justify-center gap-3 px-6 py-14 text-center",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                className: "flex h-12 w-12 items-center justify-center rounded-full bg-white/5 text-muted-foreground",
                children: icon ?? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$inbox$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Inbox$3e$__["Inbox"], {
                    className: "h-5 w-5"
                }, void 0, false, {
                    fileName: "[project]/src/components/shared/ui-kit.tsx",
                    lineNumber: 169,
                    columnNumber: 18
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/components/shared/ui-kit.tsx",
                lineNumber: 168,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "font-medium",
                        children: title
                    }, void 0, false, {
                        fileName: "[project]/src/components/shared/ui-kit.tsx",
                        lineNumber: 172,
                        columnNumber: 9
                    }, this),
                    description && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "mt-1 text-sm text-muted-foreground",
                        children: description
                    }, void 0, false, {
                        fileName: "[project]/src/components/shared/ui-kit.tsx",
                        lineNumber: 173,
                        columnNumber: 25
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/shared/ui-kit.tsx",
                lineNumber: 171,
                columnNumber: 7
            }, this),
            action
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/shared/ui-kit.tsx",
        lineNumber: 167,
        columnNumber: 5
    }, this);
}
function LoadingBlock({ label = 'Загружаем данные...' }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "flex flex-col items-center justify-center gap-3 py-16 text-muted-foreground",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                className: "relative flex h-9 w-9",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "absolute inset-0 animate-ping rounded-full bg-primary/20"
                    }, void 0, false, {
                        fileName: "[project]/src/components/shared/ui-kit.tsx",
                        lineNumber: 184,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "absolute inset-1 rounded-full border-2 border-primary border-t-transparent animate-spin"
                    }, void 0, false, {
                        fileName: "[project]/src/components/shared/ui-kit.tsx",
                        lineNumber: 185,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/shared/ui-kit.tsx",
                lineNumber: 183,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                className: "text-sm",
                children: label
            }, void 0, false, {
                fileName: "[project]/src/components/shared/ui-kit.tsx",
                lineNumber: 187,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/shared/ui-kit.tsx",
        lineNumber: 182,
        columnNumber: 5
    }, this);
}
function StatCard({ icon, label, value, hint, valueClassName }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["motion"].div, {
        initial: {
            opacity: 0,
            y: 12
        },
        animate: {
            opacity: 1,
            y: 0
        },
        transition: {
            duration: 0.4,
            ease: [
                0.2,
                0.8,
                0.2,
                1
            ]
        },
        className: "panel panel-hover p-5",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex items-center gap-2 text-muted-foreground",
                children: [
                    icon,
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "text-xs font-medium uppercase tracking-wider",
                        children: label
                    }, void 0, false, {
                        fileName: "[project]/src/components/shared/ui-kit.tsx",
                        lineNumber: 214,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/shared/ui-kit.tsx",
                lineNumber: 212,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])('mt-3 font-display text-2xl font-bold', valueClassName),
                children: value
            }, void 0, false, {
                fileName: "[project]/src/components/shared/ui-kit.tsx",
                lineNumber: 216,
                columnNumber: 7
            }, this),
            hint && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "mt-1 text-xs text-muted-foreground",
                children: hint
            }, void 0, false, {
                fileName: "[project]/src/components/shared/ui-kit.tsx",
                lineNumber: 217,
                columnNumber: 16
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/shared/ui-kit.tsx",
        lineNumber: 206,
        columnNumber: 5
    }, this);
}
function StatusBadge({ status, className }) {
    const map = {
        open: {
            label: 'Открыта',
            cls: 'bg-emerald-400/10 text-emerald-300 border-emerald-400/25'
        },
        in_progress: {
            label: 'В работе',
            cls: 'bg-white/10 text-white border-white/25'
        },
        submitted: {
            label: 'На проверке',
            cls: 'bg-white/10 text-neutral-200 border-white/20'
        },
        completed: {
            label: 'Выполнено',
            cls: 'bg-primary/10 text-primary border-primary/30'
        },
        cancelled: {
            label: 'Отменена',
            cls: 'bg-[#a855f7]/10 text-[#c084fc] border-[#a855f7]/30'
        },
        active: {
            label: 'Активен',
            cls: 'bg-emerald-400/10 text-emerald-300 border-emerald-400/25'
        },
        finished: {
            label: 'Завершён',
            cls: 'bg-white/5 text-muted-foreground border-white/15'
        },
        new: {
            label: 'Новый',
            cls: 'bg-white/10 text-white border-white/25'
        },
        processing: {
            label: 'В обработке',
            cls: 'bg-white/10 text-neutral-200 border-white/20'
        }
    };
    const item = map[status] ?? {
        label: status,
        cls: 'bg-white/5 text-muted-foreground border-white/15'
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])('inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium', item.cls, className),
        children: item.label
    }, void 0, false, {
        fileName: "[project]/src/components/shared/ui-kit.tsx",
        lineNumber: 242,
        columnNumber: 5
    }, this);
}
}),
];

//# sourceMappingURL=src_components_shared_0udqk5viarms8._.js.map