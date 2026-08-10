import { useEffect, useMemo } from 'react';

import { yupResolver } from '@hookform/resolvers/yup';
import { useTheme } from '@mui/material';
import { useParams, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';

import { accessid } from '@/configs/constants/pathname';
import { ActivityType } from '@/enums/Activity';
import { TypeModule, TypeProcess } from '@/enums/Module';
import Modules from '@/enums/Modules';
import showNiceModalV2 from '@/helpers/showNiceModalV2';
import { multiplyNominalValues } from '@/helpers/utils';
import useGetBucketById from '@/hooks/services/useGetBucketById';
import useGetParameterList from '@/hooks/services/useGetParameterList';
import useCheckAccess from '@/hooks/useCheckAccess';
import useIdentity from '@/hooks/useIdentity';
import useRecordLog from '@/hooks/useRecordLog';

import {
  payloadFilterList,
} from '@/components/pages/MaintenanceData/MaintenanceDebtor/ManagementShareholder/ManagementShareholder.constants';

import useGetFacilityDataDetail from '../../../../hooks/FacilityData/useGetFacilityData';
import useSaveFacilityData from '../../../../hooks/FacilityData/useSaveFacilityData';
import useGetFacilityInformation from '../../../../hooks/FacilityInformation/useGetFacilityInformation';
import useGetChangesDetail from '../../../../hooks/useGetChangesDetail';

import { facilityDataSchema } from './FacilityData.constant';


export const useFacilityData = () => {
  const theme = useTheme();
  const { id } = useParams();
  const { processId } = useIdentity();
  const params = useSearchParams();
  const orderType = params.get('orderType');
  const isEdit = params.get('isEdit');
  const { control, watch, reset, getValues, setValue, formState: { isValid } } = useForm(
    {
      mode: 'onChange',
      reValidateMode: 'onChange',
      resolver: yupResolver(facilityDataSchema),
    },
  );
  const { data: facilityDataInformation } = useGetFacilityDataDetail({
    ...payloadFilterList(processId as string),
    facilityId: id as string,
  });

  const facilityDataContent = (facilityDataInformation as any)?.data?.content;

  const { data: productName } = useGetParameterList('product' + facilityDataContent?.financingSegment,
    {
      label: 'value1',
      value: 'key',
    });

  const productModule = useMemo(() => {
    return `product${watch('mappingFinancingSegment')?.toLowerCase()}`;
  }, [watch('mappingFinancingSegment')]);

  const { data: productList } = useGetParameterList(productModule, {
    id: 'id',
    label: 'value1',
    value: 'key',
  });
  const { data: mappingOrderTypeList } = useGetParameterList('mappingOrderTypePK');
  const { data: orderTypeList } = useGetParameterList(Modules.ORDER_TYPE);

  // NOTE: gunakan module 'financingSegment' agar konsisten dengan API detail facility data
  const { data: financingSegmentList } = useGetParameterList(Modules.FINANCING_SEGMENT);

  const financingSegmentOptions = useMemo(() => {
    return financingSegmentList?.filter((item: { value: string }) => item.value.toLowerCase() !== 'syariah');
  }, [financingSegmentList]);


  const roleCanEdit = useCheckAccess(accessid.MAINTENANCE_DEBTOR_UPDATE);
  const { recordActivity } = useRecordLog();

  const { data: facilitySchema } = useGetParameterList('facilityKonvenLPSFinancingScheme',
    {
      label: 'value1',
      value: 'key',
    });

  const { data: financingType } = useGetParameterList('financingType',
    {
      label: 'value1',
      value: 'key',
    });

  const { data: subProductLibraryOptions } = useGetParameterList('subProductLibrary',
    {
      label: 'value1',
      value: 'key',
    });

  const { data: productLibraryOptions } = useGetParameterList('productLibrary',
    {
      label: 'value1',
      value: 'key',
    });

  const isViewOnly = orderType === 'proposal' ? isEdit !== 'true' : true;

  useEffect(() => {
    recordActivity({
      activity: ActivityType.VIEW,
      menuCode: 'facility-conventional',
      module: TypeModule.MAINTENANCE_DATA,
      process: TypeProcess.MAINTENANCE_CUSTOMER,
      remarks: 'view detail fasilitas conventional informasi Fasilitas - tab facility data',
    });
  }, []);

  useEffect(() => {
    if (facilityDataInformation) {
      reset(facilityDataContent as any);
      if (watch('packageName') === 'KMK_REVOLVING' || watch('packageName') === 'KMK_TRANSACTIONAL') {
        setValue('subProductLibrary', facilityDataContent?.subProductLibrary || 'WC');
        setValue('productLibrary', facilityDataContent?.productLibrary || 'WC');

      } else {
        setValue('productLibrary', facilityDataContent?.productLibrary || 'I');
        setValue('subProductLibrary', facilityDataContent?.subProductLibrary || 'I');
      }
    }
  }, [facilityDataInformation]);

  useEffect(() => {
    if (!facilityDataContent) return;
    if (!financingSegmentOptions?.length) return;

    const raw = facilityDataContent?.financingSegment;
    if (!raw) return;

    // Dropdown expect value = option.value; API detail kadang kirim label/desc.
    const found = financingSegmentOptions.find((opt: any) => {
      const optValue = String(opt?.value ?? '');
      const optLabel = String(opt?.label ?? '');
      const target = String(raw);
      return optValue === target || optLabel === target;
    });

    const currentFinancingSegment = (getValues() as any)?.financingSegment;
    if (found?.value && String(currentFinancingSegment ?? '') !== String(found.value)) {
      setValue('financingSegment' as any, found.value, { shouldDirty: false, shouldValidate: true });
    }
  }, [facilityDataInformation, financingSegmentOptions]);

  const { mutate: saveFacilityData } = useSaveFacilityData({
    onError: (error) => {
      recordActivity({
        activity: ActivityType.SAVE,
        bucketProcessId: processId,
        changeAfter: JSON.stringify(getValues()),
        changeBefore: JSON.stringify(facilityDataContent),
        module: TypeModule.MAINTENANCE_DATA,
        process: TypeProcess.MAINTENANCE_CUSTOMER,
        remarks: 'save failed maintenance customer conventional facility data page',
      });
      showNiceModalV2({
        title: error?.message,
        type: 'error',
      });
    },
    onSuccess: () => {
      recordActivity({
        activity: ActivityType.SAVE,
        bucketProcessId: processId,
        changeAfter: JSON.stringify(getValues()),
        changeBefore: JSON.stringify(facilityDataContent),
        module: TypeModule.MAINTENANCE_DATA,
        process: TypeProcess.MAINTENANCE_CUSTOMER,
        remarks: 'save success maintenance customer conventional facility data page',
      });
      showNiceModalV2({
        title: 'Data berhasil disimpan',
        type: 'success',
      });
    },
  });

  const handleSaveFacilityData = () => {
    if (!isValid) {
      showNiceModalV2({
        cancelText: 'Tidak',
        onSubmit: () => {
          saveFacilityData({
            ...getValues(),
            bucketProcessId: processId as string,
            decimalRounded: getValues('currencyOrderValue') === 'USD' ? '2' : getValues('currencyOrderValue') === 'IDR' ? '0' : '',
            facilityId: id as string,
          });
        },
        submitText: 'Ya',
        title: 'Terdapat DATA MANDATORY yang belum terisi, tetap simpan perubahan?',
        type: 'warning',
      });
    } else {
      saveFacilityData({
        ...getValues(),
        bucketProcessId: processId as string,
        decimalRounded: getValues('currencyOrderValue') === 'USD' ? '2' : getValues('currencyOrderValue') === 'IDR' ? '0' : '',
        facilityId: id as string,
      });
    }
  };

  const { data: currencyList, isLoading: isLoadingCurrencyList } = useGetParameterList(Modules.CURRENCY, { label: 'value1', value: 'key', value2: 'value2' });

  useEffect(() => {
    if (watch('currencyOrderValue') === 'USD') {
      setValue('exchangeRate', !watch('exchangeRate') || watch('exchangeRate') === '0' ? currencyList?.find((item) => item.label === 'USD')?.value2 : watch('exchangeRate'));
      setValue('currencyExchangeRate', 'IDR');
    } else {
      setValue('exchangeRate', '0');
      setValue('currencyExchangeRate', '');
    }
  }, [watch('currencyOrderValue')]);

  useEffect(() => {
    if (watch('currencyOrderValue') === 'USD') {
      setValue('totalPlafondValue', String(Number(watch('orderValue')) * Number(watch('exchangeRate'))));
    } else {
      setValue('totalPlafondValue', String(Number(watch('orderValue'))));
    }
  }, [watch('exchangeRate'), watch('orderValue')]);

  const { data: bucketDetail } = useGetBucketById({
    bucketProcessId: processId as string,
    // debtorId: id as string,
    module: TypeModule.MAINTENANCE_DATA,
    process: TypeProcess.MAINTENANCE_CUSTOMER,
  });

  const isEnabledDataDelta = useMemo(() => {
    let enabled = false;
    if ((!roleCanEdit) && !!bucketDetail?.debtorId && orderType === 'proposal') enabled = true;

    return enabled;
  }, [bucketDetail, orderType]);


  const { data: dataDelta, isSuccess: isSuccesDataDelta } = useGetChangesDetail({
    // ...payloadFilterList(processId as string),
    bucketProcessId: processId as string,
    component: 'facilityData',
    debtorId: bucketDetail?.debtorId,
    facilityId: id as string,
    module: TypeModule.MAINTENANCE_DATA,
    process: TypeProcess.MAINTENANCE_CUSTOMER,
  },
  {
    enabled: isEnabledDataDelta,
  });

  const dataDeltaContent = (dataDelta as any)?.data?.content;

  const { data: productListDelta } = useGetParameterList(`product${dataDeltaContent?.differencesData?.find((el: any) => el?.field === 'mappingFinancingSegment')?.previousValue}`, {
    id: 'id',
    label: 'value1',
    value: 'key',
  });

  const findDataMaster = (inputKey: string, dropdownInputList?: {
    label: string; value?: string | number | null; id?: string;
  }[]) => {
    let previousValue = null;
    if (dataDeltaContent?.differencesData?.some((el: any) => el?.field === inputKey)) {
      const findPrevValues = dataDeltaContent &&
        dataDeltaContent?.differencesData?.find((el: any) => el?.field === inputKey)?.previousValue;
      if (findPrevValues === null) {
        previousValue = '-';
      } else {
        if (dropdownInputList?.length) {
          const foundItem = dropdownInputList?.find((item) => String(item?.value) === String(findPrevValues));
          previousValue = foundItem?.label ?? findPrevValues;
        } else {
          previousValue = findPrevValues;
        }
      }
    }
    return previousValue;
  };


  return {
    control,
    currencyList,
    dataDelta,
    facilityDataInformation,
    facilitySchema,
    financingSegmentList,
    financingSegmentOptions,
    financingType,
    findDataMaster,
    handleSaveFacilityData,
    isValid,
    isViewOnly,
    mappingOrderTypeList,
    orderTypeList,
    productLibraryOptions,
    productList,
    productListDelta,
    productName,
    roleCanEdit,
    setValue,
    subProductLibraryOptions,
    theme,
    watch,
  };
};
