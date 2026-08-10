'use client';
import React from 'react';

import { Box, Tooltip, useTheme } from '@mui/material';
import { Controller } from 'react-hook-form';

import { TypeModule, TypeProcess } from '@/enums/Module';

import ActionButtons, { ACTIONS } from '@/components/shared/ActionButtons';
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

import ActionFooterDetail from '../../components/ActionFooterDetail/ActionFooterDetail';
import TableDebtorInformationLocal from '../../components/TableDebtorInformationLocal';

import useBmpkAndOther from './BmpkAndOther.hook';


const BmpkAndOther = () => {
  const theme = useTheme();
  const {
    control,
    handleSubmit,
    isLoading,
    page,
    filter,
    filterContentList,
    filterDropdownList,
    setFilter,
    setPage,
    setPageSize,
    tableHeaderBmpk,
    tableDataBmpk,
    totalData,
    dataAsOfDate,
    isDebtor,
    debtorData,
    actions,
    isSubmitLoading,
    handleOpenSubmitModal,
    handleClose,
    isViewOnly,
  } = useBmpkAndOther();

  const saveAction = actions?.action ? actions?.action[ACTIONS.SAVE] : null;

  return (
    <ColumnWrapper sx={{ gap: 3, paddingY: theme.spacing(3) }}>
      <Title title="BMPK/BMPD/BMPP Individual" />
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

      <SectionTitle title="BMPK/BMPD/BMPP Individual" isOpen>
        <Box width="50%" py={2}>
          <Input
            type="search"
            value={filter}
            onChange={setFilter}
            placeholder="Pencarian..."
            dropdownList={filterDropdownList}
            contentList={filterContentList}
          />
        </Box>

        <Box display="flex" alignItems="center" pb={3} gap={1}>
          <TextStyle
            variant="body4"
            weight={500}
            color={theme.palette.custom.text}
          >
            Data as of : { dataAsOfDate }
          </TextStyle>
          <TextStyle
            variant="body4"
            weight={600}
            color={theme.palette.error.main}
          >
            <Tooltip
              slotProps={{
                tooltip: {
                  sx: {
                    backgroundColor: theme.palette.primary.main,
                  },
                },
              }}
              title="Tanggal dan jam update data terakhir"
              placement="right"
            >
              <Box display="flex" alignItems="center">
                <Icon iconName="information-shape" />
              </Box>
            </Tooltip>
          </TextStyle>
        </Box>

        <BaseContainer>
          <Table
            isLoading={isLoading}
            tableHeader={tableHeaderBmpk}
            tableData={tableDataBmpk}
            currentPage={page}
            totalPage={totalData?.totalPage ?? 1}
            handlePageChange={setPage}
            onPageSizeChange={setPageSize}
          />
        </BaseContainer>
      </SectionTitle>


      <ActionFooterDetail />
    </ColumnWrapper>
  );
};

export default BmpkAndOther;
