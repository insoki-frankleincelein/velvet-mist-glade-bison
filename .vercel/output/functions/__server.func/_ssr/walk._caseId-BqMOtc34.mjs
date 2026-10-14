import { i as __toESM } from "../_runtime.mjs";
import { J as require_react, S as require_jsx_runtime, b as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { a as fill, c as skeleton, d as usePrefs, i as wilayas, l as tx, n as Route, u as ui } from "./router-CL_ZcFmw.mjs";
import { t as articleById } from "./articles-DxRBvEzz.mjs";
import { i as tatliqGrounds, r as groups, t as caseById } from "./cases-CRQ78qcS.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/walk._caseId-BqMOtc34.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function Walk() {
	const { caseId } = Route.useParams();
	const lang = usePrefs((s) => s.lang);
	const wilayaId = usePrefs((s) => s.wilayaId);
	const branch = usePrefs((s) => s.branch[caseId]);
	const groundId = usePrefs((s) => s.ground[caseId]);
	const stepIndex = usePrefs((s) => s.step[caseId] ?? 0);
	const checks = usePrefs((s) => s.checks);
	const setBranch = usePrefs((s) => s.setBranch);
	const setGround = usePrefs((s) => s.setGround);
	const setStep = usePrefs((s) => s.setStep);
	const toggleCheck = usePrefs((s) => s.toggleCheck);
	const t = ui[lang];
	const guide = caseById.get(caseId);
	if (!guide) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
		t.noCase,
		" ",
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
			to: "/",
			className: "text-green",
			children: t.back
		})
	] });
	const wilaya = wilayas.find((w) => w.id === wilayaId);
	const place = wilaya ? tx(lang, wilaya.name) : "";
	const group = groups.find((g) => g.id === guide.group);
	const steps = guide.steps.filter((s) => !s.when || branch && s.when.includes(branch));
	const needChoice = Boolean(guide.choice) && !branch;
	const index = Math.min(stepIndex, Math.max(steps.length - 1, 0));
	const step = steps[index];
	const court = fill(tx(lang, guide.forum), place, lang);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
			to: "/",
			className: "text-sm text-green",
			children: t.back
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-3 text-sm text-muted",
			children: group ? tx(lang, group.label) : ""
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
			className: "font-display text-4xl text-green",
			children: tx(lang, guide.title)
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-2 max-w-2xl leading-relaxed text-ink",
			children: tx(lang, guide.lead)
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-3 max-w-2xl rounded-lg border border-line bg-green-soft px-4 py-3 text-sm leading-relaxed text-green",
			children: court
		}),
		guide.choice && branch && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
			type: "button",
			onClick: () => setBranch(caseId, ""),
			className: "mt-3 text-sm text-muted underline",
			children: t.changePath
		}),
		needChoice && guide.choice && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mt-6 grid gap-3",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "text-lg font-medium",
				children: tx(lang, guide.choice.question)
			}), guide.choice.options.map((o) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
				type: "button",
				onClick: () => setBranch(caseId, o.id),
				className: "rounded-lg border border-line bg-sheet px-4 py-4 text-start",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "block text-lg font-medium",
					children: tx(lang, o.label)
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "mt-1 block text-sm leading-relaxed text-muted",
					children: tx(lang, o.detail)
				})]
			}, o.id))]
		}),
		!needChoice && step && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-6 text-sm text-muted",
				children: [
					t.stepOf,
					" ",
					index + 1,
					" ",
					t.of,
					" ",
					steps.length
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-2 flex gap-1",
				children: steps.map((s, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					"aria-label": `${t.stepOf} ${i + 1}`,
					onClick: () => setStep(caseId, i),
					className: `h-2 flex-1 rounded-full ${i === index ? "bg-green" : i < index ? "bg-green/40" : "bg-line"}`
				}, s.id))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "mt-4 font-display text-3xl text-ink",
				children: tx(lang, step.title)
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Band, {
				kicker: t.where,
				body: fill(tx(lang, step.where), place, lang)
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "mt-4 rounded-lg border border-line bg-sheet p-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
					className: "text-sm font-medium text-green",
					children: t.do
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ol", {
					className: "mt-2 space-y-3",
					children: step.actions.map((a, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
						className: "flex gap-3 text-sm leading-relaxed",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-display text-xl leading-none text-green",
							children: i + 1
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: fill(tx(lang, a), place, lang) })]
					}, a.ar))
				})]
			}),
			step.grounds && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "mt-4 rounded-lg border border-line bg-sheet p-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
					className: "text-sm font-medium text-green",
					children: t.ground
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-3 grid gap-2",
					children: tatliqGrounds.map((g) => {
						const on = groundId === g.id;
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							onClick: () => setGround(caseId, g.id),
							className: `rounded-md border px-3 py-3 text-start text-sm ${on ? "border-green bg-green-soft" : "border-line"}`,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-medium",
								children: tx(lang, g.label)
							}), on && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "mt-1 block leading-relaxed text-ink",
								children: tx(lang, g.proof)
							})]
						}, g.id);
					})
				})]
			}),
			step.bring && step.bring.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "mt-4 rounded-lg border border-line bg-sheet p-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
					className: "text-sm font-medium text-green",
					children: t.bring
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "mt-2 space-y-1",
					children: step.bring.map((item) => {
						const key = `${caseId}:${item.id}`;
						const on = Boolean(checks[key]);
						return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "flex min-h-11 items-center gap-3 text-sm",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "checkbox",
								checked: on,
								onChange: () => toggleCheck(key),
								className: "size-5 accent-green"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: on ? "text-muted line-through" : "",
								children: tx(lang, item.label)
							})]
						}) }, item.id);
					})
				})]
			}),
			step.skeleton && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Draft, {
				lang,
				court
			}),
			step.delay && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Callout, {
				tone: "seal",
				kicker: t.delay,
				body: fill(tx(lang, step.delay), place, lang)
			}),
			step.caution && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Callout, {
				tone: "green",
				kicker: t.caution,
				body: fill(tx(lang, step.caution), place, lang)
			}),
			step.articleIds.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "mt-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
					className: "text-sm font-medium text-green",
					children: t.rule
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-2 space-y-3",
					children: step.articleIds.map((id) => {
						const a = articleById.get(id);
						if (!a) return null;
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
							className: "rounded-lg border border-line bg-sheet p-4",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex flex-wrap items-baseline justify-between gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h4", {
										className: "font-medium",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
												className: "text-green",
												children: ["م ", a.num]
											}),
											" · ",
											tx(lang, a.heading)
										]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: `rounded-md px-2 py-0.5 text-xs ${a.verbatim ? "bg-green-soft text-green" : "bg-seal-soft text-seal"}`,
										children: a.verbatim ? t.official : t.guide
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-2 font-display text-lg leading-relaxed",
									lang: "ar",
									dir: "rtl",
									children: a.text.ar
								}),
								lang === "fr" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-2 text-sm leading-relaxed text-muted",
									lang: "fr",
									dir: "ltr",
									children: a.text.fr
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-2 text-xs text-muted",
									children: tx(lang, a.source)
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
									to: "/root/$codeId",
									params: { codeId: a.codeId },
									hash: a.id,
									className: "mt-2 inline-block text-sm text-green",
									children: t.open
								})
							]
						}, id);
					})
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "fixed inset-x-0 bottom-0 z-30 border-t border-line bg-sheet/95 backdrop-blur-sm",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mx-auto flex max-w-5xl gap-2 px-4 py-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						disabled: index === 0,
						onClick: () => setStep(caseId, index - 1),
						className: "h-12 rounded-md border border-line px-4 text-sm disabled:opacity-40",
						children: t.prev
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						disabled: index >= steps.length - 1,
						onClick: () => setStep(caseId, index + 1),
						className: "h-12 flex-1 rounded-md bg-green px-4 text-sm text-on-green disabled:opacity-40",
						children: index >= steps.length - 1 ? t.done : t.next
					})]
				})
			})
		] })
	] });
}
function Band({ kicker, body }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "mt-4 border-s-4 border-green ps-4",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
			className: "text-sm font-medium text-green",
			children: kicker
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-1 leading-relaxed",
			children: body
		})]
	});
}
function Callout({ tone, kicker, body }) {
	const box = tone === "seal" ? "border-seal bg-seal-soft text-ink" : "border-green bg-green-soft text-ink";
	const label = tone === "seal" ? "text-seal" : "text-green";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: `mt-4 rounded-lg border px-4 py-3 ${box}`,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
			className: `text-sm font-medium ${label}`,
			children: kicker
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-1 text-sm leading-relaxed",
			children: body
		})]
	});
}
function Draft({ lang, court }) {
	const t = ui[lang];
	const [copied, setCopied] = (0, import_react.useState)(false);
	const text = skeleton(lang, court);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "mt-4 rounded-lg border border-line bg-sheet p-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-start justify-between gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
					className: "text-sm font-medium text-green",
					children: t.skeletonTitle
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: () => {
						navigator.clipboard.writeText(text).then(() => {
							setCopied(true);
							window.setTimeout(() => setCopied(false), 1600);
						}, () => setCopied(false));
					},
					className: "h-11 shrink-0 rounded-md border border-line px-3 text-sm",
					children: copied ? t.copied : t.copy
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 text-xs text-muted",
				children: t.skeletonHint
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("pre", {
				className: "mt-3 overflow-x-auto whitespace-pre-wrap font-sans text-sm leading-relaxed text-ink",
				children: text
			})
		]
	});
}
//#endregion
export { Walk as component };
