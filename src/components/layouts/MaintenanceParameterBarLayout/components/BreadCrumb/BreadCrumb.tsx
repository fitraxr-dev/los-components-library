'use client';
import * as React from 'react';

import { useTheme } from '@mui/material';

import useCustomRouter from '@/hooks/useCustomRouter';

import Button from '@/components/shared/Button';
import RowWrapper from '@/components/shared/RowWrapper';
import TextStyle from '@/components/shared/TextStyle';

import useBreadCrumb from './BreadCrumb.hook';


const BreadCrumb = () => {
  const theme = useTheme();
  const router = useCustomRouter();
  const { breadCrumb } = useBreadCrumb();

  const handleNavigation = React.useCallback((href?: string | null) => {
    if (href) router.push(href);
  }, [router]);

  return (
    <nav aria-label="breadcrumbs">
      <RowWrapper mb={theme.spacing(2)} py={theme.spacing(2)}>
        {breadCrumb.map((item, index) => {
          const isLast = index === breadCrumb.length - 1;
          const clickable = !!item.url && !isLast;
          const key = `${item.label}-${item.url ?? index}`;

          return (
            <React.Fragment key={key}>
              {index > 0 && (
                <TextStyle variant="body5" weight={500} color={theme.palette.custom.gray20}>
                  &nbsp;&gt;&nbsp;
                </TextStyle>
              )}

              {clickable ? (
                <Button
                  variant="text"
                  onClick={() => handleNavigation(item.url)}
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

export default React.memo(BreadCrumb);
