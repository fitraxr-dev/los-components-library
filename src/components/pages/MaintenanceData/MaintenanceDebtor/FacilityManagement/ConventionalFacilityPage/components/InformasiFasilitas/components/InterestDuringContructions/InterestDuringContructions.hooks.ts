import { useEffect, useMemo } from 'react';

/**
 * Format a numeric value to always have exactly 6 decimal places.
 * e.g. 1 → "1.000000", 1.12 → "1.120000", 1.1234567 → "1.123456"
 */
export const formatToSixDecimal = (value: string | number): string => {
  const num = parseFloat(String(value));
  if (isNaN(num)) return '0.000000';
  return num.toFixed(6);
};

import { yupResolver } from '@hookform/resolvers/yup';
import { useTheme } from '@mui/material';
import { useParams, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';

import { accessid } from '@/configs/constants/pathname';
import { ActivityType } from '@/enums/Activity';
import { TypeModule, TypeProcess } from '@/enums/Module';
import showNiceModalV2 from '@/helpers/showNiceModalV2';
import useGetBucketById from '@/hooks/services/useGetBucketById';
import useGetParameterList from '@/hooks/services/useGetParameterList';
import useCheckAccess from '@/hooks/useCheckAccess';
import useIdentity from '@/hooks/useIdentity';
import useRecordLog from '@/hooks/useRecordLog';

import {
  payloadFilterList,
} from '@/components/pages/MaintenanceData/MaintenanceDebtor/ManagementShareholder/ManagementShareholder.constants';

import useGetInterestConstructionDetail from '../../../../hooks/InterestConstruction/useGetInterestConstruction';
import useSaveInterestConstruction from '../../../../hooks/InterestConstruction/useSaveInterestConstruction';
import useGetChangesDetail from '../../../../hooks/useGetChangesDetail';

import { interestDuringContructionsSchema } from './InterestDuringContructions.constant';


export const useInterestDuringContructions = (facilityInformation: any) => {
  const theme = useTheme();
  const { id } = useParams();
  const params = useSearchParams();
  const orderType = params.get('orderType');
  const isEdit = params.get('isEdit');
  const isViewOnly = orderType === 'proposal' ? isEdit !== 'true' : true;
  const { processId } = useIdentity();
  const { control, watch, reset, getValues, setValue, formState: { isValid } } = useForm({
    defaultValues: {
      baseRateIDC: 0,
      effectiveRateIDC: 0,
      marginRateIDC: 0,
    },
    mode: 'onChange',
    reValidateMode: 'onChange',
    resolver: yupResolver(interestDuringContructionsSchema),
  });

  const { data: interestDuringContructionsInformation } = useGetInterestConstructionDetail(
    {
      ...payloadFilterList(processId as string),
      facilityId: id as string,
    }
  );


  const { data: interestTypeOptions } = useGetParameterList('idcInteresttype', { label: 'value1', value: 'key' });
  const { data: startDateOptions } = useGetParameterList('idcStartDate', { label: 'value1', value: 'key' });
  const { data: paymentByOptions } = useGetParameterList('idcPaymentBy', { label: 'value1', value: 'key' });

  const { recordActivity } = useRecordLog();

  useEffect(() => {
    const total = Number(watch('baseRateIDC') || 0) + Number(watch('marginRateIDC') || 0);
    setValue('effectiveRateIDC', formatToSixDecimal(total));
  }, [watch('baseRateIDC'), watch('marginRateIDC')]);

  useEffect(() => {
    recordActivity({
      activity: ActivityType.VIEW,
      menuCode: 'facility-conventional',
      module: TypeModule.MAINTENANCE_DATA,
      process: TypeProcess.MAINTENANCE_CUSTOMER,
      remarks: 'view detail fasilitas conventional informasi Fasilitas - tab interest during constructions',
    });
  }, []);

  useEffect(() => {
    if (interestDuringContructionsInformation) {
      const data = interestDuringContructionsInformation?.data?.content as any;
      reset({
        ...data,
        baseRateIDC: formatToSixDecimal(data?.baseRateIDC || 0),
        effectiveRateIDC: formatToSixDecimal(data?.effectiveRateIDC || 0),
        interestIDCPaymentBy: (facilityInformation?.productType === 'KI Def IDC Subordinated' || facilityInformation?.productType === 'KI dengan IDC 100%') && !data?.interestIDCPaymentBy ? 'IDC_FACILITIES' : data?.interestIDCPaymentBy,
        marginRateIDC: formatToSixDecimal(data?.marginRateIDC || 0),
        paymentPortionIDC: (facilityInformation?.productType === 'KI Def IDC Subordinated' || facilityInformation?.productType === 'KI dengan IDC 100%') && !data?.paymentPortionIDC ? 100 : data?.paymentPortionIDC,
      });
    }
  }, [interestDuringContructionsInformation]);

  const { mutate: saveInterestDuringContructions } = useSaveInterestConstruction({
    onError: (error) => {
      recordActivity({
        activity: ActivityType.SAVE,
        bucketProcessId: processId,
        changeAfter: JSON.stringify(getValues()),
        changeBefore: JSON.stringify(interestDuringContructionsInformation?.data?.content),
        module: TypeModule.MAINTENANCE_DATA,
        process: TypeProcess.MAINTENANCE_CUSTOMER,
        remarks: 'save failed maintenance customer conventional interest during constructions page',
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
        changeBefore: JSON.stringify(interestDuringContructionsInformation?.data?.content),
        module: TypeModule.MAINTENANCE_DATA,
        process: TypeProcess.MAINTENANCE_CUSTOMER,
        remarks: 'save success maintenance customer conventional interest during constructions page',
      });
      showNiceModalV2({
        title: 'Data berhasil disimpan',
        type: 'success',
      });
    },
  });

  const handleSaveInterestDuringContructions = () => {
    if (!isValid) {
      showNiceModalV2({
        cancelText: 'Tidak',
        onSubmit: () => {
          saveInterestDuringContructions({
            ...getValues(),
            availabilityPeriodIDC: getValues('availabilityPeriodIDC'),
            baseRateIDC: Number(getValues('baseRateIDC')),
            bucketProcessId: processId as string,
            effectiveRateIDC: Number(getValues('effectiveRateIDC')),
            facilityId: id as string,
            interestTypeIDC: getValues('interestTypeIDC'),
            marginRateIDC: Number(getValues('marginRateIDC')),
            paymentPortionIDC: Number(getValues('paymentPortionIDC')),
            plafondIDC: Number(getValues('plafondIDC').split('.')[0].replaceAll(',', '')),
          });
        },
        submitText: 'Ya',
        title: 'Terdapat DATA MANDATORY yang belum terisi, tetap simpan perubahan?',
        type: 'warning',
      });
    } else {
      saveInterestDuringContructions({
        ...getValues(),
        availabilityPeriodIDC: getValues('availabilityPeriodIDC'),
        baseRateIDC: Number(getValues('baseRateIDC')),
        bucketProcessId: processId as string,
        effectiveRateIDC: Number(getValues('effectiveRateIDC')),
        facilityId: id as string,
        interestTypeIDC: getValues('interestTypeIDC'),
        marginRateIDC: Number(getValues('marginRateIDC')),
        paymentPortionIDC: Number(getValues('paymentPortionIDC')),
        plafondIDC: Number(getValues('plafondIDC').split('.')[0].replaceAll(',', '')),
      });
    }

  };

  const roleCanEdit = useCheckAccess(accessid.MAINTENANCE_DEBTOR_UPDATE);

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
    component: 'interestDuringContructions',
    debtorId: bucketDetail?.debtorId,
    facilityId: id as string,
    module: TypeModule.MAINTENANCE_DATA,
    process: TypeProcess.MAINTENANCE_CUSTOMER,
  },
  {
    enabled: isEnabledDataDelta,
  });

  const findDataMaster = (inputKey: string, dropdownInputList?: { label: string; id: string }[]) => {
    let previousValue = null;
    if (dataDelta?.data?.content?.differencesData?.some((el) => el?.field === inputKey)) {
      const findPrevValues = dataDelta?.data?.content &&
        dataDelta?.data?.content?.differencesData?.find((el) => el?.field === inputKey)?.previousValue;
      if (findPrevValues === null) {
        previousValue = '-';
      } else {
        if (dropdownInputList?.length) {
          const foundItem = dropdownInputList?.find((item) => String(item?.id) === String(findPrevValues));
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
    findDataMaster,
    handleSaveInterestDuringContructions,
    interestTypeOptions,
    isViewOnly,
    paymentByOptions,
    setValue,
    startDateOptions,
    theme,
    watch,
  };
};
