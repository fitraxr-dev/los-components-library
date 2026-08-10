'use client';

import NiceModal, { ModalDef } from '@ebay/nice-modal-react';
import { Box } from '@mui/material';

import { MODAL } from '@/configs/constants/modalId';
import { accessid } from '@/configs/constants/pathname';
import useCheckAccess from '@/hooks/useCheckAccess';

import Button from '@/components/shared/Button';
import Input from '@/components/shared/Input';
import Search from '@/components/shared/Input/components/Search';
import RowWrapper from '@/components/shared/RowWrapper';
import ModalUploadTemplate from '@/components/shared/SmiModal/ModalUploadTemplate';
import Table from '@/components/shared/Table';
import Title from '@/components/shared/Title';

import { LIST_DATA } from '../__mocks__/mockData';

import ModalApproval from './components/ModalApproval';
import ModalDebtor from './components/ModalDebtor';
import { modal } from './List.constants';
import useList from './List.hook';


const ListPage = () => {

  const canAddVa = useCheckAccess(accessid.VIRTUAL_ACCOUNT_CREATE);


  const {
    setFilter,
    filter,
    noPage,
    setNoPage,
    setItemPerPage,
    filterContentList,
    filterDropdownList,
    tableHeader,
    tableData,
    tablePage,
    isLoading,
    isStaff,
    isStaffDkhi,
    isSuperAdmin,
    isMaker,
    isTL,
    isTaskForce,
    isChecker,
  } = useList();
  return (
    <>
      <Title title="Bucket VA" />
      <RowWrapper
        sx={{
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
        gap={2}
      >
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
        <RowWrapper gap={2}>
          <Button
            onClick={() => NiceModal.show(MODAL.MODAL_UPLOAD_TEMPLATE, {
              processTemplateType: 'VA_CREATION',
              queryKeyList: ['va-list'],
            })}
            startIcon="upload"
          >
            Upload Dokumen
          </Button>
          {(!isStaffDkhi) || isMaker || isTL || isChecker ? (
            <Button onClick={() => NiceModal.show(modal.APPROVAL)}>Approval Status</Button>) : <></>}
          {canAddVa && (isStaff || isMaker || isTaskForce) ? (<Button startIcon="add" onClick={() => NiceModal.show(modal.DEBTOR)}>Create New</Button>
          ) : <></>}
        </RowWrapper>
      </RowWrapper>

      <Table
        tableHeader={tableHeader}
        tableData={tableData}
        totalPage={tablePage?.totalPage ?? 1}
        currentPage={noPage}
        handlePageChange={setNoPage}
        onPageSizeChange={setItemPerPage}
        isLoading={isLoading}
      />
      <ModalDef
        id={modal.DEBTOR}
        component={ModalDebtor}
      />

      <ModalDef
        id={MODAL.MODAL_UPLOAD_TEMPLATE}
        component={ModalUploadTemplate}
      />

      <ModalDef
        id={modal.APPROVAL}
        component={ModalApproval}
      />
    </>
  );
};

export default ListPage;
