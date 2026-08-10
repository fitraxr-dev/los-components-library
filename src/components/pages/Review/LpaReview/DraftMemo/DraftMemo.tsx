'use client';
import React from 'react';

import Button from '@/components/shared/Button';
import ColumnWrapper from '@/components/shared/ColumnWrapper';
import RowWrapper from '@/components/shared/RowWrapper';
import TableDraftMemoDigital from '@/components/shared/SmiTable/DraftMemo/TableDraftMemoDigital';
import TableDraftMemoFinancingDocument from '@/components/shared/SmiTable/DraftMemo/TableDraftMemoFinancingDocument';
import TableDraftMemoHistory from '@/components/shared/SmiTable/DraftMemo/TableDraftMemoHistory';
import TableDraftMemoSupportingDocument from '@/components/shared/SmiTable/DraftMemo/TableDraftMemoSupportingDocument';
import Title from '@/components/shared/Title';

import ConfirmationLatest from '../components/ConfirmationLatest/ConfirmationLatest';
import useGetCurrentModule from '../hooks/useGetCurrentModule';

import useDraftMemo from './DraftMemo.hooks';


import type {
  DraftMemoButtonProps,
} from '@/components/shared/SmiTable/DraftMemo/TableDraftMemoHistory/TableDraftMemoHistory.types';


const DraftMemo = () => {
  const { handleOpenGenerateDraftModal, viewOnly } = useDraftMemo();
  const { module, process } = useGetCurrentModule();

  const button: DraftMemoButtonProps[] = [{
    color: 'info',
    disabled: viewOnly,
    label: 'Generate Draft Memo',
    onClick: handleOpenGenerateDraftModal,
    variant: 'contained',
  }];

  return (
    <ColumnWrapper sx={{ gap: 3 }}>
      <ConfirmationLatest />
      <Title title="Pilih Lampiran Memo" />

      <TableDraftMemoDigital
        module={module}
        process={process}
      />

      <TableDraftMemoFinancingDocument
        module={module}
        process={process}
      />

      <TableDraftMemoSupportingDocument
        module={module}
        process={process}
      />

      <TableDraftMemoHistory
        process={process}
        module={module}
        buttons={button}
      />
    </ColumnWrapper>
  );
};

export default DraftMemo;
