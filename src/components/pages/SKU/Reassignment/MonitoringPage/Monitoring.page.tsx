'use client';
import { ModalDef } from '@ebay/nice-modal-react';
import { Box, useTheme } from '@mui/material';

import { MODAL } from '@/configs/constants/modalId';
import { accessid } from '@/configs/constants/pathname';
import useCheckAccess from '@/hooks/useCheckAccess';

import BaseContainer from '@/components/shared/BaseContainer';
import Button from '@/components/shared/Button';
import ColumnWrapper from '@/components/shared/ColumnWrapper';
import Input from '@/components/shared/Input';
import RowWrapper from '@/components/shared/RowWrapper';
import Table from '@/components/shared/Table';
import Title from '@/components/shared/Title';

import ApprovalList from '../ApprovalList';
import ConfirmationInfo from '../Request/components/ConfirmationInfo';

import { useMonitoring } from './Monitoring.hook';


const Monitoring = () => {
  const theme = useTheme();
  const canAddNew = useCheckAccess(accessid.REASSIGNMENT_SKU_CREATE);
  const {
    filter,
    monitoringList,
    monitoringPage,
    isLoading,
    setFilter,
    page,
    setPage,
    setItemPerPage,
    filterContentList,
    filterDropdownList,
    tableHeaderMonitoring,
    handleAddNew,
    handleShowApprovalList,
  } = useMonitoring();

  return (
    <>
      <Title title="Re-Assignment / SKU List" />
      <ColumnWrapper gap={theme.spacing(1)} marginBottom={theme.spacing(5)}>
        <ConfirmationInfo />
        <RowWrapper
          sx={{
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
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
          <Box sx={{ display: 'flex', gap: theme.spacing(2) }}>
            {canAddNew &&
              <Button
                color="success"
                startIcon="add"
                onClick={handleAddNew}
              >
                Add New
              </Button>
            }
            <Button
              onClick={handleShowApprovalList}
            >
              Approval List
            </Button>
          </Box>
        </RowWrapper>
        <BaseContainer sx={{ boxShadow: 7 }}>
          <Table
            isLoading={isLoading}
            tableHeader={tableHeaderMonitoring}
            tableData={monitoringList}
            totalPage={monitoringPage?.totalPage ?? 1}
            currentPage={page}
            handlePageChange={setPage}
            onPageSizeChange={setItemPerPage}
          />
        </BaseContainer>
      </ColumnWrapper>

      <ModalDef
        id={MODAL.APPROVAL_LIST_SKU}
        component={ApprovalList}
      />
    </>
  );
};

export default Monitoring;
