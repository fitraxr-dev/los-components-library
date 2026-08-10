'use client';

import React from 'react';

import { useTheme } from '@mui/material';
import Link from 'next/link';

import BaseContainer from '@/components/shared/BaseContainer';
import Button from '@/components/shared/Button';
import ColumnWrapper from '@/components/shared/ColumnWrapper';
import Input from '@/components/shared/Input';
import RowWrapper from '@/components/shared/RowWrapper';
import Table from '@/components/shared/Table';
import Title from '@/components/shared/Title';

import useBucketListPage from './BucketList.hook';


const BucketListPage = () => {
  const theme = useTheme();

  const {
    filter,
    noPage,
    setFilter,
    setItemPerPage,
    setNoPage,
    filterContentList,
    searchByDropdownlist,
    tableHeader,
    tableData,
    tablePage,
    detailPagePath,
    isLoading,
    isNoSelected,
  } = useBucketListPage();

  return (
    <>
      <Title title="Pilih Customer untuk Simulasi BMPP" sx={{ marginX: 'auto' }} />
      <ColumnWrapper gap={theme.spacing(1)}>
        <Input
          type="search"
          value={filter}
          onChange={setFilter}
          placeholder="Pencarian"
          dropdownList={searchByDropdownlist}
          contentList={filterContentList}
          fullWidth
        />
        <BaseContainer sx={{ boxShadow: 7 }}>
          <Table
            isLoading={isLoading}
            tableHeader={tableHeader}
            tableData={tableData}
            totalPage={tablePage?.totalPage ?? 1}
            currentPage={noPage}
            handlePageChange={setNoPage}
            onPageSizeChange={setItemPerPage}
          />
        </BaseContainer>
        <RowWrapper justifyContent="end" mt={1}>
          <Link href={detailPagePath}>
            <Button disabled={isNoSelected}>
              Pilih Customer
            </Button>
          </Link>
        </RowWrapper>
      </ColumnWrapper>
    </>
  );
};

export default BucketListPage;
