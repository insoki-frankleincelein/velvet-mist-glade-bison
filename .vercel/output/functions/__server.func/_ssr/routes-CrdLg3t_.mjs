import { i as __toESM } from "../_runtime.mjs";
import { J as require_react, S as require_jsx_runtime, b as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { d as usePrefs, l as tx, o as fold, u as ui } from "./router-CL_ZcFmw.mjs";
import { n as articles } from "./articles-DxRBvEzz.mjs";
import { n as cases, r as groups } from "./cases-CRQ78qcS.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-CrdLg3t_.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var deadlines = [
	{
		id: "work",
		kicker: {
			ar: "6 أشهر",
			fr: "6 mois"
		},
		body: {
			ar: "من تسليم محضر عدم الصلح إلى دعوى القسم الاجتماعي.",
			fr: "De la remise du PV de non-conciliation à l'action sociale."
		}
	},
	{
		id: "admin",
		kicker: {
			ar: "4 أشهر",
			fr: "4 mois"
		},
		body: {
			ar: "لإلغاء قرار إداري، من التبليغ الشخصي أو من النشر.",
			fr: "Pour annuler une décision administrative, dès la notification ou la publication."
		}
	},
	{
		id: "debt",
		kicker: {
			ar: "شهر / شهران",
			fr: "1 mois / 2 mois"
		},
		body: {
			ar: "لاستئناف حكم مدني: شهر إن بُلّغت شخصياً، شهران إن بُلّغت في الموطن.",
			fr: "Pour appeler un jugement civil : un mois à personne, deux mois au domicile."
		}
	}
];
function Home() {
	const lang = usePrefs((s) => s.lang);
	const seen = usePrefs((s) => s.seenNote);
	const dismiss = usePrefs((s) => s.dismissNote);
	const step = usePrefs((s) => s.step);
	const [q, setQ] = (0, import_react.useState)("");
	const [ready, setReady] = (0, import_react.useState)(false);
	const t = ui[lang];
	(0, import_react.useEffect)(() => {
		let on = true;
		const pending = usePrefs.persist.rehydrate();
		Promise.resolve(pending).finally(() => {
			if (on) setReady(true);
		});
		return () => {
			on = false;
		};
	}, []);
	const query = fold(q.trim());
	const foundCases = (0, import_react.useMemo)(() => {
		if (!query) return cases;
		return cases.filter((c) => fold(`${tx(lang, c.title)} ${tx(lang, c.lead)}`).includes(query));
	}, [query, lang]);
	const foundArticles = (0, import_react.useMemo)(() => {
		if (!query) return [];
		return articles.filter((a) => fold(`${a.num} ${tx(lang, a.heading)} ${tx(lang, a.text)}`).includes(query)).slice(0, 6);
	}, [query, lang]);
	const resume = cases.find((c) => (step[c.id] ?? 0) > 0);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "font-display text-4xl leading-tight text-green sm:text-5xl",
			children: t.mark
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-2 max-w-xl text-lg text-ink",
			children: t.tag
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ol", {
			className: "mt-4 flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted",
			children: t.how.map((item, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "text-green",
					children: [i + 1, "."]
				}),
				" ",
				item
			] }, item))
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
			className: "mt-6 block",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "sr-only",
				children: t.search
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
				value: q,
				onChange: (e) => setQ(e.target.value),
				placeholder: t.search,
				className: "h-12 w-full border-b border-line bg-transparent text-lg outline-none placeholder:text-muted"
			})]
		}),
		!query && resume && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
			to: "/walk/$caseId",
			params: { caseId: resume.id },
			className: "mt-4 flex items-center justify-between rounded-lg border border-line bg-sheet px-4 py-3",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "block text-xs text-muted",
				children: t.continue
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "font-medium",
				children: tx(lang, resume.title)
			})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
				className: "text-green",
				children: [
					t.stepOf,
					" ",
					(step[resume.id] ?? 0) + 1
				]
			})]
		}),
		!query && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "mt-8",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "text-sm font-medium text-muted",
				children: t.deadlinesTitle
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-3 grid gap-3 sm:grid-cols-3",
				children: deadlines.map((d) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
					to: "/walk/$caseId",
					params: { caseId: d.id },
					className: "rounded-lg border border-line bg-seal-soft px-4 py-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "font-display text-2xl text-seal",
						children: tx(lang, d.kicker)
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "mt-1 block text-sm leading-relaxed text-ink",
						children: tx(lang, d.body)
					})]
				}, d.id))
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
			className: "mt-8 text-sm font-medium text-muted",
			children: t.ask
		}),
		foundCases.length === 0 && foundArticles.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-4 text-muted",
			children: t.empty
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mt-3 space-y-8",
			children: groups.map((g) => {
				const list = foundCases.filter((c) => c.group === g.id);
				if (!list.length) return null;
				return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [!query && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
					className: "mb-2 font-display text-2xl text-green",
					children: tx(lang, g.label)
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "divide-y divide-line border-y border-line",
					children: list.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: "/walk/$caseId",
						params: { caseId: c.id },
						className: "block py-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "block text-lg font-medium",
							children: tx(lang, c.title)
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "mt-1 block text-sm leading-relaxed text-muted",
							children: tx(lang, c.lead)
						})]
					}) }, c.id))
				})] }, g.id);
			})
		}),
		foundArticles.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "mt-8",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "text-sm font-medium text-muted",
				children: t.articles
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "mt-2 divide-y divide-line border-y border-line",
				children: foundArticles.map((a) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
					to: "/root/$codeId",
					params: { codeId: a.codeId },
					hash: a.id,
					className: "block py-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "text-green",
							children: ["م ", a.num]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "mx-2 font-medium",
							children: tx(lang, a.heading)
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "mt-1 block text-sm text-muted",
							children: tx(lang, a.text).slice(0, 140)
						})
					]
				}) }, a.id))
			})]
		}),
		ready && !seen && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Note, {
			lang,
			onClose: dismiss
		})
	] });
}
function Note({ lang, onClose }) {
	const t = ui[lang];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "fixed inset-0 z-40 flex items-end justify-center bg-ink/40 p-4 sm:items-center",
		role: "dialog",
		"aria-modal": "true",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "w-full max-w-lg rounded-xl border border-line bg-sheet p-6",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-display text-3xl text-green",
					children: t.noteTitle
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-3 text-sm leading-relaxed text-ink",
					children: t.noteBody
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: onClose,
					className: "mt-5 h-12 w-full rounded-md bg-green text-on-green",
					children: t.dismiss
				})
			]
		})
	});
}
//#endregion
export { Home as component };
