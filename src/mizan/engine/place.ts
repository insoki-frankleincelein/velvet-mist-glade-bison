export function place(text: string, wilayaName: string) {
  return text.replaceAll("{wilaya}", wilayaName || "…");
}
