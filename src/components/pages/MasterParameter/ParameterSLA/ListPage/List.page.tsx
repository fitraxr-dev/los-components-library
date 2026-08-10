'use client';
import * as React from 'react';

import { ModalDef } from '@ebay/nice-modal-react';
import { useTheme } from '@mui/material';

import { ActivityType } from '@/enums/Activity';
import { TypeModule, TypeProcess } from '@/enums/Module';
import useRecordLog from '@/hooks/useRecordLog';

import { useBreadcrumbs } from '@/components/layouts/MasterParameterLayout/components/Breadcrumbs/Breadcrumbs.context';
import BaseContainer from '@/components/shared/BaseContainer';
import Button from '@/components/shared/Button';
import ColumnWrapper from '@/components/shared/ColumnWrapper';
import Input from '@/components/shared/Input';
import RowWrapper from '@/components/shared/RowWrapper';
import Table from '@/components/shared/Table';
import Title from '@/components/shared/Title';

import ApprovalStatusModal from './components/ApprovalStatusModal';
import { MODAL } from './List.constant';
import useList from './List.hook';


const ListPage = () => {
  const theme = useTheme();
  const { recordActivity } = useRecordLog();
  const { push, reset } = useBreadcrumbs();

  React.useEffect(() => {
    reset();
    push({ href: '/master-parameter/parameter-sla', label: 'Parameter SLA' });
  }, [push, reset]);

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
    backgroundColor: !rowData.isEditable ? '#FFF5E4' : 'inherit',
  });

  React.useEffect(() => {
    recordActivity({
      activity: ActivityType.VIEW,
      bucketProcessId: '',
      changeAfter: '',
      changeBefore: '',
      menuCode: 'parameter-sla',
      module: TypeModule.PARAMETER_SLA,
      process: TypeProcess.PARAMETER_SLA,
      remarks: 'Opened Parameter SLA List Page',
    });
  }, []);

  return (
    <>
      <Title title="Maintenance Parameter SLA" />
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
            withConditional={true}
          />
        </BaseContainer>
      </ColumnWrapper>

      <ModalDef
        id={MODAL.APPROVAL_STATUS_MODAL}
        component={ApprovalStatusModal}
      />
    </>
  );
};

export default ListPage;
