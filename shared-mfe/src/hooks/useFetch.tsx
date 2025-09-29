import { useState, useEffect } from "react";

type UseFetchResult<T> = {
  data: T | null;
  error: any;
  loading: boolean;
};

function getTokenFromCookie(cookieName = "token") {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(
    new RegExp("(^| )" + cookieName + "=([^;]+)")
  );
  return match ? decodeURIComponent(match[2]) : null;
}

export function useFetch<T = any>(
  url: string,
  options?: RequestInit
): UseFetchResult<T> {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    setError(null);

    const token = getTokenFromCookie("token");
    const headers: Headers = new Headers({
      ...(options && options.headers ? options.headers : {}),
    });
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }

    const fetchOptions: RequestInit = {
      ...options,
      credentials: "include",
      headers,
    };

    fetch(url, fetchOptions)
      .then(async (res) => {
        if (!res.ok) throw new Error(res.statusText);
        const contentType = res.headers.get("content-type");
        if (contentType && contentType.includes("application/json")) {
          return res.json();
        }
        return res.text();
      })
      .then((result) => {
        if (isMounted) setData(result);
      })
      .catch((err) => {
        if (isMounted) setError(err);
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [url, JSON.stringify(options)]);

  return { data, error, loading };
}
