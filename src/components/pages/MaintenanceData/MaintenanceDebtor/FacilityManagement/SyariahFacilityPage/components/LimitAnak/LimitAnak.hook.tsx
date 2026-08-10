import { useEffect, useMemo } from 'react';

import { useParams, usePathname } from 'next/navigation';

import { maintenanceDebtor } from '@/configs/constants/pathname';
import { ActivityType } from '@/enums/Activity';
import { TypeModule, TypeProcess } from '@/enums/Module';
import { formatDate } from '@/helpers/date';
import { formatCurrency } from '@/helpers/formatCurrency';
import useRecordLog from '@/hooks/useRecordLog';

import { useMaintenanceDataContext } from '@/components/layouts/MaintenanceData/MaintenanceData.context';

import { payloadFilterList } from '../../../../ManagementShareholder/ManagementShareholder.constants';
import useGetChildLimit from '../../hooks/useGetChildLimit';


import {
  dataStatisFasilitasSectionData,
  idLimitSectionData,
  informasiLimitSectionData1,
  informasiLimitSectionData2,
} from './LimitAnak.constants';

import type { TopMenuType } from '../TopMenu/TopMenu.type';


const useLimitAnak = () => {
  const { handleSetBreadcrumb } = useMaintenanceDataContext();
  const { recordActivity } = useRecordLog();
  const params = useParams();
  const pathname = usePathname();
  const isMaster = pathname.split('/').includes('master');

  const { id, processId } = params;

  const isDebtor = processId?.includes('DEBT');

  useEffect(() => {
    handleSetBreadcrumb([
      { label: 'Fasilitas Syariah', url: maintenanceDebtor.SYARIAH_FACILITY_PAGE.replace('[processId]', processId as string).replace('[module]', isMaster ? 'master' : 'maintenance') },
      { label: 'Limit Anak', url: '' },
    ]);

    recordActivity({
      activity: ActivityType.VIEW,
      menuCode: 'facility-syariah',
      module: TypeModule.MAINTENANCE_DEBTOR,
      process: TypeProcess.MAINTENANCE_DEBTOR,
      remarks: 'view list limit anak',
    });
  }, []);

  const topMenuType: TopMenuType = useMemo(() => {
    if (pathname.includes('detail')) return 'detail-limit-anak';
    if (pathname.includes('edit')) return 'edit-limit-anak';
  }, [pathname]);

  const { data } = useGetChildLimit({
    ...payloadFilterList(processId as string),
    facilityId: id as string,
  });

  const handleValue = (value: Date, type: string) => {
    if (type === 'currency') {
      return value && formatCurrency(String(value));
    };

    if (type === 'date') {
      return value && formatDate(value);
    };

    return value;
  };

  const sectionIdLimit = useMemo(() => idLimitSectionData.map((item) => ({
    ...item,
    value: data && data[item.key],
  })), [data]);

  const sectionInformasiLimit1 = useMemo(() => informasiLimitSectionData1.map((item) => ({
    ...item,
    value: data && handleValue(data[item.key], item.type),
  })), [data]);

  const sectionInformasiLimit2 = useMemo(() => informasiLimitSectionData2.map((item) => ({
    ...item,
    value: data && handleValue(data[item.key], item.type),
  })), [data]);

  const sectionDataStatisFasilitas = useMemo(() => dataStatisFasilitasSectionData.map((item) => ({
    ...item,
    value: data && handleValue(data[item.key], item.type),
  })), [data]);

  const keteranganBmpk = useMemo(() => data && data.bmppDescription, [data]);
  const frekuensiReview = useMemo(() => data && data.reviewFrequency, [data]);
  const groupCif = useMemo(() => data && data.groupCIF, [data]);
  const paymentScheme = useMemo(() => data && data.product, [data]);

  return {
    data,
    frekuensiReview,
    groupCif,
    id,
    isDebtor,
    keteranganBmpk,
    paymentScheme,
    sectionDataStatisFasilitas,
    sectionIdLimit,
    sectionInformasiLimit1,
    sectionInformasiLimit2,
    topMenuType,
  };
};
export default useLimitAnak;
