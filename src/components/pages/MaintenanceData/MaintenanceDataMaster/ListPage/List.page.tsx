'use client';
import { ModalDef } from '@ebay/nice-modal-react';
import { Box } from '@mui/material';

import Button from '@/components/shared/Button';
import Search from '@/components/shared/Input/components/Search';
import RowWrapper from '@/components/shared/RowWrapper';
import Table from '@/components/shared/Table';
import Title from '@/components/shared/Title';

import ApprovalMasterModal from '../components/ApprovalMasterModal';

import { modal } from './List.constants';
import { useList } from './List.hook';


const ListPage = () => {

  const {
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
  } = useList();

  return (
    <>
      <Title title="Master Data LOS" />
      <RowWrapper
        sx={{
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <Box width="45vw">
          <Search
            isDebounced
            hasFilter
            onChange={setFilter}
            placeholder="Pencarian..."
            dropdownList={filterDropdownList}
            contentList={filterContentList}
          />
        </Box>
        <Button onClick={handleApprovalModal}>Approval List</Button>
      </RowWrapper>

      <Table
        isLoading={isLoading}
        maxHeight="42vh"
        tableHeader={tableHeader}
        tableData={data?.contents}
        totalPage={data?.page?.totalPage ?? 1}
        currentPage={page}
        handlePageChange={setPage}
        onPageSizeChange={setPageSize}
      />
      <ModalDef
        id={modal.APPROVAL_MASTER_MODAL}
        component={ApprovalMasterModal}
      />
    </>
  );
};

export default ListPage;
