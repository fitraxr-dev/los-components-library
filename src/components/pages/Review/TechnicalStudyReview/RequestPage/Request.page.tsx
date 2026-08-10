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

import ConfirmationLatest from '../components/ConfirmationLatest/ConfirmationLatest';

import ModalDebtor from './components/ModalDebtor';
import { ModalSimilarDebtor } from './components/ModalSimilarDebtor';
import { modal } from './Request.constants';
import useRequest from './Request.hook';


const RequestPage = () => {
  const [{ currentRole }] = useApp();
  const { anomalyRowStyle } = useGetRowDataColors();
  const {
    data,
    isLoading,
    setFilter,
    page,
    setPage,
    setPageSize,
    filterContentList,
    filterDropdownList,
    tableHeader,
    filter,
  } = useRequest();

  const canCreateNewRequest = useCheckAccess(accessid.REQUEST_TECHNICAL_STUDY_CREATE);

  return (
    <>
      <ConfirmationLatest />
      <Title title="Permintaan Kajian Teknis" />
      <RowWrapper
        sx={{
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <Box width="45vw">
          <Input
            type="search"
            onChange={setFilter}
            value={filter}
            placeholder="Pencarian..."
            dropdownList={filterDropdownList}
            contentList={filterContentList}
          />
        </Box>
        <Button
          startIcon="upload"
          onClick={() => NiceModal.show(MODAL.MODAL_UPLOAD_TEMPLATE, {
            processTemplateType: 'TECHNICAL_REVIEW',
            queryKeyList: ['bucket-list'],
            title: 'Upload Template Offline Kajian Teknis',
          })}
        >
          Upload Template Offline
        </Button>
        {canCreateNewRequest ?
          <Button onClick={() => NiceModal.show(modal.DEBTOR)}>Add New</Button> : null}
      </RowWrapper>


      <Table
        isLoading={isLoading}
        tableHeader={tableHeader}
        tableData={data?.contents}
        totalPage={data?.page?.totalPage ?? 1}
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
        id={modal.SIMILAR_DEBTOR}
        component={ModalSimilarDebtor}
      />
    </>
  );
};

export default RequestPage;
