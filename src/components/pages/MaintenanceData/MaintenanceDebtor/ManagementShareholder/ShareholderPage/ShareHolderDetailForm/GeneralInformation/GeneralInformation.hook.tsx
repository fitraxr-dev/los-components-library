import { useEffect, useMemo } from 'react';

import { yupResolver } from '@hookform/resolvers/yup';
import { useTheme } from '@mui/material';
import { useParams, usePathname } from 'next/navigation';
import { useForm } from 'react-hook-form';

import { MODAL } from '@/configs/constants/modalId';
import { accessid } from '@/configs/constants/pathname';
import { ActivityType } from '@/enums/Activity';
import { TypeModule, TypeProcess } from '@/enums/Module';
import Modules from '@/enums/Modules';
import { dayJsJakartaIsoString, formatDateTime } from '@/helpers/date';
import showNiceModalV2 from '@/helpers/showNiceModalV2';
import useGetCustomerInfoDataDelta from '@/hooks/services/maintenance-customer/useGetCustomerInfoDataDelta';
import useGetBucketById from '@/hooks/services/useGetBucketById';
import useGetParameterList from '@/hooks/services/useGetParameterList';
import useApp from '@/hooks/useApp';
import useCheckAccess from '@/hooks/useCheckAccess';
import closeNiceModal from '@/hooks/useCloseNiceModal';
import useCustomRouter from '@/hooks/useCustomRouter';
import recordLog from '@/services/api/recordLog';
import { DataDeltaGetDtoComponentEnum } from '@/services/openapi/master-service';

import { shareHolderSchema } from './GeneralInformation.constants';
import useGetShareholderById from './hooks/useGetShareholderById';
import useSaveShareholder from './hooks/useSaveShareholder';


const useGeneralInformation = () => {
  const pathname = usePathname();
  const [{ currentRole }] = useApp();
  const theme = useTheme();
  const router = useCustomRouter();
  const params = useParams();
  const processId = pathname.split('/')[4];
  const isTL = currentRole.includes('TL');
  const isKadiv = currentRole.includes('KADIV');
  const showPrefixSuffix = ['INDIVIDUAL', 'PMA'];
  const isDebtor = processId?.includes('DEBT');

  const { getValues, control, handleSubmit, watch, setValue,
    reset, trigger, formState: { isValid, isDirty, errors } } = useForm(
    {
      defaultValues: {
        beneficialOwner: '',
        dataInformationSource: '',
        exchangeRate: {
          currency: 'IDR',
          value: undefined,
        },
        idDocFile: undefined,
        idNo: '',
        idRefShareholder: '',
        idType: '',
        identityExpiry: '',
        institutionType: '',
        lastModified: '',
        level: '',
        modifiedBy: '',
        name: '',
        nominal: {
          currency: 'IDR',
          value: undefined,
        },
        npwp: '',
        npwpFile: undefined,
        plafondIdr: {
          currency: 'IDR',
          value: undefined,
        },
        prefix: '',
        suffix: '',
        valuePersheet: {
          currency: 'IDR',
          value: undefined,
        },
      },
      mode: 'onChange',
      reValidateMode: 'onChange',
      resolver: yupResolver(shareHolderSchema),
    });

  const { data: currencyDropdownList } = useGetParameterList(Modules.CURRENCY, { label: 'value1', rate: 'value2', value: 'key' });
  const { data: institutionTypeList } = useGetParameterList(Modules.INSTITUTION_TYPE, { label: 'value1', rate: 'value2', value: 'key' });
  const { data: IdDropdownList } = useGetParameterList(Modules.ID_DOC_TYPE, { label: 'value1', value: 'key' });
  const {
    data: bucketDetail,
  } = useGetBucketById({
    bucketProcessId: String(processId),
    module: TypeModule.MAINTENANCE_DATA,
    process: TypeProcess.MAINTENANCE_CUSTOMER,
  }, {
    enabled: !isDebtor,
  });
  const formatPayload = (val) => val ? val : undefined;

  const formatCurr = (val) => {
    if (val === undefined || val === null || val === '') return undefined;
    console.log('val', Number(val));
    return Number(val) > 0 ? val : undefined;
  };

  const roleCanEdit = useCheckAccess(accessid.MAINTENANCE_DEBTOR_UPDATE);

  const isEnabledDataDelta = useMemo(() => {
    let enabled = false;
    if ((!roleCanEdit) && !!bucketDetail?.debtorId) enabled = true;

    return enabled;
  }, [bucketDetail]);

  const { data: dataDelta, isSuccess: isSuccesDataDelta } = useGetCustomerInfoDataDelta({
    bucketProcessId: processId,
    component: DataDeltaGetDtoComponentEnum?.Shareholder,
    componentIdentifier: String(params?.id),
    debtorId: bucketDetail?.debtorId,
    module: TypeModule.MAINTENANCE_DATA,
    process: TypeProcess.MAINTENANCE_CUSTOMER,
  },
  {
    enabled: isEnabledDataDelta,
  });


  const isDetailPage = !pathname.includes('add') && !pathname.includes('edit');

  const pageBreadCrumb = useMemo(() => {
    if (pathname.includes('add')) return ({ label: 'Add Shareholder', url: '' });
    if (pathname.includes('edit')) return ({ label: 'Edit Shareholder', url: '' });
    return ({ label: 'Detail Shareholder', url: '' });
  }, []);

  useEffect(() => {
    recordLog({
      activity: pageBreadCrumb.label === 'Add Shareholder'
        ? ActivityType.ADD : pageBreadCrumb.label === 'Edit Shareholder'
          ? ActivityType.EDIT : ActivityType.VIEW,
      bucketProcessId: processId || '',
      changeAfter: '',
      changeBefore: '',
      menuCode: 'maintenance-data',
      module: TypeModule.MAINTENANCE_DATA,
      process: TypeProcess.MAINTENANCE_CUSTOMER,
      remarks: pageBreadCrumb.label,
    });
  }, []);


  // useEffect(() => {
  //   handleSetBreadcrumb([
  //     { label: 'Management & Shareholder', url: '' },
  //     {
  //   label: 'Shareholder',
  //  url: `/maintenance-data/maintenance-debtor/maintenance/${processId}/management-shareholder/shareholder`
  // },
  //     pageBreadCrumb
  //   ]);
  // }, []);

  const { data: shareholderData, isSuccess } = useGetShareholderById({
    bucketProcessId: isDebtor ? '' : processId,
    debtorId: isDebtor ? processId : bucketDetail?.debtorId,
    module: TypeModule.MAINTENANCE_DATA,
    process: TypeProcess.MAINTENANCE_CUSTOMER,
    shareholderId: String(params?.id),

  }, {
    enabled: !!params?.id,
  });


  const { isPending: isSaveLoading, mutate: mutateSave } = useSaveShareholder({
    onError: (error) => {
      recordLog({
        activity: pageBreadCrumb.label === 'Add Shareholder'
          ? ActivityType.ADD : pageBreadCrumb.label === 'Edit Shareholder'
            ? ActivityType.EDIT : ActivityType.VIEW,
        bucketProcessId: processId || '',
        changeAfter: JSON.stringify(getValues()),
        changeBefore: JSON.stringify(shareholderData),
        menuCode: 'maintenance-data',
        module: TypeModule.MAINTENANCE_DATA,
        process: TypeProcess.MAINTENANCE_CUSTOMER,
        remarks: 'gagal update shareholder',
      });
      showNiceModalV2({ title: error?.message, type: 'error' });
    },

    onSuccess: () => {
      recordLog({
        activity: pageBreadCrumb.label === 'Add Shareholder'
          ? ActivityType.ADD : pageBreadCrumb.label === 'Edit Shareholder'
            ? ActivityType.EDIT : ActivityType.VIEW,
        bucketProcessId: processId || '',
        changeAfter: JSON.stringify(getValues()),
        changeBefore: JSON.stringify(shareholderData),
        menuCode: 'maintenance-data',
        module: TypeModule.MAINTENANCE_DATA,
        process: TypeProcess.MAINTENANCE_CUSTOMER,
        remarks: 'berhasil update shareholder',
      });
      showNiceModalV2({ onClose: () => { router.back(); }, title: 'Berhasil Menambahkan Shareholder', type: 'success' });
    },
  });

  useEffect(() => {
    if (shareholderData && isSuccess) {
      reset({
        beneficialOwner: String(shareholderData?.beneficialOwner || ''),
        dataInformationSource: shareholderData?.informationSource,
        establishmentAct: shareholderData?.establishmentAct,
        establishmentActFile: shareholderData?.establishmentActFile?.document ? {
          extension: `.${shareholderData?.establishmentActFile?.documentExtension}`,
          name: shareholderData?.establishmentActFile?.documentName,
          url: shareholderData?.establishmentActFile?.document,
        } : null,
        exchangeRate: {
          currency: 'IDR',
          value: shareholderData?.exchangeRate || undefined,
        },
        idDocFile: shareholderData?.idDocument?.document ? {
          extension: `.${shareholderData?.idDocument?.documentExtension}`,
          name: shareholderData?.idDocument?.documentName,
          url: shareholderData?.idDocument?.document,
        } : null,
        idNo: shareholderData?.idNo,
        idRefShareholder: shareholderData?.shareholderId,
        idType: shareholderData?.idType,
        identityExpiry: shareholderData?.identityExpiry,
        institutionType: shareholderData?.institutionType,
        lastChangeAct: shareholderData?.lastChangeAct,
        lastChangeActFile: shareholderData?.lastChangeActFile?.document ? {
          extension: `.${shareholderData?.lastChangeActFile?.documentExtension}`,
          name: shareholderData?.lastChangeActFile?.documentName,
          url: shareholderData?.lastChangeActFile?.document,
        } : null,
        lastModified: shareholderData?.modifiedDate ? formatDateTime(shareholderData?.modifiedDate) : '-',
        level: String(shareholderData?.level || ''),
        modifiedBy: shareholderData?.modifiedBy,
        name: shareholderData?.name ?? '',
        nominal: {
          currency: 'IDR',
          value: shareholderData?.nominal,
        },
        npwp: shareholderData?.npwp,
        npwpFile: shareholderData?.npwpDocument?.document ? {
          extension: `.${shareholderData?.npwpDocument?.documentExtension}`,
          name: shareholderData?.npwpDocument?.documentName,
          url: shareholderData?.npwpDocument?.document,
        } : null,
        percentage: Number(shareholderData?.percentage) > 0 ? Number(shareholderData?.percentage) ?? null : null,
        plafondIdr: {
          currency: 'IDR',
          value: null,
        },
        prefix: shareholderData?.prefix,
        stockSheet: formatCurr(shareholderData?.stockSheet),
        suffix: shareholderData?.suffix,
        valuePersheet: {
          currency: shareholderData.currencyValue || 'IDR',
          value: Number(shareholderData?.value) > 0
            ? shareholderData.value ?? undefined
            : undefined,
        },
      });
      trigger();
    }

    console.log('control', control);
  }, [shareholderData]);

  useEffect(() => {
    setValue('nominal', {
      currency: watch('valuePersheet.currency'),
      value: String(Number(watch('valuePersheet.value')) * Number(watch('stockSheet'))),
    });
    if (watch('valuePersheet.currency') === 'USD') {
      setValue('plafondIdr', {
        currency: 'IDR',
        value: String((Number(watch('valuePersheet.value')) * Number(watch('stockSheet'))) * Number(watch('exchangeRate.value'))),
      });
    }

  }, [watch('valuePersheet'), watch('stockSheet'), watch('exchangeRate')]);

  useEffect(() => {
    const watchvaluePersheetCurrency = watch('valuePersheet.currency');
    console.log('watchvaluePersheetCurrency', watchvaluePersheetCurrency);
    console.log('watchvaluePersheetCurrency currencyDropdownList', currencyDropdownList);
    if (watchvaluePersheetCurrency && watchvaluePersheetCurrency !== 'IDR') {
      const idRate = currencyDropdownList?.find((item) => item.value === watchvaluePersheetCurrency)?.rate;
      console.log('watchvaluePersheetCurrency idRate', idRate);
      if (idRate && !watch('exchangeRate.value')) {
        console.log('watchvaluePersheetCurrency value', { currency: 'IDR', value: idRate });
        setValue('exchangeRate', { currency: 'IDR', value: idRate });
      }
    } else if (watchvaluePersheetCurrency && watchvaluePersheetCurrency === 'IDR') {
      console.log('watchvaluePersheetCurrency value IDR', { currency: 'IDR', value: undefined });
      setValue('exchangeRate', { currency: 'IDR', value: undefined });
    }
  }, [watch('valuePersheet.currency'), currencyDropdownList]);

  const handleSave = () => {
    const values = getValues();

    const payload = {
      beneficialOwner: formatPayload(values?.beneficialOwner),
      bucketProcessId: processId,
      currencyValue: formatPayload(values?.valuePersheet?.currency),
      debtorId: formatPayload(bucketDetail?.debtorId),
      establishmentAct: formatPayload(values?.establishmentAct),
      establishmentActFile: formatPayload(values?.establishmentActFile?.file),
      exchangeRate: values?.exchangeRate?.value ? formatCurr(values?.exchangeRate?.value) : undefined,
      idDocFile: formatPayload(values?.idDocFile?.file),
      idDocUrl: undefined,
      idNo: formatPayload(values?.idNo),
      idType: formatPayload(values?.idType),
      identityExpiry: values?.identityExpiry ? dayJsJakartaIsoString(values.identityExpiry) : undefined,
      informationSource: formatPayload(values?.dataInformationSource),
      institutionType: formatPayload(values?.institutionType),
      jobPosition: undefined,
      lastChangeAct: formatPayload(values?.lastChangeAct),
      lastChangeActFile: formatPayload(values?.lastChangeActFile?.file),
      level: formatPayload(values?.level),
      module: TypeModule.MAINTENANCE_DATA,
      name: formatPayload(values?.name),
      nominal: formatCurr(values?.nominal?.value),
      npwp: formatPayload(values?.npwp),
      npwpDocFile: formatPayload(values?.npwpFile?.file),
      percentage: formatCurr(values?.percentage),
      prefix: formatPayload(values?.prefix),
      process: TypeProcess.MAINTENANCE_CUSTOMER,
      refId: formatPayload(values?.idRefShareholder),
      shareholderId: formatPayload(params.id),
      stockSheet: values?.stockSheet
        ? Number(values.stockSheet)
        : 0,
      suffix: formatPayload(values?.suffix),
      totalValue: undefined,
      value: formatPayload(values?.valuePersheet?.value),
    };

    mutateSave(payload);

  };

  const findDataMaster = (inputKey: string, dropdownInputList?: { label: string; value: string }[]) => {
    let previousValue = null;
    if (dataDelta?.differencesData?.some((el) => el?.field === inputKey) && isSuccesDataDelta) {
      const findPrevValues = dataDelta?.differencesData?.find((el) => el?.field === inputKey)?.previousValue;
      if (findPrevValues === null) {
        previousValue = '-';
      } else {
        if (dropdownInputList?.length) {
          previousValue = dropdownInputList?.find((item) => item?.value === findPrevValues)?.label;
        } else {
          if (inputKey === 'identityExpiry') {
            previousValue = formatDateTime(findPrevValues);
          } else {
            previousValue = findPrevValues;
          }
        }
      }
    }
    return previousValue;
  };


  const handleNotComplete = () => {
    showNiceModalV2({
      cancelText: 'Tidak',
      onSubmit: () => {
        closeNiceModal(MODAL.GLOBAL.WARNING);
        handleSave();
      },
      submitText: 'Ya',
      title: 'Data belum lengkap, apakah anda ingin menyimpan data ini?',
      type: 'warning',
    });
  };

  const handleBackToListPage = () => {
    router.back();
  };


  return {
    IdDropdownList,
    control,
    currencyDropdownList,
    findDataMaster,
    handleBackToListPage,
    handleNotComplete,
    handleSave,
    handleSubmit,
    institutionTypeList,
    isDetailPage,
    isDirty,
    isSaveLoading,
    isValid,
    pageBreadCrumb,
    router,
    setValue,
    showPrefixSuffix,
    theme,
    watch,
  };
};

export default useGeneralInformation;
