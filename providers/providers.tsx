"use client";
import { useState, useEffect } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createSyncStoragePersister } from "@tanstack/query-sync-storage-persister";
import { persistQueryClient } from "@tanstack/react-query-persist-client";
import { LoadingSkeleton } from "@/components/LoadingSkeleton";

export default function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            // Time until data is considered stale (1 minute)
            staleTime: 1000 * 60,
            // Time until inactive/unused data is garbage collected (10 minutes) 
            gcTime: 1000 * 60 * 5,
            refetchOnWindowFocus: false,
          },
        },
      })
  );

  const [isHydrated, setIsHydrated] = useState(false);

  // useEffect(() => {
  //   if (typeof window === "undefined") return;
  //     const persister = createSyncStoragePersister({
  //       storage: window.localStorage,
  //     });

  //     const [unsubscribe] = persistQueryClient({
  //       queryClient,
  //       persister,
  //     });
    

  //   setIsHydrated(true);
  //   return () => {
  //     unsubscribe?.();
  //   };
  // }, [queryClient]);

  return (
    <QueryClientProvider client={queryClient}>
      {/* {isHydrated ? children : <LoadingSkeleton />} */}
      {children}
    </QueryClientProvider>
  );
}
