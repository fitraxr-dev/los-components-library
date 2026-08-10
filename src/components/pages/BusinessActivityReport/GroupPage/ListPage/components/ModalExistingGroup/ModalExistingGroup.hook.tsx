import { useEffect, useState } from 'react';

import { useModal } from '@ebay/nice-modal-react';

import { MODAL } from '@/configs/constants/modalId';
import { businessActivityReport, pipeline } from '@/configs/constants/pathname';
import { TypeModule, TypeProcess } from '@/enums/Module';
import { replacePath } from '@/helpers/navigation';
import showNiceModal from '@/helpers/showNiceModal';
import useGetParameterList from '@/hooks/services/useGetParameterList';
import closeNiceModal from '@/hooks/useCloseNiceModal';
import useCustomRouter from '@/hooks/useCustomRouter';
import useIdentity from '@/hooks/useIdentity';


import useGetUnmappedGroupList from '../../../hooks/Group/useGetUnmappedGroupList';
import useAddMemberGroup from '../../../hooks/Member/useAddMemberGroup';
import { modal, TABLE_HEADER_LIST_PAGE } from '../../List.constants';

import type { TableHeader } from '@/components/shared/Table/Table.types';


export const useModalExistingGroup = () => {
  const [selected, setSelected] = useState([]);
  const { debtorId, processId } = useIdentity();
  const router = useCustomRouter();
  const modalId = modal.NEW_GROUP;
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
      //bucketProcessId: processId,
      debtorId,
      groupType: filter?.filter?.groupType?.join('|'),
      module: TypeModule.BAR,
      process: TypeProcess.BAR,
      sector: filter?.filter?.sector?.join('|'),
    },
    page: {
      itemPerPage: pageSize,
      noPage: page,
    },
    searchDetail: filter?.searchDetail ?? null,
    sortList: filter?.sortList ?? null,
  });

  const { isPending: isSaveLoading, mutate: saveMember } = useAddMemberGroup({
    onSuccess: () => {
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
        module: TypeModule.BAR,
        process: TypeProcess.BAR,
        remark: '',
        sector: '',
      });
    });

    saveMember(res);
  };

  const handleCreateNewGroup = () => {
    router.push(
      replacePath(businessActivityReport.NEW_GROUP_PAGE, {
        debtorId,
        processId,
      })
    );
    closeNiceModal(modal.NEW_GROUP);
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
