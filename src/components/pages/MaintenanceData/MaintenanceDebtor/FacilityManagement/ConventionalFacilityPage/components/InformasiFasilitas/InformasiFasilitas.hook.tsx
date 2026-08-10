import { useEffect, useState } from 'react';

import { useTheme } from '@mui/material';
import { useParams, usePathname, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';

import { accessid, maintenanceDebtor } from '@/configs/constants/pathname';
import { TypeModule, TypeProcess } from '@/enums/Module';
import { replacePath } from '@/helpers/navigation';
import useCheckAccess from '@/hooks/useCheckAccess';

import { useMaintenanceDataContext } from '@/components/layouts/MaintenanceData/MaintenanceData.context';

import { payloadFilterList } from '../../../../ManagementShareholder/ManagementShareholder.constants';
import useGetFacilityInformation from '../../hooks/FacilityInformation/useGetFacilityInformation';
import useGetChangesTab from '../../hooks/useGetChangesTab';

import { tab } from './InformasiFasilitas.constants';


const useInformasiFasilitas = () => {
  const theme = useTheme();
  const [activeTab, setActiveTab] = useState(tab.FACILITYDATA);
  const { handleSetBreadcrumb } = useMaintenanceDataContext();
  const { processId, id } = useParams();
  const pathname = usePathname();
  const modul = pathname.split('/')[3];
  const params = useSearchParams();
  const orderType = params.get('orderType');
  const roleCanEdit = useCheckAccess(accessid.MAINTENANCE_DEBTOR_UPDATE);

  useEffect(() => {
    handleSetBreadcrumb([
      { label: 'Facility Management', url: replacePath(maintenanceDebtor.CONVENTIONAL_FACILITY_PAGE, {
        debtorId: processId, module: modul,
      }) },
      { label: 'Facility ID ' + id + ' > Informasi Fasilitas', url: '' },
    ]);
  }, []);

  const handleChangeTab = (val: string) => {
    setActiveTab(val);
  };
  const { data: changesTab } = useGetChangesTab({
    module: TypeModule.MAINTENANCE_DATA,
    process: TypeProcess.MAINTENANCE_CUSTOMER,
    ...payloadFilterList(processId as string),
    facilityId: id as string,
  }, { enabled: !roleCanEdit && (orderType === 'proposal' || pathname.includes('other-information')) });


  const methods = useForm({
    mode: 'onChange',
    reValidateMode: 'onChange',
  });

  const watchFields = methods.watch();

  const { data: facilityInformation } = useGetFacilityInformation({
    ...payloadFilterList(processId as string),
    facilityId: id as string,
  });

  return {
    activeTab,
    changesTab,
    facilityInformation: facilityInformation?.data?.content,
    handleChangeTab,
    methods,
    theme,
    watchFields,
  };
};
export default useInformasiFasilitas;
