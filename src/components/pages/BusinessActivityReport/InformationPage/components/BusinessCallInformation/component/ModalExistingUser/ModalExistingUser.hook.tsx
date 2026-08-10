import { useState } from 'react';


import { MODAL } from '@/configs/constants/modalId';
import { businessActivityReport } from '@/configs/constants/pathname';
import { TypeModule, TypeProcess } from '@/enums/Module';
import { replacePath } from '@/helpers/navigation';
import showNiceModalV2 from '@/helpers/showNiceModalV2';
import closeNiceModal from '@/hooks/useCloseNiceModal';
import useCustomRouter from '@/hooks/useCustomRouter';

import useCreateNewDebtor from '../../../../hooks/useCreateNewDebtor';
import { modal } from '../../../../Information.constant';

import type { ModalExistingUserProps } from './ModalExistingUser.constant';
import type { TableHeader } from '@/components/shared/Table/Table.types';


export const useModalExistingUser = (props: ModalExistingUserProps) => {
  const [selected, setSelected] = useState(null);
  const route = useCustomRouter();

  const { hasDuplicate, payload } = props;

  const { mutate: saveDebtorDetail } = useCreateNewDebtor({
    onError() {
      showNiceModalV2({
        type: 'error',
      });
    },
    onSuccess(data) {
      showNiceModalV2({
        onClose: () => {
          closeNiceModal(modal.EXISTING_USER);
          route.push(
            replacePath(businessActivityReport.INFORMATION, {
              processId: data.data.content.bucketProcessId,
            }));
        }, type: 'success',
      });
    },
  });


  const tableHeader: TableHeader[] = [
    {
      isDisabled: () => false,

      isSelected: (data) => selected?.debtorId === data.debtorId,

      key: 'checkbox',

      onSelectChange: (data) => {
        // If the item is already selected, deselect it
        if (selected?.debtorId === data.debtorId) {
          setSelected(null); // Deselect by setting it to null
        } else {
          // Select the new item
          setSelected(data); // Set the selected data directly, no array
        }
      },

      sx: { minWidth: '4%' },

      type: 'checkbox',
    },
    {
      key: 'index',
      label: 'No',
      sx: { minWidth: '4%' },
      type: 'index',
    },
    {
      key: 'debtorId',
      label: 'Customer ID',
      sx: { minWidth: '10vw' },
    },
    {
      key: 'cif',
      label: 'CIF',
      sx: { minWidth: '10vw' },
    },
    {
      key: 'debtorName',
      label: 'Nama Customer',
      sx: { minWidth: '10vw' },
    },
    {
      key: 'npwp',
      label: 'NPWP',
      sx: { minWidth: '10vw' },
    },
    {
      key: 'divisionName',
      label: 'Divisi',
      sx: { minWidth: '10vw' },
    },
    {
      key: 'gamName',
      label: 'General Account Manager',
      sx: { minWidth: '10vw' },
    },
  ];


  const handleCreateNewDebiturAndBar = () => {
    if (hasDuplicate) {
      showNiceModalV2({
        cancelText: 'Cancel', title: 'Maaf, anda tidak dapat menambahkan Customer dengan nama yang sudah ada',
        type: 'error',
      });
    } else {
      showNiceModalV2({
        cancelText: 'Tidak', onSubmit: () => {
          saveDebtorDetail({
            payload,
            type: 'new',
          });
        },
        submitText: 'Ya',
        title: 'Terdapat Nama Customer yang serupa pada rekomendasi, yakin ingin menambahkan?',
        type: 'warning',
      });
    }
  };

  const handleCreateBarWithExisting = () => {
    saveDebtorDetail({
      payload: {
        comment: 'Create New BAR',
        debtorId: selected.debtorId,
        module: TypeModule.BAR,
        process: TypeProcess.BAR,
      },
      type: 'existing',
    });
  };
  return {
    handleCreateBarWithExisting,
    handleCreateNewDebiturAndBar,
    route,
    selected,
    tableHeader,
  };
};
