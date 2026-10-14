import { i as __toESM } from "../_runtime.mjs";
import { J as require_react, S as require_jsx_runtime, _ as lazyRouteComponent, b as Link, d as Scripts, f as HeadContent, g as Outlet, h as createRouter, p as useRouterState, v as createFileRoute, x as useRouter, y as createRootRoute } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as TriangleAlert } from "../_libs/lucide-react.mjs";
import { a as union, i as string, n as number, r as object, t as literal } from "../_libs/zod.mjs";
import { n as persist, r as create, t as createJSONStorage } from "../_libs/zustand.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/router-CL_ZcFmw.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var __defProp = Object.defineProperty;
var __exportAll = (all, no_symbols) => {
	let target = {};
	for (var name in all) __defProp(target, name, {
		get: all[name],
		enumerable: true
	});
	if (!no_symbols) __defProp(target, Symbol.toStringTag, { value: "Module" });
	return target;
};
var FALLBACK_MESSAGE = "An unexpected error occurred. Try reloading the page.";
function errorMessage(error) {
	if (error instanceof Error && error.message) return error.message;
	if (typeof error === "string" && error) return error;
	return FALLBACK_MESSAGE;
}
function AppErrorComponent({ error }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "flex min-h-screen flex-col items-center justify-center gap-3 px-6 text-center bg-zinc-50 text-zinc-900 dark:bg-zinc-950 dark:text-zinc-50",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "text-red-500",
				"aria-hidden": "true",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TriangleAlert, {
					className: "size-10",
					strokeWidth: 2
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "text-lg font-semibold",
				children: "Something went wrong"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "max-w-md text-sm break-words text-zinc-500 dark:text-zinc-400",
				children: errorMessage(error)
			})
		]
	});
}
/**
* Path-based preview hosts serve the dev server under `/{port_id}/` and strip
* that prefix before forwarding, so SSR sees `/` while the browser URL keeps the
* prefix. TanStack Start resets `basepath` on hydration, so a `rewrite` keeps
* client routing and generated links aligned with the public URL.
*/
var PATH_BASED_PREVIEW_HOSTS = /* @__PURE__ */ new Set([
	"preview.grok.genai.mil",
	"preview.grok.mil",
	"preview.grokgsac.com"
]);
var PORT_ID_PREFIX = /^\/hds-[a-z0-9]+-\d+-[a-z0-9]+(?=\/|$)/i;
function previewPathPrefix(hostname, pathname) {
	if (!PATH_BASED_PREVIEW_HOSTS.has(hostname.toLowerCase())) return void 0;
	return PORT_ID_PREFIX.exec(pathname)?.[0];
}
function prefixRewrite(prefix) {
	return {
		input: ({ url }) => {
			if (url.pathname === prefix) url.pathname = "/";
			else if (url.pathname.startsWith(`${prefix}/`)) url.pathname = url.pathname.slice(prefix.length);
			return url;
		},
		output: ({ url }) => {
			url.pathname = `${prefix}${url.pathname}`;
			return url;
		}
	};
}
function previewPathRewrite() {
	if (typeof window === "undefined") return void 0;
	const prefix = previewPathPrefix(window.location.hostname, window.location.pathname);
	return prefix ? prefixRewrite(prefix) : void 0;
}
/**
* App-wide client provider mounted once near the root (in `src/routes/__root.tsx`):
*
*   <AuthProvider><Outlet /></AuthProvider>
*
* Better Auth's React client (`@/lib/auth/client`) needs NO context provider —
* its `useSession()` works standalone — so this is a passthrough today. It's
* kept as the single, stable mount point for any future client-side providers
* (e.g. a toast or theme provider) without churning the root shell.
*/
function AuthProvider({ children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children });
}
var CONNECTOR_TOKEN_READY_EVENT = "grok:connector-token-ready";
function isGrokEmbedderOrigin(origin) {
	try {
		const url = new URL(origin);
		if (url.protocol !== "https:" && url.protocol !== "http:") return false;
		const host = url.hostname.toLowerCase();
		if (host === "grok.com" || host.endsWith(".grok.com")) return true;
		if (host === "localhost" || host === "127.0.0.1" || host === "[::1]") return true;
		return false;
	} catch {
		return false;
	}
}
function isSandboxPreviewGuestHost(hostname) {
	const host = hostname.toLowerCase();
	return host === "grok-sandbox.com" || host.endsWith(".grok-sandbox.com");
}
function isRemintPreviewPair(guestHost, parentHost) {
	const guest = guestHost.toLowerCase();
	const parent = parentHost.toLowerCase();
	const i = guest.indexOf(".preview.");
	if (i <= 0) return false;
	const label = guest.slice(0, i);
	const rest = guest.slice(i + 9);
	if (label.includes(".") || !rest.includes(".")) return false;
	return parent === rest || parent === `grok.${rest}`;
}
function resolveParentEmbedderOrigin(parentIsSelf, referrer, ancestorOrigin, guestHostname = "") {
	if (parentIsSelf) return null;
	for (const candidate of [referrer, ancestorOrigin ?? ""].filter(Boolean)) try {
		const url = new URL(candidate.includes("://") ? candidate : `https://${candidate}`);
		if (url.protocol !== "https:" && url.protocol !== "http:") continue;
		if (isGrokEmbedderOrigin(url.origin)) return url.origin;
		if (isSandboxPreviewGuestHost(guestHostname) || isRemintPreviewPair(guestHostname, url.hostname)) return url.origin;
	} catch {}
	return null;
}
/**
* Guest side of the grok-web ↔ sandbox preview postMessage bridge.
*
* Activates only when this page is framed by an allowlisted Grok embedder.
* Top-level runs (download/export, local `npm run dev`, deployed sites) noop.
*/
var PREVIEW_BRIDGE_CHANNEL = "grok-preview-bridge";
var EnvelopeSchema = object({
	channel: literal(PREVIEW_BRIDGE_CHANNEL),
	version: number().int().positive(),
	type: string().min(1)
});
var HelloSchema = EnvelopeSchema.extend({ type: literal("hello") });
var NavigateSchema = EnvelopeSchema.extend({
	type: literal("navigate"),
	path: string().min(1)
});
var HistorySchema = EnvelopeSchema.extend({
	type: literal("history"),
	delta: union([literal(-1), literal(1)])
});
var ConnectorTokenReadySchema = EnvelopeSchema.extend({ type: literal("connector-token-ready") });
function isSafeBridgePath(path) {
	if (!path.startsWith("/") || path.startsWith("//") || path.includes("\\")) return false;
	try {
		return new URL(path, "https://preview.invalid").origin === "https://preview.invalid";
	} catch {
		return false;
	}
}
/**
* Origin of the Grok embedder framing this page, or null when the page runs
* top-level (download/export, local `npm run dev`, deployed sites) or under a
* non-Grok parent. Client-only; null during SSR.
*/
function resolveCurrentEmbedderOrigin() {
	if (typeof window === "undefined") return null;
	const ancestorOrigin = typeof location.ancestorOrigins !== "undefined" && location.ancestorOrigins.length > 0 ? location.ancestorOrigins[0] : null;
	return resolveParentEmbedderOrigin(window.parent === window, document.referrer, ancestorOrigin, window.location.hostname);
}
/**
* Install host↔guest messaging. Returns a dispose function.
* Noops (returns a no-op dispose) when not embedded under a Grok parent.
*/
function installPreviewHostBridge(options = {}) {
	const parentOrigin = resolveCurrentEmbedderOrigin();
	if (parentOrigin === null) return () => {};
	const ROOT_STATE_KEY = "__grokPreviewBridgeRoot";
	const originalPushState = window.history.pushState.bind(window.history);
	const originalReplaceState = window.history.replaceState.bind(window.history);
	const isAtHistoryRoot = () => {
		const state = window.history.state;
		return Boolean(state && typeof state === "object" && state[ROOT_STATE_KEY] === true);
	};
	try {
		const current = window.history.state;
		if (!(current !== null && typeof current === "object" && Object.prototype.hasOwnProperty.call(current, ROOT_STATE_KEY))) {
			const isRoot = window.history.length <= 1;
			originalReplaceState(current && typeof current === "object" ? {
				...current,
				[ROOT_STATE_KEY]: isRoot
			} : { [ROOT_STATE_KEY]: isRoot }, "", window.location.href);
		}
	} catch {}
	const post = (message) => {
		window.parent.postMessage(message, parentOrigin);
	};
	const reportLocation = () => {
		post({
			channel: PREVIEW_BRIDGE_CHANNEL,
			version: 1,
			type: "location",
			path: window.location.pathname || "/",
			search: window.location.search,
			hash: window.location.hash
		});
	};
	const reportRoutes = () => {
		const paths = options.getRoutePaths?.() ?? [];
		post({
			channel: PREVIEW_BRIDGE_CHANNEL,
			version: 1,
			type: "routes",
			paths
		});
	};
	const defaultNavigate = (path) => {
		if (!isSafeBridgePath(path)) return;
		try {
			const url = new URL(path, window.location.origin);
			if (url.origin !== window.location.origin) return;
			const next = `${url.pathname}${url.search}${url.hash}`;
			window.history.pushState(window.history.state, "", next);
			window.dispatchEvent(new PopStateEvent("popstate", { state: window.history.state }));
		} catch {}
	};
	const navigate = (path) => {
		if (!isSafeBridgePath(path)) return;
		if (options.navigate) {
			options.navigate(path);
			return;
		}
		defaultNavigate(path);
	};
	const announce = () => {
		reportLocation();
		reportRoutes();
		post({
			channel: PREVIEW_BRIDGE_CHANNEL,
			version: 1,
			type: "ready"
		});
	};
	const onHello = (data) => {
		if (!HelloSchema.safeParse(data).success) return;
		announce();
	};
	const onNavigate = (data) => {
		const parsed = NavigateSchema.safeParse(data);
		if (!parsed.success) return;
		navigate(parsed.data.path);
		queueMicrotask(reportLocation);
	};
	const onHistory = (data) => {
		const parsed = HistorySchema.safeParse(data);
		if (!parsed.success) return;
		if (parsed.data.delta === -1 && isAtHistoryRoot()) return;
		window.history.go(parsed.data.delta);
	};
	const onConnectorTokenReady = (data) => {
		if (!ConnectorTokenReadySchema.safeParse(data).success) return;
		window.dispatchEvent(new Event(CONNECTOR_TOKEN_READY_EVENT));
	};
	const hostMessageHandlers = /* @__PURE__ */ new Map([
		["hello", onHello],
		["navigate", onNavigate],
		["history", onHistory],
		["connector-token-ready", onConnectorTokenReady]
	]);
	const onMessage = (event) => {
		if (event.source !== window.parent) return;
		if (event.origin !== parentOrigin) return;
		const envelope = EnvelopeSchema.safeParse(event.data);
		if (!envelope.success || envelope.data.version !== 1) return;
		hostMessageHandlers.get(envelope.data.type)?.(event.data);
	};
	const onPopState = () => {
		reportLocation();
	};
	const onHashChange = () => {
		reportLocation();
	};
	window.history.pushState = (data, unused, url) => {
		const next = data && typeof data === "object" ? {
			...data,
			[ROOT_STATE_KEY]: false
		} : data;
		originalPushState(next, unused, url);
		reportLocation();
	};
	window.history.replaceState = (data, unused, url) => {
		const next = isAtHistoryRoot() ? {
			...data && typeof data === "object" ? data : {},
			[ROOT_STATE_KEY]: true
		} : data;
		originalReplaceState(next, unused, url);
		reportLocation();
	};
	window.addEventListener("message", onMessage);
	window.addEventListener("popstate", onPopState);
	window.addEventListener("hashchange", onHashChange);
	announce();
	return () => {
		window.removeEventListener("message", onMessage);
		window.removeEventListener("popstate", onPopState);
		window.removeEventListener("hashchange", onHashChange);
		window.history.pushState = originalPushState;
		window.history.replaceState = originalReplaceState;
	};
}
/** Collect static path patterns from a TanStack route tree (best-effort). */
function collectRoutePathsFromTree(routeTree) {
	const paths = /* @__PURE__ */ new Set();
	const walk = (node) => {
		if (!node || typeof node !== "object") return;
		const record = node;
		const full = typeof record.fullPath === "string" ? record.fullPath : typeof record.path === "string" ? record.path : null;
		if (full !== null && full !== "") paths.add(full.startsWith("/") ? full : `/${full}`);
		else if (full === "") paths.add("/");
		const children = record.children;
		if (Array.isArray(children)) for (const child of children) walk(child);
		else if (children && typeof children === "object") for (const child of Object.values(children)) walk(child);
	};
	walk(routeTree);
	return [...paths];
}
/**
* Mount once in `__root.tsx` so the Grok preview chrome can drive navigation
* (and later receive registered routes). Noops when the app is not embedded.
*/
function PreviewHostBridge() {
	const router = useRouter();
	(0, import_react.useEffect)(() => {
		return installPreviewHostBridge({
			navigate: (path) => {
				router.history.push(path);
			},
			getRoutePaths: () => collectRoutePathsFromTree(router.routeTree)
		});
	}, [router]);
	return null;
}
var usePrefs = create()(persist((set) => ({
	lang: "ar",
	wilayaId: "",
	branch: {},
	ground: {},
	step: {},
	checks: {},
	seenNote: false,
	setLang: (lang) => set({ lang }),
	setWilaya: (wilayaId) => set({ wilayaId }),
	setBranch: (caseId, option) => set((s) => ({
		branch: {
			...s.branch,
			[caseId]: option
		},
		step: {
			...s.step,
			[caseId]: 0
		}
	})),
	setGround: (caseId, groundId) => set((s) => ({ ground: {
		...s.ground,
		[caseId]: groundId
	} })),
	setStep: (caseId, n) => set((s) => ({ step: {
		...s.step,
		[caseId]: n
	} })),
	toggleCheck: (key) => set((s) => ({ checks: {
		...s.checks,
		[key]: !s.checks[key]
	} })),
	dismissNote: () => set({ seenNote: true })
}), {
	name: "mizan",
	skipHydration: true,
	storage: createJSONStorage(() => localStorage)
}));
function tx(lang, text) {
	return text[lang];
}
function fill(text, wilaya, lang) {
	const name = wilaya || (lang === "ar" ? "ولايتك" : "votre wilaya");
	return text.replaceAll("{wilaya}", name);
}
function fold(value) {
	return value.toLowerCase().normalize("NFD").replace(/\p{M}/gu, "").replace(/[إأآا]/g, "ا").replace(/ة/g, "ه").replace(/ى/g, "ي").replace(/[ؤئ]/g, "ء");
}
var ui = {
	ar: {
		mark: "ميزان",
		latin: "MIZAN",
		tag: "المسار، المكان، والنص. لقضيتك في الجزائر.",
		search: "ابحث: طلاق، نفقة، أجر، شكوى، فريضة…",
		wilaya: "الولاية",
		wilayaPick: "اختر الولاية",
		wilayaHint: "عيّن الولاية ليُكتب اسم المحكمة في كل خطوة.",
		ask: "ما الذي وقع؟",
		how: [
			"اختر الواقعة",
			"عيّن الولاية",
			"اتبع المكان ثم الإجراء ثم النص"
		],
		root: "أصل القانون",
		cases: "القضايا",
		back: "القضايا",
		changePath: "غيّر الصورة",
		next: "الخطوة التالية",
		prev: "السابقة",
		done: "بلغت آخر خطوة",
		stepOf: "الخطوة",
		of: "من",
		where: "أين",
		do: "ماذا تفعل",
		bring: "ماذا تُحضر",
		rule: "النص الذي يُطبَّق",
		delay: "أجل لا يُفوَّت",
		caution: "تنبيه",
		official: "نص منشور",
		guide: "مسار موجَّه، لا اقتباس حرفي",
		frNote: "الترجمة الفرنسية مؤشّرة. النص الرسمي عربي.",
		empty: "لا نتيجة. جرّب كلمة من الواقعة: نفقة، خلع، شيك، إلغاء.",
		articles: "مواد",
		continue: "أكمل من حيث وقفت",
		dismiss: "فهمت، أبدأ",
		noteTitle: "قبل أن تبدأ",
		noteBody: "ميزان يرتّب المسار حسب نصوص منشورة: قانون الأسرة بعد أمر 2005، قانون الإجراءات المدنية والإدارية، قانون تسوية نزاعات العمل، وما نشرته وزارة الداخلية ومجالس قضائية عن الحالة المدنية. ليس محامياً ولا يحل محل أمانة الضبط. الاستثناءات كثيرة والنصوص تُعدَّل. إن كان في الملف عنف أو حبس أو قاصر، ابدأ بالنيابة أو بمحامٍ.",
		foot: "توجيه إجرائي، ليس استشارة. أكّد الاختصاص والأجل عند أمانة الضبط قبل الإيداع.",
		skeletonTitle: "هيكل عريضة للترتيب فقط",
		skeletonHint: "ليست مطبوعة رسمية. طابقها مع المادة 15 ثم وقّعها. النقص الشكلي يعرّضها لعدم القبول.",
		copy: "انسخ الهيكل",
		copied: "نُسخ",
		places: "الأماكن بأسمائها",
		open: "افتح المادة",
		allCodes: "النصوص",
		ground: "سبب التطليق",
		noCase: "هذه الواقعة غير موجودة.",
		deadlinesTitle: "آجال تُسقط الحق",
		lang: "FR",
		seen: "نُظمت"
	},
	fr: {
		mark: "Mizan",
		latin: "ميزان",
		tag: "Le lieu, le geste, le texte. Pour votre affaire en Algérie.",
		search: "Divorce, pension, salaire, plainte, succession…",
		wilaya: "Wilaya",
		wilayaPick: "Choisir la wilaya",
		wilayaHint: "Indiquez la wilaya pour que le nom du tribunal s'écrive dans chaque étape.",
		ask: "Que s'est-il passé ?",
		how: [
			"Choisissez le fait",
			"Indiquez la wilaya",
			"Suivez le lieu, puis le geste, puis le texte"
		],
		root: "Le socle",
		cases: "Affaires",
		back: "Affaires",
		changePath: "Changer de voie",
		next: "Étape suivante",
		prev: "Précédente",
		done: "Dernière étape atteinte",
		stepOf: "Étape",
		of: "sur",
		where: "Où",
		do: "Quoi faire",
		bring: "Quoi apporter",
		rule: "Le texte qui s'applique",
		delay: "Délai à ne pas manquer",
		caution: "Attention",
		official: "Texte publié",
		guide: "Chemin guidé, pas une citation littérale",
		frNote: "La traduction française est indicative. Le texte officiel est en arabe.",
		empty: "Aucun résultat. Essayez un mot du fait : pension, khul', chèque, annulation.",
		articles: "Articles",
		continue: "Reprendre où vous en étiez",
		dismiss: "Compris, je commence",
		noteTitle: "Avant de commencer",
		noteBody: "Mizan range le chemin selon des textes publiés : code de la famille après l'ordonnance de 2005, code de procédure civile et administrative, loi sur les conflits individuels du travail, et ce que le ministère de l'Intérieur et des cours ont publié sur l'état civil. Ce n'est pas un avocat et cela ne remplace pas le greffe. Les exceptions sont nombreuses et les textes changent. S'il y a violence, détention ou un mineur, commencez par le parquet ou un avocat.",
		foot: "Orientation de procédure, pas une consultation. Confirmez la compétence et le délai au greffe avant de déposer.",
		skeletonTitle: "Ossature de requête, pour vous organiser",
		skeletonHint: "Ce n'est pas un imprimé officiel. Calez-la sur l'article 15, puis signez. Un vice de forme l'expose à l'irrecevabilité.",
		copy: "Copier l'ossature",
		copied: "Copié",
		places: "Les lieux, par leur nom",
		open: "Ouvrir l'article",
		allCodes: "Textes",
		ground: "Motif du divorce demandé",
		noCase: "Cette affaire n'existe pas.",
		deadlinesTitle: "Délais qui font tomber le droit",
		lang: "ع",
		seen: "vu"
	}
};
var places = [
	{
		name: {
			ar: "أمانة الضبط",
			fr: "Greffe"
		},
		body: {
			ar: "مكتب داخل المحكمة تُودع فيه العريضة وتُستلم منه النسخ ورقم القضية وتاريخ الجلسة.",
			fr: "Bureau du tribunal où l'on dépose la requête et où l'on retire les copies, le numéro et la date d'audience."
		}
	},
	{
		name: {
			ar: "المحضر القضائي",
			fr: "Huissier de justice"
		},
		body: {
			ar: "من يبلّغ الخصم رسمياً وينفّذ السندات. ليس عون الشباك في المحكمة.",
			fr: "Il notifie officiellement l'adversaire et exécute les titres. Ce n'est pas l'agent du guichet du tribunal."
		}
	},
	{
		name: {
			ar: "وكيل الجمهورية",
			fr: "Procureur de la République"
		},
		body: {
			ar: "النيابة في المحكمة. الشكاوى الجزائية وتصحيح الحالة المدنية الجوهرية يمران من هنا.",
			fr: "Le parquet du tribunal. Les plaintes pénales et la rectification substantielle de l'état civil passent par lui."
		}
	},
	{
		name: {
			ar: "قسم شؤون الأسرة",
			fr: "Section familiale"
		},
		body: {
			ar: "قسم في المحكمة العادية: الطلاق، الحضانة، النفقة، التركة المتنازع عليها، التراخيص الأسرية.",
			fr: "Section du tribunal judiciaire : divorce, garde, entretien, succession litigieuse, autorisations familiales."
		}
	},
	{
		name: {
			ar: "القسم الاجتماعي",
			fr: "Section sociale"
		},
		body: {
			ar: "قسم منازعات العمل الفردية، بعد محضر عدم الصلح.",
			fr: "Section des conflits individuels du travail, après le procès-verbal de non-conciliation."
		}
	},
	{
		name: {
			ar: "المحكمة الإدارية",
			fr: "Tribunal administratif"
		},
		body: {
			ar: "تقضي في إلغاء القرارات الإدارية. ليست المحكمة التي تنظر الطلاق أو الدين.",
			fr: "Elle juge l'annulation des décisions administratives. Ce n'est pas le tribunal du divorce ou de la créance."
		}
	},
	{
		name: {
			ar: "الموثق",
			fr: "Notaire"
		},
		body: {
			ar: "يحرر الفريضة والعقود. لا يحل محل القاضي إذا وُجد نزاع.",
			fr: "Il dresse la dévolution successorale et les actes. Il ne remplace pas le juge s'il y a litige."
		}
	},
	{
		name: {
			ar: "مكتب المصالحة",
			fr: "Bureau de conciliation"
		},
		body: {
			ar: "أمام مفتشية العمل. محضره، لا رسالة المفتش وحدها، هو الذي يُرفق بدعوى القسم الاجتماعي.",
			fr: "Auprès de l'inspection du travail. C'est son procès-verbal, pas la seule lettre de l'inspecteur, qui se joint à l'action sociale."
		}
	},
	{
		name: {
			ar: "ضابط الحالة المدنية",
			fr: "Officier de l'état civil"
		},
		body: {
			ar: "في البلدية. يسلّم العقود ويصحح أخطاء الحجز المادية. لا يُطلق ولا يغيّر لقباً.",
			fr: "À la commune. Il délivre les actes et corrige les erreurs matérielles de saisie. Il ne divorce pas et ne change pas un nom."
		}
	},
	{
		name: {
			ar: "المحافظة العقارية",
			fr: "Conservation foncière"
		},
		body: {
			ar: "فيها يُشهر انتقال العقار بعد القسمة أو البيع. الفريضة وحدها لا تغيّر الدفتر العقاري.",
			fr: "C'est là que se publie le transfert d'un immeuble après partage ou vente. La dévolution seule ne change pas le livret foncier."
		}
	}
];
function skeleton(lang, court) {
	if (lang === "ar") return `إلى السيد رئيس ${court}

عريضة افتتاح دعوى

لفائدة: ............... الساكن بـ ...............

ضد: ............... الساكن بـ ...............

سيدي الرئيس،

الوقائع:
...............

الوسائل:
المواد ...............

الطلبات:
1. ...............

المستندات المرفقة:
1. ...............

حرر بـ ............... في ...............
الإمضاء`;
	return `À Monsieur le président — ${court}

Requête introductive d'instance

Pour : ............... demeurant à ...............

Contre : ............... demeurant à ...............

Monsieur le Président,

Faits :
...............

Moyens :
Articles ...............

Demandes :
1. ...............

Pièces jointes :
1. ...............

Fait à ............... le ...............
Signature`;
}
/** The 58 wilayas. The court name in each step uses the one you pick. */
var wilayas = [
	[
		"01",
		"أدرار",
		"Adrar"
	],
	[
		"02",
		"الشلف",
		"Chlef"
	],
	[
		"03",
		"الأغواط",
		"Laghouat"
	],
	[
		"04",
		"أم البواقي",
		"Oum El Bouaghi"
	],
	[
		"05",
		"باتنة",
		"Batna"
	],
	[
		"06",
		"بجاية",
		"Béjaïa"
	],
	[
		"07",
		"بسكرة",
		"Biskra"
	],
	[
		"08",
		"بشار",
		"Béchar"
	],
	[
		"09",
		"البليدة",
		"Blida"
	],
	[
		"10",
		"البويرة",
		"Bouira"
	],
	[
		"11",
		"تمنراست",
		"Tamanrasset"
	],
	[
		"12",
		"تبسة",
		"Tébessa"
	],
	[
		"13",
		"تلمسان",
		"Tlemcen"
	],
	[
		"14",
		"تيارت",
		"Tiaret"
	],
	[
		"15",
		"تيزي وزو",
		"Tizi Ouzou"
	],
	[
		"16",
		"الجزائر",
		"Alger"
	],
	[
		"17",
		"الجلفة",
		"Djelfa"
	],
	[
		"18",
		"جيجل",
		"Jijel"
	],
	[
		"19",
		"سطيف",
		"Sétif"
	],
	[
		"20",
		"سعيدة",
		"Saïda"
	],
	[
		"21",
		"سكيكدة",
		"Skikda"
	],
	[
		"22",
		"سيدي بلعباس",
		"Sidi Bel Abbès"
	],
	[
		"23",
		"عنابة",
		"Annaba"
	],
	[
		"24",
		"قالمة",
		"Guelma"
	],
	[
		"25",
		"قسنطينة",
		"Constantine"
	],
	[
		"26",
		"المدية",
		"Médéa"
	],
	[
		"27",
		"مستغانم",
		"Mostaganem"
	],
	[
		"28",
		"المسيلة",
		"M'Sila"
	],
	[
		"29",
		"معسكر",
		"Mascara"
	],
	[
		"30",
		"ورقلة",
		"Ouargla"
	],
	[
		"31",
		"وهران",
		"Oran"
	],
	[
		"32",
		"البيض",
		"El Bayadh"
	],
	[
		"33",
		"إليزي",
		"Illizi"
	],
	[
		"34",
		"برج بوعريريج",
		"Bordj Bou Arréridj"
	],
	[
		"35",
		"بومرداس",
		"Boumerdès"
	],
	[
		"36",
		"الطارف",
		"El Tarf"
	],
	[
		"37",
		"تندوف",
		"Tindouf"
	],
	[
		"38",
		"تيسمسيلت",
		"Tissemsilt"
	],
	[
		"39",
		"الوادي",
		"El Oued"
	],
	[
		"40",
		"خنشلة",
		"Khenchela"
	],
	[
		"41",
		"سوق أهراس",
		"Souk Ahras"
	],
	[
		"42",
		"تيبازة",
		"Tipaza"
	],
	[
		"43",
		"ميلة",
		"Mila"
	],
	[
		"44",
		"عين الدفلى",
		"Aïn Defla"
	],
	[
		"45",
		"النعامة",
		"Naâma"
	],
	[
		"46",
		"عين تموشنت",
		"Aïn Témouchent"
	],
	[
		"47",
		"غرداية",
		"Ghardaïa"
	],
	[
		"48",
		"غليزان",
		"Relizane"
	],
	[
		"49",
		"تيميمون",
		"Timimoun"
	],
	[
		"50",
		"برج باجي مختار",
		"Bordj Badji Mokhtar"
	],
	[
		"51",
		"أولاد جلال",
		"Ouled Djellal"
	],
	[
		"52",
		"بني عباس",
		"Béni Abbès"
	],
	[
		"53",
		"عين صالح",
		"In Salah"
	],
	[
		"54",
		"عين قزام",
		"In Guezzam"
	],
	[
		"55",
		"تقرت",
		"Touggourt"
	],
	[
		"56",
		"جانت",
		"Djanet"
	],
	[
		"57",
		"المغير",
		"El M'Ghair"
	],
	[
		"58",
		"المنيعة",
		"El Meniaa"
	]
].map(([id, ar, fr]) => ({
	id,
	name: {
		ar,
		fr
	}
}));
function Boot() {
	const lang = usePrefs((s) => s.lang);
	(0, import_react.useEffect)(() => {
		usePrefs.persist.rehydrate();
	}, []);
	(0, import_react.useEffect)(() => {
		document.documentElement.lang = lang;
		document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
	}, [lang]);
	return null;
}
function Shell({ children }) {
	const lang = usePrefs((s) => s.lang);
	const wilayaId = usePrefs((s) => s.wilayaId);
	const setLang = usePrefs((s) => s.setLang);
	const setWilaya = usePrefs((s) => s.setWilaya);
	const path = useRouterState({ select: (s) => s.location.pathname });
	const t = ui[lang];
	const onRoot = path.startsWith("/root");
	const onWalk = path.startsWith("/walk");
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-dvh bg-paper text-ink",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Boot, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("header", {
				className: "sticky top-0 z-30 border-b border-line bg-paper/95 backdrop-blur-sm",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mx-auto flex max-w-5xl items-center gap-3 px-4 py-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
							to: "/",
							className: "flex items-baseline gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-display text-3xl leading-none text-green",
								children: lang === "ar" ? "ميزان" : "Mizan"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-xs tracking-widest text-muted",
								children: lang === "ar" ? "MIZAN" : "ميزان"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("nav", {
							className: "ms-4 hidden gap-1 sm:flex",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/",
								className: `rounded-md px-3 py-2 text-sm ${path === "/" ? "bg-green-soft text-green" : "text-muted"}`,
								children: t.cases
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/root",
								className: `rounded-md px-3 py-2 text-sm ${onRoot ? "bg-green-soft text-green" : "text-muted"}`,
								children: t.root
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "ms-auto flex items-center gap-2",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
									className: "sr-only",
									htmlFor: "wilaya",
									children: t.wilaya
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
									id: "wilaya",
									value: wilayaId,
									onChange: (e) => setWilaya(e.target.value),
									className: "h-11 max-w-40 rounded-md border border-line bg-sheet px-2 text-sm text-ink",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: "",
										children: t.wilayaPick
									}), wilayas.map((w) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("option", {
										value: w.id,
										children: [
											w.id,
											" · ",
											tx(lang, w.name)
										]
									}, w.id))]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									onClick: () => setLang(lang === "ar" ? "fr" : "ar"),
									className: "h-11 rounded-md border border-line bg-sheet px-3 text-sm font-medium text-green",
									children: t.lang
								})
							]
						})
					]
				})
			}),
			!wilayaId && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "border-b border-line bg-green-soft px-4 py-2 text-center text-sm text-green",
				children: t.wilayaHint
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "border-b border-line px-4 py-2 text-center text-xs leading-relaxed text-muted",
				children: t.foot
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
				className: `mx-auto w-full max-w-5xl px-4 pt-6 ${onWalk ? "pb-36" : "pb-24 sm:pb-12"}`,
				children
			}),
			!onWalk && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("footer", {
				className: "fixed inset-x-0 bottom-0 z-30 border-t border-line bg-sheet sm:hidden",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("nav", {
					className: "mx-auto flex max-w-5xl sm:hidden",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/",
						className: `flex h-14 flex-1 items-center justify-center text-sm ${path === "/" ? "text-green" : "text-muted"}`,
						children: t.cases
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/root",
						className: `flex h-14 flex-1 items-center justify-center text-sm ${onRoot ? "text-green" : "text-muted"}`,
						children: t.root
					})]
				})
			})
		]
	});
}
var styles_default = "/assets/styles-DYjbeep1.css";
var Route$5 = createRootRoute({
	head: () => ({
		meta: [
			{ charSet: "utf-8" },
			{
				name: "viewport",
				content: "width=device-width, initial-scale=1"
			},
			{ title: "ميزان — المسار القانوني" },
			{
				name: "description",
				content: "مسار القضايا في القانون الجزائري: أين تذهب، ماذا تفعل، وأي نص يُطبَّق."
			},
			{
				name: "theme-color",
				content: "#1e4636"
			}
		],
		links: [
			{
				rel: "icon",
				type: "image/svg+xml",
				href: "/favicon.svg"
			},
			{
				rel: "stylesheet",
				href: styles_default
			},
			{
				rel: "manifest",
				href: "/__grok/manifest.webmanifest"
			},
			{
				rel: "apple-touch-icon",
				href: "/__grok/icon-180.png"
			},
			{
				rel: "stylesheet",
				href: "https://fonts.googleapis.com/css2?family=Amiri:wght@400;700&family=IBM+Plex+Sans+Arabic:wght@400;500;600;700&display=swap"
			}
		]
	}),
	component: () => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("html", {
		lang: "ar",
		dir: "rtl",
		suppressHydrationWarning: true,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("head", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HeadContent, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("body", { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PreviewHostBridge, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AuthProvider, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Shell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Outlet, {}) }) }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Scripts, {})
		] })]
	})
});
var $$splitComponentImporter$4 = () => import("./routes-CrdLg3t_.mjs");
var Route$4 = createFileRoute("/")({ component: lazyRouteComponent($$splitComponentImporter$4, "component") });
var $$splitComponentImporter$3 = () => import("./root-DA8YiRuK.mjs");
var Route$3 = createFileRoute("/root")({ component: lazyRouteComponent($$splitComponentImporter$3, "component") });
var $$splitComponentImporter$2 = () => import("./root.index-CxN4SIAo.mjs");
var Route$2 = createFileRoute("/root/")({ component: lazyRouteComponent($$splitComponentImporter$2, "component") });
var $$splitComponentImporter$1 = () => import("./root._codeId-CX1qBpWV.mjs");
var Route$1 = createFileRoute("/root/$codeId")({ component: lazyRouteComponent($$splitComponentImporter$1, "component") });
var $$splitComponentImporter = () => import("./walk._caseId-BqMOtc34.mjs");
var Route = createFileRoute("/walk/$caseId")({ component: lazyRouteComponent($$splitComponentImporter, "component") });
var IndexRoute = Route$4.update({
	id: "/",
	path: "/",
	getParentRoute: () => Route$5
});
var RootRoute = Route$3.update({
	id: "/root",
	path: "/root",
	getParentRoute: () => Route$5
});
var RootIndexRoute = Route$2.update({
	id: "/",
	path: "/",
	getParentRoute: () => RootRoute
});
var RootCodeIdRoute = Route$1.update({
	id: "/$codeId",
	path: "/$codeId",
	getParentRoute: () => RootRoute
});
var WalkCaseIdRoute = Route.update({
	id: "/walk/$caseId",
	path: "/walk/$caseId",
	getParentRoute: () => Route$5
});
var RootRouteChildren = {
	RootCodeIdRoute,
	RootIndexRoute
};
var rootRouteChildren = {
	IndexRoute,
	RootRoute: RootRoute._addFileChildren(RootRouteChildren),
	WalkCaseIdRoute
};
var routeTree = Route$5._addFileChildren(rootRouteChildren)._addFileTypes();
var router_exports = /* @__PURE__ */ __exportAll({ getRouter: () => getRouter });
function getRouter() {
	return createRouter({
		routeTree,
		rewrite: previewPathRewrite(),
		defaultErrorComponent: AppErrorComponent
	});
}
//#endregion
export { fill as a, skeleton as c, usePrefs as d, wilayas as i, tx as l, Route as n, fold as o, Route$1 as r, places as s, router_exports as t, ui as u };
