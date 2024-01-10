import { useState, useCallback } from "react";

export const useHttp = () => {
  const [loading, setLoading] = useState(false); //  вказує на те, чи йде завантаження
  const [error, setError] = useState(null); // вказує на те, чи виникла помилка

  // useCallback приймає асинхронну функцію, бо ми працюємо з запитами
  const request = useCallback(
    async (
      url,
      method = "GET",
      body = null,
      headers = { "Content-Type": "application/json" },
    ) => {
      setLoading(true);

      try {
        const response = await fetch(url, { method, body, headers });

        if (!response.ok) {
          throw new Error(`Could not fetch ${url}, status: ${response.status}`);
        }

        const data = await response.json();

        setLoading(false);
        return data;
      } catch (e) {
        setLoading(false);
        setError(e.message);
        throw e;
      }
    },
    [],
  );

  const clearError = useCallback(() => setError(null), []);

  return { loading, request, error, clearError };
};
