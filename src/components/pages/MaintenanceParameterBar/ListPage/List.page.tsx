'use client';

import * as React from 'react';

import { ModalDef } from '@ebay/nice-modal-react';
import { useTheme } from '@mui/material';

import { ActivityType } from '@/enums/Activity';
import useRecordLog from '@/hooks/useRecordLog';

import {
  MaintenanceParameterBarContext,
} from '@/components/layouts/MaintenanceParameterBarLayout/MaintenanceParameterBar.context';
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

import { useList } from './List.hook';


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
  const { setState, state } = React.useContext(MaintenanceParameterBarContext);
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

  React.useEffect(() => {
    setState((prev) => ({
      ...prev,
      breadCrumb: [
        { label: 'Home', url: '/' },
        { label: 'Mapping Business Call & Business Call Summary', url: '/master-parameter/parameter-bar' },
      ],
    }));
  }, [setState]);

  React.useEffect(() => {
    reset();
    push({ href: '/master-parameter/parameter-mapping-bar', label: 'Mapping Business Call & Business Call Summary' });
    push({ label: 'List' });
  }, [push, reset]);

  const anomalyRowStyle = (rowData: any) => ({
    backgroundColor: !rowData?.isEditable ? '#FFF5E4' : 'inherit',
  });

  React.useEffect(() => {
    recordActivity({
      activity: ActivityType.VIEW,
      bucketProcessId: '',
      changeAfter: '',
      changeBefore: '',
      menuCode: 'parameter-bar',
      module: 'parameter-bar',
      process: 'list',
      remarks: 'View Parameter Mapping Bar List Page',
    });
  }, [recordActivity]);

  return (
    <>
      <Title title="Mapping Business Call & Business Call Summary" />
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
        id="APPROVAL_STATUS_MODAL_PARAMETER_BAR"
        component={ApprovalStatusModal}
      />
    </>
  );
};

export default ListPage;
