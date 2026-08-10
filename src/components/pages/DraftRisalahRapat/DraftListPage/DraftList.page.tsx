'use client';

import NiceModal, { ModalDef } from '@ebay/nice-modal-react';
import { useTheme } from '@mui/material';

import { MODAL } from '@/configs/constants/modalId';

import useGetRowDataColors from '@/components/layouts/MUILayout/components/hooks/useGetRowDataColors';
import BaseContainer from '@/components/shared/BaseContainer';
import Button from '@/components/shared/Button';
import ColumnWrapper from '@/components/shared/ColumnWrapper';
import Input from '@/components/shared/Input';
import RowWrapper from '@/components/shared/RowWrapper';
import ModalUploadTemplate from '@/components/shared/SmiModal/ModalUploadTemplate';
import Table from '@/components/shared/Table';
import Title from '@/components/shared/Title';

import useDraftListPage from './DraftList.hooks';


const DraftListPage = () => {
  const theme = useTheme();
  const { anomalyRowStyle } = useGetRowDataColors();
  const {
    filter,
    filterContentList,
    filterDropdownList,
    isLoading,
    page,
    pageSize,
    setFilter,
    setPage,
    setPageSize,
    tableData,
    tableHeader,
    totalPage,
  } = useDraftListPage();

  return (
    <>
      <Title title="Risalah Rapat List" />
      <ColumnWrapper gap={theme.spacing(1)}>
        <RowWrapper justifyContent="space-between" alignItems="center">
          <Input
            type="search"
            value={filter}
            onChange={setFilter}
            placeholder="Pencarian..."
            dropdownList={filterDropdownList}
            contentList={filterContentList}
            containerSx={{ width: '45vw' }}
          />

          <Button
            onClick={() =>
              NiceModal.show(MODAL.MODAL_UPLOAD_TEMPLATE, {
                processTemplateType: 'RISALAH_RAPAT',
                queryKeyList: ['bucket-list'],
              })
            }
            startIcon="upload"
          >
            Upload Dokumen
          </Button>
        </RowWrapper>

        <BaseContainer sx={{ boxShadow: 7 }}>
          <Table
            tableHeader={tableHeader}
            tableData={tableData}
            totalPage={totalPage ?? 1}
            currentPage={page}
            handlePageChange={setPage}
            pageSize={pageSize}
            onPageSizeChange={setPageSize}
            isLoading={isLoading}
            anomalyRow={anomalyRowStyle}
          />
        </BaseContainer>
      </ColumnWrapper>

      <ModalDef
        id={MODAL.MODAL_UPLOAD_TEMPLATE}
        component={ModalUploadTemplate}
      />
    </>
  );
};

export default DraftListPage;
