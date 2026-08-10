'use client';

import * as React from 'react';

import { roles } from '@/configs/constants/general';
import useApp from '@/hooks/useApp';

import {
  MasterParameterTabPanel,
  MasterParameterTabs,
  MasterParameterTabsProvider,
} from '@/components/layouts/MasterParameterLayout/components/MasterParameterTabs';
import useMasterParameter from '@/components/layouts/MasterParameterLayout/MasterParameter.hook';

import { NavigationProvider, useNavigationContext } from '../context/NavigationContext';

import TabListOfValue from './components/TabListOfValue/TabListOfValue';
import TabSummary from './components/TabSummary/TabSummary';
import TabValidation from './components/TabValidation/TabValidation';
import { TAB } from './Detail.constant';

import type {
  MasterParameterTabItems,
  TabValue,
} from '@/components/layouts/MasterParameterLayout/components/MasterParameterTabs';


const DetailPage = () => {
  return (
    <NavigationProvider>
      <DetailPageContent />
    </NavigationProvider>
  );
};

const DetailPageContent = () => {
  const { isSubmission, isViewOnly } = useMasterParameter();
  const [{ currentRole }] = useApp();
  const { navigationData } = useNavigationContext();

  const isMaker = currentRole?.includes?.(roles.MAKER);
  const isChecker = currentRole?.includes?.(roles.CHECKER);
  // Determine initial tab based on role, status, and subModule from navigation
  const getInitialTab = (): TabValue => {
    // For bucket-list detail view, always start with List of Value
    if (navigationData.isBucketListDetail) {
      return TAB.LIST_OF_VALUE;
    }

    // If subModule is provided from navigation (e.g., from approval modal), use it
    if (navigationData.subModule && Object.values(TAB).includes(navigationData.subModule as any)) {
      return navigationData.subModule as TabValue;
    }

    // Fallback logic based on role and status
    if (isChecker && !isViewOnly && navigationData.status === 'WAITING_APPROVAL_CHECKER') {
      return TAB.SUMMARY; // Checker starts from summary
    }
    return TAB.LIST_OF_VALUE; // Default for maker or view-only
  };

  const [activeTab, setActiveTab] = React.useState<TabValue>(getInitialTab());
  const handleTabChange = (val: TabValue) => {
    // Prevent switching to disabled tabs for bucket-list detail view
    if (navigationData.isBucketListDetail && (val === TAB.SUMMARY || val === TAB.VALIDATION)) {
      return;
    }
    setActiveTab(val);
  };

  // Update active tab when navigation data changes
  React.useEffect(() => {
    const newInitialTab = getInitialTab();
    setActiveTab(newInitialTab);
  }, [navigationData.status, navigationData.subModule, navigationData.isBucketListDetail, isChecker, isViewOnly]);

  // Determine tab items based on role and mode
  const tabItems: MasterParameterTabItems = React.useMemo(() => {
    // For checker in edit mode with WAITING_APPROVAL_CHECKER status, show only Summary and Validation
    if (isChecker && !isViewOnly && navigationData.status === 'WAITING_APPROVAL_CHECKER') {
      return [
        {
          label: 'Summary',
          value: TAB.SUMMARY,
        },
        {
          label: 'Validation',
          value: TAB.VALIDATION,
        }
      ];
    }

    // Default: show all tabs, but disable Summary and Validation for bucket-list detail view
    return [
      {
        label: 'List of Value',
        value: TAB.LIST_OF_VALUE,
      },
      {
        disabled: navigationData.isBucketListDetail,
        label: 'Summary',
        value: TAB.SUMMARY, // Disable for bucket-list detail view
      },
      {
        disabled: navigationData.isBucketListDetail,
        label: 'Validation',
        value: TAB.VALIDATION, // Disable for bucket-list detail view
      }
    ];
  }, [isChecker, isViewOnly, navigationData.status, navigationData.isBucketListDetail]);

  return (
    <MasterParameterTabsProvider value={{ activeTab, setActiveTab }}>
      <MasterParameterTabs
        activeTab={activeTab}
        onChange={handleTabChange}
        items={tabItems}
      />

      {/* Show List of Value tab for maker, view-only mode, or bucket-list detail view */}
      {(!isChecker || isViewOnly || navigationData.status !== 'WAITING_APPROVAL_CHECKER' || navigationData.isBucketListDetail) && (
        <MasterParameterTabPanel value={TAB.LIST_OF_VALUE}>
          <TabListOfValue />
        </MasterParameterTabPanel>
      )}

      <MasterParameterTabPanel value={TAB.SUMMARY}>
        <TabSummary />
      </MasterParameterTabPanel>

      <MasterParameterTabPanel value={TAB.VALIDATION}>
        <TabValidation />
      </MasterParameterTabPanel>
    </MasterParameterTabsProvider>
  );
};

export default DetailPage;
