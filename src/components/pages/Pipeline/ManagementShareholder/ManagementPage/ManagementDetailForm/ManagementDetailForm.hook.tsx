import { useEffect, useMemo } from 'react';

import { useParams, usePathname } from 'next/navigation';
import { useForm } from 'react-hook-form';

import { ONE_MINUTE } from '@/configs/constants';
import { ActivityType } from '@/enums/Activity';
import { TypeModule, TypeProcess } from '@/enums/Module';
import showNiceModalV2 from '@/helpers/showNiceModalV2';
import useGetParameterList from '@/hooks/services/useGetParameterList';
import closeNiceModal from '@/hooks/useCloseNiceModal';
import useCustomRouter from '@/hooks/useCustomRouter';
import useIdentity from '@/hooks/useIdentity';
import useRecordLog from '@/hooks/useRecordLog';

import { useMaintenanceDataContext } from '@/components/layouts/MaintenanceData/MaintenanceData.context';

import useGetManagement from '../../hooks/useGetManagementById';
import useSaveManagement from '../../hooks/useSaveManagement';


const useManagementDetailForm = () => {
  const { handleSetBreadcrumb } = useMaintenanceDataContext();
  const { recordActivity } = useRecordLog();
  const pathname = usePathname();
  const router = useCustomRouter();
  const { processId, debtorId } = useIdentity();
  const { id } = useParams();

  useEffect(() => {
    console.log('log id', id);
  }, [id]);

  const { data } = useGetManagement({
    id: Number(id),
  });

  // Record activity when management detail is loaded
  useEffect(() => {
    if (data) {
      recordActivity({
        activity: ActivityType.VIEW,
        bucketProcessId: processId || '',
        changeAfter: '',
        changeBefore: '',
        menuCode: 'pipeline',
        module: TypeModule.PIPELINE,
        process: TypeProcess.PIPELINE,
        remarks: 'view management detail form',
      });
    }
  }, [data, processId, recordActivity]);

  const { getValues, formState, reset, handleSubmit, control, watch, setValue } = useForm({
    defaultValues: {
      address: '',
      city: '',
      collectability: '',
      collectabilityStatusPer: '',
      country: '',
      district: '',
      dob: '',
      etnicOrigin: '',
      gender: '',
      idNo: '',
      idType: '',
      identityExpiry: '',
      ktpFile: undefined,
      lastModified: '',
      modifiedBy: '',
      name: '',
      nationality: '',
      npwp: '',
      npwpFile: undefined,
      phone: '',
      pob: '',
      position: '',
      postalCode: '',
      province: '',
      status: '',
      title: '',
      village: '',
    },
    mode: 'onChange',
  });

  const isDetailPage = !pathname.includes('add') && !pathname.includes('edit');

  const pageBreadCrumb = useMemo(() => {
    if (pathname.includes('add')) return ({ label: 'Add Management', url: '' });
    if (pathname.includes('edit')) return ({ label: 'Edit Management', url: '' });
    return ({ label: 'Detail Management', url: '' });
  }, []);


  useEffect(() => {
    handleSetBreadcrumb([
      { label: 'Management & Shareholder', url: '' },
      { label: 'Management', url: `/maintenance-data/maintenance-debtor/maintenance/${processId}/management-shareholder/management/` },
      pageBreadCrumb
    ]);
  }, []);

  const { isPending: isSaveLoading, mutate } = useSaveManagement({
    onError: () => showNiceModalV2({ title: 'Gagal Menambahkan Management', type: 'error' }),
    onSuccess: () => {
      showNiceModalV2({ title: 'Berhasil Menambahkan Management', type: 'success' });
    },
  });

  useEffect(() => {
    if (data) {
      setValue('address', data?.address);
      setValue('city', data?.city);
      setValue('collectability', data?.collectability);
      setValue('collectabilityStatusPer', data.collectabilityStatusPer);
      setValue('country', data.country?.label);
      setValue('district', data.district?.label);
      setValue('dob', data.dob);
      setValue('etnicOrigin', data.etnicOrigin?.label);
      setValue('gender', data.gender?.label);
      setValue('idNo', data.idNo);
      setValue('idType', data.idType?.label);
      setValue('identityExpiry', data.identityExpiry);
      setValue('lastModified', data.lastModified);
      setValue('modifiedBy', data.modifiedBy?.label);
      setValue('name', data.name);
      setValue('nationality', data.nationality?.label);
      setValue('npwp', data.npwp);
      setValue('phone', data.phone);
      setValue('pob', data.pob);
      setValue('position', data.position);
      setValue('postalCode', data.postalCode?.label);
      setValue('province', data.province?.label);
      setValue('status', data.status?.label);
      setValue('title', data?.title?.label);
      setValue('village', data?.village?.label);

      if (data.listDocuments.length > 0) {
        const npwpDoc = data.listDocuments?.find((item) => item.documentType === 'NPWP_MANAGEMENT');
        const nikDoc = data.listDocuments?.find((item) => item.documentType === 'NIK_MANAGEMENT');

        const npwpFile = npwpDoc ? {
          extension: npwpDoc.documentExtension ? `.${npwpDoc.documentExtension}` : null,
          name: npwpDoc.documentName,
          url: npwpDoc.document,
        } : null;

        const ktpFile = nikDoc ? {
          extension: nikDoc.documentExtension ? `.${nikDoc.documentExtension}` : null,
          name: nikDoc.documentName,
          url: nikDoc.document,
        } : null;


        setValue('npwpFile', npwpFile);
        setValue('ktpFile', ktpFile);
      }
    }
  }, [data, setValue]);

  const config = { staleTime: ONE_MINUTE };
  const options = { label: 'value1', module: 'value2', value: 'key' };

  const { data: provinceDropdownList } = useGetParameterList('province', options, config);

  const cityModule = provinceDropdownList?.find((item) => item.value === watch().province)?.module;
  const { data: cityDropdownList } = useGetParameterList(cityModule, { ...options, config:
        { enabled: !!cityModule },
  }, config);

  const districtModule = cityDropdownList?.find((item) => item.value === watch().city)?.module;
  const { data: districtDropdownList } = useGetParameterList(districtModule, { ...options, config:
        { enabled: !!districtModule, staleTime: ONE_MINUTE },
  }, config);

  const subDistrictModule = districtDropdownList?.find((item) => item.value === watch().district)?.module;
  const { data: subDistrictDropdownList } = useGetParameterList(subDistrictModule, { ...options, config:
        { enabled: !!subDistrictModule },
  }, config);

  useEffect(() => {
    const postCodeData = subDistrictDropdownList?.find((item) => item.value === watch().village)?.module;
    setValue('postalCode', postCodeData);
  }, [subDistrictDropdownList, watch().village]);

  const handleSave = () => {
    const formValues = getValues();
    const isEdit = pathname.includes('edit');
    const payload = {
      ...formValues,
      debtorId,
      postalCode: Number(formValues.postalCode),
    };

    recordActivity({
      activity: isEdit ? ActivityType.EDIT : ActivityType.ADD,
      bucketProcessId: processId || '',
      changeAfter: JSON.stringify(payload),
      changeBefore: isEdit ? JSON.stringify(data) : '',
      menuCode: 'pipeline',
      module: TypeModule.PIPELINE,
      process: TypeProcess.PIPELINE,
      remarks: `${isEdit ? 'edit' : 'add'} management`,
    });

    mutate(payload);
  };
  return {
    cityDropdownList,
    control,
    districtDropdownList,
    handleSave,
    isDetailPage,
    provinceDropdownList,
    router,
    subDistrictDropdownList,
  };
};

export default useManagementDetailForm;
