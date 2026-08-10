'use client';

import { useState, useMemo } from 'react';

import dayjs from 'dayjs';

import { roles } from '@/configs/constants/general';
import useGetDataStaff from '@/hooks/services/overview/useGetDataStaff';
import useGetDataTeamLead from '@/hooks/services/overview/useGetDataTeamLead';
import useGetParameterList from '@/hooks/services/useGetParameterList';
import useSearchAllDivision from '@/hooks/services/useSearchAllDivision';
import useApp from '@/hooks/useApp';

import { useOverviewContext } from '@/components/layouts/OverviewLayout/Overview.context';


type FilterItem = {
  label: string;
  type: string;
  key?: string;
  optionsKey?: string;
  options?: any[] | null;
  watch?: (v: any) => void;
  isDisabled?: boolean;
};

const useAnnualReviewProgressFilter = ({
  localValue,
  onChangeValue,
}: {
  localValue: any;
  onChangeValue: (v: any) => void;
}) => {
  const [open, setOpen] = useState<HTMLElement | null>(null);
  const [divisionSearchValue, setDivisionSearchValue] = useState('');
  const [staffSearchValue, setStaffSearchValue] = useState('');
  const [teamLeadSearchValue, setTeamLeadSearchValue] = useState('');
  const [isDivisionPreSelected, setIsDivisionPreSelected] = useState(false);
  const [state] = useApp();
  const { isBusinessDivision, isNonBusinessDivision } = useOverviewContext();

  const isRM = state.currentRole.includes(roles.RM) || state.currentRole.includes(roles.STAFF);
  const isTL = state.currentRole.includes(roles.TL);
  const isKadiv = state.currentRole.includes(roles.KADIV);
  const isMaker = useMemo(() => state.currentRole.includes(roles.MAKER), [state.currentRole]);
  const isDirektur = useMemo(() => state.currentRole.includes(roles.BOD), [state.currentRole]);
  const isChecker = useMemo(() => state.currentRole.includes(roles.CHECKER), [state.currentRole]);
  const isInternalGuest = useMemo(() => state.currentPosition?.some((pos) => /internal.*guest/i.test(pos)), [state.currentPosition]);

  const { data: groupTypeDropdownList } = useGetParameterList('groupType');
  const { data: divisions = [], isFetching: isLoadingDivisions } = useSearchAllDivision({
    value: divisionSearchValue,
  });
  const divisionOptions = (divisions?.contents ?? []).map((d) => ({
    label: d?.name,
    value: d?.id,
  }));

  const { data: staff = [], isFetching: isLoadingstaff } = useGetDataStaff({
    value: staffSearchValue,
  });
  const staffOptions = (staff?.contents ?? []).map((d) => ({
    label: d?.fullName,
    value: d?.userId,
  }));

  const { data: teamLead = [], isFetching: isLoadingteamLead } = useGetDataTeamLead({
    value: teamLeadSearchValue,
  });
  const teamLeadOptions = (teamLead?.contents ?? []).map((d) => ({
    label: d?.fullName,
    value: d?.userId,
  }));

  const setLocalValue = (e) => {
    const updateData = e?.filter || e;
    const normalizedData = {
      divisionId: Array.isArray(updateData?.divisionId) ? updateData.divisionId : [],
      periode: updateData?.periode ?? dayjs().format('YYYY'),
      staffId: Array.isArray(updateData?.staffId) ? updateData.staffId : [],
      tlId: Array.isArray(updateData?.tlId) ? updateData.tlId : [],
    };
    onChangeValue({
      ...localValue,
      filter: normalizedData,
    });
  };

  const handleClick = (event) => {
    const divisionId = localValue?.filter?.divisionId;
    const hasExactlyOne = Array.isArray(divisionId) ? divisionId.length === 1 : !!divisionId;
    setIsDivisionPreSelected(hasExactlyOne);
    setOpen(event.currentTarget);
  };

  const handleClose = () => {
    setOpen(null);
    setStaffSearchValue('');
    setTeamLeadSearchValue('');
    setDivisionSearchValue('');
  };

  const isDivisionSelected = isDivisionPreSelected;

  const contentList = useMemo<FilterItem[]>(() => {
    const base: FilterItem[] = [];

    if (isMaker || isDirektur || isChecker || isInternalGuest) {
      base.push(
        {
          key: 'divisionId',
          label: 'Divisi',
          options: divisionOptions,
          type: 'multiple-autocomplete',
          watch: (value) => {
            const hasExactlyOne = Array.isArray(value) ? value.length === 1 : !!value;
            setIsDivisionPreSelected(hasExactlyOne);
          },
        },
        {
          isDisabled: !isDivisionSelected,
          key: 'tlId',
          label: 'Nama Team Leader',
          options: teamLeadOptions,
          type: 'multiple-autocomplete',
        },
        {
          isDisabled: !isDivisionSelected,
          key: 'staffId',
          label: 'Nama Staff',
          options: staffOptions,
          type: 'multiple-autocomplete',
        },
        {
          key: 'periode',
          label: 'Periode Tahun',
          type: 'year',
        }
      );
    }

    if (isBusinessDivision) {
      if (isKadiv) {
        base.push(
          {
            key: 'tlId',
            label: 'Nama Team Leader',
            options: teamLeadOptions,
            type: 'multiple-autocomplete',
          },
          {
            key: 'staffId',
            label: 'Nama Staff',
            options: staffOptions,
            type: 'multiple-autocomplete',
          },
          {
            key: 'periode',
            label: 'Periode Tahun',
            type: 'year',
          }
        );
      }

      if (isTL) {
        base.push(
          {
            key: 'staffId',
            label: 'Nama Staff',
            options: staffOptions,
            type: 'multiple-autocomplete',
          },
          {
            key: 'periode',
            label: 'Periode Tahun',
            type: 'year',
          }
        );
      }

      if (isRM) {
        base.push({
          key: 'periode',
          label: 'Periode Tahun',
          type: 'year',
        });
      }
    }

    return base;
  }, [
    isRM,
    isTL,
    isKadiv,
    isMaker,
    isChecker,
    isDirektur,
    isBusinessDivision,
    isNonBusinessDivision,
    groupTypeDropdownList,
    isDivisionSelected,
  ]);

  return {
    contentList,
    handleClick,
    handleClose,
    open,
    setLocalValue,
  };
};

export default useAnnualReviewProgressFilter;
