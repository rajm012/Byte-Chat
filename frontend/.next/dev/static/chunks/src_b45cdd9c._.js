(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/src/services/request-dedupe.service.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "clearInFlightGetRequestDedupe",
    ()=>clearInFlightGetRequestDedupe,
    "dedupedGet",
    ()=>dedupedGet,
    "getInFlightGetDedupeStats",
    ()=>getInFlightGetDedupeStats
]);
const inFlightGetRequests = new Map();
function serializeParams(params) {
    if (!params || typeof params !== 'object') {
        return '';
    }
    const entries = Object.entries(params).filter(([, value])=>value !== undefined && value !== null).sort(([a], [b])=>a.localeCompare(b));
    return entries.map(([key, value])=>{
        if (Array.isArray(value)) {
            return `${key}=${value.map((item)=>String(item)).join(',')}`;
        }
        if (typeof value === 'object') {
            return `${key}=${JSON.stringify(value)}`;
        }
        return `${key}=${String(value)}`;
    }).join('&');
}
function buildGetRequestKey(client, url, config, namespace = 'default') {
    const baseUrl = client.defaults.baseURL ?? '';
    const params = serializeParams(config?.params);
    return `${namespace}|${baseUrl}|${url}|${params}`;
}
function clearInFlightGetRequestDedupe(namespacePrefix) {
    if (!namespacePrefix) {
        inFlightGetRequests.clear();
        return;
    }
    for (const key of inFlightGetRequests.keys()){
        if (key.startsWith(namespacePrefix)) {
            inFlightGetRequests.delete(key);
        }
    }
}
async function dedupedGet(client, url, config, options) {
    const namespace = options?.namespace ?? 'default';
    const key = buildGetRequestKey(client, url, config, namespace);
    const existing = inFlightGetRequests.get(key);
    if (existing) {
        return existing.promise;
    }
    const promise = client.get(url, config);
    inFlightGetRequests.set(key, {
        promise,
        startedAt: Date.now()
    });
    try {
        return await promise;
    } finally{
        const current = inFlightGetRequests.get(key);
        if (current && current.promise === promise) {
            inFlightGetRequests.delete(key);
        }
    }
}
function getInFlightGetDedupeStats(namespacePrefix) {
    const now = Date.now();
    const entries = Array.from(inFlightGetRequests.entries()).filter(([key])=>namespacePrefix ? key.startsWith(namespacePrefix) : true);
    if (entries.length === 0) {
        return {
            count: 0,
            oldestMs: 0
        };
    }
    const oldestMs = Math.max(0, ...entries.map(([, value])=>now - value.startedAt));
    return {
        count: entries.length,
        oldestMs
    };
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/services/chat.service.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "chatService",
    ()=>chatService
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$apiClient$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/apiClient.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$request$2d$dedupe$2e$service$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/services/request-dedupe.service.ts [app-client] (ecmascript)");
;
;
const api = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$apiClient$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"];
const CHAT_PREFIX = '/api/chat';
const CHAT_GET_DEDUPE_NAMESPACE = 'chat|';
const chatService = {
    async sendChatRequest (receiverId) {
        const response = await api.post(`${CHAT_PREFIX}/conversation`, {
            otherUserId: receiverId
        });
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$request$2d$dedupe$2e$service$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["clearInFlightGetRequestDedupe"])(CHAT_GET_DEDUPE_NAMESPACE);
        return response.data;
    },
    // Get pending chat requests
    async getChatRequests () {
        const response = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$request$2d$dedupe$2e$service$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["dedupedGet"])(api, `${CHAT_PREFIX}/requests`, undefined, {
            namespace: CHAT_GET_DEDUPE_NAMESPACE
        });
        return response.data.data;
    },
    // Respond to chat request
    async respondToChatRequest (requestId, action) {
        const response = await api.put(`${CHAT_PREFIX}/request/${requestId}`, {
            action
        });
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$request$2d$dedupe$2e$service$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["clearInFlightGetRequestDedupe"])(CHAT_GET_DEDUPE_NAMESPACE);
        return response.data;
    },
    // Get all conversations
    async getConversations () {
        const response = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$request$2d$dedupe$2e$service$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["dedupedGet"])(api, `${CHAT_PREFIX}/conversations`, undefined, {
            namespace: CHAT_GET_DEDUPE_NAMESPACE
        });
        return response.data.data;
    },
    // Get messages for a conversation
    async getMessages (conversationId, limit = 50, before, q, prefetchNext = true) {
        const response = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$request$2d$dedupe$2e$service$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["dedupedGet"])(api, `${CHAT_PREFIX}/conversation/${conversationId}/messages`, {
            params: {
                limit,
                before,
                q,
                prefetchNext
            }
        }, {
            namespace: CHAT_GET_DEDUPE_NAMESPACE
        });
        return response.data.data;
    },
    // Send message
    async sendMessage (data) {
        const response = await api.post(`${CHAT_PREFIX}/send`, data);
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$request$2d$dedupe$2e$service$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["clearInFlightGetRequestDedupe"])(CHAT_GET_DEDUPE_NAMESPACE);
        return response.data;
    },
    // Update message status
    async updateMessageStatus (messageId, status) {
        const response = await api.put(`${CHAT_PREFIX}/message/${messageId}/status`, {
            status
        });
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$request$2d$dedupe$2e$service$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["clearInFlightGetRequestDedupe"])(CHAT_GET_DEDUPE_NAMESPACE);
        return response.data;
    },
    // Delete message
    async deleteMessage (messageId, deleteFor = 'me') {
        const response = await api.delete(`${CHAT_PREFIX}/message/${messageId}`, {
            data: {
                deleteFor
            }
        });
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$request$2d$dedupe$2e$service$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["clearInFlightGetRequestDedupe"])(CHAT_GET_DEDUPE_NAMESPACE);
        return response.data;
    },
    // Block user in conversation
    async blockUser (conversationId) {
        const response = await api.post(`${CHAT_PREFIX}/block/${conversationId}`);
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$request$2d$dedupe$2e$service$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["clearInFlightGetRequestDedupe"])(CHAT_GET_DEDUPE_NAMESPACE);
        return response.data;
    },
    // Unblock user in conversation
    async unblockUser (conversationId) {
        const response = await api.delete(`${CHAT_PREFIX}/unblock/${conversationId}`);
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$request$2d$dedupe$2e$service$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["clearInFlightGetRequestDedupe"])(CHAT_GET_DEDUPE_NAMESPACE);
        return response.data;
    },
    // Report user (works for both regular and anonymous users)
    async reportUser (data) {
        // Normalize data - ensure we send reportType
        const reportData = {
            ...data,
            reportType: data.reportType || data.reason,
            description: data.description || data.reason || 'No description provided'
        };
        const response = await api.post(`${CHAT_PREFIX}/report`, reportData);
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$request$2d$dedupe$2e$service$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["clearInFlightGetRequestDedupe"])(CHAT_GET_DEDUPE_NAMESPACE);
        return response.data;
    },
    // Upload chat image
    async uploadImage (file) {
        const formData = new FormData();
        formData.append('image', file);
        const response = await api.post(`${CHAT_PREFIX}/upload-image`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        return response.data;
    },
    // Get participant public keys for E2EE
    async getParticipantPublicKeys (conversationId) {
        const response = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$request$2d$dedupe$2e$service$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["dedupedGet"])(api, `${CHAT_PREFIX}/${conversationId}/participants/keys`, undefined, {
            namespace: CHAT_GET_DEDUPE_NAMESPACE
        });
        return response.data.data;
    },
    // Store encrypted session keys
    async storeSessionKeys (data) {
        const response = await api.post(`${CHAT_PREFIX}/keys`, data);
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$request$2d$dedupe$2e$service$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["clearInFlightGetRequestDedupe"])(CHAT_GET_DEDUPE_NAMESPACE);
        return response.data.data;
    }
};
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/services/anonymous-chat.service.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "createAnonymousConversation",
    ()=>createAnonymousConversation,
    "default",
    ()=>__TURBOPACK__default__export__,
    "getAnonymousConversations",
    ()=>getAnonymousConversations,
    "getAnonymousMessages",
    ()=>getAnonymousMessages,
    "reportAnonymousUser",
    ()=>reportAnonymousUser,
    "revealAnonymousIdentity",
    ()=>revealAnonymousIdentity,
    "sendAnonymousMessage",
    ()=>sendAnonymousMessage,
    "updateAnonymousName",
    ()=>updateAnonymousName,
    "uploadAnonymousImage",
    ()=>uploadAnonymousImage
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/axios/lib/axios.js [app-client] (ecmascript)");
;
const API_URL = ("TURBOPACK compile-time value", "http://localhost:3001");
const api = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].create({
    baseURL: `${API_URL}/api/anonymous-chat`,
    withCredentials: true
});
const createAnonymousConversation = async (otherUserId)=>{
    const response = await api.post('/conversation', {
        otherUserId
    });
    return response.data.data;
};
const getAnonymousConversations = async ()=>{
    const response = await api.get('/conversations');
    return response.data.data;
};
const getAnonymousMessages = async (conversationId, limit, before)=>{
    const response = await api.get(`/conversation/${conversationId}/messages`, {
        params: {
            limit,
            before
        }
    });
    return response.data.data;
};
const sendAnonymousMessage = async (data)=>{
    const response = await api.post('/send', data);
    return response.data.data;
};
const revealAnonymousIdentity = async (conversationId)=>{
    const response = await api.post(`/reveal/${conversationId}`);
    return response.data.data;
};
const reportAnonymousUser = async (data)=>{
    // Use the main chat report endpoint (works for both regular and anonymous)
    const chatApi = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].create({
        baseURL: `${API_URL}/api/chat`,
        withCredentials: true
    });
    const response = await chatApi.post('/report', data);
    return response.data;
};
const uploadAnonymousImage = async (file)=>{
    const formData = new FormData();
    formData.append('image', file);
    const response = await api.post('/upload-image', formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    });
    return response.data;
};
const updateAnonymousName = async (identityId, customName)=>{
    const response = await api.put(`/identity/${identityId}/custom-name`, {
        customName
    });
    return response.data;
};
const anonymousChatService = {
    createAnonymousConversation,
    getAnonymousConversations,
    getAnonymousMessages,
    sendAnonymousMessage,
    revealAnonymousIdentity,
    reportAnonymousUser,
    uploadAnonymousImage,
    updateAnonymousName
};
const __TURBOPACK__default__export__ = anonymousChatService;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/app/chat/new/page.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>NewChatPage
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$chat$2e$service$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/services/chat.service.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$anonymous$2d$chat$2e$service$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/services/anonymous-chat.service.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
;
;
function NewChatPage() {
    _s();
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"])();
    const [searchParamsObj, setSearchParamsObj] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [status, setStatus] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('sending');
    const [error, setError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('');
    const [retrying, setRetrying] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const requestSentRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(false);
    const sendRequest = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "NewChatPage.useCallback[sendRequest]": async (receiverId, isAnonymous)=>{
            try {
                setStatus('sending');
                setError('');
                // Add timeout handler (15 seconds)
                const timeoutPromise = new Promise({
                    "NewChatPage.useCallback[sendRequest]": (_, reject)=>setTimeout({
                            "NewChatPage.useCallback[sendRequest]": ()=>reject(new Error('Request timeout. Please try again.'))
                        }["NewChatPage.useCallback[sendRequest]"], 15000)
                }["NewChatPage.useCallback[sendRequest]"]);
                // Use the appropriate service based on chat type
                let requestPromise;
                if (isAnonymous) {
                    requestPromise = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$anonymous$2d$chat$2e$service$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].createAnonymousConversation(receiverId);
                } else {
                    requestPromise = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$chat$2e$service$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["chatService"].sendChatRequest(receiverId);
                }
                const response_0 = await Promise.race([
                    requestPromise,
                    timeoutPromise
                ]);
                setStatus('success');
                // Extract conversationId based on response structure
                // Regular chat: response.data.conversationId
                // Anonymous chat: response.conversationId (already extracted .data.data)
                const conversationId = isAnonymous ? response_0.conversationId : response_0.data?.conversationId;
                setTimeout({
                    "NewChatPage.useCallback[sendRequest]": ()=>{
                        router.push(`/chat?conversationId=${conversationId}`);
                    }
                }["NewChatPage.useCallback[sendRequest]"], 500);
            } catch (err) {
                setStatus('error');
                let errorMsg = 'Failed to open chat. Please try again.';
                if (typeof err === 'object' && err !== null && 'response' in err && typeof err.response === 'object') {
                    const response = err.response;
                    if (response.status === 403) {
                        errorMsg = 'You cannot message this user. You may be blocked.';
                    } else if (response.status === 400) {
                        errorMsg = response.data?.message || 'Invalid request';
                    } else {
                        errorMsg = response.data?.message || errorMsg;
                    }
                } else if (typeof err === 'object' && err !== null && 'message' in err && typeof err.message === 'string') {
                    if (err.message.includes('timeout')) {
                        errorMsg = 'Connection timeout. Please check your internet and try again.';
                    }
                }
                setError(errorMsg);
            } finally{
                setRetrying(false);
            }
        }
    }["NewChatPage.useCallback[sendRequest]"], [
        router
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "NewChatPage.useEffect": ()=>{
            // Skip if request already sent (prevents double-call in React Strict Mode)
            if (requestSentRef.current) {
                return;
            }
            const userId = searchParamsObj?.get('userId');
            const isAnonymous_0 = searchParamsObj?.get('anonymous') === 'true';
            if (!userId) {
                setStatus('error');
                setError('Invalid user ID');
                return;
            }
            // Check if trying to message self
            const currentUser = localStorage.getItem('user');
            if (currentUser) {
                const user = JSON.parse(currentUser);
                if (user.user_id === userId) {
                    setStatus('error');
                    setError('You cannot send a message to yourself');
                    return;
                }
            }
            // Mark request as sent
            requestSentRef.current = true;
            sendRequest(userId, isAnonymous_0);
        }
    }["NewChatPage.useEffect"], [
        sendRequest,
        searchParamsObj
    ]);
    const handleRetry = ()=>{
        const userId_0 = searchParamsObj?.get('userId');
        const isAnonymous_1 = searchParamsObj?.get('anonymous') === 'true';
        if (userId_0) {
            setRetrying(true);
            requestSentRef.current = false; // Reset to allow retry
            sendRequest(userId_0, isAnonymous_1);
        }
    };
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "NewChatPage.useEffect": ()=>{
            const params = new URLSearchParams(window.location.search);
            setSearchParamsObj(params);
            const onPop = {
                "NewChatPage.useEffect.onPop": ()=>setSearchParamsObj(new URLSearchParams(window.location.search))
            }["NewChatPage.useEffect.onPop"];
            window.addEventListener('popstate', onPop);
            return ({
                "NewChatPage.useEffect": ()=>window.removeEventListener('popstate', onPop)
            })["NewChatPage.useEffect"];
        }
    }["NewChatPage.useEffect"], []);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "min-h-screen bg-mesh-warm antialiased flex items-center justify-center p-4",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "fixed inset-0 pointer-events-none -z-10 overflow-hidden",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "absolute top-[-10%] right-[-10%] w-96 h-96 bg-linear-to-br from-pink-300/15 to-transparent rounded-full blur-3xl"
                }, void 0, false, {
                    fileName: "[project]/src/app/chat/new/page.tsx",
                    lineNumber: 127,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/app/chat/new/page.tsx",
                lineNumber: 126,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "glass-strong rounded-3xl p-8 max-w-sm w-full text-center animate-scale-in",
                children: [
                    status === 'sending' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "w-16 h-16 rounded-full border-4 border-transparent mx-auto mb-5 animate-spin",
                                style: {
                                    borderTopColor: 'var(--pink)',
                                    borderRightColor: 'var(--coral)'
                                }
                            }, void 0, false, {
                                fileName: "[project]/src/app/chat/new/page.tsx",
                                lineNumber: 132,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                className: "text-xl font-bold mb-2",
                                style: {
                                    color: 'var(--heading)'
                                },
                                children: "Opening Chat…"
                            }, void 0, false, {
                                fileName: "[project]/src/app/chat/new/page.tsx",
                                lineNumber: 136,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-sm",
                                style: {
                                    color: 'var(--muted)'
                                },
                                children: "Please wait a moment"
                            }, void 0, false, {
                                fileName: "[project]/src/app/chat/new/page.tsx",
                                lineNumber: 139,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true),
                    status === 'success' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "w-16 h-16 rounded-full bg-emerald-500/15 flex items-center justify-center mx-auto mb-5",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "text-2xl",
                                    children: "✓"
                                }, void 0, false, {
                                    fileName: "[project]/src/app/chat/new/page.tsx",
                                    lineNumber: 146,
                                    columnNumber: 15
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/src/app/chat/new/page.tsx",
                                lineNumber: 145,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                className: "text-xl font-bold mb-2",
                                style: {
                                    color: 'var(--heading)'
                                },
                                children: "Chat Ready!"
                            }, void 0, false, {
                                fileName: "[project]/src/app/chat/new/page.tsx",
                                lineNumber: 148,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-sm",
                                style: {
                                    color: 'var(--muted)'
                                },
                                children: "Opening conversation…"
                            }, void 0, false, {
                                fileName: "[project]/src/app/chat/new/page.tsx",
                                lineNumber: 151,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true),
                    status === 'error' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "w-16 h-16 rounded-full bg-red-500/15 flex items-center justify-center mx-auto mb-5",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "text-2xl",
                                    children: "!"
                                }, void 0, false, {
                                    fileName: "[project]/src/app/chat/new/page.tsx",
                                    lineNumber: 158,
                                    columnNumber: 15
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/src/app/chat/new/page.tsx",
                                lineNumber: 157,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                className: "text-xl font-bold mb-2",
                                style: {
                                    color: 'var(--heading)'
                                },
                                children: "Request Failed"
                            }, void 0, false, {
                                fileName: "[project]/src/app/chat/new/page.tsx",
                                lineNumber: 160,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-sm mb-6 text-red-400",
                                children: error
                            }, void 0, false, {
                                fileName: "[project]/src/app/chat/new/page.tsx",
                                lineNumber: 163,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex gap-3 justify-center",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        onClick: handleRetry,
                                        disabled: retrying,
                                        className: "btn-romance px-5 py-2.5 text-sm flex items-center gap-2 disabled:opacity-60",
                                        children: retrying ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/chat/new/page.tsx",
                                                    lineNumber: 166,
                                                    columnNumber: 31
                                                }, this),
                                                " Retrying…"
                                            ]
                                        }, void 0, true) : '↺ Try Again'
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/chat/new/page.tsx",
                                        lineNumber: 165,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        onClick: ()=>router.push('/dashboard'),
                                        className: "btn-ghost px-5 py-2.5 text-sm",
                                        children: "Dashboard"
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/chat/new/page.tsx",
                                        lineNumber: 168,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/chat/new/page.tsx",
                                lineNumber: 164,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true)
                ]
            }, void 0, true, {
                fileName: "[project]/src/app/chat/new/page.tsx",
                lineNumber: 130,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/app/chat/new/page.tsx",
        lineNumber: 124,
        columnNumber: 10
    }, this);
}
_s(NewChatPage, "gkXX04f9E0Zueu2pbAZCgm081y0=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"]
    ];
});
_c = NewChatPage;
var _c;
__turbopack_context__.k.register(_c, "NewChatPage");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=src_b45cdd9c._.js.map