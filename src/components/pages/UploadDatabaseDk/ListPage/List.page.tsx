'use client';

import React from 'react';

import { ModalDef } from '@ebay/nice-modal-react';
import { Box, useTheme } from '@mui/material';
import { Controller } from 'react-hook-form';

import BaseContainer from '@/components/shared/BaseContainer';
import Button from '@/components/shared/Button';
import ColumnWrapper from '@/components/shared/ColumnWrapper';
import Input from '@/components/shared/Input';
import RowWrapper from '@/components/shared/RowWrapper';
import SectionTitle from '@/components/shared/SectionTitle';
import Table from '@/components/shared/Table';
import TextStyle from '@/components/shared/TextStyle';
import Title from '@/components/shared/Title';

import ListFilter from './components/ListFilter';
import ModalCustomerCheck from './components/ModalCustomerCheck';
import ModalDetail from './components/ModalDetail';
import { modal } from './List.constants';
import useList from './List.hook';


const ListPage = () => {
  const theme = useTheme();
  const {
    data,
    filter,
    setFilter,
    page,
    setPage,
    setPageSize,
    tableHeader,
    isLoading,
    control,
    handleCustomerCheck,
    handleUpload,
    handleDownloadTemplate,
    isUploading,
    isDownloading,
    fileInputKey,
    canDownload,
  } = useList();

  return (
    <>
      <Title title="Upload Database DK" />
      <ColumnWrapper gap={theme.spacing(1)} mb={theme.spacing(8)}>
        <RowWrapper
          sx={{
            alignItems: 'flex-start',
            gap: theme.spacing(2),
            py: 2,
          }}
        >
          <TextStyle
            variant="body3"
            color={theme.palette.primary.main}
            sx={{ mt: 1.5 }}
          >
            File Name
          </TextStyle>

          <TextStyle
            variant="body3"
            color={theme.palette.primary.main}
            sx={{ mt: 1.5 }}
          >
            :
          </TextStyle>

          <Controller
            key={fileInputKey}
            name="document"
            control={control}
            render={({ field: { ref, ...field }, fieldState: { error } }) => (
              <Input
                {...field}
                ref={ref}
                type="file"
                containerSx={{ flex: 1 }}
                error={!!error}
                helperText={error?.message}
                fileConstraint=".csv, .xls, .xlsx"
                disabled={isUploading}
              />
            )}
          />

          <Button
            color="primary"
            onClick={handleUpload}
            sx={{ mt: 0.5 }}
            disabled={isUploading}
            isLoading={isUploading}
          >
            {isUploading ? 'Uploading...' : 'Upload'}
          </Button>

          <Button
            color="primary"
            onClick={handleCustomerCheck}
            sx={{ mt: 0.5 }}
            disabled={isUploading}
          >
            Customer Check
          </Button>

          {
            canDownload &&
            <Button
              color="success"
              onClick={handleDownloadTemplate}
              endIcon="doc-upload"
              sx={{ mt: 0.5 }}
              disabled={isUploading || isDownloading}
              isLoading={isDownloading}
            >
              Download Template Database
            </Button>
          }
        </RowWrapper>

        <Title
          title="Log Process"
          sx={{
            border: `1px solid ${theme.palette.primary.main}`,
            borderRadius: theme.spacing(1.5),
            fontWeight: 400,
            my: 2,
            px: 2,
            py: 0.5,
          }}
          customRender={
            <ListFilter localValue={filter} onChangeValue={setFilter} />
          }
        />
        <BaseContainer sx={{ boxShadow: 7 }}>
          <Table
            isLoading={isLoading}
            maxHeight="42vh"
            tableHeader={tableHeader}
            tableData={data?.contents || []}
            totalPage={data?.page?.totalPage ?? 1}
            currentPage={page}
            handlePageChange={setPage}
            onPageSizeChange={setPageSize}
          />
        </BaseContainer>
      </ColumnWrapper>

      <ModalDef id={modal.DETAIL} component={ModalDetail} />
      <ModalDef id={modal.CUSTOMER_CHECK} component={ModalCustomerCheck} />
    </>
  );
};

export default ListPage;
