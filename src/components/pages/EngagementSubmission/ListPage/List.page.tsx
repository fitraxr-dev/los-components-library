'use client';
import NiceModal, { ModalDef } from '@ebay/nice-modal-react';
import { Box, useTheme } from '@mui/material';

import { MODAL } from '@/configs/constants/modalId';

import useGetRowDataColors from '@/components/layouts/MUILayout/components/hooks/useGetRowDataColors';
import BaseContainer from '@/components/shared/BaseContainer';
import Button from '@/components/shared/Button';
import ColumnWrapper from '@/components/shared/ColumnWrapper';
import Input from '@/components/shared/Input';
import RowWrapper from '@/components/shared/RowWrapper';
import ModalStatusPk from '@/components/shared/SmiModal/ModalStatusPk';
import ModalUploadTemplate from '@/components/shared/SmiModal/ModalUploadTemplate';
import Table from '@/components/shared/Table';
import Title from '@/components/shared/Title';

import { useList } from './List.hook';


const ListPage = () => {
  const theme = useTheme();
  const { anomalyRowStyle } = useGetRowDataColors();
  const {
    filter,
    setFilter,
    setPage,
    setPageSize,
    filterDropdownList,
    filterContentList,
    tableHeader,
    engagementDataList,
    isLoading,
    totalPage,
    page,
  } = useList();

  return (
    <>
      <Title title="Pengajuan Perikatan List" />
      <ColumnWrapper gap={theme.spacing(1)} mb={theme.spacing(8)}>
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
              hasFilter
              onChange={setFilter}
              placeholder="Pencarian..."
              dropdownList={filterDropdownList}
              contentList={filterContentList}
            />
          </Box>
          <Button
            onClick={() => NiceModal.show(MODAL.MODAL_UPLOAD_TEMPLATE, {
              processTemplateType: 'ENGAGEMENT_AGREEMENT',
              queryKeyList: ['bucket-list'],
            })}
            startIcon="upload"
          >
            Upload Dokumen
          </Button>
        </RowWrapper>
        <BaseContainer sx={{ boxShadow: 7, p: 1 }}>
          <Table
            isLoading={isLoading}
            maxHeight="42vh"
            tableHeader={tableHeader}
            tableData={engagementDataList}
            totalPage={totalPage}
            currentPage={page}
            handlePageChange={setPage}
            onPageSizeChange={setPageSize}
            anomalyRow={anomalyRowStyle}
          />
        </BaseContainer>
        <ModalDef
          id={MODAL.STATUS_PK}
          component={ModalStatusPk}
        />
        <ModalDef
          id={MODAL.MODAL_UPLOAD_TEMPLATE}
          component={ModalUploadTemplate}
        />
      </ColumnWrapper>
    </>
  );
};

export default ListPage;
