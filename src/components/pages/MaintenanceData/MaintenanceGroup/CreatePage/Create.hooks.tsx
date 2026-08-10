'use client';


import { useEffect, useMemo, useRef, useState } from 'react';

import NiceModal from '@ebay/nice-modal-react';
import { useTheme } from '@mui/material';
import { useQueryClient } from '@tanstack/react-query';
import { useParams, usePathname, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';

import { roles } from '@/configs/constants/general';
import { MODAL } from '@/configs/constants/modalId';
import { maintenanceGroup } from '@/configs/constants/pathname';
import { ActivityType } from '@/enums/Activity';
import { TypeModule, TypeProcess } from '@/enums/Module';
import { replacePath } from '@/helpers/navigation';
import showNiceModalV2 from '@/helpers/showNiceModalV2';
// import useGetAllGamByName from '@/hooks/services/useGetAllGamByName';
import useGetMaintenanceGroupDataDelta from '@/hooks/services/maintenance-group/useGetMaintenanceGroupDataDelta';
import useGetBucketStepper from '@/hooks/services/useGetBucketStepper';
import useGetParameterList from '@/hooks/services/useGetParameterList';
import useSubmitBucket from '@/hooks/services/useSubmitBucket';
import useApp from '@/hooks/useApp';
import useAutoSaveDraft from '@/hooks/useAutoSaveDraft';
import closeNiceModal from '@/hooks/useCloseNiceModal';
import useCustomRouter from '@/hooks/useCustomRouter';
import useRecordLog from '@/hooks/useRecordLog';
import useSessionStorage from '@/hooks/useSessionStorage';


import { useMaintenanceGroupContext } from '@/components/layouts/MaintenanceGroupLayout/MaintenanceGroup.context';
import TextStyle from '@/components/shared/TextStyle';

import useGetBmpk from '../hooks/useGetBmpk';
import useGetGroupById from '../hooks/useGetGroupById';
import useGetAllMemberById from '../hooks/useGetMemberById';
import useGetSubmissionData from '../hooks/useGetSubmissionList';
import useRemoveGroupMember from '../hooks/useRemoveGroupMember';
import useSaveDebtorGroup from '../hooks/useSaveDebtorGroup';
import useValidateGroupName from '../hooks/useValidateGroupName';

import ModalRecommendedGroup from './components/ModalRecommendedGroup';
import { modal, sortDropdownList, tableHeaderList } from './Create.constants';


import type { SearchValue } from '@/components/shared/Input/components/Search/Search.types';
import type { TableHeader } from '@/components/shared/Table/Table.types';


export const useCreate = () => {
  const { groupId } = useParams<{ groupId: string }>();
  const path = usePathname();
  const router = useCustomRouter();
  const queryClient = useQueryClient();
  const theme = useTheme();
  const filteredPath = path.split('/');
  const isCreate = filteredPath[filteredPath.length - 2] === 'create';
  const isEdit = filteredPath[filteredPath.length - 2] === 'edit';
  const isSubmission = groupId?.includes('MG');
  const {
    handleSetBreadcrumb,
    setStepperStepsWithChanges,
    setHasUnsavedChanges,
  } = useMaintenanceGroupContext();
  const [currentPositionForm, setCurrentPositionForm] = useSessionStorage('maintenance-group-session-page', null);
  const searchParams = useSearchParams();
  // Check if user comes from approval status based on path
  const fromApprovalStatus = searchParams.get('from') === 'approval-status' || groupId?.includes('MG') || groupId?.includes('PIPE') || groupId?.includes('BAR');
  const statusFromUrl = searchParams.get('status');

  const [state] = useApp();
  const isRM = state.currentRole.includes(roles.RM) || state.currentRole.includes(roles.STAFF);
  const isTL = state.currentRole.includes(roles.TL);
  const isKadiv = state.currentRole.includes(roles.KADIV);
  const isSuperAdminMaker = state.currentRole.includes(roles.MAKER);

  const [savedFormData, setSavedFormData] = useState<any>(null);

  const { recordActivity } = useRecordLog();
  const [initialFormData, setInitialFormData] = useState(null);
  const [lastSubmitPayload, setLastSubmitPayload] = useState(null);

  if (currentPositionForm === null) {
    setCurrentPositionForm(isCreate ? 'create' : isEdit ? 'edit' : 'detail');
  }

  useEffect(() => {
    handleSetBreadcrumb([
      {
        label: isCreate ? 'Create New Group' :
          isEdit ? 'Edit Group' :
            'Detail Group',
        url: '',
      },
    ]);
  }, [isCreate, isEdit]);

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);

  const [pageBmpk, setPageBmpk] = useState(1);
  const [pageSizeBmpk, setPageSizeBmpk] = useState(5);
  const [filter, setFilter] = useState<SearchValue>({});
  const [filterBmpk, setFilterBmpk] = useState<SearchValue>({});

  const methods = useForm({
    mode: 'onChange',
  });

  const { setValue, watch, reset, resetField } = methods;

  const watchedName = watch('tableGroup.name');
  const watchedCustomerGroupType = watch('tableGroup.customerGroupType');
  const watchedSector = watch('tableGroup.sector');
  const watchedYearFounded = watch('tableGroup.yearFounded');
  const watchedIsRelatedSmi = watch('tableGroup.isRelatedSmi');

  const isFormValid = useMemo(() => {
    return !!(
      watchedName?.trim() &&
      watchedCustomerGroupType &&
      watchedSector &&
      watchedYearFounded &&
      watchedIsRelatedSmi !== undefined && watchedIsRelatedSmi !== null
    );
  }, [watchedName, watchedCustomerGroupType, watchedSector, watchedYearFounded, watchedIsRelatedSmi]);

  const hasUnsavedChanges = useMemo(() => {
    if (!savedFormData) return false;

    const currentData = {
      customerGroupType: watchedCustomerGroupType,
      isRelatedSmi: watchedIsRelatedSmi,
      name: watchedName,
      sector: watchedSector,
      yearFounded: watchedYearFounded,
    };

    const hasChanges =
      currentData.name !== savedFormData.name ||
      currentData.customerGroupType !== savedFormData.customerGroupType ||
      currentData.sector !== savedFormData.sector ||
      currentData.yearFounded !== savedFormData.yearFounded ||
      currentData.isRelatedSmi !== savedFormData.isRelatedSmi;


    return hasChanges;
  }, [watchedName, watchedCustomerGroupType, watchedSector, watchedYearFounded, watchedIsRelatedSmi, savedFormData]);


  // For debugging button state
  const saveButtonDisabled = useMemo(() => {
    const disabled = !isFormValid || !hasUnsavedChanges;

    return disabled;
  }, [isFormValid, hasUnsavedChanges, methods.formState.errors]);

  const handleButtonClose = () => {
    router.replace(maintenanceGroup.LIST_PAGE);
  };

  // Get Group Detail
  const { data: debtorGroupDetail, isLoading: isLoadingGroupDetail } = useGetGroupById(
    {
      id: groupId,
    },
    {
      enabled: !!groupId,
    }
  );

  const bucketProcessId = debtorGroupDetail?.data?.content?.bucketProcessId;
  const isBucketActive = debtorGroupDetail?.data?.content?.bucketProcessId && true;
  const groupCode = debtorGroupDetail?.data?.content?.groupCode;

  const createdByAdmin = useMemo(() => {
    return (debtorGroupDetail?.data?.content as any)?.createdBy?.includes?.('SA Maker') || false;
  }, [debtorGroupDetail?.data?.content]);

  const isViewOnlyByDivision = useMemo(() => {
    if (!debtorGroupDetail?.data?.content) return false;

    const createdByDivision = (debtorGroupDetail?.data?.content as any)?.createdByDivision;
    const userDivisionCode = (state?.userData as any)?.userDivision?.divisionCode;

    if (createdByDivision !== userDivisionCode) {
      return true;
    }

    return false;
  }, [debtorGroupDetail?.data?.content, state?.userData]);

  const { data: submissionListData } = useGetSubmissionData({
    filter: {
      sectors: [],
      statuses: [],
    } as any,
    page: {
      itemPerPage: 50,
      noPage: 1,
    },
    searchDetail: {
      key: '',
      value: '',
    },
    sortList: {},
  });

  const submissionItem = fromApprovalStatus ? submissionListData?.contents?.find(
    (item) => item.bucketProcessId === bucketProcessId
  ) : null;
  const status = submissionItem?.status || '';


  const stepper = state?.stepper;

  const { data: bucketStepperData } = useGetBucketStepper({
    bucketProcessId: bucketProcessId || '',
    module: 'MG',
    process: 'MG',
  }, {
    enabled: !!bucketProcessId,
  });

  const stepperStatus = bucketStepperData?.from || '';

  const stepperSteps = bucketStepperData?.steps;
  const currentStep = stepperSteps?.find((step) => step.enable === true);
  const stepStatus = currentStep?.key || '';

  let finalStatus = statusFromUrl || stepperStatus || status || '';


  if (fromApprovalStatus && stepperStatus === 'DRAFT' && isBucketActive) {
    queryClient.invalidateQueries({ queryKey: ['bucket-stepper']});
  }

  // Data Delta functionality for TL and Kadiv to see changes
  const isDataDeltaEnabled = useMemo(() => {
    let enabled = false;
    // Only enable if TL/Kadiv, has bucketProcessId and groupCode, and from approval status (MG/PIPE/BAR)
    if ((isTL || isKadiv) && !!bucketProcessId && !!groupCode && fromApprovalStatus) {
      enabled = true;
    }
    return enabled;
  }, [isTL, isKadiv, bucketProcessId, groupCode, fromApprovalStatus]);

  const { data: dataDelta, isSuccess: isDataDeltaSuccess } = useGetMaintenanceGroupDataDelta({
    bucketProcessId: bucketProcessId || '',
    groupCode: groupCode || '',
  }, {
    enabled: isDataDeltaEnabled,
  });

  // Check for changes in field data
  const hasChangesField = useMemo(() => {
    return (dataDelta as any)?.hasChanges === true;
  }, [(dataDelta as any)?.hasChanges]);

  const findDataMaster = (
    inputKey: string,
    dropdownInputList?: { label: string; value: string }[]
  ) => {
    let previousValue = null;
    if (dataDelta && isDataDeltaSuccess) {
      const cleanKey = inputKey.replace('tableGroup.', '');

      const fieldMapping: { [key: string]: keyof typeof dataDelta } = {
        'customerGroupType': 'group',
        'group': 'group',
        'groupName': 'groupName',
        'isRelatedSmi': 'isRelatedSmi',
        'name': 'groupName',
        'sector': 'sector',
        'yearFounded': 'yearFounded',
      };

      const mappedKey = fieldMapping[cleanKey];
      const fieldData = (dataDelta as any)?.changes?.[mappedKey];

      if (fieldData && fieldData.previous !== undefined) {
        const findPrevValues = fieldData.previous;

        if (findPrevValues === null) {
          previousValue = '-';
        } else {
          if (dropdownInputList?.length) {
            if (typeof findPrevValues === 'object' && findPrevValues && 'key' in findPrevValues) {
              const prevKey = (findPrevValues as any).key;
              const currKey = fieldData.current?.key;

              if (prevKey === currKey) {
                return null;
              }

              previousValue = dropdownInputList?.find((item) => item?.value === prevKey)?.label || (findPrevValues as any).label || '-';
            } else {
              const prevValueStr = typeof findPrevValues === 'string' ? findPrevValues : String(findPrevValues);
              previousValue = dropdownInputList?.find((item) => item?.value === prevValueStr)?.label;
            }
          } else {
            if (mappedKey === 'yearFounded') {
              if (typeof findPrevValues === 'string' && findPrevValues.includes('-')) {
                const year = new Date(findPrevValues).getFullYear();
                previousValue = year.toString();
              } else {
                previousValue = findPrevValues;
              }
            } else if (mappedKey === 'isRelatedSmi') {
              previousValue = findPrevValues === true ? 'Ya' : 'Tidak';
            } else {
              if (typeof findPrevValues === 'object' && findPrevValues && 'label' in findPrevValues) {
                previousValue = (findPrevValues as any).label;
              } else {
                previousValue = findPrevValues;
              }
            }
          }
        }
      }
    }
    return previousValue;
  };

  useEffect(() => {
    if (bucketProcessId) {
      queryClient.invalidateQueries({ queryKey: ['bucket-stepper']});
    }
  }, [bucketProcessId, queryClient]);

  useEffect(() => {
    const checkAndShowWarning = () => {
      const isEditableFalse = sessionStorage.getItem('maintenance-group-is-editable-false');
      const storedGroupId = sessionStorage.getItem('maintenance-group-id');

      if (isEditableFalse === 'true' && storedGroupId === groupId && bucketProcessId && bucketProcessId.startsWith('MG-')) {
        NiceModal.show(MODAL.GLOBAL.WARNING, {
          onClose: () => {
            sessionStorage.removeItem('maintenance-group-is-editable-false');
            sessionStorage.removeItem('maintenance-group-id');
          },
          title: 'Sedang terjadi pengkinian data pada maintenance group',
        });
      }
    };

    if (debtorGroupDetail && !isLoadingGroupDetail) {
      checkAndShowWarning();
    }
  }, [debtorGroupDetail, isLoadingGroupDetail, groupId, bucketProcessId]);

  const { data: bmpkList, isLoading: isLoadingBmpk } = useGetBmpk({
    filter: {
      groupId: groupCode,
      ...(filterBmpk?.filter || {}),
      lastResult: filterBmpk?.filter?.lastResult === 'yes' ? true : filterBmpk?.filter?.lastResult === 'no' ? false : null,
    },
    page: {
      itemPerPage: pageSizeBmpk,
      noPage: pageBmpk,
    },
    searchDetail: filterBmpk?.searchDetail?.key ? {
      key: filterBmpk.searchDetail.key,
      value: filterBmpk.searchDetail.value || '',
    } : {},
    sortList: filterBmpk?.sortList?.columnName ? {
      columnName: filterBmpk.sortList.columnName,
      sortType: filterBmpk.sortList.sortType || 'ASC',
    } : {},
  });

  const isSeenDeleted = useMemo(() => {
    if (isRM || isSuperAdminMaker) {
      return false;
    }

    if ((isTL && finalStatus?.toUpperCase?.() === 'WAITING_APPROVAL_TL') ||
      (isKadiv && finalStatus?.toUpperCase?.() === 'WAITING_APPROVAL_KADIV')) {
      return true;
    }

    return false;
  }, [isRM, isSuperAdminMaker, isTL, isKadiv, finalStatus]);

  const { data: debtorGroupMember, isLoading: isLoadingGroupMember } = useGetAllMemberById(
    {
      filter: {
        id: isSubmission ? bucketProcessId : groupCode,
        isSeenDeleted: isSeenDeleted,
        ...(filter?.filter?.institutionTypesKey ? { institutionTypesKey: filter.filter.institutionTypesKey } : {}),
      } as any,
      page: {
        itemPerPage: pageSize,
        noPage: page,
      },
      searchDetail: filter?.searchDetail ?? {},
      sortList: filter?.sortList ?? {},
    }, isSubmission, isEdit, { enabled: !!groupCode }
  );

  // Check for changes in group member data
  const hasChangesGroupmember = useMemo(() => {
    return ((debtorGroupMember as any)?.data?.additionalData?.hasChanges === true) ||
      ((debtorGroupMember as any)?.additionalData?.hasChanges === true);
  }, [(debtorGroupMember as any)?.data?.additionalData?.hasChanges,
    (debtorGroupMember as any)?.additionalData?.hasChanges]);

  // Add hasChanges property to stepper steps for red dot indicator
  const stepperStepsWithChanges = useMemo(() => {
    if (!stepperSteps) return [];

    return stepperSteps.map((step) => {
      let hasChanges = false;

      // Check if current step has changes based on step key
      if (step.key === 'group') {
        // For group step, check both field changes and group member changes
        hasChanges = hasChangesField || hasChangesGroupmember;
      }
      // Validation step doesn't need change checking

      return {
        ...step,
        hasChanges,
      };
    });
  }, [stepperSteps, hasChangesField, hasChangesGroupmember]);

  // Save stepperStepsWithChanges to context
  useEffect(() => {
    setStepperStepsWithChanges(stepperStepsWithChanges);
  }, [stepperStepsWithChanges]);

  // Save hasUnsavedChanges to context
  useEffect(() => {
    setHasUnsavedChanges(hasUnsavedChanges);
  }, [hasUnsavedChanges, setHasUnsavedChanges]);


  // Validate Group Name
  const { mutate: validateGroup } = useValidateGroupName({
    onError(error) {
    },
    onSuccess(data) {
    },
  });

  const { mutate: removeGroupMember, isPending: isRemoveGroupMemberLoading } = useRemoveGroupMember({
    onError: (e) => {
      showNiceModalV2({
        title: e.response?.data?.errorDetail ?? 'Terjadi kesalahan, silahkan coba lagi',
        type: 'error',
      });
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ['list-group-member-by-id', {
          filter: {
            id: groupCode,
          },
          page: {
            itemPerPage: pageSize,
            noPage: page,
          },
        }],
      });
      showNiceModalV2({
        title: 'Data berhasil di hapus',
        type: 'success',
      });
    },
  });

  useEffect(() => {
    if (debtorGroupDetail && !isCreate) {
      recordActivity({
        activity: ActivityType.VIEW,
        bucketProcessId: bucketProcessId || groupCode || '',
        changeAfter: '',
        changeBefore: '',
        menuCode: 'maintenance-group',
        module: TypeModule.MAINTENANCE_GROUP,
        process: TypeProcess.MAINTENANCE_GROUP,
        remarks: 'view maintenance group detail data',
      });
    }
  }, [debtorGroupDetail, bucketProcessId, groupCode, isCreate, recordActivity]);

  useEffect(() => {
    if (debtorGroupMember && !isCreate && !isLoadingGroupMember) {
      const memberCount = (debtorGroupMember as any)?.data?.contents?.length ||
        (debtorGroupMember as any)?.contents?.length || 0;

      recordActivity({
        activity: ActivityType.VIEW,
        bucketProcessId: bucketProcessId || groupCode || '',
        changeAfter: '',
        changeBefore: '',
        menuCode: 'maintenance-group',
        module: TypeModule.MAINTENANCE_GROUP,
        process: TypeProcess.MAINTENANCE_GROUP,
        remarks: `viewed maintenance group member list with ${memberCount} member(s)`,
      });
    }
  }, [debtorGroupMember, bucketProcessId, groupCode, isCreate, isLoadingGroupMember, recordActivity]);

  const { mutate: saveGrup, isPending: isSaveNewGrupLoading, data: submissionData } = useSaveDebtorGroup({
    onError: (error: any) => {
      const errorCode = error?.response?.data?.errorCode;
      const errorDetail = error?.response?.data?.errorDetail;

      if (errorCode === '0304' && errorDetail?.includes('has already taken')) {
        showNiceModalV2({
          onClose: () => { },
          title: 'Terdapat nama group yang sama, silahkan buat dengan nama lain.',
          type: 'error',
        });
      } else {
        showNiceModalV2({
          title: errorDetail || 'Terjadi kesalahan, silahkan coba lagi',
          type: 'error',
        });
      }
    },
    onSuccess: (data) => {
      const currentFormData = {
        customerGroupType: watchedCustomerGroupType,
        isRelatedSmi: watchedIsRelatedSmi,
        name: watchedName,
        sector: watchedSector,
        yearFounded: watchedYearFounded,
      };

      recordActivity({
        activity: isCreate ? ActivityType.CREATE : ActivityType.SAVE,
        bucketProcessId: data?.data?.content?.bucketProcessId || bucketProcessId || groupCode || '',
        changeAfter: JSON.stringify(currentFormData),
        changeBefore: initialFormData ? JSON.stringify(initialFormData) : '',
        menuCode: 'maintenance-group',
        module: TypeModule.MAINTENANCE_GROUP,
        process: TypeProcess.MAINTENANCE_GROUP,
        remarks: isCreate
          ? 'successfully created new maintenance group'
          : 'successfully saved maintenance group',
      });

      setSavedFormData(currentFormData);
      setInitialFormData(JSON.parse(JSON.stringify(currentFormData)));

      queryClient.invalidateQueries({ queryKey: ['get-group-detail-by-id', { id: groupId }]});
      showNiceModalV2({
        onClose: () => {
          if (isCreate) {
            router.push(replacePath(
              maintenanceGroup.EDIT_PAGE, {
                groupId: data?.data?.content?.bucketProcessId,
              }
            ) + '?from=create');
          } else if (!isSubmission) {
            router.push(replacePath(
              maintenanceGroup.DETAIL_PAGE, {
                groupId: data?.data?.content?.bucketProcessId,
              }
            ));
          }
          return;
        },
        title: 'Data berhasil disimpan',
        type: 'success',
      });
    },
  });

  const { mutate: submitBucket } = useSubmitBucket(
    {
      onError: () => {
        showNiceModalV2({ title: 'Terjadi kesalahan, silahkan dicoba lagi', type: 'error' });
      },
      onSuccess: (data, variables) => {
        // Determine activity type based on action
        let activityType = ActivityType.SUBMIT;
        const action = variables?.submitRequestDto?.action;

        if (action === 'APPROVE' || action === 'SUBMIT') {
          activityType = ActivityType.SUBMIT;
        } else if (action === 'REJECTED') {
          activityType = ActivityType.REJECT;
        } else if (action === 'CANCELED') {
          activityType = ActivityType.CANCEL;
        } else if (action === 'RETURN_TO_STAFF') {
          activityType = ActivityType.RETURN_TO_STAFF;
        }

        // Record successful submission
        recordActivity({
          activity: activityType,
          bucketProcessId: variables?.submitRequestDto?.bucketProcessId || groupId || '',
          changeAfter: '',
          changeBefore: JSON.stringify(variables),
          menuCode: 'maintenance-group',
          module: TypeModule.MAINTENANCE_GROUP,
          process: TypeProcess.MAINTENANCE_GROUP,
          remarks: `successfully submitted maintenance group bucket with action: ${action || 'unknown'}`,
        });

        queryClient.invalidateQueries({
          queryKey: ['bucket-stepper', { bucketProcessId: groupId }],
        });

        queryClient.invalidateQueries({
          queryKey: ['maintenance-group-list'],
        });

        showNiceModalV2({
          onClose: () => handleButtonClose(),
          title: 'Data berhasil disimpan',
          type: 'success',
        });
      },
    }
  );

  // Determine parameter module based on source navigation
  const searchByModule = (fromApprovalStatus && finalStatus?.toUpperCase?.() === 'DRAFT') ? 'searchByGroupMemberTransaction' : 'searchByGroupMember';
  const sortByModule = (fromApprovalStatus && finalStatus?.toUpperCase?.() === 'DRAFT') ? 'sortByGroupMemberTransaction' : 'sortByGroupMember';

  const { data: searchByOptions } = useGetParameterList(searchByModule, { label: 'value1', value: 'value2' });
  const { data: sortByOptions } = useGetParameterList(sortByModule, { label: 'value1', value: 'value2' });
  const { data: searchByOptionsBmpk } = useGetParameterList('searchByMaintenanceGroupBmpp');
  const { data: institutionDropdownList } = useGetParameterList('institutionType');
  const { data: sortDropdownListBmpk = []} = useGetParameterList('sortByMaintenanceGroupBmpp');

  // const {
  //   data: gamListdata,
  // } = useGetAllGamByName(
  //   { value: '' },
  //   { division: 'divisionShort', label: 'fullName', value: 'userId' });

  // const gamList = gamListdata?.map((gam) => ({
  //   label: `${gam?.division ? gam?.division : ''} - ${gam?.label}`,
  //   value: gam?.value,
  // }));

  const filterDropdownList = searchByOptions;
  const filterDropdownListBmpk = searchByOptionsBmpk;

  const sortDropdownMelampauiBmpk = [
    { label: 'Ya', value: 'yes' },
    { label: 'Tidak', value: 'no' }
  ];

  const filterContentList = [
    {
      key: 'sortList',
      label: 'Urutkan Berdasarkan',
      options: sortByOptions,
      type: 'sort',
    },
    {
      key: 'institutionTypesKey',
      label: 'Institution Type',
      options: institutionDropdownList,
      type: 'multiple-autocomplete',
    }
  ];

  const filterContentListBmpk = [
    {
      key: 'sortList',
      label: 'Urutkan Berdasarkan',
      options: sortDropdownListBmpk,
      type: 'sort',
    },
    {
      endKey: 'endDate',
      label: 'Data as of',
      startKey: 'startDate',
      type: 'period',
    },
    {
      key: 'lastResult',
      label: 'Melampaui BMPK/BMPD/BMPP Group',
      options: sortDropdownMelampauiBmpk,
      type: 'dropdown',
    },
  ];

  const dataAsOfDateBmpp = useMemo(() => {
    const lastUpdate = bmpkList?.data?.additionalData?.lastUpdate;
    if (!lastUpdate) return '-';

    const date = new Date(lastUpdate);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const seconds = date.getSeconds().toString().padStart(2, '0');

    const monthNames = [
      'Januari',
      'Februari',
      'Maret',
      'April',
      'Mei',
      'Juni',
      'Juli',
      'Agustus',
      'September',
      'Oktober',
      'November',
      'Desember'
    ];

    return `${day} ${monthNames[date.getMonth()]} ${year} ${hours}:${minutes}:${seconds}`;
  }, [bmpkList]);

  const dataAsOfDateMemberGroup = useMemo(() => {
    const lastUpdate = (debtorGroupMember as any)?.additionalData?.lastUpdate ||
      (debtorGroupMember as any)?.data?.additionalData?.lastUpdate;


    if (!lastUpdate) return '-';

    const date = new Date(lastUpdate);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const seconds = date.getSeconds().toString().padStart(2, '0');

    const monthNames = [
      'Januari',
      'Februari',
      'Maret',
      'April',
      'Mei',
      'Juni',
      'Juli',
      'Agustus',
      'September',
      'Oktober',
      'November',
      'Desember'
    ];

    return `${day} ${monthNames[date.getMonth()]} ${year} ${hours}:${minutes}:${seconds}`;
  }, [debtorGroupMember]);

  useEffect(() => {
    if (debtorGroupDetail && !savedFormData) {
      const formData = {
        customerGroupType: debtorGroupDetail?.data?.content?.group?.key,
        isRelatedSmi: debtorGroupDetail?.data?.content?.isRelatedSmi,
        name: debtorGroupDetail?.data?.content?.groupName,
        sector: debtorGroupDetail?.data?.content?.sector?.key,
        yearFounded: debtorGroupDetail?.data?.content?.yearFounded,
      };

      setValue('tableGroup.id', groupCode);
      setValue('tableGroup.name', formData.name);
      setValue('tableGroup.sector', formData.sector);
      setValue('tableGroup.yearFounded', formData.yearFounded);
      setValue('tableGroup.isRelatedSmi', formData.isRelatedSmi);
      setValue('tableGroup.customerGroupType', formData.customerGroupType);
      setValue('tableGroup.modifiedBy', debtorGroupDetail?.data?.content?.modifiedBy);
      setValue('tableGroup.lastModified', debtorGroupDetail?.data?.content?.lastModified !== null ?
        (() => {
          const date = new Date(debtorGroupDetail?.data?.content?.lastModified);
          const day = date.getDate().toString().padStart(2, '0');
          const month = (date.getMonth() + 1).toString().padStart(2, '0');
          const year = date.getFullYear();
          const hours = date.getHours().toString().padStart(2, '0');
          const minutes = date.getMinutes().toString().padStart(2, '0');
          const seconds = date.getSeconds().toString().padStart(2, '0');

          const monthNames = [
            'Januari',
            'Februari',
            'Maret',
            'April',
            'Mei',
            'Juni',
            'Juli',
            'Agustus',
            'September',
            'Oktober',
            'November',
            'Desember'
          ];

          return `${day} ${monthNames[date.getMonth()]} ${year}, ${hours}:${minutes}:${seconds}`;
        })() : '-'
      );

      setSavedFormData(formData);
      setInitialFormData(JSON.parse(JSON.stringify(formData)));
    } else if (isCreate && !savedFormData) {
      setValue('tableGroup.id', '');
      setValue('tableGroup.name', '');
      setValue('tableGroup.sector', '');
      setValue('tableGroup.yearFounded', '');
      setValue('tableGroup.isRelatedSmi', undefined);
      setValue('tableGroup.customerGroupType', '');
      setValue('tableGroup.modifiedBy', '');
      setValue('tableGroup.lastModified', '');
      setSavedFormData(null);
      setInitialFormData(null);
    }
  }, [debtorGroupDetail, setValue, groupCode, isCreate, savedFormData]);


  useEffect(() => {
    if (isEdit) {
      setCurrentPositionForm('edit');
    } else if (isCreate) {
      setCurrentPositionForm('create');
    } else {
      setCurrentPositionForm('detail');
    }
  }, [isEdit, isCreate]);

  useEffect(() => {
    setPageBmpk(1);
  }, [filterBmpk]);

  useEffect(() => {
    setPage(1);
  }, [filter]);

  useEffect(() => {
    if (isEdit) {
      setCurrentPositionForm('edit');
    } else if (isCreate) {
      setCurrentPositionForm('create');
    } else {
      setCurrentPositionForm('detail');
    }
  }, [isEdit, isCreate]);

  const handleDeleteGroup = () => {
    showNiceModalV2({
      cancelText: 'Tidak',
      onSubmit: () => { },
      submitText: 'Ya',
      title: 'Apakah anda yakin ingin menghapus data?',
      type: 'warning',
    });
  };

  const handleDeleteDataGM = (props) => {
    showNiceModalV2({
      cancelText: 'Tidak',
      onSubmit: () => {
        const memberToDelete = {
          debtorId: props.id,
          debtorName: props.name || 'Unknown',
        };

        removeGroupMember({
          id: props.id,
        }, {
          onSuccess: () => {
            // Record the deletion activity
            recordActivity({
              activity: ActivityType.DELETE,
              bucketProcessId: bucketProcessId || groupCode || '',
              changeAfter: '',
              changeBefore: JSON.stringify(memberToDelete),
              menuCode: 'maintenance-group',
              module: TypeModule.MAINTENANCE_GROUP,
              process: TypeProcess.MAINTENANCE_GROUP,
              remarks: `successfully deleted member ${memberToDelete.debtorName} 
              (ID: ${memberToDelete.debtorId}) from maintenance group`,
            });
          },
        });
      },
      submitText: 'Ya',
      title: `Apakah anda yakin menghapus ${props.name !== '-' ? props.name : 'debtor tersebut'} sebagai Group Member?`,
      type: 'warning',
    });
  };

  const handleSaveNewGrup = () => {
    const groupName = watch('tableGroup.name');


    validateGroup({ groupCode: groupCode, name: groupName }, {
      onError(error) {
        showNiceModalV2({
          title: 'Terjadi kesalahan saat validasi nama group, silakan coba lagi',
          type: 'error',
        });
      },
      onSuccess(resp) {

        // Check if there are similar groups
        const similarGroups = resp?.content?.similarGroupList || [];

        if (similarGroups.length < 1) {
          // No similar groups, proceed with save
          showNiceModalV2({
            cancelText: 'Tidak',
            onSubmit: () => {
              saveGrup({
                bucketProcessId: bucketProcessId,
                groupType: watch('tableGroup.customerGroupType'),
                id: groupCode,
                isRelatedSmi: watch('tableGroup.isRelatedSmi') === true || watch('tableGroup.isRelatedSmi') === 'true' || watch('tableGroup.isRelatedSmi') === 'Ya' || watch('tableGroup.isRelatedSmi') === 'yes',
                name: watch('tableGroup.name'),
                sector: watch('tableGroup.sector'),
                yearFounded: watch('tableGroup.yearFounded'),
              });
            },
            submitText: 'Ya',
            title: 'Pastikan Data Sudah Sesuai',
            type: 'warning',
          });
        } else {
          // Check if there's an exact match (same name)
          const hasExactMatch = similarGroups.some((group) =>
            group.name?.toLowerCase() === groupName?.toLowerCase()
          );

          if (hasExactMatch) {
            // Exact match found, show error popup
            showNiceModalV2({
              title: `Nama Group "${groupName}" sudah terdaftar dalam database
              atau sedang dalam pengajuan pembuatan Group di tempat lain.`,
              type: 'error',
            });
          } else {
            // Only similar names (not exact), show global warning
            showNiceModalV2({
              cancelText: 'Batal',
              onSubmit: () => {
                // After user clicks "Lanjutkan", show recommended group modal
                NiceModal.show(modal.RECOMMENDED_GROUP, {
                  ...resp.content,
                  groupName,
                  onCreateNew: () => {
                    showNiceModalV2({
                      cancelText: 'Tidak',
                      onSubmit: () => {
                        saveGrup({
                          bucketProcessId: bucketProcessId,
                          groupType: watch('tableGroup.customerGroupType'),
                          id: groupCode,
                          isRelatedSmi: watch('tableGroup.isRelatedSmi') === true || watch('tableGroup.isRelatedSmi') === 'true' || watch('tableGroup.isRelatedSmi') === 'Ya' || watch('tableGroup.isRelatedSmi') === 'yes',
                          name: watch('tableGroup.name'),
                          sector: watch('tableGroup.sector'),
                          yearFounded: watch('tableGroup.yearFounded'),
                        });
                      },
                      submitText: 'Ya',
                      title: 'Pastikan Data Sudah Sesuai',
                      type: 'warning',
                    });
                  },
                  payload: {
                    bucketProcessId: bucketProcessId,
                    groupType: watch('tableGroup.customerGroupType'),
                    id: groupCode,
                    isRelatedSmi: watch('tableGroup.isRelatedSmi') === true || watch('tableGroup.isRelatedSmi') === 'true' || watch('tableGroup.isRelatedSmi') === 'Ya' || watch('tableGroup.isRelatedSmi') === 'yes',
                    name: watch('tableGroup.name'),
                    sector: watch('tableGroup.sector'),
                    yearFounded: watch('tableGroup.yearFounded'),
                  },
                });
              },
              submitText: 'Lanjutkan',
              title: 'Terdapat nama Group yang serupa',
              type: 'warning',
            });
          }
        }
      },
    });
  };

  const tableHeader: TableHeader[] = [
    ...tableHeaderList,
    {
      key: 'action',
      label: 'Action',
      options: [
        {
          iconName: 'detail',
          onClick: (data) => {
            const shouldBeEditMode = isEdit || isCreate || (fromApprovalStatus && finalStatus?.toUpperCase?.() === 'DRAFT');
            setCurrentPositionForm(shouldBeEditMode ? 'edit' : 'detail');

            // const queryParam = isCreate ? '?from=create' : (fromApprovalStatus ||
            // finalStatus?.toUpperCase?.() === 'DRAFT') ? '?from=approval-status' : '';
            const fromParam = searchParams.get('from');
            const baseQueryParam = isCreate
              ? '?from=create'
              : fromParam === 'approval-status'
                ? '?from=approval-status'
                : fromParam === 'list'
                  ? '?from=list'
                  : '';
            const viewOnlyParam = (isViewOnlyByDivision && !isSuperAdminMaker) ? (baseQueryParam ? '&viewOnly=true' : '?viewOnly=true') : '';
            const queryParam = baseQueryParam + viewOnlyParam;

            if (hasUnsavedChanges) {
              showNiceModalV2({
                cancelText: 'Tidak',
                onSubmit: () => {
                  router.push(replacePath(
                    maintenanceGroup.DETAIL_MEMBER_PAGE, {
                      groupId: groupId,
                      memberId: data.debtorId ?? '-',
                    }
                  ) + queryParam);
                },
                submitText: 'Ya',
                title: 'Apakah Anda yakin tidak save? Perubahan yang Anda buat tidak akan disimpan.',
                type: 'warning',
              });
            } else {
              router.push(replacePath(
                maintenanceGroup.DETAIL_MEMBER_PAGE, {
                  groupId: groupId,
                  memberId: data.debtorId ?? '-',
                }
              ) + queryParam);
            }
          },
        },
        {
          iconName: 'delete',
          isDisabled: (() => {
            const baseConditions = isRemoveGroupMemberLoading ||
              (!isSubmission) ||
              (!isRM && !isSuperAdminMaker);
            const statusConditions = finalStatus?.toUpperCase?.() === 'WAITING_APPROVAL_TL' ||
              finalStatus?.toUpperCase?.() === 'WAITING_APPROVAL_KADIV' || finalStatus?.toUpperCase?.() === 'PIPELINE_CREATION';
            const viewOnlyCondition = (isViewOnlyByDivision && !isSuperAdminMaker);
            return baseConditions || statusConditions || viewOnlyCondition;
          })(),
          onClick: (props) => {
            handleDeleteDataGM(props);
          },
        }
      ],
      type: 'action',
    }
  ];

  const tableHeaderBMPK: TableHeader[] = [
    {
      key: 'index',
      label: 'No',
      sx: {
        minWidth: '4vw',
      },
      type: 'index',
    },
    {
      key: 'description',
      label: 'Melampaui BMPK/BMPD/BMPP Group',
      render(row) {
        const description = row?.description;
        return (
          <TextStyle variant="body4">
            {!description || description.trim() === '' ? '-' : description}
          </TextStyle>
        );
      },
      sx: {
        minWidth: '10vw',
      },
    },
    {
      key: 'percentage',
      label: 'Persentase',
      render(row) {
        return (
          <TextStyle variant="body4">
            {`${Number(row?.percentage).toFixed(0)}% of ${Number(row?.percentageThreshold).toFixed(0)}%`}
          </TextStyle>
        );
      },
      sx: {
        minWidth: '10vw',
      },
    },
    {
      key: 'lastModified',
      label: 'Data as of',
      render(row) {
        const lastModified = row?.lastModified;
        if (!lastModified) return '-';

        const date = new Date(lastModified);
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const year = date.getFullYear();
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');
        const seconds = date.getSeconds().toString().padStart(2, '0');

        const monthNames = [
          'Januari',
          'Februari',
          'Maret',
          'April',
          'Mei',
          'Juni',
          'Juli',
          'Agustus',
          'September',
          'Oktober',
          'November',
          'Desember'
        ];

        return (
          <TextStyle variant="body4">
            {`${day} ${monthNames[date.getMonth()]} ${year} ${hours}:${minutes}:${seconds}`}
          </TextStyle>
        );
      },
      sx: {
        minWidth: '10vw',
      },
    },
    {
      key: 'action',
      label: 'Action',
      options: [
        {
          iconName: 'detail',
          onClick: (data) => {
            const viewOnlyParam = (isViewOnlyByDivision && !isSuperAdminMaker) ? '?viewOnly=true' : '';
            if (hasUnsavedChanges) {
              showNiceModalV2({
                cancelText: 'Tidak',
                onSubmit: () => {
                  router.push(replacePath(maintenanceGroup.BMPP_CALCULATION_PAGE, {
                    calculationId: data?.calculationId,
                    groupId: groupId,
                  }) + viewOnlyParam);
                },
                submitText: 'Ya',
                title: 'Apakah Anda yakin tidak save? Perubahan yang Anda buat tidak akan disimpan.',
                type: 'warning',
              });
            } else {
              router.push(replacePath(maintenanceGroup.BMPP_CALCULATION_PAGE, {
                calculationId: data?.calculationId,
                groupId: groupId,
              }) + viewOnlyParam);
            }
          },
        },
      ],
      type: 'action',
    }
  ];

  const handleAddNewMember = () => {
    router.push(replacePath(
      maintenanceGroup.ADD_MEMBER_PAGE, {
        groupId: groupId,
      }
    ));
  };

  const popupGroupMemberHandler = () => {
    NiceModal.show(
      modal.FORM_MEMBER_GROUP);
  };

  // Determine if submit button should be enabled
  const canSubmit = useMemo(() => {
    if (isCreate) {
      return isFormValid;
    } else {
      return isFormValid && !hasUnsavedChanges;
    }
  }, [isCreate, isFormValid, hasUnsavedChanges]);

  const handleSubmit = (action: string) => {
    if (action === 'CANCELED') {
      if (isRM || isSuperAdminMaker) {
        NiceModal.show(MODAL.GLOBAL.COMMENT, {
          onSave: ({ comment }) => {
            closeNiceModal(MODAL.GLOBAL.COMMENT);

            const payload = {
              submitRequestDto: {
                action: 'CANCELED',
                bucketProcessId: groupId,
                comment,
                module: 'MG',
                process: 'MG',
              },
            };

            // Store payload for error tracking
            setLastSubmitPayload(payload);
            submitBucket(payload);
          },
        });
      } else {
        NiceModal.show(MODAL.GLOBAL.COMMENT, {
          onSave: ({ comment, radioValue }) => {
            const bucketAction = radioValue === 1 || radioValue === '1' ? 'CANCELED' : 'REJECTED';
            closeNiceModal(MODAL.GLOBAL.COMMENT);

            const payload = {
              submitRequestDto: {
                action: bucketAction,
                bucketProcessId: groupId,
                comment,
                module: 'MG',
                process: 'MG',
              },
            };

            // Store payload for error tracking
            setLastSubmitPayload(payload);
            submitBucket(payload);
          },
          radioLabel: 'Declined',
          radioOptions: [
            { label: 'Canceled', value: '1' },
            { label: 'Rejected', value: '2' }
          ],
        });
      }
    } else {
      NiceModal.show(MODAL.GLOBAL.COMMENT, {
        onSave: ({ comment }) => {
          const payload = {
            submitRequestDto: {
              action,
              bucketProcessId: groupId,
              comment,
              module: 'MG',
              process: 'MG',
            },
          };

          // Store payload for error tracking
          setLastSubmitPayload(payload);
          submitBucket(payload);
          closeNiceModal(MODAL.GLOBAL.COMMENT);
        },
      });
    }
  };

  const isWaitingApprovalTL = finalStatus?.toUpperCase?.() === 'WAITING_APPROVAL_TL';
  const isWaitingApprovalKadiv = finalStatus?.toUpperCase?.() === 'WAITING_APPROVAL_KADIV';

  // Function to determine row styling based on member changes
  const getMemberRowStyle = (row: any) => {
    // Only apply styling when TL/Kadiv is viewing and there are changes
    const shouldShowChanges = ((isTL && isWaitingApprovalTL) || (isKadiv && isWaitingApprovalKadiv)) && row;

    if (!shouldShowChanges) {
      return { bgcolor: 'none' };
    }

    // Check for member change indicators
    if (row.isNew === true) {
      return { bgcolor: '#e8f5e8' }; // Light green for new members
    }

    if (row.isEdited === true) {
      return { bgcolor: '#fff3cd' }; // Light yellow for edited members
    }

    if (row.isDeleted === true) {
      return { bgcolor: '#f8d7da' }; // Light red for deleted members
    }

    return { bgcolor: 'none' };
  };

  // Auto-save payload
  const autoSavePayload = useMemo(() => () => {
    const payload = {
      bucketProcessId: bucketProcessId,
      groupType: watchedCustomerGroupType,
      id: groupCode,
      isRelatedSmi: watchedIsRelatedSmi === true || watchedIsRelatedSmi === 'true' || watchedIsRelatedSmi === 'Ya' || watchedIsRelatedSmi === 'yes',
      name: watchedName,
      sector: watchedSector,
      yearFounded: watchedYearFounded,
    };

    return Promise.resolve(payload);
  }, [bucketProcessId,
    groupCode,
    watchedCustomerGroupType,
    watchedIsRelatedSmi,
    watchedName,
    watchedSector,
    watchedYearFounded]);

  // Auto-save hook
  const { isFetching: isAutoSaveFetching } = useAutoSaveDraft({
    isActive: !isCreate && !isViewOnlyByDivision,
    payload: autoSavePayload,
    url: 'master.submission.saveGroup',
  });

  return {
    bmpkList,
    canSubmit,
    createdByAdmin,
    dataAsOfDateBmpp,
    dataAsOfDateMemberGroup,
    debtorGroupDetail,
    debtorGroupMember,
    filter,
    filterBmpk,
    filterContentList,
    filterContentListBmpk,
    filterDropdownList,
    filterDropdownListBmpk,
    findDataMaster,
    getMemberRowStyle,
    groupCode,
    handleAddNewMember,
    handleButtonClose,
    handleDeleteGroup,
    handleSaveNewGrup,
    handleSubmit,
    hasChangesField,
    hasChangesGroupmember,
    hasUnsavedChanges,
    isAutoSaveFetching,
    isBucketActive,
    isCreate,
    isEdit,
    isLoadingBmpk,
    isLoadingGroupMember,
    isSubmission,
    isViewOnlyByDivision,
    methods,
    page,
    pageBmpk,
    popupGroupMemberHandler,
    saveButtonDisabled,
    setFilter,
    setFilterBmpk,
    setPage,
    setPageBmpk,
    setPageSize,
    setPageSizeBmpk,
    status: finalStatus,
    stepperStepsWithChanges,
    tableHeader,
    tableHeaderBMPK,
    theme,
  };
};
