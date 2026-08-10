'use client';
import { ModalDef } from '@ebay/nice-modal-react';
import { Box, useTheme } from '@mui/material';

import { accessid } from '@/configs/constants/pathname';
import { formatDateTime, toYearStringNumber } from '@/helpers/date';
import useCheckAccess from '@/hooks/useCheckAccess';

import BaseContainer from '@/components/shared/BaseContainer';
import Button from '@/components/shared/Button';
import ColumnWrapper from '@/components/shared/ColumnWrapper';
import Input from '@/components/shared/Input';
import RowWrapper from '@/components/shared/RowWrapper';
import Table from '@/components/shared/Table';
import Title from '@/components/shared/Title';

import ApprovalStatusModal from '../components/ApprovalStatusModal';
import CreateNewGroupModal from '../components/CreateNewGroup';

import { modal } from './MaintenanceGroup.constants';
import { useMaintenanceGroup } from './MaintenanceGroup.hooks';

import type { SearchValue } from '@/components/shared/Input/components/Search/Search.types';


const ListPage = () => {
  const theme = useTheme();
  const {
    data,
    filter,
    page,
    setPage,
    isLoading,
    setFilter,
    setPageSize,
    filterDropdownList,
    filterContentList,
    handleApprovalStatusModal,
    handleCreateNewGroupModal,
    tableHeader,
    isRM,
  } = useMaintenanceGroup();

  const canCreateNewGroup = useCheckAccess(accessid.MAINTENANCE_GROUP_CREATE);

  // array data manipulation
  const dataTable = data?.data?.contents.map((item: any) => ({
    ...item,
    id: item.groupCode ?? '-',
    isRelatedSmi: item.isRelatedSmi === true ? 'Ya' : 'Tidak',
    isTransaction: item.isTransaction ?? false,
    lastModified: item?.lastModified ? formatDateTime(item?.lastModified) : '-',
    modifiedBy: item?.modifiedBy ?? '-',
    name: item.groupName ?? '-',
    sector: item.sector ?? '-',
    yearFounded: item?.yearFounded ? toYearStringNumber(item?.yearFounded) : '-',
  }));

  return (
    <>
      <Title title="Maintenance Data Group" />
      <ColumnWrapper gap={theme.spacing(1)} mb={theme.spacing(8)}>
        <RowWrapper sx={{ alignItems: 'center', justifyContent: 'space-between' }}>
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
          <RowWrapper sx={{ gap: 2 }}>
            {canCreateNewGroup &&
              <Button onClick={handleCreateNewGroupModal}>Add New Group</Button>
            }
            <Button onClick={handleApprovalStatusModal}>Approval Status</Button>
          </RowWrapper>
        </RowWrapper>
        <BaseContainer sx={{ boxShadow: 7 }}>
          <Table
            tableHeader={tableHeader}
            isLoading={isLoading}
            tableData={dataTable}
            totalPage={data?.data?.page?.totalPage}
            currentPage={page}
            handlePageChange={setPage}
            onPageSizeChange={setPageSize}
            anomalyRow={(data) => ({
              bgcolor: data.isTransaction ? '#fff3cd' : 'none',
            })}
          />
        </BaseContainer>
      </ColumnWrapper>
      <ModalDef
        id={modal.APPROVAL_STATUS_MODAL}
        component={ApprovalStatusModal}
      />

      <ModalDef
        id={modal.CREATE_NEW_GROUP}
        component={CreateNewGroupModal}
      />
    </>
  );
};

export default ListPage;
