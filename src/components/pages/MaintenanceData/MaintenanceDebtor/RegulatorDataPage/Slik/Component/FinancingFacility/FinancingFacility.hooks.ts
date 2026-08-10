import { useEffect, useMemo, useState } from 'react';

import { useTheme } from '@mui/material';
import { usePathname } from 'next/navigation';

import { accessid, maintenanceDebtor } from '@/configs/constants/pathname';
import { ActivityType } from '@/enums/Activity';
import { TypeModule, TypeProcess } from '@/enums/Module';
import { formatDateTime } from '@/helpers/date';
import { getLastPath, replacePath } from '@/helpers/navigation';
import useGetParameterList from '@/hooks/services/useGetParameterList';
import useApp from '@/hooks/useApp';
import useCheckAccess from '@/hooks/useCheckAccess';
import useCustomRouter from '@/hooks/useCustomRouter';
import useIdentity from '@/hooks/useIdentity';
import useRecordLog from '@/hooks/useRecordLog';

import { payloadFilterList } from '../../../../ManagementShareholder/ManagementShareholder.constants';

import { TableHeaderList, TableHeaderListSyariah } from './FinancingFacility.constant';
import useGetSlikFinancingFacilityList from './hooks/UseGetSlikFacilityList';

import type { SearchValue } from '@/components/shared/Input/components/Search/Search.types';
import type { TableHeader } from '@/components/shared/Table/Table.types';


export const useFinancingFacility = (isSyariah?: boolean) => {
  const theme = useTheme();
  const { processId } = useIdentity();
  const pathname = usePathname();
  const modul = pathname.split('/')[3];
  const [filter, setFilter] = useState<SearchValue>({});
  const [totalPage, setTotalPage] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const router = useCustomRouter();
  const [pageSize, setPageSize] = useState(10);
  const [{ stepper }] = useApp();
  const isDebtor = processId?.includes('DEBT');
  const roleCanEdit = useCheckAccess(accessid.MAINTENANCE_DEBTOR_UPDATE);

  const { recordActivity } = useRecordLog();

  useEffect(() => {
    recordActivity({
      activity: ActivityType.VIEW,
      menuCode: 'maintenance-customer',
      module: TypeModule.MAINTENANCE_DATA,
      process: TypeProcess.MAINTENANCE_CUSTOMER,
      remarks: 'view maintenance customer slik financing facility ' + (isSyariah ? 'syariah' : 'konven') + ' page',
    });
  }, []);

  const anomalyRowStyle = (rowData: any) => ({
    backgroundColor: (!roleCanEdit && rowData?.hasModified) ? 'rgba(235, 87, 87, 0.2)' : 'inherit',
  });

  const enable =
    stepper.steps
      .find((step) => step.urlPath === 'regulator-data')?.childrenSteps
      .find((step) => step.urlPath === getLastPath(pathname))?.enable;

  const isViewOnly = !enable || !roleCanEdit || isDebtor;

  const tableHeader: Array<TableHeader> = [
    ...(isSyariah ? TableHeaderListSyariah : TableHeaderList),
    {
      key: 'statusDesc',
      label: 'Status',
      sx: {
        minWidth: '5vw',
      },
      type: 'status',
    },
    {
      key: 'action',
      label: 'Action',
      options: [
        {
          iconName: 'detail',
          onClick: (data) => {
            gotoDetailPage(data.facilityId);
          },
        },
        {
          iconName: 'edit',
          isHidden: isViewOnly,
          onClick: (data) => {
            gotoDetailPage(data.facilityId, true);
          },
        }
      ],
      type: 'action',
    },
  ];

  const { data: sortByOptions } = useGetParameterList(isSyariah ? 'sortFinancingSlikSyariah' : 'sortFinancingSlikKonven', { label: 'value1', value: 'value2' });
  const { data: searchByOptions } = useGetParameterList(isSyariah ? 'searchFinancingSlikSyariah' : 'searchFinancingSlik', { label: 'value1', value: 'value2' });
  const { data: operationDataList } = useGetParameterList('dataOperation', { label: 'value1', value: 'key' });
  const { data: financingTypeList } = useGetParameterList('financingTypeRevolving', { core: 'value2', label: 'value1', value: 'key' });

  const filterTemp = useMemo(() => {
    const ft = filter?.filter?.financingType;
    if (!Array.isArray(ft) || !financingTypeList?.length) return filter;
    const expanded: string[] = (ft as string[]).flatMap((val) => {
      const item = financingTypeList.find((i: { value?: string; core?: string }) => i.value === val);
      return item && item.core !== null ? [item.value, item.core] : [val];
    });
    return {
      ...filter,
      filter: {
        ...filter?.filter,
        financingType: expanded,
      },
    };
  }, [filter, financingTypeList]);

  const payload = useMemo(
    () => ({
      filter: {
        ...payloadFilterList(processId, filterTemp),
        isKonven: !isSyariah || false,
      },
      page: {
        itemPerPage: pageSize,
        noPage: currentPage,
      },
      searchDetail: filter?.searchDetail ?? undefined,
      sortList: filter?.sortList ?? undefined,
    }),
    [processId, filterTemp, isSyariah, pageSize, currentPage, filter?.searchDetail, filter?.sortList]
  );

  const { data: slikFinancingFacilityList, isLoading } = useGetSlikFinancingFacilityList(payload);

  useEffect(() => {
    setCurrentPage(1);
  }, [filter?.filter, filter?.sortList, filter?.searchDetail]);

  const { data: statusList } = useGetParameterList('statusFacility',
    {
      label: 'value1',
      value: 'value2',
    });

  const { data: productSyariahList } = useGetParameterList('productSyariah',
    {
      label: 'value1',
      value: 'key',
    });

  const { data: productKonvenList } = useGetParameterList('productKonven',
    {
      label: 'value1',
      value: 'key',
    });

  const { data: productBluList } = useGetParameterList('productBLU',
    {
      label: 'value1',
      value: 'key',
    });

  const { data: productBumdList } = useGetParameterList('productBUMD',
    {
      label: 'value1',
      value: 'key',
    });

  const { data: productPemdaList } = useGetParameterList('productPEMDA',
    {
      label: 'value1',
      value: 'key',
    });

  const productType = useMemo(() => {
    if (isSyariah) {
      return productSyariahList;
    }

    const merged = [
      ...productKonvenList,
      ...productBluList,
      ...productBumdList,
      ...productPemdaList,
    ];

    return Array.from(
      new Map(merged.map((item) => [item.value, item])).values()
    );
  }, [isSyariah, productKonvenList, productBluList, productBumdList, productPemdaList, productSyariahList]);


  const slikFinancingFacilityData = slikFinancingFacilityList?.data?.contents?.map((item) => {
    return {
      ...item,
      // financingType: isSyariah ? financingTypeList?.find((list) =>
      //   list.value === item.financingType)?.label : item.financingType,
      // productType: isSyariah ? productSyariahList?.find((list) =>
      //   list.value === item.productType)?.label : item.productType,
    };
  });

  const filterDropdownList = searchByOptions ?? [];
  const filterContentList = [
    {
      key: 'sortList',
      label: 'Urutkan Berdasarkan',
      options: sortByOptions ?? [],
      type: 'sort',
    },
    {
      key: 'financingType',
      label: 'Financing Type',
      options: financingTypeList ?? [],
      type: 'multiple-autocomplete',
    },
    {
      key: 'productType',
      label: 'Product Type',
      options: productType ?? [],
      type: 'multiple-autocomplete',
    },
    {
      key: 'status',
      label: 'Status',
      options: statusList ?? [],
      type: 'multiple-autocomplete',
    },
  ];

  const gotoDetailPage = (id: string, isEdit: boolean = false) => {
    const url = replacePath(maintenanceDebtor.EDIT_FASILITAS_PEMBIAYAAN, {
      id, module: modul, processId,
    });
    const urlKonven = !isSyariah ? `${url}?isKonven=true` : url;
    const finalUrl = isEdit ? isSyariah ? `${urlKonven}?isEdit=true` : `${urlKonven}&isEdit=true` : urlKonven;
    router.push(finalUrl);
  };

  return {
    anomalyRowStyle,
    currentPage,
    filter,
    filterContentList,
    filterDropdownList,
    isLoading,
    pageSize,
    setCurrentPage,
    setFilter,
    setPageSize,
    setTotalPage,
    slikFinancingFacilityData,
    tableHeader,
    theme,
    totalPage,
  };
};
