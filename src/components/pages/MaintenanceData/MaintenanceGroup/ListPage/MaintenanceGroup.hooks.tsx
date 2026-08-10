'use client';
import { useEffect, useState } from 'react';

import NiceModal from '@ebay/nice-modal-react';
import { keyDownEvent } from '@syncfusion/ej2-documenteditor';
import { useQueryClient } from '@tanstack/react-query';
import { useParams } from 'next/navigation';

import { ONE_MINUTE } from '@/configs/constants';
import { MODAL } from '@/configs/constants/modalId';
import { maintenanceGroup, accessid } from '@/configs/constants/pathname';
import { ActivityType } from '@/enums/Activity';
import { TypeModule, TypeProcess } from '@/enums/Module';
import { replacePath } from '@/helpers/navigation';
import showNiceModalV2 from '@/helpers/showNiceModalV2';
import useGetParameterList from '@/hooks/services/useGetParameterList'; // ini nanti di sesuaikan
import useCheckAccess from '@/hooks/useCheckAccess';
import useCustomRouter from '@/hooks/useCustomRouter';
import useRecordLog from '@/hooks/useRecordLog';

import { useMaintenanceGroupContext } from '@/components/layouts/MaintenanceGroupLayout/MaintenanceGroup.context';

import useGetMaintenanceGroupData from '../hooks/useGetMaintenanceGroupData';
import useSaveDebtorGroup from '../hooks/useSaveDebtorGroup';

import { tableHeaderList, modal } from './MaintenanceGroup.constants';


import type { SearchValue } from '@/components/shared/Input/components/Search/Search.types';
import type { TableHeader } from '@/components/shared/Table/Table.types';


export const useMaintenanceGroup = () => {
  const { groupId } = useParams<{ groupId: string }>();
  const router = useCustomRouter();
  const { isRM, isSuperAdminMaker, handleSetBreadcrumb } = useMaintenanceGroupContext();
  const [filter, setFilter] = useState<SearchValue>({});
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);

  const canEditGroup = useCheckAccess(accessid.MAINTENANCE_GROUP_UPDATE);

  const queryClient = useQueryClient();
  const isSubmission = groupId?.includes('MG');

  const { recordActivity } = useRecordLog();

  const SORT_KEY_MAP_MAIN: Record<string, string> = {
    GROUP_NAME: 'name',
    ID: 'groupCode',
    SECTOR: 'sector',
  };

  const mapSortKeyMain = (raw?: string) => {
    if (!raw) return '';
    return SORT_KEY_MAP_MAIN[raw.toUpperCase()] ?? raw;
  };

  const sortListPayload = filter?.sortList
    ? {
      columnName: mapSortKeyMain(filter.sortList.columnName),
      sortType: filter.sortList.sortType ?? 'ASC',
    }
    : {};


  useEffect(() => {
    handleSetBreadcrumb([
    ]);
  }, []);

  const { data, isFetching: isLoading } = useGetMaintenanceGroupData({
    filter: {
      ...filter?.filter,
      isRelatedSmi: filter?.filter?.isRelatedSmi === 'yes' ? true : filter?.filter?.isRelatedSmi === 'no' ? false : null,
    },
    page: {
      itemPerPage: pageSize,
      noPage: page,
    },
    searchDetail: filter?.searchDetail ?? {},
    sortList: sortListPayload,
  }, {
    staleTime: ONE_MINUTE,
  });

  // --- PARAMETER ---

  // Dropdown data
  const { data: searchByOptions } = useGetParameterList('searchByMaintenanceGroup', { label: 'value1', value: 'value2' });

  // Dropdown data
  const { data: sectorDropdownList } = useGetParameterList('sector');

  const { data: sortDropdownListAPI = []} = useGetParameterList('sortByMaintenanceGroup');

  const { data: groupTypeDropdownList } = useGetParameterList('groupType');

  const smiDropdownList = [
    { label: 'Ya', value: 'yes' },
    { label: 'Tidak', value: 'no' },
  ];

  const filterDropdownList = searchByOptions;

  const handleApprovalStatusModal = () => {
    NiceModal.show(modal.APPROVAL_STATUS_MODAL);
  };

  const handleCreateNewGroupModal = () => {
    router.push(
      maintenanceGroup.CREATE_PAGE,
    );
  };

  useEffect(() => {
    if (data?.data?.contents) {
      recordActivity({
        activity: ActivityType.VIEW,
        bucketProcessId: '',
        changeAfter: '',
        changeBefore: '',
        menuCode: 'maintenance-group',
        module: TypeModule.MAINTENANCE_GROUP,
        process: TypeProcess.MAINTENANCE_GROUP,
        remarks: 'view maintenance group list data',
      });
    }
  }, [data?.data?.contents, recordActivity]);

  useEffect(() => {
    setPage(1);
  }, [filter]);

  const rmActionList = [
    {
      iconName: 'detail',
      onClick: (data) => {
        router.push(
          replacePath(
            maintenanceGroup.DETAIL_PAGE,
            {
              groupId: data.id,
            }
          )
        );
      },
    },
    {
      iconName: 'edit',
      isDisabled: !isRM && !isSuperAdminMaker,
      onClick: (data) => {
        router.push(
          replacePath(
            maintenanceGroup.EDIT_PAGE,
            {
              groupId: data.id,
            }
          )
        );
      },
    },
  ];

  const { mutate: saveGrup, isPending: isSaveNewGrupLoading, data: dataResult } = useSaveDebtorGroup({
    onError: () => {
      showNiceModalV2({
        title: 'Terjadi kesalahan, silahkan coba lagi',
        type: 'error',
      });
    },
    onSuccess: (data, variables) => {
      router.push(
        replacePath(maintenanceGroup.EDIT_PAGE, {
          groupId: data.data.content.bucketProcessId,
        })
      );
    },
  });


  const tableHeader: TableHeader[] = [
    ...tableHeaderList,
    {
      key: 'action',
      label: 'Action',
      options: (rowData) => {
        const actions = [
          {
            iconName: 'detail',
            onClick: () => {
              if (rowData.isEditable === false) {
                sessionStorage.setItem('maintenance-group-is-editable-false', 'true');
                sessionStorage.setItem('maintenance-group-id', rowData.id);
              } else {
                sessionStorage.removeItem('maintenance-group-is-editable-false');
                sessionStorage.removeItem('maintenance-group-id');
              }

              router.push(
                replacePath(maintenanceGroup.DETAIL_PAGE, {
                  groupId: rowData.id,
                }) + '?from=list'
              );
            },
          },
        ];

        if (rowData.isEditable && canEditGroup) {
          actions.push({
            iconName: 'edit',
            onClick: () => {
              NiceModal.show('CONFIRM', {
                agreeText: 'Confirm',
                cancelText: 'Cancel',
                onSubmit: () => {
                  const payload = {
                    // bucketProcessId: null,
                    groupType: rowData.groupType,
                    id: rowData.id,
                    isRelatedSmi: rowData.isRelatedSmi === true || rowData.isRelatedSmi === 'true' || rowData.isRelatedSmi === 'Ya',
                    name: rowData.name,
                    sector: rowData.sector,
                    yearFounded: rowData.yearFounded,
                  };

                  saveGrup(payload);
                },
                title: 'Apakah Anda yakin ingin mengubah data group?',
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


  const filterContentList = [
    {
      key: 'sortList',
      label: 'Urutkan Berdasarkan',
      options: sortDropdownListAPI,
      type: 'sort',
    },
    {
      endKey: 'endDate',
      label: 'Periode Last Modified',
      startKey: 'startDate',
      type: 'period',
    },
    {
      key: 'groupType',
      label: 'Jenis Group',
      options: groupTypeDropdownList,
      type: 'multiple-autocomplete',
    },
    {
      key: 'isRelatedSmi',
      label: 'Terkait dengan SMI',
      options: smiDropdownList,
      type: 'dropdown',
    },
    {
      key: 'sector',
      label: 'Sektor Industri',
      options: sectorDropdownList,
      type: 'multiple-autocomplete',
    }
  ];


  return {
    data,
    filter,
    filterContentList,
    filterDropdownList,
    handleApprovalStatusModal,
    handleCreateNewGroupModal,
    isLoading,
    isRM,
    page,
    pageSize,
    setFilter,
    setPage,
    setPageSize,
    tableHeader,
  };
};
