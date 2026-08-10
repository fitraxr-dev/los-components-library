import { Fragment, useEffect, useState } from 'react';

import {
  Box,
  Collapse,
  List,
  ListItemButton,
  Tooltip,
  useTheme,
} from '@mui/material';
import { usePathname } from 'next/navigation';

import { replacePath } from '@/helpers/navigation';
import useCustomRouter from '@/hooks/useCustomRouter';

import Icon from '@/components/shared/Icon';
import RowWrapper from '@/components/shared/RowWrapper';
import TextStyle from '@/components/shared/TextStyle';


const CollapseMenu = (props) => {
  const root = props.menu;
  const { index, checkStepperRed } = props;
  const theme = useTheme();
  const [opened, setOpened] = useState(false);
  const pathname = usePathname();
  const router = useCustomRouter();

  const handleClickMenu = (menu) => {
    if (menu.url) {
      const destination = menu.url;
      const segments: string[] = pathname.split('/');
      const basePath: string = `${segments.slice(0, 5).join('/')}${destination}`;
      const newPath = replacePath(basePath, {});

      router.push(newPath);
    }
  };

  useEffect(() => {
    setOpened(false);
  }, [pathname]);

  const handleClickDropdown = () => {
    setOpened(!opened);
  };


  return (
    <Box
      display="flex"
      sx={{
        backgroundColor: pathname.includes(root?.id) ?
          theme.palette.primary.main : theme.palette.white.main,
        border: '1px solid #284A63', borderRadius: '0.5208333333333334vw', paddingX: theme.spacing(3),
        position: 'relative',
      }}
      key={index}
    >
      {checkStepperRed(root.id) && <Box
        sx={{
          backgroundColor: theme.palette.custom.softRed,
          borderRadius: '100%',
          height: theme.spacing(2.8),
          position: 'absolute',
          right: -8,
          top: -8,
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
          onClick={handleClickDropdown}
        >
          <RowWrapper
            sx={{ flexGrow: 1, justifyContent: 'space-between' }}
            px={theme.spacing(2)}
          >
            <TextStyle
              variant="body4"
              color={pathname.includes(root?.id) ? theme.palette.white.main : theme.palette.primary.main}
              weight={600}
            >
              {root?.label}
            </TextStyle>
            <Icon
              textVariant="body2"
              iconName={opened ? 'close' : 'chevron-down'}
              sx={{
                '& path': {
                  stroke: `${pathname.includes(root?.id) ? theme.palette.white.main : theme.palette.primary.main}`,
                },
              }}
            />
          </RowWrapper>
        </Box>
      </Box>
      {root.subMenu &&
        <Collapse
          in={opened}
          sx={{
            backgroundColor: '#fff',
            border: '1px solid ',
            borderRadius: '0.5208333333333334vw',
            left: 0,
            position: 'absolute',
            top: theme.spacing(7.5),
            width: '100%',
            zIndex: 99,
          }}
        >
          <List sx={{ width: '100%' }}>
            {root?.subMenu?.map((val) => (
              <Fragment key={val.id}>
                <Tooltip title={!val.label} placement="right">
                  <ListItemButton
                    disableGutters
                    onClick={() => {handleClickMenu(val);}}
                    sx={{
                      bgcolor: pathname.includes(val.url)
                        ? 'rgba(40, 74, 99, 0.10)'
                        : '',
                      paddingY: theme.spacing(2),
                    }}
                  >
                    <RowWrapper
                      sx={{
                        flexGrow: 1,
                        justifyContent: 'space-between',
                        overflow: 'hidden',
                      }}
                      px={theme.spacing(2)}
                    >
                      <TextStyle
                        variant="body4"
                        weight={600}
                        color={theme.palette.primary.main}
                        sx={{
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'wrap',
                        }}
                      >
                        {val.label}
                      </TextStyle>
                      {checkStepperRed(root.id) && <Box
                        sx={{
                          backgroundColor: theme.palette.custom.softRed,
                          borderRadius: '100%',
                          height: theme.spacing(2.8),
                          width: theme.spacing(2.8),
                        }}
                      />}
                    </RowWrapper>
                  </ListItemButton>
                </Tooltip>
              </Fragment>
            ))}
          </List>
        </Collapse>
      }
    </Box>
  );
};

export default CollapseMenu;
