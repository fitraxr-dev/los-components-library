import { useMemo } from 'react';

import NiceModal from '@ebay/nice-modal-react';
import { useTheme } from '@mui/material';
import { useFieldArray } from 'react-hook-form';


import { modal } from '../ModalBankInformation/ModalBankInformation.constants';

import { TABLE_HEADER_BANK_INFORMATION } from './BankInformationTable.constants';

import type { BankInformationTableProps } from './BankInformationTable.types';
import type { ModalBankInformationProps } from '../ModalBankInformation/ModalBankInformation.types';
import type { TableHeader } from '@/components/shared/TableV2/Table.types';


const useBankInformationTable = ({ isReadOnly, methods }: BankInformationTableProps) => {
  const theme = useTheme();
  const { control, watch, formState: { isLoading } } = methods;

  const {
    fields: bankFields,
    append: bankAppend,
    remove: bankRemove,
    update: bankUpdate,
  } = useFieldArray({
    control: control,
    keyName: 'id',
    name: 'bankInformationList',
  });

  const handleAddItem = () => {
    const createProps: ModalBankInformationProps = {
      addData(bankName, bankType, amount) {
        bankAppend({
          amount: amount,
          bankInformationId: null,
          bankName: bankName,
          bankType: bankType,
          isEditable: true,
        });
      },
      fieldData: watch().bankInformationList,
      title: 'Add Bank Information',
    };

    NiceModal.show(modal.MODAL_BANK_INFORMATION, createProps);
  };

  const handleDeleteItem = (index: number) => {
    bankRemove(index);
  };

  const handeEditItem = (index: number, bankName: string, bankType: string, amount: number) => {
    const editProps: ModalBankInformationProps = {
      addData(bankName, bankType, amount) {
        bankUpdate(index, { amount: amount, bankName: bankName, bankType: bankType });
      },
      fieldData: watch().bankInformationList,
      initialAmount: amount,
      initialBankName: bankName,
      initialBankType: bankType,
      title: 'Edit Bank Information',
    };
    NiceModal.show(modal.MODAL_BANK_INFORMATION, editProps);
  };

  const tableHeaderBankInformation: Array<TableHeader> = useMemo(() => {
    return [
      ...TABLE_HEADER_BANK_INFORMATION,
      {
        key: 'action',
        label: !isReadOnly ? 'Action' : '',
        options: [
          {
            iconName: 'edit',
            isHidden: isReadOnly,
            onClick: (data, index) => {handeEditItem(index, data?.bankName, data?.bankType, data?.amount);},
          },
          {
            iconName: 'delete',
            isHidden: isReadOnly,
            onClick: (_, index) => {handleDeleteItem(index);},
          }
        ],
        sx: {
          width: '2vw',
        },
        type: 'action',
      }
    ];

  }, []);

  const totalAmount = useMemo(() => {
    return bankFields.reduce((acc, curr: any) => acc + Number(curr.amount || 0), 0);
  }, [bankFields]);

  return {
    bankFields,
    handleAddItem,
    isLoading,
    tableHeaderBankInformation,
    theme,
    totalAmount,
  };
};
export default useBankInformationTable;
