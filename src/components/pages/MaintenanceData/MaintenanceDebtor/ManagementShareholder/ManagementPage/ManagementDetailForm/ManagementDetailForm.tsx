'use client';

import { useRef } from 'react';

import { useTheme } from '@mui/material';

import ColumnWrapper from '@/components/shared/ColumnWrapper';
import Tabs, { TabItem } from '@/components/shared/Tabs';
import Title from '@/components/shared/Title';


import InternalAssesment from '../../components/TableInternalAssesment';

import ManagementDetailForm from './Form';
import useManagementDetailPage from './ManagementDetailForm.hook';

import type { ReactNode } from 'react';


const ManagementDetailPage = () => {
  const theme = useTheme();
  const formRef = useRef<{ isDirty: boolean }>({ isDirty: false });

  const {
    activeTab,
    handleChangeTab,
    TAB,
    isEditPage,
  } = useManagementDetailPage();

  const TabWrapper = ({ children }: {children: ReactNode}) => {
    return (
      <ColumnWrapper gap={theme.spacing(3)}>
        {children}
      </ColumnWrapper>
    );
  };

  return (
    <ColumnWrapper gap={theme.spacing(3)}>
      <Tabs
        activeTab={activeTab}
        onChange={(val: string) => {
          const isFormDirty = formRef.current?.isDirty || false;
          handleChangeTab(val, isFormDirty);
        }}
        items={TAB}
      />

      <TabItem activeValue={activeTab} value="FORM">
        <TabWrapper>
          <ManagementDetailForm ref={formRef} />
        </TabWrapper>
      </TabItem>

      <TabItem activeValue={activeTab} value="INTERNAL">
        <TabWrapper>
          <InternalAssesment />
        </TabWrapper>
      </TabItem>
    </ColumnWrapper>
  );
};

export default ManagementDetailPage;
