'use client';
import { ModalDef } from '@ebay/nice-modal-react';
import { Box, useTheme } from '@mui/material';

import { userManagement, accessid } from '@/configs/constants/pathname';
import useCheckAccess from '@/hooks/useCheckAccess';
import useCustomRouter from '@/hooks/useCustomRouter';

import BaseContainer from '@/components/shared/BaseContainer';
import Button from '@/components/shared/Button';
import ColumnWrapper from '@/components/shared/ColumnWrapper';
import Input from '@/components/shared/Input';
import RowWrapper from '@/components/shared/RowWrapper';
import Table from '@/components/shared/Table';
import Title from '@/components/shared/Title';

import ApprovalModal from './components/ApprovalModal';
import { modal } from './List.constants';
import { useList } from './List.hook';


const ListPage = () => {
  const theme = useTheme();
  const canAddUser = useCheckAccess(accessid.USER_LIST_CREATE);

  const {
    handleApprovalModal,
    isLoading,
    itemPerPage,
    noPage,
    setItemPerPage,
    filterDropdownList,
    setNoPage,
    tableHeader,
    userListData,
    setFilter,
    filter,
  } = useList();

  const router = useCustomRouter();

  const addUser = () => {
    router.push(
      userManagement.USER_LIST.ADD
    );
  };

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
              dropdownList={filterDropdownList}
            />
          </Box>
          <Box sx={{ display: 'flex', gap: 4 }}>

            {canAddUser && (
              <Button
                startIcon="add"
                startIconSx={{ 'path': { 'stroke': '#ffffff', 'stroke-width': 2.5 } }}
                sx={{ background: '#23936E' }}
                onClick={() => router.push(userManagement.USER_LIST.ADD)}
              >
                Add User
              </Button>
            )}
            <Button onClick={handleApprovalModal}>Approval List</Button>
          </Box>
        </RowWrapper>
        <BaseContainer sx={{ boxShadow: 7 }}>
          <Table
            isLoading={isLoading}
            maxHeight="42vh"
            tableHeader={tableHeader}
            tableData={userListData}
            currentPage={noPage}
            totalPage={itemPerPage}
            handlePageChange={(val) => setNoPage(val)}
            onPageSizeChange={setItemPerPage}
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
