'use client';
import useApp from '@/hooks/useApp';
import useViewOnly from '@/hooks/useViewOnly';

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
  const { handleOpenGenerateDraftModal } = useDraftMemo();
  const [state] = useApp();
  const { viewOnly } = useViewOnly();

  const button: DraftMemoButtonProps[] = [{
    color: 'info',
    disabled: viewOnly,
    label: 'Generate Draft Memo',
    onClick: handleOpenGenerateDraftModal,
    variant: 'contained',
  }];

  return (
    <ColumnWrapper sx={{ gap: 3 }}>
      <ConfirmationLatest />
      <Title title="Pilih Lampiran Memo" />

      <TableDraftMemoDigital
        module={state.pages.module}
        process={state.pages.process}
      />

      <TableDraftMemoFinancingDocument
        module={state.pages.module}
        process={state.pages.process}
      />

      <TableDraftMemoSupportingDocument
        module={state.pages.module}
        process={state.pages.process}
      />

      <TableDraftMemoHistory
        module={state.pages.module}
        process={state.pages.process}
        buttons={viewOnly ? [] : button}
      />
    </ColumnWrapper>
  );
};

export default DraftMemoPage;
