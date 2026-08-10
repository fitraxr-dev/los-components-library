'use client';
import { Box, useTheme } from '@mui/material';
import MuiTab from '@mui/material/Tab';
import MuiTabs from '@mui/material/Tabs';

import BaseContainer from '@/components/shared/BaseContainer';
import RowWrapper from '@/components/shared/RowWrapper';
import TextStyle from '@/components/shared/TextStyle';

import type { TabItemProps, TabsProps } from './types';


const Tabs = ({
  activeTab,
  onChange = () => { },
  items = [],
  variant = 'fullWidth',
}: TabsProps) => {
  const theme = useTheme();

  return (
    <BaseContainer
      sx={{
        background: 'rgba(163, 202, 233, 0.2)',
        border: `1px solid ${theme.palette.custom.chart40}`,
        boxShadow: 7,
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
        <MuiTabs
          value={activeTab}
          onChange={(_, val) => onChange(val)}
          aria-label="Tabs"
          textColor="primary"
          indicatorColor="primary"
          variant={variant}
          sx={{
            '& .MuiTab-root.Mui-selected': {
              background: theme.palette.primary.main,
              border: '1px solid #284A63',
              borderRadius: '0.5208333333333334vw',
              color: theme.palette.white.main,
              minHeight: 0,
              minWidth: 0,
              paddingX: theme.spacing(3),
              paddingY: theme.spacing(2),

            },
            '.MuiTabs-flexContainer': {
              gap: theme.spacing(2),
            },
            '.MuiTabs-scroller .MuiTabs-indicator': {
              backgroundColor: 'transparent',
            },
            width: '100%',
          }}
        >
          {items.map((el, index) => (
            <MuiTab
              disabled={el.disabled}
              key={el.label}
              label={el.label}
              value={el.value || index}
              sx={{
                background: theme.palette.white.main,
                border: `1px solid ${theme.palette.primary.main}`,
                borderRadius: '0.5208333333333334vw',
                color: theme.palette.primary.main,
                minHeight: 0,
                minWidth: 0,
                paddingX: theme.spacing(3),
                paddingY: theme.spacing(2),
              }}
            />
          ))}
        </MuiTabs>
      </RowWrapper>
    </BaseContainer>
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
      {activeValue === value && (
        <Box sx={sx}>
          {children}
        </Box>
      )}
    </>
  );
};

export default Tabs;
