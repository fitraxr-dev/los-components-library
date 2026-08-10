import { useEffect, useMemo } from 'react';

import { useParams, usePathname, useRouter } from 'next/navigation';

import { maintenanceDebtor } from '@/configs/constants/pathname';
import { ActivityType } from '@/enums/Activity';
import { TypeModule, TypeProcess } from '@/enums/Module';
import useRecordLog from '@/hooks/useRecordLog';

import { useMaintenanceDataContext } from '@/components/layouts/MaintenanceData/MaintenanceData.context';

import {
  informasiLimitSection1,
  informasiLimitSection2,
  informasiLoanDepositSection,
  MONTH,
} from './InquiryLimit.constants';


const useInquiryLimit = () => {
  const { handleSetBreadcrumb } = useMaintenanceDataContext();
  const router = useRouter();
  const params = useParams();
  const pathname = usePathname();
  const isMaster = pathname.split('/').includes('master');
  const inquiry = sessionStorage.getItem('inquiry-limit');
  const InquiryLimit = inquiry && JSON.parse(inquiry);
  const { recordActivity } = useRecordLog();

  const { processId, id } = params;

  const isDebtor = processId?.includes('DEBT');

  useEffect(() => {
    handleSetBreadcrumb([
      { label: 'Fasilitas Syariah', url: maintenanceDebtor.SYARIAH_FACILITY_PAGE.replace('[processId]', processId as string).replace('[module]', isMaster ? 'master' : 'maintenance') },
      { label: 'Inquiry Limit', url: '' },
    ]);

    recordActivity({
      activity: ActivityType.VIEW,
      menuCode: 'facility-syariah',
      module: TypeModule.MAINTENANCE_DEBTOR,
      process: TypeProcess.MAINTENANCE_DEBTOR,
      remarks: 'view detail inquiry limit',
    });
  }, []);

  const handleValue = (value: string, type: string) => {
    if (type === 'date') {
      const separated = value.split(' ');
      const month = MONTH[separated[1]];

      return `${separated[0]} ${month} ${separated[2]}`;
    };

    return value;
  };

  const idLimitAnak = useMemo(() => InquiryLimit.idLimitAnak, [InquiryLimit]);
  const idLimitInduk = useMemo(() => InquiryLimit.idLimitInduk, [InquiryLimit]);
  const idPipeline = useMemo(() => InquiryLimit.idPipeline, [InquiryLimit]);

  const sectionInformationLimit1 = useMemo(() => informasiLimitSection1.map((item) => ({
    ...item,
    value: InquiryLimit && handleValue(InquiryLimit[item.key], item.type) || '',
  })), [InquiryLimit]);

  const sectionInformationLimit2 = useMemo(() => informasiLimitSection2.map((item) => ({
    ...item,
    value: InquiryLimit && handleValue(InquiryLimit[item.key], item.type) || '',
  })), [InquiryLimit]);

  const keteranganBmpp = useMemo(() => InquiryLimit.keteranganBmpp, [InquiryLimit]);

  const catatan1 = useMemo(() => InquiryLimit.catatan1, [InquiryLimit]);

  const informasiLoanDeposit = useMemo(() => informasiLoanDepositSection.map((item) => ({
    ...item,
    value: InquiryLimit && handleValue(InquiryLimit[item.key], item.type) || '',
  })), [InquiryLimit]);

  const responseFlag = useMemo(() => InquiryLimit.responseFlag, [InquiryLimit]);
  const deskripsiResponseFlag = useMemo(() => InquiryLimit.deskripsiResponseFlag, [InquiryLimit]);

  return {
    catatan1,
    deskripsiResponseFlag,
    id,
    idLimitAnak,
    idLimitInduk,
    idPipeline,
    informasiLoanDeposit,
    isDebtor,
    isMaster,
    keteranganBmpp,
    processId,
    responseFlag,
    router,
    sectionInformationLimit1,
    sectionInformationLimit2,
  };
};
export default useInquiryLimit;
