(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/src/app/contact/page.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>ContactPage
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/compiler-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/client/app-dir/link.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$fi$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react-icons/fi/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/image.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature();
'use client';
;
;
;
;
;
const developers = [
    {
        id: 1,
        name: 'Divyansh Jain',
        role: 'Team Lead & Database Engineer',
        avatar: '/Divyansh.jpeg',
        bio: 'Nothing changes is nothing changes.',
        email: 'b23397@students.iitmandi.ac.in',
        expertise: [
            'PostgreSQL',
            'Cloudinary',
            'Database Security',
            'Cloud Storage',
            'Data Migration'
        ],
        color: 'yellow'
    },
    {
        id: 2,
        name: 'Siddhi Pogakwar',
        role: 'Frontend Developer',
        avatar: '/Siddhi.jpeg',
        bio: 'I`m Siddhi from the Maths and Computing branch 👋. I like painting and photography, and capturing moments that tell a story. Also enjoy spending time being creative and noticing the little details around me ✨',
        email: 'b23415@students.iitmandi.ac.in',
        expertise: [
            'Next.js',
            'TypeScript',
            'Tailwind CSS',
            'Responsive Design',
            'Component Architecture'
        ],
        color: 'pink'
    },
    {
        id: 3,
        name: 'Anamika Godara',
        role: 'Database Engineer',
        avatar: '/Anamika.jpeg',
        bio: 'Working with Data and Databases.',
        email: 'b23428@students.iitmandi.ac.in',
        expertise: [
            'PostgreSQL',
            'Database Design',
            'Query Optimization',
            'Data Modeling',
            'Supabase'
        ],
        color: 'green'
    },
    {
        id: 4,
        name: 'Vyom Thacker',
        role: 'Frontend Developer',
        avatar: '/Vyom.jpeg',
        bio: 'Find What you Love and Let it Kill you.',
        email: 'b23417@students.iitmandi.ac.in',
        expertise: [
            'Next.js',
            'TypeScript',
            'Tailwind CSS',
            'Responsive Design',
            'Component Architecture'
        ],
        color: 'blue'
    },
    {
        id: 5,
        name: 'Raj Maurya',
        role: 'Backend Developer',
        avatar: '/Raj.jpeg',
        bio: 'I do, What I do.',
        email: 'b23406@students.iitmandi.ac.in',
        expertise: [
            'Express.js',
            'Socket.io',
            'Real-time Communication',
            'Redis'
        ],
        color: 'purple'
    }
];
function useDarkMode() {
    _s();
    const $ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["c"])(6);
    if ($[0] !== "af1f08482613cd607203cad66ee531d0f9b7d8add7076d85dcf52fdd11c9fb56") {
        for(let $i = 0; $i < 6; $i += 1){
            $[$i] = Symbol.for("react.memo_cache_sentinel");
        }
        $[0] = "af1f08482613cd607203cad66ee531d0f9b7d8add7076d85dcf52fdd11c9fb56";
    }
    const [dark, setDark] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(_useDarkModeUseState);
    let t0;
    let t1;
    if ($[1] !== dark) {
        t0 = ({
            "useDarkMode[useEffect()]": ()=>{
                if (dark) {
                    document.documentElement.classList.add("dark");
                    localStorage.setItem("theme", "dark");
                } else {
                    document.documentElement.classList.remove("dark");
                    localStorage.setItem("theme", "light");
                }
            }
        })["useDarkMode[useEffect()]"];
        t1 = [
            dark
        ];
        $[1] = dark;
        $[2] = t0;
        $[3] = t1;
    } else {
        t0 = $[2];
        t1 = $[3];
    }
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])(t0, t1);
    let t2;
    if ($[4] !== dark) {
        t2 = [
            dark,
            setDark
        ];
        $[4] = dark;
        $[5] = t2;
    } else {
        t2 = $[5];
    }
    return t2;
}
_s(useDarkMode, "OTrU7GZaexvU4EZ5GasBjB22Q3k=");
function _useDarkModeUseState() {
    if ("TURBOPACK compile-time truthy", 1) {
        return localStorage.getItem("theme") === "dark";
    }
    //TURBOPACK unreachable
    ;
}
const techStack = [
    {
        name: 'Next.js',
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$fi$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FiZap"],
        desc: 'Frontend framework',
        color: 'bg-surface-container-high'
    },
    {
        name: 'Node.js',
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$fi$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FiLayers"],
        desc: 'Backend runtime',
        color: 'bg-green-500/10'
    },
    {
        name: 'PostgreSQL',
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$fi$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FiDatabase"],
        desc: 'Database',
        color: 'bg-blue-500/10'
    },
    {
        name: 'Socket.io',
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$fi$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FiMessageSquare"],
        desc: 'Real-time events',
        color: 'bg-amber-500/10'
    },
    {
        name: 'Tailwind CSS',
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$fi$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FiLayers"],
        desc: 'Styling',
        color: 'bg-cyan-500/10'
    },
    {
        name: 'TypeScript',
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$fi$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FiCode"],
        desc: 'Type safety',
        color: 'bg-blue-500/10'
    }
];
function ContactPage() {
    _s1();
    const $ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["c"])(28);
    if ($[0] !== "af1f08482613cd607203cad66ee531d0f9b7d8add7076d85dcf52fdd11c9fb56") {
        for(let $i = 0; $i < 28; $i += 1){
            $[$i] = Symbol.for("react.memo_cache_sentinel");
        }
        $[0] = "af1f08482613cd607203cad66ee531d0f9b7d8add7076d85dcf52fdd11c9fb56";
    }
    const [dark, setDark] = useDarkMode();
    let t0;
    if ($[1] === Symbol.for("react.memo_cache_sentinel")) {
        t0 = {
            background: "var(--primary)"
        };
        $[1] = t0;
    } else {
        t0 = $[1];
    }
    let t1;
    if ($[2] === Symbol.for("react.memo_cache_sentinel")) {
        t1 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "w-8 h-8 sm:w-9 sm:h-9 rounded-xl flex items-center justify-center",
            style: t0,
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                className: "w-4 h-4 sm:w-5 sm:h-5 text-white",
                fill: "none",
                stroke: "currentColor",
                viewBox: "0 0 24 24",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                    strokeLinecap: "round",
                    strokeLinejoin: "round",
                    strokeWidth: 2.5,
                    d: "M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                }, void 0, false, {
                    fileName: "[project]/src/app/contact/page.tsx",
                    lineNumber: 163,
                    columnNumber: 208
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/app/contact/page.tsx",
                lineNumber: 163,
                columnNumber: 104
            }, this)
        }, void 0, false, {
            fileName: "[project]/src/app/contact/page.tsx",
            lineNumber: 163,
            columnNumber: 10
        }, this);
        $[2] = t1;
    } else {
        t1 = $[2];
    }
    let t2;
    if ($[3] === Symbol.for("react.memo_cache_sentinel")) {
        t2 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
            href: "/",
            className: "flex items-center gap-2 hover:opacity-80 transition-opacity",
            children: [
                t1,
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                    className: "text-lg sm:text-xl font-bold text-on-surface",
                    children: [
                        "Byte",
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            className: "text-primary",
                            children: "Chat"
                        }, void 0, false, {
                            fileName: "[project]/src/app/contact/page.tsx",
                            lineNumber: 170,
                            columnNumber: 168
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/app/contact/page.tsx",
                    lineNumber: 170,
                    columnNumber: 101
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/src/app/contact/page.tsx",
            lineNumber: 170,
            columnNumber: 10
        }, this);
        $[3] = t2;
    } else {
        t2 = $[3];
    }
    const t3 = dark ? "Switch to light mode" : "Switch to dark mode";
    let t4;
    if ($[4] !== setDark) {
        t4 = ({
            "ContactPage[<button>.onClick]": ()=>setDark(_ContactPageButtonOnClickSetDark)
        })["ContactPage[<button>.onClick]"];
        $[4] = setDark;
        $[5] = t4;
    } else {
        t4 = $[5];
    }
    let t5;
    if ($[6] === Symbol.for("react.memo_cache_sentinel")) {
        t5 = {
            width: 40,
            height: 40,
            borderRadius: "50%",
            border: "2px solid var(--outline)",
            background: "var(--surface-container)"
        };
        $[6] = t5;
    } else {
        t5 = $[6];
    }
    let t6;
    if ($[7] === Symbol.for("react.memo_cache_sentinel")) {
        t6 = {
            color: "var(--primary)"
        };
        $[7] = t6;
    } else {
        t6 = $[7];
    }
    const t7 = dark ? "light_mode" : "dark_mode";
    let t8;
    if ($[8] !== t7) {
        t8 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
            className: "material-symbols-outlined text-2xl",
            style: t6,
            children: t7
        }, void 0, false, {
            fileName: "[project]/src/app/contact/page.tsx",
            lineNumber: 211,
            columnNumber: 10
        }, this);
        $[8] = t7;
        $[9] = t8;
    } else {
        t8 = $[9];
    }
    let t9;
    if ($[10] !== t3 || $[11] !== t4 || $[12] !== t8) {
        t9 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("nav", {
            className: "glass-nav fixed top-0 w-full z-50",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "max-w-7xl mx-auto px-4 sm:px-8 h-14 sm:h-16 flex items-center justify-between",
                children: [
                    t2,
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        "aria-label": t3,
                        className: "flex items-center justify-center transition-colors focus:outline-none focus:ring-2 focus:ring-primary",
                        onClick: t4,
                        style: t5,
                        children: t8
                    }, void 0, false, {
                        fileName: "[project]/src/app/contact/page.tsx",
                        lineNumber: 219,
                        columnNumber: 160
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/app/contact/page.tsx",
                lineNumber: 219,
                columnNumber: 61
            }, this)
        }, void 0, false, {
            fileName: "[project]/src/app/contact/page.tsx",
            lineNumber: 219,
            columnNumber: 10
        }, this);
        $[10] = t3;
        $[11] = t4;
        $[12] = t8;
        $[13] = t9;
    } else {
        t9 = $[13];
    }
    let t10;
    if ($[14] === Symbol.for("react.memo_cache_sentinel")) {
        t10 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "fixed inset-0 pointer-events-none -z-10 overflow-hidden",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "absolute top-[-10%] right-[-5%] w-96 h-96 bg-linear-to-br from-primary-container/20 to-transparent rounded-full blur-3xl"
                }, void 0, false, {
                    fileName: "[project]/src/app/contact/page.tsx",
                    lineNumber: 229,
                    columnNumber: 84
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "absolute bottom-[-10%] left-[-5%] w-80 h-80 bg-linear-to-tr from-tertiary-container/15 to-transparent rounded-full blur-3xl"
                }, void 0, false, {
                    fileName: "[project]/src/app/contact/page.tsx",
                    lineNumber: 229,
                    columnNumber: 224
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "absolute top-1/3 left-1/2 -translate-x-1/2 w-72 h-72 bg-linear-to-br from-secondary-container/10 to-transparent rounded-full blur-3xl"
                }, void 0, false, {
                    fileName: "[project]/src/app/contact/page.tsx",
                    lineNumber: 229,
                    columnNumber: 367
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/src/app/contact/page.tsx",
            lineNumber: 229,
            columnNumber: 11
        }, this);
        $[14] = t10;
    } else {
        t10 = $[14];
    }
    let t11;
    if ($[15] === Symbol.for("react.memo_cache_sentinel")) {
        t11 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "text-center mb-8 sm:mb-12 animate-fade-in",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 rounded-3xl bg-linear-to-br from-primary-container via-secondary-container to-tertiary-container mb-4 sm:mb-6 shadow-lg",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$fi$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FiUsers"], {
                        className: "w-8 h-8 sm:w-10 sm:h-10 text-on-primary-container"
                    }, void 0, false, {
                        fileName: "[project]/src/app/contact/page.tsx",
                        lineNumber: 236,
                        columnNumber: 273
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/src/app/contact/page.tsx",
                    lineNumber: 236,
                    columnNumber: 70
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                    className: "text-3xl sm:text-4xl md:text-5xl font-extrabold mb-2 sm:mb-3 text-on-surface",
                    children: "Meet Our Team"
                }, void 0, false, {
                    fileName: "[project]/src/app/contact/page.tsx",
                    lineNumber: 236,
                    columnNumber: 352
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                    className: "text-sm max-w-lg mx-auto leading-relaxed text-on-surface-variant px-2",
                    children: "BYTE-CHAT is built by a passionate team of IIT Mandi students. Meet the people behind the platform."
                }, void 0, false, {
                    fileName: "[project]/src/app/contact/page.tsx",
                    lineNumber: 236,
                    columnNumber: 463
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/src/app/contact/page.tsx",
            lineNumber: 236,
            columnNumber: 11
        }, this);
        $[15] = t11;
    } else {
        t11 = $[15];
    }
    let t12;
    if ($[16] === Symbol.for("react.memo_cache_sentinel")) {
        t12 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10",
            children: developers.map(_ContactPageDevelopersMap)
        }, void 0, false, {
            fileName: "[project]/src/app/contact/page.tsx",
            lineNumber: 243,
            columnNumber: 11
        }, this);
        $[16] = t12;
    } else {
        t12 = $[16];
    }
    let t13;
    let t14;
    if ($[17] === Symbol.for("react.memo_cache_sentinel")) {
        t13 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "flex items-center gap-3 mb-5",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "w-10 h-10 rounded-xl bg-primary-container flex items-center justify-center",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$fi$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FiCode"], {
                        className: "w-5 h-5 text-on-primary-container"
                    }, void 0, false, {
                        fileName: "[project]/src/app/contact/page.tsx",
                        lineNumber: 251,
                        columnNumber: 149
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/src/app/contact/page.tsx",
                    lineNumber: 251,
                    columnNumber: 57
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                    className: "text-xl font-bold text-on-surface",
                    children: "About the Project"
                }, void 0, false, {
                    fileName: "[project]/src/app/contact/page.tsx",
                    lineNumber: 251,
                    columnNumber: 211
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/src/app/contact/page.tsx",
            lineNumber: 251,
            columnNumber: 11
        }, this);
        t14 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
            className: "text-sm leading-relaxed mb-5 text-on-surface-variant",
            children: "BYTE-CHAT is a campus social platform built exclusively for IIT Mandi students. It provides a safe space for students to connect, communicate, and collaborate."
        }, void 0, false, {
            fileName: "[project]/src/app/contact/page.tsx",
            lineNumber: 252,
            columnNumber: 11
        }, this);
        $[17] = t13;
        $[18] = t14;
    } else {
        t13 = $[17];
        t14 = $[18];
    }
    let t15;
    if ($[19] === Symbol.for("react.memo_cache_sentinel")) {
        t15 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "glass-strong rounded-3xl p-6 sm:p-8 border border-white/10 dark:border-white/5",
            children: [
                t13,
                t14,
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "grid grid-cols-1 sm:grid-cols-2 gap-3",
                    children: [
                        "Secure, college-only authentication",
                        "Real-time messaging and group chats",
                        "Anonymous chat features",
                        "Profile and group management"
                    ].map(_ContactPageAnonymous)
                }, void 0, false, {
                    fileName: "[project]/src/app/contact/page.tsx",
                    lineNumber: 261,
                    columnNumber: 117
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/src/app/contact/page.tsx",
            lineNumber: 261,
            columnNumber: 11
        }, this);
        $[19] = t15;
    } else {
        t15 = $[19];
    }
    let t16;
    let t17;
    if ($[20] === Symbol.for("react.memo_cache_sentinel")) {
        t16 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "flex items-center gap-3 mb-5",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "w-10 h-10 rounded-xl bg-secondary-container flex items-center justify-center",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$fi$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FiGithub"], {
                        className: "w-5 h-5 text-on-secondary-container"
                    }, void 0, false, {
                        fileName: "[project]/src/app/contact/page.tsx",
                        lineNumber: 269,
                        columnNumber: 151
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/src/app/contact/page.tsx",
                    lineNumber: 269,
                    columnNumber: 57
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                    className: "text-xl font-bold text-on-surface",
                    children: "Get in Touch"
                }, void 0, false, {
                    fileName: "[project]/src/app/contact/page.tsx",
                    lineNumber: 269,
                    columnNumber: 217
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/src/app/contact/page.tsx",
            lineNumber: 269,
            columnNumber: 11
        }, this);
        t17 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
            className: "text-sm leading-relaxed mb-5 text-on-surface-variant",
            children: "Have questions, suggestions, or want to collaborate? Reach out to us!"
        }, void 0, false, {
            fileName: "[project]/src/app/contact/page.tsx",
            lineNumber: 270,
            columnNumber: 11
        }, this);
        $[20] = t16;
        $[21] = t17;
    } else {
        t16 = $[20];
        t17 = $[21];
    }
    let t18;
    if ($[22] === Symbol.for("react.memo_cache_sentinel")) {
        t18 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "grid grid-cols-1 md:grid-cols-2 gap-6 mb-10",
            children: [
                t15,
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "glass-strong rounded-3xl p-6 sm:p-8 border border-white/10 dark:border-white/5",
                    children: [
                        t16,
                        t17,
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "space-y-3",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                                    href: "contact@bytechat.in",
                                    className: "btn-romance flex items-center justify-center gap-2 py-2.5 text-sm font-semibold rounded-xl",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$fi$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FiMail"], {
                                            className: "w-4 h-4"
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/contact/page.tsx",
                                            lineNumber: 279,
                                            columnNumber: 343
                                        }, this),
                                        "Send us an Email"
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/app/contact/page.tsx",
                                    lineNumber: 279,
                                    columnNumber: 210
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                    href: "/impress-us",
                                    className: "btn-ghost flex items-center justify-center gap-2 py-2.5 text-sm rounded-xl border border-outline-variant/30",
                                    children: "✨ Impress Us"
                                }, void 0, false, {
                                    fileName: "[project]/src/app/contact/page.tsx",
                                    lineNumber: 279,
                                    columnNumber: 393
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/app/contact/page.tsx",
                            lineNumber: 279,
                            columnNumber: 183
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/app/contact/page.tsx",
                    lineNumber: 279,
                    columnNumber: 77
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/src/app/contact/page.tsx",
            lineNumber: 279,
            columnNumber: 11
        }, this);
        $[22] = t18;
    } else {
        t18 = $[22];
    }
    let t19;
    if ($[23] === Symbol.for("react.memo_cache_sentinel")) {
        t19 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "flex items-center justify-center gap-3 mb-6",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "w-10 h-10 rounded-xl bg-tertiary-container flex items-center justify-center",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$fi$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FiLayers"], {
                        className: "w-5 h-5 text-on-tertiary-container"
                    }, void 0, false, {
                        fileName: "[project]/src/app/contact/page.tsx",
                        lineNumber: 286,
                        columnNumber: 165
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/src/app/contact/page.tsx",
                    lineNumber: 286,
                    columnNumber: 72
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                    className: "text-xl font-bold text-on-surface",
                    children: "Tech Stack"
                }, void 0, false, {
                    fileName: "[project]/src/app/contact/page.tsx",
                    lineNumber: 286,
                    columnNumber: 230
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/src/app/contact/page.tsx",
            lineNumber: 286,
            columnNumber: 11
        }, this);
        $[23] = t19;
    } else {
        t19 = $[23];
    }
    let t20;
    if ($[24] === Symbol.for("react.memo_cache_sentinel")) {
        t20 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "glass-strong rounded-3xl p-6 sm:p-8 mb-10 border border-white/10 dark:border-white/5",
            children: [
                t19,
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "grid grid-cols-2 sm:grid-cols-3 gap-4",
                    children: techStack.map(_ContactPageTechStackMap)
                }, void 0, false, {
                    fileName: "[project]/src/app/contact/page.tsx",
                    lineNumber: 293,
                    columnNumber: 118
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/src/app/contact/page.tsx",
            lineNumber: 293,
            columnNumber: 11
        }, this);
        $[24] = t20;
    } else {
        t20 = $[24];
    }
    let t21;
    if ($[25] === Symbol.for("react.memo_cache_sentinel")) {
        t21 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "max-w-6xl mx-auto pt-20 sm:pt-24 px-4 pb-12",
            children: [
                t11,
                t12,
                t18,
                t20,
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "text-center",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex flex-wrap items-center justify-center gap-4 text-sm text-on-surface-variant",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                href: "/terms",
                                className: "hover:underline",
                                children: "Terms & Conditions"
                            }, void 0, false, {
                                fileName: "[project]/src/app/contact/page.tsx",
                                lineNumber: 300,
                                columnNumber: 219
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                children: "·"
                            }, void 0, false, {
                                fileName: "[project]/src/app/contact/page.tsx",
                                lineNumber: 300,
                                columnNumber: 296
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                href: "/privacy",
                                className: "hover:underline",
                                children: "Privacy Policy"
                            }, void 0, false, {
                                fileName: "[project]/src/app/contact/page.tsx",
                                lineNumber: 300,
                                columnNumber: 310
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                children: "·"
                            }, void 0, false, {
                                fileName: "[project]/src/app/contact/page.tsx",
                                lineNumber: 300,
                                columnNumber: 381
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                href: "/encryption",
                                className: "hover:underline",
                                children: "Security"
                            }, void 0, false, {
                                fileName: "[project]/src/app/contact/page.tsx",
                                lineNumber: 300,
                                columnNumber: 395
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                children: "·"
                            }, void 0, false, {
                                fileName: "[project]/src/app/contact/page.tsx",
                                lineNumber: 300,
                                columnNumber: 463
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                href: "/",
                                className: "hover:underline",
                                children: "Back to Home"
                            }, void 0, false, {
                                fileName: "[project]/src/app/contact/page.tsx",
                                lineNumber: 300,
                                columnNumber: 477
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/contact/page.tsx",
                        lineNumber: 300,
                        columnNumber: 121
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/src/app/contact/page.tsx",
                    lineNumber: 300,
                    columnNumber: 92
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/src/app/contact/page.tsx",
            lineNumber: 300,
            columnNumber: 11
        }, this);
        $[25] = t21;
    } else {
        t21 = $[25];
    }
    let t22;
    if ($[26] !== t9) {
        t22 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "min-h-screen bg-mesh-warm antialiased",
            children: [
                t9,
                t10,
                t21
            ]
        }, void 0, true, {
            fileName: "[project]/src/app/contact/page.tsx",
            lineNumber: 307,
            columnNumber: 11
        }, this);
        $[26] = t9;
        $[27] = t22;
    } else {
        t22 = $[27];
    }
    return t22;
}
_s1(ContactPage, "DUkpYAtwQdWmeOu0bGo2SvampvY=", false, function() {
    return [
        useDarkMode
    ];
});
_c = ContactPage;
function _ContactPageTechStackMap(tech) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: `glass rounded-2xl p-4 flex items-center gap-3 border border-outline-variant/20 ${tech.color}`,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(tech.icon, {
                className: "w-6 h-6 text-on-surface-variant"
            }, void 0, false, {
                fileName: "[project]/src/app/contact/page.tsx",
                lineNumber: 316,
                columnNumber: 138
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-sm font-semibold text-on-surface",
                        children: tech.name
                    }, void 0, false, {
                        fileName: "[project]/src/app/contact/page.tsx",
                        lineNumber: 316,
                        columnNumber: 200
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-xs text-on-surface-variant",
                        children: tech.desc
                    }, void 0, false, {
                        fileName: "[project]/src/app/contact/page.tsx",
                        lineNumber: 316,
                        columnNumber: 268
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/app/contact/page.tsx",
                lineNumber: 316,
                columnNumber: 195
            }, this)
        ]
    }, tech.name, true, {
        fileName: "[project]/src/app/contact/page.tsx",
        lineNumber: 316,
        columnNumber: 10
    }, this);
}
function _ContactPageAnonymous(f, i) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "flex items-center gap-3 glass rounded-xl p-3",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                className: "w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center shrink-0",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                    className: "text-primary text-xs",
                    children: "✓"
                }, void 0, false, {
                    fileName: "[project]/src/app/contact/page.tsx",
                    lineNumber: 319,
                    columnNumber: 175
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/app/contact/page.tsx",
                lineNumber: 319,
                columnNumber: 80
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                className: "text-sm text-on-surface-variant",
                children: f
            }, void 0, false, {
                fileName: "[project]/src/app/contact/page.tsx",
                lineNumber: 319,
                columnNumber: 229
            }, this)
        ]
    }, i, true, {
        fileName: "[project]/src/app/contact/page.tsx",
        lineNumber: 319,
        columnNumber: 10
    }, this);
}
function _ContactPageDevelopersMap(dev) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "glass-strong rounded-3xl p-6 flex flex-col items-center gap-4 animate-scale-in border border-white/10 dark:border-white/5 hover:border-primary/20 transition-colors",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "relative rounded-full overflow-hidden shrink-0 ring-4 ring-outline-variant/30 shadow-lg",
                style: {
                    width: 120,
                    height: 120
                },
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                    src: dev.avatar,
                    alt: dev.name,
                    fill: true,
                    className: "object-cover",
                    sizes: "(max-width: 640px) 120px, 120px",
                    placeholder: "blur",
                    blurDataURL: "data:image/svg+xml,%3Csvg width='120' height='120' xmlns='http://www.w3.org/2000/svg'%3E%3Crect width='120' height='120' fill='%23e0f2fe'/%3E%3C/svg%3E"
                }, void 0, false, {
                    fileName: "[project]/src/app/contact/page.tsx",
                    lineNumber: 325,
                    columnNumber: 8
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/app/contact/page.tsx",
                lineNumber: 322,
                columnNumber: 204
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "text-center",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "font-bold text-lg text-on-surface",
                        children: dev.name
                    }, void 0, false, {
                        fileName: "[project]/src/app/contact/page.tsx",
                        lineNumber: 325,
                        columnNumber: 346
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-sm text-on-surface-variant mt-0.5",
                        children: dev.role
                    }, void 0, false, {
                        fileName: "[project]/src/app/contact/page.tsx",
                        lineNumber: 325,
                        columnNumber: 409
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/app/contact/page.tsx",
                lineNumber: 325,
                columnNumber: 317
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: "text-sm leading-relaxed text-on-surface-variant text-center",
                children: dev.bio
            }, void 0, false, {
                fileName: "[project]/src/app/contact/page.tsx",
                lineNumber: 325,
                columnNumber: 483
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex flex-wrap justify-center gap-2",
                children: dev.expertise.map(_ContactPageDevelopersMapDevExpertiseMap)
            }, void 0, false, {
                fileName: "[project]/src/app/contact/page.tsx",
                lineNumber: 325,
                columnNumber: 571
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                href: `mailto:${dev.email}`,
                className: "btn-romance w-full flex items-center justify-center gap-2 py-2.5 text-xs sm:text-sm font-semibold rounded-xl mt-auto",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$fi$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FiMail"], {
                        className: "w-4 h-4 shrink-0"
                    }, void 0, false, {
                        fileName: "[project]/src/app/contact/page.tsx",
                        lineNumber: 325,
                        columnNumber: 852
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "truncate",
                        children: dev.email
                    }, void 0, false, {
                        fileName: "[project]/src/app/contact/page.tsx",
                        lineNumber: 325,
                        columnNumber: 891
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/app/contact/page.tsx",
                lineNumber: 325,
                columnNumber: 691
            }, this)
        ]
    }, dev.id, true, {
        fileName: "[project]/src/app/contact/page.tsx",
        lineNumber: 322,
        columnNumber: 10
    }, this);
}
function _ContactPageDevelopersMapDevExpertiseMap(skill) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
        className: "glass rounded-full px-3 py-1.5 text-xs font-medium text-on-surface-variant border border-outline-variant/20",
        children: skill
    }, skill, false, {
        fileName: "[project]/src/app/contact/page.tsx",
        lineNumber: 328,
        columnNumber: 10
    }, this);
}
function _ContactPageButtonOnClickSetDark(d) {
    return !d;
}
var _c;
__turbopack_context__.k.register(_c, "ContactPage");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=src_app_contact_page_tsx_c811d4de._.js.map