import * as React from 'react';

import dayjs from 'dayjs';
import { useWatch, type Control } from 'react-hook-form';

import { TypeModule, TypeProcess } from '@/enums/Module';
import showNiceModalV2 from '@/helpers/showNiceModalV2';
import useGetAllDirectorate from '@/hooks/services/useGetAllDirectorate';
import useSearchAllDivision from '@/hooks/services/useSearchAllDivision';
import useSearchAllUser from '@/hooks/services/useSearchUser';
import useAutoSaveDraft from '@/hooks/useAutoSaveDraft';
import closeNiceModal from '@/hooks/useCloseNiceModal';
import useIdentity from '@/hooks/useIdentity';

import { MODAL_ID } from '../../CommitteeMeeting.constant';
import useGetMeetingMemberDetail from '../../hooks/useGetMeetingMemberDetail';
import useSaveMeetingMember from '../../hooks/useSaveMeetingMember';


const mapToOptions = (
  data: any,
  keys: { label?: string; value?: string } = { label: 'name', value: 'id' }
): any[] => {
  const contents = data?.contents ?? [];
  return contents.reduce((options: any[], item: any) => {
    const rawValue = item?.[keys.value ?? 'id'];
    if (rawValue === undefined || rawValue === null || rawValue === '') return options;

    options.push({
      id: String(rawValue),
      jobTitle: item?.roleRefactor?.name ?? item?.jobPositionLabel,
      label: item?.[keys.label ?? 'name'] ?? '',
      roleCode: item?.roleRefactor?.roleCode ?? '',
      value: String(rawValue),
    });

    return options;
  }, []);
};

const toNumber = (value?: string | number | boolean) => {
  const parsedValue = Number(value);
  return Number.isNaN(parsedValue) ? undefined : parsedValue;
};

// Helper function untuk mendapatkan roleCode dari position
const getRoleCodeFromPosition = (position: string): string => {
  const positionLower = position?.toLowerCase() || '';

  if (positionLower.includes('kepala divisi')) return 'KADIV';
  if (positionLower.includes('team leader')) return 'TL';
  if (positionLower.includes('direktur')) return 'BOD';
  if (positionLower.includes('staff')) return 'STAFF';

  return '';
};

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
      roleCode: getRoleCodeFromPosition(selectedUser.position),
      value: selectedId,
    },
    ...options
  ];
};

type UseModalMemberParams = {
  control: Control<any>;
  id: string | number;
};

const useModalMember = ({ control, id: memberId }: UseModalMemberParams) => {
  const { processId } = useIdentity();

  const directorateId = useWatch({ control, name: 'directorateId' });
  const divisionId = useWatch({ control, name: 'divisionId' });
  const skuDirectorateId = useWatch({ control, name: 'skuMember.directorateId' });
  const skuDivisionId = useWatch({ control, name: 'skuMember.divisionId' });

  const [userSearch, setUserSearch] = React.useState('');
  const [skuUserSearch, setSkuUserSearch] = React.useState('');
  const [divSearch, setDivSearch] = React.useState('');
  const [dirSearch, setDirSearch] = React.useState('');
  const [selectedRole, setSelectedRole] = React.useState<string>('');

  const { data: directorateOptions = [], isFetching: isDirectorateLoading } = useGetAllDirectorate(
    { value: dirSearch || '' },
    {
      select: (data) => mapToOptions(data),
    }
  );

  const { data: divisionOptions = [], isFetching: isDivisionLoading } = useSearchAllDivision(
    { directorateCode: directorateId, value: divSearch || '' },
    {
      enabled: !!directorateId,
      select: (data) => mapToOptions(data),
    }
  );

  const { data: skuDivisionOptions = [], isFetching: isSkuDivisionLoading } = useSearchAllDivision(
    { directorateCode: skuDirectorateId, value: divSearch || '' },
    {
      enabled: !!skuDirectorateId,
      select: (data) => mapToOptions(data),
    }
  );

  const { data: staffOptionsRaw = [], isFetching: isStaffLoading } = useSearchAllUser(
    { division: divisionId, value: userSearch || '' },
    {
      enabled: !!divisionId,
      // @ts-expect-error
      select: (data) => mapToOptions(data, { label: 'fullName', value: 'userId' }),
    }
  );

  const { data: skuStaffOptionsRaw = [], isFetching: isSkuStaffLoading } = useSearchAllUser(
    { division: skuDivisionId, role: 'KADIV', value: skuUserSearch || '' },
    {
      enabled: !!skuDivisionId,
      // @ts-expect-error
      select: (data) => mapToOptions(data, { label: 'fullName', value: 'userId' }),
    }
  );

  const { data: memberDetailData, isLoading: isMemberDetailLoading } = useGetMeetingMemberDetail({
    id: toNumber(memberId),
  });

  const staffOptions = React.useMemo(() => {
    return getOptionsWithSelected(
      (staffOptionsRaw as any),
      memberDetailData ? {
        id: memberDetailData.staff,
        name: memberDetailData.name,
        position: memberDetailData.position,
      } : undefined
    );
  }, [staffOptionsRaw, memberDetailData]);

  const skuStaffOptions = React.useMemo(() => {
    return getOptionsWithSelected(
      (skuStaffOptionsRaw as any),
      memberDetailData?.skuMember ? {
        id: memberDetailData.skuMember.staffId,
        name: memberDetailData.skuMember.staffName,
        position: memberDetailData.skuMember.jobPositionLabel,
      } : undefined
    );
  }, [skuStaffOptionsRaw, memberDetailData]);

  const { mutate: saveMeetingMember, isPending: isSaving } = useSaveMeetingMember({
    onError: (error) => {
      const message = error?.response?.data?.errorDetail;

      showNiceModalV2({
        title: message ?? 'Terjadi kesalahan, silahkan dicoba kembali',
        type: 'error',
      });
    },
    onSuccess: () => {
      showNiceModalV2({
        title: 'Data berhasil disimpan',
        type: 'success',
      });
      closeNiceModal(MODAL_ID.MODAL_MEMBER);
    },
  });

  const handleSave = React.useCallback((values: any) => {
    saveMeetingMember({
      bucketProcessId: processId,
      directorateId: values.directorateId,
      divisionId: values.divisionId,
      id: toNumber(memberId),
      isPresent: values.isPresent,
      module: TypeModule.RISALAH_RAPAT,
      process: TypeProcess.RISALAH_RAPAT,
      skuMember: values.hasSku ? {
        directorateId: values.skuMember.directorateId,
        divisionId: values.skuMember.divisionId,
        skuDate: dayjs(values.skuMember.skuDate).format('YYYY-MM-DD'),
        skuNo: values.skuMember.skuNo,
        staffId: toNumber(values.skuMember.staffId),
      } : undefined,
      staff: toNumber(values.staff),
    });
  }, [processId, saveMeetingMember, memberId]);

  const watchedValues = useWatch({ control });

  const autoSavePayload = React.useMemo(() => () => {
    if (!watchedValues.staff || !watchedValues.directorateId) return Promise.resolve(null);

    return Promise.resolve({
      bucketProcessId: processId,
      directorateId: watchedValues.directorateId,
      divisionId: watchedValues.divisionId,
      id: toNumber(memberId),
      isPresent: watchedValues.isPresent,
      module: TypeModule.RISALAH_RAPAT,
      process: TypeProcess.RISALAH_RAPAT,
      skuMember: watchedValues.hasSku ? {
        directorateId: watchedValues.skuMember?.directorateId,
        divisionId: watchedValues.skuMember?.divisionId,
        skuDate: watchedValues.skuMember?.skuDate ? dayjs(watchedValues.skuMember.skuDate).format('YYYY-MM-DD') : '',
        skuNo: watchedValues.skuMember?.skuNo,
        staffId: toNumber(watchedValues.skuMember?.staffId),
      } : undefined,
      staff: toNumber(watchedValues.staff),
    });
  }, [watchedValues, processId, memberId]);

  const { isFetching: isAutoSaveFetching } = useAutoSaveDraft({
    isActive: !!memberId && memberId !== 0 && !!memberDetailData,
    payload: autoSavePayload,
    url: 'agreement.add.saveMeet',
  });

  return {
    directorateOptions,
    divisionOptions,
    getRoleCodeFromPosition,
    handleSave,
    isAutoSaveFetching,
    isLoading: isMemberDetailLoading || isDirectorateLoading || isDivisionLoading ||
      isStaffLoading || isSkuDivisionLoading || isSkuStaffLoading || isSaving,
    memberDetailData,
    selectedRole,
    setDirSearch,
    setDivSearch,
    setSelectedRole,
    setSkuUserSearch,
    setUserSearch,
    skuDivisionOptions,
    skuStaffOptions,
    staffOptions,
  };
};

export default useModalMember;
