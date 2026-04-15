module.exports = [
"[project]/src/services/request-dedupe.service.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
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
}),
"[project]/src/services/chat.service.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "chatService",
    ()=>chatService
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$apiClient$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/apiClient.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$request$2d$dedupe$2e$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/services/request-dedupe.service.ts [app-ssr] (ecmascript)");
;
;
const api = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$apiClient$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"];
const CHAT_PREFIX = '/api/chat';
const CHAT_GET_DEDUPE_NAMESPACE = 'chat|';
const chatService = {
    async sendChatRequest (receiverId) {
        const response = await api.post(`${CHAT_PREFIX}/conversation`, {
            otherUserId: receiverId
        });
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$request$2d$dedupe$2e$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["clearInFlightGetRequestDedupe"])(CHAT_GET_DEDUPE_NAMESPACE);
        return response.data;
    },
    // Get pending chat requests
    async getChatRequests () {
        const response = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$request$2d$dedupe$2e$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["dedupedGet"])(api, `${CHAT_PREFIX}/requests`, undefined, {
            namespace: CHAT_GET_DEDUPE_NAMESPACE
        });
        return response.data.data;
    },
    // Respond to chat request
    async respondToChatRequest (requestId, action) {
        const response = await api.put(`${CHAT_PREFIX}/request/${requestId}`, {
            action
        });
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$request$2d$dedupe$2e$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["clearInFlightGetRequestDedupe"])(CHAT_GET_DEDUPE_NAMESPACE);
        return response.data;
    },
    // Get all conversations
    async getConversations () {
        const response = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$request$2d$dedupe$2e$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["dedupedGet"])(api, `${CHAT_PREFIX}/conversations`, undefined, {
            namespace: CHAT_GET_DEDUPE_NAMESPACE
        });
        return response.data.data;
    },
    // Get messages for a conversation
    async getMessages (conversationId, limit = 50, before, q, prefetchNext = true) {
        const response = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$request$2d$dedupe$2e$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["dedupedGet"])(api, `${CHAT_PREFIX}/conversation/${conversationId}/messages`, {
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
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$request$2d$dedupe$2e$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["clearInFlightGetRequestDedupe"])(CHAT_GET_DEDUPE_NAMESPACE);
        return response.data;
    },
    // Update message status
    async updateMessageStatus (messageId, status) {
        const response = await api.put(`${CHAT_PREFIX}/message/${messageId}/status`, {
            status
        });
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$request$2d$dedupe$2e$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["clearInFlightGetRequestDedupe"])(CHAT_GET_DEDUPE_NAMESPACE);
        return response.data;
    },
    // Delete message
    async deleteMessage (messageId, deleteFor = 'me') {
        const response = await api.delete(`${CHAT_PREFIX}/message/${messageId}`, {
            data: {
                deleteFor
            }
        });
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$request$2d$dedupe$2e$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["clearInFlightGetRequestDedupe"])(CHAT_GET_DEDUPE_NAMESPACE);
        return response.data;
    },
    // Block user in conversation
    async blockUser (conversationId) {
        const response = await api.post(`${CHAT_PREFIX}/block/${conversationId}`);
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$request$2d$dedupe$2e$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["clearInFlightGetRequestDedupe"])(CHAT_GET_DEDUPE_NAMESPACE);
        return response.data;
    },
    // Unblock user in conversation
    async unblockUser (conversationId) {
        const response = await api.delete(`${CHAT_PREFIX}/unblock/${conversationId}`);
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$request$2d$dedupe$2e$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["clearInFlightGetRequestDedupe"])(CHAT_GET_DEDUPE_NAMESPACE);
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
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$request$2d$dedupe$2e$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["clearInFlightGetRequestDedupe"])(CHAT_GET_DEDUPE_NAMESPACE);
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
        const response = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$request$2d$dedupe$2e$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["dedupedGet"])(api, `${CHAT_PREFIX}/${conversationId}/participants/keys`, undefined, {
            namespace: CHAT_GET_DEDUPE_NAMESPACE
        });
        return response.data.data;
    },
    // Store encrypted session keys
    async storeSessionKeys (data) {
        const response = await api.post(`${CHAT_PREFIX}/keys`, data);
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$request$2d$dedupe$2e$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["clearInFlightGetRequestDedupe"])(CHAT_GET_DEDUPE_NAMESPACE);
        return response.data.data;
    }
};
}),
"[project]/src/services/anonymous-chat.service.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
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
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/axios/lib/axios.js [app-ssr] (ecmascript)");
;
const API_URL = ("TURBOPACK compile-time value", "http://localhost:3001");
const api = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].create({
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
    const chatApi = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].create({
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
}),
"[project]/src/services/apiBase.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// Centralized API base URL utility
__turbopack_context__.s([
    "API_BASE_URL",
    ()=>API_BASE_URL
]);
const API_BASE_URL = ("TURBOPACK compile-time value", "http://localhost:3001");
}),
"[project]/src/services/message-management.service.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "messageManagementService",
    ()=>messageManagementService
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/axios/lib/axios.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$apiBase$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/services/apiBase.ts [app-ssr] (ecmascript)");
;
;
const API_URL = `${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$apiBase$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["API_BASE_URL"]}/api/messages`;
const messageManagementService = {
    // ========== REACTIONS ==========
    async addReaction (messageId, emoji, token) {
        const response = await __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].post(`${API_URL}/message/${messageId}/reaction`, {
            emoji
        }, {
            withCredentials: true
        });
        return response.data;
    },
    async removeReaction (messageId, emoji, token) {
        const response = await __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].delete(`${API_URL}/message/${messageId}/reaction`, {
            data: {
                emoji
            },
            withCredentials: true
        });
        return response.data;
    },
    async getReactions (messageId, token) {
        const response = await __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].get(`${API_URL}/message/${messageId}/reactions`, {
            withCredentials: true
        });
        return response.data;
    },
    // ========== EDITING ==========
    async editMessage (messageId, encryptedContent, contentIv, contentAuthTag, token) {
        const response = await __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].put(`${API_URL}/message/${messageId}/edit`, {
            encryptedContent,
            contentIv,
            contentAuthTag
        }, {
            withCredentials: true
        });
        return response.data;
    },
    async getEditHistory (messageId, token) {
        const response = await __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].get(`${API_URL}/message/${messageId}/history`, {
            withCredentials: true
        });
        return response.data;
    },
    // ========== DELETION ==========
    async deleteMessage (messageId, deleteForEveryone, token) {
        const response = await __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].delete(`${API_URL}/message/${messageId}/delete`, {
            data: {
                deleteForEveryone
            },
            withCredentials: true
        });
        return response.data;
    }
};
}),
"[project]/src/hooks/usePresence.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "usePresence",
    ()=>usePresence
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$contexts$2f$SocketContext$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/contexts/SocketContext.tsx [app-ssr] (ecmascript)");
'use client';
;
;
const API_URL = ("TURBOPACK compile-time value", "http://localhost:3001");
function usePresence(userIds) {
    const [onlineSet, setOnlineSet] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(new Set());
    const { getSocket, isConnected } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$contexts$2f$SocketContext$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useSocket"])();
    const listenersAttached = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(false);
    // Fetch initial presence snapshot from Redis
    const fetchPresence = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(async (ids)=>{
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
            const online = new Set(Object.entries(presence).filter(([, v])=>v).map(([k])=>k));
            setOnlineSet(online);
        } catch  {
        // silently ignore network errors — not critical
        }
    }, []);
    // Fetch on mount / when the user list changes
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        fetchPresence(userIds);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [
        userIds.join(',')
    ]);
    // Subscribe to real-time socket events
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if (!isConnected) return;
        const socket = getSocket();
        if (!socket || listenersAttached.current) return;
        const handleOnline = ({ userId })=>{
            setOnlineSet((prev)=>{
                const next = new Set(prev);
                next.add(userId);
                return next;
            });
        };
        const handleOffline = ({ userId })=>{
            setOnlineSet((prev)=>{
                const next = new Set(prev);
                next.delete(userId);
                return next;
            });
        };
        socket.on('user-online', handleOnline);
        socket.on('user-offline', handleOffline);
        listenersAttached.current = true;
        return ()=>{
            socket.off('user-online', handleOnline);
            socket.off('user-offline', handleOffline);
            listenersAttached.current = false;
        };
    }, [
        isConnected,
        getSocket
    ]);
    return onlineSet;
}
}),
"[project]/src/utils/e2ee.utils.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
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
}),
"[project]/src/app/chat/page.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>ChatPage
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/client/app-dir/link.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$chat$2e$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/services/chat.service.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$anonymous$2d$chat$2e$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/services/anonymous-chat.service.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$message$2d$management$2e$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/services/message-management.service.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/image.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$hooks$2f$usePresence$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/hooks/usePresence.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$contexts$2f$SocketContext$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/contexts/SocketContext.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$e2ee$2e$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/utils/e2ee.utils.ts [app-ssr] (ecmascript)");
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
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "flex items-center gap-1 mt-1",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                className: "w-2 h-2 bg-[#6f787d] dark:bg-[#bfc8cd] rounded-full animate-bounce",
                style: {
                    animationDelay: '0ms'
                }
            }, void 0, false, {
                fileName: "[project]/src/app/chat/page.tsx",
                lineNumber: 128,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                className: "w-2 h-2 bg-[#6f787d] dark:bg-[#bfc8cd] rounded-full animate-bounce",
                style: {
                    animationDelay: '150ms'
                }
            }, void 0, false, {
                fileName: "[project]/src/app/chat/page.tsx",
                lineNumber: 129,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                className: "w-2 h-2 bg-[#6f787d] dark:bg-[#bfc8cd] rounded-full animate-bounce",
                style: {
                    animationDelay: '300ms'
                }
            }, void 0, false, {
                fileName: "[project]/src/app/chat/page.tsx",
                lineNumber: 130,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/app/chat/page.tsx",
        lineNumber: 127,
        columnNumber: 5
    }, this);
}
function MessageItem({ msg, onReply, onEdit, onDelete, onReact, formatTime }) {
    const [showActions, setShowActions] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [isEditing, setIsEditing] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [editContent, setEditContent] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(msg.encrypted_content || '');
    const [showDeleteDialog, setShowDeleteDialog] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [showEmojiPicker, setShowEmojiPicker] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const emojiPickerRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    const isMyMessage = msg.is_my_message;
    const [messageAge, setMessageAge] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(()=>Date.now() - new Date(msg.created_at).getTime());
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        const interval = setInterval(()=>{
            setMessageAge(Date.now() - new Date(msg.created_at).getTime());
        }, 1000); // update every second, or adjust as needed
        return ()=>clearInterval(interval);
    }, [
        msg.created_at
    ]);
    const canDeleteForEveryone = isMyMessage && messageAge <= 48 * 60 * 60 * 1000;
    const handleEditSubmit = ()=>{
        if (editContent.trim() && editContent !== msg.encrypted_content) {
            onEdit?.(msg.message_id, editContent);
        }
        setIsEditing(false);
    };
    const EMOJI_OPTIONS = [
        '👍',
        '❤️',
        '😂',
        '😮',
        '😢',
        '🙏',
        '🎉',
        '🔥'
    ];
    // Close emoji picker when clicking outside
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if (!showEmojiPicker) return;
        const handleClickOutside = (e)=>{
            if (emojiPickerRef.current && !emojiPickerRef.current.contains(e.target)) {
                setShowEmojiPicker(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return ()=>document.removeEventListener('mousedown', handleClickOutside);
    }, [
        showEmojiPicker
    ]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: `flex ${isMyMessage ? 'justify-end' : 'justify-start'} group relative mb-1`,
                onMouseEnter: ()=>setShowActions(true),
                onMouseLeave: ()=>{
                    setShowActions(false);
                },
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: `flex items-center gap-0.5 self-center shrink-0 transition-all duration-150
            ${showActions ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}
            ${isMyMessage ? 'order-first mr-1.5' : 'order-last ml-1.5'}`,
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "relative group",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        onClick: ()=>setShowEmojiPicker(!showEmojiPicker),
                                        className: "w-7 h-7 rounded-full bg-white/60 flex items-center justify-center text-base hover:scale-110 active:scale-95 transition-transform",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "material-symbols-outlined text-[14px] text-[#6f787d]",
                                            children: "sentiment_satisfied"
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/chat/page.tsx",
                                            lineNumber: 194,
                                            columnNumber: 15
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/chat/page.tsx",
                                        lineNumber: 190,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "absolute bottom-full left-1/2 -translate-x-1/2 mb-1 px-2 py-1 bg-gray-800 text-white text-[10px] rounded opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-150 whitespace-nowrap z-50 pointer-events-none",
                                        children: [
                                            "React",
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-800"
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/chat/page.tsx",
                                                lineNumber: 198,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/app/chat/page.tsx",
                                        lineNumber: 196,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/chat/page.tsx",
                                lineNumber: 189,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "relative group",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        onClick: ()=>onReply?.(msg),
                                        className: "w-7 h-7 rounded-full bg-white/60 flex items-center justify-center hover:scale-110 active:scale-95 transition-transform",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "material-symbols-outlined text-[14px] text-[#6f787d]",
                                            children: "reply"
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/chat/page.tsx",
                                            lineNumber: 208,
                                            columnNumber: 15
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/chat/page.tsx",
                                        lineNumber: 204,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "absolute bottom-full left-1/2 -translate-x-1/2 mb-1 px-2 py-1 bg-gray-800 text-white text-[10px] rounded opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-150 whitespace-nowrap z-50 pointer-events-none",
                                        children: [
                                            "Reply",
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-800"
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/chat/page.tsx",
                                                lineNumber: 212,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/app/chat/page.tsx",
                                        lineNumber: 210,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/chat/page.tsx",
                                lineNumber: 203,
                                columnNumber: 11
                            }, this),
                            isMyMessage && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "relative group",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        onClick: ()=>setIsEditing(true),
                                        className: "w-7 h-7 rounded-full bg-white/60 flex items-center justify-center hover:scale-110 active:scale-95 transition-transform",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "material-symbols-outlined text-[14px] text-[#6f787d]",
                                            children: "edit"
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/chat/page.tsx",
                                            lineNumber: 223,
                                            columnNumber: 17
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/chat/page.tsx",
                                        lineNumber: 219,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "absolute bottom-full left-1/2 -translate-x-1/2 mb-1 px-2 py-1 bg-gray-800 text-white text-[10px] rounded opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-150 whitespace-nowrap z-50 pointer-events-none",
                                        children: [
                                            "Edit",
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-800"
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/chat/page.tsx",
                                                lineNumber: 227,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/app/chat/page.tsx",
                                        lineNumber: 225,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/chat/page.tsx",
                                lineNumber: 218,
                                columnNumber: 13
                            }, this),
                            isMyMessage && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "relative group",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        onClick: ()=>setShowDeleteDialog(true),
                                        className: "w-7 h-7 rounded-full bg-white/60 flex items-center justify-center hover:scale-110 active:scale-95 transition-transform",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "material-symbols-outlined text-[14px] text-red-500",
                                            children: "delete"
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/chat/page.tsx",
                                            lineNumber: 239,
                                            columnNumber: 17
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/chat/page.tsx",
                                        lineNumber: 235,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "absolute bottom-full left-1/2 -translate-x-1/2 mb-1 px-2 py-1 bg-gray-800 text-white text-[10px] rounded opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-150 whitespace-nowrap z-50 pointer-events-none",
                                        children: [
                                            "Delete",
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-800"
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/chat/page.tsx",
                                                lineNumber: 243,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/app/chat/page.tsx",
                                        lineNumber: 241,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/chat/page.tsx",
                                lineNumber: 234,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/chat/page.tsx",
                        lineNumber: 183,
                        columnNumber: 9
                    }, this),
                    showEmojiPicker && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        ref: emojiPickerRef,
                        className: `absolute z-50 bg-white dark:bg-[#004040] rounded-xl p-2 shadow-xl flex gap-1 animate-scale-in ${isMyMessage ? 'right-0' : 'left-0'}`,
                        style: {
                            bottom: '100%',
                            marginBottom: '8px'
                        },
                        onMouseEnter: (e)=>e.stopPropagation(),
                        children: EMOJI_OPTIONS.map((emoji)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: (e)=>{
                                    e.stopPropagation();
                                    onReact?.(msg.message_id, emoji);
                                    setShowEmojiPicker(false);
                                },
                                className: "w-8 h-8 rounded-lg text-lg flex items-center justify-center hover:scale-125 active:scale-95 transition-transform hover:bg-gray-100 dark:hover:bg-[#005555]",
                                children: emoji
                            }, emoji, false, {
                                fileName: "[project]/src/app/chat/page.tsx",
                                lineNumber: 258,
                                columnNumber: 15
                            }, this))
                    }, void 0, false, {
                        fileName: "[project]/src/app/chat/page.tsx",
                        lineNumber: 251,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "relative flex flex-col max-w-[75%] md:max-w-[60%]",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: `${isMyMessage ? 'bg-linear-to-r from-[#87ceeb] via-[#e6e6fa] to-[#ffb6c1] text-[#002020] rounded-2xl rounded-br-md' : 'bg-[#e1e1f5] dark:bg-[#004a4a] text-[#5c5d6e] dark:text-[#e7fffe] rounded-2xl rounded-bl-md'} p-3 shadow-sm`,
                                children: [
                                    !isMyMessage && msg.sender_name && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "text-xs font-semibold mb-1 text-[#0c6780] dark:text-[#87ceeb]",
                                        children: msg.sender_name
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/chat/page.tsx",
                                        lineNumber: 281,
                                        columnNumber: 15
                                    }, this),
                                    msg.parent_message_id && msg.parent_message && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: `mb-2 px-3 py-2 rounded-lg text-xs cursor-pointer ${isMyMessage ? 'bg-white/20 border-l-[3px] border-white/60' : 'bg-black/5 border-l-[3px] border-[#0c6780]'}`,
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: `font-bold mb-0.5 ${isMyMessage ? 'text-white/90' : 'text-[#0c6780]'}`,
                                                children: msg.parent_message.sender_name || msg.parent_message.sender?.name || 'Unknown'
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/chat/page.tsx",
                                                lineNumber: 287,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: `line-clamp-2 ${isMyMessage ? 'text-white/75' : 'text-[#5c5d6e]'}`,
                                                children: msg.parent_message.encrypted_content || '📷 Image'
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/chat/page.tsx",
                                                lineNumber: 290,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/app/chat/page.tsx",
                                        lineNumber: 286,
                                        columnNumber: 15
                                    }, this),
                                    isEditing ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "space-y-2",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                type: "text",
                                                value: editContent,
                                                onChange: (e)=>setEditContent(e.target.value),
                                                onKeyDown: (e)=>{
                                                    if (e.key === 'Enter') handleEditSubmit();
                                                    if (e.key === 'Escape') {
                                                        setIsEditing(false);
                                                        setEditContent(msg.encrypted_content || '');
                                                    }
                                                },
                                                className: "w-full px-3 py-2 rounded-lg bg-white/80 text-sm outline-none",
                                                autoFocus: true
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/chat/page.tsx",
                                                lineNumber: 299,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "flex gap-2",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                        onClick: handleEditSubmit,
                                                        className: "flex-1 px-3 py-1 rounded-lg text-xs font-semibold bg-[#87ceeb] text-white",
                                                        children: "Save"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/chat/page.tsx",
                                                        lineNumber: 311,
                                                        columnNumber: 19
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                        onClick: ()=>{
                                                            setIsEditing(false);
                                                            setEditContent(msg.encrypted_content || '');
                                                        },
                                                        className: "flex-1 px-3 py-1 rounded-lg text-xs font-semibold bg-white/60 text-[#6f787d]",
                                                        children: "Cancel"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/chat/page.tsx",
                                                        lineNumber: 312,
                                                        columnNumber: 19
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/app/chat/page.tsx",
                                                lineNumber: 310,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/app/chat/page.tsx",
                                        lineNumber: 298,
                                        columnNumber: 15
                                    }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
                                        children: [
                                            msg.message_type === 'image' && msg.media_url && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "mb-2 -mx-1",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                                                    href: msg.media_url,
                                                    target: "_blank",
                                                    rel: "noopener noreferrer",
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                                                        src: msg.media_url,
                                                        alt: "Shared image",
                                                        width: 300,
                                                        height: 200,
                                                        className: "max-w-full rounded-xl cursor-pointer hover:opacity-90 transition-opacity",
                                                        style: {
                                                            objectFit: 'contain',
                                                            height: 'auto',
                                                            maxHeight: '300px'
                                                        },
                                                        loading: "lazy",
                                                        unoptimized: true
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/chat/page.tsx",
                                                        lineNumber: 321,
                                                        columnNumber: 23
                                                    }, this)
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/chat/page.tsx",
                                                    lineNumber: 320,
                                                    columnNumber: 21
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/chat/page.tsx",
                                                lineNumber: 319,
                                                columnNumber: 19
                                            }, this),
                                            msg.encrypted_content && msg.encrypted_content !== 'Image' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "text-sm whitespace-pre-wrap",
                                                children: msg.encrypted_content
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/chat/page.tsx",
                                                lineNumber: 336,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: `flex items-center gap-1.5 mt-1 ${isMyMessage ? 'justify-end' : 'justify-start'}`,
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: `text-[10px] ${isMyMessage ? 'text-[#005870]/70' : 'text-[#6f787d]'}`,
                                                        children: formatTime(msg.created_at)
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/chat/page.tsx",
                                                        lineNumber: 340,
                                                        columnNumber: 19
                                                    }, this),
                                                    msg.is_edited && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: `text-[9px] ${isMyMessage ? 'text-[#005870]/50' : 'text-[#6f787d]/60'}`,
                                                        children: "(edited)"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/chat/page.tsx",
                                                        lineNumber: 344,
                                                        columnNumber: 21
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/app/chat/page.tsx",
                                                lineNumber: 339,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/chat/page.tsx",
                                lineNumber: 275,
                                columnNumber: 11
                            }, this),
                            msg.reactions && msg.reactions.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: `flex flex-wrap gap-1 mt-1 ${isMyMessage ? 'justify-end' : 'justify-start'}`,
                                children: msg.reactions.map((reaction)=>{
                                    const userStr = ("TURBOPACK compile-time falsy", 0) ? "TURBOPACK unreachable" : null;
                                    const currentUserId = ("TURBOPACK compile-time falsy", 0) ? "TURBOPACK unreachable" : null;
                                    const iReacted = reaction.users?.some((u)=>u.user_id === currentUserId);
                                    const hasUsers = reaction.users && reaction.users.length > 0;
                                    const reactedNames = hasUsers ? reaction.users?.map((u)=>u.name || 'Unknown').join(', ') : `${reaction.count} reaction${reaction.count !== 1 ? 's' : ''}`;
                                    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "relative group",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                onClick: ()=>onReact?.(msg.message_id, reaction.emoji),
                                                className: "px-2 py-0.5 rounded-full text-xs flex items-center gap-1 hover:scale-110 transition-transform cursor-pointer",
                                                style: {
                                                    background: iReacted ? 'rgba(135, 206, 235, 0.3)' : 'rgba(255,255,255,0.6)',
                                                    border: `1px solid ${iReacted ? 'rgba(135, 206, 235, 0.6)' : 'rgba(0,0,0,0.1)'}`
                                                },
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        children: reaction.emoji
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/chat/page.tsx",
                                                        lineNumber: 372,
                                                        columnNumber: 23
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "font-semibold text-[#6f787d]",
                                                        children: reaction.count
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/chat/page.tsx",
                                                        lineNumber: 373,
                                                        columnNumber: 23
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/app/chat/page.tsx",
                                                lineNumber: 364,
                                                columnNumber: 21
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1.5 bg-gray-800 text-white text-xs rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-150 whitespace-nowrap z-50 pointer-events-none shadow-lg min-w-max",
                                                children: [
                                                    reactedNames,
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-800"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/chat/page.tsx",
                                                        lineNumber: 378,
                                                        columnNumber: 23
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/app/chat/page.tsx",
                                                lineNumber: 376,
                                                columnNumber: 21
                                            }, this)
                                        ]
                                    }, reaction.emoji, true, {
                                        fileName: "[project]/src/app/chat/page.tsx",
                                        lineNumber: 363,
                                        columnNumber: 19
                                    }, this);
                                })
                            }, void 0, false, {
                                fileName: "[project]/src/app/chat/page.tsx",
                                lineNumber: 353,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/chat/page.tsx",
                        lineNumber: 274,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/app/chat/page.tsx",
                lineNumber: 177,
                columnNumber: 7
            }, this),
            showDeleteDialog && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm",
                onClick: ()=>setShowDeleteDialog(false),
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "bg-white rounded-2xl p-6 max-w-sm w-full shadow-xl",
                    onClick: (e)=>e.stopPropagation(),
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                            className: "text-lg font-bold mb-2 text-[#002020]",
                            children: "Delete Message"
                        }, void 0, false, {
                            fileName: "[project]/src/app/chat/page.tsx",
                            lineNumber: 392,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "text-sm mb-4 text-[#6f787d]",
                            children: "How would you like to delete this message?"
                        }, void 0, false, {
                            fileName: "[project]/src/app/chat/page.tsx",
                            lineNumber: 393,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "space-y-2",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    onClick: ()=>{
                                        onDelete?.(msg.message_id, false);
                                        setShowDeleteDialog(false);
                                    },
                                    className: "w-full px-4 py-3 rounded-xl bg-gray-100 text-left hover:bg-gray-200 transition-colors",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "font-semibold text-sm text-[#002020]",
                                            children: "Delete for me"
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/chat/page.tsx",
                                            lineNumber: 399,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "text-xs text-[#6f787d] mt-0.5",
                                            children: "Only you won't see this message"
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/chat/page.tsx",
                                            lineNumber: 400,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/app/chat/page.tsx",
                                    lineNumber: 395,
                                    columnNumber: 15
                                }, this),
                                canDeleteForEveryone && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    onClick: ()=>{
                                        onDelete?.(msg.message_id, true);
                                        setShowDeleteDialog(false);
                                    },
                                    className: "w-full px-4 py-3 rounded-xl bg-red-50 text-left hover:bg-red-100 transition-colors",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "font-semibold text-sm text-red-600",
                                            children: "Delete for everyone"
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/chat/page.tsx",
                                            lineNumber: 407,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "text-xs text-[#6f787d] mt-0.5",
                                            children: "Removes for all participants (within 48 hrs)"
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/chat/page.tsx",
                                            lineNumber: 408,
                                            columnNumber: 19
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/app/chat/page.tsx",
                                    lineNumber: 403,
                                    columnNumber: 17
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/app/chat/page.tsx",
                            lineNumber: 394,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            onClick: ()=>setShowDeleteDialog(false),
                            className: "w-full mt-4 px-4 py-2.5 rounded-xl bg-gray-100 text-sm font-semibold text-[#6f787d] hover:bg-gray-200 transition-colors",
                            children: "Cancel"
                        }, void 0, false, {
                            fileName: "[project]/src/app/chat/page.tsx",
                            lineNumber: 412,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/app/chat/page.tsx",
                    lineNumber: 391,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/app/chat/page.tsx",
                lineNumber: 390,
                columnNumber: 9
            }, this)
        ]
    }, void 0, true);
}
function ChatPage() {
    // Typing indicator state
    const [isOtherTyping, setIsOtherTyping] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const typingTimeoutRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRouter"])();
    const [conversations, setConversations] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])([]);
    const [chatRequests, setChatRequests] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])([]);
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(true);
    const [searchQuery, setSearchQuery] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])('');
    const [selectedConversation, setSelectedConversation] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const [activeTab, setActiveTab] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])('conversations');
    const [messages, setMessages] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])([]);
    const [showMessageSearch, setShowMessageSearch] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [messageSearchQuery, setMessageSearchQuery] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])('');
    const [messageSearchResults, setMessageSearchResults] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])([]);
    const [, setMessageSearching] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const messageSearchInputRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    const [showMenu, setShowMenu] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [showBlockConfirm, setShowBlockConfirm] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [blocking, setBlocking] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [showReportDialog, setShowReportDialog] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [reporting, setReporting] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [reportType, setReportType] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])("spam");
    const [decryptedPreviews, setDecryptedPreviews] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])({});
    const [reportDescription, setReportDescription] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])('');
    const [messageInput, setMessageInput] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])('');
    const [loadingMessages, setLoadingMessages] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [isAnonymous, setIsAnonymous] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [isBlocked] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [sending, setSending] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [showMobileChat, setShowMobileChat] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [replyingTo, setReplyingTo] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const messageInputRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    const [showEmojiPickerInput, setShowEmojiPickerInput] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const emojiPickerInputRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    const fileInputRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    const [selectedImage, setSelectedImage] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
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
    const [isDarkMode, setIsDarkMode] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(()=>{
        if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
        ;
        return false;
    });
    const [sessionKey, setSessionKey] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const [keyId, setKeyId] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const [isE2EEReady, setIsE2EEReady] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [userPrivateKey, setUserPrivateKey] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const messagesEndRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    const { getSocket, isConnected, joinConversation, leaveConversation } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$contexts$2f$SocketContext$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useSocket"])();
    const socket = getSocket();
    // Join and leave the active conversation room for real-time events.
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if (!isConnected || !selectedConversation) return;
        const conversationId = selectedConversation.conversation_id;
        joinConversation(conversationId);
        return ()=>{
            leaveConversation(conversationId);
        };
    }, [
        isConnected,
        selectedConversation,
        joinConversation,
        leaveConversation
    ]);
    const conversationsRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])([]);
    const pendingRealtimeUpdatesRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(new Map());
    const flushTimerRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    const flushDelayRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(80);
    const filteredConversations = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"])(()=>{
        if (!searchQuery.trim()) return conversations;
        const query = searchQuery.toLowerCase();
        return conversations.filter((conv)=>conv.other_user_name.toLowerCase().includes(query));
    }, [
        conversations,
        searchQuery
    ]);
    const otherUserIds = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"])(()=>conversations.filter((c)=>!c.is_anonymous && c.other_user_id).map((c)=>c.other_user_id), [
        conversations
    ]);
    const onlineUsers = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$hooks$2f$usePresence$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["usePresence"])(otherUserIds);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        conversationsRef.current = conversations;
    }, [
        conversations
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if (!showEmojiPickerInput) return;
        const handleClickOutside = (e)=>{
            if (emojiPickerInputRef.current && !emojiPickerInputRef.current.contains(e.target)) {
                setShowEmojiPickerInput(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return ()=>document.removeEventListener('mousedown', handleClickOutside);
    }, [
        showEmojiPickerInput
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if (showMessageSearch) {
            setTimeout(()=>messageSearchInputRef.current?.focus(), 50);
        }
    }, [
        showMessageSearch
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        const q = messageSearchQuery.trim();
        if (!q) {
            setMessageSearchResults([]);
            setMessageSearching(false);
            return;
        }
        const timer = setTimeout(()=>{
            setMessageSearching(true);
            try {
                const lowered = q.toLowerCase();
                const filtered = messages.filter((m)=>{
                    const body = (m.encrypted_content || '').toLowerCase();
                    const senderName = (m.sender?.name || m.sender_name || '').toLowerCase();
                    return body.includes(lowered) || senderName.includes(lowered);
                });
                setMessageSearchResults(filtered);
            } catch (err) {
                console.error('[SEARCH] message search failed', err);
            } finally{
                setMessageSearching(false);
            }
        }, 280);
        return ()=>clearTimeout(timer);
    }, [
        messageSearchQuery,
        messages
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        messagesEndRef.current?.scrollIntoView({
            behavior: 'smooth'
        });
    }, [
        messages
    ]);
    const navigateToProfileByUserId = async (userId)=>{
        if (!userId) return;
        try {
            const { API_BASE_URL } = await __turbopack_context__.A("[project]/src/services/apiBase.ts [app-ssr] (ecmascript, async loader)");
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
        } catch (err) {
            console.error('Failed to navigate to profile by user id', err);
        }
    };
    const fetchAndDecryptConversationKey = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(async (msgs, conversationId)=>{
        try {
            const storedUser = localStorage.getItem('user');
            const decryptedPrivateKeyB64 = sessionStorage.getItem('decryptedPrivateKey');
            if (!decryptedPrivateKeyB64 || !storedUser) {
                console.warn('[E2EE] Private key missing from session storage');
                return null;
            }
            let privKey = userPrivateKey;
            if (!privKey && decryptedPrivateKeyB64) {
                privKey = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$e2ee$2e$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["importPrivateKey"])(decryptedPrivateKeyB64);
                setUserPrivateKey(privKey);
            }
            if (!privKey) return null;
            const msgWithKey = msgs.find((m)=>m.user_session_key && m.key_id);
            if (msgWithKey && msgWithKey.user_session_key && msgWithKey.key_id) {
                try {
                    const aesKeyB64 = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$e2ee$2e$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["decryptKeyWithPrivateKey"])(privKey, msgWithKey.user_session_key);
                    const aesKey = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$e2ee$2e$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["importKeyFromBase64"])(aesKeyB64);
                    setSessionKey(aesKey);
                    setKeyId(msgWithKey.key_id);
                    setIsE2EEReady(true);
                    return aesKey;
                } catch (err) {
                    console.error('[E2EE] Failed to decrypt session key:', err);
                }
            }
            // If no key found, try to initialize a new one
            const info = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$chat$2e$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["chatService"].getParticipantPublicKeys(conversationId);
            const participants = info.participants;
            const newAesKey = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$e2ee$2e$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["generateAESKey"])();
            const aesKeyB64 = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$e2ee$2e$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["exportKeyToBase64"])(newAesKey);
            const encryptedKeys = await Promise.all(participants.map(async (p)=>{
                const encrypted = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$e2ee$2e$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["encryptKeyWithPublicKey"])(aesKeyB64, p.public_key);
                return {
                    userId: p.user_id,
                    encryptedKey: encrypted,
                    keyVersion: 1
                };
            }));
            const { keyId: newKeyId } = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$chat$2e$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["chatService"].storeSessionKeys({
                conversationId,
                keys: encryptedKeys
            });
            setSessionKey(newAesKey);
            setKeyId(newKeyId);
            setIsE2EEReady(true);
            return newAesKey;
        } catch (error) {
            console.error('[E2EE] Session initialization failed:', error);
        }
    }, [
        userPrivateKey
    ]);
    const decryptMessages = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(async (msgs, aesKey)=>{
        return await Promise.all(msgs.map(async (m)=>{
            const decryptedMsg = {
                ...m
            };
            // Decrypt main message content
            if (m.encrypted_content && m.content_iv && m.content_auth_tag) {
                try {
                    const decrypted = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$e2ee$2e$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["decryptMessageAES"])(m.encrypted_content, m.content_iv, m.content_auth_tag, aesKey);
                    decryptedMsg.encrypted_content = decrypted;
                } catch (err) {
                    console.warn(`[E2EE] Failed to decrypt message ${m.message_id}:`, err);
                    decryptedMsg.encrypted_content = '[Encrypted Message]';
                }
            }
            // Decrypt parent_message content if present
            if (m.parent_message && m.parent_message.encrypted_content && m.parent_message.content_iv && m.parent_message.content_auth_tag) {
                try {
                    const decryptedParent = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$e2ee$2e$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["decryptMessageAES"])(m.parent_message.encrypted_content, m.parent_message.content_iv, m.parent_message.content_auth_tag, aesKey);
                    decryptedMsg.parent_message = {
                        ...m.parent_message,
                        encrypted_content: decryptedParent
                    };
                } catch (err) {
                    console.warn(`[E2EE] Failed to decrypt parent message ${m.parent_message.message_id}:`, err);
                    decryptedMsg.parent_message = {
                        ...m.parent_message,
                        encrypted_content: '[Encrypted Message]'
                    };
                }
            }
            return decryptedMsg;
        }));
    }, []);
    // Real-time message + typing listeners for the selected conversation.
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if (!isConnected || !socket || !selectedConversation) return;
        const activeConversationId = selectedConversation.conversation_id;
        const userStr = ("TURBOPACK compile-time falsy", 0) ? "TURBOPACK unreachable" : null;
        const currentUserId = ("TURBOPACK compile-time falsy", 0) ? "TURBOPACK unreachable" : null;
        const handleNewMessage = async (incomingMessage)=>{
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
                    const decrypted = decryptedArray[0];
                    if (decrypted) {
                        processedMessage = decrypted;
                    }
                } catch (err) {
                    console.warn('[Socket] Failed to decrypt realtime message:', err);
                }
            }
            setMessages((prev)=>{
                // Check if message already exists
                const existingIndex = prev.findIndex((msg)=>msg.message_id === processedMessage.message_id);
                if (existingIndex !== -1) {
                    // Update existing message
                    const next = [
                        ...prev
                    ];
                    next[existingIndex] = processedMessage;
                    return next;
                }
                // If this is my message, remove any optimistic temp messages first
                let filtered = prev;
                if (processedMessage.is_my_message) {
                    filtered = prev.filter((msg)=>!msg.message_id?.startsWith('temp-'));
                }
                // Add the new message
                return [
                    ...filtered,
                    processedMessage
                ];
            });
        };
        const handleTyping = (data)=>{
            if (data.chatId !== activeConversationId || data.userId === currentUserId) return;
            if (data.isTyping) {
                setIsOtherTyping(true);
                if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
                typingTimeoutRef.current = setTimeout(()=>setIsOtherTyping(false), 2000);
            } else {
                setIsOtherTyping(false);
            }
        };
        socket.on('new-message', handleNewMessage);
        socket.on('user-typing', handleTyping);
        return ()=>{
            socket.off('new-message', handleNewMessage);
            socket.off('user-typing', handleTyping);
            if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
        };
    }, [
        isConnected,
        socket,
        selectedConversation,
        sessionKey,
        decryptMessages
    ]);
    const loadMessages = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(async (conversation)=>{
        if (!conversation) return;
        setLoadingMessages(true);
        try {
            let response;
            let conversationType = 'regular';
            try {
                const info = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$chat$2e$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["chatService"].getParticipantPublicKeys(conversation.conversation_id);
                conversationType = info.isAnonymous ? 'anonymous' : 'regular';
                if (conversationType === 'anonymous') {
                    response = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$anonymous$2d$chat$2e$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].getAnonymousMessages(conversation.conversation_id);
                } else {
                    response = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$chat$2e$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["chatService"].getMessages(conversation.conversation_id);
                }
            } catch (fetchError) {
                console.error('[ERROR] Initial fetch failed:', fetchError);
                throw fetchError;
            }
            let fetchedMessages = Array.isArray(response) ? response : response.messages || response.data || [];
            setIsAnonymous(conversationType === 'anonymous');
            // Initialize E2EE and decrypt messages
            const aesKey = await fetchAndDecryptConversationKey(fetchedMessages, conversation.conversation_id);
            if (aesKey) {
                fetchedMessages = await decryptMessages(fetchedMessages, aesKey);
            }
            // Update decrypted preview for conversation list (use most recent message)
            if (fetchedMessages.length > 0) {
                const lastMsg = fetchedMessages[fetchedMessages.length - 1];
                const previewText = lastMsg.message_type === 'image' ? '📷 Image' : lastMsg.encrypted_content || '';
                setDecryptedPreviews((prev)=>({
                        ...prev,
                        [conversation.conversation_id]: previewText
                    }));
            }
            setMessages(fetchedMessages);
        } catch (error) {
            console.error('Failed to load messages:', error);
            setMessages([]);
        } finally{
            setLoadingMessages(false);
        }
    }, [
        fetchAndDecryptConversationKey,
        decryptMessages
    ]);
    const handleSelectConversation = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])((conversation)=>{
        setSelectedConversation(conversation);
        setShowMobileChat(true);
        setConversations((prev)=>prev.map((conv)=>conv.conversation_id === conversation.conversation_id ? {
                    ...conv,
                    unread_count: 0
                } : conv));
        loadMessages(conversation);
    }, [
        loadMessages
    ]);
    const fetchConversations = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(async ()=>{
        try {
            const [regularData, anonymousData] = await Promise.all([
                __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$chat$2e$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["chatService"].getConversations(),
                __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$anonymous$2d$chat$2e$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].getAnonymousConversations()
            ]);
            const combined = [
                ...regularData,
                ...anonymousData
            ].sort((a, b)=>{
                const dateA = new Date(a.last_message_at || a.created_at).getTime();
                const dateB = new Date(b.last_message_at || b.created_at).getTime();
                return dateB - dateA;
            });
            setConversations(combined);
        } catch (error) {
            console.error('Failed to fetch conversations:', error);
        } finally{
            setLoading(false);
        }
    }, []);
    const handleSendMessage = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(async ()=>{
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
                    const uploadResult = isAnonymous ? await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$anonymous$2d$chat$2e$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].uploadAnonymousImage(selectedImage) : await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$chat$2e$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["chatService"].uploadImage(selectedImage);
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
                    const { ciphertext, iv, authTag } = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$e2ee$2e$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["encryptMessageAES"])(finalContent, sessionKey);
                    finalContent = ciphertext;
                    contentIv = iv;
                    contentAuthTag = authTag;
                } catch (err) {
                    console.error('[E2EE] Encryption failed:', err);
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
                await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$anonymous$2d$chat$2e$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].sendAnonymousMessage(messageData);
            } else {
                await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$chat$2e$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["chatService"].sendMessage(messageData);
            }
            setMessageInput('');
            setSelectedImage(null);
            setReplyingTo(null);
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
            // OPTIMISTIC UI: Add message immediately to UI without waiting for server
            // Use the original content (not encrypted) for display
            const tempId = `temp-${Date.now()}`;
            const optimisticMessage = {
                message_id: tempId,
                conversation_id: selectedConversation.conversation_id,
                sender_id: 'me',
                sender_name: 'You',
                sender_gender: '',
                encrypted_content: content,
                content_iv: '',
                content_auth_tag: '',
                message_type: selectedImage ? 'image' : 'text',
                created_at: new Date(),
                updated_at: new Date(),
                is_anonymous: isAnonymous,
                is_my_message: true,
                is_edited: false,
                is_deleted: false,
                parent_message: replyingTo ? {
                    message_id: replyingTo.message_id,
                    encrypted_content: replyingTo.encrypted_content,
                    content_iv: replyingTo.content_iv || '',
                    content_auth_tag: replyingTo.content_auth_tag || '',
                    sender: replyingTo.sender
                } : undefined
            };
            // Add to UI immediately
            setMessages((prev)=>[
                    ...prev,
                    optimisticMessage
                ]);
            // Scroll to bottom immediately
            setTimeout(()=>{
                messagesEndRef.current?.scrollIntoView({
                    behavior: 'smooth'
                });
            }, 50);
            // Refresh conversations list in background (don't block)
            fetchConversations().catch(()=>{});
        // Note: We don't call loadMessages() - Socket.IO will add the real message
        // and replace the optimistic one when it arrives
        } catch (error) {
            console.error('Failed to send message:', error);
        } finally{
            setSending(false);
        }
    }, [
        messageInput,
        selectedImage,
        selectedConversation,
        sending,
        isBlocked,
        isE2EEReady,
        sessionKey,
        keyId,
        isAnonymous,
        fetchConversations,
        replyingTo
    ]);
    const fetchChatRequests = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(async ()=>{
        try {
            const data = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$chat$2e$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["chatService"].getChatRequests();
            setChatRequests(data);
        } catch (error) {
            console.error('Failed to fetch chat requests:', error);
        }
    }, []);
    const handleAcceptRequest = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(async (requestId)=>{
        try {
            await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$chat$2e$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["chatService"].respondToChatRequest(requestId, 'accept');
            fetchChatRequests();
            fetchConversations();
        } catch (error) {
            console.error('Failed to accept request:', error);
        }
    }, [
        fetchChatRequests,
        fetchConversations
    ]);
    const handleRejectRequest = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(async (requestId)=>{
        try {
            await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$chat$2e$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["chatService"].respondToChatRequest(requestId, 'reject');
            fetchChatRequests();
        } catch (error) {
            console.error('Failed to reject request:', error);
        }
    }, [
        fetchChatRequests
    ]);
    const handleReply = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])((msg)=>{
        setReplyingTo(msg);
        // Focus the input after a small delay to ensure render
        setTimeout(()=>messageInputRef.current?.focus(), 50);
    }, []);
    const handleReact = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(async (messageId, emoji)=>{
        try {
            await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$message$2d$management$2e$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["messageManagementService"].addReaction(messageId, emoji, '');
            // Refresh messages to show updated reactions
            if (selectedConversation) {
                loadMessages(selectedConversation);
            }
        } catch (error) {
            console.error('Failed to add reaction:', error);
        }
    }, [
        selectedConversation,
        loadMessages
    ]);
    const handleEdit = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(async (messageId, newContent)=>{
        try {
            let finalContent = newContent;
            let contentIv = 'dummy_iv';
            let contentAuthTag = 'dummy_tag';
            // E2EE: Encrypt edited content
            if (isE2EEReady && sessionKey) {
                try {
                    const { ciphertext, iv, authTag } = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$e2ee$2e$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["encryptMessageAES"])(newContent, sessionKey);
                    finalContent = ciphertext;
                    contentIv = iv;
                    contentAuthTag = authTag;
                } catch (err) {
                    console.error('[E2EE] Edit encryption failed:', err);
                    return;
                }
            }
            await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$message$2d$management$2e$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["messageManagementService"].editMessage(messageId, finalContent, contentIv, contentAuthTag, '');
            // Refresh messages to show updated content
            if (selectedConversation) {
                loadMessages(selectedConversation);
            }
        } catch (error) {
            console.error('Failed to edit message:', error);
        }
    }, [
        isE2EEReady,
        sessionKey,
        selectedConversation,
        loadMessages
    ]);
    const handleDelete = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(async (messageId, deleteForEveryone)=>{
        try {
            await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$chat$2e$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["chatService"].deleteMessage(messageId, deleteForEveryone ? 'everyone' : 'me');
            // Remove from local state immediately for better UX
            setMessages((prev)=>prev.filter((m)=>m.message_id !== messageId));
        } catch (error) {
            console.error('Failed to delete message:', error);
        }
    }, []);
    const handleBlockSelectedUser = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(async ()=>{
        if (!selectedConversation || !selectedConversation.conversation_id) return;
        setShowBlockConfirm(false);
        setBlocking(true);
        try {
            await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$chat$2e$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["chatService"].blockUser(selectedConversation.conversation_id);
            // refresh conversations to reflect blocked state
            void fetchConversations();
            alert('User blocked successfully');
        } catch (err) {
            console.error('Failed to block user', err);
            alert('Failed to block user');
        } finally{
            setBlocking(false);
        }
    }, [
        selectedConversation,
        fetchConversations
    ]);
    const handleSubmitReport = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(async ()=>{
        if (!selectedConversation || !selectedConversation.other_user_id) return;
        if (!reportDescription.trim()) {
            alert('Please provide a description for the report.');
            return;
        }
        setReporting(true);
        try {
            await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$chat$2e$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["chatService"].reportUser({
                reportedUserId: selectedConversation.other_user_id,
                conversationId: selectedConversation.conversation_id,
                reportType: reportType,
                description: reportDescription,
                evidenceUrls: []
            });
            setShowReportDialog(false);
            setReportDescription('');
            alert('Report submitted. Our team will review it.');
        } catch (err) {
            console.error('Failed to submit report', err);
            alert('Failed to submit report');
        } finally{
            setReporting(false);
        }
    }, [
        selectedConversation,
        reportDescription,
        reportType
    ]);
    const handleMessageReaction = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])((data)=>{
        // Refresh messages to show updated reactions
        if (selectedConversation) {
            loadMessages(selectedConversation);
        }
        console.log('[Socket] Message reaction received:', data);
    }, [
        selectedConversation,
        loadMessages
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        fetchConversations();
        fetchChatRequests();
    }, [
        fetchConversations,
        fetchChatRequests
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if (!isConnected) return;
        const socket = getSocket();
        if (!socket) return;
        const pendingMap = pendingRealtimeUpdatesRef.current;
        const flushRealtimeConversationUpdates = ()=>{
            const updates = Array.from(pendingMap.entries());
            if (updates.length === 0) return;
            const next = [
                ...conversationsRef.current
            ];
            let changed = false;
            let missingConversation = false;
            for (const [conversationId, update] of updates){
                const index = next.findIndex((c)=>c.conversation_id === conversationId);
                if (index === -1) {
                    missingConversation = true;
                    continue;
                }
                changed = true;
                const target = next[index];
                const updatedConversation = {
                    ...target,
                    unread_count: (target.unread_count || 0) + update.incrementBy,
                    last_message_time: update.timestamp ? new Date(update.timestamp) : target.last_message_time
                };
                next.splice(index, 1);
                next.unshift(updatedConversation);
            }
            pendingMap.clear();
            if (changed) {
                conversationsRef.current = next;
                setConversations(next);
            }
            if (missingConversation) {
                void fetchConversations();
            }
        };
        const scheduleRealtimeFlush = ()=>{
            const pendingCount = pendingMap.size;
            const targetDelay = pendingCount > 6 ? 150 : 80;
            if (flushTimerRef.current !== null) {
                if (targetDelay === flushDelayRef.current) return;
                window.clearTimeout(flushTimerRef.current);
                flushTimerRef.current = null;
            }
            flushDelayRef.current = targetDelay;
            flushTimerRef.current = window.setTimeout(()=>{
                flushTimerRef.current = null;
                flushRealtimeConversationUpdates();
            }, targetDelay);
        };
        const handleNewNotification = (payload)=>{
            const notification = payload.notification;
            if (!notification || notification.type !== 'new_message') return;
            const conversationId = notification.conversationId || notification.conversation_id || notification.chatId || notification.chat_id;
            if (!conversationId) return;
            const existing = pendingMap.get(conversationId) || {
                incrementBy: 0
            };
            const nextTimestamp = typeof notification.timestamp === 'number' ? Math.max(existing.timestamp || 0, notification.timestamp) : existing.timestamp;
            pendingMap.set(conversationId, {
                incrementBy: existing.incrementBy + 1,
                timestamp: nextTimestamp
            });
            scheduleRealtimeFlush();
        };
        socket.on('new-notification', handleNewNotification);
        socket.on('message:reaction', handleMessageReaction);
        return ()=>{
            if (flushTimerRef.current !== null) {
                window.clearTimeout(flushTimerRef.current);
                flushTimerRef.current = null;
            }
            pendingMap.clear();
            socket.off('new-notification', handleNewNotification);
            socket.off('message:reaction', handleMessageReaction);
        };
    }, [
        isConnected,
        getSocket,
        fetchConversations,
        handleMessageReaction
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        localStorage.setItem('chat-theme', isDarkMode ? 'dark' : 'light');
    }, [
        isDarkMode
    ]);
    const toggleTheme = ()=>{
        setIsDarkMode((prev)=>!prev);
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
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: `min-h-screen bg-[#e2fffe] font-sans text-[#002020] ${isDarkMode ? 'dark' : ''}`,
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "dark:bg-[#002020] dark:text-[#e7fffe] min-h-screen",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "fixed inset-0 bg-[#002020]/20 dark:bg-black/40 backdrop-blur-md z-40 flex items-center justify-center p-4",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "w-full h-full md:w-[95%] md:h-[95%] bg-white/80 dark:bg-[#003535]/80 backdrop-blur-2xl rounded-2xl shadow-[0_20px_40px_rgba(0,32,32,0.06)] dark:shadow-[0_20px_40px_rgba(0,0,0,0.3)] relative overflow-hidden flex flex-col md:flex-row border border-white/50 dark:border-[#004a4a]/50",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("aside", {
                                className: "w-full md:w-[35%] bg-[#d7fafa]/50 dark:bg-[#003535]/50 flex flex-col border-r border-white/30 dark:border-[#004a4a]/30 relative h-full overflow-hidden",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "p-6",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "flex items-center justify-between mb-6",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                                                        className: "text-2xl font-extrabold tracking-tight text-[#0c6780] dark:text-[#87ceeb] font-['Plus_Jakarta_Sans']",
                                                        children: "Messages"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/chat/page.tsx",
                                                        lineNumber: 1258,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "flex items-center gap-2",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "w-10 h-10 rounded-full bg-[#87ceeb]/20 dark:bg-[#0c6780]/20 animate-pulse"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/app/chat/page.tsx",
                                                                lineNumber: 1260,
                                                                columnNumber: 23
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "w-10 h-10 rounded-full bg-[#87ceeb]/20 dark:bg-[#0c6780]/20 animate-pulse"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/app/chat/page.tsx",
                                                                lineNumber: 1261,
                                                                columnNumber: 23
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/app/chat/page.tsx",
                                                        lineNumber: 1259,
                                                        columnNumber: 21
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/app/chat/page.tsx",
                                                lineNumber: 1257,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "relative",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "w-full bg-white dark:bg-[#004040] rounded-full py-2.5 pl-10 pr-4 h-10 animate-pulse"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/chat/page.tsx",
                                                    lineNumber: 1266,
                                                    columnNumber: 21
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/chat/page.tsx",
                                                lineNumber: 1265,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/app/chat/page.tsx",
                                        lineNumber: 1256,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "px-6 pb-2 flex gap-2",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "h-9 w-28 bg-[#87ceeb]/30 dark:bg-[#0c6780]/30 rounded-full animate-pulse"
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/chat/page.tsx",
                                                lineNumber: 1272,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "h-9 w-28 bg-[#87ceeb]/20 dark:bg-[#0c6780]/20 rounded-full animate-pulse"
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/chat/page.tsx",
                                                lineNumber: 1273,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/app/chat/page.tsx",
                                        lineNumber: 1271,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex-1 overflow-y-auto px-4 space-y-1 scrollbar-visible",
                                        children: Array.from({
                                            length: 8
                                        }).map((_, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "flex items-center gap-3 p-3 rounded-xl animate-pulse",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "w-12 h-12 rounded-full bg-[#87ceeb]/20 dark:bg-[#0c6780]/20"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/chat/page.tsx",
                                                        lineNumber: 1280,
                                                        columnNumber: 23
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "flex-1 min-w-0 space-y-2",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "flex items-center justify-between",
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                        className: "h-3.5 w-3/4 bg-[#87ceeb]/20 dark:bg-[#0c6780]/20 rounded"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/app/chat/page.tsx",
                                                                        lineNumber: 1283,
                                                                        columnNumber: 27
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                        className: "h-2.5 w-8 bg-[#87ceeb]/20 dark:bg-[#0c6780]/20 rounded"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/app/chat/page.tsx",
                                                                        lineNumber: 1284,
                                                                        columnNumber: 27
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/src/app/chat/page.tsx",
                                                                lineNumber: 1282,
                                                                columnNumber: 25
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "h-3 w-1/2 bg-[#87ceeb]/20 dark:bg-[#0c6780]/20 rounded"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/app/chat/page.tsx",
                                                                lineNumber: 1286,
                                                                columnNumber: 25
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/app/chat/page.tsx",
                                                        lineNumber: 1281,
                                                        columnNumber: 23
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "w-5 h-5 rounded-full bg-[#f9b1bc]/50 animate-pulse"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/chat/page.tsx",
                                                        lineNumber: 1288,
                                                        columnNumber: 23
                                                    }, this)
                                                ]
                                            }, i, true, {
                                                fileName: "[project]/src/app/chat/page.tsx",
                                                lineNumber: 1279,
                                                columnNumber: 21
                                            }, this))
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/chat/page.tsx",
                                        lineNumber: 1277,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/chat/page.tsx",
                                lineNumber: 1254,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("main", {
                                className: `flex-1 flex-col bg-white/50 dark:bg-[#003535]/30 h-full overflow-hidden ${showMobileChat ? 'flex' : 'hidden md:flex'}`,
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "px-4 md:px-6 py-4 bg-white/30 dark:bg-[#003535]/30 backdrop-blur-md border-b border-white/30 dark:border-[#004a4a]/30 flex items-center justify-between shrink-0 sticky top-0 z-20",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "flex items-center gap-3",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "w-10 h-10 rounded-full bg-[#87ceeb]/20 dark:bg-[#0c6780]/20 animate-pulse"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/chat/page.tsx",
                                                        lineNumber: 1299,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "space-y-1",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "h-4 w-32 bg-[#87ceeb]/20 dark:bg-[#0c6780]/20 rounded animate-pulse"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/app/chat/page.tsx",
                                                                lineNumber: 1301,
                                                                columnNumber: 23
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "h-3 w-20 bg-[#22C55E]/30 rounded animate-pulse"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/app/chat/page.tsx",
                                                                lineNumber: 1302,
                                                                columnNumber: 23
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/app/chat/page.tsx",
                                                        lineNumber: 1300,
                                                        columnNumber: 21
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/app/chat/page.tsx",
                                                lineNumber: 1298,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "flex items-center gap-2",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "w-9 h-9 rounded-full bg-[#87ceeb]/20 dark:bg-[#0c6780]/20 animate-pulse"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/chat/page.tsx",
                                                        lineNumber: 1306,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "w-9 h-9 rounded-full bg-[#87ceeb]/20 dark:bg-[#0c6780]/20 animate-pulse"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/chat/page.tsx",
                                                        lineNumber: 1307,
                                                        columnNumber: 21
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/app/chat/page.tsx",
                                                lineNumber: 1305,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/app/chat/page.tsx",
                                        lineNumber: 1297,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
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
                                        ].map((item, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: `flex ${item.isMyMessage ? 'justify-end' : 'justify-start'} animate-pulse`,
                                                children: [
                                                    !item.isMyMessage && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "w-8 h-8 rounded-full bg-[#87ceeb]/20 dark:bg-[#0c6780]/20 mr-2 self-end"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/chat/page.tsx",
                                                        lineNumber: 1322,
                                                        columnNumber: 45
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: `${item.width} h-16 bg-[#87ceeb]/20 dark:bg-[#0c6780]/20 rounded-2xl ${item.isMyMessage ? 'rounded-br-sm' : 'rounded-bl-sm'}`
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/chat/page.tsx",
                                                        lineNumber: 1323,
                                                        columnNumber: 23
                                                    }, this)
                                                ]
                                            }, i, true, {
                                                fileName: "[project]/src/app/chat/page.tsx",
                                                lineNumber: 1321,
                                                columnNumber: 21
                                            }, this))
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/chat/page.tsx",
                                        lineNumber: 1312,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "px-4 py-3 bg-white/50 dark:bg-[#003535]/50 backdrop-blur-md border-t border-white/30 dark:border-[#004a4a]/30 shrink-0",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "flex items-center gap-3",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "w-10 h-10 rounded-full bg-[#87ceeb]/20 dark:bg-[#0c6780]/20 animate-pulse"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/chat/page.tsx",
                                                    lineNumber: 1331,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "flex-1 h-11 bg-[#87ceeb]/20 dark:bg-[#0c6780]/20 rounded-full animate-pulse"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/chat/page.tsx",
                                                    lineNumber: 1332,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "w-10 h-10 rounded-full bg-[#87ceeb]/20 dark:bg-[#0c6780]/20 animate-pulse"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/chat/page.tsx",
                                                    lineNumber: 1333,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "w-11 h-11 rounded-full bg-[#87ceeb]/30 dark:bg-[#0c6780]/30 animate-pulse"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/chat/page.tsx",
                                                    lineNumber: 1334,
                                                    columnNumber: 21
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/app/chat/page.tsx",
                                            lineNumber: 1330,
                                            columnNumber: 19
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/chat/page.tsx",
                                        lineNumber: 1329,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/chat/page.tsx",
                                lineNumber: 1295,
                                columnNumber: 15
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/chat/page.tsx",
                        lineNumber: 1252,
                        columnNumber: 13
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/src/app/chat/page.tsx",
                    lineNumber: 1251,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/app/chat/page.tsx",
                lineNumber: 1250,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/src/app/chat/page.tsx",
            lineNumber: 1249,
            columnNumber: 7
        }, this);
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: `min-h-screen bg-[#e2fffe] font-sans text-[#002020] ${isDarkMode ? 'dark' : ''}`,
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "dark:bg-[#002020] dark:text-[#e7fffe] min-h-screen",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "fixed inset-0 bg-[#002020]/20 dark:bg-black/40 backdrop-blur-md z-40 flex items-center justify-center p-4",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "w-full h-full md:w-[95%] md:h-[95%] bg-white/80 dark:bg-[#003535]/80 backdrop-blur-2xl rounded-2xl shadow-[0_20px_40px_rgba(0,32,32,0.06)] dark:shadow-[0_20px_40px_rgba(0,0,0,0.3)] relative overflow-hidden flex flex-col md:flex-row border border-white/50 dark:border-[#004a4a]/50",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("aside", {
                                className: `w-full md:w-[35%] bg-[#d7fafa]/50 dark:bg-[#003535]/50 flex flex-col border-r border-white/30 dark:border-[#004a4a]/30 relative h-full overflow-hidden ${showMobileChat ? 'hidden md:flex' : 'flex'}`,
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "p-6",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "flex items-center justify-between mb-6",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                                                        className: "text-2xl font-extrabold tracking-tight text-[#0c6780] dark:text-[#87ceeb] font-['Plus_Jakarta_Sans']",
                                                        children: "Messages"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/chat/page.tsx",
                                                        lineNumber: 1357,
                                                        columnNumber: 17
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "flex items-center gap-2",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                onClick: toggleTheme,
                                                                className: "w-10 h-10 flex items-center justify-center hover:bg-[#87ceeb]/20 dark:hover:bg-[#0c6780]/30 rounded-full transition-colors group",
                                                                title: isDarkMode ? 'Switch to light mode' : 'Switch to dark mode',
                                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                    className: "material-symbols-outlined text-[#6f787d] dark:text-[#bfc8cd] group-hover:text-[#0c6780] dark:group-hover:text-[#87ceeb]",
                                                                    children: isDarkMode ? 'light_mode' : 'dark_mode'
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/app/chat/page.tsx",
                                                                    lineNumber: 1365,
                                                                    columnNumber: 21
                                                                }, this)
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/app/chat/page.tsx",
                                                                lineNumber: 1360,
                                                                columnNumber: 19
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                                                                href: "/dashboard",
                                                                className: "w-10 h-10 flex items-center justify-center hover:bg-red-100/50 dark:hover:bg-red-900/30 rounded-full transition-colors group",
                                                                title: "Close",
                                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                    className: "material-symbols-outlined text-[#6f787d] dark:text-[#bfc8cd] group-hover:text-red-600",
                                                                    children: "close"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/app/chat/page.tsx",
                                                                    lineNumber: 1375,
                                                                    columnNumber: 21
                                                                }, this)
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/app/chat/page.tsx",
                                                                lineNumber: 1370,
                                                                columnNumber: 19
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/app/chat/page.tsx",
                                                        lineNumber: 1358,
                                                        columnNumber: 17
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/app/chat/page.tsx",
                                                lineNumber: 1356,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "relative",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#6f787d] dark:text-[#bfc8cd]",
                                                        children: "search"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/chat/page.tsx",
                                                        lineNumber: 1380,
                                                        columnNumber: 17
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                        className: "w-full bg-white dark:bg-[#004040] border-none rounded-full py-2.5 pl-10 pr-4 text-sm focus:ring-2 focus:ring-[#87ceeb] dark:focus:ring-[#0c6780] outline-none dark:text-[#e7fffe] dark:placeholder-[#6f787d]",
                                                        placeholder: "Search conversations...",
                                                        type: "text",
                                                        value: searchQuery,
                                                        onChange: (e)=>setSearchQuery(e.target.value)
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/chat/page.tsx",
                                                        lineNumber: 1381,
                                                        columnNumber: 17
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/app/chat/page.tsx",
                                                lineNumber: 1379,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/app/chat/page.tsx",
                                        lineNumber: 1355,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "px-6 pb-2 flex gap-2",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                onClick: ()=>setActiveTab('conversations'),
                                                className: `px-4 py-2 rounded-full text-sm font-semibold transition-all ${activeTab === 'conversations' ? 'bg-[#87ceeb]/30 dark:bg-[#0c6780]/30 text-[#005870] dark:text-[#87ceeb]' : 'text-[#6f787d] dark:text-[#bfc8cd] hover:bg-white/50 dark:hover:bg-[#004040]/50'}`,
                                                children: [
                                                    "Chats (",
                                                    conversations.length,
                                                    ")"
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/app/chat/page.tsx",
                                                lineNumber: 1393,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                onClick: ()=>setActiveTab('requests'),
                                                className: `px-4 py-2 rounded-full text-sm font-semibold transition-all relative ${activeTab === 'requests' ? 'bg-[#87ceeb]/30 dark:bg-[#0c6780]/30 text-[#005870] dark:text-[#87ceeb]' : 'text-[#6f787d] dark:text-[#bfc8cd] hover:bg-white/50 dark:hover:bg-[#004040]/50'}`,
                                                children: [
                                                    "Requests (",
                                                    chatRequests.length,
                                                    ")",
                                                    chatRequests.length > 0 && activeTab !== 'requests' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#f9b1bc] text-white text-[10px] flex items-center justify-center font-bold",
                                                        children: chatRequests.length
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/chat/page.tsx",
                                                        lineNumber: 1413,
                                                        columnNumber: 19
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/app/chat/page.tsx",
                                                lineNumber: 1403,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/app/chat/page.tsx",
                                        lineNumber: 1392,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex-1 overflow-y-auto px-4 space-y-1 scrollbar-visible",
                                        children: [
                                            activeTab === 'conversations' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
                                                children: filteredConversations.length === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "p-8 text-center",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "w-16 h-16 rounded-full bg-[#87ceeb]/20 dark:bg-[#0c6780]/20 flex items-center justify-center mb-3 mx-auto",
                                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "material-symbols-outlined text-3xl text-[#0c6780] dark:text-[#87ceeb]",
                                                                children: "chat_bubble"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/app/chat/page.tsx",
                                                                lineNumber: 1427,
                                                                columnNumber: 25
                                                            }, this)
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/app/chat/page.tsx",
                                                            lineNumber: 1426,
                                                            columnNumber: 23
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                            className: "font-semibold text-[#002020] dark:text-[#e7fffe] mb-1",
                                                            children: "No conversations yet"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/app/chat/page.tsx",
                                                            lineNumber: 1429,
                                                            columnNumber: 23
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                            className: "text-sm text-[#6f787d] dark:text-[#bfc8cd] mb-4",
                                                            children: "Start chatting with someone!"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/app/chat/page.tsx",
                                                            lineNumber: 1430,
                                                            columnNumber: 23
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                                                            href: "/dashboard",
                                                            className: "text-sm font-semibold text-[#0c6780] dark:text-[#87ceeb] hover:underline",
                                                            children: "Find people →"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/app/chat/page.tsx",
                                                            lineNumber: 1431,
                                                            columnNumber: 23
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/app/chat/page.tsx",
                                                    lineNumber: 1425,
                                                    columnNumber: 21
                                                }, this) : filteredConversations.map((conv)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        onClick: ()=>handleSelectConversation(conv),
                                                        className: `p-4 rounded-xl flex items-center gap-4 cursor-pointer transition-all duration-300 ${selectedConversation?.conversation_id === conv.conversation_id ? 'bg-[#87ceeb]/30 dark:bg-[#0c6780]/30' : 'hover:bg-white/50 dark:hover:bg-[#004040]/50'}`,
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "relative shrink-0",
                                                                children: [
                                                                    conv.other_user_dp ? !conv.is_anonymous ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                        onClick: (e)=>{
                                                                            e.stopPropagation();
                                                                            void navigateToProfileByUserId(conv.other_user_id);
                                                                        },
                                                                        className: "w-12 h-12 rounded-full overflow-hidden",
                                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                                                                            src: conv.other_user_dp,
                                                                            alt: conv.other_user_name,
                                                                            width: 48,
                                                                            height: 48,
                                                                            className: "w-12 h-12 rounded-full object-cover"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/src/app/chat/page.tsx",
                                                                            lineNumber: 1450,
                                                                            columnNumber: 33
                                                                        }, this)
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/app/chat/page.tsx",
                                                                        lineNumber: 1449,
                                                                        columnNumber: 31
                                                                    }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                        className: "w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg bg-linear-to-br from-[#87ceeb] to-[#e6e6fa]",
                                                                        children: conv.is_anonymous ? '?' : conv.other_user_name.charAt(0).toUpperCase()
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/app/chat/page.tsx",
                                                                        lineNumber: 1459,
                                                                        columnNumber: 31
                                                                    }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                        className: "w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg bg-linear-to-br from-[#87ceeb] to-[#e6e6fa]",
                                                                        children: conv.is_anonymous ? '?' : conv.other_user_name.charAt(0).toUpperCase()
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/app/chat/page.tsx",
                                                                        lineNumber: 1464,
                                                                        columnNumber: 29
                                                                    }, this),
                                                                    !conv.is_anonymous && conv.other_user_id && onlineUsers.has(conv.other_user_id) && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                        className: "absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/app/chat/page.tsx",
                                                                        lineNumber: 1469,
                                                                        columnNumber: 29
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/src/app/chat/page.tsx",
                                                                lineNumber: 1446,
                                                                columnNumber: 25
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "flex-1 min-w-0",
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                        className: "flex justify-between items-center",
                                                                        children: [
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                className: "font-bold text-[#005870] dark:text-[#87ceeb] truncate",
                                                                                children: conv.other_user_name
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/src/app/chat/page.tsx",
                                                                                lineNumber: 1474,
                                                                                columnNumber: 29
                                                                            }, this),
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                className: "text-[10px] uppercase tracking-wider text-[#6f787d] dark:text-[#bfc8cd]",
                                                                                children: formatTime(conv.last_message_time || conv.created_at)
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/src/app/chat/page.tsx",
                                                                                lineNumber: 1475,
                                                                                columnNumber: 29
                                                                            }, this)
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/src/app/chat/page.tsx",
                                                                        lineNumber: 1473,
                                                                        columnNumber: 27
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                        className: "text-sm text-[#0c6780] dark:text-[#bfc8cd] truncate",
                                                                        children: decryptedPreviews[conv.conversation_id] ? decryptedPreviews[conv.conversation_id] : conv.last_message_preview ? conv.last_message_type === 'image' ? '📷 Image' : '🔒 Encrypted' : 'No messages yet'
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/app/chat/page.tsx",
                                                                        lineNumber: 1479,
                                                                        columnNumber: 27
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/src/app/chat/page.tsx",
                                                                lineNumber: 1472,
                                                                columnNumber: 25
                                                            }, this),
                                                            conv.unread_count > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "w-5 h-5 bg-[#f9b1bc] rounded-full flex items-center justify-center shrink-0",
                                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                    className: "text-[10px] font-bold text-white",
                                                                    children: conv.unread_count > 99 ? '99+' : conv.unread_count
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/app/chat/page.tsx",
                                                                    lineNumber: 1490,
                                                                    columnNumber: 29
                                                                }, this)
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/app/chat/page.tsx",
                                                                lineNumber: 1489,
                                                                columnNumber: 27
                                                            }, this)
                                                        ]
                                                    }, conv.conversation_id, true, {
                                                        fileName: "[project]/src/app/chat/page.tsx",
                                                        lineNumber: 1437,
                                                        columnNumber: 23
                                                    }, this))
                                            }, void 0, false),
                                            activeTab === 'requests' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
                                                children: chatRequests.length === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "p-8 text-center",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "w-16 h-16 rounded-full bg-[#87ceeb]/20 dark:bg-[#0c6780]/20 flex items-center justify-center mb-3 mx-auto",
                                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "material-symbols-outlined text-3xl text-[#0c6780] dark:text-[#87ceeb]",
                                                                children: "mail"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/app/chat/page.tsx",
                                                                lineNumber: 1504,
                                                                columnNumber: 25
                                                            }, this)
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/app/chat/page.tsx",
                                                            lineNumber: 1503,
                                                            columnNumber: 23
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                            className: "font-semibold text-[#002020] dark:text-[#e7fffe]",
                                                            children: "No pending requests"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/app/chat/page.tsx",
                                                            lineNumber: 1506,
                                                            columnNumber: 23
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                            className: "text-sm text-[#6f787d] dark:text-[#bfc8cd]",
                                                            children: "You're all caught up!"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/app/chat/page.tsx",
                                                            lineNumber: 1507,
                                                            columnNumber: 23
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/app/chat/page.tsx",
                                                    lineNumber: 1502,
                                                    columnNumber: 21
                                                }, this) : chatRequests.map((request)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "p-4 rounded-xl bg-white/50 dark:bg-[#004040]/50 flex items-center gap-4",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "shrink-0",
                                                                children: request.sender_dp_url ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                                                                    src: request.sender_dp_url,
                                                                    alt: request.sender_display_name,
                                                                    width: 48,
                                                                    height: 48,
                                                                    className: "w-12 h-12 rounded-full object-cover"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/app/chat/page.tsx",
                                                                    lineNumber: 1514,
                                                                    columnNumber: 29
                                                                }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    className: "w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg bg-linear-to-br from-[#87ceeb] to-[#e6e6fa]",
                                                                    children: request.sender_display_name.charAt(0).toUpperCase()
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/app/chat/page.tsx",
                                                                    lineNumber: 1522,
                                                                    columnNumber: 29
                                                                }, this)
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/app/chat/page.tsx",
                                                                lineNumber: 1512,
                                                                columnNumber: 25
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "flex-1 min-w-0",
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                        className: "flex items-center gap-2 mb-0.5",
                                                                        children: [
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                className: "font-semibold text-[#002020] dark:text-[#e7fffe]",
                                                                                children: request.sender_display_name
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/src/app/chat/page.tsx",
                                                                                lineNumber: 1529,
                                                                                columnNumber: 29
                                                                            }, this),
                                                                            request.request_type === 'anonymous' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                className: "text-xs px-2 py-0.5 rounded-full bg-purple-100 dark:bg-purple-900/50 text-purple-600 dark:text-purple-300",
                                                                                children: "Anon"
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/src/app/chat/page.tsx",
                                                                                lineNumber: 1531,
                                                                                columnNumber: 31
                                                                            }, this)
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/src/app/chat/page.tsx",
                                                                        lineNumber: 1528,
                                                                        columnNumber: 27
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                        className: "text-xs text-[#6f787d] dark:text-[#bfc8cd]",
                                                                        children: formatTime(request.created_at)
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/app/chat/page.tsx",
                                                                        lineNumber: 1534,
                                                                        columnNumber: 27
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/src/app/chat/page.tsx",
                                                                lineNumber: 1527,
                                                                columnNumber: 25
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "flex gap-2 shrink-0",
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                        onClick: ()=>handleAcceptRequest(request.request_id),
                                                                        className: "px-3 py-1.5 rounded-lg text-sm font-semibold text-white bg-green-500 hover:bg-green-600 transition-colors",
                                                                        children: "Accept"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/app/chat/page.tsx",
                                                                        lineNumber: 1537,
                                                                        columnNumber: 27
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                        onClick: ()=>handleRejectRequest(request.request_id),
                                                                        className: "px-3 py-1.5 rounded-lg text-sm font-semibold text-red-500 bg-red-100 dark:bg-red-900/30 hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors",
                                                                        children: "Reject"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/app/chat/page.tsx",
                                                                        lineNumber: 1543,
                                                                        columnNumber: 27
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/src/app/chat/page.tsx",
                                                                lineNumber: 1536,
                                                                columnNumber: 25
                                                            }, this)
                                                        ]
                                                    }, request.request_id, true, {
                                                        fileName: "[project]/src/app/chat/page.tsx",
                                                        lineNumber: 1511,
                                                        columnNumber: 23
                                                    }, this))
                                            }, void 0, false)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/app/chat/page.tsx",
                                        lineNumber: 1421,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/chat/page.tsx",
                                lineNumber: 1353,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("main", {
                                className: `flex-1 md:w-[65%] flex-col bg-white/40 dark:bg-[#002020]/40 h-full overflow-hidden ${showMobileChat ? 'flex' : 'hidden md:flex'}`,
                                children: selectedConversation ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("header", {
                                            className: "h-20 px-4 md:px-6 flex items-center justify-between border-b border-white/50 dark:border-[#004a4a]/50 bg-white/60 dark:bg-[#003535]/60 backdrop-blur-sm shrink-0 sticky top-0 z-20",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "flex items-center gap-3 md:gap-4",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                            onClick: ()=>setShowMobileChat(false),
                                                            className: "md:hidden p-2 -ml-2 hover:bg-white/50 dark:hover:bg-[#004040]/50 rounded-full transition-colors",
                                                            "aria-label": "Back to conversations",
                                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "material-symbols-outlined text-[#6f787d] dark:text-[#bfc8cd]",
                                                                children: "arrow_back"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/app/chat/page.tsx",
                                                                lineNumber: 1571,
                                                                columnNumber: 23
                                                            }, this)
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/app/chat/page.tsx",
                                                            lineNumber: 1566,
                                                            columnNumber: 21
                                                        }, this),
                                                        selectedConversation.other_user_dp ? !selectedConversation.is_anonymous ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                            onClick: (e)=>{
                                                                e.stopPropagation();
                                                                void navigateToProfileByUserId(selectedConversation.other_user_id);
                                                            },
                                                            className: "w-10 h-10 rounded-full overflow-hidden",
                                                            title: `View ${selectedConversation.other_user_name} profile`,
                                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                                                                src: selectedConversation.other_user_dp,
                                                                alt: selectedConversation.other_user_name,
                                                                width: 40,
                                                                height: 40,
                                                                className: "w-10 h-10 rounded-full object-cover"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/app/chat/page.tsx",
                                                                lineNumber: 1580,
                                                                columnNumber: 27
                                                            }, this)
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/app/chat/page.tsx",
                                                            lineNumber: 1575,
                                                            columnNumber: 25
                                                        }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "w-10 h-10 rounded-full flex items-center justify-center text-white font-bold bg-linear-to-br from-[#87ceeb] to-[#ffb6c1]",
                                                            children: selectedConversation.is_anonymous ? '?' : selectedConversation.other_user_name.charAt(0).toUpperCase()
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/app/chat/page.tsx",
                                                            lineNumber: 1589,
                                                            columnNumber: 25
                                                        }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "w-10 h-10 rounded-full flex items-center justify-center text-white font-bold bg-linear-to-br from-[#87ceeb] to-[#ffb6c1]",
                                                            children: selectedConversation.is_anonymous ? '?' : selectedConversation.other_user_name.charAt(0).toUpperCase()
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/app/chat/page.tsx",
                                                            lineNumber: 1594,
                                                            columnNumber: 23
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                                                    className: "font-bold text-[#002020] dark:text-[#e7fffe] leading-tight cursor-pointer",
                                                                    onClick: ()=>{
                                                                        if (!selectedConversation.is_anonymous) void navigateToProfileByUserId(selectedConversation.other_user_id);
                                                                    },
                                                                    children: selectedConversation.other_user_name
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/app/chat/page.tsx",
                                                                    lineNumber: 1599,
                                                                    columnNumber: 23
                                                                }, this),
                                                                !selectedConversation.is_anonymous && selectedConversation.other_user_id && onlineUsers.has(selectedConversation.other_user_id) && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                    className: "text-xs text-green-500 font-medium",
                                                                    children: "Online now"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/app/chat/page.tsx",
                                                                    lineNumber: 1601,
                                                                    columnNumber: 25
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/app/chat/page.tsx",
                                                            lineNumber: 1598,
                                                            columnNumber: 21
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/app/chat/page.tsx",
                                                    lineNumber: 1564,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "flex items-center gap-2 relative",
                                                    children: [
                                                        !showMessageSearch ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                    onClick: ()=>setShowMessageSearch(true),
                                                                    className: "p-2 hover:bg-white/50 dark:hover:bg-[#004040]/50 rounded-full transition-colors",
                                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                        className: "material-symbols-outlined text-[#6f787d]",
                                                                        children: "search"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/app/chat/page.tsx",
                                                                        lineNumber: 1609,
                                                                        columnNumber: 27
                                                                    }, this)
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/app/chat/page.tsx",
                                                                    lineNumber: 1608,
                                                                    columnNumber: 25
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                    onClick: ()=>setShowMenu((s)=>!s),
                                                                    className: "p-2 hover:bg-white/50 dark:hover:bg-[#004040]/50 rounded-full transition-colors",
                                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                        className: "material-symbols-outlined text-[#6f787d] dark:text-[#bfc8cd]",
                                                                        children: "more_vert"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/app/chat/page.tsx",
                                                                        lineNumber: 1612,
                                                                        columnNumber: 27
                                                                    }, this)
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/app/chat/page.tsx",
                                                                    lineNumber: 1611,
                                                                    columnNumber: 25
                                                                }, this)
                                                            ]
                                                        }, void 0, true) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "flex items-center gap-2",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                    ref: messageSearchInputRef,
                                                                    value: messageSearchQuery,
                                                                    onChange: (e)=>setMessageSearchQuery(e.target.value),
                                                                    placeholder: "Search messages...",
                                                                    className: "px-3 py-2 rounded-full border border-white/40 dark:border-[#004a4a]/40 outline-none w-56 dark:bg-[#004040] dark:text-[#e7fffe]"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/app/chat/page.tsx",
                                                                    lineNumber: 1617,
                                                                    columnNumber: 25
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                    onClick: ()=>{
                                                                        setShowMessageSearch(false);
                                                                        setMessageSearchQuery('');
                                                                    },
                                                                    className: "p-2 hover:bg-white/50 dark:hover:bg-[#004040]/50 rounded-full transition-colors",
                                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                        className: "material-symbols-outlined text-[#6f787d] dark:text-[#bfc8cd]",
                                                                        children: "close"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/app/chat/page.tsx",
                                                                        lineNumber: 1625,
                                                                        columnNumber: 27
                                                                    }, this)
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/app/chat/page.tsx",
                                                                    lineNumber: 1624,
                                                                    columnNumber: 25
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/app/chat/page.tsx",
                                                            lineNumber: 1616,
                                                            columnNumber: 23
                                                        }, this),
                                                        showMenu && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "absolute right-0 mt-12 w-44 bg-white dark:bg-[#004040] rounded-xl shadow-lg p-2 z-50 border border-white/30 dark:border-[#004a4a]/30",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                    onClick: ()=>{
                                                                        setShowMenu(false);
                                                                        if (!selectedConversation?.is_anonymous) void navigateToProfileByUserId(selectedConversation?.other_user_id);
                                                                    },
                                                                    className: "w-full text-left px-3 py-2 rounded-lg hover:bg-gray-50 dark:hover:bg-[#005555] dark:text-[#e7fffe]",
                                                                    children: "View profile"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/app/chat/page.tsx",
                                                                    lineNumber: 1633,
                                                                    columnNumber: 25
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                    onClick: ()=>{
                                                                        setShowMenu(false);
                                                                        setShowBlockConfirm(true);
                                                                    },
                                                                    className: "w-full text-left px-3 py-2 rounded-lg hover:bg-gray-50 dark:hover:bg-[#005555] dark:text-[#e7fffe]",
                                                                    children: "Block"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/app/chat/page.tsx",
                                                                    lineNumber: 1642,
                                                                    columnNumber: 25
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                    onClick: ()=>{
                                                                        setShowMenu(false);
                                                                        setShowReportDialog(true);
                                                                    },
                                                                    className: "w-full text-left px-3 py-2 rounded-lg hover:bg-gray-50 dark:hover:bg-[#005555] dark:text-[#e7fffe]",
                                                                    children: "Report"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/app/chat/page.tsx",
                                                                    lineNumber: 1643,
                                                                    columnNumber: 25
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/app/chat/page.tsx",
                                                            lineNumber: 1632,
                                                            columnNumber: 23
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/app/chat/page.tsx",
                                                    lineNumber: 1605,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/app/chat/page.tsx",
                                            lineNumber: 1563,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "flex-1 overflow-y-auto p-6 space-y-4 flex flex-col scrollbar-visible",
                                            children: [
                                                (()=>{
                                                    const shownMessages = messageSearchQuery.trim() ? messageSearchResults : messages;
                                                    if (loadingMessages) {
                                                        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "flex-1 flex items-center justify-center",
                                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "w-8 h-8 rounded-full border-2 border-[#0c6780] dark:border-[#87ceeb] border-t-transparent animate-spin"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/app/chat/page.tsx",
                                                                lineNumber: 1656,
                                                                columnNumber: 27
                                                            }, this)
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/app/chat/page.tsx",
                                                            lineNumber: 1655,
                                                            columnNumber: 25
                                                        }, this);
                                                    }
                                                    if (shownMessages.length === 0) {
                                                        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "flex-1 flex items-center justify-center",
                                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "text-center",
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                        className: "w-16 h-16 rounded-full bg-[#87ceeb]/20 dark:bg-[#0c6780]/20 flex items-center justify-center mb-3 mx-auto",
                                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                            className: "material-symbols-outlined text-3xl text-[#0c6780] dark:text-[#87ceeb]",
                                                                            children: "chat_bubble"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/src/app/chat/page.tsx",
                                                                            lineNumber: 1666,
                                                                            columnNumber: 31
                                                                        }, this)
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/app/chat/page.tsx",
                                                                        lineNumber: 1665,
                                                                        columnNumber: 29
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                        className: "font-semibold text-[#002020] dark:text-[#e7fffe] mb-1",
                                                                        children: "No messages yet"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/app/chat/page.tsx",
                                                                        lineNumber: 1668,
                                                                        columnNumber: 29
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                        className: "text-sm text-[#6f787d] dark:text-[#bfc8cd]",
                                                                        children: "Start the conversation!"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/app/chat/page.tsx",
                                                                        lineNumber: 1669,
                                                                        columnNumber: 29
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/src/app/chat/page.tsx",
                                                                lineNumber: 1664,
                                                                columnNumber: 27
                                                            }, this)
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/app/chat/page.tsx",
                                                            lineNumber: 1663,
                                                            columnNumber: 25
                                                        }, this);
                                                    }
                                                    let lastDate = '';
                                                    return shownMessages.map((msg)=>{
                                                        const msgDate = new Date(msg.created_at).toDateString();
                                                        const showDateHeader = msgDate !== lastDate;
                                                        lastDate = msgDate;
                                                        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "flex flex-col",
                                                            children: [
                                                                showDateHeader && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    className: "flex justify-center my-4",
                                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                        className: "px-4 py-1.5 rounded-full text-[11px] font-semibold bg-white/60 text-[#6f787d] shadow-sm",
                                                                        children: formatDateHeader(msg.created_at)
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/app/chat/page.tsx",
                                                                        lineNumber: 1685,
                                                                        columnNumber: 31
                                                                    }, this)
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/app/chat/page.tsx",
                                                                    lineNumber: 1684,
                                                                    columnNumber: 29
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(MessageItem, {
                                                                    msg: msg,
                                                                    onReply: handleReply,
                                                                    onEdit: handleEdit,
                                                                    onDelete: handleDelete,
                                                                    onReact: handleReact,
                                                                    formatTime: formatTimeCompact
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/app/chat/page.tsx",
                                                                    lineNumber: 1691,
                                                                    columnNumber: 27
                                                                }, this)
                                                            ]
                                                        }, msg.message_id, true, {
                                                            fileName: "[project]/src/app/chat/page.tsx",
                                                            lineNumber: 1681,
                                                            columnNumber: 25
                                                        }, this);
                                                    });
                                                })(),
                                                isOtherTyping && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "flex justify-start",
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "bg-white dark:bg-[#004040] rounded-2xl rounded-bl-sm p-3 shadow-sm",
                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(TypingIndicator, {}, void 0, false, {
                                                            fileName: "[project]/src/app/chat/page.tsx",
                                                            lineNumber: 1707,
                                                            columnNumber: 25
                                                        }, this)
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/chat/page.tsx",
                                                        lineNumber: 1706,
                                                        columnNumber: 23
                                                    }, this)
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/chat/page.tsx",
                                                    lineNumber: 1705,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    ref: messagesEndRef
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/chat/page.tsx",
                                                    lineNumber: 1711,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/app/chat/page.tsx",
                                            lineNumber: 1650,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("footer", {
                                            className: "p-0 bg-white/30 dark:bg-[#003535]/30 backdrop-blur-md border-t border-white/30 dark:border-[#004a4a]/30 shrink-0",
                                            children: [
                                                replyingTo && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "mb-3 flex items-start gap-2 p-3 rounded-xl bg-[#87ceeb]/20 dark:bg-[#0c6780]/20 border-l-[3px] border-[#0c6780] dark:border-[#87ceeb]",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "flex-1 min-w-0",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                    className: "text-xs font-semibold mb-1 text-[#0c6780] dark:text-[#87ceeb]",
                                                                    children: [
                                                                        "Replying to ",
                                                                        replyingTo.sender_name || 'Unknown'
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/src/app/chat/page.tsx",
                                                                    lineNumber: 1720,
                                                                    columnNumber: 25
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                    className: "text-sm truncate text-[#6f787d] dark:text-[#bfc8cd]",
                                                                    children: replyingTo.encrypted_content || '📷 Image'
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/app/chat/page.tsx",
                                                                    lineNumber: 1723,
                                                                    columnNumber: 25
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/app/chat/page.tsx",
                                                            lineNumber: 1719,
                                                            columnNumber: 23
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                            onClick: ()=>setReplyingTo(null),
                                                            className: "w-6 h-6 rounded-full bg-white/60 dark:bg-[#004040]/60 flex items-center justify-center shrink-0 hover:bg-white dark:hover:bg-[#004040] transition-colors",
                                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "material-symbols-outlined text-[14px] text-[#6f787d] dark:text-[#bfc8cd]",
                                                                children: "close"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/app/chat/page.tsx",
                                                                lineNumber: 1731,
                                                                columnNumber: 25
                                                            }, this)
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/app/chat/page.tsx",
                                                            lineNumber: 1727,
                                                            columnNumber: 23
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/app/chat/page.tsx",
                                                    lineNumber: 1718,
                                                    columnNumber: 21
                                                }, this),
                                                selectedImage && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "mb-3 p-3 rounded-xl bg-[#87ceeb]/10 dark:bg-[#0c6780]/10 flex items-center gap-3",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "relative",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                                                                    src: URL.createObjectURL(selectedImage),
                                                                    alt: "Selected",
                                                                    width: 64,
                                                                    height: 64,
                                                                    className: "w-16 h-16 object-cover rounded-lg"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/app/chat/page.tsx",
                                                                    lineNumber: 1739,
                                                                    columnNumber: 25
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                    onClick: ()=>setSelectedImage(null),
                                                                    className: "absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center text-xs",
                                                                    children: "×"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/app/chat/page.tsx",
                                                                    lineNumber: 1746,
                                                                    columnNumber: 25
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/app/chat/page.tsx",
                                                            lineNumber: 1738,
                                                            columnNumber: 23
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "flex-1 min-w-0",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                    className: "text-sm text-[#0c6780] dark:text-[#87ceeb] font-medium truncate",
                                                                    children: selectedImage.name
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/app/chat/page.tsx",
                                                                    lineNumber: 1754,
                                                                    columnNumber: 25
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                    className: "text-xs text-[#6f787d] dark:text-[#bfc8cd]",
                                                                    children: [
                                                                        (selectedImage.size / 1024).toFixed(1),
                                                                        " KB"
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/src/app/chat/page.tsx",
                                                                    lineNumber: 1755,
                                                                    columnNumber: 25
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/app/chat/page.tsx",
                                                            lineNumber: 1753,
                                                            columnNumber: 23
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/app/chat/page.tsx",
                                                    lineNumber: 1737,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "bg-white dark:bg-[#004040] rounded-xl flex items-center p-2 gap-2 shadow-sm border border-white/50 dark:border-[#004a4a]/50 relative",
                                                    children: [
                                                        showEmojiPickerInput && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            ref: emojiPickerInputRef,
                                                            className: "absolute bottom-full left-2 mb-2 z-50 bg-white dark:bg-[#004040] rounded-xl p-2 shadow-xl flex gap-1 flex-wrap max-w-70",
                                                            children: EMOJI_OPTIONS.map((emoji)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                    onClick: ()=>{
                                                                        setMessageInput((prev)=>prev + emoji);
                                                                        setShowEmojiPickerInput(false);
                                                                        messageInputRef.current?.focus();
                                                                    },
                                                                    className: "w-8 h-8 rounded-lg text-lg flex items-center justify-center hover:scale-125 active:scale-95 transition-transform hover:bg-gray-100 dark:hover:bg-[#005555]",
                                                                    children: emoji
                                                                }, emoji, false, {
                                                                    fileName: "[project]/src/app/chat/page.tsx",
                                                                    lineNumber: 1767,
                                                                    columnNumber: 27
                                                                }, this))
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/app/chat/page.tsx",
                                                            lineNumber: 1762,
                                                            columnNumber: 23
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                            onClick: ()=>setShowEmojiPickerInput(!showEmojiPickerInput),
                                                            className: "p-2 text-[#6f787d] dark:text-[#bfc8cd] hover:text-[#0c6780] dark:hover:text-[#87ceeb] transition-colors",
                                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "material-symbols-outlined",
                                                                children: "sentiment_satisfied"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/app/chat/page.tsx",
                                                                lineNumber: 1785,
                                                                columnNumber: 23
                                                            }, this)
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/app/chat/page.tsx",
                                                            lineNumber: 1781,
                                                            columnNumber: 21
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                            type: "file",
                                                            ref: fileInputRef,
                                                            className: "hidden",
                                                            accept: "image/*",
                                                            onChange: (e)=>{
                                                                const file = e.target.files?.[0];
                                                                if (file) setSelectedImage(file);
                                                            }
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/app/chat/page.tsx",
                                                            lineNumber: 1787,
                                                            columnNumber: 21
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                            onClick: ()=>fileInputRef.current?.click(),
                                                            className: "p-2 text-[#6f787d] dark:text-[#bfc8cd] hover:text-[#0c6780] dark:hover:text-[#87ceeb] transition-colors",
                                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "material-symbols-outlined",
                                                                children: "attach_file"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/app/chat/page.tsx",
                                                                lineNumber: 1801,
                                                                columnNumber: 23
                                                            }, this)
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/app/chat/page.tsx",
                                                            lineNumber: 1797,
                                                            columnNumber: 21
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                            ref: messageInputRef,
                                                            className: "flex-1 bg-transparent border-none focus:ring-0 text-sm py-2 outline-none dark:text-[#e7fffe] dark:placeholder-[#6f787d]",
                                                            placeholder: isBlocked ? "Cannot send message - user is blocked" : "Type a message...",
                                                            type: "text",
                                                            value: messageInput,
                                                            onChange: (e)=>{
                                                                setMessageInput(e.target.value);
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
                                                            onKeyDown: (e)=>e.key === 'Enter' && !sending && handleSendMessage(),
                                                            disabled: sending || isBlocked
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/app/chat/page.tsx",
                                                            lineNumber: 1803,
                                                            columnNumber: 21
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                            onClick: handleSendMessage,
                                                            disabled: !messageInput.trim() && !selectedImage || sending || isBlocked,
                                                            className: "bg-linear-to-r from-[#87ceeb] via-[#e6e6fa] to-[#ffb6c1] dark:from-[#0c6780] dark:via-[#4a6368] dark:to-[#0c6780] w-10 h-10 rounded-lg flex items-center justify-center text-[#002020] dark:text-white hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed",
                                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "material-symbols-outlined",
                                                                children: "send"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/app/chat/page.tsx",
                                                                lineNumber: 1836,
                                                                columnNumber: 23
                                                            }, this)
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/app/chat/page.tsx",
                                                            lineNumber: 1831,
                                                            columnNumber: 21
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/app/chat/page.tsx",
                                                    lineNumber: 1759,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/app/chat/page.tsx",
                                            lineNumber: 1715,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex-1 flex items-center justify-center",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "text-center",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "w-20 h-20 rounded-full bg-[#87ceeb]/20 dark:bg-[#0c6780]/20 flex items-center justify-center mb-4 mx-auto",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "material-symbols-outlined text-4xl text-[#0c6780] dark:text-[#87ceeb]",
                                                    children: "chat"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/chat/page.tsx",
                                                    lineNumber: 1845,
                                                    columnNumber: 21
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/chat/page.tsx",
                                                lineNumber: 1844,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "text-lg font-semibold text-[#002020] dark:text-[#e7fffe] mb-1",
                                                children: "Select a conversation"
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/chat/page.tsx",
                                                lineNumber: 1847,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "text-sm text-[#6f787d] dark:text-[#bfc8cd]",
                                                children: "Choose a chat from the list to start messaging"
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/chat/page.tsx",
                                                lineNumber: 1848,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/app/chat/page.tsx",
                                        lineNumber: 1843,
                                        columnNumber: 17
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/src/app/chat/page.tsx",
                                    lineNumber: 1842,
                                    columnNumber: 15
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/src/app/chat/page.tsx",
                                lineNumber: 1559,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/chat/page.tsx",
                        lineNumber: 1351,
                        columnNumber: 9
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/src/app/chat/page.tsx",
                    lineNumber: 1349,
                    columnNumber: 7
                }, this),
                showBlockConfirm && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50",
                    onClick: ()=>setShowBlockConfirm(false),
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "bg-white dark:bg-[#003535] rounded-2xl p-6 max-w-sm w-full shadow-xl",
                        onClick: (e)=>e.stopPropagation(),
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                className: "text-lg font-bold mb-2 text-[#002020] dark:text-[#e7fffe]",
                                children: "Block user"
                            }, void 0, false, {
                                fileName: "[project]/src/app/chat/page.tsx",
                                lineNumber: 1861,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-sm mb-4 text-[#6f787d] dark:text-[#bfc8cd]",
                                children: [
                                    "Are you sure you want to block ",
                                    selectedConversation?.other_user_name,
                                    "? You will not be able to send or receive messages from this user."
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/chat/page.tsx",
                                lineNumber: 1862,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex gap-2",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        onClick: ()=>setShowBlockConfirm(false),
                                        className: "flex-1 px-4 py-2 rounded-xl bg-gray-100 dark:bg-[#004040] text-sm font-semibold text-[#6f787d] dark:text-[#bfc8cd] hover:bg-gray-200 dark:hover:bg-[#004a4a]",
                                        children: "Cancel"
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/chat/page.tsx",
                                        lineNumber: 1864,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        onClick: ()=>void handleBlockSelectedUser(),
                                        disabled: blocking,
                                        className: "flex-1 px-4 py-2 rounded-xl bg-red-500 text-sm font-semibold text-white hover:bg-red-600 disabled:opacity-50",
                                        children: blocking ? 'Blocking...' : 'Block'
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/chat/page.tsx",
                                        lineNumber: 1865,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/chat/page.tsx",
                                lineNumber: 1863,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/chat/page.tsx",
                        lineNumber: 1860,
                        columnNumber: 11
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/src/app/chat/page.tsx",
                    lineNumber: 1859,
                    columnNumber: 9
                }, this),
                showReportDialog && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50",
                    onClick: ()=>setShowReportDialog(false),
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "bg-white dark:bg-[#003535] rounded-2xl p-6 max-w-md w-full shadow-xl",
                        onClick: (e)=>e.stopPropagation(),
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                className: "text-lg font-bold mb-2 text-[#002020] dark:text-[#e7fffe]",
                                children: "Report user"
                            }, void 0, false, {
                                fileName: "[project]/src/app/chat/page.tsx",
                                lineNumber: 1875,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-sm mb-3 text-[#6f787d] dark:text-[#bfc8cd]",
                                children: [
                                    "Tell us why you are reporting ",
                                    selectedConversation?.other_user_name,
                                    ". Our team will review it."
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/chat/page.tsx",
                                lineNumber: 1876,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "space-y-2 mb-4",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                        className: "text-sm text-[#6f787d] dark:text-[#bfc8cd]",
                                        children: "Reason"
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/chat/page.tsx",
                                        lineNumber: 1878,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                        value: reportType,
                                        onChange: (e)=>setReportType(e.target.value),
                                        className: "w-full p-2 rounded-md border dark:bg-[#004040] dark:border-[#004a4a] dark:text-[#e7fffe]",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                value: "spam",
                                                children: "Spam"
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/chat/page.tsx",
                                                lineNumber: 1882,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                value: "harassment",
                                                children: "Harassment"
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/chat/page.tsx",
                                                lineNumber: 1883,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                value: "inappropriate_content",
                                                children: "Inappropriate content"
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/chat/page.tsx",
                                                lineNumber: 1884,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                value: "impersonating",
                                                children: "Impersonating"
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/chat/page.tsx",
                                                lineNumber: 1885,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                value: "fake_profile",
                                                children: "Fake profile"
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/chat/page.tsx",
                                                lineNumber: 1886,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                value: "other",
                                                children: "Other"
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/chat/page.tsx",
                                                lineNumber: 1887,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/app/chat/page.tsx",
                                        lineNumber: 1881,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                        className: "text-sm text-[#6f787d] dark:text-[#bfc8cd]",
                                        children: "Description"
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/chat/page.tsx",
                                        lineNumber: 1889,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("textarea", {
                                        value: reportDescription,
                                        onChange: (e)=>setReportDescription(e.target.value),
                                        rows: 4,
                                        className: "w-full p-2 rounded-md border dark:bg-[#004040] dark:border-[#004a4a] dark:text-[#e7fffe]"
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/chat/page.tsx",
                                        lineNumber: 1890,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/chat/page.tsx",
                                lineNumber: 1877,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex gap-2",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        onClick: ()=>setShowReportDialog(false),
                                        className: "flex-1 px-4 py-2 rounded-xl bg-gray-100 dark:bg-[#004040] text-sm font-semibold text-[#6f787d] dark:text-[#bfc8cd] hover:bg-gray-200 dark:hover:bg-[#004a4a]",
                                        children: "Cancel"
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/chat/page.tsx",
                                        lineNumber: 1893,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        onClick: ()=>void handleSubmitReport(),
                                        disabled: reporting,
                                        className: "flex-1 px-4 py-2 rounded-xl bg-primary-container dark:bg-[#0c6780] text-sm font-semibold text-on-primary-container dark:text-white hover:opacity-90 disabled:opacity-50",
                                        children: reporting ? 'Submitting...' : 'Submit Report'
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/chat/page.tsx",
                                        lineNumber: 1894,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/chat/page.tsx",
                                lineNumber: 1892,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/chat/page.tsx",
                        lineNumber: 1874,
                        columnNumber: 11
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/src/app/chat/page.tsx",
                    lineNumber: 1873,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/src/app/chat/page.tsx",
            lineNumber: 1347,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/src/app/chat/page.tsx",
        lineNumber: 1346,
        columnNumber: 5
    }, this);
}
}),
];

//# sourceMappingURL=src_8a828aae._.js.map