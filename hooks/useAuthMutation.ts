import { useMutation, UseMutationOptions } from '@tanstack/react-query';
import { useAuth } from '@clerk/nextjs';

type AuthMutationFn<TData, TVariables> = (token: string, variables: TVariables) => Promise<TData>;

export function useAuthMutation<TData, TVariables>(
  authMutationFn: AuthMutationFn<TData, TVariables>,
  options?: UseMutationOptions<TData, unknown, TVariables>
) {
  const { getToken } = useAuth();

  const mutationFn = async (variables: TVariables) => {
    const token = await getToken({ template: 'my-jwt-template' });
    return authMutationFn(token!, variables);
  };

  return useMutation<TData, unknown, TVariables>({ mutationFn, ...options });
}
