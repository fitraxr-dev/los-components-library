'use client';
import { ModalDef } from '@ebay/nice-modal-react';
import { Box, useTheme } from '@mui/material';

import { MODAL } from '@/configs/constants/modalId';

import useGetRowDataColors from '@/components/layouts/MUILayout/components/hooks/useGetRowDataColors';
import BaseContainer from '@/components/shared/BaseContainer';
import Button from '@/components/shared/Button';
import ColumnWrapper from '@/components/shared/ColumnWrapper';
import Input from '@/components/shared/Input';
import RowWrapper from '@/components/shared/RowWrapper';
import ModalAssign from '@/components/shared/SmiModal/ModalAssign';
import Table from '@/components/shared/Table';
import Title from '@/components/shared/Title';

import ConfirmationLatest from '../components/ConfirmationLatest/ConfirmationLatest';


import { useAssignment } from './Assignment.hook';


const AssignmentPage = () => {
  const theme = useTheme();
  const { anomalyRowStyle } = useGetRowDataColors();
  const {
    tableHeader,
    processList,
    processPage,
    page,
    filter,
    selectedTask,
    setPage,
    setPageSize,
    setFilter,
    filterDropdownList,
    filterContentList,
    handleClickAssign,
    isLoading,
  } = useAssignment();

  return (
    <>
      <ConfirmationLatest />
      <Title title="Assignment" />
      <ColumnWrapper gap={theme.spacing(3)} marginBottom={theme.spacing(5)}>
        <Box width="100%">
          <Input
            type="search"
            value={filter}
            onChange={setFilter}
            placeholder="Pencarian..."
            dropdownList={filterDropdownList}
            contentList={filterContentList}
          />
          <BaseContainer sx={{ boxShadow: 7 }}>
            <Table
              isLoading={isLoading}
              tableHeader={tableHeader}
              tableData={processList}
              totalPage={processPage?.totalPage ?? 1}
              currentPage={page}
              handlePageChange={setPage}
              onPageSizeChange={setPageSize}
              anomalyRow={anomalyRowStyle}
            />
          </BaseContainer>
        </Box>
        <RowWrapper sx={{ justifyContent: 'end' }}>
          <Button
            disabled={selectedTask.length === 0}
            onClick={handleClickAssign}
          >
            Assign To
          </Button>
        </RowWrapper>
      </ColumnWrapper>

      <ModalDef
        id={MODAL.ASSIGN_TO}
        component={ModalAssign}
      />
    </>
  );
};

export default AssignmentPage;
