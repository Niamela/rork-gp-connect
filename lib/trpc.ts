import { createTRPCReact } from "@trpc/react-query";
import { httpLink } from "@trpc/client";
import type { AppRouter } from "@/backend/trpc/app-router";

export const trpc = createTRPCReact<AppRouter>();

const getBaseUrl = () => {
  if (process.env.EXPO_PUBLIC_RORK_API_BASE_URL) {
    console.log('[tRPC] Using configured base URL:', process.env.EXPO_PUBLIC_RORK_API_BASE_URL);
    return process.env.EXPO_PUBLIC_RORK_API_BASE_URL;
  }

  if (typeof window !== 'undefined') {
    const origin = window.location.origin;
    console.log('[tRPC] Using window origin:', origin);
    return origin;
  }

  console.warn('[tRPC] No base URL found, defaulting to production');
  return 'https://rork.app';
};

export const trpcClient = trpc.createClient({
  links: [
    httpLink({
      url: `${getBaseUrl()}/api/trpc`,
      fetch: async (url, options) => {
        console.log('[tRPC] Fetching:', url);
        console.log('[tRPC] Options:', JSON.stringify({
          method: options?.method,
          headers: options?.headers,
        }));
        
        try {
          const response = await fetch(url, {
            ...options,
            headers: {
              ...options?.headers,
              'Content-Type': 'application/json',
            },
          });
          
          console.log('[tRPC] Response status:', response.status);
          
          if (!response.ok) {
            const text = await response.text();
            console.error('[tRPC] Response error:', text);
          }
          
          return response;
        } catch (error) {
          console.error('[tRPC] Fetch error:', error);
          console.error('[tRPC] Error details:', {
            message: error instanceof Error ? error.message : 'Unknown error',
            url,
          });
          throw error;
        }
      },
    }),
  ],
});
