'use client';

import { useState, useMemo, useEffect } from 'react';

import { roles } from '@/configs/constants/general';
import useGetDebtorLov from '@/hooks/services/overview/progress-rate/useGetDebtorLov';
import useGetProcessStatusList from '@/hooks/services/overview/progress-rate/useGetProcessStatusList';
import useGetProcessNonBusiness from '@/hooks/services/overview/success-rate/useGetProcessNonBusiness';
import useGetDataStaff from '@/hooks/services/overview/useGetDataStaff';
import useGetDataTeamLead from '@/hooks/services/overview/useGetDataTeamLead';
import useGetParameterList from '@/hooks/services/parameter/useGetParameterList';
import useSearchAllDivision from '@/hooks/services/useSearchAllDivision';
import useApp from '@/hooks/useApp';

import { useOverviewContext } from '@/components/layouts/OverviewLayout/Overview.context';


type FilterItem = {
  label: string;
  type: string;
  key?: string;
  startKey?: string;
  endKey?: string;
  optionsKey?: string;
  options?: any[] | null;
  watch?: (v: any) => void;
  isDisabled?: boolean;
};

const useProgressRateFilter = ({
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
  const [isProcessPreSelected, setIsProcessPreSelected] = useState(false);
  const [selectedProcesses, setSelectedProcesses] = useState<string[]>([]);

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

  const { data: bucketProcessList } = useGetProcessNonBusiness('progress-rate');
  const allProcess = bucketProcessList?.contents?.map((data) => ({
    label: data?.label,
    value: data?.process,
  }));

  const { data: statusOptions = []} = useGetProcessStatusList(
    { process: selectedProcesses },
  );
  const allStatus = statusOptions;
  const isProcessSelected = isProcessPreSelected;

  const { data: customerOptions = []} = useGetDebtorLov();

  const setLocalValue = (e) => {
    onChangeValue({
      ...localValue,
      filter: {
        ...localValue.filter,
        ...e,
      },
    });
  };

  const handleClick = (event) => {
    const divisionId = localValue?.filter?.divisionId;
    const hasExactlyOne = Array.isArray(divisionId) ? divisionId.length === 1 : !!divisionId;
    setIsDivisionPreSelected(hasExactlyOne);

    const process = localValue?.filter?.process;
    const procArray = Array.isArray(process) ? process : process ? [process] : [];
    setSelectedProcesses(procArray);
    setIsProcessPreSelected(procArray.length > 0);

    setOpen(event.currentTarget);
  };

  const handleClose = () => {
    setOpen(null);
  };

  const { data: sortByOptions } = useGetParameterList('sortByProgressRate', {
    label: 'value1',
    value: 'value2',
  });

  const isDivisionSelected = isDivisionPreSelected;

  const contentList = useMemo<FilterItem[]>(() => {
    const base: FilterItem[] = [];

    if (isMaker || isChecker || isDirektur || isInternalGuest) {
      base.push(
        {
          key: 'sortList',
          label: 'Urutkan Berdasarkan',
          options: sortByOptions,
          type: 'sort',
        },
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
          key: 'process',
          label: 'Proses',
          options: allProcess,
          type: 'multiple-autocomplete',
          watch: (value) => {
            const procArray = Array.isArray(value) ? value : value ? [value] : [];
            setSelectedProcesses(procArray);
            setIsProcessPreSelected(procArray.length > 0);
          },
        },
        {
          isDisabled: !isProcessSelected,
          key: 'status',
          label: 'Status',
          options: allStatus,
          type: 'multiple-autocomplete',
        },
        {
          endKey: 'endAging',
          label: 'Aging',
          startKey: 'startAging',
          type: 'textPeriod',
        },
        {
          key: 'debtorId',
          label: 'Nama Customer',
          options: customerOptions,
          type: 'multiple-autocomplete',
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
      );
      return base;
    }

    if (isBusinessDivision) {
      if (isKadiv) {
        base.push(
          {
            key: 'sortList',
            label: 'Urutkan Berdasarkan',
            options: sortByOptions,
            type: 'sort',
          },
          {
            key: 'process',
            label: 'Proses',
            options: allProcess,
            type: 'multiple-autocomplete',
            watch: (value) => {
              const procArray = Array.isArray(value) ? value : value ? [value] : [];
              setSelectedProcesses(procArray);
              setIsProcessPreSelected(procArray.length > 0);
            },
          },
          {
            isDisabled: !isProcessSelected,
            key: 'status',
            label: 'Status',
            options: allStatus,
            type: 'multiple-autocomplete',
          },
          {
            endKey: 'endAging',
            label: 'Aging',
            startKey: 'startAging',
            type: 'textPeriod',
          },
          {
            key: 'debtorId',
            label: 'Nama Customer',
            options: customerOptions,
            type: 'multiple-autocomplete',
          },
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
        );
      }

      if (isTL) {
        base.push(
          {
            key: 'sortList',
            label: 'Urutkan Berdasarkan',
            options: sortByOptions,
            type: 'sort',
          },
          {
            key: 'process',
            label: 'Proses',
            options: allProcess,
            type: 'multiple-autocomplete',
            watch: (value) => {
              const procArray = Array.isArray(value) ? value : value ? [value] : [];
              setSelectedProcesses(procArray);
              setIsProcessPreSelected(procArray.length > 0);
            },
          },
          {
            isDisabled: !isProcessSelected,
            key: 'status',
            label: 'Status',
            options: allStatus,
            type: 'multiple-autocomplete',
          },
          {
            endKey: 'endAging',
            label: 'Aging',
            startKey: 'startAging',
            type: 'textPeriod',
          },
          {
            key: 'debtorId',
            label: 'Nama Customer',
            options: customerOptions,
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

      if (isRM) {
        base.push(
          {
            key: 'sortList',
            label: 'Urutkan Berdasarkan',
            options: sortByOptions,
            type: 'sort',
          },
          {
            key: 'process',
            label: 'Proses',
            options: allProcess,
            type: 'multiple-autocomplete',
            watch: (value) => {
              const procArray = Array.isArray(value) ? value : value ? [value] : [];
              setSelectedProcesses(procArray);
              setIsProcessPreSelected(procArray.length > 0);
            },
          },
          {
            isDisabled: !isProcessSelected,
            key: 'status',
            label: 'Status',
            options: allStatus,
            type: 'multiple-autocomplete',
          },
          {
            endKey: 'endAging',
            label: 'Aging',
            startKey: 'startAging',
            type: 'textPeriod',
          },
          {
            key: 'debtorId',
            label: 'Nama Customer',
            options: customerOptions,
            type: 'multiple-autocomplete',
          },
        );
      }
    }

    if (isNonBusinessDivision) {
      if (isKadiv) {
        base.push(
          {
            key: 'sortList',
            label: 'Urutkan Berdasarkan',
            options: sortByOptions,
            type: 'sort',
          },
          {
            key: 'process',
            label: 'Proses',
            options: allProcess,
            type: 'multiple-autocomplete',
            watch: (value) => {
              const procArray = Array.isArray(value) ? value : value ? [value] : [];
              setSelectedProcesses(procArray);
              setIsProcessPreSelected(procArray.length > 0);
            },
          },
          {
            isDisabled: !isProcessSelected,
            key: 'status',
            label: 'Status',
            options: allStatus,
            type: 'multiple-autocomplete',
          },
          {
            endKey: 'endAging',
            label: 'Aging',
            startKey: 'startAging',
            type: 'textPeriod',
          },
          {
            key: 'debtorId',
            label: 'Nama Customer',
            options: customerOptions,
            type: 'multiple-autocomplete',
          },
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
        );
      }

      if (isTL) {
        base.push(
          {
            key: 'sortList',
            label: 'Urutkan Berdasarkan',
            options: sortByOptions,
            type: 'sort',
          },
          {
            key: 'process',
            label: 'Proses',
            options: allProcess,
            type: 'multiple-autocomplete',
            watch: (value) => {
              const procArray = Array.isArray(value) ? value : value ? [value] : [];
              setSelectedProcesses(procArray);
              setIsProcessPreSelected(procArray.length > 0);
            },
          },
          {
            isDisabled: !isProcessSelected,
            key: 'status',
            label: 'Status',
            options: allStatus,
            type: 'multiple-autocomplete',
          },
          {
            endKey: 'endAging',
            label: 'Aging',
            startKey: 'startAging',
            type: 'textPeriod',
          },
          {
            key: 'debtorId',
            label: 'Nama Customer',
            options: customerOptions,
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

      if (isRM) {
        base.push(
          {
            key: 'sortList',
            label: 'Urutkan Berdasarkan',
            options: sortByOptions,
            type: 'sort',
          },
          {
            key: 'process',
            label: 'Proses',
            options: allProcess,
            type: 'multiple-autocomplete',
            watch: (value) => {
              const procArray = Array.isArray(value) ? value : value ? [value] : [];
              setSelectedProcesses(procArray);
              setIsProcessPreSelected(procArray.length > 0);
            },
          },
          {
            isDisabled: !isProcessSelected,
            key: 'status',
            label: 'Status',
            options: allStatus,
            type: 'multiple-autocomplete',
          },
          {
            endKey: 'endAging',
            label: 'Aging',
            startKey: 'startAging',
            type: 'textPeriod',
          },
          {
            key: 'debtorId',
            label: 'Nama Customer',
            options: customerOptions,
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
    divisionOptions,
    allProcess,
    allStatus,
    customerOptions,
    isDivisionSelected,
    isProcessSelected,
    teamLeadOptions,
    staffOptions,
    divisionType,
  ]);

  return {
    allProcess,
    contentList,
    divisionOptions,
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
  };
};

export default useProgressRateFilter;
