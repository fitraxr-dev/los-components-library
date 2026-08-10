import React, { useEffect, useState } from 'react';

import NiceModal from '@ebay/nice-modal-react';

import { DPOP_DIVISION } from '@/configs/constants';
import { MODAL } from '@/configs/constants/modalId';
import { apuPpt } from '@/configs/constants/pathname';
import { TypeModule, TypeProcess } from '@/enums/Module';
import { formatDate } from '@/helpers/date';
import { replacePath } from '@/helpers/navigation';
import useGetBucketListAssignment from '@/hooks/services/useGetBucketListAssignment';
import useGetParameterList from '@/hooks/services/useGetParameterList';
import useCustomRouter from '@/hooks/useCustomRouter';
import useSessionStorage from '@/hooks/useSessionStorage';

import { useApuPptContext } from '@/components/layouts/ApuPptLayout/ApuPpt.context';
import ColumnWrapper from '@/components/shared/ColumnWrapper';
import TextStyle from '@/components/shared/TextStyle';

import { tableHeaderList } from './AssignmentList.constants';

import type { TableHeader } from '@/components/shared/Table/Table.types';


export const useList = () => {
  const router = useCustomRouter();
  const { isDpopDivision } = useApuPptContext();

  const [filter, setFilter] = useSessionStorage('filter-component-apuppt-assignment', null);
  const [selected, setSelected] = useState([]);
  const [noPage, setNoPage] = useState(1);
  const [itemPerPage, setItemPerPage] = useState(5);

  // const statusOptions = useGetParameterList('apuPptStatusFilter', { label: 'value1', value: 'value2' });
  const divisionOptions = useGetParameterList('apuPptDivisionFilter');
  const searchByOptions = useGetParameterList(isDpopDivision ? 'searchByApuPptDpop' : 'searchByApuPpt', {
    label: 'value1',
    value: 'value2',
  });
  const sortByOptions = useGetParameterList('sortByApuPpt', {
    label: 'value1',
    value: 'value2',
  });

  const { data, isLoading } = useGetBucketListAssignment({
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
    status: item.statusLabel ?? '-',
  }));

  const tablePage = data?.page;

  useEffect(() => {
    setNoPage(1);
  }, [filter]);

  const handleOpenAssignModal = () => {
    NiceModal.show(MODAL.ASSIGN_TO, {
      divisionId: DPOP_DIVISION,
      module: TypeModule.APU_PPT,
      // position: 'RM', // handling issue 0002866 di DPOP tidak ada position RM
      process: TypeProcess.APU_PPT_DPOP,
      selectedTask: selected,
      setSelectedTask: setSelected,
    });
  };

  const tableHeader: TableHeader[] = [
    {
      isDisabled: () => false,
      isSelected: (data) => selected.some((el) => el.bucketProcessId === data.bucketProcessId),
      key: 'checkbox',
      onSelectChange: (data) => {
        if (selected.some((item) => item.bucketProcessId === data.bucketProcessId)) {
          setSelected(selected.filter((item) => item.bucketProcessId !== data.bucketProcessId));
        } else {
          setSelected([...selected, {
            bucketProcessId: data.bucketProcessId,
            debtorName: data.debtorName,
            divisionId: data.divisionId,
            staffDivisionLabel: data.staffDivisionLabel,
            staffName: data.staffName,
          }]);
        }
      },
      sx: { minWidth: '4vw' },
      type: 'checkbox',
    },
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
      key: 'action',
      label: 'Action',
      options: [
        {
          iconName: 'detail', onClick: (data) => {
            router.push(
              replacePath(
                apuPpt.ASSIGNMENT_DEBTOR_INFORMATION_PAGE,
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
    // {
    //   key: 'status',
    //   label: 'Status',
    //   options: statusOptions.data,
    //   type: 'multiple-autocomplete',
    // },
  ];

  return {
    filter,
    filterContentList,
    filterDropdownList,
    handleOpenAssignModal,
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
