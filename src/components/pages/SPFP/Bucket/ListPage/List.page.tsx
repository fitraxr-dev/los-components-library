'use client';
import * as React from 'react';

import NiceModal, { ModalDef } from '@ebay/nice-modal-react';
import { Box, useTheme } from '@mui/material';

import { MODAL } from '@/configs/constants/modalId';
import { ActivityType } from '@/enums/Activity';
import useRecordLog from '@/hooks/useRecordLog';

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
  const { recordActivity } = useRecordLog();
  const { anomalyRowStyle } = useGetRowDataColors();
  const {
    filter,
    filterDropdownList,
    filterContentList,
    listContents,
    listPage,
    isLoading,
    page,
    pathname,
    tableHeader,
    setFilter,
    setPage,
    setPageSize,
  } = useList();

  React.useEffect(() => {
    recordActivity({
      activity: ActivityType.INITIAL_PAGE,
      bucketProcessId: '',
      changeAfter: '',
      changeBefore: '',
      module: 'SPFP',
      process: '',
      remarks: 'view SPFP bucket list page',
    });
  }, [recordActivity]);

  return (
    <>
      <Title title="SPFP List" />
      <ColumnWrapper gap={theme.spacing(1)} marginBottom={theme.spacing(5)}>
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
              checkboxList: [
                { label: 'Complience Check', value: 'SPFP_DPOP' },
                { label: 'SPFP Creation', value: 'SPFP' },
              ],
              queryKeyList: ['bucket-list'],
              titleCheckbox: 'Tipe Permohonan',
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
