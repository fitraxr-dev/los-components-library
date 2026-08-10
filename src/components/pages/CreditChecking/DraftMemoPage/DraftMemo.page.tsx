'use client';
import { TypeModule, TypeProcess } from '@/enums/Module';
import useViewOnly from '@/hooks/useViewOnly';

import { useCreditCheckingContext } from '@/components/layouts/CreditCheckingLayout/CreditChecking.context';
import ColumnWrapper from '@/components/shared/ColumnWrapper';
import TableDraftMemoDigital from '@/components/shared/SmiTable/DraftMemo/TableDraftMemoDigital';
import TableDraftMemoFinancingDocument from '@/components/shared/SmiTable/DraftMemo/TableDraftMemoFinancingDocument';
import TableDraftMemoHistory from '@/components/shared/SmiTable/DraftMemo/TableDraftMemoHistory';
import TableDraftMemoSupportingDocument from '@/components/shared/SmiTable/DraftMemo/TableDraftMemoSupportingDocument';
import TableDebtorInformation from '@/components/shared/SmiTable/TableDebtorInformation';
import Title from '@/components/shared/Title';

import ConfirmationLatest from '../components/ConfirmationLatest/ConfirmationLatest';

import useDraftMemo from './DraftMemo.hook';

import type {
  DraftMemoButtonProps,
} from '@/components/shared/SmiTable/DraftMemo/TableDraftMemoHistory/TableDraftMemoHistory.types';


const DraftMemoPage = () => {
  const { viewOnly } = useViewOnly();
  const { isStaffCCDpop, isRequestModule } = useCreditCheckingContext();
  const { handleOpenGenerateDraftModal } = useDraftMemo();

  const button: DraftMemoButtonProps[] = [{
    color: 'info',
    disabled: viewOnly,
    label: 'Generate Draft Memo',
    onClick: handleOpenGenerateDraftModal,
    variant: 'contained',
  }];

  const process = isRequestModule ? TypeProcess.CREDIT_CHECKING : TypeProcess.CREDIT_CHECKING_DPOP;

  return (
    <ColumnWrapper sx={{ gap: 3 }}>
      <ConfirmationLatest />
      <Title title="Piih Lampiran Memo" />
      <TableDebtorInformation
        module={TypeModule.CREDIT_CHECKING}
        process={process}
      />
      <TableDraftMemoDigital
        module={TypeModule.CREDIT_CHECKING}
        process={process}
      />

      <TableDraftMemoFinancingDocument
        module={TypeModule.CREDIT_CHECKING}
        process={process}
      />

      <TableDraftMemoSupportingDocument
        module={TypeModule.CREDIT_CHECKING}
        process={process}
      />

      <TableDraftMemoHistory
        module={TypeModule.CREDIT_CHECKING}
        process={process}
        buttons={!isStaffCCDpop ? button : []}
      />
    </ColumnWrapper>
  );
};

export default DraftMemoPage;
