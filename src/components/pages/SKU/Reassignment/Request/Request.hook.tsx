import {
  useContext,
  useEffect,
  useState,
  useMemo,
  useCallback,
} from 'react';

import NiceModal from '@ebay/nice-modal-react';
import { useQueryClient } from '@tanstack/react-query';
import dayjs from 'dayjs';
import { useParams, usePathname } from 'next/navigation';
import { useForm } from 'react-hook-form';

import { MODAL } from '@/configs/constants/modalId';
import { RE_ASSIGNMENT_SKU } from '@/configs/constants/pathname';
import { DirtyContext } from '@/contexts/DirtyContext';
import { ActivityType } from '@/enums/Activity';
import { TypeModule, TypeProcess } from '@/enums/Module';
import { formatDate } from '@/helpers/date';
import showNiceModalV2 from '@/helpers/showNiceModalV2';
import useGetParameterList from '@/hooks/services/useGetParameterList';
import useSubmitBucket from '@/hooks/services/useSubmitBucket';
import useApp from '@/hooks/useApp';
import closeNiceModal from '@/hooks/useCloseNiceModal';
import useCustomRouter from '@/hooks/useCustomRouter';
import useRecordLog from '@/hooks/useRecordLog';

import { useReassignmentSkuContext } from '@/components/layouts/ReassigmentSkuLayout/Reassignment.context';
import useGetMasterDirectorate from '@/components/pages/UserManagement/UserList/hooks/useGetMasterDirectorate';
import useGetMasterDivision from '@/components/pages/UserManagement/UserList/hooks/useGetMasterDivision';
import useGetUserSearch from '@/components/pages/UserManagement/UserList/hooks/useGetUserSearch';
import Button from '@/components/shared/Button';

import useGetDetailReassignment from '../hooks/useGetDetailReassignment.';
import { useSkuAccess } from '../hooks/useSkuAcess';

import useSaveRequest from './hooks/useSaveRequest';
import { modal } from './Request.constants';


export const useRequest = () => {
  const { processId }: { processId: string } = useParams();
  const { setDirtyMsg } = useContext(DirtyContext);
  const path = usePathname();

  const contextValue = useReassignmentSkuContext();
  const actionButtons = contextValue?.actionButtons || {};
  const isStepEnabled = !contextValue?.isStepEnabled || false;
  const [{ currentRole, userData }] = useApp();
  const queryClient = useQueryClient();
  const router = useCustomRouter();
  const { recordActivity } = useRecordLog();
  const [isPermanent, setIsPermanent] = useState(false);
  const [isFormValid, setIsFormValid] = useState(false);
  const today = formatDate(new Date(), 'DD MMMM YYYY');
  const isDetail = path?.includes('/detail') || contextValue?.isDetail;
  const isMaker = currentRole.includes('MAKER') || currentRole.includes('CHECKER');
  const [isKadivPosition, setIsKadivPosition] = useState(false);
  const [isSaveForSubmit, setIsSaveForSubmit] = useState(false);
  const [shouldSyncReassignTo, setShouldSyncReassignTo] = useState(false);
  const [isReassignToDisabled, setIsReassignToDisabled] = useState(false);
  const [isSelectedPersonDisabled, setIsSelectedPersonDisabled] = useState(false);
  const userDirectorate = userData?.userDivision?.directorate?.name || null;
  const userDivision = userData?.userDivision?.name || null;

  const [filteredUserList, setFilteredUserList] = useState({
    reassignTo: [],
    selectedPerson: [],
  });

  const {
    canView: canViewSku,
    canCreate: canCreateSku,
    canUpdate: canUpdateSku,
    canDelete: canDeleteSku,
  } = useSkuAccess();

  const checkStaffOrTlJobPosition = (jobPosition: string): boolean => {
    if (!jobPosition) return false;
    const normalizedPosition = jobPosition.toLowerCase();
    const staffOrTlKeywords = ['staff', 'tl', 'team leader'];
    return staffOrTlKeywords.some((keyword) => normalizedPosition.includes(keyword));
  };

  const checkIsKadivPosition = (jobPosition: string): boolean => {
    if (!jobPosition) return false;
    const position = jobPosition.toLowerCase().trim();
    const kadivKeywords = ['kadiv', 'kepala divisi'];
    return kadivKeywords.some((keyword) =>
      position === keyword || position.includes(keyword)
    );
  };

  const determineShouldSyncReassignTo = (jobPosition: string) => {
    return checkStaffOrTlJobPosition(jobPosition);
  };

  const checkJobPositionForDisable = (jobPosition: string) => {
    return checkStaffOrTlJobPosition(jobPosition);
  };

  const getReassignToDisabledState = () => {
    return isReassignToDisabled;
  };

  const getSelectedPersonDisabledState = () => {
    return isSelectedPersonDisabled;
  };

  const [searchDetailValue, setSearchDetailValue] = useState({
    reassignTo: {
      directorate: '',
      division: '',
      user: '',
    },
    selectedPerson: {
      directorate: '',
      division: '',
      user: '',
    },
  });

  const { control, watch, getValues, setValue, reset } = useForm({
    defaultValues: {
      reassignTo: {
        directorate: '',
        division: '',
        endDate: '',
        isPermanent: false,
        jobPosition: '',
        name: { id: '', label: '' },
        reason: { id: '', label: '' },
        remarks: '',
        skuDate: '',
        skuNumber: '',
        startDate: '',
      },
      selectedPerson: {
        directorate: '',
        division: '',
        jobPosition: '',
        name: { id: '', label: '' },
      },
    },
    mode: 'onChange',
  });

  const { data: detailData, isLoading: isLoadingDetail } = useGetDetailReassignment(
    {
      bucketProcessId: processId,
    },
    {
      enabled: (isDetail || isDetail !== undefined) && canViewSku,
    }
  );

  const isWaitingApprove = detailData?.status?.toLowerCase().includes('waiting') || false;
  const isCanCancel = detailData?.canCancel || false;
  const isShowEndProcess = detailData?.canEndProcess || false;
  const isViewOnly = detailData?.isViewOnly || false;


  const filterUserList = useCallback((allUsers, section) => {
    if (!allUsers || allUsers.length === 0) return [];
    const selectedPersonId = watch('selectedPerson.name.id');
    const reassignToId = watch('reassignTo.name.id');

    return allUsers.filter((user) => {
      if (section === 'selectedPerson') {
        return user.userId.toString() !== reassignToId;
      } else if (section === 'reassignTo') {
        return user.userId.toString() !== selectedPersonId;
      }
      return true;
    });
  }, [watch]);

  useEffect(() => {
    if (!isDetail && canUpdateSku && userDirectorate && userDivision && !isMaker) {
      setValue('selectedPerson.directorate', userDirectorate);
      setValue('selectedPerson.division', userDivision);

      setSearchDetailValue((prev) => ({
        ...prev,
        selectedPerson: {
          ...prev.selectedPerson,
          directorate: userDirectorate,
          division: userDivision,
          user: '',
        },
      }));

      setIsSelectedPersonDisabled(true);
    }
  }, [isDetail, isMaker, canUpdateSku, userDirectorate, userDivision, setValue]);

  const validateForm = (formData: any) => {
    const { selectedPerson, reassignTo } = formData;

    const selectedPersonValid =
      selectedPerson?.directorate?.trim() &&
      selectedPerson?.division?.trim() &&
      selectedPerson?.name?.id &&
      selectedPerson?.name?.label;

    const reassignToBasicValid =
      reassignTo?.directorate?.trim() &&
      reassignTo?.division?.trim() &&
      reassignTo?.name?.id &&
      reassignTo?.name?.label &&
      reassignTo?.reason?.id &&
      reassignTo?.reason?.label;

    let sameDirectorateDivisionValid = true;
    if (shouldSyncReassignTo) {
      sameDirectorateDivisionValid =
        reassignTo?.directorate === selectedPerson?.directorate &&
        reassignTo?.division === selectedPerson?.division;
    }

    let datesValid = true;
    if (!isPermanent) {
      datesValid = reassignTo?.startDate && reassignTo?.endDate;

      if (reassignTo?.startDate && reassignTo?.endDate) {
        try {
          const startDate = dayjs(reassignTo.startDate);
          const endDate = dayjs(reassignTo.endDate);

          datesValid = datesValid && endDate.isValid() && startDate.isValid() &&
            (endDate.isAfter(startDate) || endDate.isSame(startDate));
        } catch (error) {
          console.error('Error comparing dates:', error);
          datesValid = false;
        }
      }
    }
    let remarksValid = true;
    if (isPermanent && reassignTo?.remarks) {
      remarksValid = reassignTo.remarks.length <= 1000;
    }

    const isValid = selectedPersonValid &&
      reassignToBasicValid && sameDirectorateDivisionValid && datesValid && remarksValid;

    return isValid;
  };

  useEffect(() => {
    const selectedPersonJobPosition = watch('selectedPerson.jobPosition');

    if (!canUpdateSku || isStepEnabled) {
      setIsReassignToDisabled(true);
    } else {
      const shouldDisable = checkJobPositionForDisable(selectedPersonJobPosition);
      setIsReassignToDisabled(shouldDisable);
    }

    const shouldSync = determineShouldSyncReassignTo(selectedPersonJobPosition);
    setShouldSyncReassignTo(shouldSync);

    const isKadiv = checkIsKadivPosition(selectedPersonJobPosition);

    if (shouldSync && canUpdateSku && !isDetail && !isKadiv) {
      const selectedPersonDirectorate = watch('selectedPerson.directorate');
      const selectedPersonDivision = watch('selectedPerson.division');

      if (selectedPersonDirectorate && selectedPersonDivision) {
        setValue('reassignTo.directorate', selectedPersonDirectorate);
        setValue('reassignTo.division', selectedPersonDivision);
        setValue('reassignTo.name', { id: '', label: '' });
        setValue('reassignTo.jobPosition', '');

        setSearchDetailValue((prev) => ({
          ...prev,
          reassignTo: {
            ...prev.reassignTo,
            directorate: selectedPersonDirectorate,
            division: selectedPersonDivision,
            user: '',
          },
        }));
      }
    }
    if (isKadiv && canUpdateSku && !isDetail) {
      setValue('reassignTo.directorate', '');
      setValue('reassignTo.division', '');
      setValue('reassignTo.name', { id: '', label: '' });
      setValue('reassignTo.jobPosition', '');

      setSearchDetailValue((prev) => ({
        ...prev,
        reassignTo: {
          ...prev.reassignTo,
          directorate: '',
          division: '',
          user: '',
        },
      }));
    }
  }, [
    watch('selectedPerson.jobPosition'),
    watch('selectedPerson.directorate'),
    watch('selectedPerson.division'),
    canUpdateSku,
    setValue,
    isDetail,
    isStepEnabled
  ]);

  useEffect(() => {
    const selectedPersonJobPosition = watch('selectedPerson.jobPosition');
    const isKadiv = checkIsKadivPosition(selectedPersonJobPosition);

    if (shouldSyncReassignTo && canUpdateSku && !isDetail && !isKadiv) {
      const selectedPersonDirectorate = watch('selectedPerson.directorate');
      const selectedPersonDivision = watch('selectedPerson.division');

      if (selectedPersonDirectorate || selectedPersonDivision) {
        const currentReassignDirectorate = watch('reassignTo.directorate');
        const currentReassignDivision = watch('reassignTo.division');

        if (selectedPersonDirectorate !== currentReassignDirectorate ||
          selectedPersonDivision !== currentReassignDivision) {

          setValue('reassignTo.directorate', selectedPersonDirectorate);
          setValue('reassignTo.division', selectedPersonDivision);
          setValue('reassignTo.name', { id: '', label: '' });
          setValue('reassignTo.jobPosition', '');

          setSearchDetailValue((prev) => ({
            ...prev,
            reassignTo: {
              ...prev.reassignTo,
              directorate: selectedPersonDirectorate,
              division: selectedPersonDivision,
              user: '',
            },
          }));
        }
      }
    }
    if (isKadiv && canUpdateSku && !isDetail) {
      const currentReassignDirectorate = watch('reassignTo.directorate');
      const currentReassignDivision = watch('reassignTo.division');

      if (currentReassignDirectorate || currentReassignDivision) {
        setValue('reassignTo.directorate', '');
        setValue('reassignTo.division', '');
        setValue('reassignTo.name', { id: '', label: '' });
        setValue('reassignTo.jobPosition', '');

        setSearchDetailValue((prev) => ({
          ...prev,
          reassignTo: {
            ...prev.reassignTo,
            directorate: '',
            division: '',
            user: '',
          },
        }));
      }
    }
  }, [
    watch('selectedPerson.directorate'),
    watch('selectedPerson.division'),
    watch('selectedPerson.jobPosition'),
    shouldSyncReassignTo,
    canUpdateSku,
    setValue,
    isDetail
  ]);

  useEffect(() => {
    const subscription = watch((value) => {
      const isValid = validateForm(value);
      setIsFormValid(isValid);
    });
    return () => subscription.unsubscribe();
  }, [watch, isPermanent, shouldSyncReassignTo]);

  useEffect(() => {
    if (isPermanent) {
      setValue('reassignTo.startDate', '');
      setValue('reassignTo.endDate', '');
    }
  }, [isPermanent, setValue]);

  // Reset end date if start date changes and end date invalid
  useEffect(() => {
    const startDate = watch('reassignTo.startDate');
    const endDate = watch('reassignTo.endDate');

    if (!isPermanent && startDate && endDate) {
      try {
        const start = dayjs(startDate);
        const end = dayjs(endDate);

        if (start.isValid() && end.isValid() && end.isBefore(start)) {
          setValue('reassignTo.endDate', '');
        }
      } catch (error) {
        console.error('Error comparing dates in useEffect:', error);
      }
    }
  }, [watch('reassignTo.startDate'), isPermanent, setValue]);

  useEffect(() => {
    const formData = getValues();
    const isValid = validateForm(formData);
    setIsFormValid(isValid);
  }, [isPermanent]);

  useEffect(() => {
    const jobPosition = watch('reassignTo.jobPosition');
    const isKadiv = checkIsKadivPosition(jobPosition);
    setIsKadivPosition(isKadiv);
  }, [watch('reassignTo.jobPosition')]);

  const { data: directorateDataSP, isSuccess: isDirectorateSuccessSP } = useGetMasterDirectorate({
    filter: { type: 'INTERNAL' },
    page: { itemPerPage: 10000, noPage: 1 },
    searchDetail: { key: 'name', value: searchDetailValue.selectedPerson.directorate },
  });

  const { data: directorateDataRT, isSuccess: isDirectorateSuccessRT } = useGetMasterDirectorate({
    filter: { type: 'INTERNAL' },
    page: { itemPerPage: 10000, noPage: 1 },
    searchDetail: { key: 'name', value: searchDetailValue.reassignTo.directorate },
  });

  const findDirectorateKeyByLabel = (label: string, data: any) => {
    return data?.contents?.find((item: any) => item.label === label)?.key || '';
  };

  const { data: divisionDataSP, isSuccess: isDivisionSuccessSP } = useGetMasterDivision({
    filter: {
      directorate: findDirectorateKeyByLabel(
        searchDetailValue.selectedPerson.directorate,
        directorateDataSP
      ),
    },
    page: { itemPerPage: 10000, noPage: 1 },
    searchDetail: { key: 'name', value: searchDetailValue.selectedPerson.division },
  }, {
    enabled: !!searchDetailValue.selectedPerson.directorate && canViewSku,
  });

  const { data: divisionDataRT, isSuccess: isDivisionSuccessRT } = useGetMasterDivision({
    filter: {
      directorate: findDirectorateKeyByLabel(
        searchDetailValue.reassignTo.directorate,
        directorateDataRT
      ),
    },
    page: { itemPerPage: 10000, noPage: 1 },
    searchDetail: { key: 'name', value: searchDetailValue.reassignTo.division },
  }, {
    enabled: !!searchDetailValue.reassignTo.directorate && canViewSku,
  });

  const findDivisionKeyByLabel = (label: string, data: any) => {
    return data?.contents?.find((item: any) => item.label === label)?.key || '';
  };

  const { data: userDataSP, isSuccess: isUserSuccessSP } = useGetUserSearch({
    division: findDivisionKeyByLabel(searchDetailValue.selectedPerson.division, divisionDataSP),
    module: TypeModule.REASSIGNMENT_SKU,
    process: TypeProcess.REASSIGNMENT_SKU,
    value: searchDetailValue.selectedPerson.user,
  }, {
    enabled: !!searchDetailValue.selectedPerson.division && canViewSku,
  });

  const { data: userDataRT, isSuccess: isUserSuccessRT } = useGetUserSearch({
    division: findDivisionKeyByLabel(searchDetailValue.reassignTo.division, divisionDataRT),
    module: TypeModule.REASSIGNMENT_SKU,
    process: TypeProcess.REASSIGNMENT_SKU,
    value: searchDetailValue.reassignTo.user,
  }, {
    enabled: !!searchDetailValue.reassignTo.division && canViewSku,
  });

  const { data: reasonData } = useGetParameterList('userReason');

  useEffect(() => {
    if (userDataRT && isUserSuccessRT) {
      const filtered = filterUserList(userDataRT, 'reassignTo');
      setFilteredUserList((prev) => ({
        ...prev,
        reassignTo: filtered,
      }));
    }
  }, [userDataRT, isUserSuccessRT, filterUserList]);

  useEffect(() => {
    if (userDataSP && isUserSuccessSP) {
      const filtered = filterUserList(userDataSP, 'selectedPerson');
      setFilteredUserList((prev) => ({
        ...prev,
        selectedPerson: filtered,
      }));
    }
  }, [userDataSP, isUserSuccessSP, filterUserList]);

  useEffect(() => {
    if (userDataRT && isUserSuccessRT) {
      const filtered = filterUserList(userDataRT, 'reassignTo');
      setFilteredUserList((prev) => ({
        ...prev,
        reassignTo: filtered,
      }));
    }
  }, [watch('selectedPerson.name.id'), userDataRT, isUserSuccessRT, filterUserList]);

  useEffect(() => {

    if (userDataSP && isUserSuccessSP) {
      const filtered = filterUserList(userDataSP, 'selectedPerson');
      setFilteredUserList((prev) => ({
        ...prev,
        selectedPerson: filtered,
      }));
    }
  }, [watch('reassignTo.name.id'), userDataSP, isUserSuccessSP, filterUserList]);

  const directorateList = useMemo(() => ({
    reassignTo: isDirectorateSuccessRT
      ? directorateDataRT?.contents?.map((directorate) => ({
        id: directorate.key,
        label: directorate.label,
      }))
      : [],
    selectedPerson: isDirectorateSuccessSP
      ? directorateDataSP?.contents?.map((directorate) => ({
        id: directorate.key,
        label: directorate.label,
      }))
      : [],
  }), [isDirectorateSuccessRT, directorateDataRT, isDirectorateSuccessSP, directorateDataSP]);

  const formattedActionButton = { ...actionButtons };
  let isEdit = false;

  for (const key in actionButtons) {
    if (key.includes('EDIT')) {
      isEdit = true;
      break;
    }
  }

  const userList = {
    reassignTo: filteredUserList.reassignTo.length > 0
      ? filteredUserList.reassignTo.map((user) => ({
        directorate: user.division[0]?.directorate.name || '',
        division: user.division[0]?.name || '',
        id: user.userId,
        jobPosition: user.roleRefactor?.name || '',
        label: user.fullName,
      }))
      : [],
    selectedPerson: filteredUserList.selectedPerson.length > 0
      ? filteredUserList.selectedPerson.map((user) => ({
        directorate: user.division[0]?.directorate.name || '',
        division: user.division[0]?.name || '',
        id: user.userId,
        jobPosition: user.roleRefactor?.name || '',
        label: user.fullName,
      }))
      : [],
  };

  useEffect(() => {
    if (detailData && isDetail && canViewSku) {
      const formatDateFromAPI = (dateString: string) => {
        if (!dateString) return '';
        try {
          return formatDate(new Date(dateString), 'YYYY-MM-DD');
        } catch (error) {
          console.error('Error formatting date from API:', error);
          return '';
        }
      };

      const mappedData = {
        currentDirectorate: detailData.reAssignTo?.direktoratLabel || '',
        currentDivision: detailData.reAssignTo?.divisiName || '',
        currentJobPosition: detailData.reAssignTo?.jabatan || '',
        currentPicId: detailData.reAssignTo?.userId?.toString() || '',
        currentPicName: detailData.reAssignTo?.userFullName || '',
        endDate: detailData.endDate || '',
        isPermanent: detailData.isPermanent || false,
        previousDirectorate: detailData.previousPic?.direktoratLabel || '',
        previousDivision: detailData.previousPic?.divisiName || '',
        previousJobPosition: detailData.previousPic?.jabatan || '',
        previousPicId: detailData.previousPic?.userId?.toString() || '',
        previousPicName: detailData.previousPic?.userFullName || '',
        reason: detailData.reason || '',
        remarks: detailData.remarks || '',
        skuDate: detailData.skuDate || '',
        skuNumber: detailData.skuNumber || '',
        startDate: detailData.startDate || '',
      };

      reset({
        reassignTo: {
          directorate: mappedData.currentDirectorate,
          division: mappedData.currentDivision,
          endDate: formatDateFromAPI(mappedData.endDate),
          isPermanent: mappedData.isPermanent,
          jobPosition: mappedData.currentJobPosition,
          name: {
            id: mappedData.currentPicId,
            label: mappedData.currentPicName,
          },
          reason: {
            id: mappedData.reason,
            label: mappedData.reason,
          },
          remarks: mappedData.remarks,
          skuDate: formatDateFromAPI(mappedData.skuDate),
          skuNumber: mappedData.skuNumber,
          startDate: formatDateFromAPI(mappedData.startDate),
        },
        selectedPerson: {
          directorate: mappedData.previousDirectorate,
          division: mappedData.previousDivision,
          jobPosition: mappedData.previousJobPosition,
          name: {
            id: mappedData.previousPicId,
            label: mappedData.previousPicName,
          },
        },
      });

      setIsPermanent(mappedData.isPermanent);

      const shouldDisable = checkJobPositionForDisable(mappedData.previousJobPosition);
      setIsReassignToDisabled(shouldDisable);

      const shouldSync = determineShouldSyncReassignTo(mappedData.previousJobPosition);
      setShouldSyncReassignTo(shouldSync);

      setIsSelectedPersonDisabled(true);

      setSearchDetailValue({
        reassignTo: {
          directorate: mappedData.currentDirectorate,
          division: mappedData.currentDivision,
          user: mappedData.currentPicName,
        },
        selectedPerson: {
          directorate: mappedData.previousDirectorate,
          division: mappedData.previousDivision,
          user: mappedData.previousPicName,
        },
      });
    }
  }, [detailData, isDetail, reset, canViewSku]);

  useEffect(() => {
    if (canViewSku) {
      recordActivity({
        activity: ActivityType.VIEW,
        bucketProcessId: processId,
        module: TypeModule.REASSIGNMENT_SKU,
        process: TypeProcess.REASSIGNMENT_SKU,
        remarks: 'view request page',
      });
    }
  }, [processId, recordActivity, canViewSku]);

  const divisionList = {
    reassignTo: isDivisionSuccessRT
      ? divisionDataRT?.contents?.map((division) => ({
        id: division.key,
        label: division.label,
      }))
      : [],
    selectedPerson: isDivisionSuccessSP
      ? divisionDataSP?.contents?.map((division) => ({
        id: division.key,
        label: division.label,
      }))
      : [],
  };

  const reasonList = reasonData?.map((reason) => ({
    id: reason.value,
    label: reason.label,
  })) || [];

  const handleDirectorateChange = (value: any, section: 'selectedPerson' | 'reassignTo') => {
    if (!canUpdateSku) return;

    setValue(`${section}.directorate`, value?.label || '');
    setValue(`${section}.division`, '');
    setValue(`${section}.name`, { id: '', label: '' });
    setValue(`${section}.jobPosition`, '');

    if (section === 'selectedPerson') {
      setFilteredUserList((prev) => ({
        ...prev,
        selectedPerson: [],
      }));
    } else if (section === 'reassignTo') {
      setFilteredUserList((prev) => ({
        ...prev,
        reassignTo: [],
      }));
    }

    setSearchDetailValue((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        directorate: value?.label || '',
        division: '',
        user: '',
      },
    }));
  };

  const handleReassignDirectorateChange = (value: any, section: 'selectedPerson' | 'reassignTo') => {
    handleDirectorateChange(value, section);
  };

  const handleDivisionChange = (value: any, section: 'selectedPerson' | 'reassignTo') => {
    if (!canUpdateSku) return;

    setValue(`${section}.division`, value?.label || '');
    setValue(`${section}.name`, { id: '', label: '' });
    setValue(`${section}.jobPosition`, '');

    if (section === 'selectedPerson') {
      setFilteredUserList((prev) => ({
        ...prev,
        selectedPerson: [],
      }));
    } else if (section === 'reassignTo') {
      setFilteredUserList((prev) => ({
        ...prev,
        reassignTo: [],
      }));
    }

    setSearchDetailValue((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        division: value?.label || '',
        user: '',
      },
    }));
  };

  const handleReassignDivisionChange = (value: any, section: 'selectedPerson' | 'reassignTo') => {
    handleDivisionChange(value, section);
  };

  const handlePersonChange = (value: any, section: 'selectedPerson' | 'reassignTo') => {
    if (!canUpdateSku) return;

    setValue(`${section}.name`, value || { id: '', label: '' });

    if (value) {
      const userSource = section === 'selectedPerson'
        ? filteredUserList.selectedPerson
        : filteredUserList.reassignTo;

      const selectedUser = userSource?.find((user) => user.userId.toString() === value.id);

      if (selectedUser) {
        setValue(`${section}.jobPosition`, selectedUser.roleRefactor?.name || '');

        if (section === 'reassignTo') {
          const jobPosition = selectedUser.roleRefactor?.name || '';
          const isKadiv = checkIsKadivPosition(jobPosition);
          setIsKadivPosition(isKadiv);
        }

        if (section === 'selectedPerson') {
          const jobPosition = selectedUser.roleRefactor?.name || '';
          const shouldDisable = checkJobPositionForDisable(jobPosition);
          setIsReassignToDisabled(shouldDisable);

          const shouldSync = determineShouldSyncReassignTo(jobPosition);
          setShouldSyncReassignTo(shouldSync);

          const isKadiv = checkIsKadivPosition(jobPosition);
          if (isKadiv && canUpdateSku && !isDetail) {
            setValue('reassignTo.directorate', '');
            setValue('reassignTo.division', '');
            setValue('reassignTo.name', { id: '', label: '' });
            setValue('reassignTo.jobPosition', '');

            setSearchDetailValue((prev) => ({
              ...prev,
              reassignTo: {
                ...prev.reassignTo,
                directorate: '',
                division: '',
                user: '',
              },
            }));
          }
        }
      }
    } else {
      setValue(`${section}.jobPosition`, '');

      if (section === 'reassignTo') {
        setIsKadivPosition(false);
      }

      if (section === 'selectedPerson') {
        setIsReassignToDisabled(false);
        setShouldSyncReassignTo(false);
      }
    }
  };

  const handleReassignPersonChange = (value: any, section: 'selectedPerson' | 'reassignTo') => {
    handlePersonChange(value, section);
  };

  const handleReasonChange = (value: any) => {
    if (!canUpdateSku) return;

    setValue('reassignTo.reason', value || { id: '', label: '' });
  };

  const handleInputChange = (section: 'selectedPerson' | 'reassignTo', field: 'directorate' | 'division' | 'user', value: string) => {
    if (!canUpdateSku) return;

    setSearchDetailValue((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value,
      },
    }));
  };

  const { isPending: isSaveLoading, mutate: saveRequest } = useSaveRequest({
    onError: (error) => {
      const errorMessage = error?.message;
      showNiceModalV2({ title: errorMessage, type: 'error' });
    },
    onSuccess: (data) => {
      const savedBucketProcessId = data?.contents?.[0]?.bucketProcessId;

      recordActivity({
        activity: ActivityType.ADD,
        bucketProcessId: processId,
        changeAfter: JSON.stringify(data),
        module: TypeModule.REASSIGNMENT_SKU,
        process: TypeProcess.REASSIGNMENT_SKU,
        remarks: 'add request',
      });

      setDirtyMsg(undefined);
      queryClient.invalidateQueries({ queryKey: ['sku-request', { bucketProcessId: processId }]});
      queryClient.invalidateQueries({ queryKey: ['bucket-stepper', { bucketProcessId: processId }]});
      queryClient.invalidateQueries({ queryKey: ['bucket-detail', { bucketProcessId: processId }]});

      if (!isSaveForSubmit) {
        showNiceModalV2({
          onClose: () => {
            if (savedBucketProcessId && !isDetail) {
              handleToDetail(savedBucketProcessId);
            }
          },
          title: 'Request berhasil disimpan',
          type: 'success',
        });
      } else {
        setIsSaveForSubmit(false);
      }
    },
  });

  const { mutate: submitBucket } = useSubmitBucket({
    onError: (e) => {
      showNiceModalV2({
        title: e.response?.data?.errorDetail ?? 'Terjadi kesalahan, silahkan coba lagi',
        type: 'error',
      });
    },
    onSuccess: (data, variables) => {
      const action = variables.submitRequestDto.action;
      let activityType = ActivityType.SUBMIT;
      let remarks = 'submit request';

      if (action === ActivityType.APPROVE || action.includes(ActivityType.APPROVE)) {
        activityType = ActivityType.APPROVE;
        remarks = 'approve request';
      } else if (action === ActivityType.RETURN_TO_STAFF || action === ActivityType.RETURN_TO_TL) {
        activityType = ActivityType.REJECT;
        remarks = `reject and return request (${action})`;
      }

      recordActivity({
        activity: activityType,
        bucketProcessId: processId,
        changeAfter: JSON.stringify(variables),
        module: TypeModule.REASSIGNMENT_SKU,
        process: TypeProcess.REASSIGNMENT_SKU,
        remarks: remarks,
      });

      queryClient.invalidateQueries({ queryKey: ['bucket-stepper', { bucketProcessId: processId }]});
      queryClient.invalidateQueries({ queryKey: ['bucket-detail', { bucketProcessId: processId }]});
      showNiceModalV2({ onClose: () => handleBackToTable(), title: 'Data berhasil disimpan', type: 'success' });
    },
  });

  const handleBackToTable = () => {
    router.push(RE_ASSIGNMENT_SKU.BASH_PATH);
    queryClient.invalidateQueries({
      queryKey: ['bucket-list', { bucketProcessId: processId }],
    });
  };

  const handleToDetail = (bucketProcessId?: string) => {
    const targetProcessId = bucketProcessId || processId;

    const detailPath = RE_ASSIGNMENT_SKU.REQUEST_PAGE
      .replace('[processId]', targetProcessId)
      .replace('[mode]', 'detail');

    router.push(detailPath);
  };

  const handleSave = () => {
    if (!isFormValid) {
      showNiceModalV2({
        title: 'Please fill all mandatory fields correctly',
        type: 'warning',
      });
      return;
    }

    if (!canUpdateSku && !canCreateSku) {
      showNiceModalV2({
        title: 'Anda tidak memiliki akses untuk menyimpan data',
        type: 'warning',
      });
      return;
    }

    recordActivity({
      activity: ActivityType.VIEW,
      bucketProcessId: processId,
      module: TypeModule.REASSIGNMENT_SKU,
      process: TypeProcess.REASSIGNMENT_SKU,
      remarks: 'initiate save request',
    });

    const formData = getValues();

    const formatDateToISO = (dateInput: any) => {
      if (!dateInput) return '';

      try {
        const formatted = formatDate(dateInput, 'YYYY-MM-DD');
        return formatted ? `${formatted}T00:00:00Z` : '';
      } catch (error) {
        console.error('Error formatting date:', error);
        return '';
      }
    };


    const payload: any = {
      isPermanent: isPermanent || false,
      picId: formData.reassignTo.name?.id || '',
      previousPicId: formData.selectedPerson.name?.id || '',
      reason: formData.reassignTo.reason?.label || '',
      remarks: formData.reassignTo.remarks || '',
      skuNumber: formData.reassignTo.skuNumber || '',
    };

    if (detailData && processId) {
      payload.bucketProcessId = String(processId);
    }

    if (formData.reassignTo.startDate) {
      payload.startDate = formatDateToISO(formData.reassignTo.startDate);
    }

    if (isPermanent) {
      payload.endDate = '';
    } else if (formData.reassignTo.endDate) {
      payload.endDate = formatDateToISO(formData.reassignTo.endDate);
    }

    if (formData.reassignTo.skuDate) {
      payload.skuDate = formatDateToISO(formData.reassignTo.skuDate);
    }

    if (isEdit && processId) {
      payload.bucketProcessId = String(processId);
    }

    saveRequest(payload);
  };

  const saveThenOpenComment = (action: string) => {
    if (!canUpdateSku) {
      showNiceModalV2({
        title: 'Anda tidak memiliki akses untuk melakukan submit',
        type: 'warning',
      });
      return;
    }

    if (!isFormValid) {
      showNiceModalV2({
        title: 'Please fill all mandatory fields correctly',
        type: 'warning',
      });
      return;
    }

    recordActivity({
      activity: ActivityType.VIEW,
      bucketProcessId: processId,
      module: TypeModule.REASSIGNMENT_SKU,
      process: TypeProcess.REASSIGNMENT_SKU,
      remarks: `initiate save before action: ${action}`,
    });

    setIsSaveForSubmit(true);

    const formData = getValues();

    const formatDateToISO = (dateInput: any) => {
      if (!dateInput) return '';

      try {
        const formatted = formatDate(dateInput, 'YYYY-MM-DD');
        return formatted ? `${formatted}T00:00:00Z` : '';
      } catch (error) {
        console.error('Error formatting date:', error);
        return '';
      }
    };

    const payload: any = {
      isPermanent: isPermanent || false,
      picId: formData.reassignTo.name?.id || '',
      previousPicId: formData.selectedPerson.name?.id || '',
      reason: formData.reassignTo.reason?.label || '',
      remarks: formData.reassignTo.remarks || '',
      skuNumber: formData.reassignTo.skuNumber || '',
    };

    if (detailData && processId) {
      payload.bucketProcessId = String(processId);
    }

    if (formData.reassignTo.startDate) {
      payload.startDate = formatDateToISO(formData.reassignTo.startDate);
    }

    if (isPermanent) {
      payload.endDate = '';
    } else if (formData.reassignTo.endDate) {
      payload.endDate = formatDateToISO(formData.reassignTo.endDate);
    }

    if (formData.reassignTo.skuDate) {
      payload.skuDate = formatDateToISO(formData.reassignTo.skuDate);
    }

    if (isEdit && processId) {
      payload.bucketProcessId = String(processId);
    }

    // saveRequest(payload, {
    //   onError: () => {
    //     showNiceModalV2({
    //       title: 'Data Gagal disimpan',
    //       type: 'error',
    //     });
    //   },
    //   onSuccess: (data) => {
    recordActivity({
      activity: ActivityType.ADD,
      bucketProcessId: processId,
      changeAfter: JSON.stringify(payload),
      module: TypeModule.REASSIGNMENT_SKU,
      process: TypeProcess.REASSIGNMENT_SKU,
      remarks: 'save request (save before submit)',
    });

    setDirtyMsg(undefined);
    queryClient.invalidateQueries({
      queryKey: ['sku-request', { bucketProcessId: processId }],
    });
    queryClient.invalidateQueries({
      queryKey: ['bucket-stepper', { bucketProcessId: processId }],
    });

    NiceModal.show(MODAL.GLOBAL.COMMENT, {
      onSave: ({ comment }) => {
        submitBucket({
          submitRequestDto: {
            action: action,
            bucketProcessId: processId,
            comment,
            module: TypeModule.REASSIGNMENT_SKU,
            process: TypeProcess.REASSIGNMENT_SKU,
          },
        });
        closeNiceModal(MODAL.GLOBAL.COMMENT);
      },
    });
    // },
    // });
  };

  const handleSubmit = (action: string) => {
    if (!canUpdateSku) {
      showNiceModalV2({
        title: 'Anda tidak memiliki akses untuk melakukan submit',
        type: 'warning',
      });
      return;
    }

    recordActivity({
      activity: ActivityType.VIEW,
      bucketProcessId: processId,
      module: TypeModule.REASSIGNMENT_SKU,
      process: TypeProcess.REASSIGNMENT_SKU,
      remarks: `open submit modal for action: ${action}`,
    });

    NiceModal.show(MODAL.GLOBAL.COMMENT, {
      onSave: ({ comment }) => {
        submitBucket({
          submitRequestDto: {
            action: action,
            bucketProcessId: processId,
            comment,
            module: TypeModule.REASSIGNMENT_SKU,
            process: TypeProcess.REASSIGNMENT_SKU,
          },
        });
        closeNiceModal(MODAL.GLOBAL.COMMENT);
      },
    });
  };

  const handleClose = () => {
    showNiceModalV2({
      cancelText: 'Batal',
      onSubmit: () => {
        recordActivity({
          activity: ActivityType.VIEW,
          bucketProcessId: processId,
          module: TypeModule.REASSIGNMENT_SKU,
          process: TypeProcess.REASSIGNMENT_SKU,
          remarks: 'close request page',
        });
        router.push(RE_ASSIGNMENT_SKU.BASH_PATH);
      },
      submitText: 'Ya',
      title: 'Apakah Anda yakin ingin menutup halaman ini?',
      type: 'warning',
    });
  };

  const handleButton = (key: string, value: string) => {
    if (!canUpdateSku) return null;

    switch (key) {
      case 'SAVE':
        return (
          <Button
            onClick={handleSave}
            variant="contained"
            disabled={!isFormValid || isSaveLoading}
          >
            Save
          </Button>
        );
      case 'SUBMIT':
        return (
          <Button
            onClick={() => saveThenOpenComment(value)}
            variant="contained"
            color="success"
            disabled={!isFormValid || isSaveLoading}
          >
            Submit
          </Button>
        );
      case 'APPROVE':
        return (
          <Button
            onClick={() => handleSubmit(value)}
            variant="contained"
            color="success"
          >
            Approve
          </Button>
        );
      case 'REJECT':
        return (
          <Button
            onClick={() => handleSubmit(value)}
            variant="outlined"
            color="error"
          >
            Reject
          </Button>
        );
      case 'RETURN_TO_REQUESTOR':
        return (
          <Button
            onClick={() => handleSubmit(value)}
            variant="contained"
            color="info"
          >
            Return to Requestor
          </Button>
        );
      case 'DECLINE':
        return (
          <Button
            color="error"
            variant="outlined"
            onClick={handleOpenDeclineModal}
          >
            Decline
          </Button>
        );
      case 'CLOSE':
        return (
          <Button
            variant="outlined"
            onClick={handleClose}
          >
            Close
          </Button>
        );
      default:
        return null;
    }
  };

  const handleOpenDeclineModal = () => {
    if (!canUpdateSku) return;

    NiceModal.show(modal.DECLINE);
  };

  const renderActionButtons = () => {
    console.log('renderActionButtons1', canUpdateSku);
    console.log('renderActionButtons2', formattedActionButton);
    console.log('renderActionButtons3', isViewOnly);

    if (!canUpdateSku) return null;

    return formattedActionButton && !isViewOnly && Object.keys(formattedActionButton).length > 0
      ? Object.entries(formattedActionButton).map(([key, value]: [string, string]) => {
        return handleButton(key, value);
      })
      : null;
  };

  return {
    actionButtons,
    canCreateSku,
    canDeleteSku,
    canUpdateSku: !isDetail && (canCreateSku || canUpdateSku),
    canViewSku,
    control,
    directorateList,
    divisionList,
    formattedActionButton,
    getReassignToDisabledState,
    getSelectedPersonDisabledState,
    getValues,
    handleClose,
    handleDirectorateChange,
    handleDivisionChange,
    handleInputChange,
    handlePersonChange,
    handleReasonChange,
    handleReassignDirectorateChange,
    handleReassignDivisionChange,
    handleReassignPersonChange,
    handleSave,
    handleSubmit,
    isCanCancel,
    isDetail,
    isFormValid,
    isKadivPosition,
    isLoadingDetail,
    isPermanent,
    isReassignToDisabled: getReassignToDisabledState(),
    isSaveLoading,
    isSelectedPersonDisabled: getSelectedPersonDisabledState(),
    isShowEndProcess,
    isStepEnabled,
    isViewOnly,
    isWaitingApprove,
    reasonList,
    renderActionButtons,
    reset,
    setIsPermanent,
    setValue,
    shouldSyncReassignTo,
    today,
    userList,
    watch,
  };
};
