import { useEffect, useState } from 'react';

import { useTheme } from '@mui/material';
import { useParams, usePathname, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';

import { ActivityType } from '@/enums/Activity';
import { TypeModule, TypeProcess } from '@/enums/Module';
import useGetParameterList from '@/hooks/services/useGetParameterList';
import useIdentity from '@/hooks/useIdentity';
import useRecordLog from '@/hooks/useRecordLog';
import useSessionStorage from '@/hooks/useSessionStorage';

import { useMaintenanceDataContext } from '@/components/layouts/MaintenanceData/MaintenanceData.context';


import {
  useGetProjectFacility,
  useGetProjectFacilityProduct,
} from '../../../MaintenanceProyek/hooks/useProjectFacility';

import { TableHeaderList } from './ProjectDetail.constant';

import type { SearchValue } from '@/components/shared/Input/components/Search/Search.types';
import type { TableHeader } from '@/components/shared/Table/Table.types';


const useProjectDetailPage = () => {

  const theme = useTheme();
  const { processId } = useIdentity();
  const { projectId } = useParams();

  const { handleSetBreadcrumb } = useMaintenanceDataContext();
  const { recordActivity } = useRecordLog();

  useEffect(() => {
    recordActivity({
      activity: ActivityType.VIEW,
      menuCode: 'maintenance-customer',
      module: TypeModule.MAINTENANCE_DATA,
      process: TypeProcess.MAINTENANCE_CUSTOMER,
      remarks: 'view maintenance customer project detail page',
    });
  }, []);

  useEffect(() => {
    handleSetBreadcrumb([
      { label: 'Project', url: `/maintenance-data/maintenance-debtor/maintenance/${processId}/project-information` },
      { label: 'Detail Project', url: '' },
    ]);
  }, []);

  // ==== Project Facility Table

  const [projectFacilityPage, setProjectFacilityPage] = useState(1);
  const [projectFacilityPageSize, setProjectFacilityPageSize] = useState(10);
  const [projectFacilityFilter, setProjectFacilityFilter] = useState<SearchValue>({});

  // SearchBy data
  const { data: projectFacilitySearchByOptions } = useGetParameterList('searchByFacilityProject', { label: 'value1', value: 'value2' });

  // SortBy data
  const { data: sortByProjectFacilityOptions } = useGetParameterList('sortByFacilityProject', { label: 'value1', value: 'value2' });

  // Product data
  const { data: productFacilityOptions } = useGetProjectFacilityProduct({ id: projectId as string });
  const [productFacilityOptionsMapped, setProductFacilityOptionsMapped] = useState([]);

  // status facility data
  const { data: statusFacilityOptions } = useGetParameterList('statusFacility', { label: 'value1', value: 'key' });

  useEffect(() => {
    const productFacilityOptionsTemp = productFacilityOptions?.data?.contents.map((item) => ({
      label: item.label,
      value: item.key,
    }));
    setProductFacilityOptionsMapped(productFacilityOptionsTemp);
  }, [productFacilityOptions]);

  const projectFacilityFilterContentList = [
    {
      key: 'sortList',
      label: 'Urutkan Berdasarkan',
      options: sortByProjectFacilityOptions,
      type: 'sort',
    },
    {
      key: 'products',
      label: 'Produk',
      options: productFacilityOptionsMapped,
      type: 'multiple-autocomplete',
    },
    {
      key: 'status',
      label: 'Status Fasilitas',
      options: statusFacilityOptions,
      type: 'multiple-autocomplete',
    },
  ];

  const tableHeaderList: Array<TableHeader> = [
    ...TableHeaderList,
  ];

  // API List
  const { data: projectFacilityData, isFetching: isLoadingProjectFacility } = useGetProjectFacility({
    filter: {
      ...projectFacilityFilter?.filter,
      projectCode: projectId as string ?? null,
    },
    page: {
      itemPerPage: projectFacilityPageSize,
      noPage: projectFacilityPage,
    },
    searchDetail: projectFacilityFilter?.searchDetail ?? {},
    sortList: projectFacilityFilter?.sortList ?? {},
  });

  const methods = useForm({
    defaultValues: {
    },
  });

  const handleSaveMethod = () => {
    console.log(methods.getValues());
  };

  const [activeTab, setActiveTab] = useSessionStorage('activeTab', 0);

  const handleChangeTab = (val: number) => {
    setActiveTab(val);
  };


  const tabItems = [
    { label: 'Project' },
    { label: 'Informasi Project Lainnya' },
    { label: 'Project Owner' },
    { label: 'Contractor' },
  ];

  return {
    activeTab,
    handleChangeTab,
    handleSaveMethod,
    isLoadingProjectFacility,
    methods,
    projectFacilityData,
    projectFacilityFilter,
    projectFacilityFilterContentList,
    projectFacilityPage,
    projectFacilityPageSize,
    projectFacilitySearchByOptions,
    setProjectFacilityFilter,
    setProjectFacilityPage,
    setProjectFacilityPageSize,
    tabItems,
    tableHeaderList,
    theme,
  };
};

export default useProjectDetailPage;
