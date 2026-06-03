export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ??
  (import.meta.env.DEV ? "http://localhost:3001" : "");

export function getApiUrl(path: string) {
  return `${API_BASE_URL}${path}`;
}

type RequestOptions = RequestInit & {
  json?: unknown;
};

export async function http<T>(
  path: string,
  options: RequestOptions = {},
): Promise<T> {
  const { json, headers, ...rest } = options;

  const response = await fetch(getApiUrl(path), {
    ...rest,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...headers,
    },
    body: json ? JSON.stringify(json) : rest.body,
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

    throw new Error(errorMessage || text || "Request failed");
  }

  return response.json() as Promise<T>;
}
