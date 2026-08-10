'use client';
import React from 'react';

import { create, useModal } from '@ebay/nice-modal-react';
import { useTheme } from '@mui/material';
import { Controller, useFieldArray, useForm } from 'react-hook-form';

import closeNiceModal from '@/hooks/useCloseNiceModal';

import Button from '@/components/shared/Button';
import IconButton from '@/components/shared/IconButton';
import Input from '@/components/shared/Input';
import RowWrapper from '@/components/shared/RowWrapper';
import SectionModal from '@/components/shared/SmiModal/SectionModal';
import Table from '@/components/shared/Table';
import TableAddFooter from '@/components/shared/TableAddFooter';

import { modal } from '../../DigitmalMemoDraftTable.contants';

import { useDigitalMemoDraftModal } from './DigitalMemoDraftModal.hook';


const DigitalMemoDraftModal = create(() => {
  const modalId = modal.DIGITAL_MEMO_DRAFT;
  const { visible } = useModal(modalId);
  const theme = useTheme();

  const {
    handleOnSave,
    documentTypeDropdownList,
    saveAttachmentLoading,
  } = useDigitalMemoDraftModal();

  const { control, watch, handleSubmit } = useForm({
    mode: 'onTouched',
  });

  const { fields, append, remove, update } = useFieldArray({
    control,
    name: 'digitalMemo',
  });

  const fieldState = watch('digitalMemo');

  const isEmpty = fields.length === 0
    || fieldState.every((item: { documentType: string }) => !item.documentType)
    || fieldState.some((item: { documentType: string }) => !item.documentType);

  return (
    <SectionModal
      title="Pilih Digital Memo"
      containerSx={{ minWidth: '65vw' }}
      isOpen={visible}
      customFooter={() => null}
    >
      <Table
        tableHeader={[
          {
            key: 'index',
            label: 'No',
            sx: {
              width: '40px',
            },
            type: 'index',
          },
          {
            key: 'documentType',
            label: 'Jenis Dokumen',
            render: (_, index) => (
              <Controller
                control={control}
                name={`digitalMemo.${index}.documentType`}
                render={({
                  field: { ref, onChange, ...field },
                  fieldState: { invalid, error, isTouched },
                }) => (
                  <Input
                    {...field}
                    inputRef={ref}
                    type="dropdown"
                    placeholder="Pilih Jenis Dokumen"
                    containerSx={{ flex: 1 }}
                    onChange={(val) => {
                      onChange(val);
                      update(index, { documentType: val });
                    }}
                    dropdownList={documentTypeDropdownList || []}
                    error={isTouched && invalid}
                    helperText={isTouched && error ? error.message : ''}
                  />
                )}
              />
            ),
          },
          {
            key: 'action',
            label: 'Action',
            options: () => [
              {
                iconName: 'delete',
                onClick: (_, index: number) => {
                  remove(index);
                },
              }
            ],
            sx: {
              width: '50px',
            },
            type: 'action',
          }
        ]}
        tableData={fields || []}
        footer={
          <RowWrapper sx={{ justifyContent: 'end', mb: 3 }}>
            <TableAddFooter onClick={() => !saveAttachmentLoading && append({ documentType: '' })} />
          </RowWrapper>
        }
      />
      <RowWrapper sx={{ gap: 2, justifyContent: 'end', mt: 3 }}>
        <Button variant="outlined" onClick={() => closeNiceModal(modalId)}>
          Cancel
        </Button>
        <Button
          isLoading={saveAttachmentLoading}
          onClick={handleSubmit(handleOnSave)}
          disabled={isEmpty}
        >
          Save
        </Button>
      </RowWrapper>
    </SectionModal>
  );
});

export default DigitalMemoDraftModal;
