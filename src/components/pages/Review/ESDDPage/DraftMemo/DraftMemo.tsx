'use client';

import { TypeModule, TypeProcess } from '@/enums/Module';

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
  const {
    canUpdateDraftMemo,
    handleOpenGenerateDraftModal,
    parentId,
    processId,
    viewOnly,
  } = useDraftMemo();


  const button: DraftMemoButtonProps[] = [{
    color: 'info',
    disabled: viewOnly || !canUpdateDraftMemo,
    label: 'Generate Draft Memo',
    onClick: handleOpenGenerateDraftModal,
    variant: 'contained',
  }];

  return (
    <ColumnWrapper sx={{ gap: 3 }}>
      <AlertDifferentData
        bucketProcessId={processId}
        module={TypeModule.MIP_REVIEW}
        process={TypeProcess.REVIEWER_DELST}
        isReviewer={true}
        refetchInterval={5000}
      />
      <ConfirmationLatest
        module={TypeModule.MIP_REVIEW}
        process={TypeProcess.REVIEWER_DELST}
      />

      <Title title="Lampiran & Draft Memo" />

      <TableDraftMemoDigital
        module={TypeModule.MIP_REVIEW}
        process={TypeProcess.REVIEWER_DELST}
      />

      <TableDraftMemoFinancingDocument
        id={`${processId}|${parentId}`}
        module={`${TypeModule.MIP_REVIEW}|${TypeModule.MIP_REVIEW}`}
        process={`${TypeProcess.REVIEWER_DELST}|${TypeProcess.MIP_REVIEW}`}
      />

      <TableDraftMemoSupportingDocument
        id={`${processId}|${parentId}`}
        module={`${TypeModule.MIP_REVIEW}|${TypeModule.MIP_REVIEW}`}
        process={`${TypeProcess.REVIEWER_DELST}|${TypeProcess.MIP_REVIEW}`}
      />

      <TableDraftMemoHistory
        process={TypeProcess.REVIEWER_DELST}
        module={TypeModule.MIP_REVIEW}
        buttons={button}
      />
    </ColumnWrapper>
  );
};

export default DraftMemo;
