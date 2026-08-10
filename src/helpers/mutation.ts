import { MUTATION_WHITELIST } from '@/configs/constants/mutationWhitelist';

/**
 * Helper function to create a mutation key that's compatible with the whitelist system
 */
export const createWhitelistedMutationKey = (key: string): [string] => {
  return [key];
};

/**
 * Helper function to check if a mutation should show global loading
 */
export const shouldShowGlobalLoading = (mutationKey: unknown): boolean => {
  if (!mutationKey) return true; // Show loading for mutations without keys

  if (Array.isArray(mutationKey) && mutationKey.length > 0) {
    const key = mutationKey[0];
    if (typeof key === 'string') {
      return !MUTATION_WHITELIST.some((whitelistedKey) => key.includes(whitelistedKey));
    }
  }

  return true; // Show loading for mutations without proper keys
};

/**
 * Helper function to create mutation options with whitelist support
 */
export const createMutationOptions = <TData, TError, TVariables>(
  key: string,
  mutationFn: (variables: TVariables) => Promise<TData>,
  options?: {
    onSuccess?: (data: TData, variables: TVariables) => void;
    onError?: (error: TError, variables: TVariables) => void;
  }
) => {
  return {
    mutationFn,
    mutationKey: createWhitelistedMutationKey(key),
    onError: options?.onError,
    onSuccess: options?.onSuccess,
  };
};
