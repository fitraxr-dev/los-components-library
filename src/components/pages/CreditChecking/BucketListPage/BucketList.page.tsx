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
import ModalUploadTemplate from '@/components/shared/SmiModal/ModalUploadTemplate';
import Table from '@/components/shared/Table';
import Title from '@/components/shared/Title';

import useBucketList from './BucketList.hook';


const BucketListPage = () => {
  const theme = useTheme();
  const { anomalyRowStyle } = useGetRowDataColors();

  const {
    tableData,
    tablePage,
    isLoading,
    setFilter,
    filter,
    page,
    setPage,
    setPageSize,
    filterContentList,
    filterDropdownList,
    tableHeader,
  } = useBucketList();

  return (
    <>
      <Title title="Bucket Credit Checking" />
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
          <Button
            onClick={() => NiceModal.show(MODAL.MODAL_UPLOAD_TEMPLATE, {
              processTemplateType: 'CREDIT_CHECKING_DPOP',
              queryKeyList: ['get-user-collaboration'],
            })}
            startIcon="upload"
          >
            Upload Dokumen
          </Button>
        </RowWrapper>
        <BaseContainer sx={{ boxShadow: 7 }}>
          <Table
            isLoading={isLoading}
            maxHeight="42vh"
            tableHeader={tableHeader}
            tableData={tableData}
            totalPage={tablePage?.totalPage ?? 1}
            currentPage={page}
            handlePageChange={setPage}
            onPageSizeChange={setPageSize}
            anomalyRow={anomalyRowStyle}
          />
        </BaseContainer>
        <ModalDef
          id={MODAL.MODAL_UPLOAD_TEMPLATE}
          component={ModalUploadTemplate}
        />
      </ColumnWrapper>

    </>
  );
};

export default BucketListPage;
