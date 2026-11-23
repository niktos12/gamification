'use client';

import { useEffect, useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/sonner';

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 15_000,
            retry: 1,
            refetchOnWindowFocus: false,
          },
        },
      })
  );

  // Keep the wallet / cart indicators in sync after balance-affecting
  // mutations (api client dispatches `dotify:invalidate` events).
  useEffect(() => {
    const handler = (event: Event) => {
      const targets = (event as CustomEvent<string[]>).detail || [];
      for (const target of targets) {
        queryClient.invalidateQueries({ queryKey: [target] });
      }
    };
    window.addEventListener('dotify:invalidate', handler);
    return () => window.removeEventListener('dotify:invalidate', handler);
  }, [queryClient]);

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: 'rgba(11,11,11,0.92)',
            border: '1px solid rgba(255,255,255,0.1)',
            color: '#fafafa',
            backdropFilter: 'blur(16px)',
          },
        }}
      />
    </QueryClientProvider>
  );
}
