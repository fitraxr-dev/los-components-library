import { useEffect, useState } from 'react';

import NiceModal, { useModal } from '@ebay/nice-modal-react';
import { useQuery } from '@tanstack/react-query';

import { MODAL } from '@/configs/constants/modalId';
import { pipeline } from '@/configs/constants/pathname';
import { ActivityType } from '@/enums/Activity';
import { TypeModule, TypeProcess } from '@/enums/Module';
import { replacePath } from '@/helpers/navigation';
import showNiceModal from '@/helpers/showNiceModal';
import showNiceModalV2 from '@/helpers/showNiceModalV2';
import useGetParameterList from '@/hooks/services/useGetParameterList';
import closeNiceModal from '@/hooks/useCloseNiceModal';
import useCustomRouter from '@/hooks/useCustomRouter';
import useIdentity from '@/hooks/useIdentity';
import useRecordLog from '@/hooks/useRecordLog';

import useGetUnmappedGroupList from '../../../hooks/Group/useGetUnmappedGroupList';
import useAddGroupMember from '../../../hooks/Member/useAddGroupMember';

import type { UseModalRecommendedGroupProps } from './ModalRecommendedGroup.types';
import type { TableHeader } from '@/components/shared/Table/Table.types';


const modal = {
  RECOMMENDED_GROUP: 'GROUP_RECOMMENDED_GROUP',
};

export const useModalRecommendedGroup = ({
  groupName,
  onSelectGroup,
  onCreateNew,
  hasDuplicate,
  payload,
  similarGroupList,
}: UseModalRecommendedGroupProps) => {
  const [selected, setSelected] = useState([]);
  const { recordActivity } = useRecordLog();
  const { debtorId, processId } = useIdentity();
  const router = useCustomRouter();
  const modalId = modal.RECOMMENDED_GROUP;
  const { visible } = useModal(modalId);

  const [filter, setFilter] = useState(null);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [lastSearchValue, setLastSearchValue] = useState('');

  const onPageChange = (nextPage: number) => {
    setPage(nextPage);
  };

  const onPageSizeChange = (nextSize: number) => {
    if (pageSize !== nextSize) {
      setPageSize(nextSize);
    } else {
    }
  };

  // --- PARAMETER ---

  //Group Type
  const { data: groupTypeDropdownList } = useGetParameterList('groupType');

  // Sector data
  const { data: sectorDropdownList } = useGetParameterList('sector');

  // Dropdown data
  const { data: searchDropdownList } = useGetParameterList('debtorGroupSort', { label: 'value1', value: 'value2' });

  //Filter Search By
  const { data: filterDropdownList } = useGetParameterList('debtorGroupSearch', { label: 'value1', value: 'value2' });

  // --- END OF PARAMETER ---

  //Save Member Data
  const { isPending: isSaveLoading, mutate: saveMember } = useAddGroupMember({
    onError: (error: any) => {
      const errorDetail = error?.response?.data?.errorDetail || 'Terjadi kesalahan, silahkan coba lagi';
      const message = errorDetail === 'Group not found'
        ? 'Group yang dipilih sedang dalam proses pengajuan. Gunakan group lain.'
        : errorDetail;

      showNiceModalV2({
        title: message,
        type: 'error',
      });
    },
    onSuccess: () => {
      const selectedGroupId = selected[0];
      const selectedGroup = listMasterGroup?.find((group) => group.id === selectedGroupId);

      recordActivity({
        activity: ActivityType.ADD,
        bucketProcessId: Array.isArray(processId) ? processId[0] : processId || '',
        changeAfter: JSON.stringify({
          debtorId,
          groupId: selectedGroupId,
          groupName: selectedGroup?.name,
        }),
        changeBefore: '',
        menuCode: 'pipeline',
        module: TypeModule.PIPELINE,
        process: TypeProcess.PIPELINE,
        remarks: 'successfully added debtor to existing group from recommended modal',
      });

      closeNiceModal(modalId);
      showNiceModalV2({
        onClose: () => {
          router.replace(
            replacePath(pipeline.GROUP_DETAIL_PAGE, {
              debtorId,
              groupId: selectedGroupId,
              processId,
            })
          );
        },
        title: 'Group berhasil ditambahkan',
        type: 'success',
      });
    },
  });

  // Use similarGroupList from validation response if available, otherwise fetch from API
  const { data: unmappedGroupData, isFetching: isLoadingUnmapped } = useQuery({
    enabled: !!groupName && groupName.length > 0 && !similarGroupList,
    queryFn: async () => {
      const api = new (await import('@/services/openapi/bucket-service')).GroupControllerApi();
      const payload = {
        filter: {
          ...filter?.filter,
          bucketProcessId: Array.isArray(processId) ? processId[0] : processId,
          debtorId: Array.isArray(debtorId) ? debtorId[0] : debtorId,
          groupType: filter?.filter?.groupType?.join('|'),
          module: TypeModule.PIPELINE,
          process: TypeProcess.PIPELINE,
          sector: filter?.filter?.sector?.join('|'),
        },
        page: {
          itemPerPage: pageSize,
          noPage: page,
        },
        searchDetail: filter?.searchDetail?.value ? filter?.searchDetail : {
          key: 'name',
          value: groupName,
        },
        sortList: filter?.sortList ?? null,
      };
      const res = await api.listUnmappedGroupPipeline(payload);
      return res.data.data;
    },
    queryKey: ['group-recommended-unmapped', {
      bucketProcessId: Array.isArray(processId) ? processId[0] : processId,
      debtorId: Array.isArray(debtorId) ? debtorId[0] : debtorId,
      filterGroupType: filter?.filter?.groupType?.join('|'),
      filterSearchDetail: filter?.searchDetail?.value,
      filterSector: filter?.filter?.sector?.join('|'),
      filterSortList: filter?.sortList?.value,
      groupName,
      page,
      pageSize,
    }],
    staleTime: 60000,
  });

  const { data: mappedGroupData, isFetching: isLoadingMapped } = useQuery({
    enabled: !!groupName && groupName.length > 0 && !similarGroupList,
    queryFn: async () => {
      const api = new (await import('@/services/openapi/bucket-service')).GroupControllerApi();
      const payload = {
        filter: {
          bucketProcessId: Array.isArray(processId) ? processId[0] : processId,
          debtorId: Array.isArray(debtorId) ? debtorId[0] : debtorId,
          module: TypeModule.PIPELINE,
          process: TypeProcess.PIPELINE,
        },
        page: {
          itemPerPage: 1000,
          noPage: 1,
        },
        searchDetail: {
          key: 'name',
          value: groupName,
        },
        sortList: null,
      };
      const res = await api.listMappedGroupPipeline(payload);
      return res.data.data;
    },
    queryKey: ['group-mapped', {
      bucketProcessId: Array.isArray(processId) ? processId[0] : processId,
      debtorId: Array.isArray(debtorId) ? debtorId[0] : debtorId,
      groupName,
    }],
    staleTime: 60000,
  });

  // Use similarGroupList from validation if available, otherwise use API data
  const groupData = similarGroupList ? { contents: similarGroupList } : unmappedGroupData;
  const isLoading = isLoadingUnmapped || isLoadingMapped;

  // Apply pagination to similarGroupList if available
  const paginatedSimilarGroups = similarGroupList
    ? similarGroupList.slice((page - 1) * pageSize, page * pageSize)
    : null;

  const listMasterGroup = (similarGroupList ? paginatedSimilarGroups : groupData?.contents)?.map((data) => ({
    ...data,
    groupType: data.groupTypeLabel ?? data.groupType ?? '-',
    id: data.id ?? '-',
    name: data.name ?? '-',
    sectorLabel: data.sectorLabel ?? data.sector ?? '-',
  }));

  // Calculate total page based on actual data length and page size
  const totalPage = similarGroupList
    ? Math.ceil(similarGroupList.length / pageSize)
    : (groupData as any)?.page?.totalPage ?? 1;

  const mappedGroups = mappedGroupData?.contents || [];
  const hasExactMatchInMapped = mappedGroups.some((group) =>
    group.name.toLowerCase() === groupName?.toLowerCase()
  );

  const hasExactMatchInUnmapped = listMasterGroup?.some((group) =>
    group.name.toLowerCase() === groupName?.toLowerCase()
  ) ?? false;

  const hasSimilarNames = listMasterGroup && listMasterGroup.length > 0;

  const hasExactMatch = hasExactMatchInMapped || hasExactMatchInUnmapped;
  const groupStatus: 'isDuplicated' | 'isSimilar' | undefined = hasExactMatch ? 'isDuplicated' : hasSimilarNames ? 'isSimilar' : undefined;

  useEffect(() => {
    if (groupStatus === 'isDuplicated' && visible) {
      showNiceModal('error', `Group "${groupName}" sudah terdaftar dalam database.`);
      closeNiceModal(modalId);
    }
  }, [groupStatus, visible, groupName, modalId]);

  // Reset search value when modal opens with new group name
  useEffect(() => {
    if (visible && groupName) {
      setLastSearchValue('');
    }
  }, [visible, groupName]);

  // Reset page to 1 only when search value actually changes (not when pagination changes)
  useEffect(() => {
    const currentSearchValue = filter?.searchDetail?.value || '';
    if (currentSearchValue !== lastSearchValue && currentSearchValue.length >= 3) {
      setPage(1);
      setLastSearchValue(currentSearchValue);
    }
  }, [filter?.searchDetail?.value, lastSearchValue]);

  const handleAddGroupMember = () => {
    let res = [];
    selected.forEach((element) => {
      res.push({
        bucketProcessId: processId,
        debtorId: debtorId,
        groupCode: element,
        module: TypeModule.PIPELINE,
        process: TypeProcess.PIPELINE,
        remark: '',
        sector: '',
      });
    });

    saveMember(res);
  };

  const handleCreateNewGroup = () => {
    if (hasDuplicate) {
      showNiceModalV2({
        cancelText: 'Cancel',
        title: 'Terdapat Nama Group yang sama pada rekomendasi atau pada pengajuan yang lain',
        type: 'error',
      });
    } else {
      showNiceModalV2({
        cancelText: 'Tidak',
        onSubmit: () => {
          // Use the payload from validation response
          if (payload) {
            closeNiceModal(modalId);
            // Call the save function directly with the payload
            if (onCreateNew) {
              onCreateNew();
            }
          }
        },
        submitText: 'Ya',
        title: 'Terdapat Nama Group yang serupa pada rekomendasi, yakin ingin menambahkan?',
        type: 'warning',
      });
    }
  };

  const filterContentList = [
    {
      key: 'sortList',
      label: 'Urutkan Berdasarkan',
      options: searchDropdownList,
      type: 'sort',
    },
    {
      key: 'sector',
      label: 'Sektor Industri',
      options: sectorDropdownList,
      type: 'multiple-autocomplete',
    },
    {
      key: 'groupType',
      label: 'Tipe Group',
      options: groupTypeDropdownList,
      type: 'multiple-autocomplete',
    },
  ];

  const tableHeader: Array<TableHeader> = [
    {
      isDisabled: () => false,
      isSelected: (data) => selected.includes(data.id),
      key: 'checkbox',
      onSelectChange: (data) => {
        // Only allow single selection for recommendation
        setSelected([data.id]);
      },
      sx: {
        minWidth: '4vw',
      },
      type: 'checkbox',
    },
    {
      key: 'name',
      label: 'Group Name',
      sx: { minWidth: '200px' },
    },
    {
      key: 'groupType',
      label: 'Group Type',
      sx: { minWidth: '150px' },
    },
    {
      key: 'sectorLabel',
      label: 'Sector',
      sx: { minWidth: '150px' },
    },
  ];

  return {
    filter,
    filterContentList,
    filterDropdownList,
    groupStatus,
    handleAddGroupMember,
    handleCreateNewGroup,
    isLoading,
    isSaveLoading,
    listMasterGroup,
    modalId,
    page,
    pageSize,
    selected,
    setFilter,
    setPage: onPageChange,
    setPageSize: onPageSizeChange,
    tableHeader,
    totalPage,
    visible,
  };
};
