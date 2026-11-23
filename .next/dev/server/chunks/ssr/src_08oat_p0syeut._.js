module.exports = [
"[project]/src/lib/api.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ApiError",
    ()=>ApiError,
    "api",
    ()=>api
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$auth$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/store/auth.ts [app-ssr] (ecmascript)");
;
/**
 * API client.
 *
 * - In production the frontend talks to the Express backend via
 *   NEXT_PUBLIC_API_URL (e.g. http://localhost:3001).
 * - In the sandbox preview there is no configurable origin, so requests are
 *   routed through the local gateway with the ?XTransformPort=3001 marker.
 */ const API_URL = (process.env.NEXT_PUBLIC_API_URL || '').replace(/\/$/, '');
function buildUrl(path) {
    if (API_URL) return `${API_URL}${path}`;
    const sep = path.includes('?') ? '&' : '?';
    return `${path}${sep}XTransformPort=3001`;
}
class ApiError extends Error {
    status;
    constructor(status, message){
        super(message), this.status = status;
    }
}
function onUnauthorized() {
    __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$auth$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useAuthStore"].getState().clear();
    if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
    ;
}
async function request(path, options = {}) {
    const { invalidate, ...init } = options;
    const token = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$auth$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useAuthStore"].getState().token;
    const res = await fetch(buildUrl(path), {
        ...init,
        headers: {
            'Content-Type': 'application/json',
            ...token ? {
                Authorization: `Bearer ${token}`
            } : {},
            ...init.headers || {}
        }
    });
    if (!res.ok) {
        let message = 'Ошибка сервера';
        try {
            const data = await res.json();
            if (data?.error) message = data.error;
        } catch  {
        /* keep default message */ }
        if (res.status === 401) {
            onUnauthorized();
            throw new ApiError(401, 'Требуется авторизация');
        }
        throw new ApiError(res.status, message);
    }
    if (invalidate?.length) {
        // Lazy import avoidance: dispatch a global event so the QueryProvider can
        // invalidate wallet/cart related queries without a direct dependency.
        if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
        ;
    }
    const text = await res.text();
    return text ? JSON.parse(text) : null;
}
const api = {
    auth: {
        login: (email, password)=>request('/api/auth/login', {
                method: 'POST',
                body: JSON.stringify({
                    email,
                    password
                })
            }),
        register: (payload)=>request('/api/auth/register', {
                method: 'POST',
                body: JSON.stringify(payload),
                invalidate: [
                    'me'
                ]
            }),
        me: ()=>request('/api/auth/me'),
        updateMe: (payload)=>request('/api/auth/me', {
                method: 'PUT',
                body: JSON.stringify(payload),
                invalidate: [
                    'me'
                ]
            })
    },
    users: {
        list: ()=>request('/api/users'),
        get: (id)=>request(`/api/users/${id}`)
    },
    tasks: {
        list: ()=>request('/api/tasks'),
        create: (payload)=>request('/api/tasks', {
                method: 'POST',
                body: JSON.stringify(payload)
            }),
        claim: (id)=>request(`/api/tasks/${id}/claim`, {
                method: 'POST',
                invalidate: [
                    'me'
                ]
            }),
        submit: (id)=>request(`/api/tasks/${id}/submit`, {
                method: 'POST'
            }),
        review: (id, approve)=>request(`/api/tasks/${id}/review`, {
                method: 'POST',
                body: JSON.stringify({
                    approve
                }),
                invalidate: [
                    'me'
                ]
            }),
        delete: (id)=>request(`/api/tasks/${id}`, {
                method: 'DELETE'
            })
    },
    challenges: {
        list: ()=>request('/api/challenges'),
        get: (id)=>request(`/api/challenges/${id}`),
        join: (id)=>request(`/api/challenges/${id}/join`, {
                method: 'POST'
            }),
        completeTask: (challengeId, taskId)=>request(`/api/challenges/${challengeId}/tasks/${taskId}/complete`, {
                method: 'POST',
                invalidate: [
                    'me'
                ]
            }),
        create: (payload)=>request('/api/challenges', {
                method: 'POST',
                body: JSON.stringify(payload)
            }),
        update: (id, payload)=>request(`/api/challenges/${id}`, {
                method: 'PUT',
                body: JSON.stringify(payload)
            }),
        delete: (id)=>request(`/api/challenges/${id}`, {
                method: 'DELETE'
            })
    },
    wheel: {
        info: ()=>request('/api/wheel'),
        spin: ()=>request('/api/wheel/spin', {
                method: 'POST',
                invalidate: [
                    'me'
                ]
            })
    },
    leaderboards: {
        list: ()=>request('/api/leaderboards'),
        get: (slug)=>request(`/api/leaderboards/${slug}`)
    },
    surveys: {
        list: ()=>request('/api/surveys'),
        vote: (id, optionId)=>request(`/api/surveys/${id}/vote`, {
                method: 'POST',
                body: JSON.stringify({
                    optionId
                }),
                invalidate: [
                    'me'
                ]
            }),
        create: (payload)=>request('/api/surveys', {
                method: 'POST',
                body: JSON.stringify(payload)
            }),
        update: (id, payload)=>request(`/api/surveys/${id}`, {
                method: 'PUT',
                body: JSON.stringify(payload)
            }),
        delete: (id)=>request(`/api/surveys/${id}`, {
                method: 'DELETE'
            })
    },
    auctions: {
        list: ()=>request('/api/auctions'),
        get: (id)=>request(`/api/auctions/${id}`),
        bid: (id, amount)=>request(`/api/auctions/${id}/bid`, {
                method: 'POST',
                body: JSON.stringify({
                    amount
                })
            }),
        create: (payload)=>request('/api/auctions', {
                method: 'POST',
                body: JSON.stringify(payload)
            }),
        update: (id, payload)=>request(`/api/auctions/${id}`, {
                method: 'PUT',
                body: JSON.stringify(payload)
            }),
        delete: (id)=>request(`/api/auctions/${id}`, {
                method: 'DELETE'
            })
    },
    pomodoro: {
        stats: ()=>request('/api/pomodoro/stats'),
        addSession: (minutes, type = 'focus')=>request('/api/pomodoro/sessions', {
                method: 'POST',
                body: JSON.stringify({
                    minutes,
                    type
                })
            })
    },
    quests: {
        list: ()=>request('/api/quests'),
        complete: (id)=>request(`/api/quests/${id}/complete`, {
                method: 'POST',
                invalidate: [
                    'me'
                ]
            })
    },
    products: {
        list: (params)=>{
            const q = new URLSearchParams();
            if (params?.category) q.set('category', params.category);
            if (params?.search) q.set('search', params.search);
            const suffix = q.toString() ? `?${q.toString()}` : '';
            return request(`/api/products${suffix}`);
        },
        get: (id)=>request(`/api/products/${id}`),
        create: (payload)=>request('/api/products', {
                method: 'POST',
                body: JSON.stringify(payload)
            }),
        update: (id, payload)=>request(`/api/products/${id}`, {
                method: 'PUT',
                body: JSON.stringify(payload)
            }),
        delete: (id)=>request(`/api/products/${id}`, {
                method: 'DELETE'
            })
    },
    cart: {
        get: ()=>request('/api/cart'),
        add: (productId, quantity = 1)=>request('/api/cart', {
                method: 'POST',
                body: JSON.stringify({
                    productId,
                    quantity
                }),
                invalidate: [
                    'cart'
                ]
            }),
        update: (itemId, quantity)=>request(`/api/cart/${itemId}`, {
                method: 'PUT',
                body: JSON.stringify({
                    quantity
                }),
                invalidate: [
                    'cart'
                ]
            }),
        remove: (itemId)=>request(`/api/cart/${itemId}`, {
                method: 'DELETE',
                invalidate: [
                    'cart'
                ]
            })
    },
    orders: {
        my: ()=>request('/api/orders'),
        checkout: (comment)=>request('/api/orders/checkout', {
                method: 'POST',
                body: JSON.stringify({
                    comment: comment || ''
                }),
                invalidate: [
                    'me',
                    'cart'
                ]
            }),
        setStatus: (id, status)=>request(`/api/orders/${id}/status`, {
                method: 'PUT',
                body: JSON.stringify({
                    status
                })
            })
    },
    transactions: {
        my: ()=>request('/api/transactions/my')
    },
    settings: {
        get: ()=>request('/api/settings'),
        update: (settings)=>request('/api/settings', {
                method: 'PUT',
                body: JSON.stringify({
                    settings
                })
            })
    },
    admin: {
        stats: ()=>request('/api/admin/stats'),
        users: ()=>request('/api/admin/users'),
        updateUser: (id, payload)=>request(`/api/admin/users/${id}`, {
                method: 'PUT',
                body: JSON.stringify(payload),
                invalidate: [
                    'me'
                ]
            }),
        deleteUser: (id)=>request(`/api/admin/users/${id}`, {
                method: 'DELETE'
            }),
        orders: ()=>request('/api/admin/orders'),
        tasks: ()=>request('/api/admin/tasks')
    }
};
}),
"[project]/src/lib/format.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/** Formats a coin amount: 2756 -> "2 756". */ __turbopack_context__.s([
    "TRANSACTION_LABELS",
    ()=>TRANSACTION_LABELS,
    "difficultyLabel",
    ()=>difficultyLabel,
    "formatCoins",
    ()=>formatCoins,
    "formatDate",
    ()=>formatDate,
    "formatDateTime",
    ()=>formatDateTime,
    "formatTimer",
    ()=>formatTimer,
    "fullName",
    ()=>fullName,
    "initials",
    ()=>initials
]);
function formatCoins(value) {
    const num = Number(value ?? 0);
    if (!Number.isFinite(num)) return '0';
    const sign = num < 0 ? '-' : '';
    const abs = Math.abs(Math.round(num));
    return sign + abs.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '\u00A0');
}
function formatDate(iso) {
    if (!iso) return '';
    const date = new Date(iso);
    if (Number.isNaN(date.getTime())) return iso.slice(0, 10);
    return date.toLocaleDateString('ru-RU', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    });
}
function formatDateTime(iso) {
    if (!iso) return '';
    const date = new Date(iso);
    if (Number.isNaN(date.getTime())) return iso;
    return date.toLocaleString('ru-RU', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}
function formatTimer(totalSeconds) {
    const safe = Math.max(0, Math.floor(totalSeconds));
    const minutes = Math.floor(safe / 60);
    const seconds = safe % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}
function initials(firstName, lastName) {
    const a = (firstName || '').trim()[0] || '';
    const b = (lastName || '').trim()[0] || '';
    return (a + b).toUpperCase() || '?';
}
function fullName(user) {
    return `${user.firstName} ${user.lastName}`.trim();
}
function difficultyLabel(d) {
    if (d === 'easy') return 'Легкая';
    if (d === 'hard') return 'Сложная';
    return 'Средняя';
}
const TRANSACTION_LABELS = {
    task_reward: 'Биржа задач',
    wheel: 'Колесо фортуны',
    challenge: 'Челленджи',
    quest: 'Квесты',
    survey: 'Опросы',
    purchase: 'Покупка',
    cashback: 'Кэшбек',
    auction: 'Аукцион',
    admin: 'Администрация'
};
}),
"[project]/src/lib/router.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Link",
    ()=>Link,
    "RouterProvider",
    ()=>RouterProvider,
    "matchRoute",
    ()=>matchRoute,
    "navigate",
    ()=>navigate,
    "useMatchRoute",
    ()=>useMatchRoute,
    "useQueryParams",
    ()=>useQueryParams,
    "useRoute",
    ()=>useRoute
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
'use client';
;
;
/* ------------------------------------------------------------------ */ /* Tiny hash-based router (the whole SPA lives on the `/` route).      */ /* ------------------------------------------------------------------ */ function readPath() {
    if ("TURBOPACK compile-time truthy", 1) return '/';
    //TURBOPACK unreachable
    ;
    const raw = undefined;
}
const RouterContext = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createContext"])({
    path: '/'
});
function RouterProvider({ children }) {
    const [path, setPath] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])('/');
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        const sync = ()=>setPath(readPath());
        sync();
        window.addEventListener('hashchange', sync);
        return ()=>window.removeEventListener('hashchange', sync);
    }, []);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        window.scrollTo({
            top: 0,
            behavior: 'instant'
        });
    }, [
        path
    ]);
    const value = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"])(()=>({
            path
        }), [
        path
    ]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(RouterContext.Provider, {
        value: value,
        children: children
    }, void 0, false, {
        fileName: "[project]/src/lib/router.tsx",
        lineNumber: 45,
        columnNumber: 10
    }, this);
}
function useRoute() {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useContext"])(RouterContext).path;
}
function navigate(to) {
    if ("TURBOPACK compile-time truthy", 1) return;
    //TURBOPACK unreachable
    ;
}
function useQueryParams() {
    const path = useRoute();
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"])(()=>{
        const idx = path.indexOf('?');
        if (idx === -1) return {};
        const params = {};
        for (const [k, v] of new URLSearchParams(path.slice(idx + 1))){
            params[k] = v;
        }
        return params;
    }, [
        path
    ]);
}
function matchRoute(pattern, path) {
    const clean = path.split('?')[0];
    const pat = pattern.split('/').filter(Boolean);
    const actual = clean.split('/').filter(Boolean);
    if (pat.length !== actual.length) return null;
    const params = {};
    for(let i = 0; i < pat.length; i += 1){
        if (pat[i].startsWith(':')) {
            params[pat[i].slice(1)] = decodeURIComponent(actual[i]);
        } else if (pat[i] !== actual[i]) {
            return null;
        }
    }
    return params;
}
function useMatchRoute(pattern) {
    const path = useRoute();
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"])(()=>matchRoute(pattern, path), [
        pattern,
        path
    ]);
}
function Link({ href, children, className, onClick, ariaLabel }) {
    const handle = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])((event)=>{
        onClick?.(event);
    }, [
        onClick
    ]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
        href: `#${href}`,
        className: className,
        onClick: handle,
        "aria-label": ariaLabel,
        children: children
    }, void 0, false, {
        fileName: "[project]/src/lib/router.tsx",
        lineNumber: 111,
        columnNumber: 5
    }, this);
}
}),
"[project]/src/lib/utils.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "cn",
    ()=>cn
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$clsx$2f$dist$2f$clsx$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/clsx/dist/clsx.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$tailwind$2d$merge$2f$dist$2f$bundle$2d$mjs$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/tailwind-merge/dist/bundle-mjs.mjs [app-ssr] (ecmascript)");
;
;
function cn(...inputs) {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$tailwind$2d$merge$2f$dist$2f$bundle$2d$mjs$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["twMerge"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$clsx$2f$dist$2f$clsx$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["clsx"])(inputs));
}
}),
"[project]/src/store/auth.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useAuthStore",
    ()=>useAuthStore
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zustand$2f$esm$2f$react$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/zustand/esm/react.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zustand$2f$esm$2f$middleware$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/zustand/esm/middleware.mjs [app-ssr] (ecmascript)");
;
;
const useAuthStore = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zustand$2f$esm$2f$react$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["create"])()((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zustand$2f$esm$2f$middleware$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["persist"])((set)=>({
        token: null,
        user: null,
        setAuth: (token, user)=>set({
                token,
                user
            }),
        setUser: (user)=>set({
                user
            }),
        clear: ()=>set({
                token: null,
                user: null
            })
    }), {
    name: 'dotify-auth'
}));
}),
];

//# sourceMappingURL=src_08oat_p0syeut._.js.map