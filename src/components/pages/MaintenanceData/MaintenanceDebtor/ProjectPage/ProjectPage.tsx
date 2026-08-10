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

import ActionFooterDetail from '../components/ActionFooterDetail/ActionFooterDetail';
import TableDebtorInformationLocal from '../components/TableDebtorInformationLocal';

import { mockTableData, tabItems, tabs } from './ProjectPage.constants';
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
    actions,
    handleClose,
    isSubmitLoading,
    handleOpenSubmitModal,
    isDebtor,
    debtorData,
  } = useProjectPage();

  return (
    <FormProvider {...methods} >
      <ColumnWrapper sx={{ gap: theme.spacing(3), paddingY: theme.spacing(3) }}>
        <Title title="Project" />
        { isDebtor ?
          <>
            <TableDebtorInformationLocal
              debtorName={debtorData?.name}
              gamName={debtorData?.gamName}
              staffName={debtorData?.staffName}
              isNewClient={debtorData?.isNewDebtor}
              cif={debtorData?.cif}
              division={debtorData?.divisionName}
              debtorId={debtorData?.debtorId}
              createdAt={debtorData?.createdDate}
            />
          </> :
          <>
            <TableDebtorInformation
              isMaintenanceCustomer={true}
              module={TypeModule.MAINTENANCE_DATA}
              process={TypeProcess.MAINTENANCE_CUSTOMER}
            />
          </>
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
              tableData={dataProject?.data?.contents ?? []}
              isLoading={false}
              totalPage={dataProject?.data?.page?.totalPage ?? 0}
              pageSize={pageSize}
              currentPage={page}
              handlePageChange={setPage}
              onPageSizeChange={setPageSize}
            />
          </BaseContainer>
        </SectionTitle>
        <ActionFooterDetail />
      </ColumnWrapper>
    </FormProvider>
  );
};

export default ProjectPage;
