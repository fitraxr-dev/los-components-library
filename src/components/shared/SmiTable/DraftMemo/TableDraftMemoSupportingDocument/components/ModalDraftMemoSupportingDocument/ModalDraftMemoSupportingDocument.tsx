'use client';

import { create, useModal } from '@ebay/nice-modal-react';
import { Controller, useFieldArray, useForm } from 'react-hook-form';

import closeNiceModal from '@/hooks/useCloseNiceModal';

import Autocomplete from '@/components/shared/Autocomplete';
import Button from '@/components/shared/Button';
import RowWrapper from '@/components/shared/RowWrapper';
import SectionModal from '@/components/shared/SmiModal/SectionModal';
import Table from '@/components/shared/Table';
import TableFooter from '@/components/shared/TableFooter';

import { modal } from '../../TableDraftMemoSupportingDocument.constants';

import { useModalDraftMemoSupportingDocument } from './ModalDraftMemoSupportingDocument.hook';

import type { ModalDraftMemoSupportingDocumentProps } from './ModalDraftMemoSupportingDocument.types';


const ModalDraftMemoSupportingDocument = create((props: ModalDraftMemoSupportingDocumentProps) => {
  const modalId = modal.SUPPORTING_DOCUMENT_DRAFT_MODAL;
  const { visible } = useModal(modalId);

  const {
    handleOnSave,
    documentTypeDropdownList,
    saveAttachmentLoading,
    data,
    getDropdownListFiltered,
    selectedValueByIndex,
    isLoading,
  } = useModalDraftMemoSupportingDocument(props);

  const { control, watch, handleSubmit } = useForm({
    defaultValues: {
      supportingDocument: [{
        documentType: '',
      }],
    },
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
            render: (row, index) => (
              <Controller
                control={control}
                name={`supportingDocument.${index}.documentType`}
                render={({
                  field: { ref, onChange, value, ...field },
                  fieldState: { invalid, error, isTouched },
                }) => (
                  <Autocomplete
                    {...field}
                    placeholder="Pilih Jenis Dokumen"
                    label=""
                    value={documentTypeDropdownList?.find((res) => res?.id === Number(value))}
                    dropdownList={getDropdownListFiltered(row, index) ?? []}
                    onChange={(val) => {
                      onChange(val);
                      update(index, { documentType: String(val?.id) });
                      selectedValueByIndex.current = {
                        ...selectedValueByIndex.current,
                        [index]: Number(val?.id),
                      };
                    }}
                    onInputChange={() => null}
                    error={isTouched && invalid}
                    helperText={isTouched && error ? error.message : ''}
                    isLoading={isLoading}
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
                  const biggerKeys = Object.keys(selectedValueByIndex.current)
                    .filter((num) => Number(num) > index)
                    .reduce((prev, key) => (prev[key] = selectedValueByIndex.current[key], prev), {});
                  if (Object.keys(biggerKeys).length > 0) {
                    const smallKeys = Object.keys(selectedValueByIndex.current)
                      .filter((num) => Number(num) < index)
                      .reduce((prev, key) => (prev[key] = selectedValueByIndex.current[key], prev), {});
                    const minusOneKeys = Object.keys(biggerKeys)
                      .reduce((prev, key) => (prev[Number(key) - 1] = biggerKeys[key], prev), {});
                    selectedValueByIndex.current = {
                      ...smallKeys,
                      ...minusOneKeys,
                    };
                  } else {
                    selectedValueByIndex.current = Object.keys(selectedValueByIndex.current)
                      .filter((num) => Number(num) !== index)
                      .reduce((prev, key) => (prev[key] = selectedValueByIndex.current[key], prev), {});
                  }
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
        footer={<TableFooter onClick={() => { !saveAttachmentLoading && append({ documentType: '' }); }} />}
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

export default ModalDraftMemoSupportingDocument;
