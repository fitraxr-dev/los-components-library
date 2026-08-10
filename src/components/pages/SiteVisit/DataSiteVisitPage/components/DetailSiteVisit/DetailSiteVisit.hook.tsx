import { TypeModule, TypeProcess } from '@/enums/Module';
import Modules from '@/enums/Modules';
import useGetParameterList from '@/hooks/services/useGetParameterList';

import useGetVisitDetail from '../../../shared/hooks/useGetVisitDetail';
import useGetVisitLocationDetail from '../../../shared/hooks/useGetVisitLocationDetail';
import useSiteVisitContext from '../../../shared/hooks/useSiteVisitContext';

import type { TableHeader } from '@/components/shared/Table/Table.types';


const useDetailSiteVisit = () => {
  const { siteVisitDetail: detail } = useSiteVisitContext();

  const { data: institutiontypeData } = useGetParameterList(Modules.INSTITUTION_TYPE);

  const {
    data,
    refetch: refetchSiteVisitData,
    isLoading,
  } = useGetVisitLocationDetail(
    {
      bucketMasterId: (detail?.masterDebtor as any)?.bucketMaster || '',
      bucketProcessId: detail?.bucketId,
      module: TypeModule.SITE_VISIT,
      process: TypeProcess.SITE_VISIT,
      visitCode: detail?.visitCode,
    }, !!detail);

  // Get visit detail data using the visit-detail API
  const { data: visitDetailData, isLoading: isVisitDetailLoading } = useGetVisitDetail({
    bucketMasterId: detail?.bucketMasterId,
    bucketProcessId: detail?.bucketProcessId || detail?.bucketId,
    enabled: !!detail?.bucketProcessId || !!detail?.bucketId,
    visitCode: detail?.visitCode,
  });

  const isOthersMediaSV = data?.evidence === 'Others';

  const smiVisitHeader: TableHeader[] = [
    {
      key: 'instance',
      label: 'Divisi',
    },
    {
      key: 'name',
      label: 'Nama',
    },
    {
      key: 'position',
      label: 'Position',
    },
  ];

  const clientVisitHeader: TableHeader[] = [
    {
      key: 'name',
      label: 'Nama',
    },
    {
      key: 'position',
      label: 'Jabatan',
    },
  ];

  const othersVisitHeader: TableHeader[] = [
    {
      key: 'name',
      label: 'Nama',
    },
    {
      key: 'position',
      label: 'Jabatan',
    },
    {
      key: 'instance',
      label: 'Instansi',
    },
  ];

  return {
    clientVisitData: data?.clientParty || [],
    clientVisitHeader,
    debtorInfo: detail?.masterDebtor,
    detailData: data,
    institutiontypeData,
    isLoadingDetail: isLoading,
    isOthersMediaSV,
    isVisitDetailLoading,
    othersVisitData: data?.externalParty || [],
    othersVisitHeader,
    smiVisitData: data?.internalParty || [],
    smiVisitHeader,
    // Visit detail data from API
    visitDetailData,
  };
};

export default useDetailSiteVisit;
