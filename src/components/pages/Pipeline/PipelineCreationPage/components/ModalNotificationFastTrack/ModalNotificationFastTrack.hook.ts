import { useMemo } from 'react';

import { useWatch } from 'react-hook-form';

import type { ModalNotificationFastTrackProps, NotificationFormValues } from './ModalNotificationFastTrack.types';
import type { Control } from 'react-hook-form';


type UseModalNotificationFastTrackProps = {
  control: Control<NotificationFormValues>;
  pipelineDetail: ModalNotificationFastTrackProps['pipelineDetail'];
  processId: string;
}

const useModalNotificationFastTrack = ({
  control,
  pipelineDetail,
  processId,
}: UseModalNotificationFastTrackProps) => {
  const depiStaff = useWatch({ control, name: 'depiStaff' });
  const dhStaff = useWatch({ control, name: 'dhStaff' });

  const tableDataSelectedPipeline = useMemo(() => ([
    {
      debtorName: pipelineDetail?.debtorName ?? '-',
      processId: processId ?? pipelineDetail?.bucketProcessId ?? '-',
      staffDivisionLabel: pipelineDetail?.staffDivisionLabel ?? '-',
      staffName: pipelineDetail?.staffName ?? '-',
    }
  ]), [pipelineDetail, processId]);

  // Kedua section wajib diisi minimal satu staff.
  const isSaveDisabled = !depiStaff?.length || !dhStaff?.length;

  return {
    isSaveDisabled,
    tableDataSelectedPipeline,
  };
};

export default useModalNotificationFastTrack;
