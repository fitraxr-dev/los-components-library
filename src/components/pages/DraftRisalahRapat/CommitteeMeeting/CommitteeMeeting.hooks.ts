import * as React from 'react';

import { MODAL } from '@/configs/constants/modalId';
import { ActivityType } from '@/enums/Activity';
import { TypeModule, TypeProcess } from '@/enums/Module';
import showNiceModalV2 from '@/helpers/showNiceModalV2';
import useGetParameterList from '@/hooks/services/useGetParameterList';
import useAutoSaveDraft from '@/hooks/useAutoSaveDraft';
import closeNiceModal from '@/hooks/useCloseNiceModal';
import useGoToNextStep from '@/hooks/useGoToNextStep';
import useIdentity from '@/hooks/useIdentity';
import useRecordLog from '@/hooks/useRecordLog';
import useViewOnly from '@/hooks/useViewOnly';

import useGetMeetingDetail from './hooks/useGetMeetingDetail';
import useGetMeetingMemberLeader from './hooks/useGetMeetingMemberLeader';
import useSaveCommitteMeeting from './hooks/useSaveCommitteMeeting';


const useCommitteeMeeting = (watchedValues?: any) => {
  const { processId } = useIdentity();
  const goToNextStep = useGoToNextStep();
  const { recordActivity } = useRecordLog();
  const { viewOnly } = useViewOnly();

  const { data: quorumOptions } = useGetParameterList('quorum');
  const { data: meetingMemberLeaderOptions } = useGetMeetingMemberLeader({
    bucketProcessId: processId,
    module: TypeModule.RISALAH_RAPAT,
    name: '',
    process: TypeProcess.RISALAH_RAPAT,
  }, {
    select: (raw) => raw?.contents?.map((item) => ({
      label: item.name,
      value: item.id,
    })),
  });

  const { data: meetingDetailData, isLoading: isGetMeetingDetailLoading } = useGetMeetingDetail({
    bucketProcessId: processId,
    module: TypeModule.RISALAH_RAPAT,
    process: TypeProcess.RISALAH_RAPAT,
  });

  const { mutate: saveCommitteMeeting, isPending: isSaveCommitteeMeetingLoading } = useSaveCommitteMeeting({
    onError: () => {
      showNiceModalV2({
        title: 'Terjadi kesalahan, silahkan dicoba kembali',
        type: 'error',
      });
    },
    onSuccess: (data) => {
      recordActivity({
        activity: ActivityType.SAVE,
        bucketProcessId: data?.bucketProcessId || '',
        changeAfter: JSON.stringify(data),
        changeBefore: JSON.stringify(meetingDetailData),
        menuCode: 'risalah-rapat',
        module: TypeModule.RISALAH_RAPAT,
        process: TypeProcess.RISALAH_RAPAT,
        remarks: 'Successfully Saved Risalah Rapat Committe Meeting',
      });
      closeNiceModal(MODAL.GLOBAL.COMMENT);
    },
  });

  const handleSave = React.useCallback((payload: any) => {
    saveCommitteMeeting({
      ...payload,
      bucketProcessId: processId,
      module: TypeModule.RISALAH_RAPAT,
      process: TypeProcess.RISALAH_RAPAT,
      schedule: payload.schedule ? new Date(payload.schedule).toISOString() : null,
      sector: meetingDetailData?.sector || null,
    }, {
      onSuccess: () => {
        showNiceModalV2({
          title: 'Berhasil menyimpan data Rapat Komite',
          type: 'success',
        });
      },
    });
  }, [saveCommitteMeeting]);

  const handleSaveAndNext = React.useCallback((payload: any) => {
    saveCommitteMeeting({
      ...payload,
      bucketProcessId: processId,
      module: TypeModule.RISALAH_RAPAT,
      process: TypeProcess.RISALAH_RAPAT,
      schedule: payload.schedule ? new Date(payload.schedule).toISOString() : null,
      sector: meetingDetailData?.sector || null,
    }, {
      onSuccess: () => {
        showNiceModalV2({
          onClose: () => goToNextStep(),
          title: 'Berhasil menyimpan data Rapat Komite',
          type: 'success',
        });
      },
    });
  }, [saveCommitteMeeting]);

  const autoSavePayload = React.useMemo(() => () => {
    if (!watchedValues) return Promise.resolve(null);

    return Promise.resolve({
      ...watchedValues,
      bucketProcessId: processId,
      module: TypeModule.RISALAH_RAPAT,
      process: TypeProcess.RISALAH_RAPAT,
      schedule: watchedValues.schedule ? new Date(watchedValues.schedule).toISOString() : null,
      sector: meetingDetailData?.sector || null,
    });
  }, [watchedValues, processId, meetingDetailData]);

  const { isFetching: isAutoSaveFetching } = useAutoSaveDraft({
    isActive: !viewOnly && !!meetingDetailData,
    payload: autoSavePayload,
    url: 'agreement.add.saveMeetInfo',
  });

  return {
    handleSave,
    handleSaveAndNext,
    isAutoSaveFetching,
    isLoading: isGetMeetingDetailLoading || isSaveCommitteeMeetingLoading,
    meetingDetailData,
    meetingMemberLeaderOptions,
    quorumOptions,
  };
};

export default useCommitteeMeeting;
