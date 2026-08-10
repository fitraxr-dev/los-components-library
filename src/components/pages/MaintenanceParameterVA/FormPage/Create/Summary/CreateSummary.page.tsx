'use client';

import React from 'react';

import { useBreadcrumbs } from '@/components/layouts/MasterParameterLayout/components/Breadcrumbs/Breadcrumbs.context';
import BaseContainer from '@/components/shared/BaseContainer';
import Button from '@/components/shared/Button';
import ColumnWrapper from '@/components/shared/ColumnWrapper';
import RowWrapper from '@/components/shared/RowWrapper';
import SectionTitle from '@/components/shared/SectionTitle';
import Table from '@/components/shared/Table';
import Title from '@/components/shared/Title';

import { useCreateSummary } from './CreateSummary.hook';


const CreateSummaryPage = () => {
  const { push, reset } = useBreadcrumbs();

  const {
    addNewBusinessSummaryData,
    addNewBusinessSummaryHeader,
    handleClose,
    handleNext,
    handleSubmit,
    hasDataToSubmit,
    isLoading,
    isMaker,
    pageAdd,
    pageSizeAdd,
    setPageAdd,
    setPageSizeAdd,
    tablePageAdd,
  } = useCreateSummary();

  React.useEffect(() => {
    reset();
    push({ href: '/master-parameter/parameter-va', label: 'Parameter VA' });
    push({ href: null, label: 'Create Summary' });
  }, [push, reset]);

  return (
    <ColumnWrapper>
      <Title title="Create Parameter VA - Summary" />

      <BaseContainer sx={{ boxShadow: 7 }}>
        <SectionTitle title="Add New Virtual Account" />

        <Table
          isLoading={isLoading}
          tableHeader={addNewBusinessSummaryHeader}
          tableData={addNewBusinessSummaryData}
          totalPage={tablePageAdd?.totalPage ?? 1}
          currentPage={pageAdd}
          handlePageChange={setPageAdd}
          onPageSizeChange={setPageSizeAdd}
          pageSize={pageSizeAdd}
        />
      </BaseContainer>

      <RowWrapper justifyContent="flex-end" gap={2} sx={{ mt: 3 }}>
        <Button
          variant="outlined"
          onClick={handleClose}
        >
          Close
        </Button>

        {isMaker && (
          <Button
            variant="contained"
            onClick={handleSubmit}
            disabled={!hasDataToSubmit}
          >
            Submit
          </Button>
        )}
      </RowWrapper>
    </ColumnWrapper>
  );
};

export default CreateSummaryPage;
