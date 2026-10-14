/** Reads a file the user picked. Does not download a statute and does not invent text. */

export async function textOf(file: File): Promise<string> {
  const name = file.name.toLowerCase();
  if (file.type.startsWith("text/") || name.endsWith(".txt")) {
    return (await file.text()).slice(0, 20000);
  }
  if (file.type === "application/pdf" || name.endsWith(".pdf")) return pdfText(file);
  if (file.type.startsWith("image/")) return imageText(file);
  throw new Error("unsupported");
}

async function pdfText(file: File): Promise<string> {
  const pdfjs = await import("pdfjs-dist");
  if (!pdfjs.GlobalWorkerOptions.workerSrc) {
    const worker = await import("pdfjs-dist/build/pdf.worker.min.mjs?url");
    pdfjs.GlobalWorkerOptions.workerSrc = worker.default;
  }
  const doc = await pdfjs.getDocument({ data: new Uint8Array(await file.arrayBuffer()) }).promise;
  const parts: string[] = [];
  const last = Math.min(doc.numPages, 8);
  for (let i = 1; i <= last; i++) {
    const page = await doc.getPage(i);
    const content = await page.getTextContent();
    parts.push(content.items.map((item) => ("str" in item ? item.str : "")).join(" "));
  }
  return parts.join("\n").replace(/\s+\n/g, "\n").slice(0, 20000);
}

async function imageText(file: File): Promise<string> {
  const { createWorker } = await import("tesseract.js");
  const worker = await createWorker("ara");
  try {
    const { data } = await worker.recognize(file);
    return data.text.slice(0, 20000);
  } finally {
    await worker.terminate();
  }
}
