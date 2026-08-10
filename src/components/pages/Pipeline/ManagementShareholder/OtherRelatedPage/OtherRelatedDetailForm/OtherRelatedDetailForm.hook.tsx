import { useEffect, useMemo } from 'react';

import { useParams, usePathname } from 'next/navigation';
import { useForm } from 'react-hook-form';

import { ActivityType } from '@/enums/Activity';
import { TypeModule, TypeProcess } from '@/enums/Module';
import showNiceModalV2 from '@/helpers/showNiceModalV2';
import useCustomRouter from '@/hooks/useCustomRouter';
import useIdentity from '@/hooks/useIdentity';
import useRecordLog from '@/hooks/useRecordLog';

import { useMaintenanceDataContext } from '@/components/layouts/MaintenanceData/MaintenanceData.context';


const useOtherRelatedDetailForm = () => {
  const { handleSetBreadcrumb } = useMaintenanceDataContext();
  const { recordActivity } = useRecordLog();
  const pathname = usePathname();
  const router = useCustomRouter();
  const { id } = useParams();
  const { processId } = useIdentity();

  const { control, handleSubmit, watch, setValue } = useForm({
    mode: 'onChange',
  });

  const isDetailPage = !pathname.includes('add') && !pathname.includes('edit');

  const pageBreadCrumb = useMemo(() => {
    if (pathname.includes('add')) return ({ label: 'Add Pihak Terkait Lainnya', url: '' });
    if (pathname.includes('edit')) return ({ label: 'Edit Pihak Terkait Lainnya', url: '' });
    return ({ label: 'Detail Pihak Terkait Lainnya', url: '' });
  }, []);


  useEffect(() => {
    handleSetBreadcrumb([
      { label: 'Management & Shareholder', url: '' },
      { label: 'Pihak Terkait Lainnya', url: `/maintenance-data/maintenance-debtor/maintenance/${processId}/management-shareholder/other-related` },
      pageBreadCrumb
    ]);
  }, []);


  const handleSave = () => {
    const isEdit = pathname.includes('edit');
    const formValues = watch();

    recordActivity({
      activity: isEdit ? ActivityType.EDIT : ActivityType.ADD,
      bucketProcessId: processId || '',
      changeAfter: JSON.stringify(formValues),
      changeBefore: isEdit ? JSON.stringify({ id }) : '',
      menuCode: 'pipeline',
      module: TypeModule.PIPELINE,
      process: TypeProcess.PIPELINE,
      remarks: `${isEdit ? 'edit' : 'add'} other related data`,
    });

    showNiceModalV2({
      onClose: () => {router.back();},
      title: 'Data berhasil disimpan',
      type: 'success',
    });
  };
  return {
    control,
    handleSave,
    isDetailPage,
    pageBreadCrumb,
    router,
  };
};

export default useOtherRelatedDetailForm;
