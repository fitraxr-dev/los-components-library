import * as React from 'react';

import dayjs from 'dayjs';
import { useForm, useWatch } from 'react-hook-form';
import { useShallow } from 'zustand/react/shallow';

import { MODAL } from '@/configs/constants/modalId';
import { TypeModule, TypeProcess } from '@/enums/Module';
import showNiceModalV2 from '@/helpers/showNiceModalV2';
import useGetAllDirectorate from '@/hooks/services/useGetAllDirectorate';
import useGetParameterList from '@/hooks/services/useGetParameterList';
import useSearchAllDivision from '@/hooks/services/useSearchAllDivision';
import useSearchAllUser from '@/hooks/services/useSearchUser';
import closeNiceModal from '@/hooks/useCloseNiceModal';
import useIdentity from '@/hooks/useIdentity';

import useGetUserCollaborationDetail from '../../../../RisalahRapatResult/hooks/useGetUserCollaborationDetail';
import useGetSkuInformation from '../../../hooks/useGetSkuInformation';
import useModalConsentSheetStore from '../ModalConsentSheet/ModalConsentSheet.store';

import type { ConsentSheetListUser } from '../../../hooks/useGetConsentSheetList';
import type { ConsentSheetUser } from '../ModalConsentSheet/ModalConsentSheet.store';
import type { Dropdown } from '@/components/shared/Input/Input.types';
import type { UserDetailResponse } from '@/services/openapi/user-management-service';


type ConsentSheetSigningFormValues = {
  consentRole: string;
  directorate: string;
  division: string;
  staff: string;
  staffName: string;
  jobPositionLabel: string;
  hasSku: boolean;
  skuDirectorate: string;
  skuDivision: string;
  skuStaff: string;
  skuStaffName: string;
  skuJobPositionLabel: string;
  skuNo: string;
  skuDate: string;
};

const DEFAULT_VALUES: ConsentSheetSigningFormValues = {
  consentRole: '',
  directorate: '',
  division: '',
  hasSku: false,
  jobPositionLabel: '',
  skuDate: '',
  skuDirectorate: '',
  skuDivision: '',
  skuJobPositionLabel: '',
  skuNo: '',
  skuStaff: '',
  skuStaffName: '',
  staff: '',
  staffName: '',
};

const getRoleCodeFromJobPosition = (jobPosition: string): string => {
  const positionLower = jobPosition?.toLowerCase() || '';

  if (positionLower.includes('kepala divisi')) return 'KADIV';
  if (positionLower.includes('team leader')) return 'TL';
  if (positionLower.includes('direktur')) return 'BOD';
  if (positionLower.includes('staff')) return 'STAFF';

  return '';
};

const mapUserToFormValues = (user?: ConsentSheetListUser | null): ConsentSheetSigningFormValues => ({
  ...DEFAULT_VALUES,
  consentRole: user?.consentRole ?? '',
  directorate: user?.directorateId ? String(user.directorateId) : '',
  division: user?.divisionId ? String(user.divisionId) : '',
  hasSku: Boolean(user?.sku),
  jobPositionLabel: user?.jobPositionLabel ?? '',
  skuDate: user?.sku?.skuDate ?? '',
  skuDirectorate: user?.sku?.directorateId ? String(user.sku.directorateId) : '',
  skuDivision: user?.sku?.divisionId ? String(user.sku.divisionId) : '',
  skuJobPositionLabel: user?.sku?.jobPositionLabel ?? '',
  skuNo: user?.sku?.skuNo ?? '',
  skuStaff: user?.sku?.staffId ? String(user.sku.staffId) : '',
  staff: user?.staffId ? String(user.staffId) : '',
});

const getOptionsWithSelected = (
  options: any[],
  selectedUser?: {
    id: number | string;
    name: string;
    position: string;
  }
): any[] => {
  if (!selectedUser || !selectedUser.id) return options;

  const selectedId = String(selectedUser.id);
  const exists = options.some((opt) => String(opt.id) === selectedId);

  if (exists) return options;

  return [
    {
      id: selectedId,
      jobTitle: selectedUser.position,
      label: selectedUser.name,
      roleCode: getRoleCodeFromJobPosition(selectedUser.position),
      value: selectedId,
    },
    ...options
  ];
};

interface UseModalConsentSheetSigningParams {
  sectionId: string;
  editingUser?: ConsentSheetUser | null;
  id?: number | string;
}

const mapToOptions = (
  data: any,
  keys: { label?: string; value?: string } = { label: 'name', value: 'id' }
): Dropdown[] => {
  const contents = data?.contents ?? [];
  return contents.reduce((options: any[], item: any) => {
    const rawValue = item?.[keys.value ?? 'id'];
    if (rawValue === undefined || rawValue === null || rawValue === '') return options;

    options.push({
      id: String(rawValue),
      label: item?.[keys.label ?? 'name'] ?? '',
      roleCode: item?.roleRefactor?.roleCode ?? '',
      value: String(rawValue),
    });

    return options;
  }, []);
};

const buildUserLookup = (data: any): Record<string, UserDetailResponse> => {
  const contents = data?.contents ?? [];
  return contents.reduce((lookup: Record<string, UserDetailResponse>, item: UserDetailResponse) => {
    if (!item?.userId) return lookup;
    lookup[String(item.userId)] = item;
    return lookup;
  }, {});
};

const parseNumericValue = (value?: string | number) => {
  if (value === undefined || value === null || value === '') return undefined;
  const parsed = Number(value);
  return Number.isNaN(parsed) ? undefined : parsed;
};

const toNumber = (value?: string | number | boolean) => {
  const parsedValue = Number(value);
  return Number.isNaN(parsedValue) ? undefined : parsedValue;
};

const useModalConsentSheetSigning = ({ sectionId, editingUser, id }: UseModalConsentSheetSigningParams) => {
  const { processId } = useIdentity();

  const {
    data: userDetailData,
    isFetching: isUserDetailFetching,
    isLoading: isUserDetailLoading,
  } = useGetUserCollaborationDetail(
    { id: toNumber(id) },
    {
      enabled: Boolean(id),
    }
  );

  const effectiveEditingUser = React.useMemo(() => {
    if (!id) return editingUser;
    if (isUserDetailFetching || !userDetailData) return null;

    return {
      ...editingUser,
      consentRole: userDetailData.consentRole ?? editingUser?.consentRole,
      consentRoleLabel: userDetailData.consentRoleLabel ?? editingUser?.consentRoleLabel,
      directorateId: userDetailData.directorateId ?? editingUser?.directorateId,
      directorateLabel: userDetailData.directorateLabel ?? editingUser?.directorateLabel,
      divisionId: userDetailData.divisionId ?? editingUser?.divisionId,
      divisionLabel: userDetailData.divisionLabel ?? editingUser?.divisionLabel,
      jobPositionLabel: userDetailData.jobPositionLabel ?? editingUser?.jobPositionLabel,
      sku: userDetailData.sku ? {
        directorateId: userDetailData.sku.directorateId ?? undefined,
        directorateLabel: userDetailData.sku.directorateLabel ?? undefined,
        divisionId: userDetailData.sku.divisionId ?? undefined,
        divisionLabel: userDetailData.sku.divisionLabel ?? undefined,
        jobPositionLabel: userDetailData.sku.jobPositionLabel ?? undefined,
        skuDate: userDetailData.sku.skuDate ?? undefined,
        skuNo: userDetailData.sku.skuNo ?? undefined,
        staffId: userDetailData.sku.staffId ?? undefined,
        staffName: userDetailData.sku.staffName ?? undefined,
      } : editingUser?.sku,
      staffId: userDetailData.staffId ?? editingUser?.staffId,
      staffName: userDetailData.staffName ?? editingUser?.staffName,
    };
  }, [id, userDetailData, editingUser, isUserDetailFetching]);

  const initialValues = React.useMemo(
    () => mapUserToFormValues(effectiveEditingUser),
    [effectiveEditingUser]
  );

  const {
    control,
    formState,
    handleSubmit,
    reset,
    setValue,
  } = useForm<ConsentSheetSigningFormValues>({
    defaultValues: initialValues,
    mode: 'onChange',
  });

  React.useEffect(() => {
    reset(initialValues);
  }, [initialValues, reset]);

  const directorateValue = useWatch({ control, name: 'directorate' });
  const divisionValue = useWatch({ control, name: 'division' });
  const staffValue = useWatch({ control, name: 'staff' });
  const hasSku = useWatch({ control, name: 'hasSku' });
  const skuDirectorateValue = useWatch({ control, name: 'skuDirectorate' });
  const skuDivisionValue = useWatch({ control, name: 'skuDivision' });

  const [userSearch, setUserSearch] = React.useState('');
  const [skuUserSearch, setSkuUserSearch] = React.useState('');
  const [divSearch, setDivSearch] = React.useState('');
  const [dirSearch, setDirSearch] = React.useState('');
  const [selectedRole, setSelectedRole] = React.useState<string>('');

  const { data: roleOptions = []} = useGetParameterList('userCollaborationConsentRole', {
    label: 'value1',
    value: 'key',
  });
  const { data: directorateOptions = []} = useGetAllDirectorate(
    { value: dirSearch || '' },
    {
      select: (data) => mapToOptions(data),
    }
  );
  const { data: divisionOptions = []} = useSearchAllDivision(
    { directorateCode: directorateValue ?? '', value: divSearch || '' },
    {
      enabled: Boolean(directorateValue),
      select: (data) => mapToOptions(data),
    }
  );
  const { data: userData } = useSearchAllUser(
    { division: divisionValue ?? '', value: userSearch || '' },
    {
      enabled: Boolean(divisionValue),
    }
  );
  const userOptionsRaw = React.useMemo(
    () => mapToOptions(userData, { label: 'fullName', value: 'userId' }),
    [userData]
  );

  const { data: skuDivisionOptions = []} = useSearchAllDivision(
    { directorateCode: skuDirectorateValue ?? '', value: divSearch || '' },
    {
      enabled: Boolean(skuDirectorateValue),
      select: (data) => mapToOptions(data),
    }
  );
  const { data: skuUserData } = useSearchAllUser(
    { division: skuDivisionValue ?? '', role: 'KADIV', value: skuUserSearch || '' },
    {
      enabled: Boolean(skuDivisionValue),
    }
  );
  const skuUserOptionsRaw = React.useMemo(
    () => mapToOptions(skuUserData, { label: 'fullName', value: 'userId' }),
    [skuUserData]
  );

  const userOptions = React.useMemo(
    () => getOptionsWithSelected(
      userOptionsRaw,
      effectiveEditingUser && String(divisionValue) === String(effectiveEditingUser.divisionId) ? {
        id: effectiveEditingUser.staffId,
        name: effectiveEditingUser.staffName,
        position: effectiveEditingUser.jobPositionLabel,
      } : undefined
    ),
    [userOptionsRaw, effectiveEditingUser, divisionValue]
  );
  const userLookup = React.useMemo(
    () => buildUserLookup(userData),
    [userData]
  );
  const skuUserOptions = React.useMemo(
    () => getOptionsWithSelected(
      skuUserOptionsRaw,
      effectiveEditingUser?.sku && String(skuDivisionValue) === String(effectiveEditingUser.sku.divisionId) ? {
        id: effectiveEditingUser.sku.staffId,
        name: effectiveEditingUser.sku.staffName,
        position: effectiveEditingUser.sku.jobPositionLabel,
      } : undefined
    ),
    [skuUserOptionsRaw, effectiveEditingUser, skuDivisionValue]
  );
  const skuUserLookup = React.useMemo(
    () => buildUserLookup(skuUserData),
    [skuUserData]
  );

  const { addUser, editUser } = useModalConsentSheetStore(
    useShallow((state) => ({
      addUser: state.addUser,
      editUser: state.editUser,
    }))
  );

  const appendUser = React.useCallback((user: ConsentSheetListUser) => (
    addUser(sectionId, { ...user, id: undefined })
  ), [addUser, sectionId]);

  const getOptionLabel = React.useCallback(
    (options: Dropdown[], value?: string) => (
      options.find((option) => String(option.value) === String(value ?? ''))?.label
    ),
    []
  );

  const mapFormValuesToConsentUser = React.useCallback(
    (values: ConsentSheetSigningFormValues): ConsentSheetListUser => {
      const userDetail = userLookup[String(values.staff)];
      const roleLabel = getOptionLabel(roleOptions, values.consentRole);
      const directorateLabel = getOptionLabel(directorateOptions, values.directorate);
      const divisionLabel = getOptionLabel(divisionOptions, values.division);
      const staffName =
        values.staffName ||
        userDetail?.fullName ||
        getOptionLabel(userOptions, values.staff);
      const jobPositionLabel = userDetail?.roleRefactor?.name ?? values.jobPositionLabel ?? '';
      const staffId = parseNumericValue(userDetail?.userId ?? values.staff);

      const skuDirectorateLabel = getOptionLabel(directorateOptions, values.skuDirectorate);
      const skuDivisionLabel = getOptionLabel(skuDivisionOptions, values.skuDivision);
      const skuUserDetail = skuUserLookup[String(values.skuStaff)];
      const skuStaffName =
        values.skuStaffName ||
        skuUserDetail?.fullName ||
        getOptionLabel(skuUserOptions, values.skuStaff);
      const skuJobPositionLabel = skuUserDetail?.roleRefactor?.name ?? values.skuJobPositionLabel ?? '';
      const skuStaffId = parseNumericValue(skuUserDetail?.userId ?? values.skuStaff);

      const skuPayload = values.hasSku ? {
        directorateId: values.skuDirectorate || undefined,
        directorateLabel: skuDirectorateLabel,
        divisionId: values.skuDivision || undefined,
        divisionLabel: skuDivisionLabel,
        jobPositionLabel: skuJobPositionLabel || undefined,
        skuDate: values.skuDate || undefined,
        skuNo: values.skuNo || undefined,
        staffId: skuStaffId,
        staffName: skuStaffName,
      } : undefined;

      return {
        consentRole: values.consentRole || undefined,
        consentRoleLabel: roleLabel,
        directorateId: values.directorate || undefined,
        directorateLabel,
        divisionId: values.division || undefined,
        divisionLabel,
        jobPositionLabel: jobPositionLabel || undefined,
        sku: skuPayload,
        staffId,
        staffName,
      };
    },
    [
      directorateOptions,
      divisionOptions,
      getOptionLabel,
      roleOptions,
      skuDivisionOptions,
      skuUserLookup,
      skuUserOptions,
      userLookup,
      userOptions,
    ]
  );

  const editingUserLocalId = effectiveEditingUser?.localId ?? editingUser?.localId;

  React.useEffect(() => {
    if (!effectiveEditingUser) {
      setSelectedRole('');
      return;
    }

    const roleCode = getRoleCodeFromJobPosition(effectiveEditingUser.jobPositionLabel ?? '');
    setSelectedRole(roleCode);
  }, [effectiveEditingUser]);

  const isKadiv = selectedRole === 'KADIV';
  const isBOD = selectedRole === 'BOD';

  const handleSaveUser = React.useCallback((values: ConsentSheetSigningFormValues) => {
    const formattedSkuDate = values.skuDate ? dayjs(values.skuDate).format('YYYY-MM-DD') : undefined;

    const formattedValues = {
      ...values,
      skuDate: formattedSkuDate,
    };
    const payload = mapFormValuesToConsentUser(formattedValues);
    if (editingUserLocalId) {
      editUser(sectionId, editingUserLocalId, payload);
    } else {
      appendUser(payload);
    }
    closeNiceModal(MODAL.RISALAH_RAPAT.CONSENT_SHEET_USER);
  }, [
    appendUser,
    editUser,
    editingUserLocalId,
    mapFormValuesToConsentUser,
    sectionId,
  ]);

  const resetStaffField = React.useCallback(() => {
    setValue('staff', '', { shouldDirty: false, shouldValidate: true });
    setValue('jobPositionLabel', '', { shouldDirty: false });
    setSelectedRole('');
  }, [setValue]);

  const resetSkuStaffField = React.useCallback(() => {
    setValue('skuStaff', '', { shouldDirty: false, shouldValidate: true });
    setValue('skuJobPositionLabel', '', { shouldDirty: false });
  }, [setValue]);

  const resetDivisionAndStaff = React.useCallback(() => {
    setValue('division', '', { shouldDirty: false, shouldValidate: true });
    resetStaffField();
    setSelectedRole('');
  }, [resetStaffField, setValue]);

  const resetSkuDivisionAndStaff = React.useCallback(() => {
    setValue('skuDivision', '', { shouldDirty: false, shouldValidate: true });
    resetSkuStaffField();
  }, [resetSkuStaffField, setValue]);

  const syncJobPositionFromStaff = React.useCallback((staffId: string) => {
    const detail = userLookup[String(staffId)];
    setValue('jobPositionLabel', detail?.roleRefactor?.name ?? '', { shouldDirty: false });
    setSelectedRole(detail?.roleRefactor?.roleCode ?? '');
  }, [setValue, userLookup]);

  const syncSkuJobPositionFromStaff = React.useCallback((staffId: string) => {
    const detail = skuUserLookup[String(staffId)];
    setValue('skuJobPositionLabel', detail?.roleRefactor?.name ?? '', { shouldDirty: false });
  }, [setValue, skuUserLookup]);

  const resetForm = React.useCallback(() => reset(DEFAULT_VALUES), [reset]);

  const isEditing = Boolean(editingUserLocalId);

  const { data: skuData, isLoading: isSkuLoading, isFetching: isSkuFetching } = useGetSkuInformation(
    {
      bucketProcessId: processId,
      module: 'RISALAH_RAPAT',
      process: 'RISALAH_RAPAT',
      staff: staffValue || '',
    },
    {
      enabled: Boolean(processId && staffValue && (isKadiv || isBOD) && !isEditing),
    }
  );

  // Autofill SKU fields when SKU data is fetched
  React.useEffect(() => {
    if (!skuData?.content || isEditing) return;

    const sku = skuData.content;

    if (hasSku || skuData) {
      setValue('hasSku', true, { shouldDirty: false });
      setValue('skuDirectorate', sku.directorateId ? String(sku.directorateId) : '', { shouldDirty: false });
      setValue('skuDivision', sku.divisionId ? String(sku.divisionId) : '', { shouldDirty: false });
      setValue('skuStaff', sku.staffId ? String(sku.staffId) : '', { shouldDirty: false });
      setValue('skuStaffName', sku.staffName || '', { shouldDirty: false });
      setValue('skuJobPositionLabel', sku.jobPositionLabel || '', { shouldDirty: false });
      setValue('skuNo', sku.skuNo || '', { shouldDirty: false });
      setValue('skuDate', sku.skuDate || '', { shouldDirty: false });
    }
  }, [skuData, isEditing, setValue, hasSku]);

  return {
    control,
    directorateOptions,
    divisionOptions,
    formState,
    handleSaveUser,
    handleSubmit,
    hasSku,
    isBOD,
    isDivisionDisabled: !directorateValue,
    isEditing,
    isKadiv,
    isSkuDivisionDisabled: !skuDirectorateValue,
    isSkuFetching,
    isSkuLoading: isSkuLoading || isUserDetailLoading || isUserDetailFetching,
    isSkuStaffDisabled: !skuDivisionValue,
    isStaffDisabled: !divisionValue,
    resetDivisionAndStaff,
    resetForm,
    resetSkuDivisionAndStaff,
    resetSkuStaffField,
    resetStaffField,
    roleOptions,
    setDirSearch,
    setDivSearch,
    setSkuUserSearch,
    setUserSearch,
    setValue,
    skuDivisionOptions,
    skuUserOptions,
    syncJobPositionFromStaff,
    syncSkuJobPositionFromStaff,
    userOptions,
  };
};

export default useModalConsentSheetSigning;
