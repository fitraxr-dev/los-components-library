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

import { projectFacilityTableHeader } from './ProjectOwner.constants';
import { yupSchema } from './ProjectOwner.schema';

import type { SearchValue } from '@/components/shared/Input/components/Search/Search.types';
import type { TableHeader } from '@/components/shared/Table/Table.types';


const UseProjectOwner = () => {
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

  const prevIsDirtyRef = useRef(false);
  const isInitialLoadRef = useRef(true);
  const { recordActivity } = useRecordLog();
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
      otherInformation: null,
      owner: {
        address: '',
        contactName: '',
        email: '',
        modifiedBy: '',
        modifiedDate: '',
        name: '',
        phone: {
          phoneCode: '',
          phoneExt: '',
          phoneNumber: '',
        },
        website: '',
      },
      projectInformation: null,
    },
    mode: 'onChange',
    reValidateMode: 'onChange',
    resolver: yupResolver(yupSchema),
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

  useEffect(() => {
    if (isApproval) {
      setValue('bucketProcessId', idConvert);
      setValue('id', null);
    }
    else {
      setValue('bucketProcessId', null);
      setValue('id', idConvert);
    }
  }, [isApproval, setValue, idConvert]);

  useEffect(() => {
    console.log('Form dirty state changed (ProjectOwner):', {
      currentIsDirty: isDirty,
      isInitialLoad: isInitialLoadRef.current,
      prevIsDirty: prevIsDirtyRef.current,
    });

    if (isInitialLoadRef.current && isDirty) {
      // console.log('Skipping formDirty update during initial load (ProjectOwner)');
      prevIsDirtyRef.current = isDirty;
      return;
    }

    if (prevIsDirtyRef.current !== isDirty) {
      prevIsDirtyRef.current = isDirty;
      setFormDirty('projectOwner', isDirty);
      // console.log('Updated context formDirty for ProjectOwner to:', isDirty);
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
        remarks: 'view maintenance proyek project owner detail data',
      });
    }
  }, [detailProyek, idConvert, recordActivity]);

  useEffect(() => {
    if (detailProyek !== undefined) {
      prevIsDirtyRef.current = false;
      setFormDirty('projectOwner', false);
      // console.log('Reset formDirty for ProjectOwner due to detailProyek load');
    }
  }, [detailProyek, setFormDirty]);

  useEffect(() => {
    if (detailProyek !== undefined) {
      // console.log('Loading data from API, resetting form (ProjectOwner)...');

      const formData = {
        bucketProcessId: isApproval ? idConvert : null,
        contractor: null,
        id: detailProyek?.data?.content?.id || idConvert || '',
        otherInformation: null,
        owner: {
          address: detailProyek?.data?.content?.owner !== null ? (detailProyek?.data?.content?.owner?.address.value || '') : '',
          contactName: detailProyek?.data?.content?.owner !== null ? (detailProyek?.data?.content?.owner?.contactName.value || '') : '',
          email: detailProyek?.data?.content?.owner !== null ? (detailProyek?.data?.content?.owner?.email.value || '') : '',
          modifiedBy: detailProyek?.data?.content?.owner !== null ? (detailProyek?.data?.content?.owner?.modifiedBy || '') : '',
          modifiedDate: detailProyek?.data?.content?.owner !== null ? formatDateTime(detailProyek?.data?.content?.owner?.modifiedDate || '') : '',
          name: detailProyek?.data?.content?.owner !== null ? (detailProyek?.data?.content?.owner?.name.value || '') : '',
          phone: {
            phoneCode: detailProyek?.data?.content?.owner !== null ? (detailProyek?.data?.content?.owner?.phone.value.phoneCode || '') : '',
            phoneExt: detailProyek?.data?.content?.owner !== null ? (detailProyek?.data?.content?.owner?.phone.value.phoneExt || '') : '',
            phoneNumber: detailProyek?.data?.content?.owner !== null ? (detailProyek?.data?.content?.owner?.phone.value.phoneNumber || '') : '',
          },
          website: detailProyek?.data?.content?.owner !== null ? (detailProyek?.data?.content?.owner?.website.value || '') : '',
        },
        projectInformation: null,
      };

      reset(formData);

      // Store the initial form data for changeBefore tracking
      setInitialFormData(JSON.parse(JSON.stringify(formData)));

      isInitialLoadRef.current = false;
      prevIsDirtyRef.current = false;
      setFormDirty('projectOwner', false);

      // console.log('Form reset completed (ProjectOwner), formDirty set to false');
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
        remarks: 'successfully saved maintenance proyek project owner',
      });

      console.log('Save response:', response);

      prevIsDirtyRef.current = false;
      setFormDirty('projectOwner', false);
      // console.log('Reset formDirty for ProjectOwner after successful save');

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

            console.log('Redirecting from:', currentPathname);
            console.log('Redirecting to:', newPath);

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

  const submitDisable = useMemo(() => {
    if (detailProyek !== undefined) {
      return SubmitPermissionCheck(detailProyek.data.content);
    }
  }, [detailProyek]);

  return {
    bucketProcessId,
    canCreate,
    control,
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
    submitDisable,
    tableHeaderProjectFacility,
    theme,
    title,
    watch,
  };
};

export default UseProjectOwner;
