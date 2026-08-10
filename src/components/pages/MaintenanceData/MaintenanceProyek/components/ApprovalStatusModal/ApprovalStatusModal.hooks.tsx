import { useEffect, useMemo, useState } from 'react';

import { accessid, maintenanceProyek } from '@/configs/constants/pathname';
import { ActivityType } from '@/enums/Activity';
import { TypeModule, TypeProcess } from '@/enums/Module';
import { formatDate } from '@/helpers/date';
import { replacePath } from '@/helpers/navigation';
import useGetParameterList from '@/hooks/services/useGetParameterList';
import useApp from '@/hooks/useApp';
import useCheckAccess from '@/hooks/useCheckAccess';
import closeNiceModal from '@/hooks/useCloseNiceModal';
import useCustomRouter from '@/hooks/useCustomRouter';
import useRecordLog from '@/hooks/useRecordLog';

import useGetBucketListStatus from '@/components/pages/UserManagement/UserList/hooks/useGetBucketListStatus';
import Button from '@/components/shared/Button';
import TextStyle from '@/components/shared/TextStyle';

import useGetApprovalStatus from '../../hooks/useGetApprovalStatus';
import { modal as MODAL } from '../../ListPage/MaintenanceProyek.constants';

import { TABLE_HEADER } from './ApprovalStatus.constants';

import type { ContentList } from '@/components/shared/Input/Input.types';
import type { TableHeader } from '@/components/shared/Table/Table.types';


const useApprovalStatusModal = () => {
  const { recordActivity } = useRecordLog();
  const modalId = MODAL.APPROVAL_STATUS_MODAL;
  const [filter, setFilter] = useState(null);
  const [noPage, setNoPage] = useState(1);
  const [itemPerPage, setItemPerPage] = useState(10);
  const [appState] = useApp();
  const canEdit = useCheckAccess(accessid.MAINTENANCE_PROYEK_UPDATE);
  const router = useCustomRouter();

  const { data: submissionList, isFetching: isLoading } = useGetApprovalStatus({
    filter: {
      ...filter?.filter,
      city: filter?.filter?.city?.value,
      district: filter?.filter?.district?.value,
      province: filter?.filter?.province?.value,
    },
    page: {
      itemPerPage: itemPerPage,
      noPage: noPage,
    },
    searchDetail: filter?.searchDetail ?? {},
    sortList: filter?.sortList ?? {},
  });

  // Record activity for approval status data
  useEffect(() => {
    if (submissionList) {
      recordActivity({
        activity: ActivityType.VIEW,
        bucketProcessId: '',
        changeAfter: '',
        changeBefore: '',
        menuCode: 'maintenance-proyek',
        module: TypeModule.MAINTENANCE_DATA,
        process: TypeProcess.MAINTENANCE_PROYEK,
        remarks: 'view maintenance proyek approval status list data in modal',
      });
    }
  }, [submissionList, noPage, itemPerPage, filter, recordActivity]);

  const tableData = submissionList?.data?.contents?.map((data) => ({
    ...data,
  }));

  const tablePage = submissionList?.data?.page;

  // --- PARAMETER ---

  // Dropdown data
  const { data: searchByOptions } = useGetParameterList('searchByProject2', { label: 'value1', value: 'value2' });

  // Sort By data
  const { data: sortByOptions } = useGetParameterList('sortByProject', { label: 'value1', value: 'value2' });

  // Currency List
  const { data: currencyOptions } = useGetParameterList('currency');

  // Sector List
  const { data: sectorOptions } = useGetParameterList('sector');

  // Status List
  const { data: statusOptions } = useGetBucketListStatus({ module: 'MAINTENANCE_DATA', process: 'MAINTENANCE_PROJECT' });

  const statusOptionsMapped = useMemo(() => {
    return statusOptions?.map((item) => ({
      label: item.label,
      value: item.key,
    }));
  }, [statusOptions]);

  const filterDropdownList = searchByOptions;

  useEffect(() => {
    setNoPage(1);
  }, [filter]);

  const tableHeader: TableHeader[] = [
    ...TABLE_HEADER,
    {
      key: 'createdDate',
      label: 'Created Date',
      render: (row) => (
        <TextStyle variant="body4">
          {row?.createdDate ? formatDate(row?.createdDate, 'DD MMMM YYYY, HH:mm:ss') : '-'}
        </TextStyle>
      ),
    },
    {
      key: 'status',
      label: 'Status',
      render: (row) => (
        <Button
          variant="outlined"
          sx={{ px: 1, py: 0.5 }}
          textVariant="body4"
          noClick
        >
          {row?.statusLabel}
        </Button>
      ),
    },
    {
      key: 'action',
      label: 'Action',
      options: [
        {
          iconName: 'detail',
          onClick: (data) => {
            closeNiceModal(modalId);
            const targetPath = replacePath(
              canEdit ? maintenanceProyek.EDIT_PAGE : maintenanceProyek.DETAIL_PAGE,
              { id: data?.bucketProcessId }
            );
            const pathWithStatus = `${targetPath}?status=${encodeURIComponent(data?.status || '')}`;

            router.push(pathWithStatus);
          },
        }
      ],
      type: 'action',
    }
  ];

  const filterContentList: ContentList[] = [
    {
      key: 'sortList',
      label: 'Urutkan Berdasarkan',
      options: sortByOptions,
      type: 'sort',
    },
    {
      key: 'currencies',
      label: 'Currency',
      options: currencyOptions,
      type: 'multiple-autocomplete',
    },
    {
      key: 'sectors',
      label: 'Sektor yang dibiayai',
      options: sectorOptions,
      type: 'multiple-autocomplete',
    },
    {
      key: 'area', // tidak terpakai
      label: 'Area', // tidak terpakai
      type: 'area-proyek',
    },
    {
      key: 'status',
      label: 'Status',
      options: statusOptionsMapped,
      type: 'multiple-autocomplete',
    },
  ];

  return {
    filter,
    filterContentList,
    filterDropdownList,
    isLoading,
    noPage,
    setFilter,
    setItemPerPage,
    setNoPage,
    statusOptions,
    tableData,
    tableHeader,
    tablePage,
  };
};

export default useApprovalStatusModal;
