'use client';
import React from 'react';

import { ModalDef } from '@ebay/nice-modal-react';
import { useTheme } from '@mui/material';

import BaseContainer from '@/components/shared/BaseContainer';
import Button from '@/components/shared/Button';
import ColumnWrapper from '@/components/shared/ColumnWrapper';
import RowWrapper from '@/components/shared/RowWrapper';
import SectionTitle from '@/components/shared/SectionTitle';
import Table from '@/components/shared/Table';

import Remark from '../Remark';

import ModalOtherRelationDetail from './components/ModalOtherRelationDetail';
import { modal } from './OtherRelated.constants';
import useTableOtherParties from './OtherRelated.hook';


const OtherRelated = () => {
  const theme = useTheme();

  const {
    control,
    tableData,
    isAutoSaveFetching,
    handleSubmit,
    handleSubmitForm,
    isLoading,
    isSaveLoading,
    tableHeader,
    setShouldGoNext,
    viewOnly,
  } = useTableOtherParties();

  return (
    <ColumnWrapper sx={{ gap: theme.spacing(3) }}>
      <SectionTitle title="Pihak Terkait Lainnya" sx={{ marginBottom: theme.spacing(3) }} isOpen>
        <BaseContainer sx={{ boxShadow: 7 }}>
          <Table
            isLoading={isLoading}
            tableHeader={tableHeader}
            tableData={tableData}
          />
        </BaseContainer>
      </SectionTitle>
      <Remark control={control} />
      <RowWrapper justifyContent="end" gap={theme.spacing(2)}>
        <Button
          isLoading={isSaveLoading}
          disabled={viewOnly || isAutoSaveFetching}
          onClick={() => {
            setShouldGoNext(false);
            handleSubmitForm(handleSubmit)();
          }}
        >
          {isAutoSaveFetching ? 'Auto Save ...' : 'Save'}
        </Button>
        <Button
          isLoading={isSaveLoading}
          disabled={viewOnly}
          onClick={() => {
            setShouldGoNext(true);
            handleSubmitForm(handleSubmit)();
          }}
        >
          Next
        </Button>
      </RowWrapper>
      <ModalDef
        id={modal.MODAL_OTHER_RELATION_DETAIL}
        component={ModalOtherRelationDetail}
      />
    </ColumnWrapper>
  );
};

export default OtherRelated;
