'use client';
import React from 'react';

import { TypeModule } from '@/enums/Module';

import { useAnnualReviewContext } from '@/components/layouts/AnnualReviewLayout/AnnualReview.context';
import ColumnWrapper from '@/components/shared/ColumnWrapper';
import TableDraftMemoDigital from '@/components/shared/SmiTable/DraftMemo/TableDraftMemoDigital';
import TableDraftMemoFinancingDocument from '@/components/shared/SmiTable/DraftMemo/TableDraftMemoFinancingDocument';
import TableDraftMemoHistory from '@/components/shared/SmiTable/DraftMemo/TableDraftMemoHistory';
import TableDraftMemoSupportingDocument from '@/components/shared/SmiTable/DraftMemo/TableDraftMemoSupportingDocument';
import Title from '@/components/shared/Title';

import ConfirmationLatest from '../components/ConfirmationLatest/ConfirmationLatest';

import useDraftMemo from './DraftMemo.hooks';

import type {
  DraftMemoButtonProps,
} from '@/components/shared/SmiTable/DraftMemo/TableDraftMemoHistory/TableDraftMemoHistory.types';


const DraftMemo = () => {
  const {
    handleOpenGenerateDraftModal,
    typeProcess,
    viewOnly,
  } = useDraftMemo();
  const { isDepiDivision } = useAnnualReviewContext();

  const button: DraftMemoButtonProps[] = [{
    color: 'info',
    disabled: viewOnly,
    label: 'Generate Draft Memo',
    onClick: handleOpenGenerateDraftModal,
    variant: 'contained',
  }];

  return (
    <ColumnWrapper sx={{ gap: 3 }}>
      {isDepiDivision && <ConfirmationLatest />}
      <Title title="Pilih Lampiran Memo" />

      <TableDraftMemoDigital
        module={TypeModule.ANNUAL_REVIEW}
        process={typeProcess}
      />

      <TableDraftMemoFinancingDocument
        module={TypeModule.ANNUAL_REVIEW}
        process={typeProcess}
      />

      <TableDraftMemoSupportingDocument
        module={TypeModule.ANNUAL_REVIEW}
        process={typeProcess}
      />

      <TableDraftMemoHistory
        module={TypeModule.ANNUAL_REVIEW}
        process={typeProcess}
        buttons={button}
      />
    </ColumnWrapper>
  );
};

export default DraftMemo;
