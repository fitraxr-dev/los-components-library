'use client';

import React from 'react';

import { useTheme } from '@mui/material';

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


const DraftMemoPage = () => {
  const theme = useTheme();
  const { handleOpenGenerateDraftModal, viewOnly } = useDraftMemo();

  const button: DraftMemoButtonProps[] = [{
    color: 'info',
    disabled: viewOnly,
    label: 'Generate Draft Memo',
    onClick: handleOpenGenerateDraftModal,
    variant: 'contained',
  }];

  return (
    <ColumnWrapper sx={{ gap: theme.spacing(3) }}>
      <Title title="Pilih Lampiran Memo" />

      <TableDraftMemoDigital
        module={TypeModule.HIGH_RISK}
        process={TypeProcess.HIGH_RISK_DK}
      />

      <TableDraftMemoFinancingDocument
        module={TypeModule.HIGH_RISK}
        process={TypeProcess.HIGH_RISK_DK}
      />

      <TableDraftMemoSupportingDocument
        module={TypeModule.HIGH_RISK}
        process={TypeProcess.HIGH_RISK_DK}
      />

      <TableDraftMemoHistory
        process={TypeProcess.HIGH_RISK_DK}
        module={TypeModule.HIGH_RISK}
        buttons={button}
      />
    </ColumnWrapper>
  );
};

export default DraftMemoPage;
