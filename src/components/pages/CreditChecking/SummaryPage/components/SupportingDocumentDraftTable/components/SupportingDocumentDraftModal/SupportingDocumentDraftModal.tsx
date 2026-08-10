'use client';
import React from 'react';

import { create, useModal } from '@ebay/nice-modal-react';
import { useTheme } from '@mui/material';
import { Controller, useFieldArray, useForm } from 'react-hook-form';

import closeNiceModal from '@/hooks/useCloseNiceModal';

import Button from '@/components/shared/Button';
import Input from '@/components/shared/Input';
import RowWrapper from '@/components/shared/RowWrapper';
import SectionModal from '@/components/shared/SmiModal/SectionModal';
import Table from '@/components/shared/Table';

import { modal } from '../../SupportingDocumentDraftTable.constants';

import { useSupportingDocumentDraftModal } from './SupportingDocumentDraftModal.hook';


const SupportingDocumentDraftModal = create(() => {
  const theme = useTheme();
  const modalId = modal.SUPPORTING_DOCUMENT_DRAFT;
  const { visible } = useModal(modalId);

  const {
    handleOnSave,
    documentTypeDropdownList,
    saveAttachmentLoading,
  } = useSupportingDocumentDraftModal();

  const { control, watch, handleSubmit } = useForm({
    mode: 'onTouched',
  });

  const { fields, append, remove, update } = useFieldArray({
    control,
    name: 'supportingDocument',
  });

  const fieldState = watch('supportingDocument');

  const isEmpty = fields.length === 0
    || fieldState.every((item) => !item.documentType)
    || fieldState.some((item) => !item.documentType);

  return (
    <SectionModal
      title="Pilih Supporting Document"
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
                name={`supportingDocument.${index}.documentType`}
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
                isDisabled: saveAttachmentLoading,
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
            <Button
              variant="outlined"
              startIcon="add-2"
              startIconSx={{ fontSize: theme.spacing(3) }}
              sx={{ height: theme.spacing(6), padding: theme.spacing(1) }}
              onClick={() => !saveAttachmentLoading && append({ documentType: '' })}
            >
              Add New
            </Button>
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

export default SupportingDocumentDraftModal;
