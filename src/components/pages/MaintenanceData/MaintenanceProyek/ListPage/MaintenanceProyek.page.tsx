'use client';
import { ModalDef } from '@ebay/nice-modal-react';
import { Box, useTheme } from '@mui/material';

import { accessid } from '@/configs/constants/pathname';
import useCheckAccess from '@/hooks/useCheckAccess';

import BaseContainer from '@/components/shared/BaseContainer';
import Button from '@/components/shared/Button';
import ColumnWrapper from '@/components/shared/ColumnWrapper';
import Input from '@/components/shared/Input';
import RowWrapper from '@/components/shared/RowWrapper';
import Table from '@/components/shared/Table';
import Title from '@/components/shared/Title';

import ApprovalStatusModal from '../components/ApprovalStatusModal';

import { modal } from './MaintenanceProyek.constants';
import { useMaintenanceProyek } from './MaintenanceProyek.hooks';


const ListPage = () => {
  const theme = useTheme();
  const canAddProyek = useCheckAccess(accessid.MAINTENANCE_PROYEK_CREATE);
  const {
    anomalyRowStyle,
    data,
    page,
    setPage,
    isLoading,
    filter,
    setFilter,
    setPageSize,
    filterDropdownList,
    filterContentList,
    handleApprovalStatusModal,
    handleCreateNewProyekModal,
    tableHeader,
    isStaff,
  } = useMaintenanceProyek();
  console.log('filter', filter);
  return (
    <>
      <Title title="Maintenance Data Proyek" />
      <ColumnWrapper gap={theme.spacing(1)} mb={theme.spacing(8)}>
        <RowWrapper sx={{ alignItems: 'center', justifyContent: 'space-between' }}>
          <Box width="45vw">
            <Input
              type="search3"
              value={filter}
              onChange={setFilter}
              placeholder="Pencarian..."
              dropdownList={filterDropdownList}
              contentList={filterContentList}
            />
          </Box>
          <RowWrapper sx={{ gap: 2 }}>
            {canAddProyek &&
              <Button onClick={handleCreateNewProyekModal}>Add New Proyek</Button>
            }
            <Button onClick={handleApprovalStatusModal}>Approval Status</Button>
          </RowWrapper>
        </RowWrapper>
        <BaseContainer sx={{ boxShadow: 7 }}>
          <Table
            tableHeader={tableHeader}
            isLoading={isLoading}
            tableData={data?.data?.contents}
            totalPage={data?.data?.page?.totalPage}
            currentPage={page}
            handlePageChange={setPage}
            onPageSizeChange={setPageSize}
            anomalyRow={anomalyRowStyle}
          />
        </BaseContainer>
      </ColumnWrapper>
      <ModalDef
        id={modal.APPROVAL_STATUS_MODAL}
        component={ApprovalStatusModal}
      />
    </>
  );
};

export default ListPage;
