import { useContext, useEffect } from 'react';

import { TypeModule, TypeProcess } from '@/enums/Module';
import { formatDate } from '@/helpers/date';
import showNiceModalV2 from '@/helpers/showNiceModalV2';
import closeNiceModal from '@/hooks/useCloseNiceModal';

import { EligibilityReviewContext } from '@/components/layouts/EligibilityReviewLayout/EligibilityReview.context';

import useSaveReassignPic from '../../hooks/useSaveReassignPic';
import { MODAL } from '../../Monitoring.constants';

import { DATE_FORMAT } from './ModalReassign.constants';

import type { UseModalReassignProps } from './ModalReassign.types';
import type { PIC } from '../../Monitoring.types';


const useModalReassign = (props: UseModalReassignProps) => {
  const { selectedTask, append, setSelectedTask } = props;
  const modalId = MODAL.REASSIGN_TO;
  const [state, setState] = useContext(EligibilityReviewContext);

  function combinedArrays(array: Array<Array<PIC>>) {
    if (array.length === 0) return;

    let uniqueNames = new Set<string>();
    const combinedArray = [];

    array.forEach((subArray) => {
      subArray?.forEach((pic) => {
        if (!uniqueNames.has(pic.name)) {
          combinedArray.push(pic);
          uniqueNames.add(pic.name);
        }
      });
    });

    return combinedArray;
  };

  const { isPending: saveReassignLoading, mutate: saveReassign } = useSaveReassignPic({
    onError: () => {
      showNiceModalV2({
        title: 'Assignment Error',
        type: 'error',
      });
    },
    onSuccess: () => {
      showNiceModalV2({
        title: 'Assignment Success',
        type: 'success',
      });
      closeNiceModal(modalId);
      setSelectedTask([]);
    },
  });
  useEffect(() => {
    const newState = structuredClone(state);
    newState.selectedTask = selectedTask;
    setState(newState);
  }, []);


  const handleOnSave = (data) => {
    if (!data.picList) return;

    const payload = {
      module: TypeModule.SPFP,
      process: TypeProcess.SPDP,
      reAssign: [],
    };

    for (let task in state.selectedTask) {
      const picList = state.selectedTask[task].pic.map((pic) => {
        const picObjByPicId = data.picList.find((item) => {
          return item.picId === pic.reAssignTo.previousPicId;
        });
        const startDate = picObjByPicId?.reAssignTo.startDate;
        const endDate = picObjByPicId?.reAssignTo.endDate;

        return {
          endDate: endDate ? formatDate(endDate, DATE_FORMAT) : null,
          isLeader: picObjByPicId?.reAssignTo.isLeader,
          isPermanent: picObjByPicId?.reAssignTo.isPermanent,
          picId: pic.reAssignTo.id ?? null,
          previousPicId: pic.reAssignTo.previousPicId ?? null,
          startDate: startDate ? formatDate(startDate, DATE_FORMAT) : null,
        };
      });

      payload.reAssign.push({
        bucketProcessId: state.selectedTask[task].id,
        picList,
      });
    }

    saveReassign(payload);
  };

  const picList = combinedArrays(selectedTask.map((item) => item.pic));

  useEffect(() => {
    for (let pic of picList) {
      append(pic);
    }
  }, []);

  return {
    handleOnSave,
    picList,
    saveReassignLoading,
  };
};

export default useModalReassign;
