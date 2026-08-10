import { useContext, useEffect, useMemo, useState } from 'react';

import NiceModal from '@ebay/nice-modal-react';
import { useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';

import { DirtyContext } from '@/contexts/DirtyContext';
import { TypeModule, TypeProcess } from '@/enums/Module';
import showNiceModalV2 from '@/helpers/showNiceModalV2';
import useApp from '@/hooks/useApp';
import useAutoSaveDraft from '@/hooks/useAutoSaveDraft';
import useCustomRouter from '@/hooks/useCustomRouter';
import useIdentity from '@/hooks/useIdentity';
import useViewOnly from '@/hooks/useViewOnly';

import { useAnnualReviewContext } from '@/components/layouts/AnnualReviewLayout/AnnualReview.context';

import { CreditCheckingContext } from '../../CreditCheckingResult.context';
import useGetOtherRelatedRemark from '../OtherRelated/hooks/useGetOtherRelatedRemark';
import useSaveOtherRelatedRemark from '../OtherRelated/hooks/useSaveOtherRelatedRemark';

import useGetOtherRelatedList from './hooks/useGetOtherRelatedList';
import { modal, tableHeaderList } from './OtherRelated.constants';

import type { TableHeader } from '@/components/shared/Table/Table.types';


const useOtherRelated = () => {
  const [state] = useApp();
  const { viewOnly } = useViewOnly();
  const { processId } = useIdentity();
  const { goToNextStep } = useAnnualReviewContext();
  const [shouldGoNext, setShouldGoNext] = useState(false);
  const { setDirtyMsg } = useContext(DirtyContext);
  const router = useCustomRouter();
  const queryClient = useQueryClient();
  const { activeTab, setActiveTab } = useContext(CreditCheckingContext);


  const { control, reset, handleSubmit: handleSubmitForm, getValues, formState: { isDirty } } = useForm({
    defaultValues: {
      remark: '',
    },
    mode: 'onChange',
  });

  useEffect(() => {
    if (isDirty) {
      setDirtyMsg('Apakah Anda yakin ingin meninggalkan halaman ini? Perubahan yang Anda buat tidak akan disimpan.');
    } else {
      setDirtyMsg(undefined);
    }
  }, [router]);

  const { data, isLoading, isSuccess } = useGetOtherRelatedList({
    bucketProcessId: processId,
  });

  const tableData = isSuccess ? data?.map((item) => ({
    ...item,
    collectibility: item.collectabilityLabel ?? '-',
    googleResult: item.googleResult ?? '-',
    name: item.name ?? '-',
    note: item.note ?? '-',
    npwp: item.npwp ?? '-',
    referenceCode: item.otherRelatedCode,
    resultReporting: item.resultReporting ?? '-',
    type: item.typeLabel ?? '-',
  })) : [];

  const {
    data: otherRelatedRemarkData,
  } = useGetOtherRelatedRemark({
    bucketProcessId: processId as string,
    module: TypeModule.ANNUAL_REVIEW,
    process: TypeProcess.ANNUAL_REVIEW,
  });

  useEffect(() => {
    if (otherRelatedRemarkData?.remark) {
      reset({
        remark: otherRelatedRemarkData?.remark ?? '',
      });
    }

  }, [otherRelatedRemarkData?.remark]);

  const { isPending: isSaveLoading, mutate } = useSaveOtherRelatedRemark({
    onError: () => {
      showNiceModalV2({ type: 'error' });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bucket-stepper', { bucketProcessId: processId }]});
      queryClient.invalidateQueries({ queryKey: ['mns-other-related-remark']});
      showNiceModalV2({ type: 'success' });
      setDirtyMsg(undefined);
      shouldGoNext ? goToNextStep() : null;
    },
  });

  const handleSubmit = (data) => {
    if (viewOnly) {
      goToNextStep();
    } else {
      mutate({
        bucketProcessId: processId,
        module: TypeModule.ANNUAL_REVIEW,
        process: TypeProcess.ANNUAL_REVIEW,
        remark: data.remark,
      });
    }
  };

  const handleOpenDetail = (bucketProcessId: string, referenceCode: string, summaryId: number | null) => {
    NiceModal.show(modal.MODAL_OTHER_RELATION_DETAIL, { bucketProcessId, referenceCode, summaryId });
  };

  const tableHeader: Array<TableHeader> = [
    ...tableHeaderList,
    {
      key: 'action',
      label: 'Action',
      options: [
        {
          iconName: 'detail',
          onClick: (row) => handleOpenDetail(row.bucketProcessId, row.referenceCode, row.summaryId),
        },
        // TODO: Commented until the requirements are completed - Albert - 12/12/2024
        // UPDATE: Added but without any function until API is completed - M. Adi P. - 10/29/2025
        // { iconName: 'preview-document',
        //   onClick: (data) => window.open((`${data?.document}?preview=true`), '_blank', 'noopener,noreferrer'),
        // },
        // {
        //   iconName: 'download',
        //   onClick: (data) => handleDownload(data?.id, data?.fileName),
        // }
      ],
      type: 'action',
    }
  ];

  const autoSavePayload = useMemo(() => () => {
    const currentRemark = getValues('remark');

    if (!processId) return Promise.resolve(null);

    return Promise.resolve({
      bucketProcessId: processId,
      module: TypeModule.ANNUAL_REVIEW,
      process: TypeProcess.ANNUAL_REVIEW,
      remark: currentRemark,
    });
  }, [processId, getValues]);

  const { isFetching: isAutoSaveFetching } = useAutoSaveDraft({
    isActive: activeTab === 3 && !viewOnly,
    payload: autoSavePayload,
    url: 'mip.otherRelated.save',
  });

  return {
    control,
    handleSubmit,
    handleSubmitForm,
    isAutoSaveFetching,
    isLoading,
    isSaveLoading,
    setShouldGoNext,
    tableData,
    tableHeader,
    viewOnly,
  };
};

export default useOtherRelated;
