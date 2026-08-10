import { useEffect, useState } from 'react';

import { useModal } from '@ebay/nice-modal-react';

import { MODAL } from '@/configs/constants/modalId';
import { pipeline } from '@/configs/constants/pathname';
import { ActivityType } from '@/enums/Activity';
import { TypeModule, TypeProcess } from '@/enums/Module';
import { replacePath } from '@/helpers/navigation';
import showNiceModal from '@/helpers/showNiceModal';
import useGetParameterList from '@/hooks/services/useGetParameterList';
import closeNiceModal from '@/hooks/useCloseNiceModal';
import useCustomRouter from '@/hooks/useCustomRouter';
import useIdentity from '@/hooks/useIdentity';
import useRecordLog from '@/hooks/useRecordLog';
import useViewOnly from '@/hooks/useViewOnly';

import useGetDebtorGroupLists from '../../../hooks/Group/useGetDebtorGroupList';
import useGetUnmappedGroupList from '../../../hooks/Group/useGetUnmappedGroupList';
import useAddGroupMember from '../../../hooks/Member/useAddGroupMember';
import { FILTER_CONTENT_LIST, TABLE_HEADER_LIST_PAGE } from '../../List.constants';

import type { TableHeader } from '@/components/shared/Table/Table.types';


export const useModalExistingGroup = () => {
  const [selected, setSelected] = useState([]);
  const { recordActivity } = useRecordLog();
  const { debtorId, processId } = useIdentity();
  const router = useCustomRouter();
  const modalId = MODAL.PIPELINE.GROUP.EXISTING_GROUP;
  const { visible } = useModal(modalId);

  const [filter, setFilter] = useState(null);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

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

  // Get group data
  const { data, isFetching: isLoading } = useGetUnmappedGroupList({
    filter: {
      ...filter?.filter,
      bucketProcessId: processId,
      debtorId,
      groupType: filter?.filter?.groupType?.join('|'),
      module: TypeModule.PIPELINE,
      process: TypeProcess.PIPELINE,
      sector: filter?.filter?.sector?.join('|'),
    },
    page: {
      itemPerPage: pageSize,
      noPage: page,
    },
    searchDetail: filter?.searchDetail ?? null,
    sortList: filter?.sortList ?? null,
  });

  // Record activity when unmapped group list is loaded
  useEffect(() => {
    if (data) {
      recordActivity({
        activity: ActivityType.VIEW,
        bucketProcessId: processId || '',
        changeAfter: '',
        changeBefore: '',
        menuCode: 'pipeline',
        module: TypeModule.PIPELINE,
        process: TypeProcess.PIPELINE,
        remarks: 'view unmapped group list in existing group modal',
      });
    }
  }, [data, page, pageSize, processId, recordActivity]);

  //Save Member Data
  const { isPending: isSaveLoading, mutate: saveMember } = useAddGroupMember({
    onSuccess: () => {
      recordActivity({
        activity: ActivityType.ADD,
        bucketProcessId: processId || '',
        changeAfter: JSON.stringify({
          debtorId,
          groupCodes: selected,
        }),
        changeBefore: '',
        menuCode: 'pipeline',
        module: TypeModule.PIPELINE,
        process: TypeProcess.PIPELINE,
        remarks: 'successfully added debtor to existing group(s)',
      });

      closeNiceModal(modalId);
      showNiceModal('success', 'Data berhasil disimpan');
    },
  });

  const listMasterGroup = data?.contents?.map((data) => ({
    ...data,
    groupType: data.groupTypeLabel ?? '-',
    id: data.id ?? '-',
    name: data.name ?? '-',
    sectorLabel: data.sectorLabel ?? '-',
  }));

  const totalPage = data?.page.totalPage ?? 1;

  // Map debtor data
  useEffect(() => {
    // Reset page to 1
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

    saveMember(res);
  };

  const handleCreateNewGroup = () => {
    router.push(
      replacePath(pipeline.NEW_GROUP_PAGE, {
        debtorId,
        processId,
      })
    );
    closeNiceModal(MODAL.PIPELINE.GROUP.EXISTING_GROUP);
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
        setSelected((prev) => selected.includes(data.id) ? prev.filter((dt) =>
          dt !== data.id) : [...prev, data.id]);
      },
      sx: {
        minWidth: '4vw',
      },
      type: 'checkbox',
    },
    ...TABLE_HEADER_LIST_PAGE,
  ];

  return {
    filter,
    filterContentList,
    filterDropdownList,
    handleAddGroupMember,
    handleCreateNewGroup,
    isLoading,
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
