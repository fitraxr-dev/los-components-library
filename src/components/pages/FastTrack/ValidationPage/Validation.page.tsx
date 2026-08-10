'use client';

import { TypeModule, TypeProcess } from '@/enums/Module';

import { useFastTrackContext } from '@/components/layouts/FastTrackLayout/FastTrack.context';
import ColumnWrapper from '@/components/shared/ColumnWrapper';
import TableValidation from '@/components/shared/SmiTable/TableValidation';

import ConfirmationLatest from '../components/ConfirmationLatest/ConfirmationLatest';

import AuditTrailAccordion from './components/AuditTrailAccordion';


const ValidationPage = () => {
  const { isRequestModule } = useFastTrackContext();
  const process = TypeProcess.FAST_TRACK;

  return (
    <ColumnWrapper sx={{ gap: 3 }}>
      <ConfirmationLatest />
      <TableValidation
        module={TypeModule.FAST_TRACK}
        process={process}
      />
      <AuditTrailAccordion />
    </ColumnWrapper>
  );
};

export default ValidationPage;
