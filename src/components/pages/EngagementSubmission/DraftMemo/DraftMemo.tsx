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
  DraftMemoHistoryProps,
} from '@/components/shared/SmiTable/DraftMemo/TableDraftMemoHistory/TableDraftMemoHistory.types';


const DraftMemo = () => {
  const { handleOpenGenerateDraftModal, formattedStringProcessId, viewOnly } = useDraftMemo();

  const button: DraftMemoHistoryProps = [{
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
        module={TypeModule.ENGAGEMENT_AGREEMENT}
        process={TypeProcess.ENGAGEMENT_AGREEMENT}
      />

      <TableDraftMemoFinancingDocument
        module={`${TypeModule.ENGAGEMENT_AGREEMENT}|${TypeModule.ENGAGEMENT_AGREEMENT}`}
        process={`${TypeProcess.ENGAGEMENT_AGREEMENT}|${TypeProcess.PROCESSING_TYPE_PK}`}
        id={formattedStringProcessId}
      />

      <TableDraftMemoSupportingDocument
        module={`${TypeModule.ENGAGEMENT_AGREEMENT}|${TypeModule.ENGAGEMENT_AGREEMENT}`}
        process={`${TypeProcess.ENGAGEMENT_AGREEMENT}|${TypeProcess.PROCESSING_TYPE_PK}`}
        id={formattedStringProcessId}
      />

      <TableDraftMemoHistory
        module={TypeModule.ENGAGEMENT_AGREEMENT}
        process={TypeProcess.ENGAGEMENT_AGREEMENT}
        buttons={button}
      />
    </ColumnWrapper>
  );
};

export default DraftMemo;
