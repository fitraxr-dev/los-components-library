'use client';

import { TypeModule, TypeProcess } from '@/enums/Module';
import useApp from '@/hooks/useApp';

import ColumnWrapper from '@/components/shared/ColumnWrapper';
import TableValidation from '@/components/shared/SmiTable/TableValidation';

import ConfirmationLatest from '../components/ConfirmationLatest/ConfirmationLatest';


const ValidationPage = () => {
  const [state] = useApp();

  return (
    <ColumnWrapper sx={{ gap: 3 }}>
      <ConfirmationLatest />
      <TableValidation
        module={state.pages.module}
        process={state.pages.process}
      />
    </ColumnWrapper>
  );
};

export default ValidationPage;
