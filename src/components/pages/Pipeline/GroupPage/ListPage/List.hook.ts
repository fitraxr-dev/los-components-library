import { useEffect, useState } from 'react';

import NiceModal from '@ebay/nice-modal-react';
import { useTheme } from '@mui/material';

import { MODAL } from '@/configs/constants/modalId';
import { pipeline } from '@/configs/constants/pathname';
import { ActivityType } from '@/enums/Activity';
import { TypeModule, TypeProcess } from '@/enums/Module';
import { replacePath } from '@/helpers/navigation';
import useGetParameterList from '@/hooks/services/useGetParameterList';
import useApp from '@/hooks/useApp';
import useCustomRouter from '@/hooks/useCustomRouter';
import useIdentity from '@/hooks/useIdentity';
import useRecordLog from '@/hooks/useRecordLog';
import useSessionStorage from '@/hooks/useSessionStorage';
import useViewOnly from '@/hooks/useViewOnly';

import useGetDebtorGroupLists from '../hooks/Group/useGetDebtorGroupList';

import { FILTER_CONTENT_LIST, TABLE_HEADER_LIST_PAGE } from './List.constants';

import type { TableHeader } from '@/components/shared/Table/Table.types';


export const useListPage = () => {
  const theme = useTheme();
  const { recordActivity } = useRecordLog();
  const { debtorId, processId } = useIdentity();
  const router = useCustomRouter();
  const { viewOnly } = useViewOnly();
  const [noPage, setNoPage] = useState(1);
  const [itemPerPage, setItemPerPage] = useState(10);
  const [filter, setFilter] = useSessionStorage('filter-component-pipeline-group', {
    filter: {
      bucketProcessId: processId,
      debtorId,
      module: 'PIPELINE',
      process: 'PIPELINE',
    },
  });

  const {
    data: debtorGrouptData,
    isLoading: isLoadingDebtorGroup,
    refetch: refetchDebtorGroup,
  } = useGetDebtorGroupLists({
    filter: {
      ...filter?.filter,
      bucketProcessId: processId,
      debtorId,
      module: TypeModule.PIPELINE,
      process: TypeProcess.PIPELINE,
    },
    page: {
      itemPerPage,
      noPage,
    },
    searchDetail: filter?.searchDetail ?? { key: '', value: '' },
    sortList: filter?.sortList ?? undefined,
  });

  // Record activity when group list data is loaded
  useEffect(() => {
    if (debtorGrouptData) {
      recordActivity({
        activity: ActivityType.VIEW,
        bucketProcessId: processId || '',
        changeAfter: '',
        changeBefore: '',
        menuCode: 'pipeline',
        module: TypeModule.PIPELINE,
        process: TypeProcess.PIPELINE,
        remarks: 'view pipeline group list',
      });
    }
  }, [debtorGrouptData, noPage, itemPerPage, processId, recordActivity]);

  const debtorGrouptContents = debtorGrouptData?.contents?.map(((data) => ({
    ...data,
    groupType: data.groupTypeLabel ?? '-',
    id: data.id ?? '-',
    name: data.name ?? '-',
    sectorLabel: data.sectorLabel ?? '-',
  })));
  const debtorGroupPage = debtorGrouptData?.page;

  const debtorGroupList = debtorGrouptContents?.map((item) => ({
    ...item,
  }));

  useEffect(() => {
    if (debtorGroupList?.length === 0) {
      setNoPage(1);
    }
  }, [debtorGroupList, filter]);

  useEffect(() => {
    if (!!router) {
      refetchDebtorGroup();
    }
  }, [router]);

  const handlePageSizeChange = (e) => {
    setItemPerPage(e);
  };

  // Dropdown data
  const { data: sectorDropdownList } = useGetParameterList('sector');

  // Dropdown data
  const { data: searchDropdownList } = useGetParameterList('searchByDebtorGroup', { label: 'value1', value: 'value2' });

  // Sort by Sector
  const { data: sortBySector } = useGetParameterList('sortSectorPipeline', { label: 'value1', value: 'value2' });

  const filterContentList = [
    {
      key: 'sortList',
      label: 'Urutkan Berdasarkan',
      options: sortBySector,
      type: 'sort',
    },
    {
      key: 'sector',
      label: 'Sektor Industri',
      options: sectorDropdownList,
      type: 'dropdown',
    }
  ];

  const tableHeader: Array<TableHeader> = [
    ...TABLE_HEADER_LIST_PAGE,
    {
      key: 'action',
      label: 'Action',
      options: [
        {
          iconName: 'detail', onClick: (data: any) => {
            recordActivity({
              activity: ActivityType.VIEW,
              bucketProcessId: processId || '',
              changeAfter: '',
              changeBefore: '',
              menuCode: 'pipeline',
              module: TypeModule.PIPELINE,
              process: TypeProcess.PIPELINE,
              remarks: 'view pipeline group detail from list',
            });

            router.push(
              replacePath(pipeline.GROUP_DETAIL_PAGE, {
                debtorId,
                groupId: data.id,
                processId,
              })
            );
          },
        },
      ],
      sx: {
        minWidth: '4vw',
      },
      type: 'action',
    },
  ];

  const handleCreateNewGroup = () => {
    NiceModal.show(MODAL.PIPELINE.GROUP.EXISTING_GROUP);
  };

  return {
    debtorGroupList,
    debtorGroupPage,
    debtorId,
    filter,
    filterContentList,
    handleCreateNewGroup,
    handlePageSizeChange,
    isLoadingDebtorGroup,
    noPage,
    router,
    searchDropdownList,
    sectorDropdownList,
    setFilter,
    setItemPerPage,
    setNoPage,
    tableHeader,
    theme,
    viewOnly,
  };
};
