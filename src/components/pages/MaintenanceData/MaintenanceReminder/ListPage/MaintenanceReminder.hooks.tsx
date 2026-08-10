'use client';

import { useState } from 'react';

import NiceModal from '@ebay/nice-modal-react';
import dayjs from 'dayjs';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';
import 'dayjs/locale/id';

import { roles } from '@/configs/constants';
import { maintenanceReminder } from '@/configs/constants/pathname';
import { ActivityType } from '@/enums/Activity';
import { TypeModule, TypeProcess } from '@/enums/Module';
import { replacePath } from '@/helpers/navigation';
import useGetParameterList from '@/hooks/services/useGetParameterList';
import useApp from '@/hooks/useApp';
import useCustomRouter from '@/hooks/useCustomRouter';
import useRecordLog from '@/hooks/useRecordLog';

import { useDetailPage } from '../DetailPage/DetailPage.hooks';

import useGetListMaintenanceReminder from './hooks/useGetListMaintenanceReminder';
import useGetReminderBucketId from './hooks/useGetReminderBucketId';
import { modal, tableHeaderList } from './MaintenanceReminder.constant';

import type { SearchValue } from '@/components/shared/Input/components/Search/Search.types';
import type { ContentList } from '@/components/shared/Input/Input.types';
import type { TableHeader } from '@/components/shared/Table/Table.types';


export const useMaintenanceReminder = () => {
  const router = useCustomRouter();

  // record log activity
  const { recordActivity } = useRecordLog();

  const [filter, setFilter] = useState<SearchValue>(null);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);

  const anomalyRowStyle = (rowData: any) => ({
    backgroundColor: !rowData.isEditable ? '#FFF5E4' : 'inherit',
  });

  dayjs.extend(utc);
  dayjs.extend(timezone);
  dayjs.locale('id');

  // cek role
  const [state, _] = useApp();
  const isMAKER = state.currentRole.includes(roles.MAKER);

  const { data: reminderData, isFetching: isLoading } = useGetListMaintenanceReminder({
    filter: {
      ...filter?.filter,
    },
    page: {
      itemPerPage: pageSize,
      noPage: page,
    },
    searchDetail: filter?.searchDetail ?? { key: '', value: '' },
    sortList: filter?.sortList ?? undefined,
  });

  const totalPage = reminderData?.page?.totalPage;
  const tableData = reminderData?.contents?.map((item) => ({
    ...item,
    modifiedBy: item.modifiedBy || '-',
    modifiedDate: item.modifiedDate
      ? dayjs.utc(item.modifiedDate).tz('Asia/Jakarta').format('D MMMM YYYY, HH:mm:ss')
      : '-',
    reminderSubject: item.reminderSubject || '-',
  }));

  const { mutate: saveGetBucketId } = useGetReminderBucketId({
    onError: (err) => {
      console.error('Gagal ambil bucket ID:', err);
    },
    onSuccess: (data) => {
      // post record activity
      recordActivity({
        activity: ActivityType.ADD,
        bucketProcessId: data.content.bucketProcessId,
        changeAfter: JSON.stringify(data.content),
        module: TypeModule.MAINTENANCE_REMINDER,
        process: TypeProcess.MAINTENANCE_REMINDER,
        remarks: 'create bucket process id in maintenance reminder',
      });

      const nextPath = replacePath(`${maintenanceReminder.DETAIL_PAGE}?action=edit`, {
        id: data.content.bucketProcessId,
      });
      router.push(nextPath);
    },
  });

  const handleSaveReminderForBucketlist = (rowData) => {
    saveGetBucketId({
      submitReminderRequest: { reminderTemplateId: rowData.id },
      userId: '-',
    });
  };


  const tableHeader: TableHeader[] = [
    ...tableHeaderList,
    {
      key: 'action',
      label: 'Action',
      options: (rowData) => {
        const actions = [
          {
            iconName: 'detail',
            onClick: (data) => {
              const nextPath = replacePath(`${maintenanceReminder.DETAIL_PAGE}?action=detail`, {
                id: data?.templateCode,
              });
              router.push(nextPath);
            },
          },
        ];

        if (rowData.isEditable && isMAKER) {
          actions.push({
            iconName: 'edit',
            onClick: (data) => {
              NiceModal.show('CONFIRM', {
                agreeText: 'Confirm',
                cancelText: 'Cancel',
                onSubmit: () => {
                  handleSaveReminderForBucketlist(rowData);
                },
                title: 'Apakah Anda yakin ingin mengubah data reminder?',
              });
            },
          });
        }

        return actions;
      },
      sx: {
        minWidth: '10vw',
      },
      type: 'action',
    }
  ];

  const handleApprovalStatusModal = () => {
    NiceModal.show(modal.APPROVAL_STATUS_MODAL);
  };

  return {
    anomalyRowStyle,
    filter,
    handleApprovalStatusModal,
    isLoading,
    page,
    pageSize,
    setFilter,
    setPage,
    setPageSize,
    tableData,
    tableHeader,
    totalPage,
  };
};
