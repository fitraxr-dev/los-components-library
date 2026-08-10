import { useEffect, useState } from 'react';

import { useParams } from 'next/navigation';

import { ActivityType } from '@/enums/Activity';
import { TypeModule, TypeProcess } from '@/enums/Module';
import { formatDateTime } from '@/helpers/date';
import useGetBucketById from '@/hooks/services/useGetBucketById';
import useGetParameterList from '@/hooks/services/useGetParameterList';
import useIdentity from '@/hooks/useIdentity';
import useRecordLog from '@/hooks/useRecordLog';

import useGetInternalAssessmentCC from '../../../hooks/useGetInternalAssessmentCC';
import { payloadFilterList } from '../../ManagementShareholder.constants';

import type { SearchValue } from '@/components/shared/Input/components/Search/Search.types';
import type { TableHeader } from '@/components/shared/Table/Table.types';


const useInternalAssesment = (props: any) => {
  const [noPage, setNoPage] = useState(1);
  const [itemPerPage, setItemPerPage] = useState(10);
  const [filter, setFilter] = useState<SearchValue>({});
  const { recordActivity } = useRecordLog();
  const { processId } = useIdentity();
  const { id } = useParams();


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
      label: 'Last Modified',
      startKey: 'checkedStartDate',
      type: 'period',
    },
    {
      endKey: 'collectabilityEndDate',
      label: 'Status Collectability Date',
      startKey: 'collectabilityStartDate',
      type: 'period',
    },
  ];

  // const { id } = useParams();

  const { data: bucketData, isSuccess: isSuccessBucketData } = useGetBucketById({
    bucketProcessId: String(processId),
    module: TypeModule.MAINTENANCE_DATA,
    process: TypeProcess.MAINTENANCE_CUSTOMER,
  }, { enabled: processId.includes('MAI') });

  const { data, isLoading } = useGetInternalAssessmentCC({
    filter: {
      ...payloadFilterList(processId, filter),
      id: props.menu !== 'internal-assessment' ? id : processId.includes('DEBT') ? processId : bucketData?.debtorId,
    },
    page: {
      itemPerPage: itemPerPage,
      noPage: noPage,
    },
    searchDetail: filter?.searchDetail ?? {},
    sortList: filter?.sortList ?? {},
  }, { enabled: (props.menu === 'internal-assessment' &&
                ((isSuccessBucketData && !!bucketData?.debtorId)) || (processId.includes('DEBT')))
                || (props.menu !== 'internal-assessment' && !!id) });

  const tableHeader: TableHeader[] = [
    {
      key: 'index',
      label: 'No',
      type: 'index',
    },
    {
      key: 'collectability',
      label: 'Collectability',
    },
    {
      key: 'collectabilityDate',
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

  const tableData = (data as any)?.data?.contents?.map((content) => ({
    ...content,
    collectabilityDate: content.collectabilityDate ? formatDateTime(new Date(content.collectabilityDate)) : '-',
    modifiedDate: content.modifiedDate ? formatDateTime(new Date(content.modifiedDate)) : '-',
  }));

  return {
    dataAsOf: (data as any)?.data?.additionalData?.lastUpdate,
    filter,
    filterContentList,
    filterDropdownList,
    isLoading,
    noPage,
    setFilter,
    setItemPerPage,
    setNoPage,
    tableData,
    tableHeader,
    tablePage: {
      currentPage: noPage,
      totalPage: (data as any)?.data?.page?.totalPage ?? 1,
    },
  };
};

export default useInternalAssesment;
