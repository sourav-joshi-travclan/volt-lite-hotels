const getBase = (path: string) => {
  if (typeof window === "undefined") return "";
  return path.startsWith("/api") ? "" : "/api";
};

export async function apiClient<T>(
  path: string,
  options: RequestInit & { basePath?: string } = {}
): Promise<T> {
  const { basePath, ...fetchOptions } = options;
  const url = path.startsWith("http") ? path : `${basePath ?? ""}${path.startsWith("/") ? "" : "/"}${path}`;
  const res = await fetch(url, {
    ...fetchOptions,
    headers: {
      "Content-Type": "application/json",
      ...fetchOptions.headers,
    },
    credentials: "include",
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: res.statusText }));
    throw new Error((err as { message?: string }).message || res.statusText);
  }

  const text = await res.text();
  if (!text) return undefined as T;
  try {
    return JSON.parse(text) as T;
  } catch {
    return undefined as T;
  }
}

export function getAuthHeaders(): Record<string, string> {
  return {
    "Content-Type": "application/json",
  };
}
