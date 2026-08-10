import { useState } from 'react';

import { useTheme } from '@mui/material';
import { useParams, usePathname } from 'next/navigation';
import { useForm } from 'react-hook-form';

import { maintenanceDebtor } from '@/configs/constants/pathname';
import { formatDateTime } from '@/helpers/date';
import { replacePath } from '@/helpers/navigation';
import useGetParameterList from '@/hooks/services/useGetParameterList';
import useApp from '@/hooks/useApp';
import useCustomRouter from '@/hooks/useCustomRouter';
import useIdentity from '@/hooks/useIdentity';

import {
  payloadFilterList,
} from '@/components/pages/MaintenanceData/MaintenanceDebtor/ManagementShareholder/ManagementShareholder.constants';

import useGetChildLimit from '../../../../hooks/useGetChildLimit';
import useGetProjectListSyariah from '../../../../hooks/useGetProjectList';

import { TableHeaderList } from './ProjectPage.constants';

import type { SearchValue } from '@/components/shared/Input/components/Search/Search.types';
import type { TableHeader } from '@/components/shared/Table/Table.types';


const useProjectPage = () => {
  const methods = useForm();
  const theme = useTheme();
  const router = useCustomRouter();
  const pathname = usePathname();
  const { processId } = useIdentity();
  const params = useParams();

  const [filter, setFilter] = useState<SearchValue>({});
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const isDebtor = processId?.includes('DEBT');

  // Dropdown data
  const { data: searchByOptions } = useGetParameterList('searchMaintenanceProject', { label: 'value1', value: 'value2' });

  // Sort By data
  const { data: sortByOptions } = useGetParameterList('sortByProject2', { label: 'value1', value: 'value2' });

  // Currency List
  const { data: currencyOptions } = useGetParameterList('currency');

  // Currency List
  const { data: sectorOptions } = useGetParameterList('sector');

  const filterDropdownList = searchByOptions;

  const { id } = params;


  const { data: limitAnakData } = useGetChildLimit({
    ...payloadFilterList(processId as string, filter),
    facilityId: String(id),
  });

  const projectCodes = limitAnakData?.projects
    ?.map((project) => project.projectCode)
    .filter(Boolean);


  const { data: dataProject, isLoading: isLoadingProject } = useGetProjectListSyariah({
    filter: {
      ...payloadFilterList(processId as string, filter),
      facilityId: String(id),
      projectCode: projectCodes && projectCodes.length > 0 ? projectCodes : undefined,
    },
    page: {
      itemPerPage: pageSize,
      noPage: page,
    },
    searchDetail: filter?.searchDetail ?? {},
    sortList: filter?.sortList ?? {},
  });

  const dateAsOf = formatDateTime(dataProject?.data?.additionalData?.lastUpdate) ?? '-';

  const filterContentList = [
    {
      key: 'sortList',
      label: 'Urutkan Berdasarkan',
      options: sortByOptions,
      type: 'sort',
    },
    {
      key: 'currencies',
      label: 'Currency',
      options: currencyOptions,
      type: 'multiple-autocomplete',
    },
    {
      key: 'sectors',
      label: 'Sektor yang dibiayai',
      options: sectorOptions,
      type: 'multiple-autocomplete',
    },
    {
      key: 'area', // tidak terpakai
      label: 'Area', // tidak terpakai
      type: 'area-proyek',
    },
  ];

  const gotoDetailPage = (projectId: string) => {
    const currentModule = isDebtor ? 'master' : 'maintenance';

    router.push(replacePath(
      maintenanceDebtor.DETAIL_PROJECT, {
        id,
        module: currentModule,
        processId,
        projectId,
      }
    ));
  };


  const tableHeaderList: Array<TableHeader> = [
    ...TableHeaderList,
    {
      key: 'action',
      label: 'Action',
      options: [
        {
          iconName: 'detail',
          onClick: (data) => gotoDetailPage(data?.id),
        },
      ],
      sx: {
        minWidth: '10vw',
      },
      type: 'action',
    },
  ];

  // Action Button
  const [{ stepper }] = useApp();
  const isViewOnly = !stepper.steps.find((step) => step.urlPath === 'customer-information')?.enable;

  const handleClose = () => {
    router.back();
  };

  return {
    dataProject,
    dateAsOf,
    filter,
    filterContentList,
    filterDropdownList,
    handleClose,

    isDebtor,
    isLoadingProject,

    isViewOnly,

    methods,

    page,

    pageSize,

    pathname,
    router,

    setFilter,

    setPage,

    setPageSize,
    tableHeaderList,
    theme,
  };
};

export default useProjectPage;
