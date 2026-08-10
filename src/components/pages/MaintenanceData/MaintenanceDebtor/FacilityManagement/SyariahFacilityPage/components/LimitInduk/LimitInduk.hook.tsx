import { useEffect, useMemo } from 'react';

import { useParams, usePathname } from 'next/navigation';

import { maintenanceDebtor } from '@/configs/constants/pathname';
import { ActivityType } from '@/enums/Activity';
import { TypeModule, TypeProcess } from '@/enums/Module';
import { formatDate } from '@/helpers/date';
import { formatCurrency } from '@/helpers/formatCurrency';
import useRecordLog from '@/hooks/useRecordLog';

import { useMaintenanceDataContext } from '@/components/layouts/MaintenanceData/MaintenanceData.context';

import useGetParentLimit from '../../hooks/useGetParentLimit';

import {
  dataStatisFasilitasSectionData,
  idLimitSectionData,
  informasiLimitSectionData1,
  informasiLimitSectionData2,
} from './LimitInduk.constants';


const useLimitInduk = () => {
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
      { label: 'Limit Induk', url: '' },
    ]);

    recordActivity({
      activity: ActivityType.VIEW,
      menuCode: 'facility-syariah',
      module: TypeModule.MAINTENANCE_DEBTOR,
      process: TypeProcess.MAINTENANCE_DEBTOR,
      remarks: 'view detail limit induk',
    });
  }, []);

  const {
    data,
    //isLoading: isLoadingChildLimit,
  } = useGetParentLimit({
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
    value: data && data[item.key],
  })), [data]);

  const keteranganBmpp = useMemo(() => data && data.keteranganBmpp, [data]);

  const catatan1 = useMemo(() => data && data.catatan1, [data]);

  const idInduk = useMemo(() => data && data.parentFacilityId, [data]);

  return {
    catatan1,
    idInduk,
    isDebtor,
    keteranganBmpp,
    sectionDataStatisFasilitas,
    sectionIdLimit,
    sectionInformasiLimit1,
    sectionInformasiLimit2,
  };
};
export default useLimitInduk;
