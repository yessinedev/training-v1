import { useQuery, UseQueryOptions, QueryFunction } from '@tanstack/react-query';
import { useAuth } from '@clerk/nextjs';

type AuthQueryFn<T> = (token: string) => Promise<T>;

export function useAuthQuery<T>(
  queryKey: any[],
  authQueryFn: AuthQueryFn<T>,
  options?: UseQueryOptions<T>
) {
  const { getToken } = useAuth();

  const queryFn: QueryFunction<T> = async () => {
    const token = await getToken({ template: 'my-jwt-template' });
    return authQueryFn(token!);
  };

  return useQuery<T>({
    queryKey,
    queryFn,
    ...options
  });
}
