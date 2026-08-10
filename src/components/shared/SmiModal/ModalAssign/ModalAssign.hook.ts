import { useState } from 'react';

import { MODAL } from '@/configs/constants/modalId';
import { ActivityType } from '@/enums/Activity';
import showNiceModalV2 from '@/helpers/showNiceModalV2';
import useSaveAssignPic from '@/hooks/services/useSaveAssignPic';
import closeNiceModal from '@/hooks/useCloseNiceModal';
import useRecordLog from '@/hooks/useRecordLog';

import type { ModalAssignProps } from './ModalAssign.types';


const useModalAssign = (props: ModalAssignProps) => {
  const { selectedTask, setSelectedTask, module, process } = props;
  const [isLoading, setLoading] = useState(false);
  const { recordActivity } = useRecordLog();

  const { mutate: saveAssignment } = useSaveAssignPic({
    onError: (error) => {
      const errorData = error?.response?.data || error;
      const errorDetail = errorData?.errorDetail || errorData?.errorDesc || error?.message || 'Assignment Error';
      recordActivity({
        activity: ActivityType.ASSIGN,
        bucketProcessId: selectedTask.map((task) => task.bucketProcessId).join(', '),
        module: module,
        process: process,
        remarks: `Failed to assign PIC to ${selectedTask.length} task(s)`,
      });

      showNiceModalV2({
        title: errorDetail,
        type: 'error',
      });
    },
    onSuccess: (responseData) => {
      recordActivity({
        activity: ActivityType.ASSIGN,
        bucketProcessId: selectedTask.map((task) => task.bucketProcessId).join(', '),
        changeAfter: JSON.stringify({
          assignedTasks: selectedTask.length,
          module,
          process,
          response: responseData,
        }),
        module: module,
        process: process,
        remarks: `Successfully assigned PIC to ${selectedTask.length} task(s)`,
      });

      closeNiceModal(MODAL.ASSIGN_TO);
      showNiceModalV2({
        title: 'Assignment Success',
        type: 'success',
      });
      setSelectedTask([]);
      setLoading(false);
    },
  });

  const tableDataSelectedTask = selectedTask.map((item) => ({
    ...item,
    id: item.bucketProcessId,
  }));

  const handleOnSave = (data) => {
    recordActivity({
      activity: ActivityType.ASSIGN,
      bucketProcessId: selectedTask.map((task) => task.bucketProcessId).join(', '),
      changeBefore: JSON.stringify({
        previousState: 'Unassigned',
        taskCount: selectedTask.length,
        taskIds: selectedTask.map((task) => task.bucketProcessId),
      }),
      module: module,
      process: process,
      remarks: `Initiating assignment of ${selectedTask.length} task(s) to selected PICs`,
    });

    setLoading(true);
    saveAssignment({
      bucketProcessIdList: selectedTask.map((val) => val.bucketProcessId),
      module,
      picList: data.pic.map((val) => (
        {
          endDate: '',
          isLeader: val?.isLeaderPIC,
          isPermanent: true,
          picId: val?.picId,
          previousPicId: 0,
          startDate: '',
        }
      )),
      process,
    });
  };


  return {
    handleOnSave,
    isLoading,
    tableDataSelectedTask,
  };
};

export default useModalAssign;
