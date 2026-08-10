'use client';

import { Fragment } from 'react';

import { Box } from '@mui/material';

import BaseContainer from '@/components/shared/BaseContainer';
import ColumnWrapper from '@/components/shared/ColumnWrapper';
import RowWrapper from '@/components/shared/RowWrapper';
import TextStyle from '@/components/shared/TextStyle';

import { listMenu } from './TopMenu.constants';
import useTopMenu from './TopMenu.hook';

// import type { TopMenuProps } from './TopMenu.type';


const TopMenu = () => {
  const {
    handleClickMenu,
    // listMenu,
    pathname,
    theme,
  } = useTopMenu();

  return (
    <Box marginBottom={theme.spacing(3)}>
      <BaseContainer
        sx={{
          background: 'rgba(163, 202, 233, 0.2)',
          border: `1px solid ${theme.palette.custom.chart40}`, boxShadow: 2,
          padding: theme.spacing(3),
        }}
      >
        <ColumnWrapper flexWrap="wrap" gap={theme.spacing(2)} justifyContent="start">
          <TextStyle
            variant="body1"
            color={theme.palette.primary.main}
            weight={600}
            pl={theme.spacing(0)}
            mb={theme.spacing(2)}
            width="100%"
            textAlign="start"
          >
            Menu
          </TextStyle>
          <Box
            sx={{
              display: 'grid',
              gridGap: theme.spacing(3),
              gridTemplateColumns: 'repeat(2, 1fr)',
              py: 2,
            }}
          >
            {listMenu.map((root, index) => (
              <Fragment key={index}>
                <Box
                  display="flex"
                  sx={{
                    backgroundColor: pathname.includes(root?.id) ?
                      theme.palette.primary.main : theme.palette.white.main,
                    border: '1px solid #284A63',
                    borderRadius: '0.5208333333333334vw',
                    color: pathname.includes(root?.id) ? theme.palette.white.main : theme.palette.primary.main,
                    cursor: 'pointer',
                    justifyContent: 'center',
                    paddingX: theme.spacing(3),
                    position: 'relative',
                  }}
                  key={index}
                  onClick={() => { handleClickMenu(root); }}
                >
                  <Box
                    sx={{ borderRadius: '0.5208333333333334vw' }}
                    width="fit-content"
                  >
                    <Box
                      pt={theme.spacing(2)}
                      pb={theme.spacing(2)}
                    >
                      <RowWrapper
                        sx={{ flexGrow: 1, justifyContent: 'center' }}
                        px={theme.spacing(2)}
                      >
                        <TextStyle
                          variant="body4"
                          color={
                            pathname.includes(root?.id) ? theme.palette.white.main : theme.palette.primary.main
                          }
                          weight={600}
                        >
                          {root?.label}
                        </TextStyle>
                      </RowWrapper>
                    </Box>
                  </Box>
                </Box>
              </Fragment>
            ))}
          </Box>
        </ColumnWrapper>
      </BaseContainer>
    </Box>
  );
};
export default TopMenu;
