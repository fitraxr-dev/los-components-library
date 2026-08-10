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

import { useList } from './AssignmentList.hook';


const AssignmentListPage = () => {
  const theme = useTheme();
  const { anomalyRowStyle } = useGetRowDataColors();
  const {
    filter,
    filterDropdownList,
    filterContentList,
    tableHeader,
    noPage,
    setNoPage,
    setItemPerPage,
    tablePage,
    tableData,
    isLoading,
    setFilter,
    handleOpenAssignModal,
    selected,
  } = useList();

  return (
    <>
      <Title title="Assignment Verifikasi Assesment APU PPT/Pengkinian Data" />
      <ColumnWrapper gap={theme.spacing(1)}>
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
            tableData={tableData}
            totalPage={tablePage?.totalPage ?? 1}
            currentPage={noPage}
            handlePageChange={setNoPage}
            onPageSizeChange={setItemPerPage}
            anomalyRow={anomalyRowStyle}
          />
        </BaseContainer>
      </ColumnWrapper>

      {
        selected?.length > 0 &&
        <RowWrapper sx={{ justifyContent: 'end', py: 3 }}>
          <Button onClick={handleOpenAssignModal}>Assign To</Button>
        </RowWrapper>
      }

      <ModalDef
        id={MODAL.ASSIGN_TO}
        component={ModalAssign}
      />
    </>
  );
};

export default AssignmentListPage;
