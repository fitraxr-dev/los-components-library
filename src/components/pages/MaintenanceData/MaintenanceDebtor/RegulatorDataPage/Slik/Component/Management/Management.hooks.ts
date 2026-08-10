import { useEffect, useMemo, useState } from 'react';

import { yupResolver } from '@hookform/resolvers/yup';
import { useTheme } from '@mui/material';
import { usePathname } from 'next/navigation';
import { useForm } from 'react-hook-form';

import { ONE_MINUTE } from '@/configs/constants/general';
import { accessid } from '@/configs/constants/pathname';
import { ActivityType } from '@/enums/Activity';
import { TypeModule, TypeProcess } from '@/enums/Module';
import { formatDateTime } from '@/helpers/date';
import { getLastPath } from '@/helpers/navigation';
import showNiceModalV2 from '@/helpers/showNiceModalV2';
import useGetCustomerInfoDataDelta from '@/hooks/services/maintenance-customer/useGetCustomerInfoDataDelta';
import useGetBucketById from '@/hooks/services/useGetBucketById';
import useGetDetailMasterDebtor from '@/hooks/services/useGetDetailMasterDebtor';
import useGetParameterList from '@/hooks/services/useGetParameterList';
import useApp from '@/hooks/useApp';
import useCheckAccess from '@/hooks/useCheckAccess';
import useIdentity from '@/hooks/useIdentity';
import useRecordLog from '@/hooks/useRecordLog';

import { payloadFilterList } from '../../../../ManagementShareholder/ManagementShareholder.constants';
import useGetDeltaDetailSlik from '../../hooks/useGetDeltaDetailSlik';

import useGetSlikManagementDetail from './hooks/useGetSlikManagementDetail';
import useGetSlikManagementList from './hooks/UseGetSlikManagementList';
import useSaveSlikManagement from './hooks/useSaveSlikManagement';
import { managementSchema, TableHeaderList } from './Management.constant';

import type { SearchValue } from '@/components/shared/Input/components/Search/Search.types';
import type { TableHeader } from '@/components/shared/Table/Table.types';


const useManagement = () => {
  const theme = useTheme();

  const [isSubmit, setIsSubmit] = useState<boolean>();
  const [activeDetail, setActiveDetail] = useState(false);
  const [idDetail, setidDetail] = useState(null);
  const roleCanEdit = useCheckAccess(accessid.MAINTENANCE_DEBTOR_UPDATE);
  const [{ stepper, currentRole }] = useApp();
  const pathname = usePathname();
  const isRM = currentRole.includes('STAFF');
  const enable =
    stepper.steps
      .find((step) => step.urlPath === 'regulator-data')?.childrenSteps
      .find((step) => step.urlPath === getLastPath(pathname))?.enable;
  const { processId } = useIdentity();
  const isDebtor = processId?.includes('DEBT');
  const isViewOnly = !enable || !roleCanEdit || isDebtor;

  const { recordActivity } = useRecordLog();

  useEffect(() => {
    recordActivity({
      activity: ActivityType.VIEW,
      menuCode: 'maintenance-customer',
      module: TypeModule.MAINTENANCE_DATA,
      process: TypeProcess.MAINTENANCE_CUSTOMER,
      remarks: 'view maintenance customer slik management page',
    });
  }, []);

  const anomalyRowStyle = (rowData: any) => ({
    backgroundColor: (rowData?.hasModified && !isRM) ? 'rgba(235, 87, 87, 0.2)' : 'inherit',
  });

  const { data: bucketDetail } = useGetBucketById({
    bucketProcessId: String(processId),
    module: TypeModule.MAINTENANCE_DATA,
    process: TypeProcess.MAINTENANCE_CUSTOMER,
  }, { enabled: !isDebtor });

  const [filter, setFilter] = useState<SearchValue>({});
  const [totalPage, setTotalPage] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const { data: operationDataList } = useGetParameterList('dataOperation', { label: 'value1', value: 'key' });
  const { data: sortByOptions } = useGetParameterList('sortManagementSlik', { label: 'value1', value: 'key' });
  const { data: searchByOptions } = useGetParameterList('searchManagementSlik', { label: 'value1', value: 'key' });

  // Now let's fix the dropdown cascade with better dependency tracking
  const config = { staleTime: ONE_MINUTE };
  const options = { label: 'value1', module: 'value2', value: 'key' };
  // Status dropdown
  const { data: statusDropdownList } = useGetParameterList('operationStatus', options, config);
  // Title dropdown
  const { data: titleDropdownList } = useGetParameterList('title', options, config);
  // Gender dropdown
  const { data: genderDropdownList } = useGetParameterList('gender', options, config);
  // Job Position dropdown
  const { data: positionDropdownList } = useGetParameterList('jobPosition', options, config);
  // Ethnic Origin dropdown
  const { data: ethnicOriginDropdownList } = useGetParameterList('ethnicOrigin', options, config);
  // ID Type dropdown
  const { data: idTypeDropdownList } = useGetParameterList('idDocType', options, config);
  //nationality dropdown
  const { data: nationalityDropDownList } = useGetParameterList('nationality', options, config);

  const tableHeader: TableHeader[] = [
    ...TableHeaderList,
    {
      key: 'action',
      label: 'Action',
      options: [
        {
          iconName: 'detail',
          onClick: (data) => {
            if (activeDetail) {
              if (idDetail !== data.managementCode) {
                setidDetail(data.managementCode);
              } else {
                setActiveDetail(false);
                setidDetail(null);
              }
            } else {
              setActiveDetail(true);
              setidDetail(data.managementCode);
            }
          },
        },
      ],
      sx: { minWidth: '10vw' },
      type: 'action',
    }
  ];

  const filterDropdownList = searchByOptions ?? [];
  const filterContentList = [
    {
      key: 'sortList',
      label: 'Urutkan Berdasarkan',
      options: sortByOptions ?? [],
      type: 'sort',
    },
    {
      endKey: 'endLastCheckedDate',
      key: 'lastCheckedDate',
      label: 'Last Checked Date',
      startKey: 'startLastCheckedDate',
      type: 'period',
    },
    {
      key: 'operationData',
      label: 'Operation Data',
      options: operationDataList ?? [],
      type: 'multiple-autocomplete',
    },
  ];

  const { data: slikManagementList, isLoading } = useGetSlikManagementList({
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

  const slikManagementData = slikManagementList?.data?.contents?.map((item) => ({
    ...item,
    lastCheckedDate: item.lastCheckedDate ? formatDateTime(item.lastCheckedDate) : '-',
    operationData: operationDataList?.find((data) => data.value === item.operationData)?.label,
  }));

  const { control, reset, getValues, setValue, watch, trigger, formState: { isValid } } = useForm({
    mode: 'onChange',
    resolver: yupResolver(managementSchema),
  });

  const { data: slikManagementDetail } = useGetSlikManagementDetail({
    bucketProcessId: isDebtor ? bucketDetail?.bucketProcessId : processId,
    debtorId: isDebtor ? processId : bucketDetail?.debtorId,
    isSlik: true,
    managementCode: idDetail,
    module: TypeModule.MAINTENANCE_DATA,
    process: TypeProcess.MAINTENANCE_CUSTOMER,
  }, { enabled: activeDetail }

  );


  const checkingTypeOfData = (data) => {
    const checkedData = data ? (typeof data === 'object' ? data?.value : data) : null;
    return checkedData;
  };

  const { data: provinceDropdownList } = useGetParameterList('province', options);
  const { data: countryDropdownList } = useGetParameterList('country', options);

  const otherCountry = useMemo(() => {
    if (!!watch('country') && countryDropdownList?.length) {
      const isOtherCountry = getValues('country') !== 'ID';
      return isOtherCountry;
    }
  }, [watch('country')]);

  // onChange district by province
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

  const { data: regionCodeDropdownList } = useGetParameterList('regionCode', options);

  // onChange subDistrict by district
  const districtModule = useMemo(() => {
    const cityValue = checkingTypeOfData(watch('district'));
    const districtData = cityDropdownList?.find((item) => item.value === cityValue)?.module;
    return districtData;
  }, [cityDropdownList, watch('district')]);

  const { data: districtDropdownList } = useGetParameterList(districtModule, {
    ...options, config:
      { enabled: !!districtModule },
  });

  const subDistrictModule = useMemo(() => {
    const districtValue = checkingTypeOfData(watch('subDistrict'));
    const subDistrictData = districtDropdownList?.find((item) => item.value === districtValue)?.module;
    return subDistrictData;
  }, [districtDropdownList, watch('subDistrict')]);

  const { data: subDistrictDropdownList } = useGetParameterList(subDistrictModule, {
    ...options, config:
      { enabled: !!subDistrictModule },
  });

  // onChange postalCode by village
  useEffect(() => {
    const subDistrictValue = checkingTypeOfData(watch('village'));
    const postCodeData = subDistrictDropdownList?.find((item) => item.value === subDistrictValue)?.module;
    const value = (otherCountry && !!watch('village')) ? '00000' : postCodeData;
    setValue('postalCode', value);
  }, [subDistrictDropdownList, watch('village')]);

  const { mutate: saveSlikManagement } = useSaveSlikManagement({
    onError: (error: any) => {
      recordActivity({
        activity: ActivityType.SAVE,
        bucketProcessId: processId,
        changeAfter: JSON.stringify(getValues()),
        changeBefore: JSON.stringify(slikManagementDetail?.data?.content),
        module: TypeModule.MAINTENANCE_DATA,
        process: TypeProcess.MAINTENANCE_CUSTOMER,
        remarks: 'save failed maintenance customer slik management page',
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
        changeBefore: JSON.stringify(slikManagementDetail?.data?.content),
        module: TypeModule.MAINTENANCE_DATA,
        process: TypeProcess.MAINTENANCE_CUSTOMER,
        remarks: 'save success maintenance customer slik management page',
      });
      if (!isSubmit) {
        showNiceModalV2({
          title: 'Data berhasil disimpan',
          type: 'success',

        });
      }
      setIsSubmit(undefined);
    },
  });

  const handleSaveDetailManagement = async (value: boolean) => {
    setIsSubmit(value);
    const isFormValid = await trigger();
    if (!isFormValid && !value) {
      showNiceModalV2({
        cancelText: 'Tidak',
        onSubmit: () => {
          const payload = {
            bucketProcessId: isDebtor ? bucketDetail?.bucketProcessId : processId,
            debtorId: isDebtor ? processId : bucketDetail?.debtorId,
            districtSlik: watch('districtSlik'),
            jobPositionSlik: watch('jobPositionSlik'),
            managementCode: idDetail,
            module: TypeModule.MAINTENANCE_DATA,
            operationData: watch('operationData'),
            ownershipShare: watch('ownershipShare'),
            process: TypeProcess.MAINTENANCE_CUSTOMER,
          };
          saveSlikManagement(payload);
        },
        submitText: 'Ya',
        title: 'Terdapat DATA MANDATORY yang belum terisi, tetap simpan perubahan?',
        type: 'warning',
      });
    } else {
      const payload = {
        bucketProcessId: isDebtor ? bucketDetail?.bucketProcessId : processId,
        debtorId: isDebtor ? processId : bucketDetail?.debtorId,
        districtSlik: watch('districtSlik'),
        jobPositionSlik: watch('jobPositionSlik'),
        managementCode: idDetail,
        module: TypeModule.MAINTENANCE_DATA,
        operationData: watch('operationData'),
        ownershipShare: watch('ownershipShare'),
        process: TypeProcess.MAINTENANCE_CUSTOMER,
      };
      saveSlikManagement(payload);
    }
  };

  const isEnabledDataDelta = useMemo(() => {
    let enabled = false;
    if ((!roleCanEdit) && !!bucketDetail?.debtorId) enabled = true;

    return enabled;
  }, [bucketDetail]);


  const { data: dataDelta, isSuccess: isSuccesDataDelta } = useGetDeltaDetailSlik({
    bucketProcessId: processId,
    component: 'slik-management',
    managementCode: idDetail,
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
          previousValue = findPrevValues;
        }
      }
    }
    return previousValue;
  };

  useEffect(() => {
    let body = {};
    const data = (slikManagementDetail as any)?.data?.content;
    if (idDetail && slikManagementDetail) {
      body = {
        ...data,
        countryDesc: countryDropdownList?.find((item) => item.value === data?.country)?.label,
        districtDesc: regionCodeDropdownList?.find((item) => item.value === data?.districtSlik)?.label,
        idDocument: data?.idDocument?.document ? {
          extension: `.${data?.idDocument?.documentExtension}`,
          name: data?.idDocument?.documentName,
          url: data?.idDocument?.document,
        } : null,
        idTypeDesc: idTypeDropdownList?.find((item) => item.value === data?.idType)?.label,
        jobPositionDesc: positionDropdownList?.find((item) => item.value === data?.jobPositionSlik)?.label,
        npwpDocument: data?.npwpDocument?.document ? {
          extension: `.${data?.npwpDocument?.documentExtension}`,
          name: data?.npwpDocument?.documentName,
          url: data?.npwpDocument?.document,
        } : null,
        operationDataDesc: operationDataList?.find((item) => item.value === data?.operationData)?.label,
        statusDesc: statusDropdownList?.find((item) => item.value === data?.status)?.label,
      };
      reset(body);
    }
  }, [idDetail, slikManagementDetail, reset, operationDataList, cityDropdownList]);

  return {
    activeDetail,
    anomalyRowStyle,
    cityDropdownList,
    control,
    countryDropdownList,
    currentPage,
    districtDropdownList,
    ethnicOriginDropdownList,
    filter,
    filterContentList,
    filterDropdownList,
    findDataMaster,
    genderDropdownList,
    handleSaveDetailManagement,
    idTypeDropdownList,
    isLoading,
    isValid,
    isViewOnly,
    nationalityDropDownList,
    operationDataList,
    otherCountry,
    positionDropdownList,
    provinceDropdownList,
    regionCodeDropdownList,
    setCurrentPage,
    setFilter,
    setPageSize,
    setValue,
    slikManagementData,
    slikManagementList,
    statusDropdownList,
    subDistrictDropdownList,
    tableHeader,
    theme,
    titleDropdownList,
    totalPage,
    watch,
  };
};

export default useManagement;
