'use client';
import { useEffect } from 'react';

import { DPOP_DIVISION } from '@/configs/constants';
import { ActivityType } from '@/enums/Activity';
import { TypeModule, TypeProcess } from '@/enums/Module';
import useDivision from '@/hooks/useDivision';
import useIdentity from '@/hooks/useIdentity';
import useRecordLog from '@/hooks/useRecordLog';

import { useLpsBastContext } from '@/components/layouts/LpsLayoutBast/LpsLayoutBast.context';
import TableValidation from '@/components/shared/SmiTable/TableValidation';

import ConfirmationLatest from '../../components/ConfirmationLatest/ConfirmationLatest';


const ValidationPage = () => {
  const { isDivisiBisnis, isSuperAdmin } = useLpsBastContext();
  const { divisionCode } = useDivision();
  const isDpopDivision = divisionCode.includes(DPOP_DIVISION);
  const { processId } = useIdentity();
  const { recordActivity } = useRecordLog();

  const isLpsbd = processId?.toUpperCase().includes('LPSBD');
  const isBastDpop = (!isSuperAdmin && !isDivisiBisnis) || (isSuperAdmin && isLpsbd);

  const process = isBastDpop ? TypeProcess.LPS_BAST_DPOP : TypeProcess.LPS_BAST;

  useEffect(() => {
    recordActivity({
      activity: ActivityType.VIEW,
      bucketProcessId: processId,
      module: TypeModule.LPS,
      process,
      remarks: 'view validation page',
    });
  }, [processId, process, recordActivity]);

  return (
    <>
      {isDpopDivision && (
        <ConfirmationLatest />
      )}
      <TableValidation
        module={TypeModule.LPS}
        process={process}
      />
    </>
  );
};

export default ValidationPage;
