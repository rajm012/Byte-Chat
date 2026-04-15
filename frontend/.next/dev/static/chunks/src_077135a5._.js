(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/src/contexts/ThemeContext.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ThemeProvider",
    ()=>ThemeProvider,
    "useTheme",
    ()=>useTheme
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/compiler-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature();
'use client';
;
;
const ThemeContext = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createContext"])(undefined);
function ThemeProvider(t0) {
    _s();
    const $ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["c"])(10);
    if ($[0] !== "cc7d090964ae507a0ce2d05f8a6fd6f80d2a442a7fdf064db089eae0b49edc8d") {
        for(let $i = 0; $i < 10; $i += 1){
            $[$i] = Symbol.for("react.memo_cache_sentinel");
        }
        $[0] = "cc7d090964ae507a0ce2d05f8a6fd6f80d2a442a7fdf064db089eae0b49edc8d";
    }
    const { children } = t0;
    const getInitialTheme = _ThemeProviderGetInitialTheme;
    const [theme, setTheme] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(getInitialTheme);
    let t1;
    let t2;
    if ($[1] !== theme) {
        t1 = ({
            "ThemeProvider[useEffect()]": ()=>{
                document.documentElement.classList.toggle("dark", theme === "dark");
                localStorage.setItem("theme", theme);
            }
        })["ThemeProvider[useEffect()]"];
        t2 = [
            theme
        ];
        $[1] = theme;
        $[2] = t1;
        $[3] = t2;
    } else {
        t1 = $[2];
        t2 = $[3];
    }
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])(t1, t2);
    let t3;
    if ($[4] === Symbol.for("react.memo_cache_sentinel")) {
        t3 = ({
            "ThemeProvider[toggleTheme]": ()=>{
                setTheme(_ThemeProviderToggleThemeSetTheme);
            }
        })["ThemeProvider[toggleTheme]"];
        $[4] = t3;
    } else {
        t3 = $[4];
    }
    const toggleTheme = t3;
    let t4;
    if ($[5] !== theme) {
        t4 = {
            theme,
            toggleTheme
        };
        $[5] = theme;
        $[6] = t4;
    } else {
        t4 = $[6];
    }
    let t5;
    if ($[7] !== children || $[8] !== t4) {
        t5 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(ThemeContext.Provider, {
            value: t4,
            children: children
        }, void 0, false, {
            fileName: "[project]/src/contexts/ThemeContext.tsx",
            lineNumber: 96,
            columnNumber: 10
        }, this);
        $[7] = children;
        $[8] = t4;
        $[9] = t5;
    } else {
        t5 = $[9];
    }
    return t5;
}
_s(ThemeProvider, "DZ93y6MoushHNJ3xDqNSOypNhgY=");
_c = ThemeProvider;
function _ThemeProviderToggleThemeSetTheme(prev) {
    return prev === "light" ? "dark" : "light";
}
function _ThemeProviderGetInitialTheme() {
    if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
    ;
    const saved = localStorage.getItem("theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    return saved || (prefersDark ? "dark" : "light");
}
function useTheme() {
    _s1();
    const $ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["c"])(1);
    if ($[0] !== "cc7d090964ae507a0ce2d05f8a6fd6f80d2a442a7fdf064db089eae0b49edc8d") {
        for(let $i = 0; $i < 1; $i += 1){
            $[$i] = Symbol.for("react.memo_cache_sentinel");
        }
        $[0] = "cc7d090964ae507a0ce2d05f8a6fd6f80d2a442a7fdf064db089eae0b49edc8d";
    }
    const context = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useContext"])(ThemeContext);
    if (context === undefined) {
        throw new Error("useTheme must be used within a ThemeProvider");
    }
    return context;
}
_s1(useTheme, "b9L3QQ+jgeyIrH0NfHrJ8nn7VMU=");
var _c;
__turbopack_context__.k.register(_c, "ThemeProvider");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/lib/apiClient.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/axios/lib/axios.js [app-client] (ecmascript)");
;
const API_BASE_URL = ("TURBOPACK compile-time value", "http://localhost:3001");
const apiClient = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].create({
    baseURL: API_BASE_URL,
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json'
    }
});
let isRefreshing = false;
let failedQueue = [];
const processQueue = (error, token = null)=>{
    failedQueue.forEach((prom)=>{
        if (error) {
            prom.reject(error);
        } else {
            prom.resolve(token);
        }
    });
    failedQueue = [];
};
apiClient.interceptors.response.use((response)=>response, async (error)=>{
    const originalRequest = error.config;
    // If error is 401 and not already retried
    if (error.response?.status === 401 && !originalRequest._retry) {
        // Don't intercept if it's already a login or refresh request
        if (originalRequest.url.includes('/auth/login') || originalRequest.url.includes('/auth/refresh')) {
            return Promise.reject(error);
        }
        if (isRefreshing) {
            return new Promise((resolve, reject)=>{
                failedQueue.push({
                    resolve,
                    reject
                });
            }).then(()=>{
                return apiClient(originalRequest);
            }).catch((err)=>{
                return Promise.reject(err);
            });
        }
        originalRequest._retry = true;
        isRefreshing = true;
        try {
            // Attempt to refresh token
            await __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].post(`${API_BASE_URL}/api/auth/refresh`, {}, {
                withCredentials: true
            });
            isRefreshing = false;
            processQueue(null);
            // Retry original request
            return apiClient(originalRequest);
        } catch (refreshError) {
            isRefreshing = false;
            processQueue(refreshError, null);
            // If refresh fails, clear session and redirect (client-side only)
            if ("TURBOPACK compile-time truthy", 1) {
                localStorage.removeItem('user');
            // Optional: window.location.href = '/login';
            }
            return Promise.reject(refreshError);
        }
    }
    return Promise.reject(error);
});
const __TURBOPACK__default__export__ = apiClient;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/services/auth.service.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "authService",
    ()=>authService
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$apiClient$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/apiClient.ts [app-client] (ecmascript)");
;
class AuthService {
    async request(method, endpoint, data) {
        const response = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$apiClient$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])({
            method,
            url: `/api/auth${endpoint}`,
            data
        });
        return response.data;
    }
    async signup(data) {
        return this.request('POST', '/signup', data);
    }
    async verifyOTP(data) {
        const response = await this.request('POST', '/verify-otp', data);
        if (response.data?.user) {
            localStorage.setItem('user', JSON.stringify(response.data.user));
        }
        return response;
    }
    async login(data) {
        const response = await this.request('POST', '/login', data);
        if (response.data?.user) {
            localStorage.setItem('user', JSON.stringify(response.data.user));
        }
        return response;
    }
    async logout() {
        try {
            await this.request('POST', '/logout');
        } finally{
            localStorage.removeItem('user');
        }
    }
    async refresh() {
        return this.request('POST', '/refresh');
    }
    async forgotPassword(data) {
        return this.request('POST', '/forgot-password', data);
    }
    async resetPassword(data) {
        return this.request('POST', '/reset-password', data);
    }
    getCurrentUser() {
        if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
        ;
        const user = localStorage.getItem('user');
        return user ? JSON.parse(user) : null;
    }
    isAuthenticated() {
        return !!this.getCurrentUser();
    }
}
const authService = new AuthService();
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/contexts/SocketContext.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "SocketProvider",
    ()=>SocketProvider,
    "useSocket",
    ()=>useSocket
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/compiler-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$socket$2e$io$2d$client$2f$build$2f$esm$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/socket.io-client/build/esm/index.js [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$auth$2e$service$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/services/auth.service.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature();
'use client';
;
;
;
;
const SocketContext = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createContext"])({
    getSocket: ()=>null,
    isConnected: false,
    joinConversation: ()=>{},
    leaveConversation: ()=>{},
    joinGroup: ()=>{},
    leaveGroup: ()=>{},
    sendTyping: ()=>{},
    onOfflineMessages: ()=>()=>{}
});
const useSocket = ()=>{
    _s();
    const $ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["c"])(1);
    if ($[0] !== "41dbda2f393f9db8b6c8dc6b0aeab4446bf1f9327e197ad6fe02fdcb24dbfda9") {
        for(let $i = 0; $i < 1; $i += 1){
            $[$i] = Symbol.for("react.memo_cache_sentinel");
        }
        $[0] = "41dbda2f393f9db8b6c8dc6b0aeab4446bf1f9327e197ad6fe02fdcb24dbfda9";
    }
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useContext"])(SocketContext);
};
_s(useSocket, "gDsCjeeItUuvgOWf1v4qoK9RF6k=");
function SocketProvider(t0) {
    _s1();
    const $ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["c"])(24);
    if ($[0] !== "41dbda2f393f9db8b6c8dc6b0aeab4446bf1f9327e197ad6fe02fdcb24dbfda9") {
        for(let $i = 0; $i < 24; $i += 1){
            $[$i] = Symbol.for("react.memo_cache_sentinel");
        }
        $[0] = "41dbda2f393f9db8b6c8dc6b0aeab4446bf1f9327e197ad6fe02fdcb24dbfda9";
    }
    const { children } = t0;
    const socketRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const [isConnected, setIsConnected] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [hasSession, setHasSession] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    let t1;
    let t2;
    if ($[1] === Symbol.for("react.memo_cache_sentinel")) {
        t1 = ({
            "SocketProvider[useEffect()]": ()=>{
                const syncSession = {
                    "SocketProvider[useEffect() > syncSession]": ()=>{
                        const user = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$auth$2e$service$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["authService"].getCurrentUser();
                        setHasSession({
                            "SocketProvider[useEffect() > syncSession > setHasSession()]": (prev)=>prev === Boolean(user) ? prev : Boolean(user)
                        }["SocketProvider[useEffect() > syncSession > setHasSession()]"]);
                    }
                }["SocketProvider[useEffect() > syncSession]"];
                syncSession();
                const interval = window.setInterval(syncSession, 1000);
                window.addEventListener("storage", syncSession);
                return ()=>{
                    window.clearInterval(interval);
                    window.removeEventListener("storage", syncSession);
                };
            }
        })["SocketProvider[useEffect()]"];
        t2 = [];
        $[1] = t1;
        $[2] = t2;
    } else {
        t1 = $[1];
        t2 = $[2];
    }
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])(t1, t2);
    let t3;
    let t4;
    if ($[3] !== hasSession) {
        t3 = ({
            "SocketProvider[useEffect()]": ()=>{
                const user_0 = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$auth$2e$service$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["authService"].getCurrentUser();
                const token = ("TURBOPACK compile-time truthy", 1) ? localStorage.getItem("token") : "TURBOPACK unreachable";
                const shouldConnect = hasSession && (user_0 || token);
                if (!shouldConnect) {
                    if (socketRef.current) {
                        socketRef.current.disconnect();
                        socketRef.current = null;
                    }
                    setIsConnected(false);
                    return;
                }
                const API_URL = ("TURBOPACK compile-time value", "http://localhost:3001");
                const socketInstance = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$socket$2e$io$2d$client$2f$build$2f$esm$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["io"])(API_URL, {
                    withCredentials: true,
                    transports: [
                        "websocket",
                        "polling"
                    ]
                });
                socketRef.current = socketInstance;
                socketInstance.on("connect", {
                    "SocketProvider[useEffect() > socketInstance.on()]": ()=>{
                        console.log("Socket connected:", socketInstance.id);
                        setIsConnected(true);
                    }
                }["SocketProvider[useEffect() > socketInstance.on()]"]);
                socketInstance.on("disconnect", {
                    "SocketProvider[useEffect() > socketInstance.on()]": ()=>{
                        console.log("Socket disconnected");
                        setIsConnected(false);
                    }
                }["SocketProvider[useEffect() > socketInstance.on()]"]);
                socketInstance.on("connect_error", {
                    "SocketProvider[useEffect() > socketInstance.on()]": (error)=>{
                        if (error.message?.includes("Authentication error") || error.message?.includes("No valid session")) {
                            return;
                        }
                        console.error("Socket connection error:", error.message);
                        setIsConnected(false);
                    }
                }["SocketProvider[useEffect() > socketInstance.on()]"]);
                return ()=>{
                    socketInstance.disconnect();
                    socketRef.current = null;
                };
            }
        })["SocketProvider[useEffect()]"];
        t4 = [
            hasSession
        ];
        $[3] = hasSession;
        $[4] = t3;
        $[5] = t4;
    } else {
        t3 = $[4];
        t4 = $[5];
    }
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])(t3, t4);
    let t5;
    if ($[6] === Symbol.for("react.memo_cache_sentinel")) {
        t5 = ({
            "SocketProvider[onOfflineMessages]": (handler)=>{
                const socket = socketRef.current;
                if (!socket) {
                    return _temp;
                }
                socket.on("offline-messages", handler);
                return ()=>{
                    socket.off("offline-messages", handler);
                };
            }
        })["SocketProvider[onOfflineMessages]"];
        $[6] = t5;
    } else {
        t5 = $[6];
    }
    const onOfflineMessages = t5;
    let t6;
    if ($[7] === Symbol.for("react.memo_cache_sentinel")) {
        t6 = ()=>socketRef.current;
        $[7] = t6;
    } else {
        t6 = $[7];
    }
    let t10;
    let t11;
    let t7;
    let t8;
    let t9;
    if ($[8] !== isConnected) {
        t7 = (conversationId)=>{
            const s = socketRef.current;
            if (s && isConnected) {
                s.emit("join-conversation", conversationId);
            }
        };
        t8 = (conversationId_0)=>{
            const s_0 = socketRef.current;
            if (s_0 && isConnected) {
                s_0.emit("leave-conversation", conversationId_0);
            }
        };
        t9 = (groupId)=>{
            const s_1 = socketRef.current;
            if (s_1 && isConnected) {
                s_1.emit("join-group", groupId);
            }
        };
        t10 = (groupId_0)=>{
            const s_2 = socketRef.current;
            if (s_2 && isConnected) {
                s_2.emit("leave-group", groupId_0);
            }
        };
        t11 = (chatId, chatType, isTyping)=>{
            const s_3 = socketRef.current;
            if (s_3 && isConnected) {
                s_3.emit("typing", {
                    chatId,
                    chatType,
                    isTyping
                });
            }
        };
        $[8] = isConnected;
        $[9] = t10;
        $[10] = t11;
        $[11] = t7;
        $[12] = t8;
        $[13] = t9;
    } else {
        t10 = $[9];
        t11 = $[10];
        t7 = $[11];
        t8 = $[12];
        t9 = $[13];
    }
    let t12;
    if ($[14] !== isConnected || $[15] !== t10 || $[16] !== t11 || $[17] !== t7 || $[18] !== t8 || $[19] !== t9) {
        t12 = {
            getSocket: t6,
            isConnected,
            joinConversation: t7,
            leaveConversation: t8,
            joinGroup: t9,
            leaveGroup: t10,
            sendTyping: t11,
            onOfflineMessages
        };
        $[14] = isConnected;
        $[15] = t10;
        $[16] = t11;
        $[17] = t7;
        $[18] = t8;
        $[19] = t9;
        $[20] = t12;
    } else {
        t12 = $[20];
    }
    const contextValue = t12;
    let t13;
    if ($[21] !== children || $[22] !== contextValue) {
        t13 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(SocketContext.Provider, {
            value: contextValue,
            children: children
        }, void 0, false, {
            fileName: "[project]/src/contexts/SocketContext.tsx",
            lineNumber: 244,
            columnNumber: 11
        }, this);
        $[21] = children;
        $[22] = contextValue;
        $[23] = t13;
    } else {
        t13 = $[23];
    }
    return t13;
}
_s1(SocketProvider, "0Pu5t/btrRW7uhZMNLfbcgXWOOA=");
_c = SocketProvider;
function _temp() {}
var _c;
__turbopack_context__.k.register(_c, "SocketProvider");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/contexts/ToastContext.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ToastProvider",
    ()=>ToastProvider,
    "useToast",
    ()=>useToast
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/compiler-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$fi$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react-icons/fi/index.mjs [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature();
'use client';
;
;
;
const ToastContext = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createContext"])(undefined);
const useToast = ()=>{
    _s();
    const $ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["c"])(1);
    if ($[0] !== "0812204e6ecf7bb3ec471a80dc19266924052945b22dfac5c67eb7acf91544ed") {
        for(let $i = 0; $i < 1; $i += 1){
            $[$i] = Symbol.for("react.memo_cache_sentinel");
        }
        $[0] = "0812204e6ecf7bb3ec471a80dc19266924052945b22dfac5c67eb7acf91544ed";
    }
    const context = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useContext"])(ToastContext);
    if (!context) {
        throw new Error("useToast must be used within a ToastProvider");
    }
    return context;
};
_s(useToast, "b9L3QQ+jgeyIrH0NfHrJ8nn7VMU=");
const ToastProvider = (t0)=>{
    _s1();
    const $ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["c"])(14);
    if ($[0] !== "0812204e6ecf7bb3ec471a80dc19266924052945b22dfac5c67eb7acf91544ed") {
        for(let $i = 0; $i < 14; $i += 1){
            $[$i] = Symbol.for("react.memo_cache_sentinel");
        }
        $[0] = "0812204e6ecf7bb3ec471a80dc19266924052945b22dfac5c67eb7acf91544ed";
    }
    const { children } = t0;
    let t1;
    if ($[1] === Symbol.for("react.memo_cache_sentinel")) {
        t1 = [];
        $[1] = t1;
    } else {
        t1 = $[1];
    }
    const [toasts, setToasts] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(t1);
    let t2;
    if ($[2] === Symbol.for("react.memo_cache_sentinel")) {
        t2 = (id)=>{
            setToasts((prev)=>prev.filter((toast)=>toast.id !== id));
        };
        $[2] = t2;
    } else {
        t2 = $[2];
    }
    const removeToast = t2;
    let t3;
    if ($[3] === Symbol.for("react.memo_cache_sentinel")) {
        t3 = (message, t4, t5)=>{
            const type = t4 === undefined ? "info" : t4;
            const duration = t5 === undefined ? 5000 : t5;
            const id_0 = Math.random().toString(36).substring(7);
            const toast_0 = {
                id: id_0,
                message,
                type,
                duration
            };
            setToasts((prev_0)=>[
                    ...prev_0,
                    toast_0
                ]);
            if (duration > 0) {
                setTimeout(()=>{
                    removeToast(id_0);
                }, duration);
            }
        };
        $[3] = t3;
    } else {
        t3 = $[3];
    }
    const showToast = t3;
    let t4;
    if ($[4] === Symbol.for("react.memo_cache_sentinel")) {
        t4 = (message_0, duration_0)=>{
            showToast(message_0, "success", duration_0);
        };
        $[4] = t4;
    } else {
        t4 = $[4];
    }
    const success = t4;
    let t5;
    if ($[5] === Symbol.for("react.memo_cache_sentinel")) {
        t5 = (message_1, duration_1)=>{
            showToast(message_1, "error", duration_1);
        };
        $[5] = t5;
    } else {
        t5 = $[5];
    }
    const error = t5;
    let t6;
    if ($[6] === Symbol.for("react.memo_cache_sentinel")) {
        t6 = (message_2, duration_2)=>{
            showToast(message_2, "warning", duration_2);
        };
        $[6] = t6;
    } else {
        t6 = $[6];
    }
    const warning = t6;
    let t7;
    if ($[7] === Symbol.for("react.memo_cache_sentinel")) {
        t7 = (message_3, duration_3)=>{
            showToast(message_3, "info", duration_3);
        };
        $[7] = t7;
    } else {
        t7 = $[7];
    }
    const info = t7;
    let t8;
    if ($[8] === Symbol.for("react.memo_cache_sentinel")) {
        t8 = {
            showToast,
            success,
            error,
            warning,
            info
        };
        $[8] = t8;
    } else {
        t8 = $[8];
    }
    let t9;
    if ($[9] !== toasts) {
        t9 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(ToastContainer, {
            toasts: toasts,
            removeToast: removeToast
        }, void 0, false, {
            fileName: "[project]/src/contexts/ToastContext.tsx",
            lineNumber: 145,
            columnNumber: 10
        }, ("TURBOPACK compile-time value", void 0));
        $[9] = toasts;
        $[10] = t9;
    } else {
        t9 = $[10];
    }
    let t10;
    if ($[11] !== children || $[12] !== t9) {
        t10 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(ToastContext.Provider, {
            value: t8,
            children: [
                children,
                t9
            ]
        }, void 0, true, {
            fileName: "[project]/src/contexts/ToastContext.tsx",
            lineNumber: 153,
            columnNumber: 11
        }, ("TURBOPACK compile-time value", void 0));
        $[11] = children;
        $[12] = t9;
        $[13] = t10;
    } else {
        t10 = $[13];
    }
    return t10;
};
_s1(ToastProvider, "d5e9/eTh9mCws6AJ6xOMGthCHTA=");
_c = ToastProvider;
const ToastContainer = (t0)=>{
    const $ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["c"])(8);
    if ($[0] !== "0812204e6ecf7bb3ec471a80dc19266924052945b22dfac5c67eb7acf91544ed") {
        for(let $i = 0; $i < 8; $i += 1){
            $[$i] = Symbol.for("react.memo_cache_sentinel");
        }
        $[0] = "0812204e6ecf7bb3ec471a80dc19266924052945b22dfac5c67eb7acf91544ed";
    }
    const { toasts, removeToast } = t0;
    let t1;
    if ($[1] !== removeToast || $[2] !== toasts) {
        let t2;
        if ($[4] !== removeToast) {
            t2 = (toast)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(ToastItem, {
                    toast: toast,
                    onRemove: removeToast
                }, toast.id, false, {
                    fileName: "[project]/src/contexts/ToastContext.tsx",
                    lineNumber: 182,
                    columnNumber: 21
                }, ("TURBOPACK compile-time value", void 0));
            $[4] = removeToast;
            $[5] = t2;
        } else {
            t2 = $[5];
        }
        t1 = toasts.map(t2);
        $[1] = removeToast;
        $[2] = toasts;
        $[3] = t1;
    } else {
        t1 = $[3];
    }
    let t2;
    if ($[6] !== t1) {
        t2 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "fixed top-4 right-4 z-50 flex flex-col gap-2 max-w-md",
            children: t1
        }, void 0, false, {
            fileName: "[project]/src/contexts/ToastContext.tsx",
            lineNumber: 197,
            columnNumber: 10
        }, ("TURBOPACK compile-time value", void 0));
        $[6] = t1;
        $[7] = t2;
    } else {
        t2 = $[7];
    }
    return t2;
};
_c1 = ToastContainer;
const ToastItem = (t0)=>{
    const $ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["c"])(20);
    if ($[0] !== "0812204e6ecf7bb3ec471a80dc19266924052945b22dfac5c67eb7acf91544ed") {
        for(let $i = 0; $i < 20; $i += 1){
            $[$i] = Symbol.for("react.memo_cache_sentinel");
        }
        $[0] = "0812204e6ecf7bb3ec471a80dc19266924052945b22dfac5c67eb7acf91544ed";
    }
    const { toast, onRemove } = t0;
    let t1;
    if ($[1] !== toast.type) {
        t1 = ()=>{
            switch(toast.type){
                case "success":
                    {
                        return "bg-green-500 text-white";
                    }
                case "error":
                    {
                        return "bg-red-500 text-white";
                    }
                case "warning":
                    {
                        return "bg-yellow-500 text-white";
                    }
                case "info":
                    {
                        return "bg-blue-500 text-white";
                    }
                default:
                    {
                        return "bg-gray-500 text-white";
                    }
            }
        };
        $[1] = toast.type;
        $[2] = t1;
    } else {
        t1 = $[2];
    }
    const getToastStyles = t1;
    let t2;
    if ($[3] !== toast.type) {
        t2 = ()=>{
            switch(toast.type){
                case "success":
                    {
                        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$fi$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FiCheckCircle"], {
                            className: "w-5 h-5"
                        }, void 0, false, {
                            fileName: "[project]/src/contexts/ToastContext.tsx",
                            lineNumber: 259,
                            columnNumber: 20
                        }, ("TURBOPACK compile-time value", void 0));
                    }
                case "error":
                    {
                        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$fi$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FiXCircle"], {
                            className: "w-5 h-5"
                        }, void 0, false, {
                            fileName: "[project]/src/contexts/ToastContext.tsx",
                            lineNumber: 263,
                            columnNumber: 20
                        }, ("TURBOPACK compile-time value", void 0));
                    }
                case "warning":
                    {
                        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$fi$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FiAlertCircle"], {
                            className: "w-5 h-5"
                        }, void 0, false, {
                            fileName: "[project]/src/contexts/ToastContext.tsx",
                            lineNumber: 267,
                            columnNumber: 20
                        }, ("TURBOPACK compile-time value", void 0));
                    }
                case "info":
                    {
                        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$fi$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FiInfo"], {
                            className: "w-5 h-5"
                        }, void 0, false, {
                            fileName: "[project]/src/contexts/ToastContext.tsx",
                            lineNumber: 271,
                            columnNumber: 20
                        }, ("TURBOPACK compile-time value", void 0));
                    }
                default:
                    {
                        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$fi$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FiInfo"], {
                            className: "w-5 h-5"
                        }, void 0, false, {
                            fileName: "[project]/src/contexts/ToastContext.tsx",
                            lineNumber: 275,
                            columnNumber: 20
                        }, ("TURBOPACK compile-time value", void 0));
                    }
            }
        };
        $[3] = toast.type;
        $[4] = t2;
    } else {
        t2 = $[4];
    }
    const getIcon = t2;
    const t3 = `${getToastStyles()} rounded-lg shadow-lg p-4 flex items-center gap-3 min-w-75 animate-slide-in-right`;
    let t4;
    if ($[5] !== getIcon) {
        t4 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "shrink-0",
            children: getIcon()
        }, void 0, false, {
            fileName: "[project]/src/contexts/ToastContext.tsx",
            lineNumber: 288,
            columnNumber: 10
        }, ("TURBOPACK compile-time value", void 0));
        $[5] = getIcon;
        $[6] = t4;
    } else {
        t4 = $[6];
    }
    let t5;
    if ($[7] !== toast.message) {
        t5 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
            className: "flex-1 text-sm font-medium",
            children: toast.message
        }, void 0, false, {
            fileName: "[project]/src/contexts/ToastContext.tsx",
            lineNumber: 296,
            columnNumber: 10
        }, ("TURBOPACK compile-time value", void 0));
        $[7] = toast.message;
        $[8] = t5;
    } else {
        t5 = $[8];
    }
    let t6;
    if ($[9] !== onRemove || $[10] !== toast.id) {
        t6 = ()=>onRemove(toast.id);
        $[9] = onRemove;
        $[10] = toast.id;
        $[11] = t6;
    } else {
        t6 = $[11];
    }
    let t7;
    if ($[12] === Symbol.for("react.memo_cache_sentinel")) {
        t7 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$fi$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FiX"], {
            className: "w-5 h-5"
        }, void 0, false, {
            fileName: "[project]/src/contexts/ToastContext.tsx",
            lineNumber: 313,
            columnNumber: 10
        }, ("TURBOPACK compile-time value", void 0));
        $[12] = t7;
    } else {
        t7 = $[12];
    }
    let t8;
    if ($[13] !== t6) {
        t8 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
            onClick: t6,
            className: "shrink-0 hover:opacity-80 transition-opacity",
            "aria-label": "Close",
            children: t7
        }, void 0, false, {
            fileName: "[project]/src/contexts/ToastContext.tsx",
            lineNumber: 320,
            columnNumber: 10
        }, ("TURBOPACK compile-time value", void 0));
        $[13] = t6;
        $[14] = t8;
    } else {
        t8 = $[14];
    }
    let t9;
    if ($[15] !== t3 || $[16] !== t4 || $[17] !== t5 || $[18] !== t8) {
        t9 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: t3,
            role: "alert",
            children: [
                t4,
                t5,
                t8
            ]
        }, void 0, true, {
            fileName: "[project]/src/contexts/ToastContext.tsx",
            lineNumber: 328,
            columnNumber: 10
        }, ("TURBOPACK compile-time value", void 0));
        $[15] = t3;
        $[16] = t4;
        $[17] = t5;
        $[18] = t8;
        $[19] = t9;
    } else {
        t9 = $[19];
    }
    return t9;
};
_c2 = ToastItem;
var _c, _c1, _c2;
__turbopack_context__.k.register(_c, "ToastProvider");
__turbopack_context__.k.register(_c1, "ToastContainer");
__turbopack_context__.k.register(_c2, "ToastItem");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/services/notification.service.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "clearAllNotifications",
    ()=>clearAllNotifications,
    "clearConversationNotifications",
    ()=>clearConversationNotifications,
    "deleteNotificationById",
    ()=>deleteNotificationById,
    "fetchNotifications",
    ()=>fetchNotifications,
    "markNotificationsRead",
    ()=>markNotificationsRead
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
const API_URL = ("TURBOPACK compile-time value", "http://localhost:3001");
const api = (path, options)=>{
    return fetch(`${API_URL}${path}`, {
        ...options,
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
            ...options?.headers ?? {}
        }
    });
};
async function fetchNotifications() {
    const res = await api('/api/notifications');
    if (res.status === 401) {
        // Return empty data for unauthenticated users (don't throw)
        return {
            notifications: [],
            count: 0
        };
    }
    if (!res.ok) throw new Error(`Failed to fetch notifications: ${res.status}`);
    const json = await res.json();
    // Backend returns unreadCount, map it to count for the frontend
    return {
        notifications: json.data?.notifications || [],
        count: json.data?.unreadCount ?? json.data?.totalCount ?? 0
    };
}
async function markNotificationsRead() {
    const res = await api('/api/notifications/read', {
        method: 'POST'
    });
    if (!res.ok) throw new Error('Failed to mark notifications as read');
}
async function clearAllNotifications() {
    const res = await api('/api/notifications', {
        method: 'DELETE'
    });
    if (!res.ok) throw new Error('Failed to clear notifications');
    const json = await res.json();
    return json.data || {
        count: 0
    };
}
async function deleteNotificationById(notificationId) {
    const res = await api(`/api/notifications/${notificationId}`, {
        method: 'DELETE'
    });
    if (!res.ok) throw new Error('Failed to delete notification');
    const json = await res.json();
    return json.data || {
        deleted: false,
        count: 0
    };
}
async function clearConversationNotifications(conversationId) {
    const res = await api(`/api/notifications/conversation/${conversationId}/clear`, {
        method: 'POST'
    });
    if (!res.ok) throw new Error('Failed to clear conversation notifications');
    const json = await res.json();
    return json.data || {
        removed: 0,
        count: 0
    };
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/contexts/NotificationContext.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "NotificationProvider",
    ()=>NotificationProvider,
    "useNotifications",
    ()=>useNotifications
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/compiler-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$notification$2e$service$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/services/notification.service.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$contexts$2f$SocketContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/contexts/SocketContext.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$auth$2e$service$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/services/auth.service.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature();
'use client';
;
;
;
;
;
;
const NotificationContext = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createContext"])({
    notifications: [],
    count: 0,
    markRead: async ()=>{},
    deleteOne: async ()=>{},
    clearConversation: async ()=>{},
    refresh: async ()=>{}
});
const useNotifications = ()=>{
    _s();
    const $ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["c"])(1);
    if ($[0] !== "188b52e17ae0cd543ba0b74744fb2992d39c7e678a5616a885eda1164f942482") {
        for(let $i = 0; $i < 1; $i += 1){
            $[$i] = Symbol.for("react.memo_cache_sentinel");
        }
        $[0] = "188b52e17ae0cd543ba0b74744fb2992d39c7e678a5616a885eda1164f942482";
    }
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useContext"])(NotificationContext);
};
_s(useNotifications, "gDsCjeeItUuvgOWf1v4qoK9RF6k=");
function NotificationProvider(t0) {
    _s1();
    const $ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["c"])(27);
    if ($[0] !== "188b52e17ae0cd543ba0b74744fb2992d39c7e678a5616a885eda1164f942482") {
        for(let $i = 0; $i < 27; $i += 1){
            $[$i] = Symbol.for("react.memo_cache_sentinel");
        }
        $[0] = "188b52e17ae0cd543ba0b74744fb2992d39c7e678a5616a885eda1164f942482";
    }
    const { children } = t0;
    let t1;
    if ($[1] === Symbol.for("react.memo_cache_sentinel")) {
        t1 = [];
        $[1] = t1;
    } else {
        t1 = $[1];
    }
    const [notifications, setNotifications] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(t1);
    const [count, setCount] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(0);
    const pathname = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["usePathname"])();
    const { getSocket, isConnected } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$contexts$2f$SocketContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSocket"])();
    const listenersAttached = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(false);
    const clearedConversationRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    let t2;
    if ($[2] === Symbol.for("react.memo_cache_sentinel")) {
        t2 = [];
        $[2] = t2;
    } else {
        t2 = $[2];
    }
    const pendingNotificationsRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(t2);
    const pendingCountRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(0);
    const flushTimerRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const flushDelayRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(80);
    let t3;
    if ($[3] === Symbol.for("react.memo_cache_sentinel")) {
        t3 = ({
            "NotificationProvider[refresh]": async ()=>{
                if (!__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$auth$2e$service$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["authService"].getCurrentUser()) {
                    setNotifications([]);
                    setCount(0);
                    return;
                }
                ;
                try {
                    const data = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$notification$2e$service$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["fetchNotifications"])();
                    setNotifications(data.notifications);
                    setCount(data.count);
                } catch (t4) {
                    const err = t4;
                    console.error("[Notifications] Failed to fetch:", err);
                }
            }
        })["NotificationProvider[refresh]"];
        $[3] = t3;
    } else {
        t3 = $[3];
    }
    const refresh = t3;
    let t4;
    let t5;
    if ($[4] === Symbol.for("react.memo_cache_sentinel")) {
        t4 = ({
            "NotificationProvider[useEffect()]": ()=>{
                const user = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$auth$2e$service$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["authService"].getCurrentUser();
                const token = localStorage.getItem("token");
                if (user || token) {
                    const timer = window.setTimeout({
                        "NotificationProvider[useEffect() > window.setTimeout()]": ()=>{
                            refresh();
                        }
                    }["NotificationProvider[useEffect() > window.setTimeout()]"], 300);
                    return ()=>window.clearTimeout(timer);
                }
            }
        })["NotificationProvider[useEffect()]"];
        t5 = [
            refresh
        ];
        $[4] = t4;
        $[5] = t5;
    } else {
        t4 = $[4];
        t5 = $[5];
    }
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])(t4, t5);
    let t6;
    let t7;
    if ($[6] === Symbol.for("react.memo_cache_sentinel")) {
        t6 = ({
            "NotificationProvider[useEffect()]": ()=>{
                const handleFocus = {
                    "NotificationProvider[useEffect() > handleFocus]": ()=>{
                        if (__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$auth$2e$service$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["authService"].getCurrentUser()) {
                            refresh();
                        }
                    }
                }["NotificationProvider[useEffect() > handleFocus]"];
                window.addEventListener("focus", handleFocus);
                return ()=>window.removeEventListener("focus", handleFocus);
            }
        })["NotificationProvider[useEffect()]"];
        t7 = [
            refresh
        ];
        $[6] = t6;
        $[7] = t7;
    } else {
        t6 = $[6];
        t7 = $[7];
    }
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])(t6, t7);
    let t8;
    let t9;
    if ($[8] !== getSocket || $[9] !== isConnected) {
        t8 = ({
            "NotificationProvider[useEffect()]": ()=>{
                if (!isConnected) {
                    return;
                }
                const socket = getSocket();
                if (!socket || listenersAttached.current) {
                    return;
                }
                const flushRealtimeNotifications = {
                    "NotificationProvider[useEffect() > flushRealtimeNotifications]": ()=>{
                        const pending = pendingNotificationsRef.current;
                        if (pending.length === 0) {
                            return;
                        }
                        setNotifications({
                            "NotificationProvider[useEffect() > flushRealtimeNotifications > setNotifications()]": (prev)=>[
                                    ...pending,
                                    ...prev
                                ].slice(0, 20)
                        }["NotificationProvider[useEffect() > flushRealtimeNotifications > setNotifications()]"]);
                        setCount(pendingCountRef.current);
                        pendingNotificationsRef.current = [];
                    }
                }["NotificationProvider[useEffect() > flushRealtimeNotifications]"];
                const scheduleRealtimeFlush = {
                    "NotificationProvider[useEffect() > scheduleRealtimeFlush]": ()=>{
                        const pendingLength = pendingNotificationsRef.current.length;
                        const targetDelay = pendingLength > 6 ? 150 : 80;
                        if (flushTimerRef.current !== null) {
                            if (targetDelay === flushDelayRef.current) {
                                return;
                            }
                            window.clearTimeout(flushTimerRef.current);
                            flushTimerRef.current = null;
                        }
                        flushDelayRef.current = targetDelay;
                        flushTimerRef.current = window.setTimeout({
                            "NotificationProvider[useEffect() > scheduleRealtimeFlush > window.setTimeout()]": ()=>{
                                flushTimerRef.current = null;
                                flushRealtimeNotifications();
                            }
                        }["NotificationProvider[useEffect() > scheduleRealtimeFlush > window.setTimeout()]"], targetDelay);
                    }
                }["NotificationProvider[useEffect() > scheduleRealtimeFlush]"];
                const handleNewNotification = {
                    "NotificationProvider[useEffect() > handleNewNotification]": (payload)=>{
                        pendingNotificationsRef.current.push(payload.notification);
                        pendingCountRef.current = payload.count;
                        setCount(payload.count);
                        scheduleRealtimeFlush();
                    }
                }["NotificationProvider[useEffect() > handleNewNotification]"];
                socket.on("new-notification", handleNewNotification);
                listenersAttached.current = true;
                return ()=>{
                    if (flushTimerRef.current !== null) {
                        window.clearTimeout(flushTimerRef.current);
                        flushTimerRef.current = null;
                    }
                    pendingNotificationsRef.current = [];
                    socket.off("new-notification", handleNewNotification);
                    listenersAttached.current = false;
                };
            }
        })["NotificationProvider[useEffect()]"];
        t9 = [
            isConnected,
            getSocket
        ];
        $[8] = getSocket;
        $[9] = isConnected;
        $[10] = t8;
        $[11] = t9;
    } else {
        t8 = $[10];
        t9 = $[11];
    }
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])(t8, t9);
    let t10;
    let t11;
    if ($[12] !== isConnected) {
        t10 = ({
            "NotificationProvider[useEffect()]": ()=>{
                if (!isConnected) {
                    return;
                }
                if (!__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$auth$2e$service$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["authService"].getCurrentUser()) {
                    return;
                }
                const timer_0 = window.setTimeout({
                    "NotificationProvider[useEffect() > window.setTimeout()]": ()=>{
                        refresh();
                    }
                }["NotificationProvider[useEffect() > window.setTimeout()]"], 0);
                return ()=>window.clearTimeout(timer_0);
            }
        })["NotificationProvider[useEffect()]"];
        t11 = [
            isConnected,
            refresh
        ];
        $[12] = isConnected;
        $[13] = t10;
        $[14] = t11;
    } else {
        t10 = $[13];
        t11 = $[14];
    }
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])(t10, t11);
    let t12;
    if ($[15] === Symbol.for("react.memo_cache_sentinel")) {
        t12 = ({
            "NotificationProvider[markRead]": async ()=>{
                try {
                    await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$notification$2e$service$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["clearAllNotifications"])();
                    setNotifications([]);
                    setCount(0);
                } catch  {}
            }
        })["NotificationProvider[markRead]"];
        $[15] = t12;
    } else {
        t12 = $[15];
    }
    const markRead = t12;
    let t13;
    if ($[16] === Symbol.for("react.memo_cache_sentinel")) {
        t13 = ({
            "NotificationProvider[deleteOne]": async (notificationId)=>{
                if (!notificationId) {
                    return;
                }
                try {
                    const data_0 = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$notification$2e$service$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["deleteNotificationById"])(notificationId);
                    setNotifications({
                        "NotificationProvider[deleteOne > setNotifications()]": (prev_0)=>prev_0.filter({
                                "NotificationProvider[deleteOne > setNotifications() > prev_0.filter()]": (n)=>n.notification_id !== notificationId
                            }["NotificationProvider[deleteOne > setNotifications() > prev_0.filter()]"])
                    }["NotificationProvider[deleteOne > setNotifications()]"]);
                    setCount(data_0.count);
                } catch  {}
            }
        })["NotificationProvider[deleteOne]"];
        $[16] = t13;
    } else {
        t13 = $[16];
    }
    const deleteOne = t13;
    let t14;
    if ($[17] === Symbol.for("react.memo_cache_sentinel")) {
        t14 = ({
            "NotificationProvider[clearConversation]": async (conversationId)=>{
                if (!conversationId) {
                    return;
                }
                try {
                    const data_1 = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$notification$2e$service$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["clearConversationNotifications"])(conversationId);
                    setNotifications({
                        "NotificationProvider[clearConversation > setNotifications()]": (prev_1)=>prev_1.filter({
                                "NotificationProvider[clearConversation > setNotifications() > prev_1.filter()]": (n_0)=>{
                                    const nConversationId = typeof n_0.conversationId === "string" && n_0.conversationId || typeof n_0.conversation_id === "string" && n_0.conversation_id || typeof n_0.chatId === "string" && n_0.chatId || typeof n_0.chat_id === "string" && n_0.chat_id || "";
                                    return nConversationId !== conversationId;
                                }
                            }["NotificationProvider[clearConversation > setNotifications() > prev_1.filter()]"])
                    }["NotificationProvider[clearConversation > setNotifications()]"]);
                    setCount(data_1.count);
                } catch  {}
            }
        })["NotificationProvider[clearConversation]"];
        $[17] = t14;
    } else {
        t14 = $[17];
    }
    const clearConversation = t14;
    let t15;
    let t16;
    if ($[18] !== pathname) {
        t15 = ({
            "NotificationProvider[useEffect()]": ()=>{
                const match = pathname.match(/^\/chat\/([^/?#]+)/);
                const conversationId_0 = match?.[1];
                if (!conversationId_0) {
                    clearedConversationRef.current = null;
                    return;
                }
                if (clearedConversationRef.current === conversationId_0) {
                    return;
                }
                clearedConversationRef.current = conversationId_0;
                const timer_1 = window.setTimeout({
                    "NotificationProvider[useEffect() > window.setTimeout()]": ()=>{
                        clearConversation(conversationId_0);
                    }
                }["NotificationProvider[useEffect() > window.setTimeout()]"], 0);
                return ()=>window.clearTimeout(timer_1);
            }
        })["NotificationProvider[useEffect()]"];
        t16 = [
            pathname,
            clearConversation
        ];
        $[18] = pathname;
        $[19] = t15;
        $[20] = t16;
    } else {
        t15 = $[19];
        t16 = $[20];
    }
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])(t15, t16);
    let t17;
    if ($[21] !== count || $[22] !== notifications) {
        t17 = {
            notifications,
            count,
            markRead,
            deleteOne,
            clearConversation,
            refresh
        };
        $[21] = count;
        $[22] = notifications;
        $[23] = t17;
    } else {
        t17 = $[23];
    }
    let t18;
    if ($[24] !== children || $[25] !== t17) {
        t18 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(NotificationContext.Provider, {
            value: t17,
            children: children
        }, void 0, false, {
            fileName: "[project]/src/contexts/NotificationContext.tsx",
            lineNumber: 366,
            columnNumber: 11
        }, this);
        $[24] = children;
        $[25] = t17;
        $[26] = t18;
    } else {
        t18 = $[26];
    }
    return t18;
}
_s1(NotificationProvider, "nInAJQsCc8NTkbuUp4aiHiu+AtE=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["usePathname"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$contexts$2f$SocketContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSocket"]
    ];
});
_c = NotificationProvider;
var _c;
__turbopack_context__.k.register(_c, "NotificationProvider");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=src_077135a5._.js.map