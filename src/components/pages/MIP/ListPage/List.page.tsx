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

import { useList } from './List.hook';


const ListPage = () => {
  const theme = useTheme();
  const { anomalyRowStyle } = useGetRowDataColors();
  const {
    filter,
    listContents,
    listPage,
    filterContentList,
    filterDropdownList,
    isAnalyst,
    isLoading,
    page,
    tableHeader,
    setFilter,
    setPage,
    setPageSize,
  } = useList();

  return (
    <>
      <Title title={isAnalyst ? 'Analyst List' : 'MIP List'} />
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
          {isAnalyst ? (
            <Button
              onClick={() => NiceModal.show(MODAL.MODAL_UPLOAD_TEMPLATE, {
                processTemplateType: 'MIP_ANALYST',
                queryKeyList: ['bucket-list'],
              })}
              startIcon="upload"
            >
              Upload Dokumen
            </Button>
          ) :
            (
              <Button
                onClick={() => NiceModal.show(MODAL.MODAL_UPLOAD_TEMPLATE, {
                  processTemplateType: 'MIP',
                  queryKeyList: ['bucket-list'],
                })}
                startIcon="upload"
              >
                Upload Dokumen
              </Button>
            )
          }
        </RowWrapper>

        <BaseContainer sx={{ boxShadow: 7 }}>
          <Table
            isLoading={isLoading}
            tableHeader={tableHeader}
            tableData={listContents}
            totalPage={listPage?.totalPage ?? 1}
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

export default ListPage;
