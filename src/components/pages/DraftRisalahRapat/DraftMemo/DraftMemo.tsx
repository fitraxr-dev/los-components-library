'use client';
import React from 'react';

import { TypeModule, TypeProcess } from '@/enums/Module';

import ColumnWrapper from '@/components/shared/ColumnWrapper';
import TableDraftMemoDigital from '@/components/shared/SmiTable/DraftMemo/TableDraftMemoDigital';
import TableDraftMemoFinancingDocument from '@/components/shared/SmiTable/DraftMemo/TableDraftMemoFinancingDocument';
import TableDraftMemoHistory from '@/components/shared/SmiTable/DraftMemo/TableDraftMemoHistory';
import TableDraftMemoSupportingDocument from '@/components/shared/SmiTable/DraftMemo/TableDraftMemoSupportingDocument';
import Title from '@/components/shared/Title';

import useDraftMemo from './DraftMemo.hooks';

import type {
  DraftMemoButtonProps,
} from '@/components/shared/SmiTable/DraftMemo/TableDraftMemoHistory/TableDraftMemoHistory.types';


const DraftMemo = () => {
  const { handleOpenGenerateDraftModal, viewOnly } = useDraftMemo();

  const button: DraftMemoButtonProps[] = [{
    color: 'info',
    disabled: viewOnly,
    label: 'Generate Draft Memo',
    onClick: handleOpenGenerateDraftModal,
    variant: 'contained',
  }];

  return (
    <ColumnWrapper sx={{ gap: 3 }}>
      <Title title="Draft Memo" />

      <TableDraftMemoDigital
        module={TypeModule.RISALAH_RAPAT}
        process={TypeProcess.RISALAH_RAPAT}
      />

      <TableDraftMemoFinancingDocument
        module={TypeModule.RISALAH_RAPAT}
        process={TypeProcess.RISALAH_RAPAT}
      />

      <TableDraftMemoSupportingDocument
        module={TypeModule.RISALAH_RAPAT}
        process={TypeProcess.RISALAH_RAPAT}
      />

      <TableDraftMemoHistory
        process={TypeProcess.RISALAH_RAPAT}
        module={TypeModule.RISALAH_RAPAT}
        buttons={button}
      />
    </ColumnWrapper>
  );
};

export default DraftMemo;
