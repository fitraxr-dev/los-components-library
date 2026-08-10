import React, { useContext, useEffect, useMemo, useState } from 'react';

import { useForm } from 'react-hook-form';

import { DirtyContext } from '@/contexts/DirtyContext';
import { ActivityType } from '@/enums/Activity';
import showNiceModalV2 from '@/helpers/showNiceModalV2';
import { convertToDocx } from '@/helpers/synfusion';
import useSaveCreditCheckingExternal from '@/hooks/services/mip/credit-checking/useSaveCreditCheckingExternal';
import useApp from '@/hooks/useApp';
import useAutoSaveDraft from '@/hooks/useAutoSaveDraft';
import useCustomRouter from '@/hooks/useCustomRouter';
import useIdentity from '@/hooks/useIdentity';
import useRecordLog from '@/hooks/useRecordLog';
import useViewOnly from '@/hooks/useViewOnly';

import { MIPContext } from '@/components/layouts/MIPLayout/MIP.context';
import Input from '@/components/shared/Input';

import { CreditCheckingContext } from '../../CreditCheckingResult.context';
import useGetDebtorExternalRating from '../../hooks/useGetDebtorExternalRating';


import type { InputProps } from '@/components/shared/Input/Input.types';
import type { TableHeader } from '@/components/shared/Table/Table.types';


const useDebtorHook = () => {
  const [state, _] = useApp();
  const router = useCustomRouter();
  const { processId } = useIdentity();
  const { goToNextStep } = useContext(MIPContext);
  const { recordActivity } = useRecordLog();
  const { viewOnly } = useViewOnly();
  const [container, setContainer] = useState(null);
  const [shouldGoNext, setShouldGoNext] = useState(false);

  const { activeTab, setActiveTab } = useContext(CreditCheckingContext);
  const { setDirtyMsg } = useContext(DirtyContext);

  const INITIAL_VALUES = {
    creditMarketCheckingCollectability: false,
    creditMarketCheckingReference: '',
    creditMarketCheckingRestructurisation: false,
    marketChecking: '',
    ratingDescription: '',
    ratingLongDescription: '',
    ratingResult: '',
  };

  const [externalRating, setExternalRating] = useState(INITIAL_VALUES);
  const [contents, setContents] = useState([{
    id: 'creditMarketCheckingCollectability',
    statusLabel: null,
    title: 'Apakah Customer masuk credit checking dengan kolektibilitas 1',
  }, {
    id: 'creditMarketCheckingRestructurisation',
    statusLabel: null,
    title: 'Apakah grup/afiliasi atau Customer pernah restrukturisasi di bank/lembaga keuangan nonbank?',
  }]);

  const {
    data: externalData,
    isSuccess,
    isFetching,
  } = useGetDebtorExternalRating({
    bucketProcessId: processId as string,
    module: state.pages.mipModule,
    process: state.pages.mipProcess,
  });

  const { isPending: isSaveLoading, mutate } = useSaveCreditCheckingExternal({
    onError: () => {
      showNiceModalV2({ type: 'error' });
    },
    onSuccess: (data) => {

      recordActivity({
        activity: ActivityType.SAVE,
        bucketProcessId: String(processId),
        changeAfter: JSON.stringify(data),
        changeBefore: JSON.stringify(externalData),
        menuCode: 'mip',
        module: state.pages?.mipModule,
        process: state.pages?.mipProcess,
        remarks: `save detail credit checking customer from module ${state.pages?.mipModule}`,
      });
      showNiceModalV2({ type: 'success' });
      setDirtyMsg(undefined);
      if (shouldGoNext) {
        setShouldGoNext(false);
        setActiveTab(1);
        return;
      }
    },
  });

  useEffect(() => {
    if (isSuccess && externalData) {
      setExternalRating({
        creditMarketCheckingCollectability: externalData.creditMarketCheckingCollectability,
        creditMarketCheckingReference: externalData.creditMarketCheckingReference,
        creditMarketCheckingRestructurisation: externalData.creditMarketCheckingRestructurisation,
        marketChecking: externalData.description,
        ratingDescription: externalData.ratingDescription,
        ratingLongDescription: externalData.ratingLongDescription,
        ratingResult: externalData.ratingResult,
      });
      setContents((prevContents) =>
        prevContents.map((item) => ({
          ...item,
          statusLabel: externalData[item.id],
        }))
      );
    }
  }, [externalData, isSuccess]);

  useEffect(() => {
    reset(externalRating);
  }, [externalRating]);

  const {
    control,
    reset,
    watch,
    setValue,
    handleSubmit: handleSubmitForm,
    formState: { isDirty },
  } = useForm({
    defaultValues: externalRating,
    mode: 'onChange',
  });

  useEffect(() => {
    if (isDirty) {
      setDirtyMsg('Apakah Anda yakin ingin meninggalkan halaman ini? Perubahan yang Anda buat tidak akan disimpan.');
    } else {
      setDirtyMsg(undefined);
    }
  }, [router]);

  const tableHeaderDebtor: Array<TableHeader> = [
    {
      key: 'index',
      label: 'No',
      type: 'index',
    },
    {
      key: 'title',
      label: 'Credit Checking Verifikasi',
    },
    {
      key: 'value',
      render: (data) => {
        return React.createElement(
          Input,
          {
            disabled: viewOnly,
            label: null,
            onChange: (e) => {
              setValue(data.id, e.target.value);
            },
            radioList: [
              {
                label: 'Ya',
                value: true,
              },
              {
                label: 'Tidak',
                value: false,
              },
            ],
            sx: { flex: 1 },
            type: 'radio',
            value: watch(data.id),
          } as InputProps
        );
      },
    },
  ];

  const handleSave = async (data) => {
    const description = await convertToDocx(container);

    if (viewOnly) {
      setActiveTab(1);
    } else {
      mutate({
        bucketProcessId: processId as string,
        description,
        module: state.pages.mipModule,
        process: state.pages.mipProcess,
        ...data,
      });
    }
  };

  const watchedValues = watch();
  const autoSavePayload = useMemo(() => async () => {
    const description = container ? await convertToDocx(container) : null;
    return {
      bucketProcessId: processId as string,
      description,
      module: state.pages.mipModule,
      process: state.pages.mipProcess,
      ...watchedValues,
    };
  }, [container, processId, state.pages.mipModule, state.pages.mipProcess, watchedValues]);

  const { isFetching: isAutoSaveFetching } = useAutoSaveDraft({
    config: {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    },
    isActive: activeTab === 0 && !viewOnly,
    payload: autoSavePayload,
    url: 'mip.creditChecking.creditCheckingExternalSave',
  });

  return {
    container,
    contents,
    control,
    externalRating,
    handleSave,
    handleSubmitForm,
    isAutoSaveFetching,
    isFetching,
    isSaveLoading,
    setContainer,
    setShouldGoNext,
    tableHeaderDebtor,
    viewOnly,
  };
};
export default useDebtorHook;
