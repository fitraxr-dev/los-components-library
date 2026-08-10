'use client';

import React from 'react';

import { ModalDef } from '@ebay/nice-modal-react';
import { useTheme } from '@mui/material';

import { ActivityType } from '@/enums/Activity';
import useRecordLog from '@/hooks/useRecordLog';

import { useBreadcrumbs } from '@/components/layouts/MasterParameterLayout/components/Breadcrumbs/Breadcrumbs.context';
import BaseContainer from '@/components/shared/BaseContainer';
import Button from '@/components/shared/Button';
import ColumnWrapper from '@/components/shared/ColumnWrapper';
import Input from '@/components/shared/Input';
import RowWrapper from '@/components/shared/RowWrapper';
import Table from '@/components/shared/Table';
import Title from '@/components/shared/Title';

import ApprovalStatusModal from '../components/ApprovalStatusModal/ApprovalStatusModal';
import { NavigationProvider } from '../context/NavigationContext';

import useList from './List.hook';


const ListPage = () => {
  return (
    <NavigationProvider>
      <ListPageContent />
    </NavigationProvider>
  );
};

const ListPageContent = () => {
  const theme = useTheme();
  const { recordActivity } = useRecordLog();
  const { push, reset } = useBreadcrumbs();


  React.useEffect(() => {
    reset();
    push({ href: '/master-parameter/parameter-mapping-apu_ppt', label: 'Parameter APU PPT' });

    // Record activity for page access
    recordActivity({
      activity: ActivityType.VIEW,
      bucketProcessId: '',
      changeAfter: '',
      changeBefore: '',
      menuCode: '/master-parameter/parameter-mapping-apu_ppt',
      module: 'PARAMETER_APU_PPT',
      process: 'PARAMETER_APU_PPT',
      remarks: 'Accessed Parameter Mapping APU PPT List page',
    });
  }, [push, reset, recordActivity]);
  const {
    filter,
    filterContentList,
    filterDropdownList,
    handleOpenApprovalStatusModal,
    isLoading,
    page,
    pageSize,
    setFilter,
    setPage,
    setPageSize,
    tableData,
    tableHeader,
    totalPage,
  } = useList();

  const anomalyRowStyle = (rowData: any) => ({
    backgroundColor: !rowData?.isEditable ? '#FFF5E4' : 'inherit',
  });

  return (
    <>
      <Title title="Mapping Parameter APU PPT - Bentuk Usaha & Dokumen Diverifikasi" />
      <ColumnWrapper gap={theme.spacing(1)}>
        <RowWrapper justifyContent="space-between" alignItems="center">
          <Input
            type="search"
            value={filter}
            onChange={setFilter}
            placeholder="Pencarian..."
            dropdownList={filterDropdownList}
            contentList={filterContentList}
            containerSx={{ width: '45vw' }}
          />
          <Button
            onClick={handleOpenApprovalStatusModal}
            variant="contained"
          >
            Approval Status
          </Button>
        </RowWrapper>

        <BaseContainer sx={{ boxShadow: 7 }}>
          <Table
            tableHeader={tableHeader}
            tableData={tableData}
            totalPage={totalPage ?? 1}
            currentPage={page}
            handlePageChange={setPage}
            pageSize={pageSize}
            onPageSizeChange={setPageSize}
            isLoading={isLoading}
            anomalyRow={anomalyRowStyle}
          />
        </BaseContainer>
      </ColumnWrapper>

      <ModalDef
        id="APPROVAL_STATUS_MODAL_PARAMETER_APU_PPT"
        component={ApprovalStatusModal}
      />
    </>
  );
};

export default ListPage;
