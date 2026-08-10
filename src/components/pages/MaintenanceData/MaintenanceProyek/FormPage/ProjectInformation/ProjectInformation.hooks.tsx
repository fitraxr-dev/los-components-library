import { useEffect, useMemo, useRef, useState } from 'react';

import NiceModal from '@ebay/nice-modal-react';
import { yupResolver } from '@hookform/resolvers/yup';
import { useTheme } from '@mui/material';
import { useQueryClient } from '@tanstack/react-query';
import { useParams, usePathname, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';

import { accessid, maintenanceProyek } from '@/configs/constants/pathname';
import { ActivityType } from '@/enums/Activity';
import { TypeModule, TypeProcess } from '@/enums/Module';
import { formatDateTime } from '@/helpers/date';
import { replacePath } from '@/helpers/navigation';
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
import { useDeleteProjectFacility } from '../../hooks/useProjectFacilityDelete';
import { useDeleteProjectMember, useGetProjectMember } from '../../hooks/useProjectMember';
import { useDeleteProjectPhase, useGetProjectPhase } from '../../hooks/useProjectPhase';
import useSaveMaintenanceProyek from '../../hooks/useSaveMaintenanceProyek';
import { modal as MODAL } from '../../ListPage/MaintenanceProyek.constants';

import {
  projectFacilityTableHeader,
  projectMemberTableHeader,
  projectPhaseTableHeader,
} from './ProjectInformation.constants';
import { projectInformationSchema } from './projectInformation.schema';

import type { SearchValue } from '@/components/shared/Input/components/Search/Search.types';
import type { TableHeader } from '@/components/shared/Table/Table.types';

// import { usePreventLeave } from "../../components/PreventLeaveWarning/PreventLeave";

const UseProjectInformation = () => {
  const { recordActivity } = useRecordLog();
  const { handleSetBreadcrumb, setFormDirty, getFormDirty } = useMaintenanceProyekContext();
  const [{ stepper, currentRole }] = useApp();
  const pathname = usePathname();
  const theme = useTheme();
  const router = useCustomRouter();
  const queryClient = useQueryClient();
  const { id } = useParams();
  const isApproval = id ? id?.includes('MNTP-') : false;
  const [idConvert, setIdConvert] = useState(Array.isArray(id) ? id[0] : id);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const isDetailPage = pathname.includes('detail');
  const isCreatePage = pathname.includes('create');
  const isEditPage = pathname.includes('edit');
  const canCreate = useCheckAccess(accessid.MAINTENANCE_PROYEK_CREATE);
  const containsPRJ = idConvert?.includes('PRJ');
  const isDraft = stepper.from === 'DRAFT' || stepper.from === 'RETURN_TO_STAFF' || stepper.from === 'default' || containsPRJ;
  const isDisableField = isDetailPage || !canCreate || !isDraft;
  const [bucketProcessId, setBucketProcessId] = useState(null);
  const [sessionStep, setSessionStep] = useState(null);
  const [sessionMaintenanceProyek, setSessionMaintenanceProyek] = useState(null);
  const [sectionsInitialized, setSectionsInitialized] = useState(false);
  const [sectionStates, setSectionStates] = useState({
    projectFacility: false,
    projectMember: false,
    projectPhase: false,
  });
  const prevIsDirtyRef = useRef(false);
  const isInitialLoadRef = useRef(true);
  const [originalFormData, setOriginalFormData] = useState(null);
  const searchParams = useSearchParams();
  const fromConventional = searchParams.get('fromConventional') === 'true';

  useEffect(() => {
    const checkSessionStorage = () => {
      if (typeof window !== 'undefined') {
        const step = sessionStorage.getItem('step');
        const maintenanceProyek = sessionStorage.getItem('maintenance-proyek');

        if (step !== sessionStep || maintenanceProyek !== sessionMaintenanceProyek) {
          setSessionStep(step);
          setSessionMaintenanceProyek(maintenanceProyek);

          // Force refresh project member data when session storage changes
          queryClient.invalidateQueries({
            queryKey: ['project-member-list'],
          });
        }
      }
    };

    checkSessionStorage();

    const interval = setInterval(checkSessionStorage, 500);

    return () => clearInterval(interval);
  }, [sessionStep, sessionMaintenanceProyek, queryClient]);

  // Update projectMemberFilter when session changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const step = sessionStorage.getItem('step');
      const maintenanceProyek = sessionStorage.getItem('maintenance-proyek');

      if (step === '1' && maintenanceProyek) {
        setProjectMemberFilter((prev) => ({
          ...prev,
          filter: {
            ...prev.filter,
            projectCode: maintenanceProyek,
          },
        }));
      }
    }
  }, [sessionStep, sessionMaintenanceProyek]);

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
      owner: null,
      projectInformation: {
        category: '',
        classification: '',
        description: '',
        endDate: '',
        exchangeRate: {
          currency: '',
          value: null,
        },
        modifiedBy: '',
        modifiedDate: '',
        name: '',
        output: '',
        outputUnit: '',
        projectAddress: {
          address: '',
          city: '',
          district: '',
          postalCode: '',
          province: '',
          village: '',
        },
        sector: '',
        startDate: '',
        value: {
          currency: '',
          value: null,
        },
        valueInIdr: {
          currency: '',
          value: null,
        },
      },
    },
    mode: 'onChange',
    reValidateMode: 'onChange',
    resolver: yupResolver(projectInformationSchema),
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
    console.log('Form dirty state changed (ProjectInformation):', {
      currentIsDirty: isDirty,
      isInitialLoad: isInitialLoadRef.current,
      prevIsDirty: prevIsDirtyRef.current,
    });

    if (isInitialLoadRef.current && isDirty) {
      // console.log('Skipping formDirty update during initial load (ProjectInformation)');
      prevIsDirtyRef.current = isDirty;
      return;
    }

    // Hanya update jika nilai isDirty benar-benar berubah
    if (prevIsDirtyRef.current !== isDirty) {
      prevIsDirtyRef.current = isDirty;
      setFormDirty('projectInformation', isDirty);
      // console.log('Updated context formDirty for ProjectInformation to:', isDirty);
    }
  }, [isDirty, setFormDirty]);

  // API DETAIL
  const { data: detailProyek } = useGetMaintenanceProyekDetail({ id: idConvert });

  // Record activity for maintenance proyek detail data
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
        remarks: 'view maintenance proyek detail data',
      });
    }
  }, [detailProyek, idConvert, recordActivity]);

  useEffect(() => {
    if (detailProyek !== undefined) {
      // Reset form dirty state saat data detail project selesai di-load
      prevIsDirtyRef.current = false;
      setFormDirty('projectInformation', false);
      // console.log('Reset formDirty for ProjectInformation due to detailProyek load');
    }
  }, [detailProyek, setFormDirty]);

  // usePreventLeave(isDirty || !isValid)

  // === Breadcrump
  const pageBreadCrumb = useMemo(() => {
    if (pathname.includes('create')) return ({ label: 'Add New Project', url: '' });
    if (pathname.includes('edit')) return ({ label: 'Edit Project', url: '' });
    return ({ label: 'Detail Project', url: '' });
  }, []);

  useEffect(() => {
    if (!fromConventional) {
      handleSetBreadcrumb([
        pageBreadCrumb
      ]);
    }
  }, []);

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
        changeBefore: originalFormData ? JSON.stringify(originalFormData) : '',
        menuCode: 'maintenance-proyek',
        module: TypeModule.MAINTENANCE_DATA,
        process: TypeProcess.MAINTENANCE_PROYEK,
        remarks: 'successfully saved maintenance proyek project information',
      });

      console.log('Save response:', response);

      // Reset form dirty state setelah save berhasil
      prevIsDirtyRef.current = false;
      setFormDirty('projectInformation', false);
      // console.log('Reset formDirty for ProjectInformation after successful save');

      setOriginalFormData(JSON.parse(JSON.stringify(params)));

      // Simpan bucketProcessId ke state
      if (response?.data?.content?.bucketProcessId) {
        setBucketProcessId(response.data.content.bucketProcessId);
      }

      setSaveSuccess(true);
      showNiceModalV2({
        onClose: () => {
          if (isCreatePage) {
            window.location.replace(replacePath(maintenanceProyek.EDIT_PAGE,
              { id: response?.data?.content?.bucketProcessId }
            ));
          }
          else if (isEditPage) {
            // cek URL dan redirect otomatis jika mengandung PRJ
            const currentUrl = window.location.href;
            const currentPathname = window.location.pathname;

            // Cek apakah URL mengandung PRJ
            if (currentUrl.includes('PRJ-') && response?.data?.content?.bucketProcessId) {
              const bucketProcessId = response.data.content.bucketProcessId;

              // Replace PRJ-XXXXX dengan MNTP-XXXXX di URL
              const newPathname = currentPathname.replace(/PRJ-\d+/, bucketProcessId);
              const newUrl = window.location.origin + newPathname + window.location.search;

              // console.log('Redirecting from:', currentUrl);
              // console.log('Redirecting to:', newUrl);

              // Redirect ke URL baru
              window.location.replace(newUrl);
            } else {
              // Jika tidak mengandung PRJ, lakukan invalidate queries seperti biasa
              queryClient.invalidateQueries({ queryKey: ['maintenance-proyek-detail', idConvert]});
            }
          }
        },
        title: 'Data berhasil disimpan',
        type: 'success',
      });
    },
  });

  useEffect(() => {
    console.log('PARAMS:', params);
  }, [params]);

  // ==== Options list

  // Currency
  const { data: currencyOptions } = useGetParameterList('currency', { label: 'value1', value: 'key' });

  // Klasifikasi Proyek
  const { data: klasifikasiProyekOptions } = useGetParameterList('klasifikasiProyek', { label: 'value1', value: 'key' });

  // Kategori Proyek
  const { data: kategoriProyekOptions } = useGetParameterList('kategoriProyek', { label: 'value1', value: 'key' });

  // Sektor Yang Dibiayai
  const { data: sektorYangDibiayaiOptions } = useGetParameterList('sector', { label: 'value1', value: 'key' });

  // Satuan Output Proyek
  const { data: satuanOutputProyekOptions } = useGetParameterList('outputProyek', { label: 'value1', value: 'key' });

  // Province List
  const { data: provinceOptions } = useGetParameterList('province', { label: 'value1', value: 'key', value2: 'value2' });
  const [provinceOptionsMapped, setProvinceOptionsMapped] = useState([]);

  const selectedProvinceId = useMemo(() => {
    const val = params.projectInformation.projectAddress.province;
    if (!val || typeof val !== 'string') return null;

    const province = provinceOptions.find((item) => item.value === val);
    return province?.value2 || null;
  }, [params.projectInformation.projectAddress.province, provinceOptions]);

  useEffect(() => {
    const provinceOptionsTemp = provinceOptions.map((item) => ({
      label: item.label,
      value: item.value,
    }));
    setProvinceOptionsMapped(provinceOptionsTemp);
  }, [provinceOptions]);

  // City List
  const { data: cityOptions = []} = useGetParameterList(
    selectedProvinceId ?? '',
    { label: 'value1', value: 'key', value2: 'value2' },
  );
  const [cityOptionsMapped, setCityOptionsMapped] = useState([]);

  const selectedCityId = useMemo(() => {
    const val = params.projectInformation.projectAddress.city;
    if (!val || typeof val !== 'string') return null;

    const city = cityOptions.find((item) => item.value === val);
    return city?.value2 || null;
  }, [params.projectInformation.projectAddress.city, cityOptions]);

  useEffect(() => {
    const cityOptionsTemp = cityOptions.map((item) => ({
      label: item.label,
      value: item.value,
    }));
    setCityOptionsMapped(cityOptionsTemp);
  }, [cityOptions]);

  // District List
  const { data: districtOptions = []} = useGetParameterList(
    selectedCityId ?? '',
    { label: 'value1', value: 'key', value2: 'value2' },
  );
  const [districtOptionsMapped, setDistrictOptionsMapped] = useState([]);
  const selectedDistrictId = useMemo(() => {
    const val = params.projectInformation.projectAddress.district;
    if (!val || typeof val !== 'string') return null;

    const district = districtOptions.find((item) => item.value === val);
    return district?.value2 || null;
  }, [params.projectInformation.projectAddress.district, districtOptions]);

  useEffect(() => {
    const districtOptionsTemp = districtOptions.map((item) => ({
      label: item.label,
      value: item.value,
    }));
    setDistrictOptionsMapped(districtOptionsTemp);
  }, [districtOptions]);

  // Village List
  const { data: villageOptions = []} = useGetParameterList(
    selectedDistrictId ?? '',
    { label: 'value1', value: 'key', value2: 'value2' },
  );
  const [villageOptionsMapped, setVillageOptionsMapped] = useState([]);
  const selectedVillageId = useMemo(() => {
    const val = params.projectInformation.projectAddress.village;
    if (!val || typeof val !== 'string') return null;

    const village = villageOptions.find((item) => item.value === val);
    return village?.value2 || null;
  }, [params.projectInformation.projectAddress.village, villageOptions]);

  useEffect(() => {
    const villageOptionsTemp = villageOptions.map((item) => ({
      label: item.label,
      value: item.value,
    }));
    setVillageOptionsMapped(villageOptionsTemp);
  }, [villageOptions]);

  // Postal Code List
  const [postalCodeOptionsMapped, setPostalCodeOptionsMapped] = useState([]);

  useEffect(() => {
    const postalCodeOptionsTemp = Array.from(
      new Map(
        villageOptions.map((item) => [item.value2, { label: item.value2, value: item.value2 }])
      ).values()
    );
    setPostalCodeOptionsMapped(postalCodeOptionsTemp);
  }, [selectedVillageId]);

  useEffect(() => {
    const currentLocationParams = params.projectInformation.projectAddress ?? {};
    if (currentLocationParams.province === '') {
      setValue('projectInformation.projectAddress.city', '');
      setValue('projectInformation.projectAddress.district', '');
      setValue('projectInformation.projectAddress.village', '');
      setValue('projectInformation.projectAddress.postalCode', '');
      setCityOptionsMapped([]);
      setDistrictOptionsMapped([]);
      setVillageOptionsMapped([]);
      setPostalCodeOptionsMapped([]);
    }
    else if (currentLocationParams.city === '') {
      setValue('projectInformation.projectAddress.district', '');
      setValue('projectInformation.projectAddress.village', '');
      setValue('projectInformation.projectAddress.postalCode', '');
      setDistrictOptionsMapped([]);
      setVillageOptionsMapped([]);
      setPostalCodeOptionsMapped([]);
    }
    else if (currentLocationParams.district === '') {
      setValue('projectInformation.projectAddress.village', '');
      setValue('projectInformation.projectAddress.postalCode', '');
      setVillageOptionsMapped([]);
      setPostalCodeOptionsMapped([]);
    }
    else if (currentLocationParams.village === '') {
      setValue('projectInformation.projectAddress.postalCode', '');
      setPostalCodeOptionsMapped([]);
    }
  }, [
    params.projectInformation.projectAddress.province,
    params.projectInformation.projectAddress.city,
    params.projectInformation.projectAddress.district,
    params.projectInformation.projectAddress.village
  ]);

  useEffect(() => {
    if (detailProyek !== undefined) {
      // console.log('Loading data from API, resetting form...');

      const formData = {
        bucketProcessId: isApproval ? idConvert : null,
        contractor: null,
        id: detailProyek?.data?.content?.id || idConvert || '',
        otherInformation: null,
        owner: null,
        projectInformation: {
          category: detailProyek?.data?.content?.projectInformation?.category?.value || '',
          classification: detailProyek?.data?.content?.projectInformation?.classification?.value || '',
          description: detailProyek?.data?.content?.projectInformation?.description?.value || '',
          endDate: detailProyek?.data?.content?.projectInformation?.endDate?.value || '',
          exchangeRate: {
            currency: detailProyek?.data?.content?.projectInformation?.exchangeRate?.value?.currency || '',
            value: detailProyek?.data?.content?.projectInformation?.exchangeRate?.value?.value || null,
          },
          modifiedBy: detailProyek?.data?.content?.projectInformation?.modifiedBy || '',
          modifiedDate: detailProyek?.data?.content?.projectInformation?.modifiedDate
            ? formatDateTime(detailProyek.data.content.projectInformation.modifiedDate)
            : '',
          name: detailProyek?.data?.content?.projectInformation?.name?.value || '',
          output: detailProyek?.data?.content?.projectInformation?.output?.value || '',
          outputUnit: detailProyek?.data?.content?.projectInformation?.outputUnit?.value || '',
          projectAddress: {
            address: detailProyek?.data?.content?.projectInformation?.projectAddress?.address?.value || '',
            city: detailProyek?.data?.content?.projectInformation?.projectAddress?.city?.value || '',
            district: detailProyek?.data?.content?.projectInformation?.projectAddress?.district?.value || '',
            postalCode: detailProyek?.data?.content?.projectInformation?.projectAddress?.postalCode?.value || '',
            province: detailProyek?.data?.content?.projectInformation?.projectAddress?.province?.value || '',
            village: detailProyek?.data?.content?.projectInformation?.projectAddress?.village?.value || '',
          },
          sector: detailProyek?.data?.content?.projectInformation?.sector?.value || '',
          startDate: detailProyek?.data?.content?.projectInformation?.startDate?.value || '',
          value: {
            currency: detailProyek?.data?.content?.projectInformation?.value?.value?.currency || '',
            value: detailProyek?.data?.content?.projectInformation?.value?.value?.value || null,
          },
          valueInIdr: {
            currency: detailProyek?.data?.content?.projectInformation?.valueInIdr?.value?.currency || '',
            value: detailProyek?.data?.content?.projectInformation?.valueInIdr?.value?.value || null,
          },
        },
      };

      setOriginalFormData(JSON.parse(JSON.stringify(formData)));

      reset(formData);

      isInitialLoadRef.current = false;
      prevIsDirtyRef.current = false;
      setFormDirty('projectInformation', false);

      // console.log('Form reset completed, formDirty set to false');
    }
  }, [detailProyek, reset, setFormDirty, isApproval, idConvert]);

  // ==== Project Phase Table

  const [projectPhasePage, setProjectPhasePage] = useState(1);
  const [projectPhasePageSize, setProjectPhasePageSize] = useState(10);
  const [projectPhaseFilter, setProjectPhaseFilter] = useState<SearchValue>({});

  // Search By data
  const { data: projectPhaseSearchByOptions } = useGetParameterList('searchByProjectPhase', { label: 'value1', value: 'value2' });

  // Sort By data
  const { data: sortByProjectPhaseOptions } = useGetParameterList('sortByProjectPhase', { label: 'value1', value: 'value2' });

  const projectPhaseFilterContentList = [
    {
      key: 'sortList',
      label: 'Urutkan Berdasarkan',
      options: sortByProjectPhaseOptions,
      type: 'sort',
    },
    {
      endKey: 'to',
      label: 'Status as of',
      startKey: 'from',
      type: 'period',
    },
  ];

  const tableHeaderProjectPhase: TableHeader[] = [
    ...projectPhaseTableHeader,
    {
      key: 'action',
      label: 'Action',
      options: [
        {
          iconName: 'edit',
          isHidden: isDisableField || !isEditPage,
          onClick: (data) => {
            handleEditProjectPhase(data.id);
          },
        },
        {
          iconName: 'delete',
          isHidden: isDisableField || !isEditPage,
          onClick: (data) => {
            handleDeleteProjectPhase(data.id);
          },
        }
      ],
      sx: {
        minWidth: '10vw',
      },
      type: 'action',
    }
  ];

  // API List
  const { data: projectPhaseData, isFetching: isLoadingProjectPhase } = useGetProjectPhase({
    filter: {
      ...projectPhaseFilter?.filter,
      projectCode: idConvert ?? null,
    },
    page: {
      itemPerPage: projectPhasePageSize,
      noPage: projectPhasePage,
    },
    searchDetail: projectPhaseFilter?.searchDetail ?? {},
    sortList: projectPhaseFilter?.sortList ?? {},
  });

  // Record activity for project phase data
  useEffect(() => {
    if (projectPhaseData) {
      recordActivity({
        activity: ActivityType.VIEW,
        bucketProcessId: bucketProcessId || idConvert || '',
        changeAfter: '',
        changeBefore: '',
        menuCode: 'maintenance-proyek',
        module: TypeModule.MAINTENANCE_DATA,
        process: TypeProcess.MAINTENANCE_PROYEK,
        remarks: 'view maintenance proyek project phase data',
      });
    }
  }, [projectPhaseData,
    projectPhasePage,
    projectPhasePageSize,
    projectPhaseFilter,
    idConvert,
    bucketProcessId,
    recordActivity]);

  // API DELETE
  const { mutate: deletePhase, isPending: isDeletePhaseLoading, data: deletePhaseData } = useDeleteProjectPhase({});

  const handleAddProjectPhase = () => {
    NiceModal.show(MODAL.ADD_EDIT_PROJECT_PHASE_MODAL, {
      action: 'Add',
      listPayload: {
        filter: {
          ...projectPhaseFilter?.filter,
          projectCode: idConvert ?? null,
        },
        page: {
          itemPerPage: projectPhasePageSize,
          noPage: projectPhasePage,
        },
        searchDetail: projectPhaseFilter?.searchDetail ?? {},
        sortList: projectPhaseFilter?.sortList ?? {},
      },
      projectCode: idConvert,
    });
  };

  const handleEditProjectPhase = (projectPhaseId: number) => {
    const selectedProjectPhase = projectPhaseData.data.contents.find((data) => data.id === projectPhaseId);
    NiceModal.show(MODAL.ADD_EDIT_PROJECT_PHASE_MODAL, {
      action: 'Edit',
      data: selectedProjectPhase,
      listPayload: {
        filter: {
          ...projectPhaseFilter?.filter,
          projectCode: idConvert ?? null,
        },
        page: {
          itemPerPage: projectPhasePageSize,
          noPage: projectPhasePage,
        },
        searchDetail: projectPhaseFilter?.searchDetail ?? {},
        sortList: projectPhaseFilter?.sortList ?? {},
      },
      projectCode: idConvert,
    });
  };

  const handleDeleteProjectPhase = (projectPhaseId: number) => {
    // Find the project phase data that will be deleted from current state
    const selectedProjectPhase = projectPhaseData.data.contents.find((data) => data.id === projectPhaseId);

    const payload = {
      projectCode: idConvert,
      projectPhaseId: projectPhaseId,
    };

    showNiceModalV2({
      cancelText: 'Tidak',
      onSubmit: () => {
        const dataToDelete = {
          id: selectedProjectPhase?.id,
          name: selectedProjectPhase?.name,
          statusAsOf: selectedProjectPhase?.statusAsOf,
        };

        // Store the data temporarily before deletion
        const dataBeforeDelete = dataToDelete;

        deletePhase(payload, {
          onError: (error) => {
            showNiceModalV2({
              title: 'Terjadi kesalahan, silahkan coba lagi',
              type: 'error',
            });
          },
          onSuccess: (response, variables) => {
            recordActivity({
              activity: ActivityType.DELETE,
              bucketProcessId: bucketProcessId || idConvert || '',
              changeAfter: '',
              changeBefore: JSON.stringify(dataBeforeDelete),
              menuCode: 'maintenance-proyek',
              module: TypeModule.MAINTENANCE_DATA,
              process: TypeProcess.MAINTENANCE_PROYEK,
              remarks: 'successfully deleted maintenance proyek project phase',
            });

            showNiceModalV2({
              onClose: () => {
                queryClient.invalidateQueries({
                  queryKey: [
                    'project-phase-list',
                    {
                      filter: {
                        ...projectPhaseFilter?.filter,
                        projectCode: idConvert ?? null,
                      },
                      page: {
                        itemPerPage: projectPhasePageSize,
                        noPage: projectPhasePage,
                      },
                      searchDetail: projectPhaseFilter?.searchDetail ?? {},
                      sortList: projectPhaseFilter?.sortList ?? {},
                    },
                  ],
                });
              },
              title: 'Data berhasil dihapus',
              type: 'success',
            });
          },
        });
      },
      submitText: 'Ya',
      title: 'Anda yakin menghapus data ini?',
      type: 'warning',
    });
  };

  const { mutate: deleteFacility, isPending: isDeleteFacilityLoading } = useDeleteProjectFacility({
    onError: (error) => {
      showNiceModalV2({
        title: 'Terjadi kesalahan, silahkan coba lagi',
        type: 'error',
      });
    },
    onSuccess: (response, variables) => {
      recordActivity({
        activity: ActivityType.DELETE,
        bucketProcessId: response?.data?.content?.bucketProcessId || bucketProcessId || idConvert || '',
        changeAfter: '',
        changeBefore: JSON.stringify(variables),
        menuCode: 'maintenance-proyek',
        module: TypeModule.MAINTENANCE_DATA,
        process: TypeProcess.MAINTENANCE_PROYEK,
        remarks: 'successfully deleted maintenance proyek project facility',
      });

      showNiceModalV2({
        onClose: () => {
          queryClient.invalidateQueries({
            queryKey: ['project-facility-list'],
          });
        },
        title: 'Fasilitas berhasil dihapus',
        type: 'success',
      });
    },
  });

  const handleDeleteProjectFacility = (facilityId: string) => {
    const payload = {
      facilityId: facilityId,
      projectCode: idConvert,
    };

    showNiceModalV2({
      cancelText: 'Tidak',
      onSubmit: () => {
        deleteFacility(payload);
      },
      submitText: 'Ya',
      title: 'Anda yakin menghapus fasilitas ini?',
      type: 'warning',
    });
  };

  // ==== Project Member Table
  const [projectMemberPage, setProjectMemberPage] = useState(1);
  const [projectMemberPageSize, setProjectMemberPageSize] = useState(10);
  const [projectMemberFilter, setProjectMemberFilter] = useState({
    filter: {
      institutionTypes: [],
      projectCode: idConvert ?? null,
    },
    page: {
      itemPerPage: projectMemberPageSize,
      noPage: projectMemberPage,
    },
    searchDetail: {
      key: '',
      value: '',
    },
    sortList: {},
  });

  // SearchBy data
  const { data: projectMemberSearchByOptions } = useGetParameterList('searchByMember', { label: 'value1', value: 'value2' });

  // SortBy data
  const { data: sortByProjectMemberOptions } = useGetParameterList('sortByMember', { label: 'value1', value: 'value2' });

  // institutionType data
  const { data: institutionTypeOptions } = useGetParameterList('institutionType', { label: 'value1', value: 'key' });

  const projectMemberFilterContentList = [
    {
      key: 'sortList',
      label: 'Urutkan Berdasarkan',
      options: sortByProjectMemberOptions,
      type: 'sort',
    },
    {
      key: 'institutionTypes',
      label: 'Institution Type',
      options: institutionTypeOptions,
      type: 'multiple-autocomplete',
    },
  ];

  const tableHeaderProjectMember: TableHeader[] = [
    ...projectMemberTableHeader,
    ...(!isDisableField && isEditPage ? [{
      key: 'action',
      label: 'Action',
      options: [
        {
          iconName: 'delete',
          onClick: (data) => {
            handleDeleteProjectMember(data.customerId);
          },
        }
      ],
      sx: {
        minWidth: '10vw',
      },
      type: 'action' as const,
    }] : [])
  ];

  // API List
  const { data: projectMemberData, isFetching: isLoadingProjectMember } = useGetProjectMember({
    filter: {
      institutionTypes: projectMemberFilter?.filter?.institutionTypes?.length > 0
        ? projectMemberFilter.filter.institutionTypes.map((item) => {
          return typeof item === 'string' ? item : item?.value || item?.key;
        })
        : null,
      projectCode: idConvert ?? null,
    },
    page: {
      itemPerPage: projectMemberPageSize,
      noPage: projectMemberPage,
    },
    searchDetail: projectMemberFilter?.searchDetail ?? {
      key: '',
      value: '',
    },
    sortList: projectMemberFilter?.sortList ?? {},
  });

  // Record activity for project member data
  useEffect(() => {
    if (projectMemberData) {
      recordActivity({
        activity: ActivityType.VIEW,
        bucketProcessId: bucketProcessId || idConvert || '',
        changeAfter: '',
        changeBefore: '',
        menuCode: 'maintenance-proyek',
        module: TypeModule.MAINTENANCE_DATA,
        process: TypeProcess.MAINTENANCE_PROYEK,
        remarks: 'view maintenance proyek project member data',
      });
    }
  }, [projectMemberData,
    projectMemberPage,
    projectMemberPageSize,
    projectMemberFilter,
    idConvert,
    bucketProcessId,
    recordActivity]);

  const [projectMemberDataMapped, setProjectMemberDataMapped] = useState(null);

  useEffect(() => {
    if (projectMemberData && institutionTypeOptions) {
      const projectMemberDataTemp = projectMemberData.data.contents.map((item) => {
        const foundInstitution = institutionTypeOptions.find(
          (institution) => institution.value === item.institutionType
        );

        return {
          ...item,
          institutionType: foundInstitution ? foundInstitution.label : null,
        };
      });
      setProjectMemberDataMapped(projectMemberDataTemp);
    }
  }, [projectMemberData, institutionTypeOptions]);

  // API DELETE Project Member
  const { mutate: deleteMember, isPending: isDeleteMemberLoading, data: deleteMemberData } = useDeleteProjectMember({
    onError: (error) => {
      showNiceModalV2({
        title: 'Terjadi kesalahan, silahkan coba lagi',
        type: 'error',
      });
    },
    onSuccess: (response, variables) => {
      recordActivity({
        activity: ActivityType.DELETE,
        bucketProcessId: response?.data?.content?.bucketProcessId || bucketProcessId || idConvert || '',
        changeAfter: '',
        changeBefore: JSON.stringify(variables),
        menuCode: 'maintenance-proyek',
        module: TypeModule.MAINTENANCE_DATA,
        process: TypeProcess.MAINTENANCE_PROYEK,
        remarks: 'successfully deleted maintenance proyek project member',
      });

      showNiceModalV2({
        onClose: () => {
          queryClient.invalidateQueries({
            queryKey: [
              'project-member-list',
              {
                filter: {
                  institutionTypes: projectMemberFilter?.filter?.institutionTypes?.length > 0
                    ? projectMemberFilter.filter.institutionTypes.map((item) => {
                      return typeof item === 'string' ? item : item?.value || item?.key;
                    })
                    : null,
                  projectCode: idConvert ?? null,
                },
                page: {
                  itemPerPage: projectMemberPageSize,
                  noPage: projectMemberPage,
                },
                searchDetail: projectMemberFilter?.searchDetail ?? {
                  key: '',
                  value: '',
                },
                sortList: projectMemberFilter?.sortList ?? {},
              }
            ],
          });
        },
        title: 'Data berhasil dihapus',
        type: 'success',
      });
    },
  });

  const handleAddProjectMember = () => {
    NiceModal.show(MODAL.ADD_PROJECT_MEMBER_MODAL, {
      id: id,
      listPayload: {
        filter: {
          institutionTypes: projectMemberFilter?.filter?.institutionTypes?.length > 0
            ? projectMemberFilter.filter.institutionTypes.map((item) => {
              return typeof item === 'string' ? item : item?.value || item?.key;
            })
            : null,
          projectCode: idConvert ?? null,
        },
        page: {
          itemPerPage: projectMemberPageSize,
          noPage: projectMemberPage,
        },
        searchDetail: projectMemberFilter?.searchDetail ?? {
          key: '',
          value: '',
        },
        sortList: projectMemberFilter?.sortList ?? {},
      },
    });
  };

  const handleChooseMemberProject = () => {
    NiceModal.show(MODAL.ADD_CHOOSE_MEMBER_PROJECT_MODAL, {
      detailProyek: detailProyek,
      id: id,
      listPayload: {
        filter: {
          institutionTypes: projectMemberFilter?.filter?.institutionTypes?.length > 0
            ? projectMemberFilter.filter.institutionTypes.map((item) => {
              return typeof item === 'string' ? item : item?.value || item?.key;
            })
            : null,
          projectCode: idConvert ?? null,
        },
        page: {
          itemPerPage: projectMemberPageSize,
          noPage: projectMemberPage,
        },
        searchDetail: projectMemberFilter?.searchDetail ?? {
          key: '',
          value: '',
        },
        sortList: projectMemberFilter?.sortList ?? {},
      },
    });
  };

  const handleDeleteProjectMember = (projectMemberId: string) => {
    const payload = {
      debtorId: projectMemberId,
      projectCode: idConvert,
    };
    showNiceModalV2({
      cancelText: 'Tidak',
      onSubmit: () => {
        deleteMember(payload);
      },
      submitText: 'Ya',
      title: `Anda yakin menghapus data ini?
      Fasilitas customer ini juga akan ikut terhapus.`,
      type: 'warning',
    });
  };

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

  // status facility data
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
    ...(!isDisableField && isEditPage ? [{
      key: 'action',
      label: 'Action',
      options: [
        {
          iconName: 'delete',
          isHidden: isDisableField || !isEditPage,
          onClick: (data) => {
            handleDeleteProjectFacility(data.facilityId);
          },
        }
      ],
      sx: {
        minWidth: '10vw',
      },
      type: 'action' as const,
    }] : [])
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

  // Record activity for project facility data
  useEffect(() => {
    if (projectFacilityData) {
      recordActivity({
        activity: ActivityType.VIEW,
        bucketProcessId: bucketProcessId || idConvert || '',
        changeAfter: '',
        changeBefore: '',
        menuCode: 'maintenance-proyek',
        module: TypeModule.MAINTENANCE_DATA,
        process: TypeProcess.MAINTENANCE_PROYEK,
        remarks: 'view maintenance proyek project facility data',
      });
    }
  }, [projectFacilityData,
    projectFacilityPage,
    projectFacilityPageSize,
    projectFacilityFilter,
    idConvert,
    bucketProcessId,
    recordActivity]);

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

  const submitDisable = useMemo(() => {
    if (detailProyek !== undefined) {
      return SubmitPermissionCheck(detailProyek.data.content);
    }
  }, [detailProyek]);

  useEffect(() => {
    if (!sectionsInitialized &&
        projectPhaseData &&
        projectMemberData &&
        projectFacilityData) {

      setSectionStates({
        projectFacility: (projectFacilityData?.data?.contents?.length || 0) > 0,
        projectMember: (projectMemberData?.data?.contents?.length || 0) > 0,
        projectPhase: (projectPhaseData?.data?.contents?.length || 0) > 0,
      });

      setSectionsInitialized(true);
      // console.log('Section states initialized based on initial data');
      // console.log('Project member data length:', projectMemberData?.data?.contents?.length);
      // console.log('Project phase data length:', projectPhaseData?.data?.contents?.length);
      // console.log('Project facility data length:', projectFacilityData?.data?.contents?.length);
    }
  }, [
    projectPhaseData,
    projectMemberData,
    projectFacilityData,
    sectionsInitialized
  ]);

  return {
    bucketProcessId,
    canCreate,
    cityOptionsMapped,
    control,
    currencyOptions,
    detailProyek,
    districtOptionsMapped,
    handleAddProjectMember,
    handleAddProjectPhase,
    handleChooseMemberProject,
    handleDeleteProjectFacility,
    handleSave,
    handleSubmit,
    isAutoSaveFetching,
    isCreatePage,
    isDetailPage,
    isDisableField,
    isDraft,
    isEditPage,
    isLoadingProjectFacility,
    isLoadingProjectMember,
    isLoadingProjectPhase,
    isSaveLoading,
    isValid,
    kategoriProyekOptions,
    klasifikasiProyekOptions,
    postalCodeOptionsMapped,
    projectFacilityData,
    projectFacilityFilter,
    projectFacilityFilterContentList,
    projectFacilityPage,
    projectFacilityPageSize,
    projectFacilitySearchByOptions,
    projectMemberData,
    projectMemberDataMapped,
    projectMemberFilter,
    projectMemberFilterContentList,
    projectMemberPage,
    projectMemberPageSize,
    projectMemberSearchByOptions,
    projectPhaseData,
    projectPhaseFilter,
    projectPhaseFilterContentList,
    projectPhasePage,
    projectPhasePageSize,
    projectPhaseSearchByOptions,
    provinceOptionsMapped,
    router,
    satuanOutputProyekOptions,
    saveSuccess,
    sectionStates,
    sektorYangDibiayaiOptions,
    setProjectFacilityFilter,
    setProjectFacilityPage,
    setProjectFacilityPageSize,
    setProjectMemberFilter,
    setProjectMemberPage,
    setProjectMemberPageSize,
    setProjectPhaseFilter,
    setProjectPhasePage,
    setProjectPhasePageSize,
    setSectionStates,
    setValue,
    submitDisable,
    tableHeaderProjectFacility,
    tableHeaderProjectMember,
    tableHeaderProjectPhase,
    theme,
    title,
    villageOptionsMapped,
    watch,
  };
};

export default UseProjectInformation;
