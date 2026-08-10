'use client';
import { useEffect, useMemo, useRef, useState } from 'react';

import NiceModal from '@ebay/nice-modal-react';

import {
  BUSINESS_DIVISION,
  DPB_DIVISION,
  DPPU_1_DIVISION,
  DPPU_3_DIVISION,
  DUS_DIVISION,
  roles,
  SECOND_FINANCING_DIVISION,
} from '@/configs/constants/general';
import { MODAL } from '@/configs/constants/modalId';
import { ActivityType } from '@/enums/Activity';
import { TypeModule, TypeProcess } from '@/enums/Module';
import { formatDateTime } from '@/helpers/date';
import showNiceModalV2 from '@/helpers/showNiceModalV2';
import useGetParameterList from '@/hooks/services/useGetParameterList';
import useApp from '@/hooks/useApp';
import useCustomRouter from '@/hooks/useCustomRouter';
import useDivision from '@/hooks/useDivision';
import useRecordLog from '@/hooks/useRecordLog';
import setPreviewPage from '@/hooks/useSetPreviewPage';

import ColumnWrapper from '@/components/shared/ColumnWrapper';
import PICRenderer from '@/components/shared/SmiSection/PICRenderer';
import TextStyle from '@/components/shared/TextStyle';

import useGetDivisionList from './hooks/useGetDivisionList';
import useGetProcessList from './hooks/useGetProcessList';
import useGetProcessMonitoringList from './hooks/useGetProcessMonitoringList';
import useGetStatusList from './hooks/useGetStatusList';

import type { SearchValue } from '@/components/shared/Input/components/Search/Search.types';
import type { Task } from '@/components/shared/SmiModal/ModalReassign/ModalReassign.types';
import type { TableHeader } from '@/components/shared/Table/Table.types';


export const useList = () => {
  const router = useCustomRouter();
  const { divisionCode } = useDivision();
  const { recordActivity } = useRecordLog();
  const [{ currentRole, currentPosition }] = useApp();
  const [filter, setFilter] = useState<SearchValue>({
    filter: {},
    searchDetail: { key: '', value: '' },
    sortList: undefined,
  });
  const [appliedFilter, setAppliedFilter] = useState<SearchValue>({
    filter: {},
    searchDetail: { key: '', value: '' },
    sortList: undefined,
  });
  // State untuk tracking selected values real-time (sebelum Apply)
  const [realTimeDivision, setRealTimeDivision] = useState<string[]>([]);
  const [realTimeProcess, setRealTimeProcess] = useState<string[]>([]);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [state, setState] = useState();
  const [selectedTask, setSelectedTask] = useState<any[]>([]);
  const isStaff = currentRole.includes(roles.RM);
  const currentPositions = currentPosition[0];
  // Ref untuk menyimpan previous filter string untuk mencegah infinite loop
  const previousFilterStringRef = useRef<string>('');

  // Check if user is business division
  const businessDivisionArray = [
    BUSINESS_DIVISION,
    SECOND_FINANCING_DIVISION,
    DPB_DIVISION,
    DUS_DIVISION,
    DPPU_1_DIVISION,
    DPPU_3_DIVISION,
  ];
  const isBusinessDivision = businessDivisionArray.includes(divisionCode);

  const routeHandler = (row: any) => {
    if (row?.url) {
      const url = setPreviewPage(row?.url, 'monitoring');
      router.push(url);
    } else {
      showNiceModalV2({
        title: 'URL tidak ditemukan!',
        type: 'error',
      });
    }
  };


  // --- PARAMETER ---
  // Get Division filter options - always fetch (always has data)
  const { data: divisionOptions } = useGetDivisionList();

  // Get Process filter options - always fetch (BE handles if division not selected)
  // Fetch with division from real-time state to update dropdown options immediately
  const { data: processOptions } = useGetProcessList({ division: realTimeDivision });

  // Get Status filter options - only fetch if process is selected (null if process empty, not null if process selected)
  // Fetch with process from real-time state to update dropdown options immediately
  const { data: statusOptions } = useGetStatusList({ process: realTimeProcess });

  // Get statusOptions untuk process yang sudah di-apply (bukan real-time)
  // Ini digunakan untuk validasi status yang sudah di-apply
  const { data: appliedStatusOptions } = useGetStatusList({
    process: appliedFilter?.filter?.process && Array.isArray(appliedFilter.filter.process)
      ? appliedFilter.filter.process
      : [],
  });

  // Validasi dan reset status yang tidak valid saat process atau statusOptions berubah
  // Hanya validasi di appliedFilter, bukan di filter (karena filter hanya berubah saat Apply)
  // Hanya validasi menggunakan statusOptions dari process yang sudah di-apply
  useEffect(() => {
    const currentStatus = appliedFilter?.filter?.status;
    const appliedProcess = appliedFilter?.filter?.process;
    const appliedProcessArray = appliedProcess && Array.isArray(appliedProcess) ? appliedProcess : [];

    // Jika process kosong, hapus semua status dari appliedFilter
    if (appliedProcessArray.length === 0) {
      if (currentStatus && Array.isArray(currentStatus) && currentStatus.length > 0) {
        setAppliedFilter((prev) => {
          // Guard: hanya update jika status masih ada
          if (prev?.filter?.status && Array.isArray(prev.filter.status) && prev.filter.status.length > 0) {
            const newFilter = { ...prev.filter };
            delete newFilter.status;
            return { ...prev, filter: newFilter };
          }
          return prev;
        });
      }
      return;
    }

    // Jika tidak ada status yang dipilih, tidak perlu validasi
    if (!currentStatus || !Array.isArray(currentStatus) || currentStatus.length === 0) {
      return;
    }

    // Validasi hanya menggunakan statusOptions dari process yang sudah di-apply
    // Bukan dari realTimeProcess (statusOptions)
    if (appliedStatusOptions && Array.isArray(appliedStatusOptions) && appliedStatusOptions.length > 0) {
      const validStatusValues = new Set(appliedStatusOptions.map((opt) => String(opt.value)));
      const currentStatusStrings = currentStatus.map(String);

      // Filter status yang valid
      const validStatuses = currentStatusStrings.filter((status) => validStatusValues.has(status));

      // Jika ada status yang tidak valid atau jumlah valid berbeda dengan yang dipilih
      if (validStatuses.length !== currentStatusStrings.length) {
        setAppliedFilter((prev) => {
          // Guard: hanya update jika status masih ada dan berbeda dengan yang valid
          const prevStatus = prev?.filter?.status;
          if (prevStatus && Array.isArray(prevStatus)) {
            const prevStatusStrings = prevStatus.map(String);
            const prevStatusSorted = [...prevStatusStrings].sort((a, b) => a.localeCompare(b)).join(',');
            const validStatusSorted = [...validStatuses].sort((a, b) => a.localeCompare(b)).join(',');

            // Hanya update jika benar-benar berbeda
            if (prevStatusSorted !== validStatusSorted) {
              const newFilter = { ...prev.filter };

              if (validStatuses.length === 0) {
                // Jika semua status tidak valid, hapus status
                delete newFilter.status;
              } else {
                // Jika ada yang valid, simpan hanya yang valid
                newFilter.status = validStatuses;
              }
              return { ...prev, filter: newFilter };
            }
          }
          return prev;
        });
      }
    }
  }, [appliedFilter?.filter?.process, appliedStatusOptions, appliedFilter?.filter?.status]);

  // Get Process Monitoring search by options
  const { data: searchByOptions } = useGetParameterList('searchByMonitoring', { label: 'value1', value: 'value2' });

  // Get Process Monitoring order by options
  const { data: orderByOptions } = useGetParameterList('sortByMonitoring', { label: 'value1', value: 'value2' });
  // --- END OF PARAMETER ---

  // Update appliedFilter when filter changes (after Apply button is clicked)
  // Only update if filter actually changed (not just reference)
  useEffect(() => {
    const filterString = JSON.stringify(filter);
    // Hanya update jika filter benar-benar berubah dari nilai sebelumnya
    if (filterString !== previousFilterStringRef.current) {
      previousFilterStringRef.current = filterString;
      setAppliedFilter(filter);
      // Update real-time state dengan applied values
      if (filter?.filter?.division) {
        const divisionValues = Array.isArray(filter.filter.division)
          ? filter.filter.division.map(String)
          : [];
        setRealTimeDivision(divisionValues);
      } else {
        setRealTimeDivision([]);
      }
      if (filter?.filter?.process) {
        const processValues = Array.isArray(filter.filter.process)
          ? filter.filter.process.map(String)
          : [];
        setRealTimeProcess(processValues);
      } else {
        setRealTimeProcess([]);
      }
    }
  }, [filter]);

  useEffect(() => {
    setSelectedTask([]);
  }, [filter]);

  // Memoize payload untuk menghindari re-fetch karena object reference berubah
  const payload = useMemo(() => ({
    filter: {
      ...appliedFilter?.filter,
    },
    page: {
      itemPerPage: pageSize,
      noPage: page,
    },
    searchDetail: appliedFilter?.searchDetail ?? { key: '', value: '' },
    sortList: appliedFilter?.sortList ?? undefined,
  }), [appliedFilter, pageSize, page]);

  const { data: processMonitoringData, isFetching: isLoading } = useGetProcessMonitoringList(payload);

  const tablePage = processMonitoringData?.page || { totalItem: 0, totalPage: 0 };
  const tableData = processMonitoringData?.contents?.map((item: any) => {

    const comitmentValue = item.commitment || '-';
    const currencyComitment = item.currency || '';

    return {
      ...item,
      aging: item?.aging ?? '-',
      commitment: `${currencyComitment} ${comitmentValue}`,
      // dueDate: item?.dueDate ?? '-', // TODO: Check if '-' is correct for date type
      id: item?.bucketProcessId,
      pic: item.pic.map((content) => ({
        ...content,
        reAssignTo: {
          directorate: null,
          division: null,
          endDate: null,
          id: null,
          isPermanent: false,
          jobPosition: null,
          name: null,
          picId: null,
          startDate: null,
        },
        taskId: item.bucketProcessId,
      })),
    };
  });


  useEffect(() => {
    setPage(1);
  }, [filter]);

  const handleSelectTask = (data: any) => {
    if (selectedTask.length >= 5 && !selectedTask.some((item) => item.id === data.id)) {
      NiceModal.show(MODAL.GLOBAL.WARNING, {
        title: 'Assignment  Maximum 5 Task',
      });
      return;
    }
    if (selectedTask.some((item) => item.id === data.id)) {
      setSelectedTask(selectedTask.filter((item) => item.id !== data.id));
    } else {
      setSelectedTask([
        ...selectedTask, data]
        .sort(
          (a: Task, b: Task) => new Date(a.createdAt).valueOf() - new Date(b.createdAt).valueOf()
        ));
    }
  };

  const handleClickReassignTo = () => {
    NiceModal.show(MODAL.REASSIGN_TO, {
      divisionId: divisionCode,
      isMonitoring: true,
      isRiviewAssign: true,
      module: TypeModule.MONITORING,
      process: TypeProcess.MONITORING,
      selectedTask,
      setSelectedTask,
    });
  };

  const tableHeader: TableHeader[] = [
    {
      isDisabled: (data) => {
        return !data.isAssignable;
      },
      isSelected: (data) => selectedTask.some((item) => item.id === data.id),
      key: 'checkbox',
      onSelectChange: handleSelectTask,
      sx: { width: '4%' },
      type: 'checkbox',
    },
    {
      key: 'index',
      label: 'No',
      sx: { minWidth: '1vw' },
      type: 'index',
    },
    {
      key: 'bucketMasterId',
      label: 'Master ID',
      sx: { minWidth: '7.5vw' },
    },
    {
      key: 'bucketProcessId',
      label: 'ID',
      sx: { minWidth: '7.5vw' },
    },
    {
      key: 'commitment',
      label: 'Komitmen',
      sx: { minWidth: '12vw' },
    },
    {
      key: 'institutionTypeLabel',
      label: 'Tipe Institusi',
      sx: { minWidth: '10vw' },
    },
    {
      key: 'debtorName',
      label: 'Nama Customer',
      sx: { minWidth: '10vw' },
    },
    {
      key: 'divisionLabel',
      label: 'Divisi',
      sx: { minWidth: '10vw' },
    },
    {
      key: 'staffName',
      label: 'Nama Staff',
      sx: {
        minWidth: '10vw',
      },
    },
    {
      key: 'pic',
      label: 'PIC',
      render: (row) => {
        const picList = row?.pic;
        const isFromSku = row?.isFromSku === true;

        if (!picList || !Array.isArray(picList) || picList.length === 0) {
          return <TextStyle>-</TextStyle>;
        }

        return (
          <ColumnWrapper>
            {picList.map((item) => {
              const uniqueKey = item.picId || item.id || item.name;
              const displayName = isFromSku
                ? (item?.prevName ?? '-')
                : (item?.name ?? '-');

              return (
                <TextStyle
                  key={uniqueKey}
                  weight={item?.isLeader ? 600 : 400}
                >
                  {displayName}
                </TextStyle>
              );
            })}
          </ColumnWrapper>
        );
      },
      sx: { minWidth: '10vw' },
    },
    {
      key: 'createdDate',
      label: 'Created Date',
      render: (data) => (
        <TextStyle variant="body5">
          {data?.createdDate ? formatDateTime(data?.createdDate) : '-'}
        </TextStyle>),
      sx: { minWidth: '13vw' },
    },
    {
      key: 'aging',
      label: 'Aging',
      sx: { minWidth: '6vw' },
    },
    {
      key: 'dueDate',
      label: 'Due Date',
      sx: { minWidth: '11vw' },
      type: 'date',
    },
    {
      key: 'processLabel',
      label: 'Proses',
      sx: { minWidth: '13vw' },
      type: 'status',
    },
    {
      key: 'statusLabel',
      label: 'Status',
      sx: { minWidth: '15vw' },
      type: 'status',
    },
    {
      key: 'action',
      label: 'Action',
      options: [
        {
          iconName: 'detail', onClick: (row) => {
            recordActivity({
              activity: ActivityType.VIEW,
              bucketProcessId: row?.bucketProcessId || '',
              module: 'MONITORING',
              process: 'PROCESS_MONITORING',
              remarks: `view process monitoring detail: ${row?.debtorName || 'N/A'} (ID: ${row?.bucketProcessId || 'N/A'})`,
            });
            routeHandler(row);
          },
        },
      ],
      sx: { minWidth: '6vw' },
      type: 'action',
    },
  ];

  const filterDropdownList = searchByOptions;

  const filterContentList = [
    {
      key: 'sortList',
      label: 'Urutkan Berdasarkan',
      options: orderByOptions,
      type: 'sort',
    },
    {
      endKey: 'endDate',
      label: 'Periode Created Date',
      placeholder1: 'Start Date',
      placeholder2: 'End Date',
      startKey: 'startDate',
      type: 'period',
    },
    {
      allowFutureDates: true,
      endKey: 'endDueDate',
      label: 'Due Date',
      placeholder1: 'Start Date',
      placeholder2: 'End Date',
      startKey: 'startDueDate',
      type: 'period',
    },
    {
      endKey: 'endAging',
      label: 'Aging',
      placeholder1: 'Start Aging',
      placeholder2: 'End Aging',
      startKey: 'startAging',
      type: 'textPeriod',
    },
    // Hide division filter jika bukan business division
    ...(isBusinessDivision ? [{
      key: 'division',
      label: 'Divisi',
      options: divisionOptions || [],
      type: 'multiple-autocomplete',
      watch: (value: string[]) => {
        // Update real-time state saat user memilih division
        const divisionValues = Array.isArray(value)
          ? value.map(String)
          : [];
        setRealTimeDivision(divisionValues);
      },
    }] : []),
    {
      key: 'process',
      label: 'Proses',
      options: processOptions || [],
      type: 'multiple-autocomplete',
      watch: (value: string[]) => {
        // Update real-time state saat user memilih process
        // JANGAN update filter di sini, filter hanya diupdate saat Apply diklik
        const processValues = Array.isArray(value)
          ? value.map(String)
          : [];
        setRealTimeProcess(processValues);

        // Jika process dikosongkan, hapus process dan status dari appliedFilter
        // Ini untuk memastikan payload tidak mengandung process yang sudah dihapus
        if (processValues.length === 0) {
          setAppliedFilter((prev) => {
            const newFilter = { ...prev.filter };
            let hasChanges = false;

            if (prev?.filter?.process) {
              delete newFilter.process;
              hasChanges = true;
            }
            if (prev?.filter?.status) {
              delete newFilter.status;
              hasChanges = true;
            }

            return hasChanges ? { ...prev, filter: newFilter } : prev;
          });
        }
      },
    },
    {
      isDisabled: realTimeProcess.length === 0,
      key: 'status',
      label: 'Status',
      options: statusOptions || [],
      type: 'multiple-autocomplete',
    },
  ];

  return {
    filter,
    filterContentList,
    filterDropdownList,
    handleClickReassignTo,
    isLoading,
    page,
    pageSize,
    selectedTask,
    setFilter,
    setPage,
    setPageSize,
    setState,
    state,
    tableData,
    tableHeader,
    tablePage,
  };
};
