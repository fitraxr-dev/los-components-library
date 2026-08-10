'use client';
import { useContext, useEffect, useMemo, useState } from 'react';

import NiceModal from '@ebay/nice-modal-react';
import { useTheme } from '@mui/material';
import { useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';

import { ONE_MINUTE } from '@/configs/constants';
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

import useGetShareholderList from './hooks/useGetShareholderList';
import useGetCreditCheckingShareholderRemark from './hooks/useGetShareholderRemark';
import useSaveCreditCheckingShareholderRemark from './hooks/useSaveShareholderRemark';
import { modal, tableHeaderList } from './Shareholder.constants';

import type { TableHeader } from '@/components/shared/Table/Table.types';


export const useShareholder = () => {
  const { processId } = useIdentity();
  const theme = useTheme();
  const { viewOnly } = useViewOnly();
  const [state] = useApp();
  const { activeTab, setActiveTab } = useContext(CreditCheckingContext);
  const { setDirtyMsg } = useContext(DirtyContext);
  const router = useCustomRouter();
  const [shouldGoNext, setShouldGoNext] = useState(false);
  const queryClient = useQueryClient();

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
  }, [isDirty, setDirtyMsg]);

  const {
    data: shareholderListData,
    isSuccess: isShareholderListSuccess,
    isLoading: isShareholderListLoading,
  } = useGetShareholderList({
    filter: {
      bucketProcessId: processId,
      tableType: '',
    },
    page: {
      itemPerPage: 10,
      noPage: 1,
    },
  }, {
    enabled: activeTab === 1,
    staleTime: ONE_MINUTE,
  });

  const tableData = isShareholderListSuccess ? shareholderListData?.map((data) => ({
    ...data,
    collectibility: data.collectabilityLabel ?? '-',
    googleResult: data.googleResult ?? '-',
    note: data.note ?? '-',
    npwp: data.npwp ?? '-',
    referenceCode: data.shareholderCode,
    resultReporting: data.resultReporting ?? '-',
    type: data.typeLabel ?? '-',
  })) : [];

  const {
    data: shareholderRemark,
  } = useGetCreditCheckingShareholderRemark({
    bucketProcessId: processId,
    module: TypeModule.ANNUAL_REVIEW,
    process: TypeProcess.ANNUAL_REVIEW,
  });

  useEffect(() => {
    if (shareholderRemark?.remark) {
      reset({
        remark: shareholderRemark.remark ?? '',
      });
    }
  }, [shareholderRemark?.remark, reset]);

  const { isPending: isSaveLoading, mutate } = useSaveCreditCheckingShareholderRemark({
    onError: () => {
      showNiceModalV2({
        type: 'error',
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bucket-stepper']});
      queryClient.invalidateQueries({ queryKey: ['mns-shareholder-remark']});
      showNiceModalV2({ type: 'success' });
      setDirtyMsg(undefined);
      if (shouldGoNext) {
        setShouldGoNext(false);
        setActiveTab(2);
        return;
      }
    },
  });

  const handleSubmit = (data: any) => {
    if (viewOnly) {
      setActiveTab(2);
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
    NiceModal.show(modal.MODAL_SHAREHOLDER_DETAIL, { bucketProcessId, referenceCode, summaryId });
  };

  const tableHeader: TableHeader[] = [
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
        // { iconName: 'preview-document', onClick: (data) =>
        //   window.open((`${data?.document}?preview=true`), '_blank', 'noopener,noreferrer'),
        // },
        // {
        //   iconName: 'download',
        //   onClick: (row) => {},
        // }
      ],
      sx: {
        minWidth: '6vw',
      },
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
    isActive: activeTab === 1 && !viewOnly,
    payload: autoSavePayload,
    url: 'mip.shareholder.save',
  });

  return {
    control,
    handleSubmit,
    handleSubmitForm,
    isAutoSaveFetching,
    isSaveLoading,
    isShareholderListLoading,
    setShouldGoNext,
    tableData,
    tableHeader,
    theme,
  };
};
