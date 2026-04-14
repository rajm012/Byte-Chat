(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/src/services/apiBase.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// Centralized API base URL utility
__turbopack_context__.s([
    "API_BASE_URL",
    ()=>API_BASE_URL
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
const API_BASE_URL = ("TURBOPACK compile-time value", "http://localhost:3001");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/services/anonymous.service.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "createAnonymousIdentity",
    ()=>createAnonymousIdentity,
    "deleteAnonymousIdentity",
    ()=>deleteAnonymousIdentity,
    "getAnonymousIdentityById",
    ()=>getAnonymousIdentityById,
    "getMyAnonymousIdentities",
    ()=>getMyAnonymousIdentities,
    "revealAnonymousIdentity",
    ()=>revealAnonymousIdentity
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/axios/lib/axios.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$apiBase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/services/apiBase.ts [app-client] (ecmascript)");
;
;
const API_URL = `${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$apiBase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["API_BASE_URL"]}/api`;
const getAuthHeader = ()=>{
    return {
        withCredentials: true
    };
};
const getMyAnonymousIdentities = async ()=>{
    try {
        const response = await __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].get(`${API_URL}/anonymous/my-identities`, getAuthHeader());
        return response.data;
    } catch (error) {
        const message = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].isAxiosError(error) && error.response?.data?.message ? String(error.response.data.message) : error instanceof Error ? error.message : 'Failed to fetch anonymous identities';
        throw new Error(message);
    }
};
const revealAnonymousIdentity = async (identityId)=>{
    try {
        const response = await __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].put(`${API_URL}/anonymous/reveal/${identityId}`, {}, getAuthHeader());
        return response.data;
    } catch (error) {
        const message = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].isAxiosError(error) && error.response?.data?.message ? String(error.response.data.message) : error instanceof Error ? error.message : 'Failed to reveal identity';
        throw new Error(message);
    }
};
const createAnonymousIdentity = async (data)=>{
    try {
        const response = await __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].post(`${API_URL}/anonymous/create`, data, getAuthHeader());
        return response.data;
    } // catch (error: any) {
    //   throw new Error(error.response?.data?.message || 'Failed to create anonymous identity');
    // }
    catch (error) {
        const message = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].isAxiosError(error) && error.response?.data?.message ? String(error.response.data.message) : error instanceof Error ? error.message : 'Failed to create anonymous identity';
        throw new Error(message);
    }
};
const deleteAnonymousIdentity = async (identityId)=>{
    try {
        const response = await __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].delete(`${API_URL}/anonymous/${identityId}`, getAuthHeader());
        return response.data;
    } // catch (error: any) {
    //   throw new Error(error.response?.data?.message || 'Failed to delete identity');
    // }
    catch (error) {
        const message = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].isAxiosError(error) && error.response?.data?.message ? String(error.response.data.message) : error instanceof Error ? error.message : 'Failed to delete identity';
        throw new Error(message);
    }
};
const getAnonymousIdentityById = async (identityId)=>{
    try {
        const response = await __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].get(`${API_URL}/anonymous/${identityId}`, getAuthHeader());
        return response.data.data;
    } // catch (error: any) {
    //   throw new Error(error.response?.data?.message || 'Failed to fetch identity');
    // }
    catch (error) {
        const message = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].isAxiosError(error) && error.response?.data?.message ? String(error.response.data.message) : error instanceof Error ? error.message : 'Failed to fetch identity';
        throw new Error(message);
    }
};
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/app/my-identities/page.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>MyAnonymousIdentities
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/client/app-dir/link.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$contexts$2f$ThemeContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/contexts/ThemeContext.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$contexts$2f$ToastContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/contexts/ToastContext.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$contexts$2f$NotificationContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/contexts/NotificationContext.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$anonymous$2e$service$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/services/anonymous.service.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/image.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
;
;
;
;
;
;
function MyAnonymousIdentities() {
    _s();
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"])();
    const { theme, toggleTheme } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$contexts$2f$ThemeContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useTheme"])();
    const toast = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$contexts$2f$ToastContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useToast"])();
    const { notifications, count: notificationCount, markRead, deleteOne } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$contexts$2f$NotificationContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useNotifications"])();
    const [showNotifications, setShowNotifications] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const notifRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const [currentUser, setCurrentUser] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const normalizeCurrentUser = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "MyAnonymousIdentities.useCallback[normalizeCurrentUser]": (raw)=>{
            if (!raw || typeof raw !== 'object') {
                return null;
            }
            const data = raw;
            const name = typeof data.name === 'string' && data.name || typeof data.full_name === 'string' && data.full_name || 'Profile';
            const dpUrl = typeof data.dp_url === 'string' && data.dp_url || typeof data.avatar_url === 'string' && data.avatar_url || typeof data.profile_image_url === 'string' && data.profile_image_url || undefined;
            const rollNo = typeof data.roll_no === 'string' && data.roll_no || typeof data.rollNo === 'string' && data.rollNo || undefined;
            return {
                name,
                dp_url: dpUrl,
                roll_no: rollNo
            };
        }
    }["MyAnonymousIdentities.useCallback[normalizeCurrentUser]"], []);
    const [identities, setIdentities] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [isLoading, setIsLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(true);
    const [filter, setFilter] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('all');
    const [revealingId, setRevealingId] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [confirmRevealId, setConfirmRevealId] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [error, setError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    // Close notification dropdown when clicking outside
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "MyAnonymousIdentities.useEffect": ()=>{
            const handleClickOutside = {
                "MyAnonymousIdentities.useEffect.handleClickOutside": (event)=>{
                    if (notifRef.current && !notifRef.current.contains(event.target)) {
                        setShowNotifications(false);
                    }
                }
            }["MyAnonymousIdentities.useEffect.handleClickOutside"];
            if (showNotifications) {
                document.addEventListener('mousedown', handleClickOutside);
                return ({
                    "MyAnonymousIdentities.useEffect": ()=>document.removeEventListener('mousedown', handleClickOutside)
                })["MyAnonymousIdentities.useEffect"];
            }
        }
    }["MyAnonymousIdentities.useEffect"], [
        showNotifications
    ]);
    // Fetch current user profile
    const fetchCurrentUser = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "MyAnonymousIdentities.useCallback[fetchCurrentUser]": async ()=>{
            const userRaw = localStorage.getItem('user');
            let fallbackUser = null;
            if (userRaw) {
                try {
                    fallbackUser = normalizeCurrentUser(JSON.parse(userRaw));
                } catch  {
                    fallbackUser = null;
                }
            }
            try {
                const { API_BASE_URL } = await __turbopack_context__.A("[project]/src/services/apiBase.ts [app-client] (ecmascript, async loader)");
                const token = localStorage.getItem('token');
                const headers = token ? {
                    Authorization: `Bearer ${token}`
                } : {};
                const res = await fetch(`${API_BASE_URL}/api/profile/me`, {
                    credentials: 'include',
                    headers
                });
                if (res.ok) {
                    const data = await res.json();
                    if (data.success && data.data) {
                        const normalized = normalizeCurrentUser(data.data);
                        setCurrentUser(normalized || fallbackUser);
                        return;
                    }
                }
            } catch  {
            // Use fallback below.
            }
            if (fallbackUser) {
                setCurrentUser(fallbackUser);
            }
        }
    }["MyAnonymousIdentities.useCallback[fetchCurrentUser]"], [
        normalizeCurrentUser
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "MyAnonymousIdentities.useEffect": ()=>{
            fetchCurrentUser();
            fetchIdentities();
        // eslint-disable-next-line react-hooks/exhaustive-deps
        }
    }["MyAnonymousIdentities.useEffect"], []);
    const fetchIdentities = async ()=>{
        try {
            setIsLoading(true);
            setError(null);
            const response = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$anonymous$2e$service$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getMyAnonymousIdentities"])();
            if (response.success) {
                setIdentities(response.data);
            } else {
                setError(response.message || 'Failed to fetch identities');
                toast.error(response.message || 'Failed to fetch identities');
            }
        } catch (err) {
            let errorMsg = 'Failed to load anonymous identities';
            if (typeof err === 'object' && err !== null && 'message' in err && typeof err.message === 'string') {
                errorMsg = err.message;
            }
            setError(errorMsg);
            toast.error(errorMsg);
        } finally{
            setIsLoading(false);
        }
    };
    const handleRevealIdentity = async (identityId)=>{
        // First click: Ask for confirmation
        if (confirmRevealId !== identityId) {
            setConfirmRevealId(identityId);
            toast.warning('Click reveal again to confirm. This cannot be undone!');
            // Auto-cancel after 5 seconds
            setTimeout(()=>{
                setConfirmRevealId(null);
            }, 5000);
            return;
        }
        // Second click: Actually reveal
        try {
            setRevealingId(identityId);
            setConfirmRevealId(null);
            const response = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$anonymous$2e$service$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["revealAnonymousIdentity"])(identityId);
            if (response.success) {
                toast.success('Identity revealed! Your next message will show your profile.');
                fetchIdentities(); // Refresh list
            } else {
                toast.error(response.message || 'Failed to reveal identity');
            }
        } // catch (err: any) {
        //   toast.error(err.message || 'Failed to reveal identity');
        // } 
        catch (err) {
            let errorMsg = 'Failed to reveal identity';
            if (typeof err === 'object' && err !== null && 'message' in err && typeof err.message === 'string') {
                errorMsg = err.message;
            }
            setError(errorMsg);
            toast.error(errorMsg);
        } finally{
            setRevealingId(null);
        }
    };
    const handleNavigateToChat = (identity)=>{
        if (confirmRevealId) {
            setConfirmRevealId(null);
        }
        if (identity.conversation_id) {
            toast.info('Opening 1V1 chat...');
            router.push(`/chat?conversationId=${identity.conversation_id}`);
        } else if (identity.group_id) {
            toast.info('Opening group chat...');
            router.push(`/groups/${identity.group_id}/chat`);
        } else {
            toast.warning('Unable to navigate to chat');
        }
    };
    const handleLogout = ()=>{
        localStorage.removeItem('user');
        localStorage.removeItem('theme');
        router.push('/login');
    };
    const filteredIdentities = filter === 'all' ? identities : filter === 'chat' ? identities.filter((i)=>!i.group_id) : identities.filter((i)=>i.group_id);
    // Badge counts
    const chatCount = identities.filter((i)=>!i.group_id).length;
    const groupCount = identities.filter((i)=>i.group_id).length;
    const tabLabels = {
        all: 'All',
        chat: '1V1 Chats',
        group: 'Groups'
    };
    const tabCounts = {
        all: identities.length,
        chat: chatCount,
        group: groupCount
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "min-h-screen bg-mesh-warm antialiased",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "fixed inset-0 pointer-events-none -z-10 overflow-hidden",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "absolute top-[-10%] right-[-5%] w-96 h-96 bg-linear-to-br from-purple-400/20 to-transparent rounded-full blur-3xl"
                    }, void 0, false, {
                        fileName: "[project]/src/app/my-identities/page.tsx",
                        lineNumber: 218,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "absolute bottom-[-5%] left-[-3%] w-80 h-80 bg-linear-to-br from-pink-400/15 to-transparent rounded-full blur-3xl"
                    }, void 0, false, {
                        fileName: "[project]/src/app/my-identities/page.tsx",
                        lineNumber: 219,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-linear-to-br from-indigo-400/10 to-transparent rounded-full blur-3xl"
                    }, void 0, false, {
                        fileName: "[project]/src/app/my-identities/page.tsx",
                        lineNumber: 220,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/app/my-identities/page.tsx",
                lineNumber: 217,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("header", {
                className: "glass-nav fixed top-0 w-full z-50 shadow-[0_20px_40px_rgba(0,32,32,0.06)]",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "max-w-7xl mx-auto px-5 sm:px-8 h-16 flex items-center justify-between",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex items-center gap-3",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                href: "/dashboard",
                                className: "flex items-center gap-2.5 hover:opacity-80 transition-opacity",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "w-9 h-9 rounded-xl flex items-center justify-center bg-primary",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                            className: "w-5 h-5 text-white",
                                            fill: "none",
                                            stroke: "currentColor",
                                            viewBox: "0 0 24 24",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                strokeLinecap: "round",
                                                strokeLinejoin: "round",
                                                strokeWidth: 2.5,
                                                d: "M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/my-identities/page.tsx",
                                                lineNumber: 231,
                                                columnNumber: 19
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/my-identities/page.tsx",
                                            lineNumber: 230,
                                            columnNumber: 17
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/my-identities/page.tsx",
                                        lineNumber: 229,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "text-xl font-black text-on-surface tracking-tight",
                                        children: [
                                            "Byte",
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "text-primary",
                                                children: "chat"
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/my-identities/page.tsx",
                                                lineNumber: 235,
                                                columnNumber: 21
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/app/my-identities/page.tsx",
                                        lineNumber: 234,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/my-identities/page.tsx",
                                lineNumber: 228,
                                columnNumber: 13
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/src/app/my-identities/page.tsx",
                            lineNumber: 227,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex items-center gap-2",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    ref: notifRef,
                                    className: "relative",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            onClick: ()=>setShowNotifications(!showNotifications),
                                            className: "p-2 text-on-surface hover:bg-surface-container-high transition-all duration-300 rounded-full relative",
                                            "aria-label": "Notifications",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "material-symbols-outlined",
                                                    children: "notifications"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/my-identities/page.tsx",
                                                    lineNumber: 247,
                                                    columnNumber: 17
                                                }, this),
                                                notificationCount > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "absolute top-1 right-1 min-w-4.5 h-4.5 flex items-center justify-center bg-tertiary text-on-tertiary text-[10px] font-bold rounded-full px-1",
                                                    children: notificationCount > 99 ? '99+' : notificationCount
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/my-identities/page.tsx",
                                                    lineNumber: 248,
                                                    columnNumber: 43
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/app/my-identities/page.tsx",
                                            lineNumber: 246,
                                            columnNumber: 15
                                        }, this),
                                        showNotifications && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "absolute top-full right-0 mt-2 w-80 bg-surface-container-lowest rounded-xl shadow-[0_20px_40px_rgba(0,32,32,0.15)] border border-outline-variant/30 overflow-hidden z-50",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "p-3 border-b border-outline-variant/30 flex items-center justify-between",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            className: "font-semibold text-sm text-on-surface",
                                                            children: "Notifications"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/app/my-identities/page.tsx",
                                                            lineNumber: 255,
                                                            columnNumber: 21
                                                        }, this),
                                                        notificationCount > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                            onClick: ()=>{
                                                                markRead();
                                                            },
                                                            className: "text-xs text-primary hover:text-primary/80 font-medium",
                                                            children: "Mark all read"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/app/my-identities/page.tsx",
                                                            lineNumber: 256,
                                                            columnNumber: 47
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/app/my-identities/page.tsx",
                                                    lineNumber: 254,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "max-h-80 overflow-y-auto",
                                                    children: notifications.length === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "p-8 text-center",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "material-symbols-outlined text-4xl text-on-surface-variant mb-2",
                                                                children: "notifications_off"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/app/my-identities/page.tsx",
                                                                lineNumber: 264,
                                                                columnNumber: 25
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                className: "text-sm text-on-surface-variant",
                                                                children: "No notifications"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/app/my-identities/page.tsx",
                                                                lineNumber: 265,
                                                                columnNumber: 25
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/app/my-identities/page.tsx",
                                                        lineNumber: 263,
                                                        columnNumber: 51
                                                    }, this) : notifications.map((notif)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "p-3 border-b border-outline-variant/20 hover:bg-surface-container-high/50 transition-colors",
                                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "flex items-start gap-2",
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                        className: "flex-1 min-w-0",
                                                                        children: [
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                                className: "text-sm text-on-surface truncate",
                                                                                children: notif.message
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/src/app/my-identities/page.tsx",
                                                                                lineNumber: 269,
                                                                                columnNumber: 31
                                                                            }, this),
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                                className: "text-[10px] text-on-surface-variant mt-1",
                                                                                children: notif.timestamp ? new Date(notif.timestamp).toLocaleDateString() : ''
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/src/app/my-identities/page.tsx",
                                                                                lineNumber: 270,
                                                                                columnNumber: 31
                                                                            }, this)
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/src/app/my-identities/page.tsx",
                                                                        lineNumber: 268,
                                                                        columnNumber: 29
                                                                    }, this),
                                                                    notif.notification_id && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                        onClick: ()=>deleteOne(notif.notification_id),
                                                                        className: "p-1 text-on-surface-variant hover:text-error rounded-full hover:bg-error-container/30 transition-colors",
                                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                            className: "material-symbols-outlined text-sm",
                                                                            children: "close"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/src/app/my-identities/page.tsx",
                                                                            lineNumber: 275,
                                                                            columnNumber: 33
                                                                        }, this)
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/app/my-identities/page.tsx",
                                                                        lineNumber: 274,
                                                                        columnNumber: 55
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/src/app/my-identities/page.tsx",
                                                                lineNumber: 267,
                                                                columnNumber: 27
                                                            }, this)
                                                        }, notif.notification_id || notif.timestamp, false, {
                                                            fileName: "[project]/src/app/my-identities/page.tsx",
                                                            lineNumber: 266,
                                                            columnNumber: 59
                                                        }, this))
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/my-identities/page.tsx",
                                                    lineNumber: 262,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "p-2 border-t border-outline-variant/30 bg-surface-container-high/30",
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                        onClick: ()=>{
                                                            setShowNotifications(false);
                                                            router.push('/chat');
                                                        },
                                                        className: "w-full py-2 text-xs font-semibold text-primary hover:bg-primary-container/30 rounded-lg transition-colors",
                                                        children: "View all chats"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/my-identities/page.tsx",
                                                        lineNumber: 281,
                                                        columnNumber: 21
                                                    }, this)
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/my-identities/page.tsx",
                                                    lineNumber: 280,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/app/my-identities/page.tsx",
                                            lineNumber: 253,
                                            columnNumber: 37
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/app/my-identities/page.tsx",
                                    lineNumber: 245,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    onClick: toggleTheme,
                                    className: "p-2 text-on-surface hover:bg-surface-container-high transition-all duration-300 rounded-full",
                                    "aria-label": "Toggle theme",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "material-symbols-outlined",
                                        children: theme === 'dark' ? 'light_mode' : 'dark_mode'
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/my-identities/page.tsx",
                                        lineNumber: 292,
                                        columnNumber: 15
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/src/app/my-identities/page.tsx",
                                    lineNumber: 291,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "h-8 w-px bg-outline-variant/30 mx-1"
                                }, void 0, false, {
                                    fileName: "[project]/src/app/my-identities/page.tsx",
                                    lineNumber: 294,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex items-center gap-2",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                            href: "/profile/edit",
                                            className: "w-10 h-10 rounded-full overflow-hidden border-2 border-primary-container shadow-sm hover:scale-105 transition-transform",
                                            children: currentUser?.dp_url ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                                src: currentUser.dp_url,
                                                alt: currentUser.name || 'Profile',
                                                width: 40,
                                                height: 40,
                                                className: "w-full h-full object-cover"
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/my-identities/page.tsx",
                                                lineNumber: 298,
                                                columnNumber: 40
                                            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "w-full h-full bg-linear-to-br from-primary to-tertiary flex items-center justify-center",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "material-symbols-outlined text-white text-lg",
                                                    children: "person"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/my-identities/page.tsx",
                                                    lineNumber: 299,
                                                    columnNumber: 21
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/my-identities/page.tsx",
                                                lineNumber: 298,
                                                columnNumber: 175
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/my-identities/page.tsx",
                                            lineNumber: 297,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            onClick: handleLogout,
                                            className: "p-2 text-on-surface hover:bg-surface-container-high transition-all duration-300 rounded-full scale-95 active:scale-90",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "material-symbols-outlined",
                                                children: "logout"
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/my-identities/page.tsx",
                                                lineNumber: 303,
                                                columnNumber: 17
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/my-identities/page.tsx",
                                            lineNumber: 302,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/app/my-identities/page.tsx",
                                    lineNumber: 296,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/app/my-identities/page.tsx",
                            lineNumber: 243,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/app/my-identities/page.tsx",
                    lineNumber: 225,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/app/my-identities/page.tsx",
                lineNumber: 224,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("main", {
                className: "max-w-7xl mx-auto px-5 sm:px-8 pt-24 pb-24 md:pb-28",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("header", {
                        className: "mb-10",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex flex-col md:flex-row md:items-end justify-between gap-6",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "text-xs uppercase tracking-[0.2em] text-secondary font-bold mb-2 block",
                                            children: "Anonymous Personas"
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/my-identities/page.tsx",
                                            lineNumber: 316,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                                            className: "text-4xl sm:text-5xl font-extrabold text-on-surface tracking-tight leading-none",
                                            children: [
                                                "My ",
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "text-primary italic",
                                                    children: "Identities."
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/my-identities/page.tsx",
                                                    lineNumber: 318,
                                                    columnNumber: 20
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/app/my-identities/page.tsx",
                                            lineNumber: 317,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "text-sm text-on-surface-variant mt-2",
                                            children: [
                                                identities.length,
                                                " active persona",
                                                identities.length !== 1 ? 's' : '',
                                                " · Click any card to open the chat"
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/app/my-identities/page.tsx",
                                            lineNumber: 320,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/app/my-identities/page.tsx",
                                    lineNumber: 315,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex flex-wrap gap-2 md:gap-3",
                                    children: [
                                        {
                                            label: 'Total',
                                            value: identities.length,
                                            color: 'var(--purple)'
                                        },
                                        {
                                            label: '1V1',
                                            value: chatCount,
                                            color: 'var(--pink)'
                                        },
                                        {
                                            label: 'Groups',
                                            value: groupCount,
                                            color: '#22c55e'
                                        }
                                    ].map((s)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "glass rounded-2xl px-3 md:px-5 py-2 md:py-3 text-center min-w-[4rem] md:min-w-18",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    className: "text-xl md:text-2xl font-bold",
                                                    style: {
                                                        color: s.color
                                                    },
                                                    children: s.value
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/my-identities/page.tsx",
                                                    lineNumber: 339,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    className: "text-xs text-on-surface-variant",
                                                    children: s.label
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/my-identities/page.tsx",
                                                    lineNumber: 342,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, s.label, true, {
                                            fileName: "[project]/src/app/my-identities/page.tsx",
                                            lineNumber: 338,
                                            columnNumber: 25
                                        }, this))
                                }, void 0, false, {
                                    fileName: "[project]/src/app/my-identities/page.tsx",
                                    lineNumber: 325,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/app/my-identities/page.tsx",
                            lineNumber: 314,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/app/my-identities/page.tsx",
                        lineNumber: 313,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex gap-2 mb-8 overflow-x-auto pb-2",
                        children: [
                            'all',
                            'chat',
                            'group'
                        ].map((tab)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: ()=>setFilter(tab),
                                className: `px-4 md:px-5 py-2 rounded-full font-semibold text-sm transition-all whitespace-nowrap shrink-0 ${filter === tab ? 'bg-tertiary-container text-on-tertiary-container hover:scale-105' : 'bg-surface-container-high text-on-surface-variant hover:bg-surface-container-highest'}`,
                                children: [
                                    tabLabels[tab],
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: `ml-1.5 px-2 py-0.5 rounded-full text-xs font-bold ${filter === tab ? 'bg-on-tertiary-container/15' : 'bg-outline-variant/20'}`,
                                        children: tabCounts[tab]
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/my-identities/page.tsx",
                                        lineNumber: 352,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, tab, true, {
                                fileName: "[project]/src/app/my-identities/page.tsx",
                                lineNumber: 350,
                                columnNumber: 63
                            }, this))
                    }, void 0, false, {
                        fileName: "[project]/src/app/my-identities/page.tsx",
                        lineNumber: 349,
                        columnNumber: 9
                    }, this),
                    error && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "rounded-2xl p-4 mb-6 border border-error/30 bg-error-container/10 text-error animate-fade-in flex items-center gap-2",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "material-symbols-outlined",
                                children: "warning"
                            }, void 0, false, {
                                fileName: "[project]/src/app/my-identities/page.tsx",
                                lineNumber: 360,
                                columnNumber: 13
                            }, this),
                            error
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/my-identities/page.tsx",
                        lineNumber: 359,
                        columnNumber: 19
                    }, this),
                    isLoading && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6",
                        children: Array.from({
                            length: 6
                        }).map((_, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "glass-card rounded-3xl p-6 animate-pulse",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex justify-between mb-4",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "skeleton h-6 w-24 rounded-full"
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/my-identities/page.tsx",
                                                lineNumber: 370,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "skeleton h-5 w-16 rounded"
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/my-identities/page.tsx",
                                                lineNumber: 371,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/app/my-identities/page.tsx",
                                        lineNumber: 369,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "skeleton h-5 w-full rounded mb-2"
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/my-identities/page.tsx",
                                        lineNumber: 373,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "skeleton h-4 w-20 rounded mb-4"
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/my-identities/page.tsx",
                                        lineNumber: 374,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "glass rounded-2xl p-3 mb-4",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "flex items-center gap-3",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "skeleton w-8 h-8 rounded-full"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/my-identities/page.tsx",
                                                    lineNumber: 377,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "flex-1",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "skeleton h-4 w-24 rounded mb-1"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/app/my-identities/page.tsx",
                                                            lineNumber: 379,
                                                            columnNumber: 23
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "skeleton h-3 w-16 rounded"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/app/my-identities/page.tsx",
                                                            lineNumber: 380,
                                                            columnNumber: 23
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/app/my-identities/page.tsx",
                                                    lineNumber: 378,
                                                    columnNumber: 21
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/app/my-identities/page.tsx",
                                            lineNumber: 376,
                                            columnNumber: 19
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/my-identities/page.tsx",
                                        lineNumber: 375,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "skeleton h-3 w-28 rounded"
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/my-identities/page.tsx",
                                        lineNumber: 384,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, i, true, {
                                fileName: "[project]/src/app/my-identities/page.tsx",
                                lineNumber: 368,
                                columnNumber: 26
                            }, this))
                    }, void 0, false, {
                        fileName: "[project]/src/app/my-identities/page.tsx",
                        lineNumber: 365,
                        columnNumber: 23
                    }, this),
                    !isLoading && filteredIdentities.length === 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "glass-strong rounded-3xl p-8 md:p-16 text-center animate-scale-in",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "material-symbols-outlined text-6xl text-on-surface-variant mb-4 block",
                                children: "theater_comedy"
                            }, void 0, false, {
                                fileName: "[project]/src/app/my-identities/page.tsx",
                                lineNumber: 390,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                className: "text-xl font-bold text-on-surface mb-2",
                                children: "No anonymous identities yet"
                            }, void 0, false, {
                                fileName: "[project]/src/app/my-identities/page.tsx",
                                lineNumber: 391,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-sm text-on-surface-variant mb-6",
                                children: "Send an anonymous message or join a group anonymously to create one"
                            }, void 0, false, {
                                fileName: "[project]/src/app/my-identities/page.tsx",
                                lineNumber: 394,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: ()=>router.push('/dashboard'),
                                className: "px-6 py-2.5 rounded-full bg-primary text-on-primary font-semibold hover:scale-105 transition-all",
                                children: "Explore Students & Groups"
                            }, void 0, false, {
                                fileName: "[project]/src/app/my-identities/page.tsx",
                                lineNumber: 397,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/my-identities/page.tsx",
                        lineNumber: 389,
                        columnNumber: 59
                    }, this),
                    !isLoading && filteredIdentities.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6",
                        children: filteredIdentities.map((identity, idx)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: `glass-card rounded-3xl p-6 cursor-pointer hover:scale-[1.02] transition-all duration-200 animate-fade-in ${confirmRevealId === identity.identity_id ? 'ring-2 ring-error/60' : ''}`,
                                style: {
                                    animationDelay: `${idx * 60}ms`
                                },
                                onClick: ()=>handleNavigateToChat(identity),
                                title: "Click to open conversation",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex items-start justify-between mb-4",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: `px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1 ${identity.group_id ? 'bg-tertiary-container/30 text-on-tertiary-container' : 'bg-primary-container/30 text-on-primary-container'}`,
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "material-symbols-outlined text-sm",
                                                        children: identity.group_id ? 'groups' : 'chat'
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/my-identities/page.tsx",
                                                        lineNumber: 410,
                                                        columnNumber: 21
                                                    }, this),
                                                    identity.group_id ? 'Group' : '1V1 Chat'
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/app/my-identities/page.tsx",
                                                lineNumber: 409,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                onClick: (e)=>{
                                                    e.stopPropagation();
                                                    handleRevealIdentity(identity.identity_id);
                                                },
                                                disabled: revealingId === identity.identity_id || identity.is_revealed,
                                                className: `text-xs font-semibold px-3 py-1 rounded-full transition-all flex items-center gap-1 ${identity.is_revealed ? 'bg-surface-container text-on-surface-variant cursor-not-allowed' : revealingId === identity.identity_id ? 'bg-surface-container text-on-surface-variant' : confirmRevealId === identity.identity_id ? 'bg-error-container/30 text-error animate-pulse' : // Custom: Improve contrast for dark mode
                                                `${theme === 'dark' ? 'bg-secondary text-on-secondary hover:bg-secondary/80' : 'bg-secondary-container/30 text-on-secondary-container hover:bg-secondary-container/50'}'`}`,
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "material-symbols-outlined text-sm",
                                                        children: identity.is_revealed ? 'check' : revealingId === identity.identity_id ? 'progress_activity' : confirmRevealId === identity.identity_id ? 'warning' : 'lock_open'
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/my-identities/page.tsx",
                                                        lineNumber: 419,
                                                        columnNumber: 21
                                                    }, this),
                                                    identity.is_revealed ? 'Revealed' : revealingId === identity.identity_id ? 'Revealing…' : confirmRevealId === identity.identity_id ? 'Confirm?' : 'Reveal'
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/app/my-identities/page.tsx",
                                                lineNumber: 413,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/app/my-identities/page.tsx",
                                        lineNumber: 408,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "mb-4",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "font-mono text-sm font-bold mb-1 truncate text-primary",
                                                children: [
                                                    identity.random_string.substring(0, 24),
                                                    "…"
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/app/my-identities/page.tsx",
                                                lineNumber: 428,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "text-xs text-on-surface-variant",
                                                children: identity.display_gender?.toUpperCase() || 'UNKNOWN'
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/my-identities/page.tsx",
                                                lineNumber: 431,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/app/my-identities/page.tsx",
                                        lineNumber: 427,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "rounded-2xl p-3 mb-4 bg-surface-container/50",
                                        children: [
                                            identity.target_user_id && identity.target_user && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "flex items-center gap-3",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                                        src: identity.target_user.dp_url || '/default-avatar.png',
                                                        alt: identity.target_user.name,
                                                        width: 36,
                                                        height: 36,
                                                        className: "rounded-full object-cover ring-2 ring-outline-variant/30"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/my-identities/page.tsx",
                                                        lineNumber: 439,
                                                        columnNumber: 23
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "min-w-0",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                className: "font-semibold text-sm truncate text-on-surface",
                                                                children: identity.target_user.name
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/app/my-identities/page.tsx",
                                                                lineNumber: 441,
                                                                columnNumber: 25
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                className: "text-xs truncate text-on-surface-variant",
                                                                children: identity.target_user.roll_no
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/app/my-identities/page.tsx",
                                                                lineNumber: 444,
                                                                columnNumber: 25
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/app/my-identities/page.tsx",
                                                        lineNumber: 440,
                                                        columnNumber: 23
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/app/my-identities/page.tsx",
                                                lineNumber: 438,
                                                columnNumber: 71
                                            }, this),
                                            identity.group_id && identity.target_group && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "flex items-center gap-3",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "w-9 h-9 rounded-full flex items-center justify-center text-base shrink-0 bg-tertiary-container",
                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            className: "material-symbols-outlined text-on-tertiary-container text-lg",
                                                            children: "groups"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/app/my-identities/page.tsx",
                                                            lineNumber: 451,
                                                            columnNumber: 25
                                                        }, this)
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/my-identities/page.tsx",
                                                        lineNumber: 450,
                                                        columnNumber: 23
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "min-w-0",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                className: "font-semibold text-sm truncate text-on-surface",
                                                                children: identity.target_group.group_name
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/app/my-identities/page.tsx",
                                                                lineNumber: 454,
                                                                columnNumber: 25
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                className: "text-xs text-on-surface-variant",
                                                                children: identity.target_group.is_public ? 'Public' : 'Private'
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/app/my-identities/page.tsx",
                                                                lineNumber: 457,
                                                                columnNumber: 25
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/app/my-identities/page.tsx",
                                                        lineNumber: 453,
                                                        columnNumber: 23
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/app/my-identities/page.tsx",
                                                lineNumber: 449,
                                                columnNumber: 66
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/app/my-identities/page.tsx",
                                        lineNumber: 437,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex items-center justify-between pt-3 border-t border-outline-variant/20",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "text-xs text-on-surface-variant",
                                                children: new Date(identity.created_at).toLocaleDateString()
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/my-identities/page.tsx",
                                                lineNumber: 466,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "text-xs font-medium flex items-center gap-1 text-primary",
                                                children: [
                                                    "Open chat ",
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "material-symbols-outlined text-sm",
                                                        children: "arrow_forward"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/my-identities/page.tsx",
                                                        lineNumber: 470,
                                                        columnNumber: 31
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/app/my-identities/page.tsx",
                                                lineNumber: 469,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/app/my-identities/page.tsx",
                                        lineNumber: 465,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, identity.identity_id, true, {
                                fileName: "[project]/src/app/my-identities/page.tsx",
                                lineNumber: 404,
                                columnNumber: 56
                            }, this))
                    }, void 0, false, {
                        fileName: "[project]/src/app/my-identities/page.tsx",
                        lineNumber: 403,
                        columnNumber: 57
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/app/my-identities/page.tsx",
                lineNumber: 310,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("nav", {
                className: "fixed bottom-2 left-1/2 -translate-x-1/2 flex justify-center items-center gap-1 p-1.5 z-50 bg-surface-container-high/90 dark:bg-surface-container/90 rounded-full backdrop-blur-md border border-outline-variant/30 shadow-[0_8px_24px_rgba(0,0,0,0.12)] dark:shadow-[0_8px_24px_rgba(0,0,0,0.3)]",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                        href: "/chat",
                        className: "w-12 h-12 flex items-center justify-center text-on-surface-variant rounded-full hover:scale-110 hover:text-primary hover:bg-surface-container-high transition-all duration-300",
                        title: "Chats",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            className: "material-symbols-outlined text-xl",
                            children: "chat_bubble"
                        }, void 0, false, {
                            fileName: "[project]/src/app/my-identities/page.tsx",
                            lineNumber: 480,
                            columnNumber: 9
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/app/my-identities/page.tsx",
                        lineNumber: 479,
                        columnNumber: 7
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                        href: "/my-groups",
                        className: "w-12 h-12 flex items-center justify-center text-on-surface-variant rounded-full hover:scale-110 hover:text-primary hover:bg-surface-container-high transition-all duration-300",
                        title: "Groups",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            className: "material-symbols-outlined text-xl",
                            children: "group"
                        }, void 0, false, {
                            fileName: "[project]/src/app/my-identities/page.tsx",
                            lineNumber: 484,
                            columnNumber: 9
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/app/my-identities/page.tsx",
                        lineNumber: 483,
                        columnNumber: 7
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                        href: "/dashboard",
                        className: "w-12 h-12 flex items-center justify-center text-on-surface-variant rounded-full hover:scale-110 hover:text-primary hover:bg-surface-container-high transition-all duration-300",
                        title: "Home",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            className: "material-symbols-outlined text-xl",
                            children: "home"
                        }, void 0, false, {
                            fileName: "[project]/src/app/my-identities/page.tsx",
                            lineNumber: 488,
                            columnNumber: 9
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/app/my-identities/page.tsx",
                        lineNumber: 487,
                        columnNumber: 7
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                        href: "/my-identities",
                        className: "w-12 h-12 flex items-center justify-center bg-primary-container text-on-primary-container rounded-full transition-all duration-300",
                        title: "IDs",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            className: "material-symbols-outlined text-xl",
                            style: {
                                fontVariationSettings: "'FILL' 1"
                            },
                            children: "badge"
                        }, void 0, false, {
                            fileName: "[project]/src/app/my-identities/page.tsx",
                            lineNumber: 492,
                            columnNumber: 9
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/app/my-identities/page.tsx",
                        lineNumber: 491,
                        columnNumber: 7
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                        href: "/profile/edit",
                        className: "w-12 h-12 flex items-center justify-center text-on-surface-variant rounded-full hover:scale-110 hover:text-primary hover:bg-surface-container-high transition-all duration-300",
                        title: "Settings",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            className: "material-symbols-outlined text-xl",
                            children: "settings"
                        }, void 0, false, {
                            fileName: "[project]/src/app/my-identities/page.tsx",
                            lineNumber: 498,
                            columnNumber: 9
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/app/my-identities/page.tsx",
                        lineNumber: 497,
                        columnNumber: 7
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/app/my-identities/page.tsx",
                lineNumber: 477,
                columnNumber: 5
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/app/my-identities/page.tsx",
        lineNumber: 215,
        columnNumber: 10
    }, this);
}
_s(MyAnonymousIdentities, "iU8higI8zxyb+D1Cu+v5CEX3mv0=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$contexts$2f$ThemeContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useTheme"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$contexts$2f$ToastContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useToast"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$contexts$2f$NotificationContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useNotifications"]
    ];
});
_c = MyAnonymousIdentities;
var _c;
__turbopack_context__.k.register(_c, "MyAnonymousIdentities");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=src_9b84dfe1._.js.map