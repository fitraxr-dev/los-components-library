import { useEffect, useState } from 'react';

import { useParams, useRouter } from 'next/navigation';

import { ActivityType } from '@/enums/Activity';
import { TypeModule, TypeProcess } from '@/enums/Module';
import { formatDate } from '@/helpers/date';
import useGetParameterList from '@/hooks/services/useGetParameterList';
import useRecordLog from '@/hooks/useRecordLog';
import useSessionStorage from '@/hooks/useSessionStorage';
import { DataDeltaGetDtoComponentEnum } from '@/services/openapi/master-service/api';

import useGetInternalAssessmentList from '../../../hooks/useGetInternalAssessmentList';

import type { SearchValue } from '@/components/shared/Input/components/Search/Search.types';
import type { TableHeader } from '@/components/shared/Table/Table.types';


const useTabInternalAssessment = () => {
  const router = useRouter();
  const { id } = useParams();
  const [noPage, setNoPage] = useState(1);
  const [itemPerPage, setItemPerPage] = useState(10);
  const [filter, setFilter] = useState<SearchValue>({});
  const { recordActivity } = useRecordLog();
  const { data: searchByOptions } = useGetParameterList('searchByInternalAssessment', { label: 'value1', value: 'value2' });

  const { data: sortByOptions } = useGetParameterList('sortByInternalAssessment', { label: 'value1', value: 'value2' });

  const { data } = useGetInternalAssessmentList({
    filter: {
      ...filter?.filter,
      component: DataDeltaGetDtoComponentEnum.OtherRelatedParties,
      componentIdentifier: String(id),
      module: TypeModule.MAINTENANCE_DATA,
      process: TypeProcess.MAINTENANCE_CUSTOMER,
    },
    page: {
      itemPerPage,
      noPage,
    },
    searchDetail: filter?.searchDetail ?? { key: '', value: '' },
    sortList: filter?.sortList ?? undefined,
  });

  const filterDropdownList = searchByOptions;

  const filterContentList = [
    {
      key: 'sortList',
      label: 'Sort By',
      options: sortByOptions,
      type: 'sort',
    },
    {
      endKey: 'endDate',
      label: 'Last Checked Date',
      startKey: 'startDate',
      type: 'period',
    },
    {
      endKey: 'endDate',
      label: 'Status Collectability Date',
      startKey: 'startDate',
      type: 'period',
    },
    {
      key: 'modifiedBy',
      label: 'Modified By',
      type: 'text',
    }
  ];

  const tableData = data?.contents?.map((content) => ({
    ...content,
    collectability: content.collectability || '-',
    lastModified: content.modifiedDate ? formatDate(new Date(content.modifiedDate)) : '-',
    modifiedBy: content.modifiedBy || '-',
    statusCollectabilityDate: content.statusCollectabilityDate ? formatDate(new Date(content.statusCollectabilityDate)) : '-',
  }));

  const tablePage = data?.page;

  const tableHeader: TableHeader[] = [
    {
      key: 'index',
      label: 'No',
      sx: {
        minWidth: '4%',
      },
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
      key: 'lastModified',
      label: 'Last Modified',
    }
  ];

  const handleClose = () => {
    router.back();
  };

  useEffect(() => {
    recordActivity({
      activity: ActivityType.VIEW,
      menuCode: 'maintenance-customer',
      module: TypeModule.MAINTENANCE_DATA,
      process: TypeProcess.MAINTENANCE_CUSTOMER,
      remarks: 'view maintenance customer other related detail form page',
    });
  }, []);


  return {
    filter,
    filterContentList,
    filterDropdownList,
    handleClose,
    noPage,
    setFilter,
    setItemPerPage,
    setNoPage,
    tableData,
    tableHeader,
    tablePage,
  };
};

export default useTabInternalAssessment;
