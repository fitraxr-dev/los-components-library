'use client';

import React from 'react';

import NiceModal, { useModal } from '@ebay/nice-modal-react';
import { yupResolver } from '@hookform/resolvers/yup';
import { Controller, useForm } from 'react-hook-form';

import closeNiceModal from '@/hooks/useCloseNiceModal';

import Button from '@/components/shared/Button';
import ColumnWrapper from '@/components/shared/ColumnWrapper';
import Input from '@/components/shared/Input';
import { fixLeadingZero } from '@/components/shared/Input/components/Number/utils';
import Loader from '@/components/shared/Loader';
import RowWrapper from '@/components/shared/RowWrapper';
import SectionModal from '@/components/shared/SmiModal/SectionModal';
import TextStyle from '@/components/shared/TextStyle';

import { MODAL } from '../../TabProcess.constant';

import useEditProcessSLAModal from './EditProcessSLAModal.hook';
import { EditProcessSLAModalSchema } from './EditProcessSLAModal.schema';


interface EditProcessSLAModelProps {
  id: string;
}

const EditProcessSLAModal = NiceModal.create((props: EditProcessSLAModelProps) => {
  const modalId = MODAL.EDIT_PROCESS_SLA_MODAL;
  const modal = useModal(MODAL.EDIT_PROCESS_SLA_MODAL);


  const form = useForm({
    defaultValues: {
      groupDivision: '',
      isActive: true,
      process: '',
      slaDeadline: 0 as any,
      stage: '',
    },
    mode: 'onChange',
    resolver: yupResolver(EditProcessSLAModalSchema),
  });

  const {
    defaultData,
    handleOnSave,
    isLoading,
    isAutoSaveFetching,
  } = useEditProcessSLAModal({ id: props.id }, form);

  React.useEffect(() => {
    if (defaultData) {
      form.reset({
        ...defaultData,
        process: defaultData?.processLabel,
      });
    }
  }, [defaultData, form]);

  return (
    <SectionModal
      title="Edit Master SLA"
      isOpen={modal.visible}
      customFooter={() => null}
      onClose={() => closeNiceModal(modalId)}
      containerSx={{
        minWidth: '52vw',
      }}
    >
      <Loader isLoading={isLoading} />

      <ColumnWrapper gap={3}>
        <Controller
          control={form.control}
          name="process"
          render={({ field }) => (
            <Input
              {...field}
              label="Process"
              type="text"
              placeholder="Input Process"
              isMandatory
              disabled
            />
          )}
        />
        <Controller
          control={form.control}
          name="groupDivision"
          render={({ field }) => (
            <Input
              {...field}
              label="Group Division"
              type="text"
              placeholder="Input Group Division"
              isMandatory
              disabled
            />
          )}
        />
        <Controller
          control={form.control}
          name="stage"
          render={({ field }) => (
            <Input
              {...field}
              label="Stage"
              placeholder="Input Stage"
              type="text"
              isMandatory
              disabled
            />
          )}
        />
        <RowWrapper alignItems="center" gap={3}>
          <Controller
            control={form.control}
            name="slaDeadline"
            render={({ field, fieldState }) => (
              <Input
                {...field}
                label="SLA Deadline"
                type="number"
                placeholder="Input SLA Deadline"
                isMandatory
                error={!!fieldState.error}
                helperText={fieldState.error?.message}
                onChange={(e) => {
                  const val = e.currentTarget.value;
                  const next = val ? fixLeadingZero(val) : '';
                  field.onChange(next);
                }}
                containerSx={{ '.MuiTextField-root': { maxWidth: '150px' }, flex: 1 }}
                rightComponent={<TextStyle weight={500}>Working Days</TextStyle>}
              />
            )}
          />
          <Controller
            control={form.control}
            name="isActive"
            render={({ field }) => (
              <Input
                label="Active"
                type="radio"
                radioList={[
                  {
                    label: 'Ya',
                    value: true,
                  },
                  {
                    label: 'Tidak',
                    value: false,
                  }
                ]}
                isMandatory
                containerSx={{ flex: 1 }}
                {...field}
              />
            )}
          />
        </RowWrapper>
      </ColumnWrapper>

      <RowWrapper mt={4} gap={2} alignItems="center" justifyContent="end">
        <Button
          variant="outlined"
          onClick={() => closeNiceModal(modalId)}
        >
          Close
        </Button>
        <Button
          onClick={form.handleSubmit(handleOnSave)}
          disabled={isAutoSaveFetching}
        >
          {isAutoSaveFetching ? 'Auto Saving...' : 'Save'}
        </Button>
      </RowWrapper>
    </SectionModal>
  );
});

export default EditProcessSLAModal;
