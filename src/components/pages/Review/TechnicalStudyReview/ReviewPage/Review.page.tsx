'use client';
import NiceModal, { ModalDef } from '@ebay/nice-modal-react';
import { Box } from '@mui/material';

import { MODAL } from '@/configs/constants/modalId';

import useGetRowDataColors from '@/components/layouts/MUILayout/components/hooks/useGetRowDataColors';
import Button from '@/components/shared/Button';
import Input from '@/components/shared/Input';
import RowWrapper from '@/components/shared/RowWrapper';
import ModalUploadTemplate from '@/components/shared/SmiModal/ModalUploadTemplate';
import Table from '@/components/shared/Table';
import Title from '@/components/shared/Title';

import useReview from './Review.hook';


const ReviewPage = () => {
  const { anomalyRowStyle } = useGetRowDataColors();
  const {
    data,
    isLoading,
    filter,
    setFilter,
    page,
    setPage,
    setPageSize,
    filterContentList,
    filterDropdownList,
    tableHeader,
  } = useReview();
  return (
    <>
      <Title title="Review Kajian Teknis List" />
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
        <Box>
          <Button
            onClick={() => NiceModal.show(MODAL.MODAL_UPLOAD_TEMPLATE, {
              processTemplateType: 'TECHNICAL_REVIEW_DELST',
              queryKeyList: ['bucket-list'],
            })}
            startIcon="upload"
          >
            Upload Dokumen
          </Button>
        </Box>
      </RowWrapper>

      <Table
        isLoading={isLoading}
        maxHeight="42vh"
        tableHeader={tableHeader}
        tableData={data?.contents}
        totalPage={data?.page?.totalPage ?? 1}
        currentPage={page}
        handlePageChange={setPage}
        onPageSizeChange={setPageSize}
        anomalyRow={anomalyRowStyle}
      />
      <ModalDef
        id={MODAL.MODAL_UPLOAD_TEMPLATE}
        component={ModalUploadTemplate}
      />
    </>
  );
};
export default ReviewPage;
