import { Fragment, useEffect, useState } from 'react';

import styled from '@emotion/styled';
import { Box, Collapse, ListItemButton, useTheme } from '@mui/material';
import { usePathname } from 'next/navigation';

import { replacePath } from '@/helpers/navigation';
import useCustomRouter from '@/hooks/useCustomRouter';

import Icon from '@/components/shared/Icon';
import RowWrapper from '@/components/shared/RowWrapper';
import TextStyle from '@/components/shared/TextStyle';

import { useMaintenanceModalContext } from '../../MaintenanceModal.context';

import type { SidebarCollapseContentWrapperProps } from '@/components/layouts/MUILayout/MUI.types';


const useBreadCrumb = () => {
  const pathname = usePathname();
  const router = useCustomRouter();
  const { breadCrumb } = useMaintenanceModalContext();
  const theme = useTheme();
  const [opened, setOpened] = useState(false);
  const [isExpanded, setIsExpanded] = useState(true);
  const [path, setPath] = useState([]);

  const handleClickMenu = (menu, parentMenu = []) => {
    if (!isExpanded) setIsExpanded(true);
    else if (menu.subMenu) {
      if (path.includes(menu.id)) {
        const index = path.findIndex((el) => el === menu.id);
        setPath(path.splice(0, index));
      } else {
        setPath([...parentMenu, menu.id]);
      }
    } else {
      setPath([...parentMenu, menu.id]);
    }

    if (menu.url) {
      const destination = menu.url;
      const segments: string[] = pathname.split('/');
      const basePath: string = `${segments.slice(0, 5).join('/')}${destination}`;
      const newPath = replacePath(basePath, {});
      setOpened(false);
      setPath([]);
      router.push(newPath);
    }
  };

  const CollapseContentWrapper = styled(Box, {
    shouldForwardProp: (prop) => prop !== 'isFirstLayer',
  })<SidebarCollapseContentWrapperProps>(({ theme, isFirstLayer }) => ({

  }));

  const renderSubMenu = (menu, parentMenu = [], isFirstLayer = false) => {
    return (
      <Box display="flex" flexWrap="nowrap" >
        <Collapse in={path.includes(menu.id)} unmountOnExit orientation="horizontal" >
          <Box
            py={theme.spacing(2)}
            pl={theme.spacing(2)}
            sx={opened ? {
              borderRadius: '0.5208333333333334vw',
            } : {}}
            bgcolor="#fff"
            display="flex"
            flexWrap="nowrap"
            height="100%"
          >
            <CollapseContentWrapper isFirstLayer={isFirstLayer} minWidth="240px">
              {menu.subMenu.map((sub) => (
                <Fragment key={sub.id}>
                  <ListItemButton
                    disableGutters
                    onClick={() => {handleClickMenu(sub, parentMenu);}}
                    sx={{
                      bgcolor: pathname.includes(sub.url)
                        ? 'rgba(40, 74, 99, 0.10)'
                        : '',
                      paddingY: theme.spacing(2),
                    }}
                  >
                    <RowWrapper sx={{ flexGrow: 1, justifyContent: 'space-between' }} px={theme.spacing(2)} >
                      <TextStyle
                        variant="body4"
                        color={theme.palette.primary.main}
                        weight={sub.icon ? 600 : 500}
                        sx={{
                        }}
                      >
                        {sub.label}
                      </TextStyle>
                      {sub.subMenu && (
                        <Icon
                          textVariant="body4"
                          iconName="chevron-right"
                        />
                      )}
                    </RowWrapper>
                  </ListItemButton>
                  {/* {sub.subMenu && renderSubMenu(sub, [...parentMenu, sub.id])} */}
                </Fragment>
              ))}
            </CollapseContentWrapper>
          </Box>
        </Collapse>
        {menu.subMenu.map((sub) => {
          return (sub.subMenu && renderSubMenu(sub, [...parentMenu, sub.id]));
        })}
      </Box>
    );};

  const handleClickDropdown = () => {
    setPath([]);
    setOpened(!opened);
  };

  const handleNavigation = (path) => {
    if (path) {
      router.push(path);
    }
  };


  return {
    breadCrumb,
    handleClickDropdown,
    handleClickMenu,
    handleNavigation,
    isExpanded,
    opened,
    path,
    pathname,
    renderSubMenu,
    router,
    theme,
  };
};

export default useBreadCrumb;
