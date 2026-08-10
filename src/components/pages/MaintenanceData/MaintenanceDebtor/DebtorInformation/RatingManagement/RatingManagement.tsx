'use client';

import React from 'react';

import NiceModal, { ModalDef } from '@ebay/nice-modal-react';
import { Box, Tooltip, useTheme } from '@mui/material';
import { Controller } from 'react-hook-form';

import { TypeModule, TypeProcess } from '@/enums/Module';
import { formatDateTime } from '@/helpers/date';

import HistoryRatingModal from '@/components/pages/Review/EligibilityReview/RatingPage/components/HistoryRating';
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

import ActionFooterDetail from '../../components/ActionFooterDetail/ActionFooterDetail';
import TableDebtorInformationLocal from '../../components/TableDebtorInformationLocal';

import { MODAL_ID } from './RatingManagement.constants';
import useRatingManagement from './RatingManagement.hooks';


const RatingManagement = () => {
  const theme = useTheme();
  const {
    // control,
    // handleSubmit,
    tableHeader,
    filterDropdownList,
    filterContentList,
    filter,
    setFilter,
    ratingManagementData,
    page,
    pageSize,
    setPage,
    setPageSize,
    isDebtor,
    debtorData,
    actions,
    handleOpenSubmitModal,
    isSubmitLoading,
    isViewOnly,
    handleClose,
    pathname,
  } = useRatingManagement();

  const saveAction = actions?.action ? actions?.action[ACTIONS.SAVE] : null;

  return (
    <ColumnWrapper sx={{ gap: theme.spacing(3), paddingY: theme.spacing(3) }}>
      <Title title="Rating Management" />
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
      <SectionTitle title="Rating Management" isOpen>
        <RowWrapper alignItems="center" py={theme.spacing(3)} gap={theme.spacing(2)}>
          <TextStyle
            variant="body4"
            weight={600}
            color={theme.palette.custom.text}
          >
            Data as of : { ratingManagementData?.data?.additionalData?.lastUpdate ? formatDateTime(ratingManagementData?.data?.additionalData?.lastUpdate) : '-' }
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
              value={filter}
              onChange={setFilter}
              placeholder="Pencarian..."
              dropdownList={filterDropdownList}
              contentList={filterContentList}
            />
          </Box>
          <RowWrapper py={3} gap={2} justifyContent="end">
            <Button
              startIcon="filter-3"
              startIconSx={{ fontSize: 12 }}
              onClick={() => {
                NiceModal.show(MODAL_ID.HISTORY_MODAL, {
                  cantAccess: true,
                  module: TypeModule.MAINTENANCE_DATA,
                  process: TypeProcess.MAINTENANCE_CUSTOMER,
                });
              }}
            >
              View Rating History
            </Button>
          </RowWrapper>
        </RowWrapper>

        <BaseContainer sx={{ boxShadow: 7, padding: theme.spacing(2) }}>
          <Table
            tableHeader={tableHeader}
            tableData={ratingManagementData?.data?.contents ?? []}
            // maxWidth="100%"
            pageSize={pageSize}
            totalPage={ratingManagementData?.data?.page?.totalPage ?? 0}
            currentPage={page}
            handlePageChange={setPage}
            onPageSizeChange={setPageSize}
          />


        </BaseContainer>

      </SectionTitle>

      <ActionFooterDetail />
      <ModalDef id={MODAL_ID.HISTORY_MODAL} component={HistoryRatingModal} />

    </ColumnWrapper>
  );
};

export default RatingManagement;
