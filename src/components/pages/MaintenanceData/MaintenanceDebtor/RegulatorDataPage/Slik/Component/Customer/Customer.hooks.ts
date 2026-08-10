import { useEffect, useMemo, useState } from 'react';

import { yupResolver } from '@hookform/resolvers/yup';
import { useTheme } from '@mui/material';
import { usePathname } from 'next/navigation';
import { useForm } from 'react-hook-form';

import { accessid } from '@/configs/constants/pathname';
import { ActivityType } from '@/enums/Activity';
import { TypeModule, TypeProcess } from '@/enums/Module';
import { formatDate } from '@/helpers/date';
import { getLastPath } from '@/helpers/navigation';
import showNiceModalV2 from '@/helpers/showNiceModalV2';
import useGetCustomerInfoDataDelta from '@/hooks/services/maintenance-customer/useGetCustomerInfoDataDelta';
import useGetBucketById from '@/hooks/services/useGetBucketById';
import useGetDetailMasterDebtor from '@/hooks/services/useGetDetailMasterDebtor';
import useGetParameterList from '@/hooks/services/useGetParameterList';
import useApp from '@/hooks/useApp';
import useAutoSaveDraft from '@/hooks/useAutoSaveDraft';
import useCheckAccess from '@/hooks/useCheckAccess';
import useIdentity from '@/hooks/useIdentity';
import { parsePhoneFields, serializePhoneFields } from '@/hooks/useParsePhoneNumber';
import useRecordLog from '@/hooks/useRecordLog';
import { DataDeltaGetDtoComponentEnum } from '@/services/openapi/master-service';

import { payloadFilterList } from '../../../../ManagementShareholder/ManagementShareholder.constants';
import useGetDeltaDetailSlik from '../../hooks/useGetDeltaDetailSlik';

import { customerSchema } from './Customer.constant';
import useGetListGroup from './hooks/useGetListGroup';
import useGetSlikCustomerDetail from './hooks/useGetSlikCustomerDetail';
import useSaveSlikCustomer from './hooks/useSaveSlikCustomer';

import type { SearchValue } from '@/components/shared/Input/components/Search/Search.types';


const useCustomer = () => {
  const theme = useTheme();
  const { processId } = useIdentity();
  const isDebtor = processId?.includes('DEBT');
  const { data: debtorData } = useGetDetailMasterDebtor({ debtorId: String(processId) }, { enabled: isDebtor });
  const roleCanEdit = useCheckAccess(accessid.MAINTENANCE_DEBTOR_UPDATE);
  const pathname = usePathname();
  const [{ stepper }] = useApp();
  const enable =
    stepper.steps
      .find((step) => step.urlPath === 'regulator-data')?.childrenSteps
      .find((step) => step.urlPath === getLastPath(pathname))?.enable;

  const isViewOnly = !enable || !roleCanEdit || isDebtor;

  const [isSubmit, setIsSubmit] = useState<boolean>(false);

  const { data: legalEntityTypeList } = useGetParameterList('legalEntitytype');
  const { data: economicSectorList } = useGetParameterList('economicSector');
  const { data: relationshipReporterList } = useGetParameterList('relationshipReporter');
  const { data: customerClassificationList } = useGetParameterList('customerClassification');
  const { data: ratingRateList } = useGetParameterList('slikRating');
  const { data: ratingAgencyList } = useGetParameterList('slikRatingAgency');

  const { recordActivity } = useRecordLog();

  useEffect(() => {
    recordActivity({
      activity: ActivityType.VIEW,
      menuCode: 'maintenance-customer',
      module: TypeModule.MAINTENANCE_DATA,
      process: TypeProcess.MAINTENANCE_CUSTOMER,
      remarks: 'view maintenance customer slik customer page',
    });
  }, []);

  const { data: slikCustomerDetail, isLoading: isLoadingSlikCustomerDetail } = useGetSlikCustomerDetail(
    payloadFilterList(processId)
  );

  const {
    control,
    reset,
    watch,
    setValue,
    getValues,
    trigger,
    getFieldState,
    formState: { isValid, errors },
  } = useForm({
    mode: 'onChange',
    resolver: yupResolver(customerSchema),
  });

  // Watch all form values untuk autosave
  const watchedValues = watch();

  const [filter, setFilter] = useState<SearchValue>({});
  const [totalPage, setTotalPage] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const options = { label: 'value1', module: 'value2', value: 'key' };

  const { data: listGroup, isLoading: isLoadingListGroup } = useGetListGroup({
    filter: {
      ...payloadFilterList(processId, filter),
    },
    page: {
      itemPerPage: pageSize,
      noPage: currentPage,
    },
    searchDetail: filter?.searchDetail ?? undefined,
    sortList: filter?.sortList ?? undefined,
  });
  const { data: countryDropdownList } = useGetParameterList('country', options);
  const { data: regionCodeDropdownList } = useGetParameterList('regionCode', options);

  useEffect(() => {
    let body = {};
    body = {
      ...slikCustomerDetail?.data?.content,
      businessFieldDesc: economicSectorList?.find((item) =>
        item.value === slikCustomerDetail?.data?.content?.businessField)?.label,
      businessTypeDesc: legalEntityTypeList?.find((item) =>
        item.value === slikCustomerDetail?.data?.content?.businessType)?.label,
      countryDesc: countryDropdownList?.find((item) =>
        item.value === slikCustomerDetail?.data?.content?.country)?.label,
      customerGroupDesc: customerClassificationList?.find((item) =>
        item.value === slikCustomerDetail?.data?.content?.customerGroup)?.label,
      customerRatingDesc: ratingRateList?.find((item) =>
        item.value === slikCustomerDetail?.data?.content?.customerRating)?.label,
      districtDesc: regionCodeDropdownList?.find((item) =>
        item.value === slikCustomerDetail?.data?.content?.districtSlik)?.label,
      officeCellular: parsePhoneFields(slikCustomerDetail?.data?.content?.officerCell ?? ''),
      ratingAgencyDesc: ratingAgencyList?.find((item) =>
        item.value === slikCustomerDetail?.data?.content?.ratingAgency)?.label,
      relationWithReporterDesc: relationshipReporterList?.find((item) =>
        item.value === slikCustomerDetail?.data?.content?.relationWithReporter)?.label,
      telephone: parsePhoneFields(slikCustomerDetail?.data?.content?.phoneNumber ?? ''),
    };
    reset(body);
  }, [slikCustomerDetail,
    economicSectorList,
    legalEntityTypeList,
    customerClassificationList,
    relationshipReporterList,
    countryDropdownList,
    regionCodeDropdownList,
    ratingRateList,
    ratingAgencyList]);

  const checkingTypeOfData = (data) => {
    const checkedData = data ? (typeof data === 'object' ? data?.value : data) : null;
    return checkedData;
  };

  const { data: provinceDropdownList } = useGetParameterList('province', options);
  const { data: countryCodeList } = useGetParameterList('countryCode', options);


  const otherCountry = useMemo(() => {
    if (!!watch('country') && countryDropdownList?.length) {
      const isOtherCountry = getValues('country') !== 'ID';
      return isOtherCountry;
    }
  }, [watch('country')]);

  // onChange city by province
  const cityModule = useMemo(() => {
    const provinceValue = checkingTypeOfData(watch('province'));
    const cityData = provinceDropdownList?.find((item) => item.value === provinceValue)?.module;
    return cityData;
  }
  , [provinceDropdownList, watch('province')]);

  const { data: cityDropdownList } = useGetParameterList(cityModule, {
    ...options, config:
      { enabled: !!cityModule },
  });

  // onChange district by city
  const districtModule = useMemo(() => {
    const cityValue = checkingTypeOfData(watch('city'));
    const districtData = cityDropdownList?.find((item) => item.value === cityValue)?.module;
    return districtData;
  }, [cityDropdownList, watch('city')]);

  const { data: districtDropdownList } = useGetParameterList(districtModule, {
    ...options, config:
      { enabled: !!districtModule },
  });

  const subDistrictModule = useMemo(() => {
    const districtValue = checkingTypeOfData(watch('district'));
    const subDistrictData = districtDropdownList?.find((item) => item.value === districtValue)?.module;
    return subDistrictData;
  }, [districtDropdownList, watch('district')]);

  const { data: subDistrictDropdownList } = useGetParameterList(subDistrictModule, {
    ...options, config:
      { enabled: !!subDistrictModule },
  });

  // onChange postalCode by subDistrict
  useEffect(() => {
    const subDistrictValue = checkingTypeOfData(watch('subDistrict'));
    const postCodeData = subDistrictDropdownList?.find((item) => item.value === subDistrictValue)?.module;
    const value = (otherCountry && !!watch('subDistrict')) ? '00000' : postCodeData;
    setValue('postalCode', value);
  }, [subDistrictDropdownList, watch('subDistrict')]);

  // Auto-save payload
  const autoSavePayload = useMemo(() => () => {
    const payload = {
      bucketProcessId: processId,
      businessField: watchedValues.businessField,
      businessFieldRemark: watchedValues.businessField === '009000' ? watchedValues.businessFieldRemark : undefined,
      businessType: watchedValues.businessType,
      businessTypeRemark: watchedValues.businessType === '99' ? watchedValues.businessTypeRemark : undefined,
      customerGroup: watchedValues.customerGroup,
      customerRating: watchedValues.customerRating,
      ratingAgency: watchedValues.ratingAgency,
      ratingDate: watchedValues.ratingDate ? new Date(watchedValues.ratingDate).toISOString() : undefined,
      relationWithReporter: watchedValues.relationWithReporter,
      telephone: serializePhoneFields(watchedValues.telephone),
    };

    return Promise.resolve(payload);
  }, [
    processId,
    watchedValues.businessField,
    watchedValues.businessFieldRemark,
    watchedValues.businessType,
    watchedValues.businessTypeRemark,
    watchedValues.customerGroup,
    watchedValues.customerRating,
    watchedValues.ratingAgency,
    watchedValues.ratingDate,
    watchedValues.relationWithReporter,
    watchedValues.telephone,
  ]);

  // Auto-save hook
  const { isFetching: isAutoSaveFetching } = useAutoSaveDraft({
    isActive: !!slikCustomerDetail && !isViewOnly,
    payload: autoSavePayload,
    url: 'master.regulatorData.saveSlikCustomer',
  });

  const { mutate: saveSlikCustomer, isPending: isSavePending } = useSaveSlikCustomer({
    onError: (error: any) => {
      recordActivity({
        activity: ActivityType.SAVE,
        bucketProcessId: processId,
        changeAfter: JSON.stringify(getValues()),
        changeBefore: JSON.stringify(slikCustomerDetail?.data?.content),
        module: TypeModule.MAINTENANCE_DATA,
        process: TypeProcess.MAINTENANCE_CUSTOMER,
        remarks: 'save failed maintenance customer slik customer page',
      });
      showNiceModalV2({
        title: error?.message,
        type: 'error',
      });
    },
    onSuccess: () => {
      if (!isSubmit) {
        recordActivity({
          activity: ActivityType.SAVE,
          bucketProcessId: processId,
          changeAfter: JSON.stringify(getValues()),
          changeBefore: JSON.stringify(slikCustomerDetail?.data?.content),
          module: TypeModule.MAINTENANCE_DATA,
          process: TypeProcess.MAINTENANCE_CUSTOMER,
          remarks: 'save success maintenance customer slik customer page',
        });
        showNiceModalV2({
          title: 'Data berhasil disimpan',
          type: 'success',
        });
      }
      setIsSubmit(false);
    },
  });
  const handleSave = async (value: boolean) => {
    setIsSubmit(value);

    // 🔥 WAJIB: trigger validation dulu
    const isFormValid = await trigger();

    const values = getValues();

    const payload = {
      bucketProcessId: processId,
      businessField: values.businessField,
      businessFieldRemark:
        values.businessField === '009000'
          ? values.businessFieldRemark
          : undefined,
      businessType: values.businessType,
      businessTypeRemark:
        values.businessType === '99'
          ? values.businessTypeRemark
          : undefined,
      customerGroup: values.customerGroup,
      customerRating: values.customerRating,
      districtSlik: values.districtSlik,
      ratingAgency: values.ratingAgency,
      ratingDate: values.ratingDate
        ? new Date(values.ratingDate).toISOString()
        : undefined,
      relationWithReporter: values.relationWithReporter,
      telephone: serializePhoneFields(values.telephone),
    };

    // 🔥 mapping error biar jelas
    const errorMessages = Object.entries(errors ?? {}).map(
      ([field, error]) => ({
        field,
        message:
          (error as { message?: string })?.message ??
          'Validation error',
      })
    );

    console.log('[handleSave DEBUG]', {


      errorMessages,


      // 🔥 ini yang valid
      errors,
      // dari formState (kadang misleading)
      isFormValid,
      isValid,
    });

    if (!isFormValid && !value) {
      showNiceModalV2({
        cancelText: 'Tidak',
        onSubmit: () => {
          saveSlikCustomer(payload);
        },
        submitText: 'Ya',
        title: 'Terdapat DATA MANDATORY yang belum terisi, tetap simpan perubahan?',
        type: 'warning',
      });
    } else {
      saveSlikCustomer(payload);
    }
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
    component: 'slik-customer',
    module: TypeModule.MAINTENANCE_DATA,
    process: TypeProcess.MAINTENANCE_CUSTOMER,
  },
  {
    enabled: isEnabledDataDelta,
  });

  const delta = dataDelta?.data?.content;

  const findDataMaster = (inputKey: string, dropdownInputList?: { label: string; value: string }[]) => {
    let previousValue = null;
    if (delta?.differencesData?.some((el) => el?.field === inputKey) && isSuccesDataDelta) {
      const findPrevValues = delta?.differencesData?.find((el) => el?.field === inputKey)?.previousValue;
      if (findPrevValues === null) {
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

  return {
    cityDropdownList,
    control,
    countryCodeList,
    countryDropdownList,
    currentPage,
    customerClassificationList,
    debtorData,
    districtDropdownList,
    economicSectorList,
    filter,
    findDataMaster,
    handleSave,
    isAutoSaveFetching,
    isDebtor,
    isLoadingListGroup,
    isLoadingSlikCustomerDetail,
    isSavePending,
    isValid,
    isViewOnly,
    legalEntityTypeList,
    listGroup,
    otherCountry,
    pageSize,
    provinceDropdownList,
    ratingAgencyList,
    ratingRateList,
    regionCodeDropdownList,
    relationshipReporterList,
    roleCanEdit,
    setCurrentPage,
    setFilter,
    setPageSize,
    setTotalPage,
    setValue,
    subDistrictDropdownList,
    theme,
    totalPage,
    watch,
  };
};
export default useCustomer;
