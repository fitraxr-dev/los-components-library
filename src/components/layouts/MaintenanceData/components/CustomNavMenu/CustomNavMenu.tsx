import { Fragment } from 'react';

import { Box } from '@mui/material';

import BaseContainer from '@/components/shared/BaseContainer';
import RowWrapper from '@/components/shared/RowWrapper';
import TextStyle from '@/components/shared/TextStyle';


import CollapseMenu from './component/CollapseMenu/CollapseMenu';
import useCustomNavMenu from './CustomNavMenu.hook';


const CustomNavMenu = () => {
  const {
    theme,
    handleClickMenu,
    handleDropdownToggle,
    pathname,
    listStepper,
    listStepperRed,
    openDropdownId,
    renderMenu,
  } = useCustomNavMenu();

  return (

    renderMenu && (
      <Box marginBottom={theme.spacing(3)}>
        <BaseContainer
          sx={{
            background: 'rgba(163, 202, 233, 0.2)',
            border: `1px solid ${theme.palette.custom.chart40}`, boxShadow: 2,
            padding: theme.spacing(3),
          }}
        >
          <RowWrapper flexWrap="wrap" gap={theme.spacing(2)} justifyContent="start">
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
            {listStepper.map((root, index) => {
              return (
                <Fragment key={index}>
                  {root?.subMenu?.length > 0 ?
                    <CollapseMenu
                      menu={root}
                      listStepperRed={listStepperRed}
                      openDropdownId={openDropdownId}
                      onDropdownToggle={handleDropdownToggle}
                    /> :
                    <Box
                      display="flex"
                      sx={{
                        backgroundColor: pathname.includes(root?.id) ?
                          theme.palette.primary.main : theme.palette.white.main,
                        border: '1px solid #284A63',
                        borderRadius: '0.5208333333333334vw',
                        color: pathname.includes(root?.id) ? theme.palette.white.main : theme.palette.primary.main,
                        paddingX: theme.spacing(3),
                        position: 'relative',
                      }}
                      key={index}
                    >
                      {listStepperRed?.includes(root.key) && <Box
                        sx={{
                          backgroundColor: theme.palette.custom.softRed,
                          borderRadius: '100%',
                          height: theme.spacing(2.8),
                          position: 'absolute',
                          right: -6,
                          top: -6,
                          width: theme.spacing(2.8),
                        }}
                      />}
                      <Box
                        sx={{ borderRadius: '0.5208333333333334vw' }}
                        width="fit-content"
                      >
                        <Box
                          sx={{ cursor: 'pointer' }}
                          pt={theme.spacing(2)}
                          pb={theme.spacing(2)}
                          onClick={() => { handleClickMenu(root); }}
                        >
                          <RowWrapper
                            sx={{ flexGrow: 1, justifyContent: 'space-between' }}
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
                  }
                </Fragment>
              );
            })}
          </RowWrapper>
        </BaseContainer>
      </Box>)

  );
};


export default CustomNavMenu;
