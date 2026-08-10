/**
 * Bun test runner
 */
declare const describe, it, test;

type RouterKey = keyof ReturnType<typeof useRouterRaw>;
