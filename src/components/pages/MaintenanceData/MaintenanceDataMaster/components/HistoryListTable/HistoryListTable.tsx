'use client';
import { useEffect, useState } from 'react';

import { Box, useTheme } from '@mui/material';
import { useForm } from 'react-hook-form';

import { TypeModule, TypeProcess } from '@/enums/Module';
import { toDateString } from '@/helpers/date';
import useGetBucketById from '@/hooks/services/useGetBucketById';
import useApp from '@/hooks/useApp';
import useIdentity from '@/hooks/useIdentity';

import BaseContainer from '@/components/shared/BaseContainer';
import Button from '@/components/shared/Button';
import ColumnWrapper from '@/components/shared/ColumnWrapper';
import RowWrapper from '@/components/shared/RowWrapper';
import SectionTitle from '@/components/shared/SectionTitle';

// import Table from '@/components/shared/Table';
import Table from '../../../MasterSLA/components/Table';

import useHistoryListTable from './HistoryListTable.hook';


const HistoryListTable = () => {
  const {
    deleteList,
    updateList,
    addNewList,
    isDeleteLoading,
    isUpdateListLoading,
    isAddNewListLoading,
    tableHeader,
    tableHeaderUpdate,
    handleRejectModal,
    handleSubmitModal,
  } = useHistoryListTable();

  return (
    <>
      <ColumnWrapper sx={{ gap: 3, mt: 2 }}>
        <SectionTitle title="Delete" />
        <BaseContainer>
          <Table
            isLoading={isDeleteLoading}
            tableData={deleteList?.contents}
            tableHeader={tableHeader}
          />
        </BaseContainer>
      </ColumnWrapper>

      <ColumnWrapper sx={{ gap: 3, mt: 2 }}>
        <SectionTitle title="Update" />
        <BaseContainer>
          <Table
            isLoading={isUpdateListLoading}
            tableData={updateList?.contents}
            tableHeader={tableHeaderUpdate}
          />
        </BaseContainer>
      </ColumnWrapper>

      <ColumnWrapper sx={{ gap: 3, mt: 2 }}>
        <SectionTitle title="Add New" />
        <BaseContainer>
          <Table
            isLoading={isAddNewListLoading}
            tableData={addNewList?.contents}
            tableHeader={tableHeader}
          />
        </BaseContainer>
      </ColumnWrapper>

      <RowWrapper sx={{ gap: 3, justifyContent: 'end', mt: 3 }}>
        <Button onClick={() => {}}>Next</Button>
        <Button
          onClick={handleSubmitModal}
          variant="contained"
          color="success"
        >Approve
        </Button>

        <Button
          color="error"
          variant="outlined"
          onClick={handleRejectModal}
        >
          Reject
        </Button>

        <Button
          onClick={handleSubmitModal}
          variant="contained"
          color="success"
        >Submit
        </Button>
      </RowWrapper>
    </>
  );
};

export default HistoryListTable;
