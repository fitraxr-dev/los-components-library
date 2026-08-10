'use client';
import React from 'react';

import useUpdateMipr from '@/hooks/services/processor/useUpdateMipr';
import useApp from '@/hooks/useApp';
import useIdentity from '@/hooks/useIdentity';

import useMipCcExpired from '@/components/pages/MIP/shared/hooks/useMipCcExpired';
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
  const [state] = useApp();
  const { processId } = useIdentity();
  const { bucketMasterId, handleOpenGenerateDraftModal, viewOnly, stepperStatus, stepperSteps } = useDraftMemo();

  useUpdateMipr({
    bucketParent: processId,
    stepperStatus,
    steps: stepperSteps,
  });

  useMipCcExpired({
    bucketMasterId,
    module: state.pages.mipModule,
    process: state.pages.mipProcess,
    stepperStatus,
    steps: stepperSteps,
  });

  const button: DraftMemoButtonProps[] = [{
    color: 'info',
    disabled: viewOnly,
    label: 'Generate Draft Memo',
    onClick: handleOpenGenerateDraftModal,
    variant: 'contained',
  }];

  return (
    <ColumnWrapper sx={{ gap: 3 }}>
      <Title title="Pilih Lampiran Memo" />

      <TableDraftMemoDigital
        module={state.pages.mipModule}
        process={state.pages.mipProcess}
      />

      <TableDraftMemoFinancingDocument
        module={state.pages.mipModule}
        process={state.pages.mipProcess}
      />

      <TableDraftMemoSupportingDocument
        module={state.pages.mipModule}
        process={state.pages.mipProcess}
      />

      <TableDraftMemoHistory
        module={state.pages.mipModule}
        process={state.pages.mipProcess}
        buttons={button}
      />
    </ColumnWrapper>
  );
};

export default DraftMemo;
