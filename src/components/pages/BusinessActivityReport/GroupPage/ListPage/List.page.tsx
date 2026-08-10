'use client';
import React from 'react';

import NiceModal, { ModalDef } from '@ebay/nice-modal-react';
import Link from 'next/link';

import Button from '@/components/shared/Button';
import ColumnWrapper from '@/components/shared/ColumnWrapper';
import Input from '@/components/shared/Input';
import RowWrapper from '@/components/shared/RowWrapper';
import Table from '@/components/shared/Table';
import TextStyle from '@/components/shared/TextStyle';

import ModalExistingGroup from './components/ModalExistingGroup';
import { modal } from './List.constants';
import { useListPage } from './List.hook';


const ListPage = () => {
  const {
    isLoadingDebtorGroup,
    searchDropdownList,
    filterContentList,
    debtorGroupList,
    debtorGroupPage,
    tableHeader,
    debtorId,
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

        {/* <Link href={`${debtorId}/create-new-group`}>
          {
            !viewOnly ? <Button disabled={viewOnly}>Create New Group</Button> : null
          }
        </Link> */}
        {!viewOnly
          ? (
            <Button disabled={viewOnly} onClick={() => NiceModal.show(modal.NEW_GROUP)}>
              Create New Group
            </Button>
          ) : null
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
        id={modal.NEW_GROUP}
        component={ModalExistingGroup}
      />
    </ColumnWrapper>
  );
};
export default ListPage;
