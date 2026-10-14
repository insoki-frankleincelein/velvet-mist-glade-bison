import { S as require_jsx_runtime, b as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { d as usePrefs, l as tx, s as places, u as ui } from "./router-CL_ZcFmw.mjs";
import { i as codes } from "./articles-DxRBvEzz.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/root.index-CxN4SIAo.js
var import_jsx_runtime = require_jsx_runtime();
function RootIndex() {
	const lang = usePrefs((s) => s.lang);
	const t = ui[lang];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
			className: "font-display text-4xl text-green",
			children: t.root
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-2 max-w-xl text-muted",
			children: t.frNote
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
			className: "mt-6 divide-y divide-line border-y border-line",
			children: codes.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
				to: "/root/$codeId",
				params: { codeId: c.id },
				className: "block py-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "block text-lg font-medium",
					children: tx(lang, c.name)
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "mt-1 block text-sm leading-relaxed text-muted",
					children: tx(lang, c.instrument)
				})]
			}) }, c.id))
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
			className: "mt-10 font-display text-3xl text-green",
			children: t.places
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dl", {
			className: "mt-4 grid gap-4 sm:grid-cols-2",
			children: places.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-lg border border-line bg-sheet p-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
					className: "font-medium text-green",
					children: tx(lang, p.name)
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
					className: "mt-1 text-sm leading-relaxed text-ink",
					children: tx(lang, p.body)
				})]
			}, p.name.ar))
		})
	] });
}
//#endregion
export { RootIndex as component };
