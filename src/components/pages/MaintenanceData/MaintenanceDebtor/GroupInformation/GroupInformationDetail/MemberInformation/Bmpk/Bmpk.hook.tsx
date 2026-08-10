import { useEffect, useMemo, useState } from 'react';

import { useParams } from 'next/navigation';

import { roles } from '@/configs/constants';
import { ActivityType } from '@/enums/Activity';
import { TypeModule, TypeProcess } from '@/enums/Module';
import { formatDateToUtc } from '@/helpers/date';
import useApp from '@/hooks/useApp';
import useRecordLog from '@/hooks/useRecordLog';

import useDebtorDetail from '@/components/pages/MaintenanceData/MaintenanceGroup/hooks/useDebtorDetail';
import useGetIndividualDetail from '@/components/pages/MaintenanceData/MaintenanceGroup/hooks/useGetBmpkIndividu';

import type { TableHeader } from '@/components/shared/Table/Table.types';


const useBmpk = () => {
  const { memberId } = useParams();
  const { data: debtorDetail, isLoading: loadDetailDebtor } = useDebtorDetail({ debtorId: memberId as string });
  const { recordActivity } = useRecordLog();

  useEffect(() => {
    recordActivity({
      activity: ActivityType.VIEW,
      menuCode: 'maintenance-customer',
      module: TypeModule.MAINTENANCE_DATA,
      process: TypeProcess.MAINTENANCE_CUSTOMER,
      remarks: 'view maintenance customer group information detail - member information detail - bmpk page',
    });
  }, []);

  const [pageBmpk, setPageBmpk] = useState(1);
  const [pageSizeBmpk, setPageSizeBmpk] = useState(5);

  const { data: bmpkList, isLoading: isLoadingBmpk } = useGetIndividualDetail({
    filter: { debtorId: memberId as string },
    page: {
      itemPerPage: pageSizeBmpk,
      noPage: pageBmpk,
    },
  });

  const [state] = useApp();
  const isRM = state.currentRole.includes(roles.RM);

  const lastUpdateDate = bmpkList?.additionalData?.lastUpdate;
  const dataAsOfDate = useMemo(() => {
    return lastUpdateDate ? `${formatDateToUtc(new Date(lastUpdateDate), 'DD MMM YYYY, [Pukul] HH:mm:ss')}` : '-';
  }, [lastUpdateDate]);

  useEffect(() => {
    console.log('bmpkList', bmpkList);
  }, [bmpkList]);

  const saveMemberInformation = async (payload: any) => {
    await fetch('/api/member-information', {
      body: JSON.stringify(payload),
      headers: { 'Content-Type': 'application/json' },
      method: 'POST',
    });
  };

  const onSubmit = async (data: any) => {
    const payload = {
      hasFinancialDependency: !!data.hasFinancialDependency,
      hasSharedDirectors: !!data.hasSharedDirectors,
      isControlledBySameParty: !!data.isControlledBySameParty,
      isControllingOther: !!data.isControllingOther,
      isGuarantorForOther: !!data.isGuarantorForOther,
      memberId,
      remark: data.remark,
    };
    await saveMemberInformation(payload);
  };

  const tableHeaderBmpk: TableHeader[] = [
    {
      key: 'index',
      label: 'No',
      sx: {
        maxWidth: '1vw',
      },
      type: 'index',
    },
    {
      key: 'description',
      label: 'Melampaui BMPK/BMPD/BMPP Individual',
      sx: {
        minWidth: '16vw',
      },
    },
    {
      key: 'lastModified',
      label: 'Data as of',
    },
  ];

  // const mockTableDataBmpk = [
  //   {
  //     dataasof: '4 Maret 2025 12:30:34',
  //     surpassBMPK: 'Terjadi pelanggaran BMPP',
  //   },
  //   {
  //     dataasof: '3 Maret 2025 12:30:34',
  //     surpassBMPK: 'Tidak Terjadi pelanggaran BMPP',
  //   },
  //   {
  //     dataasof: '2 Maret 2025 12:30:34',
  //     surpassBMPK: 'Tidak Terjadi pelanggaran BMPP',
  //   },
  // ];

  return {
    bmpkList,
    dataAsOfDate,
    isLoadingBmpk,
    pageBmpk,
    pageSizeBmpk,
    setPageBmpk,
    setPageSizeBmpk,
    tableHeaderBmpk,
  };
};

export default useBmpk;
