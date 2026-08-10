'use client';

import { useState, useMemo, useEffect } from 'react';

import { roles } from '@/configs/constants/general';
import useGetProcessNonBusiness from '@/hooks/services/overview/success-rate/useGetProcessNonBusiness';
import useGetDataStaff from '@/hooks/services/overview/useGetDataStaff';
import useGetDataTeamLead from '@/hooks/services/overview/useGetDataTeamLead';
import useGetParameterList from '@/hooks/services/useGetParameterList';
import useSearchAllDivision from '@/hooks/services/useSearchAllDivision';
import useApp from '@/hooks/useApp';

import { useOverviewContext } from '@/components/layouts/OverviewLayout/Overview.context';
import useGetAllProcess from '@/components/pages/DashboardPage/hooks/useGetAllProces';


type FilterItem = {
  label: string;
  type: string;
  key?: string;
  optionsKey?: string;
  options?: any[] | null;
  watch?: (v: any) => void;
  isDisabled?: boolean;
};

const useCapacityOverviewFilter = ({
  localValue,
  onChangeValue,
}: {
  localValue: any;
  onChangeValue: (v: any) => void;
}) => {
  const [open, setOpen] = useState<HTMLElement | null>(null);
  const [divisionSearchValue, setDivisionSearchValue] = useState('');
  const [divisionType, setDivisionType] = useState<'bisnis' | 'non-bisnis'>('bisnis');
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

  const { data: bucketProcessList } = useGetProcessNonBusiness('capacity-overview');
  const allProcess = bucketProcessList?.contents?.map((data) => ({
    label: data?.label,
    value: data?.process,
  }));

  const { data: typeProcessDropdownList } = useGetParameterList('typeProcess');

  const setLocalValue = (e) => {
    const updateData = e?.filter || e;
    const normalizedData = {
      divisionId: Array.isArray(updateData?.divisionId) ? updateData.divisionId : [],
      orderType: Array.isArray(updateData?.orderType) ? updateData.orderType : [],
      periode: updateData?.periode ?? localValue.filter.periode,
      process: Array.isArray(updateData?.process) ? updateData.process : [],
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
          key: 'orderType',
          label: 'Tipe Proses',
          options: typeProcessDropdownList,
          type: 'multiple-autocomplete',
        },
        {
          key: 'process',
          label: 'Proses',
          options: allProcess,
          type: 'multiple-autocomplete',
        },
        {
          isDisabled: !isDivisionSelected,
          key: 'staffId',
          label: 'Nama Staff',
          options: staffOptions,
          type: 'multiple-autocomplete',
        },
      );
      return base;
    }

    if (isBusinessDivision) {
      if (isKadiv) {
        base.push(
          {
            key: 'orderType',
            label: 'Tipe Proses',
            options: typeProcessDropdownList,
            type: 'multiple-autocomplete',
          },
          {
            key: 'staffId',
            label: 'Nama Staff',
            options: staffOptions,
            type: 'multiple-autocomplete',
          },
        );
      }

      if (isTL) {
        base.push(
          {
            key: 'orderType',
            label: 'Tipe Proses',
            options: typeProcessDropdownList,
            type: 'multiple-autocomplete',
          },
          {
            key: 'staffId',
            label: 'Nama Staff',
            options: staffOptions,
            type: 'multiple-autocomplete',
          },
        );
      }
    }

    if (isNonBusinessDivision) {
      if (isKadiv) {
        base.push(
          {
            key: 'orderType',
            label: 'Tipe Proses',
            options: typeProcessDropdownList,
            type: 'multiple-autocomplete',
          },
          {
            key: 'process',
            label: 'Proses',
            options: allProcess,
            type: 'multiple-autocomplete',
          },
          {
            key: 'staffId',
            label: 'Nama Staff',
            options: staffOptions,
            type: 'multiple-autocomplete',
          },
        );
      }

      if (isTL) {
        base.push(
          {
            key: 'orderType',
            label: 'Tipe Proses',
            options: typeProcessDropdownList,
            type: 'multiple-autocomplete',
          },
          {
            key: 'process',
            label: 'Proses',
            options: allProcess,
            type: 'multiple-autocomplete',
          },
          {
            key: 'staffId',
            label: 'Nama Staff',
            options: staffOptions,
            type: 'multiple-autocomplete',
          },
        );
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
    typeProcessDropdownList,
    divisionOptions,
    divisionType,
    isDivisionSelected,
  ]);

  return {
    allProcess,
    contentList,
    divisionSearchValue,
    divisionType,
    handleClick,
    handleClose,
    open,
    setDivisionSearchValue,
    setDivisionType,
    setLocalValue,
    staffOptions,
    teamLeadOptions,
    typeProcessDropdownList,
  };
};

export default useCapacityOverviewFilter;
