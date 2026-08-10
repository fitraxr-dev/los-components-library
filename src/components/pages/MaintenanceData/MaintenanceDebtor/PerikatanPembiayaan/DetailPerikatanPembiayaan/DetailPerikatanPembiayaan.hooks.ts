import { useEffect, useMemo, useRef, useState } from 'react';

import { useTheme } from '@mui/material';
import { usePathname } from 'next/navigation';
import { useForm } from 'react-hook-form';

import { ActivityType } from '@/enums/Activity';
import { TypeModule, TypeProcess } from '@/enums/Module';
import useGetParameterList from '@/hooks/services/useGetParameterList';
import useIdentity from '@/hooks/useIdentity';
import useRecordLog from '@/hooks/useRecordLog';

import { useMaintenanceDataContext } from '@/components/layouts/MaintenanceData/MaintenanceData.context';
import useGetListFinancingPk from '@/components/shared/SmiSection/PK/hooks/useGetListFinancingPk';

import { payloadFilterList } from '../../ManagementShareholder/ManagementShareholder.constants';
import useGetPerikatanAkadDetail from '../hooks/useGetPerikatanAkadDetail';
import useGetPerikatanAkadList from '../hooks/useGetPerikatanAkadList';

import type { SearchValue } from '@/components/shared/Input/components/Search/Search.types';


const useDetailPerikatanPembiayaan = () => {

  const { control, reset, setValue, watch } = useForm({
    defaultValues: {
      commercialDescription: [],
      description: '',
      otherCommercialDescription: '',
    },
  });

  const pendingCommercialValues = useRef<string[] | null>(null);
  const theme = useTheme();
  const { processId } = useIdentity();
  const { handleSetBreadcrumb } = useMaintenanceDataContext();
  const pathname = usePathname();
  const modul = pathname.split('/')[3];
  const noPk = pathname.split('/')[pathname.split('/').length - 1];

  const [pageNo, setPageNo] = useState(1);
  const [filter, setFilter] = useState<SearchValue>({});
  const [pageSize, setPageSize] = useState(100);

  const description = watch('description');
  const commercialDescription = watch('commercialDescription');
  const [hasOther, setHasOther] = useState(false);

  const { recordActivity } = useRecordLog();

  useEffect(() => {
    recordActivity({
      activity: ActivityType.VIEW,
      menuCode: 'maintenance-customer',
      module: TypeModule.MAINTENANCE_DATA,
      process: TypeProcess.MAINTENANCE_CUSTOMER,
      remarks: 'view maintenance customer detail perikatan pembiayaan page',
    });
  }, []);

  const { data: dataCommercialDescriptionList } = useGetParameterList('komersialDescriptionPKProcessingType');

  const commercialDescriptionList = [
    ...(dataCommercialDescriptionList || []),
    { label: 'Other', value: 'OTHER' },
  ];

  useEffect(() => {
    if (Array.isArray(commercialDescription)) {
      const foundOther = commercialDescription?.some((item) => item && item.includes('OTHER'));
      setHasOther(foundOther);
    }
  }, [commercialDescription, description]);


  useEffect(() => {
    handleSetBreadcrumb([
      { label: 'Perikatan Pembiayaan atau Akad', url: '/maintenance-data/maintenance-debtor/' + modul + '/' + processId + '/perikatan-pembiayaan' },
      { label: 'Detail Perikatan Pembiayaan atau Akad', url: '' },
    ]);
  }, []);

  const {
    data: perikatanAkadList,
    isSuccess: isSuccessPerikatanAkadList,
    isFetching: isFetchingPerikatanAkadList,
    isLoading: isLoadingPerikatanAkadList,
  } = useGetPerikatanAkadList({
    filter: {
      ...payloadFilterList(processId),
    },
    page: {
      itemPerPage: 1,
      noPage: 1,
    },
    searchDetail: { key: 'bucketProcessId', value: decodeURIComponent(noPk) },
  });

  useEffect(() => {
    const isNotReady = isLoadingPerikatanAkadList || isFetchingPerikatanAkadList
      || !isSuccessPerikatanAkadList || !perikatanAkadList;
    if (isNotReady) return;

    const data = (perikatanAkadList as any)?.data?.contents[0];

    if (!data) return;

    const standarCategories = [
      'BUNGA',
      'AVAILABILITY_PERIOD',
      'JANGKA_WAKTU',
      'GRACE_PERIOD',
      'FEE',
      'PLAFOND',
    ];

    const apiCommercialDesc = data?.commercialDescription || [];

    const commercialArray = Array.isArray(apiCommercialDesc)
      ? apiCommercialDesc
      : apiCommercialDesc.split(',');

    const standardValues = commercialArray.filter((item) => standarCategories.includes(item));

    const otherValue = commercialArray.find(
      (item) => item && !standarCategories.includes(item) && item !== 'OTHER'
    ) || '';

    if (otherValue && !standardValues.includes('OTHER')) {
      standardValues.push('OTHER');
    }
    pendingCommercialValues.current = standardValues;

    reset({
      ...data,
      commercialDescription: standardValues,
      description: data.description,
      otherCommercialDescription: otherValue,
    });


  }, [perikatanAkadList, isSuccessPerikatanAkadList, isFetchingPerikatanAkadList, isLoadingPerikatanAkadList]);

  useEffect(() => {
    if (description?.toUpperCase() === 'KOMERSIAL' && pendingCommercialValues.current !== null) {
      setValue('commercialDescription', pendingCommercialValues.current);
    }

  }, [description]);

  const [contents, setContents] = useState([]);

  const { data: facilityListContents } = useGetPerikatanAkadDetail(
    {
      filter: {
        bucketProcessId: (perikatanAkadList as any)?.data?.contents[0]?.pkId,
        module: TypeProcess.ENGAGEMENT_AGREEMENT,
        process: TypeProcess.ENGAGEMENT_AGREEMENT,
      },
      page: {
        itemPerPage: pageSize,
        noPage: pageNo,
      },
    },
    {
      bucketParentId: (perikatanAkadList as any)?.data?.contents[0]?.pkId,
    },
    (perikatanAkadList as any)?.data?.contents[0]?.bucketProcessId || '',
    true
  );

  function formatNumberWithCommas(value: number): string {
    return value.toLocaleString('en-US', {
      maximumFractionDigits: 2,
      minimumFractionDigits: 2,
    });
  }

  const filteredFacilityListContents = useMemo(
    () => facilityListContents.filter((res) => res !== undefined),
    [facilityListContents]
  );

  useEffect(() => {
    if (filteredFacilityListContents) {
      const transformedData = filteredFacilityListContents.map((data) => ({
        ...data,
        totalOrderValue: formatNumberWithCommas(data?.totalOrderValue || 0),
      }));
      setContents(transformedData);
    }
  }, [filteredFacilityListContents]);

  const [totalOrder, setTotalOrder] = useState('');
  useEffect(() => {
    if (filteredFacilityListContents) {
      const totalOrderValue = calculateTotalOrderValue(filteredFacilityListContents);
      setTotalOrder(`IDR ${totalOrderValue}`);
    }
  }, [filteredFacilityListContents]);

  function calculateTotalOrderValue(facilityList: any[]) {
    let totalOrderValue = BigInt(0);

    facilityList.forEach((facility) => {
      const orderValue = facility?.totalOrderValue
        ? facility?.totalOrderValue
        : 0;

      totalOrderValue += BigInt(orderValue);
    });

    return totalOrderValue.toLocaleString('en-US', {
      maximumFractionDigits: 2,
      minimumFractionDigits: 2,
    });
  }

  return {
    commercialDescriptionList,
    contents,
    control,
    description,
    facilityListContents,
    hasOther,
    pageNo,
    pageSize,
    setPageNo,
    setPageSize,
    theme,
    totalOrder,
  };
};

export default useDetailPerikatanPembiayaan;
