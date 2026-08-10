import { useContext, useEffect, useState } from 'react';


import { useQueryClient } from '@tanstack/react-query';

import { DirtyContext } from '@/contexts/DirtyContext';
import { ActivityType } from '@/enums/Activity';
import { TypeModule } from '@/enums/Module';
import showNiceModalV2 from '@/helpers/showNiceModalV2';
import useGetParameterList from '@/hooks/services/useGetParameterList';
import useApp from '@/hooks/useApp';
import useIdentity from '@/hooks/useIdentity';
import useRecordLog from '@/hooks/useRecordLog';
import useViewOnly from '@/hooks/useViewOnly';

import {
  useTechnicalStudyReviewContext,
} from '@/components/layouts/TechnicalStudyReviewLayout/TechnicalStudyReview.context';

import useConfirmationLatest from '../components/ConfirmationLatest/ConfirmationLatest.hook';

import useGetTechnicalReview from './hooks/useGetTechnicalReview';
import useSaveTechnicalReview from './hooks/useSaveTechnicalReview';

import type { SaveDto } from './hooks/useSaveTechnicalReview';


export const useTechnicalReview = () => {
  const { processId } = useIdentity();
  const { recordActivity } = useRecordLog();
  const [type, setType] = useState('');
  const [notes, setNotes] = useState('');
  const [options, setOptions] = useState('');
  const [shouldGoNext, setShouldGoNext] = useState(false);
  const { goToNextStep } = useTechnicalStudyReviewContext();
  const { setDirtyMsg } = useContext(DirtyContext);
  const [state] = useApp();
  const { viewOnly } = useViewOnly();
  const isKadivDelst = state.currentRole?.includes('KADIV') && state.currentPosition?.includes('SPECIALIST');
  const [lastSavedPayload, setLastSavedPayload] = useState<any>(null);

  const { data: typeSubmissionData } = useGetParameterList('typeSubmission');

  const { differencesData, hasBusinessUpdate, previousData } = useConfirmationLatest();

  const {
    data: technicalReviewDetail,
    isFetching: isFetchingLoading,
    isSuccess: isFetchRequestDetailSuccess } = useGetTechnicalReview({
    bucketProcessId: processId,
  });

  // Record activity when technical review detail is loaded
  useEffect(() => {
    if (technicalReviewDetail) {
      recordActivity({
        activity: ActivityType.VIEW,
        bucketProcessId: processId || '',
        changeAfter: '',
        changeBefore: '',
        menuCode: 'technical-study-review',
        module: state.pages.module,
        process: state.pages.process,
        remarks: 'view technical review page',
      });
    }
  }, [technicalReviewDetail, processId, state.pages.module, state.pages.process, recordActivity]);

  const queryClient = useQueryClient();

  // Save Request / Result
  const { mutate: saveTechnicalReview } = useSaveTechnicalReview({
    onSuccess: () => {
      // Record activity for saving technical review
      recordActivity({
        activity: ActivityType.SAVE,
        bucketProcessId: processId || '',
        changeAfter: JSON.stringify({
          additionalInformation: 'updated',
          notes: lastSavedPayload?.notes,
          type: lastSavedPayload?.type,
        }),
        changeBefore: JSON.stringify({
          notes: technicalReviewDetail?.notes,
          type: technicalReviewDetail?.submissionType,
        }),
        menuCode: 'technical-study-review',
        module: state.pages.module,
        process: state.pages.process,
        remarks: 'successfully saved technical review data',
      });

      showNiceModalV2({ onClose() {
        queryClient.invalidateQueries({ queryKey: ['bucket-stepper', { bucketProcessId: processId }]});
        queryClient.invalidateQueries({ queryKey: [
          'technical-review',
          {
            'bucketProcessId': processId,
            'module': TypeModule.TECHNICAL_REVIEW,
            process,
          }
        ]});
        setDirtyMsg(undefined);

        shouldGoNext ? goToNextStep() : null;
      }, title: 'Data Berhasil Di simpan', type: 'success' });
    },
  });

  useEffect(() => {
    if (isFetchRequestDetailSuccess) {
      if (technicalReviewDetail?.notes?.length > 0) {
        setNotes(technicalReviewDetail.notes);
      }
      if (technicalReviewDetail?.submissionType?.length > 0) {
        setType(technicalReviewDetail.submissionType);
      }
    }
  }, [technicalReviewDetail, isFetchRequestDetailSuccess]);

  const changeBgInput = (inputKey: string) => {
    let color = '#FFFFFF';
    if (differencesData?.[inputKey]) {
      color = '#FCE6E8';
    }
    return color;
  };

  const findDataMaster = (inputKey: string) => {
    let label = '';
    // Always show business data
    if (differencesData?.[inputKey]?.business !== undefined) {
      label = differencesData[inputKey].business;
    }

    // Map submission type values to Indonesian
    if (inputKey === 'submissionType') {
      const submissionTypeMapping = {
        'IMMEDIATE': 'Sangat Segera',
        'NORMAL': 'Biasa',
        'QUICK': 'Segera',
      };
      return submissionTypeMapping[label] || label;
    }

    return label;
  };

  const getDataLabel = () => {
    return 'Data Sebelumnya';
  };

  const needCheckMaster = differencesData && Object.keys(differencesData).length > 0;

  const getInitialValueWithPreviousData = () => {
    let initialValue = technicalReviewDetail?.additionalInformation || '';

    if (needCheckMaster && findDataMaster('additionalInformation')) {
      const previousDataText = `${getDataLabel()}: ${findDataMaster('additionalInformation') || '-'}`;
      // Add previous data at the end of the document
      if (initialValue) {
        initialValue += `\n\n--- ${previousDataText} ---`;
      } else {
        initialValue = `--- ${previousDataText} ---`;
      }
    }

    return initialValue;
  };

  const handleSave = (blob) => {
    const payload: SaveDto = {
      additionalInformation: blob,
      bucketProcessId: processId,
      module: state.pages.module,
      notes: notes,
      process: state.pages.process,
      type: type,
    };
    if (viewOnly) {
      goToNextStep();
    } else {
      setLastSavedPayload(payload);
      saveTechnicalReview(payload);
    }
  };

  return {
    changeBgInput,
    findDataMaster,
    getDataLabel,
    getInitialValueWithPreviousData,
    handleSave,
    isFetchingLoading,
    isKadivDelst,
    needCheckMaster,
    notes,
    options,
    setNotes,
    setOptions,
    setShouldGoNext,
    setType,
    technicalReviewDetail,
    type,
    typeSubmissionData,
  };

};
