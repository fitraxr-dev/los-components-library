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
import { useParams, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';

import { accessid } from '@/configs/constants/pathname';
import { ActivityType } from '@/enums/Activity';
import { TypeModule, TypeProcess } from '@/enums/Module';
import { formatDate } from '@/helpers/date';
import showNiceModalV2 from '@/helpers/showNiceModalV2';
import useGetBucketById from '@/hooks/services/useGetBucketById';
import useGetParameterList from '@/hooks/services/useGetParameterList';
import useCheckAccess from '@/hooks/useCheckAccess';
import useIdentity from '@/hooks/useIdentity';
import useRecordLog from '@/hooks/useRecordLog';

import {
  payloadFilterList,
} from '@/components/pages/MaintenanceData/MaintenanceDebtor/ManagementShareholder/ManagementShareholder.constants';

import useGetFacilityDataDetailDetail from '../../../../hooks/FacilityDataDetail/useGetFacilityDataDetail';
import useGetFacilityDataDetailPK from '../../../../hooks/FacilityDataDetail/useGetFacilityDataDetailPK';
import useSaveFacilityDataDetail from '../../../../hooks/FacilityDataDetail/useSaveFacilityDataDetail';
import useGetFacilityInformation from '../../../../hooks/FacilityInformation/useGetFacilityInformation';
import useGetChangesDetail from '../../../../hooks/useGetChangesDetail';

import { facilityDataDetailSchema } from './FacilityDataDetail.constant';


export const useFacilityDataDetail = () => {
  const { id } = useParams();
  const { processId } = useIdentity();
  const params = useSearchParams();
  const orderType = params.get('orderType');
  const isEdit = params.get('isEdit');
  const isViewOnly = orderType === 'proposal' ? isEdit !== 'true' : true;
  const { data: interestPayinter } = useGetParameterList('interestPayinter',
    {
      label: 'value1',
      value: 'key',
      value2: 'value2',
    });

  const { data: principalPayinter } = useGetParameterList('principalPayinter',
    {
      label: 'value1',
      value: 'key',
      value2: 'value2',
    });

  const contextData = useMemo(() => ({
    interestPayinter,
    principalPayinter,
  }), [interestPayinter, principalPayinter]);

  const { control, watch, reset, getValues, setValue, trigger, formState: { isValid } } = useForm({
    context: contextData,
    defaultValues: {
      baseRate: 0,
      effectiveRate: 0,
      endDatePenaltyET: new Date().toISOString().split('T')[0],
      marginRate: 0,
      penaltyET: 0,
      startDatePenaltyET: new Date().toISOString().split('T')[0],
      tenor: 0,
    },
    mode: 'onChange',
    reValidateMode: 'onChange',
    resolver: yupResolver(facilityDataDetailSchema),
  });

  const principalPaymentIntervalWatch = watch('principalPaymentInterval');
  const startDateTypeWatch = watch('startDateType');

  useEffect(() => {
    if (watch('interestPaymentInterval')) {
      trigger('interestPaymentInterval');
    }
  }, [principalPaymentIntervalWatch, trigger]);
  const { recordActivity } = useRecordLog();

  const { data: penaltyRateType } = useGetParameterList('penaltyRatetype',
    {
      label: 'value1',
      value: 'key',
    });

  const { data: APby } = useGetParameterList('APby',
    {
      label: 'value1',
      value: 'key',
    });

  const { data: principalGPby } = useGetParameterList('principalGPby',
    {
      label: 'value1',
      value: 'key',
    });

  const { data: facStartdate } = useGetParameterList('facStartdate',
    {
      label: 'value1',
      value: 'key',
    });


  const { data: interestReviewPeriode } = useGetParameterList('interestReviewPeriode',
    {
      label: 'value1',
      value: 'key',
    });

  const { data: interestRateType } = useGetParameterList('interestRateType',
    {
      label: 'value1',
      value: 'key',
    });

  const { data: interestType } = useGetParameterList('interestType',
    {
      label: 'value1',
      value: 'key',
    });

  const { data: instalmentType } = useGetParameterList('instalmentType',
    {
      label: 'value1',
      value: 'key',
    });

  const { data: holidayType } = useGetParameterList('holidayType',
    {
      label: 'value1',
      value: 'key',
    });

  const { data: projectSourceofFund } = useGetParameterList('projectSourceofFund',
    {
      label: 'value1',
      value: 'key',
    });

  const { data: daysPerYear } = useGetParameterList('facilityKonvenLPSDaysPerYear',
    {
      label: 'value1',
      value: 'key',
    });

  const { data: interestTypeRefference } = useGetParameterList('rateReference',
    {
      label: 'value1',
      value: 'key',
    });
  const { data: latePaymentPenaltyMethod } = useGetParameterList('latePaymentpenaltyMeth',
    {
      label: 'value1',
      value: 'key',
    });
  const { data: partialPrepaymentMeth } = useGetParameterList('partialPrepaymentMeth',
    {
      label: 'value1',
      value: 'key',
    });
  const { data: apPeriodestartdate } = useGetParameterList('apPeriodeStartDate',
    {
      label: 'value1',
      value: 'key',
    });
  const { data: commitmentFeeMethod } = useGetParameterList('commitFeemeth',
    {
      label: 'value1',
      value: 'key',
    });
  const { data: financingTypeRevolving } = useGetParameterList('financingTypeRevolving',
    {
      label: 'value1',
      value: 'key',
    });

  useEffect(() => {
    const total = Number(watch('baseRate') || 0) + Number(watch('marginRate') || 0);
    setValue('effectiveRate', formatToSixDecimal(total));
  }, [watch('baseRate'), watch('marginRate')]);

  useEffect(() => {
    recordActivity({
      activity: ActivityType.VIEW,
      menuCode: 'facility-conventional',
      module: TypeModule.MAINTENANCE_DATA,
      process: TypeProcess.MAINTENANCE_CUSTOMER,
      remarks: 'view detail fasilitas conventional informasi Fasilitas - tab facility data detail',
    });
  }, []);

  const { data: facilityDataDetailInformation } = useGetFacilityDataDetailDetail(
    {
      ...payloadFilterList(processId as string),
      facilityId: id as string,
    }
  );

  let initialStartPenaltyDate = new Date().toISOString().split('T')[0];
  let initialEndPenaltyDate = new Date().toISOString().split('T')[0];

  useEffect(() => {
    if (facilityDataDetailInformation) {
      const data = facilityDataDetailInformation?.data?.content;
      initialStartPenaltyDate = data?.startDatePenaltyET ?? new Date().toISOString().split('T')[0];
      initialEndPenaltyDate = data?.endDatePenaltyET ?? new Date().toISOString().split('T')[0];
      reset({
        ...data,
        endDatePenaltyET: initialEndPenaltyDate,
        interestGraceperiod: !data?.interestGracePeriod && (data?.product === 'KMK_REVOLVING' || data?.product === 'KMK_TRANSACTIONAL') ? '0' : data?.interestGraceperiod,
        penaltyET: data?.penaltyET ?? 0,
        principalGraceperiodBy: !data?.principalGraceperiodBy && (data?.product === 'KMK_REVOLVING' || data?.product === 'KMK_TRANSACTIONAL') ? 'MONTH' : data?.principalGraceperiodBy,
        startDatePenaltyET: initialStartPenaltyDate,
      });
      setValue('latePaymentPenaltyMethod', data?.latePaymentPenaltyMethod || 'NM');
      setValue('financingType', data?.product === 'KMK_REVOLVING' || data?.product === 'REVOLVING_ADVANCE_FUNDS' ? 'REVOLVING' : 'NON_REVOLVING');
      setValue('commitmentFeeMethod', data?.commitmentFeeMethod || 'LAV');
    }
  }, [facilityDataDetailInformation]);

  const { mutate: saveFacilityDataDetail } = useSaveFacilityDataDetail({
    onError: (error) => {
      recordActivity({
        activity: ActivityType.SAVE,
        bucketProcessId: processId,
        changeAfter: JSON.stringify(getValues()),
        changeBefore: JSON.stringify(facilityDataDetailInformation?.data?.content),
        module: TypeModule.MAINTENANCE_DATA,
        process: TypeProcess.MAINTENANCE_CUSTOMER,
        remarks: 'save failed maintenance customer conventional facility data detail page',
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
        changeBefore: JSON.stringify(facilityDataDetailInformation?.data?.content),
        module: TypeModule.MAINTENANCE_DATA,
        process: TypeProcess.MAINTENANCE_CUSTOMER,
        remarks: 'save success maintenance customer conventional facility data detail page',
      });
      showNiceModalV2({
        title: 'Data berhasil disimpan',
        type: 'success',
      });
    },
  });

  const handleSaveFacilityDataDetail = () => {
    if (!isValid) {
      showNiceModalV2({
        cancelText: 'Tidak',
        onSubmit: () => {
          saveFacilityDataDetail({
            ...getValues(),
            bucketProcessId: processId as string,
            facilityId: id as string,
          });
        },
        submitText: 'Ya',
        title: 'Terdapat DATA MANDATORY yang belum terisi, tetap simpan perubahan?',
        type: 'warning',
      });
    } else {
      saveFacilityDataDetail({
        ...getValues(),
        bucketProcessId: processId as string,
        facilityId: id as string,
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

  const { data: dataDetailPk } = useGetFacilityDataDetailPK(
    {
      debtorId: bucketDetail?.debtorId,
      facilityId: id as string,
    },
    {
      enabled: startDateTypeWatch === 'PK',
    });

  // Calculate end dates when startDateType === 'PK'
  const principalGraceperiodWatch = watch('principalGraceperiod');
  const availabilityPeriodWatch = watch('availabilityPeriod');

  useEffect(() => {
    if (startDateTypeWatch === 'PK') {
      console.log('startDateTypeWatch === PK');
      console.log(dataDetailPk);
      const pkDate = dataDetailPk?.pkDate ?? dataDetailPk?.pkDate ?? null;
      console.log(pkDate);
      if (pkDate) {
        const base = new Date(pkDate);

        // principalGraceperiodEndDate = pkDate + principalGraceperiod days
        const pgDays = Number(principalGraceperiodWatch) || 0;
        const pgEnd = new Date(base);
        pgEnd.setDate(pgEnd.getDate() + pgDays);
        setValue('principalGraceperiodEndDate', pgEnd.toISOString().split('T')[0]);

        // availabilityPeriodEndDate = pkDate + availabilityPeriod days
        const apDays = Number(availabilityPeriodWatch) || 0;
        const apEnd = new Date(base);
        apEnd.setDate(apEnd.getDate() + apDays);
        setValue('availabilityPeriodEndDate', apEnd.toISOString().split('T')[0]);
      }
    } else {
      setValue('principalGraceperiodEndDate', null);
      setValue('availabilityPeriodEndDate', null);
    }
  }, [startDateTypeWatch, dataDetailPk, principalGraceperiodWatch, availabilityPeriodWatch]);

  const { data: dataDelta, isSuccess: isSuccesDataDelta } = useGetChangesDetail({
    // ...payloadFilterList(processId as string),
    bucketProcessId: processId as string,
    component: 'facilityDataDetail',
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
          const foundItem = dropdownInputList?.find((item) => String(item?.value) === String(findPrevValues));
          previousValue = foundItem?.label ?? findPrevValues;
        } else {
          if (inputKey.toLowerCase().includes('date')) {
            previousValue = formatDate(findPrevValues);
          } else {
            previousValue = findPrevValues;
          }
        }
      }
    }
    return previousValue;
  };

  return {
    APby,
    apPeriodestartdate,
    commitmentFeeMethod,
    control,
    daysPerYear,
    facStartdate,
    financingTypeRevolving,
    findDataMaster,
    handleSaveFacilityDataDetail,
    holidayType,
    initialEndPenaltyDate,
    initialStartPenaltyDate,
    instalmentType,
    interestPayinter,
    interestRateType,
    interestReviewPeriode,
    interestType,
    interestTypeRefference,
    isValid,
    isViewOnly,
    latePaymentPenaltyMethod,
    partialPrepaymentMeth,
    penaltyRateType,
    principalGPby,
    principalPayinter,
    projectSourceofFund,
    setValue,
    watch,
  };
};
