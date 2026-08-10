'use client';
import { ModalDef } from '@ebay/nice-modal-react';
import { Box, useTheme } from '@mui/material';


import BaseContainer from '@/components/shared/BaseContainer';
import Button from '@/components/shared/Button';
import ColumnWrapper from '@/components/shared/ColumnWrapper';
import Input from '@/components/shared/Input';
import RowWrapper from '@/components/shared/RowWrapper';
import Table from '@/components/shared/Table';
import Title from '@/components/shared/Title';

import ApprovalModal from '../components/ApprovalModal';

import { mockNewTable, modal } from './List.constants';
import { useList } from './List.hook';


const ListPage = () => {
  const theme = useTheme();
  const {
    filter,
    handleApprovalModal,
    filterDropdownList,
    filterContentList,
    tableHeader,
    isLoading,
    page,
    data,
    setPage,
    setFilter,
    setPageSize,
    isBusinessDivision,
    tableData,
    anomalyRowStyle,
  } = useList();

  return (
    <>
      <Title title="Maintenance Data Customer List" />
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
              hasFilter
              onChange={setFilter}
              placeholder="Pencarian..."
              dropdownList={filterDropdownList}
              contentList={filterContentList}
            />
          </Box>
          {isBusinessDivision &&
            <Button onClick={handleApprovalModal}>Approval Status</Button>}
        </RowWrapper>
        <BaseContainer sx={{ boxShadow: 7 }}>
          <Table
            isLoading={isLoading}
            maxHeight="42vh"
            tableHeader={tableHeader}
            tableData={tableData}
            totalPage={data?.page?.totalPage ?? 1}
            currentPage={page}
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
    </>
  );
};

export default ListPage;
