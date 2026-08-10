'use client';
import React from 'react';

import { Box, Tooltip } from '@mui/material';
import { FormProvider } from 'react-hook-form';

import { TypeModule, TypeProcess } from '@/enums/Module';

import ActionButtons from '@/components/shared/ActionButtons';
import BaseContainer from '@/components/shared/BaseContainer';
import Button from '@/components/shared/Button';
import ColumnWrapper from '@/components/shared/ColumnWrapper';
import Icon from '@/components/shared/Icon';
import Input from '@/components/shared/Input';
import RowWrapper from '@/components/shared/RowWrapper';
import SectionTitle from '@/components/shared/SectionTitle';
import TableDebtorInformation from '@/components/shared/SmiTable/TableDebtorInformation';
import Table from '@/components/shared/Table';
import TextStyle from '@/components/shared/TextStyle';
import Title from '@/components/shared/Title';

import TableDebtorInformationSyariah from '../../../TableDebtorInformationLocal';
import ButtonClose from '../ButtonClose';

import useProjectPage from './ProjectPage.hooks';


const ProjectPage = () => {
  const {
    methods,
    tableHeaderList,
    theme,
    filter,
    setFilter,
    filterDropdownList,
    filterContentList,
    dataProject,
    page,
    pageSize,
    setPage,
    setPageSize,
    dateAsOf,
    isDebtor,
    isLoadingProject,
  } = useProjectPage();

  return (
    <FormProvider {...methods} >
      <ColumnWrapper sx={{ gap: theme.spacing(3), paddingY: theme.spacing(3) }}>
        <Title title="Project" />
        {isDebtor ?
          <TableDebtorInformationSyariah title="Project" />
          :
          <TableDebtorInformation
            isMaintenanceCustomer={true}
            module={TypeModule.MAINTENANCE_DATA}
            process={TypeProcess.MAINTENANCE_CUSTOMER}
          />
        }
        <SectionTitle title="Project" isOpen>
          <RowWrapper alignItems="center" py={theme.spacing(3)} gap={theme.spacing(2)}>
            <TextStyle
              variant="body4"
              weight={600}
              color={theme.palette.custom.text}
            >
              Data as of : {dateAsOf}
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
          <Box width="45vw">
            <Input
              type="search"
              value={filter}
              onChange={setFilter}
              placeholder="Pencarian..."
              dropdownList={filterDropdownList}
              contentList={filterContentList}
            />
          </Box>
          <BaseContainer>
            <Table
              tableHeader={tableHeaderList}
              tableData={dataProject?.contents ?? []}
              isLoading={isLoadingProject}
              totalPage={dataProject?.page?.totalPage ?? 0}
              pageSize={pageSize}
              currentPage={page}
              handlePageChange={setPage}
              onPageSizeChange={setPageSize}
            />
          </BaseContainer>
        </SectionTitle>
        <RowWrapper sx={{ gap: 2, justifyContent: 'end', pb: 2, pt: 3 }}>
          <ButtonClose />
        </RowWrapper>
      </ColumnWrapper>
    </FormProvider>
  );
};

export default ProjectPage;
