'use client';
import { Box, Tooltip, useTheme } from '@mui/material';
import MuiTab from '@mui/material/Tab';
import MuiTabs from '@mui/material/Tabs';

import Icon from '@/components/shared/Icon';
import TextStyle from '@/components/shared/TextStyle';

import type { TabItemProps, TabsProps } from './types';


const Tabs = ({
  activeTab,
  onChange = () => { },
  items = [],
  variant = 'fullWidth',
  activeBackgroundColor = false,
  dataChangesList = [],
}: TabsProps & { activeBackgroundColor?: boolean }) => {
  const theme = useTheme();

  const defaultActiveBg = '#f0f0f0';

  return (
    <MuiTabs
      value={activeTab}
      onChange={(_, val) => onChange(val)}
      aria-label="Tabs"
      textColor="primary"
      indicatorColor="primary"
      variant={variant}
      sx={{
        borderBottom: `1px solid ${theme.palette.custom.gray40}`,
      }}
    >
      {items.map((el, index) => {
        const isActive = activeTab === (el.value ?? index);

        return (
          <MuiTab
            disabled={el.disabled}
            key={el.label}
            label={
              <Box sx={{ alignItems: 'center', display: 'flex', gap: 1, justifyContent: 'center', minHeight: '32px', position: 'relative', width: '100%' }}>
                {el.isButtonShow && (
                  <Box
                    sx={{
                      backgroundColor: theme.palette.success.main,
                      border: `0.15px solid ${theme.palette.common.white}`,
                      borderRadius: '50%',
                      height: '12px',
                      position: 'absolute',
                      right: '-14px',
                      top: '-6px',
                      width: '12px',
                      zIndex: 1,
                    }}
                  />
                )}

                {dataChangesList.length > 0 && dataChangesList.includes(el.value) && (
                  <Box
                    sx={{
                      backgroundColor: theme.palette.custom.softRed,
                      borderRadius: '100%',
                      height: theme.spacing(2.8),
                      position: 'absolute',
                      right: 0,
                      top: 0,
                      width: theme.spacing(2.8),
                    }}
                  />
                )}
                {el.label}
                {el.tooltip && (
                  <Tooltip
                    title={
                      <Box>
                        <TextStyle variant="body6">
                          {el.tooltip}
                        </TextStyle>
                      </Box>
                    }
                    placement="top"
                    slotProps={{
                      tooltip: {
                        sx: {
                          backgroundColor: theme.palette.primary.main,
                          color: '#fff',
                        },
                      },
                    }}
                  >
                    <Box display="flex" alignItems="center" sx={{ color: theme.palette.primary.main, cursor: 'pointer' }}>
                      <Icon iconName="tooltip-info" />
                    </Box>
                  </Tooltip>
                )}
              </Box>
            }
            value={el.value || index}
            sx={{
              color: isActive
                ? theme.palette.primary.main
                : theme.palette.custom.gray40,
              ...(isActive && activeBackgroundColor
                ? {
                  backgroundColor: defaultActiveBg,
                  borderTopLeftRadius: theme.shape.borderRadius,
                  borderTopRightRadius: theme.shape.borderRadius,
                }
                : {}),
            }}
          />
        );
      })}
    </MuiTabs>
  );
};

export const TabItem = ({
  activeValue,
  children,
  value,
  sx = {},
}: TabItemProps) => {
  return (
    <>
      {activeValue === value && <Box sx={sx}>{children}</Box>}
    </>
  );
};

export default Tabs;
