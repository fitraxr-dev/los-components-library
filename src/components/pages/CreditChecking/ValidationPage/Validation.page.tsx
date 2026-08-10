'use client';

import { TypeModule, TypeProcess } from '@/enums/Module';

import { useCreditCheckingContext } from '@/components/layouts/CreditCheckingLayout/CreditChecking.context';
import ColumnWrapper from '@/components/shared/ColumnWrapper';
import TableValidation from '@/components/shared/SmiTable/TableValidation';

import ConfirmationLatest from '../components/ConfirmationLatest/ConfirmationLatest';


const ValidationPage = () => {
  const { isRequestModule } = useCreditCheckingContext();
  const process = isRequestModule ? TypeProcess.CREDIT_CHECKING : TypeProcess.CREDIT_CHECKING_DPOP;

  return (
    <ColumnWrapper sx={{ gap: 3 }}>
      <ConfirmationLatest />
      <TableValidation
        module={TypeModule.CREDIT_CHECKING}
        process={process}
      />
    </ColumnWrapper>
  );
};

export default ValidationPage;
