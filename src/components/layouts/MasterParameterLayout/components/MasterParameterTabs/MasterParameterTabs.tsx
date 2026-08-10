'use client';
import * as React from 'react';

import { ChevronRightRounded } from '@mui/icons-material';
import {
  Box,
  Fade,
  IconButton,
  Paper,
  Tab,
  Tabs,
  useTheme,
} from '@mui/material';
import { usePathname, useSearchParams } from 'next/navigation';

import useCustomRouter from '@/hooks/useCustomRouter';

import RowWrapper from '@/components/shared/RowWrapper';
import TextStyle from '@/components/shared/TextStyle';

import { useMasterParameterTabs } from './MasterParameterTabs.context';

import type {
  MasterParameterTabItems,
  MasterParameterTabPanelProps,
  MasterParameterTabsProps,
} from './MasterParameterTabs.types';
import type { MipStepResponseDto } from '@/services/openapi/processor-service';


const isStepperItem = (
  item: MasterParameterTabItems extends Array<infer U> ? U : never
): item is MipStepResponseDto => {
  // eslint-disable-next-line eqeqeq
  return item != null && typeof item === 'object' && 'bucketProcessId' in item;
};

export const MasterParameterTabs = ({
  items: rawItems = [],
  onValueChange,
}: MasterParameterTabsProps) => {
  const theme = useTheme();

  const router = useCustomRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const { activeTab, setActiveTab } = useMasterParameterTabs();

  const items = React.useMemo(() => {
    if (!rawItems || rawItems.length === 0) return [];

    return rawItems.map((item) => {
      if (isStepperItem(item)) {
        return {
          disabled: item.enable === false,
          label: item.label,
          value: String(item.key),
        };
      }

      return {
        disabled: Boolean(item.disabled),
        label: item.label,
        value: String(item.value),
      };
    });
  }, [rawItems]);

  const firstEnabledTab = React.useMemo(
    () => items.find((item) => !item.disabled)?.value ?? null,
    [items]
  );

  const tabParam = searchParams.get('tab');
  const replaceUrl = React.useCallback((nextTab: string | null) => {
    const params = new URLSearchParams(searchParams.toString());
    if (nextTab) params.set('tab', nextTab);
    else params.delete('tab');

    const qs = params.toString();
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
  }, [searchParams]);

  const isEnabled = React.useCallback(
    (v: string | null | undefined) =>
      !!v && items.some((i) => i.value === v && !i.disabled),
    [items]
  );

  React.useEffect(() => {
    if (!items.length) return;

    const stateEnabled = isEnabled(String(activeTab));
    const urlEnabled = isEnabled(tabParam);

    if (stateEnabled) {
      if (tabParam !== activeTab) {
        replaceUrl(String(activeTab)!);
      }
      return;
    }

    if (urlEnabled) {
      if (activeTab !== tabParam) {
        setActiveTab(tabParam!);
      }
      return;
    }

    if (firstEnabledTab) {
      if (activeTab !== firstEnabledTab) {
        setActiveTab(firstEnabledTab);
      }
      if (tabParam !== firstEnabledTab) {
        replaceUrl(firstEnabledTab);
      }
    }
  }, [items, tabParam, activeTab, setActiveTab, firstEnabledTab, replaceUrl]);

  const currentIndex = React.useMemo(
    () => items.findIndex((item) => item.value === activeTab),
    [items, activeTab]
  );

  const nextIndex = React.useMemo(() => {
    const start = currentIndex < 0 ? -1 : currentIndex;
    for (let i = start + 1; i < items.length; i++) {
      if (!items[i]?.disabled) return i;
    }
    return -1;
  }, [currentIndex, items]);

  const canGoNext = nextIndex !== -1;
  const goNext = React.useCallback(() => {
    if (!canGoNext) return;
    setActiveTab(items[nextIndex].value);
  }, [canGoNext, nextIndex, setActiveTab, items]);

  const handleOnChange = (_, val) => {
    setActiveTab(val);
    onValueChange?.(val);
  };

  return (
    <Paper
      elevation={7}
      sx={{
        backgroundColor: `${theme.palette.custom.chart30}33`,
        border: 1,
        borderColor: 'custom.chart30',
        borderRadius: 4,
        mb: 3,
        px: 3,
        py: 2,
      }}
    >
      <RowWrapper alignItems="center" justifyContent="space-between" mb={2}>
        <TextStyle variant="body2" color={theme.palette.primary.main} weight={600}>
          Menu
        </TextStyle>
        <IconButton
          size="small"
          color="primary"
          onClick={goNext}
          disabled={!canGoNext}
          sx={{ backgroundColor: 'custom.gray40', borderRadius: 2 }}
          aria-label="Go to next enabled tab"
        >
          <ChevronRightRounded fontSize="small" />
        </IconButton>
      </RowWrapper>

      <Tabs
        variant="fullWidth"
        value={activeTab}
        onChange={handleOnChange}
        sx={{
          '& .MuiTabs-flexContainer': { gap: 2 },
          '& .MuiTabs-indicator': { display: 'none' },
        }}
      >
        {items.map((item, idx) => (
          <Tab
            key={`${String(item.value)}-${idx}`}
            label={item.label}
            value={item.value}
            disabled={item.disabled}
            disableRipple
            sx={{
              '&.Mui-selected': {
                bgcolor: 'primary.main',
                color: 'primary.contrastText',
              },
              '&:not(.Mui-selected):hover': {
                bgcolor: 'action.selected',
              },
              bgcolor: 'background.paper',
              border: '1px solid',
              borderColor: 'primary.main',
              borderRadius: 2,
              color: 'primary.main',
              fontWeight: 600,
            }}
          />
        ))}
      </Tabs>
    </Paper>
  );
};

export const MasterParameterTabPanel = ({
  children,
  value,
  sx = {},
}: MasterParameterTabPanelProps) => {
  const { activeTab } = useMasterParameterTabs();
  const isActive = activeTab === value;

  if (!isActive) return null;

  return (
    <Fade in={isActive} mountOnEnter unmountOnExit={false}>
      <Box sx={sx}>{children}</Box>
    </Fade>
  );
};
