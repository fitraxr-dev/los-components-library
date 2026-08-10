import { Fragment } from 'react';

import { Box, CircularProgress } from '@mui/material';

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
    isStepperLoading,
  } = useCustomNavMenu();


  if (!renderMenu) {
    return null;
  }

  if (isStepperLoading) {
    return (
      <Box marginBottom={theme.spacing(3)}>
        <BaseContainer
          sx={{
            alignItems: 'center',
            background: 'rgba(163, 202, 233, 0.2)',
            border: `1px solid ${theme.palette.custom.chart40}`,
            boxShadow: 2,
            display: 'flex',
            justifyContent: 'center',
            padding: theme.spacing(3),
          }}
        >
          <CircularProgress size={24} />
          <TextStyle variant="body4" ml={2}>
            Loading menu...
          </TextStyle>
        </BaseContainer>
      </Box>
    );
  }

  if (listStepper.length === 0) {
    return null;
  }

  return (
    <Box marginBottom={theme.spacing(3)}>
      <BaseContainer
        sx={{
          background: 'rgba(163, 202, 233, 0.2)',
          border: `1px solid ${theme.palette.custom.chart40}`,
          boxShadow: 2,
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

          <Box display="flex" gap={theme.spacing(2)} width="100%">
            {listStepper.slice(0, 2).map((root, index) => {
              const paths = pathname.split('/').filter((segment) => segment);
              const currentType = paths[3];
              const isActive = root.key === currentType;
              const isDisabled = !root.enable;

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
                        '&:hover': {
                          backgroundColor: isActive ?
                            theme.palette.primary.main :
                            theme.palette.primary.light,
                          color: theme.palette.white.main,
                        },
                        backgroundColor: isActive ?
                          theme.palette.primary.main :
                          isDisabled ? theme.palette.grey[300] : theme.palette.white.main,
                        border: `1px solid ${isDisabled ? theme.palette.grey[400] : '#284A63'}`,
                        borderRadius: '0.5208333333333334vw',
                        color: isActive ? theme.palette.white.main :
                          isDisabled ? theme.palette.grey[500] : theme.palette.primary.main,
                        cursor: 'pointer',
                        flex: 1,
                        opacity: isDisabled ? 0.6 : 1,
                        paddingX: theme.spacing(3),
                        position: 'relative',
                      }}
                      key={index}
                      onClick={() => handleClickMenu(root)}
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
                        width="100%"
                        display="flex"
                        justifyContent="center"
                      >
                        <Box
                          pt={theme.spacing(2)}
                          pb={theme.spacing(2)}
                          width="100%"
                        >
                          <RowWrapper
                            sx={{ flexGrow: 1, justifyContent: 'center' }}
                            px={theme.spacing(2)}
                          >
                            <TextStyle
                              variant="body4"
                              color={isActive ? theme.palette.white.main :
                                isDisabled ? theme.palette.grey[500] : theme.palette.primary.main}
                              weight={600}
                              textAlign="center"
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
          </Box>

          {listStepper.slice(2).map((root, index) => {
            const paths = pathname.split('/').filter((segment) => segment);
            const currentType = paths[3];
            const isActive = root.key === currentType;
            const isDisabled = !root.enable;

            return (
              <Fragment key={index + 2}>
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
                      '&:hover': {
                        backgroundColor: isActive ?
                          theme.palette.primary.main :
                          theme.palette.primary.light,
                        color: theme.palette.white.main,
                      },
                      backgroundColor: isActive ?
                        theme.palette.primary.main :
                        isDisabled ? theme.palette.grey[300] : theme.palette.white.main,
                      border: `1px solid ${isDisabled ? theme.palette.grey[400] : '#284A63'}`,
                      borderRadius: '0.5208333333333334vw',
                      color: isActive ? theme.palette.white.main :
                        isDisabled ? theme.palette.grey[500] : theme.palette.primary.main,
                      cursor: 'pointer',
                      opacity: isDisabled ? 0.6 : 1,
                      paddingX: theme.spacing(3),
                      position: 'relative',
                    }}
                    key={index + 2}
                    onClick={() => handleClickMenu(root)}
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
                        pt={theme.spacing(2)}
                        pb={theme.spacing(2)}
                      >
                        <RowWrapper
                          sx={{ flexGrow: 1, justifyContent: 'space-between' }}
                          px={theme.spacing(2)}
                        >
                          <TextStyle
                            variant="body4"
                            color={isActive ? theme.palette.white.main :
                              isDisabled ? theme.palette.grey[500] : theme.palette.primary.main}
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
    </Box>
  );
};

export default CustomNavMenu;
