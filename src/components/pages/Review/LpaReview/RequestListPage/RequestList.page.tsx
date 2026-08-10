'use client';
import React from 'react';

import NiceModal, { ModalDef } from '@ebay/nice-modal-react';
import { Box, useTheme } from '@mui/material';
import { usePathname } from 'next/navigation';

import { roles } from '@/configs/constants';
import { MODAL } from '@/configs/constants/modalId';
import { accessid } from '@/configs/constants/pathname';
import useApp from '@/hooks/useApp';
import useCheckAccess from '@/hooks/useCheckAccess';

import useGetRowDataColors from '@/components/layouts/MUILayout/components/hooks/useGetRowDataColors';
import BaseContainer from '@/components/shared/BaseContainer';
import Button from '@/components/shared/Button';
import ColumnWrapper from '@/components/shared/ColumnWrapper';
import Input from '@/components/shared/Input';
import RowWrapper from '@/components/shared/RowWrapper';
import ModalUploadTemplate from '@/components/shared/SmiModal/ModalUploadTemplate';
import Table from '@/components/shared/Table';
import Title from '@/components/shared/Title';


import ModalBucket from './components/ModalBucket';
import { ModalSimilarDebtor } from './components/ModalSimilarDebtor';
import { MODAL_ID } from './RequestList.constant';
import useRequestList from './RequestList.hook';


const RequestListPage = () => {
  const [{ currentRole }] = useApp();
  const theme = useTheme();
  const pathName = usePathname();
  const currentModule = pathName.split('/')[3];
  const { anomalyRowStyle } = useGetRowDataColors();
  const {
    data,
    filter,
    filterContentList,
    filterDropdownList,
    noPage,
    setFilter,
    isLoading,
    setItemPerPage,
    setNoPage,
    tableHeader } = useRequestList();

  const canCreateNewRequest = useCheckAccess(accessid.LPA_BUCKET_LIST_CREATE);

  return (
    <>
      <Title title="Permohonan Review LPA List" />
      <ColumnWrapper gap={theme.spacing(1)}>
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
              placeholder="Pencarian..."
              dropdownList={filterDropdownList}
              contentList={filterContentList}
            />
          </Box>

          <Box sx={{ alignItems: 'center', display: 'flex', gap: theme.spacing(1) }}>
            <Button
              onClick={() => NiceModal.show(MODAL.MODAL_UPLOAD_TEMPLATE, {
                checkboxList: [
                  { label: 'LPA Request', value: 'LPA' },
                  { label: 'LPA Review', value: 'LPA_REVIEW' },
                ],
                queryKeyList: ['bucket-list'],
                titleCheckbox: 'Tipe Permohonan',
              })}
              startIcon="upload"
            >
              Upload Dokumen
            </Button>

            {canCreateNewRequest && currentModule === 'lpa-request-review' ? (
              <Button
                onClick={() => { NiceModal.show(MODAL_ID.MODAL_REQUEST); }}
              >
                Add New
              </Button>
            ) : null}
          </Box>
        </RowWrapper>
        <BaseContainer sx={{ boxShadow: 7 }}>
          <Table
            isLoading={isLoading}
            tableHeader={tableHeader}
            tableData={data?.contents}
            totalPage={data?.page?.totalPage}
            currentPage={noPage}
            handlePageChange={setNoPage}
            onPageSizeChange={setItemPerPage}
            anomalyRow={anomalyRowStyle}
          />
        </BaseContainer>
      </ColumnWrapper>
      <ModalDef
        id={MODAL.MODAL_UPLOAD_TEMPLATE}
        component={ModalUploadTemplate}
      />
      <ModalDef
        id={MODAL_ID.MODAL_REQUEST}
        component={ModalBucket}
      />
      <ModalDef
        id={MODAL_ID.SIMILAR_DEBTOR}
        component={ModalSimilarDebtor}
      />
    </>
  );
};

export default RequestListPage;
