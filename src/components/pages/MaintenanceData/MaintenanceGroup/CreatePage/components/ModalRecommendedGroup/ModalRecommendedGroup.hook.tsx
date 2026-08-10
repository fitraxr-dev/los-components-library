import { useEffect, useState } from 'react';

import NiceModal, { useModal } from '@ebay/nice-modal-react';
import { useQuery } from '@tanstack/react-query';

import { MODAL } from '@/configs/constants/modalId';
import { maintenanceGroup } from '@/configs/constants/pathname';
import { API } from '@/helpers/api';
import { replacePath } from '@/helpers/navigation';
import showNiceModal from '@/helpers/showNiceModal';
import showNiceModalV2 from '@/helpers/showNiceModalV2';
import useGetParameterList from '@/hooks/services/useGetParameterList';
import closeNiceModal from '@/hooks/useCloseNiceModal';
import useCustomRouter from '@/hooks/useCustomRouter';

import useAddGroupMember from '../../../hooks/useAddGroupMember';

import type { UseModalRecommendedGroupProps } from './ModalRecommendedGroup.types';
import type { TableHeader } from '@/components/shared/Table/Table.types';


const modal = {
  RECOMMENDED_GROUP: 'MAINTENANCE_GROUP_RECOMMENDED_GROUP',
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
    onSuccess: () => {
      const selectedGroupId = selected[0];
      const selectedGroup = listMasterGroup?.find((group) => group.id === selectedGroupId);

      closeNiceModal(modalId);
      showNiceModalV2({
        onClose: () => {
          router.replace(
            replacePath(maintenanceGroup.DETAIL_PAGE, {
              groupId: selectedGroupId,
            })
          );
        },
        title: 'Group berhasil ditambahkan',
        type: 'success',
      });
    },
  });

  // Use similarGroupList from validation response if available, otherwise fetch from API
  const { data: groupData, isFetching: isLoading } = useQuery({
    enabled: !!groupName && groupName.length > 0 && !similarGroupList,
    queryFn: async () => {
      const payload = {
        filter: {
          ...filter?.filter,
          groupType: filter?.filter?.groupType?.join('|'),
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

      // Use API to get group list
      const response = await API('maintenanceGroup.group.list', {
        data: payload,
      });
      return response.data?.data;
    },
    queryKey: ['group-recommended-maintenance', {
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

  // Use similarGroupList from validation if available, otherwise use API data
  const groupDataFinal = similarGroupList ? { contents: similarGroupList } : groupData;
  const isLoadingFinal = isLoading;

  // Apply pagination to similarGroupList if available
  const paginatedSimilarGroups = similarGroupList
    ? similarGroupList.slice((page - 1) * pageSize, page * pageSize)
    : null;

  const listMasterGroup = (similarGroupList ? paginatedSimilarGroups : groupDataFinal?.contents)?.map((data) => ({
    ...data,
    groupType: data.groupTypeLabel ?? data.groupType ?? '-',
    id: data.id ?? '-',
    name: data.name ?? '-',
    sectorLabel: data.sectorLabel ?? data.sector ?? '-',
  }));

  // Calculate total page based on actual data length and page size
  const totalPage = similarGroupList
    ? Math.ceil(similarGroupList.length / pageSize)
    : (groupDataFinal as any)?.page?.totalPage ?? 1;

  const hasExactMatch = listMasterGroup?.some((group) =>
    group.name.toLowerCase() === groupName?.toLowerCase()
  ) ?? false;

  const hasSimilarNames = listMasterGroup && listMasterGroup.length > 0;
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
        groupCode: element,
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
        title: 'Terdapat Nama Group yang sama pada pengajuan pembuatan Group yang lain',
        type: 'error',
      });
    } else {
      // Close the recommended group modal first
      closeNiceModal(modalId);

      // Call the onCreateNew callback which will trigger the save function
      if (onCreateNew) {
        onCreateNew();
      }
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
      isDisabled: () => true,
      isSelected: (data) => selected.includes(data.id),
      key: 'checkbox',
      onSelectChange: (data) => {
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
    isLoading: isLoadingFinal,
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
