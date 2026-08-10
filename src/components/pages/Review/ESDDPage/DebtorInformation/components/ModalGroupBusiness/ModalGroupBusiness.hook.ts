import { useState } from 'react';

import { TypeModule, TypeProcess } from '@/enums/Module';
import showNiceModalV2 from '@/helpers/showNiceModalV2';
import closeNiceModal from '@/hooks/useCloseNiceModal';
import useIdentity from '@/hooks/useIdentity';

import { modal } from '../../DebtorInformation.constants';
import useGetBusinessGroup from '../../hooks/useGetBusinessGroup';
import useSaveBusinessGroup from '../../hooks/useSaveBusinessGroup';


const useModalGroupBusiness = () => {
  const { processId } = useIdentity();
  const modalId = modal.GROUP_BUSINESS;

  const [listGroupDebtor, setListGroupDebtor] = useState([]);

  const { data } = useGetBusinessGroup({
    bucketProcessId: processId,
    excludeSelectedGroup: true,
    module: TypeModule.MIP,
    process: TypeProcess.MIP,
  });

  const { isPending: saveBusinessGroupLoading, mutate: saveBusinessGroup } = useSaveBusinessGroup({
    onError: () => {
      showNiceModalV2({ title: 'Terjadi kesalahan, Mohon di coba kembali', type: 'error' });
    },
    onSuccess: () => {
      showNiceModalV2({ title: 'Data berhasil disimpan', type: 'success' });
      closeNiceModal(modalId);
    },
  });


  const handleEditGroup = (val: any, index: any) => {
    const data = groupBusinessDropdownList.find((data) => data.value === val);
    const listGroup = {
      groupId: data.value,
      groupName: data.label,
      isChecked: false,
    };

    setListGroupDebtor((prevList) => {
      const newState = [...prevList];
      newState[index] = { ...newState[index], ...listGroup };
      return newState;
    });

  };

  const handleAddGroup = () => {
    setListGroupDebtor((prev) => [...prev, {
      groupId: 0,
      groupName: '',
      isChecked: false,
    }]);
  };

  const handleDeleteDebtor = (id: number) => {
    setListGroupDebtor((prevVal) => prevVal.filter((_, index) => index !== id));
  };

  const groupBusinessDropdownList = data;

  const handleOnSave = () => {

    let groups = listGroupDebtor.map((data) => data.groupId);
    saveBusinessGroup({
      bucketProcessId: processId,
      groups,
    });

  };

  return {
    groupBusinessDropdownList,
    handleAddGroup,
    handleDeleteDebtor,
    handleEditGroup,
    handleOnSave,
    listGroupDebtor,
    saveBusinessGroupLoading,
  };
};

export default useModalGroupBusiness;
