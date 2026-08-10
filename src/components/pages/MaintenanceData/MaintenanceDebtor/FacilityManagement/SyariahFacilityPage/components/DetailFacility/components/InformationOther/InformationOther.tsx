'use client';

import { useRef } from 'react';

import { useTheme } from '@mui/material';

import ColumnWrapper from '@/components/shared/ColumnWrapper';
import Tabs, { TabItem } from '@/components/shared/Tabs';


import InformasiSindikasi from '../../../InformasiLainnya/components/InformasiSindikasiTab/InformasiSindikasiTab';
import LainnyaTab from '../../../InformasiLainnya/components/LainnyaTab/LainnyaTab';
import ProjectPage from '../../../InformasiLainnya/components/ProjectPage';

import useInformationOther from './InformationOther.hook';

import type { ReactNode } from 'react';


const InformationOther = () => {
  const theme = useTheme();
  const formRef = useRef<{ isDirty: boolean }>({ isDirty: false });

  const {
    activeTab,
    handleChangeTab,
    TAB,
  } = useInformationOther();

  const TabWrapper = ({ children }: { children: ReactNode }) => {
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

      <TabItem activeValue={activeTab} value="project">
        <TabWrapper>
          <ProjectPage />
        </TabWrapper>
      </TabItem>

      <TabItem activeValue={activeTab} value="syndication">
        <TabWrapper>
          <InformasiSindikasi />
        </TabWrapper>
      </TabItem>

      <TabItem activeValue={activeTab} value="other">
        <TabWrapper>
          <LainnyaTab />
        </TabWrapper>
      </TabItem>
    </ColumnWrapper>
  );
};

export default InformationOther;
