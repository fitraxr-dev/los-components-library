'use client';
import React from 'react';

import { TypeModule, TypeProcess } from '@/enums/Module';
import useIdentity from '@/hooks/useIdentity';

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
  const { childId } = useIdentity();

  const buttonList: DraftMemoButtonProps[] = [
    {
      color: 'info',
      disabled: viewOnly,
      label: 'Generate Draft Memo',
      onClick: handleOpenGenerateDraftModal,
    },
  ];

  return (
    <ColumnWrapper sx={{ gap: 3 }}>
      <Title title="Pilih Lampiran Memo" />

      <TableDraftMemoDigital
        module={TypeModule.ENGAGEMENT_AGREEMENT}
        process={TypeProcess.PROCESSING_TYPE_PK}
      />

      <TableDraftMemoFinancingDocument
        id={childId}
        module={TypeModule.ENGAGEMENT_AGREEMENT}
        process={TypeProcess.PROCESSING_TYPE_PK}
      />

      <TableDraftMemoSupportingDocument
        id={childId}
        module={TypeModule.ENGAGEMENT_AGREEMENT}
        process={TypeProcess.PROCESSING_TYPE_PK}
      />

      <TableDraftMemoHistory
        title="History Memo Notifikasi Pembiayaan"
        process={TypeProcess.PROCESSING_TYPE_PK}
        module={TypeModule.ENGAGEMENT_AGREEMENT}
        id={childId}
        buttons={buttonList}
      />
    </ColumnWrapper>
  );
};

export default DraftMemo;
