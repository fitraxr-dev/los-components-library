'use client';
import React from 'react';

import { useTheme } from '@mui/material';

import { TypeModule, TypeProcess } from '@/enums/Module';
import useViewOnly from '@/hooks/useViewOnly';

import ColumnWrapper from '@/components/shared/ColumnWrapper';
import TableDraftMemoDigital from '@/components/shared/SmiTable/DraftMemo/TableDraftMemoDigital';
import TableDraftMemoFinancingDocument from '@/components/shared/SmiTable/DraftMemo/TableDraftMemoFinancingDocument';
import TableDraftMemoHistory from '@/components/shared/SmiTable/DraftMemo/TableDraftMemoHistory';
import TableDraftMemoSupportingDocument from '@/components/shared/SmiTable/DraftMemo/TableDraftMemoSupportingDocument';
import Title from '@/components/shared/Title';

import useDraftMemo from './DraftMemo.hook';

import type {
  DraftMemoButtonProps,
} from '@/components/shared/SmiTable/DraftMemo/TableDraftMemoHistory/TableDraftMemoHistory.types';


const DraftMemoPage = () => {
  const theme = useTheme();
  const { viewOnly } = useViewOnly();

  const {
    handleOpenGenerateDraftMemoModal,
    canView,
    canUpdate,
  } = useDraftMemo();

  if (!canView) {
    return null;
  }

  const button: DraftMemoButtonProps[] = [{
    color: 'info',
    disabled: viewOnly || !canUpdate,
    label: 'Generate Draft Memo',
    onClick: handleOpenGenerateDraftMemoModal,
    variant: 'contained',
  }];

  return (
    <ColumnWrapper gap={theme.spacing(3)}>
      <Title title="Pilih Lampiran Memo" />
      <TableDraftMemoDigital module={TypeModule.MUP} process={TypeProcess.MUP_ANALYST} />
      <TableDraftMemoFinancingDocument module={TypeModule.MUP} process={TypeProcess.MUP_ANALYST} />
      <TableDraftMemoSupportingDocument module={TypeModule.MUP} process={TypeProcess.MUP_ANALYST} />

      <TableDraftMemoHistory
        module={TypeModule.MUP}
        process={TypeProcess.MUP_ANALYST}
        buttons={button}
      />
    </ColumnWrapper>
  );
};

export default DraftMemoPage;
