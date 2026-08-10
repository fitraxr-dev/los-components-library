'use client';
import React from 'react';

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

import useList from './List.hook';


const ListPage = () => {
  const theme = useTheme();
  const { anomalyRowStyle } = useGetRowDataColors();
  const {
    noPage,
    setNoPage,
    setItemPerPage,
    mupListContents,
    mupListPage,
    tableHeader,
    setFilter,
    filterContentList,
    filterDropdownList,
    isLoading,
    filter,
  } = useList();


  return (
    <>
      <Title title="MUP Analyst List" />
      <ColumnWrapper gap={theme.spacing(1)} >
        <RowWrapper
          sx={{
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
          gap={theme.spacing(3)}
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
              processTemplateType: 'MUP_ANALYST',
              queryKeyList: ['bucket-list'],
            })}
            startIcon="upload"
          >
            Upload Dokumen
          </Button>
        </RowWrapper>

        <BaseContainer sx={{ boxShadow: 7 }}>
          <Table
            isLoading={isLoading}
            tableHeader={tableHeader}
            tableData={mupListContents}
            totalPage={mupListPage?.totalPage ?? 1}
            currentPage={noPage}
            handlePageChange={setNoPage}
            onPageSizeChange={setItemPerPage}
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
