'use client';
import { ModalDef } from '@ebay/nice-modal-react';
import { Box, useTheme } from '@mui/material';

import { userManagement, accessid } from '@/configs/constants/pathname';
import useCheckAccess from '@/hooks/useCheckAccess';

import { useUserManagementContext } from '@/components/layouts/UserManagement/UserManagement.context';
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
  const { isStaff, isMaker, isChecker } = useUserManagementContext();
  const theme = useTheme();
  const canAddAccessMenu = useCheckAccess(accessid.ACCESS_MENU_CREATE);
  const {
    filter,
    filterContentList,
    filterDropdownList,
    handleApprovalModal,
    isLoading,
    page,
    router,
    setFilter,
    setPage,
    setPageSize,
    anomalyRowStyle,
    tableData,
    tableHeader,
    tablePage,
  } = useList();

  return (
    <ColumnWrapper gap={theme.spacing(3)}>
      <Title title="Access Menu" />
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
              contentList={filterContentList}
            />
          </Box>
          <Box sx={{ display: 'flex', gap: 4 }}>
            {canAddAccessMenu && (
              <Button
                startIcon="add"
                color="success"
                onClick={() => router.push(userManagement.ACCESS_MENU.ADD)}
              >
                Add New
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
            currentPage={page}
            totalPage={tablePage?.totalPage ?? 1}
            handlePageChange={setPage}
            onPageSizeChange={setPageSize}
            anomalyRow={anomalyRowStyle}
          />
        </BaseContainer>
      </ColumnWrapper>
      <ModalDef
        id={modal.APPROVAL_MODAL}
        component={ApprovalModal}
      />
    </ColumnWrapper>
  );
};

export default ListPage;
