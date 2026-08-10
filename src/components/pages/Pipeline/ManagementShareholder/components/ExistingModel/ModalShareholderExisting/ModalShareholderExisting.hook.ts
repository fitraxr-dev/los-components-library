import { useEffect, useMemo } from 'react';

import { useModal } from '@ebay/nice-modal-react';
import { yupResolver } from '@hookform/resolvers/yup';
import { useTheme } from '@mui/material';
import { useForm } from 'react-hook-form';

import { ActivityType } from '@/enums/Activity';
import { TypeModule, TypeProcess } from '@/enums/Module';
import Modules from '@/enums/Modules';
import showNiceModalV2 from '@/helpers/showNiceModalV2';
import { formatNumber } from '@/helpers/utils';
import useGetParameterList from '@/hooks/services/useGetParameterList';
import useAutoSaveDraft from '@/hooks/useAutoSaveDraft';
import closeNiceModal from '@/hooks/useCloseNiceModal';
import useIdentity from '@/hooks/useIdentity';
import useRecordLog from '@/hooks/useRecordLog';


import useGetShareholderById from '../../../hooks/useGetShareholderById';
import useSaveShareholder from '../../../hooks/useSaveShareholder';
import { modalData } from '../../../ManagementShareholder.constants';

import { validationSchema } from './ModalShareholderExisting.constants';

import type { ModalShareholderExistingProps } from './ModalShareholderExisting.type';


const useModalShareholderExisting = (props: ModalShareholderExistingProps) => {
  const { processId } = useIdentity();
  const { recordActivity } = useRecordLog();
  const theme = useTheme();
  const modalId = modalData.MODAL_SHAREHOLDER_EXISTING;
  const modal = useModal(modalId);
  const { isPending: isSaveLoading, mutate } = useSaveShareholder({
    onError: (error: any) => {
      const errorMessage = error?.response?.data?.data || 'Gagal Menambahkan Shareholder';
      showNiceModalV2({ title: errorMessage, type: 'error' });
    },
    onSuccess: () => {
      closeNiceModal(modalId).then(() => {
        showNiceModalV2({ title: 'Berhasil Menambahkan Shareholder', type: 'success' });
      });
    },
  });

  const { data } = useGetShareholderById({
    bucketProcessId: processId,
    module: TypeModule.PIPELINE,
    process: TypeProcess.PIPELINE,
    shareholderCode: props.shareholderCode,
  }, { enabled: props.shareholderCode !== undefined });

  // Record activity when shareholder detail is loaded
  useEffect(() => {
    if (data) {
      recordActivity({
        activity: ActivityType.VIEW,
        bucketProcessId: processId || '',
        changeAfter: '',
        changeBefore: '',
        menuCode: 'pipeline',
        module: TypeModule.PIPELINE,
        process: TypeProcess.PIPELINE,
        remarks: 'view shareholder in existing model',
      });
    }
  }, [data, processId, recordActivity]);

  const { data: jobPositionData } = useGetParameterList(Modules.JOB_POSITION);
  const { data: institutiontypeData } = useGetParameterList(Modules.INSTITUTION_TYPE);
  const { data: idDocTypeData } = useGetParameterList('idDocType');
  const { data: currencyDropdownList } = useGetParameterList(Modules.CURRENCY, {
    label: 'value1',
    rate: 'value2',
    value: 'key',
  });

  const { getValues, setValue, watch, formState: { isValid }, reset, handleSubmit, control } = useForm({
    defaultValues: {
      exchangeRate: {
        currency: 'IDR',
        value: undefined,
      },
      identityDocFile: {
        extension: undefined,
        file: undefined,
        name: undefined,
        url: undefined,
      },
      identityDocNumber: undefined,
      identityTypeKey: undefined,
      jobPosition: undefined,
      name: undefined,
      npwp: undefined,
      npwpFile: {
        extension: undefined,
        file: undefined,
        name: undefined,
        url: undefined,
      },
      percentage: undefined,
      shares: undefined,
      type: undefined,
      valuePerShare: {
        currency: 'IDR',
        value: undefined,
      },
    },
    mode: 'onChange',
    reValidateMode: 'onChange',
    resolver: yupResolver(validationSchema),
  });

  useEffect(() => {
    if (data) {
      setValue('name', data.name);
      setValue('npwp', data.npwp);
      setValue('identityDocNumber', data.identityDocNumber);
      setValue('identityTypeKey', data.identityDocTypeKey);
      setValue('jobPosition', data.job);
      setValue('shares', data.shares);
      setValue('type', data.institutionType);
      setValue('valuePerShare', {
        currency: data.currencyValue,
        value: data.value,
      });
      setValue('percentage', data.percentage);
      setValue('exchangeRate', {
        currency: 'IDR',
        value: data.exchangeRate,
      });

      if (data.npwpFile) {
        const fileName = data.npwpFile.split('/').pop();
        setValue('npwpFile', {
          extension: fileName.split('.').pop(),
          file: null,
          name: fileName.split('.').shift().concat('.'),
        });
      }

      if (data.identityDocUrl) {
        const fileName = data.identityDocUrl.split('/').pop();
        setValue('identityDocFile', {
          extension: fileName.split('.').pop(),
          file: null,
          name: fileName.split('.').shift().concat('.'),
        });
      }
    }

  }, [data, setValue]);

  const getValuesNominal = useMemo(() => {
    const { valuePerShare, shares, exchangeRate } = watch();

    const sharesValue = Number(shares);
    const exchangeRateValue = Number(exchangeRate.value);

    switch (valuePerShare.currency) {
      case 'USD':
        return {
          currency: 'IDR',
          value: formatNumber(String(sharesValue * Number(valuePerShare.value) * exchangeRateValue)),
        };

      default:
        return {
          currency: 'IDR',
          value: formatNumber(String(sharesValue * Number(valuePerShare.value))),
        };
    }
  }, [watch('valuePerShare'), watch('shares'), watch('exchangeRate')]);

  const mutateShareholder = (data: any) => {
    const formValues = getValues();
    const {
      npwpFile,
      identityDocFile,
      valuePerShare,
      type,
      exchangeRate,
      shares,
      name,
      npwp,
      identityDocNumber,
      jobPosition,
      identityTypeKey,
    } = formValues;

    // Constructing the object
    let updatedShareholder = {
      bucketProcessId: processId,
      curValuePerShare: valuePerShare.currency,
      currencyValue: valuePerShare.currency,
      exchangeRate: exchangeRate.value !== '-' ? exchangeRate.value : undefined,
      id: props.id,
      identityDocFile: identityDocFile?.file || undefined,
      identityDocNumber,
      identityTypeKey,
      institutionType: type,
      jobPosition,
      module: TypeModule.PIPELINE,
      name,
      npwp,
      npwpFile: npwpFile?.file || undefined,
      percentage: formValues.percentage,
      process: TypeProcess.PIPELINE,
      shareholderCode: props.shareholderCode,
      shares,
      value: valuePerShare.value,
    };

    // Removing `null` values and converting them to `undefined`
    updatedShareholder = Object.fromEntries(
      Object.entries(updatedShareholder).map(([key, value]) => [key, value !== null ? value : undefined])
    );

    recordActivity({
      activity: ActivityType.EDIT,
      bucketProcessId: processId || '',
      changeAfter: JSON.stringify(updatedShareholder),
      changeBefore: JSON.stringify(data),
      menuCode: 'pipeline',
      module: TypeModule.PIPELINE,
      process: TypeProcess.PIPELINE,
      remarks: 'edit existing shareholder',
    });

    // Call mutate with the cleaned-up object
    mutate(updatedShareholder);
  };

  const watchedValues = watch();

  const autoSavePayload = useMemo(() => () => {
    const {
      npwpFile,
      identityDocFile,
      valuePerShare,
      type,
      exchangeRate,
      shares,
      name,
      npwp,
      identityDocNumber,
      jobPosition,
      identityTypeKey,
      percentage,
    } = watchedValues;

    const payload: Record<string, any> = {
      bucketProcessId: processId,
      currencyValue: valuePerShare.currency,
      exchangeRate: exchangeRate.value !== '-' ? exchangeRate.value : undefined,
      id: props.id,
      identityDocFile: identityDocFile?.file || undefined,
      identityDocNumber,
      identityTypeKey,
      institutionType: type,
      jobPosition,
      module: TypeModule.PIPELINE,
      name,
      npwp,
      npwpFile: npwpFile?.file || undefined,
      percentage: percentage,
      process: TypeProcess.PIPELINE,
      shareholderCode: props.shareholderCode,
      shares,
      value: valuePerShare.value,
    };

    const cleanedPayload = Object.fromEntries(
      Object.entries(payload).map(([key, value]) => [key, value !== null ? value : undefined])
    );

    return Promise.resolve(cleanedPayload);
  }, [watchedValues, processId, props.id, props.shareholderCode]);

  const { isFetching: isAutoSaveFetching } = useAutoSaveDraft({
    config: { headers: {
      'Content-Type': 'multipart/form-data',
    } }, isActive: !!props.id,
    payload: autoSavePayload,
    url: 'bucket.manage.saveCustomerShareholder',
  });


  return {
    control,
    currencyDropdownList,
    getValues,
    getValuesNominal,
    handleSubmit,
    idDocTypeData,
    institutiontypeData,
    isAutoSaveFetching,
    isSaveLoading,
    isValid,
    jobPositionData,
    modal,
    modalId,
    mutateShareholder,
    reset,
    setValue,
    theme,
    watch,
  };


};

export default useModalShareholderExisting;
