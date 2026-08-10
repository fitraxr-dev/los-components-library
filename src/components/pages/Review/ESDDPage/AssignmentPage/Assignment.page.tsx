'use client';
import { ModalDef } from '@ebay/nice-modal-react';
import { Box, useTheme } from '@mui/material';

import { MODAL } from '@/configs/constants/modalId';

import BaseContainer from '@/components/shared/BaseContainer';
import Button from '@/components/shared/Button';
import ColumnWrapper from '@/components/shared/ColumnWrapper';
import Input from '@/components/shared/Input';
import RowWrapper from '@/components/shared/RowWrapper';
import ModalAssign from '@/components/shared/SmiModal/ModalAssign';
import Table from '@/components/shared/Table';
import Title from '@/components/shared/Title';

import { useAssignment } from './Assignment.hook';


const AssignmentPage = () => {
  const theme = useTheme();

  const {
    filter,
    isLoading,
    setFilter,
    page,
    setPage,
    setPageSize,
    filterContentList,
    filterDropdownList,
    tableHeader,
    handleClickAssign,
    selectedTask,
    processPage,
    processList,
    canUpdateESDDAssignment,
  } = useAssignment();


  return (
    <>
      <Title title="Assignment Environmental & Social Due Diligence" />
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
            isLoading={isLoading}
            tableHeader={tableHeader}
            tableData={processList}
            totalPage={processPage?.totalPage ?? 1}
            currentPage={page}
            handlePageChange={setPage}
            onPageSizeChange={setPageSize}
          />
        </BaseContainer>
      </ColumnWrapper>
      {
        selectedTask.length > 0 &&
        <RowWrapper justifyContent="end">
          <Button
            disabled={!canUpdateESDDAssignment}
            onClick={handleClickAssign}
          >
            Assign To
          </Button>
        </RowWrapper>
      }

      <ModalDef
        id={MODAL.ASSIGN_TO}
        component={ModalAssign}
        defaultProps={{
          isRiviewAssign: true,
        }}
      />
    </>
  );
};


export default AssignmentPage;
