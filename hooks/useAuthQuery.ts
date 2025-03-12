import { useQuery, UseQueryOptions, QueryFunction } from '@tanstack/react-query';
import { useAuth } from '@clerk/nextjs';

type AuthQueryFn<T> = (token: string, roleId?: string) => Promise<T>;

export function useAuthQuery<T>(
  queryKey: any[],
  authQueryFn: AuthQueryFn<T>,
  roleId?: string,
  options?: UseQueryOptions<T>
) {
  const { getToken } = useAuth();

  const queryFn: QueryFunction<T> = async () => {
    const token = await getToken({ template: 'my-jwt-template' });
    return authQueryFn(token!, roleId);
  };

  return useQuery<T>({
    queryKey,
    queryFn,
    ...options
  });
}
