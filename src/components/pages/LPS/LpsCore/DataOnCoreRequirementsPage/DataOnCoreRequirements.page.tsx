'use client';
import React from 'react';

import { FormProvider } from 'react-hook-form';

import Button from '@/components/shared/Button';
import ColumnWrapper from '@/components/shared/ColumnWrapper';
import Icon from '@/components/shared/Icon';
import RowWrapper from '@/components/shared/RowWrapper';
import Tabs, { TabItem } from '@/components/shared/Tabs';
import TextStyle from '@/components/shared/TextStyle';
import Title from '@/components/shared/Title';

import CustomerData from './components/CustomerData';
import DebtorIdentity from './components/DebtorIdentity';
import ManajemenShareholder from './components/ManajemenShareholder';
import { TAB_ITEMS, TABS } from './DataOnCoreRequirements.constants';
import useDataOnCoreRequirements from './DataOnCoreRequirements.hook';


const DataOnCoreRequirements = () => {
  const {
    activeTab,
    methods,
    onSubmit,
    setActiveTab,
    isNotValidForm,
    handleRouteMaintenanceDebitor,
  } = useDataOnCoreRequirements();

  return (
    <ColumnWrapper sx={{ gap: 3 }}>
      <FormProvider {...methods}>
        {isNotValidForm &&
          <RowWrapper
            justifyContent="space-between"
            alignItems="center"
            mb={2}
            sx={{ backgroundColor: '#fffce4', padding: 2 }}
          >
            <RowWrapper gap={1}>
              <Icon
                textVariant="body1"
                iconName="warning-2"
              />
              <TextStyle>
                Masih terdapat data mandatory Customer yang belum lengkap.
                Silakan lengkapi data tersebut melalui menu Maintenance Customer.
              </TextStyle>
            </RowWrapper>
          </RowWrapper>
        }
        <RowWrapper
          sx={{
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >

          <Title title="Data On Core Requirements" />
          <Button startIcon="monitoring" onClick={handleRouteMaintenanceDebitor}>
            Go to Maintenance Customer
          </Button>

        </RowWrapper>


        <Tabs activeTab={activeTab} onChange={(val: string) => setActiveTab(val)} items={TAB_ITEMS} />

        <TabItem activeValue={activeTab} value={TABS.CUSTOMER_INFO}>
          <ColumnWrapper sx={{ gap: 3 }}>
            <CustomerData />
            <DebtorIdentity />
          </ColumnWrapper>
        </TabItem>

        <TabItem activeValue={activeTab} value={TABS.MANAGEMENT_SHAREHOLDER}>
          <ColumnWrapper sx={{ gap: 3 }}>
            <ManajemenShareholder />
          </ColumnWrapper>
        </TabItem>

        <RowWrapper sx={{ justifyContent: 'flex-end' }}>
          <Button onClick={methods.handleSubmit(onSubmit)}>Next</Button>
        </RowWrapper>
      </FormProvider>
    </ColumnWrapper>
  );
};

export default DataOnCoreRequirements;
