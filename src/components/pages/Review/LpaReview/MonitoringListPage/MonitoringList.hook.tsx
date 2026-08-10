import { useEffect, useMemo, useState } from 'react';

import NiceModal from '@ebay/nice-modal-react';
import { usePathname } from 'next/navigation';


import { roles } from '@/configs/constants';
import { MODAL } from '@/configs/constants/modalId';
import { lpaRequestReview, lpaReview } from '@/configs/constants/pathname';
import { ActivityType } from '@/enums/Activity';
import { TypeProcess } from '@/enums/Module';
import { replacePath } from '@/helpers/navigation';
import useGetBucketList from '@/hooks/services/useGetBucketList';
import useGetParameterList from '@/hooks/services/useGetParameterList';
import useApp from '@/hooks/useApp';
import useCustomRouter from '@/hooks/useCustomRouter';
import useRecordLog from '@/hooks/useRecordLog';
import useSessionStorage from '@/hooks/useSessionStorage';

import useGetCurrentModule from '../hooks/useGetCurrentModule';

import { tableHeaderResultList } from './MonitoringList.constant';

import type { TableHeader } from '@/components/shared/Table/Table.types';


const useAssignmentList = () => {
  const { module, process } = useGetCurrentModule();
  const { recordActivity } = useRecordLog();
  const [selected, setSelected] = useState([]);
  const [noPage, setNoPage] = useState(1);
  const [itemPerPage, setItemPerPage] = useState(5);
  const [divisionId, setDivisionId] = useState('');
  const router = useCustomRouter();
  const [{ currentRole }] = useApp();
  const path = usePathname();
  const pathArray = path.split('/');
  const isChecker = currentRole?.includes(roles.CHECKER);
  const isTLKadiv = currentRole?.includes(roles.TL) || currentRole?.includes(roles.KADIV);

  const handleToDetailPage = (id: string) => {
    // Record activity for viewing monitoring detail
    recordActivity({
      activity: ActivityType.VIEW,
      bucketProcessId: id || '',
      changeAfter: '',
      changeBefore: '',
      menuCode: 'lpa-review',
      module: module,
      process: process,
      remarks: `view lpa review monitoring detail (processId: ${id})`,
    });

    switch (process) {
      case TypeProcess.LPA_REVIEW:
        return router.push(replacePath(lpaReview.DEBTOR_INFORMATION, { module: 'monitoring', processId: id }));
      default:
        return router.push(replacePath(lpaRequestReview.DEBTOR_INFORMATION, { module: 'monitoring', processId: id }));
    }
  };

  // --- PARAMETER ---
  const { data: statusOptions } = useGetParameterList('filterStatusLPAList');
  const { data: divisionOptions } = useGetParameterList('division');
  const { data: searchByOptions } = useGetParameterList('searchByLPAListMonitoring', {
    label: 'value1',
    value: 'value2',
  });
  const { data: sortByOptions } = useGetParameterList('sortByLPAList', {
    label: 'value1',
    value: 'value2',
  });
  // --- END OF PARAMETER ---

  const [filter, setFilter] = useSessionStorage('filter-component-lpa-monitoring', null);

  const { data, isFetching: isLoading } = useGetBucketList({
    filter: {
      ...filter?.filter,
      module,
      process,
    },
    page: {
      itemPerPage: itemPerPage,
      noPage,
    },
    searchDetail: filter?.searchDetail ?? { key: '', value: '' },
    sortList: filter?.sortList ?? undefined,
  });

  const monitoringList = data?.contents.map((content) => ({
    aging: content.aging ?? '-',
    bucketMaster: content.bucketMaster ?? '-',
    createdAt: content.createdAt,
    debtorName: content.debtorName ?? '-',
    division: content.division ?? '-',
    divisionId: content.divisionId ?? '-',
    dueDate: content.dueDate,
    id: content.bucketProcessId,
    institutionTypeLabel: content.institutionTypeLabel ?? '-',
    modifiedAt: content.modifiedAt,
    pic: content.pic.map((item) => ({
      ...item,
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
      taskId: content.bucketProcessId,
    })),
    rmName: content.staffName ?? '-',
    status: content.statusLabel ?? '-',
  }));

  if (monitoringList) {
    monitoringList.forEach((item) => {
      const { pic } = item;
      let leaderIndex = pic.findIndex((picObj) => picObj.isLeader === true);
      if (leaderIndex !== -1) {
        let leaderObj = item.pic.splice(leaderIndex, 1)[0];
        pic.unshift(leaderObj);
      }
    });
  }


  const monitoringPage = data?.page;

  // Record activity when monitoring list is loaded
  useEffect(() => {
    if (data) {
      recordActivity({
        activity: ActivityType.VIEW,
        bucketProcessId: '',
        changeAfter: '',
        changeBefore: '',
        menuCode: 'lpa-review',
        module: module,
        process: process,
        remarks: 'view lpa review monitoring list',
      });
    }
  }, [data, module, process, recordActivity]);

  const filterDropdownList = searchByOptions;

  const filterContentList = [
    {
      key: 'sortList',
      label: 'Urutkan Berdasarkan',
      options: sortByOptions,
      type: 'sort',
    },
    {
      endKey: 'endDate',
      label: 'Periode Created Date',
      startKey: 'startDate',
      type: 'period',
    },
    {
      allowFutureDates: true,
      endKey: 'endDueDate',
      label: 'Due Date',
      startKey: 'startDueDate',
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
      options: divisionOptions,
      type: 'multiple-autocomplete',
    },
    {
      key: 'status',
      label: 'Status',
      options: statusOptions,
      type: 'multiple-autocomplete',
    }
  ];

  const isShowCheckbox = useMemo(() => {
    return pathArray[3] === 'lpa-request-review' && (currentRole.includes(roles.TL) || currentRole.includes(roles.KADIV));
  }, [currentRole, pathArray]);


  const tableHeader: Array<TableHeader> = [
    ...((!isShowCheckbox && !isChecker) ? [
      {
        isDisabled: () => false,
        isSelected: (data) => selected.some((item) => item.id === data.id),
        key: 'checkbox',
        onSelectChange: (data) => {
          setDivisionId(data.divisionId);
          if (selected.some((item) => item.id === data.id)) {
            setSelected(selected.filter((item) => item.id !== data.id));
          } else {
            setSelected([
              ...selected, data]);
          }
        },
        sx: { minWidth: '3.6vw' },
        type: 'checkbox' as const,
      },
    ] : []),
    ...tableHeaderResultList,
    {
      key: 'action',
      label: 'Action',
      options: [
        {
          iconName: 'detail',
          onClick: (data) => handleToDetailPage(data.id),
        },
      ],
      sx: {
        minWidth: '6vw',
        textAlign: 'center',
      },
      type: 'action',
    },
  ];

  const handleClickReassignTo = () => {

    NiceModal.show(
      MODAL.REASSIGN_TO,
      {
        divisionId,
        module,
        position: 'Staff_PJ_LPA',
        process,
        selectedTask: selected,
        setSelectedTask: setSelected,
      }
    );
  };


  return {
    filter,
    filterContentList,
    filterDropdownList,
    handleClickReassignTo,
    handleToDetailPage,
    isLoading,
    isShowCheckbox,
    isTLKadiv,
    monitoringList,
    monitoringPage,
    noPage,
    selected,
    setFilter,
    setItemPerPage,
    setNoPage,
    tableHeader,
  };
};

export default useAssignmentList;
