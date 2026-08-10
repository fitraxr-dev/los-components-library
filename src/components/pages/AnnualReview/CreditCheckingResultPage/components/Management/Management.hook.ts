import { useContext, useEffect, useMemo, useState } from 'react';

import NiceModal from '@ebay/nice-modal-react';
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

import { CreditCheckingContext } from '../../CreditCheckingResult.context';

import useGetManagementList from './hooks/useGetManagementList';
import useGetManagementRemark from './hooks/useGetManagementRemark';
import useSaveManagementRemark from './hooks/useSaveManagementRemark';
import { modal, tableHeaderList } from './Management.constants';

import type { TableHeader } from '@/components/shared/Table/Table.types';


export const useManagement = () => {
  const { processId } = useIdentity();
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
  }, [router]);

  const {
    data: managementListData,
    isLoading: isManagementListLoading,
    isSuccess: isManagementListSuccess,
  } = useGetManagementList({
    bucketProcessId: processId,
  }, {
    enabled: activeTab === 2,
    staleTime: ONE_MINUTE,
  });

  const tableData = isManagementListSuccess ? managementListData?.map((data) => ({
    ...data,
    collectability: data.collectabilityLabel ?? '-',
    googleResult: data.googleResult ?? '-',
    name: data.name ?? '-',
    note: data.note ?? '-',
    npwp: data.npwp ?? '-',
    referenceCode: data.managementCode,
    resultReporting: data.resultReporting ?? '-',
  })) : [];

  const {
    data: managementRemark,
  } = useGetManagementRemark({
    bucketProcessId: processId,
    module: TypeModule.ANNUAL_REVIEW,
    process: TypeProcess.ANNUAL_REVIEW,
  }, {
    enabled: activeTab === 2,
    staleTime: ONE_MINUTE,
  });

  useEffect(() => {
    if (managementRemark?.remark) {
      reset({
        remark: managementRemark?.remark ?? '',
      });
    }

  }, [managementRemark?.remark]);

  const { isPending: isSaveLoading, mutate } = useSaveManagementRemark({
    onError: () => {
      showNiceModalV2({
        type: 'error',
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bucket-stepper']});
      queryClient.invalidateQueries({ queryKey: ['mns-management-remark']});
      showNiceModalV2({ type: 'success' });
      setDirtyMsg(undefined);
      if (shouldGoNext) {
        setShouldGoNext(false);
        setActiveTab(3);
        return;
      }
    },
  });

  const handleSubmit = (data: any) => {
    if (viewOnly) {
      setActiveTab(3);
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
    NiceModal.show(modal.MODAL_MANAGEMENT_DETAIL, { bucketProcessId, referenceCode, summaryId });
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
    isActive: activeTab === 2 && !viewOnly,
    payload: autoSavePayload,
    url: 'mip.creditChecking.creditCheckingManagementRemarkSave',
  });

  return {
    control,
    handleSubmit,
    handleSubmitForm,
    isAutoSaveFetching,
    isManagementListLoading,
    isSaveLoading,
    setShouldGoNext,
    state,
    tableData,
    tableHeader,
    viewOnly,
  };
};
