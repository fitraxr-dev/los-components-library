import { useEffect, useMemo, useRef, useState } from 'react';

import { yupResolver } from '@hookform/resolvers/yup';
import { useTheme } from '@mui/material';
import { useQueryClient } from '@tanstack/react-query';
import { useParams, usePathname } from 'next/navigation';
import { useForm } from 'react-hook-form';

import { accessid } from '@/configs/constants/pathname';
import { ActivityType } from '@/enums/Activity';
import { TypeModule, TypeProcess } from '@/enums/Module';
import { formatDateTime } from '@/helpers/date';
import showNiceModalV2 from '@/helpers/showNiceModalV2';
import useGetParameterList from '@/hooks/services/useGetParameterList';
import useApp from '@/hooks/useApp';
import useAutoSaveDraft from '@/hooks/useAutoSaveDraft';
import useCheckAccess from '@/hooks/useCheckAccess';
import useCustomRouter from '@/hooks/useCustomRouter';
import useRecordLog from '@/hooks/useRecordLog';

import { useMaintenanceProyekContext } from '@/components/layouts/MaintenanceProyekLayout/MaintenanceProyek.context';

import SubmitPermissionCheck from '../../hooks/submitPermissionCheck';
import useGetMaintenanceProyekDetail from '../../hooks/useGetMaintenanceProyekDetail';
import { useGetProjectFacility, useGetProjectFacilityProduct } from '../../hooks/useProjectFacility';
import useSaveMaintenanceProyek from '../../hooks/useSaveMaintenanceProyek';

import { projectFacilityTableHeader } from './InformasiLainnya.constants';
import { informasiLainnyaSchema } from './InformasiLainnya.schema';

import type { SearchValue } from '@/components/shared/Input/components/Search/Search.types';
import type { TableHeader } from '@/components/shared/Table/Table.types';


const UseInformasiLainnya = () => {
  const { handleSetBreadcrumb, setFormDirty, getFormDirty } = useMaintenanceProyekContext();
  const [{ stepper, currentRole }] = useApp();
  const pathname = usePathname();
  const theme = useTheme();
  const router = useCustomRouter();
  const queryClient = useQueryClient();
  const { id } = useParams();
  const isApproval = id ? id?.includes('MNTP-') : false;
  const [idConvert, setIdConvert] = useState(Array.isArray(id) ? id[0] : id);
  const [bucketProcessId, setBucketProcessId] = useState(null);
  const isDetailPage = pathname.includes('detail');
  const isCreatePage = pathname.includes('create');
  const isEditPage = pathname.includes('edit');
  const canCreate = useCheckAccess(accessid.MAINTENANCE_PROYEK_CREATE);
  const containsPRJ = idConvert?.includes('PRJ');
  const isDraft = stepper.from === 'DRAFT' || stepper.from === 'RETURN_TO_STAFF' || stepper.from === 'default' || containsPRJ;
  const isDisableField = isDetailPage || !canCreate || !isDraft;
  const { recordActivity } = useRecordLog();

  const prevIsDirtyRef = useRef(false);
  const isInitialLoadRef = useRef(true);
  const [initialFormData, setInitialFormData] = useState(null);

  const title = useMemo(() => {
    if (isCreatePage) {
      return 'Create';
    }
    else if (isEditPage) {
      if (canCreate && !isDraft) {
        return 'Detail';
      }
      return 'Edit';
    }
    else if (isDetailPage) {
      return 'Detail';
    }
  }, []);

  const { control, handleSubmit, watch, setValue, reset, formState: { isValid, isDirty } } = useForm({
    defaultValues: {
      bucketProcessId: isApproval ? idConvert : null,
      contractor: null,
      id: isApproval ? null : idConvert,
      otherInformation: {
        exchangeRateSourceOfFund: {
          currency: 'IDR',
          value: null,
        },
        modifiedBy: '',
        modifiedDate: '',
        others: '',
        physicalRealization: '',
        physicalRealizationOthers: '',
        programSourceOfFund: '',
        projectSourceOfFund: '',
        remarkSourceOfFund: '',
        valueInIdr: {
          currency: 'IDR',
          value: null,
        },
        valueSourceOfFund: {
          currency: '',
          value: null,
        },
      },
      owner: null,
      projectInformation: null,
    },
    mode: 'onChange',
    reValidateMode: 'onChange',
    resolver: yupResolver(informasiLainnyaSchema),
  });

  const params = watch();

  // Auto-save payload
  const autoSavePayload = useMemo(() => () => {
    const payload = params;
    return Promise.resolve(payload);
  }, [params]);

  // Auto-save hook
  const { isFetching: isAutoSaveFetching } = useAutoSaveDraft({
    isActive: !isCreatePage && isEditPage,
    payload: autoSavePayload,
    url: 'master.submission.saveProject',
  });

  const setValueWithoutDirty = (name, value) => {
    setValue(name, value, {
      shouldDirty: false,
      shouldTouch: false,
      shouldValidate: false,
    });
  };

  useEffect(() => {
    if (isApproval) {
      setValueWithoutDirty('bucketProcessId', idConvert);
      setValueWithoutDirty('id', null);
    }
    else {
      setValueWithoutDirty('bucketProcessId', null);
      setValueWithoutDirty('id', idConvert);
    }
  }, [isApproval, idConvert]);

  useEffect(() => {
    console.log('Form dirty state changed (InformasiLainnya):', {
      currentIsDirty: isDirty,
      isInitialLoad: isInitialLoadRef.current,
      prevIsDirty: prevIsDirtyRef.current,
    });

    if (isInitialLoadRef.current && isDirty) {
      // console.log('Skipping formDirty update during initial load (InformasiLainnya)');
      prevIsDirtyRef.current = isDirty;
      return;
    }

    // Hanya update jika nilai isDirty benar-benar berubah
    if (prevIsDirtyRef.current !== isDirty) {
      prevIsDirtyRef.current = isDirty;
      setFormDirty('informasiLainnya', isDirty);
      // console.log('Updated context formDirty for InformasiLainnya to:', isDirty);
    }
  }, [isDirty, setFormDirty]);

  // API DETAIL
  const { data: detailProyek } = useGetMaintenanceProyekDetail({ id: idConvert });

  useEffect(() => {
    if (detailProyek) {
      recordActivity({
        activity: ActivityType.VIEW,
        bucketProcessId: detailProyek.data?.content?.bucketProcessId || idConvert || '',
        changeAfter: '',
        changeBefore: '',
        menuCode: 'maintenance-proyek',
        module: TypeModule.MAINTENANCE_DATA,
        process: TypeProcess.MAINTENANCE_PROYEK,
        remarks: 'view maintenance proyek other information detail data',
      });
    }
  }, [detailProyek, idConvert, recordActivity]);

  useEffect(() => {
    if (detailProyek !== undefined) {
      // Reset form dirty state saat data detail project selesai di-load
      prevIsDirtyRef.current = false;
      setFormDirty('informasiLainnya', false);
      // console.log('Reset formDirty for InformasiLainnya due to detailProyek load');
    }
  }, [detailProyek, setFormDirty]);

  useEffect(() => {
    console.log('PARAMS:', params);
  }, [params]);

  // ==== Options list

  // Currency
  const { data: currencyOptions } = useGetParameterList('currency', { label: 'value1', value: 'key' });

  // Program Source of Fund
  const { data: sourceOfFundProgramOptions } = useGetParameterList('programSourceofFund', { label: 'value1', value: 'key' });

  // Project Source of Fund
  const { data: sourceOfFundProjectOptions } = useGetParameterList('projectSourceofFund', { label: 'value1', value: 'key' });

  // Realisasi Fisik
  const { data: physicalRealizationOptions } = useGetParameterList('physicalProgress', { label: 'value1', value: 'key' });

  useEffect(() => {
    if (detailProyek !== undefined) {
      // console.log('Loading data from API, resetting form (InformasiLainnya)...');

      const formData = {
        bucketProcessId: isApproval ? idConvert : null,
        contractor: null,
        id: isApproval ? null : idConvert,
        otherInformation: {
          exchangeRateSourceOfFund: {
            currency: detailProyek?.data?.content?.otherInformation?.exchangeRateSourceOfFund?.value?.currency || 'IDR',
            value: detailProyek?.data?.content?.otherInformation?.exchangeRateSourceOfFund?.value?.value || null,
          },
          modifiedBy: detailProyek?.data?.content?.otherInformation?.modifiedBy || '',
          modifiedDate: detailProyek?.data?.content?.otherInformation?.modifiedDate
            ? formatDateTime(detailProyek.data.content.otherInformation.modifiedDate)
            : '',
          others: detailProyek?.data?.content?.otherInformation?.others?.value || '',
          physicalRealization: detailProyek?.data?.content?.otherInformation?.physicalRealization?.value || '',
          physicalRealizationOthers: detailProyek?.data?.content?.otherInformation?.physicalRealizationOthers?.value || '',
          programSourceOfFund: detailProyek?.data?.content?.otherInformation?.programSourceOfFund?.value || '',
          projectSourceOfFund: detailProyek?.data?.content?.otherInformation?.projectSourceOfFund?.value || '',
          remarkSourceOfFund: detailProyek?.data?.content?.otherInformation?.remarkSourceOfFund?.value || '',
          valueInIdr: {
            currency: detailProyek?.data?.content?.otherInformation?.valueInIdr?.value?.currency || 'IDR',
            value: detailProyek?.data?.content?.otherInformation?.valueInIdr?.value?.value || null,
          },
          valueSourceOfFund: {
            currency: detailProyek?.data?.content?.otherInformation?.valueSourceOfFund?.value?.currency || '',
            value: detailProyek?.data?.content?.otherInformation?.valueSourceOfFund?.value?.value || null,
          },
        },
        owner: null,
        projectInformation: null,
      };

      reset(formData);

      // Store the initial form data for changeBefore tracking
      setInitialFormData(JSON.parse(JSON.stringify(formData)));

      isInitialLoadRef.current = false;
      prevIsDirtyRef.current = false;
      setFormDirty('informasiLainnya', false);

      // console.log('Form reset completed (InformasiLainnya), formDirty set to false');
    }
  }, [detailProyek, reset, setFormDirty, isApproval, idConvert]);

  // API SAVE
  const { mutate: saveProyek, isPending: isSaveLoading, data: submissionData } = useSaveMaintenanceProyek({
    onError: (error) => {
      showNiceModalV2({
        title: 'Terjadi kesalahan, silahkan coba lagi',
        type: 'error',
      });
    },
    onSuccess: (response) => {
      recordActivity({
        activity: ActivityType.SAVE,
        bucketProcessId: response?.data?.content?.bucketProcessId || bucketProcessId || idConvert || '',
        changeAfter: JSON.stringify(params),
        changeBefore: initialFormData ? JSON.stringify(initialFormData) : '',
        menuCode: 'maintenance-proyek',
        module: TypeModule.MAINTENANCE_DATA,
        process: TypeProcess.MAINTENANCE_PROYEK,
        remarks: 'successfully saved maintenance proyek other information',
      });

      // console.log('Save response:', response);

      // Reset form dirty state setelah save berhasil
      prevIsDirtyRef.current = false;
      setFormDirty('informasiLainnya', false);
      // console.log('Reset formDirty for InformasiLainnya after successful save');

      // Store bucketProcessId from response for action buttons
      if (response?.data?.content?.bucketProcessId) {
        setBucketProcessId(response.data.content.bucketProcessId);
      }

      showNiceModalV2({
        onClose: () => {
          // cek URL dan redirect otomatis jika mengandung PRJ
          const currentPathname = pathname;

          // Cek apakah URL mengandung PRJ
          if (currentPathname.includes('PRJ-') && response?.data?.content?.bucketProcessId) {
            const bucketProcessId = response.data.content.bucketProcessId;

            // Replace PRJ-XXXXX dengan MNTP-XXXXX di URL
            const newPath = currentPathname.replace(/PRJ-\d+/, bucketProcessId);

            router.replace(newPath);
          } else {
            queryClient.invalidateQueries({ queryKey: ['maintenance-proyek-detail', idConvert]});
          }
        },
        title: 'Data berhasil disimpan',
        type: 'success',
      });
    },
  });

  const handleSave = () => {
    showNiceModalV2({
      cancelText: 'Tidak',
      onSubmit: () => {
        saveProyek(params);
      },
      submitText: 'Ya',
      title: 'Pastikan Data Sudah Sesuai',
      type: 'warning',
    });
  };

  // === Breadcrump
  const pageBreadCrumb = useMemo(() => {
    if (pathname.includes('create')) return ({ label: 'Add New Project', url: '' });
    if (pathname.includes('edit')) return ({ label: 'Edit Project', url: '' });
    return ({ label: 'Detail Project', url: '' });
  }, []);

  useEffect(() => {
    handleSetBreadcrumb([
      pageBreadCrumb
    ]);
  }, []);

  const submitDisable = useMemo(() => {
    if (detailProyek !== undefined) {
      return SubmitPermissionCheck(detailProyek.data.content);
    }
  }, [detailProyek]);

  // ==== Project Facility Table

  const [projectFacilityPage, setProjectFacilityPage] = useState(1);
  const [projectFacilityPageSize, setProjectFacilityPageSize] = useState(10);
  const [projectFacilityFilter, setProjectFacilityFilter] = useState<SearchValue>({});

  // SearchBy data
  const { data: projectFacilitySearchByOptions } = useGetParameterList('searchByFacilityProject', { label: 'value1', value: 'value2' });

  // SortBy data
  const { data: sortByProjectFacilityOptions } = useGetParameterList('sortByFacilityProject', { label: 'value1', value: 'value2' });

  // Product data
  const { data: productFacilityOptions } = useGetProjectFacilityProduct();
  const [productFacilityOptionsMapped, setProductFacilityOptionsMapped] = useState([]);

  // institutionType data
  const { data: statusFacilityOptions } = useGetParameterList('statusFacility', { label: 'value1', value: 'key' });

  useEffect(() => {
    const productFacilityOptionsTemp = productFacilityOptions?.data?.contents.map((item) => ({
      label: item.label,
      value: item.key,
    }));
    setProductFacilityOptionsMapped(productFacilityOptionsTemp);
  }, [productFacilityOptions]);

  const projectFacilityFilterContentList = [
    {
      key: 'sortList',
      label: 'Urutkan Berdasarkan',
      options: sortByProjectFacilityOptions,
      type: 'sort',
    },
    {
      key: 'products',
      label: 'Produk',
      options: productFacilityOptionsMapped,
      type: 'multiple-autocomplete',
    },
    {
      key: 'status',
      label: 'Status Fasilitas',
      options: statusFacilityOptions,
      type: 'multiple-autocomplete',
    },
  ];

  const tableHeaderProjectFacility: TableHeader[] = [
    ...projectFacilityTableHeader,
  ];

  // API List
  const { data: projectFacilityData, isFetching: isLoadingProjectFacility } = useGetProjectFacility({
    filter: {
      ...projectFacilityFilter?.filter,
      projectCode: idConvert ?? null,
    },
    page: {
      itemPerPage: projectFacilityPageSize,
      noPage: projectFacilityPage,
    },
    searchDetail: projectFacilityFilter?.searchDetail ?? {},
    sortList: projectFacilityFilter?.sortList ?? {},
  });

  return {
    bucketProcessId,
    canCreate,
    control,
    currencyOptions,
    detailProyek,
    handleSave,
    handleSubmit,
    isAutoSaveFetching,
    isCreatePage,
    isDetailPage,
    isDisableField,
    isEditPage,
    isLoadingProjectFacility,
    isSaveLoading,
    isValid,
    physicalRealizationOptions,
    projectFacilityData,
    projectFacilityFilter,
    projectFacilityFilterContentList,
    projectFacilityPage,
    projectFacilityPageSize,
    projectFacilitySearchByOptions,
    router,
    setProjectFacilityFilter,
    setProjectFacilityPage,
    setProjectFacilityPageSize,
    setValue,
    setValueWithoutDirty,
    sourceOfFundProgramOptions,
    sourceOfFundProjectOptions,
    submitDisable,
    tableHeaderProjectFacility,
    theme,
    title,
    watch,
  };
};

export default UseInformasiLainnya;
