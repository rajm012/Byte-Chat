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
"[project]/src/services/message-management.service.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "messageManagementService",
    ()=>messageManagementService
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/axios/lib/axios.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$apiBase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/services/apiBase.ts [app-client] (ecmascript)");
;
;
const API_URL = `${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$apiBase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["API_BASE_URL"]}/api/messages`;
const messageManagementService = {
    // ========== REACTIONS ==========
    async addReaction (messageId, emoji, token) {
        const response = await __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].post(`${API_URL}/message/${messageId}/reaction`, {
            emoji
        }, {
            withCredentials: true
        });
        return response.data;
    },
    async removeReaction (messageId, emoji, token) {
        const response = await __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].delete(`${API_URL}/message/${messageId}/reaction`, {
            data: {
                emoji
            },
            withCredentials: true
        });
        return response.data;
    },
    async getReactions (messageId, token) {
        const response = await __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].get(`${API_URL}/message/${messageId}/reactions`, {
            withCredentials: true
        });
        return response.data;
    },
    // ========== EDITING ==========
    async editMessage (messageId, encryptedContent, contentIv, contentAuthTag, token) {
        const response = await __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].put(`${API_URL}/message/${messageId}/edit`, {
            encryptedContent,
            contentIv,
            contentAuthTag
        }, {
            withCredentials: true
        });
        return response.data;
    },
    async getEditHistory (messageId, token) {
        const response = await __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].get(`${API_URL}/message/${messageId}/history`, {
            withCredentials: true
        });
        return response.data;
    },
    // ========== DELETION ==========
    async deleteMessage (messageId, deleteForEveryone, token) {
        const response = await __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].delete(`${API_URL}/message/${messageId}/delete`, {
            data: {
                deleteForEveryone
            },
            withCredentials: true
        });
        return response.data;
    }
};
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/hooks/usePresence.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "usePresence",
    ()=>usePresence
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$contexts$2f$SocketContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/contexts/SocketContext.tsx [app-client] (ecmascript)");
var _s = __turbopack_context__.k.signature();
'use client';
;
;
const API_URL = ("TURBOPACK compile-time value", "http://localhost:3001");
function usePresence(userIds) {
    _s();
    const [onlineSet, setOnlineSet] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(new Set());
    const { getSocket, isConnected } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$contexts$2f$SocketContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSocket"])();
    const listenersAttached = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(false);
    // Fetch initial presence snapshot from Redis
    const fetchPresence = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "usePresence.useCallback[fetchPresence]": async (ids)=>{
            if (ids.length === 0) return;
            try {
                const res = await fetch(`${API_URL}/api/chat/presence`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    credentials: 'include',
                    body: JSON.stringify({
                        userIds: ids
                    })
                });
                if (!res.ok) return;
                const json = await res.json();
                const presence = json.data?.presence ?? {};
                const online = new Set(Object.entries(presence).filter({
                    "usePresence.useCallback[fetchPresence]": ([, v])=>v
                }["usePresence.useCallback[fetchPresence]"]).map({
                    "usePresence.useCallback[fetchPresence]": ([k])=>k
                }["usePresence.useCallback[fetchPresence]"]));
                setOnlineSet(online);
            } catch  {
            // silently ignore network errors — not critical
            }
        }
    }["usePresence.useCallback[fetchPresence]"], []);
    // Fetch on mount / when the user list changes
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "usePresence.useEffect": ()=>{
            fetchPresence(userIds);
        // eslint-disable-next-line react-hooks/exhaustive-deps
        }
    }["usePresence.useEffect"], [
        userIds.join(',')
    ]);
    // Subscribe to real-time socket events
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "usePresence.useEffect": ()=>{
            if (!isConnected) return;
            const socket = getSocket();
            if (!socket || listenersAttached.current) return;
            const handleOnline = {
                "usePresence.useEffect.handleOnline": ({ userId })=>{
                    setOnlineSet({
                        "usePresence.useEffect.handleOnline": (prev)=>{
                            const next = new Set(prev);
                            next.add(userId);
                            return next;
                        }
                    }["usePresence.useEffect.handleOnline"]);
                }
            }["usePresence.useEffect.handleOnline"];
            const handleOffline = {
                "usePresence.useEffect.handleOffline": ({ userId })=>{
                    setOnlineSet({
                        "usePresence.useEffect.handleOffline": (prev)=>{
                            const next = new Set(prev);
                            next.delete(userId);
                            return next;
                        }
                    }["usePresence.useEffect.handleOffline"]);
                }
            }["usePresence.useEffect.handleOffline"];
            socket.on('user-online', handleOnline);
            socket.on('user-offline', handleOffline);
            listenersAttached.current = true;
            return ({
                "usePresence.useEffect": ()=>{
                    socket.off('user-online', handleOnline);
                    socket.off('user-offline', handleOffline);
                    listenersAttached.current = false;
                }
            })["usePresence.useEffect"];
        }
    }["usePresence.useEffect"], [
        isConnected,
        getSocket
    ]);
    return onlineSet;
}
_s(usePresence, "ILiH2Qm0LQcAhwzEH8CUW3Keo1w=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$contexts$2f$SocketContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSocket"]
    ];
});
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/utils/e2ee.utils.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "decryptKeyWithPrivateKey",
    ()=>decryptKeyWithPrivateKey,
    "decryptMessageAES",
    ()=>decryptMessageAES,
    "decryptPrivateKey",
    ()=>decryptPrivateKey,
    "encryptKeyWithPublicKey",
    ()=>encryptKeyWithPublicKey,
    "encryptMessageAES",
    ()=>encryptMessageAES,
    "encryptPrivateKey",
    ()=>encryptPrivateKey,
    "exportKeyToBase64",
    ()=>exportKeyToBase64,
    "generateAESKey",
    ()=>generateAESKey,
    "generateUserKeyPair",
    ()=>generateUserKeyPair,
    "importKeyFromBase64",
    ()=>importKeyFromBase64,
    "importPrivateKey",
    ()=>importPrivateKey,
    "importPublicKey",
    ()=>importPublicKey
]);
// Helper to ensure ArrayBuffer from Uint8Array (handles ArrayBufferLike)
function toArrayBuffer(u8) {
    const ab = new ArrayBuffer(u8.byteLength);
    new Uint8Array(ab).set(u8);
    return ab;
}
/**
 * E2EE Utilities (Web Crypto API)
 * Strictly aligned with the specifications in 'Curr' design document.
 */ const PBKDF2_ITERATIONS = 100000;
const PBKDF2_HASH = 'SHA-256';
async function generateUserKeyPair() {
    const keyPair = await window.crypto.subtle.generateKey({
        name: 'RSA-OAEP',
        modulusLength: 2048,
        publicExponent: new Uint8Array([
            1,
            0,
            1
        ]),
        hash: 'SHA-256'
    }, true, [
        'encrypt',
        'decrypt'
    ]);
    const publicKeyBuf = await window.crypto.subtle.exportKey('spki', keyPair.publicKey);
    const privateKeyBuf = await window.crypto.subtle.exportKey('pkcs8', keyPair.privateKey);
    return {
        publicKey: arrayBufferToPem(publicKeyBuf, 'PUBLIC KEY'),
        privateKey: arrayBufferToPem(privateKeyBuf, 'PRIVATE KEY')
    };
}
/**
 * Derive an encryption key from a password using PBKDF2
 */ async function deriveKeyFromPassword(password, salt) {
    const enc = new TextEncoder();
    const encodedPassword = enc.encode(password);
    const keyMaterial = await window.crypto.subtle.importKey('raw', new Uint8Array(encodedPassword), {
        name: 'PBKDF2'
    }, false, [
        'deriveKey'
    ]);
    return window.crypto.subtle.deriveKey({
        name: 'PBKDF2',
        salt: new Uint8Array(salt),
        iterations: PBKDF2_ITERATIONS,
        hash: PBKDF2_HASH
    }, keyMaterial, {
        name: 'AES-GCM',
        length: 256
    }, false, [
        'encrypt',
        'decrypt'
    ]);
}
async function encryptPrivateKey(privateKeyPem, password) {
    const enc = new TextEncoder();
    const salt = window.crypto.getRandomValues(new Uint8Array(16));
    const iv = window.crypto.getRandomValues(new Uint8Array(12));
    const key = await deriveKeyFromPassword(password, salt);
    const encrypted = await window.crypto.subtle.encrypt({
        name: 'AES-GCM',
        iv: toArrayBuffer(iv)
    }, key, enc.encode(privateKeyPem));
    // Output format: salt_b64:iv_b64:data_b64
    return `${bufToBase64(salt.buffer)}:${bufToBase64(iv.buffer)}:${bufToBase64(encrypted)}`;
}
async function decryptPrivateKey(encryptedData, password) {
    const [saltB64, ivB64, dataB64] = encryptedData.split(':');
    if (!saltB64 || !ivB64 || !dataB64) throw new Error('Invalid encrypted key format');
    const salt = base64ToBuf(saltB64);
    const iv = base64ToBuf(ivB64);
    const data = base64ToBuf(dataB64);
    const key = await deriveKeyFromPassword(password, salt);
    const decrypted = await window.crypto.subtle.decrypt({
        name: 'AES-GCM',
        iv: toArrayBuffer(iv)
    }, key, toArrayBuffer(data));
    return new TextDecoder().decode(decrypted);
}
async function generateAESKey() {
    return window.crypto.subtle.generateKey({
        name: 'AES-GCM',
        length: 256
    }, true, [
        'encrypt',
        'decrypt'
    ]);
}
async function exportKeyToBase64(key) {
    const exported = await window.crypto.subtle.exportKey('raw', key);
    return bufToBase64(exported);
}
async function importKeyFromBase64(base64Key) {
    const buf = base64ToBuf(base64Key);
    return window.crypto.subtle.importKey('raw', toArrayBuffer(buf), {
        name: 'AES-GCM',
        length: 256
    }, true, [
        'encrypt',
        'decrypt'
    ]);
}
async function encryptKeyWithPublicKey(aesKeyBase64, publicKeyPem) {
    const pubKey = await importPublicKey(publicKeyPem);
    const aesKeyBuf = base64ToBuf(aesKeyBase64);
    const encrypted = await window.crypto.subtle.encrypt({
        name: 'RSA-OAEP'
    }, pubKey, toArrayBuffer(aesKeyBuf));
    return bufToBase64(encrypted);
}
async function decryptKeyWithPrivateKey(privateKey, encryptedKeyB64) {
    const encryptedKeyBuf = base64ToBuf(encryptedKeyB64);
    const decrypted = await window.crypto.subtle.decrypt({
        name: 'RSA-OAEP'
    }, privateKey, toArrayBuffer(encryptedKeyBuf));
    return bufToBase64(decrypted);
}
async function encryptMessageAES(text, aesKey) {
    const enc = new TextEncoder();
    const iv = window.crypto.getRandomValues(new Uint8Array(12));
    const encrypted = await window.crypto.subtle.encrypt({
        name: 'AES-GCM',
        iv
    }, aesKey, enc.encode(text));
    // Symmetric encryption with GCM: last 16 bytes are the auth tag
    const combined = new Uint8Array(encrypted);
    const ciphertext = combined.slice(0, combined.length - 16);
    const authTag = combined.slice(combined.length - 16);
    return {
        ciphertext: bufToBase64(ciphertext.buffer),
        iv: bufToBase64(iv.buffer),
        authTag: bufToBase64(authTag.buffer)
    };
}
async function decryptMessageAES(ciphertext, iv, authTag, aesKey) {
    const cipherBuf = base64ToBuf(ciphertext);
    const ivBuf = base64ToBuf(iv);
    const tagBuf = base64ToBuf(authTag);
    const combined = new Uint8Array(cipherBuf.length + tagBuf.length);
    combined.set(new Uint8Array(cipherBuf));
    combined.set(new Uint8Array(tagBuf), cipherBuf.length);
    const decrypted = await window.crypto.subtle.decrypt({
        name: 'AES-GCM',
        iv: toArrayBuffer(ivBuf)
    }, aesKey, toArrayBuffer(combined));
    return new TextDecoder().decode(decrypted);
}
function bufToBase64(buf) {
    return btoa(String.fromCharCode(...new Uint8Array(buf)));
}
function base64ToBuf(b64) {
    const binary = atob(b64);
    const len = binary.length;
    const buf = new Uint8Array(len);
    for(let i = 0; i < len; i++){
        buf[i] = binary.charCodeAt(i);
    }
    return buf;
}
function arrayBufferToPem(buf, type) {
    const b64 = bufToBase64(buf);
    const lines = b64.match(/.{1,64}/g)?.join('\n') || '';
    return `-----BEGIN ${type}-----\n${lines}\n-----END ${type}-----`;
}
async function importPublicKey(pem) {
    const b64 = pem.replace(/-----BEGIN PUBLIC KEY-----|-----END PUBLIC KEY-----|\n|\r/g, '');
    const buf = base64ToBuf(b64);
    const keyBuffer = toArrayBuffer(buf);
    return window.crypto.subtle.importKey('spki', keyBuffer, {
        name: 'RSA-OAEP',
        hash: 'SHA-256'
    }, false, [
        'encrypt'
    ]);
}
async function importPrivateKey(pem) {
    const b64 = pem.replace(/-----BEGIN PRIVATE KEY-----|-----END PRIVATE KEY-----|\n|\r/g, '');
    const buf = base64ToBuf(b64);
    const keyBuffer = new Uint8Array(buf).buffer;
    return window.crypto.subtle.importKey('pkcs8', keyBuffer, {
        name: 'RSA-OAEP',
        hash: 'SHA-256'
    }, false, [
        'decrypt'
    ]);
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/app/chat/page.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>ChatPage
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/compiler-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/client/app-dir/link.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$chat$2e$service$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/services/chat.service.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$anonymous$2d$chat$2e$service$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/services/anonymous-chat.service.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$message$2d$management$2e$service$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/services/message-management.service.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/image.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$hooks$2f$usePresence$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/hooks/usePresence.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$contexts$2f$SocketContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/contexts/SocketContext.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$e2ee$2e$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/utils/e2ee.utils.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature();
'use client';
;
;
;
;
;
;
;
;
;
;
;
const formatDateHeader = (dateString)=>{
    const date = new Date(dateString);
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const messageDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    if (messageDate.getTime() === today.getTime()) return 'Today';
    if (messageDate.getTime() === yesterday.getTime()) return 'Yesterday';
    return date.toLocaleDateString([], {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
    });
};
const formatTimeCompact = (dateString)=>{
    const date = new Date(dateString);
    return date.toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
    });
};
// Typing indicator component (animated dots)
function TypingIndicator() {
    const $ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["c"])(4);
    if ($[0] !== "d020ab648e3584265a7f338bf1a1f1ea9c4ede711300a98d3d1505a8087e77a7") {
        for(let $i = 0; $i < 4; $i += 1){
            $[$i] = Symbol.for("react.memo_cache_sentinel");
        }
        $[0] = "d020ab648e3584265a7f338bf1a1f1ea9c4ede711300a98d3d1505a8087e77a7";
    }
    let t0;
    if ($[1] === Symbol.for("react.memo_cache_sentinel")) {
        t0 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
            className: "w-2 h-2 bg-[#6f787d] dark:bg-[#bfc8cd] rounded-full animate-bounce",
            style: {
                animationDelay: "0ms"
            }
        }, void 0, false, {
            fileName: "[project]/src/app/chat/page.tsx",
            lineNumber: 132,
            columnNumber: 10
        }, this);
        $[1] = t0;
    } else {
        t0 = $[1];
    }
    let t1;
    if ($[2] === Symbol.for("react.memo_cache_sentinel")) {
        t1 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
            className: "w-2 h-2 bg-[#6f787d] dark:bg-[#bfc8cd] rounded-full animate-bounce",
            style: {
                animationDelay: "150ms"
            }
        }, void 0, false, {
            fileName: "[project]/src/app/chat/page.tsx",
            lineNumber: 141,
            columnNumber: 10
        }, this);
        $[2] = t1;
    } else {
        t1 = $[2];
    }
    let t2;
    if ($[3] === Symbol.for("react.memo_cache_sentinel")) {
        t2 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "flex items-center gap-1 mt-1",
            children: [
                t0,
                t1,
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                    className: "w-2 h-2 bg-[#6f787d] dark:bg-[#bfc8cd] rounded-full animate-bounce",
                    style: {
                        animationDelay: "300ms"
                    }
                }, void 0, false, {
                    fileName: "[project]/src/app/chat/page.tsx",
                    lineNumber: 150,
                    columnNumber: 64
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/src/app/chat/page.tsx",
            lineNumber: 150,
            columnNumber: 10
        }, this);
        $[3] = t2;
    } else {
        t2 = $[3];
    }
    return t2;
}
_c = TypingIndicator;
function MessageItem(t0) {
    _s();
    const $ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["c"])(93);
    if ($[0] !== "d020ab648e3584265a7f338bf1a1f1ea9c4ede711300a98d3d1505a8087e77a7") {
        for(let $i = 0; $i < 93; $i += 1){
            $[$i] = Symbol.for("react.memo_cache_sentinel");
        }
        $[0] = "d020ab648e3584265a7f338bf1a1f1ea9c4ede711300a98d3d1505a8087e77a7";
    }
    const { msg, onReply, onEdit, onDelete, onReact, formatTime } = t0;
    const [showActions, setShowActions] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [isEditing, setIsEditing] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [editContent, setEditContent] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(msg.encrypted_content || "");
    const [showDeleteDialog, setShowDeleteDialog] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [showEmojiPicker, setShowEmojiPicker] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const emojiPickerRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const isMyMessage = msg.is_my_message;
    let t1;
    if ($[1] !== msg.created_at) {
        t1 = ({
            "MessageItem[useState()]": ()=>Date.now() - new Date(msg.created_at).getTime()
        })["MessageItem[useState()]"];
        $[1] = msg.created_at;
        $[2] = t1;
    } else {
        t1 = $[2];
    }
    const [messageAge, setMessageAge] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(t1);
    let t2;
    let t3;
    if ($[3] !== msg.created_at) {
        t2 = ({
            "MessageItem[useEffect()]": ()=>{
                const interval = setInterval({
                    "MessageItem[useEffect() > setInterval()]": ()=>{
                        setMessageAge(Date.now() - new Date(msg.created_at).getTime());
                    }
                }["MessageItem[useEffect() > setInterval()]"], 1000);
                return ()=>clearInterval(interval);
            }
        })["MessageItem[useEffect()]"];
        t3 = [
            msg.created_at
        ];
        $[3] = msg.created_at;
        $[4] = t2;
        $[5] = t3;
    } else {
        t2 = $[4];
        t3 = $[5];
    }
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])(t2, t3);
    const canDeleteForEveryone = isMyMessage && messageAge <= 172800000;
    let t4;
    if ($[6] !== editContent || $[7] !== msg.encrypted_content || $[8] !== msg.message_id || $[9] !== onEdit) {
        t4 = ({
            "MessageItem[handleEditSubmit]": ()=>{
                if (editContent.trim() && editContent !== msg.encrypted_content) {
                    onEdit?.(msg.message_id, editContent);
                }
                setIsEditing(false);
            }
        })["MessageItem[handleEditSubmit]"];
        $[6] = editContent;
        $[7] = msg.encrypted_content;
        $[8] = msg.message_id;
        $[9] = onEdit;
        $[10] = t4;
    } else {
        t4 = $[10];
    }
    const handleEditSubmit = t4;
    let t5;
    if ($[11] === Symbol.for("react.memo_cache_sentinel")) {
        t5 = [
            "\uD83D\uDC4D",
            "\u2764\uFE0F",
            "\uD83D\uDE02",
            "\uD83D\uDE2E",
            "\uD83D\uDE22",
            "\uD83D\uDE4F",
            "\uD83C\uDF89",
            "\uD83D\uDD25"
        ];
        $[11] = t5;
    } else {
        t5 = $[11];
    }
    const EMOJI_OPTIONS = t5;
    let t6;
    let t7;
    if ($[12] !== showEmojiPicker) {
        t6 = ({
            "MessageItem[useEffect()]": ()=>{
                if (!showEmojiPicker) {
                    return;
                }
                const handleClickOutside = {
                    "MessageItem[useEffect() > handleClickOutside]": (e)=>{
                        if (emojiPickerRef.current && !emojiPickerRef.current.contains(e.target)) {
                            setShowEmojiPicker(false);
                        }
                    }
                }["MessageItem[useEffect() > handleClickOutside]"];
                document.addEventListener("mousedown", handleClickOutside);
                return ()=>document.removeEventListener("mousedown", handleClickOutside);
            }
        })["MessageItem[useEffect()]"];
        t7 = [
            showEmojiPicker
        ];
        $[12] = showEmojiPicker;
        $[13] = t6;
        $[14] = t7;
    } else {
        t6 = $[13];
        t7 = $[14];
    }
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])(t6, t7);
    const t8 = `flex ${isMyMessage ? "justify-end" : "justify-start"} group relative mb-1`;
    let t10;
    let t9;
    if ($[15] === Symbol.for("react.memo_cache_sentinel")) {
        t9 = ({
            "MessageItem[<div>.onMouseEnter]": ()=>setShowActions(true)
        })["MessageItem[<div>.onMouseEnter]"];
        t10 = ({
            "MessageItem[<div>.onMouseLeave]": ()=>{
                setShowActions(false);
            }
        })["MessageItem[<div>.onMouseLeave]"];
        $[15] = t10;
        $[16] = t9;
    } else {
        t10 = $[15];
        t9 = $[16];
    }
    const t11 = `flex items-center gap-0.5 self-center shrink-0 transition-all duration-150
            ${showActions ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}
            ${isMyMessage ? "order-first mr-1.5" : "order-last ml-1.5"}`;
    let t12;
    if ($[17] !== showEmojiPicker) {
        t12 = ({
            "MessageItem[<button>.onClick]": ()=>setShowEmojiPicker(!showEmojiPicker)
        })["MessageItem[<button>.onClick]"];
        $[17] = showEmojiPicker;
        $[18] = t12;
    } else {
        t12 = $[18];
    }
    let t13;
    if ($[19] === Symbol.for("react.memo_cache_sentinel")) {
        t13 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
            className: "material-symbols-outlined text-[14px] text-[#6f787d]",
            children: "sentiment_satisfied"
        }, void 0, false, {
            fileName: "[project]/src/app/chat/page.tsx",
            lineNumber: 304,
            columnNumber: 11
        }, this);
        $[19] = t13;
    } else {
        t13 = $[19];
    }
    let t14;
    if ($[20] !== t12) {
        t14 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
            onClick: t12,
            className: "w-7 h-7 rounded-full bg-white/60 flex items-center justify-center text-base hover:scale-110 active:scale-95 transition-transform",
            children: t13
        }, void 0, false, {
            fileName: "[project]/src/app/chat/page.tsx",
            lineNumber: 311,
            columnNumber: 11
        }, this);
        $[20] = t12;
        $[21] = t14;
    } else {
        t14 = $[21];
    }
    let t15;
    if ($[22] === Symbol.for("react.memo_cache_sentinel")) {
        t15 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "absolute bottom-full left-1/2 -translate-x-1/2 mb-1 px-2 py-1 bg-gray-800 text-white text-[10px] rounded opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-150 whitespace-nowrap z-50 pointer-events-none",
            children: [
                "React",
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-800"
                }, void 0, false, {
                    fileName: "[project]/src/app/chat/page.tsx",
                    lineNumber: 319,
                    columnNumber: 273
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/src/app/chat/page.tsx",
            lineNumber: 319,
            columnNumber: 11
        }, this);
        $[22] = t15;
    } else {
        t15 = $[22];
    }
    let t16;
    if ($[23] !== t14) {
        t16 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "relative group",
            children: [
                t14,
                t15
            ]
        }, void 0, true, {
            fileName: "[project]/src/app/chat/page.tsx",
            lineNumber: 326,
            columnNumber: 11
        }, this);
        $[23] = t14;
        $[24] = t16;
    } else {
        t16 = $[24];
    }
    let t17;
    if ($[25] !== msg || $[26] !== onReply) {
        t17 = ({
            "MessageItem[<button>.onClick]": ()=>onReply?.(msg)
        })["MessageItem[<button>.onClick]"];
        $[25] = msg;
        $[26] = onReply;
        $[27] = t17;
    } else {
        t17 = $[27];
    }
    let t18;
    if ($[28] === Symbol.for("react.memo_cache_sentinel")) {
        t18 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
            className: "material-symbols-outlined text-[14px] text-[#6f787d]",
            children: "reply"
        }, void 0, false, {
            fileName: "[project]/src/app/chat/page.tsx",
            lineNumber: 345,
            columnNumber: 11
        }, this);
        $[28] = t18;
    } else {
        t18 = $[28];
    }
    let t19;
    if ($[29] !== t17) {
        t19 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
            onClick: t17,
            className: "w-7 h-7 rounded-full bg-white/60 flex items-center justify-center hover:scale-110 active:scale-95 transition-transform",
            children: t18
        }, void 0, false, {
            fileName: "[project]/src/app/chat/page.tsx",
            lineNumber: 352,
            columnNumber: 11
        }, this);
        $[29] = t17;
        $[30] = t19;
    } else {
        t19 = $[30];
    }
    let t20;
    if ($[31] === Symbol.for("react.memo_cache_sentinel")) {
        t20 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "absolute bottom-full left-1/2 -translate-x-1/2 mb-1 px-2 py-1 bg-gray-800 text-white text-[10px] rounded opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-150 whitespace-nowrap z-50 pointer-events-none",
            children: [
                "Reply",
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-800"
                }, void 0, false, {
                    fileName: "[project]/src/app/chat/page.tsx",
                    lineNumber: 360,
                    columnNumber: 273
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/src/app/chat/page.tsx",
            lineNumber: 360,
            columnNumber: 11
        }, this);
        $[31] = t20;
    } else {
        t20 = $[31];
    }
    let t21;
    if ($[32] !== t19) {
        t21 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "relative group",
            children: [
                t19,
                t20
            ]
        }, void 0, true, {
            fileName: "[project]/src/app/chat/page.tsx",
            lineNumber: 367,
            columnNumber: 11
        }, this);
        $[32] = t19;
        $[33] = t21;
    } else {
        t21 = $[33];
    }
    let t22;
    if ($[34] !== isMyMessage) {
        t22 = isMyMessage && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "relative group",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                    onClick: {
                        "MessageItem[<button>.onClick]": ()=>setIsEditing(true)
                    }["MessageItem[<button>.onClick]"],
                    className: "w-7 h-7 rounded-full bg-white/60 flex items-center justify-center hover:scale-110 active:scale-95 transition-transform",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "material-symbols-outlined text-[14px] text-[#6f787d]",
                        children: "edit"
                    }, void 0, false, {
                        fileName: "[project]/src/app/chat/page.tsx",
                        lineNumber: 377,
                        columnNumber: 174
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/src/app/chat/page.tsx",
                    lineNumber: 375,
                    columnNumber: 58
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "absolute bottom-full left-1/2 -translate-x-1/2 mb-1 px-2 py-1 bg-gray-800 text-white text-[10px] rounded opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-150 whitespace-nowrap z-50 pointer-events-none",
                    children: [
                        "Edit",
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-800"
                        }, void 0, false, {
                            fileName: "[project]/src/app/chat/page.tsx",
                            lineNumber: 377,
                            columnNumber: 526
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/app/chat/page.tsx",
                    lineNumber: 377,
                    columnNumber: 265
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/src/app/chat/page.tsx",
            lineNumber: 375,
            columnNumber: 26
        }, this);
        $[34] = isMyMessage;
        $[35] = t22;
    } else {
        t22 = $[35];
    }
    let t23;
    if ($[36] !== isMyMessage) {
        t23 = isMyMessage && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "relative group",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                    onClick: {
                        "MessageItem[<button>.onClick]": ()=>setShowDeleteDialog(true)
                    }["MessageItem[<button>.onClick]"],
                    className: "w-7 h-7 rounded-full bg-white/60 flex items-center justify-center hover:scale-110 active:scale-95 transition-transform",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "material-symbols-outlined text-[14px] text-red-500",
                        children: "delete"
                    }, void 0, false, {
                        fileName: "[project]/src/app/chat/page.tsx",
                        lineNumber: 387,
                        columnNumber: 174
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/src/app/chat/page.tsx",
                    lineNumber: 385,
                    columnNumber: 58
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "absolute bottom-full left-1/2 -translate-x-1/2 mb-1 px-2 py-1 bg-gray-800 text-white text-[10px] rounded opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-150 whitespace-nowrap z-50 pointer-events-none",
                    children: [
                        "Delete",
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-800"
                        }, void 0, false, {
                            fileName: "[project]/src/app/chat/page.tsx",
                            lineNumber: 387,
                            columnNumber: 528
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/app/chat/page.tsx",
                    lineNumber: 387,
                    columnNumber: 265
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/src/app/chat/page.tsx",
            lineNumber: 385,
            columnNumber: 26
        }, this);
        $[36] = isMyMessage;
        $[37] = t23;
    } else {
        t23 = $[37];
    }
    let t24;
    if ($[38] !== t11 || $[39] !== t16 || $[40] !== t21 || $[41] !== t22 || $[42] !== t23) {
        t24 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: t11,
            children: [
                t16,
                t21,
                t22,
                t23
            ]
        }, void 0, true, {
            fileName: "[project]/src/app/chat/page.tsx",
            lineNumber: 395,
            columnNumber: 11
        }, this);
        $[38] = t11;
        $[39] = t16;
        $[40] = t21;
        $[41] = t22;
        $[42] = t23;
        $[43] = t24;
    } else {
        t24 = $[43];
    }
    let t25;
    if ($[44] !== isMyMessage || $[45] !== msg.message_id || $[46] !== onReact || $[47] !== showEmojiPicker) {
        t25 = showEmojiPicker && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            ref: emojiPickerRef,
            className: `absolute z-50 bg-white dark:bg-[#004040] rounded-xl p-2 shadow-xl flex gap-1 animate-scale-in ${isMyMessage ? "right-0" : "left-0"}`,
            style: {
                bottom: "100%",
                marginBottom: "8px"
            },
            onMouseEnter: _MessageItemDivOnMouseEnter,
            children: EMOJI_OPTIONS.map({
                "MessageItem[EMOJI_OPTIONS.map()]": (emoji)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: {
                            "MessageItem[EMOJI_OPTIONS.map() > <button>.onClick]": (e_1)=>{
                                e_1.stopPropagation();
                                onReact?.(msg.message_id, emoji);
                                setShowEmojiPicker(false);
                            }
                        }["MessageItem[EMOJI_OPTIONS.map() > <button>.onClick]"],
                        className: "w-8 h-8 rounded-lg text-lg flex items-center justify-center hover:scale-125 active:scale-95 transition-transform hover:bg-gray-100 dark:hover:bg-[#005555]",
                        children: emoji
                    }, emoji, false, {
                        fileName: "[project]/src/app/chat/page.tsx",
                        lineNumber: 411,
                        columnNumber: 54
                    }, this)
            }["MessageItem[EMOJI_OPTIONS.map()]"])
        }, void 0, false, {
            fileName: "[project]/src/app/chat/page.tsx",
            lineNumber: 407,
            columnNumber: 30
        }, this);
        $[44] = isMyMessage;
        $[45] = msg.message_id;
        $[46] = onReact;
        $[47] = showEmojiPicker;
        $[48] = t25;
    } else {
        t25 = $[48];
    }
    const t26 = `${isMyMessage ? "bg-linear-to-r from-[#87ceeb] via-[#e6e6fa] to-[#ffb6c1] text-[#002020] rounded-2xl rounded-br-md" : "bg-[#e1e1f5] dark:bg-[#004a4a] text-[#5c5d6e] dark:text-[#e7fffe] rounded-2xl rounded-bl-md"} p-3 shadow-sm`;
    let t27;
    if ($[49] !== isMyMessage || $[50] !== msg.sender_name) {
        t27 = !isMyMessage && msg.sender_name && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
            className: "text-xs font-semibold mb-1 text-[#0c6780] dark:text-[#87ceeb]",
            children: msg.sender_name
        }, void 0, false, {
            fileName: "[project]/src/app/chat/page.tsx",
            lineNumber: 430,
            columnNumber: 46
        }, this);
        $[49] = isMyMessage;
        $[50] = msg.sender_name;
        $[51] = t27;
    } else {
        t27 = $[51];
    }
    let t28;
    if ($[52] !== isMyMessage || $[53] !== msg.parent_message || $[54] !== msg.parent_message_id) {
        t28 = msg.parent_message_id && msg.parent_message && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: `mb-2 px-3 py-2 rounded-lg text-xs cursor-pointer ${isMyMessage ? "bg-white/20 border-l-[3px] border-white/60" : "bg-black/5 border-l-[3px] border-[#0c6780]"}`,
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                    className: `font-bold mb-0.5 ${isMyMessage ? "text-white/90" : "text-[#0c6780]"}`,
                    children: msg.parent_message.sender_name || msg.parent_message.sender?.name || "Unknown"
                }, void 0, false, {
                    fileName: "[project]/src/app/chat/page.tsx",
                    lineNumber: 439,
                    columnNumber: 235
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                    className: `line-clamp-2 ${isMyMessage ? "text-white/75" : "text-[#5c5d6e]"}`,
                    children: msg.parent_message.encrypted_content || "\uD83D\uDCF7 Image"
                }, void 0, false, {
                    fileName: "[project]/src/app/chat/page.tsx",
                    lineNumber: 439,
                    columnNumber: 405
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/src/app/chat/page.tsx",
            lineNumber: 439,
            columnNumber: 58
        }, this);
        $[52] = isMyMessage;
        $[53] = msg.parent_message;
        $[54] = msg.parent_message_id;
        $[55] = t28;
    } else {
        t28 = $[55];
    }
    let t29;
    if ($[56] !== editContent || $[57] !== formatTime || $[58] !== handleEditSubmit || $[59] !== isEditing || $[60] !== isMyMessage || $[61] !== msg.created_at || $[62] !== msg.encrypted_content || $[63] !== msg.is_edited || $[64] !== msg.media_url || $[65] !== msg.message_type) {
        t29 = isEditing ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "space-y-2",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                    type: "text",
                    value: editContent,
                    onChange: {
                        "MessageItem[<input>.onChange]": (e_2)=>setEditContent(e_2.target.value)
                    }["MessageItem[<input>.onChange]"],
                    onKeyDown: {
                        "MessageItem[<input>.onKeyDown]": (e_3)=>{
                            if (e_3.key === "Enter") {
                                handleEditSubmit();
                            }
                            if (e_3.key === "Escape") {
                                setIsEditing(false);
                                setEditContent(msg.encrypted_content || "");
                            }
                        }
                    }["MessageItem[<input>.onKeyDown]"],
                    className: "w-full px-3 py-2 rounded-lg bg-white/80 text-sm outline-none",
                    autoFocus: true
                }, void 0, false, {
                    fileName: "[project]/src/app/chat/page.tsx",
                    lineNumber: 449,
                    columnNumber: 50
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex gap-2",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            onClick: handleEditSubmit,
                            className: "flex-1 px-3 py-1 rounded-lg text-xs font-semibold bg-[#87ceeb] text-white",
                            children: "Save"
                        }, void 0, false, {
                            fileName: "[project]/src/app/chat/page.tsx",
                            lineNumber: 461,
                            columnNumber: 164
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            onClick: {
                                "MessageItem[<button>.onClick]": ()=>{
                                    setIsEditing(false);
                                    setEditContent(msg.encrypted_content || "");
                                }
                            }["MessageItem[<button>.onClick]"],
                            className: "flex-1 px-3 py-1 rounded-lg text-xs font-semibold bg-white/60 text-[#6f787d]",
                            children: "Cancel"
                        }, void 0, false, {
                            fileName: "[project]/src/app/chat/page.tsx",
                            lineNumber: 461,
                            columnNumber: 298
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/app/chat/page.tsx",
                    lineNumber: 461,
                    columnNumber: 136
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/src/app/chat/page.tsx",
            lineNumber: 449,
            columnNumber: 23
        }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
            children: [
                msg.message_type === "image" && msg.media_url && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "mb-2 -mx-1",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                        href: msg.media_url,
                        target: "_blank",
                        rel: "noopener noreferrer",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                            src: msg.media_url,
                            alt: "Shared image",
                            width: 300,
                            height: 200,
                            className: "max-w-full rounded-xl cursor-pointer hover:opacity-90 transition-opacity",
                            style: {
                                objectFit: "contain",
                                height: "auto",
                                maxHeight: "300px"
                            },
                            loading: "lazy",
                            unoptimized: true
                        }, void 0, false, {
                            fileName: "[project]/src/app/chat/page.tsx",
                            lineNumber: 466,
                            columnNumber: 310
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/app/chat/page.tsx",
                        lineNumber: 466,
                        columnNumber: 244
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/src/app/chat/page.tsx",
                    lineNumber: 466,
                    columnNumber: 216
                }, this),
                msg.encrypted_content && msg.encrypted_content !== "Image" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                    className: "text-sm whitespace-pre-wrap",
                    children: msg.encrypted_content
                }, void 0, false, {
                    fileName: "[project]/src/app/chat/page.tsx",
                    lineNumber: 470,
                    columnNumber: 124
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: `flex items-center gap-1.5 mt-1 ${isMyMessage ? "justify-end" : "justify-start"}`,
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            className: `text-[10px] ${isMyMessage ? "text-[#005870]/70" : "text-[#6f787d]"}`,
                            children: formatTime(msg.created_at)
                        }, void 0, false, {
                            fileName: "[project]/src/app/chat/page.tsx",
                            lineNumber: 470,
                            columnNumber: 294
                        }, this),
                        msg.is_edited && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            className: `text-[9px] ${isMyMessage ? "text-[#005870]/50" : "text-[#6f787d]/60"}`,
                            children: "(edited)"
                        }, void 0, false, {
                            fileName: "[project]/src/app/chat/page.tsx",
                            lineNumber: 470,
                            columnNumber: 435
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/app/chat/page.tsx",
                    lineNumber: 470,
                    columnNumber: 195
                }, this)
            ]
        }, void 0, true);
        $[56] = editContent;
        $[57] = formatTime;
        $[58] = handleEditSubmit;
        $[59] = isEditing;
        $[60] = isMyMessage;
        $[61] = msg.created_at;
        $[62] = msg.encrypted_content;
        $[63] = msg.is_edited;
        $[64] = msg.media_url;
        $[65] = msg.message_type;
        $[66] = t29;
    } else {
        t29 = $[66];
    }
    let t30;
    if ($[67] !== t26 || $[68] !== t27 || $[69] !== t28 || $[70] !== t29) {
        t30 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: t26,
            children: [
                t27,
                t28,
                t29
            ]
        }, void 0, true, {
            fileName: "[project]/src/app/chat/page.tsx",
            lineNumber: 487,
            columnNumber: 11
        }, this);
        $[67] = t26;
        $[68] = t27;
        $[69] = t28;
        $[70] = t29;
        $[71] = t30;
    } else {
        t30 = $[71];
    }
    let t31;
    if ($[72] !== isMyMessage || $[73] !== msg.message_id || $[74] !== msg.reactions || $[75] !== onReact) {
        t31 = msg.reactions && msg.reactions.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: `flex flex-wrap gap-1 mt-1 ${isMyMessage ? "justify-end" : "justify-start"}`,
            children: msg.reactions.map({
                "MessageItem[msg.reactions.map()]": (reaction)=>{
                    const userStr = ("TURBOPACK compile-time truthy", 1) ? localStorage.getItem("user") : "TURBOPACK unreachable";
                    const currentUserId = userStr ? JSON.parse(userStr).user_id : null;
                    const iReacted = reaction.users?.some({
                        "MessageItem[msg.reactions.map() > (anonymous)()]": (u)=>u.user_id === currentUserId
                    }["MessageItem[msg.reactions.map() > (anonymous)()]"]);
                    const hasUsers = reaction.users && reaction.users.length > 0;
                    const reactedNames = hasUsers ? reaction.users?.map(_MessageItemMsgReactionsMapAnonymous).join(", ") : `${reaction.count} reaction${reaction.count !== 1 ? "s" : ""}`;
                    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "relative group",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: {
                                    "MessageItem[msg.reactions.map() > <button>.onClick]": ()=>onReact?.(msg.message_id, reaction.emoji)
                                }["MessageItem[msg.reactions.map() > <button>.onClick]"],
                                className: "px-2 py-0.5 rounded-full text-xs flex items-center gap-1 hover:scale-110 transition-transform cursor-pointer",
                                style: {
                                    background: iReacted ? "rgba(135, 206, 235, 0.3)" : "rgba(255,255,255,0.6)",
                                    border: `1px solid ${iReacted ? "rgba(135, 206, 235, 0.6)" : "rgba(0,0,0,0.1)"}`
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        children: reaction.emoji
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/chat/page.tsx",
                                        lineNumber: 512,
                                        columnNumber: 16
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "font-semibold text-[#6f787d]",
                                        children: reaction.count
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/chat/page.tsx",
                                        lineNumber: 512,
                                        columnNumber: 45
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/chat/page.tsx",
                                lineNumber: 507,
                                columnNumber: 71
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1.5 bg-gray-800 text-white text-xs rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-150 whitespace-nowrap z-50 pointer-events-none shadow-lg min-w-max",
                                children: [
                                    reactedNames,
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-800"
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/chat/page.tsx",
                                        lineNumber: 512,
                                        columnNumber: 416
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/chat/page.tsx",
                                lineNumber: 512,
                                columnNumber: 124
                            }, this)
                        ]
                    }, reaction.emoji, true, {
                        fileName: "[project]/src/app/chat/page.tsx",
                        lineNumber: 507,
                        columnNumber: 18
                    }, this);
                }
            }["MessageItem[msg.reactions.map()]"])
        }, void 0, false, {
            fileName: "[project]/src/app/chat/page.tsx",
            lineNumber: 498,
            columnNumber: 56
        }, this);
        $[72] = isMyMessage;
        $[73] = msg.message_id;
        $[74] = msg.reactions;
        $[75] = onReact;
        $[76] = t31;
    } else {
        t31 = $[76];
    }
    let t32;
    if ($[77] !== t30 || $[78] !== t31) {
        t32 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "relative flex flex-col max-w-[75%] md:max-w-[60%]",
            children: [
                t30,
                t31
            ]
        }, void 0, true, {
            fileName: "[project]/src/app/chat/page.tsx",
            lineNumber: 525,
            columnNumber: 11
        }, this);
        $[77] = t30;
        $[78] = t31;
        $[79] = t32;
    } else {
        t32 = $[79];
    }
    let t33;
    if ($[80] !== t24 || $[81] !== t25 || $[82] !== t32 || $[83] !== t8) {
        t33 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: t8,
            onMouseEnter: t9,
            onMouseLeave: t10,
            children: [
                t24,
                t25,
                t32
            ]
        }, void 0, true, {
            fileName: "[project]/src/app/chat/page.tsx",
            lineNumber: 534,
            columnNumber: 11
        }, this);
        $[80] = t24;
        $[81] = t25;
        $[82] = t32;
        $[83] = t8;
        $[84] = t33;
    } else {
        t33 = $[84];
    }
    let t34;
    if ($[85] !== canDeleteForEveryone || $[86] !== msg.message_id || $[87] !== onDelete || $[88] !== showDeleteDialog) {
        t34 = showDeleteDialog && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm",
            onClick: {
                "MessageItem[<div>.onClick]": ()=>setShowDeleteDialog(false)
            }["MessageItem[<div>.onClick]"],
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "bg-white rounded-2xl p-6 max-w-sm w-full shadow-xl",
                onClick: _MessageItemDivOnClick,
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                        className: "text-lg font-bold mb-2 text-[#002020]",
                        children: "Delete Message"
                    }, void 0, false, {
                        fileName: "[project]/src/app/chat/page.tsx",
                        lineNumber: 547,
                        columnNumber: 139
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-sm mb-4 text-[#6f787d]",
                        children: "How would you like to delete this message?"
                    }, void 0, false, {
                        fileName: "[project]/src/app/chat/page.tsx",
                        lineNumber: 547,
                        columnNumber: 212
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "space-y-2",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: {
                                    "MessageItem[<button>.onClick]": ()=>{
                                        onDelete?.(msg.message_id, false);
                                        setShowDeleteDialog(false);
                                    }
                                }["MessageItem[<button>.onClick]"],
                                className: "w-full px-4 py-3 rounded-xl bg-gray-100 text-left hover:bg-gray-200 transition-colors",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "font-semibold text-sm text-[#002020]",
                                        children: "Delete for me"
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/chat/page.tsx",
                                        lineNumber: 552,
                                        columnNumber: 145
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "text-xs text-[#6f787d] mt-0.5",
                                        children: "Only you won't see this message"
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/chat/page.tsx",
                                        lineNumber: 552,
                                        columnNumber: 214
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/chat/page.tsx",
                                lineNumber: 547,
                                columnNumber: 328
                            }, this),
                            canDeleteForEveryone && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: {
                                    "MessageItem[<button>.onClick]": ()=>{
                                        onDelete?.(msg.message_id, true);
                                        setShowDeleteDialog(false);
                                    }
                                }["MessageItem[<button>.onClick]"],
                                className: "w-full px-4 py-3 rounded-xl bg-red-50 text-left hover:bg-red-100 transition-colors",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "font-semibold text-sm text-red-600",
                                        children: "Delete for everyone"
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/chat/page.tsx",
                                        lineNumber: 557,
                                        columnNumber: 142
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "text-xs text-[#6f787d] mt-0.5",
                                        children: "Removes for all participants (within 48 hrs)"
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/chat/page.tsx",
                                        lineNumber: 557,
                                        columnNumber: 215
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/chat/page.tsx",
                                lineNumber: 552,
                                columnNumber: 328
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/chat/page.tsx",
                        lineNumber: 547,
                        columnNumber: 301
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: {
                            "MessageItem[<button>.onClick]": ()=>setShowDeleteDialog(false)
                        }["MessageItem[<button>.onClick]"],
                        className: "w-full mt-4 px-4 py-2.5 rounded-xl bg-gray-100 text-sm font-semibold text-[#6f787d] hover:bg-gray-200 transition-colors",
                        children: "Cancel"
                    }, void 0, false, {
                        fileName: "[project]/src/app/chat/page.tsx",
                        lineNumber: 557,
                        columnNumber: 324
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/app/chat/page.tsx",
                lineNumber: 547,
                columnNumber: 38
            }, this)
        }, void 0, false, {
            fileName: "[project]/src/app/chat/page.tsx",
            lineNumber: 545,
            columnNumber: 31
        }, this);
        $[85] = canDeleteForEveryone;
        $[86] = msg.message_id;
        $[87] = onDelete;
        $[88] = showDeleteDialog;
        $[89] = t34;
    } else {
        t34 = $[89];
    }
    let t35;
    if ($[90] !== t33 || $[91] !== t34) {
        t35 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
            children: [
                t33,
                t34
            ]
        }, void 0, true);
        $[90] = t33;
        $[91] = t34;
        $[92] = t35;
    } else {
        t35 = $[92];
    }
    return t35;
}
_s(MessageItem, "dP2xvl/vfMTVqlyKRIA5/bemlBw=");
_c1 = MessageItem;
function _MessageItemDivOnClick(e_4) {
    return e_4.stopPropagation();
}
function _MessageItemMsgReactionsMapAnonymous(u_0) {
    return u_0.name || "Unknown";
}
function _MessageItemDivOnMouseEnter(e_0) {
    return e_0.stopPropagation();
}
function ChatPage() {
    _s1();
    // Typing indicator state
    const [isOtherTyping, setIsOtherTyping] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const typingTimeoutRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"])();
    const [conversations, setConversations] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [chatRequests, setChatRequests] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(true);
    const [searchQuery, setSearchQuery] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('');
    const [selectedConversation, setSelectedConversation] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [activeTab, setActiveTab] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('conversations');
    const [messages, setMessages] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [showMessageSearch, setShowMessageSearch] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [messageSearchQuery, setMessageSearchQuery] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('');
    const [messageSearchResults, setMessageSearchResults] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [, setMessageSearching] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const messageSearchInputRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const [showMenu, setShowMenu] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [showBlockConfirm, setShowBlockConfirm] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [blocking, setBlocking] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [showReportDialog, setShowReportDialog] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [reporting, setReporting] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [reportType, setReportType] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("spam");
    const [decryptedPreviews, setDecryptedPreviews] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({});
    const [reportDescription, setReportDescription] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('');
    const [messageInput, setMessageInput] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('');
    const [loadingMessages, setLoadingMessages] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [isAnonymous, setIsAnonymous] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [isBlocked] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [sending, setSending] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [showMobileChat, setShowMobileChat] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [replyingTo, setReplyingTo] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const messageInputRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const [showEmojiPickerInput, setShowEmojiPickerInput] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const emojiPickerInputRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const fileInputRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const [selectedImage, setSelectedImage] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const EMOJI_OPTIONS = [
        '👍',
        '❤️',
        '😂',
        '😮',
        '😢',
        '🙏',
        '🎉',
        '🔥',
        '👏',
        '😊'
    ];
    const [isDarkMode, setIsDarkMode] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({
        "ChatPage.useState": ()=>{
            if ("TURBOPACK compile-time truthy", 1) {
                const savedTheme = localStorage.getItem('chat-theme');
                if (savedTheme) {
                    return savedTheme === 'dark';
                }
                return window.matchMedia('(prefers-color-scheme: dark)').matches;
            }
            //TURBOPACK unreachable
            ;
        }
    }["ChatPage.useState"]);
    const [sessionKey, setSessionKey] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [keyId, setKeyId] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [isE2EEReady, setIsE2EEReady] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [userPrivateKey, setUserPrivateKey] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const messagesEndRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const { getSocket, isConnected, joinConversation, leaveConversation } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$contexts$2f$SocketContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSocket"])();
    const socket = getSocket();
    // Join and leave the active conversation room for real-time events.
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "ChatPage.useEffect": ()=>{
            if (!isConnected || !selectedConversation) return;
            const conversationId = selectedConversation.conversation_id;
            joinConversation(conversationId);
            return ({
                "ChatPage.useEffect": ()=>{
                    leaveConversation(conversationId);
                }
            })["ChatPage.useEffect"];
        }
    }["ChatPage.useEffect"], [
        isConnected,
        selectedConversation,
        joinConversation,
        leaveConversation
    ]);
    const conversationsRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])([]);
    const pendingRealtimeUpdatesRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(new Map());
    const flushTimerRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const flushDelayRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(80);
    const filteredConversations = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "ChatPage.useMemo[filteredConversations]": ()=>{
            if (!searchQuery.trim()) return conversations;
            const query = searchQuery.toLowerCase();
            return conversations.filter({
                "ChatPage.useMemo[filteredConversations]": (conv)=>conv.other_user_name.toLowerCase().includes(query)
            }["ChatPage.useMemo[filteredConversations]"]);
        }
    }["ChatPage.useMemo[filteredConversations]"], [
        conversations,
        searchQuery
    ]);
    const otherUserIds = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "ChatPage.useMemo[otherUserIds]": ()=>conversations.filter({
                "ChatPage.useMemo[otherUserIds]": (c)=>!c.is_anonymous && c.other_user_id
            }["ChatPage.useMemo[otherUserIds]"]).map({
                "ChatPage.useMemo[otherUserIds]": (c_0)=>c_0.other_user_id
            }["ChatPage.useMemo[otherUserIds]"])
    }["ChatPage.useMemo[otherUserIds]"], [
        conversations
    ]);
    const onlineUsers = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$hooks$2f$usePresence$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["usePresence"])(otherUserIds);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "ChatPage.useEffect": ()=>{
            conversationsRef.current = conversations;
        }
    }["ChatPage.useEffect"], [
        conversations
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "ChatPage.useEffect": ()=>{
            if (!showEmojiPickerInput) return;
            const handleClickOutside = {
                "ChatPage.useEffect.handleClickOutside": (e)=>{
                    if (emojiPickerInputRef.current && !emojiPickerInputRef.current.contains(e.target)) {
                        setShowEmojiPickerInput(false);
                    }
                }
            }["ChatPage.useEffect.handleClickOutside"];
            document.addEventListener('mousedown', handleClickOutside);
            return ({
                "ChatPage.useEffect": ()=>document.removeEventListener('mousedown', handleClickOutside)
            })["ChatPage.useEffect"];
        }
    }["ChatPage.useEffect"], [
        showEmojiPickerInput
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "ChatPage.useEffect": ()=>{
            if (showMessageSearch) {
                setTimeout({
                    "ChatPage.useEffect": ()=>messageSearchInputRef.current?.focus()
                }["ChatPage.useEffect"], 50);
            }
        }
    }["ChatPage.useEffect"], [
        showMessageSearch
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "ChatPage.useEffect": ()=>{
            const q = messageSearchQuery.trim();
            if (!q) {
                setMessageSearchResults([]);
                setMessageSearching(false);
                return;
            }
            const timer = setTimeout({
                "ChatPage.useEffect.timer": ()=>{
                    setMessageSearching(true);
                    try {
                        const lowered = q.toLowerCase();
                        const filtered = messages.filter({
                            "ChatPage.useEffect.timer.filtered": (m)=>{
                                const body = (m.encrypted_content || '').toLowerCase();
                                const senderName = (m.sender?.name || m.sender_name || '').toLowerCase();
                                return body.includes(lowered) || senderName.includes(lowered);
                            }
                        }["ChatPage.useEffect.timer.filtered"]);
                        setMessageSearchResults(filtered);
                    } catch (err) {
                        console.error('[SEARCH] message search failed', err);
                    } finally{
                        setMessageSearching(false);
                    }
                }
            }["ChatPage.useEffect.timer"], 280);
            return ({
                "ChatPage.useEffect": ()=>clearTimeout(timer)
            })["ChatPage.useEffect"];
        }
    }["ChatPage.useEffect"], [
        messageSearchQuery,
        messages
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "ChatPage.useEffect": ()=>{
            messagesEndRef.current?.scrollIntoView({
                behavior: 'smooth'
            });
        }
    }["ChatPage.useEffect"], [
        messages
    ]);
    const navigateToProfileByUserId = async (userId)=>{
        if (!userId) return;
        try {
            const { API_BASE_URL } = await __turbopack_context__.A("[project]/src/services/apiBase.ts [app-client] (ecmascript, async loader)");
            const res = await fetch(`${API_BASE_URL}/api/profile/all`, {
                credentials: 'include'
            });
            if (!res.ok) {
                return;
            }
            const data = await res.json();
            console.log('Fetched all profiles for navigation:', data);
            if (data.success && Array.isArray(data.data.users)) {
                const found = data.data.users.find((u)=>u.user_id === userId);
                if (found && found.roll_no) {
                    router.push(`/profile/${found.roll_no}`);
                    return;
                }
            }
        } catch (err_0) {
            console.error('Failed to navigate to profile by user id', err_0);
        }
    };
    const fetchAndDecryptConversationKey = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "ChatPage.useCallback[fetchAndDecryptConversationKey]": async (msgs, conversationId_0)=>{
            try {
                const storedUser = localStorage.getItem('user');
                const decryptedPrivateKeyB64 = sessionStorage.getItem('decryptedPrivateKey');
                if (!decryptedPrivateKeyB64 || !storedUser) {
                    console.warn('[E2EE] Private key missing from session storage');
                    return null;
                }
                let privKey = userPrivateKey;
                if (!privKey && decryptedPrivateKeyB64) {
                    privKey = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$e2ee$2e$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["importPrivateKey"])(decryptedPrivateKeyB64);
                    setUserPrivateKey(privKey);
                }
                if (!privKey) return null;
                const msgWithKey = msgs.find({
                    "ChatPage.useCallback[fetchAndDecryptConversationKey].msgWithKey": (m_0)=>m_0.user_session_key && m_0.key_id
                }["ChatPage.useCallback[fetchAndDecryptConversationKey].msgWithKey"]);
                if (msgWithKey && msgWithKey.user_session_key && msgWithKey.key_id) {
                    try {
                        const aesKeyB64 = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$e2ee$2e$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["decryptKeyWithPrivateKey"])(privKey, msgWithKey.user_session_key);
                        const aesKey = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$e2ee$2e$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["importKeyFromBase64"])(aesKeyB64);
                        setSessionKey(aesKey);
                        setKeyId(msgWithKey.key_id);
                        setIsE2EEReady(true);
                        return aesKey;
                    } catch (err_1) {
                        console.error('[E2EE] Failed to decrypt session key:', err_1);
                    }
                }
                // If no key found, try to initialize a new one
                const info = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$chat$2e$service$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["chatService"].getParticipantPublicKeys(conversationId_0);
                const participants = info.participants;
                const newAesKey = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$e2ee$2e$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["generateAESKey"])();
                const aesKeyB64_0 = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$e2ee$2e$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["exportKeyToBase64"])(newAesKey);
                const encryptedKeys = await Promise.all(participants.map({
                    "ChatPage.useCallback[fetchAndDecryptConversationKey]": async (p)=>{
                        const encrypted = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$e2ee$2e$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["encryptKeyWithPublicKey"])(aesKeyB64_0, p.public_key);
                        return {
                            userId: p.user_id,
                            encryptedKey: encrypted,
                            keyVersion: 1
                        };
                    }
                }["ChatPage.useCallback[fetchAndDecryptConversationKey]"]));
                const { keyId: newKeyId } = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$chat$2e$service$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["chatService"].storeSessionKeys({
                    conversationId: conversationId_0,
                    keys: encryptedKeys
                });
                setSessionKey(newAesKey);
                setKeyId(newKeyId);
                setIsE2EEReady(true);
                return newAesKey;
            } catch (error) {
                console.error('[E2EE] Session initialization failed:', error);
            }
        }
    }["ChatPage.useCallback[fetchAndDecryptConversationKey]"], [
        userPrivateKey
    ]);
    const decryptMessages = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "ChatPage.useCallback[decryptMessages]": async (msgs_0, aesKey_0)=>{
            return await Promise.all(msgs_0.map({
                "ChatPage.useCallback[decryptMessages]": async (m_1)=>{
                    const decryptedMsg = {
                        ...m_1
                    };
                    // Decrypt main message content
                    if (m_1.encrypted_content && m_1.content_iv && m_1.content_auth_tag) {
                        try {
                            const decrypted = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$e2ee$2e$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["decryptMessageAES"])(m_1.encrypted_content, m_1.content_iv, m_1.content_auth_tag, aesKey_0);
                            decryptedMsg.encrypted_content = decrypted;
                        } catch (err_2) {
                            console.warn(`[E2EE] Failed to decrypt message ${m_1.message_id}:`, err_2);
                            decryptedMsg.encrypted_content = '[Encrypted Message]';
                        }
                    }
                    // Decrypt parent_message content if present
                    if (m_1.parent_message && m_1.parent_message.encrypted_content && m_1.parent_message.content_iv && m_1.parent_message.content_auth_tag) {
                        try {
                            const decryptedParent = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$e2ee$2e$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["decryptMessageAES"])(m_1.parent_message.encrypted_content, m_1.parent_message.content_iv, m_1.parent_message.content_auth_tag, aesKey_0);
                            decryptedMsg.parent_message = {
                                ...m_1.parent_message,
                                encrypted_content: decryptedParent
                            };
                        } catch (err_3) {
                            console.warn(`[E2EE] Failed to decrypt parent message ${m_1.parent_message.message_id}:`, err_3);
                            decryptedMsg.parent_message = {
                                ...m_1.parent_message,
                                encrypted_content: '[Encrypted Message]'
                            };
                        }
                    }
                    return decryptedMsg;
                }
            }["ChatPage.useCallback[decryptMessages]"]));
        }
    }["ChatPage.useCallback[decryptMessages]"], []);
    // Real-time message + typing listeners for the selected conversation.
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "ChatPage.useEffect": ()=>{
            if (!isConnected || !socket || !selectedConversation) return;
            const activeConversationId = selectedConversation.conversation_id;
            const userStr = ("TURBOPACK compile-time truthy", 1) ? localStorage.getItem('user') : "TURBOPACK unreachable";
            const currentUserId = userStr ? JSON.parse(userStr).user_id : null;
            const handleNewMessage = {
                "ChatPage.useEffect.handleNewMessage": async (incomingMessage)=>{
                    if (incomingMessage.conversation_id !== activeConversationId) return;
                    let processedMessage = {
                        ...incomingMessage,
                        is_my_message: incomingMessage.sender_id === currentUserId
                    };
                    if (sessionKey) {
                        try {
                            const decryptedArray = await decryptMessages([
                                processedMessage
                            ], sessionKey);
                            const decrypted_0 = decryptedArray[0];
                            if (decrypted_0) {
                                processedMessage = decrypted_0;
                            }
                        } catch (err_4) {
                            console.warn('[Socket] Failed to decrypt realtime message:', err_4);
                        }
                    }
                    setMessages({
                        "ChatPage.useEffect.handleNewMessage": (prev)=>{
                            const existingIndex = prev.findIndex({
                                "ChatPage.useEffect.handleNewMessage.existingIndex": (msg)=>msg.message_id === processedMessage.message_id
                            }["ChatPage.useEffect.handleNewMessage.existingIndex"]);
                            if (existingIndex === -1) {
                                return [
                                    ...prev,
                                    processedMessage
                                ];
                            }
                            const next = [
                                ...prev
                            ];
                            next[existingIndex] = processedMessage;
                            return next;
                        }
                    }["ChatPage.useEffect.handleNewMessage"]);
                }
            }["ChatPage.useEffect.handleNewMessage"];
            const handleTyping = {
                "ChatPage.useEffect.handleTyping": (data_0)=>{
                    if (data_0.chatId !== activeConversationId || data_0.userId === currentUserId) return;
                    if (data_0.isTyping) {
                        setIsOtherTyping(true);
                        if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
                        typingTimeoutRef.current = setTimeout({
                            "ChatPage.useEffect.handleTyping": ()=>setIsOtherTyping(false)
                        }["ChatPage.useEffect.handleTyping"], 2000);
                    } else {
                        setIsOtherTyping(false);
                    }
                }
            }["ChatPage.useEffect.handleTyping"];
            socket.on('new-message', handleNewMessage);
            socket.on('user-typing', handleTyping);
            return ({
                "ChatPage.useEffect": ()=>{
                    socket.off('new-message', handleNewMessage);
                    socket.off('user-typing', handleTyping);
                    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
                }
            })["ChatPage.useEffect"];
        }
    }["ChatPage.useEffect"], [
        isConnected,
        socket,
        selectedConversation,
        sessionKey,
        decryptMessages
    ]);
    const loadMessages = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "ChatPage.useCallback[loadMessages]": async (conversation)=>{
            if (!conversation) return;
            setLoadingMessages(true);
            try {
                let response;
                let conversationType = 'regular';
                try {
                    const info_0 = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$chat$2e$service$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["chatService"].getParticipantPublicKeys(conversation.conversation_id);
                    conversationType = info_0.isAnonymous ? 'anonymous' : 'regular';
                    if (conversationType === 'anonymous') {
                        response = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$anonymous$2d$chat$2e$service$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].getAnonymousMessages(conversation.conversation_id);
                    } else {
                        response = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$chat$2e$service$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["chatService"].getMessages(conversation.conversation_id);
                    }
                } catch (fetchError) {
                    console.error('[ERROR] Initial fetch failed:', fetchError);
                    throw fetchError;
                }
                let fetchedMessages = Array.isArray(response) ? response : response.messages || response.data || [];
                setIsAnonymous(conversationType === 'anonymous');
                // Initialize E2EE and decrypt messages
                const aesKey_1 = await fetchAndDecryptConversationKey(fetchedMessages, conversation.conversation_id);
                if (aesKey_1) {
                    fetchedMessages = await decryptMessages(fetchedMessages, aesKey_1);
                }
                // Update decrypted preview for conversation list (use most recent message)
                if (fetchedMessages.length > 0) {
                    const lastMsg = fetchedMessages[fetchedMessages.length - 1];
                    const previewText = lastMsg.message_type === 'image' ? '📷 Image' : lastMsg.encrypted_content || '';
                    setDecryptedPreviews({
                        "ChatPage.useCallback[loadMessages]": (prev_0)=>({
                                ...prev_0,
                                [conversation.conversation_id]: previewText
                            })
                    }["ChatPage.useCallback[loadMessages]"]);
                }
                setMessages(fetchedMessages);
            } catch (error_0) {
                console.error('Failed to load messages:', error_0);
                setMessages([]);
            } finally{
                setLoadingMessages(false);
            }
        }
    }["ChatPage.useCallback[loadMessages]"], [
        fetchAndDecryptConversationKey,
        decryptMessages
    ]);
    const handleSelectConversation = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "ChatPage.useCallback[handleSelectConversation]": (conversation_0)=>{
            setSelectedConversation(conversation_0);
            setShowMobileChat(true);
            setConversations({
                "ChatPage.useCallback[handleSelectConversation]": (prev_1)=>prev_1.map({
                        "ChatPage.useCallback[handleSelectConversation]": (conv_0)=>conv_0.conversation_id === conversation_0.conversation_id ? {
                                ...conv_0,
                                unread_count: 0
                            } : conv_0
                    }["ChatPage.useCallback[handleSelectConversation]"])
            }["ChatPage.useCallback[handleSelectConversation]"]);
            loadMessages(conversation_0);
        }
    }["ChatPage.useCallback[handleSelectConversation]"], [
        loadMessages
    ]);
    const fetchConversations = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "ChatPage.useCallback[fetchConversations]": async ()=>{
            try {
                const [regularData, anonymousData] = await Promise.all([
                    __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$chat$2e$service$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["chatService"].getConversations(),
                    __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$anonymous$2d$chat$2e$service$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].getAnonymousConversations()
                ]);
                const combined = [
                    ...regularData,
                    ...anonymousData
                ].sort({
                    "ChatPage.useCallback[fetchConversations].combined": (a, b)=>{
                        const dateA = new Date(a.last_message_at || a.created_at).getTime();
                        const dateB = new Date(b.last_message_at || b.created_at).getTime();
                        return dateB - dateA;
                    }
                }["ChatPage.useCallback[fetchConversations].combined"]);
                setConversations(combined);
            } catch (error_1) {
                console.error('Failed to fetch conversations:', error_1);
            } finally{
                setLoading(false);
            }
        }
    }["ChatPage.useCallback[fetchConversations]"], []);
    const handleSendMessage = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "ChatPage.useCallback[handleSendMessage]": async ()=>{
            const content = messageInput.trim();
            // Allow sending if there's either text content OR a selected image
            if (!content && !selectedImage || !selectedConversation || sending || isBlocked) return;
            try {
                setSending(true);
                let mediaUrl = '';
                let mediaSize = 0;
                let mediaMimeType = '';
                // Upload image if selected
                if (selectedImage) {
                    try {
                        const uploadResult = isAnonymous ? await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$anonymous$2d$chat$2e$service$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].uploadAnonymousImage(selectedImage) : await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$chat$2e$service$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["chatService"].uploadImage(selectedImage);
                        mediaUrl = uploadResult.data.url;
                        mediaSize = uploadResult.data.size;
                        mediaMimeType = uploadResult.data.mimeType;
                    } catch (uploadError) {
                        let errorMsg = 'Failed to upload image';
                        if (typeof uploadError === 'object' && uploadError !== null && 'response' in uploadError && typeof uploadError.response === 'object') {
                            errorMsg = uploadError.response.data?.message || errorMsg;
                        }
                        console.error('[ERROR] Failed to upload image:', uploadError);
                        alert(errorMsg);
                        setSending(false);
                        return;
                    }
                }
                // Use 'Image' as placeholder content if no text is provided but an image is being sent
                let finalContent = content || 'Image';
                let contentIv = 'dummy_iv';
                let contentAuthTag = 'dummy_tag';
                // E2EE: Encrypt message content
                if (isE2EEReady && sessionKey) {
                    try {
                        const { ciphertext, iv, authTag } = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$e2ee$2e$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["encryptMessageAES"])(finalContent, sessionKey);
                        finalContent = ciphertext;
                        contentIv = iv;
                        contentAuthTag = authTag;
                    } catch (err_5) {
                        console.error('[E2EE] Encryption failed:', err_5);
                        setSending(false);
                        return;
                    }
                }
                const messageData = {
                    conversationId: selectedConversation.conversation_id,
                    encryptedContent: finalContent,
                    contentIv,
                    contentAuthTag,
                    messageType: selectedImage ? 'image' : 'text',
                    ...mediaUrl && {
                        mediaUrl,
                        mediaSize,
                        mediaMimeType
                    },
                    keyId: keyId || undefined,
                    ...replyingTo && {
                        parentMessageId: replyingTo.message_id
                    }
                };
                if (isAnonymous) {
                    await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$anonymous$2d$chat$2e$service$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].sendAnonymousMessage(messageData);
                } else {
                    await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$chat$2e$service$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["chatService"].sendMessage(messageData);
                }
                setMessageInput('');
                setSelectedImage(null);
                setReplyingTo(null);
                if (fileInputRef.current) {
                    fileInputRef.current.value = '';
                }
                // Reload messages
                loadMessages(selectedConversation);
                // Refresh conversations list
                fetchConversations();
            } catch (error_2) {
                console.error('Failed to send message:', error_2);
            } finally{
                setSending(false);
            }
        }
    }["ChatPage.useCallback[handleSendMessage]"], [
        messageInput,
        selectedImage,
        selectedConversation,
        sending,
        isBlocked,
        isE2EEReady,
        sessionKey,
        keyId,
        isAnonymous,
        loadMessages,
        fetchConversations,
        replyingTo
    ]);
    const fetchChatRequests = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "ChatPage.useCallback[fetchChatRequests]": async ()=>{
            try {
                const data_1 = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$chat$2e$service$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["chatService"].getChatRequests();
                setChatRequests(data_1);
            } catch (error_3) {
                console.error('Failed to fetch chat requests:', error_3);
            }
        }
    }["ChatPage.useCallback[fetchChatRequests]"], []);
    const handleAcceptRequest = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "ChatPage.useCallback[handleAcceptRequest]": async (requestId)=>{
            try {
                await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$chat$2e$service$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["chatService"].respondToChatRequest(requestId, 'accept');
                fetchChatRequests();
                fetchConversations();
            } catch (error_4) {
                console.error('Failed to accept request:', error_4);
            }
        }
    }["ChatPage.useCallback[handleAcceptRequest]"], [
        fetchChatRequests,
        fetchConversations
    ]);
    const handleRejectRequest = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "ChatPage.useCallback[handleRejectRequest]": async (requestId_0)=>{
            try {
                await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$chat$2e$service$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["chatService"].respondToChatRequest(requestId_0, 'reject');
                fetchChatRequests();
            } catch (error_5) {
                console.error('Failed to reject request:', error_5);
            }
        }
    }["ChatPage.useCallback[handleRejectRequest]"], [
        fetchChatRequests
    ]);
    const handleReply = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "ChatPage.useCallback[handleReply]": (msg_0)=>{
            setReplyingTo(msg_0);
            // Focus the input after a small delay to ensure render
            setTimeout({
                "ChatPage.useCallback[handleReply]": ()=>messageInputRef.current?.focus()
            }["ChatPage.useCallback[handleReply]"], 50);
        }
    }["ChatPage.useCallback[handleReply]"], []);
    const handleReact = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "ChatPage.useCallback[handleReact]": async (messageId, emoji)=>{
            try {
                await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$message$2d$management$2e$service$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["messageManagementService"].addReaction(messageId, emoji, '');
                // Refresh messages to show updated reactions
                if (selectedConversation) {
                    loadMessages(selectedConversation);
                }
            } catch (error_6) {
                console.error('Failed to add reaction:', error_6);
            }
        }
    }["ChatPage.useCallback[handleReact]"], [
        selectedConversation,
        loadMessages
    ]);
    const handleEdit = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "ChatPage.useCallback[handleEdit]": async (messageId_0, newContent)=>{
            try {
                let finalContent_0 = newContent;
                let contentIv_0 = 'dummy_iv';
                let contentAuthTag_0 = 'dummy_tag';
                // E2EE: Encrypt edited content
                if (isE2EEReady && sessionKey) {
                    try {
                        const { ciphertext: ciphertext_0, iv: iv_0, authTag: authTag_0 } = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$e2ee$2e$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["encryptMessageAES"])(newContent, sessionKey);
                        finalContent_0 = ciphertext_0;
                        contentIv_0 = iv_0;
                        contentAuthTag_0 = authTag_0;
                    } catch (err_6) {
                        console.error('[E2EE] Edit encryption failed:', err_6);
                        return;
                    }
                }
                await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$message$2d$management$2e$service$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["messageManagementService"].editMessage(messageId_0, finalContent_0, contentIv_0, contentAuthTag_0, '');
                // Refresh messages to show updated content
                if (selectedConversation) {
                    loadMessages(selectedConversation);
                }
            } catch (error_7) {
                console.error('Failed to edit message:', error_7);
            }
        }
    }["ChatPage.useCallback[handleEdit]"], [
        isE2EEReady,
        sessionKey,
        selectedConversation,
        loadMessages
    ]);
    const handleDelete = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "ChatPage.useCallback[handleDelete]": async (messageId_1, deleteForEveryone)=>{
            try {
                await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$chat$2e$service$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["chatService"].deleteMessage(messageId_1, deleteForEveryone ? 'everyone' : 'me');
                // Remove from local state immediately for better UX
                setMessages({
                    "ChatPage.useCallback[handleDelete]": (prev_2)=>prev_2.filter({
                            "ChatPage.useCallback[handleDelete]": (m_2)=>m_2.message_id !== messageId_1
                        }["ChatPage.useCallback[handleDelete]"])
                }["ChatPage.useCallback[handleDelete]"]);
            } catch (error_8) {
                console.error('Failed to delete message:', error_8);
            }
        }
    }["ChatPage.useCallback[handleDelete]"], []);
    const handleBlockSelectedUser = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "ChatPage.useCallback[handleBlockSelectedUser]": async ()=>{
            if (!selectedConversation || !selectedConversation.conversation_id) return;
            setShowBlockConfirm(false);
            setBlocking(true);
            try {
                await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$chat$2e$service$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["chatService"].blockUser(selectedConversation.conversation_id);
                // refresh conversations to reflect blocked state
                void fetchConversations();
                alert('User blocked successfully');
            } catch (err_7) {
                console.error('Failed to block user', err_7);
                alert('Failed to block user');
            } finally{
                setBlocking(false);
            }
        }
    }["ChatPage.useCallback[handleBlockSelectedUser]"], [
        selectedConversation,
        fetchConversations
    ]);
    const handleSubmitReport = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "ChatPage.useCallback[handleSubmitReport]": async ()=>{
            if (!selectedConversation || !selectedConversation.other_user_id) return;
            if (!reportDescription.trim()) {
                alert('Please provide a description for the report.');
                return;
            }
            setReporting(true);
            try {
                await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$chat$2e$service$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["chatService"].reportUser({
                    reportedUserId: selectedConversation.other_user_id,
                    conversationId: selectedConversation.conversation_id,
                    reportType: reportType,
                    description: reportDescription,
                    evidenceUrls: []
                });
                setShowReportDialog(false);
                setReportDescription('');
                alert('Report submitted. Our team will review it.');
            } catch (err_8) {
                console.error('Failed to submit report', err_8);
                alert('Failed to submit report');
            } finally{
                setReporting(false);
            }
        }
    }["ChatPage.useCallback[handleSubmitReport]"], [
        selectedConversation,
        reportDescription,
        reportType
    ]);
    const handleMessageReaction = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "ChatPage.useCallback[handleMessageReaction]": (data_2)=>{
            // Refresh messages to show updated reactions
            if (selectedConversation) {
                loadMessages(selectedConversation);
            }
            console.log('[Socket] Message reaction received:', data_2);
        }
    }["ChatPage.useCallback[handleMessageReaction]"], [
        selectedConversation,
        loadMessages
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "ChatPage.useEffect": ()=>{
            fetchConversations();
            fetchChatRequests();
        }
    }["ChatPage.useEffect"], [
        fetchConversations,
        fetchChatRequests
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "ChatPage.useEffect": ()=>{
            if (!isConnected) return;
            const socket_0 = getSocket();
            if (!socket_0) return;
            const pendingMap = pendingRealtimeUpdatesRef.current;
            const flushRealtimeConversationUpdates = {
                "ChatPage.useEffect.flushRealtimeConversationUpdates": ()=>{
                    const updates = Array.from(pendingMap.entries());
                    if (updates.length === 0) return;
                    const next_0 = [
                        ...conversationsRef.current
                    ];
                    let changed = false;
                    let missingConversation = false;
                    for (const [conversationId_1, update] of updates){
                        const index = next_0.findIndex({
                            "ChatPage.useEffect.flushRealtimeConversationUpdates.index": (c_1)=>c_1.conversation_id === conversationId_1
                        }["ChatPage.useEffect.flushRealtimeConversationUpdates.index"]);
                        if (index === -1) {
                            missingConversation = true;
                            continue;
                        }
                        changed = true;
                        const target = next_0[index];
                        const updatedConversation = {
                            ...target,
                            unread_count: (target.unread_count || 0) + update.incrementBy,
                            last_message_time: update.timestamp ? new Date(update.timestamp) : target.last_message_time
                        };
                        next_0.splice(index, 1);
                        next_0.unshift(updatedConversation);
                    }
                    pendingMap.clear();
                    if (changed) {
                        conversationsRef.current = next_0;
                        setConversations(next_0);
                    }
                    if (missingConversation) {
                        void fetchConversations();
                    }
                }
            }["ChatPage.useEffect.flushRealtimeConversationUpdates"];
            const scheduleRealtimeFlush = {
                "ChatPage.useEffect.scheduleRealtimeFlush": ()=>{
                    const pendingCount = pendingMap.size;
                    const targetDelay = pendingCount > 6 ? 150 : 80;
                    if (flushTimerRef.current !== null) {
                        if (targetDelay === flushDelayRef.current) return;
                        window.clearTimeout(flushTimerRef.current);
                        flushTimerRef.current = null;
                    }
                    flushDelayRef.current = targetDelay;
                    flushTimerRef.current = window.setTimeout({
                        "ChatPage.useEffect.scheduleRealtimeFlush": ()=>{
                            flushTimerRef.current = null;
                            flushRealtimeConversationUpdates();
                        }
                    }["ChatPage.useEffect.scheduleRealtimeFlush"], targetDelay);
                }
            }["ChatPage.useEffect.scheduleRealtimeFlush"];
            const handleNewNotification = {
                "ChatPage.useEffect.handleNewNotification": (payload)=>{
                    const notification = payload.notification;
                    if (!notification || notification.type !== 'new_message') return;
                    const conversationId_2 = notification.conversationId || notification.conversation_id || notification.chatId || notification.chat_id;
                    if (!conversationId_2) return;
                    const existing = pendingMap.get(conversationId_2) || {
                        incrementBy: 0
                    };
                    const nextTimestamp = typeof notification.timestamp === 'number' ? Math.max(existing.timestamp || 0, notification.timestamp) : existing.timestamp;
                    pendingMap.set(conversationId_2, {
                        incrementBy: existing.incrementBy + 1,
                        timestamp: nextTimestamp
                    });
                    scheduleRealtimeFlush();
                }
            }["ChatPage.useEffect.handleNewNotification"];
            socket_0.on('new-notification', handleNewNotification);
            socket_0.on('message:reaction', handleMessageReaction);
            return ({
                "ChatPage.useEffect": ()=>{
                    if (flushTimerRef.current !== null) {
                        window.clearTimeout(flushTimerRef.current);
                        flushTimerRef.current = null;
                    }
                    pendingMap.clear();
                    socket_0.off('new-notification', handleNewNotification);
                    socket_0.off('message:reaction', handleMessageReaction);
                }
            })["ChatPage.useEffect"];
        }
    }["ChatPage.useEffect"], [
        isConnected,
        getSocket,
        fetchConversations,
        handleMessageReaction
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "ChatPage.useEffect": ()=>{
            localStorage.setItem('chat-theme', isDarkMode ? 'dark' : 'light');
        }
    }["ChatPage.useEffect"], [
        isDarkMode
    ]);
    const toggleTheme = ()=>{
        setIsDarkMode((prev_3)=>!prev_3);
    };
    const formatTime = (date)=>{
        const d = new Date(date);
        const now = new Date();
        const diff = now.getTime() - d.getTime();
        const hours = Math.floor(diff / (1000 * 60 * 60));
        if (hours < 1) return 'Just now';
        if (hours < 24) return `${hours}h ago`;
        if (hours < 48) return 'Yesterday';
        return d.toLocaleDateString();
    };
    if (loading) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: `min-h-screen bg-[#e2fffe] font-sans text-[#002020] ${isDarkMode ? 'dark' : ''}`,
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "dark:bg-[#002020] dark:text-[#e7fffe] min-h-screen",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "fixed inset-0 bg-[#002020]/20 dark:bg-black/40 backdrop-blur-md z-40 flex items-center justify-center p-4",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "w-full h-full md:w-[95%] md:h-[95%] bg-white/80 dark:bg-[#003535]/80 backdrop-blur-2xl rounded-2xl shadow-[0_20px_40px_rgba(0,32,32,0.06)] dark:shadow-[0_20px_40px_rgba(0,0,0,0.3)] relative overflow-hidden flex flex-col md:flex-row border border-white/50 dark:border-[#004a4a]/50",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("aside", {
                                className: "w-full md:w-[35%] bg-[#d7fafa]/50 dark:bg-[#003535]/50 flex flex-col border-r border-white/30 dark:border-[#004a4a]/30 relative h-full overflow-hidden",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "p-6",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "flex items-center justify-between mb-6",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                                                        className: "text-2xl font-extrabold tracking-tight text-[#0c6780] dark:text-[#87ceeb] font-['Plus_Jakarta_Sans']",
                                                        children: "Messages"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/chat/page.tsx",
                                                        lineNumber: 1297,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "flex items-center gap-2",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "w-10 h-10 rounded-full bg-[#87ceeb]/20 dark:bg-[#0c6780]/20 animate-pulse"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/app/chat/page.tsx",
                                                                lineNumber: 1299,
                                                                columnNumber: 23
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "w-10 h-10 rounded-full bg-[#87ceeb]/20 dark:bg-[#0c6780]/20 animate-pulse"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/app/chat/page.tsx",
                                                                lineNumber: 1300,
                                                                columnNumber: 23
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/app/chat/page.tsx",
                                                        lineNumber: 1298,
                                                        columnNumber: 21
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/app/chat/page.tsx",
                                                lineNumber: 1296,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "relative",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "w-full bg-white dark:bg-[#004040] rounded-full py-2.5 pl-10 pr-4 h-10 animate-pulse"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/chat/page.tsx",
                                                    lineNumber: 1305,
                                                    columnNumber: 21
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/chat/page.tsx",
                                                lineNumber: 1304,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/app/chat/page.tsx",
                                        lineNumber: 1295,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "px-6 pb-2 flex gap-2",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "h-9 w-28 bg-[#87ceeb]/30 dark:bg-[#0c6780]/30 rounded-full animate-pulse"
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/chat/page.tsx",
                                                lineNumber: 1311,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "h-9 w-28 bg-[#87ceeb]/20 dark:bg-[#0c6780]/20 rounded-full animate-pulse"
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/chat/page.tsx",
                                                lineNumber: 1312,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/app/chat/page.tsx",
                                        lineNumber: 1310,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex-1 overflow-y-auto px-4 space-y-1 scrollbar-visible",
                                        children: Array.from({
                                            length: 8
                                        }).map((_, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "flex items-center gap-3 p-3 rounded-xl animate-pulse",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "w-12 h-12 rounded-full bg-[#87ceeb]/20 dark:bg-[#0c6780]/20"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/chat/page.tsx",
                                                        lineNumber: 1320,
                                                        columnNumber: 23
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "flex-1 min-w-0 space-y-2",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "flex items-center justify-between",
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                        className: "h-3.5 w-3/4 bg-[#87ceeb]/20 dark:bg-[#0c6780]/20 rounded"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/app/chat/page.tsx",
                                                                        lineNumber: 1323,
                                                                        columnNumber: 27
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                        className: "h-2.5 w-8 bg-[#87ceeb]/20 dark:bg-[#0c6780]/20 rounded"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/app/chat/page.tsx",
                                                                        lineNumber: 1324,
                                                                        columnNumber: 27
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/src/app/chat/page.tsx",
                                                                lineNumber: 1322,
                                                                columnNumber: 25
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "h-3 w-1/2 bg-[#87ceeb]/20 dark:bg-[#0c6780]/20 rounded"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/app/chat/page.tsx",
                                                                lineNumber: 1326,
                                                                columnNumber: 25
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/app/chat/page.tsx",
                                                        lineNumber: 1321,
                                                        columnNumber: 23
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "w-5 h-5 rounded-full bg-[#f9b1bc]/50 animate-pulse"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/chat/page.tsx",
                                                        lineNumber: 1328,
                                                        columnNumber: 23
                                                    }, this)
                                                ]
                                            }, i, true, {
                                                fileName: "[project]/src/app/chat/page.tsx",
                                                lineNumber: 1319,
                                                columnNumber: 34
                                            }, this))
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/chat/page.tsx",
                                        lineNumber: 1316,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/chat/page.tsx",
                                lineNumber: 1293,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("main", {
                                className: `flex-1 flex-col bg-white/50 dark:bg-[#003535]/30 h-full overflow-hidden ${showMobileChat ? 'flex' : 'hidden md:flex'}`,
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "px-4 md:px-6 py-4 bg-white/30 dark:bg-[#003535]/30 backdrop-blur-md border-b border-white/30 dark:border-[#004a4a]/30 flex items-center justify-between shrink-0 sticky top-0 z-20",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "flex items-center gap-3",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "w-10 h-10 rounded-full bg-[#87ceeb]/20 dark:bg-[#0c6780]/20 animate-pulse"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/chat/page.tsx",
                                                        lineNumber: 1338,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "space-y-1",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "h-4 w-32 bg-[#87ceeb]/20 dark:bg-[#0c6780]/20 rounded animate-pulse"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/app/chat/page.tsx",
                                                                lineNumber: 1340,
                                                                columnNumber: 23
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "h-3 w-20 bg-[#22C55E]/30 rounded animate-pulse"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/app/chat/page.tsx",
                                                                lineNumber: 1341,
                                                                columnNumber: 23
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/app/chat/page.tsx",
                                                        lineNumber: 1339,
                                                        columnNumber: 21
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/app/chat/page.tsx",
                                                lineNumber: 1337,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "flex items-center gap-2",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "w-9 h-9 rounded-full bg-[#87ceeb]/20 dark:bg-[#0c6780]/20 animate-pulse"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/chat/page.tsx",
                                                        lineNumber: 1345,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "w-9 h-9 rounded-full bg-[#87ceeb]/20 dark:bg-[#0c6780]/20 animate-pulse"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/chat/page.tsx",
                                                        lineNumber: 1346,
                                                        columnNumber: 21
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/app/chat/page.tsx",
                                                lineNumber: 1344,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/app/chat/page.tsx",
                                        lineNumber: 1336,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex-1 overflow-y-auto p-4 space-y-4 scrollbar-visible",
                                        children: [
                                            {
                                                isMyMessage: false,
                                                width: 'w-2/3'
                                            },
                                            {
                                                isMyMessage: true,
                                                width: 'w-1/2'
                                            },
                                            {
                                                isMyMessage: false,
                                                width: 'w-3/4'
                                            },
                                            {
                                                isMyMessage: true,
                                                width: 'w-2/5'
                                            },
                                            {
                                                isMyMessage: false,
                                                width: 'w-1/2'
                                            },
                                            {
                                                isMyMessage: true,
                                                width: 'w-3/5'
                                            }
                                        ].map((item, i_0)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: `flex ${item.isMyMessage ? 'justify-end' : 'justify-start'} animate-pulse`,
                                                children: [
                                                    !item.isMyMessage && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "w-8 h-8 rounded-full bg-[#87ceeb]/20 dark:bg-[#0c6780]/20 mr-2 self-end"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/chat/page.tsx",
                                                        lineNumber: 1371,
                                                        columnNumber: 45
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: `${item.width} h-16 bg-[#87ceeb]/20 dark:bg-[#0c6780]/20 rounded-2xl ${item.isMyMessage ? 'rounded-br-sm' : 'rounded-bl-sm'}`
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/chat/page.tsx",
                                                        lineNumber: 1372,
                                                        columnNumber: 23
                                                    }, this)
                                                ]
                                            }, i_0, true, {
                                                fileName: "[project]/src/app/chat/page.tsx",
                                                lineNumber: 1370,
                                                columnNumber: 39
                                            }, this))
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/chat/page.tsx",
                                        lineNumber: 1351,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "px-4 py-3 bg-white/50 dark:bg-[#003535]/50 backdrop-blur-md border-t border-white/30 dark:border-[#004a4a]/30 shrink-0",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "flex items-center gap-3",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "w-10 h-10 rounded-full bg-[#87ceeb]/20 dark:bg-[#0c6780]/20 animate-pulse"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/chat/page.tsx",
                                                    lineNumber: 1379,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "flex-1 h-11 bg-[#87ceeb]/20 dark:bg-[#0c6780]/20 rounded-full animate-pulse"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/chat/page.tsx",
                                                    lineNumber: 1380,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "w-10 h-10 rounded-full bg-[#87ceeb]/20 dark:bg-[#0c6780]/20 animate-pulse"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/chat/page.tsx",
                                                    lineNumber: 1381,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "w-11 h-11 rounded-full bg-[#87ceeb]/30 dark:bg-[#0c6780]/30 animate-pulse"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/chat/page.tsx",
                                                    lineNumber: 1382,
                                                    columnNumber: 21
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/app/chat/page.tsx",
                                            lineNumber: 1378,
                                            columnNumber: 19
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/chat/page.tsx",
                                        lineNumber: 1377,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/chat/page.tsx",
                                lineNumber: 1334,
                                columnNumber: 15
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/chat/page.tsx",
                        lineNumber: 1291,
                        columnNumber: 13
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/src/app/chat/page.tsx",
                    lineNumber: 1290,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/app/chat/page.tsx",
                lineNumber: 1289,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/src/app/chat/page.tsx",
            lineNumber: 1288,
            columnNumber: 12
        }, this);
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: `min-h-screen bg-[#e2fffe] font-sans text-[#002020] ${isDarkMode ? 'dark' : ''}`,
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "dark:bg-[#002020] dark:text-[#e7fffe] min-h-screen",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "fixed inset-0 bg-[#002020]/20 dark:bg-black/40 backdrop-blur-md z-40 flex items-center justify-center p-4",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "w-full h-full md:w-[95%] md:h-[95%] bg-white/80 dark:bg-[#003535]/80 backdrop-blur-2xl rounded-2xl shadow-[0_20px_40px_rgba(0,32,32,0.06)] dark:shadow-[0_20px_40px_rgba(0,0,0,0.3)] relative overflow-hidden flex flex-col md:flex-row border border-white/50 dark:border-[#004a4a]/50",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("aside", {
                                className: `w-full md:w-[35%] bg-[#d7fafa]/50 dark:bg-[#003535]/50 flex flex-col border-r border-white/30 dark:border-[#004a4a]/30 relative h-full overflow-hidden ${showMobileChat ? 'hidden md:flex' : 'flex'}`,
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "p-6",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "flex items-center justify-between mb-6",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                                                        className: "text-2xl font-extrabold tracking-tight text-[#0c6780] dark:text-[#87ceeb] font-['Plus_Jakarta_Sans']",
                                                        children: "Messages"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/chat/page.tsx",
                                                        lineNumber: 1402,
                                                        columnNumber: 17
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "flex items-center gap-2",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                onClick: toggleTheme,
                                                                className: "w-10 h-10 flex items-center justify-center hover:bg-[#87ceeb]/20 dark:hover:bg-[#0c6780]/30 rounded-full transition-colors group",
                                                                title: isDarkMode ? 'Switch to light mode' : 'Switch to dark mode',
                                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                    className: "material-symbols-outlined text-[#6f787d] dark:text-[#bfc8cd] group-hover:text-[#0c6780] dark:group-hover:text-[#87ceeb]",
                                                                    children: isDarkMode ? 'light_mode' : 'dark_mode'
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/app/chat/page.tsx",
                                                                    lineNumber: 1406,
                                                                    columnNumber: 21
                                                                }, this)
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/app/chat/page.tsx",
                                                                lineNumber: 1405,
                                                                columnNumber: 19
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                                                href: "/dashboard",
                                                                className: "w-10 h-10 flex items-center justify-center hover:bg-red-100/50 dark:hover:bg-red-900/30 rounded-full transition-colors group",
                                                                title: "Close",
                                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                    className: "material-symbols-outlined text-[#6f787d] dark:text-[#bfc8cd] group-hover:text-red-600",
                                                                    children: "close"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/app/chat/page.tsx",
                                                                    lineNumber: 1412,
                                                                    columnNumber: 21
                                                                }, this)
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/app/chat/page.tsx",
                                                                lineNumber: 1411,
                                                                columnNumber: 19
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/app/chat/page.tsx",
                                                        lineNumber: 1403,
                                                        columnNumber: 17
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/app/chat/page.tsx",
                                                lineNumber: 1401,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "relative",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#6f787d] dark:text-[#bfc8cd]",
                                                        children: "search"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/chat/page.tsx",
                                                        lineNumber: 1417,
                                                        columnNumber: 17
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                        className: "w-full bg-white dark:bg-[#004040] border-none rounded-full py-2.5 pl-10 pr-4 text-sm focus:ring-2 focus:ring-[#87ceeb] dark:focus:ring-[#0c6780] outline-none dark:text-[#e7fffe] dark:placeholder-[#6f787d]",
                                                        placeholder: "Search conversations...",
                                                        type: "text",
                                                        value: searchQuery,
                                                        onChange: (e_0)=>setSearchQuery(e_0.target.value)
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/chat/page.tsx",
                                                        lineNumber: 1418,
                                                        columnNumber: 17
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/app/chat/page.tsx",
                                                lineNumber: 1416,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/app/chat/page.tsx",
                                        lineNumber: 1400,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "px-6 pb-2 flex gap-2",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                onClick: ()=>setActiveTab('conversations'),
                                                className: `px-4 py-2 rounded-full text-sm font-semibold transition-all ${activeTab === 'conversations' ? 'bg-[#87ceeb]/30 dark:bg-[#0c6780]/30 text-[#005870] dark:text-[#87ceeb]' : 'text-[#6f787d] dark:text-[#bfc8cd] hover:bg-white/50 dark:hover:bg-[#004040]/50'}`,
                                                children: [
                                                    "Chats (",
                                                    conversations.length,
                                                    ")"
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/app/chat/page.tsx",
                                                lineNumber: 1424,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                onClick: ()=>setActiveTab('requests'),
                                                className: `px-4 py-2 rounded-full text-sm font-semibold transition-all relative ${activeTab === 'requests' ? 'bg-[#87ceeb]/30 dark:bg-[#0c6780]/30 text-[#005870] dark:text-[#87ceeb]' : 'text-[#6f787d] dark:text-[#bfc8cd] hover:bg-white/50 dark:hover:bg-[#004040]/50'}`,
                                                children: [
                                                    "Requests (",
                                                    chatRequests.length,
                                                    ")",
                                                    chatRequests.length > 0 && activeTab !== 'requests' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#f9b1bc] text-white text-[10px] flex items-center justify-center font-bold",
                                                        children: chatRequests.length
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/chat/page.tsx",
                                                        lineNumber: 1429,
                                                        columnNumber: 73
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/app/chat/page.tsx",
                                                lineNumber: 1427,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/app/chat/page.tsx",
                                        lineNumber: 1423,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex-1 overflow-y-auto px-4 space-y-1 scrollbar-visible",
                                        children: [
                                            activeTab === 'conversations' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                                                children: filteredConversations.length === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "p-8 text-center",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "w-16 h-16 rounded-full bg-[#87ceeb]/20 dark:bg-[#0c6780]/20 flex items-center justify-center mb-3 mx-auto",
                                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "material-symbols-outlined text-3xl text-[#0c6780] dark:text-[#87ceeb]",
                                                                children: "chat_bubble"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/app/chat/page.tsx",
                                                                lineNumber: 1440,
                                                                columnNumber: 25
                                                            }, this)
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/app/chat/page.tsx",
                                                            lineNumber: 1439,
                                                            columnNumber: 23
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                            className: "font-semibold text-[#002020] dark:text-[#e7fffe] mb-1",
                                                            children: "No conversations yet"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/app/chat/page.tsx",
                                                            lineNumber: 1442,
                                                            columnNumber: 23
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                            className: "text-sm text-[#6f787d] dark:text-[#bfc8cd] mb-4",
                                                            children: "Start chatting with someone!"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/app/chat/page.tsx",
                                                            lineNumber: 1443,
                                                            columnNumber: 23
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                                            href: "/dashboard",
                                                            className: "text-sm font-semibold text-[#0c6780] dark:text-[#87ceeb] hover:underline",
                                                            children: "Find people →"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/app/chat/page.tsx",
                                                            lineNumber: 1444,
                                                            columnNumber: 23
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/app/chat/page.tsx",
                                                    lineNumber: 1438,
                                                    columnNumber: 57
                                                }, this) : filteredConversations.map((conv_1)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        onClick: ()=>handleSelectConversation(conv_1),
                                                        className: `p-4 rounded-xl flex items-center gap-4 cursor-pointer transition-all duration-300 ${selectedConversation?.conversation_id === conv_1.conversation_id ? 'bg-[#87ceeb]/30 dark:bg-[#0c6780]/30' : 'hover:bg-white/50 dark:hover:bg-[#004040]/50'}`,
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "relative shrink-0",
                                                                children: [
                                                                    conv_1.other_user_dp ? !conv_1.is_anonymous ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                        onClick: (e_1)=>{
                                                                            e_1.stopPropagation();
                                                                            void navigateToProfileByUserId(conv_1.other_user_id);
                                                                        },
                                                                        className: "w-12 h-12 rounded-full overflow-hidden",
                                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                                                            src: conv_1.other_user_dp,
                                                                            alt: conv_1.other_user_name,
                                                                            width: 48,
                                                                            height: 48,
                                                                            className: "w-12 h-12 rounded-full object-cover"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/src/app/chat/page.tsx",
                                                                            lineNumber: 1453,
                                                                            columnNumber: 33
                                                                        }, this)
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/app/chat/page.tsx",
                                                                        lineNumber: 1449,
                                                                        columnNumber: 74
                                                                    }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                        className: "w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg bg-linear-to-br from-[#87ceeb] to-[#e6e6fa]",
                                                                        children: conv_1.is_anonymous ? '?' : conv_1.other_user_name.charAt(0).toUpperCase()
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/app/chat/page.tsx",
                                                                        lineNumber: 1454,
                                                                        columnNumber: 43
                                                                    }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                        className: "w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg bg-linear-to-br from-[#87ceeb] to-[#e6e6fa]",
                                                                        children: conv_1.is_anonymous ? '?' : conv_1.other_user_name.charAt(0).toUpperCase()
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/app/chat/page.tsx",
                                                                        lineNumber: 1456,
                                                                        columnNumber: 40
                                                                    }, this),
                                                                    !conv_1.is_anonymous && conv_1.other_user_id && onlineUsers.has(conv_1.other_user_id) && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                        className: "absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/app/chat/page.tsx",
                                                                        lineNumber: 1459,
                                                                        columnNumber: 117
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/src/app/chat/page.tsx",
                                                                lineNumber: 1448,
                                                                columnNumber: 25
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "flex-1 min-w-0",
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                        className: "flex justify-between items-center",
                                                                        children: [
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                className: "font-bold text-[#005870] dark:text-[#87ceeb] truncate",
                                                                                children: conv_1.other_user_name
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/src/app/chat/page.tsx",
                                                                                lineNumber: 1463,
                                                                                columnNumber: 29
                                                                            }, this),
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                className: "text-[10px] uppercase tracking-wider text-[#6f787d] dark:text-[#bfc8cd]",
                                                                                children: formatTime(conv_1.last_message_time || conv_1.created_at)
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/src/app/chat/page.tsx",
                                                                                lineNumber: 1464,
                                                                                columnNumber: 29
                                                                            }, this)
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/src/app/chat/page.tsx",
                                                                        lineNumber: 1462,
                                                                        columnNumber: 27
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                        className: "text-sm text-[#0c6780] dark:text-[#bfc8cd] truncate",
                                                                        children: decryptedPreviews[conv_1.conversation_id] ? decryptedPreviews[conv_1.conversation_id] : conv_1.last_message_preview ? conv_1.last_message_type === 'image' ? '📷 Image' : '🔒 Encrypted' : 'No messages yet'
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/app/chat/page.tsx",
                                                                        lineNumber: 1468,
                                                                        columnNumber: 27
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/src/app/chat/page.tsx",
                                                                lineNumber: 1461,
                                                                columnNumber: 25
                                                            }, this),
                                                            conv_1.unread_count > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "w-5 h-5 bg-[#f9b1bc] rounded-full flex items-center justify-center shrink-0",
                                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                    className: "text-[10px] font-bold text-white",
                                                                    children: conv_1.unread_count > 99 ? '99+' : conv_1.unread_count
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/app/chat/page.tsx",
                                                                    lineNumber: 1473,
                                                                    columnNumber: 29
                                                                }, this)
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/app/chat/page.tsx",
                                                                lineNumber: 1472,
                                                                columnNumber: 53
                                                            }, this)
                                                        ]
                                                    }, conv_1.conversation_id, true, {
                                                        fileName: "[project]/src/app/chat/page.tsx",
                                                        lineNumber: 1447,
                                                        columnNumber: 66
                                                    }, this))
                                            }, void 0, false),
                                            activeTab === 'requests' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                                                children: chatRequests.length === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "p-8 text-center",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "w-16 h-16 rounded-full bg-[#87ceeb]/20 dark:bg-[#0c6780]/20 flex items-center justify-center mb-3 mx-auto",
                                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "material-symbols-outlined text-3xl text-[#0c6780] dark:text-[#87ceeb]",
                                                                children: "mail"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/app/chat/page.tsx",
                                                                lineNumber: 1481,
                                                                columnNumber: 25
                                                            }, this)
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/app/chat/page.tsx",
                                                            lineNumber: 1480,
                                                            columnNumber: 23
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                            className: "font-semibold text-[#002020] dark:text-[#e7fffe]",
                                                            children: "No pending requests"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/app/chat/page.tsx",
                                                            lineNumber: 1483,
                                                            columnNumber: 23
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                            className: "text-sm text-[#6f787d] dark:text-[#bfc8cd]",
                                                            children: "You're all caught up!"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/app/chat/page.tsx",
                                                            lineNumber: 1484,
                                                            columnNumber: 23
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/app/chat/page.tsx",
                                                    lineNumber: 1479,
                                                    columnNumber: 48
                                                }, this) : chatRequests.map((request)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "p-4 rounded-xl bg-white/50 dark:bg-[#004040]/50 flex items-center gap-4",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "shrink-0",
                                                                children: request.sender_dp_url ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                                                    src: request.sender_dp_url,
                                                                    alt: request.sender_display_name,
                                                                    width: 48,
                                                                    height: 48,
                                                                    className: "w-12 h-12 rounded-full object-cover"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/app/chat/page.tsx",
                                                                    lineNumber: 1487,
                                                                    columnNumber: 52
                                                                }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    className: "w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg bg-linear-to-br from-[#87ceeb] to-[#e6e6fa]",
                                                                    children: request.sender_display_name.charAt(0).toUpperCase()
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/app/chat/page.tsx",
                                                                    lineNumber: 1487,
                                                                    columnNumber: 197
                                                                }, this)
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/app/chat/page.tsx",
                                                                lineNumber: 1486,
                                                                columnNumber: 25
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "flex-1 min-w-0",
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                        className: "flex items-center gap-2 mb-0.5",
                                                                        children: [
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                className: "font-semibold text-[#002020] dark:text-[#e7fffe]",
                                                                                children: request.sender_display_name
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/src/app/chat/page.tsx",
                                                                                lineNumber: 1493,
                                                                                columnNumber: 29
                                                                            }, this),
                                                                            request.request_type === 'anonymous' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                className: "text-xs px-2 py-0.5 rounded-full bg-purple-100 dark:bg-purple-900/50 text-purple-600 dark:text-purple-300",
                                                                                children: "Anon"
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/src/app/chat/page.tsx",
                                                                                lineNumber: 1494,
                                                                                columnNumber: 70
                                                                            }, this)
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/src/app/chat/page.tsx",
                                                                        lineNumber: 1492,
                                                                        columnNumber: 27
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                        className: "text-xs text-[#6f787d] dark:text-[#bfc8cd]",
                                                                        children: formatTime(request.created_at)
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/app/chat/page.tsx",
                                                                        lineNumber: 1496,
                                                                        columnNumber: 27
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/src/app/chat/page.tsx",
                                                                lineNumber: 1491,
                                                                columnNumber: 25
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "flex gap-2 shrink-0",
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                        onClick: ()=>handleAcceptRequest(request.request_id),
                                                                        className: "px-3 py-1.5 rounded-lg text-sm font-semibold text-white bg-green-500 hover:bg-green-600 transition-colors",
                                                                        children: "Accept"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/app/chat/page.tsx",
                                                                        lineNumber: 1499,
                                                                        columnNumber: 27
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                        onClick: ()=>handleRejectRequest(request.request_id),
                                                                        className: "px-3 py-1.5 rounded-lg text-sm font-semibold text-red-500 bg-red-100 dark:bg-red-900/30 hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors",
                                                                        children: "Reject"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/app/chat/page.tsx",
                                                                        lineNumber: 1502,
                                                                        columnNumber: 27
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/src/app/chat/page.tsx",
                                                                lineNumber: 1498,
                                                                columnNumber: 25
                                                            }, this)
                                                        ]
                                                    }, request.request_id, true, {
                                                        fileName: "[project]/src/app/chat/page.tsx",
                                                        lineNumber: 1485,
                                                        columnNumber: 58
                                                    }, this))
                                            }, void 0, false)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/app/chat/page.tsx",
                                        lineNumber: 1436,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/chat/page.tsx",
                                lineNumber: 1398,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("main", {
                                className: `flex-1 md:w-[65%] flex-col bg-white/40 dark:bg-[#002020]/40 h-full overflow-hidden ${showMobileChat ? 'flex' : 'hidden md:flex'}`,
                                children: selectedConversation ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("header", {
                                            className: "h-20 px-4 md:px-6 flex items-center justify-between border-b border-white/50 dark:border-[#004a4a]/50 bg-white/60 dark:bg-[#003535]/60 backdrop-blur-sm shrink-0 sticky top-0 z-20",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "flex items-center gap-3 md:gap-4",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                            onClick: ()=>setShowMobileChat(false),
                                                            className: "md:hidden p-2 -ml-2 hover:bg-white/50 dark:hover:bg-[#004040]/50 rounded-full transition-colors",
                                                            "aria-label": "Back to conversations",
                                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "material-symbols-outlined text-[#6f787d] dark:text-[#bfc8cd]",
                                                                children: "arrow_back"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/app/chat/page.tsx",
                                                                lineNumber: 1519,
                                                                columnNumber: 23
                                                            }, this)
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/app/chat/page.tsx",
                                                            lineNumber: 1518,
                                                            columnNumber: 21
                                                        }, this),
                                                        selectedConversation.other_user_dp ? !selectedConversation.is_anonymous ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                            onClick: (e_2)=>{
                                                                e_2.stopPropagation();
                                                                void navigateToProfileByUserId(selectedConversation.other_user_id);
                                                            },
                                                            className: "w-10 h-10 rounded-full overflow-hidden",
                                                            title: `View ${selectedConversation.other_user_name} profile`,
                                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                                                src: selectedConversation.other_user_dp,
                                                                alt: selectedConversation.other_user_name,
                                                                width: 40,
                                                                height: 40,
                                                                className: "w-10 h-10 rounded-full object-cover"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/app/chat/page.tsx",
                                                                lineNumber: 1525,
                                                                columnNumber: 27
                                                            }, this)
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/app/chat/page.tsx",
                                                            lineNumber: 1521,
                                                            columnNumber: 96
                                                        }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "w-10 h-10 rounded-full flex items-center justify-center text-white font-bold bg-linear-to-br from-[#87ceeb] to-[#ffb6c1]",
                                                            children: selectedConversation.is_anonymous ? '?' : selectedConversation.other_user_name.charAt(0).toUpperCase()
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/app/chat/page.tsx",
                                                            lineNumber: 1526,
                                                            columnNumber: 37
                                                        }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "w-10 h-10 rounded-full flex items-center justify-center text-white font-bold bg-linear-to-br from-[#87ceeb] to-[#ffb6c1]",
                                                            children: selectedConversation.is_anonymous ? '?' : selectedConversation.other_user_name.charAt(0).toUpperCase()
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/app/chat/page.tsx",
                                                            lineNumber: 1528,
                                                            columnNumber: 34
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                                                    className: "font-bold text-[#002020] dark:text-[#e7fffe] leading-tight cursor-pointer",
                                                                    onClick: ()=>{
                                                                        if (!selectedConversation.is_anonymous) void navigateToProfileByUserId(selectedConversation.other_user_id);
                                                                    },
                                                                    children: selectedConversation.other_user_name
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/app/chat/page.tsx",
                                                                    lineNumber: 1532,
                                                                    columnNumber: 23
                                                                }, this),
                                                                !selectedConversation.is_anonymous && selectedConversation.other_user_id && onlineUsers.has(selectedConversation.other_user_id) && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                    className: "text-xs text-green-500 font-medium",
                                                                    children: "Online now"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/app/chat/page.tsx",
                                                                    lineNumber: 1535,
                                                                    columnNumber: 155
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/app/chat/page.tsx",
                                                            lineNumber: 1531,
                                                            columnNumber: 21
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/app/chat/page.tsx",
                                                    lineNumber: 1516,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "flex items-center gap-2 relative",
                                                    children: [
                                                        !showMessageSearch ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                    onClick: ()=>setShowMessageSearch(true),
                                                                    className: "p-2 hover:bg-white/50 dark:hover:bg-[#004040]/50 rounded-full transition-colors",
                                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                        className: "material-symbols-outlined text-[#6f787d]",
                                                                        children: "search"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/app/chat/page.tsx",
                                                                        lineNumber: 1541,
                                                                        columnNumber: 27
                                                                    }, this)
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/app/chat/page.tsx",
                                                                    lineNumber: 1540,
                                                                    columnNumber: 25
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                    onClick: ()=>setShowMenu((s)=>!s),
                                                                    className: "p-2 hover:bg-white/50 dark:hover:bg-[#004040]/50 rounded-full transition-colors",
                                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                        className: "material-symbols-outlined text-[#6f787d] dark:text-[#bfc8cd]",
                                                                        children: "more_vert"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/app/chat/page.tsx",
                                                                        lineNumber: 1544,
                                                                        columnNumber: 27
                                                                    }, this)
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/app/chat/page.tsx",
                                                                    lineNumber: 1543,
                                                                    columnNumber: 25
                                                                }, this)
                                                            ]
                                                        }, void 0, true) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "flex items-center gap-2",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                    ref: messageSearchInputRef,
                                                                    value: messageSearchQuery,
                                                                    onChange: (e_3)=>setMessageSearchQuery(e_3.target.value),
                                                                    placeholder: "Search messages...",
                                                                    className: "px-3 py-2 rounded-full border border-white/40 dark:border-[#004a4a]/40 outline-none w-56 dark:bg-[#004040] dark:text-[#e7fffe]"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/app/chat/page.tsx",
                                                                    lineNumber: 1547,
                                                                    columnNumber: 25
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                    onClick: ()=>{
                                                                        setShowMessageSearch(false);
                                                                        setMessageSearchQuery('');
                                                                    },
                                                                    className: "p-2 hover:bg-white/50 dark:hover:bg-[#004040]/50 rounded-full transition-colors",
                                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                        className: "material-symbols-outlined text-[#6f787d] dark:text-[#bfc8cd]",
                                                                        children: "close"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/app/chat/page.tsx",
                                                                        lineNumber: 1552,
                                                                        columnNumber: 27
                                                                    }, this)
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/app/chat/page.tsx",
                                                                    lineNumber: 1548,
                                                                    columnNumber: 25
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/app/chat/page.tsx",
                                                            lineNumber: 1546,
                                                            columnNumber: 29
                                                        }, this),
                                                        showMenu && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "absolute right-0 mt-12 w-44 bg-white dark:bg-[#004040] rounded-xl shadow-lg p-2 z-50 border border-white/30 dark:border-[#004a4a]/30",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                    onClick: ()=>{
                                                                        setShowMenu(false);
                                                                        if (!selectedConversation?.is_anonymous) void navigateToProfileByUserId(selectedConversation?.other_user_id);
                                                                    },
                                                                    className: "w-full text-left px-3 py-2 rounded-lg hover:bg-gray-50 dark:hover:bg-[#005555] dark:text-[#e7fffe]",
                                                                    children: "View profile"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/app/chat/page.tsx",
                                                                    lineNumber: 1558,
                                                                    columnNumber: 25
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                    onClick: ()=>{
                                                                        setShowMenu(false);
                                                                        setShowBlockConfirm(true);
                                                                    },
                                                                    className: "w-full text-left px-3 py-2 rounded-lg hover:bg-gray-50 dark:hover:bg-[#005555] dark:text-[#e7fffe]",
                                                                    children: "Block"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/app/chat/page.tsx",
                                                                    lineNumber: 1564,
                                                                    columnNumber: 25
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                    onClick: ()=>{
                                                                        setShowMenu(false);
                                                                        setShowReportDialog(true);
                                                                    },
                                                                    className: "w-full text-left px-3 py-2 rounded-lg hover:bg-gray-50 dark:hover:bg-[#005555] dark:text-[#e7fffe]",
                                                                    children: "Report"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/app/chat/page.tsx",
                                                                    lineNumber: 1568,
                                                                    columnNumber: 25
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/app/chat/page.tsx",
                                                            lineNumber: 1557,
                                                            columnNumber: 34
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/app/chat/page.tsx",
                                                    lineNumber: 1538,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/app/chat/page.tsx",
                                            lineNumber: 1515,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "flex-1 overflow-y-auto p-6 space-y-4 flex flex-col scrollbar-visible",
                                            children: [
                                                (()=>{
                                                    const shownMessages = messageSearchQuery.trim() ? messageSearchResults : messages;
                                                    if (loadingMessages) {
                                                        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "flex-1 flex items-center justify-center",
                                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "w-8 h-8 rounded-full border-2 border-[#0c6780] dark:border-[#87ceeb] border-t-transparent animate-spin"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/app/chat/page.tsx",
                                                                lineNumber: 1582,
                                                                columnNumber: 27
                                                            }, this)
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/app/chat/page.tsx",
                                                            lineNumber: 1581,
                                                            columnNumber: 28
                                                        }, this);
                                                    }
                                                    if (shownMessages.length === 0) {
                                                        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "flex-1 flex items-center justify-center",
                                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "text-center",
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                        className: "w-16 h-16 rounded-full bg-[#87ceeb]/20 dark:bg-[#0c6780]/20 flex items-center justify-center mb-3 mx-auto",
                                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                            className: "material-symbols-outlined text-3xl text-[#0c6780] dark:text-[#87ceeb]",
                                                                            children: "chat_bubble"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/src/app/chat/page.tsx",
                                                                            lineNumber: 1589,
                                                                            columnNumber: 31
                                                                        }, this)
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/app/chat/page.tsx",
                                                                        lineNumber: 1588,
                                                                        columnNumber: 29
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                        className: "font-semibold text-[#002020] dark:text-[#e7fffe] mb-1",
                                                                        children: "No messages yet"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/app/chat/page.tsx",
                                                                        lineNumber: 1591,
                                                                        columnNumber: 29
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                        className: "text-sm text-[#6f787d] dark:text-[#bfc8cd]",
                                                                        children: "Start the conversation!"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/app/chat/page.tsx",
                                                                        lineNumber: 1592,
                                                                        columnNumber: 29
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/src/app/chat/page.tsx",
                                                                lineNumber: 1587,
                                                                columnNumber: 27
                                                            }, this)
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/app/chat/page.tsx",
                                                            lineNumber: 1586,
                                                            columnNumber: 28
                                                        }, this);
                                                    }
                                                    let lastDate = '';
                                                    return shownMessages.map((msg_1)=>{
                                                        const msgDate = new Date(msg_1.created_at).toDateString();
                                                        const showDateHeader = msgDate !== lastDate;
                                                        lastDate = msgDate;
                                                        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "flex flex-col",
                                                            children: [
                                                                showDateHeader && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    className: "flex justify-center my-4",
                                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                        className: "px-4 py-1.5 rounded-full text-[11px] font-semibold bg-white/60 text-[#6f787d] shadow-sm",
                                                                        children: formatDateHeader(msg_1.created_at)
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/app/chat/page.tsx",
                                                                        lineNumber: 1604,
                                                                        columnNumber: 31
                                                                    }, this)
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/app/chat/page.tsx",
                                                                    lineNumber: 1603,
                                                                    columnNumber: 46
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(MessageItem, {
                                                                    msg: msg_1,
                                                                    onReply: handleReply,
                                                                    onEdit: handleEdit,
                                                                    onDelete: handleDelete,
                                                                    onReact: handleReact,
                                                                    formatTime: formatTimeCompact
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/app/chat/page.tsx",
                                                                    lineNumber: 1609,
                                                                    columnNumber: 27
                                                                }, this)
                                                            ]
                                                        }, msg_1.message_id, true, {
                                                            fileName: "[project]/src/app/chat/page.tsx",
                                                            lineNumber: 1601,
                                                            columnNumber: 28
                                                        }, this);
                                                    });
                                                })(),
                                                isOtherTyping && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "flex justify-start",
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "bg-white dark:bg-[#004040] rounded-2xl rounded-bl-sm p-3 shadow-sm",
                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(TypingIndicator, {}, void 0, false, {
                                                            fileName: "[project]/src/app/chat/page.tsx",
                                                            lineNumber: 1616,
                                                            columnNumber: 25
                                                        }, this)
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/chat/page.tsx",
                                                        lineNumber: 1615,
                                                        columnNumber: 23
                                                    }, this)
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/chat/page.tsx",
                                                    lineNumber: 1614,
                                                    columnNumber: 37
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    ref: messagesEndRef
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/chat/page.tsx",
                                                    lineNumber: 1619,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/app/chat/page.tsx",
                                            lineNumber: 1577,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("footer", {
                                            className: "p-0 bg-white/30 dark:bg-[#003535]/30 backdrop-blur-md border-t border-white/30 dark:border-[#004a4a]/30 shrink-0",
                                            children: [
                                                replyingTo && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "mb-3 flex items-start gap-2 p-3 rounded-xl bg-[#87ceeb]/20 dark:bg-[#0c6780]/20 border-l-[3px] border-[#0c6780] dark:border-[#87ceeb]",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "flex-1 min-w-0",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                    className: "text-xs font-semibold mb-1 text-[#0c6780] dark:text-[#87ceeb]",
                                                                    children: [
                                                                        "Replying to ",
                                                                        replyingTo.sender_name || 'Unknown'
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/src/app/chat/page.tsx",
                                                                    lineNumber: 1627,
                                                                    columnNumber: 25
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                    className: "text-sm truncate text-[#6f787d] dark:text-[#bfc8cd]",
                                                                    children: replyingTo.encrypted_content || '📷 Image'
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/app/chat/page.tsx",
                                                                    lineNumber: 1630,
                                                                    columnNumber: 25
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/app/chat/page.tsx",
                                                            lineNumber: 1626,
                                                            columnNumber: 23
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                            onClick: ()=>setReplyingTo(null),
                                                            className: "w-6 h-6 rounded-full bg-white/60 dark:bg-[#004040]/60 flex items-center justify-center shrink-0 hover:bg-white dark:hover:bg-[#004040] transition-colors",
                                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "material-symbols-outlined text-[14px] text-[#6f787d] dark:text-[#bfc8cd]",
                                                                children: "close"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/app/chat/page.tsx",
                                                                lineNumber: 1635,
                                                                columnNumber: 25
                                                            }, this)
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/app/chat/page.tsx",
                                                            lineNumber: 1634,
                                                            columnNumber: 23
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/app/chat/page.tsx",
                                                    lineNumber: 1625,
                                                    columnNumber: 34
                                                }, this),
                                                selectedImage && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "mb-3 p-3 rounded-xl bg-[#87ceeb]/10 dark:bg-[#0c6780]/10 flex items-center gap-3",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "relative",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                                                    src: URL.createObjectURL(selectedImage),
                                                                    alt: "Selected",
                                                                    width: 64,
                                                                    height: 64,
                                                                    className: "w-16 h-16 object-cover rounded-lg"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/app/chat/page.tsx",
                                                                    lineNumber: 1641,
                                                                    columnNumber: 25
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                    onClick: ()=>setSelectedImage(null),
                                                                    className: "absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center text-xs",
                                                                    children: "×"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/app/chat/page.tsx",
                                                                    lineNumber: 1642,
                                                                    columnNumber: 25
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/app/chat/page.tsx",
                                                            lineNumber: 1640,
                                                            columnNumber: 23
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "flex-1 min-w-0",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                    className: "text-sm text-[#0c6780] dark:text-[#87ceeb] font-medium truncate",
                                                                    children: selectedImage.name
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/app/chat/page.tsx",
                                                                    lineNumber: 1647,
                                                                    columnNumber: 25
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                    className: "text-xs text-[#6f787d] dark:text-[#bfc8cd]",
                                                                    children: [
                                                                        (selectedImage.size / 1024).toFixed(1),
                                                                        " KB"
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/src/app/chat/page.tsx",
                                                                    lineNumber: 1648,
                                                                    columnNumber: 25
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/app/chat/page.tsx",
                                                            lineNumber: 1646,
                                                            columnNumber: 23
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/app/chat/page.tsx",
                                                    lineNumber: 1639,
                                                    columnNumber: 37
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "bg-white dark:bg-[#004040] rounded-xl flex items-center p-2 gap-2 shadow-sm border border-white/50 dark:border-[#004a4a]/50 relative",
                                                    children: [
                                                        showEmojiPickerInput && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            ref: emojiPickerInputRef,
                                                            className: "absolute bottom-full left-2 mb-2 z-50 bg-white dark:bg-[#004040] rounded-xl p-2 shadow-xl flex gap-1 flex-wrap max-w-70",
                                                            children: EMOJI_OPTIONS.map((emoji_0)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                    onClick: ()=>{
                                                                        setMessageInput((prev_4)=>prev_4 + emoji_0);
                                                                        setShowEmojiPickerInput(false);
                                                                        messageInputRef.current?.focus();
                                                                    },
                                                                    className: "w-8 h-8 rounded-lg text-lg flex items-center justify-center hover:scale-125 active:scale-95 transition-transform hover:bg-gray-100 dark:hover:bg-[#005555]",
                                                                    children: emoji_0
                                                                }, emoji_0, false, {
                                                                    fileName: "[project]/src/app/chat/page.tsx",
                                                                    lineNumber: 1654,
                                                                    columnNumber: 55
                                                                }, this))
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/app/chat/page.tsx",
                                                            lineNumber: 1653,
                                                            columnNumber: 46
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                            onClick: ()=>setShowEmojiPickerInput(!showEmojiPickerInput),
                                                            className: "p-2 text-[#6f787d] dark:text-[#bfc8cd] hover:text-[#0c6780] dark:hover:text-[#87ceeb] transition-colors",
                                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "material-symbols-outlined",
                                                                children: "sentiment_satisfied"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/app/chat/page.tsx",
                                                                lineNumber: 1663,
                                                                columnNumber: 23
                                                            }, this)
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/app/chat/page.tsx",
                                                            lineNumber: 1662,
                                                            columnNumber: 21
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                            type: "file",
                                                            ref: fileInputRef,
                                                            className: "hidden",
                                                            accept: "image/*",
                                                            onChange: (e_4)=>{
                                                                const file = e_4.target.files?.[0];
                                                                if (file) setSelectedImage(file);
                                                            }
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/app/chat/page.tsx",
                                                            lineNumber: 1665,
                                                            columnNumber: 21
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                            onClick: ()=>fileInputRef.current?.click(),
                                                            className: "p-2 text-[#6f787d] dark:text-[#bfc8cd] hover:text-[#0c6780] dark:hover:text-[#87ceeb] transition-colors",
                                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "material-symbols-outlined",
                                                                children: "attach_file"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/app/chat/page.tsx",
                                                                lineNumber: 1670,
                                                                columnNumber: 23
                                                            }, this)
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/app/chat/page.tsx",
                                                            lineNumber: 1669,
                                                            columnNumber: 21
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                            ref: messageInputRef,
                                                            className: "flex-1 bg-transparent border-none focus:ring-0 text-sm py-2 outline-none dark:text-[#e7fffe] dark:placeholder-[#6f787d]",
                                                            placeholder: isBlocked ? "Cannot send message - user is blocked" : "Type a message...",
                                                            type: "text",
                                                            value: messageInput,
                                                            onChange: (e_5)=>{
                                                                setMessageInput(e_5.target.value);
                                                                // Send typing event
                                                                if (selectedConversation && isConnected && socket) {
                                                                    socket.emit('typing', {
                                                                        chatId: selectedConversation.conversation_id,
                                                                        chatType: 'conversation',
                                                                        isTyping: true
                                                                    });
                                                                    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
                                                                    typingTimeoutRef.current = setTimeout(()=>{
                                                                        socket.emit('typing', {
                                                                            chatId: selectedConversation.conversation_id,
                                                                            chatType: 'conversation',
                                                                            isTyping: false
                                                                        });
                                                                    }, 2000);
                                                                }
                                                            },
                                                            onKeyDown: (e_6)=>e_6.key === 'Enter' && !sending && handleSendMessage(),
                                                            disabled: sending || isBlocked
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/app/chat/page.tsx",
                                                            lineNumber: 1672,
                                                            columnNumber: 21
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                            onClick: handleSendMessage,
                                                            disabled: !messageInput.trim() && !selectedImage || sending || isBlocked,
                                                            className: "bg-linear-to-r from-[#87ceeb] via-[#e6e6fa] to-[#ffb6c1] dark:from-[#0c6780] dark:via-[#4a6368] dark:to-[#0c6780] w-10 h-10 rounded-lg flex items-center justify-center text-[#002020] dark:text-white hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed",
                                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "material-symbols-outlined",
                                                                children: "send"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/app/chat/page.tsx",
                                                                lineNumber: 1692,
                                                                columnNumber: 23
                                                            }, this)
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/app/chat/page.tsx",
                                                            lineNumber: 1691,
                                                            columnNumber: 21
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/app/chat/page.tsx",
                                                    lineNumber: 1651,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/app/chat/page.tsx",
                                            lineNumber: 1623,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex-1 flex items-center justify-center",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "text-center",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "w-20 h-20 rounded-full bg-[#87ceeb]/20 dark:bg-[#0c6780]/20 flex items-center justify-center mb-4 mx-auto",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "material-symbols-outlined text-4xl text-[#0c6780] dark:text-[#87ceeb]",
                                                    children: "chat"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/chat/page.tsx",
                                                    lineNumber: 1699,
                                                    columnNumber: 21
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/chat/page.tsx",
                                                lineNumber: 1698,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "text-lg font-semibold text-[#002020] dark:text-[#e7fffe] mb-1",
                                                children: "Select a conversation"
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/chat/page.tsx",
                                                lineNumber: 1701,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "text-sm text-[#6f787d] dark:text-[#bfc8cd]",
                                                children: "Choose a chat from the list to start messaging"
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/chat/page.tsx",
                                                lineNumber: 1702,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/app/chat/page.tsx",
                                        lineNumber: 1697,
                                        columnNumber: 17
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/src/app/chat/page.tsx",
                                    lineNumber: 1696,
                                    columnNumber: 21
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/src/app/chat/page.tsx",
                                lineNumber: 1512,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/chat/page.tsx",
                        lineNumber: 1396,
                        columnNumber: 9
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/src/app/chat/page.tsx",
                    lineNumber: 1394,
                    columnNumber: 7
                }, this),
                showBlockConfirm && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50",
                    onClick: ()=>setShowBlockConfirm(false),
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "bg-white dark:bg-[#003535] rounded-2xl p-6 max-w-sm w-full shadow-xl",
                        onClick: (e_7)=>e_7.stopPropagation(),
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                className: "text-lg font-bold mb-2 text-[#002020] dark:text-[#e7fffe]",
                                children: "Block user"
                            }, void 0, false, {
                                fileName: "[project]/src/app/chat/page.tsx",
                                lineNumber: 1713,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-sm mb-4 text-[#6f787d] dark:text-[#bfc8cd]",
                                children: [
                                    "Are you sure you want to block ",
                                    selectedConversation?.other_user_name,
                                    "? You will not be able to send or receive messages from this user."
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/chat/page.tsx",
                                lineNumber: 1714,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex gap-2",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        onClick: ()=>setShowBlockConfirm(false),
                                        className: "flex-1 px-4 py-2 rounded-xl bg-gray-100 dark:bg-[#004040] text-sm font-semibold text-[#6f787d] dark:text-[#bfc8cd] hover:bg-gray-200 dark:hover:bg-[#004a4a]",
                                        children: "Cancel"
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/chat/page.tsx",
                                        lineNumber: 1716,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        onClick: ()=>void handleBlockSelectedUser(),
                                        disabled: blocking,
                                        className: "flex-1 px-4 py-2 rounded-xl bg-red-500 text-sm font-semibold text-white hover:bg-red-600 disabled:opacity-50",
                                        children: blocking ? 'Blocking...' : 'Block'
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/chat/page.tsx",
                                        lineNumber: 1717,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/chat/page.tsx",
                                lineNumber: 1715,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/chat/page.tsx",
                        lineNumber: 1712,
                        columnNumber: 11
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/src/app/chat/page.tsx",
                    lineNumber: 1711,
                    columnNumber: 28
                }, this),
                showReportDialog && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50",
                    onClick: ()=>setShowReportDialog(false),
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "bg-white dark:bg-[#003535] rounded-2xl p-6 max-w-md w-full shadow-xl",
                        onClick: (e_8)=>e_8.stopPropagation(),
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                className: "text-lg font-bold mb-2 text-[#002020] dark:text-[#e7fffe]",
                                children: "Report user"
                            }, void 0, false, {
                                fileName: "[project]/src/app/chat/page.tsx",
                                lineNumber: 1725,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-sm mb-3 text-[#6f787d] dark:text-[#bfc8cd]",
                                children: [
                                    "Tell us why you are reporting ",
                                    selectedConversation?.other_user_name,
                                    ". Our team will review it."
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/chat/page.tsx",
                                lineNumber: 1726,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "space-y-2 mb-4",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                        className: "text-sm text-[#6f787d] dark:text-[#bfc8cd]",
                                        children: "Reason"
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/chat/page.tsx",
                                        lineNumber: 1728,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                        value: reportType,
                                        onChange: (e_9)=>setReportType(e_9.target.value),
                                        className: "w-full p-2 rounded-md border dark:bg-[#004040] dark:border-[#004a4a] dark:text-[#e7fffe]",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                value: "spam",
                                                children: "Spam"
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/chat/page.tsx",
                                                lineNumber: 1732,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                value: "harassment",
                                                children: "Harassment"
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/chat/page.tsx",
                                                lineNumber: 1733,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                value: "inappropriate_content",
                                                children: "Inappropriate content"
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/chat/page.tsx",
                                                lineNumber: 1734,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                value: "impersonating",
                                                children: "Impersonating"
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/chat/page.tsx",
                                                lineNumber: 1735,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                value: "fake_profile",
                                                children: "Fake profile"
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/chat/page.tsx",
                                                lineNumber: 1736,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                value: "other",
                                                children: "Other"
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/chat/page.tsx",
                                                lineNumber: 1737,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/app/chat/page.tsx",
                                        lineNumber: 1731,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                        className: "text-sm text-[#6f787d] dark:text-[#bfc8cd]",
                                        children: "Description"
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/chat/page.tsx",
                                        lineNumber: 1739,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("textarea", {
                                        value: reportDescription,
                                        onChange: (e_10)=>setReportDescription(e_10.target.value),
                                        rows: 4,
                                        className: "w-full p-2 rounded-md border dark:bg-[#004040] dark:border-[#004a4a] dark:text-[#e7fffe]"
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/chat/page.tsx",
                                        lineNumber: 1740,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/chat/page.tsx",
                                lineNumber: 1727,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex gap-2",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        onClick: ()=>setShowReportDialog(false),
                                        className: "flex-1 px-4 py-2 rounded-xl bg-gray-100 dark:bg-[#004040] text-sm font-semibold text-[#6f787d] dark:text-[#bfc8cd] hover:bg-gray-200 dark:hover:bg-[#004a4a]",
                                        children: "Cancel"
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/chat/page.tsx",
                                        lineNumber: 1743,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        onClick: ()=>void handleSubmitReport(),
                                        disabled: reporting,
                                        className: "flex-1 px-4 py-2 rounded-xl bg-primary-container dark:bg-[#0c6780] text-sm font-semibold text-on-primary-container dark:text-white hover:opacity-90 disabled:opacity-50",
                                        children: reporting ? 'Submitting...' : 'Submit Report'
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/chat/page.tsx",
                                        lineNumber: 1744,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/chat/page.tsx",
                                lineNumber: 1742,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/chat/page.tsx",
                        lineNumber: 1724,
                        columnNumber: 11
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/src/app/chat/page.tsx",
                    lineNumber: 1723,
                    columnNumber: 28
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/src/app/chat/page.tsx",
            lineNumber: 1392,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/src/app/chat/page.tsx",
        lineNumber: 1391,
        columnNumber: 10
    }, this);
}
_s1(ChatPage, "Cx3nkj9GTblzBd692WLUn7XwKvQ=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$contexts$2f$SocketContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSocket"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$hooks$2f$usePresence$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["usePresence"]
    ];
});
_c2 = ChatPage;
var _c, _c1, _c2;
__turbopack_context__.k.register(_c, "TypingIndicator");
__turbopack_context__.k.register(_c1, "MessageItem");
__turbopack_context__.k.register(_c2, "ChatPage");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=src_bb55a47a._.js.map