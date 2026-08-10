'use client';
import { TypeModule, TypeProcess } from '@/enums/Module';

import ColumnWrapper from '@/components/shared/ColumnWrapper';
import TableValidation from '@/components/shared/SmiTable/TableValidation';

import ConfirmationLatest from '../components/ConfirmationLatest/ConfirmationLatest';
import useGetCurrentModule from '../hooks/useGetCurrentModule';


const ValidationPage = () => {
  const { module, process } = useGetCurrentModule();

  return (
    <ColumnWrapper sx={{ gap: 3 }}>
      <ConfirmationLatest />
      <TableValidation
        module={module}
        process={process}
      />
    </ColumnWrapper>
  );
};

export default ValidationPage;
