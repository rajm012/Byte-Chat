(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/src/services/moderation.service.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "blockUser",
    ()=>blockUser,
    "checkIfBlocked",
    ()=>checkIfBlocked,
    "deleteReport",
    ()=>deleteReport,
    "getBlockedUsers",
    ()=>getBlockedUsers,
    "getMyReports",
    ()=>getMyReports,
    "reportGroup",
    ()=>reportGroup,
    "reportUser",
    ()=>reportUser,
    "revealAnonymousIdentity",
    ()=>revealAnonymousIdentity,
    "unblockUser",
    ()=>unblockUser
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
// Block and Report Service for Frontend
// Add this to: frontend/src/services/moderation.service.ts
const API_BASE = ("TURBOPACK compile-time value", "http://localhost:3001");
const blockUser = async (blockedUserId, reason)=>{
    const response = await fetch(`${API_BASE}/api/moderation/block`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({
            blockedUserId,
            reason
        })
    });
    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to block user');
    }
    return response.json();
};
const unblockUser = async (blockedUserId)=>{
    const response = await fetch(`${API_BASE}/api/moderation/unblock`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({
            blockedUserId
        })
    });
    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to unblock user');
    }
    return response.json();
};
const getBlockedUsers = async ()=>{
    const response = await fetch(`${API_BASE}/api/moderation/blocked-users`, {
        method: 'GET',
        credentials: 'include'
    });
    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to fetch blocked users');
    }
    return response.json();
};
const checkIfBlocked = async (otherUserId)=>{
    const response = await fetch(`${API_BASE}/api/moderation/check-blocked/${otherUserId}`, {
        method: 'GET',
        credentials: 'include'
    });
    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to check block status');
    }
    return response.json();
};
const reportUser = async (data)=>{
    const response = await fetch(`${API_BASE}/api/moderation/report/user`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify(data)
    });
    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to submit report');
    }
    return response.json();
};
const reportGroup = async (data)=>{
    // console.log('📤 SENDING GROUP REPORT:');
    // console.log('  - URL:', `${API_BASE}/api/moderation/report/group`);
    // console.log('  - Token:', token ? `${token.substring(0, 20)}...` : 'MISSING');
    // console.log('  - Data:', data);
    const response = await fetch(`${API_BASE}/api/moderation/report/group`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify(data)
    });
    // console.log('  - Response Status:', response.status, response.statusText);
    if (!response.ok) {
        const error = await response.json();
        console.log('[ERROR] Error:', error);
        throw new Error(error.message || 'Failed to submit report');
    }
    const result = await response.json();
    // console.log('  ✅ Success:', result);
    return result;
};
const getMyReports = async ()=>{
    const response = await fetch(`${API_BASE}/api/moderation/reports/my`, {
        method: 'GET',
        credentials: 'include'
    });
    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to fetch reports');
    }
    return response.json();
};
const deleteReport = async (reportId)=>{
    const response = await fetch(`${API_BASE}/api/moderation/report/${reportId}`, {
        method: 'DELETE',
        credentials: 'include'
    });
    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to delete report');
    }
    return response.json();
};
const revealAnonymousIdentity = async (conversationId)=>{
    const response = await fetch(`${API_BASE}/api/anonymous-chat/reveal/${conversationId}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        credentials: 'include'
    });
    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to reveal identity');
    }
    return response.json();
};
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/ModerationComponents.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "AnonymousMessageBadge",
    ()=>AnonymousMessageBadge,
    "BlockUserButton",
    ()=>BlockUserButton,
    "ReportGroupButton",
    ()=>ReportGroupButton,
    "ReportUserButton",
    ()=>ReportUserButton,
    "RevealIdentityButton",
    ()=>RevealIdentityButton
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/compiler-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$moderation$2e$service$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/services/moderation.service.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$contexts$2f$ToastContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/contexts/ToastContext.tsx [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature(), _s2 = __turbopack_context__.k.signature(), _s3 = __turbopack_context__.k.signature();
// ==================== Block User Component ====================
'use client';
;
;
;
;
function BlockUserButton({ userId, userName, isBlocked, onBlockStatusChange }) {
    _s();
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [showReasonDialog, setShowReasonDialog] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [reason, setReason] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('');
    const toast = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$contexts$2f$ToastContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useToast"])();
    const handleBlock = async ()=>{
        if (!reason.trim()) {
            toast.warning('Please enter a reason for blocking');
            return;
        }
        setLoading(true);
        try {
            await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$moderation$2e$service$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["blockUser"])(userId, reason);
            toast.success(`Successfully blocked ${userName}`);
            setShowReasonDialog(false);
            setReason('');
            onBlockStatusChange?.();
        } catch (error) {
            if (typeof error === 'object' && error !== null && 'message' in error && typeof error.message === 'string') {
                toast.error(error.message);
            } else {
                toast.error('Failed to block user');
            }
        } finally{
            setLoading(false);
        }
    };
    const handleUnblock = async ()=>{
        if (!confirm(`Are you sure you want to unblock ${userName}?`)) return;
        setLoading(true);
        try {
            const response = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$moderation$2e$service$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["unblockUser"])(userId);
            // Check if user can message now
            if (response?.data?.canMessageNow) {
                toast.success(`Successfully unblocked ${userName}. You can now send messages to them.`);
            } else {
                toast.info(`Successfully unblocked ${userName}. However, they have also blocked you, so you cannot message them yet.`);
            }
            onBlockStatusChange?.();
        } catch (error_0) {
            if (typeof error_0 === 'object' && error_0 !== null && 'message' in error_0 && typeof error_0.message === 'string') {
                toast.error(error_0.message);
            } else {
                toast.error('Failed to unblock user');
            }
        } finally{
            setLoading(false);
        }
    };
    if (isBlocked) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
            onClick: handleUnblock,
            disabled: loading,
            className: "w-full px-4 py-2 rounded-xl text-sm font-semibold glass transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed",
            style: {
                color: 'var(--body)'
            },
            children: loading ? '⏳ Unblocking...' : '✓ Unblock User'
        }, void 0, false, {
            fileName: "[project]/src/components/ModerationComponents.tsx",
            lineNumber: 75,
            columnNumber: 12
        }, this);
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                onClick: ()=>setShowReasonDialog(true),
                className: "w-full px-4 py-2 rounded-xl text-sm font-semibold glass transition-all hover:scale-105",
                style: {
                    color: '#EF4444'
                },
                children: "🚫 Block User"
            }, void 0, false, {
                fileName: "[project]/src/components/ModerationComponents.tsx",
                lineNumber: 82,
                columnNumber: 7
            }, this),
            showReasonDialog && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "fixed inset-0 z-50 flex items-center justify-center p-5",
                style: {
                    background: 'rgba(0,0,0,0.5)',
                    backdropFilter: 'blur(8px)'
                },
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "glass-strong rounded-3xl p-8 w-full max-w-md animate-scale-in",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                            className: "text-xl font-extrabold mb-4",
                            style: {
                                color: 'var(--heading)'
                            },
                            children: [
                                "Block ",
                                userName
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/ModerationComponents.tsx",
                            lineNumber: 93,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("textarea", {
                            value: reason,
                            onChange: (e)=>setReason(e.target.value),
                            placeholder: "Why are you blocking this user? (optional)",
                            className: "input-romance resize-none mb-4 h-24"
                        }, void 0, false, {
                            fileName: "[project]/src/components/ModerationComponents.tsx",
                            lineNumber: 96,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex gap-3",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    onClick: ()=>setShowReasonDialog(false),
                                    className: "flex-1 px-4 py-3 rounded-2xl text-sm font-semibold glass transition-all hover:scale-105",
                                    style: {
                                        color: 'var(--body)'
                                    },
                                    children: "Cancel"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/ModerationComponents.tsx",
                                    lineNumber: 98,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    onClick: handleBlock,
                                    disabled: loading,
                                    className: "flex-1 px-4 py-3 rounded-2xl text-sm font-semibold text-white disabled:opacity-50 disabled:cursor-not-allowed",
                                    style: {
                                        background: 'linear-gradient(135deg, #EF4444, #DC2626)'
                                    },
                                    children: loading ? '⏳ Blocking...' : '🚫 Block'
                                }, void 0, false, {
                                    fileName: "[project]/src/components/ModerationComponents.tsx",
                                    lineNumber: 103,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/ModerationComponents.tsx",
                            lineNumber: 97,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/ModerationComponents.tsx",
                    lineNumber: 92,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/components/ModerationComponents.tsx",
                lineNumber: 88,
                columnNumber: 28
            }, this)
        ]
    }, void 0, true);
}
_s(BlockUserButton, "Qg+bThSIoPz+/0j7XE91YY0Nd94=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$contexts$2f$ToastContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useToast"]
    ];
});
_c = BlockUserButton;
;
const REPORT_TYPES = [
    {
        value: 'spam',
        label: 'Spam'
    },
    {
        value: 'harassment',
        label: 'Harassment'
    },
    {
        value: 'inappropriate_content',
        label: 'Inappropriate Content'
    },
    {
        value: 'impersonating',
        label: 'Impersonating'
    },
    {
        value: 'fake_profile',
        label: 'Fake Profile'
    },
    {
        value: 'other',
        label: 'Other'
    }
];
function ReportUserButton({ userId, userName, messageId }) {
    _s1();
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [showReportDialog, setShowReportDialog] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [reportType, setReportType] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('spam');
    const [description, setDescription] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('');
    const toast = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$contexts$2f$ToastContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useToast"])();
    const handleReport = async ()=>{
        if (!description.trim()) {
            toast.warning('Please provide a description');
            return;
        }
        setLoading(true);
        try {
            // Build comprehensive description with context
            const contextualDescription = `
        === REPORT DETAILS ===
        Report Type: ${reportType}
        User Description: ${description}

        === REPORTED USER INFO ===
        User ID: ${userId}
        User Name: ${userName}
        ${messageId ? `\n=== MESSAGE CONTEXT ===\nMessage ID: ${messageId}` : ''}

        === TIMESTAMP ===
        Reported At: ${new Date().toISOString()}
        Reported At (Local): ${new Date().toLocaleString()}
        `.trim();
            const data = {
                reportedUserId: userId,
                reportType: reportType,
                description: contextualDescription,
                messageId
            };
            await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$moderation$2e$service$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["reportUser"])(data);
            toast.success('Report submitted successfully. Our team will review it shortly.');
            setShowReportDialog(false);
            setDescription('');
            setReportType('spam');
        } catch (error) {
            if (typeof error === 'object' && error !== null && 'message' in error && typeof error.message === 'string') {
                toast.error(error.message);
            } else {
                toast.error('Failed to submit report');
            }
        } finally{
            setLoading(false);
        }
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                onClick: ()=>setShowReportDialog(true),
                className: "px-4 py-2 bg-yellow-600 text-white rounded hover:bg-yellow-700",
                children: "Report User"
            }, void 0, false, {
                fileName: "[project]/src/components/ModerationComponents.tsx",
                lineNumber: 198,
                columnNumber: 7
            }, this),
            showReportDialog && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "bg-white p-6 rounded-lg shadow-xl max-w-md w-full",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                            className: "text-xl font-bold mb-4",
                            children: [
                                "Report ",
                                userName
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/ModerationComponents.tsx",
                            lineNumber: 204,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "mb-4",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                    className: "block text-sm font-medium mb-2",
                                    children: "Report Type"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/ModerationComponents.tsx",
                                    lineNumber: 207,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                    value: reportType,
                                    onChange: (e)=>setReportType(e.target.value),
                                    className: "w-full border rounded p-2",
                                    children: REPORT_TYPES.map((type)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                            value: type.value,
                                            children: type.label
                                        }, type.value, false, {
                                            fileName: "[project]/src/components/ModerationComponents.tsx",
                                            lineNumber: 209,
                                            columnNumber: 43
                                        }, this))
                                }, void 0, false, {
                                    fileName: "[project]/src/components/ModerationComponents.tsx",
                                    lineNumber: 208,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/ModerationComponents.tsx",
                            lineNumber: 206,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "mb-4",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                    className: "block text-sm font-medium mb-2",
                                    children: "Description *"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/ModerationComponents.tsx",
                                    lineNumber: 216,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("textarea", {
                                    value: description,
                                    onChange: (e_0)=>setDescription(e_0.target.value),
                                    placeholder: "Please provide details about this report...",
                                    className: "w-full border rounded p-2 h-32",
                                    required: true
                                }, void 0, false, {
                                    fileName: "[project]/src/components/ModerationComponents.tsx",
                                    lineNumber: 217,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/ModerationComponents.tsx",
                            lineNumber: 215,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex gap-2 justify-end",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    onClick: ()=>setShowReportDialog(false),
                                    className: "px-4 py-2 bg-gray-300 rounded hover:bg-gray-400",
                                    children: "Cancel"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/ModerationComponents.tsx",
                                    lineNumber: 221,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    onClick: handleReport,
                                    disabled: loading,
                                    className: "px-4 py-2 bg-yellow-600 text-white rounded hover:bg-yellow-700 disabled:opacity-50",
                                    children: loading ? 'Submitting...' : 'Submit Report'
                                }, void 0, false, {
                                    fileName: "[project]/src/components/ModerationComponents.tsx",
                                    lineNumber: 224,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/ModerationComponents.tsx",
                            lineNumber: 220,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/ModerationComponents.tsx",
                    lineNumber: 203,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/components/ModerationComponents.tsx",
                lineNumber: 202,
                columnNumber: 28
            }, this)
        ]
    }, void 0, true);
}
_s1(ReportUserButton, "K1HHx0lz9Ro8qcGqxhv9/F+YgB4=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$contexts$2f$ToastContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useToast"]
    ];
});
_c1 = ReportUserButton;
;
function RevealIdentityButton({ conversationId, isSender, onReveal }) {
    _s2();
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const toast = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$contexts$2f$ToastContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useToast"])();
    if (!isSender) {
        return null; // Only sender can see the button
    }
    const handleReveal = async ()=>{
        if (!confirm('Are you sure you want to reveal your identity? This action cannot be undone.')) {
            return;
        }
        setLoading(true);
        try {
            const result = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$moderation$2e$service$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["revealAnonymousIdentity"])(conversationId);
            toast.success(result.message);
            onReveal?.(result.data);
        } catch (error) {
            if (typeof error === 'object' && error !== null && 'message' in error && typeof error.message === 'string') {
                toast.error(error.message);
            } else {
                toast.error('Failed to reveal identity');
            }
        } finally{
            setLoading(false);
        }
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
        onClick: handleReveal,
        disabled: loading,
        className: "px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2",
        children: loading ? 'Revealing...' : '🎭 Reveal My Identity'
    }, void 0, false, {
        fileName: "[project]/src/components/ModerationComponents.tsx",
        lineNumber: 273,
        columnNumber: 10
    }, this);
}
_s2(RevealIdentityButton, "hLQoEQe2TlddhwTrkmbdhwfo1vA=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$contexts$2f$ToastContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useToast"]
    ];
});
_c2 = RevealIdentityButton;
function ReportGroupButton({ groupId, groupName }) {
    _s3();
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [showReportDialog, setShowReportDialog] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [reportType, setReportType] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('spam');
    const [description, setDescription] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('');
    const toast = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$contexts$2f$ToastContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useToast"])();
    const handleReport = async ()=>{
        if (!description.trim()) {
            toast.warning('Please provide a description');
            return;
        }
        setLoading(true);
        try {
            // Build comprehensive description with context
            const contextualDescription = `
        === REPORT DETAILS ===
        Report Type: ${reportType}
        User Description: ${description}

        === REPORTED GROUP INFO ===
        Group ID: ${groupId}
        Group Name: ${groupName}

        === TIMESTAMP ===
        Reported At: ${new Date().toISOString()}
        Reported At (Local): ${new Date().toLocaleString()}
        `.trim();
            const data = {
                reportedGroupId: groupId,
                reportType: reportType,
                description: contextualDescription
            };
            await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$moderation$2e$service$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["reportGroup"])(data);
            toast.success('Report submitted successfully. Our team will review it shortly.');
            setShowReportDialog(false);
            setDescription('');
            setReportType('spam');
        } catch (error) {
            if (typeof error === 'object' && error !== null && 'message' in error && typeof error.message === 'string') {
                toast.error(error.message);
            } else {
                toast.error('Failed to submit report');
            }
        } finally{
            setLoading(false);
        }
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                onClick: ()=>setShowReportDialog(true),
                className: "px-6 py-3 rounded-2xl text-sm font-semibold glass transition-all hover:scale-105 flex items-center gap-2",
                style: {
                    color: '#F59E0B'
                },
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                        className: "w-4 h-4",
                        fill: "none",
                        stroke: "currentColor",
                        viewBox: "0 0 24 24",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                            strokeLinecap: "round",
                            strokeLinejoin: "round",
                            strokeWidth: 2,
                            d: "M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                        }, void 0, false, {
                            fileName: "[project]/src/components/ModerationComponents.tsx",
                            lineNumber: 341,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/components/ModerationComponents.tsx",
                        lineNumber: 340,
                        columnNumber: 9
                    }, this),
                    "Report Group"
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/ModerationComponents.tsx",
                lineNumber: 337,
                columnNumber: 7
            }, this),
            showReportDialog && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "fixed inset-0 z-50 flex items-center justify-center p-5",
                style: {
                    background: 'rgba(0,0,0,0.5)',
                    backdropFilter: 'blur(8px)'
                },
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "glass-strong rounded-3xl p-7 w-full max-w-md animate-scale-in",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                            className: "text-lg font-bold mb-5",
                            style: {
                                color: 'var(--heading)'
                            },
                            children: [
                                "Report ",
                                groupName,
                                " ⚠️"
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/ModerationComponents.tsx",
                            lineNumber: 351,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "space-y-4",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                            className: "block text-sm font-semibold mb-2",
                                            style: {
                                                color: 'var(--heading)'
                                            },
                                            children: "Report Type *"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/ModerationComponents.tsx",
                                            lineNumber: 357,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                            value: reportType,
                                            onChange: (e)=>setReportType(e.target.value),
                                            className: "select-romance w-full",
                                            children: REPORT_TYPES.map((type)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                    value: type.value,
                                                    children: type.label
                                                }, type.value, false, {
                                                    fileName: "[project]/src/components/ModerationComponents.tsx",
                                                    lineNumber: 361,
                                                    columnNumber: 45
                                                }, this))
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/ModerationComponents.tsx",
                                            lineNumber: 360,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/ModerationComponents.tsx",
                                    lineNumber: 356,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                            className: "block text-sm font-semibold mb-2",
                                            style: {
                                                color: 'var(--heading)'
                                            },
                                            children: "Description *"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/ModerationComponents.tsx",
                                            lineNumber: 368,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("textarea", {
                                            value: description,
                                            onChange: (e_0)=>setDescription(e_0.target.value),
                                            placeholder: "Please provide details about why you're reporting this group...",
                                            className: "input-romance resize-none h-32",
                                            required: true
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/ModerationComponents.tsx",
                                            lineNumber: 371,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/ModerationComponents.tsx",
                                    lineNumber: 367,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/ModerationComponents.tsx",
                            lineNumber: 355,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex gap-3 mt-5",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    onClick: ()=>setShowReportDialog(false),
                                    className: "flex-1 py-3 rounded-2xl text-sm font-semibold glass transition-all hover:scale-105",
                                    style: {
                                        color: 'var(--body)'
                                    },
                                    children: "Cancel"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/ModerationComponents.tsx",
                                    lineNumber: 376,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    onClick: handleReport,
                                    disabled: loading,
                                    className: "flex-1 py-3 rounded-2xl text-sm font-semibold text-white disabled:opacity-50 disabled:cursor-not-allowed",
                                    style: {
                                        background: 'linear-gradient(135deg, #F59E0B, #D97706)'
                                    },
                                    children: loading ? '⏳ Submitting...' : '🚨 Submit Report'
                                }, void 0, false, {
                                    fileName: "[project]/src/components/ModerationComponents.tsx",
                                    lineNumber: 381,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/ModerationComponents.tsx",
                            lineNumber: 375,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/ModerationComponents.tsx",
                    lineNumber: 350,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/components/ModerationComponents.tsx",
                lineNumber: 346,
                columnNumber: 28
            }, this)
        ]
    }, void 0, true);
}
_s3(ReportGroupButton, "K1HHx0lz9Ro8qcGqxhv9/F+YgB4=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$contexts$2f$ToastContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useToast"]
    ];
});
_c3 = ReportGroupButton;
function AnonymousMessageBadge(t0) {
    const $ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$compiler$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["c"])(2);
    if ($[0] !== "114cb977cdcc13fa01d20fdcbca68da61b5f811c03710c55337e2c3bc9424cba") {
        for(let $i = 0; $i < 2; $i += 1){
            $[$i] = Symbol.for("react.memo_cache_sentinel");
        }
        $[0] = "114cb977cdcc13fa01d20fdcbca68da61b5f811c03710c55337e2c3bc9424cba";
    }
    const { wasAnonymous } = t0;
    if (!wasAnonymous) {
        return null;
    }
    let t1;
    if ($[1] === Symbol.for("react.memo_cache_sentinel")) {
        t1 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
            className: "inline-flex items-center px-2 py-1 text-xs bg-purple-100 text-purple-800 rounded-full",
            title: "This message was sent anonymously",
            children: "⭐ Previously Anonymous"
        }, void 0, false, {
            fileName: "[project]/src/components/ModerationComponents.tsx",
            lineNumber: 413,
            columnNumber: 10
        }, this);
        $[1] = t1;
    } else {
        t1 = $[1];
    }
    return t1;
}
_c4 = AnonymousMessageBadge;
var _c, _c1, _c2, _c3, _c4;
__turbopack_context__.k.register(_c, "BlockUserButton");
__turbopack_context__.k.register(_c1, "ReportUserButton");
__turbopack_context__.k.register(_c2, "RevealIdentityButton");
__turbopack_context__.k.register(_c3, "ReportGroupButton");
__turbopack_context__.k.register(_c4, "AnonymousMessageBadge");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/app/profile/[rollNo]/page.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>ViewProfile
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/client/app-dir/link.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ModerationComponents$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/ModerationComponents.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$moderation$2e$service$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/services/moderation.service.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/image.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$qrcode$2f$lib$2f$browser$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/qrcode/lib/browser.js [app-client] (ecmascript)");
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
function ViewProfile() {
    _s();
    const params = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useParams"])();
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"])();
    const rollNo = params.rollNo;
    // need proper error handling
    const [profile, setProfile] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [isLoading, setIsLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(true);
    const [error, setError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('');
    const [isOwnProfile, setIsOwnProfile] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [isBlocked, setIsBlocked] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [, setBlockMessage] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('');
    const [, setBlockedByOther] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [navigating, setNavigating] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [showQRModal, setShowQRModal] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [qrCodeUrl, setQrCodeUrl] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('');
    // const canvasRef = useRef<HTMLCanvasElement>(null);
    const fetchProfile = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "ViewProfile.useCallback[fetchProfile]": async ()=>{
            try {
                // Fetch current user's profile to check if it's their own profile
                const { API_BASE_URL } = await __turbopack_context__.A("[project]/src/services/apiBase.ts [app-client] (ecmascript, async loader)");
                const myProfileResponse = await fetch(`${API_BASE_URL}/api/profile/me`, {
                    credentials: 'include'
                });
                const myProfileData = await myProfileResponse.json();
                if (myProfileData.success) {
                    setIsOwnProfile(myProfileData.data.roll_no.toUpperCase() === rollNo.toUpperCase());
                }
                // Fetch the requested profile
                const response = await fetch(`${API_BASE_URL}/api/profile/${rollNo}`, {
                    credentials: 'include'
                });
                const data = await response.json();
                if (response.status === 403) {
                    // User is blocked by the profile owner
                    setBlockedByOther(true);
                    setError(data.message || 'This user has blocked you');
                    setIsLoading(false);
                    return;
                }
                if (data.success) {
                    setProfile(data.data);
                    // Check if current user blocked this profile
                    if (data.blocked) {
                        setBlockMessage(data.blockMessage || 'You have blocked this user');
                    }
                    // Check block status if not own profile
                    if (!isOwnProfile && data.data.user_id) {
                        try {
                            const blockStatus = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$moderation$2e$service$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["checkIfBlocked"])(data.data.user_id);
                            setIsBlocked(blockStatus.data.isBlocked);
                        } catch (err_0) {
                            console.error('Failed to check block status:', err_0);
                        }
                    }
                } else {
                    setError(data.message || 'Failed to fetch profile');
                }
            } catch (err) {
                setError('Failed to load profile');
                console.log(err);
            } finally{
                setIsLoading(false);
            }
        }
    }["ViewProfile.useCallback[fetchProfile]"], [
        rollNo,
        isOwnProfile
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "ViewProfile.useEffect": ()=>{
            fetchProfile();
        }
    }["ViewProfile.useEffect"], [
        fetchProfile
    ]);
    const handleBlockStatusChange = ()=>{
        fetchProfile(); // Refresh profile after blocking/unblocking
    };
    const handleStartChat = (userId, isAnonymous = false)=>{
        if (navigating) return; // Prevent double-clicks
        setNavigating(true);
        router.push(`/chat/new?userId=${userId}&anonymous=${isAnonymous}`);
    };
    const handleShareProfile = async ()=>{
        try {
            const profileUrl = `${window.location.origin}/profile/${rollNo}`;
            const qrDataUrl = await __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$qrcode$2f$lib$2f$browser$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].toDataURL(profileUrl, {
                width: 400,
                margin: 2,
                color: {
                    dark: '#1a1a2e',
                    light: '#FFFFFF'
                },
                errorCorrectionLevel: 'H'
            });
            setQrCodeUrl(qrDataUrl);
            setShowQRModal(true);
        } catch (error_0) {
            console.error('Failed to generate QR code:', error_0);
        }
    };
    if (isLoading) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8 lg:p-12 bg-black/40 backdrop-blur-md dark:bg-black/60",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "relative w-full max-w-5xl h-[75vh] md:h-160 bg-surface-container-lowest dark:bg-surface-container rounded-3xl shadow-[0_40px_80px_rgba(0,32,32,0.2)] dark:shadow-[0_40px_80px_rgba(0,0,0,0.4)] flex flex-col overflow-hidden",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        className: "absolute top-6 right-6 z-20 w-12 h-12 flex items-center justify-center rounded-full bg-white/80 dark:bg-[#004a4a]/80 animate-pulse",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            className: "material-symbols-outlined text-3xl text-transparent",
                            children: "close"
                        }, void 0, false, {
                            fileName: "[project]/src/app/profile/[rollNo]/page.tsx",
                            lineNumber: 143,
                            columnNumber: 13
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/app/profile/[rollNo]/page.tsx",
                        lineNumber: 142,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex-1 flex flex-col md:flex-row overflow-hidden",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "w-full md:w-5/12 relative h-64 md:h-full bg-surface-container-low overflow-hidden",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "w-full h-full bg-surface-container-high animate-pulse"
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/profile/[rollNo]/page.tsx",
                                        lineNumber: 150,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "absolute bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-black/40 to-transparent",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "flex items-center gap-3",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "w-3 h-3 bg-emerald-400/30 rounded-full animate-pulse"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/profile/[rollNo]/page.tsx",
                                                    lineNumber: 154,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "h-6 w-24 bg-white/30 rounded animate-pulse"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/profile/[rollNo]/page.tsx",
                                                    lineNumber: 155,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/app/profile/[rollNo]/page.tsx",
                                            lineNumber: 153,
                                            columnNumber: 17
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/profile/[rollNo]/page.tsx",
                                        lineNumber: 152,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/profile/[rollNo]/page.tsx",
                                lineNumber: 149,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "w-full md:w-7/12 p-6 md:p-10 flex flex-col overflow-y-auto",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "space-y-3 mb-8",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "h-8 w-48 bg-surface-container-high rounded animate-pulse"
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/profile/[rollNo]/page.tsx",
                                                lineNumber: 164,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "flex items-center gap-3",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "h-5 w-32 bg-surface-container-high rounded animate-pulse"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/profile/[rollNo]/page.tsx",
                                                        lineNumber: 166,
                                                        columnNumber: 19
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "h-5 w-20 bg-surface-container-high rounded animate-pulse"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/profile/[rollNo]/page.tsx",
                                                        lineNumber: 167,
                                                        columnNumber: 19
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/app/profile/[rollNo]/page.tsx",
                                                lineNumber: 165,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/app/profile/[rollNo]/page.tsx",
                                        lineNumber: 163,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "space-y-2 mb-8",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "h-4 w-full bg-surface-container-high rounded animate-pulse"
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/profile/[rollNo]/page.tsx",
                                                lineNumber: 173,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "h-4 w-5/6 bg-surface-container-high rounded animate-pulse"
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/profile/[rollNo]/page.tsx",
                                                lineNumber: 174,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "h-4 w-4/6 bg-surface-container-high rounded animate-pulse"
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/profile/[rollNo]/page.tsx",
                                                lineNumber: 175,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/app/profile/[rollNo]/page.tsx",
                                        lineNumber: 172,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "grid grid-cols-3 gap-4 mb-8",
                                        children: Array.from({
                                            length: 3
                                        }).map((_, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "bg-surface-container-low rounded-2xl p-4 text-center space-y-2",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "h-8 w-12 bg-surface-container-high rounded mx-auto animate-pulse"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/profile/[rollNo]/page.tsx",
                                                        lineNumber: 183,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "h-3 w-16 bg-surface-container-high rounded mx-auto animate-pulse"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/profile/[rollNo]/page.tsx",
                                                        lineNumber: 184,
                                                        columnNumber: 21
                                                    }, this)
                                                ]
                                            }, i, true, {
                                                fileName: "[project]/src/app/profile/[rollNo]/page.tsx",
                                                lineNumber: 182,
                                                columnNumber: 32
                                            }, this))
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/profile/[rollNo]/page.tsx",
                                        lineNumber: 179,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex gap-3 mt-auto",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "flex-1 h-12 bg-surface-container-high rounded-xl animate-pulse"
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/profile/[rollNo]/page.tsx",
                                                lineNumber: 190,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "flex-1 h-12 bg-surface-container-high rounded-xl animate-pulse"
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/profile/[rollNo]/page.tsx",
                                                lineNumber: 191,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "w-12 h-12 bg-surface-container-high rounded-xl animate-pulse"
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/profile/[rollNo]/page.tsx",
                                                lineNumber: 192,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/app/profile/[rollNo]/page.tsx",
                                        lineNumber: 189,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/profile/[rollNo]/page.tsx",
                                lineNumber: 161,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/profile/[rollNo]/page.tsx",
                        lineNumber: 147,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/app/profile/[rollNo]/page.tsx",
                lineNumber: 140,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/src/app/profile/[rollNo]/page.tsx",
            lineNumber: 138,
            columnNumber: 12
        }, this);
    }
    if (error || !profile) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "fixed inset-0 z-50 flex items-center justify-center bg-[#002020]/40 backdrop-blur-md p-4",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "bg-white rounded-3xl p-8 text-center max-w-sm shadow-2xl",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "text-4xl mb-4",
                        children: "😕"
                    }, void 0, false, {
                        fileName: "[project]/src/app/profile/[rollNo]/page.tsx",
                        lineNumber: 202,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "font-semibold mb-6 text-[#002020]",
                        children: error || 'Profile not found'
                    }, void 0, false, {
                        fileName: "[project]/src/app/profile/[rollNo]/page.tsx",
                        lineNumber: 203,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: ()=>router.back(),
                        className: "px-6 py-2.5 bg-linear-to-r from-[#87ceeb] via-[#e6e6fa] to-[#ffb6c1] text-[#002020] rounded-xl font-semibold hover:opacity-90 transition-opacity",
                        children: "Go Back"
                    }, void 0, false, {
                        fileName: "[project]/src/app/profile/[rollNo]/page.tsx",
                        lineNumber: 204,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/app/profile/[rollNo]/page.tsx",
                lineNumber: 201,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/src/app/profile/[rollNo]/page.tsx",
            lineNumber: 200,
            columnNumber: 12
        }, this);
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8 lg:p-12 bg-black/40 backdrop-blur-md dark:bg-black/60",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "relative w-full max-w-5xl h-[75vh] md:h-160 bg-surface-container-lowest dark:bg-surface-container rounded-3xl shadow-[0_40px_80px_rgba(0,32,32,0.2)] dark:shadow-[0_40px_80px_rgba(0,0,0,0.4)] flex flex-col overflow-hidden",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: ()=>router.back(),
                        className: "absolute top-6 right-6 z-20 w-12 h-12 flex items-center justify-center rounded-full bg-white text-[#002020] hover:bg-gray-100 transition-all duration-300 shadow-lg active:scale-90 dark:bg-[#004a4a] dark:text-white dark:hover:bg-[#005555]",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            className: "material-symbols-outlined text-3xl",
                            children: "close"
                        }, void 0, false, {
                            fileName: "[project]/src/app/profile/[rollNo]/page.tsx",
                            lineNumber: 215,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/app/profile/[rollNo]/page.tsx",
                        lineNumber: 214,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex-1 flex flex-col md:flex-row overflow-hidden",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "w-full md:w-5/12 relative h-64 md:h-full bg-surface-container-low overflow-hidden",
                                children: [
                                    profile.dp_url ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                        src: profile.dp_url,
                                        alt: profile.name,
                                        fill: true,
                                        className: "object-cover",
                                        priority: true
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/profile/[rollNo]/page.tsx",
                                        lineNumber: 222,
                                        columnNumber: 31
                                    }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "w-full h-full flex items-center justify-center bg-linear-to-br from-primary to-secondary-container",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "text-6xl font-bold text-white",
                                            children: profile.name?.charAt(0).toUpperCase() || '?'
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/profile/[rollNo]/page.tsx",
                                            lineNumber: 223,
                                            columnNumber: 17
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/profile/[rollNo]/page.tsx",
                                        lineNumber: 222,
                                        columnNumber: 122
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "absolute bottom-0 left-0 right-0 p-8 bg-linear-to-t from-black/80 to-transparent",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "flex items-center gap-3",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "w-3 h-3 bg-emerald-400 rounded-full border-2 border-white shadow-lg"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/profile/[rollNo]/page.tsx",
                                                        lineNumber: 228,
                                                        columnNumber: 17
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "text-white font-medium text-xs uppercase tracking-widest",
                                                        children: profile.is_verified ? 'Verified' : 'Member'
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/profile/[rollNo]/page.tsx",
                                                        lineNumber: 229,
                                                        columnNumber: 17
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/app/profile/[rollNo]/page.tsx",
                                                lineNumber: 227,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                                className: "text-white text-3xl md:text-4xl font-bold mt-2 tracking-tight",
                                                children: profile.name
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/profile/[rollNo]/page.tsx",
                                                lineNumber: 231,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "text-white/80 text-lg",
                                                children: profile.roll_no
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/profile/[rollNo]/page.tsx",
                                                lineNumber: 232,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/app/profile/[rollNo]/page.tsx",
                                        lineNumber: 226,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/profile/[rollNo]/page.tsx",
                                lineNumber: 221,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "w-full md:w-7/12 p-6 md:p-10 lg:p-12 flex flex-col overflow-y-auto",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "space-y-8",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "grid grid-cols-2 gap-4",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "bg-surface-container p-5 rounded-2xl dark:bg-surface-container-high",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "text-on-surface-variant font-medium text-[10px] uppercase tracking-[0.2em]",
                                                                children: "Roll Number"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/app/profile/[rollNo]/page.tsx",
                                                                lineNumber: 242,
                                                                columnNumber: 19
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                className: "text-on-surface font-bold text-xl mt-1",
                                                                children: profile.roll_no
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/app/profile/[rollNo]/page.tsx",
                                                                lineNumber: 243,
                                                                columnNumber: 19
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/app/profile/[rollNo]/page.tsx",
                                                        lineNumber: 241,
                                                        columnNumber: 17
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "bg-surface-container p-5 rounded-2xl dark:bg-surface-container-high",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "text-on-surface-variant font-medium text-[10px] uppercase tracking-[0.2em]",
                                                                children: "Branch"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/app/profile/[rollNo]/page.tsx",
                                                                lineNumber: 246,
                                                                columnNumber: 19
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                className: "text-on-surface font-bold text-xl mt-1",
                                                                children: profile.branch?.toUpperCase() || 'N/A'
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/app/profile/[rollNo]/page.tsx",
                                                                lineNumber: 247,
                                                                columnNumber: 19
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/app/profile/[rollNo]/page.tsx",
                                                        lineNumber: 245,
                                                        columnNumber: 17
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/app/profile/[rollNo]/page.tsx",
                                                lineNumber: 240,
                                                columnNumber: 15
                                            }, this),
                                            profile.bio && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "space-y-3",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                        className: "text-on-surface-variant font-medium text-[10px] uppercase tracking-[0.2em] flex items-center gap-2",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "material-symbols-outlined text-sm",
                                                                children: "auto_awesome"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/app/profile/[rollNo]/page.tsx",
                                                                lineNumber: 254,
                                                                columnNumber: 21
                                                            }, this),
                                                            "About"
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/app/profile/[rollNo]/page.tsx",
                                                        lineNumber: 253,
                                                        columnNumber: 19
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                        className: "text-on-surface text-lg leading-relaxed",
                                                        children: profile.bio
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/profile/[rollNo]/page.tsx",
                                                        lineNumber: 257,
                                                        columnNumber: 19
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/app/profile/[rollNo]/page.tsx",
                                                lineNumber: 252,
                                                columnNumber: 31
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "flex flex-wrap gap-3",
                                                children: [
                                                    profile.gender && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "px-4 py-2 rounded-full bg-secondary-container text-on-secondary-container font-medium text-sm uppercase",
                                                        children: profile.gender
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/profile/[rollNo]/page.tsx",
                                                        lineNumber: 262,
                                                        columnNumber: 36
                                                    }, this),
                                                    profile.is_verified && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "px-4 py-2 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 font-medium text-sm flex items-center gap-1",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "material-symbols-outlined text-sm",
                                                                children: "verified"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/app/profile/[rollNo]/page.tsx",
                                                                lineNumber: 266,
                                                                columnNumber: 21
                                                            }, this),
                                                            "Verified"
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/app/profile/[rollNo]/page.tsx",
                                                        lineNumber: 265,
                                                        columnNumber: 41
                                                    }, this),
                                                    profile.dob && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "px-4 py-2 rounded-full bg-[#f9b1bc] text-[#331019] font-medium text-sm dark:bg-[#7f4e52] dark:text-white",
                                                        children: [
                                                            "🎂 ",
                                                            new Date(profile.dob).toLocaleDateString('en-US', {
                                                                month: 'short',
                                                                day: 'numeric'
                                                            })
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/app/profile/[rollNo]/page.tsx",
                                                        lineNumber: 269,
                                                        columnNumber: 33
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/app/profile/[rollNo]/page.tsx",
                                                lineNumber: 261,
                                                columnNumber: 15
                                            }, this),
                                            (profile.instagram_url || profile.twitter_url || profile.linkedin_url) && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "space-y-3",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                        className: "text-on-surface-variant font-medium text-[10px] uppercase tracking-[0.2em]",
                                                        children: "Social Links"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/profile/[rollNo]/page.tsx",
                                                        lineNumber: 279,
                                                        columnNumber: 19
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "flex flex-wrap gap-3",
                                                        children: [
                                                            profile.instagram_url && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                                                                href: profile.instagram_url,
                                                                target: "_blank",
                                                                rel: "noopener noreferrer",
                                                                className: "flex items-center gap-2 px-4 py-2 rounded-xl bg-surface-container hover:bg-surface-container-high transition-colors text-on-surface dark:bg-surface-container-high dark:hover:bg-surface-container-highest",
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                                                        className: "w-5 h-5",
                                                                        fill: "currentColor",
                                                                        viewBox: "0 0 24 24",
                                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                                            d: "M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069z"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/src/app/profile/[rollNo]/page.tsx",
                                                                            lineNumber: 282,
                                                                            columnNumber: 90
                                                                        }, this)
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/app/profile/[rollNo]/page.tsx",
                                                                        lineNumber: 282,
                                                                        columnNumber: 25
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                        className: "text-sm font-medium",
                                                                        children: "Instagram"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/app/profile/[rollNo]/page.tsx",
                                                                        lineNumber: 283,
                                                                        columnNumber: 25
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/src/app/profile/[rollNo]/page.tsx",
                                                                lineNumber: 281,
                                                                columnNumber: 47
                                                            }, this),
                                                            profile.twitter_url && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                                                                href: profile.twitter_url,
                                                                target: "_blank",
                                                                rel: "noopener noreferrer",
                                                                className: "flex items-center gap-2 px-4 py-2 rounded-xl bg-surface-container hover:bg-surface-container-high transition-colors text-on-surface dark:bg-surface-container-high dark:hover:bg-surface-container-highest",
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                                                        className: "w-5 h-5",
                                                                        fill: "currentColor",
                                                                        viewBox: "0 0 24 24",
                                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                                            d: "M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/src/app/profile/[rollNo]/page.tsx",
                                                                            lineNumber: 286,
                                                                            columnNumber: 90
                                                                        }, this)
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/app/profile/[rollNo]/page.tsx",
                                                                        lineNumber: 286,
                                                                        columnNumber: 25
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                        className: "text-sm font-medium",
                                                                        children: "Twitter"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/app/profile/[rollNo]/page.tsx",
                                                                        lineNumber: 287,
                                                                        columnNumber: 25
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/src/app/profile/[rollNo]/page.tsx",
                                                                lineNumber: 285,
                                                                columnNumber: 45
                                                            }, this),
                                                            profile.linkedin_url && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                                                                href: profile.linkedin_url,
                                                                target: "_blank",
                                                                rel: "noopener noreferrer",
                                                                className: "flex items-center gap-2 px-4 py-2 rounded-xl bg-surface-container hover:bg-surface-container-high transition-colors text-on-surface dark:bg-surface-container-high dark:hover:bg-surface-container-highest",
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                                                        className: "w-5 h-5",
                                                                        fill: "currentColor",
                                                                        viewBox: "0 0 24 24",
                                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                                            d: "M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065z"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/src/app/profile/[rollNo]/page.tsx",
                                                                            lineNumber: 290,
                                                                            columnNumber: 90
                                                                        }, this)
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/app/profile/[rollNo]/page.tsx",
                                                                        lineNumber: 290,
                                                                        columnNumber: 25
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                        className: "text-sm font-medium",
                                                                        children: "LinkedIn"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/app/profile/[rollNo]/page.tsx",
                                                                        lineNumber: 291,
                                                                        columnNumber: 25
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/src/app/profile/[rollNo]/page.tsx",
                                                                lineNumber: 289,
                                                                columnNumber: 46
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/app/profile/[rollNo]/page.tsx",
                                                        lineNumber: 280,
                                                        columnNumber: 19
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/app/profile/[rollNo]/page.tsx",
                                                lineNumber: 278,
                                                columnNumber: 90
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/app/profile/[rollNo]/page.tsx",
                                        lineNumber: 238,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "mt-auto pt-8 grid grid-cols-1 sm:grid-cols-2 gap-4",
                                        children: isOwnProfile ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                                href: "/profile/edit",
                                                className: "sm:col-span-2",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                    className: "w-full bg-linear-to-r from-primary via-secondary-container to-tertiary-container h-14 rounded-xl flex items-center justify-center gap-2 transition-all duration-300 hover:shadow-lg hover:scale-[1.02] active:scale-95 text-on-primary font-bold text-lg",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            className: "material-symbols-outlined",
                                                            children: "edit"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/app/profile/[rollNo]/page.tsx",
                                                            lineNumber: 302,
                                                            columnNumber: 23
                                                        }, this),
                                                        "Edit Profile"
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/app/profile/[rollNo]/page.tsx",
                                                    lineNumber: 301,
                                                    columnNumber: 21
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/profile/[rollNo]/page.tsx",
                                                lineNumber: 300,
                                                columnNumber: 19
                                            }, this)
                                        }, void 0, false) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                    onClick: ()=>handleStartChat(profile.user_id, false),
                                                    disabled: isBlocked || navigating,
                                                    className: "bg-[#0c6780] h-14 rounded-xl flex items-center justify-center gap-2 transition-all duration-300 hover:shadow-lg hover:scale-[1.02] active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold text-lg dark:bg-[#87ceeb] dark:text-[#002020]",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            className: "material-symbols-outlined",
                                                            children: "chat_bubble"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/app/profile/[rollNo]/page.tsx",
                                                            lineNumber: 308,
                                                            columnNumber: 21
                                                        }, this),
                                                        "Chat"
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/app/profile/[rollNo]/page.tsx",
                                                    lineNumber: 307,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                    onClick: ()=>handleStartChat(profile.user_id, true),
                                                    disabled: isBlocked || navigating,
                                                    className: "bg-surface-container h-14 rounded-xl flex items-center justify-center gap-2 transition-all duration-300 hover:bg-surface-container-high hover:shadow-lg hover:scale-[1.02] active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed text-on-surface font-bold text-lg border-2 border-outline-variant/30 dark:bg-surface-container-high dark:hover:bg-surface-container-highest",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            className: "material-symbols-outlined",
                                                            children: "visibility_off"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/app/profile/[rollNo]/page.tsx",
                                                            lineNumber: 312,
                                                            columnNumber: 21
                                                        }, this),
                                                        "Anonymous"
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/app/profile/[rollNo]/page.tsx",
                                                    lineNumber: 311,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                    onClick: handleShareProfile,
                                                    className: "bg-secondary-container h-12 rounded-xl flex items-center justify-center gap-2 transition-all duration-300 hover:bg-secondary-fixed-dim hover:shadow-md active:scale-95 text-on-secondary-container font-semibold",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            className: "material-symbols-outlined",
                                                            children: "qr_code"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/app/profile/[rollNo]/page.tsx",
                                                            lineNumber: 316,
                                                            columnNumber: 21
                                                        }, this),
                                                        "Share QR"
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/app/profile/[rollNo]/page.tsx",
                                                    lineNumber: 315,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "flex items-center justify-center",
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ModerationComponents$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["BlockUserButton"], {
                                                        userId: profile.user_id,
                                                        userName: profile.name,
                                                        isBlocked: isBlocked,
                                                        onBlockStatusChange: handleBlockStatusChange
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/profile/[rollNo]/page.tsx",
                                                        lineNumber: 320,
                                                        columnNumber: 21
                                                    }, this)
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/profile/[rollNo]/page.tsx",
                                                    lineNumber: 319,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true)
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/profile/[rollNo]/page.tsx",
                                        lineNumber: 298,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/profile/[rollNo]/page.tsx",
                                lineNumber: 237,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/profile/[rollNo]/page.tsx",
                        lineNumber: 219,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/app/profile/[rollNo]/page.tsx",
                lineNumber: 212,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("nav", {
                className: "fixed bottom-2 left-1/2 -translate-x-1/2 flex justify-center items-center gap-1 p-1.5 z-50 rounded-full backdrop-blur-md border shadow-[0_8px_24px_rgba(0,0,0,0.12)] bg-white/90 border-[#d2f5f4] dark:bg-[#003535]/90 dark:border-[#004a4a] dark:shadow-[0_8px_24px_rgba(0,0,0,0.3)]",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                        href: "/chat",
                        className: "w-12 h-12 flex items-center justify-center rounded-full transition-all duration-300 text-[#6f787d] hover:scale-110 hover:text-[#0c6780] hover:bg-[#d2f5f4] dark:text-[#bfc8cd] dark:hover:bg-[#004a4a] dark:hover:text-[#87ceeb]",
                        title: "Chats",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            className: "material-symbols-outlined text-xl",
                            children: "chat_bubble"
                        }, void 0, false, {
                            fileName: "[project]/src/app/profile/[rollNo]/page.tsx",
                            lineNumber: 332,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/app/profile/[rollNo]/page.tsx",
                        lineNumber: 331,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                        href: "/my-groups",
                        className: "w-12 h-12 flex items-center justify-center rounded-full transition-all duration-300 text-[#6f787d] hover:scale-110 hover:text-[#0c6780] hover:bg-[#d2f5f4] dark:text-[#bfc8cd] dark:hover:bg-[#004a4a] dark:hover:text-[#87ceeb]",
                        title: "Groups",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            className: "material-symbols-outlined text-xl",
                            children: "group"
                        }, void 0, false, {
                            fileName: "[project]/src/app/profile/[rollNo]/page.tsx",
                            lineNumber: 336,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/app/profile/[rollNo]/page.tsx",
                        lineNumber: 335,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                        href: "/dashboard",
                        className: "w-12 h-12 flex items-center justify-center rounded-full transition-all duration-300 text-[#6f787d] hover:scale-110 hover:text-[#0c6780] hover:bg-[#d2f5f4] dark:text-[#bfc8cd] dark:hover:bg-[#004a4a] dark:hover:text-[#87ceeb]",
                        title: "Home",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            className: "material-symbols-outlined text-xl",
                            children: "home"
                        }, void 0, false, {
                            fileName: "[project]/src/app/profile/[rollNo]/page.tsx",
                            lineNumber: 340,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/app/profile/[rollNo]/page.tsx",
                        lineNumber: 339,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                        href: "/my-identities",
                        className: "w-12 h-12 flex items-center justify-center rounded-full transition-all duration-300 text-[#6f787d] hover:scale-110 hover:text-[#0c6780] hover:bg-[#d2f5f4] dark:text-[#bfc8cd] dark:hover:bg-[#004a4a] dark:hover:text-[#87ceeb]",
                        title: "IDs",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            className: "material-symbols-outlined text-xl",
                            style: {
                                fontVariationSettings: "'FILL' 1"
                            },
                            children: "badge"
                        }, void 0, false, {
                            fileName: "[project]/src/app/profile/[rollNo]/page.tsx",
                            lineNumber: 344,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/app/profile/[rollNo]/page.tsx",
                        lineNumber: 343,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                        href: "/profile/edit",
                        className: "w-12 h-12 flex items-center justify-center rounded-full transition-all duration-300 text-[#6f787d] hover:scale-110 hover:text-[#0c6780] hover:bg-[#d2f5f4] dark:text-[#bfc8cd] dark:hover:bg-[#004a4a] dark:hover:text-[#87ceeb]",
                        title: "Settings",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            className: "material-symbols-outlined text-xl",
                            children: "settings"
                        }, void 0, false, {
                            fileName: "[project]/src/app/profile/[rollNo]/page.tsx",
                            lineNumber: 350,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/app/profile/[rollNo]/page.tsx",
                        lineNumber: 349,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/app/profile/[rollNo]/page.tsx",
                lineNumber: 329,
                columnNumber: 7
            }, this),
            showQRModal && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-fade-in",
                onClick: ()=>setShowQRModal(false),
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "glass-strong rounded-3xl p-8 max-w-md w-full animate-scale-in relative overflow-hidden",
                    onClick: (e)=>e.stopPropagation(),
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "absolute top-0 left-0 w-32 h-32 rounded-full blur-3xl opacity-30",
                            style: {
                                background: 'var(--grad-romance)'
                            }
                        }, void 0, false, {
                            fileName: "[project]/src/app/profile/[rollNo]/page.tsx",
                            lineNumber: 358,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "absolute bottom-0 right-0 w-32 h-32 rounded-full blur-3xl opacity-30",
                            style: {
                                background: 'var(--grad-ocean)'
                            }
                        }, void 0, false, {
                            fileName: "[project]/src/app/profile/[rollNo]/page.tsx",
                            lineNumber: 361,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "relative z-10",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex items-center justify-between mb-6",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                                    className: "text-2xl font-bold mb-1",
                                                    style: {
                                                        color: 'var(--heading)'
                                                    },
                                                    children: "Share Profile"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/profile/[rollNo]/page.tsx",
                                                    lineNumber: 368,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    className: "text-sm",
                                                    style: {
                                                        color: 'var(--muted)'
                                                    },
                                                    children: "Scan to connect"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/profile/[rollNo]/page.tsx",
                                                    lineNumber: 371,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/app/profile/[rollNo]/page.tsx",
                                            lineNumber: 367,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            onClick: ()=>setShowQRModal(false),
                                            className: "w-10 h-10 rounded-full glass flex items-center justify-center hover:scale-110 transition-all",
                                            style: {
                                                color: 'var(--muted)'
                                            },
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                                className: "w-5 h-5",
                                                fill: "none",
                                                stroke: "currentColor",
                                                viewBox: "0 0 24 24",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                    strokeLinecap: "round",
                                                    strokeLinejoin: "round",
                                                    strokeWidth: 2,
                                                    d: "M6 18L18 6M6 6l12 12"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/profile/[rollNo]/page.tsx",
                                                    lineNumber: 379,
                                                    columnNumber: 21
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/profile/[rollNo]/page.tsx",
                                                lineNumber: 378,
                                                columnNumber: 19
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/profile/[rollNo]/page.tsx",
                                            lineNumber: 375,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/app/profile/[rollNo]/page.tsx",
                                    lineNumber: 366,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "relative mb-6",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "absolute -inset-1 rounded-3xl blur-sm opacity-75",
                                            style: {
                                                background: 'var(--grad-romance)'
                                            }
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/profile/[rollNo]/page.tsx",
                                            lineNumber: 387,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "relative bg-white rounded-3xl p-6",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "flex items-center gap-3 mb-4 pb-4 border-b border-gray-200",
                                                    children: [
                                                        profile.dp_url ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                                            src: profile.dp_url,
                                                            alt: profile.name,
                                                            width: 48,
                                                            height: 48,
                                                            className: "w-12 h-12 rounded-xl object-cover"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/app/profile/[rollNo]/page.tsx",
                                                            lineNumber: 394,
                                                            columnNumber: 39
                                                        }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "w-12 h-12 rounded-xl flex items-center justify-center text-white text-lg font-bold",
                                                            style: {
                                                                background: 'var(--grad-romance)'
                                                            },
                                                            children: profile.name?.charAt(0).toUpperCase() || '?'
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/app/profile/[rollNo]/page.tsx",
                                                            lineNumber: 394,
                                                            columnNumber: 160
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                    className: "font-bold text-gray-900",
                                                                    children: profile.name
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/app/profile/[rollNo]/page.tsx",
                                                                    lineNumber: 400,
                                                                    columnNumber: 23
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                    className: "text-sm text-gray-500",
                                                                    children: profile.roll_no
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/app/profile/[rollNo]/page.tsx",
                                                                    lineNumber: 401,
                                                                    columnNumber: 23
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/app/profile/[rollNo]/page.tsx",
                                                            lineNumber: 399,
                                                            columnNumber: 21
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/app/profile/[rollNo]/page.tsx",
                                                    lineNumber: 393,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "flex items-center justify-center",
                                                    children: qrCodeUrl && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "relative",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                                                src: qrCodeUrl,
                                                                alt: "Profile QR Code",
                                                                width: 280,
                                                                height: 280,
                                                                className: "w-full h-auto"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/app/profile/[rollNo]/page.tsx",
                                                                lineNumber: 408,
                                                                columnNumber: 25
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2",
                                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    className: "w-16 h-16 rounded-2xl flex items-center justify-center text-white text-2xl font-bold shadow-lg",
                                                                    style: {
                                                                        background: 'var(--grad-romance)'
                                                                    },
                                                                    children: profile.name?.charAt(0).toUpperCase() || '?'
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/app/profile/[rollNo]/page.tsx",
                                                                    lineNumber: 411,
                                                                    columnNumber: 27
                                                                }, this)
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/app/profile/[rollNo]/page.tsx",
                                                                lineNumber: 410,
                                                                columnNumber: 25
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/app/profile/[rollNo]/page.tsx",
                                                        lineNumber: 407,
                                                        columnNumber: 35
                                                    }, this)
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/profile/[rollNo]/page.tsx",
                                                    lineNumber: 406,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "mt-4 pt-4 border-t border-gray-200",
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                        className: "text-center text-xs text-gray-500 font-medium",
                                                        children: "Scan with camera to view profile"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/profile/[rollNo]/page.tsx",
                                                        lineNumber: 422,
                                                        columnNumber: 21
                                                    }, this)
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/profile/[rollNo]/page.tsx",
                                                    lineNumber: 421,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/app/profile/[rollNo]/page.tsx",
                                            lineNumber: 391,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/app/profile/[rollNo]/page.tsx",
                                    lineNumber: 385,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex gap-3",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            onClick: ()=>{
                                                const link = document.createElement('a');
                                                link.download = `${rollNo}-profile-qr.png`;
                                                link.href = qrCodeUrl;
                                                link.click();
                                            },
                                            className: "btn-romance flex-1 px-4 py-3 text-sm font-semibold flex items-center justify-center gap-2",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                                    className: "w-5 h-5",
                                                    fill: "none",
                                                    stroke: "currentColor",
                                                    viewBox: "0 0 24 24",
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                        strokeLinecap: "round",
                                                        strokeLinejoin: "round",
                                                        strokeWidth: 2,
                                                        d: "M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/profile/[rollNo]/page.tsx",
                                                        lineNumber: 438,
                                                        columnNumber: 21
                                                    }, this)
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/profile/[rollNo]/page.tsx",
                                                    lineNumber: 437,
                                                    columnNumber: 19
                                                }, this),
                                                "Download QR"
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/app/profile/[rollNo]/page.tsx",
                                            lineNumber: 431,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            onClick: ()=>{
                                                const profileUrl_0 = `${window.location.origin}/profile/${rollNo}`;
                                                navigator.clipboard.writeText(profileUrl_0);
                                            },
                                            className: "btn-ghost px-4 py-3 text-sm font-semibold flex items-center justify-center gap-2",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                                    className: "w-5 h-5",
                                                    fill: "none",
                                                    stroke: "currentColor",
                                                    viewBox: "0 0 24 24",
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                        strokeLinecap: "round",
                                                        strokeLinejoin: "round",
                                                        strokeWidth: 2,
                                                        d: "M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/profile/[rollNo]/page.tsx",
                                                        lineNumber: 447,
                                                        columnNumber: 21
                                                    }, this)
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/profile/[rollNo]/page.tsx",
                                                    lineNumber: 446,
                                                    columnNumber: 19
                                                }, this),
                                                "Copy Link"
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/app/profile/[rollNo]/page.tsx",
                                            lineNumber: 442,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/app/profile/[rollNo]/page.tsx",
                                    lineNumber: 430,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/app/profile/[rollNo]/page.tsx",
                            lineNumber: 365,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/app/profile/[rollNo]/page.tsx",
                    lineNumber: 356,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/app/profile/[rollNo]/page.tsx",
                lineNumber: 355,
                columnNumber: 23
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/app/profile/[rollNo]/page.tsx",
        lineNumber: 210,
        columnNumber: 10
    }, this);
}
_s(ViewProfile, "JNbNmA+HJ3cD7ebQZUu36bwxPiw=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useParams"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"]
    ];
});
_c = ViewProfile;
var _c;
__turbopack_context__.k.register(_c, "ViewProfile");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=src_e44ea06e._.js.map