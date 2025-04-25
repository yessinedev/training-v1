'use client';

import { ReactNode, useEffect } from "react";
import { useAuth } from "@clerk/nextjs";
import axiosInstance from "@/lib/axios";

export function AxiosProvider({ children }: { children: ReactNode }) {
  const { getToken, isLoaded } = useAuth();

  useEffect(() => {
    if (!isLoaded) return; 
    const interceptor = axiosInstance.interceptors.request.use(
      async (config) => {
        const token = await getToken();
        if (token && config.headers) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    return () => {
      axiosInstance.interceptors.request.eject(interceptor);
    };
  }, [getToken, isLoaded]);

  return <>{children}</>;
}
