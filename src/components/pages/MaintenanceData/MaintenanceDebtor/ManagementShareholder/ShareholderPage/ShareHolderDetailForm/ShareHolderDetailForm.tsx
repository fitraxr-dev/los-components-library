'use client';

import { useRef } from 'react';

import { useTheme } from '@mui/material';

import ColumnWrapper from '@/components/shared/ColumnWrapper';
import Tabs, { TabItem } from '@/components/shared/Tabs';
import Title from '@/components/shared/Title';

import InternalAssesment from '../../components/TableInternalAssesment';

import GeneralInformation from './GeneralInformation/GeneralInformation';
import { tab, tabItems } from './ShareHolder.constants';
import useShareHolderDetailForm from './ShareHolderDetailForm.hook';

import type { ReactNode } from 'react';


const ShareHolderDetailForm = () => {
  const theme = useTheme();
  const formRef = useRef<{ isDirty: boolean }>({ isDirty: false });

  const {
    activeTab,
    handleChangeTab,
  } = useShareHolderDetailForm();

  const TabWrapper = ({ children }: {children: ReactNode}) => {
    return (
      <ColumnWrapper gap={theme.spacing(3)}>
        {children}
      </ColumnWrapper>
    );
  };

  return (
    <ColumnWrapper gap={theme.spacing(3)}>
      <Title title="Detail Shareholder" />
      <Tabs
        activeTab={activeTab}
        onChange={(val: string) => {
          const isFormDirty = formRef.current?.isDirty || false;
          handleChangeTab(val, isFormDirty);
        }}
        items={tabItems}
      />
      <TabItem activeValue={activeTab} value={tab.GENERAL_INFORMATION}>
        <TabWrapper>
          <GeneralInformation ref={formRef} />
        </TabWrapper>
      </TabItem>
      <TabItem activeValue={activeTab} value={tab.INTERNAL_ASSESSMENT}>
        <TabWrapper>
          <InternalAssesment />
        </TabWrapper>
      </TabItem>
    </ColumnWrapper>
  );
};

export default ShareHolderDetailForm;
