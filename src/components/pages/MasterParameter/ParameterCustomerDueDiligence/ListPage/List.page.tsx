'use client';
import * as React from 'react';

import { ModalDef } from '@ebay/nice-modal-react';
import { useTheme } from '@mui/material';

import { accessid, MASTER_PARAMETER } from '@/configs/constants/pathname';
import useCheckAccess from '@/hooks/useCheckAccess';
import useCustomRouter from '@/hooks/useCustomRouter';

import { useBreadcrumbs } from '@/components/layouts/MasterParameterLayout/components/Breadcrumbs/Breadcrumbs.context';
import useMasterParameter from '@/components/layouts/MasterParameterLayout/MasterParameter.hook';
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
  const router = useCustomRouter();
  const theme = useTheme();

  const { isMaker } = useMasterParameter();
  const { push, reset } = useBreadcrumbs();

  const canAddNew = useCheckAccess(accessid.PARAMETER_CUSTOMER_DUE_DILIGENCE_CREATE);

  React.useEffect(() => {
    reset();
    push({ href: '/master-parameter/parameter-cdd', label: 'Parameter Customer Due Diligence' });
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

  const handleAddItemGroup = () => {
    const nextPath = MASTER_PARAMETER.PARAMETER_CUSTOMER_DUE_DILIGENCE_CREATE_PAGE;
    router.push(nextPath);
  };

  const anomalyRowStyle = (rowData: any) => ({
    backgroundColor: !rowData.isEditable ? '#FFF5E4' : 'inherit',
  });

  return (
    <>
      <Title title="Maintenance Parameter Customer Due Diligence" />
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
          <RowWrapper gap={theme.spacing(1)}>
            <Button
              onClick={handleOpenApprovalStatusModal}
              variant="contained"
            >
              Approval Status
            </Button>
            {canAddNew && (
              <Button
                onClick={handleAddItemGroup}
                variant="contained"
              >
                Add New Group
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
        id={MODAL.APPROVAL_STATUS_MODAL}
        component={ApprovalStatusModal}
      />
    </>
  );
};

export default ListPage;
