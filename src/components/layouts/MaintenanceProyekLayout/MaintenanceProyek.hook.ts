import { useParams, usePathname, useSearchParams } from 'next/navigation';

import { maintenanceProyek } from '@/configs/constants/pathname';
import { replacePath } from '@/helpers/navigation';
import useCustomRouter from '@/hooks/useCustomRouter';

import useGetStepMaintenance from './hooks/useGetStepMaintenance';


const useMaintenanceProyek = () => {
  const router = useCustomRouter();
  const path = usePathname();
  const { id } = useParams<{ id: string }>();
  const { memberId } = useParams<{ memberId: string }>();
  const proyekModule = id ? path.split('/')[4] : path.split('/')[3];
  const isSubmission = id?.includes('MG');

  const ignorePath = [
    maintenanceProyek.LIST_PAGE,
  ];

  const params = useSearchParams();
  const additionalIgnorePath = [
    ...ignorePath,
    replacePath(maintenanceProyek.ADD_MEMBER_PAGE, {
      id: id,
    }),
    replacePath(maintenanceProyek.EDIT_MEMBER_PAGE, {
      id: id,
    }),
    replacePath(maintenanceProyek.DETAIL_MEMBER_PAGE, {
      id: id,
    }),
  ];

  const isDetailPage = ignorePath.includes(path);
  const renderDetailLayout = additionalIgnorePath.includes(path) || params.get('from') !== null;


  const handleCustomStepperClick = (url: string) => {
    const proyekModuleCreatePath = proyekModule === 'create' ? `/maintenance-data/maintenance-proyek/create/${url}` :
      `/maintenance-data/maintenance-proyek/${id}/detail/${url}`;
    router.push(replacePath(
      (proyekModule === 'edit' ?
        `/maintenance-data/maintenance-proyek/${id}/edit/${url}` :
        proyekModuleCreatePath),
      { id: id }
    ));
  };

  const { data: dataStep } = useGetStepMaintenance({
    bucketProcessId: id,
    module: 'MG',
    process: 'MG',
  });

  return {
    additionalIgnorePath,
    handleCustomStepperClick,
    id,
    isDetailPage,
    isSubmission,
    renderDetailLayout,
    router,
  };
};

export default useMaintenanceProyek;
