import { Fragment } from 'react';

import {
  Box,
  Collapse,
  List,
  ListItemButton,
  Tooltip,
} from '@mui/material';

import Button from '@/components/shared/Button';
import Icon from '@/components/shared/Icon';
import RowWrapper from '@/components/shared/RowWrapper';
import TextStyle from '@/components/shared/TextStyle';

import useStepperDropdown from './StepperDropdown.hook';


const StepperDropdown = (props: {renderDropdownMenu?: boolean; renderBreadCrumb?: boolean}) => {
  const { renderDropdownMenu = true, renderBreadCrumb = true } = props;
  const {
    isExpanded,
    theme,
    opened,
    handleClickMenu,
    path,
    mockMenu,
    renderSubMenu,
    handleClickDropdown,
    handleNavigation,
    breadCrumb,
    pathname,
  } = useStepperDropdown();
  return (
    <Box mb={renderDropdownMenu ? 10 : 0}>
      {renderBreadCrumb &&
        <RowWrapper mb={theme.spacing(2)} py={theme.spacing(2)}>
          {breadCrumb?.map((val, index) => {
            return (
              <Fragment key={index}>
                {index !== 0 &&
                  <TextStyle variant="body5" key={val} weight={500} color={theme.palette.custom.gray20}>
                  &nbsp;&gt;&nbsp;
                  </TextStyle>
                }
                <Button
                  variant="text"
                  onClick={() => {handleNavigation(val?.url);}}
                  disabled={val.url ? false : true}
                  sx={{ justifyContent: 'start', minWidth: 0, padding: 0 }}
                >
                  <TextStyle
                    variant="body5"
                    key={val}
                    weight={500}
                    color={
                      index + 1 === breadCrumb?.length ? theme.palette.primary.main : theme.palette.custom.gray20}
                  >
                    {val.label}
                  </TextStyle>
                </Button>

              </Fragment>
            );
          })}
        </RowWrapper>
      }
      {renderDropdownMenu &&
        <>
          <TextStyle
            variant="body4"
            color={theme.palette.primary.main}
            weight={600}
            pl={theme.spacing(0)}
            mb={theme.spacing(2)}
          >
            Pilih Menu
          </TextStyle>
          <Box display="flex" position="absolute" zIndex={99} sx={{ backgroundColor: '#fff', border: '1px solid #000', borderRadius: '0.5208333333333334vw' }}>
            <Box
              sx={{ borderRadius: '0.5208333333333334vw' }}
              width="fit-content"
              bgcolor="#fff"
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
                    color={theme.palette.primary.main}
                    weight={600}
                  >
                    {breadCrumb?.[breadCrumb?.length - 1]?.label}
                  </TextStyle>
                  <Icon
                    textVariant="body2"
                    iconName={opened ? 'close' : 'chevron-down'}
                  />
                </RowWrapper>
              </Box>
              <Collapse in={opened} sx={{ borderTop: '1px solid #000', minWidth: '240px' }} >
                <List sx={{ width: '100%' }}>
                  {mockMenu.map((root) => (
                    <Fragment key={root.id}>
                      <Tooltip title={!isExpanded ? root.label : ''} placement="right">
                        <ListItemButton
                          disableGutters
                          onClick={() => {handleClickMenu(root);}}
                          sx={{
                            bgcolor: pathname.includes(root.id)
                              ? 'rgba(40, 74, 99, 0.10)'
                              : '',
                            paddingY: theme.spacing(2),
                          }}
                        >
                          {isExpanded && (
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
                                {root.label}
                              </TextStyle>
                              {root.subMenu && (
                                <Icon
                                  textVariant="body4"
                                  iconName="chevron-right"
                                />
                              )}
                            </RowWrapper>
                          )}
                        </ListItemButton>
                      </Tooltip>
                    </Fragment>
                  ))}
                </List>
              </Collapse>
            </Box>
            {mockMenu.map((root) => {
              return (isExpanded && root.subMenu && renderSubMenu(root, [root.id], true));
            })}
          </Box>
        </>
      }
    </Box>
  );
};

export default StepperDropdown;
