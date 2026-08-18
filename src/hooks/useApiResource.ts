'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

export type ResourceStatus = 'loading' | 'ready' | 'error';

export interface UseApiResourceResult<T> {
  data: T | null;
  status: ResourceStatus;
  error: string | null;
  refresh: () => void;
}

/**
 * Fetches one of this app's `/api/*` routes and tracks its lifecycle.
 *
 * Those routes proxy the LeafCare backend, so components never learn the
 * backend's address and no CORS configuration is required. In-flight requests
 * are aborted when the query changes, which keeps a slow response from
 * overwriting a newer one.
 */
export const useApiResource = <T>(
  path: string | null,
  select: (payload: unknown) => T,
): UseApiResourceResult<T> => {
  const [data, setData] = useState<T | null>(null);
  const [status, setStatus] = useState<ResourceStatus>('loading');
  const [error, setError] = useState<string | null>(null);
  const [reloadToken, setReloadToken] = useState(0);

  // `select` is usually an inline arrow, so it is held in a ref rather than
  // listed as a dependency — otherwise every render would refetch. The ref is
  // updated in an effect, never during render, which concurrent rendering
  // forbids.
  const selectRef = useRef(select);
  useEffect(() => {
    selectRef.current = select;
  });

  const refresh = useCallback(() => setReloadToken((token) => token + 1), []);

  useEffect(() => {
    if (!path) return;

    const controller = new AbortController();
    // This effect drives an external fetch; its status is not derivable during
    // render.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setStatus('loading');
    setError(null);

    fetch(path, { signal: controller.signal })
      .then(async (response) => {
        const payload = await response.json();
        if (!response.ok) {
          throw new Error(payload?.error ?? 'Unable to load data right now.');
        }
        return payload;
      })
      .then((payload) => {
        if (controller.signal.aborted) return;
        setData(selectRef.current(payload));
        setStatus('ready');
      })
      .catch((cause: unknown) => {
        if (controller.signal.aborted) return;
        console.warn(`Request to ${path} failed:`, cause);
        setError(cause instanceof Error ? cause.message : 'Unable to load data right now.');
        setStatus('error');
      });

    return () => controller.abort();
  }, [path, reloadToken]);

  return { data, status, error, refresh };
};
