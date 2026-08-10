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

import useGetUnmappedGroupList from '../../../../../GroupPage/hooks/Group/useGetUnmappedGroupList';
import useAddGroupMember from '../../../../../GroupPage/hooks/Member/useAddGroupMember';

import type { UseModalRecommendedGroupProps } from './ModalRecommendedGroup.types';
import type { TableHeader } from '@/components/shared/Table/Table.types';


const modal = {
  RECOMMENDED_GROUP: 'RECOMMENDED_GROUP',
};

const getSearchValue = (groupName: string) => {
  if (!groupName) return '';

  const basePattern = groupName.match(/^([a-zA-Z]+)/);
  if (basePattern && basePattern[1]) {
    const baseName = basePattern[1];
    if (baseName.length < groupName.length * 0.7) {
      return baseName;
    }
  }

  return groupName;
};

export const useModalRecommendedGroup = ({ groupName, onSelectGroup, onCreateNew }: UseModalRecommendedGroupProps) => {
  const [selected, setSelected] = useState([]);
  const { debtorId, processId } = useIdentity();
  const { recordActivity } = useRecordLog();
  const router = useCustomRouter();
  const modalId = modal.RECOMMENDED_GROUP;
  const { visible } = useModal(modalId);

  const [filter, setFilter] = useState(null);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [lastSavedPayload, setLastSavedPayload] = useState<any>(null);

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

      // Record activity for adding debtor to existing group
      recordActivity({
        activity: ActivityType.ADD,
        bucketProcessId: Array.isArray(processId) ? processId[0] : processId || '',
        changeAfter: JSON.stringify({
          debtorId: lastSavedPayload?.[0]?.debtorId,
          groupCode: lastSavedPayload?.[0]?.groupCode,
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

  // Get similar groups using useQuery with conditional enabled
  const { data: groupData, isFetching: isLoading } = useQuery({
    enabled: !!groupName && groupName.length > 0,
    queryFn: async () => {
      const api = new (await import('@/services/openapi/bucket-service')).GroupControllerApi();
      const res = await api.listUnmappedGroupPipeline({
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
          value: getSearchValue(groupName),
        },
        sortList: filter?.sortList ?? null,
      });
      return res.data.data;
    },
    queryKey: ['group-recommended', {
      bucketProcessId: Array.isArray(processId) ? processId[0] : processId,
      debtorId: Array.isArray(debtorId) ? debtorId[0] : debtorId,
      filter,
      groupName,
      page,
      pageSize,
    }],
    staleTime: 60000,
  });

  const listMasterGroup = groupData?.contents?.map((data) => ({
    ...data,
    groupType: data.groupTypeLabel ?? data.groupType ?? '-',
    id: data.id ?? '-',
    name: data.name ?? '-',
    sectorLabel: data.sectorLabel ?? data.sector ?? '-',
  }));

  const totalPage = groupData?.page?.totalPage ?? 1;

  // Record activity when recommended group list is loaded
  useEffect(() => {
    if (groupData && visible) {
      recordActivity({
        activity: ActivityType.VIEW,
        bucketProcessId: Array.isArray(processId) ? processId[0] : processId || '',
        changeAfter: '',
        changeBefore: '',
        menuCode: 'pipeline',
        module: TypeModule.PIPELINE,
        process: TypeProcess.PIPELINE,
        remarks: 'view recommended group list in modal',
      });
    }
  }, [groupData, visible, processId, recordActivity]);

  useEffect(() => {
    setPage(1);
  }, [filter]);

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

    setLastSavedPayload(res);
    saveMember(res);
  };

  const handleCreateNewGroup = () => {
    NiceModal.show(MODAL.GLOBAL.WARNING, {
      onClose: () => {},
      title: 'Tidak bisa menambah Group yang sama',
    });
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
    setPage,
    setPageSize,
    tableHeader,
    totalPage,
    visible,
  };
};
