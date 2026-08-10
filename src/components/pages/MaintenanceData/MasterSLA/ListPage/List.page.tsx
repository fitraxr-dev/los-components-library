'use client';
import { useEffect } from 'react';

import { ModalDef } from '@ebay/nice-modal-react';
import { Box } from '@mui/material';

import BaseContainer from '@/components/shared/BaseContainer';
import Button from '@/components/shared/Button';
import Search from '@/components/shared/Input/components/Search';
import RowWrapper from '@/components/shared/RowWrapper';
import Table from '@/components/shared/Table';
import Title from '@/components/shared/Title';

import ApprovalModal from './components/ApprovalModal';
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

  useEffect(() => {
    console.log('log data', data?.contents);
  }, [data?.contents]);

  return (
    <>
      <Title title="Maintenance Master SLA" />
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
        <Button onClick={handleApprovalModal}>  Approval List</Button>

      </RowWrapper>
      <div>
        <BaseContainer>
          <Table
            isLoading={isLoading}
            tableHeader={tableHeader}
            tableData={data?.contents}
            currentPage={page}
            totalPage={data?.page?.totalPage ?? 1}
            handlePageChange={setPage}
            onPageSizeChange={setPageSize}
          />
        </BaseContainer>
      </div>
      <ModalDef
        id={modal.APPROVAL_MODAL}
        component={ApprovalModal}
      />
    </>
  );
};

export default ListPage;
