import React from 'react';

import NiceModal, { useModal } from '@ebay/nice-modal-react';
import { yupResolver } from '@hookform/resolvers/yup';
import { useTheme } from '@mui/material';
import { Controller, useForm } from 'react-hook-form';
import * as Yup from 'yup';

import closeNiceModal from '@/hooks/useCloseNiceModal';

import Button from '@/components/shared/Button';
import ColumnWrapper from '@/components/shared/ColumnWrapper';
import Input from '@/components/shared/Input';
import RowWrapper from '@/components/shared/RowWrapper';
import SectionModal from '@/components/shared/SmiModal/SectionModal';

import { modal } from '../../TableSpecialApproval.constants';

import useModalSpecialApproval from './ModalSpecialApproval.hook';

import type { ModalSpecialApprovalProps } from './ModalSpecialApproval.types';


const validationSchema = Yup.object({
  description: Yup.string().nullable(),
  specialNote: Yup.string().nullable(),
  typeSpecialApproval: Yup.string().required('Jenis persetujuan khusus tidak boleh kosong'),
});

const ModalSpecialApproval = NiceModal.create((props: ModalSpecialApprovalProps) => {
  const { initialValues } = props;
  const theme = useTheme();
  const modalId = modal.SPECIAL_APPROVAL;
  const { visible } = useModal(modalId);


  const { control, handleSubmit, watch } = useForm({
    defaultValues: initialValues,
    mode: 'onTouched',
    resolver: yupResolver(validationSchema),
  });

  const {
    isSaveLoading,
    specialApprovalOptions,
    handleOnConfirm,
  } = useModalSpecialApproval(props);


  const isMandatoryEmpty = !watch('typeSpecialApproval');

  return (
    <SectionModal
      title={`${initialValues ? 'Edit' : 'Add New'} Jenis Persetujuan Khusus`}
      isOpen={visible}
      onClose={() => closeNiceModal(modalId)}
      customFooter={() => null}
      containerSx={{ minWidth: '30vw' }}
    >
      <ColumnWrapper sx={{ gap: 3 }}>
        <Controller
          control={control}
          name="typeSpecialApproval"
          render={({ field: { ref, ...field }, fieldState: { invalid, error } }) => (
            <Input
              isMandatory
              {...field}
              inputRef={ref}
              label="Jenis Persetujuan Khusus"
              type="dropdown"
              placeholder="Pilih Jenis Persetujuan Khusus"
              containerSx={{ flex: 1 }}
              dropdownList={specialApprovalOptions}
              error={invalid}
              helperText={error ? error.message : ''}
            />
          )}
        />

        {watch().typeSpecialApproval === 'OTHERS' && (
          <Controller
            control={control}
            name="specialNote"
            render={({ field: { ref, ...field }, fieldState: { invalid, error, isTouched } }) => (
              <Input
                {...field}
                inputRef={ref}
                type="area"
                placeholder="Input Jenis Persetujuan Khusus"
                containerSx={{ flex: 1 }}
                rows={4}
                error={isTouched && invalid}
                helperText={isTouched && error ? error.message : ''}
              />
            )}
          />
        )}

        <Controller
          control={control}
          name="description"
          render={({ field: { ref, ...field }, fieldState: { invalid, error, isTouched } }) => (
            <Input
              {...field}
              inputRef={ref}
              type="area"
              label="Keterangan"
              placeholder="Input Keterangan"
              containerSx={{ flex: 1 }}
              rows={4}
              error={isTouched && invalid}
              helperText={isTouched && error ? error.message : ''}
            />
          )}
        />

        <RowWrapper
          sx={{
            gap: theme.spacing(2),
            justifyContent: 'end',
          }}
        >
          <Button
            variant="outlined"
            onClick={() => closeNiceModal(modalId)}
          >
            Cancel
          </Button>
          <Button
            isLoading={isSaveLoading}
            disabled={isMandatoryEmpty}
            variant="contained"
            onClick={(handleSubmit(handleOnConfirm))}
          >
            Confirm
          </Button>
        </RowWrapper>
      </ColumnWrapper>
    </SectionModal>
  );
});

export default ModalSpecialApproval;
