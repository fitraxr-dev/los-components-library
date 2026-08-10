'use client';
import { ModalDef } from '@ebay/nice-modal-react';
import { Box, useTheme } from '@mui/material';

import { MODAL } from '@/configs/constants/modalId';

import BaseContainer from '@/components/shared/BaseContainer';
import Button from '@/components/shared/Button';
import ColumnWrapper from '@/components/shared/ColumnWrapper';
import Input from '@/components/shared/Input';
import RowWrapper from '@/components/shared/RowWrapper';
import ModalReassign from '@/components/shared/SmiModal/ModalReassign';
import Table from '@/components/shared/Table';
import Title from '@/components/shared/Title';

import { useList } from './List.hook';


const ListPage = () => {
  const theme = useTheme();
  const {
    tableData,
    tablePage,
    filter,
    isLoading,
    setFilter,
    page,
    setPage,
    pageSize,
    setPageSize,
    filterContentList,
    filterDropdownList,
    tableHeader,
    selectedTask,
    handleClickReassignTo,
  } = useList();

  return (
    <>
      <Title title="Process Monitoring" />
      <ColumnWrapper gap={theme.spacing(1)}>
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
        </RowWrapper>
        <BaseContainer sx={{ boxShadow: 7 }}>
          <Table
            isLoading={isLoading}
            pageSize={pageSize}
            tableHeader={tableHeader}
            tableData={tableData}
            totalPage={tablePage?.totalPage ?? 1}
            currentPage={page}
            handlePageChange={setPage}
            onPageSizeChange={setPageSize}
          />
        </BaseContainer>
      </ColumnWrapper>

      {
        selectedTask.length > 0 && (
          <RowWrapper justifyContent="end" mt={2}>
            <Button
              onClick={handleClickReassignTo}
            >
              Re-assign to
            </Button>
          </RowWrapper>
        )
      }

      <ModalDef
        id={MODAL.REASSIGN_TO}
        component={ModalReassign}
        defaultProps={{
          isMonitoring: true,
          isRiviewAssign: true,
        }}
      />
    </>
  );
};

export default ListPage;
