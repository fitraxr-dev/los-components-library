import { useMemo } from 'react';

import { DRAFT, PIPELINE, RETURN_TO_STAFF } from './Badge.constants';

import type { BadgeHookProps } from './Badge.types';


export const useBadge = (props: BadgeHookProps) => {
  const { theme, status } = props;

  const badgeCondition = useMemo(() => {
    switch (status) {
      case DRAFT:
        return theme.palette.custom.gray30;
      case PIPELINE:
        return theme.palette.warning.main;
      case RETURN_TO_STAFF:
        return theme.palette.primary.main;
      default:
        return theme.palette.custom.gray30;
    }
  }, [status, theme.palette]);

  return {
    badgeCondition,
  };
};
