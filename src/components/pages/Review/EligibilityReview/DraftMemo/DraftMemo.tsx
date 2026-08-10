'use client';
import React from 'react';

import { TypeModule, TypeProcess } from '@/enums/Module';
import useIdentity from '@/hooks/useIdentity';

import ColumnWrapper from '@/components/shared/ColumnWrapper';
import AlertDifferentData from '@/components/shared/SmiComponent/AlertDifferentData';
import TableDraftMemoDigital from '@/components/shared/SmiTable/DraftMemo/TableDraftMemoDigital';
import TableDraftMemoFinancingDocument from '@/components/shared/SmiTable/DraftMemo/TableDraftMemoFinancingDocument';
import TableDraftMemoHistory from '@/components/shared/SmiTable/DraftMemo/TableDraftMemoHistory';
import TableDraftMemoSupportingDocument from '@/components/shared/SmiTable/DraftMemo/TableDraftMemoSupportingDocument';
import Title from '@/components/shared/Title';

import ConfirmationLatest from '../../components/ConfirmationLatest/ConfirmationLatest';

import useDraftMemo from './DraftMemo.hooks';

import type {
  DraftMemoButtonProps,
} from '@/components/shared/SmiTable/DraftMemo/TableDraftMemoHistory/TableDraftMemoHistory.types';


const DraftMemo = () => {
  const { handleOpenGenerateDraftModal, viewOnly } = useDraftMemo();
  const { processId, parentId } = useIdentity();

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
      <AlertDifferentData
        bucketProcessId={processId}
        module={TypeModule.MIP_REVIEW}
        process={TypeProcess.REVIEWER_DEPI}
        isReviewer={true}
        refetchInterval={5000}
      />
      <ConfirmationLatest
        module={TypeModule.MIP_REVIEW}
        process={TypeProcess.REVIEWER_DEPI}
      />
      <Title title="Lampiran & Draft Memo" />

      <TableDraftMemoDigital
        module={TypeModule.MIP_REVIEW}
        process={TypeProcess.REVIEWER_DEPI}
      />

      <TableDraftMemoFinancingDocument
        id={`${processId}|${parentId}`}
        module={`${TypeModule.MIP_REVIEW}|${TypeModule.MIP_REVIEW}`}
        process={`${TypeProcess.REVIEWER_DEPI}|${TypeProcess.MIP_REVIEW}`}
      />

      <TableDraftMemoSupportingDocument
        id={`${processId}|${parentId}`}
        module={`${TypeModule.MIP_REVIEW}|${TypeModule.MIP_REVIEW}`}
        process={`${TypeProcess.REVIEWER_DEPI}|${TypeProcess.MIP_REVIEW}`}
      />

      <TableDraftMemoHistory
        process={TypeProcess.REVIEWER_DEPI}
        module={TypeModule.MIP_REVIEW}
        buttons={buttonList}
      />
    </ColumnWrapper>
  );
};

export default DraftMemo;
