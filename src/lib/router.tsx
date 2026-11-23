'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type MouseEvent,
  type ReactNode,
} from 'react';

/* ------------------------------------------------------------------ */
/* Tiny hash-based router (the whole SPA lives on the `/` route).      */
/* ------------------------------------------------------------------ */

function readPath(): string {
  if (typeof window === 'undefined') return '/';
  const raw = window.location.hash.replace(/^#/, '');
  return raw.length > 0 ? raw : '/';
}

interface RouterValue {
  path: string;
}

const RouterContext = createContext<RouterValue>({ path: '/' });

export function RouterProvider({ children }: { children: ReactNode }) {
  const [path, setPath] = useState('/');

  useEffect(() => {
    const sync = () => setPath(readPath());
    sync();
    window.addEventListener('hashchange', sync);
    return () => window.removeEventListener('hashchange', sync);
  }, []);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
  }, [path]);

  const value = useMemo(() => ({ path }), [path]);
  return <RouterContext.Provider value={value}>{children}</RouterContext.Provider>;
}

export function useRoute(): string {
  return useContext(RouterContext).path;
}

export function navigate(to: string) {
  if (typeof window === 'undefined') return;
  window.location.hash = to.startsWith('#') ? to.slice(1) : to;
}

export function useQueryParams(): Record<string, string> {
  const path = useRoute();
  return useMemo(() => {
    const idx = path.indexOf('?');
    if (idx === -1) return {};
    const params: Record<string, string> = {};
    for (const [k, v] of new URLSearchParams(path.slice(idx + 1))) {
      params[k] = v;
    }
    return params;
  }, [path]);
}

/** Matches "/employees/:id" against a concrete path. Returns params or null. */
export function matchRoute(
  pattern: string,
  path: string
): Record<string, string> | null {
  const clean = path.split('?')[0];
  const pat = pattern.split('/').filter(Boolean);
  const actual = clean.split('/').filter(Boolean);
  if (pat.length !== actual.length) return null;
  const params: Record<string, string> = {};
  for (let i = 0; i < pat.length; i += 1) {
    if (pat[i].startsWith(':')) {
      params[pat[i].slice(1)] = decodeURIComponent(actual[i]);
    } else if (pat[i] !== actual[i]) {
      return null;
    }
  }
  return params;
}

export function useMatchRoute(pattern: string): Record<string, string> | null {
  const path = useRoute();
  return useMemo(() => matchRoute(pattern, path), [pattern, path]);
}

interface LinkProps {
  href: string;
  children: ReactNode;
  className?: string;
  onClick?: (event: MouseEvent<HTMLAnchorElement>) => void;
  ariaLabel?: string;
}

export function Link({ href, children, className, onClick, ariaLabel }: LinkProps) {
  const handle = useCallback(
    (event: MouseEvent<HTMLAnchorElement>) => {
      onClick?.(event);
    },
    [onClick]
  );
  return (
    <a href={`#${href}`} className={className} onClick={handle} aria-label={ariaLabel}>
      {children}
    </a>
  );
}
