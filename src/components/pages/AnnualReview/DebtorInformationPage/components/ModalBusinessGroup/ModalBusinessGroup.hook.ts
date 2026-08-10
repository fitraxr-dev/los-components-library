import { useRef } from 'react';

import { useFieldArray, useForm } from 'react-hook-form';

import { TypeModule } from '@/enums/Module';
import showNiceModalV2 from '@/helpers/showNiceModalV2';
import useGetBusinessGroup from '@/hooks/services/bucket/debtor/useGetBusinessGroup';
import useSaveBusinessGroup from '@/hooks/services/bucket/debtor/useSaveBusinessGroup';
import useApp from '@/hooks/useApp';
import closeNiceModal from '@/hooks/useCloseNiceModal';
import useIdentity from '@/hooks/useIdentity';


import { useAnnualReviewContext } from '@/components/layouts/AnnualReviewLayout/AnnualReview.context';

import { modal } from '../../DebtorInformation.constants';


const useModalBusinessGroup = () => {
  const { processId, debtorId } = useIdentity();
  const modalId = modal.GROUP_BUSINESS;
  const selectedValueByIndex = useRef<{ [key: number]: number }>({});
  const { typeProcess } = useAnnualReviewContext();


  const { data, isLoading } = useGetBusinessGroup({
    bucketProcessId: processId,
    debtorId: debtorId,
    excludeSelectedGroup: true,
    module: TypeModule.ANNUAL_REVIEW,
    process: typeProcess,
  });

  const groupBusinessDropdownList = data;


  const { control } = useForm({
    defaultValues: {
      business_group:
        [{
          groupId: 0,
        }],
    },
    mode: 'onTouched',
  });

  const { fields, append, remove, update } = useFieldArray({
    control,
    name: 'business_group',
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


  const handleAddGroup = () => {
    append({
      groupId: 0,
    });
  };

  const handleDeleteDebtor = (id: number) => {
    remove(id);
  };

  const handleOnSave = () => {
    let groups = fields.map((data) => data.groupId);

    saveBusinessGroup({
      bucketProcessId: processId,
      groups,
    });
  };

  const getDropdownList = (data) => {
    if (!isLoading && groupBusinessDropdownList) {
      const result = groupBusinessDropdownList.map((item) => {
        const { label, value } = item;
        return {
          id: value,
          label: label,
        };
      });

      return result;
    }
  };

  const bisnisGroupDropdownList = getDropdownList(groupBusinessDropdownList);

  const getDropdownListFiltered = (row, index) => {
    const documentListBlacklistFiltered = bisnisGroupDropdownList;
    if (!!bisnisGroupDropdownList) {
      const documentTypeDropdownListFiltered = documentListBlacklistFiltered.filter(
        (obj) => {
          const matchedObject = Object.values(selectedValueByIndex.current).find((val) => val === obj.id);
          if (!!matchedObject) {
            const matchedIdx =
            Object.keys(selectedValueByIndex.current).find((key) =>
              selectedValueByIndex.current[key] === matchedObject);
            if (Number(matchedIdx) === index) return true;
            else return false;
          }
          return true;
        }
      );

      return documentTypeDropdownListFiltered;
    }
    return [];
  };

  return {
    append,
    bisnisGroupDropdownList,
    control,
    fields,
    getDropdownListFiltered,
    groupBusinessDropdownList,
    handleAddGroup,
    handleDeleteDebtor,
    handleOnSave,
    remove,
    saveBusinessGroupLoading,
    selectedValueByIndex,
    update,
  };
};

export default useModalBusinessGroup;
