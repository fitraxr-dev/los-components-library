import { useState } from 'react';

import { businessActivityReport } from '@/configs/constants/pathname';
import { TypeModule, TypeProcess } from '@/enums/Module';
import { replacePath } from '@/helpers/navigation';
import showNiceModalV2 from '@/helpers/showNiceModalV2';
import closeNiceModal from '@/hooks/useCloseNiceModal';
import useCustomRouter from '@/hooks/useCustomRouter';

import useGetUnmappedGroupList from '../../../hooks/Group/useGetUnmappedGroupList';
import useSaveDebitorGroupV2 from '../../../hooks/Group/useSaveDebtorGroupV2';
import useValidateGroupName from '../../../hooks/Group/useValidateGroupName';
import useAddMemberGroup from '../../../hooks/Member/useAddMemberGroup';
import { TABLE_HEADER_LIST_PAGE } from '../../../ListPage/List.constants';

import { modal } from './ModalExistingGroup.constant';

import type { ModalExistingGroupProps } from './ModalExistingGroup.type';
import type { TableHeader } from '@/components/shared/Table/Table.types';
import type { BaseResponseGenericSingleDtoDebtorGroupDto } from '@/services/openapi/master-service';


export const useModalExistingGroup = (props: ModalExistingGroupProps) => {
  const [selected, setSelected] = useState([]);
  const route = useCustomRouter();
  const modalId = modal.EXISTING_GROUP;

  const { hasDuplicate, payload } = props;
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  //Save Customer Data
  const { mutate: saveDebitur } = useSaveDebitorGroupV2({
    onError: (data) => {
      const errorMessage = data.response.data.errorDetail;
      showNiceModalV2({ title: errorMessage, type: 'error' });
    },
    onSuccess: (data: BaseResponseGenericSingleDtoDebtorGroupDto) =>
      showNiceModalV2({
        onClose: () => {
          route.replace(`detail/${data.data.content.id}`);
        }, title: 'Group Berhasil terbuat', type: 'success',
      }),
  });

  // Get group data
  const { data, isFetching: isLoading } = useGetUnmappedGroupList({
    filter: {
      //bucketProcessId: payload.bucketProcessId,
      debtorId: payload.debtorId,
      module: TypeModule.BAR,
      process: TypeProcess.BAR,
    },
    page: {
      itemPerPage: pageSize,
      noPage: page,
    },
    searchDetail: payload.name ? {
      key: 'name',
      value: payload.name,
    } : null,
    sortList: {
      columnName: 'id',
      sortType: 'asc',
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

  const { mutate: saveMember } = useAddMemberGroup({
    onSuccess: () => {
      showNiceModalV2({
        onClose: () => {},
        title: 'Data berhasil disimpan',
        type: 'success',
      });
    },
  });


  const tableHeader: TableHeader[] = [
    {
      isDisabled: () => false,

      isSelected: (data) => selected.includes(data.id),

      key: 'checkbox',

      onSelectChange: (data) => {
        setSelected((prev) => selected.includes(data.id) ? prev.filter((dt) =>
          dt !== data.id) : [...prev, data.id]);
      },

      sx: { minWidth: '4%' },

      type: 'checkbox',
    },
    ...TABLE_HEADER_LIST_PAGE,
  ];


  const handleCreateNewGroup = () => {
    if (hasDuplicate) {
      showNiceModalV2({
        cancelText: 'Cancel',
        title: 'Maaf, anda tidak dapat menambahkan Group dengan nama yang sudah ada',
        type: 'error',
      });
    } else {
      showNiceModalV2({
        cancelText: 'Tidak',
        onSubmit: () => {
          saveDebitur(payload);
        },
        submitText: 'Ya',
        title: 'Terdapat Nama Customer yang serupa pada rekomendasi, yakin ingin menambahkan?',
        type: 'warning',
      });
    }
  };

  const handleCreateBarWithExisting = () => {
    let req = [];
    selected.forEach((element) => {
      req.push({
        //bucketProcessId: payload.bucketProcessId,
        debtorId: payload.debtorId,
        groupCode: element,
        module: TypeModule.BAR,
        process: TypeProcess.BAR,
        remark: '',
        sector: '',
      });
    });

    closeNiceModal(modalId);
    saveMember(req);
    route.back();
  };
  return {
    handleCreateBarWithExisting,
    handleCreateNewGroup,
    isLoading,
    listMasterGroup,
    page,
    pageSize,
    route,
    selected,
    setPage,
    setPageSize,
    tableHeader,
    totalPage,
  };
};
