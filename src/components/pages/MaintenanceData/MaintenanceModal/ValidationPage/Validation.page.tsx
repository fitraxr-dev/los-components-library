'use client';
import { useEffect } from 'react';

import { useTheme } from '@mui/material';

import { ActivityType } from '@/enums/Activity';
import { TypeModule, TypeProcess } from '@/enums/Module';
import useIdentity from '@/hooks/useIdentity';
import useRecordLog from '@/hooks/useRecordLog';

import ColumnWrapper from '@/components/shared/ColumnWrapper';
import TableValidation from '@/components/shared/SmiTable/TableValidation';


const Validation = () => {
  const theme = useTheme();
  const { processId } = useIdentity();

  const { recordActivity } = useRecordLog();

  useEffect(() => {
    recordActivity({
      activity: ActivityType.INITIAL_PAGE,
      bucketProcessId: processId,
      changeAfter: '',
      changeBefore: '',
      menuCode: 'maintenance-data-modal-validation',
      module: TypeModule.MAINTENANCE_DATA,
      process: TypeProcess.MAINTENANCE_CAPITAL,
      remarks: 'view maintenance data modal validation page',
    });
  }, [recordActivity, processId]);

  return (
    <ColumnWrapper gap={theme.spacing(3)}>
      <TableValidation
        module={TypeModule.MAINTENANCE_DATA}
        process={TypeProcess.MAINTENANCE_CAPITAL}
        id={processId}
      />
    </ColumnWrapper>
  );
};

export default Validation;
