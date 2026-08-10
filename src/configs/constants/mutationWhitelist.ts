/**
 * Mutation keys that should not trigger global loading backdrop
 * These mutations are typically background operations that don't require user attention
 */
export const MUTATION_WHITELIST = [
  'notification-seen',
  // Add more mutation keys here as needed
  // 'background-sync',
  // 'auto-save',
  // 'polling-update',
] as const;

export type MutationWhitelistKey = typeof MUTATION_WHITELIST[number];
