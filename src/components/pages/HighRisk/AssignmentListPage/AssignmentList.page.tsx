'use client';
import { ModalDef } from '@ebay/nice-modal-react';
import { Box, useTheme } from '@mui/material';

import useGetRowDataColors from '@/components/layouts/MUILayout/components/hooks/useGetRowDataColors';
import BaseContainer from '@/components/shared/BaseContainer';
import Button from '@/components/shared/Button';
import ColumnWrapper from '@/components/shared/ColumnWrapper';
import Input from '@/components/shared/Input';
import RowWrapper from '@/components/shared/RowWrapper';
import ModalAssign from '@/components/shared/SmiModal/ModalAssign';
import Table from '@/components/shared/Table';
import Title from '@/components/shared/Title';

import { ASSIGNMENT } from './AssignmentList.contant';
import { useAssignmentList } from './AssignmentList.hook';


const ListPage = () => {
  const theme = useTheme();
  const { anomalyRowStyle } = useGetRowDataColors();
  const {
    filterDropdownList,
    filterContentList,
    tableHeader,
    itemPerPage,
    isLoading,
    setItemPerPage,
    page,
    setPage,
    setFilter,
    handleOpenAssignModal,
    tableData,
    selectedTask,
    totalPage,
    filter,
  } = useAssignmentList();

  return (
    <>
      <Title title="Assignment High Risk Assesment" />
      <ColumnWrapper gap={theme.spacing(1)} marginBottom={theme.spacing(5)}>
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
        <BaseContainer sx={{ boxShadow: 7 }}>
          <Table
            tableHeader={tableHeader}
            tableData={tableData}
            totalPage={totalPage ?? 1}
            currentPage={page}
            handlePageChange={setPage}
            pageSize={itemPerPage}
            onPageSizeChange={setItemPerPage}
            isLoading={isLoading}
            anomalyRow={anomalyRowStyle}
          />
        </BaseContainer>
      </ColumnWrapper>
      {
        selectedTask.length > 0 && (
          <RowWrapper justifyContent="end" py={3}>
            <Button
              disabled={selectedTask.length === 0}
              onClick={handleOpenAssignModal}
            >
              Assign To
            </Button>
          </RowWrapper>
        )
      }
      <ModalDef
        id={ASSIGNMENT.ASSIGN_TO}
        component={ModalAssign}
      />

    </>
  );
};

export default ListPage;
