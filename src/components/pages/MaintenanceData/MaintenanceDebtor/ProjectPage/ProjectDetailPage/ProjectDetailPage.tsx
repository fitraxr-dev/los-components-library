'use client';
import React from 'react';

import { Box, Tooltip } from '@mui/material';
import { FormProvider } from 'react-hook-form';


import { formatDateTime } from '@/helpers/date';

import BaseContainer from '@/components/shared/BaseContainer';
import Button from '@/components/shared/Button';
import ColumnWrapper from '@/components/shared/ColumnWrapper';
import Icon from '@/components/shared/Icon';
import Input from '@/components/shared/Input';
import RowWrapper from '@/components/shared/RowWrapper';
import SectionTitle from '@/components/shared/SectionTitle';
import Table from '@/components/shared/Table';
import TextStyle from '@/components/shared/TextStyle';
import Title from '@/components/shared/Title';

import Contractor from './components/Contractor';
import Tabs, { TabItem } from './components/CustomTabs';
import OtherProjectInformation from './components/OtherProjectInformation';
import ProjectInformation from './components/ProjectInformation';
import ProjectOwner from './components/ProjectOwner';
import { mockTableData } from './ProjectDetail.constant';
import useProjectDetailPage from './ProjectDetailPage.hook';


const ProjectDetailPage = () => {
  const {
    handleSaveMethod,
    methods,
    activeTab,
    handleChangeTab,
    tabItems,
    tableHeaderList,
    theme,
    projectFacilityData,
    isLoadingProjectFacility,
    projectFacilityPage,
    projectFacilityPageSize,
    projectFacilityFilter,
    setProjectFacilityFilter,
    setProjectFacilityPageSize,
    projectFacilitySearchByOptions,
    projectFacilityFilterContentList,
    setProjectFacilityPage,
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

        <SectionTitle title="List Facility Project" isOpen>
          <RowWrapper alignItems="center" py={theme.spacing(3)} gap={theme.spacing(2)}>
            <TextStyle
              variant="body4"
              weight={600}
              color={theme.palette.custom.text}
            >
              Data as of : {projectFacilityData?.data?.additionalData?.lastUpdate ? formatDateTime(projectFacilityData?.data?.additionalData?.lastUpdate) : '-'}
            </TextStyle>
            <TextStyle
              variant="body4"
              weight={600}
              color={theme.palette.error.main}
            >
              <Tooltip title="Tanggal dan jam update data terakhir" placement="right">
                <Box display="flex" alignItems="center">
                  <Icon iconName="information-shape" />
                </Box>
              </Tooltip>
            </TextStyle>
          </RowWrapper>

          <RowWrapper justifyContent="space-between">
            <Box width="45vw">
              <Input
                type="search"
                value={projectFacilityFilter}
                onChange={setProjectFacilityFilter}
                placeholder="Pencarian..."
                dropdownList={projectFacilitySearchByOptions}
                contentList={projectFacilityFilterContentList}
              />
            </Box>
          </RowWrapper>
          <BaseContainer>
            <Table
              tableHeader={tableHeaderList}
              tableData={projectFacilityData?.data.contents}
              isLoading={isLoadingProjectFacility}
              totalPage={projectFacilityData?.data.page.totalPage}
              pageSize={projectFacilityPageSize}
              currentPage={projectFacilityPage}
              handlePageChange={(page) => setProjectFacilityPage(page)}
              onPageSizeChange={(size) => setProjectFacilityPageSize(size)}
            />
          </BaseContainer>
        </SectionTitle>

      </ColumnWrapper>
    </FormProvider>
  );
};

export default ProjectDetailPage;
