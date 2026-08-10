'use client';
import React from 'react';

import { Box, Tooltip } from '@mui/material';

import { TypeModule, TypeProcess } from '@/enums/Module';
import { formatDate, formatDateTime } from '@/helpers/date';

import BaseContainer from '@/components/shared/BaseContainer';
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

import useLpaPage from './LpaPage.hooks';


const LpaPage = () => {
  const {
    tableHeaderList,
    theme,
    filter,
    setFilter,
    filterDropdownList,
    filterContentList,
    isDebtor,
    debtorData,
    lpaData,
  } = useLpaPage();

  const lpaDataContents = [];
  lpaData?.data?.contents.forEach((item: any) => {
    lpaDataContents.push({
      ...item,
      assessmentDate: item?.assessmentDate ? formatDate(item?.assessmentDate) : '-',
      reportDate: item?.reportDate ? formatDate(item?.reportDate) : '-',
    });
  });

  return (
    <ColumnWrapper sx={{ gap: 3 }}>
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
      <Title title="LPA "></Title>
      <SectionTitle title="Informasi LPA" isOpen></SectionTitle>
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
      <RowWrapper alignItems="center" py={theme.spacing(2)} gap={theme.spacing(2)}>
        <TextStyle
          variant="body4"
          weight={600}
          color={theme.palette.custom.text}
        >
          Data as of : {formatDateTime(lpaData?.data?.additionalData?.lastUpdate) ?? ''}
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

      <BaseContainer sx={{ boxShadow: 7 }}>
        <Table
          tableHeader={tableHeaderList}
          tableData={lpaDataContents ?? []}
        />
      </BaseContainer>
      <ActionFooterDetail />
    </ColumnWrapper>
  );
};

export default LpaPage;
