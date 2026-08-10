'use client';
import { ModalDef } from '@ebay/nice-modal-react';
import { Box, useTheme } from '@mui/material';

import { accessid } from '@/configs/constants/pathname';
import useCheckAccess from '@/hooks/useCheckAccess';

import { useUserManagementContext } from '@/components/layouts/UserManagement/UserManagement.context';
import BaseContainer from '@/components/shared/BaseContainer';
import Button from '@/components/shared/Button';
import ColumnWrapper from '@/components/shared/ColumnWrapper';
import Input from '@/components/shared/Input';
import RowWrapper from '@/components/shared/RowWrapper';
import Table from '@/components/shared/Table';
import Title from '@/components/shared/Title';

import ApprovalModal from './components/ModalApproval';
import { modal } from './List.constants';
import { useList } from './List.hook';


const ListPage = () => {
  const { isStaff } = useUserManagementContext();
  const theme = useTheme();
  const canAddUser = useCheckAccess(accessid.USER_LIST_CREATE);

  const {
    filter,
    filterContentList,
    filterDropdownList,
    handleApprovalModal,
    isLoading,
    noPage,
    setFilter,
    setItemPerPage,
    anomalyRowStyle,
    setNoPage,
    tableData,
    tableHeader,
    tablePage,
    handleAddUser,
  } = useList();

  return (
    <>
      <Title title="User List" />
      <ColumnWrapper gap={theme.spacing(1)} mb={theme.spacing(8)}>
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
              contentList={filterContentList}
              dropdownList={filterDropdownList}
            />
          </Box>
          <Box sx={{ display: 'flex', gap: 4 }}>
            {canAddUser && (
              <Button
                startIcon="add"
                startIconSx={{ 'path': { 'stroke': '#ffffff', 'stroke-width': 2.5 } }}
                sx={{ background: '#23936E' }}
                onClick={handleAddUser}
              >
                Add User
              </Button>
            )}
            <Button onClick={handleApprovalModal}>Approval Status</Button>
          </Box>
        </RowWrapper>
        <BaseContainer sx={{ boxShadow: 7 }}>
          <Table
            isLoading={isLoading}
            tableHeader={tableHeader}
            tableData={tableData}
            currentPage={noPage}
            totalPage={tablePage?.totalPage ?? 1}
            handlePageChange={setNoPage}
            onPageSizeChange={setItemPerPage}
            anomalyRow={anomalyRowStyle}
          />
        </BaseContainer>
      </ColumnWrapper>

      <ModalDef
        id={modal.APPROVAL_MODAL}
        component={ApprovalModal}
      />
    </>
  );
};

export default ListPage;
