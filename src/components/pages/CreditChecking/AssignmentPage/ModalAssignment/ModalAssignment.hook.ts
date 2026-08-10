import showNiceModalV2 from '@/helpers/showNiceModalV2';
import useSaveAssignPic from '@/hooks/services/useSaveAssignPic';
import closeNiceModal from '@/hooks/useCloseNiceModal';

import { MODAL_ASSIGN_CC } from '../Assignment.constants';

import type { ModalAssignProps } from './ModalAssignment.types';


const useModalAssign = (props: ModalAssignProps) => {
  const { selectedTask, setSelectedTask, module, process } = props;
  const { mutate: saveAssignment, isPending: isLoading } = useSaveAssignPic({
    onError: () => {
      showNiceModalV2({
        title: 'Assignment Error',
        type: 'error',
      });
    },
    onSuccess: () => {
      closeNiceModal(MODAL_ASSIGN_CC.ASSIGN_TO);
      showNiceModalV2({
        title: 'Assignment Success',
        type: 'success',
      });
      setSelectedTask([]);
    },
  });

  const tableDataSelectedTask = selectedTask.map((item) => ({
    ...item,
    id: item.bucketProcessId,
  }));

  const handleOnSave = (data) => {
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
