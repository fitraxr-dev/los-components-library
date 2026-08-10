'use client';
import {
  Fragment,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';

import {
  Box,
  Collapse,
  IconButton,
  InputAdornment,
  InputBase,
  List,
  ListItemButton,
  Paper,
  Tooltip,
  styled,
  useTheme,
} from '@mui/material';
import { toUnitless } from '@mui/material/styles/cssUtils';
import { usePathname } from 'next/navigation';

import { roles } from '@/configs/constants';
import { accessPage } from '@/configs/roles';
import generalTheme from '@/helpers/theme/generalTheme';
import { lightTheme } from '@/helpers/theme/light';
import useApp from '@/hooks/useApp';
import useDebounce from '@/hooks/useDebounce';

import Button from '@/components/shared/Button';
import ColumnWrapper from '@/components/shared/ColumnWrapper';
import HStack from '@/components/shared/HStack';
import Icon from '@/components/shared/Icon';
import RowWrapper from '@/components/shared/RowWrapper';
import TextStyle from '@/components/shared/TextStyle';
import VStack from '@/components/shared/VStack';

import type { SidebarCollapseContentWrapperProps, SidebarContainerProps, SidebarProps } from '../MUI.types';


const Sidebar = ({
  handleAction = () => { },
  sidebarMenu,
}: SidebarProps) => {
  const theme = useTheme();
  const [state] = useApp();
  const { currentRole } = state;

  const pathname = usePathname();

  const [menu, setMenu] = useState([]);
  const [path, setPath] = useState([]);
  const [selected, setSelected] = useState([]);
  const [isExpanded, setIsExpanded] = useState(true);
  const [searchValue, setSearchValue] = useState('');
  const debouncedSearchValue = useDebounce(searchValue, 500);

  const handleClickMenu = (menu, parentMenu = []) => {
    if (!isExpanded) setIsExpanded(true);
    else if (menu.subMenu) {
      if (path.includes(menu.id)) {
        const index = path.findIndex((el) => el === menu.id);
        setPath(path.toSpliced(index, 1));
      } else {
        setPath([...parentMenu, menu.id]);
      }
    } else {
      setPath([...parentMenu, menu.id]);
      handleAction(menu);
    }
  };

  const renderSubMenu = (menu, parentMenu = [], isFirstLayer = false) => (
    <Collapse in={!!searchValue || path.includes(menu.id)} timeout="auto" unmountOnExit>
      <CollapseContentWrapper isFirstLayer={isFirstLayer} >
        {menu.subMenu.map((sub) => (
          <Fragment key={sub.id}>
            <ListItemButton
              disableGutters
              onClick={() => handleClickMenu(sub, parentMenu)}
            >
              {sub.icon ? (
                <Icon
                  textVariant="body3"
                  iconName={sub.icon}
                  sx={{
                    marginRight: theme.spacing(1),
                    path: {
                      fill: selected.includes(sub.id)
                        ? theme.palette.primary.main
                        : theme.palette.custom.gray20,
                    },
                  }}
                />
              ) : null}
              <RowWrapper sx={{ flexGrow: 1, justifyContent: 'space-between' }}>
                <TextStyle
                  variant="body4"
                  color={
                    selected.includes(sub.id)
                      ? theme.palette.primary.main
                      : theme.palette.custom.gray20
                  }
                  weight={sub.icon ? 600 : 500}
                >
                  {sub.label}
                </TextStyle>
                {sub.subMenu && (
                  <Icon
                    textVariant="body4"
                    iconName={
                      (path.includes(sub.id) || debouncedSearchValue) ? 'chevron-down' : 'chevron-right'
                    }
                  />
                )}
              </RowWrapper>
            </ListItemButton>
            {sub.subMenu && renderSubMenu(sub, [...parentMenu, sub.id])}
          </Fragment>
        ))}
      </CollapseContentWrapper>
    </Collapse>
  );

  const findActivePath = useCallback((menu, pathArray = [], depth = 2) => {
    const path = pathname.split('/').slice(0, depth).join('/');

    for (const el of menu) {
      if (el.path === path) {
        return [...pathArray, el.id];
      }

      if (el.subMenu) {
        const found = findActivePath(el.subMenu, [...pathArray, el.id], depth + 1);
        if (found) return found;
      }
    }
  }, [pathname]);

  const accessibleMenuByRole = useMemo(() => {
    const result = [];


    const processSubItem = (parent, item, ignore = false) => {
      if (item.subMenu && Array.isArray(item.subMenu)) {
        const currentItem = { ...item, subMenu: []};

        if (!ignore && debouncedSearchValue) {

          const shouldIgnore = debouncedSearchValue
            && currentItem.label.toLowerCase().includes(debouncedSearchValue.toLowerCase());

          for (const subMenu of item.subMenu) {
            processSubItem(currentItem, subMenu, shouldIgnore);
          }

          if (currentItem?.subMenu?.length) {
            parent?.subMenu.push(currentItem);
          }

        } else {
          for (const subMenu of item.subMenu) {
            processSubItem(currentItem, subMenu, ignore);
          }

          if (currentItem?.subMenu?.length) {
            parent?.subMenu?.push(currentItem);
          }
        }


      } else {
        if (!ignore && debouncedSearchValue) {
          if (item.label.toLowerCase().includes(debouncedSearchValue.toLowerCase())) {
            parent?.subMenu?.push(item);
          }
        } else {
          parent?.subMenu?.push(item);
        }
      }
    };

    // First level
    sidebarMenu.forEach((item) => {

      if (item.subMenu && Array.isArray(item.subMenu)) {
        const rootMenu = { ...item, subMenu: []};

        const shouldIgnore = debouncedSearchValue
          && rootMenu.label.toLowerCase().includes(debouncedSearchValue.toLowerCase());

        for (const subMenu of item.subMenu) {
          processSubItem(rootMenu, subMenu, shouldIgnore);
        }

        if (rootMenu?.subMenu?.length) {
          result.push(rootMenu);
        }

      } else {
        if (debouncedSearchValue) {
          if (item.label.toLowerCase().includes(debouncedSearchValue.toLowerCase())) {
            result.push(item);
          }
        } else {
          result.push(item);
        }
      }
    });

    return result;

  }, [sidebarMenu, debouncedSearchValue]);

  useEffect(() => {
    setMenu(accessibleMenuByRole);

    const activePath = findActivePath(accessibleMenuByRole);

    if (activePath) {
      setPath(activePath);
      setSelected(activePath);
    }
  }, [accessibleMenuByRole, findActivePath, pathname]);

  return (
    <SidebarContainer theme={theme} isExpanded={isExpanded}>
      {isExpanded && (
        <ColumnWrapper sx={{ alignItems: 'center', mb: 2 }}>
          <Button
            variant="text"
            sx={{
              alignSelf: 'end',
              mb: '16px',
              minWidth: theme.spacing(4),
              padding: theme.spacing(0),
            }}
            onClick={() => setIsExpanded(false)}
          >
            <Icon
              textVariant="display2"
              iconName="maximize"
              sx={{
                path: {
                  fill: theme.palette.primary.main,
                },
              }}
            />
          </Button>
          <HStack
            padding={generalTheme.spacing(1)}
            width="100%"
            style={{
              border: `1px solid ${lightTheme.palette.primary.main}`,
              borderRadius: generalTheme.spacing(1),
            }}
          >
            <VStack padding={generalTheme.spacing(1)}>
              <Icon iconName="search" textVariant="body4" />
            </VStack>
            <InputBase
              sx={{
                '.MuiInputBase-input': {
                  height: theme.typography.body4.fontSize,
                  padding: '0px',
                  ...theme.typography.body4,
                },
                flex: 1,
              }}
              value={searchValue}
              placeholder="Cari menu"
              onChange={(e) => {
                setSearchValue(e.target.value);
              }}
              endAdornment={
                !!searchValue ?
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setSearchValue('')}
                      sx={{
                        minWidth: 0,
                        p: 0.5,
                      }}
                    >
                      <Icon
                        iconName="close"
                        textVariant="title1"
                        sx={{
                          path: {
                            stroke: theme.palette.common.black,
                          },
                        }}
                      />
                    </IconButton>
                  </InputAdornment>
                  : null
              }
            />
          </HStack>
        </ColumnWrapper>
      )}

      <List sx={{ width: '100%' }}>
        {menu.map((root) => (
          <Fragment key={root.id}>
            <Tooltip title={!isExpanded ? root.label : ''} placement="right">
              <ListItemButton
                disableGutters
                onClick={() => handleClickMenu(root)}
              >
                {root.icon ? (
                  <Icon
                    textVariant="display2"
                    iconName={root.icon}
                    sx={{
                      marginLeft: theme.spacing(1),
                      marginRight: theme.spacing(1),
                      path: {
                        fill: selected.includes(root.id)
                          ? theme.palette.primary.main
                          : theme.palette.custom.gray20,
                      },
                    }}
                  />
                ) : null}
                {isExpanded && (
                  <RowWrapper
                    sx={{
                      flexGrow: 1,
                      justifyContent: 'space-between',
                      overflow: 'hidden',
                    }}
                  >
                    <TextStyle
                      variant="body4"
                      weight={600}
                      color={
                        selected.includes(root.id)
                          ? theme.palette.primary.main
                          : theme.palette.custom.gray20
                      }
                      sx={{
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'wrap',
                      }}
                    >
                      {root.label}
                    </TextStyle>
                    {root.subMenu && (
                      <Icon
                        textVariant="body4"
                        iconName={
                          (path.includes(root.id) || debouncedSearchValue) ? 'chevron-down' : 'chevron-right'
                        }
                      />
                    )}
                  </RowWrapper>
                )}
              </ListItemButton>
            </Tooltip>
            {isExpanded && root.subMenu && renderSubMenu(root, [root.id], true)}
          </Fragment>
        ))}
      </List>
    </SidebarContainer>
  );
};

const SidebarContainer = styled(Paper, {
  shouldForwardProp: (prop) => prop !== 'isExpanded',
})<SidebarContainerProps>(({ theme, isExpanded }) => ({
  ' msOverflowStyle': 'none',
  '::-webkit-scrollbar': {
    display: 'none',
  },
  borderRadius: theme.radius(2),
  boxShadow: theme.shadows[1],
  height: '100%',
  maxWidth: isExpanded ? '18.2vw' : '5vw',
  minWidth: isExpanded ? '18.2vw' : '5vw',
  overflow: 'auto',

  padding: theme.spacing(3),
  scrollbarWidth: 'none',
  transition: theme.transitions.create(['max-width'], {
    duration: theme.transitions.duration.short,
    easing: theme.transitions.easing.easeInOut,
  }),
}));


const CollapseContentWrapper = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'isFirstLayer',
})<SidebarCollapseContentWrapperProps>(({ theme, isFirstLayer }) => ({
  paddingLeft: `${toUnitless(theme.typography[isFirstLayer ? 'display2' : 'body3'].fontSize.toString()) +
    toUnitless(theme.spacing(isFirstLayer ? 2 : 1))
  }vw`,
}));

export default Sidebar;
