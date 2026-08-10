'use client';

import * as React from 'react';

import NiceModal, { ModalDef } from '@ebay/nice-modal-react';
import { useTheme } from '@mui/material';
import { useRouter } from 'next/navigation';

import { accessid } from '@/configs/constants/pathname';
import { ActivityType } from '@/enums/Activity';
import useCheckAccess from '@/hooks/useCheckAccess';
import useRecordLog from '@/hooks/useRecordLog';

import { useBreadcrumbs } from '@/components/layouts/MasterParameterLayout/components/Breadcrumbs/Breadcrumbs.context';
import BaseContainer from '@/components/shared/BaseContainer';
import Button from '@/components/shared/Button';
import ColumnWrapper from '@/components/shared/ColumnWrapper';
import Input from '@/components/shared/Input';
import RowWrapper from '@/components/shared/RowWrapper';
import Table from '@/components/shared/Table';
import Title from '@/components/shared/Title';

import ApprovalStatusModal from '../components/ApprovalStatusModal';
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
  const router = useRouter();
  const { recordActivity } = useRecordLog();
  const { push, reset } = useBreadcrumbs();
  const canAddNew = useCheckAccess(accessid.VIRTUAL_ACCOUNT_CREATE);

  React.useEffect(() => {
    reset();
    push({ href: '/master-parameter/parameter-va', label: 'Parameter VA' });
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
    isMaker,
  } = useList();

  const handleAddNew = () => {
    // Clear any existing navigation context from sessionStorage
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem('maintenanceParameterVANavigation');
    }

    // Record add new activity
    recordActivity({
      activity: ActivityType.ADD,
      bucketProcessId: '',
      changeAfter: '',
      changeBefore: '',
      menuCode: 'parameter-va',
      module: 'parameter-va',
      process: '',
      remarks: 'Add new Parameter VA',
    });

    router.push('/master-parameter/parameter-va/create/process');
  };

  const anomalyRowStyle = (rowData: any) => ({
    backgroundColor: !rowData?.isEditable ? '#FFF5E4' : 'inherit',
  });

  return (
    <>
      <Title title="Parameter VA" />
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
          <RowWrapper sx={{ gap: 2 }}>
            <Button
              onClick={handleOpenApprovalStatusModal}
              variant="contained"
            >
              Approval Status
            </Button>
            {canAddNew && (
              <Button
                onClick={handleAddNew}
                variant="contained"
              >
                Add New
              </Button>
            )}
          </RowWrapper>
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
        id="APPROVAL_STATUS_MODAL_PARAMETER_VA"
        component={ApprovalStatusModal}
      />
    </>
  );
};

export default ListPage;
