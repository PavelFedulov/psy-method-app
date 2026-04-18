const API_BASE_URL = "http://localhost:3001";

type ExportPayload = {
  sessionIds?: number[];
  exportAll?: boolean;
};

async function downloadFile(
  path: string,
  payload: ExportPayload,
  fallbackFileName: string,
) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(text || "Не удалось выполнить экспорт");
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
