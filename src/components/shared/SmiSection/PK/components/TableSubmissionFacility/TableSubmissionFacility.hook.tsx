import { useEffect, useState } from 'react';

import { useTheme } from '@mui/material';
import { usePathname } from 'next/navigation';

import { legalSigning } from '@/configs/constants/pathname';
import { TypeProcess } from '@/enums/Module';
import useIdentity from '@/hooks/useIdentity';

import useGetListFinancingPk from '../../hooks/useGetListFinancingPk';

import type { TableHeader } from '@/components/shared/Table/Table.types';
import type { ListFinancingFacilityResponseDto } from '@/services/openapi/bucket-service';


const useTableSubmissionFacility = () => {
  const isLoading = false;
  const { processId, childId, parentId } = useIdentity();
  const theme = useTheme();
  const [totalOrder, setTotalOrder] = useState('');
  const [contents, setContents] = useState([]);
  const path = usePathname();

  const currentPathModule = path?.split('/')[2];
  const pathModuleLegalSigning = legalSigning.LIST_PAGE?.split('/')[2];
  const isLegalSigning = currentPathModule === pathModuleLegalSigning;

  const { data: facilityListContents } = useGetListFinancingPk(
    {
      filter: {
        bucketProcessId: isLegalSigning ? parentId : processId,
        module: TypeProcess.ENGAGEMENT_AGREEMENT,
        process: TypeProcess.ENGAGEMENT_AGREEMENT,
      },
      page: {
        itemPerPage: 150,
        noPage: 1,
      },
    },
    {
      bucketParentId: isLegalSigning ? parentId : processId,
    }
  );

  const tableHeader: Array<TableHeader> = [
    {
      key: 'index',
      label: 'No',
      sx: { minWidth: '3.5vw' },
      type: 'index',
    },
    {
      key: 'pkName',
      label: 'Nama PK',
      sx: { minWidth: '7.5vw' },
    },
    {
      key: 'facilityId',
      label: 'ID Fasilitas',
      sx: { minWidth: '7.5vw' },
    },
    {
      key: 'orderTypeLabel',
      label: 'Order Type',
      sx: { minWidth: '7.5vw' },
    },
    {
      key: 'mappingOrderTypeLabel',
      label: 'Mapping Order Type',
      sx: { minWidth: '12.5vw' },
    },
    {
      key: 'financingSegmentLabel',
      label: 'Segmen Pembiayaan',
      sx: { minWidth: '12vw' },
    },
    {
      key: 'mappingFinancingSegmentLabel',
      label: 'CORE Mapping Segmen Pembiayaan',
      sx: { minWidth: '19.5vw' },
    },
    {
      key: 'productLabel',
      label: 'Produk/Skema Pembiayaan',
      sx: { minWidth: '10vw' },
    },
    {
      key: 'totalOrderValue',
      label: 'Nominal',
      sx: { minWidth: '7.5vw' },
    },
    {
      key: 'timePeriod',
      label: 'Jangka Waktu',
      sx: { minWidth: '9vw' },
    },
    {
      key: 'projectName',
      label: 'Proyek',
      sx: { minWidth: '7.5vw' },
    },
  ];

  function formatNumberWithCommas(value: number): string {
    return value.toLocaleString('en-US', {
      maximumFractionDigits: 2,
      minimumFractionDigits: 2,
    });
  }

  function calculateTotalOrderValue(facilityList: ListFinancingFacilityResponseDto[]) {
    let totalOrderValue = 0;

    facilityList.forEach((facility) => {
      // Ambil dari facility.totalOrderValue
      const orderValue = facility.totalOrderValue ? facility.totalOrderValue : 0;

      // Add the orderValue to the total
      totalOrderValue += orderValue;
    });

    // Format totalOrderValue with commas and two decimal places
    const formattedTotal = totalOrderValue.toLocaleString('en-US', {
      maximumFractionDigits: 2,
      minimumFractionDigits: 2,
    });

    return formattedTotal;
  }

  useEffect(() => {
    if (facilityListContents) {
      const facilityList = facilityListContents;
      const totalOrderValue = calculateTotalOrderValue(facilityList);
      setTotalOrder('IDR' + ' ' + totalOrderValue);
    }
  }, [facilityListContents]);

  useEffect(() => {
    if (facilityListContents) {
      const transformedData = facilityListContents.map((data) => {
        return {
          ...data,
          totalOrderValue: data?.currencyOrderValueAfterExchangeRate + ' ' + formatNumberWithCommas(data?.totalOrderValue || 0),
        };
      });
      setContents(transformedData);
    }
  }, [facilityListContents]);

  return {
    facilityListContents: contents,
    isLoading,
    tableHeader,
    theme,
    totalOrder,
  };
};

export default useTableSubmissionFacility;
