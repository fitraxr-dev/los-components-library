'use client';
import * as React from 'react';

import { useTheme } from '@mui/material';

import useCustomRouter from '@/hooks/useCustomRouter';

import Button from '@/components/shared/Button';
import RowWrapper from '@/components/shared/RowWrapper';
import TextStyle from '@/components/shared/TextStyle';

import { useBreadcrumbs } from './Breadcrumbs.context';


const Breadcrumbs = () => {
  const theme = useTheme();
  const router = useCustomRouter();
  const { items } = useBreadcrumbs();

  const handleNavigation = React.useCallback((href?: string | null) => {
    if (href) router.push(href);
  }, [router]);

  return (
    <nav aria-label="breadcrumbs">
      <RowWrapper mb={theme.spacing(2)} py={theme.spacing(2)}>
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          const clickable = !!item.href && !isLast;
          const key = `${item.label}-${item.href ?? index}`;

          return (
            <React.Fragment key={key}>
              {index !== 0 && (
                <TextStyle variant="body5" weight={500} color={theme.palette.custom.gray20}>
                &nbsp;&gt;&nbsp;
                </TextStyle>
              )}

              {clickable ? (
                <Button
                  variant="text"
                  onClick={() => handleNavigation(item.href)}
                  sx={{ justifyContent: 'flex-start', minWidth: 0, p: 0 }}
                >
                  <TextStyle variant="body5" weight={500} color={theme.palette.custom.gray20}>
                    {item.label}
                  </TextStyle>
                </Button>
              ) : (
                <TextStyle
                  variant="body5"
                  weight={500}
                  color={isLast ? theme.palette.primary.main : theme.palette.custom.gray20}
                  aria-current={isLast ? 'page' : undefined}
                >
                  {item.label}
                </TextStyle>
              )}
            </React.Fragment>
          );
        })}
      </RowWrapper>
    </nav>
  );
};

export default React.memo(Breadcrumbs);
