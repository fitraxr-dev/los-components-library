'use client';
import { useParams } from 'next/navigation';

import ColumnWrapper from '@/components/shared/ColumnWrapper';
import TableValidation from '@/components/shared/SmiTable/TableValidation';
import Title from '@/components/shared/Title';


const Validation = () => {
  const { groupId } = useParams<{ groupId: string }>();
  return (
    <TableValidation
      module="MG"
      process="MG"
      id={groupId}
    />
  );
};

export default Validation;
