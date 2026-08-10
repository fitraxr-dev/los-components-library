'use client';
import React, { useRef } from 'react';

import { useTheme } from '@mui/material';

import ColumnWrapper from '@/components/shared/ColumnWrapper';
import Tabs, { TabItem } from '@/components/shared/Tabs';
import Title from '@/components/shared/Title';

import InternalAssesment from '../../components/TableInternalAssesment';
import { tabItems, tabs } from '../OtherRelated.constants';

import TabGeneralInformation from './components/TabGeneralInformation';
import useOtherRelatedDetailForm from './OtherRelatedDetailForm.hook';

import type { ReactNode } from 'react';


const OtherRelatedDetailFormPage = () => {
  const theme = useTheme();
  const formRef = useRef<{ isDirty: boolean }>({ isDirty: false });
  const { activeTab, setActiveTab, title } = useOtherRelatedDetailForm();

  const TabWrapper = ({ children }: {children: ReactNode}) => {
    return (
      <ColumnWrapper gap={theme.spacing(3)}>
        {children}
      </ColumnWrapper>
    );
  };

  return (
    <ColumnWrapper gap={theme.spacing(3)}>
      <Title title={title} />
      <Tabs
        activeTab={activeTab}
        onChange={(val) => {
          const isFormDirty = formRef.current?.isDirty || false;
          setActiveTab(val as string, isFormDirty);
        }}
        items={tabItems}
      />
      <TabItem activeValue={activeTab} value={tabs.generalInformation}>
        <TabWrapper>
          <TabGeneralInformation isDetailPage={title.includes('Detail')} />
        </TabWrapper>
      </TabItem>
      <TabItem activeValue={activeTab} value={tabs.internalAssessment}>
        <TabWrapper>
          <InternalAssesment />

        </TabWrapper>
      </TabItem>
    </ColumnWrapper>
  );
};

export default OtherRelatedDetailFormPage;
