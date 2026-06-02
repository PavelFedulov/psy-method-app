import { getApiUrl } from "./http";

type ExportPayload = {
  sessionIds?: number[];
  exportAll?: boolean;
};

async function downloadFile(
  path: string,
  payload: ExportPayload,
  fallbackFileName: string,
) {
  const response = await fetch(getApiUrl(path), {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const text = await response.text();
    let errorMessage = "";

    try {
      const parsed = JSON.parse(text) as { error?: unknown };

      if (typeof parsed.error === "string") {
        errorMessage = parsed.error;
      }
    } catch {
      // Fall back to the raw response text below.
    }

    throw new Error(errorMessage || text || "Не удалось выполнить экспорт");
  }

  const blob = await response.blob();

  const contentDisposition = response.headers.get("Content-Disposition");
  const fileNameMatch = contentDisposition?.match(/filename="(.+?)"/);
  const fileName = fileNameMatch?.[1] || fallbackFileName;

  const url = window.URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = fileName;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  window.URL.revokeObjectURL(url);
}

export function exportAdminSessionsCsv(payload: ExportPayload) {
  return downloadFile("/api/admin/export/csv", payload, "results.csv");
}

export function exportAdminSessionsXlsx(payload: ExportPayload) {
  return downloadFile("/api/admin/export/xlsx", payload, "results.xlsx");
}
