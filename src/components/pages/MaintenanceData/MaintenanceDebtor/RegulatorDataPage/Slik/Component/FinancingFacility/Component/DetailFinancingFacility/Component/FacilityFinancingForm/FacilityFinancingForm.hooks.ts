import { useEffect, useMemo } from 'react';

import { yupResolver } from '@hookform/resolvers/yup';
import { useTheme } from '@mui/material';
import { useParams, usePathname, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';

import { accessid, maintenanceDebtor } from '@/configs/constants/pathname';
import { ActivityType } from '@/enums/Activity';
import { TypeModule, TypeProcess } from '@/enums/Module';
import { formatDate, formatDateTime } from '@/helpers/date';
import { replacePath } from '@/helpers/navigation';
import showNiceModalV2 from '@/helpers/showNiceModalV2';
import useGetBucketById from '@/hooks/services/bucket/useGetBucketById';
import useGetCustomerInfoDataDelta from '@/hooks/services/maintenance-customer/useGetCustomerInfoDataDelta';
import useGetParameterList from '@/hooks/services/useGetParameterList';
import useCheckAccess from '@/hooks/useCheckAccess';
import useCustomRouter from '@/hooks/useCustomRouter';
import useIdentity from '@/hooks/useIdentity';
import useRecordLog from '@/hooks/useRecordLog';
import { DataDeltaGetDtoComponentEnum } from '@/services/openapi/master-service/api';

import {
  payloadFilterList,
} from '@/components/pages/MaintenanceData/MaintenanceDebtor/ManagementShareholder/ManagementShareholder.constants';


import useGetDeltaDetailSlik from '../../../../../../hooks/useGetDeltaDetailSlik';
import useGetSlikFacilityDetail from '../../../../hooks/useGetSlikFacilityDetail';
import useSaveSlikFacility from '../../../../hooks/useSaveSlikFacility';


import { facilityFinancingFormSchema } from './FacilityFinancingForm.constant';


export const useFacilityFinancingForm = () => {
  const theme = useTheme();
  const { control, reset, watch, handleSubmit, setValue, getValues, trigger, formState: { isValid } } = useForm(
    {
      mode: 'onChange',
      reValidateMode: 'onChange',
      resolver: yupResolver(facilityFinancingFormSchema),
    }
  );
  const { processId } = useIdentity();
  const { id } = useParams();
  const isDebtor = processId?.includes('DEBT');
  const searchParams = useSearchParams();
  const canEdit = searchParams.get('isEdit') === 'true';
  const isKonven = searchParams.get('isKonven') === 'true';
  const router = useCustomRouter();
  const pathname = usePathname();
  const modul = pathname.split('/')[3];
  const roleCanEdit = useCheckAccess(accessid.MAINTENANCE_DEBTOR_UPDATE);
  const isViewOnly = !roleCanEdit || isDebtor || !canEdit;

  const { recordActivity } = useRecordLog();

  useEffect(() => {
    recordActivity({
      activity: ActivityType.VIEW,
      menuCode: 'maintenance-customer',
      module: TypeModule.MAINTENANCE_DATA,
      process: TypeProcess.MAINTENANCE_CUSTOMER,
      remarks: 'view maintenance customer slik financing facility form ' + (isKonven ? 'konven' : 'syariah') + ' page',
    });
  }, []);

  const { data: slikFacilityDetail } = useGetSlikFacilityDetail({
    ...payloadFilterList(processId),
    facilityId: id,
  });

  const { data: creditFinancingnatureList } = useGetParameterList('creditFinancingnature', { label: 'value1', value: 'key' });

  const { data: creditFinancingtypeList } = useGetParameterList('creditFinancingtype', { label: 'value1', value: 'key' });

  const { data: creditFinancingcontractList } = useGetParameterList('creditFinancingcontract', { label: 'value1', value: 'key' });

  const { data: customerCategoryList } = useGetParameterList('customerCategory', { label: 'value1', value: 'key' });

  const { data: typeOfUsageList } = useGetParameterList('typeOfUsage', { label: 'value1', value: 'key' });

  const { data: orieantationOfusageList } = useGetParameterList('orieantationOfusage', { label: 'value1', value: 'key' });

  const { data: economicSectorList } = useGetParameterList('economicSector', { label: 'value1', value: 'key' });

  const { data: regionCodeList } = useGetParameterList('regionCode', { label: 'value1', value: 'key' });

  const { data: valutaList } = useGetParameterList('valuta', { label: 'value1', value: 'key' });

  const { data: financingRateList } = useGetParameterList('financingRate', { label: 'value1', value: 'key' });

  const { data: govProgramInterestRateList } = useGetParameterList('govProgramInterestRate', { label: 'value1', value: 'key' });

  const { data: customerClassificationList } = useGetParameterList('customerClassification', { label: 'value1', value: 'key' });

  const { data: creditQualityList } = useGetParameterList('creditQuality', { label: 'value1', value: 'key' });

  const { data: defaultResonList } = useGetParameterList('defaultReson', { label: 'value1', value: 'key' });

  const { data: restructureMethodeList } = useGetParameterList('restructureMethode', { label: 'value1', value: 'key' });

  const { data: conditionList } = useGetParameterList('condition', { label: 'value1', value: 'key' });

  // const { data: operationDataList } = useGetParameterList('dataOperation', { label: 'value1', value: 'key' });

  // const { data: operationDataList } = useGetParameterList('dataOperation', { label: 'value1', value: 'key' });


  useEffect(() => {
    const data = (slikFacilityDetail as any)?.data?.content;
    if (data) {
      reset({
        ...data,
        conditionDesc: conditionList?.find((item) =>
          item.value === data.condition)?.label,
        creditFinancingContractDesc: creditFinancingcontractList?.find((item) =>
          item.value === data.creditFinancingContract)?.label,
        creditFinancingNatureDesc: creditFinancingnatureList?.find((item) =>
          item.value === data.creditFinancingNature)?.label,
        creditFinancingTypeDesc: creditFinancingtypeList?.find((item) =>
          item.value === data.creditFinancingType)?.label,
        creditQualityDesc: creditQualityList?.find((item) =>
          item.value === data.creditQuality)?.label,


        currencyCodeDesc: valutaList?.find((item) =>
          item.value === data.currencyCode)?.label,


        customerCategoryDesc: customerCategoryList?.find((item) =>
          item.value === data.customerCategory)?.label,


        // takeoverSourceDesc: takeoverSourceList?.find((item) =>
        //   item.value === data.takeoverSource)?.label,
        customerClasificationDesc: customerClassificationList?.find((item) =>
          item.value === data.customerClasification)?.label,


        defaultReasonDesc: defaultResonList?.find((item) =>
          item.value === data.defaultReason)?.label,


        economicSectorDesc: economicSectorList?.find((item) =>
          item.value === data.economicSector)?.label,

        financingRateTypeDesc: financingRateList?.find((item) =>
          item.value === data.financingRateType)?.label,

        govermentRateDesc: govProgramInterestRateList?.find((item) =>
          item.value === data.govermentRate)?.label,


        orientationOfUsageDesc: orieantationOfusageList?.find((item) =>
          item.value === data.orientationOfUsage)?.label,
        regionCodeDesc: regionCodeList?.find((item) =>
          item.value === data.regionCode)?.label,
        restructureMethodeDesc: restructureMethodeList?.find((item) =>
          item.value === data.restructureMethode)?.label,
        typeOfUsageDesc: typeOfUsageList?.find((item) =>
          item.value === data.typeOfUsage)?.label,
        valutaDesc: valutaList?.find((item) =>
          item.value === data.valuta)?.label,
      });
    }

  }, [
    slikFacilityDetail,
    reset,
    conditionList,
    creditFinancingcontractList,
    creditFinancingnatureList,
    creditFinancingtypeList,
    creditQualityList,
    customerCategoryList,
    customerClassificationList,
    defaultResonList,
    economicSectorList,
    financingRateList,
    govProgramInterestRateList,
    orieantationOfusageList,
    regionCodeList,
    restructureMethodeList,
    typeOfUsageList,
    valutaList
  ]);

  const { mutate: saveSlikFacility } = useSaveSlikFacility(
    {
      onError: (error) => {
        recordActivity({
          activity: ActivityType.SAVE,
          bucketProcessId: processId,
          changeAfter: JSON.stringify(getValues()),
          changeBefore: JSON.stringify(slikFacilityDetail?.data?.content),
          module: TypeModule.MAINTENANCE_DATA,
          process: TypeProcess.MAINTENANCE_CUSTOMER,
          remarks: 'save failed maintenance customer slik financing facility form ' + (isKonven ? 'konven' : 'syariah') + ' page',
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
          changeBefore: JSON.stringify(slikFacilityDetail?.data?.content),
          module: TypeModule.MAINTENANCE_DATA,
          process: TypeProcess.MAINTENANCE_CUSTOMER,
          remarks: 'save success maintenance customer slik financing facility form ' + (isKonven ? 'konven' : 'syariah') + ' page',
        });
        showNiceModalV2({
          title: 'Data berhasil disimpan',
          type: 'success',
        });
      },
    }
  );

  const handleOnSave = async () => {
    const isFormValid = await trigger();
    if (!isFormValid) {
      showNiceModalV2({
        cancelText: 'Tidak',
        onSubmit: () => {
          saveSlikFacility({
            bucketProcessId: processId,
            ...getValues(),
            creditFinancingContractRemark: watch('creditFinancingContract') === '999'
              ? watch('creditFinancingContractRemark') : '',
            creditFinancingNatureRemark: watch('creditFinancingNature') === '9'
              ? watch('creditFinancingNatureRemark') : '',
            creditFinancingTypeRemark: watch('creditFinancingType') === 'P99' || watch('creditFinancingType') === 'N99'
              ? watch('creditFinancingTypeRemark') : '',
            defaultReasonRemark: watch('defaultReason') === '99'
              ? watch('defaultReasonRemark') : '',
            economicSectorRemark: watch('economicSector') === '009000'
              ? watch('economicSectorRemark') : '',
            facilityId: id,
            financingRateTypeRemark: watch('financingRateType') === '9'
              ? watch('financingRateTypeRemark') : '',
            orientationOfUsageRemark: watch('orientationOfUsage') === '3'
              ? watch('orientationOfUsageRemark') : '',
            regionCodeRemark: watch('regionCode') === '0000'
              ? watch('regionCodeRemark') : '',
          });
        },
        submitText: 'Ya',
        title: 'Terdapat DATA MANDATORY yang belum terisi, tetap simpan perubahan?',
        type: 'warning',
      });
    } else {
      saveSlikFacility({
        bucketProcessId: processId,
        ...getValues(),
        creditFinancingContractRemark: watch('creditFinancingContract') === '999'
          ? watch('creditFinancingContractRemark') : '',
        creditFinancingNatureRemark: watch('creditFinancingNature') === '9'
          ? watch('creditFinancingNatureRemark') : '',
        creditFinancingTypeRemark: watch('creditFinancingType') === 'P99' || watch('creditFinancingType') === 'N99'
          ? watch('creditFinancingTypeRemark') : '',
        defaultReasonRemark: watch('defaultReason') === '99'
          ? watch('defaultReasonRemark') : '',
        economicSectorRemark: watch('economicSector') === '009000'
          ? watch('economicSectorRemark') : '',
        facilityId: id,
        financingRateTypeRemark: watch('financingRateType') === '9'
          ? watch('financingRateTypeRemark') : '',
        orientationOfUsageRemark: watch('orientationOfUsage') === '3'
          ? watch('orientationOfUsageRemark') : '',
        regionCodeRemark: watch('regionCode') === '0000'
          ? watch('regionCodeRemark') : '',
      });
    }

  };

  const handleBackToListPage = () => {
    router.replace(replacePath(maintenanceDebtor.REGULATOR_DATA_SLIK_PAGE, {
      module: modul, processId,
    }));
  };

  const {
    data: bucketDetail,
  } = useGetBucketById({
    bucketProcessId: String(processId),
    module: TypeModule.MAINTENANCE_DATA,
    process: TypeProcess.MAINTENANCE_CUSTOMER,
  }, {
    enabled: !isDebtor,
  });

  const isEnabledDataDelta = useMemo(() => {
    let enabled = false;
    if ((!roleCanEdit) && !!bucketDetail?.debtorId) enabled = true;

    return enabled;
  }, [bucketDetail]);


  const { data: dataDelta, isSuccess: isSuccesDataDelta } = useGetDeltaDetailSlik({
    bucketProcessId: processId,
    component: 'slik-facility-financing',
    facilityId: id as string,
    module: TypeModule.MAINTENANCE_DATA,
    process: TypeProcess.MAINTENANCE_CUSTOMER,
  },
  {
    enabled: isEnabledDataDelta,
  });

  const delta = dataDelta?.data?.content;

  const findDataMaster = (inputKey: string, dropdownInputList?: {label: string; value: string}[]) => {
    let previousValue = null;
    if (delta?.differencesData?.some((el) => el?.field === inputKey) && isSuccesDataDelta) {
      const findPrevValues = delta?.differencesData?.find((el) => el?.field === inputKey)?.previousValue;
      if (findPrevValues === null || findPrevValues === undefined || findPrevValues === '') {
        previousValue = '-';
      } else {
        if (dropdownInputList?.length) {
          previousValue = dropdownInputList?.find((item) => item?.value === findPrevValues)?.label;
        } else {
          if (inputKey.includes('Date')) {
            previousValue = formatDate(findPrevValues);
          } else {
            previousValue = findPrevValues;
          }
        }
      }
    }
    return previousValue;
  };

  useEffect(() => {
    if (watch('defaultReason') !== '99') {
      setValue('defaultReasonRemark', '');
    }
    if (watch('creditQuality') !== '5') {
      setValue('defaultReasonRemark', '');
      setValue('nplDate', '');
      setValue('defaultReason', '');
      setValue('defaultReasonDesc', '');
    }
    if (watch('creditFinancingNature') !== '9') {
      setValue('creditFinancingNatureRemark', '');
    }
    if (watch('creditFinancingType') !== 'P99' && watch('creditFinancingType') !== 'N99') {
      setValue('creditFinancingTypeRemark', '');
    }
    if (watch('creditFinancingContract') !== '999') {
      setValue('creditFinancingContractRemark', '');
    }
    if (watch('orientationOfUsage') !== '3') {
      setValue('orientationOfUsageRemark', '');
    }
    if (watch('economicSector') !== '009000') {
      setValue('economicSectorRemark', '');
    }
    if (watch('regionCode') !== '0000') {
      setValue('regionCodeRemark', '');
    }
    if (watch('financingRateType') !== '9') {
      setValue('financingRateTypeRemark', '');
    }
  }, [
    watch('defaultReason'),
    watch('creditQuality'),
    watch('creditFinancingNature'),
    watch('creditFinancingType'),
    watch('creditFinancingContract'),
    watch('orientationOfUsage'),
    watch('economicSector'),
    watch('regionCode'),
    watch('financingRateType')
  ]);

  return {
    conditionList,
    control,
    creditFinancingcontractList,
    creditFinancingnatureList,
    creditFinancingtypeList,
    creditQualityList,
    customerCategoryList,
    customerClassificationList,
    defaultResonList,
    economicSectorList,
    financingRateList,
    findDataMaster,
    govProgramInterestRateList,
    handleBackToListPage,
    handleOnSave,
    handleSubmit,
    isValid,
    isViewOnly,
    orieantationOfusageList,
    regionCodeList,
    restructureMethodeList,
    setValue,
    theme,
    typeOfUsageList,
    valutaList,
    watch,
  };
};
