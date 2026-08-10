import { useEffect } from 'react';

import { useQuery } from '@tanstack/react-query';

import { ONE_MINUTE } from '@/configs/constants';
import { SITEVISIT_STATUS } from '@/configs/constants/siteVisit';
import { TypeModule, TypeProcess } from '@/enums/Module';
import useGetBucketList from '@/hooks/services/useGetBucketList';
import useIdentity from '@/hooks/useIdentity';
import { SiteVisitControllerApi } from '@/services/openapi/site-visit-service';

import type { GenericBucketRequestDtoMapStringObject } from '@/services/openapi/bucket-service';


const api = new SiteVisitControllerApi();

const useGetSiteVisitHistoryList = (currentBucketProcessId: string) => {
  const { debtorId } = useIdentity();
  const params: GenericBucketRequestDtoMapStringObject = {
    filter: {
      module: TypeModule.SITE_VISIT,
      process: TypeProcess.SITE_VISIT,
      status: [SITEVISIT_STATUS.APPROVED_SITE_VISIT],
    },
    page: {
      itemPerPage: 100,
      noPage: 1,
    },
    searchDetail: {
      key: 'd.debtor_code',
      value: debtorId,
    },
  };

  const {
    data: dataBucketSiteVisitList,
    isSuccess: isSuccessBucketList,
    refetch: refetchBucketList,
  } = useGetBucketList(params, { enabled: !!debtorId });


  const query = useQuery({
    enabled: isSuccessBucketList,
    queryFn: async () => {
      const response = await api.getHistorySiteVisit({
        bucketProcessIds: dataBucketSiteVisitList.contents.map((data) => data.bucketProcessId),
        currentBucketProcessId,
      });

      return response.data;
    },
    queryKey: ['history-site-visit-list'],
    staleTime: ONE_MINUTE,
  });

  useEffect(() => {
    if (debtorId) {
      refetchBucketList();
    }
  }, [debtorId]);

  useEffect(() => {
    if (dataBucketSiteVisitList?.contents) {
      query?.refetch();
    }
  }, [dataBucketSiteVisitList?.contents]);


  return query;
};

export default useGetSiteVisitHistoryList;
