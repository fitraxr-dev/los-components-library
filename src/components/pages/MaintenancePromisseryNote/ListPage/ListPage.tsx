'use client';
import React from 'react';

import { ModalDef } from '@ebay/nice-modal-react';
import { Box } from '@mui/material';

import { accessid } from '@/configs/constants/pathname';
import useCheckAccess from '@/hooks/useCheckAccess';

import BaseContainer from '@/components/shared/BaseContainer';
import Button from '@/components/shared/Button';
import ColumnWrapper from '@/components/shared/ColumnWrapper';
import Search from '@/components/shared/Input/components/Search';
import RowWrapper from '@/components/shared/RowWrapper';
import Table from '@/components/shared/Table';
import Title from '@/components/shared/Title';

import ModalDebtor from '../components/ModalDebtor';

import useListPage from './ListPage.hook';


const ListPage = () => {
  const { filter,
    filterContentList,
    filterDropdownList,
    isLoading,
    page,
    data,
    processPage,
    setFilter,
    setPage,
    setPageSize,
    tableHeader,
    theme,
    showModal,
  } = useListPage();

  const canAdd = useCheckAccess(accessid.SURAT_HUTANG_CREATE);

  return (
    <>
      <Title title="Maintenance Surat Hutang List" />
      <ColumnWrapper gap={theme.spacing(1)} mb={theme.spacing(8)}>
        <RowWrapper
          sx={{
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <Box width="45vw">
            <Search
              value={filter}
              hasFilter
              onChange={setFilter}
              placeholder="Pencarian..."
              dropdownList={filterDropdownList}
              contentList={filterContentList}
            />
          </Box>

          {
            canAdd &&
            <Button variant="contained" color="primary" onClick={showModal}>
              Add Surat Hutang
            </Button>
          }
        </RowWrapper>

        <BaseContainer sx={{ boxShadow: 7 }}>
          <Table
            maxHeight="42vh"
            tableHeader={tableHeader}
            tableData={data?.contents}
            totalPage={processPage?.totalPage ?? 1}
            currentPage={page}
            isLoading={isLoading}
            handlePageChange={setPage}
            onPageSizeChange={setPageSize}
          />
        </BaseContainer>

        <ModalDef
          id="surat-hutang-debtor"
          component={ModalDebtor}
        />
      </ColumnWrapper>
    </>
  );
};

export default ListPage;
