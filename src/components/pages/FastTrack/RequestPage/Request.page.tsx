'use client';
import NiceModal, { ModalDef } from '@ebay/nice-modal-react';
import { Box } from '@mui/material';

import { accessid } from '@/configs/constants/pathname';
import useApp from '@/hooks/useApp';
import useCheckAccess from '@/hooks/useCheckAccess';

import useGetRowDataColors from '@/components/layouts/MUILayout/components/hooks/useGetRowDataColors';
import Button from '@/components/shared/Button';
import Input from '@/components/shared/Input';
import RowWrapper from '@/components/shared/RowWrapper';
import Table from '@/components/shared/Table';
import Title from '@/components/shared/Title';

import ModalDebtor from './components/ModalDebtor';
import ModalTableDk from './components/ModalTableDk/ModalTableDk';
import { modal } from './Request.constants';
import useRequest from './Request.hook';


const RequestPage = () => {
  const [{ currentRole }] = useApp();
  const { anomalyRowStyle } = useGetRowDataColors();
  const canAddNew = useCheckAccess(accessid.REQUEST_CREDIT_CHECKING_CREATE);
  const {
    bucketListContents,
    bucketListPage,
    isLoading,
    filter,
    setFilter,
    page,
    setPage,
    isTaskForce,
    setPageSize,
    filterContentList,
    filterDropdownList,
    tableHeader,
    isBusiness,
  } = useRequest();

  return (
    <>
      <Title title="Fast Track List" />
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
            onChange={setFilter}
            placeholder="Pencarian"
            dropdownList={filterDropdownList}
            contentList={filterContentList}
          />
        </Box>
      </RowWrapper>

      <Table
        isLoading={isLoading}
        tableHeader={tableHeader}
        tableData={bucketListContents}
        totalPage={bucketListPage?.totalPage ?? 1}
        currentPage={page}
        handlePageChange={setPage}
        onPageSizeChange={setPageSize}
        anomalyRow={anomalyRowStyle}
      />

      <ModalDef
        id={modal.DEBTOR}
        component={ModalDebtor}
      />
      <ModalDef
        id={modal.MODAL_TABLE_DK}
        component={ModalTableDk}
      />
    </>
  );
};

export default RequestPage;
