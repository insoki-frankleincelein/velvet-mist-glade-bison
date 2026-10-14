import { i as __toESM } from "../_runtime.mjs";
import { J as require_react, S as require_jsx_runtime, b as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { d as usePrefs, l as tx, r as Route$1, u as ui } from "./router-CL_ZcFmw.mjs";
import { i as codes, r as articlesOf } from "./articles-DxRBvEzz.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/root._codeId-CX1qBpWV.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function CodePage() {
	const { codeId } = Route$1.useParams();
	const lang = usePrefs((s) => s.lang);
	const t = ui[lang];
	const code = codes.find((c) => c.id === codeId);
	const list = articlesOf(codeId);
	(0, import_react.useEffect)(() => {
		const id = window.location.hash.replace("#", "");
		if (!id) return;
		document.getElementById(id)?.scrollIntoView({ block: "start" });
	}, [codeId]);
	if (!code) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
		className: "text-muted",
		children: [
			t.noCase,
			" ",
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
				to: "/root",
				className: "text-green",
				children: t.root
			})
		]
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
			to: "/root",
			className: "text-sm text-green",
			children: t.root
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
			className: "mt-2 font-display text-4xl text-green",
			children: tx(lang, code.name)
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-2 max-w-2xl text-sm leading-relaxed text-muted",
			children: tx(lang, code.instrument)
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-2 text-xs text-muted",
			children: t.frNote
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mt-6 space-y-4",
			children: list.map((a) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
				id: a.id,
				className: "scroll-mt-24 rounded-lg border border-line bg-sheet p-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
						className: "flex flex-wrap items-baseline gap-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "font-display text-2xl text-green",
								children: ["م ", a.num]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "font-medium",
								children: tx(lang, a.heading)
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: `rounded-md px-2 py-0.5 text-xs ${a.verbatim ? "bg-green-soft text-green" : "bg-seal-soft text-seal"}`,
								children: a.verbatim ? t.official : t.guide
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-3 font-display text-xl leading-relaxed text-ink",
						lang: "ar",
						dir: "rtl",
						children: a.text.ar
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-3 text-sm leading-relaxed text-muted",
						lang: "fr",
						dir: "ltr",
						children: a.text.fr
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-3 text-xs text-muted",
						children: tx(lang, a.source)
					})
				]
			}, a.id))
		})
	] });
}
//#endregion
export { CodePage as component };
