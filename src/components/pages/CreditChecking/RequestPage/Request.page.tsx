'use client';
import NiceModal, { ModalDef } from '@ebay/nice-modal-react';
import { Box } from '@mui/material';

import { MODAL } from '@/configs/constants/modalId';
import { accessid } from '@/configs/constants/pathname';
import useApp from '@/hooks/useApp';
import useCheckAccess from '@/hooks/useCheckAccess';

import useGetRowDataColors from '@/components/layouts/MUILayout/components/hooks/useGetRowDataColors';
import Button from '@/components/shared/Button';
import Input from '@/components/shared/Input';
import RowWrapper from '@/components/shared/RowWrapper';
import ModalUploadTemplate from '@/components/shared/SmiModal/ModalUploadTemplate';
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
      <Title title="Permintaan Credit Checking List" />
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
        <Box display="flex" gap={2}>
          <Button
            onClick={() => NiceModal.show(MODAL.MODAL_UPLOAD_TEMPLATE, {
              processTemplateType: 'CREDIT_CHECKING',
              queryKeyList: ['bucket-list'],
            })}
            startIcon="upload"
          >
            Upload Dokumen
          </Button>
          {canAddNew && <Button onClick={() => NiceModal.show(modal.DEBTOR)}>Add New</Button>}
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
        id={MODAL.MODAL_UPLOAD_TEMPLATE}
        component={ModalUploadTemplate}
      />
      <ModalDef
        id={modal.MODAL_TABLE_DK}
        component={ModalTableDk}
      />
    </>
  );
};

export default RequestPage;
