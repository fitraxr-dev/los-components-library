'use client';
import React from 'react';

import { FormProvider } from 'react-hook-form';

import ColumnWrapper from '@/components/shared/ColumnWrapper';
import Title from '@/components/shared/Title';

import Contractor from './components/Contractor';
import Tabs, { TabItem } from './components/CustomTabs';
import OtherProjectInformation from './components/OtherProjectInformation';
import ProjectInformation from './components/ProjectInformation';
import ProjectOwner from './components/ProjectOwner';
import useProjectDetailPage from './ProjectDetailPage.hook';


const ProjectDetailPage = () => {
  const {
    methods,
    activeTab,
    handleChangeTab,
    tabItems,
  } = useProjectDetailPage();


  return (
    <FormProvider {...methods} >
      <ColumnWrapper sx={{ gap: 3 }}>
        <Tabs
          variant="fullWidth"
          activeTab={activeTab}
          onChange={(val: number) => handleChangeTab(val)}
          items={tabItems}
        />
        <Title title="Detail Project" />
        <TabItem activeValue={activeTab} value={0}>
          <ProjectInformation />
        </TabItem>

        <TabItem activeValue={activeTab} value={1}>
          <OtherProjectInformation />
        </TabItem>

        <TabItem activeValue={activeTab} value={2}>
          <ProjectOwner />
        </TabItem>

        <TabItem activeValue={activeTab} value={3}>
          <Contractor />
        </TabItem>


      </ColumnWrapper>
    </FormProvider>
  );
};

export default ProjectDetailPage;
