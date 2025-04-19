import { useQuery, UseQueryOptions, QueryFunction, QueryKey } from '@tanstack/react-query';
import { useAuth } from '@clerk/nextjs';

type AuthQueryFn<T> = (token: string, roleId?: string) => Promise<T>;

export function useAuthQuery<T>(
  queryKey: QueryKey,
  authQueryFn: AuthQueryFn<T>,
  roleId?: string,
  options?: Omit<UseQueryOptions<T, Error, T, QueryKey>, 'queryKey' | 'queryFn'>
) {
  const { getToken } = useAuth();

  const queryFn: QueryFunction<T> = async () => {
    const token = await getToken({ template: 'my-jwt-template' });
    if (!token) {
      throw new Error("Authentication token not available.");
    }
    return authQueryFn(token, roleId);
  };

  return useQuery<T>({
    queryKey,
    queryFn,
    ...options
  });
}
