'use client';

import BaseContainer from '@/components/shared/BaseContainer';
import Search from '@/components/shared/Input/components/Search';
import SectionTitle from '@/components/shared/SectionTitle';
import Table from '@/components/shared/Table';

import { useTableDigitalMemo } from './TableDigitalMemo.hook';

import type { TableDigitalMemoProps } from './TableDigitalMemo.types';


const TableDigitalMemo = ({ searchFilter, onSearchChange, ...props }: TableDigitalMemoProps) => {
  const {
    digitalMemoList,
    digitalMemoPage,
    digitalMemoLoading,
    noPage,
    setNoPage,
    setItemPerPage,
    filter,
    setFilter,
    filterContentList,
    filterDropdownList,
    tableHeader,
  } = useTableDigitalMemo(props);

  return (
    <>
      <SectionTitle title="Digital Memo" isOpen>
        <Search
          value={searchFilter !== undefined ? searchFilter : filter}
          isDebounced
          hasFilter
          onChange={onSearchChange || setFilter}
          placeholder="Pencarian..."
          dropdownList={filterDropdownList}
          contentList={filterContentList}
        />
        <BaseContainer sx={{ boxShadow: 7 }}>
          <Table
            tableHeader={tableHeader}
            tableData={digitalMemoList}
            isLoading={digitalMemoLoading}
            currentPage={noPage}
            totalPage={digitalMemoPage?.totalPage}
            handlePageChange={setNoPage}
            onPageSizeChange={setItemPerPage}
          />
        </BaseContainer>
      </SectionTitle>
    </>
  );
};

export default TableDigitalMemo;
