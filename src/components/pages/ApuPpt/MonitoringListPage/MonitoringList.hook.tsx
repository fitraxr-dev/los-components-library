import React, { useEffect, useState } from 'react';

import NiceModal from '@ebay/nice-modal-react';

import { roles } from '@/configs/constants';
import { MODAL } from '@/configs/constants/modalId';
import { apuPpt } from '@/configs/constants/pathname';
import { TypeModule, TypeProcess } from '@/enums/Module';
import { formatDate } from '@/helpers/date';
import { replacePath } from '@/helpers/navigation';
import useGetBucketList from '@/hooks/services/useGetBucketList';
import useGetParameterList from '@/hooks/services/useGetParameterList';
import useApp from '@/hooks/useApp';
import useCustomRouter from '@/hooks/useCustomRouter';
import useSessionStorage from '@/hooks/useSessionStorage';

import { useApuPptContext } from '@/components/layouts/ApuPptLayout/ApuPpt.context';
import Button from '@/components/shared/Button';
import ColumnWrapper from '@/components/shared/ColumnWrapper';
import TextStyle from '@/components/shared/TextStyle';

import { tableHeaderList } from './MonitoringList.constants';

import type { Task } from './MonitoringList.types';
import type { TableHeader } from '@/components/shared/Table/Table.types';


const useMonitoringList = () => {
  const router = useCustomRouter();
  const { isDpopDivision } = useApuPptContext();

  const [filter, setFilter] = useSessionStorage('filter-component-apuppt-monitoring', null);
  const [selected, setSelected] = useState<Array<Task>>([]);
  const [noPage, setNoPage] = useState(1);
  const [itemPerPage, setItemPerPage] = useState(5);
  const [divisionId, setDivisionId] = useState('');
  const [{ currentRole }] = useApp();
  const isChecker = currentRole?.includes(roles.CHECKER);

  const statusOptions = useGetParameterList('apuPptDpopStatusFilter', { label: 'value1', value: 'value2' });
  const statusHighRiskOptions = useGetParameterList('hrStatusFilter', { label: 'value1', value: 'value2' });
  const divisionOptions = useGetParameterList('apuPptDivisionFilter');
  const searchByOptions = useGetParameterList(isDpopDivision ? 'searchByApuPptDpop' : 'searchByApuPpt', {
    label: 'value1',
    value: 'value2',
  });
  const sortByOptions = useGetParameterList('sortByApuPpt', {
    label: 'value1',
    value: 'value2',
  });

  const { data, isLoading } = useGetBucketList({
    filter: {
      ...filter?.filter,
      module: TypeModule.APU_PPT,
      process: TypeProcess.APU_PPT_DPOP,
    },
    page: {
      itemPerPage,
      noPage,
    },
    searchDetail: filter?.searchDetail ?? { key: '', value: '' },
    sortList: filter?.sortList ?? undefined,
  });

  const tableData = data?.contents.map((item) => ({
    ...item,
    aging: item.aging ?? '-',
    id: item.bucketProcessId ?? '-',
    pic: item.pic.map((pic) => ({
      ...pic,
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
    staffName: item.staffName ?? '-',
    status: item.statusLabel?.split('|')[0] ?? '-',
    statusHighRisk: item.statusLabel?.split('|')[1] ?? '-',
  }));

  const tablePage = data?.page;

  useEffect(() => {
    setNoPage(1);
  }, [filter]);

  const handleOpenReassignModal = () => {
    NiceModal.show(MODAL.REASSIGN_TO, {
      divisionId,
      module: TypeModule.APU_PPT,
      process: TypeProcess.APU_PPT_DPOP,
      selectedTask: selected,
      setSelectedTask: setSelected,
    });
  };

  const tableHeader: TableHeader[] = [
    ...(isChecker ? [] : [{
      isDisabled: () => false,
      isSelected: (data) => selected.some((item) => item.id === data.id),
      key: 'checkbox',
      onSelectChange: (data) => {
        setDivisionId(data.divisionId);
        if (selected.some((item) => item.id === data.id)) {
          setSelected(selected.filter((item) => item.id !== data.id));
        } else {
          setSelected([
            ...selected, data].sort(
            (a: Task, b: Task) => new Date(a.createdAt).valueOf() - new Date(b.createdAt).valueOf()
          ));
        }
      },
      sx: { minWidth: '3.6vw' },
      type: 'checkbox' as const,
    }]),
    ...tableHeaderList,
    {
      key: 'pic',
      label: 'PIC',
      render: (row) => (
        <ColumnWrapper>
          {row?.pic?.map((item, idx: number) => {
            return (
              <TextStyle key={idx} weight={item.isLeader ? 600 : 400}>
                {item.name}
              </TextStyle>
            );
          })}
        </ColumnWrapper>
      ),
      sx: {
        minWidth: '7vw',
      },
    },
    {
      key: 'modifiedAt',
      label: 'Created Date',
      render: (row) => React.createElement(TextStyle, { variant: 'body4' }, row.modifiedAt !== null ? formatDate(row.modifiedAt, 'DD MMM YYYY, HH:mm:ss') : formatDate(row.createdAt, 'DD MMM YYYY, HH:mm:ss')),
      sx: { minWidth: '10vw' },
      type: 'date',
    },
    {
      key: 'dueDate',
      label: 'Due Date',
      sx: { minWidth: '10vw' },
      type: 'date',
    },
    {
      key: 'aging',
      label: 'Aging',
      sx: { minWidth: '10vw' },
    },
    {
      key: 'status',
      label: 'Status Assesment APU PPT / Pengkinian Data',
      sx: { minWidth: '16vw' },
      type: 'status',
    },
    {
      key: 'statusHighRisk',
      label: 'Status High Risk',
      render: (row) => (
        <Button variant="outlined" sx={{ px: 1, py: 0.5 }} textVariant="body4">
          {row.statusHighRisk}
        </Button>
      ),
      sx: { minWidth: '15vw' },
    },
    {
      key: 'action',
      label: 'Action',
      options: [
        {
          iconName: 'detail', onClick: (data) => {
            router.push(
              replacePath(
                apuPpt.MONITORING_DEBTOR_INFORMATION_PAGE,
                {
                  processId: data?.id,
                },
              ),
            );
          },
        },
      ],
      sx: { minWidth: '6vw' },
      type: 'action',
    },
  ];

  const filterDropdownList = searchByOptions.data;

  const filterContentList = [
    {
      key: 'sortList',
      label: 'Urutkan Berdasarkan',
      options: sortByOptions.data,
      type: 'sort',
    },
    {
      endKey: 'endDate',
      label: 'Periode Created Date',
      startKey: 'startDate',
      type: 'period',
    },
    {
      endKey: 'endDateDue',
      label: 'Due Date',
      startKey: 'startDateDue',
      type: 'period',
    },
    {
      endKey: 'endAging',
      label: 'Aging',
      startKey: 'startAging',
      type: 'textPeriod',
    },
    {
      key: 'division',
      label: 'Divisi',
      options: divisionOptions.data,
      type: 'multiple-autocomplete',
    },
    {
      key: 'status',
      label: 'Status',
      options: statusOptions.data,
      type: 'multiple-autocomplete',
    },
    {
      key: 'otherStatus',
      label: 'Status High Risk',
      options: statusHighRiskOptions?.data,
      type: 'multiple-autocomplete',
    },
  ];

  return {
    filter,
    filterContentList,
    filterDropdownList,
    handleOpenReassignModal,
    isLoading,
    noPage,
    selected,
    setFilter,
    setItemPerPage,
    setNoPage,
    tableData,
    tableHeader,
    tablePage,
  };
};

export default useMonitoringList;
