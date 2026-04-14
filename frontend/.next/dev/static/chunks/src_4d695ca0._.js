(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/src/services/group.service.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "groupService",
    ()=>groupService
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$apiClient$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/apiClient.ts [app-client] (ecmascript)");
;
const GROUPS_PREFIX = '/api/groups';
const groupService = {
    // Create a new group
    createGroup: async (groupData)=>{
        const response = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$apiClient$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].post(GROUPS_PREFIX, groupData);
        return response.data;
    },
    // Get all public groups
    getPublicGroups: async ()=>{
        const response = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$apiClient$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].get(`${GROUPS_PREFIX}/public`);
        return response.data;
    },
    // Get user's groups
    getMyGroups: async ()=>{
        const response = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$apiClient$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].get(`${GROUPS_PREFIX}/my-groups`);
        return response.data;
    },
    // Get group details
    getGroupDetails: async (groupId)=>{
        const response = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$apiClient$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].get(`${GROUPS_PREFIX}/${groupId}`);
        return response.data;
    },
    // Join a public group
    joinGroup: async (groupId, isAnonymous = false)=>{
        const response = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$apiClient$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].post(`${GROUPS_PREFIX}/${groupId}/join`, {
            is_anonymous: isAnonymous
        });
        return response.data;
    },
    // Get group members
    getGroupMembers: async (groupId)=>{
        const response = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$apiClient$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].get(`${GROUPS_PREFIX}/${groupId}/members`);
        return response.data;
    },
    // Add member to group (for admins)
    addMemberToGroup: async (groupId, userId, isAnonymous = false)=>{
        const response = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$apiClient$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].post(`${GROUPS_PREFIX}/${groupId}/members`, {
            user_id: userId,
            is_anonymous: isAnonymous
        });
        return response.data;
    },
    // Remove member from group (for admins)
    removeMemberFromGroup: async (groupId, memberId)=>{
        const response = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$apiClient$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].delete(`${GROUPS_PREFIX}/${groupId}/members/${memberId}`);
        return response.data;
    },
    // Leave a group
    leaveGroup: async (groupId)=>{
        const response = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$apiClient$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].post(`${GROUPS_PREFIX}/${groupId}/leave`);
        return response.data;
    },
    // Update group details (for admins)
    updateGroup: async (groupId, groupData)=>{
        const response = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$apiClient$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].put(`${GROUPS_PREFIX}/${groupId}`, groupData);
        return response.data;
    },
    // Promote member to admin (for owners)
    promoteMemberToAdmin: async (groupId, memberId)=>{
        const response = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$apiClient$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].post(`${GROUPS_PREFIX}/${groupId}/members/${memberId}/promote`);
        return response.data;
    },
    // Get group messages
    getGroupMessages: async (groupId, limit = 50, before, q)=>{
        const response = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$apiClient$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].get(`${GROUPS_PREFIX}/${groupId}/messages`, {
            params: {
                limit,
                before,
                q
            }
        });
        return response.data;
    },
    // Send group message
    sendGroupMessage: async (groupId, data)=>{
        const response = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$apiClient$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].post(`${GROUPS_PREFIX}/${groupId}/messages`, data);
        return response.data;
    },
    // Create a poll (admins only)
    createPoll: async (groupId, pollData)=>{
        const response = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$apiClient$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].post(`${GROUPS_PREFIX}/${groupId}/polls`, pollData);
        return response.data;
    },
    // Get group polls
    getGroupPolls: async (groupId, status = 'active')=>{
        const response = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$apiClient$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].get(`${GROUPS_PREFIX}/${groupId}/polls`, {
            params: {
                status: status && status !== 'all' ? status : undefined
            }
        });
        return response.data;
    },
    // Vote on a poll
    voteOnPoll: async (groupId, pollId, voteValue, optionId)=>{
        const body = {};
        if (typeof voteValue === 'boolean') body.vote_value = voteValue;
        if (optionId) body.option_id = optionId;
        const response = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$apiClient$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].post(`${GROUPS_PREFIX}/${groupId}/polls/${pollId}/vote`, body);
        return response.data;
    },
    // Get poll results (for General polls)
    getPollResults: async (groupId, pollId)=>{
        const response = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$apiClient$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].get(`${GROUPS_PREFIX}/${groupId}/polls/${pollId}/results`);
        return response.data;
    },
    // Cancel an active poll (creator or admin)
    cancelPoll: async (groupId, pollId, reason)=>{
        const response = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$apiClient$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].delete(`${GROUPS_PREFIX}/${groupId}/polls/${pollId}`, {
            data: {
                reason
            }
        });
        return response.data;
    },
    // Manually execute a passed poll (admin only)
    executePoll: async (groupId, pollId)=>{
        const response = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$apiClient$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].post(`${GROUPS_PREFIX}/${groupId}/polls/${pollId}/execute`);
        return response.data;
    },
    // Upload group chat image
    uploadImage: async (groupId, file)=>{
        const formData = new FormData();
        formData.append('image', file);
        const response = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$apiClient$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].post(`${GROUPS_PREFIX}/${groupId}/upload-image`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        return response.data;
    },
    // Get public keys of all participants in a group
    getGroupParticipantPublicKeys: async (groupId)=>{
        const response = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$apiClient$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].get(`${GROUPS_PREFIX}/${groupId}/participants/keys`);
        return response.data;
    }
};
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/hooks/useGroupPresence.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useGroupPresence",
    ()=>useGroupPresence
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$contexts$2f$SocketContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/contexts/SocketContext.tsx [app-client] (ecmascript)");
var _s = __turbopack_context__.k.signature();
'use client';
;
;
const API_URL = ("TURBOPACK compile-time value", "http://localhost:3001");
function useGroupPresence(groupId) {
    _s();
    const [presence, setPresence] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({
        onlineCount: 0,
        totalMembers: 0
    });
    const { getSocket, isConnected } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$contexts$2f$SocketContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSocket"])();
    const listenersAttached = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(false);
    const refetchTimer = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const fetchCount = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useGroupPresence.useCallback[fetchCount]": async ()=>{
            if (!groupId) return;
            try {
                const res = await fetch(`${API_URL}/api/groups/${groupId}/online-count`, {
                    credentials: 'include'
                });
                if (!res.ok) return;
                const json = await res.json();
                setPresence({
                    onlineCount: json.data?.onlineCount ?? 0,
                    totalMembers: json.data?.totalMembers ?? 0
                });
            } catch  {
            // Non-critical — fail silently
            }
        }
    }["useGroupPresence.useCallback[fetchCount]"], [
        groupId
    ]);
    // Initial fetch
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "useGroupPresence.useEffect": ()=>{
            fetchCount();
        }
    }["useGroupPresence.useEffect"], [
        fetchCount
    ]);
    // Re-fetch when someone goes online/offline (debounced 400ms)
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "useGroupPresence.useEffect": ()=>{
            if (!isConnected) return;
            const socket = getSocket();
            if (!socket || listenersAttached.current) return;
            const handleChange = {
                "useGroupPresence.useEffect.handleChange": ()=>{
                    if (refetchTimer.current) clearTimeout(refetchTimer.current);
                    refetchTimer.current = setTimeout(fetchCount, 400);
                }
            }["useGroupPresence.useEffect.handleChange"];
            socket.on('user-online', handleChange);
            socket.on('user-offline', handleChange);
            listenersAttached.current = true;
            return ({
                "useGroupPresence.useEffect": ()=>{
                    socket.off('user-online', handleChange);
                    socket.off('user-offline', handleChange);
                    if (refetchTimer.current) clearTimeout(refetchTimer.current);
                    listenersAttached.current = false;
                }
            })["useGroupPresence.useEffect"];
        }
    }["useGroupPresence.useEffect"], [
        isConnected,
        getSocket,
        fetchCount
    ]);
    return presence;
}
_s(useGroupPresence, "qV8sLJEWOKllHssr2n1nNa/xcaw=", false, function() {
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
"[project]/src/app/my-groups/page.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>MyGroupsPage
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/compiler-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/client/app-dir/link.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/image.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$group$2e$service$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/services/group.service.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$hooks$2f$useGroupPresence$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/hooks/useGroupPresence.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$contexts$2f$SocketContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/contexts/SocketContext.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$contexts$2f$ToastContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/contexts/ToastContext.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$shared$2f$lib$2f$app$2d$dynamic$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/shared/lib/app-dynamic.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$emoji$2d$picker$2d$react$2f$dist$2f$emoji$2d$picker$2d$react$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/emoji-picker-react/dist/emoji-picker-react.esm.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$e2ee$2e$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/utils/e2ee.utils.ts [app-client] (ecmascript)");
;
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
;
const EmojiPicker = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$shared$2f$lib$2f$app$2d$dynamic$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])(()=>__turbopack_context__.A("[project]/node_modules/emoji-picker-react/dist/emoji-picker-react.esm.js [app-client] (ecmascript, next/dynamic entry, async loader)"), {
    loadableGenerated: {
        modules: [
            "[project]/node_modules/emoji-picker-react/dist/emoji-picker-react.esm.js [app-client] (ecmascript, next/dynamic entry)"
        ]
    },
    ssr: false
});
_c = EmojiPicker;
// interface GroupParticipant {
//   user_id: string;
//   public_key: string;
// }
/** Small inline badge showing live online member count for a group */ function GroupOnlineBadge(t0) {
    _s();
    const $ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["c"])(5);
    if ($[0] !== "1076118b4394cd5a50e3f600d5642375120b49ed711af0344d5fc6c2e3542229") {
        for(let $i = 0; $i < 5; $i += 1){
            $[$i] = Symbol.for("react.memo_cache_sentinel");
        }
        $[0] = "1076118b4394cd5a50e3f600d5642375120b49ed711af0344d5fc6c2e3542229";
    }
    const { groupId } = t0;
    const { onlineCount } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$hooks$2f$useGroupPresence$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useGroupPresence"])(groupId);
    if (onlineCount === 0) {
        return null;
    }
    let t1;
    let t2;
    if ($[1] === Symbol.for("react.memo_cache_sentinel")) {
        t1 = {
            color: "#22C55E"
        };
        t2 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
            className: "inline-block w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse"
        }, void 0, false, {
            fileName: "[project]/src/app/my-groups/page.tsx",
            lineNumber: 67,
            columnNumber: 10
        }, this);
        $[1] = t1;
        $[2] = t2;
    } else {
        t1 = $[1];
        t2 = $[2];
    }
    let t3;
    if ($[3] !== onlineCount) {
        t3 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
            className: "flex items-center gap-1 font-medium",
            style: t1,
            children: [
                t2,
                onlineCount,
                " online"
            ]
        }, void 0, true, {
            fileName: "[project]/src/app/my-groups/page.tsx",
            lineNumber: 76,
            columnNumber: 10
        }, this);
        $[3] = onlineCount;
        $[4] = t3;
    } else {
        t3 = $[4];
    }
    return t3;
}
_s(GroupOnlineBadge, "7tUs0IlaYiJegYKsNhwvOpH8qcg=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$hooks$2f$useGroupPresence$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useGroupPresence"]
    ];
});
_c1 = GroupOnlineBadge;
function MyGroupsPage() {
    _s1();
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"])();
    const { getSocket, isConnected, joinGroup, leaveGroup, sendTyping } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$contexts$2f$SocketContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSocket"])();
    const toast = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$contexts$2f$ToastContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useToast"])();
    const socket = getSocket();
    // Theme state
    const [isDarkMode, setIsDarkMode] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    // Groups list state
    const [groups, setGroups] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(true);
    const [error, setError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [searchQuery, setSearchQuery] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('');
    // Selected group state
    const [selectedGroup, setSelectedGroup] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [showGroupInfo, setShowGroupInfo] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    // Chat state
    const [messages, setMessages] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [newMessage, setNewMessage] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('');
    const [sending, setSending] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [selectedImage, setSelectedImage] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [imagePreview, setImagePreview] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [uploadingImage, setUploadingImage] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [showEmojiPicker, setShowEmojiPicker] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [replyingTo, setReplyingTo] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [sessionKey, setSessionKey] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [keyId, setKeyId] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [isE2EEReady, setIsE2EEReady] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [userPrivateKey, setUserPrivateKey] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [typingUsers, setTypingUsers] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [polls, setPolls] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [, setShowCreatePoll] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [showPollTypeMenu, setShowPollTypeMenu] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [, setSelectedPollType] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [showMobileChat, setShowMobileChat] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    // Refs
    const messagesEndRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const fileInputRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const messageInputRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const emojiPickerRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const pollMenuRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const typingTimeoutRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const userStr = ("TURBOPACK compile-time truthy", 1) ? localStorage.getItem('user') : "TURBOPACK unreachable";
    const currentUser = userStr ? JSON.parse(userStr) : null;
    const currentUserId = currentUser?.user_id || currentUser?.userId;
    // Initialize theme from localStorage
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "MyGroupsPage.useEffect": ()=>{
            const savedTheme = localStorage.getItem('chat-theme');
            if (savedTheme === 'dark') {
                setIsDarkMode(true);
            }
        }
    }["MyGroupsPage.useEffect"], []);
    // Save theme preference
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "MyGroupsPage.useEffect": ()=>{
            localStorage.setItem('chat-theme', isDarkMode ? 'dark' : 'light');
        }
    }["MyGroupsPage.useEffect"], [
        isDarkMode
    ]);
    const toggleTheme = ()=>{
        setIsDarkMode((prev)=>!prev);
    };
    // Fetch groups
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "MyGroupsPage.useEffect": ()=>{
            fetchMyGroups();
        }
    }["MyGroupsPage.useEffect"], []);
    const fetchMyGroups = async ()=>{
        try {
            const response = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$group$2e$service$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["groupService"].getMyGroups();
            if (response.success && response.data && Array.isArray(response.data.groups)) {
                setGroups(response.data.groups);
            }
        } catch (error_0) {
            console.error('Failed to fetch groups:', error_0);
            setError('Failed to fetch your groups');
        } finally{
            setLoading(false);
        }
    };
    // Filter groups based on search
    const filteredGroups = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "MyGroupsPage.useMemo[filteredGroups]": ()=>{
            if (!searchQuery.trim()) return groups;
            const query = searchQuery.toLowerCase();
            return groups.filter({
                "MyGroupsPage.useMemo[filteredGroups]": (g)=>g.group_name.toLowerCase().includes(query)
            }["MyGroupsPage.useMemo[filteredGroups]"]);
        }
    }["MyGroupsPage.useMemo[filteredGroups]"], [
        searchQuery,
        groups
    ]);
    const decryptMessages = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "MyGroupsPage.useCallback[decryptMessages]": async (msgs, aesKey)=>{
            return await Promise.all(msgs.map({
                "MyGroupsPage.useCallback[decryptMessages]": async (m)=>{
                    const decryptedMsg = {
                        ...m
                    };
                    if (m.encrypted_content && m.content_iv && m.content_auth_tag) {
                        try {
                            const decrypted = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$e2ee$2e$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["decryptMessageAES"])(m.encrypted_content, m.content_iv, m.content_auth_tag, aesKey);
                            decryptedMsg.encrypted_content = decrypted;
                        } catch (err) {
                            console.warn(`[E2EE] Failed to decrypt message ${m.message_id}:`, err);
                            decryptedMsg.encrypted_content = '[Encrypted Message]';
                        }
                    }
                    return decryptedMsg;
                }
            }["MyGroupsPage.useCallback[decryptMessages]"]));
        }
    }["MyGroupsPage.useCallback[decryptMessages]"], []);
    const fetchAndDecryptConversationKey = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "MyGroupsPage.useCallback[fetchAndDecryptConversationKey]": async (msgs_0)=>{
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
                const msgWithKey = msgs_0.find({
                    "MyGroupsPage.useCallback[fetchAndDecryptConversationKey].msgWithKey": (m_0)=>m_0.user_session_key && m_0.key_id
                }["MyGroupsPage.useCallback[fetchAndDecryptConversationKey].msgWithKey"]);
                if (msgWithKey && msgWithKey.user_session_key && msgWithKey.key_id && privKey) {
                    try {
                        const aesKeyB64 = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$e2ee$2e$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["decryptKeyWithPrivateKey"])(privKey, msgWithKey.user_session_key);
                        const aesKey_0 = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$e2ee$2e$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["importKeyFromBase64"])(aesKeyB64);
                        setSessionKey(aesKey_0);
                        setKeyId(msgWithKey.key_id);
                        setIsE2EEReady(true);
                        return aesKey_0;
                    } catch (err_1) {
                        console.error('[E2EE] Failed to decrypt session key:', err_1);
                    }
                }
                // Generate new key if none exists
                const newKey = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$e2ee$2e$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["generateAESKey"])();
                setSessionKey(newKey);
                setIsE2EEReady(true);
                return newKey;
            } catch (err_0) {
                console.error('[E2EE] Key initialization failed:', err_0);
                return null;
            }
        }
    }["MyGroupsPage.useCallback[fetchAndDecryptConversationKey]"], [
        userPrivateKey
    ]);
    const loadGroupChat = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "MyGroupsPage.useCallback[loadGroupChat]": async (group)=>{
            try {
                const messagesRes = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$group$2e$service$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["groupService"].getGroupMessages(group.group_id);
                let fetchedMessages = messagesRes.data?.messages || [];
                const aesKey_1 = await fetchAndDecryptConversationKey(fetchedMessages);
                if (aesKey_1) {
                    fetchedMessages = await decryptMessages(fetchedMessages, aesKey_1);
                }
                setMessages(fetchedMessages);
                // Load polls
                const pollsRes = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$group$2e$service$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["groupService"].getGroupPolls(group.group_id);
                setPolls(pollsRes.data?.polls || []);
                // Join socket room
                if (isConnected && group.group_id) {
                    joinGroup(group.group_id);
                }
            } catch (error_1) {
                console.error('Failed to load group chat:', error_1);
            }
        }
    }["MyGroupsPage.useCallback[loadGroupChat]"], [
        fetchAndDecryptConversationKey,
        decryptMessages,
        setMessages,
        setPolls,
        isConnected,
        joinGroup
    ]);
    const handleSelectGroup = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "MyGroupsPage.useCallback[handleSelectGroup]": (group_0)=>{
            setSelectedGroup(group_0);
            setShowGroupInfo(false);
            setShowMobileChat(true);
            loadGroupChat(group_0);
        }
    }["MyGroupsPage.useCallback[handleSelectGroup]"], [
        loadGroupChat
    ]);
    // Socket event listeners
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "MyGroupsPage.useEffect": ()=>{
            if (!isConnected || !socket || !selectedGroup) return;
            const handleNewMessage = {
                "MyGroupsPage.useEffect.handleNewMessage": (data)=>{
                    if (data.message.group_id === selectedGroup.group_id) {
                        setMessages({
                            "MyGroupsPage.useEffect.handleNewMessage": (prev_0)=>[
                                    ...prev_0,
                                    data.message
                                ]
                        }["MyGroupsPage.useEffect.handleNewMessage"]);
                    }
                }
            }["MyGroupsPage.useEffect.handleNewMessage"];
            const handleTyping = {
                "MyGroupsPage.useEffect.handleTyping": (data_0)=>{
                    if (data_0.groupId === selectedGroup?.group_id && data_0.userId !== currentUserId) {
                        if (data_0.isTyping) {
                            setTypingUsers({
                                "MyGroupsPage.useEffect.handleTyping": (prev_1)=>Array.from(new Set([
                                        ...prev_1,
                                        data_0.userId
                                    ]))
                            }["MyGroupsPage.useEffect.handleTyping"]);
                        } else {
                            setTypingUsers({
                                "MyGroupsPage.useEffect.handleTyping": (prev_2)=>prev_2.filter({
                                        "MyGroupsPage.useEffect.handleTyping": (id)=>id !== data_0.userId
                                    }["MyGroupsPage.useEffect.handleTyping"])
                            }["MyGroupsPage.useEffect.handleTyping"]);
                        }
                    }
                }
            }["MyGroupsPage.useEffect.handleTyping"];
            socket.on('group:message', handleNewMessage);
            socket.on('group:typing', handleTyping);
            return ({
                "MyGroupsPage.useEffect": ()=>{
                    socket.off('group:message', handleNewMessage);
                    socket.off('group:typing', handleTyping);
                    if (selectedGroup) {
                        leaveGroup(selectedGroup.group_id);
                    }
                }
            })["MyGroupsPage.useEffect"];
        }
    }["MyGroupsPage.useEffect"], [
        isConnected,
        socket,
        selectedGroup,
        currentUserId,
        joinGroup,
        leaveGroup
    ]);
    // Auto-scroll to bottom
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "MyGroupsPage.useEffect": ()=>{
            messagesEndRef.current?.scrollIntoView({
                behavior: 'smooth'
            });
        }
    }["MyGroupsPage.useEffect"], [
        messages
    ]);
    // Handle typing
    const handleMessageChange = (e)=>{
        setNewMessage(e.target.value);
        if (selectedGroup && isConnected) {
            sendTyping(selectedGroup.group_id, 'group', true);
            if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
            typingTimeoutRef.current = setTimeout(()=>{
                sendTyping(selectedGroup.group_id, 'group', false);
            }, 2000);
        }
    };
    // Handle image select
    const handleImageSelect = (e_0)=>{
        const file = e_0.target.files?.[0];
        if (file) {
            if (file.size > 5 * 1024 * 1024) {
                toast?.error?.('Image size must be less than 5MB');
                return;
            }
            setSelectedImage(file);
            setImagePreview(URL.createObjectURL(file));
        }
    };
    const handleRemoveImage = ()=>{
        setSelectedImage(null);
        setImagePreview(null);
        if (fileInputRef.current) fileInputRef.current.value = '';
    };
    // Handle emoji select
    const handleEmojiSelect = (emojiData)=>{
        setNewMessage((prev_3)=>prev_3 + emojiData.emoji);
        setShowEmojiPicker(false);
        messageInputRef.current?.focus();
    };
    // Handle send message
    const handleSendMessage = async (e_1)=>{
        e_1.preventDefault();
        if (!newMessage.trim() && !selectedImage || !selectedGroup) return;
        setSending(true);
        try {
            let mediaUrl = '';
            let mediaSize = 0;
            let mediaMimeType = '';
            // Upload image if selected
            if (selectedImage) {
                setUploadingImage(true);
                try {
                    const uploadRes = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$group$2e$service$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["groupService"].uploadImage(selectedGroup.group_id, selectedImage);
                    mediaUrl = uploadRes.data?.url || '';
                    mediaSize = uploadRes.data?.size || 0;
                    mediaMimeType = uploadRes.data?.mimeType || '';
                } catch (uploadError) {
                    console.error('Failed to upload image:', uploadError);
                    toast?.error?.('Failed to upload image');
                    setSending(false);
                    setUploadingImage(false);
                    return;
                }
                setUploadingImage(false);
            }
            // Encrypt message content
            let finalContent = newMessage || 'Image';
            let contentIv = 'dummy_iv';
            let contentAuthTag = 'dummy_tag';
            if (isE2EEReady && sessionKey) {
                try {
                    const { ciphertext, iv, authTag } = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$e2ee$2e$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["encryptMessageAES"])(finalContent, sessionKey);
                    finalContent = ciphertext;
                    contentIv = iv;
                    contentAuthTag = authTag;
                } catch (err_2) {
                    console.error('[E2EE] Encryption failed:', err_2);
                    setSending(false);
                    return;
                }
            }
            // Send message
            await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$group$2e$service$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["groupService"].sendGroupMessage(selectedGroup.group_id, {
                encryptedContent: finalContent,
                contentIv,
                contentAuthTag,
                messageType: selectedImage ? 'image' : 'text',
                mediaUrl,
                mediaSize,
                mediaMimeType,
                keyId: keyId || undefined,
                parentMessageId: replyingTo?.message_id
            });
            setNewMessage('');
            setSelectedImage(null);
            setImagePreview(null);
            setReplyingTo(null);
            if (fileInputRef.current) fileInputRef.current.value = '';
            // Reload messages
            loadGroupChat(selectedGroup);
        } catch (error_2) {
            console.error('Failed to send message:', error_2);
            toast?.error?.('Failed to send message');
        } finally{
            setSending(false);
        }
    };
    // Close emoji picker on outside click
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "MyGroupsPage.useEffect": ()=>{
            if (!showEmojiPicker) return;
            const handleClick = {
                "MyGroupsPage.useEffect.handleClick": (e_2)=>{
                    if (emojiPickerRef.current && !emojiPickerRef.current.contains(e_2.target)) {
                        setShowEmojiPicker(false);
                    }
                }
            }["MyGroupsPage.useEffect.handleClick"];
            document.addEventListener('mousedown', handleClick);
            return ({
                "MyGroupsPage.useEffect": ()=>document.removeEventListener('mousedown', handleClick)
            })["MyGroupsPage.useEffect"];
        }
    }["MyGroupsPage.useEffect"], [
        showEmojiPicker
    ]);
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
                                className: `w-full md:w-[35%] bg-[#d7fafa]/50 dark:bg-[#003535]/50 flex flex-col border-r border-white/30 dark:border-[#004a4a]/30 relative h-full overflow-hidden ${showMobileChat ? 'hidden md:flex' : 'flex'}`,
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "p-6",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "flex items-center justify-between mb-6",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                                                        className: "text-2xl font-extrabold tracking-tight text-[#0c6780] dark:text-[#87ceeb]",
                                                        children: "Groups"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/my-groups/page.tsx",
                                                        lineNumber: 449,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "w-10 h-10 rounded-full bg-[#87ceeb]/20 dark:bg-[#0c6780]/20 animate-pulse"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/my-groups/page.tsx",
                                                        lineNumber: 450,
                                                        columnNumber: 21
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/app/my-groups/page.tsx",
                                                lineNumber: 448,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "relative mb-4",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "w-full bg-white dark:bg-[#004040] rounded-full py-2.5 pl-10 pr-4 h-10 animate-pulse"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/my-groups/page.tsx",
                                                    lineNumber: 455,
                                                    columnNumber: 21
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/my-groups/page.tsx",
                                                lineNumber: 454,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "w-full py-3 px-4 rounded-xl h-11 bg-gradient-to-r from-[#87ceeb]/30 to-[#ffb6c1]/30 dark:from-[#0c6780]/30 dark:to-[#4a6368]/30 animate-pulse"
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/my-groups/page.tsx",
                                                lineNumber: 459,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/app/my-groups/page.tsx",
                                        lineNumber: 446,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex-1 overflow-y-auto px-4 pb-4 space-y-1 scrollbar-visible",
                                        children: Array.from({
                                            length: 6
                                        }).map((_, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "flex items-center gap-3 p-3 rounded-xl animate-pulse",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "w-12 h-12 rounded-xl bg-[#87ceeb]/20 dark:bg-[#0c6780]/20"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/my-groups/page.tsx",
                                                        lineNumber: 467,
                                                        columnNumber: 23
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "flex-1 min-w-0 space-y-1.5",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "h-3.5 w-3/4 bg-[#87ceeb]/20 dark:bg-[#0c6780]/20 rounded"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/app/my-groups/page.tsx",
                                                                lineNumber: 469,
                                                                columnNumber: 25
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "flex items-center gap-2",
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                        className: "h-3 w-20 bg-[#87ceeb]/20 dark:bg-[#0c6780]/20 rounded"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/app/my-groups/page.tsx",
                                                                        lineNumber: 471,
                                                                        columnNumber: 27
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                        className: "h-3 w-16 bg-[#22C55E]/20 rounded"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/app/my-groups/page.tsx",
                                                                        lineNumber: 472,
                                                                        columnNumber: 27
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/src/app/my-groups/page.tsx",
                                                                lineNumber: 470,
                                                                columnNumber: 25
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/app/my-groups/page.tsx",
                                                        lineNumber: 468,
                                                        columnNumber: 23
                                                    }, this)
                                                ]
                                            }, i, true, {
                                                fileName: "[project]/src/app/my-groups/page.tsx",
                                                lineNumber: 466,
                                                columnNumber: 34
                                            }, this))
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/my-groups/page.tsx",
                                        lineNumber: 463,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/my-groups/page.tsx",
                                lineNumber: 445,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("main", {
                                className: `flex-1 flex-col bg-white/50 dark:bg-[#003535]/30 h-full overflow-hidden ${showMobileChat ? 'flex' : 'hidden md:flex'}`,
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "px-4 md:px-6 py-4 bg-white/30 dark:bg-[#003535]/30 backdrop-blur-md border-b border-white/30 dark:border-[#004a4a]/30 flex items-center justify-between shrink-0 sticky top-0 z-20",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "flex items-center gap-3",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "w-10 h-10 rounded-xl bg-[#87ceeb]/20 dark:bg-[#0c6780]/20 animate-pulse"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/my-groups/page.tsx",
                                                    lineNumber: 484,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "space-y-1",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "h-4 w-32 bg-[#87ceeb]/20 dark:bg-[#0c6780]/20 rounded animate-pulse"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/app/my-groups/page.tsx",
                                                            lineNumber: 486,
                                                            columnNumber: 23
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "h-3 w-24 bg-[#87ceeb]/20 dark:bg-[#0c6780]/20 rounded animate-pulse"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/app/my-groups/page.tsx",
                                                            lineNumber: 487,
                                                            columnNumber: 23
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/app/my-groups/page.tsx",
                                                    lineNumber: 485,
                                                    columnNumber: 21
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/app/my-groups/page.tsx",
                                            lineNumber: 483,
                                            columnNumber: 19
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/my-groups/page.tsx",
                                        lineNumber: 482,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex-1 flex items-center justify-center overflow-y-auto scrollbar-visible",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "text-center space-y-4",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "w-16 h-16 rounded-full bg-[#87ceeb]/20 dark:bg-[#0c6780]/20 mx-auto animate-pulse"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/my-groups/page.tsx",
                                                    lineNumber: 495,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "h-4 w-40 bg-[#87ceeb]/20 dark:bg-[#0c6780]/20 mx-auto rounded animate-pulse"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/my-groups/page.tsx",
                                                    lineNumber: 496,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "h-3 w-32 bg-[#87ceeb]/20 dark:bg-[#0c6780]/20 mx-auto rounded animate-pulse"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/my-groups/page.tsx",
                                                    lineNumber: 497,
                                                    columnNumber: 21
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/app/my-groups/page.tsx",
                                            lineNumber: 494,
                                            columnNumber: 19
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/my-groups/page.tsx",
                                        lineNumber: 493,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/my-groups/page.tsx",
                                lineNumber: 480,
                                columnNumber: 15
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/my-groups/page.tsx",
                        lineNumber: 443,
                        columnNumber: 13
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/src/app/my-groups/page.tsx",
                    lineNumber: 442,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/app/my-groups/page.tsx",
                lineNumber: 441,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/src/app/my-groups/page.tsx",
            lineNumber: 440,
            columnNumber: 12
        }, this);
    }
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
                                                    children: "Groups"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/my-groups/page.tsx",
                                                    lineNumber: 513,
                                                    columnNumber: 19
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
                                                                fileName: "[project]/src/app/my-groups/page.tsx",
                                                                lineNumber: 516,
                                                                columnNumber: 23
                                                            }, this)
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/app/my-groups/page.tsx",
                                                            lineNumber: 515,
                                                            columnNumber: 21
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                                            href: "/dashboard",
                                                            className: "w-10 h-10 flex items-center justify-center hover:bg-red-100/50 dark:hover:bg-red-900/30 rounded-full transition-colors group",
                                                            title: "Close",
                                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "material-symbols-outlined text-[#6f787d] dark:text-[#bfc8cd] group-hover:text-red-600",
                                                                children: "close"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/app/my-groups/page.tsx",
                                                                lineNumber: 521,
                                                                columnNumber: 23
                                                            }, this)
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/app/my-groups/page.tsx",
                                                            lineNumber: 520,
                                                            columnNumber: 21
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/app/my-groups/page.tsx",
                                                    lineNumber: 514,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/app/my-groups/page.tsx",
                                            lineNumber: 512,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "relative mb-4",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#6f787d] dark:text-[#bfc8cd]",
                                                    children: "search"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/my-groups/page.tsx",
                                                    lineNumber: 528,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                    className: "w-full bg-white dark:bg-[#004040] border-none rounded-full py-2.5 pl-10 pr-4 text-sm focus:ring-2 focus:ring-[#87ceeb] dark:focus:ring-[#0c6780] outline-none dark:text-[#e7fffe] dark:placeholder-[#6f787d]",
                                                    placeholder: "Search groups...",
                                                    type: "text",
                                                    value: searchQuery,
                                                    onChange: (e_3)=>setSearchQuery(e_3.target.value)
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/my-groups/page.tsx",
                                                    lineNumber: 529,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/app/my-groups/page.tsx",
                                            lineNumber: 527,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                            href: "/dashboard",
                                            className: "w-full py-3 px-4 rounded-xl bg-linear-to-r from-[#87ceeb] to-[#ffb6c1] dark:from-[#0c6780] dark:to-[#4a6368] text-white font-semibold text-sm flex items-center justify-center gap-2 hover:shadow-lg transition-all",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "material-symbols-outlined",
                                                    children: "add"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/my-groups/page.tsx",
                                                    lineNumber: 533,
                                                    columnNumber: 19
                                                }, this),
                                                "Create New Group"
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/app/my-groups/page.tsx",
                                            lineNumber: 532,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/app/my-groups/page.tsx",
                                    lineNumber: 511,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex-1 overflow-y-auto px-4 pb-4 scrollbar-visible",
                                    children: [
                                        error && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "p-4 mb-4 rounded-xl bg-red-100/50 border border-red-400 text-red-700 text-sm",
                                            children: [
                                                "⚠️ ",
                                                error
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/app/my-groups/page.tsx",
                                            lineNumber: 539,
                                            columnNumber: 27
                                        }, this),
                                        filteredGroups.length === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "p-8 text-center",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "w-16 h-16 rounded-full bg-[#87ceeb]/20 dark:bg-[#0c6780]/20 flex items-center justify-center mb-3 mx-auto",
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "material-symbols-outlined text-3xl text-[#0c6780] dark:text-[#87ceeb]",
                                                        children: "groups"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/my-groups/page.tsx",
                                                        lineNumber: 545,
                                                        columnNumber: 23
                                                    }, this)
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/my-groups/page.tsx",
                                                    lineNumber: 544,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    className: "font-semibold text-[#002020] dark:text-[#e7fffe] mb-1",
                                                    children: "No groups yet"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/my-groups/page.tsx",
                                                    lineNumber: 547,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    className: "text-sm text-[#6f787d] dark:text-[#bfc8cd] mb-4",
                                                    children: "Join or create groups from the dashboard"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/my-groups/page.tsx",
                                                    lineNumber: 548,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                                    href: "/dashboard",
                                                    className: "text-sm font-semibold text-[#0c6780] dark:text-[#87ceeb] hover:underline",
                                                    children: "Browse Groups →"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/my-groups/page.tsx",
                                                    lineNumber: 549,
                                                    columnNumber: 21
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/app/my-groups/page.tsx",
                                            lineNumber: 543,
                                            columnNumber: 48
                                        }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "space-y-2",
                                            children: filteredGroups.map((group_1)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                    onClick: ()=>handleSelectGroup(group_1),
                                                    className: `w-full flex items-center gap-3 p-3 rounded-xl transition-all text-left ${selectedGroup?.group_id === group_1.group_id ? 'bg-white dark:bg-[#004040] shadow-md' : 'hover:bg-white/50 dark:hover:bg-[#004040]/50'}`,
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "relative shrink-0",
                                                            children: group_1.group_dp_url ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                                                src: group_1.group_dp_url,
                                                                alt: group_1.group_name,
                                                                width: 48,
                                                                height: 48,
                                                                className: "w-12 h-12 rounded-xl object-cover"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/app/my-groups/page.tsx",
                                                                lineNumber: 555,
                                                                columnNumber: 51
                                                            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold bg-linear-to-br from-[#87ceeb] to-[#0c6780]",
                                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                    className: "material-symbols-outlined",
                                                                    children: "groups"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/app/my-groups/page.tsx",
                                                                    lineNumber: 556,
                                                                    columnNumber: 31
                                                                }, this)
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/app/my-groups/page.tsx",
                                                                lineNumber: 555,
                                                                columnNumber: 184
                                                            }, this)
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/app/my-groups/page.tsx",
                                                            lineNumber: 554,
                                                            columnNumber: 25
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "flex-1 min-w-0",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    className: "flex items-center justify-between",
                                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                        className: "font-semibold text-sm text-[#002020] dark:text-[#e7fffe] truncate",
                                                                        children: group_1.group_name
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/app/my-groups/page.tsx",
                                                                        lineNumber: 561,
                                                                        columnNumber: 29
                                                                    }, this)
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/app/my-groups/page.tsx",
                                                                    lineNumber: 560,
                                                                    columnNumber: 27
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    className: "flex items-center gap-2",
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                            className: "text-xs text-[#6f787d] dark:text-[#bfc8cd]",
                                                                            children: [
                                                                                group_1.member_count,
                                                                                " members"
                                                                            ]
                                                                        }, void 0, true, {
                                                                            fileName: "[project]/src/app/my-groups/page.tsx",
                                                                            lineNumber: 566,
                                                                            columnNumber: 29
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(GroupOnlineBadge, {
                                                                            groupId: group_1.group_id
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/src/app/my-groups/page.tsx",
                                                                            lineNumber: 569,
                                                                            columnNumber: 29
                                                                        }, this)
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/src/app/my-groups/page.tsx",
                                                                    lineNumber: 565,
                                                                    columnNumber: 27
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/app/my-groups/page.tsx",
                                                            lineNumber: 559,
                                                            columnNumber: 25
                                                        }, this)
                                                    ]
                                                }, group_1.group_id, true, {
                                                    fileName: "[project]/src/app/my-groups/page.tsx",
                                                    lineNumber: 553,
                                                    columnNumber: 52
                                                }, this))
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/my-groups/page.tsx",
                                            lineNumber: 552,
                                            columnNumber: 28
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/app/my-groups/page.tsx",
                                    lineNumber: 538,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/app/my-groups/page.tsx",
                            lineNumber: 510,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("main", {
                            className: `flex-1 flex-col bg-white/50 dark:bg-[#003535]/30 min-h-0 ${showMobileChat ? 'flex' : 'hidden md:flex'}`,
                            children: showGroupInfo && selectedGroup ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex-1 overflow-y-auto p-6",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "max-w-2xl mx-auto",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            onClick: ()=>setShowGroupInfo(false),
                                            className: "mb-4 flex items-center gap-2 text-[#6f787d] dark:text-[#bfc8cd] hover:text-[#0c6780] dark:hover:text-[#87ceeb] transition-colors",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "material-symbols-outlined",
                                                    children: "arrow_back"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/my-groups/page.tsx",
                                                    lineNumber: 581,
                                                    columnNumber: 23
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "text-sm font-medium",
                                                    children: "Back to Chat"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/my-groups/page.tsx",
                                                    lineNumber: 582,
                                                    columnNumber: 23
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/app/my-groups/page.tsx",
                                            lineNumber: 580,
                                            columnNumber: 21
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "bg-white dark:bg-[#004040] rounded-2xl p-6 shadow-sm mb-6",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "flex items-center gap-4 mb-4",
                                                    children: [
                                                        selectedGroup.group_dp_url ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                                            src: selectedGroup.group_dp_url,
                                                            alt: selectedGroup.group_name,
                                                            width: 80,
                                                            height: 80,
                                                            className: "w-20 h-20 rounded-2xl object-cover"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/app/my-groups/page.tsx",
                                                            lineNumber: 588,
                                                            columnNumber: 55
                                                        }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "w-20 h-20 rounded-2xl flex items-center justify-center text-white font-bold bg-linear-to-br from-[#87ceeb] to-[#0c6780]",
                                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "material-symbols-outlined text-3xl",
                                                                children: "groups"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/app/my-groups/page.tsx",
                                                                lineNumber: 589,
                                                                columnNumber: 29
                                                            }, this)
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/app/my-groups/page.tsx",
                                                            lineNumber: 588,
                                                            columnNumber: 201
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "flex-1",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                                                    className: "text-xl font-bold text-[#002020] dark:text-[#e7fffe]",
                                                                    children: selectedGroup.group_name
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/app/my-groups/page.tsx",
                                                                    lineNumber: 592,
                                                                    columnNumber: 27
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                    className: "text-sm text-[#6f787d] dark:text-[#bfc8cd]",
                                                                    children: [
                                                                        selectedGroup.is_public ? 'Public' : 'Private',
                                                                        " Group • ",
                                                                        selectedGroup.member_count,
                                                                        " members"
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/src/app/my-groups/page.tsx",
                                                                    lineNumber: 593,
                                                                    columnNumber: 27
                                                                }, this),
                                                                selectedGroup.is_admin && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                    className: "inline-block mt-1 px-2 py-0.5 rounded-full text-xs bg-[#87ceeb]/20 dark:bg-[#0c6780]/20 text-[#0c6780] dark:text-[#87ceeb]",
                                                                    children: "Admin"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/app/my-groups/page.tsx",
                                                                    lineNumber: 596,
                                                                    columnNumber: 54
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/app/my-groups/page.tsx",
                                                            lineNumber: 591,
                                                            columnNumber: 25
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/app/my-groups/page.tsx",
                                                    lineNumber: 587,
                                                    columnNumber: 23
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    className: "text-sm text-[#6f787d] dark:text-[#bfc8cd]",
                                                    children: selectedGroup.group_desc || 'No description'
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/my-groups/page.tsx",
                                                    lineNumber: 601,
                                                    columnNumber: 23
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/app/my-groups/page.tsx",
                                            lineNumber: 586,
                                            columnNumber: 21
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "grid grid-cols-2 gap-4 mb-6",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                                    href: `/groups/${selectedGroup.group_id}`,
                                                    className: "p-4 rounded-xl bg-white dark:bg-[#004040] shadow-sm hover:shadow-md transition-shadow text-center",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            className: "material-symbols-outlined text-2xl text-[#0c6780] dark:text-[#87ceeb] mb-2",
                                                            children: "info"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/app/my-groups/page.tsx",
                                                            lineNumber: 609,
                                                            columnNumber: 25
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                            className: "text-sm font-medium text-[#002020] dark:text-[#e7fffe]",
                                                            children: "Full Details"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/app/my-groups/page.tsx",
                                                            lineNumber: 610,
                                                            columnNumber: 25
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/app/my-groups/page.tsx",
                                                    lineNumber: 608,
                                                    columnNumber: 23
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                                    href: `/groups/${selectedGroup.group_id}`,
                                                    className: "p-4 rounded-xl bg-white dark:bg-[#004040] shadow-sm hover:shadow-md transition-shadow text-center",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            className: "material-symbols-outlined text-2xl text-[#0c6780] dark:text-[#87ceeb] mb-2",
                                                            children: "group"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/app/my-groups/page.tsx",
                                                            lineNumber: 613,
                                                            columnNumber: 25
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                            className: "text-sm font-medium text-[#002020] dark:text-[#e7fffe]",
                                                            children: "Members"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/app/my-groups/page.tsx",
                                                            lineNumber: 614,
                                                            columnNumber: 25
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/app/my-groups/page.tsx",
                                                    lineNumber: 612,
                                                    columnNumber: 23
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/app/my-groups/page.tsx",
                                            lineNumber: 607,
                                            columnNumber: 21
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "bg-white dark:bg-[#004040] rounded-2xl p-6 shadow-sm",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                    className: "text-lg font-bold text-[#002020] dark:text-[#e7fffe] mb-4",
                                                    children: "Active Polls"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/my-groups/page.tsx",
                                                    lineNumber: 620,
                                                    columnNumber: 23
                                                }, this),
                                                polls.length === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    className: "text-sm text-[#6f787d] dark:text-[#bfc8cd]",
                                                    children: "No active polls"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/my-groups/page.tsx",
                                                    lineNumber: 621,
                                                    columnNumber: 45
                                                }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "space-y-3",
                                                    children: polls.slice(0, 3).map((poll)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "p-3 rounded-xl bg-[#e2fffe] dark:bg-[#003535]",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                    className: "font-medium text-[#002020] dark:text-[#e7fffe]",
                                                                    children: poll.title
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/app/my-groups/page.tsx",
                                                                    lineNumber: 623,
                                                                    columnNumber: 31
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                    className: "text-xs text-[#6f787d] dark:text-[#bfc8cd]",
                                                                    children: poll.poll_type
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/app/my-groups/page.tsx",
                                                                    lineNumber: 624,
                                                                    columnNumber: 31
                                                                }, this)
                                                            ]
                                                        }, poll.poll_id, true, {
                                                            fileName: "[project]/src/app/my-groups/page.tsx",
                                                            lineNumber: 622,
                                                            columnNumber: 58
                                                        }, this))
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/my-groups/page.tsx",
                                                    lineNumber: 621,
                                                    columnNumber: 125
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/app/my-groups/page.tsx",
                                            lineNumber: 619,
                                            columnNumber: 21
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/app/my-groups/page.tsx",
                                    lineNumber: 579,
                                    columnNumber: 19
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/src/app/my-groups/page.tsx",
                                lineNumber: 578,
                                columnNumber: 49
                            }, this) : selectedGroup ? // Group Chat View
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("header", {
                                        className: "px-4 md:px-6 py-4 bg-white/30 dark:bg-[#003535]/30 backdrop-blur-md border-b border-white/30 dark:border-[#004a4a]/30 flex items-center justify-between shrink-0 sticky top-0 z-20",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "flex items-center gap-3",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                        onClick: ()=>setShowMobileChat(false),
                                                        className: "md:hidden p-2 -ml-2 hover:bg-white/50 dark:hover:bg-[#004040]/50 rounded-full transition-colors",
                                                        "aria-label": "Back to groups",
                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            className: "material-symbols-outlined text-[#6f787d] dark:text-[#bfc8cd]",
                                                            children: "arrow_back"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/app/my-groups/page.tsx",
                                                            lineNumber: 637,
                                                            columnNumber: 25
                                                        }, this)
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/my-groups/page.tsx",
                                                        lineNumber: 636,
                                                        columnNumber: 23
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                        onClick: ()=>setShowGroupInfo(true),
                                                        className: "flex items-center gap-3 hover:opacity-80 transition-opacity",
                                                        children: [
                                                            selectedGroup.group_dp_url ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                                                src: selectedGroup.group_dp_url,
                                                                alt: selectedGroup.group_name,
                                                                width: 40,
                                                                height: 40,
                                                                className: "w-10 h-10 rounded-xl object-cover"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/app/my-groups/page.tsx",
                                                                lineNumber: 640,
                                                                columnNumber: 55
                                                            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "w-10 h-10 rounded-xl flex items-center justify-center text-white bg-linear-to-br from-[#87ceeb] to-[#0c6780]",
                                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                    className: "material-symbols-outlined",
                                                                    children: "groups"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/app/my-groups/page.tsx",
                                                                    lineNumber: 641,
                                                                    columnNumber: 29
                                                                }, this)
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/app/my-groups/page.tsx",
                                                                lineNumber: 640,
                                                                columnNumber: 200
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                                                        className: "font-bold text-[#002020] dark:text-[#e7fffe]",
                                                                        children: selectedGroup.group_name
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/app/my-groups/page.tsx",
                                                                        lineNumber: 644,
                                                                        columnNumber: 27
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                        className: "text-xs text-[#6f787d] dark:text-[#bfc8cd]",
                                                                        children: [
                                                                            selectedGroup.member_count,
                                                                            " members • ",
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(GroupOnlineBadge, {
                                                                                groupId: selectedGroup.group_id
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/src/app/my-groups/page.tsx",
                                                                                lineNumber: 646,
                                                                                columnNumber: 68
                                                                            }, this)
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/src/app/my-groups/page.tsx",
                                                                        lineNumber: 645,
                                                                        columnNumber: 27
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/src/app/my-groups/page.tsx",
                                                                lineNumber: 643,
                                                                columnNumber: 25
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/app/my-groups/page.tsx",
                                                        lineNumber: 639,
                                                        columnNumber: 23
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/app/my-groups/page.tsx",
                                                lineNumber: 634,
                                                columnNumber: 21
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "flex items-center gap-2",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                    onClick: ()=>router.push(`/groups/${selectedGroup.group_id}`),
                                                    className: "p-2 hover:bg-white/50 dark:hover:bg-[#004040]/50 rounded-full transition-colors",
                                                    title: "Group Details",
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "material-symbols-outlined text-[#6f787d] dark:text-[#bfc8cd]",
                                                        children: "info"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/my-groups/page.tsx",
                                                        lineNumber: 653,
                                                        columnNumber: 25
                                                    }, this)
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/my-groups/page.tsx",
                                                    lineNumber: 652,
                                                    columnNumber: 23
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/my-groups/page.tsx",
                                                lineNumber: 651,
                                                columnNumber: 21
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/app/my-groups/page.tsx",
                                        lineNumber: 633,
                                        columnNumber: 19
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex-1 overflow-y-auto p-4 space-y-4 scrollbar-visible",
                                        children: [
                                            messages.length === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "flex-1 flex items-center justify-center h-full",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "text-center",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "w-16 h-16 rounded-full bg-[#87ceeb]/20 dark:bg-[#0c6780]/20 flex items-center justify-center mb-3 mx-auto",
                                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "material-symbols-outlined text-3xl text-[#0c6780] dark:text-[#87ceeb]",
                                                                children: "chat"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/app/my-groups/page.tsx",
                                                                lineNumber: 663,
                                                                columnNumber: 29
                                                            }, this)
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/app/my-groups/page.tsx",
                                                            lineNumber: 662,
                                                            columnNumber: 27
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                            className: "font-semibold text-[#002020] dark:text-[#e7fffe] mb-1",
                                                            children: "No messages yet"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/app/my-groups/page.tsx",
                                                            lineNumber: 665,
                                                            columnNumber: 27
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                            className: "text-sm text-[#6f787d] dark:text-[#bfc8cd]",
                                                            children: "Start the conversation!"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/app/my-groups/page.tsx",
                                                            lineNumber: 666,
                                                            columnNumber: 27
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/app/my-groups/page.tsx",
                                                    lineNumber: 661,
                                                    columnNumber: 25
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/my-groups/page.tsx",
                                                lineNumber: 660,
                                                columnNumber: 46
                                            }, this) : messages.map((msg)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: `flex ${msg.is_my_message ? 'justify-end' : 'justify-start'}`,
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: `max-w-[70%] ${msg.is_my_message ? 'bg-[#87ceeb] dark:bg-[#0c6780] text-white rounded-2xl rounded-br-sm' : 'bg-white dark:bg-[#004040] text-[#002020] dark:text-[#e7fffe] rounded-2xl rounded-bl-sm'} p-3 shadow-sm`,
                                                        children: [
                                                            !msg.is_my_message && msg.sender && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                className: "text-xs font-semibold mb-1 text-[#0c6780] dark:text-[#87ceeb]",
                                                                children: msg.sender.name
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/app/my-groups/page.tsx",
                                                                lineNumber: 670,
                                                                columnNumber: 66
                                                            }, this),
                                                            msg.message_type === 'image' && msg.media_url && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "mb-2",
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
                                                                        unoptimized: true
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/app/my-groups/page.tsx",
                                                                        lineNumber: 675,
                                                                        columnNumber: 35
                                                                    }, this)
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/app/my-groups/page.tsx",
                                                                    lineNumber: 674,
                                                                    columnNumber: 33
                                                                }, this)
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/app/my-groups/page.tsx",
                                                                lineNumber: 673,
                                                                columnNumber: 79
                                                            }, this),
                                                            msg.encrypted_content && msg.message_type !== 'image' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                className: "text-sm whitespace-pre-wrap",
                                                                children: msg.encrypted_content
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/app/my-groups/page.tsx",
                                                                lineNumber: 678,
                                                                columnNumber: 87
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: `flex items-center gap-1 mt-1 ${msg.is_my_message ? 'justify-end' : 'justify-start'}`,
                                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                    className: `text-[10px] ${msg.is_my_message ? 'text-white/70' : 'text-[#6f787d] dark:text-[#bfc8cd]'}`,
                                                                    children: formatTime(msg.created_at)
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/app/my-groups/page.tsx",
                                                                    lineNumber: 680,
                                                                    columnNumber: 31
                                                                }, this)
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/app/my-groups/page.tsx",
                                                                lineNumber: 679,
                                                                columnNumber: 29
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/app/my-groups/page.tsx",
                                                        lineNumber: 669,
                                                        columnNumber: 27
                                                    }, this)
                                                }, msg.message_id, false, {
                                                    fileName: "[project]/src/app/my-groups/page.tsx",
                                                    lineNumber: 668,
                                                    columnNumber: 52
                                                }, this)),
                                            typingUsers.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "flex justify-start",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "bg-white dark:bg-[#004040] rounded-2xl rounded-bl-sm p-3 shadow-sm",
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "flex items-center gap-1",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "w-2 h-2 bg-[#6f787d] rounded-full animate-bounce",
                                                                style: {
                                                                    animationDelay: '0ms'
                                                                }
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/app/my-groups/page.tsx",
                                                                lineNumber: 689,
                                                                columnNumber: 29
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "w-2 h-2 bg-[#6f787d] rounded-full animate-bounce",
                                                                style: {
                                                                    animationDelay: '150ms'
                                                                }
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/app/my-groups/page.tsx",
                                                                lineNumber: 692,
                                                                columnNumber: 29
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "w-2 h-2 bg-[#6f787d] rounded-full animate-bounce",
                                                                style: {
                                                                    animationDelay: '300ms'
                                                                }
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/app/my-groups/page.tsx",
                                                                lineNumber: 695,
                                                                columnNumber: 29
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/app/my-groups/page.tsx",
                                                        lineNumber: 688,
                                                        columnNumber: 27
                                                    }, this)
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/my-groups/page.tsx",
                                                    lineNumber: 687,
                                                    columnNumber: 25
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/my-groups/page.tsx",
                                                lineNumber: 686,
                                                columnNumber: 48
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                ref: messagesEndRef
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/my-groups/page.tsx",
                                                lineNumber: 701,
                                                columnNumber: 21
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/app/my-groups/page.tsx",
                                        lineNumber: 659,
                                        columnNumber: 19
                                    }, this),
                                    replyingTo && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "px-4 py-2 bg-white/50 dark:bg-[#003535]/50 border-t border-white/30 dark:border-[#004a4a]/30",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "flex items-center justify-between",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "flex items-center gap-2",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            className: "text-xs text-[#6f787d] dark:text-[#bfc8cd]",
                                                            children: [
                                                                "Replying to ",
                                                                replyingTo.sender?.name || 'Unknown'
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/app/my-groups/page.tsx",
                                                            lineNumber: 708,
                                                            columnNumber: 27
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            className: "text-xs text-[#002020] dark:text-[#e7fffe] truncate max-w-50",
                                                            children: replyingTo.encrypted_content || '📷 Image'
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/app/my-groups/page.tsx",
                                                            lineNumber: 711,
                                                            columnNumber: 27
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/app/my-groups/page.tsx",
                                                    lineNumber: 707,
                                                    columnNumber: 25
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                    onClick: ()=>setReplyingTo(null),
                                                    className: "p-1 hover:bg-red-100/50 rounded-full text-red-500",
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "material-symbols-outlined text-sm",
                                                        children: "close"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/my-groups/page.tsx",
                                                        lineNumber: 716,
                                                        columnNumber: 27
                                                    }, this)
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/my-groups/page.tsx",
                                                    lineNumber: 715,
                                                    columnNumber: 25
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/app/my-groups/page.tsx",
                                            lineNumber: 706,
                                            columnNumber: 23
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/my-groups/page.tsx",
                                        lineNumber: 705,
                                        columnNumber: 34
                                    }, this),
                                    imagePreview && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "px-4 py-2 bg-white/50 dark:bg-[#003535]/50 border-t border-white/30 dark:border-[#004a4a]/30",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "flex items-center gap-3",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "relative w-12 h-12 rounded-lg overflow-hidden",
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                                        src: imagePreview,
                                                        alt: "Preview",
                                                        fill: true,
                                                        className: "object-cover"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/my-groups/page.tsx",
                                                        lineNumber: 725,
                                                        columnNumber: 27
                                                    }, this)
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/my-groups/page.tsx",
                                                    lineNumber: 724,
                                                    columnNumber: 25
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "flex-1 min-w-0",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                            className: "text-xs font-medium text-[#002020] dark:text-[#e7fffe] truncate",
                                                            children: selectedImage?.name
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/app/my-groups/page.tsx",
                                                            lineNumber: 728,
                                                            columnNumber: 27
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                            className: "text-[10px] text-[#6f787d] dark:text-[#bfc8cd]",
                                                            children: "Ready to upload"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/app/my-groups/page.tsx",
                                                            lineNumber: 729,
                                                            columnNumber: 27
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/app/my-groups/page.tsx",
                                                    lineNumber: 727,
                                                    columnNumber: 25
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                    onClick: handleRemoveImage,
                                                    className: "p-1 hover:bg-red-100/50 rounded-full text-red-500",
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "material-symbols-outlined text-sm",
                                                        children: "close"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/my-groups/page.tsx",
                                                        lineNumber: 732,
                                                        columnNumber: 27
                                                    }, this)
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/my-groups/page.tsx",
                                                    lineNumber: 731,
                                                    columnNumber: 25
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/app/my-groups/page.tsx",
                                            lineNumber: 723,
                                            columnNumber: 23
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/my-groups/page.tsx",
                                        lineNumber: 722,
                                        columnNumber: 36
                                    }, this),
                                    showEmojiPicker && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        ref: emojiPickerRef,
                                        className: "absolute bottom-20 right-4 z-50",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "shadow-2xl rounded-2xl overflow-hidden border border-white/20",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(EmojiPicker, {
                                                onEmojiClick: handleEmojiSelect,
                                                autoFocusSearch: false,
                                                theme: isDarkMode ? __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$emoji$2d$picker$2d$react$2f$dist$2f$emoji$2d$picker$2d$react$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Theme"].DARK : __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$emoji$2d$picker$2d$react$2f$dist$2f$emoji$2d$picker$2d$react$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Theme"].LIGHT
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/my-groups/page.tsx",
                                                lineNumber: 740,
                                                columnNumber: 25
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/my-groups/page.tsx",
                                            lineNumber: 739,
                                            columnNumber: 23
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/my-groups/page.tsx",
                                        lineNumber: 738,
                                        columnNumber: 39
                                    }, this),
                                    showPollTypeMenu && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        ref: pollMenuRef,
                                        className: "absolute bottom-20 right-4 bg-white/90 dark:bg-[#004040]/90 backdrop-blur-xl rounded-2xl p-3 w-52 shadow-xl border border-white/30 dark:border-[#004a4a]/30 z-50",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "text-[10px] font-bold px-2 py-1 text-[#6f787d] dark:text-[#bfc8cd] uppercase tracking-widest",
                                                children: "Create Poll"
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/my-groups/page.tsx",
                                                lineNumber: 746,
                                                columnNumber: 23
                                            }, this),
                                            [
                                                {
                                                    value: 'kick_member',
                                                    label: '🚫 Kick Member',
                                                    desc: 'Vote to remove someone'
                                                },
                                                {
                                                    value: 'make_admin',
                                                    label: '⭐ Make Admin',
                                                    desc: 'Promote a member'
                                                },
                                                {
                                                    value: 'remove_admin',
                                                    label: '🔻 Remove Admin',
                                                    desc: 'Demote an admin'
                                                },
                                                {
                                                    value: 'General',
                                                    label: '🗳️ General Poll',
                                                    desc: 'Ask anything'
                                                }
                                            ].map((opt)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                    onClick: ()=>{
                                                        setSelectedPollType(opt.value);
                                                        setShowPollTypeMenu(false);
                                                        setShowCreatePoll(true);
                                                    },
                                                    className: "w-full text-left px-3 py-2 rounded-xl transition-all hover:bg-[#87ceeb]/20 dark:hover:bg-[#0c6780]/20 flex flex-col gap-0.5",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            className: "text-xs font-bold text-[#002020] dark:text-[#e7fffe]",
                                                            children: opt.label
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/app/my-groups/page.tsx",
                                                            lineNumber: 768,
                                                            columnNumber: 27
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            className: "text-[9px] text-[#6f787d] dark:text-[#bfc8cd]",
                                                            children: opt.desc
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/app/my-groups/page.tsx",
                                                            lineNumber: 769,
                                                            columnNumber: 27
                                                        }, this)
                                                    ]
                                                }, opt.value, true, {
                                                    fileName: "[project]/src/app/my-groups/page.tsx",
                                                    lineNumber: 763,
                                                    columnNumber: 31
                                                }, this))
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/app/my-groups/page.tsx",
                                        lineNumber: 745,
                                        columnNumber: 40
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("footer", {
                                        className: "p-0 bg-white/30 dark:bg-[#003535]/30 backdrop-blur-md border-t border-white/30 dark:border-[#004a4a]/30 shrink-0",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                ref: fileInputRef,
                                                type: "file",
                                                accept: "image/*",
                                                onChange: handleImageSelect,
                                                className: "hidden"
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/my-groups/page.tsx",
                                                lineNumber: 775,
                                                columnNumber: 21
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("form", {
                                                onSubmit: handleSendMessage,
                                                className: "flex items-center gap-2 p-3",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "flex items-center gap-1",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                type: "button",
                                                                onClick: ()=>fileInputRef.current?.click(),
                                                                disabled: sending || uploadingImage,
                                                                className: "w-10 h-10 rounded-xl bg-white/50 dark:bg-[#004040]/50 flex items-center justify-center text-[#6f787d] dark:text-[#bfc8cd] hover:bg-[#87ceeb]/20 dark:hover:bg-[#0c6780]/30 transition-colors disabled:opacity-50",
                                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                    className: "material-symbols-outlined",
                                                                    children: "attach_file"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/app/my-groups/page.tsx",
                                                                    lineNumber: 780,
                                                                    columnNumber: 27
                                                                }, this)
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/app/my-groups/page.tsx",
                                                                lineNumber: 779,
                                                                columnNumber: 25
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                type: "button",
                                                                onClick: ()=>setShowEmojiPicker(!showEmojiPicker),
                                                                disabled: sending || uploadingImage,
                                                                className: "w-10 h-10 rounded-xl bg-white/50 dark:bg-[#004040]/50 flex items-center justify-center text-[#6f787d] dark:text-[#bfc8cd] hover:bg-[#87ceeb]/20 dark:hover:bg-[#0c6780]/30 transition-colors disabled:opacity-50",
                                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                    className: "material-symbols-outlined",
                                                                    children: "sentiment_satisfied"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/app/my-groups/page.tsx",
                                                                    lineNumber: 783,
                                                                    columnNumber: 27
                                                                }, this)
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/app/my-groups/page.tsx",
                                                                lineNumber: 782,
                                                                columnNumber: 25
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                type: "button",
                                                                onClick: ()=>setShowPollTypeMenu(!showPollTypeMenu),
                                                                className: `w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${showPollTypeMenu ? 'bg-[#87ceeb]/30 text-[#0c6780]' : 'bg-white/50 dark:bg-[#004040]/50 text-[#6f787d] dark:text-[#bfc8cd] hover:bg-[#87ceeb]/20 dark:hover:bg-[#0c6780]/30'}`,
                                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                    className: "material-symbols-outlined",
                                                                    children: "poll"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/app/my-groups/page.tsx",
                                                                    lineNumber: 786,
                                                                    columnNumber: 27
                                                                }, this)
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/app/my-groups/page.tsx",
                                                                lineNumber: 785,
                                                                columnNumber: 25
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/app/my-groups/page.tsx",
                                                        lineNumber: 778,
                                                        columnNumber: 23
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                        ref: messageInputRef,
                                                        type: "text",
                                                        value: newMessage,
                                                        onChange: handleMessageChange,
                                                        placeholder: uploadingImage ? 'Uploading image...' : 'Type a message...',
                                                        className: "flex-1 bg-white/80 dark:bg-[#004040]/80 border-none rounded-xl py-2.5 px-4 text-sm focus:ring-2 focus:ring-[#87ceeb] dark:focus:ring-[#0c6780] outline-none dark:text-[#e7fffe] dark:placeholder-[#6f787d]",
                                                        disabled: sending || uploadingImage
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/my-groups/page.tsx",
                                                        lineNumber: 790,
                                                        columnNumber: 23
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                        type: "submit",
                                                        disabled: sending || uploadingImage || !newMessage.trim() && !selectedImage,
                                                        className: "w-10 h-10 rounded-xl bg-linear-to-r from-[#87ceeb] via-[#e6e6fa] to-[#ffb6c1] dark:from-[#0c6780] dark:via-[#4a6368] dark:to-[#0c6780] flex items-center justify-center text-[#002020] dark:text-white hover:opacity-90 transition-opacity disabled:opacity-50",
                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            className: "material-symbols-outlined",
                                                            children: "send"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/app/my-groups/page.tsx",
                                                            lineNumber: 793,
                                                            columnNumber: 25
                                                        }, this)
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/my-groups/page.tsx",
                                                        lineNumber: 792,
                                                        columnNumber: 23
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/app/my-groups/page.tsx",
                                                lineNumber: 777,
                                                columnNumber: 21
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/app/my-groups/page.tsx",
                                        lineNumber: 774,
                                        columnNumber: 19
                                    }, this)
                                ]
                            }, void 0, true) : // Empty State
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex-1 flex items-center justify-center",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "text-center",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "w-20 h-20 rounded-full bg-[#87ceeb]/20 dark:bg-[#0c6780]/20 flex items-center justify-center mb-4 mx-auto",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "material-symbols-outlined text-4xl text-[#0c6780] dark:text-[#87ceeb]",
                                                children: "groups"
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/my-groups/page.tsx",
                                                lineNumber: 802,
                                                columnNumber: 23
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/my-groups/page.tsx",
                                            lineNumber: 801,
                                            columnNumber: 21
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "text-lg font-semibold text-[#002020] dark:text-[#e7fffe] mb-1",
                                            children: "Select a group"
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/my-groups/page.tsx",
                                            lineNumber: 804,
                                            columnNumber: 21
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "text-sm text-[#6f787d] dark:text-[#bfc8cd]",
                                            children: "Choose a group to start chatting"
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/my-groups/page.tsx",
                                            lineNumber: 805,
                                            columnNumber: 21
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/app/my-groups/page.tsx",
                                    lineNumber: 800,
                                    columnNumber: 19
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/src/app/my-groups/page.tsx",
                                lineNumber: 799,
                                columnNumber: 13
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/src/app/my-groups/page.tsx",
                            lineNumber: 577,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/app/my-groups/page.tsx",
                    lineNumber: 509,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/app/my-groups/page.tsx",
                lineNumber: 508,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/src/app/my-groups/page.tsx",
            lineNumber: 507,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/src/app/my-groups/page.tsx",
        lineNumber: 506,
        columnNumber: 10
    }, this);
}
_s1(MyGroupsPage, "vhTeI2Etqz6EZ/Qao5wCwvN8U0o=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$contexts$2f$SocketContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSocket"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$contexts$2f$ToastContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useToast"]
    ];
});
_c2 = MyGroupsPage;
var _c, _c1, _c2;
__turbopack_context__.k.register(_c, "EmojiPicker");
__turbopack_context__.k.register(_c1, "GroupOnlineBadge");
__turbopack_context__.k.register(_c2, "MyGroupsPage");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=src_4d695ca0._.js.map