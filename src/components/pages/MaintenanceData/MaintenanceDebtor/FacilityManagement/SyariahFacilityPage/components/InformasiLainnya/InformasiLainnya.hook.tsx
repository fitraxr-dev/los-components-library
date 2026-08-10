import { useEffect, useMemo, useState } from 'react';

import { yupResolver } from '@hookform/resolvers/yup';
import { useTheme } from '@mui/material';
import { useParams, usePathname, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';

import { accessid, maintenanceDebtor } from '@/configs/constants/pathname';
import { TypeModule, TypeProcess } from '@/enums/Module';
import useCheckAccess from '@/hooks/useCheckAccess';
import useIdentity from '@/hooks/useIdentity';

import { useMaintenanceDataContext } from '@/components/layouts/MaintenanceData/MaintenanceData.context';

import { payloadFilterList } from '../../../../ManagementShareholder/ManagementShareholder.constants';
import useGetChangesTab from '../../../ConventionalFacilityPage/hooks/useGetChangesTab';

import { schema, tab } from './InformasiLainnya.constants';

import type { TopMenuType } from '../TopMenu/TopMenu.type';


const useInformasiLainnya = () => {
  const theme = useTheme();
  const pathname = usePathname();
  // const params = useParams();
  const [activeTab, setActiveTab] = useState(tab.PROJECT);
  const { handleSetBreadcrumb } = useMaintenanceDataContext();
  const isMaster = pathname.split('/').includes('master');
  const params = useSearchParams();
  const orderType = params.get('orderType');
  const roleCanEdit = useCheckAccess(accessid.MAINTENANCE_DEBTOR_UPDATE);
  const { processId } = useIdentity();
  const { id } = useParams();

  useEffect(() => {
    handleSetBreadcrumb([
      { label: 'Fasilitas Syariah', url: maintenanceDebtor.SYARIAH_FACILITY_PAGE.replace('[processId]', processId as string).replace('[module]', isMaster ? 'master' : 'maintenance') },
      { label: 'Informasi Lainnya', url: '' },
    ]);
  }, []);

  const handleChangeTab = (val: string) => {
    setActiveTab(val);
  };

  const topMenuType: TopMenuType = useMemo(() => {
    if (pathname.includes('detail')) return 'detail-limit-anak';
    if (pathname.includes('edit')) return 'edit-limit-anak';
  }, [pathname]);

  const methods = useForm({
    defaultValues: {
      alamat: null,
      exchangeRate: {
        currency: null,
        value: null,
      },
      facilityId: null,
      idProject: null,
      kategoriProject: null,
      klasifikasiProject: null,
      lastModified: null,
      lokasiProjectKecamatan: null,
      lokasiProjectKelurahan: null,
      lokasiProjectKotaKabupaten: null,
      lokasiProjectProvinsi: null,
      modifiedBy: null,
      namaProject: null,
      nilaiProject: {
        currency: null,
        value: 0,
      },
      nilaiProjectDalamRp: {
        currency: null,
        value: 0,
      },
      outputProject: null,
      postalCode: null,
      projectDescription: null,
      projectEndDate: null,
      projectStartDate: null,
      satuanOutputProject: null,
      sektorYangDibiayai: null,
      statusProjectPhase: null,
    },
    mode: 'onChange',
    reValidateMode: 'onChange',
    resolver: yupResolver(schema),
  });

  const watchFields = methods.watch();

  const { data: changesTab } = useGetChangesTab({
    module: TypeModule.MAINTENANCE_DATA,
    process: TypeProcess.MAINTENANCE_CUSTOMER,
    ...payloadFilterList(processId as string),
    facilityId: id as string,
  }, { enabled: !roleCanEdit });


  return {
    activeTab,
    changesTab,
    handleChangeTab,
    methods,
    theme,
    topMenuType,
    watchFields,
  };
};
export default useInformasiLainnya;
