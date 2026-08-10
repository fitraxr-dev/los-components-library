import { useEffect, useState } from 'react';

import { useParams } from 'next/navigation';

import { ActivityType } from '@/enums/Activity';
import { TypeModule, TypeProcess } from '@/enums/Module';
import useGetParameterList from '@/hooks/services/useGetParameterList';
import useRecordLog from '@/hooks/useRecordLog';
import useSessionStorage from '@/hooks/useSessionStorage';

import useGetInternalAssessment from '../../../../hooks/useGetInternalAssessment';


const useInternalAssesment = () => {
  const [noPage, setNoPage] = useState(1);
  const [itemPerPage, setItemPerPage] = useState(10);
  const [filter, setFilter] = useSessionStorage('management-internal-assesment', null);
  const { recordActivity } = useRecordLog();

  useEffect(() => {
    recordActivity({
      activity: ActivityType.VIEW,
      menuCode: 'maintenance-customer',
      module: TypeModule.MAINTENANCE_DATA,
      process: TypeProcess.MAINTENANCE_CUSTOMER,
      remarks: 'view maintenance customer internal assessment page',
    });
  }, []);

  const searchByOptions = useGetParameterList('searchByInternalAssessment', {
    label: 'value1',
    value: 'value2',
  });

  const sortByOptions = useGetParameterList('sortByInternalAssessment', {
    label: 'value1',
    value: 'value2',
  });

  const filterDropdownList = searchByOptions.data;


  const filterContentList = [
    {
      key: 'sortList',
      label: 'Urutkan Berdasarkan',
      options: sortByOptions.data,
      type: 'sort',
    },
    {
      endKey: 'checkedEndDate',
      label: 'Last Checked Date',
      startKey: 'checkedStartDate',
      type: 'period',
    },
    {
      endKey: 'collectabilityEndDate',
      label: 'Status Collectability Date',
      startKey: 'collectabilityStartDate',
      type: 'period',
    },
    {
      key: 'modifiedBy',
      label: 'Modified By',
      options: [],
      type: 'multiple-autocomplete',
    },
  ];

  const { id } = useParams();

  const { data, isLoading } = useGetInternalAssessment({
    filter: {
      ...filter?.filter,
      component: 'MANAGEMENT',
      componentIdentifier: id,
    },
    page: {
      itemPerPage,
      noPage,
    },
    searchDetail: filter?.searchDetail ?? { key: '', value: '' },
    sortList: filter?.sortList ?? undefined,
  });

  const tableHeader = [
    {
      label: 'No',
      type: 'index',
    },
    {
      key: 'collectability',
      label: 'Collectability',
    },
    {
      key: 'statusCollectabilityDate',
      label: 'Status Collectability Date',
    },
    {
      key: 'modifiedBy',
      label: 'Modified By',
    },
    {
      key: 'modifiedDate',
      label: 'Last Modified',
    }
  ];

  return {
    filter,
    filterContentList,
    filterDropdownList,
    isLoading,
    noPage,
    setFilter,
    setItemPerPage,
    setNoPage,
    tableData: data?.contents,
    tableHeader,
    tablePage: {
      currentPage: noPage,
      totalPage: data?.totalPage,
    },
  };
};

export default useInternalAssesment;
