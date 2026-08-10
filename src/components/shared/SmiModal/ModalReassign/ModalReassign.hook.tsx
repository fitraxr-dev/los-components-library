import { useEffect } from 'react';

import { useQueryClient } from '@tanstack/react-query';

import { MODAL } from '@/configs/constants/modalId';
import { ActivityType } from '@/enums/Activity';
import { formatDate } from '@/helpers/date';
import showNiceModalV2 from '@/helpers/showNiceModalV2';
import useSaveReassignPic from '@/hooks/services/useSaveReassignPic';
import closeNiceModal from '@/hooks/useCloseNiceModal';
import useRecordLog from '@/hooks/useRecordLog';

import useSaveReassigntMonitoring from '@/components/pages/Monitoring/ProcessMonitoring/ListPage/hooks/useSaveReassigntMonitoring';
import ColumnWrapper from '@/components/shared/ColumnWrapper';
import TextStyle from '@/components/shared/TextStyle';

import { DATE_FORMAT, tableHeaderSelectedTask } from './ModalReassign.constants';

import type { PIC, UseModalReassignProps } from './ModalReassign.types';
import type { TableHeader } from '../../Table/Table.types';


const useModalReassign = (props: UseModalReassignProps) => {
  const {
    selectedTask,
    append,
    setSelectedTask,
    module,
    process,
    selectedTaskReassign,
    setSelectedTaskReassign,
    isMonitoring,
    watchedPicList = [],
  } = props;
  const modalId = MODAL.REASSIGN_TO;
  const { recordActivity } = useRecordLog();
  const queryClient = useQueryClient();
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
  }

  const { isPending: saveReassignLoading, mutate: saveReassign } = useSaveReassignPic({
    onError: (error) => {
      const errorData = error?.response?.data || error;
      const errorDetail = errorData?.errorDetail || errorData?.errorDesc || error?.message || 'Assignment Error';

      recordActivity({
        activity: ActivityType.REASSIGN,
        bucketProcessId: selectedTask.map((task) => task.id).join(', '),
        module: module,
        process: process,
        remarks: `Failed to reassign PIC for ${selectedTask.length} task(s)`,
      });

      showNiceModalV2({
        title: errorDetail,
        type: 'error',
      });
    },
    onSuccess: (responseData) => {
      recordActivity({
        activity: ActivityType.REASSIGN,
        bucketProcessId: selectedTask.map((task) => task.id).join(', '),
        changeAfter: JSON.stringify({
          module,
          process,
          reassignedTasks: selectedTask.length,
          response: responseData,
        }),
        module: module,
        process: process,
        remarks: `Successfully reassigned PIC for ${selectedTask.length} task(s)`,
      });

      showNiceModalV2({
        title: 'Assignment Success',
        type: 'success',
      });
      closeNiceModal(modalId);
      setSelectedTask([]);
    },
  });

  const { mutate: reassignMent, isPending: loadingReassign } = useSaveReassigntMonitoring({
    onError: (error) => {
      const errorMessage = error?.message;
      showNiceModalV2({
        title: errorMessage,
        type: 'error',
      });
    },
    onSuccess: (data) => {
      recordActivity({
        activity: ActivityType.REASSIGN,
        bucketProcessId: selectedTask.map((task) => task.id).join(', '),
        changeAfter: JSON.stringify({
          reassignedTasks: selectedTask.length,
          response: data,
        }),
        remarks: `Successfully reassigned PIC for ${selectedTask.length} task(s)`,
      });
      showNiceModalV2({ title: 'Data berhasil disimpan', type: 'success' });
      queryClient.invalidateQueries({ queryKey: ['process-monitoring-list']});
      closeNiceModal(modalId);
      setSelectedTask([]);
    },
  });

  useEffect(() => {
    setSelectedTaskReassign(selectedTask);
  }, []);

  const handleOnSave = (data) => {
    if (!data.picList) return;


    recordActivity({
      activity: ActivityType.REASSIGN,
      bucketProcessId: selectedTask.map((task) => task.id).join(', '),
      changeBefore: JSON.stringify({
        previousState: 'Assigned',
        taskCount: selectedTask.length,
        taskIds: selectedTask.map((task) => task.id),
      }),
      remarks: `Initiating reassignment of ${selectedTask.length} task(s) to new PICs`,
    });

    if (isMonitoring) {
      const reAssignmentMap = new Map();
      selectedTask.forEach((task) => {
        const taskModule = task.module || module;
        const taskProcess = task.process || process;
        const key = `${taskModule}_${taskProcess}`;

        if (!reAssignmentMap.has(key)) {
          reAssignmentMap.set(key, {
            module: taskModule,
            process: taskProcess,
            reAssign: [],
          });
        }
        const picListForTask = [];
        const taskInReassign = selectedTaskReassign.find((t) => t.id === task.id);

        if (taskInReassign) {
          taskInReassign.pic.forEach((pic) => {
            const picObjByPicId = data.picList.find((item) => {
              return item.picId === pic.reAssignTo.previousPicId;
            });

            const startDate = picObjByPicId?.reAssignTo.startDate;
            const endDate = picObjByPicId?.reAssignTo.endDate;

            const newPicId = pic.reAssignTo?.id;
            const picId = newPicId ? Number(newPicId) : null;

            const previousPicId = picId !== null
              ? (pic.reAssignTo?.previousPicId ? Number(pic.reAssignTo.previousPicId) : null)
              : null;

            picListForTask.push({
              endDate: endDate ? formatDate(endDate, DATE_FORMAT) : null,
              isLeader: picObjByPicId?.reAssignTo.isLeader,
              isPermanent: picObjByPicId?.reAssignTo.isPermanent,
              picId: picId,
              previousPicId: previousPicId,
              startDate: startDate ? formatDate(startDate, DATE_FORMAT) : null,
            });
          });
        } else {
          if (watchedPicList && watchedPicList.length > 0) {
            watchedPicList.forEach((pic) => {
              const startDate = pic?.reAssignTo?.startDate;
              const endDate = pic?.reAssignTo?.endDate;

              const newPicId = pic?.selectedUser?.value;
              const picId = newPicId ? Number(newPicId) : null;

              const previousPicId = picId !== null
                ? (task?.pic?.[0]?.picId || task?.pic?.[0]?.id || null)
                : null;

              picListForTask.push({
                endDate: endDate ? formatDate(endDate, DATE_FORMAT) : null,
                isLeader: pic?.reAssignTo?.isLeader || false,
                isPermanent: pic?.reAssignTo?.isPermanent || true,
                picId: picId,
                previousPicId: previousPicId ? Number(previousPicId) : null,
                startDate: startDate ? formatDate(startDate, DATE_FORMAT) : null,
              });
            });
          } else if (data.picList && data.picList.length > 0) {
            const firstPic = data.picList[0];
            const startDate = firstPic?.reAssignTo?.startDate;
            const endDate = firstPic?.reAssignTo?.endDate;

            const newPicId = firstPic?.selectedUser?.value;
            const picId = newPicId ? Number(newPicId) : null;

            const previousPicId = picId !== null
              ? (task?.pic?.[0]?.picId || task?.pic?.[0]?.id || null)
              : null;

            picListForTask.push({
              endDate: endDate ? formatDate(endDate, DATE_FORMAT) : null,
              isLeader: firstPic?.reAssignTo?.isLeader || false,
              isPermanent: firstPic?.reAssignTo?.isPermanent || true,
              picId: picId,
              previousPicId: previousPicId ? Number(previousPicId) : null,
              startDate: startDate ? formatDate(startDate, DATE_FORMAT) : null,
            });
          }
        }

        reAssignmentMap.get(key).reAssign.push({
          bucketProcessId: task.id,
          picList: picListForTask,
        });
      });
      const reAssignmentList = Array.from(reAssignmentMap.values());

      const payload = {
        reAssignmentList: reAssignmentList,
      };
      reassignMent(payload);
    } else {

      const payload = {
        module,
        process,
        reAssign: [],
      };

      for (let task in selectedTaskReassign) {
        const picListForTask = selectedTaskReassign[task].pic.map((pic) => {
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
          bucketProcessId: selectedTaskReassign[task].id,
          picList: picListForTask,
        });
      }

      saveReassign(payload);
    }
  };

  const picList = combinedArrays(selectedTask.map((item) => item.pic)) || [];

  useEffect(() => {
    if (picList && picList.length > 0) {
      for (let pic of picList) {
        append(pic);
      }
    }
  }, []);

  const tableHeader: Array<TableHeader> = [
    ...tableHeaderSelectedTask,
    {
      key: 'pic',
      label: isMonitoring ? 'Nama Staff' : 'PIC ',
      render: (row, idx) => {
        return (
          <ColumnWrapper key={idx}>
            {row?.pic?.map((item, idx) => (
              <TextStyle
                key={idx}
                weight={item.isLeader ? 600 : 400}
              >
                {item.name || '-'}
              </TextStyle>
            ))}
          </ColumnWrapper>
        );
      },
      sx: {
        minWidth: '6vw',
      },
    },
    {
      key: 'reAssignTo',
      label: 'Re-assign to',
      render: (row) => {
        return (
          <ColumnWrapper alignItems="start">
            {row?.pic?.map((item, idx) => (
              <TextStyle key={idx}>
                {item.reAssignTo?.name || '-'}
              </TextStyle>
            ))}
          </ColumnWrapper>
        );
      },
      sx: {
        minWidth: '6vw',
      },
    }
  ];

  return {
    handleOnSave,
    picList,
    saveReassignLoading: isMonitoring ? loadingReassign : saveReassignLoading,
    tableHeader,
  };
};

export default useModalReassign;
