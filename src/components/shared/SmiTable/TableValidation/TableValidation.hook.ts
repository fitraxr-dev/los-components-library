import { useState } from 'react';

import NiceModal from '@ebay/nice-modal-react';
import { useParams } from 'next/navigation';

import { MODAL } from '@/configs/constants/modalId';
import { ActivityType } from '@/enums/Activity';
import useIdentity from '@/hooks/useIdentity';
import useRecordLog from '@/hooks/useRecordLog';

import useGetTimelineByProcessId from './hooks/useGetTimelineByProcessId';


export const useValidation = (props: SmiComponentProps) => {

  const { module, process, id } = props;
  const { processId, bucketProcessId } = useIdentity();
  const [noPage, setNoPage] = useState(1);
  const [itemPerPage, setItemPerPage] = useState(5);
  const { recordActivity } = useRecordLog();

  const { data, isPending: isLoading } = useGetTimelineByProcessId({
    filter: {
      bucketProcessId: String(id ?? processId ?? bucketProcessId),
      module,
      process,
    },
    page: {
      itemPerPage,
      noPage,
    },
  });

  const validationList = data?.contents;
  const validationPage = data?.page;

  const handleOpenDetail = (data: { comment: string }) => {
    recordActivity({
      activity: ActivityType.PREVIEW,
      bucketProcessId: String(id ?? processId ?? bucketProcessId),
      module: props.module,
      process: props.process,
      remarks: 'view comment detail in validation',
    });
    NiceModal.show(MODAL.GLOBAL.COMMENT, {
      initialComment: data.comment ?? '-',
      viewOnly: true,
    });
  };

  return {
    handleOpenDetail,
    isLoading,
    noPage,
    setItemPerPage,
    setNoPage,
    validationList,
    validationPage,
  };
};
