'use client';
import { TypeModule, TypeProcess } from '@/enums/Module';

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


const DraftMemoPage = () => {
  const { handleOpenGenerateDraftModal, process, viewOnly } = useDraftMemo();

  const button: DraftMemoButtonProps[] = [{
    color: 'info',
    disabled: viewOnly,
    label: 'Generate Draft Memo',
    onClick: handleOpenGenerateDraftModal,
    variant: 'contained',
  }];

  return (
    <ColumnWrapper>
      <ConfirmationLatest />
      <ColumnWrapper sx={{ gap: 3 }}>
        <Title title="Draft Memo" />

        <TableDraftMemoDigital
          module={TypeModule.APU_PPT}
          process={process}
        />

        <TableDraftMemoFinancingDocument
          module={TypeModule.APU_PPT}
          process={process}
        />

        <TableDraftMemoSupportingDocument
          module={TypeModule.APU_PPT}
          process={process}
        />

        <TableDraftMemoHistory
          process={process}
          module={TypeProcess.APU_PPT}
          buttons={button}
        />
      </ColumnWrapper>

    </ColumnWrapper>
  );
};

export default DraftMemoPage;
