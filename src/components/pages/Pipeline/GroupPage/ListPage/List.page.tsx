'use client';
import React from 'react';

import { ModalDef } from '@ebay/nice-modal-react';
import Link from 'next/link';

import { MODAL } from '@/configs/constants/modalId';

import Button from '@/components/shared/Button';
import ColumnWrapper from '@/components/shared/ColumnWrapper';
import Input from '@/components/shared/Input';
import RowWrapper from '@/components/shared/RowWrapper';
import Table from '@/components/shared/Table';
import TextStyle from '@/components/shared/TextStyle';

import ModalExistingGroup from './Component/ModalExistingGroup';
import { useListPage } from './List.hook';


const ListPage = () => {
  const {
    isLoadingDebtorGroup,
    searchDropdownList,
    filterContentList,
    debtorGroupList,
    debtorGroupPage,
    tableHeader,
    handleCreateNewGroup,
    viewOnly,
    noPage,
    theme,
    filter,
    setFilter,
    setNoPage,
    setItemPerPage,
  } = useListPage();

  return (
    <ColumnWrapper>
      <RowWrapper
        sx={{
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <TextStyle
          variant="title1"
          color={theme.palette.primary.main}
          weight={700}
        >
          Group Creation
        </TextStyle>
        {
          !viewOnly ? <Button onClick={handleCreateNewGroup}>Create New Group</Button> : null
        }
      </RowWrapper>
      <Input
        type="search"
        value={filter}
        onChange={setFilter}
        placeholder="Pencarian"
        dropdownList={searchDropdownList}
        contentList={filterContentList}
      />

      <Table
        tableHeader={tableHeader}
        tableData={debtorGroupList}
        totalPage={debtorGroupPage?.totalPage}
        currentPage={noPage}
        handlePageChange={setNoPage}
        onPageSizeChange={setItemPerPage}
        isLoading={isLoadingDebtorGroup}
      />
      <ModalDef
        id={MODAL.PIPELINE.GROUP.EXISTING_GROUP}
        component={ModalExistingGroup}
      />
    </ColumnWrapper>
  );
};
export default ListPage;
