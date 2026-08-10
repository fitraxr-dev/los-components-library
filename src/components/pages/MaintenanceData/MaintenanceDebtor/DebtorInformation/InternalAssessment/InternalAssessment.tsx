'use client';
import React from 'react';

import { Box, Tooltip, useTheme } from '@mui/material';
import { Controller } from 'react-hook-form';

import { TypeModule, TypeProcess } from '@/enums/Module';
import { formatDateTime } from '@/helpers/date';

import ActionButtons, { ACTIONS } from '@/components/shared/ActionButtons';
import BaseContainer from '@/components/shared/BaseContainer';
import Button from '@/components/shared/Button';
import ColumnWrapper from '@/components/shared/ColumnWrapper';
import EmptyPlaceholder from '@/components/shared/EmptyPlaceholder';
import Icon from '@/components/shared/Icon';
import Input from '@/components/shared/Input';
import RowWrapper from '@/components/shared/RowWrapper';
import SectionTitle from '@/components/shared/SectionTitle';
import TableDebtorInformation from '@/components/shared/SmiTable/TableDebtorInformation';
import Table from '@/components/shared/Table';
import TextStyle from '@/components/shared/TextStyle';
import Title from '@/components/shared/Title';

import { data } from '../../../MasterSLA/DetailPage/components/ApprovalModal/ApprovalModal.constants';
import ActionFooterDetail from '../../components/ActionFooterDetail/ActionFooterDetail';
import TableDebtorInformationLocal from '../../components/TableDebtorInformationLocal';
import InternalAssesment from '../../ManagementShareholder/components/TableInternalAssesment';

import useInternalAssessment from './InternalAssessment.hooks';


const InternalAssessment = () => {
  const theme = useTheme();
  const {
    tableHeaderHighRisk,
    tableHeaderKepatuhan,
    highriskData,
    filterHighrisk,
    setFilterHighrisk,
    pageHighrisk,
    setPageHighrisk,
    pageSizeHighrisk,
    setPageSizeHighrisk,
    isDebtor,
    debtorData,
    actions,
    handleOpenSubmitModal,
    isSubmitLoading,
    isViewOnly,
    handleClose,
    databaseKepatuhanData,
    filterDatabaseKepatuhan,
    setFilterDatabaseKepatuhan,
    pageDatabaseKepatuhan,
    setPageDatabaseKepatuhan,
    pageSizeDatabaseKepatuhan,
    setPageSizeDatabaseKepatuhan,
    contentListHighRisk,
    contentListDatabaseKepatuhan,
    searchByOptionsDatabaseKepatuhan,
    sortByOptionsDatabaseKepatuhan,
    searchByOptionsHighRisk,
  } = useInternalAssessment();

  const saveAction = actions?.action ? actions?.action[ACTIONS.SAVE] : null;

  const databaseKepatuhan = databaseKepatuhanData?.data?.contents.map((item: any) => ({
    ...item,
    modifiedDate: item.modifiedDate ? formatDateTime(item.modifiedDate) : '-',
    summary: item.summary ? 'Yes' : 'No',
  }));


  return (
    <ColumnWrapper sx={{ gap: theme.spacing(3), paddingY: theme.spacing(3) }}>
      <Title title="Internal Assessment" />
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
            showDifferentDataAlert={false}
          />
        </>
      }
      <SectionTitle title="Credit Checking" isOpen>
        <InternalAssesment menu="internal-assessment" />
      </SectionTitle>

      <SectionTitle title="High Risk" isOpen>
        <Box width="45vw">
          <Input
            type="search"
            value={filterHighrisk}
            hasFilter
            onChange={setFilterHighrisk}
            placeholder="Pencarian..."
            useMinChar={false}
            dropdownList={searchByOptionsHighRisk.data}
            contentList={contentListHighRisk}
          />
        </Box>
        <RowWrapper alignItems="center" py={theme.spacing(3)} gap={theme.spacing(2)}>
          <TextStyle
            variant="body4"
            weight={600}
            color={theme.palette.custom.text}
          >
            Data as of : { highriskData?.data?.additionalData?.lastUpdate ? formatDateTime(highriskData?.data?.additionalData?.lastUpdate) : '-' }
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

        <BaseContainer>
          <Table
            tableHeader={tableHeaderHighRisk}
            tableData={highriskData?.data?.contents ?? []}
            pageSize={pageSizeHighrisk}
            totalPage={highriskData?.data?.page?.totalPage ?? 0}
            currentPage={pageHighrisk}
            handlePageChange={(page) => setPageHighrisk(page)}
            onPageSizeChange={(size) => setPageSizeHighrisk(size)}
          />
        </BaseContainer>
      </SectionTitle>

      <SectionTitle title="Database Kepatuhan" isOpen>
        <Box width="45vw">
          <Input
            type="search"
            value={filterDatabaseKepatuhan}
            hasFilter
            onChange={setFilterDatabaseKepatuhan}
            placeholder="Pencarian..."
            useMinChar={false}
            dropdownList={searchByOptionsDatabaseKepatuhan.data}
            contentList={contentListDatabaseKepatuhan}
          />
        </Box>
        <RowWrapper alignItems="center" py={theme.spacing(3)} gap={theme.spacing(2)}>
          <TextStyle
            variant="body4"
            weight={600}
            color={theme.palette.custom.text}
          >
            Data as of : { databaseKepatuhanData?.data?.additionalData?.lastUpdate ? formatDateTime(databaseKepatuhanData?.data?.additionalData?.lastUpdate) : '-' }
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

        <BaseContainer>
          <Table
            tableHeader={tableHeaderKepatuhan}
            tableData={databaseKepatuhan ?? []}
            pageSize={pageSizeDatabaseKepatuhan}
            totalPage={databaseKepatuhanData?.data?.page?.totalPage ?? 0}
            currentPage={pageDatabaseKepatuhan}
            handlePageChange={setPageDatabaseKepatuhan}
            onPageSizeChange={setPageSizeDatabaseKepatuhan}
          />
        </BaseContainer>
      </SectionTitle>


      <ActionFooterDetail />
    </ColumnWrapper>
  );
};

export default InternalAssessment;
